// API para obtener cursos de Francisco desde Firebase
import admin from 'firebase-admin';

export default async function handler(req, res) {
  console.log('🔵 API get-courses-Francisco invocada');
  
  // Inicializar Firebase Admin si no está inicializado
  if (!admin.apps.length) {
    try {
      console.log('🔧 Inicializando Firebase Admin...');

      let raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!raw) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 o FIREBASE_SERVICE_ACCOUNT no están configuradas');
      }

      // Detectar raw JSON vs base64
      let serviceAccountJson;
      if (raw.trim().startsWith('{')) {
        serviceAccountJson = raw;
        console.log('ℹ️ Usando credencial Firebase desde RAW JSON en env');
      } else {
        const decoded = Buffer.from(raw, 'base64').toString('utf-8');
        serviceAccountJson = decoded;
        console.log('ℹ️ Usando credencial Firebase desde BASE64 en env');
      }

      try {
        const parsed = JSON.parse(serviceAccountJson);
        if (parsed && parsed.private_key && parsed.private_key.includes('\\n')) {
          console.log('⚠️ private_key contiene "\\n"; aplicando sanitización (\\\n → salto de línea)');
          parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        var serviceAccount = parsed;
      } catch (err) {
        console.error('❌ Error parseando JSON de credencial Firebase:', err.message);
        throw err;
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
      });
      
      console.log('✅ Firebase Admin inicializado');
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error.message);
      return res.status(500).json({
        error: 'Error de configuración de Firebase',
        message: error.message
      });
    }
  }
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ 
        error: 'Falta parámetro username',
        usage: '/api/get-courses-Francisco?username=francisco_fconuva'
      });
    }

    // Obtener de Firebase Realtime Database
    const db = admin.database();
    const ref = db.ref(`courses/${username}`);
    
    const snapshot = await ref.once('value');
    const data = snapshot.val();

    if (!data || !data.courses) {
      console.log(`⚠️ No hay cursos para ${username}`);
      return res.status(200).json({
        success: true,
        courses: [],
        message: 'No hay cursos guardados'
      });
    }

    console.log(`✅ Cursos obtenidos para ${username}: ${data.courses.length} cursos`);

    return res.status(200).json({
      success: true,
      courses: data.courses,
      lastUpdated: data.lastUpdated,
      count: data.courses.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo cursos:', error);
    return res.status(500).json({
      error: 'Error obteniendo cursos',
      message: error.message
    });
  }
}
