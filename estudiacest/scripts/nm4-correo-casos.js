'use strict';
// Situaciones completamente ficticias. No describen a la comunidad CEST.
module.exports=[
 {
  title:'Caso 1 · La discusión terminó en empujones',
  context:[
   'Eres Inés, practicante del taller ficticio Sur Gráfico. Llevas tres semanas apoyando la preparación de pedidos. Trabajas con Diego, encargado de impresión, y Mauricio, responsable de despacho. Ambos tienen experiencia y suelen discutir sobre quién debe revisar los trabajos antes de entregarlos.',
   'Hoy, martes 13 de octubre, el pedido P-318 debe salir a las 12:00. A las 10:15, Mauricio encuentra tres cajas sin etiquetas y acusa a Diego de retrasar la entrega. Diego responde que despacho debía rotularlas. Tú estás junto a la mesa de preparación y escuchas la discusión completa.',
   'Mauricio grita «¡Haz bien la pega, huevón!» y Diego contesta «No me vengas a mandar, imbécil». Diego empuja a Mauricio con ambas manos; Mauricio le devuelve un empujón. Una caja cae y bloquea parte del pasillo. Sandra se interpone y les pide que se separen. No observaste golpes de puño ni puedes asegurar que alguien se haya lesionado.',
   'La jefa directa, Laura Vega, está en una reunión y no vio lo ocurrido. Después, los dos colegas te piden que apoyes su versión. Te preocupa quedar en medio, que vuelva a pasar y que el pedido salga sin revisión. Decides informar los hechos y pedir que la jefa intervenga; no te corresponde decidir quién debe ser sancionado.'
  ],
  records:[
   ['Orden P-318','13 de octubre: entrega a las 12:00; las cajas deben salir rotuladas y revisadas.'],
   ['Lo que presenciaste','13 de octubre, 10:15, mesa de preparación: insultos, un empujón de Diego, otro de Mauricio y una caja caída. Sandra pidió separarse.']
  ],
  dialogue:[['Diego','10:25','Si escribes, di que Mauricio empezó. No me dejes como el culpable.'],['Mauricio','10:27','Tú viste cómo me empujó. Cuenta todo, no solo lo que le conviene a él.']],
  chatName:'Mensajes privados a Inés',
  role:'Inés · Practicante',recipient:'Laura Vega · Jefa directa',address:'jefatura@taller.example',
  mission:'Solicita a Laura que intervenga. Detalla cuándo y dónde ocurrió, qué viste y qué escuchaste. Explica tu preocupación y pide una revisión de la situación y medidas para evitar otra agresión. No afirmes lesiones, intenciones ni antecedentes que no conoces.'
 },
 {
  title:'Caso 2 · Quiero denunciar, pero tengo miedo',
  context:[
   'Eres Nicolás, estudiante de 4° medio del colegio ficticio Horizonte. Tu compañero Benjamín suele quedarse solo en los recreos. Durante la última semana has visto que Lucas y Kevin lo molestan en distintas ocasiones. No eres amigo cercano de Benjamín, pero te preocupa que los demás se rían o miren sin intervenir.',
   'El jueves 8 de octubre, a las 10:20, en el patio, escuchaste que lo llamaban «inútil» y le quitaban el cuaderno. El viernes 9, a las 12:05, cerca del comedor, viste que escondían su mochila y le cerraban el paso cuando intentaba recuperarla. Benjamín pidió que pararan y se fue sin su mochila.',
   'El lunes 12 apareció en el grupo del curso una imagen de Benjamín con una frase burlona. Viste quién la publicó y los mensajes que siguieron. No sabes quién tomó la fotografía ni cómo se siente él fuera del colegio. Hoy se sienta lejos del grupo y tú temes que la situación continúe.',
   'Quieres informar a tu profesora jefe, Alejandra Ortiz. Te da miedo que sepan que fuiste tú y que después te molesten. No quieres publicar una acusación en el grupo ni enfrentar a Lucas y Kevin. Tu correo debe solicitar ayuda para Benjamín y una conversación privada, explicando por qué necesitas que tu identidad sea resguardada.'
  ],
  records:[
   ['Registro de lo que viste','8 de octubre, 10:20, patio: insulto y cuaderno quitado. 9 de octubre, 12:05, comedor: mochila escondida y paso bloqueado.'],
   ['Grupo del curso','12 de octubre, 19:10: Lucas publica la imagen burlona. Nicolás leyó los mensajes; no conoce el origen de la foto.']
  ],
  dialogue:[['Lucas','19:10','[Imagen de Benjamín con una frase burlona] El campeón del curso 😂'],['Kevin','19:12','Que nadie vaya a contarle a la profe. Después se hacen los valientes.']],
  chatName:'Extracto del grupo del curso · 12 de octubre',
  role:'Nicolás · Estudiante testigo',recipient:'Alejandra Ortiz · Profesora jefe',address:'profesora.jefe@colegio.example',
  mission:'Informa lo que presenciaste y solicita que la profesora intervenga para proteger a Benjamín. Pide reserva de tu identidad, una conversación privada y orientación para evitar represalias. No prometas anonimato absoluto ni supongas que conoces todo lo ocurrido.'
 },
 {
  title:'Caso 3 · Queremos que el director nos escuche',
  context:[
   'Eres Emilia, delegada de 4° medio del colegio ficticio Horizonte. Varios compañeros te piden escribir al director, Ricardo León, por el trato del profesor Sergio Mora, de Comunicación Técnica. El curso reconoce que hay conversaciones durante algunas clases, pero siente que los llamados de atención han pasado a ser humillaciones.',
   'El martes 6 de octubre, a las 09:20, una compañera pidió que explicara otra vez una instrucción. Tú escuchaste que el profesor respondió «Si no entiendes algo tan simple, no deberías estar aquí». El jueves 8, a las 11:40, llamó «flojos» al curso y rompió la hoja de un trabajo frente a quienes estaban en la primera fila.',
   'El lunes 12, a las 08:50, tú preguntaste cómo corregir una actividad. El profesor respondió «Deja de hacer perder el tiempo» y siguió con la clase. Después, tres compañeros dijeron que preferían no volver a preguntar. Otro estudiante asegura que el profesor ha hecho lo mismo en otros cursos, pero tú no estuviste presente y no puedes confirmarlo.',
   'Algunas personas quieren enviar un correo lleno de insultos; otras temen que reclamar empeore la relación con el profesor. Como delegada, decides presentar los hechos que observaste, distinguirlos de comentarios ajenos y solicitar una revisión formal. No existe una investigación ni una sanción anunciada. Buscas que el director escuche al curso y explique los pasos para abordar la situación.'
  ],
  records:[
   ['Hechos presenciados por Emilia','6 de octubre, 09:20: respuesta a la compañera. 8 de octubre, 11:40: expresión «flojos» y hoja rota. 12 de octubre, 08:50: respuesta a Emilia.'],
   ['Información sin confirmar','El comentario sobre otros cursos es de un tercero; Emilia no presenció esos hechos.']
  ],
  dialogue:[['Compañero','09:15','Escribe que todos lo odiamos y que lo echen.'],['Emilia','09:17','Voy a contar lo que vimos y pedir que nos escuchen. No podemos inventar lo de otros cursos.']],
  chatName:'Conversación privada · Delegación del curso',
  role:'Emilia · Delegada',recipient:'Ricardo León · Director',address:'direccion@colegio.example',
  mission:'Solicita al director una reunión y una revisión de los hechos. Detalla fechas, situaciones y expresiones relevantes; explica su efecto en la participación del curso. Pide orientación y resguardo frente a posibles represalias, sin exigir una sanción como si ya hubiera una investigación concluida.'
 },
 {
  title:'Caso 4 · Ya no es una broma: necesito ayuda',
  context:[
   'Eres Alex, estudiante de 4° medio del colegio ficticio Horizonte. Un compañero, Matías, empezó hace dos semanas con comentarios de contenido sexual que llamaba «bromas». Al principio te reíste por incomodidad y para no quedar aislado. Eso no significa que hayas dado permiso para que te toque.',
   'El viernes 9 de octubre, a las 13:10, en el pasillo junto a la sala, Matías te tocó las partes íntimas por encima de la ropa sin tu permiso. Tú te apartaste y dijiste «No me toques; no me gusta». Él se rio y respondió «No seas exagerado». Dos compañeros estaban cerca, pero no sabes cuánto observaron.',
   'El lunes 12, a las 10:25, cerca de las escaleras, volvió a tocarte sin permiso después de hacer un comentario sexual. Le pediste nuevamente que parara. Desde entonces intentas evitarlo y te preocupa encontrártelo sin otras personas cerca. No quieres que el curso lo convierta en un rumor ni contar detalles delante de todos.',
   'Te cuesta decidir a quién acudir y temes que digan que tú seguiste la broma. En esta situación puedes pedir apoyo a tu profesor jefe o a una persona adulta de confianza. Para este ejercicio escribirás a María Salas, encargada de convivencia. No tienes que investigar a Matías, conseguir pruebas por tu cuenta ni enfrentarlo para que tu solicitud de ayuda sea escuchada.'
  ],
  records:[
   ['Hechos que vivió Alex','9 de octubre, 13:10, pasillo junto a la sala; 12 de octubre, 10:25, cerca de las escaleras. Tocamientos sin permiso; Alex pidió que parara en ambas ocasiones.'],
   ['Lo que necesita','Hablar en privado, recibir apoyo y acordar medidas que eviten nuevos contactos. No sabe qué observaron otras personas.']
  ],
  dialogue:[],chatName:'',
  role:'Alex · Estudiante que solicita apoyo',recipient:'María Salas · Encargada de convivencia',address:'convivencia@colegio.example',
  mission:'Solicita apoyo y protección. Describe los hechos necesarios, con fechas y lugares, sin detalles gráficos. Pide una conversación privada, resguardo de la información y orientación sobre los pasos de ayuda. No minimices lo ocurrido como una broma ni atribuyas el problema a cómo es la persona.'
 }
];
