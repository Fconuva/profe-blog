(async()=>{'use strict';const $=id=>document.getElementById(id),e=NM2.esc;let i=0,slides=[];
try{const d=await NM2.material(),n=Number(new URLSearchParams(location.search).get('clase')||1),l=d.lessons.find(x=>x.n===n);if(!l)throw new Error('Clase no disponible.');
const visualSlides=d.visuals[n].flatMap(v=>[
 {visual:true,html:`<h2>${e(v.title)}</h2><figure><img src="assets/ia/${e(v.id)}.webp" alt="${e(v.alt)}"></figure><p class="slide-task">Observen los ejemplos. ¿Qué pista permite reconocer cada concepto?</p>`},
 {html:`<p class="eyebrow">Ahora aplica · ${e(v.tab)}</p><h1>${e(v.title)}</h1><p>${e(v.apply)}</p><p class="slide-task">Al revisar, comprueben si el ejemplo cumple la definición y expliquen una pista.</p>`}
]);
slides=[
 {html:`<p class="eyebrow">Activación · Clase ${n} · ${NM2.date(l.date)}</p><h1>${e(l.central)}</h1><p>${e(l.activation)}</p>`},
 {html:`<p class="eyebrow">Normas</p><h1>Escuchar, fundamentar y revisar</h1><ul><li>Escuchen y respeten los turnos.</li><li>Apoyen sus respuestas en ejemplos y pistas.</li><li>Corrijan una respuesta antes de entregar.</li><li>No se permite el uso de celular.</li></ul>`},
 {html:`<p class="eyebrow">Objetivo</p><h1>${e(l.title)}</h1><p>${e(l.objective)}</p>`},
 ...visualSlides,
 {html:`<p class="eyebrow">Aplicamos</p><h1>De las frases a las lecturas</h1><ol><li>Responde los 12 ejercicios breves.</li><li>Lee los tres textos y responde sus preguntas.</li><li>Justifica una decisión con evidencia.</li></ol><p>Trabaja individualmente en tu guía o computador. Consulta las fichas si necesitas una definición.</p>`},
 {html:`<p class="eyebrow">Escritura y revisión</p><h1>Crea, explica y mejora</h1><p>Realiza las tres tareas escritas de tu guía. En parejas, revisen una respuesta: definición, ejemplo y evidencia. Corrige antes de entregar.</p>`},
 {html:`<p class="eyebrow">Cierre</p><h1>¿Qué cambió en tu forma de leer?</h1><p>Explica un contenido con un ejemplo propio. Cita una pista de la lectura y señala qué conclusión permite sostener.</p>`}
];
function render(){$('slide').classList.toggle('visual-slide',!!slides[i].visual);$('slide').innerHTML=slides[i].html;$('position').textContent=(i+1)+' / '+slides.length;$('prev').disabled=i===0;$('next').disabled=i===slides.length-1;}
function move(v){i=Math.max(0,Math.min(slides.length-1,i+v));render();}
$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);$('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{});document.addEventListener('keydown',ev=>{if(ev.key==='ArrowRight')move(1);if(ev.key==='ArrowLeft')move(-1);});render();
}catch(error){$('slide').textContent=error.message;}})();
