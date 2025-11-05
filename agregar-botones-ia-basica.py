#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para agregar botones de IA en secciones clave de basica-generalista.njk
"""

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Botones a insertar en diferentes secciones
botones = [
    {
        'buscar': '<h4 class="text-2xl font-bold text-purple-700 mb-4">📚 Textos Narrativos Literarios</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-purple-700 mb-4">📚 Textos Narrativos Literarios</h4>
      <button onclick="openAIModal('Textos Narrativos Literarios en Primer Ciclo', '¿Cómo enseñar textos narrativos (cuentos, fábulas, leyendas, mitos) en 1° a 3° básico según las Bases Curriculares? Proporciona estrategias concretas para cada nivel y ejemplos de actividades.', 'Lenguaje - Comprensión Lectora')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Textos Narrativos</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-blue-700 mb-4">📖 Estrategias de Comprensión Lectora</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-blue-700 mb-4">📖 Estrategias de Comprensión Lectora</h4>
      <button onclick="openAIModal('Estrategias de Comprensión Lectora', '¿Cómo implementar las estrategias de comprensión lectora (antes, durante, después) en 1° a 3° básico? Dame ejemplos concretos de preguntas y actividades para cada momento según las Bases Curriculares.', 'Lenguaje - Estrategias Didácticas')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Comprensión Lectora</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-orange-700 mb-4">✍️ Proceso de Escritura</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-orange-700 mb-4">✍️ Proceso de Escritura</h4>
      <button onclick="openAIModal('Proceso de Escritura en Primer Ciclo', '¿Cómo guiar el proceso de escritura (planificación, textualización, revisión, edición) con estudiantes de 1° a 3° básico? Dame estrategias diferenciadas por nivel y ejemplos de andamiaje.', 'Lenguaje - Producción de Textos')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Proceso de Escritura</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-red-700 mb-4">🔢 Propiedades de las Operaciones</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-red-700 mb-4">🔢 Propiedades de las Operaciones</h4>
      <button onclick="openAIModal('Propiedades de las Operaciones', '¿Cómo enseñar las propiedades conmutativa, asociativa y distributiva en 1° a 3° básico usando material concreto y representaciones? Dame la progresión curricular según las Bases.', 'Matemática - Operaciones')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Propiedades</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-blue-700 mb-4">📊 Sistema Decimal y Valor Posicional</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-blue-700 mb-4">📊 Sistema Decimal y Valor Posicional</h4>
      <button onclick="openAIModal('Sistema Decimal CPA', '¿Cómo implementar la progresión Concreto-Pictórico-Abstracto (CPA) para enseñar valor posicional en 1° a 3° básico? Dame ejemplos de materiales y actividades por nivel.', 'Matemática - Números')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Sistema Decimal</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-green-700 mb-4">🌍 Pueblos Originarios de Chile</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-green-700 mb-4">🌍 Pueblos Originarios de Chile</h4>
      <button onclick="openAIModal('Pueblos Originarios de Chile', '¿Cómo enseñar sobre los pueblos originarios de Chile (Mapuche, Aymara, Rapa Nui, etc.) en 2° y 3° básico de manera respetuosa y significativa? Dame actividades que promuevan el pensamiento crítico.', 'Historia - Pueblos Originarios')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Pueblos Originarios</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-orange-700 mb-4">🏛️ Formación Ciudadana</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-orange-700 mb-4">🏛️ Formación Ciudadana</h4>
      <button onclick="openAIModal('Formación Ciudadana en Primer Ciclo', '¿Cómo trabajar conceptos democráticos (libertad, igualdad, participación) con estudiantes de 1° a 3° básico? Dame estrategias concretas como debate, estudio de casos y proyectos de servicio adaptados al nivel.', 'Historia - Formación Ciudadana')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Formación Ciudadana</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-green-700 mb-4">🦁 Clasificación de Animales</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-green-700 mb-4">🦁 Clasificación de Animales</h4>
      <button onclick="openAIModal('Clasificación de Seres Vivos', '¿Cómo enseñar la clasificación de animales (vertebrados/invertebrados) en 1° y 2° básico usando observación directa y material concreto? Dame la progresión según Bases Curriculares.', 'Ciencias - Seres Vivos')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Clasificación Animal</span>
      </button>'''
    },
    {
        'buscar': '<h4 class="text-2xl font-bold text-purple-700 mb-4">🔬 Investigación Científica Escolar</h4>',
        'insertar_despues': '''<h4 class="text-2xl font-bold text-purple-700 mb-4">🔬 Investigación Científica Escolar</h4>
      <button onclick="openAIModal('Investigación Científica Escolar', '¿Cómo guiar el proceso de investigación científica (observar/preguntar, experimentar, analizar/comunicar) con estudiantes de 1° a 3° básico? Dame ejemplos de experimentos simples y seguros para el aula.', 'Ciencias - Habilidades de Investigación')" class="ai-button ai-button-small mb-4">
        <span>🤖</span>
        <span>Consultar IA sobre Investigación Científica</span>
      </button>'''
    }
]

# Aplicar cada botón
botones_insertados = 0
for boton in botones:
    if boton['buscar'] in contenido:
        contenido = contenido.replace(boton['buscar'], boton['insertar_despues'])
        botones_insertados += 1
        print(f"✅ Botón insertado: {boton['buscar'][:50]}...")
    else:
        print(f"⚠️ No encontrado: {boton['buscar'][:50]}...")

# Guardar archivo
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print(f"\n✅ {botones_insertados} botones de IA agregados exitosamente")
print("📊 Los docentes ahora pueden consultar IA en secciones clave")
