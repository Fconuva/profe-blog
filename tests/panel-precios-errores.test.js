const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Precios = require('../js/precios.js');
const { mensajeError } = require('../js/errores-auth.js');

test('los precios del panel son los de la portada', () => {
  const portada = fs.readFileSync(path.join(__dirname, '../index.njk'), 'utf8');
  for (const monto of [Precios.PRECIOS.completo, Precios.PRECIOS.sobrecupo, Precios.PRECIOS.modulo1, Precios.PRECIOS.modulo2, Precios.PRECIOS.modulo3]) {
    assert.ok(portada.includes(monto.toLocaleString('es-CL')), 'falta ' + monto + ' en la portada');
  }
});

test('los planes a la medida suman sus módulos', () => {
  assert.equal(Precios.montoPlan('completo'), 200000);
  assert.equal(Precios.montoPlan('modulo2'), 99990);
  assert.equal(Precios.montoPlan('m1m3'), 159980);
  assert.equal(Precios.montoPlan('desconocido'), 0);
});

test('el panel ya no ofrece precios ni cuotas viejos ni Mercado Pago', () => {
  const panel = fs.readFileSync(path.join(__dirname, '../dashboard/index.html'), 'utf8');
  for (const viejo of ['199.990', '199990', '6 cuotas', '3 cuotas', 'iniciarPagoMP', 'mpLinks', 'pay-after', 'Julio 2026', 'quedan 7 cupos']) {
    assert.ok(!panel.includes(viejo), 'sigue apareciendo ' + viejo);
  }
});

test('los errores de Firebase salen en español y nunca en inglés', () => {
  assert.equal(mensajeError({ code: 'auth/email-already-in-use', message: 'Firebase: Error (auth/email-already-in-use).' }), 'Este correo ya está registrado. ¿Quieres ingresar en su lugar?');
  assert.equal(mensajeError('storage/unauthenticated'), 'Tu sesión se cerró. Vuelve a ingresar e intenta de nuevo.');
  assert.match(mensajeError(new TypeError('Failed to fetch')), /conexión/);
  assert.equal(mensajeError({ code: 'auth/internal-error', message: 'An internal error has occurred.' }, 'Intenta nuevamente.'), 'Intenta nuevamente.');
  assert.doesNotMatch(mensajeError({ message: 'Something went wrong' }), /Something/);
});
