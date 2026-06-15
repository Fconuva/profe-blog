/*
 * MANUAL_SPEC — Especificación por manual para el formulario de inscripción
 * Evaluación Docente 2026 (DocenteMás / CPEIP).
 *
 * Fuente: RUBRICAS 2026 + manuales 2026 (CPEIP), destilados en
 * Portabot-2026/PORTAFOLIO (1)/PLANTILLAS_POR_MANUAL_2026/*.md
 * y la tabla "lógica condicional por manual" de PLAN_MEJORA_WEB_2026.md.
 *
 * Schema por manual:
 *   label, referente, oaPicker {modo,...}, aviso, duracionM1, duracionGrabada,
 *   camposEspeciales[], preguntasRubrica[], ejemplosCampoComun{}
 *
 * Reglas duras de contenido:
 *  - M1 (clases planificadas) = 90 min (1 bloque / 2 hrs pedagógicas) SIEMPRE,
 *    salvo PÁRVULO (45 min; sala cuna 40).
 *  - Clase grabada (M2) = 40-45 min (Parvularia diferenciada por nivel).
 *  - Los EJEMPLOS son genéricos y verosímiles: SIN nombres de alumnos ni RUT.
 *  - Módulo 3 (transversal a los 9): 2 adjuntos obligatorios siempre
 *    (medio de verificación + evidencia 5.1, máx 2 archivos); 5.4 individual.
 */
