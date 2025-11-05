#!/usr/bin/env python3
import os

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

casos_practicos = """

<!-- ==================== CASOS PRÁCTICOS INTEGRADOS ==================== -->
<div class="max-w-6xl mx-auto mt-16 mb-12">
  <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
    <h2 class="text-4xl font-bold mb-4">
      <span class="icon-badge" style="background: white; color: #9c27b0;">🎯</span>
      CASOS PRÁCTICOS INTEGRADOS
    </h2>
    <p class="text-lg opacity-90">
      Situaciones reales de aula que integran múltiples dominios. 
      Analiza cada caso y selecciona la mejor respuesta pedagógica.
    </p>
  </div>

  <!-- CASO 1: Lenguaje + Historia -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-pink-500">
    <div class="flex items-start gap-4 mb-6">
      <span class="text-3xl">📖</span>
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Caso 1: Análisis de Carta Histórica</h3>
        <div class="flex gap-2 text-sm">
          <span class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Lenguaje</span>
          <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">Historia</span>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <p class="text-gray-700 mb-4"><strong>Situación:</strong></p>
      <p class="text-gray-800 mb-4">
        Los estudiantes de 3° básico están estudiando los pueblos originarios de Chile. 
        La profesora les presenta una carta escrita por un cronista español en el siglo XVI 
        describiendo su encuentro con el pueblo Mapuche. Los estudiantes deben:
      </p>
      <ul class="list-disc ml-6 text-gray-700 space-y-2">
        <li>Identificar el tipo de texto</li>
        <li>Reconocer el contexto histórico</li>
        <li>Analizar la perspectiva del autor</li>
      </ul>
    </div>
    
    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Cuál es la estrategia MÁS APROPIADA para trabajar este documento con estudiantes de 3° básico?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="A">
          <strong>A)</strong> Leer la carta completa y pedirles que la resuman en sus cuadernos.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="B">
          <strong>B)</strong> Realizar una lectura guiada, identificando palabras clave del contexto histórico y analizando la perspectiva del autor mediante preguntas dirigidas.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="C">
          <strong>C)</strong> Entregarles la carta para que la lean individualmente y busquen información sobre el tema en internet.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="D">
          <strong>D)</strong> Proyectar la carta y copiarla en la pizarra para que los estudiantes la transcriban.
        </div>
      </div>
    </div>
    
    <div class="caso-feedback hidden mt-6 p-6 rounded-lg" data-caso="1">
      <div class="feedback-content"></div>
    </div>
  </div>

  <!-- CASO 2: Matemática + Ciencias -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-blue-500">
    <div class="flex items-start gap-4 mb-6">
      <span class="text-3xl">📊</span>
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Caso 2: Datos de Observación Animal</h3>
        <div class="flex gap-2 text-sm">
          <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Matemática</span>
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full">Ciencias</span>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <p class="text-gray-700 mb-4"><strong>Situación:</strong></p>
      <p class="text-gray-800 mb-4">
        Durante una clase de Ciencias, los estudiantes de 2° básico observaron diferentes animales 
        en el patio del colegio durante una semana. Registraron sus observaciones y crearon esta tabla:
      </p>
      <table class="w-full text-sm border-collapse mb-4">
        <thead class="bg-green-100">
          <tr>
            <th class="border p-2">Animal</th>
            <th class="border p-2">Tipo</th>
            <th class="border p-2">Cantidad observada</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-2">Hormigas</td><td class="border p-2">Insecto</td><td class="border p-2 text-center">24</td></tr>
          <tr><td class="border p-2">Mariposas</td><td class="border p-2">Insecto</td><td class="border p-2 text-center">8</td></tr>
          <tr><td class="border p-2">Arañas</td><td class="border p-2">Arácnido</td><td class="border p-2 text-center">12</td></tr>
          <tr><td class="border p-2">Pájaros</td><td class="border p-2">Ave</td><td class="border p-2 text-center">6</td></tr>
        </tbody>
      </table>
    </div>
    
    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Qué actividad INTEGRA de mejor manera los objetivos de Matemática y Ciencias?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="A">
          <strong>A)</strong> Crear un gráfico de barras con los datos y clasificar los animales en vertebrados e invertebrados.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="B">
          <strong>B)</strong> Sumar todas las cantidades y escribir las características de cada animal.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="C">
          <strong>C)</strong> Memorizar los nombres científicos de los animales y practicar sumas.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="D">
          <strong>D)</strong> Copiar la tabla en sus cuadernos y colorear los animales.
        </div>
      </div>
    </div>
    
    <div class="caso-feedback hidden mt-6 p-6 rounded-lg" data-caso="2">
      <div class="feedback-content"></div>
    </div>
  </div>

  <!-- CASO 3: Lenguaje + Matemática -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-purple-500">
    <div class="flex items-start gap-4 mb-6">
      <span class="text-3xl">📝</span>
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Caso 3: Resolución de Problemas Escritos</h3>
        <div class="flex gap-2 text-sm">
          <span class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Lenguaje</span>
          <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Matemática</span>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <p class="text-gray-700 mb-4"><strong>Situación:</strong></p>
      <p class="text-gray-800 mb-4">
        Un estudiante de 3° básico tiene dificultades con este problema matemático:
      </p>
      <div class="bg-white p-4 border-l-4 border-blue-400 mb-4">
        <p class="text-gray-800">
          "María tenía 24 láminas. Le regaló 8 a su hermano y después compró 15 más. ¿Cuántas láminas tiene ahora?"
        </p>
      </div>
      <p class="text-gray-700">
        El estudiante escribió: 24 + 8 + 15 = 47
      </p>
    </div>
    
    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Cuál es la MEJOR estrategia para ayudar al estudiante?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="A">
          <strong>A)</strong> Decirle que está mal y mostrarle la operación correcta.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="B">
          <strong>B)</strong> Pedirle que subraye las palabras clave ("tenía", "regaló", "compró") y represente cada acción con material concreto o dibujos antes de operar.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="C">
          <strong>C)</strong> Darle más problemas similares para que practique.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="D">
          <strong>D)</strong> Simplificar el problema eliminando una de las operaciones.
        </div>
      </div>
    </div>
    
    <div class="caso-feedback hidden mt-6 p-6 rounded-lg" data-caso="3">
      <div class="feedback-content"></div>
    </div>
  </div>

  <!-- CASO 4: Historia + Ciencias -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-orange-500">
    <div class="flex items-start gap-4 mb-6">
      <span class="text-3xl">🌍</span>
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Caso 4: Recursos Naturales de Chile</h3>
        <div class="flex gap-2 text-sm">
          <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">Historia</span>
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full">Ciencias</span>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <p class="text-gray-700 mb-4"><strong>Situación:</strong></p>
      <p class="text-gray-800 mb-4">
        En 2° básico están estudiando los recursos naturales de Chile y su uso por los pueblos originarios. 
        Un estudiante pregunta: "¿Por qué los Aymaras vivían en el altiplano si allí hace mucho frío?"
      </p>
    </div>
    
    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Qué respuesta pedagógica es MÁS COMPLETA E INTEGRADORA?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="A">
          <strong>A)</strong> "Porque no había otro lugar donde vivir."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="B">
          <strong>B)</strong> "El altiplano tenía recursos como agua (ríos y lagos), pastos para sus animales (llamas y alpacas) y tierra fértil para cultivar. Los Aymaras se adaptaron al clima desarrollando técnicas como la construcción de viviendas de piedra y el uso de lana de sus animales."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="C">
          <strong>C)</strong> "Porque les gustaba el frío."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="D">
          <strong>D)</strong> "Esa pregunta la veremos más adelante en la clase."
        </div>
      </div>
    </div>
    
    <div class="caso-feedback hidden mt-6 p-6 rounded-lg" data-caso="4">
      <div class="feedback-content"></div>
    </div>
  </div>

  <!-- CASO 5: Lenguaje + Ciencias -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-green-500">
    <div class="flex items-start gap-4 mb-6">
      <span class="text-3xl">🔬</span>
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Caso 5: Informe de Experimento</h3>
        <div class="flex gap-2 text-sm">
          <span class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Lenguaje</span>
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full">Ciencias</span>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <p class="text-gray-700 mb-4"><strong>Situación:</strong></p>
      <p class="text-gray-800 mb-4">
        Después de realizar un experimento sobre germinación de semillas, los estudiantes de 2° básico 
        deben escribir un informe. La profesora observa que muchos escriben de manera desordenada:
      </p>
      <div class="bg-white p-4 border-l-4 border-red-400 mb-4">
        <p class="text-gray-800 italic">
          "Pusimos semillas y la planta creció y le pusimos agua todos los días y una estaba en la oscuridad 
          y otra con luz y la de luz creció más rápido..."
        </p>
      </div>
    </div>
    
    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Qué estrategia ayuda MEJOR a estructurar el informe científico?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="A">
          <strong>A)</strong> Corregir los errores ortográficos y devolver el texto.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="B">
          <strong>B)</strong> Proporcionar una plantilla con secciones claras: 1) ¿Qué queríamos descubrir? 2) ¿Qué hicimos? 3) ¿Qué observamos? 4) ¿Qué aprendimos? Y modelar cómo completar cada sección.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="C">
          <strong>C)</strong> Pedirles que dibujen el experimento en lugar de escribir.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="D">
          <strong>D)</strong> Dictar un informe modelo para que lo copien.
        </div>
      </div>
    </div>
    
    <div class="caso-feedback hidden mt-6 p-6 rounded-lg" data-caso="5">
      <div class="feedback-content"></div>
    </div>
  </div>

  <!-- CASO 6: Matemática + Historia -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-indigo-500">
    <div class="flex items-start gap-4 mb-6">
      <span class="text-3xl">🏛️</span>
      <div class="flex-1">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">Caso 6: Línea de Tiempo Matemática</h3>
        <div class="flex gap-2 text-sm">
          <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Matemática</span>
          <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">Historia</span>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg mb-6">
      <p class="text-gray-700 mb-4"><strong>Situación:</strong></p>
      <p class="text-gray-800 mb-4">
        Los estudiantes de 3° básico están creando una línea de tiempo sobre eventos importantes 
        de su vida. La profesora quiere integrar conceptos matemáticos de secuencia numérica y 
        cálculo de diferencias temporales.
      </p>
    </div>
    
    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Qué actividad INTEGRA mejor ambos dominios?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition" data-caso="6" data-opcion="A">
          <strong>A)</strong> Crear la línea de tiempo con años marcados, calcular "¿Cuántos años han pasado desde que nací hasta ahora?" y ordenar eventos usando números ordinales (1°, 2°, 3°).
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition" data-caso="6" data-opcion="B">
          <strong>B)</strong> Dibujar la línea de tiempo sin números ni fechas.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition" data-caso="6" data-opcion="C">
          <strong>C)</strong> Memorizar fechas históricas de Chile.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition" data-caso="6" data-opcion="D">
          <strong>D)</strong> Hacer ejercicios de sumas y restas sin relación con la historia.
        </div>
      </div>
    </div>
    
    <div class="caso-feedback hidden mt-6 p-6 rounded-lg" data-caso="6">
      <div class="feedback-content"></div>
    </div>
  </div>

  <!-- Progress Indicator -->
  <div class="mt-8 bg-white rounded-xl shadow-lg p-6">
    <h4 class="font-bold text-gray-800 mb-4">Tu Progreso</h4>
    <div class="flex gap-2">
      <div class="caso-progress w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600" data-caso="1">1</div>
      <div class="caso-progress w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600" data-caso="2">2</div>
      <div class="caso-progress w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600" data-caso="3">3</div>
      <div class="caso-progress w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600" data-caso="4">4</div>
      <div class="caso-progress w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600" data-caso="5">5</div>
      <div class="caso-progress w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600" data-caso="6">6</div>
    </div>
    <p class="text-sm text-gray-600 mt-4">
      <span id="casos-resueltos">0</span> de 6 casos analizados
    </p>
  </div>
</div>
"""

# Insertar antes del script final
pos = contenido.find('\n\n\n<script>')
if pos != -1:
    contenido_nuevo = contenido[:pos] + casos_practicos + '\n\n\n<script>' + contenido[pos+11:]
    with open(archivo, 'w', encoding='utf-8') as f:
        f.write(contenido_nuevo)
    print("OK - Casos practicos agregados")
    print("Total: 6 casos integrados (Lenguaje, Matematica, Historia, Ciencias)")
else:
    print("ERROR - Marcador no encontrado")
