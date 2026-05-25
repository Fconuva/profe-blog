const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

function ensureFirebase() {
  if (admin.apps.length) {
    return admin.app();
  }
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY no configurada.');
  }
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
  });
}

async function main() {
  ensureFirebase();
  const db = admin.database();

  const sessionsToExtract = [
    'ensayo-simce-miercoles-2a-hc-2026',
    'ensayo-simce-miercoles-2b-hc-2026'
  ];

  console.log('Extrayendo datos de diagnóstico SIMCE de Firebase...');

  const studentsSnap = await db.ref(`${BASE}/estudiantes`).once('value');
  const students = studentsSnap.val() || {};

  const allRecords = [];

  for (const sessionId of sessionsToExtract) {
    console.log(`\nProcesando sesión: ${sessionId}`);
    const sessionSnap = await db.ref(`${BASE}/sesiones/${sessionId}`).once('value');
    if (!sessionSnap.exists()) {
      console.log(`- La sesión ${sessionId} no existe en Firebase.`);
      continue;
    }

    const session = sessionSnap.val() || {};
    const responsesSnap = await db.ref(`${BASE}/respuestas/${sessionId}`).once('value');
    const resultsSnap = await db.ref(`${BASE}/resultados/${sessionId}`).once('value');

    const responses = responsesSnap.val() || {};
    const results = resultsSnap.val() || {};

    const sessionTitle = session.titulo || sessionId;

    console.log(`- Respuestas encontradas: ${Object.keys(responses).length}`);
    console.log(`- Resultados encontrados: ${Object.keys(results).length}`);

    // Let's match each student with their responses/results
    for (const [uid, rVal] of Object.entries(results)) {
      const student = students[uid] || {};
      const resp = responses[uid] || {};

      allRecords.push({
        sessionId,
        sessionTitle,
        uid,
        rut: student.rut || '',
        nombre: student.nombre || 'Desconocido',
        curso: student.curso || 'Desconocido',
        correo: student.correo || '',
        porcentaje: rVal.porcentaje || 0,
        nota: rVal.nota || 1.0,
        correctas: rVal.correctas || 0,
        totales: rVal.totales || 0,
        submittedAt: rVal.submitted_at || '',
        respuestas: resp.answers || {}
      });
    }
  }

  // Export as JSON
  const outputDir = path.join(__dirname, '..', 'exports', 'simce-diagnostico');
  fs.mkdirSync(outputDir, { recursive: true });

  const jsonPath = path.join(outputDir, 'simce_diagnostic_results_2026.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allRecords, null, 2), 'utf8');
  console.log(`\nExportado JSON de SIMCE: ${jsonPath}`);

  // Create a simplified CSV
  let csvContent = '\uFEFF'; // BOM for Excel UTF-8
  csvContent += 'Sesión;Título;UID;Nombre;Curso;RUT;Porcentaje;Nota;Correctas;Totales;Fecha de Envío\n';
  
  for (const record of allRecords) {
    const csvRow = [
      record.sessionId,
      record.sessionTitle,
      record.uid,
      record.nombre,
      record.curso,
      record.rut,
      record.porcentaje,
      record.nota,
      record.correctas,
      record.totales,
      record.submittedAt
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(';');
    csvContent += csvRow + '\n';
  }

  const csvPath = path.join(outputDir, 'simce_diagnostic_results_2026.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`Exportado CSV de SIMCE: ${csvPath}`);

  console.log(`Registros totales procesados: ${allRecords.length}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
