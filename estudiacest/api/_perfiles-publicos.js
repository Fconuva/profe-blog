// api/_perfiles-publicos.js
// Lo mínimo que el ranking y la arena necesitan saber de los demás: nombre
// visible, curso y programa. Nada más.
//
// Caso (10-sep-2026): ranking.html, arena.html y arena-gato.html descargaban
// el nodo `estudiantes` completo en el navegador de cualquier estudiante. Cada
// perfil trae RUT, correo, teléfono y nombre del apoderado; el usuario de cada
// cuenta es el RUT y la clave inicial son sus seis primeros dígitos, y 780 de
// 882 estudiantes no la habían cambiado. Con esto la regla de lectura del nodo
// se cierra: cada estudiante lee solo su propio perfil.
//
// Módulo interno (no función de Vercel): se enruta desde api/estudiantes.js
// con la acción `perfiles-publicos`.

'use strict';

const { visiblesDeCurso } = require('./_nombre-visible.js');

const BASE = 'plataforma_estudiantes';
// Cuenta de demostración del profesor: no compite en el ranking.
const CORREO_DEMO = '111111111@est.estudiacest.com';
const CACHE_MS = 3 * 60 * 1000;
let cache = null;

async function armar(db) {
    if (cache && Date.now() - cache.t < CACHE_MS) return cache.perfiles;
    const [estSnap, adminSnap] = await Promise.all([
        db.ref(`${BASE}/estudiantes`).once('value'),
        db.ref(`${BASE}/admins`).once('value')
    ]);
    const todos = estSnap.val() || {};
    const admins = adminSnap.val() || {};

    const porCurso = {};
    Object.keys(todos).forEach((uid) => {
        const p = todos[uid] || {};
        if (admins[uid] === true || p.email === CORREO_DEMO) return;
        const curso = String(p.curso || '?');
        (porCurso[curso] = porCurso[curso] || {})[uid] = p;
    });

    const perfiles = {};
    Object.keys(porCurso).forEach((curso) => {
        const visibles = visiblesDeCurso(porCurso[curso]);
        Object.keys(porCurso[curso]).forEach((uid) => {
            const p = porCurso[curso][uid];
            const salida = { nombre: visibles[uid] || 'Estudiante', curso };
            if (p.programa) salida.programa = String(p.programa).slice(0, 20);
            perfiles[uid] = salida;
        });
    });
    cache = { t: Date.now(), perfiles };
    return perfiles;
}

async function manejar(req, res, db, auth) {
    try {
        const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
        if (!token) return res.status(401).json({ error: 'Inicia sesión para continuar.' });
        const decoded = await auth.verifyIdToken(token);
        const [estSnap, adminSnap] = await Promise.all([
            db.ref(`${BASE}/estudiantes/${decoded.uid}`).once('value'),
            db.ref(`${BASE}/admins/${decoded.uid}`).once('value')
        ]);
        if (!estSnap.exists() && adminSnap.val() !== true) {
            return res.status(403).json({ error: 'Tu cuenta no está registrada como estudiante.' });
        }
        return res.status(200).json({ ok: true, perfiles: await armar(db) });
    } catch (error) {
        const auth401 = /id token|token/i.test(String(error && error.message));
        if (!auth401) console.error('[_perfiles-publicos.js]', error.message);
        return res.status(auth401 ? 401 : 500).json({ error: auth401 ? 'Sesión vencida. Vuelve a entrar.' : 'Error del servidor' });
    }
}

module.exports = { manejar, CORREO_DEMO };
