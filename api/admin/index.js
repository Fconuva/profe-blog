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

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function requireAdminToken(fb, req) {
  const { callerUid, idToken } = req.body || {};
  if (!callerUid || callerUid !== ADMIN_UID) {
    const err = new Error('No autorizado');
    err.statusCode = 403;
    throw err;
  }
  if (!idToken) {
    const err = new Error('Falta token de administrador');
    err.statusCode = 401;
    throw err;
  }
  const decoded = await fb.auth().verifyIdToken(idToken);
  if (!decoded || decoded.uid !== ADMIN_UID) {
    const err = new Error('Token de administrador inválido');
    err.statusCode = 403;
    throw err;
  }
  return decoded;
}

async function handleCheckBlacklist(req, res) {
  const { email, telefono } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPhone = String(telefono || '').trim();

  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Falta el correo electrónico.' });
  }

  try {
    const fb = initFirebase();
    const db = fb.database();
    const safeEmailKey = normalizedEmail.replace(/[^a-z0-9]/g, '_');

    const emailBlacklistedSnap = await db.ref(`blacklist/emails/${safeEmailKey}`).once('value');
    if (emailBlacklistedSnap.exists()) {
      return res.status(403).json({ blocked: true, error: 'Este correo electrónico está restringido para registros.' });
    }

    const safePhoneKey = normalizedPhone.replace(/[^0-9]/g, '');
    if (safePhoneKey) {
      const phoneBlacklistedSnap = await db.ref(`blacklist/telefonos/${safePhoneKey}`).once('value');
      if (phoneBlacklistedSnap.exists()) {
        return res.status(403).json({ blocked: true, error: 'Este número de teléfono está restringido para registros.' });
      }
    }

    return res.status(200).json({ blocked: false });
  } catch (err) {
    console.error('check-blacklist error:', err);
    return res.status(500).json({ error: 'No se pudo validar la lista de bloqueo.' });
  }
}

