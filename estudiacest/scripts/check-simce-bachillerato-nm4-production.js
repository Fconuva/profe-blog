'use strict';
// Producción, solo con identidades y sala ficticias: 45 estudiantes de 4.º medio abren el QR,
// inician sesión con RUT y clave en el formulario habitual de /lecturas/ y vuelven a la sala NM4.
// Elimina únicamente las UID y la sala creadas por esta ejecución y relee su ausencia.
// Uso: node scripts/check-simce-bachillerato-nm4-production.js   (requiere OK de Francisco)
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const admin=require('firebase-admin'),{chromium}=require('playwright'),{getAccessToken}=require('./firebase-maintenance-db');
const {call}=require('./audit-simce-bachillerato');
const ORIGIN=process.env.BACHILLERATO_QA_ORIGIN||'https://www.estudiacest.com',BASE='plataforma_estudiantes',DATABASE='https://estudiacest-default-rtdb.firebaseio.com',APIKEY='AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w';
const NM4=['4A-TP','4B-TP','4C-TP','4D-TP','4E-TP','4A-HC','4B-HC'],COUNT=45,BATCH=9;
const PHONE={viewport:{width:390,height:844},isMobile:true,hasTouch:true};
function fakeRun(){const n=String(99000000+crypto.randomInt(999999));let sum=0,f=2;for(const d of [...n].reverse()){sum+=Number(d)*f;f=f===7?2:f+1;}const k=11-sum%11;return n+(k===11?'0':k===10?'k':k);}
const initialPassword=run=>run.replace(/[^0-9]/g,'').slice(0,6).padEnd(6,'0');
async function retry(fn,times=4){for(let n=1;;n++){try{return await fn(n);}catch(e){if(n>=times)throw e;console.warn('reintento '+n+': '+(e.code||String(e.message).slice(0,90)));await new Promise(r=>setTimeout(r,800*n));}}}

