const admin = require('firebase-admin');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const COURSE_KEY = 'docente_creador';
const COURSE_SLUG = 'docente-creador';
const COURSE_PRICE = 30000;
const MAX_CAPACITY = 150;
const HOLD_MINUTES = 30;
const DATE_OPTIONS = {
  '2026-06-06': 'Sábado 6 de junio',
  '2026-06-20': 'Sábado 20 de junio'
};

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

function getHost(req) {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.headers.host;
  return `https://${host}`;
}

function countsAsReserved(registration, nowMs) {
  if (!registration) return false;
  if (registration.paymentStatus === 'approved') return true;
  return registration.paymentStatus === 'pending_checkout' && Number(registration.holdUntilMs || 0) > nowMs;
}

async function findExistingByEmailAndDate(baseRef, email, selectedDate) {
  const snap = await baseRef.orderByChild('email').equalTo(email).once('value');
  let found = null;
  snap.forEach((child) => {
    const value = child.val() || {};
    if (!found && value.selectedDate === selectedDate) {
      found = { id: child.key, ...value };
    }
  });
  return found;
}

async function countReservedForDate(baseRef, selectedDate) {
  const nowMs = Date.now();
  const snap = await baseRef.once('value');
  let total = 0;
  snap.forEach((child) => {
    const value = child.val() || {};
    if (value.selectedDate === selectedDate && countsAsReserved(value, nowMs)) total += 1;
  });
  return total;
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

  const fecha = normalizeText(body.fecha);
  const nombre = normalizeText(body.nombre);
  const email = normalizeText(body.email).toLowerCase();
  const telefono = normalizeText(body.telefono);
  const rol = normalizeText(body.rol);
  const establecimiento = normalizeText(body.establecimiento);
  const experienciaIa = normalizeText(body.experienciaIa);
  const objetivo = normalizeText(body.objetivo);
  const region = normalizeText(body.region);
  const comuna = normalizeText(body.comuna);
  const nivelEducativo = normalizeText(body.nivelEducativo);
  const asignatura = normalizeText(body.asignatura);
  const tipoEstablecimiento = normalizeText(body.tipoEstablecimiento);
  const aniosDocencia = normalizeText(body.aniosDocencia);
  const website = normalizeText(body.website);
  const consent = body.consent === true;

  if (website) {
    return res.status(200).json({ ok: true, alreadyRegistered: false });
  }

  if (!fecha || !nombre || !email || !telefono || !rol || !experienciaIa || !objetivo) {
    return res.status(400).json({ ok: false, error: 'Completa todos los campos obligatorios.' });
  }

  if (!DATE_OPTIONS[fecha]) {
    return res.status(400).json({ ok: false, error: 'Selecciona una fecha válida para el taller.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Ingresa un correo válido.' });
  }

  if (!consent) {
    return res.status(400).json({ ok: false, error: 'Debes aceptar el contacto para continuar.' });
  }

  try {
    const adminSdk = initFirebase();
    const db = adminSdk.database();
    const baseRef = db.ref('course_registrations/' + COURSE_KEY);
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return res.status(500).json({ ok: false, error: 'MercadoPago no está configurado en el servidor.' });
    }

    const existing = await findExistingByEmailAndDate(baseRef, email, fecha);
    if (existing && existing.paymentStatus === 'approved') {
      return res.status(409).json({ ok: false, error: 'Ya tienes un cupo confirmado para esa fecha con este correo.' });
    }

    if (existing && countsAsReserved(existing, nowMs) && existing.checkoutUrl) {
      const reservedForDate = await countReservedForDate(baseRef, fecha);
      return res.status(200).json({
        ok: true,
        alreadyRegistered: true,
        checkoutUrl: existing.checkoutUrl,
        selectedDateLabel: DATE_OPTIONS[fecha],
        remainingSeats: Math.max(0, MAX_CAPACITY - reservedForDate)
      });
    }

    const reservedCount = await countReservedForDate(baseRef, fecha);
    if (reservedCount >= MAX_CAPACITY) {
      return res.status(409).json({ ok: false, error: 'Esta sesión ya alcanzó el máximo de 150 cupos.' });
    }

    const host = getHost(req);
    const notificationUrl = `${host}/api/mercadopago/webhook`;
    const registrationRef = existing ? baseRef.child(existing.id) : baseRef.push();
    const registrationId = registrationRef.key;
    const holdUntilMs = nowMs + HOLD_MINUTES * 60 * 1000;
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });
    const preference = new Preference(client);
    const preferencePayload = {
      items: [
        {
          title: `Docente Creador — ${DATE_OPTIONS[fecha]}`,
          quantity: 1,
          currency_id: 'CLP',
          unit_price: COURSE_PRICE
        }
      ],
      payer: {
        email
      },
      back_urls: {
        success: `${host}/docente-creador/?payment=success&registration=${registrationId}&date=${encodeURIComponent(fecha)}`,
        failure: `${host}/docente-creador/?payment=failure&registration=${registrationId}&date=${encodeURIComponent(fecha)}`,
        pending: `${host}/docente-creador/?payment=pending&registration=${registrationId}&date=${encodeURIComponent(fecha)}`
      },
      auto_return: 'approved',
      notification_url: notificationUrl,
      external_reference: `${COURSE_SLUG}_${registrationId}_${nowMs}`,
      statement_descriptor: 'DOCENTE CREADOR',
      metadata: {
        course: COURSE_SLUG,
        registration_type: 'curso',
        registration_id: registrationId,
        selected_date: fecha,
        selected_date_label: DATE_OPTIONS[fecha],
        user_email: email,
        user_name: nombre,
        user_phone: telefono,
        user_role: rol,
        user_region: region,
        user_level: nivelEducativo
      },
      payment_methods: {
        installments: 6
      }
    };

    const result = await preference.create({ body: preferencePayload });

    await registrationRef.set({
      course: COURSE_SLUG,
      nombre,
      email,
      telefono,
      rol,
      establecimiento,
      experienciaIa,
      objetivo,
      region,
      comuna,
      nivelEducativo,
      asignatura,
      tipoEstablecimiento,
      aniosDocencia,
      consent,
      selectedDate: fecha,
      selectedDateLabel: DATE_OPTIONS[fecha],
      status: 'pending_checkout',
      paymentStatus: 'pending_checkout',
      amount: COURSE_PRICE,
      capacityLimit: MAX_CAPACITY,
      preferenceId: result.id,
      checkoutUrl: result.init_point,
      holdUntilMs,
      source: 'landing-docente-creador',
      createdAt: existing && existing.createdAt ? existing.createdAt : nowIso,
      createdAtMs: existing && existing.createdAtMs ? existing.createdAtMs : nowMs,
      updatedAt: nowIso,
      updatedAtMs: nowMs,
      userAgent: req.headers['user-agent'] || '',
      referer: req.headers.referer || ''
    });

    return res.status(200).json({
      ok: true,
      alreadyRegistered: false,
      id: registrationId,
      checkoutUrl: result.init_point,
      selectedDateLabel: DATE_OPTIONS[fecha],
      remainingSeats: Math.max(0, MAX_CAPACITY - (reservedCount + 1))
    });
  } catch (error) {
    console.error('Docente Creador signup error:', error);
    return res.status(500).json({ ok: false, error: 'No se pudo registrar la reserva en este momento.' });
  }
};