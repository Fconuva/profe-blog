'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const fail = (message) => {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
};
const expect = (condition, message) => { if (!condition) fail(message); };

const pages = [
  ['paes/guia17-guiada.html', '17'],
  ['paes/guia18-guiada.html', '18'],
  ['paes/guia19-guiada.html', '19']
];

pages.forEach(([file, guideId]) => {
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
    sandbox.instrument.questions.forEach((question) => {
      const options = Object.values(question.options || {});
      expect(question.text.trim().endsWith('?'), `${file}, pregunta ${question.n}: el enunciado debe ser interrogativo.`);
      expect(Object.keys(question.options || {}).join('') === 'ABCD', `${file}, pregunta ${question.n}: faltan alternativas A-D.`);
      expect(new Set(options.map((option) => option.trim().toLowerCase())).size === 4, `${file}, pregunta ${question.n}: hay alternativas repetidas.`);
      expect(options.every((option) => option.length >= 45 && option.length <= 105), `${file}, pregunta ${question.n}: una alternativa tiene extensión atípica.`);
      expect(Math.max(...options.map((option) => option.length)) - Math.min(...options.map((option) => option.length)) <= 42, `${file}, pregunta ${question.n}: las alternativas no son suficientemente paralelas.`);
      expect(!options.some((option) => /todas las anteriores|ninguna de las anteriores/i.test(option)), `${file}, pregunta ${question.n}: contiene un distractor global prohibido.`);
      expect(/párrafo|párrafos|ideas/.test(question.cue), `${file}, pregunta ${question.n}: falta una pista de relectura concreta.`);
    });
  }
});

const shared = read('paes/js/guia-guiada.js');
expect(shared.includes("const AUTHORIZED_RUT = '229327739'"), 'La ruta guiada no está restringida al RUN autorizado.');
expect(shared.includes("attempt.variant !== VARIANT"), 'El cliente podría mezclar borradores del instrumento regular y guiado.');
expect(shared.includes("data.completada !== true"), 'La entrega no exige confirmación explícita del servidor.');
expect(shared.includes("readback.attempt.completada !== true"), 'La entrega no verifica la lectura posterior desde Firebase.');

const api = read('api/paes.js');
expect(api.includes("const GUIDED_ACCESS_RUT = '229327739'"), 'La API no reconoce al estudiante con ruta guiada.');
expect(api.includes("const G17_GUIDED_KEY = { 1:'B', 2:'D', 3:'A', 4:'C', 5:'B', 6:'D' }"), 'La clave guiada G17 no coincide con el instrumento.');
expect(api.includes("const G18_GUIDED_KEY = { 1:'C', 2:'A', 3:'D', 4:'B', 5:'C', 6:'A' }"), 'La clave guiada G18 no coincide con el instrumento.');
expect(api.includes("const G19_GUIDED_KEY = { 1:'B', 2:'D', 3:'A', 4:'C', 5:'B', 6:'D' }"), 'La clave guiada G19 no coincide con el instrumento.');
expect(api.includes('guideKeyFor(guideId, rutLimpio)'), 'El envío no selecciona la clave según el RUN.');
expect(api.includes('variant: value.variant || null'), 'El estado de la guía no informa la variante al cliente.');

const portal = read('paes/index.html');
expect(portal.includes("const GUIDED_PAES_RUT = '229327739'"), 'El portal no reconoce la ruta individual.');
expect(portal.includes('guia${guideNumber}-guiada.html'), 'El portal no dirige a las páginas guiadas.');
expect(portal.includes("n === 17 || n === 18 || n === 19"), 'El cierre general podría ocultar la ruta individual solicitada.');

const regular17 = read('paes/guia17.html');
const regular18 = read('paes/guia18.html');
const regular19 = read('paes/guia19.html');
expect(regular17.includes("cleanRut(record&&record.rut)==='229327739'"), 'La Guía 17 regular no redirige una sesión restaurada a la ruta guiada.');
expect(regular18.includes("cleanRut(saved&&saved.rut)==='229327739'"), 'La Guía 18 regular no redirige una sesión restaurada a la ruta guiada.');
expect(regular19.includes("cleanRut(saved&&saved.rut)==='229327739'"), 'La Guía 19 regular no redirige una sesión restaurada a la ruta guiada.');

const admin = read('paes/admin/index.html');
expect(admin.includes("record.variant === 'guided-access-2026'"), 'El admin no diferencia el instrumento guiado.');
expect(admin.includes('Guía 17 — Doble evidencia · Versión guiada'), 'El admin no identifica la versión guiada de G17.');
expect(admin.includes('Guía 18 — Arquitectura del ensayo · Versión guiada'), 'El admin no identifica la versión guiada de G18.');
expect(admin.includes('Guía 19 — Vocabulario en contexto · Versión guiada'), 'El admin no identifica la versión guiada de G19.');

if (!process.exitCode) console.log('OK: rutas guiadas PAES 17, 18 y 19 auditadas.');
