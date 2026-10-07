'use strict';
// Edición editorial única: evita una secuencia cíclica antes de aleatorizar posiciones por UID.
const fs=require('node:fs'),path=require('node:path'),p=path.join(__dirname,'../api/_paes-mini-invierno-catalog.js');
const source=fs.readFileSync(p,'utf8'),marker='const guidedText=',cut=source.indexOf(marker),desired='BDACABDBCACDBADCDB'.split('');let edited=0;
const before=source.slice(0,cut).split('\n').map(line=>{if(!/^ q\(/.test(line))return line;const comma=line.trim().endsWith(','),a=new Function('q','return '+line.trim().replace(/,$/,''))((...v)=>v);const old=a[4].charCodeAt(0)-65,next=desired[a[0]-1].charCodeAt(0)-65;[a[3][old],a[3][next]]=[a[3][next],a[3][old]];[a[9][old],a[9][next]]=[a[9][next],a[9][old]];a[4]=desired[a[0]-1];edited++;return ' q('+a.map(x=>JSON.stringify(x)).join(',')+')'+(comma?',':'');}).join('\n');
if(edited!==18)throw Error('No se identificaron los dieciocho ítems regulares.');fs.writeFileSync(p,before+source.slice(cut));console.log('Secuencia de claves regular sin ciclo A-D.');
