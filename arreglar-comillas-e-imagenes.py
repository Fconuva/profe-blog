#!/usr/bin/env python3
"""
Arreglar comillas malformadas y luego reemplazar imágenes
"""

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

print("🔧 Paso 1: Arreglando comillas malformadas...")

with open(archivo, 'r', encoding='utf-8') as f:
    lineas = f.readlines()

arregladas = 0

for i, linea in enumerate(lineas):
    # Buscar patrones como my-4"> o text-center"> dentro de template strings
    if "my-4\">" in linea or "text-center\">" in linea or "my-4'>" in linea:
        lineas[i] = linea.replace('my-4">', "my-4'>").replace('text-center">', "text-center'>")
        arregladas += 1
        print(f"✅ Línea {i+1}: {linea.strip()[:60]}...")

if arregladas > 0:
    with open(archivo, 'w', encoding='utf-8') as f:
        f.writelines(lineas)
    print(f"\n✅ {arregladas} líneas arregladas")
else:
    print("✅ No se encontraron comillas malformadas")

print("\n🔧 Paso 2: Implementando imágenes...")

# Ahora volver a leer el archivo arreglado
with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

import re

cambios = 0

# Q16: Agua
if 'CADA GOTA CUENTA' in contenido:
    contenido = re.sub(
        r"""<div class='bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg border-4 border-blue-600 my-4 text-center'>.*?Ministerio del Medio Ambiente - Campaña #CuidaElAgua</p>\s*</div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-blue-600 my-4'>
      <img src="imagenes/AGUA SOSTENIBLE.png" alt="Campaña de agua sostenible" class='w-full h-auto mb-3 rounded' />
      <p class='text-xs text-blue-700 text-center'>🌍 Ministerio del Medio Ambiente - Campaña #CuidaElAgua</p>
    </div>""",
        contenido,
        flags=re.DOTALL
    )
    if 'CADA GOTA CUENTA' not in contenido:
        print("✅ Q16 (Agua) reemplazada")
        cambios += 1

# Q17: Reciclaje
if 'CICLO DEL RECICLAJE' in contenido:
    contenido = re.sub(
        r"""<div class='bg-gray-50 p-4 rounded-lg border-2 border-green-500 my-4'>.*?1,5 toneladas de CO₂</p>\s*</div>\s*</div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-green-500 my-4'>
      <img src="imagenes/reciclaje.png" alt="Infografía del ciclo de reciclaje" class='w-full h-auto mb-3 rounded' />
    </div>""",
        contenido,
        flags=re.DOTALL
    )
    if 'CICLO DEL RECICLAJE' not in contenido:
        print("✅ Q17 (Reciclaje) reemplazada")
        cambios += 1

# Q18: CerealMax
if 'CerealMax: 100% natural' in contenido:
    contenido = re.sub(
        r"""<div class='bg-black text-white p-4 rounded-lg my-4'>.*?CerealMax: 100% natural, 0% culpas</p>\s*</div>\s*</div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-yellow-600 my-4'>
      <img src="imagenes/familia sonrie.png" alt="Spot publicitario de CerealMax" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded text-center'>
        <p class='text-sm text-gray-700'>🎬 SPOT TV - 30 SEGUNDOS</p>
        <p class='text-xs text-gray-600 mt-2'>Voz en off: "Recomendado por nutricionistas"</p>
      </div>
    </div>""",
        contenido,
        flags=re.DOTALL
    )
    if 'CerealMax: 100% natural' not in contenido:
        print("✅ Q18 (CerealMax) reemplazada")
        cambios += 1

# Q41: Resultados
if 'RESULTADOS COMPRENSIÓN LECTORA - 2° MEDIO' in contenido:
    contenido = re.sub(
        r"""<div class='bg-white p-4 rounded-lg border-2 border-gray-300 my-4'>.*?Total: 40 estudiantes evaluados</p>\s*</div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-gray-400 my-4'>
      <img src="imagenes/RESULTADOS COMPRENSION LECTORA.png" alt="Resultados de comprensión lectora" class='w-full h-auto mb-3 rounded' />
    </div>""",
        contenido,
        flags=re.DOTALL
    )
    if 'RESULTADOS COMPRENSIÓN LECTORA - 2° MEDIO' not in contenido:
        print("✅ Q41 (Resultados) reemplazada")
        cambios += 1

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print(f"\n✅ COMPLETADO: {cambios} imágenes adicionales implementadas")
