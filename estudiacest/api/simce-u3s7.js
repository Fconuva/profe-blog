const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';
const SESSION = 'sesion-u3-7';
const ALLOWED_COURSES = new Set(['2A-HC', '2B-HC']);
const ANSWER_KEY = {
  q1:'B',q2:'D',q3:'A',q4:'C',q5:'B',q6:'D',
  q7:'A',q8:'C',q9:'B',q10:'D',q11:'A',q12:'C',
  q13:'D',q14:'B',q15:'C',q16:'A',q17:'D',q18:'B',
  q19:'C',q20:'A',q21:'D',q22:'B',q23:'C',q24:'A',
  q25:'B',q26:'D',q27:'A',q28:'C',q29:'B',q30:'A',q31:'D',
  q32:'C',q33:'A',q34:'B',q35:'D',q36:'C',q37:'B',q38:'A',
  q39:'D',q40:'C',q41:'A',q42:'B',q43:'D',q44:'C',
  q45:'B',q46:'A',q47:'D',q48:'C',q49:'B',q50:'A'
};
const SKILLS = {
  q1:'INTERPRETAR',q2:'REFLEXIONAR',q3:'INTERPRETAR',q4:'INTERPRETAR',q5:'LOCALIZAR',q6:'REFLEXIONAR',
  q7:'INTERPRETAR',q8:'REFLEXIONAR',q9:'INTERPRETAR',q10:'INTERPRETAR',q11:'LOCALIZAR',q12:'REFLEXIONAR',
  q13:'INTERPRETAR',q14:'INTERPRETAR',q15:'INTERPRETAR',q16:'LOCALIZAR',q17:'REFLEXIONAR',q18:'INTERPRETAR',
  q19:'INTERPRETAR',q20:'LOCALIZAR',q21:'INTERPRETAR',q22:'REFLEXIONAR',q23:'INTERPRETAR',q24:'REFLEXIONAR',
  q25:'INTERPRETAR',q26:'REFLEXIONAR',q27:'INTERPRETAR',q28:'INTERPRETAR',q29:'LOCALIZAR',q30:'REFLEXIONAR',q31:'INTERPRETAR',
  q32:'INTERPRETAR',q33:'LOCALIZAR',q34:'INTERPRETAR',q35:'INTERPRETAR',q36:'REFLEXIONAR',q37:'INTERPRETAR',q38:'REFLEXIONAR',
  q39:'INTERPRETAR',q40:'REFLEXIONAR',q41:'LOCALIZAR',q42:'INTERPRETAR',q43:'INTERPRETAR',q44:'REFLEXIONAR',
  q45:'INTERPRETAR',q46:'INTERPRETAR',q47:'LOCALIZAR',q48:'INTERPRETAR',q49:'INTERPRETAR',q50:'REFLEXIONAR'
};
const OPEN_MIN = { o1:180, o2:220 };
const META_MIN = { m1:25, m2:25, m3:25 };

let initError = null;
function normalizePrivateKey(raw) {
  let key = String(raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}
function ensureFirebase() {
  if (admin.apps.length) return;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) { initError = 'Firebase no configurado'; return; }
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
    });
  } catch (error) { initError = error.message; }
}
function setCors(req, res) {
  const origin = String(req.headers.origin || '');
  const allowed = new Set(['https://estudiacest.com','https://www.estudiacest.com','http://localhost:3000','http://127.0.0.1:3000','http://localhost:4173','http://127.0.0.1:4173']);
  res.setHeader('Access-Control-Allow-Origin', allowed.has(origin) ? origin : 'https://www.estudiacest.com');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}
function bodyOf(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}
function cleanText(value, max) { return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max); }
function cleanAnswers(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const output = {};
  Object.keys(ANSWER_KEY).forEach(id => {
    const value = String(source[id] || '').toUpperCase();
    if (['A','B','C','D'].includes(value)) output[id] = value;
  });
  return output;
}
function cleanTexts(raw, schema, max) {
  const source = raw && typeof raw === 'object' ? raw : {};
  return Object.fromEntries(Object.keys(schema).map(id => [id, cleanText(source[id], max)]));
}
function cleanConcepts(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const output = {};
  for (let i = 1; i <= 8; i += 1) {
    const id = `c${i}`;
    const value = Number(source[id]);
    if (Number.isInteger(value) && value >= 0 && value <= 3) output[id] = value;
  }
  return output;
}
function submissionError(payload) {
  const missing = Object.keys(ANSWER_KEY).filter(id => !payload.answers[id]);
  if (missing.length) return `Faltan ${missing.length} alternativas por responder.`;
  for (const [id, minimum] of Object.entries(OPEN_MIN)) if ((payload.openResponses[id] || '').length < minimum) return `La respuesta ${id === 'o1' ? 'de evaluación' : 'comparativa'} necesita mayor desarrollo.`;
  for (const [id, minimum] of Object.entries(META_MIN)) if ((payload.metaResponses[id] || '').length < minimum) return 'Completa las tres preguntas de cierre con una idea explicada.';
  return '';
}
function scoreAnswers(answers) {
  let score = 0;
  const bySkill = {};
  Object.entries(ANSWER_KEY).forEach(([id, key]) => {
    const skill = SKILLS[id];
    if (!bySkill[skill]) bySkill[skill] = { score:0, total:0 };
    bySkill[skill].total += 1;
    if (answers[id] === key) { score += 1; bySkill[skill].score += 1; }
  });
  return { score, total:Object.keys(ANSWER_KEY).length, bySkill };
}
function safeAttempt(value) {
  if (!value) return null;
  return {
    answers: cleanAnswers(value.answers),
    openResponses: cleanTexts(value.openResponses, OPEN_MIN, 2400),
    metaResponses: cleanTexts(value.metaResponses, META_MIN, 800),
    concepts: cleanConcepts(value.concepts),
    submitted: value.submitted === true,
    completada: value.completada === true,
    updatedAt: Number(value.updatedAt || 0),
    submittedAt: Number(value.submittedAt || 0)
  };
}
async function authenticate(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) { const error = new Error('Inicia sesión para continuar.'); error.status = 401; throw error; }
  const decoded = await admin.auth().verifyIdToken(token);
  const snap = await admin.database().ref(`${BASE}/estudiantes/${decoded.uid}`).once('value');
  const student = snap.val();
  if (!student || !ALLOWED_COURSES.has(student.curso)) { const error = new Error('Esta clase no está asignada a tu curso.'); error.status = 403; throw error; }
  return { uid:decoded.uid, student };
}
async function accessState(uid) {
  const db = admin.database();
  const [sessionSnap, exceptionSnap] = await Promise.all([
    db.ref(`${BASE}/sesiones/${SESSION}`).once('value'),
    db.ref(`${BASE}/sesiones/${SESSION}/excepciones_desbloqueo/${uid}`).once('value')
  ]);
  const session = sessionSnap.val() || {};
  return {
    active: session.activa !== false || exceptionSnap.val() === true,
    released: session.resultados_visibles === true,
    title: session.titulo || 'Unidad 3 · Clase 7 — El discurso'
  };
}

