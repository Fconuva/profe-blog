// api/paes.js
// Unified Vercel Serverless Function for PAES module management
// Routes: ?action=submit | ?action=submit-guia | ?action=track-download | ?action=get-student-status | ?action=get-nomina-extra | ?action=get-guia-draft | ?action=get-guias-config | ?action=get-mis-notas
//         | ?action=admin-get-results | ?action=admin-reset-result | ?action=admin-grade-guia | ?action=admin-reset-guia
//         | ?action=admin-save-student | ?action=admin-delete-student | ?action=admin-set-guias-config | ?action=admin-save-nota

const admin = require('firebase-admin');
const { GUIDED_GUIDE_KEYS, GUIDED_GUIDE_FEEDBACK } = require('./_paes-guided-catalog');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const BASE = 'plataforma_paes';
const ADMIN_BASE = 'plataforma_estudiantes';
const SECOND_SEMESTER_GUIDES = ['11', '12', '13', '14', '15', '16', '17'];
const PAES_TEST_RUT = '111111111';

function normalizePrivateKey(raw) {
    let key = (raw || '').trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }
    if (key.includes('\\n')) {
        key = key.replace(/\\n/g, '\n');
    }
    const packed = key.replace(/\s+/g, '').match(/^-+BEGINPRIVATEKEY-+([A-Za-z0-9+/=]+)-+ENDPRIVATEKEY-+$/);
    if (packed) {
        const lines = packed[1].match(/.{1,64}/g) || [];
        key = '-----BEGIN PRIVATE KEY-----\n' + lines.join('\n') + '\n-----END PRIVATE KEY-----\n';
    }
    return key;
}

let initError = null;
try {
    if (!admin.apps.length) {
        const pk = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
        if (!pk) {
            initError = 'FIREBASE_PRIVATE_KEY no configurada';
            console.error('[paes.js] FIREBASE_PRIVATE_KEY is empty');
        } else {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: pk
                }),
                databaseURL: process.env.FIREBASE_DATABASE_URL || DEFAULT_DATABASE_URL
            });
        }
    }
} catch (e) {
    initError = e.message;
    console.error('[paes.js] Firebase init error:', e.message);
}

const db = admin.database();
const auth = admin.auth();

function cleanRut(r) { 
    return (r || '').replace(/[.\s-]/g, '').toUpperCase(); 
}

function isPaesTestRut(rut) {
    return cleanRut(rut) === PAES_TEST_RUT;
}

function normalizeStoredAnswers(rawAnswers) {
    const normalized = {};
    Object.entries(rawAnswers || {}).forEach(([id, rawAnswer]) => {
        const answer = String(rawAnswer || '').toUpperCase();
        if (!['A', 'B', 'C', 'D'].includes(answer)) return;
        if (!/^(?:\d+|q\d+)$/i.test(String(id))) return;
        normalized[String(id)] = answer;
    });
    return normalized;
}

const G10_KEY = {
    1:'A',2:'D',3:'B',4:'C',5:'D',6:'C',7:'B',8:'B',9:'A'
};

const G11_KEY = {
    1:'C',2:'B',3:'A',4:'D',5:'B',6:'C',7:'A',8:'C',9:'B',
    10:'C',11:'A',12:'D',13:'B',14:'A',15:'C',16:'B',17:'D',18:'A'
};

const G12_KEY = {
    1:'B',2:'C',3:'A',4:'D',5:'C',6:'A',7:'D',8:'B',9:'A',
    10:'C',11:'B',12:'D',13:'A',14:'C',15:'B'
};

const G13_KEY = {
    1:'C',2:'A',3:'D',4:'B',5:'C',6:'A',7:'B',8:'D',9:'A',
    10:'C',11:'B',12:'D',13:'A',14:'C',15:'B',16:'D',17:'A',18:'C'
};

const G15_KEY = {
    q01:'B',q02:'D',q03:'A',q04:'C',q05:'B',q06:'A',
    q07:'D',q08:'B',q09:'C',q10:'A',q11:'D',q12:'C',
    q13:'B',q14:'A',q15:'D',q16:'B',q17:'C',q18:'A'
};

const G16_KEY = {
    1:'B',2:'D',3:'C',4:'A',5:'D',
    6:'C',7:'A',8:'B',9:'D',10:'C',
    11:'A',12:'B',13:'C',14:'D',15:'A',
    16:'B',17:'D',18:'B',19:'C',20:'A',
    21:'B',22:'B',23:'A',24:'D',25:'C'
};

const G17_KEY = {
    1:'C',2:'A',3:'D',4:'B',5:'C',6:'A',
    7:'B',8:'D',9:'A',10:'C',11:'B',12:'D',
    13:'A',14:'C',15:'B',16:'D',17:'A',18:'C',
    19:'D',20:'B',21:'C',22:'A',23:'D',24:'B'
};

const G18_KEY = {
    1:'B',2:'D',3:'A',4:'C',5:'B',6:'D',
    7:'C',8:'A',9:'D',10:'B',11:'A',12:'C',
    13:'D',14:'B',15:'C',16:'A',17:'D',18:'B'
};

const G19_KEY = {
    1:'C',2:'A',3:'D',4:'B',5:'C',6:'A',
    7:'B',8:'D',9:'A',10:'C',11:'B',12:'D',
    13:'A',14:'C',15:'D',16:'B',17:'C',18:'A'
};

const GUIDED_ACCESS_RUT = '229327739';
const GUIDED_VARIANT = 'guided-access-2026';

function isGuidedAccess(guideId, rut) {
    return cleanRut(rut) === GUIDED_ACCESS_RUT && Object.prototype.hasOwnProperty.call(GUIDED_GUIDE_KEYS, String(guideId));
}

