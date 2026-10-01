// Dos habitaciones, una propiedad y puertas. Toda identidad y escritura es ficticia.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createHouseFixture}=require('./audit-paes-house-admin');
const salas=require('../api/_salas'),mapas=require('../estudiantes/js/mapas-casa'),catalogo=require('../estudiantes/js/catalogo-casa');
function decorateFixture(fixture){
 const {db,state}=fixture,original=db.ref;
 db.ref=route=>{
  const ref=original(route);
  ref.set=value=>ref.transaction(()=>value);
  ref.remove=()=>ref.set(null);
  ref.push=()=>{const key='fixtureMsg'+String(++state.writes).padStart(8,'0');return {...db.ref(route+'/'+key),key};};
  ref.update=async values=>{for(const [key,value] of Object.entries(values))await db.ref(route+'/'+key).set(value);};
  const once=ref.once;
  ref.once=async()=>{const snap=await once();snap.forEach=fn=>Object.entries(snap.val()||{}).forEach(([key,value])=>fn({key,val:()=>value}));return snap;};
  ref.orderByChild=field=>({equalTo:value=>({once:async()=>{const snap=await ref.once();return {val:()=>Object.fromEntries(Object.entries(snap.val()||{}).filter(([,p])=>p?.[field]===value))};}}),limitToLast:()=>({once:ref.once})});
  return ref;
 };
 return fixture;
}
async function check(){
 const {state,db}=decorateFixture(createHouseFixture()),av=state.datos.plataforma_estudiantes.avatar;
 state.datos.plataforma_estudiantes.configuracion={mi_espacio:{enabled:true}};
 const academics=JSON.stringify(state.datos.plataforma_paes);
 const ask=async(action,body={},uid='studentA')=>{
  let out;const res={setHeader(){},status(code){this.code=code;return this;},json(data){out={status:this.code,data};return this;}};
  await salas.manejar({method:'POST',headers:{authorization:'Bearer fixture'},body},res,action,db,{verifyIdToken:async()=>({uid})});return out;
 };
 av.studentA.casa={tamano:'5x5',piso:'claro',muro:'blanco'};av.studentA.pieza=[{id:'chairDesk',col:0,fila:1,dir:'SE'}];
 const legacy=JSON.stringify(av.studentA);
 let r=await ask('habitaciones');assert.equal(r.data.actual,'principal');assert.deepEqual(r.data.habitaciones.estudio.pieza,[]);assert.equal(JSON.stringify(av.studentA),legacy,'Consultar no migra ni borra la casa.');
 assert.equal((await ask('habitaciones',{sala:'studentD'})).status,404);
 assert.equal((await ask('habitaciones',{sala:'hiddenAccount'})).status,404);
 assert.equal((await ask('guardar-pieza',{habitacion:'../principal',pieza:[]})).status,400);
 const ps5={id:'playStation5',col:1,fila:2,dir:'SE'};
 assert.equal((await ask('guardar-pieza',{pieza:[ps5]})).status,200);
 assert.equal((await ask('guardar-pieza',{habitacion:'estudio',pieza:[ps5]})).status,409,'No duplicar el premio en otra sala.');
 assert.equal((await ask('guardar-pieza',{pieza:[]})).status,200);
 assert.equal((await ask('guardar-pieza',{habitacion:'estudio',pieza:[ps5]})).status,200);
 assert.equal((await ask('guardar-pieza',{pieza:[ps5]})).status,409,'La protección es simétrica.');
 assert.equal((await ask('guardar-pieza',{habitacion:'estudio',pieza:[{...ps5,col:7}]})).status,409);
 assert.equal((await ask('guardar-casa',{habitacion:'estudio',casa:{tamano:'9x7'}})).status,200);assert.equal(av.studentA.casa.tamano,'5x5');
 assert.equal((await ask('guardar-casa',{habitacion:'estudio',casa:{tamano:'9x7',muro:'piedra'}})).status,409,'Acabados premiados siguen protegidos.');
 await ask('entrar',{sala:'studentA',col:2,fila:3});
 assert.equal((await ask('pasar-puerta',{sala:'studentA'})).status,409,'No pasar sin llegar a la puerta.');
 const dic=Object.fromEntries(catalogo.map(p=>[p.id,p]));
 const puerta=mapas.puerta(av.studentA.casa,av.studentA.pieza,dic);
 await ask('latido',{sala:'studentA',...puerta,dir:'E'});r=await ask('pasar-puerta',{sala:'studentA'});
 assert.equal(r.status,200);assert.equal(r.data.habitacion,'estudio');assert.equal(av.studentA.habitaciones.actual,'estudio');
 assert.equal(state.datos.plataforma_estudiantes.salas.studentA.presentes.studentA,undefined);
 assert.ok(state.datos.plataforma_estudiantes.salas.studentA.habitaciones.estudio.presentes.studentA);
 assert.equal((await ask('habitaciones')).data.actual,'estudio','Recarga conserva la sala.');
 r=await ask('decir',{sala:'studentA',habitacion:'estudio',texto:'Hola desde el estudio'});assert.equal(r.status,200);assert.ok(r.data.ok);
 assert.equal((await ask('entrar',{sala:'studentA',habitacion:'estudio'},'studentB')).status,403);
 await ask('entrar',{sala:'studentA',...puerta},'studentB');r=await ask('pasar-puerta',{sala:'studentA'},'studentB');assert.ok(r.data.ok,'Una visita puede usar la puerta.');
 assert.equal((await ask('guardar-posicion',{habitacion:'estudio',col:8,fila:6})).data.personajeEn.col,8);
 const p2=mapas.puerta(av.studentA.habitaciones.estudio.casa,av.studentA.habitaciones.estudio.pieza,dic);
 await ask('latido',{sala:'studentA',habitacion:'estudio',...p2});r=await ask('pasar-puerta',{sala:'studentA',habitacion:'estudio'});assert.equal(r.data.habitacion,'principal');
 assert.ok(av.studentA.habitaciones.estudio.pieza.some(p=>p.id==='playStation5'));
 assert.equal((await ask('regalar',{para:'studentB',mueble:'playStation5'})).data.ok,false,'No transferir un premio manual.');
 av.studentA.regalos.bookcaseOpen={tipo:'estudiante',de:'Compañero',ts:1};
 av.studentA.habitaciones.estudio.pieza=[{id:'bookcaseOpen',col:2,fila:2,dir:'SE'}];
 r=await ask('regalar',{para:'studentB',mueble:'bookcaseOpen'});assert.ok(r.data.ok);assert.equal(av.studentA.regalos.bookcaseOpen,null);assert.equal(av.studentA.habitaciones.estudio.pieza.length,0,'Transferir quita el objeto de la sala interior.');
 await ask('configurar',{enabled:false},'teacherA');assert.equal(state.datos.plataforma_estudiantes.salas.studentA.presentes,null);assert.equal(state.datos.plataforma_estudiantes.salas.studentA.habitaciones.estudio.presentes,null);
 for(const action of ['entrar','pasar-puerta','habitaciones','guardar-posicion','guardar-pieza'])assert.equal((await ask(action,{sala:'studentA'})).data.disabled,true,'El bloqueo docente cubre '+action);
 assert.equal(JSON.stringify(state.datos.plataforma_paes),academics);
 const libre=(c,f)=>c>=0&&c<5&&f>=0&&f<5;
 assert.equal(mapas.ruta({col:0,fila:0},{col:4,fila:4},libre).length,5);
 assert.equal(mapas.ruta({col:0,fila:0},{col:1,fila:1},(c,f)=>libre(c,f)&&!(c===1&&f===0)&&!(c===0&&f===1)),null,'No cortar esquinas.');
 assert.equal(new Set([[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].map(([col,fila])=>mapas.direccion({col:0,fila:0},{col,fila}))).size,8);
 assert.equal(mapas.suelo({tamano:'salon-l'},6,1),false);
 const rule=JSON.parse(fs.readFileSync(path.join(__dirname,'../firebase-rules.json'),'utf8')).rules.plataforma_estudiantes.avatar.$uid.$campo['.write'];assert.ok(rule.includes("$campo !== 'habitaciones'"));
 console.log('Habitaciones: compatibilidad, ocho direcciones, esquinas, puerta/visitas/recarga/chat, inventario único, transferencia y bloqueo docente; datos y notas intactos: OK.');
}
module.exports={decorateFixture,check};
if(require.main===module)check().catch(e=>{console.error(e.stack);process.exitCode=1;});
