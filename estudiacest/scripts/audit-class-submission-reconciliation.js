'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
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
  for (let index = 0; index < 87; index += 1) {
    students[`uid-${index}`] = { curso: index < 46 ? '2A-HC' : '2B-HC' };
  }
  return {
    students,
    responses: {
      'sesion-u3-1': {
        'uid-0': { submitted: true, submittedAt: 1000 },
        'uid-1': { submitted: true, completada: true, submittedAt: 2000, completadaAt: 2000 },
        'uid-3': { completada: true }
      },
      'sesion-u3-5': {
        'uid-4': { submitted: false, completada: false, answers: { q1: 'A' } }
      }
    },
    results: { 'sesion-u3-2': { 'uid-2': { score: 10, total: 12 } } },
    grades: {
      'uid-0': { 'sesion-u3-1': { status: 'draft', grade: 5.5 } },
      'uid-1': { 'sesion-u3-1': { status: 'not_submitted', grade: 6.0 } },
      'uid-4': { 'sesion-u3-5': { status: 'not_submitted', grade: 1.0 } }
    },
    telemetry: {
      'sesion-u3-5': {
        'uid-4': { submittedAt: 2400, submissionConfirmedAt: 2500, submissionConfirmationCount: 1 }
      }
    }
  };
}

function run() {
  const fixture = makeFixture();
  const plan = buildPlan(fixture, 3000);
  assert.strictEqual(plan.counts.students, 87);
  assert.strictEqual(plan.counts.sessions, SESSION_IDS.length);
  assert.strictEqual(plan.counts.pairs, 1044);
  assert.strictEqual(plan.counts.legacyResponsesRepaired, 1);
  assert.strictEqual(plan.counts.telemetryConfirmationsRepaired, 1);
  assert.strictEqual(plan.counts.staleGradesRepaired, 3);
  assert.strictEqual(plan.counts.unresolvedInconsistent, 2);
  assert.strictEqual(plan.counts.affectedStudents, 3);
  assert.strictEqual(plan.counts.atomicPaths, 23);
  assert.strictEqual(plan.update['respuestas/sesion-u3-1/uid-0/completada'], true);
  assert.strictEqual(plan.update['respuestas/sesion-u3-1/uid-0/completadaAt'], 1000);
  assert.strictEqual(plan.update['calificaciones_clase/uid-0/sesion-u3-1/grade'], undefined);
  assert.strictEqual(plan.update['respuestas/sesion-u3-2/uid-2/submitted'], undefined);
  assert.strictEqual(plan.update['respuestas/sesion-u3-1/uid-3/submitted'], undefined);
  assert.strictEqual(plan.update['respuestas/sesion-u3-5/uid-4/submitted'], true);
  assert.strictEqual(plan.update['respuestas/sesion-u3-5/uid-4/completada'], true);
  assert.strictEqual(plan.update['respuestas/sesion-u3-5/uid-4/manualCompletion'], true);
  assert.strictEqual(plan.update['respuestas/sesion-u3-5/uid-4/attestation'].source, 'submission_telemetry_recovery');

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
  const admin = fs.readFileSync(path.join(__dirname, '..', 'estudiantes', 'adminprofe', 'index.html'), 'utf8');
  assert.match(admin, /function classifyAdminSubmission\(response,result\)/);
  assert.match(admin, /const delivery=classifyAdminSubmission\(resp,res\)/);
  assert.match(admin, /!classifyAdminSubmission\(resp,resSes\[uid\]\)\.completed/);
  assert.match(admin, /\[`respuestas\/\$\{sesId\}\/\$\{p\.uid\}\/submitted`\]:true/);
  assert.match(admin, /\[`respuestas\/\$\{sesId\}\/\$\{p\.uid\}\/completada`\]:true/);
  assert.match(admin, /await db\.ref\(BASE\)\.update\(forcedUpdate\)/);
  assert.match(admin, /submitted:null, submittedAt:null, completadaAt:null, submitted_at:null, completada:null/);
  console.log('Reconciliación general auditada: normaliza evidencia heredada, corrige estados obsoletos y conserva intactos los casos ambiguos.');
}

run();
