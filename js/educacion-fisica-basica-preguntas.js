(function(root) {
  'use strict';

  const preguntas = [
    // DOMINIO 1: APTITUD FÍSICA (15 preguntas - más fáciles, con imágenes)
    {
      id: 1,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "Observa la imagen de un estudiante realizando una plancha abdominal. ¿Qué tipo de contracción muscular se produce en los abdominales?",
      imagen: "/imagenes/educacion-fisica/estabilidad.svg",
      alternativas: [
        "Contracción concéntrica (músculos se acortan)",
        "Contracción isométrica (tensión constante sin cambio de longitud)",
        "Contracción excéntrica (músculos se alargan bajo tensión)",
        "Contracción pliométrica (ciclo estiramiento-acortamiento)"
      ],
      correcta: 1,
      explicacion: "En la plancha isométrica, los abdominales generan tensión para mantener la posición sin cambiar su longitud. Es una contracción estática ideal para desarrollar fuerza resistencia en niños."
    },
    {
      id: 2,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "¿Qué componente de la aptitud física se evalúa con el test de 'Sit and Reach' mostrado en la imagen?",
      imagen: "/imagenes/educacion-fisica/estacion-4-flexibilidad.svg",
      alternativas: [
        "Fuerza explosiva de miembros inferiores",
        "Velocidad de reacción ante estímulos",
        "Flexibilidad de isquiotibiales y zona lumbar",
        "Resistencia cardiovascular aeróbica"
      ],
      correcta: 2,
      explicacion: "El Sit and Reach mide la flexibilidad de la cadena posterior (isquiotibiales, glúteos, zona lumbar). Es un test simple y seguro para escolares de básica."
    },
    {
      id: 3,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "En la imagen de un estudiante saltando la cuerda, ¿qué cualidad física se desarrolla principalmente?",
      imagen: "/imagenes/educacion-fisica/coordinacion.svg",
      alternativas: [
        "Flexibilidad pasiva de miembros superiores",
        "Resistencia aeróbica y coordinación rítmica",
        "Fuerza máxima con cargas externas pesadas",
        "Equilibrio estático sin movimiento"
      ],
      correcta: 1,
      explicacion: "Saltar la cuerda combina resistencia cardiovascular (trabajo aeróbico continuo) con coordinación óculo-manual y rítmica. Es actividad lúdica apropiada para básica."
    },
    {
      id: 4,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "Según la imagen de un diagrama anatómico, ¿qué músculo es responsable de la extensión del brazo en el lanzamiento?",
      imagen: "/imagenes/educacion-fisica/manipulacion.svg",
      alternativas: [
        "Bíceps braquial (flexor del codo)",
        "Tríceps braquial (extensor del codo)",
        "Deltoides (abductor del hombro)",
        "Pectoral mayor (aductor del hombro)"
      ],
      correcta: 1,
      explicacion: "El tríceps es el extensor principal del codo. En lanzamientos, se contrae concéntricamente para acelerar el implemento. Es fundamental en deportes de invasión."
    },
    {
      id: 5,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "Observa la imagen de un estudiante con obesidad realizando caminata. ¿Qué tipo de actividad es más recomendable inicialmente?",
      alternativas: [
        "Ejercicios de alto impacto como saltos",
        "Actividades de bajo impacto moderado como caminata o natación",
        "Levantamiento de pesas máximo (>90% 1RM)",
        "Ejercicios isométricos estáticos prolongados"
      ],
      correcta: 1,
      explicacion: "En obesidad infantil, bajo impacto protege articulaciones. Intensidad moderada es sostenible y mejora adherencia. Progresar gradualmente hacia mayor intensidad."
    },
    {
      id: 6,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "¿Qué zona de frecuencia cardíaca corresponde a trabajo aeróbico moderado en niños (60-70% FC máx)?",
      alternativas: [
        "180-200 lat/min (zona alta 80-90%)",
        "120-140 lat/min (zona baja 50-60%)",
        "140-160 lat/min (zona moderada 60-70%)",
        "100-120 lat/min (zona muy baja <50%)"
      ],
      correcta: 2,
      explicacion: "Para un niño con FC máx 200 lat/min, 60-70% = 120-140 lat/min. Esta zona desarrolla resistencia aeróbica sin fatiga excesiva ni riesgo cardiovascular."
    },
    {
      id: 7,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "En la imagen de un diagrama de sistemas energéticos, ¿cuál predomina en un sprint de 50 metros?",
      alternativas: [
        "Sistema aeróbico oxidativo (duración >2 min)",
        "Sistema anaeróbico láctico (duración 30-90 seg)",
        "Sistema ATP-PC (duración 10-15 seg)",
        "Sistema mixto aeróbico-anaeróbico"
      ],
      correcta: 2,
      explicacion: "En esfuerzos cortos (10-15 seg), predomina ATP-PC (fosfocreatina) que provee energía inmediata sin oxígeno ni lactato. Ideal para actividades explosivas en básica."
    },
    {
      id: 8,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "¿Qué hormona es clave para el desarrollo muscular en la adolescencia?",
      alternativas: [
        "Insulina (reguladora de glucosa)",
        "Testosterona (anabólica para crecimiento)",
        "Melatonina (reguladora del sueño)",
        "Tiroxina (metabolismo basal)"
      ],
      correcta: 1,
      explicacion: "Testosterona es hormona anabólica que promueve hipertrofia muscular. En prepúberes (básica), niveles bajos; priorizar fuerza neural y resistencia."
    },
    {
      id: 9,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "Observa la imagen de un estudiante en equilibrio sobre un pie. ¿Qué capacidad se desarrolla?",
      imagen: "/imagenes/educacion-fisica/estabilidad.svg",
      alternativas: [
        "Velocidad lineal de desplazamiento",
        "Equilibrio estático y propiocepción",
        "Fuerza máxima isométrica",
        "Resistencia anaeróbica láctica"
      ],
      correcta: 1,
      explicacion: "Equilibrio unipodal desarrolla propiocepción (sensación de posición corporal) y estabilidad estática. Importante para prevención de lesiones y coordinación."
    },
    {
      id: 10,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "Según la OMS, ¿cuántos minutos diarios de actividad física vigorosa necesitan niños de 5-17 años?",
      alternativas: [
        "30 minutos diarios moderados",
        "45 minutos diarios vigorosos",
        "60 minutos diarios moderados-vigorosos",
        "90 minutos diarios mixtos"
      ],
      correcta: 2,
      explicacion: "OMS recomienda mínimo 60 minutos diarios de AFMV (moderada-vigorosa) para niños. Incluye recreos activos, educación física y juego libre."
    },
    {
      id: 11,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "En la imagen de un circuito de ejercicios, ¿qué principio FITT se refiere a '3 veces por semana'?",
      alternativas: [
        "Intensity (intensidad del esfuerzo)",
        "Time (duración por sesión)",
        "Frequency (frecuencia semanal)",
        "Type (tipo de actividad)"
      ],
      correcta: 2,
      explicacion: "Frequency = veces por semana. Para niños, 3-4 sesiones semanales permiten recuperación y adherencia sin sobreentrenamiento."
    },
    {
      id: 12,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "¿Qué tipo de fuerza es más apropiado trabajar en educación básica?",
      alternativas: [
        "Fuerza máxima con cargas pesadas",
        "Fuerza resistencia con peso corporal",
        "Fuerza explosiva olímpica",
        "Fuerza isométrica prolongada"
      ],
      correcta: 1,
      explicacion: "Fuerza resistencia (repeticiones moderadas, baja carga) usando peso corporal. Evita riesgos óseos-articulares en desarrollo."
    },
    {
      id: 13,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "Observa la imagen de un estudiante lesionado. ¿Cuál es el protocolo RICE correcto?",
      alternativas: [
        "Calor + Masaje + Movimiento continuo",
        "Reposo + Hielo + Compresión + Elevación",
        "Ejercicio intenso + Calor + Fricción",
        "Ignorar y continuar actividad"
      ],
      correcta: 1,
      explicacion: "RICE: Reposo (detener), Hielo (reducir inflamación), Compresión (contener edema), Elevación (mejorar retorno venoso). Derivar a profesional."
    },
    {
      id: 14,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "En la imagen de un diagrama motor, ¿cuál es la secuencia correcta de adquisición de habilidades?",
      alternativas: [
        "Especializadas → Fundamentales → Rudimentarias",
        "Rudimentarias → Fundamentales → Especializadas",
        "Fundamentales → Rudimentarias → Especializadas",
        "Reflejas → Especializadas → Fundamentales"
      ],
      correcta: 1,
      explicacion: "Secuencia natural: Reflejas (0-1 año) → Rudimentarias (1-2: gateo) → Fundamentales (2-7: correr, saltar) → Especializadas (7-12+: técnicas específicas)."
    },
    {
      id: 15,
      dominio: "Dominio 1: Aptitud Física",
      enunciado: "¿Qué test mide resistencia aeróbica corriendo máxima distancia en 12 minutos?",
      alternativas: [
        "Test de Cooper",
        "Test de Sit and Reach",
        "Test de Sargent",
        "Test de 30 metros"
      ],
      correcta: 0,
      explicacion: "Test de Cooper: distancia recorrida en 12 minutos estima VO2máx. Protocolo estandarizado para escolares."
    },

    // DOMINIO 2: MANIFESTACIONES DE LA MOTRICIDAD (15 preguntas - con imágenes y nuevos temas)
    {
      id: 16,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "Observa la imagen de una secuencia de juego de básquetbol. ¿Qué principio ofensivo se aplica al desmarcarse?",
      imagen: "/imagenes/educacion-fisica/manipulacion.svg",
      alternativas: [
        "Proteger la portería propia",
        "Crear espacios para recibir pase",
        "Interceptar pases del rival",
        "Presionar al portador del balón"
      ],
      correcta: 1,
      explicacion: "Desmarcarse crea espacios libres para recibir pases, facilitando progresión hacia canasta. Principio básico de ataque en deportes de invasión."
    },
    {
      id: 17,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "¿Qué danza folclórica se representa en la imagen con movimientos circulares y pañuelo?",
      alternativas: [
        "Cueca chilena",
        "Trote altiplánico",
        "Sau-sau de Rapa Nui",
        "Choike Purrun mapuche"
      ],
      correcta: 0,
      explicacion: "La Cueca usa pañuelo blanco en movimientos circulares que simbolizan galanteo. Es danza nacional chilena, transmitida culturalmente."
    },
    {
      id: 18,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de un estudiante en silla de ruedas jugando básquetbol, ¿qué adaptación promueve inclusión?",
      imagen: "/imagenes/educacion-fisica/inclusion-diversidad.svg",
      alternativas: [
        "Excluir al estudiante del juego",
        "Crear equipo separado solo para discapacitados",
        "Todos juegan sentados para igualar condiciones",
        "Asignar roles pasivos sin participación activa"
      ],
      correcta: 2,
      explicacion: "Diseño Universal para el Aprendizaje: igualar condiciones (todos sentados) permite participación plena, fomenta empatía y habilidades compartidas."
    },
    {
      id: 19,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "¿Qué deporte se clasifica como 'individual' según la imagen de natación?",
      alternativas: [
        "Fútbol (colectivo de invasión)",
        "Natación (individual contra reloj)",
        "Voleibol (colectivo de cooperación)",
        "Básquetbol (colectivo de invasión)"
      ],
      correcta: 1,
      explicacion: "Deportes individuales: rendimiento personal determina resultado (natación, atletismo). Colectivos requieren coordinación grupal."
    },
    {
      id: 20,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de expresión corporal. ¿Qué elemento se refiere al pulso y ritmo?",
      alternativas: [
        "Espacio (niveles y trayectorias)",
        "Tiempo (pulso, ritmo, velocidad)",
        "Intensidad (energía y fuerza)",
        "Forma (silueta corporal)"
      ],
      correcta: 1,
      explicacion: "Elemento tiempo: pulso (latido constante), ritmo (patrón de acentos), tempo (velocidad). Base de la danza y movimiento expresivo."
    },
    {
      id: 21,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "¿Qué habilidad se desarrolla en la imagen de lanzamiento de balón medicinal?",
      imagen: "/imagenes/educacion-fisica/manipulacion.svg",
      alternativas: [
        "Resistencia aeróbica prolongada",
        "Coordinación óculo-manual y potencia",
        "Equilibrio unipodal estático",
        "Flexibilidad pasiva"
      ],
      correcta: 1,
      explicacion: "Lanzamiento medicinal requiere coordinación ojo-mano y potencia explosiva de tren superior. Ejercicio pliométrico apropiado para básica."
    },
    {
      id: 22,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de un juego cooperativo, ¿cuál es el objetivo principal?",
      alternativas: [
        "Competir para ganar individualmente",
        "Desarrollar habilidades socioemocionales",
        "Enseñar técnicas de alto rendimiento",
        "Trabajar solo fuerza física"
      ],
      correcta: 1,
      explicacion: "Juegos cooperativos priorizan proceso: comunicación, empatía, resolución de conflictos, trabajo en equipo sobre resultado competitivo."
    },
    {
      id: 23,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "¿Qué implemento tradicional se usa en la danza mostrada en la imagen?",
      alternativas: [
        "Bombo nortino",
        "Pañuelo blanco",
        "Chascas mapuche",
        "Riu ceremonial"
      ],
      correcta: 1,
      explicacion: "Pañuelo blanco en Cueca simboliza galanteo entre hombre y mujer. Elemento identitario de la danza folclórica chilena."
    },
    {
      id: 24,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "Observa la imagen de gimnasia artística. ¿Qué deporte es este?",
      alternativas: [
        "Deporte de invasión (fútbol)",
        "Deporte estático (gimnasia)",
        "Deporte de cooperación (voleibol)",
        "Deporte de oposición (tenis)"
      ],
      correcta: 1,
      explicacion: "Gimnasia artística es deporte estático: rutinas acrobáticas evaluadas por forma, dificultad y ejecución. Individual o colectiva."
    },
    {
      id: 25,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "¿Qué principio defensivo se muestra en la imagen de fútbol?",
      alternativas: [
        "Finalizar jugada con tiro",
        "Marcar al rival y recuperar balón",
        "Crear espacios ofensivos",
        "Conservar posesión"
      ],
      correcta: 1,
      explicacion: "Principio defensivo: marcar cerca al portador, presionar para forzar errores, recuperar posesión. Transición defensa-ataque."
    },
    {
      id: 26,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de danza contemporánea, ¿qué la diferencia de danzas folclóricas?",
      alternativas: [
        "Movimientos lentos vs rápidos",
        "Transmisión cultural tradicional vs creación moderna",
        "Solo música clásica vs electrónica",
        "Grupos grandes vs individuales"
      ],
      correcta: 1,
      explicacion: "Folclóricas: patrimonio cultural transmitido generación tras generación. Contemporáneas: expresión artística moderna, sin códigos tradicionales fijos."
    },
    {
      id: 27,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "¿Qué se entiende por 'espacio personal' en la imagen de expresión corporal?",
      alternativas: [
        "Espacio público visible",
        "Alcance de brazos sin desplazamiento",
        "Espacio privado invisible",
        "Solo en salas cerradas"
      ],
      correcta: 1,
      explicacion: "Espacio personal = kinesfera (radio de acción sin mover pies). Espacio general = área total de movimiento. Conceptos de Rudolf Laban."
    },
    {
      id: 28,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "Observa la imagen de tecnología en educación física. ¿Cómo se usa una app para registrar actividad?",
      alternativas: [
        "Para competir online contra otros",
        "Monitorear pasos y frecuencia cardíaca",
        "Solo para ver videos instructivos",
        "Reemplazar completamente al profesor"
      ],
      correcta: 1,
      explicacion: "Tecnología en EF: apps para seguimiento cuantitativo (pasos, FC, calorías). Complementa enseñanza, fomenta autonomía y conciencia corporal."
    },
    {
      id: 29,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "¿Qué juego se clasifica como 'masivo' en la imagen de 30 estudiantes?",
      alternativas: [
        "Juego individual",
        "Juego en parejas",
        "Juego masivo o de gran grupo",
        "Juego en pequeños grupos"
      ],
      correcta: 2,
      explicacion: "Juegos masivos: todo el curso participa simultáneamente (quemados, cadenas de pilla-pilla, bailes colectivos). Favorecen inclusión y participación."
    },
    {
      id: 30,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de educación inclusiva, ¿qué adaptación se usa para diversidad funcional?",
      alternativas: [
        "Separar por capacidad",
        "Modificar reglas para participación plena",
        "Excluir actividades",
        "Roles pasivos"
      ],
      correcta: 1,
      explicacion: "Inclusión: adaptar reglas, implementos, espacios. Diseño Universal asegura acceso equitativo para todos los estudiantes."
    },

    // DOMINIO 3: PROCESOS DE ENSEÑANZA-APRENDIZAJE (10 preguntas - pedagógicas, con nuevos temas)
    {
      id: 31,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "¿Qué estilo de Mosston permite que estudiantes elijan dificultad según capacidad?",
      alternativas: [
        "Estilo A - Mando Directo",
        "Estilo E - Inclusión",
        "Estilo H - Resolución de Problemas",
        "Estilo C - Recíproca"
      ],
      correcta: 1,
      explicacion: "Estilo E (Inclusión): misma tarea con niveles ajustables. Estudiante elige dificultad apropiada, fomenta autoconocimiento sin exclusión."
    },
    {
      id: 32,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "¿Qué evaluación se realiza al inicio para conocer conocimientos previos?",
      alternativas: [
        "Diagnóstica",
        "Sumativa",
        "Autoevaluación",
        "Coevaluación"
      ],
      correcta: 0,
      explicacion: "Evaluación diagnóstica: identifica nivel de partida, conocimientos previos. Permite ajustar planificación sin calificar."
    },
    {
      id: 33,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "¿Qué instrumento describe niveles de desempeño con criterios específicos?",
      alternativas: [
        "Prueba cerrada",
        "Rúbrica analítica",
        "Lista binaria",
        "Escala numérica simple"
      ],
      correcta: 1,
      explicacion: "Rúbrica: criterios + descriptores de niveles (excelente, bueno, suficiente). Objetiva y formativa para retroalimentación."
    },
    {
      id: 34,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "En la imagen de estudiantes usando tablets, ¿cómo se integra tecnología en EF?",
      alternativas: [
        "Reemplazar clases presenciales",
        "Complementar con videos y seguimiento digital",
        "Solo para entretenimiento",
        "Competencia virtual"
      ],
      correcta: 1,
      explicacion: "Tecnología complementa: videos demostrativos, apps de seguimiento, realidad aumentada. Enriquecen enseñanza sin reemplazar interacción docente."
    },
    {
      id: 35,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "¿Qué principio DUA ofrece información en múltiples formatos?",
      alternativas: [
        "Múltiples formas de acción",
        "Múltiples formas de representación",
        "Múltiples formas de implicación",
        "Múltiples formas de evaluación"
      ],
      correcta: 1,
      explicacion: "DUA Principio I: representar contenido en diversos formatos (visual, auditivo, kinestésico) para acceso universal."
    },
    {
      id: 36,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "¿Qué evaluación ocurre durante el proceso con retroalimentación?",
      alternativas: [
        "Diagnóstica",
        "Formativa",
        "Sumativa",
        "Heteroevaluación"
      ],
      correcta: 1,
      explicacion: "Evaluación formativa: continua, feedback descriptivo para mejorar. No califica; propósito pedagógico."
    },
    {
      id: 37,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "En la imagen de salud mental, ¿cómo promueve EF bienestar emocional?",
      alternativas: [
        "Solo trabajo físico intenso",
        "Actividades que reducen estrés y mejoran autoestima",
        "Competencia agresiva",
        "Aislamiento individual"
      ],
      correcta: 1,
      explicacion: "EF promueve salud mental: reduce ansiedad, mejora autoestima, fomenta socialización, enseña resiliencia emocional."
    },
    {
      id: 38,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "¿Qué estilo usa parejas con roles alternados de ejecutor y observador?",
      alternativas: [
        "Estilo A - Directo",
        "Estilo B - Asignación",
        "Estilo C - Recíproca",
        "Estilo E - Inclusión"
      ],
      correcta: 2,
      explicacion: "Estilo C (Recíproca): trabajo en parejas con checklist. Ejecutor realiza, observador evalúa con criterios. Desarrolla metacognición."
    },
    {
      id: 39,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "¿Qué estrategia evalúa el estudiante su propio desempeño?",
      alternativas: [
        "Heteroevaluación",
        "Autoevaluación",
        "Coevaluación",
        "Evaluación externa"
      ],
      correcta: 1,
      explicacion: "Autoevaluación: estudiante reflexiona usando criterios. Desarrolla autonomía crítica y metacognición."
    },
    {
      id: 40,
      dominio: "Dominio 3: Procesos de Enseñanza-Aprendizaje",
      enunciado: "Observa la imagen de inclusión. ¿Qué se favorece?",
      imagen: "/imagenes/educacion-fisica/inclusion-diversidad.svg",
      alternativas: [
        "Segregación",
        "Participación equitativa para todos",
        "Exclusión",
        "Observación pasiva"
      ],
      correcta: 1,
      explicacion: "Inclusión: adaptar actividades para diversidad funcional. Diseño Universal asegura acceso y participación plena."
    },

    // CASOS INTEGRADOS (10 preguntas - con temas nuevos)
    {
      id: 41,
      dominio: "Casos Integrados",
      contexto: "CASO: Circuito de acondicionamiento con imágenes de estaciones. Estudiante con fatiga.",
      enunciado: "¿Qué acción prioritaria tomar?",
      alternativas: [
        "Forzar continuación",
        "Detener, hidratar, reducir intensidad",
        "Aplicar calor",
        "Ignorar síntomas"
      ],
      correcta: 1,
      explicacion: "Fatiga en obesidad: detener, hidratar, reducir carga. Monitorear signos vitales, derivar si persiste."
    },
    {
      id: 42,
      dominio: "Casos Integrados",
      contexto: "CASO: Juego cooperativo con conflicto. Imagen muestra estudiantes discutiendo.",
      enunciado: "¿Qué intervención pedagógica usar?",
      alternativas: [
        "Ignorar conflicto",
        "Pausar, validar emociones, facilitar diálogo",
        "Castigar ambos",
        "Decisión unilateral"
      ],
      correcta: 1,
      explicacion: "Mediación: validar emociones, facilitar diálogo consensuado. Enseña resolución pacífica y empatía."
    },
    {
      id: 43,
      dominio: "Casos Integrados",
      contexto: "CASO: Uso de app para seguimiento en EF. Imagen de estudiantes con dispositivos.",
      enunciado: "¿Qué beneficio principal aporta?",
      alternativas: [
        "Reemplaza profesor",
        "Fomenta autonomía y conciencia corporal",
        "Solo entretenimiento",
        "Competencia virtual"
      ],
      correcta: 1,
      explicacion: "Tecnología: seguimiento cuantitativo (pasos, FC, calorías), promueve autonomía y motivación intrínseca."
    },
    {
      id: 44,
      dominio: "Casos Integrados",
      contexto: "CASO: Actividad inclusiva con silla de ruedas. Imagen muestra adaptación.",
      enunciado: "¿Qué principio se aplica?",
      alternativas: [
        "Separar estudiantes",
        "Diseño Universal para igualar condiciones",
        "Excluir participación",
        "Roles pasivos"
      ],
      correcta: 1,
      explicacion: "DUA: adaptar para inclusión plena. Todos participan en condiciones equitativas, fomenta empatía."
    },
    {
      id: 45,
      dominio: "Casos Integrados",
      contexto: "CASO: Evaluación formativa en circuito. Imagen de checklist.",
      enunciado: "¿Qué instrumento usar?",
      alternativas: [
        "Examen escrito",
        "Lista de cotejo observacional",
        "Nota final única",
        "Sin evaluación"
      ],
      correcta: 1,
      explicacion: "Lista de cotejo: indicadores observables para retroalimentación inmediata durante actividad."
    },
    {
      id: 46,
      dominio: "Casos Integrados",
      contexto: "CASO: Salud mental en EF. Imagen de actividad relajante.",
      enunciado: "¿Qué se promueve?",
      alternativas: [
        "Solo físico",
        "Bienestar emocional y reducción de estrés",
        "Agresividad",
        "Aislamiento"
      ],
      correcta: 1,
      explicacion: "EF integra salud mental: actividades que reducen ansiedad, mejoran autoestima, enseñan manejo emocional."
    },
    {
      id: 47,
      dominio: "Casos Integrados",
      contexto: "CASO: Progresión didáctica. Imagen de secuencia de juegos.",
      enunciado: "¿Cuál es la secuencia correcta?",
      alternativas: [
        "Deportivo → Pre-deportivo",
        "Libre → Reglado → Pre-deportivo → Deportivo",
        "Todos simultáneos",
        "Pre-deportivo → Libre"
      ],
      correcta: 1,
      explicacion: "Progresión: Libre (exploración) → Reglado (reglas simples) → Pre-deportivo (fundamentos) → Deportivo (completo)."
    },
    {
      id: 48,
      dominio: "Casos Integrados",
      contexto: "CASO: Conflicto en juego. Imagen de mediación docente.",
      enunciado: "¿Qué se enseña?",
      alternativas: [
        "Competencia agresiva",
        "Resolución pacífica y empatía",
        "Ignorar problemas",
        "Castigo inmediato"
      ],
      correcta: 1,
      explicacion: "Mediación enseña diálogo, validación emocional, soluciones consensuadas. Desarrolla habilidades socioemocionales."
    },
    {
      id: 49,
      dominio: "Casos Integrados",
      contexto: "CASO: Tecnología en planificación. Imagen de software.",
      enunciado: "¿Cómo se usa?",
      alternativas: [
        "Reemplazar enseñanza",
        "Complementar con recursos digitales",
        "Solo videos",
        "Competencia virtual"
      ],
      correcta: 1,
      explicacion: "Tecnología complementa: planificación digital, videos demostrativos, seguimiento online. Enriquecen sin sustituir interacción."
    },
    {
      id: 50,
      dominio: "Casos Integrados",
      contexto: "CASO: Inclusión con diversidad. Imagen de adaptación.",
      enunciado: "¿Qué se promueve?",
      alternativas: [
        "Segregación",
        "Participación equitativa para todos",
        "Exclusión",
        "Observación pasiva"
      ],
      correcta: 1,
      explicacion: "Inclusión: adaptar actividades para diversidad funcional. Diseño Universal asegura acceso y participación plena."
    }
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = preguntas;
  }

  if (root) {
    root.efBasicaPreguntas = preguntas;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));