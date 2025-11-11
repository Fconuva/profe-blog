#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para reemplazar la imagen de Cien años de soledad en el test de Lengua
"""

archivo = "evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk"

# Leer archivo
with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Buscar y reemplazar el bloque completo con las 3 franjas de colores
viejo = """      <div class='bg-white p-6 my-4 rounded">
        <div class='grid grid-cols-3 gap-1">
          <div class='h-20 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
          <div class='h-20 bg-gradient-to-r from-green-700 to-green-500"></div>
          <div class='h-20 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        </div>
        <p class='text-center text-xs mt-4 text-gray-600">🌳🏛️⏳</p>
        <p class='text-center text-xs text-gray-500'>(Árbol genealógico estilizado con líneas que se repiten circularmente)</p>
      </div>"""

nuevo = """      <div class='bg-white p-6 my-4 rounded'>
        <img src="https://images.penguinrandomhouse.com/cover/9780525562443" alt="Portada Cien años de soledad" class='w-full h-64 object-contain mb-4 rounded' />
        <p class='text-center text-xs mt-2 text-gray-600'>🌳 Árbol genealógico circular de los Buendía</p>
      </div>"""

# Contar cuántas veces aparece
count = contenido.count(viejo)
print(f"📊 Encontrado {count} vez(ces) el patrón de las 3 franjas")

if count > 0:
    contenido = contenido.replace(viejo, nuevo)
    
    # Guardar
    with open(archivo, 'w', encoding='utf-8') as f:
        f.write(contenido)
    
    print(f"✅ Imagen de Cien años de soledad reemplazada exitosamente")
else:
    print("❌ No se encontró el patrón. Buscando variaciones...")
    # Intentar buscar solo el div principal
    if "grid grid-cols-3 gap-1" in contenido:
        print("✅ Encontré 'grid grid-cols-3 gap-1' en el archivo")
        # Buscar el índice
        idx = contenido.find("grid grid-cols-3 gap-1")
        print(f"📍 Posición: {idx}")
        print(f"Contexto:\n{contenido[idx-100:idx+300]}")
