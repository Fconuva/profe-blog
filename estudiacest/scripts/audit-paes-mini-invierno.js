'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../api/_paes-mini-invierno-catalog'),B=require('../api/_paes-mini-invierno'),G=require('../paes/mini-invierno-2027/integridad');
function database(){
 const state={plataforma_estudiantes:{estudiantes:{alumno:{nombre:'Cuenta ficticia NM4',curso:'4°A HC',rut:'000000001'},pareja:{nombre:'Otra cuenta ficticia',curso:'4B-HC',rut:'000000002'},apoyo:{nombre:'Cuenta ficticia con apoyo',curso:'3°A HC',rut:['229','327','739'].join('')},otro:{nombre:'Cuenta ficticia NM3',curso:'3°A HC',rut:'000000003'}}}};
 const clone=v=>v===undefined?undefined:JSON.parse(JSON.stringify(v)),get=p=>p.split('/').reduce((o,k)=>o?.[k],state)??null;
 const set=(p,v)=>{const a=p.split('/'),k=a.pop();let o=state;for(const s of a)o=o[s]||={};o[k]=clone(v);};
 return {state,ref:p=>({once:async()=>({val:()=>clone(get(p))}),set:async v=>set(p,v),transaction:async fn=>{if(get(p)!==null)fn(null);const v=fn(clone(get(p)));if(v===undefined)return {committed:false,snapshot:{val:()=>clone(get(p))}};set(p,v);return {committed:true,snapshot:{val:()=>clone(v)}};}})};
}
const auth={verifyIdToken:async t=>{if(!['alumno','pareja','apoyo','otro','profesor'].includes(t))throw Error('token');return {uid:t};}};
async function call(db,action,token,body,mode='regular',admin=false){let status=200,value;const res={setHeader(){},status(n){status=n;return this;},json(v){value=JSON.parse(JSON.stringify(v));return this;}};await B.handle(action,{method:body?'POST':'GET',headers:{authorization:token?'Bearer '+token:''},query:{mode},body},res,{db,auth,adminUid:admin?'profesor':undefined});return {status,body:value};}
const full=g=>({version:C.VERSION,answers:Object.fromEntries(C.questionsFor(g).map(q=>[q.id,q.key])),reflection:{}});
async function audit(){let n=0;const check=(condition,label)=>{assert.ok(condition,label);n++;},db=database();
 check((await call(db,'mini-state')).status===401,'sin token');check((await call(db,'mini-state','falso')).status===401,'token inválido');check((await call(db,'mini-state','otro')).status===403,'curso fuera de alcance');
 db.state.plataforma_estudiantes.estudiantes.otro.activo=false;check((await call(db,'mini-state','otro')).status===403,'cuenta inactiva');
 let r=await call(db,'mini-state','alumno');check(r.status===200&&r.body.activity.questions.length===18,'tres textos y dieciocho ítems');check(!/"(?:key|reason|failures|skill|task)":/.test(JSON.stringify(r.body)),'claves y habilidades privadas');
 check((await call(db,'mini-state','apoyo')).body.redirect.endsWith('guiada.html'),'redirección por identidad');r=await call(db,'mini-state','apoyo',null,'guided');check(r.body.activity.questions.length===6&&r.body.activity.suggestedMinutes===null,'seis preguntas sin reloj');
 check((await call(db,'mini-state','alumno',null,'guided')).body.redirect==='/paes/mini-invierno-2027/','aislamiento de variantes');
 check((await call(db,'mini-save','alumno',{version:C.VERSION,answers:{q99:'A'}})).status===400,'id inválido');check((await call(db,'mini-save','alumno',{version:C.VERSION,answers:{q1:'E'}})).status===400,'opción inválida');check((await call(db,'mini-save','alumno',{version:'old'})).status===409,'versión');
 r=await call(db,'mini-start','alumno',{...full(false),answers:{}});check(r.status===200&&r.body.attempt.startedAt>0,'inicio servidor');
 r=await call(db,'mini-save','alumno',{...full(false),uid:'apoyo',curso:'3A-HC',score:900,strikes:0,submitted:true,completada:true});check(!r.body.attempt.submitted&&!('score'in r.body.attempt),'no confiar puntajes o marcas cliente');
 let raw=(await db.ref(B.BASE+'/'+C.SESSION+'/alumno').once('value')).val();check(raw.uid==='alumno'&&raw.curso==='4A-HC','identidad servidor');
 const e={...full(false),eventId:'fixture-event-1',reason:'hidden'};r=await call(db,'mini-incident','alumno',e);check(r.body.attempt.strikes===1,'primer strike');r=await call(db,'mini-incident','alumno',{...e,answers:{}});check(r.body.attempt.strikes===1&&Object.keys(r.body.attempt.answers).length===18,'incidencia idempotente sin pérdida');
 r=await call(db,'mini-save','alumno',{...full(false),strikes:0,incidents:{}});check(r.body.attempt.strikes===1,'strike no puede borrarse');
 check((await call(db,'mini-incident','alumno',{...e,eventId:'bad',reason:'inventado'})).status===400,'incidente válido');
 r=await call(db,'mini-incident','alumno',{...e,eventId:'fixture-event-2',reason:'blur'});check(r.body.attempt.strikes===2&&!r.body.attempt.submitted,'segundo strike');
 r=await call(db,'mini-incident','alumno',{...e,answers:{q1:'B'},eventId:'fixture-event-3',reason:'geometry'});check(r.body.attempt.strikes===3&&r.body.attempt.completada&&r.body.attempt.submitted&&r.body.attempt.endedBy==='strikes','tercer strike entrega parcial');check(!('result'in r.body.attempt),'resultado no publicado');
 raw=(await db.ref(B.BASE+'/'+C.SESSION+'/alumno').once('value')).val();check(raw.total===18&&raw.score===1&&raw.submittedAt===raw.completadaAt,'puntaje y marcas atómicos');
 check((await call(db,'mini-save','alumno',full(false))).status===409,'borrador tardío no revierte final');check((await call(db,'mini-submit','alumno',full(false))).status===409,'entrega inmutable');
 check((await call(db,'admin-mini-list','alumno')).status===403,'admin autorizado');
 await call(db,'admin-mini-release','profesor',{curso:'4A-HC',published:true},'regular',true);r=await call(db,'mini-state','alumno');check(r.body.attempt.result.score===1&&r.body.attempt.review.length===18,'publicación tras entrega');
 r=await call(db,'mini-state','pareja');check(!r.body.attempt,'no filtra otras identidades');
 await call(db,'admin-mini-release','profesor',{curso:'4A-HC',published:false},'regular',true);check(!('result'in (await call(db,'mini-state','alumno')).body.attempt),'retirar publicación');
 await call(db,'admin-mini-reset','profesor',{uid:'alumno',sessionId:C.SESSION},'regular',true);r=await call(db,'mini-state','alumno');check(r.body.attempt===null&&r.body.resetAt>0,'reapertura');const resetAt=r.body.resetAt;
 check((await call(db,'mini-save','alumno',full(false))).status===409,'cola vieja rechazada');r=await call(db,'mini-submit','alumno',{...full(false),resetAt});check(r.body.attempt.completada,'nuevo intento con versión de reapertura');
 r=await call(db,'admin-mini-list','profesor',null,'regular',true);check(r.body.rows.some(x=>x.uid==='alumno')&&r.body.keys.regular.length===18,'admin recibe evidencia');
 r=await call(db,'mini-submit','apoyo',{...full(true),answers:{}},'guided');check(r.status===200&&r.body.attempt.completada,'omisión no bloquea');raw=(await db.ref(B.BASE+'/'+C.SESSION+'-guiada/apoyo').once('value')).val();check(raw.score===0&&raw.total===6&&raw.variant==='guided-access-2026','clave individual servidor');
 check(!JSON.stringify(B.form('alumno')).includes('key'),'forma sin clave');check(JSON.stringify(B.form('alumno'))===JSON.stringify(B.form('alumno'))&&JSON.stringify(B.form('alumno'))!==JSON.stringify(B.form('pareja')),'opciones deterministas por uid');
 for(const q of [...C.questionsFor(false),...C.questionsFor(true)]){check(q.options.length===4&&'ABCD'.includes(q.key),'A-D respuesta única');check(q.failures.filter(Boolean).length===3&&q.failures[q.key.charCodeAt(0)-65]==='','descarte de cada distractor');check(q.options[q.key.charCodeAt(0)-65].length<=Math.max(...q.options.filter((_,i)=>i!==q.key.charCodeAt(0)-65).map(o=>o.length))*1.15,'clave no destaca por longitud');const t=q.textId===1&&C.questionsFor(true).includes(q)?C.publicActivity(true).texts[0]:C.texts[q.textId-1];check(t.paragraphs.join(' ').includes(q.evidence),'evidencia literal en texto');}
 check(C.texts.length===3&&C.texts.every(t=>t.paragraphs.join(' ').split(/\s+/).length>=500),'extensión');for(const t of C.texts)check(C.questionsFor(false).filter(q=>q.textId===t.id).length===6,'seis ítems por lectura');
 check(!G.geometry({mobile:true,width:390,height:250,baselineWidth:390,screenWidth:390,screenHeight:844}),'teclado móvil no castiga');check(G.geometry({mobile:true,width:240,baselineWidth:390}),'reducción ancho móvil');check(G.geometry({mobile:false,width:960,height:1080,screenWidth:1920,screenHeight:1080}),'pantalla dividida aproximada');check(!G.geometry({mobile:false,width:1920,height:1080,screenWidth:1920,screenHeight:1080}),'pantalla completa');
 for(const file of ['mini.js','integridad.js','sesion.js','docente.js','portal.js'])new Function(fs.readFileSync(path.join(__dirname,'../paes/mini-invierno-2027',file),'utf8'));
 console.log(`Miniensayo NM4: ${n} comprobaciones aprobadas. Evidencia, identidad, claves privadas, strikes, reapertura y entrega. Solo fixtures.`);return n;
}
module.exports={database,auth,call,full,audit};if(require.main===module)audit().catch(e=>{console.error(e);process.exitCode=1;});
