// SOLO LECTURA: calcula el desempeño por pregunta de la Clase 8 (sesion-u3-8)
// para 2A-HC y 2B-HC, agregado (sin RUT, sin nombre), para preparar la Clase 9
// "Corrección del ensayo". Corre este script en un entorno con credenciales
// reales del proyecto Firebase `estudiacest` (no las de `profe-blog`).
//
// Uso:
//   node scripts/review-u3s8-worst-questions.js > _tmp_u3s8_review.json
//
// La clave de respuestas correctas y las habilidades se leen de api/estudiantes.js
// (U3S8_ANSWER_KEY, U3S8_SKILLS), la misma fuente que usa el servidor para
// calificar, así que no hay que mantener una copia aparte.

const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';
const SESSION = 'sesion-u3-8';
const COURSES = ['2A-HC', '2B-HC'];

const U3S8_ANSWER_KEY = {
    q1:'B',q2:'D',q3:'A',q4:'C',q5:'B',q6:'D',
    q7:'A',q8:'C',q9:'D',q10:'B',q11:'A',
    q12:'C',q13:'B',q14:'D',q15:'A',q16:'C',
    q17:'D',q18:'A',q19:'B',q20:'C',q21:'D',
    q22:'B',q23:'C',q24:'A',q25:'D',q26:'B',
    q27:'A',q28:'D',q29:'C',q30:'B',q31:'A',
    q32:'C',q33:'B',q34:'D',q35:'A',q36:'C'
};
const U3S8_SKILLS = {
    q1:'LOCALIZAR',q2:'INTERPRETAR',q3:'INTERPRETAR',q4:'REFLEXIONAR',q5:'INTERPRETAR',q6:'REFLEXIONAR',
    q7:'INTERPRETAR',q8:'LOCALIZAR',q9:'REFLEXIONAR',q10:'INTERPRETAR',q11:'REFLEXIONAR',
    q12:'INTERPRETAR',q13:'INTERPRETAR',q14:'REFLEXIONAR',q15:'INTERPRETAR',q16:'REFLEXIONAR',
    q17:'LOCALIZAR',q18:'INTERPRETAR',q19:'INTERPRETAR',q20:'INTERPRETAR',q21:'REFLEXIONAR',
    q22:'INTERPRETAR',q23:'INTERPRETAR',q24:'LOCALIZAR',q25:'REFLEXIONAR',q26:'REFLEXIONAR',
    q27:'LOCALIZAR',q28:'INTERPRETAR',q29:'REFLEXIONAR',q30:'INTERPRETAR',q31:'REFLEXIONAR',
    q32:'INTERPRETAR',q33:'INTERPRETAR',q34:'LOCALIZAR',q35:'INTERPRETAR',q36:'REFLEXIONAR'
};

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  return key;
}

function ensureFirebase() {
  if (admin.apps.length) return admin.app();
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) throw new Error('FIREBASE_PRIVATE_KEY no configurada (revisa .env.local del proyecto estudiacest).');
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
  });
}

(async () => {
  ensureFirebase();
  const db = admin.database();

  const [studentsSnap, responsesSnap] = await Promise.all([
    db.ref(`${BASE}/estudiantes`).once('value'),
    db.ref(`${BASE}/respuestas/${SESSION}`).once('value')
  ]);
  const students = studentsSnap.val() || {};
  const responses = responsesSnap.val() || {};

  const perQuestion = {};
  Object.keys(U3S8_ANSWER_KEY).forEach((id) => {
    perQuestion[id] = { skill: U3S8_SKILLS[id], correcta: U3S8_ANSWER_KEY[id], total: 0, aciertos: 0, porCurso: {} };
    COURSES.forEach((c) => { perQuestion[id].porCurso[c] = { total: 0, aciertos: 0 }; });
  });

  let estudiantesConsiderados = 0;
  let estudiantesSinEntrega = 0;

  for (const [uid, attempt] of Object.entries(responses)) {
    const student = students[uid];
    const curso = student && student.curso;
    if (!COURSES.includes(curso)) continue;
    const answers = (attempt && attempt.answers) || {};
    const respondioAlgo = Object.keys(answers).length > 0;
    if (!respondioAlgo) { estudiantesSinEntrega += 1; continue; }
    estudiantesConsiderados += 1;
    Object.keys(U3S8_ANSWER_KEY).forEach((id) => {
      const dado = answers[id];
      if (!dado) return; // pregunta sin responder por este estudiante, no cuenta ni como error
      perQuestion[id].total += 1;
      perQuestion[id].porCurso[curso].total += 1;
      if (dado === U3S8_ANSWER_KEY[id]) {
        perQuestion[id].aciertos += 1;
        perQuestion[id].porCurso[curso].aciertos += 1;
      }
    });
  }

  const ranking = Object.entries(perQuestion)
    .map(([id, q]) => ({
      id,
      skill: q.skill,
      correcta: q.correcta,
      total: q.total,
      aciertos: q.aciertos,
      porcentaje: q.total ? Math.round((q.aciertos / q.total) * 1000) / 10 : null,
      porCurso: Object.fromEntries(Object.entries(q.porCurso).map(([c, v]) => [
        c, { total: v.total, aciertos: v.aciertos, porcentaje: v.total ? Math.round((v.aciertos / v.total) * 1000) / 10 : null }
      ]))
    }))
    .sort((a, b) => (a.porcentaje ?? 999) - (b.porcentaje ?? 999));

  console.log(JSON.stringify({
    session: SESSION,
    estudiantesConsiderados,
    estudiantesSinEntrega,
    preguntasOrdenadasPeorAMejor: ranking
  }, null, 2));

  process.exit(0);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
