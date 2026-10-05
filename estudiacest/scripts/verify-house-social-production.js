'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{chromium}=require('playwright');
const {getAccessToken,requestJson,updatePlatform}=require('./firebase-maintenance-db'),catalogo=require('../estudiantes/js/catalogo-casa');
const origin='https://www.estudiacest.com',key='AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w';
const candidate=process.argv.includes('--local-ui');
async function retryReadWrite(fn){for(let i=0;;i++){try{return await fn();}catch(e){if(i===2||!/(ECONNRESET|ETIMEDOUT|fetch failed|HTTP 50[234])/.test(e.message))throw e;await new Promise(r=>setTimeout(r,300*(i+1)));}}}
const read=(p)=>retryReadWrite(()=>requestJson('GET',p,getAccessToken()));
const update=(p)=>retryReadWrite(()=>updatePlatform(p));
async function json(url,options){const r=await fetch(url,options);const data=await r.json();assert.ok(r.ok,'HTTP '+r.status);return data;}
async function main(){
 const users=[],curso='QA-'+crypto.randomBytes(2).toString('hex'),otro='QB-'+crypto.randomBytes(2).toString('hex'),sala=catalogo.idCurso(curso),pages=[],errors=[];
 let browser;
 try{
  assert.equal((await read('plataforma_estudiantes/configuracion/mi_espacio')).enabled,true,'Respetar el bloqueo docente');
  for(let i=0;i<4;i++){
   const email='qa-social-'+crypto.randomUUID()+'@est.estudiacest.com',password='Qa!'+crypto.randomBytes(18).toString('base64url');
   const a=await json('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
   users.push({uid:a.localId,idToken:a.idToken,email,password,curso:i===3?otro:curso});
   await update({['estudiantes/'+a.localId]:{nombre:'CUENTA TÉCNICA SOCIAL '+String.fromCharCode(65+i),curso:i===3?otro:curso,email,activa:true,perfil_completo:true,programa:'simce',createdAt:Date.now()}});
  }
  const call=async(action,body={},u=users[0])=>{const r=await fetch(origin+'/api/estudiantes',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+u.idToken},body:JSON.stringify({action:'salas-'+action,...body})});return {status:r.status,data:await r.json()};};
  const profileUrl='https://estudiacest-default-rtdb.firebaseio.com/plataforma_estudiantes/estudiantes/'+users[0].uid+'.json?auth='+users[0].idToken;
  for(const body of [{curso:otro},{ocultarDeCasas:true}]){
   const r=await fetch(profileUrl,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,401,'El cliente no puede cambiar curso o visibilidad');
  }
  assert.equal((await fetch(profileUrl,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({lastLogin:Date.now()})})).status,200,'El ingreso conserva la actualización del perfil');
  assert.equal((await call('habitaciones',{sala},users[3])).status,404);
  const files=['estudiantes/js/mi-espacio.js','estudiantes/js/personaje-iso.js','estudiantes/js/catalogo-casa.js','estudiantes/css/mi-espacio.css'];
  for(const p of files){const r=await fetch(origin+'/'+p);assert.equal(r.status,200);if(candidate&&p==='estudiantes/js/mi-espacio.js')continue;const actual=Buffer.from(await r.arrayBuffer()).toString('utf8').replace(/\r\n/g,'\n'),expected=fs.readFileSync(path.join(__dirname,'..',p),'utf8').replace(/\r\n/g,'\n');assert.equal(actual,expected,p+' público');}
  browser=await chromium.launch({headless:true});
  for(const u of users.slice(0,3)){
   const p=await browser.newPage({viewport:{width:1200,height:1000}});pages.push(p);p.on('pageerror',e=>errors.push(e.message));
   if(candidate)await p.route(origin+'/estudiantes/js/mi-espacio.js',route=>route.fulfill({contentType:'application/javascript; charset=utf-8',body:fs.readFileSync(path.join(__dirname,'../estudiantes/js/mi-espacio.js'),'utf8')}));
   p.on('response',r=>{if(r.status()>=400&&!r.url().includes('favicon'))errors.push('HTTP '+r.status()+' '+new URL(r.url()).pathname);});
   await p.goto(origin+'/estudiantes/assets/avatar-kit/pelo-corto.png');
   await p.evaluate(()=>{document.head.innerHTML='<meta name="viewport" content="width=device-width,initial-scale=1">';document.body.innerHTML='<main id="qaHouse" style="max-width:1100px;margin:auto"></main>';document.body.style='margin:0;background:#0f172a;font-family:system-ui';});
   await p.addStyleTag({url:origin+'/estudiantes/css/mi-espacio.css'});
   for(const lib of ['app','auth','database'])await p.addScriptTag({url:'https://www.gstatic.com/firebasejs/10.12.0/firebase-'+lib+'-compat.js'});
   for(const lib of ['avatar-levels','catalogo-casa','personaje-iso','mapas-casa','mi-espacio'])await p.addScriptTag({url:origin+'/estudiantes/js/'+lib+'.js'});
   await p.evaluate(async u=>{firebase.initializeApp({apiKey:u.key,projectId:'estudiacest',databaseURL:'https://estudiacest-default-rtdb.firebaseio.com'});await firebase.auth().signInWithEmailAndPassword(u.email,u.password);MiEspacio.montar({host:document.getElementById('qaHouse'),db:firebase.database(),auth:firebase.auth(),base:'plataforma_estudiantes',uid:u.uid,nombre:'Cuenta técnica ficticia',curso:'Etiqueta visible de prueba',xp:0,pieza:[],casa:{tamano:'5x5'}});},{...u,key});
   await p.locator('[data-p="pieza"]').click();await p.locator('#espCurso:not([disabled])').waitFor();await p.locator('#espCurso').click();await p.locator('#espReto').waitFor();
  }
  for(let i=0;i<3;i++){
   const p=pages[i],done=p.waitForResponse(r=>r.url().includes('/api/estudiantes')&&r.request().postDataJSON()?.action==='salas-interactuar');await p.locator('[data-usar="'+i+'"]').click();assert.equal((await(await done).json()).ok,true);
  }
  for(const p of pages)await p.locator('#espReto.completo').waitFor();
  await pages[0].locator('#espChatTexto').fill('Mensaje ficticio de comprobación');await pages[0].locator('#espChatForm button').click();await pages[1].locator('#espChatLista').filter({hasText:'Mensaje ficticio'}).waitFor();
  assert.equal((await call('interactuar',{sala,indice:0,mueble:'lampRoundFloor',col:1,fila:1,encendido:true,operacion:'rechazo_curso'},users[3])).status,403);
  // RTDB real: el curso autorizado lee; otro curso recibe permiso denegado.
  const forbidden=await fetch('https://estudiacest-default-rtdb.firebaseio.com/plataforma_estudiantes/salas_comunes/'+sala+'.json?auth='+users[3].idToken);assert.equal(forbidden.status,401);
  const allowed=await fetch('https://estudiacest-default-rtdb.firebaseio.com/plataforma_estudiantes/salas_comunes/'+sala+'.json?auth='+users[0].idToken);assert.equal(allowed.status,200);const game=await allowed.json();assert.ok(game.juego.completadoHasta>Date.now());assert.equal(Object.keys(game.presentes).length,3);
  const out=path.join(__dirname,'../test-results/house-social-production');fs.mkdirSync(out,{recursive:true});
  for(const width of [390,1200,3840]){await pages[0].setViewportSize({width,height:1000});assert.equal(await pages[0].evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await pages[0].screenshot({path:path.join(out,'curso-'+width+'.png'),fullPage:true});}
  await pages[0].locator('#espVolver').click();await pages[0].locator('#espCurso').waitFor();assert.deepEqual(errors,[]);
  const remote=await read('.settings/rules');assert.deepEqual(remote,JSON.parse(fs.readFileSync(path.join(__dirname,'../firebase-rules.json'),'utf8')));
  console.log((candidate?'Candidata local con API/Firebase reales: ':'Producción real: ')+'tres cuentas ficticias, sala por curso, reto y chat compartidos, regla de aislamiento confirmada, regreso a casa y 390/1200/3840 sin errores. '+(candidate?'Solo el JS de interfaz es local.':'Cuatro recursos públicos coinciden con la fuente.'));
 }catch(e){
  for(const p of pages)if(!p.isClosed())console.log('Diagnóstico ficticio:',await p.locator('.esp-aviso').textContent().catch(()=>''));
  if(errors.length)console.log('Errores de la prueba:',JSON.stringify(errors));throw e;
 }finally{
  if(browser)await browser.close();
  const cleanup={['salas_comunes/'+sala]:null,['salas_comunes/'+catalogo.idCurso(otro)]:null},failures=[];
  for(const u of users){for(const node of ['estudiantes','avatar','salas'])cleanup[node+'/'+u.uid]=null;}
  // Limpiar Auth aunque falle RTDB, y comprobar ambos sin ocultar un fallo.
  await update(cleanup).catch(e=>failures.push(e.message));
  for(const u of users)await retryReadWrite(()=>json('https://identitytoolkit.googleapis.com/v1/accounts:delete?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:u.idToken})})).catch(e=>failures.push(e.message));
  for(const u of users)for(const node of ['estudiantes','avatar','salas'])await read('plataforma_estudiantes/'+node+'/'+u.uid).then(v=>assert.equal(v,null)).catch(e=>failures.push(e.message));
  for(const c of [sala,catalogo.idCurso(otro)])await read('plataforma_estudiantes/salas_comunes/'+c).then(v=>assert.equal(v,null)).catch(e=>failures.push(e.message));
  assert.deepEqual(failures,[],'Limpieza de datos ficticios');
  console.log('Cuentas técnicas y datos ficticios eliminados; relectura limpia.');
 }
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
