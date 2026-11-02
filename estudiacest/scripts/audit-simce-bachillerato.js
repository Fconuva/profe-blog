'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const game=require('../api/_simce-bachillerato');
const ROOT=path.resolve(__dirname,'..'),BASE='plataforma_estudiantes';
const clone=v=>v==null?null:JSON.parse(JSON.stringify(v));
function mockDb(){
 const state={[BASE]:{admins:{host:true,other:true},docentes:{host:{cursos:['2A-HC']},other:{cursos:['2A-HC']}},estudiantes:{wrong:{nombre:'Ficticio Otro',curso:'2B-HC',activo:true}}}};
 for(let i=0;i<42;i++)state[BASE].estudiantes['s'+i]={nombre:'Ficticio '+i,curso:'2A-HC',activo:true};
 function get(p){return p.split('/').filter(Boolean).reduce((n,k)=>n?.[k],state)??null;}
 function set(p,v){const keys=p.split('/').filter(Boolean);let n=state;for(const k of keys.slice(0,-1))n=n[k]??={};if(v===null)delete n[keys.at(-1)];else n[keys.at(-1)]=clone(v);}
 const snap=v=>({val:()=>clone(v),exists:()=>v!=null});
 return {state,ref(p){return {once:async()=>snap(get(p)),set:async v=>set(p,v),transaction:async fn=>{const next=fn(clone(get(p)));if(next===undefined)return {committed:false,snapshot:snap(get(p))};set(p,next);return {committed:true,snapshot:snap(get(p))};}};}};
}
function harness(){
 const db=mockDb(),auth={verifyIdToken:async token=>{if(!/^(host|other|wrong|s\d+)$/.test(token))throw Error('bad');return {uid:token};}};
 const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/estudiantes'){
   let raw='';for await(const chunk of req)raw+=chunk;req.query=Object.fromEntries(url.searchParams);req.body=raw?JSON.parse(raw):{};
   res.status=n=>{res.statusCode=n;return res;};res.json=o=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(o));};
   return game.manejar(req,res,String(req.query.action||'').replace('bachillerato-',''),db,auth);
  }
  const file=path.resolve(ROOT,'.'+decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)){res.statusCode=404;return res.end();}
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.ttf':'font/ttf'};res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
 });return {db,server};
}
async function call(origin,action,uid,body={},get=false){
 const url=new URL('/api/estudiantes',origin);url.searchParams.set('action','bachillerato-'+action);if(get)Object.entries(body).forEach(([k,v])=>url.searchParams.set(k,v));
 const response=await fetch(url,{method:get?'GET':'POST',headers:{Authorization:'Bearer '+uid,'Content-Type':'application/json'},...(!get?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};
}
async function main(){
 let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
 const {db,server}=harness();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 try{
  check((await call(origin,'catalog','bad',{},true)).status===401,'Sin sesión');
  check((await call(origin,'catalog','s0',{},true)).status===403,'Catálogo docente privado');
  check((await call(origin,'create','host',{course:'2B-HC'})).status===403,'Alcance docente por curso');
  const created=await call(origin,'create','host',{course:'2A-HC'});check(created.status===200,'Crear sala');const code=created.data.code;
  check((await call(origin,'join','wrong',{code})).status===403,'No entra otro curso');
  const joined=await Promise.all(Array.from({length:42},(_,i)=>call(origin,'join','s'+i,{code})));check(joined.every(x=>x.status===200),'42 ingresos simultáneos');
  await call(origin,'join','s0',{code});let room=(await call(origin,'state','host',{code,host:1},true)).data;check(room.count===42,'Ingreso repetido no duplica');
  check((await call(origin,'start','s0',{code,mode:'classic'})).status===403,'Alumno no inicia');
  check((await call(origin,'start','other',{code,mode:'classic'})).status===403,'Otro administrador no toma sala');
  check((await call(origin,'start','host',{code,mode:'classic',letter:'M',categories:['Nombre','Animal','Lugar'],seconds:120})).status===200,'Comenzar ronda');
  const writes=await Promise.all(Array.from({length:42},(_,i)=>call(origin,'save','s'+i,{code,round:1,version:0,requestId:'save-'+i,answers:['Mario','Mono','Maule'],final:i!==0})));
  check(writes.every(x=>x.status===200),'42 respuestas simultáneas');check(writes[1].data.record.submitted&&writes[1].data.record.completada,'Marcas completas');
  check((await call(origin,'save','s1',{code,round:1,version:0,requestId:'late',answers:['Mala','Mala','Mala']})).status===409,'Entrega inmutable');
  check((await call(origin,'save','s1',{code,round:1,version:0,requestId:'save-1',answers:['Mario','Mono','Maule'],final:true})).status===200,'Reintento idempotente');
  const own=(await call(origin,'state','s0',{code},true)).data;check(own.own.answers[0]==='Mario'&&!own.answers&&!own.guide&&!own.players,'Solo respuesta propia durante juego');
  check((await call(origin,'publish','host',{code,round:1})).status===409,'No publica durante juego');
  check((await call(origin,'stop','host',{code,round:1})).status===200,'Cierre docente');
  const collected=(await call(origin,'state','s0',{code},true)).data;check(collected.own.submitted&&collected.own.completada,'Recogida del borrador al cerrar');
  check((await call(origin,'save','s0',{code,round:1,version:1,requestId:'after',answers:['Mario','Mono','Maule']})).status===409,'Cierre bloquea guardado tardío');
  check((await call(origin,'grade','host',{code,round:1,uid:'s0',points:[10,0,10]})).status===200,'Corrección docente');
  check((await call(origin,'publish','host',{code,round:1})).status===200,'Publicación');
  const ranked=(await call(origin,'state','s0',{code},true)).data;check(ranked.ownGrade.join(',')==='10,0,10','Corrección conservada');check(ranked.ranking.find(p=>p.self).points===20,'Puntos servidor');check(ranked.ranking.filter(p=>p.points===15).every(p=>p.rank===2),'Empates comparten puesto');
  check(!JSON.stringify(ranked.ranking).includes('s0'),'Tabla sin UID');
  check((await call(origin,'grade','host',{code,round:1,uid:'s0',points:[0,0,0]})).status===409,'Publicación cierra edición');
  check((await call(origin,'start','host',{code,mode:'reading',reading:0,seconds:120})).status===200,'Desafío de lectura');
  const reading=(await call(origin,'state','s0',{code},true)).data;check(reading.round.text.includes('Tomás')&&!JSON.stringify(reading).includes('guide'),'Pauta privada');
  await call(origin,'save','s0',{code,round:2,version:0,requestId:'reading',answers:['Se levanta','Ayuda','Mantiene la ayuda'],final:true});await call(origin,'stop','host',{code,round:2});
  check((await call(origin,'publish','host',{code,round:2})).status===409,'Lectura requiere revisión explícita');
  await call(origin,'grade','host',{code,round:2,uid:'s0',points:[10,5,10]});await call(origin,'publish','host',{code,round:2});
  check((await call(origin,'finish','host',{code,round:2})).status===200,'Fin de partida');
  check((await call(origin,'join','s0',{code})).status===200,'Miembro retoma tabla después del cierre');
  const final=(await call(origin,'state','s0',{code},true)).data;check(final.ranking.find(p=>p.self).points===45,'Suma de rondas');
  check(game.scores({players:{a:{name:'Uno'},b:{name:'Dos'}},rounds:[null,{published:true,grades:{a:[10],b:[10]}}]}).every(p=>p.rank===1),'Arrays Firebase y empate inicial');
  if(process.argv.includes('--browser')){
   const {chromium}=require('playwright');const browser=await chromium.launch({headless:true});
   try{
    const fakeSdk=`window.firebase ||= {initializeApp:()=>({auth:()=>({onAuthStateChanged:fn=>queueMicrotask(()=>fn({uid:window.QA_ACTOR,displayName:'Cuenta ficticia',getIdToken:async()=>window.QA_ACTOR})),signInWithEmailAndPassword:async()=>{}})})};`;
    const context=await browser.newContext({viewport:{width:1366,height:768}});await context.addInitScript(()=>window.QA_ACTOR='host');await context.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body:fakeSdk}));
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/estudiantes/bachillerato/docente.html');await page.locator('#setup').waitFor({state:'visible'});await page.locator('#createForm button').click();await page.locator('#hostGame').waitFor({state:'visible'});const browserCode=(await page.locator('#roomCode').textContent()).trim();
    const students=await browser.newContext({viewport:{width:1366,height:768}});await students.addInitScript(()=>window.QA_ACTOR='s0');await students.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body:fakeSdk}));const student=await students.newPage();student.on('pageerror',e=>errors.push(e.message));
    await student.goto(origin+'/estudiantes/bachillerato/?sala='+browserCode);await student.locator('#waiting').waitFor({state:'visible'});
    await page.locator('#chooseLetter').fill('M');await page.locator('#startForm button').click();await student.locator('#answer0').waitFor({state:'visible',timeout:15000});await student.locator('#answer0').fill('María');await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.');await student.reload();await student.locator('#answer0').waitFor({state:'visible'});check(await student.locator('#answer0').inputValue()==='María','Navegador recupera guardado');
    await students.setOffline(true);await student.locator('#answer1').fill('Mono');await student.waitForFunction(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('bachillerato:')))).answers[1]==='Mono');await students.setOffline(false);await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.',{timeout:15000});
    await student.locator('#submit').click();await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Entrega confirmada'));check(await student.locator('#answer0').isDisabled(),'Entrega bloquea edición');
    await page.locator('#stop').click();await page.locator('#reviewPanel').waitFor({state:'visible'});await page.locator('#publish').click();await student.locator('#leaderboard').waitFor({state:'visible',timeout:15000});check((await student.locator('#ranking').textContent()).includes('pts'),'Tabla de estudiante');
    for(const width of [320,390,1366,3840]){await student.setViewportSize({width,height:900});check(await student.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Sin desborde a '+width);await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Docente sin desborde a '+width);}
    const out=path.join(ROOT,'test-results/bachillerato');fs.mkdirSync(out,{recursive:true});await student.setViewportSize({width:1366,height:768});await student.screenshot({path:path.join(out,'alumno.png'),fullPage:true});await page.setViewportSize({width:1366,height:768});await page.screenshot({path:path.join(out,'docente.png'),fullPage:true});
    await page.goto(origin+'/estudiantes/bachillerato/presentacion.html');for(let i=0;i<7;i++){check(await page.locator('[data-slide]:visible').count()===1,'Presentación una pantalla '+i);if(i<6)await page.locator('#next').click();}
    check(errors.length===0,'Sin errores JS: '+errors.join('; '));await context.close();await students.close();
   }finally{await browser.close();}
  }
  console.log('Bachillerato SIMCE: '+checks+' comprobaciones aprobadas; 42 ingresos y respuestas concurrentes con controlador HTTP real.');
 }finally{await new Promise(r=>server.close(r));}
}
module.exports={harness,call};if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
