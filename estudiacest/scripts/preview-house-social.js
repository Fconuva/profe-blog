'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{chromium}=require('playwright');
const fixture=require('./preview-paes-avatar-prizes'),catalogo=require('../estudiantes/js/catalogo-casa');
const pe=fixture.state.datos.plataforma_estudiantes;
pe.avatar.studentA.casa={tamano:'7x7'};pe.avatar.studentA.pieza=[{id:'rgbPartySpeaker',col:2,fila:2,dir:'SE',encendido:false}];pe.avatar.studentA.regalos.rgbPartySpeaker={tipo:'docente',ts:1};
const academics=JSON.stringify(fixture.state.datos.plataforma_paes),house=JSON.stringify(pe.avatar);
(async()=>{
 const server=await fixture.start(),browser=await chromium.launch({headless:true}),base='http://127.0.0.1:'+server.address().port;
 const errors=[];
 try{
  const pages=[];
  for(const uid of ['studentA','studentB','studentC']){
   const page=await browser.newPage({viewport:{width:1200,height:1000}});pages.push(page);
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+new URL(r.url()).pathname);});
   if(uid!=='studentA')await page.route('**/preview-student',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replaceAll('studentA',uid)});});
   await page.goto(base+'/preview-student');await page.locator('[data-p="pieza"]').click();await page.locator('#espCurso').waitFor();
  }
  const page=pages[0],act=async(p,i)=>{const done=p.waitForResponse(r=>r.url().endsWith('/api/estudiantes')&&r.request().postDataJSON()?.action==='salas-interactuar');await p.locator('[data-usar="'+i+'"]').click();const data=await(await done).json();assert.equal(data.ok,true);};
  await act(page,0);assert.equal(pe.avatar.studentA.pieza[0].encendido,true);await page.reload();await page.locator('[data-p="pieza"]').click();await page.locator('[data-usar="0"] span').filter({hasText:'Apagar'}).waitFor();
  const privateAfter=JSON.stringify(pe.avatar);
  for(const p of pages){await p.locator('#espCurso').click();await p.locator('#espReto').waitFor();await p.locator('#espVolver').waitFor();assert.equal(await p.locator('#espDecorar').isDisabled(),true);assert.equal(await p.locator('#espMueblesBloque').isVisible(),false);assert.equal(await p.locator('#espRegalar').count(),0);}
  await act(pages[0],0);await pages[1].locator('[data-usar="0"] span').filter({hasText:'Apagar'}).waitFor();
  await act(pages[1],1);await act(pages[2],2);for(const p of pages)await p.locator('#espReto.completo').waitFor();
  await act(page,3);assert.equal(pe.salas_comunes[catalogo.idCurso('3B-HC')].presentes.studentA.actividad,'tocar');
  await page.locator('#espChatTexto').fill('Hola desde el curso');await page.locator('#espChatForm button').click();await pages[1].locator('#espChatLista').filter({hasText:'Hola desde el curso'}).waitFor();
  const out=path.join(__dirname,'../test-results/house-social');fs.mkdirSync(out,{recursive:true});
  for(const width of [390,1200,3840]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:path.join(out,'curso-'+width+'.png')});}
  await page.emulateMedia({reducedMotion:'reduce'});await page.screenshot({path:path.join(out,'movimiento-reducido.png')});
  await page.locator('#espVolver').click();await page.locator('#espCurso').waitFor();assert.equal(JSON.stringify(pe.avatar),privateAfter,'Regresar conserva las casas e inventarios');
  assert.equal(JSON.stringify(fixture.state.datos.plataforma_paes),academics);assert.deepEqual(errors,[]);
  // El nuevo raster por capas sigue respondiendo a todas las opciones y las camisetas.
  const result=await page.evaluate(()=>{const a=AvatarLookSystem,c=document.createElement('canvas');c.width=100;c.height=160;const ctx=c.getContext('2d');const hash=look=>{ctx.clearRect(0,0,100,160);a.pintar(ctx,50,145,look,1,'','',{dir:'SE',t:1000});return c.toDataURL();};const look=a.normalizeLook({}, {xpTotal:999999});const base=hash(look);return {capas:a.CAPAS.length,camisetas:new Set(['camisetaRealMadrid','camisetaBarcelona','camisetaColoColo','camisetaCatolica','camisetaUChile','camisetaRangers'].map(arriba=>hash({...look,arriba}))).size,opciones:a.getEditorCategories({xpTotal:999999}).every(cat=>cat.options.every(o=>{const next={...look,[cat.id]:o.id};return o.id===look[cat.id]||hash(next)!==base;}))};});
  assert.equal(result.capas,7);assert.equal(result.camisetas,6);assert.equal(result.opciones,true,'Cada opción sigue modificando el personaje');
  console.log('Chromium: interruptor privado persistente; tres usuarios simultáneos, luces sincronizadas, reto cooperativo, instrumento/chat, regreso sin pérdidas, 390/1200/3840 y movimiento reducido; siete capas y seis camisetas distintas. Solo datos ficticios.');
 }finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
