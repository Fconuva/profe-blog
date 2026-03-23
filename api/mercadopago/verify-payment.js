// Verify a MercadoPago payment by ID and auto-approve if valid
// Requires: MERCADOPAGO_ACCESS_TOKEN, FIREBASE_SERVICE_ACCOUNT_BASE64, FIREBASE_DATABASE_URL

const { MercadoPagoConfig, Payment } = require('mercadopago');
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

const PLANS = {
  completo: 199990,
  modulo1: 79990,
  modulo2: 99990,
  modulo3: 79990
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { paymentId, uid, plan } = req.body || {};
  if (!paymentId || !uid || !plan) {
    return res.status(400).json({ verified: false, reason: 'Faltan datos' });
  }

  const expectedAmount = PLANS[plan];
  if (!expectedAmount) {
    return res.status(400).json({ verified: false, reason: 'Plan inválido' });
  }

  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return res.status(500).json({ verified: false, reason: 'MP no configurado en servidor' });
  }

  try {
    // 1. Query MercadoPago for this payment
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });
    const paymentClient = new Payment(client);

    let payment;
    try {
      payment = await paymentClient.get({ id: String(paymentId) });
    } catch (mpErr) {
      console.error('MP get payment error:', mpErr.message);
      return res.json({ verified: false, reason: 'No se encontró un pago con el N° ' + paymentId });
    }

    // 2. Check payment is approved
    if (payment.status !== 'approved') {
      return res.json({ verified: false, reason: 'El pago no está aprobado. Estado actual: ' + payment.status });
    }

    // 3. Check amount matches plan
    if (payment.transaction_amount < expectedAmount) {
      return res.json({ verified: false, reason: 'El monto ($' + payment.transaction_amount.toLocaleString() + ') no coincide con el plan ($' + expectedAmount.toLocaleString() + ')' });
    }

    // 4. Check this payment hasn't been used already
    const adminSdk = initFirebase();
    const db = adminSdk.database();
    const usedSnap = await db.ref('verified_payments/' + String(payment.id)).once('value');
    if (usedSnap.val()) {
      return res.json({ verified: false, reason: 'Este comprobante ya fue utilizado por otra cuenta' });
    }

    // 5. All valid — register and auto-approve
    await db.ref('verified_payments/' + String(payment.id)).set({
      paymentId: String(payment.id),
      uid: uid,
      amount: payment.transaction_amount,
      currency: payment.currency_id || 'CLP',
      payerEmail: (payment.payer && payment.payer.email) || '',
      status: 'approved',
      verifiedAt: new Date().toISOString(),
      plan: plan
    });

    await db.ref('portafolios/' + uid).update({
      paymentStatus: 'approved',
      comprobantePago: String(payment.id),
      paymentVerifiedAt: new Date().toISOString(),
      paymentAmount: payment.transaction_amount
    });

    console.log('Payment auto-verified:', { paymentId: payment.id, uid, plan, amount: payment.transaction_amount });

    return res.json({ verified: true, amount: payment.transaction_amount });

  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ verified: false, reason: 'Error del servidor al verificar' });
  }
};
