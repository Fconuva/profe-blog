require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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

function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function calcularNota(pts, max, exigencia) {
  const ratio = pts / max;
  if (ratio >= exigencia) return +(4 + 3 * ((ratio - exigencia) / (1 - exigencia))).toFixed(1);
  return +(1 + 3 * (ratio / exigencia)).toFixed(1);
}

function csvEscape(value) {
  const text = String(value == null ? '' : value);
  return /[";\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function htmlEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function answerHtml(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return '<em>Sin respuesta</em>';
  return htmlEscape(text).replace(/\r?\n/g, '<br>');
}

function studentId(index, nombre) {
  return 'student-' + (index + 1) + '-' + normalizeName(nombre).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const CURSO = '3D-TP';
const AUTO_MAX = 25;
const DES_MAX = 12;
const MAX = 37;
const EXIGENCIA = 0.6;
const ROOT = __dirname;
const AUDIT_PATH = path.join(ROOT, '_tmp_3dtp_auditoria.json');
const ROSTER_PATH = path.join(ROOT, 'carga_3D_TP.txt');
const REPORT_DIR = path.join(ROOT, 'lecturas', 'adminprofe', 'reportes');
const CSV_PATH = path.join(REPORT_DIR, 'Planilla_Pedro_Paramo_3D_TP_2026.csv');
const HTML_PATH = path.join(REPORT_DIR, 'Informe_Final_Pedro_Paramo_3D_TP_2026.html');
const LOCAL_HTML_PATH = path.join(REPORT_DIR, 'Informe_Local_Con_Individuales_Pedro_Paramo_3D_TP_2026.html');

const EV = {
  p11_blank: 'Sin respuesta en el contraste entre la Comala recordada y la Comala real.',
  p11_gib: 'Caracteres aleatorios o sin idea reconocible sobre el contraste de Comala.',
  p11_partial: 'Menciona solo una idea parcial del contraste entre la Comala idealizada y la Comala encontrada por Juan.',
  p11_mid: 'Compara la Comala idealizada con la Comala desierta, pero desarrolla poco la funcion del contraste.',
  p11_full: 'Contrasta con claridad la Comala recordada y la Comala en ruinas, y explica la destruccion del pueblo.',
  p17_blank: 'Sin respuesta sobre la complejidad de Pedro Paramo.',
  p17_gib: 'Caracteres aleatorios o sin idea reconocible sobre la complejidad de Pedro Paramo.',
  p17_partial: 'Menciona solo una faceta de Pedro o una referencia aislada a Susana, sin relacionar ambos momentos.',
  p17_mid: 'Relaciona el Pedro nostalgico con el Pedro autoritario, pero con desarrollo parcial.',
  p17_full: 'Explica con claridad la tension entre amor o nostalgia y poder o venganza en Pedro Paramo.',
  p25_blank: 'Sin respuesta sobre la interpretacion global de la novela.',
  p25_gib: 'Caracteres aleatorios o sin idea reconocible sobre los ejes de la novela.',
  p25_partial: 'Nombra algunos ejes, pero sin integrarlos ni aportar evidencia suficiente.',
  p25_mid: 'Relaciona varios ejes de manera global, con evidencia parcial.',
  p25_full: 'Integra varios ejes con una interpretacion coherente y evidencia narrativa suficiente.',
  p25_offtopic: 'Se desvia hacia la estructura o el resumen, y solo toca de modo parcial los ejes solicitados.'
};

const SCORES = {
  'ANDRAES MARDONES IANFRANCO YOVANY': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['3/3', 5, 'p25_full'] },
  'ARIAS DIAZ DYLAN VICENTE': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['3/3', 5, 'p25_full'] },
  'ASCENCIO ROZAS MAXIMO MARIANO': { pedro_11: ['0/3', 0, 'p11_blank'], pedro_17: ['0/3', 0, 'p17_blank'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'BECERRA PIZARRO BASTIAN IGNACIO': { pedro_11: ['1/3', 1, 'p11_partial'], pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['1/3', 2, 'p25_offtopic'] },
  'BUSTOS DIAZ MARTIN ALFONSO': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'CABRERA SAN MARTIN JOSE VICENTE': { pedro_11: ['1/3', 1, 'p11_partial'], pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['1/3', 2, 'p25_partial'] },
  'CARRASCO JORQUERA HALAN FRANCISCO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'COBA ECHEVERRIA ADRIAN ALEJANDRO': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'COFRE GONZALEZ RENATO AGUSTIN': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'ESPINOZA DONOSO YAN NICOLAS': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'FARIAS ESPINOZA MARTIN IGNACIO': { pedro_11: ['0/3', 0, 'p11_blank'], pedro_17: ['0/3', 0, 'p17_blank'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'FLORES ALBORNOZ PABLO ANDRES': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'FUENTES SAN MARTIN DIEGO IGNACIO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'GOMEZ MORA VALENTIN MAXIMILIANO': { pedro_11: ['0/3', 0, 'p11_gib'], pedro_17: ['0/3', 0, 'p17_gib'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'GONZALEZ ACEVEDO MICHAEL MAURICIO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'GONZALEZ SAAVEDRA JOAQUIN ANDRES': { pedro_11: ['1/3', 1, 'p11_partial'], pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['1/3', 2, 'p25_partial'] },
  'GONZALEZ SAZO BENJAMIN ARNOLDO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['0/3', 0, 'p17_blank'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'GONZALEZ VALENZUELA JAVIER IGNACIO': { pedro_11: ['0/3', 0, 'p11_gib'], pedro_17: ['0/3', 0, 'p17_gib'], pedro_25: ['0/3', 0, 'p25_gib'] },
  'GUTIERREZ CESPEDES MAXIMILIANO ANDRES': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'MOYA ORELLANA ARIEL IGNACIO': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'MUNOZ MEZA AGUSTIN EDUARDO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['1/3', 2, 'p25_partial'] },
  'MUNOZ MORALES MARCO ANTONIO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['0/3', 0, 'p17_blank'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'POBLETE MUNOZ JOAQUIN ALEXIS': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['3/3', 5, 'p25_full'] },
  'RAMIREZ ARANCIBIA BENJAMIN IGNACIO': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['1/3', 2, 'p25_offtopic'] },
  'RAMIREZ TORRES CRISTOBAL IGNACIO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['1/3', 2, 'p25_offtopic'] },
  'RAMOS VARGAS CRISTOBAL GABRIEL': { pedro_11: ['0/3', 0, 'p11_gib'], pedro_17: ['0/3', 0, 'p17_gib'], pedro_25: ['0/3', 0, 'p25_gib'] },
  'REYES IMAS CRISTOBAL ANTONIO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['1/3', 2, 'p25_partial'] },
  'ROJAS BERNAL MARCELO IGNACIO': { pedro_11: ['2/3', 3, 'p11_mid'], pedro_17: ['2/3', 2, 'p17_mid'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'SANCHEZ RODRIGUEZ SIMON ALEXIS': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'TEJOS ESPINA SERGIO ABEL': { pedro_11: ['0/3', 0, 'p11_blank'], pedro_17: ['0/3', 0, 'p17_blank'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'UNDA MORAN MARCOS VICENTE': { pedro_11: ['3/3', 4, 'p11_full'], pedro_17: ['3/3', 3, 'p17_full'], pedro_25: ['3/3', 5, 'p25_full'] }
};

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
});

const db = admin.database();

function buildItem(value) {
  return { nivel: value[0], puntos: value[1], evidencia: EV[value[2]] };
}

function buildItemFromExisting(value, fallbackKey) {
  if (!value || typeof value !== 'object') return buildItem(['0/3', 0, fallbackKey]);
  return {
    nivel: value.nivel || '0/3',
    puntos: Number(value.puntos || 0),
    evidencia: value.evidencia || EV[fallbackKey]
  };
}

function buildPiePlaceholder() {
  return { nivel: 'PIE', puntos: 0, evidencia: 'Prueba PIE individual autoevaluada sin desarrollo pendiente.' };
}

function noteColor(nota) {
  if (nota >= 6) return '#2563eb';
  if (nota >= 5) return '#16a34a';
  if (nota >= 4) return '#d97706';
  return '#dc2626';
}

(async () => {
  try {
    const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
    const submitted = (audit.submittedAll || audit.submittedFull || []).slice();
    const itemMeta = Object.fromEntries((audit.manualItems || []).map(item => [item.id, item]));
    const roster = fs.readFileSync(ROSTER_PATH, 'utf8')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [nombre, rut, curso] = line.split(';');
        return { nombre, rut, curso };
      });

    const now = Date.now();
    const planilla = [];

    for (const student of submitted) {
      const key = normalizeName(student.nombre);
      const scoreRow = SCORES[key];
      const auto = Number(student.auto || 0);
      const autoMax = Number(student.auto_total || AUTO_MAX) || AUTO_MAX;
      const totalMax = Number(student.puntaje_total_prueba || autoMax) || autoMax;
      const isAutoOnlySession = !scoreRow && !student.correccion_manual && Number(student.manual_pendientes || 0) === 0 && totalMax === autoMax;
      if (!scoreRow && !student.correccion_manual && !isAutoOnlySession) throw new Error('Falta correccion para ' + student.nombre);

      const pedro_11 = isAutoOnlySession ? buildPiePlaceholder() : (scoreRow ? buildItem(scoreRow.pedro_11) : buildItemFromExisting(student.correccion_manual && student.correccion_manual.pedro_11, 'p11_blank'));
      const pedro_17 = isAutoOnlySession ? buildPiePlaceholder() : (scoreRow ? buildItem(scoreRow.pedro_17) : buildItemFromExisting(student.correccion_manual && student.correccion_manual.pedro_17, 'p17_blank'));
      const pedro_25 = isAutoOnlySession ? buildPiePlaceholder() : (scoreRow ? buildItem(scoreRow.pedro_25) : buildItemFromExisting(student.correccion_manual && student.correccion_manual.pedro_25, 'p25_blank'));
      const des = isAutoOnlySession ? 0 : (pedro_11.puntos + pedro_17.puntos + pedro_25.puntos);
      const desMax = isAutoOnlySession ? 0 : DES_MAX;
      const total = auto + des;
      const porcentaje = Math.round((total / totalMax) * 100);
      const nota = calcularNota(total, totalMax, EXIGENCIA);
      const estado = nota >= 4 ? 'Aprobado' : 'Reprobado';
      const registro = {
        nombre: student.nombre,
        rut: student.rut_actual || student.rut_roster || '',
        curso: CURSO,
        auto_puntaje: auto,
        auto_total: autoMax,
        pedro_11,
        pedro_17,
        pedro_25,
        desarrollo_puntaje: des,
        desarrollo_total: desMax,
        puntaje_total: total,
        puntaje_max: totalMax,
        porcentaje,
        nota,
        exigencia: EXIGENCIA,
        corregido_por: 'Francisco Nunez',
        corregido_at: now
      };

      await db.ref('plataforma_lecturas/correcciones_manual/' + student.sid + '/' + student.uid).set(registro);
      await db.ref('plataforma_lecturas/resultados/' + student.sid + '/' + student.uid).update({
        manual_pendientes: 0,
        puntaje_desarrollo_manual: des,
        puntaje_total_final: total,
        puntaje_max_final: totalMax,
        porcentaje_final: porcentaje,
        nota_final: nota,
        manual_corregido: true,
        manual_corregido_at: now
      });

      planilla.push({
        nombre: student.nombre,
        rut: registro.rut,
        sid: student.sid,
        auto,
        autoMax,
        pedro_11,
        pedro_17,
        pedro_25,
        respuestas: student.respuestas || {},
        des,
        desMax,
        total,
        totalMax,
        nota,
        porcentaje,
        estado,
        specialSession: isAutoOnlySession
      });
    }

    planilla.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    const submittedNames = new Set(submitted.map(student => normalizeName(student.nombre)));
    const noEnviados = roster.filter(student => !submittedNames.has(normalizeName(student.nombre)));
    const promedio = planilla.length ? +(planilla.reduce((acc, row) => acc + row.nota, 0) / planilla.length).toFixed(1) : 0;
    const aprobados = planilla.filter(row => row.nota >= 4).length;
    const reprobados = planilla.length - aprobados;
    const top = planilla.reduce((best, row) => Math.max(best, row.nota), 0);
    const low = planilla.reduce((worst, row) => Math.min(worst, row.nota), 7);

    const csvRows = [
      ['N', 'Nombre', 'RUT', 'Auto', 'P11', 'P17', 'P25', 'Des', 'Total', 'Porcentaje', 'Nota', 'Estado']
    ];
    planilla.forEach((row, index) => {
      csvRows.push([
        index + 1,
        row.nombre,
        row.rut,
        row.auto + '/' + row.autoMax,
        row.specialSession ? 'PIE' : (row.pedro_11.puntos + ' (' + row.pedro_11.nivel + ')'),
        row.specialSession ? 'PIE' : (row.pedro_17.puntos + ' (' + row.pedro_17.nivel + ')'),
        row.specialSession ? 'PIE' : (row.pedro_25.puntos + ' (' + row.pedro_25.nivel + ')'),
        row.des + '/' + row.desMax,
        row.total + '/' + row.totalMax,
        row.porcentaje + '%',
        row.nota.toFixed(1),
        row.estado
      ]);
    });
    fs.writeFileSync(CSV_PATH, '\ufeff' + csvRows.map(row => row.map(csvEscape).join(';')).join('\n'), 'utf8');

    const rowsHtml = planilla.map((row, index) => {
      return '<tr>'
        + '<td>' + (index + 1) + '</td>'
        + '<td class="name">' + htmlEscape(row.nombre) + '</td>'
        + '<td>' + htmlEscape(row.rut) + '</td>'
        + '<td>' + row.auto + '/' + row.autoMax + '</td>'
        + '<td>' + (row.specialSession ? 'PIE' : (row.pedro_11.puntos + ' <span class="lvl">' + htmlEscape(row.pedro_11.nivel) + '</span>')) + '</td>'
        + '<td>' + (row.specialSession ? 'PIE' : (row.pedro_17.puntos + ' <span class="lvl">' + htmlEscape(row.pedro_17.nivel) + '</span>')) + '</td>'
        + '<td>' + (row.specialSession ? 'PIE' : (row.pedro_25.puntos + ' <span class="lvl">' + htmlEscape(row.pedro_25.nivel) + '</span>')) + '</td>'
        + '<td>' + row.des + '/' + row.desMax + '</td>'
        + '<td>' + row.total + '/' + row.totalMax + '</td>'
        + '<td class="nota" style="color:' + noteColor(row.nota) + '">' + row.nota.toFixed(1) + '</td>'
        + '<td>' + row.estado + '</td>'
        + '</tr>';
    }).join('');

    const studentLinksHtml = planilla.map((row, index) => {
      const id = studentId(index, row.nombre);
      return '<a class="student-link" href="#' + id + '">' + htmlEscape(row.nombre) + '</a>';
    }).join('');

    const individualHtml = planilla.map((row, index) => {
      const id = studentId(index, row.nombre);
      const reportBody = row.specialSession
        ? '<div class="item-report-grid"><section class="item-report"><h4>Prueba PIE individual</h4><div class="score-line">Sesion ' + htmlEscape(row.sid) + '</div><div class="feedback">Esta evaluacion corresponde a una variante PIE individual autoevaluada. Se calcula sobre ' + row.autoMax + ' puntos sin desarrollo pendiente.</div></section></div>'
        : '<div class="item-report-grid">'
          + '<section class="item-report">'
          + '<h4>P11 · ' + htmlEscape(itemMeta.pedro_11 ? itemMeta.pedro_11.enunciado : 'Comala') + '</h4>'
          + '<div class="score-line">Nivel ' + htmlEscape(row.pedro_11.nivel) + ' · ' + row.pedro_11.puntos + ' pts</div>'
          + '<div class="feedback">' + htmlEscape(row.pedro_11.evidencia) + '</div>'
          + '<div class="answer-box">' + answerHtml(row.respuestas.pedro_11) + '</div>'
          + '</section>'
          + '<section class="item-report">'
          + '<h4>P17 · ' + htmlEscape(itemMeta.pedro_17 ? itemMeta.pedro_17.enunciado : 'Complejidad de Pedro Paramo') + '</h4>'
          + '<div class="score-line">Nivel ' + htmlEscape(row.pedro_17.nivel) + ' · ' + row.pedro_17.puntos + ' pts</div>'
          + '<div class="feedback">' + htmlEscape(row.pedro_17.evidencia) + '</div>'
          + '<div class="answer-box">' + answerHtml(row.respuestas.pedro_17) + '</div>'
          + '</section>'
          + '<section class="item-report">'
          + '<h4>P25 · ' + htmlEscape(itemMeta.pedro_25 ? itemMeta.pedro_25.enunciado : 'Interpretacion global') + '</h4>'
          + '<div class="score-line">Nivel ' + htmlEscape(row.pedro_25.nivel) + ' · ' + row.pedro_25.puntos + ' pts</div>'
          + '<div class="feedback">' + htmlEscape(row.pedro_25.evidencia) + '</div>'
          + '<div class="answer-box">' + answerHtml(row.respuestas.pedro_25) + '</div>'
          + '</section>'
          + '</div>';
      return '<article class="student-report" id="' + id + '">'
        + '<div class="student-head">'
        + '<div><h3>' + htmlEscape(row.nombre) + '</h3><p>' + htmlEscape(row.rut) + ' · ' + CURSO + '</p></div>'
        + '<div class="student-note" style="color:' + noteColor(row.nota) + '">' + row.nota.toFixed(1) + '</div>'
        + '</div>'
        + '<div class="student-stats">'
        + '<div class="mini-stat"><span>Auto</span><strong>' + row.auto + '/' + row.autoMax + '</strong></div>'
        + '<div class="mini-stat"><span>Desarrollo</span><strong>' + row.des + '/' + row.desMax + '</strong></div>'
        + '<div class="mini-stat"><span>Total</span><strong>' + row.total + '/' + row.totalMax + '</strong></div>'
        + '<div class="mini-stat"><span>Logro</span><strong>' + row.porcentaje + '%</strong></div>'
        + '</div>'
        + reportBody
        + '</article>';
    }).join('');

    const noEnviadosHtml = noEnviados.length
      ? '<ul>' + noEnviados.map(student => '<li>' + htmlEscape(student.nombre) + ' · ' + htmlEscape(student.rut) + '</li>').join('') + '</ul>'
      : '<p>Todos los estudiantes de la nomina aparecen enviados en la base.</p>';

    const html = '<!DOCTYPE html>'
      + '<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
      + '<title>Informe Final Pedro Paramo 3D-TP 2026</title>'
      + '<style>'
      + 'body{font-family:Georgia,serif;background:#f8fafc;color:#0f172a;margin:0;padding:24px;} '
      + '.wrap{max-width:1280px;margin:0 auto;} '
      + '.hero{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;border-radius:20px;padding:28px 30px;margin-bottom:20px;} '
      + '.hero h1{margin:0 0 8px;font-size:34px;line-height:1.1;} '
      + '.hero p{margin:4px 0 0;color:#cbd5e1;font-size:15px;} '
      + '.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:20px 0;} '
      + '.card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:18px;box-shadow:0 8px 24px rgba(15,23,42,.06);} '
      + '.card .k{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:8px;} '
      + '.card .v{font-size:28px;font-weight:700;} '
      + '.panel{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:20px;box-shadow:0 8px 24px rgba(15,23,42,.06);margin-bottom:18px;} '
      + 'table{width:100%;border-collapse:collapse;font-size:14px;} '
      + 'th,td{padding:10px 8px;border-bottom:1px solid #e2e8f0;text-align:center;} '
      + 'th{background:#f8fafc;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#475569;} '
      + 'td.name{text-align:left;font-weight:600;} '
      + '.lvl{display:inline-block;margin-left:4px;font-size:11px;color:#64748b;} '
      + '.nota{font-weight:800;font-size:16px;} '
      + '.student-detail{border-top:1px solid #e2e8f0;padding:12px 0;} '
      + '.student-detail summary{cursor:pointer;font-weight:700;} '
      + '.detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:12px;} '
      + '.detail-grid div{background:#f8fafc;border-radius:14px;padding:12px;border:1px solid #e2e8f0;} '
      + '.detail-grid span{display:block;margin-top:6px;font-size:13px;color:#334155;line-height:1.45;} '
      + '.student-links{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;} '
      + '.student-link{display:inline-block;padding:8px 12px;border-radius:999px;background:#eff6ff;color:#1d4ed8;text-decoration:none;font-size:12px;font-weight:700;border:1px solid #bfdbfe;} '
      + '.student-report{border-top:1px solid #e2e8f0;padding:20px 0;} '
      + '.student-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:14px;} '
      + '.student-head h3{margin:0;font-size:22px;} '
      + '.student-head p{margin:4px 0 0;color:#64748b;font-size:13px;} '
      + '.student-note{font-size:34px;font-weight:800;line-height:1;} '
      + '.student-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:16px;} '
      + '.mini-stat{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:12px;} '
      + '.mini-stat span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:4px;} '
      + '.mini-stat strong{font-size:20px;} '
      + '.item-report-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;} '
      + '.item-report{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:14px;} '
      + '.item-report h4{margin:0 0 10px;font-size:15px;line-height:1.35;} '
      + '.score-line{font-weight:700;color:#0f172a;margin-bottom:8px;} '
      + '.feedback{font-size:13px;line-height:1.45;color:#334155;margin-bottom:10px;} '
      + '.answer-box{background:#fff;border:1px dashed #cbd5e1;border-radius:12px;padding:12px;font-size:13px;line-height:1.5;color:#1e293b;} '
      + '.muted{color:#64748b;font-size:13px;} '
      + '@media print{body{background:#fff;padding:0}.panel,.card,.hero{box-shadow:none}}'
      + '</style></head><body><div class="wrap">'
      + '<section class="hero"><h1>Informe Final · Pedro Paramo · ' + CURSO + '</h1>'
      + '<p>Sesiones: regular, intermedia y PIE individual · Escala 1.0 a 7.0 · Exigencia 60% · Total 37 pts (25 auto + 12 desarrollo)</p>'
      + '<p>Generado automaticamente el ' + new Date(now).toLocaleString('es-CL') + '</p></section>'
      + '<section class="cards">'
      + '<div class="card"><div class="k">Pruebas corregidas</div><div class="v">' + planilla.length + '</div></div>'
      + '<div class="card"><div class="k">Promedio final</div><div class="v">' + promedio.toFixed(1) + '</div></div>'
      + '<div class="card"><div class="k">Aprobados</div><div class="v">' + aprobados + '</div><div class="muted">Reprobados: ' + reprobados + '</div></div>'
      + '<div class="card"><div class="k">Maxima / Minima</div><div class="v">' + top.toFixed(1) + ' / ' + low.toFixed(1) + '</div></div>'
      + '</section>'
      + '<section class="panel"><h2>Planilla final</h2><table><thead><tr><th>#</th><th>Nombre</th><th>RUT</th><th>Auto</th><th>P11</th><th>P17</th><th>P25</th><th>Des</th><th>Total</th><th>Nota</th><th>Estado</th></tr></thead><tbody>' + rowsHtml + '</tbody></table></section>'
      + '<section class="panel"><h2>Informe por estudiante</h2><div class="student-links">' + studentLinksHtml + '</div>' + individualHtml + '</section>'
      + '<section class="panel"><h2>Nomina sin envio en base</h2><p class="muted">La base actual sigue registrando ' + planilla.length + ' pruebas enviadas de ' + roster.length + ' estudiantes en nomina.</p>' + noEnviadosHtml + '</section>'
      + '</div></body></html>';
    fs.writeFileSync(HTML_PATH, html, 'utf8');
    fs.writeFileSync(LOCAL_HTML_PATH, html, 'utf8');

    console.log('Corregidos y actualizados en RTDB:', planilla.length);
    console.log('Promedio final:', promedio.toFixed(1));
    console.log('CSV:', CSV_PATH);
    console.log('HTML:', HTML_PATH);
    console.log('HTML local:', LOCAL_HTML_PATH);
    console.table(planilla.map(row => ({ nombre: row.nombre, auto: row.auto, des: row.des, total: row.total, nota: row.nota })));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
