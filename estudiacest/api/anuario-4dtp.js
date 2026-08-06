const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const DEFAULT_STORAGE_BUCKET = 'estudiacest.firebasestorage.app';
const ADMIN_BASE = 'plataforma_estudiantes';
const STUDENTS_PATH = `${ADMIN_BASE}/nm4/4dtp/anuario_2026/students`;
const STORAGE_PREFIX = 'anuario_2026/4dtp';
const MAX_STUDENT_STORAGE = 100 * 1024 * 1024;
const MAX_FILE_SIZE = MAX_STUDENT_STORAGE;
const RESERVATION_TTL = 30 * 60 * 1000;

const ROSTER_ROWS = [
  ['227138548', 'ALVAREZ MEJIAS BENJAMIN DYLAN'],
  ['228751235', 'BECERRA SALAZAR FELIPE IGNACIO'],
  ['229447165', 'BERNAL MATUS IVAN PATRICIO'],
  ['223079628', 'CASTILLO ORÓSTICA PEDRO IGNACIO'],
  ['221130839', 'CASTRO ARAVENA ARNALDO DARIO ALEXANDER'],
  ['228895318', 'ESTAY QUILIÑAN BASTIAN BENJAMIN ANTONIO'],
  ['225308756', 'GONZALEZ CAMPOS BENJAMIN ALONSO'],
  ['227629851', 'GONZALEZ ZURA JOAQUIN ANTONIO'],
  ['228509671', 'GUAJARDO ALFARO ALEXIS ELIAS'],
  ['228850225', 'GUTIERREZ BARRIENTOS NICOLAS IGNACIO'],
  ['224883439', 'HERNANDEZ RETAMAL BENJAMÍN ALEJANDRO'],
  ['228101516', 'HORMAZABAL POBLETE FRANCISCO ALEJANDRO'],
  ['229641840', 'IBÁÑEZ FARÍAS BENJAMIN CRISTOBAL'],
  ['22512163K', 'LAGOS CIFUENTES JAVIER NICOLAS'],
  ['229296191', 'MARABOLI MORALES VALENTIN EDUARDO'],
  ['22796622K', 'MEDINA AGUILERA JOSETHOMAS SEBASTIAN'],
  ['224920261', 'MUÑOZ REBOLLEDO MICHAEL ALEJANDRO'],
  ['229873083', 'NAVARRO ROMERO TOMAS MARCELO'],
  ['230095639', 'PÉREZ ARAYA CÉSAR FERNANDO'],
  ['227661917', 'QUEZADA ARAYA CRHISTIAN JAVIER DE JESUS'],
  ['224086318', 'RAMIREZ SEPULVEDA EXEQUIEL ANDRES'],
  ['228477508', 'RIOS ARAYA BENJAMIN YASSEF OREL'],
  ['223704735', 'SAAVEDRA GONZALEZ FIDEL ALEXIS'],
  ['229630830', 'SALAS LASTRA BRAYAN JAIRO BECKAN'],
  ['226705724', 'SALAZAR MORALES VICENTE JAVIER'],
  ['22844975K', 'SILVA LEIVA JOAQUIN MATEO'],
  ['227110015', 'SUAZO ALVAREZ RUBEN ALEJANDRO'],
  ['230032858', 'VALENZUELA TOLOZA MARTIN ALEXIS'],
  ['286826598', 'VIRGUEZ LARA JAVIER ALEXANDER']
];

const ROSTER = ROSTER_ROWS.map(([rut, name]) => ({ rut, name, course: '4DTP' }));
const ROSTER_BY_RUT = new Map(ROSTER.map(student => [student.rut, student]));
const FILE_CATEGORIES = new Set(['interview_audio', 'photo', 'document', 'other']);
const INTERVIEW_TYPES = ['compañero', 'compañero', 'compañero', 'docente', 'docente'];

let initError = null;
function normalizePrivateKey(raw) {
  let key = String(raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

function ensureFirebase() {
  if (admin.apps.length) return;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (!privateKey) {
    initError = 'FIREBASE_PRIVATE_KEY no configurada';
    return;
  }
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_STORAGE_BUCKET
    });
  } catch (error) {
    initError = error.message;
  }
}

function cleanRut(value) {
  return String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
}

