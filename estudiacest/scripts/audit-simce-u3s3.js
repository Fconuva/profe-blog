const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "../estudiantes/guia-u3-s3-reportaje.html");
const html = fs.readFileSync(file, "utf8");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

const baseMatch = html.match(/const BASE_QUESTIONS=\[(.*?)\];\s*\n\s*const SKILL_NAMES/s);
if (!baseMatch) {
  fail("No se encontró BASE_QUESTIONS.");
  process.exit(1);
}

const vm = require("vm");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`questions=[${baseMatch[1]}]`, sandbox);
const questions = sandbox.questions;

if (questions.length !== 10) fail(`Se esperaban 10 preguntas y hay ${questions.length}.`);

const key = questions.map(q => q.correct).join("");
const expectedKey = "BDACBAD-CAB".replace("-", "");
if (key !== expectedKey) fail(`Clave inesperada: ${key}; se esperaba ${expectedKey}.`);

const counts = {};
for (const letter of key) counts[letter] = (counts[letter] || 0) + 1;
const spread = Math.max(...Object.values(counts)) - Math.min(...Object.values(counts));
if (spread > 1) fail(`Distribución de claves desbalanceada: ${JSON.stringify(counts)}.`);

const skillCounts = questions.reduce((acc, q) => {
  acc[q.skill] = (acc[q.skill] || 0) + 1;
  return acc;
}, {});
if (JSON.stringify(skillCounts) !== JSON.stringify({ L: 2, I: 5, R: 3 })) {
  fail(`Distribución de habilidades inesperada: ${JSON.stringify(skillCounts)}.`);
}

for (const q of questions) {
  const options = Object.entries(q.options);
  if (options.length !== 4) fail(`${q.id}: no tiene cuatro alternativas.`);
  if (!q.options[q.correct]) fail(`${q.id}: la clave no corresponde a una alternativa.`);
  const lengths = options.map(([, text]) => text.length);
  const correctLength = q.options[q.correct].length;
  const maxLength = Math.max(...lengths);
  const minLength = Math.min(...lengths);
  if (maxLength - minLength > 48) fail(`${q.id}: alternativas demasiado dispares (${minLength}-${maxLength} caracteres).`);
  if (correctLength === maxLength && lengths.filter(n => n === maxLength).length === 1) {
    console.warn(`AVISO: ${q.id}: la clave es la alternativa más larga.`);
  }
  for (const letter of ["A", "B", "C", "D"]) {
    if (!q.why[letter]) fail(`${q.id}: falta explicación para ${letter}.`);
  }
}

const articleBodies = [...html.matchAll(/<article class="reportage">(.*?)<\/article>/gs)].map(match =>
  match[1]
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
);
if (articleBodies.length !== 2) fail(`Se esperaban 2 reportajes y hay ${articleBodies.length}.`);
articleBodies.forEach((text, index) => {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 500 || words > 900) fail(`Texto ${index + 1}: ${words} palabras; debe tener entre 500 y 900.`);
  console.log(`Texto ${index + 1}: ${words} palabras.`);
});

for (const required of [
  "Instrucciones de la clase",
  "Video explicativo",
  "Actividad exclusiva de conceptos",
  "Práctica SIMCE",
  "Cierre a mano: escalera de metacognición",
  'SESSION_ID="sesion-u3-3"',
  "saveDraft",
  "metacognicion_manuscrita",
  "MATCHING_ORDERS",
  "WORD_PLACEMENTS",
  "checkWords",
  "conceptCompletion",
  "metacognitionComplete"
]) {
  if (!html.includes(required)) fail(`Falta elemento obligatorio: ${required}`);
}

const metaInputs = (html.match(/<textarea data-meta=/g) || []).length;
if (metaInputs !== 5) fail(`Se esperaban 5 respuestas metacognitivas y hay ${metaInputs}.`);
if (html.includes('id="handwrittenDone"')) fail("La metacognición todavía depende de una casilla de confirmación.");
if (html.includes('type="checkbox" data-word')) fail("La sopa todavía permite autodeclarar palabras con casillas.");

if (!process.exitCode) {
  console.log(`OK: 2 textos, 10 preguntas, conceptos verificables, 5 respuestas metacognitivas, clave ${key}, distribución ${JSON.stringify(counts)}, habilidades ${JSON.stringify(skillCounts)}.`);
}
