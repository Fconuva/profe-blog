'use strict';
// Producción, solo con identidades y sala ficticias: ingreso a la sala NM4 solo con RUT (Francisco, 10-nov-2026).
// Elimina únicamente las UID y la sala creadas por esta ejecución y relee su ausencia.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');
const admin=require('firebase-admin'),{chromium}=require('playwright'),{getAccessToken}=require('./firebase-maintenance-db');
const {call}=require('./audit-simce-bachillerato');
const ORIGIN=process.env.BACHILLERATO_QA_ORIGIN||'https://www.estudiacest.com',BASE='plataforma_estudiantes',DATABASE='https://estudiacest-default-rtdb.firebaseio.com',APIKEY='AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w';
const PHONE={viewport:{width:390,height:844},isMobile:true,hasTouch:true};
function fakeRun(){const n=String(99000000+crypto.randomInt(999999));let sum=0,f=2;for(const d of [...n].reverse()){sum+=Number(d)*f;f=f===7?2:f+1;}const k=11-sum%11;return n+(k===11?'0':k===10?'k':k);}
const dotted=r=>r.slice(0,-1).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'-'+r.slice(-1).toUpperCase();
async function rut(rutText,code){const r=await fetch(ORIGIN+'/api/estudiantes?action=bachillerato-rut',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rut:rutText,code})});return {status:r.status,data:await r.json().catch(()=>({}))};}
async function main(){
 const app=admin.initializeApp({projectId:'estudiacest',databaseURL:DATABASE,credential:{getAccessToken:async()=>({access_token:getAccessToken(),expires_in:3600})}},'bachillerato-rut-'+Date.now());const db=app.database(),auth=app.auth();
 const prefix='qa-bach-rut-'+crypto.randomUUID().slice(0,10),out=path.resolve(__dirname,'../test-results/bachillerato-rut',prefix);fs.mkdirSync(out,{recursive:true});
 const fixture={prefix,uids:[],rooms:[],cleaned:false};const journal=()=>fs.writeFileSync(path.join(out,'fixtures.json'),JSON.stringify(fixture,null,2),'utf8');journal();
 const checks=[],errors=[];const check=(v,m)=>{assert.ok(v,m);checks.push(m);console.log('ok  '+m);};let browser;
 try{
  const mk=(i,curso,changed)=>{const run=fakeRun();return {i,uid:prefix+'-'+i,run,email:run+'@est.estudiacest.com',curso,changed,password:crypto.randomBytes(18).toString('base64url')};};
  const tp=mk(0,'4A-TP',false),hc=mk(1,'4B-HC',true),dos=mk(2,'2A-HC',false),inactive=mk(3,'4C-TP',false),host={i:'docente',uid:prefix+'-docente',email:prefix+'-docente@qa.estudiacest.invalid',password:crypto.randomBytes(18).toString('base64url')};
  for(const p of [tp,hc,dos,inactive,host]){fixture.uids.push(p.uid);journal();await auth.createUser({uid:p.uid,email:p.email,password:p.password,displayName:'PRUEBA FICTICIA BACH RUT'});
   if(p!==host)await db.ref(BASE+'/estudiantes/'+p.uid).set({nombre:'Ficticio'+p.i+' QA',curso:p.curso,rut:p.run,run:p.run,programa:/^[34]/.test(p.curso)?'paes':'simce',perfil_completo:p.changed,password_changed:p.changed,activo:p!==inactive,ocultarDeCasas:true,qa:true});}
  await db.ref(BASE).update({['admins/'+host.uid]:true,['docentes/'+host.uid]:{cursos:['4A-TP','4B-TP','4C-TP','4D-TP','4E-TP','4A-HC','4B-HC'],superadmin:false}});
  const s=await (await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+APIKEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:host.email,password:host.password,returnSecureToken:true})})).json();host.token=s.idToken;
  const created=await call(ORIGIN,'create',host.token,{course:'NM4'});const code=created.data.code;fixture.rooms.push(code);journal();check(created.status===200&&code,'Sala NM4 ficticia creada');
  // Servidor: solo RUT válido, existente, del curso y con la sala abierta.
  check((await rut(tp.run,code)).status===200,'RUT de 4.º TP recibe la sesión sin contraseña');
  check((await rut(dotted(hc.run),code.toLowerCase())).status===200,'RUT con puntos y guion, y código en minúsculas, también entra (quien ya cambió su clave)');
  const two=await rut(dos.run,code);check(two.status===403&&/4\.º medio/.test(two.data.error),'RUT de 2.º medio no entra a la sala de 4.º: '+two.data.error);
  check((await rut(inactive.run,code)).status===403,'RUT de una cuenta inactiva no entra');
  const bad=tp.run.slice(0,-1)+(tp.run.slice(-1)==='1'?'2':'1');check((await rut(bad,code)).status===400,'RUT con dígito verificador errado se rechaza');
  check((await rut(fakeRun(),code)).status===404,'RUT válido que no existe en la plataforma no entra');
  check((await rut(tp.run,'ZZZZZ9')).status===404,'Sin sala válida no hay sesión');
  // Celular real: QR → RUT → sala, sin contraseña ni página de inicio de sesión.
  browser=await chromium.launch({headless:true});
  const watch=(p,w)=>{p.on('pageerror',e=>errors.push(w+': '+e.message));p.on('response',r=>{if(r.status()>=500)errors.push(w+' '+r.status()+' '+r.url());});};
  {const c=await browser.newContext(PHONE),p=await c.newPage();watch(p,'QR');await p.goto(ORIGIN+'/bachillerato/?sala='+code);await p.locator('#rutOnly').waitFor({state:'visible',timeout:30000});
   check(await p.locator('#rutCode').isHidden()&&(await p.locator('#loginRoom').textContent()).includes(code),'Por el QR el celular pide solo el RUT; el código ya viene');
   check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Formulario sin desborde a 390');await p.screenshot({path:path.join(out,'celular-rut.png'),fullPage:true});
   await p.locator('#rutOnly').fill(dotted(tp.run));await p.locator('#rutForm button').click();await p.locator('#waiting').waitFor({state:'visible',timeout:30000});
   check(new URL(p.url()).pathname==='/estudiantes/bachillerato/'&&new URL(p.url()).searchParams.get('sala')===code,'Con el RUT entra a la sala sin pasar por otra página');
   await p.screenshot({path:path.join(out,'celular-sala.png'),fullPage:true});await c.close();}
  {const c=await browser.newContext(PHONE),p=await c.newPage();watch(p,'sin QR');await p.goto(ORIGIN+'/estudiantes/bachillerato/');await p.locator('#rutCode').waitFor({state:'visible',timeout:30000});
   await p.locator('#rutOnly').fill(hc.run);await p.locator('#rutCode').fill(code.toLowerCase());await p.locator('#rutForm button').click();await p.locator('#waiting').waitFor({state:'visible',timeout:30000});check(true,'Sin QR: escribe RUT y código y entra');await c.close();}
  {const c=await browser.newContext(PHONE),p=await c.newPage();watch(p,'2.º');await p.goto(ORIGIN+'/bachillerato/?sala='+code);await p.locator('#rutOnly').waitFor({state:'visible',timeout:30000});
   await p.locator('#rutOnly').fill(dos.run);await p.locator('#rutForm button').click();await p.waitForFunction(()=>(document.querySelector('#notice')?.textContent||'').includes('no corresponde'),null,{timeout:30000});
   check(await p.locator('#waiting').isHidden()&&await p.locator('#rutOnly').isVisible(),'Un 2.º medio ve el motivo y sigue en el formulario');await c.close();}
  const st=(await call(ORIGIN,'state',host.token,{code,host:1},true)).data;check(st.count===2,'La sala registra a los 2 de 4.º que entraron con RUT');
  check(errors.length===0,'Sin excepciones ni 5xx'+(errors.length?': '+errors.join(' | '):''));
  console.log(checks.length+' comprobaciones aprobadas en '+ORIGIN);
 }finally{
  if(browser)await browser.close().catch(()=>{});
  for(const c of fixture.rooms)await db.ref(BASE+'/bachillerato/salas/'+c).remove().catch(e=>console.error('Sala: '+e.message));
  for(const uid of fixture.uids){await db.ref(BASE).update({['estudiantes/'+uid]:null,['admins/'+uid]:null,['docentes/'+uid]:null,['bachillerato/docentes/'+uid]:null}).catch(e=>console.error('Base: '+e.message));await auth.deleteUser(uid).catch(e=>{if(e.code!=='auth/user-not-found')console.error('Auth: '+e.message);});}
  let left=0;for(const c of fixture.rooms)if((await db.ref(BASE+'/bachillerato/salas/'+c).once('value')).exists())left++;
  for(const uid of fixture.uids){for(const p of ['estudiantes/','admins/','docentes/','bachillerato/docentes/'])if((await db.ref(BASE+'/'+p+uid).once('value')).exists())left++;left+=await auth.getUser(uid).then(()=>1,e=>e.code==='auth/user-not-found'?0:1);}
  fixture.cleaned=left===0;journal();console.log(left===0?`Limpieza confirmada: ${fixture.rooms.length} sala y ${fixture.uids.length} identidades ficticias ausentes.`:`LIMPIEZA INCOMPLETA: ${left} restos (${path.join(out,'fixtures.json')})`);if(left)process.exitCode=1;await app.delete();
 }
}
if(require.main===module)main().catch(e=>{console.error('FALLA: '+String(e.message).split('\n')[0]);process.exitCode=1;});
