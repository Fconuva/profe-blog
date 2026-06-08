const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { MercadoPagoConfig, Payment } = require('mercadopago');
const admin = require('firebase-admin');

// Initialize Firebase
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

const paymentId = "160336518301";

async function lookupMercadoPago() {
  console.log('=== MERCADOPAGO LOOKUP ===');
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.log('MERCADOPAGO_ACCESS_TOKEN not set');
    return null;
  }
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 10000 }
    });
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: String(paymentId) });
    console.log('Payment Found on MP:');
    console.log('ID:', payment.id);
    console.log('Status:', payment.status);
    console.log('Amount:', payment.transaction_amount);
    console.log('Payer Email:', payment.payer ? payment.payer.email : 'None');
    console.log('Payer Name:', payment.payer && payment.payer.first_name ? `${payment.payer.first_name} ${payment.payer.last_name || ''}` : 'None');
    console.log('Payer Phone:', payment.payer && payment.payer.phone ? payment.payer.phone.number : 'None');
    console.log('Metadata:', payment.metadata);
    return payment;
  } catch (err) {
    console.log('Error querying MercadoPago:', err.message);
    return null;
  }
}

async function lookupFirebase() {
  console.log('\n=== FIREBASE LOOKUP ===');
  try {
    const fb = initFirebase();
    const db = fb.database();

    // 1. Search verified_payments
    const verifiedSnap = await db.ref('verified_payments/' + paymentId).once('value');
    if (verifiedSnap.exists()) {
      console.log('Verified Payment Record Found:');
      console.log(verifiedSnap.val());
    } else {
      console.log('No verified payment record found for ID:', paymentId);
    }

    // 2. Search all portafolios for this comprobantePago
    const portSnap = await db.ref('portafolios').once('value');
    const portafolios = portSnap.val() || {};
    let matchingUid = null;
    let matchingPort = null;

    Object.keys(portafolios).forEach(uid => {
      const p = portafolios[uid];
      if (p.comprobantePago === paymentId) {
        matchingUid = uid;
        matchingPort = p;
      }
    });

    if (matchingUid) {
      console.log('\nMatching Portfolio Found for UID:', matchingUid);
      console.log(matchingPort);

      // Fetch user info
      const userSnap = await db.ref('users/' + matchingUid).once('value');
      if (userSnap.exists()) {
        console.log('\nMatching User Profile:');
        console.log(userSnap.val());
      }
    } else {
      console.log('\nNo portfolio matches the comprobantePago ID:', paymentId);
    }
  } catch (err) {
    console.log('Error querying Firebase:', err.message);
  }
}

async function main() {
  await lookupMercadoPago();
  await lookupFirebase();
  process.exit(0);
}

main();
