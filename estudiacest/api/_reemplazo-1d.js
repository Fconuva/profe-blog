'use strict';
const crypto = require('node:crypto');
const SESSION = 'reemplazo-1d-amor-20261027';
const BASE = 'plataforma_estudiantes/actividades_publicas/' + SESSION;
const QUESTIONS = ['recibir', 'ayudar', 'comprender', 'indiferencia', 'actitud', 'accion', 'compromiso'];
const CASES = ['curso', 'familia', 'comunidad'];
const fail = (status, message) => Object.assign(new Error(message), { status });
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function owns(record, uid, tokenHash) {
  return Boolean(record && record.uid === uid && record.sessionId === SESSION && record.course === '1D' &&
    typeof record.tokenHash === 'string' && /^[a-f0-9]{64}$/.test(record.tokenHash) &&
    crypto.timingSafeEqual(Buffer.from(record.tokenHash, 'hex'), Buffer.from(tokenHash, 'hex')));
}
function publicRecord(record) {
  const { tokenHash, ...safe } = record;
  return { ...safe, answers: record.answers || {}, score: null, total: QUESTIONS.length };
}
function content(body, final) {
  const fullName = typeof body.fullName === 'string' ? body.fullName.normalize('NFC').trim().replace(/\s+/g, ' ') : '';
  if (fullName.length < 5 || fullName.length > 120 || fullName.split(' ').length < 2 || !/^[\p{L}\p{M} .’'\-]+$/u.test(fullName)) {
    throw fail(400, 'Escribe tu nombre completo, con nombres y apellidos.');
  }
  const caseId = body.caseId || '';
  if (caseId && !CASES.includes(caseId)) throw fail(400, 'Elige una de las situaciones de la actividad.');
  const answers = {};
  for (const id of QUESTIONS) {
    const value = body.answers?.[id] ?? '';
    if (typeof value !== 'string' || value.length > 2000) throw fail(400, 'Cada respuesta admite hasta 2000 caracteres.');
    answers[id] = value.trim();
  }
  if (final && (!caseId || QUESTIONS.some(id => !answers[id]))) throw fail(400, 'Elige una situación y responde las siete preguntas antes de entregar.');
  return { fullName, caseId, answers, answered: QUESTIONS.filter(id => answers[id]).length, total: QUESTIONS.length };
}
async function manejar(req, res, action, db, auth) {
  try {
    if (action === '1d-admin-list') {
      if (req.method !== 'GET') throw fail(405, 'Método no permitido.');
      const bearer = String(req.headers.authorization || '').replace(/^Bearer /, '');
      if (!bearer) throw fail(401, 'Inicia sesión como docente.');
      let decoded;
      try { decoded = await auth.verifyIdToken(bearer, true); } catch (_) { throw fail(401, 'Vuelve a iniciar sesión como docente.'); }
      if ((await db.ref('plataforma_estudiantes/admins/' + decoded.uid).once('value')).val() !== true) throw fail(403, 'Acceso exclusivo para administración.');
      const records = (await db.ref(BASE).once('value')).val() || {};
      const rows = Object.values(records).filter(r => r.sessionId === SESSION && r.course === '1D').map(publicRecord);
      return res.status(200).json({ sessionId: SESSION, rows });
    }
    if (!['1d-start', '1d-state', '1d-save', '1d-submit'].includes(action)) throw fail(400, 'Acción no válida.');
    if (req.method !== (action === '1d-state' ? 'GET' : 'POST')) throw fail(405, 'Método no permitido.');
    const body = req.body || {};
    const uid = req.method === 'GET' ? req.query.uid : body.uid;
    const token = String(req.headers.authorization || '').replace(/^Bearer /, '');
    if (!/^[a-f0-9-]{36}$/i.test(uid || '') || !/^[a-f0-9]{64}$/i.test(token)) throw fail(401, 'No se pudo reconocer esta actividad. Vuelve a comenzar desde 1D.');
    const tokenHash = hash(token), responseRef = db.ref(BASE + '/' + uid);
    if (action === '1d-state') {
      const record = (await responseRef.once('value')).val();
      if (!record) throw fail(404, 'Todavía no se ha iniciado esta actividad.');
      if (!owns(record, uid, tokenHash)) throw fail(403, 'No puedes acceder a esta entrega.');
      return res.status(200).json({ attempt: publicRecord(record) });
    }
    const final = action === '1d-submit';
    const payload = content(body, final), now = Date.now();
    let rejection;
    const result = await responseRef.transaction(current => {
      rejection = null;
      if (action === '1d-start') {
        if (current) {
          if (!owns(current, uid, tokenHash)) { rejection = fail(403, 'No puedes acceder a esta entrega.'); return; }
          return current;
        }
        return { ...payload, uid, tokenHash, sessionId: SESSION, course: '1D', version: 1,
          submitted: false, completada: false, startedAt: now, updatedAt: now, evaluationStatus: 'pending' };
      }
      // El SDK puede invocar primero con caché fría (null). Devolver null permite
      // contrastar con el servidor y reintentar con el dato real; abortar aquí
      // rechazaría borradores existentes en una instancia recién iniciada.
      if (current === null) return null;
      if (!owns(current, uid, tokenHash)) { rejection = fail(403, 'No se pudo reconocer esta entrega.'); return; }
      if (current.submitted === true || current.completada === true) {
        if (final && current.submitted === true && current.completada === true) return current;
        rejection = fail(409, 'La actividad ya fue entregada.'); return;
      }
      return { ...current, ...payload, updatedAt: now, ...(final ? {
        submitted: true, completada: true, submittedAt: now, completadaAt: now,
        score: null, evaluationStatus: 'pending'
      } : {}) };
    });
    if (!result.committed) throw rejection || fail(409, 'Actualiza la actividad y vuelve a intentarlo.');
    if (!result.snapshot.val()) throw fail(404, 'Todavía no se ha iniciado esta actividad.');
    return res.status(200).json({ attempt: publicRecord(result.snapshot.val()) });
  } catch (error) {
    if (!error.status) console.error('[1d] No se pudo completar la operación:', error.code || 'internal');
    return res.status(error.status || 500).json({ error: error.status ? error.message : 'No se pudo guardar. Conserva esta pestaña y vuelve a intentarlo.' });
  }
}
module.exports = { manejar, SESSION, BASE, QUESTIONS };
