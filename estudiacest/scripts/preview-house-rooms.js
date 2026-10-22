// Flujo real con funciones y datos ficticios. No escribe en producción.
'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),{chromium}=require('playwright');
const fixture=require('./preview-paes-avatar-prizes'),mapas=require('../estudiantes/js/mapas-casa'),catalogo=require('../estudiantes/js/catalogo-casa');
const av=fixture.state.datos.plataforma_estudiantes.avatar,root=path.join(__dirname,'..');
av.studentA.casa={tamano:'7x7',piso:'claro',muro:'blanco'};av.studentA.pieza=[{id:'chairDesk',col:0,fila:2,dir:'SE'}];av.studentA.personajeEn={col:2,fila:3};
av.studentA.regalos.chairDesk={tipo:'docente',de:'Profe',ts:1};
// Ocupar el borde superior obliga a probar una puerta en el muro izquierdo.
av.studentB={casa:{tamano:'5x5'},pieza:[...Array.from({length:5},(_,col)=>({id:'chairDesk',col,fila:0,dir:'SE'})),...Array.from({length:4},(_,fila)=>({id:'chairDesk',col:4,fila:fila+1,dir:'SE'}))]};
const academic=JSON.stringify(fixture.state.datos.plataforma_paes),legacyCasa=JSON.stringify(av.studentA.casa);
(async()=>{
 const server=await fixture.start(),browser=await chromium.launch({headless:true}),base='http://127.0.0.1:'+server.address().port;
 try{
  const page=await browser.newPage({viewport:{width:1200,height:1000}}),errors=[],actions=[];
  await page.addInitScript(()=>{
   const fill=CanvasRenderingContext2D.prototype.fillRect;
   CanvasRenderingContext2D.prototype.fillRect=function(x,y,w,h){
    if(this.canvas.id==='espLienzo'&&this.fillStyle==='#172b40'){const m=this.getTransform();window.qaDoor={x,y,w,h,m:[m.a,m.b,m.c,m.d,m.e,m.f]};}
    return fill.call(this,x,y,w,h);
   };
  });
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+new URL(r.url()).pathname);});page.on('request',r=>{if(r.url().endsWith('/api/estudiantes'))actions.push(r.postDataJSON());});
  const loaded=async()=>{await page.locator('[data-p="pieza"]').click();await page.locator('#espPuerta:not([disabled])').waitFor();};
  const room=async(name)=>{await page.locator('#espSalaCab').filter({hasText:'· '+name}).waitFor();await page.locator('#espPuerta:not([disabled])').waitFor();};
  const waitSaved=async()=>{await page.locator('.esp-estado').filter({hasText:'Guardado'}).waitFor();};
  const until=async(predicate,message)=>{const end=Date.now()+10000;while(!predicate()&&Date.now()<end)await page.waitForTimeout(50);if(!predicate()){console.log(JSON.stringify({actions:actions.slice(-8),aviso:await page.locator('.esp-aviso').textContent(),estado:await page.locator('.esp-estado').textContent()}));await page.screenshot({path:path.join(root,'../scratch/habitaciones-diagnostico.png')});}assert.ok(predicate(),message);};
  const tile=async(col,fila)=>{
   const h=av.studentA.habitaciones?.actual||'principal',house=mapas.habitacion(av.studentA,h).casa,m=mapas.obtener(house.tamano),n=house.tamano==='7x7'?7:5,cols=m?m.cols:n,filas=m?m.filas:n;
   return page.locator('#espLienzo').evaluate((cv,{col,fila,cols,filas})=>{const W=cv.clientWidth,H=cv.clientHeight,z=Math.min(1,(W-16)/((cols+filas)*75+151),(H-16)/((cols+filas)*53+106+132));const x=W/2-151/2+(filas-cols)/2*75+(col-fila)*75+151/2,y=(H-(cols+filas)*53)/2+26+(col+fila)*53+53;return{x:W/2+(x-W/2)*z,y:H/2+(y-H/2)*z};},{col,fila,cols,filas});
  };
  const door=async(side,col,fila,cols,filas,label)=>{
   const point=await page.locator('#espLienzo').evaluate((cv,{side,col,fila,cols,filas,label})=>{
    const d=window.qaDoor;if(!d)throw Error('No se dibujó la puerta');
    const [a,b,c,e,tx,ty]=d.m,dpr=devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;
    const project=(x,y)=>({x:(a*x+c*y+tx)/dpr,y:(b*x+e*y+ty)/dpr});
    const left=project(d.x,d.y+d.h),right=project(d.x+d.w,d.y+d.h),top=project(d.x,d.y);
    if(!(top.y<left.y&&Math.abs((right.y-left.y)/(right.x-left.x)-(side==='der'?53/75.5:-53/75.5))<.001))throw Error('Perspectiva invertida');
    const z=Math.min(1,(W-16)/((cols+filas)*75+151),(H-16)/((cols+filas)*53+106+132));
    const ox=W/2-75.5+(filas-cols)/2*75,oy=(H-(cols+filas)*53)/2+26;
    const nx=ox+(col-fila)*75+75.5,ny=oy+(col+fila)*53;
    const expectedX=nx+(side==='der'?1:-1)*75.5*.15,expectedY=ny+53*.15;
    const edge=side==='der'?left:right;
    if(Math.hypot(edge.x-(W/2+(expectedX-W/2)*z),edge.y-(H/2+(expectedY-H/2)*z))>1)throw Error('El umbral no se apoya en el muro');
    return label?project(d.x+d.w/2,Math.min(d.y,d.y+(b/a)*d.w)-20):project(d.x+d.w/2,d.y+d.h*.35);
   },{side,col,fila,cols,filas,label});
   await page.locator('#espLienzo').click({position:point});
  };
  await page.goto(base+'/preview-student');await loaded();assert.equal(await page.locator('#espCaminar').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.esp-acciones').isVisible(),false);
  // Retarget durante un paso y detener en una casilla, no al origen redondeado.
  await page.locator('#espLienzo').click({position:await tile(6,6)});await page.waitForTimeout(120);await page.locator('#espLienzo').click({position:await tile(1,3)});await until(()=>av.studentA.personajeEn.col===1&&av.studentA.personajeEn.fila===3,'El nuevo destino queda confirmado');
  const stopResponse=page.waitForResponse(r=>r.url().endsWith('/api/estudiantes')&&r.request().postDataJSON()?.action==='salas-guardar-posicion');await page.locator('#espLienzo').click({position:await tile(6,6)});await page.waitForTimeout(100);await page.locator('#espDetener').click();await stopResponse;assert.notDeepEqual(av.studentA.personajeEn,{col:6,fila:6});
  await page.locator('#espLienzo').screenshot({path:path.join(root,'../scratch/puerta-principal.png')});
  await door('der',6,0,7,7,false);await room('Estudio');assert.equal(av.studentA.habitaciones.actual,'estudio');assert.equal(av.studentA.habitaciones.estudio?.pieza?.length||0,0);
  await page.locator('#espLienzo').screenshot({path:path.join(root,'../scratch/puerta-estudio.png')});
  // Una colocación real, guardado confirmado y viaje inmediato con cola pendiente.
  await page.locator('#espRejilla [data-id="playStation5"]').click();assert.equal(await page.locator('#espDecorar').getAttribute('aria-pressed'),'true');await page.locator('#espLienzo').click({position:await tile(1,2)});
  await page.locator('#espPuerta').click();await room('Principal');assert.equal(av.studentA.habitaciones.estudio.pieza[0].id,'playStation5');assert.equal(av.studentA.pieza[0].id,'chairDesk');assert.equal(JSON.stringify(av.studentA.casa),legacyCasa);
  await page.locator('#espRejilla [data-id="playStation5"]').click();await page.locator('.esp-aviso').filter({hasText:'otra habitación'}).waitFor();assert.equal(av.studentA.pieza.some(p=>p.id==='playStation5'),false);
  await page.locator('#espPuerta').click();await room('Estudio');await page.reload();await loaded();await room('Estudio');assert.equal(av.studentA.habitaciones.estudio.pieza[0].id,'playStation5');
  await page.locator('#espDecorar').click();await page.locator('#espSig').click();await page.locator('#espQuitar').click();await until(()=>av.studentA.habitaciones.estudio.pieza.length===0,'La PS5 se guarda en el inventario');
  await page.locator('#espPuerta').click();await room('Principal');await page.locator('#espRejilla [data-id="playStation5"]').click();await page.locator('#espLienzo').click({position:await tile(1,2)});await until(()=>av.studentA.pieza.some(p=>p.id==='playStation5'),'El traslado de PS5 queda confirmado');
  await page.locator('#espCaminar').click();
  for(const width of [390,1200,3840]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('.esp-panel[data-panel="pieza"]').screenshot({path:path.join(root,'../scratch/habitaciones-'+width+'.png')});await door('der',6,0,7,7,false);await room('Estudio');await door('der',4,0,5,5,true);await room('Principal');}
  await page.setViewportSize({width:1200,height:1000});await page.locator('#espVisitar').click();await page.locator('#espVisitas [data-uid="studentB"]').click();await page.locator('#espVolver').waitFor();assert.equal(await page.locator('#espDecorar').isDisabled(),true);assert.equal(await page.locator('#espMueblesBloque').isVisible(),false);
  await page.locator('#espLienzo').screenshot({path:path.join(root,'../scratch/puerta-izquierda-visita.png')});
  await door('izq',0,1,5,5,false);await room('Estudio');assert.ok(fixture.state.datos.plataforma_estudiantes.salas.studentB.habitaciones.estudio.presentes.studentA);await door('der',4,0,5,5,true);await room('Principal');await page.locator('#espVolver').click();await page.locator('#espVisitar').waitFor();
  // Chat separado por habitación, usando el mismo token (sin segunda pantalla de login).
  await page.locator('#espPuerta').click();await room('Estudio');await page.locator('#espChatTexto').fill('Hola desde mi estudio');await page.locator('#espChatForm button').click();await page.locator('#espChatLista').filter({hasText:'Hola desde mi estudio'}).waitFor();
  // Guardado rechazado: no perder la decoración ni cambiar de sala sin confirmar.
  let failSave=true;
  await page.route('**/api/estudiantes',async route=>{if(failSave&&route.request().postDataJSON()?.action==='salas-guardar-casa'){failSave=false;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,error:'Fallo simulado de guardado'})});}else await route.continue();});
  await page.locator('#espTerreno [data-t="tamano"]').click();await page.locator('#espPaleta [data-id="7x7"]').click();await page.locator('.esp-estado.malo').waitFor();
  const transitionsBefore=actions.filter(a=>a.action==='salas-pasar-puerta').length;
  await page.locator('#espPuerta').click();await page.locator('.esp-aviso').filter({hasText:'Fallo simulado'}).waitFor();assert.equal(actions.filter(a=>a.action==='salas-pasar-puerta').length,transitionsBefore);assert.equal(av.studentA.habitaciones.actual,'estudio');
  await page.locator('#espTerreno [data-t="tamano"]').click();await page.locator('#espPaleta [data-id="7x7"]').click();await until(()=>av.studentA.habitaciones.estudio.casa.tamano==='7x7','Reintento confirmado');await page.locator('#espPuerta').click();await room('Principal');
  // La función cruzó, pero se perdió su respuesta: la presencia permite recuperar.
  let loseResponse=true;
  await page.route('**/api/estudiantes',async route=>{if(loseResponse&&route.request().postDataJSON()?.action==='salas-pasar-puerta'){loseResponse=false;await route.fetch();await route.abort('failed');}else await route.continue();});
  await page.locator('#espPuerta').click();await room('Estudio');await page.locator('.esp-aviso').filter({hasText:'Entrada recuperada'}).waitFor();assert.equal(av.studentA.habitaciones.actual,'estudio');
  assert.ok(actions.some(a=>a.action==='salas-pasar-puerta'));assert.ok(actions.filter(a=>a.action==='salas-guardar-pieza').every(a=>['principal','estudio'].includes(a.habitacion)));
  assert.equal(JSON.stringify(fixture.state.datos.plataforma_paes),academic);assert.deepEqual(errors,[]);
  console.log('Navegador/funciones: puertas apoyadas en ambos muros, perspectiva y clic en puerta/letrero; ida/vuelta en 390/1200/3840, retarget/parada, cola de guardado, PS5 única trasladada, recarga, visita sin edición, chat, fallo/reintento y respuesta perdida recuperada. Sin errores; solo datos ficticios.');
 }finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
