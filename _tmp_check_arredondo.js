require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
function normalizePrivateKey(raw) {
  let k = (raw || '').trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  if (k.includes('\\n')) k = k.replace(/\\n/g, '\n');
  const m = k.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (m) {
    const lines = m[1].match(/.{1,64}/g) || [];
    k = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return k;
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com',
  });
}
const db = admin.database();
function cleanRut(rut) { return String(rut || '').replace(/[.\s-]/g, '').toUpperCase(); }
function normalizeName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}
(async () => {
  const [studentsSnap, respSnap, resSnap] = await Promise.all([
    db.ref('plataforma_estudiantes/estudiantes').once('value'),
    db.ref('plataforma_lecturas/respuestas').once('value'),
    db.ref('plataforma_lecturas/resultados').once('value')
  ]);
  const allStudents = studentsSnap.val() || {};
  const responses = respSnap.val() || {};
  const results = resSnap.val() || {};
  const targetRut = '23261455-2';
  const targetName = 'ARREDONDO VALDES MATIAS JESUS';
  let student = null;
  for (const [uid, s] of Object.entries(allStudents)) {
    if (cleanRut(s.rut) === cleanRut(targetRut) || normalizeName(s.nombre) === normalizeName(targetName)) {
      student = { uid, nombre: s.nombre, rut: s.rut, curso: s.curso };
      break;
    }
  }
  if (!student) {
    console.log(JSON.stringify({ foundStudent: false }));
    return;
  }
  const activity = [];
  for (const [sid, users] of Object.entries(responses)) {
    const ans = users && users[student.uid];
    const res = (results[sid] || {})[student.uid];
    const answered = ans && ans.answers ? Object.values(ans.answers).filter(v => {
      if (typeof v === 'string') return v.trim() !== '';
      if (Array.isArray(v)) return v.length > 0;
      if (v && typeof v === 'object') return Object.keys(v).length > 0;
      return v != null;
    }).length : 0;
    if (ans || res) activity.push({ sid, hasAnswers: !!ans, answered, hasResult: !!res });
  }
  console.log(JSON.stringify({ foundStudent: true, student, activity }, null, 2));
})();
