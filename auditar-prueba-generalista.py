import json
from collections import Counter

# Cargar datos
with open('prueba-basica-generalista-datos.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("="*60)
print("AUDITORÍA DE PRUEBA BÁSICA GENERALISTA")
print("="*60)

# 1. Distribución de respuestas correctas
respuestas = [p['correcta'] for p in data['preguntas']]
counter = Counter(respuestas)

print("\n📊 DISTRIBUCIÓN DE RESPUESTAS CORRECTAS:")
print("-" * 60)
for k, v in sorted(counter.items()):
    porcentaje = v/30*100
    barra = "█" * int(porcentaje/5)
    print(f"{k}: {v:2d} veces ({porcentaje:5.1f}%) {barra}")

# Verificar si hay sesgo
if max(counter.values()) > 10:
    print(f"\n⚠️  PROBLEMA: Respuesta '{max(counter, key=counter.get)}' aparece {max(counter.values())} veces (>{33.3:.1f}%)")
    print("   → Distribución NO equilibrada")
else:
    print("\n✅ Distribución equilibrada (ninguna respuesta >10 apariciones)")

# 2. Análisis de longitud de alternativas
print("\n" + "="*60)
print("📏 ANÁLISIS DE LONGITUD DE ALTERNATIVAS (primeras 10 preguntas)")
print("="*60)

problemas_longitud = 0
for i, p in enumerate(data['preguntas'][:10], 1):
    longitudes = {alt['op']: len(alt['texto']) for alt in p['alternativas']}
    correcta = p['correcta']
    long_correcta = longitudes[correcta]
    long_otras = [v for k, v in longitudes.items() if k != correcta]
    promedio_otras = sum(long_otras) / len(long_otras)
    
    # Detectar si la correcta es >50% más larga
    if long_correcta > promedio_otras * 1.5:
        print(f"\n❌ PREGUNTA {i} - RESPUESTA OBVIA POR LONGITUD:")
        print(f"   Correcta ({correcta}): {long_correcta} chars")
        print(f"   Otras promedio: {promedio_otras:.0f} chars")
        print(f"   Diferencia: +{((long_correcta/promedio_otras - 1)*100):.0f}%")
        for alt in p['alternativas']:
            marca = "✓ CORRECTA" if alt['op'] == correcta else ""
            print(f"   {alt['op']}: {len(alt['texto']):3d} chars {marca}")
        problemas_longitud += 1
    else:
        diferencias = [f"{k}={v}" for k, v in longitudes.items()]
        print(f"✅ Pregunta {i}: {', '.join(diferencias)} (Correcta: {correcta})")

print(f"\n{'='*60}")
if problemas_longitud > 0:
    print(f"⚠️  TOTAL PROBLEMAS DE LONGITUD: {problemas_longitud}/10 preguntas")
    print("   Recomendación: Equilibrar longitud de alternativas")
else:
    print("✅ No se detectaron problemas de longitud en las primeras 10")

# 3. Detectar patrones de palabras clave en correctas
print("\n" + "="*60)
print("🔍 ANÁLISIS DE PALABRAS CLAVE EN RESPUESTAS CORRECTAS")
print("="*60)

palabras_sospechosas = ['todos', 'siempre', 'nunca', 'más', 'mejor', 'completo', 'integral']
for palabra in palabras_sospechosas:
    count = 0
    for p in data['preguntas']:
        correcta_texto = next(alt['texto'] for alt in p['alternativas'] if alt['op'] == p['correcta'])
        if palabra.lower() in correcta_texto.lower():
            count += 1
    if count > 5:
        print(f"⚠️  '{palabra}' aparece en {count} respuestas correctas")

print("\n" + "="*60)
print("CONCLUSIÓN")
print("="*60)
