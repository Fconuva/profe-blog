// Panel docente compartido para las interrogaciones de NM3 y NM4.
// Cada instrumento conserva su nómina, docentes y nodo Firebase. La API nunca
// entrega RUN y valida toda escritura en servidor.
const crypto = require('crypto');
const admin = require('firebase-admin');
const ROSTER_NM4 = require('./_roster_nm4');
const { ROSTER_ROWS: ROSTER_ROWS_NM3 } = require('./_roster_nm3');

const DATABASE_URL = process.env.FIREBASE_DATABASE_URL
  || 'https://estudiacest-default-rtdb.firebaseio.com';
const DEFAULT_STORAGE_BUCKET = 'estudiacest.firebasestorage.app';
const STORAGE_PREFIX = 'interrogaciones_2026';
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
const RESERVATION_TTL = 20 * 60 * 1000;
const PUNTAJES_VALIDOS = new Set([0, 0.2, 0.4, 0.6, 0.8, 1]);

function privateKey(raw) {
  return String(raw || '').replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey(process.env.FIREBASE_PRIVATE_KEY)
    }),
    databaseURL: DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_STORAGE_BUCKET
  });
}
const db = admin.database();
const hash = (text) => crypto.createHash('sha256').update(String(text || '')).digest('hex');
const idAlumno = (curso, numero, nombre) =>
  `${curso}_${String(numero).padStart(2, '0')}_${hash(`${curso}|${nombre}`).slice(0, 8)}`;

function normalizarNm3(rows) {
  const roster = {};
  for (const [, nombre, curso] of rows) {
    if (!roster[curso]) roster[curso] = [];
    roster[curso].push({ n: roster[curso].length + 1, nombre });
  }
  return roster;
}

function configurarAlumnos(roster) {
  const alumnos = new Map();
  for (const [curso, lista] of Object.entries(roster)) {
    for (const alumno of lista) {
      const id = idAlumno(curso, alumno.n, alumno.nombre);
      alumnos.set(id, { id, curso, n: alumno.n, nombre: alumno.nombre });
    }
  }
  return alumnos;
}

const INSTRUMENTOS = {
  nm3: {
    base: 'evaluaciones_nm3/interrogacion_lugar_sin_limites_2026',
    docentes: {
      francisco: { nombre: 'Francisco Núñez', cursos: ['3A', '3B', '3D'] },
      alicia: { nombre: 'Alicia Aguilera', cursos: ['3A'] },
      pia: { nombre: 'Pía Benavides', cursos: ['3B'] },
      joselin: { nombre: 'Joselin Díaz', cursos: ['3D'] }
    },
    roster: normalizarNm3(ROSTER_ROWS_NM3)
  },
  nm4: {
    base: 'evaluaciones_nm4/interrogacion_mocha_dick_2026',
    docentes: {
      francisco: { nombre: 'Francisco Núñez', cursos: ['4ATP', '4BTP', '4CTP', '4DTP', '4ETP'] },
      alicia: { nombre: 'Alicia Aguilera', cursos: ['4ATP'] },
      joselin: { nombre: 'Joselin Díaz', cursos: ['4DTP', '4ETP'] },
      pia: { nombre: 'Pía Benavides', cursos: ['4BTP', '4CTP'] }
    },
    roster: ROSTER_NM4
  }
};
for (const instrumento of Object.values(INSTRUMENTOS)) {
  instrumento.alumnos = configurarAlumnos(instrumento.roster);
}

function preguntasValidas(value) {
  if (!Array.isArray(value) || value.length !== 7) return null;
  const preguntas = value.map(Number);
  if (preguntas.some((n) => !Number.isInteger(n) || n < 1 || n > 50)) return null;
  return new Set(preguntas).size === 7 ? preguntas : null;
}

function puntajesValidos(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const puntajes = {};
  for (const [key, raw] of Object.entries(value)) {
    const posicion = Number(key);
    const puntaje = Number(raw);
    if (!Number.isInteger(posicion) || posicion < 0 || posicion > 6
      || !PUNTAJES_VALIDOS.has(puntaje)) return null;
    puntajes[posicion] = puntaje;
  }
  return puntajes;
}

