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

// Portada NM4: la tarjeta está habilitada y no depende de una apertura futura.
const class6Start = portal.indexOf('<h3>Escribir en el trabajo: el informe técnico</h3>');
const class6Card = class6Start >= 0 ? portal.slice(portal.lastIndexOf('<article', class6Start), portal.indexOf('</article>', class6Start) + 10) : '';
expect(class6Start >= 0, 'La portada NM4 no contiene la Clase 6.');
expect(class6Card.includes('u3-card activa'), 'La Clase 6 no está habilitada como actividad actual.');
expect(class6Card.includes('Disponible ahora'), 'La Clase 6 no informa que ya está disponible.');
expect(!class6Card.includes('hidden') && !class6Card.includes('data-abre'), 'La Clase 6 conserva un bloqueo de apertura futura.');
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
['get-guia-state', 'validate-partner', "'save'", "'submit'", 'admin-list', 'admin-reset', 'verifyIdToken', 'transaction'].forEach(token => expect(api.includes(token), `La API del informe no contiene ${token}.`));
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

// Versión mecánica (4°A y 4°B): mismos requisitos, su propio caso.
const mbase = 'nm4/u3-clase6-informe-mecanica/';
const mdeck = read(mbase + 'index.html');
const mstudent = read(mbase + 'informe/index.html');
const mrenderer = read(mbase + 'informe/informe.js');
const mpanel = read(mbase + 'revisar/index.html');
const MCAMPOS = require(path.join(root, mbase, 'informe/campos.js'));
const mslides = [...mdeck.matchAll(/<section class="slide" data-title="([^"]+)"/g)].map(m => m[1]);
const mminutes = [...mdeck.matchAll(/<span class="time">(\d+) min<\/span>/g)].reduce((sum, m) => sum + Number(m[1]), 0);
expect(mslides.length === 14 && mminutes === 90, `La clase mecánica tiene ${mslides.length} pantallas y ${mminutes} minutos.`);
MCAMPOS.questions.forEach(q => {
  const count = (mrenderer.match(new RegExp(`field\\('${q.id}'`, 'g')) || []).length;
  expect(count === 1, `Mecánica: el campo ${q.id} aparece ${count} veces en el informe.`);
});
expect(MCAMPOS.activity.sessionId !== CAMPOS.activity.sessionId, 'Las dos versiones comparten sessionId.');
expect(mstudent.includes('version=mecanica') && mpanel.includes('version=mecanica'), 'La versión mecánica no llama a su API.');
expect(!mstudent.includes("'informeNM4.rut'"), 'La versión mecánica comparte la sesión con la eléctrica.');
expect(portal.includes('/nm4/u3-clase6-informe-mecanica/informe/'), 'La tarjeta de la Clase 6 no enlaza al informe mecánico.');
expect(/electrica:[\s\S]*?cursos: \['4CTP', '4ETP', 'PRUEBA'\]/.test(api) && /mecanica:[\s\S]*?cursos: \['4ATP', '4BTP', 'PRUEBA'\]/.test(api), 'La API no conserva separadas las versiones eléctrica y mecánica.');
['m1.jpg', 'm2.jpg', 'm3.jpg', 'm4.jpg', 'fotos.js', 'qr-informe.svg']
  .forEach(file => expect(fs.existsSync(path.join(root, mbase, 'assets', file)), `Mecánica: falta el recurso ${file}.`));
const plan = { cp01: ['2026-06-12', 90, '2026-09-10'], eb01: ['2026-08-03', 60, '2026-10-02'] };
Object.entries(plan).forEach(([k, [from, days, to]]) => {
  const d = new Date(from + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + days);
  expect(d.toISOString().slice(0, 10) === to, `Mecánica: la próxima mantención de ${k} no cuadra (${d.toISOString().slice(0, 10)}).`);
});

