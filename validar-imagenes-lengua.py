#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para validar que todas las imágenes del test de Lengua estén correctas
"""

import re

archivo = "evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk"

# Leer archivo
with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

print("=" * 70)
print("📊 REPORTE DE IMÁGENES - TEST LENGUA Y LITERATURA")
print("=" * 70)
print()

# Buscar imágenes reales (tags <img>)
imagenes_reales = re.findall(r'<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"', contenido)

print(f"✅ IMÁGENES REALES IMPLEMENTADAS: {len(imagenes_reales)}")
print("-" * 70)
for i, (url, alt) in enumerate(imagenes_reales, 1):
    print(f"{i}. {alt}")
    print(f"   URL: {url}")
    print()

# Buscar placeholders problemáticos
placeholders = []

# Buscar "IMAGEN:" en mayúsculas (placeholders antiguos)
if "IMAGEN:" in contenido:
    placeholders.append("❌ Encontré 'IMAGEN:' en mayúsculas (placeholder)")

# Buscar emoji 🎨 sin imagen
patron_emoji_arte = r'<p class="text-4xl[^>]*>🎨</p>'
emoji_arte = re.findall(patron_emoji_arte, contenido)
if emoji_arte:
    placeholders.append(f"❌ Encontré {len(emoji_arte)} emoji 🎨 sin imagen real")

# Buscar franjas de colores (gradientes sin imagen)
patron_franjas = r'grid grid-cols-3 gap-1'
franjas = re.findall(patron_franjas, contenido)
if franjas:
    placeholders.append(f"❌ Encontré {len(franjas)} grid de 3 franjas de colores (placeholder)")

if placeholders:
    print("⚠️  PLACEHOLDERS ENCONTRADOS:")
    print("-" * 70)
    for placeholder in placeholders:
        print(placeholder)
    print()
else:
    print("✅ NO HAY PLACEHOLDERS - TODAS LAS IMÁGENES ESTÁN CORRECTAS")
    print()

# Buscar diseños CSS (que están bien)
disenos_css = []

# Cómics con viñetas
if "VIÑETA 1" in contenido:
    disenos_css.append("✅ Cómic con viñetas (diseño CSS - correcto)")

# Afiches con gradientes
afiches = len(re.findall(r"bg-gradient-to-br from-\w+-\d+", contenido))
if afiches > 0:
    disenos_css.append(f"✅ {afiches} afiches/diseños con gradientes CSS (correcto)")

# Infografías
if "proceso de reciclaje" in contenido or "estructura de un texto argumentativo" in contenido:
    disenos_css.append("✅ Infografías con diagramas CSS (correcto)")

print("📐 DISEÑOS CSS (NO REQUIEREN IMÁGENES REALES):")
print("-" * 70)
for diseno in disenos_css:
    print(diseno)
print()

# Contar preguntas totales
preguntas = len(re.findall(r'id: \d+,', contenido))
print(f"📝 TOTAL DE PREGUNTAS: {preguntas}")
print()

# Conclusión
print("=" * 70)
if not placeholders:
    print("✨ RESULTADO: TODAS LAS IMÁGENES ESTÁN CORRECTAS Y LISTAS PARA DEPLOY")
else:
    print("⚠️  RESULTADO: HAY PLACEHOLDERS QUE NECESITAN SER REEMPLAZADOS")
print("=" * 70)
