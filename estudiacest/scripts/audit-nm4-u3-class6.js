// Auditoría de la Clase 6 NM4 (Unidad 3): informe técnico con ingreso por RUN.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const base = 'nm4/u3-clase6-informe-tecnico/';
const deck = read(base + 'index.html');
const student = read(base + 'informe/index.html');
const renderer = read(base + 'informe/informe.js');
const panel = read(base + 'revisar/index.html');
const portal = read('nm4/index.html');
const economista = read('api/economista.js');
const rosterSource = read('api/_roster_nm4_informe.js');
const CAMPOS = require(path.join(root, base, 'informe/campos.js'));
const { ROWS } = require(path.join(root, 'api/_roster_nm4_informe.js'));
const module_ = require(path.join(root, 'api/_informe-tecnico-nm4.js'));

// Presentación: 14 pantallas, 90 minutos.
const slides = [...deck.matchAll(/<section class="slide" data-title="([^"]+)"/g)].map(m => m[1]);
expect(slides.length === 14, `Se esperaban 14 pantallas y hay ${slides.length}.`);
['Objetivo de la clase', 'La fotografía georreferenciada', 'El hallazgo', 'Instrucciones del taller', 'Cierre · Plenario y timbre']
  .forEach(title => expect(slides.includes(title), `Falta la pantalla «${title}».`));
const minutes = [...deck.matchAll(/<span class="time">(\d+) min<\/span>/g)].reduce((sum, m) => sum + Number(m[1]), 0);
expect(minutes === 90, `Los tiempos de la presentación suman ${minutes} minutos, no 90.`);

// Portada NM4: la tarjeta existe, se abre por fecha y no rompe la grilla.
expect(/id="u3-clase6" data-abre="2026-09-28"/.test(portal), 'La portada NM4 no tiene la tarjeta de la Clase 6 con su fecha de apertura.');
expect(portal.includes('/nm4/u3-clase6-informe-tecnico/informe/'), 'La tarjeta de la Clase 6 no enlaza al informe.');

// Campos: cada campo del servidor se dibuja una vez en el informe.
CAMPOS.questions.forEach(q => {
  const count = (renderer.match(new RegExp(`field\\('${q.id}'`, 'g')) || []).length;
  expect(count === 1, `El campo ${q.id} aparece ${count} veces en el informe.`);
});
expect(CAMPOS.questions.length === 27, `Se esperaban 27 campos y hay ${CAMPOS.questions.length}.`);

// Nómina: sin RUN en texto, sin duplicados y con los cinco cursos.
expect(!/\b\d{7,8}[0-9kK]\b|\d{1,2}\.\d{3}\.\d{3}-[0-9kK]/.test(rosterSource.replace(/"[0-9a-f]{24}"/g, '').replace('11.111.111-1', '')), 'La nómina del informe contiene un RUN en texto.');
const counts = ROWS.reduce((acc, row) => (acc[row[1]] = (acc[row[1]] || 0) + 1, acc), {});
['4ATP', '4BTP', '4CTP', '4DTP', '4ETP'].forEach(c => expect(counts[c] > 25, `La nómina no trae el curso ${c}.`));
expect(new Set(ROWS.map(r => r[0])).size === ROWS.length, 'La nómina tiene hashes duplicados.');
expect(new Set(ROWS.map(r => r[1] + '-' + r[2])).size === ROWS.length, 'La nómina repite curso y número de lista.');

// Servidor: montado en economista.js y con las acciones del contrato.
expect(/modulo\)\s*\|\|\s*''\)\s*===\s*'informe-tecnico'/.test(economista), 'economista.js no deriva ?modulo=informe-tecnico.');
expect(typeof module_ === 'function', 'El módulo del informe no exporta un controlador.');
const api = read('api/_informe-tecnico-nm4.js');
['get-guia-state', "'save'", "'submit'", 'admin-list', 'admin-reset', 'verifyIdToken', 'transaction'].forEach(token => expect(api.includes(token), `La API del informe no contiene ${token}.`));
expect(!/req\.query\.rut|query\.rut/.test(api), 'La API recibe el RUN por la URL.');

// Página del estudiante y panel docente.
expect(!/localStorage/.test(student), 'La página del estudiante usa localStorage en tablets compartidas.');
expect(/method: 'POST'/.test(student) && !/\?rut=|&rut=/.test(student), 'La página envía el RUN fuera del cuerpo POST.');
expect(panel.includes('noindex') && panel.includes('Authorization'), 'El panel docente no está protegido.');

// Recursos.
['f1-torres-charrua.jpg', 'f2-subestacion-charrua.jpg', 'f3-camino-plantacion.jpg', 'f4-vivienda-liviana.jpg', 'motivacion-casa-torre.jpg', 'qr-informe.svg']
  .forEach(file => expect(fs.existsSync(path.join(root, base, 'assets', file)), `Falta el recurso ${file}.`));
[...deck.matchAll(/src="(assets\/[^"]+)"/g), ...renderer.matchAll(/A \+ '([^']+)'/g)].forEach(m => {
  const file = m[1].startsWith('assets/') ? m[1] : 'assets/' + m[1];
  expect(fs.existsSync(path.join(root, base, file)), `Imagen enlazada inexistente: ${file}.`);
});

// Coherencia del caso: la ocupación O-1 queda a 5,2 m del eje E-21 a E-22.
const E21 = [737905, 5891700], E22 = [738160, 5891330], O1 = [738023, 5891538];
const L = Math.hypot(E22[0] - E21[0], E22[1] - E21[1]);
const dist = Math.abs((E22[0] - E21[0]) * (E21[1] - O1[1]) - (E21[0] - O1[0]) * (E22[1] - E21[1])) / L;
expect(Math.abs(dist - 5.2) < 0.3, `O-1 queda a ${dist.toFixed(2)} m del eje, no a 5,2 m.`);
expect(Math.round(L) === 449, `El vano mide ${Math.round(L)} m, no 449 m.`);

if (failures.length) {
  console.error('Clase 6 NM4 con problemas:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`Clase 6 NM4 verificada: ${slides.length} pantallas, ${minutes} min, ${CAMPOS.questions.length} campos, nómina de ${ROWS.length}.`);
