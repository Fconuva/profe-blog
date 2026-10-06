'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright'),{PDFDocument}=require('pdf-lib'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),base='nm3/u3-clase5-verificar-caso',publicMode=process.argv.includes('--public');
const evidence=fs.mkdtempSync(path.join(os.tmpdir(),'nm3-verificar-qa-'));
let server,browser;let checks=0;const check=(ok,message)=>{assert.ok(ok,message);checks++};
async function main(){
 const html=fs.readFileSync(path.join(root,base,'guia.html'),'utf8'),slide=fs.readFileSync(path.join(root,base,'index.html'),'utf8');
 check(html.includes('Publicación recreada')&&html.includes('Conversación recreada'),'Publicaciones distinguidas de evidencia');
 check(!/generada con IA|no es evidencia|no representa un boletín/.test(html+slide),'Leyendas retiradas');
 check(['instagram','whatsapp','xpost'].every(c=>html.includes('social '+c)),'Tres formatos sociales');
 check(html.includes('Reenviado muchas veces')&&html.includes('1.248 Me gusta')&&html.includes('8.400 visualizaciones'),'Recursos del formato visibles');
 check(html.includes('Francisco Javier Núñez Valenzuela'),'Nombre institucional completo');
 check(!html.includes('S2.')&&!html.includes('class="summary"')&&!html.includes('Tabla de contraste'),'Sin tablas de contraste');
 check(!/Qué entregan|Cómo verificar un mensaje|Tres pistas para verificar|El formato también comunica|Ejemplo resuelto|Lean el ejemplo/i.test(html+slide),'Bloques y referencias retirados');
 check(html.includes('Sin celular'),'Trabajo sin celular');
 check(!/firebase|textarea|contenteditable/i.test(html+slide),'Sin respuestas digitales ni escritura de datos');
 check((html.match(/class="sheet"/g)||[]).length===10,'Diez páginas');
 check((slide.match(/class="slide"/g)||[]).length===1,'Una diapositiva');
 check(html.includes('22 de enero de 2017')&&html.includes('23 de enero de 2017')&&html.includes('14 de mayo de 2025'),'Tres fechas NASA separadas');
 check(html.includes('08:50 del 31 de julio')&&html.includes('30 de julio de 2025'),'Fecha del caso contrastable');
 check(html.includes('sábado 26 o el domingo 27 de octubre')&&html.includes('siempre sábado y domingo'),'Alcance del caso electoral');
 for(const f of ['estudiantes-verificando-gris.webp','verificar-documentos-gris.webp','incendios-chile-2017-gris.jpg']){const {data,info}=await sharp(path.join(root,base,'assets',f)).raw().toBuffer({resolveWithObject:true});let chroma=0;for(let i=0;i<data.length;i+=info.channels){if(info.channels>=3)chroma=Math.max(chroma,Math.abs(data[i]-data[i+1]),Math.abs(data[i]-data[i+2]));}check(chroma<=2,`${f}: escala de grises`);}
 if(!publicMode){server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});await new Promise(r=>server.listen(0,'127.0.0.1',r));}
 const origin=publicMode?'https://www.estudiacest.com':`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true});const errors=[];
 for(const width of [320,390,1440,3840]){const page=await browser.newPage({viewport:{width,height:width>=2200?2160:width>=1000?900:844}});page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status())});
  for(const file of ['','guia.html']){await page.goto(`${origin}/${base}/${file}`,{waitUntil:'networkidle'});await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.images].every(i=>i.naturalWidth>0),pages:document.querySelectorAll('.sheet').length,slide:document.querySelectorAll('.slide').length,forms:document.querySelectorAll('textarea,input,form').length}));check(!layout.overflow,`${file} ${width}: ancho`);check(layout.images,`${file} ${width}: imágenes`);check(layout.forms===0,`${file} ${width}: trabajo en papel`);check(file?layout.pages===10:layout.slide===1,`${file} ${width}: estructura`);
   await page.screenshot({path:path.join(evidence,`${file?'guia':'diapositiva'}-${width}.png`),fullPage:file?false:true});
   if(!file){const pdfHref=await page.locator('a[download]').getAttribute('href');const response=await page.request.get(`${origin}/${base}/${pdfHref}`);check(response.ok(),`PDF ${width}: descarga`);const data=await response.body();check(crypto.createHash('sha256').update(data).digest('hex')===crypto.createHash('sha256').update(fs.readFileSync(path.join(root,base,'assets/guia-verificar-caso-nm3.pdf'))).digest('hex'),`PDF ${width}: bytes exactos`);}
  }
  await page.evaluate(()=>document.fonts.ready);check(await page.evaluate(()=>document.fonts.check('16px "Times New Roman"')),`Times New Roman disponible ${width}`);await page.emulateMedia({media:'print'});
  const typography=await page.evaluate(()=>({body:[...document.querySelectorAll('.sheet p,.sheet li,.sheet td,.sheet th,.sheet figcaption')].every(x=>getComputedStyle(x).fontFamily.startsWith('"Times New Roman"')&&Math.abs(parseFloat(getComputedStyle(x).fontSize)-16)<.02),titles:[...document.querySelectorAll('.sheet h1,.sheet h2')].every(x=>getComputedStyle(x).fontFamily.startsWith('"Times New Roman"')&&Math.abs(parseFloat(getComputedStyle(x).fontSize)-18.6667)<.02),labels:[...document.querySelectorAll('.sheet .info-table .label')].every(x=>x.scrollWidth<=x.clientWidth+1)}));
  check(typography.body&&typography.titles&&typography.labels,`Times New Roman 12 pt, títulos 14 pt y ficha sin cortes ${width}`);
  const satellites=await page.locator('.post-photo,.archive-image .case-image').evaluateAll(images=>images.map(i=>({width:i.getBoundingClientRect().width*25.4/96,height:i.getBoundingClientRect().height*25.4/96,ratio:i.getBoundingClientRect().width/i.getBoundingClientRect().height,naturalRatio:i.naturalWidth/i.naturalHeight,fit:getComputedStyle(i).objectFit})));
  check(satellites.length===2&&satellites.every(i=>i.width>=175&&i.height>=85&&Math.abs(i.ratio-i.naturalRatio)<.04&&i.fit==='contain'),`Imágenes completas y grandes ${width}: ${JSON.stringify(satellites)}`);
  const geometry=await page.evaluate(()=>[...document.querySelectorAll('.sheet')].map(s=>({id:s.dataset.page,overflow:s.scrollHeight>s.clientHeight+1,footer:s.querySelector('.footer').getBoundingClientRect().bottom<=s.getBoundingClientRect().bottom,lines:[...s.querySelectorAll('.answer-lines span')].every(x=>x.getBoundingClientRect().height>=30.2),logos:s.querySelectorAll('.membrete-banner img').length===2,identity:s.dataset.page==='1'?s.querySelectorAll('.info-table tr').length===6&&[...s.querySelectorAll('.write-in')].every(x=>x.getBoundingClientRect().height>=30.2):!!s.querySelector('.continuation')})));
  for(const g of geometry){check(!g.overflow&&g.footer,`Hoja ${g.id} ${width}: no cortes`);check(g.lines&&g.logos&&g.identity,`Hoja ${g.id} ${width}: renglones, logos e identificación`);}
  for(const backgrounds of [false,true]){const pdf=await page.pdf({format:'A4',preferCSSPageSize:true,printBackground:backgrounds});const doc=await PDFDocument.load(pdf);check(doc.getPageCount()===10,`Impresión ${width} fondos=${backgrounds}: diez páginas`);check(doc.getPages().every(p=>Math.abs(p.getWidth()-595.28)<1&&Math.abs(p.getHeight()-841.89)<1),'A4');}
  await page.close();
 }
 const p=await browser.newPage();await p.goto(`${origin}/nm3/`,{waitUntil:'networkidle'});check(await p.locator('a[href="/nm3/u3-clase5-verificar-caso/"]').count()===1,'Acceso en portada');check((await p.locator('.u3-card').filter({hasText:'Verificar un caso real'}).innerText()).includes('Viernes 9 de octubre'),'Fecha portada');
 const previous=fs.readFileSync(path.join(root,base,'assets/portada-enlaces-anteriores.json'),'utf8');const old=JSON.parse(previous);const now=await p.locator('a[href]').evaluateAll(a=>a.map(x=>x.getAttribute('href')));check(old.every(href=>now.includes(href)),'Todos los destinos previos conservados');await p.close();
 check(errors.length===0,'Sin errores JavaScript ni HTTP: '+errors.join('\n'));fs.writeFileSync(path.join(evidence,'resultado.json'),JSON.stringify({origin,checks,errors,passed:true},null,2));console.log(JSON.stringify({origin,checks,errors,evidence,passed:true}));
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));});
