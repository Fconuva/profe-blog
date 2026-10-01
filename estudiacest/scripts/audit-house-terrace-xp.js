'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createHouseFixture}=require('./audit-paes-house-admin');
const salas=require('../api/_salas'),levels=require('../estudiantes/js/avatar-levels'),maps=require('../estudiantes/js/mapas-casa'),catalog=require('../estudiantes/js/catalogo-casa');
const fixture=createHouseFixture(),{db,state}=fixture,root=path.resolve(__dirname,'..');
const avatar=()=>state.datos.plataforma_estudiantes.avatar.studentA;
async function request(action,body={},uid='teacherA'){
  let result;const res={setHeader(){},status(code){this.code=code;return this;},json(data){result={code:this.code,data};}};
  await salas.manejar({method:'POST',headers:{authorization:'Bearer test'},body},res,action,db,{verifyIdToken:async()=>({uid})});return result;
}
const xp=body=>request('experiencia-admin',{...body,estudiante:'studentA'});
async function checkXP(){
  avatar().xp_total=175;avatar().look={arriba:'camisetaRangers'};
  const academic=JSON.stringify(state.datos.plataforma_paes),oldGift=JSON.stringify(avatar().regalos.playStation5);
  assert.equal((await xp({})).data.xpTotal,175);
  assert.equal((await request('experiencia-admin',{estudiante:'studentA'},'studentA')).code,403);
  assert.equal((await request('experiencia-admin',{estudiante:'studentA'},'teacherB')).code,403);
  for(const cantidad of [-1,0,10001,1.5])assert.equal((await xp({modo:'simular',tipo:'xp',cantidad,motivo:'Trabajo terminado'})).code,400);
  const p=(await xp({modo:'simular',tipo:'xp',cantidad:125,motivo:'Trabajo revisado'})).data;
  assert.equal(p.despues.xpTotal,300);assert.equal(state.writes,0,'Simular no escribe.');
  const confirm={...p,modo:'confirmar'};assert.equal((await xp(confirm)).data.xpTotal,300);
  const writes=state.writes;assert.equal((await xp(confirm)).data.xpTotal,300);assert.equal(state.writes,writes,'Reintentar no duplica XP.');
  assert.equal(avatar().xp_total,175,'La experiencia académica conserva su nodo.');
  avatar().xp_total+=25;assert.equal((await xp({})).data.xpTotal,325,'Otra tarea conserva el premio manual.');
  assert.equal((await xp({...confirm,motivo:'Otro motivo'})).code,409,'No reutilizar operación para otro premio.');
  const stale=(await xp({modo:'simular',tipo:'nivel',cantidad:20,motivo:'Proyecto revisado'})).data;
  avatar().xp_total+=25;assert.equal((await xp({...stale,modo:'confirmar'})).code,409,'Una vista previa obsoleta exige releer.');
  const last=(await xp({modo:'simular',tipo:'nivel',cantidad:200,motivo:'Reconocimiento del profesor'})).data;
  assert.equal((await xp({...last,modo:'confirmar'})).data.nivel,200);
  assert.equal((await xp({...last,modo:'confirmar'})).data.nivel,200);
  assert.equal((await xp({modo:'simular',tipo:'nivel',cantidad:1,motivo:'No debe quitar XP'})).code,400);
  assert.equal(JSON.stringify(avatar().regalos.playStation5),oldGift);assert.deepEqual(avatar().look,{arriba:'camisetaRangers'});
  assert.equal(JSON.stringify(state.datos.plataforma_paes),academic,'Nunca cambia notas ni entregas.');
  assert.equal(levels.getManualXP({regalos:{xp__fake:{tipo:'otro',delta:1000},xp__negative:{tipo:'xp-docente',delta:-1},ropa__fake:{tipo:'xp-docente',delta:1000}}}),0);
}
async function checkGeometry(){
  state.datos.plataforma_estudiantes.configuracion={mi_espacio:{enabled:true}};
  avatar().casa={tamano:'5x5',piso:'claro',muro:'blanco'};
  for(const id of ['terracePoolSmall','terracePoolMedium','terracePoolLarge','terraceGrass'])avatar().regalos[id]={tipo:'docente'};
  const medium=catalog.find(m=>m.id==='terracePoolMedium');assert.deepEqual(maps.huella(medium,'SE'),{cols:3,filas:2});assert.deepEqual(maps.huella(medium,'SW'),{cols:2,filas:3});
  const save=pieza=>request('guardar-pieza',{pieza},'studentA');
  assert.equal((await save([{id:'terracePoolSmall',col:4,fila:4,dir:'SE'}])).code,409);
  const good=[{id:'terracePoolMedium',col:2,fila:3,dir:'SE'}];assert.equal((await save(good)).code,200);
  assert.equal((await save([{...good[0],dir:'SW'}])).code,409,'Girar no puede dejar media piscina fuera.');
  assert.equal((await save([...good,{id:'chairDesk',col:4,fila:4,dir:'SE'}])).code,409,'El interior de la piscina está ocupado.');
  assert.equal((await save([{...good[0],sobre:true}])).code,409);
  assert.equal((await save([{...good[0],pared:'izq',pos:1,nivel:0}])).code,409);
  assert.equal((await save([{id:'wallStone',col:0,fila:0,dir:'SE'}])).code,409,'Los acabados no son muebles del piso.');
  const house=casa=>request('guardar-casa',{casa},'studentA');
  assert.equal((await house({tamano:['9x9']})).code,400,'El tamaño no admite objetos ni listas.');
  assert.equal((await house({tamano:'9x9',muro:'piedra'})).code,409,'Un acabado no recibido está bloqueado.');
  avatar().regalos.wallStone={tipo:'docente'};
  assert.equal((await house({tamano:'9x9',muro:'piedra',piso:'pasto'})).code,200);
  assert.equal(avatar().casa.muro,'piedra');assert.equal(avatar().casa.piso,'pasto');
  assert.equal((await save([{id:'terracePoolLarge',col:6,fila:5,dir:'SE'}])).code,409);
  assert.equal((await save([{id:'terracePoolLarge',col:5,fila:5,dir:'SE'}])).code,200);
  assert.equal((await house({tamano:'5x5',muro:'piedra',piso:'pasto'})).code,409,'Reducir valida todas las casillas del mueble.');
}
function checkAssets(){
  const specs=catalog.filter(m=>m.fam==='terraza');assert.equal(specs.length,12);
  assert.deepEqual(specs.map(m=>m.id).sort(),['terracePoolSmall','terracePoolMedium','terracePoolLarge','terraceWaterfall','terraceGrass','terracePalm','terraceOak','terracePine','terraceRockingChair','terraceLounger','terraceTable','terraceParasol'].sort());
  for(const item of specs)for(const view of ['SE','SW','NE','NW']){
    const bytes=fs.readFileSync(path.join(root,'estudiantes/assets/pieza/'+item.id+'_'+view+'.png'));
    assert.equal(bytes.readUInt32BE(0),0x89504e47);assert.equal(bytes[25],6,'RGBA: '+item.id);
    assert.ok(bytes.readUInt32BE(16)>20&&bytes.readUInt32BE(20)>20);
    assert.ok(catalog.some(m=>m.id===item.id&&m.xp===9999));
  }
  const sets=vm.runInNewContext('('+fs.readFileSync(path.join(root,'paes/admin/casas.js'),'utf8').match(/const sets = (\{[\s\S]*?\});/)[1]+')');
  assert.equal(sets.terrace.length,12);assert.equal(sets.walls.length,6);assert.equal(catalog.filter(m=>m.acabado).length,6);
  const rule=JSON.parse(fs.readFileSync(path.join(root,'firebase-rules.json'),'utf8')).rules.plataforma_estudiantes.avatar.$uid.$campo['.write'];
  for(const protectedField of ['regalos','pieza','casa'])assert.ok(rule.includes("$campo !== '"+protectedField+"'"));
  const mi=fs.readFileSync(path.join(root,'estudiantes/js/mi-espacio.js'),'utf8');assert.ok(mi.includes("'guardar-casa'"));assert.ok(mi.includes("effect==='agua'"));assert.ok(mi.includes("effect==='cascada'"));
}
module.exports={request};
if(require.main===module)(async()=>{checkAssets();await checkXP();await checkGeometry();console.log('Terraza y experiencia docente: 12 piezas, 6 muros, huellas/giros, permisos, simulación, relectura, XP protegido sin duplicados y notas intactas: OK.');})().catch(e=>{console.error(e.message);process.exitCode=1;});
