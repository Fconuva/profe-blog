const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../js/marketing-metrics.js'), 'utf8');
function setup({ consent = null, path = '/' } = {}) {
  const requests = [];
  const timers = [];
  const context = {
    window: {
      location: { pathname: path, origin: 'https://www.profefranciscopancho.com', hostname: 'www.profefranciscopancho.com', search: '?email=privado@example.com&rut=12345678' },
      PROFE_MARKETING: { measurementId: 'G-TPX8R8EP26' }
    },
    document: { readyState: 'loading', addEventListener() {}, createElement() { return {}; }, head: { appendChild(el) { requests.push(el.src); } }, cookie: '' },
    localStorage: { getItem() { return consent; } },
    setTimeout(fn) { timers.push(fn); },
    Date, URL
  };
  vm.runInNewContext(source, context);
  return { ...context, requests, timers, events: () => Array.from(context.window.dataLayer || []).map(x => Array.from(x)).filter(x => x[0] === 'event') };
}
test('sin permiso no descarga etiquetas ni transmite clics', () => {
  const s = setup();
  assert.equal(s.window.profeMetrics.track('whatsapp_clicked', { location: 'hero' }), false);
  assert.equal(s.requests.length, 0);
  assert.equal(s.events().length, 0);
});
test('con permiso envía un page_view y un clic, con parámetros cerrados y sin datos del formulario', () => {
  const s = setup({ consent: 'granted' });
  s.window.profeMetrics.track('registration_clicked', { location: 'hero', email: 'privado@example.com', rut: '12345678', uid: 'secreto', url: '?email=privado' });
  assert.equal(s.requests.length, 1);
  assert.deepEqual(s.events().map(e => e[1]), ['page_view', 'registration_clicked']);
  const data = s.events()[1][2];
  assert.equal(data.page_location, 'https://www.profefranciscopancho.com/');
  assert.equal(data.page_referrer, '');
  assert.equal(data.email, undefined);
  assert.equal(data.rut, undefined);
  assert.equal(data.uid, undefined);
  assert.equal(data.url, undefined);
  assert.equal(data.location, 'hero');
});
test('registro fallido no tiene evento y completar emite sign_up una sola vez', () => {
  const s = setup({ consent: 'granted', path: '/cuenta/crear-cuenta.html' });
  let redirects = 0;
  assert.equal(s.events().length, 0);
  s.window.profeMetrics.registrationComplete('email', () => redirects++);
  s.window.profeMetrics.registrationComplete('email', () => redirects++);
  assert.equal(s.events().filter(e => e[1] === 'sign_up').length, 1);
  const event = s.events().find(e => e[1] === 'sign_up');
  event[2].event_callback();
  s.timers.forEach(fn => fn());
  assert.equal(redirects, 2); // Cada llamada continúa, la primera solo una vez incluso si vence el timeout.
});
test('registro sin consentimiento continúa sin enviar métricas', () => {
  const s = setup({ path: '/cuenta/crear-cuenta.html' });
  let next = 0;
  s.window.profeMetrics.registrationComplete('google', () => next++);
  s.timers.forEach(fn => fn());
  assert.equal(next, 1);
  assert.equal(s.events().length, 0);
});
test('excluye admin, dashboard, ECEP y las páginas de estudiantes', () => {
  ['/admin/', '/dashboard/', '/evaluaciones/', '/lecturas/', '/estudiantes/'].forEach(path => {
    const s = setup({ consent: 'granted', path });
    assert.equal(s.window.profeMetrics, undefined, path);
    assert.equal(s.requests.length, 0, path);
  });
});
test('rechaza eventos y ubicaciones no permitidos', () => {
  const s = setup({ consent: 'granted' });
  assert.equal(s.window.profeMetrics.track('nombre_docente', { location: 'hero' }), false);
  s.window.profeMetrics.track('whatsapp_clicked', { location: 'correo@example.com', method: 'nombre completo' });
  const data = s.events().find(e => e[1] === 'whatsapp_clicked')[2];
  assert.equal(data.location, undefined);
  assert.equal(data.method, undefined);
});
