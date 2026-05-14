// _tmp_fetch_desarrollo.js — saca los items desarrollo de la sesión + las respuestas de los 6 alumnos
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');

function normalizePrivateKey(raw) {
  let k = (raw || '').trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  if (k.includes('\\n')) k = k.replace(/\\n/g, '\n');
  const m = k.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (m) { const lines = m[1].match(/.{1,64}/g) || []; k = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n'; }
  return k;
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
});

const db = admin.database();
const SID = 'pedro-paramo-nm3-regular-2026';

const RUTS = [
  { nombre: 'GONZALEZ SAAVEDRA JOAQUIN ANDRES',    rut: '23036159-2' },
  { nombre: 'RAMIREZ TORRES CRISTOBAL IGNACIO',    rut: '22821466-3' },
  { nombre: 'POBLETE MUÑOZ JOAQUIN ALEXIS',        rut: '23178677-5' },
  { nombre: 'RAMIREZ ARANCIBIA BENJAMIN IGNACIO',  rut: '23126780-8' },
  { nombre: 'RAMOS VARGAS CRISTOBAL GABRIEL',      rut: '23177793-8' },
  { nombre: 'CABRERA SAN MARTIN JOSE VICENTE',     rut: '23233347-2' }
];

function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + '@est.profefranciscopancho.com'; }

(async () => {
  try {
    const sessSnap = await db.ref(`plataforma_lecturas/sesiones/${SID}`).once('value');
    const sess = sessSnap.val();
    if (!sess) throw new Error('Sesión no encontrada');
    // contenido = { items: [...], materiales: [...], randomizacion:{...} }
    const cont = sess.contenido || {};
    const itemsRaw = cont.items;
    const items = Array.isArray(itemsRaw) ? itemsRaw : Object.values(itemsRaw || {});
    console.log('Total items:', items.length, '| Tipos:', Array.from(new Set(items.map(i => i.tipo || i.type))).join(','));

    const desarrollos = items.filter(it => {
      const t = (it.tipo || it.type || '').toLowerCase();
      return t === 'desarrollo' || t === 'abierta' || t === 'respuesta_abierta';
    });

    console.log('=== ITEMS DESARROLLO ('+desarrollos.length+') ===');
    desarrollos.forEach((d, i) => {
      console.log('\n--- Item #'+(i+1)+' id='+d.id+' ---');
      console.log('Enunciado:', (d.enunciado || d.pregunta || '').substring(0, 500));
      console.log('Puntaje:', d.puntaje || d.puntos || d.points || '?');
      console.log('Solucionario:', JSON.stringify(d.solucionario || d.respuesta_esperada || d.rubrica || '(sin solucionario)').substring(0, 500));
      if (d.rubrica) console.log('Rúbrica:', JSON.stringify(d.rubrica).substring(0, 500));
    });

    console.log('\n\n=== RESPUESTAS DE ESTUDIANTES ===');
    const report = [];
    for (const s of RUTS) {
      const email = rutToEmail(s.rut);
      let uid;
      try { uid = (await admin.auth().getUserByEmail(email)).uid; } catch (e) { console.log('\n['+s.nombre+'] NO ENCONTRADO'); continue; }
      const resp = (await db.ref(`plataforma_lecturas/respuestas/${SID}/${uid}`).once('value')).val() || {};
      const answers = resp.answers || {};
      const row = { nombre: s.nombre, rut: s.rut, uid, respuestas: {} };
      console.log('\n\n========== '+s.nombre+' ('+s.rut+') ==========');
      desarrollos.forEach((d) => {
        const a = answers[d.id];
        const txt = (typeof a === 'string') ? a : (a && a.text ? a.text : '');
        row.respuestas[d.id] = txt;
        console.log('\n[Item '+d.id+'] ('+(txt||'').length+' chars):');
        console.log(txt || '(VACÍA)');
      });
      report.push(row);
    }

    fs.writeFileSync('_tmp_desarrollo_report.json', JSON.stringify({ items: desarrollos, students: report }, null, 2), 'utf8');
    console.log('\n\n✅ Reporte guardado en _tmp_desarrollo_report.json');
    process.exit(0);
  } catch (e) { console.error('ERROR:', e); process.exit(1); }
})();
