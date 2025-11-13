// Mercado Pago webhook handler
// Expects MERCADOPAGO_ACCESS_TOKEN, MERCADOPAGO_WEBHOOK_SECRET and FIREBASE_SERVICE_ACCOUNT (base64 JSON) in env

const { MercadoPagoConfig, Payment } = require('mercadopago');
const admin = require('firebase-admin');
const crypto = require('crypto');

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

    // Initialize Mercado Pago client
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });
    
    const paymentClient = new Payment(client);

    // For payment notifications, fetch payment details
    const payment = await paymentClient.get({ id: id });
    console.log('MP payment fetched:', {
      id: payment.id,
      status: payment.status,
      payer: payment.payer,
      metadata: payment.metadata
    });

    if (payment.status === 'approved') {
      // Store approved payment info for later account creation by user
      const adminSdk = initFirebase();
      const db = adminSdk.database();

      // Get email from metadata first, then payer
      const payerEmail = 
        (payment.metadata && payment.metadata.user_email) ||
        (payment.payer && payment.payer.email) ||
        (payment.additional_info && payment.additional_info.payer && payment.additional_info.payer.email) ||
        null;
      
      const payerName = 
        (payment.metadata && payment.metadata.user_name) ||
        (payment.payer && payment.payer.first_name) ||
        '';

      if (!payerEmail) {
        console.error('No payer email found in payment');
        return res.status(200).send('no_email');
      }

      // Store payment verification (user will create account manually)
      const paymentsRef = db.ref('verified_payments/' + String(payment.id));
      await paymentsRef.set({
        paymentId: String(payment.id),
        email: payerEmail,
        name: payerName,
        status: 'approved',
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        verifiedAt: new Date().toISOString(),
        plan: 'Acceso Completo ECEP 2025',
        accountCreated: false  // Will be set to true when user creates account
      });

      console.log('Payment verified and stored:', {
        paymentId: payment.id,
        email: payerEmail,
        status: 'approved'
      });

      return res.status(200).send('ok');
    }

    // not approved yet
    console.log('Payment not approved, status:', payment.status);
    return res.status(200).send('ignored');
  } catch (err) {
    console.error('webhook error', err);
    return res.status(500).send('error');
  }
};
