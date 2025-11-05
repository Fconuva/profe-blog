import json

with open('evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("ANALISIS DE ALTERNATIVAS EN LENGUAJE 63-sc-l\n")
print("="*80)

# Agrupar por alternativa correcta actual
por_alternativa = {'A': [], 'B': [], 'C': [], 'D': []}

for p in data['exam']['preguntas']:
    info = {
        'id': p['id'],
        'correcta': p['respuesta_correcta'],
        'enunciado': p['enunciado'][:80],
        'alternativas': {alt['opcion']: alt['texto'][:50] for alt in p['alternativas']}
    }
    por_alternativa[p['respuesta_correcta']].append(info)

# Mostrar distribución actual
print("\nDISTRIBUCION ACTUAL:")
for alt in ['A', 'B', 'C', 'D']:
    print(f"  {alt}: {len(por_alternativa[alt])} preguntas")

# Guardar JSON detallado para análisis
output = {
    'distribucion': {alt: len(por_alternativa[alt]) for alt in ['A', 'B', 'C', 'D']},
    'preguntas_por_alternativa': por_alternativa
}

with open('analisis-lenguaje.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("\nArchivo 'analisis-lenguaje.json' creado para revision manual")
print("\nPREGUNTAS CON ALTERNATIVA B (para posible cambio):")
print("-"*80)
for i, p in enumerate(por_alternativa['B'][:10], 1):
    print(f"\n{i}. {p['id']}: {p['enunciado']}")
    print(f"   Alternativas: A={p['alternativas']['A'][:40]}")
    print(f"                 B={p['alternativas']['B'][:40]} <- CORRECTA")
    print(f"                 C={p['alternativas']['C'][:40]}")
    print(f"                 D={p['alternativas']['D'][:40]}")
