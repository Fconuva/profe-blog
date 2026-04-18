// One-time script: write sesion-5 metadata to Firebase and resequence orden values
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa), databaseURL: process.env.FIREBASE_DATABASE_URL });

const db = admin.database();
const BASE = 'plataforma_estudiantes';

async function main() {
    const updates = {};

    // 1. Write sesion-5 metadata (content lives in SESSIONS_EMBEDDED, not Firebase)
    updates[`/${BASE}/sesiones/sesion-5`] = {
        titulo: 'Clase 4 — Vocabulario Contextual: Pistas del Texto',
        descripcion: 'Aprende a deducir el significado de palabras desconocidas usando 4 tipos de pistas contextuales: Definición, Contraste, Ejemplo y Causa-Efecto. 2 textos informativos · 12 preguntas.',
        orden: 4,
        activa: true,
        resultados_visibles: false,
        video_youtube: null,
        programa: 'simce',
        anticopia_activo: true,
        createdAt: Date.now()
    };

    // 2. Resequence: sesion-2 (Ensayo SIMCE) moves from orden 4 → 5
    updates[`/${BASE}/sesiones/sesion-2/orden`] = 5;

    // 3. Resequence: feedback-plataforma moves from orden 5 → 6
    updates[`/${BASE}/sesiones/feedback-plataforma/orden`] = 6;

    await db.ref().update(updates);
    console.log('Done: sesion-5 created, sesion-2 → orden 5, feedback-plataforma → orden 6');
    process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
