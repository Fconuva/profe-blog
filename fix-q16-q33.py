#!/usr/bin/env python3
"""Fix Q16 (agua) y Q33 (redes sociales)"""

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Q16 - Agua
print("📝 Arreglando Q16 (agua)...")
contenido = contenido.replace(
    """<div class='bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg border-4 border-blue-600 my-4 text-center">
      <div class='text-5xl mb-3'>💧</div>
      <h3 class='text-3xl font-bold text-blue-900 mb-2'>CADA GOTA CUENTA</h3>
      <p class='text-lg text-blue-800 mb-3'>El agua es vida. No la desperdicies.</p>
      <div class='bg-white p-3 rounded-lg inline-block'>
        <p class='text-sm text-gray-700'>🚿 Cierra la llave mientras te enjabonas</p>
        <p class='text-sm text-gray-700'>⏱️ Duchas cortas: máximo 5 minutos</p>
        <p class='text-sm text-gray-700'>🔧 Repara filtraciones inmediatamente</p>
      </div>
      <p class='text-xs text-blue-600 mt-3'>Ministerio del Medio Ambiente - Campaña #CuidaElAgua</p>
    </div>""",
    """<div class='bg-white p-6 rounded-lg border-4 border-blue-600 my-4'>
      <img src="imagenes/AGUA SOSTENIBLE.png" alt="Campaña de agua sostenible" class='w-full h-auto mb-3 rounded' />
      <p class='text-xs text-blue-700 text-center'>🌍 Ministerio del Medio Ambiente - Campaña #CuidaElAgua</p>
    </div>"""
)
print("✅ Q16 reemplazada")

# Q33 - Redes sociales (buscar y reemplazar el grid completo)
print("📝 Arreglando Q33 (redes sociales)...")
# Buscar el inicio
inicio = contenido.find("Analiza estas dos publicaciones en redes sociales sobre el mismo tema:")
if inicio > 0:
    # Buscar el final (antes de "¿Qué diferencia")
    fin_busqueda = contenido.find("¿Qué diferencia principal existe entre el registro", inicio)
    if fin_busqueda > 0:
        # Extraer el fragmento
        fragmento = contenido[inicio:fin_busqueda]
        
        # Buscar el HTML del grid
        inicio_grid = fragmento.find("<div class='grid grid-cols-2")
        if inicio_grid > 0:
            # El HTML termina antes de \n\n (dos saltos de línea)
            texto_grid = fragmento[inicio_grid:]
            
            # Encontrar dónde termina el grid (buscando el cierre del div principal)
            contador = 0
            pos = 0
            for i, char in enumerate(texto_grid):
                if char == '<':
                    if texto_grid[i:i+5] == '<div ':
                        contador += 1
                    elif texto_grid[i:i+6] == '</div>':
                        contador -= 1
                        if contador == 0:
                            pos = i + 6
                            break
            
            if pos > 0:
                html_grid_original = texto_grid[:pos]
                
                nuevo_html = """<div class='bg-white p-6 rounded-lg border-4 border-blue-500 my-4'>
      <img src="imagenes/dos publicaciones.png" alt="Dos publicaciones en redes sociales" class='w-full h-auto mb-3 rounded' />
    </div>"""
                
                contenido = contenido.replace(html_grid_original, nuevo_html)
                print("✅ Q33 reemplazada")
            else:
                print("❌ No se pudo encontrar el cierre del grid")
        else:
            print("❌ No se encontró el grid")
    else:
        print("❌ No se encontró el final")
else:
    print("❌ No se encontró Q33")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n✅ PROCESO COMPLETADO")
