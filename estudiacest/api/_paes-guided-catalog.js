'use strict';

const GUIDED_GUIDE_KEYS = {
  '17': { 1:'B', 2:'D', 3:'A', 4:'C', 5:'B', 6:'D' },
  '18': { 1:'C', 2:'A', 3:'D', 4:'B', 5:'C', 6:'A' },
  '19': { 1:'B', 2:'D', 3:'A', 4:'C', 5:'B', 6:'D' },
  '20': { 1:'B', 2:'D', 3:'A', 4:'C', 5:'B', 6:'D' },
  '21': { 1:'C', 2:'A', 3:'D', 4:'B', 5:'C', 6:'A' },
  '22': { 1:'D', 2:'B', 3:'C', 4:'A', 5:'D', 6:'B' },
  '23': { 1:'A', 2:'C', 3:'B', 4:'D', 5:'A', 6:'C' },
  '24': { 1:'B', 2:'D', 3:'A', 4:'C', 5:'B', 6:'D' },
  '25': { 1:'C', 2:'A', 3:'D', 4:'B', 5:'C', 6:'A' },
  '26': { 1:'D', 2:'B', 3:'C', 4:'A', 5:'D', 6:'B' },
  '27': { 1:'A', 2:'C', 3:'B', 4:'D', 5:'A', 6:'C' },
  '28': { 1:'B', 2:'D', 3:'A', 4:'C', 5:'B', 6:'D' },
  '29': { 1:'C', 2:'A', 3:'D', 4:'C', 5:'B', 6:'C' },
  '30': { 1:'D', 2:'B', 3:'C', 4:'A', 5:'D', 6:'B' },
  '31': { 1:'A', 2:'C', 3:'B', 4:'D', 5:'A', 6:'B' }
};

