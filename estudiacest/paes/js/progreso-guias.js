(function(){
 'use strict';
 let student=null,sequence=0,pendingOnly=false;
 const cards=()=>[...document.querySelectorAll('.ensayo-grid > .ensayo-card')].filter(c=>/^cardGuia\d+$/.test(c.id)||['miniInviernoCard','miniOctubreCard'].includes(c.id));
 const number=c=>c.id==='miniInviernoCard'?'22':c.id==='miniOctubreCard'?'23':c.id.replace('cardGuia','');
 const pending=new Set(['missing','draft','incomplete']);
 function badge(card){let b=card.querySelector('.paes-work-label');if(!b){b=document.createElement('div');b.className='paes-work-label';b.setAttribute('role','status');card.prepend(b);}return b;}
 function filter(){for(const card of cards())card.classList.toggle('paes-filtered-out',pendingOnly&&!(card.dataset.workRequired==='true'&&pending.has(card.dataset.workState)));const toggle=document.getElementById('paesPendingToggle');toggle.setAttribute('aria-pressed',String(pendingOnly));toggle.textContent=pendingOnly?'Ver todas las guías':'Ver solo pendientes';}
 function paint(card,p){
  const b=badge(card),id=number(card),required=p.required===true,count=Number.isInteger(p.answered)&&p.total?`${p.answered}/${p.total} alternativas`:'';
  card.dataset.workState=p.state;card.dataset.workRequired=String(required);b.dataset.state=p.state;
  let label='',detail='';
  if(p.state==='completed'){label='✓ Hecha · Entregada';detail=count;}
  else if(p.state==='incomplete'){label='! Entregada incompleta';detail=count+'. Pide al profe revisar el acceso.';}
  else if(p.state==='draft'){label=p.correction?'↻ Corrección sin entregar':p.answered===p.total?'! Falta entregar':'◷ En progreso';detail=count+(p.correction?' · Ya tenías una entrega anterior.':' · Tu trabajo está guardado.');}
  else if(p.state==='missing'){label=required?'○ Te falta completar':'Guía anterior';detail=required?(count||'Sin trabajo guardado.'):'Sin entrega digital registrada.';}
  else if(p.state==='not-assigned'){label='No se aplica a tu curso';}
  else if(p.state==='review'){label='Consultar al profe';detail='El registro necesita revisión. No se cuenta como deuda.';}
  else{label='Estado sin confirmar';detail='Pulsa Actualizar para volver a consultar.';}
  b.replaceChildren();const strong=document.createElement('strong');strong.textContent=label;b.append(strong);if(detail){const small=document.createElement('small');small.textContent=detail;b.append(small);}
 }
 async function refresh(){
  if(!student)return;const request=++sequence,button=document.getElementById('paesProgressRefresh'),summary=document.getElementById('paesProgressSummary');button.disabled=true;summary.textContent='Consultando tu trabajo guardado…';
  try{
   const session=await PaesStudentSession.restore();if(!session)throw Error('Vuelve a ingresar para consultar tu avance.');
   const response=await fetch('/api/paes?action=student-progress',{headers:{Authorization:'Bearer '+await session.user.getIdToken()},cache:'no-store'});
   if(!response.ok)throw Error('No se pudo confirmar tu avance. Pulsa Actualizar para reintentar.');const data=await response.json();if(request!==sequence)return;
   for(const card of cards())paint(card,data.guides[number(card)]||{state:'unknown'});
   const list=Object.entries(data.guides).filter(([,s])=>s.required),owed=list.filter(([,s])=>pending.has(s.state)).map(([id])=>Number(id)).sort((a,b)=>b-a),done=list.filter(([,s])=>s.state==='completed').length,unknown=list.filter(([,s])=>['unknown','review'].includes(s.state)).length;
   summary.textContent=`Segundo semestre: ${done} hechas · ${owed.length} pendientes.`+(owed.length?' Te faltan por completar o entregar: '+owed.map(n=>'G'+n).join(', ')+'.':unknown?' No hay otras guías pendientes confirmadas.':' No tienes guías pendientes de completar o entregar.')+(unknown?' Hay '+unknown+' estados por confirmar con el profe.':'');
   document.getElementById('paesPendingToggle').disabled=false;filter();
  }catch(error){if(request!==sequence)return;for(const card of cards())paint(card,{state:'unknown'});pendingOnly=false;filter();document.getElementById('paesPendingToggle').disabled=true;summary.textContent=error.message;}
  finally{if(request===sequence)button.disabled=false;}
 }
 window.PaesGuideProgress={load(profile){student=profile;pendingOnly=false;document.getElementById('paesPendingToggle').disabled=true;for(const card of cards()){card.dataset.workState='unknown';card.dataset.workRequired='false';const b=badge(card);b.dataset.state='unknown';b.textContent='Consultando tu avance…';}document.getElementById('paesProgressPanel').hidden=false;filter();refresh();}};
 document.addEventListener('DOMContentLoaded',()=>{document.getElementById('paesProgressRefresh').addEventListener('click',refresh);document.getElementById('paesPendingToggle').addEventListener('click',()=>{pendingOnly=!pendingOnly;filter();});});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&student)refresh();});
})();
