// Vercel / Netlify serverless style (Node.js)
// Requires environment variable: MERCADOPAGO_ACCESS_TOKEN, BASE_URL

const { MercadoPagoConfig, Preference } = require('mercadopago');
const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  const sa = raw.trim().startsWith('{') ? JSON.parse(raw) : JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  admin.initializeApp({ credential: admin.credential.cert(sa), databaseURL: process.env.FIREBASE_DATABASE_URL });
  return admin;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // ===== ECEP: auto-reclamo de accesos cuando cambia el UID (misma cuenta Google) =====
    // Si a un docente le cambia el UID de Firebase (se borra su cuenta Auth y vuelve a
    // entrar), su acceso pagado queda atado al UID viejo. Aquí, con el ID token VERIFICADO,
    // migramos al UID actual todos los accesos de cualquier UID con el MISMO correo y
    // consolidamos (borramos los registros viejos duplicados). El docente solo puede
    // reclamar accesos que YA eran suyos (mismo correo verificado por Firebase). Lo llama
    // el gate del cliente cuando el acceso no aparece, antes de mostrar el paywall.
    if (req.body && req.body.tipo === 'reclaim') {
      const { idToken } = req.body;
      if (!idToken) return res.status(400).json({ error: 'Missing idToken' });
      let adminSdk;
      try { adminSdk = initFirebase(); } catch (e) { return res.status(500).json({ error: 'firebase_not_configured' }); }
      let decoded;
      try { decoded = await adminSdk.auth().verifyIdToken(idToken); }
      catch (e) { return res.status(401).json({ error: 'invalid_token' }); }
      const rUid = decoded.uid;
      const rEmail = String(decoded.email || '').toLowerCase().trim();
      if (!rEmail) return res.status(200).json({ reclaimed: 0, reason: 'no_email' });
      const db = adminSdk.database();
      const usuarios = (await db.ref('ecep_usuarios').once('value')).val() || {};
      const otherUids = Object.keys(usuarios).filter(function (u) {
        return u !== rUid && String((usuarios[u] || {}).email || '').toLowerCase().trim() === rEmail;
      });
      if (!otherUids.length) return res.status(200).json({ reclaimed: 0 });
      const merged = {};
      for (const ou of otherUids) {
        const acc = (await db.ref('ecep_accesos/' + ou).once('value')).val() || {};
        Object.keys(acc).forEach(function (did) { if (acc[did] === true) merged[did] = true; });
      }
      const cur = (await db.ref('ecep_accesos/' + rUid).once('value')).val() || {};
      const regalos = (await db.ref('ecep_regalos').once('value')).val() || {};
      const updates = {};
      let reclaimed = 0;
      Object.keys(merged).forEach(function (did) {
        if (cur[did] !== true) { updates['ecep_accesos/' + rUid + '/' + did] = true; reclaimed++; }
      });
      if (!usuarios[rUid]) { updates['ecep_usuarios/' + rUid + '/email'] = rEmail; }
      // si algún UID viejo era regalo, conservar la marca en el UID actual (para el KPI del admin)
      if (otherUids.some(function (ou) { return !!regalos[ou]; }) && !regalos[rUid]) {
        updates['ecep_regalos/' + rUid] = { fecha: new Date().toISOString().slice(0, 10), tipo: 'reclaim-uid-cambiado', dossiers: Object.keys(merged) };
      }
      // consolidar: borrar los registros viejos duplicados (mismo correo = misma persona)
      otherUids.forEach(function (ou) {
        updates['ecep_usuarios/' + ou] = null;
        updates['ecep_accesos/' + ou] = null;
        updates['ecep_regalos/' + ou] = null;
      });
      if (Object.keys(updates).length) await db.ref().update(updates);
      return res.status(200).json({ reclaimed: reclaimed, dossiers: Object.keys(merged) });
    }

    // ===== ECEP: preferencia para comprar UN dossier de estudio ($10.000) =====
    // El acceso se otorga solo cuando el webhook recibe el pago aprobado (metadata.ecep_dossier).
    if (req.body && (req.body.tipo === 'ecep' || req.body.dossier)) {
      const { uid, email, dossier, dossierName, returnPath } = req.body;
      if (!uid || !dossier) return res.status(400).json({ error: 'Missing uid or dossier' });
      const host = process.env.BASE_URL || `https://${req.headers.host}`;
      const back = (typeof returnPath === 'string' && returnPath.charAt(0) === '/') ? returnPath : '/evaluaciones/';
      const sep = back.indexOf('?') >= 0 ? '&' : '?';
      const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN, options: { timeout: 5000 } });
      const preference = new Preference(client);
      const ts = Date.now();
      const result = await preference.create({ body: {
        items: [{ title: 'Dossier de estudio ECEP — ' + (dossierName || dossier), quantity: 1, currency_id: 'CLP', unit_price: 10000 }],
        payer: email ? { email: email } : undefined,
        back_urls: {
          success: `${host}${back}${sep}pago=ok`,
          failure: `${host}${back}${sep}pago=error`,
          pending: `${host}${back}${sep}pago=pendiente`
        },
        auto_return: 'approved',
        notification_url: `${host}/api/mercadopago/webhook`,
        external_reference: `ecep_${uid}_${dossier}_${ts}`,
        statement_descriptor: 'Dossier ECEP',
        metadata: { tipo: 'ecep', ecep_uid: uid, ecep_dossier: dossier, user_email: email || '', payment_timestamp: ts }
      }});
      return res.status(200).json({ init_point: result.init_point, id: result.id });
    }

    const { name, email, plan, uid, tipo } = req.body;
    if (!email || !plan) return res.status(400).json({ error: 'Missing email or plan' });

    const esAbono = tipo === 'abono';

    // Portafolio Docente 2026 plans
    const plans = {
      'completo':  { title: 'Portafolio Completo (3 Módulos)', price: 199990 },
      'modulo1':   { title: 'Módulo 1 — Planificación', price: 79990 },
      'modulo2':   { title: 'Módulo 2 — Clase Grabada', price: 99990 },
      'modulo3':   { title: 'Módulo 3 — Reflexión', price: 79990 }
    };

    // Abono = 1ª cuota fija de $100.000 hacia el plan elegido (por defecto, completo)
    const chosen = esAbono
      ? { title: 'Abono 1ª cuota de 2 — Portafolio Docente 2026', price: 100000 }
      : (plans[plan] || plans['completo']);

    const host = process.env.BASE_URL || `https://${req.headers.host}`;
    const notification_url = `${host}/api/mercadopago/webhook`;
    
    // Generate unique reference to allow multiple payments from same email
    const timestamp = Date.now();
    const uniqueRef = uid ? `${uid}_${timestamp}` : `${email}_${timestamp}`;

    // Initialize client with new SDK
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });
    
    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          title: chosen.title,
          quantity: 1,
          currency_id: 'CLP',
          unit_price: Number(chosen.price)
        }
      ],
      payer: {
        email: email
      },
      back_urls: {
        success: `${host}/dashboard/index.html?payment=success`,
        failure: `${host}/dashboard/index.html?payment=failure`,
        pending: `${host}/dashboard/index.html?payment=pending`
      },
      auto_return: 'approved',
      notification_url,
      external_reference: uniqueRef,
      statement_descriptor: 'Portafolio 2026',
      metadata: {
        user_email: email,
        user_name: name || '',
        user_uid: uid || '',
        plan: plan,
        tipo: esAbono ? 'abono' : 'completo',
        payment_timestamp: timestamp
      },
      payment_methods: {
        installments: 6
      }
    };

    const result = await preference.create({ body: preferenceData });
    
    console.log('Preference created successfully:', {
      id: result.id,
      init_point: result.init_point,
      amount: chosen.price
    });
    
    return res.status(200).json({ 
      preference: result,
      debug: {
        amount: chosen.price,
        currency: 'CLP',
        email: email
      }
    });
  } catch (err) {
    console.error('create_preference error', err);
    console.error('Error details:', {
      message: err.message,
      cause: err.cause,
      status: err.status
    });
    return res.status(500).json({ error: 'internal_error', details: err.message, stack: err.stack });
  }
};
