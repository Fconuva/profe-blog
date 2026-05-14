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

const CURSO = '3B-TP';
const AUTO_MAX = 25;
const DES_MAX = 12;
const MAX = 37;
const EXIGENCIA = 0.6;
const ROOT = __dirname;
const AUDIT_PATH = path.join(ROOT, '_tmp_3btp_auditoria.json');
const ROSTER_PATH = path.join(ROOT, 'carga_3B_TP.txt');
// RUT con licencia medica u otra justificacion: no se incluyen en planilla ni informe.
const EXCLUDE_RUTS = new Set([
  '23200397-9' // BARRUETO ABARZUA BENJAMIN ALEJANDRO - licencia medica
]);
// Estudiantes que NO finalizaron la prueba — se incluyen en el informe asumiendo que el
// no-envio pudo ser falla de plataforma. Se corrigen con las respuestas registradas en RTDB.
// (Antes este set excluia, pero los nombres no calzaban con el roster real, asi que en la
// practica solo afectaba a ALBORNOZ y ESPINOSA. Decision: incluirlos a todos con su correccion.)
const INCOMPLETE_NAMES = new Set();
const REPORT_DIR = path.join(ROOT, 'lecturas', 'adminprofe', 'reportes');
const CSV_PATH = path.join(REPORT_DIR, 'Planilla_Pedro_Paramo_3B_TP_2026.csv');
const HTML_PATH = path.join(REPORT_DIR, 'Informe_Final_Pedro_Paramo_3B_TP_2026.html');
const LOCAL_HTML_PATH = path.join(REPORT_DIR, 'Informe_Local_Con_Individuales_Pedro_Paramo_3B_TP_2026.html');

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

