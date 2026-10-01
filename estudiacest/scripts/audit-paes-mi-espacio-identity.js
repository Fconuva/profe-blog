/* Auditoría de identidad PAES para Mi espacio. Solo lectura; salida agregada sin RUT, UID ni nombres. */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const https = require('node:https');
const { isDeepStrictEqual } = require('node:util');
const { getAccessToken, requestJson } = require('./firebase-maintenance-db');

const CURSOS = new Set(['3°A HC', '3°B HC', '4°A HC', '4°B HC']);
const cleanRut = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
const cleanCourse = value => String(value || '').replace(/[^0-9A-Z]/gi, '').toUpperCase();
const platformCourse = value => cleanCourse(value).replace(/^([34])([AB])HC$/, '$1$2-HC');
const emailOf = rut => `${cleanRut(rut).toLowerCase()}@est.estudiacest.com`;

function lookupAuth(emails, token) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ email:emails });
    const req = https.request('https://identitytoolkit.googleapis.com/v1/projects/estudiacest/accounts:lookup', {
      method:'POST', headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json',
        'Content-Length':Buffer.byteLength(payload) }
    }, response => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { raw += chunk; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Auth respondió HTTP ${response.statusCode}.`)); return;
        }
        try { resolve(JSON.parse(raw || '{}').users || []); }
        catch (_) { reject(new Error('Auth devolvió JSON inválido.')); }
      });
    });
    req.setTimeout(30000, () => req.destroy(new Error('Auth agotó el tiempo de espera.')));
    req.on('error', reject);
    req.end(payload);
  });
}

function authWrite(suffix, token, body, apiKey) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://identitytoolkit.googleapis.com/v1/projects/estudiacest/accounts${suffix}`);
    if (apiKey) url.searchParams.set('key', apiKey);
    const payload = JSON.stringify(body);
    const req = https.request(url, { method:'POST', headers:{ Authorization:`Bearer ${token}`,
      'Content-Type':'application/json', 'Content-Length':Buffer.byteLength(payload) } }, response => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { raw += chunk; });
      response.on('end', () => {
        const status = Number(response.statusCode || 0);
        if (status < 200 || status >= 300) {
          let code = '';
          try {
            const issue = JSON.parse(raw || '{}').error || {};
            code = `${issue.status || ''} ${issue.message || ''}`
              .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '[correo]')
              .replace(/AIza[A-Za-z0-9_-]+/g, '[clave]')
              .replace(/\b\d{7,9}-?[0-9K]\b/gi, '[rut]').slice(0, 160);
          }
          catch (_) {}
          reject(new Error(`Auth respondió HTTP ${status}${code ? ` (${code})` : ''}.`)); return;
        }
        try { resolve(JSON.parse(raw || '{}')); }
        catch (_) { reject(new Error('Auth devolvió JSON inválido.')); }
      });
    });
    req.setTimeout(30000, () => req.destroy(new Error('Auth agotó el tiempo de espera.')));
    req.on('error', reject);
    req.end(payload);
  });
}

function rutValido(raw) {
  const rut = cleanRut(raw);
  if (!/^\d{7,8}[0-9K]$/.test(rut)) return false;
  const cuerpo = rut.slice(0, -1).split('').reverse().map(Number);
  const resto = 11 - (cuerpo.reduce((suma, digito, i) => suma + digito * (i % 6 + 2), 0) % 11);
  const dv = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === rut.at(-1);
}

function dbConditional(method, relative, token, value, etag) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://estudiacest-default-rtdb.firebaseio.com/${relative}.json`);
    url.searchParams.set('access_token', token);
    const payload = value === undefined ? null : JSON.stringify(value);
    const headers = method === 'GET' ? { 'X-Firebase-ETag':'true' } : { 'if-match':etag,
      'Content-Type':'application/json', 'Content-Length':Buffer.byteLength(payload) };
    const req = https.request(url, { method, headers }, response => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { raw += chunk; });
      response.on('end', () => {
        const status = Number(response.statusCode || 0);
        if (status < 200 || status >= 300) { reject(new Error(`RTDB respondió HTTP ${status}.`)); return; }
        try { resolve({ value:JSON.parse(raw || 'null'), etag:response.headers.etag }); }
        catch (_) { reject(new Error('RTDB devolvió JSON inválido.')); }
      });
    });
    req.setTimeout(30000, () => req.destroy(new Error('RTDB agotó el tiempo de espera.')));
    req.on('error', reject);
    req.end(payload || undefined);
  });
}

