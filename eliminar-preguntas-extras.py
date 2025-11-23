#!/usr/bin/env python3
"""
Eliminar preguntas 51-58 del JSON y actualizar totalPreguntas a 50
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("🧹 Eliminando preguntas 51-58...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# 1. Encontrar y eliminar preguntas 51-58 completas
# Buscar desde "id": "parv-51" hasta el cierre de esa pregunta
for num in range(51, 59):  # 51 a 58
    # Patrón: toda la pregunta desde { "id": "parv-XX" hasta }  (con posible coma después)
    patron = r',?\s*\{\s*"id":\s*"parv-' + str(num) + r'"[\s\S]*?"temas_relacionados":\s*\[[^\]]*\]\s*\}'
    contenido = re.sub(patron, '', contenido)
    print(f"✅ Eliminada pregunta {num}")

# 2. Cambiar totalPreguntas de 58 a 50
contenido = re.sub(r'totalPreguntas:\s*58', 'totalPreguntas: 50', contenido)
print("\n✅ Actualizado totalPreguntas: 58 → 50")

# 3. Cambiar todas las referencias 58 a 50 en el código JavaScript
contenido = re.sub(r'/58\s+respondidas', '/50 respondidas', contenido)
contenido = re.sub(r'\(count\s*/\s*58\)', '(count / 50)', contenido)
print("✅ Actualizado cálculo de progreso: / 58 → / 50")

# Verificar
preguntas_final = len(re.findall(r'"id":\s*"parv-\d+"', contenido))
print(f"\n📊 Total de preguntas en JSON: {preguntas_final}")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print(f"\n✅ Archivo corregido")
print(f"📁 {archivo}")
print("\n🚀 Próximo paso: npm run build")
