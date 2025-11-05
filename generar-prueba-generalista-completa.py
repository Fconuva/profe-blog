# -*- coding: utf-8 -*-
"""
Generador de Prueba Estandarizada: Educación Básica Primer Ciclo Generalista
30 preguntas objetivas: 8 Lenguaje + 8 Matemática + 7 Historia + 7 Ciencias
Basada en Bases Curriculares 1° a 3° básico
"""

# Datos de preguntas por dominio
preguntas = {
    # ==================== LENGUAJE (8 preguntas) ====================
    "lenguaje": [
        {
            "num": 1,
            "tema": "Comprensión lectora - Literal",
            "enunciado": "En 2° básico, después de leer un cuento, ¿qué pregunta evalúa comprensión LITERAL?",
            "alternativas": [
                {"op": "A", "texto": "¿Por qué crees que el personaje actuó así?"},
                {"op": "B", "texto": "¿Qué habría pasado si el personaje tomaba otra decisión?"},
                {"op": "C", "texto": "¿Dónde ocurrió la historia y quiénes eran los personajes principales?"},
                {"op": "D", "texto": "¿Qué opinas sobre las acciones del personaje?"}
            ],
            "correcta": "C",
            "justificacion": "Las preguntas literales piden información explícita del texto (quién, qué, dónde, cuándo). A, B y D evalúan inferencia u opinión."
        },
        {
            "num": 2,
            "tema": "Escritura - Proceso",
            "enunciado": "Un estudiante de 3° básico debe escribir un cuento. Según el modelo de producción de textos, ¿en qué orden debe trabajar?",
            "alternativas": [
                {"op": "A", "texto": "Escribir → Revisar → Planificar → Publicar"},
                {"op": "B", "texto": "Planificar (idea, personajes, secuencia) → Escribir borrador → Revisar contenido → Editar (ortografía/gramática) → Publicar"},
                {"op": "C", "texto": "Revisar → Escribir → Planificar"},
                {"op": "D", "texto": "Escribir directamente la versión final"}
            ],
            "correcta": "B",
            "justificacion": "El proceso de escritura sigue estas etapas: planificar, escribir, revisar, editar y publicar. Escribir sin planificar reduce la calidad del texto."
        },
        {
            "num": 3,
            "tema": "Vocabulario contextual",
            "enunciado": "Un estudiante de 1° básico lee: <em>'El perro <strong>ladra</strong> fuerte'</em> y pregunta qué significa 'ladra'. ¿Qué estrategia es MÁS apropiada?",
            "alternativas": [
                {"op": "A", "texto": "Buscar 'ladra' en el diccionario."},
                {"op": "B", "texto": "Hacer el sonido del ladrido (¡guau guau!), explicar que es el sonido que hacen los perros, y usar la palabra en otras oraciones (<em>'Mi perro ladra cuando llega alguien'</em>)."},
                {"op": "C", "texto": "Ignorar la palabra y seguir leyendo."},
                {"op": "D", "texto": "Decirle que lo pregunte en casa."}
            ],
            "correcta": "B",
            "justificacion": "En 1° básico, el vocabulario se enseña con apoyo multimodal (sonido, gesto) y contextualización, no con diccionario ni ignorando dudas."
        },
        {
            "num": 4,
            "tema": "Textos informativos",
            "enunciado": "Para enseñar la estructura de un texto informativo en 2° básico, la mejor secuencia es:",
            "alternativas": [
                {"op": "A", "texto": "Leer varios textos informativos → Identificar partes (título, introducción, desarrollo con subtítulos, conclusión) → Crear organizador gráfico → Escribir texto propio siguiendo la estructura."},
                {"op": "B", "texto": "Dictar la estructura y pedir que la memoricen."},
                {"op": "C", "texto": "Copiar un texto informativo del libro."},
                {"op": "D", "texto": "Ver un video sobre textos informativos."}
            ],
            "correcta": "A",
            "justificacion": "Aprender estructuras textuales requiere exposición a modelos, análisis guiado, organización visual y producción propia, no solo explicación teórica."
        },
        {
            "num": 5,
            "tema": "Fluidez lectora",
            "enunciado": "Un estudiante de 3° básico lee correctamente pero sin respetar puntuación ni entonación. ¿Qué estrategia mejora su fluidez prosódica?",
            "alternativas": [
                {"op": "A", "texto": "Aumentar su velocidad lectora (palabras por minuto)."},
                {"op": "B", "texto": "Modelar lectura expresiva, practicar lecturas repetidas del mismo texto con retroalimentación sobre pausas y entonación, grabar su lectura para auto-evaluación."},
                {"op": "C", "texto": "Darle textos más fáciles."},
                {"op": "D", "texto": "Solo practicar lectura silenciosa."}
            ],
            "correcta": "B",
            "justificacion": "La fluidez prosódica (entonación, pausas) se desarrolla con modelamiento, práctica repetida y retroalimentación específica, no solo velocidad."
        },
        {
            "num": 6,
            "tema": "Articulación oral",
            "enunciado": "Para desarrollar comunicación oral efectiva en 1° básico, lo MÁS importante es enseñar a:",
            "alternativas": [
                {"op": "A", "texto": "Hablar en voz alta siempre."},
                {"op": "B", "texto": "Organizar ideas (inicio-desarrollo-cierre), usar volumen y velocidad apropiados, mirar a la audiencia, y usar apoyo visual cuando corresponda."},
                {"op": "C", "texto": "Memorizar discursos largos."},
                {"op": "D", "texto": "Hablar sin pausas para demostrar fluidez."}
            ],
            "correcta": "B",
            "justificacion": "La comunicación oral efectiva incluye organización del mensaje, aspectos paraverbales (volumen, velocidad) y no verbales (mirada), no solo hablar fuerte."
        },
        {
            "num": 7,
            "tema": "Comprensión inferencial",
            "enunciado": "En un cuento, un personaje toma un paraguas antes de salir y el cielo está gris. Un estudiante de 2° básico debe inferir que:",
            "alternativas": [
                {"op": "A", "texto": "El personaje tiene un paraguas."},
                {"op": "B", "texto": "Probablemente va a llover."},
                {"op": "C", "texto": "El cielo está gris."},
                {"op": "D", "texto": "El personaje va a salir."}
            ],
            "correcta": "B",
            "justificacion": "Inferir es deducir información no explícita. A, C y D son información literal. La inferencia conecta las pistas (paraguas + cielo gris = expectativa de lluvia)."
        },
        {
            "num": 8,
            "tema": "Escritura inicial",
            "enunciado": "En 1° básico, un estudiante escribe: <em>'AOKT'</em> para decir <em>'auto'</em>. Esto indica que está en etapa de escritura:",
            "alternativas": [
                {"op": "A", "texto": "Alfabética (representa todos los fonemas correctamente)."},
                {"op": "B", "texto": "Silábica-alfabética (mezcla representación de sílabas y fonemas)."},
                {"op": "C", "texto": "Silábica (una letra por sílaba)."},
                {"op": "D", "texto": "Pre-silábica (escritura sin relación con sonidos)."}
            ],
            "correcta": "B",
            "justificacion": "Escribe 'A' (au-), 'O' (to), 'K' (fonema /t/), 'T' (fonema /o/): mezcla representación silábica (A=au, O=to) y alfabética (K, T). Es transición silábica-alfabética."
        }
    ],
    
    # ==================== MATEMÁTICA (8 preguntas) ====================
    "matematica": [
        {
            "num": 9,
            "tema": "Resolución de problemas",
            "enunciado": "Un estudiante de 2° básico lee: <em>'Tenía 12 stickers. Regalé algunos. Ahora tengo 7. ¿Cuántos regalé?'</em> y no sabe qué hacer. La mejor intervención es:",
            "alternativas": [
                {"op": "A", "texto": "Decirle que debe restar: 12 - 7."},
                {"op": "B", "texto": "Pedirle que represente la situación con material concreto o dibujo (12 stickers, tapar los que regaló, quedan 7 visibles), luego identificar la operación."},
                {"op": "C", "texto": "Darle problemas más fáciles primero."},
                {"op": "D", "texto": "Explicarle que 'regalé algunos' significa restar."}
            ],
            "correcta": "B",
            "justificacion": "La comprensión de problemas se facilita con representación concreta/pictórica antes de abstraer la operación. Dar la operación directamente no desarrolla comprensión."
        },
        {
            "num": 10,
            "tema": "Valor posicional",
            "enunciado": "Para enseñar que en el número <strong>25</strong> el '2' vale 20 (dos decenas) en 1° básico, la actividad MÁS efectiva es:",
            "alternativas": [
                {"op": "A", "texto": "Explicar: 'El 2 está en las decenas, por eso vale 20'."},
                {"op": "B", "texto": "Representar 25 con bloques base 10 (2 barras de 10 + 5 cubitos), agrupar y desagrupar, escribir 25 = 20 + 5, comparar con 52 usando bloques."},
                {"op": "C", "texto": "Hacer que escriban el número 25 muchas veces."},
                {"op": "D", "texto": "Mostrar una tabla de valor posicional en la pizarra."}
            ],
            "correcta": "B",
            "justificacion": "El valor posicional es conceptual, no memorístico. Requiere manipulación de material base 10 y comparación de números (25 vs 52) para comprender que la posición determina el valor."
        },
        {
            "num": 11,
            "tema": "Estrategias de cálculo",
            "enunciado": "Para sumar <strong>8 + 7</strong> mentalmente, ¿qué estrategia es MÁS eficiente para enseñar en 2° básico?",
            "alternativas": [
                {"op": "A", "texto": "Contar con los dedos desde 8: 9, 10, 11, 12, 13, 14, 15."},
                {"op": "B", "texto": "Usar memoria de tablas."},
                {"op": "C", "texto": "Descomponer para completar 10: 8 + 2 = 10, quedan 5 más, 10 + 5 = 15."},
                {"op": "D", "texto": "Sumar unidades y escribir el resultado."}
            ],
            "correcta": "C",
            "justificacion": "Completar 10 es una estrategia eficiente de cálculo mental más avanzada que contar. Desarrolla comprensión del sistema decimal y agilidad mental."
        },
        {
            "num": 12,
            "tema": "Geometría básica",
            "enunciado": "En 1° básico, para distinguir un <strong>cuadrado</strong> de un <strong>rectángulo</strong>, los estudiantes deben:",
            "alternativas": [
                {"op": "A", "texto": "Memorizar: 'El cuadrado tiene 4 lados iguales, el rectángulo tiene lados diferentes'."},
                {"op": "B", "texto": "Manipular figuras concretas, medir lados con unidades no estandarizadas (clips, dedos), comparar medidas, clasificar figuras según este criterio."},
                {"op": "C", "texto": "Dibujar ambas figuras en sus cuadernos."},
                {"op": "D", "texto": "Ver imágenes de cuadrados y rectángulos."}
            ],
            "correcta": "B",
            "justificacion": "Las propiedades geométricas se comprenden mediante exploración y medición concreta, no solo explicación verbal o visual."
        },
        {
            "num": 13,
            "tema": "Patrones numéricos",
            "enunciado": "Un estudiante de 2° básico continúa el patrón: <em>2, 4, 6, 8, __, __, __</em>. Para profundizar el razonamiento algebraico, se debe:",
            "alternativas": [
                {"op": "A", "texto": "Solo pedirle que complete los números que faltan."},
                {"op": "B", "texto": "Pedirle que complete, luego explique la regla (<em>'aumento de 2 en 2'</em> o <em>'números pares'</em>), prediga el décimo término sin contar, y cree un patrón propio con regla similar."},
                {"op": "C", "texto": "Decirle que es la tabla del 2."},
                {"op": "D", "texto": "Hacer que memorice secuencias numéricas."}
            ],
            "correcta": "B",
            "justificacion": "El pensamiento algebraico se desarrolla identificando, explicando y generalizando reglas, no solo completando patrones mecánicamente."
        },
        {
            "num": 14,
            "tema": "Fracciones iniciales",
            "enunciado": "Al introducir fracciones en 2° básico, el primer concepto que debe comprenderse es:",
            "alternativas": [
                {"op": "A", "texto": "Leer y escribir fracciones (1/2, 1/4, 1/3)."},
                {"op": "B", "texto": "Sumar fracciones con igual denominador."},
                {"op": "C", "texto": "Partir un entero en partes iguales y comprender que cada parte es una fracción del total (experiencias de reparto equitativo)."},
                {"op": "D", "texto": "Identificar numerador y denominador."}
            ],
            "correcta": "C",
            "justificacion": "El concepto fundamental de fracción es partición en partes iguales y relación parte-todo, construido desde experiencias concretas de reparto."
        },
        {
            "num": 15,
            "tema": "Medición no estandarizada",
            "enunciado": "En 1° básico, antes de enseñar centímetros, los estudiantes deben medir con unidades no estandarizadas (clips, lápices, pasos) para:",
            "alternativas": [
                {"op": "A", "texto": "Mantenerlos entretenidos antes del contenido real."},
                {"op": "B", "texto": "Comprender que medir es comparar con una unidad, experimentar que diferentes unidades dan diferentes resultados, y desarrollar necesidad de unidades estándar."},
                {"op": "C", "texto": "Practicar conteo."},
                {"op": "D", "texto": "Evitar usar reglas que son complicadas."}
            ],
            "correcta": "B",
            "justificacion": "Medir con unidades no estandarizadas construye comprensión conceptual de la medición y genera necesidad cognitiva de unidades estándar (propósito pedagógico, no entretenimiento)."
        },
        {
            "num": 16,
            "tema": "Datos y gráficos",
            "enunciado": "Después de que estudiantes de 3° básico construyen un gráfico de barras sobre mascotas preferidas, la pregunta que desarrolla MEJOR el pensamiento estadístico es:",
            "alternativas": [
                {"op": "A", "texto": "¿Cuántos estudiantes prefieren perros?"},
                {"op": "B", "texto": "¿Cuál es la mascota más preferida y cuál es la menos preferida?"},
                {"op": "C", "texto": "¿Por qué crees que los perros son más preferidos que los gatos? ¿Los datos cambiarían si preguntamos en otro curso?"},
                {"op": "D", "texto": "¿De qué color son las barras del gráfico?"}
            ],
            "correcta": "C",
            "justificacion": "El pensamiento estadístico involucra interpretar datos en contexto, hacer inferencias causales y considerar variabilidad, no solo leer datos literalmente."
        }
    ],
    
    # ==================== HISTORIA Y CIENCIAS SOCIALES (7 preguntas) ====================
    "historia": [
        {
            "num": 17,
            "tema": "Pueblos originarios",
            "enunciado": "Para enseñar sobre pueblos originarios de Chile en 2° básico de manera respetuosa y precisa, se debe:",
            "alternativas": [
                {"op": "A", "texto": "Mostrar solo su forma de vida antigua (pasado)."},
                {"op": "B", "texto": "Presentar su cultura (ubicación, recursos, adaptación, cosmovisión), reconocer que existen en el presente con culturas vivas, usar recursos de fuentes primarias (testimonios, artesanía, música) y evitar estereotipos."},
                {"op": "C", "texto": "Hacer que los niños se disfracen de indígenas."},
                {"op": "D", "texto": "Enseñar solo sus ubicaciones en el mapa."}
            ],
            "correcta": "B",
            "justificacion": "La enseñanza de pueblos originarios debe ser respetuosa (no estereotipos/disfraces), reconocer su existencia presente, usar fuentes primarias y presentar su cultura integralmente."
        },
        {
            "num": 18,
            "tema": "Ubicación espacial",
            "enunciado": "Un estudiante de 1° básico confunde izquierda/derecha. Para desarrollar orientación espacial, la mejor secuencia es:",
            "alternativas": [
                {"op": "A", "texto": "Decirle que memorice: 'La mano con la que escribo es la derecha'."},
                {"op": "B", "texto": "Hacer ejercicios corporales (levanta mano derecha, da un paso a la izquierda), usar referencias fijas (marca en mano), ubicar objetos en el espacio, luego trasladar a planos y mapas simples."},
                {"op": "C", "texto": "Mostrarle un mapa de Chile."},
                {"op": "D", "texto": "Hacer que escriba las palabras 'izquierda' y 'derecha'."}
            ],
            "correcta": "B",
            "justificacion": "La orientación espacial se desarrolla desde el cuerpo (experiencia kinestésica), luego espacio cercano, y finalmente representaciones abstractas (planos/mapas)."
        },
        {
            "num": 19,
            "tema": "Tiempo histórico",
            "enunciado": "Para que estudiantes de 3° básico comprendan <strong>secuencia cronológica</strong>, la actividad MÁS efectiva es:",
            "alternativas": [
                {"op": "A", "texto": "Memorizar fechas históricas importantes."},
                {"op": "B", "texto": "Crear líneas de tiempo de su propia vida (nacimiento, primer día de colegio, eventos importantes) con fechas, calcular tiempo transcurrido, ordenar eventos familiares/escolares/históricos."},
                {"op": "C", "texto": "Leer textos sobre historia de Chile."},
                {"op": "D", "texto": "Ver videos de épocas históricas."}
            ],
            "correcta": "B",
            "justificacion": "El tiempo histórico se comprende desde experiencias personales significativas (línea de tiempo propia) antes de abstraer a eventos históricos lejanos."
        },
        {
            "num": 20,
            "tema": "Normas y convivencia",
            "enunciado": "Para que estudiantes de 1° básico comprendan la importancia de las normas de convivencia, se debe:",
            "alternativas": [
                {"op": "A", "texto": "Dictar las normas y poner un cartel en la sala."},
                {"op": "B", "texto": "Construir las normas participativamente (¿qué necesitamos para convivir bien?), representar situaciones con/sin normas, explicar consecuencias naturales, evaluar periódicamente su cumplimiento."},
                {"op": "C", "texto": "Castigar a quien no cumpla las normas."},
                {"op": "D", "texto": "Leer las normas del reglamento escolar."}
            ],
            "correcta": "B",
            "justificacion": "Las normas se interiorizan cuando se construyen participativamente, se comprenden sus fundamentos (no imposición) y se vivencian sus efectos."
        },
        {
            "num": 21,
            "tema": "Recursos naturales",
            "enunciado": "Al enseñar recursos naturales en 2° básico, es importante que los estudiantes comprendan:",
            "alternativas": [
                {"op": "A", "texto": "Solo la lista de recursos que tiene Chile."},
                {"op": "B", "texto": "La relación entre recursos disponibles, actividades económicas, forma de vida de las personas, y la importancia del cuidado/sustentabilidad."},
                {"op": "C", "texto": "Los nombres técnicos de los recursos."},
                {"op": "D", "texto": "Que los recursos son infinitos."}
            ],
            "correcta": "B",
            "justificacion": "El concepto de recursos naturales se enseña integralmente: identificación, uso humano, relación con forma de vida y sustentabilidad, no solo nomenclatura."
        },
        {
            "num": 22,
            "tema": "Instituciones y símbolos",
            "enunciado": "Para enseñar el significado de los <strong>símbolos patrios</strong> en 1° básico, la estrategia MÁS apropiada es:",
            "alternativas": [
                {"op": "A", "texto": "Memorizar los colores de la bandera."},
                {"op": "B", "texto": "Explicar que los símbolos representan nuestra identidad como país, relacionarlos con experiencias significativas (celebraciones patrias), conocer su historia de forma simple, y expresar respeto sin imposición."},
                {"op": "C", "texto": "Cantar el himno nacional todos los días."},
                {"op": "D", "texto": "Colorear la bandera en una hoja."}
            ],
            "correcta": "B",
            "justificacion": "Los símbolos patrios se enseñan explicando su significado de identidad colectiva, conectándolos con experiencias (no solo actividades mecánicas), en un marco de respeto no impositivo."
        },
        {
            "num": 23,
            "tema": "Fuentes históricas",
            "enunciado": "En 3° básico, al trabajar con una <strong>fotografía antigua</strong> como fuente histórica, los estudiantes deben aprender a:",
            "alternativas": [
                {"op": "A", "texto": "Solo describir lo que ven en la imagen."},
                {"op": "B", "texto": "Observar detalles (vestimenta, objetos, lugares), inferir información sobre la época (¿cómo vivían?, ¿qué tecnología usaban?), formular preguntas, y comparar con el presente."},
                {"op": "C", "texto": "Copiar la fotografía dibujándola."},
                {"op": "D", "texto": "Memorizar la fecha en que fue tomada."}
            ],
            "correcta": "B",
            "justificacion": "Trabajar fuentes históricas implica observación detallada, inferencia, formulación de preguntas y comparación temporal, no solo descripción o memorización."
        }
    ],
    
    # ==================== CIENCIAS NATURALES (7 preguntas) ====================
    "ciencias": [
        {
            "num": 24,
            "tema": "Método científico adaptado",
            "enunciado": "En 2° básico, al realizar un experimento sobre germinación de semillas, la secuencia del proceso de investigación es:",
            "alternativas": [
                {"op": "A", "texto": "Observar → Experimentar → Anotar lo que pasó."},
                {"op": "B", "texto": "Pregunta investigable → Predicción (hipótesis simple) → Procedimiento → Observación y registro → Conclusión (¿se cumplió la predicción?)."},
                {"op": "C", "texto": "Seguir instrucciones del docente y copiar resultados."},
                {"op": "D", "texto": "Ver un video sobre germinación."}
            ],
            "correcta": "B",
            "justificacion": "El método científico adaptado a primer ciclo incluye: pregunta, predicción, procedimiento, observación/registro y conclusión, no solo seguir instrucciones."
        },
        {
            "num": 25,
            "tema": "Clasificación de seres vivos",
            "enunciado": "Para enseñar clasificación de animales en 1° básico (vertebrados/invertebrados, o mamíferos/aves/peces etc.), la actividad MÁS apropiada es:",
            "alternativas": [
                {"op": "A", "texto": "Dar definiciones y pedir que las memoricen."},
                {"op": "B", "texto": "Observar animales reales o imágenes detalladas, identificar características observables (¿tiene huesos?, ¿tiene plumas/pelo/escamas?, ¿cómo nacen sus crías?), agrupar según criterios, crear tablas clasificatorias."},
                {"op": "C", "texto": "Leer un texto sobre clasificación de animales."},
                {"op": "D", "texto": "Ver un documental de National Geographic."}
            ],
            "correcta": "B",
            "justificacion": "La clasificación científica se aprende observando, identificando criterios y agrupando, no memorizando definiciones sin experiencia de observación."
        },
        {
            "num": 26,
            "tema": "Ciclos de vida",
            "enunciado": "Al enseñar el ciclo de vida de las plantas en 2° básico, lo MÁS importante es que los estudiantes:",
            "alternativas": [
                {"op": "A", "texto": "Memoricen las etapas: semilla, germinación, crecimiento, planta adulta, reproducción."},
                {"op": "B", "texto": "Observen el proceso completo plantando semillas, registrando cambios diarios (dibujos, mediciones), identificando necesidades (agua, luz, tierra), y comprendiendo que es un ciclo continuo."},
                {"op": "C", "texto": "Dibujen las etapas de un diagrama del libro."},
                {"op": "D", "texto": "Vean fotos de diferentes etapas."}
            ],
            "correcta": "B",
            "justificacion": "Los ciclos de vida se comprenden mediante observación prolongada del proceso real, registro y análisis, no solo memorización de etapas."
        },
        {
            "num": 27,
            "tema": "Estados de la materia",
            "enunciado": "Para demostrar que el agua puede cambiar de estado (líquido-sólido-gas) en 3° básico, la actividad experimental MÁS efectiva es:",
            "alternativas": [
                {"op": "A", "texto": "Explicar en la pizarra los tres estados."},
                {"op": "B", "texto": "Congelar agua (sólido), observar hielo derritiéndose (líquido), calentar agua y observar vapor (gas), registrar cambios de temperatura y forma, concluir sobre cambios reversibles."},
                {"op": "C", "texto": "Mostrar imágenes de hielo, agua y vapor."},
                {"op": "D", "texto": "Leer un texto sobre estados de la materia."}
            ],
            "correcta": "B",
            "justificacion": "Los cambios de estado se comprenden experimentando las transformaciones, observando condiciones (temperatura) y registrando, no solo con explicaciones o imágenes."
        },
        {
            "num": 28,
            "tema": "Luz y sombras",
            "enunciado": "En 1° básico, para que los estudiantes comprendan cómo se forman las sombras, deben:",
            "alternativas": [
                {"op": "A", "texto": "Leer una definición de sombra."},
                {"op": "B", "texto": "Experimentar con linternas y objetos: proyectar sombras, cambiar distancia de la luz, mover objetos, observar que la sombra se forma cuando la luz es bloqueada, jugar con sombras corporales."},
                {"op": "C", "texto": "Dibujar su sombra en una hoja."},
                {"op": "D", "texto": "Ver un video sobre sombras."}
            ],
            "correcta": "B",
            "justificacion": "Los conceptos de luz y sombra se construyen mediante exploración activa con fuentes de luz y objetos, no solo explicación verbal."
        },
        {
            "num": 29,
            "tema": "Hábitat y adaptación",
            "enunciado": "Para que estudiantes de 2° básico comprendan que los animales están <strong>adaptados a su hábitat</strong>, la estrategia MÁS efectiva es:",
            "alternativas": [
                {"op": "A", "texto": "Decirles: 'Los animales viven donde pueden sobrevivir'."},
                {"op": "B", "texto": "Comparar animales de diferentes hábitats (desierto/polo/bosque): ¿qué características tienen? (pelaje, forma, tamaño), ¿cómo les ayudan a vivir ahí? (camello: joroba almacena agua), relacionar estructura-función-ambiente."},
                {"op": "C", "texto": "Memorizar lista de animales y sus hábitats."},
                {"op": "D", "texto": "Ver fotos de animales en su hábitat."}
            ],
            "correcta": "B",
            "justificacion": "La adaptación se comprende comparando características de animales con condiciones de su hábitat y estableciendo relaciones estructura-función-ambiente."
        },
        {
            "num": 30,
            "tema": "Sistema solar",
            "enunciado": "Al enseñar el Sistema Solar en 3° básico, es fundamental que los estudiantes comprendan:",
            "alternativas": [
                {"op": "A", "texto": "Los nombres de los 8 planetas en orden."},
                {"op": "B", "texto": "Que el Sol es el centro y los planetas orbitan alrededor, hay diferencias de tamaño y distancia (usar modelos a escala), el movimiento de la Tierra explica día/noche y estaciones."},
                {"op": "C", "texto": "Las características de cada planeta de memoria."},
                {"op": "D", "texto": "Que hay estrellas en el universo."}
            ],
            "correcta": "B",
            "justificacion": "El concepto del Sistema Solar implica comprender estructura (Sol centro, órbitas), escala (tamaños, distancias) y relación con fenómenos terrestres (día/noche), no solo nomenclatura."
        }
    ]
}

