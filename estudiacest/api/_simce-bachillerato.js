'use strict';
const crypto=require('node:crypto');
const {classics,readings}=require('./_simce-bachillerato-catalog');
const BASE='plataforma_estudiantes',ROOT=BASE+'/bachillerato/salas';
const COURSES=['2A-HC','2B-HC'],CODE=/^[A-HJ-NP-Z2-9]{6}$/,KEY=/^[A-Za-z0-9_-]{1,128}$/;
const fail=(status,message)=>Object.assign(new Error(message),{status});
const val=async(db,p)=>(await db.ref(p).once('value')).val();
const normalize=s=>String(s||'').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ');
const shortName=s=>{const p=String(s||'Estudiante').trim().split(/\s+/);return p[0]+(p[1]?' '+p[1][0]+'.':'');};
function publicConfig(r){const {guide,...safe}=r;return safe;}
function scores(room){
 const totals={};Object.entries(room.players||{}).forEach(([uid,p])=>totals[uid]={uid,name:shortName(p.name),points:0});
 Object.values(room.rounds||{}).filter(r=>r?.published===true).forEach(r=>{Object.entries(r.grades||{}).forEach(([uid,g])=>{if(totals[uid])totals[uid].points+=g.reduce((a,b)=>a+b,0);});});
 const list=Object.values(totals).sort((a,b)=>b.points-a.points||a.name.localeCompare(b.name,'es'));let rank=1;
 return list.map((p,i)=>{if(i&&p.points!==list[i-1].points)rank=i+1;return {...p,rank};});
}
function makeRound(body,index){
 const mode=body.mode==='reading'?'reading':'classic',seconds=Number(body.seconds||120);
 if(!Number.isInteger(seconds)||seconds<30||seconds>600)throw fail(400,'Elige entre 30 y 600 segundos.');
 if(mode==='reading'){
  const reading=readings[Number(body.reading)];if(!reading)throw fail(400,'Elige un desafío de lectura.');
  return {id:String(index),mode,seconds,title:reading.title,text:reading.text,questions:reading.questions,guide:reading.guide};
 }
 const categories=body.categories||classics;
 if(!Array.isArray(categories)||categories.length<3||categories.length>8||categories.some(x=>typeof x!=='string'||!x.trim()||x.length>80))throw fail(400,'Escribe entre 3 y 8 categorías de hasta 80 caracteres.');
 const letters='ABCDEFGILMNOPRSTUV';const letter=String(body.letter||letters[crypto.randomInt(letters.length)]).toUpperCase();
 if(!/^[A-ZÑ]$/.test(letter))throw fail(400,'Indica una sola letra.');
 return {id:String(index),mode,seconds,title:'Bachillerato',letter,questions:categories.map(x=>x.trim())};
}
async function identity(req,db,auth){
 const token=String(req.headers?.authorization||'').replace(/^Bearer\s+/i,'');if(!token)throw fail(401,'Inicia sesión para jugar.');
 let actor;try{actor=await auth.verifyIdToken(token);}catch{throw fail(401,'Tu sesión venció. Vuelve a ingresar.');}
 const [admin,teacher,student]=await Promise.all(['admins','docentes','estudiantes'].map(n=>val(db,BASE+'/'+n+'/'+actor.uid)));
 return {uid:actor.uid,admin:admin===true,teacher,student};
}
function canTeach(actor,course){return actor.admin&&(!actor.teacher||actor.teacher.superadmin===true||(actor.teacher.cursos||[]).includes(course));}
function authorized(actor,room,host){
 if(host){if(!canTeach(actor,room.course)||room.owner!==actor.uid)throw fail(403,'Solo quien creó esta sala puede dirigirla.');}
 else if(!actor.student||actor.student.activo===false||actor.student.curso!==room.course)throw fail(403,'Esta sala corresponde a otro curso.');
}
async function manejar(req,res,action,db,auth){
 res.setHeader('Cache-Control','private, no-store');
 try{
  if(!['GET','POST'].includes(req.method))throw fail(405,'Método no permitido.');
  if(req.method==='GET'&&!['state','catalog'].includes(action))throw fail(405,'Usa POST para cambiar la partida.');
  let b=req.body||{};if(typeof b==='string'){try{b=JSON.parse(b);}catch{throw fail(400,'Solicitud inválida.');}}
  const actor=await identity(req,db,auth);
  if(action==='catalog'){
   const courses=COURSES.filter(c=>canTeach(actor,c));if(!courses.length)throw fail(403,'Acceso docente requerido.');
   return res.status(200).json({ok:true,courses,classics,readings:readings.map((r,i)=>({id:i,title:r.title}))});
  }
  if(action==='create'){
   if(!COURSES.includes(b.course)||!canTeach(actor,b.course))throw fail(403,'No tienes este curso asignado.');
   const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let code,ref,tx;
   for(let n=0;n<4;n++){
    code=Array.from({length:6},()=>alphabet[crypto.randomInt(alphabet.length)]).join('');ref=db.ref(ROOT+'/'+code);
    tx=await ref.transaction(current=>current?undefined:{control:{owner:actor.uid,course:b.course,createdAt:Date.now(),status:'lobby',current:0}},undefined,false);if(tx.committed)break;
   }
   if(!tx?.committed)throw fail(503,'No se pudo crear una sala. Reintenta.');
   await db.ref(BASE+'/bachillerato/docentes/'+actor.uid).set({code,course:b.course});
   return res.status(200).json({ok:true,code});
  }
  const code=String(req.query?.code||b.code||'').trim().toUpperCase();if(!CODE.test(code))throw fail(400,'Escribe el código de seis caracteres.');
  const path=ROOT+'/'+code,control=await val(db,path+'/control');if(!control)throw fail(404,'No existe esta sala. Revisa el código.');
  const host=['start','stop','grade','publish','finish'].includes(action)||action==='state'&&req.query?.host==='1';authorized(actor,control,host);
  const roundPath=path+'/rounds/'+control.current;
  const loadRound=async()=>{
   if(!control.current)return null;
   if(host)return val(db,roundPath);
   // El sondeo estudiantil nunca descarga el historial ni las respuestas del curso.
   const keys=['config','startedAt','endsAt','closedAt','published','answers/'+actor.uid,'grades/'+actor.uid];
   const values=await Promise.all(keys.map(k=>val(db,roundPath+'/'+k)));
   return {config:values[0],startedAt:values[1],endsAt:values[2],closedAt:values[3],published:values[4],answers:{[actor.uid]:values[5]},grades:{[actor.uid]:values[6]}};
  };
  const [players,roundData,standings]=await Promise.all([val(db,path+'/players'),loadRound(),action==='state'?val(db,path+'/standings'):null]);
  const room={...control,players:players||{},rounds:control.current?{[control.current]:roundData}:{},standings};
  if(action==='join'){
   if(room.status==='finished'&&!room.players?.[actor.uid])throw fail(409,'Esta partida ya terminó.');
   const ref=db.ref(path+'/players/'+actor.uid);
   // Una identidad por cuenta. Las altas no compiten por un único contador.
   await ref.transaction(p=>p||{name:String(actor.student.nombre||'Estudiante').slice(0,180),joinedAt:Date.now()},undefined,false);
   return res.status(200).json({ok:true,code});
  }
  if(!host&&!room.players?.[actor.uid])throw fail(403,'Primero entra a la sala con su código.');
  if(action==='state'){
   const round=room.rounds?.[room.current],ranking=room.standings||scores({...room,rounds:{}});
   const result={ok:true,code,course:room.course,status:room.status,current:room.current,serverNow:Date.now(),count:Object.keys(room.players||{}).length,
    round:round?{...publicConfig(round.config),startedAt:round.startedAt,endsAt:round.endsAt,closedAt:round.closedAt||null,published:round.published===true}:null,
    ranking:ranking.map(p=>({name:p.name,points:p.points,rank:p.rank,self:p.uid===actor.uid})),own:round?.answers?.[actor.uid]||null,ownGrade:round?.published?round.grades?.[actor.uid]||null:null};
   if(host){result.players=Object.entries(room.players||{}).map(([uid,p])=>({uid,name:p.name}));result.answers=round?.answers||{};result.grades=round?.grades||{};result.guide=round?.config.guide||[];}
   return res.status(200).json(result);
  }
  if(action==='start'){
   if(room.status==='finished')throw fail(409,'Crea otra sala para jugar de nuevo.');
   if(room.current&&room.rounds?.[room.current]?.published!==true)throw fail(409,'Publica los puntos antes de iniciar otra ronda.');
   const index=Number(room.current)+1;if(index>20)throw fail(400,'Esta partida ya tiene 20 rondas. Crea otra sala.');
   const config=makeRound(b,index),now=Date.now(),round={config,startedAt:now,endsAt:now+config.seconds*1000,published:false};
   const tx=await db.ref(path).transaction(current=>{
    if(!current)return null;if(current.control.current!==room.current||current.control.status!==room.status)return;
    return {...current,control:{...current.control,current:index,status:'playing'},rounds:{...(current.rounds||{}),[index]:round}};
   },undefined,false);
   if(!tx.committed)throw fail(409,'La sala cambió. Actualiza y vuelve a intentar.');
   return res.status(200).json({ok:true,current:index});
  }
  const id=String(b.round||'');if(id!==String(room.current))throw fail(409,'La ronda cambió. Actualiza la pantalla.');
  const round=room.rounds?.[id];if(!round)throw fail(409,'La ronda no ha comenzado.');
  const rpath=path+'/rounds/'+id,now=Date.now();
  if(action==='save'){
   if(room.status!=='playing'||round.closedAt||now>round.endsAt)throw fail(409,'La ronda terminó. Se conservan las respuestas guardadas.');
   if(!Array.isArray(b.answers)||b.answers.length!==round.config.questions.length||b.answers.some(x=>typeof x!=='string'||x.length>500)||!Number.isInteger(b.version)||b.version<0)throw fail(400,'Revisa las respuestas: máximo 500 caracteres por casilla.');
   const ref=db.ref(rpath+'/answers/'+actor.uid),requestId=String(b.requestId||'');if(!KEY.test(requestId))throw fail(400,'Solicitud inválida.');
   let conflict=false;
   const tx=await ref.transaction(current=>{
    conflict=false;if(current?.requestId===requestId)return current;
    if(current===null&&b.version>0)return null;
    if(current?.submitted===true||(current?.version||0)!==b.version){conflict=true;return;}
    return {uid:actor.uid,course:room.course,sessionId:'bachillerato-'+code+'-'+id,answers:b.answers.map(s=>s.trim()),version:b.version+1,requestId,savedAt:now,
     submitted:b.final===true,completada:b.final===true,...(b.final===true?{submittedAt:now,completadaAt:now}:{})};
   },undefined,false);
   const record=await val(db,rpath+'/answers/'+actor.uid);
   if(!tx.committed||conflict||record?.requestId!==requestId)throw fail(409,'Otra pestaña o entrega cambió la respuesta. Actualiza para recuperar lo guardado.');
   return res.status(200).json({ok:true,record});
  }
  if(action==='stop'){
   const tx=await db.ref(path).transaction(current=>{
    if(!current)return null;if(String(current.control.current)!==id)return;
    const r=current.rounds?.[id];if(!r)return;if(r.published)return current;
    return {...current,control:{...current.control,status:'review'},rounds:{...current.rounds,[id]:{...r,closedAt:r.closedAt||Math.min(now,r.endsAt)}}};
   },undefined,false);
   if(!tx.committed)throw fail(409,'La sala cambió. Actualiza.');
   // Recoger también borradores guardados antes del cierre; cada casilla conserva su identidad.
   const cutoff=tx.snapshot.val().rounds[id].closedAt,answers=await val(db,rpath+'/answers')||{};
   await Promise.all(Object.keys(answers).map(uid=>db.ref(rpath+'/answers/'+uid).transaction(a=>{
    if(!a||a.submitted||a.savedAt>cutoff)return a;
    return {...a,submitted:true,completada:true,submittedAt:cutoff,completadaAt:cutoff,collectedByHost:true};
   },undefined,false)));
   return res.status(200).json({ok:true});
  }
  if(action==='grade'){
   if(!round.closedAt||round.published)throw fail(409,'Detén la ronda antes de revisar. Los puntos publicados quedan cerrados.');
   if(!KEY.test(b.uid||'')||!room.players?.[b.uid]||!Array.isArray(b.points)||b.points.length!==round.config.questions.length||b.points.some(n=>![0,5,10].includes(n)))throw fail(400,'Asigna 0, 5 o 10 puntos por respuesta.');
   const tx=await db.ref(rpath).transaction(r=>{
    if(!r)return null;if(!r.closedAt||r.published)return;
    return {...r,grades:{...(r.grades||{}),[b.uid]:b.points}};
   },undefined,false);
   if(!tx.committed)throw fail(409,'Los puntos ya fueron publicados. Actualiza.');
   return res.status(200).json({ok:true,points:await val(db,rpath+'/grades/'+b.uid)});
  }
  if(action==='publish'){
   if(!round.closedAt)throw fail(409,'Detén la ronda antes de publicar.');
   const tx=await db.ref(path).transaction(current=>{
    if(!current)return null;if(String(current.control.current)!==id)return;
    const r=current.rounds?.[id];if(!r||!r.closedAt)return;if(r.published)return current;
    const grades={};const answers=Object.entries(r.answers||{}).filter(([,a])=>a.savedAt<=r.closedAt);
    for(const [uid,a]of answers){
     if(r.config.mode==='reading'&&!r.grades?.[uid])return;
     grades[uid]=r.grades?.[uid]||r.config.questions.map((_,i)=>{
      const word=normalize(a.answers?.[i]);if(!word||word[0]!==normalize(r.config.letter))return 0;
      const repeated=answers.filter(([,other])=>normalize(other.answers?.[i])===word).length>1;return repeated?5:10;
     });
    }
    const collected={...(r.answers||{})};
    answers.forEach(([uid,a])=>{collected[uid]={...a,submitted:true,completada:true,submittedAt:a.submittedAt||r.closedAt,completadaAt:a.completadaAt||r.closedAt};});
    const next={...current,rounds:{...current.rounds,[id]:{...r,answers:collected,grades,published:true,publishedAt:now}}};next.standings=scores(next);return next;
   },undefined,false);
   if(!tx.committed)throw fail(409,'Revisa y guarda los puntos de todas las respuestas de lectura antes de publicar.');
   return res.status(200).json({ok:true});
  }
  if(action==='finish'){
   if(!round.published)throw fail(409,'Publica los puntos de la última ronda antes de terminar.');
   const tx=await db.ref(path).transaction(current=>{
    if(!current)return null;if(String(current.control.current)!==id||!current.rounds?.[id]?.published)return;return {...current,control:{...current.control,status:'finished'}};
   },undefined,false);
   if(!tx.committed)throw fail(409,'La sala cambió. Actualiza.');return res.status(200).json({ok:true});
  }
  throw fail(400,'Acción desconocida.');
 }catch(e){return res.status(e.status||500).json({error:e.status?e.message:'No se pudo completar la acción. Conserva tu pantalla y reintenta.'});}
}
module.exports={manejar,normalize,scores,makeRound,ROOT};
