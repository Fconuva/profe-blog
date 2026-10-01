'use strict';
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'../..'),specs=require('./assets.json');
const walls=require('../../estudiantes/js/catalogo-casa').filter(m=>m.acabado);
(async()=>{
 const items=[...specs,...walls],layers=[],width=960,height=items.length*190;
 for(let i=0;i<items.length;i++){
  layers.push({input:Buffer.from('<svg width="960" height="30"><text x="10" y="22" fill="white" font-family="Arial" font-size="17">'+items[i].id+'</text></svg>'),left:0,top:i*190});
  for(const [j,v] of ['SE','SW','NE','NW'].entries()){
   const input=await sharp(path.join(root,'estudiantes/assets/pieza',items[i].id+'_'+v+'.png')).resize(215,150,{fit:'inside',kernel:'nearest'}).toBuffer();
   layers.push({input,left:j*240+10,top:i*190+32});
  }
 }
 const target=path.join(root,'../scratch/terraza-contacto.png');
 await sharp({create:{width,height,channels:4,background:'#263245'}}).composite(layers).png().toFile(target);
 console.log(target);
})().catch(e=>{console.error(e.message);process.exitCode=1;});
