import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let media, played=false;
function setup(){
  if(reduce.matches)return;
  media=gsap.matchMedia();
  media.add({desktop:'(min-width: 900px)',all:'(min-width: 0px)'},context=>{
    const cleanups=[];
    document.documentElement.classList.add('motion-ready');
    if(!played){
      gsap.fromTo('.title-line',{yPercent:110,rotation:3},{yPercent:0,rotation:0,duration:1.15,stagger:.13,ease:'power4.out',clearProps:'transform'});
      gsap.fromTo('.hero-lead,.hero .button-row',{y:30,opacity:.25},{y:0,opacity:1,duration:1,delay:.32,stagger:.12,ease:'power3.out',clearProps:'transform,opacity'});
      played=true;
    }
    gsap.to('.hero-media',{yPercent:14,scale:1.06,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'bottom top',scrub:true}});
    gsap.to('.hero-content',{y:110,opacity:.18,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'bottom top',scrub:true}});
    document.querySelectorAll('.reveal').forEach(element=>{
      gsap.fromTo(element,{y:52,opacity:.35},{y:0,opacity:1,duration:.9,ease:'power3.out',clearProps:'transform,opacity',immediateRender:false,scrollTrigger:{trigger:element,start:'top 92%',once:true}});
    });
    document.querySelectorAll('h2').forEach(heading=>{
      if(!heading.dataset.motionWords){
        heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim());
        const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];
        while(walker.nextNode())nodes.push(walker.currentNode);
        nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(word);else{const span=document.createElement('span');span.className='motion-word';span.setAttribute('aria-hidden','true');span.textContent=word;fragment.append(span);}});node.replaceWith(fragment);});
        heading.dataset.motionWords='true';
      }
      gsap.fromTo(heading.querySelectorAll('.motion-word'),{opacity:.4},{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:heading,start:'top 88%',end:'top 52%',scrub:true}});
    });
    gsap.fromTo('.trust-visual img',{yPercent:-9,scale:1.2},{yPercent:9,scale:1.12,ease:'none',scrollTrigger:{trigger:'.trust-visual',start:'top bottom',end:'bottom top',scrub:.5}});
    // La figura 3D del proceso alarga la sección al partir: hay que recalcular los disparadores de abajo.
    const relayout=()=>ScrollTrigger.refresh();
    window.addEventListener('process3d:ready',relayout);cleanups.push(()=>window.removeEventListener('process3d:ready',relayout));
    if(context.conditions.desktop){
      if(matchMedia('(hover:hover) and (pointer:fine)').matches){
        const aura=document.createElement('div');aura.className='pointer-aura';aura.setAttribute('aria-hidden','true');document.body.append(aura);
        const ax=gsap.quickTo(aura,'x',{duration:.22,ease:'power3'}),ay=gsap.quickTo(aura,'y',{duration:.22,ease:'power3'});
        const show=gsap.quickTo(aura,'opacity',{duration:.2});
        const pointer=e=>{ax(e.clientX);ay(e.clientY);show(1);};
        const leave=()=>show(0);
        document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',leave);
        cleanups.push(()=>{document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',leave);aura.remove();});
        document.querySelectorAll('.button,.module,.review-price').forEach(element=>{
          const isButton=element.classList.contains('button');
          const x=gsap.quickTo(element,isButton?'x':'rotationY',{duration:.45,ease:'power3'});
          const y=gsap.quickTo(element,isButton?'y':'rotationX',{duration:.45,ease:'power3'});
          const move=e=>{const r=element.getBoundingClientRect();x((e.clientX-r.left-r.width/2)/r.width*(isButton?20:7));y((e.clientY-r.top-r.height/2)/r.height*(isButton?15:-7));aura.classList.add('is-over');};
          const reset=()=>{x(0);y(0);aura.classList.remove('is-over');};
          element.addEventListener('pointermove',move);element.addEventListener('pointerleave',reset);
          cleanups.push(()=>{element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',reset);});
        });
      }
    }
    document.fonts.ready.then(()=>ScrollTrigger.refresh());
    return ()=>{cleanups.forEach(fn=>fn());document.documentElement.classList.remove('motion-ready');};
  });
}
function cleanup(){if(media){media.revert();media=null;}}
reduce.addEventListener('change',()=>{cleanup();if(!reduce.matches)setup();});
window.addEventListener('pagehide',e=>{if(!e.persisted)cleanup();});
setup();
