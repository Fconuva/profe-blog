const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

const APPLY = process.argv.includes('--apply');
const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';
const SESSION_ID = 'sesion-u3-11';
const envFileArg = process.argv.find(argument => argument.startsWith('--env-file='));
const ENV_FILE = envFileArg ? path.resolve(envFileArg.slice('--env-file='.length)) : path.join(__dirname, '..', '.env.local');

const SESSION_DATA = {
  titulo: 'Unidad 3 · Clase 11 — Del relato a la noticia',
  descripcion: 'Transformación de un relato en una noticia, conservando hechos y adecuando estructura, propósito y lenguaje.',
  orden: 311,
  programa: 'simce',
  activa: true,
  resultados_visibles: false,
  retroalimentacion_visible: false,
  notas_evaluadas: false,
  formativa: true,
  formato_panel: 'transformacion-relato-noticia',
  panel_unidad: 'u3',
  panel_seccion: 'plan',
  panel_orden: 11,
  fecha_aplicacion: '2026-09-30',
  link_guia: '/estudiantes/guia-u3-s11-evidencia-dos-textos.html',
  prefer_guia: true,
  asignados: ['2A-HC', '2B-HC']
};

function normalizePrivateKey(raw) {
  let key = String(raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

function ensureFirebase() {
  if (admin.apps.length) return admin.app();
  dotenv.config({ path: ENV_FILE, override: true });
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) throw new Error('FIREBASE_PRIVATE_KEY no configurada en el archivo de entorno indicado.');
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
  });
}

function assertSession(value) {
  if (!value || value.link_guia !== SESSION_DATA.link_guia) throw new Error('La relectura no confirmó la ruta de la Clase 11.');
  if (value.fecha_aplicacion !== SESSION_DATA.fecha_aplicacion) throw new Error('La relectura no confirmó la fecha de aplicación.');
  if (value.formativa !== true || value.notas_evaluadas !== false) throw new Error('La relectura no confirmó el carácter formativo.');
  if (JSON.stringify(value.asignados) !== JSON.stringify(SESSION_DATA.asignados)) throw new Error('La relectura no confirmó los cursos asignados.');
}

(async () => {
  ensureFirebase();
  const ref = admin.database().ref(`${BASE}/sesiones/${SESSION_ID}`);
  const before = (await ref.once('value')).val();
  console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'dry-run', sessionId: SESSION_ID, existed: !!before, desired: SESSION_DATA }, null, 2));
  if (!APPLY) {
    console.log('Simulación terminada. No se escribió ningún dato.');
    process.exit(0);
  }
  await ref.update(SESSION_DATA);
  const after = (await ref.once('value')).val();
  assertSession(after);
  console.log('Clase 11 publicada y releída correctamente en Firebase.');
  process.exit(0);
})().catch(error => { console.error('ERROR:', error.message); process.exit(1); });
