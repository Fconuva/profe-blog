const path = require('path');
const fs = require('fs');
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
  const snap = await admin.database().ref('plataforma_estudiantes/tareas/tarea-argumentacion-1').once('value');
  const data = snap.val() || {};
  const rows = Object.entries(data)
    .map(([uid, row]) => ({ uid, ...row }))
    .filter(row => row && row.curso === '2B-HC' && row.completada === true)
    .sort((a, b) => (a.submitted_at || 0) - (b.submitted_at || 0));

  const exportPath = path.join(process.cwd(), '_tmp_2bhc_tarea_argumentacion_export.json');
  fs.writeFileSync(exportPath, JSON.stringify(rows, null, 2), 'utf8');
  console.log(exportPath);
})().catch(err => { console.error(err); process.exit(1); });
