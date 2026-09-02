// api/estudiantes.js
// Unified Vercel Serverless Function for student management
// Routes: ?action=create | ?action=reset-password | ?action=bulk-create

const admin = require('firebase-admin');

const DEFAULT_DATABASE_URL = 'https://estudiacest-default-rtdb.firebaseio.com';
const STUDENT_EMAIL_DOMAIN = '@est.estudiacest.com';

function normalizePrivateKey(raw) {
    let key = (raw || '').trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
        key = key.slice(1, -1);
    }
    if (key.includes('\\n')) {
        key = key.replace(/\\n/g, '\n');
    }
    // Si el PEM viene "empacado" (sin saltos), reconstruirlo en lineas de 64 chars
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
            console.error('[estudiantes.js] FIREBASE_PRIVATE_KEY is empty');
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
    console.error('[estudiantes.js] Firebase init error:', e.message);
}

const db = admin.database();
const auth = admin.auth();
const BASE = 'plataforma_estudiantes';
const U3S7_SESSION = 'sesion-u3-7';
const U3S7_COURSES = new Set(['2A-HC', '2B-HC']);
const U3S7_ANSWER_KEY = {
    q1:'B',q2:'D',q3:'A',q4:'C',q5:'B',q6:'D',
    q7:'A',q8:'C',q9:'B',q10:'D',q11:'A',q12:'C',
    q13:'D',q14:'B',q15:'C',q16:'A',q17:'D',q18:'B',
    q19:'C',q20:'A',q21:'D',q22:'B',q23:'C',q24:'A',
    q25:'B',q26:'D',q27:'A',q28:'C',q29:'B',q30:'A',q31:'D',
    q32:'C',q33:'A',q34:'B',q35:'D',q36:'C',q37:'B',q38:'A',
    q39:'D',q40:'C',q41:'A',q42:'B',q43:'D',q44:'C',
    q45:'B',q46:'A',q47:'D',q48:'C',q49:'B',q50:'A'
};
const U3S7_SKILLS = {
    q1:'INTERPRETAR',q2:'REFLEXIONAR',q3:'INTERPRETAR',q4:'INTERPRETAR',q5:'LOCALIZAR',q6:'REFLEXIONAR',
    q7:'INTERPRETAR',q8:'REFLEXIONAR',q9:'INTERPRETAR',q10:'INTERPRETAR',q11:'LOCALIZAR',q12:'REFLEXIONAR',
    q13:'INTERPRETAR',q14:'INTERPRETAR',q15:'INTERPRETAR',q16:'LOCALIZAR',q17:'REFLEXIONAR',q18:'INTERPRETAR',
    q19:'INTERPRETAR',q20:'LOCALIZAR',q21:'INTERPRETAR',q22:'REFLEXIONAR',q23:'INTERPRETAR',q24:'REFLEXIONAR',
    q25:'INTERPRETAR',q26:'REFLEXIONAR',q27:'INTERPRETAR',q28:'INTERPRETAR',q29:'LOCALIZAR',q30:'REFLEXIONAR',q31:'INTERPRETAR',
    q32:'INTERPRETAR',q33:'LOCALIZAR',q34:'INTERPRETAR',q35:'INTERPRETAR',q36:'REFLEXIONAR',q37:'INTERPRETAR',q38:'REFLEXIONAR',
    q39:'INTERPRETAR',q40:'REFLEXIONAR',q41:'LOCALIZAR',q42:'INTERPRETAR',q43:'INTERPRETAR',q44:'REFLEXIONAR',
    q45:'INTERPRETAR',q46:'INTERPRETAR',q47:'LOCALIZAR',q48:'INTERPRETAR',q49:'INTERPRETAR',q50:'REFLEXIONAR'
};
const U3S7_OPEN_MIN = { o1:180, o2:220 };
const U3S7_META_MIN = { m1:25, m2:25, m3:25 };
const U3S8_SESSION = 'sesion-u3-8';
const U3S8_COURSES = new Set(['2A-HC', '2B-HC']);
const U3S8_ANSWER_KEY = {
    q1:'B',q2:'D',q3:'A',q4:'C',q5:'B',q6:'D',
    q7:'A',q8:'C',q9:'D',q10:'B',q11:'A',
    q12:'C',q13:'B',q14:'D',q15:'A',q16:'C',
    q17:'D',q18:'A',q19:'B',q20:'C',q21:'D',
    q22:'B',q23:'C',q24:'A',q25:'D',q26:'B',
    q27:'A',q28:'D',q29:'C',q30:'B',q31:'A',
    q32:'C',q33:'B',q34:'D',q35:'A',q36:'C'
};
const U3S8_SKILLS = {
    q1:'LOCALIZAR',q2:'INTERPRETAR',q3:'INTERPRETAR',q4:'REFLEXIONAR',q5:'INTERPRETAR',q6:'REFLEXIONAR',
    q7:'INTERPRETAR',q8:'LOCALIZAR',q9:'REFLEXIONAR',q10:'INTERPRETAR',q11:'REFLEXIONAR',
    q12:'INTERPRETAR',q13:'INTERPRETAR',q14:'REFLEXIONAR',q15:'INTERPRETAR',q16:'REFLEXIONAR',
    q17:'LOCALIZAR',q18:'INTERPRETAR',q19:'INTERPRETAR',q20:'INTERPRETAR',q21:'REFLEXIONAR',
    q22:'INTERPRETAR',q23:'INTERPRETAR',q24:'LOCALIZAR',q25:'REFLEXIONAR',q26:'REFLEXIONAR',
    q27:'LOCALIZAR',q28:'INTERPRETAR',q29:'REFLEXIONAR',q30:'INTERPRETAR',q31:'REFLEXIONAR',
    q32:'INTERPRETAR',q33:'INTERPRETAR',q34:'LOCALIZAR',q35:'INTERPRETAR',q36:'REFLEXIONAR'
};
const U3S8_META_IDS = ['m1', 'm2'];

