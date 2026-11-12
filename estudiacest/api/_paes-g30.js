'use strict';
// Guía 30 · Repaso 4: medios, géneros y lectura crítica (de los medios masivos a las estrategias para la prueba).
// Clave y retroalimentación viven solo en servidor; cada retroalimentación cita la pista del texto.
const key = {
    1:'B', 2:'D', 3:'A', 4:'D', 5:'C',
    6:'A', 7:'C', 8:'B', 9:'A', 10:'C',
    11:'B', 12:'D', 13:'D', 14:'B', 15:'C',
    16:'A', 17:'B', 18:'A', 19:'D', 20:'C',
    21:'C', 22:'D', 23:'A', 24:'B', 25:'A',
    26:'D', 27:'B', 28:'C', 29:'D', 30:'A',
    31:'C', 32:'B', 33:'B', 34:'C', 35:'A',
    36:'D', 37:'C', 38:'B', 39:'D', 40:'A',
    41:'A', 42:'D', 43:'C', 44:'B'
};

const feedback = {
    1:'El diario entrega hechos que se pueden comprobar: «180 millones de pesos», «hasta las 21:00» y lo que dijeron los vecinos. Esa es la función de informar. Entretener y opinar se parecen más al tono de los otros dos medios, que celebran la inauguración; aquí no aparece una valoración propia del diario.',
    2:'Solo el diario habla de una obra de «180 millones de pesos financiada con fondos regionales». Los jóvenes que llegan con sus tablas están en la radio («Chicos de varios colegios»), y la invitación a compartir y el salto de patineta pertenecen al perfil de internet.',
    3:'La radio dice «después de la música, hablamos con la alcaldesa» y no menciona a vecinos ni a jóvenes como entrevistados. Decidir a quién se escucha es parte del poder de los medios para seleccionar y mostrar un tema. Que los vecinos no quisieran hablar es algo que el texto no dice.',
    4:'El perfil usa «¡LA PISTA ES NUESTRA!» y termina con «Compártelo si tú también lo esperabas»: busca emocionar y mover a actuar. Aunque los tres hablan del mismo hecho, no lo muestran con la misma neutralidad. El diario, en cambio, se apoya en cifras y en voces distintas. La radio también se emociona («la alegría se escuchó hasta la feria»), pero no pide a nadie actuar ni compartir; el perfil sí.',
    5:'El texto indica que «fue encargado y financiado por Vitalmax» y que la marca lo publicó en su propio sitio. Quien vende la bebida tiene interés en mostrarla como útil, y eso resta confiabilidad. Camila no es la fuente del estudio: solo cuenta su experiencia como participante.',
    6:'El recuadro dice «Prueba Neuron+ antes de tu próxima prueba», una invitación a consumir el producto. Por eso la nota parece informativa, pero su propósito es vender. Tampoco educa sobre riesgos: justamente no menciona los efectos de la cafeína en menores.',
    7:'La nota dice que se aplicó «durante dos semanas a doce estudiantes de un solo colegio, sin grupo de comparación». Pocos casos, poco tiempo y nada con qué comparar impiden afirmar que la bebida causó algún cambio. Que los participantes sean adolescentes no es un defecto, porque la nota habla justamente de adolescentes.',
    8:'La nota «no menciona los efectos de la cafeína en menores ni la opinión de especialistas en salud». Lo que se omite también orienta al lector, porque muestra solo los aspectos favorables de la bebida. La marca, la edad de Camila y el porcentaje sí aparecen en el texto.',
    9:'El aviso ofrece «30 % de descuento» y termina con «¡Hazlas tuyas!»: señales de que quiere vender. La imagen atractiva y las frases cortas también las usa la propaganda, por eso no sirven para distinguir una de otra. Cambiar una costumbre es el fin de la propaganda, no de este aviso.',
    10:'El afiche pide «Separa, recicla y cuéntaselo a un amigo», una conducta concreta, y no ofrece nada a la venta. Su fin es difundir una idea o valor: cuidar el río. Tampoco presenta cifras, de modo que no es una pieza informativa.',
    11:'Ambas piezas incluyen una imagen entre corchetes y frases cortas dirigidas a quien lee: «Corre más lejos» y «Separa, recicla y cuéntaselo a un amigo». Ninguna usa cifras de estudios ni voces de expertos.',
    12:'El afiche ofrece una razón: «Si todos ponemos un poco, el río vuelve a ser de todos». Publicidad y propaganda argumentan, pero con fines distintos: vender o difundir una idea. Decir que solo la publicidad argumenta confunde el fin del mensaje con la acción de convencer.',
    13:'El texto cita «un catastro de la Fundación Raíces Urbanas» y a la agrónoma Paula Reyes: son fuentes y datos que profundizan el tema. El relato personal es propio de la crónica y las preguntas y respuestas, de la entrevista.',
    14:'El texto avanza por momentos («Sábado, siete de la mañana») y termina con una valoración personal: «la huerta no es un ahorro: es una forma de volver a casa». Informa contando una historia, no investigando con cifras.',
    15:'Paula Reyes dice que «primero hay que revisar que el techo resista el peso de la tierra». El riego es la dificultad que menciona después, y las semillas del municipio aparecen en el reportaje, no en la entrevista.',
    16:'La pregunta no se responde con sí o no, sino con una explicación: Paula Reyes contesta «Ser constante, porque las plantas piden riego casi todos los días». Las preguntas abiertas profundizan; las cerradas precisan.',
    17:'El reportaje informa con datos, la crónica con un relato y la entrevista con preguntas y respuestas. La crónica también informa: «Don Mario abre la reja de su azotea» muestra un hecho concreto. En la entrevista hay un periodista que pregunta, así que no es más objetiva por sí sola. Haber estado presente da cercanía, no más confiabilidad: la crónica incluye la mirada del cronista.',
    18:'El texto afirma «Este diario sostiene», es decir, habla en nombre del medio, y no aparece ninguna firma. La opinión firmada es propia de la columna y la de un lector, de la carta al director.',
    19:'Ibarra la resume al final: «Primero renovemos, después ampliemos». No pide cerrar la biblioteca ni rechaza ampliar el horario; solo cambia el orden de las prioridades.',
    20:'Ibarra apoya su tesis en su vivencia: «Fui socio cuatro años y puedo asegurarlo». No cita cifras ni especialistas. La comparación con la fiesta sin música es otro recurso, pero no es la que se pregunta.',
    21:'La crítica dice que el acierto es «la fotografía: las luces del letrero dan calidez a cada escena» y que la debilidad es «el final apresurado». Cada juicio viene con una razón, y eso lo vuelve fundamentado. Contar toda la trama no es evaluar.',
    22:'El editorial usa «Este diario sostiene» y la columna, «Por Tomás Ibarra»: son voces distintas, pero ambas tienen tesis y razones. No coinciden, pues el editorial pide ampliar el horario e Ibarra, renovar primero. Tener firma no vuelve objetiva una opinión.',
    23:'El autor plantea que «el aburrimiento es el taller donde la mente ordena sus herramientas» y propone «diez minutos de nada». Aclara que no se trata de abandonar la tecnología: «No propongo apagar el mundo». Caminar es solo lo que decía su abuela.',
    24:'El autor usa expresiones personales como «Pienso que» y «no estoy seguro de que se equivocara», propias de una reflexión subjetiva. Un informe presenta datos y no duda así. El texto tampoco narra una historia: solo usa pequeñas anécdotas para pensar.',
    25:'La abuela decía que «las ideas buenas llegan caminando», y el autor agrega «no estoy seguro de que se equivocara». Es una razón basada en la experiencia, presentada con cautela. No es un dato científico ni una refutación.',
    26:'El cierre dice «No propongo apagar el mundo» y concluye con «Quizás descubramos»: formula una propuesta y deja abierta la reflexión. No impone una orden ni busca agotar el tema, rasgo propio del ensayo.',
    27:'El texto describe un «fondo amarillo brillante» y letras «muy grandes» que dicen «VOTA EL JUEVES»: colores intensos y tamaño que llaman la atención. Son recursos visuales; no explican razones ni crean calma.',
    28:'La estudiante no espera que nadie conteste: enseguida afirma «Hoy ese alguien eres tú». La pregunta busca que el espectador reconozca su propia pasividad. Es un recurso lingüístico, no una pregunta de encuesta.',
    29:'El volumen y el ritmo de la voz («voz fuerte y pausada») son paraverbales; el gesto de señalar es no verbal. Invertir esa relación es un error frecuente. Que aparezcan descritos en el guion no los convierte en lingüísticos: lo lingüístico es la palabra misma.',
    30:'El video convence con una voz «fuerte y pausada», una estudiante que mira «directo a la cámara» y un silencio final. Hablar bajo, rápido y sin mirar quitaría esa fuerza. Los otros cambios mantienen o refuerzan recursos que ya funcionan.',
    31:'El mensaje asegura que el limón «elimina la gripe en 24 horas», mientras la nota solo afirma que «ayuda a sentirse mejor». Leer más allá del titular permite ver que la promesa se exageró. Ninguno de los dos cita estudios.',
    32:'La ficha anota que «el sitio vende tés e infusiones», así que publicar que el limón cura la gripe podría ayudarlo a vender. Esto no prueba que mienta, pero es una razón para dudar. Tampoco cita especialistas ni es una institución reconocida.',
    33:'La nota es del «14 de marzo de 2019» y el mensaje empieza con «URGENTE»: presenta como actual algo viejo. Que no tenga autor es otro criterio de la ficha, no el de la fecha.',
    34:'La ficha dice que «ninguna institución de salud ni otro medio confiable informa esa cura». No dice que alguien lo desmienta: simplemente nadie confiable lo respalda. Esa ausencia es una señal de alerta.',
    35:'La ficha no usa los reenvíos como criterio: revisa autor, fecha, propósito, respaldo y contraste, y concluye «no lo comparto». Un mensaje que pide reenviar «antes de que lo borren» presiona, pero no prueba nada.',
    36:'El meme junta la imagen de un gato con lentes y la frase «Yo, tratando de entender el calendario de pruebas». Imagen y texto circulan juntos y, al unirse, producen humor. No hay video ni datos.',
    37:'@sombra_483 escribe «Si no lo borras, lo reenvío a todos los grupos del colegio con tu nombre», una amenaza de hostigamiento (ciberacoso). Usar un seudónimo o comentar no es el problema: lo es amenazar.',
    38:'@josefa_c admite «Lo vi en un grupo» y pide «¡Compártanlo!»: su única fuente es un grupo, sin verificar. Eso alimenta la desinformación. No insulta a nadie ni publica datos personales.',
    39:'El comentario es una amenaza («lo reenvío a todos los grupos del colegio»), y la mejor respuesta la trata como tal: se guarda evidencia y se pide ayuda. Responder con otra amenaza o con insultos repite el hostigamiento, y callar deja a Matías solo.',
    40:'El video de Matías, los comentarios y la amenaza de «lo reenvío a todos los grupos del colegio» muestran que lo publicado queda registrado y puede circular. Nada en los textos dice que algo desaparezca solo ni que el perfil sea privado.',
    41:'La respuesta está escrita tal cual: el centro de estudiantes «advirtió que el liceo debe mejorar el wifi de la sala de lectura». Cuando hay que ubicar un dato explícito, la pregunta es de obtener información. No hace falta inferir ni opinar.',
    42:'El texto no dice quién queda fuera: hay que unir «muchos no podrán conectarse» con el wifi pendiente para concluir que podrían quedar fuera quienes no tengan buena conexión. Eso es inferir, es decir, interpretar. No hay un párrafo que lo nombre.',
    43:'El texto indica que podrán usarla estudiantes «de 1.º a 4.º medio con su correo institucional», lo que contradice la alternativa. Descartar es comprobar cada alternativa contra el texto. Hacerlo solo por cómo suena o por una palabra puede llevar a error.',
    44:'Cada respuesta de esta noticia se comprobó con una pista del texto, como «de 1.º a 4.º medio». Primero se reconoce el tipo de pregunta y luego se vuelve al texto, porque una alternativa puede sonar bien y no estar respaldada. Elegir por sonido, por memoria o por largo no da esa seguridad.'
};

module.exports = { key, feedback };
