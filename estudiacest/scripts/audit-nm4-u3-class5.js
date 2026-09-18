const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pagePath = 'nm4/u3-clase5-entrevista-laboral/index.html';
const page = read(pagePath);
const portal = read('nm4/index.html');
const vtt = read('nm4/u3-clase5-entrevista-laboral/assets/video-entrevista.vtt');
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));
const assetRoot = path.join(root, 'nm4', 'u3-clase5-entrevista-laboral', 'assets');

const slides = [...page.matchAll(/<section class="slide" data-title="([^"]+)"/g)].map(match => match[1]);
expect(slides.length === 14, `Se esperaban 14 pantallas y se encontraron ${slides.length}.`);
expect(slides.includes('Estructura STAR'), 'Falta la pantalla sobre Estructura STAR.');
expect(page.includes('90 minutos') && page.includes('Simulación en parejas'), 'La clase no explicita duración y metodología.');
expect(page.includes('0–15 min') && page.includes('80–90 min'), 'La ruta no cubre los 90 minutos completos.');

[
  '4°A · Mecánica Industrial',
  '4°B · Mecánica Automotriz',
  '4°C · Electricidad',
  '4°E · Electrónica'
].forEach(label => expect(page.includes(label), `Falta la especialidad ${label}.`));

[
  'método STAR',
  'Tolerancia al límite y turno atrasado',
  'Falla intermitente y cliente desconfiado',
  'La presión de producción vs. Bloqueo LOTO',
  'Alarma falsa en lazo 4-20 mA y orden de forzado',
  'Háblame de ti y de tu formación en el CEST',
  '¿Por qué deberíamos contratarte si no tienes experiencia formal?',
  '¿Cuál es tu principal debilidad técnica?',
  '¿Qué harías si cometes un error en un montaje y nadie te vio?',
  'Ticket de salida individual'
].forEach(text => expect(page.includes(text), `Falta el componente académico: ${text}`));

expect((page.match(/class="options"/g) || []).length === 4, 'Cada especialidad debe presentar tres opciones de decisión.');
expect((page.match(/Abrir fuente oficial/g) || []).length === 8, 'Cada especialidad debe tener dos fuentes oficiales.');

const officialHosts = [
  'certificacion.chilevalora.cl',
  'www.sandvik.coromant.com',
  'www.boschaftermarket.com',
  'www.sec.cl',
  'www.siemens.com'
];
officialHosts.forEach(host => expect(page.includes(`https://${host}`), `Falta la fuente oficial ${host}.`));

expect(page.includes('video-entrevista.mp4') && page.includes('video-entrevista.vtt'), 'El video o sus subtítulos no están integrados.');
expect(vtt.startsWith('WEBVTT'), 'El archivo de subtítulos no es WebVTT.');
expect((vtt.match(/-->/g) || []).length >= 15, 'Los subtítulos no cubren suficientemente la narración.');

const localAssets = [...page.matchAll(/(?:src|poster)="assets\/([^"]+)"/g)].map(match => match[1].split('?')[0]);
for (const file of new Set(localAssets)) {
  const absolute = path.join(assetRoot, file);
  expect(fs.existsSync(absolute), `Recurso local inexistente: ${file}`);
  if (fs.existsSync(absolute)) expect(fs.statSync(absolute).size > 1500, `Recurso local demasiado pequeño: ${file}`);
}

const images = [
  'hero-entrevista-laboral.jpg',
  'metodo-star.jpg',
  'caso-mecanica-industrial.jpg',
  'caso-mecanica-automotriz.jpg',
  'caso-electricidad.jpg',
  'caso-electronica.jpg',
  'video-entrevista-poster.jpg'
];
for (const file of images) {
  const absolute = path.join(assetRoot, file);
  expect(fs.existsSync(absolute), `Imagen ausente: ${file}`);
  if (fs.existsSync(absolute)) {
    const bytes = fs.readFileSync(absolute);
    expect(bytes.length > 300000, `La imagen ${file} no conserva resolución suficiente.`);
    expect(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff, `${file} no coincide con su extensión JPEG.`);
  }
}

const video = path.join(assetRoot, 'video-entrevista.mp4');
expect(fs.existsSync(video) && fs.statSync(video).size > 5000000, 'El video inicial está ausente o incompleto.');
const videoHeader = fs.existsSync(video) ? fs.readFileSync(video).subarray(0, 64).toString('latin1') : '';
expect(videoHeader.includes('ftyp'), 'El archivo de video no tiene una cabecera MP4 válida.');

const jumps = [...page.matchAll(/data-go="(\d+)"[^>]*>Abrir caso (4°[ABCE])/g)].map(match => ({target:Number(match[1]), course:match[2]}));
expect(jumps.length === 4, 'Faltan accesos directos para alguna especialidad.');
for (const jump of jumps) {
  expect((slides[jump.target - 1] || '').startsWith(`Caso ${jump.course}`), `El acceso ${jump.course} apunta a una pantalla incorrecta.`);
}

const class5Start = portal.indexOf('<h3>La entrevista de trabajo</h3>');
expect(class5Start >= 0, 'La portada NM4 no contiene la Clase 5.');
const class5Card = class5Start >= 0 ? portal.slice(portal.lastIndexOf('<article', class5Start), portal.indexOf('</article>', class5Start) + 10) : '';
expect(class5Card.includes('u3-card activa'), 'La Clase 5 no está marcada como actual.');
expect(class5Card.includes('/nm4/u3-clase5-entrevista-laboral/'), 'La tarjeta actual no enlaza la nueva clase.');
expect(class5Card.includes('21 de septiembre'), 'La tarjeta no tiene la nueva fecha del 21 de septiembre.');

const requiredManifest = [
  pagePath,
  'nm4/u3-clase5-entrevista-laboral/assets/video-entrevista.mp4',
  'nm4/u3-clase5-entrevista-laboral/assets/video-entrevista.vtt',
  ...images.map(file => `nm4/u3-clase5-entrevista-laboral/assets/${file}`)
];
requiredManifest.forEach(file => expect(manifest.criticalFiles.some(entry => entry.path === file), `El manifiesto no protege ${file}.`));

if (failures.length > 0) {
  console.error(`FALLO EN AUDITORÍA DE CLASE 5 NM4 (${failures.length} errores):`);
  failures.forEach(f => console.error(` - ${f}`));
  process.exit(1);
} else {
  console.log('AUDITORÍA DE CLASE 5 NM4 EXITOSA: todos los contratos, recursos y vínculos verificados.');
}

