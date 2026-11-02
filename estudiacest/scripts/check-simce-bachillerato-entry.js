'use strict';
// Reproduce la cuenta creadora docente sin perfil de alumno, con Auth real.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {getAccessToken}=require('./firebase-maintenance-db');
const ORIGIN='https://www.estudiacest.com',DB='https://estudiacest-default-rtdb.firebaseio.com',BASE='plataforma_estudiantes',AUTH='https://identitytoolkit.googleapis.com/v1/projects/estudiacest';
function fakeRun(){const d=String(99000000+crypto.randomInt(999999));let s=0,f=2;for(const c of [...d].reverse()){s+=Number(c)*f;f=f===7?2:f+1;}const n=11-s%11;return d+(n===11?'0':n===10?'k':n);}
async function main(){
 const token=getAccessToken(),prefix='qa-bach-entry-'+crypto.randomUUID().slice(0,12),out=path.resolve(__dirname,'../test-results/bachillerato-entry',prefix);fs.mkdirSync(out,{recursive:true});
 const fixture={users:[],rooms:[],cleaned:false};const journal=()=>fs.writeFileSync(path.join(out,'fixtures.json'),JSON.stringify(fixture,null,2),'utf8');journal();
 const report={checks:[],consoleErrors:[],pageErrors:[],httpErrors:[],failedRequests:[],cleanup:false};let browser;
 const check=(v,name)=>{assert.ok(v,name);report.checks.push(name);};
 async function request(url,method='GET',body){for(let n=0;n<4;n++){try{const r=await fetch(url,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});const data=await r.json();if(!r.ok){const e=Object.assign(new Error('HTTP '+r.status+' '+(data.error?.message||'Solicitud fallida')),{status:r.status});throw e;}return data;}catch(e){if(n===3||e.status&&e.status<500&&e.status!==429)throw e;await new Promise(r=>setTimeout(r,1000*(n+1)));}}}
 const db=(p,method='GET',body)=>request(DB+'/'+p+'.json',method,body);
 function watch(p,label){p.on('pageerror',e=>report.pageErrors.push({page:label,message:e.message}));p.on('console',m=>{if(m.type()==='error'&&!p._closing)report.consoleErrors.push({page:label,message:m.text().slice(0,200)});});p.on('response',r=>{if(r.status()>=400&&!p._closing)report.httpErrors.push({page:label,path:new URL(r.url()).pathname,status:r.status()});});p.on('requestfailed',r=>{if(!p._closing)report.failedRequests.push({page:label,path:new URL(r.url()).pathname,error:r.failure()?.errorText});});}
 const users=Array.from({length:3},(_,i)=>({uid:prefix+'-'+i,run:fakeRun(),password:crypto.randomBytes(24).toString('base64url')}));users.forEach(p=>p.email=p.run+'@est.estudiacest.com');
 try{
  for(const [i,p]of users.entries()){
   await request(AUTH+'/accounts','POST',{localId:p.uid,email:p.email,password:p.password,displayName:'PRUEBA FICTICIA ENTRADA '+i});fixture.users.push(p.uid);journal();
   if(i!==0)await db(BASE+'/estudiantes/'+p.uid,'PUT',{nombre:'Ficticio entrada '+i,rut:p.run,run:p.run,curso:i===1?'2B-HC':'2A-HC',activo:true,programa:'simce',perfil_completo:true,password_changed:true,qa:true,ocultarDeCasas:true});
  }
  const [owner,student,wrong]=users;await db(BASE,'PATCH',{['admins/'+owner.uid]:true,['docentes/'+owner.uid]:{superadmin:true}});
  check(await db(BASE+'/estudiantes/'+owner.uid)===null,'Creador docente real sin perfil de alumno');
  browser=await chromium.launch({headless:true});const context=await browser.newContext(),teacher=await context.newPage();watch(teacher,'docente');
  await teacher.goto(ORIGIN+'/estudiantes/bachillerato/docente.html');await teacher.locator('#email').fill(owner.email);await teacher.locator('#password').fill(owner.password);await teacher.locator('#teacherLogin button').click();await teacher.locator('#setup').waitFor({state:'visible'});await teacher.locator('#course').selectOption('2B-HC');await teacher.locator('#createForm button').click();await teacher.locator('#hostGame').waitFor({state:'visible'});const code=(await teacher.locator('#roomCode').textContent()).trim();fixture.rooms.push(code);journal();
  const playerDoor=await context.newPage();watch(playerDoor,'creador por entrada de jugadores');let ownerJoins=0;playerDoor.on('request',r=>{if(r.url().includes('bachillerato-join'))ownerJoins++;});
  await playerDoor.goto(ORIGIN+'/estudiantes/bachillerato/');await playerDoor.locator('#login').waitFor({state:'visible'});
  // Reproduce una sesión docente heredada en la app de jugadores, sin inventar un alumno.
  await playerDoor.evaluate(async({email,password})=>{await firebase.auth().signInWithEmailAndPassword(email,password);},{email:owner.email,password:owner.password});await playerDoor.locator('#join').waitFor({state:'visible'});await playerDoor.locator('#code').fill(code);await playerDoor.locator('#joinForm button').click();await playerDoor.locator('#hostGame').waitFor({state:'visible'});
  check(playerDoor.url().includes('/docente.html?sala='+code),'Pegar código como creador abre el panel correcto');
  await playerDoor.goto(ORIGIN+'/estudiantes/bachillerato/?sala='+code);await playerDoor.locator('#hostGame').waitFor({state:'visible'});check(playerDoor.url().includes('/docente.html?sala='+code),'Retomar automáticamente reconoce al creador');check(ownerJoins===0,'Creador no envía join como alumno ni genera 403');
  check(await db(BASE+'/bachillerato/salas/'+code+'/players')===null,'Docente no agregado como jugador');
  async function login(p,label){const c=await browser.newContext(),page=await c.newPage();watch(page,label);await page.goto(ORIGIN+'/estudiantes/bachillerato/?sala='+code);await page.locator('#loginLink').click();await page.locator('#rutInput').fill(p.run);await page.locator('#passInput').fill(p.password);await page.locator('#loginForm button[type=submit]').click();await page.waitForURL('**/estudiantes/bachillerato/**');return page;}
  const rightPage=await login(student,'alumno 2B');await rightPage.locator('#waiting').waitFor({state:'visible'});check((await rightPage.locator('#roomInfo').textContent()).includes('2B-HC'),'Alumno de 2B entra normalmente');
  const wrongPage=await login(wrong,'alumno 2A');await wrongPage.waitForFunction(()=>document.querySelector('#notice').textContent.includes('Tu cuenta corresponde a 2A-HC'));check((await wrongPage.locator('#notice').textContent()).includes('2B-HC'),'Cuenta 2A recibe explicación de la sala 2B sin POST rechazado');check((await wrongPage.locator('#teacherAccess').getAttribute('href')).includes(code),'Enlace docente conserva el código');
  const wrongToken=await wrongPage.evaluate(()=>firebase.auth().currentUser.getIdToken());const denied=await fetch(ORIGIN+'/api/estudiantes?action=bachillerato-join',{method:'POST',headers:{Authorization:'Bearer '+wrongToken,'Content-Type':'application/json'},body:JSON.stringify({code})});check(denied.status===403,'Servidor sigue rechazando alumnos de otro curso si omiten la comprobación previa');
  const players=await db(BASE+'/bachillerato/salas/'+code+'/players');check(Object.keys(players).length===1&&!!players[student.uid],'Solo el alumno autorizado integra la sala');
  await teacher.locator('#chooseLetter').fill('M');await teacher.locator('#categories').fill('Nombre\nAnimal\nLugar');await teacher.locator('#startForm button').click();await rightPage.locator('#answer0').waitFor({state:'visible'});for(const [i,text]of ['Mario','Mono','Maule'].entries())await rightPage.locator('#answer'+i).fill(text);await rightPage.locator('#submit').click();await rightPage.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Entrega confirmada'));
  await teacher.locator('#stop').click();await teacher.locator('#reviewPanel').waitFor({state:'visible'});await teacher.locator('#publish').click();await rightPage.waitForFunction(()=>document.querySelector('#myPoints').textContent.includes('30 puntos'));check(true,'Alumno autorizado guarda, entrega y recibe puntos');
  await teacher.locator('#finish').click();await teacher.waitForFunction(()=>document.querySelector('#hostStatus').textContent==='Partida terminada');
  check(report.consoleErrors.length===0&&report.pageErrors.length===0&&report.httpErrors.length===0&&report.failedRequests.length===0,'Flujos normales sin errores de consola, JS, HTTP ni recursos fallidos');
  await playerDoor.screenshot({path:path.join(out,'creador-panel.png'),fullPage:true});await wrongPage.screenshot({path:path.join(out,'curso-distinto.png'),fullPage:true});console.log(JSON.stringify({checks:report.checks.length,consoleErrors:report.consoleErrors.length,pageErrors:report.pageErrors.length,httpErrors:report.httpErrors.length,failedRequests:report.failedRequests.length}));
 }catch(e){report.failure=e.message;console.error(e.message);process.exitCode=1;}
 finally{
  if(browser){for(const c of browser.contexts())for(const p of c.pages())p._closing=true;await browser.close();}
  try{if(fixture.users.length){const removed=await request(AUTH+'/accounts:batchDelete','POST',{localIds:fixture.users,force:true});assert.ok(!removed.errors?.length);}const patch={};for(const uid of fixture.users)for(const branch of ['estudiantes','admins','docentes','bachillerato/docentes'])patch[branch+'/'+uid]=null;for(const code of fixture.rooms)patch['bachillerato/salas/'+code]=null;await db(BASE,'PATCH',patch);const lookup=await request(AUTH+'/accounts:lookup','POST',{localId:fixture.users});assert.equal((lookup.users||[]).length,0);for(const uid of fixture.users)assert.equal(await db(BASE+'/estudiantes/'+uid),null);for(const code of fixture.rooms)assert.equal(await db(BASE+'/bachillerato/salas/'+code),null);fixture.cleaned=true;journal();report.cleanup=true;console.log('Limpieza confirmada de 3 cuentas y una sala ficticias.');}catch(e){report.cleanupError=e.message;process.exitCode=1;console.error(e.message);}
  fs.writeFileSync(path.join(out,'resultado.json'),JSON.stringify(report,null,2),'utf8');console.log('Evidencia: '+path.join(out,'resultado.json'));
 }
}
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
