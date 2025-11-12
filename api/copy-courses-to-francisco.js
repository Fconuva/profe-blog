const admin = require('firebase-admin');

// Configuración de credenciales desde variables de entorno
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Inicializar Firebase
    const app = initializeFirebase();
    const db = admin.database(app);

    // ID del usuario antiguo (tiene los cursos completos)
    const oldUserId = '-OcBJdvJ6HgRHArZ2Ikp';
    
    // ID del nuevo usuario francisco_fconuva
    const newUserId = '-OdsATkXfhtj0eBePQwU';

    // Obtener todos los cursos del usuario antiguo
    const coursesRef = db.ref('courses');
    const snapshot = await coursesRef.once('value');
    const allCourses = snapshot.val() || {};

    const coursesToCopy = [];
    const copiedCourses = [];

    // Filtrar cursos del usuario antiguo
    for (const [courseId, course] of Object.entries(allCourses)) {
      if (course.userId === oldUserId) {
        coursesToCopy.push({ id: courseId, data: course });
      }
    }

    console.log(`Encontrados ${coursesToCopy.length} cursos para copiar`);

    // Copiar cada curso al nuevo usuario
    for (const course of coursesToCopy) {
      const newCourseData = {
        ...course.data,
        userId: newUserId, // Cambiar al nuevo usuario
        updatedAt: Date.now()
      };

      // Crear nuevo curso con ID único
      const newCourseRef = db.ref('courses').push();
      await newCourseRef.set(newCourseData);

      copiedCourses.push({
        oldId: course.id,
        newId: newCourseRef.key,
        courseName: course.data.courseName,
        studentCount: course.data.students ? course.data.students.length : 0,
        taskCount: course.data.tasks ? course.data.tasks.length : 0
      });

      console.log(`✓ Copiado: ${course.data.courseName} (${course.data.students?.length || 0} estudiantes, ${course.data.tasks?.length || 0} tareas)`);
    }

    // Eliminar el curso vacío antiguo si existe
    const emptyOldCourseId = '-OdsAUE1rq5KX00KV7r-';
    await db.ref(`courses/${emptyOldCourseId}`).remove();
    console.log('✓ Eliminado curso vacío antiguo');

    return res.status(200).json({
      success: true,
      message: 'Cursos copiados exitosamente',
      fromUserId: oldUserId,
      toUserId: newUserId,
      coursesCount: copiedCourses.length,
      courses: copiedCourses
    });

  } catch (error) {
    console.error('Error copiando cursos:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};
