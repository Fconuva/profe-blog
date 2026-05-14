const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const NP_PATH = 'plataforma_np/unidad1';
const TARGET_COURSES = ['4A-TP', '4B-TP', '4C-TP', '4D-TP', '4E-TP'];
const DEFAULT_STATUS_SCORES = { L: 4, ML: 3, PL: 2, NL: 1 };
const DEFAULT_COMPONENT_WEIGHTS = { planilla: 70, auto: 15, team: 15 };
const IMPORT_ACTOR = '';

const COURSE_BLOCKS = [
  {
    course: '4A-TP',
    rosterFile: 'carga_4A_TP.txt',
    raw: String.raw`1	ABARCA TOLEDO BENJAMIN IGNACIO	L	L	L	L	
2	ALEGRIA CONTRERAS MARTIN ALONSO	L	L	L	L	
3	ARAVENA MORALES RAUL IGNACIO	L	L	L	L	
4	BERRIOS ASTUDILLO EDUARDO ABRAHAM	L	L	L	L	
5	BRAVO QUEZADA JORDAN ARMANDO	L	L	L	L	
6	BUSTAMANTE REYES LUCIANO ANDRES	L	L	L	L	
7	CANALES ZUÑIGA MARTIN LUIS BENJAMIN	L	L	L	L	
8	CANCINO BRAVO CRISTOBAL MAXIMILIANO	L	L	NL		
9	CARO TRONCOSO SEBASTIAN ALONSO	L	L	L	L	
10	CARRERA LUZARDO CARLOS DANIEL	L	L	L	L	
11	CERPA CERDA FABIAN MATIAS		L	A	L	
12	CONTARDO GONZALEZ BASTIAN IGNACIO	L	L	L	L	
13	CONTRERAS GONZALEZ JOSE FRANCISCO	L	L	L	L	
14	DE LA JARA FAUNDEZ VALENTIN IGNACIO ANTONIO	L	L	L	L	
15	DENIZ RAMIREZ CARLOS DANIEL	L	L	L	L	
16	GARCIA QUIÑONES MARTIN TOMAS	L	L	L	L	
17	GARRIDO GONZALEZ CAMILO ALONSO	L	L	L	L	
18	GARRIDO MEDEL LEONARDO ESTEBAN	L	L	L	L	
19	GONZALEZ ABARCA IGNACIO ANDRES	L		L	L	
20	GUAJARDO VILLAR IAN MAXIMILIANO	L	L	L	L	
21	HENRIQUEZ CACERES JAIME JAEL ALEJANDRO	L	L	L	L	
22	HERNANDEZ LINCOÑIR DEIVID ANTONIO	ML	L	L	L	
23	HERRERA RETAMAL MARTIN EDUARDO	L	L	L	L	
24	HERRERA ROJAS HAROLD ALEXIS	L	L	L	L	
25	ITURRA RETAMAL CHRISTIAN ALEXANDER	L	L	L	L	
26	MOLINA SEPULVEDA MARTIN IGNACIO		L	NL	L	
27	MORA ASTUDILLO SEBASTIAN IGNACIO	L	L	L	L	
28	MORALES HERNANDEZ RICHARD ALEXI	L	L	L	L	
29	MORALES MUÑOZ CRISTOFER JESUS	L	L	L		
30	MUÑOZ FLORES RUBEN ALONSO	L	L	NL	L	
31	PAREDES AGUILERA THOMAS ANDRES	L	L	L	L	
32	RAMIREZ GONZALEZ CRISTOPHER DAVID	L	L	NL	L	
33	RAMIREZ MORALEZ TOMAS AGUSTIN	L	L	L	L	
34	ROCO BARRIENTOS FELIPE BENJAMIN	L	L	L	L	
35	RODRIGUEZ CASTRO ALEJANDRO DOMINGO	ML	L	L	L	
36	ROJAS OLIVA DIEGO EDUARDO	L	L	L		
37	ROJAS SEPULVEDA CLAUDIO ALEXIS	L	L	L	L	
38	SANTANA CACERES MARTIN VICENTE	L	L	L	L	
39	SEPULVEDA DIAZ ALEXIS ALEJANDRO	L	L	L	L	
40	VALENZUELA ARRIAGADA PATRICIO AGUSTIN	L	L	NL	L	
41	VALENZUELA VASQUEZ WOLFGANG MAXIMO	L	L	NL	L	
42	VALENZUELA ZAPATA CRISTHOBAL ALEJANDRO	L	L	L		
43	VERGARA LOPEZ ALAN ANDRES	L	L	L	L	
44	VERGARA TORO JOAQUIN EDUARDO ANDRES	L		L	L	
45	VERGARA VALENZUELA TOMAS EMILIO		L	L		`
  },
  {
    course: '4B-TP',
    rosterFile: 'carga_4B_TP.txt',
    raw: String.raw`1	ARAVENA GONZALEZ BASTIAN ENRIQUE	L	L	L	L	L
2	ARAYA GONZALEZ MATHIAS IGNACIO	L	L	L	L	L
3	ARCE MERIÑO JESUS VALENTIN	L	L	L	L	L
4	AVILA LOYOLA CRISTIAN ALFONSO	L	L	L		A
5	AYALA HERRERA JOSEEDUARDO MIGUEL	L	L	L	L	L
6	BERMUDEZ BALZA LUIS SANTIAGO	L	L			
7	CACERES MUÑOZ BENJAMIN MARTIN	L	L	L	L	L
8	CALDERON ACUÑA JOSE TOMAS	L	L	L	L	L
9	CAMPOS HERNANDEZ DAVID JESUS	L	L	L	L	L
10	CASTILLO ALARCON DAMIAN ALEXIS	L	L	L	L	L
11	CORDERO GUERRERO SEBASTIAN ANDRES	L	L			A
12	CURIÑANCO PINILLA ALVARO ROMAN	ML	L	ML	L	L
13	DIAZ GARRIDO MATIAS ALEXIS	A	A	L	L	L
14	ESPINOZA AVENDAÑO CRISTIAN SEBASTIAN	L	L	L	L	L
15	ESPINOZA TAPIA BENJAMIN ALONSO		L	L	ML	L
16	FAUNDEZ MUÑOZ MAXIMILIANO GABRIEL				L	
17	FUENTES PARADA VICENTE ANDRES	L	L	L	L	L
18	FUENTES RIQUELME MATIAS RODRIGO		L		ML	L
19	GAJARDO DOTE CLAUDIO ANDRES	L	L	L	ML	ML
20	GARRIDO MATURANA FRANCO ANTONIO	L	L	L	ML	L
21	GONZALEZ ACEITUNO GASPAR AGUSTIN	L	L	L	L	ML
22	GONZALEZ JARA DIEGO ANTONIO	L	L		ML	L
23	GONZALEZ ROJAS LUIS AMHARO NATANAELL	L	L		L	L
24	GUERRERO VELIZ JONATHAN MARCELO	L	L	L	L	L
25	GUTIERREZ PAEZ DIEGO ESTEBAN	L	L		L	L
26	HERNANDEZ SOLAR LEANDRO IGNACIO ANDRES	L	L		ML	L
27	LAGOS VELIZ MATHIAS JOHAN	L	L			
28	LEON QUEREIGUA SAMUEL FRANCISCO	L	L	L	L	L
29	LOBOS FUENTES JUAN SEBASTIAN		L	L		
30	LOPEZ MUÑOZ JOAQUIN ALONSO	L	L			
31	MALDONADO ARAVENA GUILLERMO IGNACIO	L	L	L	ML	ML
32	MONDACA CARVAJAL LEON ALEJANDRO	ML	L	ML	L	L
33	MUÑOZ GARRIDO FELIPE MANUEL	L	L	L	L	L
34	MUÑOZ MORA DIEGO ALFONSO	L		L	ML	L
35	ORMEÑO FERNANDOY FRANCISCO ANDRES					
36	RIQUELME CARREÑO MAGDIEL BENJAMIN	L	L	L	ML	ML
37	ROJAS VALENZUELA RODOLFO ESTEBAN	L	L	L	L	L
38	SALAS HERNANDEZ MATIAS IVAN	L	L	L	ML	L
39	SALAZAR MUÑOZ CRISTOBAL ALEJANDRO	L	L	L	L	L
40	SANTOS RIOFRIO ALEXANDER IGNACIO	L	L	L	L	L
41	URRUTIA CACERES CRISTOBAL ANDRES	L	L	L	PL	L
42	VALDES GARRIDO ANIVAL RODOLFO	L		L		
43	VALENZUELA TAPIA BASTIAN MANUEL	L	L	L	L	L
44	VERDEJO FILIPPI AMARO LUCCIANO	L	L			`
  },
  {
    course: '4C-TP',
    rosterFile: 'carga_4C_TP.txt',
    raw: String.raw`1	ABARCA ROJAS JAVIER IGNACIO	L	L	L	L	L
2	ABARZA DIAZ AGUSTIN IGNACIO	L	L	L	L	L
3	AGUILERA BRAVO MATHEO IGNACIO	L	L	ML	L	L
4	ARAVENA VERDUGO MATIAS MAXIMILIANO	L	L	L	L	L
5	AVACA MEDEL NICOLAS ANTONIO	L	L	NL	NL	NL
6	CALDERON CACERES CARLOS ANDRES	L	L	ML	ML	ML
7	CALLOFA SEPULVEDA MARTIN BAUTISTA	NL	L	NL	L	NL
8	CAÑETE GARRIDO VICENTE IGNACIO	L	L	L	L	L
9	CASTRO CORTES BASTIAN NICOLAS	L	A	A		
10	CASTRO MONSALVE JAVIER IGNACIO	L	L	L	L	L
11	CONTRERAS SALAS FRANCO MARTIN	L	L	L	L	L
12	DOMINGUEZ ARAVENA JAVIER EDUARDO	L	A	L	L	L
13	DURAN ARAVENA MARTIN IGNACIO	L	L	L	ML	L
14	FARIAS EYZAGUIRRE YTAN LUCIAN	L	L	L	L	NL
15	FIGUEROA DIAZ GERMAN NICOLAS	L	L	L	L	L
16	FUENTES ROMERO ANGEL PATRICIO	L	L		L	
17	GAJARDO LLANOS DANTE DANIEL	L	L	L	L	L
18	GONZALEZ PAREDES BRAYANN ALEJANDRO	L	L			
19	GONZALEZ ROJAS RODRIGO ANDRES	L	L	L	L	L
20	GUZMAN REYES FRANCO CRISTOBAL	L	L	L	L	
21	HENRIQUEZ DIAZ MARTIN IGNACIO	L	L		L	
22	HORMAZABAL VARGAS MAXIMO VALENTE	NL	NL			
23	INOSTROZA ROJAS OSCAR ALEJANDRO	L	L	L	L	L
24	LARA SEPULVEDA LUCAS FABIAN UZIEL	L	L	L	L	L
25	LECARO NUÑEZ JOSEPH ANTOANNE	L	L	L	L	L
26	LIZANA MUÑOZ SEBASTIAN ANDRES	L	L			
27	MATAMALA RIQUELME ROBERTO ESTEBAN	L	L	L	L	L
28	MILLAQUEO ARAVENA DANIEL EDUARDO	L	L	L	L	L
29	MORA ESCOBAR MAXIMILIANO ENRIQUE	L	L	L	L	L
30	MORALES CANDIA ALEJANDRO IGNACIO	L	L	L	L	
31	OLAVE SEPULVEDA ANGEL OMAR	L	A		L	
32	OSSES GONZALEZ BENJAMIN ALEJANDRO	L	L	L		
33	OSSES NUÑEZ MARTHIN IGNACIO	L	L		L	
34	PACHECO ALVARADO MOISES ANTONIO	L	L		L	
35	PEREZ RODRIGUEZ SERGIO MAURICIO	L	L		L	
36	REBOLLEDO FUENTEALBA JOHN CRISTOPHER	L	L		L	
37	ROJAS MEZA GASPAR GUILLERMO		A		L	
38	ROJAS VALENZUELA THOMAS ANIBAL	L	L		L	
39	TORRES MONTECINO LUIS HUMBERTO	L	L			
40	VALDES CASTRO CRISTOPHER ANTONIO	L	L		L	
41	VALDES VALENZUELA FELIX FRANCISCO SEGUNDO	L	L		L	L
42	VASQUEZ ESCOBAR FABIAN ARMANDO	L	A		L	
43	VASQUEZ LARA MARTIN LEANDRO	L	L		L	
44	VILCHES VILCHES CRISTOBAL SEBASTIAN	L	L	L	L	L
45	VILLAMAN GUZMAN NICOLAS IGNACIO	L	L	L	L	L`
  },
  {
    course: '4D-TP',
    rosterFile: 'carga_4D_TP.txt',
    raw: String.raw`1	ALVAREZ MEJIAS BENJAMIN DYLAN	L	L	L	L		
2	BECERRA SALAZAR FELIPE IGNACIO	ML	L	L			
3	BERNAL MATUS IVAN PATRICIO	L	L	L			
4	CASTILLO OROSTICA PEDRO IGNACIO	A	L	L			
5	CASTRO ARAVENA ARNALDO DARIO ALEXANDER	ML	L	L			
6	ESTAY QUILIÑAN BASTIAN BENJAMIN ANTONIO	ML	L	L	L		
7	GONZALEZ CAMPOS BENJAMIN ALONSO	ML	L	L	L		
8	GONZALEZ ZURA JOAQUIN ANTONIO	L					
9	GUAJARDO ALFARO ALEXIS ELIAS	A	A	A			
10	GUTIERREZ BARRIENTOS NICOLAS IGNACIO	L	L	L			
11	HERNANDEZ RETAMAL BENJAMIN ALEJANDRO	A	L	L			
12	HORMAZABAL POBLETE FRANCISCO ALEJANDRO	ML	L	L	L		
13	IBAÑEZ FARIAS BENJAMIN CRISTOBAL	ML	L	L	L		
14	LAGOS CIFUENTES JAVIER NICOLAS	L	NL	NL			
15	MARABOLI MORALES VALENTIN EDUARDO	L	L	L			
16	MEDINA AGUILERA JOSETHOMAS SEBASTIAN	L	L	L			
17	MUÑOZ REBOLLEDO MICHAEL ALEJANDRO	L	L	L			
18	NAVARRO ROMERO TOMAS MARCELO	L	L	L	L		
19	PEREZ ARAYA CESAR FERNANDO	ML	L				
20	QUEZADA ARAYA CRHISTIAN JAVIER DE JESUS	L	L	L	L		
21	RAMIREZ SEPULVEDA EXEQUIEL ANDRES	L	L	L	L		
22	RIOS ARAYA BENJAMIN YASSEF OREL	NL					
23	SAAVEDRA GONZALEZ FIDEL ALEXIS	L	L				
24	SALAS TORRES BRAYAN JAIRO BECKAM	L	L	L	L		
25	SALAZAR MORALES VICENTE JAVIER	L	L	L	L		
26	SILVA LEIVA JOAQUIN MATEO	NL	ML				
27	SUAZO ALVAREZ RUBEN ALEJANDRO	L	L	L	L		
28	VALENZUELA TOLOZA MARTIN ALEXIS	L	L				
29	VIRGUEZ LARA JAVIER ALEXANDER	L	L	L	L		`
  },
  {
    course: '4E-TP',
    rosterFile: 'carga_4E_TP.txt',
    raw: String.raw`1	ARAVENA ULLOA IGNACIO ALEJANDRO	L	L	L	A	L
2	ASTABURUAGA ROJAS HERNAN ANDRES	L	L	L		
3	BAEZA ALCAPIO JOAQUIN ALONSO	L	L	L	A	L
4	BRAVO ARELLANO MOISES ALBERTO	NL	L			
5	CABRERA ORELLANA FERNANDO JAVIER	L	L	L	L	L
6	CANCINO ROJAS RENATO AGUSTIN	NL				
7	CANTO ARAYA RONALD BASTIAN	L	L	L	L	L
8	CASTRO MARQUEZ GIAN FRANCO	L	L	L	A	L
9	CONCHA BARRIOS SEBASTIAN ANDRES	L	L	L		L
10	CONTRERAS LASTRA BRAYAN ALEXANDER	NL				
11	CORTEZ RAMIREZ RICARDO ANDRES	L	L			L
12	DIAZ DOMINGUEZ MATIAS FELIPE	L	L	L		L
13	ESPINOSA CANCINO JOAQUIN ALEJANDRO	L	L	L		L
15	FLORES HERRERA DAVID IGNACIO	A	L			
16	GAJARDO ARAVENA JORGE ANDRES	L	L	L	A	L
17	GAJARDO ORELLANA MATIAS EDUARDO	ML	L	A		
18	GONZALEZ YAÑEZ DAVID ANTONIO	L	L	L	A	L
19	HERRERA MARQUEZ MATIN ALEXSANDER	L	L		A	A
20	MANCILLA CARO DOSON ALEXANDERS	L	L	L	L	L
21	MARTINEZ CARILLO BENJAMIN ISAAC	ML	L		A	
22	MARTINEZ ROJAS CARLOS VICENTE	L	L	L	A	L
23	MARTINEZ TRONCOSO BENJAMIN EDUARDO	NL	L	ML	A	L
24	MIRANDA TORRES SIMON MATEO	L	L	L	A	L
25	MORALES CAMPOS ALONSO ESTEBAN	NL			A	
26	MOYANO FLORES RICARDO ALFONSO	A	L		A	
27	MUÑOZ DIAZ CRISTOFER ANDRES	L	L	L		L
28	NAVAS RIQUELME AGUSTIN EDUARDO	L	L	L		L
29	OLGUIN SANHUEZA MAXIMO ERIQUE	A	A			
30	PALMA ILABACA LORENZO ENRIQUE	NL	L			
31	PONCE TORRES MAXIMILIANO ALEXIS	L	L	L		L
32	QUINTERO MACIAS LUIS JOSE	L	L	A		L
33	ROCO VALENZUELA BRYAN FELIPE	L	L	L	L	L
34	ROJAS RAMIREZ THOMAS ALEJANDRO	L	L	L		L
35	SAN MARTIN RUDOLPH FELIPE ALDOLFO	ML	NL			
36	SOTO RETAMAL MARTIN VICENTE IGNACIO	L				
37	TORRES ZUÑIGA CRISTOBAL ALONSO	L	L	L		
38	VALDERRAMA CASTILLO NICOLAS MARTIN	ML	L			
39	VALDES ROJAS ANTONIO JESUS	A	L			
40	VASQUEZ SOTO MARTIN ALONSO	ML	L			`
  }
];

