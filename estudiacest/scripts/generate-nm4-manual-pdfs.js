'use strict';
// Genera los archivos imprimibles desde las mismas guías HTML, sin datos personales.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib');
const root=path.resolve(__dirname,'..'),base='nm4/u3-clase7-manual-ilustrado';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf'};
async function main(){
 const server=http.createServer((req,res)=>{
  const target=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end();}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;const generated=[];
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  for(const course of ['4A','4B','4C','4E'])for(const [kind,file,pages] of [['borrador','plantilla.html',3],['final','manual-final.html',6]]){
   await page.goto(`http://127.0.0.1:${server.address().port}/${base}/${file}?curso=${course}`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);await page.emulateMedia({media:'print'});
   const geometry=await page.evaluate(()=>({cuts:[...document.querySelectorAll('.sheet')].map(el=>({height:el.clientHeight,scroll:el.scrollHeight,footerGap:el.getBoundingClientRect().bottom-el.querySelector('.sheet-footer').getBoundingClientRect().bottom})),headers:document.querySelectorAll('.school-letterhead').length,contacts:[...document.querySelectorAll('.school-letterhead')].every(el=>el.querySelectorAll('.school-contact').length===4&&el.textContent.includes('cest@salesianostalca.cl')),footers:[...document.querySelectorAll('.sheet')].every(el=>{const footer=el.querySelector('.sheet-footer');return !!footer?.querySelector('.school-motto')&&footer.getBoundingClientRect().bottom<=el.getBoundingClientRect().bottom-parseFloat(getComputedStyle(el).paddingBottom)+2;}),images:[...document.images].every(img=>img.complete&&img.naturalWidth>0),rulers:[...document.querySelectorAll('.answer-lines>span')].every(el=>el.getBoundingClientRect().height>=26&&getComputedStyle(el).borderBottomStyle==='solid')}));
   if(geometry.headers!==pages||!geometry.contacts||!geometry.footers||!geometry.images||!geometry.rulers||geometry.cuts.some(el=>el.scroll>el.height+2))throw new Error(`${course}/${kind}: geometría inválida ${JSON.stringify(geometry)}`);
   const pdf=await PDFDocument.load(await page.pdf({preferCSSPageSize:true,printBackground:false,displayHeaderFooter:false,scale:1}));
   if(pdf.getPageCount()!==pages)throw new Error(`${course}/${kind}: ${pdf.getPageCount()} páginas, se esperaban ${pages}`);
   pdf.setTitle(`Guía ${kind==='final'?'final':'del borrador'} del manual ilustrado · ${course} · CEST`);pdf.setAuthor('Centro Educativo Salesianos Talca · Francisco Núñez');pdf.setSubject('Lengua y Literatura · NM4 · Manual ilustrado');
   const target=path.join(root,base,'assets',`guia-${course.toLowerCase()}-${kind}.pdf`);const bytes=await pdf.save();fs.writeFileSync(target,bytes);
   generated.push({course,kind,pages,bytes:bytes.length});await page.emulateMedia({media:'screen'});
  }
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
 console.log(JSON.stringify({generated},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
