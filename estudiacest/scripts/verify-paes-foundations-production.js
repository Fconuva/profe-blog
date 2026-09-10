'use strict';
// Prueba acotada: nunca usa estudiantes reales ni cambia liberaciones de curso.
const assert=require('node:assert/strict');
const {chromium}=require('@playwright/test');
const {getAccessToken,requestJson}=require('./firebase-maintenance-db');
const origin='https://www.estudiacest.com',rut='111111111',nombre='PRUEBA TÉCNICA G1–9',ref=`plataforma_paes/guia_respuestas/1/${rut}`;
async function main(){
 for(const name of ['_paes-foundations','_paes-foundations-1-3','_paes-foundations-4-6','_paes-foundations-7-9']){
  const r=await fetch(`${origin}/api/${name}.js`);assert.equal(r.status,404,'Banco editorial descargable públicamente');
 }
 for(let id=1;id<=9;id++){
  for(const suffix of ['','-guiada']){const r=await fetch(`${origin}/paes/guia${id}${suffix}.html`);assert.equal(r.status,200);assert((await r.text()).includes('guia-foundations.js'));}
  const r=await fetch(`${origin}/api/paes?action=get-foundation&guiaId=${id}&rut=${rut}&mode=regular`);assert.equal(r.status,200);const d=await r.json();assert.equal(d.activity.questions.length,12);assert.equal(d.activity.version,'foundations-v1');d.activity.questions.forEach(q=>assert(!q.key&&!q.answer&&!q.reasons));
 }
 assert.equal((await fetch(origin+'/api/paes?action=admin-get-foundation&guiaId=1')).status,401);
 console.log('Producción: 18 páginas HTTP 200; 9 bancos sin claves públicas; pauta privada protegida.');
 const token=getAccessToken();assert.equal(await requestJson('GET',ref,token),null,'La cuenta ficticia ya tiene un registro: se cancela la escritura para preservarlo.');
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/paes/js/nominas.js',r=>r.fulfill({contentType:'application/javascript',body:'const NOMINAS_PAES='+JSON.stringify([{rut,nombre,curso:'3A-HC'}])+';'}));
  const enter=async()=>{await page.locator('#rutInput').fill(rut);await page.locator('#loginForm button').click();await page.locator('#session').waitFor({state:'visible'});};
  await page.goto(origin+'/paes/guia1.html');await enter();await page.locator('#question-1 .option').first().click();await page.waitForFunction(()=>document.getElementById('savedState').textContent==='Guardado en línea');
  await page.evaluate(()=>localStorage.clear());await page.reload();await enter();assert.equal(await page.locator('#answeredInfo').textContent(),'1 de 12 marcadas');
  await page.locator('[data-tab="4"]').click();await page.locator('#submit').click();await page.locator('#confirmDialog').waitFor({state:'visible'});
  const saved=await requestJson('GET',ref,token);assert(saved.submitted&&saved.completada);assert.equal(saved.submittedAt,saved.completadaAt);assert.equal(saved.contentVersion,'foundations-v1');assert.equal(saved.total,12);
  await page.reload();await enter();assert(await page.locator('#question-1 .option').first().isDisabled());assert(await page.locator('#resultBox').isHidden());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'test-results/production-g1-mobile.png'});
  console.log('Producción: guardado, recuperación sin copia local, entrega persistida y recarga bloqueada: OK. Resultados aún privados.');
 }finally{
  await browser.close();const record=await requestJson('GET',ref,token);
  if(record){assert.equal(record.nombre,nombre,'Registro ajeno: se preserva sin eliminar.');await requestJson('DELETE',ref,token);assert.equal(await requestJson('GET',ref,token),null);console.log('Registro ficticio eliminado y ausencia verificada.');}
 }
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
