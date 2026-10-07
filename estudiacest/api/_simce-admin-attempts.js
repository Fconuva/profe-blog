'use strict';

const BASE = 'plataforma_estudiantes';
const VALID_KEY = /^[A-Za-z0-9_-]{1,128}$/;
const RESET_FIELDS = ['submittedAt','completadaAt','submitted_at','strikes','bloqueado_por_copia',
    'bloqueado_por_strikes','auto_submitted','auto_submit_motivo','strike_motivo',
    'last_strike_at','focus_log','manualCompletion','attestation','deliveryReconciliation'];

function fail(status, message) { const error = new Error(message); error.status = status; return error; }
function bodyOf(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

// Respaldo y reapertura juntos; permisos revalidados al reintentar la transacción.
function reopen(current, { sessionId, studentUid, requestId }, actorUid, now) {
    if (current.admins?.[actorUid] !== true) throw fail(403, 'No autorizado.');
    const teacher = current.docentes?.[actorUid];
    const student = current.estudiantes?.[studentUid];
    const session = current.sesiones?.[sessionId];
    if (!student || !session) throw fail(404, 'No se encontró la sesión o el estudiante.');
    if (!/^[12][A-Z]-(HC|TP)$/.test(student.curso || '') || session.programa === 'paes') {
        throw fail(400, 'Esta acción corresponde solo a SIMCE.');
    }
    if (teacher && teacher.superadmin !== true && !(teacher.cursos || []).includes(student.curso)) {
        throw fail(403, 'Este curso no está asignado al docente.');
    }
    const assigned = Array.isArray(session.asignados) ? session.asignados
        : typeof session.asignados === 'string' ? [session.asignados] : Object.keys(session.asignados || {});
    if (assigned.length && !assigned.includes(student.curso) && !assigned.includes(studentUid)) {
        throw fail(403, 'La sesión no está asignada a este estudiante.');
    }
    if (session.requiere_entrega === false) throw fail(400, 'Esta sesión es informativa.');
    const response = current.respuestas?.[sessionId]?.[studentUid];
    const result = current.resultados?.[sessionId]?.[studentUid];
    const archive = current.historial_reaperturas?.[sessionId]?.[studentUid]?.[requestId];
    if (archive) return null; // Repetir la petición no reabre una segunda entrega.
    if (!response) throw fail(409, 'No hay respuestas guardadas para conservar.');
    if (response.curso && response.curso !== student.curso) throw fail(409, 'El curso de la respuesta requiere revisión.');
    const cleanRun = value => String(value || '').replace(/[^0-9k]/gi, '').toLowerCase();
    const run = cleanRun(student.run || student.rut || student.RUN);
    if (run && Object.entries(current.estudiantes || {}).some(([uid, other]) => uid !== studentUid &&
        cleanRun(other.run || other.rut || other.RUN) === run)) throw fail(409, 'Hay cuentas duplicadas que requieren revisión antes de reabrir.');
    if (response.submitted !== true && response.completada !== true && !result) {
        if (response.reopenedAt) return null;
        throw fail(409, 'El estudiante todavía no ha entregado esta sesión.');
    }

    const next = JSON.parse(JSON.stringify(current));
    const put = (keys, value) => {
        let node = next;
        for (const key of keys.slice(0, -1)) node = node[key] ||= {};
        if (value === null) delete node[keys.at(-1)]; else node[keys.at(-1)] = value;
    };
    const personal = sessionId.match(/^personal-u3-(\d+)-/);
    const gradeSession = personal ? `sesion-u3-${personal[1]}` : sessionId;
    const grade = current.calificaciones_clase?.[studentUid]?.[gradeSession];
    const ranking = {};
    for (const [course, records] of Object.entries(current.ranking?.[sessionId] || {})) {
        if (records?.[studentUid]) ranking[course] = records[studentUid];
    }
    put(['historial_reaperturas', sessionId, studentUid, requestId], {
        response, ...(result ? { result } : {}), ...(grade ? { grade } : {}), ranking,
        reopenedAt:now, reopenedBy:actorUid, course:student.curso,
        reason:'Reapertura individual para corregir y volver a entregar'
    });
    const draft = { ...response, submitted:false, completada:false, updatedAt:now, last_save:now,
        reopenedAt:now, reopenedBy:actorUid, reopenRequestId:requestId };
    RESET_FIELDS.forEach(key => delete draft[key]);
    put(['respuestas', sessionId, studentUid], draft);
    put(['resultados', sessionId, studentUid], null);
    Object.keys(ranking).forEach(course => put(['ranking', sessionId, course, studentUid], null));
    put(['sesiones', sessionId, 'excepciones_desbloqueo', studentUid], true);
    if (grade) put(['calificaciones_clase', studentUid, gradeSession], {
        ...grade, submitted:false, needsReview:true, reopenedAt:now, status:'revision_pending',
        statusLabel:'Reabierta para corregir. La nota anterior queda pendiente de revisión docente.'
    });
    return next;
}

async function manejar(req, res, action, db, auth) {
    res.setHeader('Cache-Control', 'no-store');
    try {
        if (action !== 'reopen') throw fail(400, 'Acción desconocida.');
        if (req.method !== 'POST') throw fail(405, 'Método no permitido.');
        const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
        if (!token) throw fail(401, 'Inicia sesión como docente.');
        let actor;
        try { actor = await auth.verifyIdToken(token); } catch (_) { throw fail(401, 'Sesión no válida.'); }
        const adminSnap = await db.ref(`${BASE}/admins/${actor.uid}`).once('value');
        if (adminSnap.val() !== true) throw fail(403, 'No autorizado.');
        const body = bodyOf(req);
        for (const key of ['sessionId','studentUid','requestId']) {
            if (typeof body[key] !== 'string' || !VALID_KEY.test(body[key])) throw fail(400, 'Identificador no válido.');
        }
        if (body.requestId.length < 12) throw fail(400, 'Identificador de solicitud no válido.');
        const now = Date.now();
        let refusal = null;
        const transaction = await db.ref(BASE).transaction(current => {
            // Firebase puede invocar primero con null por caché fría.
            if (current === null) return current;
            refusal = null;
            try { return reopen(current, body, actor.uid, now) || undefined; }
            catch (error) { refusal = error; return undefined; }
        }, undefined, false);
        if (refusal) throw refusal;
        const state = transaction.snapshot.val();
        const [responseSnap, exceptionSnap] = await Promise.all([
            db.ref(`${BASE}/respuestas/${body.sessionId}/${body.studentUid}`).once('value'),
            db.ref(`${BASE}/sesiones/${body.sessionId}/excepciones_desbloqueo/${body.studentUid}`).once('value')
        ]);
        const response = responseSnap.val();
        const history = state?.historial_reaperturas?.[body.sessionId]?.[body.studentUid];
        if (!history?.[body.requestId] && !response?.reopenedAt) throw fail(409, 'No fue posible confirmar la reapertura.');
        if (transaction.committed && (response?.reopenRequestId !== body.requestId || exceptionSnap.val() !== true)) {
            throw fail(409, 'No fue posible confirmar la habilitación individual.');
        }
        return res.status(200).json({ ok:true, reopened:Boolean(response && response.submitted !== true && response.completada !== true),
            alreadyProcessed:!transaction.committed, sessionId:body.sessionId, studentUid:body.studentUid });
    } catch (error) {
        return res.status(error.status || 500).json({ error:error.status ? error.message : 'No fue posible reabrir. Vuelve a intentar.' });
    }
}

module.exports = { manejar, reopen };
