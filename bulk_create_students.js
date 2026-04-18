// Script para crear estudiantes via Firebase Admin SDK
// Ejecutar: node bulk_create_students.js carga_3A_TP.txt carga_3B_TP.txt

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
const fs = require('fs');

function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + '@est.profefranciscopancho.com'; }
function defaultPassword(r) { var d = cleanRut(r).replace(/[^0-9]/g, ''); return d.substring(0, 6).padEnd(6, '0'); }

function parseFile(path) {
    return fs.readFileSync(path, 'utf8').trim().split('\n').map(line => {
        const [nombre, rut, curso] = line.split(';').map(s => s.trim());
        return { nombre, rut: cleanRut(rut), curso };
    }).filter(e => e.nombre && e.rut && e.curso);
}

async function createStudents(estudiantes) {
    let created = 0, skipped = 0, errors = 0;
    for (const est of estudiantes) {
        const email = rutToEmail(est.rut);
        const password = defaultPassword(est.rut);
        try {
            let userRecord;
            try {
                userRecord = await auth.getUserByEmail(email);
                console.log(`  ⏭ Ya existe: ${est.nombre} (${email})`);
                skipped++;
            } catch (e) {
                if (e.code === 'auth/user-not-found') {
                    userRecord = await auth.createUser({ email, password, displayName: est.nombre });
                    console.log(`  ✅ Creado: ${est.nombre} (${email})`);
                    created++;
                } else throw e;
            }
            await db.ref(`${BASE}/estudiantes/${userRecord.uid}`).set({
                nombre: est.nombre, rut: est.rut, curso: est.curso,
                perfil_completo: false, password_changed: false,
                createdAt: Date.now(), createdBy: 'bulk-script'
            });
        } catch (e) {
            console.error(`  ❌ Error ${est.nombre}: ${e.message}`);
            errors++;
        }
    }
    return { created, skipped, errors };
}

async function main() {
    console.log('=== Carga Masiva de Estudiantes ===\n');

    const files = process.argv.slice(2);
    if (!files.length) {
        console.log('Uso: node bulk_create_students.js <archivo1.txt> <archivo2.txt> ...');
        console.log('Ejemplo: node bulk_create_students.js carga_3A_TP.txt carga_3B_TP.txt');
        process.exit(1);
    }

    for (const file of files) {
        if (!fs.existsSync(file)) {
            console.log(`\n⚠ Archivo no encontrado: ${file}`);
            continue;
        }
        console.log(`\n📂 Procesando ${file}...`);
        const estudiantes = parseFile(file);
        console.log(`   ${estudiantes.length} estudiantes encontrados\n`);
        const result = await createStudents(estudiantes);
        console.log(`\n   Resumen ${file}: ✅ ${result.created} creados | ⏭ ${result.skipped} existentes | ❌ ${result.errors} errores`);
    }

    console.log('\n=== Proceso completado ===');
    process.exit(0);
}

main().catch(e => { console.error('Error fatal:', e); process.exit(1); });
