const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pagePath = 'nm4/u3-clase4-industria40/index.html';
const page = read(pagePath);
const portal = read('nm4/index.html');
const vtt = read('nm4/u3-clase4-industria40/assets/video-industria40.vtt');
const manifest = JSON.parse(read('scripts/academic-release-manifest.json'));
const assetRoot = path.join(root, 'nm4', 'u3-clase4-industria40', 'assets');

const slides = [...page.matchAll(/<section class="slide" data-title="([^"]+)"/g)].map(match => match[1]);
expect(slides.length === 15, `Se esperaban 15 pantallas y se encontraron ${slides.length}.`);
expect(slides.includes('IA y futuro del trabajo'), 'Falta la pantalla sobre IA y futuro del trabajo.');
expect(page.includes('90 minutos') && page.includes('Equipos de 3 o 4'), 'La clase no explicita duración y agrupación.');
expect(page.includes('0–16 min') && page.includes('78–90 min'), 'La ruta no cubre los 90 minutos completos.');

[
  '4°A · Mecánica Industrial',
  '4°B · Mecánica Automotriz',
  '4°C · Electricidad',
  '4°E · Electrónica'
].forEach(label => expect(page.includes(label), `Falta la especialidad ${label}.`));

[
  'mantenimiento predictivo',
  'El escáner no es el diagnóstico completo',
  'Ahorrar energía sin crear otro riesgo',
  'Conectar mejora el control, pero aumenta la exposición',
  'Qué podría hacer una IA en este caso y qué decisión no debe delegarse',
  'Recomendación de 120 a 160 palabras'
].forEach(text => expect(page.includes(text), `Falta el componente académico: ${text}`));

expect((page.match(/class="options"/g) || []).length === 4, 'Cada especialidad debe presentar tres opciones de decisión.');
expect((page.match(/Abrir fuente oficial/g) || []).length === 8, 'Cada especialidad debe tener dos fuentes oficiales.');
expect(page.includes('dato, inferencia y riesgo'), 'El caso modelado no distingue dato, inferencia y riesgo.');
expect(page.includes('opción descartada') || page.includes('Opción descartada'), 'El producto no exige descartar una alternativa.');
expect(page.includes('Quien no actualice sus competencias'), 'La sección de IA no aborda el riesgo de quedar rezagado.');
expect(page.includes('Usar IA no significa obedecerla'), 'La sección de IA no exige verificación humana.');

const officialHosts = [
  'www.ilo.org', 'www.siemens.com', 'www.boschaftermarket.com',
  'www.se.com', 'www.cisa.gov', 'certificacion.chilevalora.cl'
];
officialHosts.forEach(host => expect(page.includes(`https://${host}/`), `Falta la fuente oficial ${host}.`));

expect(page.includes('video-industria40.mp4') && page.includes('video-industria40.vtt'), 'El video o sus subtítulos no están integrados.');
expect(vtt.startsWith('WEBVTT'), 'El archivo de subtítulos no es WebVTT.');
expect((vtt.match(/-->/g) || []).length >= 18, 'Los subtítulos no cubren suficientemente la narración.');
expect(vtt.includes('inteligencia artificial') && vtt.includes('dron'), 'El video no incorpora la sección sobre IA.');

const localAssets = [...page.matchAll(/(?:src|poster)="assets\/([^"]+)"/g)].map(match => match[1].split('?')[0]);
for (const file of new Set(localAssets)) {
  const absolute = path.join(assetRoot, file);
  expect(fs.existsSync(absolute), `Recurso local inexistente: ${file}`);
  if (fs.existsSync(absolute)) expect(fs.statSync(absolute).size > 1500, `Recurso local demasiado pequeño: ${file}`);
}

const images = [
  'industria40-mapa.jpg', 'ia-trabajo-tecnico.jpg', 'caso-mecanica-industrial.jpg',
  'caso-mecanica-automotriz.jpg', 'caso-electricidad.jpg', 'caso-electronica.jpg'
];
for (const file of images) {
  const absolute = path.join(assetRoot, file);
  expect(fs.existsSync(absolute), `Imagen ausente: ${file}`);
  if (fs.existsSync(absolute)) {
    const bytes = fs.readFileSync(absolute);
    expect(bytes.length > 2000000, `La imagen ${file} no conserva resolución suficiente.`);
    expect(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff, `${file} no coincide con su extensión JPEG.`);
  }
}

const video = path.join(assetRoot, 'video-industria40.mp4');
expect(fs.existsSync(video) && fs.statSync(video).size > 15000000, 'El video inicial está ausente o incompleto.');
const videoHeader = fs.existsSync(video) ? fs.readFileSync(video).subarray(0, 64).toString('latin1') : '';
expect(videoHeader.includes('ftyp'), 'El archivo de video no tiene una cabecera MP4 válida.');

const jumps = [...page.matchAll(/data-go="(\d+)"[^>]*>Abrir caso (4°[ABCE])/g)].map(match => ({target:Number(match[1]), course:match[2]}));
expect(jumps.length === 4, 'Faltan accesos directos para alguna especialidad.');
for (const jump of jumps) {
  expect((slides[jump.target - 1] || '').startsWith(`Caso ${jump.course}`), `El acceso ${jump.course} apunta a una pantalla incorrecta.`);
}

const class4Start = portal.indexOf('<h3>Industria 4.0 · investigación</h3>');
expect(class4Start >= 0, 'La portada NM4 no contiene la Clase 4.');
const class4Card = class4Start >= 0 ? portal.slice(portal.lastIndexOf('<article', class4Start), portal.indexOf('</article>', class4Start) + 10) : '';
expect(class4Card.includes('u3-card activa'), 'La Clase 4 no está marcada como actual.');
expect(class4Card.includes('/nm4/u3-clase4-industria40/'), 'La tarjeta actual no enlaza la nueva clase.');
expect(class4Card.includes('4°A, 4°B, 4°C y 4°E'), 'La tarjeta no identifica los cuatro cursos destinatarios.');
expect(!class4Card.includes('4°D'), 'La tarjeta de Industria 4.0 no debe asignarse a 4°D.');
expect(page.includes('4°D continúa en el proyecto Anuario'), 'La presentación no aclara la ruta independiente de 4°D.');

const requiredManifest = [pagePath, 'nm4/u3-clase4-industria40/assets/video-industria40.mp4', 'nm4/u3-clase4-industria40/assets/video-industria40.vtt', ...images.map(file => `nm4/u3-clase4-industria40/assets/${file}`)];
requiredManifest.forEach(file => expect(manifest.criticalFiles.some(entry => entry.path === file), `El manifiesto no protege ${file}.`));

const inlineScripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(value => value.trim());
inlineScripts.forEach((script, index) => { try { new Function(script); } catch (error) { failures.push(`Script embebido ${index + 1} inválido: ${error.message}`); } });

if (failures.length) {
  console.error('Auditoría NM4 U3 Clase 4 incumplida:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log('NM4 U3 Clase 4 auditada: 15 pantallas, 4 casos, 8 fuentes oficiales, IA, video subtitulado y recursos visuales 2K.');
