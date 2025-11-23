import json

# Leer el JSON con las preguntas
with open('preguntas_51_58_completas.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Plantilla HTML para cada pregunta
def generar_html_pregunta(p):
    numero = p['numero']
    ambito = p['ambito']
    nucleo = p['nucleo']
    contexto = p.get('contexto', '')
    enunciado = p['enunciado']
    alternativas = p['alternativas']
    
    # Determinar color según ámbito
    if 'Personal' in ambito:
        color = 'pink'
    elif 'Comunicación' in ambito:
        color = 'blue'
    else:
        color = 'green'
    
    html = f'''          <!-- PREGUNTA {numero} -->
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300 border-l-4 border-{color}-500">
            
            <!-- Header con número y núcleo -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <span class="flex items-center justify-center w-12 h-12 rounded-full bg-{color}-100 text-{color}-700 font-bold text-xl border-2 border-{color}-300">
                  {numero}
                </span>
                <div>
                  <span class="inline-block bg-{color}-100 text-{color}-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {ambito}
                  </span>
                  <span class="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full ml-2">
                    {nucleo}
                  </span>
                </div>
              </div>
            </div>

'''
    
    # Agregar contexto si existe
    if contexto:
        html += f'''            <!-- Contexto pedagógico -->
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
              <p class="text-sm text-gray-700 leading-relaxed italic">
                <strong class="text-blue-800">📋 Contexto:</strong> {contexto}
              </p>
            </div>

'''
    
    html += f'''            <!-- Enunciado -->
            <p class="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
              {enunciado}
            </p>

            <!-- Alternativas -->
            <div class="space-y-3 mb-6">

'''
    
    # Agregar alternativas
    for alt in alternativas:
        letra = alt['letra']
        texto = alt['texto']
        html += f'''              <label class="flex items-start p-4 border-2 border-gray-200 rounded-xl hover:border-{color}-400 hover:bg-{color}-50 cursor-pointer transition-all duration-200 group">
                <input 
                  type="radio" 
                  name="pregunta-{numero}" 
                  value="{letra}" 
                  class="mt-1 h-5 w-5 text-{color}-600 focus:ring-{color}-500 border-gray-300 cursor-pointer"
                  data-question="{numero}"
                  required
                >
                <span class="ml-4 text-gray-800 group-hover:text-gray-900 font-medium">
                  <strong class="text-{color}-600">{letra})</strong> {texto}
                </span>
              </label>

'''
    
    html += f'''            </div>

            <!-- Feedback zona -->
            <div id="feedback-{numero}" class="hidden"></div>

            <!-- Botón IA -->
            <div id="ia-actions-{numero}" class="mt-4 hidden">
              <button 
                type="button" 
                data-q="{numero}" 
                class="ia-btn inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
                Consultar IA - Ver Explicación Completa
              </button>
            </div>

            <div id="ia-feedback-{numero}" class="mt-4 hidden"></div>

          </div>

'''
    return html

# Generar HTML para todas las preguntas
html_completo = ''
for pregunta in data['preguntas']:
    html_completo += generar_html_pregunta(pregunta)

# Guardar a archivo
with open('preguntas_51_58_html.txt', 'w', encoding='utf-8') as f:
    f.write(html_completo)

print(f"✅ HTML generado para {len(data['preguntas'])} preguntas")
print(f"📄 Archivo: preguntas_51_58_html.txt")
print(f"📊 Total caracteres: {len(html_completo):,}")
