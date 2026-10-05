'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');const os=require('node:os');
const {chromium}=require('playwright');const root=path.resolve(__dirname,'..');
(async()=>{
 const server=http.createServer((req,res)=>{const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'');let file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end();return}const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png'}[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':mime});fs.createReadStream(file).pipe(res)});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;const out=fs.mkdtempSync(path.join(os.tmpdir(),'anuario-avance-qa-'));let browser;
 try{browser=await chromium.launch({headless:true});for(const viewport of [{width:1440,height:900},{width:390,height:844}]){const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${port}/4dtp/avance-anuario/`);await page.waitForLoadState('networkidle');assert.equal(await page.locator('.slide:not([hidden])').count(),1);
  const days=await page.evaluate(()=>['2026-10-05T15:00:00Z','2026-10-06T15:00:00Z','2026-10-26T15:00:00Z','2026-10-27T15:00:00Z'].map(d=>window.anuarioDaysRemaining(new Date(d))));assert.deepEqual(days,[21,20,0,-1]);
  for(let i=0;i<9;i++){assert.equal(await page.locator('#counter').textContent(),`${i+1} / 9`);assert.equal(await page.locator('.slide:not([hidden])').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,`Desborde ${viewport.width}, diapositiva ${i+1}`);if([0,3,4,5,8].includes(i))await page.screenshot({path:path.join(out,`${viewport.width}-${i+1}.png`),fullPage:true});if(i<8)await page.locator('#next').click()}
  assert.equal(await page.locator('#next').isDisabled(),true);await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#counter').textContent(),'8 / 9');assert.deepEqual(errors,[]);await page.close()}
  console.log(JSON.stringify({passed:true,slides:9,viewports:[1440,390],countdown:[21,20,0,-1],screenshots:out}));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
