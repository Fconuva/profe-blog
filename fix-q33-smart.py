#!/usr/bin/env python3
"""Fix Q33 usando búsqueda de patrones simples"""

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    lineas = f.readlines()

print("📝 Buscando y reemplazando Q33...")

# Buscar la línea que contiene "grid grid-cols-2"
nueva_contenido = []
en_grid = False
linea_inicial = 0
contador_divs = 0

for i, linea in enumerate(lineas):
    if "grid grid-cols-2" in linea and not en_grid:
        en_grid = True
        linea_inicial = i
        # Insertar la imagen
        nueva_contenido.append("    <div class='bg-white p-6 rounded-lg border-4 border-blue-500 my-4'>\n")
        nueva_contenido.append("      <img src=\"imagenes/dos publicaciones.png\" alt=\"Dos publicaciones en redes sociales\" class='w-full h-auto mb-3 rounded' />\n")
        nueva_contenido.append("    </div>\n")
        contador_divs = 1  # El div inicial del grid
        print(f"✅ Encontrado grid en línea {i+1}")
        continue
    
    if en_grid:
        # Contar divs de apertura y cierre
        contador_divs += linea.count("<div ") + linea.count("<div>")
        contador_divs -= linea.count("</div>")
        
        # Si llegamos a 0, terminó el grid
        if contador_divs == 0:
            en_grid = False
            print(f"✅ Grid cerrado en línea {i+1}. Total de líneas eliminadas: {i - linea_inicial + 1}")
            continue
    
    if not en_grid:
        nueva_contenido.append(linea)

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.writelines(nueva_contenido)

print("✅ Archivo guardado")
