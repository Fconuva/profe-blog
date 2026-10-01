'use strict';
// Extracción mecánica de cuatro vistas IA: conserva el canal alfa y no redibuja el arte.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const specs = require('./assets.json');
const sourceDir = path.join(__dirname,'source');
const outputDir = path.resolve(__dirname,'../../estudiantes/assets/pieza');
const dirs = ['SE','SW','NE','NW'];
async function main() {
  for (const spec of specs) {
    const input = path.join(sourceDir,spec.id + '.png');
    const metadata = await sharp(input).metadata();
    if (!metadata.hasAlpha || !metadata.width || !metadata.height) throw Error('Falta transparencia: ' + spec.id);
    const cells = [];
    for (let index = 0; index < 4; index++) {
      const left = Math.floor(metadata.width/2) * (index%2), top = Math.floor(metadata.height/2) * Math.floor(index/2);
      const width = Math.floor(metadata.width/2), height = Math.floor(metadata.height/2);
      const buffer = await sharp(input).extract({left,top,width,height}).ensureAlpha().raw().toBuffer();
      let minX = width, minY = height, maxX = -1, maxY = -1, clear = 0;
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        if (buffer[(y*width+x)*4+3] <= 8) { clear++; continue; }
        minX = Math.min(minX,x); minY = Math.min(minY,y); maxX = Math.max(maxX,x); maxY = Math.max(maxY,y);
      }
      if (maxX < 0 || clear/(width*height) < .1) throw Error('Vista vacía o sin alfa real: ' + spec.id + '/' + dirs[index]);
      cells.push({buffer,width,height,box:{left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1}});
    }
    const scale = Math.min(...cells.map(cell=>Math.min(spec.maxWidth/cell.box.width,spec.maxHeight/cell.box.height)),1);
    for (let index = 0; index < 4; index++) {
      const cell = cells[index], target = path.join(outputDir,spec.id + '_' + dirs[index] + '.png');
      await sharp(cell.buffer,{raw:{width:cell.width,height:cell.height,channels:4}}).extract(cell.box)
        .resize(Math.max(1,Math.round(cell.box.width*scale)),Math.max(1,Math.round(cell.box.height*scale)),{kernel:'nearest'})
        .extend({top:2,bottom:2,left:2,right:2,background:{r:0,g:0,b:0,alpha:0}}).png().toFile(target);
    }
    console.log(spec.id + ': cuatro vistas extraídas, alfa conservado.');
  }
}
main().catch(error=>{console.error(error.message);process.exit(1);});
