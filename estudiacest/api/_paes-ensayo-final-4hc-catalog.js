'use strict';
// Ensayo final de Competencia Lectora 4.º A y B HC (5-nov-2026). Textos y pauta permanecen en servidor.
// 42 preguntas: lecturas originales 1, 3, 5, 6 y 7 del cuadernillo; sin controles internos.
const SESSION='paes-ensayo-final-4hc-20261105',VERSION='2026-11-05-v1',TITLE='Ensayo final · Competencia Lectora';
const texts=[
 {
  "id": 1,
  "title": "Lo que mide una sombra",
  "blocks": [
   {
    "p": "El municipio de Puerto Claro quería decidir dónde instalar refugios para quienes esperaban locomoción. Un mapa de temperatura mostraba que dos paraderos del mismo recorrido recibían sol durante gran parte de la tarde. La primera propuesta consistió en construir techo en ambos. Sin embargo, la encargada de obras pidió observar antes cómo se usaban esos lugares. La palabra “sombra”, escribió en su cuaderno, podía nombrar la proyección de un árbol, la protección de un techo o simplemente una zona que parecía oscura en una fotografía. Para decidir una obra, esa diferencia importaba. Un árbol que cubría la vereda a las cuatro podía dejar descubierto el banco a las seis."
   },
   {
    "p": "Durante seis días, dos observadores visitaron los paraderos Norte y Mercado. Cada hora anotaron cuántas personas aguardaban, dónde se ubicaban y si la sombra cubría el espacio de espera. Se contaron personas presentes en cada visita, no pasajeros distintos: alguien que esperó entre las cinco y las seis pudo aparecer dos veces. No preguntaron edad, destino ni razones para elegir cada lugar. Tampoco registraron los minutos que una persona permanecía a la intemperie. El procedimiento permitía describir ocupación y cobertura en momentos definidos; no permitía calcular el riesgo individual de exposición. Esa limitación quedó escrita antes de elaborar las conclusiones, porque una planilla de números podía sugerir una precisión que la observación no tenía."
   },
   {
    "p": "El paradero Norte era más concurrido. Allí, la sombra de un edificio llegaba a la vereda a las cinco de la tarde, pero solo cubría el extremo opuesto al banco. En Mercado se reunía menos gente; un árbol antiguo daba sombra sobre el asiento hasta las cuatro y media, y luego la protección se desplazaba hacia la calzada. Los observadores vieron a varias personas cambiarse de lugar siguiendo la sombra. Una vecina dijo que prefería estar de pie junto al muro, aunque desde allí no veía venir el bus. Otra se sentó en el banco de Mercado porque necesitaba descansar, aun cuando ya estaba bajo el sol. Esos testimonios no se usaron para calcular porcentajes: sirvieron para advertir que cobertura y posibilidad de usarla no eran equivalentes."
   },
   {
    "table": {
     "headers": [
      "Indicador observado",
      "Norte",
      "Mercado"
     ],
     "rows": [
      [
       "Presencias registradas entre 15:00 y 18:00, seis días",
       "168",
       "96"
      ],
      [
       "Observaciones con sombra sobre el banco",
       "2 de 24",
       "11 de 24"
      ],
      [
       "Observaciones con al menos una persona esperando fuera de la sombra disponible",
       "17 de 24",
       "9 de 24"
      ]
     ]
    }
   },
   {
    "p": "El primer informe llamó a Norte “el paradero de mayor exposición”. La expresión fue objetada: 168 presencias no representaban 168 personas diferentes y nadie sabía cuánto tiempo había esperado cada una. Los datos sí mostraban que, en las visitas realizadas, el banco de Norte casi nunca estuvo a la sombra. También mostraban que la existencia de una sombra cercana no resolvía por sí sola el problema de la espera. Para comprobar si el refugio debía situarse exactamente sobre el banco, el equipo dibujó el trayecto de la sombra a distintas horas. Ese dibujo modificó el proyecto: en Norte, el techo tendría que cubrir tanto el asiento como un área desde la cual pudiera verse la calle. En Mercado, podar ramas para despejar la señalética podía quitar parte de la sombra que hoy usaban los pasajeros."
   },
   {
    "p": "Algunos concejales pidieron una cifra única para ordenar las inversiones. La encargada de obras propuso usar tres criterios: número de presencias, cobertura efectiva del espacio de espera y dificultad de permanecer en la zona sombreada. Sugirió además visitar los paraderos en otra estación, pues las horas de luz y la trayectoria de las sombras cambiarían. Un concejal respondió que esperar nuevos datos equivalía a no hacer nada. Ella señaló que la visita adicional no impedía intervenir Norte, donde el banco había quedado descubierto en veintidós de las veinticuatro observaciones. En cambio, antes de modificar Mercado convenía probar con una señal más visible ubicada fuera de la sombra. Así separó una decisión sustentada por el registro actual de otra que requería observar las consecuencias de una intervención."
   },
   {
    "p": "La discusión sobre el banco de Norte llevó a revisar quién podía aprovechar realmente la sombra disponible. Un observador dibujó el muro, el asiento, la señal del recorrido y la zona que ocupaba una silla de ruedas cuando se detenía cerca. Descubrió que mover el banco unos metros hacia el muro no bastaba: desde ese punto el letrero ocultaba la llegada de los buses y la vereda se estrechaba. El plano de techo se corrigió con medidas tomadas en terreno. La encargada insistió en que una sombra proyectada sobre el papel no era todavía una espera posible. Para comprobarlo, habría que caminar el trayecto desde la esquina, situarse junto al asiento y mirar la calle a distintas horas. El objetivo no era encontrar una imagen atractiva para presentar en la reunión, sino asegurar que el refugio funcionara cuando una persona intentara usarlo."
   },
   {
    "p": "En Mercado, los datos provocaron otro desacuerdo. Un vecino decía que once observaciones con sombra sobre el banco probaban que no había problema. Una conductora del recorrido recordó que el paradero se llenaba al terminar un turno de trabajo que no coincidía siempre con las horas visitadas. El equipo no desestimó la tabla ni convirtió el testimonio en un nuevo promedio. Anotó que la muestra de horarios podía haber dejado fuera un momento importante y que debía observar la transición del turno antes de decidir. También se propuso registrar si alguien esperaba junto a la calzada porque el banco estaba ocupado, porque prefería ver el bus o porque buscaba sombra. Una misma posición visible podía responder a motivos diferentes; sin preguntar, atribuir uno solo sería una conjetura."
   },
   {
    "p": "Para la visita adicional se preparó una hoja distinta. Incluiría inicio y fin aproximados de cada espera observada, disponibilidad del banco y posición de la sombra, sin identificar a las personas. La encargada recordó que incluso ese cambio tendría límites: observar durante unos días no describiría todas las estaciones ni distinguiría por sí solo la comodidad del calor recibido. Sin embargo, permitiría comparar mejor las soluciones propuestas. El propósito de una nueva medición no era reemplazar todo el registro anterior, sino precisar la pregunta que había surgido al leerlo. Cuando una decisión exige algo que la tabla no contiene, reunir más cifras del mismo tipo puede aumentar la planilla sin mejorar la respuesta. Era preferible medir pocas variables pertinentes y explicar por qué se habían escogido."
   },
   {
    "p": "Antes de cerrar la reunión, el equipo comparó dos fotografías del mismo paradero tomadas con una hora de diferencia. En la primera, el banco parecía protegido por la sombra del edificio; en la segunda, estaba completamente iluminado. Las imágenes eran útiles para comunicar el movimiento de la sombra, pero no reemplazaban la tabla: habían sido escogidas entre muchas tomas y no indicaban cuántas veces se repitió cada situación. La encargada decidió mostrarlas con hora, fecha y posición de la cámara. Así podían leerse como ejemplos de un fenómeno observado, no como prueba suficiente de su frecuencia. También se dejó claro que una fotografía de una tarde despejada no anticipaba la experiencia de esperar bajo lluvia o viento."
   },
   {
    "p": "Un último comentario vino de quienes limpian los paraderos. Un techo extenso podía proteger mejor a los pasajeros, pero también concentrar agua en un borde y dificultar el paso si la bajada no se diseñaba bien. La propuesta incorporó esa observación sin convertirla en argumento para abandonar la obra. El equipo añadió una revisión de drenaje al plano y acordó evaluar el refugio después de instalarlo. La decisión no terminaba cuando se aprobaba el dibujo. Debía contrastarse con el uso real, con el mantenimiento y con las condiciones que el registro de seis días solo había comenzado a describir."
   },
   {
    "p": "En la reunión final nadie defendió que la tabla fuera inútil. El desacuerdo se concentró en la pregunta que podía responder. Si se buscaba saber dónde hubo más presencias durante seis tardes, la primera fila era suficiente. Si se quería decidir dónde podía esperar cómodamente una persona con dificultad para estar de pie, había que mirar también el banco y el acceso a la sombra. Y si la pregunta era cuánto calor recibió cada pasajero, faltaban datos. La encargada dejó una frase al pie del plano: “No confundamos la claridad de una cifra con la amplitud de lo que demuestra”. El proyecto se aprobó para Norte y quedó condicionado, en Mercado, a una prueba de señalética y una nueva observación."
   }
  ]
 },
 {
  "id": 2,
  "title": "La caja de las voces",
  "blocks": [
   {
    "p": "Cada miércoles, Darío llevaba una caja de cartón al taller de radio de la escuela. Dentro guardaba cintas, cables y una grabadora que aún funcionaba si se presionaba el botón de encendido con la uña. Decía que la caja contenía voces, aunque la mayoría de las etiquetas indicaba fechas de ferias y actos escolares. Su hermana Elena pensaba que esa frase era una manera de evitar ordenar. Cuando le pidieron preparar una muestra por el aniversario del barrio, propuso digitalizar las grabaciones y escoger las más claras. Darío aceptó ayudarla con la condición de que escucharan al menos una cinta completa antes de decidir qué podía descartarse."
   },
   {
    "p": "La primera cinta comenzaba con una entrevista a una panadera. A los siete minutos, la conversación se cortaba y aparecía una lluvia sostenida. Elena buscó el tramo siguiente; Darío le pidió esperar. Tras el ruido se oían pasos, una puerta y la voz del entrevistador diciendo que el agua había entrado por la ventana del estudio. Nada de eso aportaba datos sobre la panadería. Elena marcó el archivo como “interrumpido” y pasó a otra cinta. Darío no discutió la etiqueta, pero escribió en un papel aparte: “La entrevista no terminó cuando dejó de hablar la entrevistada”. Elena guardó el papel con gesto de paciencia, como se guarda una instrucción cuya utilidad todavía no se ve."
   },
   {
    "p": "La segunda grabación era casi perfecta. Una locutora leía una crónica de la plaza recién inaugurada, con música al inicio y al final. Elena la eligió de inmediato. Al escucharla, Darío señaló que en la crónica se nombraba una fuente de agua que ya no existía. Elena propuso acompañarla con una fotografía actual. El contraste le gustó: permitiría mostrar el paso del tiempo sin alterar la grabación. Para la tercera pieza, encontró una cinta sin etiqueta. Se escuchaban golpes regulares, voces lejanas y una niña que preguntaba si podía hablar. El adulto que sostenía el micrófono respondía: “Cuando termine”. La voz adulta reaparecía varias veces; la de la niña, nunca."
   },
   {
    "p": "Elena preguntó quién había grabado aquello. Darío reconoció el patio de la antigua sede vecinal por el sonido de una campana, pero no sabía el nombre de quienes hablaban. Su madre había participado en muchas grabaciones y guardado algunas cintas sin clasificarlas. Elena quiso incluir la escena como ejemplo de la vida del barrio. Darío le recordó que no sabían si la niña había querido ser grabada ni si podía reconocerse su voz. “Pero casi no habla”, dijo Elena. Él respondió que precisamente por eso la cinta decía más sobre quien decidía cuándo encender el micrófono que sobre la niña. Apagaron la grabadora sin acordar todavía qué harían con el archivo."
   },
   {
    "p": "Durante los días siguientes, Elena editó la entrevista a la panadera. Cortó los minutos de lluvia, pero al unir dos frases advirtió un salto: la entrevistada parecía afirmar que siempre había trabajado sola. En la cinta completa, esa frase respondía a una pregunta sobre la primera semana, antes de que se incorporara su socia. Elena restauró el contexto y dejó un fragmento de lluvia entre ambas partes. El sonido ya no era un obstáculo que había que eliminar por completo; marcaba una interrupción real y evitaba que la continuidad fabricada cambiara el sentido de las palabras. Darío escuchó la versión y, por primera vez desde que habían comenzado, no hizo ninguna sugerencia."
   },
   {
    "p": "En la inauguración, el público oyó la crónica de la plaza junto a dos fotografías tomadas con décadas de diferencia. Después escuchó la entrevista con la interrupción. Una vecina preguntó por qué habían dejado el ruido. Elena explicó la edición y su consecuencia. No mostró la cinta sin etiqueta. En su lugar, la exposición incluyó una ficha que decía: “Grabación pendiente de identificación y autorización de uso”. Alguien sostuvo que el museo del barrio estaba ocultando una parte de su historia. Elena admitió que conservar una pieza sin exhibirla era una decisión incómoda. También explicó que la falta de información sobre quienes aparecían en ella impedía tratarla como si fuera un documento sin personas."
   },
   {
    "p": "El trabajo de Elena no se redujo a elegir audios. Para cada cinta creó una ficha con la fecha conocida, el lugar probable y aquello que aún no podía confirmar. En la grabación de la plaza, la música de apertura permitía identificar una versión transmitida por radio; no probaba, por sí misma, que fuera la única versión de la crónica. En la entrevista a la panadera, una anotación al borde de la caja indicaba “segunda toma”, pero nadie sabía qué había ocurrido con la primera. Elena dejó esas diferencias a la vista del equipo. Había aprendido que el archivo no era una ventana que se abría sin mediación: alguien grabó, alguien guardó, alguien etiquetó y alguien decidiría ahora qué escucharían los visitantes."
   },
   {
    "p": "Darío propuso escribir a la panadera antes de publicar la muestra. Elena temió que no alcanzara el tiempo y preguntó si bastaba con usar un registro antiguo de una actividad pública. Él respondió que no sabía cuál había sido el acuerdo de esa entrevista. Buscaron el contacto, explicaron qué fragmento querían exhibir y enviaron una copia de la edición. La panadera señaló un apellido pronunciado incorrectamente por el entrevistador y pidió que no se corrigiera en el audio, pues hacerlo alteraría la grabación. Prefirió una nota junto a los audífonos. Elena comprendió que consultar no significaba entregar el archivo completo a la memoria de una sola persona, sino permitir que una voz registrada pudiera señalar problemas de contexto y uso."
   },
   {
    "p": "Con la cinta sin etiqueta no pudieron repetir el procedimiento. La campana daba una pista sobre el lugar, pero no identificaba a la niña ni a quien sostenía el micrófono. Elena escuchó una vez más el momento en que se le pedía esperar. La voz adulta no sonaba cruel; parecía concentrada en terminar una tarea. Eso volvía la escena más difícil de resumir en una frase ejemplar. No era necesario atribuir una intención hostil para reconocer que la niña no había tenido el mismo control de la grabación. Elena retiró la cinta del programa de apertura y guardó la ficha de búsqueda. La ausencia de exhibición no borraba el documento; dejaba pendiente una relación responsable con sus protagonistas."
   },
   {
    "p": "La noche anterior a la apertura, Elena escuchó la pieza completa con los ojos cerrados. La música de la plaza anunciaba celebración; la lluvia entre las frases de la panadera obligaba a aceptar un tiempo menos ordenado. Pensó que el público quizá preferiría un montaje más limpio. Luego recordó que la limpieza había llegado a fabricar una afirmación falsa sobre la socia. No concluyó que todo corte fuera ilegítimo. Había eliminado minutos de ruido que no alteraban el sentido y conservado uno que sí lo protegía. La diferencia no era técnica, sino editorial: cada corte debía poder justificarse por el efecto que tenía sobre la voz de alguien."
   },
   {
    "p": "Darío le ofreció guardar las cintas originales en otro lugar para que nadie confundiera la muestra con el archivo completo. Elena aceptó y preparó copias de escucha. El visitante podría oír una selección, pero la selección no borraría la posibilidad de volver al registro completo si surgía una duda legítima. Esa separación también protegía materiales frágiles. Cuando colocó las fichas junto a los audífonos, Elena evitó palabras como “definitivo” y “auténtico” para describir el montaje. Las cintas eran auténticas; su combinación, en cambio, era una propuesta de lectura cuya responsabilidad debía asumir ella."
   },
   {
    "p": "Al cerrar la muestra, Darío recogió los audífonos y vio a Elena guardar la ficha junto a las otras etiquetas. Le preguntó si ahora entendía por qué había llamado a la caja “caja de las voces”. Ella respondió que sí, pero añadió que una voz no era solo sonido. Recordó la niña que esperaba su turno, la socia borrada por un corte y la panadera que hablaba entre dos momentos de lluvia. No le pidió a Darío que sacara todas las cintas de nuevo. Anotó, en cambio, tres tareas para el mes siguiente: identificar, consultar y decidir qué forma de escucha permitiría contar la historia sin prestarle a nadie palabras que no había dicho."
   }
  ]
 },
 {
  "id": 3,
  "title": "El banco que nadie pidió",
  "blocks": [
   {
    "p": "La plaza de San Telmo fue remodelada con un criterio que parecía difícil de objetar: facilitar el movimiento. Se retiraron jardineras que estrechaban las rutas, se niveló el pavimento y se eliminaron tres bancos deteriorados. El informe de la obra registró un aumento del ancho libre de circulación. Lo que no registró fue cuántas personas necesitaban detenerse antes de cruzar la plaza. A los pocos días, una vecina comenzó a llevar una silla plegable. Se sentaba junto al sendero mientras esperaba a su nieto. Algunas personas celebraron su iniciativa; otras dijeron que obstaculizaba el paso. La silla se convirtió en una pequeña disputa sobre qué significa que un espacio sea accesible."
   },
   {
    "p": "Quienes defendían la remodelación mostraban planos. En ellos, los recorridos continuos eran más amplios y una persona en silla de ruedas podía atravesar la plaza sin rodear maceteros. El cambio era real y valioso. Pero el plano trataba el desplazamiento como una línea entre entradas y salidas. Para alguien que camina con dificultad, esa línea puede necesitar una pausa. Para quien espera a otra persona, permanecer también es usar la plaza. No propongo llenar de muebles un camino despejado. Propongo reconocer que un espacio público debe permitir tanto llegar como quedarse, y que mejorar una función puede debilitar otra si se mide el éxito con una sola vara."
   },
   {
    "p": "Se suele responder que los bancos atraen a personas que ocupan el lugar durante horas. La frase parece descriptiva, pero esconde una decisión sobre quién merece permanecer. Nadie cuestiona que un niño espere a quien lo recoge o que una persona mayor descanse después de caminar. El problema aparece cuando esa misma posibilidad se ejerce sin un motivo que otros consideren suficiente. Entonces se propone retirar el banco para resolver un conflicto de convivencia. Es una solución fácil de dibujar y difícil de defender: elimina para todos la posibilidad de sentarse, sin precisar qué conducta dañina se quería evitar ni cómo se atenderá de otro modo."
   },
   {
    "p": "Un municipio vecino intentó una alternativa. Instaló asientos separados y fijó horarios de vigilancia. En un mes, sus encargados registraron menos reclamos, pero no midieron cuántas personas dejaron de acudir ni si el cambio se debía a los asientos o a la presencia de personal. Citar esa experiencia como prueba definitiva sería repetir el error de la primera remodelación: tomar un indicador de una parte del uso como veredicto sobre el conjunto. Puede servir como antecedente para probar un diseño, siempre que la prueba incluya preguntas sobre permanencia, seguridad y facilidad de paso. Una plaza no mejora solo porque los reclamos bajen; también puede haber perdido a quienes ya no tienen dónde esperar."
   },
   {
    "p": "La vecina de la silla plegable fue invitada a una reunión. No pidió que se restituyeran exactamente los bancos anteriores. Propuso dos asientos en un borde desde el cual pudiera ver la salida del colegio y dejar libre el sendero central. Un joven que usa silla de ruedas apoyó la ubicación, pero advirtió que los apoyabrazos no debían invadir la ruta. Otro vecino sugirió plantar un árbol para dar sombra; el equipo técnico recordó que sus raíces requerirían espacio y cuidado. La conversación avanzó cuando dejó de preguntar si había que elegir entre bancos y circulación. Empezó a preguntar cómo ubicar, medir y mantener ambos usos en el mismo lugar."
   },
   {
    "p": "Conviene desconfiar de una respuesta que trate cualquier objeto urbano como garantía de convivencia. Un banco puede estar mal ubicado, ser incómodo o quedar aislado de la ruta que necesita quien descansa. También conviene desconfiar de la seguridad que se obtiene simplemente retirando lugares para quedarse. El diseño no puede sustituir acuerdos sobre el uso del espacio ni la atención a conflictos reales. Sí puede crear o cerrar posibilidades. Por eso la participación no debería limitarse a votar entre dos dibujos terminados: debe ayudar a formular qué actividades importan, en qué momentos ocurren y a quién afecta cada decisión."
   },
   {
    "p": "El debate reveló además un problema de tiempo. El informe de circulación había contado cruces en dos mañanas laborables; la vecina esperaba al salir el colegio, durante la tarde. Una medición podía ser correcta y, aun así, representar mal el uso que se discutía. El equipo propuso observar una semana completa con horarios de clase, feria y fin de semana. No para suspender indefinidamente los asientos, sino para elegir dónde tendrían más sentido. El plano original continuó siendo válido para calcular el ancho libre. Su error había sido usarse como si resumiera todas las maneras de estar en la plaza. Añadir observación de permanencia no obligaba a renunciar a la seguridad del paso."
   },
   {
    "p": "Una apoderada preguntó si los asientos serían ocupados por personas ajenas al barrio. La pregunta no podía responderse con el diseño y, a mi juicio, tampoco era el criterio adecuado. Una plaza pública no exige mostrar domicilio para descansar. La preocupación real parecía ser si algunas actividades impedirían a otras personas usar el lugar. Esa preocupación merecía reglas y atención concretas, no una distinción entre vecinos legítimos e intrusos. Si un conflicto aparece, hay que describir qué ocurre y cuándo, escuchar a quienes participan y evaluar respuestas proporcionadas. Eliminar el asiento antes de identificar el problema convierte una sospecha en arquitectura permanente."
   },
   {
    "p": "También se discutió el mantenimiento. Un banco sin reparación podía terminar siendo una barrera o una superficie insegura; un árbol sin cuidado podía levantar el pavimento. El proyecto de prueba incluyó limpieza, revisión de fijaciones y un registro de obstáculos del sendero. Un funcionario objetó que esas tareas encarecían una intervención pequeña. La vecina respondió que retirar los bancos deteriorados había sido fácil porque nadie había previsto su cuidado. Instalar nuevos asientos sin sostenerlos repetiría el ciclo. Un diseño accesible no es solo una fotografía del día de inauguración: depende de que el paso y la pausa sigan siendo posibles meses después."
   },
   {
    "p": "No todos los participantes quedaron satisfechos con la prueba de tres meses. Algunos querían una solución permanente antes del verano; otros temían que una intervención provisoria terminara sin evaluación. La municipalidad respondió publicando desde el inicio las fechas de observación y el criterio para decidir si ajustar la ubicación. Ese compromiso no garantizaba acuerdo, pero daba a las críticas un punto preciso al que dirigirse. La autora consideró valioso que la decisión quedara abierta a revisión sin quedar suspendida. El mismo principio habría sido útil al inicio de la remodelación: medir el paso, sí, y preguntar también qué posibilidades de descanso se perdían."
   },
   {
    "p": "Durante la primera semana de la prueba, varias personas se sentaron en el borde nuevo y otras siguieron usando la silla plegable. Esa coexistencia no demostraba todavía que el diseño fuera suficiente. La silla podía indicar costumbre, preferencia por otro lugar o falta de asientos en ciertos horarios. La observación debía continuar y, cuando fuera pertinente, preguntar a quienes usaban el espacio. La autora se resistía a convertir cada gesto en un voto inequívoco a favor o en contra del proyecto. Una plaza reúne usos que se superponen; interpretar uno exige más cuidado que contar cuántos objetos hay en el plano."
   },
   {
    "p": "Al final, la municipalidad aprobó una prueba de tres meses con dos asientos y un registro de circulación y permanencia. Me parece una decisión mejor que la primera, precisamente porque no se presenta como cierre definitivo. El informe original seguirá siendo útil para comprobar el ancho del paso; la experiencia de la vecina servirá para identificar una necesidad que ese informe no contemplaba. Si el ensayo falla, habrá que cambiar la ubicación o el diseño. Si funciona, no significará que toda plaza deba copiarlo. La accesibilidad es una pregunta que se vuelve concreta en los cuerpos, trayectos y tiempos de quienes usan cada lugar."
   }
  ]
 },
 {
  "id": 4,
  "title": "Guardar una pregunta",
  "blocks": [
   {
    "p": "Hay preguntas que se responden apenas se formulan y otras que cambian cuando intentamos precisarlas. “¿Cuántos libros hay en la sala?” requiere contar. “¿Qué libros necesita la sala?” exige saber quién la utiliza, para qué y en qué condiciones. No sostengo que una clase sea más noble que la otra. El conteo puede ser indispensable para organizar una compra; la segunda pregunta puede impedir que la compra se reduzca a repetir lo que ya existe. Mi interés está en el momento en que alguien cree haber respondido una pregunta porque obtuvo un número, sin advertir que la pregunta que necesitaba hacer era distinta."
   },
   {
    "p": "Una biblioteca escolar recibió una donación de cien libros y quiso repartirlos entre cursos. El criterio inicial fue asignar la misma cantidad a cada sala. La igualdad numérica parecía transparente. Sin embargo, un curso ya tenía una colección amplia y otro disponía de pocos ejemplares legibles para sus estudiantes. Alguien propuso entregar más al segundo. Otra persona objetó que eso rompería la igualdad anunciada. La discusión no se resolvía con una operación: había que decidir si se buscaba un reparto idéntico, un acceso similar o una respuesta a necesidades distintas. Cada objetivo llevaba a una distribución diferente, aun cuando todos partieran de los mismos cien libros."
   },
   {
    "p": "Guardar una pregunta no significa postergar toda acción hasta alcanzar certeza completa. Significa conservarla a la vista mientras se actúa. El equipo podía repartir una primera parte, observar el uso y ajustar el resto. Si escondía la pregunta bajo una cifra redonda, quizá nunca notaría que unas salas recibían libros que no podían usar. Las decisiones provisionales no son necesariamente débiles: pueden ser más responsables que una decisión irreversible cuando se explican sus criterios, se establece cuándo revisarlos y se deja abierta la posibilidad de corregir. Lo provisional se vuelve excusa solo si la revisión prometida no ocurre."
   },
   {
    "p": "También hay un riesgo contrario. Algunas personas invocan la complejidad para evitar cualquier compromiso. Piden más información sin señalar qué dato falta, cómo se obtendría o qué decisión permitiría tomar. Una pregunta puede servir para investigar o para aplazar indefinidamente. La diferencia no reside en que una sea profunda y la otra superficial, sino en su relación con una acción posible. “Necesitamos saber qué libros se leen” puede orientar un registro de préstamos. “Necesitamos comprender completamente la lectura de cada estudiante” puede sonar cuidadoso, pero, si no se traduce en un procedimiento, deja a la biblioteca inmóvil."
   },
   {
    "p": "La práctica de guardar una pregunta tiene además una dimensión pública. Quien recibe una decisión debería poder conocer el criterio que la organizó. Si se reparte igual, conviene decir que se privilegió la igualdad de cantidades; si se reparte según necesidades, conviene explicar cómo se identificaron. Ninguna fórmula elimina el desacuerdo, pero una razón visible permite discutirla y mejorarla. Una cifra sin criterio puede parecer neutral y, por eso mismo, impedir que alguien advierta qué intereses quedaron fuera. La transparencia no consiste en mostrar solamente una tabla: consiste en mostrar por qué esa tabla se considera pertinente."
   },
   {
    "p": "En ocasiones, la pregunta inicial cambia después de escuchar a quienes vivirán con la decisión. Un estudiante puede decir que su sala necesita libros, pero también un lugar tranquilo para leerlos. La donación no resuelve esa segunda necesidad. Sería injusto exigirle a los libros una tarea que no pueden cumplir; también sería injusto ignorar la observación porque no cabe en el presupuesto actual. La institución puede registrar esa demanda, decidir qué sí hará con los ejemplares y abrir otro proceso para el espacio. Guardar la pregunta significa no perderla cuando la respuesta inmediata solo cubre una parte."
   },
   {
    "p": "El ejemplo de los libros puede trasladarse a otras decisiones sin convertirlo en una receta universal. Una clínica podría repartir horas de atención idénticas entre áreas o asignarlas según la demanda; un taller podría comprar la misma herramienta para cada grupo o considerar lo que ya tiene. En cada caso, una tabla permitiría ver cantidades y compararlas. Pero antes de leerla habría que preguntar qué se entiende por igualdad y qué efecto se espera lograr. La pregunta no elimina la necesidad de contar: la ordena. Un cálculo bien hecho para un objetivo mal elegido sigue siendo un cálculo bien hecho y una decisión discutible."
   },
   {
    "p": "Se ha dicho que mostrar criterios vuelve más lenta la administración. Es posible que redactarlos tome tiempo al principio. También es posible que ahorre discusiones posteriores, porque permite explicar por qué una sala recibió menos ejemplares nuevos y cómo puede solicitar una revisión. La rapidez de una decisión no debe evaluarse solo hasta el momento en que se entrega un objeto. Si después nadie puede reconstruir la razón del reparto, cada duda obliga a empezar otra vez. La hoja de tres columnas sirve precisamente para conservar la memoria de la decisión sin exigir que quienes vengan después acepten sus supuestos como intocables."
   },
   {
    "p": "No todas las preguntas merecen la misma espera. Si una sala carece de material para comenzar una actividad mañana, sería irresponsable pedir un estudio de meses antes de entregarle cualquier ejemplar. La biblioteca puede resolver la urgencia con una asignación inicial y mantener abierta la discusión del reparto total. Esta distinción evita dos extremos que se parecen menos de lo que creen sus defensores: distribuir todo de inmediato sin examinar condiciones o exigir una información perfecta que nunca llegará. Entre ambos existe una práctica más trabajosa, pero también más verificable: actuar, dejar escrito por qué se actúa y volver a mirar lo que la acción produjo."
   },
   {
    "p": "Quien objete que las preguntas pueden multiplicarse sin fin tiene razón en señalar un límite. No es posible examinar todos los efectos de cada reparto antes de actuar. Por eso una buena pregunta debe ser pertinente y manejable: debe señalar una diferencia que pueda cambiar la decisión o la forma de revisarla. Saber el color de las portadas quizá no altere la distribución de los libros; saber qué salas cuentan con ejemplares legibles sí puede alterarla. La selección de preguntas es también una decisión que debe poder explicarse. No hay una lista perfecta que elimine el juicio, pero sí maneras de dejarlo abierto a crítica."
   },
   {
    "p": "La hoja de la biblioteca terminó siendo consultada por personas que no habían participado en la donación. Encontraron allí una razón que podían discutir sin reconstruir conversaciones de memoria. Una profesora señaló que la fecha de revisión coincidía con una semana de evaluaciones y pidió moverla. El equipo cambió el calendario y anotó el motivo. Ese pequeño ajuste mostró que documentar una decisión no significa petrificarla. Al contrario, permite saber qué parte cambió y por qué, sin presentar cada modificación como si la idea inicial nunca hubiese existido."
   },
   {
    "p": "Al terminar el reparto, la biblioteca conservó una hoja con tres columnas: criterio usado, evidencia disponible y fecha de revisión. La hoja no garantizaba que la decisión fuera correcta. Servía para que, meses después, nadie tuviera que adivinar por qué se había actuado de ese modo ni fingir que el resultado había sido inevitable. Tal vez este sea el valor más sobrio de una buena pregunta: acompaña la acción, impide que el primer dato se vuelva una explicación total y deja una puerta para corregir sin empezar de cero."
   }
  ]
 },
 {
  "id": 5,
  "title": "La reunión del canal",
  "blocks": [
   {
    "p": "La tarde en que se reunió la comisión del canal, la sala tenía más mapas que sillas. Un temporal había dejado agua en los patios de dieciocho casas del barrio Arroyo. El municipio llegó con un plano de desagües y un registro de reclamos; la junta vecinal llevó fotografías tomadas desde las puertas. En la pared, un papel decía: “Objetivo: acordar acciones antes de la próxima lluvia”. La frase parecía modesta hasta que alguien preguntó qué significaba “antes”: el pronóstico anunciaba precipitaciones para el viernes y era martes. Las obras que requerían licitación no estarían listas. Las medidas inmediatas tendrían que distinguirse de las soluciones permanentes."
   },
   {
    "p": "La primera voz fue la de Tomás, funcionario de mantención. Informó que el canal había recibido limpieza en dos tramos durante la semana anterior. No dijo que eso hubiera resuelto el problema: explicó que una inspección posterior encontró ramas acumuladas cerca de la pasarela. Una vecina mostró una foto del agua sobre su entrada. Tomás reconoció el lugar, pero señaló que la foto no permitía ver si la obstrucción estaba aguas arriba o en el sumidero de esa calle. La vecina respondió que no pretendía diagnosticar la causa. Quería que la comisión registrara que la ruta de salida de su casa había quedado cubierta. El plano y la imagen discutían problemas relacionados, aunque ninguno reemplazaba al otro."
   },
   {
    "p": "El secretario leyó el registro: dieciocho viviendas reportaron agua en patios; seis, ingreso a una habitación; cuatro personas dijeron no haber podido salir por la vereda. Una misma vivienda podía figurar en más de una categoría. El dato más repetido en la conversación fue dieciocho, quizá porque era el mayor. Una dirigenta preguntó por los horarios de los reportes y descubrió que se habían recibido entre las cinco y las once de la noche. No había observaciones de madrugada. La ausencia no demostraba que el agua hubiese bajado entonces: el servicio telefónico había cerrado a las once y las fotografías de algunas familias no tenían hora verificable."
   },
   {
    "p": "El grupo discutió tres acciones para el viernes. La primera era retirar ramas de la pasarela; Tomás podía hacerlo con una cuadrilla al día siguiente. La segunda era repartir barreras de arena a las casas afectadas; había material para diez accesos, pero el plano no mostraba cuáles puertas estaban más bajas. La tercera era cerrar la vereda junto al canal durante la lluvia. Una comerciante advirtió que ese cierre obligaría a cruzar una avenida sin semáforo. Nadie propuso descartar de plano las barreras ni el cierre. Se pidió identificar para quién cada medida reducía un peligro y para quién podía crear otro."
   },
   {
    "p": "Una estudiante que asistía con la junta vecinal dibujó sobre el mapa las cuatro rutas que habían quedado bloqueadas. Su dibujo no era una medición topográfica; recogía lo que las personas habían contado. El funcionario de emergencias sugirió recorrer esas rutas con quienes las usaban y comparar el resultado con los desniveles del plano. La comisión aprobó la visita para la mañana siguiente. Al mismo tiempo, autorizó la limpieza de la pasarela: la presencia de ramas podía comprobarse directamente y la acción era reversible. Para las barreras de arena, se acordó priorizar los accesos tras la visita y dejar constancia de los que quedaran sin material."
   },
   {
    "p": "Alguien pidió un comunicado que asegurara que el barrio estaba preparado. La presidenta de la comisión prefirió una nota más precisa. Diría qué se había limpiado, cuándo se haría la visita y a qué número podían avisar durante la noche, esta vez con atención continua. No prometía ausencia de anegamientos. La decisión molestó a quienes temían que la incertidumbre aumentara la preocupación. La presidenta respondió que una promesa imposible podía retrasar los avisos: si las familias creían que no habría agua, quizá prepararían más tarde sus rutas de salida. Informar una acción concreta y un límite conocido no era renunciar a la responsabilidad pública."
   },
   {
    "p": "La mañana del recorrido, la comisión se dividió en dos grupos. Uno acompañó a quienes vivían cerca de la pasarela; el otro siguió las rutas dibujadas por la estudiante. En una esquina encontraron un rebaje de vereda que, durante la lluvia anterior, había conducido agua hacia una puerta. El plano municipal mostraba la pendiente de la calle, pero no ese detalle construido después de la última actualización. Tomás tomó medidas y fotografió el punto. La vecina que había llevado la primera imagen dijo que eso era lo que intentaba explicar. Su foto no había diagnosticado la causa, pero había dirigido la atención hacia un lugar que el plano general no resolvía."
   },
   {
    "p": "Para repartir las diez barreras de arena se elaboró una lista provisional. Se priorizaron accesos bajos con antecedentes de ingreso a habitaciones y rutas de salida estrechas. La presidenta aclaró que las viviendas que quedaban sin material no eran consideradas seguras: el stock era insuficiente. Se anunció cómo solicitar ayuda y se pidió registrar los casos que no recibieran barrera. Esa distinción evitó que la lista de diez se leyera como una clasificación absoluta de necesidad. Una medida disponible puede cubrir solo una parte del problema; comunicar su límite permite organizar otras respuestas y evaluar si la próxima compra debe cambiar de tamaño o distribución."
   },
   {
    "p": "El cierre de la vereda se mantuvo como posibilidad condicionada. Si el agua llegaba a cubrirla, el personal tendría que señalar una ruta alternativa antes de impedir el paso. La comerciante insistió en que cruzar la avenida sin semáforo podía ser más peligroso que transitar junto al canal con poca agua. El funcionario de emergencias no prometió una regla única para todas las horas: pidió una observación durante el evento y un criterio visible para anunciar el cambio. El desacuerdo no se resolvió declarando a una voz más experta que otra. Se transformó en una condición operativa que podría comprobarse cuando llegara la lluvia."
   },
   {
    "p": "Al terminar la visita, la estudiante corrigió su dibujo: una de las rutas bloqueadas podía rodearse por una calle interior que no había considerado. Dejó visible la marca anterior junto a la nueva. Quería que la comisión supiera que el mapa había mejorado gracias a recorrerlo, no que siempre había sido exacto. El funcionario aceptó incorporar ambas versiones al acta. Así quedaba una evidencia de cómo se había tomado la decisión sobre la ruta alternativa y un punto de partida para comprobarla durante el siguiente temporal."
   },
   {
    "p": "El viernes llovió menos de lo anunciado. Dos patios recibieron agua y no hubo reportes de habitaciones afectadas. El secretario escribió el resultado junto al plan de acciones, sin atribuirlo de inmediato a la limpieza. La intensidad de la lluvia había cambiado y la comisión no contaba con una comparación suficiente para separar efectos. La reunión siguiente no se canceló. Debían revisar el recorrido del canal, los accesos que no recibieron barreras y la posibilidad de una obra de mayor plazo. En el margen del acta, la estudiante anotó: “Un buen acuerdo no elimina las preguntas; decide cuáles pueden esperar y cuáles no”."
   }
  ]
 }
];
const questions=[
 {
  "id": "q1",
  "textId": 1,
  "text": "¿Cuántas observaciones tuvieron sombra sobre el banco de Norte?",
  "options": [
   "Diecisiete de veinticuatro.",
   "Nueve de veinticuatro.",
   "Dos de veinticuatro.",
   "Once de veinticuatro."
  ],
  "key": "C",
  "skill": "Localizar",
  "level": "baja",
  "evidence": "Tabla: sombra sobre el banco, Norte, 2 de 24.",
  "reason": "Respuesta correcta: C. Tabla: sombra sobre el banco, Norte, 2 de 24.",
  "failures": [
   "17 corresponde a personas fuera de sombra, no al banco.",
   "9 es ese dato de Mercado.",
   "",
   "11 corresponde al banco de Mercado."
  ]
 },
 {
  "id": "q2",
  "textId": 1,
  "text": "¿Por qué las 168 presencias de Norte no equivalen a 168 personas diferentes?",
  "options": [
   "Una persona pudo ser contada en más de una visita.",
   "Los observadores omitieron los turnos de la mañana.",
   "Las cifras mezclan personas y vehículos de transporte.",
   "El registro excluyó a quienes esperaron bajo la sombra."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 2: alguien pudo aparecer dos veces.",
  "reason": "Respuesta correcta: A. Párrafo 2: alguien pudo aparecer dos veces.",
  "failures": [
   "",
   "No se observó la mañana.",
   "No se contaron vehículos como presencias.",
   "Se contaron también quienes esperaron con sombra."
  ]
 },
 {
  "id": "q3",
  "textId": 1,
  "text": "¿Qué muestra la vecina que esperaba de pie junto al muro?",
  "options": [
   "Que la sombra era suficiente para todas las personas.",
   "Que el banco de Mercado era más seguro que el de Norte.",
   "Que la mayoría de los pasajeros prefería mirar la calle.",
   "Que una zona sombreada podía ser poco funcional para esperar."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 3: sombra junto al muro sin visión del bus.",
  "reason": "Respuesta correcta: D. Párrafo 3: sombra junto al muro sin visión del bus.",
  "failures": [
   "Una sombra existente no fue usable por todos.",
   "No se compara seguridad entre bancos.",
   "No hay dato de preferencias mayoritarias.",
   ""
  ]
 },
 {
  "id": "q4",
  "textId": 1,
  "text": "¿Qué conclusión permiten los datos sobre instalar un techo en Norte?",
  "options": [
   "El techo reducirá una cantidad conocida de minutos de exposición.",
   "El banco estuvo descubierto en casi todas las observaciones hechas.",
   "Cada pasajero de Norte recibió más calor que uno de Mercado.",
   "La compra de techos resolverá la espera en los dos paraderos."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafos 4 y 5: banco de Norte descubierto en 22 de 24 visitas; no hay exposición individual.",
  "reason": "Respuesta correcta: B. Párrafos 4 y 5: banco de Norte descubierto en 22 de 24 visitas; no hay exposición individual.",
  "failures": [
   "No se midieron minutos individuales.",
   "",
   "No se midió calor recibido por persona.",
   "No hay prueba de solución en ambos paraderos."
  ]
 },
 {
  "id": "q5",
  "textId": 1,
  "text": "¿Por qué se propone probar otra señalética antes de intervenir Mercado?",
  "options": [
   "Porque el árbol dejó de dar sombra durante las seis tardes.",
   "Porque el número de usuarios impide instalar un refugio nuevo.",
   "Porque despejar la señal existente podría reducir la sombra usada.",
   "Porque el banco de Mercado quedó siempre fuera de la sombra."
  ],
  "key": "C",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafos 4 y 5: podar ramas por señalética quitaría sombra; probar señal fuera de la sombra.",
  "reason": "Respuesta correcta: C. Párrafos 4 y 5: podar ramas por señalética quitaría sombra; probar señal fuera de la sombra.",
  "failures": [
   "El árbol seguía dando sombra parte de la tarde.",
   "La cantidad de usuarios no impide la obra.",
   "",
   "El banco tuvo sombra en 11 observaciones."
  ]
 },
 {
  "id": "q6",
  "textId": 1,
  "text": "Un concejal afirma: “En Norte esperan más personas que en Mercado”. ¿Qué precisión exige el registro?",
  "options": [
   "La frase es falsa porque se observaron días diferentes.",
   "Hubo más presencias registradas, no necesariamente más personas únicas.",
   "La frase solo sería válida si ambos paraderos tuvieran bancos iguales.",
   "Las cifras prueban que el tiempo individual de espera fue mayor en Norte."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 2 y tabla: conteo de presencias, no individuos ni duración.",
  "reason": "Respuesta correcta: B. Párrafo 2 y tabla: conteo de presencias, no individuos ni duración.",
  "failures": [
   "Hubo visitas en los mismos seis días.",
   "",
   "Igualdad de bancos no resuelve identidad de personas.",
   "No se midió duración individual."
  ]
 },
 {
  "id": "q7",
  "textId": 1,
  "text": "¿Qué función cumple la frase final al pie del plano?",
  "options": [
   "Delimitar el alcance de una cifra antes de usarla para decidir.",
   "Descalificar el registro porque sus datos son poco claros.",
   "Sustituir la observación por testimonios de los pasajeros.",
   "Justificar que toda intervención espere un cambio de estación."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Cierre: cada pregunta requiere datos distintos; no se invalida la tabla.",
  "reason": "Respuesta correcta: A. Cierre: cada pregunta requiere datos distintos; no se invalida la tabla.",
  "failures": [
   "",
   "El texto conserva valor al registro.",
   "No reemplaza los datos por testimonios.",
   "En Norte autoriza intervenir sin esperar otra estación."
  ]
 },
 {
  "id": "q8",
  "textId": 2,
  "text": "¿Qué acordaron hacer Darío y Elena antes de descartar grabaciones?",
  "options": [
   "Escuchar al menos una cinta completa.",
   "Digitalizar todas las cintas de la caja.",
   "Consultar a todas las voces registradas.",
   "Exhibir primero las grabaciones claras."
  ],
  "key": "A",
  "skill": "Localizar",
  "level": "baja",
  "evidence": "Párrafo 1: condición de Darío.",
  "reason": "Respuesta correcta: A. Párrafo 1: condición de Darío.",
  "failures": [
   "",
   "No se digitalizó todo antes de elegir.",
   "No se pudo consultar a todos al comienzo.",
   "La condición era escuchar una cinta completa."
  ]
 },
 {
  "id": "q9",
  "textId": 2,
  "text": "¿Qué descubre Elena al unir dos frases de la entrevista?",
  "options": [
   "Que la socia había hecho la entrevista original.",
   "Que la panadera dejó de trabajar tras la lluvia.",
   "Que el corte hacía parecer general una afirmación sobre la primera semana.",
   "Que el ruido impedía identificar a la persona entrevistada."
  ],
  "key": "C",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 5: «siempre» surgía de un corte; la frase refería a la primera semana.",
  "reason": "Respuesta correcta: C. Párrafo 5: «siempre» surgía de un corte; la frase refería a la primera semana.",
  "failures": [
   "No se dice que la socia entrevistara.",
   "No se informa que dejara el oficio.",
   "",
   "El problema era contexto, no identificación."
  ]
 },
 {
  "id": "q10",
  "textId": 2,
  "text": "¿Por qué se conserva un fragmento de lluvia en la versión exhibida?",
  "options": [
   "Para demostrar que la cinta nunca pudo editarse.",
   "Para reproducir íntegramente el accidente del estudio.",
   "Para ocultar la intervención de la socia en la panadería.",
   "Para señalar una interrupción y evitar una continuidad engañosa."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 5: fragmento marca interrupción real y evita cambio de sentido.",
  "reason": "Respuesta correcta: D. Párrafo 5: fragmento marca interrupción real y evita cambio de sentido.",
  "failures": [
   "La cinta sí pudo editarse.",
   "No se reproduce todo el accidente.",
   "Conservar lluvia impide borrar a la socia.",
   ""
  ]
 },
 {
  "id": "q11",
  "textId": 2,
  "text": "¿Qué limita la interpretación de la cinta sin etiqueta como “vida del barrio”?",
  "options": [
   "La grabación contiene solo golpes y no registra ninguna voz.",
   "Se desconocen identidad y autorización de quienes aparecen en ella.",
   "El sonido de la campana no permite reconocer la sede vecinal.",
   "La madre de Darío había clasificado la cinta con una fecha errada."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 4: desconocen nombres y voluntad de ser grabados.",
  "reason": "Respuesta correcta: B. Párrafo 4: desconocen nombres y voluntad de ser grabados.",
  "failures": [
   "Se oyen voces, incluida la niña.",
   "",
   "La campana sí orienta sobre el lugar.",
   "No había etiqueta con fecha errada."
  ]
 },
 {
  "id": "q12",
  "textId": 2,
  "text": "¿Qué aporta la fotografía actual junto a la crónica de la plaza?",
  "options": [
   "Permite advertir un cambio del lugar sin alterar la grabación.",
   "Confirma que la fuente de agua nunca existió en la plaza.",
   "Sustituye la crónica por una descripción visual más exacta.",
   "Prueba quiénes participaron en la inauguración antigua."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 3: contraste entre fuente nombrada y plaza actual.",
  "reason": "Respuesta correcta: A. Párrafo 3: contraste entre fuente nombrada y plaza actual.",
  "failures": [
   "",
   "La foto no niega la existencia pasada.",
   "Acompaña, no sustituye, la crónica.",
   "No identifica participantes de la inauguración."
  ]
 },
 {
  "id": "q13",
  "textId": 2,
  "text": "¿Qué sentido adquiere “una voz no era solo sonido” al final?",
  "options": [
   "La calidad técnica determina si una grabación puede exhibirse.",
   "Una voz conserva siempre la intención original de quien la emitió.",
   "Los recuerdos personales son más fieles que las cintas archivadas.",
   "Escuchar exige considerar contexto, consentimiento y decisiones de edición."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "alta",
  "evidence": "Párrafos 4–7: niña sin turno, socia borrada, edición y autorización.",
  "reason": "Respuesta correcta: D. Párrafos 4–7: niña sin turno, socia borrada, edición y autorización.",
  "failures": [
   "La calidad técnica no agota el sentido.",
   "La edición puede cambiar el sentido.",
   "Los recuerdos tampoco garantizan fidelidad absoluta.",
   ""
  ]
 },
 {
  "id": "q14",
  "textId": 2,
  "text": "Un visitante acusa a Elena de ocultar la historia al no exhibir la cinta sin etiqueta. ¿Qué respuesta se ajusta al relato?",
  "options": [
   "La cinta no aporta ninguna información sobre el barrio.",
   "Todas las grabaciones privadas deben destruirse antes de una muestra.",
   "Conservarla mientras se identifica y consulta a las personas evita atribuirles un uso no acordado.",
   "La falta de etiqueta demuestra que la grabación fue realizada sin permiso."
  ],
  "key": "C",
  "skill": "Evaluar",
  "level": "media",
  "evidence": "Párrafo 6: se conserva pendiente de identificación y autorización; no se destruye ni se presume ilegal.",
  "reason": "Respuesta correcta: C. Párrafo 6: se conserva pendiente de identificación y autorización; no se destruye ni se presume ilegal.",
  "failures": [
   "La cinta contiene indicios, aunque faltan datos.",
   "Conservarla es parte de la decisión.",
   "",
   "Sin etiqueta no equivale a sin permiso."
  ]
 },
 {
  "id": "q15",
  "textId": 2,
  "text": "¿Qué cambio en Elena organiza el desarrollo del cuento?",
  "options": [
   "Pasa de defender la exhibición de todo archivo a negar valor a las cintas.",
   "Pasa de privilegiar la claridad técnica a atender el contexto y a quienes son registrados.",
   "Pasa de desconfiar de Darío a concederle el control exclusivo de la muestra.",
   "Pasa de escuchar grabaciones a preferir solo fotografías actuales."
  ],
  "key": "B",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Inicio, edición de entrevista, reserva de la cinta y tareas finales.",
  "reason": "Respuesta correcta: B. Inicio, edición de entrevista, reserva de la cinta y tareas finales.",
  "failures": [
   "Elena nunca defiende exhibir todo.",
   "",
   "Darío no obtiene control exclusivo.",
   "Se siguen escuchando grabaciones."
  ]
 },
 {
  "id": "q16",
  "textId": 3,
  "text": "¿Cuál es la tesis central de la columna?",
  "options": [
   "Toda plaza debe conservar sus bancos antiguos para ser accesible.",
   "La circulación debe subordinarse siempre a la permanencia.",
   "La participación consiste en escoger entre dibujos terminados.",
   "La accesibilidad exige considerar desplazarse y permanecer en el lugar."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafos 2, 5 y 7: llegar y quedarse, con diseño situado.",
  "reason": "Respuesta correcta: D. Párrafos 2, 5 y 7: llegar y quedarse, con diseño situado.",
  "failures": [
   "No exige bancos idénticos.",
   "No subordina siempre la circulación.",
   "La votación entre dibujos es insuficiente.",
   ""
  ]
 },
 {
  "id": "q17",
  "textId": 3,
  "text": "¿Qué acción inició la disputa sobre el uso de la plaza?",
  "options": [
   "La plantación de un árbol junto al sendero.",
   "Una vecina comenzó a llevar una silla plegable.",
   "El cierre permanente del paso central.",
   "El retiro de una señal ubicada en la plaza."
  ],
  "key": "B",
  "skill": "Localizar",
  "level": "baja",
  "evidence": "Párrafo 1: vecina lleva silla plegable.",
  "reason": "Respuesta correcta: B. Párrafo 1: vecina lleva silla plegable.",
  "failures": [
   "Árbol se sugirió después.",
   "",
   "El paso no se cerró permanentemente.",
   "No se retiró una señal."
  ]
 },
 {
  "id": "q18",
  "textId": 3,
  "text": "¿Qué límite del plano de remodelación señala la autora?",
  "options": [
   "Representa recorridos, pero deja fuera la necesidad de detenerse.",
   "Muestra bancos deteriorados, pero no las rutas accesibles.",
   "Describe reclamos, pero omite el ancho libre de circulación.",
   "Incluye testimonios, pero no permite ubicar el sendero."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 2: línea entre entradas y salidas sin pausa.",
  "reason": "Respuesta correcta: A. Párrafo 2: línea entre entradas y salidas sin pausa.",
  "failures": [
   "",
   "El plano sí muestra rutas.",
   "El ancho libre está registrado.",
   "No contiene testimonios."
  ]
 },
 {
  "id": "q19",
  "textId": 3,
  "text": "¿Qué presupuesto cuestiona la autora cuando se propone retirar bancos por conflictos de convivencia?",
  "options": [
   "Que los bancos viejos cuestan más de mantener que los nuevos.",
   "Que los árboles siempre impiden ver la salida del colegio.",
   "Que quitar asientos resuelve el conflicto sin afectar a otros usuarios.",
   "Que todas las personas usan los bancos durante el mismo tiempo."
  ],
  "key": "C",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 3: retirar elimina posibilidad para todos sin precisar conducta.",
  "reason": "Respuesta correcta: C. Párrafo 3: retirar elimina posibilidad para todos sin precisar conducta.",
  "failures": [
   "Mantenimiento no es el presupuesto señalado.",
   "La propuesta de árbol es posterior.",
   "",
   "No se afirma uso temporal idéntico."
  ]
 },
 {
  "id": "q20",
  "textId": 3,
  "text": "¿Por qué el caso del municipio vecino no funciona como prueba definitiva?",
  "options": [
   "Porque la reducción de reclamos fue inventada por la autora.",
   "Porque allí no se instalaron asientos nuevos.",
   "Porque la experiencia ocurrió en otra estación del año.",
   "Porque faltan datos de ausencias y del efecto de cada cambio."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 4: menos reclamos, sin medir ausentes ni separar asientos y vigilancia.",
  "reason": "Respuesta correcta: D. Párrafo 4: menos reclamos, sin medir ausentes ni separar asientos y vigilancia.",
  "failures": [
   "La reducción de reclamos sí fue informada.",
   "Se instalaron asientos separados.",
   "No se menciona otra estación.",
   ""
  ]
 },
 {
  "id": "q21",
  "textId": 3,
  "text": "¿Qué cambio permite avanzar en la reunión con la vecina?",
  "options": [
   "Pasar de elegir entre bancos y circulación a diseñar ambos usos juntos.",
   "Descartar los apoyabrazos para aumentar el número de asientos.",
   "Sustituir el sendero por una zona de descanso con sombra.",
   "Aprobar la reposición exacta de los tres bancos retirados."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 5: ubicación, medida y mantención de ambos usos.",
  "reason": "Respuesta correcta: A. Párrafo 5: ubicación, medida y mantención de ambos usos.",
  "failures": [
   "",
   "No se descartan todos los apoyabrazos.",
   "No se sustituye sendero por descanso.",
   "No pide bancos exactos anteriores."
  ]
 },
 {
  "id": "q22",
  "textId": 3,
  "text": "Un concejal dice: “Como bajaron los reclamos en el municipio vecino, su plaza mejoró”. ¿Qué respondería la autora?",
  "options": [
   "La afirmación es correcta porque los reclamos miden todos los usos.",
   "El dato es parcial: pueden haber dejado de acudir personas sin lugar para esperar.",
   "La afirmación es falsa porque la vigilancia aumenta siempre los conflictos.",
   "El dato no tiene valor alguno para probar un diseño en otra plaza."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 4: reclamos bajan, pero no se midieron ausentes; antecedente, no prueba final.",
  "reason": "Respuesta correcta: B. Párrafo 4: reclamos bajan, pero no se midieron ausentes; antecedente, no prueba final.",
  "failures": [
   "Los reclamos no miden a quienes dejaron de ir.",
   "",
   "No se afirma que vigilancia siempre aumente conflictos.",
   "El dato sirve como antecedente parcial."
  ]
 },
 {
  "id": "q23",
  "textId": 3,
  "text": "¿Para qué se menciona al joven que usa silla de ruedas?",
  "options": [
   "Para mostrar que cualquier banco bloquea el sendero central.",
   "Para refutar la necesidad de asientos junto a la ruta.",
   "Para precisar una condición de diseño que permita ambos usos.",
   "Para demostrar que la ubicación de la vecina es imposible."
  ],
  "key": "C",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 5: apoya ubicación, advierte por apoyabrazos.",
  "reason": "Respuesta correcta: C. Párrafo 5: apoya ubicación, advierte por apoyabrazos.",
  "failures": [
   "La voz del joven apoya una ubicación posible.",
   "No refuta asientos.",
   "",
   "No declara imposible esa ubicación."
  ]
 },
 {
  "id": "q24",
  "textId": 3,
  "text": "¿Qué observación es coherente con el cierre de la columna?",
  "options": [
   "Una prueba local exitosa no obliga a copiar el diseño en todas las plazas.",
   "Una prueba fallida demostraría que la permanencia no importa.",
   "El ancho del paso carece de utilidad una vez instalados los asientos.",
   "La accesibilidad solo puede evaluarse mediante reclamos formales."
  ],
  "key": "A",
  "skill": "Evaluar",
  "level": "media",
  "evidence": "Párrafo 7: prueba de tres meses, sin universalizar.",
  "reason": "Respuesta correcta: A. Párrafo 7: prueba de tres meses, sin universalizar.",
  "failures": [
   "",
   "Una falla no anula la necesidad.",
   "El ancho del paso sigue siendo útil.",
   "No basta contar reclamos."
  ]
 },
 {
  "id": "q25",
  "textId": 3,
  "text": "¿Qué función cumple la silla plegable en la argumentación?",
  "options": [
   "Probar que las vecinas prefieren objetos portátiles al mobiliario fijo.",
   "Mostrar que la remodelación fue ilegal por retirar bancos.",
   "Presentar una solución definitiva para quienes necesitan descansar.",
   "Volver visible una necesidad que el indicador de circulación no registraba."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafos 1 y 7: silla revela espera y pausa omitidas.",
  "reason": "Respuesta correcta: D. Párrafos 1 y 7: silla revela espera y pausa omitidas.",
  "failures": [
   "No prueba preferencia por objetos portátiles.",
   "La columna no afirma ilegalidad.",
   "La silla no es solución universal.",
   ""
  ]
 },
 {
  "id": "q26",
  "textId": 4,
  "text": "¿Qué diferencia entre las dos preguntas iniciales destaca el ensayo?",
  "options": [
   "Una se responde con opiniones y la otra únicamente con cifras.",
   "Una pide contar existencias y la otra requiere conocer usos y necesidades.",
   "Una se refiere a una compra y la otra a un préstamo de libros.",
   "Una puede contestarse y la otra debe quedar siempre abierta."
  ],
  "key": "B",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 1: «cuántos» cuenta; «qué libros» exige usuarios y condiciones.",
  "reason": "Respuesta correcta: B. Párrafo 1: «cuántos» cuenta; «qué libros» exige usuarios y condiciones.",
  "failures": [
   "La primera no pide opiniones.",
   "",
   "La segunda también puede llevar a una compra.",
   "Ambas pueden tener respuestas revisables."
  ]
 },
 {
  "id": "q27",
  "textId": 4,
  "text": "¿Por qué la misma cantidad de libros por sala puede no producir un acceso similar?",
  "options": [
   "Porque todos los cursos tienen idénticas colecciones previas.",
   "Porque una donación impide identificar a quienes usarán los libros.",
   "Porque las salas parten de colecciones y condiciones diferentes.",
   "Porque el número de libros siempre reduce el interés por leer."
  ],
  "key": "C",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 2: un curso ya tenía colección amplia, otro pocos ejemplares legibles.",
  "reason": "Respuesta correcta: C. Párrafo 2: un curso ya tenía colección amplia, otro pocos ejemplares legibles.",
  "failures": [
   "Las colecciones previas difieren.",
   "La donación no impide conocer usuarios.",
   "",
   "No hay regla de menor interés por más libros."
  ]
 },
 {
  "id": "q28",
  "textId": 4,
  "text": "¿Qué convierte una decisión provisional en una respuesta responsable según el autor?",
  "options": [
   "Que se mantenga aun cuando aparezcan nuevos datos.",
   "Que se anuncie como solución final para evitar dudas.",
   "Que se posponga hasta disponer de certeza completa.",
   "Que explicite criterios, fecha de revisión y posibilidad real de corregir."
  ],
  "key": "D",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 3: criterios, revisión y corrección; promesa incumplida vuelve excusa.",
  "reason": "Respuesta correcta: D. Párrafo 3: criterios, revisión y corrección; promesa incumplida vuelve excusa.",
  "failures": [
   "La revisión puede modificarla.",
   "No se anuncia como final.",
   "No exige certeza completa.",
   ""
  ]
 },
 {
  "id": "q29",
  "textId": 4,
  "text": "¿Qué función cumple el ejemplo de pedir “comprender completamente la lectura de cada estudiante”?",
  "options": [
   "Mostrar una pregunta que suena cuidadosa, pero no orienta una acción concreta.",
   "Proponer una evaluación exhaustiva antes de repartir cualquier libro.",
   "Demostrar que el registro de préstamos no informa sobre el uso.",
   "Defender que solo preguntas profundas pueden guiar una decisión."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 4: sin procedimiento, deja biblioteca inmóvil.",
  "reason": "Respuesta correcta: A. Párrafo 4: sin procedimiento, deja biblioteca inmóvil.",
  "failures": [
   "",
   "No se propone evaluación exhaustiva.",
   "El registro de préstamos sí orienta una pregunta.",
   "No se privilegia profundidad abstracta."
  ]
 },
 {
  "id": "q30",
  "textId": 4,
  "text": "Si la biblioteca muestra una tabla sin explicar su criterio, ¿qué falta según el ensayo?",
  "options": [
   "Un número mayor de columnas para incluir todos los títulos.",
   "La razón por la que esos datos se consideran pertinentes para decidir.",
   "Una autorización de los estudiantes para revisar los préstamos.",
   "La prueba de que el reparto fue idéntico entre todas las salas."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 5: transparencia incluye por qué tabla es pertinente.",
  "reason": "Respuesta correcta: B. Párrafo 5: transparencia incluye por qué tabla es pertinente.",
  "failures": [
   "Más columnas no explican pertinencia.",
   "",
   "No trata de autorización personal.",
   "La igualdad numérica es solo un criterio posible."
  ]
 },
 {
  "id": "q31",
  "textId": 4,
  "text": "¿Cómo se trata la necesidad de un lugar tranquilo que expresa un estudiante?",
  "options": [
   "Se descarta porque no cabe en el presupuesto de libros.",
   "Se resuelve entregando más libros a la sala del estudiante.",
   "Se toma como prueba de que la donación carece de valor.",
   "Se registra como otra demanda sin exigir a los libros que la resuelvan."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 6: registrar demanda, decidir compra y abrir otro proceso.",
  "reason": "Respuesta correcta: D. Párrafo 6: registrar demanda, decidir compra y abrir otro proceso.",
  "failures": [
   "No se descarta la demanda.",
   "Más libros no garantiza un lugar tranquilo.",
   "No invalida la donación.",
   ""
  ]
 },
 {
  "id": "q32",
  "textId": 4,
  "text": "¿Qué procedimiento aplica mejor la idea de “guardar una pregunta”?",
  "options": [
   "Repartir todos los libros por igual y evitar revisar la decisión.",
   "Suspender la entrega hasta resolver por completo cada necesidad de lectura.",
   "Distribuir una parte con criterio explícito y revisar el uso antes del resto.",
   "Cambiar los criterios cada semana sin explicar por qué se modifican."
  ],
  "key": "C",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafos 3 y 7: acción provisional, observación y revisión documentada.",
  "reason": "Respuesta correcta: C. Párrafos 3 y 7: acción provisional, observación y revisión documentada.",
  "failures": [
   "Evita revisar el resultado.",
   "Paraliza sin necesidad.",
   "",
   "Cambiar sin explicación pierde trazabilidad."
  ]
 },
 {
  "id": "q33",
  "textId": 4,
  "text": "¿Qué representa la hoja de tres columnas del cierre?",
  "options": [
   "Un registro para explicar y revisar la decisión sin presentarla como inevitable.",
   "Una garantía de que el reparto final fue correcto para cada estudiante.",
   "Una tabla de notas que reemplaza la consulta a quienes leerán.",
   "Un inventario que elimina los desacuerdos sobre igualdad y necesidad."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 7: criterio, evidencia y fecha; no garantiza acierto.",
  "reason": "Respuesta correcta: A. Párrafo 7: criterio, evidencia y fecha; no garantiza acierto.",
  "failures": [
   "",
   "La hoja no garantiza acierto.",
   "No es una tabla de notas.",
   "No elimina desacuerdos."
  ]
 },
 {
  "id": "q34",
  "textId": 5,
  "text": "¿Cuántas viviendas informaron ingreso de agua a una habitación?",
  "options": [
   "Dos.",
   "Cuatro.",
   "Seis.",
   "Dieciocho."
  ],
  "key": "C",
  "skill": "Localizar",
  "level": "baja",
  "evidence": "Párrafo 3: seis reportaron ingreso a habitación.",
  "reason": "Respuesta correcta: C. Párrafo 3: seis reportaron ingreso a habitación.",
  "failures": [
   "2 patios pertenecen al resultado del viernes.",
   "4 personas no salían por vereda.",
   "",
   "18 informaron agua en patios."
  ]
 },
 {
  "id": "q35",
  "textId": 5,
  "text": "¿Por qué los dieciocho reportes de agua en patios no pueden sumarse a los seis de habitaciones para contar viviendas distintas?",
  "options": [
   "Porque los reportes se recibieron en horarios diferentes.",
   "Porque una parte corresponde a otra comuna.",
   "Porque las habitaciones no estaban dentro de las casas afectadas.",
   "Porque una misma vivienda podía figurar en más de una categoría."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 3: categorías superpuestas.",
  "reason": "Respuesta correcta: D. Párrafo 3: categorías superpuestas.",
  "failures": [
   "Los horarios no impiden superposición.",
   "El texto trata un mismo barrio.",
   "Las habitaciones son parte de las viviendas.",
   ""
  ]
 },
 {
  "id": "q36",
  "textId": 5,
  "text": "¿Qué permite concluir la ausencia de reportes después de las once de la noche?",
  "options": [
   "Que el agua bajó en todos los patios antes de medianoche.",
   "Que el registro no permite saber qué ocurrió después del cierre telefónico.",
   "Que las fotografías tomadas de noche son falsas por carecer de hora.",
   "Que el temporal terminó cuando dejó de atender el servicio."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 3: teléfono cerró a las once; ausencia de reportes no prueba ausencia de agua.",
  "reason": "Respuesta correcta: B. Párrafo 3: teléfono cerró a las once; ausencia de reportes no prueba ausencia de agua.",
  "failures": [
   "No hay registros posteriores.",
   "",
   "Falta de hora no hace falsas las fotos.",
   "Cerró el teléfono, no necesariamente el temporal."
  ]
 },
 {
  "id": "q37",
  "textId": 5,
  "text": "¿Por qué se autoriza limpiar la pasarela antes de completar el recorrido de las rutas?",
  "options": [
   "Porque las ramas podían comprobarse directamente y retirarlas era reversible.",
   "Porque la limpieza garantizaba que ninguna casa volvería a anegarse.",
   "Porque la fotografía de una vecina ubicaba la única causa del agua.",
   "Porque la comisión ya había descartado las barreras de arena."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 5: ramas comprobables y acción reversible.",
  "reason": "Respuesta correcta: A. Párrafo 5: ramas comprobables y acción reversible.",
  "failures": [
   "",
   "No garantiza ausencia de agua.",
   "La foto no diagnostica causa única.",
   "Las barreras siguieron en discusión."
  ]
 },
 {
  "id": "q38",
  "textId": 5,
  "text": "¿Qué relación propone el funcionario de emergencias entre el dibujo de la estudiante y el plano?",
  "options": [
   "El dibujo reemplaza las medidas de desnivel del plano.",
   "El plano invalida lo contado por quienes usan las rutas.",
   "Se recorren las rutas con usuarios y se compara con desniveles del plano.",
   "Ambos documentos prueban por sí solos la causa de cada bloqueo."
  ],
  "key": "C",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 5: recorrido con usuarios y comparación con plano.",
  "reason": "Respuesta correcta: C. Párrafo 5: recorrido con usuarios y comparación con plano.",
  "failures": [
   "El dibujo no reemplaza medidas.",
   "El plano no invalida testimonios.",
   "",
   "No prueban causas por separado."
  ]
 },
 {
  "id": "q39",
  "textId": 5,
  "text": "¿Por qué la presidenta rechaza anunciar que el barrio está preparado sin matices?",
  "options": [
   "Porque sabe que el canal seguirá bloqueado toda la semana.",
   "Porque una promesa sin respaldo podría retrasar los avisos y preparativos.",
   "Porque la limpieza no se realizó y prefiere ocultar esa omisión.",
   "Porque comunicar incertidumbre elimina la responsabilidad pública."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 6: promesa imposible podría retrasar avisos.",
  "reason": "Respuesta correcta: B. Párrafo 6: promesa imposible podría retrasar avisos.",
  "failures": [
   "No se afirma bloqueo toda la semana.",
   "",
   "La limpieza sí se anunció.",
   "Informar límites no elimina responsabilidad."
  ]
 },
 {
  "id": "q40",
  "textId": 5,
  "text": "Tras la lluvia menor a la prevista, ¿qué impide atribuir los dos patios anegados a la eficacia de la limpieza?",
  "options": [
   "Que la comisión no registró ninguna medida realizada.",
   "Que los patios afectados eran los únicos con barreras de arena.",
   "Que la estudiante había dibujado rutas sin usar el plano.",
   "Que cambió la intensidad de lluvia y falta comparación suficiente."
  ],
  "key": "D",
  "skill": "Evaluar",
  "level": "alta",
  "evidence": "Párrafo 7: intensidad menor; no puede separar efectos.",
  "reason": "Respuesta correcta: D. Párrafo 7: intensidad menor; no puede separar efectos.",
  "failures": [
   "Hubo limpieza registrada.",
   "No consta que los patios tuvieran barreras.",
   "El dibujo no permite atribuir eficacia.",
   ""
  ]
 },
 {
  "id": "q41",
  "textId": 5,
  "text": "¿Qué distingue las medidas inmediatas de las obras permanentes en la reunión?",
  "options": [
   "Las primeras podían ejecutarse antes del viernes; las obras requerían más plazo.",
   "Las primeras resolvían las causas; las obras solo atendían síntomas.",
   "Las primeras dependían de licitación; las obras podían iniciarse al día siguiente.",
   "Las primeras se decidían sin datos; las obras no requerían observación."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "media",
  "evidence": "Párrafo 1: obras con licitación no listas; medidas inmediatas.",
  "reason": "Respuesta correcta: A. Párrafo 1: obras con licitación no listas; medidas inmediatas.",
  "failures": [
   "",
   "Las medidas inmediatas no resuelven necesariamente causas.",
   "Invierte plazos de licitación y ejecución.",
   "Se basaron en observación parcial."
  ]
 },
 {
  "id": "q42",
  "textId": 5,
  "text": "¿Qué idea resume la anotación final de la estudiante?",
  "options": [
   "Una reunión útil debe cerrar todas las dudas antes de actuar.",
   "Un acuerdo responsable distingue decisiones urgentes de preguntas que pueden esperar.",
   "Las preguntas pendientes prueban que las acciones inmediatas fueron inútiles.",
   "La próxima lluvia confirmará cuál de las voces tenía razón."
  ],
  "key": "B",
  "skill": "Interpretar",
  "level": "alta",
  "evidence": "Cierre: acuerdo decide qué preguntas esperan; limpieza y visita se separan.",
  "reason": "Respuesta correcta: B. Cierre: acuerdo decide qué preguntas esperan; limpieza y visita se separan.",
  "failures": [
   "No exige cerrar todas las dudas.",
   "",
   "Las preguntas pendientes no inutilizan acciones.",
   "No convierte el temporal en disputa personal."
  ]
 }
];
const guidedText={
 "id": 1,
 "title": "La reunión del canal (extracto)",
 "blocks": [
  {
   "p": "El grupo discutió tres acciones para el viernes. La primera era retirar ramas de la pasarela; Tomás podía hacerlo con una cuadrilla al día siguiente. La segunda era repartir barreras de arena a las casas afectadas; había material para diez accesos, pero el plano no mostraba cuáles puertas estaban más bajas. La tercera era cerrar la vereda junto al canal durante la lluvia. Una comerciante advirtió que ese cierre obligaría a cruzar una avenida sin semáforo. Nadie propuso descartar de plano las barreras ni el cierre. Se pidió identificar para quién cada medida reducía un peligro y para quién podía crear otro."
  },
  {
   "p": "Una estudiante que asistía con la junta vecinal dibujó sobre el mapa las cuatro rutas que habían quedado bloqueadas. Su dibujo no era una medición topográfica; recogía lo que las personas habían contado. El funcionario de emergencias sugirió recorrer esas rutas con quienes las usaban y comparar el resultado con los desniveles del plano. La comisión aprobó la visita para la mañana siguiente. Al mismo tiempo, autorizó la limpieza de la pasarela: la presencia de ramas podía comprobarse directamente y la acción era reversible. Para las barreras de arena, se acordó priorizar los accesos tras la visita y dejar constancia de los que quedaran sin material."
  },
  {
   "p": "Alguien pidió un comunicado que asegurara que el barrio estaba preparado. La presidenta de la comisión prefirió una nota más precisa. Diría qué se había limpiado, cuándo se haría la visita y a qué número podían avisar durante la noche, esta vez con atención continua. No prometía ausencia de anegamientos. La decisión molestó a quienes temían que la incertidumbre aumentara la preocupación. La presidenta respondió que una promesa imposible podía retrasar los avisos: si las familias creían que no habría agua, quizá prepararían más tarde sus rutas de salida. Informar una acción concreta y un límite conocido no era renunciar a la responsabilidad pública."
  }
 ]
};
const guidedQuestions=[
 {
  "id": "q1",
  "textId": 1,
  "text": "¿Qué medida autorizó la comisión para hacer de inmediato?",
  "options": [
   "Cerrar la vereda junto al canal.",
   "Repartir las barreras de arena.",
   "Limpiar la pasarela.",
   "Publicar que el barrio estaba preparado."
  ],
  "key": "C",
  "skill": "Localizar",
  "level": "baja",
  "evidence": "Párrafo 2 del extracto: «autorizó la limpieza de la pasarela».",
  "reason": "La limpieza de la pasarela es la única medida que el texto dice que se autorizó de inmediato.",
  "failures": [
   "El cierre quedó discutido y condicionado.",
   "Las barreras se repartirían después de la visita.",
   "",
   "La presidenta prefirió una nota más precisa."
  ]
 },
 {
  "id": "q2",
  "textId": 1,
  "text": "¿Cuándo se haría la visita a las rutas bloqueadas?",
  "options": [
   "El viernes, durante la lluvia.",
   "La mañana siguiente.",
   "Esa misma tarde.",
   "Después de repartir las barreras."
  ],
  "key": "B",
  "skill": "Localizar",
  "level": "baja",
  "evidence": "Párrafo 2 del extracto: «la visita para la mañana siguiente».",
  "reason": "El texto fija la visita para la mañana siguiente.",
  "failures": [
   "El viernes era la fecha anunciada de la lluvia, no de la visita.",
   "",
   "No se habla de esa misma tarde.",
   "Las barreras se priorizan después de la visita, no antes."
  ]
 },
 {
  "id": "q3",
  "textId": 1,
  "text": "¿Por qué se autorizó de inmediato la limpieza de la pasarela?",
  "options": [
   "Porque las barreras de arena no servían.",
   "Porque no tenía ningún riesgo para nadie.",
   "Porque el plano mostraba que era la única causa.",
   "Porque las ramas podían comprobarse directamente y la acción era reversible."
  ],
  "key": "D",
  "skill": "Interpretar",
  "level": "baja",
  "evidence": "Párrafo 2 del extracto: «podía comprobarse directamente y la acción era reversible».",
  "reason": "El texto da dos razones: se podía comprobar y se podía deshacer.",
  "failures": [
   "Las barreras se dejaron para después de la visita, no se descartaron.",
   "El texto no dice que no tuviera riesgos.",
   "El plano no se menciona como prueba de causa única.",
   ""
  ]
 },
 {
  "id": "q4",
  "textId": 1,
  "text": "¿Qué problema veía la comerciante en cerrar la vereda?",
  "options": [
   "Que obligaría a cruzar una avenida sin semáforo.",
   "Que no había cuadrilla para cerrarla.",
   "Que las barreras no alcanzaban.",
   "Que el canal quedaría sin limpiar."
  ],
  "key": "A",
  "skill": "Interpretar",
  "level": "baja",
  "evidence": "Párrafo 1 del extracto: «ese cierre obligaría a cruzar una avenida sin semáforo».",
  "reason": "Su advertencia señala que el cierre podía crear otro peligro.",
  "failures": [
   "",
   "La cuadrilla se menciona para retirar ramas, no para el cierre.",
   "Las barreras son otra medida.",
   "La limpieza ya estaba aprobada."
  ]
 },
 {
  "id": "q5",
  "textId": 1,
  "text": "¿Por qué la presidenta no quiso asegurar que el barrio estaba preparado?",
  "options": [
   "Porque quería que las familias se preocuparan más.",
   "Porque no había nadie que atendiera avisos.",
   "Porque una promesa imposible podía retrasar los avisos y la preparación de las rutas de salida.",
   "Porque el municipio había prohibido los comunicados."
  ],
  "key": "C",
  "skill": "Interpretar",
  "level": "baja",
  "evidence": "Párrafo 3 del extracto: «una promesa imposible podía retrasar los avisos».",
  "reason": "La presidenta explica que prometer lo imposible haría que las familias se prepararan más tarde.",
  "failures": [
   "Ella buscaba precisión, no más preocupación.",
   "Se ofrecía atención continua durante la noche.",
   "",
   "El texto no menciona prohibición alguna."
  ]
 },
 {
  "id": "q6",
  "textId": 1,
  "text": "Un vecino propone anunciar «no habrá agua en ninguna casa». Según el texto, ¿qué problema tiene ese anuncio?",
  "options": [
   "Que informa una acción concreta de la comisión.",
   "Que promete algo que no se puede asegurar y podría atrasar la preparación.",
   "Que repite lo que dice el plano.",
   "Que no menciona la limpieza de la pasarela."
  ],
  "key": "B",
  "skill": "Evaluar",
  "level": "baja",
  "evidence": "Párrafo 3 del extracto: la nota «no prometía ausencia de anegamientos».",
  "reason": "El anuncio promete lo que la comisión evitó prometer, con el riesgo que ella señaló.",
  "failures": [
   "Informar una acción concreta es lo que la presidenta sí quiso hacer.",
   "",
   "El plano no se usa en ese anuncio.",
   "Omitir la limpieza no es el problema central del texto."
  ]
 }
];
const questionsFor=g=>g?guidedQuestions:questions;
function publicActivity(g){return {sessionId:SESSION+(g?'-guiada':''),version:VERSION,title:TITLE,texts:g?[guidedText]:texts,questions:questionsFor(g).map(({id,textId,text,options})=>({id,textId,text,options}))};}
function grade(a,g){const qs=questionsFor(g),QUESTIONS=qs,correct=qs.filter(q=>a?.[q.id]===q.key).length;return {score:correct,correct,total:QUESTIONS.length,skills:Object.fromEntries(['Localizar','Interpretar','Evaluar'].map(s=>{const group=qs.filter(q=>q.skill===s);return [s,{correct:group.filter(q=>a?.[q.id]===q.key).length,total:group.length}];}))};}
// Exigencia 60 %: 0 % = 1,0; 60 % = 4,0; 100 % = 7,0; un decimal.
function note(correct,total){if(!total)return null;const p=correct/total,n=p<0.6?1+3*p/0.6:4+3*(p-0.6)/0.4;return Math.round(n*10+1e-9)/10;}
module.exports={SESSION,VERSION,TITLE,texts,questionsFor,publicActivity,grade,note};
