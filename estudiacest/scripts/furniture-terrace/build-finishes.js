'use strict';
// Muros nativos por código, igual que los muros del Canvas. No son imágenes IA.
const path=require('node:path'),sharp=require('sharp');
const catalog=require('../../estudiantes/js/catalogo-casa');
const dir=path.resolve(__dirname,'../../estudiantes/assets/pieza');
async function main(){
  for(const wall of catalog.filter(m=>m.acabado))for(const [index,view] of ['SE','SW','NE','NW'].entries()){
    const p=wall.acabado,H=p.alto?42:84;
    let marks='';
    for(let row=0;row<8;row++)for(let col=0;col<12;col++){
      const x=col*14+(p.patron==='ladrillo'&&row%2?7:0),y=row*16;
      if(p.patron==='madera')marks+='<path d="M'+x+',0v180"/>';
      else if(p.patron==='jardin')marks+='<ellipse cx="'+(x+6)+'" cy="'+(y+8)+'" rx="5" ry="7" fill="'+((row+col+index)%2?'#8bbd75':'#386344')+'"/>';
      else marks+='<path d="M'+x+','+y+'h14v16"/>';
    }
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="160" height="168"><defs><pattern id="p" width="168" height="128" patternUnits="userSpaceOnUse"><g fill="none" stroke="#213242" stroke-opacity=".3" stroke-width="1">'+marks+'</g></pattern></defs><g stroke="'+p.canto+'" stroke-width="2"><path d="M8 154L80 115V'+(115-H)+'L8 '+(154-H)+'Z" fill="'+(index%2?p.der:p.izq)+'"/><path d="M80 115L152 154V'+(154-H)+'L80 '+(115-H)+'Z" fill="'+(index%2?p.izq:p.der)+'"/></g><g fill="url(#p)"><path d="M8 154L80 115V'+(115-H)+'L8 '+(154-H)+'Z"/><path d="M80 115L152 154V'+(154-H)+'L80 '+(115-H)+'Z"/></g></svg>';
    await sharp(Buffer.from(svg)).png().toFile(path.join(dir,wall.id+'_'+view+'.png'));
  }
  for(const view of ['SE','SW','NE','NW'])await sharp(path.join(dir,'terraceGrass_'+view+'.png')).resize(151,106,{kernel:'nearest'}).png().toFile(path.join(dir,'floorFull__pasto_'+view+'.png'));
  console.log('Seis muros nativos y piso de pasto preparados, con cuatro vistas y transparencia.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
