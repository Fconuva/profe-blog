'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'paes/admin/index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'paes/admin/casas.js'), 'utf8');
const apiSource = fs.readFileSync(path.join(root, 'api/paes.js'), 'utf8');
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
  const elements = Object.fromEntries(['Course','Student','Refresh','Give','Confirm','Catalog','Deliveries','Summary','Status','Search','Ownership','Chosen'].map(id => ['house' + id, new Element()]));
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
      if (action === 'salas-regalos-admin-entregar') {
        gifts++;
        if (pauseGift) await new Promise(resolve => { releaseGift = resolve; });
        if (denied) return {ok:false,json:async () => ({error:'No se pudo entregar.'})};
        assert.equal(body.estudiante, 'studentA'); assert.equal(body.mueble, 'playStation5'); owned = true;
        return {ok:true,json:async () => ({ok:true,mueble:body.mueble})};
      }
      assert.equal(action, 'salas-regalos-admin-inventario');
      if (readbackFails && owned) return {ok:false,json:async () => ({error:'Sin conexión al inventario.'})};
      return {ok:true,json:async () => ({ok:true,estudiante:students.find(item => item.uid === body.estudiante), catalogo:[
        {id:'playStation5',nombre:'PlayStation 5',familia:'estudio',tiene:owned},
        {id:'rugRound',nombre:'Alfombra',familia:'deco',tiene:true},
        {id:'../admins',nombre:'No válido',familia:'',tiene:false}
      ]})};
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
  assert.equal(elements.houseStudent.options.length, 3);
  elements.houseCourse.value = '3B-HC'; await elements.houseCourse.fire('change');
  assert.equal(elements.houseStudent.options.length, 2);
  elements.houseStudent.value = 'studentA'; await elements.houseStudent.fire('change');
  assert.equal(elements.houseDeliveries.children.length, 1);
  assert.equal(elements.houseCatalog.children.length, 2);
  assert.equal(elements.houseCatalog.children[1].disabled, true);
  await elements.houseCatalog.children[0].fire('click');
  assert.equal(elements.houseConfirm.hidden, false);
  denied = true; await elements.houseGive.fire('click');
  assert.match(elements.houseStatus.textContent, /No se pudo entregar/);
  assert.equal(owned,false);
  denied = false; pauseGift = true;
  const gift = elements.houseGive.fire('click');
  await new Promise(setImmediate);
  assert.equal(elements.houseStudent.disabled,true);
  const before = gifts; await elements.houseGive.fire('click'); assert.equal(gifts,before);
  releaseGift(); await gift;
  assert.equal(owned,true);
  assert.match(elements.houseStatus.textContent,/Regalo confirmado/);
  assert.equal(elements.houseCatalog.children[0].disabled,true);
  assert.equal(elements.houseConfirm.hidden,true);
  assert.ok(calls.lastIndexOf('salas-regalos-admin-inventario') > calls.lastIndexOf('salas-regalos-admin-entregar'));
  await panel.load();
  assert.equal(elements.houseCatalog.children[0].disabled,true,'Recargar conserva el mueble marcado.');
  elements.houseOwnership.value = 'available'; await elements.houseOwnership.fire('change');
  assert.equal(elements.houseCatalog.children[0].textContent,'No hay muebles que coincidan con este filtro.');
  owned = false; pauseGift = false; elements.houseOwnership.value = 'all'; await panel.load();
  await elements.houseCatalog.children[0].fire('click'); readbackFails = true;
  await elements.houseGive.fire('click');
  assert.doesNotMatch(elements.houseStatus.textContent,/Regalo confirmado/);
  assert.match(elements.houseStatus.textContent,/No se pudo confirmar/);
  assert.equal(elements.houseGive.disabled,false);
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
  const recovery = page.slice(page.indexOf('    async function recoverAdminSession()'), page.indexOf('    // Node constants'));
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
(async () => { await checkUI(); await checkScope(); await checkAdminRecovery(); console.log('Admin casas PAES: sesión docente aislada, alcance, entregas finales, elección, rechazo, doble clic, regalo con relectura, persistencia y fallo de confirmación aprobados.'); })()
  .catch(error => { console.error(error); process.exit(1); });