window.MANUAL_SPEC = {

  /* ===================== 1. BÁSICA ASIGNATURAS 1°-6° ===================== */
  "asignaturas_basica": {
    "label": "Ed. Básica Asignaturas (1° a 6°)",
    "referente": "Asignatura de inscripción + OA (Bases Curriculares)",
    "oaPicker": { "modo": "asignatura" },
    "aviso": "Te inscribes por UNA asignatura (1° a 6°). Referente = OA de las Bases Curriculares del nivel y asignatura. Presenta TRES experiencias en 1.1; la clase grabada (M2) dura ~40 min en la misma asignatura. La Tarea 3 es SOCIOEMOCIONAL (no familias) y solo suma si beneficia tu puntaje.",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas) por experiencia",
    "duracionGrabada": "~40 min (cierre opcional)",
    "camposEspeciales": [
      { "id": "asignatura", "label": "Asignatura de inscripción", "tipo": "select", "obligatorio": true, "ayuda": "Define el referente curricular (OA) de todo el Módulo 1 y de la clase grabada.", "ejemplo": "Matemática", "opciones": ["Artes Visuales","Ciencias Naturales","Educación Física y Salud","Francés","Historia, Geografía y Ciencias Sociales","Inglés","Lenguaje y Comunicación","Matemática","Música","Religión Católica","Religión Evangélica","Tecnología"] },
      { "id": "cursoLetra", "label": "Curso y letra", "tipo": "text", "obligatorio": true, "ayuda": "Identifica el grupo de las experiencias (multigrado = 'MG').", "ejemplo": "5° básico B" },
      { "id": "oa", "label": "OA seleccionado(s) (transcrito de las Bases)", "tipo": "textarea", "obligatorio": true, "ayuda": "Se copia tal cual; sobre este OA se monitorea y analiza en la Tarea 2. En Francés es un OF/CMO; en Religión Evangélica, un OA del Programa.", "ejemplo": "OA 09 (Matemática 5°): Demostrar que comprenden las fracciones propias..." },
      { "id": "nEstudiantes", "label": "N° de estudiantes del curso", "tipo": "number", "obligatorio": true, "ayuda": "Permite dimensionar la diversidad del grupo y la ficha de la clase grabada (4.2.b).", "ejemplo": "32" }
    ],
    "preguntasRubrica": [
      { "id": "diversidad2tipos", "label": "¿Qué DOS tipos de características de tu grupo consideraste al planificar?", "ayuda": "Rúbrica 'Fundamentación de la planificación' (1.2): exige al menos 2 de {de aprendizaje / contexto sociocultural / experiencias e intereses}.", "ejemplo": "De aprendizaje: hay 6 estudiantes que aún no consolidan el valor posicional. De experiencias e intereses: la mayoría sigue fútbol y videojuegos, lo que uso para contextualizar problemas.", "tipo": "textarea" },
      { "id": "actividadContextualizada", "label": "Describe UNA actividad contextualizada (que muestre el sentido/utilidad del aprendizaje)", "ayuda": "Es el nivel Destacado de 'Relación entre actividades y objetivos' (1.1).", "ejemplo": "Calcular en fracciones las porciones de una receta de cocina real para repartir entre los grupos del curso.", "tipo": "textarea" },
      { "id": "cicloFormativo", "label": "Tras monitorear, ¿qué CAUSAS (de distinta naturaleza) explican los resultados y qué ajuste hiciste?", "ayuda": "Cierra el ciclo EPA de la Tarea 2 (Destacado: causas pedagógicas Y contextuales; hacerse cargo de quienes lograron y quienes no).", "ejemplo": "Quienes fallaron confundían numerador y denominador (causa pedagógica: faltó material concreto) y varios faltaron a 2 clases (causa contextual). Reagrupé y volví a modelar con material concreto para ese subgrupo.", "tipo": "textarea" },
      { "id": "generoGrabada", "label": "En la clase grabada, ¿qué hiciste para desnaturalizar sesgos/estereotipos de género?", "ayuda": "Rúbrica 7 de la grabación + ficha 4.2.e (equidad de género).", "ejemplo": "Usé ejemplos donde tanto mujeres como hombres resuelven problemas matemáticos y equilibré los turnos de participación en el pizarrón.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Reconocen fracciones de uso cotidiano (mitad, cuarto) pero les cuesta representarlas gráficamente y compararlas.",
      "fortalezas": "Grupo participativo y colaborador; trabajan bien en parejas y se apoyan al explicarse entre ellos.",
      "dificultades": "Un subgrupo no consolidó el valor posicional; algunos abandonan la tarea ante problemas con varios pasos.",
      "oa": "OA de las Bases Curriculares vigentes del nivel y la asignatura de inscripción (transcrito literal).",
      "unidad": "Fracciones y su representación (Matemática 5° básico)."
    }
  },

  /* ===================== 2. 7°-8° Y MEDIA ASIGNATURAS ===================== */
  "asignaturas_media": {
    "label": "7°-8° básico y Ed. Media (Asignaturas)",
    "referente": "Asignatura de inscripción + OA (Bases Curriculares)",
    "oaPicker": { "modo": "asignatura" },
    "aviso": "Te inscribes por UNA asignatura (7° básico a 4° medio). Referente = OA de las Bases Curriculares. TRES experiencias en 1.1; la clase grabada (M2) dura ~40 min (NO se diferencia por nivel). La Tarea 3 es SOCIOEMOCIONAL (no familias) y solo suma si beneficia.",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas) por experiencia",
    "duracionGrabada": "~40 min (cierre opcional)",
    "camposEspeciales": [
      { "id": "asignatura", "label": "Asignatura de inscripción", "tipo": "select", "obligatorio": true, "ayuda": "Define el OA de referencia del Módulo 1 y de la clase grabada.", "ejemplo": "Lengua y Literatura", "opciones": ["Artes Visuales","Ciencias Naturales (Biología)","Ciencias Naturales (Física)","Ciencias Naturales (Química)","Ciencias para la Ciudadanía","Educación Ciudadana","Educación Física y Salud","Filosofía","Francés","Historia, Geografía y Ciencias Sociales","Inglés","Lengua y Literatura","Matemática","Música","Religión Católica","Religión Evangélica","Tecnología"] },
      { "id": "cursoNivel", "label": "Curso y nivel", "tipo": "text", "obligatorio": true, "ayuda": "Identifica el grupo (7° básico a 4° medio).", "ejemplo": "2° medio A" },
      { "id": "oa", "label": "OA seleccionado(s) (transcrito de las Bases)", "tipo": "textarea", "obligatorio": true, "ayuda": "La Tarea 2 (monitoreo y análisis) trabaja sobre ESTE mismo OA (punto b de 1.1).", "ejemplo": "OA 8 (Lengua y Literatura 2° medio): Formular una interpretación de los textos literarios..." },
      { "id": "nEstudiantes", "label": "N° de estudiantes del curso", "tipo": "number", "obligatorio": true, "ayuda": "Dimensiona el grupo y completa la ficha 4.2.b de la clase grabada.", "ejemplo": "38" }
    ],
    "preguntasRubrica": [
      { "id": "diversidad2tipos", "label": "¿Qué DOS tipos de características del grupo hacen pertinente tu estrategia?", "ayuda": "Rúbrica 'Fundamentación de la planificación' (1.2): mínimo 2 de {aprendizaje / sociocultural / experiencias e intereses}.", "ejemplo": "De aprendizaje: niveles dispares de comprensión lectora. De experiencias e intereses: hay estudiantes migrantes con referentes culturales distintos que aprovecho para enriquecer las interpretaciones.", "tipo": "textarea" },
      { "id": "monitoreoIndicadores", "label": "¿Qué INDICADORES usaste para monitorear y cómo recogiste evidencia?", "ayuda": "Rúbrica 'Estrategia de monitoreo' (2.1); Destacado = ofrecer distintas formas de demostrar el aprendizaje.", "ejemplo": "Indicador: 'fundamenta su interpretación citando el texto'. Recogí evidencia con un ticket de salida y una rúbrica de comentario oral, dando opción de responder por escrito o grabando un audio.", "tipo": "textarea" },
      { "id": "usoFormativo", "label": "¿Cómo te hiciste cargo tanto de quienes lograron como de quienes tuvieron dificultades?", "ayuda": "Nivel Destacado de 'Uso formativo de la información' (2.2).", "ejemplo": "A quienes lograron les propuse un texto más complejo; a quienes no, una pauta guiada de relectura y modelé en voz alta cómo localizar evidencia textual.", "tipo": "textarea" },
      { "id": "aprendizajeProfundo", "label": "En la clase grabada, ¿qué actividad promueve pensamiento crítico/creativo o metacognición?", "ayuda": "Rúbrica 4 de la grabación (aprendizaje profundo); Destacado = que evalúen o cuestionen ideas o sus procesos.", "ejemplo": "Pedí que contrastaran dos interpretaciones opuestas de un mismo poema y justificaran cuál les parece mejor fundada y por qué.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Identifican el tema central de un texto, pero les cuesta fundamentar una interpretación con evidencia textual.",
      "fortalezas": "Participan en debates y aportan puntos de vista; buena disposición al trabajo en grupos.",
      "dificultades": "Comprensión lectora dispar; un grupo abandona ante textos largos o de vocabulario denso.",
      "oa": "OA de las Bases Curriculares vigentes del nivel y la asignatura (transcrito literal).",
      "unidad": "Interpretación de textos literarios (Lengua y Literatura, 2° medio)."
    }
  },

  /* ===================== 3. BÁSICA GENERALISTA (1°-4°) ===================== */
  "generalista": {
    "label": "Ed. Básica Generalista (1° a 4°)",
    "referente": "Asignatura FIJA por módulo + OA",
    "oaPicker": { "modo": "fijo", "m1": "lenguaje", "m2": "matematica" },
    "aviso": "⚠️ FIJO (error #1): el Módulo 1 (Tareas 1-3) se planifica en LENGUAJE Y COMUNICACIÓN y la clase grabada (M2) es en MATEMÁTICA. Son asignaturas distintas, NO se invierten. La Tarea 3 es SOCIOEMOCIONAL (no familias).",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas) por experiencia — en Lenguaje",
    "duracionGrabada": "~40 min (cierre opcional) — en Matemática",
    "camposEspeciales": [
      { "id": "cursoLetra", "label": "Curso y letra (1° a 4°)", "tipo": "text", "obligatorio": true, "ayuda": "Multigrado/combinado = 'MG'. Los módulos pueden ser del mismo curso o de cursos distintos del Primer Ciclo.", "ejemplo": "2° básico B" },
      { "id": "oaLenguaje", "label": "OA de LENGUAJE (Módulo 1, transcrito)", "tipo": "textarea", "obligatorio": true, "ayuda": "Sobre este OA se arman las 3 experiencias y toda la Tarea 2. NO usar OA de Matemática aquí.", "ejemplo": "OA 5 (Lenguaje 2°): Demostrar comprensión de las narraciones leídas..." },
      { "id": "oaMatematica", "label": "OA de MATEMÁTICA (clase grabada M2, transcrito)", "tipo": "textarea", "obligatorio": true, "ayuda": "Solo para la clase grabada. NO planificar el Módulo 1 con este OA.", "ejemplo": "OA 9 (Matemática 2°): Demostrar que comprenden la adición y sustracción en el ámbito del 0 al 100..." },
      { "id": "nEstudiantes", "label": "N° de estudiantes del curso", "tipo": "number", "obligatorio": true, "ayuda": "Dimensiona el grupo y completa la ficha 4.2.b de la clase grabada de Matemática.", "ejemplo": "30" }
    ],
    "preguntasRubrica": [
      { "id": "tresExperienciasLenguaje", "label": "Tus TRES experiencias de Lenguaje (objetivo + actividad + monitoreo de cada una)", "ayuda": "1.1 exige exactamente tres (menos afecta el desempeño); ninguna puede ser 'solo aplicar una prueba'.", "ejemplo": "1) Lectura compartida de un cuento y predicciones; 2) Reconstrucción oral de la secuencia con imágenes; 3) Dramatización de un episodio. En cada una observo participación y comprensión con preguntas dirigidas.", "tipo": "textarea" },
      { "id": "diversidad2tipos", "label": "¿Qué DOS tipos de características del grupo hacen pertinente tu planificación de Lenguaje?", "ayuda": "Rúbrica 'Fundamentación' (1.2): mínimo 2 de {aprendizaje / sociocultural / experiencias e intereses}.", "ejemplo": "De aprendizaje: hay lectores iniciales y otros que ya leen oraciones. De experiencias e intereses: muchos disfrutan los cuentos de animales, que uso como hilo de las tres experiencias.", "tipo": "textarea" },
      { "id": "socioemocional", "label": "Tarea 3 (socioemocional): aprendizaje SE necesario + qué mantendrías/modificarías de tu actuar", "ayuda": "Rúbrica de la Tarea 3; Destacado = plantear hipótesis sobre lo que piensan/sienten los estudiantes.", "ejemplo": "Trabajar la autorregulación: ante la frustración algunos golpean la mesa. Mantendría el modelado de respiración y modificaría dar más tiempo de espera antes de pedir la respuesta.", "tipo": "textarea" },
      { "id": "generoGrabada", "label": "En la clase grabada de Matemática, ¿qué hiciste para evitar sesgos de género?", "ayuda": "Rúbrica 7 de la grabación + ficha 4.2.e.", "ejemplo": "Repartí equitativamente los turnos para manipular el material concreto y evité asociar 'ser bueno en matemática' con un género.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Reconocen las letras y leen palabras simples; en Matemática cuentan y agrupan hasta 100 con apoyo de material concreto.",
      "fortalezas": "Curiosos y motivados con los cuentos; les gusta manipular material concreto y trabajar en parejas.",
      "dificultades": "Algunos aún no consolidan la lectura fluida; en Matemática confunden decenas y unidades.",
      "oa": "M1: OA de Lenguaje y Comunicación (Bases 1°-4°). Clase grabada: OA de Matemática (Bases 1°-4°).",
      "unidad": "Lenguaje: comprensión de narraciones. Matemática (grabada): adición y sustracción hasta 100."
    }
  },

  /* ===================== 4. PARVULARIA ===================== */
  "parvularia": {
    "label": "Ed. Parvularia",
    "referente": "Ámbito BCEP + OA + OAT (Desarrollo Personal y Social)",
    "oaPicker": { "modo": "libre" },
    "aviso": "No uses asignaturas escolares: el referente es un Ámbito BCEP (Comunicación Integral O Interacción y Comprensión del Entorno) + un OAT del Ámbito Desarrollo Personal y Social. La Tarea 3 es TRABAJO CON FAMILIAS (no socioemocional). El adjunto de evidencias de 2.1 es OBLIGATORIO. El juego vive solo en la subtarea 2.2.",
    "duracionM1": "45 min (sala cuna 40 min) por experiencia",
    "duracionGrabada": "40 min Transición / 30 min Nivel Medio / 25 min Sala Cuna",
    "camposEspeciales": [
      { "id": "nivelGrupo", "label": "Nivel del grupo", "tipo": "select", "obligatorio": true, "ayuda": "Define la DURACIÓN de la experiencia grabada (Transición 40 / Medio 30 / Sala Cuna 25 min).", "ejemplo": "Primer Nivel de Transición", "opciones": ["Sala Cuna Menor","Sala Cuna Mayor","Nivel Medio Menor","Nivel Medio Mayor","Primer Nivel de Transición","Segundo Nivel de Transición"] },
      { "id": "ambitoOA", "label": "Ámbito BCEP + OA", "tipo": "textarea", "obligatorio": true, "ayuda": "Transcribe 1 OA de Comunicación Integral O Interacción y Comprensión del Entorno.", "ejemplo": "Comunicación Integral / Lenguaje Verbal, OA 6: Comprender contenidos explícitos de textos literarios..." },
      { "id": "oat", "label": "OAT — Desarrollo Personal y Social", "tipo": "textarea", "obligatorio": true, "ayuda": "Transcribe 1 OAT del Ámbito Desarrollo Personal y Social (acompaña al OA en cada experiencia).", "ejemplo": "Identidad y Autonomía, OA 3: Manifestar progresiva independencia en la elección de actividades..." },
      { "id": "evidencias21", "label": "Evidencias/registros del aprendizaje (2.1) — OBLIGATORIO", "tipo": "textarea", "obligatorio": true, "ayuda": "Subtarea 2.1 exige adjuntar evidencias reales (fotos de momentos clave, registros de observación, muestras de trabajo). No pueden ir en blanco.", "ejemplo": "Fotografías de la mesa de exploración, registro anecdótico de 3 momentos y muestras de los dibujos de los niños/as." }
    ],
    "preguntasRubrica": [
      { "id": "caracterizacion3areas", "label": "Caracteriza al grupo en al menos 3 áreas (cognitivo / sociocultural / socioemocional / motriz)", "ayuda": "Subtarea 1.1: es el cimiento de toda fundamentación posterior (1.3, 2.1, 2.2). Destacado = describir lo que ya saben usando los distintos Ámbitos BCEP.", "ejemplo": "Cognitivo: amplían vocabulario y siguen instrucciones de 2 pasos. Socioemocional: les cuesta esperar turnos. Motriz: buena coordinación gruesa, en proceso la pinza fina.", "tipo": "textarea" },
      { "id": "instanciaJuego", "label": "Instancia de juego/lúdica (2.2): una decisión pedagógica + por qué la tomaste", "ayuda": "Subtarea 2.2: fundamentar UNA decisión (rol, espacio, recursos, tiempo, interacciones) ligada a las características del grupo y a lo que hace al juego significativo.", "ejemplo": "En el juego de la feria dejé que ellos definieran los roles (vendedor/comprador) porque el grupo necesita ejercitar autonomía y negociación; esto lo hizo motivante y flexible.", "tipo": "textarea" },
      { "id": "trabajoFamilias", "label": "Tarea 3 (FAMILIAS): aspecto a trabajar + cómo involucraste a las familias + rol que asumieron", "ayuda": "En Parvularia la Tarea 3 es trabajo con familias. Destacado = participación activa de las familias en la toma de decisiones o reflexión conjunta.", "ejemplo": "Para fortalecer el lenguaje, las familias grabaron cuentos en casa y propusieron palabras del hogar; decidimos juntos un 'diccionario familiar' que sumamos al aula.", "tipo": "textarea" },
      { "id": "generoGrabada", "label": "En la experiencia grabada, ¿qué hiciste para evitar sesgos/estereotipos de género?", "ayuda": "Rúbrica 8 de la grabación + ficha 4.2 (equidad de género).", "ejemplo": "Ofrecí los mismos rincones y materiales a niñas y niños y evité frases como 'esto es de niñas'; reforcé que todos/as pueden liderar el juego.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Reconocen y nombran objetos cotidianos, siguen instrucciones simples y disfrutan que les lean cuentos.",
      "fortalezas": "Grupo curioso y expresivo; participan con entusiasmo en experiencias lúdicas y de exploración.",
      "dificultades": "Les cuesta esperar turnos y autorregularse; algunos están en proceso de adquirir vocabulario.",
      "oa": "OA de un Ámbito BCEP (Comunicación Integral o Interacción y Comprensión del Entorno) + OAT de Desarrollo Personal y Social.",
      "unidad": "Experiencia para el aprendizaje del Ámbito elegido (no se organiza por 'unidades' escolares)."
    }
  },

  /* ===================== 5. MEDIA TÉCNICO PROFESIONAL ===================== */
  "tp": {
    "label": "Ed. Media Técnico Profesional",
    "referente": "Especialidad + Módulo + OA + Aprendizaje esperado + Criterios + OAG",
    "oaPicker": { "modo": "libre" },
    "aviso": "NO uses el módulo 'Emprendimiento y empleabilidad' (prohibido). Las 3 experiencias deben ser prácticas o teórico-prácticas (ninguna solo teórica) e integrar uno o más OAG. La clase grabada (M2) es un SEGMENTO de 40 min (los primeros 40 de un bloque), con actividad práctica; indica el lugar (sala/taller/laboratorio/cocina/aire libre). En sistema dual NO grabar en el lugar de práctica del estudiante. La Tarea 3 es SOCIOEMOCIONAL.",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas); mínimo 40 min por experiencia",
    "duracionGrabada": "Segmento de 40 min (primeros 40 min de un bloque)",
    "camposEspeciales": [
      { "id": "especialidad", "label": "Especialidad de inscripción", "tipo": "text", "obligatorio": true, "ayuda": "Marco curricular = Bases de la Formación Diferenciada TP de tu especialidad.", "ejemplo": "Gastronomía, mención Cocina" },
      { "id": "modulo", "label": "Módulo de la especialidad", "tipo": "text", "obligatorio": true, "ayuda": "Módulo (plan común o mención) de las experiencias. NO 'Emprendimiento y empleabilidad'.", "ejemplo": "Elaboración de alimentos de baja complejidad" },
      { "id": "oaAEcriterios", "label": "OA + Aprendizaje esperado + Criterios de evaluación", "tipo": "textarea", "obligatorio": true, "ayuda": "OA de las Bases TP + Aprendizaje esperado y Criterios del Programa de Estudio (se pueden editar/acortar).", "ejemplo": "OA: prepara alimentos básicos cumpliendo higiene. Aprendizaje esperado: aplica normas de higiene y manipulación. Criterio: utiliza utensilios e indumentaria según protocolo." },
      { "id": "oag", "label": "OAG (Objetivos de Aprendizaje Genéricos) a integrar", "tipo": "textarea", "obligatorio": true, "ayuda": "Hay una rúbrica dedicada: cada experiencia integra OAG con las competencias técnicas (no como adorno).", "ejemplo": "OAG B (trabajar eficazmente en equipo) y OAG D (leer e interpretar instrucciones técnicas)." },
      { "id": "lugarGrabada", "label": "Lugar del segmento grabado", "tipo": "select", "obligatorio": true, "ayuda": "El técnico debe tener visión completa; segmento de 40 min con actividad práctica.", "ejemplo": "Cocina / taller de alimentación", "opciones": ["Sala de clases","Taller","Laboratorio","Cocina","Al aire libre"] }
    ],
    "preguntasRubrica": [
      { "id": "integracionOAG", "label": "¿Cómo integras un OAG con la competencia técnica en una experiencia?", "ayuda": "Rúbrica 'Integración de aprendizajes genéricos' (1.1); Destacado = además reflexionar sobre el sentido/importancia del aprendizaje genérico.", "ejemplo": "Mientras elaboran un preparado por estaciones, integro el trabajo en equipo (OAG B): cada rol depende del otro y al cierre evalúan cómo se coordinaron y por qué importa en una cocina real.", "tipo": "textarea" },
      { "id": "vinculoLaboral", "label": "En el segmento grabado, ¿cómo la actividad práctica acerca al contexto laboral?", "ayuda": "Rúbrica 8 de la grabación (aprendizaje situado); Destacado = vincular con aspectos específicos del contexto laboral actual.", "ejemplo": "Trabajan con la ficha técnica y los tiempos de un servicio real de restaurante; replican el flujo de una cocina de producción y los estándares de higiene del rubro.", "tipo": "textarea" },
      { "id": "diversidad2tipos", "label": "¿Qué DOS tipos de características del grupo hacen pertinente tu estrategia?", "ayuda": "Rúbrica 'Fundamentación de la planificación' (1.2): mínimo 2 de {aprendizaje / sociocultural / experiencias e intereses}.", "ejemplo": "De aprendizaje: niveles distintos de destreza manual. De experiencias e intereses: varios ya trabajan en el rubro los fines de semana, lo que aprovecho para problemas reales.", "tipo": "textarea" },
      { "id": "socioemocional", "label": "Tarea 3 (socioemocional): aprendizaje SE + qué mantendrías/modificarías de tu actuar", "ayuda": "Rúbrica de la Tarea 3; Destacado = hipótesis sobre lo que piensan/sienten.", "ejemplo": "Trabajar la tolerancia a la frustración: abandonan la preparación cuando no les sale. Mantendría retroalimentar el proceso y modificaría permitir reintentos sin penalizar.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Manejan utensilios básicos y nociones de higiene, pero les cuesta ajustar tiempos y secuenciar un proceso completo.",
      "fortalezas": "Motivados con el trabajo práctico; aprenden rápido por imitación y disfrutan elaborar un producto final.",
      "dificultades": "Destrezas manuales dispares; algunos no leen con cuidado las fichas técnicas y se saltan pasos.",
      "oa": "OA de las Bases Curriculares TP + Aprendizaje esperado y Criterios del Programa de Estudio del módulo.",
      "unidad": "Módulo de la especialidad (p. ej. Elaboración de alimentos de baja complejidad)."
    }
  },

  /* ===================== 6. EPJA ===================== */
  "epja": {
    "label": "Ed. de Personas Jóvenes y Adultas (EPJA)",
    "referente": "Nivel + OA (Bases EPJA, Dto. 136) u OF (Marco EPJA, Dto. 257)",
    "oaPicker": { "modo": "libre" },
    "aviso": "Trata al curso como personas jóvenes y adultas (trayectorias educativas, edad, mundo laboral, asistencia variable), NO como adolescentes escolares. Referente = OA (Bases EPJA Dto. 136/2025) para Nivel Básico 1-2 y Nivel Medio 1; OF (Marco EPJA Dto. 257) para los demás niveles. Si el curso es MULTINIVEL, rotúlalo 'MN'. La Tarea 3 es SOCIOEMOCIONAL (no familias) y solo suma si beneficia.",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas) por experiencia",
    "duracionGrabada": "~40 min (cierre opcional; NO se diferencia por nivel)",
    "camposEspeciales": [
      { "id": "nivelAsignatura", "label": "Nivel y asignatura de inscripción", "tipo": "text", "obligatorio": true, "ayuda": "El nivel define si el referente es OA (Dto. 136) u OF (Dto. 257).", "ejemplo": "Nivel Medio 1 (1° y 2° medio HC) — Matemática" },
      { "id": "multinivel", "label": "¿Curso multinivel?", "tipo": "select", "obligatorio": true, "ayuda": "Si combinas niveles, se rotula 'MN' en 1.1 y en la ficha 4.2.", "ejemplo": "Sí", "opciones": ["No","Sí"] },
      { "id": "oaOf", "label": "OA u OF (transcrito del referente vigente)", "tipo": "textarea", "obligatorio": true, "ayuda": "Cópialo literal desde 'Referentes curriculares' de DocenteMás para tu nivel/asignatura.", "ejemplo": "OF (Marco EPJA): Resolver problemas de la vida cotidiana usando proporciones y porcentajes." },
      { "id": "contextoAdultos", "label": "Contexto del grupo (trayectorias / rango etario / mundo laboral)", "tipo": "textarea", "obligatorio": true, "ayuda": "Sostiene la pertinencia y contextualización exigidas por las rúbricas de EPJA.", "ejemplo": "Adultos de 25 a 55 años, varios retomaron estudios tras años fuera del sistema; la mayoría trabaja en comercio y construcción." }
    ],
    "preguntasRubrica": [
      { "id": "diversidad2tipos", "label": "¿Qué DOS tipos de características (trayectorias, edad, mundo laboral...) hacen pertinente tu estrategia?", "ayuda": "Rúbrica 'Fundamentación' (1.2): mínimo 2 de {aprendizaje incl. trayectorias / sociocultural / experiencias e intereses incl. rango etario y mundo laboral}.", "ejemplo": "De aprendizaje: trayectorias interrumpidas, algunos no operan con fracciones. De experiencias e intereses: usan porcentajes en su trabajo (descuentos, cuotas), lo que uso para contextualizar.", "tipo": "textarea" },
      { "id": "contextualizacion", "label": "¿Cómo contextualizas el aprendizaje para que vean su sentido/utilidad?", "ayuda": "Destacado de 'Relación entre actividades y objetivos' (1.1): actividad contextualizada.", "ejemplo": "Calcular el costo total de una compra a crédito con su interés, usando boletas reales que ellos traen de su vida cotidiana.", "tipo": "textarea" },
      { "id": "usoFormativo", "label": "Tras monitorear, ¿qué causas explican los resultados y cómo te hiciste cargo de logrados y rezagados?", "ayuda": "Ciclo EPA (Tarea 2); Destacado = causas de distinta naturaleza + hacerse cargo de ambos grupos.", "ejemplo": "Faltó conectar con su experiencia (causa pedagógica) y la asistencia fue irregular (contextual). A quienes avanzaron les di problemas más complejos; a los demás, guías con apoyo paso a paso.", "tipo": "textarea" },
      { "id": "socioemocional", "label": "Tarea 3 (socioemocional): aprendizaje SE necesario + qué mantendrías/modificarías", "ayuda": "Rúbrica de la Tarea 3; Destacado = hipótesis sobre lo que piensan/sienten.", "ejemplo": "Reforzar la confianza académica: muchos creen que 'ya no son capaces de aprender'. Mantendría destacar sus logros y modificaría bajar la exposición pública del error.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Manejan operaciones básicas aplicadas a su vida diaria, pero presentan vacíos por trayectorias educativas interrumpidas.",
      "fortalezas": "Adultos motivados y responsables; aportan experiencia de vida y laboral que enriquece las clases.",
      "dificultades": "Asistencia irregular por trabajo; baja confianza académica y heterogeneidad de niveles.",
      "oa": "OA de las Bases EPJA (Dto. 136/2025) u OF del Marco EPJA (Dto. 257), según el nivel.",
      "unidad": "Unidad de la asignatura de inscripción contextualizada a la vida adulta/laboral."
    }
  },

  /* ===================== 7. ESPECIAL ESCUELA REGULAR ===================== */
  "especial_regular": {
    "label": "Ed. Especial — Escuela Regular / Lenguaje / EPJA",
    "referente": "Contexto + Asignatura o Núcleo + Objetivo Curricular + OAT",
    "oaPicker": { "modo": "libre" },
    "aviso": "Declara tu CONTEXTO (Escuela de Lenguaje / Escuela Regular CON o SIN PIE / EPJA): condiciona el currículum a citar. La caracterización (1.1) exige al menos DOS diferencias y DOS aspectos en común del curso (referidos a ≥2 ámbitos). Redacta DIVERSIFICACIÓN (no 'apoyo PIE genérico'); la adecuación curricular solo si es necesaria. La Tarea 3 tiene DOS subtareas (3.1 comunidad inclusiva + 3.2 socioemocional). El M1 NO lleva adjuntos. Solo en Escuela Regular SIN PIE y aula de recursos puedes presentar 1 estudiante.",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas) por experiencia",
    "duracionGrabada": "~40 min en aula común (cierre opcional; salvo excepción aula de recursos)",
    "camposEspeciales": [
      { "id": "contexto", "label": "Contexto de inscripción", "tipo": "select", "obligatorio": true, "ayuda": "Define qué currículum citas y si puedes presentar 1 estudiante (solo Regular sin PIE + aula de recursos).", "ejemplo": "Escuela Regular con PIE", "opciones": ["Escuela de Lenguaje","Escuela Regular con PIE","Escuela Regular sin PIE","EPJA"] },
      { "id": "cursoAsignaturaNucleo", "label": "Curso/nivel + Asignatura o Núcleo", "tipo": "text", "obligatorio": true, "ayuda": "Núcleo si es Parvularia; asignatura si es Básica/Media/EPJA. Multigrado: señala los cursos.", "ejemplo": "7° básico — Lenguaje y Comunicación" },
      { "id": "objetivoCurricular", "label": "Objetivo Curricular de la Unidad + OAT", "tipo": "textarea", "obligatorio": true, "ayuda": "OA (Parvularia/Básica/Media) u OF Dto.257 / OA Dto.136 (EPJA) + el objetivo transversal.", "ejemplo": "OA 14 (Lenguaje 7°): Escribir artículos informativos... + OAT: trabajar colaborativamente respetando las diferencias." },
      { "id": "coDocencia", "label": "¿Hay co-docencia / co-enseñanza?", "tipo": "select", "obligatorio": true, "ayuda": "Se describe en 1.2; en la grabación TÚ debes dirigir toda la clase (el otro profesional con rol secundario).", "ejemplo": "Sí", "opciones": ["No","Sí"] }
    ],
    "preguntasRubrica": [
      { "id": "dosDiferencias", "label": "DOS diferencias + DOS aspectos en común del curso (referidos a ≥2 ámbitos)", "ayuda": "Núcleo de la subtarea 1.1; Destacado = explicar cómo la heterogeneidad enriquece el proceso. Ámbitos: intereses / talentos / socioemocional / conocimientos previos-percepción / comunicación / necesidades educativas / contexto social-cultural-familiar.", "ejemplo": "Diferencias: 4 estudiantes con TEL comprenden mejor con apoyo visual; otros leen con fluidez. Comunes: todos disfrutan el trabajo por proyectos y comparten el contexto sociocultural del barrio.", "tipo": "textarea" },
      { "id": "diversificacion", "label": "¿Qué estrategia de diversificación usaste y a qué diferencia concreta responde?", "ayuda": "Rúbrica 'Fundamentación de las decisiones de diversificación' (1.3) + rúbrica 'Diversificación' de la grabada (ficha 4.2.h). Da ejemplos; NO 'apoyo genérico'.", "ejemplo": "Para quienes tienen TEL, entregué las instrucciones en pictogramas y permití responder con un organizador gráfico, respondiendo a su forma de percibir y expresar la información.", "tipo": "textarea" },
      { "id": "comunidadInclusiva", "label": "Tarea 3.1: DOS factores que facilitan y dificultan una comunidad educativa inclusiva", "ayuda": "Rúbrica de 3.1; Destacado = analizar la interdependencia de esos factores.", "ejemplo": "Facilita: el equipo PIE coordina con los docentes de aula semanalmente. Dificulta: faltan tiempos protegidos para co-planificar, lo que limita la diversificación.", "tipo": "textarea" },
      { "id": "socioemocional", "label": "Tarea 3.2 (socioemocional): aprendizaje SE observado + qué mantendrías/modificarías", "ayuda": "Rúbrica de 3.2; solo suma si beneficia. Destacado = hipótesis sobre lo que piensan/sienten.", "ejemplo": "Trabajar la autoestima académica: algunos se autodescalifican ('soy malo para esto'). Mantendría el refuerzo de avances y modificaría reducir la comparación entre pares.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Heterogéneos: algunos requieren apoyo visual o más tiempo; otros trabajan de forma autónoma en la asignatura/núcleo.",
      "fortalezas": "Curso solidario que se apoya entre pares; responden bien al trabajo por proyectos y al uso de apoyos visuales.",
      "dificultades": "Diferencias marcadas en ritmos y formas de comunicar/comprender; algunos requieren diversificación en el acceso a la información.",
      "oa": "Objetivo Curricular de la Unidad (OA por asignatura/núcleo, u OF/OA EPJA) + OAT.",
      "unidad": "Unidad Pedagógica del núcleo/asignatura, planificada con enfoque inclusivo y diversificación."
    }
  },

  /* ===================== 8. ESPECIAL ESCUELA ESPECIAL (NEEP) ===================== */
  "especial_especial": {
    "label": "Ed. Especial — Escuela Especial (NEEP)",
    "referente": "Ámbito / Asignatura / Área de Desarrollo + OA (u Objetivos Generales del Nivel Laboral) + OAT",
    "oaPicker": { "modo": "libre" },
    "aviso": "El marco rector es el enfoque ECOLÓGICO FUNCIONAL: el aprendizaje debe tener sentido y ser funcional en los contextos de vida del estudiante, SIN reducir el desafío. La caracterización (1.1) se centra en lo que SABEN HACER y los APOYOS que requieren (no en el diagnóstico clínico). Indica si trabajas con un GRUPO o con UN solo estudiante (cambia la versión de rúbricas). La Tarea 3 tiene DOS subtareas (3.1 familias + 3.2 fortalezas/necesidades profesionales).",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas) por experiencia",
    "duracionGrabada": "~40 min (cierre opcional; NO se diferencia por nivel)",
    "camposEspeciales": [
      { "id": "nivel", "label": "Nivel", "tipo": "select", "obligatorio": true, "ayuda": "En Nivel Laboral el referente son los Objetivos Generales (no OA por asignatura).", "ejemplo": "Educación Básica", "opciones": ["Educación Parvularia","Educación Básica","Educación Media","Nivel Laboral"] },
      { "id": "ambitoAreaOA", "label": "Ámbito / Asignatura / Área de Desarrollo + OA (u Objetivos Generales) + OAT", "tipo": "textarea", "obligatorio": true, "ayuda": "Elige UN Ámbito/Asignatura/Área (o varios si integras). En Nivel Laboral usa Objetivos Generales.", "ejemplo": "Área de Desarrollo: Comunicación. OA: comunicar necesidades básicas mediante sistema aumentativo. OAT: regular impulsos en actividades grupales." },
      { "id": "grupoOuno", "label": "¿Grupo o un solo estudiante?", "tipo": "select", "obligatorio": true, "ayuda": "Si trabajas habitualmente con un/a solo/a estudiante NEEP, desarrollas Tareas 1 y 2 en función de él/ella (rúbricas con versión específica).", "ejemplo": "Grupo", "opciones": ["Grupo","Un solo estudiante"] },
      { "id": "contextoFamiliar", "label": "Contexto familiar/comunitario relevante", "tipo": "textarea", "obligatorio": true, "ayuda": "La fundamentación (1.3, enfoque ecológico funcional) exige explicar cómo el aprendizaje será útil en sus contextos de vida.", "ejemplo": "Varios usan transporte público con apoyo de la familia; trabajar el reconocimiento de paraderos y dinero aporta a su autonomía cotidiana." }
    ],
    "preguntasRubrica": [
      { "id": "caracterizacionApoyos", "label": "Caracteriza al grupo: lo que SABEN HACER + apoyos requeridos (≥2 elementos)", "ayuda": "Subtarea 1.1; Destacado = reconocer una fortaleza ligada al Ámbito/Área y explicarla. Elementos: lengua/sistema de comunicación, forma de percibir/comprender, necesidades de apoyo, motivaciones/intereses, forma de relacionarse.", "ejemplo": "Comunican necesidades con gestos y pictogramas; comprenden mejor con apoyo visual y rutinas estables. Requieren apoyo en comunicación y en la transición entre actividades.", "tipo": "textarea" },
      { "id": "ecologicoFuncional", "label": "¿Cómo aseguras que el aprendizaje sea FUNCIONAL y útil en sus contextos (enfoque ecológico funcional)?", "ayuda": "Rúbrica 'Fundamentación de las decisiones desde un enfoque ecológico funcional' (1.3); Destacado = situación inicial → progreso esperado.", "ejemplo": "Aprenden a identificar monedas comprando en un 'almacén' montado en la sala, replicando la compra real que hacen con su familia; parten reconociendo $100 y avanzan a combinar montos.", "tipo": "textarea" },
      { "id": "rolActivo", "label": "¿Cómo promueves un rol activo sin reducir el desafío?", "ayuda": "Rúbrica 'Promoción de un rol activo'; hacer la actividad por el/la estudiante o pedir mera repetición NO cuenta.", "ejemplo": "Doy tiempo y apoyos (modelado, pictogramas) para que ellos manipulen el dinero y decidan, en vez de entregarles la respuesta; intervengo solo cuando lo necesitan.", "tipo": "textarea" },
      { "id": "trabajoFamilias", "label": "Tarea 3.1 (FAMILIAS): aspecto trabajado con la familia + cómo las involucraste", "ayuda": "Rúbrica de 3.1; Destacado = involucrarlas en reflexión conjunta o en las decisiones.", "ejemplo": "Para reforzar la autonomía en la alimentación, acordamos con las familias rutinas iguales en casa y en la escuela y revisamos juntos los avances cada quincena.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Reconocen rutinas y objetos de uso diario; comunican necesidades básicas con apoyo de gestos o pictogramas.",
      "fortalezas": "Responden muy bien a rutinas estables y al apoyo visual; motivados con actividades funcionales y concretas.",
      "dificultades": "Requieren apoyos en comunicación y en las transiciones; la generalización de lo aprendido a otros contextos toma tiempo.",
      "oa": "OA del Ámbito/Asignatura/Área de Desarrollo (u Objetivos Generales del Nivel Laboral) + OAT.",
      "unidad": "Unidad Pedagógica con aprendizajes funcionales y con sentido para sus contextos de vida."
    }
  },

  /* ===================== 9. CONTEXTOS DE ENCIERRO ===================== */
  "encierro": {
    "label": "Ed. en Contextos de Encierro",
    "referente": "OFV/OA + OFT de EPJA + Unidad Pedagógica",
    "oaPicker": { "modo": "libre" },
    "aviso": "Referente = OFV/OA + OFT de EPJA (Dto. 257 o Bases EPJA Dto. 136 según nivel); los OA/OAT de educación regular solo como complemento, nombrados DESPUÉS. La Tarea 1 es la IMPLEMENTACIÓN DE UNA UNIDAD (3 clases). La caracterización (1.1) pide edades, género, TRAYECTORIAS escolares y los CAMBIOS de composición del curso (ingresos/retiros). La Tarea 3 tiene DOS subtareas (3.1 creencias + 3.2 contingencias del encierro). La grabación NO se sube por la Plataforma.",
    "duracionM1": "90 min (1 bloque / 2 horas pedagógicas) por clase",
    "duracionGrabada": "~40 min (cierre opcional; duración única, no por nivel)",
    "camposEspeciales": [
      { "id": "nivelCurso", "label": "Nivel y curso (Básica o Media EPJA)", "tipo": "text", "obligatorio": true, "ayuda": "Identifica el curso del nivel por el que te evalúas.", "ejemplo": "Primer Nivel Básico B" },
      { "id": "asignatura", "label": "Asignatura de inscripción", "tipo": "text", "obligatorio": true, "ayuda": "Determina el OFV/OA + OFT de EPJA que transcribes.", "ejemplo": "Lenguaje y Comunicación" },
      { "id": "unidadPedagogica", "label": "Unidad Pedagógica + OFV/OA + OFT de EPJA", "tipo": "textarea", "obligatorio": true, "ayuda": "La Tarea 1 describe 3 clases de UNA Unidad ya desarrollada; nombra primero el referente EPJA.", "ejemplo": "Unidad 'El relato de mi vida'. OFV (EPJA): producir textos escritos pertinentes a propósitos comunicativos. OFT: valorar la propia historia y proyecto de vida." },
      { "id": "cambiosComposicion", "label": "Cambios en la composición del curso (ingresos/retiros)", "tipo": "textarea", "obligatorio": true, "ayuda": "La rúbrica de 1.1 exige considerar a quienes se incorporan o deben abandonar el curso durante el proceso.", "ejemplo": "Durante la Unidad ingresaron 2 estudiantes trasladados de otra unidad penal y 1 fue dado de baja por traslado; ajusté grupos y nivelé contenidos." }
    ],
    "preguntasRubrica": [
      { "id": "trayectorias", "label": "Caracteriza trayectorias escolares (niveles aprobados, retrasos, discontinuidades) y cómo aprovechas sus fortalezas", "ayuda": "Rúbrica 'Caracterización' (1.1); Destacado = dar cuenta de la diversidad y/o aprovechar las fortalezas.", "ejemplo": "La mayoría dejó el sistema en enseñanza básica hace más de 10 años; varios leen y escriben con seguridad y se apoyan en eso para acompañar a quienes recién retoman.", "tipo": "textarea" },
      { "id": "intencionPedagogica", "label": "Tarea 1.3: intención/propósito de tus clases para su trayectoria, biografía y futuro", "ayuda": "Rúbrica 'Reflexión sobre la intención pedagógica'; Destacado = claridad/profundidad considerando la privación de libertad e impacto positivo.", "ejemplo": "Busco que recuperen la confianza en que pueden retomar un proyecto educativo y que la escritura les sirva para reconstruir su historia y proyectarse al egreso.", "tipo": "textarea" },
      { "id": "autoevaluacion", "label": "Tarea 2.1: ¿cómo promoviste que los estudiantes evalúen su propio progreso (autoevaluación)?", "ayuda": "Rúbrica 'Promoción de las competencias de autoevaluación'; Destacado = múltiples estrategias y/o pensar cómo aprender mejor.", "ejemplo": "Usé una pauta donde marcan qué lograron y qué les costó tras cada texto, y conversamos qué estrategia probarían la próxima vez.", "tipo": "textarea" },
      { "id": "contingencias", "label": "Tarea 3.2: contingencias del encierro que obstaculizan el proceso + cómo las abordaste", "ayuda": "Rúbrica 'Reflexión sobre las contingencias'; Destacado = problematizar y evaluar cómo das continuidad al proceso.", "ejemplo": "Allanamientos y atenciones de otros profesionales en horario de clases cortan la continuidad; planifico clases modulares y dejo material de avance autónomo para retomar sin perder el hilo.", "tipo": "textarea" }
    ],
    "ejemplosCampoComun": {
      "conocimientosPrevios": "Heterogéneos por trayectorias interrumpidas: algunos leen y escriben con seguridad, otros recién consolidan la escritura.",
      "fortalezas": "Adultos con mucha experiencia de vida; comprometidos cuando ven sentido y utilidad en lo que aprenden.",
      "dificultades": "Discontinuidad por rutinas de seguridad y allanamientos; composición del curso cambiante (ingresos y retiros).",
      "oa": "OFV/OA + OFT del Marco/Bases de EPJA (Dto. 257 o Dto. 136); complemento de ed. regular opcional, nombrado después.",
      "unidad": "Unidad Pedagógica de varias clases en la asignatura de inscripción, contextualizada al contexto de encierro."
    }
  }

};
