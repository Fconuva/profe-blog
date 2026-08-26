const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

const BASE = 'plataforma_estudiantes';
const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const EXPECTED_SESSIONS = Array.from({ length: 6 }, (_, index) => `sesion-u3-${index + 1}`);
const ALLOWED_GRADES = new Set([1, 3, 5, 7]);
const MODEL_VERSION = 'laboriosidad-u3-c1-c6-2026-08-26';

function normalizePrivateKey(raw) {
  let key = String(raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  return key.replace(/\\n/g, '\n');
}

function initializeFirebase(envPath) {
  dotenv.config({
    path: envPath ? path.resolve(envPath) : path.join(__dirname, '..', '.env.local'),
    override: Boolean(envPath)
  });
  if (admin.apps.length) return admin.app();
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
  });
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const next = argv[index + 1];
    args[token.slice(2)] = !next || next.startsWith('--') ? true : next;
    if (next && !next.startsWith('--')) index += 1;
  }
  return args;
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function checksum(value) {
  return crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
}

function containsFlag(row, fragment) {
  return (row.flags || []).some(flag => String(flag).toLowerCase().includes(fragment));
}

function publicStatus(row) {
  if ((row.penalizedDuplicateGroups || []).length) {
    return {
      code: 'similarity_adjusted',
      label: 'Nota ajustada por coincidencia textual superior al 90 %. Si necesitas revisar el caso, escribe al profesor.'
    };
  }
  if (row.status === 'Sin iniciar') {
    return {
      code: 'not_submitted',
      label: 'Sin entrega registrada. Si faltaste con justificación, escribe al profesor para solicitar reapertura.'
    };
  }
  if (row.status === 'Borrador') {
    return {
      code: 'draft',
      label: 'Trabajo iniciado, pero sin entrega confirmada.'
    };
  }
  if (containsFlag(row, 'escritura requerida ausente') || containsFlag(row, 'escritura requerida incompleta')) {
    return {
      code: 'writing_incomplete',
      label: 'Entrega registrada con la parte escrita ausente o incompleta.'
    };
  }
  return { code: 'submitted', label: 'Entrega registrada.' };
}

function buildPublication(source, publishedAt) {
  if (!source || !Array.isArray(source.rows)) throw new Error('El archivo de revisión no contiene rows.');
  if (source.rows.length !== 498) throw new Error(`Se esperaban 498 registros y llegaron ${source.rows.length}.`);

  const students = new Set();
  const sessions = new Set();
  const pairs = new Set();
  const records = {};
  const stats = { grades: { 1: 0, 3: 0, 5: 0, 7: 0 }, statuses: {}, adjusted: 0 };

  source.rows.forEach(row => {
    if (!row.uid || !row.sessionId) throw new Error('Hay una fila sin UID o sesión.');
    if (!EXPECTED_SESSIONS.includes(row.sessionId)) throw new Error(`Sesión fuera del alcance: ${row.sessionId}.`);
    if (!ALLOWED_GRADES.has(Number(row.proposedGrade))) throw new Error(`Nota no permitida en ${row.sessionId}.`);
    const pair = `${row.uid}/${row.sessionId}`;
    if (pairs.has(pair)) throw new Error(`Registro duplicado: ${pair}.`);
    pairs.add(pair);
    students.add(row.uid);
    sessions.add(row.sessionId);

    const status = publicStatus(row);
    const grade = Number(row.proposedGrade);
    const adjustedForSimilarity = status.code === 'similarity_adjusted';
    if (adjustedForSimilarity && grade > 5) throw new Error(`Una coincidencia ajustada conserva nota ${grade}.`);

    records[pair] = {
      sessionId: row.sessionId,
      classNumber: Number(row.sessionId.split('-').pop()),
      title: String(row.sessionTitle || row.sessionId),
      applicationDate: String(row.applicationDate || ''),
      grade,
      completionPercent: Math.round(Number(row.completion || 0) * 100),
      status: status.code,
      statusLabel: status.label,
      submitted: row.status === 'Entregada',
      adjustedForSimilarity,
      modelVersion: MODEL_VERSION,
      publishedAt
    };
    stats.grades[grade] += 1;
    stats.statuses[status.code] = (stats.statuses[status.code] || 0) + 1;
    if (adjustedForSimilarity) stats.adjusted += 1;
  });

  if (students.size !== 83) throw new Error(`Se esperaban 83 estudiantes y llegaron ${students.size}.`);
  if (sessions.size !== 6) throw new Error(`Se esperaban 6 sesiones y llegaron ${sessions.size}.`);

  return {
    records,
    stats: {
      rows: pairs.size,
      students: students.size,
      sessions: sessions.size,
      ...stats
    }
  };
}

