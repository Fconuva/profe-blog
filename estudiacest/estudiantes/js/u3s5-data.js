(function () {
  'use strict';

  const units = [
    {
      id: 't1',
      label: 'Texto 1 · Narración',
      title: 'La última transmisión',
      source: 'Texto original elaborado para esta clase.',
      body: `
        <p>A las cinco y cuarenta de la mañana, Elías empujó la puerta de la radio comunitaria con el hombro. Llevaba una caja de herramientas, una linterna y una bolsa de plástico donde había guardado tres casetes. Durante la noche, el río había desbordado el canal y el agua entró por la ventana trasera del edificio. La municipalidad anunció que, si volvía a llover, cortaría la electricidad del sector para evitar accidentes.</p>
        <p>La cabina olía a madera mojada. El reloj redondo de la pared se había detenido a las dos y diecisiete, pero la consola seguía encendida gracias a una batería. Mara, la presidenta de la junta de vecinos, hablaba por teléfono junto a la puerta.</p>
        <p>—Quedan cuarenta minutos de energía —dijo al colgar—. Desde el consultorio piden que avisemos qué calles deben evacuar. La antena todavía funciona.</p>
        <p>Elías dejó los casetes sobre la mesa. En uno de ellos estaba la última entrevista que su padre había dado antes de morir. Don Julián había fundado la radio treinta años atrás y todos los domingos abría el programa diciendo: «Una comunidad existe mientras sea capaz de escucharse». La cinta nunca había sido digitalizada. Si la humedad alcanzaba el estante o si la batería se agotaba antes de copiarla, tal vez la grabación se perdería.</p>
        <p>—Necesito veinte minutos para salvarla —dijo Elías—. Después transmitimos.</p>
        <p>Mara miró la lista que sostenía en la mano. Había nombres de calles, horarios y un número de emergencia. No discutió. Solo dejó la hoja junto al micrófono.</p>
        <p>Elías conectó el reproductor. La cinta giró con un zumbido irregular. Primero se oyó estática; luego, la voz de su padre llenó la cabina. Era más joven de lo que Elías recordaba. Hablaba sobre la primera inundación que había cubierto el barrio y sobre la decisión de abrir la radio durante toda la noche para coordinar botes, frazadas y alimentos.</p>
        <p>«Las máquinas guardan voces», decía Don Julián en la grabación, «pero una voz no sirve de mucho si llega cuando ya nadie puede responder».</p>
        <p>Elías detuvo el casete. Afuera, una camioneta avanzó por la calle tocando la bocina. Mara recibió un mensaje: el agua había cortado el camino del puente viejo y varias familias seguían sin saberlo. El reloj continuaba inmóvil en las dos y diecisiete, como si la cabina perteneciera todavía a la noche anterior.</p>
        <p>—Pon la música de espera —pidió Elías—. Salimos al aire en un minuto.</p>
        <p>Guardó el casete en la bolsa y acercó la lista al micrófono. Durante media hora repitieron instrucciones, verificaron datos con el consultorio y recibieron llamadas de vecinos. Una mujer informó que tres adultos mayores necesitaban transporte. Un conductor ofreció su furgón. Un almacenero anunció que mantendría abierto para entregar agua. La voz de Mara tembló al comienzo, pero se volvió firme con cada mensaje.</p>
        <p>A las seis y veintiocho, la batería emitió un pitido. Elías alcanzó a decir que la transmisión terminaría, pero que la sede vecinal seguiría recibiendo información. Cuando la consola se apagó, la cabina quedó en silencio.</p>
        <p>—No alcanzaste a copiarlo —dijo Mara, mirando la bolsa.</p>
        <p>Elías negó con la cabeza. Sacó el casete y comprobó que la cinta no estuviera enredada. Seguía allí, frágil y húmeda en los bordes. En el pasillo, varias personas repetían las direcciones que habían oído por la radio.</p>
        <p>—Todavía puedo intentarlo cuando vuelva la luz —respondió—. Pero ahora entiendo por qué mi padre dejó esa frase grabada.</p>
        <p>Mara ajustó el reloj detenido y movió las agujas hasta las seis y media. No era la hora exacta, pero era la hora en que la radio había dejado de hablar y el barrio había empezado a organizarse.</p>`
    },
    {
      id: 't2',
      label: 'Texto 2 · Dos poemas',
      title: 'Dos formas de recordar',
      source: 'Poemas originales elaborados para esta clase.',
      body: `
        <div class="poem-pair">
          <section>
            <h4>I. Inventario de la casa</h4>
            <p class="verse">En la taza quedó una media luna<br>de café endurecido.<br>En la silla, el peso de una espalda<br>que ya no vuelve.<br>Abro el armario y cada camisa<br>pronuncia un nombre distinto.<br>No toco nada:<br>temo que el polvo, al levantarse,<br>borre el camino de regreso.</p>
          </section>
          <section>
            <h4>II. Lo que se lleva el río</h4>
            <p class="verse">El río no conserva las hojas:<br>las mezcla, las aleja,<br>les presta otra orilla.<br>Yo arrojo una palabra al agua<br>y vuelve convertida en eco.<br>Recordar no es cerrar la mano,<br>sino aprender el cauce<br>por donde cambia<br>lo que todavía nos acompaña.</p>
          </section>
        </div>`
    },
    {
      id: 't3',
      label: 'Texto 3 · Obra dramática',
      title: 'Turno de agua',
      source: 'Escena original elaborada para esta clase.',
      body: `
        <p class="stage"><strong>Personajes:</strong> VALENTINA, presidenta del centro de estudiantes; MATEO, estudiante; SEÑORA ROJAS, encargada del comedor; DON HÉCTOR, técnico municipal.</p>
        <p class="stage">Sala de reuniones de una escuela. Sobre la mesa hay botellas vacías y una hoja con horarios. Se escucha el goteo irregular de una llave.</p>
        <p><strong>VALENTINA:</strong> La publicación dice que el estanque está contaminado. Si es cierto, mañana nadie debería venir.</p>
        <p><strong>MATEO:</strong> Ya la compartieron casi todos. Tiene una foto del estanque y el logo de la municipalidad.</p>
        <p><strong>SEÑORA ROJAS:</strong> El logo está cortado. Además, la foto es de cuando limpiaron el estanque en marzo. Yo estaba aquí.</p>
        <p><strong>MATEO:</strong> ¿Y si esta vez sí es verdad? Si esperamos una confirmación, puede ser tarde.</p>
        <p class="stage">VALENTINA toma el teléfono, amplía la imagen y guarda silencio.</p>
        <p><strong>VALENTINA:</strong> No aparece fecha, ni nombre de quien informa. Solo dice «difundir con urgencia».</p>
        <p><strong>MATEO:</strong> Justamente. Cuando algo es urgente, uno no se pone a revisar detalles.</p>
        <p><strong>SEÑORA ROJAS:</strong> Cuando algo es urgente, revisar la fuente importa más, no menos.</p>
        <p class="stage">Entra DON HÉCTOR con una carpeta plástica. Deja correr agua de la llave durante unos segundos y llena un vaso transparente.</p>
        <p><strong>DON HÉCTOR:</strong> El corte de hoy fue por baja presión en la red, no por contaminación. Aquí están los resultados del muestreo de ayer y el aviso oficial. El estanque puede usarse.</p>
        <p><strong>MATEO:</strong> Entonces publicamos que la imagen es falsa.</p>
        <p><strong>DON HÉCTOR:</strong> Espera. La fotografía no es falsa; está fuera de contexto. Y la preocupación tampoco es absurda. El problema es que alguien usó una imagen real para sostener una advertencia que no verificó.</p>
        <p><strong>VALENTINA:</strong> Podemos subir el aviso oficial y explicar la diferencia.</p>
        <p><strong>MATEO:</strong> Nadie leerá una explicación larga. La otra publicación tiene letras rojas y una alarma.</p>
        <p><strong>SEÑORA ROJAS:</strong> Entonces hagamos una explicación breve, pero completa. Qué ocurrió, qué se comprobó y dónde consultar.</p>
        <p class="stage">VALENTINA escribe en una pizarra: «Baja presión / agua apta / fuente: informe técnico 11 de agosto». MATEO observa el vaso.</p>
        <p><strong>MATEO:</strong> Igual deberíamos suspender las clases por precaución.</p>
        <p><strong>DON HÉCTOR:</strong> ¿Precaución frente a qué evidencia?</p>
        <p><strong>MATEO:</strong> Frente a la posibilidad de que el informe también esté equivocado.</p>
        <p><strong>VALENTINA:</strong> Toda información puede revisarse, pero no todas las dudas tienen el mismo peso. Este informe dice quién midió, cuándo y cómo. La publicación no.</p>
        <p><strong>SEÑORA ROJAS:</strong> Además, mañana se repetirá la medición. Eso también debemos decirlo.</p>
        <p class="stage">El goteo se detiene. Durante un momento, nadie habla.</p>
        <p><strong>MATEO:</strong> De acuerdo. Pero pongamos primero la conclusión. Después, la explicación y el enlace.</p>
        <p><strong>VALENTINA:</strong> Y una frase al final: «Si recibiste la imagen anterior, comparte también la actualización».</p>
        <p><strong>DON HÉCTOR:</strong> Eso no borra el rumor, pero permite que quien lo recibió compare.</p>
        <p class="stage">MATEO toma una botella vacía y la llena. Lee nuevamente la publicación antes de guardar el teléfono.</p>
        <p><strong>MATEO:</strong> Qué extraño: hace diez minutos la foto me parecía una prueba. Ahora solo me parece una foto.</p>`
    },
    {
      id: 't4',
      label: 'Texto 4 · Reportaje y gráfico',
      title: 'La biblioteca que abrió hasta tarde',
      source: 'Reportaje y datos ficticios elaborados con fines pedagógicos.',
      body: `
        <p>Durante años, la Biblioteca Municipal de Puerto Claro cerró a las seis de la tarde. Ese horario coincidía con la salida de muchos trabajadores y dejaba a estudiantes sin un espacio público para leer o conectarse a internet después de clases. En marzo, el municipio inició un plan piloto: de lunes a jueves, el edificio permanecería abierto hasta las diez de la noche.</p>
        <p>La medida no consistió solo en mantener las puertas abiertas. Se contrató a dos asistentes por turnos, se habilitó una sala silenciosa y se reservaron veinte computadores entre las seis y las nueve. La dirección también coordinó rondas de seguridad en el entorno. El piloto duraría cuatro meses y luego sería evaluado.</p>
        <p>Los registros muestran que las visitas mensuales aumentaron entre marzo y mayo y descendieron levemente en junio. La franja nocturna representó una proporción creciente de los ingresos, aunque no concentró a la mayoría de los usuarios. La directora, Alicia Soto, considera que el cambio respondió a una necesidad real: «Antes veíamos estudiantes esperando afuera al día siguiente para terminar una tarea. Ahora algunos vienen después de ayudar en negocios familiares o de cuidar a sus hermanos».</p>
        <p>Sin embargo, ampliar el horario no resolvió todos los problemas. En mayo, la sala silenciosa alcanzó su capacidad máxima durante nueve jornadas. Además, seis de los veinte computadores quedaron fuera de servicio por fallas técnicas. La biblioteca comenzó a prestar enchufes múltiples y a organizar turnos de cuarenta minutos en los equipos disponibles.</p>
        <p>Tomás Leiva, estudiante de segundo medio, asiste dos veces por semana. Dice que en su casa puede estudiar, pero comparte una pieza y la conexión a internet es inestable. «Aquí avanzo más porque sé que tengo un horario y porque puedo preguntar si no encuentro un libro. No vengo todos los días, pero cuando tengo una prueba importante me sirve», explica.</p>
        <p>Para la investigadora en políticas culturales Elisa Montero, las cifras son alentadoras, aunque deben interpretarse con cautela. Durante el mismo período comenzaron talleres gratuitos de alfabetización digital y dos colegios cercanos iniciaron proyectos que exigían consultar fuentes impresas. «El aumento de visitas coincide con el nuevo horario, pero la coincidencia no basta para atribuirle todo el cambio. Hay varias medidas ocurriendo al mismo tiempo», señala.</p>
        <p>Una encuesta voluntaria respondida por 184 usuarios indicó que el 61% valoraba principalmente la extensión horaria, el 24% la disponibilidad de computadores y el 15% los talleres. La consulta permite conocer las preferencias de quienes decidieron responder, pero no representa necesariamente a todas las personas del sector, incluidas aquellas que aún no usan la biblioteca.</p>
        <p>El municipio anunció que mantendrá el horario hasta septiembre y que reparará los computadores antes de decidir si el programa se vuelve permanente. También estudiará habilitar una sala en otra zona de la comuna. «El dato importante no es solo cuántas personas entran», afirma Soto. «Debemos saber para qué vienen, qué barreras encuentran y si el servicio llega a quienes más lo necesitan».</p>
        <div class="data-card" role="group" aria-label="Visitas registradas en la biblioteca de marzo a junio">
          <h4>Visitas registradas durante el plan piloto</h4>
          <p class="chart-subtitle">Total mensual y proporción realizada después de las 18:00</p>
          <div class="bar-grid">
            <div class="bar-label"><strong>Marzo</strong><span>420 visitas · 18% nocturnas</span></div><div class="bar-track"><span style="width:65%"></span></div>
            <div class="bar-label"><strong>Abril</strong><span>510 visitas · 25% nocturnas</span></div><div class="bar-track"><span style="width:78%"></span></div>
            <div class="bar-label"><strong>Mayo</strong><span>650 visitas · 34% nocturnas</span></div><div class="bar-track"><span style="width:100%"></span></div>
            <div class="bar-label"><strong>Junio</strong><span>610 visitas · 31% nocturnas</span></div><div class="bar-track"><span style="width:94%"></span></div>
          </div>
          <div class="chart-legend"><span class="legend-swatch"></span> Largo de barra: total de visitas del mes</div>
          <p class="chart-note">Fuente: registro de ingreso de la Biblioteca Municipal de Puerto Claro. Los porcentajes nocturnos están redondeados.</p>
        </div>`
    },
    {
      id: 't5',
      label: 'Texto 5 · Texto discontinuo',
      title: 'Antes de compartir, busca el origen',
      source: 'Campaña escolar ficticia elaborada con fines pedagógicos.',
      body: `
        <div class="campaign">
          <header>
            <span>CONVIVENCIA Y CIUDADANÍA DIGITAL</span>
            <h4>ANTES DE COMPARTIR, BUSCA EL ORIGEN</h4>
            <p>Una captura puede ser real y, aun así, presentar información incompleta o fuera de contexto.</p>
          </header>
          <ol>
            <li><strong>1. Identifica.</strong> Busca autor, institución, fecha y enlace original.</li>
            <li><strong>2. Abre.</strong> No te quedes con la captura: revisa el contenido completo.</li>
            <li><strong>3. Contrasta.</strong> Compara la afirmación con dos fuentes confiables e independientes.</li>
            <li><strong>4. Distingue.</strong> Separa datos verificables, opiniones e interpretaciones.</li>
            <li><strong>5. Decide.</strong> Comparte solo si puedes explicar qué se sabe y qué sigue en duda.</li>
          </ol>
          <aside>
            <h5>Prueba piloto con 240 estudiantes</h5>
            <table>
              <thead><tr><th>Acción ante una publicación dudosa</th><th>Antes</th><th>Después del taller</th></tr></thead>
              <tbody>
                <tr><td>Buscó el enlace original</td><td>38%</td><td>64%</td></tr>
                <tr><td>Comparó otra fuente</td><td>31%</td><td>57%</td></tr>
                <tr><td>Compartió sin verificar</td><td>44%</td><td>23%</td></tr>
              </tbody>
            </table>
            <p>Los porcentajes describen a quienes participaron en el piloto. No demuestran por sí solos que el taller haya causado todos los cambios observados.</p>
          </aside>
          <footer>Material de orientación · Equipo de Convivencia Escolar · Agosto de 2026</footer>
        </div>`
    }
  ];

  const questions = [
    {id:'q1',num:1,unit:'t1',skill:'LOCALIZAR',prompt:'¿Por qué Elías llevó tres casetes a la radio?',key:'C',options:{A:'Porque debía entregar un archivo histórico solicitado por la municipalidad.',B:'Porque quería seleccionar música para acompañar los avisos de evacuación.',C:'Porque buscaba copiar una grabación de su padre antes de que se dañara.',D:'Porque necesitaba comprobar el funcionamiento del reproductor de la cabina.'},evidence:'El cuarto párrafo indica que la entrevista nunca había sido digitalizada y podía perderse.',distractors:{A:'dato inventado',B:'cambio de foco',D:'inferencia no respaldada'}},
    {id:'q2',num:2,unit:'t1',skill:'LOCALIZAR',prompt:'¿Qué información debía transmitir la radio según la solicitud del consultorio?',key:'A',options:{A:'Las calles que debían evacuar y un número para situaciones de emergencia.',B:'Los horarios en que regresaría la electricidad al conjunto de viviendas.',C:'Los lugares donde se repararían aparatos dañados por la entrada de agua.',D:'Las medidas adoptadas para proteger las grabaciones históricas de la radio.'},evidence:'Mara deja junto al micrófono una lista con calles, horarios y un número de emergencia.',distractors:{B:'dato inventado',C:'dato inventado',D:'cambio de foco'}},
    {id:'q3',num:3,unit:'t1',skill:'INTERPRETAR',prompt:'¿Qué función cumple el reloj detenido a lo largo del relato?',key:'D',options:{A:'Permite calcular con exactitud el tiempo que duró la transmisión comunitaria de emergencia.',B:'Demuestra que la inundación destruyó todos los instrumentos de la cabina.',C:'Anuncia que Elías perderá definitivamente la grabación guardada por su padre.',D:'Representa una cabina anclada en el pasado que luego recupera una hora presente.'},evidence:'El reloj inmóvil parece pertenecer a la noche anterior y Mara lo ajusta al final.',distractors:{A:'lectura literal parcial',B:'generalización excesiva',C:'anticipación inventada'}},
    {id:'q4',num:4,unit:'t1',skill:'INTERPRETAR',prompt:'¿Qué cambio experimenta Elías durante la mañana?',key:'B',options:{A:'Deja de valorar por completo las grabaciones que conservan la historia del barrio.',B:'Comprende que preservar una voz también implica usarla cuando la comunidad la necesita.',C:'Decide abandonar la radio porque la tecnología disponible ya no resulta confiable.',D:'Concluye que solo las autoridades pueden coordinar una respuesta ante una emergencia local.'},evidence:'Detiene la copia, transmite información útil y afirma comprender la frase de su padre.',distractors:{A:'oposición extrema',C:'dato inventado',D:'cambio de foco'}},
    {id:'q5',num:5,unit:'t1',skill:'INTERPRETAR',prompt:'¿Qué sentido adquiere la frase «una voz no sirve de mucho si llega cuando ya nadie puede responder»?',key:'C',options:{A:'Las grabaciones antiguas pierden valor cuando presentan fallas producidas por humedad.',B:'Los mensajes deben ser pronunciados por una autoridad para ser aceptados sin explicaciones adicionales.',C:'La comunicación adquiere sentido cuando llega a tiempo y permite actuar a quienes escuchan.',D:'La radio comunitaria solo cumple su función cuando transmite durante una emergencia.'},evidence:'La frase antecede la decisión de privilegiar la información urgente y la acción vecinal.',distractors:{A:'lectura literal parcial',B:'dato inventado',D:'restricción excesiva'}},
    {id:'q6',num:6,unit:'t1',skill:'REFLEXIONAR',prompt:'¿Qué efecto produce que el narrador revele los pensamientos de Elías, pero no los de Mara?',key:'A',options:{A:'Orienta la comprensión del conflicto hacia la decisión íntima que enfrenta Elías.',B:'Impide conocer las acciones realizadas por el resto de los personajes del relato.',C:'Convierte a Mara en responsable de que la grabación no pudiera ser digitalizada.',D:'Demuestra que el relato fue escrito por Elías muchos años después de la inundación.'},evidence:'La narración expone recuerdos, temores y comprensión final de Elías; de Mara muestra acciones.',distractors:{B:'generalización falsa',C:'atribución causal inventada',D:'narrador confundido con personaje'}},
    {id:'q7',num:7,unit:'t1',skill:'INTERPRETAR',prompt:'¿Cuál hipótesis sobre el sentido global del relato está mejor fundamentada?',key:'D',options:{A:'La tecnología impide que las comunidades reaccionen por sí mismas ante una catástrofe en el barrio.',B:'Los recuerdos familiares deben conservarse aunque eso retrase cualquier tarea colectiva.',C:'La memoria pierde importancia cuando una comunidad enfrenta necesidades materiales urgentes.',D:'El legado de una persona permanece también en las decisiones que otros toman en el presente.'},evidence:'Elías posterga la copia, actúa según la enseñanza de su padre y conserva igualmente el casete.',distractors:{A:'oposición al texto',B:'prioridad invertida',C:'falsa exclusión'}},

    {id:'q8',num:8,unit:'t2',skill:'LOCALIZAR',prompt:'¿Qué acción realiza el hablante del segundo poema?',key:'B',options:{A:'Ordena cuidadosamente los objetos que quedaron dentro de una casa vacía.',B:'Arroja una palabra al río y escucha que regresa transformada en eco.',C:'Limpia el polvo de un armario para encontrar un camino de regreso.',D:'Recoge las hojas que el río depositó sobre una orilla desconocida.'},evidence:'El segundo poema declara: “Yo arrojo una palabra al agua / y vuelve convertida en eco”.',distractors:{A:'acción del primer poema',C:'distorsión del primer poema',D:'acción inventada'}},
    {id:'q9',num:9,unit:'t2',skill:'INTERPRETAR',prompt:'¿Qué relación con la memoria comparten ambos poemas?',key:'D',options:{A:'Los dos sostienen que recordar exige recuperar intacto aquello que ya desapareció.',B:'Los dos rechazan los objetos y la naturaleza como medios para representar una ausencia.',C:'Ambos presentan el olvido como una decisión voluntaria que elimina todo vínculo anterior.',D:'Ambos muestran que una ausencia continúa actuando mediante huellas que permanecen.'},evidence:'En el primero quedan rastros en objetos; en el segundo la palabra vuelve transformada.',distractors:{A:'absolutización',B:'oposición al texto',C:'idea inventada'}},
    {id:'q11',num:11,unit:'t2',skill:'INTERPRETAR',prompt:'¿En qué se diferencia principalmente el temple de ánimo de los hablantes?',key:'A',options:{A:'El primero teme alterar las huellas; el segundo acepta que el recuerdo se transforme.',B:'El primero celebra una llegada; el segundo lamenta la pérdida definitiva de todo vínculo.',C:'El primero expresa indiferencia; el segundo manifiesta enojo contra el paso del tiempo.',D:'El primero desea olvidar; el segundo intenta conservar cada elemento sin modificarlo.'},evidence:'El primero no toca por temor a borrar; el segundo define recordar como aprender el cauce.',distractors:{B:'tonos invertidos',C:'emociones inventadas',D:'posturas invertidas'}},
    {id:'q12',num:12,unit:'t2',skill:'INTERPRETAR',prompt:'¿Qué función cumplen la taza, la silla y las camisas en el primer poema?',key:'C',options:{A:'Describir el valor económico de los bienes que quedaron abandonados en la vivienda.',B:'Explicar las causas concretas por las cuales una persona se ausentó de la casa.',C:'Materializar la ausencia a través de objetos cotidianos que conservan sus huellas.',D:'Demostrar que el hablante desconoce a quien utilizó anteriormente esos objetos.'},evidence:'Cada objeto conserva una marca corporal o pronuncia un nombre asociado a quien no vuelve.',distractors:{A:'cambio de foco',B:'causa inventada',D:'oposición al texto'}},
    {id:'q13',num:13,unit:'t2',skill:'REFLEXIONAR',prompt:'¿Qué aporte realiza el título «Inventario de la casa» a la lectura del primer poema?',key:'B',options:{A:'Anticipa una descripción objetiva en la que los objetos carecen de significado emocional.',B:'Convierte la enumeración de objetos en un registro afectivo de quien está ausente.',C:'Presenta la vivienda como un lugar que será vendido después de clasificar sus pertenencias.',D:'Indica que el poema enseñará un procedimiento para ordenar los objetos domésticos.'},evidence:'El inventario no valora bienes: cada objeto activa una huella de la ausencia.',distractors:{A:'lectura superficial',C:'situación inventada',D:'género mal identificado'}},
    {id:'q14',num:14,unit:'t2',skill:'INTERPRETAR',prompt:'¿Qué sugiere la imagen «recordar no es cerrar la mano»?',key:'D',options:{A:'Que la memoria depende exclusivamente de conservar objetos dentro de espacios cerrados de la casa.',B:'Que olvidar constituye la única manera de continuar después de una pérdida importante.',C:'Que los recuerdos deben mantenerse idénticos para seguir acompañando a una persona.',D:'Que recordar no consiste en retener inmóvil el pasado, sino en aceptar su transformación.'},evidence:'La oposición continúa con “aprender el cauce / por donde cambia” lo que acompaña.',distractors:{A:'literalización',B:'falsa exclusión',C:'oposición a la metáfora'}},

    {id:'q15',num:15,unit:'t3',skill:'LOCALIZAR',prompt:'¿Cuál fue la causa del corte de agua según Don Héctor?',key:'C',options:{A:'La presencia de residuos detectados durante la última revisión del estanque.',B:'La decisión preventiva de suspender el servicio mientras circulaba el rumor.',C:'Una baja de presión en la red que no estaba relacionada con contaminación.',D:'Una falla en las llaves de la escuela producida durante la limpieza de marzo.'},evidence:'Don Héctor afirma directamente que el corte fue por baja presión, no por contaminación.',distractors:{A:'dato inventado',B:'causa inventada',D:'detalle desplazado'}},
    {id:'q16',num:16,unit:'t3',skill:'INTERPRETAR',prompt:'¿Qué muestra la acotación en que Valentina amplía la imagen y guarda silencio?',key:'A',options:{A:'Un momento de examen que interrumpe la reacción inmediata frente a la publicación.',B:'La decisión de ocultar información para evitar preocupación entre los estudiantes del curso.',C:'El rechazo de Valentina a escuchar las dudas planteadas por sus compañeros.',D:'La imposibilidad de utilizar el teléfono debido a una interrupción del servicio.'},evidence:'Después de observar, Valentina identifica que faltan fecha y autor.',distractors:{B:'intención inventada',C:'oposición a la escena',D:'problema técnico inventado'}},
    {id:'q17',num:17,unit:'t3',skill:'INTERPRETAR',prompt:'¿Qué cambio se observa en la postura de Mateo?',key:'B',options:{A:'Pasa de desconfiar de la imagen a defenderla como única prueba disponible.',B:'Pasa de compartir la alarma sin verificar a reconocer que una imagen real puede engañar.',C:'Pasa de exigir información técnica a rechazar cualquier forma de comunicación breve.',D:'Pasa de apoyar la suspensión de clases a negar que hubiera existido una preocupación válida.'},evidence:'Al final admite que la foto ya no le parece prueba; acepta publicar conclusión, explicación y enlace.',distractors:{A:'cambio invertido',C:'postura inventada',D:'conclusión excesiva'}},
    {id:'q18',num:18,unit:'t3',skill:'REFLEXIONAR',prompt:'¿Por qué el informe técnico constituye una evidencia más sólida que la publicación?',key:'D',options:{A:'Porque utiliza un lenguaje extenso que resulta difícil de cuestionar para el público escolar.',B:'Porque proviene de una autoridad y, por ello, no necesita ser revisado nuevamente.',C:'Porque coincide con lo que la comunidad esperaba escuchar sobre el corte de agua.',D:'Porque identifica responsables, fecha y procedimiento, y permite verificar sus datos.'},evidence:'Valentina contrasta la trazabilidad del informe con la falta de autor, fecha y método del post.',distractors:{A:'apariencia confundida con validez',B:'apelación absoluta a autoridad',C:'sesgo de confirmación'}},
    {id:'q19',num:19,unit:'t3',skill:'INTERPRETAR',prompt:'¿Cuál es el conflicto central de la escena?',key:'C',options:{A:'La competencia entre dos instituciones por controlar el suministro de agua de la escuela.',B:'La dificultad de reparar el estanque antes de que se reanuden las actividades.',C:'La tensión entre actuar con rapidez y verificar suficientemente una advertencia urgente.',D:'El desacuerdo sobre quién debe ocupar la presidencia del centro de estudiantes.'},evidence:'Mateo enfatiza urgencia; otros exigen verificar y diseñan una respuesta breve pero completa.',distractors:{A:'conflicto inventado',B:'problema secundario inventado',D:'cambio de foco'}},
    {id:'q20',num:20,unit:'t3',skill:'REFLEXIONAR',prompt:'¿Qué efecto produce la última intervención de Mateo?',key:'A',options:{A:'Sintetiza su aprendizaje al distinguir entre la existencia de una imagen y su valor probatorio.',B:'Confirma que la fotografía fue fabricada completamente por quien difundió el rumor.',C:'Demuestra que Mateo continúa creyendo que el agua representa un peligro comprobado.',D:'Introduce un nuevo conflicto sobre el uso actual de teléfonos dentro de la sala de reuniones escolar.'},evidence:'“Hace diez minutos la foto me parecía una prueba. Ahora solo me parece una foto”.',distractors:{B:'contradice explicación',C:'cambio no reconocido',D:'conflicto inventado'}},

    {id:'q21',num:21,unit:'t4',skill:'LOCALIZAR',prompt:'¿En qué mes se registró la mayor cantidad de visitas a la biblioteca?',key:'B',options:{A:'En abril, cuando se registraron quinientas diez visitas durante el mes del plan piloto.',B:'En mayo, cuando se registraron seiscientas cincuenta visitas durante el mes.',C:'En junio, cuando se registraron seiscientas diez visitas durante el mes.',D:'En marzo, cuando se registraron cuatrocientas veinte visitas durante el mes.'},evidence:'El gráfico registra 650 visitas en mayo, el mayor valor de los cuatro meses.',distractors:{A:'dato cercano',C:'dato cercano',D:'dato menor'}},
    {id:'q22',num:22,unit:'t4',skill:'LOCALIZAR',prompt:'¿Qué dificultad se produjo durante mayo?',key:'D',options:{A:'La biblioteca debió cerrar nuevamente a las seis por falta de personal disponible.',B:'La encuesta fue suspendida porque muy pocas personas aceptaron responderla.',C:'Los colegios cercanos cancelaron los proyectos que requerían fuentes impresas.',D:'La sala silenciosa alcanzó su capacidad máxima durante nueve jornadas.'},evidence:'El cuarto párrafo lo informa expresamente.',distractors:{A:'dato inventado',B:'dato inventado',C:'oposición al texto'}},
    {id:'q23',num:23,unit:'t4',skill:'INTERPRETAR',prompt:'¿Qué relación existe entre el reportaje y el gráfico?',key:'A',options:{A:'El gráfico cuantifica una tendencia que el reportaje explica y limita con otros antecedentes.',B:'El gráfico reemplaza las voces del reportaje porque demuestra la causa del aumento observado.',C:'El reportaje contradice las cifras al afirmar que la biblioteca recibió menos usuarios cada mes.',D:'El reportaje utiliza el gráfico para probar que todas las visitas ocurrieron durante la noche.'},evidence:'El reportaje comenta aumento, descenso y proporción nocturna, pero incorpora causas y límites.',distractors:{B:'causalidad excesiva',C:'contradicción inventada',D:'generalización falsa'}},
    {id:'q25',num:25,unit:'t4',skill:'INTERPRETAR',prompt:'¿Qué función cumple el testimonio de Tomás Leiva?',key:'C',options:{A:'Representar estadísticamente a todas las personas que viven alrededor de la biblioteca durante el piloto.',B:'Demostrar que la conexión a internet es el único motivo para extender los horarios.',C:'Ilustrar mediante una experiencia concreta cómo el nuevo horario puede apoyar el estudio.',D:'Cuestionar que la biblioteca reserve computadores durante las horas de mayor demanda.'},evidence:'Tomás explica cuándo y por qué el espacio le sirve, sin representar a todos.',distractors:{A:'generalización de testimonio',B:'causa única',D:'postura inventada'}},
    {id:'q26',num:26,unit:'t4',skill:'REFLEXIONAR',prompt:'¿Cuál es la principal limitación de la encuesta mencionada?',key:'B',options:{A:'Sus porcentajes no suman cien debido a un error en la organización de las respuestas del sector.',B:'Incluye solo a usuarios voluntarios y puede dejar fuera a quienes no usan la biblioteca.',C:'Registra únicamente opiniones de funcionarios responsables de ejecutar el plan piloto.',D:'Se aplicó antes de ampliar el horario y no permite conocer valoraciones posteriores.'},evidence:'El texto señala que no representa necesariamente a todo el sector ni a no usuarios.',distractors:{A:'dato falso',C:'población inventada',D:'momento invertido'}},
    {id:'q27',num:27,unit:'t4',skill:'INTERPRETAR',prompt:'¿Qué idea enfatiza el título «La biblioteca que abrió hasta tarde»?',key:'D',options:{A:'La modificación arquitectónica que permitió construir una segunda sala de lectura.',B:'La decisión definitiva de mantener abierto el edificio durante todos los fines de semana.',C:'El reemplazo de los servicios tradicionales por actividades realizadas en horario nocturno.',D:'El cambio de horario que organiza el reportaje y permite examinar sus efectos y límites.'},evidence:'Todo el reportaje se articula en torno al piloto de extensión horaria.',distractors:{A:'dato inventado',B:'alcance inventado',C:'falsa sustitución'}},
    {id:'q28',num:28,unit:'t4',skill:'REFLEXIONAR',prompt:'¿Cuál conclusión respeta mejor la consistencia de la información presentada?',key:'A',options:{A:'El piloto amplió oportunidades de uso, pero requiere más datos y mejoras antes de evaluarse definitivamente.',B:'El aumento de visitas demuestra que extender el horario resolvió todas las barreras de acceso cultural del sector.',C:'La baja de junio prueba que la comunidad dejó de valorar los servicios ofrecidos por la biblioteca.',D:'La encuesta permite afirmar que el sesenta y uno por ciento de toda la comuna exige horario nocturno.'},evidence:'Hay uso y valoración, pero también capacidad, equipos, factores simultáneos y muestra limitada.',distractors:{B:'generalización causal',C:'interpretación única',D:'extrapolación de muestra'}},

    {id:'q29',num:29,unit:'t5',skill:'LOCALIZAR',prompt:'Según la campaña, ¿qué se debe hacer inmediatamente después de identificar autor, fecha y enlace?',key:'C',options:{A:'Compartir la publicación con una advertencia para que otras personas la investiguen.',B:'Clasificar el mensaje como verdadero cuando proviene de una institución conocida.',C:'Abrir el contenido original y revisarlo sin depender solamente de la captura.',D:'Comparar los porcentajes del mensaje antes de conocer el documento del que proceden.'},evidence:'La secuencia indica: 1 Identifica; 2 Abre el contenido completo.',distractors:{A:'acción riesgosa inventada',B:'validación insuficiente',D:'orden alterado'}},
    {id:'q30',num:30,unit:'t5',skill:'INTERPRETAR',prompt:'¿Qué cambio muestran conjuntamente los tres indicadores del piloto?',key:'B',options:{A:'Todas las personas dejaron de compartir publicaciones después de participar en el taller.',B:'Aumentaron las acciones de verificación y disminuyó la declaración de compartir sin revisar.',C:'Buscar el enlace original se volvió menos frecuente que comparar una segunda fuente.',D:'El taller eliminó las diferencias entre las tres acciones medidas en el grupo participante del taller.'},evidence:'Buscar origen y comparar aumentan; compartir sin verificar baja de 44% a 23%.',distractors:{A:'generalización absoluta',C:'comparación invertida',D:'dato falso'}},
    {id:'q31',num:31,unit:'t5',skill:'INTERPRETAR',prompt:'¿Cómo se relaciona el título con los cinco pasos propuestos?',key:'D',options:{A:'El título prohíbe compartir información, mientras los pasos enseñan a producir publicaciones en las redes.',B:'El título presenta un resultado estadístico y los pasos explican cómo fue calculado.',C:'El título se dirige solo a especialistas y los pasos simplifican su trabajo técnico.',D:'El título formula una orientación general y los pasos la convierten en acciones verificables.'},evidence:'“Busca el origen” se descompone en identificar, abrir, contrastar, distinguir y decidir.',distractors:{A:'propósito alterado',B:'función confundida',C:'destinatario inventado'}},
    {id:'q32',num:32,unit:'t5',skill:'REFLEXIONAR',prompt:'¿Cuál afirmación excede los datos de la prueba piloto?',key:'A',options:{A:'El taller causó por sí solo todos los cambios registrados en los 240 estudiantes.',B:'La proporción que comparó otra fuente aumentó veintiséis puntos porcentuales.',C:'La declaración de compartir sin verificar bajó veintiún puntos porcentuales.',D:'Los resultados describen al grupo participante antes y después de una actividad escolar.'},evidence:'La nota advierte expresamente que los datos no demuestran causalidad exclusiva.',distractors:{B:'cálculo respaldado',C:'cálculo respaldado',D:'alcance respaldado'}},
    {id:'q33',num:33,unit:'t5',skill:'INTERPRETAR',prompt:'¿A qué destinatario se orienta principalmente la campaña?',key:'C',options:{A:'A investigadores que estudian mensajes digitales actuales dentro de comunidades escolares.',B:'A autoridades encargadas de sancionar legalmente cada publicación engañosa.',C:'A integrantes de una comunidad escolar que reciben y comparten información digital.',D:'A empresas que administran las plataformas donde circulan capturas de pantalla.'},evidence:'La fuente es convivencia escolar, el lenguaje es instructivo y el piloto incluye estudiantes.',distractors:{A:'destinatario especializado',B:'propósito sancionador inventado',D:'destinatario desplazado'}},
    {id:'q34',num:34,unit:'t5',skill:'REFLEXIONAR',prompt:'¿Qué antecedente adicional permitiría evaluar mejor la calidad de la prueba piloto?',key:'B',options:{A:'El tipo de letra utilizado para diferenciar los porcentajes de cada columna en pantalla.',B:'El modo de seleccionar participantes y de medir sus acciones antes y después.',C:'La cantidad de colores considerados al diseñar la campaña de orientación.',D:'El número de veces que el título fue repetido durante la actividad escolar.'},evidence:'Selección y medición permiten juzgar representatividad y confiabilidad de los cambios.',distractors:{A:'aspecto gráfico irrelevante',C:'aspecto gráfico irrelevante',D:'dato insuficiente'}},
  ];

  const openQuestions = [
    {
      id:'q10', num:10, unit:'t2', skill:'REFLEXIONAR', max:3,
      prompt:'Compara cómo los dos poemas representan la memoria. Formula una afirmación, incorpora una evidencia precisa de cada poema y explica qué diferencia revela esa comparación.',
      rubric:[
        '1 punto: formula una comparación clara y pertinente.',
        '1 punto: incorpora evidencia precisa de ambos poemas.',
        '1 punto: explica cómo la evidencia sostiene la comparación.'
      ]
    },
    {
      id:'q24', num:24, unit:'t4', skill:'REFLEXIONAR', max:4,
      prompt:'Evalúa esta afirmación: «Extender el horario resolvió por sí solo la falta de espacios de estudio en Puerto Claro». Responde usando un dato del gráfico y una evidencia del reportaje.',
      rubric:[
        '1 punto: emite un juicio claro sobre la afirmación.',
        '1 punto: utiliza correctamente un dato del gráfico.',
        '1 punto: incorpora una evidencia pertinente del reportaje.',
        '1 punto: explica la relación entre el juicio y las evidencias.'
      ]
    }
  ];

  window.SIMCE_U3S5_DATA = { units, questions, openQuestions };
})();
