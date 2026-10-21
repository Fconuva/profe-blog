(() => {
 'use strict';
 const number=new URLSearchParams(location.search).get('ensayo') || '1';
 const SESSION_ID=`sesion-u4-${number}`;
 const path=`/estudiantes/simce-unidad4/?ensayo=${encodeURIComponent(number)}`;
 const $=id=>document.getElementById(id);
 let user=null,activity=null,answers={},submitted=false,submitting=false,working=false,reopenedAt=0;
 let saveTimer=null, saveQueue = Promise.resolve();
 const config={apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',authDomain:'estudiacest.firebaseapp.com',databaseURL:'https://estudiacest-default-rtdb.firebaseio.com',projectId:'estudiacest',appId:'1:999002169815:web:51203237bc77c2e74deb92'};
 if (!firebase.apps.length) firebase.initializeApp(config);
 const auth=firebase.auth(),db=firebase.database();
 if(typeof initStudentForcedRefresh==='function') initStudentForcedRefresh({auth,db,base:'plataforma_estudiantes'});
 function message(text){$('saveState').textContent=text;}
 const localKey=()=>`${SESSION_ID}-${user.uid}-draft`;
 function remember(){if(submitted)return;try{localStorage.setItem(localKey(),JSON.stringify({answers,reopenedAt,savedAt:Date.now()}));}catch(_){}}
 function clearLocal(){try{localStorage.removeItem(localKey());}catch(_){}}
 function controls(disabled){document.querySelectorAll('#readings input').forEach(el=>{el.disabled=disabled;});$('submit').disabled=disabled;}
 function update(){const questions=activity.texts.flatMap(t=>t.questions),count=questions.filter(q=>answers[q.id]).length;$('progressText').textContent=count+'/'+questions.length+' preguntas';$('progressFill').max=questions.length;$('progressFill').value=count;$('activitySummary').textContent=activity.texts.length+' textos · '+questions.length+' preguntas';}
 async function api(action,method='GET',body=null){
  const token=await user.getIdToken();
  const response=await fetch(`/api/estudiantes?action=${action}&ensayo=${number}`,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
  const json=await response.json().catch(()=>({}));
  if(!response.ok)throw Object.assign(new Error(json.error || 'No fue posible conectar.'),{status:response.status});
  return json;
 }
 function paragraph(text,container){const p=document.createElement('p');p.textContent=text;container.append(p);}
 function render(){
  $('readings').replaceChildren();
  activity.texts.forEach((text,index)=>{
   const block=document.createElement('article');block.className='reading';
   const heading=document.createElement('h2');heading.textContent=`Texto ${index+1}. ${text.title}`;block.append(heading);
   const body=document.createElement('div');body.className='text-body';text.paragraphs.forEach(p=>paragraph(p,body));block.append(body);
   if(text.table){const wrap=document.createElement('div');wrap.className='table-wrap';const table=document.createElement('table');const caption=document.createElement('caption');caption.className='table-caption';caption.textContent=text.table.caption;table.append(caption);const head=document.createElement('thead'),row=document.createElement('tr');text.table.headers.forEach(value=>{const cell=document.createElement('th');cell.scope='col';cell.textContent=value;row.append(cell);});head.append(row);table.append(head);const tbody=document.createElement('tbody');text.table.rows.forEach(values=>{const r=document.createElement('tr');values.forEach(value=>{const c=document.createElement('td');c.textContent=value;r.append(c);});tbody.append(r);});table.append(tbody);wrap.append(table);block.append(wrap);}
   const source=document.createElement('p');source.className='source';source.textContent=text.source;block.append(source);
   text.questions.forEach(q=>{const field=document.createElement('fieldset');field.className='question';field.id=q.id;const legend=document.createElement('legend');legend.textContent=`${q.id.slice(1)}. ${q.prompt}`;field.append(legend);const options=document.createElement('div');options.className='options';q.options.forEach((value,i)=>{const label=document.createElement('label');label.className='option';const input=document.createElement('input');input.type='radio';input.name=q.id;input.value='ABCD'[i];input.checked=answers[q.id]===input.value;input.addEventListener('change',()=>{answers[q.id]=input.value;scheduleSave();});const span=document.createElement('span');span.textContent=`${input.value}. ${value}`;label.append(input,span);options.append(label);});field.append(options);block.append(field);});$('readings').append(block);
  });update();
 }
 async function refresh(){
  const state=await api('simce-u4-state');
  $('identity').textContent=`${state.student.nombre} · ${state.student.curso}`;
  $('title').textContent=state.session.title || 'Miniensayo de lectura';
  submitted=state.attempt?.submitted === true && state.attempt?.completada === true;
  reopenedAt=Number(state.attempt?.reopenedAt || 0);
  answers={...(state.attempt?.answers || {})};activity=state.exam;
  if(!activity){$('intro').hidden=true;$('work').hidden=true;message('Este miniensayo está cerrado. Puedes volver a tu panel.');return state;}
  let local=null;try{local=JSON.parse(localStorage.getItem(localKey()) || 'null');}catch(_){}
  if(!submitted && local && Number(local.reopenedAt || 0)===reopenedAt && Number(local.savedAt)>Number(state.attempt?.updatedAt || 0))answers={...local.answers};
  render();
  if(submitted){showResult(state.result);clearLocal();}
  else if(state.session.active){$('intro').hidden=working;$('work').hidden=!working;message('Actividad disponible.');}
  else{$('intro').hidden=true;$('work').hidden=true;message('Este miniensayo está cerrado. Tu avance se conserva.');}
  return state;
 }
 function showResult(result){
  submitted=true;working=false;controls(true);$('intro').hidden=true;$('work').hidden=true;$('result').hidden=false;
  $('readings').classList.remove('active');$('correct').textContent=`${result.score} de ${result.total} correctas`;
  $('simulated').textContent=`${result.simulatedScore} puntos simulados`;message('Entrega confirmada.');
 }
 function scheduleSave(){
  if(submitted||submitting||!working)return;remember();update();clearTimeout(saveTimer);message('Guardando avance…');
  saveTimer=setTimeout(()=>{const payload={answers:{...answers},reopenedAt};saveQueue=saveQueue.catch(()=>null).then(()=>api('simce-u4-save','POST',payload)).then(()=>message('Avance guardado.')).catch(async error=>{if(error.status===409){await refresh().catch(()=>null);}else message(`${error.message} Tu avance sigue en este dispositivo. Puedes reintentar al entregar.`);});},600);
 }
 $('begin').addEventListener('click',async()=>{
  $('begin').disabled=true;
  try{await api('simce-u4-save','POST',{answers:{...answers},reopenedAt});working=true;$('intro').hidden=true;$('work').hidden=false;$('readings').classList.add('active');message('Avance guardado.');$('progressText').scrollIntoView();}
  catch(error){message(error.message);}finally{$('begin').disabled=false;}
 });
 $('submit').addEventListener('click',async()=>{
  if(submitted||submitting)return;
  const missing=activity.texts.flatMap(t=>t.questions).filter(q=>!answers[q.id]);
  if(missing.length){message(`Faltan ${missing.length} preguntas. Responde la ${missing[0].id.slice(1)} para continuar.`);$(missing[0].id).scrollIntoView({block:'center'});$(missing[0].id).querySelector('input').focus({preventScroll:true});return;}
  submitting=true;controls(true);clearTimeout(saveTimer);remember();message('Confirmando entrega…');
  try{
   await saveQueue;
   if(submitted)return;
   await api('simce-u4-submit','POST',{answers:{...answers},reopenedAt});
   const confirmation=await api('simce-u4-state');
   if(!confirmation.attempt || confirmation.attempt.completada !== true || confirmation.attempt.submitted !== true || !confirmation.result)throw new Error('La plataforma aún no confirma la entrega. Vuelve a intentarlo.');
   showResult(confirmation.result);clearLocal();$('confirmationModal').hidden=false;$('seeResult').focus();
  }catch(error){
   if(error.status===409){await refresh().catch(()=>message('No pudimos leer la entrega. Vuelve a intentarlo.'));}
   else message(`${error.message} Tu avance se conserva. Vuelve a pulsar Entregar.`);
  }finally{submitting=false;if(!submitted)controls(false);}
 });
 function closeModal(){if($('confirmationModal').hidden)return;$('confirmationModal').hidden=true;$('result').focus();}
 $('seeResult').addEventListener('click',closeModal);
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal();});
 const blocked=event=>{if(working&&!submitted){event.preventDefault();message('Trabaja con la lectura en pantalla. La copia está bloqueada.');}};
 ['copy','cut','paste','contextmenu','dragstart','selectstart'].forEach(name=>document.addEventListener(name,blocked,true));
 document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&['a','c','x','v','p','s'].includes(event.key.toLowerCase()))blocked(event);},true);
 window.addEventListener('beforeunload',()=>{if(user&&working)remember();});
 auth.onAuthStateChanged(async value=>{
  if(!value){location.replace(`/lecturas/?next=${encodeURIComponent(path)}`);return;}user=value;
  try{await refresh();const telemetry=document.createElement('script');telemetry.src='/estudiantes/js/work-telemetry.js';telemetry.dataset.session=SESSION_ID;document.body.append(telemetry);}
  catch(error){message(`${error.message} Recarga la página para reintentar.`);}
 });
})();
