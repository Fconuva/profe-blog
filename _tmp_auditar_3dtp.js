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
  return (s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function cleanRut(value) {
  return String(value || '').replace(/[.\s-]/g, '').trim().toUpperCase();
}

function getTextAnswer(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value.text === 'string') return value.text;
  return '';
}

function countAnsweredAnswers(answers) {
  const values = Object.values(answers || {});
  return values.filter(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') {
      if (typeof value.text === 'string') return value.text.trim() !== '';
      return Object.keys(value).length > 0;
    }
    return value != null;
  }).length;
}

function flattenItems(content) {
  const items = [];
  function walk(arr) {
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      if (item && item.id && item.tipo) items.push(item);
      if (item && Array.isArray(item.items)) walk(item.items);
      if (item && Array.isArray(item.preguntas)) walk(item.preguntas);
    });
  }
  walk(content.items || []);
  walk(content.preguntas || []);
  walk(content.secciones || []);
  walk(content.materiales || []);
  walk(content.actividades || []);
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function evaluateItem(item, answer) {
  const tipo = String(item.tipo || item.type || '').toLowerCase();
  if (answer === undefined || answer === null || answer === '') return false;
  if (tipo === 'seleccion_multiple' || tipo === 'multiple_choice' || tipo === 'verdadero_falso' || tipo === 'true_false') {
    return String(answer) === String(item.correcta || '');
  }
  if (tipo === 'pareados' || tipo === 'matching') {
    const expected = item.correcta;
    if (!expected || typeof expected !== 'object') return false;
    const current = answer && typeof answer === 'object' ? answer : {};
    return Object.keys(expected).every(key => String(expected[key]) === String(current[key] || ''));
  }
  if (tipo === 'ordenamiento' || tipo === 'ordering' || tipo === 'puzzle') {
    const expected = item.correcta;
    if (!Array.isArray(expected)) return false;
    const current = answer && typeof answer === 'object' ? answer : {};
    return expected.every((id, index) => String(current[id] || '') === String(index + 1));
  }
  return false;
}