function cleanRut(r) { return (r || '').replace(/[.\s]/g, '').toUpperCase(); }
function rutToEmail(r) { return cleanRut(r).replace(/-/g, '') + STUDENT_EMAIL_DOMAIN; }
function defaultPassword(r) { var d = cleanRut(r).replace(/[^0-9]/g, ''); return d.substring(0, 6).padEnd(6, '0'); }

function u3s7BodyOf(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function u3s7CleanText(value, max) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function u3s7CleanAnswers(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const output = {};
    Object.keys(U3S7_ANSWER_KEY).forEach((id) => {
        const value = String(source[id] || '').toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(value)) output[id] = value;
    });
    return output;
}

function u3s7CleanTexts(raw, schema, max) {
    const source = raw && typeof raw === 'object' ? raw : {};
    return Object.fromEntries(Object.keys(schema).map((id) => [id, u3s7CleanText(source[id], max)]));
}

function u3s7CleanConcepts(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const output = {};
    for (let index = 1; index <= 8; index += 1) {
        const id = `c${index}`;
        const value = Number(source[id]);
        if (Number.isInteger(value) && value >= 0 && value <= 3) output[id] = value;
    }
    return output;
}

function u3s7SubmissionError(payload) {
    const missing = Object.keys(U3S7_ANSWER_KEY).filter((id) => !payload.answers[id]);
    if (missing.length) return `Faltan ${missing.length} alternativas por responder.`;
    for (const [id, minimum] of Object.entries(U3S7_OPEN_MIN)) {
        if ((payload.openResponses[id] || '').length < minimum) {
            return `La respuesta ${id === 'o1' ? 'de evaluación' : 'comparativa'} necesita mayor desarrollo.`;
        }
    }
    for (const [id, minimum] of Object.entries(U3S7_META_MIN)) {
        if ((payload.metaResponses[id] || '').length < minimum) {
            return 'Completa las tres preguntas de cierre con una idea explicada.';
        }
    }
    return '';
}

function u3s7ScoreAnswers(answers) {
    let score = 0;
    const bySkill = {};
    Object.entries(U3S7_ANSWER_KEY).forEach(([id, key]) => {
        const skill = U3S7_SKILLS[id];
        if (!bySkill[skill]) bySkill[skill] = { score:0, total:0 };
        bySkill[skill].total += 1;
        if (answers[id] === key) {
            score += 1;
            bySkill[skill].score += 1;
        }
    });
    return { score, total:Object.keys(U3S7_ANSWER_KEY).length, bySkill };
}

