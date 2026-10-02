'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const termas = require('../api/_termas.js');

const ROOT = path.resolve(__dirname, '..');

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function getAt(state, route) {
  return route.split('/').filter(Boolean).reduce((node, part) => node && node[part], state);
}

function setAt(state, route, value) {
  const parts = route.split('/').filter(Boolean);
  let node = state;
  for (let i = 0; i < parts.length - 1; i += 1) node = node[parts[i]] = node[parts[i]] || {};
  if (value == null) delete node[parts[parts.length - 1]];
  else node[parts[parts.length - 1]] = clone(value);
}

function snapshot(value) {
  return { val: () => clone(value) };
}

function mockDb() {
  const state = { plataforma_estudiantes: { admins: { 'admin-1': true } } };
  return {
    state,
    ref(route) {
      return {
        async once() { return snapshot(getAt(state, route)); },
        async transaction(update) {
          const current = clone(getAt(state, route));
          const next = update(current);
          if (typeof next === 'undefined') return { committed: false, snapshot: snapshot(current) };
          setAt(state, route, next);
          return { committed: true, snapshot: snapshot(next) };
        }
      };
    }
  };
}

function response() {
  return {
    code: null,
    payload: null,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.code = code; return this; },
    json(payload) { this.payload = payload; return this; }
  };
}

async function call(db, action, body, authenticated = true) {
  const res = response();
  const req = { method: action === 'admin-lista' ? 'GET' : 'POST', body: body || {}, headers: authenticated ? { authorization: 'Bearer token-ficticio' } : {} };
  const auth = { async verifyIdToken() { return { uid: 'admin-1' }; } };
  await termas.manejar(req, res, action, db, auth);
  return res;
}

const baseA = {
  nombre: 'Prueba Uno', apellido: 'Docente Ficticio', correo: 'uno@example.test',
  telefono: '+56 9 1111 1111', emergenciaNombre: 'Contacto ficticio', emergenciaTelefono: '+56 9 2222 2222',
  asiste: 'si', transporte: 'bus', asiento: 7, comida: 'desayuno'
};
const baseB = {
  nombre: 'Prueba Dos', apellido: 'Docente Ficticio', correo: 'dos@example.test',
  telefono: '+56 9 3333 3333', emergenciaNombre: 'Contacto ficticio', emergenciaTelefono: '+56 9 4444 4444',
  asiste: 'si', transporte: 'bus', asiento: 8, comida: 'once'
};

(async () => {
  const db = mockDb();

  const sinSesion = await call(db, 'admin-lista', null, false);
  assert.strictEqual(sinSesion.code, 401, 'El listado administrativo debe exigir sesión.');

  const creada = await call(db, 'admin-guardar', baseA);
  assert.strictEqual(creada.code, 200, 'El admin debe poder inscribir libremente a una persona.');
  let guardada = getAt(db.state, 'eventos_docentes/termas_2026/inscripciones/uno@example,test');
  assert.strictEqual(guardada.gestionAdmin, true);
  assert.match(guardada.llave, /^[a-f0-9]{64}$/);
  const creadaEn = guardada.creado;
  const llave = guardada.llave;

  const correoDuplicado = await call(db, 'admin-guardar', { ...baseB, correo: baseA.correo });
  assert.strictEqual(correoDuplicado.code, 409, 'No puede repetirse el correo.');

  const asientoOcupado = await call(db, 'admin-guardar', { ...baseB, asiento: 7 });
  assert.strictEqual(asientoOcupado.code, 409, 'No puede repetirse el asiento.');

  const segunda = await call(db, 'admin-guardar', baseB);
  assert.strictEqual(segunda.code, 200);

  const editada = await call(db, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo, correo: 'uno.nuevo@example.test', transporte: 'personal', asiento: null, comida: 'ninguna' });
  assert.strictEqual(editada.code, 200, 'El admin debe poder editar una inscripción.');
  assert.strictEqual(getAt(db.state, 'eventos_docentes/termas_2026/inscripciones/uno@example,test'), undefined, 'Cambiar correo debe retirar la clave anterior.');
  guardada = getAt(db.state, 'eventos_docentes/termas_2026/inscripciones/uno,nuevo@example,test');
  assert.strictEqual(guardada.creado, creadaEn, 'Editar debe conservar la fecha de creación.');
  assert.strictEqual(guardada.llave, llave, 'Editar debe conservar la llave existente.');
  assert.strictEqual(guardada.transporte, 'personal');

  const eliminada = await call(db, 'admin-quitar', { correo: 'uno.nuevo@example.test' });
  assert.strictEqual(eliminada.code, 200, 'Eliminar debe responder correctamente.');
  assert.strictEqual(getAt(db.state, 'eventos_docentes/termas_2026/inscripciones/uno,nuevo@example,test'), undefined);
  const papelera = getAt(db.state, 'eventos_docentes/termas_2026/papelera');
  const ids = Object.keys(papelera || {});
  assert.strictEqual(ids.length, 1, 'Eliminar debe archivar un registro recuperable.');

  const lista = await call(db, 'admin-lista');
  assert.strictEqual(lista.code, 200);
  assert.strictEqual(lista.payload.filas.length, 1);
  assert.strictEqual(lista.payload.eliminadas.length, 1);

  const restaurada = await call(db, 'admin-restaurar', { id: ids[0] });
  assert.strictEqual(restaurada.code, 200, 'Restaurar debe recuperar la inscripción.');
  assert.ok(getAt(db.state, 'eventos_docentes/termas_2026/inscripciones/uno,nuevo@example,test'));
  assert.strictEqual(Object.keys(getAt(db.state, 'eventos_docentes/termas_2026/papelera') || {}).length, 0);

  const html = fs.readFileSync(path.join(ROOT, 'termas', 'admin.html'), 'utf8');
  const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(script => script.trim());
  assert.strictEqual(inlineScripts.length, 1, 'El panel debe tener un único script inline auditable.');
  new vm.Script(inlineScripts[0], { filename: 'termas/admin.html' });
  for (const text of ['Resultados de la votación', '+ Inscribir persona', 'Editar inscripción', 'Papelera reciente', 'admin-guardar', 'admin-restaurar']) {
    assert.ok(html.includes(text), `Falta en el panel: ${text}`);
  }
  assert.ok(html.includes('Gestionada por admin'));
  assert.ok(html.includes('Los asientos ocupados aparecen deshabilitados.'));
  assert.ok(!html.includes('Nómina oficial'), 'El panel no debe anunciar una restricción por nómina.');

  const api = fs.readFileSync(path.join(ROOT, 'api', '_termas.js'), 'utf8');
  for (const marcador of ['HUELLAS_NOMINA', 'estaEnNomina', 'nómina vigente']) {
    assert.ok(!api.includes(marcador), `La API todavía conserva la restricción: ${marcador}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.ok(String(packageJson.scripts.prebuild || '').includes('node scripts/audit-termas-admin.js'), 'La auditoría no está integrada al prebuild.');
  const vercelIgnore = fs.readFileSync(path.join(ROOT, '.vercelignore'), 'utf8');
  assert.ok(vercelIgnore.includes('!scripts/audit-termas-admin.js'), 'Vercel excluiría la auditoría del prebuild.');

  console.log('Termas admin: autenticación, inscripción libre, alta, edición, conflictos, papelera, restauración y panel verificados.');
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
