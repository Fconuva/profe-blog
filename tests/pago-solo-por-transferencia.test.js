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
