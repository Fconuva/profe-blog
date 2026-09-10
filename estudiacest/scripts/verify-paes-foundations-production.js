'use strict';
// Prueba acotada: nunca usa estudiantes reales ni cambia liberaciones de curso.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('@playwright/test');
const {getAccessToken,requestJson}=require('./firebase-maintenance-db');
const origin='https://www.estudiacest.com',rut='111111111',nombre='PRUEBA TÉCNICA G1–9',ref=`plataforma_paes/guia_respuestas/1/${rut}`;
async function main(){
 const portal=await(await fetch(origin+'/paes/')).text();for(let id=1;id<=9;id++)assert(portal.includes(`id="cardGuia${id}"`));assert(!portal.includes('<article class="ensayo-card" id="cardFundamentos">'));
 for(const name of ['_paes-foundations','_paes-foundations-1-3','_paes-foundations-4-6','_paes-foundations-7-9']){
  for(const suffix of ['', '/', '?v=1']){const r=await fetch(`${origin}/api/${name}.js${suffix}`);assert.equal(r.status,404,'Banco editorial descargable públicamente');}
 }
 for(let id=1;id<=9;id++){
  const asset=`paes/imagenes/fundamentos/guia${id}-estrategia.webp`,image=await fetch(`${origin}/${asset}`);assert.equal(image.status,200);assert(image.headers.get('content-type').includes('image/webp'));
  const digest=b=>crypto.createHash('sha256').update(b).digest('hex');assert.equal(digest(Buffer.from(await image.arrayBuffer())),digest(fs.readFileSync(path.join(__dirname,'..',asset))),'La imagen publicada difiere del archivo verificado');
  for(const suffix of ['','-guiada']){const r=await fetch(`${origin}/paes/guia${id}${suffix}.html`);assert.equal(r.status,200);const html=await r.text();for(const token of ['guia-foundations.js','Objetivo de la clase','workInstructions','reading-scheme','Cierre de la clase','lesson-expansion','Pienso en voz alta',`guia${id}-estrategia.webp`])assert(html.includes(token));}
  const r=await fetch(`${origin}/api/paes?action=get-foundation&guiaId=${id}&rut=${rut}&mode=regular`);assert.equal(r.status,200);const d=await r.json();assert.equal(d.activity.questions.length,12);assert.equal(d.activity.version,'foundations-v1');d.activity.questions.forEach(q=>assert(!q.key&&!q.answer&&!q.reasons));
 }
 assert.equal((await fetch(origin+'/api/paes?action=admin-get-foundation&guiaId=1')).status,401);
 console.log('Producción: 18 páginas ampliadas HTTP 200; nueve imágenes con hash idéntico; nueve bancos sin claves públicas; pauta privada protegida.');
 const token=getAccessToken();assert.equal(await requestJson('GET',ref,token),null,'La cuenta ficticia ya tiene un registro: se cancela la escritura para preservarlo.');
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/paes/js/nominas.js',r=>r.fulfill({contentType:'application/javascript',body:'const NOMINAS_PAES='+JSON.stringify([{rut,nombre,curso:'3A-HC'}])+';'}));
  const enter=async()=>{await page.locator('#rutInput').fill(rut);await page.locator('#loginForm button').click();await page.locator('#session').waitFor({state:'visible'});};
  await page.goto(origin+'/paes/guia1.html');await enter();
  for(const width of [390,1440,3840]){await page.setViewportSize({width,height:width===3840?2160:900});await page.locator('.ai-teaching-figure').scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const img=document.querySelector('.ai-teaching-figure img');return img.complete&&img.naturalWidth===1200;});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('.ai-teaching-figure').screenshot({path:`test-results/production-g1-image-${width}.png`});}
  await page.setViewportSize({width:390,height:844});await page.locator('#question-1 .option').first().click();await page.waitForFunction(()=>document.getElementById('savedState').textContent==='Guardado en línea');
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
