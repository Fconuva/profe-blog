'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const portal = fs.readFileSync(path.join(root, 'paes/index.html'), 'utf8');
const page = fs.readFileSync(path.join(root, 'paes/mi-espacio.html'), 'utf8');
const login = fs.readFileSync(path.join(root, 'lecturas/index.html'), 'utf8');
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
assert.match(page, /BASE \+ '\/estudiantes\/' \+ user\.uid/);
assert.match(portal, /paesSpaceLink'\)\.hidden = !paesRosterEntry \|\| !spaceCourses\.has\(paesRosterEntry\.curso\)/);
assert.match(portal, /spaceCourses = new Set\(\['3°A HC', '3°B HC', '4°A HC', '4°B HC'\]\)/);
assert.match(page, /SPACE_COURSES = new Set\(\['3°A HC', '3°B HC', '4°A HC', '4°B HC'\]\)/);
assert.match(page, /const paesStudent = roster\.find\(item => !item\.es_prueba && cleanRut\(item\.rut\) === rut\)/);
assert.match(page, /!paesStudent \|\| !SPACE_COURSES\.has\(paesStudent\.curso\)/);
assert.match(page, /if \(!selected\)/);
assert.match(page, /if \(selected !== rut\)/);
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
console.log('PAES Mi espacio: enlace, recursos, autenticación, nómina, perfil y sintaxis OK.');