function guideKeyFor(guideId, rut) {
    return isGuidedAccess(guideId, rut) ? GUIDED_GUIDE_KEYS[String(guideId)] : INTERACTIVE_GUIDE_KEYS[String(guideId)];
}

function guideFeedbackFor(guideId, rut) {
    if (isGuidedAccess(guideId, rut)) {
        return GUIDED_GUIDE_FEEDBACK[String(guideId)];
    }
    return INTERACTIVE_GUIDE_FEEDBACK[String(guideId)];
}

const G18_FEEDBACK = {
    1:'El texto reconoce que registrar permite advertir patrones que podrían pasar inadvertidos; no afirma que todo descanso deba medirse.',
    2:'La enumeración muestra cómo la lógica de rendimiento se extiende desde el trabajo hacia actividades que antes quedaban fuera de ella.',
    3:'La racha deja de apoyar la lectura cuando conservar el número importa más que comprender: la medida desplaza el sentido de la actividad.',
    4:'La frase rechaza justificar el descanso por una productividad oculta. Su valor no depende de producir un beneficio posterior.',
    5:'El emisor no rechaza los registros: reconoce su utilidad, pero cuestiona que se transformen en autoridad sobre la experiencia.',
    6:'La evidencia más directa sería que registrar mejora la atención sin alterar el sentido personal, porque contradice el riesgo central planteado.',
    7:'El texto señala dos usos concretos: proteger piezas frágiles y permitir observar aspectos que el original no deja examinar del mismo modo.',
    8:'La embarcación muestra que una misma pieza no responde todas las preguntas y que distintas preguntas requieren distintas formas de proximidad.',
    9:'Mientras más convincente parece una reconstrucción, mayor es su deber de distinguir lo conservado, lo inferido y lo añadido.',
    10:'El texto supera la oposición original-copia y propone evaluar cada objeto según las preguntas y comprensiones que hace posibles.',
    11:'El título reúne los dos factores que complejizan la autenticidad: la condición de réplica y la relación espacial con el lugar.',
    12:'Distinguir visualmente conservación, inferencia y añadido aplica el criterio de transparencia defendido a lo largo del texto.',
    13:'El archivo espera una consulta; el recomendador se adelanta y selecciona qué mostrar según señales del usuario.',
    14:'El polvo vuelve visible el olvido en un estante; la recomendación puede volver invisible una ausencia sin que el usuario la advierta.',
    15:'Toda exploración usa mediaciones. La exigencia del texto es que sus criterios puedan reconocerse, discutirse y modificarse.',
    16:'La tesis no rechaza recomendar: sostiene que esa mediación puede ser útil, pero debe ser comprensible y discutible.',
    17:'El emisor reconoce poder en el sistema sin presentarlo como absoluto; por eso exige criterios visibles y alternativas de recorrido.',
    18:'La proporción de obras disponibles que nunca aparece en recorridos reales mediría directamente la distancia entre conservar y exponer.'
};

const G19_FEEDBACK = {
    1:'El primer párrafo indica de manera explícita que el nuevo administrador pidió a Elena ayuda con el inventario; ella no vuelve para recuperar un objeto.',
    2:'El apuro deja de controlar la conducta del administrador: acerca una silla y se adapta al ritmo de revisión de Elena. “Cedió” significa que perdió predominio.',
    3:'Elena anota datos verificables y se niega a inventar historias. Su método separa las pistas comprobadas de aquello que todavía no puede afirmarse.',
    4:'El texto explica que Elena registra una línea, una pregunta y alguna relación necesaria. “Escueto” significa breve, sobrio y sin información accesoria.',
    5:'El título destaca que no existe un dueño identificado, pero el relato demuestra que aún hay pistas, procedimientos y deberes de cuidado sobre los objetos.',
    6:'El rigor de Elena se observa cuando no abre la cámara, exige verificación y evita que la emoción o una historia posible reemplacen una prueba comprobable.',
    7:'El reportaje combina escalas: las imágenes reconocen patrones amplios, los sensores miden variaciones y los recorridos comprueban la experiencia peatonal.',
    8:'“Trama” se desarrolla como una red que conecta sombra, materiales, tránsito y temperatura. No alude a una narración ni a una simple sucesión de datos.',
    9:'El párrafo aclara que los árboles no eliminan el calor, pero moderan sus extremos. “Amortiguar” conserva justamente ese sentido de reducción parcial.',
    10:'El texto advierte que un promedio comunal puede mejorar aunque los sectores más expuestos no reciban beneficios; la cifra general puede ocultar desigualdad.',
    11:'La expresión nombra una desigualdad acumulada por décadas de menor arborización y mantención. La reparación requiere continuidad y no una distribución idéntica.',
    12:'Vincular la sombra de rutas efectivamente utilizadas con una menor exposición térmica comprobaría el beneficio central que sostiene la argumentación del reportaje.',
    13:'Intervalos, probabilidades y márgenes forman parte del alcance de una conclusión: muestran con qué respaldo se afirma y bajo qué condiciones puede cambiar.',
    14:'El texto define el margen relevante mediante cuatro preguntas: qué se sabe, con qué respaldo, bajo qué condiciones y qué podría modificar la conclusión.',
    15:'“Erosiona” describe un debilitamiento gradual de la confianza producido por la distancia entre una certeza inicial y su modificación posterior.',
    16:'El pronóstico muestra que una cifra aparentemente clara puede dispersarse en interpretaciones distintas cuando no se explican el lugar, el periodo y la probabilidad.',
    17:'La tesis sostiene que simplificar no debe borrar límites decisivos: la claridad responsable conserva la incertidumbre que define el alcance de lo afirmado.',
    18:'El título une dos ideas que el ensayo defiende: dudar no equivale a vaguedad cuando los límites de una conclusión se formulan con precisión y evidencia.'
};

