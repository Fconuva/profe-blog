'use strict';

window.SIMCE_PERSONAL_GUIDED_DATA = {
  version: 'simce-personal-u3-s2-s10-v1',
  sessions: {
    '2': {
      sessionId: 'personal-u3-2-teatro',
      title: 'Teatro: conflicto y acción',
      objective: 'Reconocer el conflicto, las acciones y las decisiones de los personajes.',
      steps: ['Ubica quién habla y dónde ocurre la escena.', 'Distingue diálogo de indicación escénica.', 'Elige una respuesta y vuelve al fragmento para comprobarla.'],
      stimulusLabel: 'Escena breve',
      stimulusTitle: 'El ensayo continúa',
      stimulus: [
        'Sala de música del colegio. Tres estudiantes preparan una presentación. Afuera comienza a llover con fuerza.',
        'MARA: Si llevamos los instrumentos al patio, se pueden mojar. Será mejor cancelar.',
        'DIEGO: Ensayamos toda la semana. Podemos mover las sillas y tocar aquí.',
        '(Mara mira la puerta, guarda silencio unos segundos y vuelve junto al grupo).',
        'MARA: De acuerdo. Avisemos el cambio y pidamos ayuda para ordenar la sala.',
        'DIEGO: Entonces no perdemos el ensayo: lo adaptamos.'
      ],
      visual: { title:'Mapa de la escena', items:['Lugar: sala de música', 'Problema: la lluvia impide usar el patio', 'Decisión: adaptar el ensayo'] },
      questions: [
        { id:'q1', skill:'LOCALIZAR', prompt:'¿Qué problema inicia el conflicto de la escena?', cue:'Relee la primera intervención de Mara.', options:{ A:'El grupo olvidó los instrumentos.', B:'La lluvia amenaza la actividad del patio.', C:'Diego no quiere participar del ensayo.', D:'La sala de música está ocupada.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿Qué función cumple la oración escrita entre paréntesis?', cue:'Observa que esa oración no lleva el nombre de un personaje.', options:{ A:'Resume lo ocurrido antes del ensayo.', B:'Presenta la opinión del público.', C:'Explica la causa de la lluvia.', D:'Indica una acción que debe representarse.' } },
        { id:'q3', skill:'INTERPRETAR', prompt:'¿Qué cambio experimenta Mara durante la escena?', cue:'Compara lo que propone al inicio y al final.', options:{ A:'Pasa de cancelar a buscar una solución.', B:'Pasa de ayudar a abandonar al grupo.', C:'Pasa de ordenar a desarmar la sala.', D:'Pasa de escuchar a impedir el ensayo.' } },
        { id:'q4', skill:'REFLEXIONAR', prompt:'¿Qué efecto produce la pausa de Mara antes de responder?', cue:'Relaciona el silencio con la decisión que viene después.', options:{ A:'Presenta un salto de varios días.', B:'Introduce a un personaje nuevo.', C:'Aumenta la tensión antes de la decisión.', D:'Demuestra que la escena terminó.' } },
        { id:'q5', skill:'INTERPRETAR', prompt:'¿Qué frase muestra mejor una decisión orientada al trabajo del grupo?', cue:'Busca una propuesta que incluya una acción compartida.', options:{ A:'“Afuera comienza a llover”.', B:'“Pidamos ayuda para ordenar la sala”.', C:'“Ensayamos toda la semana”.', D:'“Se pueden mojar”.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Cómo se resuelve el conflicto principal?', cue:'Relee las dos últimas intervenciones.', options:{ A:'El grupo traslada los instrumentos bajo la lluvia.', B:'Mara cancela la presentación sin consultar.', C:'Diego decide ensayar completamente solo.', D:'El grupo adapta el espacio y mantiene el ensayo.' } }
      ]
    },
    '3': {
      sessionId: 'personal-u3-3-reportaje',
      title: 'Reportaje: información y fuentes',
      objective: 'Reconocer la idea principal, los datos y las fuentes de un texto informativo.',
      steps: ['Lee el título y la entrada para anticipar el tema.', 'Subraya mentalmente datos y nombres de fuentes.', 'Distingue lo que el texto demuestra de lo que solo sugiere.'],
      stimulusLabel: 'Nota informativa breve',
      stimulusTitle: 'La biblioteca abre antes y suma lectores',
      stimulus: [
        'Desde comienzos de agosto, la biblioteca del colegio abre treinta minutos antes del inicio de clases. La medida busca ofrecer un espacio tranquilo para leer, estudiar o devolver libros.',
        'Según la encargada de la biblioteca, durante la primera semana ingresaron 46 estudiantes antes de clases. En la semana anterior al cambio habían ingresado 18 en ese mismo horario.',
        'La encargada explicó que todavía es pronto para saber si el aumento se mantendrá. El centro de estudiantes propuso consultar a quienes usan el espacio para conocer qué actividades prefieren realizar allí.'
      ],
      visual: { title:'Partes para revisar', items:['Entrada: resume la novedad', 'Dato: 18 antes y 46 después', 'Fuente: encargada de biblioteca'] },
      questions: [
        { id:'q1', skill:'LOCALIZAR', prompt:'¿Qué parte resume primero la novedad principal?', cue:'Relee el primer párrafo y busca el cambio de horario.', options:{ A:'La propuesta del centro de estudiantes.', B:'La explicación sobre la próxima semana.', C:'La entrada que anuncia la apertura anticipada.', D:'La comparación de las preferencias lectoras.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿Cuál es el propósito principal del texto?', cue:'Integra el título con los tres párrafos.', options:{ A:'Informar una medida y sus primeros resultados.', B:'Convencer de comprar libros nuevos.', C:'Criticar el trabajo de la biblioteca.', D:'Narrar una aventura ocurrida al amanecer.' } },
        { id:'q3', skill:'LOCALIZAR', prompt:'¿A qué fuente atribuye el texto la cifra de 46 estudiantes?', cue:'Busca las palabras “según” y “explicó”.', options:{ A:'A una encuesta nacional de lectura.', B:'A la dirección del establecimiento.', C:'Al centro de estudiantes.', D:'A la encargada de la biblioteca.' } },
        { id:'q4', skill:'INTERPRETAR', prompt:'¿Qué permite observar la comparación entre 18 y 46?', cue:'Compara la semana anterior con la primera semana del cambio.', options:{ A:'Que todos los cursos visitaron la biblioteca.', B:'Que aumentó el ingreso en ese horario.', C:'Que se prestaron exactamente 64 libros.', D:'Que la biblioteca cerró durante una semana.' } },
        { id:'q5', skill:'REFLEXIONAR', prompt:'¿Cuál es la conclusión más prudente a partir del texto?', cue:'Relee la advertencia de la encargada en el último párrafo.', options:{ A:'La apertura temprana funcionará igual durante todo el año.', B:'El cambio resolvió todos los problemas de estudio.', C:'Hubo un aumento inicial que aún debe observarse.', D:'La mayoría del colegio prefiere estudiar en silencio.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué fuente adicional ayudaría a comprender mejor el resultado?', cue:'Piensa qué voz todavía no aparece directamente.', options:{ A:'Testimonios de estudiantes que usaron el horario.', B:'Una lista de novelas publicadas este año.', C:'Un mapa de todas las bibliotecas del país.', D:'La opinión de una persona ajena al colegio.' } }
      ]
    },
    '4': {
      sessionId: 'personal-u3-4-campana-visual',
      title: 'Campaña visual: propósito y datos',
      objective: 'Relacionar un llamado de campaña con la información de una tabla.',
      steps: ['Lee el lema y reconoce a quién se dirige.', 'Observa los encabezados antes de comparar cifras.', 'Comprueba que tu respuesta use información de ambas partes.'],
      stimulusLabel: 'Campaña escolar',
      stimulusTitle: 'Trae tu botella, reduce un residuo',
      stimulus: [
        'Durante la Semana del Agua, el comité ambiental invitó a estudiantes y funcionarios a llevar una botella reutilizable. El mensaje central decía: “Una semana, una botella, menos residuos”.',
        'El comité contó las botellas desechables encontradas al finalizar cada recreo principal. Los resultados describen solo esa semana de campaña.'
      ],
      table: { headers:['Día', 'Botellas desechables'], rows:[['Lunes','42'],['Martes','35'],['Miércoles','21'],['Jueves','24'],['Viernes','23']] },
      visual: { title:'Orden de lectura', items:['1. Lema: identifica el llamado', '2. Tabla: compara los días', '3. Fuente: limita la conclusión'] },
      questions: [
        { id:'q1', skill:'LOCALIZAR', prompt:'¿Qué acción solicita la campaña?', cue:'Relee la primera oración y el lema.', options:{ A:'Evitar todos los recreos de la semana.', B:'Comprar agua en botellas pequeñas.', C:'Contar residuos fuera del colegio.', D:'Llevar una botella reutilizable.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿A quién se dirige principalmente el mensaje?', cue:'Busca los grupos nombrados en el primer párrafo.', options:{ A:'Solo a quienes integran el comité.', B:'A estudiantes y funcionarios del colegio.', C:'A las familias de toda la comuna.', D:'A vendedores de botellas desechables.' } },
        { id:'q3', skill:'LOCALIZAR', prompt:'¿Qué día registra la menor cantidad de botellas desechables?', cue:'Compara los cinco números de la tabla.', options:{ A:'Lunes.', B:'Martes.', C:'Miércoles.', D:'Jueves.' } },
        { id:'q4', skill:'INTERPRETAR', prompt:'¿Cómo se relacionan el lema y la tabla?', cue:'Piensa qué propone el lema y qué registra la tabla.', options:{ A:'El lema llama a actuar y la tabla muestra resultados.', B:'El lema contradice todos los datos de la tabla.', C:'La tabla presenta personas que inventaron el lema.', D:'Ambos elementos explican cómo fabricar botellas.' } },
        { id:'q5', skill:'REFLEXIONAR', prompt:'¿Qué afirmación no puede demostrarse con estos datos?', cue:'Recuerda que el registro corresponde a una sola semana.', options:{ A:'El lunes se contaron 42 botellas.', B:'El miércoles se registró el valor menor.', C:'El viernes hubo menos botellas que el martes.', D:'La reducción continuará durante todo el año.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué dato adicional permitiría interpretar mejor la campaña?', cue:'Piensa qué información ayudaría a comparar la participación.', options:{ A:'El color preferido de las botellas.', B:'La cantidad de personas presentes cada día.', C:'El nombre de todas las asignaturas.', D:'La marca de cada botella encontrada.' } }
      ]
    },
    '5': {
      sessionId: 'personal-u3-5-integrar-evidencia',
      title: 'Integrar evidencia',
      objective: 'Relacionar una afirmación con el dato que la apoya y explicar esa relación.',
      steps: ['Identifica primero la afirmación.', 'Busca un dato que responda exactamente a esa idea.', 'Explica con tus palabras por qué el dato sirve como evidencia.'],
      stimulusLabel: 'Ficha de evidencia',
      stimulusTitle: '¿Ayudó el nuevo horario?',
      stimulus: [
        'Afirmación: Abrir la biblioteca antes de clases facilitó que más estudiantes usaran ese espacio.',
        'Dato 1: En la semana anterior al cambio entraron 18 estudiantes antes de clases.',
        'Dato 2: En la primera semana con el nuevo horario entraron 46 estudiantes antes de clases.',
        'Dato 3: Las paredes de la biblioteca fueron pintadas de color verde el año pasado.'
      ],
      image: { src:'/estudiantes/assets/u3s5/afiche-aee.png', alt:'Afiche con la secuencia afirmación, evidencia y explicación.' },
      visual: { title:'Fórmula de respuesta', items:['Afirmación: lo que sostengo', 'Evidencia: el dato preciso', 'Explicación: cómo el dato apoya la idea'] },
      questions: [
        { id:'q1', skill:'LOCALIZAR', prompt:'¿Cuál es la afirmación que debe evaluarse?', cue:'Relee la primera línea de la ficha.', options:{ A:'Abrir antes facilitó el uso de la biblioteca.', B:'Las paredes verdes mejoran la lectura.', C:'Todos los estudiantes prefieren llegar temprano.', D:'La biblioteca necesita cambiar sus libros.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿Qué evidencia apoya de manera más directa la afirmación?', cue:'Busca el dato que informa uso antes de clases después del cambio.', options:{ A:'El color verde usado el año pasado.', B:'La existencia de una biblioteca escolar.', C:'El ingreso de 46 estudiantes con el nuevo horario.', D:'La opinión de quienes no usaron el espacio.' } },
        { id:'q3', skill:'INTERPRETAR', prompt:'¿Qué debe hacer una explicación después de citar el dato?', cue:'Usa la fórmula afirmación, evidencia y explicación.', options:{ A:'Copiar exactamente la afirmación inicial.', B:'Mostrar cómo el aumento apoya la afirmación.', C:'Agregar un tema que no aparece en la ficha.', D:'Eliminar la cifra para evitar comparaciones.' } },
        { id:'q4', skill:'REFLEXIONAR', prompt:'¿Qué dato es irrelevante para evaluar el efecto del horario?', cue:'Compara el tema de cada dato con la afirmación.', options:{ A:'La cifra anterior de 18 estudiantes.', B:'La cifra posterior de 46 estudiantes.', C:'El momento en que se midió la asistencia.', D:'El color de las paredes de la biblioteca.' } },
        { id:'q5', skill:'INTERPRETAR', prompt:'¿Cuál respuesta integra mejor afirmación, evidencia y explicación?', cue:'Busca una oración que incluya idea, cifra y relación.', options:{ A:'El horario parece ayudar: el ingreso subió de 18 a 46, por lo que más estudiantes usaron el espacio.', B:'La biblioteca es verde y muchas personas consideran que ese color es agradable.', C:'Cuarenta y seis es un número mayor que otros números que podrían haberse registrado.', D:'El horario cambió, aunque no es necesario revisar ninguna evidencia para comentarlo.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué comparación fortalecería la evaluación del cambio?', cue:'Piensa qué dato permitiría observar si el resultado se mantiene.', options:{ A:'Comparar el tamaño de la biblioteca con el patio.', B:'Comparar el color actual con el del año anterior.', C:'Comparar varias semanas antes y después del cambio.', D:'Comparar títulos de libros de distintos géneros.' } }
      ]
    },
    '6': {
      sessionId: 'personal-u3-6-lenguaje-figurado',
      title: 'Poesía y lenguaje figurado',
      objective: 'Interpretar imágenes poéticas y explicar el efecto del lenguaje figurado.',
      steps: ['Lee el poema completo una vez.', 'Vuelve al verso señalado y reconoce la imagen.', 'Explica qué idea o sensación comunica esa imagen.'],
      stimulusLabel: 'Poema breve',
      stimulusTitle: 'Comienza el patio',
      stimulus: [
        'La mañana es una llave / que abre despacio el patio.',
        'La ventana se despierta / con un borde anaranjado.',
        'Cruzan pasos por la sombra, / una puerta da su canto,',
        'y el día, todavía pequeño, / crece entre cuadernos y manos.'
      ],
      image: { src:'/estudiantes/img/u3s6/jardin.jpg', alt:'Jardín iluminado por la luz suave del amanecer.' },
      visual: { title:'Tres preguntas para interpretar', items:['¿Qué dos elementos se relacionan?', '¿Qué característica comparten?', '¿Qué sensación produce la imagen?'] },
      questions: [
        { id:'q1', skill:'INTERPRETAR', prompt:'¿Qué recurso aparece en “La mañana es una llave”?', cue:'Observa que un elemento se identifica directamente con otro.', options:{ A:'Una enumeración de objetos.', B:'Una metáfora que presenta el inicio como apertura.', C:'Una comparación marcada por la palabra “como”.', D:'Una repetición de sonidos sin significado.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿Qué recurso aparece en “La ventana se despierta”?', cue:'Pregúntate si una ventana puede realizar esa acción humana.', options:{ A:'Una personificación.', B:'Una definición literal.', C:'Una pregunta retórica.', D:'Una contradicción.' } },
        { id:'q3', skill:'LOCALIZAR', prompt:'¿Qué señales anuncian que comienza la jornada?', cue:'Relee los versos sobre el patio, los pasos y la luz.', options:{ A:'La lluvia y el cierre de las puertas.', B:'El silencio y la desaparición del patio.', C:'La noche y los cuadernos guardados.', D:'La luz, los pasos y las puertas en movimiento.' } },
        { id:'q4', skill:'INTERPRETAR', prompt:'¿Qué tono predomina en el poema?', cue:'Considera palabras como “despacio”, “pequeño” y “crece”.', options:{ A:'Amenazante y violento.', B:'Burlesco y exagerado.', C:'Sereno y esperanzador.', D:'Frío y completamente indiferente.' } },
        { id:'q5', skill:'REFLEXIONAR', prompt:'¿Qué idea central reúnen las imágenes del poema?', cue:'Relaciona la mañana con el crecimiento del día.', options:{ A:'El patio permanece vacío para siempre.', B:'La jornada comienza mediante cambios pequeños.', C:'La escuela desaparece cuando llega la luz.', D:'Los cuadernos impiden observar el amanecer.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué procedimiento permite justificar mejor una interpretación?', cue:'Piensa cómo se demuestra una idea sobre un poema.', options:{ A:'Citar una imagen y explicar el efecto que produce.', B:'Elegir un verso al azar sin comentarlo.', C:'Reemplazar el poema por una experiencia personal.', D:'Contar solamente el número total de palabras.' } }
      ]
    },
    '7': {
      sessionId: 'personal-u3-7-discurso',
      title: 'Discurso: propósito y audiencia',
      objective: 'Reconocer quién habla, a quién se dirige y qué recursos usa para convencer.',
      steps: ['Identifica hablante, audiencia y propósito.', 'Marca la tesis y el dato que la apoya.', 'Observa cómo las preguntas y concesiones buscan persuadir.'],
      stimulusLabel: 'Discurso escolar breve',
      stimulusTitle: 'Un recreo con menos residuos',
      stimulus: [
        'Compañeras y compañeros del centro de estudiantes: la semana pasada reunimos 126 envases desechables después de un solo recreo. Ese número muestra un problema que sí podemos reducir.',
        '¿Qué pasaría si durante un viernes cada curso probara colaciones con menos envoltorios? Sabemos que cambiar una costumbre cuesta, pero una experiencia breve nos permitirá medir el resultado sin imponer una solución definitiva.',
        'Propongo realizar la prueba este viernes, contar nuevamente los residuos y decidir juntos el paso siguiente. Hagamos un cambio pequeño que podamos observar.'
      ],
      image: { src:'/estudiantes/assets/u3s7/infografia-leer-discurso.png', alt:'Infografía con preguntas para reconocer hablante, audiencia, propósito, tesis y estrategias.' },
      visual: { title:'Mapa del discurso', items:['Quién habla y ante quién', 'Qué idea defiende', 'Qué evidencia y estrategia utiliza'] },
      questions: [
        { id:'q1', skill:'LOCALIZAR', prompt:'¿Ante qué audiencia se presenta el discurso?', cue:'Relee el saludo inicial.', options:{ A:'Ante todas las familias de la comuna.', B:'Ante vendedores de alimentos.', C:'Ante el centro de estudiantes.', D:'Ante un grupo de científicos.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿Cuál es el propósito principal de la vocera?', cue:'Revisa la propuesta del último párrafo.', options:{ A:'Narrar cómo se fabrican los envases.', B:'Informar el horario de cada recreo.', C:'Criticar a un curso específico.', D:'Convencer de realizar una prueba para reducir residuos.' } },
        { id:'q3', skill:'INTERPRETAR', prompt:'¿Qué función cumple la cifra de 126 envases?', cue:'Relaciona el número con el problema que se presenta.', options:{ A:'Aporta evidencia para justificar la propuesta.', B:'Indica la cantidad de cursos del colegio.', C:'Señala la duración exacta del discurso.', D:'Reemplaza la idea principal por un detalle.' } },
        { id:'q4', skill:'INTERPRETAR', prompt:'¿Qué efecto busca la pregunta “¿Qué pasaría si...?”?', cue:'Piensa qué hace la audiencia al escuchar una pregunta sin respuesta inmediata.', options:{ A:'Cerrar la conversación antes de la propuesta.', B:'Invitar a imaginar y considerar una posibilidad.', C:'Demostrar que la vocera desconoce el tema.', D:'Cambiar el discurso por una entrevista.' } },
        { id:'q5', skill:'REFLEXIONAR', prompt:'¿Por qué la vocera dice que cambiar una costumbre cuesta?', cue:'Observa qué reconoce antes de insistir en su propuesta.', options:{ A:'Para abandonar inmediatamente la iniciativa.', B:'Para culpar a quienes usan envoltorios.', C:'Para reconocer una dificultad y responderla.', D:'Para afirmar que medir es innecesario.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué hace que el cierre pueda movilizar a la audiencia?', cue:'Relee las acciones concretas del último párrafo.', options:{ A:'Propone una medida permanente sin evaluación.', B:'Promete un resultado que no puede medirse.', C:'Evita indicar cuándo se realizará la actividad.', D:'Presenta una acción breve, conjunta y evaluable.' } }
      ]
    },
    '8': {
      sessionId: 'personal-u3-8-mini-ensayo',
      title: 'Miniensayo de lectura',
      objective: 'Aplicar estrategias de localizar, interpretar y evaluar en un texto funcional.',
      steps: ['Lee primero el aviso completo.', 'En cada pregunta identifica la habilidad solicitada.', 'Descarta opciones que agreguen información ausente.'],
      stimulusLabel: 'Aviso escolar',
      stimulusTitle: 'Feria Repara y Reutiliza',
      stimulus: [
        'Este jueves se realizará en el patio techado la Feria Repara y Reutiliza. Cada equipo debe inscribirse con un objeto en desuso y una propuesta sencilla para repararlo o darle una función diferente.',
        'Habrá herramientas básicas y apoyo de estudiantes del taller. La actividad busca mostrar que revisar y reparar puede ser una opción antes de reemplazar un objeto.',
        'Inscripciones hasta el miércoles en la biblioteca. Los cupos son limitados. El aviso no informa el horario de inicio ni de término.'
      ],
      image: { src:'/estudiantes/assets/u3s5/afiche-distractores.png', alt:'Afiche con estrategias para descartar alternativas que no se apoyan en el texto.' },
      visual: { title:'Ruta de respuesta', items:['Localizar: busca un dato explícito', 'Interpretar: relaciona ideas', 'Evaluar: revisa límites y omisiones'] },
      questions: [
        { id:'q1', skill:'LOCALIZAR', prompt:'¿Cuándo y dónde se realizará la feria?', cue:'Relee la primera oración del aviso.', options:{ A:'El miércoles en la biblioteca.', B:'El viernes en el taller.', C:'El jueves en la biblioteca.', D:'El jueves en el patio techado.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿Cuál es la finalidad principal del aviso?', cue:'Relaciona el título con las instrucciones de participación.', options:{ A:'Vender herramientas a los cursos.', B:'Prohibir el uso de objetos antiguos.', C:'Invitar a participar e indicar cómo hacerlo.', D:'Relatar el origen del taller escolar.' } },
        { id:'q3', skill:'INTERPRETAR', prompt:'¿Qué idea resume mejor el segundo párrafo?', cue:'Busca la relación entre reparar y reemplazar.', options:{ A:'Las herramientas nuevas siempre son mejores.', B:'Reparar puede ser una alternativa al reemplazo.', C:'Solo el taller puede reutilizar objetos.', D:'Todos los objetos dañados deben desecharse.' } },
        { id:'q4', skill:'LOCALIZAR', prompt:'¿Qué debe presentar cada equipo al inscribirse?', cue:'Relee la segunda oración del primer párrafo.', options:{ A:'Un objeto y una propuesta de reparación o nuevo uso.', B:'Una herramienta y un informe de varias páginas.', C:'Una lista completa de quienes asistirán al patio.', D:'Un objeto nuevo comprado para la actividad.' } },
        { id:'q5', skill:'REFLEXIONAR', prompt:'¿Qué afirmación excede la información del aviso?', cue:'Descarta la opción que usa una idea absoluta no demostrada.', options:{ A:'La feria tendrá cupos limitados.', B:'Las inscripciones terminan el miércoles.', C:'Habrá apoyo de estudiantes del taller.', D:'Todos los objetos presentados podrán repararse.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué información importante falta en el aviso?', cue:'Relee la última oración.', options:{ A:'El nombre completo de cada herramienta.', B:'La historia de todos los objetos.', C:'El horario de inicio y término.', D:'La cantidad de páginas de la inscripción.' } }
      ]
    },
    '9': {
      sessionId: 'personal-u3-9-correccion',
      title: 'Corregir con evidencia',
      objective: 'Reconocer por qué falla un distractor y registrar una estrategia de mejora.',
      steps: ['Vuelve al verbo de la pregunta.', 'Compara cada alternativa con una frase del texto.', 'Nombra el error y anota cómo evitarlo.'],
      stimulusLabel: 'Caso de corrección',
      stimulusTitle: 'Revisar una respuesta',
      stimulus: [
        'Pregunta original: ¿Cuál es el propósito principal del aviso sobre la Feria Repara y Reutiliza?',
        'Respuesta marcada: “Informar que habrá herramientas básicas”.',
        'Revisión: La opción menciona un detalle verdadero, pero el aviso completo busca invitar a participar y explicar cómo inscribirse. El detalle de las herramientas apoya la actividad, aunque no representa el propósito global.',
        'Nota de mejora: En una pregunta por propósito, volveré a leer el título, el llamado principal y las instrucciones antes de elegir.'
      ],
      image: { src:'/estudiantes/assets/u3s9/practica-dirigida.png', alt:'Apoyo visual para revisar la pregunta, volver al texto y corregir una alternativa.' },
      visual: { title:'Ciclo de corrección', items:['1. Identifica qué pregunta se hizo', '2. Encuentra evidencia en el texto', '3. Explica el error y la mejora'] },
      questions: [
        { id:'q1', skill:'INTERPRETAR', prompt:'¿Cuál fue el error de la respuesta marcada?', cue:'Compara el detalle elegido con el propósito del aviso completo.', options:{ A:'Confundió un detalle verdadero con el propósito global.', B:'Inventó una feria que no aparece en el texto.', C:'Cambió una cifra correcta por otra cifra.', D:'Identificó correctamente el llamado principal.' } },
        { id:'q2', skill:'REFLEXIONAR', prompt:'¿Qué conviene revisar primero al corregir una respuesta?', cue:'Observa el primer paso del ciclo de corrección.', options:{ A:'La cantidad de letras de cada alternativa.', B:'El verbo y la tarea solicitada en la pregunta.', C:'La opción que eligió otra persona.', D:'El orden alfabético de las respuestas.' } },
        { id:'q3', skill:'LOCALIZAR', prompt:'¿Qué frase del aviso expresa su llamado principal?', cue:'Vuelve a la instrucción dirigida a cada equipo.', options:{ A:'“Habrá herramientas básicas”.', B:'“Los cupos son limitados”.', C:'“Cada equipo debe inscribirse con un objeto y una propuesta”.', D:'“El aviso no informa el horario”.' } },
        { id:'q4', skill:'INTERPRETAR', prompt:'¿Por qué sería incorrecto afirmar que la participación es obligatoria?', cue:'Busca si el texto ordena asistir a todos los cursos.', options:{ A:'Porque la feria ocurre en un patio.', B:'Porque el texto menciona herramientas.', C:'Porque la inscripción termina el miércoles.', D:'Porque el aviso invita e informa cupos, pero no obliga.' } },
        { id:'q5', skill:'REFLEXIONAR', prompt:'¿Qué acción permite corregir con evidencia?', cue:'Usa el segundo paso del ciclo de corrección.', options:{ A:'Comparar cada opción con una frase concreta del texto.', B:'Cambiar la respuesta sin volver a leer.', C:'Elegir siempre la alternativa más extensa.', D:'Eliminar las opciones antes de analizarlas.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué debe contener una buena nota de mejora?', cue:'Relee el último párrafo del caso.', options:{ A:'Solo la letra de la nueva respuesta.', B:'El error identificado y una acción para evitarlo.', C:'Una copia completa de todas las alternativas.', D:'Una opinión sobre el diseño del aviso.' } }
      ]
    },
    '10': {
      sessionId: 'personal-u3-10-cronica-carta',
      title: 'Crónica y carta',
      objective: 'Comparar cómo dos géneros presentan un mismo hecho con propósitos diferentes.',
      steps: ['Reconoce quién escribe y para quién.', 'Ubica hechos, opiniones y orden temporal.', 'Compara el propósito de cada texto antes de responder.'],
      stimulusLabel: 'Dos textos breves',
      stimulusTitle: 'Una actividad bajo otra luz',
      stimulus: [
        'CRÓNICA. A las 18:10, justo cuando comenzaba la muestra artística, se cortó la electricidad del gimnasio. Primero hubo silencio; luego, estudiantes y familias encendieron las linternas de sus teléfonos. La presentación continuó con instrumentos acústicos y terminó veinte minutos después. Desde la última fila, la escena parecía un pequeño cielo iluminado.',
        'CARTA. Señora directora: agradecemos que el equipo permitiera continuar la muestra durante el corte de luz. La colaboración evitó suspender el trabajo preparado por los cursos. Para una próxima actividad, proponemos disponer luces de emergencia cerca del escenario. Atentamente, representantes de segundo medio.'
      ],
      image: { src:'/estudiantes/assets/u3s10/cronica-vs-carta-infografia.png', alt:'Infografía que compara la secuencia de una crónica con el destinatario y propósito de una carta.' },
      visual: { title:'Comparación rápida', items:['Crónica: reconstruye una secuencia', 'Carta: se dirige a una persona', 'Ambas: presentan el mismo hecho'] },
      questions: [
        { id:'q1', skill:'LOCALIZAR', prompt:'¿Qué secuencia presenta la crónica?', cue:'Sigue los conectores “primero”, “luego” y “terminó”.', options:{ A:'La carta, la respuesta y una nueva muestra.', B:'El corte, las linternas y la continuación.', C:'La llegada, el ensayo y la suspensión.', D:'El escenario, la dirección y las familias.' } },
        { id:'q2', skill:'INTERPRETAR', prompt:'¿Qué expresión comunica una impresión personal de quien narra?', cue:'Busca una comparación al final de la crónica.', options:{ A:'“A las 18:10”.', B:'“Se cortó la electricidad”.', C:'“Terminó veinte minutos después”.', D:'“Parecía un pequeño cielo iluminado”.' } },
        { id:'q3', skill:'LOCALIZAR', prompt:'¿A quién se dirige la carta?', cue:'Relee el saludo inicial.', options:{ A:'A la directora.', B:'A las familias.', C:'Al equipo artístico.', D:'A quienes leen la crónica.' } },
        { id:'q4', skill:'INTERPRETAR', prompt:'¿Cuál es el propósito principal de la carta?', cue:'Integra el agradecimiento con la propuesta final.', options:{ A:'Describir la apariencia del gimnasio.', B:'Ordenar cronológicamente todos los hechos.', C:'Agradecer y proponer una mejora.', D:'Inventar un final diferente para la muestra.' } },
        { id:'q5', skill:'REFLEXIONAR', prompt:'¿Qué relación existe entre ambos textos?', cue:'Compara el hecho presentado y la forma de organizarlo.', options:{ A:'Relatan actividades diferentes sin conexión.', B:'Presentan el mismo hecho con propósitos distintos.', C:'Usan exactamente la misma estructura y destinatario.', D:'Defienden que la muestra debió suspenderse.' } },
        { id:'q6', skill:'REFLEXIONAR', prompt:'¿Qué diferencia de género se observa con mayor claridad?', cue:'Piensa qué permite hacer cada estructura.', options:{ A:'La carta usa horas y la crónica nunca las usa.', B:'La crónica tiene destinatario y firma obligatorios.', C:'Ambos textos solo expresan opiniones personales.', D:'La crónica reconstruye; la carta formula una petición.' } }
      ]
    }
  }
};
