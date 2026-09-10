'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const data = JSON.parse(read('paes/data/guia20.json'));
const G20 = require(path.join(root, 'api/_paes-g20.js'));
const html = read('paes/guia20.html');
const js = read('paes/js/guia20.js');
const css = read('paes/css/guia20.css');
const api = read('api/paes.js');
const admin = read('paes/admin/index.html');
const portal = read('paes/index.html');
const materials = read('paes/guias.html');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(Array.isArray(data.sets) && data.sets.length === 3, `Se esperaban 3 pares y hay ${(data.sets || []).length}.`);
const pairWordCounts = [];
(data.sets || []).forEach((set, index) => {
  const number = index + 1;
  assert(set.title && set.focus, `El par ${number} no declara título o foco de contraste.`);
  assert(Array.isArray(set.texts) && set.texts.length === 2, `El par ${number} no contiene exactamente dos textos.`);
  let pairWords = 0;
  (set.texts || []).forEach((text, textIndex) => {
    const words = (text.paragraphs || []).join(' ').split(/\s+/).filter(Boolean).length;
    pairWords += words;
    assert(text.label === `Texto ${textIndex ? 'B' : 'A'}`, `El par ${number} no rotula sus textos A y B en orden.`);
    assert(text.title && text.genre, `Un texto del par ${number} no declara título o género.`);
    assert((text.paragraphs || []).length >= 4, `Un texto del par ${number} tiene menos de 4 párrafos.`);
    assert(words >= 190 && words <= 420, `Un texto del par ${number} tiene ${words} palabras; se esperaban entre 190 y 420.`);
  });
  pairWordCounts.push(pairWords);
  assert(pairWords >= 450 && pairWords <= 750, `El par ${number} suma ${pairWords} palabras; se esperaban entre 450 y 750.`);
});

const questions = data.questions || [];
assert(questions.length === 18, `Se esperaban 18 reactivos y hay ${questions.length}.`);
const perSet = {};
const skills = { LOCALIZAR:0, INTERPRETAR:0, EVALUAR:0 };
const letters = { A:0, B:0, C:0, D:0 };
questions.forEach((question, index) => {
  const answer = G20.key[question.n];
  assert(question.n === index + 1, `Reactivo en posición ${index + 1} numerado como ${question.n}.`);
  assert([1,2,3].includes(question.set), `Reactivo ${question.n} no apunta a un par válido.`);
  assert(['LOCALIZAR','INTERPRETAR','EVALUAR'].includes(question.skill), `Reactivo ${question.n} no declara habilidad válida.`);
  assert([1,2,3].includes(question.level), `Reactivo ${question.n} no declara dificultad válida.`);
  assert(typeof question.text === 'string' && question.text.trim().endsWith('?'), `Reactivo ${question.n} no tiene enunciado interrogativo.`);
  assert(question.opts && Object.keys(question.opts).join('') === 'ABCD', `Reactivo ${question.n} no tiene exactamente alternativas A-D.`);
  const options = Object.values(question.opts || {});
  assert(new Set(options.map(value => value.trim().toLowerCase())).size === 4, `Reactivo ${question.n} contiene alternativas duplicadas.`);
  assert(!options.some(value => /todas las anteriores|ninguna de las anteriores/i.test(value)), `Reactivo ${question.n} usa un distractor global prohibido.`);
  ['key','correct','correcta','answer','feedback','retro'].forEach(field => assert(!(field in question), `El JSON público expone ${field} en el reactivo ${question.n}.`));
  assert(['A','B','C','D'].includes(answer), `Reactivo ${question.n} no tiene clave válida en servidor.`);
  assert(typeof G20.feedback[question.n] === 'string' && G20.feedback[question.n].length >= 100, `Reactivo ${question.n} no tiene retroalimentación suficiente.`);
  perSet[question.set] = (perSet[question.set] || 0) + 1;
  skills[question.skill]++;
  letters[answer]++;
});
[1,2,3].forEach(number => assert(perSet[number] === 6, `El par ${number} debe tener 6 reactivos y tiene ${perSet[number] || 0}.`));
assert(JSON.stringify(skills) === JSON.stringify({LOCALIZAR:3,INTERPRETAR:12,EVALUAR:3}), `Cobertura de habilidades inesperada: ${JSON.stringify(skills)}.`);
assert(Math.max(...Object.values(letters)) - Math.min(...Object.values(letters)) <= 1, `Distribución de claves desequilibrada: ${JSON.stringify(letters)}.`);
assert(Object.keys(G20.key).length === 18 && Object.keys(G20.feedback).length === 18, 'La clave y la retroalimentación privadas deben contener 18 entradas.');

