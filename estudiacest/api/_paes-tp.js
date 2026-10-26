'use strict';
const T=require('./_paes-tp-catalog');
function create(C){
const catalogFor=()=>C;
// Nodo aislado, accesible por API autenticada. Resultados tras entrega confirmada.
const BASE='plataforma_paes/tp_intentos',CONFIG='plataforma_paes/tp_config/'+C.SESSION;
const clean=v=>String(v||'').replace(/[^0-9A-Z]/gi,'').toUpperCase();
const error=(status,message)=>Object.assign(new Error(message),{status});
const delivered=r=>r?.submitted===true&&r?.completada===true;
const TIME_LIMIT_MS=C.minutes*60*1000;
const timeLimitFor=()=>TIME_LIMIT_MS;
const timedActivity=(c,g)=>({...c.publicActivity(g),suggestedMinutes:g?null:C.minutes,timeLimitMinutes:g?null:C.minutes});
const extendOpen=r=>r;
const expired=(r,now)=>Boolean(r&&!r.resetAt&&!delivered(r)&&Number.isFinite(r.expiresAt)&&r.expiresAt<=now);
function finishExpired(r,now,g){return {...r,submitted:true,completada:true,submittedAt:now,completadaAt:now,updatedAt:now,endedBy:'time',...catalogFor(r).grade(r.answers||{},g)};}
async function closeExpired(ref,r,g,now=Date.now(),course=r?.curso){
 if(extendOpen(r,course)===r&&!expired(r,now))return r;
 const tx=await ref.transaction(current=>{const adjusted=extendOpen(current,course);return expired(adjusted,now)?finishExpired(adjusted,now,g):adjusted!==current?adjusted:undefined;},undefined,false);
 return tx.snapshot.val();
}
function performance(r,g){if(!r||r.resetAt||!delivered(r))return null;const {correct,total}=C.grade(r.answers||{},g);return {correct,total,percentage:Math.round(correct/total*1000)/10,nota:T.gradeNote(correct,total),nivel:T.achievement(correct,total)};}
const courses=new Set(['4ATP','4BTP','4CTP','4DTP','4ETP']);
async function identity(req,db,auth){
 const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'').trim();if(!token)throw error(401,'Ingresa con tu cuenta de Estudia CEST.');
 let d;try{d=await auth.verifyIdToken(token);}catch(_){throw error(401,'Vuelve a ingresar con tu cuenta.');}
 const admin=(await db.ref('plataforma_estudiantes/admins/'+d.uid).once('value')).val();
 if(admin)return {uid:d.uid,nombre:'Vista docente',curso:'Docente',guided:false,preview:true,sessionId:C.SESSION};
 const p=(await db.ref('plataforma_estudiantes/estudiantes/'+d.uid).once('value')).val();
 // Cuenta de prueba ya reconocida por PAES_TEST_RUT en api/paes.js.
 if(p&&p.activo!==false&&clean(p.rut)==='111111111')return {uid:d.uid,nombre:'Vista docente',curso:'Docente',guided:false,preview:true,sessionId:C.SESSION};
 const course=clean(p?.curso),guided=clean(p?.rut)==='229327739';
 if(!p||p.activo===false||(!courses.has(course)&&!(guided&&course==='4AHC')))throw error(403,'Este programa corresponde a 4.º A, B, C, D y E TP.');
 return {uid:d.uid,nombre:String(p.nombre||p.name||'').slice(0,120),curso:course.replace(/^(\d)([A-Z])(HC|TP)$/,'$1$2-$3'),guided,sessionId:C.SESSION+(guided?'-guiada':'')};
}
function validate(input,g,c=C){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.version!==c.VERSION)throw error(409,'Recarga para usar la versión vigente.');
 const allowed=new Set(c.questionsFor(g).map(q=>q.id)),answers={},reflection={};
 if(input.answers&&(typeof input.answers!=='object'||Array.isArray(input.answers)))throw error(400,'Respuestas no válidas.');
 for(const [id,v]of Object.entries(input.answers||{})){if(!allowed.has(id)||!['A','B','C','D'].includes(v))throw error(400,'Respuesta no válida.');answers[id]=v;}
 for(const id of ['comprendi','evidencia','mejorare'])reflection[id]=String(input.reflection?.[id]||'').trim().slice(0,1500);
 return {answers,reflection};
}
function form(uid,version=C.VERSION){return T.order(uid,version,C.questionsFor(false));}
async function publicAttempt(db,r,i){if(!r||r.resetAt)return null;const {answers,reflection,startedAt,updatedAt,submittedAt,completadaAt,sessionId,strikes,incidents,endedBy,timerStartedAt,expiresAt}=r;
 const out={answers:answers||{},reflection:reflection||{},startedAt,updatedAt,submittedAt,completadaAt,sessionId,timerStartedAt:timerStartedAt||null,expiresAt:expiresAt||null,timeLimitMinutes:timerStartedAt&&expiresAt?(expiresAt-timerStartedAt)/60000:i.guided?null:C.minutes,integrityEpoch:r.integrityEpoch||0,strikes:strikes||0,incidents:incidents||{},endedBy:endedBy||null,submitted:r.submitted===true,completada:r.completada===true};
 if(delivered(r)){const c=catalogFor(r);out.performance=performance(r,i.guided);out.result=c.grade(answers||{},i.guided);out.review=c.questionsFor(i.guided);}
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
     if(r===null)return null; // La primera lectura local puede preceder a la del servidor.
     if(r.resetAt||(r.uid&&r.uid!==b.uid)||(r.sessionId&&r.sessionId!==b.sessionId))return;
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
   if(action==='admin-mini-release'){if(!['4A-TP','4B-TP','4C-TP','4D-TP','4E-TP','4A-HC'].includes(b.curso)||typeof b.published!=='boolean')throw error(400,'Curso no válido.');await db.ref(CONFIG+'/publicacion/cursos/'+b.curso).set(b.published);return res.status(200).json({success:true});}
   if(action==='admin-mini-reset'){
    if(!/^[\w-]{1,128}$/.test(b.uid||'')||![C.SESSION,C.SESSION+'-guiada'].includes(b.sessionId))throw error(400,'Intento no válido.');
    const now=Date.now(),ref=db.ref(BASE+'/'+b.sessionId+'/'+b.uid);
    const tx=await ref.transaction(r=>r===null?null:r&&!r.resetAt?{sessionId:b.sessionId,uid:b.uid,curso:r.curso,nombre:r.nombre,resetAt:now,resetBy:adminUid,archivedAttempt:r}:undefined,undefined,false);
    if(!tx.snapshot.val())throw error(404,'No existe un intento para reabrir.');if(tx.committed)await db.ref('plataforma_paes/tp_archivo/'+b.sessionId+'/'+b.uid+'/'+now).set(tx.snapshot.val());
    return res.status(200).json({success:true});
   }throw error(400,'Acción no válida.');
  }
  const i=await identity(req,db,auth),ref=db.ref(BASE+'/'+i.sessionId+'/'+i.uid);
  if(action==='mini-source'){if(req.method!=='GET'||C.SESSION.slice(-1)!=='1'||i.guided)throw error(403,'Fuente no disponible.');const pdf=await officialSource(C.PDF);res.setHeader('Content-Type','application/pdf');return res.status(200).send(pdf);}
  if(i.preview){if(action!=='mini-state')throw error(403,'La vista docente no crea ni entrega intentos.');return res.status(200).json({success:true,preview:true,identity:i,activity:timedActivity(C,req.query?.mode==='guided'),form:form(i.uid),resetAt:null,attempt:null,serverNow:Date.now()});}
  if(action==='mini-state'){
   if((req.query?.mode==='guided')!==i.guided)return res.status(200).json({success:true,redirect:i.guided?'/paes/tp/guiada.html?sesion='+C.SESSION.slice(-1):'/paes/tp/actividad.html?sesion='+C.SESSION.slice(-1)});
   const raw=await closeExpired(ref,(await ref.once('value')).val(),i.guided,Date.now(),i.curso),c=catalogFor(raw);return res.status(200).json({success:true,identity:{uid:i.uid,nombre:i.nombre,curso:i.curso},activity:timedActivity(c,i.guided,i.curso),form:i.guided?{}:form(i.uid,c.VERSION),resetAt:raw?.resetAt||raw?.resetAtAcknowledged||null,attempt:await publicAttempt(db,raw,i),serverNow:Date.now()});
  }
  if(!['mini-start','mini-save','mini-submit','mini-incident'].includes(action))throw error(400,'Acción no válida.');
  if(req.method!=='POST')throw error(405,'Usa POST para guardar.');const b=req.body||{},c=C,data=validate(b,i.guided,c);
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
   const timerStartedAt=i.guided?null:(current?.timerStartedAt||now),expiresAt=i.guided?null:(current?.expiresAt||timerStartedAt+TIME_LIMIT_MS);
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
return {handle,BASE,CONFIG,identity,validate,form,performance,TIME_LIMIT_MS,timeLimitFor};}
let pdfCache;
async function officialSource(){
 if(!pdfCache){
  const file=require.resolve('./_paes-tp-assets/invierno-oficial.pdf');
  const bytes=require('node:fs').readFileSync(file);
  if(require('node:crypto').createHash('sha256').update(bytes).digest('hex')!=='9dcf3206de8aef35b52b0a3f5a493713fc5e72b0e25c54a504052a7bc27e9a41')throw Error('Fuente oficial distinta.');
  pdfCache=bytes;
 }
 return pdfCache;
}
const handlers=Object.fromEntries(['1','2','3'].map(n=>[n,create(T.catalog(n))]));
async function handle(action,req,res,ctx){const h=handlers[String(req.query?.sesion)];if(!h)return res.status(400).json({error:'Sesión no válida.'});return h.handle(action.replace('admin-tp-','admin-mini-').replace(/^tp-/,'mini-'),req,res,ctx);}
module.exports={handle,handlers};
