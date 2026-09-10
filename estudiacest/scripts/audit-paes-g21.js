const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const data = JSON.parse(read('paes/data/guia21.json'));
const G21 = require(path.join(root, 'api/_paes-g21.js'));
const html = read('paes/guia21.html');
const js = read('paes/js/guia21.js');
const css = read('paes/css/guia21.css');
const api = read('api/paes.js');
const catalog = read('api/_paes-guided-catalog.js');
const admin = read('paes/admin/index.html');
const portal = read('paes/index.html');
const materials = read('paes/guias.html');
const contract = JSON.parse(read('scripts/class-submission-contract.json'));
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));

// Lecturas
assert(Array.isArray(data.texts) && data.texts.length === 3, `Se esperaban 3 lecturas y hay ${(data.texts || []).length}.`);
const wordCounts = [];
(data.texts || []).forEach((text, index) => {
  const n = index + 1;
  const words = (text.paragraphs || []).join(' ').split(/\s+/).filter(Boolean).length;
  wordCounts.push(words);
  assert(text.title && text.genre, `La lectura ${n} no declara título o género.`);
  assert((text.paragraphs || []).length >= 5, `La lectura ${n} tiene menos de 5 párrafos.`);
  assert(words >= 450 && words <= 800, `La lectura ${n} tiene ${words} palabras; se esperaban entre 450 y 800.`);
  const imagePath = text.image ? path.join('paes', text.image) : '';
  assert(imagePath && exists(imagePath), `Falta la ilustración de la lectura ${n}: ${text.image}.`);
  assert(text.alt && text.alt.length > 20, `La lectura ${n} no tiene texto alternativo útil.`);
  if (imagePath && exists(imagePath)) {
    const bytes = fs.statSync(path.join(root, imagePath)).size;
    assert(bytes < 1200000, `La ilustración ${text.image} pesa ${bytes} bytes; debe quedar bajo 1,2 MB.`);
  }
});
assert(data.texts && data.texts[1] && data.texts[1].table && data.texts[1].table.rows.length >= 3, 'La lectura 2 debe traer la tabla del estudio.');

// Reactivos
const questions = data.questions || [];
assert(questions.length === 24, `Se esperaban 24 reactivos y hay ${questions.length}.`);
const perText = {};
const skills = {};
questions.forEach((q, index) => {
  assert(q.n === index + 1, `El reactivo en la posición ${index + 1} está numerado ${q.n}.`);
  assert([1, 2, 3].includes(q.texto), `El reactivo ${q.n} no apunta a una lectura válida.`);
  assert(['LOCALIZAR', 'INTERPRETAR', 'EVALUAR'].includes(q.skill), `El reactivo ${q.n} no declara habilidad válida.`);
  assert(typeof q.text === 'string' && q.text.trim().length > 15, `El reactivo ${q.n} no tiene enunciado.`);
  assert(q.opts && Object.keys(q.opts).sort().join('') === 'ABCD', `El reactivo ${q.n} no tiene exactamente las alternativas A-D.`);
  Object.entries(q.opts || {}).forEach(([letter, value]) => assert(typeof value === 'string' && value.trim().length > 3, `La alternativa ${letter} del reactivo ${q.n} está vacía.`));
  ['key', 'clave', 'correcta', 'answer', 'feedback', 'retro'].forEach((field) => assert(!(field in q), `El JSON público expone "${field}" en el reactivo ${q.n}.`));
  perText[q.texto] = (perText[q.texto] || 0) + 1;
  skills[q.skill] = (skills[q.skill] || 0) + 1;
});
[1, 2, 3].forEach((n) => assert(perText[n] === 8, `La lectura ${n} debe tener 8 reactivos y tiene ${perText[n] || 0}.`));
assert((skills.LOCALIZAR || 0) >= 3 && (skills.EVALUAR || 0) >= 4, 'El simulacro debe incluir al menos 3 reactivos de Localizar y 4 de Evaluar.');

