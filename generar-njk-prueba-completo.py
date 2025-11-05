# -*- coding: utf-8 -*-
"""
Script para generar archivo .njk completo de Prueba Básica Generalista
Lee el JSON de preguntas y genera HTML/JS completo
"""

import json

# Leer datos
with open('prueba-basica-generalista-datos.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

preguntas = datos['preguntas']

# Colores por dominio
colores = {
    'lenguaje': 'purple',
    'matematica': 'blue',
    'historia': 'orange',
    'ciencias': 'green'
}

# Generar archivo .njk
contenido_njk = '''---
layout: layout-evaluaciones.njk
title: "Prueba Estandarizada: Educación Básica Primer Ciclo Generalista"
description: "Evaluación objetiva con 30 ítems de selección múltiple basada en Bases Curriculares 1° a 3° básico. Incluye corrección automática y retroalimentación pedagógica."
---

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-5xl mx-auto">

      <!-- Encabezado -->
      <div class="text-center mb-12">
        <div class="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          📚 Educación Básica Primer Ciclo Generalista ECEP 2025
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Prueba Estandarizada
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          30 preguntas objetivas con retroalimentación pedagógica basada en Bases Curriculares 1° a 3° básico
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span>45-60 minutos</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
            <span>30 preguntas</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            <span>Corrección automática</span>
          </div>
        </div>
        <a href="/evaluaciones/educacion-basica/estudio/basica-generalista/" class="mt-6 inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
          </svg>
          Volver a Guía de Estudio
        </a>
      </div>

      <!-- Instrucciones -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 shadow-sm">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-bold text-blue-900 mb-2">📖 Instrucciones</h3>
            <ul class="text-sm text-blue-800 space-y-2">
              <li>✓ Responde las 30 preguntas seleccionando la alternativa que consideres correcta</li>
              <li>✓ Cada pregunta tiene solo una respuesta correcta</li>
              <li>✓ Al finalizar, presiona "Revisar respuestas" para ver tu puntaje</li>
              <li>✓ Recibirás retroalimentación pedagógica detallada sobre cada respuesta</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <div class="text-3xl font-bold text-purple-600">8</div>
          <div class="text-sm text-gray-600">Lenguaje</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <div class="text-3xl font-bold text-blue-600">8</div>
          <div class="text-sm text-gray-600">Matemática</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <div class="text-3xl font-bold text-orange-600">7</div>
          <div class="text-sm text-gray-600">Historia</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <div class="text-3xl font-bold text-green-600">7</div>
          <div class="text-sm text-gray-600">Ciencias</div>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-semibold text-gray-700">Progreso</span>
          <span class="text-sm font-bold text-purple-600" id="progress-text">0/30 respondidas</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div id="progress-bar" class="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
      </div>

      <!-- Formulario de preguntas -->
      <div id="quiz-container" class="space-y-6">
        <form id="quiz-form">
'''

# Generar HTML para cada pregunta
for i, pregunta in enumerate(preguntas, 1):
    # Determinar dominio por número
    if i <= 8:
        dominio = 'lenguaje'
        color = 'purple'
    elif i <= 16:
        dominio = 'matematica'
        color = 'blue'
    elif i <= 23:
        dominio = 'historia'
        color = 'orange'
    else:
        dominio = 'ciencias'
        color = 'green'
    
    contenido_njk += f'''
          <!-- Pregunta {i} -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 border-l-4 border-{color}-400" id="pregunta-{i}">
            
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-{color}-500 to-{color}-600 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-md">
                  {i}
                </span>
                <span class="inline-block bg-{color}-100 text-{color}-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {pregunta['tema']}
                </span>
              </div>
            </div>

            <p class="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
              {pregunta['enunciado']}
            </p>

            <div class="space-y-3 mb-6">
'''
    
    # Generar alternativas
    for alt in pregunta['alternativas']:
        contenido_njk += f'''              <label class="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-{color}-400 hover:bg-{color}-50 cursor-pointer transition-all duration-200 group">
                <input 
                  type="radio" 
                  name="pregunta-{i}" 
                  value="{alt['op']}" 
                  class="mt-1 h-5 w-5 text-{color}-600 focus:ring-{color}-500 border-gray-300 cursor-pointer"
                  data-question="{i}"
                  required
                >
                <span class="ml-4 text-gray-800 group-hover:text-gray-900 font-medium">
                  <strong class="text-{color}-600">{alt['op']})</strong> {alt['texto']}
                </span>
              </label>
'''
    
    contenido_njk += f'''            </div>

            <div id="feedback-{i}" class="hidden mt-6"></div>

          </div>
'''

# Cerrar formulario y agregar botón
contenido_njk += '''
          <!-- Botón revisar -->
          <div class="mt-10 text-center">
            <button 
              type="submit" 
              class="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              ✅ Revisar mis respuestas
            </button>
          </div>
        </form>

        <!-- Resultado final -->
        <div id="resultado-final" class="hidden mt-10">
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl shadow-xl p-8 text-center">
            <div class="mb-6">
              <svg class="w-20 h-20 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Resultados</h2>
            <div class="text-6xl font-bold text-purple-600 mb-4" id="puntaje-total">0/30</div>
            <p class="text-xl text-gray-700 mb-6">
              <span id="porcentaje-total">0%</span> de respuestas correctas
            </p>
            
            <!-- Desglose por dominios -->
            <div class="grid md:grid-cols-4 gap-4 mt-8">
              <div class="bg-white rounded-lg p-4">
                <div class="text-sm text-gray-600 mb-2">📖 Lenguaje</div>
                <div class="text-2xl font-bold text-purple-600" id="puntaje-lenguaje">0/8</div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="text-sm text-gray-600 mb-2">🔢 Matemática</div>
                <div class="text-2xl font-bold text-blue-600" id="puntaje-matematica">0/8</div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="text-sm text-gray-600 mb-2">🌎 Historia</div>
                <div class="text-2xl font-bold text-orange-600" id="puntaje-historia">0/7</div>
              </div>
              <div class="bg-white rounded-lg p-4">
                <div class="text-sm text-gray-600 mb-2">🔬 Ciencias</div>
                <div class="text-2xl font-bold text-green-600" id="puntaje-ciencias">0/7</div>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
              <a href="/evaluaciones/educacion-basica/estudio/basica-generalista/" class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                Ir a Guía de Estudio
              </a>
              <button onclick="location.reload()" class="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
                Reintentar Prueba
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script>
  // ==================== SISTEMA DE EVALUACIÓN ====================
  
  // Base de datos de respuestas correctas
  const respuestasCorrectas = {
'''

# Agregar respuestas correctas al JavaScript
for pregunta in preguntas:
    contenido_njk += f"    '{pregunta['num']}': '{pregunta['correcta']}',\n"

contenido_njk += '''  };

  // Base de datos de justificaciones
  const justificaciones = {
'''

# Agregar justificaciones
for pregunta in preguntas:
    justificacion_escapada = pregunta['justificacion'].replace("'", "\\'").replace('"', '\\"')
    contenido_njk += f"    '{pregunta['num']}': '{justificacion_escapada}',\n"

contenido_njk += '''  };

  // Contador de respuestas
  let respuestas = {};
  const totalPreguntas = 30;

  // Event listeners para radio buttons
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const questionNum = this.dataset.question;
      respuestas[questionNum] = this.value;
      
      // Actualizar progreso
      const respondidas = Object.keys(respuestas).length;
      const porcentaje = (respondidas / totalPreguntas) * 100;
      document.getElementById('progress-bar').style.width = porcentaje + '%';
      document.getElementById('progress-text').textContent = `${respondidas}/${totalPreguntas} respondidas`;
    });
  });

  // Manejar envío del formulario
  document.getElementById('quiz-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Verificar que estén todas respondidas
    if (Object.keys(respuestas).length < totalPreguntas) {
      alert(`Por favor responde todas las preguntas. Te faltan ${totalPreguntas - Object.keys(respuestas).length} preguntas.`);
      return;
    }
    
    // Calcular resultados
    let correctas = 0;
    let correctasPorDominio = {
      lenguaje: 0,
      matematica: 0,
      historia: 0,
      ciencias: 0
    };
    
    for (let i = 1; i <= totalPreguntas; i++) {
      const respuestaUsuario = respuestas[i];
      const respuestaCorrecta = respuestasCorrectas[i];
      const esCorrecto = respuestaUsuario === respuestaCorrecta;
      
      if (esCorrecto) {
        correctas++;
        
        // Contar por dominio
        if (i <= 8) correctasPorDominio.lenguaje++;
        else if (i <= 16) correctasPorDominio.matematica++;
        else if (i <= 23) correctasPorDominio.historia++;
        else correctasPorDominio.ciencias++;
      }
      
      // Mostrar feedback
      mostrarFeedback(i, esCorrecto, respuestaCorrecta);
    }
    
    // Mostrar resultado final
    const porcentaje = ((correctas / totalPreguntas) * 100).toFixed(1);
    document.getElementById('puntaje-total').textContent = `${correctas}/${totalPreguntas}`;
    document.getElementById('porcentaje-total').textContent = `${porcentaje}%`;
    document.getElementById('puntaje-lenguaje').textContent = `${correctasPorDominio.lenguaje}/8`;
    document.getElementById('puntaje-matematica').textContent = `${correctasPorDominio.matematica}/8`;
    document.getElementById('puntaje-historia').textContent = `${correctasPorDominio.historia}/7`;
    document.getElementById('puntaje-ciencias').textContent = `${correctasPorDominio.ciencias}/7`;
    
    document.getElementById('resultado-final').classList.remove('hidden');
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function mostrarFeedback(numPregunta, esCorrecto, respuestaCorrecta) {
    const feedbackDiv = document.getElementById(`feedback-${numPregunta}`);
    const justificacion = justificaciones[numPregunta];
    
    if (esCorrecto) {
      feedbackDiv.innerHTML = `
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
              <h4 class="font-bold text-green-900 mb-2">✅ ¡Correcto!</h4>
              <p class="text-sm text-green-800"><strong>Fundamentación pedagógica:</strong> ${justificacion}</p>
            </div>
          </div>
        </div>
      `;
    } else {
      feedbackDiv.innerHTML = `
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <div>
              <h4 class="font-bold text-red-900 mb-2">❌ Incorrecto</h4>
              <p class="text-sm text-red-800 mb-2">La respuesta correcta es: <strong>${respuestaCorrecta}</strong></p>
              <p class="text-sm text-red-800"><strong>Fundamentación pedagógica:</strong> ${justificacion}</p>
            </div>
          </div>
        </div>
      `;
    }
    
    feedbackDiv.classList.remove('hidden');
  }
</script>
'''

# Guardar archivo
output_path = 'evaluaciones/educacion-basica/pruebas/basica-generalista/index.njk'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(contenido_njk)

print("=" * 80)
print("✅ PRUEBA ESTANDARIZADA GENERADA EXITOSAMENTE")
print("=" * 80)
print(f"📁 Archivo: {output_path}")
print(f"📊 Total: {len(preguntas)} preguntas")
print(f"📝 Distribución: 8 Lenguaje + 8 Matemática + 7 Historia + 7 Ciencias")
print(f"💾 Tamaño: ~{len(contenido_njk)} caracteres")
print("=" * 80)
print("\n🎯 Características:")
print("   ✓ Corrección automática")
print("   ✓ Retroalimentación pedagógica detallada")
print("   ✓ Puntaje por dominio")
print("   ✓ Barra de progreso interactiva")
print("   ✓ Diseño responsivo")
print("   ✓ Basado en Bases Curriculares 1°-3° básico")
print("\n🌐 URL de acceso:")
print("   /evaluaciones/educacion-basica/pruebas/basica-generalista/")
print("=" * 80)
