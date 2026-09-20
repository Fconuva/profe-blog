const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pagePath = 'nm4/u3-clase5-entrevista-laboral/index.html';
const page = read(pagePath);
const portal = read('nm4/index.html');
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));
const assetRoot = path.join(root, 'nm4', 'u3-clase5-entrevista-laboral', 'assets');

const unitGridStart = portal.indexOf('<div class="u3-grid">');
const unitArchiveStart = portal.indexOf('<details class="archivo">', unitGridStart);
expect(unitGridStart >= 0 && unitArchiveStart > unitGridStart, 'No se pudo delimitar la grilla de la Unidad 3.');
const unitGrid = unitGridStart >= 0 && unitArchiveStart > unitGridStart
  ? portal.slice(unitGridStart, unitArchiveStart)
  : '';
const articleTags = [...unitGrid.matchAll(/<\/?article\b[^>]*>/g)].map(match => match[0]);
let articleDepth = 0;
let maxArticleDepth = 0;
let articleUnderflow = false;
for (const tag of articleTags) {
  if (tag.startsWith('</')) {
    articleDepth -= 1;
    if (articleDepth < 0) articleUnderflow = true;
  } else {
    articleDepth += 1;
    maxArticleDepth = Math.max(maxArticleDepth, articleDepth);
  }
}
const unitCards = [...unitGrid.matchAll(/<article class="([^"]*\bu3-card\b[^"]*)">/g)]
  .map(match => match[1].split(/\s+/));
expect(articleDepth === 0 && !articleUnderflow, 'La portada NM4 tiene etiquetas <article> desbalanceadas en la Unidad 3.');
expect(maxArticleDepth === 1, 'La portada NM4 tiene tarjetas de la Unidad 3 anidadas entre sí.');
expect(unitCards.length === 8, `Se esperaban 8 tarjetas en la Unidad 3 y se encontraron ${unitCards.length}.`);
expect(unitCards.filter(classes => classes.includes('activa')).length === 1, 'Debe existir una sola tarjeta marcada como clase actual.');
expect((portal.match(/Del 10 de agosto al 5 de octubre\./g) || []).length === 1, 'El rango vigente de la Unidad 3 debe aparecer una sola vez.');
expect(!portal.includes('Del 10 de agosto al 28 de septiembre.'), 'La portada conserva el rango antiguo de la Unidad 3.');
expect(!portal.includes('Lunes 7 de septiembre · 4°D martes 8'), 'La Clase 5 conserva su fecha antigua.');

const slides = [...page.matchAll(/<section class="slide" data-title="([^"]+)"/g)].map(match => match[1]);
expect(slides.length === 13, `Se esperaban 13 pantallas y se encontraron ${slides.length}.`);
[
  'Motivación · Escala 1 a 10',
  'Activación de conocimientos previos',
  'Objetivo de la clase',
  'Instrucciones de la actividad',
  'Ejemplo modelado',
  'Trabajo y monitoreo',
  'Cierre · Plenario y timbre'
].forEach(title => expect(slides.includes(title), `Falta la pantalla «${title}».`));

expect(page.includes('90 minutos') && page.includes('Trabajo en cuaderno'), 'La portada no explicita duración y modalidad.');
expect(page.includes('Practicar respuestas claras, concretas y seguras para una entrevista laboral.'), 'El objetivo breve de un solo verbo no está presente.');
expect(!page.includes('Estructurar y defender oralmente'), 'La página conserva el objetivo antiguo de dos verbos.');
expect(page.includes('Escribe el objetivo en tu cuaderno.'), 'No se indica copiar el objetivo en el cuaderno.');

const scaleStart = page.indexOf('<figcaption class="scale"');
const scaleEnd = page.indexOf('</figcaption>', scaleStart);
const scaleMarkup = scaleStart >= 0 && scaleEnd > scaleStart ? page.slice(scaleStart, scaleEnd) : '';
const scaleNumbers = [...scaleMarkup.matchAll(/<span>(\d+)<\/span>/g)].map(match => Number(match[1]));
expect(scaleNumbers.join(',') === '1,2,3,4,5,6,7,8,9,10', 'La motivación no presenta una escala completa de 1 a 10.');
expect(page.includes('assets/escala-preparacion-trabajo.jpg'), 'Falta la imagen-meme de preparación para el trabajo.');

[
  '¿Has vivido una entrevista real, informal o de práctica?',
  '¿Qué hemos visto y qué sabes sobre una entrevista laboral?',
  '¿Qué preguntas crees que puede hacer legalmente una empresa?',
  'Embarazo o planes de tener hijos.',
  'Antecedentes penales, salvo que sean indispensables para esa función.'
].forEach(text => expect(page.includes(text), `Falta la activación: ${text}`));

[
  'https://www.dt.gob.cl/legislacion/1624/w3-article-123284.html',
  'https://www.dt.gob.cl/portal/1628/w3-article-60121.html',
  'https://www.dt.gob.cl/portal/1628/w3-article-60778.html'
].forEach(url => expect(page.includes(url), `Falta la fuente oficial ${url}.`));

