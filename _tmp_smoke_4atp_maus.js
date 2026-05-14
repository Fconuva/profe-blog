// Smoke-test del flujo Maus NM4 4A-TP
// Por cada alumno del 4A-TP:
//   1. Mint custom token (Admin SDK) → exchange por ID token (Identity Toolkit)
//   2. Lee /sesiones/<sesId> via REST
//   3. Lee /asignaciones/<uid>/<sesId>
//   4. Escribe un registro de prueba en /respuestas/<sesId>/<uid>/_smoke_test
//   5. Lo lee y luego lo borra
// Reporta cualquier fallo. No deja basura.

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const FB_API_KEY = 'AIzaSyCzN4xNEE_hKshXbsVqLhWSnzet1pHwRh8';
const DB_URL = 'https://profe-blog-default-rtdb.firebaseio.com';

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

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: DB_URL
  });
}

const auth = admin.auth();
const db = admin.database();

function cleanRut(r){ return String(r||'').replace(/[.\s-]/g,'').toUpperCase(); }

const SESSION_REGULAR = 'maus-nm4-2026';
const SESSION_DIL = 'maus-nm4-dil-2026';
const SESSION_INTERMEDIA = 'maus-nm4-intermedia-2026';

function readRutSet(rel) {
  const p = path.join(__dirname, rel);
  if (!fs.existsSync(p)) return new Set();
  return new Set(fs.readFileSync(p,'utf8').split(/\r?\n/).map(cleanRut).filter(Boolean));
}

async function exchangeCustomToken(customToken) {
  const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + FB_API_KEY;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });
  const j = await r.json();
  if (!r.ok) throw new Error('exchange ' + r.status + ': ' + JSON.stringify(j));
  return j.idToken;
}

async function rtdbGet(p, idToken) {
  const r = await fetch(DB_URL + '/' + p + '.json?auth=' + idToken);
  if (!r.ok) throw new Error('GET '+p+' '+r.status+': '+await r.text());
  return r.json();
}
async function rtdbPut(p, value, idToken) {
  const r = await fetch(DB_URL + '/' + p + '.json?auth=' + idToken, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  });
  if (!r.ok) throw new Error('PUT '+p+' '+r.status+': '+await r.text());
  return r.json();
}
async function rtdbDel(p, idToken) {
  const r = await fetch(DB_URL + '/' + p + '.json?auth=' + idToken, { method: 'DELETE' });
  if (!r.ok) throw new Error('DEL '+p+' '+r.status+': '+await r.text());
  return true;
}

(async () => {
  const dilSet = readRutSet('lecturas/asignaciones/maus_nm4_4A_tp_dil_ruts.txt');
  const intSet = readRutSet('lecturas/asignaciones/maus_nm4_4A_tp_intermedia_ruts.txt');

  const studentsSnap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
  const all = studentsSnap.val() || {};
  const fourA = Object.entries(all)
    .filter(([,s]) => s && (s.curso || '').trim().toUpperCase() === '4A-TP')
    .map(([uid,s]) => ({ uid, nombre: s.nombre || uid, rut: cleanRut(s.rut) }));

  console.log('Smoke test sobre ' + fourA.length + ' alumnos del 4A-TP\n');

  const reporte = [];
  let okCount = 0, failCount = 0;

  for (const st of fourA) {
    const sesId = dilSet.has(st.rut) ? SESSION_DIL : (intSet.has(st.rut) ? SESSION_INTERMEDIA : SESSION_REGULAR);
    const row = { nombre: st.nombre, sesion: sesId, login: '?', leerSesion: '?', leerAsignacion: '?', escribir: '?', leerEscritura: '?', limpiar: '?' };
    try {
      const ct = await auth.createCustomToken(st.uid);
      const idToken = await exchangeCustomToken(ct);
      row.login = 'ok';

      const ses = await rtdbGet('plataforma_lecturas/sesiones/' + sesId, idToken);
      row.leerSesion = (ses && ses.activa === true) ? 'ok' : 'INACTIVA';

      const asig = await rtdbGet('plataforma_lecturas/asignaciones/' + st.uid + '/' + sesId, idToken);
      row.leerAsignacion = asig === true ? 'ok' : 'NO ASIGNADO';

      const stamp = Date.now();
      const testPath = 'plataforma_lecturas/respuestas/' + sesId + '/' + st.uid + '/_smoke_test';
      await rtdbPut(testPath, { at: stamp, by: 'smoke-4atp' }, idToken);
      row.escribir = 'ok';

      const back = await rtdbGet(testPath, idToken);
      row.leerEscritura = (back && back.at === stamp) ? 'ok' : 'NO COINCIDE';

      await rtdbDel(testPath, idToken);
      row.limpiar = 'ok';

      okCount++;
    } catch (e) {
      const msg = e.message || String(e);
      // Etiquetar el primer paso que falló
      if (row.login === '?') row.login = 'ERR: '+msg;
      else if (row.leerSesion === '?') row.leerSesion = 'ERR: '+msg;
      else if (row.leerAsignacion === '?') row.leerAsignacion = 'ERR: '+msg;
      else if (row.escribir === '?') row.escribir = 'ERR: '+msg;
      else if (row.leerEscritura === '?') row.leerEscritura = 'ERR: '+msg;
      else if (row.limpiar === '?') row.limpiar = 'ERR: '+msg;
      failCount++;
    }
    reporte.push(row);
  }

  console.log('=== RESULTADO SMOKE TEST 4A-TP ===');
  console.table(reporte);
  console.log('\nOK: ' + okCount + ' | FALLOS: ' + failCount);
  if (failCount === 0) console.log('\n✅ Flujo completo verificado: ingreso, lectura de sesión, lectura de asignación, escritura y guardado de respuestas funcionan para los ' + okCount + ' alumnos.');
  else console.log('\n⚠️  Hay ' + failCount + ' fallos — revisar la tabla.');

  process.exit(0);
})().catch(e => { console.error('Error fatal:', e); process.exit(1); });
