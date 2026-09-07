const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const sourceData = read('estudiantes/js/u3s8-data.js');
const sourceContext = { window:{} };
vm.createContext(sourceContext);
vm.runInContext(sourceData, sourceContext);
const source = sourceContext.window.SIMCE_U3S8_DATA;

const reviewData = read('estudiantes/js/u3s9-data.js');
const reviewContext = { window:{} };
vm.createContext(reviewContext);
vm.runInContext(reviewData, reviewContext);
const review = reviewContext.window.SIMCE_U3S9_DATA;

const page = read('estudiantes/guia-u3-s9-correccion-ensayo.html');
const api = read('api/estudiantes.js');
const dashboard = read('estudiantes/dashboard.html');
const admin = read('estudiantes/adminprofe/index.html');
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

expect(review && review.session === 'sesion-u3-8', 'La Clase 9 debe declarar que revisa la sesión sesion-u3-8.');
expect(Array.isArray(review && review.items), 'No se cargó la lista de ítems de corrección.');
expect(review.items.length === 36, `Se esperaban 36 ítems de corrección y hay ${review.items.length}.`);

const ids = review.items.map(item => item.id);
expect(ids.join(',') === Array.from({length:36},(_,index)=>`q${index+1}`).join(','), 'La numeración de la corrección debe cubrir q1 a q36 sin saltos.');
expect(ids.every(id => source.questions.some(question => question.id === id)), 'La corrección referencia una pregunta que no existe en la Clase 8.');

const keyBody = api.match(/const U3S8_ANSWER_KEY\s*=\s*\{([\s\S]*?)\n\};/)?.[1] || '';
const officialKeys = Object.fromEntries([...keyBody.matchAll(/(q\d+)\s*:\s*'([ABCD])'/g)].map(match => [match[1], match[2]]));
expect(Object.keys(officialKeys).length === 36, `La API contiene ${Object.keys(officialKeys).length} claves; se esperaban 36.`);
for (const item of review.items) {
  expect(item.correcta === officialKeys[item.id], `${item.id}: la corrección dice '${item.correcta}' pero la clave oficial del servidor dice '${officialKeys[item.id]}'.`);
  expect(typeof item.explicacion === 'string' && item.explicacion.length >= 60 && item.explicacion.length <= 400, `${item.id}: explicación fuera del rango funcional (${(item.explicacion || '').length} caracteres).`);
  expect(['A', 'B', 'C', 'D'].includes(item.correcta), `${item.id}: letra de respuesta inválida.`);
}

const SKILLS = ['LOCALIZAR', 'INTERPRETAR', 'REFLEXIONAR'];
expect(review.practica && typeof review.practica === 'object', 'Falta el banco de práctica dirigida por habilidad.');
for (const skill of SKILLS) {
  const bank = review.practica && review.practica[skill];
  expect(bank, `Falta el banco de práctica de la habilidad ${skill}.`);
  if (!bank) continue;
  expect(typeof bank.atencion === 'string' && bank.atencion.length >= 30, `${skill}: falta la caja "Atención" o es muy breve.`);
  expect(bank.texto && typeof bank.texto.body === 'string' && bank.texto.body.length >= 200, `${skill}: el texto de práctica es demasiado breve.`);
  expect(Array.isArray(bank.preguntas) && bank.preguntas.length >= 2, `${skill}: se esperaban al menos 2 preguntas de práctica.`);
  for (const question of bank.preguntas || []) {
    const labels = Object.keys(question.options || {});
    expect(labels.join('') === 'ABCD', `${question.id}: alternativas de práctica incompletas o desordenadas.`);
    expect(['A', 'B', 'C', 'D'].includes(question.correcta), `${question.id}: letra de respuesta de práctica inválida.`);
    expect(typeof question.explicacion === 'string' && question.explicacion.length >= 30, `${question.id}: explicación de práctica demasiado breve.`);
  }
}
const practiceIds = SKILLS.flatMap(skill => (review.practica[skill]?.preguntas || []).map(question => question.id));
expect(new Set(practiceIds).size === practiceIds.length, 'Hay ids repetidos entre las preguntas de práctica.');
expect(practiceIds.every(id => !ids.includes(id)), 'Una pregunta de práctica reutiliza el id de una pregunta del ensayo original.');

expect(page.includes('/estudiantes/js/u3s8-data.js') && page.includes('/estudiantes/js/u3s9-data.js'), 'La página no carga los dos archivos de datos que necesita.');
expect(page.includes("const API='/api/estudiantes'"), 'La página no usa la API unificada.');
expect(page.includes('simce-u3s9-classstats'), 'La página no consulta los resultados reales del curso.');
expect(page.includes('review.practica') && page.includes('computeWeakestSkill'), 'La corrección no incluye práctica dirigida a la habilidad más débil del curso: revisar no es lo mismo que ejercitar.');
expect(page.includes('practice-option') && page.includes("data-correct"), 'La práctica dirigida no es interactiva (falta la respuesta clicable con corrección).');
expect(page.includes('work-telemetry.js" data-session="sesion-u3-9"'), 'Falta telemetría con la sesión correcta de la Clase 9.');
expect(!/preview===\s*'1'.*submit|action=simce-u3s8-submit/i.test(page), 'La corrección no debe reenviar ni recalificar el ensayo original.');

const classstatsHandler = api.match(/async function handleU3S9Classstats[\s\S]*?function resolveAllowedOrigin/)?.[0] || '';
expect(classstatsHandler, 'No se encontró el handler simce-u3s9-classstats en la API.');
expect(classstatsHandler.includes('verifyU3S8Student'), 'El handler de resultados debe validar que el estudiante pertenece a un curso asignado.');
expect(!/nombre|uid:|rut/i.test(classstatsHandler), 'El handler de resultados no debe exponer identidad de estudiantes, solo agregados.');
expect(classstatsHandler.includes('attempt.curso !== curso'), 'El handler debe limitar los resultados al curso del propio estudiante.');
expect(api.includes("action === 'simce-u3s9-classstats'"), 'La ruta simce-u3s9-classstats no está conectada en el enrutador principal.');

expect(dashboard.includes("'sesion-u3-9'"), 'El dashboard no registra la Clase 9.');
expect(admin.includes("'sesion-u3-9'"), 'El admin no registra la Clase 9.');
expect(!dashboard.includes('<div class="session-num">9</div>'), 'La tarjeta gris de la Clase 9 sigue duplicada en el plan de la Unidad 3.');

expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/guia-u3-s9-correccion-ensayo.html'), 'La página de corrección no está protegida por el manifiesto.');
expect(manifest.criticalFiles.some(entry => entry.path === 'estudiantes/js/u3s9-data.js'), 'Los datos de corrección no están protegidos por el manifiesto.');

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(value => value.trim());
inlineScripts.forEach((script, index) => { try { new Function(script); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); } });
try { new Function(api); } catch (error) { failures.push(`API inválida: ${error.message}`); }

if (failures.length) {
  console.error('Auditoría SIMCE U3S9 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`SIMCE U3S9 auditado: 36 correcciones, claves alineadas con el servidor, resultados del curso limitados a agregados propios, y ${practiceIds.length} preguntas de práctica dirigida (${SKILLS.join('/')}).`);
