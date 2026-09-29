// Informe técnico de la Clase 6 de NM4 (Unidad 3): ingreso con RUN, borrador y
// entrega. No es una función propia de Vercel (el plan Hobby admite 12): la
// sirve api/economista.js cuando llega ?modulo=informe-tecnico.
//
// Hay tres versiones del informe (?version=). La versión eléctrica histórica
// conserva 4°E para no invalidar borradores anteriores; la portada dirige 4°E
// al caso nuevo de Electrónica, guardado en una base independiente.
//
// Acciones (todas POST salvo admin-list):
//   get-guia-state  { rut }            -> estudiante + intento guardado
//   validate-partner { rut, partnerRut } -> valida una pareja opcional
//   save            { rut, partnerRut?, answers } -> borrador individual o compartido
//   submit          { rut, partnerRut?, answers } -> entrega final, escritura única
//   admin-list      GET, Bearer token  -> nómina con estado (solo admins)
//   admin-reset     { curso, n }, token -> reabre un intento (solo admins)
//
// El RUN nunca viaja en la URL ni se guarda: se compara como hash contra
// _roster_nm4_informe.js y el registro se identifica por curso + número de lista.

const crypto = require('crypto');
const { SALT, ROWS } = require('./_roster_nm4_informe.js');

const VERSIONS = {
  electrica: {
    campos: require('../nm4/u3-clase6-informe-tecnico/informe/campos.js'),
    base: 'plataforma_nm4/informe_tecnico_2026',
    cursos: ['4CTP', '4ETP', 'PRUEBA'],
    nombre: 'informe eléctrico (4°C y 4°E)',
    ruta: '/nm4/u3-clase6-informe-tecnico/informe/'
  },
  mecanica: {
    campos: require('../nm4/u3-clase6-informe-mecanica/informe/campos.js'),
    base: 'plataforma_nm4/informe_mecanica_2026',
    cursos: ['4ATP', '4BTP', 'PRUEBA'],
    nombre: 'informe mecánico (4°A y 4°B)',
    ruta: '/nm4/u3-clase6-informe-mecanica/informe/'
  },
  electronica: {
    campos: require('../nm4/u3-clase6-informe-electronica/informe/campos.js'),
    base: 'plataforma_nm4/informe_electronica_2026',
    cursos: ['4ETP', 'PRUEBA'],
    nombre: 'informe de Electrónica (4°E)',
    ruta: '/nm4/u3-clase6-informe-electronica/informe/',
    supportsPairs: true
  }
};
const COURSE_VERSION = { '4ATP': 'mecanica', '4BTP': 'mecanica', '4CTP': 'electrica', '4ETP': 'electronica' };
const ADMINS = 'plataforma_estudiantes/admins';
const ROSTER = ROWS.map(([hash, curso, n, nombre]) => ({ hash, curso, n, nombre }));
const BY_HASH = new Map(ROSTER.map(student => [student.hash, student]));

const cleanRut = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
const hashRut = value => crypto.createHash('sha256').update(SALT + cleanRut(value)).digest('hex').slice(0, 24);

function findStudent(rut) {
  const clean = cleanRut(rut);
  if (clean.length < 7) return null;
  return BY_HASH.get(hashRut(clean)) || null;
}

function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

const publicStudent = student => ({ nombre: student.nombre, curso: student.curso, n: student.n });
const studentKey = student => `${student.curso}/${student.n}`;
const pairIdFor = (first, second) => `pair_${[first, second].map(student => `${student.curso}_${String(student.n).padStart(3, '0')}`).sort().join('__')}`;

function visibleError(message, status = 400) {
  return Object.assign(new Error(message), { status, visible: true });
}

function claimAt(claims, student) {
  return claims && claims[student.curso] ? claims[student.curso][student.n] : null;
}

function withClaim(claims, student, value) {
  const next = { ...(claims || {}) };
  next[student.curso] = { ...(next[student.curso] || {}), [student.n]: value };
  return next;
}

function versionFor(req) {
  const key = String((req.query && req.query.version) || 'electrica');
  const version = VERSIONS[key];
  if (!version) throw Object.assign(new Error('Versión no reconocida'), { status: 400, visible: true });
  return version;
}

