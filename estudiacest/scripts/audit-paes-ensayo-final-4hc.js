'use strict';
// Auditoría del ensayo final de Competencia Lectora de 4.º A y B HC (5-nov-2026).
// Trabaja con una base simulada: no toca Firebase ni cuentas reales.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const C = require('../api/_paes-ensayo-final-4hc-catalog'), B = require('../api/_paes-ensayo-final-4hc');
const ROOT = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

function database() {
  const state = { plataforma_estudiantes: { admins: { profesor: true }, estudiantes: {
    alumno: { nombre: 'QA 4A', curso: '4°A HC', rut: '000000001' },
    pareja: { nombre: 'QA 4B', curso: '4B-HC', rut: '000000002' },
    apoyo: { nombre: 'QA acompañado', curso: '4A-HC', rut: '229327739' },
    tercero: { nombre: 'QA 3A', curso: '3A-HC', rut: '000000003' },
    otro: { nombre: 'QA fuera', curso: '2A-HC', rut: '000000004' }
  } } };
  const clone = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  const get = p => p.split('/').reduce((o, k) => o?.[k], state) ?? null;
  const set = (p, v) => { const a = p.split('/'), k = a.pop(); let o = state; for (const s of a) o = o[s] ||= {}; o[k] = clone(v); };
  return { state, ref: p => ({
    once: async () => ({ val: () => clone(get(p)) }),
    set: async v => set(p, v),
    transaction: async fn => {
      if (get(p) !== null) fn(null);
      const v = fn(clone(get(p)));
      if (v === undefined) return { committed: false, snapshot: { val: () => clone(get(p)) } };
      set(p, v); return { committed: true, snapshot: { val: () => clone(v) } };
    }
  }) };
}
const auth = { verifyIdToken: async t => { if (!['alumno', 'pareja', 'apoyo', 'tercero', 'otro', 'profesor'].includes(t)) throw Error('token'); return { uid: t }; } };
async function call(db, action, token, body, mode = 'regular', admin = false) {
  let status = 200, value;
  const res = { setHeader() {}, status(n) { status = n; return this; }, json(v) { value = JSON.parse(JSON.stringify(v)); return this; } };
  await B.handle(action, { method: body ? 'POST' : 'GET', headers: { authorization: token ? 'Bearer ' + token : '' }, query: { mode }, body }, res, { db, auth, adminUid: admin ? 'profesor' : undefined });
  return { status, body: value };
}
const full = g => ({ version: C.VERSION, answers: Object.fromEntries(C.questionsFor(g).map(q => [q.id, q.key])), reflection: {} });
const EXPECTED_KEY = 'CADBCBAACDBADCBDBACDABCADBCDABDCACDBACBDAB';
const PRIVATE = /"(?:key|reason|failures|skill|level|evidence)":/;

