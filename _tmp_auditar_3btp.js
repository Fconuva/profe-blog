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

function getTextAnswer(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value.text === 'string') return value.text;
  return '';
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
const AUDIT_PATH = path.join(ROOT, '_tmp_3btp_auditoria.json');
const ROSTER_PATH = path.join(ROOT, 'carga_3B_TP.txt');
// RUT con licencia medica u otra justificacion: no se cuentan como pendientes y se excluyen del informe.
const EXCLUDE_RUTS = new Set([
  '23200397-9' // BARRUETO ABARZUA BENJAMIN ALEJANDRO - licencia medica
]);
const SESSION_CANDIDATES = [
  { sid: 'pedro-paramo-nm3-regular-2026', source: 'regular' },
  { sid: 'pedro-paramo-nm3-dil-2026', source: 'dil' },
  { sid: 'pedro-paramo-nm3-leve-2026', source: 'leve' },
  { sid: 'pedro-paramo-nm3-vision-2026', source: 'vision' },
  { sid: 'pedro-paramo-nm3-antonio-caceres-pie-2026', source: 'pie' },
  { sid: 'pedro-paramo-nm3-nicolas-gonzalez-pie-2026', source: 'pie' },
  { sid: 'pedro-paramo-nm3-joaquin-rojas-pie-2026', source: 'pie' },
];

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
    for (const [uid, st] of Object.entries(students)) {
      byName.set(normalizeName(st.nombre), { uid, ...st });
    }

    const sessionSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/sesiones/' + s.sid).once('value')));
    const resultSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/resultados/' + s.sid).once('value')));
    const responseSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/respuestas/' + s.sid).once('value')));
    const manualSnaps = await Promise.all(SESSION_CANDIDATES.map(s => db.ref('plataforma_lecturas/correcciones_manual/' + s.sid).once('value')));

    // Cuenta items por sesion (auto + manual) para detectar incompletos.
    const sessionItemCounts = SESSION_CANDIDATES.map((_, i) => {
      const session = sessionSnaps[i].val() || {};
      const itemsRaw = ((session.contenido || {}).items) || [];
      const items = Array.isArray(itemsRaw) ? itemsRaw : Object.values(itemsRaw || {});
      const isQuestion = (it) => {
        const tipo = String(it.tipo || it.type || '').toLowerCase();
        return ['seleccion_multiple','multiple_choice','verdadero_falso','true_false','pareados','matching','ordenamiento','ordering','puzzle','desarrollo','abierta','respuesta_abierta','respuesta_corta','corta'].includes(tipo);
      };
      return items.filter(isQuestion).length;
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
      const st = byName.get(normalizeName(entry.nombre));
      const uid = st ? st.uid : null;
      const excluded = EXCLUDE_RUTS.has(entry.rut);
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
          const hasResult = result && (result.puntaje !== undefined || result.submitted_at || result.answered_count !== undefined);
          const hasAnswers = !!(resp.answers && Object.keys(resp.answers).length);
          if (!hasResult && !hasAnswers) continue;

          const answeredFromAnswers = Object.keys(resp.answers || {}).length;
          const answered = answeredFromAnswers || Number(result.answered_count || 0);
          const totalItems = sessionItemCounts[i] || 0;
          const score = hasResult ? Number(result.puntaje !== undefined ? result.puntaje : (result.puntaje_obtenido || 0)) : 0;
          const rank = answered * 1000 + score;
          if (!best || rank > best.rank) {
            const answers = {};
            manualItems.forEach(item => {
              answers[item.id] = getTextAnswer((resp.answers || {})[item.id]);
            });
            best = {
              sid: candidate.sid,
              source: candidate.source,
              rank,
              answered,
              total_items: totalItems,
              submitted: !!(result.submitted_at || hasAnswers),
              auto: result.puntaje,
              auto_total: result.total,
              manual_pendientes: result.manual_pendientes,
              puntaje_total_prueba: result.puntaje_total_prueba,
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
        excluded,
        excluded_reason: excluded ? 'licencia_medica' : null,
        sid: best ? best.sid : null,
        source: best ? best.source : null,
        submitted: !!(best && best.submitted),
        answered: best ? best.answered : 0,
        total_items: best ? best.total_items : 0,
        incomplete: !!(best && best.total_items > 0 && best.answered < (best.total_items - 2)),
        auto: best ? best.auto : null,
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

    const submitted = rows.filter(r => r.submitted && !r.excluded && !r.incomplete);
    const incompleteRows = rows.filter(r => r.submitted && !r.excluded && r.incomplete);
    const submittedAll = rows.filter(r => r.submitted && !r.excluded); // incluye incompletos para cierre manual
    const pendingManual = submitted.filter(r => !r.manual_corregido);
    const corrected = submitted.filter(r => r.manual_corregido);
    const excludedRows = rows.filter(r => r.excluded);

    const report = {
      manualItems,
      totals: {
        roster: rows.length,
        submitted: submitted.length,
        corrected: corrected.length,
        pending_manual: pendingManual.length,
        excluded: excludedRows.length,
        incomplete: incompleteRows.length,
      },
      excluded: excludedRows.map(r => ({ nombre: r.nombre, rut: r.rut_actual, reason: r.excluded_reason })),
      incompletos: incompleteRows.map(r => ({ nombre: r.nombre, rut: r.rut_actual, sid: r.sid, answered: r.answered, total_items: r.total_items })),
      pendingManual,
      submittedFull: submitted,
      submittedAll,
      corrected: corrected.map(r => ({
        nombre: r.nombre,
        sid: r.sid,
        auto: r.auto,
        total: r.puntaje_total_final,
        nota: r.nota_final,
        desarrollo: r.correccion_manual ? r.correccion_manual.desarrollo_puntaje : null
      })),
      submittedOverview: submitted.map(r => ({
        nombre: r.nombre,
        sid: r.sid,
        source: r.source,
        auto: r.auto,
        manual_corregido: r.manual_corregido,
        manual_pendientes: r.manual_pendientes,
        total_prueba: r.puntaje_total_prueba
      }))
    };

    fs.writeFileSync(AUDIT_PATH, JSON.stringify(report, null, 2), 'utf8');
    console.log('AUDIT OK ->', AUDIT_PATH);
    console.log('roster:', report.totals.roster, 'submitted:', report.totals.submitted, 'incomplete:', report.totals.incomplete, 'excluded:', report.totals.excluded, 'submittedAll:', submittedAll.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();