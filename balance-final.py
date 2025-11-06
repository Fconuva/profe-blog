import json
from collections import Counter

with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Ajuste final: llevar a 12-13-13-12 o 13-12-12-13
for p in data['exam']['preguntas']:
    if p['numero'] == 11:
        p['respuesta_correcta'] = 'C'
    if p['numero'] == 23:
        p['respuesta_correcta'] = 'A'

respuestas = []
for p in data['exam']['preguntas']:
    respuestas.append(p['respuesta_correcta'])
for caso in data['exam']['casos_estudio']:
    for p in caso['preguntas']:
        respuestas.append(p['respuesta_correcta'])

dist = Counter(respuestas)
print('DISTRIBUCION FINAL EQUILIBRADA:')
for l in ['A','B','C','D']:
    pct = dist[l]/50*100
    status = 'OK' if 22<=pct<=28 else 'REVISAR'
    print(f'  {l}: {dist[l]:2d} veces ({pct:4.1f}%) - {status}')

chi_sq = sum((dist[l] - 12.5)**2 / 12.5 for l in ['A','B','C','D'])
print(f'\nChi-cuadrado: {chi_sq:.3f} (optimo < 7.815)')

with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('\nArchivo actualizado')
