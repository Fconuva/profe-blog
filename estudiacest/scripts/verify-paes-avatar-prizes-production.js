'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const {getAccessToken,requestJson}=require('./firebase-maintenance-db');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),origin='https://www.estudiacest.com';
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const commitIndex=process.argv.indexOf('--commit'),commit=commitIndex>=0?process.argv[commitIndex+1]:'';
if(commit && !/^[a-f0-9]{40}$/i.test(commit))throw Error('Commit de comparación no válido.');
const expected=file=>commit?execFileSync('git',['show',commit+':estudiacest/'+file],{cwd:root,maxBuffer:20*1024*1024}):fs.readFileSync(path.join(root,file));
// Git guarda texto normalizado aunque el archivo subido desde Windows tenga CRLF.
// Comparación de commit: normalizar solo esos saltos; binarios siempre byte a byte.
const sourceDigest=(file,value)=>digest(commit && /\.(html|js|css|json)$/.test(file)?Buffer.from(value.toString('utf8').replace(/\r\n/g,'\n')):value);
(async()=>{
  const objects=['gymBench','gymDumbbells','gymTreadmill','gymBike','christmasTree','halloweenPumpkin','halloweenCauldron','halloweenGhost','halloweenScarecrow','halloweenCandy','halloweenLantern',...require('./furniture-terrace/assets.json').map(m=>m.id),'wallStone','wallWood','wallBrick','wallGarden','wallBlueTile','wallTerraceFence','floorFull__pasto'];
  const files=['paes/admin/index.html','paes/admin/casas.js','paes/admin/premios.js','paes/admin/experiencia.js','estudiantes/js/avatar-levels.js','estudiantes/js/personaje-iso.js','estudiantes/js/mi-espacio.js','estudiantes/css/mi-espacio.css','estudiantes/js/catalogo-casa.js','estudiantes/js/mapas-casa.js','estudiantes/logros.html','estudiantes/dashboard.html','paes/mi-espacio.html',...['ranking','arena','arena-gato','dashboard-FranciscoJavier','dashboard-FranciscoJavier-2','logros-FranciscoJavier','ranking-FranciscoJavier'].map(n=>'estudiantes/'+n+'.html'),'estudiantes/adminprofe/index.html',...['salon-9x7','salon-9x9','salon-11x11','salon-l-9x9'].map(n=>'estudiantes/assets/mapas/'+n+'.json'),...objects.flatMap(id=>['SE','SW','NE','NW'].map(dir=>'estudiantes/assets/pieza/'+id+'_'+dir+'.png'))];
  let next=0;
  await Promise.all(Array.from({length:6},async()=>{while(next<files.length){const file=files[next++],url=file==='paes/admin/index.html'?'/paes/admin/':file==='estudiantes/dashboard.html'?'/estudiantes/dashboard.html':'/'+file;const response=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});assert.equal(response.status,200,file);assert.equal(sourceDigest(file,Buffer.from(await response.arrayBuffer())),sourceDigest(file,expected(file)),file);}}));
  for(const action of ['salas-regalos-admin-avatar','salas-regalos-admin-paes-automaticos','salas-inventario','salas-experiencia-admin','salas-guardar-casa']){
    const response=await fetch(origin+'/api/estudiantes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})});assert.equal(response.status,401,'Endpoint debe exigir sesión y cargar sin error: '+action);
  }
  const rules=await requestJson('GET','.settings/rules',getAccessToken());
  for(const campo of ['regalos','pieza','casa'])assert.ok(rules.rules.plataforma_estudiantes.avatar.$uid.$campo['.write'].includes("$campo !== '"+campo+"'"),'Protección no desplegada: '+campo);
  assert.equal((await fetch(origin+'/nm3/u3-clase4-noticias-falsas/')).status,200,'Conservar la clase NM3 concurrente.');
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/paes/admin/#casas');
    assert.equal(await page.locator('#avatarPrizeCatalog').count(),1);
    assert.equal(await page.locator('#teacherXpPanel').count(),1);
    assert.equal(await page.locator('#houseSet option[value="terrace"]').count(),1);
    assert.equal(await page.locator('#houseSet option[value="walls"]').count(),1);
    for(const width of [390,1200,3840]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
  console.log(JSON.stringify({publicacionConfirmada:true,commitComparado:commit||'fuente-local',recursosHashIgual:files.length,apiSinSesion:'401',regalosProtegidos:true,nm3Conservado:true,navegadorSinDesbordes:true}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
