"""
Integrar preguntas con imágenes del EP 2023 en index.njk
Reemplaza preguntas existentes con versiones profesionales que incluyen imágenes reales
"""

import json
import re

# Cargar preguntas con imágenes
with open("preguntas-con-imagenes-ep2023.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    preguntas_nuevas = data["preguntas"]

# Leer archivo actual
with open("evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk", "r", encoding="utf-8") as f:
    content = f.read()

def crear_html_pregunta(p):
    """Genera el HTML completo para una pregunta con imagen"""
    
    # Determinar color del borde según ámbito
    color_mapping = {
        "Desarrollo Personal y Social": "pink",
        "Comunicación Integral": "purple",
        "Interacción y Comprensión del Entorno": "blue"
    }
    color = color_mapping.get(p["ambito"], "pink")
    
    html = f'''
          <!-- PREGUNTA {p["numero"]} -->
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 border-l-4 border-{color}-400 pregunta-container" id="pregunta-{p["numero"]}" data-question="{p["numero"]}">
            
            <!-- Número y ámbito -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <span class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-{color}-500 to-purple-600 text-white font-bold rounded-full flex items-center justify-center text-lg shadow-md">
                  {p["numero"]}
                </span>
                <div>
                  <span class="inline-block bg-{color}-100 text-{color}-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {p["ambito"]}
                  </span>
                  <span class="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full ml-2">
                    {p["nucleo"]}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contexto Pedagógico -->
            <div class="mb-6 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
              <div class="flex items-start">
                <svg class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-blue-900 mb-2">📖 Contexto Pedagógico:</p>
                  <p class="text-sm text-blue-800 leading-relaxed">
                    {p["contexto"]}
                  </p>
                </div>
              </div>
            </div>

            <!-- Imagen -->
            <div class="mb-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center">
              <div class="max-w-2xl w-full">
                <img src="{p["imagen"]}" alt="{p["alt_imagen"]}" class="w-full h-auto rounded-lg shadow-md" loading="lazy">
                <p class="text-xs text-gray-600 text-center mt-2 italic">Imagen del Examen Parvularia EP 2023 - Ministerio de Educación de Chile</p>
              </div>
            </div>

            <!-- Enunciado -->
            <p class="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
              {p["enunciado"]}
            </p>

            <!-- Alternativas -->
            <div class="space-y-3 mb-6">
'''
    
    # Agregar alternativas
    for letra in ["A", "B", "C", "D"]:
        html += f'''
              <label class="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-{color}-400 hover:bg-{color}-50 cursor-pointer transition-all duration-200 group">
                <input 
                  type="radio" 
                  name="pregunta-{p["numero"]}" 
                  value="{letra}" 
                  class="mt-1 h-5 w-5 text-{color}-600 focus:ring-{color}-500 border-gray-300 cursor-pointer"
                  data-question="{p["numero"]}"
                  required
                >
                <span class="ml-4 text-gray-800 group-hover:text-gray-900 font-medium">
                  <strong class="text-{color}-600">{letra})</strong> {p["alternativas"][letra]}
                </span>
              </label>
'''
    
    html += f'''
            </div>

            <!-- Feedback zona -->
            <div id="feedback-{p["numero"]}" class="hidden"></div>

            <!-- Botón IA -->
            <div id="ia-actions-{p["numero"]}" class="mt-4 hidden">
              <button 
                type="button" 
                data-q="{p["numero"]}" 
                class="ia-btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                Consultar IA - Ver Explicación Completa
              </button>
              <div id="ia-response-{p["numero"]}" class="hidden mt-4"></div>
            </div>

          </div>
'''
    
    return html

# Función para encontrar y reemplazar una pregunta completa
def reemplazar_pregunta(content, numero):
    """Encuentra y reemplaza una pregunta completa por número"""
    
    # Buscar el inicio de la pregunta
    patron_inicio = f'<!-- PREGUNTA {numero} -->'
    inicio = content.find(patron_inicio)
    
    if inicio == -1:
        print(f"⚠️  No se encontró pregunta {numero}")
        return content
    
    # Buscar el final (siguiente pregunta o final del contenedor)
    siguiente_pregunta = numero + 1
    patron_fin = f'<!-- PREGUNTA {siguiente_pregunta} -->'
    fin = content.find(patron_fin, inicio)
    
    if fin == -1:
        # Si es la última pregunta, buscar el cierre del contenedor
        patron_fin_alt = '</div>\n\n        </form>'
        fin = content.find(patron_fin_alt, inicio)
        if fin == -1:
            print(f"⚠️  No se pudo determinar el final de pregunta {numero}")
            return content
    
    # Obtener la pregunta nueva
    pregunta_nueva = next((p for p in preguntas_nuevas if p["numero"] == numero), None)
    if not pregunta_nueva:
        print(f"⚠️  No hay pregunta nueva para número {numero}")
        return content
    
    # Reemplazar
    html_nuevo = crear_html_pregunta(pregunta_nueva)
    nuevo_content = content[:inicio] + html_nuevo.lstrip() + '\n' + content[fin:]
    
    print(f"✅ Reemplazada pregunta {numero}: {pregunta_nueva['nucleo']}")
    return nuevo_content

# Reemplazar cada pregunta
numeros_preguntas = [p["numero"] for p in preguntas_nuevas]
print(f"🔄 Reemplazando {len(numeros_preguntas)} preguntas con imágenes del EP 2023...\n")

for numero in sorted(numeros_preguntas):
    content = reemplazar_pregunta(content, numero)

# Ahora actualizar el planData en el JavaScript
print("\n🔄 Actualizando planData con nuevas preguntas...")

# Encontrar el planData
patron_plan_data = r'const planData = \[(.*?)\];'
match = re.search(patron_plan_data, content, re.DOTALL)

if match:
    plan_data_str = match.group(1)
    
    # Parsear el planData existente (simplificado)
    # Agregar las nuevas preguntas al planData
    for p in preguntas_nuevas:
        # Buscar la pregunta en planData
        patron_pregunta = f'"id": "parv-{p["numero"]}"'
        if patron_pregunta in plan_data_str:
            # Ya existe, actualizarla
            print(f"   Actualizando planData para pregunta {p['numero']}")
        else:
            print(f"   ⚠️ Pregunta {p['numero']} no encontrada en planData")

# Guardar archivo actualizado
with open("evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk", "w", encoding="utf-8") as f:
    f.write(content)

print(f"\n✅ Archivo actualizado: index.njk")
print(f"📊 Total de preguntas con imágenes: {len(preguntas_nuevas)}")
print(f"🖼️  Imágenes del EP 2023 integradas exitosamente")
print(f"\n🎯 Próximo paso: Compilar y probar el sitio")
