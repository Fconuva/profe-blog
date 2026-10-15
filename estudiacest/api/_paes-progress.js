'use strict';
const MINI=require('./_paes-mini-invierno-catalog'),OCT=require('./_paes-mini-octubre-catalog');
const clean=v=>String(v||'').replace(/[^0-9A-Z]/gi,'').toUpperCase();
const allowed=new Set(['3AHC','3BHC','4AHC','4BHC']);
const textFields=new Set(['meta_cierre','concepto_logro','concepto_intentos','meta_criterio','meta_evidencia','meta_distractor','meta_transferencia','meta_meta','error_analysis','next_step','context_evidence','distractor_analysis','agreement','tension','evidence','distractor']);
function progress(record,ids,{delivered,required=true,mini=false}={}){
 const total=ids.length,base={required,total,answered:0};
 if(!record||record.resetAt)return{...base,state:'missing'};
 const draft=record.reenvioBorrador||record,answers=draft.answers||{};
 const answered=ids.filter(id=>['A','B','C','D'].includes(answers[id])).length;
 const writing=Object.entries(draft.dev||{}).some(([k,v])=>textFields.has(k)&&typeof v==='string'&&v.trim().length>0);
 const result={...base,answered};
 if(record.reenvioBorrador)return{...result,state:'draft',correction:true,previouslySubmitted:Boolean(delivered)};
 const both=record.submitted===true&&record.completada===true;
 const final=mini?both:Boolean(delivered&&(both||record.status==='sent'||Number(record.submittedAt)>0));
 if(final)return{...result,state:answered===total?'completed':'incomplete'};
 if(record.submitted===true||record.completada===true||record.status==='sent')return{...result,state:'review'};
 return{...result,state:answered>0||writing||Number(record.lastSavedAt)>0||Number(record.startedAt)>0?'draft':'missing'};
}
async function handle(req,res,ctx){
 res.setHeader('Cache-Control','private, no-store');
 const token=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'').trim();
 if(!token)return res.status(401).json({error:'Ingresa para consultar tu avance.'});
 let user;try{user=await ctx.auth.verifyIdToken(token);}catch(_){return res.status(401).json({error:'Vuelve a ingresar para consultar tu avance.'});}
 const profile=(await ctx.db.ref('plataforma_estudiantes/estudiantes/'+user.uid).once('value')).val();
 const rut=clean(profile?.rut),course=clean(profile?.curso),guided=rut==='229327739';
 if(!profile||profile.activo===false||!rut||!allowed.has(course))return res.status(403).json({error:'Tu cuenta no tiene este recorrido PAES.'});
 const read=async(path,render,required=true)=>{try{return render((await ctx.db.ref(path).once('value')).val());}catch(_){return{state:'unknown',required};}};
 const rows=await Promise.all(Array.from({length:21},async(_,i)=>{
  const id=String(i+1),required=+id>=11;
  if(id==='14'&&course==='4AHC')return[id,{state:'not-assigned',required:false}];
  return[id,await read('plataforma_paes/guia_respuestas/'+id+'/'+rut,r=>{
   if(r&&(r.rut&&clean(r.rut)!==rut||r.curso&&clean(r.curso)!==course))return{state:'review',required};
   const spec=ctx.spec(id,r,rut);
   if(!spec.compatible)return{state:'review',required};
   return progress(r,spec.ids,{delivered:ctx.delivered(id,r),required});
  },required)];
 }));
 for(const [id,catalog,base,assigned]of [
  ['22',MINI,'plataforma_paes/mini_invierno_intentos',true],
  ['23',OCT,'plataforma_paes/mini_octubre_intentos',course==='3AHC'||course==='3BHC'||guided&&course==='4AHC']
 ]){
  if(!assigned){rows.push([id,{state:'not-assigned',required:false}]);continue;}
  const sid=catalog.SESSION+(guided?'-guiada':'');
  rows.push([id,await read(base+'/'+sid+'/'+user.uid,r=>{
   if(r&&(r.uid!==user.uid||clean(r.curso)!==course||r.sessionId!==sid))return{state:'review',required:true};
   return progress(r,catalog.questionsFor(guided).map(q=>q.id),{mini:true});
  })]);
 }
 return res.status(200).json({success:true,guides:Object.fromEntries(rows)});
}
module.exports={handle,progress};
