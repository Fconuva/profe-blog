// Script para insertar sesion-u2-2 en Firebase Realtime Database
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
    id: "sesion-u2-2",
    titulo: "Clase 2 - Unidad 2 - Tesis, argumentos y contraargumentos",
    descripcion: "Análisis formal de argumentos mediante el Modelo Toulmin. Trabaja tesis, base, garantía y respaldo, analizando un artículo científico sobre el impacto de las pantallas, e incluye una autoevaluación interactiva más ticket de salida.",
    activa: true,
    orden: 2,
    panel_seccion: "plan",
    panel_unidad: "u2",
    panel_orden: 2,
    prefer_guia: true,
    link_guia: "/estudiantes/guia-u2-s2-tesis-argumentos.html",
    resultados_visibles: false,
    programa: "simce",
    asignados: ["2A-HC", "2B-HC"],
    contenido: {
        preguntas: [
            {
                id: "q1",
                enunciado: "Reconocer el propósito comunicativo de la columna sobre IA en el aula.",
                habilidad: "INTEGRAR_Y_REINTERPRETAR"
            },
            {
                id: "q2",
                enunciado: "Identificar el argumento principal que sostiene la tesis del autor.",
                habilidad: "INTEGRAR_Y_REINTERPRETAR"
            },
            {
                id: "q3",
                enunciado: "Comprender la estrategia del autor para neutralizar los argumentos de prohibición de la IA.",
                habilidad: "INTEGRAR_Y_REINTERPRETAR"
            },
            {
                id: "q4",
                enunciado: "Identificar la función del marcador discursivo 'En otras palabras' al inicio del párrafo décimo.",
                habilidad: "INTEGRAR_Y_REINTERPRETAR"
            },
            {
                id: "q5",
                enunciado: "Asignar rol de Toulmin (Respaldo) a los datos estadísticos del estudio piloto.",
                habilidad: "INTEGRAR_Y_REINTERPRETAR"
            }
        ],
        textos: [
            {
                id: "texto-1",
                titulo: "La Fricción Socrática del Pensamiento",
                subtipo: "Columna de opinión",
                tipo: "No literario",
                fuente: "Texto argumentativo para Unidad 2 Clase 2.",
                parrafos: [
                    {
                        num: 1,
                        texto: "Columna sobre el uso de inteligencia artificial en el liceo, la resistencia a la prohibición y cómo estructurar el debate con rigurosidad académica."
                    }
                ]
            }
        ]
    }
};

async function run() {
    try {
        console.log('Insertando sesion-u2-2...');
        await db.ref('plataforma_estudiantes/sesiones/sesion-u2-2').set(sessionData);
        console.log('¡Sesión sesion-u2-2 insertada con éxito!');
        process.exit(0);
    } catch (e) {
        console.error('Error insertando sesión:', e);
        process.exit(1);
    }
}

run();
