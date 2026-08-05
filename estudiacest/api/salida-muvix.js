// Formulario de planificación de regreso: salida PME al cine Muvix (07-08-2026).
// La nómina se valida contra las cargas oficiales de 3A-TP, 3B-TP y 3D-TP.
const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const ADMIN_BASE = 'plataforma_estudiantes';
const RESPONSE_PATH = `${ADMIN_BASE}/salidas_pedagogicas/muvix_2026/respuestas`;

let initError = null;
function normalizePrivateKey(raw) {
  let key = String(raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

function ensureFirebase() {
  if (admin.apps.length) return;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) {
    initError = 'FIREBASE_PRIVATE_KEY no configurada';
    return;
  }
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
    });
  } catch (error) {
    initError = error.message;
  }
}

function cleanRut(value) {
  return String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
}

let rosterCachePromise = null;
async function getRoster() {
  ensureFirebase();
  if (initError) throw new Error(initError);
  if (!rosterCachePromise) {
    rosterCachePromise = admin.database().ref('plataforma_np/unidad1/records').once('value').then(snapshot => {
      const byRut = new Map();
      Object.values(snapshot.val() || {}).forEach(value => {
        const course = String(value.course || value.curso || '').trim().toUpperCase();
        const rut = String(value.rut || '').trim();
        const name = String(value.name || value.nombre || '').trim();
        if (!rut || !name || !['3A-TP', '3B-TP', '3D-TP'].includes(course)) return;
        byRut.set(cleanRut(rut), { name, rut, course });
      });
      return [...byRut.values()];
    });
  }
  return rosterCachePromise;
}

async function findStudent(rut) {
  const clean = cleanRut(rut);
  return (await getRoster()).find(student => cleanRut(student.rut) === clean) || null;
}

function text(value, max = 300) {
  return String(value || '').trim().slice(0, max);
}

