require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  const compact = key.replace(/\s+/g, '');
  const match = compact.match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (match) {
    const lines = match[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function cleanRut(value) {
  return String(value || '').replace(/[.\s-]/g, '').toUpperCase();
}

function htmlEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shortText(value, max = 220) {
  const text = String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  if (!text) return 'Sin detalle';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function countAnsweredAnswers(answers) {
  return Object.values(answers || {}).filter((value) => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') {
      if (typeof value.text === 'string') return value.text.trim() !== '';
      return Object.keys(value).length > 0;
    }
    return value != null;
  }).length;
}

function calcularNota(pts, max, exigencia) {
  if (!max) return 1.0;
  const ratio = pts / max;
  if (ratio >= exigencia) return +(4 + 3 * ((ratio - exigencia) / (1 - exigencia))).toFixed(1);
  return +(1 + 3 * (ratio / exigencia)).toFixed(1);
}

function noteColor(nota) {
  if (nota >= 6) return '#166534';
  if (nota >= 4) return '#1d4ed8';
  return '#b91c1c';
}

function stateBadge(state) {
  if (state === 'APROBADO') return { bg: '#dcfce7', fg: '#166534' };
  if (state === 'REPROBADO') return { bg: '#fee2e2', fg: '#b91c1c' };
  if (state === 'EXCLUIDO') return { bg: '#fef3c7', fg: '#92400e' };
  return { bg: '#e2e8f0', fg: '#334155' };
}

function studentId(index, name) {
  return 'student-' + (index + 1) + '-' + normalizeName(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function formatAnswerValue(value) {
  if (value == null || value === '') return 'Sin responder';
  if (typeof value === 'string') return value.trim() || 'Sin responder';
  if (Array.isArray(value)) return value.join(' | ');
  if (typeof value === 'object') return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ');
  return String(value);
}

function formatCorrectValue(item) {
  const value = item.correcta;
  if (value == null || value === '') return 'Sin clave';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' → ');
  if (typeof value === 'object') return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(' | ');
  return String(value);
}

function walkItems(source, collector) {
  if (!source) return;
  if (Array.isArray(source)) {
    source.forEach((entry) => walkItems(entry, collector));
    return;
  }
  if (typeof source !== 'object') return;
  if (source.id && source.tipo && (source.enunciado || source.pregunta || source.texto || source.id)) {
    collector.push(source);
  }
  [source.items, source.preguntas, source.materiales, source.actividades, source.secciones, source.contenido].forEach((child) => walkItems(child, collector));
}

function extractSessionItems(raw) {
  const collected = [];
  walkItems(raw, collected);
  const seen = new Set();
  return collected
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item, index) => {
      const points = Number(item.puntaje || item.points || 1) || 1;
      const type = String(item.tipo || '').toLowerCase();
      const isAuto = ['seleccion_multiple', 'multiple_choice', 'verdadero_falso', 'true_false', 'pareados', 'matching', 'ordenamiento', 'ordering', 'puzzle'].includes(type);
      return {
        id: item.id,
        tipo: type,
        puntaje: points,
        isAuto,
        indice: index + 1,
        enunciado: item.enunciado || item.pregunta || item.texto || item.id,
        correcta: item.correcta,
      };
    });
}

function evaluateItem(item, answer) {
  if (answer === undefined || answer === null || answer === '') return null;
  const type = item.tipo;
  if (type === 'seleccion_multiple' || type === 'multiple_choice' || type === 'verdadero_falso' || type === 'true_false') {
    return String(answer) === String(item.correcta || '');
  }
  if (type === 'pareados' || type === 'matching') {
    const expected = item.correcta;
    if (!expected || typeof expected !== 'object') return null;
    const given = answer && typeof answer === 'object' ? answer : {};
    return Object.keys(expected).every((key) => String(expected[key]) === String(given[key] || ''));
  }
  if (type === 'ordenamiento' || type === 'ordering' || type === 'puzzle') {
    const expected = item.correcta;
    if (!Array.isArray(expected)) return null;
    const given = answer && typeof answer === 'object' ? answer : {};
    return expected.every((id, index) => String(given[id] || '') === String(index + 1));
  }
  return null;
}

