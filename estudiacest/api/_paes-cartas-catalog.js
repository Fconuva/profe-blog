'use strict';
// El catálogo público se obtiene exclusivamente con publicActivity: las claves
// y las razones de corrección permanecen en este módulo de servidor.
const missions = [
  {
    "id": "archivo",
    "title": "El archivo perdido",
    "npc": "Inés · archivista",
    "skill": "Localizar",
    "introduction": "Una caja cambió de lugar durante la tormenta. Inés necesita reconstruir su recorrido antes de abrir una búsqueda.",
    "genre": "Carta e informe de registro",
    "paragraphs": [
      "Carta de Inés a la guardiana del bosque. La caja de semillas llegó al archivo el lunes, junto con dos paquetes de mapas. Como la sala norte tenía una filtración, dejé los mapas en la mesa de consulta y pedí a Darío que llevara la caja al depósito del puente. Le entregué una ficha azul: no indica quién es dueño de las semillas, sino que el traslado debe registrarse antes de abrir el recipiente. La caja tiene un cordón rojo; la del cordón verde contiene herramientas y no forma parte de este envío.",
      "El miércoles regresaré al bosque para revisar las semillas con ustedes. Hasta entonces, basta con mantener la caja en un lugar seco. Si el depósito sigue cerrado, la alternativa es la sala de lectura. No debe ir al invernadero: allí se humedecen los recipientes durante el riego. Un vecino me ofreció llevarla a su casa, pero no acepté porque un cambio de custodia sin registro dificultaría encontrarla. Les pido anotar cualquier traslado con su hora y el nombre de quien la recibe.",
      "Registro de Darío, lunes. 16:10: recibí la caja de cordón rojo y la ficha azul. 16:25: el depósito del puente estaba cerrado por reparación de la puerta. 16:40: entregué la caja a Mara, encargada de la sala de lectura. Mara firmó la recepción y guardó la caja en el armario interior. 17:05: devolví la ficha firmada al archivo. Los paquetes de mapas permanecieron en la mesa de consulta.",
      "Nota de Mara, martes. La caja sigue en el armario y no se ha abierto. Un visitante preguntó por las semillas, pero no llevaba una autorización. Le expliqué que recibir una consulta no equivale a entregar un objeto. La ficha de traslado permite conocer el recorrido; para retirar la caja, la persona responsable deberá presentar además la autorización de Inés. No hubo un nuevo traslado durante mi turno."
    ],
    "guided": [
      "Inés envió una caja de semillas con cordón rojo. Pidió llevarla al depósito del puente. Si estaba cerrado, debía quedar en la sala de lectura. No podía ir al invernadero, porque allí se humedecen los recipientes.",
      "Darío encontró cerrado el depósito. A las 16:40 entregó la caja a Mara, en la sala de lectura. Mara firmó la recepción. Guardó la caja en el armario interior. Al día siguiente, la caja seguía allí, sin abrir.",
      "La ficha azul registra el recorrido de la caja. Para retirarla se necesita otra cosa: una autorización de Inés."
    ],
    "questions": [
      [
        "¿Dónde quedó la caja al terminar el traslado registrado?",
        [
          "En la mesa de consulta del archivo.",
          "En el armario de la sala de lectura.",
          "En el depósito situado junto al puente.",
          "En el invernadero cercano a la sala."
        ],
        "B",
        "Localizar",
        "El registro de Darío y la nota de Mara coinciden: la caja quedó en el armario de la sala de lectura.",
        {
          "task": "a",
          "level": 1,
          "evidence": "Mara firmó la recepción y guardó la caja en el armario interior.",
          "failures": [
            "Cambio de objeto: la mesa conserva los mapas.",
            "",
            "Destino inicial: el depósito estaba cerrado.",
            "Contradicción: Inés excluyó el invernadero."
          ]
        }
      ],
      [
        "¿Qué exige Inés para registrar un nuevo traslado?",
        [
          "Anotar la hora y el nombre de quien recibe.",
          "Anotar la fecha y el contenido del recipiente.",
          "Registrar el nombre de quien consulta las semillas.",
          "Registrar la hora de revisión de los mapas."
        ],
        "A",
        "Localizar",
        "La carta pide la hora y el nombre de quien recibe el objeto; no exige abrirlo.",
        {
          "task": "a",
          "level": 1,
          "evidence": "Les pido anotar cualquier traslado con su hora y el nombre de quien la recibe.",
          "failures": [
            "",
            "Cambio de foco: se pide quién recibe, no el contenido.",
            "Cambio de acción: consultar no equivale a recibir.",
            "Cambio de objeto: el registro pedido corresponde a la caja."
          ]
        }
      ],
      [
        "¿Por qué Darío cambió el destino inicial de la caja?",
        [
          "Mara tenía autorización para usar el invernadero.",
          "La ficha azul exigía devolverla al archivo.",
          "Inés pidió esperar hasta su regreso del bosque.",
          "El depósito cerró y había un destino alternativo."
        ],
        "D",
        "Interpretar",
        "La carta autoriza la sala de lectura si el depósito está cerrado; el registro explica que esa condición ocurrió.",
        {
          "task": "c",
          "level": 2,
          "evidence": "Si el depósito sigue cerrado, la alternativa es la sala de lectura.",
          "failures": [
            "Invención: no se autorizó el invernadero.",
            "Contradicción: la ficha registra; no exige volver.",
            "Invención: Inés no ordenó suspender la entrega.",
            ""
          ]
        }
      ],
      [
        "¿Qué función cumple la nota de Mara respecto del registro de Darío?",
        [
          "Corrige el horario de recepción de la caja.",
          "Aclara por qué los mapas cambiaron de lugar.",
          "Confirma la permanencia de la caja registrada.",
          "Amplía el permiso de retiro al visitante."
        ],
        "C",
        "Interpretar",
        "La nota prolonga y confirma el registro de custodia, sin autorizar un retiro.",
        {
          "task": "h",
          "level": 2,
          "evidence": "La caja sigue en el armario y no se ha abierto.",
          "failures": [
            "Invención: Mara no corrige la hora del registro.",
            "Cambio de objeto: la nota se refiere a la caja.",
            "",
            "Sobregeneralización: el visitante no recibe permiso de retiro."
          ]
        }
      ],
      [
        "Un vecino afirma: «La ficha azul demuestra que el visitante puede retirar la caja». ¿Qué problema tiene su afirmación?",
        [
          "Confunde registrar el traslado con autorizar el retiro.",
          "Confunde el color de la ficha con el cordón.",
          "Supone que Mara recibió también los paquetes de mapas.",
          "Supone que consultar obliga a abrir el recipiente."
        ],
        "A",
        "Evaluar",
        "Se confunden dos documentos y sus funciones: registro de recorrido y autorización de retiro.",
        {
          "task": "j",
          "level": 3,
          "evidence": "Para retirar la caja, la persona responsable deberá presentar además la autorización de Inés.",
          "failures": [
            "",
            "Cambio de foco: el problema es la función del documento.",
            "Invención: la afirmación habla del retiro, no de los mapas.",
            "Cambio de acción: la afirmación es sobre retirar, no abrir."
          ]
        }
      ],
      [
        "¿Qué opción conserva mejor el propósito común de los documentos?",
        [
          "Explicar las condiciones necesarias para germinar las semillas.",
          "Informar sobre las reparaciones que requiere el puente.",
          "Reconstruir el recorrido y verificar la custodia del envío.",
          "Comparar el valor de los mapas y las herramientas."
        ],
        "C",
        "Interpretar",
        "Los documentos permiten reconstruir el recorrido, localizar la caja y distinguir consulta, traslado y retiro.",
        {
          "task": "f",
          "level": 3,
          "evidence": "La ficha de traslado permite conocer el recorrido.",
          "failures": [
            "Cambio de foco: no se describe germinación.",
            "Cambio de foco: la reparación solo explica un desvío.",
            "",
            "Cambio de foco: no se compara el valor de objetos."
          ]
        }
      ]
    ],
    "guidedIndices": [
      0,
      2
    ],
    "decision": "¿Qué harás primero para recuperar la caja?",
    "choices": [
      "Consultar el registro y pedir a Inés la autorización.",
      "Preguntar a todos los vecinos antes de revisar el registro.",
      "Examinar el invernadero.",
      "Esperar a que el visitante vuelva."
    ],
    "consequences": [
      "Tu equipo prepara una visita documentada a la sala de lectura.",
      "Tu equipo comienza una ronda de entrevistas en el pueblo.",
      "Tu equipo prepara una inspección del invernadero.",
      "Tu equipo organiza una espera y conserva los documentos."
    ],
    "concept": "Información explícita: un dato que el texto comunica directamente. Puede reaparecer con otras palabras. Corroborar: comparar registros para comprobar si coinciden."
  },
  {
    "id": "bosque",
    "title": "Los testimonios del bosque",
    "npc": "Amaya · guardabosques",
    "skill": "Interpretar",
    "introduction": "La campana sonó fuera de horario. Relaciona el relato y los testimonios para decidir cómo investigar.",
    "genre": "Relato y testimonios",
    "paragraphs": [
      "Amaya llegó al claro cuando la niebla ya había cubierto las raíces del árbol mayor. La campana del refugio había sonado dos veces antes del amanecer. En los días tranquilos, la primera campanada se escuchaba con la salida del sol. Vio a Elías junto al sendero. El viajero llevaba una manta doblada y tenía barro hasta las rodillas. «No fui al mirador», dijo antes de que ella preguntara. Amaya observó que las huellas de sus botas venían del río, pero no concluyó por eso que hubiera cruzado el puente.",
      "Elías explicó que había oído un golpe mientras recogía leña cerca del refugio. Bajó hacia el agua y encontró a una viajera sentada en una piedra. Ella no lograba apoyar el pie. La ayudó a volver por el sendero y buscó una manta. Después hizo sonar la campana: una señal acordada para pedir ayuda cuando no era posible llegar a la casa del guardabosques. No sabía de dónde había venido la viajera ni había visto cómo se lastimó.",
      "Testimonio de Nora, panadera. Antes de abrir el horno escuché dos campanadas. Desde mi ventana vi luz en el refugio, aunque a esa hora normalmente está oscuro. Al poco rato, una mujer pasó por mi puerta y pidió agua. Dijo que estaba acompañando a una viajera. No vi el río ni el puente desde mi ventana. Cuando alguien comentó que el puente se había derrumbado, repetí que yo solo había oído la campana y visto la luz.",
      "Testimonio de la viajera. La niebla me hizo detenerme junto al río. Al levantarme resbalé sobre una piedra y me lastimé el pie. Un hombre me ayudó a llegar al refugio. La campana sonó cuando él volvió con una manta. No crucé el puente esa mañana. Antes de salir del claro agradecí que nadie me pidiera caminar de nuevo para demostrar dónde había caído.",
      "Amaya anotó cada declaración por separado. Luego subrayó los puntos en que coincidían y dejó un espacio junto a lo que todavía no podía comprobar. «Una señal puede ser cierta y una explicación equivocada», escribió. Mandó revisar el puente porque seguía envuelto en niebla, pero no registró un derrumbe. La revisión buscaba obtener información nueva; no convertir una sospecha repetida en un hecho."
    ],
    "guided": [
      "La campana del refugio sonó dos veces antes del amanecer. Elías cuenta que encontró a una viajera con el pie lastimado junto al río. La ayudó a llegar al refugio. Luego trajo una manta e hizo sonar la campana para pedir ayuda.",
      "La viajera confirma que resbaló sobre una piedra y que Elías la ayudó. Dice que no cruzó el puente. Nora oyó la campana y vio luz en el refugio, pero no podía ver el puente.",
      "Amaya mandó revisar el puente. No afirmó que se hubiera derrumbado: todavía necesitaba comprobar su estado."
    ],
    "questions": [
      [
        "¿Para qué hizo sonar Elías la campana, según su declaración?",
        [
          "Para anunciar el comienzo habitual de la jornada.",
          "Para comunicar una sospecha sobre el estado del puente.",
          "Para pedir ayuda para la viajera lesionada.",
          "Para avisar a Nora que faltaba agua en el refugio."
        ],
        "C",
        "Localizar",
        "Elías explica que la campana es una señal acordada para pedir ayuda.",
        {
          "task": "a",
          "level": 1,
          "evidence": "Una señal acordada para pedir ayuda cuando no era posible llegar a la casa del guardabosques.",
          "failures": [
            "Confusión: la señal ocurrió antes del horario habitual.",
            "Invención: Elías no dice haber visto un derrumbe.",
            "",
            "Invención: la falta de agua no motivó su señal."
          ]
        }
      ],
      [
        "¿Qué conclusión apoyan conjuntamente los relatos de Elías y la viajera?",
        [
          "Elías ayudó a la viajera lesionada junto al río.",
          "Elías observó cómo la viajera cayó sobre una piedra.",
          "Nora comprobó que el puente podía usarse esa mañana.",
          "Amaya presenció la ayuda de Elías en el refugio."
        ],
        "A",
        "Interpretar",
        "Ambos relatos coinciden en la lesión junto al río y en la ayuda para llegar al refugio.",
        {
          "task": "c",
          "level": 1,
          "evidence": "Un hombre me ayudó a llegar al refugio.",
          "failures": [
            "",
            "Alcance excesivo: Elías no presenció la caída.",
            "Invención: Nora no podía ver el puente.",
            "Invención: Amaya recogió relatos después de la ayuda."
          ]
        }
      ],
      [
        "¿Por qué el barro en las botas no permite concluir que Elías cruzó el puente?",
        [
          "Porque las huellas solo indicaban la dirección del refugio.",
          "Porque bajar a la orilla también explica el barro.",
          "Porque las botas conservaban barro de la noche anterior.",
          "Porque Elías afirmó que había evitado acercarse al río."
        ],
        "B",
        "Interpretar",
        "El barro es compatible con bajar a la orilla; no demuestra un cruce específico.",
        {
          "task": "d",
          "level": 2,
          "evidence": "Bajó hacia el agua y encontró a una viajera sentada en una piedra.",
          "failures": [
            "Cambio de foco: las huellas venían del río.",
            "",
            "Invención: no se atribuye el barro a otra noche.",
            "Contradicción: Elías cuenta que bajó al río."
          ]
        }
      ],
      [
        "¿Qué expresa «Una señal puede ser cierta y una explicación equivocada» en este caso?",
        [
          "La campana habitual anunciaba un cambio en el horario.",
          "La luz del refugio mostraba quién había tocado la campana.",
          "Las campanadas permitían saber dónde cayó la viajera.",
          "La campana no confirma por sí sola un derrumbe."
        ],
        "D",
        "Interpretar",
        "Se distingue la observación comprobada de la explicación que aún requiere evidencia.",
        {
          "task": "e",
          "level": 2,
          "evidence": "La revisión buscaba obtener información nueva; no convertir una sospecha repetida en un hecho.",
          "failures": [
            "Cambio de foco: el caso no establece un horario nuevo.",
            "Alcance excesivo: la luz no identifica a quien tocó.",
            "Alcance excesivo: una señal no localiza por sí sola la caída.",
            ""
          ]
        }
      ],
      [
        "¿Qué limita el testimonio de Nora para establecer el estado del puente?",
        [
          "Nora no podía observar el puente desde su ventana.",
          "Nora oyó la señal antes de que amaneciera.",
          "Nora recibió una consulta de quien acompañaba a la viajera.",
          "Nora relató lo ocurrido mientras preparaba el horno."
        ],
        "A",
        "Evaluar",
        "La limitación pertinente es que Nora no observó el puente, no su oficio o la hora de trabajo.",
        {
          "task": "j",
          "level": 3,
          "evidence": "No vi el río ni el puente desde mi ventana.",
          "failures": [
            "",
            "Dato contextual: la hora no establece su alcance visual.",
            "Dato contextual: atender una consulta no prueba el estado del puente.",
            "Dato contextual: su actividad no explica la falta de observación directa."
          ]
        }
      ],
      [
        "¿Cómo se presenta la actitud de Amaya al investigar?",
        [
          "Acepta la explicación que circula entre los vecinos.",
          "Busca confirmar la primera sospecha que ha escuchado.",
          "Contrasta relatos y distingue hechos de asuntos pendientes.",
          "Prioriza el testimonio de quien ha sufrido la caída."
        ],
        "C",
        "Evaluar",
        "Anotar por separado, comparar y mantener pendientes expresa una actitud cautelosa y abierta a nueva evidencia.",
        {
          "task": "l",
          "level": 3,
          "evidence": "Subrayó los puntos en que coincidían y dejó un espacio junto a lo que todavía no podía comprobar.",
          "failures": [
            "Contradicción: Amaya separa rumor de hecho.",
            "Sesgo atribuido sin evidencia: no busca sostener una sospecha previa.",
            "",
            "Invención: no se concede prioridad automática a un relato."
          ]
        }
      ]
    ],
    "guidedIndices": [
      1,
      5
    ],
    "decision": "¿Qué instrucción entregarás al equipo de exploración?",
    "choices": [
      "Revisar el puente y mantener la sospecha como información pendiente.",
      "Informar inmediatamente que hubo un derrumbe.",
      "Acusar a la viajera de romper el puente.",
      "Descartar el testimonio de Elías sin compararlo."
    ],
    "consequences": [
      "Tu equipo se prepara para observar el puente y ampliar el registro.",
      "Tu equipo redacta un aviso urgente sobre el puente.",
      "Tu equipo pide una entrevista adicional con la viajera.",
      "Tu equipo inicia una revisión independiente del relato de Elías."
    ],
    "concept": "Inferencia: una conclusión construida al relacionar pistas del texto. Una pista compatible con varias explicaciones no demuestra por sí sola una de ellas. Perspectiva del narrador: la forma de presentar los hechos orienta nuestra interpretación."
  },
  {
    "id": "consejo",
    "title": "El consejo del pueblo",
    "npc": "Simón · consejero",
    "skill": "Evaluar",
    "introduction": "El consejo debe decidir si cambia las luminarias. Examina una propuesta, un informe y una objeción antes de recomendar una acción.",
    "genre": "Propuesta argumentativa e informe",
    "paragraphs": [
      "Propuesta de Lucía al consejo. Propongo reemplazar primero las luminarias del sendero del archivo, que hoy deja tramos oscuros al anochecer. Durante una semana probamos allí seis lámparas con cubierta dirigida al suelo. Los visitantes pudieron reconocer mejor los peldaños y no fue necesario aumentar la potencia. La mejora debe favorecer el tránsito sin iluminar innecesariamente el bosque. Por eso sugiero una ampliación gradual, acompañada de mediciones y de la opinión de quienes viven junto a los senderos.",
      "Algunas personas han solicitado instalar estas lámparas en todo el pueblo de inmediato. Comparto el objetivo de mejorar la seguridad, pero una experiencia en un tramo no basta para decidir sobre todos los espacios. El mercado, el puente y el borde del bosque tienen usos diferentes. Necesitamos comprobar qué ocurre en cada lugar y conservar la posibilidad de corregir el plan. Medir no es una forma de postergar cualquier acción: permite actuar y revisar sus efectos.",
      "Informe de la prueba. Se observaron seis lámparas del sendero del archivo durante siete noches. En el tramo intervenido, 18 de 24 personas consultadas dijeron distinguir mejor los peldaños. Las otras seis no notaron una diferencia. No se midió la frecuencia de caídas antes o después de la instalación. Las consultas se hicieron a quienes usaron el sendero entre las 19:00 y las 21:00; no se recogieron opiniones del mercado ni del puente. Se detectó luz fuera del sendero en dos lámparas y se corrigió la inclinación de sus cubiertas.",
      "Anuncio de un comerciante. ¡Las nuevas lámparas eliminan los accidentes de todo el pueblo! La prueba del archivo demuestra que todas las familias necesitan el mismo modelo. Cambiemos todas las luminarias esta semana. Cuanto más rápido terminemos, más seguro será nuestro futuro.",
      "Objeción de Simón. El informe muestra una mejora percibida por parte de quienes fueron consultados, pero no demuestra una eliminación de accidentes. El anuncio amplía tanto el resultado como su alcance: habla de accidentes que no se midieron y de lugares que no se observaron. Apoyo reparar los tramos oscuros y continuar la prueba en otros espacios. Para valorar la seguridad necesitaremos además un registro comparable de incidentes y verificar que la iluminación no afecte el bosque. Una propuesta responsable debe explicar qué sabe, qué supone y cómo comprobará lo que falta."
    ],
    "guided": [
      "Lucía propone cambiar primero las lámparas del sendero del archivo y probar después en otros lugares. Quiere mejorar el tránsito y revisar los efectos antes de ampliar el cambio.",
      "Durante siete noches se probaron seis lámparas. De 24 personas consultadas, 18 dijeron ver mejor los peldaños. No se midieron las caídas. No se observó el mercado ni el puente.",
      "Un anuncio afirma que las lámparas eliminan los accidentes de todo el pueblo. Simón explica que eso no está demostrado: no se midieron accidentes ni se estudió todo el pueblo."
    ],
    "questions": [
      [
        "¿Qué defiende Lucía en su propuesta?",
        [
          "Cambiar el pueblo usando los resultados del primer tramo.",
          "Ampliar gradualmente la mejora y revisar sus efectos.",
          "Aumentar la potencia antes de consultar a los vecinos.",
          "Concentrar todas las mejoras en el sendero del archivo."
        ],
        "B",
        "Interpretar",
        "Su tesis es una ampliación gradual, con mediciones y opiniones para revisar los efectos.",
        {
          "task": "f",
          "level": 1,
          "evidence": "Sugiero una ampliación gradual, acompañada de mediciones y de la opinión de quienes viven junto a los senderos.",
          "failures": [
            "Sobregeneralización: Lucía pide comprobar cada lugar.",
            "",
            "Contradicción: la prueba mejoró percepción sin aumentar potencia.",
            "Restricción excesiva: propone ampliar gradualmente."
          ]
        }
      ],
      [
        "¿Qué función cumple el segundo párrafo de la propuesta?",
        [
          "Detalla el costo de intervenir los distintos lugares.",
          "Introduce la opinión de quienes rechazaron la prueba.",
          "Explica las causas de las caídas que ya se midieron.",
          "Responde a una solicitud y limita su alcance."
        ],
        "D",
        "Interpretar",
        "Lucía reconoce el objetivo compartido y responde a la petición de instalar todo de inmediato.",
        {
          "task": "h",
          "level": 1,
          "evidence": "Una experiencia en un tramo no basta para decidir sobre todos los espacios.",
          "failures": [
            "Invención: no se desarrollan costos.",
            "Invención: no se cita rechazo de la prueba.",
            "Contradicción: no se midieron caídas.",
            ""
          ]
        }
      ],
      [
        "¿Qué afirmación está respaldada directamente por el informe?",
        [
          "18 personas percibieron mayor claridad en los peldaños.",
          "24 personas pidieron ampliar la prueba al mercado cercano.",
          "Seis personas confirmaron una reducción de las caídas.",
          "Dos lámparas requirieron aumentar su potencia durante la prueba."
        ],
        "A",
        "Localizar",
        "El informe aporta ese resultado de percepción; no midió accidentes ni todos los lugares.",
        {
          "task": "a",
          "level": 2,
          "evidence": "18 de 24 personas consultadas dijeron distinguir mejor los peldaños.",
          "failures": [
            "",
            "Invención: no se recogieron opiniones del mercado.",
            "Cambio de variable: seis no percibieron diferencia, no menos caídas.",
            "Cambio de acción: se corrigió inclinación, no potencia."
          ]
        }
      ],
      [
        "¿Qué falla principal presenta el anuncio del comerciante?",
        [
          "Compara las lámparas sin informar sus costos de instalación.",
          "Presenta la opinión de Simón como resultado del informe.",
          "Generaliza el resultado y afirma un efecto no medido.",
          "Confunde la cantidad de noches con la cantidad de participantes."
        ],
        "C",
        "Evaluar",
        "El problema es la insuficiencia de evidencia para sus afirmaciones, no un recurso tipográfico aislado.",
        {
          "task": "j",
          "level": 2,
          "evidence": "Habla de accidentes que no se midieron y de lugares que no se observaron.",
          "failures": [
            "Cambio de criterio: el problema es evidencia y alcance.",
            "Invención: el anuncio no atribuye su afirmación a Simón.",
            "",
            "Cambio de foco: el anuncio no confunde esas cantidades."
          ]
        }
      ],
      [
        "¿Qué información adicional sería más pertinente para valorar la reducción de accidentes?",
        [
          "Un registro de opiniones sobre el aspecto de las lámparas.",
          "Un registro comparable de incidentes antes y después.",
          "Un registro de consultas realizadas en las horas de instalación.",
          "Un registro del número de lámparas que vende el comerciante."
        ],
        "B",
        "Evaluar",
        "Un registro comparable de incidentes permite contrastar directamente el efecto afirmado.",
        {
          "task": "j",
          "level": 3,
          "evidence": "Un registro comparable de incidentes",
          "failures": [
            "Cambio de variable: apariencia no mide accidentes.",
            "",
            "Cambio de foco: las consultas no permiten comparar incidentes.",
            "Cambio de variable: ventas no muestran reducción de accidentes."
          ]
        }
      ],
      [
        "¿Qué criterio de Simón puede aplicarse a una propuesta nueva?",
        [
          "Valorar una propuesta según cuántos vecinos la han comentado.",
          "Elegir la propuesta que pueda ponerse en práctica primero.",
          "Considerar suficiente el resultado de la primera experiencia local.",
          "Distinguir evidencia, supuestos y lo que falta comprobar."
        ],
        "D",
        "Evaluar",
        "La aplicación a otro contexto conserva el criterio de evidencia, alcance y verificación.",
        {
          "task": "n",
          "level": 3,
          "evidence": "Una propuesta responsable debe explicar qué sabe, qué supone y cómo comprobará lo que falta.",
          "failures": [
            "Popularidad sin evidencia: repetir no comprueba.",
            "Cambio de criterio: rapidez no garantiza respaldo.",
            "Generalización: una prueba local no basta para una conclusión amplia.",
            ""
          ]
        }
      ]
    ],
    "guidedIndices": [
      0,
      3
    ],
    "decision": "¿Qué recomendarás al consejo?",
    "choices": [
      "Ampliar la prueba y comparar incidentes antes de un cambio general.",
      "Comprar todas las lámparas basándose solo en el anuncio.",
      "Suspender cualquier mejora para siempre.",
      "Instalar el mismo modelo sin observar otros lugares."
    ],
    "consequences": [
      "Tu equipo presenta un plan de prueba y seguimiento al consejo.",
      "Tu equipo presenta una solicitud de compra general al consejo.",
      "Tu equipo presenta una propuesta de suspensión al consejo.",
      "Tu equipo presenta un plan de instalación inmediata al consejo."
    ],
    "concept": "Tesis: la postura que se defiende. Argumento: una razón que la sostiene. Suficiencia: si la evidencia alcanza para sostener una afirmación. Generalización: extender un resultado más allá de los casos que permite la evidencia."
  }
];

