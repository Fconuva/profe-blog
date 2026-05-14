// Genera informe Maus NM4 4E-TP (clon 4B-TP, sin exclusiones por defecto)
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

function normalizePrivateKey(raw) {
  let k = (raw || '').trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  if (k.includes('\\n')) k = k.replace(/\\n/g, '\n');
  const m = k.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (m) {
    const lines = m[1].match(/.{1,64}/g) || [];
    k = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return k;
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com',
  });
}
const db = admin.database();

const ROOT = __dirname;
const CURSO = '4E-TP';
const ROSTER_FILE = path.join(ROOT, 'carga_4E_TP.txt');
const REPORT_DIR = path.join(ROOT, 'lecturas', 'adminprofe', 'reportes');
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
const HTML_OUT = path.join(REPORT_DIR, 'Informe_Final_Maus_4E_TP_2026.html');
const CSV_OUT = path.join(REPORT_DIR, 'Planilla_Maus_4E_TP_2026.csv');
const LIRMI_OUT = path.join(REPORT_DIR, 'Plantilla_Lirmi_Maus_4E_TP_2026.csv');
const EXIGENCIA = 0.6;
const PENDIENTES_RUT = new Set();

const SESSIONS_MAUS = [
  { sid: 'maus-nm4-2026', file: 'maus_nm4_2026_base.json' },
  { sid: 'maus-nm4-intermedia-2026', file: 'maus_nm4_2026_intermedia.json' },
  { sid: 'maus-nm4-dil-2026', file: 'maus_nm4_2026_dil_fuerte.json' },
  { sid: 'maus-nm4-brayan-contreras-pie-2026', file: 'pie/maus-nm4-brayan-contreras-pie-2026.json' },
];

function cleanRut(rut) { return String(rut || '').replace(/[.\s-]/g, '').toUpperCase(); }
function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}
function csvEscape(v) { const s = String(v == null ? '' : v); return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
function htmlEscape(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function calcularNota(pts, max, exig) {
  if (!max) return 1.0;
  const r = pts / max;
  if (r >= exig) return +(4 + 3 * ((r - exig) / (1 - exig))).toFixed(1);
  return +(1 + 3 * (r / exig)).toFixed(1);
}
function countAnsweredAnswers(answers) {
  return Object.values(answers || {}).filter(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') {
      if (typeof value.text === 'string') return value.text.trim() !== '';
      return Object.keys(value).length > 0;
    }
    return value != null;
  }).length;
}
function loadSession(file) {
  const fp = path.join(ROOT, 'lecturas', 'contenidos', file);
  if (!fs.existsSync(fp)) return null;
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const items = [];
  function walk(arr) {
    if (!Array.isArray(arr)) return;
    arr.forEach(o => {
      if (o && o.id && o.tipo && (o.enunciado || o.pregunta || o.texto)) items.push(o);
      if (o && Array.isArray(o.items)) walk(o.items);
      if (o && Array.isArray(o.preguntas)) walk(o.preguntas);
    });
  }
  walk(data.items || []); walk(data.preguntas || []); walk(data.materiales || []); walk(data.actividades || []); walk(data.secciones || []);
  const seen = new Set();
  const unique = items.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
  let autoTotal = 0, totalAll = 0, manualCount = 0;
  const itemsMeta = unique.map((it, idx) => {
    const pts = Number(it.puntaje || it.points || 1) || 1;
    const tipo = String(it.tipo || '').toLowerCase();
    const isAuto = ['seleccion_multiple','multiple_choice','verdadero_falso','true_false','pareados','matching','ordenamiento','ordering','puzzle'].includes(tipo);
    if (isAuto) autoTotal += pts;
    else manualCount += 1;
    totalAll += pts;
    return { id: it.id, tipo, puntaje: pts, isAuto, indice: idx + 1, enunciado: it.enunciado || it.pregunta || '', materialRef: it.materialRef || '', correcta: it.correcta };
  });
  return { items: itemsMeta, autoTotal, totalAll, manualCount, manualTotal: totalAll - autoTotal };
}

