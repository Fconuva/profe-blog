'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {chromium}=require('playwright'),kit=require('../estudiantes/js/personaje-iso').KIT;
const root=path.join(__dirname,'..'),origin='https://www.estudiacest.com',sha=process.argv[2];
assert.match(sha,/^[a-f0-9]{40}$/);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){
 const files=[...kit.map(p=>p.url.slice(1)),'estudiantes/js/personaje-iso.js','estudiantes/js/mi-espacio.js','estudiantes/css/mi-espacio.css','paes/mi-espacio.html','estudiantes/dashboard.html','paes/admin/index.html'];
 let i=0;
 await Promise.all(Array.from({length:6},async()=>{while(i<files.length){const file=files[i++],url=file==='paes/admin/index.html'?'/paes/admin/':'/'+file;
  const res=await fetch(origin+url,{signal:AbortSignal.timeout(30000)});assert.equal(res.status,200,file);let actual=Buffer.from(await res.arrayBuffer()),expected=execFileSync('git',['show',sha+':estudiacest/'+file],{cwd:root,maxBuffer:5*1024*1024});
  if(/\.(js|css|html)$/.test(file)){actual=Buffer.from(actual.toString('utf8').replace(/\r\n/g,'\n'));expected=Buffer.from(expected.toString('utf8').replace(/\r\n/g,'\n'));}assert.equal(hash(actual),hash(expected),file);
 }}));
 for(const action of ['salas-entrar','salas-latido','salas-inventario']){
  const r=await fetch(origin+'/api/estudiantes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})});assert.equal(r.status,401);
 }
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/paes/admin/#casas');assert.equal(await page.locator('#teacherXpPanel').count(),1);
  assert.equal(await page.evaluate(()=>AvatarLookSystem.KIT.length),50);assert.equal(await page.evaluate(()=>AvatarLookSystem.GESTOS.length),10);
  // Probar el render publicado, sin autenticar ni leer/escribir alumnos reales.
  await page.evaluate(()=>{const c=document.createElement('div');c.id='avatarPublicQA';c.style='position:fixed;right:12px;bottom:12px;background:#223049;padding:12px';document.body.appendChild(c);AvatarLookSystem.render(c,{look:AvatarLookSystem.getDefaultLook(),size:170,xpTotal:0});});
  assert.equal(await page.locator('#avatarPublicQA canvas').count(),1);
  for(const width of [390,1200,3840]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
 console.log(JSON.stringify({commit:sha,recursosPublicosSHA256:files.length,kit:50,gestos:10,apiSinSesion:401,renderPublicado:true,desbordes:0,errores:0}));
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
