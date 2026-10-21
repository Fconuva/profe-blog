'use strict';
const BASE='plataforma_estudiantes';
const CAMPAIGN='simce-honor-2026-octubre';
const COURSES=new Set(['2A-HC','2B-HC']);
const XP=require('../estudiantes/js/avatar-levels');
const fail=(status,message)=>Object.assign(new Error(message),{status});
async function manejar(req,res,db,auth){
 res.setHeader('Cache-Control','no-store');
 try{
  if(req.method!=='GET')throw fail(405,'Método no permitido.');
  const token=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  if(!token)throw fail(401,'Inicia sesión para ver el reconocimiento.');
  let identity;try{identity=await auth.verifyIdToken(token);}catch{throw fail(401,'Inicia sesión nuevamente.');}
  const student=(await db.ref(BASE+'/estudiantes/'+identity.uid).once('value')).val();
  if(!student||student.activo===false||!COURSES.has(student.curso))return res.status(200).json({ok:true,recognition:null});
  const data=(await db.ref(BASE+'/reconocimientos/'+CAMPAIGN).once('value')).val();
  const now=Date.now();
  if(!data||data.enabled!==true||!Number.isFinite(data.startsAt)||!Number.isFinite(data.expiresAt)||data.expiresAt-data.startsAt!==7*86400000||now<data.startsAt||now>=data.expiresAt)return res.status(200).json({ok:true,recognition:null});
  const selected=data.courses?.[student.curso];
  if(!Array.isArray(selected)||selected.length!==3||new Set(selected.map(x=>x.uid)).size!==3)throw fail(503,'El reconocimiento está en preparación.');
  const winners=await Promise.all(selected.map(async entry=>{
   if(!/^[A-Za-z0-9_-]{1,128}$/.test(entry.uid)||![1,2,3].includes(entry.rank))throw fail(503,'Reconocimiento no disponible.');
   const [profileSnap,avatarSnap]=await Promise.all([db.ref(BASE+'/estudiantes/'+entry.uid).once('value'),db.ref(BASE+'/avatar/'+entry.uid).once('value')]);
   const profile=profileSnap.val(),avatar=avatarSnap.val()||{};
   if(!profile||profile.activo===false||profile.curso!==student.curso)throw fail(503,'La nómina requiere revisión.');
   // Identidad y aspecto público, sin RUN, correo, resultados ni inventario.
   return{uid:entry.uid,name:String(profile.nombre||'Estudiante').slice(0,180),rank:entry.rank,avatar:{look:avatar.look||{},xpTotal:XP.totalXP(avatar)}};
  }));
  return res.status(200).json({ok:true,recognition:{id:CAMPAIGN,course:student.curso,startsAt:data.startsAt,expiresAt:data.expiresAt,serverNow:now,title:'Cuadro de honor 2026',basis:'Reconocimiento por desempeño destacado en el Ensayo SIMCE N.º 3 y el Miniensayo 1 de la Unidad 4.',winners}});
 }catch(error){return res.status(error.status||500).json({error:error.status?error.message:'No se pudo cargar el reconocimiento.'});}
}
module.exports={manejar,CAMPAIGN,BASE};