// Versión Electrónica (4°E): automatización, mediciones, configuración y respaldo.
const ebase = 'nm4/u3-clase6-informe-electronica/';
const edeck = read(ebase + 'index.html');
const estudente = read(ebase + 'informe/index.html');
const erenderer = read(ebase + 'informe/informe.js');
const epanel = read(ebase + 'revisar/index.html');
const ECAMPOS = require(path.join(root, ebase, 'informe/campos.js'));
const eslides = [...edeck.matchAll(/<section class="slide" data-title="([^"]+)"/g)].map(m => m[1]);
const eminutes = [...edeck.matchAll(/<span class="time">(\d+) min<\/span>/g)].reduce((sum, m) => sum + Number(m[1]), 0);
expect(eslides.length === 14 && eminutes === 90, `La clase de Electrónica tiene ${eslides.length} pantallas y ${eminutes} minutos.`);
ECAMPOS.questions.forEach(q => {
  const count = (erenderer.match(new RegExp(`field\\('${q.id}'`, 'g')) || []).length;
  expect(count === 1, `Electrónica: el campo ${q.id} aparece ${count} veces en el informe.`);
});
expect(ECAMPOS.questions.length === 27, `Electrónica: se esperaban 27 campos y hay ${ECAMPOS.questions.length}.`);
expect(new Set([CAMPOS.activity.sessionId, MCAMPOS.activity.sessionId, ECAMPOS.activity.sessionId]).size === 3, 'Dos versiones comparten el mismo sessionId.');
expect(estudente.includes('version=electronica') && epanel.includes('version=electronica'), 'La versión de Electrónica no llama a su API.');
expect(estudente.includes("'informeNM4elec.rut'") && !estudente.includes("'informeNM4.rut'"), 'Electrónica comparte la sesión del navegador con otra versión.');
expect(portal.includes('/nm4/u3-clase6-informe-electronica/informe/'), 'La tarjeta de la Clase 6 no enlaza al informe de Electrónica.');
expect(/electronica:[\s\S]*?base: 'plataforma_nm4\/informe_electronica_2026'[\s\S]*?cursos: \['4ETP', 'PRUEBA'\]/.test(api), 'La API no separa la base y el curso de Electrónica.');
expect(api.includes("'4ETP': 'electronica'"), 'La API no dirige 4°E a su versión canónica de Electrónica.');
expect(Array.isArray(ECAMPOS.activity.requiredForSubmit) && ECAMPOS.activity.requiredForSubmit.length === 20, 'Electrónica no define las 20 partes mínimas para entregar.');
expect(api.includes('requiredForSubmit') && estudente.includes('requiredForSubmit'), 'El mínimo obligatorio no se valida en cliente y servidor.');
['Obligatorio para entregar:', 'páginas 6, 8, 9 y 11', 'Ampliación', 'de ${REQUIRED_TOTAL} mínimos'].forEach(token => expect((edeck + estudente + erenderer).includes(token), `Electrónica: falta la instrucción de trabajo «${token}».`));
['supportsPairs: true', '/_claims', '/_teams', '_pairBackups', 'workMode', 'validatePair', 'migratePair', 'join-pair'].forEach(token => expect(api.includes(token), `Electrónica: la API de parejas no contiene ${token}.`));
['id="pairMode"', 'id="partnerRut"', 'id="addPartner"', 'validate-partner', 'join-pair', 'Trabajo compartido:', 'sin perder lo que ya escribiste', 'Ambos compartirán el mismo borrador'].forEach(token => expect(estudente.includes(token), `Electrónica: la interfaz de parejas no contiene ${token}.`));
['individualmente o con un compañero', 'Trabajo individual o en pareja', 'ambos comparten el borrador y la entrega'].forEach(token => expect(edeck.includes(token), `Electrónica: la presentación no explica «${token}».`));
expect(epanel.includes('Modalidad') && epanel.includes('Pareja con'), 'Electrónica: el panel docente no identifica las parejas.');
expect(ROWS.filter(row => row[1] === 'PRUEBA').length === 3, 'Faltan las tres identidades ficticias para probar individual y pareja.');
expect(!/partnerRut\s*[:,]\s*input\.partnerRut/.test(api), 'La API intenta guardar el RUT del compañero.');
['PLC-01', 'S1', '46,8 °C', 'versión 1.8', 'PR-AUT-02'].forEach(token => expect(erenderer.includes(token), `Electrónica: falta el dato verificable ${token}.`));
expect(!/esmeril|compresor|elevador de vehículos/i.test(edeck + estudente + erenderer + epanel), 'La versión de Electrónica conserva contenido del caso mecánico.');
['e1-linea-automatizada.jpg', 'e2-sensor-fotoelectrico.jpg', 'e3-gabinete-ventilacion.jpg', 'qr-informe.svg', 'PROMPTS_IMAGENES.md']
  .forEach(file => expect(fs.existsSync(path.join(root, ebase, 'assets', file)), `Electrónica: falta el recurso ${file}.`));
[...edeck.matchAll(/src="(assets\/[^"]+)"/g), ...erenderer.matchAll(/A \+ '([^']+)'/g)].forEach(m => {
  const file = m[1].startsWith('assets/') ? m[1] : 'assets/' + m[1];
  expect(fs.existsSync(path.join(root, ebase, file)), `Electrónica: imagen enlazada inexistente: ${file}.`);
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
console.log(`Clase 6 NM4 verificada: eléctrica ${slides.length} pantallas; mecánica ${mslides.length}; Electrónica ${eslides.length} y ${ECAMPOS.questions.length} campos; nómina de ${ROWS.length}.`);
