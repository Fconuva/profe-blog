'use strict';
// Reconciliación autorizada por curso. No escribe fuera de inventarios de muebles.
const https=require('node:https');
const {getAccessToken,requestJson}=require('./firebase-maintenance-db');
const rewards=require('../api/_premios-paes');
const apply=process.argv.includes('--apply');
const arg=name=>process.argv[process.argv.indexOf(name)+1];
const course=process.argv.includes('--curso')?arg('--curso'):'4B-HC';
function snapshot(value){return {val:()=>value,exists:()=>value!=null};}
async function main(){
  if(!rewards.CURSOS.includes(course))throw Error('Curso HC no válido.');
  const token=getAccessToken();
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
    for(let i=0;i<5;i++){const current=await cas('GET',route);const value=callback(current.data);if(value===undefined)return {committed:false};const put=await cas('PUT',route,value,current.etag);if(!put.conflict)return {committed:true};}
    throw Error('El inventario cambió repetidamente; vuelve a simular.');
  }})};
  const plan=await rewards.planCurso(db,course);
  console.log(JSON.stringify({mode:apply?'apply':'dry-run',curso:course,estudiantesCurso:plan.totalCurso,conEntregas:plan.destinatarios.length,mueblesPendientes:plan.pendientes,muebles:rewards.fichas().map(p=>({guia:p.guia,mueble:p.mueble}))}));
  if(!apply)return;
  const expected=process.argv.includes('--expected-count')?Number(arg('--expected-count')):NaN;
  if(!Number.isInteger(expected)||expected!==plan.pendientes)throw Error('El conteo no coincide con la simulación; revisa de nuevo antes de aplicar.');
  let given=0;for(const row of plan.destinatarios)given+=await rewards.entregar(db,row);
  const after=await rewards.planCurso(db,course);
  if(after.pendientes!==0)throw Error('Quedan premios pendientes; vuelve a simular y reintentar sin duplicar.');
  console.log(JSON.stringify({confirmado:true,curso:course,mueblesNuevos:given,estudiantesConEntregas:after.destinatarios.length,pendientes:after.pendientes}));
}
main().catch(e=>{console.error('ERROR:',e.message);process.exitCode=1;});
