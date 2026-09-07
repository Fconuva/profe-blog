// SOLO LECTURA: revisión de integridad de la Clase 10 (sesion-u3-10) para Francisco.
// Cruza tres señales por estudiante: tiempo real desde que abrió la clase hasta que
// la entregó (startedAt/elapsedMs, respaldado por work-telemetry.js), uso de
// copiar/pegar (telemetria_clases), y similitud de texto entre estudiantes del
// mismo curso en los dos campos de producción libre (desarrollo, noticia), medida
// por solapamiento de 8-gramas de palabras — el mismo método ya usado para
// detectar plagio cruzado en portafolios.
//
// No decide nada por sí solo: entrega una lista "por revisar", igual que un barrido.
// Corre con credenciales reales del proyecto Firebase `estudiacest` (no `profe-blog`):
//
//   node scripts/audit-simce-u3s10-integridad.js [--session sesion-u3-10] [--min-similitud 0.35] [--min-segundos 180]

const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) { args[key] = true; continue; }
    args[key] = next; i += 1;
  }
  return args;
}

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  return key;
}

function ensureFirebase() {
  if (admin.apps.length) return admin.app();
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) throw new Error('FIREBASE_PRIVATE_KEY no configurada (revisa .env.local del proyecto estudiacest).');
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
  });
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function eightGrams(text) {
  const words = normalizeText(text).split(' ').filter(Boolean);
  if (words.length < 8) return new Set(words.length ? [words.join(' ')] : []);
  const grams = new Set();
  for (let i = 0; i <= words.length - 8; i += 1) grams.add(words.slice(i, i + 8).join(' '));
  return grams;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const gram of a) if (b.has(gram)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union ? intersection / union : 0;
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  const sessionId = args.session || 'sesion-u3-10';
  const minSimilitud = Number(args['min-similitud'] || 0.35);
  const minSegundos = Number(args['min-segundos'] || 180);

  ensureFirebase();
  const db = admin.database();

  const [resultadosSnap, telemetriaSnap] = await Promise.all([
    db.ref(`${BASE}/resultados/${sessionId}`).once('value'),
    db.ref(`${BASE}/telemetria_clases/${sessionId}`).once('value')
  ]);
  const resultados = resultadosSnap.val() || {};
  const telemetria = telemetriaSnap.val() || {};

  const students = Object.entries(resultados).map(([uid, r]) => ({
    uid,
    nombre: r.nombre || '(sin nombre)',
    curso: r.curso || '(sin curso)',
    porcentaje: Number(r.porcentaje || 0),
    elapsedMs: Number(r.elapsedMs || 0),
    desarrollo: r.desarrollo || '',
    noticia: r.noticia || '',
    tel: telemetria[uid] || null
  }));

  console.log(`\n=== Integridad ${sessionId}: ${students.length} entregas ===\n`);

  console.log('--- Tiempo vs puntaje (posible respuesta demasiado rápida) ---');
  const rapidas = students
    .filter(s => s.elapsedMs > 0 && s.elapsedMs < minSegundos * 1000 && s.porcentaje >= 80)
    .sort((a, b) => a.elapsedMs - b.elapsedMs);
  if (!rapidas.length) console.log(`Ninguna entrega bajo ${minSegundos}s con ${'>='}80% de logro.`);
  rapidas.forEach(s => {
    console.log(`  ${s.nombre} (${s.curso}): ${Math.round(s.elapsedMs / 1000)}s, ${s.porcentaje}% de logro.`);
  });

  console.log('\n--- Uso de copiar/pegar detectado por telemetría ---');
  const eventCount = (s, name) => Number((s.tel && s.tel.events && s.tel.events[name] && s.tel.events[name].count) || 0);
  const conCopiaPega = students.filter(s => eventCount(s, 'copy') > 0 || eventCount(s, 'paste') > 0);
  if (!conCopiaPega.length) console.log('Sin eventos de copiar/pegar registrados en esta sesión.');
  conCopiaPega.forEach(s => {
    console.log(`  ${s.nombre} (${s.curso}): copy=${eventCount(s, 'copy')}, paste=${eventCount(s, 'paste')}.`);
  });

  console.log(`\n--- Similitud entre estudiantes del mismo curso (umbral ${minSimilitud}) ---`);
  const porCampo = ['desarrollo', 'noticia'];
  let encontrados = 0;
  for (const campo of porCampo) {
    const porCurso = {};
    students.forEach(s => {
      if (!s[campo] || normalizeText(s[campo]).split(' ').filter(Boolean).length < 15) return;
      (porCurso[s.curso] = porCurso[s.curso] || []).push({ ...s, grams: eightGrams(s[campo]) });
    });
    for (const [curso, list] of Object.entries(porCurso)) {
      for (let i = 0; i < list.length; i += 1) {
        for (let j = i + 1; j < list.length; j += 1) {
          const sim = jaccard(list[i].grams, list[j].grams);
          if (sim >= minSimilitud) {
            encontrados += 1;
            console.log(`  [${campo}] ${curso}: ${list[i].nombre} <-> ${list[j].nombre} · similitud ${(sim * 100).toFixed(0)}%`);
          }
        }
      }
    }
  }
  if (!encontrados) console.log('Sin pares por sobre el umbral.');

  console.log('\nEsto es un barrido, no un veredicto: revisar cada caso abriendo los dos textos antes de actuar.\n');
  process.exit(0);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
