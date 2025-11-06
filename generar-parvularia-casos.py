# -*- coding: utf-8 -*-
import json

ruta = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\plan.json"
with open(ruta, 'r', encoding='utf-8') as f:
    plan = json.load(f)

casos = [
    # CASO 1: Planificación de experiencias de aprendizaje (parv-76 a parv-80)
    {
        "id": "parv-76",
        "numero": 76,
        "ambito": "Caso de Estudio 1: Planificación de Experiencias de Aprendizaje",
        "nucleo": "Planificación Pedagógica",
        "habilidad": "Selección de objetivos de aprendizaje",
        "enunciado": "Una educadora planifica un proyecto de aprendizaje llamado 'Nuestro Huerto'. ¿Cuál es la mejor manera de seleccionar los objetivos de aprendizaje?",
        "alternativas": [
            {"letra": "A", "texto": "Seleccionar solo objetivos del ámbito Interacción y Comprensión del Entorno, ya que el huerto es parte de la naturaleza."},
            {"letra": "B", "texto": "Elegir objetivos integrados de los tres ámbitos, aprovechando las múltiples oportunidades de aprendizaje que ofrece el proyecto del huerto."},
            {"letra": "C", "texto": "Decidir los objetivos después de implementar el proyecto, según lo que surja."},
            {"letra": "D", "texto": "Usar los mismos objetivos que utilizó el año anterior para el proyecto del huerto."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La planificación de proyectos debe ser integradora, identificando oportunidades de aprendizaje en los tres ámbitos. Un huerto permite trabajar: Desarrollo Personal y Social (responsabilidad, colaboración), Comunicación Integral (vocabulario específico, registro de observaciones), e Interacción y Comprensión del Entorno (ciclos de vida, cuidado ambiental). Las Bases Curriculares promueven la integralidad del aprendizaje, reconociendo que las experiencias ricas permiten múltiples objetivos simultáneos. La planificación intencional (opción B) asegura que se aprovechen todas las potencialidades educativas.",
        "temas_relacionados": ["Planificación integradora", "Objetivos de aprendizaje", "Aprendizaje basado en proyectos", "Integralidad"]
    },
    {
        "id": "parv-77",
        "numero": 77,
        "ambito": "Caso de Estudio 1: Planificación de Experiencias de Aprendizaje",
        "nucleo": "Planificación Pedagógica",
        "habilidad": "Secuenciación de actividades",
        "enunciado": "En el proyecto del huerto, ¿cómo debe secuenciar las experiencias de aprendizaje?",
        "alternativas": [
            {"letra": "A", "texto": "Seguir estrictamente la secuencia planificada, sin importar el interés de los niños."},
            {"letra": "B", "texto": "Partir de la exploración y conocimientos previos, luego avanzar hacia experiencias más complejas, siendo flexible según los intereses emergentes."},
            {"letra": "C", "texto": "Comenzar directamente con la siembra, sin exploración previa."},
            {"letra": "D", "texto": "Dejar que los niños decidan completamente qué hacer cada día, sin planificación."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La secuenciación efectiva parte de los conocimientos previos (¿qué saben sobre plantas?), avanza gradualmente en complejidad (exploración, preparación, siembra, cuidado, cosecha), y mantiene flexibilidad ante intereses emergentes (si descubren lombrices, explorar ese interés). Este enfoque equilibra intencionalidad pedagógica con respuesta a los intereses infantiles. Las Bases Curriculares valoran tanto la planificación intencionada como la capacidad de ajuste según las características y necesidades del grupo. La rigidez (A) ignora el protagonismo infantil; la improvisación total (D) pierde oportunidades de aprendizaje profundo.",
        "temas_relacionados": ["Secuenciación didáctica", "Conocimientos previos", "Flexibilidad curricular", "Intereses emergentes"]
    },
    {
        "id": "parv-78",
        "numero": 78,
        "ambito": "Caso de Estudio 1: Planificación de Experiencias de Aprendizaje",
        "nucleo": "Planificación Pedagógica",
        "habilidad": "Organización de materiales y espacios",
        "enunciado": "¿Cómo organizar los materiales y espacios para el proyecto del huerto?",
        "alternativas": [
            {"letra": "A", "texto": "La educadora mantiene todos los materiales guardados y los entrega cuando es necesario."},
            {"letra": "B", "texto": "Organizar los materiales de forma accesible para los niños, creando un 'rincón del huerto' con herramientas, semillas, libros e imágenes, promoviendo la autonomía."},
            {"letra": "C", "texto": "Usar solo imágenes y materiales artificiales para evitar que los niños se ensucien."},
            {"letra": "D", "texto": "No preparar materiales específicos, usar solo lo que hay disponible en el momento."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La organización de ambientes educativos debe promover autonomía, exploración y aprendizaje activo. Un 'rincón del huerto' accesible permite que los niños tomen decisiones, exploren materiales reales (tierra, semillas, herramientas adaptadas), consulten libros y continúen el aprendizaje más allá de las actividades dirigidas. Las Bases Curriculares enfatizan el rol del ambiente como tercer educador. La accesibilidad (opción B) fomenta independencia, responsabilidad y apropiación del proyecto. Restringir acceso (A) limita autonomía; evitar materiales reales (C) empobrece la experiencia sensorial y científica.",
        "temas_relacionados": ["Organización del ambiente educativo", "Autonomía", "Materiales concretos", "Ambiente como tercer educador"]
    },
    {
        "id": "parv-79",
        "numero": 79,
        "ambito": "Caso de Estudio 1: Planificación de Experiencias de Aprendizaje",
        "nucleo": "Planificación Pedagógica",
        "habilidad": "Diferenciación pedagógica",
        "enunciado": "En el proyecto del huerto, hay niños con diferentes niveles de desarrollo. ¿Cómo asegurar que todos aprendan?",
        "alternativas": [
            {"letra": "A", "texto": "Ofrecer la misma actividad para todos, ya que es injusto dar tareas diferentes."},
            {"letra": "B", "texto": "Diseñar experiencias con múltiples niveles de complejidad: algunos niños pueden plantar, otros etiquetar, otros registrar observaciones, permitiendo que cada uno participe según sus capacidades."},
            {"letra": "C", "texto": "Separar a los niños según su nivel de desarrollo y planificar actividades completamente diferentes."},
            {"letra": "D", "texto": "Enfocarse solo en los niños que muestran más interés en el proyecto."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La diferenciación efectiva ofrece múltiples vías de participación dentro de una experiencia común, respetando los diversos ritmos y estilos de aprendizaje. En el huerto, un mismo proyecto permite diversos desafíos: manipulación de herramientas (motricidad), registro (representación), investigación (curiosidad), cuidado (responsabilidad). Este enfoque, alineado con el Diseño Universal de Aprendizaje, mantiene la cohesión grupal (todos participan del huerto) mientras respeta la individualidad. Las Bases Curriculares reconocen la singularidad de cada niño. La uniformidad (A) ignora diferencias; la segregación (C) margina; enfocarse solo en algunos (D) es excluyente.",
        "temas_relacionados": ["Diferenciación pedagógica", "Diseño Universal de Aprendizaje", "Inclusión", "Diversidad de aprendizajes"]
    },
    {
        "id": "parv-80",
        "numero": 80,
        "ambito": "Caso de Estudio 1: Planificación de Experiencias de Aprendizaje",
        "nucleo": "Planificación Pedagógica",
        "habilidad": "Evaluación de aprendizajes",
        "enunciado": "¿Cómo evaluar los aprendizajes en el proyecto del huerto?",
        "alternativas": [
            {"letra": "A", "texto": "Aplicar una prueba escrita al final del proyecto sobre conceptos de plantas."},
            {"letra": "B", "texto": "Utilizar evaluación auténtica: observar participación, registrar conversaciones, fotografiar procesos, crear un portafolio con dibujos y registros de los niños, compartir avances con las familias."},
            {"letra": "C", "texto": "No evaluar, ya que lo importante es que los niños disfruten."},
            {"letra": "D", "texto": "Evaluar solo si los niños cuidaron correctamente las plantas."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La evaluación en Educación Parvularia debe ser auténtica, integral y formativa. La observación sistemática, documentación pedagógica (fotografías, registros de conversaciones, producciones infantiles) y portafolios capturan la riqueza y complejidad del aprendizaje infantil, imposibles de evaluar con pruebas estandarizadas (A). Las Bases Curriculares promueven evaluación para el aprendizaje, no solo del aprendizaje. La documentación (opción B) visibiliza procesos, hace partícipes a niños y familias, y orienta ajustes pedagógicos. No evaluar (C) pierde información valiosa; evaluar solo resultados (D) ignora procesos, esfuerzos y aprendizajes diversos.",
        "temas_relacionados": ["Evaluación auténtica", "Documentación pedagógica", "Portafolio", "Evaluación formativa"]
    },
    
    # CASO 2: Inclusión y diversidad (parv-81 a parv-85)
    {
        "id": "parv-81",
        "numero": 81,
        "ambito": "Caso de Estudio 2: Inclusión y Diversidad",
        "nucleo": "Atención a la Diversidad",
        "habilidad": "Inclusión de niño migrante",
        "enunciado": "Llega al nivel un niño venezolano que habla español con acento diferente y usa algunas palabras distintas. Algunos niños se ríen cuando habla. ¿Cómo actuar?",
        "alternativas": [
            {"letra": "A", "texto": "Ignorar la situación para no avergonzar al niño nuevo."},
            {"letra": "B", "texto": "Aprovechar la oportunidad para trabajar la diversidad lingüística: explorar palabras diferentes para los mismos objetos, invitar al niño a compartir canciones de su país, leer cuentos sobre migración, conversar sobre el respeto."},
            {"letra": "C", "texto": "Pedirle al niño que intente hablar como los demás para integrarse mejor."},
            {"letra": "D", "texto": "Llamar la atención severamente a los niños que se rieron."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La diversidad lingüística y cultural es una oportunidad educativa valiosa. En lugar de ignorar (A) o homogeneizar (C), convertir la diferencia en aprendizaje enriquece a todo el grupo. Explorar variaciones del español (autobús/guagua/bus, arveja/guisante/petipúa), compartir canciones, conocer otros países promueve aprecio por la diversidad. Las Bases Curriculares valoran la identidad cultural y el respeto por la diversidad. Esta estrategia (opción B) fortalece la autoestima del niño migrante, amplía la visión de mundo del grupo y enseña respeto activamente. La sanción sola (D) no construye comprensión profunda.",
        "temas_relacionados": ["Diversidad lingüística", "Inclusión de migrantes", "Educación intercultural", "Respeto por la diversidad"]
    },
    {
        "id": "parv-82",
        "numero": 82,
        "ambito": "Caso de Estudio 2: Inclusión y Diversidad",
        "nucleo": "Atención a la Diversidad",
        "habilidad": "Adaptación para niño con dificultad motriz",
        "enunciado": "Una niña con dificultad motriz fina tiene problemas para usar tijeras y lápices como los demás. ¿Qué hacer?",
        "alternativas": [
            {"letra": "A", "texto": "Eximirla de las actividades que requieran motricidad fina para evitar frustración."},
            {"letra": "B", "texto": "Ofrecer adaptaciones y materiales alternativos: tijeras adaptadas, engrosar lápices con foam, permitir diferentes formas de expresión (dactilopintura, collage con dedos), coordinarse con especialistas."},
            {"letra": "C", "texto": "Pedirle a una técnico que haga las tareas por ella."},
            {"letra": "D", "texto": "Insistir en que practique más con los materiales convencionales hasta que logre usarlos."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La inclusión efectiva requiere ajustes razonables que permitan participación genuina. Las adaptaciones (tijeras adaptadas, lápices engrosados, gripballs, estabilizadores) y estrategias alternativas (pintar con dedos, collage, sellos) posibilitan que la niña exprese creatividad y desarrolle habilidades sin limitarla. Las Bases Curriculares promueven equidad y respeto por las singularidades. La coordinación con especialistas (terapeuta ocupacional) optimiza apoyos. Excluir (A) margina y baja expectativas; hacer por ella (C) anula autonomía; forzar sin adaptaciones (D) genera frustración sin considerar que existen múltiples caminos válidos hacia el aprendizaje.",
        "temas_relacionados": ["Diseño Universal de Aprendizaje", "Adaptaciones curriculares", "Inclusión", "Trabajo colaborativo con especialistas"]
    },
    {
        "id": "parv-83",
        "numero": 83,
        "ambito": "Caso de Estudio 2: Inclusión y Diversidad",
        "nucleo": "Atención a la Diversidad",
        "habilidad": "Atención a niño con altas capacidades",
        "enunciado": "Un niño de NT1 lee fluidamente, suma mentalmente y se aburre en las actividades grupales. ¿Cómo responder a sus necesidades?",
        "alternativas": [
            {"letra": "A", "texto": "Dejarlo que haga lo que quiera mientras los demás trabajan, ya que no necesita aprender nada más."},
            {"letra": "B", "texto": "Ofrecerle desafíos apropiados: proyectos de investigación más complejos, rol de 'ayudante' (explicar a pares), actividades abiertas que permitan profundización, sin aislarlo del grupo."},
            {"letra": "C", "texto": "Pedirle que repita las actividades básicas como los demás para no generar diferencias."},
            {"letra": "D", "texto": "Adelantarlo a NT2 o primero básico para que esté con niños de su nivel académico."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Los niños con altas capacidades necesitan desafíos apropiados, pero también interacción social con pares de su edad. Estrategias efectivas incluyen: compactación curricular (no repetir lo dominado), proyectos de profundización, preguntas de pensamiento superior, aprendizaje cooperativo donde pueda enseñar. Las Bases Curriculares reconocen que todos los niños, incluyendo aquellos con talentos excepcionales, merecen atención a sus necesidades particulares. Mantener al niño en su grupo etario (opción B) protege desarrollo socioemocional, mientras los desafíos intelectuales sostienen motivación. Ignorarlo (A) o homogeneizarlo (C) desaprovecha potencial; la aceleración (D) puede generar problemas sociales y emocionales.",
        "temas_relacionados": ["Altas capacidades", "Diferenciación curricular", "Compactación curricular", "Desarrollo integral"]
    },
    {
        "id": "parv-84",
        "numero": 84,
        "ambito": "Caso de Estudio 2: Inclusión y Diversidad",
        "nucleo": "Atención a la Diversidad",
        "habilidad": "Promoción de interacciones inclusivas",
        "enunciado": "Durante el juego libre, algunos niños no quieren jugar con un compañero con autismo. ¿Cómo favorecer la inclusión?",
        "alternativas": [
            {"letra": "A", "texto": "Obligar a los niños a jugar con él, amenazando con consecuencias si se niegan."},
            {"letra": "B", "texto": "Mediar y facilitar interacciones: identificar intereses comunes, enseñar formas de invitar a jugar, usar apoyos visuales, modelar interacciones positivas, celebrar momentos de juego compartido."},
            {"letra": "C", "texto": "Separar al niño con autismo para que juegue solo con la técnico."},
            {"letra": "D", "texto": "Esperar que las interacciones surjan naturalmente sin intervenir."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La inclusión social requiere mediación intencional y estratégica. Las educadoras pueden: identificar intereses compartidos (si al niño con autismo le gustan los dinosaurios, conectarlo con otros interesados), enseñar explícitamente habilidades sociales (cómo iniciar juego, turnarse), usar apoyos visuales (pictogramas de 'puedo jugar'), modelar y reforzar interacciones positivas. Las Bases Curriculares valoran la convivencia y el respeto. La mediación activa (opción B) construye puentes, enseña empatía y beneficia a todos. Forzar (A) genera resistencia; segregar (C) margina; esperar pasivamente (D) desaprovecha oportunidades de enseñar convivencia.",
        "temas_relacionados": ["Inclusión social", "Mediación pedagógica", "Habilidades sociales", "Autismo"]
    },
    {
        "id": "parv-85",
        "numero": 85,
        "ambito": "Caso de Estudio 2: Inclusión y Diversidad",
        "nucleo": "Atención a la Diversidad",
        "habilidad": "Celebración de la diversidad",
        "enunciado": "¿Cómo incorporar la celebración de la diversidad en el currículo diario?",
        "alternativas": [
            {"letra": "A", "texto": "Realizar un 'día de la diversidad' anual donde se habla del tema."},
            {"letra": "B", "texto": "Integrar la diversidad transversalmente: usar imágenes y materiales que reflejen diferentes culturas, familias diversas, capacidades; leer cuentos con personajes diversos; invitar familias a compartir tradiciones; naturalizar las diferencias en conversaciones cotidianas."},
            {"letra": "C", "texto": "Evitar hablar de diferencias para no incomodar a nadie."},
            {"letra": "D", "texto": "Hablar solo de diversidad cuando surge un problema o conflicto relacionado."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La educación para la diversidad debe ser cotidiana, no eventual. Cuando los niños ven imágenes de familias diversas (monoparentales, homoparentales, multigeneracionales), personas con diferentes capacidades, variedad cultural en cuentos, materiales y conversaciones, aprenden que la diversidad es normal y valiosa. Las Bases Curriculares promueven el respeto por la diversidad como principio fundamental. La integración transversal (opción B) construye una cultura inclusiva naturalizada. Un solo día (A) sugiere que es excepcional; evitar el tema (C) perpetúa invisibilización; abordarlo solo en conflictos (D) asocia diversidad con problemas, en lugar de presentarla como riqueza.",
        "temas_relacionados": ["Educación inclusiva", "Diversidad cultural", "Familias diversas", "Currículo inclusivo"]
    },
    
    # CASO 3: Evaluación formativa (parv-86 a parv-90)
    {
        "id": "parv-86",
        "numero": 86,
        "ambito": "Caso de Estudio 3: Evaluación Formativa",
        "nucleo": "Evaluación para el Aprendizaje",
        "habilidad": "Instrumentos de evaluación auténtica",
        "enunciado": "La educadora necesita evaluar el desarrollo del lenguaje oral. ¿Cuál es la mejor estrategia?",
        "alternativas": [
            {"letra": "A", "texto": "Aplicar una prueba individual con preguntas predefinidas a cada niño."},
            {"letra": "B", "texto": "Observar y registrar sistemáticamente conversaciones espontáneas durante juego, comidas y actividades; analizar uso de vocabulario, estructuras gramaticales, propósitos comunicativos; documentar con grabaciones."},
            {"letra": "C", "texto": "Pedirles que reciten un poema para verificar si memorizan bien."},
            {"letra": "D", "texto": "Preguntar a los apoderados si sus hijos hablan bien en casa."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La evaluación auténtica del lenguaje oral debe ocurrir en contextos naturales y significativos. Las conversaciones espontáneas revelan competencias reales: vocabulario activo, complejidad gramatical, funciones comunicativas (narrar, explicar, argumentar, imaginar), pragmática social. Las Bases Curriculares promueven evaluación contextualizada. La observación sistemática con registros (opción B) captura la riqueza comunicativa real, imposible de evaluar con pruebas artificiosas (A). Recitar (C) mide memorización, no competencia comunicativa; consultar solo a familias (D) pierde información del contexto educativo y puede tener sesgos.",
        "temas_relacionados": ["Evaluación auténtica", "Observación sistemática", "Desarrollo del lenguaje oral", "Documentación pedagógica"]
    },
    {
        "id": "parv-87",
        "numero": 87,
        "ambito": "Caso de Estudio 3: Evaluación Formativa",
        "nucleo": "Evaluación para el Aprendizaje",
        "habilidad": "Portafolio de aprendizaje",
        "enunciado": "¿Cómo construir un portafolio efectivo de aprendizajes de los niños?",
        "alternativas": [
            {"letra": "A", "texto": "Guardar todos los trabajos que los niños realizan durante el año."},
            {"letra": "B", "texto": "Seleccionar intencionadamente evidencias diversas que muestren procesos y progresos: fotografías de construcciones, grabaciones de conversaciones, dibujos con anotaciones sobre su significado, creaciones artísticas; incluir reflexiones del niño sobre su aprendizaje."},
            {"letra": "C", "texto": "Coleccionar solo los trabajos más bonitos para mostrar a los apoderados."},
            {"letra": "D", "texto": "Hacer que todos los niños tengan exactamente las mismas evidencias en sus portafolios."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Un portafolio efectivo es una colección intencionada y reflexiva de evidencias que documentan procesos, esfuerzos y progresos. Debe incluir variedad de formatos (fotos, dibujos, grabaciones, producciones), mostrar evolución temporal (mismo tipo de producción al inicio, medio y final del año), incorporar voz del niño ('esto lo hice porque...', '¿qué aprendí?'). Las Bases Curriculares valoran la evaluación del proceso, no solo resultados. La selección reflexiva (opción B) hace visible el aprendizaje. Guardar todo (A) es acumulación sin análisis; seleccionar solo lo 'bonito' (C) privilegia estética sobre aprendizaje; uniformizar (D) ignora singularidad de cada trayectoria.",
        "temas_relacionados": ["Portafolio de aprendizaje", "Evaluación procesual", "Metacognición", "Documentación del progreso"]
    },
    {
        "id": "parv-88",
        "numero": 88,
        "ambito": "Caso de Estudio 3: Evaluación Formativa",
        "nucleo": "Evaluación para el Aprendizaje",
        "habilidad": "Participación de los niños en la evaluación",
        "enunciado": "¿Cómo involucrar a los niños en su propia evaluación?",
        "alternativas": [
            {"letra": "A", "texto": "No involucrarlos, ya que son muy pequeños para entender la evaluación."},
            {"letra": "B", "texto": "Usar estrategias adaptadas: autoevaluación con caritas (¿cómo me sentí?), revisión de portafolios ('¿cuál trabajo te costó más?, ¿cuál te gustó más?'), co-evaluación entre pares, registro de logros ('antes no podía... ahora puedo...')."},
            {"letra": "C", "texto": "Pedirles que se pongan una nota del 1 al 7."},
            {"letra": "D", "texto": "Solo preguntarles si les gustó la actividad al terminar."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Los niños pueden y deben participar en evaluación adaptada a su desarrollo. Estrategias efectivas incluyen: autoevaluación con apoyos visuales (caritas, semáforos), revisión de portafolios con preguntas reflexivas, comparación de producciones temporales ('mira tu dibujo de marzo y tu dibujo de hoy'), co-evaluación ('¿tu compañero logró...?'). Las Bases Curriculares promueven protagonismo infantil. La participación evaluativa (opción B) desarrolla metacognición, autorregulación y responsabilidad. Subestimar capacidades (A) pierde oportunidades; usar escalas abstractas (C) no es apropiado evolutivamente; preguntar solo si gustó (D) confunde satisfacción con aprendizaje.",
        "temas_relacionados": ["Autoevaluación", "Metacognición", "Protagonismo infantil", "Coevaluación"]
    },
    {
        "id": "parv-89",
        "numero": 89,
        "ambito": "Caso de Estudio 3: Evaluación Formativa",
        "nucleo": "Evaluación para el Aprendizaje",
        "habilidad": "Comunicación de resultados a las familias",
        "enunciado": "¿Cómo comunicar efectivamente los aprendizajes y avances de los niños a las familias?",
        "alternativas": [
            {"letra": "A", "texto": "Enviar un informe técnico con todos los objetivos de aprendizaje evaluados y su nivel de logro."},
            {"letra": "B", "texto": "Usar comunicación significativa y accesible: combinar informe narrativo con ejemplos concretos, compartir evidencias (fotos, videos, muestras de trabajos), realizar entrevistas dialógicas donde se escucha también la perspectiva familiar, celebrar avances."},
            {"letra": "C", "texto": "Comunicarse solo cuando hay problemas o dificultades."},
            {"letra": "D", "texto": "Enviar un mensaje de WhatsApp rápido con un resumen general."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La comunicación con familias debe ser comprensible, respetuosa, bidireccional y enfocada en el niño particular. Los informes narrativos contextualizan aprendizajes ('Joaquín demostró gran avance en resolución de conflictos: ahora pide la palabra antes de tomar un juguete'), las evidencias visuales concretan logros, las entrevistas permiten diálogo. Las Bases Curriculares valoran la alianza jardín-familia. La comunicación rica (opción B) construye confianza, involucra familias, celebra progresos. El lenguaje técnico inaccesible (A) puede alienar; comunicar solo problemas (C) daña relación; mensajes superficiales (D) pierden oportunidad de verdadera comunicación.",
        "temas_relacionados": ["Comunicación con familias", "Informes cualitativos", "Alianza jardín-familia", "Evaluación comunicativa"]
    },
    {
        "id": "parv-90",
        "numero": 90,
        "ambito": "Caso de Estudio 3: Evaluación Formativa",
        "nucleo": "Evaluación para el Aprendizaje",
        "habilidad": "Uso de la evaluación para ajustar la enseñanza",
        "enunciado": "Tras evaluar, la educadora descubre que pocos niños comprenden conceptos de medición. ¿Qué hacer?",
        "alternativas": [
            {"letra": "A", "texto": "Continuar con la planificación original, ya que algunos niños sí lograron el objetivo."},
            {"letra": "B", "texto": "Ajustar la enseñanza: ofrecer más experiencias concretas de medición (con pasos, vasos, bloques), conectar con situaciones cotidianas, usar diferentes modalidades (visual, kinestésica), retomar el objetivo desde otro ángulo."},
            {"letra": "C", "texto": "Culpar a los niños por no prestar atención."},
            {"letra": "D", "texto": "Eliminar ese objetivo de la planificación, ya que es muy difícil."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La evaluación formativa debe retroalimentar la enseñanza. Si los niños no aprendieron, significa que la estrategia didáctica necesita ajuste, no que los niños 'fallaron'. Re-enseñar con diferentes enfoques: más experiencias manipulativas (medir altura con bloques, distancias con pasos), contextos significativos (¿cuántos vasos de agua caben en esta botella?), apoyos visuales, lenguaje preciso. Las Bases Curriculares promueven evaluación para mejorar procesos educativos. Ajustar enseñanza (opción B) muestra profesionalismo y compromiso con aprendizaje de todos. Continuar igual (A) ignora evidencia; culpar (C) es injusto; eliminar objetivos (D) baja expectativas inapropiadamente.",
        "temas_relacionados": ["Evaluación formativa", "Retroalimentación de la enseñanza", "Re-enseñanza", "Responsividad pedagógica"]
    },
    
    # CASO 4: Trabajo con familias (parv-91 a parv-95)
    {
        "id": "parv-91",
        "numero": 91,
        "ambito": "Caso de Estudio 4: Trabajo con Familias",
        "nucleo": "Alianza Familia-Jardín",
        "habilidad": "Estrategias de acogida familiar",
        "enunciado": "Al inicio del año, ¿cómo establecer una alianza positiva con las familias?",
        "alternativas": [
            {"letra": "A", "texto": "Enviar una carta formal informando las reglas y horarios del jardín."},
            {"letra": "B", "texto": "Realizar reuniones de acogida acogedoras, visitas domiciliarias respetuosas (si la familia acepta), crear espacios de conversación horizontal donde se valoren saberes familiares, comunicar altas expectativas sobre todos los niños, explicar enfoque pedagógico."},
            {"letra": "C", "texto": "Esperar a la primera reunión de apoderados para conocer a las familias."},
            {"letra": "D", "texto": "Enfocarse solo en los niños, ya que son ellos los que asisten al jardín."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "El inicio del año es crítico para construir alianza jardín-familia. Estrategias efectivas: reuniones cálidas donde se escuchan expectativas familiares, visitas domiciliarias (con consentimiento) que honran el hogar como primer espacio educativo, comunicación de altas expectativas ('su hijo puede lograr...'), explicación del enfoque pedagógico (por qué jugar es aprender). Las Bases Curriculares reconocen a las familias como primeros educadores. La acogida intencional (opción B) construye confianza, respeto mutuo y compromiso compartido. La comunicación fría (A) no construye vínculo; esperar (C) pierde tiempo valioso; ignorar familias (D) contradice evidencia sobre importancia de involucramiento parental.",
        "temas_relacionados": ["Acogida familiar", "Alianza educativa", "Visitas domiciliarias", "Comunicación horizontal"]
    },
    {
        "id": "parv-92",
        "numero": 92,
        "ambito": "Caso de Estudio 4: Trabajo con Familias",
        "nucleo": "Alianza Familia-Jardín",
        "habilidad": "Comunicación bidireccional",
        "enunciado": "¿Cómo establecer comunicación efectiva y bidireccional con las familias?",
        "alternativas": [
            {"letra": "A", "texto": "Usar solo comunicación escrita formal para mantener límites profesionales."},
            {"letra": "B", "texto": "Combinar múltiples canales: conversaciones breves al inicio/fin del día, cuaderno de comunicaciones, grupo de WhatsApp para información general, entrevistas personales periódicas; siempre escuchar activamente lo que las familias comunican."},
            {"letra": "C", "texto": "Comunicarse solo cuando hay situaciones negativas que reportar."},
            {"letra": "D", "texto": "Delegar toda la comunicación con familias en la dirección del establecimiento."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La comunicación efectiva es frecuente, bidireccional, multimodal y positiva. Las conversaciones diarias breves permiten intercambio cotidiano, el cuaderno o agenda registra información importante, el WhatsApp (usado profesionalmente) facilita comunicación rápida, las entrevistas permiten conversaciones profundas. Lo esencial es escuchar activamente: las familias tienen información valiosa sobre sus hijos. Las Bases Curriculares enfatizan la co-responsabilidad educativa. La diversidad de canales (opción B) respeta preferencias y circunstancias familiares. La comunicación unidireccional (A) no es verdadero diálogo; enfocarse en lo negativo (C) daña relación; delegar completamente (D) pierde cercanía educadora-familia.",
        "temas_relacionados": ["Comunicación bidireccional", "Múltiples canales comunicativos", "Escucha activa", "Co-responsabilidad educativa"]
    },
    {
        "id": "parv-93",
        "numero": 93,
        "ambito": "Caso de Estudio 4: Trabajo con Familias",
        "nucleo": "Alianza Familia-Jardín",
        "habilidad": "Respeto por diversas estructuras familiares",
        "enunciado": "En el nivel hay familias monoparentales, homoparentales, reconstituidas y multigeneracionales. ¿Cómo abordar esta diversidad?",
        "alternativas": [
            {"letra": "A", "texto": "Planificar actividades asumiendo la familia nuclear tradicional (mamá, papá, hijos)."},
            {"letra": "B", "texto": "Reconocer y valorar todas las configuraciones familiares: usar lenguaje inclusivo ('tu familia' en lugar de 'tus papás'), celebrar el Día de la Familia (no del padre/madre), invitar a quien es significativo para el niño, usar cuentos y materiales que reflejen diversidad familiar."},
            {"letra": "C", "texto": "Evitar hablar de familias para no generar incomodidad."},
            {"letra": "D", "texto": "Pedir a los niños de familias diversas que no compartan información sobre su familia."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La diversidad familiar es una realidad que debe ser reconocida y valorada. Usar lenguaje inclusivo ('¿quién vive en tu casa?', 'tu familia'), celebrar el Día de la Familia (no padre/madre por separado), invitar a quienes son significativos (puede ser abuela, tío, padre adoptivo), usar materiales que reflejen diversidad normaliza y valida todas las configuraciones. Las Bases Curriculares promueven respeto por la diversidad. El reconocimiento inclusivo (opción B) fortalece identidad de todos los niños. Asumir un modelo único (A) invisibiliza y margina; evitar el tema (C) sugiere vergüenza; silenciar (D) es profundamente dañino para la identidad infantil.",
        "temas_relacionados": ["Diversidad familiar", "Lenguaje inclusivo", "Identidad familiar", "Respeto por la diversidad"]
    },
    {
        "id": "parv-94",
        "numero": 94,
        "ambito": "Caso de Estudio 4: Trabajo con Familias",
        "nucleo": "Alianza Familia-Jardín",
        "habilidad": "Participación familiar en el aprendizaje",
        "enunciado": "¿Cómo involucrar genuinamente a las familias en el proceso educativo?",
        "alternativas": [
            {"letra": "A", "texto": "Pedirles que envíen materiales reciclables cuando se necesiten."},
            {"letra": "B", "texto": "Ofrecer múltiples formas de participación: compartir oficios/tradiciones culturales, leer cuentos en el aula, acompañar salidas pedagógicas, participar en decisiones curriculares, realizar actividades de aprendizaje en casa conectadas con el jardín, compartir talentos."},
            {"letra": "C", "texto": "Invitarlas solo a eventos oficiales como actos de fin de año."},
            {"letra": "D", "texto": "No involucrarlas en lo pedagógico, ya que ese es el rol de las educadoras."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La participación familiar efectiva va más allá de roles auxiliares. Las familias tienen saberes, talentos y experiencias valiosas: pueden compartir oficios (si alguien es panadero, hacer pan juntos), tradiciones culturales (enseñar baile tradicional), leer cuentos, aportar ideas curriculares, realizar actividades de aprendizaje en casa que extiendan lo trabajado en el jardín. Las Bases Curriculares valoran a las familias como co-educadoras. La participación genuina (opción B) enriquece el currículo, fortalece alianza y comunica respeto por saberes familiares. Roles solo auxiliares (A) subutilizan potencial; participación ceremonial (C) es simbólica sin impacto real; excluir (D) contradice principios de co-responsabilidad.",
        "temas_relacionados": ["Participación familiar genuina", "Co-educación", "Saberes familiares", "Comunidad de aprendizaje"]
    },
    {
        "id": "parv-95",
        "numero": 95,
        "ambito": "Caso de Estudio 4: Trabajo con Familias",
        "nucleo": "Alianza Familia-Jardín",
        "habilidad": "Manejo de conflictos con familias",
        "enunciado": "Una apoderada está muy molesta porque su hijo se cayó en el patio y tiene críticas fuertes hacia el jardín. ¿Cómo abordar la situación?",
        "alternativas": [
            {"letra": "A", "texto": "Ponerse a la defensiva y explicar que los accidentes son inevitables."},
            {"letra": "B", "texto": "Escuchar empáticamente su preocupación, validar su emoción, explicar lo ocurrido con transparencia, disculparse por la angustia causada, revisar protocolos de seguridad, mantener comunicación cercana los días siguientes."},
            {"letra": "C", "texto": "Ignorar su molestia esperando que se le pase."},
            {"letra": "D", "texto": "Decirle que retire al niño del jardín si no confía en el equipo."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Los conflictos con familias requieren empatía, transparencia y profesionalismo. Ante la angustia materna (natural cuando su hijo se lastima), primero escuchar sin interrumpir, validar emoción ('entiendo su preocupación'), explicar honestamente lo ocurrido, pedir disculpas por la angustia (no necesariamente por negligencia si no hubo), explicar medidas de seguridad y revisar si necesitan ajustes, mantener comunicación cercana. Las Bases Curriculares promueven relaciones de respeto mutuo. La respuesta empática y profesional (opción B) puede transformar conflicto en fortalecimiento de confianza. La defensividad (A) escala el conflicto; ignorar (C) daña relación gravemente; amenazar con exclusión (D) es inaceptable y punitivo.",
        "temas_relacionados": ["Resolución de conflictos", "Comunicación empática", "Transparencia", "Profesionalismo"]
    },
    
    # CASO 5: Resolución de conflictos entre niños (parv-96 a parv-100)
    {
        "id": "parv-96",
        "numero": 96,
        "ambito": "Caso de Estudio 5: Resolución de Conflictos entre Niños",
        "nucleo": "Convivencia y Mediación",
        "habilidad": "Mediación de conflictos",
        "enunciado": "Dos niños pelean por un triciclo en el patio. Ambos lo quieren usar. ¿Cómo mediar?",
        "alternativas": [
            {"letra": "A", "texto": "Quitarles el triciclo a ambos como castigo por pelear."},
            {"letra": "B", "texto": "Mediar el conflicto: ayudarlos a calmarse, escuchar a ambos sin juzgar, reformular el problema ('ambos quieren usar el triciclo'), facilitar que propongan soluciones (turnarse, usar cronómetro, buscar otro vehículo), apoyar implementación del acuerdo."},
            {"letra": "C", "texto": "Decidir arbitrariamente cuál de los dos lo usará primero."},
            {"letra": "D", "texto": "Dejar que resuelvan solos, aunque lleguen a golpes."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La mediación de conflictos enseña habilidades valiosas: autorregulación emocional (primero calmarse), escucha ('¿qué pasó?'), empatía ('¿cómo crees que se siente?'), pensamiento creativo (generar soluciones), negociación, compromiso. Las Bases Curriculares promueven resolución pacífica de conflictos. La mediación (opción B) usa el conflicto como oportunidad de aprendizaje, apoyando sin imponer, enseñando proceso replicable. Castigar (A) no enseña resolución; imponer solución (C) anula protagonismo y aprendizaje; abandonar (D) es negligente y puede derivar en violencia. Los niños pueden aprender a resolver conflictos si los adultos mediamos apropiadamente.",
        "temas_relacionados": ["Mediación de conflictos", "Resolución pacífica", "Autorregulación", "Negociación"]
    },
    {
        "id": "parv-97",
        "numero": 97,
        "ambito": "Caso de Estudio 5: Resolución de Conflictos entre Niños",
        "nucleo": "Convivencia y Mediación",
        "habilidad": "Desarrollo de vocabulario emocional",
        "enunciado": "Durante los conflictos, los niños suelen decir solo 'estoy enojado'. ¿Cómo ampliar su vocabulario emocional?",
        "alternativas": [
            {"letra": "A", "texto": "No es necesario, con 'enojado' y 'feliz' es suficiente para su edad."},
            {"letra": "B", "texto": "Enseñar vocabulario emocional variado: usar libros sobre emociones, nombrar emociones específicas en situaciones reales ('pareces frustrado porque...', 'te ves decepcionado'), crear un 'emocionómetro' visual, jugar a identificar emociones en fotos/dramatizaciones."},
            {"letra": "C", "texto": "Corregirlos cuando usan palabras emocionales incorrectamente."},
            {"letra": "D", "texto": "Decirles que no expresen emociones negativas."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "El vocabulario emocional amplio y preciso facilita autorregulación y comunicación. Diferenciar entre enojado, frustrado, molesto, decepcionado, ansioso ayuda a los niños a comprender mejor sus estados internos y comunicarlos efectivamente. Estrategias: modelar lenguaje emocional ('te veo preocupado'), usar cuentos (donde personajes experimentan emociones diversas), crear apoyos visuales (emocionómetro, tarjetas), juegos dramáticos. Las Bases Curriculares valoran reconocimiento y expresión de emociones. Ampliar vocabulario (opción B) es herramienta de desarrollo socioemocional. Limitarse a lo básico (A) desaprovecha capacidad infantil; corregir constantemente (C) inhibe expresión; negar emociones negativas (D) es emocionalmente dañino.",
        "temas_relacionados": ["Vocabulario emocional", "Educación socioemocional", "Autorregulación", "Expresión emocional"]
    },
    {
        "id": "parv-98",
        "numero": 98,
        "ambito": "Caso de Estudio 5: Resolución de Conflictos entre Niños",
        "nucleo": "Convivencia y Mediación",
        "habilidad": "Prácticas restaurativas",
        "enunciado": "Un niño empujó a otro y le causó daño. Después de atender al niño lastimado, ¿cómo abordar con quien empujó?",
        "alternativas": [
            {"letra": "A", "texto": "Castigarlo con tiempo fuera prolongado para que reflexione."},
            {"letra": "B", "texto": "Usar enfoque restaurativo: ayudarlo a comprender el impacto de su acción ('¿viste cómo se sintió?'), facilitar reparación genuina (disculpa, ayudar al compañero, dibujo de reconciliación), identificar qué necesitaba y enseñar alternativas apropiadas."},
            {"letra": "C", "texto": "Obligarlo a disculparse inmediatamente, aunque esté muy enojado."},
            {"letra": "D", "texto": "No hacer nada, ya que son conflictos normales entre niños."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Las prácticas restaurativas buscan comprensión, reparación y aprendizaje, no castigo. Después de atender al niño lastimado, trabajar con quien empujó: ayudarlo a calmarse, facilitar comprensión del daño causado (desarrolla empatía), apoyar reparación genuina (cuando esté listo emocionalmente, no forzada), identificar necesidad subyacente ('¿estabas enojado porque...?'), enseñar estrategias apropiadas ('la próxima vez puedes...'). Las Bases Curriculares promueven desarrollo de empatía y convivencia respetuosa. El enfoque restaurativo (opción B) enseña responsabilidad sin vergüenza. El castigo aislado (A) no enseña alternativas; forzar disculpas (C) genera disculpas vacías; ignorar (D) pierde oportunidad de enseñanza.",
        "temas_relacionados": ["Prácticas restaurativas", "Desarrollo de empatía", "Reparación", "Disciplina formativa"]
    },
    {
        "id": "parv-99",
        "numero": 99,
        "ambito": "Caso de Estudio 5: Resolución de Conflictos entre Niños",
        "nucleo": "Convivencia y Mediación",
        "habilidad": "Prevención de conflictos",
        "enunciado": "¿Cómo crear un ambiente que prevenga conflictos excesivos?",
        "alternativas": [
            {"letra": "A", "texto": "Establecer muchas reglas estrictas y vigilar constantemente a los niños."},
            {"letra": "B", "texto": "Diseñar ambientes con suficientes materiales, espacios bien definidos, rutinas predecibles; enseñar proactivamente habilidades sociales; construir comunidad con rituales de grupo; atender necesidades básicas (hambre, sueño, movimiento)."},
            {"letra": "C", "texto": "Separar a los niños que tienen conflictos frecuentes."},
            {"letra": "D", "texto": "Permitir que cada niño haga lo que quiera para evitar frustraciones."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La prevención de conflictos requiere diseño intencional del ambiente y construcción de comunidad. Ambientes bien organizados (suficientes materiales interesantes, espacios definidos, rutinas predecibles) reducen frustraciones; enseñanza proactiva de habilidades sociales (cómo pedir turnos, iniciar juego, expresar desacuerdo) brinda herramientas; rituales comunitarios (círculos de diálogo, saludos, celebraciones) construyen pertenencia; atención a necesidades básicas (un niño cansado/hambriento tendrá menos autorregulación). Las Bases Curriculares valoran ambiente como facilitador de aprendizaje. La prevención sistémica (opción B) es más efectiva que control (A) o segregación (C); la ausencia total de límites (D) genera inseguridad y más conflictos.",
        "temas_relacionados": ["Prevención de conflictos", "Diseño de ambientes", "Comunidad de aula", "Enseñanza proactiva"]
    },
    {
        "id": "parv-100",
        "numero": 100,
        "ambito": "Caso de Estudio 5: Resolución de Conflictos entre Niños",
        "nucleo": "Convivencia y Mediación",
        "habilidad": "Construcción de clima positivo",
        "enunciado": "¿Cómo construir un clima socioemocional positivo que favorezca la convivencia?",
        "alternativas": [
            {"letra": "A", "texto": "Enfocarse principalmente en corregir conductas negativas."},
            {"letra": "B", "texto": "Crear cultura de aprecio: reconocer específicamente conductas prosociales ('noté que compartiste', 'ayudaste a tu compañero'), celebrar diversidad, promover juego cooperativo, enseñar gratitud y aprecio mutuo, modelar el trato que se espera, usar círculos de diálogo para fortalecer vínculos."},
            {"letra": "C", "texto": "Premiar solo a los niños que se portan bien con stickers o dulces."},
            {"letra": "D", "texto": "Esperar que el clima positivo surja naturalmente sin intervención adulta."}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Un clima socioemocional positivo se construye intencionalmente a través de múltiples estrategias: reconocimiento específico de conductas prosociales (más efectivo que castigo de negativas), juegos cooperativos (donde se gana juntos), enseñanza explícita de gratitud y aprecio, círculos de diálogo (donde todos son escuchados), modelamiento adulto (los niños imitan). Las Bases Curriculares enfatizan el bienestar integral y convivencia respetuosa. La construcción activa de cultura positiva (opción B) previene problemas y promueve desarrollo socioemocional. Enfocarse solo en lo negativo (A) genera clima punitivo; los premios materiales (C) socavan motivación intrínseca; la pasividad (D) desaprovecha oportunidades de enseñar convivencia.",
        "temas_relacionados": ["Clima socioemocional", "Cultura de aprecio", "Reconocimiento positivo", "Juego cooperativo"]
    }
]

plan["exam"]["preguntas"].extend(casos)

with open(ruta, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print("✅ Casos de estudio: 25 preguntas agregadas")
print(f"📊 Total: {len(plan['exam']['preguntas'])} preguntas")
print("\n🎉 ¡Evaluación completa con 100 preguntas!")
