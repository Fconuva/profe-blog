const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');

function cleanHtml(value) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function publicBank(html, className) {
  const blocks = [...html.matchAll(new RegExp(`<ol class="${className}[^"]*"[^>]*>([\\s\\S]*?)<\\/ol>`, 'g'))];
  return blocks.flatMap((block) =>
    [...block[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => cleanHtml(match[1]))
  );
}

function panelBank(html) {
  const match = html.match(/var BANCO =\s*(\[[\s\S]*?\]);\s*var PUNTOS/);
  assert(match, 'No se encontró BANCO en el panel docente.');
  return vm.runInNewContext(`(${match[1]})`);
}

function inlineScriptCompiles(html, label) {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  assert(scripts.length, `${label}: falta script.`);
  scripts.forEach((entry, index) => new vm.Script(entry[1], { filename: `${label}-${index}.js` }));
}

function auditPanel(config) {
  const publicHtml = read(config.publicPage);
  const panelHtml = read(config.panelPage);
  const expected = publicBank(publicHtml, config.publicClass);
  const panel = panelBank(panelHtml);
  assert.strictEqual(expected.length, 50, `${config.label}: el banco público no tiene 50 preguntas.`);
  assert.strictEqual(panel.length, 50, `${config.label}: el panel no tiene 50 preguntas.`);
  assert.deepStrictEqual(Array.from(panel), expected, `${config.label}: el panel no coincide con el banco público.`);
  assert.strictEqual(new Set(panel).size, 50, `${config.label}: hay preguntas duplicadas.`);
  assert(panelHtml.includes(config.api), `${config.label}: endpoint incorrecto.`);
  assert(panelHtml.includes('Sortear las 7 preguntas'), `${config.label}: falta el sorteo.`);
  assert(panelHtml.includes('una sola'), `${config.label}: falta el límite de cambio.`);
  assert(panelHtml.includes('Guardar nota'), `${config.label}: falta la acción de guardado.`);
  assert(!/\bRUN\b|\bRUT\b/.test(panelHtml), `${config.label}: el panel expone un identificador personal.`);
  assert(!panelHtml.includes('type="password"'), `${config.label}: aún muestra una contraseña.`);
  assert(!panelHtml.includes('id="docente"'), `${config.label}: aún muestra el selector docente público.`);
  for (const contract of ['docenteDesdeUrl', "get('docente') || 'francisco'", "accion: 'nomina'"]) {
    assert(panelHtml.includes(contract), `${config.label}: falta el acceso docente directo ${contract}.`);
  }
  for (const removedGate of ['window.location.hash', 'sessionStorage', 'sesion.acceso']) {
    assert(!panelHtml.includes(removedGate), `${config.label}: conserva el bloqueo oculto ${removedGate}.`);
  }
  inlineScriptCompiles(panelHtml, config.label);
}

auditPanel({
  label: 'NM3 El lugar sin límites',
  publicPage: 'nm3/interrogacion-un-lugar-sin-limites/index.html',
  panelPage: 'nm3/interrogacion-un-lugar-sin-limites/calificar/index.html',
  publicClass: 'questions',
  api: "var INSTRUMENTO = 'nm3'"
});

auditPanel({
  label: 'NM4 Mocha Dick',
  publicPage: 'nm4/interrogacion-mocha-dick/index.html',
  panelPage: 'nm4/interrogacion-mocha-dick/calificar/index.html',
  publicClass: 'preg',
  api: "var INSTRUMENTO = 'nm4'"
});

const nm3Roster = require(path.join(ROOT, 'api/_roster_nm3')).ROSTER_ROWS;
const nm3Counts = nm3Roster.reduce((counts, row) => {
  counts[row[2]] = (counts[row[2]] || 0) + 1;
  return counts;
}, {});
assert.deepStrictEqual(nm3Counts, { '3A': 45, '3B': 48, '3D': 38 }, 'Nómina NM3 inesperada.');

const nm4Roster = require(path.join(ROOT, 'api/_roster_nm4'));
assert.deepStrictEqual(
  Object.fromEntries(Object.entries(nm4Roster).map(([course, rows]) => [course, rows.length])),
  { '4ATP': 45, '4BTP': 44, '4CTP': 45, '4DTP': 29, '4ETP': 39 },
  'Nómina NM4 inesperada.'
);

for (const apiFile of ['api/interrogacion.js']) {
  const source = read(apiFile);
  new vm.Script(source, { filename: apiFile });
  for (const contract of [
    "cuerpo.docente || 'francisco'",
    'Panel docente no encontrado.',
    'instrumento.alumnos.get',
    'preguntasValidas',
    'puntajesValidos',
    "accion === 'auditar-firebase'",
    "req.method !== 'POST'"
  ]) assert(source.includes(contract), `${apiFile}: falta contrato ${contract}.`);
  assert(source.includes('interrogacion_lugar_sin_limites_2026'), `${apiFile}: falta el nodo NM3.`);
  assert(source.includes('interrogacion_mocha_dick_2026'), `${apiFile}: falta el nodo NM4.`);
  for (const docente of ['francisco', 'alicia', 'joselin', 'pia']) {
    const occurrences = [...source.matchAll(new RegExp(`\\b${docente}: \\{`, 'g'))].length;
    assert.strictEqual(occurrences, 2, `${apiFile}: ${docente} no está configurado en ambos instrumentos.`);
  }
  assert(!source.includes('cuerpo.clave'), `${apiFile}: la API aún recibe contraseña.`);
  assert(!source.includes('cuerpo.acceso'), `${apiFile}: la API aún recibe un código oculto de acceso.`);
  assert(!source.includes('ENLACES_DOCENTES_HASH'), `${apiFile}: quedaron hashes de enlaces personales.`);
  assert(!source.includes('CLAVE_COMPARTIDA_HASH'), `${apiFile}: quedó la contraseña compartida anterior.`);
  assert(!source.includes('AUDIT_DEPLOY_HASH'), `${apiFile}: quedó un acceso técnico temporal.`);
}

const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));
const critical = new Set(manifest.criticalFiles.map((resource) => resource.path));
for (const page of [
  'nm3/interrogacion-un-lugar-sin-limites/calificar/index.html',
  'nm4/interrogacion-mocha-dick/calificar/index.html'
]) assert(critical.has(page), `El manifiesto no protege ${page}.`);

console.log('Interrogaciones auditadas: NM3 y NM4, 100 preguntas, 249 estudiantes, acceso docente directo, validación y Firebase.');
