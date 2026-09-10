// api/_salas.js
// Salas de Mi espacio: quién está en cada casa y el chat de la casa.
//
// No es una función de Vercel por sí misma (los archivos con guion bajo no se
// despliegan como funciones): el plan Hobby admite 12 y ya están ocupadas. Se
// enruta desde api/estudiantes.js con las acciones `salas-entrar`, `salas-latido`,
// `salas-salir`, `salas-decir` y `salas-atender`.
//
// Todo lo que escribe el chat pasa por aquí, con credenciales de servidor. El
// cliente solo LEE el nodo `salas` (regla .read para estudiantes registrados);
// no puede escribir ni una letra sin que el filtro la revise primero.
//
// Reglas de la sala:
//  - Tope de 30 presentes por casa; quien no da señales de vida en 60 s se cae.
//  - Un mensaje cada 1,5 s por persona, máximo 200 caracteres.
//  - Lo que el filtro bloquea no se publica: queda en `bloqueados_chat` para el
//    profesor. Lo que el filtro marca como alerta SÍ se publica, y además va a
//    `alertas_chat`: esconder "me quiero morir" esconde el pedido de ayuda.
//  - El chat de cada casa conserva los últimos 100 mensajes.

'use strict';

const admin = require('firebase-admin');
const { revisar } = require('./_filtro-garabatos.js');

const BASE = 'plataforma_estudiantes';
const TOPE_SALA = 30;
const VIDA_MS = 60 * 1000;
const ENTRE_MENSAJES_MS = 1500;
const LARGO_MAX = 200;
const HISTORIAL = 100;

// ---- identidad: el token dice quién es, la nómina dice si existe ----
async function quien(req, db, auth) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) { const e = new Error('Inicia sesión para continuar.'); e.status = 401; throw e; }
    const decoded = await auth.verifyIdToken(token);
    const [estSnap, adminSnap] = await Promise.all([
        db.ref(`${BASE}/estudiantes/${decoded.uid}`).once('value'),
        db.ref(`${BASE}/admins/${decoded.uid}`).once('value')
    ]);
    const est = estSnap.val();
    const esAdmin = adminSnap.val() === true;
    if (!est && !esAdmin) { const e = new Error('Tu cuenta no está registrada como estudiante.'); e.status = 403; throw e; }
    return {
        uid: decoded.uid,
        nombre: est ? String(est.nombre || 'Estudiante') : 'Profe',
        curso: est ? String(est.curso || '') : 'admin',
        esAdmin
    };
}

const idSala = (v) => (/^[A-Za-z0-9_-]{6,64}$/.test(String(v || '')) ? String(v) : null);
const celda = (v, max) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n >= 0 && n < max ? n : 0; };

// look: solo strings cortos, y solo claves conocidas; lo demás se descarta
function limpiaLook(look) {
    const out = {};
    Object.keys(look || {}).forEach((k) => {
        if (!/^[a-zA-Z]{2,20}$/.test(k)) return;
        const v = String(look[k] || '').slice(0, 24);
        if (/^[a-z0-9_-]+$/i.test(v)) out[k] = v;
    });
    return out;
}

async function existeSala(db, sala) {
    const snap = await db.ref(`${BASE}/estudiantes/${sala}`).once('value');
    return snap.exists();
}

// Limpia a los que ya no dan señales y devuelve a los que quedan.
async function presentesVivos(db, sala) {
    const ref = db.ref(`${BASE}/salas/${sala}/presentes`);
    const snap = await ref.once('value');
    const todos = snap.val() || {};
    const ahora = Date.now();
    const vivos = {};
    const borrar = {};
    Object.keys(todos).forEach((uid) => {
        if (ahora - Number(todos[uid].ts || 0) > VIDA_MS) borrar[uid] = null;
        else vivos[uid] = todos[uid];
    });
    if (Object.keys(borrar).length) await ref.update(borrar);
    return vivos;
}

async function entrar(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    if (!(await existeSala(db, sala))) return res.status(404).json({ error: 'Esa casa no existe' });

    const vivos = await presentesVivos(db, sala);
    const yaEstaba = !!vivos[yo.uid];
    if (!yaEstaba && Object.keys(vivos).length >= TOPE_SALA) {
        return res.status(200).json({ ok: false, lleno: true, presentes: Object.keys(vivos).length,
            error: `La casa está llena (${TOPE_SALA} personas). Intenta más tarde.` });
    }
    await db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`).set({
        nombre: yo.nombre.slice(0, 60),
        curso: yo.curso,
        look: limpiaLook(req.body.look),
        col: celda(req.body.col, 5), fila: celda(req.body.fila, 5),
        ts: Date.now()
    });
    return res.status(200).json({ ok: true, presentes: Object.keys(vivos).length + (yaEstaba ? 0 : 1) });
}

async function latido(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    const ref = db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`);
    const actual = (await ref.once('value')).val();
    if (!actual) return res.status(200).json({ ok: false, fuera: true });
    const cambios = { ts: Date.now(), col: celda(req.body.col, 5), fila: celda(req.body.fila, 5) };
    if (req.body.look) cambios.look = limpiaLook(req.body.look);
    await ref.update(cambios);
    return res.status(200).json({ ok: true });
}

