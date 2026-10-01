// Recursos publicados en navegador real; funciones con identidades ficticias.
// Ninguna solicitud autenticada ni escritura llega a los datos de producción.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{chromium}=require('playwright');
const fixture=require('./preview-paes-avatar-prizes'),origin='https://www.estudiacest.com';
const root=path.join(__dirname,'..'),avatar=fixture.state.datos.plataforma_estudiantes.avatar;
avatar.studentA.casa={tamano:'7x7',piso:'claro',muro:'blanco'};avatar.studentA.pieza=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 for(const file of ['estudiantes/js/mi-espacio.js','estudiantes/js/mapas-casa.js','estudiantes/js/personaje-iso.js','estudiantes/css/mi-espacio.css','estudiantes/adminprofe/index.html']){
  const r=await fetch(origin+'/'+file);assert.equal(r.status,200);assert.equal(hash(Buffer.from(await r.arrayBuffer())),hash(fs.readFileSync(path.join(root,file))),file+' coincide con la fuente publicada');
 }
 for(const route of ['/paes/','/paes/mi-espacio.html','/estudiantes/','/nm3/','/nm4/','/4dtp/'])assert.equal((await fetch(origin+route)).status,200,route);
 for(const action of ['salas-habitaciones','salas-pasar-puerta','salas-guardar-pieza'])assert.equal((await fetch(origin+'/api/estudiantes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})})).status,401);
 const server=await fixture.start(),browser=await chromium.launch({headless:true}),local='http://127.0.0.1:'+server.address().port;
 try{
  const page=await browser.newPage({viewport:{width:1200,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+new URL(r.url()).pathname);});
  await page.exposeFunction('readFakeHouse',async route=>(await fixture.db.ref(route).once('value')).val());
  await page.route('**/api/estudiantes',async route=>{const response=await fetch(local+'/api/estudiantes',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer studentA'},body:route.request().postData()});await route.fulfill({status:response.status,contentType:'application/json',body:await response.text()});});
  async function mount(){
   // Un recurso de imagen tiene el origen público, pero no inicia otra aplicación.
   await page.goto(origin+'/estudiantes/assets/avatar-kit/pelo-corto.png');
   await page.evaluate(()=>{document.head.innerHTML='<meta name="viewport" content="width=device-width,initial-scale=1">';document.body.innerHTML='<main id="qaHouse" style="max-width:1100px;margin:auto"></main>';document.body.style='margin:0;background:#0f172a;font-family:system-ui';});
   await page.addStyleTag({url:origin+'/estudiantes/css/mi-espacio.css'});
   for(const name of ['avatar-levels','catalogo-casa','personaje-iso','mapas-casa','mi-espacio'])await page.addScriptTag({url:origin+'/estudiantes/js/'+name+'.js'});
   await page.evaluate(async()=>{
    const timers=new Map(),ref=key=>({once:async()=>{const v=await window.readFakeHouse(key);return {val:()=>v,exists:()=>v!=null};},child:c=>ref(key+'/'+c),on:(event,fn)=>{if(event!=='value')return;const tick=async()=>fn(await ref(key).once());tick();timers.set(key,setInterval(tick,300));},off:()=>{clearInterval(timers.get(key));timers.delete(key);},orderByChild:()=>ref(key),limitToLast:()=>ref(key)});
    const av=(await ref('plataforma_estudiantes/avatar/studentA').once()).val();
    MiEspacio.montar({host:document.getElementById('qaHouse'),db:{ref},auth:{currentUser:{getIdToken:async()=> 'studentA'}},base:'plataforma_estudiantes',uid:'studentA',nombre:'Estudiante de prueba',curso:'3B-HC',xp:0,regalos:av.regalos,pieza:av.pieza,casa:av.casa,personajeEn:av.personajeEn});
   });
   await page.locator('[data-p="pieza"]').click();await page.locator('#espPuerta:not([disabled])').waitFor();
  }
  await mount();await page.locator('#espPuerta').click();await page.locator('#espSalaCab').filter({hasText:'· Estudio'}).waitFor();await page.locator('#espPuerta:not([disabled])').waitFor();assert.equal(avatar.studentA.habitaciones.actual,'estudio');
  for(const width of [390,1200,3840]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('[data-panel="pieza"]').screenshot({path:path.join(root,'../scratch/habitaciones-publico-'+width+'.png')});}
  await mount();await page.locator('#espSalaCab').filter({hasText:'· Estudio'}).waitFor();await page.locator('#espPuerta').click();await page.locator('#espSalaCab').filter({hasText:'· Principal'}).waitFor();assert.equal(avatar.studentA.habitaciones.actual,'principal');assert.deepEqual(errors,[]);
  console.log('Producción: cinco archivos con SHA-256 idéntico, seis portadas 200 y tres acciones 401 sin sesión. Recursos públicos en Chromium: puertas/recarga y 390/1200/3840 sin errores. Backend exclusivamente ficticio.');
 }finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
