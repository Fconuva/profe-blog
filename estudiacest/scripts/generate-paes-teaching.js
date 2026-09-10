'use strict';
// Inserción mecánica idempotente; no reescribe lecturas, reactivos ni controladores.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),lessons=require('./paes-continuity-teaching');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const markers=/<!-- PAES_TEACHING_START -->[\s\S]*?<!-- PAES_TEACHING_END -->\s*/g;
function render(id,guided=false){
 const l=lessons[id],exam=!guided&&[14,21].includes(id);
 const [text,question,thinking,answer]=l.model;
 return `<!-- PAES_TEACHING_START -->
${id===14&&!guided?'<template id="paesExamPreparation">':''}<section class="paes-prelude" data-teaching-guide="${id}" aria-labelledby="paesTeachingTitle">
<p class="pt-kicker">${exam?'Preparación previa · Fuera del tiempo del instrumento':'Antes de practicar · Explica y modela'}</p>
<h2 id="paesTeachingTitle">Aprende la estrategia</h2><p class="pt-focus">${esc(l.title)}</p>
<div class="pt-objective"><h3>Objetivo de la clase</h3><p>${esc(l.aim)}</p></div>
<p class="pt-success"><strong>¿Cómo comprobaré mi avance?</strong> Podré explicar el concepto, aplicar los pasos a un texto nuevo y justificar una decisión sin agregar información.</p>
<details class="pt-instructions"><summary>Instrucciones de trabajo · Antes de comenzar</summary><div class="pt-body"><p>Necesitas esta guía y tu cuaderno. Abre los cuatro bloques en orden. ${guided?'Lee o escucha con apoyo, explica una idea a la vez y vuelve al texto cuando lo necesites. La práctica acompañada conserva sus apoyos y no tiene temporizador.':'Trabaja el ejemplo con el docente; después intenta la comprobación antes de desplegar su respuesta.'}</p><p>${exam?'Completa este repaso en la preparación de la clase. Al ingresar al instrumento, esta sección deja de mostrarse. Responde entonces sin consultar el modelo; el análisis de los ítems se realiza después de la publicación docente.':'Durante la enseñanza, dedica aproximadamente 10–15 minutos a comprender y observar el modelo y 5–10 a la comprobación. Si necesitas más apoyo, revisa el paso difícil antes de continuar. El docente ajustará la práctica al tiempo disponible.'}</p><p>Estas consignas se responden en tu cuaderno: no tienen puntaje ni se guardan en línea. Las respuestas de las preguntas de la guía mantienen su guardado habitual. Al entregar, espera la confirmación de la plataforma; las claves y resultados evaluados dependen de la publicación del docente.</p></div></details>
<div class="pt-activation"><h3>Activa lo que sabes</h3><p>${esc(l.prior)}</p></div>
<ol class="pt-route" aria-label="Recorrido de aprendizaje"><li>1 · Comprende</li><li>2 · Aplica</li><li>3 · Observa</li><li>4 · Comprueba</li></ol>
<details class="pt-chapter"><summary>1. Comprende los conceptos</summary><div class="pt-body">${l.concepts.map(([t,p])=>`<h3>${esc(t)}</h3><p>${esc(p)}</p>`).join('')}</div></details>
<details class="pt-chapter"><summary>2. Aplica la estrategia paso a paso</summary><div class="pt-body"><ol class="pt-steps">${l.steps.map(([t,p])=>`<li><strong>${esc(t)}</strong><p>${esc(guided?p.split('. ')[0]+'.':p)}</p></li>`).join('')}</ol><aside class="pt-error"><h3>Detente en este error</h3><p>${esc(l.pitfall)}</p></aside><p><strong>Antes del modelo:</strong> explica cuál es el primer paso y por qué no basta con buscar una palabra parecida.</p></div></details>
<details class="pt-chapter"><summary>3. Sigue un ejemplo razonado</summary><div class="pt-body"><p class="pt-kicker">ATENCIÓN · Ejemplo original de enseñanza, no evaluado</p><blockquote>${esc(text)}</blockquote><h3>Pregunta del modelo</h3><p>${esc(question)}</p><h3>Pienso en voz alta</h3><p>${esc(thinking)}</p><h3>Conclusión justificada</h3><p>${esc(answer)}</p></div></details>
<details class="pt-chapter"><summary>4. Comprueba y prepara la práctica</summary><div class="pt-body"><h3>Ahora explica tú · En tu cuaderno</h3><p>${esc(l.practice[0])}</p><p>${guided?'Puedes pedir que te lean la consigna. Señala primero la pista y explica después qué permite concluir.':'Con el docente o un compañero, identifica primero el dato relevante; formula después tu explicación sin copiar el modelo. Si trabajas solo, realiza ambos pasos antes de consultar la respuesta.'}</p><details class="pt-response"><summary>Revisa después de responder</summary><p>${esc(l.practice[1])}</p></details><h3>Comprueba antes de avanzar</h3><p>¿Tu respuesta conserva el dato y explica la relación? Si falta alguno, vuelve al paso correspondiente y prueba otra vez. Si ya puedes justificar ambos, continúa con la práctica de la guía.</p><h3>Aplica y transfiere</h3><p>${esc(l.transfer)}</p><p>${exam?'La revisión colectiva corresponde al momento posterior a la medición, no interrumpe el tiempo del instrumento.':'En práctica formativa, revisa a los cinco minutos una decisión y su evidencia. Después trabaja con mayor autonomía. Cuando haya un bloque de evaluación, resuélvelo sin consultar el modelo; analiza los errores cuando el docente libere los resultados.'}</p></div></details>
</section>${id===14&&!guided?'</template>':''}
<!-- PAES_TEACHING_END -->
`;
}
function build(){
 for(let id=10;id<=21;id++)for(const guided of [false,true]){
  const file=path.join(root,`paes/guia${id}${guided?'-guiada':''}.html`);if(!fs.existsSync(file))continue;
  let html=fs.readFileSync(file,'utf8').replace(markers,'');
  const css='<link rel="stylesheet" href="css/guia-teaching.css">';
  if(!html.includes(css))html=html.replace('</head>',css+'\n</head>');
  let anchor;
  if(guided)anchor='<section class="card" aria-labelledby="instructionsTitle">';
  else if(id===10)anchor='<!-- Caja de herramientas -->';
  else if([11,12,13].includes(id))anchor='<!-- EXPLICA: caja de herramientas -->';
  else if(id===14)anchor=html.match(/<body[^>]*>/)[0];
  else if(id===15)anchor='<section class="panel" id="instructions">';
  else if(id===16)anchor='<div class="card lesson-video">';
  else if(id===17)anchor='<section class="card"><h2 class="card-title">Instrucciones</h2>';
  else if(id===18)anchor='<section class="card"><h2 class="card-title">Propósito de la clase</h2>';
  else if(id===19)anchor='<section class="card">\n        <h2 class="card-title">Propósito de la clase</h2>';
  else if(id===20)anchor='<aside class="strategy"';
  else anchor='<form id="loginForm">';
  // Respeta CRLF del archivo al localizar bloques multilineales.
  if(!html.includes(anchor)&&anchor.includes('\n'))anchor=anchor.replace(/\n/g,'\r\n');
  if(!html.includes(anchor))throw Error('Falta anclaje: '+path.basename(file));
  html=html.replace(anchor,id===14&&!guided?anchor+'\n'+render(id):render(id,guided)+anchor);
  fs.writeFileSync(file,html);
 }
}
if(require.main===module)build();
module.exports={render,build};
