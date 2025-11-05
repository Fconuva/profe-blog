# -*- coding: utf-8 -*-
"""
Generar Prueba Estandarizada para Básica Generalista ECEP 2025
60 preguntas distribuidas: 15 Lenguaje | 15 Matemática | 15 Historia | 15 Ciencias
Basada en Bases Curriculares 1° a 3° básico
"""

import json
import random

# Datos de la prueba
prueba = {
    "metadata": {
        "titulo": "Prueba Estandarizada: Educación Básica Primer Ciclo Generalista",
        "descripcion": "Evaluación objetiva con 60 ítems de selección múltiple basada en Bases Curriculares 1° a 3° básico",
        "tiempo_estimado": "90 minutos",
        "total_preguntas": 60,
        "distribucion": {
            "lenguaje": 15,
            "matematica": 15,
            "historia": 15,
            "ciencias": 15
        }
    },
    "preguntas": []
}

# ==================== LENGUAJE Y COMUNICACIÓN (15 preguntas) ====================
preguntas_lenguaje = [
    {
        "num": 1,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Comprensión de lectura",
        "enunciado": "En 1° básico, un estudiante lee la siguiente oración: <em>'El gato está debajo de la mesa'</em>. ¿Qué estrategia pedagógica es MÁS efectiva para verificar su comprensión?",
        "alternativas": [
            {"opcion": "A", "texto": "Preguntarle '¿Dónde está el gato?' y esperar que responda verbalmente."},
            {"opcion": "B", "texto": "Pedirle que dibuje la escena descrita en la oración, mostrando la posición del gato."},
            {"opcion": "C", "texto": "Solicitarle que copie la oración en su cuaderno."},
            {"opcion": "D", "texto": "Pedirle que identifique la palabra 'gato' en la oración."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La representación gráfica (dibujo) demuestra comprensión profunda de conceptos espaciales y permite evaluar la comprensión sin depender exclusivamente del lenguaje oral. Es una estrategia alineada con el nivel de desarrollo de 1° básico."
    },
    {
        "num": 2,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Textos narrativos",
        "enunciado": "Según las Bases Curriculares, ¿cuál es el propósito principal de trabajar fábulas en 2° básico?",
        "alternativas": [
            {"opcion": "A", "texto": "Desarrollar fluidez lectora mediante textos breves."},
            {"opcion": "B", "texto": "Identificar la estructura narrativa (inicio, desarrollo, desenlace) y extraer la moraleja."},
            {"opcion": "C", "texto": "Memorizar características de animales."},
            {"opcion": "D", "texto": "Practicar lectura oral frente al curso."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "Las fábulas se utilizan para enseñar estructura narrativa y valores (moraleja), según los OA de comprensión lectora de 2° básico."
    },
    {
        "num": 3,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Producción escrita",
        "enunciado": "Un estudiante de 3° básico escribe: <em>'Lla boi para la casa'</em>. ¿Qué retroalimentación es MÁS apropiada según el enfoque de escritura emergente?",
        "alternativas": [
            {"opcion": "A", "texto": "Marcar todos los errores en rojo y pedirle que reescriba correctamente."},
            {"opcion": "B", "texto": "Ignorar los errores para no desmotivar al estudiante."},
            {"opcion": "C", "texto": "Felicitar el mensaje comunicado y trabajar un error específico: <em>'Ya voy'</em> se escribe separado. Modelar la escritura correcta."},
            {"opcion": "D", "texto": "Decirle que estudie las reglas ortográficas del uso de <em>'ll'</em> y <em>'y'</em>."}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "La retroalimentación efectiva en escritura emergente valora el mensaje comunicado y trabaja un error específico con modelamiento, evitando sobrecargar al estudiante."
    },
    {
        "num": 4,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Vocabulario",
        "enunciado": "Para enseñar el vocabulario de un texto sobre animales marinos en 1° básico, ¿qué estrategia es MÁS efectiva?",
        "alternativas": [
            {"opcion": "A", "texto": "Entregar una lista de palabras nuevas para memorizar."},
            {"opcion": "B", "texto": "Antes de leer, presentar palabras clave con imágenes, gestos y frases contextualizadas. Durante la lectura, señalar las palabras. Después, usarlas en oraciones propias."},
            {"opcion": "C", "texto": "Pedirles que busquen las palabras en el diccionario."},
            {"opcion": "D", "texto": "Leer el texto completo y luego explicar las palabras desconocidas."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La estrategia antes-durante-después con multimodalidad (imágenes, gestos) es más efectiva para adquisición de vocabulario en niveles iniciales."
    },
    {
        "num": 5,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Conciencia fonológica",
        "enunciado": "En 1° básico, ¿cuál actividad desarrolla MEJOR la conciencia fonológica avanzada (conciencia fonémica)?",
        "alternativas": [
            {"opcion": "A", "texto": "Separar palabras en sílabas palmoteando: <em>'ma-ri-po-sa'</em>."},
            {"opcion": "B", "texto": "Identificar palabras que riman: <em>'casa-masa-pasa'</em>."},
            {"opcion": "C", "texto": "Segmentar palabras en fonemas: <em>'/m/ /a/ /r/' = mar</em> y cambiar un fonema para formar nueva palabra <em>'/p/ /a/ /r/' = par</em>."},
            {"opcion": "D", "texto": "Contar cuántas palabras tiene una oración."}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "La segmentación y manipulación de fonemas individuales es la habilidad más avanzada de conciencia fonológica, predictora clave del éxito lector."
    },
    {
        "num": 6,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Comprensión oral",
        "enunciado": "Después de contar un cuento en 2° básico, ¿qué pregunta evalúa MEJOR la comprensión inferencial?",
        "alternativas": [
            {"opcion": "A", "texto": "¿Cómo se llamaba el personaje principal?"},
            {"opcion": "B", "texto": "¿Qué hizo el personaje al final del cuento?"},
            {"opcion": "C", "texto": "¿Por qué crees que el personaje actuó de esa manera?"},
            {"opcion": "D", "texto": "¿Cuántos personajes había en el cuento?"}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "Las preguntas 'por qué' requieren inferencias sobre motivaciones, causas o consecuencias que no están explícitas en el texto."
    },
    {
        "num": 7,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Textos no literarios",
        "enunciado": "Para enseñar la función de un <strong>afiche</strong> en 3° básico, la estrategia MÁS apropiada es:",
        "alternativas": [
            {"opcion": "A", "texto": "Definir: 'Un afiche es un texto que informa y convence'. Pedir que copien la definición."},
            {"opcion": "B", "texto": "Mostrar afiches reales (campañas escolares, eventos), identificar su propósito comunicativo (informar/persuadir), elementos (título, imagen, mensaje breve), y crear un afiche sobre un tema del curso."},
            {"opcion": "C", "texto": "Leer un texto sobre afiches en el libro de clases."},
            {"opcion": "D", "texto": "Mostrar un ejemplo y pedir que lo dibujen."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "El aprendizaje significativo de tipos de texto requiere exposición a ejemplos reales, análisis de propósito y elementos, seguido de producción propia."
    },
    {
        "num": 8,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Articulación con escritura",
        "enunciado": "Según el modelo de producción escrita en Bases Curriculares, ¿cuál es la secuencia correcta de las etapas del proceso de escritura?",
        "alternativas": [
            {"opcion": "A", "texto": "Escribir → Planificar → Revisar → Editar"},
            {"opcion": "B", "texto": "Planificar → Escribir → Revisar → Editar → Publicar"},
            {"opcion": "C", "texto": "Revisar → Escribir → Planificar → Editar"},
            {"opcion": "D", "texto": "Escribir → Editar → Revisar"}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "El proceso de escritura se estructura en 5 etapas: planificación, escritura de borrador, revisión, edición y publicación."
    },
    {
        "num": 9,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Lectura independiente",
        "enunciado": "Para fomentar la lectura independiente en 1° básico, la estrategia MÁS efectiva es:",
        "alternativas": [
            {"opcion": "A", "texto": "Asignar un libro obligatorio mensual con prueba de comprensión."},
            {"opcion": "B", "texto": "Crear una biblioteca de aula con libros de diversos niveles y géneros, establecer tiempo diario de lectura silenciosa sostenida (10-15 min), y permitir libre elección con registro voluntario."},
            {"opcion": "C", "texto": "Enviar libros para leer en casa y hacer resumen escrito."},
            {"opcion": "D", "texto": "Leer siempre en voz alta frente al curso."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La motivación lectora se desarrolla con acceso a variedad de libros, tiempo dedicado, libre elección y un ambiente sin presión evaluativa excesiva."
    },
    {
        "num": 10,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Estrategias de comprensión",
        "enunciado": "Un estudiante de 2° básico lee: <em>'Juan fue a la <strong>panadería</strong> a comprar pan'</em> y pregunta qué es 'panadería'. ¿Qué estrategia de vocabulario contextual debe enseñarse?",
        "alternativas": [
            {"opcion": "A", "texto": "Buscar la palabra en el diccionario."},
            {"opcion": "B", "texto": "Ignorar palabras desconocidas y seguir leyendo."},
            {"opcion": "C", "texto": "Usar las pistas del contexto: '¿Qué compra Juan? Pan. ¿Dónde se compra pan? En una tienda de pan, que se llama panadería. Fíjate: <strong>pan-adería</strong>, tiene la palabra <em>pan</em> adentro'."},
            {"opcion": "D", "texto": "Reemplazar 'panadería' por 'tienda' al leer."}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "Enseñar a usar claves contextuales y análisis morfológico (pan + -adería = lugar donde se vende) desarrolla autonomía lectora."
    },
    {
        "num": 11,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Escritura de oraciones",
        "enunciado": "En 1° básico, un estudiante escribe: <em>'misgatosmuñeco'</em> (sin separación de palabras). ¿Qué intervención pedagógica es MÁS apropiada?",
        "alternativas": [
            {"opcion": "A", "texto": "Marcar los espacios faltantes y pedir que reescriba."},
            {"opcion": "B", "texto": "Leer en voz alta lo que escribió sin pausas, luego leerlo con pausas naturales y mostrar cómo cada pausa es un espacio: <em>'mi / gato / es / muñeco'</em>. Practicar con palmadas y escritura guiada."},
            {"opcion": "C", "texto": "Decirle que cada palabra se escribe separada y debe memorizar eso."},
            {"opcion": "D", "texto": "No intervenir hasta que domine la lectura fluida."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La segmentación de palabras se enseña haciendo consciente el habla (pausas orales) y transfiriéndolo a la escritura con apoyo multisensorial."
    },
    {
        "num": 12,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Narración oral",
        "enunciado": "Para desarrollar la narración oral en 3° básico, la actividad MÁS completa es:",
        "alternativas": [
            {"opcion": "A", "texto": "Pedir que cuenten qué hicieron el fin de semana frente al curso."},
            {"opcion": "B", "texto": "Proporcionar apoyo visual (secuencia de imágenes), modelar una narración completa (inicio-desarrollo-cierre), practicar en parejas, luego presentar al curso con rúbrica conocida (volumen, secuencia, detalles)."},
            {"opcion": "C", "texto": "Leer un cuento y pedirles que lo recuenten de memoria."},
            {"opcion": "D", "texto": "Grabar videos de sus narraciones para evaluarlos después."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La narración oral efectiva requiere andamiaje (imágenes, modelamiento), práctica en contexto seguro (parejas), y criterios claros de evaluación."
    },
    {
        "num": 13,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Comprensión de instrucciones",
        "enunciado": "Un estudiante de 2° básico sigue incorrectamente instrucciones escritas simples (ej: <em>'Dibuja un círculo rojo arriba y un cuadrado azul abajo'</em>). ¿Qué apoyo es MÁS efectivo?",
        "alternativas": [
            {"opcion": "A", "texto": "Leer las instrucciones en voz alta varias veces."},
            {"opcion": "B", "texto": "Simplificar las instrucciones eliminando elementos."},
            {"opcion": "C", "texto": "Enseñar estrategia paso a paso: 1) Leer completo, 2) Subrayar palabras clave (qué/dónde/cómo), 3) Numerar pasos, 4) Hacer cada paso verificando. Practicar con instrucciones graduadas."},
            {"opcion": "D", "texto": "Darle solo instrucciones orales."}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "La comprensión de instrucciones se enseña explícitamente con estrategias metacognitivas y práctica graduada."
    },
    {
        "num": 14,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Textos poéticos",
        "enunciado": "Al trabajar poesía en 1° básico, ¿cuál es el propósito pedagógico PRINCIPAL según las Bases Curriculares?",
        "alternativas": [
            {"opcion": "A", "texto": "Memorizar poemas completos para recitar."},
            {"opcion": "B", "texto": "Desarrollar sensibilidad estética, disfrutar del lenguaje lúdico, identificar rimas y ritmo, y expresar emociones."},
            {"opcion": "C", "texto": "Analizar figuras literarias como metáfora y personificación."},
            {"opcion": "D", "texto": "Aprender reglas de versificación y métrica."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "En primer ciclo, la poesía se trabaja para desarrollar sensibilidad estética, disfrute del lenguaje y conciencia fonológica (rimas, ritmo), no análisis técnico complejo."
    },
    {
        "num": 15,
        "dominio": "Lenguaje y Comunicación",
        "tema": "Evaluación de lectura",
        "enunciado": "Para evaluar la comprensión lectora de un estudiante de 3° básico de manera integral, se debe:",
        "alternativas": [
            {"opcion": "A", "texto": "Hacer solo preguntas de alternativas sobre el texto."},
            {"opcion": "B", "texto": "Medir únicamente su velocidad lectora (palabras por minuto)."},
            {"opcion": "C", "texto": "Evaluar múltiples dimensiones: decodificación (precisión, fluidez), comprensión literal, inferencial y crítica, vocabulario, y estrategias utilizadas (antes, durante, después de leer)."},
            {"opcion": "D", "texto": "Pedirle que resuma el texto por escrito."}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "La evaluación integral de lectura considera decodificación, comprensión en sus tres niveles, vocabulario y uso de estrategias, no solo una dimensión."
    }
]

# ==================== MATEMÁTICA (15 preguntas) ====================
preguntas_matematica = [
    {
        "num": 16,
        "dominio": "Matemática",
        "tema": "Numeración",
        "enunciado": "En 1° básico, un estudiante cuenta objetos: <em>'1, 2, 3, 5, 6, 8, 10'</em> (omite el 4, 7 y 9). Esto indica dificultad en:",
        "alternativas": [
            {"opcion": "A", "texto": "Cardinalidad (comprender que el último número indica la cantidad total)."},
            {"opcion": "B", "texto": "Secuencia numérica (conocer el orden convencional de los números)."},
            {"opcion": "C", "texto": "Correspondencia uno a uno (asignar un número a cada objeto)."},
            {"opcion": "D", "texto": "Comparación de cantidades (más que/menos que)."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "Omitir números en la secuencia indica que no ha memorizado el orden convencional de los números (secuencia numérica)."
    },
    {
        "num": 17,
        "dominio": "Matemática",
        "tema": "Valor posicional",
        "enunciado": "Para enseñar el concepto de <strong>decena</strong> en 1° básico según la progresión Concreto-Pictórico-Abstracto (CPA), la secuencia correcta es:",
        "alternativas": [
            {"opcion": "A", "texto": "Abstracto → Pictórico → Concreto (enseñar el símbolo '10', luego dibujar, luego manipular objetos)."},
            {"opcion": "B", "texto": "Pictórico → Concreto → Abstracto (dibujar, luego manipular objetos, luego el símbolo)."},
            {"opcion": "C", "texto": "Concreto → Pictórico → Abstracto (agrupar 10 objetos físicos, luego representar grupos en dibujos, luego trabajar con números escritos)."},
            {"opcion": "D", "texto": "Trabajar solo en nivel abstracto (números escritos)."}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "La metodología CPA indica comenzar con materiales concretos, luego representaciones pictóricas, y finalmente símbolos abstractos."
    },
    {
        "num": 18,
        "dominio": "Matemática",
        "tema": "Adición",
        "enunciado": "Un estudiante de 2° básico resuelve <em>8 + 7</em> así: <em>'8... 9, 10, 11, 12, 13, 14, 15'</em> (cuenta con los dedos desde 8). ¿Qué estrategia está usando?",
        "alternativas": [
            {"opcion": "A", "texto": "Conteo total (count all): contar todos los elementos desde 1."},
            {"opcion": "B", "texto": "Conteo desde el primer sumando (count on): partir del primer número y agregar."},
            {"opcion": "C", "texto": "Descomposición aditiva: <em>8 + 2 + 5 = 10 + 5 = 15</em>."},
            {"opcion": "D", "texto": "Hechos numéricos memorizados (fluidez)."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "Contar desde el primer sumando (count on) es una estrategia intermedia que indica progreso desde el conteo total hacia el cálculo mental."
    },
    {
        "num": 19,
        "dominio": "Matemática",
        "tema": "Resolución de problemas",
        "enunciado": "Para enseñar resolución de problemas en 1° básico, ¿cuál es la secuencia pedagógica MÁS efectiva?",
        "alternativas": [
            {"opcion": "A", "texto": "Leer el problema → Identificar la operación → Calcular → Responder."},
            {"opcion": "B", "texto": "Comprender (leer, parafrasear, representar concretamente/dibujo) → Planificar (¿qué debo hacer?) → Ejecutar (resolver) → Revisar (¿tiene sentido?)."},
            {"opcion": "C", "texto": "Enseñar palabras clave: 'en total' = sumar, 'quedan' = restar."},
            {"opcion": "D", "texto": "Dar la operación directamente y que practiquen cálculo."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "El modelo de resolución de problemas de Polya adaptado a primer ciclo incluye: comprender, planificar, ejecutar y revisar, enfatizando la representación concreta/pictórica."
    },
    {
        "num": 20,
        "dominio": "Matemática",
        "tema": "Geometría",
        "enunciado": "En 2° básico, para enseñar la diferencia entre figuras 2D y 3D, la actividad MÁS apropiada es:",
        "alternativas": [
            {"opcion": "A", "texto": "Definir: 'Las figuras 2D son planas y las 3D tienen volumen'. Pedir que memoricen."},
            {"opcion": "B", "texto": "Manipular objetos 3D reales (cajas, pelotas, conos), identificar sus caras (que son figuras 2D), compararlos con figuras 2D de papel, y crear tabla clasificatoria tocando y observando."},
            {"opcion": "C", "texto": "Mostrar imágenes de figuras 2D y 3D en la pizarra."},
            {"opcion": "D", "texto": "Dibujar figuras 2D y 3D en sus cuadernos."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La comprensión de 2D vs 3D requiere manipulación concreta y experiencia sensorial, no solo explicaciones verbales o imágenes."
    },
    {
        "num": 21,
        "dominio": "Matemática",
        "tema": "Medición",
        "enunciado": "Un estudiante de 1° básico dice que su lápiz mide <em>'5'</em>. ¿Qué concepto de medición necesita reforzarse?",
        "alternativas": [
            {"opcion": "A", "texto": "Uso de unidades estandarizadas (cm, m)."},
            {"opcion": "B", "texto": "Comprensión de que una medida requiere un <strong>número + unidad</strong> (ej: 5 clips, 5 dedos, 5 cm)."},
            {"opcion": "C", "texto": "Uso de instrumentos de medición (regla)."},
            {"opcion": "D", "texto": "Estimación de longitudes."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "Antes de unidades estandarizadas, los estudiantes deben comprender que medir es comparar con una unidad (no estandarizada inicialmente) y expresar número + unidad."
    },
    {
        "num": 22,
        "dominio": "Matemática",
        "tema": "Patrones",
        "enunciado": "En 1° básico, ¿cuál secuencia de actividades desarrolla MEJOR el razonamiento algebraico temprano con patrones?",
        "alternativas": [
            {"opcion": "A", "texto": "Copiar patrones dados por el docente."},
            {"opcion": "B", "texto": "Identificar patrones → Continuar patrones → Corregir patrones con error → Crear patrones propios → Describir la regla del patrón verbalmente."},
            {"opcion": "C", "texto": "Memorizar secuencias numéricas (2, 4, 6, 8...)."},
            {"opcion": "D", "texto": "Colorear dibujos siguiendo un patrón dado."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "El razonamiento algebraico se desarrolla progresivamente desde identificar patrones hasta crear y explicar reglas, no solo copiar."
    },
    {
        "num": 23,
        "dominio": "Matemática",
        "tema": "Fracciones",
        "enunciado": "Para introducir fracciones en 2° básico, la actividad inicial MÁS apropiada es:",
        "alternativas": [
            {"opcion": "A", "texto": "Enseñar a leer y escribir fracciones: <em>'1/2 se lee un medio'</em>."},
            {"opcion": "B", "texto": "Partir objetos concretos (pizzas de cartón, chocolates, tiras de papel) en partes iguales y repartir equitativamente en situaciones contextualizadas (<em>'Compartir 1 pizza entre 4 amigos'</em>)."},
            {"opcion": "C", "texto": "Hacer ejercicios de suma de fracciones."},
            {"opcion": "D", "texto": "Explicar que el numerador indica partes tomadas y denominador partes totales."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "El concepto de fracción se construye desde experiencias de partición y reparto equitativo con material concreto antes de símbolos."
    },
    {
        "num": 24,
        "dominio": "Matemática",
        "tema": "Datos y probabilidades",
        "enunciado": "En 3° básico, los estudiantes recolectaron datos sobre frutas favoritas. Para construir un gráfico de barras, la secuencia MÁS apropiada es:",
        "alternativas": [
            {"opcion": "A", "texto": "Dar el gráfico impreso para que coloreen."},
            {"opcion": "B", "texto": "Organizar datos en tabla de conteo → Construir gráfico con material concreto (bloques apilados) → Dibujar gráfico en papel cuadriculado → Analizar y responder preguntas sobre los datos."},
            {"opcion": "C", "texto": "Mostrar un gráfico ejemplo y pedir que copien el formato."},
            {"opcion": "D", "texto": "Ingresar datos directamente en computador para generar gráfico digital."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "Construir gráficos significativos requiere: organizar datos, representar concretamente, dibujar, y finalmente analizar (progresión CPA aplicada a datos)."
    },
    {
        "num": 25,
        "dominio": "Matemática",
        "tema": "Cálculo mental",
        "enunciado": "Para desarrollar fluidez en <strong>sumas hasta 20</strong> en 2° básico, la estrategia MÁS efectiva es:",
        "alternativas": [
            {"opcion": "A", "texto": "Memorizar tablas de sumar mediante repetición."},
            {"opcion": "B", "texto": "Enseñar estrategias de cálculo mental (completar 10, dobles, dobles +1, sumar/restar cantidades pequeñas) con práctica sistemática diaria de 5-10 minutos con juegos y desafíos."},
            {"opcion": "C", "texto": "Usar solo calculadora para enfocarse en comprensión."},
            {"opcion": "D", "texto": "Resolver muchas fichas de ejercicios escritos."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La fluidez se desarrolla enseñando estrategias de cálculo mental (no solo memorización) con práctica sistemática y lúdica."
    },
    {
        "num": 26,
        "dominio": "Matemática",
        "tema": "Comparación de números",
        "enunciado": "Un estudiante de 1° básico dice que <em>'18 es mayor que 9 porque tiene dos números'</em>. ¿Qué error conceptual presenta?",
        "alternativas": [
            {"opcion": "A", "texto": "No comprende el concepto de 'mayor que'."},
            {"opcion": "B", "texto": "Confunde la cantidad de dígitos con el valor del número."},
            {"opcion": "C", "texto": "No sabe contar hasta 18."},
            {"opcion": "D", "texto": "Compara solo el primer dígito."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "Comparar por cantidad de dígitos en lugar de valor es un error conceptual común que requiere trabajo con representaciones concretas."
    },
    {
        "num": 27,
        "dominio": "Matemática",
        "tema": "Sustracción",
        "enunciado": "Para enseñar sustracción con reserva (<em>32 - 15</em>) en 2° básico, la mejor secuencia es:",
        "alternativas": [
            {"opcion": "A", "texto": "Enseñar el algoritmo formal directamente: 'no puedo restar 5 de 2, entonces pido prestado 1 decena...'."},
            {"opcion": "B", "texto": "Usar material de valor posicional (bloques base 10): mostrar 32 (3 barras + 2 cubitos), necesitar quitar 15, descomponer 1 barra en 10 cubitos, ahora quitar. Luego representar pictóricamente y finalmente con números."},
            {"opcion": "C", "texto": "Practicar muchos ejercicios similares hasta automatizar."},
            {"opcion": "D", "texto": "Usar solo la estrategia de conteo regresivo: '32, 31, 30... 17'."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La sustracción con reserva debe enseñarse primero con material concreto que evidencie el canje (1 decena = 10 unidades) siguiendo CPA."
    },
    {
        "num": 28,
        "dominio": "Matemática",
        "tema": "Tiempo",
        "enunciado": "En 1° básico, para enseñar secuencia temporal (antes/después, ayer/hoy/mañana), la actividad MÁS efectiva es:",
        "alternativas": [
            {"opcion": "A", "texto": "Enseñar a leer la hora en reloj análogo."},
            {"opcion": "B", "texto": "Crear rutinas visuales del día (línea de tiempo con pictogramas de actividades), usar calendario para marcar eventos, relatar secuencias de su día usando vocabulario temporal, ordenar secuencias de imágenes."},
            {"opcion": "C", "texto": "Memorizar los días de la semana cantando."},
            {"opcion": "D", "texto": "Resolver fichas donde escriben 'ayer/hoy/mañana'."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "Los conceptos temporales se construyen desde experiencias personales organizadas visualmente (rutinas, calendarios) y vocabulario usado en contexto significativo."
    },
    {
        "num": 29,
        "dominio": "Matemática",
        "tema": "Multiplicación inicial",
        "enunciado": "Para introducir el concepto de multiplicación en 2° básico (sin enseñar tablas aún), la mejor aproximación es:",
        "alternativas": [
            {"opcion": "A", "texto": "Enseñar las tablas del 2, 5 y 10 de memoria."},
            {"opcion": "B", "texto": "Plantear situaciones de adición iterada con material concreto: <em>'3 grupos de 4 manzanas. ¿Cuántas en total?'</em> Contar, luego representar: 4 + 4 + 4. Introducir la notación 3 × 4 como forma abreviada."},
            {"opcion": "C", "texto": "Explicar: 'Multiplicar es sumar muchas veces el mismo número'."},
            {"opcion": "D", "texto": "Resolver problemas de multiplicación usando la calculadora."}
        ],
        "respuesta_correcta": "B",
        "fundamentacion": "La multiplicación se introduce desde el concepto de grupos iguales (adición iterada) con representación concreta antes de memorizar tablas."
    },
    {
        "num": 30,
        "dominio": "Matemática",
        "tema": "Evaluación matemática",
        "enunciado": "Para evaluar comprensión matemática (no solo cálculo) en 1° básico, se debe:",
        "alternativas": [
            {"opcion": "A", "texto": "Aplicar pruebas escritas con muchos ejercicios de cálculo."},
            {"opcion": "B", "texto": "Evaluar solo a través de observación informal."},
            {"opcion": "C", "texto": "Usar múltiples estrategias: resolución de problemas (explicar cómo pensaron), representaciones concretas/pictóricas, explicaciones orales, observación de procesos, además de cálculo."},
            {"opcion": "D", "texto": "Medir solo velocidad de cálculo (fluidez)."}
        ],
        "respuesta_correcta": "C",
        "fundamentacion": "La evaluación integral en matemáticas incluye comprensión conceptual, resolución de problemas, razonamiento y comunicación, no solo fluidez de cálculo."
    }
]

# Continúa en la siguiente parte...
print("✅ Estructura base de prueba creada")
print(f"📊 Lenguaje: {len(preguntas_lenguaje)} preguntas")
print(f"📊 Matemática: {len(preguntas_matematica)} preguntas")
print("\n🔄 Guardando progreso...")

# Agregar preguntas al objeto prueba
prueba["preguntas"].extend(preguntas_lenguaje)
prueba["preguntas"].extend(preguntas_matematica)

# Guardar parcial
with open('prueba-basica-generalista-parcial.json', 'w', encoding='utf-8') as f:
    json.dump(prueba, f, ensure_ascii=False, indent=2)

print("✅ Progreso guardado: 30/60 preguntas (50%)")
print("📁 Archivo: prueba-basica-generalista-parcial.json")
