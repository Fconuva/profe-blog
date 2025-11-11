#!/usr/bin/env python3
"""
SCRIPT DEFINITIVO: Reemplaza TODAS las imágenes CSS por PNG reales
"""

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

print("=" * 70)
print("🔧 IMPLEMENTACIÓN DEFINITIVA DE IMÁGENES PNG")
print("=" * 70)

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

cambios = 0

# ====================
# Q8: Dorian Gray
# ====================
print("\n📝 Q8: Dorian Gray meme")
if "El retrato que envejece mientras el rostro permanece joven" in contenido:
    patron = (
        '<div class="bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 p-6 rounded mb-2 relative overflow-hidden">' +
        '<div class="absolute top-0 left-0 w-full h-full opacity-30">' +
        '<div class="w-32 h-32 bg-green-900 rounded-full blur-3xl absolute top-4 left-4"></div>' +
        '<div class="w-24 h-24 bg-yellow-800 rounded-full blur-2xl absolute bottom-6 right-6"></div>' +
        '</div>' +
        '<div class="relative text-center py-8">' +
        '<p class="text-6xl mb-4">🖼️</p>' +
        '<p class="text-white text-sm italic">"El retrato que envejece mientras el rostro permanece joven"</p>' +
        '<p class="text-gray-300 text-xs mt-2">- Oscar Wilde, El retrato de Dorian Gray -</p>' +
        '</div>' +
        '</div>'
    )
    reemplazo = '<img src="imagenes/retroato dorian grey.png" alt="Meme de Dorian Gray" class="w-full h-auto mb-2 rounded" />'
    contenido = contenido.replace(patron, reemplazo)
    print("✅ Reemplazado")
    cambios += 1
else:
    print("⚠️  Ya estaba reemplazado o no encontrado")

# ====================
# Q10: Cien años
# ====================
print("\n📝 Q10: Portada Cien años")
if "https://images.penguinrandomhouse.com" in contenido:
    contenido = contenido.replace(
        '<img src="https://images.penguinrandomhouse.com/cover/9780525562443" alt="Portada Cien años de soledad" class=\'w-full h-64 object-contain mb-4 rounded\' />',
        '<img src="imagenes/portada cien años.png" alt="Portada Cien años de soledad" class=\'w-full h-auto object-contain mb-4 rounded\' />'
    )
    print("✅ Reemplazado")
    cambios += 1
else:
    print("⚠️  Ya estaba reemplazado o no encontrado")

# ====================
# Q14: Unidos somos más
# ====================
print("\n📝 Q14: Afiche político")
if "¡UNIDOS SOMOS MÁS!" in contenido:
    patron_14 = """<div class='bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-lg border-4 border-red-700 my-4'>
      <div class='text-center'>
        <div class='text-6xl mb-3'>✊</div>
        <h3 class='text-4xl font-bold text-red-900 mb-3'>¡UNIDOS SOMOS MÁS!</h3>
        <div class='bg-white p-4 rounded-lg mb-3'>
          <p class='text-lg font-semibold text-gray-800'>📊 El 87% de los ciudadanos apoya nuestro proyecto</p>
          <p class='text-sm text-gray-600 mt-2'>Fuente: Encuesta interna del partido (500 militantes consultados)</p>
        </div>
        <p class='text-xl text-red-800 font-bold'>Vota por el CAMBIO. Vota por nosotros.</p>
        <p class='text-sm text-red-700 mt-2'>Si no votas por nosotros, votas por el caos</p>
      </div>
    </div>"""
    
    reemplazo_14 = """<div class='bg-white p-6 rounded-lg border-4 border-red-700 my-4'>
      <img src="imagenes/unidos somos mas.png" alt="Afiche de propaganda política" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded'>
        <p class='text-sm text-gray-600'>Fuente: Encuesta interna del partido (500 militantes consultados)</p>
      </div>
    </div>"""
    
    contenido = contenido.replace(patron_14, reemplazo_14)
    print("✅ Reemplazado")
    cambios += 1
else:
    print("⚠️  Ya estaba reemplazado o no encontrado")