async function main(){
 const app=admin.initializeApp({projectId:'estudiacest',databaseURL:DATABASE,credential:{getAccessToken:async()=>({access_token:getAccessToken(),expires_in:3600})}},'bachillerato-nm4-'+Date.now());const db=app.database(),auth=app.auth();
 const prefix='qa-bach-nm4-'+crypto.randomUUID().slice(0,10),out=path.resolve(__dirname,'../test-results/bachillerato-nm4',prefix);fs.mkdirSync(out,{recursive:true});
 // Registro recuperable sin credenciales: si algo corta la ejecución, aquí están las UID y la sala por limpiar.
 const fixture={prefix,uids:[],rooms:[],cleaned:false};const journal=()=>fs.writeFileSync(path.join(out,'fixtures.json'),JSON.stringify(fixture,null,2),'utf8');journal();
 const report={checks:[],pageErrors:[],consoleErrors:[],serverErrors:[],timings:{}};
 const check=(v,m)=>{assert.ok(v,m);report.checks.push(m);console.log('ok  '+m);};
 let browser;
 try{
  // 45 de 4.º en los siete cursos: 40 con la clave inicial (6 primeros dígitos, perfil sin completar) y 5 con clave propia.
  const runs=new Set(),uniqueRun=()=>{let r;do r=fakeRun();while(runs.has(r));runs.add(r);return r;};
  const people=[];
  for(let i=0;i<COUNT;i++){const run=uniqueRun(),own=i%9===0;people.push({index:i,uid:`${prefix}-${i}`,run,email:run+'@est.estudiacest.com',curso:NM4[i%NM4.length],own,password:own?crypto.randomBytes(18).toString('base64url'):initialPassword(run)});}
  const secondRun=uniqueRun(),second={index:'2M',uid:prefix+'-2m',run:secondRun,email:secondRun+'@est.estudiacest.com',curso:'2A-HC',own:false,password:initialPassword(secondRun)};
  const host={index:'docente',uid:prefix+'-docente',email:prefix+'-docente@qa.estudiacest.invalid',password:crypto.randomBytes(18).toString('base64url')};
  const all=[...people,second,host];
  for(let o=0;o<all.length;o+=6){await Promise.all(all.slice(o,o+6).map(async p=>{
   // La UID va al registro antes del alta; si un intento creó la cuenta y no alcanzó a responder, el reintento la reconoce (la UID lleva el prefijo aleatorio de esta ejecución).
   fixture.uids.push(p.uid);journal();
   await retry(n=>auth.createUser({uid:p.uid,email:p.email,password:p.password,displayName:'PRUEBA FICTICIA BACH NM4'}).catch(e=>{if(n>1&&e.code==='auth/uid-already-exists')return;throw e;}));
   if(p===host)return;
   await retry(()=>db.ref(BASE+'/estudiantes/'+p.uid).set({nombre:'Ficticio'+p.index+' QA',curso:p.curso,rut:p.run,run:p.run,programa:/^[34]/.test(p.curso)?'paes':'simce',perfil_completo:p.own,password_changed:p.own,activo:true,ocultarDeCasas:true,qa:true,createdAt:Date.now(),createdBy:'qa-bachillerato-nm4'}));
  }));}
  await db.ref(BASE).update({['admins/'+host.uid]:true,['docentes/'+host.uid]:{cursos:NM4,superadmin:false}});
  const signIn=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+APIKEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:host.email,password:host.password,returnSecureToken:true})});host.token=(await signIn.json()).idToken;assert.ok(host.token,'Sesión docente ficticia');
  console.log(`${all.length} cuentas ficticias preparadas (${COUNT} de 4.º, 1 de 2.º, 1 docente).`);

  browser=await chromium.launch({headless:true});
  const watch=(page,who)=>{
   page.on('pageerror',e=>report.pageErrors.push(who+': '+e.message.slice(0,200)));
   page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({who,path:new URL(page.url()).pathname,text:m.text().slice(0,200)});});
   page.on('response',r=>{if(r.status()>=500)report.serverErrors.push(who+' '+r.status()+' '+r.url().replace(ORIGIN,'').slice(0,120));});
   page.on('dialog',d=>d.accept());
  };
  // Docente: ingresa con correo y contraseña, crea la sala NM4 y la proyecta.
  const teacherCtx=await browser.newContext({viewport:{width:1366,height:768}}),teacher=await teacherCtx.newPage();watch(teacher,'docente');
  await teacher.goto(ORIGIN+'/estudiantes/bachillerato/docente.html');await teacher.locator('#teacherLogin').waitFor({state:'visible',timeout:30000});
  await teacher.locator('#email').fill(host.email);await teacher.locator('#password').fill(host.password);await teacher.locator('#teacherLogin button').click();
  await teacher.locator('#setup').waitFor({state:'visible',timeout:30000});await teacher.waitForFunction(()=>document.querySelectorAll('#course option').length>0,null,{timeout:30000});
  check((await teacher.locator('#course option:checked').textContent()).includes('4.º medio · todos los cursos'),'El panel docente propone la sala de 4.º medio');
  await teacher.locator('#createForm button').click();await teacher.locator('#hostGame').waitFor({state:'visible',timeout:30000});
  const code=(await teacher.locator('#roomCode').textContent()).trim();fixture.rooms.push(code);journal();
  check(/^[A-Z0-9]{6}$/.test(code)&&(await teacher.locator('#roomInfo').textContent()).includes('4.º medio'),'Sala NM4 real creada desde el panel docente');
  check((await teacher.locator('#joinUrl').getAttribute('href')).endsWith('/bachillerato/?sala='+code),'El QR apunta a la dirección corta de la sala');
  const wall=await teacherCtx.newPage();watch(wall,'pantalla');await wall.setViewportSize({width:1920,height:1080});
  await wall.goto(new URL(await teacher.locator('#project').getAttribute('href'),teacher.url()).href);await wall.locator('#waiting').waitFor({state:'visible',timeout:30000});
  await wall.waitForFunction(()=>{const q=document.querySelector('#qr'),i=q&&q.querySelector('img'),c=q&&q.querySelector('canvas');return (i&&i.naturalWidth>0)||(c&&c.width>0);},null,{timeout:15000});
  check(true,'La pantalla proyectada muestra el QR');

  // Cada estudiante: abre el QR en el celular, «Ingresar con mi RUT», formulario habitual y vuelta a la sala.
  async function qrLogin(p,{wrongFirst=false,keep=false}={}){
   const context=await browser.newContext(PHONE),page=await context.newPage();watch(page,'estudiante '+p.index);const t0=Date.now();
   try{
    await page.goto(ORIGIN+'/bachillerato/?sala='+code);await page.locator('#loginLink').waitFor({state:'visible',timeout:30000});
    await page.locator('#loginLink').click();await page.waitForURL(/\/lecturas\//,{timeout:30000});await page.locator('#rutInput').waitFor({state:'visible',timeout:30000});
    if(wrongFirst){
     await page.locator('#rutInput').fill(p.run);await page.locator('#passInput').fill(initialPassword(p.run));await page.locator('#loginForm button[type=submit]').click();
     await page.waitForFunction(()=>document.body.innerText.includes('RUT o contraseña incorrectos'),null,{timeout:30000});p.rejectedInitial=new URL(page.url()).pathname.startsWith('/lecturas/');
    }
    await page.locator('#rutInput').fill(p.run);await page.locator('#passInput').fill(p.password);await page.locator('#loginForm button[type=submit]').click();
    await page.waitForURL(u=>u.pathname.startsWith('/estudiantes/bachillerato/'),{timeout:45000});
    if(/^4/.test(p.curso)){await page.locator('#waiting').waitFor({state:'visible',timeout:30000});p.finalUrl=page.url();p.ms=Date.now()-t0;}
    if(p.index===1)await page.screenshot({path:path.join(out,'celular-tras-ingreso.png'),fullPage:true});
    if(keep)return {context,page};
    await context.close();return null;
   }catch(e){await page.screenshot({path:path.join(out,'falla-'+p.index+'.png'),fullPage:true}).catch(()=>{});await context.close().catch(()=>{});throw e;}
  }
  const keepA=people.find(p=>!p.own),keepB=people.find(p=>p.own),sessions={},failures=[];let started=Date.now();
  for(let o=0;o<people.length;o+=BATCH){
   const slice=people.slice(o,o+BATCH),results=await Promise.allSettled(slice.map(p=>qrLogin(p,{wrongFirst:p===keepB,keep:p===keepA||p===keepB})));
   results.forEach((r,i)=>{if(r.status==='rejected')failures.push(slice[i].index+' ('+slice[i].curso+'): '+String(r.reason&&r.reason.message||r.reason).split('\n')[0].slice(0,160));else if(r.value)sessions[slice[i].index]=r.value;});
   console.log(`… ${Math.min(o+BATCH,people.length)} de ${people.length} ingresos por QR (${failures.length} fallas)`);
  }
  report.timings.loginTotalMs=Date.now()-started;const times=people.map(p=>p.ms).filter(Boolean).sort((a,b)=>a-b);report.timings.loginMedianMs=times[Math.floor(times.length/2)];report.timings.loginMaxMs=times[times.length-1];
  check(failures.length===0,'45 estudiantes de 4.º entran por el QR con RUT y clave'+(failures.length?': '+failures.join(' | '):''));
  check(people.every(p=>{const u=new URL(p.finalUrl);return u.pathname==='/estudiantes/bachillerato/'&&u.searchParams.get('sala')===code;}),'Los 45 vuelven a la sala con su código; ninguno queda en PAES TP ni en el formulario de perfil');
  check(people.filter(p=>!p.own).length===40,'40 entraron con los 6 primeros dígitos del RUT y el perfil sin completar');
  check(keepB.rejectedInitial===true,'Quien ya cambió su clave ve «RUT o contraseña incorrectos» con los 6 dígitos y entra con la suya');
  check(NM4.every(c=>people.some(p=>p.curso===c&&p.finalUrl)),'Entraron estudiantes de los siete cursos: '+NM4.join(', '));
  const hs=(await call(ORIGIN,'state',host.token,{code,host:1},true)).data;check(hs.count===45,'El servidor registra 45 participantes distintos');
  await teacher.waitForFunction(()=>document.querySelectorAll('#participants [data-uid]').length===45,null,{timeout:20000});check(true,'El panel docente lista a los 45');
  await wall.waitForFunction(()=>document.querySelectorAll('#screenPlayers [data-uid]').length===45,null,{timeout:20000});check(true,'La pantalla proyectada muestra a los 45');
  await wall.screenshot({path:path.join(out,'pantalla-45.png')});

  // Un 2.º medio que escanea el QR: inicia sesión, vuelve a la sala y ve el motivo sin quedar dentro.
  {const context=await browser.newContext(PHONE),page=await context.newPage();watch(page,'2.º medio');
   await page.goto(ORIGIN+'/bachillerato/?sala='+code);await page.locator('#loginLink').click();await page.locator('#rutInput').waitFor({state:'visible',timeout:30000});
   await page.locator('#rutInput').fill(second.run);await page.locator('#passInput').fill(second.password);await page.locator('#loginForm button[type=submit]').click();
   await page.waitForURL(u=>u.pathname.startsWith('/estudiantes/bachillerato/'),{timeout:45000});
   await page.waitForFunction(()=>(document.querySelector('#notice')?.textContent||'').includes('es de 4.º medio'),null,{timeout:30000});
   check(await page.locator('#waiting').isHidden(),'Un 2.º medio vuelve a la sala, lee que es de 4.º medio y no queda dentro');await page.screenshot({path:path.join(out,'celular-2medio.png'),fullPage:true});await context.close();}
  check((await call(ORIGIN,'state',host.token,{code,host:1},true)).data.count===45,'El 2.º medio no se suma a la sala');

  // Ronda de palabras: los celulares la reciben, uno entrega, la pantalla cuenta y el otro cierra sesión con la ronda abierta.
  const A=sessions[keepA.index].page,B=sessions[keepB.index].page;
  await teacher.locator('#chooseLetter').fill('P');await teacher.locator('#startForm button').click();
  await A.locator('#answer0').waitFor({state:'visible',timeout:20000});await B.locator('#answer0').waitFor({state:'visible',timeout:20000});
  check((await A.locator('#letter').textContent()).trim()==='P'&&(await B.locator('#letter').textContent()).trim()==='P','Los celulares reciben la ronda con la letra P');
  await A.locator('#answer0').fill('Pedro');await A.locator('#answer1').fill('Puma');await A.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.',null,{timeout:20000});
  await A.locator('#submit').click();await A.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Entrega confirmada'),null,{timeout:20000});check(true,'Entrega real confirmada desde el celular');
  await wall.locator('#round').waitFor({state:'visible',timeout:20000});await wall.waitForFunction(()=>/1 de 45/.test(document.querySelector('#progressText')?.textContent||''),null,{timeout:20000});check(true,'La pantalla cuenta «1 de 45»');
  await A.screenshot({path:path.join(out,'celular-ronda.png'),fullPage:true});
  await B.locator('#answer0').fill('Paula');await B.locator('#logout').click();await B.locator('#login').waitFor({state:'visible',timeout:20000});
  check(await B.locator('#game').isHidden()&&(await B.locator('#loginLink').getAttribute('href')).includes(encodeURIComponent('sala='+code)),'«Cerrar sesión» en el celular con la ronda abierta deja el ingreso apuntando a la misma sala');
  const savedB=(await db.ref(BASE+'/bachillerato/salas/'+code+'/rounds/1/answers/'+keepB.uid).once('value')).val();check(savedB&&Array.isArray(savedB.answers)&&savedB.answers[0]==='Paula','Lo escrito antes de cerrar sesión quedó guardado en la sala');
  await teacher.locator('#stop').click();await teacher.locator('#reviewPanel').waitFor({state:'visible',timeout:20000});check((await teacher.locator('#reviewPanel').textContent()).includes('Pedro'),'El panel docente ve las respuestas al cerrar la ronda');
  await teacher.locator('#publish').click();await A.locator('#leaderboard').waitFor({state:'visible',timeout:20000});await wall.locator('#leaderboard').waitFor({state:'visible',timeout:20000});
  check((await A.locator('#ranking').textContent()).includes('pts'),'Puntos publicados en el celular y en la pantalla');
  await wall.screenshot({path:path.join(out,'pantalla-ranking.png')});await teacher.screenshot({path:path.join(out,'docente.png'),fullPage:true});
  await teacher.locator('#finish').click();await teacher.waitForFunction(()=>document.querySelector('#hostStatus').textContent==='Partida terminada',null,{timeout:20000});check(true,'Partida terminada desde el panel');
  await wall.locator('#logout').click();await wall.waitForURL(/docente\.html$/,{timeout:20000});await wall.locator('#teacherLogin').waitFor({state:'visible',timeout:20000});check(true,'«Cerrar sesión» en la pantalla vuelve al ingreso docente');

  // Errores: excepciones y 5xx en todo el recorrido; consola de la sala sin errores propios.
  const roomConsole=report.consoleErrors.filter(e=>/^\/(estudiantes\/)?bachillerato\//.test(e.path)&&!/Failed to load resource/.test(e.text));
  check(report.pageErrors.length===0,'Sin excepciones JavaScript'+(report.pageErrors.length?': '+report.pageErrors.join(' | '):''));
  check(report.serverErrors.length===0,'Sin respuestas 5xx'+(report.serverErrors.length?': '+report.serverErrors.join(' | '):''));
  check(roomConsole.length===0,'Sin errores de consola propios en la sala'+(roomConsole.length?': '+roomConsole.map(e=>e.who+' '+e.text).join(' | '):''));
  console.log(JSON.stringify({checks:report.checks.length,participants:45,timings:report.timings,consoleErrors:report.consoleErrors.length,origin:ORIGIN}));
 }finally{
  fs.writeFileSync(path.join(out,'informe.json'),JSON.stringify(report,null,2),'utf8');
  if(browser)await browser.close().catch(()=>{});
  for(const c of fixture.rooms)await retry(()=>db.ref(BASE+'/bachillerato/salas/'+c).remove()).catch(e=>console.error('No se borró la sala ficticia: '+e.message));
  for(const uid of fixture.uids){
   await retry(()=>db.ref(BASE).update({['estudiantes/'+uid]:null,['admins/'+uid]:null,['docentes/'+uid]:null,['bachillerato/docentes/'+uid]:null})).catch(e=>console.error('Base: '+e.message));
   await retry(()=>auth.deleteUser(uid).catch(e=>{if(e.code!=='auth/user-not-found')throw e;})).catch(e=>console.error('Auth: '+e.message));
  }
  let left=0;
  for(const c of fixture.rooms)if((await db.ref(BASE+'/bachillerato/salas/'+c).once('value')).exists())left++;
  for(const uid of fixture.uids){for(const p of ['estudiantes/','admins/','docentes/','bachillerato/docentes/'])if((await db.ref(BASE+'/'+p+uid).once('value')).exists())left++;left+=await auth.getUser(uid).then(()=>1,e=>e.code==='auth/user-not-found'?0:1);}
  fixture.cleaned=left===0;journal();
  console.log(left===0?`Limpieza confirmada: ${fixture.rooms.length} sala y ${fixture.uids.length} identidades ficticias ausentes en Auth y en la base.`:`LIMPIEZA INCOMPLETA: ${left} restos. Registro: ${path.join(out,'fixtures.json')}`);
  if(left)process.exitCode=1;
  await app.delete();
 }
}
if(require.main===module)main().catch(e=>{console.error('FALLA: '+String(e.message).split('\n')[0]);process.exitCode=1;});
