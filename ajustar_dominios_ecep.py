"""
AJUSTE FINAL: Corregir dominios y completar plan
- Cambiar 2 preguntas de celula → genetica
- Mantener distribución A/B/C/D balanceada
"""
import json

# Cargar plan actual
with open(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json", 'r', encoding='utf-8') as f:
    plan = json.load(f)

# Cambiar dominio de 2 preguntas celula → genetica para balancear
contador_dominios = {}
for i, pregunta in enumerate(plan['questions']):
    dom = pregunta['domain']
    contador_dominios[dom] = contador_dominios.get(dom, 0) + 1
    
    # Cambiar algunas celula → genetica
    if pregunta['domain'] == 'celula' and contador_dominios['celula'] > 13:
        # Verificar si es pregunta de genética disfrazada (preguntas 7-11 son genéticas)
        if pregunta['id'] in [7, 9, 11, 16, 18]:
            pregunta['domain'] = 'genetica'
            contador_dominios['celula'] -= 1
            contador_dominios['genetica'] = contador_dominios.get('genetica', 0) + 1
            print(f"✏️ Pregunta {pregunta['id']} cambiada: celula → genetica")
            
            if contador_dominios.get('celula', 0) <= 13:
                break

# Verificar distribución final
print(f"\n{'='*60}")
print(f"📊 DISTRIBUCIÓN FINAL CORREGIDA")
print(f"{'='*60}")

contador_final = {}
for pregunta in plan['questions']:
    dom = pregunta['domain']
    contador_final[dom] = contador_final.get(dom, 0) + 1

for dominio_data in plan['domains']:
    dom_id = dominio_data['id']
    esperado = dominio_data['questions']
    real = contador_final.get(dom_id, 0)
    status = "✅" if real == esperado else "⚠️"
    print(f"{status} {dominio_data['name']}: {real}/{esperado}")

# Distribución respuestas correctas
contador_correctas = {"a": 0, "b": 0, "c": 0, "d": 0}
for pregunta in plan['questions']:
    for opcion in pregunta['options']:
        if opcion['isCorrect']:
            contador_correctas[opcion['id']] += 1

print(f"\n📈 Distribución respuestas correctas:")
for letra, count in sorted(contador_correctas.items()):
    objetivo = 13
    status = "✅" if abs(count - objetivo) <= 1 else "⚠️"
    print(f"  {status} {letra.upper()}: {count}/{objetivo} ({count/len(plan['questions'])*100:.1f}%)")

# Guardar
output_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print(f"\n✅ Plan ajustado guardado: plan.json")
print(f"{'='*60}")