function resolveLocalContentPath(root, sid) {
  const lower = String(sid || '').toLowerCase();
  if (lower.startsWith('pedro-paramo-nm3-')) {
    if (lower.includes('vision')) return path.join(root, 'lecturas', 'contenidos', 'pedro_paramo_nm3_2026_vision.json');
    if (lower.includes('leve')) return path.join(root, 'lecturas', 'contenidos', 'pedro_paramo_nm3_2026_leve_accesible.json');
    if (lower.includes('intermedia')) return path.join(root, 'lecturas', 'contenidos', 'pedro_paramo_nm3_2026_intermedia.json');
    if (lower.includes('dil')) return path.join(root, 'lecturas', 'contenidos', 'pedro_paramo_nm3_2026_dil_fuerte.json');
    return path.join(root, 'lecturas', 'contenidos', 'pedro_paramo_nm3_2026_base.json');
  }
  if (lower.startsWith('maus-nm4-')) {
    if (lower.includes('intermedia')) return path.join(root, 'lecturas', 'contenidos', 'maus_nm4_2026_intermedia.json');
    if (lower.includes('dil')) return path.join(root, 'lecturas', 'contenidos', 'maus_nm4_2026_dil_fuerte.json');
    return path.join(root, 'lecturas', 'contenidos', 'maus_nm4_2026_base.json');
  }
  return null;
}

function loadSessionItems(root, sesionesDb, sid, cache) {
  if (cache.has(sid)) return cache.get(sid);
  let raw = sesionesDb[sid] && sesionesDb[sid].contenido ? sesionesDb[sid].contenido : null;
  if (!raw) {
    const localPath = resolveLocalContentPath(root, sid);
    if (localPath && fs.existsSync(localPath)) {
      raw = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    }
  }
  const items = extractSessionItems(raw || []);
  cache.set(sid, items);
  return items;
}

const ROOT = __dirname;
const REPORT_DIR = path.join(ROOT, 'lecturas', 'adminprofe', 'reportes');
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

const COURSE_CONFIGS = {
  '3A': {
    code: '3A',
    label: '3A-TP',
    examTitle: 'Pedro Páramo',
    year: '2026',
    rosterFile: path.join(ROOT, 'carga_3A_TP.txt'),
    outputFile: path.join(REPORT_DIR, 'Informe_Errores_Pedro_Paramo_3A_TP_2026.html'),
    officialCsv: path.join(REPORT_DIR, 'Planilla_Pedro_Paramo_3A_TP_2026.csv'),
    manualScript: path.join(ROOT, '_tmp_cerrar_pedro_3atp.js'),
    manualItemIds: ['pedro_11', 'pedro_17', 'pedro_25'],
    sessionPrefix: 'pedro-paramo-nm3-',
    noteMode: 'auto-plus-manual',
    autoMaxDefault: 25,
    exigencia: 0.6,
    excluded: {},
  },
  '3B': {
    code: '3B',
    label: '3B-TP',
    examTitle: 'Pedro Páramo',
    year: '2026',
    rosterFile: path.join(ROOT, 'carga_3B_TP.txt'),
    outputFile: path.join(REPORT_DIR, 'Informe_Errores_Pedro_Paramo_3B_TP_2026.html'),
    officialCsv: path.join(REPORT_DIR, 'Planilla_Pedro_Paramo_3B_TP_2026.csv'),
    manualScript: path.join(ROOT, '_tmp_cerrar_pedro_3btp.js'),
    manualItemIds: ['pedro_11', 'pedro_17', 'pedro_25'],
    sessionPrefix: 'pedro-paramo-nm3-',
    noteMode: 'auto-plus-manual',
    autoMaxDefault: 25,
    exigencia: 0.6,
    excluded: {
      '232003979': 'Licencia médica',
    },
  },
  '4A': {
    code: '4A',
    label: '4A-TP',
    examTitle: 'Maus',
    year: '2026',
    rosterFile: path.join(ROOT, 'carga_4A_TP.txt'),
    outputFile: path.join(REPORT_DIR, 'Informe_Errores_Maus_4A_TP_2026.html'),
    officialCsv: path.join(REPORT_DIR, 'Planilla_Maus_4A_TP_2026.csv'),
    sessionPrefix: 'maus-nm4-',
    noteMode: 'auto-only',
    autoMaxDefault: 23,
    exigencia: 0.6,
    excluded: {},
  },
  '4B': {
    code: '4B',
    label: '4B-TP',
    examTitle: 'Maus',
    year: '2026',
    rosterFile: path.join(ROOT, 'carga_4B_TP.txt'),
    outputFile: path.join(REPORT_DIR, 'Informe_Errores_Maus_4B_TP_2026.html'),
    officialCsv: path.join(REPORT_DIR, 'Planilla_Maus_4B_TP_2026.csv'),
    sessionPrefix: 'maus-nm4-',
    noteMode: 'auto-only',
    autoMaxDefault: 23,
    exigencia: 0.6,
    excluded: {},
  },
  '4D': {
    code: '4D',
    label: '4D-TP',
    examTitle: 'Maus',
    year: '2026',
    rosterFile: path.join(ROOT, 'carga_4D_TP.txt'),
    outputFile: path.join(REPORT_DIR, 'Informe_Errores_Maus_4D_TP_2026.html'),
    officialCsv: path.join(REPORT_DIR, 'Planilla_Maus_4D_TP_2026.csv'),
    sessionPrefix: 'maus-nm4-',
    noteMode: 'auto-only',
    autoMaxDefault: 23,
    exigencia: 0.6,
    excluded: {},
  },
  '4E': {
    code: '4E',
    label: '4E-TP',
    examTitle: 'Maus',
    year: '2026',
    rosterFile: path.join(ROOT, 'carga_4E_TP.txt'),
    outputFile: path.join(REPORT_DIR, 'Informe_Errores_Maus_4E_TP_2026.html'),
    officialCsv: path.join(REPORT_DIR, 'Planilla_Maus_4E_TP_2026.csv'),
    sessionPrefix: 'maus-nm4-',
    noteMode: 'auto-only',
    autoMaxDefault: 23,
    exigencia: 0.6,
    excluded: {},
  },
};

