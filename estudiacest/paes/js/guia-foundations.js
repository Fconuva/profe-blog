'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const GUIDE_ID = document.body.dataset.guide;
  const GUIDED = document.body.dataset.mode === 'guided';
  let guidedIndex=0;
  const cleanRut = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  let QUESTIONS = [], student = null, activity, local = null, isSubmitted = false, submitting = false;
  let saveQueue = Promise.resolve(), draftTimer;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fresh = () => ({answers:{},dev:{},flags:{},startedAt:Date.now(),updatedAt:0,submitted:false});
  const localKey = () => `paes_foundations_v1_g${GUIDE_ID}_${GUIDED?'guided':'regular'}_${student.rut}`;
  function store() { try { localStorage.setItem(localKey(), JSON.stringify(local)); } catch (_) { status('Almacenamiento local no disponible', true); } }
  function status(message, error = false) { $('savedState').textContent = message; $('savedState').classList.toggle('error', error); }
  function validRut(value) { const c=cleanRut(value);if(!/^\d{7,8}[\dK]$/.test(c))return false;let sum=0,m=2;for(let i=c.length-2;i>=0;i--){sum+=Number(c[i])*m;m=m===7?2:m+1}const n=11-sum%11;return c.slice(-1)===(n===11?'0':n===10?'K':String(n)); }
  function switchTab(number, target) {
    document.querySelectorAll('.panel').forEach(el => el.hidden = el.id !== `panel-${number}`);
    document.querySelectorAll('[data-tab]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.tab === String(number))));
    if(target) $(target).scrollIntoView({block:'start'}); else $('session').scrollIntoView({block:'start'});
  }
  function renderText(text) {
    return `<article class="reading"><p class="eyebrow">${escape(text.label)} · ${escape(text.genre)}</p><h3>${escape(text.title)}</h3>${text.paragraphs.map((paragraph,index)=>`<p><span class="pn">${index+1}</span>${escape(paragraph)}</p>`).join('')}<p class="source">Texto original elaborado para esta actividad.</p></article>`;
  }
  function render() {
    $('readingPanels').innerHTML = activity.sets.map((set,index) => {
      const n=index+1;
      const questions=QUESTIONS.filter(question=>question.set===n);
      return `<section class="panel" id="panel-${n}" ${n===1?'':'hidden'}><header class="pair-head"><p class="eyebrow">${GUIDED?'Lectura acompañada':'Texto '+n}</p><h2>${escape(set.title)}</h2><p>${escape(set.focus)}</p></header><div class="pair-grid">${set.texts.map(renderText).join('')}</div><div class="questions">${questions.map(question=>`<article class="question" id="question-${question.n}" data-q="${question.n}"><h3><span class="qnum">${question.n}.</span>${escape(question.text)}</h3>${question.level?`<p class="level">${GUIDED?'Paso a paso':'Nivel '+question.level}: ${escape(question.cue)}</p>`:''}<div role="group" aria-label="Pregunta ${question.n}">${Object.entries(question.opts).map(([letter,value])=>`<button type="button" class="option" data-letter="${letter}" aria-pressed="false"><span class="letter">${letter}</span><span>${escape(value)}</span></button>`).join('')}</div><button type="button" class="flag" aria-pressed="false">Marcar para revisar</button><p class="feedback" id="feedback-${question.n}" hidden></p></article>`).join('')}</div><div class="next-row"><button type="button" data-next="${n===activity.sets.length?4:n+1}">${n===activity.sets.length?'Revisión y entrega':'Evaluación independiente'}</button></div></section>`;
    }).join('');
    document.querySelectorAll('.option').forEach(button=>button.addEventListener('click',()=>{if(isSubmitted||submitting)return;local.answers[button.closest('.question').dataset.q]=button.dataset.letter;changed();}));
    document.querySelectorAll('.flag').forEach(button=>button.addEventListener('click',()=>{if(isSubmitted||submitting)return;const id=button.closest('.question').dataset.q;local.flags[id]=!local.flags[id];changed();}));
    document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.next)));
  }
  function paint() {
    document.querySelectorAll('[data-dev]').forEach(el=>{el.disabled=isSubmitted||submitting;});
    document.querySelectorAll('.question').forEach(question=>{question.querySelectorAll('.option').forEach(button=>{button.setAttribute('aria-pressed',String(local.answers[question.dataset.q]===button.dataset.letter));button.disabled=isSubmitted||submitting;});const flag=question.querySelector('.flag');flag.setAttribute('aria-pressed',String(Boolean(local.flags[question.dataset.q])));flag.textContent=local.flags[question.dataset.q]?'* Para revisar':'Marcar para revisar';flag.disabled=isSubmitted||submitting;});
    const count=QUESTIONS.filter(question=>local.answers[question.n]).length;$('progress').value=count;$('answeredInfo').textContent=`${count} de ${QUESTIONS.length} marcadas`;
    $('answerMap').innerHTML=QUESTIONS.map(question=>`<button type="button" class="${local.answers[question.n]?'answered':''}" data-jump="${question.n}" aria-label="Pregunta ${question.n}, ${local.answers[question.n]?'respuesta '+local.answers[question.n]:'sin respuesta'}${local.flags[question.n]?', para revisar':''}">${question.n}${local.answers[question.n]?' · '+local.answers[question.n]:''}${local.flags[question.n]?' *':''}</button>`).join('');
    $('answerMap').querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{const question=QUESTIONS.find(item=>item.n===Number(button.dataset.jump));if(GUIDED){guidedIndex=QUESTIONS.indexOf(question);paintGuided();}switchTab(question.set,`question-${question.n}`);}));
  }
  function changed() { local.updatedAt=Date.now();store();paint();clearTimeout(draftTimer);status('Cambios pendientes');draftTimer=setTimeout(saveDraft,650); }
  function payload(draft) { return {rut:student.rut,nombre:student.nombre,curso:student.curso,guiaId:GUIDE_ID,contentVersion:activity.version,answers:{...local.answers},dev:{...local.dev,review_flags:JSON.stringify(local.flags),started_at:String(local.startedAt)},draft,score:0,total:QUESTIONS.length}; }
  async function request(action, body) { const response=await fetch(`/api/paes?action=${action}`,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:undefined);const data=await response.json();if(!response.ok){const error=new Error(data.error||'No se pudo conectar con el servidor');error.status=response.status;throw error;}return data; }
  async function fetchState() { return request(`get-guia-state&guiaId=${GUIDE_ID}&rut=${encodeURIComponent(student.rut)}`); }
  function applyState(data) {
    const attempt=data.attempt;
    $('resultBox').hidden=true;document.querySelectorAll('.feedback').forEach(el=>el.hidden=true);document.querySelectorAll('.correct,.wrong').forEach(el=>el.classList.remove('correct','wrong'));
    if(attempt){const sent=attempt.completada===true&&attempt.submitted===true;if(sent||Number(attempt.lastSavedAt)>Number(local.updatedAt)){local.answers=attempt.answers||{};local.dev=attempt.dev||{};try{local.flags=JSON.parse(local.dev.review_flags||'{}');}catch(_){local.flags={};}local.updatedAt=attempt.lastSavedAt||0;}isSubmitted=sent;local.submitted=sent;}
    else if(local.submitted){local=fresh();isSubmitted=false;}
    document.querySelectorAll('[data-dev]').forEach(el=>{el.value=local.dev[el.dataset.dev]||'';el.disabled=isSubmitted;});store();paint();
    if(isSubmitted){$('submit').disabled=true;$('submit').textContent='Guía entregada';$('deliveryConfirmation').hidden=false;$('sendStatus').textContent='Entrega registrada.';status('Entrega confirmada');}
    if(data.released&&attempt?.result&&data.answerKey){$('resultBox').hidden=false;renderSummary(data.answerKey);$('transfer').textContent=activity.transfer;$('resultScore').textContent=`${attempt.result.correct} / ${attempt.result.total}`;Object.entries(data.answerKey).forEach(([id,letter])=>{const question=$(`question-${id}`);if(!question)return;question.querySelectorAll('.option').forEach(button=>{button.classList.toggle('correct',button.dataset.letter===letter);button.classList.toggle('wrong',button.dataset.letter===local.answers[id]&&button.dataset.letter!==letter);});const feedback=$(`feedback-${id}`);feedback.textContent=data.feedback?.[id]||'';feedback.hidden=!feedback.textContent;});}
  }
  async function saveDraft() {
    if(!student||isSubmitted||submitting)return;
    const snapshot=payload(true);status('Guardando…');
    saveQueue=saveQueue.catch(()=>{}).then(async()=>{if(isSubmitted)return;try{await request('submit-guia',snapshot);status('Guardado en línea');}catch(error){if(error.status===409){applyState(await fetchState());return;}throw error;}});
    try{await saveQueue;}catch(_){status('Sin conexión · avance conservado',true);}
  }
  async function submitGuide() {
    if(!student||isSubmitted||submitting)return;submitting=true;clearTimeout(draftTimer);paint();$('submit').disabled=true;$('submit').textContent='Entregando…';$('sendStatus').textContent='Confirmando registro…';
    try{await saveQueue.catch(()=>{});try{await request('submit-guia',payload(false));}catch(error){if(error.status!==409)throw error;}const readback=await fetchState();if(!readback.attempt||readback.attempt.completada!==true||readback.attempt.submitted!==true)throw new Error('La entrega aún no está confirmada. Reintenta.');Object.assign(local,{submitted:true,completada:true,submittedAt:readback.attempt.submittedAt,completadaAt:readback.attempt.completadaAt});applyState(readback);$('confirmDialog').hidden=false;$('closeDialog').focus();}
    catch(error){$('sendStatus').textContent=`No se confirmó la entrega: ${error.message}`;status('Avance conservado. Puedes reintentar.',true);$('submit').disabled=false;$('submit').textContent=`Entregar Guía ${GUIDE_ID}`;}
    finally{submitting=false;paint();}
  }
  async function login(event) {
    event.preventDefault();const button=event.submitter;button.disabled=true;$('errorBox').textContent='';
    try{const rut=cleanRut($('rutInput').value);if(!validRut(rut))throw new Error('Revisa el RUT y su dígito verificador.');let roster=typeof NOMINAS_PAES!=='undefined'?[...NOMINAS_PAES]:[];try{const extra=await request('get-nomina-extra');roster=roster.concat(extra.nomina_extra||[]);}catch(_){}const found=roster.find(record=>cleanRut(record.rut)===rut);if(!found)throw new Error('RUT no encontrado en la nómina PAES.');student={rut,nombre:found.nombre,curso:found.curso};const content=await request(`get-foundation&guiaId=${GUIDE_ID}&rut=${encodeURIComponent(rut)}&mode=${GUIDED?'guided':'regular'}`);if(content.redirect){location.href=content.redirect;return;}activity=content.activity;QUESTIONS=activity.questions;render();renderMethod();if(GUIDED)setupGuided();sessionStorage.setItem('paes_student',JSON.stringify(student));if(window.checkGuiaAccess&&!(await window.checkGuiaAccess(rut)))return;try{local=JSON.parse(localStorage.getItem(localKey())||'null');}catch(_){local=null;}local={...fresh(),...(local||{})};local.answers=local.answers||{};local.dev=local.dev||{};local.flags=local.flags||{};const data=await fetchState();applyState(data);$('studentName').textContent=student.nombre;$('studentCourse').textContent=student.curso;$('loginSection').hidden=true;$('session').hidden=false;if(!isSubmitted)status('Avance recuperado');}
    catch(error){$('errorBox').textContent=error.message;}finally{button.disabled=false;}
  }
  $('loginForm').addEventListener('submit',login);$('submit').addEventListener('click',submitGuide);
  $('closeDialog').addEventListener('click',()=>{$('confirmDialog').hidden=true;$('deliveryConfirmation').scrollIntoView();});
  $('confirmDialog').addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();$('closeDialog').focus();}if(event.key==='Escape')$('closeDialog').click();});
  document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.tab)));
  document.querySelectorAll('[data-dev]').forEach(el=>el.addEventListener('input',()=>{if(!student||isSubmitted||submitting)return;local.dev[el.dataset.dev]=el.value;changed();}));
  window.addEventListener('beforeunload',event=>{if(student&&!isSubmitted){store();if(submitting||$('savedState').textContent==='Cambios pendientes'||$('savedState').textContent==='Guardando…'){event.preventDefault();event.returnValue='';}}});

  function renderMethod(){ $('method').innerHTML='<p>'+escape(activity.explain)+'</p><ol>'+activity.steps.map(s=>'<li>'+escape(s)+'</li>').join('')+'</ol><h3>Observa cómo se decide</h3><blockquote>'+escape(activity.model.text)+'</blockquote><p>'+escape(activity.model.question)+'</p><p>'+escape(activity.model.answer)+'</p>'; }
  function renderSummary(key){ const cfg=window.PAES_FOUNDATIONS_REGISTRY[GUIDED?'guided':'regular'][GUIDE_ID];const groups=GUIDED?[['Lectura acompañada',QUESTIONS]]:[['Práctica con apoyo',QUESTIONS.slice(0,6)],['Evaluación independiente',QUESTIONS.slice(6)]];$('skillSummary').innerHTML=groups.map(([label,qs])=>'<h3>'+label+'</h3>'+['Localizar','Interpretar','Evaluar'].map(s=>{const items=qs.filter(q=>cfg.skill[q.n]===s.toUpperCase());return items.length?'<p>'+s+': '+items.filter(q=>local.answers[q.n]===key[q.n]).length+' / '+items.length+'</p>':'';}).join('')).join(''); }
  function paintGuided(){document.querySelectorAll('.question').forEach((el,i)=>el.hidden=i!==guidedIndex);$('guidedPosition').textContent='Pregunta '+(guidedIndex+1)+' de '+QUESTIONS.length;$('guidedPrev').disabled=guidedIndex===0;$('guidedNext').disabled=guidedIndex===QUESTIONS.length-1;}
  function setupGuided(){const box=document.createElement('div');box.className='guided-nav';box.innerHTML='<button id="guidedPrev" type="button">Anterior</button><span id="guidedPosition" role="status" aria-live="polite"></span><button id="guidedNext" type="button">Siguiente</button><button id="readAloud" type="button">Escuchar texto y pregunta</button><button id="stopAloud" type="button">Detener audio</button>';document.querySelector('.questions').before(box);$('guidedPrev').onclick=()=>{guidedIndex--;paintGuided();};$('guidedNext').onclick=()=>{guidedIndex++;paintGuided();};$('readAloud').disabled=!(window.speechSynthesis&&window.SpeechSynthesisUtterance);$('readAloud').onclick=()=>{speechSynthesis.cancel();const q=QUESTIONS[guidedIndex];const u=new SpeechSynthesisUtterance(activity.sets[0].texts[0].paragraphs.join(' ')+'. '+q.text+'. '+Object.entries(q.opts).map(([k,v])=>k+': '+v).join('. '));u.lang='es-CL';u.rate=.85;speechSynthesis.speak(u);};$('stopAloud').onclick=()=>window.speechSynthesis?.cancel();paintGuided();}
})();
