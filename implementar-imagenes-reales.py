#!/usr/bin/env python3
"""
Script para reemplazar las imágenes CSS por las imágenes reales PNG
en el test de Lengua y Literatura Media.
"""

import re

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

# Leer el archivo
with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

print("🔍 Iniciando reemplazo de imágenes...")
print("=" * 60)

# ========================================
# PREGUNTA 14: Unidos somos más
# ========================================
print("\n📝 Pregunta 14: Afiche político")
patron_14 = r"(<div class='bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-lg border-4 border-red-700 my-4\">\s*<div class='text-center'>\s*<div class='text-6xl mb-3'>✊</div>\s*<h3 class='text-4xl font-bold text-red-900 mb-3'>¡UNIDOS SOMOS MÁS!</h3>\s*<div class='bg-white p-4 rounded-lg mb-3'>\s*<p class='text-lg font-semibold text-gray-800'>📊 El 87% de los ciudadanos apoya nuestro proyecto</p>\s*<p class='text-sm text-gray-600 mt-2'>Fuente: Encuesta interna del partido \(500 militantes consultados\)</p>\s*</div>\s*<p class='text-xl text-red-800 font-bold'>Vota por el CAMBIO\. Vota por nosotros\.</p>\s*<p class='text-sm text-red-700 mt-2'>Si no votas por nosotros, votas por el caos</p>\s*</div>\s*</div>)"

reemplazo_14 = """<div class='bg-white p-6 rounded-lg border-4 border-red-700 my-4'>
      <img src="imagenes/unidos somos mas.png" alt="Afiche de propaganda política" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded'>
        <p class='text-sm text-gray-600'>Fuente: Encuesta interna del partido (500 militantes consultados)</p>
      </div>
    </div>"""

if 'UNIDOS SOMOS MÁS' in contenido:
    print("✅ Encontrado CSS del afiche político")
    # Reemplazo manual más simple
    contenido = contenido.replace(
        """<div class='bg-gradient-to-br from-red-100 to-red-200 p-6 rounded-lg border-4 border-red-700 my-4">
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
    </div>""",
        reemplazo_14
    )
    print("✅ Reemplazado con imagen: unidos somos mas.png")
else:
    print("❌ No encontrado")

# ========================================
# PREGUNTA 16: Agua sostenible
# ========================================
print("\n📝 Pregunta 16: Campaña de agua")
if "💧" in contenido and "AGUA SOSTENIBLE" in contenido:
    print("✅ Encontrado CSS de campaña agua")
    contenido = contenido.replace(
        """<div class='bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg border-4 border-blue-600 my-4 text-center'>
      <div class='text-5xl mb-3'>💧</div>
      <h3 class='text-3xl font-bold text-blue-900 mb-2'>AGUA SOSTENIBLE</h3>
      <p class='text-lg text-blue-800 mb-3'>Cada gota cuenta para el futuro del planeta</p>
      <div class='bg-white p-3 rounded-lg text-left'>
        <p class='text-sm font-semibold text-gray-700'>💡 <strong>Consejos prácticos:</strong></p>
        <ul class='text-sm text-gray-600 ml-6 mt-2 list-disc'>
          <li>Cierra el grifo mientras te cepillas los dientes</li>
          <li>Duchas de máximo 5 minutos</li>
          <li>Repara fugas inmediatamente</li>
          <li>Reutiliza el agua de lavar verduras para riego</li>
        </ul>
      </div>
      <p class='text-xs text-blue-700 mt-3'>🌍 Campaña del Ministerio del Medio Ambiente 2024</p>
    </div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-blue-600 my-4'>
      <img src="imagenes/AGUA SOSTENIBLE.png" alt="Campaña de agua sostenible" class='w-full h-auto mb-3 rounded' />
      <p class='text-xs text-blue-700 text-center'>🌍 Campaña del Ministerio del Medio Ambiente 2024</p>
    </div>"""
    )
    print("✅ Reemplazado con imagen: AGUA SOSTENIBLE.png")
else:
    print("❌ No encontrado")

