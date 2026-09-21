/* Contenido exclusivamente ficticio de la edición didáctica. */
const guide = require('./book-guide.js');
const section = (id, extra={}) => ({id,title:guide.find(s=>s.id===id).title,text:guide.find(s=>s.id===id).example,optional:Boolean(guide.find(s=>s.id===id).optional),...extra});
const patio = 'assets/modelo-patio.png';
const taller = 'assets/modelo-taller.png';
const portada = 'assets/modelo-portada.png';
const caminos = 'assets/modelo-caminos.png';
const voices = [
  {name:'Emilia',role:'Compañera 1',theme:'Aprender a pedir ayuda',answers:[
    'Recuerdo la primera prueba de impresión del cuadernillo. La imagen quedó muy oscura y pensamos que todo el trabajo se había perdido. Al comparar las pruebas descubrimos que podíamos corregirla. Me gustó que nadie tuviera que resolverlo solo.',
    'Aprendí a pedir ayuda antes de que el problema fuera más grande. En el taller comprendí que consultar no significa dejar de hacerse responsable. Después de recibir una explicación, yo debía probar y revisar mi parte.',
    'Nos describiría como un curso que aprende haciendo. Cuando organizamos la mesa de trabajo, cada uno mostró una manera distinta de ordenar los materiales. Terminamos eligiendo lo que funcionaba mejor para todos.',
    'Me ayudó una compañera que revisó conmigo los márgenes del primer diseño. No lo hizo por mí: me mostró cómo comprobarlos. Esa diferencia me permitió intentarlo después sin depender de ella.',
    'No esperen a saber hacerlo todo para comenzar. Empiecen, escuchen las observaciones y vuelvan a probar. A veces el avance se nota cuando uno compara el primer intento con el último.'
  ]},
  {name:'Diego',role:'Compañero 2',theme:'El valor de revisar',answers:[
    'Recuerdo una actividad de aniversario en la que debíamos preparar un cartel. Ensayamos varias composiciones y nos costó elegir. Cuando lo vimos desde lejos entendimos que una idea sencilla podía comunicar mejor que muchas cosas juntas.',
    'Me llevo la costumbre de revisar antes de entregar. Antes confiaba en que, si algo se veía bien en pantalla, estaba listo. Ahora miro los nombres, las medidas y la legibilidad en una prueba impresa.',
    'Somos un curso con bastante humor. Eso nos ayudaba cuando una tarea se hacía larga, aunque también tuvimos que aprender a detener la conversación para terminar. En una entrega repartimos tiempos de trabajo y de revisión.',
    'Un profesor nos pidió explicar nuestras decisiones en lugar de decir solamente que el diseño nos gustaba. Me hizo pensar en el lector y en lo que necesitaba encontrar primero en la página.',
    'Guarden sus primeros trabajos. Ver los errores antiguos ayuda a reconocer lo aprendido. No todo merece publicarse, pero cada intento puede mostrar una parte del camino.'
  ]},
  {name:'Sofía',role:'Compañera 3',theme:'Encontrar una voz propia',answers:[
    'Recuerdo cuando entrevisté a una compañera con la que casi no conversaba. Yo pensaba que conocía su experiencia escolar, pero me contó que un proyecto pequeño había sido muy importante para ella. Escucharla cambió la página que quería escribir.',
    'Aprendí que comunicar no es llenar un espacio. Hay que elegir qué merece estar ahí. En el anuario quité frases repetidas para que se entendiera mejor la idea principal y comprobé los cambios con la entrevistada.',
    'Nuestra generación tiene intereses diferentes. En un mismo equipo había quien prefería dibujar, quien escribía y quien revisaba medidas. Cuando reconocimos esas diferencias pudimos repartir mejor las tareas.',
    'Me influyó una devolución donde el docente señaló una idea que sí funcionaba antes de pedir cambios. Me ayudó a revisar sin pensar que todo estaba mal y a defender las decisiones que tenían sentido.',
    'Ojalá conservemos la curiosidad por las historias de los demás. Una pregunta hecha con atención puede acercarnos más que una fotografía donde todos aparecemos, pero nadie dice nada.'
  ]},
  {name:'Elena',role:'Docente 1',theme:'Escuchar para construir comunidad',answers:[
    'Distingo su disposición a probar cuando el trabajo tiene un propósito claro. En una actividad de memoria escolar observaron que sus recuerdos no eran idénticos. En vez de elegir una sola versión, buscaron qué aportaba cada mirada.',
    'Recuerdo una conversación en la que un estudiante corrigió con respeto un dato de una entrevista. El grupo volvió al registro y comprobó la información. Fue una buena muestra de que revisar también es cuidar a otros.',
    'Espero que conserven la capacidad de preguntar y de reconocer cuando no saben algo. En el estudio y en el trabajo encontrarán problemas nuevos. Saber buscar ayuda y evaluar una respuesta seguirá siendo necesario.',
    'Les aconsejaría cumplir los acuerdos pequeños. Llegar a una reunión, avisar si hay una dificultad y entregar lo comprometido construyen confianza. Esa confianza se forma con acciones repetidas, no con una sola promesa.',
    'Lleven sus aprendizajes con orgullo y con disposición a seguir aprendiendo. Un oficio cambia y las personas también. Lo importante es mantener el cuidado por el trabajo y por quienes lo reciben.'
  ]},
  {name:'Tomás',role:'Docente 2',theme:'Un oficio que se aprende con otros',answers:[
    'Esta generación ha aprendido a mostrar el proceso. Al principio muchos querían enseñar solamente el resultado final. Después comprendieron que un boceto, una prueba fallida y una corrección permiten explicar mejor una decisión.',
    'Recuerdo una jornada de encuadernación en la que algunos terminaron antes y ayudaron a revisar el orden de los pliegos de sus compañeros. Lo valioso fue que orientaron sin reemplazar el trabajo de cada uno.',
    'Quisiera que conservaran la atención a los detalles. Una medida equivocada puede afectar una pieza completa. Revisar a tiempo cuida materiales, esfuerzo y la confianza de quien encargó el trabajo.',
    'Antes de aceptar una tarea, pregunten qué se necesita y para cuándo. Luego revisen si cuentan con los recursos. Si aparece una dificultad, comuníquenla de inmediato y propongan una alternativa posible.',
    'Un buen trabajo lleva la huella de muchas personas. Reconozcan a quienes les enseñaron, compartan lo que saben y no dejen de practicar. La experiencia crece cuando se trabaja con atención.'
  ]}
];
const questions = [
  ['¿Qué experiencia recuerdas y por qué?','¿Qué aprendizaje te llevas?','¿Cómo describirías a nuestra generación?','¿Qué persona o momento influyó en ti?','¿Qué mensaje dejarías en el anuario?'],
  ['¿Qué distingue a esta generación?','¿Qué momento compartido recuerda?','¿Qué aprendizaje deberían conservar?','¿Qué consejo les daría para la próxima etapa?','¿Qué mensaje dejaría en el anuario?']
];
const interviews = voices.map((voice,i)=>({id:i===0?'entrevistas':'entrevista-'+(i+1),title:voice.theme,kicker:`Entrevista ${i+1} · ${voice.role}`,text:`Persona entrevistada: ${voice.name}, personaje ficticio.\nRegistro escrito simulado: no existe audio de esta conversación. En tu trabajo debes conservar la grabación real y transcribirla fielmente.\n\n`+voice.answers.map((answer,j)=>`${questions[i<3?0:1][j]}\n${voice.name}: ${answer}`).join('\n\n')}));
const memory = `La mañana del aniversario, nuestro cartel seguía sobre una mesa y todavía faltaba pegar algunas letras. Afuera comenzaban las actividades, pero nosotros discutíamos qué color usar para que el mensaje se leyera desde el patio. Alguien propuso mirarlo a varios metros de distancia. Esa prueba sencilla terminó la discusión.\n\nMientras un grupo ajustaba las letras, otros buscaron materiales y ordenaron lo que sobraba. No todo salió como esperábamos: una esquina se despegó y hubo que reforzarla antes de llevar el cartel afuera. La dificultad nos obligó a repartir mejor las tareas. Esta vez preguntamos quién necesitaba ayuda en lugar de asumir que cada uno ya sabía qué hacer.\n\nCuando finalmente lo instalamos, nos quedamos un momento observándolo. No era el trabajo más complejo que habíamos hecho, pero reconocíamos decisiones de todos. La fotografía que elegí para esta página representa esa pausa después del esfuerzo, cuando ya no estábamos apurados y podíamos conversar.\n\nCon el tiempo olvidé algunos detalles de la actividad, pero conservé esa sensación de haber resuelto algo juntos. El aniversario me enseñó que pertenecer a un curso no depende solamente de compartir una sala. También se construye cuando una tarea nos obliga a escuchar, colaborar y cuidar lo que hacemos.`;
const project = `EL DESAFÍO\nCrear un cuadernillo que pudiera abrirse con facilidad y conservar sus páginas ordenadas. Queríamos que la encuadernación acompañara el contenido y resistiera la lectura.\n\nCÓMO LO HICIMOS\nPrimero dibujamos una maqueta y distribuimos los textos. Después imprimimos una prueba para comprobar el orden de lectura, los márgenes y el tamaño de las letras. Al doblar los pliegos descubrimos que algunas páginas no coincidían: corregimos la organización antes de continuar.\n\nMarcamos los puntos de costura sobre una guía y practicamos el recorrido del hilo. Durante el montaje revisamos la tensión para que el libro pudiera abrirse sin deformarse. Un compañero comprobó la secuencia de páginas y otro observó la terminación.\n\nLO QUE APRENDIMOS\nAprendimos que la calidad no aparece solamente al final. Cada decisión afecta la siguiente: si la maqueta está desordenada, la encuadernación no puede arreglarla. La prueba de impresión y la revisión compartida nos permitieron corregir a tiempo y explicar cómo habíamos construido el objeto.`;
const farewell = `Llegamos a cuarto medio con experiencias distintas y terminamos compartiendo una mesa de trabajo. En ella quedaron conversaciones, papeles, pruebas y errores que nos enseñaron más de lo que imaginábamos. No todos recordaremos los mismos momentos, pero cada uno lleva una parte de lo que vivimos juntos.\n\nMe despido agradeciendo las ayudas pequeñas: una explicación antes de entregar, una pregunta hecha a tiempo y la paciencia de quien esperaba mientras yo terminaba. También me llevo las dificultades, porque nos obligaron a hablar con más claridad y a hacernos responsables de nuestros acuerdos.\n\nNo sé dónde estaremos dentro de algunos años. Espero que podamos mirar estas páginas y reconocer algo nuestro: el humor, el esfuerzo y la disposición a volver a intentar. El colegio termina como etapa; lo que aprendimos con otros sigue acompañándonos.`;
const pages = [
  section('portada',{title:'Huellas en papel',kicker:'Anuario 2026 · 4°D TP · CEST',image:portada,cover:true}),
  section('dedicatoria'),section('indice'),section('presentacion',{image:patio,caption:'Una conversación imaginada en el patio. Ilustración generada con IA para este modelo.'}),
  ...interviews,
  {id:'editada',title:'«Consultar no significa dejar de hacerse responsable»',kicker:'Entrevista editada · Emilia',text:'Emilia es una estudiante ficticia de cuarto medio de la especialidad de Gráfica. En esta entrevista de ejemplo recuerda una prueba de impresión y explica cómo cambió su manera de pedir ayuda. Su experiencia permite observar la relación entre el trabajo individual y la colaboración, una idea que recorre este anuario.\n\n'+[0,1,4].map(j=>`${questions[0][j]}\n${voices[0].answers[j]}`).join('\n\n'),image:patio,caption:'Escena de conversación escolar creada con IA; no retrata a una entrevistada real.'},
  {id:'aniversario',title:'El cartel que terminamos juntos',kicker:'Aniversarios del colegio · Memoria escolar',text:memory,image:patio,caption:'Patio y preparación de una celebración imaginaria. Ilustración con IA, 2026.'},
  section('jefes'),section('jefeactual'),section('curso',{image:patio,caption:'Grupo escolar ficticio. Sustituye esta ilustración con IA por una fotografía autorizada de tu curso.'}),
  {id:'especialidad',title:'Un libro hecho por nuestras manos',kicker:'Algo creado en la especialidad · Gráfica',text:project,image:taller,caption:'Proceso de encuadernación imaginado. Ilustración generada con IA para la edición de ejemplo.'},
  {id:'ficha',title:'Del primer pliego a la última puntada',kicker:'Proyecto de especialidad · Ficha y proceso',text:'PRODUCTO\nCuadernillo de memoria escolar con encuadernación cosida.\n\nEQUIPO FICTICIO\nAlex: textos y revisión; Emilia: diseño; Diego: pruebas; Sofía: orden de páginas y pies de imagen.\n\nMATERIALES DEL EJEMPLO\nPapel para interiores, cartulina para cubierta, hilo de encuadernación, aguja adecuada, plegadera, regla y base de trabajo.\n\nSECUENCIA\n1. Diseñar la maqueta.\n2. Imprimir una prueba y comprobar el orden.\n3. Doblar y reunir los pliegos.\n4. Marcar los puntos con la guía del taller.\n5. Coser con supervisión docente y comprobar la apertura.\n6. Revisar y corregir la terminación.\n\nCONTROL DE CALIDAD\nTexto legible, páginas completas y ordenadas, costura estable y cubierta alineada. Las medidas y los materiales definitivos se acuerdan en Gráfica.',image:taller},
  section('comun'),section('favorita',{image:taller,caption:'Taller ficticio de producción gráfica. Ilustración con IA, 2026.'}),
  {id:'amigos',title:'Las pausas también son parte de la historia',kicker:'Fotos con amigos · Galería de ejemplo 1',text:'Imagen 1. Alex, Emilia, Diego y Sofía, personajes ficticios, comparten una entrevista en el patio. Ilustración con IA, 2026.\n\nEscucharnos también fue una forma de conocernos. En el anuario real, este espacio lleva una fotografía propia con nombres verificados y permiso para publicarla.\n\nImagen 2. Colaboración en un taller de Gráfica imaginario. Ilustración con IA, 2026.\n\nPedir ayuda hizo que el trabajo avanzara.',image:patio,secondImage:taller},
  {id:'galeria',title:'Lo que cabe en un recuerdo',kicker:'Fotos con amigos · Galería de ejemplo 2',text:'Imagen 3. Libro abierto y aves de papel en un patio imaginario. Ilustración con IA, 2026.\n\nLos recuerdos toman otra forma cuando los compartimos.\n\nImagen 4. Conversación entre personajes ficticios, reutilizada para cerrar la galería. Ilustración con IA, 2026.\n\nUna pausa compartida también merece una página.\n\nEsta galería muestra cómo escribir pies completos. En tu versión selecciona cuatro fotografías diferentes, autorizadas y relacionadas con tu historia.',image:portada,secondImage:patio},
  {id:'despedida',title:'Lo que sigue con nosotros',kicker:'Despedida · Cierre personal',text:farewell},
  section('agradecimientos'),section('creditos'),section('contraportada',{image:portada,back:true})
];
const insertBefore = (anchor, ...items) => pages.splice(pages.findIndex(page=>page.id===anchor),0,...items);
insertBefore('entrevistas',section('identidad'),section('trayectoria'));
insertBefore('especialidad',section('anecdota'),section('participacion',{image:caminos,caption:'Creación y participación escolar imaginadas. Ilustración original con IA; personajes ficticios.'}),section('salidas'));
insertBefore('amigos',section('intereses'),section('creaciones',{image:caminos,caption:'La imagen con IA acompaña el guion ficticio. El estudiante puede ilustrar su propia creación a mano.'}));
insertBefore('despedida',section('futuro'));
pages.find(page=>page.id==='indice').text=pages.map((page,i)=>`${String(i+1).padStart(2,'0')} · ${page.title}`).join('\n');
pages.find(page=>page.id==='presentacion').text+='\n\nEste recorrido también deja lugar para intereses, anécdotas, actividades y decisiones personales. Son caminos posibles: cada estudiante puede elegir y combinar los que representan su historia. El orden y las 32 páginas de este modelo no son una cantidad obligatoria para todos.';
pages.find(page=>page.id==='galeria').text='Imagen 3. Libro abierto y aves de papel en un patio imaginario. Ilustración con IA, 2026.\n\nLos recuerdos toman otra forma cuando los compartimos.\n\nImagen 4. Dibujar, colaborar en una obra y mirar por la ventana de un viaje: escenas ficticias de participación escolar. Ilustración con IA, 2026.\n\nCada persona conserva un recorrido diferente. Esta galería usa cuatro ilustraciones distintas para mostrar cómo relacionar imágenes y recuerdos. En tu versión puedes seleccionar fotografías propias autorizadas o creaciones tuyas, identificando sus autores y lo que representan.';
pages.find(page=>page.id==='galeria').secondImage=caminos;
// Dirección de arte compartida por la edición web y el PDF.
const palettes = [
  {paper:'#FFD55E',ink:'#22304A',accent:'#934522',soft:'#FFE79A'},
  {paper:'#87CDB8',ink:'#123A36',accent:'#135647',soft:'#BCE5CB'},
  {paper:'#BCA8E4',ink:'#282344',accent:'#4C277D',soft:'#D9C8F0'},
  {paper:'#94C8EA',ink:'#12364A',accent:'#104A65',soft:'#C0E0F2'},
  {paper:'#F9A783',ink:'#30253C',accent:'#723548',soft:'#FFD4B7'},
  {paper:'#EEA8C0',ink:'#44233D',accent:'#722545',soft:'#F8D1DC'},
  {paper:'#FFB65A',ink:'#342746',accent:'#7A3A24',soft:'#FFD698'}
];
const layouts = {portada:'cover',dedicatoria:'poster',indice:'index',trayectoria:'timeline',ficha:'cards',creaciones:'cards',amigos:'gallery',galeria:'gallery',futuro:'letter',agradecimientos:'poster',contraportada:'back'};
const quotes = {
  identidad:'Un doblez, otro intento, una historia propia.',jefes:'Aprender también es sentirse acompañado.',
  jefeactual:'Las ayudas pequeñas dejan huella.',anecdota:'Lo que salió distinto también merece una página.',
  salidas:'Salir del aula. Volver con preguntas.',comun:'Una idea cambia cuando podemos explicarla.',
  despedida:'Lo que hicimos juntos sigue con nosotros.'
};
for (const [i,page] of pages.entries()) {
  page.visual={...palettes[i%palettes.length],layout:layouts[page.id]||(page.id==='entrevistas'||/^entrevista-\d/.test(page.id)?'interview':'story'),quote:quotes[page.id]||''};
  if(page.cover||page.back)Object.assign(page.visual,{paper:'#233CA6',ink:'#FFF6DA',accent:'#FFD55E',soft:'#1C3086'});
}
const visualImage=(id,file,caption)=>Object.assign(pages.find(page=>page.id===id),{image:'assets/'+file,caption});
visualImage('portada','modelo-portada-color.png','Un libro abre un mundo de recuerdos. Ilustración original con IA.');
pages[0].text='Lo que aprendimos juntos\nAnuario 2026 · 4°D TP · CEST\nAlex · personaje ficticio de esta edición\nModelo visual didáctico · textos e ilustraciones de ficción';
visualImage('presentacion','modelo-comunidad-color.png','Escuchar, dibujar y compartir: comunidad escolar ficticia, ilustrada con IA.');
visualImage('identidad','modelo-viaje-color.png','El barco de papel como símbolo de una trayectoria. Ilustración original con IA.');
visualImage('intereses','modelo-recuerdos-color.png','Objetos que cuentan intereses y experiencias ficticias. Ilustración original con IA.');
visualImage('futuro','modelo-viaje-color.png','Un recorrido que sigue abierto. Ilustración original con IA.');
pages.find(page=>page.id==='creditos').text=pages.find(page=>page.id==='creditos').text.replace('cuatro imágenes originales','ocho imágenes originales').replace('Diseño de referencia: páginas verticales, títulos jerarquizados, folios y pies de imagen.','Diseño de referencia: fondos de color en todas las páginas, líneas de tiempo, citas destacadas, fichas, galerías y una paleta común.');
// Ilustraciones de Gemini entregadas por el docente el 21 de septiembre.
visualImage('editada','gemini-01-entrevista.png','Escena ficticia de una entrevista escolar. Ilustración con Gemini; no representa a Emilia.');
visualImage('aniversario','gemini-02-aniversario.png','Preparación imaginada de una celebración escolar. Ilustración con Gemini.');
visualImage('jefes','gemini-03-profesores.png','Acompañamiento docente en un taller imaginario. Ilustración con Gemini; personas ficticias.');
visualImage('participacion','gemini-04-participacion.png','Arte, deporte y servicio en una comunidad ficticia. Ilustración con Gemini.');
visualImage('salidas','gemini-05-salida.png','Una salida educativa imaginada. Ilustración con Gemini.');
visualImage('ficha','gemini-06-encuadernacion.png','Proceso de encuadernación ilustrado con Gemini. Las técnicas se acuerdan con el docente de Gráfica.');
visualImage('creaciones','gemini-07-comic.png','Secuencia visual ficticia sobre un barco de papel, creada con Gemini.');
visualImage('contraportada','gemini-08-contraportada.png','Un libro y un camino que continúa. Ilustración de cierre creada con Gemini.');
pages.find(page=>page.id==='creditos').text=pages.find(page=>page.id==='creditos').text.replace('ocho imágenes originales','dieciséis ilustraciones: ocho generadas con OpenAI y ocho con Gemini, estas últimas entregadas por el docente');
module.exports=pages;
