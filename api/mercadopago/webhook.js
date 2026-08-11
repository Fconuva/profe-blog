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
  const normalizedEmail = String(email).trim().toLowerCase();
  let snap = await db.ref('users').orderByChild('email').equalTo(normalizedEmail).once('value');
  const users = snap.val() || {};
  if (Object.keys(users)[0]) return Object.keys(users)[0];

  // Older accounts were not guaranteed to store normalized email addresses.
  snap = await db.ref('users').once('value');
  const allUsers = snap.val() || {};
  return Object.keys(allUsers).find(function(uid) {
    return String((allUsers[uid] && allUsers[uid].email) || '').trim().toLowerCase() === normalizedEmail;
  }) || '';
}

const PLAN_PRICES = { completo: 199990, modulo1: 79990, modulo2: 99990, modulo3: 79990 };

function portfolioPrice(portfolio, plan) {
  const agreed = Number(portfolio && portfolio.precioAcordado);
  if (Number.isFinite(agreed) && agreed > 0) return agreed;
  return PLAN_PRICES[PLAN_PRICES[plan] ? plan : 'completo'];
}

function isExpectedMoney(payment, expectedAmount) {
  return String((payment && payment.currency_id) || '').toUpperCase() === 'CLP'
    && Number(payment && payment.transaction_amount) === expectedAmount;
}

function matchesPendingBalance(portfolio, payment) {
  const pending = Number(portfolio && portfolio.saldoPendiente) || 0;
  const amount = Number(payment && payment.transaction_amount) || 0;
  return Boolean(portfolio)
    && portfolio.paymentStatus === 'abono'
    && pending > 0
    && Math.abs(amount - pending) <= 10000;
}

function getNotificationId(req) {
  const query = (req && req.query) || {};
  const body = (req && req.body) || {};
  return query['data.id'] || (body.data && body.data.id) || query.id || body.payment_id || body.id || '';
}

function classifyPortfolioPayment(payment, metadata, plan, portfolio) {
  const amount = Number(payment && payment.transaction_amount) || 0;
  const currency = String((payment && payment.currency_id) || '').toUpperCase();
  const planKey = PLAN_PRICES[plan] ? plan : 'completo';
  const expected = portfolioPrice(portfolio, planKey);
  if (currency !== 'CLP') return { valid: false, reason: 'currency', plan: planKey };
  if (amount > expected + 10000) return { valid: false, reason: 'amount', plan: planKey };
  if (metadata && metadata.tipo === 'saldo') {
    return amount > 0 && amount <= expected
      ? { valid: true, type: 'saldo', plan: planKey }
      : { valid: false, reason: 'amount', plan: planKey };
  }
  if (metadata && metadata.tipo === 'abono') {
    return planKey === 'completo' && amount >= 90000 && amount <= 110000
      ? { valid: true, type: 'abono', plan: planKey }
      : { valid: false, reason: 'amount', plan: planKey };
  }
  if (amount >= expected - 10000 && amount <= expected + 10000) {
    return { valid: true, type: 'completo', plan: planKey };
  }
  // Rescue old static-link deposits that had no metadata but match the known first instalment.
  if (planKey === 'completo' && amount >= 90000 && amount <= 110000) {
    return { valid: true, type: 'abono', plan: planKey };
  }
  return { valid: false, reason: 'amount', plan: planKey };
}

