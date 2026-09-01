// Panel docente compartido para las interrogaciones de NM3 y NM4.
// Cada instrumento conserva su nómina, docentes y nodo Firebase. La API nunca
// entrega RUN y valida toda escritura en servidor.
const crypto = require('crypto');
const admin = require('firebase-admin');
const ROSTER_NM4 = require('./_roster_nm4');
const { ROSTER_ROWS: ROSTER_ROWS_NM3 } = require('./_roster_nm3');

const DATABASE_URL = process.env.FIREBASE_DATABASE_URL
  || 'https://estudiacest-default-rtdb.firebaseio.com';
const CLAVE_COMPARTIDA_HASH = process.env.INTERROGACION_HASH
  || 'ee4a8b655746dcfa0fdf21e73c12221d5961b49b31e86d889b1d7b56703107b4';
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
    databaseURL: DATABASE_URL
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
    claveHash: process.env.INTERROGACION_NM3_HASH || CLAVE_COMPARTIDA_HASH,
    docentes: {
      francisco: { nombre: 'Francisco Núñez', cursos: ['3A', '3B', '3D'] }
    },
    roster: normalizarNm3(ROSTER_ROWS_NM3)
  },
  nm4: {
    base: 'evaluaciones_nm4/interrogacion_mocha_dick_2026',
    claveHash: CLAVE_COMPARTIDA_HASH,
    docentes: {
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

function hashValido(entregado, esperado) {
  const recibido = Buffer.from(hash(entregado));
  const referencia = Buffer.from(esperado);
  return recibido.length === referencia.length
    && crypto.timingSafeEqual(recibido, referencia);
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

async function auditarFirebase(instrumento, docente) {
  const token = crypto.randomBytes(12).toString('hex');
  const ref = db.ref(`${instrumento.base}/_auditoria/${token}`);
  const registro = { docente: docente.nombre, creado: Date.now(), tipo: 'integridad' };
  await ref.set(registro);
  const lectura = (await ref.once('value')).val();
  await ref.remove();
  const eliminado = !(await ref.once('value')).exists();
  return Boolean(lectura && lectura.tipo === 'integridad' && eliminado);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  let cuerpo = req.body;
  if (typeof cuerpo === 'string') {
    try { cuerpo = JSON.parse(cuerpo); } catch (_) { cuerpo = {}; }
  }
  cuerpo = cuerpo || {};

  // Compatibilidad: el panel histórico de Mocha Dick no enviaba instrumento.
  const instrumentoId = cuerpo.instrumento === 'nm3' ? 'nm3' : 'nm4';
  const instrumento = INSTRUMENTOS[instrumentoId];
  const accion = String(cuerpo.accion || 'nomina');
  const docente = instrumento.docentes[String(cuerpo.docente || '').toLowerCase()];
  if (!docente || !hashValido(cuerpo.clave, instrumento.claveHash)) {
    return res.status(401).json({ error: 'Clave o docente incorrectos.' });
  }

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
      const notas = {};
      for (const [id, registro] of Object.entries(guardadas)) {
        const alumno = instrumento.alumnos.get(id);
        if (alumno && docente.cursos.includes(alumno.curso)) notas[id] = registro;
      }
      return res.status(200).json({ docente: docente.nombre, cursos, notas });
    }

    if (accion === 'guardar') {
      const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
      if (!alumno || !docente.cursos.includes(alumno.curso)) {
        return res.status(403).json({ error: 'Ese estudiante no corresponde a tus cursos.' });
      }
      const preguntas = preguntasValidas(cuerpo.preguntas);
      const puntajes = puntajesValidos(cuerpo.puntajes);
      const cambiada = cuerpo.cambiada == null ? null : Number(cuerpo.cambiada);
      if (!preguntas) {
        return res.status(400).json({ error: 'El sorteo debe contener siete preguntas distintas del banco.' });
      }
      if (!puntajes) return res.status(400).json({ error: 'Los puntajes recibidos no son válidos.' });
      if (cambiada !== null && (!Number.isInteger(cambiada) || cambiada < 0 || cambiada > 6)) {
        return res.status(400).json({ error: 'El cambio de pregunta no es válido.' });
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
        fecha: new Date().toISOString()
      };
      await db.ref(`${instrumento.base}/notas/${alumno.id}`).set(registro);
      return res.status(200).json({ ok: true, id: alumno.id, nota: registro.nota });
    }

    if (accion === 'borrar') {
      const alumno = instrumento.alumnos.get(String(cuerpo.alumnoId || ''));
      if (!alumno || !docente.cursos.includes(alumno.curso)) {
        return res.status(403).json({ error: 'Ese estudiante no corresponde a tus cursos.' });
      }
      await db.ref(`${instrumento.base}/notas/${alumno.id}`).remove();
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
