const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1200,height:1000}});
  await page.goto('http://127.0.0.1:8874/nm3/mi-dia-en-imagenes/guia.html');
  await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
  await page.locator('img').evaluateAll(xs=>Promise.all(xs.map(x=>x.decode())));
  const geometry=await page.locator('.sheet').evaluateAll(xs=>xs.map(x=>{
   const footer=x.querySelector('.footer').getBoundingClientRect();
   const children=[...x.children].filter(c=>!c.classList.contains('footer'));
   const end=Math.max(...children.map(c=>c.getBoundingClientRect().bottom));
   return {page:x.dataset.page,bottom:end,footer:footer.top,overlap:end>footer.top-5};
  }));
  fs.mkdirSync('test-results/mi-dia',{recursive:true});
  fs.writeFileSync('test-results/mi-dia/geometria.json',JSON.stringify(geometry,null,2));
  if(geometry.some(x=>x.overlap))throw Error('Contenido invade pie: '+JSON.stringify(geometry.filter(x=>x.overlap)));
  await page.pdf({path:'nm3/mi-dia-en-imagenes/assets/guia-mi-dia-nm3.pdf',preferCSSPageSize:true,printBackground:false,displayHeaderFooter:false});
  console.log('PDF generado; '+geometry.length+' páginas sin invasión del pie.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
