'use strict';
const guides = [...require('./_paes-foundations-1-3'), ...require('./_paes-foundations-4-6'), ...require('./_paes-foundations-7-9')];
const VERSION = 'foundations-v1';
const tasks = {a:'Busca el dato que el texto declara.',b:'Reconoce el dato aunque se exprese con otras palabras.',c:'Relaciona las partes y conserva el vínculo que establece el texto.',d:'Concluye solo lo que permiten las pistas.',e:'Interpreta el sentido en su contexto.',f:'Conserva la idea central y su alcance.',g:'Distingue la idea principal de los detalles.',h:'Explica para qué sirve ese segmento.',i:'Reconoce qué busca comunicar a sus destinatarios.',j:'Comprueba si la evidencia permite sostener la afirmación.',k:'Juzga la forma o la información usando el texto.',l:'Reconoce la posición o actitud del emisor.',m:'Juzga si el recurso es pertinente para su propósito.',n:'Aplica el criterio del texto a la situación nueva.'};
const skill = task => task < 'c' ? 'Localizar' : task < 'i' ? 'Interpretar' : 'Evaluar';
const KEYS={}, FEEDBACK={}, GUIDED_KEYS={}, GUIDED_FEEDBACK={}, registry={regular:{},guided:{}};
const compiled={};
for(const guide of guides){
 let seed=Number(guide.id)*7919+43;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const questions=[]; const key={}, feedback={}, skills={};
 guide.texts.forEach((reading,s)=>reading.questions.forEach(([task,text,options,reasons],i)=>{
  const n=s*6+i+1, order=[0,1,2,3];
  for(let k=3;k>0;k--){const j=Math.floor(random()*(k+1));[order[k],order[j]]=[order[j],order[k]];}
  const opts=Object.fromEntries(order.map((original,j)=>['ABCD'[j],options[original]]));
  key[n]='ABCD'[order.indexOf(0)];skills[n]=skill(task);
  feedback[n]=`Reformulación simple: ${tasks[task]}\nClave ${key[n]}.\n${order.map((original,j)=>`${'ABCD'[j]}: ${reasons[original]}`).join('\n')}`;
  questions.push({n,set:s+1,text,opts,level:s===0?Math.floor(i/2)+1:null,cue:s===0?(i<2?tasks[task]:i<4?'Identifica la demanda y contrasta tu decisión con el texto.':'Aplica el procedimiento de forma autónoma.'):null});
 }));
 KEYS[guide.id]=key;FEEDBACK[guide.id]=feedback;
 GUIDED_KEYS[guide.id]=Object.fromEntries(Object.entries(key).slice(0,6));
 GUIDED_FEEDBACK[guide.id]=Object.fromEntries(Object.entries(feedback).slice(0,6));
 const metadata={titulo:`Guía ${guide.id}: ${guide.title}`,total:12,key:{},skill:Object.fromEntries(Object.entries(skills).map(([id,s])=>[id,s.toUpperCase()])),devOrder:['evidence','error'],devLabels:{evidence:'Evidencia de una decisión',error:'Revisión del distractor'}};
 registry.regular[guide.id]=metadata;
 registry.guided[guide.id]={...metadata,total:6,skill:Object.fromEntries(Object.entries(metadata.skill).slice(0,6))};
 const shared={id:guide.id,version:VERSION,title:guide.title,objective:guide.objective,explain:guide.explain,steps:guide.steps,model:guide.model,transfer:guide.transfer};
 const sets=guide.texts.map((t,i)=>({title:i===0?'Ejercita · niveles 1, 2 y 3':'Evalúa · aplicación independiente',focus:i===0?'Avanza de la identificación a las relaciones y al juicio con evidencia.':'Resuelve sin pistas de procedimiento. Puedes volver al texto.',texts:[{title:t.title,genre:t.genre,label:`Texto ${i+1}`,paragraphs:t.paragraphs}]}));
 compiled[guide.id]={regular:{...shared,sets,questions},guided:{...shared,sets:[{...sets[0],title:'Lectura acompañada',focus:'Lee, busca una pista y elige. Avanza una pregunta a la vez.',texts:[{...sets[0].texts[0],paragraphs:guide.texts[0].guided}]}],questions:questions.slice(0,6).map((q,i)=>({...q,cue:tasks[guide.texts[0].questions[i][0]]}))}};
}
module.exports={guides,VERSION,KEYS,FEEDBACK,GUIDED_KEYS,GUIDED_FEEDBACK,registry,tasks,skill,publicGuide:(id,guided=false)=>compiled[String(id)]?.[guided?'guided':'regular']};
