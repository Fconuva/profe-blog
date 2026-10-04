'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium}=require('playwright');const {PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),prefix='/nm4/u3-clase7-manual-ilustrado/';
const output=fs.mkdtempSync(path.join(os.tmpdir(),'nm4-manual-qa-'));
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
let server;const requested=process.argv.find(x=>x.startsWith('--origin='));
async function main(){
 let origin=requested?.slice(9);
 if(!origin){server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let target=path.resolve(root,'.'+pathname);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);return res.end();}if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');if(!fs.existsSync(target)){res.writeHead(404);return res.end();}res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(res);});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin=`http://127.0.0.1:${server.address().port}`;}
 const browser=await chromium.launch({headless:true});const failures=[];let checks=0;
 try{
  for(const width of [320,390,1440,3840]){
   const page=await browser.newPage({viewport:{width,height:width===3840?2160:width===1440?900:844},acceptDownloads:true});const errors=[];
   page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.url().startsWith(origin)&&response.status()>=400)errors.push(`HTTP ${response.status()} ${new URL(response.url()).pathname}`);});
   for(const course of ['4C','4E']){
    await page.goto(`${origin}${prefix}?curso=${course}`,{waitUntil:'networkidle'});
    if(await page.locator('#course').inputValue()!==course)throw new Error('Curso inicial incorrecto');
    for(let slide=0;slide<8;slide++){
     await page.locator('.slide.active').waitFor();
     const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.querySelectorAll('.slide.active img')].every(img=>img.complete&&img.naturalWidth>0),counter:document.querySelector('#counter').textContent}));
     if(layout.overflow||!layout.images||layout.counter!==`${slide+1} / 8`)failures.push(`${width}/${course}/pantalla ${slide+1}: ${JSON.stringify(layout)}`);
     if(slide===0&&[390,1440,3840].includes(width))await page.screenshot({path:path.join(output,`${course}-${width}.png`),fullPage:true});
     if(slide<7)await page.getByRole('button',{name:'Diapositiva siguiente'}).click();checks++;
    }
    await page.reload({waitUntil:'networkidle'});if(await page.locator('#counter').textContent()!=='8 / 8')failures.push('No persiste la pantalla al recargar.');
    const other=course==='4C'?'4E':'4C';await page.locator('#course').selectOption(other);
    if(!page.url().includes(`curso=${other}`)||await page.locator('#counter').textContent()!=='8 / 8')failures.push('El cambio de curso perdió la pantalla.');
    for(const doc of ['lectura.html','plantilla.html','modelo.html','docente.html','proyecto.html','manual-final.html']){
     await page.goto(`${origin}${prefix}${doc}?curso=${course}`,{waitUntil:'networkidle'});
     const healthy=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1&&[...document.images].every(img=>img.complete&&img.naturalWidth>0));
     if(!healthy)failures.push(`${width}/${course}/${doc}: desborde o imagen rota`);checks++;
     if(width===1440&&['plantilla.html','modelo.html','manual-final.html'].includes(doc)){
      await page.emulateMedia({media:'print'});
      const pdf=await page.pdf({preferCSSPageSize:true,printBackground:true});fs.writeFileSync(path.join(output,`${course}-${doc.replace('.html','.pdf')}`),pdf);
      const expectedPages=doc==='manual-final.html'?6:2;
      if((await PDFDocument.load(pdf)).getPageCount()!==expectedPages)failures.push(`${course}/${doc}: impresión distinta de ${expectedPages} páginas`);
      const cuts=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(el=>({overflow:el.scrollHeight>el.clientHeight+2,scroll:el.scrollHeight,height:el.clientHeight})));if(cuts.some(x=>x.overflow))failures.push(`${course}/${doc}: contenido cortado ${JSON.stringify(cuts)}`);
      await page.emulateMedia({media:'screen'});
      await page.screenshot({path:path.join(output,`${course}-${doc.replace('.html','.png')}`),fullPage:true});
     }
    }
    await page.goto(`${origin}${prefix}lectura.html?curso=${course}`,{waitUntil:'networkidle'});const downloadPromise=page.waitForEvent('download');await page.getByRole('link',{name:'Descargar plano',exact:true}).click();const download=await downloadPromise;
    const expectedFile=course==='4C'?'plano-multimetro.svg':'plano-estacion.svg';
    if(![`${course}-diagram.svg`,expectedFile].includes(download.suggestedFilename()))failures.push('El nombre de la descarga no corresponde al curso');
    if(await download.failure())failures.push('Falló la descarga del plano');
    else if(!fs.readFileSync(await download.path()).equals(fs.readFileSync(path.join(root,'nm4/u3-clase7-manual-ilustrado/assets',expectedFile))))failures.push('El contenido del plano descargado no corresponde al curso');checks++;
   }
   if(errors.length)failures.push(...errors);await page.close();
  }
  const page=await browser.newPage();await page.goto(`${origin}/nm4/`,{waitUntil:'networkidle'});for(const course of ['4C','4E'])if(await page.locator(`a[href="${prefix}?curso=${course}"]`).count()!==1)failures.push(`Portada: acceso ausente ${course}`);await page.close();
 }finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
 console.log(JSON.stringify({origin,checks,output,failures},null,2));if(failures.length)process.exitCode=1;
}
main().catch(error=>{console.error(error);if(server)server.close();process.exitCode=1;});
