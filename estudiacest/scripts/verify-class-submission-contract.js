const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const registryPath = path.join(__dirname, 'class-submission-contract.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const required = [
  ['botón de entrega único', /id=["']submit["']/g, 1],
  ['botón de tipo button', /id=["']submit["'][^>]*type=["']button["']|type=["']button["'][^>]*id=["']submit["']/g, 1],
  ['marca submitted', /submitted\s*:\s*true/g, 1],
  ['marca completada', /completada\s*:\s*true/g, 1],
  ['fecha submittedAt', /submittedAt\s*:/g, 1],
  ['fecha completadaAt', /completadaAt\s*:/g, 1],
  ['puntaje score', /score\s*:/g, 1],
  ['total dinámico', /total\s*:\s*questions\.length/g, 1],
  ['cola de autoguardado', /saveQueue\s*=\s*Promise\.resolve\(\)/g, 1],
  ['espera de autoguardado', /await\s+saveQueue/g, 1],
  ['confirmación visible', /Entrega confirmada/g, 2],
  ['diálogo accesible', /role=["']dialog["'][^>]*aria-modal=["']true["']/g, 1],
  ['estado accesible', /role=["']status["'][^>]*aria-live=["']polite["']/g, 1],
  ['regreso al panel o ruta personal', /\/estudiantes\/dashboard\.html|href=["']#inicio["']|href=["']\/paes\/["']/g, 1],
  ['manejo de error', /catch\s*\(/g, 1]
];

const forbidden = [
  ['respuestas correctas como requisito de entrega', /if\s*\(\s*!conceptOK\(\)\s*\)/],
  ['cantidad de respuestas fijada manualmente', /Object\.keys\(answers\)\.length\s*[<!]==?\s*\d+/],
  ['alert como única validación', /\balert\s*\(/]
];

const failures = [];

for (const entry of registry.files || []) {
  const relativePath = typeof entry === 'string' ? entry : entry.path;
  const storage = typeof entry === 'string' ? 'firebase-client' : entry.storage;
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`${relativePath}: archivo inexistente.`);
    continue;
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
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
  if (storage === 'api' && (!/get-guia-state/.test(source) || !/attempt\.completada\s*!==\s*true/.test(source))) {
    failures.push(`${relativePath}: falta la lectura final de confirmación mediante API.`);
  }

  const inlineScripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
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
