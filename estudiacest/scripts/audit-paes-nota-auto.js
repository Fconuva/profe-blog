'use strict';
// Nota automática PAES al entregar (29-oct-2026): tramos de laboriosidad y guardas del libro.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const N=require('../api/_paes-nota-auto');

function fakeDb(state) {
  const parts=p=>p.split('/').filter(Boolean);
  const get=p=>parts(p).reduce((o,k)=>o==null?undefined:o[k],state);
  const set=(p,v)=>{const k=parts(p),last=k.pop();let o=state;k.forEach(x=>{o[x]=o[x]||{};o=o[x];});if(v===undefined)delete o[last];else o[last]=v;};
  return {writes:0,ref(p){const db=this;return {
    once:async()=>({val:()=>{const v=get(p);return v===undefined?null:v;}}),
    transaction:async fn=>{const r=fn(get(p));if(r===undefined)return {committed:false};set(p,r);db.writes++;return {committed:true};},
    update:async obj=>{Object.keys(obj).forEach(k=>set(p+'/'+k,obj[k]));db.writes++;}
  };}};
}

async function test() {
  const t=N.notaLaboriosidad;
  assert.equal(t(18,18),'7.0');assert.equal(t(14,18),'7.0');assert.equal(t(13,18),'5.0');
  assert.equal(t(9,18),'5.0');assert.equal(t(8,18),'3.0');assert.equal(t(5,18),'3.0');
  assert.equal(t(4,18),'1.0');assert.equal(t(0,0),null);
  const d=N.decidir;
  assert.equal(d(undefined,'7.0'),'7.0');assert.equal(d(null,'1.0'),null,'Un 1,0 nuevo no se escribe solo.');
  assert.equal(d('A','7.0'),null,'Una «A» no se pisa.');assert.equal(d('7.0','5.0'),null,'Nunca baja.');
  assert.equal(d('5.0','7.0'),'7.0');assert.equal(d('4,5','5.0'),'5.0');

  const state={plataforma_paes:{libro_notas:{
    '111':{curso:'3B-HC',notas:{'15':'5.0','16':'A'}},
    '222':{curso:'4A-HC',notas:{}},
    '333':{curso:'4°A TP',notas:{}}
  }}};
  const db=fakeDb(state),libro=r=>state.plataforma_paes.libro_notas[r];
  let r=await N.registrar(db,{rut:'11-1',guia:'17',contestadas:10,total:10});
  assert.equal(r.escrita,true);assert.equal(libro('111').notas['17'],'7.0');assert.ok(libro('111').updatedAt);
  r=await N.registrar(db,{rut:'111',guia:'15',contestadas:10,total:10});
  assert.equal(libro('111').notas['15'],'7.0','Sube un 5,0 a 7,0.');
  r=await N.registrar(db,{rut:'111',guia:'16',contestadas:10,total:10});
  assert.equal(r.escrita,false);assert.equal(libro('111').notas['16'],'A');
  r=await N.registrar(db,{rut:'111',guia:'18',contestadas:1,total:10});
  assert.equal(r.escrita,false);assert.equal(libro('111').notas['18'],undefined);
  r=await N.registrar(db,{rut:'222',guia:'14',contestadas:10,total:10});
  assert.equal(r.motivo,'g14-4ahc');
  r=await N.registrar(db,{rut:'333',guia:'17',contestadas:10,total:10});
  assert.equal(r.motivo,'sin-libro-hc','Solo cursos HC.');
  const writes=db.writes;
  r=await N.registrar(db,{rut:'999',guia:'17',contestadas:10,total:10});
  assert.equal(r.escrita,false);assert.equal(db.writes,writes,'No abre libros nuevos.');
  assert.equal(state.plataforma_paes.libro_notas['999'],undefined);

  const src=fs.readFileSync(path.join(__dirname,'..','api','paes.js'),'utf8');
  const submit=src.slice(src.indexOf('async function handleSubmitGuia'),src.indexOf('async function handleGetGuiaDraft'));
  assert.match(submit,/!draft && serverKey && !isPaesTestRut\(rutLimpio\)[\s\S]*NOTA_AUTO\.registrar/,'El envío llama a la nota automática.');
  assert.match(submit,/catch\(e\)/,'Un error de la nota no rompe la entrega.');
  console.log('PAES nota automática: tramos, guardas y conexión al envío verificados');
}
test().catch(e=>{console.error(e);process.exit(1);});
