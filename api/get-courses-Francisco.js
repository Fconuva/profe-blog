// Firebase Admin SDK Configuration
const admin = require('firebase-admin');

function initializeFirebase() {
    // Si ya hay una app inicializada, usarla
    if (admin.apps.length > 0) {
        console.log('✅ Using existing Firebase instance');
        return admin.apps[0];
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
        if (privateKey && privateKey.includes('\\n')) {
            console.log('🔄 Converting \\n literals to line breaks');
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        // Validar formato de clave
        if (!privateKey || !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
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

        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://profe-blog-default-rtdb.firebaseio.com"
        });

        console.log('✅ Firebase initialized successfully');
        return app;
    } catch (error) {
        console.error('❌ Firebase init error:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
}

function getDatabase() {
    initializeFirebase();
    return admin.database();
}

export default async function handler(req, res) {
    const startTime = Date.now();
    console.log('⏱️ get-courses-Francisco started');

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { username } = req.query;

        if (!username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }

        console.log(`📥 Fetching courses for ${username}`);
        const db = getDatabase();

        // Buscar usuario
        const usersRef = db.ref('users');
        const userSnapshot = await usersRef.orderByChild('username').equalTo(username).once('value');

        let userId;
        if (!userSnapshot.exists()) {
            console.log(`✨ No user found, creating ${username}`);
            // Crear nuevo usuario
            const newUserRef = usersRef.push();
            userId = newUserRef.key;
            await newUserRef.set({
                username: username,
                createdAt: Date.now()
            });
        } else {
            const userData = userSnapshot.val();
            userId = Object.keys(userData)[0];
            console.log(`✓ Found user: ${userId}`);
        }

        // Obtener cursos del usuario
        const coursesRef = db.ref('courses');
        const coursesSnapshot = await coursesRef.orderByChild('userId').equalTo(userId).once('value');

        const courses = [];
        if (coursesSnapshot.exists()) {
            coursesSnapshot.forEach((childSnapshot) => {
                const course = childSnapshot.val();
                courses.push({
                    id: course.id || childSnapshot.key,
                    courseName: course.courseName,
                    subject: course.subject,
                    period: course.period,
                    students: course.students || [],
                    tasks: course.tasks || [],
                    config: course.config || {
                        minGrade: 1.0,
                        maxGrade: 7.0,
                        passingGrade: 4.0,
                        passingPercentage: 60
                    },
                    createdAt: course.createdAt,
                    updatedAt: course.updatedAt
                });
            });
        }

        const elapsed = Date.now() - startTime;
        console.log(`✅ Retrieved ${courses.length} courses in ${elapsed}ms`);

        res.status(200).json({
            success: true,
            courses: courses,
            userId: userId,
            username: username,
            elapsed: elapsed
        });

    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error(`❌ Error after ${elapsed}ms:`, error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            error: 'Failed to fetch courses',
            details: error.message,
            elapsed: elapsed
        });
    }
}