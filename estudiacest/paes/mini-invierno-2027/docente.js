(function(){
 'use strict';
 const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let auth,data,busy=false,serverClock=0,localClock=0;const now=()=>serverClock?serverClock+performance.now()-localClock:Date.now();
 const requestedCourse=new URLSearchParams(location.search).get('curso')||'';
 for(const option of $('course').options)if(option.value.replace(/[^0-9A-Z]/gi,'').toUpperCase()===requestedCourse.toUpperCase())$('course').value=option.value;
 async function recoverAdminAuth(){
  const {auth:legacyAuth}=await PaesStudentSession.client(),app=firebase.apps.find(a=>a.name==='estudiacest-admin')||firebase.initializeApp(firebase.app().options,'estudiacest-admin'),adminAuth=app.auth();
  await adminAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  await new Promise((resolve,reject)=>{let unsubscribe=()=>{};unsubscribe=adminAuth.onAuthStateChanged(()=>{unsubscribe();resolve();},reject);});
  return adminAuth.currentUser?adminAuth:legacyAuth.currentUser?legacyAuth:adminAuth;
 }
 async function api(action,body){
  const token=await auth.currentUser.getIdToken(),r=await fetch('/api/paes?action='+action,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})}),d=await r.json();
  if(!r.ok)throw Error(d.error||'No se pudo consultar.');return d;
 }
 const completed=r=>r.submitted===true&&r.completada===true;
 const state=r=>r.resetAt?'Reiniciada':completed(r)?r.endedBy==='strikes'?'Cerrada por strikes':r.endedBy==='time'?'Tiempo agotado':'Completada':'En progreso';
 function remaining(r){if(r.resetAt)return 'Sin comenzar';if(completed(r))return 'Finalizado';if(!r.expiresAt)return 'Sin reloj';const seconds=Math.max(0,Math.ceil((r.expiresAt-now())/1000));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
 function detail(r){
  const summary=r.performance?`PAES referencial: ${r.performance.paesEstimate.points} puntos (${r.performance.correct}/${r.performance.total} aciertos). Proyección CEST a ${r.performance.paesEstimate.equivalentCorrect}/60; no es puntaje oficial ni predicción.\n`:'';
  $('detail').hidden=false;
  $('detail').textContent=`${r.nombre} · ${r.curso}\n${state(r)}\n${summary}Strikes activos: ${r.strikes||0}\n${Object.values(r.incidents||{}).map(e=>`${new Date(e.at).toLocaleString('es-CL',{timeZone:'America/Santiago'})} · ${e.reason}`).join('\n')}\n\nCorrecciones docentes:\n${Object.values(r.strikeAdjustments||{}).map(a=>`${new Date(a.at).toLocaleString('es-CL',{timeZone:'America/Santiago'})} · ${a.strikes} strikes quitados · ${a.reason}`).join('\n')||'Sin correcciones.'}\n\nVersión: ${r.version||'Sin versión'}\nRespuestas: ${JSON.stringify(r.answers||{})}\n\nPauta de este intento:\n${(r.review||[]).map(q=>q.id+': '+q.text+'\n'+q.options.map((o,i)=>'ABCD'[i]+'. '+o).join('\n')+'\nClave '+q.key+' | '+q.reason).join('\n\n')}\n\nReflexiones opcionales:\n${Object.entries(r.reflection||{}).map(([k,v])=>k+': '+v).join('\n')}\n${r.archivedAttempt?'\nIntento anterior conservado: '+JSON.stringify(r.archivedAttempt):''}`;
 }
 function render(){
  const course=$('course').value,all=data.rows.filter(r=>r.curso===course),query=$('search').value.trim().toLocaleLowerCase('es-CL'),filter=$('statusFilter').value;
  const rows=all.filter(r=>(!query||String(r.nombre||'').toLocaleLowerCase('es-CL').includes(query))&&(!filter||filter==='active'&&!completed(r)&&!r.resetAt||filter==='strikes'&&(r.strikes||0)>0||filter==='closed-strikes'&&completed(r)&&r.endedBy==='strikes'||filter==='done'&&completed(r)));
  $('publication').textContent=data.publication.cursos?.[course]?'Pauta publicada.':'Pauta privada; cada estudiante ve su resumen al entregar.';
  $('courseSummary').textContent=`${all.length} intentos · ${all.filter(completed).length} finalizados · ${all.filter(r=>(r.strikes||0)>0).length} con strikes activos`;
  $('rows').innerHTML=rows.length?rows.map((r,i)=>`<tr><td>${esc(r.nombre)}</td><td>${state(r)}</td><td>${r.performance?`${r.performance.correct}/${r.performance.total}`:'Pendiente'}</td><td>${r.performance?`${r.performance.paesEstimate.points} puntos`:'Pendiente'}</td><td>${r.strikes||0}/3</td><td data-remaining="${r.expiresAt||0}" data-finished="${completed(r)||Boolean(r.resetAt)}">${remaining(r)}</td><td><div class="row-actions"><button type="button" data-detail="${i}">Ver</button><button type="button" data-clear-strikes="${i}" ${r.resetAt||!(r.strikes||0)?'disabled':''}>Quitar strikes</button><button type="button" data-reset="${i}">Reiniciar desde cero</button></div></td></tr>`).join(''):'<tr><td colspan="7">Sin intentos que coincidan con estos filtros.</td></tr>';
  document.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>detail(rows[Number(b.dataset.detail)]));
  document.querySelectorAll('[data-clear-strikes]').forEach(b=>b.onclick=()=>perform(async()=>{
   const r=rows[Number(b.dataset.clearStrikes)],reason=prompt('Motivo para quitar los strikes (3 a 240 caracteres). Se conservan las respuestas guardadas y el reloj. Si cerró por strikes y queda tiempo, podrá continuar.');
   if(reason===null)return;if(reason.trim().length<3||reason.trim().length>240)throw Error('Escribe un motivo de 3 a 240 caracteres.');
   const requestId=crypto.randomUUID();await api('admin-mini-clear-strikes',{uid:r.uid,sessionId:r.sessionId,integrityEpoch:r.integrityEpoch||0,requestId,reason:reason.trim()});
   await refresh();const saved=data.rows.find(x=>x.uid===r.uid&&x.sessionId===r.sessionId);
   if(!saved?.strikeAdjustments?.[requestId])throw Error('La corrección no está confirmada. Actualiza el panel.');
   detail(saved);$('adminStatus').textContent=completed(saved)?'Corrección confirmada. Las respuestas y el resultado se conservan; la entrega permanece finalizada.':'Corrección confirmada. Respuestas y reloj conservados. El estudiante debe recargar para continuar.';
  }));
  document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>perform(async()=>{
   const r=rows[Number(b.dataset.reset)];if(!confirm('¿Reiniciar desde cero? El intento actual se archiva y el estudiante comenzará sin respuestas, con un reloj nuevo. Para conservar su trabajo, usa Quitar strikes.'))return;
   await api('admin-mini-reset',{uid:r.uid,sessionId:r.sessionId});await refresh();
  }));
  document.querySelectorAll('[data-detail],[data-clear-strikes],[data-reset]').forEach(b=>b.disabled=b.disabled||busy);
 }
 async function refresh(){data=await api('admin-mini-list');serverClock=data.serverNow;localClock=performance.now();$('keys').textContent=Object.entries(data.keys).map(([g,qs])=>`${g==='regular'?'Recorrido completo':'Recorrido con apoyo'}\n\n`+qs.map(q=>`${q.id}. ${q.text}\n${q.options.map((o,i)=>'ABCD'[i]+'. '+o).join('\n')}\n${q.skill} · Tarea ${q.task}\nClave ${q.key}: ${q.reason}\nEvidencia: ${q.evidence}\n${q.failures.map((f,i)=>f?'ABCD'[i]+': '+f:'').filter(Boolean).join('\n')}`).join('\n\n')).join('\n\n');$('privatePanel').hidden=false;$('adminLogin').hidden=true;$('adminStatus').textContent='Panel actualizado';render();}
 async function perform(fn){if(busy)return;busy=true;if(data)render();try{await fn();}catch(e){$('adminStatus').textContent=e.message;}finally{busy=false;if(data)render();}}
 $('adminLogin').onsubmit=e=>{e.preventDefault();perform(async()=>{auth=await recoverAdminAuth();await auth.signInWithEmailAndPassword($('email').value,$('adminPassword').value);$('adminPassword').value='';await refresh();});};
 for(const id of ['course','statusFilter'])$(id).onchange=()=>{if(data)render();};$('search').oninput=()=>{if(data)render();};$('refresh').onclick=()=>perform(refresh);
 for(const [id,published]of [['publish',true],['hideResults',false]])$(id).onclick=()=>perform(async()=>{await api('admin-mini-release',{curso:$('course').value,published});await refresh();});
 setInterval(()=>document.querySelectorAll('[data-remaining]').forEach(el=>{if(el.dataset.finished==='true'||!Number(el.dataset.remaining))return;const seconds=Math.max(0,Math.ceil((Number(el.dataset.remaining)-now())/1000));el.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}),1000);
 perform(async()=>{auth=await recoverAdminAuth();if(auth.currentUser)await refresh();});
})();
