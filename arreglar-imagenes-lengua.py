#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para reemplazar las imágenes placeholder con imágenes reales en el test de Lengua
"""

import re

archivo = "evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk"

# Leer archivo
with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# REEMPLAZO 1: Árbol genealógico de Cien años de soledad
patron_cien_anos = r"""      <div class='bg-white p-6 my-4 rounded'>
        <div class='grid grid-cols-3 gap-1'>
          <div class='h-20 bg-gradient-to-r from-yellow-600 to-yellow-400'></div>
          <div class='h-20 bg-gradient-to-r from-green-700 to-green-500'></div>
          <div class='h-20 bg-gradient-to-r from-blue-600 to-blue-400'></div>
        </div>
        <p class='text-center text-xs mt-4 text-gray-600'>🌳🏛️⏳</p>
        <p class='text-center text-xs text-gray-500'>\(Árbol genealógico estilizado con líneas que se repiten circularmente\)</p>
      </div>"""

reemplazo_cien_anos = """      <div class='bg-white p-6 my-4 rounded'>
        <img src="https://images.penguinrandomhouse.com/cover/9780525562443" alt="Portada Cien años de soledad" class='w-full h-64 object-contain mb-4 rounded' />
        <p class='text-center text-xs mt-2 text-gray-600'>🌳 Árbol genealógico circular de los Buendía</p>
      </div>"""

contenido = re.sub(patron_cien_anos, reemplazo_cien_anos, contenido)

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("✅ Imagen de Cien años de soledad reemplazada")
print("✅ Total de reemplazos realizados")
