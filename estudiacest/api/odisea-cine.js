const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const ADMIN_BASE = 'plataforma_estudiantes';
const RESPONSE_PATH = `${ADMIN_BASE}/nm3/odisea_cine_2026/respuestas`;

const ROSTER_ROWS = [
  ['231320822', 'ALFARO VERGARA DIEGO IGNACIO', '3A'],
  ['230217564', 'AMARO HERRERA MICHAELL ANDRES', '3A'],
  ['232649216', 'ARAYA PEÑA FRANCO JAVIER', '3A'],
  ['229115901', 'AYALA MORA OMAR FRANCISCO', '3A'],
  ['232103612', 'BARRIOS SAAVEDRA JOAQUIN ALONSO', '3A'],
  ['232167955', 'BASCUR LAGOS PABLO ANDRÉS', '3A'],
  ['232729082', 'CANALES MORALES BRANDON MANUEL', '3A'],
  ['231183825', 'CASTRO PARRA DAMIÁN EDUARDO', '3A'],
  ['23045650K', 'CHAMORRO ROJAS ALEJANDRO MAXIMILIANO', '3A'],
  ['232767189', 'CORDERO VILCHES CRISTOBAL ANDRES', '3A'],
  ['233022802', 'CASTRO DÍAZ FRANCO AGUSTÍN EMILIO', '3A'],
  ['231513167', 'DIAZ GUAJARDO ALEJANDRO JOSÉ', '3A'],
  ['231755012', 'DORADOR OLAVE FREDDY EMILIANO', '3A'],
  ['230911592', 'DURÁN LANDABUR SEBASTIÁN IGNACIO', '3A'],
  ['232375213', 'FUENTES NAVARRETE FRANCO ANTONIO', '3A'],
  ['230974160', 'GAETE MALDONADO SALVADOR FERNANDO', '3A'],
  ['232692421', 'HERNANDEZ AGUILERA MATIAS IGNACIO', '3A'],
  ['230671648', 'HERRERA MUÑOZ ERICK GABRIEL', '3A'],
  ['233552186', 'JARA LANDERO PABLO ANTONIO', '3A'],
  ['231412905', 'MARTINEZ JARA KEVIN ALEJANDRO', '3A'],
  ['231176519', 'MELGAREJO QUIJON ROBERTO JOSE', '3A'],
  ['232645873', 'MONDACA SEGUEL MATIAS ALEJANDRO', '3A'],
  ['233619949', 'NAVARRO AMARO THOMAS SEBASTIÁN', '3A'],
  ['230333386', 'PARADA AVILA AUGUSTO JOAQUIN', '3A'],
  ['231523359', 'PULGAR SAAVEDRA BENJAMIN IGNACIO', '3A'],
  ['231677380', 'PURCHES VALENZUELA LUCAS VICENTE', '3A'],
  ['231497889', 'QUINTEROS TORRES MAHIKOL JESUS NEHEMIAS', '3A'],
  ['230625190', 'RETAMAL MENA DIEGO IGNACIO', '3A'],
  ['233191094', 'RODRÍGUEZ CASTRO EMILIO PEDRO', '3A'],
  ['233368113', 'RUIZ MEJIAS MAXIMO ETEEN SANTHY', '3A'],
  ['232291176', 'RUIZ SALINAS VICENTE ALEJANDRO', '3A'],
  ['230955573', 'SAAVEDRA RETAMAL BASTIAN ISRAEL', '3A'],
  ['232691816', 'SALAS CHAPARRO RICARDO ANTONIO', '3A'],
  ['232878959', 'SAN MARTIN VALENZUELA AGUSTIN LEON IGNACIO', '3A'],
  ['232507861', 'SANCHEZ RODRIGUEZ VICENTE BASTIAN', '3A'],
  ['232959177', 'SANHUEZA ARANCIBIA MARTIN JAVIER', '3A'],
  ['230833699', 'SEPULVEDA GONZALEZ TOMAS LUCIANO', '3A'],
  ['233182524', 'TORRES CASTILLO DAMIÁN EMILIO', '3A'],
  ['232060603', 'TORRES QUIROZ DARWIN ANTONIO', '3A'],
  ['230981078', 'VALDES CHANDIA JUAN PABLO ENRIQUE', '3A'],
  ['230284954', 'VALENZUELA ROJAS TOMAS IGNACIO', '3A'],
  ['231288406', 'VALLE GONZALEZ MAXIMILIANO JUAN ALONSO', '3A'],
  ['230188068', 'VERDUGO RUIZ BENJAMIN ARIEL', '3A'],
  ['231705570', 'YEVENES NOVOA VICENTE ALEXSANDER', '3A'],
  ['228138533', 'LORCA REBOLLEDO ELLIOT ARIAN', '3A'],

  ['231061460', 'ALBORNOZ GAJARDO PABLO ANTONIO', '3B'],
  ['231651195', 'AMIGO SEPÚLVEDA NICOLAS JESÚS', '3B'],
  ['230836892', 'ARAYA NUÑEZ LUCIANO RODRIGO', '3B'],
  ['232614552', 'ARREDONDO VALDES MATIAS JESUS', '3B'],
  ['231195386', 'AVACA CANDIA MATIAS IGNACIO', '3B'],
  ['23093570K', 'BARRIOS GONZALEZ NELSON MARTIN', '3B'],
  ['232003979', 'BARRUETO ABARZÚA BENJAMIN ALEJANDRO', '3B'],
  ['231336192', 'BRAVO CÉSPEDES NICOLAS FRANCISCO', '3B'],
  ['231488979', 'CABELLO PARRA VICENTE JESUS', '3B'],
  ['230101450', 'CACERES ESPINOZA ANTONIO AURELIO', '3B'],
  ['231268286', 'CARREÑO CARREÑO DAMIAN ALONSO', '3B'],
  ['229400312', 'CASTRO ARAVENA GIANFRANCO BENJAMIN IGNACIO', '3B'],
  ['232121815', 'CERDA BRIONES CRISTOBAL EDUARDO', '3B'],
  ['232418095', 'DIAZ NUÑEZ MISAEL ALEJANDRO', '3B'],
  ['230945128', 'DIAZ VALENZUELA AGUSTIN VICENTE', '3B'],
  ['231893105', 'DOTE MUÑOZ MATIAS ARMANDO', '3B'],
  ['23222214K', 'DUMONT ORELLANA NICOLÁS ANDRÉS', '3B'],
  ['231500669', 'ESPINOSA MIÑO MAGDIEL DE CIRENE', '3B'],
  ['231978771', 'FUENTES NUÑEZ FELIPE ANTONIO', '3B'],
  ['231357335', 'FUENTES SANCHEZ CRISTOBAL ALONSO', '3B'],
  ['23094928K', 'GAETE IBARRA JOAQUIN ALONSO', '3B'],
  ['231162127', 'GARRIDO RETAMAL SEBASTIÁN JESÚS', '3B'],
  ['27522331K', 'GIRALDO RIVAS OSCAR IVAN', '3B'],
  ['231607625', 'GONZÁLEZ CARREÑO FRANCO ALONSO', '3B'],
  ['227598182', 'GONZÁLEZ CASTILLO NICOLÁS BENJAMÍN', '3B'],
  ['230951993', 'GUTIERREZ RODRIGUEZ FRANCISCO IGNACIO', '3B'],
  ['231373926', 'LABRA YAÑEZ DIEGO AGUSTIN', '3B'],
  ['232071176', 'LOPEZ REBECO DANTE IGNACIO', '3B'],
  ['232311215', 'MEJÍAS RAMIREZ DANIEL ISAIAS', '3B'],
  ['231536280', 'MUÑOZ CARRENO AGUSTIN ANDRES ERNAN', '3B'],
  ['232274255', 'MUÑOZ LOPEZ JOAQUIN IGNACIO ANTO', '3B'],
  ['230767793', 'NAVARRETE NÚÑEZ FERNANDO ALONSO', '3B'],
  ['230951632', 'OVIEDO RODRIGUEZ FRANCISCO GABRIEL', '3B'],
  ['231667547', 'PEREZ VELOSO MARTIN ALEXIS', '3B'],
  ['231083685', 'PINCHEIRA OPAZO MAXIMILIANO IGNACIO', '3B'],
  ['230922756', 'QUIROZ DÍAZ TOMÁS MAURICIO', '3B'],
  ['231864334', 'REYES SÁNCHEZ GABRIEL ENRIQUE', '3B'],
  ['233025569', 'ROJAS ABDALA SAID KAMIL MAURICIO', '3B'],
  ['226977562', 'ROJAS HERRERA JOAQUIN IGNACIO', '3B'],
  ['230215294', 'SAAVEDRA TORRES RENATO ALONSO', '3B'],
  ['230820481', 'SAZO MUÑOZ LUIS GONZALO', '3B'],
  ['230227152', 'TEJOS LOBOS GUILIAN ANDRÉS', '3B'],
  ['230227411', 'TEJOS LOBOS KEVIN ANTONIO', '3B'],
  ['23179557K', 'TOLEDO LLANOS CESAR ALEXIS', '3B'],
  ['230781834', 'VALDERRAMA LARA BENJAMIN JESUS', '3B'],
  ['230493626', 'VERA BASTIDAS EDUARDO ESTEBAN', '3B'],
  ['231349227', 'YAÑEZ JARA THOMAS ESTEBAN', '3B'],
  ['231963375', 'YEVENES PARADA CRISTOPHER ALEXSANDER', '3B'],

  ['232576308', 'ANDRAES MARDONES IANFRANCO YOVANY', '3D'],
  ['233587125', 'ARIAS DIAZ DYLAN VICENTE', '3D'],
  ['232566108', 'BECERRA PIZARRO BASTIÁN IGNACIO', '3D'],
  ['231138412', 'BUSTOS DIAZ MARTÍN ALFONSO', '3D'],
  ['232333472', 'CABRERA SAN MARTIN JOSE VICENTE', '3D'],
  ['230927405', 'CANCINO VELIZ JOAQUIN ANTONIO', '3D'],
  ['228335908', 'CARRASCO JORQUERA HALAN FRANCISCO', '3D'],
  ['291950299', 'COBA ECHEVERRIA ADRIAN ALEJANDRO', '3D'],
  ['231367497', 'COFRÉ GONZÁLEZ RENATO AGUSTÍN', '3D'],
  ['227306289', 'ESPINOZA DONOSO YAN NICOLAS', '3D'],
  ['231191356', 'FARIAS ESPINOZA MARTIN IGNACIO', '3D'],
  ['227573422', 'FLORES ALBORNOZ PABLO ANDRES', '3D'],
  ['230119171', 'FUENTES SAN MARTÍN DIEGO IGNACIO', '3D'],
  ['224862350', 'GAJARDO NUÑEZ MARTÍN ANDRÉS', '3D'],
  ['228158984', 'GOMEZ MORA VALENTIN MAXIMILIANO', '3D'],
  ['230668388', 'GONZALEZ ACEVEDO MICHAEL MAURICIO', '3D'],
  ['230361592', 'GONZALEZ SAAVEDRA JOAQUIN ANDRES', '3D'],
  ['231775927', 'GONZALEZ SAZO BENJAMIN ARNOLDO', '3D'],
  ['230863997', 'GONZALEZ VALENZUELA JAVIER IGNACIO', '3D'],
  ['232245026', 'GUTIERREZ CESPEDES MAXIMILIANO ANDRES', '3D'],
  ['232533331', 'MARABOLI BAEZA PATRICK ALONSO', '3D'],
  ['233099945', 'MOYA ORELLANA ARIEL IGNACIO', '3D'],
  ['232139285', 'MUÑOZ MEZA AGUSTIN EDUARDO', '3D'],
  ['228341339', 'MUÑOZ MORALES MARCOS ANTONIO', '3D'],
  ['231786775', 'POBLETE MUÑOZ JOAQUIN ALEXIS', '3D'],
  ['231267808', 'RAMIREZ ARANCIBIA BENJAMIN IGNACIO', '3D'],
  ['228214663', 'RAMIREZ TORRES CRISTOBAL IGNACIO', '3D'],
  ['231777938', 'RAMOS VARGAS CRISTOBAL GABRIEL', '3D'],
  ['227034157', 'REYES IMAS CRISTOBAL ANTONIO', '3D'],
  ['231881115', 'ROJAS BERNAL MARCELO IGNACIO', '3D'],
  ['233566411', 'SANCHEZ RODRIGUEZ SIMON ALEXIS', '3D'],
  ['233136972', 'TEJOS ESPINA SERGIO ABEL', '3D'],
  ['231961895', 'UNDA MORAN MARCOS VICENTE', '3D'],
  ['232855630', 'VALENZUELA ESCOBAR SEBASTIAN ANTONIO', '3D'],
  ['232877235', 'VELOZ CONTRERAS LUIS DAVID', '3D'],
  ['231050248', 'ALVEAR RODRIGUEZ JUAN IGNACIO', '3D'],
  ['231437525', 'SARAVIA PÉREZ TOMÁS ALONZO', '3D'],
  ['232646438', 'GARCIA ESCOBAR JOAQUIN ESTEBAN', '3D']
];

