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
function normalizeName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}
function cleanRut(rut) { return String(rut || '').replace(/[.\s-]/g, '').toUpperCase(); }
(async () => {
  const targetName = 'MORALES CAMPOS ALONSO ESTEBAN';
  const targetRut = '228658626';
  const snap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
  const students = Object.entries(snap.val() || {}).map(([uid, s]) => ({ uid, nombre: s.nombre || '', rut: s.rut || '', curso: s.curso || '' }));
  const byName = students.filter(s => normalizeName(s.nombre) === normalizeName(targetName));
  const byRut = students.filter(s => cleanRut(s.rut) === targetRut);
  console.log(JSON.stringify({ byName, byRut }, null, 2));
})();
