// api/_termas.js
// Inscripción del paseo docente a las Termas de Panimávida (estudiacest.com/termas).
//
// No es una función de Vercel por sí misma: el plan Hobby admite 12 y ya están
// ocupadas. Se enruta desde api/estudiantes.js con las acciones `termas-estado`,
// `termas-mia`, `termas-inscribir`, `termas-admin-lista`,
// `termas-admin-guardar`, `termas-admin-quitar` y `termas-admin-restaurar`.
//
// Los datos viven en `eventos_docentes/termas_2026`, fuera de
// `plataforma_estudiantes`. La raíz de firebase-rules.json niega lectura y
// escritura, así que ningún navegador llega a ese nodo: todo pasa por aquí con
// credenciales de servidor. Hacia afuera solo sale el nombre corto de quien
// ocupa cada asiento y los totales; correo, teléfono y contacto de emergencia
// los ve únicamente el admin.
//
// Reglas de la inscripción:
//  - Nombres, apellidos, correo (cualquier dominio), teléfono y contacto de
//    emergencia son obligatorios para todos. La inscripción es libre y se
//    permite una respuesta por correo.
//  - Al inscribirse por primera vez, el servidor entrega una llave que queda en
//    ese navegador y guarda solo su hash. Sin la llave no se modifica una
//    inscripción ajena. Si alguien la pierde, Francisco quita la inscripción
//    desde el admin y la persona vuelve a inscribirse.
//  - El asiento se decide dentro de una transacción sobre todas las
//    inscripciones: si dos personas eligen el mismo a la vez, gana una y la otra
//    recibe 409 con el mapa actualizado. El mapa de asientos no se guarda
//    aparte; se deduce de las inscripciones, así nunca quedan asientos huérfanos.

'use strict';

const crypto = require('crypto');

