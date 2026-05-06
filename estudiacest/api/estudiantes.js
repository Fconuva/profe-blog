// api/estudiantes.js
// Unified Vercel Serverless Function for student management
// Routes: ?action=create | ?action=reset-password | ?action=bulk-create

const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const STUDENT_EMAIL_DOMAIN = '@est.estudiacest.com';

function normalizePrivateKey(raw) {
    let key = (raw || '').trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }
    if (key.includes('\\n')) {
        key = key.replace(/\\n/g, '\n');
    }
    // Si el PEM viene "empacado" (sin saltos), reconstruirlo en lineas de 64 chars
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
            console.error('[estudiantes.js] FIREBASE_PRIVATE_KEY is empty');
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
    console.error('[estudiantes.js] Firebase init error:', e.message);
}

const db = admin.database();
const auth = admin.auth();
const BASE = 'plataforma_estudiantes';

function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + STUDENT_EMAIL_DOMAIN; }
function defaultPassword(r) { var d = cleanRut(r).replace(/[^0-9]/g, ''); return d.substring(0, 6).padEnd(6, '0'); }

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

function isEmailAlreadyExistsError(error) {
    return !!error && (
        error.code === 'auth/email-already-exists'
        || error.code === 'auth/email-already-in-use'
        || String(error.message || '').toLowerCase().includes('already exists')
        || String(error.message || '').toLowerCase().includes('already in use')
    );
}

async function upsertStudentProfile(uid, student, decoded) {
    const ref = db.ref(`${BASE}/estudiantes/${uid}`);
    const snap = await ref.once('value');
    const existing = snap.val() || {};
    const payload = {
        ...existing,
        nombre: student.nombre,
        rut: cleanRut(student.rut),
        curso: student.curso,
        perfil_completo: existing.perfil_completo === true,
        password_changed: existing.password_changed === true,
        createdAt: existing.createdAt || Date.now(),
        createdBy: existing.createdBy || decoded.uid
    };
    await ref.set(payload);
    return { existed: snap.exists(), payload };
}

async function createOrRecoverStudentAuth(student, decoded) {
    const email = rutToEmail(student.rut);
    const password = defaultPassword(student.rut);
    let userRecord;
    let recoveredAuth = false;

    try {
        userRecord = await auth.createUser({ email, password, displayName: student.nombre });
    } catch (error) {
        if (!isEmailAlreadyExistsError(error)) throw error;
        userRecord = await auth.getUserByEmail(email);
        recoveredAuth = true;
        await auth.updateUser(userRecord.uid, { displayName: student.nombre }).catch(() => null);
    }

    const profile = await upsertStudentProfile(userRecord.uid, student, decoded);
    return {
        uid: userRecord.uid,
        email,
        password,
        recoveredAuth,
        recoveredProfile: profile.existed
    };
}

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

    const result = await createOrRecoverStudentAuth({ nombre, rut, curso }, decoded);
    return res.status(200).json({ success: true, ...result });
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

async function handleChangeRut(req, res, decoded) {
  const { studentUid, nuevoRut } = req.body;
  if (!studentUid || !nuevoRut) return res.status(400).json({ error: 'studentUid y nuevoRut requeridos' });

  const snap = await db.ref(`${BASE}/estudiantes/${studentUid}`).once('value');
  const student = snap.val();
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

  const nuevoRutLimpio = cleanRut(nuevoRut);
  const nuevoEmail = rutToEmail(nuevoRutLimpio);
  const nuevaPassword = defaultPassword(nuevoRutLimpio);

  // Validar que el nuevo email no esté tomado por OTRO usuario
  try {
    const existing = await auth.getUserByEmail(nuevoEmail);
    if (existing && existing.uid !== studentUid) {
      return res.status(409).json({ error: 'El nuevo RUT ya pertenece a otro estudiante: ' + (existing.displayName || existing.uid) });
    }
  } catch (e) {
    if (!(e && (e.code === 'auth/user-not-found' || String(e.message || '').toLowerCase().includes('no user')))) {
      console.warn('[change-rut] getUserByEmail:', e.message);
    }
  }

  try {
    await auth.updateUser(studentUid, { email: nuevoEmail, password: nuevaPassword });
  } catch (e) {
    return res.status(500).json({ error: 'Error actualizando Firebase Auth: ' + e.message });
  }

  await db.ref(`${BASE}/estudiantes/${studentUid}`).update({
    rut: nuevoRutLimpio,
    password_changed: false,
    password_reset_pending: false,
    rut_anterior: student.rut || null,
    rut_cambiado_at: Date.now(),
    rut_cambiado_por: decoded.uid
  });

  return res.status(200).json({ success: true, uid: studentUid, nuevoEmail, nuevaPassword, rutAnterior: student.rut, rutNuevo: nuevoRutLimpio });
}

async function handleLoginToken(req, res) {
    const { studentUid } = req.body;
    if (!studentUid) return res.status(400).json({ error: 'studentUid requerido' });

    const snap = await db.ref(`${BASE}/estudiantes/${studentUid}`).once('value');
    if (!snap.val()) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const customToken = await auth.createCustomToken(studentUid);
    return res.status(200).json({ success: true, token: customToken });
}

async function handleAdminLogin(req, res) {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'password requerido' });

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '#huala88138929';
    const ADMIN_UID = process.env.ADMIN_UID || 'admin_default';

    if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Contraseña incorrecta' });
    }

    try {
        const customToken = await auth.createCustomToken(ADMIN_UID);
        return res.status(200).json({ success: true, token: customToken, uid: ADMIN_UID });
    } catch (e) {
        console.error('[admin-login] Error creating token:', e.message);
        return res.status(500).json({ error: 'Error al generar token: ' + e.message });
    }
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
            const result = await createOrRecoverStudentAuth({ nombre, rut, curso }, decoded);
            results.created.push({ nombre, uid: result.uid, recoveredAuth: result.recoveredAuth, recoveredProfile: result.recoveredProfile });
        } catch (e) { results.errors.push({ nombre, error: e.message }); }
    }

    return res.status(200).json({ success: true, total: estudiantes.length, created: results.created.length, errors: results.errors });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    if (initError) return res.status(500).json({ error: 'Firebase no inicializado: ' + initError });

    try {
        const action = req.query.action || req.body.action;

        // admin-login no requiere token previo
        if (action === 'admin-login') return await handleAdminLogin(req, res);

        const decoded = await verifyAdmin(req);

        switch (action) {
            case 'create': return await handleCreate(req, res, decoded);
            case 'reset-password': return await handleResetPassword(req, res);
            case 'bulk-create': return await handleBulkCreate(req, res, decoded);
            case 'login-token': return await handleLoginToken(req, res);
            case 'change-rut': return await handleChangeRut(req, res, decoded);
            default: return res.status(400).json({ error: 'Acción no válida. Usa: admin-login, create, reset-password, bulk-create, login-token, change-rut' });
        }
    } catch (error) {
        console.error('Error:', error);
        const status = error.message === 'Token requerido' ? 401 : error.message === 'No autorizado' ? 403 : 500;
        return res.status(status).json({ error: error.message });
    }
};