function initializeAdmin() {
  if (admin.apps.length) return;
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.GOOGLE_SERVICE_ACCOUNT || '';
  let serviceAccount = null;
  if (base64) {
    serviceAccount = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  } else {
    serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    };
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
  });
}

function normalizeLoose(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function normalizePersonName(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeStatus(value) {
  const raw = normalizeLoose(value);
  if (!raw) return '';
  if (raw === 'L' || raw === 'LOGRADO' || raw.includes('CASI TODO') || raw.includes('TODO')) return 'L';
  if (raw === 'ML' || raw.includes('MAS DE LA MITAD') || raw.includes('MAYOR PARTE')) return 'ML';
  if (raw === 'PL' || raw.includes('MENOS DE LA MITAD') || raw.includes('POCO') || raw.includes('PARCIAL')) return 'PL';
  if (raw === 'NL' || raw.includes('NADA') || raw.includes('CASI NADA')) return 'NL';
  return '';
}

function cleanRut(value) {
  return String(value || '').replace(/\s+/g, '').toUpperCase();
}

function buildRecordKey(name, course, rut, index) {
  const base = normalizeLoose(course + '-' + name + '-' + (rut || index))
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return base || ('REG-' + index);
}

function statusFromScore(score) {
  return Object.keys(DEFAULT_STATUS_SCORES)
    .map((status) => ({ status, score: DEFAULT_STATUS_SCORES[status] }))
    .sort((left, right) => Math.abs(left.score - score) - Math.abs(right.score - score))[0].status;
}

function parseRows(raw) {
  return String(raw || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s+/, '').replace(/\r$/, ''))
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split('\t'))
    .filter((cells) => /^\d+$/.test(String(cells[0] || '').trim()))
    .map((cells) => ({
      rowNumber: Number(String(cells[0]).trim()),
      name: normalizePersonName(cells[1]),
      sessions: cells.slice(2).map((cell) => String(cell || '').trim())
    }));
}

