'use strict';
const C=require('./_paes-mini-invierno-catalog');
// Nodo sin permisos RTDB cliente: ni puntaje ni claves antes de publicación.
const BASE='plataforma_paes/mini_invierno_intentos',CONFIG='plataforma_paes/mini_invierno_2027_config';
const clean=v=>String(v||'').replace(/[^0-9A-Z]/gi,'').toUpperCase();
const error=(status,message)=>Object.assign(new Error(message),{status});
const delivered=r=>r?.submitted===true&&r?.completada===true;
const courses=new Set(['4AHC','4BHC']);
async function identity(req,db,auth){
 const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'').trim();if(!token)throw error(401,'Ingresa con tu cuenta de Estudia CEST.');
 let d;try{d=await auth.verifyIdToken(token);}catch(_){throw error(401,'Vuelve a ingresar con tu cuenta.');}
 const p=(await db.ref('plataforma_estudiantes/estudiantes/'+d.uid).once('value')).val();
 const course=clean(p?.curso),guided=clean(p?.rut)==='229327739';
 if(!p||p.activo===false||(!courses.has(course)&&!(guided&&['3AHC','3BHC'].includes(course))))throw error(403,'Este miniensayo corresponde a NM4 PAES.');
 return {uid:d.uid,nombre:String(p.nombre||p.name||'').slice(0,120),curso:course.replace(/^(\d)([A-Z])HC$/,'$1$2-HC'),guided,sessionId:C.SESSION+(guided?'-guiada':'')};
}
function validate(input,g){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.version!==C.VERSION)throw error(409,'Recarga para usar la versión vigente.');
 const allowed=new Set(C.questionsFor(g).map(q=>q.id)),answers={},reflection={};
 if(input.answers&&(typeof input.answers!=='object'||Array.isArray(input.answers)))throw error(400,'Respuestas no válidas.');
 for(const [id,v]of Object.entries(input.answers||{})){if(!allowed.has(id)||!['A','B','C','D'].includes(v))throw error(400,'Respuesta no válida.');answers[id]=v;}
 for(const id of ['comprendi','evidencia','mejorare'])reflection[id]=String(input.reflection?.[id]||'').trim().slice(0,1500);
 return {answers,reflection};
}
function form(uid){let seed=2166136261;for(const c of uid+C.VERSION)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;const map={};for(const q of C.questionsFor(false)){let a=['A','B','C','D'];for(let i=3;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]];}map[q.id]=a;}return map;}
async function publicAttempt(db,r,i){if(!r||r.resetAt)return null;const {answers,reflection,startedAt,updatedAt,submittedAt,completadaAt,sessionId,strikes,incidents,endedBy}=r;
 const out={answers:answers||{},reflection:reflection||{},startedAt,updatedAt,submittedAt,completadaAt,sessionId,strikes:strikes||0,incidents:incidents||{},endedBy:endedBy||null,submitted:r.submitted===true,completada:r.completada===true};
 const pub=(await db.ref(CONFIG+'/publicacion').once('value')).val()||{};
 if(delivered(r)&&(pub.cursos?.[i.curso]===true||pub.estudiantes?.[i.uid]===true)){out.result=C.grade(answers||{},i.guided);out.review=C.questionsFor(i.guided);}
 return out;
}
async function handle(action,req,res,{db,auth,adminUid}){
 res.setHeader('Cache-Control','private, no-store');
 try{
  if(action.startsWith('admin-mini-')){
   if(!adminUid)throw error(403,'No autorizado.');
   if(action==='admin-mini-list'){const rows=[];for(const sid of [C.SESSION,C.SESSION+'-guiada']){const records=(await db.ref(BASE+'/'+sid).once('value')).val()||{};for(const [uid,r]of Object.entries(records))rows.push({...r,uid,sessionId:sid});}return res.status(200).json({success:true,rows,publication:(await db.ref(CONFIG+'/publicacion').once('value')).val()||{},keys:{regular:C.questionsFor(false),guided:C.questionsFor(true)}});}
   if(req.method!=='POST')throw error(405,'Usa POST.');
   const b=req.body||{};
   if(action==='admin-mini-release'){if(!['4A-HC','4B-HC','3A-HC','3B-HC'].includes(b.curso)||typeof b.published!=='boolean')throw error(400,'Curso no válido.');await db.ref(CONFIG+'/publicacion/cursos/'+b.curso).set(b.published);return res.status(200).json({success:true});}
   if(action==='admin-mini-reset'){
    if(!/^[\w-]{1,128}$/.test(b.uid||'')||![C.SESSION,C.SESSION+'-guiada'].includes(b.sessionId))throw error(400,'Intento no válido.');
    const now=Date.now(),ref=db.ref(BASE+'/'+b.sessionId+'/'+b.uid);
    const tx=await ref.transaction(r=>r===null?null:r&&!r.resetAt?{sessionId:b.sessionId,uid:b.uid,curso:r.curso,nombre:r.nombre,resetAt:now,resetBy:adminUid,archivedAttempt:r}:undefined,undefined,false);
    if(!tx.snapshot.val())throw error(404,'No existe un intento para reabrir.');if(tx.committed)await db.ref('plataforma_paes/mini_invierno_archivo/'+b.sessionId+'/'+b.uid+'/'+now).set(tx.snapshot.val());
    return res.status(200).json({success:true});
   }throw error(400,'Acción no válida.');
  }
  const i=await identity(req,db,auth),ref=db.ref(BASE+'/'+i.sessionId+'/'+i.uid);
  if(action==='mini-state'){
   if((req.query?.mode==='guided')!==i.guided)return res.status(200).json({success:true,redirect:i.guided?'/paes/mini-invierno-2027/guiada.html':'/paes/mini-invierno-2027/'});
   const raw=(await ref.once('value')).val();return res.status(200).json({success:true,identity:{uid:i.uid,nombre:i.nombre,curso:i.curso},activity:C.publicActivity(i.guided),form:i.guided?{}:form(i.uid),resetAt:raw?.resetAt||raw?.resetAtAcknowledged||null,attempt:await publicAttempt(db,raw,i)});
  }
  if(!['mini-start','mini-save','mini-submit','mini-incident'].includes(action))throw error(400,'Acción no válida.');
  if(req.method!=='POST')throw error(405,'Usa POST para guardar.');const b=req.body||{},data=validate(b,i.guided);
  const isIncident=action==='mini-incident';
  if(isIncident&&(!/^[\w-]{8,100}$/.test(b.eventId||'')||!['hidden','blur','fullscreen','geometry'].includes(b.reason)))throw error(400,'Incidencia no válida.');
  const now=Date.now();
  const tx=await ref.transaction(current=>{
   if(delivered(current))return;
   if(current===null&&b.resetAt)return null;
   if((current?.resetAt||current?.resetAtAcknowledged||null)!==(b.resetAt||null))return;
   if(action==='mini-start'&&current&&!current.resetAt)return current;
   if(isIncident&&current?.incidents?.[b.eventId])return current;
   const incidents={...(current?.incidents||{})};if(isIncident&&!incidents[b.eventId]&&Object.keys(incidents).length<3)incidents[b.eventId]={reason:b.reason,at:now};
   const strikes=Object.keys(incidents).length,final=action==='mini-submit'||strikes>=3;
   const payload={uid:i.uid,nombre:i.nombre,curso:i.curso,sessionId:i.sessionId,variant:i.guided?'guided-access-2026':'regular',version:C.VERSION,...data,startedAt:current?.startedAt||now,updatedAt:now,strikes,incidents,submitted:final,completada:final};
   if(current?.resetAt||current?.resetAtAcknowledged)payload.resetAtAcknowledged=current.resetAt||current.resetAtAcknowledged;
   if(final)Object.assign(payload,{submitted:true,completada:true,submittedAt:now,completadaAt:now,endedBy:strikes>=3?'strikes':'student',...C.grade(data.answers,i.guided)});
   return payload;
  },undefined,false);
  if(!tx.committed)throw error(409,'El intento ya está entregado o fue reabierto. Recupera su estado.');
  const attempt=await publicAttempt(db,tx.snapshot.val(),i);if(!attempt)throw error(409,'Recarga el intento reabierto.');
  return res.status(200).json({success:true,attempt});
 }catch(e){return res.status(e.status||500).json({error:e.status?e.message:'No se pudo guardar. Tu avance se conserva.'});}
}
module.exports={handle,BASE,CONFIG,identity,validate,form};
