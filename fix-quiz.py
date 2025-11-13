#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arreglar quiz: eliminar preguntas 51-108 y agregar JavaScript de feedback inmediato"""

import sys

# Rutas
input_file = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"
output_file = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-parvularia\pruebas\parv-nt\index-fixed.njk"

print("Leyendo archivo original...")
with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total de líneas: {len(lines)}")

# Encontrar línea donde termina pregunta 50
end_line = None
for i, line in enumerate(lines):
    if 'id="ia-feedback-50"' in line:
        # Buscar el cierre del div contenedor de la pregunta 50
        for j in range(i+1, min(i+10, len(lines))):
            if '</div>' in lines[j] and '<!--' not in lines[j]:
                end_line = j + 1
                break
        break

if end_line is None:
    print("ERROR: No se encontró el final de la pregunta 50")
    sys.exit(1)

print(f"Final de pregunta 50 en línea: {end_line}")

# Tomar solo hasta el final de la pregunta 50
content = ''.join(lines[:end_line])

# Agregar cierre HTML y JavaScript nuevo
cierre_y_script = """
        </form>
      </div>

    </div>
  </div>
</div>

<script>
// Configuración del quiz
const quizConfig = {
  totalPreguntas: 50
};

// Estado del quiz
let quizState = {
  respondidas: new Set(),
  correctas: 0
};

// Datos de respuestas correctas (simulado - en producción vendría del servidor)
const respuestasCorrectas = {
  // Aquí irían las 50 respuestas correctas
  // Por ahora usamos un placeholder
};

// Actualizar barra de progreso
function updateProgress() {
  const count = quizState.respondidas.size;
  const percentage = (count / quizConfig.totalPreguntas) * 100;
  
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  
  if (progressBar) progressBar.style.width = percentage + '%';
  if (progressText) progressText.textContent = `${count}/${quizConfig.totalPreguntas} respondidas`;
}

// Mostrar feedback inmediato al seleccionar respuesta
function showImmediateFeedback(questionNum, userAnswer) {
  const feedbackDiv = document.getElementById(`feedback-${questionNum}`);
  const iaActionsDiv = document.getElementById(`ia-actions-${questionNum}`);
  
  if (!feedbackDiv) return;
  
  // Mostrar mensaje de confirmación
  feedbackDiv.classList.remove('hidden');
  feedbackDiv.innerHTML = `
    <div class="mt-4 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span class="font-semibold text-blue-800">Respuesta registrada</span>
      </div>
      <p class="text-sm text-blue-700 mt-2">
        Tu respuesta: <strong>${userAnswer})</strong>
      </p>
      <p class="text-sm text-blue-600 mt-1">
        💡 Para ver la retroalimentación completa y la explicación pedagógica, usa el botón de consulta IA.
      </p>
    </div>
  `;
  
  // Mostrar botón de IA
  if (iaActionsDiv) {
    iaActionsDiv.classList.remove('hidden');
  }
}

// Escuchar cambios en todas las respuestas
document.addEventListener('DOMContentLoaded', function() {
  console.log('Quiz de Parvularia - 50 preguntas con retroalimentación inmediata');
  
  // Agregar listener a todos los radio buttons
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function(e) {
      const questionNum = parseInt(e.target.dataset.question);
      const userAnswer = e.target.value;
      
      // Marcar como respondida
      quizState.respondidas.add(questionNum);
      
      // Actualizar progreso
      updateProgress();
      
      // Mostrar feedback inmediato
      showImmediateFeedback(questionNum, userAnswer);
      
      console.log(`Pregunta ${questionNum}: Respuesta ${userAnswer} seleccionada`);
    });
  });
  
  // Inicializar progreso
  updateProgress();
});

// Botones de IA (placeholder para futura implementación)
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ia-btn') || e.target.closest('.ia-btn')) {
    const btn = e.target.classList.contains('ia-btn') ? e.target : e.target.closest('.ia-btn');
    const questionNum = btn.dataset.q;
    const iaFeedbackDiv = document.getElementById(`ia-feedback-${questionNum}`);
    
    if (iaFeedbackDiv) {
      iaFeedbackDiv.classList.remove('hidden');
      iaFeedbackDiv.innerHTML = `
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mt-4">
          <div class="flex items-start mb-4">
            <svg class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
            <div>
              <h4 class="font-bold text-lg text-blue-900 mb-3">🤖 Explicación Pedagógica Profunda</h4>
              <div class="text-sm text-blue-800 space-y-3">
                <p><strong>📌 Pregunta ${questionNum}</strong></p>
                <p class="bg-white p-4 rounded-lg border border-blue-200">
                  <strong>💭 Análisis pedagógico:</strong><br>
                  Esta pregunta evalúa conocimientos fundamentales de Educación Parvularia según las Bases Curriculares 2018. 
                  La consulta IA completa con explic aciones detalladas estará disponible próximamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
});
</script>

</body>
</html>
"""

# Guardar archivo nuevo
print(f"Guardando archivo limpio en: {output_file}")
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(content + cierre_y_script)

print(f"\n✅ ¡COMPLETADO!")
print(f"   Líneas en archivo original: {len(lines)}")
print(f"   Líneas conservadas (hasta Q50): {end_line}")
print(f"   Archivo nuevo: {output_file}")
print(f"\nPróximo paso: Revisar el archivo y reemplazar el original si está correcto")
