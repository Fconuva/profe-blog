// Forzar cierre: para cada estudiante 3B-TP con respuestas pero sin envio (o sin puntaje),
// recalcula el puntaje automatico desde el contenido y lo guarda en resultados.
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

function normalizeName(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
}

function getAnswerValue(value) {
  if (value && typeof value === 'object' && value.value !== undefined) return value.value;
  return value;
}

function evaluar(item, raw) {
  const tipo = String(item.tipo || '').toLowerCase();
  const answer = getAnswerValue(raw);
  if (answer === undefined || answer === null || answer === '') return false;
  if (tipo === 'seleccion_multiple' || tipo === 'multiple_choice' || tipo === 'verdadero_falso' || tipo === 'true_false') {
    return String(answer) === String(item.correcta || '');
  }
  if (tipo === 'pareados' || tipo === 'matching') {
    const exp = item.correcta;
    if (!exp || typeof exp !== 'object') return false;
    const a = answer && typeof answer === 'object' ? answer : {};
    return Object.keys(exp).every(k => String(exp[k]) === String(a[k] || ''));
  }
  if (tipo === 'ordenamiento' || tipo === 'ordering' || tipo === 'puzzle') {
    const exp = item.correcta;
    if (!Array.isArray(exp)) return false;
    const a = answer && typeof answer === 'object' ? answer : {};
    return exp.every((id, i) => String(a[id] || '') === String(i + 1));
  }
  return false;
}

function flattenItems(content) {
  const out = [];
  function walk(arr) {
    if (!Array.isArray(arr)) return;
    arr.forEach(o => {
      if (o && o.id && o.tipo) out.push(o);
      if (o && Array.isArray(o.items)) walk(o.items);
      if (o && Array.isArray(o.preguntas)) walk(o.preguntas);
    });
  }
  walk(content.items || []); walk(content.preguntas || []); walk(content.secciones || []);
  const seen = new Set();
  return out.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
}

const EXCLUDE_RUTS = new Set(['23200397-9']);
const SESSION_IDS = [
  'pedro-paramo-nm3-regular-2026',
  'pedro-paramo-nm3-dil-2026',
  'pedro-paramo-nm3-leve-2026',
  'pedro-paramo-nm3-vision-2026',
  'pedro-paramo-nm3-antonio-caceres-pie-2026',
  'pedro-paramo-nm3-nicolas-gonzalez-pie-2026',
  'pedro-paramo-nm3-joaquin-rojas-pie-2026',
];

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
const ROOT = __dirname;
const ROSTER_PATH = path.join(ROOT, 'carga_3B_TP.txt');

