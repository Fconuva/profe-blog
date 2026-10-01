'use strict';
// Navegador real contra las funciones actuales: sin estudiantes ni datos reales.
const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('playwright');
const {start,state,db}=require('./preview-paes-avatar-prizes');
const levels=require('../estudiantes/js/avatar-levels');
const root=path.join(__dirname,'..');
(async()=>{
 const academic=JSON.stringify(state.datos.plataforma_paes),av=state.datos.plataforma_estudiantes.avatar.studentA;
 av.xp_total=175;av.casa={tamano:'9x9',muro:'blanco',piso:'claro'};
 const server=await start(),browser=await chromium.launch({headless:true}),base='http://127.0.0.1:'+server.address().port;
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+new URL(r.url()).pathname);});
  await page.goto(base+'/preview-admin');await page.locator('#houseStudent').selectOption('studentA');
  await page.locator('#teacherXpPanel summary').click();await page.locator('#teacherXpCurrent').filter({hasText:'175 XP'}).waitFor();
  await page.locator('#teacherXpAmount').fill('125');await page.locator('#teacherXpReason').fill('Trabajo revisado en clase');await page.locator('#teacherXpReview').click();
  await page.locator('#teacherXpChosen').filter({hasText:'175 → 300'}).waitFor();assert.equal(levels.totalXP(av),175);
  await page.locator('#teacherXpGive').evaluate(b=>{b.click();b.click();});await page.locator('#teacherXpStatus').filter({hasText:'300 XP'}).waitFor();
  assert.equal(levels.totalXP(state.datos.plataforma_estudiantes.avatar.studentA),300);assert.equal(Object.keys(state.datos.plataforma_estudiantes.avatar.studentA.regalos).filter(k=>k.startsWith('xp__')).length,1);
  await page.locator('#teacherXpType').selectOption('nivel');await page.locator('#teacherXpAmount').fill('20');await page.locator('#teacherXpReview').click();await page.locator('#teacherXpConfirm').waitFor();await page.locator('#teacherXpGive').click();await page.locator('#teacherXpStatus').filter({hasText:'nivel 20'}).waitFor();
  await page.locator('#houseSet').selectOption('walls');await page.locator('#houseReview').click();await page.locator('#houseChosen').filter({hasText:'6 muebles'}).waitFor();await page.locator('#houseGive').click();await page.locator('#houseStatus').filter({hasText:'Entrega confirmada'}).waitFor();
  await page.locator('#houseMode').selectOption('course');await page.locator('#houseCourse').selectOption('3B-HC');await page.locator('#houseGuide').selectOption('17');
  await page.locator('#houseSummary').filter({hasText:'2 destinatario'}).waitFor();await page.locator('#houseSet').selectOption('terrace');await page.locator('#houseReview').click();await page.locator('#houseChosen').filter({hasText:'12 muebles'}).waitFor();await page.locator('#houseGive').click();await page.locator('#houseStatus').filter({hasText:'Entrega confirmada'}).waitFor();
  const avatar=state.datos.plataforma_estudiantes.avatar;assert.ok(avatar.studentA.regalos.terracePoolLarge);assert.ok(avatar.studentB.regalos.terracePoolLarge);assert.equal(avatar.studentC?.regalos?.terracePoolLarge,undefined);
  await page.locator('#houseMode').selectOption('student');await page.locator('#houseStudent').selectOption('studentA');await page.locator('#houseSearch').fill('piscina');await page.locator('#houseCatalog .house-item img').first().click();await page.locator('#housePreviewImage').waitFor();
  for(const width of [390,1200,3840]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:path.join(root,'../scratch/terraza-admin-'+width+'.png')});}
  await page.reload();await page.locator('#houseStudent').selectOption('studentA');await page.locator('#teacherXpPanel summary').click();await page.locator('#teacherXpCurrent').filter({hasText:'Nivel 20'}).waitFor();
  await page.goto(base+'/preview-student');await page.locator('[data-p="pieza"]').click();
  const saveHouse=async(type,id)=>{await page.locator('#espTerreno [data-t="'+type+'"]').click();await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/estudiantes')&&r.request().postDataJSON()?.action==='salas-guardar-casa'),page.locator('#espPaleta [data-id="'+id+'"]').click()]);};
  await saveHouse('muro','piedra');await saveHouse('piso','pasto');await page.reload();await page.locator('[data-p="pieza"]').click();assert.equal(avatar.studentA.casa.muro,'piedra');assert.equal(avatar.studentA.casa.piso,'pasto');
  // Piezas colocadas por la API real, no por una escritura cliente que eluda las reglas.
  const piece=[['terracePoolSmall',0,0],['terracePoolMedium',2,0],['terracePoolLarge',5,0],['terraceWaterfall',0,3],['terraceGrass',1,3],['terraceLounger',4,3],['terraceRockingChair',6,4],['terraceTable',4,6],['terraceParasol',6,6],['terracePalm',0,6],['terraceOak',2,6],['terracePine',8,5]].map(([id,col,fila])=>({id,col,fila,dir:'SE'}));
  const response=await page.request.post(base+'/api/estudiantes',{headers:{Authorization:'Bearer studentA'},data:{action:'salas-guardar-pieza',pieza:piece}});assert.equal(response.status(),200);assert.deepEqual(avatar.studentA.pieza,piece.map(m=>({...m,sobre:false,encendido:false})));
  await page.reload();await page.locator('[data-p="pieza"]').click();await page.locator('#espLienzo').waitFor();await page.waitForTimeout(600);
  const before=await page.locator('#espLienzo').evaluate(c=>c.toDataURL());await page.waitForTimeout(300);const after=await page.locator('#espLienzo').evaluate(c=>c.toDataURL());assert.notEqual(before,after,'Agua y cascada animadas.');
  await page.locator('#espTerreno [data-t="tamano"]').click();await page.locator('#espPaleta [data-id="5x5"]').click();await page.locator('.esp-aviso').filter({hasText:'quedarían fuera'}).waitFor();assert.equal(avatar.studentA.casa.tamano,'9x9');await page.locator('#espCerrarPal').click();
  await saveHouse('muro','terraza');
  for(const width of [390,1200,3840]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('.esp-escena').screenshot({path:path.join(root,'../scratch/terraza-casa-'+width+'.png')});}
  await page.locator('#espDecorar').click();for(let i=0;i<6;i++)await page.locator('#espSig').click();await page.locator('#espUsar').click();await page.waitForTimeout(3000);await page.locator('.esp-escena').screenshot({path:path.join(root,'../scratch/terraza-tumbona.png')});
  for(let i=0;i<7;i++)await page.locator('#espSig').click();await page.locator('#espUsar').click();await page.waitForTimeout(3000);await page.locator('.esp-escena').screenshot({path:path.join(root,'../scratch/terraza-mecedora.png')});
  // Visita: mismas paredes/agua, sin controles de edición ajena.
  avatar.studentB.casa={...avatar.studentA.casa};avatar.studentB.pieza=avatar.studentA.pieza;
  await page.locator('#espVisitar').click();await page.locator('#espVisitas [data-uid="studentB"]').click();await page.locator('#espVolver').waitFor();assert.equal(await page.locator('#espTerreno').isVisible(),false);assert.equal(await page.locator('#espMueblesBloque').isVisible(),false);await page.locator('.esp-escena').screenshot({path:path.join(root,'../scratch/terraza-visita.png')});
  await page.locator('#espVolver').click();await page.locator('#espTerreno').waitFor();
  assert.equal(JSON.stringify(state.datos.plataforma_paes),academic);assert.deepEqual(errors,[]);
  console.log('Terraza/XP en navegador: vista previa, doble clic sin duplicado, nivel 20, set de 6 muros a uno, 12 piezas por curso+tarea solo a entregados, recarga, piso/muros por API, piscinas y agua animada, reducción bloqueada, 390/1200/3840 sin errores. Datos ficticios.');
 }finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.stack);process.exitCode=1;});
