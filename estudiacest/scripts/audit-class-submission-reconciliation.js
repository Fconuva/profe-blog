'use strict';

const assert = require('assert');
const { SESSION_IDS } = require('./audit-class-submission-integrity');
const { assertReconciled, buildPlan } = require('./reconcile-class-submission-statuses');

function setPath(target, path, value) {
  const parts = path.split('/');
  let cursor = target;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) cursor[part] = value;
    else cursor = cursor[part] = cursor[part] || {};
  });
}

function makeFixture() {
  const students = {};
  for (let index = 0; index < 86; index += 1) {
    students[`uid-${index}`] = { curso: index < 46 ? '2A-HC' : '2B-HC' };
  }
  return {
    students,
    responses: {
      'sesion-u3-1': {
        'uid-0': { submitted: true, submittedAt: 1000 },
        'uid-1': { submitted: true, completada: true, submittedAt: 2000, completadaAt: 2000 },
        'uid-3': { completada: true }
      }
    },
    results: { 'sesion-u3-2': { 'uid-2': { score: 10, total: 12 } } },
    grades: {
      'uid-0': { 'sesion-u3-1': { status: 'draft', grade: 5.5 } },
      'uid-1': { 'sesion-u3-1': { status: 'not_submitted', grade: 6.0 } }
    },
    telemetry: {}
  };
}

function run() {
  const fixture = makeFixture();
  const plan = buildPlan(fixture, 3000);
  assert.strictEqual(plan.counts.students, 86);
  assert.strictEqual(plan.counts.sessions, SESSION_IDS.length);
  assert.strictEqual(plan.counts.pairs, 946);
  assert.strictEqual(plan.counts.legacyResponsesRepaired, 1);
  assert.strictEqual(plan.counts.staleGradesRepaired, 2);
  assert.strictEqual(plan.counts.unresolvedInconsistent, 2);
  assert.strictEqual(plan.counts.affectedStudents, 2);
  assert.strictEqual(plan.counts.atomicPaths, 12);
  assert.strictEqual(plan.update['respuestas/sesion-u3-1/uid-0/completada'], true);
  assert.strictEqual(plan.update['respuestas/sesion-u3-1/uid-0/completadaAt'], 1000);
  assert.strictEqual(plan.update['calificaciones_clase/uid-0/sesion-u3-1/grade'], undefined);
  assert.strictEqual(plan.update['respuestas/sesion-u3-2/uid-2/submitted'], undefined);
  assert.strictEqual(plan.update['respuestas/sesion-u3-1/uid-3/submitted'], undefined);

  for (const [path, value] of Object.entries(plan.update)) {
    const fixturePath = path
      .replace(/^respuestas\//, 'responses/')
      .replace(/^calificaciones_clase\//, 'grades/');
    setPath(fixture, fixturePath, value);
  }
  const report = assertReconciled(fixture);
  assert.strictEqual(report.findings.legacy_confirmation || 0, 0);
  assert.strictEqual(report.findings.stale_grade_status || 0, 0);
  assert.strictEqual(report.findings.noncanonical_or_partial_evidence, 2);
  console.log('Reconciliación general auditada: normaliza evidencia heredada, corrige estados obsoletos y conserva intactos los casos ambiguos.');
}

run();
