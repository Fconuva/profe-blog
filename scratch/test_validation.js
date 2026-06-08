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

const PLAN_NAMES = {
  completo: 'Portafolio Completo',
  modulo1: 'Módulo 1 — Planificación',
  modulo2: 'Módulo 2 — Clase Grabada',
  modulo3: 'Módulo 3 — Reflexión'
};

async function test(id) {
  console.log(`Testing validation for Receipt ID: ${id}`);
  
  // 1. Check in verified_payments first
  const verifiedSnap = await db.ref('verified_payments/' + String(id)).once('value');
  const payment = verifiedSnap.val();

  if (payment) {
    const userSnap = await db.ref('users/' + payment.uid).once('value');
    const user = userSnap.val() || {};

    console.log('Result (From verified_payments):', {
      valid: true,
      payment: {
        id: payment.paymentId,
        amount: payment.amount,
        plan: PLAN_NAMES[payment.plan] || payment.plan,
        verifiedAt: payment.verifiedAt,
        clientName: user.nombre || 'Docente'
      }
    });
    return;
  }

  // 2. If not found, check portafolios fallback
  const portafoliosSnap = await db.ref('portafolios').once('value');
  const portafolios = portafoliosSnap.val() || {};

  let foundUid = null;
  let foundPort = null;

  for (const [uid, p] of Object.entries(portafolios)) {
    if (p.comprobantePago === String(id) && (p.paymentStatus === 'approved' || p.paymentStatus === 'aprobado')) {
      foundUid = uid;
      foundPort = p;
      break;
    }
  }

  if (foundPort) {
    const userSnap = await db.ref('users/' + foundUid).once('value');
    const user = userSnap.val() || {};

    console.log('Result (From portafolios fallback):', {
      valid: true,
      payment: {
        id: String(id),
        amount: foundPort.paymentAmount || 199990,
        plan: PLAN_NAMES[foundPort.plan] || foundPort.plan,
        verifiedAt: foundPort.paymentVerifiedAt || foundPort.paymentConfirmedAt || new Date().toISOString(),
        clientName: user.nombre || 'Docente'
      }
    });
    return;
  }

  console.log('Result: Not found or not approved');
}

async function run() {
  await test('MP-M52417340');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
