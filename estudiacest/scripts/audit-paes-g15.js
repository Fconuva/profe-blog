const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const guidePath = path.join(root, 'paes', 'guia15.html');
const guide16Path = path.join(root, 'paes', 'guia16.html');
const adminPath = path.join(root, 'paes', 'admin', 'index.html');
const guideLockPath = path.join(root, 'paes', 'js', 'guia-lock.js');
const html = fs.readFileSync(guidePath, 'utf8');
const admin = fs.readFileSync(adminPath, 'utf8');
const guideLock = fs.readFileSync(guideLockPath, 'utf8');
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function check(condition, message) { if (!condition) fail(message); }
function extractArray(source, marker) {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`No se encontró ${marker}`);
  const open = source.indexOf('[', start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  throw new Error(`No se cerró ${marker}`);
}
function parseArray(source, marker) {
  return vm.runInNewContext(`(${extractArray(source, marker)})`);
}
function textOnly(fragment) {
  return fragment.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function words(value) { return textOnly(value).split(/\s+/).filter(Boolean).length; }

const questions = parseArray(html, 'const QUESTIONS = [');
const criterion = parseArray(html, 'const CRITERION_ITEMS = [');
const evidence = parseArray(html, 'const EVIDENCE_ITEMS = [');
const judgment = parseArray(html, 'const JUDGMENT_ITEMS = [');

check(questions.length === 18, `Se esperaban 18 preguntas y hay ${questions.length}.`);
check(new Set(questions.map(q => q.id)).size === questions.length, 'Hay IDs de reactivo repetidos.');
check(new Set(questions.map(q => q.n)).size === questions.length, 'Hay números de reactivo repetidos.');
const skillCounts = questions.reduce((acc, q) => { acc[q.skill] = (acc[q.skill] || 0) + 1; return acc; }, {});
check(skillCounts.LOCALIZAR === 2, `Localizar debe tener 2 reactivos; hay ${skillCounts.LOCALIZAR || 0}.`);
check(skillCounts.INTERPRETAR === 4, `Interpretar debe tener 4 reactivos; hay ${skillCounts.INTERPRETAR || 0}.`);
check(skillCounts.EVALUAR === 12, `Evaluar debe tener 12 reactivos; hay ${skillCounts.EVALUAR || 0}.`);

const optionLetters = ['A', 'B', 'C', 'D'];
const keyCounts = { A: 0, B: 0, C: 0, D: 0 };
questions.forEach((q) => {
  check(optionLetters.length === Object.keys(q.options || {}).length, `q${q.n}: debe tener cuatro alternativas.`);
  check(optionLetters.includes(q.correct), `q${q.n}: la clave no es A-D.`);
  keyCounts[q.correct] += 1;
  check(String(q.evidence || '').trim().length >= 20, `q${q.n}: falta evidencia textual suficiente.`);
  check(q.explain && optionLetters.every(letter => String(q.explain[letter] || '').trim().length >= 20), `q${q.n}: falta descarte de algún distractor.`);
  const lengths = optionLetters.map(letter => String(q.options[letter] || '').length);
  const max = Math.max(...lengths);
  const min = Math.min(...lengths);
  if (max > min * 2.5 && max - min > 80) warnings.push(`q${q.n}: revisar extensión de alternativas (${min}-${max} caracteres).`);
});
check(Object.values(keyCounts).every(value => value >= 3), `Distribución de claves desequilibrada: ${JSON.stringify(keyCounts)}.`);
check(new Set(questions.map(q => q.task.split('·')[0].trim())).size >= 5, 'La matriz no cubre suficientes tareas PAES.');

const readings = [...html.matchAll(/<article class="reading"[\s\S]*?<\/article>/g)].map(match => match[0]);
check(readings.length === 3, `Se esperaban 3 textos y se detectaron ${readings.length}.`);
readings.forEach((reading, index) => {
  const count = words(reading);
  check(count >= 500 && count <= 2000, `Texto ${index + 1}: ${count} palabras; debe estar entre 500 y 2000.`);
});

check(criterion.length + evidence.length + judgment.length === 13, 'La actividad conceptual no suma 13 microejercicios.');
check(html.includes('minlength="20"') && (html.match(/data-meta=/g) || []).length === 5, 'El cierre no contiene cinco respuestas escritas con mínimo verificable.');
check(html.includes('video-cej-evaluar.mp4'), 'La guía no enlaza el video C-E-J.');
check(html.includes("conceptVideo.playbackRate = 1.5"), 'El video no tiene velocidad inicial 1.5x.');
check(html.includes("STORAGE_PREFIX = 'paes_g15_eval_v1_'") && html.includes("guiaId:'15'"), 'La guía 15 no usa identidad y almacenamiento versionados.');
check(html.includes("['copy','cut','paste','contextmenu','dragstart','selectstart']"), 'La Guía 15 no bloquea copia, pegado y selección.');
check(html.includes("'visibilitychange'") && html.includes("'window-blur'") && html.includes('security-hidden'), 'La Guía 15 no oculta el contenido al perder el foco.');
check(html.includes("'print-screen'") && html.includes("'before-print'"), 'La Guía 15 no registra intentos de captura o impresión.');
check(html.includes('incidentes_seguridad'), 'La Guía 15 no adjunta los incidentes de seguridad al respaldo docente.');
check(guideLock.includes('window.checkGuiaAccess') && guideLock.includes('paes-student-authenticated'), 'El candado no valida excepciones individuales después del inicio de sesión.');
check(fs.existsSync(path.join(root, 'paes', 'assets', 'guia15', 'video-cej-evaluar.mp4')), 'Falta el MP4 estático de la Guía 15.');
check(fs.existsSync(guide16Path) && fs.readFileSync(guide16Path, 'utf8').includes("GUIA_LOCK_ID = 'g16'"), 'La antigua Guía 15 no quedó disponible como Guía 16.');
check(admin.includes("'15':") && admin.includes("'16':") && admin.includes("total: 18"), 'El administrador no tiene ambos registros de guías.');

if (warnings.length) console.warn('[advertencias]');
warnings.forEach(message => console.warn(`- ${message}`));
if (errors.length) {
  console.error('[fallos]');
  errors.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, texts: readings.map(words), questions: questions.length, skills: skillCounts, keyCounts, concepts: 13, meta: 5 }, null, 2));
