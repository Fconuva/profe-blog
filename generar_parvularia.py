import json

# Leer plan.json
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Generar HTML
html = '''---
layout: layout-evaluaciones.njk
title: Educación Parvularia - Evaluación ECEP 2025
permalink: /evaluaciones/educacion-parvularia/pruebas/parv-nt/
---

<div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-8">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-purple-800 mb-4">Educación Parvularia - Niveles de Transición</h1>
      <p class="text-xl text-gray-600">Evaluación Estandarizada ECEP 2025</p>
      <p class="text-gray-600 mt-2">100 preguntas • Bases Curriculares 2018</p>
    </div>
    
    <form id="evaluacionForm" class="space-y-6">
'''

# Generar preguntas
for p in data['exam']['preguntas']:
    html += f'''
      <div class="bg-white rounded-lg shadow-md p-6" data-id="{p['id']}">
        <div class="mb-4">
          <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">Pregunta {p['numero']}</span>
          <span class="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs ml-2">{p['ambito']}</span>
        </div>
        <p class="text-lg text-gray-800 mb-4">{p['enunciado']}</p>
        <div class="space-y-2">
'''
    for alt in p['alternativas']:
        html += f'''
          <label class="flex items-start p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 cursor-pointer">
            <input type="radio" name="q{p['numero']}" value="{alt['letra']}" data-correct="{p['respuesta_correcta']}" class="mt-1">
            <span class="ml-3"><strong>{alt['letra']}.</strong> {alt['texto']}</span>
          </label>
'''
    html += f'''
        </div>
        <div class="feedback hidden mt-4 p-4 rounded-lg">
          <p class="font-bold mb-2 feedback-title"></p>
          <p class="text-sm">{p['explicacion']}</p>
        </div>
      </div>
'''

html += '''
      <div class="text-center">
        <button type="submit" class="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700">
          Enviar Respuestas
        </button>
      </div>
    </form>
    
    <div id="results" class="hidden mt-8 bg-white rounded-lg shadow-xl p-8">
      <h2 class="text-3xl font-bold text-center mb-6 text-purple-800">Resultados</h2>
      <div class="text-center">
        <div class="text-6xl font-bold text-purple-600 mb-4" id="score">0%</div>
        <p class="text-xl" id="summary"></p>
      </div>
    </div>
  </div>
</div>

<script>
document.getElementById('evaluacionForm').addEventListener('submit', function(e) {
  e.preventDefault();
  let correct = 0;
  const total = 100;
  
  document.querySelectorAll('[data-id]').forEach(div => {
    const selected = div.querySelector('input:checked');
    const feedback = div.querySelector('.feedback');
    
    if (!selected) return;
    
    const isCorrect = selected.value === selected.dataset.correct;
    feedback.classList.remove('hidden');
    
    if (isCorrect) {
      correct++;
      feedback.classList.add('bg-green-50', 'border-l-4', 'border-green-500');
      feedback.querySelector('.feedback-title').textContent = '✅ Correcto';
      feedback.querySelector('.feedback-title').classList.add('text-green-700');
    } else {
      feedback.classList.add('bg-red-50', 'border-l-4', 'border-red-500');
      feedback.querySelector('.feedback-title').textContent = '❌ Incorrecto. La respuesta correcta es ' + selected.dataset.correct;
      feedback.querySelector('.feedback-title').classList.add('text-red-700');
    }
  });
  
  const pct = Math.round((correct/total)*100);
  document.getElementById('score').textContent = pct + '%';
  document.getElementById('summary').textContent = correct + ' de ' + total + ' respuestas correctas';
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('results').scrollIntoView({behavior: 'smooth'});
});
</script>
'''

# Guardar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(html)

print('✅ Evaluación Parvularia generada: 100 preguntas')
print(f'   Total de caracteres: {len(html)}')