function u3s7SafeAttempt(value) {
    if (!value) return null;
    return {
        answers: u3s7CleanAnswers(value.answers),
        openResponses: u3s7CleanTexts(value.openResponses, U3S7_OPEN_MIN, 2400),
        metaResponses: u3s7CleanTexts(value.metaResponses, U3S7_META_MIN, 800),
        concepts: u3s7CleanConcepts(value.concepts),
        submitted: value.submitted === true,
        completada: value.completada === true,
        updatedAt: Number(value.updatedAt || 0),
        submittedAt: Number(value.submittedAt || 0)
    };
}

async function verifyU3S7Student(req) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) {
        const error = new Error('Inicia sesión para continuar.');
        error.status = 401;
        throw error;
    }
    const decoded = await auth.verifyIdToken(token);
    const snap = await db.ref(`${BASE}/estudiantes/${decoded.uid}`).once('value');
    const student = snap.val();
    if (!student || !U3S7_COURSES.has(student.curso)) {
        const error = new Error('Esta clase no está asignada a tu curso.');
        error.status = 403;
        throw error;
    }
    return { uid:decoded.uid, student };
}

async function handleU3S7(req, res, action) {
    try {
        const { uid, student } = await verifyU3S7Student(req);
        const [sessionSnap, exceptionSnap] = await Promise.all([
            db.ref(`${BASE}/sesiones/${U3S7_SESSION}`).once('value'),
            db.ref(`${BASE}/sesiones/${U3S7_SESSION}/excepciones_desbloqueo/${uid}`).once('value')
        ]);
        const session = sessionSnap.val() || {};
        const access = {
            active: session.activa !== false || exceptionSnap.val() === true,
            released: session.resultados_visibles === true,
            title: session.titulo || 'Unidad 3 · Clase 7 — El discurso'
        };
        const responseRef = db.ref(`${BASE}/respuestas/${U3S7_SESSION}/${uid}`);

        if (req.method === 'GET' && action === 'simce-u3s7-state') {
            const [responseSnap, resultSnap] = await Promise.all([
                responseRef.once('value'),
                db.ref(`${BASE}/resultados/${U3S7_SESSION}/${uid}`).once('value')
            ]);
            const attempt = u3s7SafeAttempt(responseSnap.val());
            const storedResult = resultSnap.val();
            const result = attempt && attempt.completada === true && storedResult
                ? {
                    score:Number(storedResult.score || 0),
                    total:Number(storedResult.total || Object.keys(U3S7_ANSWER_KEY).length),
                    porcentaje:Number(storedResult.porcentaje || 0)
                }
                : null;
            return res.status(200).json({
                ok:true,
                session:access,
                student:{ nombre:student.nombre || 'Estudiante', curso:student.curso },
                attempt,
                result
            });
        }
        if (req.method !== 'POST') return res.status(405).json({ error:'Método no permitido.' });
        if (!access.active) {
            return res.status(423).json({ error:'La clase está cerrada. Si faltaste con justificación, solicita una habilitación individual.' });
        }

        const currentSnap = await responseRef.once('value');
        const current = currentSnap.val();
        if (current && current.completada === true) {
            return res.status(409).json({ error:'Esta clase ya fue entregada.', completada:true });
        }
        const request = u3s7BodyOf(req);
        const payload = {
            answers: u3s7CleanAnswers(request.answers),
            openResponses: u3s7CleanTexts(request.openResponses, U3S7_OPEN_MIN, 2400),
            metaResponses: u3s7CleanTexts(request.metaResponses, U3S7_META_MIN, 800),
            concepts: u3s7CleanConcepts(request.concepts)
        };
        const now = Date.now();

        if (action === 'simce-u3s7-save') {
            await responseRef.set({
                ...payload,
                nombre:u3s7CleanText(student.nombre, 140),
                curso:student.curso,
                submitted:false,
                completada:false,
                updatedAt:now,
                submittedAt:null,
                completadaAt:null,
                score:null,
                total:Object.keys(U3S7_ANSWER_KEY).length
            });
            return res.status(200).json({ ok:true, updatedAt:now });
        }
        if (action !== 'simce-u3s7-submit') return res.status(400).json({ error:'Acción desconocida.' });
        const invalid = u3s7SubmissionError(payload);
        if (invalid) return res.status(400).json({ error:invalid });

        const scored = u3s7ScoreAnswers(payload.answers);
        const percentage = Math.round((scored.score / scored.total) * 100);
        const rootUpdates = {};
        rootUpdates[`${BASE}/respuestas/${U3S7_SESSION}/${uid}`] = {
            ...payload,
            nombre:u3s7CleanText(student.nombre, 140),
            curso:student.curso,
            submitted:true,
            completada:true,
            updatedAt:now,
            submittedAt:now,
            completadaAt:now,
            score:null,
            total:scored.total
        };
        rootUpdates[`${BASE}/resultados/${U3S7_SESSION}/${uid}`] = {
            nombre:u3s7CleanText(student.nombre, 140),
            curso:student.curso,
            score:scored.score,
            total:scored.total,
            porcentaje:percentage,
            bySkill:scored.bySkill,
            openResponses:payload.openResponses,
            submitted:true,
            completada:true,
            updatedAt:now,
            submittedAt:now,
            completadaAt:now
        };
        await db.ref().update(rootUpdates);
        return res.status(200).json({
            ok:true,
            completada:true,
            result:{ score:scored.score, total:scored.total, porcentaje:percentage }
        });
    } catch (error) {
        const status = Number(error.status || (error.code && String(error.code).startsWith('auth/') ? 401 : 500));
        return res.status(status).json({
            error:status === 500
                ? 'No fue posible guardar. Tu avance permanece en pantalla; vuelve a intentarlo.'
                : error.message
        });
    }
}

