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
    console.log('⏱️ save-courses-Francisco started');

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { courses, username } = req.body;

        if (!courses || !Array.isArray(courses)) {
            res.status(400).json({ error: 'Courses array is required' });
            return;
        }

        if (!username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }

        console.log(`📥 Saving ${courses.length} course(s) for ${username}`);
        const db = getDatabase();

        // Buscar o crear usuario (OPTIMIZADO: una sola query)
        const usersRef = db.ref('users');
        const userSnapshot = await usersRef.orderByChild('username').equalTo(username).once('value');

        let userId;
        if (!userSnapshot.exists()) {
            const newUserRef = usersRef.push();
            userId = newUserRef.key;
            await newUserRef.set({
                username: username,
                createdAt: Date.now()
            });
            console.log(`✨ Created user: ${userId}`);
        } else {
            userId = Object.keys(userSnapshot.val())[0];
            console.log(`✓ Found user: ${userId}`);
        }

        // Guardar cursos (BATCH)
        const coursesRef = db.ref('courses');
        const timestamp = Date.now();
        const savedCourses = [];

        // Usar Promise.all para guardar todos los cursos en paralelo
        await Promise.all(courses.map(async (course) => {
            const courseData = {
                id: course.id || timestamp + Math.floor(Math.random() * 1000),
                userId: userId,
                courseName: course.courseName,
                subject: course.subject || '',
                period: course.period || '2025',
                students: course.students || [],
                tasks: course.tasks || [],
                config: course.config || { minGrade: 1.0, maxGrade: 7.0, passingGrade: 4.0, passingPercentage: 60 },
                createdAt: timestamp,
                updatedAt: timestamp
            };

            if (course.id) {
                // Buscar si existe
                const existingSnapshot = await coursesRef.orderByChild('id').equalTo(course.id).once('value');
                if (existingSnapshot.exists()) {
                    // Actualizar
                    const courseKey = Object.keys(existingSnapshot.val())[0];
                    await coursesRef.child(courseKey).update(courseData);
                    savedCourses.push({ ...courseData, firebaseKey: courseKey });
                    console.log(`✓ Updated: ${course.courseName}`);
                    return;
                }
            }

            // Crear nuevo
            const newCourseRef = await coursesRef.push();
            await newCourseRef.set(courseData);
            savedCourses.push({ ...courseData, firebaseKey: newCourseRef.key });
            console.log(`✨ Created: ${course.courseName}`);
        }));

        const elapsed = Date.now() - startTime;
        console.log(`✅ Saved ${savedCourses.length} courses in ${elapsed}ms`);

        res.status(200).json({
            success: true,
            message: `Saved ${savedCourses.length} courses`,
            elapsed: elapsed,
            courses: savedCourses
        });

    } catch (error) {
        const elapsed = Date.now() - startTime;
        console.error(`❌ Error after ${elapsed}ms:`, error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            error: 'Failed to save courses',
            details: error.message,
            elapsed: elapsed
        });
    }
}