const DEFAULT_COURSES = ['3A', '3B', '4A', '4B', '4D', '4E'];

const firebaseApp = admin.apps.length
  ? admin.app()
  : admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com',
  });

const db = firebaseApp.database();

function pickStudent(row, byRut, byName) {
  const direct = byRut.get(row.rutClean);
  if (direct) return direct;
  const candidates = byName.get(normalizeName(row.nombre)) || [];
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  const sameCourse = candidates.find((student) => String(student.curso || '').trim().toUpperCase() === String(row.curso || '').trim().toUpperCase());
  return sameCourse || candidates[0];
}

function chooseBestAttempt(cfg, uid, responses, results, corrections) {
  let best = null;
  const sids = new Set([
    ...Object.keys(responses || {}),
    ...Object.keys(results || {}),
    ...Object.keys(corrections || {}),
  ].filter((sid) => sid.startsWith(cfg.sessionPrefix)));

  for (const sid of sids) {
    const responseNode = responses[sid] && responses[sid][uid];
    const resultNode = results[sid] && results[sid][uid];
    const correctionNode = corrections[sid] && corrections[sid][uid];
    const answers = (responseNode && responseNode.answers) || {};
    const answeredCount = Math.max(
      Number(resultNode && resultNode.answered_count) || 0,
      countAnsweredAnswers(answers)
    );
    const totalPoints = Number(resultNode && resultNode.puntaje_total_final)
      || Number(correctionNode && correctionNode.puntaje_total)
      || Number(resultNode && (resultNode.puntaje !== undefined ? resultNode.puntaje : resultNode.puntaje_obtenido))
      || 0;
    const hasActivity = answeredCount > 0 || !!resultNode || !!responseNode || !!correctionNode;
    if (!hasActivity) continue;
    const score = answeredCount * 1000 + totalPoints;
    if (!best || score > best.score) {
      best = { sid, responseNode, resultNode, correctionNode, answeredCount, score };
    }
  }
  return best;
}