module.exports = async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  ensureFirebase();
  if (initError) return res.status(500).json({ error:'No fue posible conectar con la plataforma.' });
  try {
    const { uid, student } = await authenticate(req);
    const access = await accessState(uid);
    const action = String(req.query.action || bodyOf(req).action || 'get-guia-state');
    const responseRef = admin.database().ref(`${BASE}/respuestas/${SESSION}/${uid}`);

    if (req.method === 'GET' && action === 'get-guia-state') {
      const [snap, resultSnap] = await Promise.all([
        responseRef.once('value'),
        admin.database().ref(`${BASE}/resultados/${SESSION}/${uid}`).once('value')
      ]);
      const safe = safeAttempt(snap.val());
      const result = resultSnap.val();
      const scoreSummary = safe && safe.completada === true && result
        ? { score:Number(result.score || 0), total:Number(result.total || Object.keys(ANSWER_KEY).length), porcentaje:Number(result.porcentaje || 0) }
        : null;
      return res.status(200).json({ ok:true, session:access, student:{ nombre:student.nombre || 'Estudiante', curso:student.curso }, attempt:safe, result:scoreSummary });
    }
    if (req.method !== 'POST') return res.status(405).json({ error:'Método no permitido.' });
    if (!access.active) return res.status(423).json({ error:'La clase está cerrada. Si faltaste con justificación, solicita una habilitación individual.' });

    const currentSnap = await responseRef.once('value');
    const current = currentSnap.val();
    if (current && current.completada === true) return res.status(409).json({ error:'Esta clase ya fue entregada.', completada:true });
    const request = bodyOf(req);
    const payload = {
      answers: cleanAnswers(request.answers),
      openResponses: cleanTexts(request.openResponses, OPEN_MIN, 2400),
      metaResponses: cleanTexts(request.metaResponses, META_MIN, 800),
      concepts: cleanConcepts(request.concepts)
    };
    const now = Date.now();

    if (action === 'save-draft') {
      await responseRef.set({
        ...payload,
        nombre: cleanText(student.nombre, 140), curso:student.curso,
        submitted:false, completada:false, updatedAt:now,
        submittedAt:null, completadaAt:null, score:null, total:Object.keys(ANSWER_KEY).length
      });
      return res.status(200).json({ ok:true, updatedAt:now });
    }
    if (action !== 'submit') return res.status(400).json({ error:'Acción desconocida.' });
    const invalid = submissionError(payload);
    if (invalid) return res.status(400).json({ error:invalid });
    const result = scoreAnswers(payload.answers);
    const rootUpdates = {};
    rootUpdates[`${BASE}/respuestas/${SESSION}/${uid}`] = {
      ...payload,
      nombre:cleanText(student.nombre, 140), curso:student.curso,
      submitted:true, completada:true, updatedAt:now, submittedAt:now, completadaAt:now,
      score:null, total:result.total
    };
    rootUpdates[`${BASE}/resultados/${SESSION}/${uid}`] = {
      nombre:cleanText(student.nombre, 140), curso:student.curso,
      score:result.score, total:result.total, porcentaje:Math.round((result.score / result.total) * 100),
      bySkill:result.bySkill, openResponses:payload.openResponses,
      submitted:true, completada:true, updatedAt:now, submittedAt:now, completadaAt:now
    };
    await admin.database().ref().update(rootUpdates);
    return res.status(200).json({ ok:true, completada:true, result:{ score:result.score, total:result.total, porcentaje:Math.round((result.score / result.total) * 100) } });
  } catch (error) {
    const status = Number(error.status || (error.code && String(error.code).startsWith('auth/') ? 401 : 500));
    return res.status(status).json({ error:status === 500 ? 'No fue posible guardar. Tu avance permanece en pantalla; vuelve a intentarlo.' : error.message });
  }
};
