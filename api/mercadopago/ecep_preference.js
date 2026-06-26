// Crea una preferencia de Mercado Pago para comprar UN dossier ECEP ($20.000).
// El acceso se otorga solo (sin intervención del admin) cuando el webhook recibe el pago aprobado.
// Requiere env: MERCADOPAGO_ACCESS_TOKEN, BASE_URL (opcional).

const { MercadoPagoConfig, Preference } = require('mercadopago');

const PRECIO_DOSSIER = 20000; // CLP, pago único por dossier

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { uid, email, dossier, dossierName, returnPath } = req.body || {};
    if (!uid || !dossier) return res.status(400).json({ error: 'Missing uid or dossier' });

    const host = process.env.BASE_URL || `https://${req.headers.host}`;
    // returnPath debe ser una ruta interna (la página del dossier); si no, al panel.
    const back = (typeof returnPath === 'string' && returnPath.charAt(0) === '/') ? returnPath : '/evaluaciones/';
    const sep = back.indexOf('?') >= 0 ? '&' : '?';

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: { timeout: 5000 }
    });
    const preference = new Preference(client);
    const timestamp = Date.now();

    const result = await preference.create({
      body: {
        items: [{
          title: 'Dossier de estudio ECEP — ' + (dossierName || dossier),
          quantity: 1,
          currency_id: 'CLP',
          unit_price: PRECIO_DOSSIER
        }],
        payer: email ? { email: email } : undefined,
        back_urls: {
          success: `${host}${back}${sep}pago=ok`,
          failure: `${host}${back}${sep}pago=error`,
          pending: `${host}${back}${sep}pago=pendiente`
        },
        auto_return: 'approved',
        notification_url: `${host}/api/mercadopago/webhook`,
        external_reference: `ecep_${uid}_${dossier}_${timestamp}`,
        statement_descriptor: 'Dossier ECEP',
        metadata: {
          tipo: 'ecep',
          ecep_uid: uid,
          ecep_dossier: dossier,
          user_email: email || '',
          payment_timestamp: timestamp
        }
      }
    });

    return res.status(200).json({ init_point: result.init_point, id: result.id });
  } catch (err) {
    console.error('ecep_preference error', err && err.message, err && err.cause);
    return res.status(500).json({ error: 'internal_error', details: err && err.message });
  }
};
