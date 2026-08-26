const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

const BASE = 'plataforma_estudiantes';
const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const SESSION_IDS = Array.from({ length: 6 }, (_, index) => `sesion-u3-${index + 1}`);
const COURSES = new Set(['2A-HC', '2B-HC']);

const CONFIG = {
  'sesion-u3-1': { alternatives: 16, concepts: 0, writing: [['desarrollo', 60], ['desarrollo2', 60]] },
  'sesion-u3-2': { alternatives: 20, concepts: 0, writing: [['desarrollo', 60], ['desarrollo2', 60]] },
  'sesion-u3-3': { alternatives: 10, concepts: 18, writing: [['respuesta_abierta', 40], ['metacognicion.reconozco', 20], ['metacognicion.identifico', 20], ['metacognicion.analizo', 20], ['metacognicion.transfiero', 20], ['metacognicion.proposito', 20]] },
  'sesion-u3-4': { alternatives: 30, concepts: 12, writing: [['open', 40], ['meta.m1', 12], ['meta.m2', 12], ['meta.m3', 12]] },
  'sesion-u3-5': { alternatives: 32, concepts: 8, writing: [['openResponses.q10', 90], ['openResponses.q24', 90], ['meta.identifique', 15], ['meta.explique', 15], ['meta.mejorare', 15]] },
  'sesion-u3-6': { alternatives: 14, concepts: 0, writing: [['desarrollo', 60], ['desarrollo2', 60]] }
};

function normalizePrivateKey(raw) {
  let key = String(raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  return key.replace(/\\n/g, '\n');
}

function initializeFirebase(envPath) {
  dotenv.config({
    path: envPath ? path.resolve(envPath) : path.join(__dirname, '..', '.env.local'),
    override: Boolean(envPath)
  });
  if (admin.apps.length) return admin.app();
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
  });
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const next = argv[index + 1];
    args[token.slice(2)] = !next || next.startsWith('--') ? true : next;
    if (next && !next.startsWith('--')) index += 1;
  }
  return args;
}

