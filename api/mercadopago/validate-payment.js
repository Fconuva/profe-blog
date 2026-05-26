// Public API to validate a payment receipt by ID
// Requires: FIREBASE_SERVICE_ACCOUNT_BASE64, FIREBASE_DATABASE_URL

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

const PLAN_NAMES = {
  completo: 'Portafolio Completo',
  modulo1: 'Módulo 1 — Planificación',
  modulo2: 'Módulo 2 — Clase Grabada',
  modulo3: 'Módulo 3 — Reflexión'
};

module.exports = async (req, res) => {
  // CORS configuration (allow any domain to validate, e.g. mobile scanners)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'GET only' });
  }

  const { id } = req.query || {};
  if (!id) {
    return res.status(400).json({ valid: false, reason: 'Falta ID de comprobante' });
  }

  try {
    const adminSdk = initFirebase();
    const db = adminSdk.database();

    // 1. Check in verified_payments first
    const verifiedSnap = await db.ref('verified_payments/' + String(id)).once('value');
    const payment = verifiedSnap.val();

    if (payment) {
      // Fetch user's name
      const userSnap = await db.ref('users/' + payment.uid).once('value');
      const user = userSnap.val() || {};

      return res.json({
        valid: true,
        payment: {
          id: payment.paymentId,
          amount: payment.amount,
          plan: PLAN_NAMES[payment.plan] || payment.plan,
          verifiedAt: payment.verifiedAt,
          clientName: user.nombre || 'Docente'
        }
      });
    }

    // 2. If not found in verified_payments, it might be a manually approved payment in portafolios node.
    // Let's do a search on portafolios node to find any portfolio where comprobantePago === id.
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

      return res.json({
        valid: true,
        payment: {
          id: String(id),
          amount: foundPort.paymentAmount || 199990, // Fallback if missing
          plan: PLAN_NAMES[foundPort.plan] || foundPort.plan,
          verifiedAt: foundPort.paymentVerifiedAt || foundPort.paymentConfirmedAt || new Date().toISOString(),
          clientName: user.nombre || 'Docente'
        }
      });
    }

    // 3. Not found anywhere
    return res.json({ valid: false, reason: 'Comprobante no encontrado o no aprobado aún' });

  } catch (err) {
    console.error('validate-payment API error:', err);
    return res.status(500).json({ valid: false, reason: 'Error del servidor' });
  }
};
