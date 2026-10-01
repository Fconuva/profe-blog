/* Abre solo el reenvío G10–G19 hasta el 8-oct-2026 inclusive.
 * Dry-run por defecto; aplica con --apply=CHECKSUM y ETag, conservando el resto.
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
const FIRST = 10;
const LAST = 19;
const CLOSES = '2026-10-09'; // Primer día cerrado, 00:00 de Chile.
const TARGET = Array.from({ length:LAST - FIRST + 1 }, (_, index) => 'g' + (FIRST + index));

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

function plan(config) {
  const original = config || {};
  const current = original.reenvio || {};
  const reenvio = Object.fromEntries(Object.entries(current).filter(([id, on]) =>
    !['g20', 'g21'].includes(id) && on === true));
  TARGET.forEach(id => { reenvio[id] = true; });
  const toOpen = TARGET.filter(id => current[id] !== true);
  const toClose = ['g20', 'g21'].filter(id => current[id] === true);
  const changed = toOpen.length > 0 || toClose.length > 0 || original.reenvio_cierra !== CLOSES;
  const next = changed ? { ...original, reenvio, reenvio_cierra:CLOSES,
    updatedAt:Date.now(), updatedBy:'docente: reenvío PAES G10-G19 hasta 08-10' } : original;
  return { original, next, changed, toOpen, toClose,
    checksum:hash({ current, close:original.reenvio_cierra || null, toOpen, toClose }) };
}

async function main() {
  const token = getAccessToken();
  const before = await request('GET', token, undefined, { 'X-Firebase-ETag':'true' });
  if (!before.etag) throw new Error('Firebase no entregó ETag; no se escribirá.');
  const draft = plan(before.value);
  const apply = process.argv.find(arg => arg.startsWith('--apply='));
  console.log(JSON.stringify({ mode:apply ? 'apply' : 'dry-run',
    window:'G10–G19 hasta 2026-10-08 inclusive', closeDate:CLOSES,
    toOpen:draft.toOpen, toClose:draft.toClose, checksum:draft.checksum }, null, 2));
  if (!apply) return;
  if (apply.slice(8) !== draft.checksum) throw new Error('La simulación cambió; revisa antes de aplicar.');
  if (!draft.changed) { console.log('Sin cambios.'); return; }
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'paes-reenvio-config-backup-'));
  fs.writeFileSync(path.join(folder, 'before.json'), JSON.stringify(draft.original), { mode:0o600 });
  await request('PUT', token, draft.next, { 'if-match':before.etag });
  const after = (await request('GET', token)).value || {};
  if (after.reenvio_cierra !== CLOSES || TARGET.some(id => after.reenvio?.[id] !== true) ||
    ['g20','g21'].some(id => after.reenvio?.[id] === true)) {
    throw new Error('La relectura no confirma la ventana exacta solicitada.');
  }
  for (const key of ['blocked','exceptions','bloqueo_programado']) {
    if (hash(after[key] || null) !== hash(draft.original[key] || null)) {
      throw new Error('La relectura detectó un cambio ajeno en ' + key + '.');
    }
  }
  console.log(JSON.stringify({ verifiedOpen:TARGET.length, verifiedClosedFrom2026_10_09:true, backup:folder }, null, 2));
}

if (require.main === module) main().catch(error => {
  console.error('OPEN_REENVIO_FAILED: ' + error.message); process.exitCode = 1;
});

module.exports = { plan, TARGET, CLOSES };
