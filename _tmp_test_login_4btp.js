// Simula login de cada estudiante de 4°B TP via /api/lecturas-login en produccion
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

const PROD = 'https://www.profefranciscopancho.com';
function cleanRut(r) { return (r||'').replace(/[.\s]/g,'').toUpperCase(); }
function defaultPassword(r) { const d = cleanRut(r).replace(/[^0-9]/g,''); return d.substring(0,6).padEnd(6,'0'); }

// Acepta variantes: "4°B TP", "4B TP", "4° B T.P.", "IV°B TP", etc.
function isTargetCourse(curso) {
  if (!curso) return false;
  const c = String(curso).toUpperCase().replace(/\s+/g,' ');
  // 4°B TP / 4B TP / IV°B TP
  if (/(^|[^0-9])(4|IV)\s*°?\s*B\b/.test(c) && /T\.?\s*P\.?/.test(c)) return true;
  return false;
}

(async () => {
  const snap = await admin.database().ref('plataforma_estudiantes/estudiantes').once('value');
  const all = snap.val() || {};
  const list = Object.entries(all)
    .map(([uid, s]) => ({ uid, ...s }))
    .filter(s => isTargetCourse(s.curso))
    .sort((a,b) => (a.nombre||'').localeCompare(b.nombre||'','es'));

  console.log(`\nEstudiantes 4°B TP detectados: ${list.length}\n`);
  if (list.length === 0) {
    // Diagnostico: imprimir cursos unicos para que el profe vea como estan registrados
    const cursos = [...new Set(Object.values(all).map(s => s.curso).filter(Boolean))].sort();
    console.log('Cursos disponibles en RTDB:');
    cursos.forEach(c => console.log('  -', c));
    process.exit(0);
  }

  let ok = 0, fail = [];
  for (const s of list) {
    const rut = s.rut;
    const pass = defaultPassword(rut);
    try {
      const r = await fetch(`${PROD}/api/lecturas-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, password: pass })
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j && j.token) {
        ok++;
        console.log(`OK  ${s.nombre}  (${rut})`);
      } else {
        fail.push({ nombre: s.nombre, rut, status: r.status, err: j && j.error || '' });
        console.log(`FAIL ${s.nombre}  (${rut})  status=${r.status}  ${j && j.error || ''}`);
      }
    } catch (e) {
      fail.push({ nombre: s.nombre, rut, err: e.message });
      console.log(`ERR ${s.nombre}  (${rut})  ${e.message}`);
    }
  }
  console.log(`\n--- RESUMEN ---`);
  console.log(`Total:   ${list.length}`);
  console.log(`OK:      ${ok}`);
  console.log(`FALLOS:  ${fail.length}`);
  if (fail.length) {
    console.log(`\nFallos detallados:`);
    fail.forEach(f => console.log(`  - ${f.nombre} | ${f.rut} | status=${f.status||''} ${f.err}`));
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