async function audit() {
  let n = 0;
  const check = (c, m) => { assert.ok(c, m); n++; };
  const db = database();

  // Contenido: cinco lecturas, 42 preguntas que puntúan, sin controles internos.
  const qs = C.questionsFor(false);
  check(C.texts.length === 5 && qs.length === 42, 'cinco lecturas y 42 preguntas');
  check(qs.map(q => q.key).join('') === EXPECTED_KEY, 'clave 1–42 esperada');
  check(qs.every((q, i) => q.id === 'q' + (i + 1)), 'renumeración 1–42');
  check(JSON.stringify(C.texts.map(t => qs.filter(q => q.textId === t.id).length)) === '[7,8,10,8,9]', 'preguntas por lectura 7, 8, 10, 8 y 9');
  check(C.texts.every(t => qs.some(q => q.textId === t.id)), 'cada lectura tiene sus preguntas');
  check(C.texts.flatMap(t => t.blocks).filter(b => b.table).length === 1 && C.texts[0].blocks.some(b => b.table), 'una sola tabla, en la lectura 1');
  check(qs.every(q => q.options.length === 4 && 'ABCD'.includes(q.key) && q.failures.filter(Boolean).length === 3 && q.failures[q.key.charCodeAt(0) - 65] === '' && q.evidence.length > 5 && q.reason.length > 20), 'cuatro alternativas, tres descartes y evidencia');
  const textJson = JSON.stringify(C.texts) + JSON.stringify(qs.map(q => [q.text, q.options]));
  check(!/Lectura \d|Control|control interno|«|»/.test(textJson.replace(/Lectura \d de 5/g, '')), 'sin referencias cruzadas, controles ni comillas de otro estilo');
  const g = C.questionsFor(true);
  check(g.length === 6 && new Set(g.map(q => q.key)).size >= 3 && g.every(q => q.failures.filter(Boolean).length === 3 && q.evidence.length > 5), 'ruta acompañada: seis preguntas con clave única y evidencia');
  const gt = C.publicActivity(true).texts[0].blocks.map(b => b.p).join(' '), source = C.texts[4].blocks.map(b => b.p).filter(Boolean).join(' ');
  check(C.publicActivity(true).texts[0].blocks.every(b => source.includes(b.p)), 'estímulo acompañado tomado literalmente de la lectura 5');
  check(gt.split(/\s+/).length < 400, 'estímulo acompañado breve');
  check(C.note(0, 42) === 1 && C.note(42, 42) === 7 && C.note(30, 50) === 4 && C.note(25, 42) === 4 && C.note(21, 42) === 3.5 && C.note(36, 42) === 5.9, 'nota con exigencia 60 %');
  check(!/_paes-nota-auto|ef4hc|ensayofinal4hc/i.test(read('api/_paes-nota-auto.js')), 'no está conectado a la nota automática');

  // Cuenta, curso y privacidad.
  check((await call(db, 'mini-state')).status === 401, 'requiere autenticación');
  check((await call(db, 'mini-state', 'bad')).status === 401, 'token inválido');
  check((await call(db, 'mini-state', 'otro')).status === 403 && (await call(db, 'mini-state', 'tercero')).status === 403, 'otros cursos fuera de aplicación');
  for (const uid of ['alumno', 'pareja']) {
    const r = await call(db, 'mini-state', uid);
    check(r.status === 200 && r.body.activity.questions.length === 42 && r.body.activity.timeLimitMinutes === 90, '4.º A y B regular: 42 ítems y 90 minutos');
    check(!PRIVATE.test(JSON.stringify(r.body)) && !JSON.stringify(r.body).includes(EXPECTED_KEY), 'pauta privada');
    check(r.body.attempt === null, 'entrar no inicia el intento');
  }
  check((await call(db, 'mini-state', 'apoyo')).body.redirect.endsWith('/ensayo-final-4hc/guiada.html'), 'identidad acompañada redirige');
  let r = await call(db, 'mini-state', 'apoyo', null, 'guided');
  check(r.body.activity.questions.length === 6 && r.body.activity.timeLimitMinutes === null && !PRIVATE.test(JSON.stringify(r.body)), 'acompañado: seis preguntas, sin temporizador ni pauta');
  check((await call(db, 'mini-state', 'alumno', null, 'guided')).body.redirect === '/paes/ensayo-final-4hc/', 'regular no obtiene la variante acompañada');
  check((await call(db, 'mini-start', 'profesor', full(false))).status === 403, 'vista docente no crea intentos');
  check((await call(db, 'mini-save', 'alumno', { version: 'old' })).status === 409, 'rechaza versión antigua');
  check((await call(db, 'mini-save', 'alumno', { version: C.VERSION, answers: { q43: 'A' } })).status === 400, 'rechaza id ajeno');

  // Reloj de 90 minutos en el servidor.
  r = await call(db, 'mini-start', 'alumno', { version: C.VERSION, answers: {} });
  const deadline = r.body.attempt.expiresAt, start = r.body.attempt.timerStartedAt;
  check(deadline - start === 90 * 60000, 'plazo de 90 minutos desde el inicio del servidor');
  r = await call(db, 'mini-start', 'alumno', full(false));
  check(r.body.attempt.expiresAt === deadline && Object.keys(r.body.attempt.answers).length === 0, 'reiniciar no cambia avance ni reloj');
  r = await call(db, 'mini-save', 'alumno', { ...full(false), uid: 'otro', curso: '3A-HC', expiresAt: 9e15, score: 999, submitted: true });
  check(!r.body.attempt.submitted && r.body.attempt.expiresAt === deadline && !r.body.attempt.performance, 'no confía en datos del cliente');

  // Strikes.
  for (let j = 1; j <= 3; j++) {
    const e = { ...full(false), eventId: 'fixture-event-' + j, reason: 'hidden' };
    r = await call(db, 'mini-incident', 'alumno', e);
    check(r.body.attempt.strikes === j, 'strike ' + j);
    if (j === 1) { const again = await call(db, 'mini-incident', 'alumno', { ...e, answers: {} }); check(again.body.attempt.strikes === 1 && Object.keys(again.body.attempt.answers).length === 42, 'incidencia idempotente'); }
  }
  check(r.body.attempt.submitted && r.body.attempt.completada && r.body.attempt.endedBy === 'strikes', 'tercer strike cierra con las dos marcas');
  check(!r.body.attempt.performance && !r.body.attempt.review && !r.body.attempt.result, 'resultado privado al entregar');
  check((await call(db, 'mini-save', 'alumno', full(false))).status === 409, 'cola tardía no revierte la entrega');
  check((await call(db, 'admin-mini-list', 'alumno')).status === 403, 'panel solo para administradores');

  // Quitar strikes conserva respuestas y reloj.
  const cold = { ref: p => ({ ...db.ref(p), transaction: async fn => fn(null) === undefined ? { committed: false, snapshot: { val: () => null } } : db.ref(p).transaction(fn) }) };
  check((await call(cold, 'admin-mini-clear-strikes', 'profesor', { uid: 'no-existe', sessionId: C.SESSION, integrityEpoch: 0, requestId: 'fixture-missing', reason: 'Verificar ausencia' }, 'regular', true)).status === 404, 'un intento inexistente no se crea');
  r = await call(cold, 'admin-mini-clear-strikes', 'profesor', { uid: 'alumno', sessionId: C.SESSION, integrityEpoch: 0, requestId: 'fixture-adjustment', reason: 'Incidencia técnica comprobada' }, 'regular', true);
  check(r.body.resumed && r.body.integrityEpoch === 1, 'la corrección reabre conservando');
  r = await call(db, 'mini-state', 'alumno');
  check(r.body.attempt.expiresAt === deadline && Object.keys(r.body.attempt.answers).length === 42 && r.body.attempt.strikes === 0, 'respuestas y reloj conservados');
  check((await call(db, 'mini-save', 'alumno', full(false))).status === 409, 'cola con época anterior rechazada');
  r = await call(db, 'mini-submit', 'alumno', { ...full(false), integrityEpoch: 1 });
  check(r.body.attempt.submitted && r.body.attempt.completada && r.body.attempt.endedBy === 'student', 'entrega voluntaria con dos marcas');

  // Publicación por curso: puntaje, nota y retroalimentación.
  r = await call(db, 'mini-state', 'alumno');
  check(!r.body.attempt.performance && !r.body.attempt.review, 'sin publicar no hay resultado ni pauta');
  check((await call(db, 'admin-mini-release', 'profesor', { curso: '3A-HC', published: true }, 'regular', true)).status === 400, 'solo 4.º A y B pueden publicarse');
  await call(db, 'admin-mini-release', 'profesor', { curso: '4A-HC', published: true }, 'regular', true);
  r = await call(db, 'mini-state', 'alumno');
  check(r.body.attempt.performance.correct === 42 && r.body.attempt.performance.note === 7 && r.body.attempt.review.length === 42, 'tras publicar se ve el resultado del servidor');
  await call(db, 'admin-mini-release', 'profesor', { curso: '4A-HC', published: false }, 'regular', true);
  check(!(await call(db, 'mini-state', 'alumno')).body.attempt.performance, 'retirar la publicación oculta el resumen');
  r = await call(db, 'admin-mini-list', 'profesor', null, 'regular', true);
  const row = r.body.rows.find(x => x.uid === 'alumno');
  check(row.performance.total === 42 && row.performance.note === 7 && r.body.keys.regular.length === 42 && r.body.keys.guided.length === 6, 'el docente ve aciertos, nota y ambas pautas');
  check(B.BASE !== require('../api/_paes-g24').BASE && B.CONFIG !== require('../api/_paes-g24').CONFIG, 'almacenamiento distinto de la guía 24');

  // Reapertura con archivo y vencimiento.
  await call(db, 'admin-mini-reset', 'profesor', { uid: 'alumno', sessionId: C.SESSION }, 'regular', true);
  r = await call(db, 'mini-state', 'alumno');
  check(r.body.attempt === null && r.body.resetAt > 0, 'reapertura con archivo');
  check((await call(db, 'mini-save', 'alumno', { ...full(false), integrityEpoch: 1 })).status === 409, 'cola previa a la reapertura rechazada');
  const realNow = Date.now; let clock = realNow();
  Date.now = () => clock;
  try {
    r = await call(db, 'mini-start', 'pareja', { version: C.VERSION, answers: { q1: qs[0].key } });
    check(r.body.attempt.expiresAt - r.body.attempt.timerStartedAt === 90 * 60000, '4.º B también tiene 90 minutos');
    clock = r.body.attempt.expiresAt;
    r = await call(db, 'mini-submit', 'pareja', full(false));
    check(r.body.attempt.endedBy === 'time' && Object.keys(r.body.attempt.answers).length === 1, 'al vencer se entregan solo las respuestas guardadas');
    r = await call(db, 'mini-start', 'apoyo', { version: C.VERSION, answers: {} }, 'guided');
    check(r.body.attempt.expiresAt === null, 'acompañado sin plazo');
  } finally { Date.now = realNow; }
  r = await call(db, 'mini-submit', 'apoyo', full(true), 'guided');
  const guided = (await db.ref(B.BASE + '/' + C.SESSION + '-guiada/apoyo').once('value')).val();
  check(guided.variant === 'guided-access-2026' && guided.total === 6 && guided.completada, 'variante acompañada persiste por separado');
  r = await call(db, 'admin-mini-list', 'profesor', null, 'regular', true);
  check(r.body.rows.find(x => x.uid === 'apoyo').performance.total === 6 && r.body.rows.find(x => x.uid === 'apoyo').performance.note === null, 'denominador acompañado aislado y sin nota');

  // Bloqueo docente.
  const locks = database();
  await locks.ref(B.CONFIG + '/blocked').set(true);
  check((await call(locks, 'mini-state', 'alumno')).status === 403, 'el bloqueo impide el inicio');
  await locks.ref(B.CONFIG + '/blocked').set(false);
  check((await call(locks, 'mini-state', 'alumno')).status === 200, 'la habilitación permite el inicio');

  // Cliente y registro.
  const html = read('paes/ensayo-final-4hc/index.html') + read('paes/ensayo-final-4hc/guiada.html'), js = read('paes/ensayo-final-4hc/mini.js');
  check(html.includes('5 lecturas') && html.includes('42 preguntas') && html.includes('90 minutos'), 'la entrada anuncia 5 lecturas, 42 preguntas y 90 minutos');
  check(!/guia24|g24|Guía N\.º 24/i.test(html + js + read('paes/ensayo-final-4hc/docente.js') + read('paes/ensayo-final-4hc/portal.js')), 'sin restos de la guía 24');
  check(js.includes('ef4hc-state') && js.includes('ef4hc-save') && js.includes('ef4hc-incident') && js.includes('ef4hc-submit') && js.includes('ef4hc-start'), 'el cliente usa las acciones propias');
  check(!/"key"\s*:/.test(js + html) && !(js + html).includes(EXPECTED_KEY), 'el cliente no contiene claves');
  const router = read('api/paes.js');
  check(/ef4hc-state[^\n]*EF4HC\.handle\(action\.replace\('ef4hc-','mini-'\)/.test(router) && /admin-ef4hc-[^\n]*EF4HC\.handle/.test(router), 'rutas registradas en api/paes.js');
  const portal = read('paes/index.html');
  check(portal.includes('id="ensayoFinal4hcCard"') && portal.includes('/paes/ensayo-final-4hc/portal.js') && portal.includes('5 lecturas') && portal.includes('42 preguntas') && portal.includes('90 min'), 'tarjeta del portal');
  check(read('paes/admin/index.html').includes('/paes/ensayo-final-4hc/docente.html'), 'enlace en el administrador PAES');
  const contract = JSON.parse(read('scripts/class-submission-contract.json')), pages = JSON.stringify(contract);
  check(pages.includes('paes/ensayo-final-4hc/index.html') && pages.includes('paes/ensayo-final-4hc/guiada.html') && pages.includes('admin-ef4hc-clear-strikes'), 'contrato de entrega registrado');
  const manifest = read('scripts/academic-release-manifest.json');
  check(['index.html', 'guiada.html', 'mini.js', 'mini.css', 'sesion.js', 'portal.js', 'docente.html', 'docente.js'].every(f => manifest.includes('"paes/ensayo-final-4hc/' + f + '"')), 'manifiesto de publicación');
  const integrity = read('paes/mini-invierno-2027/integridad.js');
  check(/200/.test(integrity) && /5000/.test(integrity), 'control compartido conserva gracia de foco y pestaña');
  console.log(JSON.stringify({ ok: true, checks: n, session: C.SESSION }));
}
if (require.main === module) audit().catch(e => { console.error(e); process.exitCode = 1; });
module.exports = { database, call, full };
