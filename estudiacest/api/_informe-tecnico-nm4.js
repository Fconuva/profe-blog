// Informe técnico de la Clase 6 de NM4 (Unidad 3): ingreso con RUN, borrador y
// entrega. No es una función propia de Vercel (el plan Hobby admite 12): la
// sirve api/economista.js cuando llega ?modulo=informe-tecnico.
//
// Acciones (todas POST salvo admin-list):
//   get-guia-state  { rut }            -> estudiante + intento guardado
//   save            { rut, answers }   -> borrador
//   submit          { rut, answers }   -> entrega final, escritura única
//   admin-list      GET, Bearer token  -> nómina con estado (solo admins)
//   admin-reset     { curso, n }, token -> reabre un intento (solo admins)
//
// El RUN nunca viaja en la URL ni se guarda: se compara como hash contra
// _roster_nm4_informe.js y el registro se identifica por curso + número de lista.

const crypto = require('crypto');
const CAMPOS = require('../nm4/u3-clase6-informe-tecnico/informe/campos.js');
const { SALT, ROWS } = require('./_roster_nm4_informe.js');

const BASE = 'plataforma_nm4/informe_tecnico_2026';
const ADMINS = 'plataforma_estudiantes/admins';
const ROSTER = ROWS.map(([hash, curso, n, nombre]) => ({ hash, curso, n, nombre }));
const BY_HASH = new Map(ROSTER.map(student => [student.hash, student]));

const cleanRut = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
const hashRut = value => crypto.createHash('sha256').update(SALT + cleanRut(value)).digest('hex').slice(0, 24);

function findStudent(rut) {
  const clean = cleanRut(rut);
  if (clean.length < 7) return null;
  return BY_HASH.get(hashRut(clean)) || null;
}

function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

const publicStudent = student => ({ nombre: student.nombre, curso: student.curso, n: student.n });
const refFor = (db, student) => db.ref(`${BASE}/${student.curso}/${student.n}`);

function publicAttempt(value) {
  if (!value) return null;
  return {
    answers: CAMPOS.sanitize(value.answers),
    status: value.status === 'submitted' ? 'submitted' : 'draft',
    submitted: value.submitted === true,
    completada: value.completada === true,
    score: Number(value.score || 0),
    total: Number(value.total || CAMPOS.questions.length),
    updatedAt: Number(value.updatedAt || 0),
    submittedAt: Number(value.submittedAt || 0)
  };
}

async function handleState(req, res, db) {
  const student = findStudent(body(req).rut);
  if (!student) return res.status(404).json({ error: 'Ese RUT no está en las nóminas de 4° medio. Revísalo o avisa al profesor.' });
  const snap = await refFor(db, student).once('value');
  return res.status(200).json({ ok: true, student: publicStudent(student), attempt: publicAttempt(snap.val()) });
}

async function handleSave(req, res, db, submit) {
  const input = body(req);
  const student = findStudent(input.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina de esta actividad.' });
  const answers = CAMPOS.sanitize(input.answers);
  const { score, total } = CAMPOS.progress(answers);
  const now = Date.now();
  let locked = false;

  // Transacción: una entrega confirmada no se sobrescribe con un borrador tardío.
  const result = await refFor(db, student).transaction(current => {
    if (current && (current.completada === true || current.submitted === true)) {
      locked = true;
      return;
    }
    const record = {
      sessionId: CAMPOS.activity.sessionId,
      curso: student.curso,
      n: student.n,
      nombre: student.nombre,
      answers,
      score,
      total,
      status: submit ? 'submitted' : 'draft',
      submitted: submit,
      completada: submit,
      createdAt: current && current.createdAt ? current.createdAt : now,
      updatedAt: now,
      saves: Number((current && current.saves) || 0) + 1
    };
    if (submit) {
      record.submittedAt = now;
      record.completadaAt = now;
    }
    return record;
  }, undefined, false);

  if (!result.committed && locked) {
    return res.status(409).json({ error: 'El informe ya fue entregado.', attempt: publicAttempt(result.snapshot.val()) });
  }
  // Se relee desde la base antes de responder: el cliente confirma con esto.
  const snap = await refFor(db, student).once('value');
  return res.status(200).json({ ok: true, attempt: publicAttempt(snap.val()) });
}

async function verifyAdmin(req, admin, db) {
  const token = String((req.headers && req.headers.authorization) || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw Object.assign(new Error('Token requerido'), { status: 401 });
  const decoded = await admin.auth().verifyIdToken(token);
  const snap = await db.ref(`${ADMINS}/${decoded.uid}`).once('value');
  if (snap.val() !== true) throw Object.assign(new Error('No autorizado'), { status: 403 });
  return decoded;
}

async function handleAdminList(req, res, admin, db) {
  await verifyAdmin(req, admin, db);
  const curso = String((req.query && req.query.curso) || '').toUpperCase();
  const snap = await db.ref(BASE).once('value');
  const data = snap.val() || {};
  const rows = ROSTER
    .filter(student => !curso || student.curso === curso)
    .map(student => {
      const attempt = publicAttempt(data[student.curso] && data[student.curso][student.n]);
      return { ...publicStudent(student), attempt };
    });
  return res.status(200).json({ ok: true, total: CAMPOS.questions.length, rows });
}

async function handleAdminReset(req, res, admin, db) {
  await verifyAdmin(req, admin, db);
  const input = body(req);
  const student = ROSTER.find(item => item.curso === String(input.curso || '').toUpperCase() && item.n === Number(input.n));
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  // Reabrir conserva las respuestas: solo quita la marca de entrega.
  await refFor(db, student).update({ status: 'draft', submitted: false, completada: false, reopenedAt: Date.now() });
  const snap = await refFor(db, student).once('value');
  return res.status(200).json({ ok: true, attempt: publicAttempt(snap.val()) });
}

module.exports = async function informeTecnico(req, res, { admin, db }) {
  res.setHeader('Cache-Control', 'no-store');
  const action = String((req.query && req.query.action) || '');
  try {
    if (action === 'health') return res.status(200).json({ ok: true, activity: CAMPOS.activity.sessionId, roster: ROSTER.length, campos: CAMPOS.questions.length });
    if (action === 'admin-list' && req.method === 'GET') return await handleAdminList(req, res, admin, db);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no disponible.' });
    if (action === 'get-guia-state') return await handleState(req, res, db);
    if (action === 'save') return await handleSave(req, res, db, false);
    if (action === 'submit') return await handleSave(req, res, db, true);
    if (action === 'admin-reset') return await handleAdminReset(req, res, admin, db);
    return res.status(400).json({ error: 'Acción no reconocida.' });
  } catch (error) {
    const status = error.status || (/token|auth/i.test(error.code || error.message) ? 401 : 500);
    console.error('[informe-tecnico]', action, error.message);
    return res.status(status).json({ error: status === 500 ? 'No se pudo procesar la solicitud.' : 'No autorizado.' });
  }
};
