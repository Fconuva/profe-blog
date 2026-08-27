const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT = 'estudiacest';
const BASE_PATH = '/plataforma_paes';
const GUIDES = ['11', '12', '13', '14', '15', '16', '17'];
const MODEL_VERSION = 'paes-segundo-semestre-g11-g17-2026-08-27';

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

function normalizeCourse(value) {
  return String(value || '').toUpperCase().replace(/\s+/g, '').replace(/[-°º]/g, '');
}

function validGrade(value) {
  const grade = Number(String(value == null ? '' : value).replace(',', '.'));
  return Number.isFinite(grade) && grade >= 1 && grade <= 7 ? grade.toFixed(1) : null;
}

function gradeFromScore(correct, total) {
  const safeCorrect = Number(correct);
  const safeTotal = Number(total);
  if (!Number.isFinite(safeCorrect) || !Number.isFinite(safeTotal) || safeTotal <= 0) return null;
  const percentage = Math.max(0, Math.min(100, safeCorrect / safeTotal * 100));
  const grade = percentage < 60
    ? 1 + percentage * 3 / 60
    : 4 + (percentage - 60) * 3 / 40;
  return Math.max(1, Math.min(7, grade)).toFixed(1);
}

function isSubmitted(guideId, record) {
  if (!record || typeof record !== 'object') return false;
  if (record.status === 'sent' || record.submitted === true || record.completada === true) return true;
  return ['11', '12', '13'].includes(String(guideId)) &&
    Number(record.submittedAt) > 0 && Object.keys(record.answers || {}).length > 0;
}

function isCurrentGuide14(record) {
  if (!record || typeof record !== 'object') return false;
  if (record.instrumentVersion === 'g14-2026-1') return true;
  const answerIds = Object.keys(record.answers || {});
  if (answerIds.some(id => /^q(?:0[1-9]|[1-4]\d)$/.test(id))) return true;
  return Array.isArray(record.form) && record.form.length === 5 &&
    record.form.every(id => ['1', '2', '3', '4', '5'].includes(String(id)));
}

function attemptGrade(guideId, record) {
  const manual = validGrade(record && record.grade && record.grade.nota);
  if (manual) return { grade: manual, source: 'manual' };
  if (!isSubmitted(guideId, record)) return null;
  if (String(guideId) === '14' && !isCurrentGuide14(record)) return null;
  const calculated = gradeFromScore(record.correct, record.total);
  return calculated ? { grade: calculated, source: 'score' } : null;
}

function recordCourse(book, responses, rut) {
  if (book && book.curso) return book.curso;
  for (let index = GUIDES.length - 1; index >= 0; index -= 1) {
    const response = responses[GUIDES[index]] && responses[GUIDES[index]][rut];
    if (response && response.curso) return response.curso;
  }
  return '';
}

function recordName(book, responses, rut) {
  if (book && book.nombre) return book.nombre;
  for (let index = GUIDES.length - 1; index >= 0; index -= 1) {
    const response = responses[GUIDES[index]] && responses[GUIDES[index]][rut];
    if (response && response.nombre) return response.nombre;
  }
  return '';
}

function buildPublication(books, responses, publishedAt = Date.now()) {
  const allRuts = new Set(Object.keys(books || {}));
  GUIDES.forEach(guideId => Object.keys((responses && responses[guideId]) || {}).forEach(rut => allRuts.add(rut)));

  const target = {};
  const projection = {};
  const summary = {};
  let manualOverrides = 0;
  let preservedGuide11 = 0;

  GUIDES.forEach(guideId => { summary[guideId] = { graded: 0, missing: 0, omitted: 0 }; });

  [...allRuts].sort().forEach(rut => {
    const current = (books && books[rut]) || {};
    const course = recordCourse(current, responses || {}, rut);
    const normalizedCourse = normalizeCourse(course);
    const notes = { ...(current.notas || {}) };
    const projectedNotes = {};

    GUIDES.forEach(guideId => {
      delete notes[guideId];
      const omitted = guideId === '14' && normalizedCourse === '4AHC';
      if (omitted) {
        summary[guideId].omitted += 1;
        projectedNotes[guideId] = null;
        return;
      }

      const response = responses && responses[guideId] && responses[guideId][rut];
      let resolved = attemptGrade(guideId, response);

      if (guideId === '11') {
        const existing = validGrade(current.notas && current.notas['11']);
        const manual = validGrade(response && response.grade && response.grade.nota);
        if (manual) {
          resolved = { grade: manual, source: 'manual' };
        } else if (existing) {
          resolved = { grade: existing, source: 'existing-guide-11' };
        }
      }

      if (resolved) {
        notes[guideId] = resolved.grade;
        projectedNotes[guideId] = resolved.grade;
        summary[guideId].graded += 1;
        if (resolved.source === 'manual') manualOverrides += 1;
        if (resolved.source === 'existing-guide-11') preservedGuide11 += 1;
      } else {
        projectedNotes[guideId] = null;
        summary[guideId].missing += 1;
      }
    });

    target[rut] = {
      ...current,
      nombre: recordName(current, responses || {}, rut),
      curso: course,
      notas: notes,
      segundoSemestreModelo: MODEL_VERSION,
      segundoSemestreActualizadoAt: publishedAt,
      updatedAt: publishedAt
    };
    projection[rut] = { course: normalizedCourse, notes: projectedNotes };
  });

  return {
    target,
    projection,
    summary,
    manualOverrides,
    preservedGuide11,
    students: allRuts.size,
    checksum: checksum(projection)
  };
}

