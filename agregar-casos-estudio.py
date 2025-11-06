"""
AGREGAR CASOS DE ESTUDIO: Parvularia y Matemática Media
Formato ECEP 2023: Contextos extensos, múltiples preguntas relacionadas
"""

import json

# ============================================================
# CASOS DE ESTUDIO PARVULARIA (Estilo ECEP 2023)
# ============================================================

casos_parvularia = [
    {
        "caso_id": "caso-parv-01",
        "titulo": "Inclusión de Niño con TEA en NT2",
        "contexto": """
La educadora Daniela trabaja en NT2 con 28 niños/as. Este año se incorporó Matías, un niño de 5 años con Trastorno del Espectro Autista (TEA). Matías tiene hipersensibilidad auditiva y dificultades en la interacción social. Durante los primeros días, Matías lloraba en los momentos de transición y se tapaba los oídos cuando había mucho ruido. No participaba en actividades grupales y prefería jugar solo con bloques de construcción.

Daniela convocó a una reunión con la familia, la educadora diferencial y la directora para diseñar un plan de apoyo. Acordaron:
- Crear un rincón de calma con cojines y audífonos con cancelación de ruido
- Usar pictogramas para anticipar las transiciones
- Asignar un "amigo del día" que acompañara a Matías en actividades
- Reducir estímulos auditivos en ciertos momentos
- Valorar sus intereses (construcción) como puente para la participación

Después de dos meses, Matías comenzó a participar en el juego de bloques con dos compañeros, avisaba cuando necesitaba ir al rincón de calma, y toleraba mejor los ruidos cotidianos del aula.
        """,
        "preguntas": [
            {
                "numero": 109,
                "enunciado": "Según el Decreto 83/2015 sobre Diversificación de la Enseñanza, ¿cuál principio se evidencia MEJOR en las acciones de Daniela?",
                "alternativas": [
                    {"letra": "A", "texto": "Segregación educativa, creando espacios separados para Matías"},
                    {"letra": "B", "texto": "Diseño Universal para el Aprendizaje (DUA), ofreciendo múltiples formas de representación y participación"},
                    {"letra": "C", "texto": "Normalización, esperando que Matías se adapte al ritmo del grupo"},
                    {"letra": "D", "texto": "Asimilación cultural, homogeneizando las conductas de todos los niños"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "El Decreto 83 promueve el Diseño Universal para el Aprendizaje (DUA), que busca eliminar barreras y ofrecer múltiples medios de representación (pictogramas), expresión (rincón de calma) y participación (amigo del día, uso de intereses). Daniela no segrega a Matías (A es falso), no espera que se adapte sin apoyos (C es falso), ni homogeniza (D es falso). El DUA reconoce la diversidad como valor y ajusta el ambiente y estrategias para que TODOS participen según sus singularidades.",
                "temas_relacionados": ["Inclusión", "DUA", "Decreto 83", "TEA", "Ajustes razonables"]
            },
            {
                "numero": 110,
                "enunciado": "El uso de pictogramas para anticipar transiciones responde principalmente a:",
                "alternativas": [
                    {"letra": "A", "texto": "Una estrategia punitiva para controlar la conducta de Matías"},
                    {"letra": "B", "texto": "Un apoyo visual que reduce ansiedad al hacer predecible el entorno"},
                    {"letra": "C", "texto": "Un recurso innecesario que infantiliza a Matías"},
                    {"letra": "D", "texto": "Una forma de segregar a Matías del resto del grupo"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Los pictogramas son apoyos visuales que benefician a niños con TEA (y a muchos otros) al hacer el entorno predecible, reduciendo la ansiedad que generan los cambios inesperados. No son punitivos (A), ni infantilizan (C), ni segregan (D). De hecho, benefician a TODO el grupo: ayudan a la comprensión de rutinas, desarrollan autonomía y son un ejemplo de DUA.",
                "temas_relacionados": ["Apoyos visuales", "Predictibilidad", "TEA", "Comunicación aumentativa"]
            },
            {
                "numero": 111,
                "enunciado": "¿Qué rol cumple el 'rincón de calma' en el desarrollo de la autorregulación de Matías?",
                "alternativas": [
                    {"letra": "A", "texto": "Es un castigo disfrazado para aislarlo cuando molesta"},
                    {"letra": "B", "texto": "Es una herramienta de autorregulación que le permite gestionar sobreestimulación sensorial"},
                    {"letra": "C", "texto": "Es una forma de excluirlo de las actividades grupales"},
                    {"letra": "D", "texto": "Es innecesario, todos los niños deben aprender a tolerar el ruido"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "El rincón de calma es una herramienta de AUTORREGULACIÓN: Matías aprende a identificar cuándo está sobreestimulado y toma la decisión de ir al rincón para recuperar su bienestar. No es castigo (A), ni exclusión (C), ni innecesario (D). De hecho, TODOS los niños/as se benefician de espacios de autorregulación. Esto desarrolla metacognición ('me siento abrumado'), toma de decisiones y gestión emocional autónoma.",
                "temas_relacionados": ["Autorregulación", "Sobreestimulación sensorial", "Metacognición", "Bienestar emocional"]
            },
            {
                "numero": 112,
                "enunciado": "La estrategia de usar los intereses de Matías (bloques de construcción) como puente para la participación se fundamenta en:",
                "alternativas": [
                    {"letra": "A", "texto": "Dejar que haga solo lo que quiere para evitar conflictos"},
                    {"letra": "B", "texto": "La teoría del aprendizaje significativo y la zona de desarrollo próximo"},
                    {"letra": "C", "texto": "Una forma de entretenimiento sin intencionalidad pedagógica"},
                    {"letra": "D", "texto": "Reforzar conductas estereotipadas típicas del TEA"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Partir de los intereses del niño es coherente con el aprendizaje significativo (Ausubel): lo que es relevante para el niño genera motivación intrínseca. Además, usar su interés como puente hacia la interacción social (jugar bloques CON otros) es un ejemplo de andamiaje en la zona de desarrollo próximo (Vygotsky): lo que hoy hace con apoyo (jugar con pares), mañana lo hará solo. No es solo entretenimiento (C), ni refuerzo de estereotipias (D), ni ausencia de límites (A).",
                "temas_relacionados": ["Aprendizaje significativo", "Zona de desarrollo próximo", "Intereses del niño", "Andamiaje"]
            }
        ]
    },
    {
        "caso_id": "caso-parv-02",
        "titulo": "Resolución de Conflicto en NT1: Pelea por Material",
        "contexto": """
En NT1, durante el período de juego en rincones, Sofía (4 años 3 meses) estaba jugando con bloques de madera cuando llegó Tomás (4 años) y tomó varios bloques sin pedir permiso. Sofía gritó '¡Son míos!' y le pegó en el brazo a Tomás. Tomás comenzó a llorar y Sofía se fue corriendo al rincón del hogar.

La educadora Paula observó la situación completa. Se acercó a ambos niños por separado, primero a Tomás que lloraba. Le preguntó qué pasó, validó su emoción ('te duele el brazo, entiendo') y le ofreció un abrazo. Luego fue donde Sofía, quien estaba escondida tras la cocinita. Paula se sentó a su nivel y le dijo: 'Sofía, vi que estabas construyendo y Tomás tomó bloques sin pedir. Te enojaste mucho. Entiendo tu enojo, pero pegar lastima. ¿Qué podrías hacer en vez de pegar cuando alguien toma tus cosas?'

Después de que ambos se calmaron, Paula los juntó y facilitó un diálogo: 'Sofía quiere contarte algo, Tomás. Y tú también puedes contar cómo te sentiste'. Sofía dijo 'no me gusta que tomes mis bloques'. Tomás dijo 'quería jugar contigo'. Paula preguntó: '¿Cómo podríamos resolver esto para que ambos estén contentos?' Los niños acordaron jugar juntos y compartir los bloques. Paula los acompañó al inicio del juego compartido.

Esa tarde, Paula comentó a la familia de Sofía lo ocurrido, destacando los avances en expresión de emociones de Sofía y solicitando apoyo en casa para seguir trabajando la resolución pacífica de conflictos.
        """,
        "preguntas": [
            {
                "numero": 113,
                "enunciado": "La estrategia de Paula de atender PRIMERO a Tomás (quien lloraba) y LUEGO a Sofía (quien agredió) se fundamenta en:",
                "alternativas": [
                    {"letra": "A", "texto": "Castigar a Sofía haciéndola esperar"},
                    {"letra": "B", "texto": "Atender primero la necesidad urgente (dolor) y luego trabajar la conducta cuando ambos estén calmados"},
                    {"letra": "C", "texto": "Reforzar la agresión de Sofía dándole atención solo al 'agredido'"},
                    {"letra": "D", "texto": "Ignorar la conducta de Sofía esperando que se autorregule sola"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Paula aplica el principio de 'primero el bienestar, luego la disciplina': atiende el dolor físico de Tomás (necesidad inmediata), valida su emoción, y solo después aborda la conducta de Sofía cuando ELLA también está emocionalmente disponible para reflexionar. No es castigo (A), ni refuerzo negativo (C), ni abandono (D). Intervenir cuando el niño está desbordado emocionalmente es inefectivo; primero se recupera la calma, luego se reflexiona.",
                "temas_relacionados": ["Disciplina positiva", "Regulación emocional", "Bienestar primero"]
            },
            {
                "numero": 114,
                "enunciado": "Cuando Paula dice 'Entiendo tu enojo, PERO pegar lastima', está aplicando:",
                "alternativas": [
                    {"letra": "A", "texto": "Validación emocional + establecimiento de límites claros"},
                    {"letra": "B", "texto": "Permisividad excesiva sin consecuencias"},
                    {"letra": "C", "texto": "Castigo disfrazado con palabras amables"},
                    {"letra": "D", "texto": "Minimización de las emociones de Sofía"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "Paula hace algo fundamental: VALIDA la emoción ('entiendo tu enojo' - todas las emociones son legítimas) PERO pone límite a la CONDUCTA ('pegar lastima' - no todas las conductas son aceptables). Esto es coherente con disciplina respetuosa: los niños deben saber que sus emociones son aceptadas, pero que hay formas apropiadas e inapropiadas de expresarlas. No es permisividad (B), ni castigo encubierto (C), ni minimización (D).",
                "temas_relacionados": ["Validación emocional", "Límites claros", "Disciplina respetuosa", "Regulación conductual"]
            },
            {
                "numero": 115,
                "enunciado": "La pregunta '¿Qué podrías hacer en vez de pegar?' tiene como objetivo:",
                "alternativas": [
                    {"letra": "A", "texto": "Que Sofía se sienta culpable por su conducta"},
                    {"letra": "B", "texto": "Promover pensamiento reflexivo y construcción de estrategias alternativas"},
                    {"letra": "C", "texto": "Que Sofía responda la 'respuesta correcta' que espera la adulta"},
                    {"letra": "D", "texto": "Evadir la responsabilidad de enseñarle conductas apropiadas"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "La pregunta abierta promueve METACOGNICIÓN (pensar sobre su propia conducta) y AGENCIA (que el niño construya soluciones, no solo reciba instrucciones). Esto es más efectivo que decir 'debes decir con palabras': el niño que construye la estrategia la internaliza mejor. No busca culpa (A), ni respuesta mecánica (C), ni evade enseñanza (D) - al contrario, es una enseñanza profunda que desarrolla funciones ejecutivas y autonomía moral.",
                "temas_relacionados": ["Metacognición", "Resolución de problemas", "Autonomía moral", "Funciones ejecutivas"]
            },
            {
                "numero": 116,
                "enunciado": "El rol de Paula al facilitar el diálogo entre Sofía y Tomás ('Sofía quiere contarte algo...') corresponde a:",
                "alternativas": [
                    {"letra": "A", "texto": "Mediación de conflictos, facilitando la escucha mutua y co-construcción de soluciones"},
                    {"letra": "B", "texto": "Imposición de una disculpa forzada sin comprensión real"},
                    {"letra": "C", "texto": "Intervención innecesaria, los niños deben resolverlo solos"},
                    {"letra": "D", "texto": "Protección excesiva que impide el aprendizaje de Sofía"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "Paula actúa como MEDIADORA: crea un espacio seguro para que ambos expresen emociones y necesidades, facilita la escucha mutua ('Tomás, escucha lo que Sofía quiere decirte'), y guía la construcción colaborativa de soluciones ('¿cómo podríamos...?'). No impone disculpa mecánica (B), ni abandona (C - a los 4 años aún necesitan andamiaje adulto), ni sobreprotege (D - está facilitando que ELLOS resuelvan). Esta es enseñanza activa de habilidades sociales.",
                "temas_relacionados": ["Mediación de conflictos", "Habilidades sociales", "Empatía", "Co-construcción"]
            }
        ]
    }
]

# ============================================================
# CASOS DE ESTUDIO MATEMÁTICA MEDIA (Estilo ECEP 2023)
# ============================================================

casos_matematica = [
    {
        "caso_id": "caso-mat-01",
        "titulo": "Análisis de Función Cuadrática en Contexto Real",
        "contexto": """
Una empresa de transporte estudia la relación entre la velocidad de un bus (en km/h) y el consumo de combustible (en litros por cada 100 km). Después de varios experimentos, determinan que el consumo C(v) en función de la velocidad v se puede modelar mediante:

C(v) = 0.002v² - 0.24v + 12

donde v está entre 0 y 120 km/h.

El gerente de operaciones quiere determinar:
1. A qué velocidad el consumo es mínimo
2. Cuál es el consumo mínimo
3. Si conducir a 100 km/h es eficiente
4. El intervalo de velocidades donde el consumo es menor a 8 litros/100km
        """,
        "preguntas": [
            {
                "numero": 77,
                "enunciado": "¿A qué velocidad se alcanza el consumo mínimo de combustible?",
                "alternativas": [
                    {"letra": "A", "texto": "40 km/h"},
                    {"letra": "B", "texto": "60 km/h"},
                    {"letra": "C", "texto": "80 km/h"},
                    {"letra": "D", "texto": "100 km/h"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Para hallar el mínimo de una parábola (a > 0), usamos v = -b/(2a). Con a = 0.002 y b = -0.24: v = -(-0.24)/(2×0.002) = 0.24/0.004 = 60 km/h. También podemos completar cuadrados: C(v) = 0.002(v² - 120v) + 12 = 0.002(v - 60)² + 12 - 7.2 = 0.002(v - 60)² + 4.8. El vértice es (60, 4.8), confirmando v = 60 km/h.",
                "temas_relacionados": ["Función cuadrática", "Vértice", "Optimización", "Aplicaciones"]
            },
            {
                "numero": 78,
                "enunciado": "¿Cuál es el consumo mínimo de combustible?",
                "alternativas": [
                    {"letra": "A", "texto": "4.8 litros/100km"},
                    {"letra": "B", "texto": "6.0 litros/100km"},
                    {"letra": "C", "texto": "7.2 litros/100km"},
                    {"letra": "D", "texto": "8.0 litros/100km"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "Evaluamos en v = 60: C(60) = 0.002(60)² - 0.24(60) + 12 = 0.002(3600) - 14.4 + 12 = 7.2 - 14.4 + 12 = 4.8 litros/100km. Alternativamente, de la forma vértice C(v) = 0.002(v-60)² + 4.8, vemos directamente que el mínimo es 4.8.",
                "temas_relacionados": ["Evaluación de funciones", "Vértice", "Interpretación"]
            },
            {
                "numero": 79,
                "enunciado": "Conducir a 100 km/h produce un consumo de aproximadamente:",
                "alternativas": [
                    {"letra": "A", "texto": "8 litros/100km"},
                    {"letra": "B", "texto": "10 litros/100km"},
                    {"letra": "C", "texto": "12 litros/100km"},
                    {"letra": "D", "texto": "14 litros/100km"}
                ],
                "respuesta_correcta": "C",
                "explicacion": "C(100) = 0.002(100)² - 0.24(100) + 12 = 0.002(10000) - 24 + 12 = 20 - 24 + 12 = 8 litros/100km. Conducir a 100 km/h es menos eficiente que a 60 km/h (donde el consumo es 4.8), pero aún razonable.",
                "temas_relacionados": ["Evaluación", "Comparación", "Toma de decisiones"]
            },
            {
                "numero": 80,
                "enunciado": "Para determinar el intervalo de velocidades donde C(v) < 8, se debe resolver:",
                "alternativas": [
                    {"letra": "A", "texto": "0.002v² - 0.24v + 12 = 8"},
                    {"letra": "B", "texto": "0.002v² - 0.24v + 4 < 0"},
                    {"letra": "C", "texto": "0.002v² - 0.24v + 12 < 8"},
                    {"letra": "D", "texto": "v² - 120v + 2000 < 0"}
                ],
                "respuesta_correcta": "C",
                "explicacion": "Queremos C(v) < 8, entonces: 0.002v² - 0.24v + 12 < 8. Simplificando: 0.002v² - 0.24v + 4 < 0, o v² - 120v + 2000 < 0. Factorizando: (v - 20)(v - 100) < 0, solución: 20 < v < 100. El bus consume menos de 8 litros/100km cuando va entre 20 y 100 km/h.",
                "temas_relacionados": ["Inecuaciones cuadráticas", "Factorización", "Intervalos"]
            }
        ]
    },
    {
        "caso_id": "caso-mat-02",
        "titulo": "Análisis Estadístico de Rendimiento Escolar",
        "contexto": """
Un colegio realizó una prueba de Matemática a dos cursos de III Medio. Los resultados fueron:

**Curso A (35 estudiantes):**
- Media: 65 puntos
- Desviación estándar: 12 puntos
- Q1 = 58, Q2 = 65, Q3 = 72

**Curso B (35 estudiantes):**
- Media: 65 puntos
- Desviación estándar: 5 puntos  
- Q1 = 62, Q2 = 65, Q3 = 68

El equipo directivo debe decidir qué curso necesita mayor apoyo pedagógico y diseñar estrategias diferenciadas.
        """,
        "preguntas": [
            {
                "numero": 81,
                "enunciado": "Comparando ambos cursos, ¿cuál afirmación es CORRECTA?",
                "alternativas": [
                    {"letra": "A", "texto": "Curso A tiene mejor rendimiento porque Q3 es mayor"},
                    {"letra": "B", "texto": "Curso B es más homogéneo (menos dispersión) en sus resultados"},
                    {"letra": "C", "texto": "Ambos cursos tienen exactamente el mismo desempeño en todos los aspectos"},
                    {"letra": "D", "texto": "Curso A tiene peor rendimiento porque su desviación estándar es mayor"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Ambos cursos tienen la misma media (65), pero el Curso B tiene σ = 5 (menos dispersión) mientras el Curso A tiene σ = 12 (mayor dispersión). Esto significa que en B los estudiantes están más agrupados alrededor de la media (son más homogéneos), mientras en A hay mayor variabilidad (algunos muy sobre la media, otros muy bajo). Una σ mayor NO significa peor rendimiento (D es falso), solo mayor heterogeneidad.",
                "temas_relacionados": ["Desviación estándar", "Dispersión", "Interpretación", "Comparación"]
            },
            {
                "numero": 82,
                "enunciado": "El rango intercuartílico (RIC = Q3 - Q1) del Curso A es:",
                "alternativas": [
                    {"letra": "A", "texto": "6 puntos"},
                    {"letra": "B", "texto": "10 puntos"},
                    {"letra": "C", "texto": "14 puntos"},
                    {"letra": "D", "texto": "24 puntos"}
                ],
                "respuesta_correcta": "C",
                "explicacion": "RIC = Q3 - Q1 = 72 - 58 = 14 puntos. El rango intercuartílico contiene el 50% central de los datos. En el Curso A, el 50% central se distribuye en 14 puntos. Para el Curso B: RIC = 68 - 62 = 6 puntos, confirmando que B es más homogéneo (menor RIC).",
                "temas_relacionados": ["Rango intercuartílico", "Cuartiles", "Medidas de dispersión"]
            },
            {
                "numero": 83,
                "enunciado": "Si un estudiante del Curso A obtuvo 77 puntos, ¿en qué percentil aproximado se encuentra?",
                "alternativas": [
                    {"letra": "A", "texto": "Entre percentil 50 y 75"},
                    {"letra": "B", "texto": "Entre percentil 75 y 100"},
                    {"letra": "C", "texto": "En el percentil 50"},
                    {"letra": "D", "texto": "En el percentil 25"}
                ],
                "respuesta_correcta": "B",
                "explicacion": "Q3 = 72 corresponde al percentil 75 (el 75% de los estudiantes tiene 72 o menos). Como 77 > 72, el estudiante está sobre el percentil 75, por lo tanto entre percentil 75 y 100. Está en el cuartil superior del curso.",
                "temas_relacionados": ["Percentiles", "Cuartiles", "Posición relativa"]
            },
            {
                "numero": 84,
                "enunciado": "Desde una perspectiva pedagógica, ¿qué estrategia es más apropiada?",
                "alternativas": [
                    {"letra": "A", "texto": "Curso A necesita diferenciación (tiene estudiantes muy diversos), Curso B puede trabajar más homogéneamente"},
                    {"letra": "B", "texto": "Ambos cursos deben recibir exactamente las mismas actividades"},
                    {"letra": "C", "texto": "Curso B necesita más apoyo porque tiene menor desviación estándar"},
                    {"letra": "D", "texto": "Curso A debe ser dividido en dos niveles obligatoriamente"}
                ],
                "respuesta_correcta": "A",
                "explicacion": "La alta dispersión del Curso A (σ=12) indica que hay estudiantes con necesidades muy diversas: algunos pueden necesitar reforzamiento, otros desafíos adicionales. Requiere DIFERENCIACIÓN pedagógica (DUA, estaciones de aprendizaje, tareas multinivel). El Curso B (σ=5) es más homogéneo y puede trabajar con estrategias más uniformes. Esto NO significa dividir el curso (D), ni ignorar las diferencias (B).",
                "temas_relacionados": ["Didáctica", "Diferenciación", "DUA", "Interpretación estadística"]
            }
        ]
    }
]

def agregar_casos_estudio():
    """Agregar casos de estudio a plan.json de ambas evaluaciones"""
    
    # PARVULARIA
    print("="*70)
    print("📚 AGREGANDO CASOS DE ESTUDIO - PARVULARIA")
    print("="*70)
    
    with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
        plan_parv = json.load(f)
    
    # Agregar casos al final
    for caso in casos_parvularia:
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
    plan_parv['metadata']['version'] = 3
    plan_parv['metadata']['notas'] += " | v3: Agregados 2 casos de estudio situacionales estilo ECEP 2023 con 8 preguntas (4 por caso): Inclusión TEA, Resolución de conflictos."
    
    with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'w', encoding='utf-8') as f:
        json.dump(plan_parv, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Parvularia actualizada:")
    print(f"   - Total preguntas: {plan_parv['metadata']['total_preguntas']}")
    print(f"   - Casos de estudio: {plan_parv['metadata']['distribucion']['casos_estudio']}")
    
    # MATEMÁTICA MEDIA
    print(f"\n{'='*70}")
    print("📐 AGREGANDO CASOS DE ESTUDIO - MATEMÁTICA MEDIA")
    print("="*70)
    
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'r', encoding='utf-8') as f:
        plan_mat = json.load(f)
    
    # Agregar casos al final
    for caso in casos_matematica:
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
    plan_mat['metadata']['version'] = 3
    plan_mat['metadata']['notas'] += " | v3: Agregados 2 casos de estudio interdisciplinarios estilo ECEP 2023 con 8 preguntas (4 por caso): Función cuadrática en contexto real (transporte), Análisis estadístico (rendimiento escolar con diferenciación pedagógica)."
    
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'w', encoding='utf-8') as f:
        json.dump(plan_mat, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Matemática Media actualizada:")
    print(f"   - Total preguntas: {plan_mat['metadata']['total_preguntas']}")
    print(f"   - Casos de estudio: {plan_mat['metadata']['distribucion']['casos_estudio']}")
    
    print(f"\n{'='*70}")
    print("🎉 CASOS DE ESTUDIO AGREGADOS EXITOSAMENTE")
    print("="*70)

if __name__ == "__main__":
    agregar_casos_estudio()
