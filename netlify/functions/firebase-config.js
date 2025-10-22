// Firebase Admin SDK Configuration
const admin = require('firebase-admin');

let firebaseApp;

function initializeFirebase() {
    if (firebaseApp) {
        return firebaseApp;
    }

    try {
        // Configuración desde variables de entorno de Netlify
        let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
        
        // Manejar diferentes formatos de la clave privada
        // Si tiene \n literales (como strings), convertirlos a saltos de línea reales
        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
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

        console.log('✅ Firebase initialized successfully');
        return firebaseApp;
    } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
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
