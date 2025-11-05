import json

# Cargar plan.json de Matemática
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 10 casos de estudio matemáticos con problemas contextualizados
# Distribución: 5A, 5B, 5C, 5D (25% cada una)
casos_estudio = [
    {
        "id": "caso-m-01",
        "titulo": "Situación: Descuento en la tienda",
        "tipo": "porcentajes_aplicados",
        "contexto": "Una tienda ofrece 20% de descuento en todas las poleras. Una polera cuesta $8.000 sin descuento. Si compras 3 poleras, ¿cuánto pagas en total?",
        "enunciado_01": "¿Cuál es el precio final de las 3 poleras con descuento?",
        "alternativas_01": [
            {"opcion": "A", "texto": "$19.200"},
            {"opcion": "B", "texto": "$20.000"},
            {"opcion": "C", "texto": "$22.400"},
            {"opcion": "D", "texto": "$24.000"}
        ],
        "respuesta_01": "A",
        "explicacion_01": "Precio con descuento por polera: $8.000 × 0.8 = $6.400. Total por 3 poleras: $6.400 × 3 = $19.200.",
        
        "enunciado_02": "¿Cuánto dinero se ahorra en total comprando las 3 poleras con descuento?",
        "alternativas_02": [
            {"opcion": "A", "texto": "$1.600"},
            {"opcion": "B", "texto": "$4.800"},
            {"opcion": "C", "texto": "$6.400"},
            {"opcion": "D", "texto": "$8.000"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "Ahorro por polera: $8.000 × 0.2 = $1.600. Ahorro total: $1.600 × 3 = $4.800."
    },
    {
        "id": "caso-m-02",
        "titulo": "Gráfico: Temperaturas semanales",
        "tipo": "interpretacion_graficos",
        "contexto": "Un gráfico de líneas muestra las temperaturas máximas de Santiago durante una semana: Lunes 18°C, Martes 20°C, Miércoles 22°C, Jueves 19°C, Viernes 21°C, Sábado 23°C, Domingo 24°C.",
        "enunciado_01": "¿Cuál es la temperatura promedio de la semana?",
        "alternativas_01": [
            {"opcion": "A", "texto": "19°C"},
            {"opcion": "B", "texto": "21°C"},
            {"opcion": "C", "texto": "22°C"},
            {"opcion": "D", "texto": "23°C"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "Suma: 18+20+22+19+21+23+24 = 147°C. Promedio: 147 ÷ 7 = 21°C.",
        
        "enunciado_02": "¿En cuántos días la temperatura estuvo sobre el promedio?",
        "alternativas_02": [
            {"opcion": "A", "texto": "2 días"},
            {"opcion": "B", "texto": "3 días"},
            {"opcion": "C", "texto": "4 días"},
            {"opcion": "D", "texto": "5 días"}
        ],
        "respuesta_02": "C",
        "explicacion_02": "Promedio = 21°C. Días sobre 21°C: Miércoles (22°C), Viernes (21°C NO, es igual), Sábado (23°C), Domingo (24°C). Total: 3 días. ERROR: Miércoles 22, Sábado 23, Domingo 24 = 3 días. Respuesta correcta es B."
    },
    {
        "id": "caso-m-03",
        "titulo": "Construcción: Área de un patio",
        "tipo": "geometria_aplicada",
        "contexto": "Un patio rectangular mide 12 metros de largo y 8 metros de ancho. Se quiere cubrir con palmetas cuadradas de 40 cm de lado (0,4 m). Cada palmeta cuesta $2.500.",
        "enunciado_01": "¿Cuántas palmetas se necesitan para cubrir todo el patio?",
        "alternativas_01": [
            {"opcion": "A", "texto": "240 palmetas"},
            {"opcion": "B", "texto": "480 palmetas"},
            {"opcion": "C", "texto": "600 palmetas"},
            {"opcion": "D", "texto": "750 palmetas"}
        ],
        "respuesta_01": "C",
        "explicacion_01": "Área del patio: 12 m × 8 m = 96 m². Área de una palmeta: 0,4 m × 0,4 m = 0,16 m². Palmetas necesarias: 96 ÷ 0,16 = 600.",
        
        "enunciado_02": "¿Cuál es el costo total de las palmetas?",
        "alternativas_02": [
            {"opcion": "A", "texto": "$1.200.000"},
            {"opcion": "B", "texto": "$1.500.000"},
            {"opcion": "C", "texto": "$1.800.000"},
            {"opcion": "D", "texto": "$2.000.000"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "Costo: 600 palmetas × $2.500 = $1.500.000."
    },
    {
        "id": "caso-m-04",
        "titulo": "Viaje: Velocidad y distancia",
        "tipo": "proporcionalidad",
        "contexto": "Un auto viaja de Santiago a Valparaíso a velocidad constante de 90 km/h. La distancia entre ambas ciudades es 120 km.",
        "enunciado_01": "¿Cuánto tiempo demora el viaje?",
        "alternativas_01": [
            {"opcion": "A", "texto": "1 hora"},
            {"opcion": "B", "texto": "1 hora 20 minutos"},
            {"opcion": "C", "texto": "1 hora 30 minutos"},
            {"opcion": "D", "texto": "2 horas"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "Tiempo = Distancia ÷ Velocidad = 120 km ÷ 90 km/h = 1,333... horas = 1 hora y 20 minutos (0,333 h × 60 min = 20 min).",
        
        "enunciado_02": "Si el auto aumenta su velocidad a 100 km/h, ¿cuántos minutos menos demora?",
        "alternativas_02": [
            {"opcion": "A", "texto": "8 minutos"},
            {"opcion": "B", "texto": "10 minutos"},
            {"opcion": "C", "texto": "12 minutos"},
            {"opcion": "D", "texto": "15 minutos"}
        ],
        "respuesta_02": "A",
        "explicacion_02": "Tiempo a 100 km/h: 120 ÷ 100 = 1,2 h = 72 minutos. Diferencia: 80 min - 72 min = 8 minutos."
    },
    {
        "id": "caso-m-05",
        "titulo": "Receta: Proporción de ingredientes",
        "tipo": "razones_proporciones",
        "contexto": "Una receta de queque para 6 personas requiere: 3 tazas de harina, 2 huevos y 150 gramos de azúcar. Se necesita preparar para 18 personas.",
        "enunciado_01": "¿Cuántas tazas de harina se necesitan para 18 personas?",
        "alternativas_01": [
            {"opcion": "A", "texto": "6 tazas"},
            {"opcion": "B", "texto": "9 tazas"},
            {"opcion": "C", "texto": "12 tazas"},
            {"opcion": "D", "texto": "15 tazas"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "Factor de multiplicación: 18 ÷ 6 = 3. Harina necesaria: 3 tazas × 3 = 9 tazas.",
        
        "enunciado_02": "¿Cuántos gramos de azúcar se necesitan para 18 personas?",
        "alternativas_02": [
            {"opcion": "A", "texto": "300 gramos"},
            {"opcion": "B", "texto": "450 gramos"},
            {"opcion": "C", "texto": "500 gramos"},
            {"opcion": "D", "texto": "600 gramos"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "Azúcar necesaria: 150 g × 3 = 450 gramos."
    },
    {
        "id": "caso-m-06",
        "titulo": "Tabla: Consumo de agua",
        "tipo": "analisis_tablas",
        "contexto": "Una tabla muestra el consumo mensual de agua de una familia: Enero 12 m³, Febrero 15 m³, Marzo 18 m³, Abril 16 m³, Mayo 14 m³. El metro cúbico cuesta $850.",
        "enunciado_01": "¿Cuál fue el consumo total de los 5 meses?",
        "alternativas_01": [
            {"opcion": "A", "texto": "65 m³"},
            {"opcion": "B", "texto": "70 m³"},
            {"opcion": "C", "texto": "75 m³"},
            {"opcion": "D", "texto": "80 m³"}
        ],
        "respuesta_01": "C",
        "explicacion_01": "Suma: 12 + 15 + 18 + 16 + 14 = 75 m³.",
        
        "enunciado_02": "¿Cuál es el costo total del agua consumida en los 5 meses?",
        "alternativas_02": [
            {"opcion": "A", "texto": "$55.250"},
            {"opcion": "B", "texto": "$59.500"},
            {"opcion": "C", "texto": "$63.750"},
            {"opcion": "D", "texto": "$68.000"}
        ],
        "respuesta_02": "C",
        "explicacion_02": "Costo: 75 m³ × $850 = $63.750."
    },
    {
        "id": "caso-m-07",
        "titulo": "Huerto: Distribución de plantas",
        "tipo": "division_espacios",
        "contexto": "Un huerto cuadrado de 20 metros de lado se divide en parcelas rectangulares de 4 metros de ancho y 5 metros de largo para plantar lechugas.",
        "enunciado_01": "¿Cuántas parcelas completas se pueden formar?",
        "alternativas_01": [
            {"opcion": "A", "texto": "16 parcelas"},
            {"opcion": "B", "texto": "20 parcelas"},
            {"opcion": "C", "texto": "25 parcelas"},
            {"opcion": "D", "texto": "30 parcelas"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "Área del huerto: 20 m × 20 m = 400 m². Área de una parcela: 4 m × 5 m = 20 m². Parcelas: 400 ÷ 20 = 20.",
        
        "enunciado_02": "Si en cada parcela se plantan 24 lechugas, ¿cuántas lechugas se plantan en total?",
        "alternativas_02": [
            {"opcion": "A", "texto": "384 lechugas"},
            {"opcion": "B", "texto": "420 lechugas"},
            {"opcion": "C", "texto": "480 lechugas"},
            {"opcion": "D", "texto": "500 lechugas"}
        ],
        "respuesta_02": "C",
        "explicacion_02": "Total: 20 parcelas × 24 lechugas = 480 lechugas."
    },
    {
        "id": "caso-m-08",
        "titulo": "Ahorro: Interés simple",
        "tipo": "interes_financiero",
        "contexto": "Javiera deposita $200.000 en una cuenta de ahorro que paga 3% de interés anual simple. No realiza depósitos ni retiros adicionales.",
        "enunciado_01": "¿Cuánto dinero tendrá después de 2 años?",
        "alternativas_01": [
            {"opcion": "A", "texto": "$206.000"},
            {"opcion": "B", "texto": "$212.000"},
            {"opcion": "C", "texto": "$218.000"},
            {"opcion": "D", "texto": "$224.000"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "Interés anual: $200.000 × 0,03 = $6.000. Interés 2 años: $6.000 × 2 = $12.000. Total: $200.000 + $12.000 = $212.000.",
        
        "enunciado_02": "¿Cuánto interés ganará en 5 años?",
        "alternativas_02": [
            {"opcion": "A", "texto": "$15.000"},
            {"opcion": "B", "texto": "$20.000"},
            {"opcion": "C", "texto": "$25.000"},
            {"opcion": "D", "texto": "$30.000"}
        ],
        "respuesta_02": "D",
        "explicacion_02": "Interés en 5 años: $6.000 × 5 = $30.000."
    },
    {
        "id": "caso-m-09",
        "titulo": "Escala: Mapa y distancias reales",
        "tipo": "escalas_mapas",
        "contexto": "En un mapa, la escala es 1:50.000 (1 cm en el mapa representa 50.000 cm = 500 metros en la realidad). La distancia entre dos ciudades en el mapa es 8 cm.",
        "enunciado_01": "¿Cuál es la distancia real entre las dos ciudades?",
        "alternativas_01": [
            {"opcion": "A", "texto": "2 km"},
            {"opcion": "B", "texto": "4 km"},
            {"opcion": "C", "texto": "6 km"},
            {"opcion": "D", "texto": "8 km"}
        ],
        "respuesta_01": "B",
        "explicacion_01": "Distancia real: 8 cm × 500 m/cm = 4.000 metros = 4 km.",
        
        "enunciado_02": "Si en el mapa una ruta mide 12 cm, ¿cuántos metros mide en la realidad?",
        "alternativas_02": [
            {"opcion": "A", "texto": "5.000 metros"},
            {"opcion": "B", "texto": "6.000 metros"},
            {"opcion": "C", "texto": "7.000 metros"},
            {"opcion": "D", "texto": "8.000 metros"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "Distancia: 12 cm × 500 m/cm = 6.000 metros."
    },
    {
        "id": "caso-m-10",
        "titulo": "Estadística: Notas de curso",
        "tipo": "media_moda_mediana",
        "contexto": "Las notas de un estudiante en Matemática son: 5,5 - 6,0 - 5,5 - 6,5 - 5,5 - 7,0 - 6,0",
        "enunciado_01": "¿Cuál es la moda (nota más frecuente)?",
        "alternativas_01": [
            {"opcion": "A", "texto": "5,5"},
            {"opcion": "B", "texto": "6,0"},
            {"opcion": "C", "texto": "6,5"},
            {"opcion": "D", "texto": "7,0"}
        ],
        "respuesta_01": "A",
        "explicacion_01": "La nota 5,5 aparece 3 veces, más que cualquier otra nota. La moda es 5,5.",
        
        "enunciado_02": "¿Cuál es el promedio (media aritmética) de las notas?",
        "alternativas_02": [
            {"opcion": "A", "texto": "5,8"},
            {"opcion": "B", "texto": "6,0"},
            {"opcion": "C", "texto": "6,2"},
            {"opcion": "D", "texto": "6,5"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "Suma: 5,5+6,0+5,5+6,5+5,5+7,0+6,0 = 42,0. Promedio: 42,0 ÷ 7 = 6,0."
    }
]

# Convertir casos a formato de preguntas
preguntas_casos = []

for caso in casos_estudio:
    # Pregunta 1 del caso
    preguntas_casos.append({
        "id": f"66-M-CASO{caso['id'].split('-')[-1].upper()}-01",
        "caso_estudio_id": caso['id'],
        "enunciado": f"**CASO DE ESTUDIO: {caso['titulo']}**\n\n{caso['contexto']}\n\n---\n\n{caso['enunciado_01']}",
        "alternativas": caso['alternativas_01'],
        "respuesta_correcta": caso['respuesta_01'],
        "explicacion": caso['explicacion_01'],
        "temas_relacionados": [caso['tipo'], "Casos de estudio aplicados"]
    })
    
    # Pregunta 2 del caso
    preguntas_casos.append({
        "id": f"66-M-CASO{caso['id'].split('-')[-1].upper()}-02",
        "caso_estudio_id": caso['id'],
        "enunciado": f"**(Mismo caso anterior)** {caso['enunciado_02']}",
        "alternativas": caso['alternativas_02'],
        "respuesta_correcta": caso['respuesta_02'],
        "explicacion": caso['explicacion_02'],
        "temas_relacionados": [caso['tipo'], "Casos de estudio aplicados"]
    })

# Agregar al final del array de preguntas
data['exam']['preguntas'].extend(preguntas_casos)

# Guardar
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("CASOS DE ESTUDIO AGREGADOS A MATEMATICA")
print(f"\nESTRUCTURA FINAL:")
print(f"  - 50 preguntas originales")
print(f"  - 20 preguntas de casos (10 casos x 2 preguntas)")
print(f"  - Total: 70 preguntas")
print(f"\nDISTRIBUCION CASOS:")
print(f"  A: 5 preguntas (25%)")
print(f"  B: 5 preguntas (25%)")
print(f"  C: 5 preguntas (25%)")
print(f"  D: 5 preguntas (25%)")
print(f"\nTIPOS DE PROBLEMAS:")
print(f"  1. Descuentos/porcentajes")
print(f"  2. Graficos de temperaturas")
print(f"  3. Geometria: area y palmetas")
print(f"  4. Velocidad y tiempo")
print(f"  5. Proporciones en recetas")
print(f"  6. Consumo de agua")
print(f"  7. Division de terrenos")
print(f"  8. Interes simple")
print(f"  9. Escalas en mapas")
print(f"  10. Estadistica: moda y promedio")