// Un estudiante de otro curso recibe la dirección de su propio informe.
function wrongCourse(res, student, version) {
  const other = VERSIONS[COURSE_VERSION[student.curso]] || Object.values(VERSIONS).find(v => v !== version && v.cursos.includes(student.curso));
  return res.status(403).json({
    error: other ? `Este es el ${version.nombre}. Tu curso trabaja en el ${other.nombre}.` : `Este es el ${version.nombre}. Tu curso no trabaja en este informe.`,
    ruta: other ? other.ruta : null
  });
}

function publicAttempt(value, version) {
  if (!value) return null;
  return {
    answers: version.campos.sanitize(value.answers),
    status: value.status === 'submitted' ? 'submitted' : 'draft',
    submitted: value.submitted === true,
    completada: value.completada === true,
    score: Number(value.score || 0),
    total: Number(value.total || version.campos.questions.length),
    updatedAt: Number(value.updatedAt || 0),
    submittedAt: Number(value.submittedAt || 0),
    workMode: value.workMode === 'pair' ? 'pair' : 'individual',
    team: Array.isArray(value.team) ? value.team.map(publicStudent) : []
  };
}

async function readWorkState(db, version, student) {
  const individualRef = db.ref(`${version.base}/${student.curso}/${student.n}`);
  if (!version.supportsPairs) {
    const snap = await individualRef.once('value');
    return { mode: 'individual', claim: null, ref: individualRef, value: snap.val() };
  }
  const claimSnap = await db.ref(`${version.base}/_claims/${student.curso}/${student.n}`).once('value');
  const claim = typeof claimSnap.val() === 'string' ? claimSnap.val() : null;
  if (claim && claim.startsWith('pair_')) {
    const ref = db.ref(`${version.base}/_teams/${claim}`);
    const snap = await ref.once('value');
    return { mode: 'pair', claim, ref, value: snap.val() };
  }
  const snap = await individualRef.once('value');
  return { mode: 'individual', claim, ref: individualRef, value: snap.val() };
}

async function validatePair(db, version, student, partnerRut) {
  if (!version.supportsPairs) throw visibleError('Esta versión del informe se realiza individualmente.');
  const partner = findStudent(partnerRut);
  if (!partner) throw visibleError('El RUT del compañero no pertenece a la nómina de esta actividad.', 404);
  if (!version.cursos.includes(partner.curso) || partner.curso !== student.curso) throw visibleError('El compañero debe pertenecer al mismo curso.', 403);
  if (studentKey(partner) === studentKey(student)) throw visibleError('El compañero debe ser otra persona.');
  const pairId = pairIdFor(student, partner);
  const [firstState, secondState] = await Promise.all([readWorkState(db, version, student), readWorkState(db, version, partner)]);
  for (const state of [firstState, secondState]) {
    if (state.claim && state.claim !== pairId) throw visibleError('Uno de los integrantes ya comenzó otro informe. Debe continuar ese trabajo.', 409);
    if (state.value && !(state.mode === 'pair' && state.claim === pairId)) throw visibleError('Uno de los integrantes ya comenzó otro informe. Debe continuar ese trabajo.', 409);
  }
  const members = [student, partner].sort((a, b) => studentKey(a).localeCompare(studentKey(b)));
  return { partner, pairId, members };
}

async function claimPair(db, version, pair) {
  const ref = db.ref(`${version.base}/_claims`);
  let conflict = false;
  const result = await ref.transaction(current => {
    const first = claimAt(current, pair.members[0]);
    const second = claimAt(current, pair.members[1]);
    if ((first && first !== pair.pairId) || (second && second !== pair.pairId)) {
      conflict = true;
      return;
    }
    return withClaim(withClaim(current, pair.members[0], pair.pairId), pair.members[1], pair.pairId);
  }, undefined, false);
  if (!result.committed || conflict) throw visibleError('La pareja no pudo reservarse porque uno de los integrantes comenzó otro informe.', 409);
}

