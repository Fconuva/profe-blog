// Verify a MercadoPago payment by ID and apply it to the authenticated portfolio.
// Requires: MERCADOPAGO_ACCESS_TOKEN, FIREBASE_SERVICE_ACCOUNT_BASE64, FIREBASE_DATABASE_URL

const { MercadoPagoConfig, Payment } = require('mercadopago');
const admin = require('firebase-admin');

const PLANS = {
  completo: 199990,
  modulo1: 79990,
  modulo2: 99990,
  modulo3: 79990
};

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  const sa = raw.trim().startsWith('{')
    ? JSON.parse(raw)
    : JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  return admin;
}

function getUidFromExternalReference(externalReference) {
  const match = String(externalReference || '').trim().match(/^(.+)_\d{10,}$/);
  return match ? match[1] : '';
}

function classifyPortfolioPayment(payment, metadata, plan) {
  const planKey = PLANS[plan] ? plan : '';
  if (!planKey) return { valid: false, reason: 'plan' };
  const expected = PLANS[planKey];
  const amount = Number(payment && payment.transaction_amount) || 0;
  const currency = String((payment && payment.currency_id) || '').toUpperCase();
  if (currency !== 'CLP') return { valid: false, reason: 'currency', plan: planKey };
  if (amount <= 0 || amount > expected + 10000) return { valid: false, reason: 'amount', plan: planKey };
  if (metadata && metadata.tipo === 'saldo') {
    return amount <= expected
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
  // Compatibility with the former static first-instalment link.
  if (planKey === 'completo' && amount >= 90000 && amount <= 110000) {
    return { valid: true, type: 'abono', plan: planKey };
  }
  return { valid: false, reason: 'amount', plan: planKey };
}

function nextPortfolioPaymentState(current, payment, plan, paymentType, verifiedAt) {
  current = current || {};
  const planKey = PLANS[plan] ? plan : 'completo';
  const paymentId = String(payment.id);
  const amount = Number(payment.transaction_amount) || 0;
  const existingAbonos = Array.isArray(current.abonos) ? current.abonos.slice() : [];
  const alreadyApplied = String(current.comprobantePago || '') === paymentId
    || existingAbonos.some(function(item) {
      return String((item && (item.paymentId || item.id || item.op)) || '') === paymentId;
    });
  if (alreadyApplied) return current;
  if (['approved', 'aprobado', 'pagado'].includes(current.paymentStatus)) return current;

  if (paymentType === 'completo') {
    return Object.assign({}, current, {
      paymentStatus: 'approved',
      comprobantePago: paymentId,
      paidAt: verifiedAt,
      paymentVerifiedAt: verifiedAt,
      paymentConfirmedAt: verifiedAt,
      paymentAmount: amount,
      esAbono: null,
      saldoPendiente: null,
      plan: planKey
    });
  }

  const sumAbonos = existingAbonos.reduce(function(total, item) {
    return total + (Number(item && item.monto) || 0);
  }, 0);
  const previous = Math.max(
    Number(current.abonoAcumulado) || 0,
    Number(current.paymentAmount) || 0,
    sumAbonos
  );
  const total = previous + amount;
  existingAbonos.push({
    paymentId: paymentId,
    monto: amount,
    fecha: String(verifiedAt).slice(0, 10),
    medio: 'Mercado Pago'
  });
  const complete = total >= PLANS[planKey] - 10000;
  return Object.assign({}, current, {
    paymentStatus: complete ? 'approved' : 'abono',
    comprobantePago: paymentId,
    paidAt: verifiedAt,
    paymentVerifiedAt: verifiedAt,
    paymentConfirmedAt: verifiedAt,
    paymentAmount: total,
    abonoAcumulado: total,
    abonos: existingAbonos,
    esAbono: complete ? null : true,
    saldoPendiente: complete ? null : Math.max(0, PLANS[planKey] - total),
    plan: planKey
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { paymentId, uid, plan: requestedPlan, idToken } = req.body || {};
  if (!paymentId || !uid || !idToken) {
    return res.status(400).json({ verified: false, reason: 'Faltan datos de verificación' });
  }
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return res.status(500).json({ verified: false, reason: 'MercadoPago no está configurado en el servidor' });
  }

  try {
    const adminSdk = initFirebase();
    let decoded;
    try {
      decoded = await adminSdk.auth().verifyIdToken(idToken);
    } catch (authError) {
      return res.status(401).json({ verified: false, reason: 'La sesión expiró. Vuelve a iniciar sesión.' });
    }
    if (decoded.uid !== uid) {
      return res.status(403).json({ verified: false, reason: 'La cuenta no coincide con la ficha de pago' });
    }

    const db = adminSdk.database();
    const portfolioRef = db.ref('portafolios/' + uid);
    const currentPortfolio = (await portfolioRef.once('value')).val() || {};
    const plan = PLANS[currentPortfolio.plan]
      ? currentPortfolio.plan
      : (PLANS[requestedPlan] ? requestedPlan : '');
    if (!plan) return res.status(400).json({ verified: false, reason: 'El plan de la ficha no es válido' });

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });
    const paymentClient = new Payment(client);
    let payment;
    try {
      payment = await paymentClient.get({ id: String(paymentId) });
    } catch (mpError) {
      console.error('MP get payment error:', mpError.message);
      return res.json({ verified: false, reason: 'No se encontró un pago con el N° ' + paymentId });
    }
    if (payment.status !== 'approved') {
      return res.json({ verified: false, reason: 'El pago no está aprobado. Estado actual: ' + payment.status });
    }

    const metadata = payment.metadata || {};
    const linkedUid = metadata.user_uid || metadata.userUid || getUidFromExternalReference(payment.external_reference);
    const accountEmail = String(decoded.email || '').trim().toLowerCase();
    const linkedEmail = String(metadata.user_email || (payment.payer && payment.payer.email) || '').trim().toLowerCase();
    if (!linkedUid && !linkedEmail) {
      return res.json({ verified: false, reason: 'El pago no contiene una identidad verificable. Se revisará manualmente.' });
    }
    if (linkedUid && linkedUid !== uid) {
      return res.json({ verified: false, reason: 'Este pago pertenece a otra cuenta' });
    }
    if (accountEmail && linkedEmail && accountEmail !== linkedEmail) {
      return res.json({ verified: false, reason: 'El correo del pago pertenece a otra cuenta' });
    }

    const classification = classifyPortfolioPayment(payment, metadata, plan);
    if (!classification.valid) {
      const amount = Number(payment.transaction_amount) || 0;
      return res.json({
        verified: false,
        reason: classification.reason === 'currency'
          ? 'La moneda del pago no corresponde a CLP'
          : 'El monto ($' + amount.toLocaleString('es-CL') + ') no coincide con el plan'
      });
    }
    if (classification.type === 'saldo') {
      const pending = Number(currentPortfolio.saldoPendiente) || 0;
      const amount = Number(payment.transaction_amount) || 0;
      if (currentPortfolio.paymentStatus !== 'abono' || pending <= 0 || Math.abs(amount - pending) > 10000) {
        return res.json({ verified: false, reason: 'El pago no coincide con el saldo pendiente de esta ficha' });
      }
    }

    const usedRef = db.ref('verified_payments/' + String(payment.id));
    const usedPayment = (await usedRef.once('value')).val();
    if (usedPayment && usedPayment.uid && usedPayment.uid !== uid) {
      return res.json({ verified: false, reason: 'Este comprobante ya fue utilizado por otra cuenta' });
    }

    const verifiedAt = new Date().toISOString();
    await portfolioRef.transaction(function(current) {
      return nextPortfolioPaymentState(current, payment, plan, classification.type, verifiedAt);
    });
    await usedRef.update({
      paymentId: String(payment.id),
      uid: uid,
      amount: payment.transaction_amount,
      currency: payment.currency_id || 'CLP',
      payerEmail: (payment.payer && payment.payer.email) || '',
      status: 'approved',
      verifiedAt: verifiedAt,
      plan: plan,
      paymentType: classification.type
    });

    console.log('Payment auto-verified:', {
      paymentId: payment.id,
      uid: uid,
      plan: plan,
      paymentType: classification.type,
      amount: payment.transaction_amount
    });
    return res.json({
      verified: true,
      amount: payment.transaction_amount,
      paymentType: classification.type
    });
  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ verified: false, reason: 'Error del servidor al verificar' });
  }
};

module.exports._test = {
  classifyPortfolioPayment,
  getUidFromExternalReference,
  nextPortfolioPaymentState
};
