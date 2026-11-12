'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const GUIDE_ID = '30';
  const cleanRut = value => String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  let QUESTIONS = [], student = null, activity, local = null, isSubmitted = false, submitting = false;
  let saveQueue = Promise.resolve(), draftTimer;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fresh = () => ({answers:{},dev:{},flags:{},startedAt:Date.now(),updatedAt:0,submitted:false});
  const localKey = () => `paes_g30_${student.rut}`;
  function store() { try { localStorage.setItem(localKey(), JSON.stringify(local)); } catch (_) { status('Almacenamiento local no disponible', true); } }
  function status(message, error = false) { $('savedState').textContent = message; $('savedState').classList.toggle('error', error); }
  function validRut(value) { const c=cleanRut(value); if(!/^\d{7,8}[\dK]$/.test(c))return false; let sum=0,m=2;for(let i=c.length-2;i>=0;i--){sum+=Number(c[i])*m;m=m===7?2:m+1}const n=11-sum%11;return c.slice(-1)===(n===11?'0':n===10?'K':String(n)); }
  function switchTab(number, target) {
    document.querySelectorAll('.panel').forEach(el => el.hidden = el.id !== `panel-${number}`);
    document.querySelectorAll('[data-tab]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.tab === String(number))));
    if(target) $(target).scrollIntoView({block:'start'}); else $('session').scrollIntoView({block:'start'});
  }
  function render() {
    // 12-nov: la guía pasó de 4 a 10 contenidos. Las pestañas salen de los datos y el panel de
    // revisión deja de usar un id numérico, que chocaba con el contenido 5.
    const tabs=document.querySelector('.tabs');
    tabs.innerHTML=activity.texts.map((text,index)=>`<button type="button" data-tab="${index+1}" aria-pressed="${index===0}">${index+1} · ${escape(text.tab||text.content)}</button>`).join('')+'<button type="button" class="tab-entrega" data-tab="entrega" aria-pressed="false">Revisión y entrega</button>';
    tabs.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
    $('answerMap').closest('.panel').id='panel-entrega';
    $('progress').max=QUESTIONS.length;$('answerMap').setAttribute('aria-label',`Estado de las ${QUESTIONS.length} preguntas`);
    $('readingPanels').innerHTML = activity.texts.map((text,index) => {
      const n=index+1, review=text.review;
      const repaso=`<section class="repaso" aria-labelledby="repaso-${n}"><p class="eyebrow">Paso 1 · Repasa el contenido</p><h2 id="repaso-${n}">${escape(text.content)}</h2><p>${escape(review.intro)}</p><div class="repaso-grid">${review.images.map(image=>`<figure><a href="${escape(image.src)}" target="_blank" rel="noopener"><img src="${escape(image.src)}" alt="${escape(image.alt)}" width="880" height="1168" loading="lazy"></a><figcaption><a href="${escape(image.src)}" target="_blank" rel="noopener">Ver la infografía en grande</a></figcaption></figure>`).join('')}</div><h3>Lo esencial</h3><dl>${review.essentials.map(([term,meaning])=>`<dt>${escape(term)}</dt><dd>${escape(meaning)}</dd>`).join('')}</dl><p class="clave">${escape(review.recuerda)}</p></section>`;
      const paragraphs=text.paragraphs.map((p,i)=>text.labels?`<p class="fragmento"><strong>${escape(text.labels[i])}</strong>${escape(p)}</p>`:`<p><span class="pn">${i+1}</span>${escape(p)}</p>`).join('');
      const questions=QUESTIONS.filter(q=>q.texto===n).map(q=>`<article class="question" id="question-${q.n}" data-q="${q.n}"><h3><span class="qnum">${q.n}.</span>${escape(q.text)}</h3><div role="group" aria-label="Pregunta ${q.n}">${Object.entries(q.opts).map(([letter,value])=>`<button type="button" class="option" data-letter="${letter}" aria-pressed="false"><span class="letter">${letter}</span><span>${escape(value)}</span></button>`).join('')}</div><button type="button" class="flag" aria-pressed="false">Marcar para revisar</button>${(q.open||[]).map(item=>`<label class="reflection" for="${escape(item.id)}">${escape(item.label)}<textarea id="${escape(item.id)}" maxlength="500" data-dev="${escape(item.id)}"></textarea></label>`).join('')}<p class="feedback" id="feedback-${q.n}" hidden></p></article>`).join('');
      return `<section class="panel" id="panel-${n}" ${n===1?'':'hidden'}>${repaso}<p class="eyebrow paso2">Paso 2 · Aplica el contenido en la lectura</p><div class="reading-layout"><article class="reading"><p class="eyebrow">Lectura ${n} · ${escape(text.genre)}</p><h2>${escape(text.title)}</h2>${paragraphs}<p class="source">${escape(text.source)}</p></article><div class="questions">${questions}</div></div><div class="next-row"><button type="button" data-next="${n===activity.texts.length?'entrega':n+1}">${n===activity.texts.length?'Revisión y entrega':'Siguiente contenido'}</button></div></section>`;
    }).join('');
    document.querySelectorAll('.option').forEach(button=>button.addEventListener('click',()=>{if(isSubmitted||submitting)return;local.answers[button.closest('.question').dataset.q]=button.dataset.letter;changed();}));
    document.querySelectorAll('.flag').forEach(button=>button.addEventListener('click',()=>{if(isSubmitted||submitting)return;const id=button.closest('.question').dataset.q;local.flags[id]=!local.flags[id];changed();}));
    document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.next)));
    $('readingPanels').querySelectorAll('[data-dev]').forEach(bindDev);
  }
  function bindDev(el) {el.addEventListener('input',()=>{if(!student||isSubmitted||submitting)return;local.dev[el.dataset.dev]=el.value;changed();});}
  function paint() {
    document.querySelectorAll('[data-dev]').forEach(el=>{el.disabled=isSubmitted||submitting;});
    document.querySelectorAll('.question').forEach(q=>{q.querySelectorAll('.option').forEach(b=>{b.setAttribute('aria-pressed',String(local.answers[q.dataset.q]===b.dataset.letter));b.disabled=isSubmitted||submitting;});const flag=q.querySelector('.flag');flag.setAttribute('aria-pressed',String(Boolean(local.flags[q.dataset.q])));flag.textContent=local.flags[q.dataset.q]?'* Para revisar':'Marcar para revisar';flag.disabled=isSubmitted||submitting;});
    const count=QUESTIONS.filter(q=>local.answers[q.n]).length;$('progress').value=count;$('answeredInfo').textContent=`${count} de ${QUESTIONS.length} marcadas`;
    $('answerMap').innerHTML=QUESTIONS.map(q=>`<button type="button" class="${local.answers[q.n]?'answered':''}" data-jump="${q.n}" aria-label="Pregunta ${q.n}, ${local.answers[q.n]?'respuesta '+local.answers[q.n]:'sin respuesta'}${local.flags[q.n]?', para revisar':''}">${q.n}${local.answers[q.n]?' · '+local.answers[q.n]:''}${local.flags[q.n]?' *':''}</button>`).join('');
    $('answerMap').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const q=QUESTIONS.find(q=>q.n===Number(b.dataset.jump));switchTab(q.texto,`question-${q.n}`);}));
  }
  function changed() {local.updatedAt=Date.now();store();paint();clearTimeout(draftTimer);status('Cambios pendientes');draftTimer=setTimeout(saveDraft,650);}
  function payload(draft) {return {rut:student.rut,nombre:student.nombre,curso:student.curso,guiaId:GUIDE_ID,answers:{...local.answers},dev:{...local.dev,review_flags:JSON.stringify(local.flags),started_at:String(local.startedAt)},draft,score:0,total:QUESTIONS.length};}
  async function request(action, body) {const response=await fetch(`/api/paes?action=${action}`,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:undefined);const data=await response.json();if(!response.ok){const e=new Error(data.error||'No se pudo conectar con el servidor');e.status=response.status;throw e;}return data;}
  async function fetchState() {return request(`get-guia-state&guiaId=${GUIDE_ID}&rut=${encodeURIComponent(student.rut)}`);}
  function applyState(data) {
    const attempt=data.attempt;
    if(attempt){const sent=attempt.completada===true&&attempt.submitted===true;if(sent||Number(attempt.lastSavedAt)>Number(local.updatedAt)){local.answers=attempt.answers||{};local.dev=attempt.dev||{};try{local.flags=JSON.parse(local.dev.review_flags||'{}')}catch(_){local.flags={};}local.updatedAt=attempt.lastSavedAt||0;}isSubmitted=sent;local.submitted=sent;}
    else if(local.submitted){local=fresh();isSubmitted=false;}
    document.querySelectorAll('[data-dev]').forEach(el=>{el.value=local.dev[el.dataset.dev]||'';el.disabled=isSubmitted;});store();paint();
    if(isSubmitted){$('submit').disabled=true;$('submit').textContent='Guía entregada';$('deliveryConfirmation').hidden=false;$('sendStatus').textContent='Entrega registrada.';status('Entrega confirmada');}
    if(data.released&&attempt?.result&&data.answerKey){$('resultBox').hidden=false;$('resultScore').textContent=`${attempt.result.correct} / ${attempt.result.total}`;Object.entries(data.answerKey).forEach(([id,letter])=>{const q=$(`question-${id}`);if(!q)return;q.querySelectorAll('.option').forEach(b=>{b.classList.toggle('correct',b.dataset.letter===letter);b.classList.toggle('wrong',b.dataset.letter===local.answers[id]&&b.dataset.letter!==letter);});const f=$(`feedback-${id}`);f.textContent=data.feedback?.[id]||'';f.hidden=!f.textContent;});}
  }
  async function saveDraft() {
    if(!student||isSubmitted||submitting)return;
    const snapshot=payload(true);status('Guardando…');
    saveQueue=saveQueue.catch(()=>{}).then(async()=>{if(isSubmitted)return;try{await request('submit-guia',snapshot);status('Guardado en línea');}catch(error){if(error.status===409){applyState(await fetchState());return;}throw error;}});
    try{await saveQueue;}catch(_){status('Sin conexión · avance conservado',true);}
  }
  async function submitGuide() {
    if(!student||isSubmitted||submitting)return;submitting=true;clearTimeout(draftTimer);paint();$('submit').disabled=true;$('submit').textContent='Entregando…';$('sendStatus').textContent='Confirmando registro…';
    try{await saveQueue.catch(()=>{});try{await request('submit-guia',payload(false));}catch(error){if(error.status!==409)throw error;}
      const readback=await fetchState();if(!readback.attempt||readback.attempt.completada !== true||readback.attempt.submitted!==true)throw new Error('La entrega aún no está confirmada. Reintenta.');
      Object.assign(local,{submitted:true,completada:true,submittedAt:readback.attempt.submittedAt,completadaAt:readback.attempt.completadaAt});applyState(readback);$('confirmDialog').hidden=false;$('closeDialog').focus();
    }catch(error){$('sendStatus').textContent=`No se confirmó la entrega: ${error.message}`;status('Avance conservado. Puedes reintentar.',true);$('submit').disabled=false;$('submit').textContent='Entregar Guía 30';}
    finally{submitting=false;paint();}
  }
  async function login(event) {
    event.preventDefault();const button=event.submitter;button.disabled=true;$('errorBox').textContent='';
    try{const rut=cleanRut($('rutInput').value);if(!validRut(rut))throw new Error('Revisa el RUT y su dígito verificador.');
      if(rut==='229327739'){location.href='guia30-guiada.html';return;}
      let roster=typeof NOMINAS_PAES!=='undefined'?[...NOMINAS_PAES]:[];try{const extra=await request('get-nomina-extra');roster=roster.concat(extra.nomina_extra||[]);}catch(_){}
      const found=roster.find(record=>cleanRut(record.rut)===rut);if(!found)throw new Error('RUT no encontrado en la nómina PAES.');
      student={rut,nombre:found.nombre,curso:found.curso};sessionStorage.setItem('paes_student',JSON.stringify(student));if(window.checkGuiaAccess&&!(await window.checkGuiaAccess(rut)))return;
      try{local=JSON.parse(localStorage.getItem(localKey())||'null')}catch(_){local=null;}local={...fresh(),...(local||{})};local.answers=local.answers||{};local.dev=local.dev||{};local.flags=local.flags||{};
      const data=await fetchState();applyState(data);$('studentName').textContent=student.nombre;$('studentCourse').textContent=student.curso;$('loginSection').hidden=true;$('session').hidden=false;if(!isSubmitted)status('Avance recuperado');
    }catch(error){$('errorBox').textContent=error.message;}finally{button.disabled=false;}
  }
  $('loginForm').addEventListener('submit',login);$('submit').addEventListener('click',submitGuide);
  $('closeDialog').addEventListener('click',()=>{$('confirmDialog').hidden=true;$('deliveryConfirmation').scrollIntoView();});
  $('confirmDialog').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();$('closeDialog').focus();}if(e.key==='Escape')$('closeDialog').click();});
  document.querySelectorAll('[data-dev]').forEach(bindDev);
  window.addEventListener('beforeunload',event=>{if(student&&!isSubmitted){store();if(submitting||$('savedState').textContent==='Cambios pendientes'||$('savedState').textContent==='Guardando…'){event.preventDefault();event.returnValue='';}}});
  $('loginForm').querySelector('button').disabled=true;
  function restorePortalSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem('paes_student') || 'null');
      if (!saved || !saved.rut) return;
      $('rutInput').value = saved.rut;
      return login({ preventDefault() {}, submitter:$('loginForm').querySelector('button') });
    } catch (_) {}
  }
  fetch('data/guia30.json').then(r=>{if(!r.ok)throw new Error('No se pudieron cargar las lecturas.');return r.json();}).then(data=>{activity=data;QUESTIONS=data.questions;render();$('loginForm').querySelector('button').disabled=false;restorePortalSession();}).catch(error=>{$('errorBox').textContent=error.message+' Recarga la página.';});
})();
