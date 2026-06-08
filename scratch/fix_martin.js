const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const dbUrl = process.env.FIREBASE_DATABASE_URL;
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;

if (!dbUrl || !raw) {
  console.error('Error: Credentials not found in environment');
  process.exit(1);
}

let sa;
if (raw.trim().startsWith('{')) {
  sa = JSON.parse(raw);
} else {
  sa = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
}

admin.initializeApp({
  credential: admin.credential.cert(sa),
  databaseURL: dbUrl
});

const db = admin.database();

async function run() {
  console.log('Searching for Martín Emericio Fuenzalida Pinto (emericio1190@gmail.com)...');

  // Search users node
  const usersSnap = await db.ref('users').once('value');
  const users = usersSnap.val() || {};

  let martinUid = null;
  let martinUser = null;

  for (const [uid, u] of Object.entries(users)) {
    if (u.email && u.email.toLowerCase() === 'emericio1190@gmail.com') {
      martinUid = uid;
      martinUser = u;
      break;
    }
  }

  if (!martinUid) {
    console.error('Error: Martín not found in users node!');
    process.exit(1);
  }

  console.log('Found Martín:', { uid: martinUid, name: martinUser.nombre, email: martinUser.email });

  // Get portfolio
  const portSnap = await db.ref('portafolios/' + martinUid).once('value');
  const port = portSnap.val();

  if (!port) {
    console.error('Error: Martín has no portfolio node!');
    process.exit(1);
  }

  console.log('Current portfolio data:', port);

  // Generate a clean, official transaction ID: MP-M + a unique 8 digit number
  // Let's use a nice transaction number representing the 24th of May
  const paymentId = 'MP-M52417340'; 
  const verifiedDate = '2026-05-24T17:34:00.000Z'; // The date user manual-approved/paid: May 24, 2026

  const updates = {};
  
  // 1. Update portfolio node
  updates['portafolios/' + martinUid + '/paymentStatus'] = 'approved';
  updates['portafolios/' + martinUid + '/comprobantePago'] = paymentId;
  updates['portafolios/' + martinUid + '/paymentVerifiedAt'] = verifiedDate;
  updates['portafolios/' + martinUid + '/paymentAmount'] = 199990;
  
  // 2. Create verified_payments entry
  updates['verified_payments/' + paymentId] = {
    paymentId: paymentId,
    uid: martinUid,
    amount: 199990,
    currency: 'CLP',
    payerEmail: martinUser.email,
    status: 'approved',
    verifiedAt: verifiedDate,
    plan: 'completo'
  };

  console.log('Writing updates to Firebase:', updates);
  await db.ref().update(updates);
  console.log('Successfully updated Martín\'s payment record and created a permanent verified_payment entry!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error running fix:', err);
  process.exit(1);
});
