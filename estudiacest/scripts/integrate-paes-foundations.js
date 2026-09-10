'use strict';
// Migración mecánica acotada del catálogo y los contratos; idempotente.
const fs=require('node:fs'),path=require('node:path'),bank=require('../api/_paes-foundations');
const root=path.resolve(__dirname,'..');
function edit(file,fn){const p=path.join(root,file);fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')),'utf8');}
edit('paes/guias.html',s=>{
 s=s.replace('Descarga el material oficial en formato PDF para estudiar a tu propio ritmo.','Abre las guías interactivas vigentes o consulta los PDF históricos.');
 for(const g of bank.guides){
  const card=`<article class="guia-item" data-guia-id="g${g.id}"><div class="guia-item-left"><div class="guia-icon">📖</div><div class="guia-details"><h4>Guía N°${g.id}: ${g.title}</h4><p>${g.objective}</p><p>2 textos originales · 12 preguntas · Sin límite de tiempo${g.id==='5'?' · Formación complementaria':''}</p></div></div><div><a href="guia${g.id}.html" class="btn-download">Iniciar Guía ${g.id}</a>${['3','5'].includes(g.id)?'':`<a href="guias/Guia_Trabajo${g.id}_PAES_2026.pdf" download class="btn-download">PDF histórico</a>`}</div></article>`;
  const re=new RegExp(`<article class="guia-item" data-guia-id="g${g.id}">[\\s\\S]*?<\\/article>`);
  if(re.test(s))s=s.replace(re,card);else s=s.replace(`<!-- Guía ${Number(g.id)+1} -->`,card+`\n        <!-- Guía ${Number(g.id)+1} -->`);
 }
 return s;
});
edit('paes/index.html',s=>{
 const block=`<!-- foundations:start -->\n${bank.guides.map(g=>`<article class="ensayo-card" id="cardGuia${g.id}">
 ${g.id==='1'?'<span id="cardFundamentos" aria-hidden="true"></span>':''}
 <div class="ensayo-card-header"><span class="ensayo-tag">Guía interactiva · Tramo inicial${g.id==='5'?' · Complementaria':''}</span><h3>Guía N°${g.id}: ${g.title}</h3><div class="ensayo-card-meta"><span>2 textos originales</span><span>12 preguntas</span><span>Sin límite de tiempo</span></div></div>
 <div class="ensayo-status-box"><p class="status-pending" style="color:var(--paes-color-light)">${g.objective}</p><p>Objetivo e instrucciones · Esquema y ejemplo resuelto · Práctica y evaluación</p></div>
 <div><a class="btn-action btn-start" href="guia${g.id}.html">Iniciar Guía ${g.id}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></div>
 </article>`).join('\n')}\n<!-- foundations:end -->`.replace(/[ \t]+$/gm,'');
 if(s.includes('<!-- foundations:start -->'))return s.replace(/<!-- foundations:start -->[\s\S]*?<!-- foundations:end -->/,block);
 return s.replace('<!-- Sesión Interactiva: Guía N°10 -->',block+'\n        <!-- Sesión Interactiva: Guía N°10 -->');
});
edit('scripts/class-submission-contract.json',s=>{const d=JSON.parse(s);for(const g of bank.guides)for(const suffix of ['','-guiada']){const p=`paes/guia${g.id}${suffix}.html`;if(!d.files.some(x=>x.path===p))d.files.push({path:p,storage:'api',logic:'paes/js/guia-foundations.js',backend:'api/paes.js'});}return JSON.stringify(d,null,2)+'\n';});
edit('scripts/academic-release-manifest.json',s=>{const d=JSON.parse(s);const files=bank.guides.flatMap(g=>['','-guiada'].map(suffix=>({path:`paes/guia${g.id}${suffix}.html`,minBytes:4000,contains:'guia-foundations.js'})));files.push({path:'paes/js/guia-foundations.js',minBytes:10000,contains:'get-foundation'},{path:'paes/js/foundations-registry.js',minBytes:1000,contains:'PAES_FOUNDATIONS_REGISTRY'},{path:'paes/css/guia-foundations.css',minBytes:500,contains:'guia20.css'});for(const f of files)if(!d.criticalFiles.some(x=>x.path===f.path))d.criticalFiles.push({...f,url:'/'+f.path});return JSON.stringify(d,null,2)+'\n';});
edit('package.json',s=>{const d=JSON.parse(s);d.scripts['audit:paes-foundations']='node scripts/audit-paes-foundations.js';if(!d.scripts.build.includes('audit-paes-foundations'))d.scripts.build='node scripts/audit-paes-foundations.js && '+d.scripts.build;return JSON.stringify(d,null,2)+'\n';});
// Convención de habilidades del panel docente: mayúsculas.
edit('scripts/generate-paes-foundations.js',s=>s.replace(/\.toUpperCase\(\)(?:\.toUpperCase\(\))+/g,'.toUpperCase()'));
console.log('Catálogo G1–G9, portada, contrato y manifiesto integrados.');
// Etiquetado por operación efectivamente solicitada, no por el tema de la guía.
edit('api/_paes-foundations-1-3.js',s=>s
 .replace("['l','¿Cómo cambia la posición del padre ante el traslado?'", "['d','¿Cómo cambia la posición del padre ante el traslado?'")
 .replace("['c','¿Qué función cumple el recuerdo de la conversación con su madre?'", "['h','¿Qué función cumple el recuerdo de la conversación con su madre?'")
 .replace("['l','¿Qué actitud muestra Tomás hacia su antigua afirmación sobre los materiales?'", "['d','¿Qué actitud muestra Tomás hacia su antigua afirmación sobre los materiales?'"));
