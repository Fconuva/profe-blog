# -*- coding: utf-8 -*-
"""
Agregar botones de consulta de IA a todas las secciones principales de Básica Generalista
"""

archivo = 'evaluaciones/educacion-basica/estudio/basica-generalista.njk'

# Leer el contenido
with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Configuración de botones adicionales (con títulos EXACTOS encontrados por grep)
botones_adicionales = [
    {
        'buscar': '<h4 class="text-2xl font-bold text-blue-700 mb-4">✍️ Fases de la Escritura</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-blue-700 mb-4">✍️ Fases de la Escritura</h4>
      <button onclick="openAIModal('Proceso de Escritura', 'Estrategias para enseñar las fases del proceso de escritura (planificar, escribir, revisar) en 1° a 3° básico', 'Lenguaje y Comunicación - Escritura')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Proceso de Escritura
      </button>''',
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-blue-700 mb-4">➕ Operaciones y Propiedades</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-blue-700 mb-4">➕ Operaciones y Propiedades</h4>
      <button onclick="openAIModal('Operaciones y Propiedades', '¿Cómo enseñar las operaciones básicas (suma, resta) y sus propiedades en 1° a 3° básico según las Bases Curriculares? Incluye estrategias de cálculo mental', 'Matemática - Números y Operaciones')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Operaciones
      </button>''',
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-blue-700 mb-4">🔢 Sistema de Numeración Decimal</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-blue-700 mb-4">🔢 Sistema de Numeración Decimal</h4>
      <button onclick="openAIModal('Sistema Decimal CPA', '¿Cómo implementar la progresión Concreto-Pictórico-Abstracto (CPA) para enseñar valor posicional en 1° a 3° básico según las Bases Curriculares?', 'Matemática - Números y Operaciones')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Sistema Decimal CPA
      </button>''',
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-orange-700 mb-4">🪶 Pueblos Originarios de Chile</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-orange-700 mb-4">🪶 Pueblos Originarios de Chile</h4>
      <button onclick="openAIModal('Pueblos Originarios', '¿Cómo enseñar sobre los pueblos originarios de Chile en 1° a 3° básico según las Bases Curriculares? Incluye estrategias para abordar la diversidad cultural y el respeto', 'Historia, Geografía y Ciencias Sociales')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Pueblos Originarios
      </button>''',
    },
    # Botones adicionales para otras secciones importantes
    {
        'buscar': '<h4 class="text-2xl font-bold text-blue-700 mb-4">🍕 Fracciones</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-blue-700 mb-4">🍕 Fracciones</h4>
      <button onclick="openAIModal('Fracciones', '¿Cómo introducir el concepto de fracciones en 2° y 3° básico usando materiales concretos según las Bases Curriculares?', 'Matemática - Números y Operaciones')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Fracciones
      </button>''',
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-blue-700 mb-4">📐 Geometría</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-blue-700 mb-4">📐 Geometría</h4>
      <button onclick="openAIModal('Geometría', '¿Cómo enseñar figuras 2D y 3D en 1° a 3° básico según las Bases Curriculares? Incluye actividades con materiales concretos', 'Matemática - Geometría')" 
        class="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
        <i class="fas fa-robot"></i> Consultar IA sobre Geometría
      </button>''',
    },
]

# Insertar cada botón
botones_insertados = 0
for boton_config in botones_adicionales:
    buscar = boton_config['buscar']
    insertar = boton_config['insertar_despues']
    
    if buscar in contenido:
        contenido = contenido.replace(buscar, insertar, 1)
        print(f"✅ Botón insertado: {buscar[:80]}...")
        botones_insertados += 1
    else:
        print(f"⚠️ No encontrado: {buscar[:80]}...")

# Guardar los cambios
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print(f"\n✅ {botones_insertados} botones de IA agregados exitosamente")
print(f"📊 Total de botones de IA en el documento: {botones_insertados + 5} (5 anteriores + {botones_insertados} nuevos)")