function nota(puntajes) {
  const suma = Object.values(puntajes).reduce((total, valor) => total + valor, 0);
  return Math.max(1, Math.round(suma * 10) / 10);
}

function cuerpoJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function textoLimitado(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function nombreArchivoSeguro(value) {
  return textoLimitado(value || 'respuesta.webm', 180)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'respuesta.webm';
}

function idValido(value) {
  const clean = textoLimitado(value, 90);
  return /^[A-Za-z0-9_-]{8,90}$/.test(clean) ? clean : '';
}

function tipoAudioValido(value) {
  const clean = textoLimitado(value, 120).toLowerCase();
  return /^audio\/(webm|ogg|mp4|mpeg|wav|x-m4a|aac)(?:[;,]|$)/.test(clean) ? clean : '';
}

function grabacionPublica(value) {
  if (!value || typeof value !== 'object') return null;
  const respuestas = value.respuestas && typeof value.respuestas === 'object'
    ? Object.fromEntries(Object.entries(value.respuestas).map(([posicion, item]) => [posicion, {
      posicion: Number(item.posicion),
      pregunta: Number(item.pregunta),
      size: Number(item.size || 0),
      duracionMs: Number(item.duracionMs || 0),
      fecha: item.fecha || ''
    }]))
    : {};
  return {
    intentoId: value.intentoId || '',
    alumno: value.alumno || '',
    curso: value.curso || '',
    preguntas: Array.isArray(value.preguntas) ? value.preguntas.map(Number) : [],
    respuestas,
    estado: value.estado || 'en_curso',
    docente: value.docente || '',
    fechaInicio: value.fechaInicio || '',
    fechaEntrega: value.fechaEntrega || '',
    fechaCalificacion: value.fechaCalificacion || '',
    nota: value.nota == null ? null : Number(value.nota)
  };
}

function bucket() {
  return admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || DEFAULT_STORAGE_BUCKET);
}

async function borrarArchivosGrabacion(value) {
  if (!value || typeof value !== 'object') return;
  const archivos = [];
  for (const item of Object.values(value.respuestas || {})) {
    if (item && item.storagePath) archivos.push(item.storagePath);
  }
  for (const item of Object.values(value.reservas || {})) {
    if (item && item.storagePath) archivos.push(item.storagePath);
  }
  await Promise.all(archivos.map((storagePath) =>
    bucket().file(storagePath).delete({ ignoreNotFound: true }).catch(() => {})
  ));
}

async function urlFirmada(storagePath) {
  const [url] = await bucket().file(storagePath).getSignedUrl({
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000
  });
  return url;
}