function u3s8CleanAnswers(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const output = {};
    Object.keys(U3S8_ANSWER_KEY).forEach((id) => {
        const value = String(source[id] || '').toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(value)) output[id] = value;
    });
    return output;
}

function u3s8CleanMeta(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    return Object.fromEntries(U3S8_META_IDS.map((id) => [id, u3s7CleanText(source[id], 700)]));
}

function u3s8ScoreAnswers(answers) {
    let score = 0;
    const bySkill = {};
    Object.entries(U3S8_ANSWER_KEY).forEach(([id, key]) => {
        const skill = U3S8_SKILLS[id];
        if (!bySkill[skill]) bySkill[skill] = { score:0, total:0 };
        bySkill[skill].total += 1;
        if (answers[id] === key) {
            score += 1;
            bySkill[skill].score += 1;
        }
    });
    return { score, total:Object.keys(U3S8_ANSWER_KEY).length, bySkill };
}

function u3s8SafeAttempt(value) {
    if (!value) return null;
    return {
        answers:u3s8CleanAnswers(value.answers),
        metaResponses:u3s8CleanMeta(value.metaResponses),
        submitted:value.submitted === true,
        completada:value.completada === true,
        startedAt:Number(value.startedAt || 0),
        updatedAt:Number(value.updatedAt || 0),
        submittedAt:Number(value.submittedAt || 0)
    };
}

async function verifyU3S8Student(req) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) {
        const error = new Error('Inicia sesión para continuar.');
        error.status = 401;
        throw error;
    }
    const decoded = await auth.verifyIdToken(token);
    const snap = await db.ref(`${BASE}/estudiantes/${decoded.uid}`).once('value');
    const student = snap.val();
    if (!student || !U3S8_COURSES.has(student.curso)) {
        const error = new Error('Este ensayo no está asignado a tu curso.');
        error.status = 403;
        throw error;
    }
    return { uid:decoded.uid, student };
}

