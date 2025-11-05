#!/usr/bin/env python3
"""
Script para generar el contenido completo de basica-generalista.njk de forma modular
"""

import os

# Ruta del archivo
archivo_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

# Leer el archivo actual
with open(archivo_path, 'r', encoding='utf-8') as f:
    contenido_actual = f.read()

# Encontrar el marcador donde insertar contenido
marcador = '<!-- PLACEHOLDER: Aquí se insertarán las secciones de contenido -->\n<div id="contenido-dominios">\n  <!-- Las secciones se agregarán progresivamente -->\n</div>'

# DOMINIO 1: LENGUAJE - SECCIÓN 1.1
dom1_sec1 = """
<!-- ==================== DOMINIO 1: LENGUAJE Y COMUNICACIÓN ==================== -->
<div class="dominio-card dominio-lenguaje">
  <h2 class="text-4xl font-bold text-pink-600 mb-6">
    <span class="icon-badge" style="background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);">📖</span>
    DOMINIO 1: LENGUAJE Y COMUNICACIÓN
  </h2>
  
  <!-- 1.1 CONTENIDOS RELEVANTES -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">1.1 Contenidos Relevantes de Lenguaje y Comunicación</h3>
    
    <!-- Textos Literarios Narrativos -->
    <div class="definition-box">
      <h4 class="text-2xl font-bold text-pink-700 mb-4">📚 Textos Literarios Narrativos</h4>
      <p class="text-gray-700 mb-4">
        Los textos narrativos cuentan historias reales o imaginarias con personajes, acciones y escenarios. 
        En el Primer Ciclo se trabajan diversos subgéneros:
      </p>
      
      <table class="table-modern mt-4">
        <thead>
          <tr>
            <th>Género</th>
            <th>Características</th>
            <th>Ejemplo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Cuento</strong></td>
            <td>Narración breve, pocos personajes, un conflicto central</td>
            <td>"Caperucita Roja", "El patito feo"</td>
          </tr>
          <tr>
            <td><strong>Mito</strong></td>
            <td>Relato tradicional que explica el origen del mundo o fenómenos naturales</td>
            <td>Mito de la creación mapuche (Kai Kai y Treng Treng)</td>
          </tr>
          <tr>
            <td><strong>Leyenda</strong></td>
            <td>Narración popular con elementos fantásticos en contexto real</td>
            <td>"La Llorona", "El Caleuche"</td>
          </tr>
          <tr>
            <td><strong>Fábula</strong></td>
            <td>Relato breve con animales antropomorfos que deja una moraleja</td>
            <td>"La liebre y la tortuga", "El león y el ratón"</td>
          </tr>
          <tr>
            <td><strong>Historieta</strong></td>
            <td>Secuencia de viñetas con texto e imágenes</td>
            <td>Condorito, Mafalda</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Estructura Narrativa -->
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-orange-700 mb-4">🎭 Elementos de la Estructura Narrativa</h4>
      
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h5 class="text-xl font-bold mb-3">1️⃣ NARRADOR</h5>
          
          <div class="bg-white p-4 rounded-lg mb-4">
            <strong class="text-pink-600">Por grado de conocimiento:</strong>
            <ul class="list-disc ml-6 mt-2 space-y-2">
              <li><strong>Omnisciente:</strong> Conoce todo (pensamientos, pasado, futuro)</li>
              <li><strong>Objetivo:</strong> Solo describe lo observable</li>
              <li><strong>Testigo:</strong> Observa desde afuera, conocimiento limitado</li>
            </ul>
          </div>
          
          <div class="bg-white p-4 rounded-lg">
            <strong class="text-pink-600">Por grado de participación:</strong>
            <ul class="list-disc ml-6 mt-2 space-y-2">
              <li><strong>Protagonista:</strong> Cuenta su propia historia (1ra persona)</li>
              <li><strong>Personaje secundario:</strong> Participa pero no es el protagonista</li>
              <li><strong>Fuera de la historia:</strong> No participa en los hechos (3ra persona)</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h5 class="text-xl font-bold mb-3">2️⃣ PERSONAJES</h5>
          <div class="bg-white p-4 rounded-lg mb-4">
            <ul class="space-y-3">
              <li>
                <strong class="text-pink-600">Protagonista:</strong> Personaje principal, enfrenta el conflicto
              </li>
              <li>
                <strong class="text-pink-600">Antagonista:</strong> Se opone al protagonista
              </li>
              <li>
                <strong class="text-pink-600">Secundarios:</strong> Apoyan al protagonista o antagonista
              </li>
            </ul>
          </div>
          
          <h5 class="text-xl font-bold mb-3 mt-4">3️⃣ TIEMPO</h5>
          <div class="bg-white p-4 rounded-lg mb-4">
            <ul class="space-y-2 ml-6 list-disc">
              <li><strong>Cronológico:</strong> Los hechos se narran en orden temporal</li>
              <li><strong>Flashback:</strong> Salto al pasado</li>
              <li><strong>In medias res:</strong> Comienza en medio de la acción</li>
            </ul>
          </div>
          
          <h5 class="text-xl font-bold mb-3">4️⃣ ESPACIO</h5>
          <div class="bg-white p-4 rounded-lg">
            <p><strong>Físico:</strong> Lugares donde ocurren los hechos (casa, bosque, ciudad)</p>
            <p><strong>Psicológico:</strong> Atmósfera emocional (tensión, alegría, miedo)</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Textos No Literarios -->
    <div class="strategy-box mt-6">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">📄 Textos No Literarios</h4>
      <p class="text-gray-700 mb-4">
        Los textos no literarios tienen propósitos comunicativos específicos y estructuras formales definidas:
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h5 class="font-bold text-lg text-blue-600 mb-2">📊 EXPOSITIVOS</h5>
          <p class="text-sm mb-2"><strong>Propósito:</strong> Informar objetivamente</p>
          <p class="text-sm mb-2"><strong>Estructura:</strong> Introducción → Desarrollo → Conclusión</p>
          <p class="text-sm"><strong>Ejemplos:</strong> Enciclopedias, textos escolares, artículos informativos</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h5 class="font-bold text-lg text-green-600 mb-2">💬 ARGUMENTATIVOS</h5>
          <p class="text-sm mb-2"><strong>Propósito:</strong> Convencer o persuadir</p>
          <p class="text-sm mb-2"><strong>Estructura:</strong> Tesis → Argumentos → Conclusión</p>
          <p class="text-sm"><strong>Ejemplos:</strong> Cartas al director, columnas de opinión, debates</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h5 class="font-bold text-lg text-purple-600 mb-2">🗣️ DIALÓGICOS</h5>
          <p class="text-sm mb-2"><strong>Propósito:</strong> Intercambiar información entre dos o más interlocutores</p>
          <p class="text-sm mb-2"><strong>Estructura:</strong> Turnos de habla, preguntas y respuestas</p>
          <p class="text-sm"><strong>Ejemplos:</strong> Entrevistas, diálogos teatrales, conversaciones</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h5 class="font-bold text-lg text-red-600 mb-2">📢 PUBLICITARIOS</h5>
          <p class="text-sm mb-2"><strong>Propósito:</strong> Promocionar un producto o servicio</p>
          <p class="text-sm mb-2"><strong>Estructura:</strong> Eslogan + Imagen + Información del producto</p>
          <p class="text-sm"><strong>Ejemplos:</strong> Afiches, comerciales, anuncios digitales</p>
        </div>
      </div>
    </div>
  </div>
"""

print("✅ Generando DOMINIO 1 - Sección 1.1...")

# Guardar por ahora solo esta sección
contenido_nuevo = contenido_actual.replace(
    marcador,
    dom1_sec1 + '\n</div>'
)

with open(archivo_path, 'w', encoding='utf-8') as f:
    f.write(contenido_nuevo)

print("✅ DOMINIO 1 - Sección 1.1 agregada exitosamente")
print("📊 Próximos pasos: ejecutar script para agregar secciones 1.2, 2.1, 2.2, etc.")