async function claimIndividual(db, version, student) {
  if (!version.supportsPairs) return;
  const soloId = `solo_${student.curso}_${String(student.n).padStart(3, '0')}`;
  const ref = db.ref(`${version.base}/_claims/${student.curso}/${student.n}`);
  let conflict = false;
  const result = await ref.transaction(current => {
    if (current && current !== soloId) { conflict = true; return; }
    return soloId;
  }, undefined, false);
  if (!result.committed || conflict) throw visibleError('Este informe ya está asociado a una pareja. Recarga para continuar el trabajo compartido.', 409);
}

async function workTarget(input, student, db, version) {
  const current = await readWorkState(db, version, student);
  if (!version.supportsPairs) return { ...current, members: [student] };
  if (current.mode === 'pair') {
    let members = current.value && Array.isArray(current.value.team) ? current.value.team : null;
    if (!members && input.partnerRut) members = (await validatePair(db, version, student, input.partnerRut)).members;
    if (!members) throw visibleError('No se pudo recuperar la pareja. Vuelve a ingresar y confirma al compañero.', 409);
    return { ...current, members };
  }
  if (current.claim && current.claim.startsWith('solo_')) return { ...current, members: [student] };
  if (input.partnerRut) {
    const pair = await validatePair(db, version, student, input.partnerRut);
    await claimPair(db, version, pair);
    const ref = db.ref(`${version.base}/_teams/${pair.pairId}`);
    const snap = await ref.once('value');
    return { mode: 'pair', claim: pair.pairId, ref, value: snap.val(), members: pair.members };
  }
  await claimIndividual(db, version, student);
  return { ...current, claim: `solo_${student.curso}_${String(student.n).padStart(3, '0')}`, members: [student] };
}

async function handleState(req, res, db, version) {
  const student = findStudent(body(req).rut);
  if (!student) return res.status(404).json({ error: 'Ese RUT no está en las nóminas de 4° medio. Revísalo o avisa al profesor.' });
  if (!version.cursos.includes(student.curso)) return wrongCourse(res, student, version);
  const state = await readWorkState(db, version, student);
  return res.status(200).json({ ok: true, student: publicStudent(student), attempt: publicAttempt(state.value, version), supportsPairs: version.supportsPairs === true });
}