const GUIDED_GUIDE_FEEDBACK = {
  '17': {
    1:'El primer párrafo indica que los vecinos usaban el paraguas para acompañar hasta el bus a quienes llegaban sin protección.',
    2:'Martín llega antes para revisar el paraguas y luego lo busca cuando desaparece la banca. Ambas acciones muestran un cuidado que él no reconoce en voz alta.',
    3:'Martín se relaja después de comprobar que el paraguas está guardado y conserva la etiqueta que explica su uso comunitario.',
    4:'El cuidado primero es secreto; al final queda organizado mediante una caja y una instrucción visible para todo el barrio.',
    5:'Martín llega antes para revisar el paraguas y se relaja cuando comprueba que está protegido. Las dos pistas muestran que el objeto le importa personalmente.',
    6:'Las acciones de Martín muestran que una ayuda discreta puede mantenerse y organizarse para beneficiar a otras personas.'
  },
  '18': {
    1:'El texto reconoce explícitamente que el silencio reduce interrupciones y permite concentrarse en una lectura extensa.',
    2:'“Sin embargo” no borra la ventaja anterior: introduce el límite de aplicar el silencio como única regla.',
    3:'La propuesta central es organizar zonas distintas para que la concentración individual y la colaboración puedan convivir.',
    4:'Los casos del tercer párrafo demuestran que conversar también puede ser parte de una actividad de comprensión.',
    5:'El emisor valora el silencio cuando protege el aprendizaje, pero rechaza que se aplique de manera absoluta.',
    6:'El mejor respaldo debe comprobar las dos partes de la propuesta: concentración en una zona y colaboración efectiva en la otra.'
  },
  '19': {
    1:'El segundo párrafo muestra apoyos concretos: mesas, agua y un cartel con horarios. Esos cambios vuelven claro y habitable el espacio.',
    2:'La sombra no recibe literalmente a las personas: les ofrece protección frente al calor y un lugar donde pueden esperar o permanecer.',
    3:'La directora no rechaza la propuesta. La acepta con cautela y agrega la condición de conservar momentos sin actividades programadas.',
    4:'El párrafo explica que ya no era necesario dirigir cada encuentro. Por eso “fluido” significa natural y con menos intervención externa.',
    5:'El último párrafo limita el aporte: no resuelve la falta de áreas verdes, pero ofrece durante algunas horas un espacio gratuito y abierto.',
    6:'El texto reúne cuidado material y libertad de uso. El patio facilita los encuentros sin obligar a las personas a participar en un programa.'
  },
  '20': {
    1:'Ambos textos defienden un espacio que admita distintas maneras de participar. Difieren en cuánto debe programarse, no en ese propósito común.',
    2:'El Texto A valora el uso sin programa previo. El Texto B agrega que algunas actividades pueden invitar a quienes todavía no se acercan.',
    3:'Los ejemplos del Texto A muestran que “sin guion” significa poder elegir cómo permanecer en la plaza sin seguir una actividad organizada.',
    4:'La última oración reúne las dos partes de la postura: invitaciones concretas y libertad para no participar.',
    5:'Los textos se complementan porque buscan inclusión, pero mantienen una tensión sobre el lugar que debe ocupar la programación.',
    6:'La decisión integra condiciones cómodas, algunas actividades de entrada y tiempos libres; no elimina ninguna de las dos perspectivas.'
  },
  '21': {
    1:'El Texto 1 indica que Elena guardó las dos frases y dejó una hoja nueva, lo que permitió continuar el intercambio.',
    2:'Elena reconoce al posible autor, pero evita exponerlo: demora el cierre para darle tiempo y conserva el carácter voluntario del diálogo.',
    3:'La hoja vacía mantiene abierta la posibilidad de comunicarse sin exigir que alguien responda o revele su identidad.',
    4:'La norma exige renovar el registro cuando el objeto se necesita en una clase posterior al periodo inicial de préstamo.',
    5:'Informar una falla no recibe sanción; ocultarla sí restringe préstamos. La regla promueve un aviso honesto y oportuno.',
    6:'Las dos lecturas exigen distinguir acciones, condiciones e indicios concretos antes de seleccionar una interpretación.'
  },
  '22': {
    1:'El segundo párrafo aclara que solo el acceso lateral tenía una cadena provisional; la puerta principal y los talleres siguieron funcionando.',
    2:'La fotografía existía y mostraba una situación real, pero incompleta. Llamarla falsa confunde falta de contexto con fabricación.',
    3:'La señalización insuficiente y la aclaración tardía influyeron, aunque el texto también menciona la difusión sin verificación.',
    4:'El último párrafo limita el alcance a ciertas condiciones. No convierte el caso en una regla sobre todas las redes o instituciones.',
    5:'La crónica analiza cómo un rumor local se volvió creíble y qué medidas pueden reducir la repetición del problema.',
    6:'El distractor convincente suele conservar un dato verdadero y alterar su alcance, foco o relación con otros hechos.'
  },
  '23': {
    1:'El primer párrafo registra dos resultados acotados: mayor asistencia en los días prácticos y mejor desempeño en una actividad específica.',
    2:'Sin un grupo comparable que estudiara el mismo contenido sin huerto, no puede atribuirse la diferencia únicamente al proyecto.',
    3:'La encuesta demuestra una preferencia declarada por algunas actividades prácticas; no prueba por sí sola una mejora general del aprendizaje.',
    4:'Medir más cursos antes y después, durante más tiempo y con comparación, responde directamente a los límites del proyecto piloto.',
    5:'La conclusión conserva lo observado en esos cursos y reconoce que todavía se necesita investigación para ampliar su alcance.',
    6:'Los datos se relacionan con la afirmación, pero la escala pequeña y la falta de comparación obligan a formularla con prudencia.'
  },
  '24': {
    1:'La fila de sala silenciosa muestra 24/24 el martes. Solo esa celda indica que se usaron todos los cupos disponibles.',
    2:'La nota explica que la sala grupal se reserva por equipo; por eso 6/6 cuenta reservas y no personas individuales.',
    3:'La última nota informa una extensión hasta las 19:00 el miércoles debido a una actividad comunal.',
    4:'Veinte minutos superan los quince de tolerancia. La norma indica que el turno pasa a la lista de espera.',
    5:'El miércoles reúne seis de seis reservas grupales y cuarenta y dos préstamos, los máximos de esas dos filas.',
    6:'Los encabezados indican qué se cuenta y las notas agregan condiciones. Sin ellos, un número puede interpretarse de manera equivocada.'
  },
  '25': {
    1:'El último párrafo indica que Mara abre la mano y entrega también la llave pequeña después de unos segundos de duda.',
    2:'La llave y los recuerdos de la azotea muestran que su vacilación corresponde a la dificultad de cerrar una etapa personal.',
    3:'La puerta sigue abierta, pero Mara ya entregó la llave. La imagen sugiere continuidad del lugar fuera de su control.',
    4:'El Texto 2 sostiene que información y repuestos razonables amplían las opciones frente a una falla del equipo.',
    5:'El tercer párrafo reconoce riesgos y propone condiciones de seguridad; matiza la tesis sin rechazarla.',
    6:'El derecho amplía opciones, pero no garantiza que cualquier persona realice correctamente todas las reparaciones.'
  },
  '26': {
    1:'La fila 2 dice que Mateo convirtió una coincidencia en causa directa. Ese es el error de causalidad inventada.',
    2:'Nombrar primero la fila y la columna evita tomar un dato cercano que pertenece a otra categoría de la tabla.',
    3:'La fila 3 exige distinguir lo aceptado de la condición agregada. Así se conserva el matiz real de la postura.',
    4:'“Leer mejor” no identifica qué falló ni define una conducta verificable para una pregunta futura.',
    5:'Antes de generalizar, debe comprobarse cuántos casos cubre la evidencia y hasta dónde permite extender la conclusión.',
    6:'Hay transferencia cuando el patrón de error se convierte en una acción concreta que puede usarse en otra pregunta semejante.'
  },
  '27': {
    1:'El primer párrafo dice que el hilo permitía reconocer la chaqueta entre las prendas amontonadas después del recreo.',
    2:'Tomás reconoce el gesto de cuidado asociado al hilo y lo acepta sin forzar una explicación sobre quién lo realizó.',
    3:'Guardar la tijera conserva la marca que conecta el abrigo presente con el cuidado recibido desde la infancia.',
    4:'La omisión permite inferir una continuidad del afecto, pero evita afirmar de manera absoluta quién cosió el nuevo hilo.',
    5:'El hilo se repite en prendas de distintas etapas y concentra la idea de un cuidado que acompaña a Tomás.',
    6:'Al partir, Tomás sostiene la separación mediante un gesto de afecto que decide conservar en lugar de cortar.'
  },
  '28': {
    1:'El segundo párrafo informa que el último recorrido fue suspendido tres veces durante junio sin aviso previo.',
    2:'El panel no aumenta buses ni impide fallas; confirma la salida y reduce la incertidumbre antes de esperar.',
    3:'La crónica reconoce el valor de la información, pero mantiene la demanda de un servicio más regular.',
    4:'La campaña indica que la luz roja significa limpieza o mantención y que el equipo no debe utilizarse.',
    5:'El aviso por filtración exige el número del bebedero y aclara que no se necesitan fotografías ni datos personales.',
    6:'La crónica conecta hechos con efectos en usuarios; la campaña pide aplicar horarios, señales y condiciones concretas.'
  },
  '29': {
    1:'La fila de evaluar muestra dos aciertos de seis, el resultado más bajo entre las tres habilidades.',
    2:'Responder evaluación en 48 segundos junto con pocos aciertos y generalizaciones sugiere una decisión demasiado rápida.',
    3:'La evaluación reúne menor logro y un patrón de respuesta rápida sin revisión, por eso constituye la prioridad inicial.',
    4:'Subrayar una palabra amplia y comprobarla es una conducta específica que puede observarse durante la guía.',
    5:'El indicador registra si la estrategia se realizó y permite comprobar si disminuyó el patrón de error seleccionado.',
    6:'Un plan se revisa con nueva evidencia: aciertos, errores y aplicación de la estrategia permiten mantenerlo o ajustarlo.'
  },
  '30': {
    1:'El primer párrafo describe la rutina completa: revisar seguros, encender música y dar una vuelta con asientos vacíos.',
    2:'Óscar vuelve para realizar un cierre personal mediante una última vuelta de la rutina que sostuvo durante veinte años.',
    3:'La falta de música separa el gesto final de una jornada común y refuerza su carácter íntimo y definitivo.',
    4:'El ensayo distingue almacenar de recordar: un registro ayuda, pero una persona debe seleccionarlo y darle sentido.',
    5:'El archivo conserva una huella disponible; solo la interpretación personal puede integrarla como recuerdo.',
    6:'El texto rechaza que más archivos produzcan necesariamente mejor memoria. Acumular no equivale a comprender.'
  },
  '31': {
    1:'Antonia avanza sin abandonar la pregunta: deja una tarea concreta, comparar alcance, para su segunda vuelta.',
    2:'Benjamín detecta una omisión y regresa al párrafo indicado. Su revisión tiene un propósito textual específico.',
    3:'Carlos cambia por la repetición de una letra y no porque haya encontrado evidencia que invalide sus respuestas.',
    4:'Un cambio se justifica cuando una nueva comprobación textual permite explicar el error de la elección anterior.',
    5:'Antonia y Benjamín organizan el avance mediante una tarea de revisión concreta y ligada al texto.',
    6:'La estrategia final combina avance, marcado de dudas y revisión justificada; no exige resolver todo en el primer intento.'
  }
};

module.exports = { GUIDED_GUIDE_KEYS, GUIDED_GUIDE_FEEDBACK };
