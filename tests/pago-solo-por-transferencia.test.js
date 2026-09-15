/*
 * El sitio no puede volver a ofrecer un cobro con tarjeta por Mercado Pago.
 *
 * Por que existe, 15-sep-2026
 * ---------------------------
 * Mercado Pago suspendio la cuenta y retuvo el saldo. Un boton de pago con tarjeta que siga
 * vivo manda a la docente a pagar a una cuenta de la que la plata no sale: paga, y no llega.
 * Es plata de un tercero. Por eso se eliminaron todos los caminos de checkout del front y el
 * unico medio es la transferencia a Banco Falabella.
 *
 * Los endpoints de api/mercadopago/ SIGUEN EXISTIENDO a proposito y este test no los toca:
 * el webhook tiene que poder acreditar un pago viejo que se libere, validar-payment sirve
 * para comprobantes ya emitidos, y create_preference lo usa ECEP con tipo "reclaim", que no
 * cobra nada sino que migra los accesos cuando a un docente le cambia el UID.
 *
 * Regla: Portabot-2026/_gestion/REGLA_LOS_DATOS_DE_PAGO_SON_LOS_DE_FALABELLA.md
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const leer = (...p) => fs.readFileSync(path.join(root, ...p), 'utf8');

const CUENTA_VIGENTE = '1-999-252726-5';
const CUENTA_VIEJA_MP = '1090804215';

const PAGINAS = {
  'dashboard/index.html': leer('dashboard', 'index.html'),
  'docente-creador/index.njk': leer('docente-creador', 'index.njk'),
  'index.njk': leer('index.njk'),
  'js/ecep-auth.js': leer('js', 'ecep-auth.js'),
};

test('ninguna pagina ofrece un enlace de checkout de Mercado Pago', () => {
  for (const [nombre, texto] of Object.entries(PAGINAS)) {
    assert.ok(!texto.includes('mpago.la'), `${nombre} todavia enlaza a mpago.la`);
    assert.ok(!/init_point/.test(texto), `${nombre} todavia sigue un init_point de Mercado Pago`);
  }
});

test('la cuenta suspendida de Mercado Pago no aparece en ninguna parte', () => {
  for (const [nombre, texto] of Object.entries(PAGINAS)) {
    const plano = texto.replace(/[.\s-]/g, '');
    assert.ok(!plano.includes(CUENTA_VIEJA_MP), `${nombre} nombra la cuenta suspendida`);
  }
});

test('el dashboard ya no puede crear un pago con tarjeta', () => {
  // Seis botones distintos llamaban a iniciarPagoMP. La funcion se dejo con el mismo nombre
  // justamente para que ninguno quedara vivo, pero sin pedirle una preferencia a la pasarela.
  const dashboard = PAGINAS['dashboard/index.html'];
  assert.ok(!dashboard.includes('create_preference'), 'el dashboard aun pide una preferencia de pago');
  assert.match(dashboard, /function iniciarPagoMP\(/, 'iniciarPagoMP desaparecio y sus 6 botones quedarian sueltos');
});

test('donde se pide plata estan los datos de Banco Falabella', () => {
  for (const nombre of ['dashboard/index.html', 'docente-creador/index.njk', 'js/ecep-auth.js']) {
    assert.ok(PAGINAS[nombre].includes(CUENTA_VIGENTE), `${nombre} no trae la cuenta vigente`);
    assert.match(PAGINAS[nombre], /Banco Falabella/, `${nombre} no nombra el banco`);
  }
});

test('el formulario de Docente Creador no depende de un enlace de pago que ya no llega', () => {
  // Reventaba con «No se pudo generar el enlace de pago» si la API no devolvia checkoutUrl.
  // Sin Mercado Pago no lo devuelve nunca, asi que el docente no podia ni inscribirse.
  const dc = PAGINAS['docente-creador/index.njk'];
  assert.ok(!dc.includes('checkoutUrl'), 'el formulario todavia exige un checkoutUrl');
  assert.ok(!dc.includes('No se pudo generar el enlace de pago'), 'sigue el error que bloqueaba la inscripcion');
});

/*
 * El comprobante por WhatsApp es obligatorio, no una sugerencia.
 *
 * Instruccion de Francisco, 15-sep-2026: «una vez que paguen mandar comprobante por wsp es
 * obligatorio». Sin pasarela no hay confirmacion automatica: la unica forma de saber que una
 * docente pago es que nos llegue su comprobante. Si la pantalla lo deja como algo opcional, el
 * pago entra al banco y nadie lo concilia, y despues se le cobra a alguien que ya pago.
 */
test('el numero de comprobante no puede volver a ser opcional', () => {
  const dashboard = PAGINAS['dashboard/index.html'];
  assert.doesNotMatch(
    dashboard,
    /pay-transfer-comprobante[\s\S]{0,200}\(opcional\)/,
    'el campo del comprobante volvio a estar marcado como opcional'
  );
  assert.match(dashboard, /pay-transfer-comprobante[\s\S]{0,200}\(obligatorio\)/);
});

test('informar la transferencia exige el dato del comprobante', () => {
  // Antes se aceptaba vacio y se guardaba solo «Transferencia», sin con que conciliar.
  const dashboard = PAGINAS['dashboard/index.html'];
  assert.match(dashboard, /Escribe el N° de comprobante o el titular/);
  assert.doesNotMatch(dashboard, /'Transferencia' \+ \(ref \? ' — ' \+ ref : ''\)/);
});

test('las tres pantallas de pago dicen que enviar el comprobante es obligatorio', () => {
  for (const nombre of ['dashboard/index.html', 'docente-creador/index.njk', 'js/ecep-auth.js']) {
    assert.match(PAGINAS[nombre], /obligatorio/i, `${nombre} no dice que el comprobante es obligatorio`);
    // ECEP arma el enlace concatenando ('https://wa.me/' + WSP), asi que no se busca literal.
    assert.match(PAGINAS[nombre], /wa\.me/, `${nombre} no ofrece el WhatsApp para mandarlo`);
    assert.match(PAGINAS[nombre], /56988138929/, `${nombre} no trae el numero de WhatsApp`);
  }
});