async function handleValidatePartner(req, res, db, version) {
  const input = body(req);
  const student = findStudent(input.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina de esta actividad.' });
  if (!version.cursos.includes(student.curso)) return wrongCourse(res, student, version);
  const pair = await validatePair(db, version, student, input.partnerRut);
  return res.status(200).json({ ok: true, partner: publicStudent(pair.partner) });
}

async function handleSave(req, res, db, version, submit) {
  const input = body(req);
  const student = findStudent(input.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina de esta actividad.' });
  if (!version.cursos.includes(student.curso)) return wrongCourse(res, student, version);
  const CAMPOS = version.campos;
  const answers = CAMPOS.sanitize(input.answers);
  const { score, total } = CAMPOS.progress(answers);
  if (submit && Array.isArray(CAMPOS.activity.requiredForSubmit)) {
    const required = new Set(CAMPOS.activity.requiredForSubmit);
    const missing = CAMPOS.questions.filter(question => required.has(question.id) && !CAMPOS.isComplete(question, answers[question.id]));
    if (missing.length) return res.status(400).json({ error: `Completa primero las ${missing.length} partes obligatorias del informe.`, missing: missing.map(question => question.label) });
  }
  const target = await workTarget(input, student, db, version);
  const ref = target.ref;
  const now = Date.now();
  let locked = false;

  // Transacción: una entrega confirmada no se sobrescribe con un borrador tardío.
  const result = await ref.transaction(current => {
    if (current && (current.completada === true || current.submitted === true)) {
      locked = true;
      return;
    }
    const members = target.mode === 'pair' ? target.members.map(publicStudent) : [publicStudent(student)];
    const record = {
      sessionId: CAMPOS.activity.sessionId,
      curso: members[0].curso,
      n: members[0].n,
      nombre: members.map(member => member.nombre).join(' y '),
      workMode: target.mode,
      team: members,
      answers,
      score,
      total,
      status: submit ? 'submitted' : 'draft',
      submitted: submit,
      completada: submit,
      createdAt: current && current.createdAt ? current.createdAt : now,
      updatedAt: now,
      saves: Number((current && current.saves) || 0) + 1
    };
    if (submit) {
      record.submittedAt = now;
      record.completadaAt = now;
    }
    return record;
  }, undefined, false);

  if (!result.committed && locked) {
    return res.status(409).json({ error: 'El informe ya fue entregado.', attempt: publicAttempt(result.snapshot.val(), version) });
  }
  // Se relee desde la base antes de responder: el cliente confirma con esto.
  const snap = await ref.once('value');
  return res.status(200).json({ ok: true, attempt: publicAttempt(snap.val(), version) });
}

async function verifyAdmin(req, admin, db) {
  const token = String((req.headers && req.headers.authorization) || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw Object.assign(new Error('Token requerido'), { status: 401 });
  const decoded = await admin.auth().verifyIdToken(token);
  const snap = await db.ref(`${ADMINS}/${decoded.uid}`).once('value');
  if (snap.val() !== true) throw Object.assign(new Error('No autorizado'), { status: 403 });
  return decoded;
}

async function handleAdminList(req, res, admin, db, version) {
  await verifyAdmin(req, admin, db);
  const curso = String((req.query && req.query.curso) || '').toUpperCase();
  const snap = await db.ref(version.base).once('value');
  const data = snap.val() || {};
  const rows = ROSTER
    .filter(student => version.cursos.includes(student.curso) && (!curso || student.curso === curso))
    .map(student => {
      const claim = claimAt(data._claims, student);
      const value = claim && claim.startsWith('pair_')
        ? data._teams && data._teams[claim]
        : data[student.curso] && data[student.curso][student.n];
      return { ...publicStudent(student), attempt: publicAttempt(value, version) };
    });
  return res.status(200).json({ ok: true, total: version.campos.questions.length, rows });
}

async function handleAdminReset(req, res, admin, db, version) {
  await verifyAdmin(req, admin, db);
  const input = body(req);
  const student = ROSTER.find(item => item.curso === String(input.curso || '').toUpperCase() && item.n === Number(input.n));
  if (!student || !version.cursos.includes(student.curso)) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  const state = await readWorkState(db, version, student);
  const ref = state.ref;
  // Reabrir conserva las respuestas: solo quita la marca de entrega.
  await ref.update({ status: 'draft', submitted: false, completada: false, reopenedAt: Date.now() });
  const snap = await ref.once('value');
  return res.status(200).json({ ok: true, attempt: publicAttempt(snap.val(), version) });
}

module.exports = async function informeTecnico(req, res, { admin, db }) {
  res.setHeader('Cache-Control', 'no-store');
  const action = String((req.query && req.query.action) || '');
  try {
    const version = versionFor(req);
    if (action === 'health') {
      const roster = ROSTER.filter(s => version.cursos.includes(s.curso)).length;
      return res.status(200).json({ ok: true, activity: version.campos.activity.sessionId, roster, campos: version.campos.questions.length });
    }
    if (action === 'admin-list' && req.method === 'GET') return await handleAdminList(req, res, admin, db, version);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no disponible.' });
    if (action === 'get-guia-state') return await handleState(req, res, db, version);
    if (action === 'validate-partner') return await handleValidatePartner(req, res, db, version);
    if (action === 'save') return await handleSave(req, res, db, version, false);
    if (action === 'submit') return await handleSave(req, res, db, version, true);
    if (action === 'admin-reset') return await handleAdminReset(req, res, admin, db, version);
    return res.status(400).json({ error: 'Acción no reconocida.' });
  } catch (error) {
    const status = error.status || (/token|auth/i.test(error.code || error.message) ? 401 : 500);
    console.error('[informe-tecnico]', action, error.message);
    const message = error.visible ? error.message : status === 500 ? 'No se pudo procesar la solicitud.' : 'No autorizado.';
    return res.status(status).json({ error: message });
  }
};
