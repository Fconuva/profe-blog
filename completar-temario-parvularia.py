# -*- coding: utf-8 -*-
"""
Completa la evaluación de Parvularia con contenidos faltantes del temario ECEP 2025
y habilita el sistema de retroalimentación IA
"""

import json

# Cargar plan actual
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

# Preguntas nuevas para completar el temario
PREGUNTAS_NUEVAS = [
    {
        "id": "parv-101",
        "numero": 101,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Curriculum y Fundamentos",
        "habilidad": "Conocimiento de autores fundantes",
        "enunciado": "¿Cuál autor emblemático propuso los 'dones' (regalos pedagógicos) como material didáctico estructurado para el jardín infantil?",
        "alternativas": [
            {"letra": "A", "texto": "María Montessori (creó materiales sensoriales autocorrectivos)"},
            {"letra": "B", "texto": "Friedrich Froebel (fundador del kindergarten, creó los 'dones')"},
            {"letra": "C", "texto": "John Dewey (promovió el aprendizaje experiencial)"},
            {"letra": "D", "texto": "Reuven Feuerstein (desarrolló la teoría de la modificabilidad cognitiva)"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Friedrich Froebel (1782-1852) es el creador del concepto de 'kindergarten' (jardín de niños) y desarrolló los 'Fröebel Gifts' o 'dones': 20 materiales pedagógicos estructurados (esferas, cubos, cilindros, bloques de construcción) diseñados para promover el aprendizaje activo, la creatividad y el desarrollo integral a través del juego. Froebel consideraba al niño como una 'planta' que debe ser cultivada en un 'jardín' con materiales específicos. Montessori (A) creó materiales sensoriales diferentes; Dewey (C) enfatizó la experiencia práctica pero no diseñó materiales específicos; Feuerstein (D) es conocido por el PEI (Programa de Enriquecimiento Instrumental) para modificabilidad cognitiva.",
        "temas_relacionados": ["Froebel", "Dones pedagógicos", "Kindergarten", "Autores fundantes", "Historia de la Educación Parvularia"]
    },
    {
        "id": "parv-102",
        "numero": 102,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Curriculum y Fundamentos",
        "habilidad": "Conocimiento de modalidades curriculares",
        "enunciado": "¿Cuál es el principio fundamental de la modalidad curricular Reggio Emilia?",
        "alternativas": [
            {"letra": "A", "texto": "El uso de materiales Montessori autocorrectivos y secuenciados por dificultad"},
            {"letra": "B", "texto": "El niño como protagonista de su aprendizaje, el 'atelier' (taller artístico) y la documentación pedagógica como herramienta de reflexión"},
            {"letra": "C", "texto": "El aprendizaje a través de los siete periodos de desarrollo según Rudolf Steiner"},
            {"letra": "D", "texto": "El aprendizaje por descubrimiento guiado con énfasis en clasificación y seriación"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "Reggio Emilia (Italia) se caracteriza por: 1) La imagen del niño como ser competente, curioso y protagonista ('el niño tiene 100 lenguajes'); 2) El 'atelier' (taller artístico) donde un atelierista (especialista) facilita la expresión creativa; 3) La documentación pedagógica (fotos, videos, registros) para hacer visible el aprendizaje y reflexionar sobre la práctica; 4) El ambiente como 'tercer maestro' (espacios provocadores); 5) La progettazione (proyectos emergentes desde intereses infantiles). Montessori (A) usa materiales específicos; Waldorf (C) sigue los septenios de Steiner; High Scope (D) enfatiza el plan-hacer-revisar. Reggio Emilia no es un método prescriptivo sino una filosofía educativa basada en la escucha, la documentación y las múltiples expresiones (lenguajes) del niño.",
        "temas_relacionados": ["Reggio Emilia", "Atelier", "Documentación pedagógica", "100 lenguajes", "Modalidades curriculares"]
    },
    {
        "id": "parv-103",
        "numero": 103,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Desarrollo Socioemocional",
        "habilidad": "Estilos de crianza parentales",
        "enunciado": "Según Maccoby y Martin, ¿cuál estilo de crianza combina alta exigencia con alta responsividad/afecto?",
        "alternativas": [
            {"letra": "A", "texto": "Estilo autoritario (alta exigencia, baja responsividad): padres rígidos, controladores, con pocas muestras de afecto"},
            {"letra": "B", "texto": "Estilo permisivo (baja exigencia, alta responsividad): padres cálidos pero con pocas normas y límites"},
            {"letra": "C", "texto": "Estilo democrático o autorativo (alta exigencia, alta responsividad): padres que establecen límites claros con calidez, explican razones, escuchan al niño"},
            {"letra": "D", "texto": "Estilo negligente (baja exigencia, baja responsividad): padres distantes, poco involucrados"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "Maccoby y Martin (1983) proponen 4 estilos de crianza según dos dimensiones: exigencia/control y responsividad/afecto. El estilo DEMOCRÁTICO/AUTORATIVO (C) combina alta exigencia (normas claras, expectativas apropiadas) con alta responsividad (afecto, comprensión, comunicación bidireccional). Este estilo se asocia con mejores resultados: niños seguros, con autocontrol, socialmente competentes, con autoestima positiva. Autoritario (A): mucha exigencia, poco afecto (obediencia ciega, posible baja autoestima). Permisivo (B): mucho afecto, pocas reglas (dificultades de autorregulación). Negligente (D): ni exigencia ni afecto (mayores riesgos de desarrollo). Las educadoras deben reconocer estos estilos en las familias para adaptar estrategias de trabajo colaborativo y orientación parental.",
        "temas_relacionados": ["Estilos de crianza", "Maccoby y Martin", "Desarrollo socioemocional", "Trabajo con familias", "Crianza democrática"]
    },
    {
        "id": "parv-104",
        "numero": 104,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Bienestar Integral",
        "habilidad": "Programa Nacional de Inmunización",
        "enunciado": "¿A qué edad según el PNI (Programa Nacional de Inmunización) chileno se administra la vacuna Tres Vírica (sarampión, rubéola, paperas)?",
        "alternativas": [
            {"letra": "A", "texto": "2 meses (junto a la vacuna hexavalente)"},
            {"letra": "B", "texto": "12 meses (primera dosis) y refuerzo en 1° básico"},
            {"letra": "C", "texto": "6 meses (junto a la vacuna antineumocócica)"},
            {"letra": "D", "texto": "18 meses (única dosis requerida)"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "El Programa Nacional de Inmunización (PNI) de Chile establece que la vacuna Tres Vírica (protege contra sarampión, rubéola y paperas) se administra en dos dosis: PRIMERA DOSIS a los 12 meses de edad, y REFUERZO en 1° año básico (aproximadamente 6 años). Esta vacunación es gratuita y obligatoria. En Educación Parvularia, las educadoras deben: 1) Verificar carné de vacunas al ingreso; 2) Recordar a familias la importancia de completar esquema; 3) Coordinarse con centros de salud para jornadas de vacunación; 4) Educar sobre inmunización sin generar alarma. Las vacunas de 2 meses (A) incluyen hexavalente y neumocócica; 6 meses (C) es refuerzo de estas. Las educadoras actúan como agentes de salud preventiva en coordinación con sector sanitario.",
        "temas_relacionados": ["PNI", "Vacunas", "Tres Vírica", "Salud preventiva", "Bienestar integral", "Coordinación intersectorial"]
    },
    {
        "id": "parv-105",
        "numero": 105,
        "ambito": "Desarrollo Personal y Social",
        "nucleo": "Corporalidad y Movimiento",
        "habilidad": "Retroalimentación pedagógica en psicomotricidad",
        "enunciado": "Una niña de NT1 intenta lanzar una pelota al aro pero siempre queda corta. ¿Cuál retroalimentación es más efectiva para favorecer el aprendizaje motor?",
        "alternativas": [
            {"letra": "A", "texto": "'Fallaste otra vez, sigue intentando'"},
            {"letra": "B", "texto": "'Notaste que la pelota no llegó al aro. ¿Qué podrías hacer diferente? Prueba lanzar con más fuerza o acercarte un poco'"},
            {"letra": "C", "texto": "'No importa, todos somos diferentes en los deportes'"},
            {"letra": "D", "texto": "'Déjame mostrarte cómo se hace correctamente' (y lanzar la educadora)"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La retroalimentación efectiva en desarrollo motor debe ser: 1) DESCRIPTIVA (qué observaste: 'la pelota quedó corta'); 2) ORIENTADORA (qué ajustar: 'más fuerza' o 'acercarse'); 3) PROMOTORA DE REFLEXIÓN ('¿qué podrías hacer diferente?'); 4) RESPETUOSA DEL PROCESO (permitir múltiples intentos). La opción B cumple estos criterios: nombra lo observado sin juicio, invita a pensar estrategias, ofrece opciones concretas. Opción A es poco informativa y puede desmotivar; C minimiza el aprendizaje motor (todos pueden mejorar con práctica); D quita protagonismo al niño (el adulto resuelve en vez de guiar). Las Bases Curriculares enfatizan el error como oportunidad de aprendizaje. La retroalimentación debe andamiar (zona de desarrollo próximo) sin resolver por el niño, promoviendo autonomía y autoconocimiento corporal.",
        "temas_relacionados": ["Retroalimentación efectiva", "Desarrollo motor", "Andamiaje", "Zona de desarrollo próximo", "Uso pedagógico del error"]
    },
    {
        "id": "parv-106",
        "numero": 106,
        "ambito": "Comunicación Integral",
        "nucleo": "Lenguajes Artísticos",
        "habilidad": "Retroalimentación en expresión artística",
        "enunciado": "Un niño de NT2 muestra su dibujo diciendo 'hice un monstruo'. ¿Cuál respuesta promueve mejor la apreciación estética y expresión creativa?",
        "alternativas": [
            {"letra": "A", "texto": "'Qué lindo, pero los monstruos no son así, tienen colmillos'"},
            {"letra": "B", "texto": "'Muy bien' (sin mirar el dibujo realmente)"},
            {"letra": "C", "texto": "'Veo que usaste muchos colores en tu monstruo. ¿Cómo es? ¿Qué hace? ¿Por qué elegiste estos colores?'"},
            {"letra": "D", "texto": "'Ahora dibuja uno más bonito, como una flor'"}
        ],
        "respuesta_correcta": "C",
        "explicacion": "La retroalimentación efectiva en lenguajes artísticos debe: 1) OBSERVAR GENUINAMENTE ('veo que usaste muchos colores'); 2) VALORAR LA EXPRESIÓN PERSONAL (no imponer cánones adultos); 3) INVITAR A NARRAR ('¿cómo es?', '¿qué hace?') conectando arte con lenguaje verbal; 4) PREGUNTAR POR DECISIONES CREATIVAS ('¿por qué elegiste...?') promoviendo metacognición. La opción C cumple estos criterios, respetando la singularidad. Opción A impone visión adulta del 'monstruo correcto' (no existe); B es genérica y poco auténtica (el niño percibe falta de interés genuino); D desvaloriza su creación y dirige hacia temática 'aceptable'. El arte infantil es expresión, exploración y construcción de significados, no reproducción de modelos. Las educadoras deben ser 'espectadoras atentas' que hacen preguntas abiertas, no juezas que califican según cánones estéticos adultos.",
        "temas_relacionados": ["Retroalimentación artística", "Apreciación estética", "Expresión creativa", "Preguntas abiertas", "Valoración de la singularidad"]
    },
    {
        "id": "parv-107",
        "numero": 107,
        "ambito": "Interacción y Comprensión del Entorno",
        "nucleo": "Exploración del Entorno Natural",
        "habilidad": "Retroalimentación en indagación científica",
        "enunciado": "Durante un experimento con plantas, un niño pregunta '¿por qué esta planta está amarilla?'. ¿Cuál respuesta promueve mejor el pensamiento científico?",
        "alternativas": [
            {"letra": "A", "texto": "'Porque no tiene agua. Vamos a regarla'"},
            {"letra": "B", "texto": "'Esa es una excelente pregunta. ¿Qué crees tú que podría estar pasando? ¿En qué se diferencia de las otras plantas? ¿Qué podríamos hacer para comprobarlo?'"},
            {"letra": "C", "texto": "'Las plantas se ponen amarillas cuando están enfermas, es normal'"},
            {"letra": "D", "texto": "'Búscalo en este libro de plantas' (y entregar el libro)"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La retroalimentación que promueve pensamiento científico debe: 1) VALORAR LA CURIOSIDAD ('excelente pregunta'); 2) DEVOLVER LA PREGUNTA para que el niño HIPOTETICE ('¿qué crees tú?'); 3) PROMOVER OBSERVACIÓN COMPARATIVA ('¿en qué se diferencia?'); 4) IMPULSAR VERIFICACIÓN EMPÍRICA ('¿qué podríamos hacer para comprobarlo?'). La opción B sigue el ciclo de indagación: pregunta → hipótesis → observación → experimentación. Opción A da respuesta directa (cierra indagación); C normaliza sin invitar a pensar; D delega a fuente externa sin andamiar el proceso. Las Bases Curriculares enfatizan que los niños deben SER CIENTÍFICOS (observar, preguntar, experimentar), no solo APRENDER ciencia. La educadora es facilitadora que hace preguntas provocadoras, no la que tiene todas las respuestas. Este enfoque desarrolla pensamiento crítico, habilidades de investigación y disposición a aprender autónomamente.",
        "temas_relacionados": ["Pensamiento científico", "Indagación", "Formulación de hipótesis", "Observación", "Método científico infantil"]
    },
    {
        "id": "parv-108",
        "numero": 108,
        "ambito": "Interacción y Comprensión del Entorno",
        "nucleo": "Comprensión del Entorno Sociocultural",
        "habilidad": "Retroalimentación en educación intercultural",
        "enunciado": "Un niño mapuche de NT2 comparte que en su casa hablan 'mapudungun'. Otro niño dice 'habla raro'. ¿Cómo retroalimentar para promover valoración de la diversidad cultural?",
        "alternativas": [
            {"letra": "A", "texto": "'No digamos que habla raro, todos hablamos distinto'"},
            {"letra": "B", "texto": "'¡Qué interesante! El mapudungun es una lengua ancestral muy importante en Chile. ¿Nos puedes enseñar alguna palabra? Todos tenemos historias y lenguas familiares valiosas. ¿Alguien más habla otra lengua en casa?'"},
            {"letra": "C", "texto": "'En el jardín solo hablamos español'"},
            {"letra": "D", "texto": "Ignorar el comentario y seguir con la actividad"}
        ],
        "respuesta_correcta": "B",
        "explicacion": "La retroalimentación intercultural efectiva debe: 1) VALORAR EXPLÍCITAMENTE la diversidad cultural ('¡qué interesante!', 'importante'); 2) EDUCAR sobre patrimonio cultural ('lengua ancestral'); 3) DAR VOZ Y PROTAGONISMO al niño ('¿nos enseñas?'); 4) UNIVERSALIZAR LA DIVERSIDAD ('todos tenemos historias valiosas'); 5) INVITAR A OTROS A COMPARTIR ('¿alguien más?'). La opción B transforma un momento potencialmente de exclusión en oportunidad de aprendizaje intercultural. Opción A corrige sin educar (minimaliza); C es asimilacionista (invisibiliza pluralidad); D pierde oportunidad pedagógica. Las Bases Curriculares y el enfoque de derechos enfatizan el reconocimiento de la diversidad cultural como riqueza. La educadora debe ser agente activa de educación intercultural, combatiendo prejuicios y promoviendo orgullo identitario y respeto mutuo. El mapudungun es lengua oficial en Chile (Ley Indígena 19.253).",
        "temas_relacionados": ["Educación intercultural", "Diversidad cultural", "Lenguas originarias", "Mapudungun", "Identidad cultural", "Retroalimentación inclusiva"]
    }
]

# Agregar las nuevas preguntas
plan['exam']['preguntas'].extend(PREGUNTAS_NUEVAS)

# Actualizar metadata
plan['metadata']['total_preguntas'] = 108
plan['metadata']['distribucion']['preguntas_base'] = 83
plan['metadata']['distribucion']['curriculum_fundamentos'] = 8
plan['metadata']['ultima_actualizacion'] = "2025-11-06"
plan['metadata']['version'] = 2
plan['metadata']['notas'] = plan['metadata']['notas'] + " | v2: Agregadas 8 preguntas para completar 100% del temario ECEP 2025 (autores fundantes, modalidades curriculares, estilos de crianza, PNI, retroalimentación pedagógica en 4 núcleos). Cobertura curricular: 100% (53/53 contenidos)."

# Agregar prompts IA específicos para nuevos contenidos
plan['metadata']['prompts_ia']['curriculum_fundamentos'] = "Explica autores emblemáticos (Froebel, Agazzi, Montessori, Dewey, Feuerstein) y sus aportes, modalidades curriculares (Montessori, Waldorf, Reggio Emilia, High Scope), principios pedagógicos de las BCEP, y trabajo con familia y comunidad. Usa ejemplos concretos de cómo estos fundamentos se aplican en el aula NT."
plan['metadata']['prompts_ia']['desarrollo_integral'] = "Aborda desarrollo cognitivo (funciones ejecutivas, ZDP), desarrollo socioemocional (estilos de crianza de Maccoby y Martin, tipos de apego de Bowlby y Ainsworth), desarrollo psicomotor (hitos, conciencia corporal) y bienestar integral (alimentación, PNI). Relaciona teoría con práctica en NT1-NT2."
plan['metadata']['prompts_ia']['retroalimentacion_pedagogica'] = "Explica cómo dar retroalimentación efectiva en: corporalidad y movimiento (uso del error motor, andamiaje), lenguajes artísticos (valoración de expresión creativa), exploración natural (promoción de pensamiento científico) y comprensión sociocultural (educación intercultural). Usa ejemplos de interacciones concretas educadora-párvulo."

# Guardar plan actualizado
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print("✅ Plan actualizado con 8 preguntas nuevas")
print(f"   Total preguntas: {plan['metadata']['total_preguntas']}")
print(f"   Distribución: {plan['metadata']['distribucion']}")
print(f"   Versión: {plan['metadata']['version']}")
print(f"   Prompts IA: {len(plan['metadata']['prompts_ia'])} temas")