async function handleCreateUser(req, res) {
  const { callerUid, nombre, email, telefono, rut, password } = req.body || {};
  const requestedInscripcion = String((req.body && req.body.inscripcionNum) || '').trim();

  if (!callerUid || !nombre || !email) {
    return res.status(400).json({ error: 'Faltan datos obligatorios (nombre, email)' });
  }

  if (callerUid !== ADMIN_UID) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const fb = initFirebase();
    const db = fb.database();

    // Check blacklist before manual creation
    const safeEmailKey = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const emailBlacklistedSnap = await db.ref(`blacklist/emails/${safeEmailKey}`).once('value');
    if (emailBlacklistedSnap.exists()) {
      return res.status(400).json({ error: 'Este correo electrónico está en la lista negra (bloqueado).' });
    }

    if (telefono) {
      const safePhoneKey = telefono.trim().replace(/[^0-9]/g, '');
      if (safePhoneKey) {
        const phoneBlacklistedSnap = await db.ref(`blacklist/telefonos/${safePhoneKey}`).once('value');
        if (phoneBlacklistedSnap.exists()) {
          return res.status(400).json({ error: 'Este número de teléfono está en la lista negra (bloqueado).' });
        }
      }
    }

    const userPassword = password || Math.random().toString(36).slice(-8) + 'A1!';

    // Crear o recuperar la cuenta de Auth. Si el correo ya existe (recuperación
    // de una inscripción donde la cuenta Auth no se borró), se re-vincula al uid existente.
    let uid;
    let reattached = false;
    try {
      const userRecord = await fb.auth().createUser({
        email: email,
        password: userPassword,
        displayName: nombre
      });
      uid = userRecord.uid;
    } catch (createErr) {
      if (createErr.code === 'auth/email-already-exists') {
        const existing = await fb.auth().getUserByEmail(email);
        uid = existing.uid;
        reattached = true;
        // Si se entregó contraseña, la actualizamos; si no, se conserva la actual.
        if (password) {
          await fb.auth().updateUser(uid, { password: userPassword, displayName: nombre });
        }
      } else {
        throw createErr;
      }
    }

    // N° de inscripción: usar el solicitado (recuperación) o generar uno nuevo.
    let inscripcionNum;
    if (requestedInscripcion) {
      inscripcionNum = requestedInscripcion;
      // Mantener el contador por delante para evitar colisiones futuras.
      const numMatch = requestedInscripcion.match(/(\d+)/);
      if (numMatch) {
        const reqNum = parseInt(numMatch[1], 10);
        await db.ref('counters/inscripcion').transaction((current) => {
          return Math.max(Number(current) || 0, reqNum);
        });
      }
    } else {
      const counterRef = db.ref('counters/inscripcion');
      const result = await counterRef.transaction((current) => (current || 0) + 1);
      const num = result.snapshot.val();
      inscripcionNum = 'PRE-2026-' + String(num).padStart(4, '0');
    }

    // Conservar createdAt original del portafolio si ya existía (re-vínculo).
    const prevPortSnap = await db.ref('portafolios/' + uid).once('value');
    const prevPort = prevPortSnap.val() || {};
    const prevUserSnap = await db.ref('users/' + uid).once('value');
    const prevUser = prevUserSnap.val() || {};

    await db.ref('users/' + uid).update({
      nombre: nombre,
      email: email,
      telefono: telefono || prevUser.telefono || '',
      rut: rut || prevUser.rut || '',
      role: prevUser.role === 'admin' ? 'admin' : 'cliente',
      status: 'pre-inscrito',
      inscripcionNum: inscripcionNum,
      createdAt: prevUser.createdAt || new Date().toISOString(),
      creadoPorAdmin: true,
      recuperado: reattached || !!requestedInscripcion
    });

    await db.ref('portafolios/' + uid).update({
      plan: prevPort.plan || 'pre-inscripcion',
      paymentStatus: prevPort.paymentStatus || 'pre-inscrito',
      createdAt: prevPort.createdAt || new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      uid: uid,
      inscripcionNum: inscripcionNum,
      password: password ? userPassword : (reattached ? null : userPassword),
      reattached: reattached
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

async function handleUpdateUserProfile(req, res) {
  const { uid, nombre, telefono, rut } = req.body || {};
  const email = normalizeEmail(req.body && req.body.email);

  if (!uid || !nombre || !email) {
    return res.status(400).json({ error: 'Faltan datos obligatorios (uid, nombre, email)' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Correo electrónico inválido' });
  }

  try {
    const fb = initFirebase();
    await requireAdminToken(fb, req);

    const db = fb.database();
    const userSnap = await db.ref('users/' + uid).once('value');
    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const currentUser = userSnap.val() || {};
    const previousEmail = normalizeEmail(currentUser.email);

    try {
      const existing = await fb.auth().getUserByEmail(email);
      if (existing && existing.uid !== uid) {
        return res.status(409).json({ error: 'Ese correo ya pertenece a otra cuenta.' });
      }
    } catch (lookupErr) {
      if (lookupErr.code !== 'auth/user-not-found') throw lookupErr;
    }

    const authUpdate = {
      email: email,
      displayName: String(nombre || '').trim()
    };
    await fb.auth().updateUser(uid, authUpdate);

    const timestamp = new Date().toISOString();
    const updates = {
      nombre: String(nombre || '').trim(),
      email: email,
      telefono: String(telefono || '').trim(),
      rut: String(rut || '').trim(),
      updatedAt: timestamp,
      updatedBy: ADMIN_UID
    };

    if (previousEmail && previousEmail !== email) {
      updates.emailAnterior = previousEmail;
      updates.emailActualizadoAt = timestamp;
      updates.emailActualizadoPor = ADMIN_UID;
    }

    await db.ref('users/' + uid).update(updates);

    return res.status(200).json({ success: true, uid, email, previousEmail });
  } catch (err) {
    console.error('update-user-profile error:', err);
    if (err.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Ese correo ya pertenece a otra cuenta.' });
    }
    if (err.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'No existe la cuenta de autenticación para este usuario.' });
    }
    return res.status(err.statusCode || 500).json({ error: err.message || 'Error interno' });
  }
}

async function handleBlockUser(req, res) {
  const { uid, callerUid } = req.body || {};

  if (!uid || !callerUid) {
    return res.status(400).json({ error: 'Faltan datos (uid, callerUid)' });
  }

  if (callerUid !== ADMIN_UID) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  if (uid === ADMIN_UID) {
    return res.status(400).json({ error: 'No puedes bloquear la cuenta admin' });
  }

  try {
    const fb = initFirebase();
    const db = fb.database();

    // 1. Fetch user data
    const userSnap = await db.ref('users/' + uid).once('value');
    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = userSnap.val() || {};

    // 2. Fetch portfolio data (if any)
    const portfolioSnap = await db.ref('portafolios/' + uid).once('value');
    const portfolio = portfolioSnap.exists() ? portfolioSnap.val() : null;

    const email = user.email ? user.email.trim() : '';
    const telefono = user.telefono ? user.telefono.trim() : '';

    // 3. Prepare updates for blacklist & archiving
    const updates = {};
    const timestamp = new Date().toISOString();

    if (email) {
      const safeEmailKey = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      updates[`blacklist/emails/${safeEmailKey}`] = {
        email: email.toLowerCase(),
        telefono: telefono,
        nombre: user.nombre || '',
        rut: user.rut || '',
        uid: uid,
        blockedAt: timestamp
      };
    }

    if (telefono) {
      const safePhoneKey = telefono.replace(/[^0-9]/g, '');
      if (safePhoneKey) {
        updates[`blacklist/telefonos/${safePhoneKey}`] = {
          email: email.toLowerCase(),
          telefono: telefono,
          nombre: user.nombre || '',
          rut: user.rut || '',
          uid: uid,
          blockedAt: timestamp
        };
      }
    }

    // 4. Archive User Data
    updates[`archived_users/${uid}`] = {
      user: user,
      portafolio: portfolio,
      blockedAt: timestamp
    };

    // Apply database updates
    await db.ref().update(updates);

    // 5. Delete from Firebase Auth
    try {
      await fb.auth().deleteUser(uid);
    } catch (authErr) {
      if (authErr.code !== 'auth/user-not-found') {
        console.error('Error deleting auth user:', authErr);
      }
    }

    // 6. Delete from active nodes
    await db.ref('users/' + uid).remove();
    await db.ref('portafolios/' + uid).remove();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('block-user error:', err);
    return res.status(500).json({ error: err.message || 'Error interno' });
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { action } = req.body || {};

  switch (action) {
    case 'check-blacklist':
      return handleCheckBlacklist(req, res);
    case 'create-user':
      return handleCreateUser(req, res);
    case 'delete-user':
      return handleDeleteUser(req, res);
    case 'change-password':
      return handleChangePassword(req, res);
    case 'update-user-profile':
      return handleUpdateUserProfile(req, res);
    case 'block-user':
      return handleBlockUser(req, res);
    default:
      return res.status(400).json({ error: 'Acción no válida. Use action: "check-blacklist", "create-user", "delete-user", "change-password", "update-user-profile" o "block-user"' });
  }
};
