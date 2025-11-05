#!/usr/bin/env python3
import os

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

dom4 = """

<!-- ==================== DOMINIO 4: CIENCIAS NATURALES ==================== -->
<div class="dominio-card dominio-ciencias">
  <h2 class="text-4xl font-bold text-green-600 mb-6">
    <span class="icon-badge" style="background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);">🔬</span>
    DOMINIO 4: CIENCIAS NATURALES
  </h2>
  
  <!-- 4.1 CONTENIDOS -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">4.1 Contenidos Relevantes de Ciencias Naturales</h3>
    
    <div class="definition-box">
      <h4 class="text-2xl font-bold text-green-700 mb-4">🦁 Clasificación de Animales</h4>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-5 rounded-lg border-l-4 border-blue-500">
          <h5 class="font-bold text-blue-600 mb-3">VERTEBRADOS</h5>
          <p class="text-sm mb-3">Animales con columna vertebral y esqueleto interno</p>
          <table class="text-xs w-full">
            <tr class="border-b">
              <td class="py-2 font-semibold">Mamíferos</td>
              <td class="py-2">Pelo, glándulas mamarias, sangre caliente</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 font-semibold">Aves</td>
              <td class="py-2">Plumas, pico, oviparos, vuelan (mayoría)</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 font-semibold">Reptiles</td>
              <td class="py-2">Escamas, piel seca, oviparos, sangre fría</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 font-semibold">Anfibios</td>
              <td class="py-2">Piel húmeda, metamorfosis, agua-tierra</td>
            </tr>
            <tr>
              <td class="py-2 font-semibold">Peces</td>
              <td class="py-2">Branquias, aletas, escamas, acuáticos</td>
            </tr>
          </table>
        </div>
        
        <div class="bg-white p-5 rounded-lg border-l-4 border-green-500">
          <h5 class="font-bold text-green-600 mb-3">INVERTEBRADOS</h5>
          <p class="text-sm mb-3">Animales sin columna vertebral (95% de especies)</p>
          <table class="text-xs w-full">
            <tr class="border-b">
              <td class="py-2 font-semibold">Insectos</td>
              <td class="py-2">6 patas, 3 segmentos corporales, alas (mayoría)</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 font-semibold">Arácnidos</td>
              <td class="py-2">8 patas, 2 segmentos (arañas, escorpiones)</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 font-semibold">Moluscos</td>
              <td class="py-2">Cuerpo blando, concha (caracoles, pulpos)</td>
            </tr>
            <tr class="border-b">
              <td class="py-2 font-semibold">Crustáceos</td>
              <td class="py-2">Exoesqueleto, 10 patas (cangrejos, camarones)</td>
            </tr>
            <tr>
              <td class="py-2 font-semibold">Equinodermos</td>
              <td class="py-2">Piel espinosa, simetría radial (estrellas de mar)</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">🌌 Componentes del Universo</h4>
      <table class="table-modern">
        <thead>
          <tr><th>Componente</th><th>Características</th><th>Ejemplos</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Estrellas</strong></td>
            <td>Cuerpos celestes que producen luz y calor, fusión nuclear</td>
            <td>Sol (nuestra estrella más cercana), Sirio, Betelgeuse</td>
          </tr>
          <tr>
            <td><strong>Planetas</strong></td>
            <td>Cuerpos que orbitan una estrella, no emiten luz propia</td>
            <td>Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno</td>
          </tr>
          <tr>
            <td><strong>Satélites</strong></td>
            <td>Cuerpos que orbitan un planeta</td>
            <td>Luna (de la Tierra), Fobos y Deimos (de Marte)</td>
          </tr>
          <tr>
            <td><strong>Sistema Solar</strong></td>
            <td>Sol + 8 planetas + satélites + asteroides + cometas</td>
            <td>Nuestro sistema planetario</td>
          </tr>
          <tr>
            <td><strong>Galaxias</strong></td>
            <td>Agrupaciones de millones de estrellas, gas y polvo</td>
            <td>Vía Láctea (nuestra galaxia), Andrómeda</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- 4.2 ENSEÑANZA-APRENDIZAJE -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">4.2 Enseñanza-Aprendizaje en Ciencias Naturales</h3>
    
    <div class="strategy-box">
      <h4 class="text-2xl font-bold text-purple-700 mb-4">🔬 Investigación Científica Escolar</h4>
      <p class="text-gray-700 mb-4">Proceso de indagación estructurado en <strong>3 etapas fundamentales</strong>:</p>
      
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-lg shadow border-t-4 border-blue-500">
          <h5 class="font-bold text-blue-600 text-lg mb-3">1️⃣ OBSERVAR Y PREGUNTAR</h5>
          <ul class="text-sm space-y-2 list-disc ml-6">
            <li>Observación guiada de fenómenos naturales</li>
            <li>Formulación de preguntas investigables</li>
            <li>Uso de los sentidos y herramientas</li>
            <li>Registro de observaciones (dibujos, tablas)</li>
          </ul>
          <div class="mt-3 bg-blue-50 p-3 rounded text-sm">
            <strong>Ejemplo:</strong> "¿Qué pasará si ponemos una planta en la oscuridad?"
          </div>
        </div>
        
        <div class="bg-white p-5 rounded-lg shadow border-t-4 border-green-500">
          <h5 class="font-bold text-green-600 text-lg mb-3">2️⃣ EXPERIMENTAR / PLANIFICAR</h5>
          <ul class="text-sm space-y-2 list-disc ml-6">
            <li>Diseñar experimentos simples</li>
            <li>Identificar variables (independiente, dependiente)</li>
            <li>Establecer predicciones (hipótesis)</li>
            <li>Seguir procedimientos paso a paso</li>
          </ul>
          <div class="mt-3 bg-green-50 p-3 rounded text-sm">
            <strong>Ejemplo:</strong> "Colocaremos 2 plantas: una con luz y otra sin luz durante 1 semana"
          </div>
        </div>
        
        <div class="bg-white p-5 rounded-lg shadow border-t-4 border-orange-500">
          <h5 class="font-bold text-orange-600 text-lg mb-3">3️⃣ ANALIZAR Y COMUNICAR</h5>
          <ul class="text-sm space-y-2 list-disc ml-6">
            <li>Registrar datos y resultados</li>
            <li>Identificar patrones y tendencias</li>
            <li>Comparar con predicciones iniciales</li>
            <li>Comunicar hallazgos (oral, escrito, visual)</li>
          </ul>
          <div class="mt-3 bg-orange-50 p-3 rounded text-sm">
            <strong>Ejemplo:</strong> "La planta sin luz se puso amarilla y se inclinó hacia donde había luz"
          </div>
        </div>
      </div>
    </div>
    
    <div class="definition-box mt-6">
      <h4 class="text-2xl font-bold text-green-700 mb-4">🌱 Estrategias para Ciencias de la Vida</h4>
      <table class="table-modern">
        <thead>
          <tr><th>Actividad</th><th>Objetivo de Aprendizaje</th><th>Ejemplo Concreto</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Observación de seres vivos</strong></td>
            <td>Identificar características, ciclos de vida, hábitats</td>
            <td>"Observen insectos en el patio: ¿cuántas patas tienen? ¿Cómo se mueven?"</td>
          </tr>
          <tr>
            <td><strong>Experimentos con plantas</strong></td>
            <td>Comprender necesidades de los seres vivos (agua, luz, aire)</td>
            <td>"Germinen porotos en diferentes condiciones: con/sin luz, con/sin agua"</td>
          </tr>
          <tr>
            <td><strong>Clasificación de animales</strong></td>
            <td>Agrupar según criterios (alimentación, hábitat, reproducción)</td>
            <td>"Clasifiquen estas 20 imágenes de animales en herbívoros, carnívoros y omnívoros"</td>
          </tr>
          <tr>
            <td><strong>Modelos de ecosistemas</strong></td>
            <td>Comprender relaciones entre seres vivos y su ambiente</td>
            <td>"Creen un terrario en botella: plantas, tierra, agua → observen 1 mes"</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">🌍 Estrategias para Ciencias de la Tierra</h4>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h5 class="font-bold text-blue-600 mb-3">Actividades de Observación Astronómica</h5>
          <div class="bg-white p-4 rounded-lg">
            <ul class="text-sm space-y-2 list-disc ml-6">
              <li><strong>Fases de la Luna:</strong> Registro diario durante 1 mes</li>
              <li><strong>Constelaciones:</strong> Identificar en mapa estelar</li>
              <li><strong>Movimiento aparente del Sol:</strong> Sombras a diferentes horas</li>
              <li><strong>Modelo del Sistema Solar:</strong> Escala de distancias con objetos</li>
            </ul>
          </div>
        </div>
        <div>
          <h5 class="font-bold text-green-600 mb-3">Uso de Modelos y Simulaciones</h5>
          <div class="bg-white p-4 rounded-lg">
            <ul class="text-sm space-y-2 list-disc ml-6">
              <li><strong>Globo terráqueo:</strong> Ubicar continentes, océanos, polos</li>
              <li><strong>Linterna y pelota:</strong> Simular día/noche, estaciones</li>
              <li><strong>Maquetas del Sistema Solar:</strong> Proporciones de tamaños</li>
              <li><strong>Apps astronómicas:</strong> Realidad aumentada del cielo nocturno</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div class="strategy-box mt-6">
      <h4 class="text-2xl font-bold text-purple-700 mb-4">📊 Evaluación Formativa en Ciencias</h4>
      <div class="bg-white p-6 rounded-lg">
        <div class="grid md:grid-cols-3 gap-4">
          <div class="border-l-4 border-blue-500 pl-4">
            <h6 class="font-bold text-blue-600 mb-2">Cuaderno de Ciencias</h6>
            <p class="text-sm">Registro de observaciones, dibujos científicos, predicciones, conclusiones</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4">
            <h6 class="font-bold text-green-600 mb-2">Rúbricas de Investigación</h6>
            <p class="text-sm">Evaluar proceso completo: pregunta, predicción, procedimiento, análisis, comunicación</p>
          </div>
          <div class="border-l-4 border-orange-500 pl-4">
            <h6 class="font-bold text-orange-600 mb-2">Presentaciones Científicas</h6>
            <p class="text-sm">Exposiciones orales con apoyo visual: póster científico, maqueta, PPT</p>
          </div>
        </div>
        
        <div class="mt-6 bg-purple-50 p-4 rounded">
          <p class="font-semibold text-purple-700 mb-2">💡 Retroalimentación efectiva:</p>
          <p class="text-sm">"Observaste que la planta se inclinó hacia la luz. ¿Qué crees que pasaría si giramos la planta? ¿Por qué las plantas 'buscan' la luz?"</p>
        </div>
      </div>
    </div>
  </div>
</div>
"""

# Insertar antes del script final
pos = contenido.find('\n\n\n<script>')
if pos != -1:
    contenido_nuevo = contenido[:pos] + dom4 + '\n\n\n<script>' + contenido[pos+11:]
    with open(archivo, 'w', encoding='utf-8') as f:
        f.write(contenido_nuevo)
    print("OK - DOMINIO 4 agregado")
    print("COMPLETADO - Todos los dominios (1, 2, 3, 4)")
else:
    print("ERROR - Marcador no encontrado")
