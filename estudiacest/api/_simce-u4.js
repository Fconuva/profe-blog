'use strict';
const {exams, publicExam} = require('./_simce-u4-catalog');
const BASE = 'plataforma_estudiantes';
const COURSES = new Set(['2A-HC','2B-HC']);
const CLOSE_AT = Date.parse('2026-11-11T00:00:00-03:00');
const fail = (status, message) => Object.assign(new Error(message), {status});
function cleanAnswers(raw, exam) {
  return Object.fromEntries(exam.texts.flatMap(t => t.questions).flatMap(q =>
    ['A','B','C','D'].includes(raw?.[q.id]) ? [[q.id,raw[q.id]]] : []));
}
function scoreAnswers(answers, exam) {
  const questions = exam.texts.flatMap(t => t.questions);
  const bySkill = {};
  let score = 0;
  questions.forEach(q => {
    const bucket = bySkill[q.skill] ||= {score:0,total:0};
    bucket.total++;
    if (answers[q.id] === q.key) { score++; bucket.score++; }
  });
  // Índice lineal propio CEST, sin equiparación psicométrica ni niveles oficiales.
  return {score, puntaje:score, total:questions.length, porcentaje:Math.round(score/questions.length*100),
    simulatedScore:Math.round(150 + 200*score/questions.length), simulationVersion:'cest-linear-150-350-v1', bySkill};
}
function publicResult(value) {
  if (!value) return null;
  return {score:value.score,total:value.total,porcentaje:value.porcentaje,simulatedScore:value.simulatedScore,
    simulationLabel:'Puntaje simulado CEST. No es un puntaje oficial ni una predicción de SIMCE.'};
}
function validateIdentity(record, exam, uid, course) {
  if (record && (record.uid !== uid || record.sessionId !== exam.sessionId || record.curso !== course)) {
    throw fail(409,'El registro requiere revisión de identidad antes de continuar.');
  }
}
function available(session, uid, now) {
  return !!session && now < CLOSE_AT && ((session.activa !== false && session.respuestas_bloqueadas !== true)
    || session.excepciones_desbloqueo?.[uid] === true);
}
function assigned(session, uid, course) {
  return Array.isArray(session?.asignados) && (session.asignados.includes(course) || session.asignados.includes(uid));
}
async function manejar(req,res,action,db,auth) {
  res.setHeader('Cache-Control','no-store');
  try {
    if (!['GET','POST'].includes(req.method)) return res.status(405).json({error:'Método no permitido.'});
    let body = req.body || {};
    if (typeof body === 'string') { try {body=JSON.parse(body);} catch (_) {throw fail(400,'Solicitud inválida.');} }
    const number = String(req.query?.ensayo || body.ensayo || '');
    if (!/^[1-5]$/.test(number)) throw fail(400,'Selecciona un miniensayo de la Unidad 4.');
    const exam = exams[Number(number)-1];
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i,'');
    if (!token) throw fail(401,'Inicia sesión para continuar.');
    let decoded;
    try {decoded=await auth.verifyIdToken(token);} catch (_) {throw fail(401,'Inicia sesión nuevamente.');}
    const uid = decoded.uid;
    if (req.method === 'GET' && action === 'simce-u4-example') {
      const [studentSnap,adminSnap,teacherSnap]=await Promise.all([
        db.ref(`${BASE}/estudiantes/${uid}`).once('value'),db.ref(`${BASE}/admins/${uid}`).once('value'),db.ref(`${BASE}/docentes/${uid}`).once('value')]);
      const student=studentSnap.val(),teacher=teacherSnap.val();
      const studentAllowed=student && student.activo!==false && COURSES.has(student.curso);
      const teacherAllowed=adminSnap.val()===true && teacher && (teacher.superadmin===true || (teacher.cursos||[]).some(c=>COURSES.has(c)));
      if(!studentAllowed && !teacherAllowed)throw fail(403,'Esta referencia corresponde a los cursos de SIMCE NM2.');
      const content=(await db.ref(`${BASE}/sesiones/sesion-2/contenido`).once('value')).val();
      if(!Array.isArray(content?.textos) || !Array.isArray(content?.preguntas))throw fail(503,'La referencia no está disponible.');
      const plain=value=>String(value || '').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,'');
      return res.status(200).json({ok:true,title:'Forma P 2025 · Referencia de lectura',texts:content.textos.map(t=>({
        title:plain(t.titulo),source:plain(t.fuente),paragraphs:(t.parrafos||[]).map(p=>plain(p.texto)),
        questions:content.preguntas.filter(q=>q.textoRef===t.id).map(q=>({id:q.id,prompt:plain(q.enunciado),options:(q.opciones||[]).map(o=>plain(o.texto))}))
      }))});
    }
    if (req.method === 'GET' && action === 'simce-u4-review') {
      const [adminSnap,teacherSnap]=await Promise.all([
        db.ref(`${BASE}/admins/${uid}`).once('value'),db.ref(`${BASE}/docentes/${uid}`).once('value')]);
      const teacher=teacherSnap.val();
      if(adminSnap.val() !== true || !teacher)throw fail(403,'Acceso reservado al docente autorizado.');
      if(teacher.superadmin!==true && !(teacher.cursos || []).some(c=>COURSES.has(c)))throw fail(403,'No tienes un curso de esta unidad asignado.');
      const [studentsSnap,resultsSnap]=await Promise.all([
        db.ref(`${BASE}/estudiantes`).once('value'),db.ref(`${BASE}/resultados/${exam.sessionId}`).once('value')]);
      const students=studentsSnap.val() || {};
      const results=Object.entries(resultsSnap.val() || {}).filter(([studentUid,r])=>{
        const student=students[studentUid];
        return student && r.uid===studentUid && r.sessionId===exam.sessionId && r.curso===student.curso &&
          COURSES.has(student.curso) && (teacher.superadmin===true || (teacher.cursos || []).includes(student.curso));
      }).map(([,r])=>({nombre:r.nombre,curso:r.curso,score:r.score,total:r.total,bySkill:r.bySkill,simulatedScore:r.simulatedScore}));
      return res.status(200).json({ok:true,exam,results});
    }
    const [studentSnap,sessionSnap,responseSnap] = await Promise.all([
      db.ref(`${BASE}/estudiantes/${uid}`).once('value'),
      db.ref(`${BASE}/sesiones/${exam.sessionId}`).once('value'),
      db.ref(`${BASE}/respuestas/${exam.sessionId}/${uid}`).once('value')
    ]);
    const student=studentSnap.val(), session=sessionSnap.val(), current=responseSnap.val();
    if (!student || student.activo === false || !COURSES.has(student.curso) || !assigned(session,uid,student.curso)) {
      throw fail(403,'Este miniensayo no está asignado a tu curso.');
    }
    validateIdentity(current,exam,uid,student.curso);
    if (req.method === 'GET' && action === 'simce-u4-state') {
      const completed = current?.submitted === true && current?.completada === true;
      const active = available(session,uid,Date.now());
      return res.status(200).json({ok:true,student:{nombre:student.nombre || '',curso:student.curso},
        session:{active,title:session.titulo,date:exam.date},
        exam:active || completed ? publicExam(Number(number)) : null,
        attempt:current ? {answers:cleanAnswers(current.answers,exam),submitted:current.submitted === true,
          completada:current.completada === true,startedAt:current.startedAt,updatedAt:current.updatedAt,
          submittedAt:current.submittedAt,reopenedAt:current.reopenedAt || 0} : null,
        result:completed ? publicResult(scoreAnswers(current.answers || {},exam)) : null});
    }
    if (req.method !== 'POST' || !['simce-u4-save','simce-u4-submit'].includes(action)) throw fail(405,'Método o acción no permitido.');
    const isFinal = action === 'simce-u4-submit';
    const answers = cleanAnswers(body.answers,exam);
    const QUESTIONS=exam.texts.flatMap(t=>t.questions);
    if (isFinal && Object.keys(answers).length !== QUESTIONS.length) throw fail(400,'Responde las 18 preguntas antes de entregar.');
    const now=Date.now();
    // La transacción común escribe respuestas y resultados juntos; revalida permisos
    // al reintentar e impide que un autoguardado concurrente revierta la entrega.
    const transaction = await db.ref(BASE).transaction(platform => {
      if (!platform) return platform; // Lectura fría: Firebase contrasta null con el servidor y reintenta.
      const liveStudent=platform.estudiantes?.[uid], liveSession=platform.sesiones?.[exam.sessionId];
      if (!liveStudent || liveStudent.activo === false || liveStudent.curso !== student.curso ||
          !COURSES.has(liveStudent.curso) || !assigned(liveSession,uid,liveStudent.curso)) throw fail(403,'La asignación cambió. Vuelve a tu panel.');
      if (!available(liveSession,uid,Date.now())) throw fail(423,'Este miniensayo está cerrado.');
      const previous=platform.respuestas?.[exam.sessionId]?.[uid];
      validateIdentity(previous,exam,uid,student.curso);
      if (previous?.submitted === true || previous?.completada === true) throw fail(409,'Este miniensayo ya fue entregado.');
      if (Number(previous?.reopenedAt || 0) !== Number(body.reopenedAt || 0)) throw fail(409,'El docente actualizó tu intento. Recarga para continuar.');
      const startedAt=previous?.startedAt || now;
      const record={...(previous || {}),uid,sessionId:exam.sessionId,nombre:liveStudent.nombre || '',curso:student.curso,
        answers,startedAt,updatedAt:now,last_save:now,submitted:false,completada:false,total:QUESTIONS.length,version:'simce-u4-2026-v1'};
      if (isFinal) Object.assign(record,scoreAnswers(answers,exam),{submitted:true,completada:true,
        submittedAt:now,completadaAt:now,submitted_at:now});
      platform.respuestas ||= {};
      platform.respuestas[exam.sessionId] ||= {};
      platform.respuestas[exam.sessionId][uid]=record;
      if (isFinal) {
        platform.resultados ||= {};
        platform.resultados[exam.sessionId] ||= {};
        platform.resultados[exam.sessionId][uid]={...scoreAnswers(answers,exam),uid,sessionId:exam.sessionId,
          nombre:liveStudent.nombre || '',curso:student.curso,timestamp:now,submittedAt:now,completadaAt:now,
          startedAt,tiempo_transcurrido:Math.max(0,now-startedAt),tiempo_min:Math.round((now-startedAt)/60000)};
      }
      return platform;
    },undefined,false);
    if (!transaction.committed) throw fail(503,'No se pudo confirmar el guardado. Vuelve a intentarlo.');
    const confirmation=(await db.ref(`${BASE}/respuestas/${exam.sessionId}/${uid}`).once('value')).val();
    if (!confirmation) throw fail(503,'La plataforma aún no confirma el guardado. Vuelve a intentarlo.');
    validateIdentity(confirmation,exam,uid,student.curso);
    if (isFinal && (confirmation?.submitted !== true || confirmation?.completada !== true)) throw fail(503,'La plataforma aún no confirma la entrega. Vuelve a intentarlo.');
    return res.status(200).json({ok:true,updatedAt:now,...(isFinal ? {submitted:true,completada:true} : {})});
  } catch (error) {
    return res.status(error.status || 500).json({error:error.status ? error.message : 'No se pudo conectar. Conserva tu avance y vuelve a intentarlo.'});
  }
}
module.exports={manejar,scoreAnswers,cleanAnswers,available,CLOSE_AT,BASE};
