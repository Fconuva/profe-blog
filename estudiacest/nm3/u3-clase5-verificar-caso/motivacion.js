(() => {
 'use strict';
 const launch=document.getElementById('start-motivation');
 if(!launch)return;
 const dialog=document.getElementById('motivation-dialog'),video=document.getElementById('motivation-video');
 const title=document.getElementById('motivation-title'),source=document.getElementById('motivation-source');
 const progress=document.getElementById('motivation-progress'),question=document.getElementById('motivation-question');
 const note=document.getElementById('motivation-note'),advance=document.getElementById('motivation-next');
 const comment=document.getElementById('motivation-comment'),repeat=document.getElementById('motivation-repeat');
 const casePanel=document.getElementById('motivation-case');
 let data=null,caseData=null,step=0,caseStep=0,phase='loading',generation=0;
 const caseLast=()=>caseData.questions.length-1;
 const caseNode=(tag,text,className)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;};
 function renderCase(){
  generation++;video.pause();video.removeAttribute('src');video.load();video.hidden=true;casePanel.hidden=false;
  phase='case';dialog.dataset.phase=phase;dialog.dataset.caseStep=String(caseStep);
  const current=caseData.questions[caseStep];
  casePanel.dataset.view=current.view;
  title.textContent=current.title;progress.textContent=`Instagram · Pregunta ${caseStep+1} de ${caseData.questions.length}`;
  question.textContent=current.question;note.textContent=current.note;
  source.textContent=current.view==='evidence'?caseData.sources.primary.title:'Noticia relacionada · Abrir después de comentar';
  source.href=current.view==='evidence'?caseData.sources.primary.local:caseData.sources.article.url;
  casePanel.replaceChildren();
  if(current.view==='evidence'){
   const heading=caseNode('h3','Evidencias para contrastar');casePanel.append(heading);
   for(const item of caseData.evidence){const card=caseNode('section',null,'context-evidence');card.append(caseNode('h4',item.label),caseNode('p',item.text));const a=caseNode('a',caseData.sources[item.source].title);a.href=item.source==='primary'?caseData.sources.primary.local:caseData.sources.article.url;a.target='_blank';a.rel='noopener';card.append(a);casePanel.append(card);}
  }else{
   const post=caseNode('article',null,'context-post');
   post.append(caseNode('p','Instagram · Transcripción de la captura','context-label'));
   const account=caseNode('div',null,'context-account');account.append(caseNode('span','U24','context-avatar'),caseNode('strong',caseData.account));
   if(caseData.verifiedVisible)account.append(caseNode('span','✓','context-verified'));account.append(caseNode('span','Seguir','context-follow'));post.append(account);
   const cover=caseNode('div',null,'context-cover');cover.append(caseNode('p',caseData.imageDescription,'context-image-description'),caseNode('span',caseData.tag,'context-tag'),caseNode('h3',caseData.headline));post.append(cover);
   post.append(caseNode('p',`♡ ${caseData.reactions.likes}   ◯ ${caseData.reactions.comments}   ⇄ ${caseData.reactions.reposts}   ↗ ${caseData.reactions.shares}`,'context-reactions'),caseNode('p',caseData.caption,'context-caption'));casePanel.append(post);
   if(current.view==='comments'){
    const comments=caseNode('section',null,'context-comments');comments.append(caseNode('p',caseData.comments.status,'context-label'),caseNode('p',caseData.comments.intro));
    caseData.comments.items.forEach((text,i)=>{const p=caseNode('p',null,'context-comment');p.append(caseNode('strong',`Respuesta ${i+1} · `),document.createTextNode(text));comments.append(p);});casePanel.append(comments);
   }
  }
  comment.hidden=true;repeat.disabled=false;repeat.textContent='Volver a la publicación';
  advance.hidden=false;advance.disabled=false;advance.textContent=caseStep===caseLast()?'Volver a la clase':'Siguiente pregunta →';
  casePanel.scrollTop=0;dialog.scrollTop=0;
  advance.focus({preventScroll:true});
 }
 function pauseForQuestion(){
  if(!dialog.open||!data||phase!=='playing')return;
  generation++;video.pause();phase='question';dialog.dataset.phase=phase;
  question.textContent=data.fragments[step].question;
  note.textContent='Comenten en voz alta · 30 segundos';
  advance.hidden=false;advance.disabled=false;
  advance.textContent=step===data.fragments.length-1?'Analizar Instagram →':step===1?'Ver el segundo caso →':'Continuar video →';
  comment.hidden=true;advance.focus({preventScroll:true});
 }
 function playFragment(){
  const fragment=data.fragments[step],original=data.sources[fragment.source];
  const token=++generation;phase='playing';dialog.dataset.phase=phase;casePanel.hidden=true;video.hidden=false;repeat.textContent='Repetir fragmento';
  title.textContent=fragment.title;
  progress.textContent=`Fragmento ${step+1} de ${data.fragments.length}`;
  source.textContent=`${original.channel} · ${original.publishedLabel} · Ver original en YouTube`;
  source.href=original.url+'&t='+Math.floor(fragment.startSeconds)+'s';
  question.textContent='Observen el mensaje y cómo se comprueba.';
  note.textContent='El video se detendrá para conversar.';
  advance.hidden=true;comment.hidden=false;repeat.disabled=false;
  video.pause();video.src=fragment.file;video.load();
  const playing=video.play();
  if(playing)playing.catch(()=>{
   if(token!==generation||!dialog.open)return;
   note.textContent='Pulsa ▶ en el video para reproducirlo.';
  });
 }
 async function open(){
  launch.disabled=true;dialog.showModal();phase='loading';dialog.dataset.phase=phase;casePanel.hidden=true;video.hidden=false;
  title.textContent='Antes de compartir';question.textContent='Preparando los fragmentos…';
  note.textContent='Dos casos reales de canales chilenos.';progress.textContent='Motivación';
  advance.hidden=true;comment.hidden=true;repeat.disabled=true;
  const token=++generation;
  try{
   if(!data){
    const response=await fetch('assets/videos-motivacion.json',{signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error('No se pudo abrir la selección');
    data=await response.json();
   }
   if(!caseData){const response=await fetch('assets/instagram-contexto.json',{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('No se pudo abrir el caso');caseData=await response.json();}
   if(token!==generation||!dialog.open)return;
   step=0;playFragment();
  }catch{
   if(token!==generation||!dialog.open)return;
   phase='error';dialog.dataset.phase=phase;
   question.textContent='No se pudieron cargar los fragmentos.';
   note.textContent='Cierra esta ventana y vuelve a intentarlo. Los originales están enlazados abajo.';
  }finally{launch.disabled=false;}
 }
 launch.addEventListener('click',open);
 video.addEventListener('ended',pauseForQuestion);
 video.addEventListener('error',()=>{
  if(!dialog.open||!data||phase!=='playing')return;
  pauseForQuestion();note.textContent='No se pudo reproducir este fragmento. Abre el original o continúa con la pregunta.';
 });
 comment.addEventListener('click',pauseForQuestion);
 repeat.addEventListener('click',()=>{if(!data||!dialog.open)return;if(phase==='case'){caseStep=0;renderCase();}else playFragment();});
 advance.addEventListener('click',()=>{
  if(phase==='case'){if(caseStep===caseLast())dialog.close();else{caseStep++;renderCase();}return;}
  if(phase!=='question')return;
  if(step===data.fragments.length-1){caseStep=0;renderCase();}else{step++;playFragment();}
 });
 document.getElementById('motivation-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{
  generation++;video.pause();video.removeAttribute('src');video.load();phase='closed';dialog.dataset.phase=phase;launch.disabled=false;launch.focus({preventScroll:true});
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
 window.addEventListener('pagehide',()=>video.pause());
 document.getElementById('motivation-fullscreen').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
  catch{note.textContent='Pantalla completa no disponible. Puedes ampliar el navegador.';}
 });
})();
