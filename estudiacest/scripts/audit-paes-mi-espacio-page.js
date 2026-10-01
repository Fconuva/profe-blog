'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const portal = fs.readFileSync(path.join(root, 'paes/index.html'), 'utf8');
const page = fs.readFileSync(path.join(root, 'paes/mi-espacio.html'), 'utf8');
const login = fs.readFileSync(path.join(root, 'lecturas/index.html'), 'utf8');
const sessionSource = fs.readFileSync(path.join(root, 'paes/js/student-session.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'academic-release-manifest.json'), 'utf8'));

assert.match(portal, /id="paesSpaceLink" href="\/paes\/mi-espacio\.html" hidden>Mi espacio<\/a>/);
assert.equal((portal.match(/href="\/paes\/mi-espacio\.html"/g) || []).length, 1);
assert.ok(manifest.criticalFiles.some(entry => entry.path === 'paes/mi-espacio.html'));
for (const source of [
  '/paes/js/nominas.js', '/estudiantes/js/personaje-iso.js',
  '/estudiantes/js/catalogo-casa.js', '/estudiantes/js/mapas-casa.js', '/estudiantes/js/mi-espacio.js',
  '/estudiantes/css/mi-espacio.css'
]) {
  assert.ok(page.includes(source), `Falta recurso compartido ${source}`);
  assert.ok(fs.existsSync(path.join(root, source.slice(1))), `No existe ${source}`);
}
assert.match(page, /auth\.onAuthStateChanged\(async user/);
assert.match(sessionSource, /BASE \+ '\/estudiantes\/' \+ user\.uid/);
assert.match(portal, /paesSpaceLink'\)\.hidden = !paesRosterEntry \|\| !spaceCourses\.has\(paesRosterEntry\.curso\)/);
assert.match(portal, /spaceCourses = new Set\(\['3°A HC', '3°B HC', '4°A HC', '4°B HC'\]\)/);
assert.match(sessionSource, /COURSES = new Set\(\['3°A HC', '3°B HC', '4°A HC', '4°B HC'\]\)/);
assert.match(sessionSource, /cleanCourse\(profile\.curso\) !== cleanCourse\(student\.curso\)/);
assert.match(page, /PaesStudentSession\.remember\(session\)/);
assert.doesNotMatch(page, /selectedPaesRut|Primero ingresa a PAES|\/lecturas\/\?next=/);
assert.match(page, /LOGIN_URL = '\/paes\/\?next=mi-espacio'/);
assert.match(portal, /PaesStudentSession\.restore\(\)/);
assert.match(portal, /PaesStudentSession\.signIn\(student\.rut, passwordInput\.value\)/);
assert.match(portal, /PaesStudentSession\.signOut\(\)/);
assert.ok(manifest.criticalFiles.some(entry => entry.path === 'paes/js/student-session.js'));
assert.ok(portal.includes('/paes/js/student-session.js') && page.includes('/paes/js/student-session.js'));
assert.match(page, /curso:paesStudent\.curso/);
assert.match(login, /const paesSpace = nextPath === '\/paes\/mi-espacio\.html' && isPaesCourse\(student && student\.curso\)/);
assert.match(login, /!isAccessOnlyStudent\(student\) && !paesSpace/);
assert.doesNotMatch(page, /student\.perfil_completo|password_changed/);
assert.match(page, /mountedUid !== user\.uid\) window\.location\.reload\(\)/);
assert.match(page, /MiEspacio\.montar\(/);
assert.doesNotMatch(page, /auth\.signInAnonymously|signInWithEmailAndPassword\(.*rut/);

const scripts = [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).filter(Boolean);
assert.equal(scripts.length, 1);
new vm.Script(scripts[0], { filename:'paes/mi-espacio.html' });
new vm.Script(sessionSource, { filename:'paes/js/student-session.js' });

async function testSession({ user = null, profile, selected = null, fallback = false, denied = false } = {}) {
  const saved = new Map(selected ? [['paes_student', JSON.stringify(selected)]] : []);
  const calls = { custom:0, password:0, signOut:0, requests:0 };
  const auth = {
    currentUser:user,
    async setPersistence() {},
    onAuthStateChanged(callback) { queueMicrotask(() => callback(this.currentUser)); return () => {}; },
    async signInWithCustomToken() { calls.custom++; this.currentUser = { uid:'fixture-user' }; return { user:this.currentUser }; },
    async signInWithEmailAndPassword() { calls.password++; this.currentUser = { uid:'fixture-user' }; return { user:this.currentUser }; },
    async signOut() { calls.signOut++; this.currentUser = null; }
  };
  const db = { ref() { return { async once() { return { val:() => profile || null }; } }; } };
  const app = { auth:() => auth, database:() => db };
  const sdk = { apps:[], initializeApp:() => app, auth:{ Auth:{ Persistence:{ LOCAL:'local' } } } };
  const student = { rut:'111111111', curso:'3°A HC', nombre:'Cuenta de prueba' };
  const sandbox = {
    NOMINAS_PAES:[student], firebase:sdk,
    sessionStorage:{ getItem:key => saved.get(key) || null, setItem:(key, value) => saved.set(key, value), removeItem:key => saved.delete(key) },
    async fetch() { calls.requests++; return { ok:!denied, status:denied ? 401 : 200,
      json:async () => fallback ? { fallback:true } : { token:'fixture-token' } }; }
  };
  sandbox.window = sandbox;
  vm.runInNewContext(sessionSource, sandbox);
  return { session:sandbox.PaesStudentSession, auth, calls, saved, student };
}
async function testFlow() {
  const profile = { rut:'111111111', curso:'3A-HC' };
  const direct = await testSession({ user:{ uid:'fixture-user' }, profile });
  const restored = await direct.session.restore();
  assert.ok(restored, 'Una cuenta autenticada debe abrir Mi espacio sin selección antigua.');
  direct.session.remember(restored);
  assert.equal(JSON.parse(direct.saved.get('paes_student')).rut, restored.student.rut);
  assert.equal(direct.calls.requests, 0, 'Recuperar una sesión no debe volver a pedir credenciales.');

  const mismatch = await testSession({ user:{ uid:'fixture-user' }, profile, selected:{ rut:'222222222' } });
  mismatch.session.remember(await mismatch.session.restore());
  assert.equal(JSON.parse(mismatch.saved.get('paes_student')).rut, '111111111', 'Debe prevalecer la identidad autenticada.');
  const initial = await testSession({ profile });
  assert.equal(await initial.session.restore(), null);
  await initial.session.signIn('11.111.111-1', 'fixture-password');
  assert.equal(initial.calls.custom, 1);
  assert.equal(initial.calls.password, 0);
  assert.ok(await initial.session.restore());
  assert.equal(initial.calls.requests, 1, 'Volver al portal no debe repetir el login.');
  await initial.session.signOut();
  assert.equal(await initial.session.restore(), null);
  assert.equal(initial.saved.has('paes_student'), false);

  const ownPassword = await testSession({ profile, fallback:true });
  await ownPassword.session.signIn('111111111', 'fixture-password');
  assert.equal(ownPassword.calls.password, 1, 'Las claves cambiadas siguen usando Firebase Auth.');
  const wrong = await testSession({ profile, denied:true });
  await assert.rejects(wrong.session.signIn('111111111', 'fixture-password'));
  assert.equal(wrong.calls.password + wrong.calls.custom, 0);
  const crossCourse = await testSession({ user:{ uid:'fixture-user' }, profile:{ ...profile, curso:'4B-HC' } });
  assert.equal(await crossCourse.session.restore(), null, 'No aceptar un perfil de otro curso.');
  console.log('PAES Mi espacio: ingreso único, sesión recuperada, identidad, clave propia, cierre y recursos OK.');
}
testFlow().catch(error => { console.error(error); process.exitCode = 1; });
