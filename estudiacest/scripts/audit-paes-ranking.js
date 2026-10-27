'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path'), { createRequire } = require('node:module');
const R = require('../api/_paes-ranking'), TP = require('../api/_paes-tp-catalog'), G24 = require('../api/_paes-g24-catalog');
const source = fs.readFileSync(path.join(__dirname, '../api/paes.js'), 'utf8');
function fixture(data = {}) {
  const reads = [];
  const at = p => p.split('/').reduce((value, part) => value?.[part], data) ?? null;
  return { data, reads, ref(p) { return { once: async () => { reads.push(p); return { val: () => at(p) }; } }; } };
}
function realApi(db, auth) {
  const ownRequire = createRequire(path.join(__dirname, '../api/paes.js'));
  const module = { exports: {} }, sandbox = { module, exports: module.exports, process, console, Buffer,
    require: name => name === 'firebase-admin' ? { apps: [{}], database: () => db, auth: () => auth } : ownRequire(name) };
  vm.runInNewContext(source + '\nmodule.exports.scoreRankingLegacy = scoreRankingLegacy;', sandbox, { filename: 'api/paes.js' });
  return module.exports;
}
async function call(api, program = 'hc', token = 'hc', guide = 'all', method = 'GET') {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await api({ method, headers: { authorization: token ? 'Bearer ' + token : '' }, query: { action: 'ranking', programa: program, guia: guide }, body: {} }, res);
  return res;
}
async function audit() {
  let checks = 0; const check = (value, message) => { assert.ok(value, message); checks++; };
  const profiles = { hc: { nombre: 'PÉREZ SOTO ANA MARÍA', rut: '100000001', curso: '3A-HC', activo: true }, tp: { nombre: 'LÓPEZ DÍAZ JUAN PABLO', rut: '100000002', curso: '4A-TP', activo: true }, admin: { nombre: 'Docente Ficticio', rut: '100000003', curso: '3A-HC' } };
  const data = { plataforma_estudiantes: { estudiantes: profiles, admins: { admin: true } }, plataforma_paes: { guia_respuestas: {}, tp_intentos: {}, guia24_intentos: {} } };
  const db = fixture(data), auth = { verifyIdToken: async token => { if (!['hc', 'tp', 'admin'].includes(token)) throw Error('invalid'); return { uid: token }; } }, api = realApi(db, auth);
  const score = api.scoreRankingLegacy;
  check((await call(api, 'hc', '')).code === 401, 'requiere autenticación');
  check((await call(api, 'hc', 'invalid')).code === 401, 'token inválido rechazado');
  check((await call(api, 'tp', 'hc')).code === 403 && (await call(api, 'hc', 'tp')).code === 403, 'no mezcla programas por parámetro');
  check((await call(api, '__proto__')).code === 400 && (await call(api, 'hc', 'hc', '25')).code === 400, 'parámetros restringidos');
  check((await call(api, 'hc', 'hc', 'all', 'POST')).code === 405, 'ranking de solo lectura');
  check(score('10', { answers: { 1: 'A' }, correct: 999, total: 1 }).correct === 1 && score('10', { answers: {}, correct: 9, total: 9 }).correct === 0, 'recalcula con clave de servidor');
  check(score('1', { answers: {}, contentVersion: 'antigua' }) === null, 'versión antigua no comparable');
  check(score('14', { answers: { 1: 'A' } }) === null, 'ensayo antiguo no usa la clave nueva');
  check(score('16', { answers: {}, total: 15 }).total === 15 && score('16', { answers: {}, total: 20 }).total === 20, 'denominadores históricos G16');
  check(R.confirmed({ submitted: true, completada: true }) && !R.confirmed({ submitted: true, completada: false, status: 'sent' }, true, '10'), 'marcas consistentes');
  check(R.confirmed({ status: 'sent' }, true, '11') && R.confirmed({ submittedAt: 1, answers: { 1: 'A' } }, true, '10'), 'entregas históricas documentadas');
  check(!R.confirmed({ submitted: true, completada: true, resetAt: 1 }) && !R.confirmed({ submitted: true, completada: true, variant: 'guided-access-2026' }), 'no mezcla borradores restablecidos ni actividades distintas');
  const r = { answers: { 1: 'A' }, submitted: true, completada: true, rut: profiles.hc.rut, curso: profiles.hc.curso, guiaId: '10', submittedAt: 2, correct: 99, total: 1 };
  const snapshots = { legacy: { 10: { [profiles.hc.rut]: r } } };
  let built = R.build('hc', profiles, { admin: true }, snapshots, score);
  check(built.length === 1 && built[0].results[10].correct === 1 && built[0].results[10].total === 9, 'identidad por RUT y clave, no nombre ni score enviado');
  check(built[0].nombre === 'Ana Pérez', 'solo nombre visible abreviado');
  r.reenvioBorrador = { answers: { 1: 'B' } };
  check(R.build('hc', profiles, {}, snapshots, score)[0].results[10].correct === 1, 'borrador de reenvío no reemplaza entrega');
  r.intentosAnteriores = [{ answers: { 1: 'A', 2: 'D' }, submittedAt: 1, correct: 200 }];
  check(R.build('hc', profiles, {}, snapshots, score)[0].results[10].correct === 2, 'mejor reenvío confirmado, recalculado');
  r.curso = '4A-TP'; check(R.build('hc', profiles, {}, snapshots, score).length === 0, 'curso del registro coincide con perfil'); r.curso = profiles.hc.curso;
  check(R.build('hc', { ...profiles, duplicate: { ...profiles.hc } }, {}, snapshots, score).length === 0, 'RUT duplicado no asigna una identidad arbitraria');
  check(R.build('hc', { ...profiles, hc: { ...profiles.hc, activo: false } }, {}, snapshots, score).length === 0, 'excluye cuentas inactivas');
  check(R.build('hc', { ...profiles, hc: { ...profiles.hc, qa: true } }, {}, snapshots, score).length === 0, 'excluye cuentas de prueba');
  const g24 = { uid: 'hc', curso: profiles.hc.curso, sessionId: G24.SESSION, version: G24.VERSION, submitted: true, completada: true, answers: Object.fromEntries(G24.questionsFor(false).map(q => [q.id, q.key])) };
  check(R.build('hc', profiles, {}, { g24: { [G24.SESSION]: { hc: g24 } } }, score)[0].results[24].correct === 18, 'incluye la última guía HC');
  for (const version of [TP.VERSION, TP.LEGACY_VERSION]) {
    const catalog = TP.catalog(1, version), sid = catalog.SESSION, attempt = { uid: 'tp', curso: profiles.tp.curso, sessionId: sid, version, submitted: true, completada: true, answers: Object.fromEntries(catalog.questionsFor(false).map(q => [q.id, q.key])) };
    const result = R.build('tp', profiles, {}, { tp: { [sid]: { tp: attempt } } }, score)[0].results[1];
    check(result.correct === result.total && result.total === catalog.questionsFor(false).length, 'TP conserva catálogo ' + version);
    attempt.version = 'desconocida'; check(R.build('tp', profiles, {}, { tp: { [sid]: { tp: attempt } } }, score).length === 0, 'TP rechaza versión desconocida');
  }
  const results = [{ uid: 'a', nombre: 'A', curso: '3A-HC', results: { 1: { correct: 1, total: 2 }, 2: { correct: 10, total: 10 } } }, { uid: 'b', nombre: 'B', curso: '3B-HC', results: { 1: { correct: 3, total: 4 } } }, { uid: 'c', nombre: 'C', curso: '3B-HC', results: { 1: { correct: 3, total: 4 } } }];
  const ordered = R.order(results, 'all', 'b');
  check(ordered.rows[0].percentage === 75 && ordered.rows[0].completed === 2, 'promedio por guía, distinto largo');
  check(ordered.rows[1].position === 2 && ordered.rows[2].position === 2 && ordered.mine.isYou === true, 'empate y puesto propio');
  check(R.order(results, '2', 'b').participants === 1, 'filtro por guía');
  check(!JSON.stringify(ordered).includes('uid') && !JSON.stringify(ordered).includes('rut'), 'no devuelve identificadores privados');
  data.plataforma_paes.guia_respuestas = snapshots.legacy;
  const before = JSON.stringify(data), a = await call(api), b = await call(api, 'hc', 'admin');
  check(a.code === 200 && b.code === 200 && a.body.guides.at(-1).id === '24', 'API real permite alumno de su programa y admin');
  check(db.reads.filter(p => p === 'plataforma_paes/guia_respuestas').length === 1, 'caché evita descargar todo por alumno');
  check(a.headers['Cache-Control'] === 'private, no-store', 'no hay caché pública compartida');
  check(JSON.stringify(data) === before, 'no modifica respuestas, notas ni publicaciones');
  const now = Date.now;
  try { Date.now = () => now() + R.CACHE_MS + 1; r.answers = {}; r.intentosAnteriores = []; const fresh = await call(api); check(fresh.body.rows[0].percentage === 0 && fresh.body.updatedAt > a.body.updatedAt, 'actualización automática desde resultados nuevos, incluido cero'); }
  finally { Date.now = now; }
  console.log(`Rankings PAES: ${checks} controles de cálculo, historia, identidad, privacidad, caché y actualización aprobados.`);
}
if (require.main === module) audit().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { fixture, realApi, call, audit };
