'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {createHandler,project,BASE,IDENTITY_ROWS}=require('../api/_nm4-classwork'),E=require('../api/_nm4-classwork-evidence');
const {mockDb}=require('./audit-simce-reopen');
const ROOT=path.resolve(__dirname,'..');let checks=0;const check=(v,m)=>{assert.ok(v,m);checks++;};
const roster={"4ATP":[{n:1,nombre:'ESTUDIANTE FICTICIO A'},{n:2,nombre:'ESTUDIANTE FICTICIO B'}],"4DTP":[{n:1,nombre:'ESTUDIANTE FICTICIO D'}]};
const auth={verifyIdToken:async t=>{if(t==='invalid')throw Error('invalid');return{uid:t};}};
const crypto=require('node:crypto'),{SALT}=require('../api/_roster_nm4_informe');
const sessionSecret='secreto-exclusivo-de-pruebas-no-produccion';
const identityRows=[['11111111-1','4ATP',1],['22222222-2','4DTP',1],['33333333-3','PRUEBA',1]].map(([rut,c,n])=>[crypto.createHash('sha256').update(SALT+rut.replace('-','')).digest('hex').slice(0,24),c,n]);
function database(){
 const state={plataforma_estudiantes:{admins:{docente:true,limitado:true},docentes:{docente:{superadmin:true},limitado:{superadmin:false}},estudiantes:{estudiante:{curso:'4A-TP'},ajeno:{curso:'3A-HC'}}}};
 const db=mockDb(state),ref=db.ref.bind(db),listeners=new Map();
 db.ref=p=>{const r=ref(p);return{...r,on(event,callback){if(!listeners.has(p))listeners.set(p,new Set());listeners.get(p).add(callback);setImmediate(callback);},off(event,callback){listeners.get(p)?.delete(callback);},async transaction(fn){const result=await r.transaction(fn);if(result.committed)for(const [key,list] of listeners)if(p.startsWith(key+'/')||key===p)for(const cb of list)setImmediate(cb);return result;}};};
 return db;
}
async function call(db,body={},token='docente',action='save',course='4ATP'){
 let status=200,data;const res={setHeader(){},status(v){status=v;return this;},json(v){data=v;}};
 await createHandler({db,auth,roster,sessionSecret,identityRows})({method:['save','set-activity','rut-login'].includes(action)?'POST':'GET',headers:{authorization:token?'Bearer '+token:''},query:{course,action},body},res);return{status,data};
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
 const fullRoster=require('../api/_roster_nm4');
 for(const [course,students] of Object.entries(fullRoster))check(students.every(s=>IDENTITY_ROWS.filter(r=>r[1]===course&&r[2]===s.n).length===1),'cada estudiante de la planilla tiene una identidad RUT en '+course);
 check(new Set(IDENTITY_ROWS.map(r=>r[0])).size===IDENTITY_ROWS.length,'sin hashes de identidad duplicados');
 for(const rut of ['', '123', '11111111-2', '33333333-3', '../11111111-1'])check((await call(db,{rut},'','rut-login','')).status===400,'RUT desconocido o fuera de nómina rechazado');
 for(const [rut,course] of [['11.111.111-1','4ATP'],['222222222','4DTP']]){
  const login=await call(db,{rut,canEdit:true},'','rut-login','');check(login.status===200&&login.data.course===course,'RUT reconoce curso sin cuenta SIMCE');
  check(!JSON.stringify(login.data).includes(rut),'no devuelve ni guarda RUT');
  const token=login.data.token,read=await call(db,{},token,'list',course);check(read.status===200&&!read.data.canEdit,'sesión RUT solo lectura');
  check((await call(db,{},token,'list',course==='4ATP'?'4DTP':'4ATP')).status===200,'conserva filtro por curso autorizado');
  check((await call(db,request,token)).status===403,'RUT no puede editar notas');
  check((await call(db,{activity:'manual',enabled:false},token,'set-activity')).status===403,'RUT no puede desactivar tareas');
  const parts=token.split('.'),claims=JSON.parse(Buffer.from(parts[2],'base64url').toString());claims.n=999;parts[2]=Buffer.from(JSON.stringify(claims)).toString('base64url');
  check((await call(db,{},parts.join('.'),'list')).status===401,'rechaza sesión manipulada');
  claims.n=1;claims.exp=Date.now()-1;parts[2]=Buffer.from(JSON.stringify(claims)).toString('base64url');parts[3]=crypto.createHmac('sha256',crypto.createHash('sha256').update('nm4-classwork-session:'+sessionSecret).digest()).update(parts[2]).digest('base64url');
  check((await call(db,{},parts.join('.'),'list')).status===401,'sesión vencida rechazada');
 }
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
 const toggle={activity:'manual',enabled:false,expectedVersion:0,requestId:'activar-tarea-ficticia-0001'};
 for(const token of ['','invalid','estudiante','limitado'])check((await call(db,toggle,token,'set-activity')).status===(token===''||token==='invalid'?401:403),'control de tareas protegido');
 for(const change of [{activity:'../otra'},{enabled:'false'},{expectedVersion:-1},{requestId:'corto'}])check((await call(db,{...toggle,...change},'docente','set-activity')).status===400,'valida configuración');
 await call(db,{...request,grade:6.4,expectedVersion:2,requestId:'nota-prueba-antes-desactivar'});
 await call(db,{...request,activity:'oferta-contrato',grade:4,requestId:'nota-prueba-otra-actividad'});
 const savedCells=JSON.stringify(db.state.plataforma_nm4.planilla_trabajo_2026.cursos['4ATP'].celdas);
 const original=(await call(db,{},'docente','list')).data.rows[0];
 result=await call(db,toggle,'docente','set-activity');
 check(result.status===200&&!result.data.activities.find(a=>a.id==='manual').applicable,'desactivación confirmada');
 check(result.data.rows[0].average===4&&result.data.rows[0].count===1&&result.data.rows[0].total===original.total-1,'desactivada fuera del promedio y del total');
 check(JSON.stringify(db.state.plataforma_nm4.planilla_trabajo_2026.cursos['4ATP'].celdas)===savedCells,'desactivar no toca notas ni historial');
 check((await call(db,{},'docente','list','4DTP')).data.activities.find(a=>a.id==='manual').applicable,'otro curso conserva tarea activa');
 check((await call(db,{...request,expectedVersion:3,requestId:'nota-tarea-desactivada-0001'})).status===400,'tarea inactiva no admite nuevas notas');
 check((await call(db,toggle,'docente','set-activity')).status===200,'configuración idempotente');
 check((await call(db,{...toggle,requestId:'activar-tarea-ficticia-0002'},'docente','set-activity')).status===409,'rechaza configuración desactualizada');
 result=await call(db,{...toggle,enabled:true,expectedVersion:1,requestId:'activar-tarea-ficticia-0003'},'docente','set-activity');
 check(result.status===200&&result.data.rows[0].grades.manual.grade===6.4&&result.data.rows[0].average===5.2,'reactivar recupera la nota original');
 check(Object.keys(db.state.plataforma_nm4.planilla_trabajo_2026.cursos['4ATP'].actividades.manual.history).length===2,'historial de activación independiente');
 const settings=Object.fromEntries(result.data.activities.map(a=>[a.id,{enabled:false,version:1}]));
 const empty=project('4ATP',roster['4ATP'],{},snapshots,false,settings).rows[0];check(empty.total===0&&empty.average===null&&!empty.partial,'sin tareas activas no crea un cero ni pendientes');
 const digital=project('4ATP',roster['4ATP'],{},snapshots,false,{informe:{enabled:false,version:1}}).rows[0];check(digital.grades.informe.grade===null&&digital.count===0,'también excluye nota digital automática');
 result=await call(db,{...toggle,activity:'correo',enabled:true,requestId:'activar-excepcion-por-curso'},'docente','set-activity');check(result.status===200&&result.data.activities.find(a=>a.id==='correo').applicable,'permite activar una tarea excluida inicialmente');
 for(const course of Object.keys(roster)){const a=project(course,roster[course],{},{},false).activities.find(x=>x.id==='cuaderno-orden');check(a&&a.applicable&&a.highlight==='cuaderno','nota de cuaderno activa y destacada en '+course);}
 const notebook=project('4ATP',roster['4ATP'],{1:{'oferta-contrato':{version:1,grade:4},'cuaderno-orden':{version:1,grade:7}}},{},false).rows[0];check(notebook.average===5.5&&notebook.count===2,'nota de cuaderno cuenta en el promedio');
 const html=fs.readFileSync(path.join(ROOT,'nm4/index.html'),'utf8');check(html.includes('Nota de trabajo en clases')&&html.includes('/nm4/trabajo-en-clases/'),'portal enlaza nota correcta');
 return db;
}
function firebaseStub(identity){return `(()=>{const user=${identity==='estudiante'?'null':`{uid:'docente',getIdToken:async()=>'docente'}`};const apps=[];const auth=()=>({currentUser:user,onAuthStateChanged:f=>setTimeout(()=>f(user),0),setPersistence:async()=>{}});auth.Auth={Persistence:{LOCAL:'local'}};window.firebase={apps,auth,initializeApp:(config,name='[DEFAULT]')=>{const a={name,auth};apps.push(a);return a;}};})();`;}
async function serve({db=database(),handler,realAuth=false}={}){
 const handle=handler||createHandler({db,auth,roster,sessionSecret,identityRows});
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
  await student.locator('#rutInput').fill('11111111-2');await student.locator('#studentLogin button').click();await student.getByText(/No encontramos ese RUT/).waitFor();check(await student.locator('#sheet').isHidden(),'RUT erróneo conserva formulario sin datos');
  await student.locator('#rutInput').fill('11.111.111-1');await student.locator('#studentLogin button').click();
  await teacher.locator('#grades tbody tr').first().waitFor();await student.locator('#grades tbody tr').first().waitFor();
  check(student.url().includes('/nm4/trabajo-en-clases/')&&!student.url().includes('/lecturas/'),'ingreso RUT permanece en planilla');
  check(await student.locator('#rutInput').inputValue()==='','RUT no queda en formulario');
  check(!await student.evaluate(()=>Boolean(firebase.apps.find(a=>a.name==='[DEFAULT]'))),'no abre sesión SIMCE');
  await student.reload();await student.locator('#grades tbody tr').first().waitFor();check(await student.locator('#studentLogin').isHidden(),'recarga recupera consulta RUT');
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
  await teacher.locator('#activitySettings summary').click();
  await teacher.locator('#activityOptions [data-task="manual"]').uncheck();
  await teacher.waitForFunction(()=>document.getElementById('notice').textContent.startsWith('Tarea desactivada'));
  await student.waitForFunction(()=>document.querySelector('#grades thead').textContent.includes('Manual ilustradoNo cuenta'));
  check(await teacher.locator('#grades input[data-activity="manual"]').count()===0,'sin editor en tarea desactivada');
  check(await student.locator('#activitySettings').isHidden(),'alumno sin control de tareas');
  check((await student.locator('#grades tbody tr').first().textContent()).includes('0/8 actividades'),'tarea con nota excluida también en vista alumno');
  await teacher.reload();await teacher.locator('#grades tbody tr').first().waitFor();await teacher.locator('#activitySettings summary').click();check(!(await teacher.locator('#activityOptions [data-task="manual"]').isChecked()),'desactivación persiste tras recargar');
  await teacher.selectOption('#course','4DTP');await teacher.waitForFunction(()=>document.querySelector('#grades tbody').textContent.includes('FICTICIO D'));check(await teacher.locator('#activityOptions [data-task="manual"]').isChecked(),'selección independiente por curso');
  await teacher.selectOption('#course','4ATP');await teacher.waitForFunction(()=>document.querySelector('#grades tbody').textContent.includes('FICTICIO A'));await teacher.locator('#activityOptions [data-task="manual"]').check();
  await student.waitForFunction(()=>document.querySelector('#grades tbody tr').textContent.includes('5,2'));check(true,'reactivar restaura nota en vivo');
  for(const width of [320,390,1440,3840]){
   await student.setViewportSize({width,height:900});check(await student.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'sin desborde '+width);
  }
  await student.selectOption('#course','4DTP');await student.waitForFunction(()=>document.querySelector('#grades tbody').textContent.includes('FICTICIO D'));check(await student.locator('td.na').count()===2,'4D sin actividades ajenas');
  await student.locator('#studentLogout').click();await student.locator('#rutInput').waitFor({state:'visible'});check(await student.locator('#sheet').isHidden(),'cerrar consulta retira las notas');
  await student.locator('#rutInput').fill('22222222-2');await student.locator('#studentLogin button').click();await student.waitForFunction(()=>document.querySelector('#grades tbody').textContent.includes('FICTICIO D'));check(await student.locator('#course').inputValue()==='4DTP','RUT abre su propio curso');
  await student.reload();await student.waitForFunction(()=>document.querySelector('#grades tbody').textContent.includes('FICTICIO D'));check(await student.locator('#course').inputValue()==='4DTP','recarga conserva curso de ingreso');
  check(await teacher.locator('#grades thead th.notebook').count()===1&&await teacher.locator('#grades tbody td.notebook input[data-activity="cuaderno-orden"]').count()>0,'docente edita la columna del cuaderno');
  check(await student.locator('#grades tbody td.notebook').count()>0&&await student.evaluate(()=>getComputedStyle(document.querySelector('#grades td.notebook')).backgroundColor!==getComputedStyle(document.querySelector('#grades td.average')).backgroundColor),'columna del cuaderno con color propio');
  check(errors.length===0,'sin errores de navegador');
 }finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
}
async function main(){await apiAudit();if(process.argv.includes('--browser'))await browserAudit();console.log(JSON.stringify({ok:true,checks,browser:process.argv.includes('--browser')}));}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={apiAudit,browserAudit,serve,roster,answered};