// Correccion manual P11/P17/P25. Niveles: blank/gib(0), partial(1|2), mid(3|2|3), full(4|3|5), offtopic(2). Max 4-3-5.
const SCORES = {
  'ALBORNOZ GAJARDO PABLO ANTONIO':        { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'AMIGO SEPULVEDA NICOLAS JESUS':         { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['1/3', 2, 'p25_partial'] },
  'ARAYA NUNEZ LUCIANO RODRIGO':           { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['2/3', 3, 'p25_mid'] },
  'ARREDONDO VALDES MATIAS JESUS':         { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'AVACA CANDIA MATIAS IGNACIO':           { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['0/3', 0, 'p25_blank'] },
  'BARRIOS GONZALEZ NELSON MARTIN':        { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'BRAVO CESPEDES NICOLAS FRANCISCO':      { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'CABELLO PARRA VICENTE JESUS':           { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['1/3', 2, 'p25_partial'] },
  'CACERES ESPINOZA ANTONIO AURELIO':      { pedro_11: ['0/3', 0, 'p11_blank'],   pedro_17: ['0/3', 0, 'p17_blank'],   pedro_25: ['0/3', 0, 'p25_blank'] },
  'CARRENO CARRENO DAMIAN ALONSO':         { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'CASTRO ARAVENA GIANFRANCO BENJAMIN IGNACIO': { pedro_11: ['0/3', 0, 'p11_gib'], pedro_17: ['0/3', 0, 'p17_gib'],     pedro_25: ['0/3', 0, 'p25_gib'] },
  'CERDA BRIONES CRISTOBAL EDUARDO':       { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'DIAZ NUNEZ MISAEL ALEJANDRO':           { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['3/3', 5, 'p25_full'] },
  'DIAZ VALENZUELA AGUSTIN VICENTE':       { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'DOTE MUNOZ MATIAS ARMANDO':             { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'DUMONT ORELLANA NICOLAS ANDRES':        { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['0/3', 0, 'p25_blank'] },
  'ESPINOSA MINO MAGDIEL DE CIRENE':       { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['2/3', 3, 'p25_mid'] },
  'FUENTES NUNEZ FELIPE ANTONIO':          { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['2/3', 3, 'p25_mid'] },
  'FUENTES SANCHEZ CRISTOBAL ALONSO':      { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'GAETE IBARRA JOAQUIN ALONSO':           { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'GARRIDO RETAMAL SEBASTIAN JESUS':       { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['1/3', 2, 'p25_partial'] },
  'GIRALDO RIVAS OSCAR IVAN':              { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['0/3', 0, 'p17_gib'],     pedro_25: ['0/3', 0, 'p25_gib'] },
  'GONZALEZ CARRENO FRANCO ALONSO':        { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['2/3', 3, 'p25_mid'] },
  'GONZALEZ CASTILLO NICOLAS BENJAMIN':    { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['0/3', 0, 'p17_blank'],   pedro_25: ['0/3', 0, 'p25_blank'] },
  'GUTIERREZ RODRIGUEZ FRANCISCO IGNACIO': { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'LABRA YANEZ DIEGO AGUSTIN':             { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'LOPEZ REBECO DANTE IGNACIO':            { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'MEJIAS RAMIREZ DANIEL ISAIAS':          { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['1/3', 2, 'p25_partial'] },
  'MUNOZ CARRENO AGUSTIN ANDRES ERNAN':    { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['2/3', 3, 'p25_mid'] },
  'MUNOZ LOPEZ JOAQUIN IGNACIO ANTONIO':   { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['2/3', 3, 'p25_mid'] },
  'NAVARRETE NUNEZ FERNANDO ALONSO':       { pedro_11: ['0/3', 0, 'p11_blank'],   pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['0/3', 0, 'p25_gib'] },
  'OVIEDO RODRIGUEZ FRANCISCO GABRIEL':    { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['1/3', 2, 'p25_partial'] },
  'PEREZ VELOSO MARTIN ALEXIS':            { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'PINCHEIRA OPAZO MAXIMILIANO IGNACIO':   { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['3/3', 5, 'p25_full'] },
  'QUIROZ DIAZ TOMAS MAURICIO':            { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['3/3', 5, 'p25_full'] },
  'REYES SANCHEZ GABRIEL ENRIQUE':         { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['1/3', 1, 'p25_partial'] },
  'ROJAS ABDALA SAID KAMIL MAURICIO':      { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['1/3', 1, 'p17_partial'], pedro_25: ['2/3', 3, 'p25_mid'] },
  'ROJAS HERRERA JOAQUIN IGNACIO':         { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'SAAVEDRA TORRES RENATO ALONSO':         { pedro_11: ['0/3', 0, 'p11_blank'],   pedro_17: ['0/3', 0, 'p17_blank'],   pedro_25: ['0/3', 0, 'p25_blank'] },
  'SAZO MUNOZ LUIS GONZALO':               { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'TEJOS LOBOS GUILIAN ANDRES':            { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['3/3', 5, 'p25_full'] },
  'TEJOS LOBOS KEVIN ANTONIO':             { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'TOLEDO LLANOS CESAR ALEXIS':            { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'VALDERRAMA LARA BENJAMIN JESUS':        { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'VERA BASTIDAS EDUARDO ESTEBAN':         { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['2/3', 3, 'p25_mid'] },
  'YANEZ JARA THOMAS ESTEBAN':             { pedro_11: ['2/3', 3, 'p11_mid'],     pedro_17: ['3/3', 3, 'p17_full'],    pedro_25: ['3/3', 5, 'p25_full'] },
  'YEVENES PARADA CRISTOPHER ALEXSANDER':  { pedro_11: ['3/3', 4, 'p11_full'],    pedro_17: ['2/3', 2, 'p17_mid'],     pedro_25: ['2/3', 3, 'p25_mid'] }
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

function noteColor(nota) {
  if (nota >= 6) return '#2563eb';
  if (nota >= 5) return '#16a34a';
  if (nota >= 4) return '#d97706';
  return '#dc2626';
}

(async () => {
  try {
    const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf8'));
    const incompletosManual = [];
    const submitted = (audit.submittedAll || audit.submittedFull || [])
      .filter(s => !EXCLUDE_RUTS.has(s.rut_actual) && !EXCLUDE_RUTS.has(s.rut_roster))
      .filter(s => {
        const key = normalizeName(s.nombre);
        if (INCOMPLETE_NAMES.has(key)) {
          incompletosManual.push({
            nombre: s.nombre,
            rut: s.rut_actual || s.rut_roster || '',
            answered: s.answered || s.respuestas_count || '?',
            total_items: s.total_items || '?'
          });
          return false;
        }
        return true;
      })
      .slice();
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
      if (!scoreRow) throw new Error('Falta correccion para ' + student.nombre);

      const pedro_11 = buildItem(scoreRow.pedro_11);
      const pedro_17 = buildItem(scoreRow.pedro_17);
      const pedro_25 = buildItem(scoreRow.pedro_25);
      const auto = Number(student.auto || 0);
      const des = pedro_11.puntos + pedro_17.puntos + pedro_25.puntos;
      const total = auto + des;
      const porcentaje = Math.round((total / MAX) * 100);
      const nota = calcularNota(total, MAX, EXIGENCIA);
      const estado = nota >= 4 ? 'Aprobado' : 'Reprobado';
      const registro = {
        nombre: student.nombre,
        rut: student.rut_actual || student.rut_roster || '',
        curso: CURSO,
        auto_puntaje: auto,
        auto_total: AUTO_MAX,
        pedro_11,
        pedro_17,
        pedro_25,
        desarrollo_puntaje: des,
        desarrollo_total: DES_MAX,
        puntaje_total: total,
        puntaje_max: MAX,
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
        puntaje_max_final: MAX,
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
        pedro_11,
        pedro_17,
        pedro_25,
        respuestas: student.respuestas || {},
        des,
        total,
        nota,
        porcentaje,
        estado
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
      ['N', 'Nombre', 'RUT', 'Sesion', 'Auto/25', 'P11', 'P17', 'P25', 'Des/12', 'Total/37', 'Porcentaje', 'Nota', 'Estado']
    ];
    planilla.forEach((row, index) => {
      csvRows.push([
        index + 1,
        row.nombre,
        row.rut,
        row.sid,
        row.auto + '/25',
        row.pedro_11.puntos + ' (' + row.pedro_11.nivel + ')',
        row.pedro_17.puntos + ' (' + row.pedro_17.nivel + ')',
        row.pedro_25.puntos + ' (' + row.pedro_25.nivel + ')',
        row.des + '/12',
        row.total + '/37',
        row.porcentaje + '%',
        row.nota.toFixed(1),
        row.estado
      ]);
    });
    fs.writeFileSync(CSV_PATH, '\ufeff' + csvRows.map(row => row.map(csvEscape).join(';')).join('\n'), 'utf8');

    // Estilo canonico 3D-TP: morado, A4 landscape, ordenado por nota desc.
    const planillaOrdenada = planilla.slice().sort((a, b) => b.nota - a.nota || a.nombre.localeCompare(b.nombre, 'es'));

    // Distribucion por nivel de desempeno
    const niveles = { avanzado: 0, satisfactorio: 0, elemental: 0, insuficiente: 0 };
    planillaOrdenada.forEach(row => {
      const pct = row.porcentaje;
      if (pct >= 85) niveles.avanzado++;
      else if (pct >= 70) niveles.satisfactorio++;
      else if (pct >= 50) niveles.elemental++;
      else niveles.insuficiente++;
    });
    const totalP = planillaOrdenada.length;
    const pctNivel = (n) => totalP ? Math.round((n / totalP) * 100) : 0;

    // Promedios por seccion y por pregunta
    const promAuto = totalP ? +(planillaOrdenada.reduce((a, r) => a + r.auto, 0) / totalP).toFixed(1) : 0;
    const promDes = totalP ? +(planillaOrdenada.reduce((a, r) => a + r.des, 0) / totalP).toFixed(1) : 0;
    const promP11 = totalP ? +(planillaOrdenada.reduce((a, r) => a + r.pedro_11.puntos, 0) / totalP).toFixed(1) : 0;
    const promP17 = totalP ? +(planillaOrdenada.reduce((a, r) => a + r.pedro_17.puntos, 0) / totalP).toFixed(1) : 0;
    const promP25 = totalP ? +(planillaOrdenada.reduce((a, r) => a + r.pedro_25.puntos, 0) / totalP).toFixed(1) : 0;
    const pctAuto = AUTO_MAX ? Math.round((promAuto / AUTO_MAX) * 100) : 0;
    const pctDes = DES_MAX ? Math.round((promDes / DES_MAX) * 100) : 0;
    const pctP11 = Math.round((promP11 / 4) * 100);
    const pctP17 = Math.round((promP17 / 3) * 100);
    const pctP25 = Math.round((promP25 / 5) * 100);
    const pctAprob = totalP ? Math.round((aprobados / totalP) * 100) : 0;
    const pctRep = 100 - pctAprob;
    const dificultad = (pct) => pct >= 70 ? { txt: 'Fácil', color: '#16a34a' } : pct >= 50 ? { txt: 'Media', color: '#d97706' } : { txt: 'Difícil', color: '#dc2626' };
    const colorBar = (pct) => pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';

    const incompletos = incompletosManual.length
      ? incompletosManual
      : (audit.incompletos || []).filter(s => !EXCLUDE_RUTS.has(s.rut));

    const rowsHtml = planillaOrdenada.map(row => {
      const estadoBg = row.nota >= 4 ? '#dcfce7' : '#fee2e2';
      const estadoColor = row.nota >= 4 ? '#16a34a' : '#dc2626';
      const notaColor = row.nota >= 6 ? '#16a34a' : row.nota >= 5 ? '#1e3a5f' : row.nota >= 4 ? '#d97706' : '#dc2626';
      return '<tr>'
        + '<td class="name-cell" title="' + htmlEscape(row.nombre) + '">' + htmlEscape(row.nombre) + '</td>'
        + '<td style="text-align:center;font-size:10px;color:#666;">' + htmlEscape(row.rut) + '</td>'
        + '<td class="mc-cell">' + row.auto + '/25</td>'
        + '<td class="dev-cell">' + row.pedro_11.puntos + '/4 <span style="color:#999;">(' + htmlEscape(row.pedro_11.nivel) + ')</span></td>'
        + '<td class="dev-cell">' + row.pedro_17.puntos + '/3 <span style="color:#999;">(' + htmlEscape(row.pedro_17.nivel) + ')</span></td>'
        + '<td class="dev-cell">' + row.pedro_25.puntos + '/5 <span style="color:#999;">(' + htmlEscape(row.pedro_25.nivel) + ')</span></td>'
        + '<td class="mc-cell">' + row.des + '/12</td>'
        + '<td class="mc-cell" style="font-weight:700;">' + row.total + '/37</td>'
        + '<td class="mc-cell">' + row.porcentaje + '%</td>'
        + '<td class="mc-cell" style="font-size:14px;font-weight:800;color:' + notaColor + ';">' + row.nota.toFixed(1) + '</td>'
        + '<td style="text-align:center;"><span style="background:' + estadoBg + ';color:' + estadoColor + ';padding:3px 8px;border-radius:6px;font-size:9px;font-weight:700;">' + (row.nota >= 4 ? 'APROBADO' : 'REPROBADO') + '</span></td>'
        + '</tr>';
    }).join('');

    const incompletosHtml = incompletos.length
      ? '<ul style="margin:0;padding-left:18px;font-size:11px;line-height:1.7;">' + incompletos.map(s => '<li>' + htmlEscape(s.nombre) + ' — ' + htmlEscape(s.rut || 's/r') + ' — respondió ' + s.answered + '/' + s.total_items + ' ítems (no finalizó)</li>').join('') + '</ul>'
      : '<p style="font-size:11px;color:#666;">Todos los enviados completaron la prueba.</p>';
    const noEnviadosHtml = noEnviados.length
      ? '<ul style="margin:0;padding-left:18px;font-size:11px;line-height:1.7;">' + noEnviados.map(s => '<li>' + htmlEscape(s.nombre) + ' — ' + htmlEscape(s.rut) + '</li>').join('') + '</ul>'
      : '<p style="font-size:11px;color:#666;">Todos los estudiantes registraron envío.</p>';

    // Informe por estudiante (mantengo seccion anexa con respuestas y feedback)
    const studentLinksHtml = planillaOrdenada.map((row, index) => {
      const id = studentId(index, row.nombre);
      return '<a class="student-link" href="#' + id + '">' + htmlEscape(row.nombre) + '</a>';
    }).join('');

    const individualHtml = planillaOrdenada.map((row, index) => {
      const id = studentId(index, row.nombre);
      const notaColor = row.nota >= 6 ? '#16a34a' : row.nota >= 5 ? '#1e3a5f' : row.nota >= 4 ? '#d97706' : '#dc2626';
      return '<article class="student-report" id="' + id + '">'
        + '<div class="student-head">'
        + '<div><h3>' + htmlEscape(row.nombre) + '</h3><p>' + htmlEscape(row.rut) + ' · ' + CURSO + '</p></div>'
        + '<div class="student-note" style="color:' + notaColor + ';">' + row.nota.toFixed(1) + '</div>'
        + '</div>'
        + '<div class="student-stats">'
        + '<div class="mini-stat"><span>Auto</span><strong>' + row.auto + '/25</strong></div>'
        + '<div class="mini-stat"><span>Desarrollo</span><strong>' + row.des + '/12</strong></div>'
        + '<div class="mini-stat"><span>Total</span><strong>' + row.total + '/37</strong></div>'
        + '<div class="mini-stat"><span>Logro</span><strong>' + row.porcentaje + '%</strong></div>'
        + '</div>'
        + '<div class="item-report-grid">'
        + '<section class="item-report"><h4>P11 · ' + htmlEscape(itemMeta.pedro_11 ? itemMeta.pedro_11.enunciado : 'Comala') + '</h4>'
        + '<div class="score-line">Nivel ' + htmlEscape(row.pedro_11.nivel) + ' · ' + row.pedro_11.puntos + ' pts</div>'
        + '<div class="feedback">' + htmlEscape(row.pedro_11.evidencia) + '</div>'
        + '<div class="answer-box">' + answerHtml(row.respuestas.pedro_11) + '</div></section>'
        + '<section class="item-report"><h4>P17 · ' + htmlEscape(itemMeta.pedro_17 ? itemMeta.pedro_17.enunciado : 'Complejidad de Pedro Paramo') + '</h4>'
        + '<div class="score-line">Nivel ' + htmlEscape(row.pedro_17.nivel) + ' · ' + row.pedro_17.puntos + ' pts</div>'
        + '<div class="feedback">' + htmlEscape(row.pedro_17.evidencia) + '</div>'
        + '<div class="answer-box">' + answerHtml(row.respuestas.pedro_17) + '</div></section>'
        + '<section class="item-report"><h4>P25 · ' + htmlEscape(itemMeta.pedro_25 ? itemMeta.pedro_25.enunciado : 'Interpretacion global') + '</h4>'
        + '<div class="score-line">Nivel ' + htmlEscape(row.pedro_25.nivel) + ' · ' + row.pedro_25.puntos + ' pts</div>'
        + '<div class="feedback">' + htmlEscape(row.pedro_25.evidencia) + '</div>'
        + '<div class="answer-box">' + answerHtml(row.respuestas.pedro_25) + '</div></section>'
        + '</div></article>';
    }).join('');

    const css = '@page { size: A4 landscape; margin: 8mm; }'
      + '@media print { body { background:#fff; -webkit-print-color-adjust:exact; print-color-adjust:exact; } .page { box-shadow:none; margin:0; padding:12px; } .no-print { display:none !important; } .section-block { page-break-inside:avoid; } }'
      + '* { box-sizing:border-box; margin:0; padding:0; }'
      + 'body { font-family:"Segoe UI",system-ui,-apple-system,sans-serif; background:#f0f2f5; color:#1a1a2e; font-size:12px; line-height:1.5; }'
      + '.page { max-width:1300px; margin:20px auto; background:#fff; border-radius:14px; box-shadow:0 4px 20px rgba(0,0,0,0.08); padding:28px 32px; }'
      + '.header { display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:14px; margin-bottom:18px; border-bottom:3px solid #7c3aed; }'
      + '.header-left h1 { font-size:22px; color:#7c3aed; line-height:1.2; }'
      + '.header-left h2 { font-size:14px; color:#555; font-weight:400; margin-top:2px; }'
      + '.header-left .sub { font-size:11px; color:#999; margin-top:4px; }'
      + '.curso-badge { background:linear-gradient(135deg,#7c3aed,#a855f7); color:#fff; padding:10px 24px; border-radius:10px; font-size:20px; font-weight:800; text-align:center; letter-spacing:0.5px; }'
      + '.exig-label { font-size:11px; color:#888; text-align:center; margin-top:4px; }'
      + '.cards { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:18px 0; }'
      + '.card { background:#f8f9fa; border:1px solid #e5e7eb; border-radius:10px; padding:14px; text-align:center; }'
      + '.card-big { font-size:28px; font-weight:800; color:#7c3aed; line-height:1; }'
      + '.card-label { font-size:10px; color:#888; text-transform:uppercase; letter-spacing:0.5px; margin-top:4px; }'
      + '.card-sub { font-size:11px; color:#555; margin-top:2px; }'
      + '.card-highlight { border-color:#7c3aed; border-width:2px; }'
      + '.apr-bar { display:flex; height:28px; border-radius:8px; overflow:hidden; margin:8px 0; font-size:11px; font-weight:700; }'
      + '.apr-ok { background:#16a34a; color:#fff; display:flex; align-items:center; justify-content:center; }'
      + '.apr-no { background:#dc2626; color:#fff; display:flex; align-items:center; justify-content:center; }'
      + '.section-title { font-size:15px; font-weight:700; color:#7c3aed; margin:22px 0 10px; padding-bottom:6px; border-bottom:2px solid #e5e7eb; }'
      + 'table { width:100%; border-collapse:collapse; font-size:11px; }'
      + 'th { background:#7c3aed; color:#fff; padding:6px 8px; font-size:9px; text-transform:uppercase; letter-spacing:0.3px; text-align:center; }'
      + 'td { padding:5px 8px; border-bottom:1px solid #eee; }'
      + 'tbody tr:nth-child(even) { background:#fafbfc; }'
      + 'tbody tr:hover { background:#faf5ff; }'
      + '.name-cell { font-weight:600; font-size:10px; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }'
      + '.mc-cell { text-align:center; font-weight:700; font-size:11px; }'
      + '.dev-cell { text-align:center; font-size:10px; font-weight:600; }'
      + '.print-bar { text-align:center; margin:16px 0; }'
      + '.print-bar button { padding:10px 32px; background:linear-gradient(135deg,#7c3aed,#a855f7); color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600; }'
      + '.footer { text-align:center; font-size:10px; color:#aaa; margin-top:16px; padding-top:10px; border-top:1px solid #eee; }'
      + '.student-link { display:inline-block; padding:4px 10px; margin:2px; border-radius:999px; background:#f3e8ff; color:#7c3aed; text-decoration:none; font-size:10px; font-weight:600; border:1px solid #ddd6fe; }'
      + '.student-report { border-top:1px solid #e5e7eb; padding:18px 0; page-break-inside:avoid; }'
      + '.student-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }'
      + '.student-head h3 { font-size:16px; color:#1a1a2e; }'
      + '.student-head p { font-size:11px; color:#666; margin-top:2px; }'
      + '.student-note { font-size:32px; font-weight:800; line-height:1; }'
      + '.student-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px; }'
      + '.mini-stat { background:#f8f9fa; border:1px solid #e5e7eb; border-radius:8px; padding:8px; text-align:center; }'
      + '.mini-stat span { font-size:9px; color:#888; text-transform:uppercase; letter-spacing:0.4px; }'
      + '.mini-stat strong { display:block; font-size:16px; color:#7c3aed; margin-top:2px; }'
      + '.item-report-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }'
      + '.item-report { background:#fafbfc; border:1px solid #e5e7eb; border-radius:8px; padding:10px; }'
      + '.item-report h4 { font-size:11px; color:#7c3aed; margin-bottom:6px; }'
      + '.score-line { font-size:10px; font-weight:700; color:#1a1a2e; margin-bottom:4px; }'
      + '.feedback { font-size:10px; color:#555; margin-bottom:6px; line-height:1.4; }'
      + '.answer-box { background:#fff; border:1px dashed #cbd5e1; border-radius:6px; padding:6px 8px; font-size:10px; line-height:1.4; color:#1a1a2e; max-height:120px; overflow:auto; }';

    function distRow(label, color, count) {
      const pct = pctNivel(count);
      return '<div style="display:flex;align-items:center;gap:10px;margin:6px 0;">'
        + '<span style="width:200px;font-weight:700;font-size:12px;color:' + color + ';">' + label + '</span>'
        + '<div style="flex:1;background:#e5e7eb;border-radius:8px;height:22px;position:relative;"><div style="width:' + pct + '%;background:' + color + ';height:100%;border-radius:8px;min-width:2px;"></div></div>'
        + '<span style="width:90px;text-align:right;font-size:12px;font-weight:600;">' + count + ' (' + pct + '%)</span>'
        + '</div>';
    }
    function barCell(pct, color) {
      return '<div style="background:#e5e7eb;border-radius:8px;height:16px;width:100%;position:relative;"><div style="background:' + color + ';border-radius:8px;height:100%;width:' + pct + '%;min-width:2px;"></div><span style="position:absolute;right:6px;top:0;line-height:16px;font-size:10px;font-weight:600;">' + pct + '%</span></div>';
    }
    const difP11 = dificultad(pctP11);
    const difP17 = dificultad(pctP17);
    const difP25 = dificultad(pctP25);
    const fechaCL = new Date(now).toLocaleString('es-CL');

    const html = '<!DOCTYPE html>'
      + '<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
      + '<title>Informe Final — Pedro Páramo NM3 — ' + CURSO + ' — 2026</title>'
      + '<style>' + css + '</style></head><body><div class="page">'
      + '<div class="header">'
      + '<div class="header-left"><h1>Informe de Resultados — Prueba Pedro Páramo</h1>'
      + '<h2>Lengua y Literatura NM3 — ' + CURSO + ' — Año 2026</h2>'
      + '<p class="sub">Centro Educativo Salesianos Talca &nbsp;|&nbsp; Prof. Francisco Javier Núñez Valenzuela</p></div>'
      + '<div><div class="curso-badge">' + CURSO + '</div><div class="exig-label">Exigencia: 60% &nbsp;|&nbsp; Escala 1.0 – 7.0</div></div>'
      + '</div>'
      + '<div class="print-bar no-print"><button onclick="window.print()">🖨️ Imprimir / Guardar PDF</button></div>'
      + '<div class="section-title">Resumen General</div>'
      + '<div class="cards">'
      + '<div class="card card-highlight"><div class="card-big">' + totalP + '</div><div class="card-label">Estudiantes Evaluados</div></div>'
      + '<div class="card"><div class="card-big">' + promedio.toFixed(1) + '</div><div class="card-label">Promedio del Curso</div><div class="card-sub">' + Math.round((promAuto + promDes) / MAX * 100) + '% logro promedio</div></div>'
      + '<div class="card"><div class="card-big">' + top.toFixed(1) + '</div><div class="card-label">Nota Más Alta</div><div class="card-sub">' + low.toFixed(1) + ' más baja</div></div>'
      + '<div class="card"><div class="card-big" style="color:#16a34a;">' + aprobados + '</div><div class="card-label">Aprobados</div><div class="card-sub">' + reprobados + ' reprobados</div></div>'
      + '</div>'
      + '<div class="apr-bar">'
      + '<div class="apr-ok" style="width:' + pctAprob + '%;">✔ ' + aprobados + ' Aprobados (' + pctAprob + '%)</div>'
      + '<div class="apr-no" style="width:' + pctRep + '%;">✘ ' + reprobados + ' (' + pctRep + '%)</div>'
      + '</div>'
      + '<div class="section-title">Distribución por Nivel de Desempeño</div>'
      + '<div style="max-width:600px;">'
      + distRow('Avanzado (≥85%)', '#2563eb', niveles.avanzado)
      + distRow('Satisfactorio (70–84%)', '#16a34a', niveles.satisfactorio)
      + distRow('Elemental (50–69%)', '#d97706', niveles.elemental)
      + distRow('Insuficiente (<50%)', '#dc2626', niveles.insuficiente)
      + '</div>'
      + '<div class="section-block"><div class="section-title">Rendimiento por Sección de la Prueba</div>'
      + '<table><thead><tr><th>Sección</th><th style="text-align:left;">Contenido</th><th>Prom. Ptje</th><th>% Logro Promedio</th></tr></thead><tbody>'
      + '<tr><td style="text-align:center;font-weight:700;padding:8px;">Sección I</td>'
      + '<td style="padding:8px;">Alternativas — Comprensión Lectora (25 ítems)</td>'
      + '<td style="text-align:center;padding:8px;">' + promAuto.toFixed(1) + ' / 25</td>'
      + '<td style="padding:8px 12px;width:35%;">' + barCell(pctAuto, colorBar(pctAuto)) + '</td></tr>'
      + '<tr><td style="text-align:center;font-weight:700;padding:8px;">Sección II</td>'
      + '<td style="padding:8px;">Desarrollo — Preguntas de Análisis (P11, P17, P25)</td>'
      + '<td style="text-align:center;padding:8px;">' + promDes.toFixed(1) + ' / 12</td>'
      + '<td style="padding:8px 12px;width:35%;">' + barCell(pctDes, colorBar(pctDes)) + '</td></tr>'
      + '</tbody></table></div>'
      + '<div class="section-block"><div class="section-title">Análisis por Pregunta de Desarrollo</div>'
      + '<table><thead><tr><th>Pregunta</th><th>Sección</th><th>Habilidad</th><th>Prom. Ptje</th><th>% Logro</th><th>Dificultad</th></tr></thead><tbody>'
      + '<tr><td style="text-align:center;font-weight:600;">P11</td><td style="text-align:center;">Desarrollo</td><td style="text-align:center;">Localizar / Reconocer</td><td style="text-align:center;font-weight:700;">' + promP11.toFixed(1) + '/4</td><td style="width:30%;">' + barCell(pctP11, colorBar(pctP11)) + '</td><td style="text-align:center;color:' + difP11.color + ';font-weight:600;">' + difP11.txt + '</td></tr>'
      + '<tr><td style="text-align:center;font-weight:600;">P17</td><td style="text-align:center;">Desarrollo</td><td style="text-align:center;">Interpretar e Integrar</td><td style="text-align:center;font-weight:700;">' + promP17.toFixed(1) + '/3</td><td style="width:30%;">' + barCell(pctP17, colorBar(pctP17)) + '</td><td style="text-align:center;color:' + difP17.color + ';font-weight:600;">' + difP17.txt + '</td></tr>'
      + '<tr><td style="text-align:center;font-weight:600;">P25</td><td style="text-align:center;">Desarrollo</td><td style="text-align:center;">Reflexionar y Evaluar</td><td style="text-align:center;font-weight:700;">' + promP25.toFixed(1) + '/5</td><td style="width:30%;">' + barCell(pctP25, colorBar(pctP25)) + '</td><td style="text-align:center;color:' + difP25.color + ';font-weight:600;">' + difP25.txt + '</td></tr>'
      + '</tbody></table></div>'
      + '<div class="section-block"><div class="section-title">Resultados Individuales — ' + totalP + ' estudiantes (ordenados por nota)</div>'
      + '<table><thead><tr>'
      + '<th style="text-align:left;">Estudiante</th><th>RUT</th><th>Alt.</th>'
      + '<th>P11<br><span style="font-weight:400;font-size:8px;">(4 pts)</span></th>'
      + '<th>P17<br><span style="font-weight:400;font-size:8px;">(3 pts)</span></th>'
      + '<th>P25<br><span style="font-weight:400;font-size:8px;">(5 pts)</span></th>'
      + '<th>Desar.</th><th>Total</th><th>%</th><th>Nota</th><th>Estado</th>'
      + '</tr></thead><tbody>' + rowsHtml + '</tbody></table></div>'
      + '<div class="section-block"><div class="section-title">Casos especiales</div>'
      + '<p style="font-size:11px;color:#555;margin-bottom:10px;"><strong>No finalizaron en plataforma</strong> (cierre forzado, corregidos con respuestas registradas — pudo ser falla de envío):</p>'
      + incompletosHtml
      + '<p style="font-size:11px;color:#555;margin:14px 0 10px;"><strong>Sin envío en base</strong> (no participaron):</p>'
      + noEnviadosHtml
      + (audit.excluded && audit.excluded.length ? '<p style="font-size:11px;color:#555;margin:14px 0 6px;"><strong>Excluidos por justificación</strong>:</p><ul style="margin:0;padding-left:18px;font-size:11px;line-height:1.7;">' + audit.excluded.map(e => '<li>' + htmlEscape(e.nombre) + ' — ' + htmlEscape(e.rut || 's/r') + ' — ' + htmlEscape(e.reason || '') + '</li>').join('') + '</ul>' : '')
      + '</div>'
      + '<div class="footer">Generado automáticamente el ' + fechaCL + ' · Centro Educativo Salesianos Talca</div>'
      + '</div></body></html>';

    const htmlLocal = html
      + '\n<!-- Anexo: informe individual con respuestas y feedback -->\n'
      + '<div class="page">'
      + '<div class="section-title">Anexo · Informe individual con respuestas y feedback</div>'
      + '<div style="margin-bottom:12px;">' + studentLinksHtml + '</div>'
      + individualHtml
      + '</div>';

    fs.writeFileSync(HTML_PATH, html, 'utf8');
    fs.writeFileSync(LOCAL_HTML_PATH, htmlLocal, 'utf8');

    console.log('Corregidos y actualizados en RTDB:', planilla.length);
    console.log('Promedio final:', promedio.toFixed(1));
    console.log('CSV:', CSV_PATH);
    console.log('HTML:', HTML_PATH);
    console.log('HTML local:', LOCAL_HTML_PATH);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();