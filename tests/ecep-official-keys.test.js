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
  for (const chapter of ['teologia', 'escrituras', 'conversion', 'iglesia', 'etica', 'ensenanza']) {
    assert.match(dossier, new RegExp(`href="${chapter}/"`));
  }
  assert.match(dossier, /educacion_basica_religion_evangelica/);
  assert.match(examen, /1HuAdmMorE4ge21NhS__Z0RqRlWmUa68n/);
  assert.match(examen, /1DSlRO9EMgPBpgyNMnrJqJOuFl4LyPfWX/);
});

test('el dossier de Religión Evangélica tiene profundidad, práctica e imágenes propias', () => {
  const base = 'evaluaciones/educacion-basica/estudio/religion-evangelica';
  const chapters = ['teologia', 'escrituras', 'conversion', 'iglesia', 'etica', 'ensenanza'];
  const files = ['index', ...chapters].map((name) => read(`${base}/${name}.njk`));
  const plainText = files
    .join('\n')
    .replace(/^---[\s\S]*?---/gm, ' ')
    .replace(/<[^>]+>/g, ' ');
  const wordCount = (plainText.match(/[\p{L}\p{N}]+/gu) || []).length;

  assert.ok(wordCount >= 19000, `El dossier quedó en ${wordCount} palabras; se esperan al menos 19000.`);

  for (const [index, chapter] of chapters.entries()) {
    const html = files[index + 1];
    const chapterText = html.replace(/^---[\s\S]*?---/m, ' ').replace(/<[^>]+>/g, ' ');
    const chapterWords = (chapterText.match(/[\p{L}\p{N}]+/gu) || []).length;
    const practices = (html.match(/ec-check|ec-caso/g) || []).length;
    assert.ok(chapterWords >= 2500, `${chapter}: solo ${chapterWords} palabras.`);
    assert.ok(practices >= 5, `${chapter}: solo ${practices} prácticas.`);
  }

  const images = [
    'hero-estudio.webp',
    'creacion-dignidad.webp',
    'iglesia-primitiva.webp',
    'aula-aprendizaje.webp',
  ];
  for (const image of images) {
    const imagePath = path.join(root, 'imagenes/ecep/religion-evangelica', image);
    assert.ok(fs.existsSync(imagePath), `Falta la imagen ${image}.`);
    assert.ok(fs.statSync(imagePath).size > 80000, `${image} parece incompleta.`);
  }

  const officialCoverage = [
    /omnipotencia/i,
    /inspiración/i,
    /nuevo nacimiento/i,
    /Concilio de Jerusalén/i,
    /Reforma protestante/i,
    /individualismo/i,
    /conocimientos previos/i,
    /retroalimentación formativa/i,
  ];
  for (const concept of officialCoverage) assert.match(plainText, concept);

  const styles = read('css/ecep-dossier.css');
  assert.match(styles, /\.ec table\s*{[^}]*width:\s*100%/);
  assert.match(styles, /@media \(max-width:\s*640px\)[\s\S]*\.ec table\s*{[^}]*overflow-x:\s*auto/);
});
