/* Calificación PAES G1–G19, excepto G20/G21.
 * Simulación por defecto. --apply=CHECKSUM escribe solo si coincide la simulación.
 * Las entregas se revalidan con ETag antes de cada escritura; los borradores
 * y las notas históricas sin entrega nueva se conservan.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const os = require('os');
const path = require('path');
const { getAccessToken } = require('./firebase-maintenance-db');
const { gradeFromScore } = require('./publish-paes-semester-grades');
const { readState, scoreChecked, TEST_RUT } = require('./audit-paes-reopened-grades');

const BASE = 'plataforma_paes';
const DATABASE = 'https://estudiacest-default-rtdb.firebaseio.com';
const IDS = Array.from({ length:19 }, (_, i) => String(i + 1));
const MODEL = 'paes-reaperturas-g1-g19-2026-10-01';

function validGrade(value) {
  const number = Number(String(value == null ? '' : value).replace(',', '.'));
  return Number.isFinite(number) && number >= 1 && number <= 7 ? number.toFixed(1) : null;
}
function omitted(id, book, record) {
  const course = String((book && book.curso) || record.curso || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return id === '14' && course === '4AHC';
}
function submitted(id, record) {
  if (id === '14') {
    const answers = Object.keys(record.answers || {});
    const current = record.instrumentVersion === 'g14-2026-1' ||
      answers.some(question => /^q(?:0[1-9]|[1-4]\d)$/.test(question)) ||
      (Array.isArray(record.form) && record.form.length === 5 &&
        record.form.every(value => ['1','2','3','4','5'].includes(String(value))));
    return record.status === 'sent' && current;
  }
  return record.status === 'sent' || record.submitted === true || record.completada === true;
}
function recoverableLegacyG10(id, record) {
  if (id !== '10' || !record || record.status !== 'draft' ||
    record.submitted === true || record.completada === true ||
    !Number.isFinite(Number(record.submittedAt)) || Number(record.submittedAt) <= 0 ||
    !record.answers || Object.keys(record.answers).length === 0) return false;
  // El autoguardado antiguo pisó el estado 2–7 s después de la entrega.
  // Una edición más tardía no demuestra que el nuevo trabajo se haya enviado.
  const lag = Number(record.lastSavedAt) - Number(record.submittedAt);
  return Number.isFinite(lag) && lag >= 0 && lag <= 10000;
}
function stable(value) {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key =>
    JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
function digest(value) { return crypto.createHash('sha256').update(stable(value)).digest('hex'); }

function buildPlan(state) {
  const attempts = [], notes = [], skipped = { draft:0, omitted14:0, invalidScore:0, existingManualConflict:0, alreadyGraded:0 };
  const byGuide = {};
  IDS.forEach(id => { byGuide[id] = { submitted:0, attemptsToGrade:0, notesToAdd:0, notesToChange:0 }; });
  for (const id of IDS) for (const [rut, record] of Object.entries(state.responses[id] || {})) {
    if (rut === TEST_RUT || !record || typeof record !== 'object') continue;
    const book = state.books[rut] || {};
    const recovered = recoverableLegacyG10(id, record);
    if (!submitted(id, record) && !recovered) { skipped.draft++; continue; }
    if (recovered && book.notas && book.notas[id] != null) { skipped.draft++; continue; }
    if (omitted(id, book, record)) { skipped.omitted14++; continue; }
    byGuide[id].submitted++;
    const checked = scoreChecked(id, record);
    if (!checked || !checked.matches || !Number.isInteger(Number(record.correct)) ||
      !Number.isInteger(Number(record.total)) || Number(record.total) <= 0) {
      skipped.invalidScore++; continue;
    }
    const calculated = gradeFromScore(checked.correct, checked.total);
    const oldNote = book.notas && book.notas[id];
    const bookGrade = validGrade(oldNote);
    const manualGrade = validGrade(record.grade && record.grade.nota);
    const resent = Number(record.reenviadoAt) > 0;
    if (manualGrade && bookGrade && manualGrade !== bookGrade) {
      skipped.existingManualConflict++; continue;
    }
    const grade = manualGrade || (resent ? calculated : (bookGrade || calculated));
    const source = manualGrade ? 'manual-vigente' : recovered ? 'entrega-legacy-autoguardado' :
      resent ? 'reenvio-verificado' : bookGrade ? 'libro-vigente' : 'puntaje-verificado';
    if (!manualGrade) {
      attempts.push({ id, rut, expected:digest(record), grade, source, correct:checked.correct, total:checked.total });
      byGuide[id].attemptsToGrade++;
    } else skipped.alreadyGraded++;
    if (oldNote == null || (resent && String(oldNote) !== grade && !manualGrade)) {
      notes.push({ id, rut, before:oldNote == null ? null : String(oldNote), after:grade });
      byGuide[id][oldNote == null ? 'notesToAdd' : 'notesToChange']++;
    }
  }
  attempts.sort((a,b) => Number(a.id) - Number(b.id) || a.rut.localeCompare(b.rut));
  notes.sort((a,b) => Number(a.id) - Number(b.id) || a.rut.localeCompare(b.rut));
  const checksum = digest({ attempts, notes });
  return { attempts, notes, skipped, byGuide, checksum };
}

function request(method, relative, token, body, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${DATABASE}/${BASE}/${relative}.json`);
    url.searchParams.set('access_token', token);
    const payload = body === undefined ? null : JSON.stringify(body);
    const req = https.request(url, { method, headers:{ ...(headers || {}),
      ...(payload ? { 'Content-Type':'application/json', 'Content-Length':String(Buffer.byteLength(payload)) } : {}) } }, res => {
      let raw = '';
      res.setEncoding('utf8'); res.on('data', part => { raw += part; });
      res.on('end', () => {
        const status = Number(res.statusCode || 0);
        if (status < 200 || status >= 300) { reject(new Error(`Firebase HTTP ${status}`)); return; }
        try { resolve({ value:raw.trim() ? JSON.parse(raw) : null, etag:res.headers.etag }); }
        catch (_) { reject(new Error('Firebase devolvió JSON inválido.')); }
      });
    });
    req.setTimeout(60000, () => req.destroy(new Error('Firebase excedió 60 segundos.')));
    req.on('error', error => reject(new Error('No se pudo conectar con Firebase: ' + error.code)));
    if (payload) req.write(payload);
    req.end();
  });
}

async function conditionalReplace(relative, token, expected, mutate) {
  const current = await request('GET', relative, token, undefined, { 'X-Firebase-ETag':'true' });
  if (!current.etag || !expected(current.value)) return { ok:false, reason:'changed' };
  await request('PUT', relative, token, mutate(current.value), { 'if-match':current.etag });
  return { ok:true };
}

async function pool(items, worker, limit = 8) {
  let cursor = 0;
  const results = Array(items.length);
  await Promise.all(Array.from({ length:Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try { results[index] = await worker(items[index]); }
      catch (error) { results[index] = { ok:false, reason:error.message }; }
    }
  }));
  return results;
}

async function applyPlan(plan, state) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'paes-grades-backup-'));
  fs.writeFileSync(path.join(folder, 'before.json'), JSON.stringify({
    attempts:plan.attempts.map(op => ({ id:op.id, rut:op.rut, record:state.responses[op.id][op.rut] })),
    books:[...new Set(plan.notes.map(op => op.rut))].map(rut => ({ rut, book:state.books[rut] }))
  }), { mode:0o600 });
  const token = getAccessToken();
  const attemptResults = await pool(plan.attempts, async op => conditionalReplace(
    `guia_respuestas/${op.id}/${op.rut}`, token,
    value => digest(value) === op.expected && (submitted(op.id, value) || recoverableLegacyG10(op.id, value)) &&
      scoreChecked(op.id, value).matches,
    value => ({ ...value, grade:{ nota:op.grade,
      feedback:op.source === 'libro-vigente'
        ? `Se conserva la nota vigente del libro. Resultado de alternativas verificado: ${op.correct}/${op.total}.`
        : `Nota calculada con 60 % de exigencia desde ${op.correct}/${op.total} alternativas correctas.`,
      gradedBy:'revisión técnica PAES autorizada', gradedAt:Date.now(), modelo:MODEL, fuente:op.source } })
  ));
  const succeeded = new Set(plan.attempts.filter((_, index) => attemptResults[index].ok)
    .map(op => `${op.id}/${op.rut}`));
  const already = new Set();
  IDS.forEach(id => Object.entries(state.responses[id] || {}).forEach(([rut, record]) => {
    if (record && validGrade(record.grade && record.grade.nota)) already.add(`${id}/${rut}`);
  }));
  const noteGroups = new Map();
  plan.notes.forEach(op => {
    if (!succeeded.has(`${op.id}/${op.rut}`) && !already.has(`${op.id}/${op.rut}`)) return;
    if (!noteGroups.has(op.rut)) noteGroups.set(op.rut, []);
    noteGroups.get(op.rut).push(op);
  });
  const bookResults = await pool([...noteGroups.entries()], async ([rut, entries]) => conditionalReplace(
    `libro_notas/${rut}`, token,
    value => !!value && entries.every(op => String((value.notas || {})[op.id] ?? '') === String(op.before ?? '')),
    value => {
      const notas = { ...(value.notas || {}) };
      entries.forEach(op => { notas[op.id] = op.after; });
      return { ...value, notas, updatedAt:Date.now(), ultimaCalificacionModelo:MODEL };
    }
  ));
  return { backup:folder, attemptResults, bookResults, bookGroups:[...noteGroups.entries()] };
}

function summary(plan) {
  return { model:MODEL, guides:'G1–G19', excluded:['G20','G21'], checksum:plan.checksum,
    attemptGrades:plan.attempts.length, bookNotes:plan.notes.length,
    bookAdds:plan.notes.filter(op => op.before == null).length,
    bookChanges:plan.notes.filter(op => op.before != null).length,
    skipped:plan.skipped, byGuide:plan.byGuide };
}

async function main() {
  const state = await readState();
  const plan = buildPlan(state);
  const applyArg = process.argv.find(arg => arg.startsWith('--apply='));
  console.log(JSON.stringify({ mode:applyArg ? 'apply' : 'dry-run', ...summary(plan) }, null, 2));
  if (process.argv.includes('--probe-etag')) {
    const first = plan.attempts[0];
    if (!first) throw new Error('No hay intentos para probar la lectura condicional.');
    const probe = await request('GET', `guia_respuestas/${first.id}/${first.rut}`, getAccessToken(),
      undefined, { 'X-Firebase-ETag':'true' });
    console.log(JSON.stringify({ etagPresent:!!probe.etag, unchanged:digest(probe.value) === first.expected }));
    if (!probe.etag || digest(probe.value) !== first.expected) process.exitCode = 2;
    return;
  }
  if (!applyArg) return;
  if (applyArg.slice(8) !== plan.checksum) throw new Error('La simulación cambió. Revisa nuevamente antes de aplicar.');
  if (plan.skipped.invalidScore) throw new Error('Hay puntajes inválidos. No se escribirá nada.');
  const result = await applyPlan(plan, state);
  const reread = await readState();
  const verifiedAttempts = plan.attempts.filter((op, index) => result.attemptResults[index].ok &&
    validGrade(reread.responses[op.id] && reread.responses[op.id][op.rut] &&
      reread.responses[op.id][op.rut].grade && reread.responses[op.id][op.rut].grade.nota) === op.grade).length;
  const verifiedBookGroups = result.bookGroups.filter(([rut, entries], index) => result.bookResults[index].ok &&
    entries.every(op => validGrade(reread.books[rut] && reread.books[rut].notas &&
      reread.books[rut].notas[op.id]) === op.after)).length;
  console.log(JSON.stringify({ appliedAttempts:result.attemptResults.filter(x => x.ok).length,
    attemptedAttempts:result.attemptResults.length, appliedBooks:result.bookResults.filter(x => x.ok).length,
    attemptedBooks:result.bookResults.length, verifiedAttempts, verifiedBookGroups,
    conflicts:result.attemptResults.filter(x => !x.ok).length +
      result.bookResults.filter(x => !x.ok).length, backup:result.backup }, null, 2));
  if (result.attemptResults.some(x => !x.ok) || result.bookResults.some(x => !x.ok) ||
    verifiedAttempts !== result.attemptResults.filter(x => x.ok).length ||
    verifiedBookGroups !== result.bookResults.filter(x => x.ok).length) process.exitCode = 2;
}

if (require.main === module) main().catch(error => { console.error('GRADE_FAILED: ' + error.message); process.exitCode = 1; });
module.exports = { buildPlan, validGrade, summary };
