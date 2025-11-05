#!/usr/bin/env python3
"""
Script para generar 10 casos de estudio de Matemática ECEP 2025
Cada caso tiene 2 preguntas (20 preguntas totales)
Total: 50 preguntas regulares + 20 de casos = 70 preguntas
"""

import json
import os

# 10 Casos de Estudio de Matemática
casos_estudio = [
    {
        "titulo": "Análisis de situación estadística en contexto escolar",
        "contexto": """<p>Una profesora de 7° básico registró las notas de sus 30 estudiantes en una prueba de matemática:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <p class="font-semibold mb-2">Notas obtenidas:</p>
        <p>4.5, 5.2, 6.1, 4.8, 5.5, 6.8, 7.0, 5.9, 4.2, 5.7, 6.3, 5.1, 4.9, 6.5, 5.8, 4.7, 6.0, 5.4, 6.2, 5.3, 4.6, 6.7, 5.6, 4.4, 6.4, 5.0, 6.9, 5.5, 6.1, 5.8</p>
        </div>
        <p>La profesora calcula que la nota promedio es 5.7 y la mediana es 5.75.</p>""",
        "pregunta_01": {
            "enunciado": "¿Qué medida de tendencia central es más representativa en este caso y por qué?",
            "alternativas": [
                {"opcion": "A", "texto": "La moda, porque indica la nota más frecuente"},
                {"opcion": "B", "texto": "La mediana, porque no se ve afectada por valores extremos"},
                {"opcion": "C", "texto": "El promedio, porque considera todas las notas por igual"},
                {"opcion": "D", "texto": "El rango, porque muestra la dispersión de datos"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "La mediana es más representativa cuando hay datos dispersos o valores extremos, ya que divide el conjunto de datos en dos mitades iguales y no se ve afectada por valores muy altos o muy bajos."
        },
        "pregunta_02": {
            "enunciado": "Si la profesora decide eliminar las 3 notas más bajas para calcular el promedio final, ¿qué consecuencia tendría esto en la interpretación de los datos?",
            "alternativas": [
                {"opcion": "A", "texto": "El promedio aumentaría, pero no representaría el desempeño real del curso"},
                {"opcion": "B", "texto": "El promedio disminuiría y sería más representativo"},
                {"opcion": "C", "texto": "La mediana aumentaría significativamente"},
                {"opcion": "D", "texto": "El rango se mantendría igual"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Eliminar las notas más bajas artificialmente aumenta el promedio, pero distorsiona la realidad del desempeño del curso, ya que omite información relevante sobre estudiantes con dificultades."
        }
    },
    {
        "titulo": "Resolución de problema con proporciones",
        "contexto": """<p>Un colegio organiza una salida pedagógica. La razón entre profesores y estudiantes debe ser de 1:15 según normativa.</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <p class="font-semibold mb-2">Datos:</p>
        <ul class="list-disc ml-6">
        <li>Van a asistir 135 estudiantes</li>
        <li>Cada bus tiene capacidad para 45 personas</li>
        <li>El costo total del transporte es $540.000</li>
        </ul>
        </div>
        <p>La dirección debe determinar cuántos profesores se necesitan y cómo distribuir a todos en los buses.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuántos profesores se necesitan como mínimo para cumplir con la razón 1:15?",
            "alternativas": [
                {"opcion": "A", "texto": "8 profesores"},
                {"opcion": "B", "texto": "9 profesores"},
                {"opcion": "C", "texto": "10 profesores"},
                {"opcion": "D", "texto": "15 profesores"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Si la razón es 1:15, y hay 135 estudiantes, necesitamos 135÷15 = 9 profesores. Este es el mínimo requerido según la normativa."
        },
        "pregunta_02": {
            "enunciado": "Considerando 135 estudiantes y 9 profesores (144 personas total), ¿cuántos buses se necesitan?",
            "alternativas": [
                {"opcion": "A", "texto": "2 buses, porque 45×2 = 90"},
                {"opcion": "B", "texto": "3 buses, porque 45×3 = 135"},
                {"opcion": "C", "texto": "4 buses, porque 144÷45 = 3.2, se necesita uno más"},
                {"opcion": "D", "texto": "5 buses para mayor comodidad"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "Con 144 personas y capacidad de 45 por bus: 144÷45 = 3.2. Como no podemos dejar a nadie fuera, se necesitan 4 buses (3 completos y 1 con 9 personas)."
        }
    },
    {
        "titulo": "Análisis de función lineal en contexto",
        "contexto": """<p>Una empresa de telefonía ofrece el siguiente plan de datos móviles:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <p class="font-semibold mb-2">Plan Base:</p>
        <ul class="list-disc ml-6">
        <li>Cargo fijo mensual: $8.000</li>
        <li>10 GB incluidos sin costo adicional</li>
        <li>Cada GB extra sobre los 10 incluidos: $500</li>
        </ul>
        </div>
        <p>Un cliente quiere saber cuánto pagará según su consumo mensual de datos.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuál es la función que representa el costo total (C) en función de los GB consumidos (x) si x > 10?",
            "alternativas": [
                {"opcion": "A", "texto": "C(x) = 8.000 + 500x"},
                {"opcion": "B", "texto": "C(x) = 8.000 + 500(x - 10)"},
                {"opcion": "C", "texto": "C(x) = 500x"},
                {"opcion": "D", "texto": "C(x) = 8.000x + 500"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "El costo es $8.000 fijo + $500 por cada GB que exceda los 10 incluidos. Por eso se resta 10 a x: C(x) = 8.000 + 500(x - 10)."
        },
        "pregunta_02": {
            "enunciado": "Si un cliente consumió 18 GB en un mes, ¿cuánto pagará en total?",
            "alternativas": [
                {"opcion": "A", "texto": "$9.000"},
                {"opcion": "B", "texto": "$11.000"},
                {"opcion": "C", "texto": "$12.000"},
                {"opcion": "D", "texto": "$13.000"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "C(18) = 8.000 + 500(18 - 10) = 8.000 + 500(8) = 8.000 + 4.000 = $12.000."
        }
    },
    {
        "titulo": "Geometría: área y perímetro en diseño",
        "contexto": """<p>Un arquitecto diseña un parque rectangular que tendrá:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <ul class="list-disc ml-6">
        <li>Largo: 80 metros</li>
        <li>Ancho: 50 metros</li>
        <li>Un camino de 2 metros de ancho bordeará todo el perímetro interior</li>
        <li>El centro será área verde con pasto</li>
        </ul>
        </div>
        <p>Se necesita calcular cuánto pasto se requiere para el área verde central.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuál es el área del rectángulo interior (área verde) sin considerar el camino?",
            "alternativas": [
                {"opcion": "A", "texto": "3.600 m²"},
                {"opcion": "B", "texto": "3.496 m²"},
                {"opcion": "C", "texto": "3.312 m²"},
                {"opcion": "D", "texto": "4.000 m²"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Si el camino tiene 2m de ancho en todos los lados, el área verde tiene: (80-4) × (50-4) = 76 × 46 = 3.496 m²."
        },
        "pregunta_02": {
            "enunciado": "¿Cuál es el área del camino solamente?",
            "alternativas": [
                {"opcion": "A", "texto": "288 m²"},
                {"opcion": "B", "texto": "504 m²"},
                {"opcion": "C", "texto": "520 m²"},
                {"opcion": "D", "texto": "600 m²"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Área del camino = Área total - Área verde = (80×50) - 3.496 = 4.000 - 3.496 = 504 m²."
        }
    },
    {
        "titulo": "Análisis de probabilidades en juego",
        "contexto": """<p>En una feria escolar, hay un juego con una ruleta dividida en 8 secciones iguales:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <p class="font-semibold mb-2">Distribución de premios:</p>
        <ul class="list-disc ml-6">
        <li>3 secciones con "Premio grande" (bicicleta)</li>
        <li>3 secciones con "Premio medio" (juguete)</li>
        <li>2 secciones con "Inténtalo de nuevo" (sin premio)</li>
        </ul>
        <p class="mt-2">Costo por juego: $1.000</p>
        </div>
        <p>Un estudiante quiere saber sus probabilidades de ganar algo.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuál es la probabilidad de obtener algún premio (grande o medio)?",
            "alternativas": [
                {"opcion": "A", "texto": "3/8 o 37.5%"},
                {"opcion": "B", "texto": "5/8 o 62.5%"},
                {"opcion": "C", "texto": "6/8 o 75%"},
                {"opcion": "D", "texto": "1/2 o 50%"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "Hay 3+3 = 6 secciones con premio de 8 totales. La probabilidad es 6/8 = 3/4 = 75%."
        },
        "pregunta_02": {
            "enunciado": "Si el estudiante juega 2 veces seguidas, ¿cuál es la probabilidad de NO ganar nada en ninguno de los dos intentos?",
            "alternativas": [
                {"opcion": "A", "texto": "1/16 o 6.25%"},
                {"opcion": "B", "texto": "2/8 o 25%"},
                {"opcion": "C", "texto": "4/64 o 6.25%"},
                {"opcion": "D", "texto": "1/4 o 25%"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Probabilidad de no ganar en un intento: 2/8 = 1/4. En dos intentos independientes: (1/4) × (1/4) = 1/16 = 6.25%."
        }
    },
    {
        "titulo": "Ecuaciones en resolución de problemas",
        "contexto": """<p>Tres hermanos reciben una herencia de $15.000.000. La distribución debe ser:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <ul class="list-disc ml-6">
        <li>El hermano mayor recibe el doble que el menor</li>
        <li>El hermano del medio recibe $2.000.000 más que el menor</li>
        <li>La suma de las tres partes es $15.000.000</li>
        </ul>
        </div>
        <p>Se necesita determinar cuánto recibe cada uno.</p>""",
        "pregunta_01": {
            "enunciado": "Si x representa lo que recibe el hermano menor, ¿cuál ecuación representa correctamente la situación?",
            "alternativas": [
                {"opcion": "A", "texto": "x + 2x + (x+2.000.000) = 15.000.000"},
                {"opcion": "B", "texto": "x + x + x = 15.000.000"},
                {"opcion": "C", "texto": "2x + (x+2.000.000) + x = 15.000.000"},
                {"opcion": "D", "texto": "x + (x-2.000.000) + 2x = 15.000.000"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "Si x es lo del menor, el mayor recibe 2x, el del medio recibe x+2.000.000. La suma: x + 2x + (x+2.000.000) = 15.000.000."
        },
        "pregunta_02": {
            "enunciado": "¿Cuánto dinero recibe el hermano mayor?",
            "alternativas": [
                {"opcion": "A", "texto": "$3.250.000"},
                {"opcion": "B", "texto": "$5.250.000"},
                {"opcion": "C", "texto": "$6.500.000"},
                {"opcion": "D", "texto": "$7.500.000"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "Resolviendo: 4x + 2.000.000 = 15.000.000 → 4x = 13.000.000 → x = 3.250.000. El mayor recibe 2x = 6.500.000."
        }
    },
    {
        "titulo": "Análisis de gráficos de funciones",
        "contexto": """<p>Un científico registra la temperatura de un experimento durante 8 horas:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <p class="font-semibold mb-2">Registro de temperatura (°C):</p>
        <ul class="list-disc ml-6">
        <li>Hora 0: 20°C (inicio)</li>
        <li>Hora 2: 35°C</li>
        <li>Hora 4: 50°C (máximo)</li>
        <li>Hora 6: 35°C</li>
        <li>Hora 8: 20°C (final)</li>
        </ul>
        </div>
        <p>El gráfico de temperatura vs tiempo forma una parábola.</p>""",
        "pregunta_01": {
            "enunciado": "¿En qué intervalo de tiempo la temperatura está aumentando?",
            "alternativas": [
                {"opcion": "A", "texto": "De 0 a 8 horas"},
                {"opcion": "B", "texto": "De 0 a 4 horas"},
                {"opcion": "C", "texto": "De 4 a 8 horas"},
                {"opcion": "D", "texto": "De 2 a 6 horas"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "La temperatura aumenta desde el inicio (20°C) hasta alcanzar el máximo en la hora 4 (50°C). Luego comienza a descender."
        },
        "pregunta_02": {
            "enunciado": "¿Cuál es la tasa promedio de cambio de temperatura entre las horas 0 y 4?",
            "alternativas": [
                {"opcion": "A", "texto": "5°C por hora"},
                {"opcion": "B", "texto": "7.5°C por hora"},
                {"opcion": "C", "texto": "10°C por hora"},
                {"opcion": "D", "texto": "15°C por hora"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Tasa de cambio = (50-20)/(4-0) = 30/4 = 7.5°C por hora. Es el promedio de aumento de temperatura por hora en ese intervalo."
        }
    },
    {
        "titulo": "Volumen y capacidad en problema real",
        "contexto": """<p>Una piscina municipal tiene forma de prisma rectangular con:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <ul class="list-disc ml-6">
        <li>Largo: 25 metros</li>
        <li>Ancho: 12 metros</li>
        <li>Profundidad promedio: 1.5 metros</li>
        <li>Se llena al 90% de su capacidad por seguridad</li>
        <li>1 m³ = 1.000 litros</li>
        </ul>
        </div>
        <p>El administrador necesita calcular cuánta agua se requiere.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuál es el volumen total de la piscina en metros cúbicos?",
            "alternativas": [
                {"opcion": "A", "texto": "300 m³"},
                {"opcion": "B", "texto": "375 m³"},
                {"opcion": "C", "texto": "450 m³"},
                {"opcion": "D", "texto": "500 m³"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "Volumen = largo × ancho × profundidad = 25 × 12 × 1.5 = 450 m³."
        },
        "pregunta_02": {
            "enunciado": "Si se llena solo al 90% de su capacidad, ¿cuántos litros de agua se necesitan?",
            "alternativas": [
                {"opcion": "A", "texto": "405.000 litros"},
                {"opcion": "B", "texto": "420.000 litros"},
                {"opcion": "C", "texto": "450.000 litros"},
                {"opcion": "D", "texto": "500.000 litros"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "90% de 450 m³ = 0.9 × 450 = 405 m³. Como 1 m³ = 1.000 litros: 405 × 1.000 = 405.000 litros."
        }
    },
    {
        "titulo": "Porcentajes y descuentos sucesivos",
        "contexto": """<p>Una tienda de electrónica tiene las siguientes promociones:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <p class="font-semibold mb-2">Notebook precio original: $800.000</p>
        <ul class="list-disc ml-6">
        <li>Descuento Black Friday: 25%</li>
        <li>Descuento adicional por pago al contado: 10% sobre el precio ya rebajado</li>
        <li>IVA (19%) incluido en precio original</li>
        </ul>
        </div>
        <p>Un cliente quiere saber el precio final con ambos descuentos.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuál es el precio después del primer descuento de 25%?",
            "alternativas": [
                {"opcion": "A", "texto": "$600.000"},
                {"opcion": "B", "texto": "$640.000"},
                {"opcion": "C", "texto": "$700.000"},
                {"opcion": "D", "texto": "$750.000"}
            ],
            "respuesta_correcta": "A",
            "explicacion": "25% de descuento significa pagar 75% del precio: $800.000 × 0.75 = $600.000."
        },
        "pregunta_02": {
            "enunciado": "¿Cuál es el precio final después de aplicar ambos descuentos?",
            "alternativas": [
                {"opcion": "A", "texto": "$520.000"},
                {"opcion": "B", "texto": "$540.000"},
                {"opcion": "C", "texto": "$560.000"},
                {"opcion": "D", "texto": "$580.000"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Segundo descuento de 10% sobre $600.000: pagar 90% = $600.000 × 0.9 = $540.000. Los descuentos se aplican sucesivamente, no se suman."
        }
    },
    {
        "titulo": "Interpretación de datos en tabla",
        "contexto": """<p>Un colegio registra la cantidad de libros leídos por curso durante el año:</p>
        <div class="bg-white p-4 rounded-lg border border-gray-300 my-4">
        <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
        <tr>
        <th class="border border-gray-300 p-2">Curso</th>
        <th class="border border-gray-300 p-2">Estudiantes</th>
        <th class="border border-gray-300 p-2">Total libros leídos</th>
        </tr>
        </thead>
        <tbody>
        <tr><td class="border border-gray-300 p-2">7°A</td><td class="border border-gray-300 p-2">32</td><td class="border border-gray-300 p-2">128</td></tr>
        <tr><td class="border border-gray-300 p-2">7°B</td><td class="border border-gray-300 p-2">35</td><td class="border border-gray-300 p-2">105</td></tr>
        <tr><td class="border border-gray-300 p-2">8°A</td><td class="border border-gray-300 p-2">30</td><td class="border border-gray-300 p-2">150</td></tr>
        <tr><td class="border border-gray-300 p-2">8°B</td><td class="border border-gray-300 p-2">33</td><td class="border border-gray-300 p-2">132</td></tr>
        </tbody>
        </table>
        </div>
        <p>La dirección quiere saber qué curso tiene el mejor promedio de lectura por estudiante.</p>""",
        "pregunta_01": {
            "enunciado": "¿Cuál curso tiene el promedio más alto de libros leídos por estudiante?",
            "alternativas": [
                {"opcion": "A", "texto": "7°A con 4 libros por estudiante"},
                {"opcion": "B", "texto": "7°B con 3 libros por estudiante"},
                {"opcion": "C", "texto": "8°A con 5 libros por estudiante"},
                {"opcion": "D", "texto": "8°B con 4 libros por estudiante"}
            ],
            "respuesta_correcta": "C",
            "explicacion": "Promedios: 7°A=128/32=4, 7°B=105/35=3, 8°A=150/30=5, 8°B=132/33=4. El 8°A tiene el promedio más alto con 5 libros por estudiante."
        },
        "pregunta_02": {
            "enunciado": "¿Cuántos libros en total leyeron los estudiantes de 8° básico?",
            "alternativas": [
                {"opcion": "A", "texto": "260 libros"},
                {"opcion": "B", "texto": "282 libros"},
                {"opcion": "C", "texto": "300 libros"},
                {"opcion": "D", "texto": "315 libros"}
            ],
            "respuesta_correcta": "B",
            "explicacion": "Total 8° básico = 8°A + 8°B = 150 + 132 = 282 libros."
        }
    }
]

# Leer el archivo actual
archivo_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\pruebas\66-sc-m\plan.json"

with open(archivo_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Agregar casos de estudio
data['casos_estudio'] = casos_estudio

# Actualizar el prompt de IA para que sea específico de Matemática, no de Educación Especial
data['exam']['ia_feedback']['prompt'] = """Eres un tutor pedagógico especializado en Matemática para docentes chilenos que preparan la ECEP 2025.

Te enviaré UNA PREGUNTA ESPECÍFICA de la prueba de Matemática con sus alternativas y respuesta correcta. Tu tarea es:

## 1. POR QUÉ ES CORRECTA (2-3 líneas)
- Explica claramente el razonamiento matemático que lleva a la respuesta correcta
- Usa fundamentos curriculares específicos (OA de 7°-8° básico, habilidades matemáticas)
- Muestra el procedimiento paso a paso si aplica

## 2. POR QUÉ LAS OTRAS SON INCORRECTAS (1 línea por cada alternativa)
- Analiza TODAS las alternativas incorrectas
- Explica el error matemático o conceptual de cada una
- Señala confusiones comunes entre estudiantes

## 3. APLICACIÓN DIDÁCTICA (2-3 sugerencias)
- Cómo enseñar este contenido en 7°-8° básico
- Actividades concretas para trabajar la habilidad matemática evaluada
- Estrategias para evitar errores comunes

FORMATO:
- Usa markdown limpio (##, **, -, >)
- Directo y pedagógico, sin saludos ni despedidas
- Máximo 300 palabras
- NO digas "Lo siento" o "Como asistente de IA..." ni menciones Educación Especial o PIE
- Incluye cálculos con formato claro cuando sea necesario

EJEMPLO DE RESPUESTA:
## Por qué B es correcta
La mediana divide el conjunto en dos mitades iguales y **no se ve afectada por valores extremos**. Con 30 datos ordenados, la mediana está entre la posición 15 y 16. En distribuciones con datos dispersos, la mediana es más representativa que el promedio.

## Por qué las otras son incorrectas
- **A (Moda)**: La moda solo indica el valor más frecuente, pero puede no existir o haber varias modas en este conjunto
- **C (Promedio)**: El promedio sí se ve afectado por valores extremos, lo que puede distorsionar la representación
- **D (Rango)**: El rango (máximo-mínimo) mide dispersión, no es una medida de tendencia central

## Aplicación didáctica
- Usa datos reales del curso (notas, estaturas) para calcular y comparar las tres medidas de tendencia central
- Pide a estudiantes agregar un valor extremo y observar cómo cambia cada medida
- Trabaja con gráficos de cajas para visualizar mediana, cuartiles y valores atípicos"""

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
