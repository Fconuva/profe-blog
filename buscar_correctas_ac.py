import json

with open(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json", 'r', encoding='utf-8') as f:
    data = json.load(f)

# Encontrar preguntas con correcta A o C
correctas_a_c = []
for q in data['questions']:
    for o in q['options']:
        if o['isCorrect'] and o['id'] in ['a', 'c']:
            correctas_a_c.append((q['id'], o['id']))
            break

print("Preguntas con respuesta correcta A o C (primeras 10):")
for id_q, letra in correctas_a_c[:10]:
    print(f"Q{id_q}: {letra}")