async function handleU3S8(req, res, action) {
    try {
        const { uid, student } = await verifyU3S8Student(req);
        const [sessionSnap, exceptionSnap] = await Promise.all([
            db.ref(`${BASE}/sesiones/${U3S8_SESSION}`).once('value'),
            db.ref(`${BASE}/sesiones/${U3S8_SESSION}/excepciones_desbloqueo/${uid}`).once('value')
        ]);
        const session = sessionSnap.val() || {};
        const access = {
            active:session.activa !== false || exceptionSnap.val() === true,
            released:session.resultados_visibles === true,
            title:session.titulo || 'Unidad 3 · Clase 8 — Ensayo parcial SIMCE'
        };
        const responseRef = db.ref(`${BASE}/respuestas/${U3S8_SESSION}/${uid}`);

        if (req.method === 'GET' && action === 'simce-u3s8-state') {
            const [responseSnap, resultSnap] = await Promise.all([
                responseRef.once('value'),
                db.ref(`${BASE}/resultados/${U3S8_SESSION}/${uid}`).once('value')
            ]);
            const attempt = u3s8SafeAttempt(responseSnap.val());
            const storedResult = resultSnap.val();
            const result = attempt && attempt.completada === true && storedResult
                ? {
                    score:Number(storedResult.score || 0),
                    total:Number(storedResult.total || Object.keys(U3S8_ANSWER_KEY).length),
                    porcentaje:Number(storedResult.porcentaje || 0)
                }
                : null;
            return res.status(200).json({
                ok:true,
                session:access,
                student:{ nombre:student.nombre || 'Estudiante', curso:student.curso },
                attempt,
                result
            });
        }
        if (req.method !== 'POST') return res.status(405).json({ error:'Método no permitido.' });
        if (!access.active) return res.status(423).json({ error:'La clase está cerrada. Si faltaste con justificación, solicita una habilitación individual.' });

        const currentSnap = await responseRef.once('value');
        const current = currentSnap.val();
        if (current && current.completada === true) return res.status(409).json({ error:'Este ensayo ya fue entregado.', completada:true });

        const request = u3s7BodyOf(req);
        const payload = {
            answers:u3s8CleanAnswers(request.answers),
            metaResponses:u3s8CleanMeta(request.metaResponses)
        };
        const now = Date.now();
        const startedAt = Number((current && current.startedAt) || now);

        if (action === 'simce-u3s8-save') {
            await responseRef.set({
                ...payload,
                nombre:u3s7CleanText(student.nombre, 140),
                curso:student.curso,
                submitted:false,
                completada:false,
                startedAt,
                updatedAt:now,
                submittedAt:null,
                completadaAt:null,
                score:null,
                total:Object.keys(U3S8_ANSWER_KEY).length
            });
            return res.status(200).json({ ok:true, updatedAt:now });
        }
        if (action !== 'simce-u3s8-submit') return res.status(400).json({ error:'Acción desconocida.' });

        const scored = u3s8ScoreAnswers(payload.answers);
        const percentage = Math.round((scored.score / scored.total) * 100);
        const responseRecord = {
            ...payload,
            nombre:u3s7CleanText(student.nombre, 140),
            curso:student.curso,
            submitted:true,
            completada:true,
            startedAt,
            updatedAt:now,
            submittedAt:now,
            completadaAt:now,
            score:scored.score,
            total:scored.total
        };
        const resultRecord = {
            nombre:u3s7CleanText(student.nombre, 140),
            curso:student.curso,
            score:scored.score,
            total:scored.total,
            porcentaje:percentage,
            bySkill:scored.bySkill,
            answered:Object.keys(payload.answers).length,
            submitted:true,
            completada:true,
            startedAt,
            updatedAt:now,
            submittedAt:now,
            completadaAt:now
        };
        const rootUpdates = {};
        rootUpdates[`${BASE}/respuestas/${U3S8_SESSION}/${uid}`] = responseRecord;
        rootUpdates[`${BASE}/resultados/${U3S8_SESSION}/${uid}`] = resultRecord;
        await db.ref().update(rootUpdates);
        return res.status(200).json({
            ok:true,
            completada:true,
            result:{ score:scored.score, total:scored.total, porcentaje:percentage }
        });
    } catch (error) {
        const status = Number(error.status || (error.code && String(error.code).startsWith('auth/') ? 401 : 500));
        return res.status(status).json({
            error:status === 500
                ? 'No fue posible guardar. Tu avance permanece en pantalla; vuelve a intentarlo.'
                : error.message
        });
    }
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

function isEmailAlreadyExistsError(error) {
    return !!error && (
        error.code === 'auth/email-already-exists'
        || error.code === 'auth/email-already-in-use'
        || String(error.message || '').toLowerCase().includes('already exists')
        || String(error.message || '').toLowerCase().includes('already in use')
    );
}

async function upsertStudentProfile(uid, student, decoded) {
    const ref = db.ref(`${BASE}/estudiantes/${uid}`);
    const snap = await ref.once('value');
    const existing = snap.val() || {};
    const payload = {
        ...existing,
        nombre: student.nombre,
        rut: cleanRut(student.rut),
        curso: student.curso,
        perfil_completo: existing.perfil_completo === true,
        password_changed: existing.password_changed === true,
        createdAt: existing.createdAt || Date.now(),
        createdBy: existing.createdBy || decoded.uid
    };
    await ref.set(payload);
    return { existed: snap.exists(), payload };
}

async function createOrRecoverStudentAuth(student, decoded) {
    const email = rutToEmail(student.rut);
    const password = defaultPassword(student.rut);
    let userRecord;
    let recoveredAuth = false;

    try {
        userRecord = await auth.createUser({ email, password, displayName: student.nombre });
    } catch (error) {
        if (!isEmailAlreadyExistsError(error)) throw error;
        userRecord = await auth.getUserByEmail(email);
        recoveredAuth = true;
        await auth.updateUser(userRecord.uid, { displayName: student.nombre }).catch(() => null);
    }

    const profile = await upsertStudentProfile(userRecord.uid, student, decoded);
    return {
        uid: userRecord.uid,
        email,
        password,
        recoveredAuth,
        recoveredProfile: profile.existed
    };
}

async function verifyAdmin(req) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) throw new Error('Token requerido');
    const decoded = await auth.verifyIdToken(token);
    const snap = await db.ref(`${BASE}/admins/${decoded.uid}`).once('value');
    if (!snap.val()) throw new Error('No autorizado');
    return decoded;
}

