'use strict';
const C=require('./_paes-mini-invierno-catalog');
const V1=require('./_paes-mini-invierno-catalog-v1');
const catalogFor=r=>r&&!r.resetAt&&r.version===V1.VERSION?V1:C;
// Nodo sin permisos RTDB cliente: resumen propio al entregar; claves solo tras publicación.
const BASE='plataforma_paes/mini_invierno_intentos',CONFIG='plataforma_paes/mini_invierno_2027_config';
const clean=v=>String(v||'').replace(/[^0-9A-Z]/gi,'').toUpperCase();
const error=(status,message)=>Object.assign(new Error(message),{status});
const delivered=r=>r?.submitted===true&&r?.completada===true;
const TIME_LIMIT_MS=75*60*1000;
const timeLimitFor=course=>clean(course)==='4AHC'?180*60*1000:TIME_LIMIT_MS;
const timedActivity=(c,g,course)=>({...c.publicActivity(g),suggestedMinutes:timeLimitFor(course)/60000,timeLimitMinutes:timeLimitFor(course)/60000});
// Extiende solo intentos abiertos de 4A, desde Comenzar, sin reiniciar el reloj.
function extendOpen(r,course=r?.curso){if(!r||r.resetAt||delivered(r)||!Number.isFinite(r.timerStartedAt)||timeLimitFor(course)===TIME_LIMIT_MS)return r;const expiresAt=Math.max(r.expiresAt||0,r.timerStartedAt+timeLimitFor(course));return expiresAt===r.expiresAt?r:{...r,expiresAt};}
const expired=(r,now)=>Boolean(r&&!r.resetAt&&!delivered(r)&&Number.isFinite(r.expiresAt)&&r.expiresAt<=now);
function finishExpired(r,now,g){return {...r,submitted:true,completada:true,submittedAt:now,completadaAt:now,updatedAt:now,endedBy:'time',...catalogFor(r).grade(r.answers||{},g)};}
async function closeExpired(ref,r,g,now=Date.now(),course=r?.curso){
 if(extendOpen(r,course)===r&&!expired(r,now))return r;
 const tx=await ref.transaction(current=>{const adjusted=extendOpen(current,course);return expired(adjusted,now)?finishExpired(adjusted,now,g):adjusted!==current?adjusted:undefined;},undefined,false);
 return tx.snapshot.val();
}
const SCORE_SOURCE='https://portaldemre.demre.cl/paes/factores-seleccion/tabla-transformacion-puntajes-paes-invierno-p2027-competencia-lectora';
// Tabla primaria DEMRE, consultada 08-10-2026. Índice: 0 a 60 correctas.
const SCORE_TABLE=Object.freeze([100,149,172,193,214,234,253,269,284,298,313,330,347,361,373,383,393,404,417,432,447,461,472,480,487,495,504,516,531,546,560,571,580,587,594,603,614,629,644,659,671,680,689,699,711,725,741,758,772,786,799,814,832,852,871,892,913,936,963,991,1000]);
function estimate(correct,total){
 if(!Number.isInteger(correct)||!Number.isInteger(total)||total<=0||correct<0||correct>total)throw new RangeError('Aciertos no válidos.');
 // Normalización proporcional CEST; no equiparación ni fórmula oficial DEMRE.
 const equivalentCorrect=Math.round(correct/total*60);
 return {points:SCORE_TABLE[equivalentCorrect],equivalentCorrect,referenceTotal:60,source:SCORE_SOURCE,method:'cest-proportion-round-60-v1'};
}
function performance(r,g){if(!r||r.resetAt||!delivered(r))return null;const {correct,total}=catalogFor(r).grade(r.answers||{},g);return {correct,total,percentage:Math.round(correct/total*1000)/10,paesEstimate:estimate(correct,total)};}
const courses=new Set(['3AHC','3BHC','4AHC','4BHC']);
async function identity(req,db,auth){
 const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'').trim();if(!token)throw error(401,'Ingresa con tu cuenta de Estudia CEST.');
 let d;try{d=await auth.verifyIdToken(token);}catch(_){throw error(401,'Vuelve a ingresar con tu cuenta.');}
 const admin=(await db.ref('plataforma_estudiantes/admins/'+d.uid).once('value')).val();
 if(admin)return {uid:d.uid,nombre:'Vista docente',curso:'Docente',guided:false,preview:true,sessionId:C.SESSION};
 const p=(await db.ref('plataforma_estudiantes/estudiantes/'+d.uid).once('value')).val();
 // Cuenta de prueba ya reconocida por PAES_TEST_RUT en api/paes.js.
 if(p&&p.activo!==false&&clean(p.rut)==='111111111')return {uid:d.uid,nombre:'Vista docente',curso:'Docente',guided:false,preview:true,sessionId:C.SESSION};
 const course=clean(p?.curso),guided=clean(p?.rut)==='229327739';
 if(!p||p.activo===false||!courses.has(course))throw error(403,'Este miniensayo corresponde a los cursos PAES HC.');
 return {uid:d.uid,nombre:String(p.nombre||p.name||'').slice(0,120),curso:course.replace(/^(\d)([A-Z])HC$/,'$1$2-HC'),guided,sessionId:C.SESSION+(guided?'-guiada':'')};
}
function validate(input,g,c=C){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.version!==c.VERSION)throw error(409,'Recarga para usar la versión vigente.');
 const allowed=new Set(c.questionsFor(g).map(q=>q.id)),answers={},reflection={};
 if(input.answers&&(typeof input.answers!=='object'||Array.isArray(input.answers)))throw error(400,'Respuestas no válidas.');
 for(const [id,v]of Object.entries(input.answers||{})){if(!allowed.has(id)||!['A','B','C','D'].includes(v))throw error(400,'Respuesta no válida.');answers[id]=v;}
 for(const id of ['comprendi','evidencia','mejorare'])reflection[id]=String(input.reflection?.[id]||'').trim().slice(0,1500);
 return {answers,reflection};
}
function form(uid,version=C.VERSION){let seed=2166136261;for(const c of uid+version)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;const map={};for(const q of C.questionsFor(false)){let a=['A','B','C','D'];for(let i=3;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]];}map[q.id]=a;}return map;}
async function publicAttempt(db,r,i){if(!r||r.resetAt)return null;const {answers,reflection,startedAt,updatedAt,submittedAt,completadaAt,sessionId,strikes,incidents,endedBy,timerStartedAt,expiresAt}=r;
 const out={answers:answers||{},reflection:reflection||{},startedAt,updatedAt,submittedAt,completadaAt,sessionId,timerStartedAt:timerStartedAt||null,expiresAt:expiresAt||null,timeLimitMinutes:timerStartedAt&&expiresAt?(expiresAt-timerStartedAt)/60000:timeLimitFor(i.curso)/60000,integrityEpoch:r.integrityEpoch||0,strikes:strikes||0,incidents:incidents||{},endedBy:endedBy||null,submitted:r.submitted===true,completada:r.completada===true};
 if(delivered(r))out.performance=performance(r,i.guided);
 const pub=(await db.ref(CONFIG+'/publicacion').once('value')).val()||{};
 if(delivered(r)&&(pub.cursos?.[i.curso]===true||pub.estudiantes?.[i.uid]===true)){const c=catalogFor(r);out.result=c.grade(answers||{},i.guided);out.review=c.questionsFor(i.guided);}
 return out;
}
async function handle(action,req,res,{db,auth,adminUid}){
 res.setHeader('Cache-Control','private, no-store');
 try{
  if(action.startsWith('admin-mini-')){
   if(!adminUid)throw error(403,'No autorizado.');
   if(action==='admin-mini-list'){const rows=[];for(const sid of [C.SESSION,C.SESSION+'-guiada']){const records=(await db.ref(BASE+'/'+sid).once('value')).val()||{};for(const [uid,record]of Object.entries(records)){const g=sid.endsWith('-guiada'),r=await closeExpired(db.ref(BASE+'/'+sid+'/'+uid),record,g);rows.push({...r,uid,sessionId:sid,performance:performance(r,g),review:catalogFor(r).questionsFor(g)});}}return res.status(200).json({success:true,serverNow:Date.now(),rows,publication:(await db.ref(CONFIG+'/publicacion').once('value')).val()||{},keys:{regular:C.questionsFor(false),guided:C.questionsFor(true)}});}
   if(req.method!=='POST')throw error(405,'Usa POST.');
   const b=req.body||{};
   if(action==='admin-mini-clear-strikes'){
    if(!/^[\w-]{1,128}$/.test(b.uid||'')||![C.SESSION,C.SESSION+'-guiada'].includes(b.sessionId)||!/^[\w-]{8,100}$/.test(b.requestId||'')||!Number.isSafeInteger(b.integrityEpoch)||b.integrityEpoch<0||typeof b.reason!=='string'||b.reason.trim().length<3||b.reason.trim().length>240)throw error(400,'Indica el intento y un motivo de 3 a 240 caracteres.');
    const now=Date.now(),ref=db.ref(BASE+'/'+b.sessionId+'/'+b.uid);
    const tx=await ref.transaction(r=>{
     if(!r||r.resetAt||(r.uid&&r.uid!==b.uid)||(r.sessionId&&r.sessionId!==b.sessionId))return;
     if(r.strikeAdjustments?.[b.requestId])return r;
     if((r.integrityEpoch||0)!==b.integrityEpoch)return;
     r=extendOpen(r);if(expired(r,now))r=finishExpired(r,now,b.sessionId.endsWith('-guiada'));
     if(!(r.strikes||0)&&!Object.keys(r.incidents||{}).length)return r;
     const previousState=Object.fromEntries(['answers','reflection','startedAt','timerStartedAt','expiresAt','submitted','completada','submittedAt','completadaAt','endedBy','score','correct','total','skills'].filter(k=>r[k]!==undefined).map(k=>[k,r[k]]));
     const adjustment={at:now,by:adminUid,reason:b.reason.trim(),strikes:r.strikes||0,incidents:r.incidents||{},previousState};
     let next={...r,strikes:0,incidents:{},integrityEpoch:(r.integrityEpoch||0)+1,updatedAt:now,strikeAdjustments:{...(r.strikeAdjustments||{}),[b.requestId]:adjustment},forgivenIncidents:{...(r.forgivenIncidents||{}),...Object.fromEntries(Object.keys(r.incidents||{}).map(id=>[id,true]))}};
     if(delivered(r)&&r.endedBy==='strikes'){
      const resumed=extendOpen({...next,submitted:false,completada:false});
      if(!Number.isFinite(resumed.expiresAt)||resumed.expiresAt>now){next=resumed;for(const k of ['submittedAt','completadaAt','endedBy','score','correct','total','skills'])delete next[k];}
     }
     return next;
    },undefined,false);
    const record=tx.snapshot.val();if(!record)throw error(404,'No existe ese intento.');if(!tx.committed)throw error(409,'El intento cambió. Actualiza el panel antes de quitar los strikes.');
    return res.status(200).json({success:true,integrityEpoch:record.integrityEpoch||0,strikes:record.strikes||0,resumed:!delivered(record),expiresAt:record.expiresAt||null});
   }
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
  if(i.preview){if(action!=='mini-state')throw error(403,'La vista docente no crea ni entrega intentos.');return res.status(200).json({success:true,preview:true,identity:i,activity:timedActivity(C,req.query?.mode==='guided'),form:form(i.uid),resetAt:null,attempt:null,serverNow:Date.now()});}
  if(action==='mini-state'){
   if((req.query?.mode==='guided')!==i.guided)return res.status(200).json({success:true,redirect:i.guided?'/paes/mini-invierno-2027/guiada.html':'/paes/mini-invierno-2027/'});
   const raw=await closeExpired(ref,(await ref.once('value')).val(),i.guided,Date.now(),i.curso),c=catalogFor(raw);return res.status(200).json({success:true,identity:{uid:i.uid,nombre:i.nombre,curso:i.curso},activity:timedActivity(c,i.guided,i.curso),form:i.guided?{}:form(i.uid,c.VERSION),resetAt:raw?.resetAt||raw?.resetAtAcknowledged||null,attempt:await publicAttempt(db,raw,i),serverNow:Date.now()});
  }
  if(!['mini-start','mini-save','mini-submit','mini-incident'].includes(action))throw error(400,'Acción no válida.');
  if(req.method!=='POST')throw error(405,'Usa POST para guardar.');const b=req.body||{},c=b.version===V1.VERSION?V1:C,data=validate(b,i.guided,c);
  const isIncident=action==='mini-incident';
  if(isIncident&&(!/^[\w-]{8,100}$/.test(b.eventId||'')||!['hidden','blur','fullscreen','geometry'].includes(b.reason)))throw error(400,'Incidencia no válida.');
  const now=Date.now();
  const tx=await ref.transaction(current=>{
   if(delivered(current))return;
   if(catalogFor(current).VERSION!==b.version)return;
   if(current===null&&b.resetAt)return null;
   if((current?.resetAt||current?.resetAtAcknowledged||null)!==(b.resetAt||null))return;
   if((current?.integrityEpoch||0)!==(b.integrityEpoch||0))return;
   current=extendOpen(current,i.curso);
   if(expired(current,now))return finishExpired(current,now,i.guided);
   const timerStartedAt=current?.timerStartedAt||now,expiresAt=current?.expiresAt||timerStartedAt+timeLimitFor(i.curso);
   if(action==='mini-start'&&current&&!current.resetAt)return {...current,timerStartedAt,expiresAt};
   if(isIncident&&(current?.incidents?.[b.eventId]||current?.forgivenIncidents?.[b.eventId]))return current;
   const incidents={...(current?.incidents||{})};if(isIncident&&!incidents[b.eventId]&&Object.keys(incidents).length<3)incidents[b.eventId]={reason:b.reason,at:now};
   const strikes=Object.keys(incidents).length,final=action==='mini-submit'||strikes>=3;
   const payload={uid:i.uid,nombre:i.nombre,curso:i.curso,sessionId:i.sessionId,variant:i.guided?'guided-access-2026':'regular',version:c.VERSION,...data,startedAt:current?.startedAt||now,timerStartedAt,expiresAt,updatedAt:now,strikes,incidents,submitted:final,completada:final};
   if(current?.integrityEpoch)Object.assign(payload,{integrityEpoch:current.integrityEpoch,strikeAdjustments:current.strikeAdjustments||{},forgivenIncidents:current.forgivenIncidents||{}});
   if(current?.resetAt||current?.resetAtAcknowledged)payload.resetAtAcknowledged=current.resetAt||current.resetAtAcknowledged;
   if(final)Object.assign(payload,{submitted:true,completada:true,submittedAt:now,completadaAt:now,endedBy:strikes>=3?'strikes':'student',...c.grade(data.answers,i.guided)});
   return payload;
  },undefined,false);
  if(!tx.committed)throw error(409,'El intento ya está entregado o fue reabierto. Recupera su estado.');
  const attempt=await publicAttempt(db,tx.snapshot.val(),i);if(!attempt)throw error(409,'Recarga el intento reabierto.');
  return res.status(200).json({success:true,attempt,serverNow:Date.now()});
 }catch(e){return res.status(e.status||500).json({error:e.status?e.message:'No se pudo guardar. Tu avance se conserva.'});}
}
module.exports={handle,BASE,CONFIG,identity,validate,form,estimate,performance,TIME_LIMIT_MS,timeLimitFor};
