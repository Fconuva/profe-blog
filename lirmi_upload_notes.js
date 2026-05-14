require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = __dirname;

const COURSE_PRESETS = {
  '3A': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258055&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Pedro_Paramo_3A_TP_2026.csv')
  },
  '3B': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258057&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Pedro_Paramo_3B_TP_2026.csv')
  },
  '3D': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258072&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Pedro_Paramo_3D_TP_2026.csv')
  },
  '4A': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258082&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Maus_4A_TP_2026.csv')
  },
  '4B': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258098&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Maus_4B_TP_2026.csv')
  },
  '4C': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258086&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Maus_4C_TP_2026.csv')
  },
  '4D': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258087&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Maus_4D_TP_2026.csv')
  },
  '4E': {
    url: 'https://libro.lirmi.com/?curso_aula_id=258091&periodo_id=1',
    csvPath: path.join(ROOT, 'lecturas', 'adminprofe', 'reportes', 'Planilla_Maus_4E_TP_2026.csv')
  }
};

function parseArgs(argv) {
  const options = {
    headless: true,
    dryRun: false,
    clearMissing: true,
    targetColumn: null,
    course: null,
    url: null,
    csvPath: null,
    email: process.env.LIRMI_EMAIL || '',
    password: process.env.LIRMI_PASSWORD || ''
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--course') options.course = String(argv[index + 1] || '').toUpperCase(), index += 1;
    else if (arg === '--url') options.url = argv[index + 1], index += 1;
    else if (arg === '--csv') options.csvPath = argv[index + 1], index += 1;
    else if (arg === '--email') options.email = argv[index + 1], index += 1;
    else if (arg === '--password') options.password = argv[index + 1], index += 1;
    else if (arg === '--target-column') options.targetColumn = argv[index + 1], index += 1;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--show-browser') options.headless = false;
    else if (arg === '--keep-missing') options.clearMissing = false;
  }

  return options;
}

function csvSplit(line) {
  const out = [];
  let current = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const ch = line[index];
    if (ch === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (ch === ';' && !quoted) {
      out.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  out.push(current);
  return out;
}

function readCsv(csvPath) {
  const text = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = csvSplit(lines[0]).map(value => String(value || '').trim());
  return lines.slice(1).map(line => {
    const cols = csvSplit(line);
    const row = {};
    header.forEach((key, idx) => {
      row[key] = String(cols[idx] == null ? '' : cols[idx]).trim();
    });
    return row;
  });
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .replace(/\bPIE\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function tokenizeName(value) {
  return normalizeName(value).split(' ').filter(token => token.length > 1);
}

function noteToLirmi(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const parsed = Number(raw.replace(',', '.'));
  if (!Number.isFinite(parsed)) return '';
  return parsed.toFixed(1).replace('.', ',');
}

function shouldUseRow(row) {
  const note = noteToLirmi(row.Nota || row.nota || '');
  if (!note) return false;
  const state = String(row.Estado || row.estado || '').trim().toUpperCase();
  if (!state) return true;
  return !['AUSENTE', 'PENDIENTE', 'EXCLUIDO'].includes(state);
}

function buildGradeSource(csvPath) {
  const rows = readCsv(csvPath);
  const entries = rows
    .filter(shouldUseRow)
    .map(row => ({
      name: row.Nombre || row.Estudiante || '',
      note: noteToLirmi(row.Nota || row.nota || ''),
      matchKey: normalizeName(row.Nombre || row.Estudiante || '')
    }))
    .filter(entry => entry.name && entry.note);

  const exactMap = new Map();
  for (const entry of entries) exactMap.set(entry.matchKey, entry);
  return { entries, exactMap };
}

function overlapScore(leftName, rightName) {
  const left = new Set(tokenizeName(leftName));
  const right = new Set(tokenizeName(rightName));
  if (!left.size || !right.size) return -1;
  let overlap = 0;
  for (const token of left) {
    if (right.has(token)) overlap += 1;
  }
  if (!overlap) return -1;
  return overlap * 10 - Math.abs(left.size - right.size);
}

function matchEntry(name, exactMap, entries) {
  const key = normalizeName(name);
  if (exactMap.has(key)) return { entry: exactMap.get(key), mode: 'exact' };

  const ranked = entries
    .map(entry => ({ entry, score: overlapScore(name, entry.name) }))
    .filter(candidate => candidate.score >= 30)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name, 'es'));

  if (!ranked.length) return { entry: null, mode: 'missing' };
  if (ranked.length > 1 && ranked[0].score === ranked[1].score) return { entry: null, mode: 'ambiguous' };
  return { entry: ranked[0].entry, mode: 'fuzzy' };
}

async function loginIfNeeded(page, email, password, targetUrl) {
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  if (!/login\.lirmi\.com/i.test(page.url())) return;

  if (!email || !password) throw new Error('Faltan credenciales Lirmi. Usa --email y --password o variables LIRMI_EMAIL/LIRMI_PASSWORD.');

  await page.waitForSelector('input[placeholder="Lirmi@correo.com"]', { timeout: 15000 });
  await page.type('input[placeholder="Lirmi@correo.com"]', email, { delay: 20 });
  await page.type('input[type="password"]', password, { delay: 20 });

  await page.evaluate(() => {
    const button = Array.from(document.querySelectorAll('button')).find(node => /Ingresar/i.test(node.innerText || ''));
    if (!button) throw new Error('No se encontro el boton Ingresar de Lirmi.');
    button.click();
  });
  await page.waitForFunction(() => !/login\.lirmi\.com/i.test(window.location.href), { timeout: 45000 });

  if (/login\.lirmi\.com/i.test(page.url())) throw new Error('Lirmi rechazo el inicio de sesion.');
  if (page.url() !== targetUrl) await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
}

async function waitForGradebook(page) {
  await page.waitForSelector('table tbody tr', { timeout: 20000 });
  await page.waitForSelector('button', { timeout: 20000 });
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('table thead th')).some(node => {
      const text = String(node.innerText || '').replace(/\s+/g, ' ').trim();
      return /^N\s*\d+$/i.test(text);
    });
  }, { timeout: 30000 });
}

