const path = require('path');
const https = require('https');
const crypto = require('crypto');

const dotenv = require('dotenv');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes';
const TARGET_SESSION_IDS = [
  'ensayo-simce-miercoles-2a-hc-2026',
  'ensayo-simce-miercoles-2b-hc-2026'
];

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
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
    databaseURL: (process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL).replace(/\/+$/, '')
  };
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
      response.on('data', chunk => { raw += chunk; });
      response.on('end', () => {
        const statusCode = response.statusCode || 0;
        const isJson = String(response.headers['content-type'] || '').toLowerCase().includes('application/json');
        const body = raw.length ? (isJson ? JSON.parse(raw) : raw) : null;
        if (statusCode >= 200 && statusCode < 300) {
          resolve(body);
          return;
        }
        reject(new Error('HTTP ' + statusCode + ' @ ' + url + ': ' + (raw || 'sin cuerpo')));
      });
    });
    request.on('error', reject);
    if (options.body) request.write(options.body);
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
  const unsigned = base64UrlEncode(JSON.stringify(header)) + '.' + base64UrlEncode(JSON.stringify(claimSet));
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), env.privateKey);
  return unsigned + '.' + base64UrlEncode(signature);
}

async function fetchAccessToken(env) {
  const body = [
    'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer'),
    'assertion=' + encodeURIComponent(createServiceAccountJwt(env))
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
    throw new Error('No se pudo obtener access_token.');
  }
  return response.access_token;
}

async function readDatabaseValue(env, accessToken, dbPath) {
  const url = env.databaseURL + '/' + dbPath + '.json?access_token=' + encodeURIComponent(accessToken);
  return requestJson(url);
}

async function patchDatabaseValue(env, accessToken, dbPath, updates) {
  const body = JSON.stringify(updates);
  const url = env.databaseURL + '/' + dbPath + '.json?access_token=' + encodeURIComponent(accessToken);
  return requestJson(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body))
    },
    body
  });
}

function isSessionAssignedToStudent(session, uid, curso) {
  if (!session || !Array.isArray(session.asignados) || !session.asignados.length) return true;
  return session.asignados.includes(uid) || session.asignados.includes(curso);
}

function pickStudentByCourse(students, course) {
  return Object.entries(students || {})
    .map(([uid, student]) => ({ uid, ...student }))
    .find(student => String(student.curso || '').trim().toUpperCase() === course);
}