[
  'Selecciona',
  'Planifica',
  'Escribe',
  'Ensaya',
  'Respuesta final de 8 a 10 líneas.',
  'El docente monitorea y orienta mientras trabajas.'
].forEach(text => expect(page.includes(text), `Falta la instrucción de desarrollo: ${text}`));

[
  '<b>S</b><strong>Situación:</strong>',
  '<b>T</b><strong>Tarea:</strong>',
  '<b>A</b><strong>Acción:</strong>',
  '<b>R</b><strong>Resultado:</strong>'
].forEach(fragment => expect(page.includes(fragment), `El ejemplo no modela ${fragment}.`));

[
  '4°A · Mecánica Industrial',
  '4°B · Mecánica Automotriz',
  '4°C · Electricidad',
  '4°E · Electrónica'
].forEach(label => expect(page.includes(label), `Falta la especialidad ${label}.`));

const jumps = [...page.matchAll(/data-go="(\d+)"[^>]*>Abrir caso (4°[ABCE])/g)]
  .map(match => ({target:Number(match[1]), course:match[2]}));
expect(jumps.length === 4, 'Faltan accesos directos para alguna especialidad.');
for (const jump of jumps) {
  expect((slides[jump.target - 1] || '').startsWith(`Caso ${jump.course}`), `El acceso ${jump.course} apunta a una pantalla incorrecta.`);
}
expect((page.match(/data-go="12"[^>]*>Ir al trabajo en cuaderno/g) || []).length === 4, 'Cada caso debe conducir al trabajo en cuaderno.');

[
  '35 min',
  'escritura y monitoreo',
  '10 min',
  'lectura en parejas y mejora',
  'Dos estudiantes leen su respuesta.',
  'REVISIÓN Y TIMBRE',
  '¿Qué elementos hacen que una respuesta de entrevista demuestre preparación y confianza profesional?'
].forEach(text => expect(page.includes(text), `Falta el componente de trabajo o cierre: ${text}`));

expect(!page.includes('metodo-star.jpg'), 'La presentación todavía referencia la infografía STAR rechazada.');
expect(!page.includes('video-entrevista.mp4'), 'La secuencia todavía incluye el video anterior.');
expect(!page.includes('Ticket de salida individual'), 'La secuencia conserva el ticket de salida anterior.');

const localAssets = [...page.matchAll(/(?:src|poster)="assets\/([^"]+)"/g)].map(match => match[1].split('?')[0]);
for (const file of new Set(localAssets)) {
  const absolute = path.join(assetRoot, file);
  expect(fs.existsSync(absolute), `Recurso local inexistente: ${file}`);
  if (fs.existsSync(absolute)) expect(fs.statSync(absolute).size > 1500, `Recurso local demasiado pequeño: ${file}`);
}

const images = [
  'hero-entrevista-laboral.jpg',
  'escala-preparacion-trabajo.jpg',
  'caso-mecanica-industrial.jpg',
  'caso-mecanica-automotriz.jpg',
  'caso-electricidad.jpg',
  'caso-electronica.jpg'
];
const approvedMemeSha256 = 'ae8ef4ef3393410cf7fd9fb3b4534ba031e5c4c74ac7dd41a3bee24499093ad5';
for (const file of images) {
  const absolute = path.join(assetRoot, file);
  expect(fs.existsSync(absolute), `Imagen ausente: ${file}`);
  if (fs.existsSync(absolute)) {
    const bytes = fs.readFileSync(absolute);
    expect(bytes.length > 300000, `La imagen ${file} no conserva resolución suficiente.`);
    expect(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff, `${file} no coincide con su extensión JPEG.`);
    if (file === 'escala-preparacion-trabajo.jpg') {
      const hash = crypto.createHash('sha256').update(bytes).digest('hex');
      expect(hash === approvedMemeSha256, 'La imagen-meme no coincide con la versión aprobada.');
    }
  }
}

const class5Start = portal.indexOf('<h3>La entrevista de trabajo</h3>');
expect(class5Start >= 0, 'La portada NM4 no contiene la Clase 5.');
const class5Card = class5Start >= 0 ? portal.slice(portal.lastIndexOf('<article', class5Start), portal.indexOf('</article>', class5Start) + 10) : '';
expect(class5Card.includes('u3-card activa'), 'La Clase 5 no está marcada como actual.');
expect(class5Card.includes('/nm4/u3-clase5-entrevista-laboral/'), 'La tarjeta actual no enlaza la clase.');
expect(class5Card.includes('21 de septiembre'), 'La tarjeta no tiene la fecha del 21 de septiembre.');

const requiredManifest = [pagePath, ...images.map(file => `nm4/u3-clase5-entrevista-laboral/assets/${file}`)];
requiredManifest.forEach(file => expect(manifest.criticalFiles.some(entry => entry.path === file), `El manifiesto no protege ${file}.`));

if (failures.length > 0) {
  console.error(`FALLO EN AUDITORÍA DE CLASE 5 NM4 (${failures.length} errores):`);
  failures.forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}

console.log('AUDITORÍA DE CLASE 5 NM4 EXITOSA: secuencia Inicio–Desarrollo–Cierre, cuaderno, recursos y portada verificados.');
