const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'paes', 'guia17.html');
const apiPath = path.join(root, 'api', 'paes.js');
const adminPath = path.join(root, 'paes', 'admin', 'index.html');
const portalPath = path.join(root, 'paes', 'index.html');
const source = fs.readFileSync(pagePath, 'utf8');
const api = fs.readFileSync(apiPath, 'utf8');
const admin = fs.readFileSync(adminPath, 'utf8');
const portal = fs.readFileSync(portalPath, 'utf8');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function evaluateLiteral(code, name) {
  const sandbox = {};
  vm.runInNewContext(`${name} = ${code}`, sandbox);
  return sandbox[name];
}

const questionMatch = source.match(/const QUESTIONS = (\[[\s\S]*?\n\s*\]);\n\s*const TOTAL/);
assert(questionMatch, 'No se pudo extraer QUESTIONS.');
const questions = questionMatch ? evaluateLiteral(questionMatch[1], 'questions') : [];

const keyMatch = api.match(/const G17_KEY = (\{[\s\S]*?\n\});/);
assert(keyMatch, 'No se pudo extraer G17_KEY desde la API.');
const key = keyMatch ? evaluateLiteral(keyMatch[1], 'key') : {};

assert(questions.length === 24, `Se esperaban 24 reactivos y se encontraron ${questions.length}.`);
assert(Object.keys(key).length === 24, `La clave del servidor debe tener 24 entradas y tiene ${Object.keys(key).length}.`);
assert(!questionMatch || !/\bcorrect\s*:/.test(questionMatch[1]), 'La clave correcta no debe viajar en el navegador.');

const keys = { A: 0, B: 0, C: 0, D: 0 };
const skills = { LOCALIZAR: 0, INTERPRETAR: 0, EVALUAR: 0 };
const texts = { 1: 0, 2: 0, 3: 0, 4: 0 };
const sequence = [];

questions.forEach((question, index) => {
  const number = index + 1;
  const answer = key[number];
  assert(question.n === number, `Reactivo ${number}: numeración inconsistente.`);
  assert(question.texto >= 1 && question.texto <= 4, `Reactivo ${number}: texto inválido.`);
  assert(question.text && question.text.trim().endsWith('?'), `Reactivo ${number}: el enunciado no es interrogativo.`);
  assert(question.nivel === 3, `Reactivo ${number}: la sesión exige nivel alto.`);
  assert(['A', 'B', 'C', 'D'].includes(answer), `Reactivo ${number}: clave inválida.`);
  assert(Object.keys(question.opts || {}).join('') === 'ABCD', `Reactivo ${number}: debe tener alternativas A-D.`);
  assert(new Set(Object.values(question.opts || {}).map(value => value.trim().toLowerCase())).size === 4, `Reactivo ${number}: alternativas duplicadas.`);
  const lengths = Object.values(question.opts || {}).map(value => value.length);
  assert(Math.max(...lengths) - Math.min(...lengths) <= 15, `Reactivo ${number}: alternativas con extensión poco paralela.`);
  assert(!Object.values(question.opts || {}).some(value => /todas las anteriores|ninguna de las anteriores/i.test(value)), `Reactivo ${number}: distractor global prohibido.`);
  keys[answer] += 1;
  skills[question.skill] += 1;
  texts[question.texto] += 1;
  sequence.push(answer);
});

assert(JSON.stringify(keys) === JSON.stringify({ A: 6, B: 6, C: 6, D: 6 }), `Distribución de claves inesperada: ${JSON.stringify(keys)}.`);
assert(JSON.stringify(skills) === JSON.stringify({ LOCALIZAR: 4, INTERPRETAR: 12, EVALUAR: 8 }), `Cobertura de habilidades inesperada: ${JSON.stringify(skills)}.`);
assert(JSON.stringify(texts) === JSON.stringify({ 1: 6, 2: 6, 3: 6, 4: 6 }), `Distribución por texto inesperada: ${JSON.stringify(texts)}.`);
for (let index = 2; index < sequence.length; index += 1) {
  assert(!(sequence[index] === sequence[index - 1] && sequence[index] === sequence[index - 2]), `Hay tres claves consecutivas iguales en el reactivo ${index + 1}.`);
}
const cycle = ['A', 'B', 'C', 'D'];
for (let offset = 0; offset < 4; offset += 1) {
  assert(!sequence.every((answer, index) => answer === cycle[(index + offset) % 4]), 'La clave sigue una secuencia A-B-C-D predecible.');
}

