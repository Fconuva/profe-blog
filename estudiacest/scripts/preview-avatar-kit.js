// Navegador y funciones reales con cuentas ficticias. No toca producción.
'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright'),fixture=require('./preview-paes-avatar-prizes');
const root=path.join(__dirname,'..'),avatars=fixture.state.datos.plataforma_estudiantes.avatar;
avatars.studentA.regalos.ropa__arriba__camisetaRangers={tipo:'docente',ts:1};
const academicsBefore=JSON.stringify(fixture.state.datos.plataforma_paes);
async function main(){
 const server=await fixture.start(),browser=await chromium.launch({headless:true}),base='http://127.0.0.1:'+server.address().port;
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+new URL(r.url()).pathname);});
  await page.goto(base+'/preview-student');await page.locator('#espRopero').waitFor();
  assert.equal(await page.locator('#espRopero .esp-op-imagen').count(),30);
  assert.equal(await page.locator('[data-gesto]').count(),10);assert.equal(await page.locator('[data-pose]').count(),10);
  for(const item of await page.evaluate(()=>AvatarLookSystem.KIT)){assert.equal((await page.request.get(base+item.url)).status(),200);}
  for(const [cat,op] of [['ojos','curiosos'],['boca','asombro'],['pelo','trenzas'],['arriba','camisetaRangers']]){
   await Promise.all([page.waitForResponse(r=>r.url().endsWith('/qa-state')&&r.request().method()==='POST'&&r.request().postDataJSON().key.endsWith('/look')),page.locator('[data-cat="'+cat+'"][data-op="'+op+'"]').click()]);
  }
  await page.reload();await page.locator('[data-cat="pelo"][data-op="trenzas"].sel').waitFor();
  for(const [cat,op] of [['ojos','curiosos'],['boca','asombro'],['arriba','camisetaRangers']])assert.equal(await page.locator('[data-cat="'+cat+'"][data-op="'+op+'"].sel').count(),1);
  await page.locator('.esp-kit').first().locator('summary').click();
  for(const pose of ['reposoSW','reposoNE','reposoNW','pasoSE','sentado','acostado']){
   await page.locator('[data-pose="'+pose+'"]').click();assert.equal(await page.locator('[data-pose="'+pose+'"]').getAttribute('aria-pressed'),'true');
  }
  for(const width of [390,1200,3840]){
   await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:path.join(root,'../scratch/avatar-kit-personaje-'+width+'.png')});
  }
  // El render real debe distinguir las opciones; no son solo miniaturas.
  const frames=await page.evaluate(()=>{
   const host=document.createElement('div');host.id='nativeAtlas';host.style='display:grid;grid-template-columns:repeat(10,120px);gap:4px;background:#223049;padding:12px;width:max-content';
   const rows=[];
   function draw(type,id,extra={}){
    const box=document.createElement('div');box.style='color:white;text-align:center;font:11px system-ui';const fig=document.createElement('div');box.appendChild(fig);box.append(id);host.appendChild(box);
    const look=AvatarLookSystem.getDefaultLook();if(['ojos','boca','pelo'].includes(type))look[type]=id;
    AvatarLookSystem.render(fig,{look,xpTotal:99999,size:112,t:1000,...extra});rows.push({type,id,png:fig.querySelector('canvas').toDataURL()});
   }
   for(const cat of ['ojos','boca','pelo'])for(const item of AvatarLookSystem.CATALOGO[cat].opciones)draw(cat,item.id);
   for(const item of AvatarLookSystem.GESTOS)draw('gesto',item.id,{gesto:item.id});
   for(const dir of ['SE','SW','NE','NW']){draw('dir',dir,{dir});draw('paso',dir,{dir,caminar:true});}
   draw('postura','sentado',{postura:'sentado'});draw('postura','acostado',{postura:'acostado'});
   document.body.appendChild(host);return rows;
  });
  for(const type of ['ojos','boca','pelo','gesto']){
   const rows=frames.filter(f=>f.type===type);const hashes=rows.map(f=>crypto.createHash('sha256').update(f.png).digest('hex'));
   assert.equal(new Set(hashes).size,10,'Diez variantes visualmente diferentes de '+type);
  }
  await page.locator('#nativeAtlas').screenshot({path:path.join(root,'../scratch/avatar-kit-nativo.png')});await page.evaluate(()=>document.getElementById('nativeAtlas').remove());
  await page.setViewportSize({width:1200,height:900});await page.locator('[data-p="pieza"]').click();await page.locator('.esp-kit-gestos summary').click();
  for(const g of await page.evaluate(()=>AvatarLookSystem.GESTOS)){
   const response=page.waitForResponse(r=>r.url().endsWith('/api/estudiantes')&&r.request().postDataJSON()?.action==='salas-latido');
   await page.locator('[data-gesto="'+g.id+'"]').click();assert.equal((await response).status(),200);
  }
  await page.locator('[data-gesto="celebrar"]').click();await page.screenshot({path:path.join(root,'../scratch/avatar-kit-casa.png')});
  await page.locator('#espLienzo').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(700);
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-gesto="aplaudir"]').click();
  assert.deepEqual(errors,[]);assert.equal(JSON.stringify(fixture.state.datos.plataforma_paes),academicsBefore);
  console.log('Navegador real: 50 recursos, 30 opciones persistentes, diez gestos distintos y API, cuatro vistas/poses con ropa propia, 390/1200/3840 sin errores/desbordes; solo datos ficticios.');
 }finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