function pickStudent(entry, byRut, byName) {
  const normalizedRut = cleanRut(entry.rut);
  const direct = byRut.get(normalizedRut);
  if (direct) return direct;
  const candidates = byName.get(normalizeName(entry.nombre)) || [];
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  const sameCourse = candidates.find(student => String(student.curso || '').trim().toUpperCase() === String(entry.curso || '').trim().toUpperCase());
  return sameCourse || candidates[0];
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
const ROOT = __dirname;
const AUDIT_PATH = path.join(ROOT, '_tmp_3dtp_auditoria.json');
const ROSTER_PATH = path.join(ROOT, 'carga_3D_TP.txt');
const INTERMEDIA_RUTS_PATH = path.join(ROOT, 'lecturas', 'asignaciones', 'pedro_paramo_nm3_3D_tp_intermedia_ruts.txt');
const SESSION_CANDIDATES = [
  { sid: 'pedro-paramo-nm3-regular-2026', source: 'regular' },
  { sid: 'pedro-paramo-nm3-intermedia-2026', source: 'intermedia' },
  { sid: 'pedro-paramo-nm3-luis-veloz-pie-2026', source: 'pie' },
  { sid: 'pedro-paramo-nm3-martin-gajardo-pie-2026', source: 'pie' }
];

const INTERMEDIA_RUTS = new Set(
  fs.readFileSync(INTERMEDIA_RUTS_PATH, 'utf8')
    .split(/\r?\n/)
    .map(line => cleanRut(line))
    .filter(Boolean)
);

(async () => {
  try {
    const roster = fs.readFileSync(ROSTER_PATH, 'utf8')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [nombre, rut, curso] = line.split(';');
        return { nombre, rut, curso };
      });

    const studentsSnap = await db.ref('plataforma_estudiantes/estudiantes').once('value');
    const students = studentsSnap.val() || {};
    const byName = new Map();
    const byRut = new Map();
    for (const [uid, st] of Object.entries(students)) {
      const record = { uid, ...st };
      const nameKey = normalizeName(st.nombre);
      if (!byName.has(nameKey)) byName.set(nameKey, []);
      byName.get(nameKey).push(record);
      byRut.set(cleanRut(st.rut), record);
    }

    const sessionSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/sesiones/' + s.sid).once('value')));
    const resultSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/resultados/' + s.sid).once('value')));
    const responseSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/respuestas/' + s.sid).once('value')));
    const manualSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/correcciones_manual/' + s.sid).once('value')));

    const sessionMeta = SESSION_CANDIDATES.map((_, i) => {
      const session = sessionSnaps[i].val() || {};
      const items = flattenItems((session.contenido || {}));
      const questionItems = items.filter(item => {
        const tipo = String(item.tipo || item.type || '').toLowerCase();
        return [
          'seleccion_multiple', 'multiple_choice', 'verdadero_falso', 'true_false',
          'pareados', 'matching', 'ordenamiento', 'ordering', 'puzzle',
          'desarrollo', 'abierta', 'respuesta_abierta', 'respuesta_corta', 'corta'
        ].includes(tipo);
      });
      const autoItems = questionItems.filter(item => {
        const tipo = String(item.tipo || item.type || '').toLowerCase();
        return ['seleccion_multiple', 'multiple_choice', 'verdadero_falso', 'true_false', 'pareados', 'matching', 'ordenamiento', 'ordering', 'puzzle'].includes(tipo);
      });
      const manualCount = questionItems.length - autoItems.length;
      const autoTotal = autoItems.reduce((sum, item) => sum + (Number(item.puntaje || item.puntos || item.points || 1) || 1), 0);
      const totalAll = questionItems.reduce((sum, item) => sum + (Number(item.puntaje || item.puntos || item.points || (autoItems.includes(item) ? 1 : 0)) || 0), 0);
      return {
        questionCount: questionItems.length,
        autoItems,
        autoTotal,
        totalAll,
        manualCount
      };
    });

    const manualItems = (() => {
      for (let i = 0; i < SESSION_CANDIDATES.length; i++) {
        const session = sessionSnaps[i].val() || {};
        const itemsRaw = ((session.contenido || {}).items) || [];
        const items = Array.isArray(itemsRaw) ? itemsRaw : Object.values(itemsRaw || {});
        const picked = items.filter(item => {
          const tipo = String(item.tipo || item.type || '').toLowerCase();
          return ['desarrollo', 'abierta', 'respuesta_abierta', 'respuesta_corta', 'corta'].includes(tipo);
        }).map(item => ({
          id: item.id,
          tipo: item.tipo || item.type,
          puntaje: item.puntaje || item.puntos || item.points || 0,
          enunciado: item.enunciado || item.pregunta || ''
        }));
        if (picked.length) return picked;
      }
      return [];
    })();

    const rows = roster.map(entry => {
      const normalizedRut = cleanRut(entry.rut);
      const expectedSource = INTERMEDIA_RUTS.has(normalizedRut) ? 'intermedia' : 'regular';
      const expectedSid = SESSION_CANDIDATES.find(candidate => candidate.source === expectedSource).sid;
      const st = pickStudent(entry, byRut, byName);
      const uid = st ? st.uid : null;
      let best = null;

      if (uid) {
        for (let i = 0; i < SESSION_CANDIDATES.length; i++) {
          const candidate = SESSION_CANDIDATES[i];
          const resultados = resultSnaps[i].val() || {};
          const respuestas = responseSnaps[i].val() || {};
          const manual = manualSnaps[i].val() || {};
          const result = resultados[uid] || {};
          const resp = respuestas[uid] || {};
          const corr = manual[uid] || null;
          const rawAnswers = resp.answers || {};
          const answeredFromAnswers = countAnsweredAnswers(rawAnswers);
          const answered = answeredFromAnswers || Number(result.answered_count || 0);
          const hasResult = result && (
            result.puntaje !== undefined ||
            result.submitted_at ||
            result.answered_count !== undefined ||
            result.puntaje_total_prueba !== undefined ||
            result.manual_corregido
          );
          const hasAnswers = answeredFromAnswers > 0;
          if (!hasResult && !hasAnswers && !corr) continue;

          const answers = {};
          manualItems.forEach(item => {
            answers[item.id] = getTextAnswer(rawAnswers[item.id]);
          });

          const meta = sessionMeta[i] || { questionCount: 0, autoItems: [], autoTotal: 0, totalAll: 0, manualCount: 0 };
          let auto = Number(result.puntaje !== undefined ? result.puntaje : (result.puntaje_obtenido || 0));
          if (!hasResult && hasAnswers) {
            auto = meta.autoItems.reduce((sum, item) => {
              const points = Number(item.puntaje || item.puntos || item.points || 1) || 1;
              return sum + (evaluateItem(item, rawAnswers[item.id]) ? points : 0);
            }, 0);
          }
          const totalItems = meta.questionCount || 0;
          const rank = answered * 1000 + auto + (result.submitted_at ? 100000 : 0);

          if (!best || rank > best.rank) {
            best = {
              sid: candidate.sid,
              source: candidate.source,
              rank,
              answered,
              total_items: totalItems,
              has_answers: hasAnswers,
              has_result: hasResult,
              submitted: !!result.submitted_at,
              auto,
              auto_total: result.total != null ? result.total : meta.autoTotal,
              manual_pendientes: result.manual_pendientes != null ? result.manual_pendientes : meta.manualCount,
              puntaje_total_prueba: result.puntaje_total_prueba != null ? result.puntaje_total_prueba : meta.totalAll,
              manual_corregido: !!result.manual_corregido,
              nota_final: result.nota_final,
              puntaje_total_final: result.puntaje_total_final,
              correccion_manual: corr,
              respuestas: answers
            };
          }
        }
      }

      return {
        nombre: entry.nombre,
        rut_roster: entry.rut,
        rut_actual: st ? (st.rut || entry.rut) : entry.rut,
        curso: entry.curso,
        uid,
        sid: best ? best.sid : expectedSid,
        source: best ? best.source : expectedSource,
        submitted: !!(best && best.submitted),
        has_answers: !!(best && best.has_answers),
        has_result: !!(best && best.has_result),
        has_activity: !!(best && (best.has_answers || best.has_result || best.correccion_manual)),
        answered: best ? best.answered : 0,
        total_items: best ? best.total_items : 0,
        incomplete: !!(best && best.total_items > 0 && best.answered < (best.total_items - 2)),
        auto: best ? best.auto : 0,
        auto_total: best ? best.auto_total : null,
        manual_pendientes: best ? best.manual_pendientes : null,
        puntaje_total_prueba: best ? best.puntaje_total_prueba : null,
        manual_corregido: !!(best && best.manual_corregido),
        nota_final: best ? best.nota_final : null,
        puntaje_total_final: best ? best.puntaje_total_final : null,
        correccion_manual: best ? best.correccion_manual : null,
        respuestas: best ? best.respuestas : {}
      };
    });

    const submittedFull = rows.filter(r => r.submitted && !r.incomplete);
    const submittedAll = rows.filter(r => r.has_activity);
    const incompleteRows = rows.filter(r => r.has_activity && r.incomplete);
    const sinEnvio = rows.filter(r => !r.submitted && r.has_activity);
    const sinActividad = rows.filter(r => !r.has_activity);
    const pendingManual = submittedAll.filter(r => !r.manual_corregido);
    const corrected = submittedAll.filter(r => r.manual_corregido);

    const report = {
      manualItems,
      totals: {
        roster: rows.length,
        submitted_full: submittedFull.length,
        submitted_all: submittedAll.length,
        corrected: corrected.length,
        pending_manual: pendingManual.length,
        incomplete: incompleteRows.length,
        sin_envio: sinEnvio.length,
        sin_actividad: sinActividad.length
      },
      rows,
      sinEnvio: sinEnvio.map(r => ({ nombre: r.nombre, rut: r.rut_actual, sid: r.sid, source: r.source, answered: r.answered, total_items: r.total_items })),
      sinActividad: sinActividad.map(r => ({ nombre: r.nombre, rut: r.rut_actual, sid: r.sid, source: r.source })),
      incompletos: incompleteRows.map(r => ({ nombre: r.nombre, rut: r.rut_actual, sid: r.sid, source: r.source, answered: r.answered, total_items: r.total_items })),
      pendingManual,
      submittedFull,
      submittedAll,
      corrected: corrected.map(r => ({
        nombre: r.nombre,
        sid: r.sid,
        auto: r.auto,
        total: r.puntaje_total_final,
        nota: r.nota_final,
        desarrollo: r.correccion_manual ? r.correccion_manual.desarrollo_puntaje : null
      }))
    };

    fs.writeFileSync(AUDIT_PATH, JSON.stringify(report, null, 2), 'utf8');
    console.log('AUDIT OK ->', AUDIT_PATH);
    console.log(
      'roster:', report.totals.roster,
      'submittedFull:', report.totals.submitted_full,
      'submittedAll:', report.totals.submitted_all,
      'incomplete:', report.totals.incomplete,
      'sinEnvio:', report.totals.sin_envio,
      'sinActividad:', report.totals.sin_actividad
    );
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
