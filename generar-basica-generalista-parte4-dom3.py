#!/usr/bin/env python3
import os

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

dom3 = """

<!-- ==================== DOMINIO 3: HISTORIA Y CIENCIAS SOCIALES ==================== -->
<div class="dominio-card dominio-historia">
  <h2 class="text-4xl font-bold text-orange-600 mb-6">
    <span class="icon-badge" style="background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);">🌎</span>
    DOMINIO 3: HISTORIA, GEOGRAFÍA Y CIENCIAS SOCIALES
  </h2>
  
  <!-- 3.1 CONTENIDOS -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">3.1 Contenidos Relevantes de Historia y Ciencias Sociales</h3>
    
    <div class="definition-box">
      <h4 class="text-2xl font-bold text-orange-700 mb-4">🏛️ Pueblos Originarios de Chile</h4>
      <table class="table-modern">
        <thead>
          <tr><th>Pueblo</th><th>Zona</th><th>Características</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Atacameños</strong></td>
            <td>Norte Grande (desierto)</td>
            <td>Agricultura en oasis, cerámica, comercio con Andes</td>
          </tr>
          <tr>
            <td><strong>Aymaras</strong></td>
            <td>Altiplano nortino</td>
            <td>Pastoreo de llamas, terrazas agrícolas, textilería</td>
          </tr>
          <tr>
            <td><strong>Mapuche</strong></td>
            <td>Zona centro-sur</td>
            <td>Agricultura (maíz, papa), ganadería, platería, ruca</td>
          </tr>
          <tr>
            <td><strong>Rapa Nui</strong></td>
            <td>Isla de Pascua</td>
            <td>Moais, agricultura de camote, pesca, navegación</td>
          </tr>
          <tr>
            <td><strong>Kawésqar (Alacalufes)</strong></td>
            <td>Canales australes</td>
            <td>Nómades canoeros, pesca, recolección marina</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-green-700 mb-4">🌿 Recursos Naturales y Desarrollo Sostenible</h4>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-5 rounded-lg">
          <h5 class="font-bold text-green-600 mb-3">Recursos Renovables</h5>
          <ul class="text-sm space-y-2 list-disc ml-6">
            <li><strong>Agua:</strong> Ríos, lagos (uso agrícola, consumo humano)</li>
            <li><strong>Bosques:</strong> Madera, papel (requiere reforestación)</li>
            <li><strong>Energía solar/eólica:</strong> Electricidad limpia</li>
            <li><strong>Pesca:</strong> Recursos marinos (con cuotas sostenibles)</li>
          </ul>
        </div>
        <div class="bg-white p-5 rounded-lg">
          <h5 class="font-bold text-red-600 mb-3">Recursos No Renovables</h5>
          <ul class="text-sm space-y-2 list-disc ml-6">
            <li><strong>Cobre:</strong> Principal exportación de Chile</li>
            <li><strong>Litio:</strong> Baterías, tecnología</li>
            <li><strong>Petróleo/gas:</strong> Energía fósil</li>
            <li><strong>Minerales:</strong> Oro, plata, hierro</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="strategy-box mt-6">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">🏛️ Conceptos Democráticos</h4>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h5 class="font-bold mb-2">Libertad</h5>
          <p class="text-sm">Capacidad de actuar según la propia voluntad, dentro del marco legal</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <h5 class="font-bold mb-2">Igualdad ante la ley</h5>
          <p class="text-sm">Todas las personas tienen los mismos derechos y deberes</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h5 class="font-bold mb-2">Participación ciudadana</h5>
          <p class="text-sm">Derecho a votar, opinar y participar en decisiones colectivas</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 3.2 ENSEÑANZA-APRENDIZAJE -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">3.2 Enseñanza-Aprendizaje en Historia y Ciencias Sociales</h3>
    
    <div class="strategy-box">
      <h4 class="text-2xl font-bold text-orange-700 mb-4">🏛️ Formación Ciudadana</h4>
      <table class="table-modern">
        <thead>
          <tr><th>Estrategia</th><th>Descripción</th><th>Ejemplo de Actividad</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Debate estructurado</strong></td>
            <td>Discusión de temas controversiales con reglas claras</td>
            <td>"Debatan: ¿Debería ser obligatorio reciclar en los colegios?"</td>
          </tr>
          <tr>
            <td><strong>Estudio de casos</strong></td>
            <td>Análisis de situaciones reales de participación ciudadana</td>
            <td>"Lean sobre la campaña 'Mi barrio sin basura' y propongan mejoras"</td>
          </tr>
          <tr>
            <td><strong>Simulación</strong></td>
            <td>Role-playing de instituciones democráticas</td>
            <td>"Organicen una elección de directiva de curso con voto secreto"</td>
          </tr>
          <tr>
            <td><strong>Proyectos de servicio</strong></td>
            <td>Acciones concretas en la comunidad</td>
            <td>"Diseñen una campaña para cuidar las áreas verdes del colegio"</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="definition-box mt-6">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">🕰️ Habilidades de Pensamiento Temporal y Espacial</h4>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h5 class="font-bold text-blue-600 mb-3">Pensamiento Temporal</h5>
          <div class="bg-white p-4 rounded-lg">
            <ul class="text-sm space-y-2 list-disc ml-6">
              <li><strong>Líneas de tiempo:</strong> Ordenar eventos históricos cronológicamente</li>
              <li><strong>Causa-consecuencia:</strong> Identificar relaciones entre eventos</li>
              <li><strong>Cambio y continuidad:</strong> Comparar antes/después</li>
              <li><strong>Periodización:</strong> Distinguir etapas históricas</li>
            </ul>
          </div>
        </div>
        <div>
          <h5 class="font-bold text-green-600 mb-3">Pensamiento Espacial</h5>
          <div class="bg-white p-4 rounded-lg">
            <ul class="text-sm space-y-2 list-disc ml-6">
              <li><strong>Ubicación absoluta/relativa:</strong> Usar coordenadas y puntos cardinales</li>
              <li><strong>Lectura de mapas:</strong> Interpretar símbolos, leyendas, escalas</li>
              <li><strong>Relaciones espaciales:</strong> Distancia, proximidad, distribución</li>
              <li><strong>Representación:</strong> Crear croquis y mapas temáticos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-purple-700 mb-4">📚 Análisis y Trabajo con Fuentes</h4>
      <div class="bg-white p-6 rounded-lg">
        <p class="font-semibold mb-4">Proceso de análisis de fuentes históricas:</p>
        <div class="grid md:grid-cols-4 gap-3">
          <div class="border-l-4 border-blue-500 pl-3">
            <strong class="text-blue-600">1. Identificar</strong>
            <p class="text-sm mt-1">¿Qué tipo de fuente es? (primaria/secundaria, texto/imagen/objeto)</p>
          </div>
          <div class="border-l-4 border-green-500 pl-3">
            <strong class="text-green-600">2. Contextualizar</strong>
            <p class="text-sm mt-1">¿Cuándo y dónde fue creada? ¿Quién es el autor?</p>
          </div>
          <div class="border-l-4 border-orange-500 pl-3">
            <strong class="text-orange-600">3. Interpretar</strong>
            <p class="text-sm mt-1">¿Qué información entrega? ¿Qué podemos inferir?</p>
          </div>
          <div class="border-l-4 border-purple-500 pl-3">
            <strong class="text-purple-600">4. Evaluar</strong>
            <p class="text-sm mt-1">¿Es confiable? ¿Qué sesgos puede tener?</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
"""

# Insertar antes del script final
pos = contenido.find('\n\n\n<script>')
if pos != -1:
    contenido_nuevo = contenido[:pos] + dom3 + '\n\n\n<script>' + contenido[pos+11:]
    with open(archivo, 'w', encoding='utf-8') as f:
        f.write(contenido_nuevo)
    print("OK - DOMINIO 3 agregado")
else:
    print("ERROR - Marcador no encontrado")
