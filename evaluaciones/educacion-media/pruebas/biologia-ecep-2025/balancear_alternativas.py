#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Balancear distribución de alternativas correctas: 13-13-13-13"""

import json

with open('plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Contar distribución actual
dist = {'a': 0, 'b': 0, 'c': 0, 'd': 0}
preguntas_por_letra = {'a': [], 'b': [], 'c': [], 'd': []}

for q in data['questions']:
    for opt in q['options']:
        if opt['isCorrect']:
            letra = opt['id']
            dist[letra] += 1
            preguntas_por_letra[letra].append(q['id'])

print("Distribución ANTES del ajuste:")
print(f"  A: {dist['a']} (preguntas: {preguntas_por_letra['a']})")
print(f"  B: {dist['b']} (preguntas: {preguntas_por_letra['b']})")
print(f"  C: {dist['c']} (preguntas: {preguntas_por_letra['c']})")
print(f"  D: {dist['d']} (preguntas: {preguntas_por_letra['d']})")
print()

# Necesito: A=13, B=13, C=13, D=13
# Actual: A=13, B=13, C=17, D=9
# Acción: Mover 4 preguntas de C → D

# Elegir últimas 4 preguntas con C correcta (P30, P40, P45, P49)
preguntas_c = preguntas_por_letra['c']
cambiar_a_d = preguntas_c[-4:]  # Últimas 4

print(f"Cambiando respuesta correcta de C → D en preguntas: {cambiar_a_d}")
print()

for pid in cambiar_a_d:
    idx = pid - 1
    # Intercambiar isCorrect entre opción C y D
    for opt in data['questions'][idx]['options']:
        if opt['id'] == 'c':
            # Guardar datos de C
            texto_c = opt['text']
            feedback_c = opt['feedback']
            opt['isCorrect'] = False
            # Modificar feedback para indicar incorrecta
            if feedback_c.startswith('✅'):
                opt['feedback'] = feedback_c.replace('✅ Correcta.', '❌ Incorrecta.')
        elif opt['id'] == 'd':
            # Guardar datos de D
            texto_d = opt['text']
            feedback_d = opt['feedback']
            opt['isCorrect'] = True
            # Modificar feedback para indicar correcta
            if feedback_d.startswith('❌'):
                opt['feedback'] = feedback_d.replace('❌ Incorrecta.', '✅ Correcta.')
    
    # Intercambiar TEXTOS también (para mantener coherencia)
    for opt in data['questions'][idx]['options']:
        if opt['id'] == 'c':
            texto_original_c = texto_c
        elif opt['id'] == 'd':
            texto_original_d = texto_d
    
    # Swap textos
    for opt in data['questions'][idx]['options']:
        if opt['id'] == 'c':
            opt['text'] = texto_original_d
            # Ajustar feedback
            opt['feedback'] = f"❌ Incorrecta. Revisar conceptos sobre {data['questions'][idx]['domain']}."
        elif opt['id'] == 'd':
            opt['text'] = texto_original_c
            # Mantener feedback correcta original de C
            opt['feedback'] = feedback_c.replace('❌ Incorrecta.', '✅ Correcta.')

# Verificar nueva distribución
dist_nueva = {'a': 0, 'b': 0, 'c': 0, 'd': 0}
for q in data['questions']:
    for opt in q['options']:
        if opt['isCorrect']:
            dist_nueva[opt['id']] += 1

print("Distribución DESPUÉS del ajuste:")
print(f"  A: {dist_nueva['a']} (25.0%)")
print(f"  B: {dist_nueva['b']} (25.0%)")
print(f"  C: {dist_nueva['c']} ({dist_nueva['c']/52*100:.1f}%)")
print(f"  D: {dist_nueva['d']} (25.0%)")
print()

if dist_nueva['a'] == 13 and dist_nueva['b'] == 13 and dist_nueva['c'] == 13 and dist_nueva['d'] == 13:
    print("✅ DISTRIBUCIÓN PERFECTA: 13-13-13-13 (25% cada alternativa)")
    # Guardar
    with open('plan.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("✅ Guardado plan.json con distribución balanceada")
else:
    print("❌ ERROR: Distribución no quedó 13-13-13-13")
    print(f"   Resultado: {dist_nueva}")
