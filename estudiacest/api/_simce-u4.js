'use strict';
const {exams, publicExam, examForAttempt} = require('./_simce-u4-catalog');
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
async function mirrorResult(db,exam,uid,record) {
  // Compatibilidad con reportes antiguos. El resultado canónico está dentro del
  // intento, escrito junto a las dos marcas; una copia tardía no lo puede revertir.
  const revision=Number(record.revision || 0);
  await db.ref(`${BASE}/resultados/${exam.sessionId}/${uid}`).transaction(current=>{
    if(current && Number(current.revision || 0)>revision)return;
    return record.submitted===true && record.completada===true
      ? {...record.result,revision}
      : {uid,sessionId:exam.sessionId,curso:record.curso,revision,reopened:true};
  },undefined,false);
}
async function manejar(req,res,action,db,auth) {
  res.setHeader('Cache-Control','no-store');
  try {
    if (!['GET','POST'].includes(req.method)) return res.status(405).json({error:'Método no permitido.'});
    let body = req.body || {};
    if (typeof body === 'string') { try {body=JSON.parse(body);} catch (_) {throw fail(400,'Solicitud inválida.');} }
    const number = String(req.query?.ensayo || body.ensayo || '');
    if (!/^[1-5]$/.test(number)) throw fail(400,'Selecciona un miniensayo de la Unidad 4.');
    let exam = exams[Number(number)-1];
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
      return res.status(200).json({ok:true,title:'Forma P 2025 · Referencia de lectura',
        referenceNote:'Reproducción local de contenido, no facsímil oficial. Se incluyen las dos respuestas construidas omitidas en la vista anterior; no se reabren intentos.',
        constructedResponses:[
          {id:10,textNumber:2,prompt:'En la reseña se mencionan grandes temas del libro de O’Brien. ¿Cuál se refleja mejor en el cuento «Medias»? Indica el tema y fundamenta con citas o ejemplos concretos del cuento.',measures:'Relacionar cuento y reseña, interpretar un tema y fundamentarlo con evidencia del cuento.'},
          {id:24,textNumber:4,prompt:'Considerando el fragmento y la conversación de los personajes sobre los roles de género, ¿qué función cumplirían los hombres en ese contexto? Justifica con información del texto.',measures:'Inferir el rol atribuido a los hombres a partir del diálogo y justificarlo con información pertinente.'}
        ],texts:content.textos.map(t=>({
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
        db.ref(`${BASE}/estudiantes`).once('value'),db.ref(`${BASE}/respuestas/${exam.sessionId}`).once('value')]);
      const students=studentsSnap.val() || {};
      const results=Object.entries(resultsSnap.val() || {}).filter(([studentUid,r])=>{
        const student=students[studentUid];
        return student && r.submitted===true && r.completada===true && r.uid===studentUid && r.sessionId===exam.sessionId && r.curso===student.curso &&
          COURSES.has(student.curso) && (teacher.superadmin===true || (teacher.cursos || []).includes(student.curso));
      }).map(([,r])=>({nombre:r.nombre,curso:r.curso,score:r.result?.score ?? r.score,total:r.total,bySkill:r.result?.bySkill || r.bySkill,simulatedScore:r.result?.simulatedScore ?? r.simulatedScore}));
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
    exam=examForAttempt(number,current);
    validateIdentity(current,exam,uid,student.curso);
    if (req.method === 'GET' && action === 'simce-u4-state') {
      const completed = current?.submitted === true && current?.completada === true;
      const active = available(session,uid,Date.now());
      return res.status(200).json({ok:true,student:{nombre:student.nombre || '',curso:student.curso},
        session:{active,title:session.titulo,date:exam.date},
        exam:active || completed ? publicExam(Number(number),exam) : null,
        attempt:current ? {answers:cleanAnswers(current.answers,exam),submitted:current.submitted === true,
          completada:current.completada === true,startedAt:current.startedAt,updatedAt:current.updatedAt,
          submittedAt:current.submittedAt,reopenedAt:current.reopenedAt || 0} : null,
        result:completed ? publicResult(current.result || scoreAnswers(current.answers || {},exam)) : null});
    }
    if (req.method !== 'POST' || !['simce-u4-save','simce-u4-submit'].includes(action)) throw fail(405,'Método o acción no permitido.');
    const isFinal = action === 'simce-u4-submit';
    const answers = cleanAnswers(body.answers,exam);
    const QUESTIONS=exam.texts.flatMap(t=>t.questions);
    if (isFinal && Object.keys(answers).length !== QUESTIONS.length) throw fail(400,`Responde las ${QUESTIONS.length} preguntas antes de entregar. Si no ves todas, recarga: tu avance guardado se conserva.`);
    const now=Date.now();
    if(!available(session,uid,now))throw fail(423,'Este miniensayo está cerrado.');
    const responseRef=db.ref(`${BASE}/respuestas/${exam.sessionId}/${uid}`);
    let previousForRollback=null;
    // Transacción de ~1 KB por intento: evita escribir el nodo de 18 MB y
    // conserva resultado y entrega como una única evidencia canónica.
    const transaction = await responseRef.transaction(previous => {
      if(previous===null && current)return previous; // Caché fría de un intento ya existente.
      if(!available(session,uid,Date.now()))throw fail(423,'Este miniensayo está cerrado.');
      validateIdentity(previous,exam,uid,student.curso);
      if (previous?.submitted === true || previous?.completada === true) throw fail(409,'Este miniensayo ya fue entregado.');
      if (Number(previous?.reopenedAt || 0) !== Number(body.reopenedAt || 0)) throw fail(409,'El docente actualizó tu intento. Recarga para continuar.');
      previousForRollback=previous || null;
      const startedAt=previous?.startedAt || now;
      const record={...(previous || {}),uid,sessionId:exam.sessionId,nombre:student.nombre || '',curso:student.curso,
        answers,startedAt,updatedAt:now,last_save:now,submitted:false,completada:false,total:QUESTIONS.length,version:exam.contentVersion || 'simce-u4-2026-v1'};
      record.revision=Number(previous?.revision || 0)+1;
      if (isFinal) Object.assign(record,scoreAnswers(answers,exam),{submitted:true,completada:true,
        submittedAt:now,completadaAt:now,submitted_at:now});
      if (isFinal) {
        record.result={...scoreAnswers(answers,exam),uid,sessionId:exam.sessionId,
          nombre:student.nombre || '',curso:student.curso,timestamp:now,submittedAt:now,completadaAt:now,
          startedAt,tiempo_transcurrido:Math.max(0,now-startedAt),tiempo_min:Math.round((now-startedAt)/60000)};
      }
      return record;
    },undefined,false);
    if (!transaction.committed) throw fail(503,'No se pudo confirmar el guardado. Vuelve a intentarlo.');
    const saved=transaction.snapshot.val();
    const [liveStudentSnap,liveSessionSnap]=await Promise.all([
      db.ref(`${BASE}/estudiantes/${uid}`).once('value'),db.ref(`${BASE}/sesiones/${exam.sessionId}`).once('value')]);
    const liveStudent=liveStudentSnap.val(),liveSession=liveSessionSnap.val();
    if(!liveStudent || liveStudent.activo===false || liveStudent.curso!==student.curso || !assigned(liveSession,uid,student.curso) || !available(liveSession,uid,Date.now())){
      // Revertir solo esta revisión si cambió el curso o el acceso mientras se guardaba.
      await responseRef.transaction(record=>record?.revision===saved.revision ? previousForRollback : undefined,undefined,false);
      throw fail(liveStudent?.curso!==student.curso?403:423,'La asignación o el acceso cambió. Vuelve a tu panel.');
    }
    if(isFinal)await mirrorResult(db,exam,uid,saved);
    const confirmation=(await responseRef.once('value')).val();
    if (!confirmation) throw fail(503,'La plataforma aún no confirma el guardado. Vuelve a intentarlo.');
    validateIdentity(confirmation,exam,uid,student.curso);
    if (isFinal && (confirmation?.submitted !== true || confirmation?.completada !== true || !confirmation.result)) throw fail(503,'La plataforma aún no confirma la entrega. Vuelve a intentarlo.');
    return res.status(200).json({ok:true,updatedAt:now,...(isFinal ? {submitted:true,completada:true} : {})});
  } catch (error) {
    return res.status(error.status || 500).json({error:error.status ? error.message : 'No se pudo conectar. Conserva tu avance y vuelve a intentarlo.'});
  }
}
async function reopenAttempt(db,actorUid,body,resetFields) {
 const exam=exams.find(e=>e.sessionId===body.sessionId);if(!exam)throw fail(400,'Miniensayo no válido.');
 const uid=body.studentUid;
 const [teacherSnap,studentSnap,sessionSnap,studentsSnap,gradeSnap]=await Promise.all([
  db.ref(`${BASE}/docentes/${actorUid}`).once('value'),db.ref(`${BASE}/estudiantes/${uid}`).once('value'),
  db.ref(`${BASE}/sesiones/${exam.sessionId}`).once('value'),db.ref(`${BASE}/estudiantes`).once('value'),
  db.ref(`${BASE}/calificaciones_clase/${uid}/${exam.sessionId}`).once('value')]);
 const teacher=teacherSnap.val(),student=studentSnap.val(),session=sessionSnap.val(),grade=gradeSnap.val();
 if(!teacher || !student || !session || !COURSES.has(student.curso) ||
    (teacher.superadmin!==true && !(teacher.cursos||[]).includes(student.curso)) || !assigned(session,uid,student.curso))throw fail(403,'Este intento no está asignado al docente.');
 const clean=value=>String(value || '').replace(/[^0-9k]/gi,'').toLowerCase();
 const run=clean(student.run || student.rut);
 if(run && Object.entries(studentsSnap.val()||{}).some(([id,s])=>id!==uid && clean(s.run || s.rut)===run))throw fail(409,'Hay cuentas duplicadas que requieren revisión.');
 const ref=db.ref(`${BASE}/respuestas/${exam.sessionId}/${uid}`),now=Date.now();
 let previousForRollback=null;
 const transaction=await ref.transaction(previous=>{
  if(!previous)return previous;
  validateIdentity(previous,exam,uid,student.curso);
  if(previous.history?.[body.requestId] || (previous.reopenedAt && previous.submitted!==true && previous.completada!==true))return;
  if(previous.submitted!==true && previous.completada!==true)throw fail(409,'No hay una entrega para reabrir.');
  previousForRollback=previous;
  const {history,...response}=previous;
  const archive={response,result:previous.result || null,...(grade?{grade}:{}),reopenedAt:now,reopenedBy:actorUid,course:student.curso,reason:'Reapertura individual para corregir y volver a entregar'};
  const draft={...previous,submitted:false,completada:false,updatedAt:now,last_save:now,reopenedAt:now,reopenedBy:actorUid,
    reopenRequestId:body.requestId,revision:Number(previous.revision||0)+1,history:{...(history||{}),[body.requestId]:archive}};
  [...resetFields,'result'].forEach(field=>delete draft[field]);return draft;
 },undefined,false);
 const record=(await ref.once('value')).val();
 if(!record?.history?.[body.requestId] && !record?.reopenedAt)throw fail(409,'No se confirmó la reapertura.');
 const [liveAdminSnap,liveTeacherSnap,liveStudentSnap]=await Promise.all([
  db.ref(`${BASE}/admins/${actorUid}`).once('value'),db.ref(`${BASE}/docentes/${actorUid}`).once('value'),db.ref(`${BASE}/estudiantes/${uid}`).once('value')]);
 const liveTeacher=liveTeacherSnap.val(),liveStudent=liveStudentSnap.val();
 if(liveAdminSnap.val()!==true || !liveTeacher || liveStudent?.curso!==student.curso ||
    (liveTeacher.superadmin!==true && !(liveTeacher.cursos||[]).includes(student.curso))){
  if(transaction.committed)await ref.transaction(value=>value?.revision===record.revision?previousForRollback:undefined,undefined,false);
  throw fail(403,'El permiso o el curso cambió durante la reapertura.');
 }
 const archive=record.history?.[body.requestId];
 if(archive){
  const updates={};updates[`historial_reaperturas/${exam.sessionId}/${uid}/${body.requestId}`]=archive;
  updates[`sesiones/${exam.sessionId}/excepciones_desbloqueo/${uid}`]=true;
  if(grade)updates[`calificaciones_clase/${uid}/${exam.sessionId}`]={...grade,submitted:false,needsReview:true,reopenedAt:now,status:'revision_pending',statusLabel:'Reabierta para corregir; nota pendiente de revisión docente.'};
  await db.ref(BASE).update(updates);await mirrorResult(db,exam,uid,record);
 }
 return {ok:true,reopened:record.submitted!==true && record.completada!==true,alreadyProcessed:!transaction.committed,sessionId:exam.sessionId,studentUid:uid};
}
module.exports={manejar,reopenAttempt,mirrorResult,scoreAnswers,cleanAnswers,available,CLOSE_AT,BASE};
