#!/usr/bin/env python3
"""
Implementar Q17 y Q18 usando búsqueda de índices
"""

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

print("🔧 Implementando Q17 (Reciclaje) y Q18 (CerealMax)...\n")

# ====================
# Q17: Reciclaje
# ====================
print("📝 Q17: Reciclaje")
inicio = contenido.find("Observa esta infografía sobre el proceso de reciclaje:")
if inicio > 0:
    # Buscar el final (antes de "¿Qué modo discursivo")
    fin = contenido.find("¿Qué modo discursivo predomina en esta infografía?", inicio)
    if fin > 0:
        # Extraer fragmento
        fragmento = contenido[inicio:fin]
        
        # Buscar el div de inicio
        inicio_div = fragmento.find("<div class='bg-gray-50")
        if inicio_div > 0:
            # El HTML termina antes de \n\n (dos saltos)
            html_original = fragmento[inicio_div:]
            
            nuevo_html = """<div class='bg-white p-6 rounded-lg border-4 border-green-500 my-4'>
      <img src="imagenes/reciclaje.png" alt="Infografía del ciclo de reciclaje" class='w-full h-auto mb-3 rounded' />
    </div>
    
    """
            
            contenido = contenido[:inicio+inicio_div] + nuevo_html + contenido[fin:]
            print("✅ Reemplazado")
        else:
            print("❌ No se encontró el div")
    else:
        print("❌ No se encontró el final")
else:
    print("❌ No se encontró Q17")

# ====================
# Q18: CerealMax  
# ====================
print("\n📝 Q18: CerealMax")
inicio = contenido.find("Analiza este spot publicitario (guion visual):")
if inicio > 0:
    # Buscar el final
    fin = contenido.find("¿Qué falacia argumentativa se presenta en el spot?", inicio)
    if fin > 0:
        fragmento = contenido[inicio:fin]
        
        inicio_div = fragmento.find("<div class='bg-black text-white")
        if inicio_div > 0:
            html_original = fragmento[inicio_div:]
            
            nuevo_html = """<div class='bg-white p-6 rounded-lg border-4 border-yellow-600 my-4'>
      <img src="imagenes/familia sonrie.png" alt="Spot publicitario de CerealMax" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded text-center'>
        <p class='text-sm text-gray-700'>🎬 SPOT TV - 30 SEGUNDOS</p>
        <p class='text-xs text-gray-600 mt-2'>Voz en off: "Recomendado por nutricionistas"</p>
      </div>
    </div>
    
    """
            
            contenido = contenido[:inicio+inicio_div] + nuevo_html + contenido[fin:]
            print("✅ Reemplazado")
        else:
            print("❌ No se encontró el div")
    else:
        print("❌ No se encontró el final")
else:
    print("❌ No se encontró Q18")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n✅ Proceso completado")
