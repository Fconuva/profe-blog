const fs = require('fs');
const path = require('path');
const { classifySubmissionStatus } = require('./class-submission-status');

const ROOT = path.resolve(__dirname, '..');
const registryPath = path.join(__dirname, 'class-submission-contract.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const expectedStatusResolution = {
  identity: ['sessionId', 'uid', 'course'],
  primaryFlag: 'completada',
  confirmedRequires: ['submitted', 'completada'],
  nonCanonicalEvidence: ['result', 'grade', 'telemetry'],
  states: ['manual_attestation', 'confirmed', 'legacy_confirmed', 'inconsistent', 'draft', 'missing']
};

const required = [
  ['botón de entrega único', /id=["'](?:submit|submitGuide)["']/g, 1],
  ['botón de tipo button', /id=["'](?:submit|submitGuide)["'][^>]*type=["']button["']|type=["']button["'][^>]*id=["'](?:submit|submitGuide)["']/g, 1],
  ['marca submitted', /submitted\s*:\s*(?:true|!draft)/g, 1],
  ['marca completada', /completada\s*:\s*(?:true|!draft)/g, 1],
  ['fecha submittedAt', /submittedAt\s*:/g, 1],
  ['fecha completadaAt', /completadaAt\s*:/g, 1],
  ['puntaje score', /score\s*:/g, 1],
  ['total dinámico', /total\s*:\s*(?:(?:(?:config|activity)\.)?questions|QUESTIONS)\.length|const\s+TOTAL\s*=\s*(?:config|activity)\.questions\.length/g, 1],
  ['cola de autoguardado', /saveQueue\s*=\s*Promise\.resolve\(\)/g, 1],
  ['espera de autoguardado', /await\s+saveQueue/g, 1],
  ['confirmación visible', /Entrega confirmada/g, 2],
  ['diálogo accesible', /role=["']dialog["'][^>]*aria-modal=["']true["']/g, 1],
  ['estado accesible', /role=["']status["'][^>]*aria-live=["']polite["']/g, 1],
  ['regreso al panel o ruta personal', /\/estudiantes\/dashboard\.html|href=["']#inicio["']|href=["']\/paes\/["']|href=["']\/estudiantes\/apoyo-personal\/["']/g, 1],
  ['manejo de error', /catch\s*\(/g, 1]
];

const forbidden = [
  ['respuestas correctas como requisito de entrega', /if\s*\(\s*!conceptOK\(\)\s*\)/],
  ['cantidad de respuestas fijada manualmente', /Object\.keys\(answers\)\.length\s*[<!]==?\s*\d+/],
  ['alert como única validación', /\balert\s*\(/]
];

const failures = [];

if (Number(registry.version || 0) < 2) failures.push('El registro no declara la versión 2 del lector canónico.');
if (registry.documentation !== 'CONTRATO_ENTREGA_CLASES.md') failures.push('El registro no enlaza la documentación canónica.');
const resolution = registry.statusResolution || {};
Object.entries(expectedStatusResolution).forEach(([key, expected]) => {
  const actual = resolution[key];
  const matches = Array.isArray(expected)
    ? Array.isArray(actual) && JSON.stringify(actual) === JSON.stringify(expected)
    : actual === expected;
  if (!matches) failures.push(`El lector canónico declara ${key} de forma incorrecta.`);
});
if (!Array.isArray(resolution.supportingEvidence) || !resolution.supportingEvidence.includes('telemetry.submissionConfirmationCount')) {
  failures.push('El lector canónico no distingue la telemetría como evidencia de apoyo.');
}
if (!Array.isArray(resolution.manualAttestationRequires) || !resolution.manualAttestationRequires.includes('attestation.reason')) {
  failures.push('El lector canónico no exige una atestación docente auditable.');
}

const statusFixtures = [
  [{ submitted: true, completada: true, submittedAt: 1 }, {}, 'confirmed', true],
  [{ submitted: true, completada: true, manualCompletion: true, attestation: { source: 'teacher', recordedAt: 1, reason: 'observación directa' } }, {}, 'manual_attestation', true],
  [{ completada: true, submitted_at: 1 }, {}, 'legacy_confirmed', true],
  [{ submitted: true }, {}, 'inconsistent', false],
  [{ answers: { q1: 'A' } }, {}, 'draft', false],
  [null, { result: { score: 10 } }, 'inconsistent', false],
  [null, {}, 'missing', false]
];
statusFixtures.forEach(([response, supporting, expectedStatus, expectedDelivered]) => {
  const actual = classifySubmissionStatus(response, supporting);
  if (actual.status !== expectedStatus || actual.delivered !== expectedDelivered) {
    failures.push(`El lector canónico resolvió ${expectedStatus} como ${actual.status}.`);
  }
});

for (const entry of registry.files || []) {
  const relativePath = typeof entry === 'string' ? entry : entry.path;
  const storage = typeof entry === 'string' ? 'firebase-client' : entry.storage;
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`${relativePath}: archivo inexistente.`);
    continue;
  }

  const pageSource = fs.readFileSync(absolutePath, 'utf8');
  const relatedPaths = [entry.logic, entry.backend].flat().filter(Boolean);
  const relatedSources = relatedPaths.map((relatedPath) => {
    const absoluteRelatedPath = path.join(ROOT, relatedPath);
    if (!fs.existsSync(absoluteRelatedPath)) {
      failures.push(`${relativePath}: dependencia de entrega inexistente (${relatedPath}).`);
      return '';
    }
    return fs.readFileSync(absoluteRelatedPath, 'utf8');
  });
  const source = [pageSource, ...relatedSources].join('\n');
  for (const [label, pattern, minimum] of required) {
    const count = (source.match(pattern) || []).length;
    if (label === 'botón de entrega único' ? count !== 1 : count < minimum) {
      failures.push(`${relativePath}: incumple ${label} (encontrado ${count}, esperado ${label === 'botón de entrega único' ? '1' : `>= ${minimum}`}).`);
    }
  }

  for (const [label, pattern] of forbidden) {
    if (pattern.test(source)) failures.push(`${relativePath}: patrón prohibido: ${label}.`);
  }

  if (storage === 'firebase-client' && !/child\(["']completada["']\)\.once\(["']value["']\)/.test(source)) {
    failures.push(`${relativePath}: falta la verificación final de Firebase.`);
  }
  if (storage === 'api' && (!/(?:get-guia-state|personal-guided-state)/.test(source) || !/attempt\.completada\s*!==\s*true/.test(source))) {
    failures.push(`${relativePath}: falta la lectura final de confirmación mediante API.`);
  }
  if (relativePath.startsWith('estudiantes/guia-') && !/work-telemetry\.js["'][^>]*data-session=["'][^"']+["']/.test(source)) {
    failures.push(`${relativePath}: falta work-telemetry.js con data-session.`);
  }

  const inlineScripts = [...pageSource.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1])
    .filter(script => script.trim());
  inlineScripts.forEach((script, index) => {
    try {
      new Function(script);
    } catch (error) {
      failures.push(`${relativePath}: script embebido ${index + 1} inválido: ${error.message}`);
    }
  });
}

if (failures.length) {
  console.error('Contrato de entrega incumplido:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`Contrato de entrega verificado en ${(registry.files || []).length} clase(s).`);
