const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';
const ACTOR = 'apply-session-writing-grades';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

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

function sanitizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeHeader(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function splitDelimitedLine(line, delimiter) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseDelimitedRows(content) {
  const lines = String(content || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = splitDelimitedLine(lines[0], delimiter).map(normalizeHeader);

  return lines.slice(1).map(line => {
    const values = splitDelimitedLine(line, delimiter);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
}

function loadInputRows(inputPath) {
  const raw = fs.readFileSync(inputPath, 'utf8');
  if (path.extname(inputPath).toLowerCase() === '.csv') {
    return parseDelimitedRows(raw);
  }

  const data = JSON.parse(raw);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.rows)) return data.rows;
  if (data && Array.isArray(data.items)) return data.items;
  throw new Error('El archivo de entrada debe ser CSV, un arreglo JSON o un objeto con rows/items.');
}

function firstDefined(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && String(record[key]).trim() !== '') {
      return record[key];
    }
  }
  return null;
}

function toNumber(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const normalized = String(value).trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function calcNota(pct) {
  const porcentaje = Math.max(0, Math.min(100, Number(pct) || 0));
  if (porcentaje <= 0) return 1.0;
  if (porcentaje < 60) return Math.round((1.0 + (porcentaje / 60) * 3.0) * 10) / 10;
  return Math.round((4.0 + ((porcentaje - 60) / 40) * 3.0) * 10) / 10;
}

function pctFromNota(nota) {
  const value = Number(nota);
  if (!Number.isFinite(value)) return null;
  if (value <= 1.0) return 0;
  if (value < 4.0) return Math.round(((value - 1.0) / 3.0) * 60);
  if (value >= 7.0) return 100;
  return Math.round(60 + ((value - 4.0) / 3.0) * 40);
}

function normalizeInputRows(rows) {
  return rows
    .map((row, index) => {
      const normalizedRow = {};
      Object.entries(row || {}).forEach(([key, value]) => {
        normalizedRow[normalizeHeader(key)] = value;
      });

      const uid = String(firstDefined(normalizedRow, ['uid', 'id']) || '').trim();
      const nombre = String(firstDefined(normalizedRow, ['nombre', 'name']) || '').trim();
      const comentario = String(firstDefined(normalizedRow, ['comentario', 'comment', 'observacion']) || '').trim();

      let escrituraPct = toNumber(firstDefined(normalizedRow, [
        'escriturapct',
        'writingpct',
        'escrituraporcentaje',
        'writingpercentage'
      ]));

      const escrituraNota = toNumber(firstDefined(normalizedRow, [
        'escrituranota',
        'writinggrade',
        'writingnota',
        'notaescritura'
      ]));

      if (escrituraPct === null && escrituraNota !== null) {
        escrituraPct = pctFromNota(escrituraNota);
      }

      return {
        rowNumber: index + 2,
        uid,
        nombre,
        comentario,
        escrituraPct,
        escrituraNota
      };
    })
    .filter(row => row.uid || row.escrituraPct !== null || row.escrituraNota !== null);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sessionId = String(args.session || '').trim();
  const inputPath = path.resolve(String(args.input || '').trim());
  const course = String(args.course || '').trim().toUpperCase();
  const apply = args.apply === true;

  if (!sessionId) {
    throw new Error('Debes indicar --session <id>.');
  }
  if (!inputPath) {
    throw new Error('Debes indicar --input <archivo>.');
  }
  if (!fs.existsSync(inputPath)) {
    throw new Error('No existe el archivo de entrada: ' + inputPath);
  }

  const inputRows = normalizeInputRows(loadInputRows(inputPath));
  const gradedRows = inputRows.filter(row => row.uid && row.escrituraPct !== null);
  if (gradedRows.length === 0) {
    throw new Error('No se encontraron filas con uid y escritura_pct/escritura_nota en el archivo.');
  }

  ensureFirebase();
  const db = admin.database();
  const [resultsSnap, studentsSnap] = await Promise.all([
    db.ref(`${BASE}/resultados/${sessionId}`).once('value'),
    db.ref(`${BASE}/estudiantes`).once('value')
  ]);

  const results = resultsSnap.val() || {};
  const students = studentsSnap.val() || {};
  const summary = {
    mode: apply ? 'apply' : 'dry-run',
    sessionId,
    course: course || 'ALL',
    inputPath,
    totalRows: gradedRows.length,
    updated: 0,
    missingResult: 0,
    invalidRange: 0,
    skippedCourse: 0,
    missingAlternatives: 0,
    previewCount: 0
  };

  const preview = [];

  for (const row of gradedRows) {
    if (row.escrituraPct < 0 || row.escrituraPct > 100) {
      summary.invalidRange += 1;
      continue;
    }

    const result = results[row.uid];
    if (!result) {
      summary.missingResult += 1;
      continue;
    }

    const student = students[row.uid] || {};
    const studentCourse = String((result.curso || student.curso || '')).trim().toUpperCase();
    if (course && studentCourse !== course) {
      summary.skippedCourse += 1;
      continue;
    }

    const alternativasPct = Number.isFinite(Number(result.alternativas_pct))
      ? Number(result.alternativas_pct)
      : Number(result.porcentaje);
    if (!Number.isFinite(alternativasPct)) {
      summary.missingAlternatives += 1;
      continue;
    }

    const escrituraPct = Math.round(row.escrituraPct);
    const porcentajeFinal = Math.round((alternativasPct * 0.5) + (escrituraPct * 0.5));
    const notaAlternativas = calcNota(alternativasPct);
    const notaEscritura = row.escrituraNota !== null ? row.escrituraNota : calcNota(escrituraPct);
    const notaFinal = calcNota(porcentajeFinal);
    const payload = {
      alternativas_pct: alternativasPct,
      escritura_pct: escrituraPct,
      porcentaje_final: porcentajeFinal,
      nota_alternativas: notaAlternativas,
      nota_escritura: notaEscritura,
      nota: notaFinal,
      grading_mode: 'alternativas_50_escritura_50',
      grading_weights: { alternativas: 0.5, escritura: 0.5 },
      grading_updated_at: Date.now(),
      grading_updated_by: ACTOR
    };

    if (row.comentario) {
      payload.escritura_comentario = row.comentario;
    }

    preview.push({
      uid: row.uid,
      nombre: row.nombre || student.nombre || result.nombre || '',
      curso: studentCourse || result.curso || '',
      alternativasPct,
      escrituraPct,
      porcentajeFinal,
      notaAnterior: Number.isFinite(Number(result.nota)) ? Number(result.nota) : null,
      notaFinal
    });

    if (apply) {
      await db.ref(`${BASE}/resultados/${sessionId}/${row.uid}`).update(payload);
    }

    summary.updated += 1;
  }

  summary.previewCount = preview.length;

  const reportPath = path.resolve(
    __dirname,
    '..',
    args.output || path.join(
      'exports',
      'session-review',
      `${sanitizeSlug(sessionId)}_${sanitizeSlug(course || 'all')}_${apply ? 'apply' : 'dry-run'}-writing-grades.json`
    )
  );
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), summary, preview }, null, 2), 'utf8');

  console.log(JSON.stringify({ reportPath, summary }, null, 2));
  if (preview.length > 0) {
    console.table(preview.slice(0, 20));
  }
}

main().catch((error) => {
  console.error('[apply-session-writing-grades]', error.message);
  process.exitCode = 1;
});