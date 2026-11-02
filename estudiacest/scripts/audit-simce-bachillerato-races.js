'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {harness,call}=require('./audit-simce-bachillerato');
async function main(){
 const {server,db}=harness();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true}),findings=[],passed=[];
 const sdk=`window.firebase ||= {initializeApp:()=>({auth:()=>({onAuthStateChanged:fn=>queueMicrotask(()=>fn({uid:'s0',getIdToken:async()=>'s0'}))})})};`;
 async function context(){const c=await browser.newContext();await c.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body:sdk}));return c;}
 async function room(letter='M'){
  const code=(await call(origin,'create','host',{course:'2A-HC'})).data.code;
  await call(origin,'join','s0',{code});await call(origin,'start','host',{code,mode:'classic',letter,categories:['Nombre','Animal','Lugar'],seconds:120});return code;
 }
 async function test(name,fn){try{await fn();passed.push(name);}catch(e){findings.push({name,error:e.message.slice(0,240)});}}
 try{
  await test('Librerías no cargadas ofrecen reintento sin excepción JavaScript',async()=>{
   for(const body of ['', 'window.firebase={initializeApp:()=>({})};']){
    const c=await browser.newContext(),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
    await c.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'application/javascript',body}));
    try{await p.goto(origin+'/estudiantes/bachillerato/');await p.locator('#reloadConnection').waitFor();assert.equal(errors.length,0);assert.match(await p.locator('#notice').textContent(),/Revisa la red/);}finally{await c.close();}
   }
  });
  await test('Una respuesta tardía de la ronda anterior no bloquea la siguiente',async()=>{
   const code=await room(),c=await context(),page=await c.newPage();let release,committed;const gate=new Promise(r=>release=r),saved=new Promise(r=>committed=r);let held=false;
   await page.route('**/api/estudiantes?**',async route=>{const req=route.request(),b=req.postDataJSON();if(!held&&req.url().includes('bachillerato-save')&&b?.round===1){held=true;const response=await route.fetch();committed();await gate;await route.fulfill({response});}else await route.continue();});
   try{
    await page.goto(origin+'/estudiantes/bachillerato/?sala='+code);await page.locator('#answer0').fill('María');await saved;
    await call(origin,'stop','host',{code,round:1});await call(origin,'publish','host',{code,round:1});await call(origin,'start','host',{code,mode:'reading',reading:0,seconds:120});
    await page.waitForFunction(()=>document.querySelector('#roundNumber').textContent==='RONDA 2');release();
    await page.waitForResponse(r=>r.url().includes('bachillerato-save')).catch(()=>{});
    await page.locator('#answer0').fill('Se levanta y ofrece el asiento.');await page.locator('#submit').click();
    await page.waitForFunction(()=>/Entrega confirmada|Otra pestaña/.test(document.querySelector('#saveStatus').textContent));
    const record=(await db.ref('plataforma_estudiantes/bachillerato/salas/'+code+'/rounds/2/answers/s0').once('value')).val();assert.ok(record?.submitted,'La ronda nueva debe poder entregar con su propia versión.');
   }finally{release();await c.close();}
  });
  await test('Una entrega desde otra pestaña muestra las respuestas canónicas',async()=>{
   const code=await room(),c=await context(),a=await c.newPage(),b=await c.newPage();
   try{
    await a.goto(origin+'/estudiantes/bachillerato/?sala='+code);await a.locator('#answer0').waitFor();await b.goto(origin+'/estudiantes/bachillerato/?sala='+code);await b.locator('#answer0').fill('Manuel');await b.locator('#submit').click();
    await a.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Entrega confirmada'));
    assert.equal(await a.locator('#answer0').inputValue(),'Manuel');
   }finally{await c.close();}
  });
  await test('Un borrador local ya sincronizado no reemplaza una versión remota nueva',async()=>{
   const code=await room(),c=await context(),page=await c.newPage();
   try{
    await page.goto(origin+'/estudiantes/bachillerato/?sala='+code);await page.locator('#answer0').fill('María');await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent==='Guardado en la sala.');
    const record=(await call(origin,'state','s0',{code},true)).data.own;
    await call(origin,'save','s0',{code,round:1,version:record.version,requestId:'second-device',answers:['Manuel','',''],final:false});
    await page.reload();await page.locator('#answer0').waitFor();assert.equal(await page.locator('#answer0').inputValue(),'Manuel');
   }finally{await c.close();}
  });
  await test('La letra Ñ se distingue de la N al asignar puntos',async()=>{
   const code=await room('Ñ');await call(origin,'join','s1',{code});
   await call(origin,'save','s0',{code,round:1,version:0,requestId:'enye',answers:['Ñandú','Ñu','Ñoqui'],final:true});
   await call(origin,'save','s1',{code,round:1,version:0,requestId:'ene',answers:['Nicolás','Nutria','Nápoles'],final:true});
   await call(origin,'stop','host',{code,round:1});await call(origin,'publish','host',{code,round:1});const state=(await call(origin,'state','s1',{code},true)).data;assert.deepEqual(state.ownGrade,[0,0,0]);
  });
  console.log(JSON.stringify({passed,findings},null,2));if(findings.length&&!process.argv.includes('--diagnose'))process.exitCode=1;
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
