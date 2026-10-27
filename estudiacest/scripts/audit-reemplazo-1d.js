'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { manejar, BASE, SESSION, QUESTIONS } = require('../api/_reemplazo-1d');
function fixture() {
  const data = {}, clone = value => value == null ? null : JSON.parse(JSON.stringify(value));
  return { data, ref(path) {
    const read = () => path === BASE ? Object.fromEntries(Object.entries(data).filter(([key]) => key.startsWith(BASE + '/')).map(([key, value]) => [key.slice(BASE.length + 1), clone(value)])) : clone(data[path]);
    return { once: async () => ({ val: read }), transaction: async update => {
      const result = update(read());
      if (result === undefined) return { committed: false, snapshot: { val: read } };
      data[path] = clone(result);
      return { committed: true, snapshot: { val: read } };
    } };
  } };
}
async function call(db, action, body, token, method) {
  const req = { method: method || (['1d-state', '1d-admin-list'].includes(action) ? 'GET' : 'POST'), query: { uid: body?.uid }, body,
    headers: { authorization: token ? 'Bearer ' + token : '' } };
  const res = { status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  await manejar(req, res, action, db, { verifyIdToken: async token => { if (!['teacher', 'student'].includes(token)) throw Error('invalid'); return { uid: token }; } });
  return res;
}
async function audit() {
  const db = fixture(), uid = crypto.randomUUID(), token = crypto.randomBytes(32).toString('hex');
  let checks = 0;
  const check = (value, message) => { assert.ok(value, message); checks++; };
  const body = { uid, fullName: 'ESTUDIANTE FICTICIO ÑANDÚ', caseId: '', answers: {} };
  check((await call(db, '1d-start', body)).code === 401, 'requiere capacidad');
  check((await call(db, '1d-start', { ...body, fullName: 'Nombre' }, token)).code === 400, 'nombre completo');
  let r = await call(db, '1d-start', body, token);
  check(r.code === 200 && r.body.attempt.course === '1D' && r.body.attempt.sessionId === SESSION, 'inicio con identidad acotada');
  check(!JSON.stringify(r.body).includes('tokenHash') && db.data[BASE + '/' + uid].tokenHash !== token, 'capacidad solo como hash, nunca en respuesta');
  const initial = structuredClone(db.data);
  check((await call(db, '1d-start', body, token)).code === 200 && JSON.stringify(initial) === JSON.stringify(db.data), 'inicio idempotente');
  check((await call(db, '1d-state', body, 'b'.repeat(64))).code === 403, 'rechaza capacidad ajena');
  check((await call(db, '1d-start', body, 'b'.repeat(64))).code === 403, 'no toma registro existente');
  body.answers.recibir = 'Ayuda con una tarea: ñ y tildes.';
  check((await call(db, '1d-save', body, token)).body.attempt.answers.recibir === body.answers.recibir, 'borrador Unicode');
  check((await call(db, '1d-submit', body, token)).code === 400, 'misma validación de preguntas completas');
  check((await call(db, '1d-save', { ...body, caseId: 'otro' }, token)).code === 400, 'caso inválido');
  check((await call(db, '1d-save', { ...body, answers: { recibir: 'x'.repeat(2001) } }, token)).code === 400, 'límite respuesta');
  body.caseId = 'curso'; body.answers = Object.fromEntries(QUESTIONS.map(id => [id, 'Respuesta ficticia a ' + id]));
  r = await call(db, '1d-submit', { ...body, course: 'otro', sessionId: 'otra', score: 100 }, token);
  const result = r.body.attempt;
  check(r.code === 200 && result.submitted === true && result.completada === true, 'marcas atómicas');
  check(result.submittedAt === result.completadaAt && result.submittedAt > 0 && result.answered === QUESTIONS.length && result.total === QUESTIONS.length, 'fechas y total real');
  check(result.score === null && result.course === '1D' && result.sessionId === SESSION, 'no acepta resultado ni identidad del cliente');
  const final = JSON.stringify(db.data[BASE + '/' + uid]);
  check((await call(db, '1d-save', { ...body, answers: {} }, token)).code === 409, 'guardado tardío rechazado');
  check((await call(db, '1d-submit', body, token)).code === 200 && JSON.stringify(db.data[BASE + '/' + uid]) === final, 'reenvío idempotente e inmutable');
  check((await call(db, '1d-state', body, token)).body.attempt.completada === true, 'confirmación por relectura');
  const second = { ...body, uid: crypto.randomUUID() }, otherToken = crypto.randomBytes(32).toString('hex');
  await call(db, '1d-start', second, otherToken);
  check(Object.keys(db.data).length === 2 && (await call(db, '1d-state', body, otherToken)).code === 403, 'nombres iguales no se fusionan ni comparten acceso');
  check((await call(db, '1d-admin-list')).code === 401, 'listado anónimo cerrado');
  check((await call(db, '1d-admin-list', null, 'invalid')).code === 401, 'token inválido');
  check((await call(db, '1d-admin-list', null, 'student')).code === 403, 'cuenta sin permiso cerrada');
  db.data['plataforma_estudiantes/admins/teacher'] = true;
  r = await call(db, '1d-admin-list', null, 'teacher');
  check(r.code === 200 && r.body.rows.length === 2 && r.body.rows.some(row => row.submitted), 'docente recibe entregas y borradores');
  check(!JSON.stringify(r.body).includes('tokenHash'), 'docente no recibe capacidades');
  check((await call(db, '1d-save', body, token, 'GET')).code === 405, 'métodos restringidos');
  console.log(`1D: ${checks} controles de identidad, guardado, entrega, reintento y privacidad aprobados.`);
}
if (require.main === module) audit().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { fixture, call, audit };