function setCors(req, res) {
  const origin = String((req.headers && req.headers.origin) || '').trim();
  const allowed = new Set([
    'https://estudiacest.com',
    'https://www.estudiacest.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]);
  res.setHeader('Access-Control-Allow-Origin', allowed.has(origin) ? origin : 'https://www.estudiacest.com');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}

function jsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

async function verifyAdmin(req) {
  ensureFirebase();
  if (initError) throw new Error(initError);
  const token = String((req.headers && req.headers.authorization) || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new Error('Token requerido');
  const decoded = await admin.auth().verifyIdToken(token);
  const snap = await admin.database().ref(`${ADMIN_BASE}/admins/${decoded.uid}`).once('value');
  if (snap.val() !== true) throw new Error('No autorizado');
  return decoded;
}

function publicStudent(student) {
  return { name: student.name, course: student.course, rut: student.rut };
}

async function handleStudent(req, res) {
  const student = await findStudent(req.query && req.query.rut);
  if (!student) return res.status(404).json({ error: 'RUT no encontrado en las nóminas de 3A-TP, 3B-TP o 3D-TP.' });
  const existing = await admin.database().ref(`${RESPONSE_PATH}/${cleanRut(student.rut)}`).once('value');
  const value = existing.val();
  return res.status(200).json({
    ok: true,
    student: publicStudent(student),
    response: value ? {
      attendance: value.attendance || '',
      returnPlan: value.returnPlan || '',
      guardianConfirmed: value.guardianConfirmed === true,
      guardianName: value.guardianName || '',
      guardianPhone: value.guardianPhone || '',
      notes: value.notes || ''
    } : null
  });
}

async function handleSubmit(req, res) {
  ensureFirebase();
  if (initError) throw new Error(initError);
  const body = jsonBody(req);
  const student = await findStudent(body.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina oficial de estos cursos.' });

  const attendance = String(body.attendance || '');
  const returnPlan = String(body.returnPlan || '');
  const allowedAttendance = new Set(['si', 'no']);
  const allowedReturn = new Set(['adulto_retirara', 'puede_regresar', 'necesita_alternativa']);
  if (!allowedAttendance.has(attendance)) return res.status(400).json({ error: 'Indica si asistirás a la salida.' });
  if (attendance === 'si' && !allowedReturn.has(returnPlan)) return res.status(400).json({ error: 'Indica cómo regresarías desde Muvix.' });
  if (attendance === 'si' && body.guardianConfirmed !== true) return res.status(400).json({ error: 'La respuesta debe ser revisada y confirmada por el apoderado.' });

  const ref = admin.database().ref(`${RESPONSE_PATH}/${cleanRut(student.rut)}`);
  const previous = (await ref.once('value')).val() || {};
  const payload = {
    rut: student.rut,
    name: student.name,
    course: student.course,
    attendance,
    returnPlan: attendance === 'si' ? returnPlan : '',
    canLeaveFromMuvix: attendance === 'si' && ['adulto_retirara', 'puede_regresar'].includes(returnPlan),
    needsReturnAlternative: attendance === 'si' && returnPlan === 'necesita_alternativa',
    guardianConfirmed: body.guardianConfirmed === true,
    guardianName: text(body.guardianName, 120),
    guardianPhone: text(body.guardianPhone, 40),
    notes: text(body.notes, 500),
    createdAt: previous.createdAt || Date.now(),
    updatedAt: Date.now()
  };
  await ref.set(payload);
  return res.status(200).json({ ok: true, message: 'Respuesta registrada. Puedes modificarla si cambia la situación familiar.' });
}

async function handleAdminList(req, res) {
  await verifyAdmin(req);
  ensureFirebase();
  const snap = await admin.database().ref(RESPONSE_PATH).once('value');
  const responses = snap.val() || {};
  const course = String((req.query && req.query.course) || '').toUpperCase();
  const rows = (await getRoster())
    .filter(student => !course || student.course === course)
    .map(student => {
      const value = responses[cleanRut(student.rut)] || null;
      return {
        ...publicStudent(student),
        status: value ? 'respondido' : 'pendiente',
        attendance: value && value.attendance || '',
        returnPlan: value && value.returnPlan || '',
        canLeaveFromMuvix: value ? value.canLeaveFromMuvix === true : null,
        needsReturnAlternative: value ? value.needsReturnAlternative === true : null,
        guardianConfirmed: value ? value.guardianConfirmed === true : false,
        guardianName: value && value.guardianName || '',
        guardianPhone: value && value.guardianPhone || '',
        notes: value && value.notes || '',
        updatedAt: value && value.updatedAt || null
      };
    });
  return res.status(200).json({ ok: true, event: { date: 'viernes 07 de agosto de 2026', venue: 'Cine Muvix', movie: 'La Odisea' }, rows });
}

async function handleAdminReset(req, res) {
  await verifyAdmin(req);
  const student = await findStudent(req.query && req.query.rut);
  if (!student) return res.status(404).json({ error: 'RUT no encontrado.' });
  ensureFirebase();
  await admin.database().ref(`${RESPONSE_PATH}/${cleanRut(student.rut)}`).remove();
  return res.status(200).json({ ok: true });
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const action = String((req.query && req.query.action) || 'student');
    if (action === 'student' && req.method === 'GET') {
      ensureFirebase();
      if (initError) throw new Error(initError);
      return await handleStudent(req, res);
    }
    if (action === 'submit' && req.method === 'POST') return await handleSubmit(req, res);
    if (action === 'admin-list' && req.method === 'GET') return await handleAdminList(req, res);
    if (action === 'admin-reset' && req.method === 'POST') return await handleAdminReset(req, res);
    return res.status(405).json({ error: 'Método o acción no disponible.' });
  } catch (error) {
    console.error('[salida-muvix]', error);
    const status = /no autorizado|token requerido/i.test(error.message) ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? 'No autorizado.' : 'No se pudo procesar la solicitud.' });
  }
};