// Clave y retroalimentación en servidor
const keyLetters = {};
questions.forEach((q) => {
  const letter = G21.key[q.n];
  assert(['A', 'B', 'C', 'D'].includes(letter), `El reactivo ${q.n} no tiene clave A-D en la API.`);
  assert(typeof G21.feedback[q.n] === 'string' && G21.feedback[q.n].length > 40, `El reactivo ${q.n} no tiene retroalimentación en la API.`);
  keyLetters[letter] = (keyLetters[letter] || 0) + 1;
  const correct = (q.opts || {})[letter] || '';
  const others = Object.entries(q.opts || {}).filter(([l]) => l !== letter).map(([, v]) => v.length);
  const longest = Math.max(...others, 1);
  assert(correct.length <= longest * 1.35, `La clave del reactivo ${q.n} se delata por longitud.`);
  assert(!/\b(siempre|nunca|todos|todas|ninguno|ninguna)\b/i.test(correct), `La clave del reactivo ${q.n} usa un absoluto.`);
});
assert(Object.keys(G21.key).length === 24, `La clave tiene ${Object.keys(G21.key).length} entradas; deben ser 24.`);
const counts = Object.values(keyLetters);
assert(counts.length === 4 && Math.max(...counts) - Math.min(...counts) <= 2, `Distribución de claves desequilibrada: ${JSON.stringify(keyLetters)}.`);
assert(/require\('\.\/_paes-g21'\)/.test(api) && /'21':\s*G21\.key/.test(api) && /'21':\s*G21\.feedback/.test(api), 'api/paes.js no carga la clave y la retroalimentación de G21.');
assert(/'21':\s*\{\s*1:'[A-D]'/.test(catalog), 'El catálogo guiado debe incluir la 21; de él depende la entrega con preguntas pendientes.');
assert(/INTERACTIVE_GUIDE_KEYS\[guideId\]/.test(api), 'admin-get-results no adjunta la clave interactiva para el panel.');

// Mapa de habilidades del admin
const adminMatch = admin.match(/'21':\s*\{\s*titulo:[^\n]*\n\s*total:\s*24,\s*\n\s*key:\s*\{\},\s*\n\s*skill:\s*(\{[^}]*\})/);
assert(adminMatch, 'El admin no define G21 como interactiva de 24 reactivos con mapa de habilidades.');
if (adminMatch) {
  const sandbox = {};
  vm.runInNewContext(`skill = ${adminMatch[1]}`, sandbox);
  questions.forEach((q) => assert(sandbox.skill[q.n] === q.skill, `La habilidad del reactivo ${q.n} difiere entre JSON (${q.skill}) y admin (${sandbox.skill[q.n]}).`));
}
assert(/id: 'g21',[^\n]*tipo: 'Interactiva'/.test(admin), 'El catálogo del admin no marca g21 como Interactiva.');

// Página, lógica y estilos
assert(/Simulacro parcial 1/.test(html) && /24 preguntas/.test(html), 'La página no anuncia el simulacro de 24 preguntas.');
assert(/<meta name="robots" content="noindex">/.test(html), 'La página debe llevar noindex.');
assert(/window\.GUIA_LOCK_ID='g21'/.test(html) && /js\/guia-lock\.js/.test(html), 'La página no está integrada al bloqueo de guías con id g21.');
assert(/js\/nominas\.js/.test(html) && /js\/guia21\.js/.test(html) && /css\/guia21\.css/.test(html), 'La página no carga nómina, lógica o estilos propios.');
assert(/Puedes entregar con preguntas pendientes/.test(html), 'La página debe declarar que se puede entregar con pendientes, igual que el servidor.');
assert(/data\/guia21\.json/.test(js) && /GUIDE_ID\s*=\s*'21'/.test(js), 'La lógica no carga el JSON público de G21.');
assert(/get-guia-state/.test(js) && /submit-guia/.test(js) && /completada\s*!==\s*true\s*\|\|\s*readback\.attempt\.submitted\s*!==\s*true/.test(js), 'La entrega no relee ambas marcas antes de confirmar.');
assert(/if\(isSubmitted\)return;try\{await request\('submit-guia',snapshot\)/.test(js), 'Un borrador encolado debe descartarse si la guía ya fue entregada.');
assert(/\[data-dev\]'\)\.forEach\(el=>\{el\.disabled=isSubmitted\|\|submitting;\}\)/.test(js), 'Las reflexiones deben bloquearse durante la entrega.');
assert(/error\.status===409/.test(js), 'La lógica no reconcilia un 409 releyendo el intento canónico.');
assert(!/[A-D]'\s*,\s*2:\s*'[A-D]'/.test(js) && !/feedback\s*=\s*\{\s*1:/.test(js), 'La lógica pública no puede contener la clave.');
assert(css.length > 1000 && /@media/.test(css), 'Los estilos no incluyen reglas responsivas.');

// Portal
assert((portal.match(/<span class="ensayo-tag">Sesión actual<\/span>/g) || []).length === 1, 'Debe existir una sola tarjeta marcada como Sesión actual.');
const card21 = portal.match(/<article\b[^>]*id="cardGuia21"[^>]*>([\s\S]*?)<\/article>/);
assert(card21 && /Sesión actual/.test(card21[1]) && /href="guia21\.html"/.test(card21[1]), 'G21 no es la sesión actual del portal.');
assert(card21 && /24 preguntas/.test(card21[1]) && /datetime="2026-09-10"/.test(card21[1]), 'La tarjeta de G21 no anuncia 24 preguntas y la fecha 10 de septiembre.');
assert(!/<article\b[^>]*class="upcoming-card"[^>]*data-guided-guide="21"/.test(portal), 'G21 sigue duplicada como sesión futura.');
assert(/for \(let n = 10; n <= 21; n\+\+\)/.test(portal), 'El bloqueo de guías del portal no cubre g21.');
assert(/\[17, 18, 19, 20, 21\]/.test(portal) && exists('paes/guia21-guiada.html'), 'La ruta individual de G21 no está enlazada desde el portal.');

// Contrato y manifiesto
assert(contract.files.some((entry) => entry.path === 'paes/guia21.html' && entry.storage === 'api'), 'G21 no está protegida por el contrato de entrega.');
assert(/data-guia-id="g21"/.test(materials) && /href="guia21\.html"/.test(materials), 'El catalogo de materiales no ofrece la Guia 21.');
for (const requiredPath of ['paes/guia21.html', 'paes/css/guia21.css', 'paes/js/guia21.js', 'paes/data/guia21.json', 'paes/assets/guia21/archivo.png', 'paes/assets/guia21/transporte.png', 'paes/assets/guia21/reparar.png']) {
  assert(manifest.criticalFiles.some((entry) => entry.path === requiredPath), `El manifiesto de release no protege ${requiredPath}.`);
}

if (failures.length) {
  console.error('PAES G21 con observaciones:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`PAES G21 auditada: 3 textos (${wordCounts.join(', ')} palabras), 24 reactivos, claves ${JSON.stringify(keyLetters)}, habilidades ${JSON.stringify(skills)}, entrega con pendientes coherente con el servidor y portal en sesión actual.`);
require('./audit-paes-g20');
