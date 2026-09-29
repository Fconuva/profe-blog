// Informe técnico de la Clase 6 de NM4 (Unidad 3): ingreso con RUN, borrador y
// entrega. No es una función propia de Vercel (el plan Hobby admite 12): la
// sirve api/economista.js cuando llega ?modulo=informe-tecnico.
//
// Hay versiones por especialidad (?version=). Las versiones eléctrica y
// mecánica compartidas se conservan como históricas para no invalidar
// borradores anteriores. Las portadas dirigen a los casos especializados,
// cada uno guardado en una base independiente.
//
// Acciones (todas POST salvo admin-list):
//   get-guia-state  { rut }            -> estudiante + intento guardado
//   validate-partner { rut, partnerRut } -> valida una pareja opcional
//   join-pair       { rut, partnerRut } -> conserva el borrador y lo comparte
//   save            { rut, partnerRut?, answers } -> borrador individual o compartido
//   submit          { rut, partnerRut?, answers } -> entrega final, escritura única
//   admin-list      GET, Bearer token  -> nómina con estado (solo admins)
//   admin-pair      { curso, firstN, secondN }, token -> forma una pareja
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
    ruta: '/nm4/u3-clase6-informe-tecnico/informe/',
    supportsPairs: true,
    pairCourses: ['4CTP', 'PRUEBA']
  },
  mecanica: {
    campos: require('../nm4/u3-clase6-informe-mecanica/informe/campos.js'),
    base: 'plataforma_nm4/informe_mecanica_2026',
    cursos: ['4ATP', '4BTP', 'PRUEBA'],
    nombre: 'informe mecánico (4°A y 4°B)',
    ruta: '/nm4/u3-clase6-informe-mecanica/informe/'
  },
  industrial: {
    campos: require('../nm4/u3-clase6-informe-industrial/informe/campos.js'),
    base: 'plataforma_nm4/informe_industrial_2026',
    cursos: ['4ATP', 'PRUEBA'],
    nombre: 'informe de Mecánica Industrial (4°A)',
    ruta: '/nm4/u3-clase6-informe-industrial/informe/',
    supportsPairs: true
  },
  automotriz: {
    campos: require('../nm4/u3-clase6-informe-automotriz/informe/campos.js'),
    base: 'plataforma_nm4/informe_automotriz_2026',
    cursos: ['4BTP', 'PRUEBA'],
    nombre: 'informe de Mecánica Automotriz (4°B)',
    ruta: '/nm4/u3-clase6-informe-automotriz/informe/',
    supportsPairs: true
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
const COURSE_VERSION = { '4ATP': 'industrial', '4BTP': 'automotriz', '4CTP': 'electrica', '4ETP': 'electronica' };
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
const soloIdFor = student => `solo_${student.curso}_${String(student.n).padStart(3, '0')}`;
const isSubmitted = value => !!(value && (value.completada === true || value.submitted === true));
const supportsPairsFor = (version, student) => version.supportsPairs === true && (!version.pairCourses || version.pairCourses.includes(student.curso));

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
    revision: Number(value.revision || value.saves || 0),
    lastEditor: value.lastEditor ? publicStudent(value.lastEditor) : null,
    workMode: value.workMode === 'pair' ? 'pair' : 'individual',
    team: Array.isArray(value.team) ? value.team.map(publicStudent) : []
  };
}

