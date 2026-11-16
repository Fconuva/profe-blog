'use strict';
const MATERIAL=require('../paes/nm2/data/clases.json');
const KEYS=require('./_paes-nm2-keys.json');
const BASE='plataforma_paes/nm2_intentos',CONFIG='plataforma_paes/nm2_config';
const clean=v=>String(v||'').replace(/[^0-9A-Z]/gi,'').toUpperCase();
const fail=(status,message)=>Object.assign(new Error(message),{status});
const delivered=r=>r?.submitted===true&&r?.completada===true;
const LESSONS=MATERIAL.lessons;
const getLesson=value=>LESSONS.find(l=>l.id===value||String(l.n)===String(value));
const sidFor=(l,g)=>l.id+(g?'-guiada':'');
const questions=(l,g)=>g?l.guided.questions:[...l.micro,...l.texts.flatMap(t=>t.questions)];
const keyFor=(l,g)=>KEYS[g?'guided':'regular'][l.id];
function grade(l,g,answers){const key=keyFor(l,g),activity={questions:questions(l,g)};const TOTAL=activity.questions.length;let correct=0;const skills={};for(const [id,k]of Object.entries(key)){const s=skills[k.skill]||(skills[k.skill]={correct:0,total:0});s.total++;if(answers[id]===k.key){correct++;s.correct++;}}return {score:correct,correct,total:TOTAL,percentage:Math.round(correct/TOTAL*1000)/10,skills};}
function publicRecord(r,released,l,g){
 if(!r||r.resetAt)return null;
 const out={};for(const k of ['sessionId','uid','curso','answers','notes','reflection','version','revision','startedAt','updatedAt','submittedAt','completadaAt','integrityEpoch','strikes','incidents','endedBy','resetEpoch'])if(r[k]!==undefined)out[k]=r[k];
 out.submitted=r.submitted===true;out.completada=r.completada===true;
 if(delivered(r)&&released){out.result=grade(l,g,r.answers||{});out.review=keyFor(l,g);}
 return out;
}
async function identity(req,db,auth){
 const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'');if(!token)throw fail(401,'Ingresa con tu cuenta de Estudia CEST.');
 let user;try{user=await auth.verifyIdToken(token);}catch(_){throw fail(401,'Vuelve a ingresar con tu cuenta.');}
 if(user.email==='portafolio.admin@estudiacest.com'||(await db.ref('plataforma_estudiantes/admins/'+user.uid).once('value')).val())return {uid:user.uid,curso:'Docente',nombre:'Vista docente',preview:true,guided:false};
 const p=(await db.ref('plataforma_estudiantes/estudiantes/'+user.uid).once('value')).val();
 const guided=clean(p?.rut)==='229327739';
 if(!p||p.activo===false||(!['2AHC','2BHC'].includes(clean(p.curso))&&!guided))throw fail(403,'Estas clases corresponden a 2.º A y B HC.');
 return {uid:user.uid,nombre:String(p.nombre||p.name||'Estudiante').slice(0,120),curso:clean(p.curso).replace(/^(\d)([A-Z])HC$/,'$1$2-HC'),guided,preview:false};
}
function validate(b,l,g){
 if(b.version!==MATERIAL.version)throw fail(409,'Recarga para usar la versión vigente.');
 if(!/^[\w-]{8,100}$/.test(b.requestId||''))throw fail(400,'Identificador de guardado no válido.');
 if(!Number.isSafeInteger(b.revision)||b.revision<0||!Number.isSafeInteger(b.integrityEpoch)||b.integrityEpoch<0)throw fail(400,'Estado de guardado no válido.');
 const ids=new Set(questions(l,g).map(q=>q.id)),answers={},notes={},reflection={};
 if(b.answers&&(typeof b.answers!=='object'||Array.isArray(b.answers)))throw fail(400,'Respuestas no válidas.');
 for(const [id,v]of Object.entries(b.answers||{})){if(!ids.has(id)||!['A','B','C','D'].includes(v))throw fail(400,'Respuesta no válida.');answers[id]=v;}
 const noteIds=new Set(['w1','w2','w3',...MATERIAL.cards.map(c=>c.id)]);
 if(b.notes&&(typeof b.notes!=='object'||Array.isArray(b.notes)))throw fail(400,'Escritura no válida.');
 for(const [id,v]of Object.entries(b.notes||{})){if(!noteIds.has(id)||typeof v!=='string')throw fail(400,'Campo de escritura no válido.');notes[id]=v.slice(0,3000);}
 for(const id of ['comprendi','evidencia','mejorare'])reflection[id]=String(b.reflection?.[id]||'').slice(0,1500);
 return {answers,notes,reflection};
}
async function publication(db,l,i){const p=(await db.ref(CONFIG+'/'+l.id+'/publicacion').once('value')).val()||{};return p.cursos?.[i.curso]===true||p.estudiantes?.[i.uid]===true;}
async function handle(action,req,res,{db,auth,adminUid}){
 res.setHeader('Cache-Control','private, no-store');
 try{
  const b=req.body||{},l=getLesson(req.query?.clase||b.clase);if(!l)throw fail(400,'Selecciona una de las cuatro clases.');
  if(action.startsWith('admin-nm2-')){
   if(!adminUid)throw fail(403,'No autorizado.');
   if(action==='admin-nm2-list'){
    const rows=[];for(const g of [false,true]){const sid=sidFor(l,g),all=(await db.ref(BASE+'/'+sid).once('value')).val()||{};for(const [uid,r]of Object.entries(all))rows.push({...r,uid,sessionId:sid,guided:g,result:delivered(r)?grade(l,g,r.answers||{}):null});}
    return res.status(200).json({success:true,rows,publication:(await db.ref(CONFIG+'/'+l.id+'/publicacion').once('value')).val()||{},keys:KEYS.regular[l.id],guidedKeys:KEYS.guided[l.id],writing:KEYS.writing[l.id]});
   }
   if(req.method!=='POST')throw fail(405,'Usa POST.');
   if(action==='admin-nm2-release'){
    if(!['2A-HC','2B-HC','3A-HC'].includes(b.curso)||typeof b.published!=='boolean')throw fail(400,'Curso no válido.');
    const ref=db.ref(CONFIG+'/'+l.id+'/publicacion/cursos/'+b.curso);await ref.set(b.published);if((await ref.once('value')).val()!==b.published)throw fail(502,'No se pudo confirmar la publicación.');
    return res.status(200).json({success:true,published:b.published});
   }
   if(!/^[\w-]{1,128}$/.test(b.uid||'')||![sidFor(l,false),sidFor(l,true)].includes(b.sessionId))throw fail(400,'Intento no válido.');
   const ref=db.ref(BASE+'/'+b.sessionId+'/'+b.uid),now=Date.now();
   if(action==='admin-nm2-reset'){
    const tx=await ref.transaction(r=>r===null?null:r&&!r.resetAt?{uid:b.uid,sessionId:b.sessionId,curso:r.curso,nombre:r.nombre,resetAt:now,resetEpoch:now,revision:(r.revision||0)+1,archivedAttempt:r,resetBy:adminUid}:undefined,undefined,false);
    if(!tx.snapshot.val())throw fail(404,'No existe un intento.');
    return res.status(200).json({success:true,resetAt:tx.snapshot.val().resetAt});
   }
   if(action==='admin-nm2-clear-strikes'){
    if(typeof b.reason!=='string'||b.reason.trim().length<3||b.reason.length>240||!/^[\w-]{8,100}$/.test(b.requestId||'')||!Number.isSafeInteger(b.integrityEpoch))throw fail(400,'Indica un motivo para quitar los strikes.');
    const tx=await ref.transaction(r=>{
     if(r===null)return null;if(r.resetAt)return;
     if(r.strikeAdjustments?.[b.requestId])return r;
     if((r.integrityEpoch||0)!==b.integrityEpoch)return;
     const next={...r,strikes:0,incidents:{},updatedAt:now,integrityEpoch:(r.integrityEpoch||0)+1,revision:(r.revision||0)+1,forgivenIncidents:{...(r.forgivenIncidents||{}),...Object.fromEntries(Object.keys(r.incidents||{}).map(id=>[id,true]))},strikeAdjustments:{...(r.strikeAdjustments||{}),[b.requestId]:{at:now,by:adminUid,reason:b.reason.trim(),strikes:r.strikes||0,incidents:r.incidents||{},previousState:{submitted:r.submitted===true,completada:r.completada===true,endedBy:r.endedBy||null}}}};
     if(delivered(r)&&r.endedBy==='strikes'){next.submitted=false;next.completada=false;for(const k of ['submittedAt','completadaAt','endedBy','score','total','correct','percentage','skills'])delete next[k];}
     return next;
    },undefined,false);
    if(!tx.snapshot.val())throw fail(404,'No existe un intento.');if(!tx.committed)throw fail(409,'El intento cambió. Actualiza el panel.');
    return res.status(200).json({success:true,integrityEpoch:tx.snapshot.val().integrityEpoch,submitted:delivered(tx.snapshot.val())});
   }
   throw fail(400,'Acción no válida.');
  }
  const i=await identity(req,db,auth),g=i.preview?req.query?.mode==='guided':i.guided,sid=sidFor(l,g);
  if(action==='nm2-dashboard'){
   const states={};for(const item of LESSONS){const r=(await db.ref(BASE+'/'+sidFor(item,i.guided)+'/'+i.uid).once('value')).val();states[item.id]=!r||r.resetAt?'Pendiente':delivered(r)?'Completada':'En progreso';}
   return res.status(200).json({success:true,identity:i,states});
  }
  const ref=db.ref(BASE+'/'+sid+'/'+i.uid);
  if(action==='nm2-state'){
   if(!i.preview&&(req.query?.mode==='guided')!==g)return res.status(200).json({success:true,redirect:'/paes/nm2/'+(g?'guiada.html':'clase.html')+'?clase='+l.n});
   const r=(await ref.once('value')).val();return res.status(200).json({success:true,identity:i,preview:i.preview,version:MATERIAL.version,sessionId:sid,resetEpoch:r?.resetEpoch||null,attempt:i.preview?null:publicRecord(r,await publication(db,l,i),l,g)});
  }
  if(i.preview)throw fail(403,'La vista docente no crea intentos.');
  if(!['nm2-start','nm2-save','nm2-submit','nm2-incident'].includes(action))throw fail(400,'Acción no válida.');
  if(req.method!=='POST')throw fail(405,'Usa POST para guardar.');
  const data=validate(b,l,g),now=Date.now(),incident=action==='nm2-incident';
  if(incident&&(!/^[\w-]{8,100}$/.test(b.eventId||'')||!['hidden','blur','fullscreen','geometry'].includes(b.reason)))throw fail(400,'Incidencia no válida.');
  const tx=await ref.transaction(r=>{
   if(r?.lastRequestId===b.requestId)return r;
   if(delivered(r))return;
   if((r?.resetEpoch||null)!==(b.resetEpoch||null))return;
   if((r?.integrityEpoch||0)!==b.integrityEpoch)return;
   if(action==='nm2-start'&&r&&!r.resetAt)return r;
   if(action!=='nm2-start'&&(!r||r.resetAt))return;
   if(action!=='nm2-start'&&(r.revision||0)!==b.revision)return;
   if(incident&&(r.incidents?.[b.eventId]||r.forgivenIncidents?.[b.eventId]))return r;
   const fresh=!r||r.resetAt;
   const next={...(fresh?{uid:i.uid,sessionId:sid,curso:i.curso,nombre:i.nombre,startedAt:now,resetEpoch:r?.resetEpoch||null,integrityEpoch:0,strikes:0}:r),...data,version:MATERIAL.version,variant:g?'guided-access-2026':'regular',revision:(r?.revision||0)+1,lastRequestId:b.requestId,updatedAt:now,submitted:false,completada:false};
   if(fresh&&r?.archivedAttempt)next.archivedAttempt=r.archivedAttempt;
   if(incident){next.incidents={...(r.incidents||{}),[b.eventId]:{reason:b.reason,at:now}};next.strikes=(r.strikes||0)+1;}
   if(action==='nm2-submit'||next.strikes>=3)Object.assign(next,{submitted:true,completada:true,submittedAt:now,completadaAt:now,endedBy:next.strikes>=3?'strikes':'student',...grade(l,g,next.answers)});
   return next;
  },undefined,false);
  const current=tx.snapshot.val();if(!tx.committed)throw fail(409,delivered(current)?'La clase ya está entregada.':'El intento cambió. Recupera el estado antes de continuar.');
  // Lectura independiente después de la escritura: jamás anunciar una entrega solo por su petición.
  const confirmed=(await ref.once('value')).val();
  if((action==='nm2-submit'||(confirmed?.strikes||0)>=3)&&!delivered(confirmed))throw fail(502,'La entrega todavía no está confirmada. Reintenta.');
  return res.status(200).json({success:true,resetEpoch:confirmed?.resetEpoch||null,attempt:publicRecord(confirmed,await publication(db,l,i),l,g)});
 }catch(e){return res.status(e.status||500).json({error:e.status?e.message:'No se pudo conectar. Tu avance se conserva en este dispositivo; reintenta.'});}
}
module.exports={handle,grade,validate,publicRecord,questions,BASE,CONFIG,VERSION:MATERIAL.version};