function buildAutoIssues(items, answers) {
  const wrong = [];
  const unanswered = [];
  let autoEarned = 0;
  let autoMax = 0;

  for (const item of items) {
    if (!item.isAuto) continue;
    autoMax += Number(item.puntaje || 1);
    const answer = answers ? answers[item.id] : undefined;
    const verdict = evaluateItem(item, answer);
    if (verdict === true) {
      autoEarned += Number(item.puntaje || 1);
      continue;
    }
    const issue = {
      indice: item.indice,
      itemId: item.id,
      enunciado: shortText(item.enunciado, 170),
      respuesta: shortText(formatAnswerValue(answer), 120),
      correcta: shortText(formatCorrectValue(item), 120),
      puntaje: Number(item.puntaje || 1),
    };
    if (verdict === false) wrong.push(issue);
    else unanswered.push(issue);
  }

  return { wrong, unanswered, autoEarned, autoMax };
}

function buildManualIssues(items, answers, correctionNode, manualItemIds) {
  const issues = [];
  const full = [];
  const allowedIds = manualItemIds ? new Set(manualItemIds) : null;
  for (const item of items) {
    if (item.isAuto) continue;
    if (allowedIds && !allowedIds.has(item.id)) continue;
    const entry = correctionNode && correctionNode[item.id];
    const answer = answers ? answers[item.id] : undefined;
    if (!entry) {
      issues.push({
        indice: item.indice,
        itemId: item.id,
        enunciado: shortText(item.enunciado, 170),
        nivel: 'Pendiente',
        puntos: null,
        max: Number(item.puntaje || 0),
        evidencia: 'Sin corrección manual registrada.',
        respuesta: shortText(formatAnswerValue(answer), 220),
      });
      continue;
    }
    const block = {
      indice: item.indice,
      itemId: item.id,
      enunciado: shortText(item.enunciado, 170),
      nivel: entry.nivel || '—',
      puntos: Number(entry.puntos || 0),
      max: Number(item.puntaje || 0),
      evidencia: shortText(entry.evidencia || '', 220),
      respuesta: shortText(formatAnswerValue(answer), 220),
    };
    if (block.puntos >= block.max) full.push(block);
    else issues.push(block);
  }
  return { issues, full };
}

function parseRoster(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [nombre, rut, curso] = line.split(';').map((value) => (value || '').trim());
      return { nombre, rut, rutClean: cleanRut(rut), curso };
    });
}

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const ch = line[index];
    if (ch === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ';' && !inQuotes) {
      fields.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  fields.push(current);
  return fields;
}

function loadOfficialResults(csvPath) {
  const text = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '').trim();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());
  const byRut = new Map();
  const byName = new Map();

  for (const line of lines) {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => { row[header] = values[index] || ''; });
    const rut = cleanRut(row.RUT || row.Rut || row.rut || '');
    const name = normalizeName(row.Nombre || row.nombre || '');
    const autoField = row['Auto/25'] || row.Auto || '';
    const autoMatch = String(autoField).match(/(\d+)\s*\/\s*(\d+)/);
    const record = {
      nombre: row.Nombre || row.nombre || '',
      rut,
      autoPts: row.Auto_Pts ? Number(row.Auto_Pts) : (autoMatch ? Number(autoMatch[1]) : null),
      autoMax: row.Auto_Max ? Number(row.Auto_Max) : (autoMatch ? Number(autoMatch[2]) : null),
      nota: row.Nota ? Number(String(row.Nota).replace(',', '.')) : null,
      estado: String(row.Estado || '').trim().toUpperCase(),
    };
    if (rut) byRut.set(rut, record);
    if (name) byName.set(name, record);
  }
  return { byRut, byName };
}

function extractConstObject(scriptText, constName) {
  const marker = `const ${constName} =`;
  const start = scriptText.indexOf(marker);
  if (start === -1) return null;
  const braceStart = scriptText.indexOf('{', start);
  if (braceStart === -1) return null;
  let depth = 0;
  for (let index = braceStart; index < scriptText.length; index += 1) {
    const ch = scriptText[index];
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    if (depth === 0) {
      const literal = scriptText.slice(braceStart, index + 1);
      return Function(`return (${literal});`)();
    }
  }
  return null;
}

