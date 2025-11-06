"""
AGREGAR MÁS CASOS DE ESTUDIO (Ampliación)
Para alcanzar ~20 preguntas de casos situacionales en cada evaluación
"""

import json

# ============================================================
# MÁS CASOS DE ESTUDIO PARVULARIA
# ============================================================

mas_casos_parvularia = [
    {
        "caso_id": "caso-parv-03",
        "titulo": "Planificación Experiencia de Aprendizaje: Pensamiento Matemático",
        "contexto": """
La educadora Carla de NT2 observó que varios niños/as mostraban interés por contar objetos durante el juego libre. Decidió planificar una experiencia de aprendizaje integrando este interés con el Núcleo de Pensamiento Matemático de las BCEP.

Planificó una experiencia llamada "El Mercado de Juguete":
- Objetivo de aprendizaje: Emplear cuantificadores tales como: más que-menos que, mucho-poco, todo-ninguno, para comparar cantidades de objetos (OA 6, PM, NT2)
- Inicio: Presentar situación problema: "Necesitamos organizar el mercado. ¿Cómo sabremos si tenemos más manzanas o más plátanos?"
- Desarrollo: En grupos, los niños/as clasifican frutas de juguete, las cuentan, comparan cantidades, registran con dibujos
- Cierre: Socialización: ¿Qué grupo tiene más frutas? ¿Cómo lo supieron?
- Evaluación: Pauta de observación con indicadores: cuenta correctamente hasta 10, usa cuantificadores adecuadamente, compara cantidades, explica su razonamiento

Durante la experiencia, Carla observó que:
- Grupo 1: Contaban correctamente, usaban "más que" y "menos que" con precisión
- Grupo 2: Contaban bien hasta 5, confundían cuantificadores después
- Grupo 3: Javiera (niña con TEL) contaba con apoyo, pero no verbalizaba comparaciones
        """,
        "preguntas": [
            {
                "numero": 117,
                "enunciado": "La estrategia de partir de los intereses observados en el juego libre responde principalmente a:",
                "alternativas": [
                    {"letra": "A", "texto": "Planificación emergente y aprendizaje significativo"},
                    {"letra": "B", "texto": "Evitar planificar con anticipación"},
                    {"letra": "C", "texto": "Cumplir con una moda pedagógica sin fundamento"},
                    {"letra": "D", "texto": "Dejar que los niños decidan todo el currículum"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "Partir de los intereses observados es coherente con la planificación emergente (se nutre de lo que los niños manifiestan interés) y el aprendizaje significativo (parte de motivaciones intrínsecas). Carla NO improvisa sin planificar (B), al contrario, planifica INTENCIONADAMENTE a partir de la observación. No es moda sin fundamento (C) - está respaldado por BCEP y teorías constructivistas. Tampoco es ausencia de rol docente (D) - la educadora diseña la experiencia pedagógicamente.",
                "temas_relacionados": ["Planificación emergente", "Aprendizaje significativo", "Rol mediador", "BCEP"]
            },
            {
                "numero": 118,
                "enunciado": "La pauta de observación con indicadores claros permite:",
                "alternativas": [
                    {"letra": "A", "texto": "Calificar a los niños/as con notas numéricas"},
                    {"letra": "B", "texto": "Evaluación auténtica, formativa y centrada en el proceso"},
                    {"letra": "C", "texto": "Clasificar a los niños en 'buenos' y 'malos' en matemática"},
                    {"letra": "D", "texto": "Justificar la retención de niños que no alcanzan los indicadores"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "La pauta de observación es una herramienta de evaluación auténtica (observa desempeño en contexto real) y formativa (permite tomar decisiones pedagógicas para apoyar el aprendizaje). En Educación Parvularia NO se califica con notas (A falso), NO se etiqueta (C falso), NO se repite curso (D falso - Decreto 0315/2010 prohíbe retención). La evaluación es para orientar la enseñanza, no para sancionar.",
                "temas_relacionados": ["Evaluación auténtica", "Evaluación formativa", "Pauta de observación", "Decreto 0315/2010"]
            },
            {
                "numero": 119,
                "enunciado": "Para apoyar a Javiera (niña con TEL) en la verbalización de comparaciones, Carla podría:",
                "alternativas": [
                    {"letra": "A", "texto": "Eximirla de participar porque 'no puede' verbalizar"},
                    {"letra": "B", "texto": "Usar modelamiento, preguntas cerradas y apoyos visuales (tarjetas con > < =)"},
                    {"letra": "C", "texto": "Exigirle igual que al resto sin adaptaciones"},
                    {"letra": "D", "texto": "Decirle las respuestas para que las repita mecánicamente"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Los ajustes razonables para TEL incluyen: MODELAMIENTO ('Mira, yo digo: hay MÁS manzanas QUE plátanos'), preguntas cerradas que reduzcan demanda lingüística ('¿Hay más manzanas o más plátanos?' en vez de 'Cuéntame qué observas'), y apoyos visuales (símbolos > < = que complementen lo verbal). Eximirla (A) es segregación, exigir sin apoyo (C) es falta de equidad, y hacer que repita sin comprender (D) no es aprendizaje real.",
                "temas_relacionados": ["TEL", "Ajustes razonables", "Modelamiento", "DUA"]
            }
        ]
    },
    {
        "caso_id": "caso-parv-04",
        "titulo": "Trabajo con Familias: Niño que No Quiere Ir al Jardín",
        "contexto": """
Benjamín (4 años, NT1) lleva dos semanas llorando todas las mañanas al llegar al jardín. Dice 'no quiero quedarme', se aferra a su mamá y tarda 20-30 minutos en calmarse después de que ella se va.

La educadora Lorena conversó con la familia y descubrió que:
- Hace un mes nació su hermana menor
- En casa, Benjamín dice que 'el bebé le quitó a la mamá'
- La mamá, agobiada con el bebé, se siente culpable
- El papá trabaja todo el día y no ha tenido tiempo de acompañar a Benjamín

Lorena diseñó un plan conjunto familia-jardín:

**En el jardín:**
- Nombrar a Benjamín como 'ayudante del día' (darle protagonismo)
- Crear un álbum 'Mi familia y yo' donde Benjamín pega fotos (incluida su hermana)
- Anticipar la rutina: 'Tu mamá se va después del saludo, y vuelve después de la merienda'
- Validar emoción: 'Extrañas a tu mamá. Es normal. Aquí estás seguro'

**En casa:**
- Papá participa en acostar a Benjamín (tiempo exclusivo)
- Mamá lee un cuento a Benjamín mientras el bebé duerme (10 min. solo con él)
- Crear un 'ritual de despedida' predecible: abrazo + frase especial + objeto transicional (pañuelo de mamá)
- Involucrar a Benjamín en cuidado del bebé ('eres el hermano mayor')

Después de dos semanas, Benjamín aún llora al llegar, pero se calma en 5 minutos y participa activamente en las experiencias.
        """,
        "preguntas": [
            {
                "numero": 120,
                "enunciado": "La conducta de Benjamín (no querer ir al jardín después del nacimiento de su hermana) se explica principalmente por:",
                "alternativas": [
                    {"letra": "A", "texto": "Manipulación intencional para conseguir atención"},
                    {"letra": "B", "texto": "Regresión temporal y celos normales ante un cambio familiar significativo"},
                    {"letra": "C", "texto": "Trastorno de ansiedad que requiere medicación inmediata"},
                    {"letra": "D", "texto": "Falta de límites claros en la crianza"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "El nacimiento de un hermano es un cambio significativo que puede generar celos (emoción normal), sensación de desplazamiento, y regresión temporal (volver a conductas de etapa anterior, como el llanto intenso al separarse). NO es manipulación intencional (A) - a los 4 años no tienen esa capacidad de planificación emocional. NO requiere medicación inmediata (C) - es una respuesta adaptativa normal. NO se debe a falta de límites (D) - se debe a un duelo por el cambio en la dinámica familiar.",
                "temas_relacionados": ["Desarrollo socioemocional", "Celos fraternos", "Regresión temporal", "Cambios familiares"]
            },
            {
                "numero": 121,
                "enunciado": "El uso de un 'objeto transicional' (pañuelo de mamá) se fundamenta en:",
                "alternativas": [
                    {"letra": "A", "texto": "Teoría del apego: el objeto representa la presencia simbólica de la figura de apego"},
                    {"letra": "B", "texto": "Es innecesario, solo prolonga la dependencia"},
                    {"letra": "C", "texto": "Es un refuerzo material que genera conductas dependientes"},
                    {"letra": "D", "texto": "Debería prohibirse para que aprenda a separarse sin apoyo"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "Winnicott desarrolló el concepto de objeto transicional: objetos (mantita, peluche, pañuelo) que simbolizan la presencia de la figura de apego y facilitan la separación. NO es dependencia (B) - es un puente hacia la autonomía. NO es refuerzo conductista (C) - es un apoyo emocional legítimo. Prohibirlo (D) sería invalidar una necesidad emocional real. El objeto transicional es NORMAL y SALUDABLE en el desarrollo.",
                "temas_relacionados": ["Objeto transicional", "Teoría del apego", "Winnicott", "Separación"]
            },
            {
                "numero": 122,
                "enunciado": "La estrategia de validar la emoción ('Extrañas a tu mamá. Es normal') cumple la función de:",
                "alternativas": [
                    {"letra": "A", "texto": "Reforzar el llanto y prolongar la conducta"},
                    {"letra": "B", "texto": "Reconocer la emoción como legítima, lo que facilita la regulación emocional"},
                    {"letra": "C", "texto": "Manipular emocionalmente al niño para que deje de llorar"},
                    {"letra": "D", "texto": "Demostrar permisividad excesiva sin consecuencias"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "La validación emocional ('tu emoción es real, tiene sentido, es normal') es el PRIMER paso para la regulación emocional. Cuando un niño siente que su emoción es reconocida (no negada, no minimizada), puede comenzar a calmarla. NO refuerza el llanto (A) - al contrario, facilita su disminución al sentirse comprendido. NO es manipulación (C) - es honestidad emocional. NO es permisividad (D) - validar emoción NO es permitir cualquier conducta.",
                "temas_relacionados": ["Validación emocional", "Regulación emocional", "Desarrollo emocional", "Contención"]
            },
            {
                "numero": 123,
                "enunciado": "El trabajo coordinado jardín-familia ejemplifica:",
                "alternativas": [
                    {"letra": "A", "texto": "Intromisión del jardín en asuntos familiares privados"},
                    {"letra": "B", "texto": "Educación compartida: familia y jardín como co-constructores del bienestar del niño"},
                    {"letra": "C", "texto": "Transferencia de responsabilidad del jardín a la familia"},
                    {"letra": "D", "texto": "Intervención innecesaria, cada uno debería actuar por separado"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Las BCEP enfatizan el principio de educación compartida: familia y establecimiento educativo son co-responsables del bienestar y aprendizaje del niño/a. El plan coordinado NO es intromisión (A) - la familia voluntariamente participa. NO es transferencia de responsabilidad (C) - AMBOS actúan de manera complementaria. La intervención conjunta (D falso) es NECESARIA: si solo actúa el jardín o solo la familia, el impacto es menor. La coordinación amplifica y sostiene el apoyo.",
                "temas_relacionados": ["Educación compartida", "Familia y jardín", "BCEP", "Trabajo colaborativo"]
            }
        ]
    },
    {
        "caso_id": "caso-parv-05",
        "titulo": "Implementación Proyecto: Exploración del Entorno Natural",
        "contexto": """
El equipo pedagógico de NT2 del Jardín Infantil 'Rayito de Sol' decidió implementar un proyecto de exploración del entorno natural en el patio del establecimiento. El jardín tiene un pequeño patio con árboles nativos, insectos y aves.

**Fase 1 - Motivación:**
Los niños/as observaron que había muchos bichitos en el patio. Preguntaron: '¿Qué comen?', '¿Dónde duermen?', '¿Por qué algunos vuelan y otros no?'

**Fase 2 - Planificación con niños:**
En asamblea, co-construyeron preguntas de investigación:
- ¿Qué bichitos viven en nuestro patio?
- ¿Dónde viven (hábitat)?
- ¿Qué comen?
- ¿Cómo se mueven?

**Fase 3 - Investigación:**
- Observación directa con lupas
- Registro con dibujos y fotos
- Invitación de experto (biólogo de la universidad vecina)
- Creación de 'guía de bichitos de nuestro jardín'

**Fase 4 - Cierre:**
- Exposición fotográfica para familias
- Cada niño presentó 'su bichito favorito' (Antonia: catita, 'tiene 6 patas y camina lento'; Martín: abeja, 'vuela y toma néctar de las flores')

**Evaluación del Proyecto:**
La educadora registró en su bitácora:
- 90% de los niños/as participó activamente
- Desarrollaron observación detallada
- Usaron vocabulario nuevo (hábitat, néctar, antenas)
- Ampliaron tiempo de atención sostenida (de 10 a 25 minutos)
- Algunos niños conectaron con conocimientos previos (Josefa: 'mi abuela tiene abejas en el campo')
        """,
        "preguntas": [
            {
                "numero": 124,
                "enunciado": "La estrategia de co-construir preguntas de investigación CON los niños/as responde a:",
                "alternativas": [
                    {"letra": "A", "texto": "Enfoque de aprendizaje basado en proyectos con participación protagónica de párvulos"},
                    {"letra": "B", "texto": "Evitar la responsabilidad de planificar la educadora"},
                    {"letra": "C", "texto": "Dejar que los niños decidan sin orientación pedagógica"},
                    {"letra": "D", "texto": "Una actividad sin intencionalidad educativa clara"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "El aprendizaje basado en proyectos (ABP) se caracteriza por: partir de intereses reales, formular preguntas de investigación, investigar colaborativamente, y comunicar aprendizajes. Co-construir las preguntas CON los niños desarrolla agencia, pensamiento crítico y apropiación del aprendizaje. La educadora NO evade planificar (B) - al contrario, diseña intencionadamente el proceso. NO es ausencia de orientación (C) - la educadora MEDIA, GUÍA. Tiene alta intencionalidad pedagógica (D falso): desarrollo del pensamiento científico.",
                "temas_relacionados": ["Aprendizaje basado en proyectos", "Protagonismo infantil", "Pensamiento científico", "Co-construcción"]
            },
            {
                "numero": 125,
                "enunciado": "El uso de lupas, registro con dibujos y fotos, y la visita del biólogo responde al principio de:",
                "alternativas": [
                    {"letra": "A", "texto": "Activismo pedagógico sin reflexión"},
                    {"letra": "B", "texto": "DUA: múltiples medios de representación y expresión del conocimiento"},
                    {"letra": "C", "texto": "Contenidismo académico inadecuado para la edad"},
                    {"letra": "D", "texto": "Imitación de escolarización de enseñanza básica"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Ofrecer múltiples medios de representación (observación directa, escucha de experto, textos, fotos) y múltiples medios de expresión (dibujo, oralidad, exposición) es coherente con el DUA. Permite que niños con distintos estilos de aprendizaje accedan al conocimiento. NO es activismo sin reflexión (A) - hay intencionalidad clara. NO es contenidismo (C) - el pensamiento científico (observar, registrar, comparar, comunicar) ES apropiado para EP. NO imita básica (D) - respeta las características de aprendizaje de párvulos (manipulación, juego, exploración).",
                "temas_relacionados": ["DUA", "Múltiples representaciones", "Pensamiento científico", "Exploración"]
            },
            {
                "numero": 126,
                "enunciado": "Que Josefa conecte con su conocimiento previo ('mi abuela tiene abejas en el campo') evidencia:",
                "alternativas": [
                    {"letra": "A", "texto": "Dispersión, el tema de la abuela no es relevante para el proyecto"},
                    {"letra": "B", "texto": "Aprendizaje significativo: conexión entre nuevos conocimientos y experiencias previas"},
                    {"letra": "C", "texto": "Falta de enfoque del proyecto"},
                    {"letra": "D", "texto": "Problema de atención de Josefa"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Ausubel define aprendizaje significativo como la conexión entre conocimientos nuevos y estructuras cognitivas previas. Josefa está CONECTANDO lo que observa (abejas en el jardín) con su experiencia (abejas de su abuela), dándole sentido personal. Esto NO es dispersión (A) - al contrario, es profundización. El proyecto tiene claridad (C falso). No hay problema de atención (D falso) - hay atención significativa, que es diferente.",
                "temas_relacionados": ["Aprendizaje significativo", "Conocimientos previos", "Ausubel", "Conexión experiencial"]
            }
        ]
    }
]

# ============================================================
# MÁS CASOS DE ESTUDIO MATEMÁTICA MEDIA
# ============================================================

mas_casos_matematica = [
    {
        "caso_id": "caso-mat-03",
        "titulo": "Análisis de Error Conceptual: Ecuaciones Cuadráticas",
        "contexto": """
Durante una evaluación formativa, el profesor Diego pide resolver:

x² - 5x + 6 = 0

**Solución de estudiante A (Camila):**
x² - 5x + 6 = 0
(x - 2)(x - 3) = 0
x - 2 = 0  →  x = 2
x - 3 = 0  →  x = 3
Solución: x = 2  o  x = 3  ✓

**Solución de estudiante B (Matías):**
x² - 5x + 6 = 0
x² = 5x - 6
x = √(5x - 6)  ✗

**Solución de estudiante C (Francisca):**
x² - 5x + 6 = 0
x(x - 5) + 6 = 0
x(x - 5) = -6
x = -6  o  x - 5 = -6  →  x = -1  ✗

Diego analiza los errores para diseñar retroalimentación específica.
        """,
        "preguntas": [
            {
                "numero": 85,
                "enunciado": "El error de Matías (x = √(5x - 6)) se debe principalmente a:",
                "alternativas": [
                    {"letra": "A", "texto": "Descuido en los cálculos"},
                    {"letra": "B", "texto": "Confusión conceptual: aplicar raíz cuadrada a ambos lados cuando hay términos en x"},
                    {"letra": "C", "texto": "Uso incorrecto de la calculadora"},
                    {"letra": "D", "texto": "Problema de lectura del enunciado"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Matías comete un error CONCEPTUAL (no procedimental): intenta 'despejar x' aplicando raíz cuadrada, pero olvida que √(5x - 6) contiene la misma variable que intenta despejar, generando una ecuación NO resuelta. Este es un error común que revela incomprensión de cuándo es válido aplicar raíz cuadrada (solo si despejamos x², no si hay otros términos en x). No es descuido (A), ni calculadora (C), ni lectura (D).",
                "temas_relacionados": ["Error conceptual", "Ecuaciones cuadráticas", "Raíz cuadrada", "Despeje"]
            },
            {
                "numero": 86,
                "enunciado": "El error de Francisca (x(x-5) = -6, entonces x = -6) se debe a:",
                "alternativas": [
                    {"letra": "A", "texto": "Aplicar incorrectamente la propiedad del producto cero (solo válida cuando producto = 0)"},
                    {"letra": "B", "texto": "Error de signo en la ecuación"},
                    {"letra": "C", "texto": "Confusión con fracciones"},
                    {"letra": "D", "texto": "Problema con el concepto de variable"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "Francisca intenta usar la propiedad 'si a·b = 0, entonces a = 0 o b = 0', pero la aplica INCORRECTAMENTE a x(x-5) = -6. Esta propiedad SOLO es válida cuando el producto es CERO. Para resolver x(x-5) = -6, debe expandir: x² - 5x = -6 → x² - 5x + 6 = 0 y factorizar. Este es un error conceptual frecuente: generalizar una propiedad válida solo en casos específicos.",
                "temas_relacionados": ["Propiedad del producto cero", "Ecuaciones cuadráticas", "Error conceptual", "Generalización incorrecta"]
            },
            {
                "numero": 87,
                "enunciado": "La mejor estrategia de retroalimentación para Matías sería:",
                "alternativas": [
                    {"letra": "A", "texto": "Decirle 'está mal' y mostrarle la solución correcta"},
                    {"letra": "B", "texto": "Preguntarle: 'Si x = √(5x-6), ¿puedes verificar con x=2? ¿Funciona?' (contraejemplo)"},
                    {"letra": "C", "texto": "Bajarle puntos sin explicación"},
                    {"letra": "D", "texto": "Ignorar el error y pasar al siguiente ejercicio"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "La retroalimentación efectiva NO da la respuesta (A), sino que guía al estudiante a DESCUBRIR su error. Pedirle que VERIFIQUE su respuesta (x = √(5x-6)) con un valor conocido (x = 2) genera disonancia cognitiva: 2 = √(5·2-6) = √4 = 2 ✓ parece funcionar, PERO x = 3: 3 = √(5·3-6) = √9 = 3 ✓ también. Entonces x = √(5x-6) es una ecuación SIN resolver, no la solución. Esto desarrolla metacognición. Bajar puntos sin explicar (C) no enseña. Ignorar (D) perpetúa el error.",
                "temas_relacionados": ["Retroalimentación formativa", "Verificación", "Metacognición", "Contraejemplo"]
            },
            {
                "numero": 88,
                "enunciado": "Desde una perspectiva didáctica, ¿cuál actividad previene estos errores?",
                "alternativas": [
                    {"letra": "A", "texto": "Memorizar fórmulas sin comprensión"},
                    {"letra": "B", "texto": "Practicar verificación de soluciones y discutir errores comunes explícitamente"},
                    {"letra": "C", "texto": "Resolver muchos ejercicios sin retroalimentación"},
                    {"letra": "D", "texto": "Evitar ecuaciones cuadráticas porque son difíciles"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "La investigación en didáctica de la matemática (Brousseau, Radford) muestra que DISCUTIR EXPLÍCITAMENTE errores comunes y practicar VERIFICACIÓN de soluciones reduce errores conceptuales. Memorizar (A) no genera comprensión. Practicar sin retroalimentación (C) perpetúa errores. Evitar el contenido (D) es negar el derecho a aprender. La 'institucionalización del error' (hacer visible el error, analizarlo colectivamente) es una estrategia poderosa.",
                "temas_relacionados": ["Didáctica de la matemática", "Institucionalización del error", "Verificación", "Brousseau"]
            }
        ]
    },
    {
        "caso_id": "caso-mat-04",
        "titulo": "Uso de Tecnología: GeoGebra en Funciones",
        "contexto": """
La profesora Andrea planifica una clase sobre funciones cuadráticas usando GeoGebra. Su objetivo es que los estudiantes comprendan cómo los parámetros a, h, k afectan la gráfica de f(x) = a(x-h)² + k.

**Actividad:**
1. Los estudiantes abren GeoGebra y grafican f(x) = x²
2. Usando deslizadores, modifican el parámetro 'a' y observan cambios
3. Registran en tabla:
   - Si a > 1: parábola más "angosta"
   - Si 0 < a < 1: parábola más "ancha"
   - Si a < 0: parábola invertida
4. Repiten con parámetros h (desplazamiento horizontal) y k (vertical)
5. Predicción: sin graficar, predecir cómo se ve f(x) = -2(x+3)² + 5
6. Verificación: grafican y comprueban su predicción

**Observación de Andrea:**
- Grupo 1 (Martina, José, Daniela): Descubrieron rápido los patrones, hicieron predicciones correctas
- Grupo 2 (Lucas, Camila): Jugaban con los deslizadores sin registrar observaciones
- Grupo 3 (Sofía, que tiene discalculia): Con apoyo, logró identificar el desplazamiento vertical (k), pero tuvo dificultad con 'a'
        """,
        "preguntas": [
            {
                "numero": 89,
                "enunciado": "El uso de deslizadores en GeoGebra para variar parámetros responde principalmente a:",
                "alternativas": [
                    {"letra": "A", "texto": "Entretenimiento sin intencionalidad pedagógica"},
                    {"letra": "B", "texto": "Visualización dinámica que facilita comprensión de relaciones funcionales"},
                    {"letra": "C", "texto": "Reemplazo del aprendizaje conceptual por manipulación digital"},
                    {"letra": "D", "texto": "Uso de tecnología solo porque está disponible"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Los deslizadores permiten VISUALIZACIÓN DINÁMICA: ver EN TIEMPO REAL cómo cambios en parámetros afectan la gráfica. Esto facilita comprensión de RELACIONES (si aumento 'a', la parábola se 'cierra') que son difíciles de percibir en gráficos estáticos. No es entretenimiento (A) - tiene intencionalidad clara. No reemplaza conceptos (C) - al contrario, los visualiza. No es uso arbitrario (D) - es uso pedagógicamente fundamentado (tecnología como herramienta cognitiva).",
                "temas_relacionados": ["GeoGebra", "Visualización dinámica", "Funciones cuadráticas", "Tecnología educativa"]
            },
            {
                "numero": 90,
                "enunciado": "La fase de 'predicción sin graficar' antes de verificar con GeoGebra tiene como objetivo:",
                "alternativas": [
                    {"letra": "A", "texto": "Hacer la clase más larga sin razón"},
                    {"letra": "B", "texto": "Promover razonamiento matemático antes de la verificación visual"},
                    {"letra": "C", "texto": "Frustrar a los estudiantes con dificultades"},
                    {"letra": "D", "texto": "Demostrar que GeoGebra es innecesario"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Predecir ANTES de verificar desarrolla razonamiento matemático: el estudiante debe PENSAR ('si a = -2, entonces invertida y angosta; si h = -3, entonces desplaza a la izquierda...') en vez de solo observar pasivamente. La verificación posterior con GeoGebra valida o refuta la predicción, generando retroalimentación inmediata. No alarga arbitrariamente (A), no frustra (C) - al contrario, da sentido al uso de tecnología. No demuestra que GeoGebra sea innecesario (D) - ambos (razonamiento + visualización) se complementan.",
                "temas_relacionados": ["Razonamiento matemático", "Predicción", "Verificación", "Aprendizaje activo"]
            },
            {
                "numero": 91,
                "enunciado": "Para el Grupo 2 (Lucas y Camila) que jugaban sin registrar, Andrea debería:",
                "alternativas": [
                    {"letra": "A", "texto": "Quitarles el computador como castigo"},
                    {"letra": "B", "texto": "Hacerles preguntas guía: '¿Qué pasa cuando a es negativo?' y pedir que registren"},
                    {"letra": "C", "texto": "Ignorarlos porque no están motivados"},
                    {"letra": "D", "texto": "Bajarles la nota del trabajo grupal"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "La exploración sin registro puede ser exploración inicial válida, pero necesita ORIENTACIÓN. Preguntas guía focalizan la atención ('¿Qué pasa SI...?') y el registro los obliga a SISTEMATIZAR observaciones (convertir exploración en aprendizaje). Quitar el computador (A) es punitivo y detiene el aprendizaje. Ignorarlos (C) es abandono. Bajar nota (D) es evaluación sancionadora sin enseñanza. Las preguntas guía son andamiaje que convierte manipulación en comprensión.",
                "temas_relacionados": ["Andamiaje", "Preguntas guía", "Exploración orientada", "Registro de observaciones"]
            },
            {
                "numero": 92,
                "enunciado": "Para Sofía (con discalculia), ¿qué apoyo es más apropiado?",
                "alternativas": [
                    {"letra": "A", "texto": "Eximirla de la actividad porque 'no puede' hacerla"},
                    {"letra": "B", "texto": "Usar código de colores (k = movimiento vertical verde, h = horizontal azul) y partir por un parámetro a la vez"},
                    {"letra": "C", "texto": "Exigirle igual que al resto sin adaptaciones"},
                    {"letra": "D", "texto": "Asignarle solo tareas de registro sin exploración"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Los ajustes razonables para discalculia incluyen: REDUCIR CARGA COGNITIVA (trabajar un parámetro a la vez, no los 3 simultáneamente) y usar APOYOS VISUALES (código de colores que asocia parámetro con movimiento). Eximirla (A) es segregación. Exigir sin apoyo (C) es inequidad. Delegar solo registro (D) la excluye de la exploración matemática. GeoGebra puede ser MÁS accesible para estudiantes con discalculia que métodos puramente algebraicos.",
                "temas_relacionados": ["Discalculia", "DUA", "Código de colores", "Reducción de carga cognitiva"]
            }
        ]
    }
]

def agregar_mas_casos():
    """Agregar más casos de estudio a ambas evaluaciones"""
    
    # PARVULARIA
    print("="*70)
    print("📚 AGREGANDO MÁS CASOS - PARVULARIA (3 casos adicionales = 10 preguntas)")
    print("="*70)
    
    with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
        plan_parv = json.load(f)
    
    for caso in mas_casos_parvularia:
        for pregunta in caso['preguntas']:
            pregunta_completa = {
                "id": f"parv-{pregunta['numero']:03d}",
                "numero": pregunta['numero'],
                "tipo": "caso_estudio",
                "caso_id": caso['caso_id'],
                "caso_titulo": caso['titulo'],
                "caso_contexto": caso['contexto'],
                "ambito": "Casos de Estudio Situacionales",
                "nucleo": "Integración de Aprendizajes",
                "habilidad": "Análisis de situaciones pedagógicas complejas",
                "enunciado": pregunta['enunciado'],
                "alternativas": pregunta['alternativas'],
                "respuesta_correcta": pregunta['respuesta_correcta'],
                "explicacion": pregunta['explicacion'],
                "temas_relacionados": pregunta['temas_relacionados']
            }
            plan_parv['exam']['preguntas'].append(pregunta_completa)
    
    plan_parv['metadata']['total_preguntas'] = len(plan_parv['exam']['preguntas'])
    plan_parv['metadata']['distribucion']['casos_estudio'] = len([p for p in plan_parv['exam']['preguntas'] if p.get('tipo') == 'caso_estudio'])
    plan_parv['metadata']['version'] = 4
    plan_parv['metadata']['notas'] += " | v4: Agregados 3 casos adicionales (10 preguntas): Planificación experiencia matemática, Trabajo con familias (niño que no quiere ir), Proyecto exploración entorno natural. TOTAL: 5 casos de estudio con 18 preguntas."
    
    with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'w', encoding='utf-8') as f:
        json.dump(plan_parv, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Parvularia actualizada:")
    print(f"   - Total preguntas: {plan_parv['metadata']['total_preguntas']}")
    print(f"   - Casos de estudio: {plan_parv['metadata']['distribucion']['casos_estudio']} preguntas")
    print(f"   - Casos situacionales: 5 casos complejos")
    
    # MATEMÁTICA MEDIA
    print(f"\n{'='*70}")
    print("📐 AGREGANDO MÁS CASOS - MATEMÁTICA MEDIA (2 casos adicionales = 8 preguntas)")
    print("="*70)
    
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'r', encoding='utf-8') as f:
        plan_mat = json.load(f)
    
    for caso in mas_casos_matematica:
        for pregunta in caso['preguntas']:
            pregunta_completa = {
                "id": f"67-M-{pregunta['numero']:02d}",
                "numero": pregunta['numero'],
                "tipo": "caso_estudio",
                "caso_id": caso['caso_id'],
                "caso_titulo": caso['titulo'],
                "caso_contexto": caso['contexto'],
                "dominio": "Casos de Estudio Interdisciplinarios",
                "habilidad": "Resolución de problemas contextualizados",
                "enunciado": pregunta['enunciado'],
                "alternativas": pregunta['alternativas'],
                "respuesta_correcta": pregunta['respuesta_correcta'],
                "explicacion": pregunta['explicacion'],
                "temas_relacionados": pregunta['temas_relacionados']
            }
            plan_mat['exam']['preguntas'].append(pregunta_completa)
    
    plan_mat['metadata']['total_preguntas'] = len(plan_mat['exam']['preguntas'])
    plan_mat['metadata']['distribucion']['casos_estudio'] = len([p for p in plan_mat['exam']['preguntas'] if p.get('tipo') == 'caso_estudio'])
    plan_mat['metadata']['version'] = 4
    plan_mat['metadata']['notas'] += " | v4: Agregados 2 casos adicionales (8 preguntas): Análisis de error conceptual en ecuaciones cuadráticas, Uso de GeoGebra en funciones. TOTAL: 4 casos de estudio con 16 preguntas."
    
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'w', encoding='utf-8') as f:
        json.dump(plan_mat, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Matemática Media actualizada:")
    print(f"   - Total preguntas: {plan_mat['metadata']['total_preguntas']}")
    print(f"   - Casos de estudio: {plan_mat['metadata']['distribucion']['casos_estudio']} preguntas")
    print(f"   - Casos situacionales: 4 casos complejos")
    
    print(f"\n{'='*70}")
    print("🎉 MÁS CASOS DE ESTUDIO AGREGADOS EXITOSAMENTE")
    print("="*70)
    print("\n📊 RESUMEN FINAL:")
    print(f"   PARVULARIA: 5 casos → 18 preguntas de caso_estudio")
    print(f"   MATEMÁTICA: 4 casos → 16 preguntas de caso_estudio")
    print(f"   TOTAL: 9 casos situacionales complejos, 34 preguntas contextualizadas")

if __name__ == "__main__":
    agregar_mas_casos()
