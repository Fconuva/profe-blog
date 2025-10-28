// Firebase Admin SDK Configuration
const admin = require('firebase-admin');

let firebaseApp;

function initializeFirebase() {
    const startTime = Date.now();

    if (firebaseApp) {
        console.log('✅ Using cached Firebase instance');
        return firebaseApp;
    }

    try {
        console.log('🔧 Initializing Firebase...');

        // Validar variables de entorno críticas
        const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL'];
        for (const varName of requiredVars) {
            if (!process.env[varName]) {
                throw new Error(`Missing required environment variable: ${varName}`);
            }
        }

        // Configuración desde variables de entorno de Vercel
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        // Manejar diferentes formatos de la clave privada
        // Si tiene \n literales (como strings), convertirlos a saltos de línea reales
        if (privateKey.includes('\\n')) {
            console.log('🔄 Converting \\n literals to line breaks');
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        // Validar formato de clave
        if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            throw new Error('Invalid FIREBASE_PRIVATE_KEY format');
        }

        const serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: privateKey,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
        };

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://profe-blog-default-rtdb.firebaseio.com"
        });

        const elapsed = Date.now() - startTime;
        console.log(`✅ Firebase initialized in ${elapsed}ms`);
        return firebaseApp;
    } catch (error) {
        console.error('❌ Firebase init error:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
}

function getDatabase() {
    if (!firebaseApp) {
        initializeFirebase();
    }
    return admin.database();
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { username, lastUpdate } = req.query;

        if (!username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }

        const db = getDatabase();

        // Buscar usuario
        const usersRef = db.ref('users');
        const userSnapshot = await usersRef.orderByChild('username').equalTo(username).once('value');

        if (!userSnapshot.exists()) {
            res.status(200).json({
                hasUpdates: false,
                message: 'User not found'
            });
            return;
        }

        const userData = userSnapshot.val();
        const userId = Object.keys(userData)[0];

        // Obtener cursos del usuario
        const coursesRef = db.ref('courses');
        const coursesSnapshot = await coursesRef.orderByChild('userId').equalTo(userId).once('value');

        if (!coursesSnapshot.exists()) {
            res.status(200).json({
                hasUpdates: false,
                courses: []
            });
            return;
        }

        // Si hay lastUpdate, verificar si hay cambios
        let hasUpdates = false;
        if (lastUpdate) {
            coursesSnapshot.forEach((childSnapshot) => {
                const course = childSnapshot.val();
                if (course.updatedAt && new Date(course.updatedAt) > new Date(lastUpdate)) {
                    hasUpdates = true;
                }
            });
        } else {
            hasUpdates = true; // Sin lastUpdate, consideramos que hay actualizaciones
        }

        const courses = [];
        coursesSnapshot.forEach((childSnapshot) => {
            const course = childSnapshot.val();
            courses.push({
                id: course.id || childSnapshot.key,
                courseName: course.courseName,
                updatedAt: course.updatedAt
            });
        });

        res.status(200).json({
            hasUpdates: hasUpdates,
            courses: courses,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error in check-updates-Francisco:', error);
        res.status(500).json({
            error: 'Failed to check updates',
            details: error.message
        });
    }
}