const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const DEFAULT_SOURCE_PATH = path.join(__dirname, '..', 'backups', 'legacy-rtdb-current-2026-05-07.json');
const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const STUDENT_BASE = 'plataforma_estudiantes';
const STUDENT_EMAIL_DOMAIN = '@est.estudiacest.com';
const SYNC_ACTOR = 'sync-access-only-students';

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

function cleanRut(value) {
  return (value || '').replace(/[.\s]/g, '').toUpperCase();
}

function rutToEmail(value) {
  return cleanRut(value).replace(/-/g, '').toLowerCase() + STUDENT_EMAIL_DOMAIN;
}

function parseArgs(argv) {
  const options = {
    apply: false,
    source: DEFAULT_SOURCE_PATH,
    course: '',
    rut: '',
    limit: 0
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--apply') {
      options.apply = true;
      continue;
    }
    if (token === '--source') {
      options.source = path.resolve(argv[index + 1] || '');
      index += 1;
      continue;
    }
    if (token === '--course') {
      options.course = String(argv[index + 1] || '').trim().toUpperCase();
      index += 1;
      continue;
    }
    if (token === '--rut') {
      options.rut = cleanRut(argv[index + 1] || '');
      index += 1;
      continue;
    }
    if (token === '--limit') {
      const parsed = Number.parseInt(argv[index + 1] || '0', 10);
      options.limit = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      index += 1;
    }
  }

  return options;
}

function loadSourceStudents(sourcePath) {
  const raw = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const studentMap = raw && raw.plataforma_estudiantes && raw.plataforma_estudiantes.estudiantes;
  if (!studentMap || typeof studentMap !== 'object') {
    throw new Error('No se encontró plataforma_estudiantes.estudiantes en el backup indicado.');
  }
  return Object.entries(studentMap)
    .map(([sourceUid, student]) => ({ sourceUid, student }))
    .filter(({ student }) => student && student.nombre && student.rut);
}

function buildProfilePayload(existing, sourceStudent) {
  return {
    nombre: String(sourceStudent.nombre || '').trim(),
    rut: cleanRut(sourceStudent.rut),
    curso: String(sourceStudent.curso || '').trim(),
    activo: sourceStudent.activo !== false,
    email: existing.email || rutToEmail(sourceStudent.rut),
    access_only: true,
    perfil_completo: true,
    password_changed: existing.password_changed === true,
    password_reset_pending: false,
    createdAt: existing.createdAt || Date.now(),
    createdBy: existing.createdBy || SYNC_ACTOR,
    lastLogin: existing.lastLogin || null,
    updatedAt: Date.now(),
    updatedBy: SYNC_ACTOR
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(options.source)) {
    throw new Error('No existe el archivo de respaldo: ' + options.source);
  }

  ensureFirebase();
  const auth = admin.auth();
  const db = admin.database();
  let students = loadSourceStudents(options.source);

  if (options.course) {
    students = students.filter(({ student }) => String(student.curso || '').trim().toUpperCase() === options.course);
  }
  if (options.rut) {
    students = students.filter(({ student }) => cleanRut(student.rut) === options.rut);
  }
  if (options.limit > 0) {
    students = students.slice(0, options.limit);
  }

  const summary = {
    mode: options.apply ? 'apply' : 'dry-run',
    source: options.source,
    selected: students.length,
    matchedAuth: 0,
    missingAuth: 0,
    profilesSynced: 0,
    authNamesUpdated: 0,
    missingAuthStudents: []
  };

  for (const { sourceUid, student } of students) {
    const email = rutToEmail(student.rut);
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error) {
      summary.missingAuth += 1;
      summary.missingAuthStudents.push({
        sourceUid,
        nombre: student.nombre,
        rut: cleanRut(student.rut),
        curso: student.curso || '',
        email
      });
      continue;
    }

    summary.matchedAuth += 1;

    const profileRef = db.ref(`${STUDENT_BASE}/estudiantes/${userRecord.uid}`);
    const existingSnap = await profileRef.once('value');
    const existing = existingSnap.val() || {};
    const payload = buildProfilePayload(existing, student);

    if (options.apply) {
      await profileRef.set(payload);
      summary.profilesSynced += 1;
      if ((userRecord.displayName || '') !== payload.nombre) {
        await auth.updateUser(userRecord.uid, { displayName: payload.nombre });
        summary.authNamesUpdated += 1;
      }
    }
  }

  console.log(JSON.stringify(summary, null, 2));
  if (summary.missingAuthStudents.length) {
    console.log('missing-auth-preview');
    console.table(summary.missingAuthStudents.slice(0, 20));
  }
}

main().catch((error) => {
  console.error('[sync-access-only-students]', error.message);
  process.exitCode = 1;
});