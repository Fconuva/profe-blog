require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
  });
}
const db = admin.database();
const targetNames = [
  'BERMUDEZ BALZA LUIS SANTIAGO',
  'FAUNDEZ MUÑOZ MAXIMILIANO GABRIEL',
  'LOBOS FUENTES JUAN SEBASTIAN',
  'MORALES CAMPOS ALONSO ESTEBAN',
  'SAN MARTIN RUDOLPH FELIPE ALDOLFO'
];
const sessions = [
  'maus-nm4-2026',
  'maus-nm4-intermedia-2026',
  'maus-nm4-dil-2026',
  'maus-nm4-jose-tomas-calderon-pie-2026',
  'maus-nm4-brayan-contreras-pie-2026'
];
function normalizeName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}
(async () => {
  const [studentsSnap, respSnap, resSnap] = await Promise.all([
    db.ref('plataforma_estudiantes/estudiantes').once('value'),
    db.ref('plataforma_lecturas/respuestas').once('value'),
    db.ref('plataforma_lecturas/resultados').once('value')
  ]);
  const students = studentsSnap.val() || {};
  const responses = respSnap.val() || {};
  const results = resSnap.val() || {};
  const byName = new Map(Object.entries(students).map(([uid, s]) => [normalizeName(s.nombre), { uid, ...s }]));
  for (const name of targetNames) {
    const student = byName.get(normalizeName(name));
    if (!student) {
      console.log(JSON.stringify({ nombre: name, found: false }, null, 2));
      continue;
    }
    const hits = [];
    for (const sid of sessions) {
      const resp = responses[sid] && responses[sid][student.uid];
      const res = results[sid] && results[sid][student.uid];
      if (!resp && !res) continue;
      hits.push({
        sid,
        submitted_at: resp && resp.submitted_at || res && res.submitted_at || null,
        last_save: resp && resp.last_save || null,
        answered_count: res && res.answered_count || null,
        total_items: res && res.total_items || null,
        puntaje: res && res.puntaje || null,
        total: res && res.total || null,
        manual_pendientes: res && res.manual_pendientes || null
      });
    }
    console.log(JSON.stringify({ nombre: student.nombre, rut: student.rut, curso: student.curso, uid: student.uid, hits }, null, 2));
  }
})();
