'use strict';

const { classifySubmissionStatus } = require('./class-submission-status');
const { closeFirebase, readPlatform } = require('./firebase-maintenance-db');

const COURSES = new Set(['2A-HC', '2B-HC']);
const SESSION_IDS = [
  ...Array.from({ length: 10 }, (_, index) => `sesion-u3-${index + 1}`),
  'ensayo-simce-n3-nm2-2026'
];

function increment(target, key) {
  target[key] = (target[key] || 0) + 1;
}

function auditSnapshot(snapshot) {
  const students = Object.entries(snapshot.students || {}).filter(([, student]) =>
    student && COURSES.has(String(student.curso || '').trim().toUpperCase())
  );
  if (students.length !== 86) throw new Error(`Padrón inesperado: ${students.length}; se esperaban 86 estudiantes.`);

  const states = {};
  const findings = {};
  const sessions = {};
  for (const [uid, student] of students) {
    const expectedCourse = String(student.curso || '').trim().toUpperCase();
    for (const sessionId of SESSION_IDS) {
      const response = snapshot.responses[sessionId] && snapshot.responses[sessionId][uid];
      const result = snapshot.results[sessionId] && snapshot.results[sessionId][uid];
      const grade = snapshot.grades[uid] && snapshot.grades[uid][sessionId];
      const telemetry = snapshot.telemetry[sessionId] && snapshot.telemetry[sessionId][uid];
      const state = classifySubmissionStatus(response, { result, grade, telemetry });
      increment(states, state.status);
      sessions[sessionId] = sessions[sessionId] || { delivered: 0, legacy: 0, inconsistent: 0, draft: 0, missing: 0 };
      if (state.delivered) sessions[sessionId].delivered += 1;
      else if (state.status === 'inconsistent') sessions[sessionId].inconsistent += 1;
      else if (state.status === 'draft') sessions[sessionId].draft += 1;
      else sessions[sessionId].missing += 1;

      if (state.status === 'legacy_confirmed') {
        increment(findings, 'legacy_confirmation');
        sessions[sessionId].legacy += 1;
      }
      if (state.status === 'inconsistent') increment(findings, 'noncanonical_or_partial_evidence');
      if (response && response.curso && String(response.curso).trim().toUpperCase() !== expectedCourse) {
        increment(findings, 'response_course_mismatch');
      }
      if (state.delivered && grade && ['not_submitted', 'draft'].includes(grade.status)) {
        increment(findings, 'stale_grade_status');
      }
      if (!state.delivered && grade && (grade.submitted === true || grade.status === 'submitted')) {
        increment(findings, 'grade_false_positive');
      }
    }
  }
  return {
    students: students.length,
    sessions: SESSION_IDS.length,
    pairs: students.length * SESSION_IDS.length,
    states,
    findings,
    bySession: sessions,
    findingCount: Object.values(findings).reduce((sum, count) => sum + count, 0)
  };
}

async function main() {
  const strict = process.argv.includes('--strict');
  try {
    const platform = await readPlatform();
    const snapshot = {
      students: platform.estudiantes || {},
      responses: platform.respuestas || {},
      results: platform.resultados || {},
      grades: platform.calificaciones_clase || {},
      telemetry: platform.telemetria_clases || {}
    };
    const report = auditSnapshot(snapshot);
    console.log(JSON.stringify({ mode: 'read-only', strict, ...report }, null, 2));
    if (strict && report.findingCount > 0) process.exitCode = 2;
  } finally {
    await closeFirebase();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`CLASS_SUBMISSION_INTEGRITY_AUDIT_FAILED: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { SESSION_IDS, auditSnapshot };
