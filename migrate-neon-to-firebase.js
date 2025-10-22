/**
 * Script de Migración: Neon PostgreSQL → Firebase Realtime Database
 * 
 * Este script migra todos los datos de cursos de Neon a Firebase
 * manteniendo la estructura existente de paseo_docentes y sindicato_evento
 */

const admin = require('firebase-admin');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

// Validar variables de entorno
function validateEnv() {
    const required = [
        'FIREBASE_PROJECT_ID',
        'FIREBASE_PRIVATE_KEY',
        'FIREBASE_CLIENT_EMAIL',
        'FIREBASE_DATABASE_URL',
        'DATABASE_URL' // Neon
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('❌ Faltan variables de entorno requeridas:');
        missing.forEach(key => console.error(`   - ${key}`));
        process.exit(1);
    }
}

// Inicializar Firebase
function initFirebase() {
    const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    console.log('✅ Firebase inicializado');
    return admin.database();
}

async function migrateCourses() {
    console.log('\n🚀 Iniciando migración de Neon a Firebase...\n');
    
    validateEnv();
    const db = initFirebase();
    const sql = neon(process.env.DATABASE_URL);

    try {
        // 1. Migrar usuarios
        console.log('📊 1/3 Migrando usuarios...');
        const users = await sql`SELECT * FROM users`;
        
        const usersRef = db.ref('users');
        let migratedUsers = 0;
        
        for (const user of users) {
            const userRef = usersRef.push();
            await userRef.set({
                neonId: user.id,
                username: user.username,
                createdAt: user.created_at ? user.created_at.toISOString() : new Date().toISOString()
            });
            migratedUsers++;
        }
        console.log(`   ✅ ${migratedUsers} usuarios migrados`);

        // 2. Migrar cursos
        console.log('\n📚 2/3 Migrando cursos...');
        const courses = await sql`SELECT * FROM courses`;
        
        const coursesRef = db.ref('courses');
        let migratedCourses = 0;
        
        for (const course of courses) {
            // Buscar userId en Firebase basado en neonId
            const userSnapshot = await usersRef.orderByChild('neonId').equalTo(course.user_id).once('value');
            let firebaseUserId = null;
            
            if (userSnapshot.exists()) {
                firebaseUserId = Object.keys(userSnapshot.val())[0];
            } else {
                console.warn(`   ⚠️  Usuario no encontrado para curso ${course.id}`);
                continue;
            }

            const courseRef = coursesRef.push();
            await courseRef.set({
                id: course.id.toString(),
                userId: firebaseUserId,
                courseName: course.course_name,
                subject: course.subject,
                period: course.period,
                students: course.students || [],
                tasks: course.tasks || [],
                config: course.config || {
                    minGrade: 1.0,
                    maxGrade: 7.0,
                    passingGrade: 4.0,
                    passingPercentage: 60
                },
                createdAt: course.created_at ? course.created_at.toISOString() : new Date().toISOString(),
                updatedAt: course.updated_at ? course.updated_at.toISOString() : new Date().toISOString()
            });
            migratedCourses++;
        }
        console.log(`   ✅ ${migratedCourses} cursos migrados`);

        // 3. Migrar reservaciones (si existen)
        console.log('\n🎫 3/3 Migrando reservaciones...');
        const reservations = await sql`SELECT * FROM reservations`.catch(() => []);
        
        if (reservations.length > 0) {
            const reservationsRef = db.ref('reservations');
            let migratedReservations = 0;
            
            for (const reservation of reservations) {
                const reservationRef = reservationsRef.push();
                await reservationRef.set({
                    id: reservation.id,
                    eventDate: reservation.event_date,
                    attendeeName: reservation.attendee_name,
                    attendeeRut: reservation.attendee_rut,
                    contactEmail: reservation.contact_email,
                    contactPhone: reservation.contact_phone,
                    guests: reservation.guests,
                    dietaryRestrictions: reservation.dietary_restrictions,
                    createdAt: reservation.created_at ? reservation.created_at.toISOString() : new Date().toISOString()
                });
                migratedReservations++;
            }
            console.log(`   ✅ ${migratedReservations} reservaciones migradas`);
        } else {
            console.log(`   ℹ️  No hay reservaciones para migrar`);
        }

        // 4. Verificar datos existentes en Firebase (no tocar)
        console.log('\n🔍 Verificando datos existentes en Firebase...');
        const paseoSnapshot = await db.ref('paseo_docentes').once('value');
        const sindicatoSnapshot = await db.ref('sindicato_evento_aniversario').once('value');
        
        console.log(`   ✅ paseo_docentes: ${paseoSnapshot.exists() ? 'INTACTO' : 'No existe'}`);
        console.log(`   ✅ sindicato_evento_aniversario: ${sindicatoSnapshot.exists() ? 'INTACTO' : 'No existe'}`);

        console.log('\n🎉 ¡Migración completada exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   • Usuarios migrados: ${migratedUsers}`);
        console.log(`   • Cursos migrados: ${migratedCourses}`);
        console.log(`   • Datos existentes: PRESERVADOS\n`);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error durante la migración:', error);
        console.error('Detalles:', error.message);
        process.exit(1);
    }
}

// Ejecutar migración
migrateCourses();