async function main() {
  const env = loadEnv();
  const accessToken = await fetchAccessToken(env);
  const [students, sessions] = await Promise.all([
    readDatabaseValue(env, accessToken, BASE + '/estudiantes'),
    readDatabaseValue(env, accessToken, BASE + '/sesiones')
  ]);

  const repairArgIndex = process.argv.indexOf('--repair-session');
  const repairSession = repairArgIndex >= 0 ? String(process.argv[repairArgIndex + 1] || '').trim() : '';
  if (repairSession) {
    const responses = await readDatabaseValue(env, accessToken, `${BASE}/respuestas/${repairSession}`) || {};
    const baseKeys = ['C','A','D','B','D','A','B','D','A','C','B','D','A','C','B','A','C','B','B','C','A','D','B','C','A','D','B','C','D','A'];
    const letterMaps = [
      { A:'A', B:'B', C:'C', D:'D' },
      { A:'B', B:'C', C:'D', D:'A' },
      { A:'C', B:'D', C:'A', D:'B' },
      { A:'D', B:'A', C:'B', D:'C' }
    ];
    const hashUid = uid => {
      let hash = 0;
      for (const character of uid) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
      return hash;
    };
    const scoreResponse = (uid, response) => {
      const letterMap = letterMaps[hashUid(uid) % letterMaps.length];
      return baseKeys.reduce((score, key, index) => score + (response.answers && response.answers[`q${index + 1}`] === letterMap[key] ? 1 : 0), 0);
    };
    const isStructurallyComplete = response => {
      const matching = response && response.concepts && response.concepts.matching;
      const tf = response && response.concepts && response.concepts.tf;
      const meta = (response && response.meta) || {};
      return response
        && Object.keys(response.answers || {}).length >= 30
        && String(response.open || '').trim().length >= 40
        && ['m1', 'm2', 'm3'].every(key => String(meta[key] || '').trim().length >= 12)
        && Array.isArray(matching) && matching.length >= 6 && matching.every(value => String(value) !== '')
        && Array.isArray(tf) && tf.length >= 6 && tf.every(value => value === '0' || value === '1');
    };
    const pending = Object.entries(responses).filter(([, response]) => response && response.completada !== true && (response.submitted === true || isStructurallyComplete(response)));
    const missingScores = Object.entries(responses).filter(([, response]) => response && response.completada === true && isStructurallyComplete(response) && typeof response.score !== 'number');
    const candidates = [...new Map([...pending, ...missingScores].map(entry => [entry[0], entry])).values()];
    const updates = {};
    candidates.forEach(([uid, response]) => {
      updates[`${uid}/completada`] = true;
      updates[`${uid}/completadaAt`] = response.submittedAt || response.updatedAt || Date.now();
      updates[`${uid}/submitted`] = true;
      updates[`${uid}/submittedAt`] = response.submittedAt || response.updatedAt || Date.now();
      updates[`${uid}/score`] = typeof response.score === 'number' ? response.score : scoreResponse(uid, response);
      updates[`${uid}/total`] = 30;
    });
    const apply = process.argv.includes('--apply');
    if (apply && candidates.length) {
      await patchDatabaseValue(env, accessToken, `${BASE}/respuestas/${repairSession}`, updates);
    }
    console.log(JSON.stringify({
      session: repairSession,
      detected: pending.length,
      submittedWithoutCompletion: pending.filter(([, response]) => response.submitted === true).length,
      completeDrafts: pending.filter(([, response]) => response.submitted !== true && isStructurallyComplete(response)).length,
      missingScores: missingScores.length,
      repaired: apply ? candidates.length : 0,
      uids: candidates.map(([uid]) => uid)
    }, null, 2));
    return;
  }

  const courseArgIndex = process.argv.indexOf('--course');
  const courseQuery = courseArgIndex >= 0 ? String(process.argv[courseArgIndex + 1] || '').trim().toUpperCase() : '';
  if (courseQuery) {
    const roster = Object.entries(students || {})
      .map(([uid, student]) => ({ uid, ...student }))
      .filter(student => String(student.curso || '').trim().toUpperCase() === courseQuery);
    const activeSessions = Object.entries(sessions || {})
      .filter(([, session]) => session && session.activa === true)
      .map(([id, session]) => ({ id, ...session }));
    const issues = roster.flatMap(student => {
      const studentIssues = [];
      if (!student.rut) studentIssues.push('sin RUT');
      if (String(student.programa || 'simce').toLowerCase() !== 'simce') studentIssues.push('programa distinto de simce');
      if (!student.perfil_completo) studentIssues.push('perfil incompleto');
      if (!activeSessions.some(session => isSessionAssignedToStudent(session, student.uid, student.curso))) {
        studentIssues.push('sin sesión activa visible');
      }
      return studentIssues.length ? [{ uid: student.uid, nombre: student.nombre, rut: student.rut, issues: studentIssues }] : [];
    });
    console.log(JSON.stringify({ course: courseQuery, total: roster.length, activeSessions: activeSessions.map(s => s.id), issues }, null, 2));
    return;
  }

  const nameArgIndex = process.argv.indexOf('--name');
  const nameQuery = nameArgIndex >= 0 ? String(process.argv[nameArgIndex + 1] || '').trim().toUpperCase() : '';
  if (nameQuery) {
    const matches = Object.entries(students || {})
      .map(([uid, student]) => ({ uid, ...student }))
      .filter(student => String(student.nombre || '').toUpperCase().includes(nameQuery));
    const report = matches.map(student => ({
      student,
      visibleSessions: Object.entries(sessions || {})
        .filter(([, session]) => isSessionAssignedToStudent(session, student.uid, student.curso))
        .map(([id, session]) => ({
          id,
          titulo: session.titulo || session.title || '',
          estado: session.estado || '',
          activa: session.activa,
          asignados: session.asignados || []
        }))
    }));
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const targetSessions = TARGET_SESSION_IDS
    .map(id => ({ id, ...(sessions && sessions[id] ? sessions[id] : null) }))
    .filter(session => session && session.titulo);

  if (targetSessions.length !== TARGET_SESSION_IDS.length) {
    throw new Error('No se encontraron todas las sesiones objetivo en Firebase.');
  }

  const samples = ['2A-HC', '2B-HC']
    .map(course => ({ course, student: pickStudentByCourse(students, course) }));

  samples.forEach(sample => {
    if (!sample.student) {
      console.log('[warn] sin estudiante para curso=' + sample.course);
      return;
    }

    const visible = targetSessions
      .filter(session => isSessionAssignedToStudent(session, sample.student.uid, sample.student.curso))
      .map(session => session.id);

    console.log([
      '[check]',
      'curso=' + sample.student.curso,
      'uid=' + sample.student.uid,
      'nombre="' + String(sample.student.nombre || '').replace(/"/g, '\\"') + '"',
      'visible=' + JSON.stringify(visible)
    ].join(' '));
  });
}

main().catch(error => {
  console.error('[error]', error && error.message ? error.message : error);
  process.exitCode = 1;
});
