// api/estudiantes-create.js
// Vercel Serverless Function — Crear cuenta de estudiante
// Requiere Firebase Admin SDK

const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
    });
}

const db = admin.database();
const auth = admin.auth();
const BASE = 'plataforma_estudiantes';

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://www.profefranciscopancho.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
        // Verify admin token
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Token requerido' });

        const decoded = await auth.verifyIdToken(token);
        const adminSnap = await db.ref(`${BASE}/admins/${decoded.uid}`).once('value');
        if (!adminSnap.val()) return res.status(403).json({ error: 'No autorizado' });

        const { nombre, rut, curso } = req.body;
        if (!nombre || !rut || !curso) return res.status(400).json({ error: 'Campos requeridos: nombre, rut, curso' });

        const cleanRut = rut.replace(/[.\s]/g, '').toUpperCase();
        const email = cleanRut.replace(/-/g, '') + '@est.profefranciscopancho.com';
        const password = cleanRut.replace(/[^0-9]/g, '').substring(0, 4) + 'est!';

        // Create Firebase Auth user
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: nombre
        });

        // Save student data in Realtime DB
        await db.ref(`${BASE}/estudiantes/${userRecord.uid}`).set({
            nombre: nombre,
            rut: cleanRut,
            curso: curso,
            perfil_completo: false,
            password_changed: false,
            createdAt: Date.now(),
            createdBy: decoded.uid
        });

        return res.status(200).json({
            success: true,
            uid: userRecord.uid,
            email: email,
            defaultPassword: password
        });
    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({ error: error.message });
    }
};
