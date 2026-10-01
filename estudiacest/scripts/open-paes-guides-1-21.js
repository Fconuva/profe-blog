/* Abre G1–G21 sin tocar otras guías, excepciones, reenvíos ni notas.
 * Simulación predeterminada; --apply=CHECKSUM exige una relectura idéntica.
 */
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const https = require('node:https');
const os = require('node:os');
const path = require('node:path');
const { getAccessToken } = require('./firebase-maintenance-db');

const DATABASE = 'https://estudiacest-default-rtdb.firebaseio.com';
const CONFIG_PATH = 'plataforma_paes/guias_config';
const GUIDE_IDS = Array.from({ length:21 }, (_, index) => 'g' + (index + 1));
const LATER_IDS = [
  ...Array.from({ length:10 }, (_, index) => 'g' + (index + 22)),
  'g4pie', 'g6pie', 'g7pie', 'g8pie', 'retro'
];

function hash(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function request(method, token, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${DATABASE}/${CONFIG_PATH}.json`);
    url.searchParams.set('access_token', token);
    const payload = body === undefined ? null : JSON.stringify(body);
    const req = https.request(url, { method, headers:{ ...headers,
      ...(payload === null ? {} : { 'Content-Type':'application/json',
        'Content-Length':String(Buffer.byteLength(payload)) }) } }, response => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', part => { raw += part; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error('Firebase HTTP ' + response.statusCode)); return;
        }
        try { resolve({ value:raw.trim() ? JSON.parse(raw) : null, etag:response.headers.etag }); }
        catch (_) { reject(new Error('Firebase devolvió JSON inválido.')); }
      });
    });
    req.setTimeout(60000, () => req.destroy(new Error('Tiempo de espera de Firebase agotado.')));
    req.on('error', error => reject(new Error('Conexión Firebase: ' + (error.code || error.message))));
    if (payload !== null) req.write(payload);
    req.end();
  });
}

function plan(config, onlyFirst21 = false) {
  const original = config || {};
  const blocked = original.blocked || {};
  const openBefore = GUIDE_IDS.filter(id => blocked[id] !== true);
  const toOpen = GUIDE_IDS.filter(id => blocked[id] === true);
  const retained = Object.fromEntries(Object.entries(blocked).filter(([id, value]) =>
    !GUIDE_IDS.includes(id) && value === true));
  const toBlock = onlyFirst21 ? LATER_IDS.filter(id => retained[id] !== true) : [];
  if (onlyFirst21) LATER_IDS.forEach(id => { retained[id] = true; });
  const schedule = original.bloqueo_programado || {};
  const scheduleDue = /^\d{4}-\d{2}-\d{2}$/.test(String(schedule.fecha || '')) &&
    schedule.fecha <= new Date().toLocaleDateString('en-CA', { timeZone:'America/Santiago' }) &&
    schedule.aplicado !== true;
  const changed = toOpen.length > 0 || toBlock.length > 0 || scheduleDue;
  const next = changed ? { ...original, blocked:Object.keys(retained).length ? retained : null,
    updatedAt:Date.now(), updatedBy:onlyFirst21 ? 'docente: solo G1-G21' : 'docente: habilitar G1-G21' } : original;
  if (scheduleDue) next.bloqueo_programado = { ...schedule, aplicado:true, aplicadoAt:Date.now() };
  return { original, next, changed, toOpen, toBlock, openBefore, retained:Object.keys(retained),
    scheduleDue, scheduleApplied:schedule.aplicado === true,
    checksum:hash({ blocked, schedule, toOpen, toBlock, retained, onlyFirst21 }) };
}

async function main() {
  const token = getAccessToken();
  const before = await request('GET', token, undefined, { 'X-Firebase-ETag':'true' });
  if (!before.etag) throw new Error('Firebase no entregó ETag; no se escribirá.');
  const onlyFirst21 = process.argv.includes('--only-first-21');
  const draft = plan(before.value, onlyFirst21);
  console.log(JSON.stringify({ mode:process.argv.some(arg => arg.startsWith('--apply=')) ? 'apply' : 'dry-run',
    requested:onlyFirst21 ? 'Solo G1–G21' : 'Abrir G1–G21',
    toOpen:draft.toOpen, toBlock:draft.toBlock, alreadyOpen:draft.openBefore.length,
    otherBlockedRetained:draft.retained, scheduledLockDue:draft.scheduleDue,
    scheduledLockAlreadyApplied:draft.scheduleApplied,
    lastEditedByThisScript:/^docente: (habilitar|solo) G1-G21$/.test(before.value?.updatedBy || ''),
    lastEditedAt:before.value?.updatedAt || null, checksum:draft.checksum }, null, 2));
  const apply = process.argv.find(arg => arg.startsWith('--apply='));
  if (!apply) return;
  if (apply.slice(8) !== draft.checksum) throw new Error('La simulación cambió; revisa antes de aplicar.');
  if (!draft.changed) { console.log('Sin cambios: G1–G21 ya están habilitadas.'); return; }
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'paes-guide-config-backup-'));
  fs.writeFileSync(path.join(folder, 'before.json'), JSON.stringify(draft.original), { mode:0o600 });
  await request('PUT', token, draft.next, { 'if-match':before.etag });
  const after = (await request('GET', token)).value || {};
  if (GUIDE_IDS.some(id => after.blocked && after.blocked[id] === true)) {
    throw new Error('La relectura todavía muestra guías G1–G21 bloqueadas.');
  }
  if (onlyFirst21 && LATER_IDS.some(id => !after.blocked || after.blocked[id] !== true)) {
    throw new Error('La relectura todavía muestra alguna guía posterior o PIE habilitada.');
  }
  if (hash(after.exceptions || {}) !== hash(draft.original.exceptions || {}) ||
    hash(after.reenvio || {}) !== hash(draft.original.reenvio || {}) ||
    hash(after.bloqueo_programado && after.bloqueo_programado.guias || {}) !==
    hash(draft.original.bloqueo_programado && draft.original.bloqueo_programado.guias || {})) {
    throw new Error('La relectura detectó un cambio fuera del bloqueo solicitado.');
  }
  console.log(JSON.stringify({ verifiedOpen:GUIDE_IDS.length,
    verifiedBlocked:onlyFirst21 ? LATER_IDS.length : undefined,
    otherBlockedRetained:Object.keys(after.blocked || {}).filter(id => !GUIDE_IDS.includes(id)).length,
    backup:folder }, null, 2));
}

if (require.main === module) main().catch(error => {
  console.error('OPEN_PAES_GUIDES_FAILED: ' + error.message);
  process.exitCode = 1;
});

module.exports = { plan, GUIDE_IDS, LATER_IDS };
