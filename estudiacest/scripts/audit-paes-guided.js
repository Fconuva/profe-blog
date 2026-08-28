'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { GUIDED_GUIDE_KEYS, GUIDED_GUIDE_FEEDBACK } = require('../api/_paes-guided-catalog');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const fail = (message) => {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
};
const expect = (condition, message) => { if (!condition) fail(message); };
const validateQuestion = (file, question) => {
  const options = Object.values(question.options || {});
  const lengths = options.map((option) => option.length);
  expect(question.text.trim().endsWith('?'), `${file}, pregunta ${question.n}: el enunciado debe ser interrogativo.`);
  expect(Object.keys(question.options || {}).join('') === 'ABCD', `${file}, pregunta ${question.n}: faltan alternativas A-D.`);
  expect(new Set(options.map((option) => option.trim().toLowerCase())).size === 4, `${file}, pregunta ${question.n}: hay alternativas repetidas.`);
  expect(options.every((option) => option.length >= 45 && option.length <= 105), `${file}, pregunta ${question.n}: una alternativa tiene extensión atípica.`);
  expect(Math.max(...lengths) - Math.min(...lengths) <= 42, `${file}, pregunta ${question.n}: las alternativas no son suficientemente paralelas.`);
  expect(!options.some((option) => /todas las anteriores|ninguna de las anteriores/i.test(option)), `${file}, pregunta ${question.n}: contiene un distractor global prohibido.`);
  expect(/párrafo|párrafos|idea|ideas|texto|tabla|dato|datos|fila|columna|ficha|oración|fragmento/i.test(question.cue), `${file}, pregunta ${question.n}: falta una pista de relectura concreta.`);
};