const INTERACTIVE_GUIDE_FEEDBACK = {
    '18': G18_FEEDBACK,
    '19': G19_FEEDBACK
};

const INTERACTIVE_GUIDE_KEYS = {
    '10': G10_KEY,
    '11': G11_KEY,
    '12': G12_KEY,
    '13': G13_KEY,
    '15': G15_KEY,
    '16': G16_KEY,
    '17': G17_KEY,
    '18': G18_KEY,
    '19': G19_KEY
};

const INCOMPLETE_SUBMISSION_GUIDES = new Set(Object.keys(GUIDED_GUIDE_KEYS));

const G14_KEY = {
    q01:'A',q02:'C',q03:'B',q04:'D',q05:'A',q06:'A',q07:'C',q08:'D',q09:'A',q10:'B',
    q11:'D',q12:'C',q13:'A',q14:'B',q15:'C',q16:'D',q17:'B',q18:'C',q19:'D',q20:'D',
    q21:'C',q22:'B',q23:'D',q24:'B',q25:'D',q26:'C',q27:'B',q28:'D',q29:'A',q30:'C',
    q31:'A',q32:'B',q33:'C',q34:'D',q35:'B',q36:'C',q37:'A',q38:'A',q39:'B',q40:'A',
    q41:'B',q42:'C',q43:'B',q44:'B',q45:'A',q46:'B',q47:'A',q48:'C',q49:'A'
};
const G14_EXPERIMENTAL = new Set(['q08','q17','q30','q48']);
const G14_VERSION = 'g14-2026-1';
const G14_SKILL = {
    q01:'LOCALIZAR',q02:'INTERPRETAR',q03:'LOCALIZAR',q04:'EVALUAR',q05:'LOCALIZAR',q06:'INTERPRETAR',q07:'INTERPRETAR',q08:'INTERPRETAR',q41:'INTERPRETAR',q42:'EVALUAR',
    q09:'LOCALIZAR',q10:'INTERPRETAR',q11:'INTERPRETAR',q12:'LOCALIZAR',q13:'INTERPRETAR',q14:'EVALUAR',q15:'INTERPRETAR',q16:'INTERPRETAR',q17:'EVALUAR',q43:'EVALUAR',
    q18:'LOCALIZAR',q19:'INTERPRETAR',q20:'LOCALIZAR',q21:'INTERPRETAR',q22:'INTERPRETAR',q23:'INTERPRETAR',q24:'EVALUAR',q44:'EVALUAR',q45:'EVALUAR',
    q25:'LOCALIZAR',q26:'INTERPRETAR',q27:'INTERPRETAR',q28:'INTERPRETAR',q29:'INTERPRETAR',q30:'INTERPRETAR',q31:'INTERPRETAR',q32:'INTERPRETAR',q33:'INTERPRETAR',q46:'INTERPRETAR',
    q34:'INTERPRETAR',q35:'INTERPRETAR',q36:'INTERPRETAR',q37:'INTERPRETAR',q38:'INTERPRETAR',q39:'INTERPRETAR',q40:'EVALUAR',q47:'INTERPRETAR',q48:'EVALUAR',q49:'EVALUAR'
};
const PAES_CL_2027 = [100,149,172,193,214,234,253,269,284,298,313,330,347,361,373,383,393,404,417,432,447,461,472,480,487,495,504,516,531,546,560,571,580,587,594,603,614,629,644,659,671,680,689,699,711,725,741,758,772,786,799,814,832,852,871,892,913,936,963,991,1000];
function releaseKey(course) { return String(course || 'general').toLowerCase().replace(/[^a-z0-9]/g, '_'); }
function releaseBase(guideId) { return `${BASE}/guia_config/${String(guideId)}/release_v2`; }

async function isGuideReleased(guideId, course, rut) {
    const base = releaseBase(guideId);
    const [allSnap, courseSnap, studentSnap] = await Promise.all([
        db.ref(`${base}/all`).once('value'),
        db.ref(`${base}/courses/${releaseKey(course)}`).once('value'),
        db.ref(`${base}/students/${cleanRut(rut)}`).once('value')
    ]);
    return !!(allSnap.val() || courseSnap.val() || studentSnap.val());
}

function isCurrentGuia14Record(value) {
    if (!value || typeof value !== 'object') return false;
    if (value.instrumentVersion === G14_VERSION) return true;
    const answerIds = Object.keys(value.answers || {});
    if (answerIds.some((id) => /^q(?:0[1-9]|[1-4]\d)$/.test(id))) return true;
    return Array.isArray(value.form) &&
        value.form.length === 5 &&
        value.form.every((id) => ['1','2','3','4','5'].includes(String(id)));
}

