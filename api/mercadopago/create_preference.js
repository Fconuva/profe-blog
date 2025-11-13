// Vercel / Netlify serverless style (Node.js)
// Requires environment variable: MERCADOPAGO_ACCESS_TOKEN, BASE_URL

const mercadopago = require('mercadopago');

// Configure using env var
mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, plan } = req.body;
    if (!email || !plan) return res.status(400).json({ error: 'Missing email or plan' });

    // Define plans/prices (CLP example)
    const plans = {
      'basic': { title: 'Acceso Básico - ECEP', price: 25000 },
      'pro': { title: 'Acceso Pro - ECEP', price: 40000 }
    };

    const chosen = plans[plan] || plans['basic'];

    const host = process.env.BASE_URL || (`https://${req.headers.host}`);
    const notification_url = `${host}/api/mercadopago/webhook`;

    const preference = {
      items: [
        {
          title: chosen.title,
          quantity: 1,
          currency_id: 'CLP',
          unit_price: Number(chosen.price)
        }
      ],
      payer: {
        name: name || '',
        email: email
      },
      back_urls: {
        success: `${host}/comprar/success/`,
        failure: `${host}/comprar/failure/`,
        pending: `${host}/comprar/pending/`
      },
      auto_return: 'approved',
      notification_url
    };

    const mpRes = await mercadopago.preferences.create(preference);
    return res.status(200).json({ preference: mpRes.body });
  } catch (err) {
    console.error('create_preference error', err);
    return res.status(500).json({ error: 'internal_error', details: err.message });
  }
};
