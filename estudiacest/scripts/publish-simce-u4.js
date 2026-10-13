'use strict';
const fs=require('fs'),os=require('os'),path=require('path');
const {exams}=require('../api/_simce-u4-catalog');
const {getAccessToken,requestJson}=require('./firebase-maintenance-db');
function standardSession(exam){return {
 titulo:`Unidad 4 · Miniensayo ${exam.number} — ${exam.title}`,descripcion:'3 textos y 18 preguntas. Aciertos y puntaje simulado CEST al entregar.',
 orden:400+exam.number,programa:'simce',activa:true,respuestas_bloqueadas:false,
 resultados_visibles:true,retroalimentacion_visible:false,notas_evaluadas:false,
 panel_unidad:'u4',panel_seccion:'plan',panel_orden:exam.number,fecha_aplicacion:exam.date,
 link_guia:`/estudiantes/simce-unidad4/?ensayo=${exam.number}`,prefer_guia:true,
 asignados:['2A-HC','2B-HC'],total_preguntas:18,formato_panel:'simce-mini-u4',
 fecha_cierre:'2026-11-10',cierre_at:Date.parse('2026-11-11T00:00:00-03:00')
};}
async function main(){
 const token=getAccessToken();
 const existing=await requestJson('GET','plataforma_estudiantes/sesiones',token) || {};
 const desired=Object.fromEntries(exams.map(exam=>[exam.sessionId,standardSession(exam)]));
 const updates={};
 for(const[id,session]of Object.entries(desired))for(const[field,value]of Object.entries(session)){
  if(JSON.stringify(existing[id]?.[field])!==JSON.stringify(value))updates[`sesiones/${id}/${field}`]=value;
 }
 console.log(JSON.stringify({mode:process.argv.includes('--apply')?'apply':'dry-run',sessions:Object.keys(desired),fieldChanges:Object.keys(updates).length,dates:exams.map(e=>e.date),courses:['2A-HC','2B-HC']}));
 if(!process.argv.includes('--apply'))return;
 if(!Object.keys(updates).length){console.log('Sin cambios: la configuración ya coincide.');return;}
 const dir=path.join(os.tmpdir(),'estudiacest-private-backups');fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,`simce-u4-before-${Date.now()}.json`),JSON.stringify(Object.fromEntries(Object.keys(desired).map(id=>[id,existing[id] || null]))));
 // Patch por campo: conserva excepciones y cualquier metadato ajeno.
 await requestJson('PATCH','plataforma_estudiantes',token,updates);
 const verified=await requestJson('GET','plataforma_estudiantes/sesiones',token);
 for(const[id,session]of Object.entries(desired))for(const[field,value]of Object.entries(session)){
  if(JSON.stringify(verified[id]?.[field])!==JSON.stringify(value))throw Error(`Falló la relectura de ${id}/${field}.`);
 }
 console.log('Cinco sesiones habilitadas y verificadas. Sin cambios en respuestas ni calificaciones.');
}
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={standardSession};
