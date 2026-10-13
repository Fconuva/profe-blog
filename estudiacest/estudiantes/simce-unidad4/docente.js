(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const selected=new URLSearchParams(location.search).get('ensayo');if(/^[1-5]$/.test(selected || ''))$('exam').value=selected;
 if(!firebase.apps.length)firebase.initializeApp({apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',authDomain:'estudiacest.firebaseapp.com',projectId:'estudiacest'});
 let user=null,latest=null,requestId=0;
 function p(text,target){const element=document.createElement('p');element.textContent=text;target.append(element);}
 function renderResults(){
  $('results').replaceChildren();const course=$('course').value;
  const results=latest.results.filter(r=>!course || r.curso===course);
  if(!results.length){p('Sin entregas confirmadas para este filtro.',$('results'));return;}
  const totals={};results.forEach(r=>Object.entries(r.bySkill || {}).forEach(([skill,b])=>{const v=totals[skill] ||= {score:0,total:0};v.score+=b.score;v.total+=b.total;}));
  Object.entries(totals).forEach(([skill,b])=>p(`${{LOCALIZAR:'Localizar',INTERPRETAR:'Interpretar y relacionar',REFLEXIONAR:'Reflexionar'}[skill]}: ${b.score}/${b.total} aciertos (${Math.round(b.score/b.total*100)} %).`,$('results')));
  results.forEach(r=>p(`${r.nombre} · ${r.curso}: ${r.score}/${r.total} correctas · ${r.simulatedScore} puntos simulados CEST.`,$('results')));
 }
 async function load(){
  if(!user)return;const id=++requestId;$('status').textContent='Leyendo pauta y resultados…';$('key').replaceChildren();$('results').replaceChildren();
  try{
   const token=await user.getIdToken();const response=await fetch(`/api/estudiantes?action=simce-u4-review&ensayo=${$('exam').value}`,{headers:{Authorization:`Bearer ${token}`}});const data=await response.json();if(!response.ok)throw Error(data.error || 'Acceso no disponible.');if(id!==requestId)return;
   latest=data;$('focus').textContent=data.exam.title;$('review').textContent=data.exam.review.join(' · ');renderResults();
   data.exam.texts.forEach(text=>{const h=document.createElement('h3');h.textContent=`${text.genre}: ${text.title}`;$('key').append(h);text.questions.forEach(q=>{const detail=document.createElement('details'),summary=document.createElement('summary');summary.textContent=`${q.id.slice(1)}. ${q.prompt} — ${q.key}`;detail.append(summary);p(`${q.skill} · ${q.operation} · ${q.demand}`,detail);if(q.demandAudit){const a=q.demandAudit;p(`Fundamento del nivel: ${a.rationale}`,detail);p(`Información ${a.support}; ubicación ${a.distance}; competencia entre ideas ${a.competition}. Estándares, páginas impresas ${a.sourcePages}.`,detail);if(a.assessedSkill!==q.skill)p(`Revisión del eje: esta tarea exige ${a.assessedSkill}; la etiqueta histórica es ${q.skill}. El diagnóstico automático conserva la etiqueta histórica.`,detail);}p(`Evidencia: ${q.evidence}`,detail);q.options.forEach((option,i)=>p(`${'ABCD'[i]}. ${option} — ${q.errors[i]}`,detail));$('key').append(detail);});});
   $('writing').replaceChildren();
   if(data.exam.writtenPractice){const w=data.exam.writtenPractice;p(w.prompt,$('writing'));p(w.format,$('writing'));p(`Qué mide: ${w.criterion}`,$('writing'));p(w.scoring,$('writing'));w.rubric.forEach(r=>p(`${r.points} ${r.points===1?'punto':'puntos'}: ${r.description}`,$('writing')));p(`Evidencias posibles: ${w.evidence.join(' / ')}`,$('writing'));p(w.writingFeedback,$('writing'));p(w.source,$('writing'));}
   $('status').textContent='Pauta y resultados leídos. Acceso docente verificado.';
  }catch(error){if(id===requestId)$('status').textContent=error.message;}
 }
 $('exam').addEventListener('change',load);$('course').addEventListener('change',()=>{if(latest)renderResults();});
 firebase.auth().onAuthStateChanged(value=>{user=value;if(value)load();else $('status').textContent='Inicia sesión con tu cuenta docente en el administrador SIMCE y vuelve a esta página.';});
})();