function derivePlanilla(row) {
  const marked = row.sessions
    .map((value, index) => ({
      index: index + 1,
      raw: String(value || '').trim(),
      normalized: normalizeStatus(value),
      loose: normalizeLoose(value)
    }))
    .filter((entry) => entry.raw);

  const valid = marked.filter((entry) => entry.normalized);
  if (!valid.length) {
    return { planilla: '', observation: buildObservation(marked) };
  }

  const average = valid.reduce((total, entry) => total + DEFAULT_STATUS_SCORES[entry.normalized], 0) / valid.length;
  return {
    planilla: statusFromScore(average),
    observation: buildObservation(marked)
  };
}

function buildObservation(markedSessions) {
  if (!markedSessions.length) return '';
  return markedSessions.map((entry) => 'S' + entry.index + '=' + entry.raw.toUpperCase()).join(', ');
}

function loadRoster(fileName) {
  const fullPath = path.join(__dirname, fileName);
  const entries = fs.readFileSync(fullPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(';').map((part) => part.trim());
      return {
        name: normalizePersonName(parts[0]),
        rut: cleanRut(parts[1]),
        course: parts[2],
        key: normalizeLoose(parts[0])
      };
    });
  const exact = new Map(entries.map((entry) => [entry.key, entry]));
  return { entries, exact };
}

