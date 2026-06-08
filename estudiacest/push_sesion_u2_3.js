// Script para insertar sesion-u2-3 en Firebase Realtime Database
// Clase 3 - Unidad 2 - Evaluar la argumentación: hechos, opiniones, recursos y falacias
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

if (!admin.apps.length) {
    let credential;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
        credential = admin.credential.cert(sa);
    } else {
        credential = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        });
    }
    admin.initializeApp({
        credential,
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const db = admin.database();

const sessionData = {
    id: "sesion-u2-3",
    titulo: "Clase 3 - Unidad 2 - Evaluar la argumentación: hechos, opiniones, recursos y falacias",
    descripcion: "Tercer y último paso del bloque argumentativo. Sube al nivel SIMCE más exigente (Reflexionar y evaluar): distinguir hecho de opinión, reconocer recursos argumentativos (autoridad, datos, ejemplificación, apelación emocional, analogía) y detectar falacias (falsa causa, generalización apresurada, ad hominem, falsa autoridad, apelación al miedo). Incluye activación de conocimientos previos, explicación visual, columna modelo sobre videojuegos y violencia, 5 preguntas tipo SIMCE, tabla de clasificación y ticket de salida.",
    activa: true,
    orden: 3,
    panel_seccion: "plan",
    panel_unidad: "u2",
    panel_orden: 3,
    prefer_guia: true,
    link_guia: "/estudiantes/guia-u2-s3-evaluar-argumentacion.html",
    resultados_visibles: false,
    programa: "simce",
    asignados: ["2A-HC", "2B-HC"],
    contenido: {
        preguntas: [
            {
                id: "q1",
                enunciado: "Distinguir un hecho comprobable de una opinión del autor en la columna sobre videojuegos.",
                habilidad: "REFLEXIONAR"
            },
            {
                id: "q2",
                enunciado: "Identificar el recurso argumentativo (analogía) usado en el párrafo 4.",
                habilidad: "INTERPRETAR"
            },
            {
                id: "q3",
                enunciado: "Reconocer en qué consiste la falacia de falsa causa que el autor atribuye a sus opositores.",
                habilidad: "REFLEXIONAR"
            },
            {
                id: "q4",
                enunciado: "Evaluar críticamente que el propio autor recurre a una apelación emocional (párrafo 7).",
                habilidad: "REFLEXIONAR"
            },
            {
                id: "q5",
                enunciado: "Evaluar el propósito comunicativo y la postura central del emisor.",
                habilidad: "REFLEXIONAR"
            }
        ],
        textos: [
            {
                id: "texto-1",
                titulo: "Los videojuegos no son el enemigo",
                subtipo: "Columna de opinión",
                tipo: "No literario",
                fuente: "Texto argumentativo para Unidad 2 Clase 3.",
                parrafos: [
                    {
                        num: 1,
                        texto: "Columna de opinión que sostiene que culpar a los videojuegos de la violencia juvenil confunde correlación con causa (falacia de falsa causa) y distrae de las causas reales: factores sociales, familiares y de salud mental. Usa datos, cita de autoridad (APA), analogía y, en su cierre, una apelación emocional propia."
                    }
                ]
            }
        ]
    }
};

async function run() {
    try {
        console.log('Insertando sesion-u2-3...');
        await db.ref('plataforma_estudiantes/sesiones/sesion-u2-3').set(sessionData);
        console.log('¡Sesión sesion-u2-3 insertada con éxito!');
        process.exit(0);
    } catch (e) {
        console.error('Error insertando sesión:', e);
        process.exit(1);
    }
}

run();
