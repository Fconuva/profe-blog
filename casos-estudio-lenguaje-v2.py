# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def agregar_casos_lenguaje():
    """Agrega sección casos_estudio con formato pedagógico correcto"""
    
    # 10 casos con contexto docente + pregunta específica
    # Distribución balanceada: 3A, 3B, 2C, 2D
    casos = [
        {
            "id": "caso-l-01",
            "contexto": "Un docente en un 8° Básico aborda la producción de textos con propósito informativo, considerando la correcta aplicación de la ortografía puntual. Para esto, solicita a los estudiantes escribir un texto. Durante el monitoreo de la actividad de escritura, revisa el siguiente fragmento de uno de los estudiantes: \"El origen del universo de acuerdo con lo que declaran los expertos es aún un enigma\".",
            "enunciado": "¿Qué debería ejercitar el estudiante para superar la dificultad que se advierte en su texto respecto del uso de comas?",
            "alternativas": [
                {"opcion": "A", "texto": "El reconocimiento de vocativos"},
                {"opcion": "B", "texto": "El reconocimiento de incisos explicativos"},
                {"opcion": "C", "texto": "El reconocimiento de conjunciones conjuntivas"},
                {"opcion": "D", "texto": "El reconocimiento de oraciones coordinadas adversativas"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El fragmento \"de acuerdo con lo que declaran los expertos\" es un inciso explicativo que debe ir entre comas: \"El origen del universo, de acuerdo con lo que declaran los expertos, es aún un enigma\"."
        },
        {
            "id": "caso-l-02",
            "contexto": "Una profesora de 7° Básico trabaja tipos de narrador. Presenta un fragmento: \"María caminaba por la plaza. Pensaba en su examen de mañana y sentía nervios. Su hermano, mientras tanto, jugaba tranquilo en los columpios sin preocupaciones\". Un estudiante identifica el narrador como \"testigo\".",
            "enunciado": "¿Qué debe comprender el estudiante para corregir su identificación?",
            "alternativas": [
                {"opcion": "A", "texto": "Que el narrador testigo solo observa acciones externas"},
                {"opcion": "B", "texto": "Que el narrador protagonista cuenta su propia historia"},
                {"opcion": "C", "texto": "Que el narrador objetivo no emite juicios de valor"},
                {"opcion": "D", "texto": "Que el narrador equisciente conoce un solo personaje"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "El fragmento muestra conocimiento de pensamientos internos (\"Pensaba\", \"sentía nervios\"), lo que corresponde a un narrador omnisciente. El narrador testigo solo describe lo que observa externamente."
        },
        {
            "id": "caso-l-03",
            "contexto": "Durante una clase de argumentación, un docente presenta una columna de opinión que comienza: \"Las redes sociales han transformado nuestra comunicación, pero ¿a qué costo?\". Un estudiante afirma que es una pregunta retórica sin función argumentativa.",
            "enunciado": "¿Qué debe ejercitar el estudiante sobre recursos argumentativos?",
            "alternativas": [
                {"opcion": "A", "texto": "El reconocimiento de falacias argumentativas"},
                {"opcion": "B", "texto": "La identificación de argumentos de autoridad"},
                {"opcion": "C", "texto": "La función de preguntas retóricas para introducir tesis"},
                {"opcion": "D", "texto": "La distinción entre hecho y opinión"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "Las preguntas retóricas son recursos argumentativos que anticipan la tesis del texto. En este caso, introduce una reflexión crítica sobre redes sociales que será desarrollada argumentativamente."
        },
        {
            "id": "caso-l-04",
            "contexto": "Una profesora trabaja figuras literarias. Lee el verso \"Sus ojos eran dos luceros brillantes en la noche\" y pregunta qué figura se utiliza. Un estudiante responde \"personificación\" porque \"le da cualidades humanas a los ojos\".",
            "enunciado": "¿Qué concepto debe reforzar el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "Que la metáfora compara implícitamente dos elementos"},
                {"opcion": "B", "texto": "Que la hipérbole exagera características"},
                {"opcion": "C", "texto": "Que el símil compara usando \"como\""},
                {"opcion": "D", "texto": "Que la personificación atribuye cualidades humanas a inanimados"}
            ],
            "respuesta_correcta": "D",
            "explicacion": "El verso usa metáfora (comparación implícita: ojos = luceros). La personificación da características humanas a objetos o animales, pero los ojos ya son parte humana. El estudiante confundió las figuras literarias."
        },
        {
            "id": "caso-l-05",
            "contexto": "Un docente presenta un cómic que usa globos de diálogo, onomatopeyas (¡CRASH!, ¡BUM!) y metáforas visuales (corazones para amor, rayos para enojo). Pregunta qué tipo de texto es. Un estudiante responde \"texto icónico puro\".",
            "enunciado": "¿Qué característica de los textos debe comprender el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "La distinción entre textos continuos y discontinuos"},
                {"opcion": "B", "texto": "La definición de textos multimodales"},
                {"opcion": "C", "texto": "La estructura de textos dramáticos"},
                {"opcion": "D", "texto": "La función apelativa del lenguaje"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El cómic combina texto escrito (diálogos, onomatopeyas) e imágenes (dibujos, metáforas visuales), lo que lo define como texto multimodal, no icónico puro (solo imágenes)."
        },
        {
            "id": "caso-l-06",
            "contexto": "Durante la lectura de una noticia sobre cambio climático, el texto afirma: \"Según el informe de la ONU, las temperaturas aumentarán 2°C en 2050\". Un estudiante señala esto como \"hecho verificable\".",
            "enunciado": "¿Qué debe distinguir el estudiante sobre hechos y proyecciones?",
            "alternativas": [
                {"opcion": "A", "texto": "Que las proyecciones futuras son predicciones, no hechos actuales"},
                {"opcion": "B", "texto": "Que los informes de la ONU siempre son opiniones"},
                {"opcion": "C", "texto": "Que el cambio climático es un tema controvertido"},
                {"opcion": "D", "texto": "Que los números siempre representan hechos objetivos"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Aunque cite una fuente confiable (ONU), la afirmación habla del futuro (\"aumentarán\", \"en 2050\"), por lo tanto es una proyección o predicción basada en datos, no un hecho actual verificable."
        },
        {
            "id": "caso-l-07",
            "contexto": "Un profesor presenta el poema \"Cultivo una rosa blanca\" de José Martí. Un estudiante afirma que la rosa blanca es \"literalmente una flor que el autor cultiva en su jardín\".",
            "enunciado": "¿Qué habilidad de lectura literaria debe desarrollar?",
            "alternativas": [
                {"opcion": "A", "texto": "La interpretación de símbolos poéticos"},
                {"opcion": "B", "texto": "La identificación de figuras fónicas"},
                {"opcion": "C", "texto": "El análisis métrico de versos"},
                {"opcion": "D", "texto": "La comparación entre diferentes versiones"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "La rosa blanca es un símbolo de amistad sincera y perdón. El estudiante hace una lectura literal sin comprender el sentido simbólico característico de la poesía."
        },
        {
            "id": "caso-l-08",
            "contexto": "Durante el análisis de un texto dramático, una docente muestra un diálogo donde un personaje dice: \"(Aparte) No puedo creer que me mienta así\". Un estudiante pregunta por qué dice \"Aparte\" en lugar de ponerlo en el diálogo normal.",
            "enunciado": "¿Qué elemento del texto dramático debe explicar la docente?",
            "alternativas": [
                {"opcion": "A", "texto": "Que los apartes son comentarios que solo escucha el público"},
                {"opcion": "B", "texto": "Que las acotaciones indican escenografía"},
                {"opcion": "C", "texto": "Que los monólogos expresan pensamientos en soledad"},
                {"opcion": "D", "texto": "Que los diálogos requieren dos personajes"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "El aparte es una convención teatral donde el personaje habla directamente al público sin que los demás personajes en escena lo escuchen, rompiendo la cuarta pared."
        },
        {
            "id": "caso-l-09",
            "contexto": "Un docente trabaja coherencia textual. Revisa un texto de estudiante: \"Me gusta el fútbol. El perro de mi vecino ladra. Mañana hay prueba. El fútbol se juega con 11 jugadores\". Identifica falta de cohesión temática.",
            "enunciado": "¿Qué principio de coherencia debe ejercitar el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "El uso de conectores causales"},
                {"opcion": "B", "texto": "La concordancia entre sujeto y verbo"},
                {"opcion": "C", "texto": "La unidad temática y progresión de ideas"},
                {"opcion": "D", "texto": "El uso correcto de pronombres anafóricos"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "El texto carece de unidad temática: salta entre tópicos sin conexión (fútbol → perro → prueba → fútbol). Debe mantener un tema central y desarrollarlo progresivamente."
        },
        {
            "id": "caso-l-10",
            "contexto": "Una profesora presenta dos textos sobre el mismo tema: uno usa lenguaje técnico y citas de expertos; otro usa lenguaje coloquial y experiencias personales. Pregunta cuál es más formal. Un estudiante elige el segundo porque \"es más fácil de entender\".",
            "enunciado": "¿Qué criterio de registro de habla debe comprender el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "Que el lenguaje coloquial es apropiado para contextos informales"},
                {"opcion": "B", "texto": "Que el lenguaje técnico siempre es incorrecto"},
                {"opcion": "C", "texto": "Que las experiencias personales son más formales"},
                {"opcion": "D", "texto": "Que la facilidad de comprensión no determina el registro formal"}
            ],
            "respuesta_correcta": "D",
            "explicacion": "El registro formal se caracteriza por lenguaje técnico, citas de autoridad y estructura académica, independientemente de su dificultad. La claridad no define la formalidad del registro."
        }
    ]
    
    ruta = 'evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json'
    
    with open(ruta, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Agregar sección casos_estudio
    data['exam']['casos_estudio'] = casos
    
    # Guardar
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("✓ CASOS DE ESTUDIO AGREGADOS A LENGUAJE")
    print(f"\nEstructura:")
    print(f"  - preguntas: {len(data['exam']['preguntas'])} items")
    print(f"  - casos_estudio: {len(casos)} casos")
    print(f"\nDistribucion respuestas casos:")
    dist = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
    for caso in casos:
        dist[caso['respuesta_correcta']] += 1
    for letra, cant in dist.items():
        print(f"  {letra}: {cant} casos")

if __name__ == '__main__':
    agregar_casos_lenguaje()
