const path = require('path');
const https = require('https');
const crypto = require('crypto');

const dotenv = require('dotenv');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function normalizePrivateKey(raw) {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.includes('\\n')) {
    key = key.replace(/\\n/g, '\n');
  }
  const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
  if (packed) {
    const lines = packed[1].match(/.{1,64}/g) || [];
    key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
  }
  return key;
}

function loadEnv() {
  dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    throw new Error('Faltan credenciales Firebase en .env.local.');
  }
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
    databaseURL: (process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL).replace(/\/+$/, '')
  };
}

function loadSessionDefinitions() {
  const scriptPath = path.join(__dirname, '..', 'estudiantes', 'js', 'simce-preassigned-ensayos-2026.js');
  global.window = global.window || {};
  delete require.cache[require.resolve(scriptPath)];
  require(scriptPath);
  const sessions = global.window.SIMCE_PREASSIGNED_ENSAYOS_2026 || {};
  return JSON.parse(JSON.stringify(sessions));
}

function countParagraphs(textos) {
  return (textos || []).reduce((total, texto) => total + ((texto && texto.parrafos && texto.parrafos.length) || 0), 0);
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function requestJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const request = https.request(target, {
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (response) => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        raw += chunk;
      });
      response.on('end', () => {
        const statusCode = response.statusCode || 0;
        const isJson = String(response.headers['content-type'] || '').toLowerCase().includes('application/json');
        const body = raw.length
          ? (isJson ? JSON.parse(raw) : raw)
          : null;

        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
          return;
        }

        reject(new Error('HTTP ' + statusCode + ' @ ' + url + ': ' + (raw || 'sin cuerpo')));
      });
    });

    request.on('error', reject);
    if (options.body) {
      request.write(options.body);
    }
    request.end();
  });
}

function createServiceAccountJwt(env) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: env.clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const unsigned = encodedHeader + '.' + encodedClaimSet;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), env.privateKey);
  return unsigned + '.' + base64UrlEncode(signature);
}

async function fetchAccessToken(env) {
  const assertion = createServiceAccountJwt(env);
  const body = [
    'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer'),
    'assertion=' + encodeURIComponent(assertion)
  ].join('&');

  const response = await requestJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': String(Buffer.byteLength(body))
    },
    body
  });

  if (!response || !response.access_token) {
    throw new Error('No se pudo obtener access_token de Google OAuth.');
  }
  return response.access_token;
}

async function writeDatabaseValue(env, accessToken, dbPath, payload) {
  const url = env.databaseURL + '/' + dbPath + '.json?access_token=' + encodeURIComponent(accessToken);
  return requestJson(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(JSON.stringify(payload)))
    },
    body: JSON.stringify(payload)
  });
}

async function readDatabaseValue(env, accessToken, dbPath) {
  const url = env.databaseURL + '/' + dbPath + '.json?access_token=' + encodeURIComponent(accessToken);
  return requestJson(url);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const allDefinitions = loadSessionDefinitions();
  const env = loadEnv();
  const requestedSession = String(args.session || '').trim();
  const force = args.force === true;

  const sessionIds = requestedSession
    ? [requestedSession]
    : Object.keys(allDefinitions);

  if (!sessionIds.length) {
    throw new Error('No hay ensayos preasignados definidos.');
  }

  const accessToken = await fetchAccessToken(env);

  for (const sessionId of sessionIds) {
    const session = allDefinitions[sessionId];
    if (!session) {
      throw new Error('No existe definicion para la sesion ' + sessionId + '.');
    }

    const dbPath = BASE + '/sesiones/' + sessionId;
    const existing = await readDatabaseValue(env, accessToken, dbPath);
    if (existing && !force) {
      throw new Error('La sesion ' + sessionId + ' ya existe. Usa --force para sobrescribirla.');
    }

    const payload = {
      ...session,
      programa: session.programa || 'simce',
      panel_seccion: session.panel_seccion || 'ensayo',
      createdAt: Date.now()
    };

    await writeDatabaseValue(env, accessToken, dbPath, payload);

    const verify = await readDatabaseValue(env, accessToken, dbPath) || {};
    const textos = (verify.contenido && verify.contenido.textos) || verify.textos || [];
    const preguntas = (verify.contenido && verify.contenido.preguntas) || verify.preguntas || [];
    console.log([
      '[ok]',
      sessionId,
      'titulo="' + (verify.titulo || '') + '"',
      'asignados=' + JSON.stringify(verify.asignados || []),
      'textos=' + textos.length,
      'parrafos=' + countParagraphs(textos),
      'preguntas=' + preguntas.length,
      'tiempo=' + (verify.tiempo_limite || 0)
    ].join(' '));
  }
}

main().catch((error) => {
  console.error('[error]', error && error.message ? error.message : error);
  process.exitCode = 1;
});