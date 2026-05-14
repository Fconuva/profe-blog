require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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
function normalizeName(v) {
  return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
const db = admin.database();

const TARGETS = [
  'ALBORNOZ GAJARDO PABLO ANTONIO',
  'ARREDONDO VALDES MATIAS JESUS',
  'ESPINOSA MIÑO MAGDIEL DE CIRENE',
  'OVIEDO RODRIGUEZ FRANCISCO GABRIEL',
  'ROJAS ABDALA SAID KAMIL MAURICIO',
  'SAAVEDRA TORRES RENATO ALONSO'
].map(normalizeName);

const SIDS = [
  'pedro-paramo-nm3-regular-2026',
  'pedro-paramo-nm3-dil-2026',
  'pedro-paramo-nm3-leve-2026',
  'pedro-paramo-nm3-vision-2026',
  'pedro-paramo-nm3-antonio-caceres-pie-2026',
  'pedro-paramo-nm3-nicolas-gonzalez-pie-2026',
  'pedro-paramo-nm3-joaquin-rojas-pie-2026'
];

function calcAuto(item, value) {
  if (!item || value == null) return 0;
  const tipo = item.tipo;
  const max = Number(item.puntaje || 1);
  if (tipo === 'seleccion_multiple') {
    return value === item.correcta ? max : 0;
  }
  if (tipo === 'ordenamiento') {
    if (typeof value !== 'object') return 0;
    const correct = item.correcta || {};
    const keys = Object.keys(correct);
    let ok = 0;
    for (const k of keys) if (String(value[k]) === String(correct[k])) ok++;
    return keys.length && ok === keys.length ? max : 0;
  }
  if (tipo === 'pareados') {
    if (typeof value !== 'object') return 0;
    const correct = item.correcta || {};
    const keys = Object.keys(correct);
    let ok = 0;
    for (const k of keys) if (String(value[k]) === String(correct[k])) ok++;
    return keys.length && ok === keys.length ? max : 0;
  }
  if (tipo === 'respuesta_corta') {
    const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').trim();
    const expected = item.correcta;
    if (Array.isArray(expected)) return expected.some(e => norm(e) === norm(value)) ? max : 0;
    return norm(expected) === norm(value) ? max : 0;
  }
  return 0;
}

(async () => {
  try {
    const estSnap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
    const estudiantes = estSnap.val() || {};
    const uid2est = {};
    for (const [uid, est] of Object.entries(estudiantes)) {
      uid2est[uid] = est;
    }
    const name2uid = {};
    for (const [uid, est] of Object.entries(estudiantes)) {
      const n = normalizeName(est.nombre);
      name2uid[n] = uid;
    }

    for (const target of TARGETS) {
      const uid = name2uid[target];
      console.log('\n========== ' + target + ' ==========');
      if (!uid) { console.log('  >> NO encontrado en plataforma_estudiantes'); continue; }
      const est = uid2est[uid];
      console.log('  uid:', uid, '| rut:', est.rut, '| curso:', est.curso);

      let foundAny = false;
      for (const sid of SIDS) {
        const respSnap = await db.ref('plataforma_lecturas/respuestas/' + sid + '/' + uid).once('value');
        const respData = respSnap.val();
        if (!respData) continue;
        foundAny = true;
        console.log('  -- sesion:', sid);
        const answers = respData.answers || respData || {};
        const itemsSnap = await db.ref('plataforma_lecturas/sesiones/' + sid + '/contenido').once('value');
        const items = itemsSnap.val() || [];
        const itemsArr = Array.isArray(items) ? items : Object.values(items);
        const preguntas = itemsArr.filter(it => it && it.tipo && it.tipo !== 'texto' && it.tipo !== 'instruccion');
        const totalPreg = preguntas.length;
        const respondidas = preguntas.filter(it => answers[it.id] != null && answers[it.id] !== '').length;
        let autoPts = 0, autoMax = 0;
        const faltantes = [];
        for (const it of preguntas) {
          const v = answers[it.id];
          if (it.tipo === 'desarrollo') continue;
          autoMax += Number(it.puntaje || 1);
          if (v != null && v !== '') autoPts += calcAuto(it, v);
          else faltantes.push(it.id);
        }
        console.log('    respondidas: ' + respondidas + '/' + totalPreg + ' preguntas');
        console.log('    auto: ' + autoPts + '/' + autoMax);
        console.log('    faltantes auto:', faltantes.join(', ') || '(ninguna)');
        for (const itid of ['pedro_11', 'pedro_17', 'pedro_25']) {
          const v = answers[itid];
          const t = (typeof v === 'string') ? v.trim() : (v == null ? '' : JSON.stringify(v));
          console.log('    ' + itid + ' [' + (t.length || 0) + ' ch]:', t ? t.slice(0, 250) : '(vacio)');
        }
        const resSnap = await db.ref('plataforma_lecturas/resultados/' + sid + '/' + uid).once('value');
        const res = resSnap.val();
        if (res) {
          console.log('    resultados.submitted_at:', res.submitted_at, '| puntaje:', res.puntaje, '| nota_final:', res.nota_final);
        } else {
          console.log('    (sin nodo resultados)');
        }
      }
      if (!foundAny) console.log('  >> sin respuestas en ninguna sesion');
    }
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    process.exit(0);
  }
})();
