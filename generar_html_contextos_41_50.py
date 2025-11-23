# -*- coding: utf-8 -*-
"""
Generar HTML para contextos de preguntas 41-50
"""

import json

# Cargar contextos
with open('contextos_mejorados_41_50.json', 'r', encoding='utf-8') as f:
    contextos = json.load(f)

# Template HTML para el cuadro azul
template = """        <div class="mb-6 border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 class="font-semibold text-blue-900 mb-2">Contexto Pedagógico</h4>
              <p class="text-blue-800 text-sm leading-relaxed">{contexto}</p>
            </div>
          </div>
        </div>"""

# Generar HTML para cada contexto
html_contextos = {}
for key, data in contextos.items():
    html = template.format(contexto=data['contexto'])
    html_contextos[key] = html
    print(f"✓ HTML generado para {key}: {len(html)} caracteres")

# Guardar
with open('contextos_html_41_50.json', 'w', encoding='utf-8') as f:
    json.dump(html_contextos, f, ensure_ascii=False, indent=2)

print(f"\n✓ {len(html_contextos)} bloques HTML generados")
print("✓ Guardado en: contextos_html_41_50.json")