function loadNm3ManualSource(scriptPath) {
  const scriptText = fs.readFileSync(scriptPath, 'utf8');
  const evidenceMap = extractConstObject(scriptText, 'EV') || {};
  const scores = extractConstObject(scriptText, 'SCORES') || {};
  const byName = new Map();
  for (const [name, items] of Object.entries(scores)) {
    byName.set(normalizeName(name), {
      pedro_11: {
        nivel: items.pedro_11[0],
        puntos: items.pedro_11[1],
        evidencia: evidenceMap[items.pedro_11[2]] || '',
      },
      pedro_17: {
        nivel: items.pedro_17[0],
        puntos: items.pedro_17[1],
        evidencia: evidenceMap[items.pedro_17[2]] || '',
      },
      pedro_25: {
        nivel: items.pedro_25[0],
        puntos: items.pedro_25[1],
        evidencia: evidenceMap[items.pedro_25[2]] || '',
      },
    });
  }
  return byName;
}

function renderStudentSection(student, index) {
  const id = studentId(index, student.nombre);
  const badge = stateBadge(student.estado);
  const wrongHtml = student.autoWrong.length
    ? '<ul class="issue-list">' + student.autoWrong.map((issue) => '<li><strong>P' + issue.indice + '</strong> · ' + htmlEscape(issue.enunciado) + '<br><span class="muted">Respondió:</span> ' + htmlEscape(issue.respuesta) + '<br><span class="muted">Correcta:</span> ' + htmlEscape(issue.correcta) + '</li>').join('') + '</ul>'
    : '<p class="muted">Sin respuestas automáticas incorrectas.</p>';
  const unansweredHtml = student.autoUnanswered.length
    ? '<ul class="issue-list">' + student.autoUnanswered.map((issue) => '<li><strong>P' + issue.indice + '</strong> · ' + htmlEscape(issue.enunciado) + '</li>').join('') + '</ul>'
    : '<p class="muted">No dejó preguntas automáticas en blanco.</p>';
  const manualHtml = student.manualIssues.length
    ? '<ul class="issue-list">' + student.manualIssues.map((issue) => '<li><strong>' + htmlEscape(issue.itemId.toUpperCase()) + '</strong> · ' + htmlEscape(issue.enunciado)
      + (issue.puntos != null ? '<br><span class="muted">Puntaje:</span> ' + issue.puntos + '/' + issue.max + ' · ' + htmlEscape(issue.nivel) : '')
      + '<br><span class="muted">Observación:</span> ' + htmlEscape(issue.evidencia)
      + '<br><span class="muted">Respuesta:</span> ' + htmlEscape(issue.respuesta)
      + '</li>').join('') + '</ul>'
    : '<p class="muted">Sin descuentos en desarrollo.</p>';

  let body = '';
  if (student.estado === 'AUSENTE' || student.estado === 'EXCLUIDO') {
    body = '<p class="state-message">' + htmlEscape(student.motivo || '') + '</p>';
  } else {
    body = '<div class="detail-grid">'
      + '<section><h4>Alternativas incorrectas</h4>' + wrongHtml + '</section>'
      + '<section><h4>Alternativas en blanco</h4>' + unansweredHtml + '</section>'
      + '<section><h4>Desarrollo con descuento</h4>' + manualHtml + '</section>'
      + '</div>';
  }

  return '<article class="student-report" id="' + id + '">'
    + '<div class="student-head">'
    + '<div><h3>' + htmlEscape(student.nombre) + '</h3><p>' + htmlEscape(student.rut) + ' · ' + htmlEscape(student.sid || student.curso) + '</p></div>'
    + '<div class="student-summary">'
    + '<span class="badge" style="background:' + badge.bg + ';color:' + badge.fg + ';">' + htmlEscape(student.estado) + '</span>'
    + '<div class="student-note" style="color:' + noteColor(student.nota || 1) + ';">' + (student.nota != null ? student.nota.toFixed(1) : '—') + '</div>'
    + '</div>'
    + '</div>'
    + '<div class="student-stats">'
    + '<div class="mini-stat"><span>Auto</span><strong>' + (student.autoMax ? `${student.autoPts}/${student.autoMax}` : '—') + '</strong></div>'
    + '<div class="mini-stat"><span>Errores auto</span><strong>' + student.autoWrong.length + '</strong></div>'
    + '<div class="mini-stat"><span>Blancos auto</span><strong>' + student.autoUnanswered.length + '</strong></div>'
    + '<div class="mini-stat"><span>Desarrollo</span><strong>' + student.manualIssues.length + '</strong></div>'
    + '</div>'
    + body
    + '</article>';
}

