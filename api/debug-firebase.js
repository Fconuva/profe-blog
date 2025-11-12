// Debug endpoint para ver estructura de Firebase
const admin = require('firebase-admin');

function initializeFirebase() {
    if (admin.apps.length > 0) {
        return admin.apps[0];
    }

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

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://profe-blog-default-rtdb.firebaseio.com"
    });
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        initializeFirebase();
        const db = admin.database();

        // Obtener TODOS los usuarios
        const usersSnapshot = await db.ref('users').once('value');
        const users = usersSnapshot.val();

        // Obtener TODOS los cursos
        const coursesSnapshot = await db.ref('courses').once('value');
        const courses = coursesSnapshot.val();

        res.status(200).json({
            message: 'Firebase Debug Info',
            timestamp: new Date().toISOString(),
            users: users,
            courses: courses,
            userCount: users ? Object.keys(users).length : 0,
            courseCount: courses ? Object.keys(courses).length : 0
        });

    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
}
