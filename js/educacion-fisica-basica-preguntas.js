(function(root) {
  '\''use strict'\'';

  const preguntas = [
    // DOMINIO 1: APTITUD F�SICA (15 preguntas - m�s f�ciles, con im�genes)
    {
      id: 1,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "Observa la imagen de un estudiante realizando una plancha abdominal. �Qu� tipo de contracci�n muscular se produce en los abdominales?",
      alternativas: [
        "Contracci�n conc�ntrica (m�sculos se acortan)",
        "Contracci�n isom�trica (tensi�n constante sin cambio de longitud)",
        "Contracci�n exc�ntrica (m�sculos se alargan bajo tensi�n)",
        "Contracci�n pliom�trica (ciclo estiramiento-acortamiento)"
      ],
      correcta: 1,
      explicacion: "En la plancha isom�trica, los abdominales generan tensi�n para mantener la posici�n sin cambiar su longitud. Es una contracci�n est�tica ideal para desarrollar fuerza resistencia en ni�os."
    },
    {
      id: 2,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "�Qu� componente de la aptitud f�sica se eval�a con el test de '\''Sit and Reach'\'' mostrado en la imagen?",
      alternativas: [
        "Fuerza explosiva de miembros inferiores",
        "Velocidad de reacci�n ante est�mulos",
        "Flexibilidad de isquiotibiales y zona lumbar",
        "Resistencia cardiovascular aer�bica"
      ],
      correcta: 2,
      explicacion: "El Sit and Reach mide la flexibilidad de la cadena posterior (isquiotibiales, gl�teos, zona lumbar). Es un test simple y seguro para escolares de b�sica."
    },
    {
      id: 3,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "En la imagen de un estudiante saltando la cuerda, �qu� cualidad f�sica se desarrolla principalmente?",
      alternativas: [
        "Flexibilidad pasiva de miembros superiores",
        "Resistencia aer�bica y coordinaci�n r�tmica",
        "Fuerza m�xima con cargas externas pesadas",
        "Equilibrio est�tico sin movimiento"
      ],
      correcta: 1,
      explicacion: "Saltar la cuerda combina resistencia cardiovascular (trabajo aer�bico continuo) con coordinaci�n �culo-manual y r�tmica. Es actividad l�dica apropiada para b�sica."
    },
    {
      id: 4,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "Seg�n la imagen de un diagrama anat�mico, �qu� m�sculo es responsable de la extensi�n del brazo en el lanzamiento?",
      alternativas: [
        "B�ceps braquial (flexor del codo)",
        "Tr�ceps braquial (extensor del codo)",
        "Deltoides (abductor del hombro)",
        "Pectoral mayor (aductor del hombro)"
      ],
      correcta: 1,
      explicacion: "El tr�ceps es el extensor principal del codo. En lanzamientos, se contrae conc�ntricamente para acelerar el implemento. Es fundamental en deportes de invasi�n."
    },
    {
      id: 5,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "Observa la imagen de un estudiante con obesidad realizando caminata. �Qu� tipo de actividad es m�s recomendable inicialmente?",
      alternativas: [
        "Ejercicios de alto impacto como saltos",
        "Actividades de bajo impacto moderado como caminata o nataci�n",
        "Levantamiento de pesas m�ximo (>90% 1RM)",
        "Ejercicios isom�tricos est�ticos prolongados"
      ],
      correcta: 1,
      explicacion: "En obesidad infantil, bajo impacto protege articulaciones. Intensidad moderada es sostenible y mejora adherencia. Progresar gradualmente hacia mayor intensidad."
    },
    {
      id: 6,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "�Qu� zona de frecuencia card�aca corresponde a trabajo aer�bico moderado en ni�os (60-70% FC m�x)?",
      alternativas: [
        "180-200 lat/min (zona alta 80-90%)",
        "120-140 lat/min (zona baja 50-60%)",
        "140-160 lat/min (zona moderada 60-70%)",
        "100-120 lat/min (zona muy baja <50%)"
      ],
      correcta: 2,
      explicacion: "Para un ni�o con FC m�x 200 lat/min, 60-70% = 120-140 lat/min. Esta zona desarrolla resistencia aer�bica sin fatiga excesiva ni riesgo cardiovascular."
    },
    {
      id: 7,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "En la imagen de un diagrama de sistemas energ�ticos, �cu�l predomina en un sprint de 50 metros?",
      alternativas: [
        "Sistema aer�bico oxidativo (duraci�n >2 min)",
        "Sistema anaer�bico l�ctico (duraci�n 30-90 seg)",
        "Sistema ATP-PC (duraci�n 10-15 seg)",
        "Sistema mixto aer�bico-anaer�bico"
      ],
      correcta: 2,
      explicacion: "En esfuerzos cortos (10-15 seg), predomina ATP-PC (fosfocreatina) que provee energ�a inmediata sin ox�geno ni lactato. Ideal para actividades explosivas en b�sica."
    },
    {
      id: 8,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "�Qu� hormona es clave para el desarrollo muscular en la adolescencia?",
      alternativas: [
        "Insulina (reguladora de glucosa)",
        "Testosterona (anab�lica para crecimiento)",
        "Melatonina (reguladora del sue�o)",
        "Tiroxina (metabolismo basal)"
      ],
      correcta: 1,
      explicacion: "Testosterona es hormona anab�lica que promueve hipertrofia muscular. En prep�beres (b�sica), niveles bajos; priorizar fuerza neural y resistencia."
    },
    {
      id: 9,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "Observa la imagen de un estudiante en equilibrio sobre un pie. �Qu� capacidad se desarrolla?",
      alternativas: [
        "Velocidad lineal de desplazamiento",
        "Equilibrio est�tico y propiocepci�n",
        "Fuerza m�xima isom�trica",
        "Resistencia anaer�bica l�ctica"
      ],
      correcta: 1,
      explicacion: "Equilibrio unipodal desarrolla propiocepci�n (sensaci�n de posici�n corporal) y estabilidad est�tica. Importante para prevenci�n de lesiones y coordinaci�n."
    },
    {
      id: 10,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "Seg�n la OMS, �cu�ntos minutos diarios de actividad f�sica vigorosa necesitan ni�os de 5-17 a�os?",
      alternativas: [
        "30 minutos diarios moderados",
        "45 minutos diarios vigorosos",
        "60 minutos diarios moderados-vigorosos",
        "90 minutos diarios mixtos"
      ],
      correcta: 2,
      explicacion: "OMS recomienda m�nimo 60 minutos diarios de AFMV (moderada-vigorosa) para ni�os. Incluye recreos activos, educaci�n f�sica y juego libre."
    },
    {
      id: 11,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "En la imagen de un circuito de ejercicios, �qu� principio FITT se refiere a '\''3 veces por semana'\''?",
      alternativas: [
        "Intensity (intensidad del esfuerzo)",
        "Time (duraci�n por sesi�n)",
        "Frequency (frecuencia semanal)",
        "Type (tipo de actividad)"
      ],
      correcta: 2,
      explicacion: "Frequency = veces por semana. Para ni�os, 3-4 sesiones semanales permiten recuperaci�n y adherencia sin sobreentrenamiento."
    },
    {
      id: 12,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "�Qu� tipo de fuerza es m�s apropiado trabajar en educaci�n b�sica?",
      alternativas: [
        "Fuerza m�xima con cargas pesadas",
        "Fuerza resistencia con peso corporal",
        "Fuerza explosiva ol�mpica",
        "Fuerza isom�trica prolongada"
      ],
      correcta: 1,
      explicacion: "Fuerza resistencia (repeticiones moderadas, baja carga) usando peso corporal. Evita riesgos �seos-articulares en desarrollo."
    },
    {
      id: 13,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "Observa la imagen de un estudiante lesionado. �Cu�l es el protocolo RICE correcto?",
      alternativas: [
        "Calor + Masaje + Movimiento continuo",
        "Reposo + Hielo + Compresi�n + Elevaci�n",
        "Ejercicio intenso + Calor + Fricci�n",
        "Ignorar y continuar actividad"
      ],
      correcta: 1,
      explicacion: "RICE: Reposo (detener), Hielo (reducir inflamaci�n), Compresi�n (contener edema), Elevaci�n (mejorar retorno venoso). Derivar a profesional."
    },
    {
      id: 14,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "En la imagen de un diagrama motor, �cu�l es la secuencia correcta de adquisici�n de habilidades?",
      alternativas: [
        "Especializadas  Fundamentales  Rudimentarias",
        "Rudimentarias  Fundamentales  Especializadas",
        "Fundamentales  Rudimentarias  Especializadas",
        "Reflejas  Especializadas  Fundamentales"
      ],
      correcta: 1,
      explicacion: "Secuencia natural: Reflejas (0-1 a�o)  Rudimentarias (1-2: gateo)  Fundamentales (2-7: correr, saltar)  Especializadas (7-12+: t�cnicas espec�ficas)."
    },
    {
      id: 15,
      dominio: "Dominio 1: Aptitud F�sica",
      enunciado: "�Qu� test mide resistencia aer�bica corriendo m�xima distancia en 12 minutos?",
      alternativas: [
        "Test de Cooper",
        "Test de Sit and Reach",
        "Test de Sargent",
        "Test de 30 metros"
      ],
      correcta: 0,
      explicacion: "Test de Cooper: distancia recorrida en 12 minutos estima VO2m�x. Protocolo estandarizado para escolares."
    },

    // DOMINIO 2: MANIFESTACIONES DE LA MOTRICIDAD (15 preguntas - con im�genes y nuevos temas)
    {
      id: 16,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "Observa la imagen de una secuencia de juego de b�squetbol. �Qu� principio ofensivo se aplica al desmarcarse?",
      alternativas: [
        "Proteger la porter�a propia",
        "Crear espacios para recibir pase",
        "Interceptar pases del rival",
        "Presionar al portador del bal�n"
      ],
      correcta: 1,
      explicacion: "Desmarcarse crea espacios libres para recibir pases, facilitando progresi�n hacia canasta. Principio b�sico de ataque en deportes de invasi�n."
    },
    {
      id: 17,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "�Qu� danza folcl�rica se representa en la imagen con movimientos circulares y pa�uelo?",
      alternativas: [
        "Cueca chilena",
        "Trote altipl�nico",
        "Sau-sau de Rapa Nui",
        "Choike Purrun mapuche"
      ],
      correcta: 0,
      explicacion: "La Cueca usa pa�uelo blanco en movimientos circulares que simbolizan galanteo. Es danza nacional chilena, transmitida culturalmente."
    },
    {
      id: 18,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de un estudiante en silla de ruedas jugando b�squetbol, �qu� adaptaci�n promueve inclusi�n?",
      alternativas: [
        "Excluir al estudiante del juego",
        "Crear equipo separado solo para discapacitados",
        "Todos juegan sentados para igualar condiciones",
        "Asignar roles pasivos sin participaci�n activa"
      ],
      correcta: 2,
      explicacion: "Dise�o Universal para el Aprendizaje: igualar condiciones (todos sentados) permite participaci�n plena, fomenta empat�a y habilidades compartidas."
    },
    {
      id: 19,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "�Qu� deporte se clasifica como '\''individual'\'' seg�n la imagen de nataci�n?",
      alternativas: [
        "F�tbol (colectivo de invasi�n)",
        "Nataci�n (individual contra reloj)",
        "Voleibol (colectivo de cooperaci�n)",
        "B�squetbol (colectivo de invasi�n)"
      ],
      correcta: 1,
      explicacion: "Deportes individuales: rendimiento personal determina resultado (nataci�n, atletismo). Colectivos requieren coordinaci�n grupal."
    },
    {
      id: 20,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de expresi�n corporal. �Qu� elemento se refiere al pulso y ritmo?",
      alternativas: [
        "Espacio (niveles y trayectorias)",
        "Tiempo (pulso, ritmo, velocidad)",
        "Intensidad (energ�a y fuerza)",
        "Forma (silueta corporal)"
      ],
      correcta: 1,
      explicacion: "Elemento tiempo: pulso (latido constante), ritmo (patr�n de acentos), tempo (velocidad). Base de la danza y movimiento expresivo."
    },
    {
      id: 21,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "�Qu� habilidad se desarrolla en la imagen de lanzamiento de bal�n medicinal?",
      alternativas: [
        "Resistencia aer�bica prolongada",
        "Coordinaci�n �culo-manual y potencia",
        "Equilibrio unipodal est�tico",
        "Flexibilidad pasiva"
      ],
      correcta: 1,
      explicacion: "Lanzamiento medicinal requiere coordinaci�n ojo-mano y potencia explosiva de tren superior. Ejercicio pliom�trico apropiado para b�sica."
    },
    {
      id: 22,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de un juego cooperativo, �cu�l es el objetivo principal?",
      alternativas: [
        "Competir para ganar individualmente",
        "Desarrollar habilidades socioemocionales",
        "Ense�ar t�cnicas de alto rendimiento",
        "Trabajar solo fuerza f�sica"
      ],
      correcta: 1,
      explicacion: "Juegos cooperativos priorizan proceso: comunicaci�n, empat�a, resoluci�n de conflictos, trabajo en equipo sobre resultado competitivo."
    },
    {
      id: 23,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "�Qu� implemento tradicional se usa en la danza mostrada en la imagen?",
      alternativas: [
        "Bombo nortino",
        "Pa�uelo blanco",
        "Chascas mapuche",
        "Riu ceremonial"
      ],
      correcta: 1,
      explicacion: "Pa�uelo blanco en Cueca simboliza galanteo entre hombre y mujer. Elemento identitario de la danza folcl�rica chilena."
    },
    {
      id: 24,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "Observa la imagen de gimnasia art�stica. �Qu� deporte es este?",
      alternativas: [
        "Deporte de invasi�n (f�tbol)",
        "Deporte est�tico (gimnasia)",
        "Deporte de cooperaci�n (voleibol)",
        "Deporte de oposici�n (tenis)"
      ],
      correcta: 1,
      explicacion: "Gimnasia art�stica es deporte est�tico: rutinas acrob�ticas evaluadas por forma, dificultad y ejecuci�n. Individual o colectiva."
    },
    {
      id: 25,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "�Qu� principio defensivo se muestra en la imagen de f�tbol?",
      alternativas: [
        "Finalizar jugada con tiro",
        "Marcar al rival y recuperar bal�n",
        "Crear espacios ofensivos",
        "Conservar posesi�n"
      ],
      correcta: 1,
      explicacion: "Principio defensivo: marcar cerca al portador, presionar para forzar errores, recuperar posesi�n. Transici�n defensa-ataque."
    },
    {
      id: 26,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de danza contempor�nea, �qu� la diferencia de danzas folcl�ricas?",
      alternativas: [
        "Movimientos lentos vs r�pidos",
        "Transmisi�n cultural tradicional vs creaci�n moderna",
        "Solo m�sica cl�sica vs electr�nica",
        "Grupos grandes vs individuales"
      ],
      correcta: 1,
      explicacion: "Folcl�ricas: patrimonio cultural transmitido generaci�n tras generaci�n. Contempor�neas: expresi�n art�stica moderna, sin c�digos tradicionales fijos."
    },
    {
      id: 27,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "�Qu� se entiende por '\''espacio personal'\'' en la imagen de expresi�n corporal?",
      alternativas: [
        "Espacio p�blico visible",
        "Alcance de brazos sin desplazamiento",
        "Espacio privado invisible",
        "Solo en salas cerradas"
      ],
      correcta: 1,
      explicacion: "Espacio personal = kinesfera (radio de acci�n sin mover pies). Espacio general = �rea total de movimiento. Conceptos de Rudolf Laban."
    },
    {
      id: 28,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "Observa la imagen de tecnolog�a en educaci�n f�sica. �C�mo se usa una app para registrar actividad?",
      alternativas: [
        "Para competir online contra otros",
        "Monitorear pasos y frecuencia card�aca",
        "Solo para ver videos instructivos",
        "Reemplazar completamente al profesor"
      ],
      correcta: 1,
      explicacion: "Tecnolog�a en EF: apps para seguimiento cuantitativo (pasos, FC, calor�as). Complementa ense�anza, fomenta autonom�a y conciencia corporal."
    },
    {
      id: 29,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "�Qu� juego se clasifica como '\''masivo'\'' en la imagen de 30 estudiantes?",
      alternativas: [
        "Juego individual",
        "Juego en parejas",
        "Juego masivo o de gran grupo",
        "Juego en peque�os grupos"
      ],
      correcta: 2,
      explicacion: "Juegos masivos: todo el curso participa simult�neamente (quemados, cadenas de pilla-pilla, bailes colectivos). Favorecen inclusi�n y participaci�n."
    },
    {
      id: 30,
      dominio: "Dominio 2: Manifestaciones de la Motricidad",
      enunciado: "En la imagen de educaci�n inclusiva, �qu� adaptaci�n se usa para diversidad funcional?",
      alternativas: [
        "Separar por capacidad",
        "Modificar reglas para participaci�n plena",
        "Excluir actividades",
        "Roles pasivos"
      ],
      correcta: 1,
      explicacion: "Inclusi�n: adaptar reglas, implementos, espacios. Dise�o Universal asegura acceso equitativo para todos los estudiantes."
    },

    // DOMINIO 3: PROCESOS DE ENSE�ANZA-APRENDIZAJE (10 preguntas - pedag�gicas, con nuevos temas)
    {
      id: 31,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "�Qu� estilo de Mosston permite que estudiantes elijan dificultad seg�n capacidad?",
      alternativas: [
        "Estilo A - Mando Directo",
        "Estilo E - Inclusi�n",
        "Estilo H - Resoluci�n de Problemas",
        "Estilo C - Rec�proca"
      ],
      correcta: 1,
      explicacion: "Estilo E (Inclusi�n): misma tarea con niveles ajustables. Estudiante elige dificultad apropiada, fomenta autoconocimiento sin exclusi�n."
    },
    {
      id: 32,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "�Qu� evaluaci�n se realiza al inicio para conocer conocimientos previos?",
      alternativas: [
        "Diagn�stica",
        "Sumativa",
        "Autoevaluaci�n",
        "Coevaluaci�n"
      ],
      correcta: 0,
      explicacion: "Evaluaci�n diagn�stica: identifica nivel de partida, conocimientos previos. Permite ajustar planificaci�n sin calificar."
    },
    {
      id: 33,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "�Qu� instrumento describe niveles de desempe�o con criterios espec�ficos?",
      alternativas: [
        "Prueba cerrada",
        "R�brica anal�tica",
        "Lista binaria",
        "Escala num�rica simple"
      ],
      correcta: 1,
      explicacion: "R�brica: criterios + descriptores de niveles (excelente, bueno, suficiente). Objetiva y formativa para retroalimentaci�n."
    },
    {
      id: 34,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "En la imagen de estudiantes usando tablets, �c�mo se integra tecnolog�a en EF?",
      alternativas: [
        "Reemplazar clases presenciales",
        "Complementar con videos y seguimiento digital",
        "Solo para entretenimiento",
        "Competencia virtual"
      ],
      correcta: 1,
      explicacion: "Tecnolog�a complementa: videos demostrativos, apps de seguimiento, realidad aumentada. Enriquecen ense�anza sin reemplazar interacci�n docente."
    },
    {
      id: 35,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "�Qu� principio DUA ofrece informaci�n en m�ltiples formatos?",
      alternativas: [
        "M�ltiples formas de acci�n",
        "M�ltiples formas de representaci�n",
        "M�ltiples formas de implicaci�n",
        "M�ltiples formas de evaluaci�n"
      ],
      correcta: 1,
      explicacion: "DUA Principio I: representar contenido en diversos formatos (visual, auditivo, kinest�sico) para acceso universal."
    },
    {
      id: 36,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "�Qu� evaluaci�n ocurre durante el proceso con retroalimentaci�n?",
      alternativas: [
        "Diagn�stica",
        "Formativa",
        "Sumativa",
        "Heteroevaluaci�n"
      ],
      correcta: 1,
      explicacion: "Evaluaci�n formativa: continua, feedback descriptivo para mejorar. No califica; prop�sito pedag�gico."
    },
    {
      id: 37,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "En la imagen de salud mental, �c�mo promueve EF bienestar emocional?",
      alternativas: [
        "Solo trabajo f�sico intenso",
        "Actividades que reducen estr�s y mejoran autoestima",
        "Competencia agresiva",
        "Aislamiento individual"
      ],
      correcta: 1,
      explicacion: "EF promueve salud mental: reduce ansiedad, mejora autoestima, fomenta socializaci�n, ense�a resiliencia emocional."
    },
    {
      id: 38,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "�Qu� estilo usa parejas con roles alternados de ejecutor y observador?",
      alternativas: [
        "Estilo A - Directo",
        "Estilo B - Asignaci�n",
        "Estilo C - Rec�proca",
        "Estilo E - Inclusi�n"
      ],
      correcta: 2,
      explicacion: "Estilo C (Rec�proca): trabajo en parejas con checklist. Ejecutor realiza, observador eval�a con criterios. Desarrolla metacognici�n."
    },
    {
      id: 39,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "�Qu� estrategia eval�a el estudiante su propio desempe�o?",
      alternativas: [
        "Heteroevaluaci�n",
        "Autoevaluaci�n",
        "Coevaluaci�n",
        "Evaluaci�n externa"
      ],
      correcta: 1,
      explicacion: "Autoevaluaci�n: estudiante reflexiona usando criterios. Desarrolla autonom�a cr�tica y metacognici�n."
    },
    {
      id: 40,
      dominio: "Dominio 3: Procesos de Ense�anza-Aprendizaje",
      enunciado: "Observa la imagen de inclusi�n. �Qu� se favorece?",
      alternativas: [
        "Segregaci�n",
        "Participaci�n equitativa para todos",
        "Exclusi�n",
        "Observaci�n pasiva"
      ],
      correcta: 1,
      explicacion: "Inclusi�n: adaptar actividades para diversidad funcional. Dise�o Universal asegura acceso y participaci�n plena."
    },

    // CASOS INTEGRADOS (10 preguntas - con temas nuevos)
    {
      id: 41,
      dominio: "Casos Integrados",
      contexto: "CASO: Circuito de acondicionamiento con im�genes de estaciones. Estudiante con fatiga.",
      enunciado: "�Qu� acci�n prioritaria tomar?",
      alternativas: [
        "Forzar continuaci�n",
        "Detener, hidratar, reducir intensidad",
        "Aplicar calor",
        "Ignorar s�ntomas"
      ],
      correcta: 1,
      explicacion: "Fatiga en obesidad: detener, hidratar, reducir carga. Monitorear signos vitales, derivar si persiste."
    },
    {
      id: 42,
      dominio: "Casos Integrados",
      contexto: "CASO: Juego cooperativo con conflicto. Imagen muestra estudiantes discutiendo.",
      enunciado: "�Qu� intervenci�n pedag�gica usar?",
      alternativas: [
        "Ignorar conflicto",
        "Pausar, validar emociones, facilitar di�logo",
        "Castigar ambos",
        "Decisi�n unilateral"
      ],
      correcta: 1,
      explicacion: "Mediaci�n: validar emociones, facilitar di�logo consensuado. Ense�a resoluci�n pac�fica y empat�a."
    },
    {
      id: 43,
      dominio: "Casos Integrados",
      contexto: "CASO: Uso de app para seguimiento en EF. Imagen de estudiantes con dispositivos.",
      enunciado: "�Qu� beneficio principal aporta?",
      alternativas: [
        "Reemplaza profesor",
        "Fomenta autonom�a y conciencia corporal",
        "Solo entretenimiento",
        "Competencia virtual"
      ],
      correcta: 1,
      explicacion: "Tecnolog�a: seguimiento cuantitativo (pasos, FC, calor�as), promueve autonom�a y motivaci�n intr�nseca."
    },
    {
      id: 44,
      dominio: "Casos Integrados",
      contexto: "CASO: Actividad inclusiva con silla de ruedas. Imagen muestra adaptaci�n.",
      enunciado: "�Qu� principio se aplica?",
      alternativas: [
        "Separar estudiantes",
        "Dise�o Universal para igualar condiciones",
        "Excluir participaci�n",
        "Roles pasivos"
      ],
      correcta: 1,
      explicacion: "DUA: adaptar para inclusi�n plena. Todos participan en condiciones equitativas, fomenta empat�a."
    },
    {
      id: 45,
      dominio: "Casos Integrados",
      contexto: "CASO: Evaluaci�n formativa en circuito. Imagen de checklist.",
      enunciado: "�Qu� instrumento usar?",
      alternativas: [
        "Examen escrito",
        "Lista de cotejo observacional",
        "Nota final �nica",
        "Sin evaluaci�n"
      ],
      correcta: 1,
      explicacion: "Lista de cotejo: indicadores observables para retroalimentaci�n inmediata durante actividad."
    },
    {
      id: 46,
      dominio: "Casos Integrados",
      contexto: "CASO: Salud mental en EF. Imagen de actividad relajante.",
      enunciado: "�Qu� se promueve?",
      alternativas: [
        "Solo f�sico",
        "Bienestar emocional y reducci�n de estr�s",
        "Agresividad",
        "Aislamiento"
      ],
      correcta: 1,
      explicacion: "EF integra salud mental: actividades que reducen ansiedad, mejoran autoestima, ense�an manejo emocional."
    },
    {
      id: 47,
      dominio: "Casos Integrados",
      contexto: "CASO: Progresi�n did�ctica. Imagen de secuencia de juegos.",
      enunciado: "�Cu�l es la secuencia correcta?",
      alternativas: [
        "Deportivo  Pre-deportivo",
        "Libre  Reglado  Pre-deportivo  Deportivo",
        "Todos simult�neos",
        "Pre-deportivo  Libre"
      ],
      correcta: 1,
      explicacion: "Progresi�n: Libre (exploraci�n)  Reglado (reglas simples)  Pre-deportivo (fundamentos)  Deportivo (completo)."
    },
    {
      id: 48,
      dominio: "Casos Integrados",
      contexto: "CASO: Conflicto en juego. Imagen de mediaci�n docente.",
      enunciado: "�Qu� se ense�a?",
      alternativas: [
        "Competencia agresiva",
        "Resoluci�n pac�fica y empat�a",
        "Ignorar problemas",
        "Castigo inmediato"
      ],
      correcta: 1,
      explicacion: "Mediaci�n ense�a di�logo, validaci�n emocional, soluciones consensuadas. Desarrolla habilidades socioemocionales."
    },
    {
      id: 49,
      dominio: "Casos Integrados",
      contexto: "CASO: Tecnolog�a en planificaci�n. Imagen de software.",
      enunciado: "�C�mo se usa?",
      alternativas: [
        "Reemplazar ense�anza",
        "Complementar con recursos digitales",
        "Solo videos",
        "Competencia virtual"
      ],
      correcta: 1,
      explicacion: "Tecnolog�a complementa: planificaci�n digital, videos demostrativos, seguimiento online. Enriquecen sin sustituir interacci�n."
    },
    {
      id: 50,
      dominio: "Casos Integrados",
      contexto: "CASO: Inclusi�n con diversidad. Imagen de adaptaci�n.",
      enunciado: "�Qu� se promueve?",
      alternativas: [
        "Segregaci�n",
        "Participaci�n equitativa para todos",
        "Exclusi�n",
        "Observaci�n pasiva"
      ],
      correcta: 1,
      explicacion: "Inclusi�n: adaptar actividades para diversidad funcional. Dise�o Universal asegura acceso y participaci�n plena."
    }
  ];

  if (typeof module !== '\''undefined'\'' && module.exports) {
    module.exports = preguntas;
  }

  if (root) {
    root.efBasicaPreguntas = preguntas;
  }
})(typeof globalThis !== '\''undefined'\'' ? globalThis : (typeof window !== '\''undefined'\'' ? window : this));
