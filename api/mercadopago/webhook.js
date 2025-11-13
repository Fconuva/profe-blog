// Mercado Pago webhook handler
// Expects MERCADOPAGO_ACCESS_TOKEN, MERCADOPAGO_WEBHOOK_SECRET and FIREBASE_SERVICE_ACCOUNT (base64 JSON) in env

const mercadopago = require('mercadopago');
const admin = require('firebase-admin');
const crypto = require('crypto');

mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN });

// Initialize Firebase Admin if not already
function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;

  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountBase64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 not set');
  }

  let serviceAccount;
  try {
    // allow raw JSON or base64
    if (serviceAccountBase64.trim().startsWith('{')) {
      serviceAccount = JSON.parse(serviceAccountBase64);
    } else {
      const json = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
      serviceAccount = JSON.parse(json);
    }
  } catch (err) {
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT content: ' + err.message);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  return admin;
}

module.exports = async (req, res) => {
  // Mercado Pago sends different kinds of notifications. We'll handle payment notifications.
  try {
    // Optional: Validate webhook signature (x-signature header)
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (secret) {
      const xSignature = req.headers['x-signature'];
      const xRequestId = req.headers['x-request-id'];
      // Note: MP signature validation is complex, skip for now if header not present
      // In production, implement full HMAC validation
      console.log('Webhook received', { xSignature, xRequestId });
    }

    // For MP, the notification can be sent as query params or body depending on integration
    const topic = req.query.topic || req.body.type || req.query.type;
    const id = req.query.id || req.body.id || req.body.data && req.body.data.id;

    if (!id) {
      // Could be IPN with payment_id in body
      return res.status(400).send('no id');
    }

    // For payment notifications, fetch payment details
    const mpPayment = await mercadopago.payment.findById(id);
    const payment = mpPayment && mpPayment.body ? mpPayment.body : mpPayment;
    console.log('MP payment fetched', payment.id, payment.status);

    if (payment.status === 'approved') {
      // Create user in Firebase Realtime DB
      const adminSdk = initFirebase();
      const db = adminSdk.database();

      // Get payer email from payment
      const payerEmail = (payment.payer && payment.payer.email) || (payment.transaction_details && payment.transaction_details.external_resource_url) || null;
      const payerName = (payment.payer && (payment.payer.first_name || payment.payer.last_name)) || '';

      // Derive username
      const username = payerEmail ? payerEmail.split('@')[0] + Math.floor(Math.random()*900+100) : 'user' + Date.now();
      // Generate password
      const passwordPlain = Math.random().toString(36).slice(2,10);
      const passwordBase64 = Buffer.from(passwordPlain).toString('base64');

      const usersRef = db.ref('users');
      const newUserRef = usersRef.push();
      const userData = {
        username: username,
        email: payerEmail,
        password: passwordBase64,
        role: 'cliente',
        permissions: { basica: true, media: true, parvularia: true },
        active: true,
        createdAt: new Date().toISOString(),
        sourcePaymentId: payment.id,
        plan: payment.order && payment.order.items && payment.order.items[0] && payment.order.items[0].title ? payment.order.items[0].title : 'plan'
      };

      await newUserRef.set(userData);

      console.log('Created user', newUserRef.key, userData.username);

      // Optionally: store credential in a dedicated node for admin retrieval
      const credsRef = db.ref('payment_created_accounts/' + newUserRef.key);
      await credsRef.set({ username: userData.username, password: passwordPlain, email: payerEmail, createdAt: userData.createdAt });

      return res.status(200).send('ok');
    }

    // not approved yet
    return res.status(200).send('ignored');
  } catch (err) {
    console.error('webhook error', err);
    return res.status(500).send('error');
  }
};