async function applyPortfolioPayment(db, uid, payment, plan, paymentType, approvedAt) {
  if (!uid) return false;
  const planKey = PLAN_PRICES[plan] ? plan : 'completo';
  const amount = Number(payment.transaction_amount) || 0;
  const paymentId = String(payment.id);
  await db.ref('portafolios/' + uid).transaction(function(current) {
    current = current || {};
    const price = portfolioPrice(current, planKey);
    if (current.paymentStatus === 'approved' || current.paymentStatus === 'aprobado' || current.paymentStatus === 'pagado') {
      return current;
    }
    const existingAbonos = Array.isArray(current.abonos) ? current.abonos.slice() : [];
    const alreadyApplied = String(current.comprobantePago || '') === paymentId
      || existingAbonos.some(function(item) { return String((item && (item.paymentId || item.id || item.op)) || '') === paymentId; });
    if (alreadyApplied) return current;

    if (paymentType === 'completo') {
      return Object.assign({}, current, {
        paymentStatus: 'approved',
        comprobantePago: paymentId,
        paidAt: approvedAt,
        paymentVerifiedAt: approvedAt,
        paymentConfirmedAt: approvedAt,
        paymentAmount: amount,
        esAbono: null,
        saldoPendiente: null,
        plan: planKey
      });
    }

    const sumAbonos = existingAbonos.reduce(function(total, item) {
      return total + (Number(item && item.monto) || 0);
    }, 0);
    const previous = Math.max(Number(current.abonoAcumulado) || 0, Number(current.paymentAmount) || 0, sumAbonos);
    const total = previous + amount;
    existingAbonos.push({
      paymentId: paymentId,
      monto: amount,
      fecha: String(approvedAt).slice(0, 10),
      medio: 'Mercado Pago'
    });
    const complete = total >= price - 10000;
    return Object.assign({}, current, {
      paymentStatus: complete ? 'approved' : 'abono',
      comprobantePago: paymentId,
      paidAt: approvedAt,
      paymentVerifiedAt: approvedAt,
      paymentConfirmedAt: approvedAt,
      paymentAmount: total,
      abonoAcumulado: total,
      abonos: existingAbonos,
      esAbono: complete ? null : true,
      saldoPendiente: complete ? null : Math.max(0, price - total),
      plan: planKey
    });
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
    let dataId = getNotificationId(req);
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
    const id = getNotificationId(req);

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
      hasPayerEmail: Boolean(payment.payer && payment.payer.email),
      hasMetadataUid: Boolean(metadata.user_uid || metadata.userUid),
      type: metadata.tipo || ''
    });

    if (payment.status === 'approved') {
      // Store approved payment info for later account creation by user
      const adminSdk = initFirebase();
      const db = adminSdk.database();
      const paymentApprovedAt = new Date().toISOString();
      const paymentApprovedAtMs = Date.now();

      // ===== ECEP: acceso automático a un dossier de estudio =====
      if (metadata.ecep_dossier || metadata.tipo === 'ecep') {
        if (!isExpectedMoney(payment, 10000)) {
          console.error('ECEP payment amount or currency mismatch', { paymentId: payment.id });
          return res.status(200).send('ecep_invalid_amount');
        }
        let ecepUid = metadata.ecep_uid || metadata.user_uid || '';
        let ecepDossier = metadata.ecep_dossier || '';
        if ((!ecepUid || !ecepDossier) && payment.external_reference) {
          const m = String(payment.external_reference).match(/^ecep_(.+)_([^_]+)_\d{10,}$/);
          if (m) { ecepUid = ecepUid || m[1]; ecepDossier = ecepDossier || m[2]; }
        }
        if (ecepUid && ecepDossier) {
          await db.ref('ecep_accesos/' + ecepUid + '/' + ecepDossier).set(true);
          await db.ref('verified_payments/' + String(payment.id)).set({
            paymentId: String(payment.id),
            tipo: 'ecep',
            uid: ecepUid,
            dossier: ecepDossier,
            email: (metadata.user_email || (payment.payer && payment.payer.email) || ''),
            externalReference: payment.external_reference || '',
            status: 'approved',
            amount: payment.transaction_amount,
            currency: payment.currency_id,
            verifiedAt: paymentApprovedAt
          });
          console.log('ECEP acceso otorgado:', { uid: ecepUid, dossier: ecepDossier, paymentId: String(payment.id) });
          return res.status(200).send('ecep_ok');
        }
        console.error('ECEP payment sin uid/dossier', { ext: payment.external_reference, metadata: metadata });
        return res.status(200).send('ecep_no_identity');
      }

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
      let payerPlan = PLAN_PRICES[metadata.plan] ? metadata.plan : '';
      let currentPortfolio = {};

      if (payerUid) {
        const userSnap = await db.ref('users/' + payerUid).once('value');
        if (!userSnap.exists()) payerUid = '';
      }
      if (!payerUid && payerEmail) {
        payerUid = await findUidByEmail(db, payerEmail);
      }
      if (!isCourseRegistration && payerUid) {
        currentPortfolio = (await db.ref('portafolios/' + payerUid).once('value')).val() || {};
        if (!payerPlan && PLAN_PRICES[currentPortfolio.plan]) payerPlan = currentPortfolio.plan;
      }
      if (!payerPlan) payerPlan = 'completo';
      const portfolioClassification = isCourseRegistration ? null : classifyPortfolioPayment(payment, metadata, payerPlan, currentPortfolio);

      if (isCourseRegistration && !isExpectedMoney(payment, 30000)) {
        console.error('Course payment amount or currency mismatch', { paymentId: payment.id });
        return res.status(200).send('course_invalid_amount');
      }

      if (!isCourseRegistration && !payerUid) {
        console.error('Portfolio payment has no matching uid', { paymentId: payment.id, hasEmail: Boolean(payerEmail) });
        await db.ref('unmatched_payments/' + String(payment.id)).set({
          paymentId: String(payment.id),
          email: payerEmail || '',
          externalReference: payment.external_reference || '',
          status: 'approved_unmatched',
          amount: payment.transaction_amount,
          currency: payment.currency_id || '',
          plan: payerPlan,
          detectedAt: paymentApprovedAt,
          reason: 'uid_not_found'
        });
        return res.status(200).send('unmatched_identity');
      }

      if (portfolioClassification && !portfolioClassification.valid) {
        console.error('Portfolio payment amount or currency mismatch', {
          paymentId: payment.id,
          reason: portfolioClassification.reason,
          amount: payment.transaction_amount,
          currency: payment.currency_id,
          plan: payerPlan
        });
        await db.ref('unmatched_payments/' + String(payment.id)).set({
          paymentId: String(payment.id),
          uid: payerUid,
          email: payerEmail || '',
          externalReference: payment.external_reference || '',
          status: 'approved_invalid_amount',
          amount: payment.transaction_amount,
          currency: payment.currency_id || '',
          plan: payerPlan,
          detectedAt: paymentApprovedAt,
          reason: portfolioClassification.reason
        });
        return res.status(200).send('invalid_portfolio_payment');
      }
      if (portfolioClassification && portfolioClassification.type === 'saldo') {
        const amount = Number(payment.transaction_amount) || 0;
        if (!matchesPendingBalance(currentPortfolio, payment)) {
          await db.ref('unmatched_payments/' + String(payment.id)).set({
            paymentId: String(payment.id),
            uid: payerUid,
            status: 'approved_invalid_balance',
            amount: amount,
            currency: payment.currency_id || '',
            plan: payerPlan,
            detectedAt: paymentApprovedAt,
            reason: 'saldo_mismatch'
          });
          return res.status(200).send('invalid_portfolio_balance');
        }
      }

      // Store payment verification
      const paymentsRef = db.ref('verified_payments/' + String(payment.id));
      const existingPayment = (await paymentsRef.once('value')).val();
      if (!isCourseRegistration && existingPayment && existingPayment.uid && existingPayment.uid !== payerUid) {
        await db.ref('unmatched_payments/' + String(payment.id)).set({
          paymentId: String(payment.id),
          uid: payerUid,
          status: 'approved_identity_conflict',
          amount: payment.transaction_amount,
          currency: payment.currency_id || '',
          plan: payerPlan,
          detectedAt: paymentApprovedAt,
          reason: 'payment_already_claimed'
        });
        return res.status(200).send('payment_identity_conflict');
      }
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
        plan: payerPlan,
        paymentType: portfolioClassification ? portfolioClassification.type : 'curso'
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
        await applyPortfolioPayment(
          db,
          payerUid,
          payment,
          portfolioClassification.plan,
          portfolioClassification.type,
          paymentApprovedAt
        );
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

module.exports._test = {
  getNotificationId,
  classifyPortfolioPayment,
  getUidFromExternalReference,
  isExpectedMoney,
  matchesPendingBalance
};
