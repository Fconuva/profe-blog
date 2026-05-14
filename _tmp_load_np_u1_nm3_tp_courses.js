const path = require('path');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const NP_PATH = 'plataforma_np/unidad1';
const TARGET_COURSES = ['3A-TP', '3B-TP', '3D-TP'];
const DEFAULT_STATUS_SCORES = { L: 4, ML: 3, PL: 2, NL: 1 };
const DEFAULT_COMPONENT_WEIGHTS = { planilla: 70, auto: 15, team: 15 };
const IMPORT_ACTOR = '';

const COURSE_BLOCKS = [
  {
    course: '3A-TP',
    rosterFile: 'carga_3A_TP.txt',
    sessionHeaders: {
      1: '10/03',
      2: '20/03',
      3: '10/04',
      4: '17/04',
      17: '25/08',
      18: '01/09',
      19: '08/09',
      20: '22/09',
      21: '29/09',
      22: '06/10',
      23: '13/10',
      24: '20/10',
      25: '27/10',
      26: '03/11',
      27: '10/11',
      28: '17/11'
    },
    raw: String.raw`3° Medio A — Lengua y Lit. 2026																																									
	10/03	20/03	10/04	17/04																25/08	01/09	08/09	22/09	29/09	06/10	13/10	20/10	27/10	03/11	10/11	17/11			
Estudiante	S1	S2	S3	S4	S5	S6	S7	S8	S9	S10	S11	S12	S13	S14	S15	S16	S17	S18	S19	S20	S21	S22	S23	S24	S25	S26	S27	S28	S29	S30	S31	S32	S33	S34	Prom	Nota	Asist%
Tema:	Presentación + Dia	Literatura y efect	Narrativa: análisi	Reflexión estética	Poesía: figuras y 	Diálogo argumentat	Taller de escritur	Lectura complement	Evaluación Unidad 	Retroalimentación 	Interpretación lit	Intertextualidad: 	Análisis de novela	Análisis de novela	Investigación lite	Producción textual	Lectura complement	Evaluación Unidad 	Géneros discursivo	Análisis crítico d	Fake news y desinf	Memes como género 	Ética digital y ci	Investigación digi	Producción multimo	Evaluación Unidad 	Textos no literari	Columna de opinión	Recursos retóricos	Argumentación y co	Producción argumen	Debate formal	Evaluación Unidad 	Retroalimentación 		
ALFARO VERGARA DIEGO IGNACIO	L	L	L	L																															12,00	25,0	100
AMARO HERRERA MICHAELL ANDRES	L	L	L	L																															12,00	25,0	100
ARAYA PEÑA FRANCO JAVIER	L	L	L	L																															12,00	25,0	100
AYALA MORA OMAR FRANCISCO	L	L	L	L																															12,00	25,0	100
BARRIOS SAAVEDRA JOAQUÍN ALONSO		L	L	L																															9,00	19,0	100
BASCUR LAGOS PABLO ANDRES	L	L	L	L																															12,00	25,0	100
CANALES MORALES BRANDON MANUEL	L	L	L	L																															12,00	25,0	100
CASTRO PARRA DAMIAN EDUARDO	L	L	L	L																															12,00	25,0	100
CHAMORRO ROJAS ALEJANDRO MAXIMILIANO		L		L																															6,00	13,0	100
CORDERO VILCHES CRISTOBAL ANDRÉS	L	L	L	L																															12,00	25,0	100
DIAZ DIAZ FRANCO AGUSTIN EMILIO	L	L	L	L																															12,00	25,0	100
DIAZ GUAJARDO ALEJANDRO JOSE	L	L		L																															9,00	19,0	100
DORADOR OLAVE FREDDY EMILIANO	ML	ML	L	L	A																													10,00	21,0	80
DURAN LANDABUR SEBASTIAN IGNACIO	L	L	L	L																															12,00	25,0	100
FUENTES NAVARRETE FRANCO ANTONIO	L	L	L	L																															12,00	25,0	100
GAETE MALDONADO SALVADOR FERNANDO	L	L	L	L																															12,00	25,0	100
HERNANDEZ AGUILERA MATIAS IGNACIO	L	L	L	L	A																													12,00	25,0	80
HERRERA MUÑOZ ERICK GABRIEL	L	L	L	L																															12,00	25,0	100
JARA LANDERO PABLO ANTONIO	L	L	L	L																															12,00	25,0	100
LOPEZ GUTIERREZ AMARO LEON																																				
MARTINEZ JARA KEVIN ALEJANDRO	L	L	L	L																															12,00	25,0	100
MELGAREJO QUIJON ROBERTO JOSE	L	L	L	L																															12,00	25,0	100
MERCADO MENDEZ FREDERIC ALEJANDRO		L		L																															6,00	13,0	100
MONDACA SEGUEL MATIAS ALEJANDRO	L	L	L	L																															12,00	25,0	100
NAVARRO AMARO THOMAS SEBASTIÁN	L	L	L	L																															12,00	25,0	100
PARADA AVILA AUGUSTO JOAQUIN	L	L		A																															6,00	13,0	67
PULGAR SAAVEDRA BENJAMIN IGNACIO	L	L	L	L																															12,00	25,0	100
PURCHES VALENZUELA LUCAS VICENTE			L	L																															6,00	13,0	100
QUINTEROS TORRES MAHIKOL JESÚS NEHEMIAS		L	L	L																															9,00	19,0	100
RETAMAL MENA DIEGO IGNACIO	L	L	L	L																															12,00	25,0	100
RODRIGUEZ CASTRO EMILIO PEDRO	L	L	L	L																															12,00	25,0	100
RUIZ MEJIAS MAXIMO ETEEN SANTHY	L	L	L	L																															12,00	25,0	100
RUIZ SALINAS VICENTE ALEJANDRO	L	ML		L																															8,00	17,0	100
SAAVEDRA RETAMAL BASTIAN ISRAEL	ML	A	L	L																														8,00	17,0	75
SALAS CHAPARRO RICARDO ANTONIO	L	L		L																																9,00	19,0	100
SAN MARTÍN VALENZUELA AGUSTÍN LEÓN IGNACIO				L																															3,00	7,0	100
SANCHEZ RODRIGUEZ VICENTE BASTIÁN	L	L	L	L																															12,00	25,0	100
SANHUEZA ARACIBIA MARTÍN JAVIER	L	L	L	L																															12,00	25,0	100
SEPULVEDA GONZALEZ TOMAS LUCIANO	L	L	L	L																															12,00	25,0	100
TORRES CASTILLO DAMIAN EMILIO	L	L	L	L																															12,00	25,0	100
TORRES QUIROZ DARWIN ANTONIO		L	L	PL																																6,33	13,7	100
VALDES CHANDIA JUAN PABLO ENRIQUE	L	L	L	L																															12,00	25,0	100
VALENZUELA ROJAS TOMAS IGNACIO	L	L	L	L																															12,00	25,0	100
VALLE GONZALEZ MAXIMILIANO JUAN ALONSO	L	L	L	L																															
VERDUGO RUIZ BENJAMIN ARIEL	L	L	L	L																															
YEVENES NOVOA VICENTE ALEXANDER	L	L	L	L																															`,
  },
  {
    course: '3B-TP',
    rosterFile: 'carga_3B_TP.txt',
    sessionHeaders: {
      1: '10/03',
      2: '20/03',
      3: '10/04',
      4: '17/04'
    },
    raw: String.raw`	Estudiante	S1	S2	S3	D	S5	S6	S7	S8	S9	S10	S11	S12	S13	S14	S15	S16	S17	S18	S19	S20	S21	S22	S23	S24	S25	S26	S27	S28	S29	S30	S31	S32	S33	S34	Prom	Nota	Asist%
N°	Tema:	Presentación + Dia	Literatura y efect	Narrativa: análisi		Poesía: figuras y 	Diálogo argumentat	Taller de escritur	Lectura complement	Evaluación Unidad 	Retroalimentación 	Interpretación lit	Intertextualidad: 	Análisis de novela	Análisis de novela	Investigación lite	Producción textual	Lectura complement	Evaluación Unidad 	Géneros discursivo	Análisis crítico d	Fake news y desinf	Memes como género 	Ética digital y ci	Investigación digi	Producción multimo	Evaluación Unidad 	Textos no literari	Columna de opinión	Recursos retóricos	Argumentación y co	Producción argumen	Debate formal	Evaluación Unidad 	Retroalimentación 		
1	ALBORNOZ GAJARDO PABLO ANTONIO	L	L	L		L																														12,00	25,0	100
2	AMIGO SEPULVEDA NICOLÁS JESÚS	L	L	L		L																														12,00	25,0	100
3	ARAYA NUÑEZ LUCIANO RODRIGO	L	L	L		L																														12,00	25,0	100
4	ARREDONDO VALDES MATIAS JESUS	L	L	L		L																														12,00	25,0	100
5	AVACA CANDIA MATIAS IGNACIO	L	L	L		L																														12,00	25,0	100
6	BARRIOS GONZALEZ NELSON MARTIN	L	L	L																																9,00	19,0	100
7	BARRUETO ABARZUA BENJAMIN ALEJANDRO	L	L	L		L																														12,00	25,0	100
8	BRAVO CESPEDES NICOLAS FRANCISCO	L	L	L		L																														12,00	25,0	100
9	CABELLO PARRA VICENTE JESUS	L	L	L		ML																														11,00	23,0	100
10	CACERES ESPINOZA ANTONIO AURELIO	L	L	L																																9,00	19,0	100
11	CARREÑO CARREÑO DAMIAN ALONSO	L	L	L		L																														12,00	25,0	100
12	CASTRO ARAVENA GIANFRANCO BENJAMIN IGNACIO	ML	ML	ML		ML																														8,00	17,0	100
13	CERDA BRIONES CRISTOBAL EDUARDO	L	L	L		L																														12,00	25,0	100
14	DIAZ NUÑEZ MISAEL ALEJANDRO	L	L	L		L																														12,00	25,0	100
15	DIAZ VALENZUELA AGUSTIN VICENTE	L	L	L		NL																														9,00	19,0	100
16	DOTE MUÑOZ MATIAS ARMANDO	L	L	L		L																														12,00	25,0	100
17	DUMONT ORELLANA NICOLAS ANDRES	L	L	L																																9,00	19,0	100
18	ESPINOSA MIÑO MAGDIEL DE CIRENE	L	L	L		L																														12,00	25,0	100
19	FUENTES NUÑEZ FELIPE ANTONIO	L	L	L		L																														12,00	25,0	100
20	FUENTES SÁNCHEZ CRISTOBAL ALONSO	L	L	L		A																														9,00	19,0	75
21	GAETE IBARRA JOAQUIN ALONSO	L	L	L		L																														12,00	25,0	100
22	GARRIDO RETAMAL SEBASTIAN JESUS	L	L	L		L																														12,00	25,0	100
23	GIRALDO RIVAS OSCAR IVAN	L	L	L		A																														9,00	19,0	75
24	GONZALEZ CARREÑO FRANCO ALONSO	L	L	L		L																														12,00	25,0	100
25	GONZALEZ CASTILLO NICOLAS BENJAMIN	L	L	L		A																														9,00	19,0	75
26	GUTIERREZ RODRIGUEZ FRANCISCO IGNACIO	L	L	L		L																														12,00	25,0	100
27	LABRA YAÑEZ DIEGO AGUSTIN	L	L	L		L																														12,00	25,0	100
28	LOPEZ REBECO DANTE IGNACIO	L	L	L	L																															12,00	25,0	100
29	MEJIAS RAMIREZ DANIEL ISAIAS	L	L	L		L																														12,00	25,0	100
30	MUÑOZ CARREÑO AGUSTIN ANDRES ERNAN	L	L	L																																9,00	19,0	100
31	MUÑOZ LOPEZ JOAQUIN IGNACIO ANTONIO	L	L	L		L																														12,00	25,0	100
32	NAVARRETE NUÑEZ FERNANDO ALONSO	L	L	L																																9,00	19,0	100
33	OVIEDO RODRIGUEZ FRANCISCO GABRIEL	L	L	L	L	L																													15,00	31,0	100
34	PEREZ VELOSO MARTIN ALEXIS	L	L	L																																9,00	19,0	100
35	PINCHEIRA OPAZO MAXIMILIANO IGNACIO	L	L	L																																9,00	19,0	100
36	QUIROZ DIAZ TOMAS MAURICIO	A	L	ML		NL																														5,00	11,0	75
37	REYES SANCHEZ GABRIEL ENRIQUE	L	L	L		L																														12,00	25,0	100
38	ROJAS ABDALA SAID KAMIL MAURICIO	L	L	L		L																														12,00	25,0	100
39	ROJAS HERRERA JOAQUIN IGNACIO	L	L	L		L																														12,00	25,0	100
40	SAAVEDRA TORRES RENATO ALONSO	L	L	L																																9,00	19,0	100
41	SAZO MUÑOZ LUIS GONZALO	L	L	L	L	L																													15,00	31,0	100
42	TEJOS LOBOS GUILIAN ANDRES	L	L	L		L																														12,00	25,0	100
43	TEJOS LOBOS KEVIN ANTONIO	L	L	L																																9,00	19,0	100
44	TOLEDO LLANOS CESAR ALEXIS	L	L	L		L																														
45	VALDERRAMA LARA BENJAMIN JESUS	L	L	L		L																														
46	VERA BASTIDAS EDUARDO ESTEBAN	L	L	L		L																														
47	YAÑEZ JARA THOMAS ESTEBAN	L	L	L		A																														
48	YEVENES PARADA CRISTOPHER ALEXSANDER	NL	NL	NL		A																														`,
  },
  {
    course: '3D-TP',
    rosterFile: 'carga_3D_TP.txt',
    sessionHeaders: {
      1: '13/03',
      2: '10/04',
      3: '17/04',
      4: '31/03',
      5: '07/04'
    },
    raw: String.raw`		13/03	10/04	17/04	31/03	07/04
	Estudiante	S1	S2	S3	S4	S5
N°	Tema:	Presentación + Dia	Literatura y efect	Narrativa: análisi	Reflexión estética	Poesía: figuras y 
1	ARIAS DIAZ DYLAN VICENTE	A	L	L		
2	ANDRAES MARDONES IANFRANCO YOVANY	A	L			
3	ARMIJO HERMOSILLA PABLO ALONSO	NL				
4	ASCENCIO ROZAS MAXIMO MARIANO	NL				
5	BECERRA PIZARRO BASTIAN IGNACIO					
6	BUSTOS DIAZ MARTIN ALFONSO		L			
7	CABRERA SAN MARTIN JOSE VICENTE	L				
8	CANCINO VELIZ JOAQUIN ANTONIO		L			
9	CARRASCO JORQUERA HALAN FRANCISCO	L	L	ML		
10	COBA ECHEVERRIA ADRIAN ALEJANDRO	L	L	L		
11	COFRE GONZALEZ RENATO AGUSTÍN					
12	ESPINOZA DONOSO YAN NICOLAS	L				
13	FARÍAS ESPINOZA MARTÍN IGNACIO					
14	FLORES ALBORNOZ PABLO ANDRÉS		L			
15	FUENTES SAN MARTIN DIEGO IGNACIO	L	L			
16	GAJARDO NUÑEZ MARTIN ANDRES	L	L			
17	GARRIDO URBINA JOAQUIN IGNACIO		L			
18	GATICA RIQUELME BENJAMIN ANTONIO					
19	GOMEZ MORA VALENTIN MAXIMILIANO	L	L			
20	GONZALEZ ACEVEDO MICHAEL MAURICIO	ML	L			
21	GONZALEZ SAAVEDRA JOAQUIN ANDRES	L				
22	GONZALEZ SAZO BENJAMÍN ARNOLDO	L				
23	GONZALEZ VALENZUELA JAVIER IGNACIO	L				
24	GUTIERREZ CESPEDES MAXIMILIANO ANDRES	L				
25	MARABOLI BAEZA PATRICK ALONSO		L			
26	MOYA ORELLANA ARIEL IGNACIO	L	L			
27	MUÑOZ MEZA AGUSTIN EDUARDO					
28	MUÑOZ MORALES MARCO ANTONIO					
29	POBLETE MUÑOZ JOAQUIN ALEXIS		L	L		
30	RAMIREZ ARANCIBIA BENJAMIN IGNACIO	NL				
31	RAMIREZ TORRES CRISTOBAL IGNACIO	L	L			
32	RAMOS VARGAS CRISTOBAL GABRIEL					
33	REYES IMAS CRISTOBAL ANTONIO		L			
34	RIVAS IBARRA DAMIAN ALONSO	ML				
35	ROJAS BERNAL MARCELO IGNACIO	L	L	L		
36	SANCHEZ RODRIGUEZ SIMON ALEXIS	L	L	L		
37	TEJOS ESPINA SERGIO ABEL					
38	UNDA MORAN MARCOS VICENTE		L	L		
39	VALENZUELA ESCOBAR SEBASTIAN ANTONIO		L			
40	VELOZ CONTRERAS LUIS DAVID	L	L	ML		
	Estudiante 41					
	Estudiante 42					
	Estudiante 43					`,
  }
];