function valuesOf(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

function nonEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function countValues(value) {
  return valuesOf(value).filter(nonEmpty).length;
}

function getPath(source, dottedPath) {
  return dottedPath.split('.').reduce((value, key) => {
    if (value === null || value === undefined) return undefined;
    if (Array.isArray(value) && /^\d+$/.test(key)) return value[Number(key)];
    return typeof value === 'object' ? value[key] : undefined;
  }, source);
}

function textValue(response, result, field) {
  const responseValue = getPath(response || {}, field);
  if (nonEmpty(responseValue)) return String(responseValue).trim();
  const resultValue = getPath(result || {}, field);
  return nonEmpty(resultValue) ? String(resultValue).trim() : '';
}

function countConcepts(sessionId, response) {
  const concepts = response.concepts || response.concepto || {};
  if (sessionId === 'sesion-u3-3') {
    return countValues(concepts.matching) + countValues(concepts.vf || concepts.tf) +
      valuesOf(concepts.words).filter(value => value === true || nonEmpty(value)).length;
  }
  if (sessionId === 'sesion-u3-4') {
    return countValues(concepts.matching) + countValues(concepts.tf || concepts.vf);
  }
  if (sessionId === 'sesion-u3-5') return countValues(concepts);
  return 0;
}

function countAlternatives(response) {
  return Object.values(response.answers || {}).filter(nonEmpty).length;
}

function writingScore(text, minimum) {
  if (!text) return 0;
  return text.length >= minimum ? 1 : 0.5;
}

function gradeBand(completion) {
  if (completion <= 0) return 1;
  if (completion <= 0.5) return 3;
  if (completion < 0.85) return 5;
  return 7;
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSimilarity(left, right) {
  const a = new Set(left.split(' ').filter(Boolean));
  const b = new Set(right.split(' ').filter(Boolean));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach(token => { if (b.has(token)) intersection += 1; });
  return (2 * intersection) / (a.size + b.size);
}

function substantiveWriting(sessionId, response, result) {
  const fields = sessionId === 'sesion-u3-5'
    ? ['openResponses.q10', 'openResponses.q24']
    : sessionId === 'sesion-u3-3'
      ? ['respuesta_abierta']
      : sessionId === 'sesion-u3-4'
        ? ['open']
      : ['desarrollo', 'desarrollo2'];
  return fields.map(field => ({ field, text: textValue(response, result, field) })).filter(item => item.text.length >= 60);
}

function rowFor(student, uid, sessionId, session, response, result) {
  const config = CONFIG[sessionId];
  const alternativesDone = Math.min(config.alternatives, countAlternatives(response));
  const conceptsDone = Math.min(config.concepts, countConcepts(sessionId, response));
  const writings = config.writing.map(([field, minimum]) => {
    const text = textValue(response, result, field);
    return { field, minimum, length: text.length, score: writingScore(text, minimum) };
  });
  const writingDone = writings.reduce((sum, item) => sum + item.score, 0);
  const totalUnits = config.alternatives + config.concepts + config.writing.length;
  const completedUnits = alternativesDone + conceptsDone + writingDone;
  const completion = totalUnits ? completedUnits / totalUnits : 0;
  const hasResponse = Object.keys(response || {}).length > 0 || Object.keys(result || {}).length > 0;
  const submitted = response.completada === true || response.submitted === true || Object.keys(result || {}).length > 0;
  const writingAttempted = writings.filter(item => item.length > 0).length;
  const writingComplete = writings.filter(item => item.score === 1).length;
  let proposedGrade = gradeBand(completion);
  if (config.writing.length && writingAttempted === 0 && proposedGrade >= 5) proposedGrade -= 2;
  else if (config.writing.length && writingComplete < config.writing.length && proposedGrade === 7) proposedGrade = 5;
  if (!hasResponse) proposedGrade = 1;

  const flags = [];
  if (!hasResponse) flags.push('Sin respuesta: validar asistencia, licencia o vía alternativa antes de cerrar la nota');
  else if (!submitted) flags.push('Borrador sin entrega confirmada');
  if (hasResponse && writingAttempted === 0) flags.push('Escritura requerida ausente');
  else if (writingComplete < config.writing.length) flags.push('Escritura requerida incompleta');
  flags.push('Sin tiempo inicial histórico: no aplicar rebaja por velocidad');

  return {
    uid,
    run: student.run || student.rut || student.RUN || '',
    name: student.nombre || student.name || '',
    course: String(student.curso || '').toUpperCase(),
    sessionId,
    sessionTitle: session.titulo || sessionId,
    applicationDate: session.fecha_aplicacion || '',
    status: !hasResponse ? 'Sin iniciar' : submitted ? 'Entregada' : 'Borrador',
    alternativesDone,
    alternativesTotal: config.alternatives,
    conceptsDone,
    conceptsTotal: config.concepts,
    writingDone,
    writingTotal: config.writing.length,
    writingAttempted,
    writingComplete,
    completedUnits,
    totalUnits,
    completion: Math.round(completion * 1000) / 1000,
    proposedGrade,
    flags,
    responseTimestamp: response.submittedAt || response.completadaAt || response.submitted_at || response.updatedAt || response.last_save || null,
    resultTimestamp: result.submitted_at || result.timestamp || null,
    substantiveWriting: substantiveWriting(sessionId, response, result),
    duplicateGroups: [],
    penalizedDuplicateGroups: []
  };
}

function findWritingMatches(rows) {
  const matches = [];
  let groupNumber = 0;
  SESSION_IDS.forEach(sessionId => {
    const entries = rows.filter(row => row.sessionId === sessionId).flatMap(row =>
      row.substantiveWriting.map(item => ({ row, field: item.field, text: item.text, normalized: normalizeText(item.text) }))
    );
    for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
        const left = entries[leftIndex];
        const right = entries[rightIndex];
        if (left.field !== right.field || left.row.uid === right.row.uid) continue;
        const lengthRatio = Math.min(left.normalized.length, right.normalized.length) / Math.max(left.normalized.length, right.normalized.length);
        if (lengthRatio < 0.82) continue;
        const exact = left.normalized === right.normalized;
        const similarity = exact ? 1 : tokenSimilarity(left.normalized, right.normalized);
        if (!exact && similarity <= 0.90) continue;
        groupNumber += 1;
        const groupId = `C${String(groupNumber).padStart(3, '0')}`;
        left.row.duplicateGroups.push(groupId);
        right.row.duplicateGroups.push(groupId);
        if (exact || similarity > 0.90) {
          left.row.penalizedDuplicateGroups.push(groupId);
          right.row.penalizedDuplicateGroups.push(groupId);
        }
        matches.push({
          groupId,
          sessionId,
          field: left.field,
          exact,
          similarity: Math.round(similarity * 1000) / 1000,
          left: { uid: left.row.uid, name: left.row.name, course: left.row.course, text: left.text },
          right: { uid: right.row.uid, name: right.row.name, course: right.row.course, text: right.text }
        });
      }
    }
  });
  rows.forEach(row => {
    row.duplicateGroups = [...new Set(row.duplicateGroups)];
    row.penalizedDuplicateGroups = [...new Set(row.penalizedDuplicateGroups)];
    if (row.penalizedDuplicateGroups.length) {
      row.proposedGrade = Math.min(row.proposedGrade, 5);
      row.flags.push('Ajuste aplicado: coincidencia textual superior al 90 % con otro estudiante; posible uso no autorizado de IA o copia. Nota máxima 5,0');
    }
  });
  return matches;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const output = path.resolve(args.output || path.join(__dirname, '..', 'exports', 'simce-u3-labor-review.json'));
  initializeFirebase(args.env);
  const db = admin.database();
  const [studentsSnap, sessionsSnap, responsesSnap, resultsSnap] = await Promise.all([
    db.ref(`${BASE}/estudiantes`).once('value'),
    db.ref(`${BASE}/sesiones`).once('value'),
    db.ref(`${BASE}/respuestas`).once('value'),
    db.ref(`${BASE}/resultados`).once('value')
  ]);
  const students = studentsSnap.val() || {};
  const sessions = sessionsSnap.val() || {};
  const responses = responsesSnap.val() || {};
  const results = resultsSnap.val() || {};
  const rows = [];
  Object.entries(students).forEach(([uid, student]) => {
    const course = String(student.curso || '').toUpperCase();
    if (!COURSES.has(course)) return;
    SESSION_IDS.forEach(sessionId => {
      rows.push(rowFor(
        student,
        uid,
        sessionId,
        sessions[sessionId] || {},
        (responses[sessionId] || {})[uid] || {},
        (results[sessionId] || {})[uid] || {}
      ));
    });
  });
  rows.sort((left, right) => left.course.localeCompare(right.course, 'es') || left.name.localeCompare(right.name, 'es') || left.sessionId.localeCompare(right.sessionId));
  const matches = findWritingMatches(rows);
  const sessionState = SESSION_IDS.map(sessionId => ({
    sessionId,
    title: sessions[sessionId]?.titulo || sessionId,
    active: sessions[sessionId]?.activa !== false,
    responsesBlocked: sessions[sessionId]?.respuestas_bloqueadas === true,
    resultsVisible: sessions[sessionId]?.resultados_visibles === true,
    applicationDate: sessions[sessionId]?.fecha_aplicacion || ''
  }));
  const payload = {
    generatedAt: new Date().toISOString(),
    methodology: {
      grades: { none: 1, halfOrLess: 3, moreThanHalf: 5, almostAll: 7, almostAllThreshold: 0.85 },
      writingAdjustment: 'La escritura ausente o incompleta baja una banda cuando corresponde.',
      timing: 'No se aplica rebaja: las clases 1 a 6 no guardaron hora inicial confiable.',
      matches: 'Toda coincidencia textual superior al 90 % deja la nota de ambos estudiantes con máximo 5,0.'
    },
    sessionState,
    rows,
    matches
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(payload, null, 2), 'utf8');
  console.log(JSON.stringify({ output, rows: rows.length, matches: matches.length }, null, 2));
  await admin.app().delete();
}

main().catch(error => {
  console.error('[export-simce-labor-review]', error);
  process.exitCode = 1;
});
