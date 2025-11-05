# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def agregar_casos_matematica():
    """Agrega sección casos_estudio con formato pedagógico correcto"""
    
    # 10 casos con contexto docente + pregunta específica
    # Distribución: 3A, 3B, 2C, 2D (balanceado aprox)
    casos = [
        {
            "id": "caso-m-01",
            "contexto": "Un docente de 7° Básico está trabajando fracciones equivalentes. Durante una actividad grupal, observa que un estudiante afirma que 2/3 es igual a 4/5 porque \"ambas tienen diferencia de 1 entre numerador y denominador\". El docente necesita identificar qué concepto debe reforzar.",
            "enunciado": "¿Qué concepto matemático debe ejercitar el estudiante para superar esta dificultad?",
            "alternativas": [
                {"opcion": "A", "texto": "La amplificación y simplificación de fracciones"},
                {"opcion": "B", "texto": "La conversión de fracciones a decimales"},
                {"opcion": "C", "texto": "El cálculo del mínimo común múltiplo"},
                {"opcion": "D", "texto": "La comparación de fracciones con distinto denominador"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "El error conceptual radica en no comprender que las fracciones equivalentes se obtienen multiplicando o dividiendo numerador y denominador por el mismo número, no por observar patrones aditivos."
        },
        {
            "id": "caso-m-02",
            "contexto": "Una profesora de 8° Básico solicita calcular el área de un rectángulo de 12 cm × 8 cm. Un estudiante responde \"40 cm\" argumentando que \"sumé todos los lados\". La docente identifica confusión entre conceptos geométricos.",
            "enunciado": "¿Qué distinción conceptual debe reforzar el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "La diferencia entre unidades lineales y cuadradas"},
                {"opcion": "B", "texto": "La diferencia entre perímetro y área"},
                {"opcion": "C", "texto": "El teorema de Pitágoras aplicado a rectángulos"},
                {"opcion": "D", "texto": "La conversión entre centímetros y metros"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El estudiante confunde perímetro (suma de lados) con área (base × altura). Además, omite las unidades cuadradas (cm²) propias del área."
        },
        {
            "id": "caso-m-03",
            "contexto": "Durante una evaluación de proporcionalidad, un docente presenta: \"Si 3 obreros construyen un muro en 12 días, ¿cuántos días tardarán 6 obreros?\". Un estudiante responde \"24 días\" aplicando proporcionalidad directa.",
            "enunciado": "¿Qué debe ejercitar el estudiante para corregir este error?",
            "alternativas": [
                {"opcion": "A", "texto": "El reconocimiento de magnitudes inversamente proporcionales"},
                {"opcion": "B", "texto": "El cálculo de razones y proporciones directas"},
                {"opcion": "C", "texto": "La aplicación del teorema fundamental de la proporcionalidad"},
                {"opcion": "D", "texto": "La conversión de unidades de tiempo"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Más obreros implican menos días (relación inversa). El estudiante aplicó incorrectamente proporcionalidad directa. Debe reconocer cuándo las magnitudes varían inversamente."
        },
        {
            "id": "caso-m-04",
            "contexto": "Un profesor presenta un gráfico de barras con temperaturas mensuales y pregunta: \"¿Cuál fue la temperatura promedio del primer trimestre?\". Un estudiante responde eligiendo la temperatura más alta del período.",
            "enunciado": "¿Qué habilidad estadística debe desarrollar el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "La distinción entre moda y promedio"},
                {"opcion": "B", "texto": "La interpretación de gráficos de líneas"},
                {"opcion": "C", "texto": "El cálculo del promedio como medida de tendencia central"},
                {"opcion": "D", "texto": "El cálculo de la mediana en conjuntos de datos"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "El estudiante confunde el valor máximo con el promedio. Debe comprender que el promedio se calcula sumando todos los valores y dividiendo por la cantidad de datos."
        },
        {
            "id": "caso-m-05",
            "contexto": "En una actividad de porcentajes, un docente pregunta: \"¿Cuánto es el 20% de $5.000?\". Un estudiante divide 5000 ÷ 20 = 250 y responde \"$250\". Otro estudiante obtiene $1.000 como resultado.",
            "enunciado": "¿Qué procedimiento utilizó correctamente el segundo estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "Dividió por 5 (equivalente a 20%)"},
                {"opcion": "B", "texto": "Multiplicó por 0,2 (equivalente a 20%)"},
                {"opcion": "C", "texto": "Sumó 20 al valor original"},
                {"opcion": "D", "texto": "Multiplicó por 20 y dividió por 100"}
            ],
            "respuesta_correcta": "D",
            "explicacion": "20% significa 20/100. Entonces 20% de $5.000 = (20 × 5.000) ÷ 100 = 100.000 ÷ 100 = $1.000. Las opciones B y D son equivalentes matemáticamente."
        },
        {
            "id": "caso-m-06",
            "contexto": "Una profesora trabaja ecuaciones lineales. Al resolver \"3x + 5 = 20\", un estudiante escribe: \"3x = 20 + 5\" y obtiene x = 25/3. La docente detecta un error en el despeje.",
            "enunciado": "¿Qué principio algebraico debe reforzar el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "La propiedad distributiva de la multiplicación"},
                {"opcion": "B", "texto": "El cambio de signo al transponer términos"},
                {"opcion": "C", "texto": "La jerarquía de operaciones (PEMDAS)"},
                {"opcion": "D", "texto": "La factorización de expresiones algebraicas"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Al pasar el +5 al otro lado de la ecuación, debe cambiar a -5. Lo correcto es: 3x = 20 - 5, entonces 3x = 15, por lo tanto x = 5."
        },
        {
            "id": "caso-m-07",
            "contexto": "En una clase de geometría, un docente solicita calcular el volumen de un cubo de 4 cm de arista. Un estudiante responde \"16 cm³\" argumentando que \"elevó al cuadrado\".",
            "enunciado": "¿Qué debe comprender el estudiante para resolver correctamente?",
            "alternativas": [
                {"opcion": "A", "texto": "Que el volumen del cubo es arista × arista × arista"},
                {"opcion": "B", "texto": "Que debe usar el teorema de Pitágoras"},
                {"opcion": "C", "texto": "Que debe calcular el área de las 6 caras"},
                {"opcion": "D", "texto": "Que debe convertir cm a cm³"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "El volumen de un cubo es V = a³. Con a = 4 cm, entonces V = 4³ = 64 cm³. El estudiante elevó solo al cuadrado (4² = 16), confundiendo área con volumen."
        },
        {
            "id": "caso-m-08",
            "contexto": "Un profesor presenta números enteros en la recta numérica. Al ordenar -5, -2, 0, 3, un estudiante coloca: 3, 0, -2, -5, explicando que \"ordené de mayor a menor como siempre\".",
            "enunciado": "¿Qué concepto debe reforzar respecto a números negativos?",
            "alternativas": [
                {"opcion": "A", "texto": "Que los números negativos más alejados del cero son menores"},
                {"opcion": "B", "texto": "Que el valor absoluto determina el orden"},
                {"opcion": "C", "texto": "Que los números negativos se suman al positivo"},
                {"opcion": "D", "texto": "Que el cero es negativo"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "En la recta numérica, -5 < -2 < 0 < 3. Aunque |-5| > |-2|, el número -5 está más a la izquierda del cero, por lo tanto es menor. El estudiante ordenó por valor absoluto incorrectamente."
        },
        {
            "id": "caso-m-09",
            "contexto": "Durante una clase de estadística, una docente presenta: \"De 40 estudiantes, 15 eligieron fútbol, 10 básquetbol, 8 voleibol y 7 tenis. ¿Qué porcentaje eligió fútbol?\". Un estudiante responde \"15%\".",
            "enunciado": "¿Qué error cometió el estudiante en su cálculo?",
            "alternativas": [
                {"opcion": "A", "texto": "Confundió la cantidad absoluta con el porcentaje"},
                {"opcion": "B", "texto": "No calculó correctamente la fracción 15/40"},
                {"opcion": "C", "texto": "Sumó incorrectamente las preferencias"},
                {"opcion": "D", "texto": "Aplicó la media aritmética en lugar de porcentaje"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "El porcentaje correcto es (15/40) × 100 = 37,5%. El estudiante simplemente escribió el número 15 con el símbolo %, confundiendo cantidad con porcentaje."
        },
        {
            "id": "caso-m-10",
            "contexto": "Un docente trabaja ángulos complementarios. Presenta: \"Dos ángulos suman 90°. Si uno mide 35°, ¿cuánto mide el otro?\". Un estudiante responde \"125°\" porque \"sumé 90 + 35\".",
            "enunciado": "¿Qué concepto debe ejercitar el estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "La definición de ángulos suplementarios"},
                {"opcion": "B", "texto": "El cálculo del ángulo complementario mediante resta"},
                {"opcion": "C", "texto": "La conversión entre grados y radianes"},
                {"opcion": "D", "texto": "La suma de ángulos internos de un triángulo"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Ángulos complementarios suman 90°. Si uno mide 35°, el otro mide 90° - 35° = 55°. El estudiante sumó en lugar de restar, confundiendo la operación necesaria."
        }
    ]
    
    ruta = 'evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json'
    
    with open(ruta, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Agregar sección casos_estudio
    data['exam']['casos_estudio'] = casos
    
    # Guardar
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("✓ CASOS DE ESTUDIO AGREGADOS A MATEMATICA")
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
    agregar_casos_matematica()