const BASE = process.env.TERMAS_BASE || 'eventos_docentes/termas_2026';
const INSCRIPCIONES = `${BASE}/inscripciones`;
const PAPELERA = `${BASE}/papelera`;
const CAPACIDAD = 45;
const TOPE_INSCRIPCIONES = 300;
// Sin # $ [ ] / en el correo: es la clave en Firebase.
const RE_CORREO = /^[a-z0-9][a-z0-9._%+-]{0,63}@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
const RE_NOMBRE = /^\p{L}[\p{L}'’.\- ]{0,79}$/u;
const RE_TELEFONO = /^\+?[0-9 ()-]{8,20}$/;
const COMIDAS = new Set(['desayuno', 'once', 'ninguna']);

function fallo(status, mensaje, extra) {
    const e = new Error(mensaje);
    e.status = status;
    if (extra) e.extra = extra;
    return e;
}

function cuerpo(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function texto(valor, max) {
    return String(valor || '').normalize('NFC').replace(/[\u0000-\u001f<>"]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

// Firebase no admite puntos en las claves.
function claveDe(correo) { return correo.replace(/\./g, ','); }

function hashLlave(llave) { return crypto.createHash('sha256').update(String(llave)).digest('hex'); }

function llaveValida(guardada, llave) {
    if (!guardada || !llave) return false;
    const a = Buffer.from(String(guardada), 'hex');
    const b = Buffer.from(hashLlave(llave), 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function primeraPalabra(valor) { return String(valor || '').split(' ')[0] || ''; }

function nombreCorto(ins) { return `${primeraPalabra(ins.nombre)} ${primeraPalabra(ins.apellido)}`.trim(); }

function vaEnBus(ins) { return ins && ins.asiste === 'si' && ins.transporte === 'bus' && Number(ins.asiento) >= 1; }

function estadoPublico(inscripciones) {
    const lista = Object.values(inscripciones || {});
    const asisten = lista.filter(i => i.asiste === 'si');
    const asientos = {};
    asisten.filter(vaEnBus).forEach(i => { asientos[String(i.asiento)] = { nombre: nombreCorto(i) }; });
    return {
        capacidad: CAPACIDAD,
        asientos,
        totales: {
            asisten: asisten.length,
            noAsisten: lista.filter(i => i.asiste === 'no').length,
            bus: Object.keys(asientos).length,
            personal: asisten.filter(i => i.transporte === 'personal').length,
            libres: CAPACIDAD - Object.keys(asientos).length
        },
        actualizado: Date.now()
    };
}

function inscripcionPropia(ins) {
    if (!ins) return null;
    return {
        nombre: ins.nombre || '',
        apellido: ins.apellido || '',
        correo: ins.correo || '',
        telefono: ins.telefono || '',
        emergenciaNombre: ins.emergenciaNombre || '',
        emergenciaTelefono: ins.emergenciaTelefono || '',
        asiste: ins.asiste || '',
        transporte: ins.transporte || '',
        asiento: vaEnBus(ins) ? Number(ins.asiento) : null,
        comida: ins.comida || '',
        actualizado: ins.actualizado || null
    };
}

function validarCorreo(valor) {
    const correo = String(valor || '').trim().toLowerCase();
    if (correo.length > 100 || !RE_CORREO.test(correo)) throw fallo(400, 'Revisa tu correo: debe ser como nombre@dominio.cl.');
    return correo;
}

function validarTelefono(valor, mensaje) {
    const telefono = texto(valor, 20);
    const digitos = telefono.replace(/\D/g, '');
    if (!RE_TELEFONO.test(telefono) || digitos.length < 8 || digitos.length > 15) throw fallo(400, mensaje);
    return telefono;
}

function validarDatosInscripcion(body) {
    const nombre = texto(body.nombre, 80);
    const apellido = texto(body.apellido, 80);
    if (!RE_NOMBRE.test(nombre)) throw fallo(400, 'Escribe los nombres.');
    if (!RE_NOMBRE.test(apellido)) throw fallo(400, 'Escribe los apellidos.');
    const correo = validarCorreo(body.correo);
    const telefono = validarTelefono(body.telefono, 'Revisa el teléfono: por ejemplo, +56 9 1234 5678.');
    const emergenciaNombre = texto(body.emergenciaNombre, 80);
    if (emergenciaNombre.length < 2) throw fallo(400, 'Escribe el nombre del contacto de emergencia.');
    const emergenciaTelefono = validarTelefono(body.emergenciaTelefono, 'Revisa el teléfono del contacto de emergencia.');
    const asiste = String(body.asiste || '');
    if (!['si', 'no'].includes(asiste)) throw fallo(400, 'Indica si asiste.');
    const transporte = asiste === 'si' ? String(body.transporte || '') : '';
    if (asiste === 'si' && !['bus', 'personal'].includes(transporte)) throw fallo(400, 'Indica cómo llega a las termas.');
    const asiento = transporte === 'bus' ? Number(body.asiento) : null;
    if (transporte === 'bus' && !(Number.isInteger(asiento) && asiento >= 1 && asiento <= CAPACIDAD)) throw fallo(400, 'Elige un asiento del bus.');
    const comida = asiste === 'si' ? String(body.comida || '') : '';
    if (asiste === 'si' && !COMIDAS.has(comida)) throw fallo(400, 'Elige una opción de alimentación: con desayuno, con once o solo almuerzo.');
    return { nombre, apellido, correo, telefono, emergenciaNombre, emergenciaTelefono, asiste, transporte, asiento, comida };
}

async function estado(req, res, db) {
    const snap = await db.ref(INSCRIPCIONES).once('value');
    // El mapa se consulta cada pocos segundos: unos segundos de caché en el CDN
    // alivian las funciones sin que el mapa se vea viejo.
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=2, stale-while-revalidate=4');
    return res.status(200).json({ ok: true, ...estadoPublico(snap.val()) });
}

async function mia(req, res, db) {
    const body = cuerpo(req);
    const correo = validarCorreo(body.correo);
    const snap = await db.ref(`${INSCRIPCIONES}/${claveDe(correo)}`).once('value');
    const ins = snap.val();
    if (!ins || !llaveValida(ins.llave, body.llave)) return res.status(404).json({ error: 'No encontramos tu inscripción en este navegador.' });
    return res.status(200).json({ ok: true, inscripcion: inscripcionPropia(ins) });
}

async function inscribir(req, res, db) {
    const body = cuerpo(req);
    const { nombre, apellido, correo, telefono, emergenciaNombre, emergenciaTelefono, asiste, transporte, asiento, comida } = validarDatosInscripcion(body);

    const clave = claveDe(correo);
    const llaveRecibida = String(body.llave || '');
    const llaveNueva = crypto.randomBytes(18).toString('base64url');
    let motivo = '';
    let llaveEntregada = '';

    const resultado = await db.ref(INSCRIPCIONES).transaction(actual => {
        motivo = '';
        llaveEntregada = '';
        const todas = actual || {};
        const previa = todas[clave];
        if (previa && !llaveValida(previa.llave, llaveRecibida)) { motivo = 'ajena'; return; }
        if (!previa && Object.keys(todas).length >= TOPE_INSCRIPCIONES) { motivo = 'tope'; return; }
        if (transporte === 'bus') {
            const ocupado = Object.entries(todas).some(([k, v]) => k !== clave && vaEnBus(v) && Number(v.asiento) === asiento);
            if (ocupado) { motivo = 'ocupado'; return; }
        }
        const ahora = Date.now();
        if (!previa) llaveEntregada = llaveNueva;
        todas[clave] = {
            nombre,
            apellido,
            correo,
            telefono,
            emergenciaNombre,
            emergenciaTelefono,
            asiste,
            transporte,
            asiento: transporte === 'bus' ? asiento : null,
            comida,
            llave: previa ? previa.llave : hashLlave(llaveNueva),
            creado: previa ? previa.creado : ahora,
            actualizado: ahora
        };
        return todas;
    });

    if (!resultado.committed) {
        const snap = await db.ref(INSCRIPCIONES).once('value');
        const mapa = estadoPublico(snap.val());
        if (motivo === 'ocupado') throw fallo(409, 'Alguien acaba de tomar ese asiento. Elige otro.', { codigo: 'ocupado', estado: mapa });
        if (motivo === 'ajena') throw fallo(409, 'Ese correo ya está inscrito desde otro navegador. Si necesitas cambiar algo, escríbele a Francisco Núñez.', { codigo: 'ajena', estado: mapa });
        if (motivo === 'tope') throw fallo(409, 'La inscripción alcanzó su tope. Escríbele a Francisco Núñez.', { codigo: 'tope', estado: mapa });
        throw fallo(500, 'No se pudo guardar la inscripción. Intenta de nuevo.');
    }

    const todas = resultado.snapshot.val() || {};
    return res.status(200).json({
        ok: true,
        llave: llaveEntregada || undefined,
        inscripcion: inscripcionPropia(todas[clave]),
        estado: estadoPublico(todas)
    });
}

async function verificarAdmin(req, db, auth) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) throw fallo(401, 'Inicia sesión para continuar.');
    let decoded;
    try { decoded = await auth.verifyIdToken(token); } catch (_) { throw fallo(401, 'Sesión vencida. Vuelve a ingresar.'); }
    const snap = await db.ref(`plataforma_estudiantes/admins/${decoded.uid}`).once('value');
    if (snap.val() !== true) throw fallo(403, 'Tu cuenta no tiene acceso a esta lista.');
    return decoded;
}

async function adminLista(req, res, db, auth) {
    await verificarAdmin(req, db, auth);
    const snap = await db.ref(BASE).once('value');
    const base = snap.val() || {};
    const todas = base.inscripciones || {};
    const filas = Object.values(todas)
        .map(i => ({ ...inscripcionPropia(i), creado: i.creado || null, gestionAdmin: !!i.gestionAdmin }))
        .sort((a, b) => `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, 'es'));
    const eliminadas = Object.entries(base.papelera || {})
        .map(([id, i]) => ({ id, ...inscripcionPropia(i), eliminado: i.eliminado || null }))
        .sort((a, b) => Number(b.eliminado || 0) - Number(a.eliminado || 0))
        .slice(0, 30);
    return res.status(200).json({ ok: true, filas, eliminadas, ...estadoPublico(todas) });
}

async function adminQuitar(req, res, db, auth) {
    await verificarAdmin(req, db, auth);
    const correo = validarCorreo(cuerpo(req).correo);
    const clave = claveDe(correo);
    const idPapelera = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    let motivo = '';
    const resultado = await db.ref(BASE).transaction(actual => {
        motivo = '';
        const base = actual || {};
        const todas = base.inscripciones || {};
        const previa = todas[clave];
        if (!previa) { motivo = 'no-encontrada'; return; }
        base.papelera = base.papelera || {};
        base.papelera[idPapelera] = { ...previa, eliminado: Date.now() };
        delete todas[clave];
        base.inscripciones = todas;
        return base;
    });
    if (!resultado.committed || motivo === 'no-encontrada') throw fallo(404, 'La inscripción ya no existe. Actualiza la lista.');
    const base = resultado.snapshot.val() || {};
    return res.status(200).json({ ok: true, papeleraId: idPapelera, ...estadoPublico(base.inscripciones) });
}

async function adminGuardar(req, res, db, auth) {
    await verificarAdmin(req, db, auth);
    const body = cuerpo(req);
    const datos = validarDatosInscripcion(body);
    const originalCorreo = String(body.originalCorreo || '').trim() ? validarCorreo(body.originalCorreo) : '';
    const claveOriginal = originalCorreo ? claveDe(originalCorreo) : '';
    const claveNueva = claveDe(datos.correo);
    let motivo = '';
    const resultado = await db.ref(INSCRIPCIONES).transaction(actual => {
        motivo = '';
        const todas = actual || {};
        const previa = claveOriginal ? todas[claveOriginal] : null;
        if (claveOriginal && !previa) { motivo = 'no-encontrada'; return; }
        if ((!claveOriginal || claveOriginal !== claveNueva) && todas[claveNueva]) { motivo = 'correo'; return; }
        if (!previa && Object.keys(todas).length >= TOPE_INSCRIPCIONES) { motivo = 'tope'; return; }
        if (datos.transporte === 'bus') {
            const ocupado = Object.entries(todas).some(([k, v]) => k !== claveOriginal && vaEnBus(v) && Number(v.asiento) === datos.asiento);
            if (ocupado) { motivo = 'ocupado'; return; }
        }
        const ahora = Date.now();
        if (claveOriginal && claveOriginal !== claveNueva) delete todas[claveOriginal];
        todas[claveNueva] = {
            ...datos,
            llave: previa ? previa.llave : hashLlave(crypto.randomBytes(18).toString('base64url')),
            creado: previa ? previa.creado : ahora,
            actualizado: ahora,
            gestionAdmin: true
        };
        return todas;
    });
    if (!resultado.committed) {
        if (motivo === 'no-encontrada') throw fallo(404, 'La inscripción que intentabas editar ya no existe. Actualiza la lista.');
        if (motivo === 'correo') throw fallo(409, 'Ya existe una inscripción con ese correo.');
        if (motivo === 'ocupado') throw fallo(409, 'Ese asiento acaba de ser ocupado. Elige otro.');
        if (motivo === 'tope') throw fallo(409, 'La inscripción alcanzó su tope.');
        throw fallo(500, 'No se pudo guardar la inscripción.');
    }
    const todas = resultado.snapshot.val() || {};
    return res.status(200).json({ ok: true, inscripcion: inscripcionPropia(todas[claveNueva]), ...estadoPublico(todas) });
}

async function adminRestaurar(req, res, db, auth) {
    await verificarAdmin(req, db, auth);
    const id = String(cuerpo(req).id || '').trim();
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) throw fallo(400, 'Registro de papelera inválido.');
    const papeleraSnap = await db.ref(`${PAPELERA}/${id}`).once('value');
    const candidata = papeleraSnap.val();
    if (!candidata) throw fallo(404, 'Ese registro ya no está en la papelera.');
    validarDatosInscripcion(candidata);
    const clave = claveDe(candidata.correo);
    let motivo = '';
    const resultado = await db.ref(BASE).transaction(actual => {
        motivo = '';
        const base = actual || {};
        const archivada = base.papelera && base.papelera[id];
        if (!archivada) { motivo = 'no-encontrada'; return; }
        const todas = base.inscripciones || {};
        if (Object.keys(todas).length >= TOPE_INSCRIPCIONES) { motivo = 'tope'; return; }
        if (todas[clave]) { motivo = 'correo'; return; }
        if (vaEnBus(archivada)) {
            const ocupado = Object.values(todas).some(v => vaEnBus(v) && Number(v.asiento) === Number(archivada.asiento));
            if (ocupado) { motivo = 'ocupado'; return; }
        }
        const restaurada = { ...archivada, actualizado: Date.now(), gestionAdmin: true };
        delete restaurada.eliminado;
        todas[clave] = restaurada;
        delete base.papelera[id];
        base.inscripciones = todas;
        return base;
    });
    if (!resultado.committed) {
        if (motivo === 'no-encontrada') throw fallo(404, 'Ese registro ya no está en la papelera.');
        if (motivo === 'tope') throw fallo(409, 'La inscripción alcanzó su tope.');
        if (motivo === 'correo') throw fallo(409, 'Ya existe una inscripción con ese correo.');
        if (motivo === 'ocupado') throw fallo(409, 'El asiento de esa inscripción ahora está ocupado. Edítala manualmente para asignar otro.');
        throw fallo(500, 'No se pudo restaurar la inscripción.');
    }
    const base = resultado.snapshot.val() || {};
    return res.status(200).json({ ok: true, ...estadoPublico(base.inscripciones) });
}

async function manejar(req, res, accion, db, auth) {
    try {
        if (accion === 'estado' && req.method === 'GET') return await estado(req, res, db);
        if (accion === 'admin-lista' && req.method === 'GET') return await adminLista(req, res, db, auth);
        if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
        if (accion === 'mia') return await mia(req, res, db);
        if (accion === 'inscribir') return await inscribir(req, res, db);
        if (accion === 'admin-guardar') return await adminGuardar(req, res, db, auth);
        if (accion === 'admin-quitar') return await adminQuitar(req, res, db, auth);
        if (accion === 'admin-restaurar') return await adminRestaurar(req, res, db, auth);
        return res.status(400).json({ error: 'Acción no válida.' });
    } catch (error) {
        const status = error.status || 500;
        if (status === 500) console.error('[_termas.js]', accion, error.message);
        return res.status(status).json({ error: status === 500 ? 'No se pudo procesar la solicitud. Intenta de nuevo.' : error.message, ...(error.extra || {}) });
    }
}

module.exports = { manejar, CAPACIDAD, estadoPublico, claveDe, validarDatosInscripcion };