async function handleCreate(req, res, decoded) {
    const { nombre, rut, curso } = req.body;
    if (!nombre || !rut || !curso) return res.status(400).json({ error: 'Campos requeridos: nombre, rut, curso' });

    const result = await createOrRecoverStudentAuth({ nombre, rut, curso }, decoded);
    return res.status(200).json({ success: true, ...result });
}

async function handleResetPassword(req, res) {
    const { studentUid } = req.body;
    if (!studentUid) return res.status(400).json({ error: 'studentUid requerido' });

    const snap = await db.ref(`${BASE}/estudiantes/${studentUid}`).once('value');
    const student = snap.val();
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const newPassword = defaultPassword(student.rut);
    await auth.updateUser(studentUid, { password: newPassword });
    await db.ref(`${BASE}/estudiantes/${studentUid}`).update({ password_changed: false, password_reset_pending: false });

    return res.status(200).json({ success: true });
}

async function handleChangeRut(req, res, decoded) {
  const { studentUid, nuevoRut } = req.body;
  if (!studentUid || !nuevoRut) return res.status(400).json({ error: 'studentUid y nuevoRut requeridos' });

  const snap = await db.ref(`${BASE}/estudiantes/${studentUid}`).once('value');
  const student = snap.val();
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });

  const nuevoRutLimpio = cleanRut(nuevoRut);
  const nuevoEmail = rutToEmail(nuevoRutLimpio);
  const nuevaPassword = defaultPassword(nuevoRutLimpio);

  // Validar que el nuevo email no esté tomado por OTRO usuario
  try {
    const existing = await auth.getUserByEmail(nuevoEmail);
    if (existing && existing.uid !== studentUid) {
      return res.status(409).json({ error: 'El nuevo RUT ya pertenece a otro estudiante: ' + (existing.displayName || existing.uid) });
    }
  } catch (e) {
    if (!(e && (e.code === 'auth/user-not-found' || String(e.message || '').toLowerCase().includes('no user')))) {
      console.warn('[change-rut] getUserByEmail:', e.message);
    }
  }

  try {
    await auth.updateUser(studentUid, { email: nuevoEmail, password: nuevaPassword });
  } catch (e) {
    return res.status(500).json({ error: 'Error actualizando Firebase Auth: ' + e.message });
  }

  await db.ref(`${BASE}/estudiantes/${studentUid}`).update({
    rut: nuevoRutLimpio,
    password_changed: false,
    password_reset_pending: false,
    rut_anterior: student.rut || null,
    rut_cambiado_at: Date.now(),
    rut_cambiado_por: decoded.uid
  });

  return res.status(200).json({ success: true, uid: studentUid, nuevoEmail, nuevaPassword, rutAnterior: student.rut, rutNuevo: nuevoRutLimpio });
}

