const admin = require('firebase-admin');
const {
  COURSE_KEY,
  COURSE_PRICE,
  ALL_DATE_OPTIONS,
  MEET_LINKS,
  buildReceiptNumber
} = require('./docente-creador-config');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;

  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountBase64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 not set');
  }

  let serviceAccount;
  if (serviceAccountBase64.trim().startsWith('{')) {
    serviceAccount = JSON.parse(serviceAccountBase64);
  } else {
    const json = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
    serviceAccount = JSON.parse(json);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });

  return admin;
}

function normalizeText(value) {
  return String(value || '').trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch (error) {
      return res.status(400).json({ ok: false, error: 'Body inválido' });
    }
  }

  const email = normalizeText(body.email).toLowerCase();
  const fecha = normalizeText(body.fecha);
  const registrationId = normalizeText(body.registrationId);
  const receiptNumber = normalizeText(body.receiptNumber).toUpperCase();

  if (!fecha) {
    return res.status(400).json({ ok: false, error: 'La fecha es obligatoria.' });
  }

  if (!registrationId && (!email || !receiptNumber)) {
    return res.status(400).json({ ok: false, error: 'Ingresa el correo y el código del comprobante.' });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Ingresa un correo válido.' });
  }

  if (!ALL_DATE_OPTIONS[fecha]) {
    return res.status(400).json({ ok: false, error: 'Selecciona una fecha válida.' });
  }

  try {
    const adminSdk = initFirebase();
    const db = adminSdk.database();
    const baseRef = db.ref('course_registrations/' + COURSE_KEY);

    let found = null;
    if (registrationId) {
      const byIdSnap = await baseRef.child(registrationId).once('value');
      if (byIdSnap.exists()) {
        const value = byIdSnap.val() || {};
        const emailMatches = !email || normalizeText(value.email).toLowerCase() === email;
        const storedReceipt = value.receiptNumber || buildReceiptNumber(registrationId, fecha);
        const receiptMatches = !receiptNumber || storedReceipt.toUpperCase() === receiptNumber;
        if (value.selectedDate === fecha && emailMatches && receiptMatches) {
          found = { id: registrationId, ...value };
        }
      }
    }

    if (!found && email && receiptNumber) {
      const snap = await baseRef.orderByChild('email').equalTo(email).once('value');
      snap.forEach((child) => {
        const value = child.val() || {};
        const storedReceipt = value.receiptNumber || buildReceiptNumber(child.key, fecha);
        const receiptMatches = !receiptNumber || storedReceipt.toUpperCase() === receiptNumber;
        if (!found && value.selectedDate === fecha && receiptMatches) {
          found = { id: child.key, ...value };
        }
      });
    }

    if (!found) {
      return res.status(200).json({
        ok: true,
        found: false,
        status: 'not_found',
        message: 'No encontramos una inscripción para ese correo y fecha.'
      });
    }

    const response = {
      ok: true,
      found: true,
      id: found.id,
      receiptNumber: found.receiptNumber || buildReceiptNumber(found.id, fecha),
      nombre: found.nombre || '',
      email: found.email || email || '',
      selectedDate: fecha,
      selectedDateLabel: found.selectedDateLabel || ALL_DATE_OPTIONS[fecha],
      status: found.paymentStatus || found.status || 'pending_checkout',
      paymentId: found.paymentId || found.mercadoPagoPaymentId || '',
      amount: Number(found.amount || COURSE_PRICE)
    };

    if (response.status === 'approved') {
      const meetLink = MEET_LINKS[fecha] || '';
      return res.status(200).json({
        ...response,
        canJoin: Boolean(meetLink),
        meetLink,
        schedule: 'Fecha y horario informados al confirmar la cohorte.',
        message: meetLink
          ? 'Inscripción confirmada. Entra a la clase con el correo inscrito.'
          : 'Inscripción confirmada. Recibirás la fecha, el horario y el acceso de la clase en tu correo.'
      });
    }

    if (response.status === 'pending_checkout') {
      const holdUntilMs = Number(found.holdUntilMs || 0);
      const holdActive = holdUntilMs > Date.now();
      return res.status(200).json({
        ...response,
        canJoin: false,
        holdActive,
        checkoutUrl: found.checkoutUrl || '',
        message: holdActive
          ? 'Tu reserva está pendiente de pago. Completa el pago para confirmar el cupo.'
          : 'La reserva expiró por falta de pago. Debes iniciar una nueva inscripción.'
      });
    }

    return res.status(200).json({
      ...response,
      canJoin: false,
      message: 'Tu inscripción existe, pero aún no está en estado aprobado.'
    });
  } catch (error) {
    console.error('Docente Creador status error:', error);
    return res.status(500).json({ ok: false, error: 'No se pudo consultar la inscripción en este momento.' });
  }
};
