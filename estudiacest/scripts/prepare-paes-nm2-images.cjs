'use strict';
// Codifica los originales revisados para la web; conserva sus bytes originales.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'paes/nm2/assets/ia');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
async function main(){const meta=JSON.parse(fs.readFileSync(path.join(folder,'imagenes-ia.json'),'utf8'));
for(const item of meta.images){const source=path.join(folder,item.original),out=path.join(folder,item.file);await sharp(source).webp({quality:90,effort:6}).toFile(out);const dim=await sharp(out).metadata();item.originalSha256=hash(fs.readFileSync(source));item.sha256=hash(fs.readFileSync(out));item.width=dim.width;item.height=dim.height;item.bytes=fs.statSync(out).size;}
fs.writeFileSync(path.join(folder,'imagenes-ia.json'),JSON.stringify(meta,null,2)+'\n');console.log(meta.images.length+' originales conservados y WebP preparados.');}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
