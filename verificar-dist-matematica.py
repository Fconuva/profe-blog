import json
from collections import Counter

# Cargar plan.json de Matemática
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Contar distribución de alternativas correctas
respuestas = [p['respuesta_correcta'] for p in data['exam']['preguntas']]
distribucion = Counter(respuestas)

print("\n✅ DISTRIBUCIÓN ACTUAL DE ALTERNATIVAS EN MATEMÁTICA:")
for alt in ['A', 'B', 'C', 'D']:
    count = distribucion.get(alt, 0)
    percent = (count / len(respuestas)) * 100
    print(f"  {alt}: {count} preguntas ({percent:.0f}%)")

print(f"\nTotal: {len(respuestas)} preguntas")

# Mostrar IDs de cada alternativa para facilitar redistribución
print("\n📋 PREGUNTAS POR ALTERNATIVA:")
for alt in ['A', 'B', 'C', 'D']:
    ids = [p['id'] for p in data['exam']['preguntas'] if p['respuesta_correcta'] == alt]
    print(f"\n{alt} ({len(ids)}): {', '.join(ids)}")
