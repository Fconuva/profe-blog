'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const look=require('../estudiantes/js/personaje-iso'),salas=require('../api/_salas');
const {createHouseFixture}=require('./audit-paes-house-admin');
const root=path.join(__dirname,'..');
async function test(){
  const list=look.catalogoPremios();
  assert.equal(list.filter(p=>p.tipo==='logro').length,10);
  assert.equal(new Set(list.map(p=>p.id)).size,list.length);
  const teams=list.filter(p=>p.opcion?.startsWith('camiseta'));
  assert.equal(teams.length,6);assert.equal(new Set(teams.map(p=>p.opcion)).size,6);
  assert.equal(look.normalizeLook({gorro:'corona'},{xpTotal:0}).gorro,'nada');
  const own={'ropa__gorro__corona':{tipo:'docente'}};
  assert.equal(look.normalizeLook({gorro:'corona'},{xpTotal:0,regalos:own}).gorro,'corona');
  assert.equal(look.normalizeLook({gorro:'corona'},{xpTotal:0,avatarData:{regalos:own}}).gorro,'corona');
  assert.equal(look.getEditorCategories({xpTotal:0,regalos:own}).find(c=>c.id==='gorro').options.find(o=>o.id==='corona').locked,false);
  assert.equal(look.getUnlockedOptions('gorro',{xpTotal:0,regalos:own}).some(o=>o.id==='corona'),true);
  assert.equal(Boolean(look.logrosConPremios({docente_excelencia:true},{}).docente_excelencia),false,'No basta una escritura del alumno en logros.');
  assert.equal(Object.keys(look.logrosConPremios({},{})).length,0,'Los logros bloqueados no aumentan el conteo.');
  assert.ok(look.logrosConPremios({}, {'logro__docente_excelencia':{tipo:'docente'}}).docente_excelencia);
  const fixture=createHouseFixture(),{db,state}=fixture;
  const academics=JSON.stringify(state.datos.plataforma_paes);
  async function request(body,uid='teacherA',action='regalos-admin-avatar'){
    let output;const res={setHeader(){},status(code){this.code=code;return this;},json(data){output={status:this.code,data};}};
    await salas.manejar({method:'POST',headers:{authorization:'Bearer test-token'},body},res,action,db,{verifyIdToken:async()=>({uid})});return output;
  }
  let result=await request({estudiante:'studentA'});assert.equal(result.status,200);assert.equal(state.writes,0);
  assert.equal((await request({estudiante:'studentA'},'studentA')).status,403);
  assert.equal((await request({estudiante:'studentA'},'teacherB')).status,403);
  assert.equal((await request({estudiante:'missing'})).status,404);
  assert.equal((await request({estudiante:'studentA',premio:'../admins',confirmar:true})).status,400);
  for(const prize of [...list.filter(p=>p.tipo==='logro'),...teams,list.find(p=>p.id==='ropa__gorro__corona')]){
    result=await request({estudiante:'studentA',premio:prize.id,confirmar:true});
    assert.equal(result.status,200);assert.equal(result.data.catalogo.find(p=>p.id===prize.id).tiene,true);
    const original=JSON.stringify(state.datos.plataforma_estudiantes.avatar.studentA.regalos[prize.id]);
    result=await request({estudiante:'studentA',premio:prize.id,confirmar:true});
    assert.equal(JSON.stringify(state.datos.plataforma_estudiantes.avatar.studentA.regalos[prize.id]),original,'No reemplazar ni duplicar el premio.');
  }
  assert.equal(JSON.stringify(state.datos.plataforma_paes),academics);
  const gifts=state.datos.plataforma_estudiantes.avatar.studentA.regalos;
  assert.equal(gifts.playStation5.ts,1,'No tocar los muebles manuales existentes.');
  result=await request({para:'studentB',mueble:'ropa__arriba__camisetaRangers'},'studentA','regalar');
  assert.equal(result.data.ok,false,'La ropa del profesor no se transfiere como mueble.');
  const inventory=await request({},'studentA','inventario');
  assert.ok(inventory.data.regalos.ropa__gorro__corona);
  assert.ok(inventory.data.regalos.logro__docente_excelencia);
  const rules=JSON.parse(fs.readFileSync(path.join(root,'firebase-rules.json'),'utf8'));
  assert.ok(rules.rules.plataforma_estudiantes.avatar.$uid.$campo['.write'].includes("$campo !== 'regalos'"));
  const page=fs.readFileSync(path.join(root,'paes/admin/index.html'),'utf8');
  for(const id of ['Type','Catalog','Status','Confirm','Give','Cancel','Chosen'])assert.ok(page.includes('id="avatarPrize'+id+'"'));
  assert.ok(page.indexOf('personaje-iso.js')<page.indexOf('/paes/admin/premios.js'));
  assert.ok(page.indexOf('id="avatarPrizePanel"')<page.indexOf('id="houseCatalog"'),'El acceso a ropa/logros no debe quedar enterrado bajo 190 muebles.');
  const html=fs.readFileSync(path.join(root,'estudiantes/logros.html'),'utf8');
  for(const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
  await checkUI();
  console.log('Premios docentes: 10 logros protegidos, 6 camisetas, ropa regalada sin XP, permisos, vista previa, confirmación, doble clic y conservación de notas/muebles: OK.');
}
async function checkUI(){
  class Element{
    constructor(){this.children=[];this.listeners={};this.style={};this.value='';this.hidden=false;this.disabled=false;}
    replaceChildren(...values){this.children=values;}append(...values){this.children.push(...values);}
    addEventListener(event,fn){this.listeners[event]=fn;}async fire(event){return this.listeners[event]?.();}
  }
  const nodes=Object.fromEntries(['Type','Catalog','Status','Confirm','Chosen','Give','Cancel'].map(id=>['avatarPrize'+id,new Element()]));nodes.avatarPrizeType.value='logro';
  const source=fs.readFileSync(path.join(root,'paes/admin/premios.js'),'utf8');
  let student=null,owned=false,writes=0,fail=false,release=null;const previews=[];
  const win={AvatarLookSystem:{...look,render:(host,ctx)=>{previews.push(ctx.look);host.append(new Element());}}};
  vm.runInNewContext(source,{window:win,document:{getElementById:id=>nodes[id],createElement:()=>new Element()}});
  const panel=win.PaesPremiosAdmin.mount({student:()=>student,enabled:()=>true,api:async(action,payload)=>{
    assert.equal(action,'regalos-admin-avatar');
    if(payload.confirmar){writes++;if(release)await release.promise;if(fail)throw Error('Sin conexión.');owned=true;}
    return {catalogo:look.catalogoPremios().map(p=>({...p,tiene:owned && p.id==='ropa__arriba__camisetaRangers'}))};
  }});
  await panel.load();assert.equal(nodes.avatarPrizeCatalog.children.length,10);
  assert.ok(nodes.avatarPrizeCatalog.children.every(c=>c.children[3].disabled));
  student={uid:'test',nombre:'Estudiante de prueba'};await panel.load();assert.equal(writes,0);
  nodes.avatarPrizeType.value='equipos';await nodes.avatarPrizeType.fire('change');
  assert.equal(nodes.avatarPrizeCatalog.children.length,6);assert.equal(new Set(previews.slice(-6).map(p=>p.arriba)).size,6);
  await nodes.avatarPrizeCatalog.children[5].children[3].fire('click');assert.equal(nodes.avatarPrizeConfirm.hidden,false);assert.equal(writes,0);
  fail=true;await nodes.avatarPrizeGive.fire('click');assert.match(nodes.avatarPrizeStatus.textContent,/Sin conexión/);assert.equal(owned,false);
  fail=false;await nodes.avatarPrizeCatalog.children[5].children[3].fire('click');
  let finish;release={promise:new Promise(resolve=>{finish=resolve;})};const pending=nodes.avatarPrizeGive.fire('click');await nodes.avatarPrizeGive.fire('click');finish();await pending;
  assert.equal(writes,2,'Un intento fallido y uno confirmado; el doble clic no entrega otra vez.');
  assert.equal(nodes.avatarPrizeCatalog.children[5].children[3].disabled,true);assert.match(nodes.avatarPrizeStatus.textContent,/recibido/);
}
test().catch(error=>{console.error(error);process.exit(1);});
