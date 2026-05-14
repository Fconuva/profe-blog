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
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
});
const db = admin.database();
function countAnsweredAnswers(answers) {
  return Object.values(answers || {}).filter(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') {
      if (typeof value.text === 'string') return value.text.trim() !== '';
      return Object.keys(value).length > 0;
    }
    return value != null;
  }).length;
}
(async () => {
  const uid = 'Vu1IrIkpYggtpTcsLkrZovURWIn2';
  const sid = 'maus-nm4-2026';
  const [respSnap, resSnap] = await Promise.all([
    db.ref('plataforma_lecturas/respuestas/' + sid + '/' + uid).once('value'),
    db.ref('plataforma_lecturas/resultados/' + sid + '/' + uid).once('value')
  ]);
  const resp = respSnap.val();
  const res = resSnap.val();
  const answerCount = countAnsweredAnswers(resp && resp.answers);
  const hasRes = !!(res && (res.puntaje !== undefined || res.puntaje_obtenido !== undefined || res.detalle || res.submitted_at));
  const hasAnswers = answerCount > 0 || !!(resp && (resp.submitted_at || resp.completada));
  console.log(JSON.stringify({ resp, res, answerCount, hasRes, hasAnswers }, null, 2));
})();
