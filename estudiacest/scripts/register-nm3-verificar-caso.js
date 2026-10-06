'use strict';
// Registra el expediente y recursos nuevos sin reformatear el manifiesto existente.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),b='nm3/u3-clase5-verificar-caso/';
const old=cp.execFileSync('git',['show','6745f30e:estudiacest/nm3/index.html'],{cwd:root,encoding:'utf8'});
const hrefs=[...old.matchAll(/<a[^>]*href="([^"]+)"/g)].map(m=>m[1]);
fs.writeFileSync(path.join(root,b,'assets/portada-enlaces-anteriores.json'),JSON.stringify(hrefs,null,2));
const sources={checked:'2026-10-06',cases:'Publicaciones recreadas para trabajar hechos chilenos documentados; no son capturas de cadenas reales.',references:[{id:'N1',url:'https://www.earthdata.nasa.gov/news/worldview-image-archive/fires-chile',capture:'2017-01-22',publication:'2017-01-23',updated:'2025-05-14',image:'incendios-chile-2017-original.jpg',sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,b,'assets/incendios-chile-2017-original.jpg'))).digest('hex')},{id:'D1',url:'https://www.directemar.cl/tras-37-horas-de-monitoreo-shoa-cancelo',publication:'2025-07-31',event:'Cancelación total a las 08:50 del 31 de julio de 2025'},{id:'S1',url:'https://www.servel.cl/Ch/app/200-070-vocales-designados-para-las-proximas-elecciones-regionales-y-municipales/sin-categoria/',process:'Municipales y regionales del 26 y 27 de octubre de 2024'}]};
fs.writeFileSync(path.join(root,b,'assets/fuentes.json'),JSON.stringify(sources,null,2));
const manifest=path.join(root,'scripts/academic-release-manifest.json');let text=fs.readFileSync(manifest,'utf8');
const files=['index.html','guia.html','guia.css','assets/guia-verificar-caso-nm3.pdf','assets/estudiantes-verificando-gris.webp','assets/verificar-documentos-gris.webp','assets/estudiantes-verificando-original.png','assets/verificar-documentos-original.png','assets/incendios-chile-2017-original.jpg','assets/incendios-chile-2017-gris.jpg','assets/imagenes-ia.json','assets/fuentes.json'];
const existing=new Set(JSON.parse(text).criticalFiles.map(e=>e.path));
const entries=files.filter(f=>!existing.has(b+f)).map(f=>({path:b+f,url:'/'+b+(f==='index.html'?'':f),minBytes:f.endsWith('.pdf')?100000:f.endsWith('.webp')?20000:f.endsWith('.png')?100000:f.endsWith('.jpg')?10000:f.endsWith('.html')?4000:500}));
if(entries.length){text=text.replace('"criticalFiles": [','"criticalFiles": [\n'+entries.map(e=>'    '+JSON.stringify(e)+',').join('\n'));fs.writeFileSync(manifest,text);}
console.log('Destinos previos:',hrefs.length,'; recursos registrados:',entries.length);
