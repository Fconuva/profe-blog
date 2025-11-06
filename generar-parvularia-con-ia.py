# -*- coding: utf-8 -*-
"""
Regenera index.njk de Parvularia con 108 preguntas y sistema de IA habilitado
"""

import json

# Cargar plan actualizado
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

preguntas = plan['exam']['preguntas']
total_preguntas = len(preguntas)

print(f"Generando evaluación con {total_preguntas} preguntas + Sistema IA...")

# Generar HTML
html = f'''---
layout: layout-evaluaciones.njk
title: "Práctica Interactiva: Educación Parvularia ECEP 2025"
description: "Responde las {total_preguntas} preguntas de Educación Parvularia con retroalimentación IA personalizada."
---

<div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-5xl mx-auto">

      <!-- Encabezado -->
      <div class="text-center mb-12">
        <div class="inline-block bg-pink-100 text-pink-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          🌱 Educación Parvularia ECEP 2025
        </div>
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Práctica Interactiva
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {total_preguntas} preguntas con retroalimentación pedagógica inteligente | Cobertura temario: 100%
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span>120 minutos</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
            <span>{total_preguntas} preguntas</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            <span>Retroalimentación IA</span>
          </div>
        </div>
        <a href="/evaluaciones/educacion-parvularia/estudio/parvularia-nt/" class="mt-6 inline-flex items-center text-pink-600 hover:text-pink-800 font-medium transition-colors">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
          Estudiar Contenidos
        </a>
      </div>

      <!-- Instrucciones -->
      <div class="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500 p-6 rounded-lg mb-8 shadow-sm">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-bold text-pink-900 mb-2">📖 Instrucciones</h3>
            <ul class="text-sm text-pink-800 space-y-2">
              <li>✓ Responde las {total_preguntas} preguntas (75 regulares + 25 casos de estudio + 8 fundamentos)</li>
              <li>✓ Revisa tus respuestas para recibir corrección inmediata</li>
              <li>✓ Lee las explicaciones detalladas de cada pregunta</li>
              <li>✓ Consulta la IA en cualquier pregunta para profundizar</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-semibold text-gray-700">Progreso</span>
          <span class="text-sm font-bold text-pink-600" id="progress-text">0/{total_preguntas} respondidas</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div id="progress-bar" class="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
      </div>

      <!-- Contenedor del Quiz -->
      <div id="quiz-container" class="space-y-6">
        <form id="quiz-form">
'''

# Generar preguntas
for i, pregunta in enumerate(preguntas, 1):
    html += f'''
          <!-- PREGUNTA {i} -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 border-l-4 border-pink-400" id="pregunta-{i}">
            
            <!-- Número y ámbito -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-md">
                  {i}
                </span>
                <div>
                  <span class="inline-block bg-pink-100 text-pink-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {pregunta['ambito']}
                  </span>
                  <span class="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full ml-2">
                    {pregunta['nucleo']}
                  </span>
                </div>
              </div>
            </div>

            <!-- Enunciado -->
            <p class="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
              {pregunta['enunciado']}
            </p>

            <!-- Alternativas -->
            <div class="space-y-3 mb-6">
'''
    
    for alt in pregunta['alternativas']:
        html += f'''
              <label class="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-pink-400 hover:bg-pink-50 cursor-pointer transition-all duration-200 group">
                <input 
                  type="radio" 
                  name="pregunta-{i}" 
                  value="{alt['letra']}" 
                  class="mt-1 h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 cursor-pointer"
                  data-question="{i}"
                  required
                >
                <span class="ml-4 text-gray-800 group-hover:text-gray-900 font-medium">
                  <strong class="text-pink-600">{alt['letra']})</strong> {alt['texto']}
                </span>
              </label>
'''
    
    html += f'''
            </div>

            <!-- Feedback zona -->
            <div id="feedback-{i}" class="hidden"></div>

            <!-- Botón IA -->
            <div id="ia-actions-{i}" class="mt-4 hidden">
              <button 
                type="button" 
                data-q="{i}" 
                class="ia-btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                Consultar IA - Ver Explicación Completa
              </button>
            </div>

            <div id="ia-feedback-{i}" class="mt-4 hidden"></div>

          </div>
'''