async function readWorkState(db, version, student) {
  const individualRef = db.ref(`${version.base}/${student.curso}/${student.n}`);
  if (!supportsPairsFor(version, student)) {
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

async function validatePairStudents(db, version, student, partner) {
  if (!supportsPairsFor(version, student) || !supportsPairsFor(version, partner)) throw visibleError('Este curso realiza esta versión del informe individualmente.');
  if (!version.cursos.includes(partner.curso) || partner.curso !== student.curso) throw visibleError('El compañero debe pertenecer al mismo curso.', 403);
  if (studentKey(partner) === studentKey(student)) throw visibleError('El compañero debe ser otra persona.');
  const pairId = pairIdFor(student, partner);
  const [firstState, secondState] = await Promise.all([readWorkState(db, version, student), readWorkState(db, version, partner)]);
  for (const [index, state] of [firstState, secondState].entries()) {
    const member = index === 0 ? student : partner;
    const allowedClaim = !state.claim || state.claim === pairId || state.claim === soloIdFor(member);
    if (!allowedClaim) throw visibleError('Uno de los integrantes ya trabaja con otra pareja. Debe continuar ese informe.', 409);
    if (isSubmitted(state.value) && !(state.mode === 'pair' && state.claim === pairId)) {
      throw visibleError('Uno de los integrantes ya entregó su informe individual. El profesor debe reabrirlo antes de formar la pareja.', 409);
    }
  }
  const members = [student, partner].sort((a, b) => studentKey(a).localeCompare(studentKey(b)));
  return { partner, pairId, members };
}

async function validatePair(db, version, student, partnerRut) {
  const partner = findStudent(partnerRut);
  if (!partner) throw visibleError('El RUT del compañero no pertenece a la nómina de esta actividad.', 404);
  return await validatePairStudents(db, version, student, partner);
}

function individualAt(data, student) {
  return data && data[student.curso] ? data[student.curso][student.n] : null;
}

function mergePairDraft(version, pair, current, primary) {
  const existing = current._teams && current._teams[pair.pairId];
  const ordered = [primary, ...pair.members.filter(member => studentKey(member) !== studentKey(primary))];
  const sources = [existing, ...ordered.map(member => individualAt(current, member))].filter(Boolean);
  const answers = {};
  for (const source of sources) {
    const clean = version.campos.sanitize(source.answers);
    for (const question of version.campos.questions) {
      if (!answers[question.id] && clean[question.id]) answers[question.id] = clean[question.id];
    }
  }
  const { score, total } = version.campos.progress(answers);
  const timestamps = sources.map(source => Number(source.createdAt || 0)).filter(Boolean);
  const now = Date.now();
  return {
    sessionId: version.campos.activity.sessionId,
    curso: pair.members[0].curso,
    n: pair.members[0].n,
    nombre: pair.members.map(member => member.nombre).join(' y '),
    workMode: 'pair',
    team: pair.members.map(publicStudent),
    answers,
    score,
    total,
    status: 'draft',
    submitted: false,
    completada: false,
    createdAt: timestamps.length ? Math.min(...timestamps) : now,
    updatedAt: now,
    pairedAt: existing && existing.pairedAt ? existing.pairedAt : now,
    saves: sources.reduce((sum, source) => sum + Number(source.saves || 0), 0),
    revision: Math.max(0, ...sources.map(source => Number(source.revision || source.saves || 0))) + 1,
    lastEditor: publicStudent(primary)
  };
}

// La conversión individual -> pareja es una sola transacción. Los borradores
// individuales quedan intactos como respaldo y sus campos se combinan.
async function migratePair(db, version, pair, primary) {
  const ref = db.ref(version.base);
  let conflictMessage = '';
  const result = await ref.transaction(value => {
    conflictMessage = '';
    const current = value || {};
    const claims = current._claims || {};
    for (const member of pair.members) {
      const claim = claimAt(claims, member);
      if (claim && claim !== pair.pairId && claim !== soloIdFor(member)) {
        conflictMessage = 'Uno de los integrantes ya trabaja con otra pareja. Debe continuar ese informe.';
        return;
      }
      if (isSubmitted(individualAt(current, member))) {
        conflictMessage = 'Uno de los integrantes ya entregó su informe individual. El profesor debe reabrirlo antes de formar la pareja.';
        return;
      }
    }
    const existing = current._teams && current._teams[pair.pairId];
    if (isSubmitted(existing)) {
      conflictMessage = 'El informe de esta pareja ya fue entregado.';
      return;
    }

    const next = { ...current };
    next._claims = withClaim(withClaim(claims, pair.members[0], pair.pairId), pair.members[1], pair.pairId);
    next._teams = { ...(current._teams || {}), [pair.pairId]: mergePairDraft(version, pair, current, primary) };
    const backups = { ...((current._pairBackups && current._pairBackups[pair.pairId]) || {}) };
    for (const member of pair.members) {
      const individual = individualAt(current, member);
      const key = `${member.curso}_${String(member.n).padStart(3, '0')}`;
      if (individual && !backups[key]) backups[key] = individual;
    }
    next._pairBackups = { ...(current._pairBackups || {}), [pair.pairId]: backups };
    return next;
  }, undefined, false);
  if (!result.committed) throw visibleError(conflictMessage || 'No se pudo formar la pareja. Recarga e inténtalo otra vez.', 409);
  const pairRef = db.ref(`${version.base}/_teams/${pair.pairId}`);
  const snap = await pairRef.once('value');
  return { mode: 'pair', claim: pair.pairId, ref: pairRef, value: snap.val(), members: pair.members };
}

async function claimIndividual(db, version, student) {
  if (!supportsPairsFor(version, student)) return;
  const soloId = soloIdFor(student);
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
  if (!supportsPairsFor(version, student)) return { ...current, members: [student] };
  if (current.mode === 'pair') {
    let members = current.value && Array.isArray(current.value.team) ? current.value.team : null;
    if (!members && input.partnerRut) members = (await validatePair(db, version, student, input.partnerRut)).members;
    if (!members) throw visibleError('No se pudo recuperar la pareja. Vuelve a ingresar y confirma al compañero.', 409);
    return { ...current, members };
  }
  if (input.partnerRut) {
    const pair = await validatePair(db, version, student, input.partnerRut);
    return await migratePair(db, version, pair, student);
  }
  if (current.claim && current.claim.startsWith('solo_')) return { ...current, members: [student] };
  await claimIndividual(db, version, student);
  return { ...current, claim: soloIdFor(student), members: [student] };
}

async function handleState(req, res, db, version) {
  const student = findStudent(body(req).rut);
  if (!student) return res.status(404).json({ error: 'Ese RUT no está en las nóminas de 4° medio. Revísalo o avisa al profesor.' });
  if (!version.cursos.includes(student.curso)) return wrongCourse(res, student, version);
  const state = await readWorkState(db, version, student);
  return res.status(200).json({ ok: true, student: publicStudent(student), attempt: publicAttempt(state.value, version), supportsPairs: supportsPairsFor(version, student) });
}

async function handleValidatePartner(req, res, db, version) {
  const input = body(req);
  const student = findStudent(input.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina de esta actividad.' });
  if (!version.cursos.includes(student.curso)) return wrongCourse(res, student, version);
  const pair = await validatePair(db, version, student, input.partnerRut);
  return res.status(200).json({ ok: true, partner: publicStudent(pair.partner) });
}

async function handleJoinPair(req, res, db, version) {
  const input = body(req);
  const student = findStudent(input.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina de esta actividad.' });
  if (!version.cursos.includes(student.curso)) return wrongCourse(res, student, version);
  const pair = await validatePair(db, version, student, input.partnerRut);
  const target = await migratePair(db, version, pair, student);
  return res.status(200).json({ ok: true, attempt: publicAttempt(target.value, version) });
}

async function handleSave(req, res, db, version, submit) {
  const input = body(req);
  const student = findStudent(input.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina de esta actividad.' });
  if (!version.cursos.includes(student.curso)) return wrongCourse(res, student, version);
  const CAMPOS = version.campos;
  const incomingAnswers = CAMPOS.sanitize(input.answers);
  const allowedFields = new Set(CAMPOS.questions.map(question => question.id));
  const changedFields = Array.isArray(input.changedFields)
    ? [...new Set(input.changedFields.map(String).filter(field => allowedFields.has(field)))]
    : null;
  const target = await workTarget(input, student, db, version);
  const ref = target.ref;
  const now = Date.now();
  let locked = false;
  let missingForSubmit = [];

  // Transacción: los clientes colaborativos envían solo los campos modificados.
  // Así, dos integrantes pueden guardar desde equipos distintos sin borrar los
  // campos que el otro acaba de cambiar. Los clientes antiguos conservan el
  // reemplazo completo hasta que actualicen la página.
  const result = await ref.transaction(current => {
    missingForSubmit = [];
    if (current && (current.completada === true || current.submitted === true)) {
      locked = true;
      return;
    }
    const answers = changedFields
      ? { ...CAMPOS.sanitize(current && current.answers) }
      : incomingAnswers;
    if (changedFields) {
      for (const field of changedFields) {
        if (Object.prototype.hasOwnProperty.call(incomingAnswers, field)) answers[field] = incomingAnswers[field];
        else delete answers[field];
      }
    }
    const { score, total } = CAMPOS.progress(answers);
    if (submit && Array.isArray(CAMPOS.activity.requiredForSubmit)) {
      const required = new Set(CAMPOS.activity.requiredForSubmit);
      missingForSubmit = CAMPOS.questions.filter(question => required.has(question.id) && !CAMPOS.isComplete(question, answers[question.id]));
      if (missingForSubmit.length) return;
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
      saves: Number((current && current.saves) || 0) + 1,
      revision: Number((current && (current.revision || current.saves)) || 0) + 1,
      lastEditor: publicStudent(student)
    };
    if (current && current.pairedAt) record.pairedAt = current.pairedAt;
    if (current && current.reopenedAt) record.reopenedAt = current.reopenedAt;
    if (submit) {
      record.submittedAt = now;
      record.completadaAt = now;
    }
    return record;
  }, undefined, false);

  if (!result.committed && locked) {
    return res.status(409).json({ error: 'El informe ya fue entregado.', attempt: publicAttempt(result.snapshot.val(), version) });
  }
  if (!result.committed && missingForSubmit.length) {
    return res.status(400).json({ error: `Completa primero las ${missingForSubmit.length} partes obligatorias del informe.`, missing: missingForSubmit.map(question => question.label) });
  }
  if (!result.committed) throw visibleError('No se pudo guardar el informe. Recarga e inténtalo otra vez.', 409);
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

async function handleAdminPair(req, res, admin, db, version) {
  await verifyAdmin(req, admin, db);
  if (!version.supportsPairs) throw visibleError('Esta versión del informe no admite parejas.');
  const input = body(req);
  const curso = String(input.curso || '').toUpperCase();
  const firstN = Number(input.firstN);
  const secondN = Number(input.secondN);
  const first = ROSTER.find(item => item.curso === curso && item.n === firstN);
  const second = ROSTER.find(item => item.curso === curso && item.n === secondN);
  if (!first || !second || !version.cursos.includes(curso) || !supportsPairsFor(version, first) || !supportsPairsFor(version, second)) return res.status(404).json({ error: 'No se encontraron ambos estudiantes en un curso habilitado para parejas.' });
  const pair = await validatePairStudents(db, version, first, second);
  const target = await migratePair(db, version, pair, first);
  return res.status(200).json({
    ok: true,
    team: pair.members.map(publicStudent),
    attempt: publicAttempt(target.value, version)
  });
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
    if (action === 'join-pair') return await handleJoinPair(req, res, db, version);
    if (action === 'save') return await handleSave(req, res, db, version, false);
    if (action === 'submit') return await handleSave(req, res, db, version, true);
    if (action === 'admin-pair') return await handleAdminPair(req, res, admin, db, version);
    if (action === 'admin-reset') return await handleAdminReset(req, res, admin, db, version);
    return res.status(400).json({ error: 'Acción no reconocida.' });
  } catch (error) {
    const status = error.status || (/token|auth/i.test(error.code || error.message) ? 401 : 500);
    console.error('[informe-tecnico]', action, error.message);
    const message = error.visible ? error.message : status === 500 ? 'No se pudo procesar la solicitud.' : 'No autorizado.';
    return res.status(status).json({ error: message });
  }
};
