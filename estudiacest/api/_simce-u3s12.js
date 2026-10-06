'use strict';

const BASE = 'plataforma_estudiantes';
const SESSION_ID = 'sesion-u3-12';
const COURSES = new Set(['2A-HC', '2B-HC']);
const ANSWER_KEY = {
    q1:'A', q2:'C', q3:'B', q4:'D', q5:'B', q6:'D',
    q7:'A', q8:'C', q9:'C', q10:'A', q11:'D', q12:'B',
    q13:'A', q14:'C', q15:'B', q16:'D', q17:'A', q18:'C',
    q19:'B', q20:'D', q21:'A', q22:'C', q23:'B', q24:'D'
};
const SKILLS = {
    q1:'LOCALIZAR', q2:'INTERPRETAR', q3:'INTERPRETAR', q4:'REFLEXIONAR',
    q5:'LOCALIZAR', q6:'INTERPRETAR', q7:'INTERPRETAR', q8:'REFLEXIONAR',
    q9:'LOCALIZAR', q10:'INTERPRETAR', q11:'INTERPRETAR', q12:'REFLEXIONAR',
    q13:'LOCALIZAR', q14:'INTERPRETAR', q15:'INTERPRETAR', q16:'REFLEXIONAR',
    q17:'INTERPRETAR', q18:'REFLEXIONAR', q19:'LOCALIZAR', q20:'INTERPRETAR',
    q21:'INTERPRETAR', q22:'REFLEXIONAR', q23:'INTERPRETAR', q24:'REFLEXIONAR'
};
const WORK_IDS = ['g1', 'g2', 'a1', 'a2', 'a3', 'a4'];
const META_IDS = [...WORK_IDS, 'm1', 'm2', 'm3'];
const META_MIN = 25;

function bodyOf(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

function cleanText(value, max = 700) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanAnswers(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    return Object.fromEntries(Object.keys(ANSWER_KEY).flatMap((id) => {
        const value = String(source[id] || '').toUpperCase();
        return ['A', 'B', 'C', 'D'].includes(value) ? [[id, value]] : [];
    }));
}

function cleanMeta(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    return Object.fromEntries(META_IDS.map((id) => [id, cleanText(source[id], WORK_IDS.includes(id) ? 1200 : 700)]));
}

function safeAttempt(value) {
    if (!value) return null;
    return {
        answers: cleanAnswers(value.answers),
        metaResponses: cleanMeta(value.metaResponses),
        submitted: value.submitted === true,
        completada: value.completada === true,
        startedAt: Number(value.startedAt || 0),
        updatedAt: Number(value.updatedAt || 0),
        total: Number(value.total || 12),
        submittedAt: Number(value.submittedAt || 0)
    };
}

function scoreAnswers(answers) {
    let score = 0;
    const bySkill = {};
    Object.entries(ANSWER_KEY).forEach(([id, key]) => {
        const skill = SKILLS[id];
        if (!bySkill[skill]) bySkill[skill] = { score:0, total:0 };
        bySkill[skill].total += 1;
        if (answers[id] === key) {
            score += 1;
            bySkill[skill].score += 1;
        }
    });
    return { score, total:Object.keys(ANSWER_KEY).length, bySkill };
}

function validateFinal(payload) {
    const unanswered = Object.keys(ANSWER_KEY).filter((id) => !payload.answers[id]);
    const shortMeta = ['m1'].filter((id) => payload.metaResponses[id].length < META_MIN);
    if (unanswered.length || shortMeta.length) {
        const error = new Error('Completa las 24 preguntas y la pregunta de cierre antes de confirmar.');
        error.status = 400;
        error.fields = [...unanswered, ...shortMeta];
        throw error;
    }
}

async function verifyStudent(req, db, auth) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) {
        const error = new Error('Inicia sesión para continuar.');
        error.status = 401;
        throw error;
    }
    const decoded = await auth.verifyIdToken(token);
    const snap = await db.ref(`${BASE}/estudiantes/${decoded.uid}`).once('value');
    const student = snap.val();
    if (!student || !COURSES.has(student.curso)) {
        const error = new Error('Esta clase no está asignada a tu curso.');
        error.status = 403;
        throw error;
    }
    return { uid:decoded.uid, student };
}

function publicSession(session, exception) {
    return {
        active: session.activa !== false && (session.respuestas_bloqueadas !== true || exception === true),
        released: session.resultados_visibles === true,
        title: session.titulo || 'Unidad 3 · Clase 12 — La entrevista'
    };
}

