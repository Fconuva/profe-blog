#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para actualizar las imágenes del test de Lengua una vez generadas con IA
"""

import os
import sys

# Configuración
IMAGEN_DORIAN = "evaluaciones/educacion-media/pruebas/lengua-literatura-media/imagenes/dorian-gray-retrato-deteriorado.jpg"
IMAGEN_CIEN_ANOS = "evaluaciones/educacion-media/pruebas/lengua-literatura-media/imagenes/cien-anos-soledad-portada.jpg"
ARCHIVO_TEST = "evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk"

print("=" * 70)
print("🎨 IMPLEMENTADOR DE IMÁGENES - TEST LENGUA Y LITERATURA")
print("=" * 70)
print()

# Verificar si las imágenes existen
imagenes_encontradas = []
imagenes_faltantes = []

if os.path.exists(IMAGEN_DORIAN):
    imagenes_encontradas.append("✅ Dorian Gray retrato deteriorado")
    tamaño = os.path.getsize(IMAGEN_DORIAN) / 1024  # KB
    print(f"✅ Dorian Gray encontrado ({tamaño:.1f} KB)")
else:
    imagenes_faltantes.append("❌ dorian-gray-retrato-deteriorado.jpg")
    print("❌ Dorian Gray NO encontrado")

if os.path.exists(IMAGEN_CIEN_ANOS):
    imagenes_encontradas.append("✅ Cien años de soledad portada")
    tamaño = os.path.getsize(IMAGEN_CIEN_ANOS) / 1024  # KB
    print(f"✅ Cien años de soledad encontrado ({tamaño:.1f} KB)")
else:
    print("⚠️  Cien años de soledad NO encontrado (OPCIONAL - usando URL externa)")

print()

if imagenes_faltantes:
    print("=" * 70)
    print("⚠️  FALTAN IMÁGENES:")
    print("=" * 70)
    for img in imagenes_faltantes:
        print(img)
    print()
    print("📋 Para generar las imágenes:")
    print("1. Abre Grok AI, DALL-E, Midjourney o Stable Diffusion")
    print("2. Usa los prompts del archivo IMAGENES-IA-LENGUA.md")
    print("3. Descarga las imágenes y guárdalas en:")
    print("   evaluaciones/educacion-media/pruebas/lengua-literatura-media/imagenes/")
    print("4. Vuelve a ejecutar este script")
    print()
    sys.exit(1)

# Si llegamos aquí, al menos Dorian Gray existe
print("=" * 70)
print("✅ LISTO PARA ACTUALIZAR CÓDIGO")
print("=" * 70)
print()

# Leer archivo actual
with open(ARCHIVO_TEST, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Patrón viejo (diseño CSS actual)
patron_viejo = """'<div class="bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 p-6 rounded mb-2 relative overflow-hidden">' +
      '<div class="absolute top-0 left-0 w-full h-full opacity-30">' +
      '<div class="w-32 h-32 bg-green-900 rounded-full blur-3xl absolute top-4 left-4"></div>' +
      '<div class="w-24 h-24 bg-yellow-800 rounded-full blur-2xl absolute bottom-6 right-6"></div>' +
      '</div>' +
      '<div class="relative text-center py-8">' +
      '<p class="text-6xl mb-4">🖼️</p>' +
      '<p class="text-white text-sm italic">"El retrato que envejece mientras el rostro permanece joven"</p>' +
      '<p class="text-gray-300 text-xs mt-2">- Oscar Wilde, El retrato de Dorian Gray -</p>' +
      '</div>' +
      '</div>'"""

# Patrón nuevo (con imagen real)
patron_nuevo = """'<img src="/evaluaciones/educacion-media/pruebas/lengua-literatura-media/imagenes/dorian-gray-retrato-deteriorado.jpg" alt="El retrato de Dorian Gray deteriorado" class="w-full h-48 object-cover rounded mb-2" />'"""

if patron_viejo in contenido:
    print("🔄 Reemplazando diseño CSS con imagen real...")
    contenido = contenido.replace(patron_viejo, patron_nuevo)
    
    # Guardar
    with open(ARCHIVO_TEST, 'w', encoding='utf-8') as f:
        f.write(contenido)
    
    print("✅ Código actualizado correctamente")
    print()
    print("=" * 70)
    print("📝 PRÓXIMOS PASOS:")
    print("=" * 70)
    print("1. Validar sintaxis:")
    print(f"   python validar-sintaxis-js.py {ARCHIVO_TEST}")
    print()
    print("2. Commit y deploy:")
    print('   git add .')
    print('   git commit -m "feat: AGREGAR imagen real Dorian Gray generada con IA"')
    print('   git push origin main')
    print()
else:
    print("⚠️  No se encontró el patrón CSS a reemplazar")
    print("El código ya podría estar actualizado o haber cambiado")
    print()
