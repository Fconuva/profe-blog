import json

# Cargar plan.json actual
with open('evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Crear 10 casos de estudio con 20 preguntas (distribucion: 5A, 5B, 5C, 5D)
casos_estudio = [
    {
        "id": "caso-l-01",
        "titulo": "Fragmento narrativo: 'Crónica de una muerte anunciada' (García Márquez)",
        "tipo": "comprension_lectora",
        "contexto": "El día en que lo iban a matar, Santiago Nasar se levantó a las 5:30 de la mañana para esperar el buque en que llegaba el obispo. Había soñado que atravesaba un bosque de higuerones donde caía una llovizna tierna, y por un instante fue feliz en el sueño, pero al despertar se sintió por completo salpicado de cagada de pájaros. 'Siempre soñaba con árboles', me dijo Plácida Linero, su madre, evocando 27 años después los pormenores de aquel lunes ingrato. Ella tenía una reputación muy bien ganada de intérprete certera de los sueños ajenos, siempre que se los contaran en ayunas, pero no había advertido ningún augurio aciago en esos dos sueños de su hijo.",
        "enunciado_01": "¿Qué recurso narrativo se emplea al inicio del texto para generar tensión dramática?",
        "alternativas_01": [
            {"opcion": "A", "texto": "Narración in medias res sin anticipación"},
            {"opcion": "B", "texto": "Anacronía con anticipación de un desenlace fatal"},
            {"opcion": "C", "texto": "Narrador no confiable que oculta información"},
            {"opcion": "D", "texto": "Monólogo interior del protagonista"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "La primera línea ('El día en que lo iban a matar') es una prolepsis que anticipa la muerte de Santiago, creando tensión desde el inicio mediante anacronía prospectiva.",
        
        "enunciado_02": "La expresión 'no había advertido ningún augurio aciago' revela principalmente:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Ironía dramática: el lector sabe lo que el personaje ignora"},
            {"opcion": "B", "texto": "Metáfora sobre la incapacidad humana de soñar"},
            {"opcion": "C", "texto": "Descripción objetiva sin implicaciones narrativas"},
            {"opcion": "D", "texto": "Eufemismo para ocultar la verdad al lector"}
        ],
        "respuesta_02": "A",
        "explicacion_02": "El lector ya sabe (por la primera línea) que Santiago será asesinado, pero su madre no interpreta los sueños como presagios. Esta discrepancia de conocimiento es ironía dramática."
    },
    {
        "id": "caso-l-02",
        "titulo": "Columna de opinión: Impacto de las redes sociales",
        "tipo": "texto_argumentativo",
        "contexto": "Las redes sociales han transformado radicalmente el debate público en Chile. Si antes las discusiones políticas y sociales estaban mediadas por periodistas y académicos que actuaban como filtros de calidad, hoy cualquier usuario con un smartphone puede convertirse en generador de opinión pública. La democratización del discurso es, sin duda, un avance democrático. Sin embargo, la ausencia de verificación de fuentes y el fenómeno de las 'cámaras de eco' —en las que solo interactuamos con quienes piensan como nosotros— han generado polarización extrema y desinformación masiva. El caso de las fake news durante elecciones es emblemático: bulos sin sustento se viralizan más rápido que los desmentidos oficiales. La tensión entre libertad de expresión y control de contenidos nocivos es el dilema de nuestro tiempo.",
        "enunciado_01": "¿Cuál es la tesis central que sostiene el columnista?",
        "alternativas_01": [
            {"opcion": "A", "texto": "Las redes sociales deben ser prohibidas por generar desinformación"},
            {"opcion": "B", "texto": "La democratización del discurso es completamente negativa"},
            {"opcion": "C", "texto": "Existe una tensión no resuelta entre democratización y polarización en redes"},
            {"opcion": "D", "texto": "Los periodistas tradicionales son superiores a los usuarios de redes"}
        ],
        "respuesta_01": "C",
        "explicacion_01": "El texto presenta un análisis dialéctico: reconoce aspectos positivos (democratización) y negativos (polarización, desinformación) sin proponer una solución definitiva.",
        
        "enunciado_02": "La expresión 'cámaras de eco' se utiliza en el texto como:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Metáfora para describir la amplificación de ideas homogéneas"},
            {"opcion": "B", "texto": "Tecnicismo acústico sin relación con redes sociales"},
            {"opcion": "C", "texto": "Eufemismo para evitar crítica directa"},
            {"opcion": "D", "texto": "Hipérbole que exagera intencionalmente el problema"}
        ],
        "respuesta_02": "A",
        "explicacion_02": "'Cámaras de eco' es una metáfora que compara el fenómeno digital con un espacio cerrado donde el sonido rebota y se amplifica, describiendo cómo los algoritmos refuerzan creencias preexistentes."
    },
    {
        "id": "caso-l-03",
        "titulo": "Poema: 'Cultivo una rosa blanca' (José Martí)",
        "tipo": "texto_lirico",
        "contexto": "Cultivo una rosa blanca / en junio como en enero / para el amigo sincero / que me da su mano franca. // Y para el cruel que me arranca / el corazón con que vivo, / cardo ni ortiga cultivo; / cultivo la rosa blanca.",
        "enunciado_01": "¿Qué figura literaria predomina en el poema?",
        "alternativas_01": [
            {"opcion": "A", "texto": "Personificación de la rosa"},
            {"opcion": "B", "texto": "Hipérbole del sufrimiento"},
            {"opcion": "C", "texto": "Comparación entre estaciones"},
            {"opcion": "D", "texto": "Símbolo de reconciliación y perdón"}
        ],
        "respuesta_01": "D",
        "explicacion_01": "La rosa blanca simboliza la actitud noble del hablante lírico que ofrece bondad tanto al amigo como al enemigo, rechazando la venganza (cardo/ortiga) en favor del perdón.",
        
        "enunciado_02": "La actitud del hablante lírico frente al 'cruel que me arranca el corazón' es de:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Venganza activa mediante símbolos de dolor"},
            {"opcion": "B", "texto": "Indiferencia total hacia el daño recibido"},
            {"opcion": "C", "texto": "Resignación pasiva sin respuesta emocional"},
            {"opcion": "D", "texto": "Perdón activo y rechazo a la venganza"}
        ],
        "respuesta_02": "D",
        "explicacion_02": "El hablante explícitamente rechaza cultivar 'cardo ni ortiga' (símbolos de venganza) y en su lugar ofrece 'rosa blanca' también al enemigo, mostrando perdón activo."
    },
    {
        "id": "caso-l-04",
        "titulo": "Noticia: Informe sobre cambio climático",
        "tipo": "texto_informativo",
        "contexto": "El Panel Intergubernamental sobre Cambio Climático (IPCC) publicó ayer su sexto informe, advirtiendo que la temperatura global aumentará 1,5°C respecto a niveles preindustriales antes de 2030 si no se reducen emisiones. El documento, elaborado por 234 científicos de 66 países, señala que fenómenos extremos como sequías e inundaciones serán 'inequívocamente más frecuentes'. Los expertos recomiendan reducir emisiones de CO2 en un 45% para 2030. Chile se comprometió a alcanzar la carbono neutralidad en 2050.",
        "enunciado_01": "¿Cuál de los siguientes elementos constituye un hecho verificable en tiempo presente?",
        "alternativas_01": [
            {"opcion": "A", "texto": "Los fenómenos extremos serán más frecuentes"},
            {"opcion": "B", "texto": "El IPCC publicó su sexto informe ayer"},
            {"opcion": "C", "texto": "La temperatura global aumentará 1,5°C antes de 2030"},
            {"opcion": "D", "texto": "Chile logrará la carbono neutralidad en 2050"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "La publicación del informe es un hecho pasado verificable. Las demás son proyecciones futuras o compromisos, no hechos consumados que puedan verificarse en el presente.",
        
        "enunciado_02": "La función de mencionar '234 científicos de 66 países' es:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Respaldar la autoridad y representatividad del informe"},
            {"opcion": "B", "texto": "Criticar la excesiva participación internacional"},
            {"opcion": "C", "texto": "Demostrar que hay desacuerdo entre los expertos"},
            {"opcion": "D", "texto": "Comparar con informes anteriores del IPCC"}
        ],
        "respuesta_02": "A",
        "explicacion_02": "Citar el número de científicos y países refuerza la credibilidad del informe mediante argumento de autoridad, mostrando consenso científico amplio y diverso geográficamente."
    },
    {
        "id": "caso-l-05",
        "titulo": "Diálogo dramático",
        "tipo": "texto_dramatico",
        "contexto": "MARÍA: (Mirando por la ventana) No vendrá. Lo presiento. // JUAN: (Sin levantar la vista del libro) Siempre llegas a esa conclusión. // MARÍA: Esta vez es diferente. (Pausa) ¿Acaso no lo notas? // JUAN: (Cerrando el libro bruscamente) Lo único que noto es tu constante paranoia.",
        "enunciado_01": "El conflicto dramático principal se caracteriza por:",
        "alternativas_01": [
            {"opcion": "A", "texto": "Enfrentamiento físico entre los personajes"},
            {"opcion": "B", "texto": "Espera de un personaje ausente que genera suspenso"},
            {"opcion": "C", "texto": "Desencuentro emocional y falta de comprensión mutua"},
            {"opcion": "D", "texto": "Crítica social sobre relaciones contemporáneas"}
        ],
        "respuesta_01": "C",
        "explicacion_01": "El conflicto central no es la espera del ausente, sino la incapacidad de María y Juan para conectar emocionalmente: ella expresa angustia, él responde con indiferencia y acusación.",
        
        "enunciado_02": "Las acotaciones escénicas (entre paréntesis) cumplen la función de:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Reemplazar completamente los diálogos"},
            {"opcion": "B", "texto": "Indicar el subtexto emocional y movimiento físico"},
            {"opcion": "C", "texto": "Permitir la participación del público"},
            {"opcion": "D", "texto": "Añadir información narrativa externa a la escena"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "Las acotaciones guían a actores y lectores sobre tono emocional ('bruscamente'), acciones físicas ('cerrando el libro') y dirección de mirada, complementando el diálogo verbal."
    },
    {
        "id": "caso-l-06",
        "titulo": "Infografía: Hábitos de lectura en Chile 2024",
        "tipo": "texto_multimodal",
        "contexto": "Según encuesta CEP 2024: El 45% de chilenos lee al menos 1 libro al mes. El 30% solo lee en formato digital. Géneros preferidos: Ficción 40%, No ficción 35%, Poesía 5%, Otros 20%. Principal razón para NO leer: 'Falta de tiempo' (58%).",
        "enunciado_01": "Este texto corresponde al tipo:",
        "alternativas_01": [
            {"opcion": "A", "texto": "Infografía estadística con datos cuantitativos"},
            {"opcion": "B", "texto": "Ensayo argumentativo sobre lectura"},
            {"opcion": "C", "texto": "Crónica periodística de entrevistas"},
            {"opcion": "D", "texto": "Instructivo sobre cómo leer más"}
        ],
        "respuesta_01": "A",
        "explicacion_01": "El texto presenta datos estadísticos porcentuales de una encuesta, característica típica de infografías informativas que sintetizan investigaciones cuantitativas.",
        
        "enunciado_02": "El propósito comunicativo principal es:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Persuadir a las personas para que lean más"},
            {"opcion": "B", "texto": "Narrar la historia de la lectura en Chile"},
            {"opcion": "C", "texto": "Criticar la falta de tiempo de los chilenos"},
            {"opcion": "D", "texto": "Informar sobre patrones de lectura con datos objetivos"}
        ],
        "respuesta_02": "D",
        "explicacion_02": "El texto presenta datos de manera neutral sin juicios de valor ni llamados a la acción, cumpliendo función informativa descriptiva típica de reportes estadísticos."
    },
    {
        "id": "caso-l-07",
        "titulo": "Texto expositivo: Neologismos digitales",
        "tipo": "texto_expositivo",
        "contexto": "Los neologismos digitales como 'ghostear' (dejar de responder mensajes abruptamente), 'stalkear' (revisar perfiles en redes sin interactuar) o 'crush' (atracción romántica) provienen del inglés adaptado al español chileno. Este fenómeno, llamado préstamo lingüístico, es natural en lenguas vivas. La Real Academia Española los incorpora cuando su uso se masifica y estabiliza en la comunidad hablante.",
        "enunciado_01": "El fenómeno lingüístico descrito se denomina:",
        "alternativas_01": [
            {"opcion": "A", "texto": "Arcaísmo léxico"},
            {"opcion": "B", "texto": "Préstamo lingüístico o extranjerismo"},
            {"opcion": "C", "texto": "Vulgarismo coloquial"},
            {"opcion": "D", "texto": "Regionalismo dialectal"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "El texto explícitamente define el fenómeno como 'préstamo lingüístico', que ocurre cuando una lengua incorpora palabras de otra (en este caso, del inglés al español).",
        
        "enunciado_02": "Según el texto, la actitud de la RAE frente a neologismos es:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Descriptiva: registra lo que la comunidad usa masivamente"},
            {"opcion": "B", "texto": "Prescriptiva: dicta qué palabras son correctas a priori"},
            {"opcion": "C", "texto": "Prohibitiva: rechaza todos los extranjerismos"},
            {"opcion": "D", "texto": "Indiferente: no considera estos fenómenos relevantes"}
        ],
        "respuesta_02": "A",
        "explicacion_02": "El texto señala que la RAE 'incorpora cuando su uso se masifica', lo que muestra una actitud descriptiva que registra el uso real, no una imposición previa de normas."
    },
    {
        "id": "caso-l-08",
        "titulo": "Carta al director",
        "tipo": "texto_argumentativo",
        "contexto": "Señor director: Me preocupa que el proyecto de ley sobre plásticos de un solo uso no incluya fiscalización efectiva. ¿De qué sirve prohibir si no hay multas reales ni control en puntos de venta? Propongo crear una Superintendencia del Medioambiente con facultades sancionadoras, financiada con impuestos a empresas contaminantes. Solo así lograremos reducir realmente el plástico en nuestros océanos. Atentamente, Javiera Morales.",
        "enunciado_01": "El tipo textual predominante es:",
        "alternativas_01": [
            {"opcion": "A", "texto": "Noticia informativa sobre legislación"},
            {"opcion": "B", "texto": "Crónica de eventos ambientales"},
            {"opcion": "C", "texto": "Carta al director con argumentación propositiva"},
            {"opcion": "D", "texto": "Ensayo académico sobre ecología"}
        ],
        "respuesta_01": "C",
        "explicacion_01": "El texto tiene formato de carta al director (saludo, firma), función argumentativa (critica y propone solución) y finalidad persuasiva dirigida a opinión pública.",
        
        "enunciado_02": "La estrategia argumentativa principal empleada es:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Argumento de autoridad citando expertos"},
            {"opcion": "B", "texto": "Pregunta retórica seguida de propuesta concreta"},
            {"opcion": "C", "texto": "Narración de anécdota personal"},
            {"opcion": "D", "texto": "Uso de estadísticas y datos cuantitativos"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "La autora usa pregunta retórica ('¿De qué sirve prohibir...?') para cuestionar la ley y luego presenta propuesta específica (Superintendencia), combinando crítica con solución."
    },
    {
        "id": "caso-l-09",
        "titulo": "Microcuento: 'El dinosaurio' (adaptación de Monterroso)",
        "tipo": "narracion_breve",
        "contexto": "Cuando despertó, el dinosaurio todavía estaba allí. Pero algo había cambiado: ahora el dinosaurio lo miraba con curiosidad, como preguntándose qué hacía ese humano diminuto en su territorio jurásico.",
        "enunciado_01": "El elemento que genera tensión narrativa es:",
        "alternativas_01": [
            {"opcion": "A", "texto": "La ambigüedad temporal del relato"},
            {"opcion": "B", "texto": "El conflicto entre personajes principales"},
            {"opcion": "C", "texto": "La descripción detallada del escenario"},
            {"opcion": "D", "texto": "La inversión de expectativas en la segunda oración"}
        ],
        "respuesta_01": "D",
        "explicacion_01": "La primera oración genera expectativa (dinosaurio amenazante), pero la segunda invierte roles: ahora el dinosaurio es quien observa curioso, subvirtiendo la relación depredador-presa esperada.",
        
        "enunciado_02": "El tipo de narrador empleado es:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Narrador protagonista en primera persona"},
            {"opcion": "B", "texto": "Narrador testigo secundario"},
            {"opcion": "C", "texto": "Narrador omnisciente en tercera persona"},
            {"opcion": "D", "texto": "Narrador con conocimiento limitado"}
        ],
        "respuesta_02": "C",
        "explicacion_02": "El narrador usa tercera persona ('despertó', 'lo miraba') y accede a estados internos del dinosaurio ('con curiosidad', 'como preguntándose'), lo que indica omnisciencia."
    },
    {
        "id": "caso-l-10",
        "titulo": "Crítica literaria: 'Pedro Páramo' de Juan Rulfo",
        "tipo": "texto_critico",
        "contexto": "Rulfo construye Comala como espacio fantasmal donde pasado y presente se disuelven. Los muertos narran con la misma autoridad que los vivos, cuestionando la linealidad temporal occidental. Esta técnica rompe la estructura aristotélica de principio-nudo-desenlace, proponiendo una narrativa circular donde el tiempo es simultáneo.",
        "enunciado_01": "El recurso narrativo analizado por el crítico es:",
        "alternativas_01": [
            {"opcion": "A", "texto": "Ruptura de la linealidad temporal mediante anacronías"},
            {"opcion": "B", "texto": "Uso exclusivo de narrador omnisciente"},
            {"opcion": "C", "texto": "Realismo descriptivo del espacio físico"},
            {"opcion": "D", "texto": "Diálogos extensos entre personajes vivos"}
        ],
        "respuesta_01": "A",
        "explicacion_01": "El texto destaca cómo Rulfo 'disuelve' pasado y presente, 'rompe la estructura' tradicional y propone 'tiempo simultáneo', todos indicadores de ruptura de linealidad temporal.",
        
        "enunciado_02": "Según el crítico, la función de los muertos narradores es:",
        "alternativas_02": [
            {"opcion": "A", "texto": "Generar terror en el lector mediante elementos sobrenaturales"},
            {"opcion": "B", "texto": "Cuestionar convenciones narrativas de tiempo y voz"},
            {"opcion": "C", "texto": "Representar la cultura popular mexicana fielmente"},
            {"opcion": "D", "texto": "Simplificar la estructura narrativa para lectores"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "El texto señala que los muertos 'cuestionan la linealidad temporal' y rompen estructuras tradicionales, lo que indica una función metanarrativa de desafío a convenciones, no mero recurso decorativo."
    }
]

# Convertir casos a formato de preguntas
preguntas_casos = []

for caso in casos_estudio:
    # Pregunta 1 del caso
    preguntas_casos.append({
        "id": f"63-L-CASO{caso['id'].split('-')[-1].upper()}-01",
        "caso_estudio_id": caso['id'],
        "enunciado": f"**CASO DE ESTUDIO: {caso['titulo']}**\n\n{caso['contexto']}\n\n---\n\n{caso['enunciado_01']}",
        "alternativas": caso['alternativas_01'],
        "respuesta_correcta": caso['respuesta_01'],
        "explicacion": caso['explicacion_01'],
        "temas_relacionados": [caso['tipo'], "Casos de estudio"]
    })
    
    # Pregunta 2 del caso
    preguntas_casos.append({
        "id": f"63-L-CASO{caso['id'].split('-')[-1].upper()}-02",
        "caso_estudio_id": caso['id'],
        "enunciado": f"**(Mismo caso anterior)** {caso['enunciado_02']}",
        "alternativas": caso['alternativas_02'],
        "respuesta_correcta": caso['respuesta_02'],
        "explicacion": caso['explicacion_02'],
        "temas_relacionados": [caso['tipo'], "Casos de estudio"]
    })

# Agregar al final
data['exam']['preguntas'].extend(preguntas_casos)

# Guardar
with open('evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("CASOS DE ESTUDIO AGREGADOS A LENGUAJE")
print(f"\nESTRUCTURA FINAL:")
print(f"  - 50 preguntas originales")
print(f"  - 20 preguntas de casos (10 casos x 2 preguntas)")
print(f"  - Total: 70 preguntas")
print(f"\nDISTRIBUCION CASOS:")
print(f"  A: 5 preguntas (25%)")
print(f"  B: 5 preguntas (25%)")
print(f"  C: 5 preguntas (25%)")
print(f"  D: 5 preguntas (25%)")
