// Verifica que /api/estudiantes en prod responde sin 504
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
    databaseURL: 'https://profe-blog-default-rtdb.firebaseio.com'
  });
}

const FB_API_KEY = 'AIzaSyCzN4xNEE_hKshXbsVqLhWSnzet1pHwRh8';
const PROD = 'https://www.profefranciscopancho.com/api/estudiantes';
const ADMIN_UID = process.env.ADMIN_UID || 'admin_default';

(async () => {
  // 1. Mint admin custom token
  const customTok = await admin.auth().createCustomToken(ADMIN_UID);
  // 2. Exchange por idToken
  const r1 = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + FB_API_KEY, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ token: customTok, returnSecureToken: true })
  });
  const j1 = await r1.json();
  if (!j1.idToken) { console.error('Login admin falló:', j1); process.exit(1); }
  const idToken = j1.idToken;
  console.log('admin idToken OK');

  // 3. login-token de un alumno (MERCADO 9zkdTIb0pSb6v9M1vfZCGPVCDHE2)
  const t0 = Date.now();
  const r2 = await fetch(PROD + '?action=login-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken },
    body: JSON.stringify({ studentUid: '9zkdTIb0pSb6v9M1vfZCGPVCDHE2' })
  });
  const dt = Date.now() - t0;
  const text = await r2.text();
  console.log('login-token status:', r2.status, '| ms:', dt);
  console.log('body:', text.slice(0, 300));

  // 4. reset-password (idempotente)
  const t1 = Date.now();
  const r3 = await fetch(PROD + '?action=reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + idToken },
    body: JSON.stringify({ studentUid: '9zkdTIb0pSb6v9M1vfZCGPVCDHE2' })
  });
  const dt2 = Date.now() - t1;
  console.log('reset-password status:', r3.status, '| ms:', dt2);
  console.log('body:', (await r3.text()).slice(0, 300));
  process.exit(0);
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
