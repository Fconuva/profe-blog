'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createHouseFixture}=require('./audit-paes-house-admin'),{decorateFixture}=require('./audit-house-rooms');
const salas=require('../api/_salas'),catalogo=require('../estudiantes/js/catalogo-casa'),avatar=require('../estudiantes/js/personaje-iso');
function fixture(){
 const f=decorateFixture(createHouseFixture());f.state.datos.plataforma_estudiantes.configuracion={mi_espacio:{enabled:true}};
 const ask=async(action,body={},uid='studentA')=>{let r;const res={setHeader(){},status(code){this.code=code;return this;},json(data){r={status:this.code,data};}};await salas.manejar({method:'POST',headers:{authorization:'Bearer fixture'},body},res,action,f.db,{verifyIdToken:async()=>({uid})});return r;};
 return {...f,ask};
}
async function check(){
 const f=fixture(),{state,ask,db}=f,pe=state.datos.plataforma_estudiantes;
 const before=JSON.stringify({paes:state.datos.plataforma_paes,avatar:pe.avatar});
 const comun=catalogo.idCurso('3B-HC'),otro=catalogo.idCurso('4B-HC'),scene=catalogo.salaCurso('3B-HC');
 assert.equal(new Set(['3B-HC','3B HC','3B_HC','2°A HC'].map(catalogo.idCurso)).size,4);
 assert.deepEqual(avatar.CAPAS,['fondo','piernas','cuerpo','rostro','pelo','expresion','accesorios']);
 assert.ok(scene.pieza.every(p=>catalogo.some(m=>m.id===p.id)));
 assert.equal((await ask('habitaciones',{sala:comun})).data.comun,true);
 assert.equal((await ask('lista')).data.comun.uid,comun,'El servidor resuelve el curso sin confiar en la etiqueta PAES');
 assert.equal((await ask('habitaciones',{sala:otro})).status,404);
 assert.equal((await ask('entrar',{sala:comun},'studentD')).status,404);
 assert.equal((await ask('entrar',{sala:comun},'hiddenAccount')).status,403);
 assert.equal((await ask('pasar-puerta',{sala:comun})).status,400);
 assert.equal((await ask('lista')).data.comun.uid,comun);
 let r=await ask('entrar',{sala:comun,col:5,fila:7});assert.equal(r.data.ok,true);
 const use=(i,uid='studentA',on=true,operacion='op_'+i+'_'+uid)=>ask('interactuar',{sala:comun,indice:i,mueble:scene.pieza[i].id,col:scene.pieza[i].col,fila:scene.pieza[i].fila,encendido:on,operacion},uid);
 assert.equal((await use(0)).status,409,'Rechaza accionar de lejos');
 const near=async(i,uid='studentA')=>{const m=scene.pieza[i];await ask('entrar',{sala:comun,col:m.col,fila:m.fila+1},uid);};
 await near(0);r=await use(0);assert.equal(r.data.ok,true);assert.equal(r.data.juego.interacciones[0].encendido,true);
 const initial=JSON.stringify(r.data.juego);assert.equal(JSON.stringify((await use(0)).data.juego),initial,'Reintento idempotente');
 await near(1);await use(1);assert.equal(Object.keys(pe.salas_comunes[comun].juego.luces).length,1,'Una persona mantiene una sola luz');
 await near(0);await use(0,'studentA',true,'nuevo_A0');
 await near(1,'studentB');await use(1,'studentB');await near(2,'studentC');r=await use(2,'studentC');
 assert.ok(r.data.juego.completadoHasta>Date.now(),'Tres personas completan el reto');
 await near(3);r=await use(3);assert.equal(r.data.actividad,'tocar');assert.equal(pe.salas_comunes[comun].presentes.studentA.actividad,'tocar');
 assert.equal((await ask('interactuar',{sala:comun,indice:0,mueble:'../admins',col:1,fila:1,encendido:true,operacion:'bad_bad_bad'})).status,409);
 assert.equal((await ask('latido',{sala:comun},'studentD')).status,403);
 assert.equal((await ask('decir',{sala:comun,texto:'Hola'},'studentD')).status,403);
 await ask('decir',{sala:comun,texto:'Hola desde la sala del curso'});assert.ok(Object.values(pe.salas_comunes[comun].chat).some(m=>m.texto.includes('sala del curso')));
 await db.ref('plataforma_estudiantes/salas_comunes/'+comun+'/presentes/studentA/ultimoMsg').set(0);
 assert.equal((await ask('decir',{sala:comun,texto:'mierda'})).data.bloqueado,true);
 assert.equal(JSON.stringify({paes:state.datos.plataforma_paes,avatar:pe.avatar}),before,'Social no concede objetos ni XP ni cambia datos académicos');
 // Aforo transaccional y caducidad; el mismo usuario puede reconectar.
 pe.salas_comunes[comun].presentes=Object.fromEntries(Array.from({length:60},(_,i)=>['fixture'+i,{ts:Date.now()}]));
 assert.equal((await ask('entrar',{sala:comun})).data.lleno,true);
 pe.salas_comunes[comun].presentes.fixture0.ts=0;assert.equal((await ask('entrar',{sala:comun})).data.ok,true);
 assert.equal((await ask('entrar',{sala:comun})).data.ok,true);assert.equal(Object.keys(pe.salas_comunes[comun].presentes).length,60);
 // Solo el dueño modifica un interruptor privado. La pieza conserva todos sus campos.
 pe.avatar.studentA.pieza=[{id:'rgbPartySpeaker',col:2,fila:2,dir:'SW',encendido:false}];
 await ask('entrar',{sala:'studentA',col:2,fila:3});
 const body={sala:'studentA',indice:0,mueble:'rgbPartySpeaker',col:2,fila:2,encendido:true,operacion:'privado_123'};
 assert.equal((await ask('interactuar',body)).data.ok,true);assert.equal(pe.avatar.studentA.pieza[0].dir,'SW');
 await ask('entrar',{sala:'studentA',col:2,fila:3},'studentB');assert.equal((await ask('interactuar',body,'studentB')).status,403);
 await ask('configurar',{enabled:false},'teacherA');assert.deepEqual(pe.salas_comunes[comun].presentes,null);
 assert.equal((await ask('interactuar',body)).data.disabled,true);
 const rules=JSON.parse(fs.readFileSync(path.join(__dirname,'../firebase-rules.json'),'utf8')).rules.plataforma_estudiantes;
 assert.equal(rules.salas_comunes['.read'],false);assert.equal(rules.salas_comunes['.write'],false);
 assert.ok(rules.salas_comunes.$sala['.read'].includes("child('curso').val() === data.child('curso').val()"));
 assert.equal(rules.salas_comunes.$sala['.write'],false);
 assert.ok(rules.estudiantes.$uid['.validate'].includes("newData.child('curso').val() === data.child('curso').val()"));
 assert.ok(rules.estudiantes.$uid['.validate'].includes("newData.child('ocultarDeCasas').val() === data.child('ocultarDeCasas').val()"));
 console.log('Social: cursos aislados, aforo/reconexión, chat filtrado, proximidad, acciones confirmadas, reintento, reto de tres personas, bloqueo y conservación académica: OK. Avatar: siete capas originales.');
}
module.exports={fixture,check};if(require.main===module)check().catch(e=>{console.error(e.stack);process.exitCode=1;});
