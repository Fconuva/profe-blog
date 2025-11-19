// API para guardar cursos de Francisco en Firebase
const admin = require('firebase-admin');

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

module.exports = async function handler(req, res) {
  console.log('🔵 API save-courses-Francisco invocada');
  
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
};
