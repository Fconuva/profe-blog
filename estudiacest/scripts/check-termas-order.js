'use strict';
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
async function main(){
  let server;
  let origin=process.env.TERMAS_CHECK_ORIGIN;
  if(!origin){server=http.createServer((req,res)=>{const file=path.join(root,'termas/admin.html');res.setHeader('Content-Type','text/html');res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));origin=`http://127.0.0.1:${server.address().port}`;}
  const browser=await chromium.launch({headless:true});
  try{
    for(const width of [390,1440,3840]){
      const page=await browser.newPage({viewport:{width,height:900}});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.route('**/firebase*-compat.js',r=>r.fulfill({contentType:'text/javascript',body:"window.firebase={initializeApp(){},auth:Object.assign(()=>({currentUser:{getIdToken:async()=>'ficticio'},setPersistence(){},onAuthStateChanged(cb){setTimeout(()=>cb({uid:'ficticio'}),0)}}),{Auth:{Persistence:{LOCAL:'local'}}})};"}));
      const filas=[{nombre:'Tercera',apellido:'A',correo:'3@example.test',creado:300},{nombre:'Primera',apellido:'Z',correo:'1@example.test',creado:100,actualizado:900},{nombre:'Segunda',apellido:'B',correo:'2@example.test',creado:200},{nombre:'Sin fecha',apellido:'C',correo:'4@example.test',creado:null}].map(f=>({...f,asiste:'si',transporte:'personal',comida:'ninguna'}));
      await page.route('**/api/estudiantes?*',r=>{assert.equal(r.request().method(),'GET','La prueba no autoriza escrituras');return r.fulfill({json:{ok:true,filas,eliminadas:[],totales:{asisten:4,noAsisten:0,bus:0,personal:4},capacidad:40}});});
      await page.goto(origin+'/termas/admin',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>document.querySelectorAll('#filas tr').length===4);
      const nombres=()=>page.locator('#filas td:first-child strong').allTextContents();
      assert.deepEqual(await nombres(),['Primera Z','Segunda B','Tercera A','Sin fecha C']);
      await page.selectOption('#orden','ultimo');assert.deepEqual(await nombres(),['Tercera A','Segunda B','Primera Z','Sin fecha C']);
      await page.selectOption('#orden','nombre');assert.deepEqual(await nombres(),['Tercera A','Segunda B','Sin fecha C','Primera Z']);
      await page.selectOption('#orden','primero');await page.fill('#buscar','Segunda');assert.deepEqual(await nombres(),['Segunda B']);
      await page.fill('#buscar','');await page.selectOption('#filtro','bus');assert.equal(await page.locator('#filas').innerText(),'No hay inscripciones que coincidan.');
      await page.selectOption('#filtro','');assert.deepEqual(await nombres(),['Primera Z','Segunda B','Tercera A','Sin fecha C']);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      assert.deepEqual(errors,[]);console.log(`${width}px: orden ascendente/descendente/A–Z, búsqueda, filtros y fechas sin errores ni escrituras (datos ficticios).`);
      await page.close();
    }
  }finally{await browser.close();if(server)server.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
