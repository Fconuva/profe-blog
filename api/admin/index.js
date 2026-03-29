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

async function handleCreateUser(req, res) {
  const { callerUid, nombre, email, telefono, rut, password } = req.body || {};

  if (!callerUid || !nombre || !email) {
    return res.status(400).json({ error: 'Faltan datos obligatorios (nombre, email)' });
  }

  if (callerUid !== ADMIN_UID) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const fb = initFirebase();
    const db = fb.database();

    const userPassword = password || Math.random().toString(36).slice(-8) + 'A1!';
    const userRecord = await fb.auth().createUser({
      email: email,
      password: userPassword,
      displayName: nombre
    });

    const uid = userRecord.uid;

    const counterRef = db.ref('counters/inscripcion');
    const result = await counterRef.transaction((current) => (current || 0) + 1);
    const num = result.snapshot.val();
    const inscripcionNum = 'PRE-2026-' + String(num).padStart(4, '0');

    await db.ref('users/' + uid).set({
      nombre: nombre,
      email: email,
      telefono: telefono || '',
      rut: rut || '',
      role: 'cliente',
      status: 'pre-inscrito',
      inscripcionNum: inscripcionNum,
      createdAt: new Date().toISOString(),
      creadoPorAdmin: true
    });

    return res.status(200).json({
      success: true,
      uid: uid,
      inscripcionNum: inscripcionNum,
      password: userPassword
    });
  } catch (err) {
    console.error('create-user error:', err);
    if (err.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Este correo ya está registrado.' });
    }
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}

async function handleDeleteUser(req, res) {
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

    try {
      await fb.auth().deleteUser(uid);
    } catch (authErr) {
      if (authErr.code !== 'auth/user-not-found') throw authErr;
    }

    await db.ref('users/' + uid).remove();
    await db.ref('portafolios/' + uid).remove();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('delete-user error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}

async function handleChangePassword(req, res) {
  const { uid, callerUid, password } = req.body || {};

  if (!uid || !callerUid || !password) {
    return res.status(400).json({ error: 'Faltan datos (uid, callerUid, password)' });
  }

  if (callerUid !== ADMIN_UID) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const fb = initFirebase();
    await fb.auth().updateUser(uid, { password: password });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('change-password error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { action } = req.body || {};

  switch (action) {
    case 'create-user':
      return handleCreateUser(req, res);
    case 'delete-user':
      return handleDeleteUser(req, res);
    case 'change-password':
      return handleChangePassword(req, res);
    default:
      return res.status(400).json({ error: 'Acción no válida. Use action: "create-user", "delete-user" o "change-password"' });
  }
};
