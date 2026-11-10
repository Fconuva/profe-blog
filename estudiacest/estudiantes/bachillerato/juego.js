(() => {
 'use strict';
 const $=id=>document.getElementById(id),role=document.body.dataset.role,host=role==='host',screen=role==='screen';
 const config={apiKey:'AIzaSyCuDQ_iHDHmTd8bPeqUbsXQqdxw2SObt8w',authDomain:'estudiacest.firebaseapp.com',projectId:'estudiacest'};
 function connectionNotLoaded(){const status=$('notice');status.textContent='No se pudo cargar la conexión. Revisa la red y vuelve a intentar.';status.classList.add('error');const retry=document.createElement('button');retry.id='reloadConnection';retry.type='button';retry.textContent='Volver a cargar';retry.onclick=()=>location.reload();status.after(retry);}
 if(typeof globalThis.firebase?.initializeApp!=='function'){connectionNotLoaded();return;}
 const studentSession=new URLSearchParams(location.search).get('estudiante')==='1';
 const app=firebase.initializeApp(config,(host||screen)&&!studentSession?'estudiacest-admin':undefined);
 if(typeof app.auth!=='function'){connectionNotLoaded();return;}
 const auth=app.auth();
 if(host&&studentSession){showStudentHost();}
 if(screen&&studentSession){const back=document.querySelector('header a');back.href='docente.html?estudiante=1&sala='+encodeURIComponent(new URLSearchParams(location.search).get('sala')||'');back.textContent='← Anfitrión';}
 function showStudentHost(){
  document.title='Crear y dirigir sala · Bachillerato lector';
  const back=document.querySelector('header a');back.href='./';back.textContent='← Bachillerato';document.querySelector('header span').textContent='ANFITRIÓN · EN VIVO';
  if($('teacherLogin'))$('teacherLogin').hidden=true;
  if($('studentHostLogin'))$('studentHostLogin').hidden=false;
  document.querySelector('#login h2').textContent='Ingresa con tu cuenta de Estudia CEST';
  $('notice').textContent='Comprobando tu sesión…';document.querySelector('footer').textContent='Anfitrión · Comparte el código y dirige tu partida.';
 }
 let user=null,code='',state=null,busy=false,polling=false,timer=null,rendered='',reviewRendered='',saveQueue=Promise.resolve(),version=0,draftTimer=null,stopping=false,offset=0,sending=false,saveGeneration=0,qrFor='';
 const show=(id,yes)=>{if($(id))$(id).hidden=!yes;};
 const notice=(message,error=false)=>{if($('notice')){$('notice').textContent=message;$('notice').classList.toggle('error',error);}};
 const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 const shortName=s=>{const p=String(s||'Estudiante').trim().split(/\s+/);return p[0]+(p[1]?' '+p[1][0]+'.':'');};
 // El QR lleva a la dirección corta, que conserva el código de la sala.
 const joinLink=()=>location.origin+'/bachillerato/?sala='+encodeURIComponent(code);
 const shortLink=()=>location.host.replace(/^www\./,'')+'/bachillerato';
 function tiles(el,text){if(!el||el.dataset.tiles===text)return;el.dataset.tiles=text;el.classList.add('tiles');el.replaceChildren(...Array.from(text,ch=>node('span',ch,'tile')));}
 function renderQr(){
  const box=$('qr');if(!box||qrFor===code)return;qrFor=code;box.replaceChildren();
  if(typeof globalThis.QRCode==='function'){try{new QRCode(box,{text:joinLink(),width:512,height:512,colorDark:'#000000',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});box.removeAttribute('title');const img=box.querySelector('img');if(img)img.alt='';box.setAttribute('aria-label','Código QR para entrar a la sala '+code);}catch{box.replaceChildren();}}
  box.hidden=!box.firstChild;
 }
 function renderLinks(){renderQr();document.querySelectorAll('[data-short-link]').forEach(e=>e.textContent=shortLink());if($('joinUrl')){$('joinUrl').href=joinLink();$('joinUrl').textContent=joinLink().replace(/^https?:\/\//,'');}}
 function renderPeople(el,abbr){
  if(!el||!state?.players)return;const ids=new Set(state.players.map(p=>p.uid));
  el.querySelectorAll('[data-uid]').forEach(s=>{if(!ids.has(s.dataset.uid))s.remove();});
  const have=new Set(Array.from(el.querySelectorAll('[data-uid]'),s=>s.dataset.uid));
  state.players.forEach(p=>{if(have.has(p.uid))return;const s=node('span',abbr?shortName(p.name):p.name);s.dataset.uid=p.uid;el.append(s);});
 }
 const norm=s=>String(s||'').trim().toLocaleLowerCase('es').normalize('NFD').replace(/n\u0303/g,'ñ').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ');
 const draftKey=()=>`bachillerato:${user.uid}:${code}:${state.current}`;
 function localDraft(){try{return JSON.parse(localStorage.getItem(draftKey())||'null');}catch{return null;}}
 function remember(){if(!user||!state?.round||!$('answerForm'))return;const answers=values();try{localStorage.setItem(draftKey(),JSON.stringify({answers,dirty:true}));}catch{} }
 function values(){return Array.from(document.querySelectorAll('[data-answer]')).map(e=>e.value);}
 async function api(action,body={},get=false){
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
  try{
   const token=await user.getIdToken(),url=new URL('/api/estudiantes',location.origin);url.searchParams.set('action','bachillerato-'+action);
   if(get){url.searchParams.set('code',code);if(host||screen)url.searchParams.set('host','1');}
   const response=await fetch(url,{method:get?'GET':'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(!get?{body:JSON.stringify({code,...body})}:{}),signal:controller.signal,cache:'no-store'});
   const data=await response.json();if(!response.ok)throw Object.assign(new Error(data.error||'No se pudo completar la acción.'),{status:response.status});return data;
  }catch(e){if(e.name==='AbortError')throw new Error('La conexión está tardando. Tus respuestas siguen en este equipo; reintenta.');if(e instanceof TypeError)throw new Error('Sin conexión con la sala. Tu borrador se conserva en este equipo; reintenta al volver la red.');throw e;}finally{clearTimeout(timeout);}
 }
 async function command(action,body={}){
  if(busy)return;busy=true;document.querySelectorAll('button').forEach(b=>b.disabled=true);
  try{await api(action,body);await refresh(true);notice('Partida actualizada.');}catch(e){notice(e.message,true);}finally{busy=false;updateControls();}
 }
 function updateControls(){
  document.querySelectorAll('button').forEach(b=>b.disabled=busy||b.dataset.saving==='1');
  if(!host&&!screen&&state?.round){const closed=state.round.closedAt||Date.now()+offset>=state.round.endsAt||state.own?.submitted===true;
   document.querySelectorAll('[data-answer]').forEach(e=>e.disabled=!!closed||sending);if($('submit'))$('submit').disabled=!!closed||sending;
  }
 }
 function setCode(next){
  saveGeneration++;clearTimeout(draftTimer);saveQueue=Promise.resolve();sending=false;
  code=String(next||'').toUpperCase().replace(/[^A-Z0-9]/g,'');['participants','screenPlayers'].forEach(id=>$(id)?.replaceChildren());localStorage.setItem(`bachillerato-last-${role}-${user.uid}`,code);
  const url=new URL(location.href);url.searchParams.set('sala',code);history.replaceState({},'',url);rendered='';reviewRendered='';
 }
 async function joinRoom(next){
  setCode(next);
  if(!host&&!screen){
   const teacherUrl='/estudiantes/bachillerato/docente.html?sala='+encodeURIComponent(code)+'&estudiante=1';
   if($('teacherAccess'))$('teacherAccess').href=teacherUrl;
   const access=await api('entry',{},true);
   if(access.mode==='host'){location.replace(teacherUrl);return;}
   if(access.mode!=='student')throw new Error(access.message||'Revisa tu cuenta y el curso de la sala.');
   const joined=await api('join');if(joined.mode==='host'){location.replace(teacherUrl);return;}
  }
  await refresh(true);show('join',false);show('setup',false);schedule();
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(async()=>{await refresh();if(user&&code)schedule();},4000+Math.random()*1000);}
 async function refresh(force=false){
  if(!user||!code||polling)return;polling=true;
  try{const next=await api('state',{},true);if(!user||!code)return;state=next;offset=state.serverNow-Date.now();if(host)renderHost();else renderPlayer();if(force)notice(host?'Sala conectada.':'Conectado a la partida.');tick();}
  catch(e){notice(e.message,true);if(force)throw e;}finally{polling=false;}
 }
 function fillRound(){
  const r=state.round;$('roundNumber').textContent='RONDA '+state.current;$('roundTitle').textContent=r.title;
  show('letterWrap',r.mode==='classic');show('letter',r.mode==='classic');if($('letter'))$('letter').textContent=r.letter||'';
  show('reading',r.mode==='reading');if($('reading'))$('reading').textContent=r.text||'';
 }
 function renderRanking(){
  const visible=state.ranking.some(p=>p.points>0)||state.round?.published||state.status==='finished';show('leaderboard',visible);
  if(!visible)return;$('rankingTitle').textContent=state.status==='finished'?'¡Partida terminada!':'Tabla de puntos';
  $('rankingNote').textContent=state.status==='finished'?'Comenten: ¿qué pista les ayudó a mejorar una respuesta?':'Los empates comparten puesto. Los puntos se suman al publicarse cada ronda.';
  const list=$('ranking');list.replaceChildren();state.ranking.forEach(p=>{const li=node('li',undefined,p.self?'self':'');li.append(node('b',p.rank),node('span',p.name+(p.self?' · tú':'')),node('strong',p.points+' pts'));list.append(li);});
 }
 function renderPlayer(){
  document.body.classList.add('in-game');
  show('game',true);tiles($('roomCode'),code);tiles($('barCode'),code);$('roomInfo').textContent=(state.courseLabel||state.course)+' · '+state.count+' participantes';
  show('waiting',!state.round);if($('playersCount'))$('playersCount').textContent=state.count===1?'1 participante dentro.':state.count+' participantes dentro.';
  show('round',!!state.round);
  if(screen){renderLinks();show('screenBar',!!state.round);renderPeople($('screenPlayers'),true);}
  if(state.round){
   fillRound();const r=state.round,closed=r.closedAt||Date.now()+offset>=r.endsAt;
   $('instructions').textContent=r.published?'Ronda revisada. Mira tus puntos y espera la siguiente.':closed?'Se acabó el tiempo. El anfitrión está revisando las respuestas.':r.mode==='classic'?'Escribe una palabra por categoría que empiece con la letra. Envía cuando termines.':'Lee y responde las tres preguntas. Usa las pistas del texto para explicar.';
   if(screen){
    const list=$('screenQuestions');list.replaceChildren();r.questions.forEach(q=>list.append(node('li',q)));
    const sent=Object.values(state.answers||{}).filter(a=>a.submitted).length,total=state.count;
    if($('progressBar'))$('progressBar').style.width=(total?Math.min(100,Math.round(sent*100/total)):0)+'%';
    if($('progressText'))$('progressText').textContent=r.published?'Ronda publicada.':closed?'Tiempo cumplido · '+sent+' de '+total+' enviaron.':sent+' de '+total+' ya enviaron.';
   }
   else{
    const signature=code+':'+state.current;
    if(rendered!==signature){
     rendered=signature;saveGeneration++;clearTimeout(draftTimer);saveQueue=Promise.resolve();sending=false;version=state.own?.version||0;const draft=localDraft(),answers=state.own?.submitted?state.own.answers:draft?.dirty?draft.answers:state.own?.answers||draft?.answers||[];
     const fields=$('fields');fields.replaceChildren();const last=r.questions.length-1;r.questions.forEach((q,i)=>{const div=node('div',undefined,r.mode==='reading'?'wide':'');const label=node('label',(i+1)+'. '+q);label.htmlFor='answer'+i;const input=node(r.mode==='reading'?'textarea':'input');input.id='answer'+i;input.dataset.answer=i;input.maxLength=500;input.value=answers[i]||'';if(r.mode==='reading')input.rows=3;else input.placeholder=(r.letter||'')+'…';input.autocomplete='off';input.setAttribute('enterkeyhint',i<last?'next':'done');div.append(label,input);fields.append(div);});
     $('saveStatus').textContent=state.own?.submitted?'Entrega confirmada.':draft?.dirty?'Borrador recuperado en este equipo.':'Escribe: tus respuestas se guardan automáticamente.';
    }
    version=Math.max(version,state.own?.version||0);
    if(state.own?.submitted){
     document.querySelectorAll('[data-answer]').forEach((input,i)=>{input.value=state.own.answers?.[i]||'';});
     try{localStorage.setItem(draftKey(),JSON.stringify({answers:state.own.answers,dirty:false}));}catch{}
     $('saveStatus').textContent='Entrega confirmada. Tus respuestas quedaron guardadas.';
    }
    $('myPoints').replaceChildren();if(state.ownGrade){const p=node('p',state.ownGrade.reduce((a,b)=>a+b,0)+' puntos en esta ronda.');$('myPoints').append(p);state.ownGrade.forEach((points,i)=>$('myPoints').append(node('p',(i+1)+'. '+r.questions[i]+': '+points+' puntos')));}
   }
  }
  renderRanking();updateControls();
 }
 function proposal(uid,index){
  if(state.grades[uid])return state.grades[uid][index];if(state.round.mode==='reading')return '';
  const word=norm(state.answers[uid]?.answers?.[index]);if(!word||word[0]!==norm(state.round.letter))return 0;
  return Object.values(state.answers).filter(a=>norm(a.answers?.[index])===word).length>1?5:10;
 }
 function renderReview(){
  const signature=code+':'+state.current+':'+state.round.published;if(reviewRendered===signature)return;reviewRendered=signature;
  $('reviewHelp').textContent=state.round.mode==='classic'?'Comprueba que cada palabra pertenezca a su categoría. Corrige la propuesta de puntos cuando corresponda y guárdala; el resto usa la propuesta al publicar.':'Revisa con la pauta. Asigna 10 puntos a una respuesta lograda, 5 si es parcial y 0 si no responde a lo pedido. Guarda cada revisión antes de publicar.';
  $('guide').replaceChildren();state.guide.forEach(p=>$('guide').append(node('li',p)));show('guideDetails',state.guide.length>0);
  const container=$('review');container.replaceChildren();
  Object.entries(state.answers).filter(([,a])=>a.savedAt<=state.round.closedAt).forEach(([uid,a])=>{
   const item=node('section',undefined,'review-item');item.dataset.uid=uid;const person=state.players.find(p=>p.uid===uid);item.append(node('h3',person?.name||'Participante'));
   const selects=[];state.round.questions.forEach((q,i)=>{const row=node('div',undefined,'review-row'),text=node('div');text.append(node('label',(i+1)+'. '+q),node('p',a.answers?.[i]||'Sin respuesta'));const select=node('select');select.setAttribute('aria-label','Puntos para '+(i+1)+' de '+(person?.name||'participante'));[['','Elegir'],[0,'0 pts'],[5,'5 pts'],[10,'10 pts']].forEach(([v,label])=>{const option=node('option',label);option.value=v;select.append(option);});select.value=proposal(uid,i);selects.push(select);row.append(text,select);item.append(row);});
   const actions=node('div',undefined,'row'),all=node('button','Todas logradas · 10','secondary');all.type='button';all.onclick=()=>selects.forEach(s=>s.value='10');
   let dirty=false;const save=node('button',state.grades[uid]?'Revisión guardada':'Guardar revisión');save.type='button';
   const persist=async()=>{await api('grade',{round:state.current,uid,points:selects.map(s=>Number(s.value))});dirty=false;save.textContent='Revisión guardada';};
   // Pendiente: puntos elegidos o cambiados que aún no se guardan en la sala.
   item.persist=persist;item.ready=()=>dirty&&selects.every(s=>s.value!=='');
   save.onclick=async()=>{if(selects.some(s=>s.value==='')){notice('Elige los puntos de cada respuesta.',true);return;}save.disabled=true;save.dataset.saving='1';try{await persist();await refresh();notice('Puntos guardados.');}catch(e){notice(e.message,true);}finally{save.disabled=false;delete save.dataset.saving;}};
   const mark=()=>{dirty=true;save.textContent='Guardar cambios';};selects.forEach(s=>s.onchange=mark);all.addEventListener('click',mark);actions.append(all,save);item.append(actions);container.append(item);
  });
 }
 function renderHost(){
  document.body.classList.add('in-game');
  show('hostGame',true);tiles($('roomCode'),code);$('roomInfo').textContent=(state.courseLabel||state.course)+' · '+state.count+' participantes';
  $('project').href='pantalla.html?sala='+code+(studentSession?'&estudiante=1':'');renderLinks();
  $('attendance').textContent=state.round&&!state.round.closedAt?state.count+' participantes · '+Object.keys(state.answers).length+' han guardado · '+Object.values(state.answers).filter(a=>a.submitted).length+' enviaron.':state.count+' participantes dentro. Puedes comenzar cuando el curso esté listo.';
  renderPeople($('participants'),false);
  const r=state.round;$('hostStatus').textContent=state.status==='finished'?'Partida terminada':!r?'Esperando jugadores':r.published?'Ronda '+state.current+' publicada':r.closedAt?'Revisando ronda '+state.current:'Ronda '+state.current+' en juego';
  show('startPanel',state.status!=='finished'&&(!r||r.published));show('liveRound',!!r);show('stop',!!r&&!r.closedAt&&!r.published);show('reviewPanel',!!r&&!!r.closedAt&&!r.published);
  if(r){fillRound();$('questions').replaceChildren();r.questions.forEach(q=>$('questions').append(node('li',q)));if(r.closedAt&&!r.published){renderReview();$('reviewCount').textContent=Object.keys(state.answers).length+' respuestas guardadas · '+Object.keys(state.grades).length+' revisiones guardadas.';}}
  renderRanking();show('finish',!!r&&r.published&&state.status!=='finished');updateControls();
 }
 function tick(){
  if(!state?.round||!$('clock'))return;const r=state.round,seconds=r.closedAt?0:Math.max(0,Math.ceil((r.endsAt-Date.now()-offset)/1000));
  $('clock').textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');$('clock').classList.toggle('ending',seconds<=15);updateControls();
  if(host&&seconds===0&&!r.closedAt&&!stopping&&!busy){stopping=true;command('stop',{round:state.current}).finally(()=>stopping=false);}
 }
 function enqueueSave(final=false){
  if(!state?.round||state.own?.submitted||state.round.closedAt)return Promise.resolve();
  const round=state.current,answers=values(),requestId=crypto.randomUUID(),generation=saveGeneration,savedCode=code,savedUid=user?.uid;
  const current=()=>generation===saveGeneration&&state?.current===round&&code===savedCode&&user?.uid===savedUid;
  remember();
  saveQueue=saveQueue.catch(()=>{}).then(async()=>{
   if(!current())return;
   try{const data=await api('save',{code:savedCode,round,answers,version,final,requestId});if(!current())return;version=data.record.version;state.own=data.record;
    const latest=localDraft();if(JSON.stringify(latest?.answers)===JSON.stringify(answers))localStorage.setItem(draftKey(),JSON.stringify({answers,dirty:false}));
    $('saveStatus').textContent=final?'Entrega confirmada. Tus respuestas quedaron guardadas.':'Guardado en la sala.';updateControls();
   }catch(e){if(!current())return;$('saveStatus').textContent=e.message;notice(e.message,true);throw e;}
  });return saveQueue;
 }
 const readyReviews=()=>Array.from(document.querySelectorAll('#review .review-item')).filter(i=>i.ready?.());
 async function saveReviews(items){
  if(busy)return false;busy=true;updateControls();let done=0;
  try{for(const item of items){await item.persist();done++;notice('Guardando revisiones: '+done+' de '+items.length+'…');}notice(done===1?'1 revisión guardada.':done+' revisiones guardadas.');return true;}
  catch(e){notice(e.message,true);return false;}finally{busy=false;updateControls();}
 }
 if($('answerForm')){
  $('answerForm').addEventListener('submit',e=>e.preventDefault());$('fields').addEventListener('input',()=>{remember();$('saveStatus').textContent='Guardando…';clearTimeout(draftTimer);draftTimer=setTimeout(()=>enqueueSave().catch(()=>{}),650);});
  $('submit').onclick=async()=>{if(sending)return;const generation=saveGeneration;sending=true;clearTimeout(draftTimer);updateControls();try{await saveQueue.catch(()=>{});if(generation!==saveGeneration)return;await enqueueSave(true).catch(()=>{});await refresh();}finally{if(generation===saveGeneration){sending=false;updateControls();}}};
 }
 if($('fields'))$('fields').addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing||e.target.tagName!=='INPUT')return;e.preventDefault();const all=Array.from(document.querySelectorAll('[data-answer]')),next=all[all.indexOf(e.target)+1];if(next)next.focus();else e.target.blur();});
 if($('code'))$('code').addEventListener('input',()=>{const v=$('code').value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);if(v!==$('code').value)$('code').value=v;});
 if($('joinForm'))$('joinForm').onsubmit=async e=>{e.preventDefault();try{await joinRoom($('code').value);}catch(error){notice(error.message,true);}};
 // Ingreso solo con RUT: el servidor valida la sala abierta y el curso, y entrega la sesión de ese estudiante.
 if($('rutForm'))$('rutForm').onsubmit=async e=>{e.preventDefault();const button=$('rutForm').querySelector('button');if(button.disabled)return;button.disabled=true;notice('Entrando…');
  try{const room=$('rutCode').value.toUpperCase().replace(/[^A-Z0-9]/g,'');const response=await fetch('/api/estudiantes?action=bachillerato-rut',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rut:$('rutOnly').value,code:room})});const data=await response.json().catch(()=>({}));if(!response.ok||!data.token)throw new Error(data.error||'No se pudo entrar. Revisa tu RUT y vuelve a intentar.');
   const url=new URL(location.href);url.searchParams.set('sala',data.code||room);history.replaceState({},'',url);$('rutOnly').value='';await auth.signInWithCustomToken(data.token);}
  catch(error){notice(error.message,true);}finally{button.disabled=false;}};
 if($('leave'))$('leave').onclick=()=>{clearTimeout(timer);code='';state=null;show('game',false);show('join',true);};
 if($('teacherLogin'))$('teacherLogin').onsubmit=async e=>{e.preventDefault();try{await auth.signInWithEmailAndPassword($('email').value.trim(),$('password').value);$('password').value='';}catch{notice('Revisa tu correo y contraseña docente.',true);}};
 if($('createForm'))$('createForm').onsubmit=async e=>{e.preventDefault();if(busy)return;busy=true;updateControls();try{const result=await api('create',{course:$('course').value});await joinRoom(result.code);}catch(error){notice(error.message,true);}finally{busy=false;updateControls();}};
 if($('resumeForm'))$('resumeForm').onsubmit=async e=>{e.preventDefault();try{await joinRoom($('resumeCode').value);}catch(error){notice(error.message,true);}};
 if($('newRoom'))$('newRoom').onclick=()=>{clearTimeout(timer);state=null;code='';show('hostGame',false);show('setup',true);};
 if($('mode'))$('mode').onchange=()=>{const reading=$('mode').value==='reading';show('readingSettings',reading);show('classicSettings',!reading);if(reading)$('seconds').value='180';};
 if($('startForm'))$('startForm').onsubmit=e=>{e.preventDefault();command('start',{mode:$('mode').value,seconds:Number($('seconds').value),letter:$('chooseLetter').value.trim(),categories:$('categories').value.split('\n').map(s=>s.trim()).filter(Boolean),reading:Number($('readingChoice').value)});};
 if($('stop'))$('stop').onclick=()=>command('stop',{round:state.current});
 if($('publish'))$('publish').onclick=async()=>{const pending=readyReviews();if(pending.length&&!(await saveReviews(pending)))return;command('publish',{round:state.current});};
 if($('saveAll'))$('saveAll').onclick=async()=>{const items=readyReviews();if(!items.length){notice('No hay revisiones pendientes. Marca los puntos de cada respuesta.',true);return;}if(await saveReviews(items))await refresh().catch(()=>{});};
 if($('copyLink'))$('copyLink').onclick=async()=>{try{await navigator.clipboard.writeText(joinLink());notice('Enlace de la sala copiado.');}catch{notice('Enlace de la sala: '+joinLink());}};
 if($('finish'))$('finish').onclick=()=>command('finish',{round:state.current});
 if($('fullscreen'))$('fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else document.documentElement.requestFullscreen().catch(()=>{});};
 // Cerrar sesión en este equipo: lo guardado en la sala se conserva y el otro equipo del docente sigue conectado.
 if($('logout'))$('logout').onclick=async()=>{const playing=!host&&!screen&&!!code&&!!state?.round&&!state.round.closedAt;if(!confirm(playing?'La ronda sigue abierta. ¿Cerrar sesión en este equipo? Lo guardado en la sala se conserva.':'¿Cerrar sesión en este equipo?'))return;$('logout').disabled=true;try{if(playing&&localDraft()?.dirty)await enqueueSave().catch(()=>{});clearTimeout(timer);code='';state=null;await auth.signOut();if(screen){location.href=studentSession?'docente.html?estudiante=1':'docente.html';return;}notice('Sesión cerrada en este equipo.');}catch{notice('No se pudo cerrar la sesión. Vuelve a intentar.',true);}finally{$('logout').disabled=false;}};
 auth.onAuthStateChanged(async account=>{
  user=account;document.body.classList.toggle('signed-in',!!account);if($('logout'))$('logout').hidden=!account;if(!account){clearTimeout(timer);show('game',false);show('hostGame',false);show('setup',false);show('join',false);show('login',!screen);notice(screen?'Inicia sesión en la partida y vuelve a abrir esta pantalla.':'Ingresa para participar.');
   const pending=String(new URLSearchParams(location.search).get('sala')||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);if($('loginRoom')&&pending){$('loginRoom').textContent='Sala '+pending;$('loginRoom').hidden=false;}
   if($('rutCode')){if(pending)$('rutCode').value=pending;$('rutCode').hidden=!!pending;$('rutCodeLabel').hidden=!!pending;}
   if($('loginLink'))$('loginLink').href='/lecturas/?next='+encodeURIComponent(location.pathname+location.search);return;}
  show('login',false);
  try{
   if(host){const catalog=await api('catalog',{},true);$('course').replaceChildren();catalog.courses.forEach(c=>{const option=node('option',catalog.labels?.[c]||c);option.value=c;$('course').append(option);});$('categories').value=catalog.classics.join('\n');$('readingChoice').replaceChildren();catalog.readings.forEach(r=>{const option=node('option',r.title);option.value=r.id;$('readingChoice').append(option);});show('setup',true);}
   else if(!screen){show('join',true);$('identity').textContent='Cuenta: '+(account.displayName||'Estudiante');}
   const last=new URLSearchParams(location.search).get('sala')||localStorage.getItem(`bachillerato-last-${role}-${account.uid}`);if(last){if($('code'))$('code').value=last;if($('resumeCode'))$('resumeCode').value=last;await joinRoom(last);}else notice(host?'Elige el curso y crea la sala.':'Escribe el código de la sala o escanea el QR de la pizarra.');
  }catch(e){notice(e.message,true);}
 });
 setInterval(tick,500);
 window.addEventListener('online',()=>{notice('Conexión recuperada.');if(!host&&!screen&&state?.round&&!state.round.closedAt&&localDraft()?.dirty)enqueueSave().catch(()=>{});refresh();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
