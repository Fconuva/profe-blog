import json
from collections import Counter

# Verificar LENGUAJE tras correcciones
with open('evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

respuestas = [p['respuesta_correcta'] for p in data['exam']['preguntas']]
dist = Counter(respuestas)

print("DISTRIBUCION LENGUAJE (tras correcciones):")
for alt in ['A', 'B', 'C', 'D']:
    count = dist.get(alt, 0)
    percent = (count / len(respuestas)) * 100
    print(f"  {alt}: {count} preguntas ({percent:.0f}%)")
print(f"\nTotal: {len(respuestas)} preguntas")
