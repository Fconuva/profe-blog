import json

with open('plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

correctas = [next((opt['id'] for opt in q['options'] if opt['isCorrect']), None) for q in data['questions']]

print('=' * 60)
print('DISTRIBUCIÓN DE ALTERNATIVAS CORRECTAS:')
print('=' * 60)
print(f'A: {correctas.count("a")} preguntas ({correctas.count("a")/52*100:.1f}%)')
print(f'B: {correctas.count("b")} preguntas ({correctas.count("b")/52*100:.1f}%)')
print(f'C: {correctas.count("c")} preguntas ({correctas.count("c")/52*100:.1f}%)')
print(f'D: {correctas.count("d")} preguntas ({correctas.count("d")/52*100:.1f}%)')
print(f'\nOBJETIVO: 25% cada alternativa (~13 preguntas)')

print('\n' + '=' * 60)
print('PREGUNTAS CON PLACEHOLDERS (INCOMPLETAS):')
print('=' * 60)
incompletas = [q for q in data['questions'] if '[Contexto pedagógico' in q['stem']]
for q in incompletas:
    print(f"P{q['id']}: {q['stem'][:70]}...")

print(f'\nTotal incompletas: {len(incompletas)}/52')

print('\n' + '=' * 60)
print('FEEDBACK INSUFICIENTE (<50 caracteres):')
print('=' * 60)
for q in data['questions']:
    opciones_cortas = [o['id'] for o in q['options'] if len(o['feedback']) < 50]
    if opciones_cortas:
        print(f"P{q['id']}: Opciones {', '.join(opciones_cortas)} tienen feedback corto")
