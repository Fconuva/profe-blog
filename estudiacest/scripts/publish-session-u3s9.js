// Publica en Firebase la sesión real de la Clase 9 (Corrección del ensayo),
// para que deje de depender solo del STATIC_SESSION_FALLBACKS del código y
// aparezca activa en el panel del estudiante y del admin el 9 de septiembre.
//
// Corre esto con credenciales reales del proyecto Firebase `estudiacest`
// (no las de `profe-blog`):
//
//   node scripts/publish-session-u3s9.js
//
// Es un solo write, idempotente: se puede correr más de una vez sin duplicar
// nada, porque siempre fija el mismo nodo `sesion-u3-9`.

const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';
const SESSION_ID = 'sesion-u3-9';

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
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

const SESSION_DATA = {
  titulo: 'Unidad 3 · Clase 9 — Corrección del ensayo',
  descripcion: 'Revisión pregunta por pregunta de lo que salió peor en el curso, con la respuesta correcta y su explicación.',
  orden: 309,
  programa: 'simce',
  activa: true,
  resultados_visibles: true,
  retroalimentacion_visible: true,
  panel_unidad: 'u3',
  panel_seccion: 'plan',
  panel_orden: 9,
  fecha_aplicacion: '2026-09-09',
  link_guia: '/estudiantes/guia-u3-s9-correccion-ensayo.html',
  prefer_guia: true,
  asignados: ['2A-HC', '2B-HC']
};

(async () => {
  ensureFirebase();
  const db = admin.database();
  const ref = db.ref(`${BASE}/sesiones/${SESSION_ID}`);
  const before = (await ref.once('value')).val();
  await ref.update(SESSION_DATA);
  const after = (await ref.once('value')).val();
  console.log(before ? 'Sesión existente actualizada.' : 'Sesión nueva creada.');
  console.log(JSON.stringify(after, null, 2));
  process.exit(0);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
