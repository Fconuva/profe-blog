const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');

  let sa;
  if (raw.trim().startsWith('{')) {
    sa = JSON.parse(raw);
  } else {
    sa = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  }

  admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  return admin;
}

const ADMIN_UID = 'DmsJlSiutEbVk5HgpNGF7PAfs693';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, callerUid } = req.body || {};
  if (!uid || !callerUid) {
    return res.status(400).json({ error: 'Faltan datos (uid, callerUid)' });
  }

  if (callerUid !== ADMIN_UID) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  if (uid === ADMIN_UID) {
    return res.status(400).json({ error: 'No puedes eliminar la cuenta admin' });
  }

  try {
    const fb = initFirebase();
    const db = fb.database();

    // Delete from Firebase Auth
    try {
      await fb.auth().deleteUser(uid);
    } catch (authErr) {
      if (authErr.code !== 'auth/user-not-found') throw authErr;
    }

    // Delete from RTDB
    await db.ref('users/' + uid).remove();
    await db.ref('portafolios/' + uid).remove();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('delete-user error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
};