const ROSTER = ROSTER_ROWS.map(([rut, name, course]) => ({ rut, name, course }));
const ROSTER_BY_RUT = new Map(ROSTER.map(student => [student.rut, student]));
const CHARACTER_IDS = new Set(['odiseo', 'penelope', 'telemaco', 'antinoo', 'atenea', 'calipso']);
const EVENT_IDS = new Set(Array.from({ length: 18 }, (_, index) => index + 1));

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
      databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
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

function findStudent(value) {
  return ROSTER_BY_RUT.get(cleanRut(value)) || null;
}

function limitedText(value, max) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function sanitizeAnswers(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const seenCharacters = new Set();
  const characters = (Array.isArray(source.characters) ? source.characters : [])
    .map(item => ({
      id: limitedText(item && item.id, 30).toLowerCase(),
      description: limitedText(item && item.description, 700)
    }))
    .filter(item => CHARACTER_IDS.has(item.id) && !seenCharacters.has(item.id) && seenCharacters.add(item.id))
    .slice(0, 3);

  const events = [...new Set((Array.isArray(source.events) ? source.events : [])
    .map(Number)
    .filter(id => EVENT_IDS.has(id)))]
    .sort((a, b) => a - b);

  return {
    characters,
    impact: limitedText(source.impact, 1200),
    phrase: limitedText(source.phrase, 1400),
    events
  };
}