async function manejar(req, res, action, db, auth) {
    try {
        const { uid, student } = await verifyStudent(req, db, auth);
        const [sessionSnap, exceptionSnap] = await Promise.all([
            db.ref(`${BASE}/sesiones/${SESSION_ID}`).once('value'),
            db.ref(`${BASE}/sesiones/${SESSION_ID}/excepciones_desbloqueo/${uid}`).once('value')
        ]);
        const session = sessionSnap.val() || {};
        const sessionState = publicSession(session, exceptionSnap.val() === true);
        const responseRef = db.ref(`${BASE}/respuestas/${SESSION_ID}/${uid}`);

        if (req.method === 'GET' && action === 'simce-u3s12-state') {
            const [responseSnap, resultSnap] = await Promise.all([
                responseRef.once('value'),
                db.ref(`${BASE}/resultados/${SESSION_ID}/${uid}`).once('value')
            ]);
            const attempt = safeAttempt(responseSnap.val());
            const storedResult = resultSnap.val();
            const result = sessionState.released && attempt && attempt.completada && storedResult
                ? { score:Number(storedResult.score || 0), total:Number(storedResult.total || 12), bySkill:storedResult.bySkill || {} }
                : null;
            return res.status(200).json({
                ok:true,
                student:{ nombre:cleanText(student.nombre, 140), curso:student.curso },
                session:sessionState,
                attempt,
                result
            });
        }

        if (req.method !== 'POST') return res.status(405).json({ error:'Método no permitido.' });
        if (!sessionState.active) return res.status(423).json({ error:'Esta clase está cerrada por el docente.' });

        const currentSnap = await responseRef.once('value');
        const current = currentSnap.val();
        if (current && current.completada === true) {
            return res.status(409).json({ error:'Esta clase ya fue entregada.', completada:true });
        }

        const request = bodyOf(req);
        const payload = { answers:cleanAnswers(request.answers), metaResponses:cleanMeta(request.metaResponses) };
        // Conservar evidencia histórica retirada de la interfaz, sin exigirla de nuevo.
        for (const id of [...WORK_IDS, 'm2','m3']) {
            if (!Object.prototype.hasOwnProperty.call(request.metaResponses || {}, id)) {
                payload.metaResponses[id] = cleanText(current?.metaResponses?.[id], WORK_IDS.includes(id) ? 1200 : 700);
            }
        }
        const now = Date.now();
        const startedAt = Number((current && current.startedAt) || request.startedAt || now);

        if (action === 'simce-u3s12-save') {
            await responseRef.set({
                ...payload,
                nombre:cleanText(student.nombre, 140),
                curso:student.curso,
                submitted:false,
                completada:false,
                startedAt,
                updatedAt:now,
                last_save:now,
                score:null,
                total:24,
                version:'entrevista-texto-preguntas-v3',
                formativa:true
            });
            return res.status(200).json({ ok:true, updatedAt:now });
        }

        if (action !== 'simce-u3s12-submit') return res.status(400).json({ error:'Acción desconocida.' });
        validateFinal(payload);
        const scored = scoreAnswers(payload.answers);
        const percentage = Math.round((scored.score / scored.total) * 100);
        const ticket = {
            repregunta_guiada:payload.metaResponses.g1,
            limite_guiado:payload.metaResponses.g2,
            reformulacion_rio:payload.metaResponses.a1,
            evidencia_fotografia:payload.metaResponses.a2,
            comparacion_entrevistas:payload.metaResponses.a3,
            titulares_corregidos:payload.metaResponses.a4,
            pregunta_orienta:payload.metaResponses.m1,
            evidencia_pregunta:payload.metaResponses.m2,
            estrategia_mejora:payload.metaResponses.m3
        };
        const responseRecord = {
            ...payload,
            ticket,
            nombre:cleanText(student.nombre, 140),
            curso:student.curso,
            submitted:true,
            completada:true,
            submittedAt:now,
            completadaAt:now,
            submitted_at:now,
            startedAt,
            updatedAt:now,
            last_save:now,
            score:scored.score,
            total:scored.total,
            formativa:true
        };
        const resultRecord = {
            score:scored.score,
            puntaje:scored.score,
            total:scored.total,
            porcentaje:percentage,
            bySkill:scored.bySkill,
            ticket,
            nombre:responseRecord.nombre,
            curso:responseRecord.curso,
            timestamp:now,
            submittedAt:now,
            completadaAt:now,
            startedAt,
            elapsedMs:Math.max(0, now - startedAt),
            formativa:true
        };
        const updates = {};
        updates[`respuestas/${SESSION_ID}/${uid}`] = responseRecord;
        updates[`resultados/${SESSION_ID}/${uid}`] = resultRecord;
        await db.ref(BASE).update(updates);

        const [submittedSnap, completedSnap] = await Promise.all([
            responseRef.child('submitted').once('value'),
            responseRef.child('completada').once('value')
        ]);
        if (submittedSnap.val() !== true || completedSnap.val() !== true) {
            throw new Error('La plataforma aún no confirma la entrega. Vuelve a intentarlo.');
        }
        return res.status(200).json({ ok:true, submitted:true, completada:true });
    } catch (error) {
        console.error('[simce-u3s12]', error);
        return res.status(error.status || 500).json({
            error:error.message || 'No fue posible procesar la clase.',
            fields:error.fields || undefined,
            completada:error.completada === true
        });
    }
}

module.exports = { manejar, SESSION_ID, ANSWER_KEY, SKILLS, META_IDS };
