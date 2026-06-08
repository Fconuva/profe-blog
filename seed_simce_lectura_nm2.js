require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// === Seed SIMCE Lectura NM2 2026 (2A-HC / 2B-HC) ===
// Crea/actualiza la sesion de Lecturas con el contenido SIMCE embebido y la
// asigna a todos los estudiantes de los cursos objetivo.
// Uso:
//   node seed_simce_lectura_nm2.js --dry-run   (no escribe, solo reporta)
//   node seed_simce_lectura_nm2.js             (escribe en Firebase)

const DRY_RUN = process.argv.includes('--dry-run');

if (!admin.apps.length) {
  let credential;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
    credential = admin.credential.cert(serviceAccount);
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
const STUDENT_BASE = 'plataforma_estudiantes';
const LECTURAS_BASE = 'plataforma_lecturas';
const ROOT = __dirname;

const SESSION_ID = 'simce-lectura-nm2-2026';
const CONTENT_PATH = 'estudiacest/lecturas/contenidos/simce_lectura_nm2_2026_base.json';
const TARGET_COURSES = ['2A-HC', '2B-HC'];
const DISPONIBLE_DESDE = '2026-06-03T08:00:00'; // miercoles 3-jun-2026, hora local Chile

function cleanRut(rut) {
  return String(rut || '').replace(/[.\s]/g, '').toUpperCase();
}

function normalizeCourse(value) {
  return String(value || '').trim().toUpperCase();
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

async function getStudentsByCourse(courses) {
  const target = new Set(courses.map(normalizeCourse));
  const snap = await db.ref(STUDENT_BASE + '/estudiantes').once('value');
  const students = snap.val() || {};
  const matched = [];
  Object.entries(students).forEach(([uid, student]) => {
    if (!student) return;
    if (target.has(normalizeCourse(student.curso))) {
      matched.push({ uid, nombre: student.nombre, curso: normalizeCourse(student.curso), rut: cleanRut(student.rut) });
    }
  });
  return matched;
}

async function main() {
  console.log('=== Seed SIMCE Lectura NM2 2026 ' + (DRY_RUN ? '(DRY-RUN)' : '(ESCRITURA REAL)') + ' ===\n');

  const content = readJson(CONTENT_PATH);
  const itemCount = (content.items || []).length;
  const matCount = (content.materiales || []).length;
  console.log('Contenido: ' + matCount + ' materiales / ' + itemCount + ' items (' + CONTENT_PATH + ')');

  const students = await getStudentsByCourse(TARGET_COURSES);
  const byCourse = {};
  students.forEach(s => { byCourse[s.curso] = (byCourse[s.curso] || 0) + 1; });
  console.log('Estudiantes objetivo (' + TARGET_COURSES.join(', ') + '): ' + students.length);
  Object.entries(byCourse).forEach(([c, n]) => console.log('  ' + c + ': ' + n));

  const sessionPayload = {
    titulo: 'Prueba SIMCE Lectura - NM2',
    libro: 'SIMCE Comprension Lectora',
    descripcion: 'Ensayo SIMCE de Comprension Lectora (corpus mixto) para 2A-HC y 2B-HC. Foco en Relacionar e interpretar / Reflexionar.',
    duracion_min: 80,
    orden: 1,
    activa: true,
    perfil: 'simce',
    cursosAsignados: TARGET_COURSES.slice(),
    disponibleDesde: DISPONIBLE_DESDE,
    contenido: content,
    createdBy: 'seed-simce-lectura-nm2',
    updatedBy: 'seed-simce-lectura-nm2',
    updatedAt: Date.now()
  };

  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Sesion a escribir en ' + LECTURAS_BASE + '/sesiones/' + SESSION_ID + ':');
    console.log('  titulo=' + sessionPayload.titulo + ' | activa=' + sessionPayload.activa + ' | disponibleDesde=' + sessionPayload.disponibleDesde);
    console.log('[DRY-RUN] Asignaciones a crear: ' + students.length + ' (una por estudiante en ' + LECTURAS_BASE + '/asignaciones/{uid}/' + SESSION_ID + ')');
    console.log('\n[DRY-RUN] No se escribio nada. Quita --dry-run para aplicar.');
    process.exit(0);
  }

  // Escritura real
  await db.ref(LECTURAS_BASE + '/sesiones/' + SESSION_ID).update(sessionPayload);
  console.log('\nSesion escrita: ' + LECTURAS_BASE + '/sesiones/' + SESSION_ID);

  const updates = {};
  students.forEach(s => { updates[s.uid + '/' + SESSION_ID] = true; });
  if (Object.keys(updates).length) {
    await db.ref(LECTURAS_BASE + '/asignaciones').update(updates);
  }
  console.log('Asignaciones creadas: ' + students.length);
  console.log('\n=== Seed completado ===');
  process.exit(0);
}

main().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