['17', '18', '19'].forEach((guideId) => {
  const file = `paes/guia${guideId}-guiada.html`;
  const html = read(file);
  const questionCount = (html.match(/\{ n: \d+, text:/g) || []).length;
  const optionSets = (html.match(/options: \{ A:/g) || []).length;
  expect(questionCount === 6, `${file} debe contener exactamente 6 preguntas; contiene ${questionCount}.`);
  expect(optionSets === 6, `${file} debe contener cuatro alternativas en cada pregunta.`);
  expect(html.includes(`guideId: '${guideId}'`), `${file} no declara el identificador de guía correcto.`);
  expect(html.includes('id="deliveryConfirmation"'), `${file} no muestra confirmación de entrega.`);
  expect(html.includes('id="savedState"'), `${file} no informa el autoguardado.`);
  expect(!/\bTEA\b|autis|grado\s*[23]/i.test(html), `${file} expone una etiqueta diagnóstica en la vista del estudiante.`);
  expect(!/GUIDED_KEY|answerKey\s*[:=]\s*\{/i.test(html), `${file} parece incluir una clave de respuestas en el cliente.`);
  const configMatch = html.match(/window\.GUIDED_GUIDE_CONFIG = (\{[\s\S]*?\n    \});/);
  expect(configMatch, `${file} no contiene una configuración de reactivos legible.`);
  if (configMatch) {
    const sandbox = {};
    vm.runInNewContext(`instrument = ${configMatch[1]}`, sandbox);
    sandbox.instrument.questions.forEach((question) => validateQuestion(file, question));
  }
});

const catalog = JSON.parse(read('paes/data/guias-guiadas-20-31.json'));
const futureIds = Array.from({ length: 12 }, (_, index) => String(index + 20));
expect(catalog.version === 'guided-access-2026-20-31-v1', 'El catálogo futuro no tiene la versión esperada.');
expect(Object.keys(catalog.guides || {}).join(',') === futureIds.join(','), 'El catálogo guiado debe cubrir sin vacíos las guías 20 a 31.');

futureIds.forEach((guideId) => {
  const guide = catalog.guides[guideId];
  const file = `paes/guia${guideId}-guiada.html`;
  const image = `paes/${guide.visual.src}`;
  const html = read(file);
  expect(guide.questions.length === 6, `${file} debe contener exactamente 6 preguntas.`);
  expect(guide.steps.length === 3, `${file} debe mostrar tres pasos de lectura.`);
  expect(guide.glossary.length >= 3, `${file} necesita un glosario breve.`);
  expect(guide.texts.length >= 1 && guide.texts.length <= 2, `${file} debe conservar una carga lectora acotada.`);
  guide.questions.forEach((question) => validateQuestion(file, question));
  expect(exists(image), `${file} no encuentra su apoyo visual ${image}.`);
  if (exists(image)) expect(fs.statSync(path.join(root, image)).size >= 20000, `${image} tiene un peso demasiado bajo para el recurso visual esperado.`);
  expect(html.includes(`window.GUIDED_GUIDE_ID = '${guideId}'`), `${file} no declara su identificador.`);
  expect(html.includes('id="deliveryConfirmation"'), `${file} no muestra confirmación de entrega.`);
  expect(html.includes('id="savedState"'), `${file} no informa el autoguardado.`);
  expect(html.includes('guia-guiada-programada.js'), `${file} no carga el renderizador programado.`);
  expect(!/\bTEA\b|autis|grado\s*[23]/i.test(html), `${file} expone una etiqueta diagnóstica.`);
  expect(!/GUIDED_GUIDE_KEYS|answerKey\s*[:=]\s*\{/i.test(html), `${file} expone una clave en el cliente.`);

  const key = GUIDED_GUIDE_KEYS[guideId];
  const feedback = GUIDED_GUIDE_FEEDBACK[guideId];
  expect(key && Object.keys(key).length === 6, `${file} no tiene seis respuestas validadas en servidor.`);
  expect(feedback && Object.keys(feedback).length === 6, `${file} no tiene seis retroalimentaciones en servidor.`);
  Object.values(key || {}).forEach((letter) => expect(/^[A-D]$/.test(letter), `${file} contiene una clave inválida.`));
});

const allKeyLetters = futureIds.flatMap((id) => Object.values(GUIDED_GUIDE_KEYS[id] || {}));
const distribution = allKeyLetters.reduce((acc, letter) => ({ ...acc, [letter]: (acc[letter] || 0) + 1 }), {});
expect(['A', 'B', 'C', 'D'].every((letter) => distribution[letter] >= 14 && distribution[letter] <= 22), 'La distribución global de claves futuras está desequilibrada.');

const shared = read('paes/js/guia-guiada.js');
const api = read('api/paes.js');
const authorizedClient = shared.match(/const AUTHORIZED_RUT = '([^']+)'/);
const authorizedApi = api.match(/const GUIDED_ACCESS_RUT = '([^']+)'/);
expect(authorizedClient && authorizedApi && authorizedClient[1] === authorizedApi[1], 'Cliente y API no comparten el mismo acceso individual autorizado.');
expect(shared.includes('attempt.variant !== VARIANT'), 'El cliente podría mezclar borradores del instrumento regular y guiado.');
expect(shared.includes('respectGuideLock'), 'Las guías futuras no respetan el bloqueo docente.');
expect(shared.includes('speechSynthesis'), 'La ruta guiada no ofrece lectura en voz alta.');
expect(shared.includes('data.completada !== true'), 'La entrega no exige confirmación explícita del servidor.');
expect(shared.includes('readback.attempt.completada !== true'), 'La entrega no verifica la lectura posterior desde Firebase.');
expect(api.includes("require('./_paes-guided-catalog')"), 'La API no carga las claves guiadas desde el módulo servidor.');
expect(api.includes('guideKeyFor(guideId, rutLimpio)'), 'El envío no selecciona la clave según el acceso individual.');
expect(api.includes('variant: value.variant || null'), 'El estado de la guía no informa la variante al cliente.');

const portal = read('paes/index.html');
futureIds.forEach((guideId) => expect(portal.includes(`data-guided-guide="${guideId}"`), `El portal no anuncia la ruta guiada ${guideId}.`));
expect(portal.includes('guia${guideNumber}-guiada.html'), 'El portal no dirige a las páginas guiadas.');

const admin = read('paes/admin/index.html');
expect(admin.includes("record.variant === 'guided-access-2026'"), 'El admin no diferencia el instrumento guiado.');
futureIds.forEach((guideId) => expect(admin.includes(`'${guideId}': { titulo:`), `El admin no registra la ruta guiada ${guideId}.`));

['17', '18', '19'].forEach((guideId) => {
  const regular = read(`paes/guia${guideId}.html`);
  expect(regular.includes('guiada.html'), `La Guía ${guideId} regular no redirige una sesión restaurada a la ruta guiada.`);
});

if (!process.exitCode) console.log('OK: rutas guiadas PAES 17 a 31 auditadas.');
