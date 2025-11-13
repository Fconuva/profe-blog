// Test endpoint to verify Mercado Pago configuration
module.exports = async (req, res) => {
  const hasToken = !!process.env.MERCADOPAGO_ACCESS_TOKEN;
  const hasBaseUrl = !!process.env.BASE_URL;
  const hasFirebase = !!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const hasDatabase = !!process.env.FIREBASE_DATABASE_URL;
  
  return res.status(200).json({
    status: 'ok',
    config: {
      MERCADOPAGO_ACCESS_TOKEN: hasToken ? 'configured' : 'missing',
      BASE_URL: hasBaseUrl ? process.env.BASE_URL : 'missing',
      FIREBASE_SERVICE_ACCOUNT_BASE64: hasFirebase ? 'configured' : 'missing',
      FIREBASE_DATABASE_URL: hasDatabase ? process.env.FIREBASE_DATABASE_URL : 'missing'
    }
  });
};