async function inspectGrid(page) {
  return page.evaluate(() => {
    const headerCells = Array.from(document.querySelectorAll('table thead th'));
    const headers = headerCells.map((th, index) => ({
      index,
      text: String(th.innerText || '').replace(/\s+/g, ' ').trim()
    }));

    const rows = Array.from(document.querySelectorAll('table tbody tr')).map((tr, rowIndex) => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const row = {
        rowIndex,
        name: cells[1] ? String(cells[1].innerText || '').replace(/\s+/g, ' ').trim() : ''
      };

      headers.forEach(header => {
        const cell = cells[header.index];
        if (!cell) return;
        const input = cell.querySelector('input[id*="input-estudiante-"]');
        const span = cell.querySelector('a span');
        row['cell_' + header.index] = {
          inputId: input ? input.id : null,
          current: input && input.value ? input.value : (span ? String(span.innerText || '').trim() : ''),
          editable: !!input
        };
      });

      return row;
    }).filter(row => row.name);

    return { headers, rows };
  });
}

function pickTargetHeader(headers, targetColumn) {
  const noteHeaders = headers.filter(header => /^N\s*\d+$/i.test(header.text));
  if (!noteHeaders.length) throw new Error('No se encontraron columnas de notas N1/N2 en la grilla de Lirmi.');

  if (targetColumn) {
    const normalizedTarget = String(targetColumn).replace(/\s+/g, '').toUpperCase();
    const explicit = noteHeaders.find(header => header.text.replace(/\s+/g, '').toUpperCase() === normalizedTarget);
    if (!explicit) throw new Error('No existe la columna objetivo ' + targetColumn + ' en Lirmi.');
    return explicit;
  }

  return noteHeaders.sort((left, right) => {
    const leftNum = Number(left.text.replace(/[^0-9]/g, '')) || 0;
    const rightNum = Number(right.text.replace(/[^0-9]/g, '')) || 0;
    return leftNum - rightNum;
  })[noteHeaders.length - 1];
}

