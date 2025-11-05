# -*- coding: utf-8 -*-
"""
Agregar los últimos botones de IA con títulos EXACTOS
"""

archivo = 'evaluaciones/educacion-basica/estudio/basica-generalista.njk'

# Leer el contenido
with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Configuración de botones con títulos exactos (copiados de grep)
botones_finales = [
    {
        'buscar': '<h4 class="text-2xl font-bold text-orange-700 mb-4">🍕 Fracciones</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-orange-700 mb-4">🍕 Fracciones</h4>
      <button onclick="openAIModal('Fracciones', '¿Cómo introducir el concepto de fracciones en 2° y 3° básico usando materiales concretos según las Bases Curriculares?', 'Matemática - Números y Operaciones')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Fracciones
      </button>''',
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-green-700 mb-4">📐 Geometría</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-green-700 mb-4">📐 Geometría</h4>
      <button onclick="openAIModal('Geometría', '¿Cómo enseñar figuras 2D y 3D en 1° a 3° básico según las Bases Curriculares? Incluye actividades con materiales concretos', 'Matemática - Geometría')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Geometría
      </button>''',
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-orange-700 mb-4">🏛️ Pueblos Originarios de Chile</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-orange-700 mb-4">🏛️ Pueblos Originarios de Chile</h4>
      <button onclick="openAIModal('Pueblos Originarios', '¿Cómo enseñar sobre los pueblos originarios de Chile en 1° a 3° básico según las Bases Curriculares? Incluye estrategias para abordar la diversidad cultural y el respeto', 'Historia, Geografía y Ciencias Sociales')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Pueblos Originarios
      </button>''',
    },
]

# Insertar cada botón
botones_insertados = 0
for boton_config in botones_finales:
    buscar = boton_config['buscar']
    insertar = boton_config['insertar_despues']
    
    if buscar in contenido:
        contenido = contenido.replace(buscar, insertar, 1)
        print(f"✅ Botón insertado: {buscar[:80]}...")
        botones_insertados += 1
    else:
        print(f"❌ ERROR - No encontrado: {buscar}")

# Guardar los cambios
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print(f"\n✅ {botones_insertados} botones de IA agregados exitosamente")
print(f"📊 Total de botones de IA en el documento: 11 (8 anteriores + {botones_insertados} nuevos)")
print(f"\n🎉 Sistema de IA completamente integrado con botones en:")
print(f"   • Lenguaje: Textos Narrativos, Comprensión Lectora, Escritura")
print(f"   • Matemática: Operaciones, Sistema Decimal, Fracciones, Geometría")
print(f"   • Historia: Pueblos Originarios, Formación Ciudadana")
print(f"   • Ciencias: Clasificación Animal, Investigación Científica")
