const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString()
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const SETUP_KEY = 'provision-admin-2026-xK9mQ';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { setupKey } = req.body || {};
  if (setupKey !== SETUP_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const adminEmail = 'portafolio.admin@profefranciscopancho.com';
  const adminPassword = 'Admin2026!Profe';
  const adminName = 'Administrador Portafolios';

  try {
    let uid;
    try {
      const existing = await admin.auth().getUserByEmail(adminEmail);
      uid = existing.uid;
    } catch (e) {
      const newUser = await admin.auth().createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: adminName,
      });
      uid = newUser.uid;
    }

    await admin.database().ref('users/' + uid).set({
      nombre: adminName,
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Admin provisioned',
      email: adminEmail,
      uid: uid
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
