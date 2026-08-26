const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const source = read('paes/guia19.html');
const guided = read('paes/guia19-guiada.html');
const css = read('paes/css/guia19.css');
const api = read('api/paes.js');
const admin = read('paes/admin/index.html');
const portal = read('paes/index.html');
const materials = read('paes/guias.html');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));
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

const keyMatch = api.match(/const G19_KEY = (\{[\s\S]*?\n\});/);
assert(keyMatch, 'No se pudo extraer G19_KEY desde la API.');
const key = keyMatch ? evaluateLiteral(keyMatch[1], 'key') : {};

const feedbackMatch = api.match(/const G19_FEEDBACK = (\{[\s\S]*?\n\});/);
assert(feedbackMatch, 'No se pudo extraer G19_FEEDBACK desde la API.');
const feedback = feedbackMatch ? evaluateLiteral(feedbackMatch[1], 'feedback') : {};

assert(questions.length === 18, `Se esperaban 18 reactivos y se encontraron ${questions.length}.`);
assert(Object.keys(key).length === 18, `La clave del servidor debe tener 18 entradas y tiene ${Object.keys(key).length}.`);
assert(Object.keys(feedback).length === 18, `La retroalimentación debe tener 18 entradas y tiene ${Object.keys(feedback).length}.`);
assert(!questionMatch || !/\bcorrect\s*:/.test(questionMatch[1]), 'La clave correcta no debe viajar en el navegador.');
assert(!/G19_KEY|G19_FEEDBACK/.test(source), 'La página no debe contener la clave ni la retroalimentación del servidor.');

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
  const options = Object.values(question.opts || {});
  assert(new Set(options.map((value) => value.trim().toLowerCase())).size === 4, `Reactivo ${number}: alternativas duplicadas.`);
  const lengths = Object.fromEntries(Object.entries(question.opts || {}).map(([letter, value]) => [letter, value.length]));
  const values = Object.values(lengths);
  assert(Math.max(...values) - Math.min(...values) <= 18, `Reactivo ${number}: alternativas con extensión poco paralela (${values.join(', ')}).`);
  assert(lengths[answer] < Math.max(...values), `Reactivo ${number}: la clave destaca como la alternativa más larga.`);
  assert(!options.some((value) => /todas las anteriores|ninguna de las anteriores/i.test(value)), `Reactivo ${number}: distractor global prohibido.`);
  assert(typeof feedback[number] === 'string' && feedback[number].length >= 100, `Reactivo ${number}: retroalimentación insuficiente.`);
  keys[answer] += 1;
  skills[question.skill] += 1;
  texts[question.texto] += 1;
  sequence.push(answer);
});

assert(JSON.stringify(keys) === JSON.stringify({ A: 5, B: 4, C: 5, D: 4 }), `Distribución de claves inesperada: ${JSON.stringify(keys)}.`);
assert(JSON.stringify(skills) === JSON.stringify({ LOCALIZAR: 3, INTERPRETAR: 12, EVALUAR: 3 }), `Cobertura de habilidades inesperada: ${JSON.stringify(skills)}.`);
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
assert(/Estrategia RASTRO/.test(source) && /Rol/.test(source) && /Alrededores/.test(source) && /Sustitución/.test(source) && /Totalidad/.test(source), 'Falta la estrategia visual completa para vocabulario contextual.');
assert((source.match(/class="target"/g) || []).length >= 9, 'Faltan términos contextualizados visibles en las lecturas.');
assert(!/<video\b/i.test(source), 'La sesión no debe incluir video.');
assert((source.match(/id=["']submit["']/g) || []).length === 1, 'Debe existir un solo botón final de entrega.');
assert(!/validateBeforeSubmit|Debes responder todas las preguntas antes de entregar/.test(source), 'La entrega no puede depender de completar respuestas.');
assert(/readback\.attempt\.completada!==true/.test(source), 'La entrega no verifica la confirmación del servidor.');
assert(/await window\.checkGuiaAccess\(student\.rut\)/.test(source), 'El acceso directo no vuelve a comprobar el bloqueo docente después del ingreso.');
assert(/INCOMPLETE_SUBMISSION_GUIDES = new Set\(\['17', '18', '19'\]\)/.test(api), 'La API no permite una entrega incompleta en G19.');
assert(/'19': G19_KEY/.test(api), 'La API no corrige G19 con clave del servidor.');
assert(/'19': G19_FEEDBACK/.test(api), 'La API no asocia la retroalimentación de G19.');
assert(/const answerKey = released && attempt\.completada && selectedKey/.test(api), 'La clave no está protegida por liberación docente.');
assert(/const feedback = released && attempt\.completada && selectedFeedback/.test(api), 'La retroalimentación no está protegida por liberación docente.');
assert(/'19': \{[\s\S]*?total: 18/.test(admin), 'El administrador no registra la Guía 19.');
assert(/id: 'g19'/.test(admin), 'El bloqueo del administrador no incluye la Guía 19.');
assert(/const SESIONES_LIBRO = \[[^\]]*19\]/.test(admin), 'El libro de notas no incluye la Guía 19.');
assert(/data-guia-id="g19"/.test(materials), 'La página de materiales no incluye G19.');

const card18 = portal.indexOf('id="cardGuia18"');
const card19 = portal.indexOf('id="cardGuia19"');
assert(card18 >= 0 && card18 < card19, 'El portal no ordena G18 antes de G19.');
assert((portal.match(/<span class="ensayo-tag">Sesión actual<\/span>/g) || []).length === 1, 'Debe existir una sola tarjeta marcada como Sesión actual.');
assert(/id="cardGuia19"[\s\S]*?<span class="ensayo-tag">Sesión actual<\/span>/.test(portal), 'La Guía 19 no figura como sesión actual.');
for (let guide = 20; guide <= 31; guide += 1) assert(portal.includes(`Guía ${guide}</span>`), `Falta la tarjeta futura gris de la Guía ${guide}.`);

assert(contract.files.some((entry) => entry.path === 'paes/guia19.html' && entry.storage === 'api'), 'G19 no está protegida por el contrato de entrega.');
for (const requiredPath of ['paes/guia19.html', 'paes/guia19-guiada.html', 'paes/css/guia19.css']) {
  assert(manifest.criticalFiles.some((entry) => entry.path === requiredPath), `${requiredPath} no está en el manifiesto de publicación segura.`);
}
assert(guided.includes("guideId: '19'"), 'La ruta guiada no declara la Guía 19.');
assert(css.includes('.strategy-grid'), 'La hoja visual de G19 no contiene la estrategia esperada.');

const inlineScripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]).filter((script) => script.trim());
inlineScripts.forEach((script, index) => {
  try { new Function(script); }
  catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); }
});

if (failures.length) {
  console.error('Auditoría PAES G19 fallida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`PAES G19 auditada: 3 textos (${wordCounts.join(', ')} palabras), 18 reactivos, claves ${JSON.stringify(keys)}, habilidades ${JSON.stringify(skills)}, ruta guiada y entrega sin condición.`);
