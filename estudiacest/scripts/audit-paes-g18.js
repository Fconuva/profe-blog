const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'paes', 'guia18.html');
const apiPath = path.join(root, 'api', 'paes.js');
const adminPath = path.join(root, 'paes', 'admin', 'index.html');
const portalPath = path.join(root, 'paes', 'index.html');
const materialsPath = path.join(root, 'paes', 'guias.html');
const contractPath = path.join(root, 'scripts', 'class-submission-contract.json');
const manifestPath = path.join(root, 'scripts', 'academic-release-manifest.json');
const source = fs.readFileSync(pagePath, 'utf8');
const api = fs.readFileSync(apiPath, 'utf8');
const admin = fs.readFileSync(adminPath, 'utf8');
const portal = fs.readFileSync(portalPath, 'utf8');
const materials = fs.readFileSync(materialsPath, 'utf8');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function evaluateLiteral(code, name) {
  const sandbox = {};
  vm.runInNewContext(`${name} = ${code}`, sandbox);
  return sandbox[name];
}

const questionMatch = source.match(/const QUESTIONS\s*=\s*(\[[\s\S]*?\]);\s*const TOTAL/);
assert(questionMatch, 'No se pudo extraer QUESTIONS.');
const questions = questionMatch ? evaluateLiteral(questionMatch[1], 'questions') : [];

const keyMatch = api.match(/const G18_KEY = (\{[\s\S]*?\n\});/);
assert(keyMatch, 'No se pudo extraer G18_KEY desde la API.');
const key = keyMatch ? evaluateLiteral(keyMatch[1], 'key') : {};

const feedbackMatch = api.match(/const G18_FEEDBACK = (\{[\s\S]*?\n\});/);
assert(feedbackMatch, 'No se pudo extraer G18_FEEDBACK desde la API.');
const feedback = feedbackMatch ? evaluateLiteral(feedbackMatch[1], 'feedback') : {};

assert(questions.length === 18, `Se esperaban 18 reactivos y se encontraron ${questions.length}.`);
assert(Object.keys(key).length === 18, `La clave del servidor debe tener 18 entradas y tiene ${Object.keys(key).length}.`);
assert(Object.keys(feedback).length === 18, `La retroalimentación debe tener 18 entradas y tiene ${Object.keys(feedback).length}.`);
assert(!questionMatch || !/\bcorrect\s*:/.test(questionMatch[1]), 'La clave correcta no debe viajar en el navegador.');
assert(!/G18_KEY|G18_FEEDBACK/.test(source), 'La página no debe contener la clave ni la retroalimentación del servidor.');

const keys = { A: 0, B: 0, C: 0, D: 0 };
const skills = { LOCALIZAR: 0, INTERPRETAR: 0, EVALUAR: 0 };
const texts = { 1: 0, 2: 0, 3: 0 };
const sequence = [];

questions.forEach((question, index) => {
  const number = index + 1;
  const answer = key[number];
  assert(question.n === number, `Reactivo ${number}: numeración inconsistente.`);
  assert(question.texto >= 1 && question.texto <= 3, `Reactivo ${number}: texto inválido.`);
  assert(question.text && question.text.trim().endsWith('?'), `Reactivo ${number}: el enunciado no es interrogativo.`);
  assert([1, 2, 3].includes(question.nivel), `Reactivo ${number}: nivel de dificultad inválido.`);
  assert(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'].includes(question.task), `Reactivo ${number}: tarea DEMRE inválida.`);
  assert(['A', 'B', 'C', 'D'].includes(answer), `Reactivo ${number}: clave inválida.`);
  assert(Object.keys(question.opts || {}).join('') === 'ABCD', `Reactivo ${number}: debe tener alternativas A-D.`);
  assert(new Set(Object.values(question.opts || {}).map(value => value.trim().toLowerCase())).size === 4, `Reactivo ${number}: alternativas duplicadas.`);
  const lengths = Object.fromEntries(Object.entries(question.opts || {}).map(([letter, value]) => [letter, value.length]));
  const values = Object.values(lengths);
  assert(Math.max(...values) - Math.min(...values) <= 15, `Reactivo ${number}: alternativas con extensión poco paralela.`);
  assert(lengths[answer] < Math.max(...values), `Reactivo ${number}: la clave destaca como la alternativa más larga.`);
  assert(!Object.values(question.opts || {}).some(value => /todas las anteriores|ninguna de las anteriores/i.test(value)), `Reactivo ${number}: distractor global prohibido.`);
  assert(typeof feedback[number] === 'string' && feedback[number].length >= 80, `Reactivo ${number}: retroalimentación insuficiente.`);
  keys[answer] += 1;
  skills[question.skill] += 1;
  texts[question.texto] += 1;
  sequence.push(answer);
});

assert(JSON.stringify(keys) === JSON.stringify({ A: 4, B: 5, C: 4, D: 5 }), `Distribución de claves inesperada: ${JSON.stringify(keys)}.`);
assert(JSON.stringify(skills) === JSON.stringify({ LOCALIZAR: 3, INTERPRETAR: 9, EVALUAR: 6 }), `Cobertura de habilidades inesperada: ${JSON.stringify(skills)}.`);
assert(JSON.stringify(texts) === JSON.stringify({ 1: 6, 2: 6, 3: 6 }), `Distribución por texto inesperada: ${JSON.stringify(texts)}.`);
for (let index = 2; index < sequence.length; index += 1) {
  assert(!(sequence[index] === sequence[index - 1] && sequence[index] === sequence[index - 2]), `Hay tres claves consecutivas iguales en el reactivo ${index + 1}.`);
}
const cycle = ['A', 'B', 'C', 'D'];
for (let offset = 0; offset < 4; offset += 1) {
  assert(!sequence.every((answer, index) => answer === cycle[(index + offset) % 4]), 'La clave sigue una secuencia A-B-C-D predecible.');
}

const readingBlocks = [...source.matchAll(/<article class="reading">([\s\S]*?)<\/article>/g)];
assert(readingBlocks.length === 3, `Se esperaban 3 textos y se encontraron ${readingBlocks.length}.`);
const wordCounts = readingBlocks.map((match, index) => {
  const plain = match[1].replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ');
  const count = (plain.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+/g) || []).length;
  assert(count >= 500 && count <= 2000, `Texto ${index + 1}: extensión ${count}, fuera del rango 500-2000.`);
  return count;
});

