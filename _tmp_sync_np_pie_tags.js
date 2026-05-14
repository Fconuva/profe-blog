const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config({ path: path.join(__dirname, '.env.local') });

function readServiceAccount() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.GOOGLE_SERVICE_ACCOUNT || '';
  if (base64) {
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  }
  return {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  };
}

function normalizeLoose(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]+/gi, ' ')
    .trim()
    .toUpperCase();
}

function cleanRut(value) {
  return String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
}

function normalizePieLabel(value) {
  const raw = normalizeLoose(value);
  if (!raw) return '';
  if (raw.includes('NEEP')) return 'NEEP';
  if (raw.includes('NEET')) return 'NEET';
  if (raw.includes('PIE')) return 'PIE';
  return '';
}

function sanitizePieTagsByRut(value) {
  const next = {};
  Object.keys(value || {}).forEach((rutKey) => {
    const clean = cleanRut(rutKey);
    const raw = value[rutKey];
    const label = normalizePieLabel(typeof raw === 'string' ? raw : raw && (raw.label || raw.type || raw.kind || raw.category));
    if (clean && label) {
      next[clean] = { label };
    }
  });
  return next;
}

function hasPieAssignments(assignments) {
  return Object.keys(assignments || {}).some((assignmentId) => /-pie-2026/i.test(assignmentId));
}

function preferredPieLabel(existingLabel, studentRecord) {
  const candidates = [
    existingLabel,
    studentRecord && studentRecord.pie,
    studentRecord && studentRecord.tipoPie,
    studentRecord && studentRecord.tipo_pie,
    studentRecord && studentRecord.categoriaPie,
    studentRecord && studentRecord.categoria,
    studentRecord && studentRecord.nee,
    studentRecord && studentRecord.neeTipo,
    studentRecord && studentRecord.neep,
    studentRecord && studentRecord.neet,
    'PIE'
  ].map(normalizePieLabel).filter(Boolean);

  if (candidates.includes('NEEP')) return 'NEEP';
  if (candidates.includes('NEET')) return 'NEET';
  return 'PIE';
}

async function main() {
  const serviceAccount = readServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
  });

  const db = admin.database();
  const [configSnap, studentsSnap, assignmentsSnap] = await Promise.all([
    db.ref('plataforma_np/unidad1/config').once('value'),
    db.ref('plataforma_estudiantes/estudiantes').once('value'),
    db.ref('plataforma_lecturas/asignaciones').once('value')
  ]);

  const existingTags = sanitizePieTagsByRut(configSnap.child('pieTagsByRut').val() || {});
  const students = studentsSnap.val() || {};
  const assignmentsByUid = assignmentsSnap.val() || {};
  const nextTags = Object.assign({}, existingTags);

  let matched = 0;
  let skippedWithoutRut = 0;

  Object.keys(assignmentsByUid).forEach((uid) => {
    if (!hasPieAssignments(assignmentsByUid[uid])) return;

    const student = students[uid] || {};
    const rut = cleanRut(student.rut);
    if (!rut) {
      skippedWithoutRut += 1;
      return;
    }

    matched += 1;
    const existingLabel = nextTags[rut] && nextTags[rut].label;
    nextTags[rut] = { label: preferredPieLabel(existingLabel, student) };
  });

  await db.ref('plataforma_np/unidad1/config/pieTagsByRut').set(nextTags);

  const countsByLabel = Object.values(nextTags).reduce((acc, entry) => {
    const label = entry && entry.label ? entry.label : 'PIE';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  console.log(JSON.stringify({
    matchedPieStudents: matched,
    skippedWithoutRut,
    savedPieTags: Object.keys(nextTags).length,
    countsByLabel
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.all(admin.apps.map((app) => app.delete()));
  });