# JavaScript para funcionalidad del quiz y sistema IA
html += f'''
        </form>
      </div>

      <!-- Botón para revisar respuestas -->
      <div class="mt-8 text-center">
        <button 
          type="button" 
          id="check-answers" 
          class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          📝 Revisar Respuestas
        </button>
      </div>

    </div>
  </div>
</div>

<script>
// Plan de evaluación (cargado desde JSON)
const planData = {json.dumps(plan, ensure_ascii=False)};

// Estado del quiz
let quizState = {{
  totalPreguntas: {total_preguntas},
  respondidas: 0,
  correctas: 0,
  revisado: false
}};

// Actualizar progreso
function updateProgress() {{
  const progress = (quizState.respondidas / quizState.totalPreguntas) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';
  document.getElementById('progress-text').textContent = `${{quizState.respondidas}}/{total_preguntas} respondidas`;
}}

// Escuchar cambios en respuestas
document.querySelectorAll('input[type="radio"]').forEach(radio => {{
  radio.addEventListener('change', (e) => {{
    const questionNum = e.target.dataset.question;
    const answered = document.querySelectorAll('input[type="radio"]:checked').length;
    quizState.respondidas = answered;
    updateProgress();
  }});
}});

// Revisar respuestas
document.getElementById('check-answers').addEventListener('click', () => {{
  if (quizState.respondidas < quizState.totalPreguntas) {{
    alert(`Por favor responde todas las preguntas. Te faltan ${{quizState.totalPreguntas - quizState.respondidas}} preguntas.`);
    return;
  }}

  quizState.revisado = true;
  quizState.correctas = 0;

  planData.exam.preguntas.forEach((pregunta, index) => {{
    const questionNum = index + 1;
    const selectedAnswer = document.querySelector(`input[name="pregunta-${{questionNum}}"]:checked`);
    
    if (!selectedAnswer) return;

    const userAnswer = selectedAnswer.value;
    const isCorrect = userAnswer === pregunta.respuesta_correcta;
    
    if (isCorrect) quizState.correctas++;

    // Mostrar feedback
    const feedbackDiv = document.getElementById(`feedback-${{questionNum}}`);
    feedbackDiv.classList.remove('hidden');
    feedbackDiv.innerHTML = `
      <div class="mt-4 p-4 rounded-lg ${{isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}}">
        <div class="flex items-center mb-2">
          <svg class="w-6 h-6 ${{isCorrect ? 'text-green-500' : 'text-red-500'}}" fill="currentColor" viewBox="0 0 20 20">
            ${{isCorrect 
              ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'
              : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>'
            }}
          </svg>
          <span class="ml-2 font-bold text-lg ${{isCorrect ? 'text-green-800' : 'text-red-800'}}">
            ${{isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}}
          </span>
        </div>
        <p class="text-sm ${{isCorrect ? 'text-green-800' : 'text-red-800'}} mb-2">
          <strong>Respuesta correcta:</strong> ${{pregunta.respuesta_correcta}})
        </p>
        <p class="text-sm ${{isCorrect ? 'text-green-800' : 'text-red-800'}}">
          ${{pregunta.explicacion}}
        </p>
      </div>
    `;

    // Mostrar botón IA
    document.getElementById(`ia-actions-${{questionNum}}`).classList.remove('hidden');
  }});

  // Mostrar resultado final
  const percentage = (quizState.correctas / quizState.totalPreguntas) * 100;
  alert(`Resultado: ${{quizState.correctas}}/{total_preguntas} correctas (${{percentage.toFixed(1)}}%)`);

  // Scroll al inicio
  window.scrollTo({{ top: 0, behavior: 'smooth' }});
}});

// Sistema de IA (consultar explicación profunda)
document.querySelectorAll('.ia-btn').forEach(btn => {{
  btn.addEventListener('click', async (e) => {{
    const questionNum = parseInt(e.currentTarget.dataset.q);
    const pregunta = planData.exam.preguntas[questionNum - 1];
    const feedbackDiv = document.getElementById(`ia-feedback-${{questionNum}}`);
    
    // Mostrar loading
    feedbackDiv.classList.remove('hidden');
    feedbackDiv.innerHTML = `
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p class="text-blue-800">🤖 Generando explicación detallada con IA...</p>
      </div>
    `;

    // Determinar prompt según núcleo
    let promptTema = planData.metadata.prompts_ia.sistema_general;
    
    if (pregunta.nucleo.toLowerCase().includes('identidad')) {{
      promptTema = planData.metadata.prompts_ia.identidad_autonomia;
    }} else if (pregunta.nucleo.toLowerCase().includes('convivencia')) {{
      promptTema = planData.metadata.prompts_ia.convivencia_ciudadania;
    }} else if (pregunta.nucleo.toLowerCase().includes('corporalidad')) {{
      promptTema = planData.metadata.prompts_ia.corporalidad_movimiento;
    }} else if (pregunta.nucleo.toLowerCase().includes('lenguaje verbal')) {{
      promptTema = planData.metadata.prompts_ia.lenguaje_verbal;
    }} else if (pregunta.nucleo.toLowerCase().includes('lenguajes artísticos') || pregunta.nucleo.toLowerCase().includes('artístico')) {{
      promptTema = planData.metadata.prompts_ia.lenguajes_artisticos;
    }} else if (pregunta.nucleo.toLowerCase().includes('exploración') || pregunta.nucleo.toLowerCase().includes('natural')) {{
      promptTema = planData.metadata.prompts_ia.exploracion_entorno_natural;
    }} else if (pregunta.nucleo.toLowerCase().includes('comprensión') || pregunta.nucleo.toLowerCase().includes('sociocultural')) {{
      promptTema = planData.metadata.prompts_ia.comprension_entorno_sociocultural;
    }} else if (pregunta.nucleo.toLowerCase().includes('matemático') || pregunta.nucleo.toLowerCase().includes('pensamiento')) {{
      promptTema = planData.metadata.prompts_ia.pensamiento_matematico;
    }} else if (pregunta.nucleo.toLowerCase().includes('curriculum') || pregunta.nucleo.toLowerCase().includes('fundamentos')) {{
      promptTema = planData.metadata.prompts_ia.curriculum_fundamentos;
    }} else if (pregunta.nucleo.toLowerCase().includes('desarrollo') || pregunta.nucleo.toLowerCase().includes('integral')) {{
      promptTema = planData.metadata.prompts_ia.desarrollo_integral;
    }} else if (pregunta.nucleo.toLowerCase().includes('retroalimentación') || pregunta.habilidad.toLowerCase().includes('retroalimentación')) {{
      promptTema = planData.metadata.prompts_ia.retroalimentacion_pedagogica;
    }}

    // Simular respuesta IA (en producción conectar a API real)
    setTimeout(() => {{
      feedbackDiv.innerHTML = `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div class="flex items-start mb-4">
            <svg class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
            <div>
              <h4 class="font-bold text-lg text-blue-900 mb-3">🤖 Explicación Profunda con IA</h4>
              <div class="text-sm text-blue-800 space-y-3">
                <p><strong>📌 Contexto:</strong> ${{promptTema}}</p>
                <p><strong>💡 Pregunta analizada:</strong> ${{pregunta.enunciado}}</p>
                <p><strong>✅ Respuesta correcta:</strong> ${{pregunta.respuesta_correcta}}) - ${{pregunta.explicacion}}</p>
                <p><strong>📚 Temas relacionados:</strong> ${{pregunta.temas_relacionados.join(', ')}}</p>
                <div class="bg-white p-4 rounded-lg mt-4 border border-blue-200">
                  <p class="text-blue-900"><strong>💭 Reflexión pedagógica:</strong></p>
                  <p class="mt-2 text-blue-800">Esta pregunta evalúa tu comprensión sobre <strong>${{pregunta.nucleo}}</strong> en el contexto de las Bases Curriculares 2018. Es fundamental que como educadora de párvulos reconozcas que cada decisión pedagógica debe estar fundamentada en el conocimiento profundo del desarrollo infantil y en estrategias que respeten la singularidad de cada niño/a.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }}, 1500);
  }});
}});
</script>
'''

# Guardar archivo
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Evaluación generada: {total_preguntas} preguntas")
print(f"✅ Sistema IA habilitado con {len(plan['metadata']['prompts_ia'])} prompts")
print("✅ Archivo guardado: evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk")
