// Derivados mecánicos: conservar alfa, recortar margen y reducir sin suavizado.
// No genera ni redibuja imágenes. Los originales proceden de la IA integrada.
'use strict';
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const plan=require('./prompts.json');
const root=path.join(__dirname,'../..'),out=path.join(root,'estudiantes/assets/avatar-kit');
async function main(){
  fs.mkdirSync(out,{recursive:true});
  const partial=process.argv.includes('--partial'),items=[];
  for(const p of plan){
    const source=path.join(__dirname,'source',p.id+'.png');
    if(!fs.existsSync(source)){if(partial)continue;throw Error('Falta original: '+p.id);}
    const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let left=info.width,top=info.height,right=-1,bottom=-1;
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>8){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
    if(right<left||bottom<top)throw Error('Original vacío: '+p.id);
    const portrait=['ojos','boca','pelo'].includes(p.type),width=portrait?160:112,height=portrait?160:168;
    const reduced=await sharp(source).extract({left,top,width:right-left+1,height:bottom-top+1})
      .resize(width-16,height-16,{fit:'inside',kernel:'nearest'})
      .png({palette:false}).toBuffer();
    const meta=await sharp(reduced).metadata(),dx=width-meta.width,dy=height-meta.height;
    await sharp(reduced).extend({left:Math.floor(dx/2),right:Math.ceil(dx/2),top:Math.floor(dy/2),bottom:Math.ceil(dy/2),background:'#00000000'})
      .png({compressionLevel:9,palette:false}).toFile(path.join(out,p.id+'.png'));
    const tile=await sharp(path.join(out,p.id+'.png')).resize(160,160,{fit:'contain',background:'#00000000',kernel:'nearest'}).toBuffer();
    items.push({input:tile,left:(items.length%10)*160,top:Math.floor(items.length/10)*190});
  }
  await sharp({create:{width:1600,height:Math.ceil(items.length/10)*190,channels:4,background:'#223049'}}).composite(items).png().toFile(path.join(root,'../scratch/avatar-kit-contacto.png'));
  console.log(items.length+' originales RGBA importados; alfa preservado, escalado nearest, contacto visual en scratch/avatar-kit-contacto.png.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
