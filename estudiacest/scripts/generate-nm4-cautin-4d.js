'use strict';
// Genera únicamente la guía de partes del cautín de 4°D desde su HTML imprimible.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),base='nm4/u3-clase7-manual-ilustrado';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'};
const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function main(){
 const server=http.createServer((req,res)=>{
  const target=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end();}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const evidence=fs.mkdtempSync(path.join(os.tmpdir(),'nm4-cautin-4d-'));
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1200}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('favicon.ico'))errors.push(`${response.status()} ${response.url()}`);});
  await page.goto(`http://127.0.0.1:${server.address().port}/${base}/guia-cautin-4d.html`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
  const screens=[];
  for(const width of [320,390,1440,3840]){
   await page.setViewportSize({width,height:1200});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)throw new Error(`Desborde horizontal en ${width}px.`);
   screens.push({width,overflow});
  }
  await page.setViewportSize({width:1440,height:1200});await page.emulateMedia({media:'print'});
  const geometry=await page.evaluate(()=>{
   const sheet=document.querySelector('.sheet'),rect=sheet.getBoundingClientRect(),footer=document.querySelector('.sheet-footer').getBoundingClientRect();
   return {height:rect.height,scrollHeight:sheet.scrollHeight,footerGap:rect.bottom-footer.bottom,blocks:[...sheet.children].map(el=>({tag:el.tagName,className:el.className,height:el.getBoundingClientRect().height,margin:getComputedStyle(el).margin})),names:[...document.querySelectorAll('.identity-name')].map(el=>el.getBoundingClientRect().height),lines:[...document.querySelectorAll('.answer-line')].map(el=>el.getBoundingClientRect().height),rows:document.querySelectorAll('.parts-table tbody tr').length,example:document.querySelector('.example-answer').textContent,logos:document.querySelectorAll('.school-letterhead img').length,contacts:document.querySelectorAll('.school-contact').length,images:[...document.images].every(img=>img.complete&&img.naturalWidth>0),course:document.querySelector('.identity-table').textContent.includes('4°D'),objective:document.querySelector('.objective p').textContent.startsWith('Explicar '),borders:[...document.querySelectorAll('.box,.diagram-box,.parts-table td')].every(el=>getComputedStyle(el).borderTopStyle==='solid')};
  });
  const mm=96/25.4;
  if(geometry.scrollHeight>geometry.height+2||geometry.footerGap<5*mm||geometry.names.length!==1||geometry.names.some(height=>height<8*mm-.2)||geometry.lines.length!==10||geometry.lines.some(height=>height<7*mm-.2)||geometry.rows!==6||geometry.logos!==2||geometry.contacts!==4||!geometry.images||!geometry.course||!geometry.objective||!geometry.borders)throw new Error(`Geometría incompleta: ${JSON.stringify(geometry)}`);
  const variants=[];let printable;
  for(const printBackground of [false,true]){
   const bytes=await page.pdf({preferCSSPageSize:true,displayHeaderFooter:false,printBackground,scale:1});
   const pdf=await PDFDocument.load(bytes),size=pdf.getPage(0).getSize();
   if(pdf.getPageCount()!==1||Math.abs(size.width-595.28)>1||Math.abs(size.height-841.89)>1)throw new Error('La guía debe ocupar una página A4.');
   variants.push({printBackground,pages:pdf.getPageCount(),size});
   if(!printBackground)printable=pdf;
  }
  if(errors.length)throw new Error(`Errores de navegador: ${JSON.stringify(errors)}`);
  printable.setTitle('El cautín y su estación · 4°D · CEST');printable.setAuthor('Centro Educativo Salesianos Talca · Francisco Núñez');printable.setSubject('Lengua y Literatura · NM4 · Manual de usuario');
  const bytes=await printable.save(),target=path.join(root,base,'assets/guia-cautin-4d.pdf');fs.writeFileSync(target,bytes);
  await page.screenshot({path:path.join(evidence,'html-impresion.png'),fullPage:true});
  const rendered=spawnSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','1600','-png',target,path.join(evidence,'pdf-impresion')],{windowsHide:true,maxBuffer:20*1024*1024});
  if(rendered.error||rendered.status!==0)throw new Error(`No se pudo renderizar el PDF: ${rendered.error?.message||rendered.stderr.toString()}`);
  const result={pdf:target,sha256:sha256(bytes),htmlSha256:sha256(fs.readFileSync(path.join(root,base,'guia-cautin-4d.html'))),bytes:bytes.length,geometry,screens,variants,errors,evidence};
  fs.writeFileSync(path.join(evidence,'resultado.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
