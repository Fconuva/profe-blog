import { WebGLRenderer, Scene, PerspectiveCamera, PlaneGeometry, Mesh, ShaderMaterial, TextureLoader, Vector2, SRGBColorSpace } from 'three';
import { getProject } from '@theatre/core';
import { css } from 'goober';

// Tres capas acotadas: Three dibuja; Theatre secuencia la entrada; Goober estiliza el control.
const canvas = document.getElementById('hero-canvas');
const hero = document.getElementById('inicio');
const toggle = document.getElementById('motion-toggle');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try { renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' }); }
catch { /* La imagen estática ya está en el HTML. */ }
if (renderer) start();

async function start() {
  let texture;
  try { texture = await new TextureLoader().loadAsync('/imagenes/portada-2026/obra-1920.webp'); }
  catch { renderer.dispose(); return; }
  texture.colorSpace = SRGBColorSpace;
  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 10);
  camera.position.z = 2.6;
  const geometry = new PlaneGeometry(4, 2.25, 48, 24);
  const uniforms = {
    art: { value: texture }, time: { value: 0 }, pointer: { value: new Vector2() },
    reveal: { value: 0 }, crop: { value: new Vector2(1, 1) }
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 vUv; uniform float time; uniform vec2 pointer;
      void main(){vUv=uv; vec3 p=position;
        p.z+=sin(p.x*1.8+time*.18)*.025+pointer.x*p.x*.018;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
    fragmentShader: `varying vec2 vUv; uniform sampler2D art; uniform vec2 crop;
      uniform float reveal; uniform vec2 pointer;
      void main(){vec2 uv=(vUv-.5)*crop+.5;
        uv+=pointer*.003; vec4 color=texture2D(art,clamp(uv,.001,.999));
        gl_FragColor=vec4(color.rgb,reveal);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);
  const state = {
    definitionVersion: '0.4.0', revisionHistory: [],
    sheetsById: { Entrada: { staticOverrides: { byObject: {} }, sequence: {
      type: 'PositionalSequence', length: 2.5, subUnitsPerUnit: 30,
      tracksByObject: { Obra: { trackIdByPropPath: { '["reveal"]': 'reveal' }, trackData: {
        reveal: { type: 'BasicKeyframedTrack', keyframes: [
          { id: 'inicio', position: 0, connectedRight: true, handles: [.5, 1, .5, 0], value: 0 },
          { id: 'fin', position: 2.5, connectedRight: false, handles: [.5, 1, .5, 0], value: 1 }
        ] }
      } } }
    } } }
  };
  const project = getProject('Portada Profe Francisco', { state });
  const sheet = project.sheet('Entrada');
  const object = sheet.object('Obra', { reveal: 0 });
  const unsubscribe = object.onValuesChange(value => { uniforms.reveal.value = value.reveal; });
  await project.ready;
  const control = css({
    '&:hover': { background: 'rgba(175,216,239,.12)', borderColor: '#afd8ef' },
    '&:focus-visible': { outline: '3px solid #afd8ef', outlineOffset: '5px' }
  });
  toggle.classList.add(control);
  toggle.hidden = false;
  let frame = 0;
  let active = true;
  let visible = true;
  let destroyed = false;
  let x = 0, y = 0, px = 0, py = 0, time = 0, previous = 0;
  function resize() {
    const width = hero.clientWidth, height = hero.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const planeHeight = 2 * camera.position.z * Math.tan(Math.PI / 8);
    mesh.scale.set(planeHeight * camera.aspect / 4 * 1.035, planeHeight / 2.25 * 1.035, 1);
    const aspect = width / height;
    const imageAspect = texture.image.width / texture.image.height;
    uniforms.crop.value.set(Math.min(1, aspect / imageAspect), Math.min(1, imageAspect / aspect));
  }
  function draw(now) {
    if (destroyed) return;
    frame = 0;
    if (!active || !visible || document.hidden) return;
    if (now - previous >= 1000 / 35) {
      time += Math.min((now - previous) / 1000, .04);
      previous = now;
      px += (x - px) * .065; py += (y - py) * .065;
      uniforms.pointer.value.set(px, py);
      uniforms.time.value = time;
      mesh.rotation.y = px * .012;
      mesh.rotation.x = py * .01;
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(draw);
  }
  function resume() { if (!frame && active && visible && !document.hidden) { previous = performance.now(); frame = requestAnimationFrame(draw); } }
  function move(event) { x = event.clientX / innerWidth * 2 - 1; y = event.clientY / innerHeight * 2 - 1; }
  function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; sheet.sequence.pause(); } else { resume(); } }
  function pause() {
    active = !active;
    toggle.setAttribute('aria-pressed', String(!active));
    toggle.textContent = active ? 'Detener movimiento' : 'Activar movimiento';
    if (active) resume(); else { cancelAnimationFrame(frame); frame = 0; sheet.sequence.pause(); }
  }
  function destroy() {
    destroyed = true; cancelAnimationFrame(frame); sheet.sequence.pause(); unsubscribe();
    resizeObserver.disconnect(); observer.disconnect();
    hero.removeEventListener('pointermove', move); toggle.removeEventListener('click', pause);
    document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', onReduce);
    geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose();
    canvas.classList.remove('ready'); toggle.hidden = true;
  }
  function onReduce(event) { if (event.matches) destroy(); }
  const resizeObserver = new ResizeObserver(resize);
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) resume(); else { cancelAnimationFrame(frame); frame = 0; }
  });
  resizeObserver.observe(hero); observer.observe(hero);
  hero.addEventListener('pointermove', move, { passive: true });
  toggle.addEventListener('click', pause);
  document.addEventListener('visibilitychange', visibility);
  reduced.addEventListener('change', onReduce);
  window.addEventListener('pagehide', destroy, { once: true });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); destroy(); }, { once: true });
  resize(); canvas.classList.add('ready'); resume();
  sheet.sequence.play({ iterationCount: 1 });
}