function hashSeguro(value, expectedHash) {
  const actual = Buffer.from(hash(value));
  const expected = Buffer.from(String(expectedHash || ''));
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function verificarAgenteRevision(req) {
  const key = textoLimitado(req.headers && req.headers['x-review-key'], 300);
  if (!key || !hashSeguro(key, process.env.INTERROGACION_REVIEW_AGENT_HASH)) {
    const error = new Error('No autorizado');
    error.statusCode = 401;
    throw error;
  }
}

async function auditarFirebase(instrumento, docente) {
  const token = crypto.randomBytes(12).toString('hex');
  const ref = db.ref(`${instrumento.base}/_auditoria/${token}`);
  const storagePath = `${STORAGE_PREFIX}/_auditoria/${token}/prueba.webm`;
  const storageFile = bucket().file(storagePath);
  const registro = { docente: docente.nombre, creado: Date.now(), tipo: 'integridad' };
  try {
    await ref.set(registro);
    await storageFile.save(Buffer.from('audio-audit'), { contentType: 'audio/webm', resumable: false });
    const lectura = (await ref.once('value')).val();
    const [metadata] = await storageFile.getMetadata();
    const url = await urlFirmada(storagePath);
    const respuesta = await fetch(url);
    return Boolean(lectura && lectura.tipo === 'integridad'
      && Number(metadata.size) === 11 && respuesta.ok && (await respuesta.arrayBuffer()).byteLength === 11);
  } finally {
    await Promise.all([
      ref.remove().catch(() => {}),
      storageFile.delete({ ignoreNotFound: true }).catch(() => {})
    ]);
  }
}

async function iniciarGrabacion(instrumento, docente, docenteId, cuerpo) {
  const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
  if (!alumno || !docente.cursos.includes(alumno.curso)) {
    return { status: 403, body: { error: 'Ese estudiante no corresponde a tus cursos.' } };
  }
  const preguntas = preguntasValidas(cuerpo.preguntas);
  const intentoId = idValido(cuerpo.intentoId);
  if (!preguntas || !intentoId) {
    return { status: 400, body: { error: 'No fue posible iniciar el registro de las preguntas.' } };
  }
  const ref = db.ref(`${instrumento.base}/grabaciones/${alumno.id}`);
  const anterior = (await ref.once('value')).val();
  if (anterior && anterior.intentoId === intentoId) {
    return { status: 200, body: { ok: true, grabacion: grabacionPublica(anterior) } };
  }
  if (anterior && cuerpo.reemplazar !== true) {
    return { status: 409, body: { error: 'Ya existe una grabación para este estudiante.' } };
  }
  const registro = {
    intentoId,
    alumno: alumno.nombre,
    curso: alumno.curso,
    preguntas,
    respuestas: {},
    reservas: {},
    estado: 'en_curso',
    docente: docente.nombre,
    docenteId,
    fechaInicio: new Date().toISOString(),
    fechaEntrega: '',
    fechaCalificacion: '',
    nota: null
  };
  await ref.set(registro);
  if (anterior) {
    await borrarArchivosGrabacion(anterior);
    const notaAnterior = (await db.ref(`${instrumento.base}/notas/${alumno.id}`).once('value')).val();
    if (notaAnterior && notaAnterior.intentoId === anterior.intentoId) {
      await db.ref(`${instrumento.base}/notas/${alumno.id}`).remove();
    }
  }
  return { status: 200, body: { ok: true, grabacion: grabacionPublica(registro) } };
}

async function prepararAudio(instrumentoId, instrumento, docente, docenteId, cuerpo) {
  const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
  if (!alumno || !docente.cursos.includes(alumno.curso)) {
    return { status: 403, body: { error: 'Ese estudiante no corresponde a tus cursos.' } };
  }
  const intentoId = idValido(cuerpo.intentoId);
  const fileId = idValido(cuerpo.fileId);
  const posicion = Number(cuerpo.posicion);
  const pregunta = Number(cuerpo.pregunta);
  const size = Number(cuerpo.size || 0);
  const contentType = tipoAudioValido(cuerpo.contentType);
  if (!intentoId || !fileId || !Number.isInteger(posicion) || posicion < 0 || posicion > 6
    || !Number.isInteger(pregunta) || pregunta < 1 || pregunta > 50
    || !Number.isInteger(size) || size <= 0 || size > MAX_AUDIO_BYTES || !contentType) {
    return { status: 400, body: { error: 'El audio o su identificación no son válidos.' } };
  }
  const ref = db.ref(`${instrumento.base}/grabaciones/${alumno.id}`);
  const snapshot = await ref.once('value');
  const registro = snapshot.val();
  if (!registro || registro.intentoId !== intentoId || registro.estado !== 'en_curso'
    || !Array.isArray(registro.preguntas) || Number(registro.preguntas[posicion]) !== pregunta) {
    return { status: 409, body: { error: 'La grabación ya no coincide con la pregunta actual.' } };
  }
  const fileName = nombreArchivoSeguro(cuerpo.name);
  const storagePath = `${STORAGE_PREFIX}/${instrumentoId}/${docenteId}/${alumno.id}/${intentoId}/${posicion}/${fileId}/${fileName}`;
  const now = Date.now();
  const reservas = Object.fromEntries(Object.entries(registro.reservas || {})
    .filter(([, item]) => Number(item.creada || 0) >= now - RESERVATION_TTL));
  reservas[fileId] = { fileId, storagePath, posicion, pregunta, size, contentType, fileName, creada: now };
  await ref.update({ reservas });
  const uid = `interrogacion_${instrumentoId}_${hash(`${docenteId}|${alumno.id}|${intentoId}`).slice(0, 32)}`;
  const customToken = await admin.auth().createCustomToken(uid, {
    interrogacionAudio: true,
    instrumento: instrumentoId,
    docente: docenteId,
    alumnoId: alumno.id,
    intentoId,
    posicion: String(posicion),
    fileId,
    fileName,
    uploadMaxBytes: size
  });
  return { status: 200, body: { ok: true, customToken, storagePath } };
}

async function registrarAudio(instrumento, docente, cuerpo) {
  const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
  if (!alumno || !docente.cursos.includes(alumno.curso)) {
    return { status: 403, body: { error: 'Ese estudiante no corresponde a tus cursos.' } };
  }
  const intentoId = idValido(cuerpo.intentoId);
  const fileId = idValido(cuerpo.fileId);
  const posicion = Number(cuerpo.posicion);
  const duracionMs = Math.round(Number(cuerpo.duracionMs || 0));
  if (!intentoId || !fileId || !Number.isInteger(posicion) || posicion < 0 || posicion > 6
    || !Number.isFinite(duracionMs) || duracionMs < 0) {
    return { status: 400, body: { error: 'La duración o identificación del audio no es válida.' } };
  }
  const ref = db.ref(`${instrumento.base}/grabaciones/${alumno.id}`);
  const before = (await ref.once('value')).val();
  if (!before || before.intentoId !== intentoId || before.estado !== 'en_curso') {
    return { status: 409, body: { error: 'La grabación ya no está disponible para recibir audios.' } };
  }
  const reserva = before.reservas && before.reservas[fileId];
  const repetido = before.respuestas && before.respuestas[posicion];
  if (!reserva) {
    if (repetido && repetido.fileId === fileId) {
      return { status: 200, body: { ok: true, respuesta: grabacionPublica(before).respuestas[posicion] } };
    }
    return { status: 409, body: { error: 'La autorización de carga venció. Graba la respuesta nuevamente.' } };
  }
  if (Number(reserva.posicion) !== posicion || reserva.storagePath !== textoLimitado(cuerpo.storagePath, 900)) {
    return { status: 400, body: { error: 'La ruta del audio no coincide con la pregunta.' } };
  }
  const cloudFile = bucket().file(reserva.storagePath);
  const [metadata] = await cloudFile.getMetadata();
  const size = Number(metadata.size || 0);
  const contentType = tipoAudioValido(metadata.contentType || reserva.contentType);
  if (!size || size > Number(reserva.size) || size > MAX_AUDIO_BYTES || !contentType) {
    await cloudFile.delete({ ignoreNotFound: true });
    return { status: 400, body: { error: 'El archivo recibido no es un audio válido.' } };
  }
  const respuesta = {
    fileId,
    storagePath: reserva.storagePath,
    posicion,
    pregunta: Number(reserva.pregunta),
    size,
    contentType,
    duracionMs,
    fecha: new Date().toISOString()
  };
  const anterior = repetido && repetido.storagePath !== respuesta.storagePath ? repetido : null;
  const transaction = await ref.transaction((current) => {
    // RTDB puede invocar primero la transacción con una caché local vacía.
    // Reutilizar la lectura validada evita rechazar una carga legítima.
    const active = current || before;
    if (!active || active.intentoId !== intentoId || active.estado !== 'en_curso') return;
    if (!active.reservas || !active.reservas[fileId]) return;
    active.respuestas = active.respuestas || {};
    active.respuestas[posicion] = respuesta;
    delete active.reservas[fileId];
    return active;
  }, undefined, false);
  if (!transaction.committed) {
    await cloudFile.delete({ ignoreNotFound: true }).catch(() => {});
    return { status: 409, body: { error: 'No se pudo asociar el audio. Graba la respuesta nuevamente.' } };
  }
  if (anterior && anterior.storagePath) {
    await bucket().file(anterior.storagePath).delete({ ignoreNotFound: true }).catch(() => {});
  }
  return {
    status: 200,
    body: { ok: true, respuesta: grabacionPublica(transaction.snapshot.val()).respuestas[posicion] }
  };
}

async function entregarGrabacion(instrumento, docente, cuerpo) {
  const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
  if (!alumno || !docente.cursos.includes(alumno.curso)) {
    return { status: 403, body: { error: 'Ese estudiante no corresponde a tus cursos.' } };
  }
  const intentoId = idValido(cuerpo.intentoId);
  const ref = db.ref(`${instrumento.base}/grabaciones/${alumno.id}`);
  const snapshot = await ref.once('value');
  const registro = snapshot.val();
  const respuestas = registro && registro.respuestas ? registro.respuestas : {};
  const completas = Array.from({ length: 7 }, (_, posicion) => {
    const respuesta = respuestas[posicion];
    return respuesta && Number(respuesta.pregunta) === Number(registro.preguntas[posicion]);
  }).every(Boolean);
  if (!registro || registro.intentoId !== intentoId || !completas) {
    return { status: 409, body: { error: 'Deben quedar guardadas las siete respuestas antes de finalizar.' } };
  }
  const fechaEntrega = new Date().toISOString();
  await ref.update({ estado: 'pendiente', fechaEntrega, reservas: {} });
  return { status: 200, body: { ok: true, estado: 'pendiente', fechaEntrega } };
}

async function audioUrl(instrumento, docente, cuerpo) {
  const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
  if (!alumno || !docente.cursos.includes(alumno.curso)) {
    return { status: 403, body: { error: 'Ese estudiante no corresponde a tus cursos.' } };
  }
  const intentoId = idValido(cuerpo.intentoId);
  const posicion = Number(cuerpo.posicion);
  const registro = (await db.ref(`${instrumento.base}/grabaciones/${alumno.id}`).once('value')).val();
  const respuesta = registro && registro.respuestas && registro.respuestas[posicion];
  if (!registro || registro.intentoId !== intentoId || !respuesta || !respuesta.storagePath) {
    return { status: 404, body: { error: 'Audio no encontrado.' } };
  }
  return {
    status: 200,
    body: { ok: true, url: await urlFirmada(respuesta.storagePath), contentType: respuesta.contentType }
  };
}

async function borrarGrabacion(instrumento, docente, cuerpo) {
  const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
  if (!alumno || !docente.cursos.includes(alumno.curso)) {
    return { status: 403, body: { error: 'Ese estudiante no corresponde a tus cursos.' } };
  }
  const ref = db.ref(`${instrumento.base}/grabaciones/${alumno.id}`);
  const registro = (await ref.once('value')).val();
  if (registro) await borrarArchivosGrabacion(registro);
  await ref.remove();
  const notaRef = db.ref(`${instrumento.base}/notas/${alumno.id}`);
  const notaActual = (await notaRef.once('value')).val();
  if (registro && notaActual && notaActual.intentoId === registro.intentoId) await notaRef.remove();
  return { status: 200, body: { ok: true } };
}

async function listaRevisionAgente(instrumentoId, instrumento) {
  const grabaciones = (await db.ref(`${instrumento.base}/grabaciones`).once('value')).val() || {};
  const rows = [];
  for (const [alumnoId, value] of Object.entries(grabaciones)) {
    if (!value || !['pendiente', 'calificada'].includes(value.estado)) continue;
    rows.push({
      instrumento: instrumentoId,
      alumnoId,
      intentoId: value.intentoId,
      curso: value.curso,
      preguntas: value.preguntas,
      estado: value.estado,
      fechaEntrega: value.fechaEntrega || '',
      respuestas: grabacionPublica(value).respuestas
    });
  }
  return rows;
}

async function audioRevisionAgente(instrumento, cuerpo) {
  const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
  const intentoId = idValido(cuerpo.intentoId);
  const posicion = Number(cuerpo.posicion);
  if (!alumno || !intentoId || !Number.isInteger(posicion) || posicion < 0 || posicion > 6) {
    return { status: 400, body: { error: 'Referencia de audio inválida.' } };
  }
  const registro = (await db.ref(`${instrumento.base}/grabaciones/${alumno.id}`).once('value')).val();
  const respuesta = registro && registro.respuestas && registro.respuestas[posicion];
  if (!registro || registro.intentoId !== intentoId || !respuesta || !respuesta.storagePath) {
    return { status: 404, body: { error: 'Audio no encontrado.' } };
  }
  return {
    status: 200,
    body: {
      ok: true,
      pregunta: Number(respuesta.pregunta),
      duracionMs: Number(respuesta.duracionMs || 0),
      url: await urlFirmada(respuesta.storagePath)
    }
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const cuerpo = cuerpoJson(req);

  // Compatibilidad: el panel histórico de Mocha Dick no enviaba instrumento.
  const instrumentoId = cuerpo.instrumento === 'nm3' ? 'nm3' : 'nm4';
  const instrumento = INSTRUMENTOS[instrumentoId];
  const accion = String(cuerpo.accion || 'nomina');
  if (accion === 'revision-agente-lista' || accion === 'revision-agente-audio') {
    try {
      verificarAgenteRevision(req);
      if (accion === 'revision-agente-lista') {
        return res.status(200).json({ ok: true, grabaciones: await listaRevisionAgente(instrumentoId, instrumento) });
      }
      const resultado = await audioRevisionAgente(instrumento, cuerpo);
      return res.status(resultado.status).json(resultado.body);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.statusCode === 401 ? 'No autorizado.' : 'No se pudo completar la operación.' });
    }
  }
  const docenteId = String(cuerpo.docente || 'francisco').toLowerCase();
  const docente = instrumento.docentes[docenteId];
  if (!docente) return res.status(404).json({ error: 'Panel docente no encontrado.' });

  try {
    if (accion === 'nomina') {
      const cursos = {};
      for (const curso of docente.cursos) {
        cursos[curso] = (instrumento.roster[curso] || []).map((alumno) => ({
          id: idAlumno(curso, alumno.n, alumno.nombre),
          n: alumno.n,
          nombre: alumno.nombre
        }));
      }
      const guardadas = (await db.ref(`${instrumento.base}/notas`).once('value')).val() || {};
      const audiosGuardados = (await db.ref(`${instrumento.base}/grabaciones`).once('value')).val() || {};
      const notas = {};
      for (const [id, registro] of Object.entries(guardadas)) {
        const alumno = instrumento.alumnos.get(id);
        if (alumno && docente.cursos.includes(alumno.curso)) notas[id] = registro;
      }
      const grabaciones = {};
      for (const [id, registro] of Object.entries(audiosGuardados)) {
        const alumno = instrumento.alumnos.get(id);
        if (alumno && docente.cursos.includes(alumno.curso)) grabaciones[id] = grabacionPublica(registro);
      }
      return res.status(200).json({ docente: docente.nombre, cursos, notas, grabaciones });
    }

    if (accion === 'iniciar-grabacion') {
      const resultado = await iniciarGrabacion(instrumento, docente, docenteId, cuerpo);
      return res.status(resultado.status).json(resultado.body);
    }

    if (accion === 'preparar-audio') {
      const resultado = await prepararAudio(instrumentoId, instrumento, docente, docenteId, cuerpo);
      return res.status(resultado.status).json(resultado.body);
    }

    if (accion === 'registrar-audio') {
      const resultado = await registrarAudio(instrumento, docente, cuerpo);
      return res.status(resultado.status).json(resultado.body);
    }

    if (accion === 'entregar-grabacion') {
      const resultado = await entregarGrabacion(instrumento, docente, cuerpo);
      return res.status(resultado.status).json(resultado.body);
    }

    if (accion === 'audio-url') {
      const resultado = await audioUrl(instrumento, docente, cuerpo);
      return res.status(resultado.status).json(resultado.body);
    }

    if (accion === 'borrar-grabacion') {
      const resultado = await borrarGrabacion(instrumento, docente, cuerpo);
      return res.status(resultado.status).json(resultado.body);
    }

    if (accion === 'guardar') {
      const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
      if (!alumno || !docente.cursos.includes(alumno.curso)) {
        return res.status(403).json({ error: 'Ese estudiante no corresponde a tus cursos.' });
      }
      const preguntas = preguntasValidas(cuerpo.preguntas);
      const puntajes = puntajesValidos(cuerpo.puntajes);
      const cambiada = cuerpo.cambiada == null ? null : Number(cuerpo.cambiada);
      const intentoId = cuerpo.intentoId ? idValido(cuerpo.intentoId) : '';
      if (!preguntas) {
        return res.status(400).json({ error: 'El sorteo debe contener siete preguntas distintas del banco.' });
      }
      if (!puntajes) return res.status(400).json({ error: 'Los puntajes recibidos no son válidos.' });
      if (cambiada !== null && (!Number.isInteger(cambiada) || cambiada < 0 || cambiada > 6)) {
        return res.status(400).json({ error: 'El cambio de pregunta no es válido.' });
      }
      let grabacion = null;
      if (cuerpo.intentoId) {
        grabacion = (await db.ref(`${instrumento.base}/grabaciones/${alumno.id}`).once('value')).val();
        if (!intentoId || !grabacion || grabacion.intentoId !== intentoId
          || !['pendiente', 'calificada'].includes(grabacion.estado)
          || JSON.stringify(grabacion.preguntas) !== JSON.stringify(preguntas)) {
          return res.status(409).json({ error: 'Los audios no coinciden con esta calificación.' });
        }
      }
      const registro = {
        alumno: alumno.nombre,
        curso: alumno.curso,
        preguntas,
        puntajes,
        cambiada,
        observacion: String(cuerpo.observacion || '').slice(0, 500),
        nota: nota(puntajes),
        docente: docente.nombre,
        fecha: new Date().toISOString(),
        intentoId: intentoId || null,
        modalidad: intentoId ? 'audio' : 'en_vivo'
      };
      await db.ref(`${instrumento.base}/notas/${alumno.id}`).set(registro);
      if (grabacion) {
        await db.ref(`${instrumento.base}/grabaciones/${alumno.id}`).update({
          estado: 'calificada',
          nota: registro.nota,
          fechaCalificacion: registro.fecha
        });
      }
      return res.status(200).json({ ok: true, id: alumno.id, nota: registro.nota });
    }

    if (accion === 'borrar') {
      const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
      if (!alumno || !docente.cursos.includes(alumno.curso)) {
        return res.status(403).json({ error: 'Ese estudiante no corresponde a tus cursos.' });
      }
      await db.ref(`${instrumento.base}/notas/${alumno.id}`).remove();
      const grabacionRef = db.ref(`${instrumento.base}/grabaciones/${alumno.id}`);
      const grabacion = (await grabacionRef.once('value')).val();
      if (grabacion && grabacion.estado === 'calificada') {
        await grabacionRef.update({ estado: 'pendiente', nota: null, fechaCalificacion: '' });
      }
      return res.status(200).json({ ok: true });
    }

    if (accion === 'auditar-firebase') {
      const ok = await auditarFirebase(instrumento, docente);
      return res.status(ok ? 200 : 500).json({ ok, cleaned: ok });
    }

    return res.status(400).json({ error: 'Acción no reconocida.' });
  } catch (error) {
    return res.status(500).json({
      error: 'No se pudo completar la operación.',
      detalle: String((error && error.message) || error)
    });
  }
};
