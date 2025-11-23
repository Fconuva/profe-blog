# -*- coding: utf-8 -*-
"""
Script para generar bloques HTML de contexto para preguntas 11-20
"""

import json

# Leer contextos
with open('contextos_mejorados_11_20.json', 'r', encoding='utf-8') as f:
    contextos = json.load(f)

# Generar HTML para cada contexto
html_contexts = {}

for key in ['parv-11', 'parv-12', 'parv-13', 'parv-14', 'parv-15', 
            'parv-16', 'parv-17', 'parv-18', 'parv-19', 'parv-20']:
    contexto_text = contextos[key]['contexto']
    numero = contextos[key]['numero']
    
    html = f'''
            <!-- Contexto Pedagógico -->
            <div class="mb-6 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-blue-900 mb-2">📖 Contexto Pedagógico:</p>
                  <p class="text-sm text-blue-800 leading-relaxed">
                    {contexto_text}
                  </p>
                </div>
              </div>
            </div>
'''
    
    html_contexts[key] = {
        'numero': numero,
        'html': html
    }

# Guardar el HTML generado
with open('contextos_html_11_20.json', 'w', encoding='utf-8') as f:
    json.dump(html_contexts, f, ensure_ascii=False, indent=2)

print("✓ HTML de contextos generado exitosamente")
print(f"✓ Guardado en: contextos_html_11_20.json")

# Mostrar estadísticas
for key in html_contexts:
    chars = len(html_contexts[key]['html'])
    print(f"  - {key}: {chars} caracteres")
