const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

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

async function main() {
  const fb = initFirebase();
  const db = fb.database();

  console.log('Searching users matching "Guzmán" or "Javier"...');
  const usersSnap = await db.ref('users').once('value');
  const users = usersSnap.val() || {};

  let found = [];
  Object.keys(users).forEach(uid => {
    const u = users[uid];
    const name = u.nombre || '';
    if (name.toLowerCase().includes('guzmán') || name.toLowerCase().includes('guzman') || name.toLowerCase().includes('javier')) {
      found.push({ uid, ...u });
    }
  });

  console.log(`Found ${found.length} users:`);
  for (const u of found) {
    console.log('\n========================================');
    console.log(`UID: ${u.uid}`);
    console.log(`Nombre: ${u.nombre}`);
    console.log(`Email: ${u.email}`);
    console.log(`Status: ${u.status}`);
    console.log(`CreatedAt: ${u.createdAt}`);
    console.log('User data:', u);

    // Fetch portfolio
    const portSnap = await db.ref('portafolios/' + u.uid).once('value');
    if (portSnap.exists()) {
      console.log('Portfolio data:');
      console.log(JSON.stringify(portSnap.val(), null, 2));
    } else {
      console.log('No portfolio found for this user.');
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
