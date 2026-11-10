'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const game=require('../api/_simce-bachillerato');
const ROOT=path.resolve(__dirname,'..'),BASE='plataforma_estudiantes';
const clone=v=>v==null?null:JSON.parse(JSON.stringify(v));
function mockDb(){
 const state={[BASE]:{admins:{host:true,other:true},docentes:{host:{cursos:['2A-HC']},other:{cursos:['2A-HC']}},estudiantes:{wrong:{nombre:'Ficticio Otro',curso:'2B-HC',activo:true}}}};
 for(let i=0;i<42;i++)state[BASE].estudiantes['s'+i]={nombre:'Ficticio '+i,curso:'2A-HC',activo:true};
 // 4.º medio: el perfil guarda el curso de varias formas; la sala NM4 debe reconocerlas todas.
 state[BASE].admins.lvl=true;state[BASE].docentes.lvl={cursos:['4ATP','4b-tp','4.º C TP','4D-TP','4E-TP','4A-HC','4.º B HC']};
 const nm4=['4ATP','4b-tp','4.º C TP','4D-TP','4e tp','4A-HC','4.º B HC'];
 for(let i=0;i<45;i++)state[BASE].estudiantes['n'+i]={nombre:'Ficticia Cuarto '+i+' Apellido Prueba',curso:nm4[i%7],activo:true};
 function get(p){return p.split('/').filter(Boolean).reduce((n,k)=>n?.[k],state)??null;}
 function set(p,v){const keys=p.split('/').filter(Boolean);let n=state;for(const k of keys.slice(0,-1))n=n[k]??={};if(v===null)delete n[keys.at(-1)];else n[keys.at(-1)]=clone(v);}
 const snap=v=>({val:()=>clone(v),exists:()=>v!=null});
 return {state,ref(p){return {once:async()=>snap(get(p)),set:async v=>set(p,v),transaction:async fn=>{const next=fn(clone(get(p)));if(next===undefined)return {committed:false,snapshot:snap(get(p))};set(p,next);return {committed:true,snapshot:snap(get(p))};}};}};
}
function harness(){
 const db=mockDb(),auth={verifyIdToken:async token=>{if(!/^(host|other|wrong|lvl|s\d+|n\d+)$/.test(token))throw Error('bad');return {uid:token};}};
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
  check((await call(origin,'catalog','s0',{},true)).data.courses.join(',')==='2A-HC','Alumno puede crear para su curso');
  check((await call(origin,'create','host',{course:'2B-HC'})).status===403,'Alcance docente por curso');
  const studentCreated=await call(origin,'create','s40',{course:'2A-HC'});check(studentCreated.status===200,'Estudiante activo crea su propia sala');const studentCode=studentCreated.data.code;
  check((await call(origin,'entry','s40',{code:studentCode},true)).data.mode==='host','Creador estudiante conserva rol anfitrión');
  check((await call(origin,'state','s40',{code:studentCode,host:1},true)).status===200,'Creador estudiante abre controles de su sala');
  check((await call(origin,'state','s39',{code:studentCode,host:1},true)).status===403,'Compañero no lee respuestas como anfitrión');
  check((await call(origin,'start','s39',{code:studentCode,mode:'classic'})).status===403,'Compañero no controla sala ajena');
  check((await call(origin,'create','s40',{course:'2B-HC'})).status===403,'Estudiante no crea para otro curso sin permiso');
  db.state[BASE].estudiantes.s40.activo=false;check((await call(origin,'create','s40',{course:'2A-HC'})).status===403,'Cuenta inactiva no crea salas');check((await call(origin,'state','s40',{code:studentCode,host:1},true)).status===403,'Cuenta inactiva no dirige');db.state[BASE].estudiantes.s40.activo=true;
  check((await call(origin,'start','s40',{code:studentCode,mode:'classic'})).status===200,'Estudiante anfitrión inicia ronda');
  check((await call(origin,'stop','s40',{code:studentCode,round:1})).status===200,'Estudiante anfitrión detiene ronda');
  check((await call(origin,'publish','s40',{code:studentCode,round:1})).status===200,'Estudiante anfitrión publica puntos');
  check((await call(origin,'finish','s40',{code:studentCode,round:1})).status===200,'Estudiante anfitrión termina partida');
  check(!db.state[BASE].admins.s40&&!db.state[BASE].docentes.s40,'Crear sala no concede admin ni docente');
  const created=await call(origin,'create','host',{course:'2A-HC'});check(created.status===200,'Crear sala');const code=created.data.code;
  check((await call(origin,'entry','host',{code},true)).data.mode==='host','Creador docente sin perfil de alumno reconocido antes de entrar');
  const teacherEntry=await call(origin,'join','host',{code});check(teacherEntry.status===200&&teacherEntry.data.mode==='host','Entrada del creador conserva su rol docente');
  check(!db.state[BASE].bachillerato.salas[code].players?.host,'No se agrega al docente como alumno');
  const otherCourse=await call(origin,'entry','wrong',{code},true);check(otherCourse.status===200&&otherCourse.data.mode==='course-mismatch'&&otherCourse.data.message.includes('2B-HC')&&otherCourse.data.message.includes('2.º A HC'),'Otro curso recibe explicación sin intentar join');
  check((await call(origin,'entry','s0',{code},true)).data.mode==='student','Alumno del curso habilitado');
  check((await call(origin,'entry','other',{code},true)).data.mode==='account-required','Otro administrador no toma una sala ajena');
  db.state[BASE].estudiantes.s41.activo=false;check((await call(origin,'entry','s41',{code},true)).data.mode==='inactive','Se conserva bloqueo de cuenta inactiva');db.state[BASE].estudiantes.s41.activo=true;
  check((await call(origin,'join','wrong',{code})).status===403,'No entra otro curso');
  db.state[BASE].bachillerato.accesos={wrong:{cursos:{'2A-HC':true,'2B-HC':true}}};
  check((await call(origin,'entry','wrong',{code},true)).data.mode==='student','Acceso privado adicional reconoce el otro curso');
  check((await call(origin,'join','wrong',{code})).status===200,'Cuenta habilitada puede ingresar al otro curso');
  check((await call(origin,'state','wrong',{code},true)).status===200,'Acceso adicional permite sondeo');
  check((await call(origin,'start','wrong',{code,mode:'classic'})).status===403,'Acceso adicional no concede administración');
  db.state[BASE].estudiantes.wrong.activo=false;check((await call(origin,'join','wrong',{code})).status===403,'Acceso adicional no omite cuenta inactiva');db.state[BASE].estudiantes.wrong.activo=true;
  delete db.state[BASE].bachillerato.accesos.wrong;delete db.state[BASE].bachillerato.salas[code].players.wrong;
  db.state[BASE].estudiantes.wrong.cursos=['2A-HC'];check((await call(origin,'join','wrong',{code})).status===403,'Campo del perfil no concede acceso adicional');
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
  // NM4: una sala para todo 4.º medio (4.º A–E TP y 4.º A–B HC) con 45 estudiantes.
  const lvlCatalog=(await call(origin,'catalog','lvl',{},true)).data;check(lvlCatalog.courses[0]==='NM4'&&lvlCatalog.labels.NM4==='4.º medio · todos los cursos (NM4)','Docente de 4.º ve la sala de nivel con su etiqueta');
  check(!(await call(origin,'catalog','host',{},true)).data.courses.includes('NM4'),'Docente de 2.º no ve la sala de nivel');
  check((await call(origin,'catalog','n0',{},true)).data.courses.join(',')==='4A-TP','Estudiante de 4.º crea solo para su curso');
  check((await call(origin,'create','n0',{course:'NM4'})).status===403,'Estudiante no crea sala de nivel');
  check((await call(origin,'create','host',{course:'NM4'})).status===403,'Docente sin los cursos de 4.º no crea sala de nivel');
  const level=await call(origin,'create','lvl',{course:'NM4'});check(level.status===200,'Crear sala NM4');const lcode=level.data.code;
  const outsider=(await call(origin,'entry','s0',{code:lcode},true)).data;check(outsider.mode==='course-mismatch'&&outsider.message.includes('4.º medio'),'2.º medio recibe la explicación con la etiqueta');
  check((await call(origin,'join','s0',{code:lcode})).status===403,'2.º medio no entra a la sala NM4');
  const N=45,ids=Array.from({length:N},(_,i)=>'n'+i);
  const entries=await Promise.all(ids.map(u=>call(origin,'entry',u,{code:lcode},true)));check(entries.every(x=>x.data.mode==='student'),'Los 7 cursos de 4.º se reconocen pese a la forma del perfil');
  check((await Promise.all(ids.map(u=>call(origin,'join',u,{code:lcode})))).every(x=>x.status===200),'45 ingresos simultáneos a NM4');
  await Promise.all(ids.slice(0,10).map(u=>call(origin,'join',u,{code:lcode})));
  let lroom=(await call(origin,'state','lvl',{code:lcode,host:1},true)).data;check(lroom.count===N&&lroom.players.length===N&&lroom.courseLabel==='4.º medio · todos los cursos (NM4)','45 participantes sin duplicados y con la etiqueta del curso');
  check((await call(origin,'start','lvl',{code:lcode,mode:'classic',letter:'P',categories:['Nombre','Animal','Lugar','Objeto'],seconds:180})).status===200,'Ronda de palabras NM4');
  const answersFor=i=>[i%3?'Pedro':'Paula '+i,i%2?'Puma':'Pez','Parral','Pala '+i];
  const polls=await Promise.all(ids.map(u=>call(origin,'state',u,{code:lcode},true)));check(polls.every(x=>x.status===200&&x.data.round.letter==='P'&&!x.data.players&&!x.data.answers),'45 sondeos sin datos de compañeros');
  const drafts=await Promise.all(ids.map((u,i)=>call(origin,'save',u,{code:lcode,round:1,version:0,requestId:'d-'+u,answers:answersFor(i)})));check(drafts.every(x=>x.status===200&&x.data.record.version===1),'45 borradores simultáneos');
  const finals=await Promise.all(ids.map((u,i)=>call(origin,'save',u,{code:lcode,round:1,version:1,requestId:'f-'+u,answers:answersFor(i),final:true})));check(finals.every(x=>x.status===200&&x.data.record.submitted),'45 entregas simultáneas');
  lroom=(await call(origin,'state','lvl',{code:lcode,host:1},true)).data;check(Object.keys(lroom.answers).length===N&&Object.values(lroom.answers).every(a=>a.course==='NM4'),'Docente ve las 45 entregas');
  check((await call(origin,'stop','lvl',{code:lcode,round:1})).status===200,'Cierre NM4');
  check((await call(origin,'publish','lvl',{code:lcode,round:1})).status===200,'Palabras se puntúan sin revisión manual');
  const lr=(await call(origin,'state','n7',{code:lcode},true)).data;check(lr.ranking.length===N&&lr.ranking.filter(p=>p.self).length===1&&lr.ranking.find(p=>p.self).points===25,'Tabla con los 45 y puntaje propio');
  check(lr.ranking.every(p=>p.name.split(' ').length<=2),'La tabla proyectada muestra nombres cortos');
  // Lectura: cada respuesta exige revisión; no publica hasta tener las 45.
  check((await call(origin,'start','lvl',{code:lcode,mode:'reading',reading:0,seconds:180})).status===200,'Lectura NM4');
  const rq=(await call(origin,'state','n0',{code:lcode},true)).data.round.questions.length;
  check((await Promise.all(ids.map(u=>call(origin,'save',u,{code:lcode,round:2,version:0,requestId:'r-'+u,answers:Array(rq).fill('Respuesta ficticia'),final:true})))).every(x=>x.status===200),'45 entregas de lectura');
  check((await call(origin,'stop','lvl',{code:lcode,round:2})).status===200,'Cierre de lectura NM4');
  for(const u of ids.slice(0,N-1))check((await call(origin,'grade','lvl',{code:lcode,round:2,uid:u,points:Array(rq).fill(5)})).status===200,'Revisión guardada '+u);
  check((await call(origin,'publish','lvl',{code:lcode,round:2})).status===409,'Con una revisión pendiente no publica');
  check((await call(origin,'grade','lvl',{code:lcode,round:2,uid:ids[N-1],points:Array(rq).fill(10)})).status===200,'Última revisión');
  check((await call(origin,'publish','lvl',{code:lcode,round:2})).status===200,'Publica con las 45 revisiones');
  check((await call(origin,'finish','lvl',{code:lcode,round:2})).status===200,'Fin de partida NM4');
  if(process.argv.includes('--browser')){
   const {chromium}=require('playwright');const browser=await chromium.launch({headless:true});
   try{
    const fakeSdk=`window.firebase ||= {initializeApp:()=>({auth:()=>({onAuthStateChanged:fn=>queueMicrotask(()=>fn({uid:window.QA_ACTOR,displayName:'Cuenta ficticia',getIdToken:async()=>window.QA_ACTOR})),signInWithEmailAndPassword:async()=>{}})})};`;
    const context=await browser.newContext({viewport:{width:1366,height:768}});await context.addInitScript(()=>window.QA_ACTOR='host');await context.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body:fakeSdk}));
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/estudiantes/bachillerato/docente.html');await page.locator('#setup').waitFor({state:'visible'});await page.locator('#resumeCode').fill('AAAAAA');await page.locator('#resumeForm button').click();await page.waitForFunction(()=>document.querySelector('#notice').textContent.includes('No existe'));check(await page.locator('#setup').isVisible(),'Código inexistente conserva formulario de recuperación');await page.locator('#createForm button').click();await page.locator('#hostGame').waitFor({state:'visible'});const browserCode=(await page.locator('#roomCode').textContent()).trim();
    const qrReady=()=>{const q=document.querySelector('#qr');if(!q||q.hidden)return false;const img=q.querySelector('img'),canvas=q.querySelector('canvas');return (img&&img.naturalWidth>0&&getComputedStyle(img).display!=='none')||(canvas&&canvas.width>0&&getComputedStyle(canvas).display!=='none');};
    await page.waitForFunction(qrReady,null,{timeout:8000});check((await page.locator('#joinUrl').getAttribute('href')).endsWith('/bachillerato/?sala='+browserCode),'Panel docente muestra el QR y el enlace directo a la sala');
    const students=await browser.newContext({viewport:{width:1366,height:768}});await students.addInitScript(()=>window.QA_ACTOR='s0');await students.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body:fakeSdk}));const student=await students.newPage();student.on('pageerror',e=>errors.push(e.message));
    await student.goto(origin+'/bachillerato/?sala='+browserCode);await student.locator('#waiting').waitFor({state:'visible'});check(student.url().endsWith('/estudiantes/bachillerato/?sala='+browserCode),'La dirección corta del QR lleva a la sala con su código');
    const wall1=await context.newPage();wall1.on('pageerror',e=>errors.push(e.message));await wall1.goto(new URL(await page.locator('#project').getAttribute('href'),page.url()).href);await wall1.locator('#waiting').waitFor({state:'visible'});await wall1.waitForFunction(qrReady,null,{timeout:8000});
    check((await wall1.locator('#roomCode').textContent()).trim()===browserCode&&(await wall1.locator('#waiting [data-short-link]').textContent()).endsWith('/bachillerato'),'Pantalla proyectada muestra QR, dirección corta y código');
    await wall1.waitForFunction(()=>document.querySelectorAll('#screenPlayers [data-uid]').length===1,null,{timeout:15000});check(true,'Pantalla lista al estudiante que entró');
    await page.locator('#chooseLetter').fill('M');await page.locator('#startForm button').click();await student.locator('#answer0').waitFor({state:'visible',timeout:15000});
    await wall1.locator('#round').waitFor({state:'visible',timeout:15000});check(await wall1.locator('#screenBar').isVisible()&&(await wall1.locator('#barCode').textContent()).trim()===browserCode,'Durante la ronda la pantalla mantiene el código para quien llega tarde');await wall1.close();await student.locator('#answer0').fill('María');await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.');await student.reload();await student.locator('#answer0').waitFor({state:'visible'});check(await student.locator('#answer0').inputValue()==='María','Navegador recupera guardado');
    await students.setOffline(true);await student.locator('#answer1').fill('Mono');await student.waitForFunction(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('bachillerato:')))).answers[1]==='Mono');await students.setOffline(false);await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.',{timeout:15000});
    await student.locator('#submit').click();await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Entrega confirmada'));check(await student.locator('#answer0').isDisabled(),'Entrega bloquea edición');
    await page.locator('#stop').click();await page.locator('#reviewPanel').waitFor({state:'visible'});await page.locator('#publish').click();await student.locator('#leaderboard').waitFor({state:'visible',timeout:15000});check((await student.locator('#ranking').textContent()).includes('pts'),'Tabla de estudiante');
    for(const width of [320,390,1366,3840]){await student.setViewportSize({width,height:900});check(await student.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Sin desborde a '+width);await page.setViewportSize({width,height:900});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Docente sin desborde a '+width);}
    const out=path.join(ROOT,'test-results/bachillerato');fs.mkdirSync(out,{recursive:true});await student.setViewportSize({width:1366,height:768});await student.screenshot({path:path.join(out,'alumno.png'),fullPage:true});await page.setViewportSize({width:1366,height:768});await page.screenshot({path:path.join(out,'docente.png'),fullPage:true});
    await page.goto(origin+'/estudiantes/bachillerato/presentacion.html');for(let i=0;i<7;i++){check(await page.locator('[data-slide]:visible').count()===1,'Presentación una pantalla '+i);if(i<6)await page.locator('#next').click();}
    await student.goto(origin+'/estudiantes/bachillerato/');await student.locator('#leave').click();await student.locator('#studentCreate').click();await student.locator('#setup').waitFor({state:'visible'});check(student.url().includes('estudiante=1'),'Crear desde portada conserva sesión estudiante');await student.locator('#createForm button').click();await student.locator('#hostGame').waitFor({state:'visible'});const ownedCode=(await student.locator('#roomCode').textContent()).trim();await student.reload();await student.locator('#hostGame').waitFor({state:'visible'});check((await student.locator('#roomCode').textContent()).trim()===ownedCode,'Anfitrión estudiante retoma al recargar');
    for(const width of [320,390,1366,3840]){await student.setViewportSize({width,height:900});check(await student.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Anfitrión estudiante sin desborde a '+width);}
    const projection=await students.newPage();projection.on('pageerror',e=>errors.push(e.message));await projection.goto(new URL(await student.locator('#project').getAttribute('href'),student.url()).href);await projection.locator('#waiting').waitFor({state:'visible'});check((await projection.locator('#roomCode').textContent()).trim()===ownedCode,'Proyección usa sesión del anfitrión estudiante');await projection.close();
    // NM4 en el navegador: el docente abre la sala de nivel, entran 45 y la pantalla los muestra sin tapar el QR.
    const withActor=async(actor,options={viewport:{width:1366,height:768}})=>{const c=await browser.newContext(options);await c.addInitScript(a=>window.QA_ACTOR=a,actor);await c.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body:fakeSdk}));return c;};
    const teachers=await withActor('lvl'),lvl=await teachers.newPage();lvl.on('pageerror',e=>errors.push(e.message));
    await lvl.goto(origin+'/estudiantes/bachillerato/docente.html');await lvl.locator('#setup').waitFor({state:'visible'});check((await lvl.locator('#course option:checked').textContent()).includes('4.º medio · todos los cursos'),'El panel propone la sala NM4 primero');
    await lvl.locator('#createForm button').click();await lvl.locator('#hostGame').waitFor({state:'visible'});const nmCode=(await lvl.locator('#roomCode').textContent()).trim();check((await lvl.locator('#roomInfo').textContent()).includes('4.º medio'),'La sala NM4 se rotula con su curso');
    check((await Promise.all(ids.map(u=>call(origin,'join',u,{code:nmCode})))).every(x=>x.status===200),'45 ingresos a la sala del navegador');
    await lvl.waitForFunction(n=>document.querySelectorAll('#participants [data-uid]').length===n,N,{timeout:15000});check(true,'El panel docente lista a los 45');
    const wall=await teachers.newPage();wall.on('pageerror',e=>errors.push(e.message));await wall.goto(new URL(await lvl.locator('#project').getAttribute('href'),lvl.url()).href);
    await wall.waitForFunction(n=>document.querySelectorAll('#screenPlayers [data-uid]').length===n,N,{timeout:15000});await wall.waitForFunction(qrReady,null,{timeout:8000});
    for(const [w,h] of [[1366,768],[1920,1080],[3840,2160]]){await wall.setViewportSize({width:w,height:h});check(await wall.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Pantalla NM4 sin desborde a '+w);const qr=await wall.locator('#qr').boundingBox(),tilesBox=await wall.locator('#roomCode').boundingBox();check(qr&&tilesBox&&qr.y+qr.height<=h&&tilesBox.y+tilesBox.height<=h,'QR y código a la vista sin desplazar a '+w+'×'+h);}
    await wall.setViewportSize({width:1920,height:1080});await wall.screenshot({path:path.join(out,'pantalla-nm4-45.png'),fullPage:true});await lvl.screenshot({path:path.join(out,'docente-nm4-45.png'),fullPage:true});
    const phones=await withActor('n3',{viewport:{width:390,height:844},isMobile:true,hasTouch:true}),phone=await phones.newPage();phone.on('pageerror',e=>errors.push(e.message));
    await phone.goto(origin+'/bachillerato/?sala='+nmCode);await phone.locator('#waiting').waitFor({state:'visible'});check((await phone.locator('#roomInfo').textContent()).includes('4.º medio'),'Celular de 4.º entra por el QR a la sala NM4');
    await phone.screenshot({path:path.join(out,'celular-espera.png'),fullPage:true});
    await lvl.locator('#chooseLetter').fill('P');await lvl.locator('#startForm button').click();await phone.locator('#answer0').waitFor({state:'visible',timeout:15000});check((await phone.locator('#letter').textContent()).trim()==='P'&&(await phone.locator('#answer0').getAttribute('placeholder')).startsWith('P'),'El celular muestra la letra de la ronda');
    await phone.locator('#answer0').fill('Pablo');await phone.locator('#answer0').press('Enter');check(await phone.evaluate(()=>document.activeElement?.id==='answer1'),'Enter pasa a la casilla siguiente');
    check(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Celular sin desborde durante la ronda');await phone.screenshot({path:path.join(out,'celular-ronda.png'),fullPage:true});
    await wall.locator('#round').waitFor({state:'visible',timeout:15000});await wall.waitForFunction(()=>/de 45/.test(document.querySelector('#progressText').textContent),null,{timeout:15000});check(true,'La pantalla cuenta las entregas de los 45');await wall.screenshot({path:path.join(out,'pantalla-ronda.png')});
    await phones.close();await teachers.close();
    check(errors.length===0,'Sin errores JS: '+errors.join('; '));await context.close();await students.close();
   }finally{await browser.close();}
  }
  console.log('Bachillerato lector: '+checks+' comprobaciones aprobadas; 42 ingresos de 2.º y sala NM4 con 45 ingresos, entregas y revisiones concurrentes con controlador HTTP real.');
 }finally{await new Promise(r=>server.close(r));}
}
module.exports={harness,call};if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
