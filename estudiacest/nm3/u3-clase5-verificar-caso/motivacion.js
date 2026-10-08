(() => {
 'use strict';
 const launch=document.getElementById('start-motivation');
 if(!launch)return;
 const dialog=document.getElementById('motivation-dialog'),video=document.getElementById('motivation-video');
 const title=document.getElementById('motivation-title'),source=document.getElementById('motivation-source');
 const progress=document.getElementById('motivation-progress'),question=document.getElementById('motivation-question');
 const note=document.getElementById('motivation-note'),advance=document.getElementById('motivation-next');
 const comment=document.getElementById('motivation-comment'),repeat=document.getElementById('motivation-repeat');
 let data=null,step=0,phase='loading',generation=0;
 function pauseForQuestion(){
  if(!dialog.open||!data||phase==='question')return;
  generation++;video.pause();phase='question';dialog.dataset.phase=phase;
  question.textContent=data.fragments[step].question;
  note.textContent='Comenten en voz alta · 30 segundos';
  advance.hidden=false;advance.disabled=false;
  advance.textContent=step===data.fragments.length-1?'Volver a la clase':step===1?'Ver el segundo caso →':'Continuar video →';
  comment.hidden=true;advance.focus({preventScroll:true});
 }
 function playFragment(){
  const fragment=data.fragments[step],original=data.sources[fragment.source];
  const token=++generation;phase='playing';dialog.dataset.phase=phase;
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
  launch.disabled=true;dialog.showModal();phase='loading';dialog.dataset.phase=phase;
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
 repeat.addEventListener('click',()=>{if(data&&dialog.open)playFragment();});
 advance.addEventListener('click',()=>{
  if(phase!=='question')return;
  if(step===data.fragments.length-1)dialog.close();else{step++;playFragment();}
 });
 document.getElementById('motivation-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{
  generation++;video.pause();video.removeAttribute('src');video.load();phase='closed';launch.disabled=false;launch.focus({preventScroll:true});
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
 window.addEventListener('pagehide',()=>video.pause());
 document.getElementById('motivation-fullscreen').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
  catch{note.textContent='Pantalla completa no disponible. Puedes ampliar el navegador.';}
 });
})();
