require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');

function normalizePrivateKey(raw) {
  let k = (raw || '').trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  if (k.includes('\\n')) k = k.replace(/\\n/g, '\n');
  const m = k.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (m) {
    const lines = m[1].match(/.{1,64}/g) || [];
    k = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
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
const SID = 'pedro-paramo-nm3-martin-gajardo-pie-2026';
const TARGET_RUT = '22486235-0';

(async () => {
  const studentsSnap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
  const students = studentsSnap.val() || {};
  let uid = null, info = null;
  for (const [u, st] of Object.entries(students)) {
    if (String(st.rut || '').replace(/\s/g,'') === TARGET_RUT) {
      uid = u; info = st; break;
    }
  }
  console.log('UID:', uid);
  console.log('STUDENT:', JSON.stringify(info, null, 2));
  if (!uid) process.exit(1);

  const [sessionSnap, resSnap, respSnap, manualSnap] = await Promise.all([
    db.ref(`plataforma_lecturas/sesiones/${SID}`).once('value'),
    db.ref(`plataforma_lecturas/resultados/${SID}/${uid}`).once('value'),
    db.ref(`plataforma_lecturas/respuestas/${SID}/${uid}`).once('value'),
    db.ref(`plataforma_lecturas/correcciones_manual/${SID}/${uid}`).once('value')
  ]);

  const session = sessionSnap.val() || {};
  const result = resSnap.val();
  const resp = respSnap.val();
  const manual = manualSnap.val();

  const itemsRaw = ((session.contenido || {}).items) || [];
  const items = Array.isArray(itemsRaw) ? itemsRaw : Object.values(itemsRaw || {});

  console.log('\nSession titulo:', session.titulo);
  console.log('Resultado:', JSON.stringify(result, null, 2));
  console.log('Manual correccion:', JSON.stringify(manual, null, 2));
  console.log('Total items:', items.length);

  const out = {
    uid, nombre: info.nombre, rut: info.rut, curso: info.curso,
    sid: SID, session_titulo: session.titulo,
    resultado: result, correccion_manual: manual,
    items: items.map(it => ({
      id: it.id,
      tipo: it.tipo || it.type,
      enunciado: it.enunciado || it.pregunta,
      puntaje: it.puntaje || it.puntos || it.points || 0,
      correcta: it.correcta || it.respuesta_correcta,
      opciones: it.opciones || it.options || null,
      criterios: it.criterios || null,
      habilidad: it.habilidad || it.skill || null
    })),
    respuestas: resp ? (resp.answers || resp) : null
  };
  fs.writeFileSync('_tmp_gajardo_3d.json', JSON.stringify(out, null, 2), 'utf8');
  console.log('\n>> Guardado en _tmp_gajardo_3d.json');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