# ====================
# Q16: Agua sostenible
# ====================
print("\n📝 Q16: Campaña de agua")
if "CADA GOTA CUENTA" in contenido:
    patron_16 = """<div class='bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg border-4 border-blue-600 my-4 text-center'>
      <div class='text-5xl mb-3'>💧</div>
      <h3 class='text-3xl font-bold text-blue-900 mb-2'>CADA GOTA CUENTA</h3>
      <p class='text-lg text-blue-800 mb-3'>El agua es vida. No la desperdicies.</p>
      <div class='bg-white p-3 rounded-lg inline-block'>
        <p class='text-sm text-gray-700'>🚿 Cierra la llave mientras te enjabonas</p>
        <p class='text-sm text-gray-700'>⏱️ Duchas cortas: máximo 5 minutos</p>
        <p class='text-sm text-gray-700'>🔧 Repara filtraciones inmediatamente</p>
      </div>
      <p class='text-xs text-blue-600 mt-3'>Ministerio del Medio Ambiente - Campaña #CuidaElAgua</p>
    </div>"""
    
    reemplazo_16 = """<div class='bg-white p-6 rounded-lg border-4 border-blue-600 my-4'>
      <img src="imagenes/AGUA SOSTENIBLE.png" alt="Campaña de agua sostenible" class='w-full h-auto mb-3 rounded' />
      <p class='text-xs text-blue-700 text-center'>🌍 Ministerio del Medio Ambiente - Campaña #CuidaElAgua</p>
    </div>"""
    
    contenido = contenido.replace(patron_16, reemplazo_16)
    print("✅ Reemplazado")
    cambios += 1
else:
    print("⚠️  Ya estaba reemplazado o no encontrado")

# ====================
# Q17: Reciclaje
# ====================
print("\n📝 Q17: Infografía de reciclaje")
if "CICLO DEL RECICLAJE DE PLÁSTICO" in contenido:
    patron_17 = """<div class='bg-gray-50 p-4 rounded-lg border-2 border-green-500 my-4'>
      <h4 class='text-center font-bold text-green-800 mb-3'>♻️ CICLO DEL RECICLAJE DE PLÁSTICO</h4>
      <div class='grid grid-cols-4 gap-2 text-center text-xs'>
        <div class='bg-blue-100 p-2 rounded'>
          <div class='text-2xl mb-1'>🗑️</div>
          <p class='font-semibold'>1. RECOLECCIÓN</p>
          <p class='text-gray-600'>Separación en hogares</p>
        </div>
        <div class='bg-yellow-100 p-2 rounded'>
          <div class='text-2xl mb-1'>🏭</div>
          <p class='font-semibold'>2. CLASIFICACIÓN</p>
          <p class='text-gray-600'>Por tipo de plástico</p>
        </div>
        <div class='bg-orange-100 p-2 rounded'>
          <div class='text-2xl mb-1'>⚙️</div>
          <p class='font-semibold'>3. PROCESAMIENTO</p>
          <p class='text-gray-600'>Triturado y limpieza</p>
        </div>
        <div class='bg-green-100 p-2 rounded'>
          <div class='text-2xl mb-1'>📦</div>
          <p class='font-semibold'>4. NUEVO PRODUCTO</p>
          <p class='text-gray-600'>Reutilización</p>
        </div>
      </div>
      <div class='bg-green-50 p-2 rounded mt-3 text-center'>
        <p class='text-xs text-green-800'><strong>Dato:</strong> 1 tonelada de plástico reciclado ahorra 1,5 toneladas de CO₂</p>
      </div>
    </div>"""
    
    reemplazo_17 = """<div class='bg-white p-6 rounded-lg border-4 border-green-500 my-4'>
      <img src="imagenes/reciclaje.png" alt="Infografía del ciclo de reciclaje" class='w-full h-auto mb-3 rounded' />
    </div>"""
    
    contenido = contenido.replace(patron_17, reemplazo_17)
    print("✅ Reemplazado")
    cambios += 1
else:
    print("⚠️  Ya estaba reemplazado o no encontrado")

