'use strict';
// Solo identidad ficticia; no modifica liberaciones ni intentos existentes.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('@playwright/test');
const {getAccessToken,requestJson}=require('./firebase-maintenance-db');
const root=path.resolve(__dirname,'..'),origin='https://www.estudiacest.com';
const student={rut:'111111111',nombre:'PRUEBA TÉCNICA APERTURA PAES',curso:'3A-HC'};
const ref=`plataforma_paes/guia_respuestas/21/${student.rut}`;
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 const files=['paes/css/guia-teaching.css','paes/assets/guia14/guia14-app.js'];
 for(let id=1;id<=21;id++)for(const suffix of ['','-guiada']){
  const name=`paes/guia${id}${suffix}.html`;if(fs.existsSync(path.join(root,name)))files.push(name);
 }
 for(const name of files){
  const r=await fetch(`${origin}/${name}`);assert.equal(r.status,200,name);
  assert.equal(digest(Buffer.from(await r.arrayBuffer())),digest(fs.readFileSync(path.join(root,name))),`Archivo publicado distinto: ${name}`);
 }
 assert.equal((await fetch(origin+'/api/paes?action=admin-get-results')).status,401);
 assert.equal((await fetch(origin+'/scripts/paes-continuity-teaching.js')).status,404);
 console.log('Producción: 35 guías y dos recursos con hash idéntico; admin y scripts protegidos.');
 const token=getAccessToken();assert.equal(await requestJson('GET',ref,token),null,'Registro ficticio ocupado: se cancela la escritura.');
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/paes/js/nominas.js',route=>route.fulfill({contentType:'application/javascript',body:'const NOMINAS_PAES='+JSON.stringify([student])+';'}));
  await page.goto(origin+'/paes/guia14.html');await page.locator('#g14-login .paes-prelude').waitFor({state:'visible'});
  for(const width of [390,1440,3840]){
   await page.setViewportSize({width,height:width===3840?2160:900});
   assert(await page.locator('.paes-prelude').evaluate(el=>el.getBoundingClientRect().right<=innerWidth+1));
   await page.screenshot({path:`test-results/production-preparation-g14-${width}.png`});
  }
  await page.goto(origin+'/paes/guia21.html');
  for(const width of [390,1440,3840]){
   await page.setViewportSize({width,height:width===3840?2160:900});
   await page.locator('.paes-prelude').scrollIntoViewIfNeeded();
   assert(await page.locator('.paes-prelude').isVisible());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:`test-results/production-preparation-g21-${width}.png`});
  }
  const enter=async()=>{await page.locator('#rutInput').fill(student.rut);await page.locator('#loginForm button').click();await page.locator('#session').waitFor({state:'visible'});};
  await page.setViewportSize({width:390,height:844});await enter();assert(await page.locator('.paes-prelude').isHidden());
  await page.locator('#question-1 .option').first().click();await page.waitForFunction(()=>document.getElementById('savedState').textContent==='Guardado en línea');
  await page.evaluate(()=>localStorage.clear());await page.reload();await enter();assert.equal(await page.locator('#answeredInfo').textContent(),'1 de 24 marcadas');
  await page.locator('[data-tab="4"]').click();await page.locator('#submit').click();await page.locator('#confirmDialog').waitFor({state:'visible'});
  const record=await requestJson('GET',ref,token);assert(record.submitted&&record.completada);assert.equal(record.submittedAt,record.completadaAt);assert.equal(record.total,24);
  await page.reload();await enter();assert(await page.locator('#question-1 .option').first().isDisabled());assert(await page.locator('#resultBox').isHidden());
  const state=await(await fetch(`${origin}/api/paes?action=get-guia-state&guiaId=21&rut=${student.rut}`)).json();assert(!state.answerKey&&!state.feedback);
  assert.deepEqual(errors,[]);
  console.log('Producción G21: preparación separada, guardado, recuperación sin copia local, entrega persistida, bloqueo al recargar y claves aún privadas: OK.');
 }finally{
  await browser.close();const record=await requestJson('GET',ref,token);
  if(record){assert.equal(record.nombre,student.nombre,'Registro ajeno: no eliminar.');await requestJson('DELETE',ref,token);assert.equal(await requestJson('GET',ref,token),null);console.log('Prueba ficticia eliminada; ausencia verificada.');}
 }
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
