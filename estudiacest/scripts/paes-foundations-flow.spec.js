'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),file=path.join(root,'api/paes.js'),requireApi=createRequire(file),bank=require('../api/_paes-foundations');
const STUDENT={rut:'111111111',nombre:'ESTUDIANTE DE PRUEBA',curso:'3A-HC'};
// Identidad ficticia en el entorno aislado; nunca la identidad asignada de producción.
const GUIDED={rut:'222222222',nombre:'LECTOR DE PRUEBA',curso:'3A-HC'};
let server,origin,state,handler,failDraft=false,delayDraft=0;
const clone=x=>x==null?null:JSON.parse(JSON.stringify(x));
const get=p=>p.split('/').reduce((v,k)=>v?.[k],state)??null;
function set(p,v){const keys=p.split('/'),last=keys.pop();let o=state;keys.forEach(k=>o=o[k]??={});if(v===null)delete o[last];else o[last]=clone(v);}
const snapshot=v=>({val:()=>clone(v),exists:()=>v!=null});
const db={ref:p=>({once:async()=>snapshot(get(p)),set:async v=>set(p,v),remove:async()=>set(p,null),transaction:async fn=>{const value=fn(clone(get(p)));if(value===undefined)return{committed:false,snapshot:snapshot(get(p))};set(p,value);return{committed:true,snapshot:snapshot(value)};}})};
test.use({browserName:'chromium'});test.setTimeout(60000);
test.beforeAll(async()=>{
 const admin={apps:[{}],database:()=>db,auth:()=>({verifyIdToken:async token=>({uid:token})})};
 const source=fs.readFileSync(file,'utf8').replace(/const GUIDED_ACCESS_RUT = '\d+';/,`const GUIDED_ACCESS_RUT = '${GUIDED.rut}';`);
 const ctx={module:{exports:{}},exports:{},require:name=>name==='firebase-admin'?admin:requireApi(name),process,console:{...console,error:()=>{}},Buffer,URL,Date};vm.runInNewContext(source,ctx,{filename:file});handler=ctx.module.exports;
 server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/api/paes'){
   let raw='';for await(const chunk of req)raw+=chunk;req.body=raw?JSON.parse(raw):{};req.query=Object.fromEntries(url.searchParams);res.status=code=>{res.statusCode=code;return res;};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));return res;};
   if(req.query.action==='submit-guia'&&req.body.draft){if(failDraft)return res.status(503).json({error:'Interrupción de prueba'});if(delayDraft)await new Promise(r=>setTimeout(r,delayDraft));}
   return handler(req,res);
  }
  if(url.pathname==='/paes/js/nominas.js'){res.setHeader('Content-Type','application/javascript');res.end('const NOMINAS_PAES='+JSON.stringify([STUDENT,GUIDED])+';');return;}
  if(url.pathname==='/favicon.ico'){res.statusCode=204;res.end();return;}
  const target=path.resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));if(!target.startsWith(root+path.sep)){res.statusCode=403;res.end();return;}
  try{res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json'}[path.extname(target)]||'application/octet-stream')+'; charset=utf-8');res.end(fs.readFileSync(target));}catch(_){res.statusCode=404;res.end();}
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));origin=`http://127.0.0.1:${server.address().port}`;
});
test.beforeEach(()=>{state={plataforma_estudiantes:{admins:{teacher:true}}};failDraft=false;delayDraft=0;});
test.afterAll(async()=>{server.closeAllConnections();await new Promise(r=>server.close(r));});
async function api(action,body,admin=false){return fetch(origin+'/api/paes?action='+action,body?{method:'POST',headers:{'Content-Type':'application/json',...(admin?{Authorization:'Bearer teacher'}:{})},body:JSON.stringify(body)}:{headers:admin?{Authorization:'Bearer teacher'}:{}});}
async function login(page,id,student=STUDENT,guided=false){await page.goto(`${origin}/paes/guia${id}${guided?'-guiada':''}.html`);await page.locator('#rutInput').fill(student.rut);await page.locator('#loginForm button').click();await expect(page.locator('#session')).toBeVisible();}
for(const width of [390,1440,3840])test(`Regular G1–G9: entrega, recarga y publicación a ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width===3840?2160:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(let id=1;id<=9;id++){
  await login(page,id);await expect(page.locator('.question')).toHaveCount(12);await expect(page.locator('#method')).toContainText('Observa cómo se decide');
  await page.locator('#question-1 .option').first().click();await page.locator('#question-1 .flag').click();await page.locator('[data-tab="2"]').click();await page.locator('#question-7 .option').last().click();await expect(page.locator('#question-7 .level')).toHaveCount(0);await page.locator('[data-tab="4"]').click();await page.locator('#evidence').fill('Pregunta 1: evidencia de prueba.');
  await expect(page.locator('#savedState')).toHaveText('Guardado en línea');await page.evaluate(()=>localStorage.clear());await page.reload();await page.locator('#rutInput').fill(STUDENT.rut);await page.locator('#loginForm button').click();await expect(page.locator('#session')).toBeVisible();await expect(page.locator('#answeredInfo')).toHaveText('2 de 12 marcadas');
  await page.locator('[data-tab="4"]').click();await expect(page.locator('#evidence')).toHaveValue('Pregunta 1: evidencia de prueba.');await page.locator('#submit').click();await expect(page.locator('#confirmDialog')).toBeVisible();await expect(page.locator('#resultBox')).toBeHidden();await page.locator('#closeDialog').click();
  const saved=get(`plataforma_paes/guia_respuestas/${id}/${STUDENT.rut}`);expect(saved.submitted&&saved.completada).toBe(true);expect(saved.submittedAt).toBe(saved.completadaAt);expect(saved.total).toBe(12);
  const closed=await(await api(`get-guia-state&guiaId=${id}&rut=${STUDENT.rut}`)).json();expect(closed.answerKey).toBeNull();expect(closed.feedback).toBeNull();expect(closed.attempt.result).toBeUndefined();
  const teacher=await(await api('admin-get-results',null,true)).json();expect(teacher.guia_respuestas[id][STUDENT.rut].adminKey).toEqual(bank.KEYS[id]);
  await api('admin-set-guia-release',{guiaId:String(id),scope:'all',released:true},true);await page.reload();await page.locator('#rutInput').fill(STUDENT.rut);await page.locator('#loginForm button').click();await expect(page.locator('#resultBox')).toBeVisible();await expect(page.locator('#skillSummary')).toContainText('Evaluación independiente');await expect(page.locator('#question-1 .option').first()).toBeDisabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 expect(errors).toEqual([]);await page.screenshot({path:test.info().outputPath(`foundations-${width}.png`),fullPage:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:test.info().outputPath(`viewport-${width}.png`)});
});
test('Guiadas G1–G9: derivación, seis preguntas, voz, clave diferenciada e inmutabilidad',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(let id=1;id<=9;id++){
  const redirect=await(await api(`get-foundation&guiaId=${id}&rut=${GUIDED.rut}&mode=regular`)).json();expect(redirect.redirect).toBe(`guia${id}-guiada.html`);
  const deny=await(await api(`get-foundation&guiaId=${id}&rut=${STUDENT.rut}&mode=guided`)).json();expect(deny.redirect).toBe(`guia${id}.html`);
  await login(page,id,GUIDED,true);await expect(page.locator('.question')).toHaveCount(6);await expect(page.locator('.question:visible')).toHaveCount(1);await expect(page.locator('#readAloud')).toBeVisible();await page.locator('#question-1 .option').first().click();await page.locator('#guidedNext').click();await expect(page.locator('#question-2')).toBeVisible();await page.locator('[data-tab="4"]').click();await page.locator('#submit').click();await expect(page.locator('#confirmDialog')).toBeVisible();
  const record=get(`plataforma_paes/guia_respuestas/${id}/${GUIDED.rut}`);expect(record.total).toBe(6);expect(record.variant).toBe('guided-access-2026');const late=await api('submit-guia',{...GUIDED,guiaId:String(id),contentVersion:bank.VERSION,answers:{1:'D'},draft:true});expect(late.status).toBe(409);expect(get(`plataforma_paes/guia_respuestas/${id}/${GUIDED.rut}`)).toEqual(record);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});
test('Fallo de red conserva avance; la entrega espera el borrador en vuelo',async({page})=>{
 await login(page,1);failDraft=true;await page.locator('#question-1 .option').first().click();await expect(page.locator('#savedState')).toContainText('Sin conexión');await page.reload();failDraft=false;await page.locator('#rutInput').fill(STUDENT.rut);await page.locator('#loginForm button').click();await expect(page.locator('#answeredInfo')).toHaveText('1 de 12 marcadas');
 delayDraft=1100;await page.locator('#question-2 .option').first().click();await expect(page.locator('#savedState')).toHaveText('Guardando…');await page.locator('[data-tab="4"]').click();await page.locator('#submit').click();await expect(page.locator('#confirmDialog')).toBeVisible();expect(get(`plataforma_paes/guia_respuestas/1/${STUDENT.rut}`).status).toBe('sent');
});
test('Servidor: versión anterior protegida, puntaje no confiado al cliente, admin protegido',async()=>{
 const legacy={answers:{1:'A'},status:'sent',submitted:true,completada:true};set(`plataforma_paes/guia_respuestas/1/${STUDENT.rut}`,legacy);
 expect((await api(`get-guia-state&guiaId=1&rut=${STUDENT.rut}`)).status).toBe(409);
 expect((await api('submit-guia',{...STUDENT,guiaId:'1',contentVersion:bank.VERSION,answers:{},draft:false})).status).toBe(409);expect(get(`plataforma_paes/guia_respuestas/1/${STUDENT.rut}`)).toEqual(legacy);
 expect((await api('admin-get-results')).status).toBe(401);
 expect((await api('admin-get-foundation&guiaId=1')).status).toBe(401);
 expect((await api('submit-guia',{...STUDENT,guiaId:'2',answers:{},draft:false})).status).toBe(400);
 await api('submit-guia',{...STUDENT,guiaId:'2',contentVersion:bank.VERSION,answers:{1:bank.KEYS[2][1],99:'A'},total:99,correct:99,score:100,draft:false});const saved=get(`plataforma_paes/guia_respuestas/2/${STUDENT.rut}`);expect(saved.total).toBe(12);expect(saved.correct).toBe(1);expect(saved.answers[99]).toBeUndefined();
});

test('Panel docente real: selector G1–9, respuestas y pautas regular/acompañada',async({page})=>{
 for(let id=1;id<=9;id++)await api('submit-guia',{...STUDENT,guiaId:String(id),contentVersion:bank.VERSION,answers:{1:bank.KEYS[id][1]},dev:{evidence:'Justificación de prueba'},draft:false});
 await page.route('https://www.gstatic.com/firebasejs/**',route=>route.fulfill({contentType:'application/javascript',body:`window.firebase={initializeApp(){},auth(){return {currentUser:{getIdToken:async()=> 'teacher'},onAuthStateChanged(cb){setTimeout(()=>cb({uid:'teacher',email:'docente@example.invalid',getIdToken:async()=> 'teacher'}),0)},signOut:async()=>{}}},database(){return {ref(p){return {once:async()=>({exists:()=>p.includes('/admins/'),val:()=>p.includes('/admins/')?true:null})}}}}};`}));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/paes/admin/');await expect(page.locator('#gateOverlay')).toBeHidden();
 await page.locator('.nav-btn[data-tab="guiasint"]').click();
 for(let id=1;id<=9;id++){
  await page.locator('#selectGuia').selectOption(String(id));await expect(page.locator('#guiaIntTableBody')).toContainText(STUDENT.nombre);
  await page.getByRole('button',{name:'Pauta G1–9',exact:true}).click();await expect(page.locator('#foundationPautaContent')).toContainText(bank.guides[id-1].title);await expect(page.locator('#foundationPautaContent > details')).toHaveCount(14);
  await page.getByRole('button',{name:'Acompañada',exact:true}).click();await expect(page.locator('#foundationPautaContent > details')).toHaveCount(7);await expect(page.locator('#foundationPautaContent')).toContainText('Reformulación simple');
  await page.getByRole('button',{name:'Cerrar pauta',exact:true}).click();
 }
 await page.evaluate(()=>{currentGuia='1';openGuiaModal('111111111');});await expect(page.locator('#gmDevList')).toContainText('Justificación de prueba');
 expect(errors).toEqual([]);
});
