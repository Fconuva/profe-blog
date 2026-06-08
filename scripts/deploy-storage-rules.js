// Publica storage.rules en Firebase Storage usando la cuenta de servicio
// (Firebase Security Rules API). No requiere Firebase CLI ni login interactivo.
//   node scripts/deploy-storage-rules.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

function loadEnv() {
  const env = {};
  const file = path.join(ROOT, '.env.local');
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach(function (line) {
    const i = line.indexOf('=');
    if (i < 0 || line.trim().startsWith('#')) return;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    env[k] = v;
  });
  return env;
}

function loadSA(raw) {
  return raw.trim().startsWith('{') ? JSON.parse(raw) : JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
}

async function getToken(sa, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email, sub: sa.client_email, scope: scope,
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600
  })).toString('base64url');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(header + '.' + payload);
  const signature = sign.sign(sa.private_key, 'base64url');
  const jwt = header + '.' + payload + '.' + signature;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt
  });
  if (!r.ok) throw new Error('token ' + r.status + ': ' + (await r.text()));
  return (await r.json()).access_token;
}

(async function () {
  const env = loadEnv();
  const project = env.FIREBASE_PROJECT_ID;
  const bucket = env.FIREBASE_STORAGE_BUCKET || 'profe-blog.firebasestorage.app';
  const saRaw = env.FIREBASE_SERVICE_ACCOUNT_BASE64 || env.FIREBASE_SERVICE_ACCOUNT;
  if (!project || !saRaw) throw new Error('Faltan FIREBASE_PROJECT_ID o cuenta de servicio en .env.local');
  const sa = loadSA(saRaw);
  const rules = fs.readFileSync(path.join(ROOT, 'storage.rules'), 'utf8');

  console.log('Proyecto:', project, '| Bucket:', bucket, '| SA:', sa.client_email);
  const token = await getToken(sa, 'https://www.googleapis.com/auth/cloud-platform');
  const base = 'https://firebaserules.googleapis.com/v1/projects/' + project;

  // 1) Crear ruleset (tambien valida la sintaxis)
  let r = await fetch(base + '/rulesets', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: { files: [{ name: 'storage.rules', content: rules }] } })
  });
  let t = await r.text();
  if (!r.ok) throw new Error('createRuleset ' + r.status + ': ' + t);
  const rulesetName = JSON.parse(t).name;
  console.log('Ruleset creado:', rulesetName);

  // 2) Ubicar la release de Storage existente (para reutilizar su nombre exacto)
  let storageReleases = [];
  r = await fetch(base + '/releases?pageSize=100', { headers: { Authorization: 'Bearer ' + token } });
  t = await r.text();
  if (r.ok) {
    storageReleases = (JSON.parse(t).releases || []).filter(function (x) { return /\/releases\/firebase\.storage\//.test(x.name); });
  } else {
    console.warn('Aviso: no se pudo listar releases (' + r.status + '); uso nombre por convencion.');
  }
  // Candidatos de bucket (nuevo .firebasestorage.app y el clasico .appspot.com)
  const buckets = [bucket, project + '.appspot.com', project + '.firebasestorage.app'];
  let releaseName = storageReleases.length
    ? storageReleases[0].name
    : ('projects/' + project + '/releases/firebase.storage/' + buckets[0]);
  console.log('Release de Storage:', releaseName, storageReleases.length ? '(existente)' : '(por convencion)');

  // 3) Apuntar la release al nuevo ruleset. Si no existe la conocida, probar variantes.
  const candidates = [];
  candidates.push(releaseName);
  buckets.forEach(function (b) {
    const n = 'projects/' + project + '/releases/firebase.storage/' + b;
    if (candidates.indexOf(n) === -1) candidates.push(n);
  });

  let published = null, lastErr = '';
  for (const name of candidates) {
    // PATCH (actualizar si ya existe)
    let rr = await fetch('https://firebaserules.googleapis.com/v1/' + name, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ release: { name: name, rulesetName: rulesetName } })
    });
    let tt = await rr.text();
    console.log('  PATCH', name, '->', rr.status);
    if (rr.ok) { published = name + ' (actualizada)'; break; }
    lastErr = 'PATCH ' + name + ' -> ' + rr.status + ': ' + tt.replace(/\s+/g, ' ').slice(0, 200);
    // POST (crear si no existe)
    rr = await fetch(base + '/releases', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, rulesetName: rulesetName })
    });
    tt = await rr.text();
    console.log('  POST ', name, '->', rr.status);
    if (rr.ok) { published = name + ' (creada)'; break; }
    lastErr = 'POST ' + name + ' -> ' + rr.status + ': ' + tt.replace(/\s+/g, ' ').slice(0, 200);
  }
  if (!published) throw new Error('No se pudo publicar la release. Ultimo error: ' + lastErr);
  console.log('Release publicada:', published);
  console.log('\nOK ✅ Reglas de Storage publicadas en produccion.');
})().catch(function (e) {
  console.error('\nFALLO ❌', e.message);
  process.exit(1);
});
