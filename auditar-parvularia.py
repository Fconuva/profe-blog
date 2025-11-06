# -*- coding: utf-8 -*-
import json
from collections import Counter

# Cargar el plan
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', encoding='utf-8') as f:
    plan = json.load(f)

preguntas = plan['exam']['preguntas']
print('=' * 80)
print('AUDITORÍA EVALUACIÓN PARVULARIA (parv-nt)')
print('=' * 80)

# 1. COBERTURA DEL TEMARIO
print('\n1. COBERTURA DEL TEMARIO')
print('-' * 80)
nucleos = {}
ambitos = {}
for p in preguntas:
    nucleo = p['nucleo']
    ambito = p['ambito']
    nucleos[nucleo] = nucleos.get(nucleo, 0) + 1
    ambitos[ambito] = ambitos.get(ambito, 0) + 1

print('Por Núcleo:')
for nucleo, count in sorted(nucleos.items()):
    print(f'  {nucleo}: {count} preguntas')

print('\nPor Ámbito:')
for ambito, count in sorted(ambitos.items()):
    print(f'  {ambito}: {count} preguntas')

print(f'\nTotal preguntas: {len(preguntas)}')

# 2. DISTRIBUCIÓN DE RESPUESTAS CORRECTAS
print('\n2. DISTRIBUCIÓN DE RESPUESTAS CORRECTAS')
print('-' * 80)
respuestas = [p['respuesta_correcta'] for p in preguntas]
dist = Counter(respuestas)
print('Distribución:')
total = len(preguntas)
for letra in ['A', 'B', 'C', 'D']:
    count = dist.get(letra, 0)
    porcentaje = (count/total)*100
    barra = '█' * int(porcentaje/2)
    print(f'  {letra}: {count:3d} ({porcentaje:5.1f}%) {barra}')

ideal = total / 4
desviacion_max = max(abs(dist.get(l, 0) - ideal) for l in ['A', 'B', 'C', 'D'])
if desviacion_max > ideal * 0.3:  # Si hay más de 30% de desviación
    print('  ⚠️  ADVERTENCIA: Distribución desequilibrada')
else:
    print('  ✅ Distribución aceptable')

# 3. EXTENSIÓN DE ALTERNATIVAS
print('\n3. ANÁLISIS DE EXTENSIÓN DE ALTERNATIVAS')
print('-' * 80)
problemas_extension = []
for p in preguntas:
    longitudes = [len(alt['texto']) for alt in p['alternativas']]
    max_long = max(longitudes)
    min_long = min(longitudes)
    ratio = max_long / min_long if min_long > 0 else 999
    if ratio > 2.5:  # Si la más larga es 2.5x la más corta
        problemas_extension.append({
            'id': p['id'],
            'num': p['numero'],
            'ratio': ratio,
            'longitudes': longitudes
        })

if problemas_extension:
    print(f'⚠️  {len(problemas_extension)} preguntas con posible desequilibrio:')
    for prob in problemas_extension[:10]:
        print(f'  Pregunta {prob["num"]} ({prob["id"]}): ratio {prob["ratio"]:.1f}x, longitudes {prob["longitudes"]}')
else:
    print('✅ Todas las alternativas tienen extensión equilibrada')

# 4. VERIFICAR QUE TODAS TIENEN 4 ALTERNATIVAS
print('\n4. VERIFICACIÓN DE ALTERNATIVAS')
print('-' * 80)
problemas_alt = []
for p in preguntas:
    num_alt = len(p['alternativas'])
    if num_alt != 4:
        problemas_alt.append({'id': p['id'], 'num': p['numero'], 'cant': num_alt})
    
    # Verificar que sean A, B, C, D
    letras = [alt['letra'] for alt in p['alternativas']]
    if letras != ['A', 'B', 'C', 'D']:
        print(f'  ⚠️  Pregunta {p["numero"]}: letras incorrectas {letras}')

if problemas_alt:
    print(f'⚠️  {len(problemas_alt)} preguntas sin 4 alternativas:')
    for prob in problemas_alt:
        print(f'  Pregunta {prob["num"]}: {prob["cant"]} alternativas')
else:
    print('✅ Todas las preguntas tienen exactamente 4 alternativas (A, B, C, D)')

# 5. PROMPTS IA
print('\n5. PROMPTS DE IA')
print('-' * 80)
prompts = plan['metadata']['prompts_ia']
print(f'Total prompts: {len(prompts)}')
print('Prompts disponibles:')
for key in prompts.keys():
    longitud = len(prompts[key])
    print(f'  - {key}: {longitud} caracteres')

# Verificar que mencionen "parvularia" o conceptos específicos
print('\nVerificación de especificidad:')
keywords_parvularia = ['parvularia', 'NT1', 'NT2', 'Bases Curriculares', 'niño', 'niña', 'primera infancia']
for key, prompt in prompts.items():
    tiene_keyword = any(kw.lower() in prompt.lower() for kw in keywords_parvularia)
    if tiene_keyword:
        print(f'  ✅ {key}: específico para parvularia')
    else:
        print(f'  ⚠️  {key}: podría ser más específico')

# 6. OBJETIVIDAD DE PREGUNTAS
print('\n6. OBJETIVIDAD DE PREGUNTAS')
print('-' * 80)
print('Verificando que todas las preguntas tengan explicación...')
sin_explicacion = [p['numero'] for p in preguntas if not p.get('explicacion') or len(p['explicacion']) < 50]
if sin_explicacion:
    print(f'⚠️  {len(sin_explicacion)} preguntas sin explicación adecuada: {sin_explicacion[:10]}')
else:
    print('✅ Todas las preguntas tienen explicación pedagógica')

# Verificar temas relacionados
sin_temas = [p['numero'] for p in preguntas if not p.get('temas_relacionados') or len(p['temas_relacionados']) == 0]
if sin_temas:
    print(f'⚠️  {len(sin_temas)} preguntas sin temas relacionados: {sin_temas[:10]}')
else:
    print('✅ Todas las preguntas tienen temas relacionados')

# 7. RESUMEN FINAL
print('\n' + '=' * 80)
print('RESUMEN DE AUDITORÍA')
print('=' * 80)
print(f'✅ Total preguntas: {len(preguntas)}/100')
print(f'✅ Núcleos cubiertos: {len(nucleos)}')
print(f'✅ Prompts IA: {len(prompts)}')
print(f'{"✅" if desviacion_max <= ideal * 0.3 else "⚠️ "} Distribución respuestas: {"Equilibrada" if desviacion_max <= ideal * 0.3 else "Desequilibrada"}')
print(f'{"✅" if len(problemas_extension) == 0 else "⚠️ "} Extensión alternativas: {"OK" if len(problemas_extension) == 0 else f"{len(problemas_extension)} con desequilibrio"}')
print(f'{"✅" if len(sin_explicacion) == 0 else "⚠️ "} Explicaciones: {"Completas" if len(sin_explicacion) == 0 else f"{len(sin_explicacion)} incompletas"}')
print('=' * 80)
