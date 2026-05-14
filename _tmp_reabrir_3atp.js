require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
  });
}

const db = admin.database();
const SID = 'pedro-paramo-nm3-regular-2026';
const COURSE = '3A-TP';

(async () => {
  try {
    const [studentsSnap, responsesSnap, resultsSnap] = await Promise.all([
      db.ref('plataforma_estudiantes/estudiantes').once('value'),
      db.ref('plataforma_lecturas/respuestas/' + SID).once('value'),
      db.ref('plataforma_lecturas/resultados/' + SID).once('value')
    ]);

    const students = studentsSnap.val() || {};
    const responses = responsesSnap.val() || {};
    const results = resultsSnap.val() || {};
    const now = Date.now();
    const courseStudents = Object.entries(students)
      .filter(([, student]) => String(student && student.curso || '').trim().toUpperCase() === COURSE)
      .map(([uid, student]) => ({ uid, nombre: student.nombre || uid }));

    const updates = {};
    const touched = [];
    const skipped = [];

    for (const student of courseStudents) {
      const hasResponse = !!responses[student.uid];
      const hasResult = !!results[student.uid];
      if (!hasResponse && !hasResult) {
        skipped.push(student.nombre);
        continue;
      }

      const responseBase = 'plataforma_lecturas/respuestas/' + SID + '/' + student.uid;
      const resultBase = 'plataforma_lecturas/resultados/' + SID + '/' + student.uid;

      updates[responseBase + '/strikes'] = 0;
      updates[responseBase + '/bloqueado_por_strikes'] = null;
      updates[responseBase + '/completada'] = false;
      updates[responseBase + '/submitted_at'] = null;
      updates[responseBase + '/forzar_envio'] = false;
      updates[responseBase + '/cerrado_por_docente'] = null;
      updates[responseBase + '/pausado_por_docente'] = false;
      updates[responseBase + '/pausa_motivo'] = null;
      updates[responseBase + '/pausa_at'] = null;
      updates[responseBase + '/pausa_curso'] = null;
      updates[responseBase + '/reopened_at'] = now;
      updates[responseBase + '/reanudado_at'] = now;

      if (hasResult) {
        updates[resultBase + '/strikes'] = 0;
        updates[resultBase + '/bloqueado_por_strikes'] = null;
        updates[resultBase + '/completada'] = false;
        updates[resultBase + '/submitted_at'] = null;
        updates[resultBase + '/cerrado_por_docente'] = null;
        updates[resultBase + '/reopened_at'] = now;
      }

      touched.push({
        nombre: student.nombre,
        uid: student.uid,
        hadResponse: hasResponse,
        hadResult: hasResult
      });
    }

    if (!touched.length) {
      console.log('No encontré registros de respuestas o resultados para ' + COURSE + ' en ' + SID + '.');
      if (skipped.length) {
        console.log('Sin registros:', skipped.join(' | '));
      }
      return;
    }

    await db.ref().update(updates);

    console.log('Sesión:', SID);
    console.log('Curso:', COURSE);
    console.log('Reabiertos:', touched.length);
    console.table(touched);
    if (skipped.length) {
      console.log('Sin registros previos:', skipped.length);
      console.log(skipped.join(' | '));
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();