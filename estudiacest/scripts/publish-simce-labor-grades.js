const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { readPlatform, updatePlatform } = require('./firebase-maintenance-db');

// Clases 1 a 8 y 10 de la Unidad 3; la Clase 9 es informativa y no lleva nota.
const EXPECTED_SESSIONS = [1, 2, 3, 4, 5, 6, 7, 8, 10].map(number => `sesion-u3-${number}`);
const ALLOWED_GRADES = new Set([1, 3, 5, 7]);
const MODEL_VERSION = 'laboriosidad-u3-c1-c10-2026-09-30-r2';

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
  if (row.status === 'Pendiente ruta personal') {
    return {
      code: 'draft',
      label: 'Ruta personal en curso: esta clase se califica cuando completes su sesión.'
    };
  }
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
  if (row.status === 'Inconsistente') {
    return {
      code: 'submission_inconsistent',
      label: 'Registro inconsistente: requiere revisión docente; una nota o resultado no confirma la entrega.'
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

function buildPublication(source, publishedAt, expectedStudents) {
  if (!source || !Array.isArray(source.rows)) throw new Error('El archivo de revisión no contiene rows.');
  if (!Number.isInteger(expectedStudents) || expectedStudents <= 0) {
    throw new Error('Indica --expected-students con el número de estudiantes revisado en la simulación.');
  }
  const expectedRows = expectedStudents * EXPECTED_SESSIONS.length;
  if (source.rows.length !== expectedRows) throw new Error(`Se esperaban ${expectedRows} registros y llegaron ${source.rows.length}.`);

  const students = new Set();
  const sessions = new Set();
  const pairs = new Set();
  const records = {};
  const stats = { grades: { 1: 0, 3: 0, 5: 0, 7: 0 }, statuses: {}, adjusted: 0 };

  source.rows.forEach(row => {
    if (!row.uid || !row.sessionId) throw new Error('Hay una fila sin UID o sesión.');
    if (!EXPECTED_SESSIONS.includes(row.sessionId)) throw new Error(`Sesión fuera del alcance: ${row.sessionId}.`);
    // Solo la ruta personal adaptada puede quedar pendiente (sin nota) mientras sigue abierta.
    const pendingPersonal = row.personalRoute === true && row.status === 'Pendiente ruta personal' && row.proposedGrade === null;
    if (!pendingPersonal && !ALLOWED_GRADES.has(Number(row.proposedGrade))) throw new Error(`Nota no permitida en ${row.sessionId}.`);
    const pair = `${row.uid}/${row.sessionId}`;
    if (pairs.has(pair)) throw new Error(`Registro duplicado: ${pair}.`);
    pairs.add(pair);
    students.add(row.uid);
    sessions.add(row.sessionId);

    const status = publicStatus(row);
    const grade = pendingPersonal ? null : Number(row.proposedGrade);
    const adjustedForSimilarity = status.code === 'similarity_adjusted';
    if (adjustedForSimilarity && grade !== null && grade > 5) throw new Error(`Una coincidencia ajustada conserva nota ${grade}.`);

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
      ...(row.personalRoute ? { personalRoute: true, evidenceSession: String(row.evidenceSession || row.sessionId) } : {}),
      modelVersion: MODEL_VERSION,
      publishedAt
    };
    // Firebase no guarda valores null: una clase pendiente se publica sin `grade`.
    if (grade === null) delete records[pair].grade;
    stats.grades[grade === null ? 'pendiente' : grade] = (stats.grades[grade === null ? 'pendiente' : grade] || 0) + 1;
    stats.statuses[status.code] = (stats.statuses[status.code] || 0) + 1;
    if (adjustedForSimilarity) stats.adjusted += 1;
  });

  if (students.size !== expectedStudents) throw new Error(`Se esperaban ${expectedStudents} estudiantes y llegaron ${students.size}.`);
  if (sessions.size !== EXPECTED_SESSIONS.length) throw new Error(`Se esperaban ${EXPECTED_SESSIONS.length} sesiones y llegaron ${sessions.size}.`);

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

function recordsFromObject(root, expectedPairs) {
  const records = {};
  expectedPairs.forEach(pair => {
    const [uid, sessionId] = pair.split('/');
    records[pair] = root[uid] && root[uid][sessionId] ? root[uid][sessionId] : null;
  });
  return records;
}

function changesAgainst(currentRoot, records) {
  const changes = { created: 0, gradeUp: 0, gradeDown: 0, sameGrade: 0, pendingChanged: 0 };
  Object.entries(records).forEach(([pair, record]) => {
    const [uid, sessionId] = pair.split('/');
    const before = currentRoot[uid] && currentRoot[uid][sessionId];
    const beforeGrade = before && before.grade !== undefined ? before.grade : null;
    const afterGrade = record.grade !== undefined ? record.grade : null;
    if (!before) changes.created += 1;
    else if (beforeGrade === afterGrade) changes.sameGrade += 1;
    else if (beforeGrade === null || afterGrade === null) changes.pendingChanged += 1;
    else if (Number(beforeGrade) < afterGrade) changes.gradeUp += 1;
    else changes.gradeDown += 1;
  });
  return changes;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = path.resolve(args.input || path.join(os.tmpdir(), 'simce-u3-labor-review.json'));
  const source = JSON.parse(fs.readFileSync(input, 'utf8'));
  const publishedAt = String(args['published-at'] || new Date().toISOString());
  const expectedStudents = Number(args['expected-students']);
  const first = buildPublication(source, publishedAt, expectedStudents);
  const second = buildPublication(source, publishedAt, expectedStudents);
  const firstChecksum = checksum(first.records);
  const secondChecksum = checksum(second.records);
  if (firstChecksum !== secondChecksum || first.stats.rows !== second.stats.rows) {
    throw new Error('La simulación no fue determinista; no se publicará nada.');
  }

  const platform = await readPlatform();
  const currentRoot = platform.calificaciones_clase || {};
  const report = {
    mode: args.apply ? 'apply' : 'simulation',
    inputGeneratedAt: source.generatedAt || null,
    modelVersion: MODEL_VERSION,
    checksum: firstChecksum,
    ...first.stats,
    changes: changesAgainst(currentRoot, first.records)
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

  const backupDir = path.join(os.tmpdir(), 'estudiacest-private-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `simce-labor-grades-before-${Date.now()}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(currentRoot, null, 2), 'utf8');

  // Una sola escritura multirruta: o se aplican los registros completos, o ninguno.
  const update = {};
  Object.entries(first.records).forEach(([pair, record]) => {
    update[`calificaciones_clase/${pair}`] = record;
  });
  await updatePlatform(update);

  const after = await readPlatform();
  const afterRecords = recordsFromObject(after.calificaciones_clase || {}, Object.keys(first.records));
  const appliedChecksum = checksum(afterRecords);
  if (appliedChecksum !== firstChecksum) {
    throw new Error(`La lectura posterior no coincide: esperado ${firstChecksum}, recibido ${appliedChecksum}.`);
  }

  console.log(JSON.stringify({ applied: first.stats.rows, verified: first.stats.rows, backupPath }, null, 2));
}

main().catch(error => {
  console.error('[publish-simce-labor-grades]', error.message);
  process.exitCode = 1;
});
