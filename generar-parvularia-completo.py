# -*- coding: utf-8 -*-
"""
Generador completo de evaluación Educación Parvularia NT
100 preguntas + 5 casos de estudio
"""

import json
import os

# Ruta del archivo
ruta_plan = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-parvularia\pruebas\parv-nt\plan.json"

# Cargar metadata existente
with open(ruta_plan, 'r', encoding='utf-8') as f:
    plan = json.load(f)

# ÁMBITO 1: DESARROLLO PERSONAL Y SOCIAL (25 preguntas)
# Núcleo: Identidad y Autonomía (10 preguntas)
identidad_autonomia = [
    {
        "id": "parv-01",
        "numero": 1,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Reconocimiento y expresión de emociones",
        "enunciado": "Un niño de NT2 llega llorando porque perdió su juguete favorito. ¿Cuál es la estrategia más adecuada según las Bases Curriculares?",
        "alternativas": [
            {"letra": "A", "texto": "Decirle que no llore, que traerá otro juguete mañana"},
            {"letra": "B", "texto": "Validar su emoción diciendo 'entiendo que estés triste', acompañarlo y ayudarlo a buscar soluciones"},
            {"letra": "C", "texto": "Ignorar el llanto para que aprenda a autorregularse solo"},
            {"letra": "D", "texto": "Castigarlo por ser descuidado con sus cosas"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Las Bases Curriculares enfatizan la importancia de validar las emociones de los niños/as, nombrarlas y acompañar el proceso de autorregulación. La educadora debe reconocer la emoción ('veo que estás triste'), acoger al niño/a con empatía, y luego facilitar la búsqueda de soluciones (buscar el juguete, usar otro temporalmente). Esto fortalece la autoestima, la confianza y desarrolla habilidades de regulación emocional progresivamente.",
        "temas_relacionados": ["Regulación emocional", "Validación emocional", "Autoestima", "Acompañamiento respetuoso"]
    },
    {
        "id": "parv-02",
        "numero": 2,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Desarrollo de la autonomía",
        "enunciado": "¿Cuál actividad promueve MEJOR la autonomía en niños/as de NT1?",
        "alternativas": [
            {"letra": "A", "texto": "La educadora sirve la colación a cada niño en su mesa"},
            {"letra": "B", "texto": "Los niños/as se sirven solos utilizando jarras pequeñas y platos a su alcance"},
            {"letra": "C", "texto": "Un adulto alimenta a los niños/as para evitar que se ensucien"},
            {"letra": "D", "texto": "Los niños/as esperan que la educadora les indique cada paso"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La autonomía se desarrolla cuando los niños/as pueden tomar decisiones y realizar acciones por sí mismos en un ambiente preparado. Servirse solos con implementos adaptados (jarras pequeñas, vasos bajos, platos irrompibles) les permite practicar coordinación motriz, planificar acciones, tomar decisiones (cuánto servirse) y experimentar logro personal. El rol adulto es preparar el ambiente, observar y acompañar sin anticiparse innecesariamente.",
        "temas_relacionados": ["Autonomía progresiva", "Ambiente preparado", "Independencia", "Coordinación motriz"]
    },
    {
        "id": "parv-03",
        "numero": 3,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Construcción de identidad",
        "enunciado": "Una niña de NT2 dice 'yo no puedo hacer ese dibujo'. ¿Cómo responde la educadora para fortalecer su autoestima?",
        "alternativas": [
            {"letra": "A", "texto": "'Claro que puedes, todos pueden dibujar bien'"},
            {"letra": "B", "texto": "'Veo que te preocupa, ¿qué parte te parece difícil? Podemos intentarlo juntas'"},
            {"letra": "C", "texto": "'No importa, yo lo dibujo por ti'"},
            {"letra": "D", "texto": "'No seas negativa, solo inténtalo'"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Fortalecer la autoestima requiere validar la preocupación del niño/a, indagar sobre sus percepciones, y ofrecer andamiaje específico. La educadora reconoce la emoción, pregunta para entender la dificultad, y ofrece acompañamiento respetuoso ('podemos intentarlo juntas'). Esto transmite confianza en sus capacidades mientras respeta su ritmo y proporciona apoyo ajustado. Evita sobreprotección (hacer por él/ella) y minimización de sus sentimientos.",
        "temas_relacionados": ["Autoestima", "Andamiaje pedagógico", "Validación", "Confianza"]
    },
    {
        "id": "parv-04",
        "numero": 4,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Iniciativa y toma de decisiones",
        "enunciado": "En el momento de juego libre, varios niños/as no saben qué hacer. ¿Cuál estrategia promueve mejor la iniciativa?",
        "alternativas": [
            {"letra": "A", "texto": "Asignar a cada niño/a el rincón donde debe jugar"},
            {"letra": "B", "texto": "Preguntar '¿qué te gustaría hacer hoy?' y mostrar las opciones disponibles"},
            {"letra": "C", "texto": "Organizar un juego dirigido para todo el grupo"},
            {"letra": "D", "texto": "Dejarlos sin orientación para que descubran solos"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La iniciativa se desarrolla cuando los niños/as pueden elegir y planificar sus acciones. La educadora facilita esto al preguntar sobre sus intereses, mostrar las opciones del ambiente (rincones, materiales), y acompañar la toma de decisión. Esto respeta su protagonismo, desarrolla capacidad de elección, y les ayuda a identificar sus preferencias. El ambiente debe tener opciones claras y atractivas que inviten a explorar.",
        "temas_relacionados": ["Iniciativa", "Protagonismo infantil", "Toma de decisiones", "Juego libre"]
    },
    {
        "id": "parv-05",
        "numero": 5,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Autorregulación",
        "enunciado": "Un niño de NT1 tiene dificultades para esperar su turno en un juego. ¿Qué estrategia pedagógica es más efectiva?",
        "alternativas": [
            {"letra": "A", "texto": "Sacarlo del juego hasta que aprenda a esperar"},
            {"letra": "B", "texto": "Usar un timer visual o canción corta para anticipar los turnos"},
            {"letra": "C", "texto": "Permitirle jugar solo para evitar conflictos"},
            {"letra": "D", "texto": "Decirle repetidamente 'tienes que esperar'"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La autorregulación en primera infancia requiere apoyos externos concretos que se internalizarán gradualmente. Un timer visual, reloj de arena, o canción breve hace tangible el concepto abstracto de 'esperar', ayudando al niño/a a anticipar cuándo será su turno. Esto reduce la ansiedad, desarrolla noción temporal, y proporciona una estructura que facilita la espera. Con práctica y maduración, estas ayudas externas se vuelven innecesarias.",
        "temas_relacionados": ["Autorregulación", "Apoyos visuales", "Anticipación", "Desarrollo temporal"]
    },
    {
        "id": "parv-06",
        "numero": 6,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Reconocimiento de características personales",
        "enunciado": "¿Cuál actividad favorece mejor el reconocimiento de características personales en NT2?",
        "alternativas": [
            {"letra": "A", "texto": "Llenar una ficha estandarizada con datos del niño/a"},
            {"letra": "B", "texto": "Crear un 'libro de mí mismo/a' con fotos, dibujos y relatos sobre sus gustos, familia, y logros"},
            {"letra": "C", "texto": "Mostrar láminas de diferentes niños/as y preguntar con quién se identifican"},
            {"letra": "D", "texto": "Realizar una evaluación psicológica de personalidad"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "El 'libro de mí mismo/a' es una experiencia significativa que promueve la reflexión sobre la propia identidad. Al incluir fotos familiares, dibujos personales, relatos sobre experiencias ('cuando nací', 'lo que me gusta hacer'), el niño/a construye narrativa de su identidad, reconoce sus características, valora su historia y familia. Integra lenguaje verbal, expresión gráfica, y reflexión personal. Es un documento vivo que se enriquece en el tiempo.",
        "temas_relacionados": ["Identidad personal", "Historia personal", "Narrativa identitaria", "Valoración de sí mismo"]
    },
    {
        "id": "parv-07",
        "numero": 7,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Expresión de preferencias y opiniones",
        "enunciado": "Durante la planificación del día, ¿cómo puede la educadora promover que los niños/as expresen sus preferencias?",
        "alternativas": [
            {"letra": "A", "texto": "Presentar el plan del día ya definido y explicarlo"},
            {"letra": "B", "texto": "Ofrecer 2-3 opciones de actividades y votar democráticamente"},
            {"letra": "C", "texto": "Preguntar '¿qué quieren hacer?' sin estructura"},
            {"letra": "D", "texto": "Dejar que cada niño/a haga lo que quiera sin coordinación"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Ofrecer opciones acotadas (2-3 alternativas) y votar democráticamente respeta las preferencias infantiles mientras mantiene estructura pedagógica. Los niños/as aprenden a expresar opiniones, escuchar las de otros, tomar decisiones grupales, y experimentar que sus voces importan. Las opciones deben ser factibles y conectadas con objetivos de aprendizaje. Esta práctica desarrolla autonomía, pensamiento crítico, y participación ciudadana desde temprana edad.",
        "temas_relacionados": ["Participación infantil", "Expresión de opiniones", "Toma de decisiones", "Democracia"]
    },
    {
        "id": "parv-08",
        "numero": 8,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Confianza en las propias capacidades",
        "enunciado": "Un niño de NT1 dice 'no sé amarrarme los zapatos'. ¿Cuál respuesta de la educadora es más apropiada?",
        "alternativas": [
            {"letra": "A", "texto": "'Ya eres grande, debes aprender solo'"},
            {"letra": "B", "texto": "'Está bien, aún estás aprendiendo. ¿Quieres que te muestre de nuevo o practicamos juntos?'"},
            {"letra": "C", "texto": "'Usa zapatos con velcro para no tener ese problema'"},
            {"letra": "D", "texto": "'Todos tus compañeros ya saben, debes esforzarte más'"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La respuesta normaliza el proceso de aprendizaje ('aún estás aprendiendo'), transmite que es normal no dominar todas las habilidades inmediatamente, y ofrece apoyo ajustado a su necesidad. La educadora da opciones (ver demostración o practicar juntos), respetando su preferencia y ritmo. Evita comparaciones con pares y presión que dañarían la autoconfianza. Esta actitud fomenta perseverancia, confianza en el proceso de aprendizaje, y relación de apoyo con el adulto.",
        "temas_relacionados": ["Confianza", "Aprendizaje progresivo", "Evitar comparaciones", "Apoyo ajustado"]
    },
    {
        "id": "parv-09",
        "numero": 9,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Cuidado de sí mismo",
        "enunciado": "¿Qué actividad promueve mejor el cuidado personal y hábitos de higiene en NT2?",
        "alternativas": [
            {"letra": "A", "texto": "Charlas expositivas sobre la importancia de lavarse las manos"},
            {"letra": "B", "texto": "Rutina diaria de lavado de manos con canción, espejo para observarse, y registros visuales"},
            {"letra": "C", "texto": "Premios a los niños/as que se laven mejor las manos"},
            {"letra": "D", "texto": "Supervisión estricta del adulto en cada lavado"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Los hábitos de higiene se construyen mediante rutinas consistentes, experiencia directa y reflexión. La rutina diaria establece el hábito; la canción hace el proceso lúdico y ayuda a medir el tiempo; el espejo permite observar la acción (metacognición); los registros visuales (fotos de pasos) apoyan la autonomía. Esta combinación integra movimiento, música, auto-observación y representación visual, haciendo el aprendizaje significativo y progresivamente autónomo.",
        "temas_relacionados": ["Hábitos de higiene", "Rutinas", "Autonomía", "Apoyos visuales"]
    },
    {
        "id": "parv-10",
        "numero": 10,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Identidad y Autonomía",
        "habilidad": "Manifestación de iniciativa",
        "enunciado": "¿Cómo debe organizar la educadora los materiales para favorecer la iniciativa infantil?",
        "alternativas": [
            {"letra": "A", "texto": "Guardar materiales en estantes altos para mantener el orden"},
            {"letra": "B", "texto": "Disponer materiales a la altura de los niños/as, en contenedores transparentes rotulados con imágenes"},
            {"letra": "C", "texto": "Entregar materiales solo cuando la educadora inicie una actividad"},
            {"letra": "D", "texto": "Cambiar la ubicación de materiales diariamente para sorprenderlos"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "El ambiente preparado es clave para la iniciativa. Materiales a la altura infantil comunican 'puedes tomarlos tú mismo/a'; contenedores transparentes permiten ver el contenido sin abrir; rótulos con imágenes facilitan devolución autónoma y orden. Esta organización invita a explorar, elegir, usar y guardar independientemente. El orden predecible (ubicación estable) da seguridad y autonomía. Los niños/as pueden iniciar proyectos personales sin depender constantemente del adulto.",
        "temas_relacionados": ["Ambiente preparado", "Iniciativa", "Organización espacial", "Autonomía"]
    }
]

# Continuar con las siguientes preguntas...
print("Generando preguntas de Identidad y Autonomía...")
plan["exam"]["preguntas"].extend(identidad_autonomia)

# Guardar progreso
with open(ruta_plan, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print(f"✅ Guardadas {len(identidad_autonomia)} preguntas de Identidad y Autonomía")
print(f"Total preguntas en plan.json: {len(plan['exam']['preguntas'])}")
