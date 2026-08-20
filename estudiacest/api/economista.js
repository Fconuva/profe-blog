// api/economista.js
// Prueba de Plan Lector "El economista callejero" (NM4).
//
// Por que existe este endpoint y no se escribe directo desde el navegador:
// las reglas de RTDB de este proyecto viven en dos archivos que hoy estan
// divergidos, y desplegar cualquiera de los dos apagaria funciones del otro.
// Escribiendo desde el servidor con credenciales de administrador la prueba
// no depende de las reglas del cliente y no hay que tocarlas.
//
// Rutas: ?action=get-guia-state | ?action=save | ?action=submit | ?action=admin-list

const admin = require('firebase-admin');
const ROSTER = require('./_roster_nm4.js');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_nm4/economista_callejero';
const TOTAL_PREGUNTAS = 9;

function normalizePrivateKey(raw) {
    let key = (raw || '').trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }
    if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
    const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
    if (packed) {
        const lines = packed[1].match(/.{1,64}/g) || [];
        key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
    }
    return key;
}

let initError = null;
try {
    if (!admin.apps.length) {
        const pk = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
        if (!pk) {
            initError = 'FIREBASE_PRIVATE_KEY no configurada';
            console.error('[economista.js] FIREBASE_PRIVATE_KEY vacia');
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: pk
                }),
                databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
            });
        }
    }
} catch (error) {
    initError = error.message;
    console.error('[economista.js] init:', error.message);
}

const db = admin.apps.length ? admin.database() : null;

const normaliza = (s) => String(s || '')
    .toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

// El curso llega como "4BTP" o como "4°B TP": se acepta cualquiera de las dos.
function normalizaCurso(raw) {
    const c = normaliza(raw).replace(/ /g, '');
    const m = c.match(/^4([A-E])TP$/);
    return m ? `4${m[1]}TP` : null;
}

// La identidad se comprueba contra la nomina: curso + numero de lista, sin RUT.
function buscaEstudiante(curso, numero) {
    const cursoOk = normalizaCurso(curso);
    const n = parseInt(numero, 10);
    if (!cursoOk || !n) return null;
    const lista = ROSTER[cursoOk] || [];
    const alumno = lista.find((a) => Number(a.n) === n);
    return alumno ? { curso: cursoOk, n, nombre: alumno.nombre } : null;
}

const claveDe = (curso, n) => `${curso}_${String(n).padStart(2, '0')}`;

function limpiaRespuestas(answers) {
    const out = {};
    Object.keys(answers || {}).forEach((id) => {
        if (!/^p[1-9]$/.test(id)) return;
        // Tope generoso pero acotado: son respuestas de desarrollo, no archivos.
        out[id] = String(answers[id] || '').slice(0, 12000);
    });
    return out;
}

async function leerIntento(curso, n) {
    const snap = await db.ref(`${BASE}/${claveDe(curso, n)}`).once('value');
    return snap.val() || null;
}

async function handleGetState(req, res) {
    const q = req.method === 'GET' ? req.query : req.body;
    const alumno = buscaEstudiante(q.curso, q.n);
    if (!alumno) return res.status(400).json({ error: 'Curso o numero de lista no valido' });
    const attempt = await leerIntento(alumno.curso, alumno.n);
    return res.status(200).json({ success: true, alumno, attempt });
}

async function handleGuardar(req, res, draft) {
    const { curso, n, answers } = req.body || {};
    const alumno = buscaEstudiante(curso, n);
    if (!alumno) return res.status(400).json({ error: 'Curso o numero de lista no valido' });

    const ref = db.ref(`${BASE}/${claveDe(alumno.curso, alumno.n)}`);
    const previo = (await ref.once('value')).val();

    // Una entrega final no se degrada nunca a borrador: si el estudiante vuelve
    // a abrir la pagina, el autoguardado no puede deshacer lo que ya entrego.
    if (previo && previo.completada === true && draft) {
        return res.status(200).json({ success: true, attempt: previo, ignorado: true });
    }

    const ahora = Date.now();
    const payload = Object.assign({}, previo || {}, {
        curso: alumno.curso,
        n: alumno.n,
        nombre: alumno.nombre,
        answers: limpiaRespuestas(answers),
        total: TOTAL_PREGUNTAS,
        updatedAt: ahora,
        lastSavedAt: ahora,
        status: draft ? 'draft' : 'sent',
        submitted: !draft,
        completada: !draft
    });
    if (!draft) {
        payload.submittedAt = previo && previo.submittedAt ? previo.submittedAt : ahora;
        payload.completadaAt = previo && previo.completadaAt ? previo.completadaAt : ahora;
        // La prueba es de desarrollo: la corrige el profesor, no la pagina.
        if (typeof payload.score === 'undefined') payload.score = null;
        if (typeof payload.nota === 'undefined') payload.nota = null;
    } else if (typeof payload.score === 'undefined') {
        payload.score = null;
    }

    // Escritura unica: no se guardan primero las respuestas y despues la marca.
    await ref.set(payload);
    const confirmado = await leerIntento(alumno.curso, alumno.n);
    return res.status(200).json({ success: true, attempt: confirmado });
}

async function handleAdminList(req, res) {
    const q = req.method === 'GET' ? req.query : req.body;
    if (!process.env.ADMIN_KEY || q.key !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: 'No autorizado' });
    }
    const snap = await db.ref(BASE).once('value');
    return res.status(200).json({ success: true, intentos: snap.val() || {} });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (initError || !db) {
        return res.status(500).json({ error: 'Firebase no disponible', detalle: initError });
    }

    const action = String((req.query && req.query.action) || (req.body && req.body.action) || '');
    try {
        if (action === 'health') return res.status(200).json({ ok: true });
        if (action === 'get-guia-state') return await handleGetState(req, res);
        if (action === 'save') return await handleGuardar(req, res, true);
        if (action === 'submit') return await handleGuardar(req, res, false);
        if (action === 'admin-list') return await handleAdminList(req, res);
        return res.status(400).json({ error: 'Accion no reconocida' });
    } catch (error) {
        console.error('[economista.js]', action, error.message);
        return res.status(500).json({ error: 'Error del servidor', detalle: error.message });
    }
};
