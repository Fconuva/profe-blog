'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const termas = require('../api/_termas.js');

const ROOT = path.resolve(__dirname, '..');

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function getAt(state, route) {
  return route.split('/').filter(Boolean).reduce((node, part) => node && node[part], state);
}

function setAt(state, route, value) {
  if (value == null && getAt(state, route) == null) return;
  const parts = route.split('/').filter(Boolean);
  let node = state;
  for (let i = 0; i < parts.length - 1; i += 1) node = node[parts[i]] = node[parts[i]] || {};
  if (value == null) delete node[parts[parts.length - 1]];
  else node[parts[parts.length - 1]] = clone(value);
}

function snapshot(value) {
  return { val: () => clone(value) };
}

function mockDb(coldTransactions = false) {
  const state = { plataforma_estudiantes: { admins: { 'admin-1': true } } };
  return {
    state,
    ref(route) {
      return {
        async once() { return snapshot(getAt(state, route)); },
        async transaction(update) {
          const current = clone(getAt(state, route)) ?? null;
          // Firebase inicia con null si no tiene caché. Devolver undefined
          // aborta antes de consultar el servidor; un valor permite el reintento.
          if (coldTransactions && current !== null && typeof update(null) === 'undefined') {
            return { committed: false, snapshot: snapshot(current) };
          }
          const next = update(current);
          if (typeof next === 'undefined') return { committed: false, snapshot: snapshot(current) };
          setAt(state, route, next);
          return { committed: true, snapshot: snapshot(next) };
        }
      };
    }
  };
}

