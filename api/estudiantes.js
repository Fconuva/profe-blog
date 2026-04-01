// api/estudiantes.js
// Unified Vercel Serverless Function for student management
// Routes: ?action=create | ?action=reset-password | ?action=bulk-create

const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
    });
}

const db = admin.database();
const auth = admin.auth();
const BASE = 'plataforma_estudiantes';

function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + '@est.profefranciscopancho.com'; }
function defaultPassword(r) { var d = cleanRut(r).replace(/[^0-9]/g, ''); return d.substring(0, 6).padEnd(6, '0'); }

async function verifyAdmin(req) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) throw new Error('Token requerido');
    const decoded = await auth.verifyIdToken(token);
    const snap = await db.ref(`${BASE}/admins/${decoded.uid}`).once('value');
    if (!snap.val()) throw new Error('No autorizado');
    return decoded;
}

async function handleCreate(req, res, decoded) {
    const { nombre, rut, curso } = req.body;
    if (!nombre || !rut || !curso) return res.status(400).json({ error: 'Campos requeridos: nombre, rut, curso' });

    const email = rutToEmail(rut);
    const password = defaultPassword(rut);

    const userRecord = await auth.createUser({ email, password, displayName: nombre });
    await db.ref(`${BASE}/estudiantes/${userRecord.uid}`).set({
        nombre, rut: cleanRut(rut), curso,
        perfil_completo: false, password_changed: false,
        createdAt: Date.now(), createdBy: decoded.uid
    });

    return res.status(200).json({ success: true, uid: userRecord.uid, email });
}

async function handleResetPassword(req, res) {
    const { studentUid } = req.body;
    if (!studentUid) return res.status(400).json({ error: 'studentUid requerido' });

    const snap = await db.ref(`${BASE}/estudiantes/${studentUid}`).once('value');
    const student = snap.val();
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const newPassword = defaultPassword(student.rut);
    await auth.updateUser(studentUid, { password: newPassword });
    await db.ref(`${BASE}/estudiantes/${studentUid}`).update({ password_changed: false, password_reset_pending: false });

    return res.status(200).json({ success: true });
}

async function handleBulkCreate(req, res, decoded) {
    const { estudiantes } = req.body;
    if (!Array.isArray(estudiantes) || estudiantes.length === 0) return res.status(400).json({ error: 'Array de estudiantes requerido' });
    if (estudiantes.length > 50) return res.status(400).json({ error: 'Máximo 50 estudiantes por lote' });

    const results = { created: [], errors: [] };
    for (const est of estudiantes) {
        const { nombre, rut, curso } = est;
        if (!nombre || !rut || !curso) { results.errors.push({ nombre: nombre || '?', error: 'Campos incompletos' }); continue; }
        try {
            const email = rutToEmail(rut);
            const password = defaultPassword(rut);
            const userRecord = await auth.createUser({ email, password, displayName: nombre });
            await db.ref(`${BASE}/estudiantes/${userRecord.uid}`).set({
                nombre, rut: cleanRut(rut), curso,
                perfil_completo: false, password_changed: false,
                createdAt: Date.now(), createdBy: decoded.uid
            });
            results.created.push({ nombre, uid: userRecord.uid });
        } catch (e) { results.errors.push({ nombre, error: e.message }); }
    }

    return res.status(200).json({ success: true, total: estudiantes.length, created: results.created.length, errors: results.errors });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.profefranciscopancho.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
        const decoded = await verifyAdmin(req);
        const action = req.query.action || req.body.action;

        switch (action) {
            case 'create': return await handleCreate(req, res, decoded);
            case 'reset-password': return await handleResetPassword(req, res);
            case 'bulk-create': return await handleBulkCreate(req, res, decoded);
            default: return res.status(400).json({ error: 'Acción no válida. Usa: create, reset-password, bulk-create' });
        }
    } catch (error) {
        console.error('Error:', error);
        const status = error.message === 'Token requerido' ? 401 : error.message === 'No autorizado' ? 403 : 500;
        return res.status(status).json({ error: error.message });
    }
};
