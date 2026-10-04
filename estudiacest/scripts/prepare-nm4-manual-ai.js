'use strict';
// Solo codificación para la web: no recorta, retoca, reescala ni dibuja imágenes.
// La ilustración y los cambios visuales se realizan con image_gen.
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const base=path.resolve(__dirname,'../nm4/u3-clase7-manual-ilustrado/assets');
async function main(){
 const input=process.argv[process.argv.indexOf('--input')+1];
 if(!process.argv.includes('--input')||!input)throw new Error('Indique --input con la carpeta de originales generados.');
 const receipt=JSON.parse(fs.readFileSync(path.join(base,'imagenes-ia.json'),'utf8'));
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();
  for(const item of receipt.images){
   const source=path.join(path.resolve(input),item.sourceArtifact),target=path.join(base,item.file);
   if(fs.existsSync(target)){console.log(item.file+': conservada');continue;}
   if(!fs.existsSync(source))throw new Error('Original ausente: '+item.sourceArtifact);
   await page.goto(pathToFileURL(source).href);
   const encoded=await page.evaluate(async()=>{
    const img=document.images[0];await img.decode();
    const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    canvas.getContext('2d').drawImage(img,0,0);
    return {data:canvas.toDataURL('image/webp',0.92),width:canvas.width,height:canvas.height};
   });
   if(!encoded.data.startsWith('data:image/webp;'))throw new Error('Codificador WebP no disponible.');
   const bytes=Buffer.from(encoded.data.split(',')[1],'base64');
   if(bytes.length<1000||encoded.width!==1536||encoded.height!==1024)throw new Error('Dimensiones o contenido inesperados.');
   fs.writeFileSync(target,bytes,{flag:'wx'});
   console.log(item.file+': '+encoded.width+'×'+encoded.height+', '+bytes.length+' bytes');
  }
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
