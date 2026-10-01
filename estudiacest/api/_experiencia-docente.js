'use strict';
const {createHash,randomUUID}=require('node:crypto');
const niveles=require('../estudiantes/js/avatar-levels');
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const estado=avatar=>({xpBase:niveles.totalXP({...avatar,regalos:{}}),xpManual:niveles.getManualXP(avatar),xpTotal:niveles.totalXP(avatar),nivel:niveles.getLevel(niveles.totalXP(avatar)).level});
const idValido=id=>/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(String(id||''));

async function manejar(req,res,db,yo,estudiante){
  const ref=db.ref('plataforma_estudiantes/avatar/'+estudiante.uid);
  const avatar=(await ref.once('value')).val()||{};
  const actual=estado(avatar),body=req.body||{};
  res.setHeader('Cache-Control','private, no-store');
  if(!body.modo || body.modo==='consulta')return res.status(200).json({ok:true,estudiante,...actual,recibido:idValido(body.operacion)&&!!avatar.regalos?.['xp__'+body.operacion]});
  if(!['simular','confirmar'].includes(body.modo))return res.status(400).json({error:'Acción no válida.'});
  const tipo=String(body.tipo||''),cantidad=Number(body.cantidad),motivo=String(body.motivo||'').trim();
  if(!['xp','nivel'].includes(tipo)||!Number.isInteger(cantidad)||cantidad<1||cantidad>(tipo==='xp'?10000:niveles.MAX_LEVEL)||motivo.length<4||motivo.length>160)
    return res.status(400).json({error:'Indica XP entre 1 y 10.000 o un nivel de 1 a 200, y un motivo de 4 a 160 caracteres.'});
  const huella=hash([estudiante.uid,tipo,cantidad,motivo,yo.uid]);
  const delta=tipo==='xp'?cantidad:niveles.LEVELS[cantidad-1].xp-actual.xpTotal;
  const revision=hash([actual.xpTotal,huella]);
  if(body.modo==='simular'){
    if(delta<=0)return res.status(400).json({error:'Elige un nivel superior al actual. Esta opción no quita experiencia.'});
    return res.status(200).json({ok:true,estudiante,antes:actual,despues:{xpTotal:actual.xpTotal+delta,nivel:niveles.getLevel(actual.xpTotal+delta).level},delta,tipo,cantidad,motivo,revision,operacion:randomUUID()});
  }
  if(!idValido(body.operacion)||!/^[a-f0-9]{64}$/.test(String(body.revision||'')))return res.status(400).json({error:'Primero revisa el cambio antes de confirmarlo.'});
  const key='xp__'+body.operacion;let conflicto='';
  await ref.transaction(value=>{
    const av=value||{},previous=av.regalos?.[key];conflicto='';
    if(previous){if(previous.huella!==huella)conflicto='La operación corresponde a otro cambio.';return;}
    const current=estado(av);
    if(hash([current.xpTotal,huella])!==body.revision||delta<=0){conflicto='La experiencia cambió. Revisa nuevamente antes de confirmar.';return;}
    return {...av,regalos:{...(av.regalos||{}),[key]:{tipo:'xp-docente',delta,huella,otorgadoPor:yo.uid,motivo,ts:Date.now()}}};
  },undefined,false);
  if(conflicto)return res.status(409).json({error:conflicto});
  const saved=(await ref.once('value')).val()||{};
  if(saved.regalos?.[key]?.huella!==huella)return res.status(500).json({error:'No se pudo confirmar la experiencia. Reintenta la misma operación.'});
  return res.status(200).json({ok:true,estudiante,...estado(saved),recibido:true,operacion:body.operacion,delta:saved.regalos[key].delta});
}
module.exports={manejar,estado};
