// api/paes.js
// Unified Vercel Serverless Function for PAES module management
// Routes: ?action=submit | ?action=submit-guia | ?action=track-download | ?action=get-student-status | ?action=get-nomina-extra
//         | ?action=admin-get-results | ?action=admin-reset-result | ?action=admin-grade-guia | ?action=admin-reset-guia
//         | ?action=admin-save-student | ?action=admin-delete-student

const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_paes';
const ADMIN_BASE = 'plataforma_estudiantes';

function normalizePrivateKey(raw) {
    let key = (raw || '').trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }
    if (key.includes('\\n')) {
        key = key.replace(/\\n/g, '\n');
    }
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
            console.error('[paes.js] FIREBASE_PRIVATE_KEY is empty');
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
} catch (e) {
    initError = e.message;
    console.error('[paes.js] Firebase init error:', e.message);
}

const db = admin.database();
const auth = admin.auth();

function cleanRut(r) { 
    return (r || '').replace(/[.\s-]/g, '').toUpperCase(); 
}

function resolveAllowedOrigin(req) {
    const origin = (req.headers.origin || '').trim();
    const explicit = (process.env.ALLOWED_ORIGINS || 'https://estudiacest.com,https://www.estudiacest.com,http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    if (explicit.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
        return origin;
    }
    return 'https://estudiacest.com';
}

async function verifyAdmin(req) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) throw new Error('Token requerido');
    const decoded = await auth.verifyIdToken(token);
    const snap = await db.ref(`${ADMIN_BASE}/admins/${decoded.uid}`).once('value');
    if (!snap.val()) throw new Error('No autorizado');
    return decoded;
}

// ============ PUBLIC STUDENT ACTIONS ============

async function handleSubmit(req, res) {
    const { rut, nombre, curso, ensayoId, answers, correct, total, score, timeSpentSeconds, detail } = req.body;
    if (!rut || !nombre || !curso || !ensayoId) {
        return res.status(400).json({ error: 'Campos requeridos: rut, nombre, curso, ensayoId' });
    }

    const rutLimpio = cleanRut(rut);
    const resultRef = db.ref(`${BASE}/resultados/${ensayoId}/${rutLimpio}`);

    const payload = {
        rut: rutLimpio,
        nombre: nombre.trim(),
        curso: curso.trim(),
        ensayoId: parseInt(ensayoId, 10),
        correct: parseInt(correct, 10) || 0,
        total: parseInt(total, 10) || 40,
        score: parseInt(score, 10) || 100,
        timeSpentSeconds: parseInt(timeSpentSeconds, 10) || 0,
        submittedAt: Date.now(),
        answers: answers || {},
        detail: detail || {}
    };

    await resultRef.set(payload);
    return res.status(200).json({ success: true });
}

async function handleSubmitGuia(req, res) {
    const { rut, nombre, curso, guiaId, answers, dev, correct, total, score } = req.body;
    if (!rut || !nombre || !curso || !guiaId) {
        return res.status(400).json({ error: 'Campos requeridos: rut, nombre, curso, guiaId' });
    }

    const rutLimpio = cleanRut(rut);
    const ref = db.ref(`${BASE}/guia_respuestas/${guiaId}/${rutLimpio}`);

    // .update() preserva una eventual calificación del docente (nodo 'grade')
    await ref.update({
        rut: rutLimpio,
        nombre: nombre.trim(),
        curso: curso.trim(),
        guiaId: String(guiaId),
        answers: answers || {},
        dev: dev || {},
        correct: parseInt(correct, 10) || 0,
        total: parseInt(total, 10) || 0,
        score: parseInt(score, 10) || 0,
        submittedAt: Date.now()
    });

    return res.status(200).json({ success: true });
}

async function handleTrackDownload(req, res) {
    const { rut, nombre, curso, guiaId } = req.body;
    if (!rut || !guiaId) {
        return res.status(400).json({ error: 'Campos requeridos: rut, guiaId' });
    }

    const rutLimpio = cleanRut(rut);
    const downloadRef = db.ref(`${BASE}/guias/${rutLimpio}/${guiaId}`);

    await downloadRef.transaction((current) => {
        const value = current || { count: 0 };
        return {
            guiaId,
            rut: rutLimpio,
            nombre: nombre ? nombre.trim() : (value.nombre || 'Estudiante'),
            curso: curso ? curso.trim() : (value.curso || 'General'),
            downloadedAt: Date.now(),
            count: (value.count || 0) + 1
        };
    });

    return res.status(200).json({ success: true });
}

async function handleGetNominaExtra(req, res) {
    const snap = await db.ref(`${BASE}/nomina_extra`).once('value');
    const val = snap.exists() ? snap.val() : {};
    return res.status(200).json({ success: true, nomina_extra: Object.values(val) });
}

async function handleGetStudentStatus(req, res) {
    const rut = req.query.rut || req.body.rut;
    if (!rut) {
        return res.status(400).json({ error: 'RUT requerido' });
    }

    const rutLimpio = cleanRut(rut);

    // Fetch Ensayo 1 & 2 results + Downloaded Guides
    const [e1Snap, e2Snap, guiasSnap] = await Promise.all([
        db.ref(`${BASE}/resultados/1/${rutLimpio}`).once('value'),
        db.ref(`${BASE}/resultados/2/${rutLimpio}`).once('value'),
        db.ref(`${BASE}/guias/${rutLimpio}`).once('value')
    ]);

    return res.status(200).json({
        success: true,
        results: {
            1: e1Snap.exists() ? e1Snap.val() : null,
            2: e2Snap.exists() ? e2Snap.val() : null
        },
        guias: guiasSnap.exists() ? guiasSnap.val() : {}
    });
}

