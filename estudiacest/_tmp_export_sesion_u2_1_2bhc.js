const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
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
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}
(async () => {
  const db = admin.database();
  const [sesSnap, resSnap, respSnap, stuSnap] = await Promise.all([
    db.ref('plataforma_estudiantes/sesiones/sesion-u2-1').once('value'),
    db.ref('plataforma_estudiantes/resultados/sesion-u2-1').once('value'),
    db.ref('plataforma_estudiantes/respuestas/sesion-u2-1').once('value'),
    db.ref('plataforma_estudiantes/estudiantes').once('value')
  ]);
  const ses = sesSnap.val() || {};
  const resultados = resSnap.val() || {};
  const respuestas = respSnap.val() || {};
  const estudiantes = stuSnap.val() || {};
  const items = Object.entries(resultados)
    .map(([uid, result]) => {
      const est = estudiantes[uid] || {};
      const resp = respuestas[uid] || {};
      return {
        uid,
        nombre: est.nombre || result.nombre || '',
        curso: est.curso || result.curso || '',
        porcentaje: result.porcentaje || 0,
        nota: result.nota || null,
        submitted_at: result.submitted_at || null,
        answers: resp.answers || result.respuestas || {},
        notes: resp.notes || result.notas || {},
        detalle: result.detalle || []
      };
    })
    .filter(item => item.curso === '2B-HC')
    .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

  const out = {
    session: {
      id: 'sesion-u2-1',
      titulo: ses.titulo || '',
      descripcion: ses.descripcion || '',
      contenido: ses.contenido || {}
    },
    items
  };
  const exportPath = path.join(process.cwd(), '_tmp_sesion_u2_1_2bhc.json');
  fs.writeFileSync(exportPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('export=' + exportPath);
  console.log('count=' + items.length);
})();
