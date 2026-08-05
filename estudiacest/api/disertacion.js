const admin = require('firebase-admin');

const DATABASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'evaluaciones_3atp/disertacion_2026';

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
const auth = admin.auth();

const DEFAULT_GROUPS = {
  1: ['Máquina de alineación de correa', ['Vicente Sánchez Rodríguez','Máximo Ruiz Mejías','Benjamín Verdugo Ruiz','Darwin Torres Quiroz','Vicente Yévenes Novoa','Ricardo Salas Chaparro']],
  2: ['Husillo de rectificadora de piezas cilíndricas', ['Omar Ayala Mora','Alejandro Díaz Guajardo','Salvador Gaete Maldonado','Franco Araya Peña','Augusto Parada Ávila']],
  3: ['Caja de velocidades: armado y desarmado', ['Thomas Navarro Amaro','Damián Torres Castillo','Vicente Ruiz Salinas','Tomás Sepúlveda González','Juan Pablo Valdés Chandía']],
  4: ['Carro transversal de rectificadora de superficies cilíndricas', ['Franco Díaz Díaz','Franco Fuentes Navarrete','Michaell Amaro Herrera','Cristóbal Cordero Vilches','Brandon Canales Morales','Damián Castro Parra']],
  5: ['Caja de velocidades de rectificadora de ejes', ['Bastián Saavedra Retamal','Emilio Rodríguez Castro','Lucas Purches Valenzuela','Diego Retamal Mena','Benjamín Pulgar Saavedra']],
  6: ['Bomba centrífuga', ['Pablo Jara Landero','Diego Alfaro Vergara','Freddy Dorador Olave','Roberto Melgarejo Quijón','Sebastián Durán Landabur']],
  7: ['Bomba centrífuga multietapa', ['Pablo Bascur Lagos','Kevin Martínez Jara','Joaquín Barrios Saavedra','Erick Herrera Muñoz','Matías Hernández Aguilera','Alejandro Chamorro Rojas']],
  8: ['Bomba centrífuga de eje horizontal', ['Maximiliano Valle González','Tomás Valenzuela Rojas','Mahikol Quinteros Torres','Martín Sanhueza Arancibia','Agustín San Martín Valenzuela']]
};

function defaults() {
  return Object.fromEntries(Object.entries(DEFAULT_GROUPS).map(([id, value]) => [id, {
    id: Number(id),
    topic: value[0],
    groupScores: { dominio: null, organizacion: null, visual: null },
    notes: '',
    members: value[1].map((name, index) => ({
      id: `g${id}-m${index + 1}`,
      name,
      present: true,
      scores: { oral: null, presentacion: null, defensa: null },
      notes: ''
    }))
  }]));
}

async function verifyAdmin(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) throw Object.assign(new Error('Sesión administrativa requerida.'), { status: 401 });
  const decoded = await auth.verifyIdToken(token);
  const snap = await db.ref(`plataforma_estudiantes/admins/${decoded.uid}`).once('value');
  if (!snap.exists()) throw Object.assign(new Error('No autorizado.'), { status: 403 });
  return decoded;
}

function text(value, max = 1000) {
  return String(value || '').trim().slice(0, max);
}

function score(value, max) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.min(max, Math.max(0, Math.round(number)));
}

function sanitizeGroup(raw, id) {
  const members = Array.isArray(raw.members) ? raw.members.slice(0, 50) : [];
  return {
    id,
    topic: text(raw.topic, 180),
    groupScores: {
      dominio: score(raw.groupScores?.dominio, 14),
      organizacion: score(raw.groupScores?.organizacion, 7),
      visual: score(raw.groupScores?.visual, 8)
    },
    notes: text(raw.notes, 3000),
    members: members.map((member, index) => ({
      id: text(member.id, 80) || `g${id}-custom-${index + 1}`,
      name: text(member.name, 140),
      present: member.present !== false,
      scores: {
        oral: score(member.scores?.oral, 8),
        presentacion: score(member.scores?.presentacion, 5),
        defensa: score(member.scores?.defensa, 8)
      },
      notes: text(member.notes, 2000),
      added: member.added === true
    })).filter(member => member.name)
  };
}

function cors(req, res) {
  const origin = String(req.headers.origin || '');
  const allowed = /^https:\/\/(www\.)?estudiacest\.com$/i.test(origin) || /^https:\/\/[\w-]+\.vercel\.app$/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin', allowed ? origin : 'https://www.estudiacest.com');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}

module.exports = async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const decoded = await verifyAdmin(req);
    if (req.method === 'GET') {
      const snap = await db.ref(`${BASE}/groups`).once('value');
      return res.status(200).json({ groups: { ...defaults(), ...(snap.val() || {}) } });
    }
    if (req.method === 'POST') {
      const id = Number(req.body?.groupId);
      if (!Number.isInteger(id) || id < 1 || id > 8) return res.status(400).json({ error: 'Grupo inválido.' });
      const group = sanitizeGroup(req.body?.group || {}, id);
      const savedAt = Date.now();
      await db.ref(`${BASE}/groups/${id}`).set({ ...group, savedAt, savedBy: decoded.uid });
      return res.status(200).json({ success: true, group, savedAt });
    }
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('[disertacion]', error);
    return res.status(error.status || 500).json({ error: error.status ? error.message : 'No fue posible completar la operación.' });
  }
};
