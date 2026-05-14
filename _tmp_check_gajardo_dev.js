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
const UID = 'ig9t5MSjm4SfF3ky6McemFa2qqM2';
(async () => {
  const [resSnap, respSnap, sesSnap, manSnap] = await Promise.all([
    db.ref(`plataforma_lecturas/resultados/${SID}/${UID}`).once('value'),
    db.ref(`plataforma_lecturas/respuestas/${SID}/${UID}`).once('value'),
    db.ref(`plataforma_lecturas/sesiones/${SID}`).once('value'),
    db.ref(`plataforma_lecturas/correcciones_manual/${SID}/${UID}`).once('value'),
  ]);
  const ses = sesSnap.val()||{};
  const items = ses.items || [];
  console.log('Total items en sesión PIE Gajardo:', items.length);
  const tipos = {};
  for(const it of items){ tipos[it.tipo]=(tipos[it.tipo]||0)+1; }
  console.log('Tipos:', tipos);
  const desarrollos = items.filter(it => it.tipo==='desarrollo' || it.tipo==='respuesta_corta');
  console.log('Items de desarrollo:', desarrollos.length);
  desarrollos.forEach(it => console.log(' -', it.id, '|', it.tipo, '| pts=', it.puntaje, '|', (it.enunciado||'').slice(0,80)));
  console.log('\n--- respuestas guardadas:');
  const ans = (respSnap.val()||{}).answers || {};
  for(const it of desarrollos){
    console.log(`\n[${it.id}] ${it.tipo}: ${(ans[it.id]||'(sin responder)')}`);
  }
  console.log('\n--- correccion_manual:', JSON.stringify(manSnap.val(), null, 2));
  fs.writeFileSync('_tmp_gajardo_session.json', JSON.stringify({sesion: ses, resultado: resSnap.val(), respuestas: respSnap.val(), manual: manSnap.val()}, null, 2));
  process.exit(0);
})();
