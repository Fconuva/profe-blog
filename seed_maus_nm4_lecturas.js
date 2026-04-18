require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

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
const COURSE_SET = new Set(['4A-TP', '4B-TP', '4C-TP', '4D-TP', '4E-TP']);

function cleanRut(rut) {
  return String(rut || '').replace(/[.\s]/g, '').toUpperCase();
}

function readJson(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readRutList(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map(line => cleanRut(line))
    .filter(Boolean);
}

async function getStudentsByRut() {
  const snap = await db.ref(STUDENT_BASE + '/estudiantes').once('value');
  const students = snap.val() || {};
  const byRut = new Map();
  Object.entries(students).forEach(([uid, student]) => {
    const rut = cleanRut(student && student.rut);
    if (!rut) return;
    byRut.set(rut, { uid, ...student, rut });
  });
  return byRut;
}

function buildRandomizedContent(relativePath) {
  const content = readJson(relativePath);
  content.randomizacion = {
    mezclarItems: true,
    semilla: 'maus-nm4-2026'
  };
  return content;
}

async function upsertSession(sessionId, payload) {
  await db.ref(LECTURAS_BASE + '/sesiones/' + sessionId).update({
    ...payload,
    updatedAt: Date.now(),
    updatedBy: 'seed-maus-nm4'
  });
}

async function syncSessionAssignments(sessionId, ruts, studentsByRut) {
  const targetUids = new Set();
  const missing = [];

  ruts.forEach(rut => {
    const student = studentsByRut.get(cleanRut(rut));
    if (!student) {
      missing.push(rut);
      return;
    }
    targetUids.add(student.uid);
  });

  const assignmentsSnap = await db.ref(LECTURAS_BASE + '/asignaciones').once('value');
  const assignments = assignmentsSnap.val() || {};
  const updates = {};

  Object.entries(assignments).forEach(([uid, sessionMap]) => {
    if (sessionMap && sessionMap[sessionId] && !targetUids.has(uid)) {
      updates[uid + '/' + sessionId] = null;
    }
  });

  targetUids.forEach(uid => {
    updates[uid + '/' + sessionId] = true;
  });

  if (Object.keys(updates).length) {
    await db.ref(LECTURAS_BASE + '/asignaciones').update(updates);
  }

  return missing;
}

async function main() {
  console.log('=== Seed Maus NM4 Lecturas ===\n');

  const studentsByRut = await getStudentsByRut();

  const dilRuts = [
    ...readRutList('lecturas/asignaciones/maus_nm4_4A_tp_dil_ruts.txt'),
    ...readRutList('lecturas/asignaciones/maus_nm4_4D_tp_dil_ruts.txt'),
    ...readRutList('lecturas/asignaciones/maus_nm4_4E_tp_dil_ruts.txt')
  ];
  const intermediaRuts = [
    ...readRutList('lecturas/asignaciones/maus_nm4_4A_tp_intermedia_ruts.txt'),
    ...readRutList('lecturas/asignaciones/maus_nm4_4B_tp_intermedia_ruts.txt')
  ];

  const excludedRegular = new Set([...dilRuts, ...intermediaRuts].map(cleanRut));
  const regularRuts = [];
  studentsByRut.forEach(student => {
    if (!COURSE_SET.has(student.curso)) return;
    if (excludedRegular.has(student.rut)) return;
    regularRuts.push(student.rut);
  });

  const sessions = [
    {
      id: 'maus-nm4-2026',
      title: 'Prueba de Lecturas - Maus - NM4',
      description: 'Version regular base para NM4 TP.',
      contentPath: 'lecturas/contenidos/maus_nm4_2026_base.json',
      ruts: regularRuts,
      order: 1,
      profile: 'regular'
    },
    {
      id: 'maus-nm4-dil-2026',
      title: 'Prueba de Lecturas - Maus - NM4 - DIL',
      description: 'Version DIL fuerte para estudiantes con adecuacion curricular significativa.',
      contentPath: 'lecturas/contenidos/maus_nm4_2026_dil_fuerte.json',
      ruts: dilRuts,
      order: 2,
      profile: 'dil'
    },
    {
      id: 'maus-nm4-intermedia-2026',
      title: 'Prueba de Lecturas - Maus - NM4 - Intermedia',
      description: 'Version con menor carga de escritura y apoyos mas guiados.',
      contentPath: 'lecturas/contenidos/maus_nm4_2026_intermedia.json',
      ruts: intermediaRuts,
      order: 3,
      profile: 'intermedia'
    }
  ];

  for (const session of sessions) {
    const content = buildRandomizedContent(session.contentPath);
    await upsertSession(session.id, {
      titulo: session.title,
      libro: 'Maus',
      descripcion: session.description,
      duracion_min: 80,
      orden: session.order,
      activa: true,
      perfil: session.profile,
      contenido: content,
      createdBy: 'seed-maus-nm4'
    });
    const missing = await syncSessionAssignments(session.id, session.ruts, studentsByRut);
    console.log(`Sesion ${session.id}: ${session.ruts.length - missing.length}/${session.ruts.length} asignaciones OK`);
    if (missing.length) {
      console.log('  RUT sin cuenta encontrada:', missing.join(', '));
    }
  }

  console.log('\nRegular asignados:', regularRuts.length);
  console.log('DIL asignados:', dilRuts.length);
  console.log('Intermedia asignados:', intermediaRuts.length);
  console.log('\n=== Seed completado ===');
}

main().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});