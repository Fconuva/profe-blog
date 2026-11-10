'use strict';
// Cierre autorizado el 10-nov-2026: U3 y U4 por laboriosidad, sin borrar intentos.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{spawnSync}=require('child_process');
const {requestJson}=require('./firebase-maintenance-db');
let access;
async function token(){if(!access){const cli=require(path.join(process.env.APPDATA,'npm/node_modules/firebase-tools/lib/auth.js'));const account=cli.getAllAccounts().find(a=>a.tokens?.refresh_token);if(!account)throw Error('Se requiere sesión Firebase vigente.');access=(await cli.getAccessToken(account.tokens.refresh_token,[])).access_token;}return access;}
async function readPlatform(){return requestJson('GET','plataforma_estudiantes',await token());}
async function updatePlatform(update){return requestJson('PATCH','plataforma_estudiantes',await token(),update);}
const {buildPublication}=require('./publish-simce-labor-grades');
const {rowFor}=require('./export-simce-labor-review');
const {examForAttempt}=require('../api/_simce-u4-catalog');
const ordered=v=>Array.isArray(v)?v.map(ordered):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered(v[k])])):v;
const stable=v=>JSON.stringify(ordered(v)), hash=v=>crypto.createHash('sha256').update(stable(v)).digest('hex');
const COURSES=new Set(['2A-HC','2B-HC']);
function buildU4(platform,students,at){
 const rows=[],records={};
 // Solo se aplicaron los tres primeros miniensayos. Los ejercicios en cuaderno
 // no están registrados en línea: no inventar una corrección de escritura.
 for(const studentRow of students){
  const {uid,course}=studentRow,student=platform.estudiantes[uid];
  for(let number=1;number<=3;number++){
   const id='sesion-u4-'+number, response=platform.respuestas?.[id]?.[uid]||{},previous=platform.calificaciones_clase?.[uid]?.[id];
   if(Object.keys(response).length && (response.uid!==uid||response.sessionId!==id||response.curso!==course))throw Error('Identidad U4 inconsistente.');
   const exam=examForAttempt(number,response),total=exam.texts.flatMap(t=>t.questions).length;
   const answers=Object.fromEntries(Object.entries(response.answers||{}).filter(([,v])=>['A','B','C','D'].includes(v)));
   if(Object.keys(answers).some(key=>!exam.texts.flatMap(t=>t.questions).some(q=>q.id===key)))throw Error('Pregunta U4 fuera de su versión.');
   const row=rowFor(student,uid,id,platform.sesiones[id]||{},{...response,answers},response.result||{}, {alternatives:total,concepts:0,writing:[]});
   // Sin evidencia no se crea un 1,0 ni se presume ausencia injustificada.
   if(row.alternativesDone===0){row.proposedGrade=null;row.status='Sin evidencia digital: sin nota nueva';}
   const override=previous?.teacherGradeOverride;
   if(override?.source==='admin-manual'&&override.recordedAt&&override.reason&&Number(override.grade)>=1&&Number(override.grade)<=7)row.proposedGrade=Number(override.grade);
   else if(previous?.grade>=1&&previous.grade<=7)row.proposedGrade=Math.max(row.proposedGrade||0,previous.grade);
   rows.push(row);
   if(row.proposedGrade===null)continue;
   records[uid+'/'+id]={...previous,sessionId:id,classNumber:12+number,title:platform.sesiones[id]?.titulo||id,applicationDate:platform.sesiones[id]?.fecha_aplicacion||'',grade:row.proposedGrade,completionPercent:Math.round(row.completion*100),status:row.status==='Entregada'?'submitted':row.status==='Borrador'?'draft':'submission_inconsistent',statusLabel:row.status==='Entregada'?'Entrega registrada.':'Trabajo iniciado sin entrega confirmada.',submitted:row.status==='Entregada',modelVersion:'laboriosidad-u4-1-3-2026-11-10-v1',publishedAt:at};
  }
 }
 return {rows,records};
}
function build(platform,review,at){
 const students=[...new Map(review.rows.map(r=>[r.uid,{uid:r.uid,course:r.course,name:r.name,run:r.run}])).values()];
 const u3=buildPublication(review,at,students.length,platform.calificaciones_clase||{}),u4=buildU4(platform,students,at),updates={};
 const grades={...u3.records,...u4.records};let up=0,created=0;
 for(const [pair,record]of Object.entries(grades)){
  const [uid,id]=pair.split('/'),before=platform.calificaciones_clase?.[uid]?.[id];
  if(before?.grade>record.grade)throw Error('El cierre intentó bajar una nota.');
  if(!before){created++;if(record.grade===1)throw Error('No se crean notas 1,0 sin revisión individual.');}
  else if(record.grade>before.grade)up++;
  const keys=['grade','completionPercent','status','statusLabel','submitted','modelVersion'];
  if(!before||keys.some(k=>stable(before[k])!==stable(record[k])))updates['calificaciones_clase/'+pair]=record;
 }
 const targetUids=new Set(students.map(s=>s.uid)),closed=[];
 for(const [id,s]of Object.entries(platform.sesiones||{})){
  const assigned=s.asignados||[];
  if(!/^(?:sesion-(?:u[234]-|[1-7]$)|personal-u[34]-|ensayo-simce-)/.test(id)||s.programa!=='simce')continue;
  if(assigned.length&&!assigned.some(x=>COURSES.has(x)||targetUids.has(x)))continue;
  if(assigned.some(x=>!COURSES.has(x)&&!targetUids.has(x)))throw Error('La sesión comparte destinatarios fuera del cierre.');
  const desired={activa:false,respuestas_bloqueadas:true,cierre_final:true,cerrada_at:s.cerrada_at||Date.parse(at),excepciones_desbloqueo:null};
  for(const [key,value]of Object.entries(desired))if(stable(s[key]??null)!==stable(value))updates['sesiones/'+id+'/'+key]=value;
  closed.push(id);
 }
 // La Clase 11 tiene respaldo est?tico en el panel y puede no existir en sesiones.
 // Registrar su cierre evita que una URL antigua siga escribiendo por RTDB.
 if(!platform.sesiones?.['sesion-u3-11']){
  updates['sesiones/sesion-u3-11']={titulo:'Unidad 3 ? Clase 11 ? Transformar dos textos',programa:'simce',asignados:[...COURSES],activa:false,respuestas_bloqueadas:true,cierre_final:true,cerrada_at:Date.parse(at)};
  closed.push('sesion-u3-11');
 }
 return {updates,students,u3,u4,grades,summary:{students:students.length,u3Rows:review.rows.length,u4Rows:u4.rows.length,u4Graded:Object.keys(u4.records).length,u4WithoutNewGrade:u4.rows.filter(r=>r.proposedGrade===null).length,gradeIncreases:up,newGrades:created,gradeWrites:Object.keys(updates).filter(k=>k.startsWith('calificaciones_clase/')).length,closedSessions:closed.length,paths:Object.keys(updates).length,lowered:0}};
}
async function main(){
 const args=process.argv.slice(2),apply=args.includes('--apply'),arg=n=>{const i=args.indexOf(n);return i<0?null:args[i+1];};
 const dir=path.resolve(arg('--dir')||path.join(process.env.TEMP,'estudiacest-cierre-simce-20261110'));fs.mkdirSync(dir,{recursive:true});
 const platform=await readPlatform(),stamp=Date.now(),snapshot=path.join(dir,'platform-'+stamp+'.json'),reviewPath=path.join(dir,'u3-review-'+stamp+'.json');
 fs.writeFileSync(snapshot,JSON.stringify(platform));
 const exported=spawnSync(process.execPath,[path.join(__dirname,'export-simce-labor-review.js'),'--snapshot',snapshot,'--output',reviewPath],{encoding:'utf8',windowsHide:true});
 if(exported.status!==0)throw Error('No se pudo exportar la revisión U3.');
 const review=JSON.parse(fs.readFileSync(reviewPath)),at=new Date().toISOString(),plan=build(platform,review,at);
 fs.writeFileSync(path.join(dir,'plan-'+stamp+'.json'),JSON.stringify(plan));
 console.log(JSON.stringify({mode:apply?'apply':'dry-run',...plan.summary,planFile:path.join(dir,'plan-'+stamp+'.json')},null,2));
 if(!apply)return;
 if(Number(arg('--expected-paths'))!==plan.summary.paths)throw Error('Cambió el número de modificaciones: repetir simulación.');
 const before=await readPlatform();if(hash(before)!==hash(platform))throw Error('Cambió la base desde el respaldo: repetir simulación.');
 await updatePlatform(plan.updates);
 const after=await readPlatform();
 for(const [p,v]of Object.entries(plan.updates)){const actual=p.split('/').reduce((o,k)=>o?.[k],after)??null;if(stable(actual)!==stable(v))throw Error('Relectura distinta en una ruta aplicada.');}
 for(const key of ['respuestas','resultados','estudiantes'])if(hash(platform[key])!==hash(after[key]))throw Error('Se modificó un nodo fuera del alcance.');
 fs.writeFileSync(path.join(dir,'platform-after.json'),JSON.stringify(after));
 fs.writeFileSync(path.join(dir,'verified-plan.json'),JSON.stringify(plan));
 console.log(JSON.stringify({applied:true,verified:plan.summary.paths,answersPreserved:true,resultsPreserved:true,profilesPreserved:true}));
}
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={buildU4,build};