const VERSION = 'umbral-1';
const SESSION = 'paes-cartas-umbral-2026';
const guidedReview = {
  q1: ['La caja quedó en el armario interior de la sala de lectura, según el registro de entrega.', 'Guardó la caja en el armario interior.'],
  q2: ['La instrucción permite usar la sala de lectura si el depósito está cerrado. Darío encontró esa condición.', 'Si estaba cerrado, debía quedar en la sala de lectura.'],
  q3: ['Elías y la viajera coinciden en la lesión y en la ayuda que él le prestó.', 'La viajera confirma que resbaló sobre una piedra y que Elías la ayudó.'],
  q4: ['Amaya mantiene abierta la conclusión y pide comprobar el estado del puente antes de afirmarla.', 'No afirmó que se hubiera derrumbado: todavía necesitaba comprobar su estado.'],
  q5: ['Lucía propone una mejora gradual y revisar sus efectos antes de ampliarla.', 'Quiere mejorar el tránsito y revisar los efectos antes de ampliar el cambio.'],
  q6: ['El anuncio extiende el resultado a todo el pueblo y afirma una reducción de accidentes que no se midió.', 'no se midieron accidentes ni se estudió todo el pueblo.']
};
function questionsFor(guided) {
  return missions.flatMap((m, mi) => (guided ? m.guidedIndices : m.questions.map((_, i) => i)).map((i, j) => {
    const [text, options, key, skill, reason, audit] = m.questions[i];
    const id = `q${guided ? mi * 2 + j + 1 : mi * 6 + i + 1}`;
    return { id, mission: m.id, text, options, key, skill, reason:guided ? guidedReview[id][0] : reason, task:audit.task, level:audit.level, evidence:guided ? guidedReview[id][1] : audit.evidence, failures:audit.failures };
  }));
}
function publicActivity(guided = false) {
  const questions = questionsFor(guided).map(({ key, reason, evidence, failures, ...q }) => q);
  return { version: VERSION, sessionId: SESSION + (guided ? '-guiada' : ''), title: 'Crónicas del Umbral', guided,
    objective: 'Comprender textos narrativos y no literarios para localizar información, elaborar inferencias y evaluar afirmaciones con evidencia.',
    questions,
    missions: missions.map(({ id, title, npc, skill, introduction, genre, paragraphs, guided: short, decision, choices, consequences, concept }) => ({
      id, title, npc, skill, introduction, genre, paragraphs: guided ? short : paragraphs, decision, choices, consequences, concept
    })) };
}
function grade(answers, guided = false) {
  const questions = questionsFor(guided);
  const score = questions.reduce((sum, q) => sum + Number(answers[q.id] === q.key), 0);
  const bySkill = {};
  for (const q of questions) { const s = bySkill[q.skill] ||= { score: 0, total: 0 }; s.total++; s.score += Number(answers[q.id] === q.key); }
  return { score: score, total: questions.length, bySkill };
}
module.exports = { VERSION, SESSION, missions, questionsFor, publicActivity, grade };
