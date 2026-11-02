'use strict';
// Flujo real con 33 sesiones independientes; solo cuentas y salas ficticias.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {chromium}=require('playwright');
const {getAccessToken}=require('./firebase-maintenance-db');
const ORIGIN='https://www.estudiacest.com';
const DATABASE='https://estudiacest-default-rtdb.firebaseio.com';
const AUTH='https://identitytoolkit.googleapis.com/v1/projects/estudiacest';
const BASE='plataforma_estudiantes';
const COUNT=33;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function batch(values,size,fn){const out=[];for(let i=0;i<values.length;i+=size){const results=await Promise.allSettled(values.slice(i,i+size).map(fn));const failed=results.find(r=>r.status==='rejected');out.push(...results.filter(r=>r.status==='fulfilled').map(r=>r.value));if(failed)throw failed.reason;}return out;}
function run(){const digits=String(99000000+crypto.randomInt(999999));let sum=0,factor=2;for(const d of [...digits].reverse()){sum+=Number(d)*factor;factor=factor===7?2:factor+1;}const n=11-sum%11;return digits+(n===11?'0':n===10?'k':n);}
async function main(){
 const accessToken=getAccessToken(),prefix='qa-bach33-'+crypto.randomUUID().slice(0,12);
 const dir=path.resolve(__dirname,'../test-results/bachillerato-33',prefix);fs.mkdirSync(dir,{recursive:true});
 const fixture={prefix,users:[],rooms:[],cleaned:false};
 const journal=()=>fs.writeFileSync(path.join(dir,'fixtures.json'),JSON.stringify(fixture,null,2),'utf8');journal();
 const people=Array.from({length:COUNT+1},(_,i)=>({uid:prefix+'-'+i,run:run(),password:crypto.randomBytes(24).toString('base64url'),name:'Ficticio'+i+' QA'}));
 people.forEach(p=>p.email=p.run+'@est.estudiacest.com');
 const report={participants:COUNT,checks:[],consoleErrors:[],pageErrors:[],warnings:[],failedRequests:[],httpErrors:[],expectedNetworkErrors:[],cleanup:false};
 let browser,teacher,code;
 const check=(v,name)=>{assert.ok(v,name);report.checks.push(name);};
 async function rest(url,method='GET',body){
  for(let attempt=0;attempt<4;attempt++){
   try{
    const response=await fetch(url,{method,headers:{Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});
    const data=await response.json();
    if(!response.ok){const error=Object.assign(new Error('HTTP '+response.status+' '+(data.error?.message||data.error||'Solicitud fallida')),{status:response.status});if(response.status<500&&response.status!==429)error.permanent=true;throw error;}return data;
   }catch(e){if(e.permanent||attempt===3)throw e;await pause(1000*(attempt+1));}
  }
 }
 const database=(p,method='GET',body)=>rest(DATABASE+'/'+p+'.json',method,body);
 function watch(page,label){
  const expected=()=>page._expectedUntil>Date.now();
  const safe=s=>String(s).replace(/eyJ[A-Za-z0-9_.-]{30,}/g,'[token]').slice(0,300);
  page.on('pageerror',e=>report.pageErrors.push({page:label,message:safe(e.message)}));
  page.on('console',msg=>{if(!['error','warning'].includes(msg.type()))return;const record={page:label,message:safe(msg.text())};if(expected())report.expectedNetworkErrors.push(record);else if(msg.type()==='error')report.consoleErrors.push(record);else report.warnings.push(record);});
  page.on('requestfailed',r=>{const record={page:label,path:new URL(r.url()).pathname,error:r.failure()?.errorText};(expected()?report.expectedNetworkErrors:report.failedRequests).push(record);});
  page.on('response',r=>{if(r.status()>=400){const record={page:label,path:new URL(r.url()).pathname,status:r.status()};(expected()?report.expectedNetworkErrors:report.httpErrors).push(record);}});
 }
 const saved=page=>page.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.',null,{timeout:30000});
 const delivered=page=>page.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Entrega confirmada'),null,{timeout:30000});
 const round=async(p,n)=>{await p.waitForFunction(n=>document.querySelector('#roundNumber').textContent==='RONDA '+n,n,{timeout:20000});};
 const answer=async(p,values,final=true)=>{for(let i=0;i<values.length;i++)await p.locator('#answer'+i).fill(values[i]);if(final){await p.locator('#submit').click();await delivered(p);}else await saved(p);};
 async function start(mode,reading=0,letter='M'){
  await teacher.locator('#mode').selectOption(mode);
  if(mode==='reading')await teacher.locator('#readingChoice').selectOption(String(reading));
  else{await teacher.locator('#chooseLetter').fill(letter);await teacher.locator('#categories').fill('Nombre\nAnimal\nLugar');}
  await teacher.locator('#seconds').selectOption('180');await teacher.locator('#startForm button').click();
 }
 async function closeRound(){await teacher.locator('#stop').click();await teacher.locator('#reviewPanel').waitFor({state:'visible'});}
 async function publish(){await teacher.locator('#publish').click();await teacher.locator('#startPanel').waitFor({state:'visible'});}
 try{
  await batch(people,6,async(p,i)=>{
   await rest(AUTH+'/accounts','POST',{localId:p.uid,email:p.email,password:p.password,displayName:p.name});fixture.users.push(p.uid);journal();
   await database(BASE+'/estudiantes/'+p.uid,'PUT',{nombre:p.name,rut:p.run,run:p.run,curso:'2A-HC',programa:'simce',perfil_completo:true,password_changed:true,activo:true,qa:true,ocultarDeCasas:true});
  });
  const host=people[COUNT];await database(BASE,'PATCH',{['admins/'+host.uid]:true,['docentes/'+host.uid]:{cursos:['2A-HC'],superadmin:false}});
  console.log('Preparadas 33 cuentas de estudiante y una cuenta docente ficticias.');
  browser=await chromium.launch({headless:true});
  const hostContext=await browser.newContext({viewport:{width:1366,height:768}});teacher=await hostContext.newPage();watch(teacher,'docente');
  await teacher.goto(ORIGIN+'/estudiantes/bachillerato/docente.html');await teacher.locator('#email').fill(host.email);await teacher.locator('#password').fill(host.password);await teacher.locator('#teacherLogin button').click();await teacher.locator('#setup').waitFor({state:'visible'});
  await teacher.locator('#createForm button').click();await teacher.locator('#hostGame').waitFor({state:'visible'});code=(await teacher.locator('#roomCode').textContent()).trim();fixture.rooms.push(code);journal();
  const students=await batch(people.slice(0,COUNT),6,async(person)=>{
   const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage();watch(page,person.name);
   await page.goto(ORIGIN+'/');await page.locator('a[href="/estudiantes/bachillerato/"]').click();await page.locator('#loginLink').click();
   await page.locator('#rutInput').fill(person.run);await page.locator('#passInput').fill(person.password);await page.locator('#loginForm button[type=submit]').click();
   await page.waitForURL('**/estudiantes/bachillerato/**');await page.locator('#join').waitFor({state:'visible'});await page.locator('#code').fill(code);
   return {person,context,page};
  });
  check(students.length===COUNT,'33 sesiones independientes ingresan desde portada y RUT/contraseña');
  console.log('33 navegadores autenticados por el formulario habitual.');
  let time=Date.now();await Promise.all(students.map(async s=>{await s.page.locator('#joinForm button').click();await s.page.locator('#waiting').waitFor({state:'visible'});}));report.joinMs=Date.now()-time;
  await teacher.waitForFunction(()=>document.querySelector('#roomInfo').textContent.includes('33 participantes'));
  check(await teacher.locator('#participants span').count()===COUNT,'33 participantes distintos confirmados en el panel');
  console.log('Ingreso concurrente de 33 navegadores: '+report.joinMs+' ms.');
  const screenPromise=hostContext.waitForEvent('page');await teacher.locator('#project').click();const screen=await screenPromise;watch(screen,'proyección');await screen.locator('#game').waitFor({state:'visible'});
  await start('classic');await Promise.all(students.map(s=>round(s.page,1)));
  time=Date.now();await Promise.all(students.map(s=>answer(s.page,['María','Mono','Maule'])));report.submitMs=Date.now()-time;
  const initial=await database(BASE+'/bachillerato/salas/'+code+'/rounds/1/answers');
  check(Object.keys(initial).length===COUNT&&Object.values(initial).every(r=>r.submitted&&r.completada),'33 envíos reales con ambas marcas y respuestas releídas en Firebase');
  console.log('33 entregas por interfaz confirmadas: '+report.submitMs+' ms.');
  await closeRound();check(await teacher.locator('.review-item').count()===COUNT,'Las 33 respuestas aparecen para revisión');
  const first=teacher.locator('.review-item').filter({has:teacher.getByRole('heading',{name:people[0].name,exact:true})});await first.locator('select').first().selectOption('0');await first.getByRole('button',{name:'Guardar cambios',exact:true}).click();await first.getByRole('button',{name:'Revisión guardada',exact:true}).waitFor();await publish();
  await Promise.all(students.map(s=>s.page.locator('#leaderboard').waitFor({state:'visible'})));
  await screen.waitForFunction(()=>document.querySelectorAll('#ranking li').length===33);check(await screen.locator('#ranking li').count()===COUNT,'Proyección muestra la tabla de 33');
  check((await students[0].page.locator('#myPoints').textContent()).includes('10 puntos'),'Corrección docente llega al estudiante');
  await start('reading');await Promise.all(students.map(s=>round(s.page,2)));
  await answer(students[0].page,['Se levanta y le indica el asiento.','',''],false);
  await students[0].page.reload();await students[0].page.locator('#answer0').waitFor();check((await students[0].page.locator('#answer0').inputValue()).includes('Se levanta'),'Recarga conserva el borrador de lectura');
  const offline=students[0];offline.page._expectedUntil=Date.now()+60000;await offline.context.setOffline(true);await offline.page.locator('#answer1').fill('Deja de mirar afuera y ayuda a la señora.');await offline.page.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('conserva'));await offline.context.setOffline(false);await saved(offline.page);offline.page._expectedUntil=Date.now()+1500;
  check((await database(BASE+'/bachillerato/salas/'+code+'/rounds/2/answers/'+offline.person.uid)).answers[1].includes('ayuda'),'Reconexión confirma la respuesta local en el servidor');
  // Otro dispositivo escribe una versión nueva mientras la pestaña conserva una copia ya sincronizada.
  const stale=students[1];await answer(stale.page,['Versión inicial','',''],false);
  const token=await stale.page.evaluate(()=>firebase.auth().currentUser.getIdToken());
  const stateResponse=await fetch(ORIGIN+'/api/estudiantes?action=bachillerato-state&code='+code,{headers:{Authorization:'Bearer '+token}});const remote=await stateResponse.json();
  const update=await fetch(ORIGIN+'/api/estudiantes?action=bachillerato-save',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({code,round:2,version:remote.own.version,requestId:crypto.randomUUID(),answers:['Se levanta y cede su asiento.','',''],final:false})});check(update.ok,'Segundo dispositivo guarda otra versión');
  await stale.page.reload();await stale.page.locator('#answer0').waitFor();check((await stale.page.locator('#answer0').inputValue()).includes('cede'),'Un borrador local sincronizado no tapa una versión remota nueva');
  // Una segunda pestaña de la misma cuenta entrega; la primera debe mostrar la respuesta confirmada.
  const twin=await students[2].context.newPage();watch(twin,'segunda pestaña');await twin.goto(ORIGIN+'/estudiantes/bachillerato/?sala='+code);await answer(twin,['Se levanta y ofrece su asiento.','Cambia la indiferencia por ayuda; se levanta al notar la dificultad.','Mantiene su ayuda durante el viaje.']);
  await delivered(students[2].page);check((await students[2].page.locator('#answer0').inputValue()).includes('ofrece'),'La primera pestaña muestra el texto entregado desde la segunda');twin._expectedUntil=Infinity;await twin.close();
  await Promise.all(students.filter((_,i)=>i!==2).map(s=>answer(s.page,['Se levanta y le indica el asiento.','Deja de mirar afuera y ayuda a la señora.','Mantiene su ayuda durante el viaje.'])));
  await closeRound();check(await teacher.locator('.review-item').count()===COUNT,'33 lecturas conservadas y disponibles para revisión');
  for(const person of people.slice(0,COUNT)){
   const item=teacher.locator('.review-item').filter({has:teacher.getByRole('heading',{name:person.name,exact:true})});await item.getByRole('button',{name:'Todas logradas · 10',exact:true}).click();await item.getByRole('button',{name:'Guardar cambios',exact:true}).click();await item.getByRole('button',{name:'Revisión guardada',exact:true}).waitFor();
  }
  await publish();await students[0].page.waitForFunction(()=>document.querySelector('#myPoints').textContent.includes('30 puntos'));check((await students[0].page.locator('#ranking').textContent()).includes('40 pts'),'Puntos acumulados conservan la corrección de la primera ronda');
  console.log('Lectura, recarga, reconexión, doble pestaña y revisión de 33 estudiantes: aprobadas.');
  // Respuesta final de una ronda, ya recibida por el servidor, llega tarde al navegador.
  await start('classic',0,'Ñ');await Promise.all(students.map(s=>round(s.page,3)));const delayed=students[32];let release,committed;const gate=new Promise(r=>release=r),committedPromise=new Promise(r=>committed=r);let held=false;
  await delayed.page.route('**/api/estudiantes?**',async route=>{const r=route.request(),b=r.postDataJSON();if(!held&&r.url().includes('bachillerato-save')&&b?.round===3&&b.final){held=true;const response=await route.fetch();committed();await gate;await route.fulfill({response});}else await route.continue();});
  try{
   await answer(students[0].page,['Nicolás','Nutria','Nápoles']);for(let i=0;i<3;i++)await delayed.page.locator('#answer'+i).fill(['Ñandú','Ñu','Ñoqui'][i]);await delayed.page.locator('#submit').click();await committedPromise;
   await closeRound();const ene=teacher.locator('.review-item').filter({has:teacher.getByRole('heading',{name:people[0].name,exact:true})});check((await ene.locator('select').evaluateAll(xs=>xs.map(x=>x.value))).every(v=>v==='0'),'La propuesta de puntaje distingue Ñ de N');await publish();
   await start('reading',1);await round(delayed.page,4);const responsePromise=delayed.page.waitForResponse(r=>r.url().includes('bachillerato-save'));release();await responsePromise;
   await answer(delayed.page,['La propia marca.','Busca apurar la compra por escasez.','Faltan las condiciones y cantidad de botellas para evaluar la prueba.']);
   check((await database(BASE+'/bachillerato/salas/'+code+'/rounds/4/answers/'+delayed.person.uid)).submitted,'Respuesta tardía de otra ronda no bloquea la entrega nueva');
  }finally{release();}
  await closeRound();const last=teacher.locator('.review-item').filter({has:teacher.getByRole('heading',{name:people[32].name,exact:true})});await last.getByRole('button',{name:'Todas logradas · 10'}).click();await last.getByRole('button',{name:'Guardar cambios'}).click();await last.getByRole('button',{name:'Revisión guardada',exact:true}).waitFor();await publish();
  await teacher.locator('#finish').click();await teacher.waitForFunction(()=>document.querySelector('#hostStatus').textContent==='Partida terminada');
  await Promise.all(students.map(async(s,i)=>{const expected=i===32?'105 pts':i===0?'40 pts':'45 pts';await s.page.waitForFunction(expected=>document.querySelector('#ranking li.self strong')?.textContent===expected,expected,{timeout:20000});}));check(true,'Los 33 navegadores muestran sus puntos finales exactos');
  await students[0].page.reload();await students[0].page.waitForFunction(()=>document.querySelector('#rankingTitle').textContent==='¡Partida terminada!');check(await students[0].page.locator('#ranking li').count()===COUNT,'Recarga de partida terminada conserva sus 33 participantes y resultados');
  const noKeys=await students[0].page.evaluate(async()=>{const token=await firebase.auth().currentUser.getIdToken();const r=await fetch('/api/estudiantes?action=bachillerato-state&code='+new URLSearchParams(location.search).get('sala'),{headers:{Authorization:'Bearer '+token}});const data=await r.json();return !data.guide&&!data.answers&&!data.players;});check(noKeys,'Alumno no recibe pauta ni respuestas ajenas');
  for(const width of [320,390,1366,3840]){for(const [label,p]of [['alumno',students[0].page],['docente',teacher],['proyección',screen]]){await p.setViewportSize({width,height:900});check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' sin desborde a '+width);}}
  const recoveryContext=await browser.newContext(),recovery=await recoveryContext.newPage();watch(recovery,'recuperación de librerías');await recoveryContext.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body:''}));await recovery.goto(ORIGIN+'/estudiantes/bachillerato/');await recovery.locator('#reloadConnection').waitFor({state:'visible'});await recoveryContext.unrouteAll();await recovery.locator('#reloadConnection').click();await recovery.locator('#login').waitFor({state:'visible'});check(true,'Librerías ausentes permiten recargar y recuperar el ingreso sin excepción JS');recovery._expectedUntil=Infinity;await recoveryContext.close();
  await teacher.setViewportSize({width:1366,height:768});await students[0].page.setViewportSize({width:1366,height:768});await students[0].page.screenshot({path:path.join(dir,'alumno-final.png'),fullPage:true});await teacher.screenshot({path:path.join(dir,'docente-final.png'),fullPage:true});await screen.screenshot({path:path.join(dir,'proyeccion-final.png'),fullPage:true});
  await pause(2000);check(report.pageErrors.length===0,'Cero excepciones JavaScript en 33 estudiantes, docente y proyección');check(report.consoleErrors.length===0,'Cero errores inesperados de consola');check(report.failedRequests.length===0,'Cero solicitudes fallidas inesperadas');check(report.httpErrors.length===0,'Cero respuestas HTTP de error inesperadas');
  console.log(JSON.stringify({checks:report.checks.length,participants:COUNT,joinMs:report.joinMs,submitMs:report.submitMs,consoleErrors:report.consoleErrors.length,pageErrors:report.pageErrors.length,httpErrors:report.httpErrors.length,warnings:report.warnings.length}));
 }catch(e){report.failure=e.message;console.error(e.message);process.exitCode=1;}
 finally{
  if(browser){for(const context of browser.contexts())for(const page of context.pages())page._expectedUntil=Infinity;await browser.close();}
  try{
   if(fixture.users.length){const deleted=await rest(AUTH+'/accounts:batchDelete','POST',{localIds:fixture.users,force:true});assert.ok(!deleted.errors?.length,'Borrado de cuentas ficticias');}
   const patch={};for(const uid of fixture.users){for(const branch of ['estudiantes','admins','docentes','bachillerato/docentes'])patch[branch+'/'+uid]=null;}for(const room of fixture.rooms)patch['bachillerato/salas/'+room]=null;await database(BASE,'PATCH',patch);
   const lookup=fixture.users.length?await rest(AUTH+'/accounts:lookup','POST',{localId:fixture.users}):{};assert.equal((lookup.users||[]).length,0,'Cuentas ausentes en Auth');
   await batch(fixture.users,8,async uid=>assert.equal(await database(BASE+'/estudiantes/'+uid),null,'Perfil ficticio ausente'));for(const room of fixture.rooms)assert.equal(await database(BASE+'/bachillerato/salas/'+room),null,'Sala ficticia ausente');fixture.cleaned=true;journal();report.cleanup=true;console.log('Limpieza confirmada: '+fixture.users.length+' cuentas/perfiles y '+fixture.rooms.length+' sala(s) ficticias ausentes.');
  }catch(e){report.cleanupError=e.message;process.exitCode=1;console.error('Limpieza pendiente: '+e.message);}
  fs.writeFileSync(path.join(dir,'resultado.json'),JSON.stringify(report,null,2),'utf8');console.log('Evidencia: '+path.join(dir,'resultado.json'));
 }
}
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