function levenshtein(left, right) {
  const a = String(left || '');
  const b = String(right || '');
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function findRosterMatch(name, roster, usedKeys) {
  const key = normalizeLoose(name);
  const exact = roster.exact.get(key);
  if (exact && !usedKeys.has(exact.key)) {
    usedKeys.add(exact.key);
    return { entry: exact, mode: 'exact' };
  }

  let best = null;
  for (const entry of roster.entries) {
    if (usedKeys.has(entry.key)) continue;
    const distance = levenshtein(key, entry.key);
    if (!best || distance < best.distance) {
      best = { entry, distance };
    }
  }

  if (best && best.distance <= 3) {
    usedKeys.add(best.entry.key);
    return { entry: best.entry, mode: 'fuzzy-' + best.distance };
  }

  return null;
}

function sanitizeConfig(config) {
  return {
    statusScores: Object.assign({}, DEFAULT_STATUS_SCORES, config && config.statusScores ? config.statusScores : {}),
    componentWeights: Object.assign({}, DEFAULT_COMPONENT_WEIGHTS, config && config.componentWeights ? config.componentWeights : {}),
    sessionHeadersByCourse: sanitizeSessionHeadersByCourse(config && config.sessionHeadersByCourse ? config.sessionHeadersByCourse : {}),
    pieTagsByRut: sanitizePieTagsByRut(config && config.pieTagsByRut ? config.pieTagsByRut : {})
  };
}

function sanitizePieTagsByRut(value) {
  const next = {};
  Object.keys(value || {}).forEach((rutKey) => {
    const clean = cleanRut(rutKey);
    const raw = value[rutKey];
    const label = typeof raw === 'string' ? raw.trim() : String(raw && (raw.label || raw.type || raw.kind || raw.category) || '').trim();
    if (clean && label) {
      next[clean] = { label };
    }
  });
  return next;
}

function sanitizeSessionHeadersByCourse(value) {
  const next = {};
  Object.keys(value || {}).forEach((courseKey) => {
    const course = courseKey;
    const courseHeaders = value[courseKey] || {};
    const normalizedHeaders = {};
    Object.keys(courseHeaders).forEach((indexKey) => {
      const sessionIndex = Number(indexKey);
      const label = String(courseHeaders[indexKey] || '').trim();
      if (sessionIndex > 0 && label) {
        normalizedHeaders[sessionIndex] = label;
      }
    });
    if (Object.keys(normalizedHeaders).length) {
      next[course] = normalizedHeaders;
    }
  });
  return next;
}

async function main() {
  initializeAdmin();

  const db = admin.database();
  const unitRef = db.ref(NP_PATH);
  const currentSnap = await unitRef.once('value');
  const current = currentSnap.val() || {};
  const records = Object.assign({}, current.records || {});

  Object.keys(records).forEach((recordId) => {
    if (TARGET_COURSES.includes(records[recordId] && records[recordId].course)) {
      delete records[recordId];
    }
  });

  let inserted = 0;
  let skipped = 0;
  const perCourse = [];
  const unmatched = [];
  const fuzzyMatches = [];

  for (const block of COURSE_BLOCKS) {
    const roster = loadRoster(block.rosterFile);
    const usedKeys = new Set();
    const rows = parseRows(block.raw);
    let courseInserted = 0;
    let courseSkipped = 0;
    let courseSeededBlank = 0;

    for (const row of rows) {
      const derived = derivePlanilla(row);
      if (!derived.planilla) {
        skipped += 1;
        courseSkipped += 1;
        continue;
      }

      const match = findRosterMatch(row.name, roster, usedKeys);
      const finalName = match ? match.entry.name : row.name;
      const finalRut = match ? match.entry.rut : '';

      if (match && match.mode !== 'exact') {
        fuzzyMatches.push({
          course: block.course,
          from: row.name,
          to: match.entry.name,
          mode: match.mode
        });
      }

      if (!match) {
        unmatched.push({ course: block.course, name: row.name, rowNumber: row.rowNumber });
      }

      const key = buildRecordKey(finalName, block.course, finalRut, row.rowNumber);
      records[key] = {
        name: finalName,
        course: block.course,
        status: derived.planilla,
        rut: finalRut,
        observation: derived.observation,
        rowIndex: row.rowNumber,
        components: {
          planilla: derived.planilla,
          auto: '',
          team: ''
        },
        updatedAt: admin.database.ServerValue.TIMESTAMP,
        updatedByRole: 'admin',
        updatedByUid: 'service-account',
        updatedByDisplay: IMPORT_ACTOR
      };
      inserted += 1;
      courseInserted += 1;
    }

    for (const entry of roster.entries) {
      if (usedKeys.has(entry.key)) continue;
      const key = buildRecordKey(entry.name, block.course, entry.rut, 'roster-' + (courseSeededBlank + 1));
      records[key] = {
        name: entry.name,
        course: block.course,
        status: '',
        rut: entry.rut,
        observation: '',
        rowIndex: rows.length + courseSeededBlank + 1,
        components: {
          planilla: '',
          auto: '',
          team: ''
        },
        updatedAt: admin.database.ServerValue.TIMESTAMP,
        updatedByRole: 'admin',
        updatedByUid: 'service-account',
        updatedByDisplay: IMPORT_ACTOR
      };
      inserted += 1;
      courseInserted += 1;
      courseSeededBlank += 1;
    }

    perCourse.push({
      course: block.course,
      roster: roster.entries.length,
      rows: rows.length,
      inserted: courseInserted,
      skipped: courseSkipped,
      seededBlank: courseSeededBlank
    });
  }

  await unitRef.set({
    records,
    config: sanitizeConfig(current.config),
    importMeta: {
      importedAt: admin.database.ServerValue.TIMESTAMP,
      importedBy: IMPORT_ACTOR,
      total: Object.keys(records).length,
      skipped,
      source: 'chat-wide-table-import',
      courses: perCourse
    }
  });

  const verifySnap = await unitRef.child('records').once('value');
  const verifyRecords = verifySnap.val() || {};
  const countsByCourse = Object.values(verifyRecords).reduce((accumulator, record) => {
    const course = record && record.course ? record.course : 'SIN_CURSO';
    accumulator[course] = (accumulator[course] || 0) + 1;
    return accumulator;
  }, {});

  console.log(JSON.stringify({
    replacedCourses: TARGET_COURSES,
    inserted,
    skipped,
    countsByCourse,
    perCourse,
    fuzzyMatches,
    unmatched
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.all(admin.apps.map((app) => app.delete()));
  });