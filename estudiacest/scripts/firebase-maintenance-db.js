'use strict';

const https = require('https');
const path = require('path');
const { spawnSync } = require('child_process');

const BASE_PATH = 'plataforma_estudiantes';
const DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const DEFAULT_TIMEOUT_MS = 60000;

function firebaseCommand(args) {
  const windowsCli = path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'firebase-tools', 'lib', 'bin', 'firebase.js');
  const executable = process.platform === 'win32' ? process.execPath : 'firebase';
  const cliArgs = process.platform === 'win32' ? [windowsCli, ...args] : args;
  const result = spawnSync(executable, cliArgs, { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) throw new Error('No se pudo usar la sesión autenticada de Firebase CLI.');
  return result.stdout;
}

function getAccessToken() {
  const login = JSON.parse(firebaseCommand(['login:list', '--json']));
  const accounts = Array.isArray(login.result) ? login.result : [];
  const account = accounts.find(item => item && item.tokens && item.tokens.access_token);
  if (!account) throw new Error('Firebase CLI no tiene una sesión autenticada disponible.');
  return account.tokens.access_token;
}

function requestJson(method, relativePath, accessToken, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${DATABASE_URL}/${relativePath}.json`);
    url.searchParams.set('access_token', accessToken);
    const payload = body === undefined ? null : JSON.stringify(body);
    const request = https.request(url, {
      method,
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': String(Buffer.byteLength(payload))
      } : undefined
    }, response => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { raw += chunk; });
      response.on('end', () => {
        const statusCode = Number(response.statusCode || 0);
        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`Firebase respondió HTTP ${statusCode}.`));
          return;
        }
        try {
          resolve(raw.trim() ? JSON.parse(raw) : null);
        } catch (_) {
          reject(new Error('Firebase devolvió una respuesta JSON inválida.'));
        }
      });
    });
    request.setTimeout(DEFAULT_TIMEOUT_MS, () => request.destroy(new Error(`La solicitud superó ${DEFAULT_TIMEOUT_MS} ms.`)));
    request.on('error', reject);
    if (payload) request.write(payload);
    request.end();
  });
}

async function readPlatform() {
  return await requestJson('GET', BASE_PATH, getAccessToken()) || {};
}

async function updatePlatform(update) {
  await requestJson('PATCH', BASE_PATH, getAccessToken(), update);
}

async function closeFirebase() {}

module.exports = { BASE_PATH, closeFirebase, getAccessToken, readPlatform, requestJson, updatePlatform };
