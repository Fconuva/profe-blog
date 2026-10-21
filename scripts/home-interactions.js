import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const control=document.getElementById('motion-toggle');
let media, played=false;
function setup(){
  if(reduce.matches||document.documentElement.classList.contains('motion-paused'))return;
  control.hidden=false;
  media=gsap.matchMedia();
  media.add({desktop:'(min-width: 900px)',all:'(min-width: 0px)'},context=>{
    const cleanups=[];
    document.documentElement.classList.add('motion-ready');
    if(!played){
      gsap.fromTo('.title-line',{yPercent:110,rotation:3},{yPercent:0,rotation:0,duration:1.15,stagger:.13,ease:'power4.out',clearProps:'transform'});
      gsap.fromTo('.hero-lead,.hero .button-row',{y:30,opacity:.25},{y:0,opacity:1,duration:1,delay:.32,stagger:.12,ease:'power3.out',clearProps:'transform,opacity'});
      played=true;
    }
    gsap.to('.hero-art',{yPercent:19,scale:1.12,ease:'none',scrollTrigger:{trigger:'#inicio',start:'top top',end:'bottom top',scrub:true,onUpdate:self=>window.dispatchEvent(new CustomEvent('profe:heroprogress',{detail:{progress:self.progress}}))}});
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
    if(context.conditions.desktop){
      const section=document.querySelector('#proceso');
      const viewport=section.querySelector('.process-viewport');
      const track=section.querySelector('.process-track');
      section.classList.add('has-gallery');
      const distance=()=>Math.max(0,track.scrollWidth-viewport.clientWidth);
      const pan=gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{id:'process-gallery',trigger:section,start:'top top',end:()=>'+='+distance(),pin:true,scrub:.75,invalidateOnRefresh:true,onUpdate:self=>{
        const index=Math.min(3,Math.round(self.progress*3));
        document.querySelector('.process-count').textContent=String(index+1).padStart(2,'0')+' / 04';
        gsap.set('.process-progress span',{scaleX:self.progress});
      }}});
      track.querySelectorAll('.step img').forEach(image=>gsap.fromTo(image,{scale:1.12,rotation:.7},{scale:1,rotation:0,ease:'none',scrollTrigger:{trigger:image.closest('.step'),containerAnimation:pan,start:'left right',end:'center center',scrub:true}}));
      const focus=e=>{
        const step=e.target.closest('.step');
        if(!step||!e.target.matches(':focus-visible'))return;
        const offset=step.getBoundingClientRect().left-track.getBoundingClientRect().left;
        const position=Math.max(0,Math.min(distance(),offset-(viewport.clientWidth-step.clientWidth)/2));
        window.scrollTo({top:pan.scrollTrigger.start+position,behavior:'instant'});
        ScrollTrigger.update();pan.scrollTrigger.getTween()?.progress(1);
      };
      track.addEventListener('focusin',focus);cleanups.push(()=>track.removeEventListener('focusin',focus));
      cleanups.push(()=>section.classList.remove('has-gallery'));
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
function changed(e){cleanup();if(e.detail.active)setup();}
window.addEventListener('profe:motionchange',changed);
reduce.addEventListener('change',()=>{cleanup();if(!reduce.matches)setup();else control.hidden=true;});
window.addEventListener('pagehide',e=>{if(!e.persisted)cleanup();});
setup();
