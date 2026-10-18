(() => {
 'use strict';
 const data=window.IA_CLASE;
 document.querySelectorAll('[data-objective]').forEach(el=>el.textContent=data.objetivo);
 document.querySelectorAll('[data-reflection]').forEach(el=>el.textContent=data.reflexion);
 const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
 const topics=document.querySelector('[data-topics]');
 if(topics)data.temas.forEach((topic,i)=>{
  const item=make('details',null,'topic');item.id=`tema-${i+1}`;
  item.append(make('summary',`${i+1}. ${topic.titulo}`));
  const content=make('div');content.append(make('p',topic.pregunta,'lead'));
  topic.fuentes.forEach((source,j)=>{
   const article=make('article',null,'reading'),heading=make('h3'),link=make('a',`${j+1}. ${source.nombre}`);
   link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';heading.append(link);
   article.append(heading,make('p',`${source.medio} · ${source.fecha} · ${source.tipo}`,'meta'),make('p',source.ayuda));content.append(article);
  });
  content.append(make('p',`Para contrastar: ${topic.contraste}`,'note'));item.append(content);topics.append(item);
 });
 const compact=document.querySelector('[data-organizer-compact]');
 if(compact)data.filasPantalla.forEach(([title,prompt])=>{const row=make('tr'),h=make('th',title);h.scope='row';row.append(h,make('td',prompt),make('td',prompt));compact.append(row);});
 const organizer=document.querySelector('[data-organizer-rows]');
 if(organizer)data.filas.forEach(([title,prompt])=>{const row=make('tr'),h=make('th',title);h.scope='row';row.append(h,make('td',prompt),make('td',prompt));organizer.append(row);});
 const slides=[...document.querySelectorAll('.slide')];if(!slides.length)return;
 const previous=document.querySelector('#prev'),next=document.querySelector('#next'),jump=document.querySelector('#jump'),counter=document.querySelector('#counter');let current=0;
 slides.forEach((slide,i)=>{const option=make('option',`${i+1}. ${slide.querySelector('h1,h2').textContent}`);option.value=String(i);jump.append(option);});
 function show(index,focus=false){
  current=Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((slide,i)=>{slide.hidden=i!==current;slide.classList.toggle('active',i===current);slide.setAttribute('aria-hidden',String(i!==current));});
  previous.disabled=current===0;next.disabled=current===slides.length-1;counter.textContent=`${current+1} / ${slides.length}`;jump.value=String(current);
  slides[current].scrollTop=0;history.replaceState(null,'',`#diapositiva-${current+1}`);
  if(focus)slides[current].querySelector('h1,h2').focus({preventScroll:true});
 }
 previous.addEventListener('click',()=>show(current-1,true));next.addEventListener('click',()=>show(current+1,true));jump.addEventListener('change',()=>show(Number(jump.value),true));
 document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.querySelector('#fullscreen').title='Usa F11 para pantalla completa';}});
 document.addEventListener('keydown',event=>{
  if(event.altKey||event.ctrlKey||event.metaKey||event.defaultPrevented||/^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY|A)$/.test(event.target.tagName)||event.target.isContentEditable||document.body.classList.contains('anotando'))return;
  const move={ArrowRight:1,PageDown:1,' ':1,ArrowLeft:-1,PageUp:-1}[event.key];
  if(move){event.preventDefault();show(current+move,true);}else if(event.key==='Home'){event.preventDefault();show(0,true);}else if(event.key==='End'){event.preventDefault();show(slides.length-1,true);}
 });
 const hash=()=>{const number=Number(location.hash.match(/^#diapositiva-(\d+)$/)?.[1]);show(Number.isInteger(number)&&number>0?number-1:0);};window.addEventListener('hashchange',hash);hash();
})();