assert(/require\('\.\/_paes-g20'\)/.test(api), 'api/paes.js no carga el módulo privado de G20.');
assert(/'20': G20\.key/.test(api) && /'20': G20\.feedback/.test(api), 'api/paes.js no asocia clave y retroalimentación de G20.');
assert(/INTERACTIVE_GUIDE_KEYS\[guideId\]/.test(api), 'El panel docente no recibe la clave interactiva desde la API autenticada.');
assert(!/G20\.key|G20\.feedback|correctAnswer/.test(html + js + JSON.stringify(data)), 'La clave o la retroalimentación privada viaja al navegador.');

const adminMatch = admin.match(/'20':\s*\{[\s\S]*?total:\s*18,[\s\S]*?skill:\s*(\{[^}]*\})/);
assert(adminMatch, 'El administrador no define G20 como guía de 18 reactivos.');
if (adminMatch) {
  const sandbox = {};
  vm.runInNewContext(`skill = ${adminMatch[1]}`, sandbox);
  questions.forEach(question => assert(sandbox.skill[question.n] === question.skill, `La habilidad del reactivo ${question.n} difiere entre datos y admin.`));
}
assert(/id: 'g20',[^\n]*tipo: 'Interactiva'/.test(admin), 'El catálogo docente no marca G20 como interactiva.');

assert(/Relaciones entre textos/.test(html) && /18 preguntas/.test(html), 'La página no anuncia el propósito y los 18 reactivos.');
assert(/<meta name="robots" content="noindex">/.test(html), 'La página debe llevar noindex.');
assert(/window\.GUIA_LOCK_ID='g20'/.test(html) && /js\/guia-lock\.js/.test(html), 'La página no está integrada al bloqueo de G20.');
assert(/js\/nominas\.js/.test(html) && /js\/guia20\.js/.test(html) && /css\/guia20\.css/.test(html), 'La página no carga nómina, lógica o estilos propios.');
assert(/Puedes entregar con preguntas pendientes/.test(html), 'La interfaz no informa que admite preguntas pendientes.');
assert(/data\/guia20\.json/.test(js) && /GUIDE_ID\s*=\s*'20'/.test(js), 'La lógica no carga los datos públicos de G20.');
assert(/get-guia-state/.test(js) && /submit-guia/.test(js) && /readback\.attempt\.completada!==true\|\|readback\.attempt\.submitted!==true/.test(js), 'La entrega no relee las dos marcas canónicas.');
assert(/rut==='229327739'.*guia20-guiada\.html/.test(js), 'El acceso individual autorizado no se deriva a la ruta guiada de G20.');
assert(css.length > 1000 && /@media/.test(css) && /\.pair-grid/.test(css), 'Los estilos no incluyen contraste en pares y reglas responsivas.');

const p19 = portal.indexOf('id="cardGuia19"');
const p20 = portal.indexOf('id="cardGuia20"');
const p21 = portal.indexOf('id="cardGuia21"');
assert(p19 >= 0 && p19 < p20 && p20 < p21, 'El portal no ordena las guías 19, 20 y 21.');
const card20 = portal.match(/<article\b[^>]*id="cardGuia20"[^>]*>([\s\S]*?)<\/article>/);
assert(card20 && /Sesión anterior/.test(card20[1]) && /href="guia20\.html"/.test(card20[1]), 'G20 no aparece como sesión anterior con enlace regular.');
assert(card20 && /18 preguntas/.test(card20[1]) && /datetime="2026-09-03"/.test(card20[1]), 'La tarjeta de G20 no declara cantidad y fecha correctas.');
assert(!/<article\b[^>]*class="upcoming-card"[^>]*data-guided-guide="20"/.test(portal), 'G20 sigue duplicada como sesión futura.');
assert(/\[17, 18, 19, 20, 21\]/.test(portal), 'La derivación de rutas guiadas no cubre la secuencia 17–21.');

assert(contract.files.some(entry => entry.path === 'paes/guia20.html' && entry.storage === 'api'), 'G20 no está protegida por el contrato de entrega.');
assert(/data-guia-id="g20"/.test(materials) && /href="guia20\.html"/.test(materials), 'El catalogo de materiales no ofrece la Guia 20 regular.');
for (const requiredPath of ['paes/guia20.html','paes/css/guia20.css','paes/js/guia20.js','paes/data/guia20.json']) {
  assert(manifest.criticalFiles.some(entry => entry.path === requiredPath), `El manifiesto de release no protege ${requiredPath}.`);
}

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(script => script.trim());
inlineScripts.forEach((script, index) => { try { new Function(script); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); } });

if (failures.length) {
  console.error('PAES G20 con observaciones:\n- ' + failures.join('\n- '));
  process.exitCode = 1;
} else {
  console.log(`PAES G20 auditada: 3 pares (${pairWordCounts.join(', ')} palabras), 18 reactivos, claves ${JSON.stringify(letters)}, habilidades ${JSON.stringify(skills)} e integración completa entre portal, API, admin y release.`);
}
