'use strict';
const crypto=require('crypto'),Engine=require('../paes/cartas/motor'),CATALOG=require('./_paes-cartas-catalog');
const BASE='plataforma_paes/cartas_salas';
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const codeOf=v=>{const code=String(v||'').trim().toUpperCase();if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code))fail(400,'Escribe el código de seis caracteres de la sala.');return code;};
const array=v=>Array.isArray(v)?v.filter(x=>x!==null):v&&typeof v==='object'?Object.values(v):[];
function hydrate(raw){if(!raw)return null;const s=structuredClone(raw);for(const key of ['order','log','pacts'])s[key]=array(s[key]);for(const p of Object.values(s.players||{}))for(const key of ['deck','discard','hand','board'])p[key]=array(p[key]);return s;}
function proofFor(input,guided){const proof=input.proof;if(!proof)return null;const m=CATALOG.missions.find(m=>m.id===proof.mission),paragraph=proof.paragraph,explanation=String(proof.explanation||'').trim();if(!m||!Number.isInteger(paragraph)||paragraph<0||paragraph>=(guided?m.guided:m.paragraphs).length||explanation.length<(guided?3:12)||explanation.length>1200)fail(400,'Elige un fragmento y explica la relación con tu jugada.');return {mission:m.id,paragraph,explanation,guided};}
async function handle(action,req,res,{db,ident}){
 if(action!=='cards-room-state'&&req.method!=='POST')fail(405,'Usa POST para realizar una jugada.');
 const input=req.body||{};
 if(action!=='cards-room-state'&&input.version!==CATALOG.VERSION)fail(409,'Recarga el juego para usar la versión vigente.');
 const now=Date.now();
 if(action==='cards-room-create'){
  if(!Engine.PRESETS[input.archetype])fail(400,'Elige un mazo disponible.');
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for(let attempt=0;attempt<3;attempt++){
   const bytes=crypto.randomBytes(10),code=Array.from(bytes.subarray(0,6),v=>alphabet[v%alphabet.length]).join(''),seed=bytes.readUInt32BE(6),ref=db.ref(BASE+'/'+code);
   const room=Engine.create(ident,input.archetype,seed,now,code);
   const tx=await ref.transaction(current=>current===null?room:undefined,undefined,false);
   if(tx.committed){const stored=hydrate((await ref.once('value')).val());if(stored?.players[ident.uid])return res.status(200).json({success:true,room:Engine.publicRoom(stored,ident.uid)});}
  }
  fail(409,'No se pudo reservar la sala. Inténtalo nuevamente.');
 }
 const code=codeOf(input.code||req.query?.code),ref=db.ref(BASE+'/'+code);
 if(action==='cards-room-state'){
  const room=hydrate((await ref.once('value')).val());if(!room)fail(404,'No encontramos esa sala. Comprueba el código.');if(room.curso!==ident.curso)fail(403,'La sala pertenece a otro curso.');return res.status(200).json({success:true,room:Engine.publicRoom(room,ident.uid)});
 }
 if(!['cards-room-join','cards-room-act'].includes(action))fail(400,'Acción de sala desconocida.');
 let issue;
 const proof=action==='cards-room-act'?proofFor(input,ident.guided):null;
 const tx=await ref.transaction(current=>{
  issue=null;if(current===null)return null;
  try{const room=hydrate(current);if(room.curso!==ident.curso)fail(403,'La sala pertenece a otro curso.');return action==='cards-room-join'?Engine.join(room,ident,input.archetype,now):Engine.apply(room,ident.uid,input,now,proof);}catch(e){issue=e;return undefined;}
 },undefined,false);
 const stored=hydrate((await ref.once('value')).val());
 if(issue)throw issue;if(!stored)fail(404,'No encontramos esa sala. Comprueba el código.');if(!tx.committed)fail(409,'La sala cambió. Recupera el turno actual.');
 return res.status(200).json({success:true,room:Engine.publicRoom(stored,ident.uid)});
}
module.exports={handle,BASE,hydrate,proofFor};
