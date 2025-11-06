# -*- coding: utf-8 -*-
import json
import random

# Cargar el plan
ruta = 'evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json'
with open(ruta, encoding='utf-8') as f:
    plan = json.load(f)

preguntas = plan['exam']['preguntas']

# Definir distribución objetivo: aproximadamente 25% cada letra
# Para 100 preguntas: 25 A, 25 B, 25 C, 25 D
letras_objetivo = ['A'] * 25 + ['B'] * 25 + ['C'] * 25 + ['D'] * 25
random.shuffle(letras_objetivo)

print('Redistribuyendo respuestas correctas...')
print(f'Total preguntas: {len(preguntas)}')

for i, pregunta in enumerate(preguntas):
    nueva_correcta = letras_objetivo[i]
    
    # Encontrar la alternativa que actualmente es correcta (B)
    alt_correcta_actual = None
    for alt in pregunta['alternativas']:
        if alt['letra'] == pregunta['respuesta_correcta']:
            alt_correcta_actual = alt
            break
    
    # Encontrar la alternativa que será la nueva correcta
    alt_nueva_correcta = None
    for alt in pregunta['alternativas']:
        if alt['letra'] == nueva_correcta:
            alt_nueva_correcta = alt
            break
    
    # Intercambiar los textos
    if alt_correcta_actual and alt_nueva_correcta and nueva_correcta != pregunta['respuesta_correcta']:
        texto_temp = alt_correcta_actual['texto']
        alt_correcta_actual['texto'] = alt_nueva_correcta['texto']
        alt_nueva_correcta['texto'] = texto_temp
    
    # Actualizar respuesta correcta
    pregunta['respuesta_correcta'] = nueva_correcta

# Verificar distribución
from collections import Counter
dist = Counter([p['respuesta_correcta'] for p in preguntas])
print('\nNueva distribución:')
for letra in ['A', 'B', 'C', 'D']:
    print(f'  {letra}: {dist[letra]} preguntas')

# Guardar
with open(ruta, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print(f'\n✅ Respuestas redistribuidas correctamente en {ruta}')
