// Prueba real de navegador y funciones, exclusivamente con identidades ficticias.
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {createHouseFixture}=require('./audit-paes-house-admin');
const salas=require('../api/_salas');
const {decorateFixture}=require('./audit-house-rooms');
const root=path.join(__dirname,'..'),fixture=decorateFixture(createHouseFixture()),{state,db}=fixture;
const academicBefore=JSON.stringify(state.datos.plataforma_paes);
state.datos.plataforma_estudiantes.configuracion={mi_espacio:{enabled:true}};
const raw=fs.readFileSync(path.join(root,'paes/admin/index.html'),'utf8');
const css=raw.match(/<style>([\s\S]*?)<\/style>/)[1];
const section=raw.slice(raw.indexOf('<section class="tab-view" id="viewCasas">'),raw.indexOf('</main>',raw.indexOf('id="viewCasas"')));
const adminPage=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><main>${section.replace('class="tab-view"','class="tab-view active"')}</main><script src="/estudiantes/js/personaje-iso.js"></script><script src="/paes/admin/premios.js"></script><script src="/paes/admin/experiencia.js"></script><script src="/paes/admin/casas.js"></script><script>PaesCasasAdmin.mount({auth:{currentUser:{getIdToken:async()=> 'teacherA'}},getGuideData:()=>({}),refreshGuides:async()=>{},reviewGuide:()=>{}}).load();</script></body></html>`;
const studentPage=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/estudiantes/css/mi-espacio.css"></head><body style="margin:0;background:#0f172a"><main id="host" style="max-width:1100px;margin:auto"></main>${['avatar-levels','catalogo-casa','personaje-iso','mapas-casa','mi-espacio'].map(n=>'<script src="/estudiantes/js/'+n+'.js"></script>').join('')}<script>
const listeners=new Map();
const ref=key=>({once:async()=>{const v=await(await fetch('/qa-state?path='+encodeURIComponent(key))).json();return {val:()=>v,exists:()=>v!=null};},child:c=>ref(key+'/'+c),on:(event,callback)=>{let previous='',seen=new Set();const read=async()=>{const snap=await ref(key).once(),json=JSON.stringify(snap.val());if(event==='value'&&json!==previous){previous=json;callback(snap);}if(event==='child_added')Object.entries(snap.val()||{}).forEach(([id,value])=>{if(!seen.has(id)){seen.add(id);callback({key:id,val:()=>value});}});};const timer=setInterval(()=>read().catch(()=>{}),200);listeners.set(key,[...(listeners.get(key)||[]),timer]);read().catch(()=>{});},off:()=>{(listeners.get(key)||[]).forEach(clearInterval);listeners.delete(key);},orderByChild:()=>ref(key),limitToLast:()=>ref(key),set:async value=>{const r=await fetch('/qa-state',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,value})});if(!r.ok)throw Error('Guardado rechazado');}});
(async()=>{const av=(await ref('plataforma_estudiantes/avatar/studentA').once()).val()||{};MiEspacio.montar({host:document.getElementById('host'),db:{ref},auth:{currentUser:{getIdToken:async()=> 'studentA'}},base:'plataforma_estudiantes',uid:'studentA',nombre:'Estudiante de prueba',curso:'3B-HC',xp:AvatarSystem.totalXP(av),look:av.look,regalos:av.regalos,logros:av.logros,placas:av.placas,pieza:av.pieza||[],personajeEn:av.personajeEn,casa:av.casa||{tamano:'9x9'}});})();</script></body></html>`;
async function start(){
  const server=http.createServer(async(req,res)=>{
    try{
      const url=new URL(req.url,'http://127.0.0.1');let text='';for await(const chunk of req)text+=chunk;
      const body=text?JSON.parse(text):{};
      if(url.pathname==='/favicon.ico'){res.writeHead(204).end();return;}
      if(url.pathname==='/preview-admin'||url.pathname==='/preview-student'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(url.pathname==='/preview-admin'?adminPage:studentPage);return;}
      if(url.pathname==='/qa-state'){
        res.setHeader('Content-Type','application/json');
        if(req.method==='GET'){const snap=await db.ref(url.searchParams.get('path')).once('value');res.end(JSON.stringify(snap.val()));return;}
        if(!/^plataforma_estudiantes\/avatar\/studentA\/(look|placas|personajeEn)$/.test(body.key)){res.writeHead(403).end('{}');return;}
        await db.ref(body.key).transaction(()=>body.value);res.end('{}');return;
      }
      if(url.pathname==='/api/paes'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({success:true,estudiantes:Object.entries(state.profiles).filter(([,p])=>!p.ocultarDeCasas).map(([uid,p])=>({uid,...p}))}));return;}
      if(url.pathname==='/api/estudiantes'){
        const response={code:200,setHeader:(n,v)=>res.setHeader(n,v),status(code){this.code=code;return this;},json(value){res.writeHead(this.code,{'Content-Type':'application/json'});res.end(JSON.stringify(value));}};
        await salas.manejar({method:req.method,headers:req.headers,body},response,String(body.action||'').replace(/^salas-/,''),db,{verifyIdToken:async()=>({uid:String(req.headers.authorization||'').replace('Bearer ','')})});return;
      }
      const file=path.resolve(root,'.'+url.pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end('');return;}
      res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'image/png');res.end(fs.readFileSync(file));
    }catch(error){res.writeHead(500,{'Content-Type':'application/json'}).end(JSON.stringify({error:error.message}));}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return server;
}
module.exports={start,state,db};
if(require.main===module)(async()=>{
  const server=await start(),browser=await chromium.launch({headless:true}),base='http://127.0.0.1:'+server.address().port;
  try{
    const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status());});
    await page.goto(base+'/preview-admin');await page.locator('#houseStudent').selectOption('studentA');
    await page.locator('#avatarPrizePanel summary').click();
    await page.locator('#avatarPrizeStatus').filter({hasText:'Elige y confirma'}).waitFor();
    assert.equal(await page.locator('#avatarPrizeCatalog .house-item').count(),10);
    await page.locator('#avatarPrizeCatalog .house-item').first().getByRole('button',{name:'Regalar',exact:true}).click();await page.locator('#avatarPrizeGive').click();await page.locator('#avatarPrizeStatus').filter({hasText:'recibido'}).waitFor();
    await page.locator('#avatarPrizeType').selectOption('equipos');assert.equal(await page.locator('#avatarPrizeCatalog canvas').count(),6);
    const rangers=page.locator('#avatarPrizeCatalog .house-item').filter({hasText:'Rangers de Talca'});await rangers.getByRole('button',{name:'Regalar',exact:true}).click();await page.locator('#avatarPrizeGive').click();await page.locator('#avatarPrizeStatus').filter({hasText:'recibido'}).waitFor();
    await page.reload();await page.locator('#houseStudent').selectOption('studentA');await page.locator('#avatarPrizePanel summary').click();await page.locator('#avatarPrizeStatus').filter({hasText:'Elige y confirma'}).waitFor();await page.locator('#avatarPrizeType').selectOption('equipos');assert.equal(await rangers.getByRole('button',{name:'Ya recibido'}).isDisabled(),true);
    for(const width of [390,1200,3840]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('#avatarPrizeCatalog').screenshot({path:path.join(root,'../scratch/premios-avatar-'+width+'.png')});}
    await page.goto(base+'/preview-student');await page.locator('#espRopero').waitFor();
    await Promise.all([page.waitForResponse(r=>r.url().endsWith('/qa-state')&&r.request().method()==='POST'&&r.request().postDataJSON().key.endsWith('/look')),page.locator('[data-cat="arriba"][data-op="camisetaRangers"]').click()]);
    await Promise.all([page.waitForResponse(r=>r.url().endsWith('/qa-state')&&r.request().method()==='POST'&&r.request().postDataJSON().key.endsWith('/placas')),page.locator('#espPlacas [data-id="docente_constancia"]').click()]);
    await page.reload();await page.locator('[data-cat="arriba"][data-op="camisetaRangers"].sel').waitFor({state:'attached'});
    assert.ok((await db.ref('plataforma_estudiantes/avatar/studentA/placas').once('value')).val().includes('docente_constancia'));
    assert.equal(JSON.stringify(state.datos.plataforma_paes),academicBefore);assert.deepEqual(errors,[]);
    console.log('Navegador real: 10 logros, 6 camisetas distintas, regalo y recarga marcada, ropa equipada persistente y placa equipada; 390/1200/3840 sin desborde ni errores. Solo datos ficticios.');
  }finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