(async () => {
  try {
    const roster = fs.readFileSync(ROSTER_PATH, 'utf8').split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => {
      const [nombre, rut, curso] = l.split(';');
      return { nombre, rut, curso };
    });

    const studentsSnap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
    const students = studentsSnap.val() || {};
    const byName = new Map();
    for (const [uid, st] of Object.entries(students)) byName.set(normalizeName(st.nombre), { uid, ...st });

    const sessionsSnap = await Promise.all(SESSION_IDS.map(sid => db.ref('plataforma_lecturas/sesiones/' + sid).once('value')));
    const respSnaps = await Promise.all(SESSION_IDS.map(sid => db.ref('plataforma_lecturas/respuestas/' + sid).once('value')));
    const resSnaps = await Promise.all(SESSION_IDS.map(sid => db.ref('plataforma_lecturas/resultados/' + sid).once('value')));

    const sessionData = SESSION_IDS.map((sid, i) => {
      const session = sessionsSnap[i].val() || {};
      const items = flattenItems(session.contenido || {});
      const autoItems = items.filter(it => {
        const t = String(it.tipo || '').toLowerCase();
        return ['seleccion_multiple','multiple_choice','verdadero_falso','true_false','pareados','matching','ordenamiento','ordering','puzzle'].includes(t);
      });
      const manualItems = items.filter(it => {
        const t = String(it.tipo || '').toLowerCase();
        return ['desarrollo','abierta','respuesta_abierta','respuesta_corta','corta'].includes(t);
      });
      const autoTotal = autoItems.reduce((acc, it) => acc + (Number(it.puntaje || it.points || 1) || 1), 0);
      const total = autoTotal + manualItems.reduce((acc, it) => acc + (Number(it.puntaje || it.points || 0) || 0), 0);
      return { sid, items, autoItems, manualItems, autoTotal, total };
    });

    const now = Date.now();
    const updates = [];
    const reportRows = [];

    for (const entry of roster) {
      if (EXCLUDE_RUTS.has(entry.rut)) continue;
      const st = byName.get(normalizeName(entry.nombre));
      if (!st) { reportRows.push({ nombre: entry.nombre, status: 'sin-cuenta' }); continue; }
      const uid = st.uid;

      // Elegir mejor sesion por respuestas (preferir la que tenga mas answers; desempate por puntaje actual)
      let best = null;
      for (let i = 0; i < SESSION_IDS.length; i++) {
        const sid = SESSION_IDS[i];
        const respAll = respSnaps[i].val() || {};
        const resAll = resSnaps[i].val() || {};
        const resp = respAll[uid] || {};
        const result = resAll[uid] || {};
        const answers = resp.answers || {};
        const answeredCount = Object.keys(answers).length;
        if (!answeredCount && !result.submitted_at) continue;
        const currentScore = Number(result.puntaje || 0);
        const rank = answeredCount * 1000 + currentScore;
        if (!best || rank > best.rank) {
          best = { idx: i, sid, sd: sessionData[i], answers, result, answeredCount, currentScore, rank };
        }
      }

      if (!best) { reportRows.push({ nombre: entry.nombre, status: 'sin-respuestas' }); continue; }

      // Recalcular puntaje automatico
      let auto = 0;
      const detalle = {};
      best.sd.autoItems.forEach(it => {
        const ans = best.answers[it.id];
        const ok = evaluar(it, ans);
        const pts = Number(it.puntaje || it.points || 1) || 1;
        const got = ok ? pts : 0;
        auto += got;
        detalle[it.id] = { correcta: ok, puntos: got };
      });

      const manualPendientes = best.sd.manualItems.filter(it => {
        const ans = best.answers[it.id];
        const text = ans && typeof ans === 'object' ? (ans.text || ans.value || '') : (ans || '');
        return String(text || '').trim().length > 0;
      }).length;

      const prevAuto = Number(best.result.puntaje || 0);
      const wasSubmitted = !!best.result.submitted_at;
      const needUpdate = !wasSubmitted || prevAuto !== auto;

      reportRows.push({
        nombre: entry.nombre,
        sid: best.sid,
        answered: best.answeredCount,
        auto_prev: prevAuto,
        auto_new: auto,
        auto_total: best.sd.autoTotal,
        was_submitted: wasSubmitted,
        manual_resp: manualPendientes,
        action: needUpdate ? (wasSubmitted ? 'recalculado' : 'cerrado') : 'ok'
      });

      if (needUpdate) {
        const payload = {
          puntaje: auto,
          total: best.sd.autoTotal,
          puntaje_total_prueba: best.sd.total,
          answered_count: best.answeredCount,
          manual_pendientes: best.sd.manualItems.length,
          submitted_at: best.result.submitted_at || now,
          force_closed_at: now,
          force_closed_by: 'Francisco Nunez',
          detalle_auto: detalle,
        };
        updates.push(db.ref('plataforma_lecturas/resultados/' + best.sid + '/' + uid).update(payload));
      }
    }

    await Promise.all(updates);

    fs.writeFileSync(path.join(ROOT, '_tmp_force_close_3btp.json'), JSON.stringify(reportRows, null, 2), 'utf8');

    const stats = reportRows.reduce((acc, r) => {
      acc[r.action || r.status] = (acc[r.action || r.status] || 0) + 1;
      return acc;
    }, {});
    console.log('Resumen acciones:', stats);
    console.log('Updates aplicados:', updates.length);
  } catch (err) {
    console.error('Error fatal:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
