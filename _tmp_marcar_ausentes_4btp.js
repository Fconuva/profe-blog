// Marca a los 8 estudiantes ausentes de 4°B TP en MAUS con una etiqueta
// para reagendarles la prueba.
require('dotenv').config({ path: __dirname + '/.env.local' });
const admin = require('firebase-admin');

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n');
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
});

// Lista oficial de ausentes 4°B TP (escrita por el profesor).
const AUSENTES = [
  'AVILA LOYOLA CRISTIAN ALFONSO',
  'FAUNDEZ MUNOZ MAXIMILIANO GABRIEL',
  'FUENTES RIQUELME MATIAS RODRIGO',
  'GUERRERO VELIZ JONATHAN MARCELO', // (el profe escribio "VELIS", en RTDB es "VELIZ")
  'GUTIERREZ PAEZ DIEGO ESTEBAN',
  'LAGOS VELIZ MATHIAS JOHAN',
  'MUNOZ GARRIDO FELIPE MANUEL',
  'ORMENO FERNANDOY FRANCISCO ANDRES'
];

const ETIQUETA = 'AUSENTE_MAUS_4BTP_2026-04-27';

function strip(s) {
  return (s || '')
    .toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

(async () => {
  const snap = await admin.database().ref('plataforma_estudiantes/estudiantes').once('value');
  const all = snap.val() || {};
  const all4btp = Object.entries(all)
    .map(([uid, s]) => ({ uid, ...s }))
    .filter(s => {
      const c = (s.curso || '').toUpperCase();
      return /(^|[^0-9])(4|IV)\s*°?\s*B\b/.test(c) && /T\.?\s*P\.?/.test(c);
    });

  const targets = AUSENTES.map(name => {
    const norm = strip(name);
    const found = all4btp.find(s => strip(s.nombre) === norm);
    return { name, found };
  });

  const ok = [], notFound = [];
  for (const t of targets) {
    if (!t.found) { notFound.push(t.name); continue; }
    const ref = admin.database().ref(`plataforma_estudiantes/estudiantes/${t.found.uid}`);
    const cur = (t.found.etiquetas && Array.isArray(t.found.etiquetas)) ? t.found.etiquetas : [];
    const next = cur.includes(ETIQUETA) ? cur : [...cur, ETIQUETA];
    await ref.update({
      etiquetas: next,
      ausente_maus_4btp: true,
      ausente_maus_4btp_fecha: '2026-04-27',
      reagendar_maus: true
    });
    ok.push(t.found.nombre);
  }

  console.log(`\nEtiquetados (${ok.length}/${AUSENTES.length}):`);
  ok.forEach(n => console.log('  +', n));
  if (notFound.length) {
    console.log(`\nNo encontrados:`);
    notFound.forEach(n => console.log('  -', n));
    console.log(`\nNombres reales 4°B TP cercanos para revisar manualmente:`);
    notFound.forEach(n => {
      const tok = strip(n).split(' ')[0];
      const cand = all4btp.filter(s => strip(s.nombre).startsWith(tok));
      cand.forEach(s => console.log(`     ? "${s.nombre}"`));
    });
  }
  console.log(`\nEtiqueta aplicada: ${ETIQUETA}`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