async function call(db, action, body, authenticated = true) {
  const auth = { async verifyIdToken() { return { uid: 'admin-1' }; } };
  // Servir la función real por HTTP; Firebase y la identidad son ficticios.
  const server = http.createServer(async (req, outgoing) => {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    req.body = raw ? JSON.parse(raw) : {};
    const res = {
      code: 200,
      setHeader(name, value) { outgoing.setHeader(name, value); },
      status(code) { this.code = code; return this; },
      json(payload) { outgoing.writeHead(this.code, { 'Content-Type': 'application/json' }); outgoing.end(JSON.stringify(payload)); }
    };
    const accion = new URL(req.url, 'http://localhost').searchParams.get('action').replace(/^termas-/, '');
    await termas.manejar(req, res, accion, db, auth);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const method = ['estado', 'admin-lista'].includes(action) ? 'GET' : 'POST';
    const result = await fetch(`http://127.0.0.1:${server.address().port}/api/estudiantes?action=termas-${action}`, {
      method,
      headers: { 'Content-Type': 'application/json', Connection: 'close', ...(authenticated ? { authorization: 'Bearer token-ficticio' } : {}) },
      ...(method === 'POST' ? { body: JSON.stringify(body || {}) } : {})
    });
    return { code: result.status, payload: await result.json(), cacheControl: result.headers.get('cache-control') };
  } finally { await new Promise(resolve => server.close(resolve)); }
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
  // Reloj y base ficticios: probar el límite y una transacción que lo cruza,
  // sin escribir inscripciones de prueba en Firebase.
  const cierre = Date.parse('2026-10-24T00:00:00-03:00');
  assert.strictEqual(new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Santiago', dateStyle: 'short', timeStyle: 'medium' }).format(cierre), '2026-10-24 00:00:00');
  const relojReal = Date.now;
  let ahora = cierre - 1000;
  Date.now = () => ahora;
  try {
    const publico = mockDb();
    const abierta = termas.estadoPublico({});
    assert.strictEqual(abierta.cierreInscripcion, cierre);
    assert.strictEqual(abierta.inscripcionAbierta, true);
    const inscrita = await call(publico, 'inscribir', baseA, false);
    assert.strictEqual(inscrita.code, 200, 'Debe aceptar inscripciones al final del 23 de octubre.');
    const llave = inscrita.payload.llave;
    const antes = clone(publico.state);
    ahora = cierre;
    assert.strictEqual(termas.estadoPublico({}).inscripcionAbierta, false);
    for (const datos of [baseB, { ...baseA, llave }, {}]) {
      const cerrada = await call(publico, 'inscribir', datos, false);
      assert.strictEqual(cerrada.code, 403, 'El cierre bloquea altas y modificaciones públicas en el instante exacto.');
      assert.strictEqual(cerrada.payload.codigo, 'cerrada');
      assert.deepStrictEqual(publico.state, antes, 'El rechazo no puede cambiar inscripciones existentes.');
    }
    const propia = await call(publico, 'mia', { correo: baseA.correo, llave }, false);
    assert.strictEqual(propia.code, 200, 'El pase confirmado sigue disponible después del cierre.');
    ahora = cierre + 86400000;
    assert.strictEqual((await call(publico, 'inscribir', baseB, false)).code, 403);
    assert.strictEqual((await call(publico, 'admin-guardar', baseB)).code, 200, 'El admin conserva la gestión de la lista cerrada.');
    const tardia = mockDb();
    const refOriginal = tardia.ref.bind(tardia);
    tardia.ref = route => {
      const ref = refOriginal(route);
      const transaction = ref.transaction;
      ref.transaction = async update => { ahora = cierre; return transaction(update); };
      return ref;
    };
    ahora = cierre - 1;
    const estadoAntes = clone(tardia.state);
    assert.strictEqual((await call(tardia, 'inscribir', baseA, false)).code, 403, 'También se comprueba el plazo dentro de la transacción.');
    assert.deepStrictEqual(tardia.state, estadoAntes);
  } finally { Date.now = relojReal; }
  // El resto simula el periodo abierto: la auditoría debe pasar también después del cierre real.
  Date.now = () => cierre - 60000;

  function comprobarEstadoPrivado(publico) {
    assert.deepStrictEqual(Object.keys(publico).sort(), ['actualizado', 'asientos', 'capacidad', 'cierreInscripcion', 'inscripcionAbierta']);
    Object.values(publico.asientos).forEach(asiento => {
      assert.deepStrictEqual(Object.keys(asiento).sort(), ['nombre', 'ocupado']);
      assert.strictEqual(asiento.ocupado, true);
      assert.strictEqual(typeof asiento.nombre, 'string');
    });
  }
  const privacidad = mockDb();
  const altaPublica = await call(privacidad, 'inscribir', baseA, false);
  assert.strictEqual(altaPublica.code, 200);
  comprobarEstadoPrivado(altaPublica.payload.estado);
  const consultaPublica = await call(privacidad, 'estado', null, false);
  assert.strictEqual(consultaPublica.code, 200);
  const { ok, ...estadoConsulta } = consultaPublica.payload;
  comprobarEstadoPrivado(estadoConsulta);
  assert.deepStrictEqual(estadoConsulta.asientos, { '7': { ocupado: true, nombre: 'Prueba Docente' } });
  for (const datos of [{ ...baseB, asiento: baseA.asiento }, baseA]) {
    const conflictoPublico = await call(privacidad, 'inscribir', datos, false);
    assert.strictEqual(conflictoPublico.code, 409);
    comprobarEstadoPrivado(conflictoPublico.payload.estado);
  }
  const privado = await call(privacidad, 'admin-lista');
  assert.strictEqual(privado.code, 200);
  assert.strictEqual(privado.cacheControl, 'no-store', 'Las respuestas del administrador no deben almacenarse en cachés compartidas.');
  assert.strictEqual(privado.payload.totales.asisten, 1, 'Los totales siguen disponibles únicamente al administrador.');
  assert.strictEqual(privado.payload.asientos['7'].nombre, 'Prueba Docente');
  assert.strictEqual((await call(privacidad, 'admin-lista', null, false)).code, 401);
  privacidad.state.plataforma_estudiantes.admins['admin-1'] = false;
  const noAdmin = await call(privacidad, 'admin-lista');
  assert.strictEqual(noAdmin.code, 403);
  assert.strictEqual(noAdmin.payload.totales, undefined);

  // Recuperar verifica ambos datos privados sin eliminar ni duplicar la reserva.
  const recuperacion = mockDb(true);
  const inicial = await call(recuperacion, 'inscribir', baseA, false);
  assert.strictEqual(inicial.code, 200);
  const rutaPersona = 'eventos_docentes/termas_2026/inscripciones/uno@example,test';
  const insOriginal = clone(getAt(recuperacion.state, rutaPersona));
  const antesRecuperar = clone(recuperacion.state);
  const incorrecta = await call(recuperacion, 'recuperar', { correo: baseA.correo, telefono: baseB.telefono }, false);
  assert.strictEqual(incorrecta.code, 404);
  assert.deepStrictEqual(getAt(recuperacion.state, 'eventos_docentes/termas_2026/inscripciones'), getAt(antesRecuperar, 'eventos_docentes/termas_2026/inscripciones'), 'Un teléfono ajeno no recupera ni cambia la inscripción.');
  const inexistente = await call(recuperacion, 'recuperar', { correo: baseB.correo, telefono: baseB.telefono }, false);
  assert.strictEqual(inexistente.code, 404);
  assert.strictEqual(inexistente.payload.error, incorrecta.payload.error, 'El error no confirma si existe un correo.');
  assert.deepStrictEqual(getAt(recuperacion.state, 'eventos_docentes/termas_2026/inscripciones'), getAt(antesRecuperar, 'eventos_docentes/termas_2026/inscripciones'));
  const recuperada = await call(recuperacion, 'recuperar', { correo: baseA.correo, telefono: '911111111' }, false);
  assert.strictEqual(recuperada.code, 200, 'Recuperación con caché fría y teléfono chileno sin +56.');
  assert.strictEqual(recuperada.cacheControl, 'no-store');
  assert.deepStrictEqual(Object.keys(recuperada.payload).sort(), ['inscripcion', 'llave', 'ok']);
  assert.strictEqual(recuperada.payload.inscripcion.asiento, 7);
  const despuesRecuperar = clone(getAt(recuperacion.state, rutaPersona));
  delete despuesRecuperar.llaveRecuperacion;
  assert.deepStrictEqual(despuesRecuperar, insOriginal, 'Recuperar conserva todos los datos, fechas y llave original.');
  assert.strictEqual((await call(recuperacion, 'mia', { correo: baseA.correo, llave: inicial.payload.llave }, false)).code, 200);
  assert.strictEqual((await call(recuperacion, 'mia', { correo: baseA.correo, llave: 'otra' }, false)).code, 404);
  assert.strictEqual((await call(recuperacion, 'inscribir', { ...baseA, comida: 'once', llave: recuperada.payload.llave }, false)).code, 200);
  assert.strictEqual((await call(recuperacion, 'mia', { correo: baseA.correo, llave: recuperada.payload.llave }, false)).payload.inscripcion.comida, 'once');
  assert.strictEqual(Object.keys(getAt(recuperacion.state, 'eventos_docentes/termas_2026/inscripciones')).length, 1);
  assert.strictEqual((await call(recuperacion, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo, comida: 'desayuno' })).code, 200);
  assert.strictEqual((await call(recuperacion, 'mia', { correo: baseA.correo, llave: recuperada.payload.llave }, false)).code, 200, 'Editar desde el admin conserva ambos accesos.');
  assert.strictEqual((await call(recuperacion, 'inscribir', baseB, false)).code, 200);
  const antesConflictoRecuperado = clone(recuperacion.state);
  assert.strictEqual((await call(recuperacion, 'inscribir', { ...baseA, asiento: 8, llave: recuperada.payload.llave }, false)).code, 409);
  assert.deepStrictEqual(recuperacion.state, antesConflictoRecuperado, 'La recuperación no permite ocupar un asiento ajeno.');
  const relojRecuperacion = Date.now;
  try {
    Date.now = () => cierre;
    const paseCerrado = await call(recuperacion, 'recuperar', { correo: baseA.correo, telefono: baseA.telefono }, false);
    assert.strictEqual(paseCerrado.code, 200, 'El pase puede recuperarse después del cierre.');
    assert.strictEqual((await call(recuperacion, 'inscribir', { ...baseA, llave: paseCerrado.payload.llave }, false)).code, 403);
  } finally { Date.now = relojRecuperacion; }
  const limitada = mockDb(true);
  for (let i = 0; i < 10; i += 1) assert.strictEqual((await call(limitada, 'recuperar', { correo: baseA.correo, telefono: baseA.telefono }, false)).code, 404);
  assert.strictEqual((await call(limitada, 'recuperar', { correo: baseA.correo, telefono: baseA.telefono }, false)).code, 429, 'Los intentos se limitan en la base compartida, también con caché fría.');
  assert.strictEqual(getAt(limitada.state, 'eventos_docentes/termas_2026/inscripciones'), undefined);

  const fria = mockDb(true);
  const ruta = 'eventos_docentes/termas_2026';
  assert.strictEqual((await call(fria, 'admin-guardar', baseA)).code, 200);
  assert.strictEqual((await call(fria, 'admin-guardar', baseB)).code, 200);
  const original = clone(getAt(fria.state, `${ruta}/inscripciones/uno@example,test`));
  const otra = clone(getAt(fria.state, `${ruta}/inscripciones/dos@example,test`));
  const quitadaFria = await call(fria, 'admin-quitar', { correo: baseA.correo });
  assert.strictEqual(quitadaFria.code, 200, 'Una transacción sin caché debe eliminar la inscripción que existe en el servidor.');
  assert.strictEqual(getAt(fria.state, `${ruta}/inscripciones/uno@example,test`), undefined);
  assert.deepStrictEqual(getAt(fria.state, `${ruta}/inscripciones/dos@example,test`), otra);
  const archivo = getAt(fria.state, `${ruta}/papelera`);
  assert.strictEqual(Object.keys(archivo).length, 1, 'Los reintentos archivan una sola vez.');
  assert.deepStrictEqual({ ...archivo[quitadaFria.payload.papeleraId], eliminado: undefined }, { ...original, eliminado: undefined });
  const despuesQuitar = clone(fria.state);
  assert.strictEqual((await call(fria, 'admin-quitar', { correo: baseA.correo })).code, 404);
  assert.deepStrictEqual(fria.state, despuesQuitar, 'Repetir la eliminación no altera la papelera.');
  assert.strictEqual((await call(fria, 'admin-restaurar', { id: quitadaFria.payload.papeleraId })).code, 200, 'Restaurar debe funcionar sin caché.');
  assert.strictEqual(Object.keys(getAt(fria.state, `${ruta}/papelera`)).length, 0);
  assert.strictEqual((await call(fria, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo, comida: 'once' })).code, 200, 'Editar debe funcionar sin caché.');
  const editadaFria = getAt(fria.state, `${ruta}/inscripciones/uno@example,test`);
  assert.strictEqual(editadaFria.llave, original.llave);
  assert.strictEqual(editadaFria.creado, original.creado);
  assert.strictEqual(editadaFria.comida, 'once');
  assert.deepStrictEqual(getAt(fria.state, `${ruta}/inscripciones/dos@example,test`), otra);
  const antesConflicto = clone(fria.state);
  assert.strictEqual((await call(fria, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo, asiento: baseB.asiento })).code, 409);
  assert.deepStrictEqual(fria.state, antesConflicto, 'Sin caché se sigue rechazando un asiento ocupado sin escrituras.');
  const vacia = mockDb(true);
  const antesVacia = clone(vacia.state);
  assert.strictEqual((await call(vacia, 'admin-quitar', { correo: baseA.correo })).code, 404);
  assert.strictEqual((await call(vacia, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo })).code, 404);
  assert.deepStrictEqual(vacia.state, antesVacia, 'Una inscripción inexistente no genera datos nuevos.');

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

  // Bajas: una persona exacta, asiento liberado e historial y seguimiento privados.
  const bajas = mockDb(true);
  await call(bajas, 'admin-guardar', baseA);
  await call(bajas, 'admin-guardar', baseB);
  const rutaBaja = 'eventos_docentes/termas_2026/inscripciones/uno@example,test';
  const previaBaja = clone(getAt(bajas.state, rutaBaja));
  const ajenaBaja = clone(getAt(bajas.state, 'eventos_docentes/termas_2026/inscripciones/dos@example,test'));
  const solicitudBaja = { correo: baseA.correo, actualizado: previaBaja.actualizado };
  const antesBaja = clone(bajas.state);
  assert.strictEqual((await call(bajas, 'admin-baja', solicitudBaja, false)).code, 401);
  assert.strictEqual((await call(bajas, 'admin-baja', { ...solicitudBaja, actualizado: 0 })).code, 400);
  assert.strictEqual((await call(bajas, 'admin-baja', { ...solicitudBaja, correo: 'ausente@example.test' })).code, 404);
  assert.deepStrictEqual(bajas.state, antesBaja);
  const bajaGuardada = await call(bajas, 'admin-baja', solicitudBaja);
  assert.strictEqual(bajaGuardada.code, 200, 'Registrar sin invitado funciona después del cierre y con caché fría.');
  let insBaja = getAt(bajas.state, rutaBaja);
  assert.strictEqual(insBaja.asiste, 'no');
  assert.strictEqual(insBaja.asiento, null);
  assert.strictEqual(insBaja.baja.invitado, '');
  assert.strictEqual(insBaja.llave, previaBaja.llave);
  assert.strictEqual(insBaja.creado, previaBaja.creado);
  assert.strictEqual(insBaja.baja.respuestaAnterior.asiento, 7);
  assert.deepStrictEqual(bajaGuardada.payload.baja, insBaja.baja);
  assert.strictEqual(bajaGuardada.cacheControl, 'no-store');
  const despuesBaja = clone(bajas.state);
  assert.strictEqual((await call(bajas, 'admin-baja', solicitudBaja)).code, 409, 'Un formulario viejo no sobrescribe cambios.');
  assert.deepStrictEqual(bajas.state, despuesBaja);
  assert.strictEqual((await call(bajas, 'estado', null, false)).payload.asientos['7'], undefined);
  assert.ok(!JSON.stringify((await call(bajas, 'estado', null, false)).payload).includes('baja'));
  const primeraBaja = clone(insBaja.baja);
  assert.strictEqual((await call(bajas, 'admin-baja', { ...solicitudBaja, actualizado: insBaja.actualizado, invitado: ' María   Muñoz ', nota: 'Avisó por WhatsApp' })).code, 200);
  insBaja = getAt(bajas.state, rutaBaja);
  assert.strictEqual(insBaja.baja.registrada, primeraBaja.registrada);
  assert.deepStrictEqual(insBaja.baja.respuestaAnterior, primeraBaja.respuestaAnterior);
  assert.strictEqual(insBaja.baja.invitado, 'María Muñoz');
  const listadoBajas = (await call(bajas, 'admin-lista')).payload;
  assert.strictEqual(listadoBajas.totales.asisten, 1);
  assert.strictEqual(listadoBajas.filas.find(f => f.correo === baseA.correo).baja.invitado, 'María Muñoz');
  const propioBaja = (await call(bajas, 'recuperar', { correo: baseA.correo, telefono: baseA.telefono }, false)).payload;
  assert.ok(!JSON.stringify(propioBaja).includes('María Muñoz'), 'El pase propio no expone notas ni al invitado.');
  assert.strictEqual((await call(bajas, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo, asiste: 'no' })).code, 200);
  assert.strictEqual(getAt(bajas.state, rutaBaja).baja.invitado, 'María Muñoz', 'Editar datos conserva seguimiento.');
  assert.strictEqual((await call(bajas, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo, asiento: 8 })).code, 409, 'Reactivar sigue protegiendo asientos ocupados.');
  assert.strictEqual((await call(bajas, 'admin-guardar', { ...baseA, originalCorreo: baseA.correo })).code, 200);
  assert.ok(getAt(bajas.state, rutaBaja).baja.anulada, 'Reconfirmar asistencia conserva el antecedente y anula la baja.');
  assert.deepStrictEqual(getAt(bajas.state, 'eventos_docentes/termas_2026/inscripciones/dos@example,test'), ajenaBaja);

  const html = fs.readFileSync(path.join(ROOT, 'termas', 'admin.html'), 'utf8');
  const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(script => script.trim());
  assert.strictEqual(inlineScripts.length, 1, 'El panel debe tener un único script inline auditable.');
  new vm.Script(inlineScripts[0], { filename: 'termas/admin.html' });
  const ordenar = vm.runInNewContext('(' + inlineScripts[0].match(/function ordenarFilas\([\s\S]*?\n    }/)[0] + ')');
  const ejemplo = [{nombre:'Z',apellido:'Z',correo:'z',creado:100,actualizado:900},{nombre:'A',apellido:'A',correo:'a',creado:200,actualizado:300},{nombre:'Sin fecha',apellido:'B',correo:'b',creado:null}];
  assert.strictEqual(ordenar(ejemplo,'primero').map(f=>f.correo).join(','),'z,a,b');
  assert.strictEqual(ordenar(ejemplo,'ultimo').map(f=>f.correo).join(','),'a,z,b');
  assert.strictEqual(ordenar(ejemplo,'nombre').map(f=>f.correo).join(','),'a,b,z');
  assert.strictEqual(ejemplo.map(f=>f.correo).join(','),'z,a,b','Ordenar no debe mutar los datos.');
  for (const text of ['Resultados de la votación', '+ Inscribir persona', 'Editar inscripción', 'Papelera reciente', 'admin-guardar', 'admin-restaurar']) {
    assert.ok(html.includes(text), `Falta en el panel: ${text}`);
  }
  assert.ok(html.includes('Gestionada por admin'));
  assert.ok(html.includes('Los asientos ocupados aparecen deshabilitados.'));
  assert.ok(!html.includes('Nómina oficial'), 'El panel no debe anunciar una restricción por nómina.');

  const api = fs.readFileSync(path.join(ROOT, 'api', '_termas.js'), 'utf8');
  const pagina = fs.readFileSync(path.join(ROOT, 'termas', 'index.html'), 'utf8');
  for (const marcador of ['chipAsisten', 'chipLibres', 'cuentaBus', 'listaBus', 'mapa.totales']) {
    assert.ok(!pagina.includes(marcador), `La página pública todavía expone cifras o pasajeros: ${marcador}`);
  }
  const plazoCliente = pagina.match(/const CIERRE_INSCRIPCION = Date.parse\('([^']+)'\)/);
  assert.ok(plazoCliente, 'La página debe tener un plazo de respaldo.');
  assert.strictEqual(Date.parse(plazoCliente[1]), cierre, 'Cliente y servidor deben compartir el mismo cierre.');
  const scriptsPublicos = [...pagina.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match => match[1]).filter(script => script.trim());
  scriptsPublicos.forEach(script => new vm.Script(script, { filename: 'termas/index.html' }));
  for (const marcador of ['HUELLAS_NOMINA', 'estaEnNomina', 'nómina vigente']) {
    assert.ok(!api.includes(marcador), `La API todavía conserva la restricción: ${marcador}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.ok(String(packageJson.scripts.prebuild || '').includes('node scripts/audit-termas-admin.js'), 'La auditoría no está integrada al prebuild.');
  const vercelIgnore = fs.readFileSync(path.join(ROOT, '.vercelignore'), 'utf8');
  assert.ok(vercelIgnore.includes('!scripts/audit-termas-admin.js'), 'Vercel excluiría la auditoría del prebuild.');

  if (process.argv.includes('--browser')) {
    const { chromium } = require('playwright');
    const fixture = mockDb(true);
    await call(fixture, 'admin-guardar', baseA);
    await call(fixture, 'admin-guardar', baseB);
    const authFicticia = `<script>const usuarioFicticio={getIdToken:async()=> 'token-ficticio'};const authFicticia=()=>({currentUser:usuarioFicticio,setPersistence:async()=>{},onAuthStateChanged:fn=>fn(usuarioFicticio)});authFicticia.Auth={Persistence:{LOCAL:'local'}};window.firebase={initializeApp(){},auth:authFicticia};</script>`;
    const paginaPrueba = html.replace(/<script src="https:\/\/www.gstatic.com\/firebasejs\/[^\"]*firebase-app-compat.js"><\/script>/, authFicticia).replace(/<script src="https:\/\/www.gstatic.com\/firebasejs\/[^\"]*firebase-auth-compat.js"><\/script>/, '');
    const servidor = http.createServer(async (req, out) => {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/api/estudiantes') {
        let raw = ''; for await (const trozo of req) raw += trozo;
        req.body = raw ? JSON.parse(raw) : {};
        const res = { code: 200, setHeader: (k,v) => out.setHeader(k,v), status(code) { this.code=code;return this; }, json(data) {
          // Firebase puede enumerar campos en otro orden entre transacción y lectura.
          if (data.filas) data.filas.forEach(f => { if (f.baja) f.baja=Object.fromEntries(Object.entries(f.baja).reverse()); });
          out.writeHead(this.code, {'Content-Type':'application/json'});out.end(JSON.stringify(data));
        } };
        return termas.manejar(req, res, url.searchParams.get('action').replace('termas-', ''), fixture, { verifyIdToken: async () => ({ uid:'admin-1' }) });
      }
      if (url.pathname === '/termas/admin') { out.setHeader('Content-Type','text/html;charset=utf-8'); return out.end(paginaPrueba); }
      if (/^\/termas\/assets\/[\w.-]+$/.test(url.pathname) && fs.existsSync(path.join(ROOT,url.pathname))) return out.end(fs.readFileSync(path.join(ROOT,url.pathname)));
      out.writeHead(404);out.end();
    });
    await new Promise(resolve => servidor.listen(0,'127.0.0.1',resolve));
    const browser = await chromium.launch({headless:true});
    try {
      const page = await browser.newPage({viewport:{width:1440,height:1000}});
      const errores=[];page.on('pageerror',e=>errores.push(e.message));
      await page.goto(`http://127.0.0.1:${servidor.address().port}/termas/admin`);
      await page.getByText('Todavía no hay bajas registradas.').waitFor();
      const primera = page.locator('#filas tr').filter({hasText:baseA.correo});
      await primera.getByRole('button',{name:'Anotar baja',exact:true}).click();
      await page.getByRole('button',{name:'Guardar baja',exact:true}).click();
      await page.locator('#editorBaja').waitFor({state:'hidden'});
      await page.locator('#bajas').getByText('Sin invitación anotada').waitFor();
      assert.strictEqual(getAt(fixture.state,rutaBaja).asiste,'no');
      await page.reload();
      await page.locator('#bajas').getByText('Sin invitación anotada').waitFor();
      await page.locator('#bajas').getByRole('button',{name:'Editar baja',exact:true}).click();
      await page.getByLabel('Invitado en su lugar (opcional)').fill('María Muñoz');
      await page.getByLabel('Observaciones (opcional)').fill('Invitación pendiente de respuesta');
      await page.getByRole('button',{name:'Guardar baja',exact:true}).click();
      await page.locator('#editorBaja').waitFor({state:'hidden'});
      await page.reload();
      await page.locator('#bajas').getByText('Invitado en su lugar: María Muñoz').waitFor();
      await page.locator('#filtro').selectOption('bajas');
      assert.strictEqual(await page.locator('#filas tr').count(),1);
      const carpeta = process.env.TERMAS_QA_OUTPUT;
      if (carpeta) fs.mkdirSync(carpeta,{recursive:true});
      for (const width of [320,390,1440,3840]) {
        await page.setViewportSize({width,height:1000});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Desborde en ${width}`);
        await page.locator('#bajas').getByRole('button',{name:'Editar baja',exact:true}).click();
        assert.ok(await page.locator('#btnGuardarBaja').isVisible());
        if(carpeta && [390,1440].includes(width)) await page.screenshot({path:path.join(carpeta,`baja-${width}.png`)});
        await page.getByRole('button',{name:'Cancelar',exact:true}).filter({visible:true}).click();
      }
      assert.deepStrictEqual(errores,[]);
      assert.strictEqual(Object.keys(getAt(fixture.state,'eventos_docentes/termas_2026/inscripciones')).length,2,'Anotar invitado no crea inscripción.');
      console.log('Navegador Termas: guardar baja sin invitado, recargar, completar invitado y observaciones, releer, filtrar y abrir editor en 320/390/1440/3840; sin desbordes ni errores JS. Base e identidad ficticias con función HTTP real.');
    } finally { await browser.close(); await new Promise(resolve=>servidor.close(resolve)); }
  }

  console.log('Termas: privacidad, acceso, plazo, edición, conflictos, papelera, restauración y bajas con invitado opcional, conservación de datos y control de cambios correctos, también con caché fría.');
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