const readingBlocks = [...source.matchAll(/<article class="reading">([\s\S]*?)<\/article><div class="questions"/g)];
assert(readingBlocks.length === 4, `Se esperaban 4 textos y se encontraron ${readingBlocks.length}.`);
readingBlocks.forEach((match, index) => {
  const plain = match[1].replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ');
  const wordCount = (plain.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/g) || []).length;
  assert(wordCount >= 750 && wordCount <= 1100, `Texto ${index + 1}: extensión ${wordCount}, fuera del rango 750-1100.`);
});

assert((source.match(/Texto original elaborado para esta guía\./g) || []).length === 4, 'Los cuatro textos deben declarar su carácter original.');
assert(/Estrategia de doble evidencia/.test(source), 'Falta la infografía de estrategia.');
assert(!/<video\b/i.test(source), 'La sesión no debe incluir video.');
assert((source.match(/id=["']submit["']/g) || []).length === 1, 'Debe existir un solo botón final de entrega.');
assert(!/validateBeforeSubmit|Debes responder todas las preguntas antes de entregar/.test(source), 'La entrega no puede depender de completar respuestas.');
assert(/INCOMPLETE_SUBMISSION_GUIDES = new Set\(\[[^\]]*'17'[^\]]*\]\)/.test(api), 'La API no permite una entrega incompleta en G17.');
assert(/released && attempt\.completada && INTERACTIVE_GUIDE_KEYS\[guideId\]/.test(api), 'La clave no está protegida por liberación docente.');
assert(/'17': G17_KEY/.test(api), 'La API no corrige G17 con clave del servidor.');
assert(/function normalizeStoredAnswers\(rawAnswers\)/.test(api), 'La API no normaliza arreglos de respuestas provenientes de RTDB.');
assert(
  (api.match(/answers: normalizeStoredAnswers\(/g) || []).length >= 2 ||
  (/const normalizedAnswers = normalizeStoredAnswers\(value\.answers\)/.test(api) && /answers: normalizedAnswers/.test(api)),
  'La API no normaliza respuestas en borrador y estado final.'
);
const normalizerMatch = api.match(/function normalizeStoredAnswers\(rawAnswers\) \{[\s\S]*?\n\}/);
if (normalizerMatch) {
  const normalizerSandbox = {};
  vm.runInNewContext(`${normalizerMatch[0]}; normalized = normalizeStoredAnswers([null, 'C', 'D'])`, normalizerSandbox);
  assert(JSON.stringify(normalizerSandbox.normalized) === JSON.stringify({ 1: 'C', 2: 'D' }), 'La normalización no elimina el índice nulo de un arreglo RTDB.');
}
assert(/'17': \{[\s\S]*?total: 24/.test(admin), 'El admin no registra la Guía 17.');
assert(/id="cardGuia17"/.test(portal) && /href="guia17\.html"/.test(portal), 'El portal no publica la tarjeta de G17.');

const inlineScripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(script => script.trim());
inlineScripts.forEach((script, index) => {
  try { new Function(script); }
  catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); }
});

if (failures.length) {
  console.error('Auditoría PAES G17 fallida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

const counts = readingBlocks.map(match => {
  const plain = match[1].replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ');
  return (plain.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/g) || []).length;
});
console.log(`PAES G17 auditada: 4 textos (${counts.join(', ')} palabras), 24 reactivos, claves ${JSON.stringify(keys)}, habilidades ${JSON.stringify(skills)} y entrega sin condición.`);
