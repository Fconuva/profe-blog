# -*- coding: utf-8 -*-
"""
Script para actualizar el template de Matemática con casos de estudio
Aplica los mismos cambios que se hicieron en Lenguaje
"""

# Leer el template actual
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/practica.njk', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazos globales
reemplazos = [
    # Actualizar descripciones
    ('50 preguntas oficiales con retroalimentación pedagógica inteligente', 
     '50 preguntas + 10 casos de estudio con retroalimentación pedagógica inteligente'),
    
    ('<span>50 preguntas</span>', 
     '<span>70 preguntas</span>'),
    
    ('<li>✓ Responde las 50 preguntas de selección múltiple</li>',
     '<li>✓ Responde las 50 preguntas regulares + 10 casos de estudio (70 total)</li>'),
    
    ('id="progress-text">0/50 respondidas</span>',
     'id="progress-text">0/70 respondidas</span>'),
    
    ('<span id="puntaje"></span>/50',
     '<span id="puntaje"></span>/70'),
    
    # Actualizar JavaScript - constantes
    ('const totalPreguntas = plan.exam.preguntas.length;',
     '''const totalPreguntasRegulares = plan.exam.preguntas.length;
  const totalCasos = plan.casos_estudio ? plan.casos_estudio.length * 2 : 0;
  const totalPreguntas = totalPreguntasRegulares + totalCasos;'''),
    
    # Agregar comentario PREGUNTAS REGULARES
    ('<!-- Contenedor del Quiz -->\n      <div id="quiz-container" class="space-y-6">\n        <form id="quiz-form">\n          {% for pregunta in plan.exam.preguntas %}',
     '''<!-- Contenedor del Quiz -->
      <div id="quiz-container" class="space-y-6">
        <form id="quiz-form">
          <!-- PREGUNTAS REGULARES (1-50) -->
          {% for pregunta in plan.exam.preguntas %}'''),
]

for old, new in reemplazos:
    content = content.replace(old, new)

# Agregar sección de casos de estudio antes del botón revisar
casos_section = '''
          <!-- CASOS DE ESTUDIO (51+) -->
          {% if plan.casos_estudio %}
            <div class="mt-12 mb-8 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 rounded-2xl p-8">
              <div class="text-center">
                <h2 class="text-3xl font-bold text-amber-900 mb-3">📚 Casos de Estudio Matemáticos</h2>
                <p class="text-amber-800 text-lg">
                  Situaciones pedagógicas reales para evaluar tu comprensión contextualizada
                </p>
              </div>
            </div>

            {% for caso in plan.casos_estudio %}
              {% set casoNum = loop.index + 50 %}
              
              <!-- Contexto del caso -->
              <div class="bg-gradient-to-br from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-xl p-8 shadow-lg mb-6">
                <div class="flex items-center gap-3 mb-4">
                  <span class="bg-amber-500 text-white font-bold px-4 py-2 rounded-full text-sm">
                    CASO {{ loop.index }}
                  </span>
                  <h3 class="text-xl font-bold text-amber-900">Situación Pedagógica</h3>
                </div>
                <div class="bg-white rounded-lg p-6 text-gray-800 leading-relaxed border border-amber-200">
                  {{ caso.contexto | safe }}
                </div>
              </div>

              <!-- Pregunta única del caso -->
              <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 border-l-4 border-amber-400 mb-8" id="pregunta-{{ casoNum }}">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <span class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-md">
                      {{ casoNum }}
                    </span>
                    <span class="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Caso de Estudio
                    </span>
                  </div>
                </div>

                <p class="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
                  {{ caso.enunciado | safe }}
                </p>

                <div class="space-y-3 mb-6">
                  {% for alt in caso.alternativas %}
                    <label class="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-all duration-200 group">
                      <input 
                        type="radio" 
                        name="pregunta-{{ casoNum }}" 
                        value="{{ alt.opcion }}" 
                        class="mt-1 h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 cursor-pointer"
                        data-question="{{ casoNum }}"
                      >
                      <span class="ml-4 text-gray-800 group-hover:text-gray-900 font-medium">
                        <strong class="text-amber-600">{{ alt.opcion }})</strong> {{ alt.texto }}
                      </span>
                    </label>
                  {% endfor %}
                </div>

                <div id="feedback-{{ casoNum }}" class="hidden"></div>
                <div id="ia-actions-{{ casoNum }}" class="mt-4 hidden">
                  <button 
                    type="button" 
                    data-q="{{ casoNum }}" 
                    class="ia-btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                    </svg>
                    Consultar IA - Ver Explicación Completa
                  </button>
                </div>
                <div id="ia-feedback-{{ casoNum }}" class="mt-4 hidden"></div>
              </div>
            {% endfor %}
          {% endif %}
          '''

# Insertar antes de "<!-- Botón revisar -->"
content = content.replace('          <!-- Botón revisar -->', casos_section + '\n          <!-- Botón revisar -->')

# Guardar
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/practica.njk', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Template de Matemática actualizado con casos de estudio")
print("  - Sección de casos agregada")
print("  - Progreso actualizado a 70 preguntas")
print("  - JavaScript pendiente de actualizar manualmente")