// ============ ADMIN ACTIONS ============

async function handleAdminGetResults(req, res) {
    const [resultadosSnap, guiasSnap, guiaRespSnap, nominaExtraSnap] = await Promise.all([
        db.ref(`${BASE}/resultados`).once('value'),
        db.ref(`${BASE}/guias`).once('value'),
        db.ref(`${BASE}/guia_respuestas`).once('value'),
        db.ref(`${BASE}/nomina_extra`).once('value')
    ]);

    return res.status(200).json({
        success: true,
        resultados: resultadosSnap.exists() ? resultadosSnap.val() : {},
        guias: guiasSnap.exists() ? guiasSnap.val() : {},
        guia_respuestas: guiaRespSnap.exists() ? guiaRespSnap.val() : {},
        nomina_extra: nominaExtraSnap.exists() ? Object.values(nominaExtraSnap.val()) : []
    });
}

async function handleAdminGradeGuia(req, res, decoded) {
    const { studentRut, guiaId, nota, feedback } = req.body;
    if (!studentRut || !guiaId) {
        return res.status(400).json({ error: 'studentRut y guiaId requeridos' });
    }

    const rutLimpio = cleanRut(studentRut);
    const gradeRef = db.ref(`${BASE}/guia_respuestas/${guiaId}/${rutLimpio}/grade`);

    await gradeRef.set({
        nota: (nota === undefined || nota === null || String(nota).trim() === '') ? null : String(nota).trim(),
        feedback: feedback ? String(feedback).trim() : '',
        gradedBy: (decoded && decoded.email) ? decoded.email : 'docente',
        gradedAt: Date.now()
    });

    return res.status(200).json({ success: true });
}

async function handleAdminResetGuia(req, res) {
    const { studentRut, guiaId } = req.body;
    if (!studentRut || !guiaId) {
        return res.status(400).json({ error: 'studentRut y guiaId requeridos' });
    }

    const rutLimpio = cleanRut(studentRut);
    await db.ref(`${BASE}/guia_respuestas/${guiaId}/${rutLimpio}`).remove();
    return res.status(200).json({ success: true });
}

async function handleAdminSaveStudent(req, res) {
    const { rut, nombre, curso, rutFormato } = req.body;
    if (!rut || !nombre || !curso) {
        return res.status(400).json({ error: 'Campos requeridos: rut, nombre, curso' });
    }

    const rutLimpio = cleanRut(rut);
    await db.ref(`${BASE}/nomina_extra/${rutLimpio}`).set({
        rut: rutLimpio,
        rut_formato: rutFormato ? String(rutFormato).trim() : rutLimpio,
        nombre: String(nombre).trim(),
        curso: String(curso).trim(),
        updatedAt: Date.now()
    });

    return res.status(200).json({ success: true });
}

async function handleAdminDeleteStudent(req, res) {
    const { rut } = req.body;
    if (!rut) return res.status(400).json({ error: 'rut requerido' });
    await db.ref(`${BASE}/nomina_extra/${cleanRut(rut)}`).remove();
    return res.status(200).json({ success: true });
}

async function handleAdminResetResult(req, res) {
    const { studentRut, ensayoId } = req.body;
    if (!studentRut || !ensayoId) {
        return res.status(400).json({ error: 'studentRut y ensayoId requeridos' });
    }

    const rutLimpio = cleanRut(studentRut);
    const resultRef = db.ref(`${BASE}/resultados/${ensayoId}/${rutLimpio}`);

    await resultRef.remove();
    return res.status(200).json({ success: true });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

    if (initError) return res.status(500).json({ error: 'Firebase no inicializado: ' + initError });

    try {
        const action = req.query.action || req.body.action;

        // Public actions
        if (action === 'submit') return await handleSubmit(req, res);
        if (action === 'submit-guia') return await handleSubmitGuia(req, res);
        if (action === 'track-download') return await handleTrackDownload(req, res);
        if (action === 'get-student-status') return await handleGetStudentStatus(req, res);
        if (action === 'get-nomina-extra') return await handleGetNominaExtra(req, res);

        // Admin actions (Token verification required)
        const decoded = await verifyAdmin(req);

        switch (action) {
            case 'admin-get-results': return await handleAdminGetResults(req, res);
            case 'admin-reset-result': return await handleAdminResetResult(req, res);
            case 'admin-grade-guia': return await handleAdminGradeGuia(req, res, decoded);
            case 'admin-reset-guia': return await handleAdminResetGuia(req, res);
            case 'admin-save-student': return await handleAdminSaveStudent(req, res);
            case 'admin-delete-student': return await handleAdminDeleteStudent(req, res);
            default: return res.status(400).json({ error: 'Acción no válida' });
        }
    } catch (error) {
        console.error('PAES API Error:', error);
        const status = error.message === 'Token requerido' ? 401 : error.message === 'No autorizado' ? 403 : 500;
        return res.status(status).json({ error: error.message });
    }
};
