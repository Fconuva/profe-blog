'use strict';
const fs=require('node:fs'),path=require('node:path');
const dir=__dirname,root=path.resolve(dir,'../../..');
const objetivo='Analizar cómo las imágenes, la voz y la selección de escenas construyen un relato personal, fundamentando las observaciones con evidencias y eligiendo planos adecuados para una escena cotidiana.';
const pregunta='¿Cómo contamos quiénes somos con lo que elegimos mostrar de nuestro día?';
const template=fs.readFileSync(path.join(root,'referencias/formato-institucional/plantilla-guia.html'),'utf8');
const style=template.match(/<style>([\s\S]*?)<\/style>/)[1].replace('../../assets/fonts/cest/fonts.css','../../../assets/fonts/cest/fonts.css');
const membrete=template.slice(template.indexOf('  <div class="membrete-banner">'),template.indexOf('  <div class="doc-title">')).replaceAll('../../estudiantes/assets/','../../../estudiantes/assets/').replace('[Asignatura]','Lengua y Literatura').replace('[Nivel]','3.º medio');
const ficha=template.slice(template.indexOf('  <table class="info-table"'),template.indexOf('  <section class="instructions"')).replaceAll('[Asignatura]','Lengua y Literatura').replace('[Objetivo de la clase, en infinitivo]',objetivo).replace('[Habilidades que se trabajan]','Analizar, interpretar, fundamentar y aplicar planos.').replaceAll('class="placeholder"','').replace('Semestre</td><td class="value write-in"></td>','Semestre</td><td class="value write-in">II</td>').replace('Puntaje</td><td class="value write-in" colspan="2"></td>','Puntaje</td><td class="value write-in" colspan="2">Formativa</td>');
const table=(heads,rows,cls='')=>`<table class="work-table ${cls}"><thead><tr>${heads.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const lines=n=>'<div class="writing-line"></div>'.repeat(n);
const id=t=>`<h1 class="page-title">${t}</h1>`;
const instruct=t=>`<section class="instructions"><strong>INSTRUCCIONES</strong><p>${t}</p></section>`;
const question=(t,n=2)=>`<p class="question">${t}</p>${lines(n)}`;
const photo=(file,alt,cls='')=>`<figure class="${cls}"><img src="assets/${file}.webp" alt="${alt}"><figcaption>Ilustración didáctica creada con IA · escena ficticia.</figcaption></figure>`;
const pages=[];
pages.push(`${membrete}<div class="doc-title">Mi vida en cinco minutos · Clase 1</div>${ficha}
${instruct('1. Lean y observen los ejemplos. 2. Analicen el vlog que proyectará el profesor y completen el organizador en su cuaderno. 3. Resuelvan en esta guía los ejercicios de planos y la aplicación final. Conserven ambos trabajos.')}
<h2>Una pregunta para toda la clase</h2><p class="driving">${pregunta}</p>
<h2>Antes de comenzar</h2><p>Piensen en un momento de su jornada: llegar al colegio, preparar sus materiales o compartir un recreo.</p>
${question('1. ¿Qué podría conocer de ustedes una persona al ver ese momento?',2)}
${question('2. ¿Bastaría mostrar una lista de actividades para comunicar esa idea? Expliquen.',2)}
<h2>Conceptos para comprender el vlog</h2>
${table(['Concepto','Qué nos permite analizar'],[
['Vlog','Relato audiovisual de una experiencia personal. Selecciona momentos y los comunica con imágenes y sonido.'],
['Enunciador y audiencia','Quien comunica construye una voz y un rol; se dirige a personas con ciertos conocimientos e intereses.'],
['Tema, mensaje y propósito','El tema es el asunto; el mensaje, la idea que se construye sobre él; el propósito, lo que se busca lograr en la audiencia.']])}
<p>Escuchen otras interpretaciones y fundaméntenlas con evidencias. Se analiza cómo se comunica una experiencia, sin juzgar la vida de las personas.</p>`);

pages.push(`${id('Leemos · Del relato a una secuencia de imágenes')}
<p class="before"><b>Antes de leer:</b> ¿qué tendría que decidir una persona para transformar una experiencia en imágenes?</p>
<article class="reading">
<p>Para crear un relato con imágenes, primero se decide qué historia se contará. El <b>libreto</b> organiza los personajes, sus acciones, el lugar y el tiempo. También permite anticipar la estructura del relato y las palabras que acompañarán las imágenes.</p>
<p>El <b>storyboard o guion visual</b> es un borrador formado por viñetas. En cada una se indica qué acción se mostrará, dónde ocurrirá y qué plano se utilizará. La selección de gestos, posturas y detalles ayuda a representar las acciones y emociones. Por eso, una imagen puede aportar información que las palabras no entregan por sí solas.</p>
<p>El trabajo puede comenzar desde un guion para construir imágenes, o desde imágenes para elaborar un relato. Revisar esa relación permite decidir si la secuencia comunica lo que se quiere contar.</p>
</article>
<p class="source">Adaptación de las orientaciones sobre libreto, storyboard y lenguaje de la imagen: SM, <i>Guía Digital del Docente, Lengua y Literatura</i>, tomo 1, Unidad 2 «Identidad», pp. 89–90 (PDF 95–96). Autoras: Yanina Piñones y Olga Vergara. ©2024. No es una cita literal.</p>
<h2>Aplicamos la idea a una escena cotidiana</h2>
${photo('escena-desayuno','Tres encuadres de una estudiante durante el desayuno: lugar, acción y detalle','model')}
${table(['Ubicar','Mostrar una acción','Destacar un detalle'],[['El espacio ayuda a comprender dónde ocurre.','Las manos y los objetos permiten seguir lo que hace.','La cercanía dirige la atención hacia algo concreto.']])}
<p>En un vlog, estas decisiones se combinan con voz y sonido. Si el tema es el desayuno, el mensaje podría ser que el desayuno es un momento de pausa antes de salir. La voz y las imágenes deben permitir comprender esa idea.</p>
${question('Después de leer: ¿por qué un guion visual ayuda a comunicar una idea y no solo a reunir imágenes?',2)}`);

pages.push(`${id('Aprendemos · Elegir cuánto mostrar')}
<p>El <b>tamaño del plano</b> indica cuánto del sujeto y de su entorno aparece dentro del encuadre. Su elección dirige nuestra atención: al lugar, a una acción, a una expresión o a un detalle.</p>
${photo('tipos-plano','Comparación de ocho tamaños de plano','plate')}
${table(['Plano','Qué muestra'],[
['Gran plano general','Un entorno muy amplio; las personas ocupan poco espacio.'],['General','La persona dentro del lugar; el entorno tiene importancia.'],['Entero','El cuerpo completo, de la cabeza a los pies.'],['Americano','La persona aproximadamente de la cabeza a las rodillas.'],['Medio','La persona aproximadamente de la cabeza a la cintura.'],['Primer plano','El rostro y los hombros.'],['Primerísimo primer plano','El rostro muy cercano o una parte de él.'],['Detalle','Una parte del cuerpo, un objeto o una acción pequeña.']])}
<h2>Del nombre a la intención</h2><p>Para situar la llegada al colegio, puede servir un plano general. Para mostrar una expresión, un primer plano. Para destacar una acción de las manos, un plano de detalle. La elección debe aportar al mensaje de la escena.</p>
${question('¿Qué información perderíamos si mostramos solo el rostro, sin ubicar antes el lugar?',2)}`);

pages.push(`${id('Aprendemos · Elegir desde dónde mirar')}
<p>El <b>ángulo</b> indica la posición de la cámara respecto del sujeto. Puede combinarse con distintos tamaños de plano. Un primer plano, por ejemplo, puede grabarse con la cámara a la altura de los ojos o desde arriba.</p>
${photo('angulos','Normal, picado, contrapicado, cenital, nadir e inclinado','plate')}
${table(['Ángulo','Posición de la cámara'],[
['Normal','A la altura de los ojos o del objeto.'],['Picado','Por encima del sujeto y dirigida hacia abajo.'],['Contrapicado','Por debajo del sujeto y dirigida hacia arriba.'],['Cenital','Directamente encima, mirando verticalmente hacia abajo.'],['Nadir','Directamente debajo, mirando verticalmente hacia arriba.'],['Inclinado','Con la cámara girada: el horizonte queda inclinado.']])}
<p>Los efectos dependen de la escena, la actuación y los demás recursos. Un picado no significa siempre debilidad ni un contrapicado siempre poder.</p>
${question('Quieren mostrar cómo ordenan sus materiales sobre una mesa. ¿Qué ángulo elegirían y qué permitiría ver?',2)}`);

const filas=[['Enunciador','¿Quién habla y qué imagen de sí construye?'],['Audiencia','¿A quién parece dirigirse? ¿Qué pistas lo muestran?'],['Tema y mensaje','¿De qué trata y qué idea comunica?'],['Propósito','¿Qué busca provocar en quienes lo ven?'],['Formato y estructura','¿Cómo abre, conecta momentos y cierra?'],['Imagen y planos','¿Qué decide mostrar y qué aporta un encuadre?'],['Voz, sonido y edición','¿Qué aportan las palabras, los sonidos y los cortes?'],['Selección y responsabilidad','¿Qué parte de la experiencia se muestra y qué cuidados requiere?']];
pages.push(`${id('Analizamos · Un creador cuenta su experiencia')}
${instruct('Observen el vlog de Leo Bascuñán. Individualmente, copien y completen en su cuaderno las ocho filas. En cada una incluyan una observación y una escena, minuto o detalle que la respalde. La tabla de esta guía sirve de apoyo.')}
<p><b>Video:</b> <i>Un día COMIENDO por $1.000 pesos en CHILE en pleno 2024!</i> · Leo Bascuñán · 12:20.<br><span class="source">youtube.com/watch?v=h23SJatDO74 · El profesor lo proyectará.</span></p>
${table(['Aspecto y pregunta guía','Mi observación','Escena, minuto o detalle'],filas.map(([a,b])=>[`<b>${a}</b><br>${b}`,'<div class="analysis-space"></div>','<div class="analysis-space"></div>']),'analysis')}
<p><b>Revisión en parejas:</b> contrasten dos filas. Pregunten qué evidencia sostiene cada respuesta y corrijan lo necesario. La audiencia y el propósito pueden inferirse; no conocemos la intención privada del autor.</p>`);

pages.push(`${id('Ejercitamos · Reconocer, comparar y justificar')}
${instruct('Observen las imágenes A, B y C. Respondan individualmente y luego contrasten una respuesta con un compañero. Usen la lámina de planos para comprobar su elección.')}
${photo('ejercicio-planos','Tres encuadres de la llegada de un estudiante al colegio, identificados A, B y C','exercise')}
<h2>1. Reconozcan los planos con una evidencia</h2>
${table(['Imagen','Plano','¿Qué parte del sujeto o del entorno lo demuestra?'],['A','B','C'].map(x=>[x,'<div class="response-space"></div>','<div class="response-space"></div>']))}
<h2>2. Elijan según lo que quieren comunicar</h2>
${question('a. Para ubicar al espectador en el lugar, ¿qué imagen elegirían? Expliquen qué permite comprender.',2)}
${question('b. Para destacar la expresión del estudiante, ¿cuál elegirían? ¿Qué información deja fuera?',2)}
${question('c. Si usan solo la imagen C, ¿qué necesitarían agregar para que se entienda el contexto?',2)}`);

pages.push(`${id('Aplicamos · Una escena, tres decisiones')}
${instruct('Elijan una situación cotidiana: llegar al colegio, preparar sus materiales, compartir un recreo o desayunar. Pueden imaginar la situación. Diseñen en papel una secuencia de tres imágenes; todavía no es la planificación del video completo.')}
<p><b>Situación elegida:</b></p>${lines(1)}
<p><b>¿Qué quiero que otra persona comprenda de esta experiencia?</b></p>${lines(2)}
<h2>1. Dibujen y decidan</h2>
<p>Usen al menos dos tamaños de plano distintos. Bajo cada dibujo escriban el plano, el ángulo y lo que aporta al mensaje.</p>
${table(['Imagen 1','Imagen 2','Imagen 3'],[
['<div class="draw-box"></div>','<div class="draw-box"></div>','<div class="draw-box"></div>'],
['Plano:<div class="writing-line"></div>Ángulo:<div class="writing-line"></div>','Plano:<div class="writing-line"></div>Ángulo:<div class="writing-line"></div>','Plano:<div class="writing-line"></div>Ángulo:<div class="writing-line"></div>'],
['Aporta:<div class="writing-line"></div><div class="writing-line"></div>','Aporta:<div class="writing-line"></div><div class="writing-line"></div>','Aporta:<div class="writing-line"></div><div class="writing-line"></div>']
],'storyboard')}
<h2>2. Revisen una decisión</h2><p>En parejas, expliquen cómo la secuencia comunica su idea. Escuchen la sugerencia y señalen qué mantendrían o cambiarían.</p>${lines(2)}
<h2>3. Cerramos la pregunta de la clase</h2>
${question('¿Cómo influye lo que mostramos y dejamos fuera en la manera en que otros comprenden nuestra experiencia? Respondan usando una decisión de su secuencia.',3)}`);

const footer=n=>`<footer class="footer"><span>EDUCAR EVANGELIZANDO Y EVANGELIZAR EDUCANDO, MEDIANTE UNA FORMACIÓN CONTINUA Y DE CALIDAD</span><span class="page-number">Página ${n} de ${pages.length}</span></footer>`;
const custom=`.sheet{height:276mm;position:relative;break-after:page;padding-bottom:13mm}.sheet:last-child{break-after:auto}.sheet>.footer{position:absolute;bottom:0;left:0;right:0}.sheet>p,.sheet .reading{font-size:14px;line-height:1.5}.sheet>p{margin:7px 0}.sheet h2{font:700 13px Inter,sans-serif;margin:12px 0 7px}.sheet .page-title{font:700 16px Inter,sans-serif;margin:7px 0}.short-id{border-collapse:collapse;width:100%;margin:8px 0 12px}.short-id td{border:1px solid #777;height:8mm;padding:4px}.short-id td:first-child{width:75%}.driving{border-left:3px solid #222;padding:6px 10px;font-weight:700}.work-table{border-collapse:collapse;width:100%;font:13px/1.4 Inter,sans-serif;margin:8px 0}.work-table th,.work-table td{border:1px solid #666;padding:6px;text-align:left;vertical-align:top}.work-table th{font-weight:700;background:#eee}.work-table th:first-child{width:28%}.writing-line{height:7mm;border-bottom:1px solid #aaa}.source,figcaption{font:10px/1.4 Inter,sans-serif!important}.reading{font-family:Merriweather,serif!important;border:1px solid #777;padding:10px 12px}.reading p{margin:5px 0}.reading b{font-family:Merriweather,serif}.question{font-size:13px!important;margin:9px 0 4px!important}.before{font-size:13px!important}figure{margin:10px 0}figure img{display:block;width:100%;object-fit:contain}figcaption{margin-top:3px}.model img{height:72mm}.plate img{height:100mm}.exercise img{height:84mm}.analysis-space{height:17mm}.response-space{height:13mm}.analysis th:first-child{width:40%}.analysis td,.analysis th{font-size:12px}.storyboard th{width:33.33%!important}.draw-box{height:34mm}.storyboard td{font-size:12px}.storyboard .writing-line{height:7mm}.print-tools{padding:12px}@media print{.print-tools{display:none}.work-table th{background:#fff}.reading,.work-table tr{break-inside:avoid}}`;
const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clase 1 · Mi vida en cinco minutos</title><style>${style}\n${custom}</style></head><body><nav class="print-tools"><a href="assets/guia-clase1-vlog-nm3.pdf">PDF de la clase 1</a> · <button onclick="print()">Imprimir</button></nav>${pages.map((p,i)=>`<article class="sheet" data-page="${i+1}">${p}${footer(i+1)}</article>`).join('')}<script src="../../../assets/anotar-pizarra.js" defer></script></body></html>`;
fs.writeFileSync(path.join(dir,'guia.html'),html.split('\n').map(line=>line.trimEnd()).join('\n')+'\n','utf8');
fs.writeFileSync(path.join(dir,'diseno.json'),JSON.stringify({objetivo,pregunta,paginas:pages.length,clase:1,lectura:{tipo:'Adaptación didáctica, no cita literal',obra:'Guía Digital del Docente, Lengua y Literatura, SM, tomo 1',unidad:'Identidad',paginasGDD:[89,90],paginasPDF:[95,96],aplicacionVlog:'Diseño CEST; no se atribuye como consigna literal a SM'},video:{url:'https://www.youtube.com/watch?v=h23SJatDO74',duracion:740}},null,2)+'\n');
console.log('Guía exclusiva de clase 1 generada: '+pages.length+' páginas.');
