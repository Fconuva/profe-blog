// Script para configurar docentes en la plataforma multi-profesor
// Ejecutar: node setup_docentes.js
//
// Este script:
// 1. Crea (o busca) la cuenta Firebase Auth de cada docente
// 2. Escribe admins/{uid} = true
// 3. Escribe docentes/{uid} = { nombre, cursos, superadmin }

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
const auth = admin.auth();
const BASE = 'plataforma_estudiantes';

// ============================================
// CONFIGURACION DE DOCENTES
// Editar emails, contraseñas y cursos aquí
// ============================================
const DOCENTES = [
    {
        email: 'francisco@profefranciscopancho.com',
        password: null, // null = no crear cuenta, solo actualizar docentes si ya existe
        nombre: 'Francisco Núñez',
        cursos: [], // vacío = superadmin ve todo
        superadmin: true
    },
    {
        email: 'jorge.oyarce@profefranciscopancho.com', // CAMBIAR al email real
        password: 'Docente2026!', // CAMBIAR a contraseña segura
        nombre: 'Jorge Oyarce',
        cursos: ['2A-TP', '2B-TP', '2C-TP', '2D-TP', '2E-TP'],
        superadmin: false
    },
    {
        email: 'docente.hc@profefranciscopancho.com', // CAMBIAR al email real
        password: 'Docente2026!', // CAMBIAR a contraseña segura
        nombre: 'Docente 1° HC', // CAMBIAR al nombre real
        cursos: ['1A-HC', '1B-HC'],
        superadmin: false
    }
];

async function setupDocente(docente) {
    console.log(`\n--- ${docente.nombre} (${docente.email}) ---`);
    let uid;

    // 1. Buscar o crear cuenta en Firebase Auth
    try {
        const user = await auth.getUserByEmail(docente.email);
        uid = user.uid;
        console.log(`  ✓ Cuenta existente: ${uid}`);
    } catch (e) {
        if (e.code === 'auth/user-not-found') {
            if (!docente.password) {
                console.log(`  ⚠ Cuenta no encontrada y sin password configurado. Saltando creación.`);
                return;
            }
            const user = await auth.createUser({
                email: docente.email,
                password: docente.password,
                displayName: docente.nombre
            });
            uid = user.uid;
            console.log(`  ✓ Cuenta creada: ${uid}`);
        } else {
            throw e;
        }
    }

    // 2. Escribir en admins
    await db.ref(`${BASE}/admins/${uid}`).set(true);
    console.log(`  ✓ admins/${uid} = true`);

    // 3. Escribir en docentes
    const docenteData = {
        nombre: docente.nombre,
        cursos: docente.cursos,
        superadmin: docente.superadmin || false
    };
    await db.ref(`${BASE}/docentes/${uid}`).set(docenteData);
    console.log(`  ✓ docentes/${uid} =`, JSON.stringify(docenteData));
}

async function main() {
    console.log('=== Setup de Docentes - Plataforma Estudiantes ===\n');

    for (const docente of DOCENTES) {
        try {
            await setupDocente(docente);
        } catch (e) {
            console.error(`  ✗ Error con ${docente.nombre}:`, e.message);
        }
    }

    console.log('\n=== Listo ===');
    process.exit(0);
}

main();
