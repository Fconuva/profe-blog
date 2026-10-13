'use strict';
const assert=require('node:assert/strict'),http=require('http'),fs=require('fs'),path=require('path'),os=require('os');
const {exams,publicExam}=require('../api/_simce-u4-catalog');
const api=require('../api/_simce-u4');
const attempts=require('../api/_simce-admin-attempts');
const {standardSession}=require('./publish-simce-u4');
const ROOT=path.resolve(__dirname,'..'),BASE=api.BASE;
let checks=0;function check(condition,message){assert.ok(condition,message);checks++;}
const clone=v=>v==null?v:structuredClone(v);
const get=(state,route)=>route.split('/').filter(Boolean).reduce((n,k)=>n?.[k],state);
function put(state,route,value){const keys=route.split('/').filter(Boolean);let node=state;for(const k of keys.slice(0,-1))node=node[k] ||= {};if(value===null)delete node[keys.at(-1)];else node[keys.at(-1)]=clone(value);}
function fixture(){return {[BASE]:{admins:{teacher:true,teacherB:true},docentes:{teacher:{cursos:['2A-HC']},teacherB:{cursos:['2B-HC']}},estudiantes:{student:{nombre:'ESTUDIANTE FICTICIO',curso:'2A-HC',perfil_completo:true},studentB:{nombre:'ESTUDIANTE FICTICIO B',curso:'2B-HC',perfil_completo:true},other:{nombre:'OTRO FICTICIO',curso:'3A-HC',perfil_completo:true}},sesiones:Object.fromEntries(exams.map(e=>[e.sessionId,standardSession(e)])),respuestas:{},resultados:{}}};}
function mockDb(state=fixture(),retry=null){let lock=Promise.resolve();const db={state,ref(route){return {child:k=>db.ref(route+'/'+k),once:async()=>({val:()=>clone(get(state,route) ?? null)}),update:async values=>{for(const [k,v]of Object.entries(values))put(state,route+'/'+k,v);},transaction:async fn=>{const work=lock.then(()=>{assert.notEqual(route,BASE,'U4 no transacciona el nodo global');fn(null);if(retry){fn(clone(get(state,route)));retry(state);retry=null;}const next=fn(clone(get(state,route)));if(next===undefined)return {committed:false};put(state,route,next);return {committed:true,snapshot:{val:()=>clone(next)}};});lock=work.catch(()=>null);return work;}};}};return db;}
const auth={async verifyIdToken(token){if(token==='invalid')throw Error('invalid');return {uid:token};}};
async function call(db,action,token='student',body={},number='1',method=action.endsWith('state')||action.endsWith('review')||action.endsWith('example')?'GET':'POST'){
 let status=200,data,headers={};const res={setHeader(k,v){headers[k]=v;},status(v){status=v;return this;},json(v){data=v;}};
 await api.manejar({method,headers:{authorization:token?'Bearer '+token:''},query:{ensayo:number},body},res,action,db,auth);return {status,data,headers};
}
function measure(){
 const stats=[];
 for(const exam of exams){
  check(exam.texts.length===3,'Tres textos');const questions=exam.texts.flatMap(t=>t.questions);check(questions.length===18,'18 preguntas');
  check(new Set(questions.map(q=>q.id)).size===18,'IDs únicos');
  const skills={},keys={},words=[],optionWords=[];
  for(const text of exam.texts){words.push(text.paragraphs.join(' ').trim().split(/\s+/u).length);for(const q of text.questions){
   skills[q.skill]=(skills[q.skill]||0)+1;keys[q.key]=(keys[q.key]||0)+1;
   check(q.options.length===4 && new Set(q.options).size===4,'Alternativas diferentes');check('ABCD'.includes(q.key),'Clave A–D');check(q.evidence.length>20 && q.errors.length===4,'Pauta con evidencia y cuatro decisiones');
   const lengths=q.options.map(o=>o.split(/\s+/u).length);optionWords.push(lengths);
   const k='ABCD'.indexOf(q.key);check(lengths[k]<=Math.max(...lengths.filter((_,i)=>i!==k))*1.5,'Clave no destaca por longitud');
  }}
  const auditedCounts=[[4,8,6],[4,9,5],[5,8,5],[4,10,4],[4,8,6]][exam.number-1];
  check(['LOCALIZAR','INTERPRETAR','REFLEXIONAR'].every((s,i)=>skills[s]===auditedCounts[i]),'Distribución por demanda auditada, sin imponer cuota a la etiqueta');
  questions.forEach(q=>{check(q.demandAudit && q.demandAudit.rationale.length>90,'Fundamento específico de demanda');check(q.demandAudit.assessedSkill===q.skill,'Eje corresponde a la tarea auditada');});
  check(!JSON.stringify(publicExam(exam.number)).includes('demandAudit'),'Auditoría privada, sin pistas durante el intento');
  check(exam.writtenPractice.rubric.length===4 && exam.writtenPractice.evidence.length===2,'Respuesta redactada con pauta y evidencia de ambos textos');
  check(Object.values(keys).every(n=>n>=4 && n<=5),'Claves 4–5 por letra');
  const seq=questions.map(q=>q.key).join('');check(!/(.)\1\1|(.{2})\2\2|(.{4})\3/u.test(seq),'Sin ciclos ni rachas de tres');
  const visible=JSON.stringify(publicExam(exam.number));check(!/"(?:key|errors|evidence|skill|demand|operation)":/.test(visible),'Sin pauta en vista estudiante');
  const totalWords=words.reduce((a,b)=>a+b,0)+questions.reduce((sum,q)=>sum+(q.prompt+' '+q.options.join(' ')).split(/\s+/u).length,0);
  stats.push({number:exam.number,date:exam.date,textWords:words,totalReadingWords:words.reduce((a,b)=>a+b,0),allVisibleWords:totalWords,skills,keyCounts:keys,optionWords});
 }
 return stats;
}
async function apiTests(){
 const db=mockDb();const pristine=clone(db.state);
 db.state[BASE].sesiones['sesion-2']={activa:false,contenido:{textos:[{id:'t1',titulo:'Ejemplo ficticio',fuente:'Fuente ficticia',parrafos:[{texto:'Un ejemplo<br>sin etiquetas.'}]}],preguntas:[{id:1,textoRef:'t1',enunciado:'¿Qué dice?',correcta:'A',habilidad:'LOCALIZAR',opciones:[{texto:'Una opción',letra:'A'}]}]}};
 const beforeExample=clone(db.state);
 const example=await call(db,'simce-u4-example');check(example.status===200 && example.data.texts[0].questions.length===1,'Forma P disponible aunque el intento antiguo esté cerrado');check(example.data.constructedResponses.length===2 && example.data.constructedResponses.every(q=>q.prompt && q.measures),'Referencia contiene ambas respuestas construidas y su demanda');check(!JSON.stringify(example.data).includes('correcta'),'Referencia sin claves');check(JSON.stringify(db.state)===JSON.stringify(beforeExample),'Referencia no reabre intentos');check((await call(db,'simce-u4-example','other')).status===403,'Referencia limitada a NM2');
 for(const[token,status]of [['',401],['invalid',401],['other',403]])check((await call(db,'simce-u4-state',token)).status===status,'Permisos');
 check((await call(db,'simce-u4-state','student',{},'../1')).status===400,'ID inválido');
 check((await call(db,'simce-u4-review','student')).status===403,'Alumno sin pauta');
 check((await call(db,'simce-u4-review','teacher')).status===200,'Docente con pauta');
 check(JSON.stringify(db.state)===JSON.stringify(beforeExample),'Lecturas y rechazos no mutan');
 for(const exam of exams){
  const n=String(exam.number),questions=exam.texts.flatMap(t=>t.questions),answers=Object.fromEntries(questions.map(q=>[q.id,q.key]));
  const before=await call(db,'simce-u4-state','student',{},n);check(before.data.result===null,'Resultado oculto antes de entregar');
  check((await call(db,'simce-u4-submit','student',{answers:{q1:'A'}},n)).status===400,'Faltantes no entregan');
  check((await call(db,'simce-u4-save','student',{answers:{q1:'A'},score:999,startedAt:1},n)).status===200,'Guarda borrador');
  const draft=await call(db,'simce-u4-state','student',{},n);check(draft.data.attempt.startedAt>1,'Inicio en servidor');check(draft.data.result===null,'No puntaje en borrador');
  check((await call(db,'simce-u4-submit','student',{answers,score:0,simulatedScore:999},n)).status===200,'Entrega válida');
  const final=await call(db,'simce-u4-state','student',{},n);check(final.data.attempt.submitted && final.data.attempt.completada,'Dos marcas confirmadas');check(final.data.result.score===18 && final.data.result.simulatedScore===350,'Puntaje en servidor');
  check(final.data.result.total===18,'Total fijo por catálogo');
  check((await call(db,'simce-u4-save','student',{answers:{}},n)).status===409,'Borrador tardío no revierte entrega');
  check((await call(db,'simce-u4-submit','student',{answers},n)).status===409,'Entrega duplicada inmutable');
  check(api.scoreAnswers({},exam).simulatedScore===150,'Cero aciertos: índice CEST 150');
  check(api.scoreAnswers(Object.fromEntries(questions.map((q,i)=>[q.id,i<9?q.key:'ABCD'[('ABCD'.indexOf(q.key)+1)%4]])),exam).simulatedScore===250,'Nueve aciertos: índice CEST 250');
 }
 const review=await call(db,'simce-u4-review','teacherB');check(review.data.results.length===0,'Resultados docentes filtrados por curso');
 const before=clone(db.state[BASE].respuestas['sesion-u4-1'].student);
 let status,data;const res={setHeader(){},status(s){status=s;return this;},json(v){data=v;}};
 await attempts.manejar({method:'POST',headers:{authorization:'Bearer teacher'},body:{sessionId:'sesion-u4-1',studentUid:'student',requestId:'u4-reopen-fixture-001'}},res,'reopen',db,auth);
 check(status===200 && data.reopened,'Reapertura real del módulo existente');
 check(JSON.stringify(db.state[BASE].respuestas['sesion-u4-1'].student.answers)===JSON.stringify(before.answers),'Conserva respuestas');
 check((await call(db,'simce-u4-save','student',{answers:{q1:'A'},reopenedAt:0})).status===409,'Cola anterior a reapertura rechazada');
 const restored=await call(db,'simce-u4-state');check(restored.data.result===null,'Resultado retirado al reabrir');
 await api.mirrorResult(db,exams[0],'student',before);
 check(db.state[BASE].resultados['sesion-u4-1'].student.reopened===true,'Copia tardía no revive resultado reabierto');
 check((await call(db,'simce-u4-review','teacher')).data.results.length===0,'Docente no ve resultado canónico pendiente');
 check((await call(db,'simce-u4-submit','student',{answers:before.answers,reopenedAt:restored.data.attempt.reopenedAt})).status===200,'Reentrega con versión nueva');
 const race=mockDb();const all=Object.fromEntries(exams[0].texts.flatMap(t=>t.questions).map(q=>[q.id,q.key]));
 const concurrent=await Promise.all([call(race,'simce-u4-submit','student',{answers:all}),call(race,'simce-u4-save','student',{answers:{}})]);
 check(concurrent[0].status===200 && concurrent[1].status===409,'Entrega protege de guardado concurrente');
 const closed=mockDb();closed.state[BASE].sesiones['sesion-u4-1'].activa=false;
 check((await call(closed,'simce-u4-save')).status===423,'Cierre en servidor');
 closed.state[BASE].sesiones['sesion-u4-1'].excepciones_desbloqueo={student:true};check((await call(closed,'simce-u4-save')).status===200,'Excepción individual');
 check(!api.available(standardSession(exams[0]),'student',api.CLOSE_AT),'Cierre al iniciar SIMCE');
 check(api.available(standardSession(exams[0]),'student',api.CLOSE_AT-1),'Día previo disponible');
 const changed=mockDb(fixture(),state=>{state[BASE].estudiantes.student.curso='3A-HC';});check((await call(changed,'simce-u4-save')).status===403,'Curso revalidado al reintentar');
 check(get(changed.state,BASE+'/respuestas/sesion-u4-1/student')==null,'Cambio de permiso revierte solo la escritura propia');
 const large=mockDb();large.state[BASE].padding_test='x'.repeat(17*1024*1024);
 check((await call(large,'simce-u4-save')).status===200,'BASE de más de 16 MB no bloquea intento individual');
 check(Buffer.byteLength(JSON.stringify(large.state[BASE].respuestas['sesion-u4-1'].student))<2048,'Escritura de borrador menor a 2 KB');
 const revoked=mockDb(fixture(),state=>{state[BASE].admins.teacher=false;});
 revoked.state[BASE].respuestas['sesion-u4-1']={student:clone(before)};
 await attempts.manejar({method:'POST',headers:{authorization:'Bearer teacher'},body:{sessionId:'sesion-u4-1',studentUid:'student',requestId:'u4-revoke-fixture-001'}},res,'reopen',revoked,auth);
 check(status===403,'Permiso docente revalidado antes de publicar reapertura');
 check(revoked.state[BASE].respuestas['sesion-u4-1'].student.completada===true,'Revocación conserva la entrega original');
 const rules=JSON.parse(fs.readFileSync(path.join(ROOT,'firebase-rules.json'))).rules.plataforma_estudiantes;
 for(const node of ['respuestas','resultados']){
  const rule=rules[node].$sesionId.$uid['.write'].replaceAll('.matches(','.match(');
  const evaluate=(session,admin,completed=false)=>new Function('auth','$uid','$sesionId','root','data','newData',`return ${rule}`)({uid:'student'},'student',session,{child:()=>({child:()=>({val:()=>admin})})},{exists:()=>false,child:()=>({val:()=>completed})},{child:()=>({val:()=>false})});
  for(let n=1;n<=5;n++)check(!evaluate(`sesion-u4-${n}`,false),'Firebase rechaza escritura directa del alumno');
  check(evaluate('sesion-u4-1',true),'Admin conserva administración');check(evaluate('sesion-u3-1',false),'Sesiones previas conservadas');
 }
}
function snapshot(value,key){return {key,val:()=>clone(value),exists:()=>value!=null,forEach(fn){Object.entries(value||{}).forEach(([k,v])=>fn(snapshot(v,k)));}};}
function firebaseStub(identity){return `<script>(()=>{const uid=${JSON.stringify(identity)},user={uid,getIdToken:async()=>uid};const listeners=[];const snap=(v,key)=>({key,val:()=>v,exists:()=>v!==null,forEach(fn){Object.entries(v||{}).forEach(([k,x])=>fn(snap(x,k)));}});const ref=p=>({child:k=>ref(p+'/'+k),orderByChild(){return this},equalTo(){return this},limitToLast(){return this},once:async()=>{if(p==='.info/serverTimeOffset')return snap(0);const r=await fetch('/fixture-db?path='+encodeURIComponent(p));return snap(await r.json());},on(type,fn){this.once().then(fn);listeners.push({p,fn});},off(){},transaction:async fn=>{const v=(await ref(p).once()).val();const next=fn(v);const r=await fetch('/fixture-write',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:p,value:next})});return {committed:r.ok};},update:async()=>{},set:async()=>{}});const a={setPersistence:async()=>{},onAuthStateChanged(fn){setTimeout(()=>fn(user),0);return ()=>{}},signOut:async()=>{}};const auth=()=>a;auth.Auth={Persistence:{LOCAL:'local'}};window.firebase={apps:[{}],initializeApp(){return this.apps[0]},auth,database:()=>({ref})};window.initStudentForcedRefresh=()=>{};window.__notifyFixture=async()=>{for(const l of listeners)l.fn(await ref(l.p).once());};})();</script>`;}
async function serve(db=mockDb()){
 const server=http.createServer(async(req,out)=>{
  try{
   const url=new URL(req.url,'http://localhost');
   if(url.pathname==='/fixture-db'){out.setHeader('Content-Type','application/json');out.end(JSON.stringify(get(db.state,url.searchParams.get('path')) ?? null));return;}
   if(url.pathname==='/fixture-write'){let body='';for await(const c of req)body+=c;const v=JSON.parse(body);assert.match(v.path,/^plataforma_estudiantes\/telemetria_clases\//);put(db.state,v.path,v.value);out.end('{}');return;}
   if(url.pathname==='/api/estudiantes'){
    let raw='';for await(const c of req)raw+=c;req.body=raw?JSON.parse(raw):{};req.query=Object.fromEntries(url.searchParams);
    const res={code:200,setHeader:(k,v)=>out.setHeader(k,v),status(s){this.code=s;return this},json(value){out.writeHead(this.code,{'Content-Type':'application/json'});out.end(JSON.stringify(value));}};
    await api.manejar(req,res,url.searchParams.get('action'),db,auth);return;
   }
   let target=path.resolve(ROOT,'.'+decodeURIComponent(url.pathname));if(!target.startsWith(ROOT+path.sep)){out.writeHead(403);out.end();return;}
   if(url.pathname.endsWith('/'))target=path.join(target,'index.html');if(!fs.existsSync(target)){out.writeHead(404);out.end();return;}
   let content=fs.readFileSync(target);
   if(target.endsWith('.html')){let html=content.toString();html=html.replace(/<script[^>]*src="https:\/\/www\.gstatic\.com\/firebasejs[^>]*><\/script>/g,'').replace(/<script[^>]*src="[^\"]*forced-refresh[^\"]*"[^>]*><\/script>/g,'');html=html.replace('</head>',firebaseStub(url.searchParams.get('teacher')==='1'?'teacher':'student')+'</head>');content=Buffer.from(html);}
   out.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.ttf':'font/ttf','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'})[path.extname(target)] || 'application/octet-stream');out.end(content);
  }catch(error){out.writeHead(500);out.end(error.message);}
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return {server,url:`http://127.0.0.1:${server.address().port}`,db};
}
async function browserTests(stats){
 const {chromium}=require('playwright');const running=await serve();const browser=await chromium.launch({headless:true});const errors=[],failed=[];
 const evidence=fs.mkdtempSync(path.join(os.tmpdir(),'simce-u4-qa-'));
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(r.url()));
  const overflow=()=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  for(const width of [320,390,1440,3840]){
   await page.setViewportSize({width,height:width===3840?2160:900});await page.goto(running.url+'/estudiantes/simce-unidad4/?ensayo=1');await page.getByRole('button',{name:'Comenzar miniensayo'}).click();
   await page.locator('#work').waitFor({state:'visible'});check(await page.locator('.reading').count()===3,'Tres lecturas renderizadas');check(await page.locator('input[type=radio]').count()===72,'72 alternativas');check(!await overflow(),'Sin desborde');
   const blocked=await page.evaluate(()=>{const e=new Event('copy',{bubbles:true,cancelable:true});document.querySelector('#readings').dispatchEvent(e);return e.defaultPrevented;});check(blocked,'Copia bloqueada');
   const optionMeasure=await page.locator('.question').evaluateAll(fields=>fields.map(field=>[...field.querySelectorAll('.option span')].map(span=>Math.round(span.getBoundingClientRect().height/parseFloat(getComputedStyle(span).lineHeight)))));
   stats[0].renderedOptionLines ||= {};stats[0].renderedOptionLines[width]=optionMeasure;
   await page.screenshot({path:path.join(evidence,`mini-1-${width}.png`),fullPage:false});
  }
  await page.locator('input[name=q1][value=A]').check();await page.waitForTimeout(900);await page.reload();await page.getByRole('button',{name:'Comenzar miniensayo'}).click();check(await page.locator('input[name=q1][value=A]').isChecked(),'Recarga conserva respuesta');
  await page.getByRole('button',{name:'Entregar miniensayo'}).click();check((await page.locator('#saveState').textContent()).includes('Faltan'),'Faltantes visibles');
  for(const q of exams[0].texts.flatMap(t=>t.questions))await page.locator(`input[name=${q.id}][value=${q.key}]`).check();
  // Red caída al entregar: el botón vuelve a habilitarse y el borrador permanece.
  await page.route('**/api/estudiantes?action=simce-u4-submit*',route=>route.abort());await page.getByRole('button',{name:'Entregar miniensayo'}).click();await page.waitForFunction(()=>!document.getElementById('submit').disabled);check((await page.locator('#saveState').textContent()).includes('conserva'),'Error recuperable');check(await page.locator('input:checked').count()===18,'Respuestas retenidas');
  await page.unroute('**/api/estudiantes?action=simce-u4-submit*');await page.getByRole('button',{name:'Entregar miniensayo'}).click();await page.getByRole('button',{name:'Ver mi resultado'}).click();check((await page.locator('#correct').textContent())==='18 de 18 correctas','Aciertos visibles');check((await page.locator('#simulated').textContent()).includes('350'),'Simulación visible');
  await page.reload();await page.locator('#result').waitFor({state:'visible'});check((await page.locator('#correct').textContent()).startsWith('18'),'Resultado después de recarga');
  const telemetry=get(running.db.state,BASE+'/telemetria_clases/sesion-u4-1/student');
  check(telemetry?.events?.copy?.count>0,'Telemetría registra intento de copiar');
  check(!JSON.stringify(telemetry).includes('La llave del taller'),'Telemetría no guarda texto ni portapapeles');
  await page.goto(running.url+'/estudiantes/dashboard.html');await page.waitForFunction(()=>document.querySelector('#unit4SessionList .completed'));check(await page.locator('#unit4SessionList .session-card').count()===5,'Cinco sesiones en panel');check((await page.locator('#unit4SessionList .completed').textContent()).includes('Completada'),'Panel confirma entrega');
  // La página docente real usa el API real con identidad ficticia y alcance de curso.
  await page.goto(running.url+'/estudiantes/simce-unidad4/docente.html?teacher=1');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('verificado'));check((await page.locator('#results').textContent()).includes('18/18 correctas'),'Admin recibe resultado');check(await page.locator('#key details').count()===18,'Pauta docente completa');
  for(const width of [320,390,1440,3840]){await page.setViewportSize({width,height:900});check(!await overflow(),'Pauta y rúbrica sin desborde');}
  await page.setViewportSize({width:390,height:900});
  for(const n of [1,2,3,4,5]){await page.locator('#exam').selectOption(String(n));await page.waitForFunction(()=>document.getElementById('status').textContent.includes('verificado'));check((await page.locator('#key').textContent()).includes('Fundamento del nivel:'),'Fundamentos individuales visibles al docente');check((await page.locator('#writing').textContent()).includes('3 puntos:'),'Rúbrica redactada visible');check((await page.locator('#writing').textContent()).includes('No descontar comprensión'),'Escritura separada de comprensión');check(!await overflow(),'Cinco pautas sin desborde');}
  await page.screenshot({path:path.join(evidence,'pauta-escritura-390.png'),fullPage:true});
  await page.goto(running.url+'/estudiantes/simce-unidad4/docente.html');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('reservado'));check(await page.locator('#key details').count()===0,'Pauta no visible al alumno');
  check((await page.locator('#writing').textContent())==='','Rúbrica y evidencias no visibles al alumno');
  running.db.state[BASE].sesiones['sesion-2']={activa:false,contenido:{textos:Array.from({length:7},(_,i)=>({id:'t'+(i+1),titulo:'Texto ficticio '+(i+1),fuente:'Fixture',parrafos:[{texto:'Texto de prueba.'}]})),preguntas:Array.from({length:7},(_,i)=>({id:i+1,textoRef:'t'+(i+1),enunciado:'Pregunta de prueba',opciones:[{texto:'A'},{texto:'B'},{texto:'C'},{texto:'D'}]}))}};
  await page.goto(running.url+'/estudiantes/simce-unidad4/forma-p.html');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Referencia cargada'));check(await page.getByText('Respuesta redactada:',{exact:false}).count()===2,'Dos abiertas de referencia renderizadas');check(!await overflow(),'Referencia con abiertas sin desborde');
  for(const n of [2,3,4,5]){
   await page.setViewportSize({width:390,height:900});await page.goto(running.url+`/estudiantes/simce-unidad4/?ensayo=${n}`);await page.getByRole('button',{name:'Comenzar miniensayo'}).click();check(await page.locator('input[type=radio]').count()===72,'Alternativas en cada miniensayo');check(!await overflow(),'Cada miniensayo sin desborde');
   stats[n-1].renderedOptionLines={390:await page.locator('.question').evaluateAll(fields=>fields.map(field=>[...field.querySelectorAll('.option span')].map(span=>Math.round(span.getBoundingClientRect().height/parseFloat(getComputedStyle(span).lineHeight)))))};
  }
  await page.goto(running.url+'/estudiantes/simce-unidad4/presentacion.html');check(await page.locator('section:visible').count()===1,'Aperturas separadas');await page.getByRole('button',{name:'Siguiente'}).click();check(await page.locator('#rules').isVisible(),'Normas segunda pantalla');await page.getByRole('button',{name:'Siguiente'}).click();check(await page.locator('#objective').isVisible(),'Objetivo tercera pantalla');
  check(errors.length===0,`Sin errores JS: ${errors.join(';')}`);
  const unexpected=failed.filter(url=>!url.includes('simce-u4-submit'));check(unexpected.length===0,`Sin solicitudes fallidas: ${unexpected.join(';')}`);
  fs.writeFileSync(path.join(evidence,'measurement.json'),JSON.stringify({checks,stats,errors,failed},null,2));console.log('Evidencia local: '+evidence);
 }finally{await browser.close();await new Promise(resolve=>running.server.close(resolve));}
}
async function main(){const stats=measure();await apiTests();if(process.argv.includes('--browser'))await browserTests(stats);console.log(`SIMCE U4: ${checks} comprobaciones aprobadas; 5 miniensayos, 15 textos, 90 preguntas, demanda individual, claves privadas, entrega, reapertura y permisos. Solo fixtures.`);if(process.argv.includes('--details'))console.log(JSON.stringify(stats,null,2));}
if(require.main===module){if(process.argv.includes('--serve'))serve().then(({url})=>console.log(url));else main().catch(e=>{console.error(e.stack);process.exitCode=1;});}
module.exports={fixture,mockDb,serve,measure};
