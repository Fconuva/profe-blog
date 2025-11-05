#!/usr/bin/env python3
"""
Script para generar 10 casos de estudio de Lenguaje y Comunicación ECEP 2025
Cada caso tiene 2 preguntas (20 preguntas totales)
Total: 50 preguntas regulares + 20 de casos = 70 preguntas
"""

import json
import os

# 10 Casos de Estudio de Lenguaje
casos_estudio = [
    {
        "titulo": "Análisis de un cuento latinoamericano",
        "contexto": """<p>Una docente de 8° básico trabaja con el cuento "El Sur" de Jorge Luis Borges. Analiza el siguiente fragmento:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        "El hombre que desembarcó en Buenos Aires en 1871 se llamaba Johannes Dahlmann y era pastor de la iglesia evangélica; en 1939, uno de sus nietos, Juan Dahlmann, era secretario de una biblioteca municipal en la calle Córdoba..."
        </blockquote>
        <p>La docente quiere que sus estudiantes identifiquen cómo el narrador maneja el tiempo narrativo en este inicio.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué recurso temporal utiliza el narrador en este fragmento?",
            "alternativas": [
                {"opcion": "A", "texto": "Flashforward, anticipa eventos futuros"},
                {"opcion": "B", "texto": "Analepsis, retrocede en el tiempo para dar contexto histórico"},
                {"opcion": "C", "texto": "Tiempo circular, vuelve al punto de inicio"},
                {"opcion": "D", "texto": "Narración in medias res, comienza en medio de la acción"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El narrador usa analepsis (flashback) al retroceder desde 1939 hasta 1871 para explicar el origen familiar del protagonista."
        },
        "pregunta_02": {
            "enunciado": "¿Qué tipo de narrador se evidencia en este fragmento?",
            "alternativas": [
                {"opcion": "A", "texto": "Narrador protagonista que cuenta su historia"},
                {"opcion": "B", "texto": "Narrador testigo que presenció los hechos"},
                {"opcion": "C", "texto": "Narrador omnisciente con conocimiento total"},
                {"opcion": "D", "texto": "Narrador objetivo que solo describe acciones"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "Es un narrador omnisciente heterodiegético que conoce la historia completa de la familia Dahlmann y puede moverse libremente en el tiempo."
        }
    },
    {
        "titulo": "Análisis de discurso argumentativo",
        "contexto": """<p>Un docente trabaja con estudiantes de 7° básico el siguiente fragmento de una columna de opinión:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        "Los jóvenes de hoy leen menos que las generaciones anteriores. Según el estudio de la UNESCO 2024, el 65% de adolescentes chilenos no lee libros fuera del colegio. Sin embargo, estos mismos jóvenes consumen horas diarias de contenido escrito en redes sociales. ¿No es eso también leer? Debemos ampliar nuestra definición de lectura."
        </blockquote>
        <p>El docente pide identificar la estructura argumentativa del texto.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué tipo de argumento utiliza el autor al citar el estudio de UNESCO?",
            "alternativas": [
                {"opcion": "A", "texto": "Argumento por analogía"},
                {"opcion": "B", "texto": "Argumento de autoridad respaldado por datos"},
                {"opcion": "C", "texto": "Argumento por ejemplificación"},
                {"opcion": "D", "texto": "Argumento basado en valores"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Cita una fuente autorizada (UNESCO) con datos estadísticos (65%) para respaldar su afirmación, lo que constituye un argumento de autoridad."
        },
        "pregunta_02": {
            "enunciado": "¿Qué estrategia retórica utiliza en la pregunta '¿No es eso también leer?'?",
            "alternativas": [
                {"opcion": "A", "texto": "Pregunta retórica para reforzar su punto de vista"},
                {"opcion": "B", "texto": "Pregunta literal que requiere respuesta"},
                {"opcion": "C", "texto": "Ironía para contradecir su argumento"},
                {"opcion": "D", "texto": "Metáfora para embellecer el discurso"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Es una pregunta retórica que no espera respuesta, sino que busca que el lector reflexione y coincida con el planteamiento del autor."
        }
    },
    {
        "titulo": "Análisis de poesía chilena",
        "contexto": """<p>Una docente analiza con 8° básico el poema "Altazor" de Vicente Huidobro:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        "Soy el ángel salvaje que cayó una mañana<br>
        en vuestras plantaciones de preceptos<br>
        Poeta<br>
        Anti poeta<br>
        Culto<br>
        Anticulto"
        </blockquote>
        <p>Se enfoca en las características vanguardistas del poema.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué figura literaria predomina en 'vuestras plantaciones de preceptos'?",
            "alternativas": [
                {"opcion": "A", "texto": "Metáfora, las reglas son comparadas con plantaciones"},
                {"opcion": "B", "texto": "Hipérbole, exagera la cantidad de reglas"},
                {"opcion": "C", "texto": "Personificación, da vida a los preceptos"},
                {"opcion": "D", "texto": "Aliteración, repite sonidos consonánticos"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Es una metáfora que compara las normas y reglas establecidas (preceptos) con plantaciones, sugiriendo algo cultivado y ordenado artificialmente."
        },
        "pregunta_02": {
            "enunciado": "La estructura fragmentada con versos de una palabra ('Poeta', 'Anti poeta') es característica de:",
            "alternativas": [
                {"opcion": "A", "texto": "Poesía romántica que expresa emociones"},
                {"opcion": "B", "texto": "Poesía vanguardista que rompe estructuras tradicionales"},
                {"opcion": "C", "texto": "Poesía épica que narra hazañas"},
                {"opcion": "D", "texto": "Poesía lírica que describe la naturaleza"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "La fragmentación, el verso libre y las contradicciones (Poeta/Anti poeta) son características del Creacionismo, movimiento vanguardista fundado por Huidobro."
        }
    },
    {
        "titulo": "Comprensión de texto expositivo",
        "contexto": """<p>Un docente trabaja con 7° básico el siguiente texto sobre el cambio climático:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        "El efecto invernadero es un proceso natural que permite que la Tierra mantenga una temperatura habitable. Sin embargo, la actividad humana ha intensificado este efecto. La quema de combustibles fósiles libera grandes cantidades de CO2 a la atmósfera. Como resultado, la temperatura global ha aumentado 1.1°C desde la era preindustrial, provocando el derretimiento de glaciares y el aumento del nivel del mar."
        </blockquote>
        <p>Se pide identificar la estructura organizativa del texto.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué relación de ideas se establece entre el efecto invernadero natural y la actividad humana?",
            "alternativas": [
                {"opcion": "A", "texto": "Causa-efecto: la actividad humana intensifica el efecto invernadero"},
                {"opcion": "B", "texto": "Comparación: se contrastan ambos fenómenos"},
                {"opcion": "C", "texto": "Secuencia temporal: uno ocurre después del otro"},
                {"opcion": "D", "texto": "Problema-solución: se plantea el problema y su respuesta"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "El texto establece una relación causa-efecto donde la actividad humana (causa) intensifica el efecto invernadero natural (efecto)."
        },
        "pregunta_02": {
            "enunciado": "¿Qué función cumple el dato '1.1°C desde la era preindustrial' en el texto?",
            "alternativas": [
                {"opcion": "A", "texto": "Opinar sobre el cambio climático"},
                {"opcion": "B", "texto": "Ejemplificar con evidencia concreta el aumento de temperatura"},
                {"opcion": "C", "texto": "Contradecir la información anterior"},
                {"opcion": "D", "texto": "Describir subjetivamente el fenómeno"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El dato estadístico sirve como evidencia concreta que ejemplifica y respalda la afirmación sobre el aumento de temperatura global."
        }
    },
    {
        "titulo": "Análisis de obra dramática",
        "contexto": """<p>Una docente de 8° básico analiza un fragmento de "La Negra Ester" de Roberto Parra:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        <strong>ESTER:</strong> (Al público) Y así llegué a este puerto, buscando mejor vida...<br>
        <strong>APARICIO:</strong> (Entrando) ¿La Negra Ester? Dicen que es la mejor bailarina del puerto.<br>
        <strong>ESTER:</strong> (Girando) ¿Y quién pregunta por ella?<br>
        [Acotación: Se escucha música de cueca desde el fondo del escenario]
        </blockquote>
        <p>Se trabaja la estructura dramática y elementos del teatro chileno.</p>""",
        "pregunta_01": {
            "enunciado": "Cuando Ester dice '(Al público) Y así llegué a este puerto', ¿qué recurso dramático utiliza?",
            "alternativas": [
                {"opcion": "A", "texto": "Aparte, habla consigo misma"},
                {"opcion": "B", "texto": "Monólogo, reflexiona en voz alta"},
                {"opcion": "C", "texto": "Soliloquio, expresa pensamientos íntimos"},
                {"opcion": "D", "texto": "Ruptura de la cuarta pared, se dirige al público"}
            ],
            "respuesta_correcta": "D",
            "explicacion": "La acotación '(Al público)' indica que Ester rompe la cuarta pared, recurso dramático donde el personaje se dirige directamente a los espectadores."
        },
        "pregunta_02": {
            "enunciado": "¿Qué función cumplen las acotaciones como '[Se escucha música de cueca]'?",
            "alternativas": [
                {"opcion": "A", "texto": "Son diálogos que deben decir los actores"},
                {"opcion": "B", "texto": "Indican aspectos escénicos, sonoros o gestuales"},
                {"opcion": "C", "texto": "Son comentarios del autor sobre la trama"},
                {"opcion": "D", "texto": "Describen el vestuario de los personajes"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Las acotaciones son indicaciones técnicas para director, actores y equipo sobre aspectos escénicos, sonoros, gestuales o de movimiento en escena."
        }
    },
    {
        "titulo": "Análisis de texto periodístico",
        "contexto": """<p>Un docente trabaja con 7° básico la siguiente noticia:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        <strong>Titular:</strong> "Estudiantes chilenos obtienen segundo lugar en competencia internacional de robótica"<br><br>
        <strong>Lead:</strong> Santiago, 15 de enero de 2025. Un equipo de cinco estudiantes del Liceo Experimental Manuel de Salas obtuvo el segundo lugar en la World Robot Olympiad realizada en Japón, superando a más de 80 equipos de 45 países.<br><br>
        <strong>Cuerpo:</strong> El proyecto ganador consistió en un robot autónomo capaz de clasificar residuos plásticos. La profesora María González destacó que "este logro es resultado de dos años de trabajo conjunto"...
        </blockquote>
        <p>Se analiza la estructura de la noticia.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuál es la función del lead en esta noticia?",
            "alternativas": [
                {"opcion": "A", "texto": "Opinar sobre el logro de los estudiantes"},
                {"opcion": "B", "texto": "Resumir las ideas principales respondiendo qué, quién, cuándo y dónde"},
                {"opcion": "C", "texto": "Describir detalladamente el robot ganador"},
                {"opcion": "D", "texto": "Concluir la noticia con una reflexión"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El lead es el primer párrafo que resume los datos esenciales de la noticia: qué (segundo lugar), quién (estudiantes del liceo), cuándo (15 enero), dónde (Japón)."
        },
        "pregunta_02": {
            "enunciado": "La cita textual de la profesora María González cumple la función de:",
            "alternativas": [
                {"opcion": "A", "texto": "Dar objetividad y credibilidad con testimonios directos"},
                {"opcion": "B", "texto": "Opinar sobre los resultados de la competencia"},
                {"opcion": "C", "texto": "Contradecir la información del lead"},
                {"opcion": "D", "texto": "Describir técnicamente el robot"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Las citas textuales en noticias aportan credibilidad y objetividad al incorporar testimonios directos de personas involucradas en el hecho noticioso."
        }
    },
    {
        "titulo": "Comprensión de texto instructivo",
        "contexto": """<p>Un docente de 8° básico trabaja con el siguiente texto instructivo:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        <strong>Cómo realizar un comentario de texto literario:</strong><br>
        1. Lee atentamente el texto completo al menos dos veces<br>
        2. Identifica el tema central y los temas secundarios<br>
        3. Analiza los recursos literarios presentes (metáforas, personificaciones, etc.)<br>
        4. Determina el tipo de narrador o hablante lírico<br>
        5. Interpreta el mensaje o propósito del autor<br>
        6. Redacta tu comentario siguiendo una estructura: introducción, desarrollo y conclusión<br><br>
        <strong>Nota:</strong> Es fundamental respaldar cada afirmación con citas textuales.
        </blockquote>
        <p>Se analiza la estructura y características del texto instructivo.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué modo verbal predomina en este tipo de texto instructivo?",
            "alternativas": [
                {"opcion": "A", "texto": "Modo indicativo para describir hechos"},
                {"opcion": "B", "texto": "Modo subjuntivo para expresar deseos"},
                {"opcion": "C", "texto": "Modo imperativo para dar instrucciones directas"},
                {"opcion": "D", "texto": "Modo infinitivo para generalizar las acciones"}
            ],
            "respuesta_correcta": "D",
            "explicacion": "Aunque el imperativo es común en instructivos, este texto usa infinitivos (leer, identificar, analizar) para dar instrucciones de forma impersonal y general."
        },
        "pregunta_02": {
            "enunciado": "La estructura numerada del 1 al 6 cumple la función de:",
            "alternativas": [
                {"opcion": "A", "texto": "Ordenar cronológicamente los pasos a seguir"},
                {"opcion": "B", "texto": "Jerarquizar las ideas de más a menos importante"},
                {"opcion": "C", "texto": "Separar ideas sin relación entre sí"},
                {"opcion": "D", "texto": "Ejemplificar diferentes tipos de comentarios"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "La numeración secuencial establece un orden cronológico de pasos que deben seguirse de forma progresiva para realizar correctamente el comentario de texto."
        }
    },
    {
        "titulo": "Análisis de novela chilena",
        "contexto": """<p>Una docente de 8° básico trabaja con fragmentos de "Hijo de ladrón" de Manuel Rojas:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        "Me llamo Aniceto Hevia, tengo diecinueve años y once meses, y desde el quince de enero del presente año me encuentro en estas Oficinas Salitreras de Pampa Bella. ¿Cómo llegué hasta aquí? Caminando. Un día salí de Valparaíso, atravesé Chile de sur a norte y continué por el desierto."
        </blockquote>
        <p>Se analiza el inicio de la novela y sus características narrativas.</p>""",
        "pregunta_01": {
            "enunciado": "¿Desde qué perspectiva narrativa se relata la historia?",
            "alternativas": [
                {"opcion": "A", "texto": "Narrador omnisciente en tercera persona"},
                {"opcion": "B", "texto": "Narrador protagonista en primera persona"},
                {"opcion": "C", "texto": "Narrador testigo que observa los hechos"},
                {"opcion": "D", "texto": "Narrador objetivo sin acceso a pensamientos"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El uso de primera persona ('Me llamo', 'tengo', 'me encuentro') indica un narrador protagonista que cuenta su propia historia."
        },
        "pregunta_02": {
            "enunciado": "La pregunta '¿Cómo llegué hasta aquí? Caminando' es un ejemplo de:",
            "alternativas": [
                {"opcion": "A", "texto": "Diálogo entre personajes"},
                {"opcion": "B", "texto": "Pregunta retórica seguida de respuesta directa"},
                {"opcion": "C", "texto": "Monólogo interior del protagonista"},
                {"opcion": "D", "texto": "Descripción objetiva del narrador"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Es una pregunta retórica que el narrador-protagonista se hace a sí mismo y responde inmediatamente de forma concisa y directa."
        }
    },
    {
        "titulo": "Análisis de texto publicitario",
        "contexto": """<p>Un docente de 7° básico analiza el siguiente afiche publicitario:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        <strong>[Imagen de una familia sonriente en la playa]</strong><br><br>
        <strong>Texto principal:</strong> "Tus recuerdos no esperan. Viaja ahora con TurismoChile"<br>
        <strong>Eslogan:</strong> "Porque los mejores momentos se viven HOY"<br>
        <strong>Texto pequeño:</strong> Planes desde $199.990 para familias de 4 personas. Válido hasta marzo 2025.
        </blockquote>
        <p>Se trabaja la identificación de recursos persuasivos.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué recurso persuasivo utiliza la frase 'Tus recuerdos no esperan'?",
            "alternativas": [
                {"opcion": "A", "texto": "Argumento lógico basado en hechos"},
                {"opcion": "B", "texto": "Apelación emocional creando urgencia"},
                {"opcion": "C", "texto": "Argumento de autoridad citando expertos"},
                {"opcion": "D", "texto": "Comparación con otras empresas"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "La frase apela a las emociones (recuerdos, tiempo limitado) y crea sensación de urgencia para persuadir a actuar inmediatamente."
        },
        "pregunta_02": {
            "enunciado": "El uso de mayúsculas en 'HOY' del eslogan busca:",
            "alternativas": [
                {"opcion": "A", "texto": "Corregir un error ortográfico"},
                {"opcion": "B", "texto": "Enfatizar visualmente la idea de inmediatez"},
                {"opcion": "C", "texto": "Indicar que es una marca registrada"},
                {"opcion": "D", "texto": "Separar diferentes secciones del texto"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Las mayúsculas son un recurso tipográfico para enfatizar visualmente la palabra clave, reforzando el mensaje de actuar de inmediato."
        }
    },
    {
        "titulo": "Análisis de cuento fantástico",
        "contexto": """<p>Una docente de 8° básico trabaja con el cuento "Casa tomada" de Julio Cortázar:</p>
        <blockquote class="border-l-4 border-purple-400 pl-4 py-2 my-4 italic bg-gray-50">
        "Nos resultaba grato almorzar pensando en la casa profunda y silenciosa y cómo nos bastábamos para mantenerla limpia. A veces llegábamos a creer que era ella la que no nos dejó casarnos. Irene rechazó dos pretendientes sin mayor motivo, a mí se me murió María Esther antes que llegáramos a comprometernos."
        </blockquote>
        <p>Se analiza cómo se construye lo fantástico en la literatura.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué elemento fantástico sugiere el fragmento 'era ella [la casa] la que no nos dejó casarnos'?",
            "alternativas": [
                {"opcion": "A", "texto": "Personificación de la casa con voluntad propia"},
                {"opcion": "B", "texto": "Descripción realista de una casa vieja"},
                {"opcion": "C", "texto": "Metáfora sobre la soledad de los personajes"},
                {"opcion": "D", "texto": "Ironía sobre las costumbres sociales"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "La atribución de voluntad e intencionalidad a la casa ('no nos dejó') es un elemento fantástico que personifica el espacio con poder sobre los personajes."
        },
        "pregunta_02": {
            "enunciado": "El tono de la narración en este fragmento se caracteriza por:",
            "alternativas": [
                {"opcion": "A", "texto": "Dramatismo exagerado ante sucesos extraordinarios"},
                {"opcion": "B", "texto": "Naturalidad al narrar eventos inquietantes como cotidianos"},
                {"opcion": "C", "texto": "Humor irónico sobre las situaciones descritas"},
                {"opcion": "D", "texto": "Terror explícito ante lo sobrenatural"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Característica del realismo fantástico de Cortázar: narrar lo inquietante (casa que impide matrimonios) con tono natural y cotidiano, sin dramatismo."
        }
    }
]

# Leer el archivo actual
archivo_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\pruebas\63-sc-l\plan.json"

with open(archivo_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Agregar casos de estudio
data['casos_estudio'] = casos_estudio

# Actualizar el prompt de IA para que sea específico de Lenguaje, no de Educación Especial
data['exam']['ia_feedback']['prompt'] = """Eres un tutor pedagógico especializado en Lenguaje y Comunicación para docentes chilenos que preparan la ECEP 2025.

Te enviaré UNA PREGUNTA ESPECÍFICA de la prueba de Lenguaje con sus alternativas y respuesta correcta. Tu tarea es:

## 1. POR QUÉ ES CORRECTA (2-3 líneas)
- Explica claramente por qué la alternativa correcta es la respuesta
- Usa fundamentos curriculares específicos (OA de 7°-8° básico, habilidades lectoras)
- Conecta con conceptos de teoría literaria, comprensión lectora o producción textual

## 2. POR QUÉ LAS OTRAS SON INCORRECTAS (1 línea por cada alternativa)
- Analiza TODAS las alternativas incorrectas
- Explica el error conceptual de cada una
- Señala confusiones comunes entre estudiantes

## 3. APLICACIÓN DIDÁCTICA (2-3 sugerencias)
- Cómo enseñar este contenido en 7°-8° básico
- Actividades concretas para trabajar la habilidad evaluada
- Textos chilenos/latinoamericanos que sirven como ejemplo

FORMATO:
- Usa markdown limpio (##, **, -, >)
- Directo y pedagógico, sin saludos ni despedidas
- Máximo 300 palabras
- NO digas "Lo siento" o "Como asistente de IA..." ni menciones Educación Especial o PIE

EJEMPLO DE RESPUESTA:
## Por qué C es correcta
El narrador omnisciente conoce pensamientos de todos los personajes, lo que corresponde a un **narrador con conocimiento total**. Esto es característico de narradores heterodiegéticos con focalización cero según la teoría narratológica.

## Por qué las otras son incorrectas
- **A (Protagonista)**: El narrador protagonista usa primera persona y cuenta su propia historia, no accede a todos los pensamientos
- **B (Testigo)**: El narrador testigo observa desde afuera pero no conoce la interioridad de los personajes
- **D (Equisciente)**: El narrador equisciente solo conoce lo que sabe un personaje específico, no todos

## Aplicación didáctica
- Usa cuentos como "El hombre muerto" (Quiroga) o "El Sur" (Borges) para identificar tipos de narrador
- Pide a estudiantes reescribir un párrafo cambiando el tipo de narrador (de omnisciente a protagonista)
- Evalúa con preguntas: ¿Qué sabe el narrador? ¿Cómo lo sabemos? ¿Desde qué perspectiva se cuenta?"""

# Actualizar metadata
data['metadata']['ultima_revision'] = '2025-11-05'
data['metadata']['version'] = 2
data['metadata']['nota'] = 'Agregados 10 casos de estudio (20 preguntas) para completar 70 preguntas totales'

# Guardar archivo actualizado
with open(archivo_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("✅ Casos de estudio agregados exitosamente")
print(f"📊 Total preguntas regulares: {len(data['exam']['preguntas'])}")
print(f"📚 Total casos de estudio: {len(data['casos_estudio'])}")
print(f"🎯 Total preguntas en la prueba: {len(data['exam']['preguntas']) + len(data['casos_estudio']) * 2}")