async function handleLoginToken(req, res) {
    const { studentUid } = req.body;
    if (!studentUid) return res.status(400).json({ error: 'studentUid requerido' });

    const snap = await db.ref(`${BASE}/estudiantes/${studentUid}`).once('value');
    if (!snap.val()) return res.status(404).json({ error: 'Estudiante no encontrado' });

    const customToken = await auth.createCustomToken(studentUid);
    return res.status(200).json({ success: true, token: customToken });
}

async function handleAdminLogin(req, res) {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'password requerido' });

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '#huala88138929';
    const ADMIN_UID = process.env.ADMIN_UID || 'admin_default';

    if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Contraseña incorrecta' });
    }

    try {
        const customToken = await auth.createCustomToken(ADMIN_UID);
        return res.status(200).json({ success: true, token: customToken, uid: ADMIN_UID });
    } catch (e) {
        console.error('[admin-login] Error creating token:', e.message);
        return res.status(500).json({ error: 'Error al generar token: ' + e.message });
    }
}

async function handleBulkCreate(req, res, decoded) {
    const { estudiantes } = req.body;
    if (!Array.isArray(estudiantes) || estudiantes.length === 0) return res.status(400).json({ error: 'Array de estudiantes requerido' });
    if (estudiantes.length > 50) return res.status(400).json({ error: 'Máximo 50 estudiantes por lote' });

    const results = { created: [], errors: [] };
    for (const est of estudiantes) {
        const { nombre, rut, curso } = est;
        if (!nombre || !rut || !curso) { results.errors.push({ nombre: nombre || '?', error: 'Campos incompletos' }); continue; }
        try {
            const result = await createOrRecoverStudentAuth({ nombre, rut, curso }, decoded);
            results.created.push({ nombre, uid: result.uid, recoveredAuth: result.recoveredAuth, recoveredProfile: result.recoveredProfile });
        } catch (e) { results.errors.push({ nombre, error: e.message }); }
    }

    return res.status(200).json({ success: true, total: estudiantes.length, created: results.created.length, errors: results.errors });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', resolveAllowedOrigin(req));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (initError) return res.status(500).json({ error: 'Firebase no inicializado: ' + initError });

    try {
        const action = String(req.query.action || (req.body && req.body.action) || '');

        if (action.startsWith('simce-u3s7-')) return await handleU3S7(req, res, action);
        if (action.startsWith('simce-u3s8-')) return await handleU3S8(req, res, action);
        if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

        // admin-login no requiere token previo
        if (action === 'admin-login') return await handleAdminLogin(req, res);

        const decoded = await verifyAdmin(req);

        switch (action) {
            case 'create': return await handleCreate(req, res, decoded);
            case 'reset-password': return await handleResetPassword(req, res);
            case 'bulk-create': return await handleBulkCreate(req, res, decoded);
            case 'login-token': return await handleLoginToken(req, res);
            case 'change-rut': return await handleChangeRut(req, res, decoded);
            default: return res.status(400).json({ error: 'Acción no válida. Usa: admin-login, create, reset-password, bulk-create, login-token, change-rut' });
        }
    } catch (error) {
        console.error('Error:', error);
        const status = error.message === 'Token requerido' ? 401 : error.message === 'No autorizado' ? 403 : 500;
        return res.status(status).json({ error: error.message });
    }
};
