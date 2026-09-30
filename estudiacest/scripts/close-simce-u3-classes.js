'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { closeFirebase, readPlatform, updatePlatform } = require('./firebase-maintenance-db');

// Cierre de las clases evaluadas de la Unidad 3 SIMCE (2°A HC y 2°B HC) antes de
// recalificar, más el Ensayo N.º 3, que se reabrió en la misma regularización. La
// Clase 9 es informativa y queda abierta como material; la Clase 11 no se toca.
const SESSION_IDS = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 10].map(number => `sesion-u3-${number}`),
  'ensayo-simce-n3-nm2-2026'
];
const TARGET_COURSES = ['2A-HC', '2B-HC'];

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

// `activa:false` cierra el panel y las API de las clases 5 y 8; `respuestas_bloqueadas`
// cierra la API de la Clase 7. Las excepciones individuales se retiran porque el
// plazo de regularización terminó; quedan respaldadas para restaurarlas si hace falta.
function desiredSessionFields(closedAt) {
  return {
    activa: false,
    respuestas_bloqueadas: true,
    cerrada_at: closedAt,
    excepciones_desbloqueo: null
  };
}

function assertExistingSessions(sessions) {
  const missing = SESSION_IDS.filter(sessionId => !sessions || !sessions[sessionId]);
  if (missing.length) throw new Error(`Faltan sesiones canónicas: ${missing.join(', ')}.`);
  SESSION_IDS.forEach(sessionId => {
    const assigned = sessions[sessionId].asignados || [];
    if (stableStringify([...assigned].sort()) !== stableStringify(TARGET_COURSES)) {
      throw new Error(`${sessionId} no está asignada exactamente a ${TARGET_COURSES.join(' y ')}.`);
    }
  });
}

// Una sesión ya cerrada conserva su hora de cierre original.
function closedAtFor(sessions, sessionId, closedAt) {
  const existing = Number(sessions && sessions[sessionId] && sessions[sessionId].cerrada_at);
  return existing > 0 ? existing : closedAt;
}

function buildAtomicUpdate(closedAt, sessions) {
  const update = {};
  SESSION_IDS.forEach(sessionId => {
    Object.entries(desiredSessionFields(closedAtFor(sessions, sessionId, closedAt))).forEach(([field, value]) => {
      update[`sesiones/${sessionId}/${field}`] = value;
    });
  });
  return update;
}

function assertAppliedState(sessions, expectedClosedAt) {
  assertExistingSessions(sessions);
  SESSION_IDS.forEach(sessionId => {
    Object.entries(desiredSessionFields(expectedClosedAt[sessionId])).forEach(([field, expected]) => {
      const actual = sessions[sessionId][field];
      const normalized = actual === undefined ? null : actual;
      if (stableStringify(normalized) !== stableStringify(expected)) {
        throw new Error(`Relectura inválida en ${sessionId}/${field}.`);
      }
    });
  });
}

function summarize(sessions, apply, closedAt) {
  return {
    mode: apply ? 'apply' : 'dry-run',
    closedAt: new Date(closedAt).toISOString(),
    sessions: SESSION_IDS.map(sessionId => {
      const session = sessions[sessionId];
      return {
        sessionId,
        activa: session.activa,
        respuestas_bloqueadas: session.respuestas_bloqueadas === true,
        excepciones: Object.keys(session.excepciones_desbloqueo || {}).length
      };
    }),
    atomicPaths: Object.keys(buildAtomicUpdate(closedAt, sessions)).length
  };
}

async function main() {
  const apply = process.argv.includes('--apply');
  const closedAt = Date.now();
  try {
    const platform = await readPlatform();
    const sessions = platform.sesiones || {};
    assertExistingSessions(sessions);
    console.log(JSON.stringify(summarize(sessions, apply, closedAt), null, 2));
    if (!apply) {
      console.log('Sin cambios. Ejecuta con --apply para cerrar las clases y verificarlas por relectura.');
      return;
    }

    const backupDir = path.join(os.tmpdir(), 'estudiacest-private-backups');
    fs.mkdirSync(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `simce-u3-sessions-before-close-${closedAt}.json`);
    const backup = Object.fromEntries(SESSION_IDS.map(sessionId => [sessionId, sessions[sessionId]]));
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), 'utf8');

    const expectedClosedAt = Object.fromEntries(SESSION_IDS.map(sessionId => [sessionId, closedAtFor(sessions, sessionId, closedAt)]));
    await updatePlatform(buildAtomicUpdate(closedAt, sessions));
    const verified = await readPlatform();
    assertAppliedState(verified.sesiones || {}, expectedClosedAt);
    console.log(JSON.stringify({ applied: true, verifiedSessions: SESSION_IDS.length, backupPath }, null, 2));
  } finally {
    await closeFirebase();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`SIMCE_U3_CLOSE_FAILED: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { SESSION_IDS, TARGET_COURSES, buildAtomicUpdate, desiredSessionFields };
