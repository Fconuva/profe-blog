'use strict';
const { visiblesDeCurso } = require('./_nombre-visible');
const TP = require('./_paes-tp-catalog');
const MINI = require('./_paes-mini-invierno-catalog');
const MINI_V1 = require('./_paes-mini-invierno-catalog-v1');
const OCT = require('./_paes-mini-octubre-catalog');
const G24 = require('./_paes-g24-catalog');
const clean = value => String(value || '').replace(/[^0-9A-Z]/gi, '').toUpperCase();
const courses = { hc: new Set(['3AHC', '3BHC', '4AHC', '4BHC']), tp: new Set(['4ATP', '4BTP', '4CTP', '4DTP', '4ETP']) };
const cache = new WeakMap(), CACHE_MS = 20000;
const descriptors = {
  hc: [...Array.from({ length: 21 }, (_, i) => ({ id: String(i + 1), label: 'Guía ' + (i + 1) })),
    { id: '22', label: 'Guía 22 · Miniensayo de invierno' }, { id: '23', label: 'Guía 23 · Evidencia y consistencia' }, { id: '24', label: 'Guía 24 · Textos discontinuos avanzados' }],
  tp: [{ id: '1', label: 'Semana 1 · Diagnóstico' }, { id: '2', label: 'Semana 2 · Práctica' }, { id: '3', label: 'Semana 3 · Miniensayo final' }]
};
const error = (status, message) => Object.assign(new Error(message), { status });
function confirmed(record, legacy = false, id = '') {
  if (!record || record.resetAt || record.variant && record.variant !== 'regular') return false;
  if (record.submitted !== undefined || record.completada !== undefined) return record.submitted === true && record.completada === true;
  return legacy && (record.status === 'sent' || ['10', '11', '12', '13'].includes(id) && Number(record.submittedAt) > 0 && Object.keys(record.answers || {}).length > 0);
}
function order(entries, guide, viewer) {
  const rows = entries.map(entry => {
    const values = guide === 'all' ? Object.values(entry.results) : entry.results[guide] ? [entry.results[guide]] : [];
    if (!values.length) return null;
    return { uid: entry.uid, nombre: entry.nombre, curso: entry.curso, percentage: Math.round(values.reduce((sum, v) => sum + v.correct / v.total * 100, 0) / values.length * 10) / 10, completed: values.length };
  }).filter(Boolean).sort((a, b) => b.percentage - a.percentage || b.completed - a.completed || a.nombre.localeCompare(b.nombre, 'es') || a.uid.localeCompare(b.uid));
  rows.forEach((row, index) => { row.position = index && row.percentage === rows[index - 1].percentage && row.completed === rows[index - 1].completed ? rows[index - 1].position : index + 1; });
  const safe = row => row ? { position: row.position, nombre: row.nombre, curso: row.curso, percentage: row.percentage, completed: row.completed, isYou: row.uid === viewer } : null;
  return { rows: rows.filter(row => row.position <= 10).map(safe), mine: safe(rows.find(row => row.uid === viewer)), participants: rows.length };
}
function build(program, profiles, admins, data, scoreLegacy) {
  const eligible = Object.entries(profiles).filter(([uid, p]) => p && p.activo !== false && !admins[uid] && !p.qa && !p.test && !p.esPrueba && p.ocultarDeCasas !== true && clean(p.rut) !== '111111111' && courses[program].has(clean(p.curso)));
  const rutCounts = {};
  eligible.forEach(([, p]) => { const rut = clean(p.rut); if (rut) rutCounts[rut] = (rutCounts[rut] || 0) + 1; });
  const unique = eligible.filter(([, p]) => clean(p.rut) && rutCounts[clean(p.rut)] === 1);
  const names = visiblesDeCurso(Object.fromEntries(unique)), byUid = {}, byRut = {};
  unique.forEach(([uid, p]) => {
    const course = clean(p.curso).replace(/^(\d)([A-Z])(HC|TP)$/, '$1$2-$3');
    const entry = { uid, nombre: names[uid], curso: course, results: {} };
    byUid[uid] = entry; byRut[clean(p.rut)] = entry;
  });
  const put = (entry, id, result) => {
    if (!entry || !result || !Number.isFinite(result.correct) || !Number.isFinite(result.total) || result.total <= 0 || result.correct < 0 || result.correct > result.total) return;
    const prior = entry.results[id];
    if (!prior || result.correct / result.total > prior.correct / prior.total) entry.results[id] = { correct: result.correct, total: result.total };
  };
  if (program === 'hc') {
    for (const { id } of descriptors.hc.filter(d => Number(d.id) <= 21)) {
      for (const [rut, record] of Object.entries(data.legacy?.[id] || {})) {
        const entry = byRut[clean(rut)];
        if (!entry || !confirmed(record, true, id) || record.rut && clean(record.rut) !== clean(rut) || record.curso && clean(record.curso) !== clean(entry.curso) || record.guiaId && String(record.guiaId) !== id) continue;
        // Estos archivos se crean al confirmar un reenvío; nunca incluyen el
        // borrador de reenvío ni el archivo de un intento restablecido.
        const archived = Object.values(record.intentosAnteriores || {}).filter(r => Number(r?.submittedAt) > 0 && Object.keys(r?.answers || {}).length).map(r => ({ ...r, submitted: true, completada: true, contentVersion: record.contentVersion, variant: record.variant }));
        const candidates = [record, ...archived];
        for (const candidate of candidates) {
          if (!confirmed(candidate, true, id) || candidate.rut && clean(candidate.rut) !== clean(rut) || candidate.curso && clean(candidate.curso) !== clean(entry.curso)) continue;
          put(entry, id, scoreLegacy(id, candidate));
        }
      }
    }
    for (const [id, catalog, records] of [['22', MINI, data.mini], ['23', OCT, data.oct], ['24', G24, data.g24]]) {
      for (const [uid, r] of Object.entries(records?.[catalog.SESSION] || {})) {
        const entry = byUid[uid], version = id === '22' && r?.version === MINI_V1.VERSION ? MINI_V1 : catalog;
        if (!entry || !confirmed(r) || r.uid !== uid || r.sessionId !== catalog.SESSION || clean(r.curso) !== clean(entry.curso) || r.version !== version.VERSION) continue;
        put(entry, id, version.grade(r.answers || {}, false));
      }
    }
  } else {
    for (const { id } of descriptors.tp) {
      const sid = 'paes-tp-2026-s' + id;
      for (const [uid, r] of Object.entries(data.tp?.[sid] || {})) {
        const entry = byUid[uid];
        if (!entry || !confirmed(r) || r.uid !== uid || r.sessionId !== sid || clean(r.curso) !== clean(entry.curso) || ![TP.VERSION, TP.LEGACY_VERSION].includes(r.version)) continue;
        put(entry, id, TP.catalog(Number(id), r.version).grade(r.answers || {}, false));
      }
    }
  }
  return Object.values(byUid).filter(entry => Object.keys(entry.results).length);
}
async function load(db, program, ctx) {
  let state = cache.get(db); if (!state) { state = {}; cache.set(db, state); }
  if (state[program]?.value && Date.now() - state[program].at < CACHE_MS) return state[program];
  if (state[program]?.pending) return state[program].pending;
  const pending = (async () => {
    const paths = ['plataforma_estudiantes/estudiantes', 'plataforma_estudiantes/admins', ...(program === 'hc' ? [
      'plataforma_paes/guia_respuestas', 'plataforma_paes/mini_invierno_intentos', 'plataforma_paes/mini_octubre_intentos', 'plataforma_paes/guia24_intentos'
    ] : ['plataforma_paes/tp_intentos'])];
    const [profiles, admins, ...values] = await Promise.all(paths.map(async path => (await db.ref(path).once('value')).val() || {}));
    const data = program === 'hc' ? { legacy: values[0], mini: values[1], oct: values[2], g24: values[3] } : { tp: values[0] };
    const result = { at: Date.now(), value: build(program, profiles, admins, data, ctx.scoreLegacy) };
    state[program] = result; return result;
  })();
  state[program] = { pending };
  try { return await pending; } catch (error) { delete state[program]; throw error; }
}
async function handle(req, res, ctx) {
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    if (req.method !== 'GET') throw error(405, 'Usa GET para consultar el ranking.');
    const program = req.query.programa, guide = String(req.query.guia || 'all');
    if (!['hc', 'tp'].includes(program) || guide !== 'all' && !descriptors[program].some(d => d.id === guide)) throw error(400, 'Selecciona HC o TP y una guía disponible.');
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) throw error(401, 'Ingresa con tu cuenta para ver el ranking.');
    let user; try { user = await ctx.auth.verifyIdToken(token); } catch (_) { throw error(401, 'Vuelve a ingresar para consultar el ranking.'); }
    const [profileSnap, adminSnap] = await Promise.all([ctx.db.ref('plataforma_estudiantes/estudiantes/' + user.uid).once('value'), ctx.db.ref('plataforma_estudiantes/admins/' + user.uid).once('value')]);
    const profile = profileSnap.val();
    if (adminSnap.val() !== true && (!profile || profile.activo === false || !courses[program].has(clean(profile.curso)))) throw error(403, 'Este ranking corresponde al otro programa PAES.');
    const loaded = await load(ctx.db, program, ctx);
    return res.status(200).json({ success: true, program, guide, guides: descriptors[program], updatedAt: loaded.at, refreshSeconds: 60, ...order(loaded.value, guide, user.uid) });
  } catch (e) {
    if (!e.status) console.error('[paes-ranking] No se pudo consultar:', e.code || 'internal');
    return res.status(e.status || 500).json({ error: e.status ? e.message : 'No se pudo actualizar el ranking. Vuelve a intentarlo.' });
  }
}
module.exports = { handle, build, order, confirmed, descriptors, CACHE_MS };