# ====================
# Q18: CerealMax
# ====================
print("\n📝 Q18: Spot publicitario")
if "SPOT TV - 30 SEGUNDOS" in contenido and "CerealMax" in contenido:
    patron_18 = """<div class='bg-black text-white p-4 rounded-lg my-4'>
      <p class='text-xs text-gray-400 mb-3'>🎬 SPOT TV - 30 SEGUNDOS</p>
      <div class='space-y-2 text-sm'>
        <div class='bg-gray-800 p-2 rounded'>
          <p class='text-gray-300'><strong>Escena 1 (0-10s):</strong> Familia desayunando junta sonriendo</p>
          <p class='text-gray-400 text-xs'>Música alegre de fondo</p>
        </div>
        <div class='bg-gray-800 p-2 rounded'>
          <p class='text-gray-300'><strong>Escena 2 (11-20s):</strong> Close-up del producto: "CerealMax con vitaminas"</p>
          <p class='text-gray-400 text-xs'>Voz en off: "¡Energía para todo el día!"</p>
        </div>
        <div class='bg-gray-800 p-2 rounded'>
          <p class='text-gray-300'><strong>Escena 3 (21-30s):</strong> Niños jugando activamente en el parque</p>
          <p class='text-gray-400 text-xs'>Voz en off: "Recomendado por nutricionistas"</p>
        </div>
      </div>
      <div class='bg-yellow-600 text-black p-2 rounded mt-3 text-center font-bold'>
        <p>🌟 CerealMax: ¡Tu familia lo merece!</p>
      </div>
    </div>"""
    
    reemplazo_18 = """<div class='bg-white p-6 rounded-lg border-4 border-yellow-600 my-4'>
      <img src="imagenes/familia sonrie.png" alt="Spot publicitario de CerealMax" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded text-center'>
        <p class='text-sm text-gray-700'>🎬 SPOT TV - 30 SEGUNDOS</p>
        <p class='text-xs text-gray-600 mt-2'>Voz en off: "Recomendado por nutricionistas"</p>
      </div>
    </div>"""
    
    contenido = contenido.replace(patron_18, reemplazo_18)
    print("✅ Reemplazado")
    cambios += 1
else:
    print("⚠️  Ya estaba reemplazado o no encontrado")

# ====================
# Q33: Redes sociales
# ====================
print("\n📝 Q33: Redes sociales")
if "grid grid-cols-2" in contenido and "@ProfesorFormal" in contenido:
    # Este ya lo maneja fix-q33-smart.py mejor
    print("⚠️  Usar fix-q33-smart.py para este")
else:
    print("✅ Ya estaba reemplazado")

# ====================
# Q41: Resultados
# ====================
print("\n📝 Q41: Resultados comprensión lectora")
if "RESULTADOS COMPRENSIÓN LECTORA - 2° MEDIO" in contenido:
    patron_41 = """<div class='bg-white p-4 rounded-lg border-2 border-gray-300 my-4'>
      <h4 class='font-bold text-center mb-3'>📊 RESULTADOS COMPRENSIÓN LECTORA - 2° MEDIO</h4>
      <div class='grid grid-cols-2 gap-3 text-sm'>
        <div class='bg-red-50 p-2 rounded border border-red-200'>
          <p class='font-semibold text-red-800'>Nivel Insuficiente:</p>
          <p class='text-2xl text-red-600'>35%</p>
          <p class='text-xs text-gray-600'>(14 estudiantes)</p>
        </div>
        <div class='bg-yellow-50 p-2 rounded border border-yellow-200'>
          <p class='font-semibold text-yellow-800'>Nivel Elemental:</p>
          <p class='text-2xl text-yellow-600'>40%</p>
          <p class='text-xs text-gray-600'>(16 estudiantes)</p>
        </div>
        <div class='bg-blue-50 p-2 rounded border border-blue-200'>
          <p class='font-semibold text-blue-800'>Nivel Adecuado:</p>
          <p class='text-2xl text-blue-600'>20%</p>
          <p class='text-xs text-gray-600'>(8 estudiantes)</p>
        </div>
        <div class='bg-green-50 p-2 rounded border border-green-200'>
          <p class='font-semibold text-green-800'>Nivel Sobresaliente:</p>
          <p class='text-2xl text-green-600'>5%</p>
          <p class='text-xs text-gray-600'>(2 estudiantes)</p>
        </div>
      </div>
      <p class='text-xs text-gray-500 mt-3 text-center'>Total: 40 estudiantes evaluados</p>
    </div>"""
    
    reemplazo_41 = """<div class='bg-white p-6 rounded-lg border-4 border-gray-400 my-4'>
      <img src="imagenes/RESULTADOS COMPRENSION LECTORA.png" alt="Resultados de comprensión lectora" class='w-full h-auto mb-3 rounded' />
    </div>"""
    
    contenido = contenido.replace(patron_41, reemplazo_41)
    print("✅ Reemplazado")
    cambios += 1
else:
    print("⚠️  Ya estaba reemplazado o no encontrado")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n" + "=" * 70)
print(f"✅ COMPLETADO: {cambios} imágenes reemplazadas")
print("=" * 70)
print(f"📝 Archivo: {archivo}")
print("\n🔍 Verificar con: python validar-sintaxis-js.py")
