require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
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
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
  });
}
const db = admin.database();
const sessions = {
  '3A-TP': ['pedro-paramo-nm3-regular-2026','pedro-paramo-nm3-dil-2026','pedro-paramo-nm3-leve-2026','pedro-paramo-nm3-darwin-torres-pie-2026','pedro-paramo-nm3-mahikol-quinteros-pie-2026','pedro-paramo-nm3-benjamin-verdugo-pie-2026'],
  '3B-TP': ['pedro-paramo-nm3-regular-2026','pedro-paramo-nm3-dil-2026','pedro-paramo-nm3-leve-2026','pedro-paramo-nm3-vision-2026','pedro-paramo-nm3-antonio-caceres-pie-2026','pedro-paramo-nm3-nicolas-gonzalez-pie-2026','pedro-paramo-nm3-joaquin-rojas-pie-2026']
};
(async () => {
  const [studentsSnap, responsesSnap, resultsSnap] = await Promise.all([
    db.ref('plataforma_estudiantes/estudiantes').once('value'),
    db.ref('plataforma_lecturas/respuestas').once('value'),
    db.ref('plataforma_lecturas/resultados').once('value')
  ]);
  const students = studentsSnap.val() || {};
  const responses = responsesSnap.val() || {};
  const results = resultsSnap.val() || {};
  for (const [course, sessionIds] of Object.entries(sessions)) {
    const rows = [];
    for (const [uid, student] of Object.entries(students)) {
      if (String(student.curso || '').trim().toUpperCase() !== course) continue;
      for (const sid of sessionIds) {
        const response = (((responses[sid] || {})[uid]) || null);
        const result = (((results[sid] || {})[uid]) || null);
        if (!response && !result) continue;
        const correctionAt = Number((result && result.manual_corregido_at) || (result && result.reopened_at) || 0);
        const touchedAt = Math.max(Number((response && response.submitted_at) || 0), Number((response && response.last_save) || 0), Number((result && result.submitted_at) || 0));
        if (touchedAt > correctionAt) {
          rows.push({
            nombre: student.nombre || '',
            rut: student.rut || '',
            sid,
            correctionAt,
            touchedAt,
            answered: result && result.answered_count,
            manualPendientes: result && result.manual_pendientes,
            submitted: !!(response && response.submitted_at)
          });
        }
      }
    }
    rows.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    console.log('COURSE', course, 'COUNT', rows.length);
    console.log(JSON.stringify(rows, null, 2));
  }
})();
