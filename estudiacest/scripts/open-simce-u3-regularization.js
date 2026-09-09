'use strict';

const { closeFirebase, readPlatform, updatePlatform } = require('./firebase-maintenance-db');

const PROJECT = 'estudiacest';
const TARGET_COURSES = ['2A-HC', '2B-HC'];
const EXPECTED_STUDENTS_BY_COURSE = { '2A-HC': 46, '2B-HC': 40 };
const EXPECTED_STUDENTS = 86;
const REGULARIZATION_UNTIL = '2026-09-23';
const CLOSE_AT = Date.parse('2026-09-24T00:00:00-03:00');
const MESSAGE_ID = 'regularizacion-u3-2026-09-23';
const SESSION_IDS = [
  ...Array.from({ length: 10 }, (_, index) => `sesion-u3-${index + 1}`),
  'ensayo-simce-n3-nm2-2026'
];
const MESSAGE_TEXT = 'La Unidad 3 completa está habilitada para regularización. Puedes completar tus actividades pendientes hasta el 23 de septiembre. La Clase 9 es material de corrección y no requiere entrega.';

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function countTargetStudents(students) {
  const byCourse = Object.fromEntries(TARGET_COURSES.map(course => [course, 0]));
  Object.values(students || {}).forEach(student => {
    const course = String((student && student.curso) || '').trim().toUpperCase();
    if (Object.prototype.hasOwnProperty.call(byCourse, course)) byCourse[course] += 1;
  });
  return {
    byCourse,
    total: Object.values(byCourse).reduce((sum, count) => sum + count, 0)
  };
}

function assertExpectedRoster(students) {
  const counts = countTargetStudents(students);
  for (const course of TARGET_COURSES) {
    if (counts.byCourse[course] !== EXPECTED_STUDENTS_BY_COURSE[course]) {
      throw new Error(`Padrón inesperado en ${course}: ${counts.byCourse[course]} estudiantes; se esperaban ${EXPECTED_STUDENTS_BY_COURSE[course]}.`);
    }
  }
  if (counts.total !== EXPECTED_STUDENTS) {
    throw new Error(`Padrón inesperado: ${counts.total} estudiantes; se esperaban ${EXPECTED_STUDENTS}.`);
  }
  return counts;
}

function buildMessage(existingMessage, timestamp = Date.now()) {
  const preservedTimestamp = Number(existingMessage && existingMessage.timestamp);
  return {
    texto: MESSAGE_TEXT,
    programa: 'simce',
    cursos: TARGET_COURSES,
    destacar_en_panel: true,
    vigente_hasta: CLOSE_AT,
    plazo_texto: 'Plazo: hasta el 23 de septiembre.',
    timestamp: preservedTimestamp > 0 ? preservedTimestamp : timestamp,
    from: 'sistema'
  };
}

function desiredSessionFields(sessionId) {
  const fields = {
    activa: true,
    respuestas_bloqueadas: false,
    asignados: TARGET_COURSES,
    programa: 'simce',
    regularizacion_hasta: REGULARIZATION_UNTIL,
    regularizacion_cierre_at: CLOSE_AT
  };
  if (sessionId === 'sesion-u3-10') {
    fields.resultados_visibles = false;
    fields.retroalimentacion_visible = false;
  }
  return fields;
}

function buildAtomicUpdate(message) {
  const update = {};
  for (const sessionId of SESSION_IDS) {
    const fields = desiredSessionFields(sessionId);
    for (const [field, value] of Object.entries(fields)) {
      update[`sesiones/${sessionId}/${field}`] = value;
    }
  }
  update[`mensajes/${MESSAGE_ID}`] = message;
  return update;
}

function assertExistingSessions(sessions) {
  const missing = SESSION_IDS.filter(sessionId => !sessions || !sessions[sessionId]);
  if (missing.length) throw new Error(`Faltan sesiones canónicas: ${missing.join(', ')}.`);
}

function assertAppliedState(sessions, messages, expectedMessage) {
  assertExistingSessions(sessions);
  for (const sessionId of SESSION_IDS) {
    const session = sessions[sessionId];
    for (const [field, expected] of Object.entries(desiredSessionFields(sessionId))) {
      if (stableStringify(session[field]) !== stableStringify(expected)) {
        throw new Error(`Relectura inválida en ${sessionId}/${field}.`);
      }
    }
  }
  if (stableStringify(messages[MESSAGE_ID]) !== stableStringify(expectedMessage)) {
    throw new Error(`Relectura inválida en mensajes/${MESSAGE_ID}.`);
  }
}

function buildSummary({ apply, sessions, students, message }) {
  const roster = assertExpectedRoster(students);
  assertExistingSessions(sessions);
  const sessionsWithChanges = SESSION_IDS.filter(sessionId => {
    const current = sessions[sessionId];
    return Object.entries(desiredSessionFields(sessionId))
      .some(([field, expected]) => stableStringify(current[field]) !== stableStringify(expected));
  });
  return {
    mode: apply ? 'apply' : 'dry-run',
    project: PROJECT,
    targetSessions: SESSION_IDS.length,
    sessionIds: SESSION_IDS,
    sessionsWithChanges: sessionsWithChanges.length,
    students: roster.total,
    studentsByCourse: roster.byCourse,
    regularizationUntil: REGULARIZATION_UNTIL,
    closesAt: new Date(CLOSE_AT).toISOString(),
    messageId: MESSAGE_ID,
    atomicPaths: Object.keys(buildAtomicUpdate(message)).length
  };
}

async function main() {
  const apply = process.argv.includes('--apply');
  try {
    const platform = await readPlatform();
    const sessions = platform.sesiones || {};
    const students = platform.estudiantes || {};
    const messages = platform.mensajes || {};
    const message = buildMessage(messages[MESSAGE_ID]);
    const summary = buildSummary({ apply, sessions, students, message });
    console.log(JSON.stringify(summary, null, 2));

    if (!apply) {
      console.log('Sin cambios. Ejecuta con --apply para aplicar esta actualización atómica y verificarla por relectura.');
      return;
    }

    const update = buildAtomicUpdate(message);
    await updatePlatform(update);

    const verifiedPlatform = await readPlatform();
    const verifiedSessions = verifiedPlatform.sesiones || {};
    const verifiedStudents = verifiedPlatform.estudiantes || {};
    const verifiedMessages = verifiedPlatform.mensajes || {};
    assertExpectedRoster(verifiedStudents);
    assertAppliedState(verifiedSessions, verifiedMessages, message);
    console.log(JSON.stringify({ applied: true, verifiedSessions: SESSION_IDS.length, verifiedStudents: EXPECTED_STUDENTS, verifiedMessage: MESSAGE_ID }, null, 2));
  } finally {
    await closeFirebase();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`SIMCE_U3_REGULARIZATION_FAILED: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  CLOSE_AT,
  EXPECTED_STUDENTS,
  EXPECTED_STUDENTS_BY_COURSE,
  MESSAGE_ID,
  MESSAGE_TEXT,
  PROJECT,
  REGULARIZATION_UNTIL,
  SESSION_IDS,
  TARGET_COURSES,
  assertAppliedState,
  assertExpectedRoster,
  buildAtomicUpdate,
  buildMessage,
  buildSummary,
  countTargetStudents,
  desiredSessionFields,
  stableStringify
};
