const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'estudiantes/js/u3s5-data.js');
const pagePath = path.join(root, 'estudiantes/guia-u3-s5-integrar-evidencia.html');
const source = fs.readFileSync(dataPath, 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);

const data = context.window.SIMCE_U3S5_DATA;
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const countBy = (items, field) => items.reduce((acc, item) => {
  acc[item[field]] = (acc[item[field]] || 0) + 1;
  return acc;
}, {});
const stripHtml = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

expect(data && Array.isArray(data.units), 'No se cargó la matriz de unidades.');
expect(data.questions.length === 32, `Se esperaban 32 alternativas y hay ${data.questions.length}.`);
expect(data.openQuestions.length === 2, `Se esperaban 2 desarrollos y hay ${data.openQuestions.length}.`);
expect(data.units.length === 5, `Se esperaban 5 unidades y hay ${data.units.length}.`);

const allNumbers = [...data.questions, ...data.openQuestions].map(item => item.num).sort((a, b) => a - b);
expect(allNumbers.join(',') === Array.from({ length: 34 }, (_, index) => index + 1).join(','), 'La numeración no cubre exactamente las preguntas 1 a 34.');
expect(data.openQuestions.map(item => item.num).join(',') === '10,24', 'Los desarrollos deben ocupar las preguntas 10 y 24.');

const keyDistribution = countBy(data.questions, 'key');
expect(JSON.stringify(keyDistribution) === JSON.stringify({ C: 8, A: 8, D: 8, B: 8 }), `Distribución de claves incorrecta: ${JSON.stringify(keyDistribution)}.`);
const skillDistribution = countBy(data.questions, 'skill');
expect(skillDistribution.LOCALIZAR === 7, `Localizar debe tener 7 reactivos y tiene ${skillDistribution.LOCALIZAR || 0}.`);
expect(skillDistribution.INTERPRETAR === 17, `Interpretar debe tener 17 reactivos y tiene ${skillDistribution.INTERPRETAR || 0}.`);
expect(skillDistribution.REFLEXIONAR === 8, `Reflexionar debe tener 8 reactivos y tiene ${skillDistribution.REFLEXIONAR || 0}.`);

for (const question of data.questions) {
  const labels = Object.keys(question.options || {});
  expect(labels.join('') === 'ABCD', `P${question.num}: las alternativas no son A-D.`);
  expect(labels.includes(question.key), `P${question.num}: la clave no existe entre las alternativas.`);
  expect(typeof question.evidence === 'string' && question.evidence.length >= 20, `P${question.num}: falta evidencia de validación.`);
  const distractorLabels = Object.keys(question.distractors || {});
  expect(distractorLabels.length === 3 && !distractorLabels.includes(question.key), `P${question.num}: deben documentarse tres distractores y excluir la clave.`);

  const values = Object.values(question.options || {});
  const normalized = values.map(value => value.toLowerCase().replace(/[^a-záéíóúüñ0-9]+/gi, ' ').trim());
  expect(new Set(normalized).size === 4, `P${question.num}: hay alternativas duplicadas.`);
  const lengths = values.map(value => value.length);
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  expect(max - min <= 30 && max / min <= 1.5, `P${question.num}: extensiones desequilibradas (${lengths.join('/')}).`);
  const correctLength = question.options[question.key].length;
  const longestDistractor = Math.max(...labels.filter(label => label !== question.key).map(label => question.options[label].length));
  expect(correctLength < longestDistractor, `P${question.num}: la alternativa correcta es la más larga.`);
}

for (const open of data.openQuestions) {
  expect(open.skill === 'REFLEXIONAR', `P${open.num}: el desarrollo debe evaluar Reflexionar.`);
  expect(Array.isArray(open.rubric) && open.rubric.length === open.max, `P${open.num}: rúbrica incompleta para ${open.max} puntos.`);
}

const wordMinimums = { t1: 500, t2: 80, t3: 400, t4: 500, t5: 120 };
for (const unit of data.units) {
  const words = stripHtml(unit.body).split(/\s+/).filter(Boolean).length;
  expect(words >= wordMinimums[unit.id], `${unit.id}: texto demasiado breve (${words} palabras, mínimo ${wordMinimums[unit.id]}).`);
}

const page = fs.readFileSync(pagePath, 'utf8');
expect(!/<video\b/i.test(page), 'La clase no debe incluir video.');
expect((page.match(/assets\/u3s5\/afiche-/g) || []).length >= 6, 'No están integrados los tres afiches en imagen y ampliación.');
expect(page.includes("SESSION='sesion-u3-5'"), 'La página no usa la sesión sesion-u3-5.');
expect(page.includes('resultados/${SESSION}/${uid}'), 'La entrega no registra resultados en Firebase.');
expect(page.includes('Las respuestas correctas, el puntaje y la retroalimentación siguen ocultos.'), 'Falta el mensaje de resultados ocultos.');
const submitWork = page.match(/async function submitWork\(\)\{([\s\S]*?)\n\s*\}\n\s*\n\s*function installProtection/)?.[1] || '';
expect(Boolean(submitWork), 'No se encontró la función de entrega.');
expect(!/missingConcept|missingQuestion|incompleteOpen|incompleteMeta/.test(submitWork), 'La entrega no debe depender de respuestas completas.');
expect(!/\.length\s*[<>]=?\s*\d+/.test(submitWork), 'La entrega no debe exigir una extensión mínima de respuesta.');
expect(submitWork.includes("child('completada').once('value')"), 'La entrega debe releer completada en Firebase antes de confirmar.');
expect(submitWork.includes('showConfirmation()'), 'La entrega debe mostrar la confirmación visible.');
expect(page.includes('Trabajo enviado'), 'La confirmación debe indicar explícitamente que el trabajo fue enviado.');

if (failures.length) {
  console.error('Auditoría SIMCE U3S5 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('SIMCE U3S5 auditado: 5 unidades, 32 alternativas, 2 desarrollos, claves 8/8/8/8 y flujo Firebase presente.');
