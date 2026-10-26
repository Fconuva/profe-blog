(()=>{'use strict';
 const {slides:data,phases}=window.GraficaClase;
 const slides=[...document.querySelectorAll('.slide')],$=id=>document.getElementById(id);
 let current=0,activePhase=null,lastImage=null;
 const clocks=phases.map(p=>({remaining:p.seconds*1000,end:null}));
 function remaining(c){return c.end===null?c.remaining:Math.max(0,c.end-Date.now());}
 function pause(c){c.remaining=remaining(c);c.end=null;}
 function paintClock(){const c=clocks[activePhase],left=remaining(c);if(c.end!==null&&left===0)pause(c);const seconds=Math.ceil(left/1000);$('timer-value').textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');$('timer-value').dataset.expired=String(seconds===0);$('timer-toggle').textContent=c.end===null?'Iniciar tiempo':'Pausar tiempo';$('timer-label').textContent='Tiempo del bloque';}
 function show(index,focus=false){
  const next=Math.max(0,Math.min(slides.length-1,index)),phase=data[next].phase;
  if(activePhase!==null&&phase!==activePhase)pause(clocks[activePhase]);
  activePhase=phase;current=next;
  slides.forEach((s,i)=>{s.hidden=i!==current;s.classList.toggle('active',i===current);s.setAttribute('aria-hidden',String(i!==current));});
  $('counter').textContent=(current+1)+' / '+slides.length;$('jump').value=current;$('prev').disabled=current===0;$('next').disabled=current===slides.length-1;
  $('phase-label').textContent=phases[phase].name+' · '+phases[phase].start+'–'+phases[phase].end+' min';
  slides[current].querySelector('.slide-content').scrollTop=0;
  history.replaceState(null,'','#diapositiva-'+(current+1));paintClock();
  if(focus)slides[current].querySelector('h1').focus({preventScroll:true});
 }
 $('prev').onclick=()=>show(current-1);$('next').onclick=()=>show(current+1);$('jump').onchange=()=>show(Number($('jump').value));
 $('timer-toggle').onclick=()=>{const c=clocks[activePhase];if(c.end!==null)pause(c);else if(c.remaining>0)c.end=Date.now()+c.remaining;paintClock();};
 $('timer-reset').onclick=()=>{clocks[activePhase]={remaining:phases[activePhase].seconds*1000,end:null};paintClock();};
 setInterval(paintClock,250);
 $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').title='Use la opción de pantalla completa de su navegador';}};
 const modal=$('image-modal');
 function zoom(img){lastImage=img;$('large-image').src=img.src;$('large-image').alt=img.alt;modal.showModal();}
 document.querySelectorAll('.zoomable').forEach(img=>{img.addEventListener('click',()=>zoom(img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();zoom(img);}});});
 $('close-image').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});modal.addEventListener('close',()=>lastImage?.focus());
 document.addEventListener('keydown',e=>{if(modal.open||e.ctrlKey||e.altKey||e.metaKey||/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.target.tagName)||e.target.isContentEditable)return;let index=null;if(['ArrowRight','PageDown',' '].includes(e.key))index=current+1;if(['ArrowLeft','PageUp'].includes(e.key))index=current-1;if(e.key==='Home')index=0;if(e.key==='End')index=slides.length-1;if(index!==null){e.preventDefault();show(index,true);}});
 function hash(){const m=location.hash.match(/^#diapositiva-(\d+)$/);show(m?Number(m[1])-1:0);}
 window.addEventListener('hashchange',hash);hash();
})();