function renderCourseHtml(cfg, students) {
  const generatedAt = new Date().toLocaleString('es-CL');
  const evaluated = students.filter((student) => student.nota != null);
  const approved = evaluated.filter((student) => student.nota >= 4).length;
  const failed = evaluated.filter((student) => student.nota < 4).length;
  const absents = students.filter((student) => student.estado === 'AUSENTE').length;
  const excluded = students.filter((student) => student.estado === 'EXCLUIDO').length;
  const average = evaluated.length ? +(evaluated.reduce((sum, student) => sum + student.nota, 0) / evaluated.length).toFixed(1) : 0;
  const wrongAuto = students.reduce((sum, student) => sum + student.autoWrong.length, 0);
  const blankAuto = students.reduce((sum, student) => sum + student.autoUnanswered.length, 0);
  const manualIssues = students.reduce((sum, student) => sum + student.manualIssues.length, 0);
  const linksHtml = students.map((student, index) => '<a class="student-link" href="#' + studentId(index, student.nombre) + '">' + htmlEscape(student.nombre) + '</a>').join('');
  const sectionsHtml = students.map(renderStudentSection).join('');

  return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<title>Informe de errores · ' + htmlEscape(cfg.examTitle) + ' · ' + htmlEscape(cfg.label) + '</title>'
    + '<style>'
    + 'body{font-family:Segoe UI,system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:24px;line-height:1.5;}'
    + '.wrap{max-width:1320px;margin:0 auto;}'
    + '.hero{background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;border-radius:22px;padding:28px 30px;margin-bottom:20px;box-shadow:0 12px 32px rgba(15,23,42,.18);}'
    + '.hero h1{margin:0 0 8px;font-size:32px;line-height:1.1;}'
    + '.hero p{margin:4px 0 0;color:#cbd5e1;font-size:14px;}'
    + '.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:18px 0 20px;}'
    + '.card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px;box-shadow:0 8px 24px rgba(15,23,42,.06);}'
    + '.card .k{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:8px;}'
    + '.card .v{font-size:28px;font-weight:800;}'
    + '.panel{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:20px;box-shadow:0 8px 24px rgba(15,23,42,.06);margin-bottom:18px;}'
    + '.panel h2{margin:0 0 14px;font-size:20px;}'
    + '.muted{color:#64748b;font-size:13px;}'
    + '.student-links{display:flex;flex-wrap:wrap;gap:8px;}'
    + '.student-link{display:inline-block;padding:8px 12px;border-radius:999px;background:#eff6ff;color:#1d4ed8;text-decoration:none;font-size:12px;font-weight:700;border:1px solid #bfdbfe;}'
    + '.student-report{border-top:1px solid #e2e8f0;padding:20px 0;scroll-margin-top:20px;}'
    + '.student-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:14px;}'
    + '.student-head h3{margin:0;font-size:22px;}'
    + '.student-head p{margin:4px 0 0;color:#64748b;font-size:13px;}'
    + '.student-summary{text-align:right;}'
    + '.badge{display:inline-block;padding:6px 10px;border-radius:999px;font-size:11px;font-weight:700;}'
    + '.student-note{font-size:34px;font-weight:800;line-height:1;margin-top:8px;}'
    + '.student-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:16px;}'
    + '.mini-stat{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:12px;}'
    + '.mini-stat span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:4px;}'
    + '.mini-stat strong{font-size:20px;}'
    + '.detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;}'
    + '.detail-grid section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:14px;}'
    + '.detail-grid h4{margin:0 0 10px;font-size:15px;}'
    + '.issue-list{margin:0;padding-left:18px;}'
    + '.issue-list li{margin-bottom:10px;font-size:13px;color:#1e293b;}'
    + '.state-message{font-size:14px;font-weight:600;color:#475569;}'
    + '@media print{body{background:#fff;padding:0}.hero,.card,.panel{box-shadow:none}.student-link{display:none}}'
    + '</style></head><body><div class="wrap">'
    + '<section class="hero"><h1>Informe de errores · ' + htmlEscape(cfg.examTitle) + ' · ' + htmlEscape(cfg.label) + '</h1>'
    + '<p>Generado automáticamente el ' + generatedAt + ' · Cada estudiante aparece con las preguntas donde falló, dejó en blanco o recibió descuento en desarrollo.</p>'
    + '<p>Estado de carga a Lirmi: este informe no implica subida; solo consolida revisión por curso.</p></section>'
    + '<section class="cards">'
    + '<div class="card"><div class="k">Estudiantes</div><div class="v">' + students.length + '</div></div>'
    + '<div class="card"><div class="k">Promedio</div><div class="v">' + average.toFixed(1) + '</div><div class="muted">Evaluados: ' + evaluated.length + '</div></div>'
    + '<div class="card"><div class="k">Aprobados / Reprobados</div><div class="v">' + approved + ' / ' + failed + '</div></div>'
    + '<div class="card"><div class="k">Ausentes / Excluidos</div><div class="v">' + absents + ' / ' + excluded + '</div></div>'
    + '<div class="card"><div class="k">Errores auto</div><div class="v">' + wrongAuto + '</div><div class="muted">Blancos: ' + blankAuto + '</div></div>'
    + '<div class="card"><div class="k">Descuentos desarrollo</div><div class="v">' + manualIssues + '</div></div>'
    + '</section>'
    + '<section class="panel"><h2>Navegación rápida</h2><div class="student-links">' + linksHtml + '</div></section>'
    + '<section class="panel"><h2>Detalle por estudiante</h2>' + sectionsHtml + '</section>'
    + '</div></body></html>';
}