function evaluarItem(item, answer) {
  const tipo = item.tipo;
  if (answer === undefined || answer === null || answer === '') return null;
  if (tipo === 'seleccion_multiple' || tipo === 'multiple_choice' || tipo === 'verdadero_falso' || tipo === 'true_false') {
    return String(answer || '') === String(item.correcta || '');
  }
  if (tipo === 'pareados' || tipo === 'matching') {
    const exp = item.correcta;
    if (!exp || typeof exp !== 'object') return null;
    const a = answer && typeof answer === 'object' ? answer : {};
    return Object.keys(exp).every(k => String(exp[k]) === String(a[k] || ''));
  }
  if (tipo === 'ordenamiento' || tipo === 'ordering' || tipo === 'puzzle') {
    const exp = item.correcta;
    if (!Array.isArray(exp)) return null;
    const a = answer && typeof answer === 'object' ? answer : {};
    return exp.every((id, i) => String(a[id] || '') === String(i + 1));
  }
  return null;
}

function pickStudent(row, byRut, byName) {
  const direct = byRut.get(row.rutClean);
  if (direct) return direct;
  const named = byName.get(normalizeName(row.nombre)) || [];
  if (!named.length) return null;
  if (named.length === 1) return named[0];
  const sameCourse = named.find(student => String(student.curso || '').trim().toUpperCase() === String(row.curso || '').trim().toUpperCase());
  return sameCourse || named[0];
}

function computeAutoFromAnswers(sd, answers) {
  let earned = 0;
  for (const item of sd.items) {
    if (!item.isAuto) continue;
    const result = evaluarItem(item, answers ? answers[item.id] : undefined);
    if (result === true) earned += Number(item.puntaje || 1);
  }
  return { earned, max: sd.autoTotal };
}

