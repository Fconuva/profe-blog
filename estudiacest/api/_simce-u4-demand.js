'use strict';
// Juicio editorial por ítem, no calibración psicométrica ni nivel del estudiante.
// Códigos propios: E = descriptor Elemental, A = Adecuado, EC = expectativa curricular.
const rows = {
  1: [
    ['E-L','explícita','local','baja','El encargo aparece en la primera oración; las otras acciones pertenecen a episodios posteriores. No exige integrar el relato.'],
    ['A-M','implícita','dispersa','media','El padre no declara por qué devuelve la llave. Se integran el daño, el aviso a la clienta, la reparación conjunta y el gesto final; cobrar o dominar el oficio no explican esa confianza.'],
    ['E-P','implícita','próxima','baja','Escribir en primera persona que causó el daño y avisar a la clienta son claves potentes de responsabilidad en una situación familiar.'],
    ['A-F','implícita','global','media','La llave pasa de premio esperado a responsabilidad: se relacionan su entrega inicial, el error asumido y la negación final de la medalla. La interpretación literal de propiedad compite con la simbólica.'],
    ['A-R','implícita','dispersa','media','Se comparan los juicios inicial y posterior del hijo. Hay que distinguir acceso a su pensamiento de acceso a la intención no declarada del padre.'],
    ['A-R','implícita','global','media','La repetición solo se explica comparando inicio y cierre: el objeto permanece, pero cambia la relación y su significado para el narrador.'],
    ['E-L','explícita','local','baja','La cifra veinte está en el primer párrafo; los otros números no representan cantidades rivales de árboles en el texto.'],
    ['E-T','explícita','reiterada','baja','La postura se declara en el segundo párrafo y se repite al cierre. Las opciones confunden combinación con sustitución, pero no hacen imprescindible una inferencia global.'],
    ['E-C','explícita','próxima','baja','La objeción y la solución limitada con costo anual aparecen juntas. La respuesta puede obtenerse de ese párrafo sin reconstruir toda la columna.'],
    ['A-R','implícita','dispersa','media','Se relaciona el caso de los bancos vacíos con la propuesta para otra plaza; hay que reconocer una ejemplificación preventiva y no una prueba universal contra plantar.'],
    ['E-F','implícita','próxima','baja','El contraste entre árboles futuros y usuarios presentes está explicado inmediatamente antes de la expresión. Es una metáfora con fuerte apoyo local.'],
    ['A-X','implícita','próxima','media','Se detecta una generalización desde una visita y horario limitados. Es una falla argumentativa evidente, no una mera búsqueda de la hora.'],
    ['E-L','explícita','tabla','baja','Se cruza una celda de préstamos con su horario en una tabla de tres filas, con encabezados claros.'],
    ['E-L','explícita','tabla','media','Se compara una columna de tres cifras y se identifica el máximo; el número 48 pertenece a préstamos. Los encabezados reducen la demanda.'],
    ['E-C','explícita','próxima','baja','El segundo párrafo explica expresamente que se cuentan entradas y que una persona puede aparecer dos veces.'],
    ['A-C','implícita','dispersa','media','Se integran la diferencia de eventos entre semanas y el nuevo período de observación; el texto no declara con esas palabras la reducción de factores adicionales.'],
    ['A-V','implícita','global','media','Se combina el máximo de entradas con los límites sobre eventos y personas únicas. Los distractores convierten un resultado local en preferencia o causalidad general.'],
    ['E-R','explícita','tabla','baja','La organización familiar por filas y columnas permite contrastar dos conteos; la función no requiere interpretar un recurso novedoso.']
  ],
  2: [
    ['E-L','explícita','local','baja','El viento se nombra junto a los verbos mueve, esparce y desordena; no hay otro agente equivalente.'],
    ['A-F','implícita','dispersa','media','Primavera no significa estación: se integra la belleza inicial con el consejo y la transformación por la edad. El glosario no entrega juventud.'],
    ['A-F','implícita','dispersa','media','La nieve sobre la cumbre se interpreta relacionando cabello, edad y marchitamiento; debe descartarse la lectura de un paisaje real.'],
    ['A-T','implícita','global','media','La idea central vincula descripción y exhortación; los paisajes literales compiten con el sentido temporal de la belleza humana.'],
    ['E-C','explícita','próxima','baja','La mudanza por la edad está expresada en el terceto final. Una vez interpretado el poema, el motivo de no aplazar tiene una clave fuerte.'],
    ['A-R','implícita','global','media','Se reconoce la función de la organización de cuartetos y tercetos, vinculando la descripción presente con el consejo, sin evaluar métrica.'],
    ['A-L','explícita','local','media','Debe distinguirse la fecha de grabación de la apertura, el inicio del proyecto y una apertura futura; hay varias referencias temporales.'],
    ['E-C','explícita','próxima','baja','La exclusión por identidad dudosa y las cintas en revisión están explicadas en párrafos próximos; las alternativas restantes carecen de respaldo.'],
    ['E-F','explícita','próxima','baja','La propia cita opone reconocer un vacío a llenarlo con suposición; el texto ofrece la interpretación de la expresión.'],
    ['A-R','implícita','dispersa','media','Se relaciona la experiencia de Campos con la recuperación del archivo; el testimonio muestra un efecto, no verifica todas las identidades.'],
    ['E-T','explícita','local','baja','Considera introduce una valoración y puerta la marca como metáfora. No se necesita integrar noticias rivales ni demostrar su verdad.'],
    ['A-V','implícita','global','media','Se selecciona un titular que respete apertura parcial y pendientes. La idea de recuperación total compite con logros reales descritos en distintos párrafos.'],
    ['E-L','explícita','local','baja','El cambio del lunes está declarado al cierre; la consigna orienta a ese episodio y no ofrece dos cambios equivalentes.'],
    ['E-L','explícita','local','media','La mujer de delante entrega naranjas; hay varios pasajeros, pero el enunciado reproduce el objeto y la acción para localizar una frase.'],
    ['A-M','implícita','dispersa','media','La corrección de indiferencia se entiende a partir de recuerdos y gestos distribuidos; ausencia de ceremonia no significa ausencia de vínculos.'],
    ['E-F','implícita','próxima','baja','Las personas ausentes se vinculan al recuerdo del abuelo en el mismo párrafo; la expresión tiene una clave inmediata.'],
    ['A-R','implícita','global','media','La media hora se valora respecto del recorrido suspendido y del cierre sobre efectos cotidianos; se distingue su función de un retraso del viaje.'],
    ['A-V','implícita','global','media','Se evalúa la revisión de una impresión mediante observaciones del viaje; las opciones rivales imponen silencio uniforme o una ceremonia inventada.']
  ],
  3: [
    ['E-L','explícita','reiterada','baja','El contexto nombra a Creonte como gobernante y autor del decreto; la escena reitera esa atribución. Coro y guardia no dictan la prohibición.'],
    ['E-T','explícita','reiterada','baja','El contexto y los parlamentos presentan con claridad sepultura y decreto. La oposición se repite, sin un conflicto secundario igualmente plausible.'],
    ['E-M','explícita','local','baja','Antígona explica directamente que no desea morir pero no puede abandonar el rito debido a su hermano.'],
    ['E-M','explícita','local','baja','Creonte dice expresamente que la autoridad parecería inclinarse si no castiga. El hecho de preguntar por una preocupación no vuelve implícita la respuesta.'],
    ['A-F','implícita','dispersa','media','La afirmación final se relaciona con dos explicaciones rivales del silencio del coro: acuerdo o temor. Se integra el intercambio previo, no solo la frase aislada.'],
    ['A-R','implícita','global','media','El silencio final, la orden inalterada y la imagen de la puerta sostienen tensión no resuelta; no demuestran una votación o absolución.'],
    ['A-L','explícita','local','media','Debe discriminar siete pendientes de dieciocho reparados, cinco derivados y doce integrantes, sin convertir conteos en cálculo.'],
    ['A-T','implícita','global','media','Se integran ayuda, aprendizaje y protocolos de seguridad; reducir el reportaje a reparación o ventas deja fuera aspectos centrales.'],
    ['E-C','explícita','próxima','baja','El cable dañado y la pieza por comprar explican en el mismo párrafo la condición pendiente.'],
    ['A-R','implícita','dispersa','media','El juicio técnico de Soto limita la reparación indiscriminada y se conecta con la derivación; no reemplaza las fichas ni prueba atención incorrecta de todos.'],
    ['E-L','explícita','local','baja','El reportaje dice que no existe un registro para medir cuánto aprenden los asistentes. La tarea es localizar un límite expresado, aunque esté bajo Interpretar.'],
    ['A-R','implícita','global','media','El contraste final se interpreta mediante la lámpara, el protocolo y el criterio de seguridad. No encender también puede ser valioso, aunque no sume una reparación.'],
    ['E-L','explícita','local','baja','Los tres cursos sin número están mencionados en el primer párrafo; no hay una cifra alternativa de cursos.'],
    ['E-L','explícita','local','baja','El ensayo para quienes no han actuado se declara en el segundo párrafo y coincide con la acción consultada.'],
    ['E-T','explícita','reiterada','baja','Convocatoria, criterios y apoyo aparecen como propuesta explícita al inicio y al cierre. No hace falta inferir una tesis oculta.'],
    ['E-C','explícita','próxima','baja','Temor y respuesta de plazo, ficha y comisión están juntos en el cuarto párrafo. No requiere reconstruir la convocatoria desde otras partes del discurso.'],
    ['A-R','implícita','global','media','La pregunta retórica debe vincularse con selección y representatividad: invita a revisar qué voces se escuchan, no a nombrar el colegio.'],
    ['E-V','explícita','próxima','baja','El texto ya explica que sería equivocado convertir el caso individual en cifra general; identificar esa razón no exige descubrir la falla.']
  ],
  4: [
    ['E-L','explícita','local','baja','Ocho años antes se encuentra junto al episodio de la panadería; la consigna conduce al recuerdo concreto.'],
    ['E-S','explícita','próxima','baja','La narración explica el prejuicio con vivir lejos equivalía a saber menos. El estereotipo no queda oculto entre posiciones rivales.'],
    ['A-C','implícita','dispersa','media','Se relacionan el relato del laberinto y la experiencia de la entrevista: la ayuda orienta, pero no garantiza el resultado.'],
    ['A-M','implícita','dispersa','media','Se conectan la reacción al prejuicio, la decisión de preguntar por tareas y el ejemplo del taller; los distractores confunden respuesta pertinente con evasión.'],
    ['A-H','implícita','global','media','La contratación incierta, el origen y la respuesta desde la experiencia sostienen el reconocimiento ante el prejuicio; empleo y familia no son una elección excluyente.'],
    ['A-R','implícita','dispersa','media','El recuerdo explica el carrete inicial y la ayuda que Marina resignifica al final. No anticipa si obtendrá el cargo.'],
    ['A-L','explícita','local','media','Las seis, seis y media, seis y cuarenta y siete tienen referentes distintos; debe localizarse la salida de la micro entre horarios similares.'],
    ['E-T','explícita','reiterada','baja','La carta declara que valora la ampliación y pide considerar el transporte. La intención se repite con varias negaciones que ayudan a descartar opciones.'],
    ['E-C','explícita','próxima','baja','Se relacionan salida de la última micro y fin del control en un mismo párrafo; la dificultad de regreso resulta evidente.'],
    ['A-R','implícita','dispersa','media','La concesión delimita lo que se pide al consultorio y se enlaza con una propuesta viable; reconocer el límite no equivale a retirar la petición.'],
    ['E-F','implícita','próxima','baja','La puerta está inmediatamente asociada a la extensión y a llegar hasta ella: una metáfora familiar y explicada por su contexto.'],
    ['E-V','explícita','local','baja','La autora declara que localizar un punto no garantiza llegar y regresar. La tarea recupera ese límite puntual.'],
    ['E-L','explícita','local','baja','El contador de minutos está en la primera oración descriptiva de la aplicación; no hay mediciones rivales atribuidas a ella.'],
    ['E-L','explícita','local','baja','La conversación breve se enuncia directamente como propuesta de la profesora. Las medallas pertenecen al sistema que ella propone complementar.'],
    ['E-T','explícita','reiterada','baja','La distinción tiempo/comprensión está formulada de manera explícita y reiterada; la postura no depende de información implícita.'],
    ['A-F','implícita','próxima','media','La disciplina de espera es una ironía: el supuesto mérito choca con las sopas evaporadas; debe evitarse leer la expresión como elogio literal.'],
    ['EC-V','implícita','dos textos','media','Se comparan juicios sobre origen y minutos con la posibilidad de demostrar capacidades. La propiedad común debe abstraerse de dos géneros y los otros rasgos solo aparecen en uno.'],
    ['E-F','implícita','próxima','baja','Bajarlo del podio se interpreta con la negación inmediata de abandonar el registro y la propuesta explícita de usarlo como herramienta.']
  ],
  5: [
    ['E-L','explícita','local','media','Madreselvas aparece junto a tapias; aves y flores están en estrofas próximas, pero se reconoce una relación literal directa.'],
    ['A-T','implícita','global','media','Se integran las alternancias de ciclos y los casos particulares: repetición natural no equivale a recuperar la misma experiencia amorosa.'],
    ['A-M','implícita','dispersa','media','Dicha evocada, lágrimas y afirmación final permiten inferir dolor y singularidad; no basta aislar una palabra para fijar el tono completo.'],
    ['A-T','implícita','global','media','El tema reúne aves, flores y amor; leer un jardín literal o una observación de aves pierde el contraste que organiza todas las estrofas.'],
    ['E-F','implícita','próxima','baja','La comparación con adorar se acompaña de mudo, absorto y de rodillas. Son claves potentes para reverencia; el glosario ayuda con absorto.'],
    ['A-R','implícita','global','media','La alternancia debe examinarse en varias estrofas para reconocer su efecto de oposición entre retornos y experiencias singulares.'],
    ['A-L','explícita','local','media','Humedad cambia mientras tipo, cantidad, sala y luz se mantienen semejantes; hay que discriminar variables nombradas en el experimento.'],
    ['E-T','explícita','reiterada','baja','El párrafo anuncia el recorrido y la tabla lo repite por etapas. No hay una segunda secuencia competitiva que integrar.'],
    ['E-F','explícita','local','baja','El propio artículo explica transportistas y niega intención de cultivar. La metáfora no exige una interpretación autónoma.'],
    ['A-R','implícita','dispersa','media','Se infiere la función de mantener variables semejantes relacionando diseño y límites del ensayo; no se pregunta ciencia fuera del artículo.'],
    ['E-C','explícita','local','baja','El último párrafo dice que germinar no demuestra llegar a adulta. La conclusión se expresa antes de la pregunta.'],
    ['E-V','explícita','reiterada','baja','La conclusión local sobre humedad y brotes ya se formula y se limita en el artículo; los distractores introducen garantías expresamente negadas.'],
    ['E-L','explícita','local','media','Revisión gratuita y repuestos no incluidos están juntos. Se distingue servicio de material con una clave explícita fuerte.'],
    ['E-L','explícita','reiterada','baja','Doce casos se anuncia en el afiche y se repite en la respuesta de la agrupación; no se confunde con las horas.'],
    ['E-T','explícita','próxima','baja','El destinatario se obtiene de la invitación a revisar mochilas y bolsos; los otros grupos no son destinatarios equivalentes.'],
    ['E-R','implícita','próxima','baja','Pregunta y dos destinos se describen verbalmente. Reconocer el propósito es familiar; falta la imagen real para medir lectura visual.'],
    ['A-X','implícita','próxima','media','Se detecta el salto desde una mochila reparada a resolver toda la basura del barrio; el error no se explica por adelantado en el estímulo.'],
    ['E-V','explícita','próxima','media','Se evalúa la crítica con la condición puntual del afiche: revisión gratuita no significa repuestos gratis. No exige comparar sentidos globales.']
  ]
};
const levels={E:'Elemental',A:'Adecuado',EC:'Expectativa curricular'};
function apply(exams) {
  exams.forEach(exam=>exam.texts.forEach(text=>text.questions.forEach(q=>{
    const row=rows[exam.number][Number(q.id.slice(1))-1];
    if(!row)throw Error(`Falta auditoría de E${exam.number} ${q.id}`);
    const [descriptor,support,distance,competition,rationale]=row;
    const band=descriptor.split('-')[0];
    q.demand=`${levels[band]}: demanda prevista por análisis del ítem`;
    const operation=descriptor.split('-')[1];
    const assessedSkill=operation==='L'?'LOCALIZAR':['V','R','X'].includes(operation)?'REFLEXIONAR':'INTERPRETAR';
    if(q.skill!==assessedSkill){q.previousSkill=q.skill;q.skill=assessedSkill;}
    q.demandAudit={descriptor,level:levels[band],assessedSkill,support,distance,competition,rationale,
      sourcePages:band==='EC'?'17':'15–16 y 47–49',
      familiarity:'Juicio contextual para NM2; confirmar familiaridad real del curso en la aplicación.',
      calibration:'Juicio editorial, sin pilotaje; no clasifica al estudiante.'};
  })));
}
module.exports={apply,rows};
