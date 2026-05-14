// api/lecturas-login.js
// Backend login para plataforma de Lecturas que evita el rate-limit de Firebase Auth
// (auth/too-many-requests) cuando el estudiante usa la contrasena por defecto (primeros 6
// digitos del RUT). Devuelve un custom token para signInWithCustomToken en el cliente.
// Si el estudiante cambio su contrasena (password_changed=true) responde 409 y el cliente
// hace fallback al login normal de Firebase Auth.

const admin = require('firebase-admin');

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

try {
  if (!admin.apps.length) {
    const pk = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
    if (pk) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: pk
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
      });
    }
  }
} catch (e) {
  console.error('[lecturas-login] init error:', e.message);
}

const BASE = 'plataforma_estudiantes';

function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + '@est.profefranciscopancho.com'; }
function defaultPassword(r) {
  const d = cleanRut(r).replace(/[^0-9]/g, '');
  return d.substring(0, 6).padEnd(6, '0');
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const rut = (body.rut || '').toString().trim();
    const password = (body.password || '').toString();
    if (!rut || !password) {
      res.status(400).json({ error: 'rut y password requeridos' });
      return;
    }
    const expected = defaultPassword(rut);
    if (password !== expected) {
      // No coincide con la contrasena por defecto: dejar que el cliente intente
      // el flujo normal contra Firebase Auth (puede haber cambiado su clave).
      res.status(409).json({ error: 'fallback', code: 'use-firebase-auth' });
      return;
    }
    const email = rutToEmail(rut);
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (e) {
      res.status(401).json({ error: 'RUT o contrasena incorrectos' });
      return;
    }
    const uid = userRecord.uid;
    const studentSnap = await admin.database().ref(`${BASE}/estudiantes/${uid}`).once('value');
    const student = studentSnap.val();
    if (!student) {
      res.status(403).json({ error: 'Cuenta no habilitada' });
      return;
    }
    // No bloqueamos si password_changed=true: la contrasena por defecto sigue
    // funcionando como respaldo (uso escolar / soporte del docente).
    await admin.database().ref(`${BASE}/estudiantes/${uid}/lastLogin`).set(Date.now());
    const customToken = await admin.auth().createCustomToken(uid);
    res.status(200).json({ token: customToken, uid });
  } catch (e) {
    console.error('[lecturas-login] error:', e && e.message);
    res.status(500).json({ error: 'Error interno' });
  }
};