# ========================================
# PREGUNTA 17: Reciclaje
# ========================================
print("\n📝 Pregunta 17: Infografía de reciclaje")
if "CICLO DEL RECICLAJE" in contenido:
    print("✅ Encontrado CSS de reciclaje")
    contenido = contenido.replace(
        """<div class='bg-gray-50 p-4 rounded-lg border-2 border-green-500 my-4'>
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
    </div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-green-500 my-4'>
      <img src="imagenes/reciclaje.png" alt="Infografía del ciclo de reciclaje" class='w-full h-auto mb-3 rounded' />
    </div>"""
    )
    print("✅ Reemplazado con imagen: reciclaje.png")
else:
    print("❌ No encontrado")

# ========================================
# PREGUNTA 18: Spot comercial CerealMax
# ========================================
print("\n📝 Pregunta 18: Spot publicitario")
if "SPOT TV - 30 SEGUNDOS" in contenido and "CerealMax" in contenido:
    print("✅ Encontrado CSS de spot CerealMax")
    contenido = contenido.replace(
        """<div class='bg-black text-white p-4 rounded-lg my-4'>
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
    </div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-yellow-600 my-4'>
      <img src="imagenes/familia sonrie.png" alt="Spot publicitario de CerealMax" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded text-center'>
        <p class='text-sm text-gray-700'>🎬 SPOT TV - 30 SEGUNDOS</p>
        <p class='text-xs text-gray-600 mt-2'>Voz en off: "Recomendado por nutricionistas"</p>
      </div>
    </div>"""
    )
    print("✅ Reemplazado con imagen: familia sonrie.png")
else:
    print("❌ No encontrado")

# ========================================
# PREGUNTA 33: Redes sociales
# ========================================
print("\n📝 Pregunta 33: Publicaciones en redes sociales")
if "dos publicaciones en redes sociales" in contenido.lower():
    print("✅ Encontrado CSS de redes sociales")
    # Este es más complejo, buscar el patrón específico
    patron_33 = r"<div class='grid grid-cols-2 gap-3 my-4\">\s*<div class='bg-white p-3 rounded-lg border-2 border-gray-300'>.*?</div>\s*</div>"
    
    # Método más seguro: buscar desde "Analiza estas dos publicaciones" hasta antes de la pregunta
    inicio = contenido.find("Analiza estas dos publicaciones en redes sociales sobre el mismo tema:")
    if inicio > 0:
        # Buscar el cierre del enunciado (hasta el \n\n antes de "¿Qué diferencia")
        fin = contenido.find("¿Qué diferencia principal existe entre el registro", inicio)
        if fin > 0:
            fragmento_original = contenido[inicio:fin].strip()
            # Extraer solo la parte HTML
            inicio_html = fragmento_original.find("<div class='grid")
            if inicio_html > 0:
                html_original = fragmento_original[inicio_html:]
                
                nuevo_html = """<div class='bg-white p-6 rounded-lg border-4 border-blue-500 my-4'>
      <img src="imagenes/dos publicaciones.png" alt="Dos publicaciones en redes sociales" class='w-full h-auto mb-3 rounded' />
    </div>
    
    """
                
                contenido = contenido.replace(html_original, nuevo_html)
                print("✅ Reemplazado con imagen: dos publicaciones.png")
    else:
        print("❌ No encontrado el patrón")
else:
    print("❌ No encontrado")

# ========================================
# PREGUNTA 41: Resultados pedagógicos
# ========================================
print("\n📝 Pregunta 41: Resultados comprensión lectora")
if "RESULTADOS COMPRENSIÓN LECTORA" in contenido:
    print("✅ Encontrado CSS de resultados")
    contenido = contenido.replace(
        """<div class='bg-white p-4 rounded-lg border-2 border-gray-300 my-4'>
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
    </div>""",
        """<div class='bg-white p-6 rounded-lg border-4 border-gray-400 my-4'>
      <img src="imagenes/RESULTADOS COMPRENSION LECTORA.png" alt="Resultados de comprensión lectora" class='w-full h-auto mb-3 rounded' />
    </div>"""
    )
    print("✅ Reemplazado con imagen: RESULTADOS COMPRENSION LECTORA.png")
else:
    print("❌ No encontrado")

# Guardar el archivo
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n" + "=" * 60)
print("✅ PROCESO COMPLETADO")
print("=" * 60)
print(f"📝 Archivo actualizado: {archivo}")
print("\n💾 Cambios guardados correctamente")
print("\n📋 Próximo paso: Validar sintaxis con validar-sintaxis-js.py")
