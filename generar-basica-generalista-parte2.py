#!/usr/bin/env python3
"""
Script para agregar DOMINIO 1.2: Enseñanza-Aprendizaje de Lenguaje
"""

import os

archivo_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo_path, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Buscar el marcador de cierre del DOMINIO 1
marcador = '  </div>\n</div>'

# DOMINIO 1.2: ENSEÑANZA-APRENDIZAJE
dom1_sec2 = """
  <!-- 1.2 ENSEÑANZA-APRENDIZAJE EN LENGUAJE -->
  <div class="mb-12">
    <h3 class="text-3xl font-bold text-gray-800 mb-6">1.2 Enseñanza-Aprendizaje en Lenguaje y Comunicación</h3>
    
    <!-- Comprensión Lectora -->
    <div class="strategy-box">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">📖 Estrategias de Comprensión Lectora</h4>
      <p class="text-gray-700 mb-4">
        La comprensión lectora se trabaja en <strong>tres momentos clave</strong> con estrategias específicas:
      </p>
      
      <div class="progress-indicator mb-6">
        <div class="progress-step">
          <div class="progress-circle active">1</div>
          <div class="text-sm font-semibold">ANTES</div>
        </div>
        <div class="progress-step">
          <div class="progress-circle active">2</div>
          <div class="text-sm font-semibold">DURANTE</div>
        </div>
        <div class="progress-step">
          <div class="progress-circle active">3</div>
          <div class="text-sm font-semibold">DESPUÉS</div>
        </div>
      </div>
      
      <table class="table-modern">
        <thead>
          <tr>
            <th>Momento</th>
            <th>Objetivo</th>
            <th>Estrategias</th>
            <th>Ejemplo de Actividad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong class="text-green-600">ANTES</strong></td>
            <td>Activar conocimientos previos y establecer propósito</td>
            <td>
              • Predicciones<br>
              • Observar título e imágenes<br>
              • Preguntas anticipatorias<br>
              • KWL (Qué sé, qué quiero saber)
            </td>
            <td class="text-sm">"Observen la portada del libro. ¿De qué creen que tratará?"</td>
          </tr>
          <tr>
            <td><strong class="text-blue-600">DURANTE</strong></td>
            <td>Monitorear la comprensión y construir significado</td>
            <td>
              • Subrayar ideas principales<br>
              • Hacer pausas para resumir<br>
              • Visualización mental<br>
              • Preguntas de verificación
            </td>
            <td class="text-sm">"Paremos aquí. ¿Qué ha pasado hasta ahora? ¿Qué creen que sucederá?"</td>
          </tr>
          <tr>
            <td><strong class="text-purple-600">DESPUÉS</strong></td>
            <td>Consolidar la comprensión y evaluar</td>
            <td>
              • Resumen oral o escrito<br>
              • Organizadores gráficos<br>
              • Debate sobre el texto<br>
              • Conexiones personales
            </td>
            <td class="text-sm">"Completen este diagrama con los eventos principales del cuento"</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Niveles de Comprensión -->
    <div class="definition-box mt-6">
      <h4 class="text-2xl font-bold text-purple-700 mb-4">🔺 Niveles de Comprensión Lectora</h4>
      <p class="text-gray-700 mb-4">
        En el Primer Ciclo se trabajan <strong>tres niveles progresivos</strong> de comprensión:
      </p>
      
      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <div class="bg-purple-100 p-4 rounded-lg">
          <h5 class="font-bold text-lg text-purple-700 mb-2">1️⃣ LITERAL</h5>
          <p class="text-sm mb-2">Identificar información <strong>explícita</strong> en el texto</p>
          <div class="bg-white p-3 rounded mt-2">
            <strong class="text-xs">Preguntas tipo:</strong>
            <ul class="text-xs mt-1 ml-4 list-disc">
              <li>¿Quién...?</li>
              <li>¿Dónde...?</li>
              <li>¿Cuándo...?</li>
              <li>¿Qué...?</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-blue-100 p-4 rounded-lg">
          <h5 class="font-bold text-lg text-blue-700 mb-2">2️⃣ INFERENCIAL</h5>
          <p class="text-sm mb-2">Deducir información <strong>implícita</strong> usando pistas del texto</p>
          <div class="bg-white p-3 rounded mt-2">
            <strong class="text-xs">Preguntas tipo:</strong>
            <ul class="text-xs mt-1 ml-4 list-disc">
              <li>¿Por qué...?</li>
              <li>¿Qué significa...?</li>
              <li>¿Qué se puede concluir...?</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-green-100 p-4 rounded-lg">
          <h5 class="font-bold text-lg text-green-700 mb-2">3️⃣ CRÍTICO</h5>
          <p class="text-sm mb-2">Evaluar y <strong>emitir juicios</strong> sobre el texto</p>
          <div class="bg-white p-3 rounded mt-2">
            <strong class="text-xs">Preguntas tipo:</strong>
            <ul class="text-xs mt-1 ml-4 list-disc">
              <li>¿Estás de acuerdo...?</li>
              <li>¿Qué opinas...?</li>
              <li>¿Es válido...?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Gramática y Vocabulario -->
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-orange-700 mb-4">📝 Gramática y Vocabulario</h4>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h5 class="text-xl font-bold mb-3">Morfosintaxis (Gramática)</h5>
          <div class="bg-white p-4 rounded-lg mb-4">
            <p class="font-semibold mb-2">Estrategias didácticas:</p>
            <ul class="list-disc ml-6 space-y-2">
              <li><strong>Manipulación de oraciones:</strong> Cambiar orden, expandir, reducir</li>
              <li><strong>Juegos gramaticales:</strong> Bingo de sustantivos, carrera de verbos</li>
              <li><strong>Construcción guiada:</strong> Completar oraciones con conectores</li>
              <li><strong>Análisis contextual:</strong> Identificar funciones en textos reales</li>
            </ul>
          </div>
          
          <div class="bg-orange-50 p-3 rounded">
            <strong class="text-sm">Ejemplo de actividad:</strong>
            <p class="text-sm mt-2">
              "Transformen esta oración de singular a plural: <br>
              <em>El gato negro duerme en la ventana</em> → <br>
              <em>Los gatos negros duermen en las ventanas</em>"
            </p>
          </div>
        </div>
        
        <div>
          <h5 class="text-xl font-bold mb-3">Conciencia Semántica y Vocabulario</h5>
          <div class="bg-white p-4 rounded-lg mb-4">
            <p class="font-semibold mb-2">Estrategias para ampliar vocabulario:</p>
            <ul class="list-disc ml-6 space-y-2">
              <li><strong>Familias de palabras:</strong> Raíces, prefijos, sufijos (sal-salado-salino-salero)</li>
              <li><strong>Inferencia contextual:</strong> Deducir significado por contexto</li>
              <li><strong>Sinónimos y antónimos:</strong> Juegos de reemplazo</li>
              <li><strong>Palabras clave:</strong> Muros de palabras temáticos</li>
            </ul>
          </div>
          
          <div class="bg-blue-50 p-3 rounded">
            <strong class="text-sm">Ejemplo:</strong>
            <p class="text-sm mt-2">
              "Identifiquen la raíz de estas palabras:<br>
              <strong>libr</strong>o, <strong>libr</strong>ería, <strong>libr</strong>ero, <strong>libr</strong>eta"
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Proceso de Escritura -->
    <div class="strategy-box mt-6">
      <h4 class="text-2xl font-bold text-blue-700 mb-4">✍️ Fases de la Escritura</h4>
      <p class="text-gray-700 mb-4">
        La escritura es un <strong>proceso recursivo</strong> que incluye cuatro fases interconectadas:
      </p>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
          <h5 class="font-bold text-lg text-green-600 mb-3">1️⃣ PLANIFICACIÓN</h5>
          <p class="text-sm mb-3"><strong>Objetivo:</strong> Organizar ideas antes de escribir</p>
          <p class="text-sm font-semibold mb-2">Actividades:</p>
          <ul class="text-sm list-disc ml-6 space-y-1">
            <li>Lluvia de ideas</li>
            <li>Organizadores gráficos (mapa mental, esquema)</li>
            <li>Definir propósito y audiencia</li>
            <li>Seleccionar género textual</li>
          </ul>
        </div>
        
        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
          <h5 class="font-bold text-lg text-blue-600 mb-3">2️⃣ TEXTUALIZACIÓN</h5>
          <p class="text-sm mb-3"><strong>Objetivo:</strong> Escribir el primer borrador</p>
          <p class="text-sm font-semibold mb-2">Actividades:</p>
          <ul class="text-sm list-disc ml-6 space-y-1">
            <li>Escritura libre sin detenerse</li>
            <li>Seguir la estructura planificada</li>
            <li>Usar conectores apropiados</li>
            <li>Aplicar vocabulario aprendido</li>
          </ul>
        </div>
        
        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-orange-500">
          <h5 class="font-bold text-lg text-orange-600 mb-3">3️⃣ REVISIÓN</h5>
          <p class="text-sm mb-3"><strong>Objetivo:</strong> Mejorar contenido y estructura</p>
          <p class="text-sm font-semibold mb-2">Actividades:</p>
          <ul class="text-sm list-disc ml-6 space-y-1">
            <li>Leer en voz alta</li>
            <li>Revisión entre pares</li>
            <li>Rúbricas de autoevaluación</li>
            <li>Conferencias con el docente</li>
          </ul>
        </div>
        
        <div class="bg-white p-5 rounded-lg shadow border-l-4 border-purple-500">
          <h5 class="font-bold text-lg text-purple-600 mb-3">4️⃣ EDICIÓN</h5>
          <p class="text-sm mb-3"><strong>Objetivo:</strong> Corregir aspectos formales</p>
          <p class="text-sm font-semibold mb-2">Actividades:</p>
          <ul class="text-sm list-disc ml-6 space-y-1">
            <li>Ortografía y puntuación</li>
            <li>Coherencia y cohesión</li>
            <li>Presentación final</li>
            <li>Publicación del texto</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Comunicación Oral -->
    <div class="definition-box mt-6">
      <h4 class="text-2xl font-bold text-pink-700 mb-4">🗣️ Desarrollo de la Comunicación Oral</h4>
      
      <table class="table-modern">
        <thead>
          <tr>
            <th>Habilidad Oral</th>
            <th>Estrategias Didácticas</th>
            <th>Actividades Tipo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Participación en conversaciones</strong></td>
            <td>Círculos de diálogo, debates estructurados, turnos de habla</td>
            <td>"Cuéntale a tu compañero sobre tu fin de semana"</td>
          </tr>
          <tr>
            <td><strong>Fórmulas de cortesía</strong></td>
            <td>Role-playing, dramatizaciones, modelamiento del docente</td>
            <td>Simular situaciones: pedir permiso, saludar, agradecer</td>
          </tr>
          <tr>
            <td><strong>Narración oral</strong></td>
            <td>Cuentacuentos, renarración de historias, secuencias temporales</td>
            <td>"Cuenten un cuento tradicional usando este apoyo visual"</td>
          </tr>
          <tr>
            <td><strong>Recitación</strong></td>
            <td>Memorización guiada, entonación, expresión corporal</td>
            <td>Festival de poesía, trabalenguas, adivinanzas</td>
          </tr>
          <tr>
            <td><strong>Expresión de ideas</strong></td>
            <td>Presentaciones orales, show and tell, preguntas abiertas</td>
            <td>"Expliquen a la clase cómo se hace su juego favorito"</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Conciencia Fonológica -->
    <div class="example-box mt-6">
      <h4 class="text-2xl font-bold text-red-700 mb-4">🔤 Conciencia Fonológica</h4>
      <p class="text-gray-700 mb-4">
        Fundamental para el aprendizaje de la lectoescritura. Se desarrolla de forma <strong>progresiva</strong>:
      </p>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h5 class="text-xl font-bold mb-3 text-blue-600">Conciencia Silábica</h5>
          <div class="bg-white p-4 rounded-lg">
            <p class="font-semibold mb-2">Actividades:</p>
            <ul class="list-disc ml-6 space-y-2 text-sm">
              <li><strong>Segmentación:</strong> "Aplaudan por cada sílaba: MA-RI-PO-SA" (4 aplausos)</li>
              <li><strong>Identificación:</strong> "¿Cuál es la primera sílaba de MESA?" (ME)</li>
              <li><strong>Omisión:</strong> "Si a GATO le quitamos TO, ¿qué queda?" (GA)</li>
              <li><strong>Adición:</strong> "Si a SOL le agregamos al inicio LA, ¿qué palabra se forma?" (LASOL)</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h5 class="text-xl font-bold mb-3 text-green-600">Conciencia Fonémica</h5>
          <div class="bg-white p-4 rounded-lg">
            <p class="font-semibold mb-2">Actividades:</p>
            <ul class="list-disc ml-6 space-y-2 text-sm">
              <li><strong>Reconocimiento:</strong> "¿Con qué sonido empieza MESA?" (/m/)</li>
              <li><strong>Segmentación:</strong> "Separen los sonidos de SOL" (/s/ /o/ /l/)</li>
              <li><strong>Síntesis:</strong> "Si junto /m/ /a/ /r/, ¿qué palabra es?" (MAR)</li>
              <li><strong>Manipulación:</strong> "Cambien /p/ de PATO por /g/. ¿Qué palabra resulta?" (GATO)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Evaluación Formativa -->
    <div class="strategy-box mt-6">
      <h4 class="text-2xl font-bold text-purple-700 mb-4">📊 Evaluación y Retroalimentación</h4>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h5 class="text-xl font-bold mb-4">Instrumentos de Evaluación en Lenguaje</h5>
        
        <div class="grid md:grid-cols-3 gap-4">
          <div class="border-l-4 border-blue-500 pl-4">
            <h6 class="font-bold text-blue-600 mb-2">Comprensión Lectora</h6>
            <ul class="text-sm list-disc ml-4 space-y-1">
              <li>Preguntas de selección múltiple (literal, inferencial, crítico)</li>
              <li>Rúbricas de resumen oral/escrito</li>
              <li>Organizadores gráficos</li>
            </ul>
          </div>
          
          <div class="border-l-4 border-green-500 pl-4">
            <h6 class="font-bold text-green-600 mb-2">Escritura</h6>
            <ul class="text-sm list-disc ml-4 space-y-1">
              <li>Rúbricas analíticas (contenido, estructura, ortografía)</li>
              <li>Portafolios de escritura</li>
              <li>Listas de cotejo por fases</li>
            </ul>
          </div>
          
          <div class="border-l-4 border-orange-500 pl-4">
            <h6 class="font-bold text-orange-600 mb-2">Oralidad</h6>
            <ul class="text-sm list-disc ml-4 space-y-1">
              <li>Escalas de apreciación de presentaciones</li>
              <li>Autoevaluación de participación</li>
              <li>Coevaluación entre pares</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-6 bg-purple-50 p-4 rounded-lg">
          <p class="font-semibold text-purple-700 mb-2">💡 Principios de Retroalimentación Efectiva:</p>
          <ul class="text-sm space-y-2">
            <li>✓ <strong>Específica:</strong> "Tu resumen captura bien la idea principal, pero falta mencionar..."</li>
            <li>✓ <strong>Oportuna:</strong> Entregar feedback mientras el aprendizaje está fresco</li>
            <li>✓ <strong>Orientada a la mejora:</strong> "Para mejorar tu texto, podrías agregar conectores como 'por lo tanto' o 'sin embargo'"</li>
            <li>✓ <strong>Basada en criterios:</strong> Usar rúbricas conocidas por los estudiantes</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
"""

# Encontrar la posición donde insertar (después del cierre del dominio 1.1)
# Buscar específicamente el final de la sección 1.1
posicion = contenido.find('    </div>\n  </div>\n</div>')

if posicion != -1:
    # Insertar la nueva sección antes del cierre del dominio
    contenido_nuevo = contenido[:posicion] + dom1_sec2 + '\n' + contenido[posicion:]
    
    with open(archivo_path, 'w', encoding='utf-8') as f:
        f.write(contenido_nuevo)
    
    print("✅ DOMINIO 1.2 - Enseñanza-Aprendizaje de Lenguaje agregado exitosamente")
    print("📊 Secciones completadas: 1.1 ✓ | 1.2 ✓")
    print("🔜 Próximo: DOMINIO 2 - Matemática (parte3.py)")
else:
    print("❌ Error: No se encontró el marcador de inserción")
    print("Verifica que el archivo tenga la estructura correcta")
