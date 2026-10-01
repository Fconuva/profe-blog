'use strict';
// Reconciliación autorizada por curso. No escribe fuera de inventarios de muebles.
const https=require('node:https');
const crypto=require('node:crypto');
const {getAccessToken,requestJson}=require('./firebase-maintenance-db');
const rewards=require('../api/_premios-paes');
const apply=process.argv.includes('--apply');
const arg=name=>process.argv[process.argv.indexOf(name)+1];
const course=process.argv.includes('--curso')?arg('--curso'):'4B-HC';
function snapshot(value){return {val:()=>value,exists:()=>value!=null};}
async function main(){
  if(!rewards.CURSOS.includes(course))throw Error('Curso HC no válido.');
  const token=getAccessToken();
  let actualNew=0;
  async function cas(method,route,body,etag){
    return new Promise((resolve,reject)=>{
      const url=new URL('https://estudiacest-default-rtdb.firebaseio.com/'+route+'.json');url.searchParams.set('access_token',token);
      const headers=method==='GET'?{'X-Firebase-ETag':'true'}:{'Content-Type':'application/json','If-Match':etag};
      const req=https.request(url,{method,headers},res=>{let raw='';res.on('data',c=>raw+=c);res.on('end',()=>{if(res.statusCode===412){resolve({conflict:true});return;}if(res.statusCode!==200){reject(Error('Firebase HTTP '+res.statusCode));return;}try{resolve({data:JSON.parse(raw),etag:res.headers.etag});}catch(_){reject(Error('Respuesta Firebase inválida.'));}});});
      req.setTimeout(30000,()=>req.destroy(Error('Tiempo de espera agotado.')));req.on('error',reject);if(body!==undefined)req.write(JSON.stringify(body));req.end();
    });
  }
  const db={ref:route=>({once:async()=>snapshot(await requestJson('GET',route,token)),transaction:async callback=>{
    if(!/^plataforma_estudiantes\/avatar\/[A-Za-z0-9_-]+\/regalos$/.test(route))throw Error('Ruta de escritura fuera del alcance.');
    for(let i=0;i<5;i++){
      const current=await cas('GET',route);const value=callback(current.data);if(value===undefined)return {committed:false};
      const basic=new Set(Object.values(rewards.PREMIOS));
      if(Object.entries(current.data||{}).some(([id,p])=>JSON.stringify(value[id])!==JSON.stringify(p)))throw Error('Intento de reemplazar un regalo previo.');
      if(Object.keys(value).some(id=>!Object.hasOwn(current.data||{},id) && !basic.has(id)))throw Error('Intento de regalar un mueble personalizado.');
      const put=await cas('PUT',route,value,current.etag);if(!put.conflict){actualNew+=Object.keys(value).filter(id=>!Object.hasOwn(current.data||{},id)).length;return {committed:true};}
    }
    throw Error('El inventario cambió repetidamente; vuelve a simular.');
  }})};
  const plan=await rewards.planCurso(db,course);
  const revision=crypto.createHash('sha256').update(JSON.stringify(plan.destinatarios.map(row=>[row.uid,row.premios.map(p=>p.guia)]).sort((a,b)=>a[0].localeCompare(b[0])))).digest('hex');
  console.log(JSON.stringify({mode:apply?'apply':'dry-run',curso:course,estudiantesCurso:plan.totalCurso,conEntregas:plan.destinatarios.length,mueblesPendientes:plan.pendientes,revision,muebles:rewards.fichas().map(p=>({guia:p.guia,mueble:p.mueble}))}));
  if(!apply)return;
  const expected=process.argv.includes('--expected-count')?Number(arg('--expected-count')):NaN;
  const expectedRevision=process.argv.includes('--expected-revision')?arg('--expected-revision'):'';
  // Mientras revisamos, el alumno puede abrir su casa y recibir sus premios.
  // Confirmar la misma nómina/guías, no exigir que siga pendiente lo ya recibido.
  if(expectedRevision ? expectedRevision!==revision : !Number.isInteger(expected)||expected!==plan.pendientes)throw Error('La simulación no coincide; revisa de nuevo antes de aplicar.');
  for(const row of plan.destinatarios)await rewards.entregar(db,row);
  const after=await rewards.planCurso(db,course);
  if(after.pendientes!==0)throw Error('Quedan premios pendientes; vuelve a simular y reintentar sin duplicar.');
  console.log(JSON.stringify({confirmado:true,curso:course,mueblesNuevos:actualNew,estudiantesConEntregas:after.destinatarios.length,pendientes:after.pendientes}));
}
main().catch(e=>{console.error('ERROR:',e.message);process.exitCode=1;});