function firebaseCommand(args) {
  const windowsCli = path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js');
  const executable = process.platform === 'win32' ? process.execPath : 'firebase';
  const cliArgs = process.platform === 'win32' ? [windowsCli, ...args] : args;
  const result = spawnSync(executable, cliArgs, { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) {
    const message = String((result.error && result.error.message) || result.stderr || result.stdout || 'Error de Firebase').trim().split(/\r?\n/).slice(-3).join(' ');
    throw new Error(message);
  }
  return result;
}

function readFirebaseJson(remotePath, localPath) {
  firebaseCommand(['database:get', remotePath, '--project', PROJECT, '--output', localPath]);
  return JSON.parse(fs.readFileSync(localPath, 'utf8')) || {};
}

function aggregateForLog(publication) {
  return {
    students: publication.students,
    gradesByGuide: Object.fromEntries(GUIDES.map(id => [id, publication.summary[id].graded])),
    missingByGuide: Object.fromEntries(GUIDES.map(id => [id, publication.summary[id].missing])),
    omittedGuide14: publication.summary['14'].omitted,
    manualOverrides: publication.manualOverrides,
    preservedGuide11: publication.preservedGuide11,
    checksum: publication.checksum
  };
}

function main() {
  const apply = process.argv.includes('--apply');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'paes-semester-grades-'));
  const booksPath = path.join(tempDir, 'libro-notas.json');
  const responsesPath = path.join(tempDir, 'guia-respuestas.json');
  const payloadPath = path.join(tempDir, 'actualizacion.json');
  const verifyPath = path.join(tempDir, 'verificacion.json');

  const books = readFirebaseJson(`${BASE_PATH}/libro_notas`, booksPath);
  const responses = readFirebaseJson(`${BASE_PATH}/guia_respuestas`, responsesPath);
  const publishedAt = Date.now();
  const firstPass = buildPublication(books, responses, publishedAt);
  const secondPass = buildPublication(JSON.parse(JSON.stringify(books)), JSON.parse(JSON.stringify(responses)), publishedAt);

  if (firstPass.checksum !== secondPass.checksum || stableStringify(firstPass.summary) !== stableStringify(secondPass.summary)) {
    throw new Error('La segunda simulación no coincide con la primera. No se escribirá nada.');
  }

  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', ...aggregateForLog(firstPass) }, null, 2));
  if (!apply) return;

  fs.writeFileSync(payloadPath, JSON.stringify(firstPass.target));
  firebaseCommand(['database:update', `${BASE_PATH}/libro_notas`, payloadPath, '--project', PROJECT, '--force']);

  const appliedBooks = readFirebaseJson(`${BASE_PATH}/libro_notas`, verifyPath);
  const verification = buildPublication(appliedBooks, responses, publishedAt);
  if (verification.checksum !== firstPass.checksum) {
    throw new Error(`Verificación fallida: esperado ${firstPass.checksum}, obtenido ${verification.checksum}.`);
  }
  console.log(JSON.stringify({ applied: true, ...aggregateForLog(verification), backup: booksPath }, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`PUBLICATION_FAILED: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  GUIDES,
  MODEL_VERSION,
  attemptGrade,
  buildPublication,
  gradeFromScore,
  isCurrentGuide14,
  isSubmitted,
  normalizeCourse,
  validGrade
};
