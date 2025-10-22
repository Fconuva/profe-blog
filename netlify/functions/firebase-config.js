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
        
        // Configuración desde variables de entorno de Netlify
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

module.exports = {
    initializeFirebase,
    getDatabase,
    admin
};
