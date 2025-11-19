// API para obtener cursos de Francisco desde Firebase
import admin from 'firebase-admin';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8')
    );
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
    });
  } catch (error) {
    console.error('Error inicializando Firebase:', error);
  }
}

export default async function handler(req, res) {
  console.log('🔵 API get-courses-Francisco invocada');
  
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
