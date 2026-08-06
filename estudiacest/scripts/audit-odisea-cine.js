const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const activity = path.join(root, 'nm3', 'odisea-antes-del-cine');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

async function health() {
  const handler = require(path.join(root, 'api', 'odisea-cine.js'));
  let payload = null;
  const req = { method: 'GET', query: { action: 'health' }, headers: {} };
  const res = {
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(value) { payload = value; return value; },
    end() {}
  };
  await handler(req, res);
  assert(res.statusCode === 200, 'El health check de odisea-cine no responde 200.');
  return payload;
}

async function main() {
  const html = read('nm3/odisea-antes-del-cine/index.html');
  const app = read('nm3/odisea-antes-del-cine/app.js');
  const api = read('api/odisea-cine.js');
  const nm3 = read('nm3/index.html');
  const admin = read('nm3/odisea-antes-del-cine/admin.html');

  ['Describe tres personajes', '¿Qué te impactó más?', 'Penélope y Telémaco', '¿Qué aparece en la película?']
    .forEach(text => assert(html.includes(text), `Falta la sección requerida: ${text}`));
  ['save-draft', 'submit', 'Entrega confirmada', 'localStorage']
    .forEach(text => assert(app.includes(text), `Falta el flujo de guardado/entrega: ${text}`));
  assert(nm3.includes('Bitácora de La Odisea'), 'La portada NM3 no enlaza la actividad actualizada.');
  assert(admin.includes('admin-list') && admin.includes('admin-reset'), 'El panel docente no permite listar y restablecer.');

  const eventBlock = app.match(/const events = \[([\s\S]*?)\n  \];/);
  assert(eventBlock, 'No se encontró el banco de acontecimientos.');
  const eventCount = (eventBlock[1].match(/^\s{4}'/gm) || []).length;
  assert(eventCount === 18, `Se esperaban 18 acontecimientos y se encontraron ${eventCount}.`);
  assert(!/correctEvents|respuestaCorrecta|answerKey/i.test(app), 'La clave de acontecimientos no debe quedar expuesta al navegador.');

  for (let index = 1; index <= 18; index += 1) {
    const file = path.join(activity, 'assets', 'actividad-cine', `evento-${String(index).padStart(2, '0')}.webp`);
    assert(fs.existsSync(file) && fs.statSync(file).size > 10000, `Miniatura de acontecimiento ausente o inválida: ${path.basename(file)}`);
  }
  for (let index = 1; index <= 6; index += 1) {
    const file = path.join(activity, 'assets', 'actividad-cine', `personaje-${String(index).padStart(2, '0')}.webp`);
    assert(fs.existsSync(file) && fs.statSync(file).size > 10000, `Retrato de personaje ausente o inválido: ${path.basename(file)}`);
  }

  ['225783403', '224154267', '230748861', '228825506', '233325015', '231070877', '228044849']
    .forEach(rut => assert(!api.includes(`'${rut}'`), `El RUN retirado ${rut} no debe estar en el padrón.`));

  const result = await health();
  assert(result.rosterCount === 131, `El padrón debe tener 131 estudiantes, no ${result.rosterCount}.`);
  assert(result.counts['3A'] === 45 && result.counts['3B'] === 48 && result.counts['3D'] === 38, 'Los totales por curso no coinciden con la nómina entregada.');

  console.log('OK audit-odisea-cine: 131 estudiantes, 24 imágenes y flujo completo.');
}

main().catch(error => {
  console.error(`ERROR audit-odisea-cine: ${error.message}`);
  process.exit(1);
});
