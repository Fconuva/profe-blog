'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {createHandler,project,BASE}=require('../api/_nm4-classwork'),E=require('../api/_nm4-classwork-evidence');
const {mockDb}=require('./audit-simce-reopen');
const ROOT=path.resolve(__dirname,'..');let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const roster={"4ATP":[{n:1,nombre:'ESTUDIANTE FICTICIO A'},{n:2,nombre:'ESTUDIANTE FICTICIO B'}],"4DTP":[{n:1,nombre:'ESTUDIANTE FICTICIO D'}]};
const auth={verifyIdToken:async t=>{if(t==='invalid')throw Error('invalid');return{uid:t};}};
function database(){
 const state={plataforma_estudiantes:{admins:{docente:true,limitado:true},docentes:{docente:{superadmin:true},limitado:{superadmin:false}},estudiantes:{estudiante:{curso:'4A-TP'},ajeno:{curso:'3A-HC'}}}};
 const db=mockDb(state),ref=db.ref.bind(db),listeners=new Map();
 db.ref=p=>{const r=ref(p);return{...r,on(event,callback){if(!listeners.has(p))listeners.set(p,new Set());listeners.get(p).add(callback);setImmediate(callback);},off(event,callback){listeners.get(p)?.delete(callback);},async transaction(fn){const result=await r.transaction(fn);if(result.committed)for(const [key,list] of listeners)if(p.startsWith(key+'/')||key===p)for(const cb of list)setImmediate(cb);return result;}};};
 return db;
}
async function call(db,body={},token='docente',action='save',course='4ATP'){
 let status=200,data;const res={setHeader(){},status(v){status=v;return this;},json(v){data=v;}};
 await createHandler({db,auth,roster})({method:action==='save'?'POST':'GET',headers:{authorization:token?'Bearer '+token:''},query:{course,action},body},res);return{status,data};
}
const request={n:1,activity:'manual',grade:5.4,expectedVersion:0,requestId:'solicitud-ficticia-0001'};
function answered(version,count){
 const fields=require('../nm4/u3-clase6-informe-'+E.CONFIG[version][1]+'/informe/campos');
 const required=new Set(fields.activity.requiredForSubmit||fields.questions.map(q=>q.id));
 const qs=fields.questions.filter(q=>required.has(q.id)&&!['emision','especialidad','declaracion'].includes(q.id));
 const answers=Object.fromEntries(qs.slice(0,count).map(q=>[q.id,q.type==='number'?'15':q.type==='date'?'2026-10-18':q.options?.[0]||'Respuesta de prueba original']));
 return{answers};
}
async function apiAudit(){
 const db=database(),before=JSON.stringify(db.state.plataforma_estudiantes);
 check((await call(db,request,'')).status===401,'anónimo rechazado');check((await call(db,request,'invalid')).status===401,'token inválido');
 for(const token of ['estudiante','limitado','ajeno'])check((await call(db,request,token)).status===403,'solo superadmin propietario edita');
 check((await call(db,{},'estudiante','list')).status===200,'NM4 puede leer');check((await call(db,{},'ajeno','list')).status===403,'otro nivel no lee');
 for(const grade of [0,7.1,NaN,5.45,'5.4',undefined])check((await call(db,{...request,grade})).status===400,'nota inválida');
 check((await call(db,{...request,n:99999})).status===400,'no inventa estudiante');
 check((await call(db,{...request,activity:'../otro'})).status===400,'no permite ruta arbitraria');
 check((await call(db,{...request,activity:'informe'},'docente','save','4DTP')).status===400,'actividad no aplicable');
 let result=await call(db,request);check(result.status===200&&result.data.rows[0].grades.manual.grade===5.4,'nota decimal confirmada');
 check(result.data.rows[0].average===5.4&&result.data.rows[0].partial,'promedio parcial excluye blancos');
 const first=JSON.stringify(db.state.plataforma_nm4);
 check((await call(db,request)).status===200,'reintento idempotente');check(JSON.stringify(db.state.plataforma_nm4)===first,'no duplica historial');
 check((await call(db,{...request,requestId:'solicitud-ficticia-0002',grade:7})).status===409,'conflicto entre dos ventanas');
 result=await call(db,{...request,grade:null,expectedVersion:1,requestId:'solicitud-ficticia-0003'});
 check(result.status===200&&result.data.rows[0].grades.manual.grade===null&&result.data.rows[0].average===null,'borrar deja pendiente sin cero');
 const history=db.state.plataforma_nm4.planilla_trabajo_2026.cursos['4ATP'].celdas[1].manual.history;
 check(Object.keys(history).length===2,'conserva historial al borrar');
 check(JSON.stringify(db.state.plataforma_estudiantes)===before,'no toca perfiles, respuestas ni resultados');
 for(const version of Object.keys(E.CONFIG)){
  const total=E.measure(version,{}).total;check(total>0,'campos de trabajo definidos');
  check(E.measure(version,{}).grade===null,'sin evidencia no asigna uno');
  check(E.measure(version,answered(version,1)).grade===3,'un intento cuenta como trabajo');
  check(E.measure(version,answered(version,Math.floor(total*.5))).grade===3,'hasta 50 por ciento');
  check(E.measure(version,answered(version,Math.floor(total*.5)+1)).grade===5,'sobre 50 por ciento');
  check(E.measure(version,answered(version,Math.ceil(total*.85))).grade===7,'desde 85 por ciento');
 }
 const snapshots={industrial:{_claims:{"4ATP":{1:'pair_test'}},_teams:{pair_test:{...answered('industrial',100),team:[{curso:'4ATP',n:1},{curso:'4ATP',n:2}],submitted:false,completada:false}}}};
 let rows=project('4ATP',roster['4ATP'],{},snapshots,false).rows;
 check(rows.every(r=>r.grades.informe.grade===7),'parejas acreditadas para ambos sin exigir botón de entrega');
 check(rows.every(r=>r.grades.manual.grade===null&&r.grades['ia-futuro'].grade===null),'papel y cuaderno en blanco');
 snapshots.industrial._teams.pair_test.team=[{curso:'4BTP',n:1}];check(E.evidence({course:'4ATP',n:1},snapshots).grade===null,'pareja de otro curso no atribuye evidencia');
 snapshots.industrial._pairBackups={pair_test:{'4ATP_001':answered('industrial',100)}};
 check(E.evidence({course:'4ATP',n:1},snapshots).grade===7,'respaldo individual conserva avance');
 snapshots.mecanica={"4ATP":{1:answered('mecanica',100)}};check(E.evidence({course:'4ATP',n:1},snapshots).grade===7,'versión histórica puede acreditar trabajo');
 rows=project('4ATP',roster['4ATP'],{1:{informe:{version:1,grade:null}}},snapshots,false).rows;
 check(rows[0].grades.informe.grade===null,'blanco docente prevalece sobre automático');
 check(!JSON.stringify(rows).includes('answers')&&!JSON.stringify(rows).includes('history'),'vista pública no filtra respuestas ni historial');
 const html=fs.readFileSync(path.join(ROOT,'nm4/index.html'),'utf8');check(html.includes('Nota de trabajo en clases')&&html.includes('/nm4/trabajo-en-clases/'),'portal enlaza nota correcta');
 return db;
}
function firebaseStub(identity){return `(()=>{const user={uid:${JSON.stringify(identity)},getIdToken:async()=>${JSON.stringify(identity)}};const apps=[];const auth=()=>({currentUser:user,onAuthStateChanged:f=>setTimeout(()=>f(user),0),setPersistence:async()=>{}});auth.Auth={Persistence:{LOCAL:'local'}};window.firebase={apps,auth,initializeApp:(config,name='[DEFAULT]')=>{const a={name,auth};apps.push(a);return a;}};})();`;}
async function serve({db=database(),handler,realAuth=false}={}){
 const handle=handler||createHandler({db,auth,roster});
 const server=http.createServer(async(req,res)=>{
  const u=new URL(req.url,'http://local');
  if(u.pathname==='/api/economista'){
   let raw='';for await(const c of req)raw+=c;req.query=Object.fromEntries(u.searchParams);req.body=raw?JSON.parse(raw):{};
   res.status=function(n){this.statusCode=n;return this;};res.json=function(v){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(v));};
   await handle(req,res);return;
  }
  const file=path.resolve(ROOT,'.'+u.pathname+(u.pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  let content=fs.readFileSync(file);if(file.endsWith('.html')&&!realAuth)content=Buffer.from(content.toString().replace(/<script[^>]*src="https:\/\/www\.gstatic\.com[^>]*><\/script>/g,'').replace('</head>','<script>'+firebaseStub(u.searchParams.get('student')?'estudiante':'docente')+'</script></head>'));
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(content);
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));return{server,url:'http://127.0.0.1:'+server.address().port};
}
async function browserAudit(){
 const {chromium}=require('playwright'),{server,url}=await serve();let browser;
 try{
  browser=await chromium.launch({channel:'chrome',headless:true});const teacher=await browser.newPage(),student=await browser.newPage(),errors=[];
  for(const p of [teacher,student])p.on('pageerror',e=>errors.push(e.message));
  await teacher.goto(url+'/nm4/trabajo-en-clases/');await student.goto(url+'/nm4/trabajo-en-clases/?student=1');
  await teacher.locator('#grades tbody tr').first().waitFor();await student.locator('#grades tbody tr').first().waitFor();
  check(await student.locator('#grades input').count()===0,'estudiante sin editor');
  const input=teacher.locator('input[data-n="1"][data-activity="manual"]');await input.fill('6,4');await input.press('Enter');
  await teacher.getByText('Nota guardada y confirmada.',{exact:true}).waitFor();
  await student.waitForFunction(()=>document.querySelector('#grades tbody tr').textContent.includes('6,4'));check(true,'cambio llega por suscripción sin recargar');
  await teacher.reload();await teacher.locator('input[data-activity="manual"]').first().waitFor();check(await teacher.locator('input[data-n="1"][data-activity="manual"]').inputValue()==='6,4','recarga conserva nota');
  await teacher.locator('input[data-n="1"][data-activity="manual"]').fill('8,0');await teacher.locator('input[data-n="1"][data-activity="manual"]').press('Enter');check((await teacher.locator('#notice').textContent()).includes('1,0 a 7,0'),'validación visible');
  await teacher.locator('input[data-n="1"][data-activity="manual"]').fill('');await teacher.locator('input[data-n="1"][data-activity="manual"]').press('Enter');await teacher.getByText('Nota guardada y confirmada.',{exact:true}).waitFor();
  await student.waitForFunction(()=>!document.querySelector('#grades tbody tr').textContent.includes('6,4'));check(true,'blanco llega al estudiante');
  let dropped=false;await teacher.route('**/api/economista?**action=save**',async route=>{if(!dropped){dropped=true;await route.fetch();await route.abort('failed');}else await route.continue();});
  await teacher.locator('input[data-n="1"][data-activity="manual"]').fill('5,2');await teacher.locator('input[data-n="1"][data-activity="manual"]').press('Enter');
  await teacher.waitForFunction(()=>document.getElementById('notice').textContent.includes('Tu cambio sigue'));
  check(await teacher.locator('input[data-n="1"][data-activity="manual"]').inputValue()==='5,2','cambio conservado tras respuesta perdida');check(await teacher.locator('#course').isDisabled(),'no permite perder un cambio pendiente');
  await teacher.locator('input[data-n="1"][data-activity="manual"]').focus();await teacher.locator('input[data-n="1"][data-activity="manual"]').press('Enter');await teacher.getByText('Nota guardada y confirmada.',{exact:true}).waitFor();check(true,'reintento de respuesta perdida es idempotente');
  for(const width of [320,390,1440,3840]){
   await student.setViewportSize({width,height:900});check(await student.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'sin desborde '+width);
  }
  await student.selectOption('#course','4DTP');await student.waitForFunction(()=>document.querySelector('#grades tbody').textContent.includes('FICTICIO D'));check(await student.locator('td.na').count()===2,'4D sin actividades ajenas');
  check(errors.length===0,'sin errores de navegador');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
async function main(){await apiAudit();if(process.argv.includes('--browser'))await browserAudit();console.log(JSON.stringify({ok:true,checks,browser:process.argv.includes('--browser')}));}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={apiAudit,browserAudit,serve,roster,answered};
