import {
  WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, BoxGeometry, CylinderGeometry,
  Mesh, Group, MeshStandardMaterial, FrontSide, BackSide, AmbientLight, PointLight,
  BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, CanvasTexture, SRGBColorSpace, AdditiveBlending
} from 'three';

// Campos abreviados del formato de Portabot y del panel propio. Siempre vacíos.
const pages=[
  {title:'Tu contexto',short:'Contexto docente',module:'PROFE FRANCISCO',fields:['Asignatura y curso','Objetivo de Aprendizaje','Fortalezas del curso','Dificultades e intereses']},
  {title:'Planificación',short:'M1 · Planificación',module:'MÓDULO 1',fields:['Curso y letra','Objetivos de Aprendizaje','Experiencias de aprendizaje','Fundamentación']},
  {title:'Clase grabada',short:'M2 · Clase grabada',module:'MÓDULO 2',fields:['Curso y letra','Objetivo de Aprendizaje','Objetivos de la clase','Sesgos y estereotipos de género']},
  {title:'Trabajo colaborativo',short:'M3 · Trabajo colaborativo',module:'MÓDULO 3',fields:['Problema o necesidad','Diálogo pedagógico','Evaluación conjunta','Aprendizajes profesionales']}
];
const canvas=document.getElementById('hero-canvas'),hero=document.getElementById('inicio');
const controls=document.getElementById('book-controls'),label=document.getElementById('book-label');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new WebGLRenderer({canvas,alpha:true,antialias:innerWidth>=768,powerPreference:'low-power'});}catch{}
if(renderer)start();

function makeTexture(page,index){
  const surface=document.createElement('canvas');surface.width=512;surface.height=768;
  const c=surface.getContext('2d');
  c.fillStyle='#f6f9fb';c.fillRect(0,0,512,768);
  c.fillStyle='#123a63';c.fillRect(0,0,512,85);
  c.fillStyle='#c5e4f4';c.font='600 17px Inter,Arial';c.fillText('PORTAFOLIO DOCENTE 2026',30,34);
  c.fillStyle='#fff';c.font='600 23px Inter,Arial';c.fillText(page.module,30,65);
  c.fillStyle='#123a63';c.font='600 29px Inter,Arial';c.fillText(page.title,30,135);
  page.fields.forEach((field,i)=>{
    const y=165+i*129;
    c.fillStyle='#dff1f5';c.fillRect(25,y,462,116);
    c.fillStyle='#1d2a33';c.font='600 18px Inter,Arial';c.fillText(field,40,y+27);
    c.fillStyle='#fff';c.fillRect(39,y+40,434,63);
    c.strokeStyle='#b6d3dd';c.lineWidth=1;c.strokeRect(39,y+40,434,63);
    c.fillStyle='#617586';c.font='13px Arial';c.fillText('B    I    U         ≡      ☷',48,y+57);
    c.strokeStyle='#dde6ec';c.beginPath();c.moveTo(39,y+65);c.lineTo(473,y+65);c.stroke();
  });
  c.fillStyle='#53687b';c.font='14px Inter,Arial';c.fillText('Vista ilustrativa de campos · '+String(index+1).padStart(2,'0'),30,716);
  c.font='12px Inter,Arial';c.fillText('El formato varía según la modalidad.',30,740);
  const texture=new CanvasTexture(surface);texture.colorSpace=SRGBColorSpace;
  texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  return texture;
}

