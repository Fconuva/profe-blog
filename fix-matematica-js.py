# -*- coding: utf-8 -*-
"""
Script para actualizar el JavaScript de Matemática con procesamiento de casos
"""

with open('evaluaciones/educacion-basica/pruebas/66-sc-m/practica.njk', 'r', encoding='utf-8') as f:
    content = f.read()

# Reemplazar el bloque completo de revisión del formulario
old_js = '''  // Revisión del formulario
  quizForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let puntaje = 0;

    plan.exam.preguntas.forEach((pregunta, index) => {
      const preguntaIndex = index + 1;
      const feedbackEl = document.getElementById(`feedback-${preguntaIndex}`);
      const iaActionsEl = document.getElementById(`ia-actions-${preguntaIndex}`);
      const selectedOption = document.querySelector(`input[name="pregunta-${preguntaIndex}"]:checked`);
      
      feedbackEl.classList.remove('hidden');
      iaActionsEl.classList.remove('hidden');
      
      if (selectedOption) {
        const esCorrecta = selectedOption.value === pregunta.respuesta_correcta;
        if (esCorrecta) {
          puntaje++;
          feedbackEl.innerHTML = `
            <div class="bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 p-5 rounded-lg shadow-sm">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="font-bold text-green-900 text-lg mb-2">¡Correcto! ✅</p>
                  <p class="text-green-800 leading-relaxed">${pregunta.explicacion}</p>
                </div>
              </div>
            </div>
          `;
        } else {
          feedbackEl.innerHTML = `
            <div class="bg-gradient-to-r from-red-100 to-pink-100 border-l-4 border-red-500 p-5 rounded-lg shadow-sm">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="font-bold text-red-900 text-lg mb-2">Incorrecto ❌</p>
                  <p class="text-red-800 mb-2">
                    Tu respuesta: <strong class="bg-red-200 px-2 py-1 rounded">${selectedOption.value}</strong>
                  </p>
                  <p class="text-red-800 mb-3">
                    Respuesta correcta: <strong class="bg-green-200 px-2 py-1 rounded">${pregunta.respuesta_correcta}</strong>
                  </p>
                  <p class="text-red-900 leading-relaxed font-medium">${pregunta.explicacion}</p>
                </div>
              </div>
            </div>
          `;
        }
      } else {
        feedbackEl.innerHTML = `
          <div class="bg-gradient-to-r from-yellow-100 to-amber-100 border-l-4 border-yellow-500 p-5 rounded-lg shadow-sm">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <div>
                <p class="font-bold text-yellow-900 text-lg mb-2">No respondida ⚠️</p>
                <p class="text-yellow-800">
                  Respuesta correcta: <strong class="bg-green-200 px-2 py-1 rounded">${pregunta.respuesta_correcta}</strong>
                </p>
              </div>
            </div>
          </div>
        `;
      }
    });'''

new_js = '''  // Revisión del formulario
  quizForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let puntaje = 0;

    // Función helper para procesar feedback
    function procesarRespuesta(preguntaIndex, respuestaCorrecta, explicacion) {
      const feedbackEl = document.getElementById(`feedback-${preguntaIndex}`);
      const iaActionsEl = document.getElementById(`ia-actions-${preguntaIndex}`);
      const selectedOption = document.querySelector(`input[name="pregunta-${preguntaIndex}"]:checked`);
      
      if (!feedbackEl || !iaActionsEl) return 0;
      
      feedbackEl.classList.remove('hidden');
      iaActionsEl.classList.remove('hidden');
      
      if (selectedOption) {
        const esCorrecta = selectedOption.value === respuestaCorrecta;
        if (esCorrecta) {
          feedbackEl.innerHTML = `
            <div class="bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 p-5 rounded-lg shadow-sm">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="font-bold text-green-900 text-lg mb-2">¡Correcto! ✅</p>
                  <p class="text-green-800 leading-relaxed">${explicacion}</p>
                </div>
              </div>
            </div>
          `;
          return 1;
        } else {
          feedbackEl.innerHTML = `
            <div class="bg-gradient-to-r from-red-100 to-pink-100 border-l-4 border-red-500 p-5 rounded-lg shadow-sm">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="font-bold text-red-900 text-lg mb-2">Incorrecto ❌</p>
                  <p class="text-red-800 mb-2">
                    Tu respuesta: <strong class="bg-red-200 px-2 py-1 rounded">${selectedOption.value}</strong>
                  </p>
                  <p class="text-red-800 mb-3">
                    Respuesta correcta: <strong class="bg-green-200 px-2 py-1 rounded">${respuestaCorrecta}</strong>
                  </p>
                  <p class="text-red-900 leading-relaxed font-medium">${explicacion}</p>
                </div>
              </div>
            </div>
          `;
          return 0;
        }
      } else {
        feedbackEl.innerHTML = `
          <div class="bg-gradient-to-r from-yellow-100 to-amber-100 border-l-4 border-yellow-500 p-5 rounded-lg shadow-sm">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <div>
                <p class="font-bold text-yellow-900 text-lg mb-2">No respondida ⚠️</p>
                <p class="text-yellow-800">
                  Respuesta correcta: <strong class="bg-green-200 px-2 py-1 rounded">${respuestaCorrecta}</strong>
                </p>
              </div>
            </div>
          </div>
        `;
        return 0;
      }
    }

    // Procesar preguntas regulares (1-50)
    plan.exam.preguntas.forEach((pregunta, index) => {
      const preguntaIndex = index + 1;
      puntaje += procesarRespuesta(preguntaIndex, pregunta.respuesta_correcta, pregunta.explicacion);
    });

    // Procesar casos de estudio (51+)
    if (plan.casos_estudio) {
      plan.casos_estudio.forEach((caso, casoIndex) => {
        const baseNum = 51 + casoIndex;
        
        // Pregunta del caso (cada caso tiene 1 pregunta en matemática)
        puntaje += procesarRespuesta(
          baseNum, 
          caso.respuesta_correcta, 
          caso.explicacion
        );
      });
    }'''

content = content.replace(old_js, new_js)

with open('evaluaciones/educacion-basica/pruebas/66-sc-m/practica.njk', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ JavaScript de Matemática actualizado")
print("  - Función procesarRespuesta() agregada")
print("  - Procesamiento de casos de estudio (51-60)")
print("  - Feedback correcto para 70 preguntas")
