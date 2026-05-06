/**
 * GUÍA S8 — Evidencia y Distractores (NM2 SIMCE 2026)
 * Data file: textos, preguntas SIMCE, ejercicios de evidencia
 */
'use strict';

var GUIA_S8 = (function(){

/* ═══════════ TEXTOS DE LECTURA ═══════════ */
var TEXTOS = [
{id:'t1', tipo:'Narrativo', titulo:'El recreo invisible',
texto:'<p>Martín llegó al patio y se sentó en la banca del rincón, como todos los días. No era que los demás lo rechazaran; simplemente no lo veían. Era como si ocupara un espacio que nadie registraba, una silla vacía en medio del ruido.</p><p>Un día, encontró un cuaderno olvidado bajo la banca. Tenía dibujos de naves espaciales y planetas inventados. En la última página, alguien había escrito: <em>"Si encuentras esto, dibuja algo y déjalo aquí"</em>. Martín dibujó un astronauta solo en la luna, mirando la Tierra.</p><p>Al día siguiente, el cuaderno tenía una respuesta: otro astronauta, flotando hacia el primero. Y una nota: <em>"Nadie debería estar solo en el espacio"</em>. Martín sonrió por primera vez en semanas. Siguieron intercambiando dibujos durante un mes, sin saber quién era el otro. Hasta que una tarde, una chica de pelo corto se sentó a su lado y dijo: "¿Eres el astronauta de la luna?".</p><p>Martín asintió. Ella extendió la mano. "Yo soy la que flota. Me llamo Sofía". Desde ese día, la banca del rincón dejó de ser invisible.</p>'},
{id:'t2', tipo:'Informativo', titulo:'El efecto del sueño en el aprendizaje',
texto:'<p>Según un estudio publicado por la Universidad de Chile en 2023, los adolescentes chilenos duermen en promedio 6,2 horas por noche, cifra significativamente inferior a las 8-10 horas recomendadas por la Organización Mundial de la Salud para la franja etaria de 13 a 17 años.</p><p>La investigación, que analizó los hábitos de 4.500 estudiantes de enseñanza media, reveló que quienes dormían menos de 6 horas presentaban un rendimiento un 23% inferior en pruebas de comprensión lectora respecto a quienes alcanzaban las 8 horas. Los investigadores atribuyen esta diferencia al papel del sueño en la consolidación de la memoria: durante la fase REM, el cerebro reorganiza la información aprendida durante el día, fortaleciendo las conexiones neuronales.</p><p>El doctor Alejandro Pérez, líder del estudio, advirtió: <em>"No se trata solo de cantidad de horas, sino de calidad. El uso de pantallas antes de dormir reduce la producción de melatonina, retrasando el inicio del sueño profundo"</em>. El estudio recomienda establecer una rutina sin dispositivos electrónicos al menos 30 minutos antes de acostarse.</p>'},
{id:'t3', tipo:'Argumentativo', titulo:'¿Debería prohibirse el celular en el aula?',
texto:'<p>El debate sobre el uso del celular en las salas de clase se ha intensificado en los últimos años. Mientras algunos educadores defienden su prohibición total, otros argumentan que se trata de una herramienta que, bien utilizada, puede potenciar el aprendizaje.</p><p>Quienes abogan por la prohibición señalan que el celular genera distracción constante. Un informe de la UNESCO (2023) indica que incluso la mera presencia de un teléfono sobre el escritorio reduce la capacidad de concentración en un 15%, aunque no se utilice. Además, el acceso a redes sociales durante la clase fragmenta la atención y dificulta la comprensión de textos extensos.</p><p>Sin embargo, los defensores de su uso regulado sostienen que prohibirlo equivale a ignorar la realidad tecnológica. El celular permite acceder a diccionarios, investigar en tiempo real y usar aplicaciones educativas. La profesora Marcela Ríos, del Liceo de Aplicación, afirma: <em>"El problema no es el dispositivo, sino la falta de normas claras sobre cuándo y cómo usarlo"</em>.</p><p>En mi opinión, la solución no pasa por prohibir ni por permitir sin límites, sino por educar en el uso responsable. Los estudiantes necesitan aprender a gestionar su atención en un mundo saturado de estímulos, y esa habilidad no se desarrolla eliminando la fuente de distracción, sino aprendiendo a convivir con ella.</p>'}
];

/* ═══════════ PREGUNTAS SIMCE POR TEXTO ═══════════ */
var PREGUNTAS = [
// --- Texto 1: El recreo invisible ---
{textoIdx:0, q:'¿Por qué Martín se sentaba siempre en la banca del rincón?', skill:'LOC',
opts:['Porque los demás estudiantes lo molestaban y prefería estar alejado del grupo.',
'Porque no era visto por los demás; ocupaba un espacio que nadie registraba.',
'Porque le gustaba leer solo y necesitaba silencio para concentrarse mejor.',
'Porque la profesora le había asignado ese lugar como castigo disciplinario.'],
correct:1, explain:'El texto dice "no lo veían" y era "como una silla vacía". A inventa bullying, C inventa lectura, D inventa castigo.'},

{textoIdx:0, q:'El cuaderno con dibujos de naves espaciales funciona en el relato como:', skill:'INF',
opts:['Un objeto perdido que genera un conflicto entre Martín y su dueño original.',
'Un símbolo de la necesidad de conexión humana y un puente entre dos personas solitarias.',
'Una distracción que impide a Martín integrarse normalmente con sus compañeros de clase.',
'Una evidencia de que alguien estaba copiando los dibujos de Martín sin su permiso.'],
correct:1, explain:'El cuaderno conecta a dos personas invisibles. A inventa conflicto, C contradice la trama, D inventa copia.'},

{textoIdx:0, q:'¿Qué se puede inferir sobre Sofía antes de conocer a Martín?', skill:'INF',
opts:['Que era la estudiante más popular del curso y buscaba nuevos amigos por diversión.',
'Que probablemente también se sentía sola, ya que dejó el cuaderno como forma de conexión.',
'Que era una artista profesional que vendía sus dibujos de naves espaciales en internet.',
'Que conocía la identidad de Martín desde el principio pero decidió no revelarse antes.'],
correct:1, explain:'"Nadie debería estar solo en el espacio" revela empatía desde la experiencia propia. A, C y D inventan.'},

{textoIdx:0, q:'La frase "la banca del rincón dejó de ser invisible" significa que:', skill:'INF',
opts:['El colegio pintó la banca de un color más llamativo para que los estudiantes la notaran.',
'El espacio que antes nadie registraba ahora tiene presencia porque está habitado por una conexión real.',
'Los profesores decidieron mover la banca a un lugar más céntrico del patio del colegio.',
'Martín dejó de ir al patio porque prefirió quedarse en la sala de clases durante el recreo.'],
correct:1, explain:'Es metáfora: la banca "existe" ahora porque Martín ya no está solo. A, C y D literalizan.'},

// --- Texto 2: Sueño y aprendizaje ---
{textoIdx:1, q:'Según el estudio, ¿cuántas horas duermen en promedio los adolescentes chilenos?', skill:'LOC',
opts:['Entre 8 y 10 horas por noche, cumpliendo con las recomendaciones de la OMS.',
'6,2 horas por noche, cifra inferior a lo recomendado por la OMS.',
'Menos de 5 horas por noche debido al uso excesivo de dispositivos electrónicos.',
'7,5 horas por noche, una cifra cercana pero insuficiente según los investigadores.'],
correct:1, explain:'Dato textual: "6,2 horas por noche". A es la recomendación, no el promedio. C y D inventan cifras.'},

{textoIdx:1, q:'¿Qué función cumple la fase REM en relación con el aprendizaje?', skill:'LOC',
opts:['Permite que el cuerpo descanse físicamente después de actividades deportivas intensas.',
'El cerebro reorganiza la información aprendida y fortalece las conexiones neuronales.',
'Genera sueños que ayudan a los adolescentes a resolver problemas emocionales complejos.',
'Reduce el estrés acumulado durante el día para mejorar el estado de ánimo general.'],
correct:1, explain:'Textual: "durante la fase REM, el cerebro reorganiza la información". A, C y D inventan funciones.'},

{textoIdx:1, q:'Cuando el doctor Pérez dice que "no se trata solo de cantidad sino de calidad", quiere decir que:', skill:'INF',
opts:['Dormir muchas horas es perjudicial y los adolescentes deberían dormir menos tiempo.',
'Dormir suficientes horas no basta si las condiciones impiden alcanzar un sueño profundo y reparador.',
'La calidad de la cama y las almohadas es más importante que las horas de sueño totales.',
'Los adolescentes necesitan tomar medicamentos para mejorar la calidad de su descanso.'],
correct:1, explain:'Las pantallas reducen melatonina → sueño de mala calidad aunque duren horas. A contradice, C y D inventan.'},

// --- Texto 3: Celular en el aula ---
{textoIdx:2, q:'¿Cuál es la posición del autor sobre el uso del celular en clases?', skill:'LOC',
opts:['Está completamente a favor de prohibir los celulares en todas las salas de clase.',
'Propone educar en el uso responsable en vez de prohibir o permitir sin límites.',
'Defiende el uso libre del celular porque es una herramienta educativa indispensable.',
'No tiene una posición clara y deja la decisión en manos de cada establecimiento.'],
correct:1, explain:'Textual: "la solución no pasa por prohibir ni por permitir sin límites, sino por educar". A, C y D distorsionan.'},

{textoIdx:2, q:'El dato de la UNESCO sobre la "mera presencia" del celular se usa para:', skill:'REF',
opts:['Demostrar que todos los informes internacionales apoyan la prohibición total del celular.',
'Evidenciar que la distracción ocurre incluso sin usar el teléfono, fortaleciendo el argumento de la prohibición.',
'Criticar a la UNESCO por realizar estudios que no consideran la realidad de los estudiantes.',
'Sugerir que los estudiantes deberían dejar sus celulares en la dirección del colegio.'],
correct:1, explain:'El dato refuerza la tesis de quienes piden prohibición: ni siquiera hay que usarlo para distraerse.'},

{textoIdx:2, q:'La profesora Ríos dice "el problema no es el dispositivo, sino la falta de normas". ¿Qué tipo de argumento utiliza?', skill:'REF',
opts:['Un argumento basado en estadísticas y datos numéricos de investigaciones científicas.',
'Un argumento que desplaza la causa del problema del objeto a la gestión humana del objeto.',
'Un argumento emocional que apela a la nostalgia por una época sin tecnología moderna.',
'Un argumento de autoridad basado en su cargo como directora del establecimiento educativo.'],
correct:1, explain:'Ríos redefine el problema: no es el celular (objeto) sino cómo se regula (gestión). A, C y D no aplican.'}
];

/* ═══════════ TALLER DE EVIDENCIA (15 ejercicios) ═══════════ */
var EVIDENCIA = [
// Texto 1 (5 ejercicios)
{textoIdx:0, pregunta:'¿Cómo se sentía Martín antes de encontrar el cuaderno?',
opciones:['Enojado con sus compañeros','Invisible y solo','Feliz de estar tranquilo','Asustado por el patio','Aburrido de las clases','Orgulloso de su independencia'],
correcta:1, evidencia:'"No lo veían... como una silla vacía en medio del ruido"'},

{textoIdx:0, pregunta:'¿Qué motivó a Martín a dibujar en el cuaderno?',
opciones:['Un profesor se lo pidió','La instrucción escrita en la última página','Quería impresionar a Sofía','Necesitaba hacer una tarea','Le gustaba el arte abstracto','Buscaba al dueño del cuaderno'],
correcta:1, evidencia:'"Si encuentras esto, dibuja algo y déjalo aquí"'},

{textoIdx:0, pregunta:'¿Qué dibujó Martín la primera vez?',
opciones:['Una nave espacial gigante','Un planeta inventado','Un astronauta solo en la luna mirando la Tierra','Dos personas conversando','Un cohete despegando','Una estrella fugaz'],
correcta:2, evidencia:'"Martín dibujó un astronauta solo en la luna, mirando la Tierra"'},

{textoIdx:0, pregunta:'¿Cuánto tiempo duraron los intercambios de dibujos?',
opciones:['Una semana','Tres días','Un semestre completo','Un mes','Dos meses','Todo el año'],
correcta:3, evidencia:'"Siguieron intercambiando dibujos durante un mes"'},

{textoIdx:0, pregunta:'¿Qué evidencia textual indica que Martín estaba triste antes?',
opciones:['Lloraba todos los días','Sonrió por primera vez en semanas','Se quejaba con los profesores','Escribió una carta de reclamo','No quería ir al colegio','Peleaba con otros niños'],
correcta:1, evidencia:'"Martín sonrió por primera vez en semanas"'},

// Texto 2 (5 ejercicios)
{textoIdx:1, pregunta:'¿Cuál es la diferencia de rendimiento entre los que duermen poco y los que duermen bien?',
opciones:['10% inferior','15% inferior','23% inferior','30% inferior','50% inferior','No hay diferencia'],
correcta:2, evidencia:'"rendimiento un 23% inferior en pruebas de comprensión lectora"'},

{textoIdx:1, pregunta:'¿Qué reduce la producción de melatonina según el texto?',
opciones:['El café antes de dormir','El ejercicio nocturno','El uso de pantallas antes de dormir','Las preocupaciones escolares','La temperatura de la habitación','La comida pesada'],
correcta:2, evidencia:'"El uso de pantallas antes de dormir reduce la producción de melatonina"'},

{textoIdx:1, pregunta:'¿Cuántos estudiantes participaron en el estudio?',
opciones:['1.500','2.000','3.200','4.500','5.000','10.000'],
correcta:3, evidencia:'"analizó los hábitos de 4.500 estudiantes de enseñanza media"'},

{textoIdx:1, pregunta:'¿Qué recomienda el estudio para mejorar el sueño?',
opciones:['Tomar pastillas para dormir','Hacer ejercicio intenso','Dejar dispositivos 30 min antes de acostarse','Comer algo liviano','Leer un libro de papel','Escuchar música relajante'],
correcta:2, evidencia:'"rutina sin dispositivos electrónicos al menos 30 minutos antes de acostarse"'},

{textoIdx:1, pregunta:'¿Qué institución internacional estableció la recomendación de horas de sueño?',
opciones:['UNICEF','UNESCO','La Universidad de Chile','La OMS','El Ministerio de Salud','La ONU'],
correcta:3, evidencia:'"8-10 horas recomendadas por la Organización Mundial de la Salud"'},

// Texto 3 (5 ejercicios)
{textoIdx:2, pregunta:'¿En cuánto reduce la concentración la sola presencia del celular según la UNESCO?',
opciones:['5%','10%','15%','20%','25%','30%'],
correcta:2, evidencia:'"reduce la capacidad de concentración en un 15%, aunque no se utilice"'},

{textoIdx:2, pregunta:'¿Qué argumento usan quienes defienden el uso regulado del celular?',
opciones:['Que los celulares son baratos','Que permite acceder a diccionarios e investigar','Que los estudiantes se aburren sin celular','Que los padres lo exigen','Que es obligatorio por ley','Que mejora la disciplina'],
correcta:1, evidencia:'"permite acceder a diccionarios, investigar en tiempo real y usar aplicaciones educativas"'},

{textoIdx:2, pregunta:'¿Dónde trabaja la profesora Marcela Ríos?',
opciones:['Universidad de Chile','Colegio San José','Liceo de Aplicación','Ministerio de Educación','UNESCO','Instituto Nacional'],
correcta:2, evidencia:'"La profesora Marcela Ríos, del Liceo de Aplicación"'},

{textoIdx:2, pregunta:'Según el autor, ¿qué habilidad necesitan desarrollar los estudiantes?',
opciones:['Memorizar más contenido','Escribir más rápido','Gestionar su atención ante estímulos','Usar mejor las redes sociales','Leer libros más extensos','Hablar en público'],
correcta:2, evidencia:'"necesitan aprender a gestionar su atención en un mundo saturado de estímulos"'},

{textoIdx:2, pregunta:'¿Qué efecto tienen las redes sociales durante la clase según el texto?',
opciones:['Mejoran la creatividad','Facilitan el trabajo grupal','Fragmentan la atención y dificultan la comprensión','Aumentan la motivación','No tienen ningún efecto','Generan conflictos entre estudiantes'],
correcta:2, evidencia:'"el acceso a redes sociales durante la clase fragmenta la atención y dificulta la comprensión"'}
];

return { TEXTOS: TEXTOS, PREGUNTAS: PREGUNTAS, EVIDENCIA: EVIDENCIA };
})();