# Generar el archivo .njk
print("=" * 80)
print("🚀 GENERANDO PRUEBA ESTANDARIZADA: BÁSICA GENERALISTA")
print("=" * 80)
print(f"📊 Distribución: {len(preguntas['lenguaje'])} Lenguaje + {len(preguntas['matematica'])} Matemática")
print(f"               + {len(preguntas['historia'])} Historia + {len(preguntas['ciencias'])} Ciencias")
print(f"📝 Total: 30 preguntas objetivas")
print("=" * 80)

# Combinar todas las preguntas
todas_preguntas = (preguntas['lenguaje'] + preguntas['matematica'] + 
                   preguntas['historia'] + preguntas['ciencias'])

# Guardar como JSON para referencia
import json
with open('prueba-basica-generalista-datos.json', 'w', encoding='utf-8') as f:
    json.dump({
        "metadata": {
            "titulo": "Prueba Estandarizada: Educación Básica Primer Ciclo Generalista",
            "total_preguntas": 30,
            "distribucion": {
                "lenguaje": 8,
                "matematica": 8,
                "historia": 7,
                "ciencias": 7
            }
        },
        "preguntas": todas_preguntas
    }, f, ensure_ascii=False, indent=2)

print("✅ Datos guardados en: prueba-basica-generalista-datos.json")
print("🔄 Generando archivo .njk con interfaz completa...")
