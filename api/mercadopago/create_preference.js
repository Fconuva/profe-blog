// Vercel / Netlify serverless style (Node.js)
// Requires environment variable: MERCADOPAGO_ACCESS_TOKEN, BASE_URL

const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, plan } = req.body;
    if (!email || !plan) return res.status(400).json({ error: 'Missing email or plan' });

    // Define plans/prices (CLP example)
    const plans = {
      'basic': { title: 'Acceso Completo ECEP 2025', price: 25000 },
      'pro': { title: 'Acceso Pro - ECEP', price: 40000 }
    };

    const chosen = plans[plan] || plans['basic'];

    const host = process.env.BASE_URL || `https://${req.headers.host}`;
    const notification_url = `${host}/api/mercadopago/webhook`;
    
    // Generate unique reference to allow multiple payments from same email
    const timestamp = Date.now();
    const uniqueRef = `${email}_${timestamp}`;

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
        success: `${host}/comprar/success/?email=${encodeURIComponent(email)}`,
        failure: `${host}/comprar/failure/`,
        pending: `${host}/comprar/pending/`
      },
      auto_return: 'approved',
      notification_url,
      external_reference: uniqueRef,  // Unique reference allows multiple payments
      statement_descriptor: 'ECEP 2025',  // What appears on credit card statement
      metadata: {
        user_email: email,
        user_name: name || '',
        payment_timestamp: timestamp
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
