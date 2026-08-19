// Herramienta de interrogacion de Mocha Dick para NM4.
//
// La clave se valida aqui, en el servidor, y nunca viaja al navegador: en el
// codigo solo vive su hash SHA-256. Cada docente ve unicamente los cursos que
// le corresponden, asi que un curso ajeno no se puede calificar por error.
const crypto = require('crypto');
const admin = require('firebase-admin');
const ROSTER = require('./_roster_nm4');

const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'evaluaciones_nm4/interrogacion_mocha_dick_2026';

// Hash de la clave compartida. Se puede sobrescribir con INTERROGACION_HASH
// en Vercel sin tocar el codigo.
const CLAVE_HASH = process.env.INTERROGACION_HASH
  || 'ee4a8b655746dcfa0fdf21e73c12221d5961b49b31e86d889b1d7b56703107b4';

const DOCENTES = {
  'alicia': { nombre: 'Alicia Aguilera', cursos: ['4ATP'] },
  'joselin': { nombre: 'Joselin Díaz', cursos: ['4DTP', '4ETP'] },
  'pia': { nombre: 'Pía Benavides', cursos: ['4BTP', '4CTP'] }
};

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

const hash = (t) => crypto.createHash('sha256').update(String(t || '')).digest('hex');

// Comparacion en tiempo constante: evita distinguir una clave casi correcta
// de una completamente distinta por lo que demora la respuesta.
function claveValida(entregada) {
  const a = Buffer.from(hash(entregada));
  const b = Buffer.from(CLAVE_HASH);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Id estable por estudiante, sin exponer nada personal en la URL ni en la base.
const idAlumno = (curso, n, nombre) =>
  curso + '_' + String(n).padStart(2, '0') + '_' + hash(curso + '|' + nombre).slice(0, 8);

function nota(puntajes) {
  const suma = Object.values(puntajes || {}).reduce((t, v) => t + (Number(v) || 0), 0);
  return Math.max(1, Math.round(suma * 10) / 10);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  let cuerpo = req.body;
  if (typeof cuerpo === 'string') { try { cuerpo = JSON.parse(cuerpo); } catch (e) { cuerpo = {}; } }
  cuerpo = cuerpo || {};

  const docente = DOCENTES[String(cuerpo.docente || '').toLowerCase()];
  if (!claveValida(cuerpo.clave) || !docente) {
    // Mismo mensaje para clave mala y docente inexistente: no se confirma cual falló.
    return res.status(401).json({ error: 'Clave o docente incorrectos.' });
  }

  const accion = String(cuerpo.accion || 'nomina');

  try {
    if (accion === 'nomina') {
      const cursos = {};
      for (const c of docente.cursos) {
        cursos[c] = (ROSTER[c] || []).map((a) => ({
          id: idAlumno(c, a.n, a.nombre), n: a.n, nombre: a.nombre
        }));
      }
      const snap = await db.ref(BASE + '/notas').once('value');
      const todas = snap.val() || {};
      // Solo se devuelven las notas de los cursos de este docente.
      const mias = {};
      for (const [id, v] of Object.entries(todas)) {
        if (docente.cursos.some((c) => id.startsWith(c + '_'))) mias[id] = v;
      }
      return res.status(200).json({ docente: docente.nombre, cursos, notas: mias });
    }

    if (accion === 'guardar') {
      const id = String(cuerpo.alumnoId || '');
      const curso = id.split('_')[0];
      if (!docente.cursos.includes(curso)) {
        return res.status(403).json({ error: 'Ese curso no le corresponde.' });
      }
      const preguntas = Array.isArray(cuerpo.preguntas) ? cuerpo.preguntas.slice(0, 7) : [];
      const puntajes = cuerpo.puntajes && typeof cuerpo.puntajes === 'object' ? cuerpo.puntajes : {};
      const registro = {
        alumno: String(cuerpo.alumno || '').slice(0, 90),
        curso,
        preguntas,
        puntajes,
        cambiada: cuerpo.cambiada == null ? null : Number(cuerpo.cambiada),
        observacion: String(cuerpo.observacion || '').slice(0, 500),
        nota: nota(puntajes),
        docente: docente.nombre,
        fecha: new Date().toISOString()
      };
      await db.ref(BASE + '/notas/' + id).set(registro);
      return res.status(200).json({ ok: true, id, nota: registro.nota });
    }

    if (accion === 'borrar') {
      const id = String(cuerpo.alumnoId || '');
      if (!docente.cursos.includes(id.split('_')[0])) {
        return res.status(403).json({ error: 'Ese curso no le corresponde.' });
      }
      await db.ref(BASE + '/notas/' + id).remove();
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Acción no reconocida.' });
  } catch (e) {
    return res.status(500).json({ error: 'No se pudo completar la operación.', detalle: String(e && e.message || e) });
  }
};
