const fs = require('fs');
const os = require('os');
const path = require('path');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_paes/guia_respuestas';

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

function loadFirebase() {
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    throw new Error('Faltan credenciales Firebase en .env.local.');
  }
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
    });
  }
  return admin.database();
}

async function main() {
  const db = loadFirebase();
  const [sourceSnap, targetSnap] = await Promise.all([
    db.ref(`${BASE}/15`).once('value'),
    db.ref(`${BASE}/16`).once('value')
  ]);
  const source = sourceSnap.val() || {};
  const target = targetSnap.val() || {};
  const sourceEntries = Object.entries(source);
  const targetCount = Object.keys(target).length;

  if (targetCount > 0) {
    throw new Error(`Migración cancelada: Guía 16 ya contiene ${targetCount} registro(s).`);
  }
  if (sourceEntries.length === 0) {
    console.log('[migracion] No hay registros antiguos en Guía 15.');
    return;
  }
  const incompatible = sourceEntries.filter(([, record]) => {
    const total = Number(record && record.total);
    return total && total !== 15;
  });
  if (incompatible.length > 0) {
    throw new Error(`Migración cancelada: ${incompatible.length} registro(s) no corresponden al instrumento antiguo de 15 preguntas.`);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(os.tmpdir(), `paes-g15-discontinuos-backup-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(source, null, 2), 'utf8');

  const updates = {};
  sourceEntries.forEach(([rut, record]) => {
    updates[`${BASE}/16/${rut}`] = {
      ...record,
      guiaId: '16',
      migratedFrom: '15',
      migratedAt: admin.database.ServerValue.TIMESTAMP
    };
    updates[`${BASE}/15/${rut}`] = null;
  });
  await db.ref().update(updates);

  const [verifiedSource, verifiedTarget] = await Promise.all([
    db.ref(`${BASE}/15`).once('value'),
    db.ref(`${BASE}/16`).once('value')
  ]);
  const remaining = verifiedSource.numChildren();
  const migrated = verifiedTarget.numChildren();
  if (remaining !== 0 || migrated !== sourceEntries.length) {
    throw new Error(`Verificación fallida: origen=${remaining}, destino=${migrated}.`);
  }

  console.log(`[migracion] ${migrated} registro(s) movido(s) de Guía 15 a Guía 16.`);
  console.log(`[respaldo] ${backupPath}`);
}

main()
  .catch((error) => {
    console.error('[error]', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.all(admin.apps.map((app) => app.delete()));
  });
