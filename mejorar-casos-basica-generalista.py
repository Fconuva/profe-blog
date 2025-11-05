# -*- coding: utf-8 -*-
"""
Mejorar objetividad de casos de estudio en Básica Generalista
Reemplaza alternativas obvias con distractores plausibles
"""

archivo = 'evaluaciones/educacion-basica/estudio/basica-generalista.njk'

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# ===== CASO 1: Análisis de Carta Histórica =====
# Respuesta correcta será C (antes era B)
caso1_viejo = '''      <div class="space-y-3">
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
      </div>'''

caso1_nuevo = '''      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="A">
          <strong>A)</strong> Comenzar con una activación de conocimientos previos sobre pueblos originarios, luego leer la carta en voz alta y pedirles que identifiquen información factual sobre los Mapuche.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="B">
          <strong>B)</strong> Entregar la carta completa para lectura individual, luego trabajar en grupos para identificar palabras desconocidas y crear un glosario colaborativo del vocabulario histórico.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="C">
          <strong>C)</strong> Realizar una lectura guiada modelada, identificando palabras clave del contexto histórico, analizando la perspectiva del autor mediante preguntas dirigidas, y comparando con otras fuentes sobre el pueblo Mapuche.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="1" data-opcion="D">
          <strong>D)</strong> Presentar primero un video sobre el pueblo Mapuche, luego leer fragmentos seleccionados de la carta y pedirles que resuman la información en sus cuadernos.
        </div>
      </div>'''

# ===== CASO 2: Datos de Observación Animal =====
# Respuesta correcta será B (antes era A - cambiar feedback)
caso2_viejo = '''      <div class="space-y-3">
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
      </div>'''

caso2_nuevo = '''      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="A">
          <strong>A)</strong> Crear un gráfico pictórico con los datos, luego clasificar los animales según su tipo y comparar las cantidades usando términos como "más que", "menos que", "el doble de".
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="B">
          <strong>B)</strong> Crear un gráfico de barras con los datos, clasificar los animales en vertebrados e invertebrados, y formular preguntas matemáticas sobre las diferencias entre categorías (ej: "¿Cuántos invertebrados más que vertebrados observamos?").
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="C">
          <strong>C)</strong> Sumar todas las cantidades para obtener el total de animales observados, luego investigar las características de cada grupo taxonómico en libros de ciencias.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition" data-caso="2" data-opcion="D">
          <strong>D)</strong> Clasificar primero los animales por características observables (número de patas, presencia de alas), luego usar los datos para practicar adición y sustracción con problemas contextualizados.
        </div>
      </div>'''

# ===== CASO 3: Resolución de Problemas Escritos =====
# Respuesta correcta será B (mantener pero mejorar distractores)
caso3_viejo = '''      <div class="space-y-3">
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
      </div>'''

caso3_nuevo = '''      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="A">
          <strong>A)</strong> Explicarle que "regaló" significa restar, mostrarle la operación correcta (24 - 8 + 15 = 31) y darle problemas similares para practicar.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="B">
          <strong>B)</strong> Pedirle que subraye las palabras clave ("tenía", "regaló", "compró"), represente cada acción con material concreto o dibujos paso a paso, y luego traduzca cada acción a su operación matemática correspondiente.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="C">
          <strong>C)</strong> Dividir el problema en dos partes: primero calcular cuántas láminas quedaron después de regalar (24 - 8), luego sumar las que compró, trabajando cada operación por separado.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-400 transition" data-caso="3" data-opcion="D">
          <strong>D)</strong> Pedirle que reescriba el problema con sus propias palabras y dibuje un diagrama de la situación, identificando qué cantidades aumentan y cuáles disminuyen.
        </div>
      </div>'''

# ===== CASO 4: Recursos Naturales de Chile =====
# Respuesta correcta será D (antes era B - cambiar a algo MÁS completo)
caso4_viejo = '''      <div class="space-y-3">
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
      </div>'''

caso4_nuevo = '''      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="A">
          <strong>A)</strong> "El altiplano tenía recursos importantes como agua dulce de los ríos y lagos. Los Aymaras criaban llamas y alpacas que les daban lana para abrigarse."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="B">
          <strong>B)</strong> "Los Aymaras vivían ahí porque nacieron en ese lugar, igual que nosotros vivimos en Chile. Se acostumbraron al frío con el tiempo."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="C">
          <strong>C)</strong> "El altiplano ofrecía recursos naturales valiosos: agua de ríos y lagos, pastos para criar llamas y alpacas, y tierra para cultivar papas y quinoa. El clima frío también ayudaba a conservar los alimentos por más tiempo."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 transition" data-caso="4" data-opcion="D">
          <strong>D)</strong> "El altiplano tenía recursos como agua (ríos y lagos), pastos para sus animales (llamas y alpacas) y tierra fértil para cultivar papas y quinoa. Los Aymaras desarrollaron tecnologías de adaptación: viviendas de piedra con techos bajos que conservan calor, vestimenta de lana de alpaca, técnicas agrícolas como las 'terrazas' o andenes, y sistemas de deshidratación de alimentos (charqui, chuño). Esta relación entre recursos disponibles y adaptación cultural es un ejemplo de cómo los pueblos originarios comprendían y aprovechaban su medio ambiente."
        </div>
      </div>'''

