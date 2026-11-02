'use strict';
// Verificación en producción exclusivamente con identidades y sala ficticias.
// Solo elimina las UID y el código creados por esta ejecución y relee la ausencia.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const admin=require('firebase-admin'),{chromium}=require('playwright'),{getAccessToken}=require('./firebase-maintenance-db');
const {call}=require('./audit-simce-bachillerato');
const ORIGIN=process.env.BACHILLERATO_QA_ORIGIN||'https://www.estudiacest.com',BASE='plataforma_estudiantes',DATABASE='https://estudiacest-default-rtdb.firebaseio.com',APIKEY='AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w';
function fakeRun(){const n=String(99000000+crypto.randomInt(999999));let sum=0,f=2;for(const d of [...n].reverse()){sum+=Number(d)*f;f=f===7?2:f+1;}const k=11-sum%11;return n+(k===11?'0':k===10?'k':k);}
async function main(){
 const app=admin.initializeApp({projectId:'estudiacest',databaseURL:DATABASE,credential:{getAccessToken:async()=>({access_token:getAccessToken(),expires_in:3600})}},'bachillerato-production-'+Date.now());const db=app.database(),auth=app.auth();
 const prefix='qa-bach-'+crypto.randomUUID().slice(0,12),people=[],created=[],rooms=[];let browser,checks=0;
 const check=(v,m)=>{assert.ok(v,m);checks++;};
 async function request(action,person,body={},get=false){const r=await call(ORIGIN,action,person.token,body,get);return r;}
 async function signIn(p){const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+APIKEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:p.email,password:p.password,returnSecureToken:true})});const result=await r.json();assert.equal(r.status,200,'Autenticación de cuenta ficticia');p.token=result.idToken;}
 try{
  for(let i=0;i<44;i++)people.push({uid:prefix+'-'+i,run:fakeRun(),password:crypto.randomBytes(24).toString('base64url'),index:i});
  people.forEach(p=>p.email=p.run+'@est.estudiacest.com');
  for(let offset=0;offset<people.length;offset+=6){await Promise.all(people.slice(offset,offset+6).map(async p=>{await auth.createUser({uid:p.uid,email:p.email,password:p.password,displayName:'PRUEBA FICTICIA BACH '+p.index});created.push(p.uid);await db.ref(BASE+'/estudiantes/'+p.uid).set({nombre:'Ficticio'+p.index+' QA',curso:p.index===43?'2B-HC':'2A-HC',rut:p.run,run:p.run,programa:'simce',perfil_completo:true,password_changed:true,activo:true,ocultarDeCasas:true,qa:true});await signIn(p);}));}
  console.log('44 cuentas ficticias preparadas.');
  const host=people[42],students=people.slice(0,42);await db.ref(BASE).update({['admins/'+host.uid]:true,['docentes/'+host.uid]:{cursos:['2A-HC'],superadmin:false}});
  const create=await request('create',host,{course:'2A-HC'});check(create.status===200,'Sala real creada');const code=create.data.code;rooms.push(code);
  check((await request('join',people[43],{code})).status===403,'Base real rechaza otro curso');
  let started=Date.now();const joined=await Promise.all(students.map(p=>request('join',p,{code})));check(joined.every(r=>r.status===200),'42 ingresos simultáneos reales');const joinMs=Date.now()-started;
  const hostState=(await request('state',host,{code,host:1},true)).data;check(hostState.count===42,'42 identidades distintas confirmadas');
  check((await request('start',host,{code,mode:'classic',letter:'M',categories:['Nombre','Animal','Lugar'],seconds:120})).status===200,'Primera ronda real');
  started=Date.now();const writes=await Promise.all(students.map(p=>request('save',p,{code,round:1,version:0,requestId:crypto.randomUUID(),answers:['Mario','Mono','Maule'],final:true})));check(writes.every(r=>r.status===200),'42 envíos simultáneos reales');const saveMs=Date.now()-started;
  const saved=(await db.ref(BASE+'/bachillerato/salas/'+code+'/rounds/1/answers').once('value')).val();check(Object.keys(saved).length===42&&Object.values(saved).every(r=>r.submitted===true&&r.completada===true),'42 entregas releídas en Firebase');
  const publicState=(await request('state',students[0],{code},true)).data;check(!publicState.players&&!publicState.answers&&!publicState.guide,'Respuesta real protege a los compañeros');
  check((await request('stop',host,{code,round:1})).status===200,'Cierre real');check((await request('publish',host,{code,round:1})).status===200,'Puntos reales publicados');
  const table=(await request('state',students[0],{code},true)).data;check(table.ranking.length===42&&table.ranking.every(p=>p.points===15&&p.rank===1),'42 jugadores empatados con cálculo de servidor');
  console.log(JSON.stringify({stage:'concurrencia-confirmada',participants:42,joinMs,saveMs}));
  browser=await chromium.launch({headless:true});const teacherContext=await browser.newContext({viewport:{width:1366,height:768}}),studentContext=await browser.newContext({viewport:{width:1366,height:768}});
  const teacher=await teacherContext.newPage(),student=await studentContext.newPage(),errors=[];teacher.on('pageerror',e=>errors.push(e.message));student.on('pageerror',e=>errors.push(e.message));
  await student.goto(ORIGIN+'/estudiantes/bachillerato/?sala='+code);await student.locator('#loginLink').click();await student.locator('#rutInput').fill(students[0].run);await student.locator('#passInput').fill(students[0].password);await student.locator('#loginForm button[type=submit]').click();await student.waitForURL('**/estudiantes/bachillerato/**',{timeout:30000});await student.locator('#leaderboard').waitFor({state:'visible',timeout:30000});check(await student.locator('#ranking li').count()===42,'Ingreso común real y tabla de 42 en Chromebook');
  await teacher.goto(ORIGIN+'/estudiantes/bachillerato/docente.html?sala='+code);await teacher.locator('#email').fill(host.email);await teacher.locator('#password').fill(host.password);await teacher.locator('#teacherLogin button').click();await teacher.locator('#hostGame').waitFor({state:'visible',timeout:30000});check((await teacher.locator('#roomInfo').textContent()).includes('42 participantes'),'Panel docente real y sesión separada');
  await teacher.locator('#mode').selectOption('reading');await teacher.locator('#readingChoice').selectOption('0');await teacher.locator('#startForm button').click();await student.locator('#reading').waitFor({state:'visible',timeout:15000});
  await student.locator('#answer0').fill('Se levanta y le indica el asiento.');await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.');await student.reload();await student.locator('#answer0').waitFor({state:'visible'});check((await student.locator('#answer0').inputValue()).includes('Se levanta'),'Guardado real y recarga');
  await studentContext.setOffline(true);await student.locator('#answer1').fill('Pasa de mirar afuera a ayudar a la señora.');await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('conserva')||document.querySelector('#saveStatus').textContent.includes('Failed')||document.querySelector('#saveStatus').textContent.includes('fetch'),{timeout:10000}).catch(()=>{});await studentContext.setOffline(false);await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.',{timeout:20000});
  await student.locator('#answer2').fill('Mantiene la ayuda durante el trayecto.');await student.locator('#submit').click();await student.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Entrega confirmada'));check(await student.locator('#answer0').isDisabled(),'Entrega real confirmada y bloqueada');
  const response=(await db.ref(BASE+'/bachillerato/salas/'+code+'/rounds/2/answers/'+students[0].uid).once('value')).val();check(response.answers[1].includes('ayudar')&&response.submitted&&response.completada,'Reconexión conserva texto y entrega real');
  await teacher.locator('#stop').click();await teacher.locator('#reviewPanel').waitFor({state:'visible'});await teacher.locator('.review-item button').first().click();await teacher.getByRole('button',{name:/^Guardar (revisión|cambios)$/}).click();await teacher.waitForFunction(()=>document.querySelector('.review-item').textContent.includes('Revisión guardada'));await teacher.locator('#publish').click();await student.waitForFunction(()=>document.querySelector('#myPoints').textContent.includes('30 puntos'),{timeout:15000});check((await student.locator('#ranking').textContent()).includes('45 pts'),'Revisión docente y suma real en estudiante');
  const popup=await teacherContext.newPage();await popup.goto(ORIGIN+'/estudiantes/bachillerato/pantalla.html?sala='+code);await popup.locator('#game').waitFor({state:'visible'});check(await popup.locator('#ranking li').count()===42,'Proyección reutiliza sesión docente');check(await popup.locator('textarea').count()===0,'Proyección no muestra respuestas privadas');
  for(const width of [320,390,1366,3840]){await student.setViewportSize({width,height:900});check(await student.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Alumno sin desborde '+width);await teacher.setViewportSize({width,height:900});check(await teacher.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Docente sin desborde '+width);}
  const out=path.resolve(__dirname,'../test-results/bachillerato');fs.mkdirSync(out,{recursive:true});await teacher.setViewportSize({width:1366,height:768});await student.setViewportSize({width:1366,height:768});await student.screenshot({path:path.join(out,'produccion-alumno.png'),fullPage:true});await teacher.screenshot({path:path.join(out,'produccion-docente.png'),fullPage:true});await popup.screenshot({path:path.join(out,'produccion-proyeccion.png'),fullPage:true});
  await teacher.locator('#finish').click();await teacher.waitForFunction(()=>document.querySelector('#hostStatus').textContent==='Partida terminada');
  for(const route of ['/','/admin/','/estudiantes/','/paes/','/nm3/','/nm4/'])check((await fetch(ORIGIN+route)).ok,'Portada disponible '+route);
  for(const route of ['/api/_simce-bachillerato','/api/_simce-bachillerato-catalog','/api/_simce-bachillerato.js','/api/_simce-bachillerato-catalog.js'])check((await fetch(ORIGIN+route)).status===404,'Fuente privada '+route);
  check(errors.length===0,'Sin errores JS: '+errors.join(';'));
  console.log(JSON.stringify({checks,participants:42,joinMs,saveMs,realDatabase:true,browserLogin:true,origin:ORIGIN}));
 }finally{
  if(browser)await browser.close();
  for(const code of rooms){await db.ref(BASE+'/bachillerato/salas/'+code).remove();check(!(await db.ref(BASE+'/bachillerato/salas/'+code).once('value')).exists(),'Sala ficticia eliminada');}
  for(const uid of created){await db.ref(BASE).update({['estudiantes/'+uid]:null,['admins/'+uid]:null,['docentes/'+uid]:null,['bachillerato/docentes/'+uid]:null});await auth.deleteUser(uid);check(!(await db.ref(BASE+'/estudiantes/'+uid).once('value')).exists(),'Perfil ficticio eliminado');}
  console.log('Limpieza confirmada: '+rooms.length+' sala(s), '+created.length+' identidades ficticias.');await app.delete();
 }
}
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
