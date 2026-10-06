(function(){
  'use strict';
  const params=new URLSearchParams(location.search);
  const validCourse=value=>Object.hasOwn(window.MANUAL_COURSES,String(value||'').toUpperCase())?String(value).toUpperCase():'4C';
  let course=validCourse(params.get('curso'));
  const select=document.getElementById('course');
  if(select)select.replaceChildren(...Object.entries(window.MANUAL_COURSES).map(([code,item])=>{const option=document.createElement('option');option.value=code;option.textContent=item.name;return option;}));
  const all=(selector)=>[...document.querySelectorAll(selector)];
  const fill=(selector,value)=>all(selector).forEach(element=>{element.textContent=value;});
  const briefCourses=new Set(['4C','4D']);
  const briefTexts=new Map(all('[data-brief-text]').map(el=>[el,el.dataset.briefText]));
  all('.guide-intro').forEach(el=>briefTexts.set(el,'Cada grupo trabaja en su guía impresa. Lean las páginas 1 y 2 y completen las tres hojas de respuesta.'));
  all('[data-monitoring]').forEach(el=>briefTexts.set(el,'Completen la guía en grupo. El docente revisará sus respuestas mientras trabajan. No operen equipos.'));
  all('[data-worksheet-instructions]').forEach(el=>{el.dataset.briefMinutes='65';});
  const textDefaults=new Map([...briefTexts.keys()].map(el=>[el,[...el.childNodes].map(node=>node.cloneNode(true))]));
  const minuteDefaults=new Map(all('[data-brief-minutes]').map(el=>[el,el.dataset.minutes]));
  let syncDeck=()=>{};
  function showBriefLayout(){
    const brief=briefCourses.has(course);
    document.body.dataset.manualFlow=brief?'brief':'standard';
    all('[data-extended-only]').forEach(el=>{el.hidden=brief;});
    all('[data-brief-only]').forEach(el=>{el.hidden=!brief;});
    for(const [el,nodes] of textDefaults){if(brief)el.textContent=briefTexts.get(el);else el.replaceChildren(...nodes.map(node=>node.cloneNode(true)));}
    for(const [el,minutes] of minuteDefaults)el.dataset.minutes=brief?el.dataset.briefMinutes:minutes;
  }
  const guideImage=document.querySelector('[data-guide-preview]');
  let guidePage=Math.max(1,Math.min(5,parseInt(params.get('guia'),10)||1));
  function guideInstructions(item){return [
    {title:'Página 1 · Lean y comprendan',steps:[
      ['Completen la identificación','Escriban nombres, curso, fecha y grupo.','Datos de sus integrantes.'],
      ['Lean el objetivo y las instrucciones','Reconozcan qué harán y cómo trabajarán.','Cuadros «Objetivo» e «Instrucciones» de esta página.'],
      ['Lean y comprendan el texto','Identifiquen para qué sirve el equipo, sus acciones y riesgos.','Cuatro secciones del texto de esta página.'],
      ['Reconozcan la fuente','Identifiquen fabricante, manual y páginas o secciones.','Referencia al final de esta página.']
    ]},
    {title:'Página 2 · Observen y consulten',steps:[
      ['Observen el plano','Relacionen cada número con el nombre de la parte.','Plano y leyenda de esta página.'],
      ['Comprendan el vocabulario','Consulten las palabras que no conocen antes de redactar.','Cuadro «Vocabulario de apoyo».'],
      ['Comparen las imágenes','Distingan el equipo completo (A) de su detalle (B).','Cuadro «Imágenes para explicar».']
    ]},
    {title:'Hoja 1 · Redacten con palabras propias',steps:[
      ['Redacten la función','Escriban dos frases: qué hace el equipo y para qué sirve.','Página 1: «'+item.sections[0][0]+'».'],
      ['Reescriban cuatro indicaciones','Elijan acciones del texto, ordénenlas y comiencen con un verbo. No inventen acciones.','Texto de la página 1: preparación, advertencias y cuidado.'],
      ['Anoten una duda','Escriban qué no comprendieron o necesitan comprobar.','La dificultad que encontraron al leer.']
    ]},
    {title:'Hoja 2 · Identifiquen y expliquen',steps:[
      ['Observen las seis partes','Ubiquen cada número en el plano.','Plano de la página 2 y de esta hoja.'],
      ['Escriban los nombres','Relacionen cada número con su parte.','Leyenda del plano en la página 2.'],
      ['Redacten las funciones','Expliquen qué hace cada parte, con palabras propias.','Lectura de la página 1 y leyenda de la página 2.']
    ]},
    {title:'Hoja 3 · Seguridad, imágenes y fuente',steps:[
      ['Redacten los apartados 4, 5 y 6','Escriban dos advertencias, un cuidado y cuándo pedir ayuda.','Página 1: «'+item.sections[2][0]+'» y límites de la lectura.'],
      ['Expliquen las imágenes','Digan qué muestra A. Relacionen B con una indicación y expliquen por qué la aclara.','Imágenes de la página 2 e indicaciones de su hoja 1.'],
      ['Registren la fuente','Anoten la página o sección realmente consultada. No inventen un número.','Referencia de la página 1; si abren el manual, usen su página o sección real.']
    ]}
  ];}
  function showGuidePage(number=guidePage){
    if(!guideImage||!window.MANUAL_GUIDE_PREVIEWS?.courses[course])return;
    guidePage=Math.max(1,Math.min(5,Number(number)||1));
    const item=window.MANUAL_COURSES[course],preview=window.MANUAL_GUIDE_PREVIEWS.courses[course].pages[guidePage-1],help=guideInstructions(item)[guidePage-1];
    guideImage.src=preview.file;guideImage.alt=`Página ${guidePage} de la guía de ${item.name}; los números y flechas señalan las secciones explicadas`;
    fill('[data-guide-caption]',`Guía real · página ${guidePage} de 5 · ${item.name}`);fill('[data-guide-title]',help.title);
    all('[data-guide-open]').forEach(link=>{link.href=preview.file;});
    all('[data-guide-page]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.guidePage)===guidePage)));
    all('[data-guide-markers]').forEach(container=>{container.replaceChildren(...preview.markers.map(marker=>{const pin=document.createElement('span');pin.className='guide-pin';pin.textContent=String(marker.id);pin.style.left=marker.x+'%';pin.style.top=marker.y+'%';pin.dataset.guideMarker=String(marker.id);return pin;}));});
    all('[data-guide-callouts]').forEach(container=>{container.replaceChildren(...help.steps.map(([action,task,source],index)=>{const li=document.createElement('li'),heading=document.createElement('strong'),instruction=document.createElement('p'),from=document.createElement('p'),label=document.createElement('strong');li.dataset.guideCallout=String(index+1);heading.textContent=action;instruction.textContent=task;from.className='guide-source';label.textContent='De dónde: ';from.append(label,document.createTextNode(source));li.append(heading,instruction,from);return li;}));});
    params.set('guia',String(guidePage));history.replaceState(null,'',location.pathname+'?'+params.toString()+location.hash);
  }
  all('[data-guide-page]').forEach(button=>button.addEventListener('click',()=>showGuidePage(button.dataset.guidePage)));
  function showCourse(){
    const item=window.MANUAL_COURSES[course];
    if(select)select.value=course;
    fill('[data-course-name]',item.name);fill('[data-equipment]',item.equipment);fill('[data-credit]',item.credit);fill('[data-reference]',item.reference);
    for(const [attribute,key,alt] of [['photo','photo','alt'],['detail','detail','detailAlt'],['diagram','diagram',null]]){
      all(`[data-${attribute}]`).forEach(img=>{img.src=item[key];img.alt=alt?item[alt]:`Ilustración didáctica de IA para identificar seis partes de ${item.equipment}; sin escala`;});
    }
    all('[data-source]').forEach(link=>{link.href=item.source;link.textContent=item.sourceName;});
    all('[data-original-photo]').forEach(link=>{link.href=item.originalPhoto;});
    all('[data-course-pdf]').forEach(link=>{const kind=link.dataset.coursePdf;link.href=`assets/guia-${course.toLowerCase()}-${kind}.pdf`;link.download=`guia-${course.toLowerCase()}-${kind}.pdf`;});
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
    showGuidePage();
    params.set('curso',course);history.replaceState(null,'',location.pathname+'?'+params.toString()+location.hash);
    showBriefLayout();syncDeck();
  }
  if(select)select.addEventListener('change',()=>{course=validCourse(select.value);showCourse();});
  showCourse();
  all('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
  const allSlides=all('.slide');
  if(!allSlides.length)return;
  let slides=allSlides.filter(slide=>!slide.hidden);
  const requestedIndex=Math.max(0,Math.min(allSlides.length-1,(parseInt(params.get('slide'),10)||1)-1));
  let current=slides.indexOf(allSlides[requestedIndex]);
  if(current<0)current=Math.max(0,slides.findIndex(slide=>allSlides.indexOf(slide)>requestedIndex));
  const previous=document.getElementById('prev'),next=document.getElementById('next'),counter=document.getElementById('counter');
  function show(index){current=Math.max(0,Math.min(slides.length-1,index));allSlides.forEach(slide=>{const active=slide===slides[current];slide.classList.toggle('active',active);slide.setAttribute('aria-hidden',String(!active));});previous.disabled=current===0;next.disabled=current===slides.length-1;counter.textContent=`${current+1} / ${slides.length}`;params.set('slide',String(allSlides.indexOf(slides[current])+1));history.replaceState(null,'',location.pathname+'?'+params.toString());slides[current].scrollTop=0;}
  syncDeck=()=>{const active=slides[current];slides=allSlides.filter(slide=>!slide.hidden);const preserved=slides.indexOf(active);show(preserved>=0?preserved:current);};
  previous.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
  document.getElementById('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('fullscreen').textContent='Pantalla completa no disponible';}});
  document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||/INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName)||event.target.isContentEditable)return;if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();show(current+1);}if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();show(current-1);}if(event.key==='Home')show(0);if(event.key==='End')show(slides.length-1);});
  show(current);
})();
