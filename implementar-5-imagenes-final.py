#!/usr/bin/env python3
"""
Implementar las 5 imágenes restantes con un enfoque robusto
usando reemplazo línea por línea
"""

import re

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

print("=" * 70)
print("🔧 IMPLEMENTANDO 5 IMÁGENES RESTANTES")
print("=" * 70)

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

cambios = 0

# ====================
# Q14: Unidos somos más (Líneas 372-384)
# ====================
print("\n📝 Q14: Afiche político Unidos somos más")
patron_14 = r"""<div class='bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-lg border-4 border-red-700 my-4[">].*?</div>\s*</div>"""

if re.search(r'¡UNIDOS SOMOS MÁS!', contenido):
    # Buscar y reemplazar todo el bloque
    nuevo_14 = """<div class='bg-white p-6 rounded-lg border-4 border-red-700 my-4'>
      <img src="imagenes/unidos somos mas.png" alt="Afiche de propaganda política" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded'>
        <p class='text-sm text-gray-600'>Fuente: Encuesta interna del partido (500 militantes consultados)</p>
      </div>
    </div>"""
    
    contenido = re.sub(
        r"""<div class='bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-lg border-4 border-red-700 my-4[">].*?Si no votas por nosotros, votas por el caos</p>\s*</div>\s*</div>""",
        nuevo_14,
        contenido,
        flags=re.DOTALL
    )
    
    if '¡UNIDOS SOMOS MÁS!' not in contenido:
        print("✅ Reemplazado")
        cambios += 1
    else:
        print("⚠️  No se pudo reemplazar")
else:
    print("✅ Ya estaba reemplazado")

# ====================
# Q16: Agua sostenible
# ====================
print("\n📝 Q16: Campaña de agua sostenible")

if 'CADA GOTA CUENTA' in contenido:
    nuevo_16 = """<div class='bg-white p-6 rounded-lg border-4 border-blue-600 my-4'>
      <img src="imagenes/AGUA SOSTENIBLE.png" alt="Campaña de agua sostenible" class='w-full h-auto mb-3 rounded' />
      <p class='text-xs text-blue-700 text-center'>🌍 Ministerio del Medio Ambiente - Campaña #CuidaElAgua</p>
    </div>"""
    
    contenido = re.sub(
        r"""<div class='bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg border-4 border-blue-600 my-4 text-center['>].*?Campaña #CuidaElAgua</p>\s*</div>""",
        nuevo_16,
        contenido,
        flags=re.DOTALL
    )
    
    if 'CADA GOTA CUENTA' not in contenido:
        print("✅ Reemplazado")
        cambios += 1
    else:
        print("⚠️  No se pudo reemplazar")
else:
    print("✅ Ya estaba reemplazado")

# ====================
# Q17: Reciclaje
# ====================
print("\n📝 Q17: Infografía de reciclaje")

if 'CICLO DEL RECICLAJE DE PLÁSTICO' in contenido:
    nuevo_17 = """<div class='bg-white p-6 rounded-lg border-4 border-green-500 my-4'>
      <img src="imagenes/reciclaje.png" alt="Infografía del ciclo de reciclaje" class='w-full h-auto mb-3 rounded' />
    </div>"""
    
    contenido = re.sub(
        r"""<div class='bg-gray-50 p-4 rounded-lg border-2 border-green-500 my-4['>].*?1,5 toneladas de CO₂</p>\s*</div>\s*</div>""",
        nuevo_17,
        contenido,
        flags=re.DOTALL
    )
    
    if 'CICLO DEL RECICLAJE DE PLÁSTICO' not in contenido:
        print("✅ Reemplazado")
        cambios += 1
    else:
        print("⚠️  No se pudo reemplazar")
else:
    print("✅ Ya estaba reemplazado")

# ====================
# Q18: CerealMax
# ====================
print("\n📝 Q18: Spot publicitario CerealMax")

if 'CerealMax' in contenido and 'SPOT TV' in contenido:
    nuevo_18 = """<div class='bg-white p-6 rounded-lg border-4 border-yellow-600 my-4'>
      <img src="imagenes/familia sonrie.png" alt="Spot publicitario de CerealMax" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded text-center'>
        <p class='text-sm text-gray-700'>🎬 SPOT TV - 30 SEGUNDOS</p>
        <p class='text-xs text-gray-600 mt-2'>Voz en off: "Recomendado por nutricionistas"</p>
      </div>
    </div>"""
    
    contenido = re.sub(
        r"""<div class='bg-black text-white p-4 rounded-lg my-4['>].*?CerealMax: 100% natural, 0% culpas</p>\s*</div>\s*</div>""",
        nuevo_18,
        contenido,
        flags=re.DOTALL
    )
    
    # Verificar si se reemplazó buscando el texto antiguo
    if 'bg-black text-white p-4 rounded-lg my-4' not in contenido or 'CerealMax: 100% natural' not in contenido:
        print("✅ Reemplazado")
        cambios += 1
    else:
        print("⚠️  No se pudo reemplazar")
else:
    print("✅ Ya estaba reemplazado")

# ====================
# Q41: Resultados comprensión lectora
# ====================
print("\n📝 Q41: Resultados comprensión lectora")

if 'RESULTADOS COMPRENSIÓN LECTORA - 2° MEDIO' in contenido:
    nuevo_41 = """<div class='bg-white p-6 rounded-lg border-4 border-gray-400 my-4'>
      <img src="imagenes/RESULTADOS COMPRENSION LECTORA.png" alt="Resultados de comprensión lectora" class='w-full h-auto mb-3 rounded' />
    </div>"""
    
    contenido = re.sub(
        r"""<div class='bg-white p-4 rounded-lg border-2 border-gray-300 my-4['>].*?Total: 40 estudiantes evaluados</p>\s*</div>""",
        nuevo_41,
        contenido,
        flags=re.DOTALL
    )
    
    if 'RESULTADOS COMPRENSIÓN LECTORA - 2° MEDIO' not in contenido:
        print("✅ Reemplazado")
        cambios += 1
    else:
        print("⚠️  No se pudo reemplazar")
else:
    print("✅ Ya estaba reemplazado")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n" + "=" * 70)
print(f"✅ COMPLETADO: {cambios} imágenes reemplazadas")
print("=" * 70)
print(f"📝 Archivo: {archivo}")
print("\n🔍 Validar con: python validar-sintaxis-js.py")