assert((source.match(/Texto original elaborado para esta guía\./g) || []).length === 3, 'Los tres textos deben declarar su carácter original.');
assert(/Tesis/.test(source) && /Giro/.test(source) && /Función/.test(source) && /Alcance/.test(source), 'Falta la estrategia completa de arquitectura del ensayo.');
assert(!/<video\b/i.test(source), 'La sesión no debe incluir video.');
assert((source.match(/id=["']submit["']/g) || []).length === 1, 'Debe existir un solo botón final de entrega.');
assert(!/validateBeforeSubmit|Debes responder todas las preguntas antes de entregar/.test(source), 'La entrega no puede depender de completar respuestas.');
assert(/readback\.attempt\.completada!==true/.test(source), 'La entrega no verifica la confirmación del servidor.');
assert(/INCOMPLETE_SUBMISSION_GUIDES = new Set\(Object\.keys\(GUIDED_GUIDE_KEYS\)\)/.test(api), 'La API no permite una entrega incompleta en G18.');
assert(/'18': G18_KEY/.test(api), 'La API no corrige G18 con clave del servidor.');
assert(/'18': G18_FEEDBACK/.test(api), 'La API no asocia la retroalimentación de G18.');
assert(/const answerKey = released && attempt\.completada && selectedKey/.test(api), 'La clave no está protegida por liberación docente.');
assert(/const feedback = released && attempt\.completada && selectedFeedback/.test(api), 'La retroalimentación no está protegida por liberación docente.');
assert(/'18': \{[\s\S]*?total: 18/.test(admin), 'El administrador no registra la Guía 18.');
assert(/id: 'g18'/.test(admin), 'El bloqueo del administrador no incluye la Guía 18.');
assert(/const SESIONES_LIBRO = \[[^\]]*\b18\b/.test(admin), 'El libro de notas no incluye la Guía 18.');
assert(/data-guia-id="g17"/.test(materials) && /data-guia-id="g18"/.test(materials), 'La página de materiales no incluye G17 y G18.');

const card16 = portal.indexOf('id="cardGuia16"');
const card17 = portal.indexOf('id="cardGuia17"');
const card18 = portal.indexOf('id="cardGuia18"');
const card19 = portal.indexOf('id="cardGuia19"');
assert(card16 >= 0 && card16 < card17 && card17 < card18 && card18 < card19, 'El portal no ordena las tarjetas G16 → G17 → G18 → G19.');
assert((portal.match(/<span class="ensayo-tag">Sesión actual<\/span>/g) || []).length === 1, 'Debe existir una sola tarjeta marcada como Sesión actual.');
for (let guide = 20; guide <= 31; guide += 1) {
  assert(portal.includes(`Guía ${guide}</span>`), `Falta la tarjeta futura gris de la Guía ${guide}.`);
}
assert(/PAES Regular de Admisión 2027/.test(portal), 'Falta el hito final de la PAES Regular.');

assert(contract.files.some(entry => entry.path === 'paes/guia18.html' && entry.storage === 'api'), 'G18 no está protegida por el contrato de entrega.');
assert(manifest.criticalFiles.some(entry => entry.path === 'paes/guia18.html'), 'G18 no está en el manifiesto de publicación segura.');

const inlineScripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(script => script.trim());
inlineScripts.forEach((script, index) => {
  try { new Function(script); }
  catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); }
});

if (failures.length) {
  console.error('Auditoría PAES G18 fallida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`PAES G18 auditada: 3 textos (${wordCounts.join(', ')} palabras), 18 reactivos, claves ${JSON.stringify(keys)}, habilidades ${JSON.stringify(skills)}, entrega sin condición y hoja de ruta G19-G31.`);
