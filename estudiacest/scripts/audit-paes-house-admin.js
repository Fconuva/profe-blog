'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'paes/admin/index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'paes/admin/casas.js'), 'utf8');
const apiSource = fs.readFileSync(path.join(root, 'api/paes.js'), 'utf8');
const gateway = fs.readFileSync(path.join(root, 'admin/index.html'), 'utf8');
assert.match(gateway, /firebase\.initializeApp\(FIREBASE_CONFIG, 'estudiacest-admin'\)/);
assert.doesNotMatch(gateway, /const auth = firebase\.auth\(\)/);
for (const script of [...gateway.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]) new vm.Script(script[1]);
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'academic-release-manifest.json'), 'utf8'));
for (const script of [...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]) new vm.Script(script[1]);
assert.match(page, /data-tab="casas"/);
assert.match(page, /id="viewCasas"/);
assert.match(page, /firebase\.initializeApp\(FIREBASE_CONFIG, 'estudiacest-admin'\)/);
assert.match(page, /admin-session-token/);
assert.match(page, /recoverAdminSession\(\)/);
assert.match(page, /getElementById\('selectGuia'\)\.dispatchEvent/);
assert.ok(manifest.criticalFiles.some(file => file.path === 'paes/admin/casas.js'));
assert.ok(apiSource.indexOf('const decoded = await verifyAdmin(req);') < apiSource.indexOf("case 'admin-house-students'"));
assert.doesNotMatch(source, /console\.|innerHTML|\.set\(|\.update\(/);
const presets = vm.runInNewContext('(' + source.match(/const sets = (\{[\s\S]*?\});/)[1] + ')');
const actualCatalog = require('../estudiantes/js/catalogo-casa.js');
for (const [id,count] of [['gym',4],['christmas',1],['halloween',6]]) {
  assert.equal(presets[id].length,count);
  assert.ok(presets[id].every(furniture=>actualCatalog.some(item=>item.id===furniture && item.xp>0)));
  assert.ok(page.includes('value="' + id + '"'),'El set debe ser seleccionable en el admin: ' + id);
}

class Element {
  constructor() { this.children = []; this.listeners = {}; this.value = ''; this.textContent = ''; this.style = {}; this.hidden = false; this.disabled = false; this.attrs = {}; }
  get options() { return this.children; }
  replaceChildren(...children) { this.children = children; }
  add(child) { this.children.push(child); }
  append(...children) { this.children.push(...children); }
  setAttribute(key, value) { this.attrs[key] = value; }
  addEventListener(event, fn) { this.listeners[event] = fn; }
  async fire(event) { return this.listeners[event]?.(); }
}
const students = [
  {uid:'studentA',nombre:'Estudiante de prueba A',curso:'3B-HC',rut:'111111111'},
  {uid:'studentB',nombre:'Estudiante de prueba B',curso:'4B-HC',rut:'222222222'}
];

async function checkUI() {
  const elements = Object.fromEntries(['Mode','Guide','Set','Clear','Review','StudentField','Preview','PreviewName','PreviewImage','PreviewState','Orientation','Selected','Recipients','Course','Student','Refresh','Give','Confirm','Catalog','Deliveries','Summary','Status','Search','Ownership','Chosen'].map(id => ['house' + id, new Element()]));
  elements.houseMode.value = 'student';
  elements.houseOwnership.value = 'all';
  let gifts = 0, owned = false, denied = false, readbackFails = false, pauseGift, releaseGift;
  const calls = [];
  const context = { window:{}, document:{getElementById:id => elements[id], createElement:() => new Element()},
    Option:class { constructor(text,value) { this.textContent = text; this.value = value; } },
    fetch:async (url, options) => {
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      const body = JSON.parse(options.body);
      const action = url.includes('admin-house-students') ? 'students' : body.action;
      calls.push(action);
      if (action === 'students') return {ok:true,json:async () => ({success:true,estudiantes:students})};
      const furniture = [
        {id:'playStation5',nombre:'PlayStation 5',familia:'estudio',tiene:owned},
        {id:'rugRound',nombre:'Alfombra',familia:'deco',tiene:true},
        {id:'../admins',nombre:'No válido',familia:'',tiene:false}
      ];
      if (action === 'salas-recompensas-listar') return {ok:true,json:async () => ({ok:true,catalogo:furniture})};
      assert.equal(action, 'salas-regalos-admin-paes-lote');
      if (body.confirmar) {
        gifts++;
        if (pauseGift) await new Promise(resolve => { releaseGift = resolve; });
        if (denied) return {ok:false,json:async () => ({error:'No se pudo entregar.'})};
        assert.equal(body.estudiante, 'studentA'); assert.deepEqual(body.muebles,['playStation5']); owned = true;
        return {ok:true,json:async () => ({ok:true,errores:0,destinatarios:[{uid:'studentA',confirmado:true,faltan:['playStation5']}]})};
      }
      if (readbackFails && owned) return {ok:false,json:async () => ({error:'Sin conexión al inventario.'})};
      return {ok:true,json:async () => ({ok:true,destinatarios:[{uid:'studentA',nombre:students[0].nombre,faltan:owned ? [] : body.muebles,yaTiene:owned ? body.muebles : []}],catalogo:furniture})};
    }
  };
  vm.runInNewContext(source, context);
  const delivered = context.window.PaesCasasAdmin.delivered;
  assert.equal(delivered(17,{status:'draft',submitted:true}),false);
  assert.equal(delivered(17,{status:'sent'}),true);
  assert.equal(delivered(10,{submittedAt:1,answers:{1:'A'}}),true);
  assert.equal(delivered(10,{submittedAt:1,answers:{}}),false);
  assert.equal(delivered(20,{grade:{nota:7}}),false);
  const panel = context.window.PaesCasasAdmin.mount({auth:{currentUser:{getIdToken:async () => 'test-token'}},
    getGuideData:() => ({17:{111111111:{status:'sent'}},18:{111111111:{status:'draft'}}}),
    refreshGuides:async () => {}, reviewGuide:() => {}});
  await panel.load();
  assert.equal(elements.houseCatalog.children.length,2,'Las imágenes se ven incluso antes de seleccionar un estudiante.');
  assert.equal(elements.houseStudent.options.length, 3);
  elements.houseCourse.value = '3B-HC'; await elements.houseCourse.fire('change');
  assert.equal(elements.houseStudent.options.length, 2);
  elements.houseStudent.value = 'studentA'; await elements.houseStudent.fire('change');
  assert.equal(elements.houseDeliveries.children.length, 1);
  assert.equal(elements.houseCatalog.children.length, 2);
  const pick = card => card.children[3];
  assert.equal(pick(elements.houseCatalog.children[1]).disabled, true);
  await elements.houseCatalog.children[1].children[0].fire('click');
  assert.match(elements.housePreviewImage.src,/rugRound_SE\.png$/,'También se pueden mirar muebles ya obtenidos.');
  await elements.houseOrientation.children[3].fire('click');
  assert.match(elements.housePreviewImage.src,/rugRound_NW\.png$/);
  await pick(elements.houseCatalog.children[0]).fire('click');
  assert.equal(elements.houseConfirm.hidden,true,'Elegir no basta para autorizar una entrega.');
  await elements.houseReview.fire('click');
  assert.equal(elements.houseConfirm.hidden, false);
  denied = true; await elements.houseGive.fire('click');
  assert.match(elements.houseStatus.textContent, /No se pudo entregar/);
  assert.equal(owned,false);
  denied = false; pauseGift = true;
  await elements.houseReview.fire('click');
  const gift = elements.houseGive.fire('click');
  await new Promise(setImmediate);
  assert.equal(elements.houseStudent.disabled,true);
  const before = gifts; await elements.houseGive.fire('click'); assert.equal(gifts,before);
  releaseGift(); await gift;
  assert.equal(owned,true);
  assert.match(elements.houseStatus.textContent,/Entrega confirmada/);
  assert.equal(pick(elements.houseCatalog.children[0]).disabled,true);
  assert.equal(elements.houseConfirm.hidden,true);
  assert.equal(calls.at(-1),'salas-regalos-admin-paes-lote');
  await panel.load();
  assert.equal(pick(elements.houseCatalog.children[0]).disabled,true,'Recargar conserva el mueble marcado.');
  elements.houseOwnership.value = 'available'; await elements.houseOwnership.fire('change');
  assert.equal(elements.houseCatalog.children[0].textContent,'No hay muebles que coincidan con este filtro.');
  owned = false; pauseGift = false; elements.houseOwnership.value = 'all'; await panel.load();
  await pick(elements.houseCatalog.children[0]).fire('click'); await elements.houseReview.fire('click'); readbackFails = true;
  await elements.houseGive.fire('click');
  assert.doesNotMatch(elements.houseStatus.textContent,/Entrega confirmada/);
  assert.match(elements.houseStatus.textContent,/No se pudo confirmar/);
  assert.equal(elements.houseGive.disabled,false);
}

function createHouseFixture() {
  const profiles = {
    studentA:{nombre:'Estudiante de prueba A',curso:'3B-HC',rut:'111111111'},
    studentB:{nombre:'Estudiante de prueba B',curso:'3B-HC',rut:'222222222'},
    studentC:{nombre:'Estudiante de prueba C',curso:'3B-HC',rut:'333333333'},
    studentD:{nombre:'Estudiante de prueba D',curso:'4B-HC',rut:'444444444'},
    hiddenAccount:{nombre:'Cuenta oculta de prueba',curso:'3B-HC',rut:'111111111',ocultarDeCasas:true}
  };
  const datos = {plataforma_estudiantes:{estudiantes:profiles,admins:{teacherA:true,teacherB:true},
    docentes:{teacherA:{superadmin:true},teacherB:{cursos:['4B-HC']}},
    avatar:{studentA:{regalos:{playStation5:{de:'Profe',tipo:'docente',ts:1}}}}},
    plataforma_paes:{guia_respuestas:{17:{111111111:{status:'sent'},222222222:{status:'sent'},333333333:{status:'draft',submitted:true}},
      10:{111111111:{submittedAt:1,answers:{1:'A'}},222222222:{submittedAt:1,answers:{}}}}}};
  const state = {writes:0,failUid:null,failRead:false,profiles,datos};
  const read = route => route.split('/').filter(Boolean).reduce((value,key) => value?.[key],datos);
  const snapshot = value => ({val:() => value == null ? null : JSON.parse(JSON.stringify(value)), exists:() => value != null});
  const db = {ref:route => ({
    once:async () => { if (state.failRead && route.includes('/avatar/studentB/regalos')) return snapshot(null); return snapshot(read(route)); },
    transaction:async callback => {
      if (state.failUid && route.includes('/avatar/' + state.failUid + '/')) throw new Error('Fallo simulado');
      const result = callback(snapshot(read(route)).val());
      if (result === undefined) return {committed:false};
      const parts = route.split('/'); let parent = datos;
      parts.slice(0,-1).forEach(key => { parent = parent[key] ||= {}; }); parent[parts.at(-1)] = result; state.writes++;
      return {committed:true};
    }
  })};
  const salas = require(path.join(root,'api/_salas.js'));
  async function request(body, uid = 'teacherA') {
    let result;
    const res = {setHeader(){},status(code){ this.code = code; return this; },json(data){ result = {status:this.code,data}; return this; }};
    await salas.manejar({method:'POST',headers:{authorization:'Bearer fixture-token'},body},res,'regalos-admin-paes-lote',db,{verifyIdToken:async () => ({uid})});
    return result;
  }
  return {state,db,request};
}

async function checkBatch() {
  const fixture = createHouseFixture();
  const payload = {curso:'3B-HC',guia:'17',muebles:['playStation5','rgbPartySpeaker']};
  let response = await fixture.request(payload);
  assert.equal(response.status,200); assert.equal(fixture.state.writes,0,'La simulación nunca escribe.');
  assert.deepEqual(response.data.destinatarios.map(item => item.uid),['studentA','studentB']);
  assert.equal(response.data.excluidos,1,'Un borrador con submitted no desbloquea premios.');
  assert.deepEqual(response.data.destinatarios[0].yaTiene,['playStation5']);
  const confirm = {...payload,confirmar:true,destinatarios:['studentA','studentB']};
  response = await fixture.request({...confirm,destinatarios:['studentA']}); assert.equal(response.status,409); assert.equal(fixture.state.writes,0);
  response = await fixture.request(confirm,'teacherB'); assert.equal(response.status,403); assert.equal(fixture.state.writes,0);
  response = await fixture.request(confirm,'studentA'); assert.equal(response.status,403);
  response = await fixture.request({...payload,muebles:['../admins']}); assert.equal(response.status,400);
  response = await fixture.request({...payload,guia:'99'}); assert.equal(response.status,400);
  fixture.state.failUid = 'studentB'; response = await fixture.request(confirm);
  assert.equal(response.data.errores,1); assert.equal(response.data.destinatarios[0].confirmado,true); assert.equal(response.data.destinatarios[1].confirmado,false);
  fixture.state.failUid = null; response = await fixture.request(confirm);
  assert.equal(response.data.errores,0); assert.equal(response.data.destinatarios.every(item => item.confirmado),true);
  assert.equal(response.data.destinatarios[0].faltan.length,0,'El reintento no duplica la entrega parcial.');
  assert.equal(fixture.state.datos.plataforma_estudiantes.avatar.studentA.regalos.playStation5.ts,1,'Conserva el premio anterior.');
  response = await fixture.request(payload);
  assert.equal(response.data.catalogo.find(item => item.id === 'playStation5').tiene,true,'La relectura marca el set entregado.');
  response = await fixture.request({...payload,guia:'10'}); assert.equal(response.data.destinatarios.length,1,'Compatibilidad final de G10, nunca respuestas vacías.');
  response = await fixture.request({curso:'3B-HC',muebles:[]}); assert.equal(response.data.destinatarios.length,3,'También permite premiar el curso sin condición.');
  response = await fixture.request({estudiante:'studentD',muebles:[]},'teacherB'); assert.equal(response.data.destinatarios.length,1);
  fixture.state.profiles.duplicate = {...fixture.state.profiles.studentA}; response = await fixture.request(payload); assert.equal(response.status,409);
  const fresh = createHouseFixture(); fresh.state.failRead = true;
  response = await fresh.request(confirm); assert.equal(response.data.errores,1,'Un fallo de relectura no informa éxito.');
}

async function checkScope() {
  const handler = apiSource.slice(apiSource.indexOf('async function handleAdminHouseStudents'),apiSource.indexOf('async function handleAdminGetResults'));
  for (const [teacher, expected] of [[{cursos:['3B-HC']},['studentA']], [{cursos:{'4B-HC':true}},['studentB']], [{cursos:[]},[]], [{superadmin:true},['studentA','studentB']]]) {
    let result;
    const profiles = Object.fromEntries(students.map(item => [item.uid,{...item,email:'private@example.invalid'}]));
    profiles.hidden = {...students[0],ocultarDeCasas:true}; profiles.other = {...students[0],curso:'2B-HC'};
    const context = {ADMIN_BASE:'plataforma_estudiantes',cleanRut:value => value,
      db:{ref:route => ({once:async () => ({val:() => route.endsWith('/estudiantes') ? profiles : teacher})})},
      req:{},res:{setHeader:(name,value) => {assert.equal(name,'Cache-Control');assert.equal(value,'private, no-store');},status:code => {assert.equal(code,200);return {json:value => {result=value;}}}},decoded:{uid:'teacherA'}};
    await vm.runInNewContext(handler + '\nhandleAdminHouseStudents(req,res,decoded);',context);
    assert.deepEqual(Array.from(result.estudiantes,item => item.uid),expected);
    assert.ok(result.estudiantes.every(item => !('email' in item)));
  }
}
async function checkAdminRecovery() {
  for (const html of [page, gateway]) {
  const recovery = html.slice(html.indexOf('    async function recoverAdminSession()'), html === page ? html.indexOf('    // Node constants') : html.indexOf('    const loginView'));
  for (const status of [200,403,503]) {
    let signedIn = 0, signedOut = 0;
    const context = {legacyMigrationAttempted:false,auth:{currentUser:null,signInWithCustomToken:async token => {assert.equal(token,'test-admin-token');signedIn++;}},
      legacyApp:{auth:() => ({onAuthStateChanged:callback => {queueMicrotask(() => callback({getIdToken:async () => 'legacy-token'})); return () => {};},signOut:async () => {signedOut++;}})},
      persistenceReady:Promise.resolve(),queueMicrotask,fetch:async (url, options) => {
        assert.equal(url,'/api/estudiantes?action=admin-session-token'); assert.equal(options.headers.Authorization,'Bearer legacy-token');
        return {status,ok:status===200,json:async () => ({token:'test-admin-token'})};
      }};
    const promise = vm.runInNewContext(recovery + '\nrecoverAdminSession();',context);
    if(status===503) await assert.rejects(promise,/recuperar/); else assert.equal(await promise,status===200);
    assert.equal(signedIn,status===200?1:0);
    assert.equal(signedOut,status===200?1:0,'Nunca cerrar una sesión estudiantil durante la recuperación administrativa.');
  }
  }
}
module.exports = {createHouseFixture};
if (require.main === module) (async () => { await checkUI(); await checkBatch(); await checkScope(); await checkAdminRecovery(); console.log('Admin casas PAES: vista previa y cuatro giros, set individual/curso/tarea, simulación sin escrituras, alcance, borradores, nómina exacta, doble clic, relectura, entrega parcial y reintento sin duplicación aprobados.'); })()
  .catch(error => { console.error(error); process.exit(1); });
