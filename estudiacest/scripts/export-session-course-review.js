const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

function ensureFirebase() {
  if (admin.apps.length) {
    return admin.app();
  }
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY no configurada.');
  }
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
  });
}

function sanitizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getNotesData(response, result) {
  return (response && response.notes) || (result && result.notas) || {};
}

function getTicketData(response, result) {
  return (response && response.ticket) || (result && result.ticket) || {};
}

function getThesisContextsData(response) {
  return (response && response.thesisContexts) || {};
}

function getNonEmptyFields(data) {
  return Object.entries(data || {})
    .map(([key, value]) => [key, String(value || '').trim()])
    .filter(([, value]) => value.length > 0)
    .map(([key, value]) => ({ key, value }));
}

function prefixEntries(entries, source) {
  return entries.map(({ key, value }) => ({ source, key, value }));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sessionId = String(args.session || '').trim();
  const course = String(args.course || '').trim().toUpperCase();
  const submittedOnly = args['submitted-only'] === true;

  if (!sessionId) {
    throw new Error('Debes indicar --session <id>.');
  }
  if (!course) {
    throw new Error('Debes indicar --course <CURSO>.');
  }

  ensureFirebase();

  const db = admin.database();
  const [sessionSnap, studentsSnap, responsesSnap, resultsSnap] = await Promise.all([
    db.ref(`${BASE}/sesiones/${sessionId}`).once('value'),
    db.ref(`${BASE}/estudiantes`).once('value'),
    db.ref(`${BASE}/respuestas/${sessionId}`).once('value'),
    db.ref(`${BASE}/resultados/${sessionId}`).once('value')
  ]);

  if (!sessionSnap.exists()) {
    throw new Error('No existe la sesión ' + sessionId + '.');
  }

  const session = sessionSnap.val() || {};
  const students = studentsSnap.val() || {};
  const responses = responsesSnap.val() || {};
  const results = resultsSnap.val() || {};

  const rows = Object.entries(students)
    .filter(([, student]) => String((student && student.curso) || '').trim().toUpperCase() === course)
    .map(([uid, student]) => {
      const response = responses[uid] || null;
      const result = results[uid] || null;
      const notesData = getNotesData(response, result);
      const ticketData = getTicketData(response, result);
      const thesisContextsData = getThesisContextsData(response);
      const nonEmptyNotes = getNonEmptyFields(notesData);
      const nonEmptyTicket = getNonEmptyFields(ticketData);
      const nonEmptyThesisContexts = getNonEmptyFields(thesisContextsData);
      const writingEntries = [
        ...prefixEntries(nonEmptyNotes, 'notes'),
        ...prefixEntries(nonEmptyTicket, 'ticket'),
        ...prefixEntries(nonEmptyThesisContexts, 'thesisContexts')
      ];
      const status = result ? 'submitted' : response ? 'working' : 'notstarted';
      const alternativasPct = result && Number.isFinite(Number(result.alternativas_pct))
        ? Number(result.alternativas_pct)
        : result && Number.isFinite(Number(result.porcentaje))
          ? Number(result.porcentaje)
          : null;
      const escrituraPct = result && Number.isFinite(Number(result.escritura_pct))
        ? Number(result.escritura_pct)
        : null;
      const porcentajeFinal = result && Number.isFinite(Number(result.porcentaje_final))
        ? Number(result.porcentaje_final)
        : null;
      return {
        uid,
        nombre: student.nombre || '',
        curso: student.curso || course,
        status,
        porcentaje: result ? (result.porcentaje || 0) : null,
        alternativasPct,
        escrituraPct,
        porcentajeFinal,
        nota: result && Number.isFinite(Number(result.nota)) ? Number(result.nota) : null,
        gradingMode: result ? (result.grading_mode || null) : null,
        notasCompletadas: result ? (result.notas_completadas || null) : null,
        respuestasGuardadas: response ? Object.keys(response.answers || {}).length : 0,
        notasGuardadas: nonEmptyNotes.length,
        ticketGuardados: nonEmptyTicket.length,
        tesisContextosGuardados: nonEmptyThesisContexts.length,
        hasWrittenNotes: writingEntries.length > 0,
        submittedAt: result ? (result.submitted_at || null) : null,
        lastSave: response ? (response.last_save || null) : null,
        answers: response ? (response.answers || {}) : {},
        notes: notesData,
        ticket: ticketData,
        thesisContexts: thesisContextsData,
        writingEntries,
        detail: result ? (result.detalle || {}) : {}
      };
    })
    .filter(row => !submittedOnly || row.status === 'submitted')
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const summary = rows.reduce((acc, row) => {
    acc.total += 1;
    acc[row.status] += 1;
    if (row.hasWrittenNotes) acc.withWrittenNotes += 1;
    if (row.ticketGuardados > 0) acc.withTicketWriting += 1;
    if (row.tesisContextosGuardados > 0) acc.withThesisContexts += 1;
    if (row.status === 'submitted' && row.nota !== null) acc.withGrade += 1;
    if (row.status === 'submitted' && row.porcentajeFinal !== null) acc.withCombinedGrade += 1;
    return acc;
  }, {
    total: 0,
    submitted: 0,
    working: 0,
    notstarted: 0,
    withWrittenNotes: 0,
    withTicketWriting: 0,
    withThesisContexts: 0,
    withGrade: 0,
    withCombinedGrade: 0
  });

  const exportData = {
    exportedAt: new Date().toISOString(),
    session: {
      id: sessionId,
      titulo: session.titulo || '',
      descripcion: session.descripcion || '',
      activa: session.activa !== false,
      resultadosVisibles: session.resultados_visibles === true,
      notasEvaluadas: session.notas_evaluadas !== false,
      preguntas: Array.isArray(session.contenido && session.contenido.preguntas) ? session.contenido.preguntas.length : 0,
      textos: Array.isArray(session.contenido && session.contenido.textos) ? session.contenido.textos.length : 0
    },
    course,
    summary,
    rows
  };

  const defaultName = `${sanitizeSlug(sessionId)}_${sanitizeSlug(course)}.json`;
  const outputPath = path.resolve(
    __dirname,
    '..',
    args.output || path.join('exports', 'session-review', defaultName)
  );

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf8');

  console.log(JSON.stringify({
    outputPath,
    sessionId,
    course,
    summary
  }, null, 2));
}

main().catch((error) => {
  console.error('[export-session-course-review]', error.message);
  process.exitCode = 1;
});