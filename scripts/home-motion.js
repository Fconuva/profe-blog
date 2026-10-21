import {
  WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, Mesh, Group,
  MeshPhysicalMaterial, MeshBasicMaterial, DoubleSide, AmbientLight, PointLight,
  TorusGeometry, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial
} from 'three';

// Escultura de hojas con volumen real; Higgsfield queda como alternativa estática.
const canvas = document.getElementById('hero-canvas');
const hero = document.getElementById('inicio');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try { renderer = new WebGLRenderer({ canvas, alpha: true, antialias: innerWidth>=768, powerPreference: 'low-power' }); }
catch { /* La composición original permanece visible. */ }
if (renderer) start();

async function start() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, .1, 30);
  camera.position.z = 7;
  const sculpture = new Group();
  scene.add(sculpture);
  scene.add(new AmbientLight(0xb4d5ff, 2));
  [[0xc5ebff, 55, 1, 3, 4], [0x367fff, 38, -3, 0, 2], [0xffffff, 35, 3, -2, 1]].forEach(([color,power,x,y,z]) => {
    const light = new PointLight(color, power, 18, 2);
    light.position.set(x,y,z); scene.add(light);
  });
  const leaves = [];
  const mobile=innerWidth<768;
  const count=mobile?11:17;
  for (let i = 0; i < count; i++) {
    const geometry = new PlaneGeometry(1.8, 2.45, mobile?20:30, mobile?8:12);
    const position = geometry.attributes.position;
    for (let v = 0; v < position.count; v++) {
      const u = (position.getX(v) + .9) / 1.8;
      const y = position.getY(v);
      position.setXYZ(v, Math.sin(u * 1.25) * 1.65, y + Math.sin(u * Math.PI) * .09, (1 - Math.cos(u * 1.25)) * .85);
    }
    geometry.computeVertexNormals();
    const material = new MeshPhysicalMaterial({
      color: i % 5 === 0 ? 0x3775ba : i % 3 === 0 ? 0x78b5d7 : 0xd6ebf3,
      metalness: .38, roughness: .22, clearcoat: .8, side: DoubleSide
    });
    const leaf = new Mesh(geometry, material);
    leaf.position.y = (i - (count-1)/2) * .018;
    sculpture.add(leaf); leaves.push(leaf);
  }
  const orbit = new Group();
  const ring = new Mesh(new TorusGeometry(2.18,.008,6,120), new MeshBasicMaterial({color:0x7dbbd9,transparent:true,opacity:.42}));
  ring.rotation.x = 1.05; ring.rotation.y = .25;
  orbit.add(ring); sculpture.add(orbit);
  const positions = [];
  for (let i=0;i<36;i++) {
    const a=i*2.39996, r=2.25+(i%4)*.13;
    positions.push(Math.cos(a)*r, Math.sin(a)*r*.65, Math.sin(a*1.7)*.65);
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute('position',new Float32BufferAttribute(positions,3));
  const dust = new Points(dustGeometry,new PointsMaterial({color:0xbce8ff,size:.022,transparent:true,opacity:.65}));
  sculpture.add(dust);
  let frame=0, active=!document.documentElement.classList.contains('motion-paused'), visible=true, destroyed=false, prepared=false;
  let x=0,y=0,px=0,py=0,time=0,previous=0,progress=0;
  function resize() {
    const width=hero.clientWidth,height=hero.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio,width<768?1.25:1.5)); renderer.setSize(width,height,false);
    camera.aspect=width/height; camera.updateProjectionMatrix();
    sculpture.scale.setScalar(width<768 ? .6 : width<1100 ? .78 : 1);
    sculpture.position.set(width<768 ? .1 : width<1100 ? 1.25 : 1.65,width<768 ? -1.2 : .1,0);
  }
  function draw(now) {
    frame=0;
    if(destroyed||!active||!visible||document.hidden)return;
    if(now-previous>=1000/(innerWidth<768?28:40)) {
      time+=Math.min((now-previous)/1000,.05);previous=now;
      px+=(x-px)*.055;py+=(y-py)*.055;
      sculpture.rotation.set(.18+py*.17,-.48+Math.sin(time*.28)*.26+px*.38,-.24+Math.sin(time*.35)*.055-progress*.2);
      sculpture.position.y=(innerWidth<768?-1.2:.08)+Math.sin(time*.65)*.13+progress*.3;
      leaves.forEach((leaf,i)=>{
        leaf.rotation.y=(i-(count-1)/2)*(.16+progress*.075)+Math.sin(time*.7+i*.19)*.055;
        leaf.rotation.z=(i-(count-1)/2)*.012;
      });
      orbit.rotation.z=time*.08;dust.rotation.y=-time*.035;
      renderer.render(scene,camera);
    }
    frame=requestAnimationFrame(draw);
  }
  function resume(){if(prepared&&!frame&&active&&visible&&!document.hidden&&!destroyed){previous=performance.now();frame=requestAnimationFrame(draw);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function move(e){const rect=hero.getBoundingClientRect();x=(e.clientX-rect.left)/rect.width*2-1;y=(e.clientY-rect.top)/rect.height*2-1;}
  function visibility(){if(document.hidden)stop();else resume();}
  function motion(e){active=e.detail.active;if(active)resume();else stop();}
  function scrollProgress(e){progress=e.detail.progress;}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else stop();});
  const resizeObserver=new ResizeObserver(resize);
  function destroy(){
    if(destroyed)return;destroyed=true;stop();observer.disconnect();resizeObserver.disconnect();
    hero.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);
    window.removeEventListener('profe:motionchange',motion);window.removeEventListener('profe:heroprogress',scrollProgress);
    reduced.removeEventListener('change',reduce);
    scene.traverse(object=>{object.geometry?.dispose();if(object.material)object.material.dispose();});
    renderer.dispose();canvas.classList.remove('ready');hero.classList.remove('has-sculpture');
  }
  function reduce(e){if(e.matches)destroy();}
  hero.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',visibility);
  window.addEventListener('profe:motionchange',motion);window.addEventListener('profe:heroprogress',scrollProgress);
  reduced.addEventListener('change',reduce);
  window.addEventListener('pagehide',e=>{if(e.persisted)stop();else destroy();});
  window.addEventListener('pageshow',e=>{if(e.persisted)resume();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();destroy();},{once:true});
  resizeObserver.observe(hero);observer.observe(hero);resize();
  try { await renderer.compileAsync(scene,camera); }
  catch { destroy();return; }
  if(destroyed)return;
  prepared=true;
  renderer.render(scene,camera);canvas.classList.add('ready');hero.classList.add('has-sculpture');resume();
}
