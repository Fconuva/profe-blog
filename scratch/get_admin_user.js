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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: dbUrl
  });
}

const db = admin.database();

async function run() {
  console.log('Fetching admin user profile...');
  const userSnap = await db.ref('users/DmsJlSiutEbVk5HgpNGF7PAfs693').once('value');
  const user = userSnap.val();
  console.log('Admin User Details:', user);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
