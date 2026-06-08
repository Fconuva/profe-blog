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

function getUidFromExternalReference(externalReference) {
  const value = String(externalReference || '').trim();
  const match = value.match(/^(.+)_\d{10,}$/);
  return match ? match[1] : '';
}

async function findUidByEmail(db, email) {
  if (!email) return '';
  const snap = await db.ref('users').orderByChild('email').equalTo(email).once('value');
  const users = snap.val() || {};
  return Object.keys(users)[0] || '';
}

const PLAN_PRICES = { completo: 199990, modulo1: 79990, modulo2: 99990, modulo3: 79990 };

async function markPortfolioPaymentApproved(db, uid, payment, plan, approvedAt) {
  if (!uid) return false;
  await db.ref('portafolios/' + uid).update({
    paymentStatus: 'approved',
    comprobantePago: String(payment.id),
    paidAt: approvedAt,
    paymentVerifiedAt: approvedAt,
    paymentConfirmedAt: approvedAt,
    paymentAmount: payment.transaction_amount,
    esAbono: null,
    saldoPendiente: null,
    plan: plan || 'completo'
  });
  return true;
}

// Marca un abono (1ª cuota): da acceso, registra el monto y el saldo pendiente.
async function markPortfolioAbono(db, uid, payment, plan, approvedAt) {
  if (!uid) return false;
  const planKey = plan || 'completo';
  const amount = payment.transaction_amount || 100000;
  const saldo = Math.max(0, (PLAN_PRICES[planKey] || 199990) - amount);
  await db.ref('portafolios/' + uid).update({
    paymentStatus: 'abono',
    esAbono: true,
    comprobantePago: String(payment.id),
    paidAt: approvedAt,
    paymentVerifiedAt: approvedAt,
    paymentConfirmedAt: approvedAt,
    paymentAmount: amount,
    saldoPendiente: saldo,
    plan: planKey
  });
  return true;
}

// Valida la firma del webhook de Mercado Pago (header x-signature).
// Algoritmo oficial: manifest = "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
// y HMAC-SHA256(manifest, secret) debe coincidir con v1.
function isValidSignature(req, secret) {
  try {
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];
    if (!xSignature) return false;
    let ts = '', v1 = '';
    String(xSignature).split(',').forEach(function (part) {
      const idx = part.indexOf('=');
      if (idx === -1) return;
      const key = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (key === 'ts') ts = value;
      else if (key === 'v1') v1 = value;
    });
    if (!ts || !v1) return false;
    let dataId = req.query['data.id'] || req.query.id || (req.body && req.body.data && req.body.data.id) || '';
    dataId = String(dataId);
    if (/[a-zA-Z]/.test(dataId)) dataId = dataId.toLowerCase();
    let manifest = 'id:' + dataId + ';';
    if (xRequestId) manifest += 'request-id:' + xRequestId + ';';
    manifest += 'ts:' + ts + ';';
    const computed = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
    const a = Buffer.from(computed, 'hex');
    const b = Buffer.from(v1, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}

module.exports = async (req, res) => {
  // Mercado Pago sends different kinds of notifications. We'll handle payment notifications.
  try {
    // Seguridad: validar la firma del webhook (rechaza notificaciones falsas).
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (secret) {
      if (!isValidSignature(req, secret)) {
        console.warn('MP webhook: firma invalida o ausente, rechazado', {
          xRequestId: req.headers['x-request-id'] || null
        });
        return res.status(401).send('invalid signature');
      }
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
    const metadata = payment.metadata || {};
    const isCourseRegistration = metadata.registration_type === 'curso'
      && metadata.course === 'docente-creador'
      && metadata.registration_id;

    console.log('MP payment fetched:', {
      id: payment.id,
      status: payment.status,
      payer: payment.payer,
      metadata: metadata
    });

    if (payment.status === 'approved') {
      // Store approved payment info for later account creation by user
      const adminSdk = initFirebase();
      const db = adminSdk.database();
      const paymentApprovedAt = new Date().toISOString();
      const paymentApprovedAtMs = Date.now();

      // Get email from metadata first, then payer
      const payerEmail = 
        (metadata.user_email) ||
        (payment.payer && payment.payer.email) ||
        (payment.additional_info && payment.additional_info.payer && payment.additional_info.payer.email) ||
        null;
      
      const payerName = 
        (metadata.user_name) ||
        (payment.payer && payment.payer.first_name) ||
        '';

      let payerUid = metadata.user_uid || metadata.userUid || getUidFromExternalReference(payment.external_reference) || '';
      const payerPlan = metadata.plan || 'completo';

      if (!payerUid && payerEmail) {
        payerUid = await findUidByEmail(db, payerEmail);
      }

      if (!payerEmail && !payerUid) {
        console.error('No payer identity found in payment');
        return res.status(200).send('no_identity');
      }

      // Store payment verification
      const paymentsRef = db.ref('verified_payments/' + String(payment.id));
      await paymentsRef.set({
        paymentId: String(payment.id),
        email: payerEmail,
        name: payerName,
        uid: payerUid,
        externalReference: payment.external_reference || '',
        registrationType: isCourseRegistration ? 'curso' : 'portafolio',
        course: metadata.course || '',
        registrationId: metadata.registration_id || '',
        selectedDate: metadata.selected_date || '',
        selectedDateLabel: metadata.selected_date_label || '',
        status: 'approved',
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        verifiedAt: paymentApprovedAt,
        plan: payerPlan
      });

      if (isCourseRegistration) {
        await db.ref('course_registrations/docente_creador/' + metadata.registration_id).update({
          status: 'inscrito',
          paymentStatus: 'approved',
          paymentId: String(payment.id),
          mercadoPagoPaymentId: String(payment.id),
          amount: payment.transaction_amount,
          holdUntilMs: 0,
          updatedAt: paymentApprovedAt,
          updatedAtMs: paymentApprovedAtMs,
          paymentApprovedAt: paymentApprovedAt,
          paymentApprovedAtMs: paymentApprovedAtMs
        });
      }

      // Update user's portfolio payment status if uid available
      if (!isCourseRegistration && payerUid) {
        if (metadata.tipo === 'abono') {
          await markPortfolioAbono(db, payerUid, payment, payerPlan, paymentApprovedAt);
        } else {
          await markPortfolioPaymentApproved(db, payerUid, payment, payerPlan, paymentApprovedAt);
        }
      }

      console.log('Payment verified and stored:', {
        paymentId: payment.id,
        email: payerEmail,
        status: 'approved',
        registrationType: isCourseRegistration ? 'curso' : 'portafolio'
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
