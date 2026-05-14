// Reset de password para MERCADO MENDEZ FREDERIC ALEJANDRO (RUT 22415426-7)
// Hace lo mismo que el endpoint /api/estudiantes?action=reset-password pero local
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

const auth = admin.auth();
const db = admin.database();

const RUT = '22415426-7';
const RUT_CLEAN = RUT.replace(/[.\s-]/g, '').toUpperCase();
const EMAIL = RUT_CLEAN + '@est.profefranciscopancho.com';
const NEW_PASS = RUT_CLEAN.replace(/[^0-9]/g, '').substring(0, 6).padEnd(6, '0');

(async () => {
  try {
    const u = await auth.getUserByEmail(EMAIL);
    console.log('Encontrado UID:', u.uid, '| email:', u.email, '| displayName:', u.displayName);
    await auth.updateUser(u.uid, { password: NEW_PASS });
    await db.ref('plataforma_estudiantes/estudiantes/' + u.uid).update({
      password_changed: false,
      password_reset_pending: false,
      password_reset_at: Date.now()
    });
    console.log('OK. Password reseteada a:', NEW_PASS);
    console.log('Login del estudiante: RUT', RUT, '/ password', NEW_PASS);
    process.exit(0);
  } catch (e) {
    console.error('FALLO:', e.message);
    process.exit(1);
  }
})();
