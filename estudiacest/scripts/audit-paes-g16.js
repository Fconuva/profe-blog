const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, 'paes', 'guia16.html');
const apiPath = path.join(root, 'api', 'paes.js');
const source = fs.readFileSync(pagePath, 'utf8');
const api = fs.readFileSync(apiPath, 'utf8');
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const marker = 'const QUESTIONS = [';
const start = source.indexOf(marker) + 'const QUESTIONS = '.length;
const end = source.indexOf('\n    ];', start);
assert(start >= 'const QUESTIONS = '.length && end > start, 'No se pudo extraer QUESTIONS.');

let questions = [];
if (!failures.length) {
  const sandbox = {};
  vm.runInNewContext(`questions = ${source.slice(start, end + 6)}`, sandbox);
  questions = sandbox.questions;
}

assert(questions.length === 25, `Se esperaban 25 reactivos y se encontraron ${questions.length}.`);
const keys = { A:0, B:0, C:0, D:0 };
const skills = { LOCALIZAR:0, INTERPRETAR:0, EVALUAR:0 };
const levels = { 1:0, 2:0, 3:0 };

questions.forEach((question, index) => {
  const number = index + 1;
  assert(question.n === number, `Reactivo ${number}: numeracion inconsistente.`);
  assert(question.text && question.text.trim().endsWith('?'), `Reactivo ${number}: el enunciado no es interrogativo.`);
  assert(['A','B','C','D'].includes(question.correct), `Reactivo ${number}: clave invalida.`);
  const options = Object.keys(question.opts || {});
  assert(options.join('') === 'ABCD', `Reactivo ${number}: debe tener alternativas A-D.`);
  assert(new Set(Object.values(question.opts || {}).map(value => value.trim().toLowerCase())).size === 4, `Reactivo ${number}: alternativas duplicadas.`);
  const lengths = Object.values(question.opts || {}).map(value => value.length);
  assert(Math.max(...lengths) - Math.min(...lengths) <= 18, `Reactivo ${number}: alternativas con extension poco paralela.`);
  assert(!Object.values(question.opts || {}).some(value => /todas las anteriores|ninguna de las anteriores/i.test(value)), `Reactivo ${number}: distractor global prohibido.`);
  assert(question.fb && question.fb.includes(`clave es ${question.correct}`), `Reactivo ${number}: retroalimentacion no coincide con la clave.`);
  if (keys[question.correct] !== undefined) keys[question.correct]++;
  if (skills[question.skill] !== undefined) skills[question.skill]++;
  if (levels[question.nivel] !== undefined) levels[question.nivel]++;
});

assert(Math.max(...Object.values(keys)) - Math.min(...Object.values(keys)) <= 1, `Distribucion de claves desequilibrada: ${JSON.stringify(keys)}.`);
assert(JSON.stringify(skills) === JSON.stringify({ LOCALIZAR:5, INTERPRETAR:7, EVALUAR:13 }), `Cobertura de habilidades inesperada: ${JSON.stringify(skills)}.`);
assert(JSON.stringify(levels) === JSON.stringify({ 1:4, 2:13, 3:8 }), `Distribucion de dificultad inesperada: ${JSON.stringify(levels)}.`);
for (let index = 2; index < questions.length; index++) {
  assert(!(questions[index].correct === questions[index - 1].correct && questions[index].correct === questions[index - 2].correct), `Hay tres claves consecutivas iguales en el reactivo ${index + 1}.`);
}

const assets = [
  ['paes/assets/guia16/infografia-sismo.png', 600000],
  ['paes/assets/guia16/folleto-punto-verde.png', 440000],
  ['paes/assets/guia16/instructivo-tne.png', 520000],
  ['paes/assets/guia16/video-textos-discontinuos.mp4', 6000000],
  ['paes/assets/guia16/video-textos-discontinuos.vtt', 500]
];
assets.forEach(([relative, minBytes]) => {
  const absolute = path.join(root, relative);
  assert(fs.existsSync(absolute), `Falta el recurso ${relative}.`);
  if (fs.existsSync(absolute)) assert(fs.statSync(absolute).size >= minBytes, `${relative} no alcanza el tamano minimo esperado.`);
});

assert((source.match(/id=["']submit["']/g) || []).length === 1, 'Debe existir un solo boton final de entrega.');
assert(!/id=["']btnReview["']/.test(source), 'No debe existir revision libre antes de la liberacion docente.');
assert(/get-guia-state&guiaId=16/.test(source), 'La pagina no consulta el estado y la liberacion de resultados.');
assert(/resultReleased\s*=\s*Boolean\(data\.released/.test(source), 'La retroalimentacion no esta condicionada por la liberacion docente.');
assert(/const G16_KEY\s*=/.test(api) && /'16': G16_KEY/.test(api), 'La API no corrige G16 con clave del servidor.');
assert(/admin-set-guia-release/.test(api), 'La API no expone la liberacion generica de resultados.');

const inlineScripts = [...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(script => script.trim());
inlineScripts.forEach((script, index) => {
  try { new Function(script); }
  catch (error) { failures.push(`Script embebido ${index + 1} invalido: ${error.message}`); }
});

if (failures.length) {
  console.error('Auditoria PAES G16 fallida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`PAES G16 auditada: ${questions.length} reactivos; claves ${JSON.stringify(keys)}; habilidades ${JSON.stringify(skills)}; niveles ${JSON.stringify(levels)}; flujo y recursos verificados.`);
