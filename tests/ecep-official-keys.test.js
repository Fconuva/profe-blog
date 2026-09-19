const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function loadPrueba(file) {
  const context = { window: {} };
  vm.runInNewContext(read(`js/pruebas/${file}.js`), context);
  return context.window.PRUEBA;
}

const officialKeys = {
  'musica-basica': 'BDDDCADDACACCCCABDABCBCBBBAADBAADADAABDBADABCBDBABABDACABBBC',
  'artes-basica': 'AAABBADCBBABCCBADAACABCCDDADBBCBCABCADBDBACBDABBCBCBAADCDCBC',
  ciencias: 'DADCCDDABACBBDDDBCCCACBDBDBCCCBABCACBCABBBABBADCBCACADAACCBD',
  historia: 'AAACAACBCCDACDCCDBADBBDBDACBACCADBCBBABCCCBBCCADDCBBACCABAAC',
  'ef-basica': 'DDBCBCCABDBCCDAACABDBBADADDDCAAADCCBDDCCACCBDDADBBBABBBCDBAD',
  tecnologia: 'ADBBADADDBABACBBADADCBBCABDDDDDACABBBBCDBDBBADBACCAADBBBACAC',
  generalista: 'BCCCDBCBCCCBCBDDCAAABBCACDCCBBCCADBDCCAADBBACACBCBCAABBAACCD',
  'ingles-b': 'CCDBBDCADBBCBDBCBCCABCCACABBBDCCBCCDBACCBABBBCDACADBAABCBACD',
  lenguaje: 'BDCCACCCDDABCBDDDBDABBAAADBDCDCDAACADCADBCCCDCCBDCBADBBBAABA',
  matematica: 'ACDABABBDDCCDCCADABBDDAAABBCDDDCBDDBCBBBCBCCACABBDACABCBACBB',
  religion: 'BBABBDCDCCBAABABCCBBADCACADADCBBBBBCACACCABAADBDCCCDBADBCCDA',
};

test('las 11 pruebas reales de Básica conservan las 60 claves oficiales 2024', () => {
  for (const [file, expected] of Object.entries(officialKeys)) {
    const prueba = loadPrueba(file);
    assert.equal(prueba.preguntas.length, 60, `${file}: cantidad de preguntas`);
    assert.equal(
      Array.from(prueba.preguntas, (question) => question.n).join(','),
      Array.from({ length: 60 }, (_, index) => index + 1).join(','),
      `${file}: numeración`,
    );
    assert.equal(
      prueba.preguntas.map((question) => question.correcta).join(''),
      expected,
      `${file}: pauta oficial`,
    );
  }
});

test('Matemática mantiene alineados los ítems que antes estaban intercambiados', () => {
  const preguntas = loadPrueba('matematica').preguntas;
  assert.match(preguntas[15].enunciado, /plano cartesiano/i);
  assert.equal(preguntas[15].correcta, 'A');
  assert.match(preguntas[16].enunciado, /descripción de figuras 2D/i);
  assert.equal(preguntas[16].correcta, 'D');
  assert.match(preguntas[40].enunciado, /paralelogramo/i);
  assert.equal(preguntas[40].correcta, 'C');
  assert.match(preguntas[41].enunciado, /pentágono irregular/i);
  assert.equal(preguntas[41].correcta, 'B');
  assert.equal(preguntas[41].alternativas[1], '79°');
});

test('Generalista 33 conserva la alternativa A publicada por CPEIP', () => {
  const pregunta = loadPrueba('generalista').preguntas[32];
  assert.match(pregunta.alternativas[0], /cancha.+pasos/i);
  assert.match(pregunta.alternativas[3], /pizarra.+centímetros/i);
  assert.equal(pregunta.correcta, 'A');
});

test('Religión Evangélica aparece en el catálogo, el acceso y los materiales oficiales', () => {
  const catalog = read('evaluaciones/index.njk');
  const pruebas = read('evaluaciones/pruebas/index.njk');
  const auth = read('js/ecep-auth.js');
  const dossier = read('evaluaciones/educacion-basica/estudio/religion-evangelica/index.njk');
  const examen = read('evaluaciones/educacion-basica/prueba/religion-evangelica/index.njk');

  assert.match(catalog, /estudio\/religion-evangelica\//);
  assert.match(pruebas, /prueba\/religion-evangelica\//);
  assert.match(auth, /'religion-evangelica': 'Educación Básica · Religión Evangélica'/);
  assert.match(auth, /seg === 'religion-evangelica'/);
  assert.match(dossier, /id="teologico"/);
  assert.match(dossier, /id="ensenanza"/);
  assert.match(dossier, /educacion_basica_religion_evangelica/);
  assert.match(examen, /1HuAdmMorE4ge21NhS__Z0RqRlWmUa68n/);
  assert.match(examen, /1DSlRO9EMgPBpgyNMnrJqJOuFl4LyPfWX/);
});