function buildAssignments(gridRows, gradeSource, headerIndex, clearMissing) {
  const assignments = [];
  const used = new Set();
  const report = { exact: 0, fuzzy: 0, blank: 0, missing: [], ambiguous: [] };

  for (const row of gridRows) {
    const targetCell = row['cell_' + headerIndex];
    if (!targetCell || !targetCell.inputId) continue;
    const matched = matchEntry(row.name, gradeSource.exactMap, gradeSource.entries);
    if (matched.entry) {
      assignments.push({ inputId: targetCell.inputId, name: row.name, note: matched.entry.note });
      used.add(matched.entry.matchKey);
      report[matched.mode] += 1;
      continue;
    }

    if (matched.mode === 'ambiguous') report.ambiguous.push(row.name);
    else report.missing.push(row.name);

    if (clearMissing) {
      assignments.push({ inputId: targetCell.inputId, name: row.name, note: '' });
      report.blank += 1;
    }
  }

  const unused = gradeSource.entries.filter(entry => !used.has(entry.matchKey)).map(entry => entry.name);
  return { assignments, report, unused };
}

async function applyAssignments(page, assignments) {
  return page.evaluate(items => {
    const result = [];
    for (const item of items) {
      const input = document.getElementById(item.inputId);
      if (!input) {
        result.push({ name: item.name, ok: false, reason: 'input-missing' });
        continue;
      }
      input.style.display = 'block';
      input.value = item.note;
      const span = input.parentElement ? input.parentElement.querySelector('a span') : null;
      if (span) span.textContent = item.note;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      result.push({ name: item.name, ok: true, note: item.note });
    }
    return result;
  }, assignments);
}

async function saveChanges(page) {
  await page.waitForFunction(() => {
    const button = Array.from(document.querySelectorAll('button')).find(node => /Guardar/i.test(node.innerText || ''));
    return button && !button.disabled;
  }, { timeout: 15000 });

  await Promise.all([
    page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(node => /Guardar/i.test(node.innerText || ''));
      button.click();
    }),
    page.waitForNetworkIdle({ idleTime: 800, timeout: 30000 }).catch(() => null)
  ]);

  await page.waitForFunction(() => {
    const button = Array.from(document.querySelectorAll('button')).find(node => /Guardar/i.test(node.innerText || ''));
    return button && button.disabled;
  }, { timeout: 30000 });
}

function resolveConfig(options) {
  if (options.course && COURSE_PRESETS[options.course]) {
    return {
      course: options.course,
      url: options.url || COURSE_PRESETS[options.course].url,
      csvPath: options.csvPath || COURSE_PRESETS[options.course].csvPath
    };
  }
  if (!options.url || !options.csvPath) throw new Error('Usa --course <3A|3B|3D|4A|4B|4C|4D|4E> o entrega --url y --csv.');
  return { course: options.course || 'CUSTOM', url: options.url, csvPath: options.csvPath };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const config = resolveConfig(options);
  const gradeSource = buildGradeSource(config.csvPath);

  if (!gradeSource.entries.length) throw new Error('No se encontraron notas utilizables en ' + config.csvPath);

  const browser = await puppeteer.launch({
    headless: options.headless,
    defaultViewport: { width: 1440, height: 1100 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(45000);
    await loginIfNeeded(page, options.email, options.password, config.url);
    await waitForGradebook(page);

    const grid = await inspectGrid(page);
    const targetHeader = pickTargetHeader(grid.headers, options.targetColumn);
    const plan = buildAssignments(grid.rows, gradeSource, targetHeader.index, options.clearMissing);

    console.log('[course]', config.course);
    console.log('[url]', config.url);
    console.log('[csv]', config.csvPath);
    console.log('[target]', targetHeader.text, '(column index ' + targetHeader.index + ')');
    console.log('[rows]', grid.rows.length, '| source grades', gradeSource.entries.length);
    console.log('[match]', 'exact=' + plan.report.exact, 'fuzzy=' + plan.report.fuzzy, 'blank=' + plan.report.blank);

    if (plan.report.ambiguous.length) console.log('[ambiguous]', plan.report.ambiguous.join(' | '));
    if (plan.report.missing.length) console.log('[missing]', plan.report.missing.join(' | '));
    if (plan.unused.length) console.log('[unused-source]', plan.unused.join(' | '));

    await applyAssignments(page, plan.assignments);

    if (options.dryRun) {
      console.log('[dry-run] Cambios cargados en pantalla pero no guardados.');
      return;
    }

    await saveChanges(page);
    console.log('[saved] Notas guardadas en Lirmi para', config.course);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error('[error]', error.message);
  process.exitCode = 1;
});