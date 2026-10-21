const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../cuenta/crear-cuenta.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const source = scripts[scripts.length - 1][1];
function fixture(existing = false, failed = false) {
  const elements = new Map();
  let onAuth;
  let release;
  const saved = [];
  const events = [];
  const pending = new Promise((resolve, reject) => { release = () => failed ? reject({ code: 'auth/popup-closed-by-user' }) : resolve({ user: { uid: 'fixture', displayName: 'Docente de prueba', email: 'fixture@example.invalid' } }); });
  function el(id) {
    if (!elements.has(id)) elements.set(id, { addEventListener(name, fn) { this[name] = fn; }, classList: { add() {}, remove() {} }, style: {} });
    return elements.get(id);
  }
  const auth = { setPersistence() { return Promise.resolve(); }, onAuthStateChanged(fn) { onAuth = fn; }, signInWithPopup() { onAuth({ uid: 'fixture' }); return pending; } };
  function firebaseAuth() { return auth; }
  firebaseAuth.Auth = { Persistence: { LOCAL: 'local' } };
  firebaseAuth.GoogleAuthProvider = function () {};
  const context = {
    window: { location: {}, profeMetrics: { registrationComplete(method, next) { events.push(method); next(); } } },
    document: { getElementById: el },
    firebase: { initializeApp() {}, auth: firebaseAuth, database() { return { ref(path) { return { once() { return Promise.resolve({ exists() { return existing; }, val() { return { role: 'cliente' }; } }); }, set(value) { saved.push({ path, value }); return Promise.resolve(); } }; } }; } },
    FIREBASE_CONFIG: {}, console: { error() {} }, Date, Promise
  };
  vm.runInNewContext(source, context);
  el('google-signin-btn').click();
  return { context, events, saved, release, el };
}
async function flush() { for (let i = 0; i < 14; i++) await Promise.resolve(); }
test('Google nuevo espera la persistencia antes de medir y redirigir', async () => {
  const f = fixture();
  assert.equal(f.context.window.location.href, undefined);
  assert.equal(f.events.length, 0);
  f.release();
  await flush();
  assert.equal(f.saved.length, 2);
  assert.deepEqual(f.events, ['google']);
  assert.equal(f.context.window.location.href, '/dashboard/');
});
test('Google existente ingresa sin contar una inscripción nueva', async () => {
  const f = fixture(true);
  f.release(); await flush();
  assert.equal(f.saved.length, 0);
  assert.equal(f.events.length, 0);
  assert.equal(f.context.window.location.href, '/dashboard/');
});
test('popup fallido no emite inscripción y permite volver a intentar', async () => {
  const f = fixture(false, true);
  f.release(); await flush();
  assert.equal(f.events.length, 0);
  assert.equal(f.context.window.location.href, undefined);
  assert.equal(f.el('google-signin-btn').disabled, false);
});
