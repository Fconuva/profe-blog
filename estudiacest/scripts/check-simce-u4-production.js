'use strict';
// QA con cuenta técnica efímera. Nunca usa ni altera un estudiante real.
// Limpieza limitada a la UID creada por esta ejecución, incluso si una prueba falla.
const assert=require('node:assert/strict'),crypto=require('crypto'),fs=require('fs'),path=require('path');
const admin=require('firebase-admin');const {chromium}=require('playwright');
const {getAccessToken}=require('./firebase-maintenance-db');const {exams}=require('../api/_simce-u4-catalog');
const ORIGIN='https://www.estudiacest.com',DATABASE='https://estudiacest-default-rtdb.firebaseio.com',BASE='plataforma_estudiantes';
let checks=0;function check(value,message){assert.ok(value,message);checks++;}
function fakeRun(){const body=String(99000000+crypto.randomInt(0,999999));let sum=0,factor=2;for(const digit of [...body].reverse()){sum+=Number(digit)*factor;factor=factor===7?2:factor+1;}const n=11-sum%11;return body+(n===11?'0':n===10?'k':n);}
async function main(){
 const app=admin.initializeApp({projectId:'estudiacest',databaseURL:DATABASE,credential:{getAccessToken:async()=>({access_token:getAccessToken(),expires_in:3600})}},'simce-u4-qa-production');
 const auth=app.auth(),db=app.database();const uid='qa-simce-u4-'+crypto.randomUUID(),run=fakeRun(),password=crypto.randomBytes(24).toString('base64url');
 let created=false,browser=null;const errors=[],requests=[];let page=null;
 try{
  await auth.createUser({uid,email:run+'@est.estudiacest.com',password,displayName:'CUENTA TÉCNICA FICTICIA U4'});created=true;
  check(!(await db.ref(`${BASE}/estudiantes/${uid}`).once('value')).exists(),'UID técnica nueva');
  await db.ref(`${BASE}/estudiantes/${uid}`).set({nombre:'CUENTA TÉCNICA FICTICIA U4',rut:run,run,curso:'2A-HC',programa:'simce',perfil_completo:true,password_changed:true,activo:true,ocultarDeCasas:true,qa:true});
  browser=await chromium.launch({headless:true});page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('action=simce-u4-'))requests.push({action:new URL(r.url()).searchParams.get('action'),status:r.status()});});
  await page.goto(ORIGIN+'/lecturas/');await page.locator('#rutInput').fill(run);await page.locator('#passInput').fill(password);await page.locator('#loginForm button[type=submit]').click();
  await page.waitForURL('**/estudiantes/dashboard.html',{timeout:30000});await page.waitForFunction(()=>document.querySelectorAll('#unit4SessionList .session-card').length===5);
  check(await page.locator('#unit4SessionList .session-card').count()===5,'Ingreso común real y cinco sesiones asignadas');
  const token=await page.evaluate(()=>firebase.auth().currentUser.getIdToken());
  const direct=await fetch(`${DATABASE}/${BASE}/respuestas/sesion-u4-1/${uid}.json?auth=${encodeURIComponent(token)}`,{method:'PUT',body:JSON.stringify({submitted:true,completada:true,score:18}),headers:{'Content-Type':'application/json'}});
  check([401,403].includes(direct.status),'Firebase real niega puntaje/entrega directa del alumno');
  for(const exam of exams){
   await page.goto(ORIGIN+`/estudiantes/simce-unidad4/?ensayo=${exam.number}`);await page.getByRole('button',{name:'Comenzar miniensayo'}).click();await page.locator('#work').waitFor({state:'visible',timeout:30000});check(await page.locator('input[type=radio]').count()===72,'18 preguntas reales');
   if(exam.number===1){await page.locator('input[name=q1][value=A]').check();await page.waitForTimeout(900);await page.reload();await page.getByRole('button',{name:'Comenzar miniensayo'}).click();check(await page.locator('input[name=q1][value=A]').isChecked(),'Recarga real conserva respuesta');}
   for(const q of exam.texts.flatMap(t=>t.questions))await page.locator(`input[name=${q.id}][value=${q.key}]`).check();
   await page.getByRole('button',{name:'Entregar miniensayo'}).click();await page.getByRole('button',{name:'Ver mi resultado'}).click();check((await page.locator('#correct').textContent())==='18 de 18 correctas','Aciertos reales calculados por API');check((await page.locator('#simulated').textContent()).includes('350'),'Índice real simulado');
   const record=(await db.ref(`${BASE}/respuestas/${exam.sessionId}/${uid}`).once('value')).val();check(record.uid===uid && record.curso==='2A-HC' && record.sessionId===exam.sessionId,'Identidad triple real');check(record.submitted===true && record.completada===true && record.score===18,'Servidor confirma marcas y resultado');
   await page.reload();await page.locator('#result').waitFor({state:'visible'});check((await page.locator('#correct').textContent()).startsWith('18'),'Resultado real después de recarga');
  }
  await page.goto(ORIGIN+'/estudiantes/dashboard.html');await page.waitForFunction(()=>document.querySelectorAll('#unit4SessionList .completed').length===5);check(await page.locator('#unit4SessionList .completed').count()===5,'Panel real confirma cinco entregas');
  await page.goto(ORIGIN+'/estudiantes/simce-unidad4/forma-p.html');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Solo lectura'));check(await page.locator('.reading').count()===7,'Referencia real con siete textos');check(await page.locator('.question').count()===38,'Referencia real con 36 alternativas y dos abiertas');check(await page.getByText('Respuesta redactada:',{exact:false}).count()===2,'Ambas abiertas visibles en producción');
  const noKey=await fetch(ORIGIN+'/api/estudiantes?action=simce-u4-review&ensayo=1',{headers:{Authorization:'Bearer '+token}});check(noKey.status===403,'Alumno real no recibe pauta');
  // El rol también pertenece únicamente a la cuenta técnica efímera.
  await db.ref(BASE).update({[`admins/${uid}`]:true,[`docentes/${uid}`]:{cursos:['2A-HC'],superadmin:false}});
  await page.goto(ORIGIN+'/estudiantes/simce-unidad4/docente.html');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('verificado'));check((await page.locator('#results').textContent()).includes('18/18 correctas'),'Docente real recibe resultado confirmado');check(await page.locator('#key details').count()===18,'Pauta privada real');check((await page.locator('#key').textContent()).includes('Fundamento del nivel:'),'Auditoría individual real');check((await page.locator('#writing').textContent()).includes('3 puntos:'),'Rúbrica redactada real');
  await db.ref(`${BASE}/docentes/${uid}/cursos`).set(['2B-HC']);const scope=await fetch(ORIGIN+'/api/estudiantes?action=simce-u4-review&ensayo=1',{headers:{Authorization:'Bearer '+token}});const filtered=await scope.json();check(!filtered.results.some(r=>r.nombre==='CUENTA TÉCNICA FICTICIA U4'),'Servidor real aplica alcance por curso');
  await db.ref(`${BASE}/docentes/${uid}/cursos`).set(['2A-HC']);
  const requestId='qa-u4-reopen-'+crypto.randomUUID();
  const reopen=await fetch(ORIGIN+'/api/estudiantes?action=simce-admin-reopen',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({sessionId:'sesion-u4-1',studentUid:uid,requestId})});
  const reopened=await reopen.json();check(reopen.status===200 && reopened.reopened,'Reapertura real por intento individual');
  const archive=(await db.ref(`${BASE}/historial_reaperturas/sesion-u4-1/${uid}/${requestId}`).once('value')).val();check(archive.response.score===18 && archive.result.score===18,'Archivo real conserva entrega y resultado');
  await page.goto(ORIGIN+'/estudiantes/simce-unidad4/?ensayo=1');await page.getByRole('button',{name:'Comenzar miniensayo'}).click();await page.locator('#work').waitFor({state:'visible'});check(await page.locator('input:checked').count()===18,'Reapertura conserva respuestas en navegador real');await page.getByRole('button',{name:'Entregar miniensayo'}).click();await page.getByRole('button',{name:'Ver mi resultado'}).click();check((await page.locator('#correct').textContent())==='18 de 18 correctas','Reentrega real confirmada');
  check(errors.length===0,'Sin errores JS en producción');console.log(`Producción U4: ${checks} comprobaciones, ingreso común, cinco entregas técnicas, relectura, Firebase protegido, Forma P y panel docente. Sin cuentas reales modificadas.`);
 }catch(error){if(page){console.log('Diagnóstico de petición:',JSON.stringify(requests));console.log('Estado visible:',await page.locator('#saveState').textContent().catch(()=>''));}throw error;}finally{
  if(browser)await browser.close();
  if(created){
   const cleanup={};for(const node of ['estudiantes','admins','docentes'])cleanup[`${node}/${uid}`]=null;
   for(const e of exams){for(const node of ['respuestas','resultados','telemetria_clases','historial_reaperturas'])cleanup[`${node}/${e.sessionId}/${uid}`]=null;cleanup[`sesiones/${e.sessionId}/excepciones_desbloqueo/${uid}`]=null;}
   await db.ref(BASE).update(cleanup);await auth.deleteUser(uid);
   for(const route of Object.keys(cleanup))assert.equal((await db.ref(BASE+'/'+route).once('value')).val(),null,'Limpieza de UID técnica');
   console.log('Cuenta y registros técnicos eliminados; limpieza verificada.');
  }await app.delete();
 }
}
if(require.main===module)main().catch(error=>{console.error('QA producción:',error.code || error.name,error.message);process.exitCode=1;});
