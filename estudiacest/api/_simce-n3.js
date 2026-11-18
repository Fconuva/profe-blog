'use strict';
const catalog=require('./_simce-n3-keys.json');
const QUESTIONS=catalog.questions;
const BASE='plataforma_estudiantes',SESSION='ensayo-simce-n3-nm2-2026';
const fail=(status,message)=>Object.assign(new Error(message),{status});
function validIdentity(r,uid,curso){if(r&&((r.uid&&r.uid!==uid)||(r.sessionId&&r.sessionId!==SESSION)||(r.curso&&r.curso!==curso)))throw fail(409,'Tu registro requiere revisión de identidad.');}
async function manejar(req,res,db,auth){
 res.setHeader('Cache-Control','no-store');
 try{
  if(!['GET','POST'].includes(req.method))throw fail(405,'Método no permitido.');
  const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'');
  if(!token)throw fail(401,'Inicia sesión para entregar.');
  let actor;try{actor=await auth.verifyIdToken(token);}catch{throw fail(401,'Vuelve a ingresar para entregar.');}
  const uid=actor.uid;
  const [profileSnap,sessionSnap]=await Promise.all([db.ref(BASE+'/estudiantes/'+uid).once('value'),db.ref(BASE+'/sesiones/'+SESSION).once('value')]);
  const student=profileSnap.val(),session=sessionSnap.val();
  if(!student||student.activo===false||!['2A-HC','2B-HC'].includes(student.curso))throw fail(403,'Esta actividad corresponde a segundo HC.');
  const assigned=Array.isArray(session?.asignados)?session.asignados:Object.keys(session?.asignados||{});
  if(!session||(assigned.length&&!assigned.includes(uid)&&!assigned.includes(student.curso)))throw fail(403,'Esta actividad no está asignada a tu cuenta.');
  const responseRef=db.ref(BASE+'/respuestas/'+SESSION+'/'+uid);
  if(req.method==='GET'){
   const attempt=(await responseRef.once('value')).val();validIdentity(attempt,uid,student.curso);
   return res.status(200).json({ok:true,attempt:attempt?{submitted:attempt.submitted===true,completada:attempt.completada===true}:null});
  }
  if(session.excepciones_desbloqueo?.[uid]!==true&&(session.cierre_final===true||session.activa===false||session.respuestas_bloqueadas===true))throw fail(423,'La actividad está cerrada.');
  let body=req.body||{};if(typeof body==='string'){try{body=JSON.parse(body);}catch{throw fail(400,'Solicitud inválida.');}}
  const answers=Object.fromEntries(catalog.questions.filter(q=>'ABCD'.includes(String(body.answers?.[q.n]||''))&&String(body.answers?.[q.n]||'').length===1).map(q=>[q.n,body.answers[q.n]]));
  const open=Object.fromEntries(catalog.openQuestions.map(q=>[q.n,String(body.respuestas_abiertas?.[q.n]||'').trim().slice(0,20000)]));
  if(Object.keys(answers).length!==catalog.questions.length||Object.values(open).some(v=>!v))throw fail(400,'Completa las alternativas y las dos respuestas de desarrollo antes de entregar.');
  const now=Date.now(),correct=catalog.questions.filter(q=>answers[q.n]===q.correct).length;
  const result={uid,sessionId:SESSION,nombre:student.nombre||'',curso:student.curso,puntaje:correct,score:correct,total:QUESTIONS.length,porcentaje:Math.round(correct/catalog.questions.length*100),respuestas_abiertas:open,submittedAt:now,completadaAt:now,submitted_at:now,timestamp:now};
  const ref=responseRef;
  const tx=await responseRef.transaction(current=>{
   validIdentity(current,uid,student.curso);
   if(current&&(current.completada===true||current.submitted===true))return current;
   return {...current,uid,sessionId:SESSION,nombre:student.nombre||'',curso:student.curso,answers,respuestas_abiertas:open,submitted:true,completada:true,submittedAt:now,completadaAt:now,submitted_at:now,last_save:now,result};
  },undefined,false);
  const saved=tx.snapshot?.val()||(await ref.once('value')).val();
  validIdentity(saved,uid,student.curso);
  if(!tx.committed||!saved||saved.submitted!==true||saved.completada!==true)throw fail(409,'No se pudo confirmar la entrega. Reintenta.');
  // Espejo compatible: el resultado canónico se conserva atómico dentro del intento.
  if(saved.result)await db.ref(BASE+'/resultados/'+SESSION+'/'+uid).transaction(current=>current||saved.result,undefined,false);
  const confirmation=(await ref.once('value')).val();
  if(confirmation?.submitted!==true||confirmation?.completada!==true)throw fail(409,'La plataforma aún no confirma tu entrega.');
  return res.status(200).json({ok:true,submitted:true,completada:true});
 }catch(error){return res.status(error.status||500).json({error:error.status?error.message:'No se pudo entregar. Tu avance se conserva; reintenta.'});}
}
module.exports={manejar,SESSION};
