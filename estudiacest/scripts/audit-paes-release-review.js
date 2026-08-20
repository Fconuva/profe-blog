const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const api = read('api/paes.js');
const lock = read('paes/js/guia-lock.js');
const portal = read('paes/index.html');
const materials = read('paes/guias.html');
const guide16 = read('paes/guia16.html');

for (const guide of [10, 11, 12, 13, 15, 16]) {
  assert(new RegExp(`const G${guide}_KEY =`).test(api), `Falta la clave de la Guía ${guide} en la API.`);
  assert(new RegExp(`'${guide}': G${guide}_KEY`).test(api), `La Guía ${guide} no está registrada para revisión.`);
}

assert(/legacyCompleted/.test(api), 'La API no reconoce entregas históricas anteriores al estado sent.');
assert(/const serverKey = INTERACTIVE_GUIDE_KEYS\[guideId\]/.test(api), 'La API no recalcula resultados con clave de servidor.');
assert(/fetchReleasedAttempt/.test(lock) && /enableReviewOnly/.test(lock), 'El candado no permite revisión de entregas publicadas.');
assert(/data-paes-review-only/.test(lock) && /lockResponseControls/.test(lock), 'El modo de revisión no bloquea la edición.');
assert(/hasPublishedGuideReview/.test(portal) && /Ver resultados y respuestas/.test(portal), 'El portal no ofrece acceso a resultados publicados.');
assert(/reviewAvailable/.test(materials) && /Ver resultados y respuestas/.test(materials), 'Materiales no ofrece acceso de revisión.');
assert(/Resultados publicados\. Revisa tus aciertos/.test(guide16), 'La Guía 16 conserva un mensaje de resultados ocultos después de liberarlos.');

for (const guide of [10, 11, 12, 13, 14]) {
  const html = read(`paes/guia${guide}.html`);
  assert(html.includes(`window.GUIA_LOCK_ID = 'g${guide}'`), `La Guía ${guide} no carga el candado común.`);
  assert(/<script src="js\/guia-lock\.js"><\/script>/.test(html), `La Guía ${guide} no carga guia-lock.js.`);
}

for (const file of ['paes/index.html', 'paes/guias.html']) {
  const html = read(file);
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type=["']application\/json["'])[^>]*>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((match, index) => {
    try {
      new Function(match[1]);
    } catch (error) {
      failures.push(`${file}: script embebido ${index + 1} inválido (${error.message}).`);
    }
  });
}

if (failures.length) {
  console.error('Auditoría de publicación PAES fallida:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Publicación PAES auditada: claves 10-16, acceso de revisión y bloqueo de edición verificados.');
