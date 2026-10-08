(() => {
 'use strict';
 const slides=[...document.querySelectorAll('.slide')],prev=document.getElementById('prev'),next=document.getElementById('next'),jump=document.getElementById('jump'),counter=document.getElementById('counter'),stage=document.getElementById('stage'),modal=document.getElementById('image-modal');
 let current=0,returnFocus=null;
 function show(index,focus=false){
  current=Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((s,i)=>{s.hidden=i!==current;s.classList.toggle('active',i===current);s.setAttribute('aria-hidden',String(i!==current));});
  counter.textContent=`${current+1} / ${slides.length}`;jump.value=String(current);stage.textContent=slides[current].dataset.stageLabel;prev.disabled=current===0;next.disabled=current===slides.length-1;
  slides[current].querySelector('.slide-content').scrollTop=0;
  history.replaceState(null,'',`#diapositiva-${current+1}`);
  if(focus)slides[current].querySelector('h1').focus({preventScroll:true});
 }
 prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));jump.addEventListener('change',()=>show(Number(jump.value)));
 const fullscreen=document.getElementById('fullscreen');
 fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{fullscreen.title='Pantalla completa no disponible en este navegador';}});
 document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey||/^(SELECT|INPUT|TEXTAREA|BUTTON)$/.test(e.target.tagName)||e.target.isContentEditable)return;let index=null;if(['ArrowRight','PageDown',' '].includes(e.key))index=current+1;if(['ArrowLeft','PageUp'].includes(e.key))index=current-1;if(e.key==='Home')index=0;if(e.key==='End')index=slides.length-1;if(index!==null){e.preventDefault();show(index,true);}});
 function zoom(img){returnFocus=img;const large=document.getElementById('large-image');large.src=img.src;large.alt=img.alt;modal.showModal();}
 document.querySelectorAll('.post-photo,.archive-image img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar '+img.alt);img.addEventListener('click',()=>zoom(img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();zoom(img);}});});
 document.getElementById('close-image').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});modal.addEventListener('close',()=>returnFocus?.focus({preventScroll:true}));
 function fromHash(){const n=Number(location.hash.match(/^#diapositiva-(\d+)$/)?.[1]);show(Number.isInteger(n)&&n>0?n-1:0);}
 window.addEventListener('hashchange',fromHash);fromHash();
})();