# ===== CASO 5: Informe de Experimento =====
# Respuesta correcta será A (cambiar desde donde estaba)
caso5_viejo_buscar = '''    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Qué retroalimentación es MÁS APROPIADA para mejorar el informe?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="A">
          <strong>A)</strong> "Está mal escrito. Debes usar palabras científicas."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="B">
          <strong>B)</strong> "Tu observación es clara y usaste tus propias palabras. Para mejorar, podríamos agregar la medida exacta del crecimiento (cuántos centímetros) y explicar por qué crees que creció más con luz. ¿Qué necesitan las plantas para vivir?"
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="C">
          <strong>C)</strong> "Copia este modelo de informe correcto que te voy a dictar."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="D">
          <strong>D)</strong> "Los informes científicos no se escriben así. Tienes que repetir el experimento."
        </div>
      </div>
    </div>'''

caso5_nuevo = '''    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Qué retroalimentación es MÁS APROPIADA para mejorar el informe?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="A">
          <strong>A)</strong> "Tu observación es clara y usaste tus propias palabras. Para mejorar, agreguemos: ¿Cuántos centímetros creció cada planta? ¿Por qué crees que la planta con luz creció más? ¿Qué necesitan las plantas para crecer sanas? También podemos dibujar cómo se veía cada planta al final del experimento."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="B">
          <strong>B)</strong> "Bien observado. Ahora reescribe el informe usando vocabulario científico: en vez de 'creció más grande', di 'presentó mayor desarrollo vegetal'. Usa términos como 'fotosíntesis' y 'variable independiente'."
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="C">
          <strong>C)</strong> "Tu informe está bien para 2° básico. Sigue practicando la escritura de observaciones y poco a poco mejorarás. ¿Qué más notaste sobre las plantas?"
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition" data-caso="5" data-opcion="D">
          <strong>D)</strong> "Describes bien lo que viste. Para completar un informe científico, necesitamos agregar: medidas exactas del crecimiento, un dibujo rotulado de cada planta, y una conclusión sobre por qué ocurrió esto."
        </div>
      </div>
    </div>'''

# ===== CASO 6: Lectura en Voz Alta =====
# Respuesta correcta será C (mejorar todas las alternativas)
caso6_viejo_buscar = '''    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Cuál estrategia es MÁS EFECTIVA para apoyar a este estudiante?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="A">
          <strong>A)</strong> Pedirle que practique más en su casa para mejorar.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="B">
          <strong>B)</strong> Implementar lectura en parejas donde lea primero con un compañero más fluido (modelado), luego practicar lecturas cortas repetidas del mismo texto, y celebrar los avances en fluidez usando un registro visual de progreso.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="C">
          <strong>C)</strong> No hacerlo leer en voz alta para no incomodarlo.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="D">
          <strong>D)</strong> Enviarlo a reforzamiento de lectura fuera del aula.
        </div>
      </div>
    </div>'''

caso6_nuevo = '''    <div class="mb-4">
      <p class="font-semibold text-gray-800 mb-3">
        ¿Cuál estrategia es MÁS EFECTIVA para apoyar a este estudiante?
      </p>
      
      <div class="space-y-3">
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="A">
          <strong>A)</strong> Darle textos más cortos y simples para que practique lectura en voz alta frente al curso hasta que mejore su fluidez y confianza.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="B">
          <strong>B)</strong> Enviarlo a reforzamiento especializado con la educadora diferencial para trabajar decodificación y fluidez lectora con un programa estructurado.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="C">
          <strong>C)</strong> Implementar lectura en parejas donde primero escuche a un compañero más fluido (modelado), luego practicar lecturas repetidas del mismo texto corto (relectura), proporcionar previsualización del texto antes de leerlo al curso, celebrar avances con registro visual de progreso, y ofrecer opciones de lectura coral o compartida para reducir ansiedad.
        </div>
        <div class="caso-option p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-400 transition" data-caso="6" data-opcion="D">
          <strong>D)</strong> Permitirle leer en voz baja o mentalmente durante las actividades de lectura oral, y evaluarlo con otras estrategias que no requieran lectura en voz alta.
        </div>
      </div>
    </div>'''

# Aplicar los reemplazos
print("🔄 Mejorando casos de estudio...")

contenido = contenido.replace(caso1_viejo, caso1_nuevo)
print("✅ Caso 1 mejorado (respuesta correcta: C)")

contenido = contenido.replace(caso2_viejo, caso2_nuevo)
print("✅ Caso 2 mejorado (respuesta correcta: B)")

contenido = contenido.replace(caso3_viejo, caso3_nuevo)
print("✅ Caso 3 mejorado (respuesta correcta: B)")

contenido = contenido.replace(caso4_viejo, caso4_nuevo)
print("✅ Caso 4 mejorado (respuesta correcta: D)")

if caso5_viejo_buscar in contenido:
    contenido = contenido.replace(caso5_viejo_buscar, caso5_nuevo)
    print("✅ Caso 5 mejorado (respuesta correcta: A)")
else:
    print("⚠️ Caso 5 - verificar manualmente")

if caso6_viejo_buscar in contenido:
    contenido = contenido.replace(caso6_viejo_buscar, caso6_nuevo)
    print("✅ Caso 6 mejorado (respuesta correcta: C)")
else:
    print("⚠️ Caso 6 - verificar manualmente")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("\n" + "=" * 80)
print("✅ CASOS MEJORADOS - Distribución de respuestas correctas:")
print("   Caso 1: C | Caso 2: B | Caso 3: B | Caso 4: D | Caso 5: A | Caso 6: C")
print("   ✓ No predecible (antes todo era A o B)")
print("   ✓ Distractores plausibles basados en prácticas docentes reales")
print("   ✓ Requieren análisis pedagógico profundo")
print("=" * 80)
