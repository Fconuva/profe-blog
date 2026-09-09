'use strict';

const { classifySubmissionStatus } = require('./class-submission-status');
const { SESSION_IDS, auditSnapshot } = require('./audit-class-submission-integrity');
const { closeFirebase, readPlatform, updatePlatform } = require('./firebase-maintenance-db');

const COURSES = new Set(['2A-HC', '2B-HC']);

function firstPositiveNumber(values) {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

function supportingTimestamp(response, result, telemetry, recordedAt) {
  return firstPositiveNumber([
    response && response.submittedAt,
    response && response.completadaAt,
    response && response.submitted_at,
    response && response.updatedAt,
    response && response.last_save,
    result && result.submittedAt,
    result && result.completadaAt,
    result && result.updatedAt,
    telemetry && telemetry.lastSubmissionConfirmationAt,
    telemetry && telemetry.submittedAt,
    recordedAt
  ]);
}

function makeSnapshot(platform) {
  return {
    students: platform.estudiantes || {},
    responses: platform.respuestas || {},
    results: platform.resultados || {},
    grades: platform.calificaciones_clase || {},
    telemetry: platform.telemetria_clases || {}
  };
}

function buildPlan(snapshot, recordedAt) {
  const students = Object.entries(snapshot.students).filter(([, student]) =>
    student && COURSES.has(String(student.curso || '').trim().toUpperCase())
  );
  if (students.length !== 86) throw new Error(`Padrón inesperado: ${students.length}; se esperaban 86 estudiantes.`);

  const update = {};
  const affectedStudents = new Set();
  const counts = {
    students: students.length,
    sessions: SESSION_IDS.length,
    pairs: students.length * SESSION_IDS.length,
    legacyResponsesRepaired: 0,
    staleGradesRepaired: 0,
    unresolvedInconsistent: 0,
    gradeFalsePositives: 0,
    courseMismatches: 0
  };

  for (const [uid, student] of students) {
    const expectedCourse = String(student.curso || '').trim().toUpperCase();
    for (const sessionId of SESSION_IDS) {
      const response = snapshot.responses[sessionId] && snapshot.responses[sessionId][uid];
      const result = snapshot.results[sessionId] && snapshot.results[sessionId][uid];
      const grade = snapshot.grades[uid] && snapshot.grades[uid][sessionId];
      const telemetry = snapshot.telemetry[sessionId] && snapshot.telemetry[sessionId][uid];
      const state = classifySubmissionStatus(response, { result, grade, telemetry });

      if (response && response.curso && String(response.curso).trim().toUpperCase() !== expectedCourse) {
        counts.courseMismatches += 1;
      }
      if (state.status === 'inconsistent') counts.unresolvedInconsistent += 1;
      if (!state.delivered && grade && (grade.submitted === true || grade.status === 'submitted')) {
        counts.gradeFalsePositives += 1;
      }

      if (state.status === 'legacy_confirmed') {
        const timestamp = supportingTimestamp(response, result, telemetry, recordedAt);
        const meta = {
          source: 'canonical_delivery_reconciliation',
          recordedAt,
          reason: 'Una marca histórica de entrega tenía evidencia de confirmación; se normalizó el par canónico.'
        };
        update[`respuestas/${sessionId}/${uid}/submitted`] = true;
        update[`respuestas/${sessionId}/${uid}/completada`] = true;
        if (!firstPositiveNumber([response.submittedAt])) update[`respuestas/${sessionId}/${uid}/submittedAt`] = timestamp;
        if (!firstPositiveNumber([response.completadaAt])) update[`respuestas/${sessionId}/${uid}/completadaAt`] = timestamp;
        update[`respuestas/${sessionId}/${uid}/deliveryReconciliation`] = meta;
        counts.legacyResponsesRepaired += 1;
        affectedStudents.add(uid);
      }

      if (state.delivered && grade && ['not_submitted', 'draft'].includes(grade.status)) {
        update[`calificaciones_clase/${uid}/${sessionId}/submitted`] = true;
        update[`calificaciones_clase/${uid}/${sessionId}/status`] = 'submitted';
        update[`calificaciones_clase/${uid}/${sessionId}/statusLabel`] = 'Entrega confirmada mediante la respuesta viva.';
        update[`calificaciones_clase/${uid}/${sessionId}/deliveryReconciliation`] = {
          source: 'canonical_delivery_reconciliation',
          recordedAt,
          reason: 'La respuesta viva confirma entrega y la tabla de notas conservaba un estado anterior.'
        };
        counts.staleGradesRepaired += 1;
        affectedStudents.add(uid);
      }
    }
  }

  return { update, counts: { ...counts, affectedStudents: affectedStudents.size, atomicPaths: Object.keys(update).length } };
}

function assertReconciled(snapshot) {
  const report = auditSnapshot(snapshot);
  const legacy = Number(report.findings.legacy_confirmation || 0);
  const stale = Number(report.findings.stale_grade_status || 0);
  if (legacy !== 0 || stale !== 0) {
    throw new Error(`Relectura inválida: legacy_confirmation=${legacy}, stale_grade_status=${stale}.`);
  }
  return report;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const recordedAt = Date.now();
  try {
    const platform = await readPlatform();
    const snapshot = makeSnapshot(platform);
    const plan = buildPlan(snapshot, recordedAt);
    console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', ...plan.counts }, null, 2));
    if (!apply) {
      console.log('Sin cambios. Los casos inconsistentes no se reparan automáticamente.');
      return;
    }
    if (plan.counts.atomicPaths > 0) {
      await updatePlatform(plan.update);
    }
    const verifiedPlatform = await readPlatform();
    const report = assertReconciled(makeSnapshot(verifiedPlatform));
    console.log(JSON.stringify({
      applied: true,
      verifiedPairs: report.pairs,
      remainingFindings: report.findings,
      remainingFindingCount: report.findingCount
    }, null, 2));
  } finally {
    await closeFirebase();
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error(`CLASS_SUBMISSION_RECONCILIATION_FAILED: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { assertReconciled, buildPlan, makeSnapshot, supportingTimestamp };
