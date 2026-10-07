const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../../..');
const regular=fs.readFileSync(path.join(root,'paes/cartas/index.html'),'utf8');fs.writeFileSync(path.join(root,'paes/cartas/guiada.html'),regular.replace('<body>','<body class="guided">').replace('id="explore" type="button"','id="explore" type="button" hidden').replace('Lecturas <span id="readingCount">0/18','Lecturas <span id="readingCount">0/6'));
const manifestPath=path.join(root,'scripts/academic-release-manifest.json'),m=JSON.parse(fs.readFileSync(manifestPath));
for(const name of ['index.html','guiada.html','cartas.css','juego.js','motor.js','portal.js','docente.html','docente.js',...fs.readdirSync(path.join(root,'paes/cartas/assets')).filter(n=>n.endsWith('.webp')).map(n=>'assets/'+n)]){
 const p='paes/cartas/'+name;if(!m.criticalFiles.some(r=>r.path===p))m.criticalFiles.push({path:p,url:p.endsWith('index.html')?'/'+p.replace('index.html',''):'/'+p,minBytes:Math.min(1000,Math.floor(fs.statSync(path.join(root,p)).size*.65))});
}
fs.writeFileSync(manifestPath,JSON.stringify(m,null,2)+'\n');console.log('Ruta regular, apoyo y recursos registrados.');