function validateForSubmission(answers) {
  if (answers.characters.length !== 3) return 'Selecciona exactamente tres personajes.';
  if (answers.characters.some(item => item.description.length < 25)) return 'Describe cada personaje con al menos 25 caracteres.';
  if (answers.impact.length < 45) return 'Explica con mayor detalle qué te impactó de la película.';
  if (answers.phrase.length < 70) return 'Explica la frase sobre Penélope y Telémaco con evidencia de la película.';
  if (answers.events.length < 5) return 'Revisa el checklist y marca los acontecimientos que reconociste.';
  return '';
}

function publicStudent(student) {
  return { name: student.name, course: student.course, rut: formatRut(student.rut) };
}

function publicResponse(value) {
  if (!value) return null;
  return {
    status: value.status === 'submitted' ? 'submitted' : 'draft',
    answers: sanitizeAnswers(value.answers),
    updatedAt: Number(value.updatedAt || 0),
    submittedAt: Number(value.submittedAt || 0)
  };
}

function setCors(req, res) {
  const origin = String((req.headers && req.headers.origin) || '').trim();
  const allowed = new Set([
    'https://estudiacest.com',
    'https://www.estudiacest.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]);
  res.setHeader('Access-Control-Allow-Origin', allowed.has(origin) ? origin : 'https://www.estudiacest.com');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
}

function jsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

async function verifyAdmin(req) {
  ensureFirebase();
  if (initError) throw new Error(initError);
  const token = String((req.headers && req.headers.authorization) || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new Error('Token requerido');
  const decoded = await admin.auth().verifyIdToken(token);
  const snap = await admin.database().ref(`${ADMIN_BASE}/admins/${decoded.uid}`).once('value');
  if (snap.val() !== true) throw new Error('No autorizado');
  return decoded;
}

async function handleStudent(req, res) {
  const student = findStudent(req.query && req.query.rut);
  if (!student) return res.status(404).json({ error: 'RUT no encontrado en las nóminas vigentes de 3°A, 3°B o 3°D.' });
  ensureFirebase();
  if (initError) throw new Error(initError);
  const snapshot = await admin.database().ref(`${RESPONSE_PATH}/${student.rut}`).once('value');
  return res.status(200).json({ ok: true, student: publicStudent(student), response: publicResponse(snapshot.val()) });
}

async function saveResponse(req, res, submit) {
  const body = jsonBody(req);
  const student = findStudent(body.rut);
  if (!student) return res.status(400).json({ error: 'El RUT no pertenece a la nómina de esta actividad.' });
  const answers = sanitizeAnswers(body.answers);
  if (submit) {
    const validationError = validateForSubmission(answers);
    if (validationError) return res.status(400).json({ error: validationError });
  }

  ensureFirebase();
  if (initError) throw new Error(initError);
  const ref = admin.database().ref(`${RESPONSE_PATH}/${student.rut}`);
  let locked = false;
  const now = Date.now();
  const result = await ref.transaction(current => {
    if (current && current.status === 'submitted') {
      locked = true;
      return;
    }
    return {
      rut: formatRut(student.rut),
      cleanRut: student.rut,
      name: student.name,
      course: student.course,
      status: submit ? 'submitted' : 'draft',
      answers,
      createdAt: current && current.createdAt ? current.createdAt : now,
      updatedAt: now,
      submittedAt: submit ? now : 0
    };
  }, undefined, false);

  if (!result.committed && locked) return res.status(409).json({ error: 'La actividad ya fue entregada y no puede modificarse.' });
  return res.status(200).json({
    ok: true,
    status: submit ? 'submitted' : 'draft',
    message: submit ? 'Actividad entregada correctamente.' : 'Avance guardado.',
    updatedAt: now
  });
}

async function handleAdminList(req, res) {
  await verifyAdmin(req);
  const course = String((req.query && req.query.course) || '').trim().toUpperCase();
  ensureFirebase();
  const snapshot = await admin.database().ref(RESPONSE_PATH).once('value');
  const responses = snapshot.val() || {};
  const rows = ROSTER
    .filter(student => !course || student.course === course)
    .map(student => {
      const response = responses[student.rut] || null;
      return {
        ...publicStudent(student),
        status: response ? (response.status === 'submitted' ? 'submitted' : 'draft') : 'pending',
        answers: response ? sanitizeAnswers(response.answers) : null,
        updatedAt: response ? Number(response.updatedAt || 0) : 0,
        submittedAt: response ? Number(response.submittedAt || 0) : 0
      };
    });
  return res.status(200).json({ ok: true, rows });
}

async function handleAdminReset(req, res) {
  await verifyAdmin(req);
  const student = findStudent(req.query && req.query.rut);
  if (!student) return res.status(404).json({ error: 'RUT no encontrado.' });
  ensureFirebase();
  await admin.database().ref(`${RESPONSE_PATH}/${student.rut}`).remove();
  return res.status(200).json({ ok: true });
}

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const action = String((req.query && req.query.action) || 'health');
    if (action === 'health' && req.method === 'GET') {
      const counts = ROSTER.reduce((result, student) => {
        result[student.course] = (result[student.course] || 0) + 1;
        return result;
      }, {});
      return res.status(200).json({ ok: true, activity: 'odisea-cine-2026', rosterCount: ROSTER.length, counts });
    }
    if (action === 'student' && req.method === 'GET') return await handleStudent(req, res);
    if (action === 'save-draft' && req.method === 'POST') return await saveResponse(req, res, false);
    if (action === 'submit' && req.method === 'POST') return await saveResponse(req, res, true);
    if (action === 'admin-list' && req.method === 'GET') return await handleAdminList(req, res);
    if (action === 'admin-reset' && req.method === 'POST') return await handleAdminReset(req, res);
    return res.status(405).json({ error: 'Método o acción no disponible.' });
  } catch (error) {
    console.error('[odisea-cine]', error);
    const status = /no autorizado|token requerido/i.test(error.message) ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? 'No autorizado.' : 'No se pudo procesar la solicitud.' });
  }
};
