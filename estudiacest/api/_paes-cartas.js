'use strict';
const CATALOG = require('./_paes-cartas-catalog');
// Este nodo carece de acceso RTDB desde el navegador: claves y puntajes privados.
const BASE = 'plataforma_paes/cartas_intentos';
const CONFIG = 'plataforma_paes/cartas_config';
const COURSES = new Set(['3AHC', '3BHC', '4AHC', '4BHC']);
const clean = v => String(v || '').replace(/[^0-9A-Z]/gi, '').toUpperCase();
const error = (status, message) => Object.assign(new Error(message), { status });
const safeId = s => typeof s === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(s);
const delivered = r => !!r && r.submitted === true && r.completada === true;

async function identity(req, db, auth) {
  const token = String(req.headers?.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw error(401, 'Ingresa con tu cuenta de Estudia CEST.');
  let decoded;
  try { decoded = await auth.verifyIdToken(token); } catch (_) { throw error(401, 'Vuelve a ingresar con tu cuenta.'); }
  const profile = (await db.ref(`plataforma_estudiantes/estudiantes/${decoded.uid}`).once('value')).val();
  if (!profile || profile.activo === false) throw error(403, 'Esta cuenta no tiene acceso a la actividad PAES.');
  const course = clean(profile.curso);
  const grant = (await db.ref(`${CONFIG}/revisores/${decoded.uid}`).once('value')).val();
  const reviewer = grant?.enabled === true && clean(grant.curso) === course && /^[1-4][A-Z]HC$/.test(course);
  if (!COURSES.has(course) && !reviewer) throw error(403, 'Esta cuenta no tiene acceso a la actividad PAES.');
  const guided = clean(profile.rut) === '229327739';
  return { uid: decoded.uid, curso: course.replace(/^(\d)([A-Z])HC$/, '$1$2-HC'), nombre: String(profile.nombre || profile.name || '').slice(0,120), reviewer, guided, sessionId: CATALOG.SESSION + (guided ? '-guiada' : '') };
}
function validate(input, guided, final) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw error(400, 'Datos no válidos.');
  const questions = CATALOG.questionsFor(guided);
  const allowed = new Set(questions.map(q => q.id));
  const answers = {};
  for (const [id, value] of Object.entries(input.answers || {})) {
    if (!allowed.has(id) || !['A','B','C','D'].includes(value)) throw error(400, 'Respuesta no válida.');
    answers[id] = value;
  }
  const evidence = {}, decisions = {};
  for (const m of CATALOG.missions) {
    const d = input.decisions?.[m.id];
    if (d !== undefined) { if (!Number.isInteger(d) || d < 0 || d > 3) throw error(400, 'Decisión no válida.'); decisions[m.id] = d; }
    evidence[m.id] = String(input.evidence?.[m.id] || '').trim().slice(0,2500);
  }
  const reflection = {};
  for (const id of ['comprendi','evidencia','mejorare']) reflection[id] = String(input.reflection?.[id] || '').trim().slice(0,2500);
  const missing = questions.filter(q => !answers[q.id]).map(q => q.id);
  for (const m of CATALOG.missions) {
    if (decisions[m.id] === undefined) missing.push(`decision-${m.id}`);
    if (!guided && evidence[m.id].length < 12) missing.push(`evidence-${m.id}`);
  }
  for (const id of Object.keys(reflection)) if (reflection[id].length < (guided ? 3 : 12)) missing.push(id);
  if (final && missing.length) throw Object.assign(error(400, 'Completa las respuestas y el cierre antes de entregar.'), { missing });
  const duelCode=String(input.duel?.code||'').toUpperCase();
  if(duelCode&&!/^[A-HJ-NP-Z2-9]{6}$/.test(duelCode))throw error(400,'Sala no válida.');
  return { answers, decisions, evidence, reflection, duel:duelCode?{code:duelCode}:{} };
}
async function released(db, ident) {
  const conf = (await db.ref(CONFIG + '/publicacion').once('value')).val() || {};
  return conf.cursos?.[ident.curso] === true || conf.estudiantes?.[ident.uid] === true;
}
async function publicAttempt(db, raw, ident) {
  if (!raw) return null;
  const { answers, decisions, evidence, reflection, duel, submitted, completada, submittedAt, completadaAt, updatedAt, startedAt, sessionId } = raw;
  const result = { answers: answers || {}, decisions: decisions || {}, evidence: evidence || {}, reflection: reflection || {},duel:duel||{}, submitted: submitted === true, completada: completada === true, submittedAt: submittedAt || null, completadaAt: completadaAt || null, updatedAt, startedAt, sessionId };
  if (delivered(raw) && await released(db, ident)) {
    result.result = CATALOG.grade(answers || {}, ident.guided);
    result.review = CATALOG.questionsFor(ident.guided).map(q => ({id:q.id,key:q.key,reason:q.reason,skill:q.skill,evidence:q.evidence,failures:q.failures}));
  }
  return result;
}
async function handle(action, req, res, { db, auth, adminUid }) {
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    if (action === 'cards-preview') return res.status(200).json({success:true,activity:CATALOG.publicActivity(false)});
    if (action.startsWith('admin-cards-')) {
      if (!adminUid) throw error(403, 'No autorizado.');
      if (action === 'admin-cards-list') {
        const rows = [];
        for (const sessionId of [CATALOG.SESSION, CATALOG.SESSION + '-guiada']) {
          const data = (await db.ref(`${BASE}/${sessionId}`).once('value')).val() || {};
          for (const [uid,r] of Object.entries(data)) rows.push({ uid, sessionId, ...r });
        }
        const publication = (await db.ref(CONFIG + '/publicacion').once('value')).val() || {};
        const sourceRooms=(await db.ref(require('./_paes-cartas-duel').BASE).once('value')).val()||{};
        const rooms=Object.values(sourceRooms).map(raw=>{const r=require('./_paes-cartas-duel').hydrate(raw);return {code:r.code,curso:r.curso,phase:r.phase,turn:r.turn,winner:r.winner||null,players:Object.values(r.players).map(p=>({uid:p.uid,name:p.name,archetype:p.archetype,actions:p.actions})),pacts:r.pacts};});
        return res.status(200).json({ success:true, rows, rooms, publication, regular: CATALOG.publicActivity(false), guided: CATALOG.publicActivity(true), keys: { regular: CATALOG.questionsFor(false), guided: CATALOG.questionsFor(true) } });
      }
      if (req.method !== 'POST') throw error(405, 'Usa POST para modificar la actividad.');
      const input = req.body || {};
      if (action === 'admin-cards-release') {
        const course = String(input.curso || '');
        if (!COURSES.has(clean(course)) || typeof input.published !== 'boolean') throw error(400, 'Curso o publicación no válidos.');
        await db.ref(`${CONFIG}/publicacion/cursos/${clean(course).replace(/^(\d)([A-Z])HC$/, '$1$2-HC')}`).set(input.published);
        return res.status(200).json({ success:true });
      }
      if (action === 'admin-cards-reset') {
        const { uid,sessionId } = input;
        if (!safeId(uid) || ![CATALOG.SESSION,CATALOG.SESSION+'-guiada'].includes(sessionId)) throw error(400, 'Intento no válido.');
        const ref = db.ref(`${BASE}/${sessionId}/${uid}`);
        const now = Date.now();
        const tx = await ref.transaction(current => current === null ? null : current && !current.resetAt ? {sessionId,uid,curso:current.curso,nombre:current.nombre,resetAt:now,resetBy:adminUid,archivedAttempt:current} : undefined, undefined, false);
        if (tx.committed && tx.snapshot.val()) await db.ref(`plataforma_paes/cartas_archivo/${sessionId}/${uid}/${now}`).set(tx.snapshot.val());
        if (!tx.snapshot.val()) throw error(404, 'No existe un intento para reabrir.');
        return res.status(200).json({ success:true });
      }
      throw error(400, 'Acción no válida.');
    }
    const ident = await identity(req, db, auth);
    if(action.startsWith('cards-room-'))return await require('./_paes-cartas-duel').handle(action,req,res,{db,ident});
    const ref = db.ref(`${BASE}/${ident.sessionId}/${ident.uid}`);
    if (action === 'cards-state') {
      const requested = req.query?.mode === 'guided';
      if (requested !== ident.guided) return res.status(200).json({ success:true, redirect:ident.guided ? '/paes/cartas/guiada.html' : '/paes/cartas/' });
      const raw = (await ref.once('value')).val();
      const attempt = raw?.resetAt ? null : await publicAttempt(db,raw,ident);
      return res.status(200).json({ success:true, identity:{uid:ident.uid,curso:ident.curso,nombre:ident.nombre,reviewer:ident.reviewer}, activity:CATALOG.publicActivity(ident.guided), resetAt:raw?.resetAt || raw?.resetAtAcknowledged || null, attempt });
    }
    if (!['cards-save','cards-submit'].includes(action)) throw error(400, 'Acción no válida.');
    if (req.method !== 'POST') throw error(405, 'Usa POST para guardar.');
    if (req.body?.version !== CATALOG.VERSION) throw error(409, 'Recarga la actividad para usar la versión vigente.');
    const final = action === 'cards-submit';
    const data = validate(req.body,ident.guided,final);
    const now = Date.now();
    let done = false;
    const tx = await ref.transaction(current => {
      if (delivered(current)) { done = true; return; }
      if (current === null && req.body.resetAt) return null;
      if ((current?.resetAt || current?.resetAtAcknowledged || null) !== (req.body.resetAt || null)) return;
      const payload = { ...ident, ...data, version:CATALOG.VERSION, variant:ident.guided?'guided-access-2026':'regular', startedAt:current?.startedAt || now, updatedAt:now, submitted:final, completada:final };
      if (current?.resetAt || current?.resetAtAcknowledged) { payload.resetAtAcknowledged=current.resetAt || current.resetAtAcknowledged; }
      if (final) Object.assign(payload,{ submitted:true,completada:true,submittedAt:now,completadaAt:now,...CATALOG.grade(data.answers,ident.guided) });
      return payload;
    }, undefined, false);
    if (!tx.committed) return res.status(409).json({ error:done?'Tu actividad ya está entregada.':'El intento cambió. Recarga para recuperar su estado.', alreadySubmitted:done });
    const stored = (await ref.once('value')).val();
    if (!stored) throw error(409, 'El intento cambió. Recarga para recuperar su estado.');
    const attempt = await publicAttempt(db,stored,ident);
    return res.status(200).json({ success:true, attempt });
  } catch (e) { return res.status(e.status || 500).json({ error:e.status ? e.message : 'No se pudo guardar. Conserva tu avance e inténtalo nuevamente.', ...(e.missing?{missing:e.missing}:{}) }); }
}
module.exports = { handle, validate, identity, delivered, publicAttempt, BASE, CONFIG };