function recordsFromSnapshot(snapshot, expectedPairs) {
  return recordsFromObject(snapshot.val() || {}, expectedPairs);
}

function recordsFromObject(root, expectedPairs) {
  const records = {};
  expectedPairs.forEach(pair => {
    const [uid, sessionId] = pair.split('/');
    records[pair] = root[uid] && root[uid][sessionId] ? root[uid][sessionId] : null;
  });
  return records;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = path.resolve(args.input || path.join(os.tmpdir(), 'simce-u3-labor-review.json'));
  const source = JSON.parse(fs.readFileSync(input, 'utf8'));
  const publishedAt = String(args['published-at'] || new Date().toISOString());
  const first = buildPublication(source, publishedAt);
  const second = buildPublication(source, publishedAt);
  const firstChecksum = checksum(first.records);
  const secondChecksum = checksum(second.records);
  if (firstChecksum !== secondChecksum || first.stats.rows !== second.stats.rows) {
    throw new Error('La simulación no fue determinista; no se publicará nada.');
  }

  const report = {
    mode: args.apply ? 'apply' : 'simulation',
    inputGeneratedAt: source.generatedAt || null,
    checksum: firstChecksum,
    ...first.stats
  };
  console.log(JSON.stringify(report, null, 2));

  if (args.output) {
    const output = path.resolve(args.output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(first.records), 'utf8');
    console.log(JSON.stringify({ output, records: first.stats.rows, checksum: firstChecksum }, null, 2));
  }

  if (args['verify-snapshot']) {
    const snapshotPath = path.resolve(args['verify-snapshot']);
    const snapshotData = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')) || {};
    const snapshotRecords = recordsFromObject(snapshotData, Object.keys(first.records));
    const snapshotChecksum = checksum(snapshotRecords);
    if (snapshotChecksum !== firstChecksum) {
      throw new Error(`El respaldo leído no coincide: esperado ${firstChecksum}, recibido ${snapshotChecksum}.`);
    }
    console.log(JSON.stringify({ verified: first.stats.rows, checksum: snapshotChecksum }, null, 2));
  }
  if (!args.apply) return;

  initializeFirebase(args.env);
  const db = admin.database();
  const targetRef = db.ref(`${BASE}/calificaciones_clase`);
  const beforeSnap = await targetRef.once('value');
  const beforeRecords = recordsFromSnapshot(beforeSnap, Object.keys(first.records));
  const backupDir = path.join(os.tmpdir(), 'estudiacest-private-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `simce-labor-grades-before-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(beforeRecords, null, 2), 'utf8');

  await targetRef.update(first.records);
  const afterSnap = await targetRef.once('value');
  const afterRecords = recordsFromSnapshot(afterSnap, Object.keys(first.records));
  const appliedChecksum = checksum(afterRecords);
  if (appliedChecksum !== firstChecksum) {
    throw new Error(`La lectura posterior no coincide: esperado ${firstChecksum}, recibido ${appliedChecksum}.`);
  }

  console.log(JSON.stringify({ applied: first.stats.rows, verified: first.stats.rows, backupPath }, null, 2));
  await admin.app().delete();
}

main().catch(async error => {
  console.error('[publish-simce-labor-grades]', error.message);
  if (admin.apps.length) await admin.app().delete().catch(() => {});
  process.exitCode = 1;
});
