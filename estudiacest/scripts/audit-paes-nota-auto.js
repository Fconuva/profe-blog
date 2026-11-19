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

  // Alta tardía (19-nov-2026): el alta abre el libro; el envío sigue sin abrirlo.
  assert.equal(await N.abrirLibro(db,{rut:'44.444-4',nombre:' Alumna Nueva ',curso:'3°A HC'}),'abierto');
  assert.deepEqual({nombre:libro('444444').nombre,curso:libro('444444').curso,notas:libro('444444').notas},{nombre:'Alumna Nueva',curso:'3°A HC',notas:undefined});
  r=await N.registrar(db,{rut:'444444',guia:'28',contestadas:44,total:44});
  assert.equal(r.escrita,true,'Con el libro abierto, la nota automática ya se escribe.');assert.equal(libro('444444').notas['28'],'7.0');
  assert.equal(await N.abrirLibro(db,{rut:'111',nombre:'Otro',curso:'4°B HC'}),'existente');
  assert.equal(libro('111').curso,'3B-HC','El alta nunca pisa un libro que ya existe.');assert.equal(libro('111').notas['16'],'A');
  assert.equal(await N.abrirLibro(db,{rut:'555',nombre:'TP',curso:'4°D TP'}),'no-hc');
  assert.equal(state.plataforma_paes.libro_notas['555'],undefined,'Fuera de HC no se abre libro.');
  const alta=fs.readFileSync(path.join(__dirname,'..','api','paes.js'),'utf8');
  const altaFn=alta.slice(alta.indexOf('async function handleAdminSaveStudent'),alta.indexOf('async function ensurePaesStudentAccount'));
  assert.match(altaFn,/try \{ libro = await NOTA_AUTO\.abrirLibro\(db, student\); \} catch/,'El alta de un estudiante abre su libro sin romperse si falla.');

  // Tarjetas de avance (19-nov-2026): con nota en el libro, las guías 25 a 29 dejan de ser deuda,
  // salvo el borrador a medias con nota parcial, que todavía puede subirla.
  const P=require('../api/_paes-progress');
  const ids=n=>Array.from({length:n},(_,i)=>'q'+(i+1)),marcadas=n=>Object.fromEntries(ids(n).map(k=>[k,'A']));
  const sp={plataforma_estudiantes:{estudiantes:{u7:{rut:'777',curso:'3°A HC'}}},plataforma_paes:{
    guia_respuestas:{
      '20':{'777':{answers:marcadas(5),lastSavedAt:1}},'21':{'777':{answers:marcadas(5),lastSavedAt:1}},
      '25':{'777':{answers:marcadas(43),status:'sent',submittedAt:1}},
      '27':{'777':{answers:marcadas(30),status:'sent',submittedAt:1,reenvioBorrador:{answers:marcadas(35)}}},
      '28':{'777':{answers:marcadas(44),lastSavedAt:1}},'29':{'777':{answers:marcadas(12),lastSavedAt:1}}},
    libro_notas:{'777':{curso:'3°A HC',notas:{'20':'3.0','25':'7.0','26':'5.0','27':'5.0','28':'7.0','29':'3.0'}}}}};
  const out={setHeader(){},status(c){this.code=c;return this;},json(o){this.body=o;return this;}};
  await P.handle({headers:{authorization:'Bearer x'}},out,{auth:{verifyIdToken:async()=>({uid:'u7'})},db:fakeDb(sp),spec:()=>({compatible:true,ids:ids(44)}),delivered:(_,g)=>Boolean(g&&g.status==='sent')});
  assert.equal(out.code,200);
  const tarjeta=id=>out.body.guides[id].state;
  assert.equal(tarjeta('28'),'graded','Borrador completo con nota máxima: ya no es pendiente.');
  assert.equal(out.body.guides['28'].nota,'7.0');
  assert.equal(tarjeta('29'),'draft','Borrador a medias con nota parcial: sigue en progreso.');
  assert.equal(tarjeta('25'),'graded','Entregada incompleta con nota: calificada.');
  assert.equal(tarjeta('26'),'graded','Sin registro y con nota puesta por el profesor: calificada.');
  assert.equal(tarjeta('27'),'graded','Entregada, con nota y una corrección abierta: calificada.');
  assert.equal(tarjeta('20'),'graded','Hasta la guía 24 la regla anterior no cambia.');
  assert.equal(tarjeta('21'),'draft','Sin nota, el borrador sigue siendo borrador.');
  assert.equal(tarjeta('24'),'missing','Sin registro y sin nota sigue pendiente.');

  const src=fs.readFileSync(path.join(__dirname,'..','api','paes.js'),'utf8');
  const submit=src.slice(src.indexOf('async function handleSubmitGuia'),src.indexOf('async function handleGetGuiaDraft'));
  assert.match(submit,/\(!draft \|\| NOTA_AL_GUARDAR\.has\(guideId\)\) && serverKey && !isPaesTestRut\(rutLimpio\)[\s\S]*NOTA_AUTO\.registrar/,'El envío llama a la nota automática.');
  assert.ok(src.includes("const NOTA_AL_GUARDAR = new Set(['28', '29']);"),'Solo las guías 28 y 29 se califican al guardar el avance.');
  assert.match(submit,/if \(borradorDeReenvio\) \{\s*await notaAutomatica\(Object\.keys\(safeAnswers\)\.length\);/,'El avance de una guía reabierta también se califica.');
  assert.match(submit,/const notaAuto=await notaAutomatica\(Object\.keys\(saved\.answers\|\|\{\}\)\.length\);/,'La respuesta del envío informa la nota escrita.');
  assert.match(submit,/catch\(e\)/,'Un error de la nota no rompe la entrega.');
  console.log('PAES nota automática: tramos, guardas y conexión al envío verificados');
}
test().catch(e=>{console.error(e);process.exit(1);});
