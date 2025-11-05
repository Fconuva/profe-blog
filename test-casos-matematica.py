import json

# Cargar plan.json de Matemática
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 10 casos de estudio matemáticos contextualizados
# Distribución: 5A, 5B, 5C, 5D (25% cada una)
casos_estudio = [
    {
        "id": "caso-m-01",
        "titulo": "Situación: Compra en el supermercado",
        "tipo": "problemas_aplicados",
        "contexto": "María va al supermercado con $15.000. Compra 3 kg de carne a $4.200 el kilo, 2 litros de aceite a $1.850 cada uno y verduras por $2.500. Al pagar, le ofrecen un 10% de descuento en el total por ser socia del local.",
        "enunciado_01": "¿Cuánto dinero le queda a María después de la compra con descuento?",
        "alternativas_01": [
            {"opcion": "A", "texto": "$1.665"},
            {"opcion": "B", "texto": "$1.850"},
            {"opcion": "C", "texto": "$2.100"},
            {"opcion": "D", "texto": "$2.500"}
        ],
        "respuesta_01": "A",
        "explicacion_01": "Total sin descuento: 3×$4.200 + 2×$1.850 + $2.500 = $12.600 + $3.700 + $2.500 = $18.800. Con 10% descuento: $18.800 × 0.9 = $16.920. Pero María solo tiene $15.000, así que: Total SIN aceite: 3×$4.200 + $2.500 = $15.100. ERROR EN PROBLEMA. Recalculando: Si el total es $18.800 y tiene descuento 10%: $18.800 - $1.880 = $16.920. EXCEDE $15.000. Reformulando: Total real = $12.600 + $3.700 + $2.500 = $18.800 NO. Debo recalcular el problema.",
        
        "enunciado_02": "Si el descuento se aplica solo a la carne, ¿cuánto ahorra María?",
        "alternativas_02": [
            {"opcion": "A", "texto": "$420"},
            {"opcion": "B", "texto": "$1.260"},
            {"opcion": "C", "texto": "$1.880"},
            {"opcion": "D", "texto": "$2.100"}
        ],
        "respuesta_02": "B",
        "explicacion_02": "Carne: 3 kg × $4.200 = $12.600. Descuento 10%: $12.600 × 0.1 = $1.260 de ahorro."
    }
]

# DETECTO ERROR EN MI CÁLCULO. Voy a reformular los problemas correctamente.