function initializeAdmin() {
  if (admin.apps.length) return;
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || process.env.GOOGLE_SERVICE_ACCOUNT || '';
  const serviceAccount = base64
    ? JSON.parse(Buffer.from(base64, 'base64').toString('utf8'))
    : {
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
      };
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://profe-blog-default-rtdb.firebaseio.com'
  });
}

function normalizeLoose(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function normalizePersonName(value) {
  return String(value || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeStatus(value) {
  const raw = normalizeLoose(value);
  if (!raw) return '';
  if (raw === 'L') return 'L';
  if (raw === 'ML') return 'ML';
  if (raw === 'PL') return 'PL';
  if (raw === 'NL') return 'NL';
  return '';
}

function normalizeSessionStatus(value) {
  const raw = normalizeLoose(value);
  if (!raw) return '';
  if (raw === 'A') return 'A';
  return normalizeStatus(raw);
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

function splitCells(line) {
  return String(line || '').replace(/\u00A0/g, ' ').replace(/\r$/, '').split('\t');
}

function parseCourseGrid(raw) {
  const lines = String(raw || '').split(/\r?\n/).map((line) => line.replace(/\u00A0/g, ' ').replace(/\r$/, ''));
  const headerIndex = lines.findIndex((line) => splitCells(line).some((cell) => normalizeLoose(cell) === 'ESTUDIANTE'));
  if (headerIndex < 0) throw new Error('No se encontro encabezado Estudiante.');
  const headerCells = splitCells(lines[headerIndex]);
  const firstSessionIndex = headerCells.findIndex((cell) => /^S\d+$/i.test(String(cell || '').trim()));
  if (firstSessionIndex < 0) throw new Error('No se encontraron columnas de sesiones.');
  const promIndex = headerCells.findIndex((cell) => normalizeLoose(cell) === 'PROM');
  const sessionEnd = promIndex >= 0 ? promIndex : headerCells.length;
  const nameIndex = firstSessionIndex - 1;
  const topicIndex = lines.findIndex((line, index) => index > headerIndex && normalizeLoose(line).indexOf('TEMA:') >= 0);
  const rows = [];

  for (let index = topicIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const normalizedLine = normalizeLoose(line);
    if (!normalizedLine) continue;
    if (normalizedLine.startsWith('% L') || normalizedLine.startsWith('% ML') || normalizedLine.startsWith('% PL') || normalizedLine.startsWith('% NL') || normalizedLine.indexOf('RESUMEN DEL CURSO') >= 0) {
      break;
    }
    const cells = splitCells(line);
    const name = normalizePersonName(cells[nameIndex] || '');
    const sessions = cells.slice(firstSessionIndex, sessionEnd).map((cell) => String(cell || '').trim());
    const marked = sessions.some((cell) => String(cell || '').trim().length > 0);
    if (!name || !marked) continue;
    rows.push({ rowNumber: rows.length + 1, name, sessions });
  }

  return rows;
}

function derivePlanilla(row) {
  const marked = row.sessions
    .map((value, index) => ({
      index: index + 1,
      raw: String(value || '').trim(),
      normalized: normalizeStatus(value),
      loose: normalizeSessionStatus(value)
    }))
    .filter((entry) => entry.raw);
  const valid = marked.filter((entry) => entry.normalized);
  if (!valid.length) {
    return { planilla: '', observation: buildObservation(marked) };
  }
  const average = valid.reduce((total, entry) => total + ({ L: 4, ML: 3, PL: 2, NL: 1 }[entry.normalized] || 0), 0) / valid.length;
  return {
    planilla: statusFromScore(average),
    observation: buildObservation(marked)
  };
}

function statusFromScore(score) {
  return ['L', 'ML', 'PL', 'NL']
    .map((status) => ({ status, score: ({ L: 4, ML: 3, PL: 2, NL: 1 }[status]) }))
    .sort((left, right) => Math.abs(left.score - score) - Math.abs(right.score - score))[0].status;
}

function buildObservation(markedSessions) {
  if (!markedSessions.length) return '';
  return markedSessions.map((entry) => 'S' + entry.index + '=' + entry.loose).join(', ');
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
  return {
    entries,
    exact: new Map(entries.map((entry) => [entry.key, entry]))
  };
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
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
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

  if (best && best.distance <= 4) {
    usedKeys.add(best.entry.key);
    return { entry: best.entry, mode: 'fuzzy-' + best.distance };
  }

  return null;
}

function sanitizeSessionHeadersByCourse(value) {
  const next = {};
  Object.keys(value || {}).forEach((courseKey) => {
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
      next[courseKey] = normalizedHeaders;
    }
  });
  return next;
}

function sanitizeConfig(config, sessionHeadersByCourse) {
  return {
    statusScores: Object.assign({}, DEFAULT_STATUS_SCORES, config && config.statusScores ? config.statusScores : {}),
    componentWeights: Object.assign({}, DEFAULT_COMPONENT_WEIGHTS, config && config.componentWeights ? config.componentWeights : {}),
    pieTagsByRut: sanitizePieTagsByRut(config && config.pieTagsByRut ? config.pieTagsByRut : {}),
    sessionHeadersByCourse: Object.assign(
      {},
      sanitizeSessionHeadersByCourse(config && config.sessionHeadersByCourse ? config.sessionHeadersByCourse : {}),
      sanitizeSessionHeadersByCourse(sessionHeadersByCourse)
    )
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
  const sessionHeadersByCourse = {};

  for (const block of COURSE_BLOCKS) {
    if (block.sessionHeaders) {
      sessionHeadersByCourse[block.course] = block.sessionHeaders;
    }
    const roster = loadRoster(block.rosterFile);
    const usedKeys = new Set();
    const rows = parseCourseGrid(block.raw);
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
        fuzzyMatches.push({ course: block.course, from: row.name, to: match.entry.name, mode: match.mode });
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

  await unitRef.update({
    records,
    config: sanitizeConfig(current.config, sessionHeadersByCourse),
    importMeta: {
      importedAt: admin.database.ServerValue.TIMESTAMP,
      importedBy: IMPORT_ACTOR,
      total: Object.keys(records).length,
      skipped,
      source: 'chat-wide-table-import-nm3',
      courses: perCourse
    }
  });

  console.log(JSON.stringify({
    replacedCourses: TARGET_COURSES,
    inserted,
    skipped,
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