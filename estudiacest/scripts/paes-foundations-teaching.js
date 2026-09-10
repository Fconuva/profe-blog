'use strict';
// Encuadre didáctico público: no contiene textos evaluados, claves ni distractores.
module.exports = {
 '1': {
  aim:'Localizar información explícita e interpretar relaciones entre ideas, justificando las respuestas con evidencia y sin agregar datos que el texto no permite.',
  success:['Distingo una información literal de una paráfrasis.','Relaciono pistas para sostener una inferencia.','Explico qué parte del texto respalda mi elección.'],
  visual:'De la pista a la respuesta',type:'route',nodes:[['Texto','¿Qué se afirma?'],['Evidencia','¿Dónde se sostiene?'],['Respuesta','¿Conserva el sentido?']],
  note:'La paráfrasis cambia las palabras, no la información. La inferencia conecta pistas: no completa el texto con una suposición personal.',
  activate:'En tu cuaderno, explica la diferencia entre «lo dice el texto» y «puedo concluirlo a partir del texto». Añade un ejemplo cotidiano.',
  practice:'Lee el primer texto completo. En cada pregunta, distingue si debes recuperar información o relacionar pistas; después contrasta las cuatro alternativas.',
  independent:'Lee el segundo texto y responde las preguntas 7–12 sin consultar el esquema ni el ejemplo. Apoya tus decisiones en esta nueva lectura.',
  close:'¿En qué decisión estuviste a punto de agregar información? Escribe cómo la comprobaste.'
 },
 '2': {
  aim:'Sintetizar textos no literarios, jerarquizando sus ideas y conservando las relaciones y los límites de lo que afirman.',
  success:['Separo la idea central de sus ejemplos.','Reconozco relaciones entre las partes del texto.','Redacto una síntesis que no amplía ni reduce indebidamente su alcance.'],
  visual:'Una síntesis conserva lo esencial',type:'funnel',nodes:[['Detalles y ejemplos','Leo el conjunto.'],['Ideas relevantes','Selecciono y relaciono.'],['Síntesis','Expreso la idea central.']],
  note:'Reducir la extensión no basta: una síntesis debe conservar la relación entre las ideas y los límites de la afirmación.',
  activate:'Piensa en una noticia que hayas leído. En tu cuaderno, escribe su tema y luego su idea principal. ¿Son la misma cosa?',
  practice:'Lee el primer texto completo. Reconoce qué idea desarrollan los ejemplos y cómo se conectan los párrafos antes de responder.',
  independent:'Trabaja con el segundo texto sin consultar los apoyos anteriores. Responde las preguntas 7–12 y comprueba el alcance de cada alternativa.',
  close:'Escribe una síntesis de dos oraciones en tu cuaderno y explica qué detalle decidiste omitir.'
 },
 '3': {
  aim:'Interpretar un relato relacionando la voz narrativa, el orden temporal y las acciones de los personajes con su conflicto.',
  success:['Distingo quién cuenta de quién participa.','Reconstruyo la secuencia de los hechos.','Relaciono una decisión del personaje con el conflicto del relato.'],
  visual:'Dos órdenes para leer un relato',type:'timeline',nodes:[['Antes','Antecedentes del conflicto'],['Cambio','Acción o decisión'],['Después','Consecuencias']],
  note:'Este es el orden de los hechos. El relato puede contarlos de otra manera: identifica qué cambia cuando recuerda o anticipa un episodio.',
  activate:'En tu cuaderno, cuenta un hecho empezando por el final. ¿Cambiaste lo ocurrido o la forma de presentarlo?',
  practice:'Lee el relato completo. Reconstruye los hechos y observa desde qué perspectiva se cuentan; vuelve a los episodios al responder.',
  independent:'Lee el nuevo relato y resuelve las preguntas 7–12 sin consultar el modelado. Distingue lo narrado de tus expectativas sobre los personajes.',
  close:'Elige una decisión del personaje y explica qué cambiaría en tu interpretación si ese episodio no estuviera.'
 },
 '4': {
  aim:'Evaluar un texto argumentativo reconstruyendo su tesis y sus razones, y juzgando la pertinencia y suficiencia de la evidencia.',
  success:['Reconozco qué postura se defiende.','Distingo una razón de un ejemplo.','Evalúo el respaldo usando un criterio explícito.'],
  visual:'Cómo se sostiene una postura',type:'argument',nodes:[['Tesis','Lo que se defiende'],['Razón','Por qué se defiende'],['Evidencia','Con qué se respalda']],
  note:'La pregunta no es solo «¿estoy de acuerdo?». Pregunta si la razón es pertinente y si la evidencia alcanza para sostener la conclusión.',
  activate:'Escribe una propuesta para tu curso y una razón a favor. ¿Qué información necesitarías para convencer a alguien que duda?',
  practice:'Lee el texto completo. Reconstruye primero la postura y sus apoyos; luego examina qué permite afirmar cada evidencia.',
  independent:'Evalúa el segundo texto y responde las preguntas 7–12 sin revisar el ejemplo. Separa tu opinión del juicio solicitado sobre el texto.',
  close:'Completa en tu cuaderno: «Este respaldo es pertinente porque…, pero su alcance se limita a…».'
 },
 '5': {
  aim:'Interpretar imágenes y relaciones de sentido en poemas, vinculando palabras, voz y totalidad del texto mediante evidencia.',
  success:['Distingo una imagen poética de una lectura exclusivamente literal.','Relaciono palabras o versos para justificar un sentido.','Compruebo mi interpretación en el poema completo.'],
  visual:'La imagen se interpreta en contexto',type:'poem',nodes:[['Palabras e imágenes','Qué aparece en los versos'],['Relaciones','Qué se asocia o contrasta'],['Sentido del poema','Qué lectura permite el conjunto']],
  note:'No existe una equivalencia automática entre una imagen y un significado. El mismo elemento puede tener sentidos distintos en otros poemas.',
  activate:'Piensa en la expresión «el tiempo vuela». En tu cuaderno, explica qué perdería si solo la leyeras literalmente.',
  practice:'Lee el primer poema completo y vuelve a leerlo en voz baja. Relaciona los versos; no resuelvas una imagen aislándola de su contexto.',
  independent:'Lee el segundo poema y responde las preguntas 7–12 sin consultar el esquema. Sostén cada interpretación en sus versos.',
  close:'Elige una imagen del poema y explica su aporte al sentido del conjunto, no solo el nombre de un recurso.'
 },
 '6': {
  aim:'Evaluar razonamientos identificando fallas en la relación entre sus razones y conclusiones, y explicando por qué el respaldo no basta.',
  success:['Reconstruyo la razón y la conclusión.','Identifico el salto que no está justificado.','Explico la falla sin limitarme a nombrar una falacia.'],
  visual:'Revisa el salto del razonamiento',type:'fault',nodes:[['Razón presentada','¿Qué respaldo ofrece?'],['Vínculo por comprobar','¿Alcanza para concluir?'],['Conclusión','¿Qué pretende demostrar?']],
  note:'Atacar a una persona, presentar un caso aislado o apelar a la popularidad no demuestra por sí mismo una conclusión. Examina la relación concreta.',
  activate:'«Muchas personas lo comparten; por eso debe ser verdadero». En tu cuaderno, escribe qué información falta para evaluar esa afirmación.',
  practice:'Lee el texto completo. En cada razonamiento, separa el respaldo de la conclusión y comprueba si hay un salto injustificado.',
  independent:'Responde las preguntas 7–12 del segundo texto sin consultar los apoyos. Justifica tus decisiones por la relación entre las ideas.',
  close:'Reformula en tu cuaderno un razonamiento débil: ¿qué evidencia necesitaría para sostener mejor su conclusión?'
 },
 '7': {
  aim:'Explicar la función y evaluar la pertinencia de recursos retóricos y discursivos según el propósito, el contexto y el destinatario del texto.',
  success:['Identifico un recurso en un pasaje concreto.','Explico qué función cumple, más allá de nombrarlo.','Relaciono su efecto con el propósito y el destinatario.'],
  visual:'Del recurso a su función',type:'bridge',nodes:[['Recurso','Qué elección hace el emisor'],['Función','Qué hace en ese pasaje'],['Propósito y destinatario','Para qué y para quién']],
  note:'Una pregunta, comparación o repetición no produce siempre el mismo efecto. Su función depende del lugar que ocupa y de la situación comunicativa.',
  activate:'Compara «cierra la llave» con «cada gota cuenta». ¿Qué cambia en la manera de dirigirse al lector? Anótalo en tu cuaderno.',
  practice:'Lee el primer texto completo. Cuando reconozcas un recurso, explica qué aporta al pasaje y al propósito general.',
  independent:'Lee el segundo texto y responde las preguntas 7–12 sin consultar el modelo. Evalúa los recursos según esa situación comunicativa.',
  close:'Elige un recurso y explica qué efecto se perdería si se reemplazara por una formulación neutra.'
 },
 '8': {
  aim:'Construir y contrastar inferencias sobre personajes y contexto, relacionando indicios del relato y descartando hipótesis que exceden la evidencia.',
  success:['Diferencio un indicio de una suposición.','Conecto pistas pertinentes para sostener una hipótesis.','Reviso mi hipótesis cuando aparece información que la limita.'],
  visual:'Pistas que convergen, hipótesis que se revisan',type:'convergence',nodes:[['Indicio de una acción','Qué hace el personaje'],['Indicio del contexto','En qué situación ocurre'],['Hipótesis limitada','Qué permiten concluir juntas']],
  note:'Dos pistas ayudan cuando son pertinentes y convergen. No se trata de acumular citas: la conclusión debe explicar su relación sin inventar antecedentes.',
  activate:'Alguien vuelve varias veces a mirar una puerta. Anota dos explicaciones posibles y qué pista permitiría distinguirlas.',
  practice:'Lee el relato completo. Formula una hipótesis y vuelve a los indicios para comprobarla; conserva la opción que mejor respete el conjunto.',
  independent:'Interpreta el segundo relato y responde las preguntas 7–12 sin consultar el esquema. Revisa qué autoriza realmente cada episodio.',
  close:'Escribe una hipótesis que descartaste y el indicio que te llevó a corregirla.'
 },
 '9': {
  aim:'Contrastar posturas y sesgos de un emisor, evaluando la selección de información, sus omisiones y el alcance de sus afirmaciones.',
  success:['Reconozco una postura a partir de marcas textuales.','Explico qué información se destaca y cuál se omite.','Evalúo la afirmación sin confundir perspectiva con falsedad.'],
  visual:'Una situación, distintas selecciones',type:'comparison',nodes:[['Perspectiva A','Qué destaca y qué deja fuera'],['Perspectiva B','Qué destaca y qué deja fuera'],['Contraste con evidencia','Qué permite sostener cada postura']],
  note:'Tener una perspectiva no vuelve falso un texto. Comprueba cómo se selecciona la información y si la conclusión respeta la evidencia disponible.',
  activate:'Imagina dos titulares sobre una misma actividad escolar: uno destaca la asistencia y otro, sus dificultades. ¿Qué necesitarías leer antes de juzgarlos?',
  practice:'Lee el primer texto completo. Observa las palabras valorativas, los datos seleccionados y los límites de las conclusiones.',
  independent:'Lee el segundo texto y responde las preguntas 7–12 sin consultar los apoyos. Contrasta las afirmaciones con la información que efectivamente se presenta.',
  close:'Formula una pregunta que harías al emisor para conocer mejor el alcance de su afirmación.'
 }
};