function g14Hash(value) {
    let h = 2166136261;
    for (const c of String(value)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
}
function g14Rng(seed) {
    return () => {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
function g14Shuffle(values, random) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function validG14Schedule(letters) {
    const joined = letters.join('');
    if (/(A{3}|B{3}|C{3}|D{3})/.test(joined)) return false;
    if (/(ABCD|BCDA|CDAB|DABC|DCBA|CBAD|BADC|ADCB)/.test(joined)) return false;
    return true;
}
function createG14Form(rut) {
    const random = g14Rng(g14Hash(`${cleanRut(rut)}|g14|forma-2026-1`));
    const textOrder = g14Shuffle(['1','2','3','4','5'], random);
    const pool = [...'AAAAAAAAAAAAA', ...'BBBBBBBBBBBB', ...'CCCCCCCCCCCC', ...'DDDDDDDDDDDD'];
    let visibleKeys = pool;
    for (let attempt = 0; attempt < 500; attempt++) {
        const candidate = g14Shuffle(pool, random);
        if (validG14Schedule(candidate)) { visibleKeys = candidate; break; }
    }
    const optionOrder = {};
    Object.keys(G14_KEY).forEach((id, index) => {
        const target = visibleKeys[index];
        const wrong = g14Shuffle(['A','B','C','D'].filter(letter => letter !== G14_KEY[id]), random);
        const order = [];
        let wrongIndex = 0;
        for (const position of ['A','B','C','D']) order.push(position === target ? G14_KEY[id] : wrong[wrongIndex++]);
        optionOrder[id] = order;
    });
    return { version:G14_VERSION, textOrder, optionOrder };
}

function displayGuia14Answers(answers, rut) {
    const form = createG14Form(rut);
    const displayAnswers = {};
    Object.keys(G14_KEY).forEach((id) => {
        const selectedIndex = form.optionOrder[id].indexOf(answers && answers[id]);
        if (selectedIndex >= 0) displayAnswers[id] = 'ABCD'[selectedIndex];
    });
    return displayAnswers;
}

function scoreGuia14(answers, rut) {
    let correct = 0;
    const skills = { LOCALIZAR:{correct:0,total:0}, INTERPRETAR:{correct:0,total:0}, EVALUAR:{correct:0,total:0} };
    const itemCorrect = {}, displayAnswers = {}, displayKeys = {};
    const form = createG14Form(rut);
    Object.keys(G14_KEY).forEach(id => {
        const order = form.optionOrder[id];
        const selectedIndex = order.indexOf(answers && answers[id]);
        displayAnswers[id] = selectedIndex >= 0 ? 'ABCD'[selectedIndex] : null;
        displayKeys[id] = 'ABCD'[order.indexOf(G14_KEY[id])];
        itemCorrect[id] = G14_EXPERIMENTAL.has(id) ? null : !!(answers && answers[id] === G14_KEY[id]);
        if (G14_EXPERIMENTAL.has(id)) return;
        const skill = G14_SKILL[id];
        skills[skill].total++;
        if (answers && answers[id] === G14_KEY[id]) { correct++; skills[skill].correct++; }
    });
    const equivalentCorrect = Math.max(0, Math.min(60, Math.round(correct / 45 * 60)));
    return { correct, total:45, answered:Object.keys(answers || {}).length, equivalentCorrect, paesReferential:PAES_CL_2027[equivalentCorrect], skills, itemCorrect, displayAnswers, displayKeys };
}

function sanitizeGuia14ForAdmin(records) {
    const sanitized = {};
    Object.entries(records || {}).forEach(([rut, value]) => {
        if (!isCurrentGuia14Record(value)) return;
        const record = {
            ...value,
            instrumentVersion: value.instrumentVersion || G14_VERSION,
            answered: Object.keys(value.answers || {}).filter((id) => Object.prototype.hasOwnProperty.call(G14_KEY, id)).length,
            total: 45,
            itemCount: 49,
            displayAnswers: displayGuia14Answers(value.answers || {}, rut)
        };
        if (record.status !== 'sent') {
            delete record.correct;
            delete record.score;
            delete record.equivalentCorrect;
            delete record.paesReferential;
            delete record.skills;
            delete record.itemCorrect;
            delete record.displayKeys;
            delete record.grade;
            delete record.submittedAt;
        }
        sanitized[rut] = record;
    });
    return sanitized;
}


function resolveAllowedOrigin(req) {
    const origin = (req.headers.origin || '').trim();
    const explicit = (process.env.ALLOWED_ORIGINS || 'https://estudiacest.com,https://www.estudiacest.com,http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    if (explicit.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
        return origin;
    }
    return 'https://estudiacest.com';
}

async function verifyAdmin(req) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) throw new Error('Token requerido');
    const decoded = await auth.verifyIdToken(token);
    const snap = await db.ref(`${ADMIN_BASE}/admins/${decoded.uid}`).once('value');
    if (!snap.val()) throw new Error('No autorizado');
    return decoded;
}

// ============ PUBLIC STUDENT ACTIONS ============

async function handleSubmit(req, res) {
    const { rut, nombre, curso, ensayoId, answers, correct, total, score, timeSpentSeconds, detail } = req.body;
    if (!rut || !nombre || !curso || !ensayoId) {
        return res.status(400).json({ error: 'Campos requeridos: rut, nombre, curso, ensayoId' });
    }

    const rutLimpio = cleanRut(rut);
    const resultRef = db.ref(`${BASE}/resultados/${ensayoId}/${rutLimpio}`);

    const payload = {
        rut: rutLimpio,
        nombre: nombre.trim(),
        curso: curso.trim(),
        ensayoId: parseInt(ensayoId, 10),
        correct: parseInt(correct, 10) || 0,
        total: parseInt(total, 10) || 40,
        score: parseInt(score, 10) || 100,
        timeSpentSeconds: parseInt(timeSpentSeconds, 10) || 0,
        submittedAt: Date.now(),
        answers: answers || {},
        detail: detail || {}
    };

    await resultRef.set(payload);
    return res.status(200).json({ success: true });
}

async function handleSubmitGuia(req, res) {
    const { rut, nombre, curso, guiaId, answers, dev, correct, total, score, draft } = req.body;
    if (!rut || !nombre || !curso || !guiaId) {
        return res.status(400).json({ error: 'Campos requeridos: rut, nombre, curso, guiaId' });
    }

    const rutLimpio = cleanRut(rut);
    const ref = db.ref(`${BASE}/guia_respuestas/${guiaId}/${rutLimpio}`);
    const guideId = String(guiaId);
    let safeAnswers = answers || {};
    let safeCorrect = parseInt(correct, 10) || 0;
    let safeTotal = parseInt(total, 10) || 0;
    let safeScore = parseInt(score, 10) || 0;
    const serverKey = guideKeyFor(guideId, rutLimpio);
    if (serverKey) {
        safeAnswers = {};
        Object.keys(serverKey).forEach((id) => {
            const answer = String((answers || {})[id] || '').toUpperCase();
            if (['A','B','C','D'].includes(answer)) safeAnswers[id] = answer;
        });
        safeCorrect = Object.keys(serverKey).reduce((sum, id) => sum + (safeAnswers[id] === serverKey[id] ? 1 : 0), 0);
        safeTotal = Object.keys(serverKey).length;
        safeScore = Math.round((safeCorrect / safeTotal) * 100);
    }

    if (!draft && serverKey && !INCOMPLETE_SUBMISSION_GUIDES.has(guideId) && Object.keys(safeAnswers).length !== safeTotal) {
        return res.status(400).json({ error: 'Debes responder todas las preguntas antes de entregar.' });
    }

    const now = Date.now();
    const payload = {
        rut: rutLimpio,
        nombre: nombre.trim(),
        curso: curso.trim(),
        guiaId: guideId,
        answers: safeAnswers,
        dev: dev || {},
        correct: safeCorrect,
        total: safeTotal,
        score: safeScore,
        lastSavedAt: now,
        updatedAt: now,
        status: draft ? 'draft' : 'sent',
        submitted: !draft,
        completada: !draft
    };
    if (isGuidedAccess(guideId, rutLimpio)) payload.variant = GUIDED_VARIANT;
    if (!draft) {
        payload.submittedAt = now;
        payload.completadaAt = now;
    }

    const tx = await ref.transaction((current) => {
        if (!isPaesTestRut(rutLimpio) && current && (current.status === 'sent' || current.completada === true)) return;
        return Object.assign({}, current || {}, payload);
    });
    if (!tx.committed) {
        return res.status(409).json({ error: 'La guía ya fue enviada. El docente debe restablecerla para responder nuevamente.' });
    }
    const saved = tx.snapshot.val() || {};
    return res.status(200).json({
        success: true,
        status: saved.status,
        submitted: saved.submitted === true,
        completada: saved.completada === true,
        submittedAt: saved.submittedAt || null,
        completadaAt: saved.completadaAt || null
    });
}

async function handleGetGuiaDraft(req, res) {
    const guiaId = req.query.guiaId || req.body.guiaId;
    const rut = req.query.rut || req.body.rut;
    if (!guiaId || !rut) {
        return res.status(400).json({ error: 'guiaId y rut requeridos' });
    }
    const snap = await db.ref(`${BASE}/guia_respuestas/${guiaId}/${cleanRut(rut)}`).once('value');
    const v = snap.exists() ? snap.val() : null;
    return res.status(200).json({
        success: true,
        draft: v ? {
            answers: normalizeStoredAnswers(v.answers),
            dev: v.dev || {},
            status: v.status || null,
            submitted: v.submitted === true || v.status === 'sent',
            completada: v.completada === true || v.status === 'sent',
            submittedAt: v.submittedAt || null,
            completadaAt: v.completadaAt || null,
            lastSavedAt: v.lastSavedAt || v.submittedAt || null
        } : null
    });
}

async function handleGetGuiaState(req, res) {
    const guideId = String(req.query.guiaId || req.body.guiaId || '');
    const rut = cleanRut(req.query.rut || req.body.rut);
    if (!guideId || !rut) return res.status(400).json({ error: 'guiaId y rut requeridos' });

    const snap = await db.ref(`${BASE}/guia_respuestas/${guideId}/${rut}`).once('value');
    if (!snap.exists()) return res.status(200).json({ success: true, attempt: null, released: false });

    const value = snap.val() || {};
    const normalizedAnswers = normalizeStoredAnswers(value.answers);
    const legacyCompleted = ['10','11','12','13'].includes(guideId) &&
        Number(value.submittedAt) > 0 && Object.keys(normalizedAnswers).length > 0;
    const released = await isGuideReleased(guideId, value.curso, rut);
    const attempt = {
        answers: normalizedAnswers,
        dev: value.dev || {},
        status: value.status || 'draft',
        submitted: value.submitted === true || value.status === 'sent' || legacyCompleted,
        completada: value.completada === true || value.status === 'sent' || legacyCompleted,
        submittedAt: value.submittedAt || null,
        completadaAt: value.completadaAt || null,
        lastSavedAt: value.lastSavedAt || null,
        variant: value.variant || null
    };
    if (released && attempt.completada) {
        const serverKey = guideKeyFor(guideId, rut);
        if (serverKey) {
            const correct = Object.keys(serverKey).reduce(
                (sum, id) => sum + (normalizedAnswers[id] === serverKey[id] ? 1 : 0), 0
            );
            const total = Object.keys(serverKey).length;
            attempt.result = { correct, total, score: Math.round((correct / total) * 100) };
        } else {
            attempt.result = {
                correct: Number(value.correct) || 0,
                total: Number(value.total) || 0,
                score: Number(value.score) || 0
            };
        }
    }
    const selectedKey = guideKeyFor(guideId, rut);
    const answerKey = released && attempt.completada && selectedKey
        ? selectedKey
        : null;
    const selectedFeedback = guideFeedbackFor(guideId, rut);
    const feedback = released && attempt.completada && selectedFeedback
        ? selectedFeedback
        : null;
    return res.status(200).json({ success: true, attempt, released, answerKey, feedback });
}

async function handleSubmitGuia14(req, res) {
    const { rut, nombre, curso, answers, form, incidents, startedAt, final } = req.body;
    if (!rut || !nombre || !curso) return res.status(400).json({ error:'rut, nombre y curso requeridos' });
    const rutLimpio = cleanRut(rut);
    const ref = db.ref(`${BASE}/guia_respuestas/14/${rutLimpio}`);
    const previous = await ref.once('value');
    if (!isPaesTestRut(rutLimpio) && previous.exists() && isCurrentGuia14Record(previous.val()) && previous.val().status === 'sent') {
        return res.status(409).json({ error:'El ensayo ya fue enviado. El docente debe restablecerlo para responder nuevamente.' });
    }
    const safeAnswers = {};
    Object.keys(G14_KEY).forEach(id => {
        if (answers && ['A','B','C','D'].includes(answers[id])) safeAnswers[id] = answers[id];
    });
    if (final && Object.keys(safeAnswers).length === 0) {
        return res.status(400).json({ error:'No se puede entregar un ensayo sin respuestas.' });
    }
    const payload = {
        rut:rutLimpio, nombre:String(nombre).trim(), curso:String(curso).trim(), guiaId:'14',
        instrumentVersion:G14_VERSION,
        answers:safeAnswers, form:Array.isArray(form) ? form : [], incidents:Array.isArray(incidents) ? incidents.slice(-300) : [],
        startedAt:Number(startedAt) || Date.now(), lastSavedAt:Date.now(), status:final ? 'sent' : 'draft'
    };
    if (final) { Object.assign(payload, scoreGuia14(payload.answers, rutLimpio)); payload.submittedAt=Date.now(); }
    await ref.set(payload);
    return res.status(200).json({ success:true, status:payload.status });
}

async function handleGetGuia14Form(req, res) {
    const rut = cleanRut(req.query.rut || req.body.rut);
    if (!rut) return res.status(400).json({error:'rut requerido'});
    return res.status(200).json({success:true, form:createG14Form(rut)});
}

async function handleGetGuia14State(req, res) {
    const rut=cleanRut(req.query.rut || req.body.rut);
    if (!rut) return res.status(400).json({error:'rut requerido'});
    const snap=await db.ref(`${BASE}/guia_respuestas/14/${rut}`).once('value');
    if (!snap.exists()) return res.status(200).json({success:true,attempt:null,released:false});
    const v=snap.val();
    if (!isCurrentGuia14Record(v)) return res.status(200).json({success:true,attempt:null,released:false});
    const released=await isGuideReleased('14',v.curso,rut);
    const attempt={answers:v.answers||{},form:v.form||[],incidents:v.incidents||[],startedAt:v.startedAt||null,status:v.status||'draft'};
    if(released && v.status==='sent') attempt.result={correct:v.correct,total:v.total,equivalentCorrect:v.equivalentCorrect,paesReferential:v.paesReferential,skills:v.skills,itemCorrect:v.itemCorrect||{},displayAnswers:v.displayAnswers||{},displayKeys:v.displayKeys||{}};
    return res.status(200).json({success:true,attempt,released});
}


async function handleTrackDownload(req, res) {
    const { rut, nombre, curso, guiaId } = req.body;
    if (!rut || !guiaId) {
        return res.status(400).json({ error: 'Campos requeridos: rut, guiaId' });
    }

    const rutLimpio = cleanRut(rut);
    const downloadRef = db.ref(`${BASE}/guias/${rutLimpio}/${guiaId}`);

    await downloadRef.transaction((current) => {
        const value = current || { count: 0 };
        return {
            guiaId,
            rut: rutLimpio,
            nombre: nombre ? nombre.trim() : (value.nombre || 'Estudiante'),
            curso: curso ? curso.trim() : (value.curso || 'General'),
            downloadedAt: Date.now(),
            count: (value.count || 0) + 1
        };
    });

    return res.status(200).json({ success: true });
}

async function handleGetNominaExtra(req, res) {
    const snap = await db.ref(`${BASE}/nomina_extra`).once('value');
    const val = snap.exists() ? snap.val() : {};
    return res.status(200).json({ success: true, nomina_extra: Object.values(val) });
}

// Lee la config de acceso de guías (qué guías están bloqueadas para los alumnos).
// blocked = { id: true } -> solo las listadas están bloqueadas; ausente/false = habilitada.
async function readGuiasConfig() {
    const snap = await db.ref(`${BASE}/guias_config`).once('value');
    const v = snap.exists() ? snap.val() : {};
    return {
        blocked: (v && v.blocked) || {},
        exceptions: (v && v.exceptions) || {},
        updatedAt: (v && v.updatedAt) || null,
        updatedBy: (v && v.updatedBy) || null
    };
}

// Acción pública: las páginas del alumno (guias.html y cada guiaN.html) consultan esto al cargar.
async function handleGetGuiasConfig(req, res) {
    const config = await readGuiasConfig();
    const rut = cleanRut(req.query.rut || (req.body && req.body.rut) || '');
    const allowed = {};
    if (rut) {
        Object.keys(config.exceptions || {}).forEach((guideId) => {
            if (config.exceptions[guideId] && config.exceptions[guideId][rut] === true) allowed[guideId] = true;
        });
        if (isPaesTestRut(rut)) {
            Object.keys(config.blocked || {}).forEach((guideId) => { allowed[guideId] = true; });
        }
    }
    return res.status(200).json({
        success: true,
        config: { blocked: config.blocked, allowed, updatedAt: config.updatedAt }
    });
}

// ============ LIBRO DE NOTAS ============
// libro_notas/{rut} = { nombre, curso, notas: { "3":"7.0", ..., "A" }, updatedAt }
async function readLibroNotas() {
    const snap = await db.ref(`${BASE}/libro_notas`).once('value');
    return snap.exists() ? snap.val() : {};
}

// Acción pública: el alumno consulta sus propias notas en su panel.
async function handleGetMisNotas(req, res) {
    const rut = req.query.rut || req.body.rut;
    if (!rut) return res.status(400).json({ error: 'RUT requerido' });
    const snap = await db.ref(`${BASE}/libro_notas/${cleanRut(rut)}`).once('value');
    if (!snap.exists()) return res.status(200).json({ success: true, libro: null });

    const stored = snap.val() || {};
    const notas = {};
    SECOND_SEMESTER_GUIDES.forEach((guideId) => {
        const value = stored.notas && stored.notas[guideId];
        if (value !== undefined && value !== null && String(value).trim() !== '') notas[guideId] = String(value).trim();
    });
    const normalizedCourse = String(stored.curso || '').toUpperCase().replace(/\s+/g, '').replace(/[-°º]/g, '');
    const isFourthA = normalizedCourse === '4AHC';
    return res.status(200).json({
        success: true,
        libro: {
            curso: stored.curso || '',
            notas,
            omitidos: isFourthA ? ['14'] : [],
            desde: 11,
            hasta: 17
        }
    });
}

// Admin: guarda (o borra si viene vacío) la nota de una sesión para un alumno.
async function handleAdminSaveNota(req, res) {
    const { rut, nombre, curso, sesion, nota } = req.body;
    if (!rut || sesion === undefined || sesion === null || String(sesion).trim() === '') {
        return res.status(400).json({ error: 'rut y sesion requeridos' });
    }
    const rutLimpio = cleanRut(rut);
    const val = (nota === undefined || nota === null || String(nota).trim() === '') ? null : String(nota).trim();
    const updates = { [`notas/${String(sesion).trim()}`]: val, updatedAt: Date.now() };
    if (nombre) updates.nombre = String(nombre).trim();
    if (curso) updates.curso = String(curso).trim();
    await db.ref(`${BASE}/libro_notas/${rutLimpio}`).update(updates);
    return res.status(200).json({ success: true });
}

async function handleGetStudentStatus(req, res) {
    const rut = req.query.rut || req.body.rut;
    if (!rut) {
        return res.status(400).json({ error: 'RUT requerido' });
    }

    const rutLimpio = cleanRut(rut);

    // Fetch Ensayo 1 & 2 results + Downloaded Guides
    const [e1Snap, e2Snap, guiasSnap] = await Promise.all([
        db.ref(`${BASE}/resultados/1/${rutLimpio}`).once('value'),
        db.ref(`${BASE}/resultados/2/${rutLimpio}`).once('value'),
        db.ref(`${BASE}/guias/${rutLimpio}`).once('value')
    ]);

    return res.status(200).json({
        success: true,
        results: {
            1: e1Snap.exists() ? e1Snap.val() : null,
            2: e2Snap.exists() ? e2Snap.val() : null
        },
        guias: guiasSnap.exists() ? guiasSnap.val() : {}
    });
}

// ============ ADMIN ACTIONS ============

async function handleAdminGetResults(req, res) {
    const [resultadosSnap, guiasSnap, guiaRespSnap, nominaExtraSnap] = await Promise.all([
        db.ref(`${BASE}/resultados`).once('value'),
        db.ref(`${BASE}/guias`).once('value'),
        db.ref(`${BASE}/guia_respuestas`).once('value'),
        db.ref(`${BASE}/nomina_extra`).once('value')
    ]);

    const guiaRespuestas = guiaRespSnap.exists() ? guiaRespSnap.val() : {};
    Object.entries(guiaRespuestas).forEach(([guideId, guideRecords]) => {
        Object.values(guideRecords || {}).forEach((record) => {
            if (record && typeof record === 'object') {
                record.answers = normalizeStoredAnswers(record.answers);
                if (record.variant === GUIDED_VARIANT && GUIDED_GUIDE_KEYS[guideId]) {
                    record.adminKey = GUIDED_GUIDE_KEYS[guideId];
                }
            }
        });
    });
    if (guiaRespuestas['14']) guiaRespuestas['14'] = sanitizeGuia14ForAdmin(guiaRespuestas['14']);

    return res.status(200).json({
        success: true,
        resultados: resultadosSnap.exists() ? resultadosSnap.val() : {},
        guias: guiasSnap.exists() ? guiasSnap.val() : {},
        guia_respuestas: guiaRespuestas,
        nomina_extra: nominaExtraSnap.exists() ? Object.values(nominaExtraSnap.val()) : [],
        guias_config: await readGuiasConfig(),
        libro_notas: await readLibroNotas()
    });
}

// Guarda qué guías quedan bloqueadas para los alumnos.
// body.blocked = { id: true, ... } (ids ausentes = habilitadas).
async function handleAdminSetGuiasConfig(req, res, decoded) {
    const raw = (req.body && req.body.blocked) || {};
    const blocked = {};
    Object.keys(raw).forEach((id) => {
        const key = String(id).trim();
        if (key && raw[id]) blocked[key] = true;
    });

    await db.ref(`${BASE}/guias_config`).update({
        blocked: Object.keys(blocked).length ? blocked : null,
        updatedAt: Date.now(),
        updatedBy: (decoded && decoded.email) ? decoded.email : 'docente'
    });

    return res.status(200).json({ success: true, config: await readGuiasConfig() });
}

async function handleAdminSetGuiaException(req, res, decoded) {
    const guideId = String((req.body && req.body.guideId) || '').trim();
    const rut = cleanRut((req.body && req.body.rut) || '');
    const allowed = !!(req.body && req.body.allowed);
    if (!guideId || !rut) return res.status(400).json({ error: 'guideId y rut requeridos' });

    await db.ref(`${BASE}/guias_config/exceptions/${guideId}/${rut}`).set(allowed ? true : null);
    await db.ref(`${BASE}/guias_config`).update({
        updatedAt: Date.now(),
        updatedBy: (decoded && decoded.email) ? decoded.email : 'docente'
    });
    return res.status(200).json({ success: true, config: await readGuiasConfig() });
}

async function handleAdminGradeGuia(req, res, decoded) {
    const { studentRut, guiaId, nota, feedback } = req.body;
    if (!studentRut || !guiaId) {
        return res.status(400).json({ error: 'studentRut y guiaId requeridos' });
    }

    const rutLimpio = cleanRut(studentRut);
    const gradeRef = db.ref(`${BASE}/guia_respuestas/${guiaId}/${rutLimpio}/grade`);

    await gradeRef.set({
        nota: (nota === undefined || nota === null || String(nota).trim() === '') ? null : String(nota).trim(),
        feedback: feedback ? String(feedback).trim() : '',
        gradedBy: (decoded && decoded.email) ? decoded.email : 'docente',
        gradedAt: Date.now()
    });

    return res.status(200).json({ success: true });
}

async function handleAdminResetGuia(req, res) {
    const { studentRut, guiaId } = req.body;
    if (!studentRut || !guiaId) {
        return res.status(400).json({ error: 'studentRut y guiaId requeridos' });
    }

    const rutLimpio = cleanRut(studentRut);
    await db.ref(`${BASE}/guia_respuestas/${guiaId}/${rutLimpio}`).remove();
    return res.status(200).json({ success: true });
}

async function handleAdminSaveStudent(req, res) {
    const { rut, nombre, curso, rutFormato } = req.body;
    if (!rut || !nombre || !curso) {
        return res.status(400).json({ error: 'Campos requeridos: rut, nombre, curso' });
    }

    const rutLimpio = cleanRut(rut);
    await db.ref(`${BASE}/nomina_extra/${rutLimpio}`).set({
        rut: rutLimpio,
        rut_formato: rutFormato ? String(rutFormato).trim() : rutLimpio,
        nombre: String(nombre).trim(),
        curso: String(curso).trim(),
        updatedAt: Date.now()
    });

    return res.status(200).json({ success: true });
}

async function handleAdminDeleteStudent(req, res) {
    const { rut } = req.body;
    if (!rut) return res.status(400).json({ error: 'rut requerido' });
    await db.ref(`${BASE}/nomina_extra/${cleanRut(rut)}`).remove();
    return res.status(200).json({ success: true });
}

async function handleAdminResetResult(req, res) {
    const { studentRut, ensayoId } = req.body;
    if (!studentRut || !ensayoId) {
        return res.status(400).json({ error: 'studentRut y ensayoId requeridos' });
    }

    const rutLimpio = cleanRut(studentRut);
    const resultRef = db.ref(`${BASE}/resultados/${ensayoId}/${rutLimpio}`);

    await resultRef.remove();
    return res.status(200).json({ success: true });
}

async function handleAdminSetGuiaRelease(req, res, forcedGuideId) {
    const { scope, value, released } = req.body;
    const guideId = String(forcedGuideId || req.body.guiaId || '');
    if (!guideId) return res.status(400).json({error:'guiaId requerido'});
    if (!['all','course','student'].includes(scope)) return res.status(400).json({error:'scope inválido'});
    const base=releaseBase(guideId);
    let path=`${base}/all`;
    if(scope==='course') path=`${base}/courses/${releaseKey(value)}`;
    if(scope==='student') path=`${base}/students/${cleanRut(value)}`;
    await db.ref(path).set(!!released);
    return res.status(200).json({success:true,guiaId:guideId});
}


module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

    if (initError) return res.status(500).json({ error: 'Firebase no inicializado: ' + initError });

    try {
        const action = req.query.action || req.body.action;

        // Public actions
        if (action === 'submit') return await handleSubmit(req, res);
        if (action === 'submit-guia') return await handleSubmitGuia(req, res);
        if (action === 'track-download') return await handleTrackDownload(req, res);
        if (action === 'get-student-status') return await handleGetStudentStatus(req, res);
        if (action === 'get-nomina-extra') return await handleGetNominaExtra(req, res);
        if (action === 'get-guia-draft') return await handleGetGuiaDraft(req, res);
        if (action === 'get-guia-state') return await handleGetGuiaState(req, res);
        if (action === 'submit-guia14') return await handleSubmitGuia14(req, res);
        if (action === 'get-guia14-state') return await handleGetGuia14State(req, res);
        if (action === 'get-guia14-form') return await handleGetGuia14Form(req, res);
        if (action === 'get-guias-config') return await handleGetGuiasConfig(req, res);
        if (action === 'get-mis-notas') return await handleGetMisNotas(req, res);

        // Admin actions (Token verification required)
        const decoded = await verifyAdmin(req);

        switch (action) {
            case 'admin-get-results': return await handleAdminGetResults(req, res);
            case 'admin-reset-result': return await handleAdminResetResult(req, res);
            case 'admin-grade-guia': return await handleAdminGradeGuia(req, res, decoded);
            case 'admin-reset-guia': return await handleAdminResetGuia(req, res);
            case 'admin-save-student': return await handleAdminSaveStudent(req, res);
            case 'admin-delete-student': return await handleAdminDeleteStudent(req, res);
            case 'admin-set-guia14-release': return await handleAdminSetGuiaRelease(req, res, '14');
            case 'admin-set-guia-release': return await handleAdminSetGuiaRelease(req, res);
            case 'admin-set-guias-config': return await handleAdminSetGuiasConfig(req, res, decoded);
            case 'admin-set-guia-exception': return await handleAdminSetGuiaException(req, res, decoded);
            case 'admin-save-nota': return await handleAdminSaveNota(req, res);
            default: return res.status(400).json({ error: 'Acción no válida' });
        }
    } catch (error) {
        console.error('PAES API Error:', error);
        const status = error.message === 'Token requerido' ? 401 : error.message === 'No autorizado' ? 403 : 500;
        return res.status(status).json({ error: error.message });
    }
};
