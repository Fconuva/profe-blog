'use strict';
const BASE='plataforma_estudiantes',KEY=/^[A-Za-z0-9_-]{1,128}$/;
const fail=(status,message)=>Object.assign(new Error(message),{status});
const validGrade=n=>typeof n==='number'&&Number.isFinite(n)&&n>=1&&n<=7&&Math.abs(n*10-Math.round(n*10))<1e-8;
const valueOf=r=>validGrade(Number(r?.grade))?Number(r.grade):null;
const versionOf=r=>String(r?.manualGradeAt||r?.publishedAt||'');
function gradeSession(id){const personal=id.match(/^personal-u3-(\d+)-/);return personal?'sesion-u3-'+personal[1]:id;}
async function manejar(req,res,db,auth){
 res.setHeader('Cache-Control','private, no-store');
 try{
  if(req.method!=='POST')throw fail(405,'Usa POST para guardar una nota.');
  let b=req.body||{};if(typeof b==='string'){try{b=JSON.parse(b);}catch(_){throw fail(400,'Solicitud inválida.');}}
  if(!KEY.test(b.sessionId||'')||!KEY.test(b.studentUid||'')||!KEY.test(b.requestId||'')||String(b.requestId).length<12||!validGrade(b.grade)||typeof b.reason!=='string'||b.reason.trim().length<3||b.reason.trim().length>300||!(b.expectedGrade===null||validGrade(b.expectedGrade))||typeof b.expectedVersion!=='string')throw fail(400,'Indica una nota de 1,0 a 7,0 y un motivo de 3 a 300 caracteres.');
  const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'');if(!token)throw fail(401,'Ingresa como docente.');
  let actor;try{actor=await auth.verifyIdToken(token);}catch(_){throw fail(401,'Vuelve a ingresar como docente.');}
  const [a,t,s,c,r]=await Promise.all(['admins/'+actor.uid,'docentes/'+actor.uid,'estudiantes/'+b.studentUid,'sesiones/'+b.sessionId,'respuestas/'+b.sessionId+'/'+b.studentUid].map(p=>db.ref(BASE+'/'+p).once('value')));
  const fallback=/^sesion-u3-(?:[1-9]|1[0-2])$/.test(b.sessionId)?{programa:'simce',asignados:['2A-HC','2B-HC'],titulo:'Unidad 3 · Clase '+b.sessionId.split('-').at(-1)}:null;
  const teacher=t.val(),student=s.val(),session=c.val()||fallback,response=r.val();
  if(a.val()!==true)throw fail(403,'Acceso reservado al docente.');
  if(!student||!session)throw fail(404,'No se encontró el estudiante o la sesión.');
  if(!/^[12][A-Z]-(HC|TP)$/.test(student.curso||'')||session.programa==='paes')throw fail(400,'Esta edición corresponde a SIMCE.');
  if(teacher&&teacher.superadmin!==true&&!(teacher.cursos||[]).includes(student.curso))throw fail(403,'No tienes este curso asignado.');
  const targets=Array.isArray(session.asignados)?session.asignados:typeof session.asignados==='string'?[session.asignados]:Object.keys(session.asignados||{});
  if(targets.length&&!targets.includes(student.curso)&&!targets.includes(b.studentUid))throw fail(403,'La sesión no corresponde a este estudiante.');
  if(response&&(response.uid&&response.uid!==b.studentUid||response.sessionId&&response.sessionId!==b.sessionId||response.curso&&response.curso!==student.curso))throw fail(409,'La identidad del intento requiere revisión.');
  const sid=gradeSession(b.sessionId);
  if(session.requiere_entrega===false||sid==='sesion-u3-9'||sid==='sesion-u3-8'&&['2A-HC','2B-HC'].includes(student.curso))throw fail(400,'Esta clase está registrada sin evaluación.');
  const ref=db.ref(`${BASE}/calificaciones_clase/${b.studentUid}/${sid}`),now=Date.now();let conflict=false;
  const tx=await ref.transaction(current=>{
   conflict=false;
   if(current===null&&(b.expectedGrade!==null||b.expectedVersion))return current; // Caché fría: reintentar con el registro del servidor.
   if(current?.manualGradeHistory?.[b.requestId])return current;
   if(current&&current.sessionId&&current.sessionId!==sid){conflict=true;return;}
   if(valueOf(current)!==b.expectedGrade||versionOf(current)!==b.expectedVersion){conflict=true;return;}
   const override={grade:b.grade,source:'admin-manual',recordedAt:now,recordedBy:actor.uid,reason:b.reason.trim(),requestId:b.requestId};
   return {...(current||{}),sessionId:sid,classNumber:Number(sid.match(/-(\d+)$/)?.[1]||session.panel_orden||0),title:current?.title||session.titulo||sid,
    ...(sid!==b.sessionId?{personalRoute:true,evidenceSession:b.sessionId}:{}),grade:b.grade,
    ...(!current?{status:'manual_grade',statusLabel:'Calificación asignada por el docente; no confirma una entrega.'}:{}),
    manualGradeAt:now,publishedAt:new Date(now).toISOString(),teacherGradeOverride:override,
    ...(response?.submitted===true&&response?.completada===true?{needsReview:false,...(current?.status==='revision_pending'?{status:'submitted',statusLabel:'Nota revisada por el docente.'}:{})}:{}),
    manualGradeHistory:{...(current?.manualGradeHistory||{}),[b.requestId]:{...override,previous:current?{grade:current.grade??null,status:current.status||'',publishedAt:current.publishedAt||'',needsReview:current.needsReview===true}:null}}};
  },undefined,false);
  const record=(await ref.once('value')).val();
  if(!tx.committed||conflict||record?.manualGradeHistory?.[b.requestId]?.recordedBy!==actor.uid||record.grade!==b.grade)throw fail(409,'La nota cambió o no se pudo confirmar. Actualiza antes de reintentar.');
  return res.status(200).json({ok:true,sessionId:sid,studentUid:b.studentUid,record});
 }catch(e){return res.status(e.status||500).json({error:e.status?e.message:'No se pudo guardar la nota. Actualiza y reintenta.'});}
}
module.exports={manejar,validGrade,valueOf,versionOf,gradeSession};