(async () => {
  try {
    const requested = process.argv.slice(2).map((course) => course.toUpperCase()).filter(Boolean);
    const courses = (requested.length ? requested : DEFAULT_COURSES).filter((course) => COURSE_CONFIGS[course]);
    if (!courses.length) throw new Error('Debes indicar cursos válidos entre: ' + Object.keys(COURSE_CONFIGS).join(', '));

    const [studentsSnap, responsesSnap, resultsSnap, correctionsSnap, sessionsSnap] = await Promise.all([
      db.ref('plataforma_estudiantes/estudiantes').once('value'),
      db.ref('plataforma_lecturas/respuestas').once('value'),
      db.ref('plataforma_lecturas/resultados').once('value'),
      db.ref('plataforma_lecturas/correcciones_manual').once('value'),
      db.ref('plataforma_lecturas/sesiones').once('value'),
    ]);

    const allStudents = studentsSnap.val() || {};
    const responses = responsesSnap.val() || {};
    const results = resultsSnap.val() || {};
    const corrections = correctionsSnap.val() || {};
    const sesionesDb = sessionsSnap.val() || {};
    const sessionCache = new Map();

    const byRut = new Map();
    const byName = new Map();
    for (const [uid, student] of Object.entries(allStudents)) {
      const rutKey = cleanRut(student && student.rut);
      if (rutKey) byRut.set(rutKey, { uid, ...student });
      const nameKey = normalizeName(student && student.nombre);
      if (!nameKey) continue;
      if (!byName.has(nameKey)) byName.set(nameKey, []);
      byName.get(nameKey).push({ uid, ...student });
    }

    for (const courseKey of courses) {
      const cfg = COURSE_CONFIGS[courseKey];
      const roster = parseRoster(cfg.rosterFile);
      const officialResults = cfg.officialCsv ? loadOfficialResults(cfg.officialCsv) : { byRut: new Map(), byName: new Map() };
      const nm3ManualByName = cfg.manualScript ? loadNm3ManualSource(cfg.manualScript) : null;
      const rows = [];

      for (const row of roster) {
        const excludedReason = cfg.excluded[row.rutClean];
        if (excludedReason) {
          rows.push({
            nombre: row.nombre,
            rut: row.rut,
            curso: row.curso,
            estado: 'EXCLUIDO',
            motivo: excludedReason,
            nota: null,
            sid: null,
            autoPts: 0,
            autoMax: 0,
            autoWrong: [],
            autoUnanswered: [],
            manualIssues: [],
          });
          continue;
        }

        const student = pickStudent(row, byRut, byName);
        if (!student) {
          rows.push({
            nombre: row.nombre,
            rut: row.rut,
            curso: row.curso,
            estado: 'AUSENTE',
            motivo: 'No aparece registrado en la plataforma.',
            nota: null,
            sid: null,
            autoPts: 0,
            autoMax: 0,
            autoWrong: [],
            autoUnanswered: [],
            manualIssues: [],
          });
          continue;
        }

        const attempt = chooseBestAttempt(cfg, student.uid, responses, results, corrections);
        if (!attempt) {
          rows.push({
            nombre: row.nombre,
            rut: row.rut,
            curso: row.curso,
            estado: 'AUSENTE',
            motivo: 'Sin actividad registrada en la prueba.',
            nota: null,
            sid: null,
            autoPts: 0,
            autoMax: 0,
            autoWrong: [],
            autoUnanswered: [],
            manualIssues: [],
          });
          continue;
        }

        const items = loadSessionItems(ROOT, sesionesDb, attempt.sid, sessionCache);
        const answers = (attempt.responseNode && attempt.responseNode.answers) || {};
        const autoInfo = buildAutoIssues(items, answers);
        const manualSource = nm3ManualByName ? nm3ManualByName.get(normalizeName(row.nombre)) : attempt.correctionNode;
        const manualInfo = buildManualIssues(items, answers, manualSource, cfg.manualItemIds);
        const manualPts = manualInfo.full.concat(manualInfo.issues)
          .filter((issue) => typeof issue.puntos === 'number')
          .reduce((sum, issue) => sum + issue.puntos, 0);
        const manualMax = manualInfo.full.concat(manualInfo.issues)
          .filter((issue) => typeof issue.max === 'number')
          .reduce((sum, issue) => sum + issue.max, 0);

        let autoPts = autoInfo.autoEarned;
        let autoMax = autoInfo.autoMax || cfg.autoMaxDefault;
        if (!autoInfo.autoMax) {
          autoPts = Number(attempt.resultNode && (attempt.resultNode.puntaje !== undefined ? attempt.resultNode.puntaje : attempt.resultNode.puntaje_obtenido)) || autoPts;
          autoMax = Number(attempt.resultNode && attempt.resultNode.total) || autoMax;
        }

        const official = officialResults.byRut.get(row.rutClean) || officialResults.byName.get(normalizeName(row.nombre));
        if (official && typeof official.autoPts === 'number' && !Number.isNaN(official.autoPts)) autoPts = official.autoPts;
        if (official && typeof official.autoMax === 'number' && !Number.isNaN(official.autoMax)) autoMax = official.autoMax;

        let note = official && typeof official.nota === 'number' && !Number.isNaN(official.nota)
          ? official.nota
          : (cfg.noteMode === 'auto-plus-manual'
            ? calcularNota(autoPts + manualPts, autoMax + manualMax, cfg.exigencia)
            : calcularNota(autoPts, autoMax, cfg.exigencia));

        const state = official && official.estado
          ? official.estado
          : (note >= 4 ? 'APROBADO' : 'REPROBADO');

        rows.push({
          nombre: row.nombre,
          rut: row.rut,
          curso: row.curso,
          estado: state,
          motivo: '',
          nota: note,
          sid: attempt.sid,
          autoPts,
          autoMax,
          autoWrong: autoInfo.wrong,
          autoUnanswered: autoInfo.unanswered,
          manualIssues: manualInfo.issues,
        });
      }

      rows.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      const html = renderCourseHtml(cfg, rows);
      fs.writeFileSync(cfg.outputFile, html, 'utf8');
      console.log('[ok]', courseKey, '=>', cfg.outputFile);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await Promise.allSettled(admin.apps.map((instance) => instance.delete()));
  }
})();