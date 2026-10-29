'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const rewards=require('../api/_premios-paes');
const salas=require('../api/_salas');
const catalog=require('../estudiantes/js/catalogo-casa');
const {createHouseFixture}=require('./audit-paes-house-admin');
const root=path.join(__dirname,'..');
// Muebles regalables que ya recibieron completos 3A, 3B, 4A y 4B HC el 29-oct-2026.
// No se edita: un set de tarea nuevo no puede repetir ninguno.
const ENTREGADOS_29OCT=new Set([
  "terracePoolSmall","terracePoolMedium","terracePoolLarge","terraceWaterfall","terraceGrass","terracePalm",
  "terraceOak","terracePine","terraceRockingChair","terraceLounger","terraceTable","terraceParasol","wallStone",
  "wallWood","wallBrick","wallGarden","wallBlueTile","wallTerraceFence","gymBench","gymDumbbells",
  "gymTreadmill","gymBike","christmasTree","halloweenPumpkin","halloweenCauldron","halloweenGhost",
  "halloweenScarecrow","halloweenCandy","halloweenLantern","rgbPartySpeaker","gamerDesk","whiteGamerTower",
  "gamerChair","loungeSofaThree","aquarium","statueCR7","statueMessi","petDachshund","petPoodle","petTerrier",
  "petCatOrange","petCatBlack","electricGuitarSet","drumKit","musicKeyboard","uprightPiano","electricBass",
  "djStation","rugGryffindor","rugSlytherin","rugRavenclaw","rugHufflepuff","rugRangers","cardboardBoxClosed",
  "books","bear","cabinetBed","cabinetBedDrawer","cabinetBedDrawerTable","rugRectangle","rugRectangle__naranja",
  "rugRectangle__rojo","bookcaseOpen","bookcaseOpenLow","chair","cardboardBoxOpen","coatRack","ceilingFan",
  "sideTable","sideTableDrawers","rugRectangle__amarillo","rugRectangle__celeste","rugRectangle__verde",
  "chairCushion","chairDesk","chairRounded","lampRoundTable","lampRoundFloor","coatRackStanding","bench",
  "benchCushionLow","benchCushion","rugRectangle__azul","rugRectangle__morado","rugRectangle__rosa",
  "lampSquareTable","lampSquareFloor","lampSquareCeiling","computerScreen","computerMouse","computerKeyboard",
  "cabinetTelevision","cabinetTelevisionDoors","loungeChair","rugRound","rugRound__naranja","rugRound__rojo",
  "plantSmall3","pillow","pillow__amarillo","pillow__azul","pillow__celeste","pillowLong",
  "pillowLong__amarillo","pillowLong__azul","pillowLong__celeste","pillowLong__morado","pillowLong__naranja",
  "pillowLong__rojo","pillowLong__rosa","pillowLong__verde","pillow__morado","pillow__naranja","pillow__rojo",
  "pillow__rosa","pillow__verde","trashcan","speaker","speakerSmall","playStation5","cocaColaCooler",
  "monsterEnergyCooler","pottedPlant","plantSmall2","radio","plantSmall1","kitchenBar","kitchenBarEnd","dryer",
  "desk","deskCorner","laptop","loungeChairRelax","loungeSofa","loungeSofaCorner","rugSquare",
  "rugSquare__amarillo","rugSquare__azul","rugSquare__celeste","rugSquare__morado","rugSquare__naranja",
  "rugSquare__rojo","rugSquare__rosa","rugSquare__verde","rugRounded","rugRounded__amarillo","rugRounded__azul",
  "rugRounded__celeste","rugRounded__morado","rugRounded__naranja","rugRounded__rojo","rugRounded__rosa",
  "rugRounded__verde","rugRound__amarillo","rugRound__azul","rugRound__celeste","rugRound__morado",
  "rugRound__rosa","rugRound__verde","kitchenBlender","kitchenCabinet","kitchenCabinetCornerInner","table",
  "loungeSofaOttoman","loungeSofaLong","bathroomMirror","bathroomSink","bathroomCabinet","kitchenCabinetDrawer",
  "kitchenCabinetDrawer 1","kitchenCabinetCornerRound","tableCloth","tableCrossCloth","tableCoffee",
  "tableCoffeeSquare","tableCross","tableCoffeeGlass","tableCoffeeGlassSquare","tableGlass","tableRound",
  "televisionVintage","televisionAntenna","televisionModern","shower","bathtub","toilet",
  "kitchenCabinetUpperDouble","kitchenCabinetUpperCorner","kitchenCabinetUpper","kitchenCabinetUpperLow",
  "kitchenCoffeeMachine","kitchenStove","kitchenStoveElectric","kitchenFridgeSmall","washer","kitchenSink",
  "kitchenMicrowave","stoolBar","stoolBarSquare","kitchenFridge","kitchenFridgeBuiltIn","washerDryerStacked"
]);
function auditarSetsPorTarea() {
  const sets=rewards.SETS_POR_TAREA,usados=new Set(),ids=new Set(catalog.map(m=>m.id));
  for(const id of ENTREGADOS_29OCT)assert.ok(ids.has(id),'La base del 29-oct no se borra del catálogo: '+id);
  for(const guia of Object.keys(rewards.GUIAS_RECIENTES).filter(g=>Number(g)>24))
    assert.ok(Array.isArray(sets[guia])&&sets[guia].length,'La guía '+guia+' necesita su set nuevo de muebles en SETS_POR_TAREA.');
  for(const [guia,muebles] of Object.entries(sets)) {
    assert.ok(Number(guia)>24&&Array.isArray(muebles)&&muebles.length>0&&muebles.length<=12,'Set de la guía '+guia+': entre uno y doce muebles.');
    for(const id of muebles) {
      const mueble=catalog.find(m=>m.id===id);
      assert.ok(mueble&&Number(mueble.xp||0)>0,'El set de la guía '+guia+' usa un mueble regalable del catálogo: '+id);
      assert.ok(!ENTREGADOS_29OCT.has(id),'El set de la guía '+guia+' repite un mueble ya entregado el 29-oct: '+id);
      assert.ok(!usados.has(id),'Dos tareas comparten el mueble '+id);usados.add(id);
    }
  }
}
async function test() {
  auditarSetsPorTarea();
  assert.deepEqual(Object.keys(rewards.PREMIOS),['15','16','17','18','19','20','21']);
  assert.ok(rewards.fichas().every(item=>catalog.some(m=>m.id===item.mueble&&m.xp>0&&m.xp<9999&&m.motivo!=='Premio del profesor')));
  const fixture=createHouseFixture(),{db,state}=fixture;
  state.profiles.studentE={nombre:'Estudiante de prueba E',curso:'4B-HC',rut:'555555555'};
  state.datos.plataforma_estudiantes.avatar.studentD={regalos:{chairDesk:{tipo:'docente',de:'Docente de prueba',ts:1},playStation5:{tipo:'docente',de:'Docente de prueba',ts:1}}};
  const beforeAcademics=()=>JSON.stringify(state.datos.plataforma_paes);
  const academic=state.datos.plataforma_paes.guia_respuestas;
  academic[15]={'444444444':{status:'sent'}};
  academic[16]={'444444444':{status:'draft',submitted:true},'555555555':{status:'sent'}};
  academic[17]['444444444']={grade:{nota:1}};academic[17]['555555555']={status:'sent'};
  academic[18]={'444444444':{status:'draft',completada:true}};
  academic[19]={'444444444':{status:'sent',grade:{nota:1}}};
  academic[20]={};academic[21]={};
  const academicCopy=beforeAcademics(),customCopy=JSON.stringify(state.datos.plataforma_estudiantes.avatar.studentD.regalos.playStation5);
  assert.equal(await rewards.entregar(db,{uid:'studentD',premios:[{guia:'15',mueble:'chairDesk',yaTiene:false}]}),0,'Un premio recibido después de simular no cuenta como entrega nueva.');
  let writes=state.writes;
  const plan=await rewards.planCurso(db,'4B-HC');
  assert.equal(state.writes,writes,'Simular no entrega nada.');
  assert.equal(plan.pendientes,3);assert.equal(plan.destinatarios.length,2);
  assert.ok(plan.destinatarios.every(row=>!('rut' in row)));
  assert.equal(plan.destinatarios.find(row=>row.uid==='studentD').premios.length,2,'No premiar borradores ni una nota sin envío.');
  async function request(body,uid='teacherB',action='regalos-admin-paes-automaticos') {
    let result;const res={setHeader(){},status(status){this.code=status;return this;},json(data){result={status:this.code,data};}};
    await salas.manejar({method:'POST',headers:{authorization:'Bearer test-token'},body},res,action,db,{verifyIdToken:async()=>({uid})});return result;
  }
  assert.equal((await request({curso:'3B-HC'})).status,403);
  assert.equal((await request({curso:'4B-HC'},'studentD')).status,403);
  assert.equal((await request({curso:'4B-HC',confirmar:true,firma:'alterada'})).status,409);
  assert.equal(state.writes,writes);
  let response=await request({curso:'4B-HC',confirmar:true,firma:plan.firma});
  assert.equal(response.data.entregados,3);assert.equal(response.data.pendientes,0);assert.equal(response.data.errores,0);
  assert.equal(beforeAcademics(),academicCopy,'No tocar respuestas, intentos ni calificaciones.');
  assert.equal(JSON.stringify(state.datos.plataforma_estudiantes.avatar.studentD.regalos.playStation5),customCopy,'Conservar un regalo personalizado previo.');
  assert.equal(state.datos.plataforma_estudiantes.avatar.studentD.regalos.chairDesk.ts,1,'No reemplazar un premio ya obtenido.');
  writes=state.writes;const again=await rewards.planCurso(db,'4B-HC');
  response=await request({curso:'4B-HC',confirmar:true,firma:again.firma});
  assert.equal(response.data.entregados,0);assert.equal(state.writes,writes);
  assert.equal(await rewards.alEntregar(db,'444444444',16),0);
  academic[16]['444444444']={status:'sent'};
  assert.equal(await rewards.alEntregar(db,'444444444',16),1,'Entregar al confirmar la guía.');
  assert.equal(await rewards.sincronizarUid(db,'studentD'),0,'Reabrir Mi espacio recupera sin duplicar.');
  assert.equal(await rewards.alEntregar(db,'444444444',22),0);
  assert.equal(await rewards.sincronizarUid(db,'unknown'),0);
  response=await request({para:'studentE',mueble:'desk'},'studentD','regalar');
  assert.equal(response.data.ok,false,'No transferir el premio automático y recuperarlo infinitamente.');
  state.profiles.duplicate={...state.profiles.studentD};
  await assert.rejects(rewards.planCurso(db,'4B-HC'),/duplicados/);
  assert.equal(await rewards.sincronizarUid(db,'studentD'),0);
  state.profiles.duplicate.ocultarDeCasas=true;
  assert.equal((await rewards.planCurso(db,'4B-HC')).totalCurso,2);
  academic[21]={'555555555':{status:'sent'}};state.failUid='studentE';
  const failPlan=await rewards.planCurso(db,'4B-HC');
  response=await request({curso:'4B-HC',confirmar:true,firma:failPlan.firma});
  assert.equal(response.data.errores,1);assert.equal(response.data.pendientes,1);
  state.failUid=null;const retryPlan=await rewards.planCurso(db,'4B-HC');
  response=await request({curso:'4B-HC',confirmar:true,firma:retryPlan.firma});
  assert.equal(response.data.errores,0);assert.equal(response.data.entregados,1);assert.equal(response.data.pendientes,0);
  const page=fs.readFileSync(path.join(root,'paes/admin/index.html'),'utf8');
  for(const id of ['houseAutoReview','houseAutoGive','houseAutoConfirm','houseAutoRecipients'])assert.ok(page.includes('id="'+id+'"'));
  const api=fs.readFileSync(path.join(root,'api/paes.js'),'utf8');
  assert.ok(api.includes('if (!draft && PREMIOS_PAES.completada(guideId,saved))'));
  assert.ok(api.includes('await PREMIOS_PAES.alEntregar(db,rutLimpio,guideId)'));
  console.log('Premios PAES G15–21: kit básico, set nuevo por tarea desde el 29-oct, borradores excluidos, envío final, recuperación, simulación, permisos, relectura, reintento, duplicados y conservación de notas/premios manuales: OK.');
}
test().catch(error=>{console.error(error);process.exit(1);});