async function salir(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    await db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`).remove();
    return res.status(200).json({ ok: true });
}

async function decir(req, res, db, yo) {
    const sala = idSala(req.body.sala);
    if (!sala) return res.status(400).json({ error: 'Sala no válida' });
    const texto = String(req.body.texto || '').replace(/\s+/g, ' ').trim().slice(0, LARGO_MAX);
    if (!texto) return res.status(400).json({ error: 'Mensaje vacío' });

    const refYo = db.ref(`${BASE}/salas/${sala}/presentes/${yo.uid}`);
    const presente = (await refYo.once('value')).val();
    if (!presente) return res.status(403).json({ error: 'Tienes que estar en la casa para hablar.' });

    const ahora = Date.now();
    if (ahora - Number(presente.ultimoMsg || 0) < ENTRE_MENSAJES_MS) {
        return res.status(200).json({ ok: false, lento: true, error: 'Muy rápido. Espera un segundo.' });
    }

    const veredicto = revisar(texto);
    if (!veredicto.ok) {
        // No se publica, pero el profesor puede verlo: el intento también informa.
        await db.ref(`${BASE}/bloqueados_chat`).push({
            sala, uid: yo.uid, nombre: yo.nombre, curso: yo.curso, texto, motivo: veredicto.motivo, ts: ahora
        });
        await refYo.update({ ultimoMsg: ahora, ts: ahora });
        return res.status(200).json({ ok: false, bloqueado: true,
            error: 'Ese mensaje no se puede enviar. Aquí se habla sin garabatos.' });
    }

    const chatRef = db.ref(`${BASE}/salas/${sala}/chat`);
    const nuevo = chatRef.push();
    await nuevo.set({ uid: yo.uid, nombre: yo.nombre.slice(0, 60), texto, ts: ahora, alerta: !!veredicto.alerta });
    await refYo.update({ ultimoMsg: ahora, ts: ahora });

    if (veredicto.alerta) {
        await db.ref(`${BASE}/alertas_chat`).push({
            sala, uid: yo.uid, nombre: yo.nombre, curso: yo.curso, texto, ts: ahora, atendida: false, mensajeId: nuevo.key
        });
    }

    // Recorta el historial: se guardan los últimos 100.
    const viejos = await chatRef.orderByChild('ts').limitToLast(HISTORIAL + 20).once('value');
    const claves = [];
    viejos.forEach((c) => { claves.push(c.key); });
    if (claves.length > HISTORIAL) {
        const borrar = {};
        claves.slice(0, claves.length - HISTORIAL).forEach((k) => { borrar[k] = null; });
        await chatRef.update(borrar);
    }
    return res.status(200).json({ ok: true, id: nuevo.key, alerta: !!veredicto.alerta });
}

async function atender(req, res, db, yo) {
    if (!yo.esAdmin) return res.status(403).json({ error: 'Solo el profesor.' });
    const id = String(req.body.id || '');
    if (!/^[A-Za-z0-9_-]{8,40}$/.test(id)) return res.status(400).json({ error: 'Alerta no válida' });
    await db.ref(`${BASE}/alertas_chat/${id}`).update({ atendida: true, atendidaPor: yo.uid, atendidaTs: Date.now() });
    return res.status(200).json({ ok: true });
}

// Punto de entrada desde api/estudiantes.js. `accion` llega sin el prefijo `salas-`.
async function manejar(req, res, accion, db, auth) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
    try {
        const yo = await quien(req, db, auth);
        if (accion === 'entrar') return await entrar(req, res, db, yo);
        if (accion === 'latido') return await latido(req, res, db, yo);
        if (accion === 'salir') return await salir(req, res, db, yo);
        if (accion === 'decir') return await decir(req, res, db, yo);
        if (accion === 'atender') return await atender(req, res, db, yo);
        return res.status(400).json({ error: 'Acción no reconocida' });
    } catch (error) {
        const status = error.status || 500;
        if (status === 500) console.error('[_salas.js]', accion, error.message);
        return res.status(status).json({ error: status === 500 ? 'Error del servidor' : error.message });
    }
}

module.exports = { manejar, TOPE_SALA };