function formatRut(value) {
  const clean = cleanRut(value);
  if (clean.length < 2) return clean;
  return `${clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${clean.slice(-1)}`;
}

function limitedText(value, max) {
  return String(value || '').replace(/\r\n/g, '\n').trim().slice(0, max);
}

function safeFileName(value) {
  return String(value || 'archivo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(-140) || 'archivo';
}

function findStudent(value) {
  return ROSTER_BY_RUT.get(cleanRut(value)) || null;
}

function defaultInterviews() {
  return INTERVIEW_TYPES.map((kind, index) => ({
    slot: index + 1,
    kind,
    interviewee: '',
    transcription: '',
    audioFileId: '',
    updatedAt: 0
  }));
}

function sanitizeInterviews(raw, current) {
  const previous = Array.isArray(current) ? current : defaultInterviews();
  const supplied = Array.isArray(raw) ? raw : [];
  return INTERVIEW_TYPES.map((kind, index) => {
    const slot = index + 1;
    const incoming = supplied.find(item => Number(item && item.slot) === slot) || {};
    const old = previous.find(item => Number(item && item.slot) === slot) || {};
    return {
      slot,
      kind,
      interviewee: limitedText(incoming.interviewee, 140),
      transcription: limitedText(incoming.transcription, 12000),
      audioFileId: limitedText(old.audioFileId, 90),
      updatedAt: Date.now()
    };
  });
}

function studentRecord(student, current) {
  const value = current || {};
  return {
    profile: { name: student.name, rut: formatRut(student.rut), cleanRut: student.rut, course: student.course },
    interviews: Array.isArray(value.interviews) ? value.interviews : defaultInterviews(),
    files: value.files && typeof value.files === 'object' ? value.files : {},
    uploadReservations: value.uploadReservations && typeof value.uploadReservations === 'object' ? value.uploadReservations : {},
    projectNotes: limitedText(value.projectNotes, 4000),
    activity1Status: value.activity1Status === 'submitted' ? 'submitted' : 'draft',
    activity1SubmittedAt: Number(value.activity1SubmittedAt || 0),
    evaluation: value.evaluation && typeof value.evaluation === 'object' ? value.evaluation : { progressGrade: '', finalGrade: '', teacherNotes: '', updatedAt: 0 },
    createdAt: Number(value.createdAt || Date.now()),
    updatedAt: Number(value.updatedAt || 0)
  };
}

function publicFile(file) {
  return {
    id: file.id,
    name: file.name,
    category: file.category,
    slot: Number(file.slot || 0),
    contentType: file.contentType || 'application/octet-stream',
    size: Number(file.size || 0),
    createdAt: Number(file.createdAt || 0)
  };
}

function publicState(student, value) {
  const record = studentRecord(student, value);
  const usedBytes = Object.values(record.files).reduce((sum, file) => sum + Number(file.size || 0), 0);
  return {
    profile: record.profile,
    interviews: record.interviews,
    files: Object.values(record.files).map(publicFile).sort((a, b) => b.createdAt - a.createdAt),
    projectNotes: record.projectNotes,
    activity1Status: record.activity1Status,
    activity1SubmittedAt: record.activity1SubmittedAt,
    storage: {
      usedBytes,
      limitBytes: MAX_STUDENT_STORAGE,
      remainingBytes: Math.max(0, MAX_STUDENT_STORAGE - usedBytes)
    },
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function calculateProgress(record) {
  const interviews = Array.isArray(record.interviews) ? record.interviews : defaultInterviews();
  const completed = interviews.filter(item => item.interviewee && item.transcription.length >= 80 && item.audioFileId).length;
  const files = Object.values(record.files || {});
  return {
    completed,
    total: 5,
    audios: files.filter(file => file.category === 'interview_audio').length,
    photos: files.filter(file => file.category === 'photo').length,
    documents: files.filter(file => file.category === 'document').length,
    other: files.filter(file => file.category === 'other').length,
    usedBytes: files.reduce((sum, file) => sum + Number(file.size || 0), 0),
    limitBytes: MAX_STUDENT_STORAGE
  };
}

function jsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function setCors(req, res) {
  const origin = String((req.headers && req.headers.origin) || '').trim();
  const allowed = new Set([
    'https://estudiacest.com',
    'https://www.estudiacest.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4173',
    'http://127.0.0.1:4173'
  ]);
  res.setHeader('Access-Control-Allow-Origin', allowed.has(origin) ? origin : 'https://www.estudiacest.com');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}

async function verifyStudent(req) {
  ensureFirebase();
  if (initError) throw new Error(initError);
  const token = String((req.headers && req.headers.authorization) || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new Error('Token requerido');
  const decoded = await admin.auth().verifyIdToken(token);
  if (decoded.anuario4dtp !== true || !String(decoded.uid).startsWith('anuario_')) throw new Error('No autorizado');
  const student = findStudent(String(decoded.uid).slice('anuario_'.length));
  if (!student) throw new Error('No autorizado');
  return student;
}

async function verifyAdmin(req) {
  ensureFirebase();
  if (initError) throw new Error(initError);
  const token = String((req.headers && req.headers.authorization) || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new Error('Token requerido');
  const decoded = await admin.auth().verifyIdToken(token);
  const snapshot = await admin.database().ref(`${ADMIN_BASE}/admins/${decoded.uid}`).once('value');
  if (snapshot.val() !== true) throw new Error('No autorizado');
  return decoded;
}

function bucket() {
  ensureFirebase();
  if (initError) throw new Error(initError);
  return admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_STORAGE_BUCKET);
}

async function handleLogin(req, res) {
  const body = jsonBody(req);
  const student = findStudent(body.rut);
  if (!student) return res.status(404).json({ error: 'RUN no encontrado en la nómina vigente de 4°D TP.' });
  ensureFirebase();
  if (initError) throw new Error(initError);
  const ref = admin.database().ref(`${STUDENTS_PATH}/${student.rut}`);
  const snapshot = await ref.once('value');
  const current = snapshot.val();
  if (!current) await ref.set(studentRecord(student, null));
  const customToken = await admin.auth().createCustomToken(`anuario_${student.rut}`, { anuario4dtp: true, course: '4DTP' });
  return res.status(200).json({ ok: true, customToken, student: { name: student.name, rut: formatRut(student.rut), course: student.course }, state: publicState(student, current) });
}

async function handleState(req, res) {
  const student = await verifyStudent(req);
  const snapshot = await admin.database().ref(`${STUDENTS_PATH}/${student.rut}`).once('value');
  return res.status(200).json({ ok: true, state: publicState(student, snapshot.val()) });
}

async function handleSave(req, res) {
  const student = await verifyStudent(req);
  const body = jsonBody(req);
  const ref = admin.database().ref(`${STUDENTS_PATH}/${student.rut}`);
  const now = Date.now();
  await ref.transaction(current => {
    const record = studentRecord(student, current);
    record.interviews = sanitizeInterviews(body.interviews, record.interviews);
    record.projectNotes = limitedText(body.projectNotes, 4000);
    record.updatedAt = now;
    return record;
  }, undefined, false);
  return res.status(200).json({ ok: true, message: 'Avance guardado.', updatedAt: now });
}

function uploadRequest(body) {
  return {
    fileId: limitedText(body.fileId, 90),
    name: limitedText(body.name, 220),
    size: Number(body.size || 0),
    category: limitedText(body.category, 30),
    slot: Number(body.slot || 0),
    contentType: limitedText(body.contentType || 'application/octet-stream', 160)
  };
}

function uploadValidation(request) {
  if (!/^[A-Za-z0-9_-]{8,90}$/.test(request.fileId)) return 'Identificador de archivo inválido.';
  if (!request.name) return 'El archivo debe tener un nombre.';
  if (!Number.isInteger(request.size) || request.size <= 0 || request.size > MAX_FILE_SIZE) return 'El archivo está vacío o supera el cupo total de 100 MB.';
  if (!FILE_CATEGORIES.has(request.category)) return 'Categoría de archivo inválida.';
  if (request.category === 'interview_audio' && (request.slot < 1 || request.slot > 5)) return 'Selecciona la entrevista correspondiente.';
  return '';
}

async function handlePrepareUpload(req, res) {
  const student = await verifyStudent(req);
  const request = uploadRequest(jsonBody(req));
  const validation = uploadValidation(request);
  if (validation) return res.status(400).json({ error: validation });
  const storagePath = `${STORAGE_PREFIX}/${student.rut}/${request.category}/${request.fileId}/${safeFileName(request.name)}`;
  const ref = admin.database().ref(`${STUDENTS_PATH}/${student.rut}`);
  const now = Date.now();
  const transaction = await ref.transaction(current => {
    const record = studentRecord(student, current);
    record.uploadReservations = Object.fromEntries(Object.entries(record.uploadReservations).filter(([, reservation]) => Number(reservation.createdAt || 0) >= now - RESERVATION_TTL));
    const files = Object.values(record.files);
    let usedBytes = files.reduce((sum, file) => sum + Number(file.size || 0), 0);
    if (request.category === 'interview_audio') {
      const interview = record.interviews.find(item => Number(item.slot) === request.slot);
      const replaced = interview && record.files[interview.audioFileId];
      if (replaced) usedBytes -= Number(replaced.size || 0);
    }
    const reservedBytes = Object.values(record.uploadReservations).reduce((sum, reservation) => sum + Number(reservation.size || 0), 0);
    if (usedBytes + reservedBytes + request.size > MAX_STUDENT_STORAGE) return;
    record.uploadReservations[request.fileId] = { ...request, storagePath, createdAt: now };
    record.updatedAt = now;
    return record;
  }, undefined, false);
  if (!transaction.committed) return res.status(413).json({ error: 'Tu carpeta no tiene espacio suficiente. El máximo total es 100 MB.' });
  const customToken = await admin.auth().createCustomToken(`anuario_${student.rut}`, {
    anuario4dtp: true,
    course: '4DTP',
    uploadFileId: request.fileId,
    uploadCategory: request.category,
    uploadFileName: safeFileName(request.name),
    uploadMaxBytes: request.size
  });
  const state = publicState(student, transaction.snapshot.val());
  return res.status(200).json({ ok: true, customToken, storagePath, storage: state.storage });
}

async function handleRegisterFile(req, res) {
  const student = await verifyStudent(req);
  const body = jsonBody(req);
  const fileId = limitedText(body.fileId, 90);
  const ref = admin.database().ref(`${STUDENTS_PATH}/${student.rut}`);
  const before = await ref.once('value');
  const initialRecord = studentRecord(student, before.val());
  const reservation = initialRecord.uploadReservations[fileId];
  if (!reservation) return res.status(409).json({ error: 'La autorización de carga venció. Selecciona el archivo nuevamente.' });
  const storagePath = limitedText(body.storagePath, 900);
  if (storagePath !== reservation.storagePath) return res.status(400).json({ error: 'Ruta de archivo inválida.' });

  const cloudFile = bucket().file(storagePath);
  const [metadata] = await cloudFile.getMetadata();
  const size = Number(metadata.size || 0);
  if (!size || size > Number(reservation.size || 0) || size > MAX_FILE_SIZE) {
    await cloudFile.delete({ ignoreNotFound: true });
    return res.status(400).json({ error: 'El archivo está vacío o supera el cupo autorizado.' });
  }
  const fileRecord = {
    id: fileId,
    name: reservation.name,
    storagePath,
    category: reservation.category,
    slot: reservation.category === 'interview_audio' ? reservation.slot : 0,
    contentType: limitedText(metadata.contentType || reservation.contentType || 'application/octet-stream', 160),
    size,
    createdAt: Date.now()
  };

  let replaced = null;
  const transaction = await ref.transaction(current => {
    replaced = null;
    // RTDB can invoke the transaction once with an empty local cache before
    // retrying against the server. Reuse the reservation we just validated so
    // that this first pass does not abort a legitimate upload.
    const record = studentRecord(student, current || before.val());
    const activeReservation = record.uploadReservations[fileId];
    if (!activeReservation || activeReservation.storagePath !== storagePath) return;
    if (fileRecord.category === 'interview_audio') {
      const interview = record.interviews.find(item => Number(item.slot) === fileRecord.slot);
      if (interview && interview.audioFileId && record.files[interview.audioFileId]) replaced = record.files[interview.audioFileId];
      if (interview) {
        interview.audioFileId = fileId;
        interview.updatedAt = Date.now();
      }
    }
    record.files[fileId] = fileRecord;
    if (replaced) delete record.files[replaced.id];
    delete record.uploadReservations[fileId];
    record.updatedAt = Date.now();
    return record;
  }, undefined, false);
  if (!transaction.committed) {
    await cloudFile.delete({ ignoreNotFound: true }).catch(() => {});
    return res.status(409).json({ error: 'La autorización de carga venció. Selecciona el archivo nuevamente.' });
  }
  if (replaced && replaced.storagePath && replaced.storagePath !== storagePath) {
    await bucket().file(replaced.storagePath).delete({ ignoreNotFound: true }).catch(() => {});
  }
  return res.status(200).json({ ok: true, file: publicFile(fileRecord), storage: publicState(student, transaction.snapshot.val()).storage });
}

async function handleCancelUpload(req, res) {
  const student = await verifyStudent(req);
  const fileId = limitedText(jsonBody(req).fileId, 90);
  const ref = admin.database().ref(`${STUDENTS_PATH}/${student.rut}`);
  const snapshot = await ref.once('value');
  const record = studentRecord(student, snapshot.val());
  const reservation = record.uploadReservations[fileId];
  if (reservation && reservation.storagePath) await bucket().file(reservation.storagePath).delete({ ignoreNotFound: true }).catch(() => {});
  if (reservation) {
    delete record.uploadReservations[fileId];
    record.updatedAt = Date.now();
    await ref.set(record);
  }
  return res.status(200).json({ ok: true });
}

async function handleDeleteFile(req, res) {
  const student = await verifyStudent(req);
  const fileId = limitedText(jsonBody(req).fileId, 90);
  const ref = admin.database().ref(`${STUDENTS_PATH}/${student.rut}`);
  const snapshot = await ref.once('value');
  const record = studentRecord(student, snapshot.val());
  const file = record.files[fileId];
  if (!file || !String(file.storagePath || '').startsWith(`${STORAGE_PREFIX}/${student.rut}/`)) return res.status(404).json({ error: 'Archivo no encontrado.' });
  await bucket().file(file.storagePath).delete({ ignoreNotFound: true });
  delete record.files[fileId];
  record.interviews.forEach(interview => { if (interview.audioFileId === fileId) interview.audioFileId = ''; });
  record.updatedAt = Date.now();
  await ref.set(record);
  return res.status(200).json({ ok: true });
}

async function signedUrl(file) {
  const [url] = await bucket().file(file.storagePath).getSignedUrl({ action: 'read', expires: Date.now() + 15 * 60 * 1000 });
  return url;
}

async function handleFileUrl(req, res) {
  const student = await verifyStudent(req);
  const fileId = limitedText(req.query && req.query.fileId, 90);
  const snapshot = await admin.database().ref(`${STUDENTS_PATH}/${student.rut}/files/${fileId}`).once('value');
  const file = snapshot.val();
  if (!file || !String(file.storagePath || '').startsWith(`${STORAGE_PREFIX}/${student.rut}/`)) return res.status(404).json({ error: 'Archivo no encontrado.' });
  return res.status(200).json({ ok: true, url: await signedUrl(file) });
}

async function handleSubmitActivity(req, res) {
  const student = await verifyStudent(req);
  const ref = admin.database().ref(`${STUDENTS_PATH}/${student.rut}`);
  const snapshot = await ref.once('value');
  const record = studentRecord(student, snapshot.val());
  const progress = calculateProgress(record);
  if (progress.completed !== 5) return res.status(400).json({ error: 'Completa las cinco entrevistas con nombre, audio y transcripción antes de entregar.' });
  record.activity1Status = 'submitted';
  record.activity1SubmittedAt = Date.now();
  record.updatedAt = Date.now();
  await ref.set(record);
  return res.status(200).json({ ok: true, message: 'Avance de la Actividad 1 entregado.', submittedAt: record.activity1SubmittedAt });
}

async function handleAdminList(req, res) {
  await verifyAdmin(req);
  const snapshot = await admin.database().ref(STUDENTS_PATH).once('value');
  const records = snapshot.val() || {};
  const rows = ROSTER.map(student => {
    const record = studentRecord(student, records[student.rut]);
    return {
      name: student.name,
      rut: formatRut(student.rut),
      course: student.course,
      started: Boolean(records[student.rut]),
      activity1Status: record.activity1Status,
      activity1SubmittedAt: record.activity1SubmittedAt,
      updatedAt: record.updatedAt,
      progress: calculateProgress(record),
      evaluation: record.evaluation
    };
  });
  return res.status(200).json({ ok: true, rows });
}

async function handleAdminDetail(req, res) {
  await verifyAdmin(req);
  const student = findStudent(req.query && req.query.rut);
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  const snapshot = await admin.database().ref(`${STUDENTS_PATH}/${student.rut}`).once('value');
  const record = studentRecord(student, snapshot.val());
  return res.status(200).json({ ok: true, state: publicState(student, record), evaluation: record.evaluation });
}

function gradeValue(value) {
  if (value === '' || value == null) return '';
  const grade = Number(String(value).replace(',', '.'));
  if (!Number.isFinite(grade) || grade < 1 || grade > 7) throw new Error('La nota debe estar entre 1,0 y 7,0.');
  return Math.round(grade * 10) / 10;
}

async function handleAdminSaveEvaluation(req, res) {
  await verifyAdmin(req);
  const body = jsonBody(req);
  const student = findStudent(body.rut);
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  const evaluation = {
    progressGrade: gradeValue(body.progressGrade),
    finalGrade: gradeValue(body.finalGrade),
    teacherNotes: limitedText(body.teacherNotes, 2400),
    updatedAt: Date.now()
  };
  await admin.database().ref(`${STUDENTS_PATH}/${student.rut}/evaluation`).set(evaluation);
  return res.status(200).json({ ok: true, evaluation });
}

async function handleAdminFileUrl(req, res) {
  await verifyAdmin(req);
  const student = findStudent(req.query && req.query.rut);
  const fileId = limitedText(req.query && req.query.fileId, 90);
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  const snapshot = await admin.database().ref(`${STUDENTS_PATH}/${student.rut}/files/${fileId}`).once('value');
  const file = snapshot.val();
  if (!file) return res.status(404).json({ error: 'Archivo no encontrado.' });
  return res.status(200).json({ ok: true, url: await signedUrl(file) });
}

async function handleAdminReset(req, res) {
  await verifyAdmin(req);
  const student = findStudent(jsonBody(req).rut);
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado.' });
  await bucket().deleteFiles({ prefix: `${STORAGE_PREFIX}/${student.rut}/` });
  await admin.database().ref(`${STUDENTS_PATH}/${student.rut}`).remove();
  return res.status(200).json({ ok: true });
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const action = String((req.query && req.query.action) || 'health');
    if (action === 'health' && req.method === 'GET') return res.status(200).json({ ok: true, project: 'anuario-4dtp-2026', rosterCount: ROSTER.length, maxFileSize: MAX_FILE_SIZE, maxStudentStorage: MAX_STUDENT_STORAGE, storageBucket: process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_STORAGE_BUCKET });
    if (action === 'login' && req.method === 'POST') return await handleLogin(req, res);
    if (action === 'state' && req.method === 'GET') return await handleState(req, res);
    if (action === 'save' && req.method === 'POST') return await handleSave(req, res);
    if (action === 'prepare-upload' && req.method === 'POST') return await handlePrepareUpload(req, res);
    if (action === 'register-file' && req.method === 'POST') return await handleRegisterFile(req, res);
    if (action === 'cancel-upload' && req.method === 'POST') return await handleCancelUpload(req, res);
    if (action === 'delete-file' && req.method === 'POST') return await handleDeleteFile(req, res);
    if (action === 'file-url' && req.method === 'GET') return await handleFileUrl(req, res);
    if (action === 'submit-activity1' && req.method === 'POST') return await handleSubmitActivity(req, res);
    if (action === 'admin-list' && req.method === 'GET') return await handleAdminList(req, res);
    if (action === 'admin-detail' && req.method === 'GET') return await handleAdminDetail(req, res);
    if (action === 'admin-save-evaluation' && req.method === 'POST') return await handleAdminSaveEvaluation(req, res);
    if (action === 'admin-file-url' && req.method === 'GET') return await handleAdminFileUrl(req, res);
    if (action === 'admin-reset' && req.method === 'POST') return await handleAdminReset(req, res);
    return res.status(405).json({ error: 'Método o acción no disponible.' });
  } catch (error) {
    console.error('[anuario-4dtp]', error);
    const status = /no autorizado|token requerido/i.test(error.message) ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? 'Sesión no autorizada.' : 'No se pudo procesar la solicitud.' });
  }
};
