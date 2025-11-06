# -*- coding: utf-8 -*-
import json

# Cargar el plan
ruta = 'evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json'
with open(ruta, encoding='utf-8') as f:
    plan = json.load(f)

preguntas = plan['exam']['preguntas']

print('Equilibrando extensión de alternativas...')
print(f'Total preguntas: {len(preguntas)}\n')

problemas_corregidos = 0

for p in preguntas:
    alternativas = p['alternativas']
    longitudes = [len(alt['texto']) for alt in alternativas]
    max_long = max(longitudes)
    min_long = min(longitudes)
    ratio = max_long / min_long if min_long > 0 else 999
    
    if ratio > 2.5:  # Si hay desequilibrio
        # Encontrar la alternativa correcta
        correcta_letra = p['respuesta_correcta']
        correcta = next((alt for alt in alternativas if alt['letra'] == correcta_letra), None)
        
        if correcta and len(correcta['texto']) == max_long:
            # La correcta es la más larga - acortar o alargar otras
            target_length = max_long * 0.7  # Objetivo: 70% de la correcta
            
            for alt in alternativas:
                if alt['letra'] != correcta_letra:
                    texto_actual = alt['texto']
                    long_actual = len(texto_actual)
                    
                    if long_actual < target_length:
                        # Alargar agregando detalles
                        if not texto_actual.endswith('.'):
                            texto_actual += '.'
                        
                        # Agregar especificidad según el contexto
                        if 'sin' in texto_actual.lower() or 'no' in texto_actual.lower():
                            if long_actual < target_length * 0.6:
                                alt['texto'] = texto_actual + ' Esta práctica ignora las características individuales de cada niño/a.'
                        elif 'solo' in texto_actual.lower() or 'únicamente' in texto_actual.lower():
                            if long_actual < target_length * 0.6:
                                alt['texto'] = texto_actual + ' Este enfoque limita las oportunidades de aprendizaje integral.'
                        elif 'esperar' in texto_actual.lower() or 'dejar' in texto_actual.lower():
                            if long_actual < target_length * 0.6:
                                alt['texto'] = texto_actual + ' Sin mediación intencional se pierden oportunidades educativas.'
                        else:
                            # Agregar explicación genérica si es muy corta
                            if long_actual < target_length * 0.5:
                                alt['texto'] = texto_actual + ' Sin embargo, esta estrategia no considera el enfoque pedagógico recomendado.'
            
            problemas_corregidos += 1

print(f'✅ {problemas_corregidos} preguntas ajustadas')

# Verificar mejora
print('\nVerificando mejora...')
problemas_restantes = 0
for p in preguntas:
    longitudes = [len(alt['texto']) for alt in p['alternativas']]
    max_long = max(longitudes)
    min_long = min(longitudes)
    ratio = max_long / min_long if min_long > 0 else 999
    if ratio > 2.5:
        problemas_restantes += 1

print(f'Preguntas con desequilibrio >2.5x: {problemas_restantes}')

# Guardar
with open(ruta, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print(f'\n✅ Alternativas equilibradas en {ruta}')
