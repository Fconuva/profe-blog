'use strict';
// Vistas fieles del PDF publicado; no regenera ni altera las guías imprimibles.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const sharp=require('sharp');
const base=path.resolve(__dirname,'../nm4/u3-clase7-manual-ilustrado');
const courses=['4A','4B','4C','4D','4E'];
const anchors=[
 ['Identificación del grupo','Objetivo','1. Texto para leer','Fuente de la lectura:'],
 ['Plano y partes del equipo','Vocabulario de apoyo','Imágenes para explicar'],
 ['1. ¿Para qué sirve?','2. Indicaciones claras y ordenadas','Duda para la clase 2:'],
 ['Observen el plano.','Nombre de la parte','¿Qué función cumple?'],
 ['4. Escriban dos advertencias','Expliquen qué muestra la imagen A.','7. Fuente consultada']
];
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const decode=value=>value.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function poppler(command,args){
 const result=spawnSync(command,args,{maxBuffer:20*1024*1024,windowsHide:true});
 if(result.error||result.status!==0)throw new Error(`${command}: ${result.error?.message||result.stderr.toString()}`);
 return result.stdout;
}
async function main(){
 const data={generator:'pdftoppm + sharp',width:1200,courses:{}};
 for(const course of courses){
  const pdf=path.join(base,'assets',`guia-${course.toLowerCase()}-completa.pdf`),original=fs.readFileSync(pdf);
  const pages=[];
  for(let page=1;page<=5;page++){
   const image=poppler('pdftoppm',['-f',String(page),'-l',String(page),'-singlefile','-scale-to-x','1200','-scale-to-y','-1','-png',pdf]);
   const file=`assets/guia-${course.toLowerCase()}-vista-${page}.webp`;
   const bytes=await sharp(image).webp({quality:90,effort:5}).toBuffer();
   const metadata=await sharp(bytes).metadata();
   const xml=poppler('pdftotext',['-bbox-layout','-f',String(page),'-l',String(page),pdf,'-']).toString('utf8');
   const geometry=xml.match(/<page width="([\d.]+)" height="([\d.]+)"/);
   const lines=[...xml.matchAll(/<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([\s\S]*?)<\/line>/g)].map(match=>({xMax:Number(match[3]),y:(Number(match[2])+Number(match[4]))/2,text:[...match[5].matchAll(/<word[^>]*>([\s\S]*?)<\/word>/g)].map(word=>decode(word[1])).join(' ')}));
   if(!geometry)throw new Error(`${course}/${page}: geometría del PDF ausente.`);
   const markers=anchors[page-1].map((anchor,index)=>{
    const line=lines.find(candidate=>candidate.text.includes(anchor));
    if(!line)throw new Error(`${course}/${page}: no se encuentra «${anchor}».`);
    return {id:index+1,anchor,x:Math.min(94,line.xMax/Number(geometry[1])*100+8),y:line.y/Number(geometry[2])*100};
   });
   fs.writeFileSync(path.join(base,file),bytes);
   pages.push({page,file,width:metadata.width,height:metadata.height,sha256:hash(bytes),markers});
  }
  if(!fs.readFileSync(pdf).equals(original))throw new Error(`${course}: el PDF cambió durante la conversión.`);
  data.courses[course]={pdf:`assets/guia-${course.toLowerCase()}-completa.pdf`,pdfSha256:hash(original),pages};
 }
 fs.writeFileSync(path.join(base,'guia-vistas.js'),'window.MANUAL_GUIDE_PREVIEWS = '+JSON.stringify(data,null,2)+';\n');
 console.log('25 vistas WebP de PDF originales, flechas ancladas a sus secciones y SHA-256 guardados; los cinco PDF permanecen intactos.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