async function start(){
  await document.fonts.ready;
  if(reduced.matches){renderer.dispose();return;}
  const mobile=innerWidth<768,scene=new Scene(),camera=new PerspectiveCamera(38,1,.1,30);
  camera.position.z=7;
  scene.add(new AmbientLight(0xc7e1ff,2.5));
  [[0xffffff,50,1,4,5],[0x6dbfff,30,-3,-1,3]].forEach(([color,power,x,y,z])=>{const light=new PointLight(color,power,20,2);light.position.set(x,y,z);scene.add(light);});
  const book=new Group();scene.add(book);
  const textures=pages.map(makeTexture),backs=textures.map(texture=>{const back=texture.clone();back.repeat.x=-1;back.offset.x=1;return back;});
  const w=1.4,h=2.1;
  const coverMaterial=new MeshStandardMaterial({color:0x174466,roughness:.33,metalness:.38,transparent:true});
  const edgeMaterial=new MeshStandardMaterial({color:0xe2ebf1,roughness:.6,transparent:true});
  [-1,1].forEach(side=>{
    const cover=new Mesh(new BoxGeometry(w+.08,h+.1,.05),coverMaterial);cover.position.set(side*w/2,0,-.1);book.add(cover);
    const stack=new Mesh(new BoxGeometry(w-.01,h-.02,.08),edgeMaterial);stack.position.set(side*w/2,0,-.04);book.add(stack);
  });
  const spine=new Mesh(new CylinderGeometry(.045,.045,h+.06,12),coverMaterial);spine.position.z=-.03;book.add(spine);
  function geometry(left=false){
    const geo=new PlaneGeometry(w,h,mobile?18:28,mobile?10:16),p=geo.attributes.position,uv=geo.attributes.uv;
    for(let i=0;i<p.count;i++){const u=(p.getX(i)+w/2)/w;p.setXYZ(i,(left?-1:1)*u*w,p.getY(i),Math.sin(u*Math.PI)*.055);if(left)uv.setX(i,1-uv.getX(i));}
    geo.computeVertexNormals();return geo;
  }
  const material=(map,side=FrontSide)=>new MeshStandardMaterial({map,side,roughness:.67,metalness:.02,transparent:true});
  const left=new Mesh(geometry(true),material(textures[0],BackSide));
  // La geometría izquierda invierte su normal al invertir el eje X.
  const right=new Mesh(geometry(),material(textures[2]));
  book.add(left,right);
  const turningGeometry=geometry();
  turningGeometry.clearGroups();turningGeometry.addGroup(0,turningGeometry.index.count,0);turningGeometry.addGroup(0,turningGeometry.index.count,1);
  const turnMaterials=[material(textures[1]),material(backs[1],BackSide)];
  const turning=new Mesh(turningGeometry,turnMaterials);turning.position.z=.014;book.add(turning);
  const flat=turningGeometry.attributes.position.array.slice();
  const count=mobile?1400:3200,positions=[],seeds=[];
  const random=n=>{const r=Math.sin(n*127.1+311.7)*43758.5453;return r-Math.floor(r);};
  for(let i=0;i<count;i++){const u=(i%80)/79,v=Math.floor(i/80)/Math.ceil(count/80);positions.push((u-.5)*w*2,(v-.5)*h,.045+Math.sin(u*Math.PI)*.04);seeds.push(random(i));}
  const nanoGeometry=new BufferGeometry();nanoGeometry.setAttribute('position',new Float32BufferAttribute(positions,3));nanoGeometry.setAttribute('seed',new Float32BufferAttribute(seeds,1));
  const uniforms={time:{value:0},formation:{value:0},burst:{value:0},size:{value:mobile?2.5:3.5}};
  const nanoMaterial=new ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:AdditiveBlending,
    vertexShader:`attribute float seed;uniform float time,formation,burst,size;varying float vSeed;varying float vAlpha;
      void main(){vSeed=seed;float f=smoothstep(0.,1.,clamp(formation*1.3-seed*.3,0.,1.));float a=seed*50.+time*.45;
      vec3 cloud=vec3(cos(a)*(2.+seed*1.8),sin(a*1.3)*(1.1+seed),sin(a*.8)*1.6);
      vec3 p=mix(cloud,position,f);float stream=step(.86,seed);p+=vec3(sin(a*2.),cos(a*1.8),sin(a))*sin(burst*3.14159)*stream*.8;
      vAlpha=(1.-f)*.95+stream*.4*burst;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=size*(1.+(1.-f)*.45);}`,
    fragmentShader:`varying float vSeed;varying float vAlpha;void main(){vec2 p=abs(gl_PointCoord-.5);if(max(p.x,p.y)>.47)discard;float edge=step(.22,max(p.x,p.y));vec3 c=mix(vec3(.3,.7,1.),vec3(.9,.97,1.),vSeed);gl_FragColor=vec4(c,vAlpha*(.3+edge*.7));}`
  });
  const nanos=new Points(nanoGeometry,nanoMaterial);book.add(nanos);
  let frame=0,active=!document.documentElement.classList.contains('motion-paused'),visible=true,destroyed=false,prepared=false;
  let time=0,previous=0,x=0,y=0,px=0,py=0,progress=0,current=0,flipping=false,direction=1,next=0,turnStart=0,lastFlip=0,burstStart=-10;
  function maps(){left.material.map=textures[current];right.material.map=textures[(current+2)%4];turnMaterials[0].map=textures[(current+1)%4];turnMaterials[1].map=backs[(current+1)%4];turning.rotation.y=0;label.textContent=pages[(current+1)%4].short;}
  function flip(dir){
    if(!active){flipping=false;current=(current+dir+4)%4;turningGeometry.attributes.position.array.set(flat);turningGeometry.attributes.position.needsUpdate=true;turningGeometry.computeVertexNormals();uniforms.burst.value=0;maps();renderer.render(scene,camera);return;}
    if(flipping)return;
    direction=dir;next=(current+dir+4)%4;flipping=true;turnStart=time;burstStart=time;
    if(dir<0){left.material.map=textures[next];turnMaterials[0].map=textures[current];turnMaterials[1].map=backs[current];right.material.map=textures[(current+1)%4];}
  }
  function resize(){
    const width=hero.clientWidth,height=hero.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,width<768?1.25:1.5));renderer.setSize(width,height,false);
    camera.aspect=width/height;camera.updateProjectionMatrix();
    book.scale.setScalar(width<768?.47:width<1100?.8:1.06);
    book.position.set(width<768?0:width<1100?1.3:1.95,width<768?-1.4:0,0);
  }
  function draw(now){
    frame=0;if(destroyed||!active||!visible||document.hidden)return;
    if(now-previous>=1000/(innerWidth<768?28:40)){
      time+=Math.min((now-previous)/1000,.06);previous=now;px+=(x-px)*.05;py+=(y-py)*.05;
      book.rotation.set(-.1+py*.13,-.16+Math.sin(time*.3)*.12+px*.3,-.055+Math.sin(time*.4)*.025-progress*.1);
      book.position.y=(innerWidth<768?-1.4:0)+Math.sin(time*.65)*.07;
      const formation=Math.min(1,time/3.8+progress*.25),opacity=Math.max(0,Math.min(1,(formation-.25)/.65));
      [coverMaterial,edgeMaterial,left.material,right.material,...turnMaterials].forEach(m=>m.opacity=opacity);
      uniforms.time.value=time;uniforms.formation.value=formation;uniforms.burst.value=Math.max(0,1-(time-burstStart)/1.5);
      if(!flipping&&formation===1&&time-lastFlip>8)flip(1);
      if(flipping){
        const t=Math.min(1,(time-turnStart)/1.5),ease=t*t*(3-2*t);
        turning.rotation.y=direction>0?-Math.PI*ease:-Math.PI*(1-ease);
        const p=turningGeometry.attributes.position;
        for(let i=0;i<p.count;i++){const u=flat[i*3]/w;p.setZ(i,flat[i*3+2]+Math.sin(u*Math.PI)*Math.sin(t*Math.PI)*.38);}
        p.needsUpdate=true;turningGeometry.computeVertexNormals();
        if(t===1){current=next;flipping=false;lastFlip=time;maps();}
      }
      renderer.render(scene,camera);
    }
    frame=requestAnimationFrame(draw);
  }
  function resume(){if(prepared&&!frame&&active&&visible&&!document.hidden&&!destroyed){previous=performance.now();frame=requestAnimationFrame(draw);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function move(e){const r=hero.getBoundingClientRect();x=(e.clientX-r.left)/r.width*2-1;y=(e.clientY-r.top)/r.height*2-1;}
  function motion(e){active=e.detail.active;if(active)resume();else stop();}
  function visibility(){if(document.hidden)stop();else resume();}
  function scroll(e){progress=e.detail.progress;}
  function page(e){flip(e.detail.direction);}
  function reduce(e){if(e.matches)destroy();}
  const resizeObserver=new ResizeObserver(resize),observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else stop();});
  function destroy(){
    if(destroyed)return;destroyed=true;stop();resizeObserver.disconnect();observer.disconnect();
    hero.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);
    window.removeEventListener('profe:motionchange',motion);window.removeEventListener('profe:heroprogress',scroll);window.removeEventListener('profe:bookpage',page);reduced.removeEventListener('change',reduce);
    const mats=new Set();scene.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));});mats.forEach(m=>m.dispose());[...textures,...backs].forEach(t=>t.dispose());renderer.dispose();
    canvas.classList.remove('ready');hero.classList.remove('has-sculpture');controls.hidden=true;
  }
  hero.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',visibility);
  window.addEventListener('profe:motionchange',motion);window.addEventListener('profe:heroprogress',scroll);window.addEventListener('profe:bookpage',page);reduced.addEventListener('change',reduce);
  window.addEventListener('pagehide',e=>{if(e.persisted)stop();else destroy();});window.addEventListener('pageshow',e=>{if(e.persisted)resume();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();destroy();},{once:true});
  resizeObserver.observe(hero);observer.observe(hero);resize();maps();
  try{await renderer.compileAsync(scene,camera);}catch{destroy();return;}
  if(destroyed)return;prepared=true;controls.hidden=false;canvas.classList.add('ready');hero.classList.add('has-sculpture');resume();
}
