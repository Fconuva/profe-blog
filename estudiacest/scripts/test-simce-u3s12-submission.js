'use strict';

// Pruebas aisladas: no leen ni escriben cuentas de estudiantes ni Firebase real.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { manejar, SESSION_ID } = require('../api/_simce-u3s12');
const BASE = 'plataforma_estudiantes';
const UID = 'cuenta-tecnica-ficticia';
const workIds = ['g1','g2','a1','a2','a3','a4'];

function fixture({ course='2A-HC', active=true } = {}) {
  const store = {
    [BASE]: {
      estudiantes:{ [UID]:{nombre:'Prueba aislada',curso:course} },
      sesiones:{ [SESSION_ID]:{activa:active,resultados_visibles:false} },
      respuestas:{ [SESSION_ID]:{} }, resultados:{ [SESSION_ID]:{} }
    }
  };
  const get = path => path.split('/').reduce((value,key)=>value?.[key],store);
  const set = (path,value) => {
    const parts=path.split('/'), key=parts.pop(); let current=store;
    for(const part of parts) current=current[part] ||= {};
    current[key]=structuredClone(value);
  };
  const ref = path => ({
    once: async()=>({val:()=>structuredClone(get(path) ?? null)}),
    child:key=>ref(`${path}/${key}`),
    set:async value=>set(path,value),
    update:async updates=>Object.entries(updates).forEach(([key,value])=>set(`${path}/${key}`,value))
  });
  const auth={verifyIdToken:async token=>{assert.equal(token,'token-tecnico');return {uid:UID};}};
  async function call(action, body={}, token='token-tecnico') {
    let code=0, data;
    const res={status(value){code=value;return this;},json(value){data=value;return this;}};
    await manejar({method:action.endsWith('-state')?'GET':'POST',headers:{authorization:token?`Bearer ${token}`:''},body},res,action,{ref},auth);
    return {code,data};
  }
  return {store,call,get};
}
const answers=Object.fromEntries(Array.from({length:24},(_,i)=>[`q${i+1}`,'A']));
const closure='Una pregunta orienta la respuesta al decidir qué aspecto debe explicar la persona entrevistada.';

test('Entrega nueva: 24 alternativas y cierre, sin los seis campos retirados',async()=>{
  const f=fixture();
  const submitted=await f.call('simce-u3s12-submit',{answers,metaResponses:{m1:closure}});
  assert.equal(submitted.code,200);
  assert.equal(submitted.data.completada,true);
  const state=await f.call('simce-u3s12-state');
  assert.equal(state.data.attempt.submitted,true);
  assert.equal(state.data.attempt.completada,true);
  assert.equal(state.data.attempt.total,24);
  assert.equal(state.data.attempt.metaResponses.m1,closure);
  for(const id of workIds) assert.equal(state.data.attempt.metaResponses[id],'');
  assert.equal(state.data.result,null,'La pauta permanece oculta.');
  assert.equal(f.get(`${BASE}/resultados/${SESSION_ID}/${UID}`).score,6);
});

test('Autoguardado y entrega conservan todos los campos históricos, incluso más de 700 caracteres',async()=>{
  const f=fixture();
  const history=Object.fromEntries([...workIds,'m2','m3'].map(id=>[id,id==='m2'||id==='m3'?'Cierre histórico de prueba.':`${id}: `+'Texto histórico de prueba. '.repeat(34)]));
  assert.ok(history.g1.length>700 && history.g1.length<1200);
  await f.call('simce-u3s12-save',{answers:{q1:'A'},metaResponses:{...history,m1:''}});
  await f.call('simce-u3s12-save',{answers:{q1:'A',q2:'B'},metaResponses:{m1:closure}});
  let state=await f.call('simce-u3s12-state');
  assert.equal(state.data.attempt.submitted,false);
  for(const [id,value] of Object.entries(history)) assert.equal(state.data.attempt.metaResponses[id],value.trim());
  assert.equal((await f.call('simce-u3s12-submit',{answers,metaResponses:{m1:closure}})).code,200);
  state=await f.call('simce-u3s12-state');
  for(const [id,value] of Object.entries(history)) assert.equal(state.data.attempt.metaResponses[id],value.trim());
});

test('Solo faltantes actuales: nunca exige g1–a4 ni m2/m3',async()=>{
  const f=fixture();
  const incomplete=await f.call('simce-u3s12-submit',{answers:{q1:'A'},metaResponses:{m1:'Corta'}});
  assert.equal(incomplete.code,400);
  assert.ok(incomplete.data.fields.includes('q2') && incomplete.data.fields.includes('m1'));
  assert.ok(!incomplete.data.fields.some(id=>[...workIds,'m2','m3'].includes(id)));
  assert.equal(f.get(`${BASE}/respuestas/${SESSION_ID}/${UID}`),undefined);
});

test('Entrega completada no se modifica ni vuelve a borrador',async()=>{
  const f=fixture();
  await f.call('simce-u3s12-submit',{answers,metaResponses:{m1:closure}});
  const before=structuredClone(f.get(`${BASE}/respuestas/${SESSION_ID}/${UID}`));
  assert.equal((await f.call('simce-u3s12-save',{answers:{q1:'B'},metaResponses:{m1:'Otra respuesta'}})).code,409);
  assert.deepEqual(f.get(`${BASE}/respuestas/${SESSION_ID}/${UID}`),before);
});

test('Autenticación, asignación de curso y cierre docente siguen protegidos',async()=>{
  assert.equal((await fixture().call('simce-u3s12-state',{},'')).code,401);
  assert.equal((await fixture({course:'4A-TP'}).call('simce-u3s12-state')).code,403);
  assert.equal((await fixture({active:false}).call('simce-u3s12-submit',{answers,metaResponses:{m1:closure}})).code,423);
});
