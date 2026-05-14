const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
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
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}
(async () => {
  const db = admin.database();
  const [sesSnap, respSnap, resSnap] = await Promise.all([
    db.ref('plataforma_estudiantes/sesiones/sesion-u2-1').once('value'),
    db.ref('plataforma_estudiantes/respuestas/sesion-u2-1').once('value'),
    db.ref('plataforma_estudiantes/resultados/sesion-u2-1').once('value')
  ]);
  const ses = sesSnap.val() || {};
  const respuestas = respSnap.val() || {};
  const resultados = resSnap.val() || {};
  console.log('notas_evaluadas=' + JSON.stringify(ses.notas_evaluadas));
  console.log('resultados_visibles=' + JSON.stringify(ses.resultados_visibles));
  let submitted2B = 0;
  let withRespNotes = 0;
  let withResultNotas = 0;
  for (const [uid, result] of Object.entries(resultados)) {
    if ((result.curso || '') !== '2B-HC') continue;
    submitted2B++;
    const respNotes = respuestas[uid]?.notes || {};
    const resultNotas = result.notas || {};
    if (Object.values(respNotes).some(v => String(v || '').trim())) withRespNotes++;
    if (Object.values(resultNotas).some(v => String(v || '').trim())) withResultNotas++;
  }
  console.log('submitted2B=' + submitted2B);
  console.log('withRespNotes=' + withRespNotes);
  console.log('withResultNotas=' + withResultNotas);
})();
