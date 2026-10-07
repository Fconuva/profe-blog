'use strict';
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
function json(file,fn){const p=path.join(root,file),d=JSON.parse(fs.readFileSync(p,'utf8'));fn(d);fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');}
json('package.json',d=>{if(!d.scripts.prebuild.includes('audit-paes-mini-invierno.js'))d.scripts.prebuild='node scripts/audit-paes-mini-invierno.js && '+d.scripts.prebuild;d.scripts['audit:paes-mini-invierno']='node scripts/audit-paes-mini-invierno.js';});
json('scripts/class-submission-contract.json',d=>{for(const page of ['index.html','guiada.html']){const p='paes/mini-invierno-2027/'+page;if(!d.files.some(x=>x.path===p))d.files.push({path:p,storage:'api',logic:'paes/mini-invierno-2027/mini.js',backend:['api/_paes-mini-invierno.js','api/_paes-mini-invierno-catalog.js']});}});
json('scripts/academic-release-manifest.json',d=>{for(const file of ['index.html','guiada.html','mini.css','mini.js','integridad.js','sesion.js','docente.html','docente.js','portal.js']){const p='paes/mini-invierno-2027/'+file;if(!d.criticalFiles.some(x=>x.path===p))d.criticalFiles.push({path:p,url:'/'+p,minBytes:300});}});
const p=path.join(root,'.vercelignore');let s=fs.readFileSync(p,'utf8').replace('!scripts/audit-paes-mini-invierno.js\n','');s+='\n!scripts/audit-paes-mini-invierno.js\n';fs.writeFileSync(p,s);
// Conservar el estilo mixto del manifiesto vigente sin reformatear miles de líneas.
const cp=require('node:child_process'),mp=path.join(root,'scripts/academic-release-manifest.json');
const current=JSON.parse(fs.readFileSync(mp,'utf8')),original=cp.execFileSync('git',['show','HEAD:estudiacest/scripts/academic-release-manifest.json'],{cwd:root,encoding:'utf8'}),base=JSON.parse(original);
const added=current.criticalFiles.filter(x=>!base.criticalFiles.some(y=>y.path===x.path));
if(JSON.stringify({...current,criticalFiles:current.criticalFiles.filter(x=>base.criticalFiles.some(y=>y.path===x.path))})!==JSON.stringify(base))throw Error('El manifiesto tiene cambios concurrentes; revisar antes de conservar formato.');
fs.writeFileSync(mp,original.replace('"criticalFiles": [','"criticalFiles": [\n'+added.map(x=>'    '+JSON.stringify(x)+',').join('\n')));
