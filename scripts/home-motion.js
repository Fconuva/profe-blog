import {
  WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, BoxGeometry, CylinderGeometry,
  Mesh, Group, MeshStandardMaterial, FrontSide, BackSide, DoubleSide, AmbientLight, PointLight,
  CanvasTexture, SRGBColorSpace,
  InstancedMesh, SphereGeometry, Object3D
} from 'three';

// Campos abreviados del formato de Portabot y del panel propio. Siempre vacíos.
const pages=[
  {title:'Tu contexto',short:'Contexto docente',module:'PROFE FRANCISCO',fields:['Asignatura y curso','Objetivo de Aprendizaje','Fortalezas del curso','Dificultades e intereses']},
  {title:'Planificación',short:'M1 · Planificación',module:'MÓDULO 1',fields:['Curso y letra','Objetivos de Aprendizaje','Experiencias de aprendizaje','Fundamentación']},
  {title:'Clase grabada',short:'M2 · Clase grabada',module:'MÓDULO 2',fields:['Curso y letra','Objetivo de Aprendizaje','Objetivos de la clase','Sesgos y estereotipos de género']},
  {title:'Trabajo colaborativo',short:'M3 · Trabajo colaborativo',module:'MÓDULO 3',fields:['Problema o necesidad','Diálogo pedagógico','Evaluación conjunta','Aprendizajes profesionales']}
];
const canvas=document.getElementById('hero-canvas'),hero=document.getElementById('inicio');
const preview=document.getElementById('book-preview'),label=document.getElementById('book-label');
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
  const assembly={progress:{value:0},time:{value:0}};
  function assemble(m){
    m.onBeforeCompile=shader=>{
      shader.uniforms.uFormation=assembly.progress;shader.uniforms.uFlowTime=assembly.time;
      shader.vertexShader='varying vec2 vAssemblyUv;\n'+shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvAssemblyUv=uv;');
      shader.fragmentShader='uniform float uFormation,uFlowTime;varying vec2 vAssemblyUv;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float flow=vAssemblyUv.y+sin(vAssemblyUv.x*13.+uFlowTime*1.8)*.025+sin(vAssemblyUv.x*29.-uFlowTime)*.012;
        float front=uFormation*1.25-.15;
        if(flow>front)discard;
        float rim=exp(-abs(flow-front)*70.);
        diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.67,.82,.91),rim*.9);`).replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance+=vec3(.35,.65,.8)*rim*.55;');
    };
    m.customProgramCacheKey=()=> 'fluid-assembly-v1';return m;
  }
  const coverMaterial=new MeshStandardMaterial({color:0x174466,roughness:.33,metalness:.38,transparent:true});
  const edgeMaterial=new MeshStandardMaterial({color:0xe2ebf1,roughness:.6,transparent:true});
  [-1,1].forEach(side=>{
    const cover=new Mesh(new BoxGeometry(w+.08,h+.1,.05),coverMaterial);cover.position.set(side*w/2,0,-.1);book.add(cover);
    const stack=new Mesh(new BoxGeometry(w-.01,h-.02,.08),edgeMaterial);stack.position.set(side*w/2,0,-.04);book.add(stack);
  });
  const spine=new Mesh(new CylinderGeometry(.045,.045,h+.06,12),coverMaterial);spine.position.z=-.03;book.add(spine);
  function geometry(left=false){
    const geo=new PlaneGeometry(w,h,mobile?18:28,mobile?10:16),p=geo.attributes.position,uv=geo.attributes.uv;
    for(let i=0;i<p.count;i++){const u=(p.getX(i)+w/2)/w;p.setXYZ(i,(left?-1:1)*u*w,p.getY(i),Math.sin(u*Math.PI)*.055+u*.13);if(left)uv.setX(i,1-uv.getX(i));}
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
  [coverMaterial,edgeMaterial,left.material,right.material,...turnMaterials].forEach(assemble);
  const liquid=new Group();book.add(liquid);
  // Reflejo de estudio analítico: evita generar mapas de entorno al arrancar en móvil.
  const metal=new MeshStandardMaterial({color:0xb9d0df,metalness:.6,roughness:.23,side:DoubleSide,transparent:true,depthWrite:false});
  metal.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nfloat studioReflection=pow(.5+.5*sin(normal.x*5.+normal.y*2.+normal.z*4.),6.);\ntotalEmissiveRadiance+=vec3(.32,.42,.48)*studioReflection;');};
  const segments=mobile?32:56,ribbons=[];
  for(let lane=0;lane<4;lane++){
    const geometry=new PlaneGeometry(1,1,segments,1),mesh=new Mesh(geometry,metal);mesh.frustumCulled=false;liquid.add(mesh);ribbons.push(mesh);
  }
  const droplets=new InstancedMesh(new SphereGeometry(1,8,6),metal,mobile?24:48);droplets.frustumCulled=false;liquid.add(droplets);
  const droplet=new Object3D();
  let frame=0,visible=true,destroyed=false,prepared=false;
  let time=0,previous=0,x=0,y=0,px=0,py=0,progress=0,current=0,flipping=false,next=0,turnStart=0,lastFlip=0;
  function maps(){left.material.map=textures[current];right.material.map=textures[(current+2)%4];turnMaterials[0].map=textures[(current+1)%4];turnMaterials[1].map=backs[(current+1)%4];turning.rotation.y=0;label.textContent=pages[(current+1)%4].short;}
  function flip(){
    if(flipping)return;
    next=(current+1)%4;flipping=true;turnStart=time;
  }
  function flowPoint(u,lane,formation,turn){
    const side=flipping?1:lane<2?-1:1;
    const phase=time*2.2+lane*1.7;
    const front=(flipping?turn:formation)*2.625-1.365,fieldU=side<0?1-u:u;
    const wave=-Math.sin(fieldU*13+time*1.8)*.0525-Math.sin(fieldU*29-time)*.0252;
    return [side*u*w,front+wave+(lane%2-.5)*.024,.055+u*.13+Math.sin(u*Math.PI)*(.055+(1-formation)*.35+(flipping?Math.sin(turn*Math.PI)*.38:0))+Math.sin(u*7-phase)*.008];
  }
  function updateLiquid(formation,turn){
    assembly.progress.value=formation;assembly.time.value=time;
    const presence=formation<1?Math.sin(Math.PI*formation)**.45:flipping?Math.sin(turn*Math.PI)*.65:0;
    liquid.visible=presence>.01;metal.opacity=presence;
    if(!liquid.visible)return;
    liquid.rotation.y=flipping?turning.rotation.y:0;
    ribbons.forEach((mesh,lane)=>{
      const p=mesh.geometry.attributes.position;
      for(let i=0;i<p.count;i++){
        const u=(i%(segments+1))/segments,edge=i>segments?1:-1;
        const point=flowPoint(u,lane,formation,turn);
        point[1]+=edge*Math.sin(Math.PI*u)*(.012+.009*Math.sin(u*8+time+lane));
        point[2]+=edge*.012;
        p.setXYZ(i,...point);
      }
      p.needsUpdate=true;mesh.geometry.computeVertexNormals();
    });
    for(let i=0;i<droplets.count;i++){
      const u=(i/droplets.count+time*.12)%1,lane=i%4,point=flowPoint(u,lane,formation,turn);
      point[1]+=Math.sin(i*7.17+time*2)*.045;point[2]+=.025+Math.cos(i*3.7)*.025;
      droplet.position.set(...point);droplet.rotation.set(.1,i*.7,time*.3);
      const size=.005+(Math.sin(i*4.5)+1)*.003;droplet.scale.set(size*2.5,size,size*.7);droplet.updateMatrix();droplets.setMatrixAt(i,droplet.matrix);
    }
    droplets.instanceMatrix.needsUpdate=true;
  }
  function resize(){
    const width=hero.clientWidth,height=hero.clientHeight;renderer.setPixelRatio(Math.min(devicePixelRatio,width<768?1.25:1.5));renderer.setSize(width,height,false);
    camera.aspect=width/height;camera.updateProjectionMatrix();
    book.scale.setScalar(width<768?.47:width<1100?.8:1.06);
    book.position.set(width<768?0:width<1100?1.3:1.95,width<768?-1.4:0,0);
  }
  function draw(now){
    frame=0;if(destroyed||!visible||document.hidden)return;
    if(now-previous>=1000/(innerWidth<768?28:40)){
      time+=Math.min((now-previous)/1000,.06);previous=now;px+=(x-px)*.05;py+=(y-py)*.05;
      book.rotation.set(.12+py*.13,-.32+Math.sin(time*.3)*.15+px*.3,-.055+Math.sin(time*.4)*.025-progress*.1);
      book.position.y=(innerWidth<768?-1.4:0)+Math.sin(time*.65)*.07;
      const formation=Math.min(1,time/2.8+progress*.25);
      if(!flipping&&formation===1&&time-lastFlip>4.5)flip();
      let turn=0;
      if(flipping){
        const t=Math.min(1,(time-turnStart)/1.85),ease=t*t*(3-2*t);turn=t;
        turning.rotation.y=-Math.PI*ease;
        const p=turningGeometry.attributes.position;
        for(let i=0;i<p.count;i++){const u=flat[i*3]/w;p.setZ(i,flat[i*3+2]+Math.sin(u*Math.PI)*Math.sin(t*Math.PI)*.38);}
        p.needsUpdate=true;turningGeometry.computeVertexNormals();
        if(t===1){current=next;flipping=false;lastFlip=time;maps();}
      }
      updateLiquid(formation,turn);
      renderer.render(scene,camera);
    }
    frame=requestAnimationFrame(draw);
  }
  function resume(){if(prepared&&!frame&&visible&&!document.hidden&&!destroyed){previous=performance.now();frame=requestAnimationFrame(draw);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function move(e){const r=hero.getBoundingClientRect();x=(e.clientX-r.left)/r.width*2-1;y=(e.clientY-r.top)/r.height*2-1;}
  function visibility(){if(document.hidden)stop();else resume();}
  function scroll(e){progress=e.detail.progress;}
  function reduce(e){if(e.matches)destroy();}
  const resizeObserver=new ResizeObserver(resize),observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else stop();});
  function destroy(){
    if(destroyed)return;destroyed=true;stop();resizeObserver.disconnect();observer.disconnect();
    hero.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);
    window.removeEventListener('profe:heroprogress',scroll);reduced.removeEventListener('change',reduce);
    const mats=new Set();scene.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));});mats.forEach(m=>m.dispose());[...textures,...backs].forEach(t=>t.dispose());renderer.dispose();
    canvas.classList.remove('ready');hero.classList.remove('has-sculpture');preview.hidden=true;
  }
  hero.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',visibility);
  window.addEventListener('profe:heroprogress',scroll);reduced.addEventListener('change',reduce);
  window.addEventListener('pagehide',e=>{if(e.persisted)stop();else destroy();});window.addEventListener('pageshow',e=>{if(e.persisted)resume();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();destroy();},{once:true});
  resizeObserver.observe(hero);observer.observe(hero);resize();maps();
  try{await renderer.compileAsync(scene,camera);}catch{destroy();return;}
  if(destroyed)return;prepared=true;preview.hidden=false;canvas.classList.add('ready');hero.classList.add('has-sculpture');resume();
}