async function main() {
  const source = fs.readFileSync(path.join(__dirname, '..', 'paes/js/nominas.js'), 'utf8');
  const allRoster = vm.runInNewContext(`${source}\nNOMINAS_PAES`, {}).filter(item => !item.es_prueba);
  const roster = allRoster.filter(item => CURSOS.has(item.curso));
  const token = getAccessToken();
  const [profiles, books] = await Promise.all([
    requestJson('GET', 'plataforma_estudiantes/estudiantes', token),
    requestJson('GET', 'plataforma_paes/libro_notas', token)
  ]);
  const allProfiles = profiles || {};
  const paesBooks = books || {};
  const byRut = new Map();
  for (const [uid, profile] of Object.entries(allProfiles)) {
    const rut = cleanRut(profile && profile.rut);
    if (!rut) continue;
    if (!byRut.has(rut)) byRut.set(rut, []);
    byRut.get(rut).push({ uid, profile });
  }
  const authByEmail = new Map();
  for (let offset = 0; offset < roster.length; offset += 100) {
    const emails = roster.slice(offset, offset + 100).map(item => emailOf(item.rut));
    const users = await lookupAuth(emails, token);
    for (const user of users) authByEmail.set(user.email.toLowerCase(), user);
  }
  const summary = { roster:roster.length, ready:0, courseSwap:0, programOnly:0,
    missingProfileAuthExists:0, missingProfileAuthMissing:0, profileNoAuth:0,
    profileUidMismatch:0, duplicateProfiles:0, authNameMismatch:0, disabledAccount:0, byCourse:{} };
  const normalizedName = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
  const swaps = [];
  const missing = [];
  const recoverDisabled = [];
  const duplicateCandidates = [];
  for (const item of roster) {
    const counts = summary.byCourse[item.curso] ||= { roster:0, ready:0, courseSwap:0,
      missingProfileAuthExists:0, missingProfileAuthMissing:0, blocked:0 };
    counts.roster++;
    const matches = byRut.get(cleanRut(item.rut)) || [];
    const user = authByEmail.get(emailOf(item.rut));
    if (matches.length > 1) {
      summary.duplicateProfiles++; counts.blocked++;
      duplicateCandidates.push({ matches, user });
      continue;
    }
    if (!matches.length) {
      if (!user) { summary.missingProfileAuthMissing++; counts.missingProfileAuthMissing++; }
      else if (allProfiles[user.localId]) { summary.profileUidMismatch++; counts.blocked++; }
      else if (user.displayName && normalizedName(user.displayName) !== normalizedName(item.nombre)) {
        summary.authNameMismatch++; counts.blocked++;
      } else { summary.missingProfileAuthExists++; counts.missingProfileAuthExists++; }
      if (!user) missing.push(item);
      continue;
    }
    if (!user) { summary.profileNoAuth++; counts.blocked++; continue; }
    if (matches[0].uid !== user.localId) { summary.profileUidMismatch++; counts.blocked++; continue; }
    if (user.disabled === true) {
      summary.disabledAccount++; counts.blocked++;
      if (matches[0].profile.createdBy === 'paes-mi-espacio-regularizacion' &&
          cleanCourse(matches[0].profile.curso) === cleanCourse(item.curso) &&
          cleanCourse((paesBooks[cleanRut(item.rut)] || {}).curso) === cleanCourse(item.curso)) {
        recoverDisabled.push({ uid:user.localId, email:user.email });
      }
      continue;
    }
    if (cleanCourse(matches[0].profile.curso) !== cleanCourse(item.curso)) {
      if (matches[0].profile.programa !== 'paes' ||
          !(['3AHC', '3BHC'].includes(cleanCourse(item.curso)) &&
            ['3AHC', '3BHC'].includes(cleanCourse(matches[0].profile.curso)))) {
        counts.blocked++; continue;
      }
      swaps.push({ uid:matches[0].uid, before:matches[0].profile, curso:platformCourse(item.curso) });
      summary.courseSwap++; counts.courseSwap++; continue;
    }
    if (matches[0].profile.programa !== 'paes') { summary.programOnly++; counts.blocked++; continue; }
    summary.ready++; counts.ready++;
  }
  const missingReasons = { invalidRut:0, rosterDuplicate:0, bookMismatch:0, profileCollision:0 };
  const missingEligible = missing.filter(item => {
    const rut = cleanRut(item.rut), email = emailOf(rut);
    const unique = allRoster.filter(row => cleanRut(row.rut) === rut).length === 1;
    const bookOK = cleanCourse((paesBooks[rut] || {}).curso) === cleanCourse(item.curso);
    const collides = Object.values(allProfiles).some(profile =>
      String((profile || {}).email || '').toLowerCase() === email);
    if (!rutValido(rut)) missingReasons.invalidRut++;
    if (!unique) missingReasons.rosterDuplicate++;
    if (!bookOK) missingReasons.bookMismatch++;
    if (collides) missingReasons.profileCollision++;
    return rutValido(rut) && unique && bookOK && !collides;
  });
  summary.missingEligible = missingEligible.length;
  summary.missingReasons = missingReasons;
  if (duplicateCandidates.length) {
    const [avatars, tasks] = await Promise.all([
      requestJson('GET', 'plataforma_estudiantes/avatar', token),
      requestJson('GET', 'plataforma_estudiantes/tareas', token)
    ]);
    const allAvatars = avatars || {}, allTasks = tasks || {};
    summary.duplicateAnalysis = duplicateCandidates.map(candidate => {
      const selected = candidate.matches.find(match => candidate.user && match.uid === candidate.user.localId);
      const other = candidate.matches.find(match => !selected || match.uid !== selected.uid);
      const info = match => {
        const avatar = allAvatars[match.uid] || {};
        return { course:match.profile.curso,
          avatarExists:!!allAvatars[match.uid],
          furnitureCount:Array.isArray(avatar.pieza) ? avatar.pieza.length : 0,
          giftCount:Object.keys(avatar.regalos || {}).length,
          taskCount:Object.values(allTasks).filter(byUid => byUid && byUid[match.uid]).length };
      };
      return { authUidMatchesProfile:!!selected, authEnabled:!!(candidate.user && candidate.user.disabled !== true),
        authProfile:selected ? info(selected) : null, otherProfile:other ? info(other) : null,
        otherCouldAppearInVisits:!!(other && other.profile.ocultarDeCasas !== true &&
          cleanCourse(other.profile.curso) !== cleanCourse(selected?.profile.curso)) };
    });
  }
  console.log(JSON.stringify(summary, null, 2));
  if (process.argv.includes('--hide-duplicate')) {
    if (duplicateCandidates.length !== 1 || summary.duplicateAnalysis.length !== 1) {
      throw new Error('No hay un único duplicado verificable.');
    }
    const candidate = duplicateCandidates[0];
    const owner = candidate.matches.find(match => match.uid === candidate.user?.localId);
    const ghost = candidate.matches.find(match => match.uid !== candidate.user?.localId);
    const analysis = summary.duplicateAnalysis[0];
    if (!owner || !ghost || owner.profile.curso !== '4A-HC' || ghost.profile.curso !== '4B-HC' ||
        analysis.otherProfile.avatarExists || analysis.otherProfile.taskCount ||
        analysis.otherProfile.giftCount || analysis.otherProfile.furnitureCount ||
        ghost.profile.ocultarDeCasas === true) {
      throw new Error('Duplicado no coincide con el caso seguro de 4A/4B; no se escribió nada.');
    }
    const route = `plataforma_estudiantes/estudiantes/${ghost.uid}`;
    const fresh = await dbConditional('GET', route, token);
    if (!fresh.etag || !isDeepStrictEqual(fresh.value, ghost.profile)) {
      throw new Error('El perfil duplicado cambió; no se escribió nada.');
    }
    const base = process.env.LOCALAPPDATA;
    if (!base) throw new Error('Falta respaldo local; no se escribió nada.');
    const backupDir = path.resolve(base, 'EstudiaCEST', 'backups');
    if (!path.relative(path.resolve(__dirname, '../..'), backupDir).startsWith('..')) {
      throw new Error('Respaldo dentro del repositorio.');
    }
    fs.mkdirSync(backupDir, { recursive:true, mode:0o700 });
    const backupPath = path.join(backupDir, `paes-ghost-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    const backup = { uid:ghost.uid, before:ghost.profile, authUid:owner.uid };
    fs.writeFileSync(backupPath, JSON.stringify(backup), { flag:'wx', mode:0o600 });
    if (!isDeepStrictEqual(JSON.parse(fs.readFileSync(backupPath, 'utf8')), backup)) {
      throw new Error('Respaldo no verificable; no se escribió nada.');
    }
    const after = { ...ghost.profile, ocultarDeCasas:true };
    await dbConditional('PUT', route, token, after, fresh.etag);
    const [ghostAfter, ownerAfter] = await Promise.all([
      requestJson('GET', route, token),
      requestJson('GET', `plataforma_estudiantes/estudiantes/${owner.uid}`, token)
    ]);
    if (!isDeepStrictEqual(ghostAfter, after) || !isDeepStrictEqual(ownerAfter, owner.profile)) {
      throw new Error('Relectura divergente de duplicado o cuenta Auth.');
    }
    console.log(JSON.stringify({ ghostHidden:true, authProfileUnchanged:true, backupPath }, null, 2));
  }
  if (process.argv.includes('--recover-disabled')) {
    if (recoverDisabled.length !== 1) throw new Error('No hay exactamente una cuenta parcial verificable.');
    const target = recoverDisabled[0];
    await authWrite(':update', token, { localId:target.uid, disableUser:false }, null);
    const after = await lookupAuth([target.email], token);
    if (after.length !== 1 || after[0].localId !== target.uid || after[0].disabled === true) {
      throw new Error('La relectura Auth no confirmó activación.');
    }
    console.log(JSON.stringify({ recovered:1, authEnabled:true }));
  }
  if (process.argv.includes('--probe-etag')) {
    const sample = swaps[0];
    const probe = sample && await dbConditional('GET', `plataforma_estudiantes/estudiantes/${sample.uid}`, token);
    console.log(JSON.stringify({ etagAvailable:!!(probe && probe.etag),
      snapshotStable:!!(probe && isDeepStrictEqual(probe.value, sample.before)) }));
  }
  if (process.argv.includes('--apply-course-fix')) {
    if (summary.courseSwap !== 81 || swaps.length !== 81) {
      throw new Error('Se esperaban 81 perfiles inequívocos; no se escribió nada.');
    }
    const base = process.env.LOCALAPPDATA;
    if (!base) throw new Error('Falta LOCALAPPDATA para el respaldo; no se escribió nada.');
    const backupDir = path.resolve(base, 'EstudiaCEST', 'backups');
    const repoRoot = path.resolve(__dirname, '../..');
    const relative = path.relative(repoRoot, backupDir);
    if (!relative.startsWith('..') || path.parse(backupDir).root === backupDir) {
      throw new Error('El respaldo debe quedar fuera del repositorio; no se escribió nada.');
    }
    const current = [];
    for (let offset = 0; offset < swaps.length; offset += 10) {
      const chunk = await Promise.all(swaps.slice(offset, offset + 10).map(async swap => ({
        ...swap, fresh:await dbConditional('GET', `plataforma_estudiantes/estudiantes/${swap.uid}`, token)
      })));
      current.push(...chunk);
    }
    if (current.some(item => !item.fresh.etag || !isDeepStrictEqual(item.fresh.value, item.before))) {
      throw new Error('Al menos un perfil cambió durante la preparación; no se escribió nada.');
    }
    fs.mkdirSync(backupDir, { recursive:true, mode:0o700 });
    const backupPath = path.join(backupDir, `paes-courses-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    const backup = { createdAt:new Date().toISOString(), profiles:current.map(item => ({
      uid:item.uid, before:item.before, targetCourse:item.curso
    })) };
    fs.writeFileSync(backupPath, JSON.stringify(backup), { flag:'wx', mode:0o600 });
    if (!isDeepStrictEqual(JSON.parse(fs.readFileSync(backupPath, 'utf8')), backup)) {
      throw new Error('No se pudo confirmar el respaldo; no se escribió nada.');
    }
    let applied = 0;
    try {
      for (const item of current) {
        const expected = { ...item.before, curso:item.curso };
        await dbConditional('PUT', `plataforma_estudiantes/estudiantes/${item.uid}`, token,
          expected, item.fresh.etag);
        const reread = await requestJson('GET', `plataforma_estudiantes/estudiantes/${item.uid}`, token);
        if (!isDeepStrictEqual(reread, expected)) throw new Error('Relectura divergente tras la escritura.');
        applied++;
      }
      const full = await requestJson('GET', 'plataforma_estudiantes/estudiantes', token) || {};
      if (current.some(item => !isDeepStrictEqual(full[item.uid], { ...item.before, curso:item.curso }))) {
        throw new Error('Relectura completa divergente.');
      }
      console.log(JSON.stringify({ result:'aplicado y releído', applied, backupPath }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ result:'incompleto; revisar antes de reintentar', applied,
        backupPath, error:error.message }, null, 2));
      process.exitCode = 1;
    }
  }
  if (process.argv.includes('--apply-missing')) {
    if (missing.length !== 3 || missingEligible.length !== 3 || summary.missingProfileAuthExists ||
        summary.profileUidMismatch || Object.values(missingReasons).some(Boolean)) {
      throw new Error('Alta detenida: no son exactamente tres identidades inequívocas restantes.');
    }
    if (!process.env.LOCALAPPDATA) throw new Error('Falta directorio de respaldo.');
    const backupDir = path.resolve(process.env.LOCALAPPDATA, 'EstudiaCEST', 'backups');
    const repoRoot = path.resolve(__dirname, '../..');
    if (!path.relative(repoRoot, backupDir).startsWith('..')) throw new Error('Respaldo dentro del repositorio.');
    fs.mkdirSync(backupDir, { recursive:true, mode:0o700 });
    const journalPath = path.join(backupDir, `paes-new-accounts-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    const journal = { createdAt:new Date().toISOString(), students:missingEligible.map(item => ({
      rut:cleanRut(item.rut), email:emailOf(item.rut), nombre:item.nombre,
      curso:platformCourse(item.curso), beforeAuth:null, beforeProfile:null, stage:'planned'
    })) };
    const saveJournal = () => fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2), { mode:0o600 });
    fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2), { flag:'wx', mode:0o600 });
    if (JSON.parse(fs.readFileSync(journalPath, 'utf8')).students.length !== 3) {
      throw new Error('Respaldo no verificable; no se creó ninguna cuenta.');
    }
    let completed = 0;
    try {
      for (const entry of journal.students) {
        const stillAbsent = await lookupAuth([entry.email], token);
        const currentProfiles = await requestJson('GET', 'plataforma_estudiantes/estudiantes', token) || {};
        if (stillAbsent.length || Object.values(currentProfiles).some(profile =>
          cleanRut((profile || {}).rut) === entry.rut ||
          String((profile || {}).email || '').toLowerCase() === entry.email)) {
          throw new Error('La identidad cambió antes del alta.');
        }
        const password = entry.rut.replace(/\D/g, '').slice(0, 6);
        try {
          const created = await authWrite('', token, {
            email:entry.email, password, displayName:entry.nombre, disabled:true
          }, null);
          if (!created.localId) throw new Error('Auth no devolvió UID.');
          entry.uid = created.localId; entry.stage = 'auth-disabled'; saveJournal();
          const authCheck = await lookupAuth([entry.email], token);
          if (authCheck.length !== 1 || authCheck[0].localId !== entry.uid || authCheck[0].disabled !== true) {
            throw new Error('No se pudo confirmar la cuenta deshabilitada.');
          }
          const profilePath = `plataforma_estudiantes/estudiantes/${entry.uid}`;
          const before = await dbConditional('GET', profilePath, token);
          if (before.value !== null || !before.etag) throw new Error('El UID ya tiene perfil.');
          const profile = { nombre:entry.nombre, rut:entry.rut, curso:entry.curso,
            programa:'paes', perfil_completo:false, password_changed:false,
            password_reset_pending:false, createdAt:Date.now(), createdBy:'paes-mi-espacio-regularizacion' };
          await dbConditional('PUT', profilePath, token, profile, before.etag);
          entry.stage = 'profile-written'; saveJournal();
          if (!isDeepStrictEqual(await requestJson('GET', profilePath, token), profile)) {
            throw new Error('El perfil creado no pasó la relectura.');
          }
          entry.stage = 'profile-confirmed'; saveJournal();
          await authWrite(':update', token, { localId:entry.uid, disableUser:false }, null);
          const enabled = await lookupAuth([entry.email], token);
          if (enabled.length !== 1 || enabled[0].localId !== entry.uid || enabled[0].disabled === true) {
            throw new Error('No se pudo confirmar la activación.');
          }
          entry.stage = 'ready'; saveJournal(); completed++;
        } catch (error) {
          if (entry.uid && entry.stage === 'auth-disabled') {
            try { await authWrite(':delete', token, { localId:entry.uid }, null);
              entry.stage = 'auth-rolled-back'; saveJournal(); }
            catch (_) { entry.stage = 'rollback-pending'; saveJournal(); }
          }
          throw error;
        }
      }
      console.log(JSON.stringify({ result:'cuentas restantes verificadas', completed, journalPath }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ result:'alta parcial; revisar journal antes de reintentar', completed,
        journalPath, error:error.message }, null, 2));
      process.exitCode = 1;
    }
  }
}

main().catch(error => { console.error('No se pudo completar la auditoría de identidad PAES:', error.message); process.exitCode = 1; });
