'use strict';
// Derivado reproducible de los tiempos nativos de TTS, sin repartir palabras uniformemente.
const fs=require('node:fs');
const path=require('node:path');
const starts=[.4,5.4,13.4,21.3,29.1];
const groups=[];
for(let scene=1;scene<=5;scene++){
  const words=JSON.parse(fs.readFileSync(path.join(__dirname,`assets/narracion-0${scene}.words.json`),'utf8'));
  console.log(`Escena ${scene}: ${words.map(w=>w.text).join(' ')}`);
  let group=[];
  for(let i=0;i<words.length;i++){
    const w=words[i];
    if(!w.text||w.end<=w.start)throw Error('Tiempo inválido');
    group.push(w);
    if(group.length>=6||/[.?:]$/.test(w.text)||i===words.length-1){
      groups.push({text:group.map(w=>w.text).join(' '),start:starts[scene-1]+group[0].start,end:starts[scene-1]+w.end});
      group=[];
    }
  }
}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const markup=groups.map((g,i)=>`<div id="sub-c${i}" class="sub-caption">${escape(g.text)}</div>`).join('\n');
const tweens=groups.map((g,i)=>`tl.set('#sub-c${i}',{opacity:1},${g.start});tl.set('#sub-c${i}',{opacity:0},${g.end});`).join('\n');
fs.writeFileSync(path.join(__dirname,'compositions/subtitulos.html'),`<!DOCTYPE html><html lang="es"><body><template>
<style>#sub-root{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.sub-caption{position:absolute;left:160px;right:160px;bottom:26px;height:76px;padding:12px 24px;text-align:center;background:#102d46;color:#ffffff;border-radius:12px;font:600 40px/1.3 Montserrat,sans-serif;opacity:0}</style>
<div id="sub-root" data-composition-id="subtitulos" data-width="1920" data-height="1080" data-duration="35">${markup}</div>
<script>const tl=gsap.timeline({paused:true});${tweens}window.__timelines['subtitulos']=tl;</script>
</template></body></html>\n`);
function timestamp(t){const ms=Math.round(t*1000);return `00:${String(Math.floor(ms/60000)).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;}
fs.writeFileSync(path.resolve(__dirname,'../../estudiantes/assets/u3s12/modelo-entrevista-para.vtt'),'WEBVTT\n\n'+groups.map((g,i)=>`${i+1}\n${timestamp(g.start)} --> ${timestamp(g.end)}\n${g.text}\n`).join('\n'));
console.log(`${groups.length} subtítulos; último cierre ${groups.at(-1).end.toFixed(3)} s`);
