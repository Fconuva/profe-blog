const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');

const nuevos = {
  'religion-evangelica': 'evaluaciones/educacion-basica/prueba/religion-evangelica/',
  epja: 'evaluaciones/educacion-epja/prueba/',
  encierro: 'evaluaciones/educacion-encierro/prueba/',
  neep: 'evaluaciones/educacion-especial/prueba/neep/',
  hospitalaria: 'evaluaciones/educacion-especial/prueba/pedagogia-hospitalaria/',
  'media-religion': 'evaluaciones/educacion-media/prueba/religion/',
  'media-tecnologia': 'evaluaciones/educacion-media/prueba/tecnologia/',
  contabilidad: 'evaluaciones/educacion-media/prueba/contabilidad/',
  electricidad: 'evaluaciones/educacion-media/prueba/electricidad/'
};

function cargarBanco(slug) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read('js/practica/modalidad-builder.js'), context, { filename: 'modalidad-builder.js' });
  vm.runInContext(read(`js/practica/${slug}.js`), context, { filename: `${slug}.js` });
  return context.window.PRUEBA;
}

test('las nueve modalidades pendientes tienen una práctica 2026 completa y equilibrada', () => {
  for (const slug of Object.keys(nuevos)) {
    const banco = cargarBanco(slug);
    assert.ok(banco, `${slug}: no creó window.PRUEBA.`);
    assert.equal(banco.preguntas.length, 60, `${slug}: no tiene 60 preguntas.`);
    assert.deepEqual(Array.from(banco.preguntas, (q) => q.n), Array.from({ length: 60 }, (_, i) => i + 1));

    const textos = new Set();
    const claves = { A: 0, B: 0, C: 0, D: 0 };
    for (const pregunta of banco.preguntas) {
      assert.equal(pregunta.alternativas.length, 4, `${slug} #${pregunta.n}: alternativas incompletas.`);
      assert.equal(new Set(Array.from(pregunta.alternativas)).size, 4, `${slug} #${pregunta.n}: alternativas repetidas.`);
      assert.ok(Object.hasOwn(claves, pregunta.correcta), `${slug} #${pregunta.n}: clave inválida.`);
      claves[pregunta.correcta]++;
      const firma = `${pregunta.textoBase}\n${pregunta.enunciado}`;
      assert.ok(!textos.has(firma), `${slug}: pregunta duplicada.`);
      textos.add(firma);
    }
    assert.deepEqual(claves, { A: 15, B: 15, C: 15, D: 15 }, `${slug}: claves desbalanceadas.`);
  }
});

test('las nueve páginas cargan su banco, constructor, runner y enlace de versión', () => {
  for (const [slug, ruta2024] of Object.entries(nuevos)) {
    const page = read(`evaluaciones/practica/${slug}/index.njk`);
    assert.match(page, new RegExp(`/js/practica/modalidad-builder\\.js\\?v=1`));
    assert.match(page, new RegExp(`/js/practica/${slug}\\.js\\?v=1`));
    assert.match(page, /\/js\/ecep-practica\.js\?v=4/);
    assert.match(page, /60 preguntas/);
    assert.match(read('js/ecep-practica.js'), new RegExp(ruta2024.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('el catálogo ofrece 36 prácticas 2026 y distingue los ensayos propios', () => {
  const index = read('evaluaciones/practica/index.njk');
  const enlaces = [...index.matchAll(/href="\/evaluaciones\/practica\/([^"/]+)\/"/g)].map((m) => m[1]);
  assert.equal(new Set(enlaces).size, 36);
  for (const slug of Object.keys(nuevos)) assert.ok(enlaces.includes(slug), `Falta ${slug} en el catálogo.`);
  assert.match(index, /36 versiones de 60 preguntas/);
  assert.match(index, /Ensayo propio 2026/);
  assert.match(index, /2024 · Pruebas y ensayos base/);
});

test('cada runner enlaza ambas versiones sin presentar ensayos propios como pruebas oficiales', () => {
  const runner2024 = read('js/ecep-prueba.js');
  const runner2026 = read('js/ecep-practica.js');
  assert.match(runner2024, /2024<\/b><small>.*Ensayo base/);
  assert.match(runner2024, /2026<\/b><small>Práctica nueva/);
  assert.match(runner2026, /2024<\/b><small>/);
  assert.match(runner2026, /2026<\/b><small>Práctica nueva/);
  assert.match(runner2026, /\^Ensayo[\s\S]*currículo y los contenidos pedagógicos[\s\S]*No es una forma oficial independiente/);

  const evangelica = read('evaluaciones/educacion-basica/prueba/religion-evangelica/index.njk');
  assert.match(evangelica, /\/evaluaciones\/practica\/religion-evangelica\//);
  assert.match(evangelica, /2024[\s\S]*Prueba oficial[\s\S]*2026[\s\S]*Práctica nueva/);

  for (const slug of ['epja', 'encierro', 'neep', 'hospitalaria']) {
    assert.match(read(`evaluaciones/practica/${slug}/index.njk`), /no (?:es|corresponde a) una forma oficial/i);
  }
});
