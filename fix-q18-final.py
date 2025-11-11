#!/usr/bin/env python3
import re

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

print("🔧 Implementando Q18 (CerealMax)...")

# Usar regex más flexible que ignore whitespace exacto
patron = re.compile(
    r"<div class='bg-black text-white p-4 rounded-lg my-4'>.*?</div>\s*</div>",
    re.DOTALL
)

# Buscar desde "spot publicitario" hasta "¿Qué falacias"
inicio = contenido.find("Analiza este spot publicitario (guion visual):")
fin = contenido.find("¿Qué falacias argumentativas se combinan en este spot?", inicio)

if inicio > 0 and fin > 0:
    fragmento = contenido[inicio:fin]
    
    # Buscar el div negro
    match = patron.search(fragmento)
    if match:
        html_viejo = match.group(0)
        
        html_nuevo = """<div class='bg-white p-6 rounded-lg border-4 border-yellow-600 my-4'>
      <img src="imagenes/familia sonrie.png" alt="Spot publicitario de CerealMax" class='w-full h-auto mb-3 rounded' />
      <div class='bg-gray-100 p-3 rounded text-center'>
        <p class='text-sm text-gray-700'>🎬 SPOT TV - 30 SEGUNDOS</p>
        <p class='text-xs text-gray-600 mt-2'>Voz en off: "Recomendado por nutricionistas"</p>
      </div>
    </div>
    
    """
        
        contenido = contenido.replace(html_viejo, html_nuevo)
        
        # Guardar
        with open(archivo, 'w', encoding='utf-8') as f:
            f.write(contenido)
        
        print("✅ Q18 reemplazada correctamente")
    else:
        print("❌ No se encontró el patrón del div negro")
else:
    print("❌ No se encontraron los marcadores de inicio/fin")

print("✅ Proceso completado")
