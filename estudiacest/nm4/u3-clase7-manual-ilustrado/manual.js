(function(){
  'use strict';
  const params=new URLSearchParams(location.search);
  const validCourse=value=>Object.hasOwn(window.MANUAL_COURSES,String(value||'').toUpperCase())?String(value).toUpperCase():'4C';
  let course=validCourse(params.get('curso'));
  const select=document.getElementById('course');
  if(select)select.replaceChildren(...Object.entries(window.MANUAL_COURSES).map(([code,item])=>{const option=document.createElement('option');option.value=code;option.textContent=item.name;return option;}));
  const all=(selector)=>[...document.querySelectorAll(selector)];
  const fill=(selector,value)=>all(selector).forEach(element=>{element.textContent=value;});
  function showCourse(){
    const item=window.MANUAL_COURSES[course];
    if(select)select.value=course;
    fill('[data-course-name]',item.name);fill('[data-equipment]',item.equipment);fill('[data-credit]',item.credit);fill('[data-reference]',item.reference);
    for(const [attribute,key,alt] of [['photo','photo','alt'],['detail','detail','detailAlt'],['diagram','diagram',null]]){
      all(`[data-${attribute}]`).forEach(img=>{img.src=item[key];img.alt=alt?item[alt]:`Plano de identificación de ${item.equipment}, con seis números y sin escala`;});
    }
    all('[data-source]').forEach(link=>{link.href=item.source;link.textContent=item.sourceName;});
    all('[data-course-link]').forEach(link=>{
      const target=new URL(link.getAttribute('href'),location.href);target.searchParams.set('curso',course);link.href=target.pathname+target.search+target.hash;
    });
    all('[data-download]').forEach(link=>{const resource=item[link.dataset.download];link.href=resource;link.download=`${course}-${link.dataset.download}.${resource.split('.').pop()}`;});
    all('[data-reading]').forEach(container=>{
      container.replaceChildren();
      item.sections.forEach(([title,content])=>{const section=document.createElement('section');const heading=document.createElement('h2');const p=document.createElement('p');heading.textContent=title;p.textContent=content;section.append(heading,p);container.append(section);});
    });
    all('[data-parts]').forEach(container=>{container.replaceChildren();item.parts.forEach(content=>{const li=document.createElement('li');li.textContent=content;container.append(li);});});
    all('[data-vocabulary]').forEach(container=>{container.replaceChildren();item.vocabulary.forEach(([word,definition])=>{const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=word+': ';p.append(strong,document.createTextNode(definition));container.append(p);});});
    fill('[data-guided-original]',item.guidedOriginal);fill('[data-guided-question]',item.guidedQuestion);fill('[data-guided-answer]',item.guidedAnswer);
    params.set('curso',course);history.replaceState(null,'',location.pathname+'?'+params.toString()+location.hash);
  }
  if(select)select.addEventListener('change',()=>{course=validCourse(select.value);showCourse();});
  showCourse();
  all('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
  const slides=all('.slide');
  if(!slides.length)return;
  let current=Math.max(0,Math.min(slides.length-1,(parseInt(params.get('slide'),10)||1)-1));
  const previous=document.getElementById('prev'),next=document.getElementById('next'),counter=document.getElementById('counter');
  function show(index){current=Math.max(0,Math.min(slides.length-1,index));slides.forEach((slide,position)=>{slide.classList.toggle('active',position===current);slide.setAttribute('aria-hidden',String(position!==current));});previous.disabled=current===0;next.disabled=current===slides.length-1;counter.textContent=`${current+1} / ${slides.length}`;params.set('slide',String(current+1));history.replaceState(null,'',location.pathname+'?'+params.toString());slides[current].scrollTop=0;}
  previous.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
  document.getElementById('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('fullscreen').textContent='Pantalla completa no disponible';}});
  document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName)||event.target.isContentEditable)return;if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();show(current+1);}if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();show(current-1);}if(event.key==='Home')show(0);if(event.key==='End')show(slides.length-1);});
  show(current);
})();