(async () => {
  const roster = fs.readFileSync(ROSTER_FILE, 'utf8').split(/\r?\n/).filter(Boolean).map(l => {
    const [nombre, rut, curso] = l.split(';').map(s => (s || '').trim());
    return { nombre, rut, rutClean: cleanRut(rut), curso };
  });

  console.log('[fetch] Firebase...');
  const [studentsSnap, respSnap, resSnap] = await Promise.all([
    db.ref('plataforma_estudiantes/estudiantes').once('value'),
    db.ref('plataforma_lecturas/respuestas').once('value'),
    db.ref('plataforma_lecturas/resultados').once('value'),
  ]);
  const allStudents = studentsSnap.val() || {};
  const responses = respSnap.val() || {};
  const results = resSnap.val() || {};

  const byRut = new Map();
  const byName = new Map();
  Object.entries(allStudents).forEach(([uid, s]) => {
    const r = cleanRut(s && s.rut);
    if (r) byRut.set(r, { uid, ...s });
    const nameKey = normalizeName(s && s.nombre);
    if (!nameKey) return;
    if (!byName.has(nameKey)) byName.set(nameKey, []);
    byName.get(nameKey).push({ uid, ...s });
  });

  const sessionsData = {};
  for (const ss of SESSIONS_MAUS) {
    const sd = loadSession(ss.file);
    if (sd) { sessionsData[ss.sid] = sd; console.log('[session]', ss.sid, '· auto=' + sd.autoTotal, '· total=' + sd.totalAll); }
    else console.warn('[session] NOT FOUND:', ss.file);
  }

  const filas = [];
  for (const r of roster) {
    const stu = pickStudent(r, byRut, byName);
    const isPendiente = PENDIENTES_RUT.has(r.rut);
    const base = { nombre: r.nombre, rut: r.rut, curso: r.curso, uid: stu && stu.uid };
    if (isPendiente) { filas.push({ ...base, estado: 'PENDIENTE', motivo: 'Pendiente: dar más tiempo' }); continue; }
    if (!stu) { filas.push({ ...base, estado: 'AUSENTE', motivo: 'No registrado en plataforma' }); continue; }
    const uid = stu.uid;
    let sidUsada = null, resUsado = null, respUsado = null;
    let mejorScore = -1;
    for (const ss of SESSIONS_MAUS) {
      const sid = ss.sid;
      const res = results[sid] && results[sid][uid];
      const resp = responses[sid] && responses[sid][uid];
      const answerCount = countAnsweredAnswers(resp && resp.answers);
      const hasRes = !!(res && (res.puntaje !== undefined || res.puntaje_obtenido !== undefined || res.detalle || res.submitted_at));
      const hasAnswers = answerCount > 0 || !!(resp && (resp.submitted_at || resp.completada));
      if (!hasRes && !hasAnswers) continue;

      const answered = hasRes ? Math.max(Number(res.answered_count || 0), answerCount) : answerCount;
      const puntaje = hasRes ? Number(res.puntaje !== undefined ? res.puntaje : (res.puntaje_obtenido || 0)) : 0;
      const score = answered * 1000 + puntaje;
      if (score > mejorScore) {
        mejorScore = score;
        sidUsada = sid;
        resUsado = hasRes ? res : null;
        respUsado = resp || null;
      }
    }
    if (!sidUsada || (!resUsado && !respUsado)) { filas.push({ ...base, estado: 'AUSENTE', motivo: 'Sin actividad' }); continue; }

    const sd = sessionsData[sidUsada] || sessionsData['maus-nm4-2026'];
    const autoMax = (resUsado && resUsado.total) || (sd && sd.autoTotal) || 0;
    const autoPts = (resUsado && (resUsado.puntaje !== undefined ? resUsado.puntaje : resUsado.puntaje_obtenido)) || 0;
    const totalPrueba = (resUsado && resUsado.puntaje_total_prueba) || (sd && sd.totalAll) || autoMax;
    const manualPend = (resUsado && resUsado.manual_pendientes != null ? resUsado.manual_pendientes : (sd && sd.manualCount)) || 0;
    const manualPts = (resUsado && resUsado.puntaje_manual_pendiente != null ? resUsado.puntaje_manual_pendiente : (sd && sd.manualTotal)) || 0;
    const answeredCount = (resUsado && resUsado.answered_count) || countAnsweredAnswers(respUsado && respUsado.answers);
    const totalItems = (resUsado && resUsado.total_items) || (sd && sd.items.length) || 0;

    let finalAutoPts = autoPts;
    let finalAutoMax = autoMax || (sd && sd.autoTotal) || 25;
    if (!resUsado && respUsado && respUsado.answers && sd) {
      const reconstructed = computeAutoFromAnswers(sd, respUsado.answers);
      finalAutoPts = reconstructed.earned;
      finalAutoMax = reconstructed.max || finalAutoMax;
    }

    const pct = finalAutoMax ? Math.round((finalAutoPts / finalAutoMax) * 100) : 0;
    const nota = calcularNota(finalAutoPts, finalAutoMax, EXIGENCIA);
    const estado = nota >= 4.0 ? 'APROBADO' : 'REPROBADO';

    filas.push({ ...base, sid: sidUsada, estado, autoPts: finalAutoPts, autoMax: finalAutoMax, totalPrueba, manualPend, manualPts, answeredCount, totalItems, pct, nota, _detalle: (resUsado && resUsado.detalle) || null, _answers: (respUsado && respUsado.answers) || null, _sd: sd });
  }

  filas.sort((a, b) => a.nombre.localeCompare(b.nombre));
  const evaluados = filas.filter(f => typeof f.nota === 'number');
  const N = evaluados.length;
  const ausentes = filas.filter(f => f.estado === 'AUSENTE').length;
  const pendientes = filas.filter(f => f.estado === 'PENDIENTE').length;
  const aprob = evaluados.filter(f => f.nota >= 4.0).length;
  const repr = N - aprob;
  const promNota = N ? +(evaluados.reduce((s, f) => s + f.nota, 0) / N).toFixed(1) : 0;
  const promPct = N ? Math.round(evaluados.reduce((s, f) => s + f.pct, 0) / N) : 0;
  const notaMax = N ? Math.max(...evaluados.map(f => f.nota)).toFixed(1) : '—';
  const notaMin = N ? Math.min(...evaluados.map(f => f.nota)).toFixed(1) : '—';

  let csv = 'N;Nombre;RUT;Curso;Sesion;Estado;Auto_Pts;Auto_Max;Pct;Nota;Manual_Pendientes;Respondidas;Items;Motivo\n';
  filas.forEach((f, i) => {
    csv += [ i+1, csvEscape(f.nombre), csvEscape(f.rut), csvEscape(f.curso), csvEscape(f.sid||''), csvEscape(f.estado),
      f.autoPts!=null?f.autoPts:'', f.autoMax!=null?f.autoMax:'', f.pct!=null?f.pct+'%':'',
      f.nota!=null?f.nota.toFixed(1).replace('.',','):'', f.manualPend!=null?f.manualPend:'',
      f.answeredCount!=null?f.answeredCount:'', f.totalItems!=null?f.totalItems:'', csvEscape(f.motivo||'') ].join(';')+'\n';
  });
  fs.writeFileSync(CSV_OUT, csv, 'utf8');
  console.log('[csv]', CSV_OUT);

  let lirmi = 'Nombre;RUT;Nota;Observacion\n';
  filas.forEach(f => {
    const obs = f.estado === 'PENDIENTE' ? 'Pendiente — más tiempo' : (f.estado === 'AUSENTE' ? 'Ausente' : '');
    lirmi += [csvEscape(f.nombre), csvEscape(f.rut), f.nota!=null?f.nota.toFixed(1).replace('.',','):'', csvEscape(obs)].join(';')+'\n';
  });
  fs.writeFileSync(LIRMI_OUT, lirmi, 'utf8');
  console.log('[lirmi]', LIRMI_OUT);

  function rowHtml(f) {
    if (f.estado === 'PENDIENTE') return `<tr style="background:#fef3c7"><td class="name-cell">${htmlEscape(f.nombre)}</td><td style="text-align:center;font-size:10px;color:#666">${htmlEscape(f.rut)}</td><td colspan="6" style="text-align:center;color:#92400e;font-weight:700">⏳ Pendiente — se le dará más tiempo</td><td class="mc-cell">—</td><td style="text-align:center"><span style="background:#fde68a;color:#92400e;padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700">PENDIENTE</span></td></tr>`;
    if (f.estado === 'AUSENTE') return `<tr style="background:#fee2e2"><td class="name-cell">${htmlEscape(f.nombre)}</td><td style="text-align:center;font-size:10px;color:#666">${htmlEscape(f.rut)}</td><td colspan="6" style="text-align:center;color:#991b1b;font-weight:600">${htmlEscape(f.motivo||'Ausente')}</td><td class="mc-cell">—</td><td style="text-align:center"><span style="background:#fecaca;color:#991b1b;padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700">AUSENTE</span></td></tr>`;
    const colorNota = f.nota >= 6.0 ? '#16a34a' : f.nota >= 4.0 ? '#1e3a5f' : '#dc2626';
    const bgEstado = f.estado === 'APROBADO' ? '#dcfce7' : '#fee2e2';
    const colorEstado = f.estado === 'APROBADO' ? '#16a34a' : '#dc2626';
    return `<tr><td class="name-cell">${htmlEscape(f.nombre)}</td><td style="text-align:center;font-size:10px;color:#666">${htmlEscape(f.rut)}</td><td class="mc-cell">${f.autoPts}/${f.autoMax}</td><td class="mc-cell">${f.answeredCount}/${f.totalItems}</td><td class="mc-cell">${f.manualPend||0}</td><td class="mc-cell">${f.totalPrueba||(f.autoMax+(f.manualPts||0))}</td><td class="mc-cell">—</td><td class="mc-cell" style="font-weight:700">${f.autoPts}/${f.autoMax}</td><td class="mc-cell">${f.pct}%</td><td class="mc-cell" style="font-size:14px;font-weight:800;color:${colorNota}">${f.nota.toFixed(1)}</td><td style="text-align:center"><span style="background:${bgEstado};color:${colorEstado};padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700">${f.estado}</span></td></tr>`;
  }
  const tablaHtml = filas.map(rowHtml).join('\n');

  function buildPerItemBlocks(f) {
    if (f.estado === 'AUSENTE' || f.estado === 'PENDIENTE') return '';
    const sd = f._sd;
    if (!sd || !sd.items || !sd.items.length) return '';
    const detalle = f._detalle || {};
    const answers = f._answers || {};
    const colors = {
      ok:    { bg:'#dcfce7', fg:'#166534', icon:'✓' },
      bad:   { bg:'#fee2e2', fg:'#991b1b', icon:'✗' },
      empty: { bg:'#f1f5f9', fg:'#64748b', icon:'—' },
      manual:{ bg:'#ede9fe', fg:'#5b21b6', icon:'✏️' },
    };
    let oks=0, bads=0, emptys=0, mans=0;
    const chips = sd.items.map(it => {
      let status, respuesta = '';
      const det = detalle[it.id]; const a = answers[it.id];
      const isManual = (it.tipo === 'respuesta_corta' || it.tipo === 'desarrollo' || it.tipo === 'short_text');
      if (det) {
        if (isManual || det.autoEvaluable === false) status='manual';
        else if (det.esCorrecta === true) status='ok';
        else if (det.esCorrecta === false) status='bad';
        else status='empty';
        respuesta = det.respuesta != null ? det.respuesta : '';
      } else {
        if (isManual) status='manual';
        else if (a == null || a === '' || (typeof a === 'object' && Object.keys(a).length === 0)) status='empty';
        else { const ev = evaluarItem(it, a); status = ev===true?'ok':(ev===false?'bad':'manual'); }
        respuesta = a != null ? a : '';
      }
      if (status==='ok') oks++; else if (status==='bad') bads++; else if (status==='empty') emptys++; else mans++;
      const c = colors[status];
      const respTxt = typeof respuesta === 'string' ? respuesta : (respuesta && typeof respuesta === 'object' ? JSON.stringify(respuesta) : '');
      const statusLabel = { ok:'CORRECTA', bad:'INCORRECTA', empty:'sin responder', manual:'desarrollo (manual)' }[status];
      const tip = `Pregunta ${it.indice} (${it.tipo}${it.materialRef?' · '+it.materialRef:''}) — ${statusLabel}`;
      return `<span class="qchip" style="background:${c.bg};color:${c.fg}" title="${htmlEscape(tip)}"><b>P${it.indice}</b> ${c.icon}</span>`;
    }).join(' ');
    return `<div class="student-detail"><div class="sd-head"><strong>${htmlEscape(f.nombre)}</strong><span class="sd-meta">${htmlEscape(f.rut)} · Nota <b style="color:${f.nota>=6?'#16a34a':f.nota>=4?'#1e3a5f':'#dc2626'}">${f.nota.toFixed(1)}</b> · ${f.pct}%</span><span class="sd-tally"><span style="color:#166534">✓ ${oks}</span> · <span style="color:#991b1b">✗ ${bads}</span>${emptys?` · <span style="color:#64748b">— ${emptys}</span>`:''}${mans?` · <span style="color:#5b21b6">✏️ ${mans}</span>`:''}</span></div><div class="sd-chips">${chips}</div></div>`;
  }
  const detallesHtml = filas.map(buildPerItemBlocks).filter(Boolean).join('\n');

  const fechaGen = new Date().toLocaleString('es-CL');
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe Final — Maus NM4 — ${CURSO} — 2026</title><style>
@page { size: A4 landscape; margin: 8mm; }
@media print { body { background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; } .page{box-shadow:none;margin:0;padding:12px} .no-print{display:none!important} }
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f2f5;color:#1a1a2e;font-size:12px;line-height:1.5}
.page{max-width:1300px;margin:20px auto;background:#fff;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,0.08);padding:28px 32px}
.header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;margin-bottom:18px;border-bottom:3px solid #0ea5e9}
.header-left h1{font-size:22px;color:#0369a1;line-height:1.2}.header-left h2{font-size:14px;color:#555;font-weight:400;margin-top:2px}.header-left .sub{font-size:11px;color:#999;margin-top:4px}
.curso-badge{background:linear-gradient(135deg,#0369a1,#0ea5e9);color:#fff;padding:10px 24px;border-radius:10px;font-size:20px;font-weight:800;text-align:center}
.exig-label{font-size:11px;color:#888;text-align:center;margin-top:4px}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}
.card{background:#f8f9fa;border:1px solid #e5e7eb;border-radius:10px;padding:14px;text-align:center}
.card-big{font-size:28px;font-weight:800;color:#0369a1;line-height:1}.card-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px}.card-sub{font-size:11px;color:#555;margin-top:2px}
.card-highlight{border-color:#0ea5e9;border-width:2px}
.section-title{font-size:15px;font-weight:700;color:#0369a1;margin:22px 0 10px;padding-bottom:6px;border-bottom:2px solid #e5e7eb}
table{width:100%;border-collapse:collapse;font-size:11px}th{background:#0369a1;color:#fff;padding:6px 8px;font-size:9px;text-transform:uppercase}td{padding:5px 8px;border-bottom:1px solid #eee}tbody tr:nth-child(even){background:#fafbfc}
.name-cell{font-weight:600;font-size:10px;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mc-cell{text-align:center;font-weight:700;font-size:11px}
.print-bar{text-align:center;margin:16px 0}.print-bar button{padding:10px 32px;background:linear-gradient(135deg,#0369a1,#0ea5e9);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600}
.notas-bar{display:flex;height:30px;border-radius:8px;overflow:hidden;margin:10px 0;font-size:11px;font-weight:700}.notas-ap{background:#16a34a;color:#fff;display:flex;align-items:center;justify-content:center}.notas-rep{background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center}.notas-pend{background:#eab308;color:#422006;display:flex;align-items:center;justify-content:center}.notas-aus{background:#94a3b8;color:#fff;display:flex;align-items:center;justify-content:center}
.footer{text-align:center;font-size:10px;color:#aaa;margin-top:16px;padding-top:10px;border-top:1px solid #eee}
.student-detail{border:1px solid #e5e7eb;border-radius:10px;padding:10px 14px;margin-bottom:10px;background:#fff;page-break-inside:avoid}
.sd-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-bottom:6px;border-bottom:1px dashed #e5e7eb;margin-bottom:8px;font-size:12px}
.sd-meta{color:#64748b;font-size:11px}
.sd-tally{margin-left:auto;font-size:11px;font-weight:700}
.sd-chips{display:flex;flex-wrap:wrap;gap:4px}
.qchip{font-size:10px;font-weight:700;padding:3px 7px;border-radius:6px;border:1px solid rgba(0,0,0,.05);display:inline-flex;align-items:center;gap:3px}
.qchip small{font-weight:500;opacity:.85}
</style></head><body><div class="page">
<div class="header"><div class="header-left"><h1>Informe de Resultados — Prueba Maus (NM4)</h1><h2>Lengua y Literatura NM4 — ${CURSO} — Año 2026</h2><p class="sub">Centro Educativo Salesianos Talca | Prof. Francisco Javier Núñez Valenzuela | Generado: ${fechaGen}</p></div><div><div class="curso-badge">${CURSO}</div><div class="exig-label">Exigencia: 60% | Escala 1.0 – 7.0</div></div></div>
<div class="print-bar no-print"><button onclick="window.print()">🖨️ Imprimir / Guardar PDF</button></div>
<div class="section-title">Resumen General</div>
<div class="cards">
<div class="card card-highlight"><div class="card-big">${filas.length}</div><div class="card-label">Total Curso</div><div class="card-sub">${N} evaluados · ${pendientes} pendientes · ${ausentes} ausentes</div></div>
<div class="card"><div class="card-big">${promNota}</div><div class="card-label">Promedio Curso</div><div class="card-sub">${promPct}% logro promedio</div></div>
<div class="card"><div class="card-big">${notaMax}</div><div class="card-label">Nota Más Alta</div><div class="card-sub">${notaMin} más baja</div></div>
<div class="card"><div class="card-big">${aprob}/${N}</div><div class="card-label">Aprobados (≥ 4,0)</div><div class="card-sub">${repr} reprobados</div></div>
</div>
<div class="notas-bar">${aprob?`<div class="notas-ap" style="flex:${aprob}">✅ ${aprob} aprobados</div>`:''}${repr?`<div class="notas-rep" style="flex:${repr}">❌ ${repr} reprobados</div>`:''}${pendientes?`<div class="notas-pend" style="flex:${pendientes}">⏳ ${pendientes} pendientes</div>`:''}${ausentes?`<div class="notas-aus" style="flex:${ausentes}">— ${ausentes} ausentes</div>`:''}</div>
<div class="section-title">Resultados Individuales (${filas.length} estudiantes)</div>
<table><thead><tr><th>Estudiante</th><th>RUT</th><th>Auto</th><th>Resp.</th><th>Manual<br>Pend.</th><th>Total<br>Prueba</th><th>Desarrollo</th><th>Subtotal</th><th>%</th><th>Nota</th><th>Estado</th></tr></thead><tbody>${tablaHtml}</tbody></table>
<div class="section-title">Notas</div><div style="font-size:11px;color:#475569;line-height:1.6"><p><strong>Ausentes:</strong> estudiantes sin registro de actividad en la plataforma.</p><p><strong>Cálculo de nota:</strong> exigencia 60% sobre puntaje auto-evaluable. Las preguntas de desarrollo quedan pendientes de revisión manual.</p></div>
<div class="section-title">Detalle por Pregunta — Aciertos y Errores</div>
<p style="font-size:11px;color:#64748b;margin-bottom:10px"><span class="qchip" style="background:#dcfce7;color:#166534">P# ✓</span> correcta · <span class="qchip" style="background:#fee2e2;color:#991b1b">P# ✗</span> incorrecta · <span class="qchip" style="background:#f1f5f9;color:#64748b">P# —</span> sin responder · <span class="qchip" style="background:#ede9fe;color:#5b21b6">P# ✏️</span> desarrollo (revisión manual). Pasa el cursor sobre cada chip para ver el tipo de pregunta y el estado.</p>
${detallesHtml}
<div class="footer">Informe generado automáticamente · ${fechaGen} · Plataforma Lecturas profefranciscopancho.com</div>
</div></body></html>`;
  fs.writeFileSync(HTML_OUT, html, 'utf8');
  console.log('[html]', HTML_OUT);

  console.log('\n=== RESUMEN ' + CURSO + ' ===');
  console.log('Total roster:', filas.length);
  console.log('Evaluados:', N, '| Aprobados:', aprob, '| Reprobados:', repr);
  console.log('Pendientes:', pendientes, '| Ausentes:', ausentes);
  console.log('Promedio:', promNota, '| Logro:', promPct + '%');
  console.log('\n=== POR ESTUDIANTE ===');
  filas.forEach((f, i) => {
    console.log(`${String(i+1).padStart(2,'0')}. ${f.nombre.padEnd(45)} ${f.rut.padEnd(12)} ${f.estado.padEnd(10)} ${f.nota!=null?'nota '+f.nota.toFixed(1):''} ${f.motivo||''}`);
  });
  await admin.app().delete(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
