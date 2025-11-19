// API para guardar cursos de Francisco en Firebase
// Actualizado: Nov 19, 2025 - Variables de entorno configuradas
import admin from 'firebase-admin';

export default async function handler(req, res) {
  console.log('🔵 API save-courses-Francisco invocada');
  
  // Inicializar Firebase Admin si no está inicializado
  if (!admin.apps.length) {
    try {
      console.log('🔧 Inicializando Firebase Admin...');

      // Soporta varias formas de configurar la credencial:
      // 1) FIREBASE_SERVICE_ACCOUNT_BASE64 (base64 con JSON)
      // 2) FIREBASE_SERVICE_ACCOUNT (raw JSON)
      // 3) FIREBASE_SERVICE_ACCOUNT_BASE64 puede contener \n como texto — reemplazar por saltos reales
      let raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.FIREBASE_SERVICE_ACCOUNT;
      if (!raw) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 o FIREBASE_SERVICE_ACCOUNT no están configuradas');
      }

      // Detectar si raw parece JSON sin base64 (comienza con '{')
      let serviceAccountJson;
      if (raw.trim().startsWith('{')) {
        serviceAccountJson = raw;
        console.log('ℹ️ Usando credencial Firebase desde RAW JSON en env');
      } else {
        // Intentar decodificar base64
        const decoded = Buffer.from(raw, 'base64').toString('utf-8');
        serviceAccountJson = decoded;
        console.log('ℹ️ Usando credencial Firebase desde BASE64 en env');
      }

      // Si la private_key contiene la secuencia de dos caracteres "\\n" reemplazarla por saltos reales
      try {
        const parsed = JSON.parse(serviceAccountJson);
        if (parsed && parsed.private_key && parsed.private_key.includes('\\n')) {
          console.log('⚠️ private_key contiene "\\n"; aplicando sanitización (\\\n → salto de línea)');
          parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
        }
        // Quick health checks for private_key format (no secrets)
        if (!parsed.private_key || !parsed.private_key.includes('BEGIN PRIVATE KEY')) {
          console.error('❌ private_key no parece tener BEGIN PRIVATE KEY');
          throw new Error('private_key malformed (no BEGIN header)');
        }
        // Convertir a objeto final
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { username, courses } = req.body;

    if (!username || !courses) {
      return res.status(400).json({ 
        error: 'Faltan parámetros requeridos',
        required: ['username', 'courses']
      });
    }

    // Guardar en Firebase Realtime Database
    const db = admin.database();
    const ref = db.ref(`courses/${username}`);
    
    await ref.set({
      courses: courses,
      lastUpdated: admin.database.ServerValue.TIMESTAMP,
      updatedBy: 'francisco'
    });

    console.log(`✅ Cursos guardados para ${username}: ${courses.length} cursos`);

    return res.status(200).json({
      success: true,
      message: 'Cursos guardados exitosamente',
      count: courses.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error guardando cursos:', error);
    return res.status(500).json({
      error: 'Error guardando cursos',
      message: error.message
    });
  }
}
