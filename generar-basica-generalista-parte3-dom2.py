#!/usr/bin/env python3
import os

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

dom2 = """

<!-- ==================== DOMINIO 2: MATEMÁTICA ==================== -->
<div class="dominio-card dominio-matematica">
  <h2 class="text-4xl font-bold text-blue-600 mb-6">
    <span class="icon-badge" style="background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);">🔢</span>
    DOMINIO 2: MATEMÁTICA
  </h2>
  
  <!-- 2.1 CONTENIDOS -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">2.1 Contenidos Relevantes de Matemática</h3>
    
    <div class="definition-box">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">➕ Operaciones y Propiedades</h4>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded-lg">
          <h5 class="font-bold mb-2">Propiedades de Adición</h5>
          <ul class="text-sm space-y-2">
            <li><strong>Conmutativa:</strong> a + b = b + a</li>
            <li><strong>Asociativa:</strong> (a + b) + c = a + (b + c)</li>
            <li><strong>Elemento neutro:</strong> a + 0 = a</li>
          </ul>
        </div>
        <div class="bg-white p-4 rounded-lg">
          <h5 class="font-bold mb-2">Propiedades de Multiplicación</h5>
          <ul class="text-sm space-y-2">
            <li><strong>Conmutativa:</strong> a × b = b × a</li>
            <li><strong>Asociativa:</strong> (a × b) × c = a × (b × c)</li>
            <li><strong>Distributiva:</strong> a × (b + c) = a×b + a×c</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-orange-700 mb-4">🍕 Fracciones</h4>
      <table class="table-modern">
        <thead>
          <tr><th>Concepto</th><th>Ejemplo</th><th>Aplicación</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Fracciones equivalentes</strong></td>
            <td>1/2 = 2/4 = 3/6</td>
            <td>Multiplicar o dividir numerador y denominador por el mismo número</td>
          </tr>
          <tr>
            <td><strong>Comparación</strong></td>
            <td>3/4 > 2/3</td>
            <td>Amplificar a común denominador o usar representación decimal</td>
          </tr>
          <tr>
            <td><strong>Simplificación</strong></td>
            <td>6/8 = 3/4</td>
            <td>Dividir por el máximo común divisor (MCD)</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="strategy-box mt-6">
      <h4 class="text-2xl font-bold text-green-700 mb-4">📐 Geometría</h4>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white p-4 rounded-lg">
          <h5 class="font-bold text-blue-600 mb-2">Ángulos</h5>
          <p class="text-sm">• Agudo: 0° < α < 90°<br>• Recto: α = 90°<br>• Obtuso: 90° < α < 180°</p>
        </div>
        <div class="bg-white p-4 rounded-lg">
          <h5 class="font-bold text-green-600 mb-2">Perímetro</h5>
          <p class="text-sm">Suma de todos los lados<br>Cuadrado: P = 4L<br>Rectángulo: P = 2(L+A)</p>
        </div>
        <div class="bg-white p-4 rounded-lg">
          <h5 class="font-bold text-purple-600 mb-2">Área</h5>
          <p class="text-sm">Superficie interior<br>Cuadrado: A = L²<br>Rectángulo: A = L×A</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 2.2 ENSEÑANZA-APRENDIZAJE -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">2.2 Enseñanza-Aprendizaje en Matemática</h3>
    
    <div class="strategy-box">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">🔢 Sistema de Numeración Decimal</h4>
      <table class="table-modern">
        <thead>
          <tr><th>Estrategia</th><th>Tipo de Representación</th><th>Actividad Ejemplo</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Material concreto</strong></td>
            <td>Bloques base 10, ábacos, fichas</td>
            <td>"Representen el número 345 con bloques de centenas, decenas y unidades"</td>
          </tr>
          <tr>
            <td><strong>Representación pictórica</strong></td>
            <td>Dibujos, tablas de valor posicional</td>
            <td>"Dibujen la cantidad de bloques necesarios para representar 2.456"</td>
          </tr>
          <tr>
            <td><strong>Representación simbólica</strong></td>
            <td>Números, notación expandida</td>
            <td>"Escriban 8.234 como: 8.000 + 200 + 30 + 4"</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="definition-box mt-6">
      <h4 class="text-2xl font-bold text-purple-700 mb-4">📊 Datos y Probabilidades</h4>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h5 class="font-bold mb-3">Etapas de trabajo:</h5>
          <ol class="list-decimal ml-6 space-y-2 text-sm">
            <li><strong>Recolección:</strong> Encuestas, experimentos, observación</li>
            <li><strong>Registro:</strong> Tablas de conteo, listas</li>
            <li><strong>Representación:</strong> Pictogramas, gráficos de barra</li>
            <li><strong>Interpretación:</strong> Análisis de tendencias y conclusiones</li>
          </ol>
        </div>
        <div>
          <h5 class="font-bold mb-3">Actividad modelo:</h5>
          <div class="bg-blue-50 p-3 rounded text-sm">
            <p class="font-semibold mb-2">Pregunta: "¿Cuál es tu fruta favorita?"</p>
            <p>1. Encuestar al curso<br>2. Registrar en tabla<br>3. Crear pictograma (1 símbolo = 2 estudiantes)<br>4. Analizar: "¿Cuál es la más popular?"</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-green-700 mb-4">🔄 Evaluación Formativa en Matemática</h4>
      <div class="bg-white p-6 rounded-lg">
        <p class="font-semibold mb-4">Estrategias de retroalimentación:</p>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="border-l-4 border-blue-500 pl-4">
            <h6 class="font-bold text-blue-600 mb-2">Reformular</h6>
            <p class="text-sm">"Intentemos este problema con números más pequeños primero: en vez de 345+278, probemos 3+2"</p>
          </div>
          <div class="border-l-4 border-green-500 pl-4">
            <h6 class="font-bold text-green-600 mb-2">Simplificar</h6>
            <p class="text-sm">"Dividamos este problema en pasos: primero calculemos el perímetro, luego el área"</p>
          </div>
          <div class="border-l-4 border-orange-500 pl-4">
            <h6 class="font-bold text-orange-600 mb-2">Cambiar representación</h6>
            <p class="text-sm">"Si no entiendes con números, dibujemos la fracción 3/4 con un círculo dividido"</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
"""

# Encontrar posición antes del script final
pos = contenido.find('</div>\n\n<script>')
if pos != -1:
    contenido_nuevo = contenido[:pos] + '</div>' + dom2 + '\n\n<script>' + contenido[pos+17:]
    with open(archivo, 'w', encoding='utf-8') as f:
        f.write(contenido_nuevo)
    print("OK - DOMINIO 2 agregado")
else:
    print("ERROR - Marcador no encontrado")
