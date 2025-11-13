// Test endpoint para verificar variables de entorno
export default function handler(req, res) {
    const envVars = {
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? '✅ Configurada' : '❌ No configurada',
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? `✅ Configurada (${process.env.FIREBASE_PRIVATE_KEY.substring(0, 30)}...)` : '❌ No configurada',
        FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID ? '✅ Configurada' : '❌ No configurada',
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? '✅ Configurada' : '❌ No configurada',
        FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID ? '✅ Configurada' : '❌ No configurada',
        FIREBASE_CLIENT_CERT_URL: process.env.FIREBASE_CLIENT_CERT_URL ? '✅ Configurada' : '❌ No configurada',
        FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL ? '✅ Configurada' : '❌ No configurada',
    };

    res.status(200).json({
        message: 'Test de variables de entorno',
        timestamp: new Date().toISOString(),
        variables: envVars
    });
}
