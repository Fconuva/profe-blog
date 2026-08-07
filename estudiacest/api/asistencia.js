const crypto = require('crypto');
const admin = require('firebase-admin');
const { ROSTER_ROWS } = require('./_roster_nm3.js');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_estudiantes/nm3/asistencia_salidas';
const CURSOS = ['3A', '3B', '3D'];

// La pagina /asistencia es de acceso abierto, asi que NUNCA se le envia el RUN al navegador.
// Cada estudiante viaja con un identificador opaco y estable, derivado del RUN.
// El RUN queda solo del lado del servidor y en la base, que no es publica.
function idOpaco(rut) {
  return crypto.createHash('sha256').update('asistencia-nm3:' + rut).digest('hex').slice(0, 12);
}

const ROSTER = ROSTER_ROWS.map(([rut, nombre, curso]) => ({ id: idOpaco(rut), rut, nombre, curso }));
const POR_ID = new Map(ROSTER.map((a) => [a.id, a]));
const PUBLICO = ROSTER.map(({ id, nombre, curso }) => ({ id, nombre, curso }));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL,
  });
}

const db = () => admin.database();

// Fecha de Chile en AAAA-MM-DD, sin depender de la zona horaria del servidor.
function hoyChile() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function fechaValida(value) {
  const s = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : hoyChile();
}

function cors(req, res) {
  const origin = String(req.headers.origin || '');
  const permitido = /^https:\/\/(www\.)?estudiacest\.com$/i.test(origin) || /^https:\/\/[\w-]+\.vercel\.app$/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin', permitido ? origin : 'https://www.estudiacest.com');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}

module.exports = async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const fecha = fechaValida(req.query && req.query.fecha);
      const snap = await db().ref(`${BASE}/${fecha}`).once('value');
      const guardado = snap.val() || {};
      // Al navegador solo le llega { id: true/false }.
      const marcas = {};
      Object.keys(guardado).forEach((id) => { marcas[id] = guardado[id] && guardado[id].presente === true; });
      return res.status(200).json({ ok: true, fecha, cursos: CURSOS, roster: PUBLICO, marcas, total: PUBLICO.length });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const fecha = fechaValida(body.fecha);
      const presente = body.presente === true;

      if (body.id) {
        const alumno = POR_ID.get(String(body.id));
        if (!alumno) return res.status(404).json({ error: 'Estudiante no encontrado en la nómina.' });
        await db().ref(`${BASE}/${fecha}/${alumno.id}`).set({
          presente, curso: alumno.curso, nombre: alumno.nombre, rut: alumno.rut, at: Date.now(),
        });
        return res.status(200).json({ ok: true, id: alumno.id, presente });
      }

      if (body.curso && CURSOS.includes(body.curso)) {
        const at = Date.now();
        const cambios = {};
        ROSTER.filter((a) => a.curso === body.curso).forEach((a) => {
          cambios[a.id] = { presente, curso: a.curso, nombre: a.nombre, rut: a.rut, at };
        });
        await db().ref(`${BASE}/${fecha}`).update(cambios);
        return res.status(200).json({ ok: true, curso: body.curso, presente, afectados: Object.keys(cambios).length });
      }

      return res.status(400).json({ error: 'Falta el estudiante o el curso.' });
    }

    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('[asistencia]', error);
    return res.status(500).json({ error: 'No fue posible completar la operación.' });
  }
};
