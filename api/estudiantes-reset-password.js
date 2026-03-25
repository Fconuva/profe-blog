// api/estudiantes-reset-password.js
// Vercel Serverless Function — Restablecer contraseña de estudiante

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
    res.setHeader('Access-Control-Allow-Origin', 'https://www.profefranciscopancho.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
        const token = (req.headers.authorization || '').replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Token requerido' });

        const decoded = await auth.verifyIdToken(token);
        const adminSnap = await db.ref(`${BASE}/admins/${decoded.uid}`).once('value');
        if (!adminSnap.val()) return res.status(403).json({ error: 'No autorizado' });

        const { studentUid } = req.body;
        if (!studentUid) return res.status(400).json({ error: 'studentUid requerido' });

        // Get student data to generate default password
        const studentSnap = await db.ref(`${BASE}/estudiantes/${studentUid}`).once('value');
        const student = studentSnap.val();
        if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

        const cleanRut = (student.rut || '').replace(/[.\s-]/g, '');
        const newPassword = cleanRut.replace(/[^0-9]/g, '').substring(0, 4) + 'est!';

        await auth.updateUser(studentUid, { password: newPassword });

        // Update DB flags
        await db.ref(`${BASE}/estudiantes/${studentUid}`).update({
            password_changed: false,
            password_reset_pending: false
        });

        return res.status(200).json({
            success: true,
            message: 'Contraseña restablecida',
            defaultPassword: newPassword
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: error.message });
    }
};
