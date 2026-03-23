// Vercel / Netlify serverless style (Node.js)
// Requires environment variable: MERCADOPAGO_ACCESS_TOKEN, BASE_URL

const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, plan, uid } = req.body;
    if (!email || !plan) return res.status(400).json({ error: 'Missing email or plan' });

    // Portafolio Docente 2026 plans
    const plans = {
      'completo':  { title: 'Portafolio Completo (3 Módulos)', price: 199990 },
      'modulo1':   { title: 'Módulo 1 — Planificación', price: 79990 },
      'modulo2':   { title: 'Módulo 2 — Clase Grabada', price: 99990 },
      'modulo3':   { title: 'Módulo 3 — Reflexión', price: 79990 }
    };

    const chosen = plans[plan] || plans['basic'];

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
        failure: `${host}/cuenta/crear-cuenta.html?payment=failure`,
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
