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

const SETUP_KEY = 'fix-users-2026-rT7pW';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { setupKey } = req.body || {};
  if (setupKey !== SETUP_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // Get all portafolios
    const portSnap = await admin.database().ref('portafolios').once('value');
    const portafolios = portSnap.val() || {};
    
    // Get all existing users
    const usersSnap = await admin.database().ref('users').once('value');
    const existingUsers = usersSnap.val() || {};
    
    const fixed = [];
    
    for (const uid of Object.keys(portafolios)) {
      if (!existingUsers[uid]) {
        // This user has a portafolio but no users entry - fix it
        try {
          const authUser = await admin.auth().getUser(uid);
          await admin.database().ref('users/' + uid).set({
            nombre: authUser.displayName || authUser.email.split('@')[0],
            email: authUser.email,
            role: 'cliente',
            createdAt: new Date().toISOString(),
            restoredAt: new Date().toISOString()
          });
          fixed.push({ uid, email: authUser.email });
        } catch (e) {
          // User doesn't exist in Auth either, skip
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Fixed ${fixed.length} orphaned portafolios`,
      fixed: fixed
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
