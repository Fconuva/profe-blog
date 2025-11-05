#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para agregar sistema de IA a basica-generalista.njk
Integra botones de consulta IA y modal con comunicación a API
"""

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# HTML del modal de IA y botones (se insertará después del hero)
modal_ia = """
<!-- MODAL DE IA -->
<div id="ai-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
    <div class="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-2xl font-bold mb-2">🤖 Asistente Pedagógico IA</h3>
          <p class="text-purple-100 text-sm">Especializado en Educación Básica Generalista (Bases Curriculares 2012/2018)</p>
        </div>
        <button onclick="closeAIModal()" class="text-white hover:text-purple-200 text-2xl font-bold">
          ×
        </button>
      </div>
    </div>
    
    <div class="p-6">
      <div id="ai-question-display" class="mb-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
        <p class="font-semibold text-purple-700 mb-2">Consultando sobre:</p>
        <p id="ai-question-text" class="text-gray-800"></p>
      </div>
      
      <div id="ai-loading" class="hidden text-center py-8">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">Generando explicación pedagógica...</p>
      </div>
      
      <div id="ai-response" class="prose max-w-none">
        <p class="text-gray-600">Haz clic en un botón "Consultar IA" para obtener explicaciones pedagógicas detalladas.</p>
      </div>
      
      <div id="ai-error" class="hidden bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p class="text-red-700 font-semibold">Error al conectar con el asistente IA</p>
        <p class="text-red-600 text-sm mt-2" id="ai-error-message"></p>
      </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-b-2xl border-t">
      <button onclick="closeAIModal()" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
        Cerrar
      </button>
    </div>
  </div>
</div>

<!-- Estilos para botones IA -->
<style>
  .ai-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
  }
  
  .ai-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
  }
  
  .ai-button-small {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  #ai-response h2 {
    color: #667eea;
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  
  #ai-response h3 {
    color: #764ba2;
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  #ai-response ul, #ai-response ol {
    margin-left: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  #ai-response li {
    margin-bottom: 0.5rem;
  }
  
  #ai-response strong {
    color: #4c1d95;
    font-weight: 600;
  }
  
  #ai-response p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  #ai-response code {
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.875rem;
  }
</style>

"""

# JavaScript para el sistema de IA
javascript_ia = """
  // ==================== SISTEMA DE IA ====================
  
  const AI_CONFIG = {
    apiUrl: '/api/gemini-feedback',
    systemPrompt: `Eres un tutor pedagógico especializado en Educación Básica Generalista para docentes chilenos preparándose para el ECEP 2025.

Tu especialidad es ayudar a profesores de primer ciclo (1° a 3° básico) que enseñan las 4 asignaturas principales de manera integrada.

BASES CURRICULARES DE REFERENCIA:
- Bases Curriculares 1° a 6° Básico (MINEDUC 2012/2018)
- Énfasis en progresión curricular del Primer Ciclo (1° a 3° básico)
- Integración de Lenguaje, Matemática, Historia y Ciencias Naturales

DOMINIOS ESPECÍFICOS:

1. LENGUAJE Y COMUNICACIÓN (1° a 3° básico):
   - Lectura: Comprensión de textos literarios (cuentos, poemas, fábulas) y no literarios (noticias, cartas, instructivos)
   - Escritura: Producción de textos narrativos, informativos y descriptivos con estructura básica
   - Comunicación oral: Expresión oral clara, escucha activa, participación en conversaciones
   - Conciencia fonológica: Identificación de sonidos, sílabas, rimas
   - OA clave: Leer comprensivamente, escribir coherentemente, comunicar oralmente

2. MATEMÁTICA (1° a 3° básico):
   - Números hasta 1.000: Composición, descomposición, valor posicional
   - Operaciones: Adición, sustracción, multiplicación (estrategias de cálculo)
   - Geometría: Figuras 2D y 3D, ubicación espacial
   - Medición: Longitud, tiempo, peso usando unidades no estandarizadas y estandarizadas
   - Datos y probabilidades: Recolección, registro y representación simple de datos

3. HISTORIA, GEOGRAFÍA Y CIENCIAS SOCIALES (1° a 3° básico):
   - 1° básico: Identidad personal, familia, comunidad escolar
   - 2° básico: Ubicación espacial, Chile y sus regiones, pueblos originarios
   - 3° básico: Historia de Chile (pueblos originarios, conquista, colonia, independencia)
   - Habilidades: Ubicación temporal y espacial, trabajo con fuentes, pensamiento crítico

4. CIENCIAS NATURALES (1° a 3° básico):
   - Seres vivos: Clasificación, necesidades, ciclos de vida, hábitats
   - Cuerpo humano: Órganos, sentidos, hábitos saludables
   - Ciencias físicas: Luz, sonido, fuerza
   - Ciencias de la Tierra: Agua, tiempo atmosférico, sistema solar
   - Habilidades de investigación: Observar, preguntar, experimentar, comunicar resultados

ESTRUCTURA DE TUS RESPUESTAS:

Para consultas de CONTENIDO:
## Concepto Clave según Bases Curriculares
[Definición alineada con progresión 1° a 3° básico]

## Progresión Curricular
- 1° básico: [Nivel inicial]
- 2° básico: [Desarrollo]
- 3° básico: [Consolidación]

## Ejemplos Concretos por Nivel
[2-3 ejemplos apropiados para cada curso]

## Indicadores de Evaluación
[Cómo evaluar este aprendizaje según Bases Curriculares]

Para consultas de ESTRATEGIAS DIDÁCTICAS:
## Estrategia Pedagógica
[Nombre y descripción de la estrategia]

## Fundamentación Curricular
[Cómo se alinea con Bases Curriculares y OA específicos]

## Pasos de Implementación
1. [Paso concreto]
2. [Paso concreto]
3. [Paso concreto]

## Diferenciación para Primer Ciclo
- 1° básico: [Adaptación]
- 2° básico: [Adaptación]
- 3° básico: [Adaptación]

## Evaluación Formativa
[Cómo monitorear el aprendizaje]

PRINCIPIOS PEDAGÓGICOS A APLICAR:
- Diseño Universal para el Aprendizaje (DUA)
- Aprendizaje activo y experiencial
- Trabajo colaborativo entre pares
- Retroalimentación descriptiva y oportuna
- Uso de material concreto (especialmente en Matemática)
- Progresión de lo concreto a lo abstracto
- Integración de las artes y el juego
- Conexión con experiencias cotidianas del estudiante

FORMATO DE RESPUESTA:
- Usa ## para títulos principales
- Usa ### para subtítulos
- Usa **negrita** para conceptos clave
- Usa listas con • o números según corresponda
- Máximo 500 palabras
- Lenguaje claro, directo y profesional
- Cita OA específicos cuando sea relevante (ej: "OA 4 de Lenguaje 2° básico")

RESTRICCIONES:
- NO proporciones respuestas de evaluaciones directamente
- NO hagas juicios sobre competencias docentes
- Mantén tono constructivo y profesional
- Enfócate en el nivel 1° a 3° básico (extiende hasta 6° solo si es necesario para contexto)
- Usa terminología de las Bases Curriculares chilenas`
  };
  
  function openAIModal(titulo, contenido, contexto) {
    const modal = document.getElementById('ai-modal');
    const questionText = document.getElementById('ai-question-text');
    const responseDiv = document.getElementById('ai-response');
    const loadingDiv = document.getElementById('ai-loading');
    const errorDiv = document.getElementById('ai-error');
    
    // Mostrar modal y preparar UI
    modal.classList.remove('hidden');
    questionText.textContent = titulo;
    responseDiv.innerHTML = '<p class="text-gray-600">Consultando...</p>';
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    
    // Construir prompt completo
    const fullPrompt = `${contenido}

Contexto adicional: ${contexto || 'Educación Básica Generalista, Primer Ciclo (1° a 3° básico)'}

Por favor, explica esto pedagógicamente según las Bases Curriculares de 1° a 6° básico, con énfasis en primer ciclo.`;
    
    // Llamar a la API
    fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pregunta: fullPrompt,
        tema: ['Básica Generalista', 'Primer Ciclo'],
        tipo: 'explicar'
      })
    })
    .then(response => response.json())
    .then(data => {
      loadingDiv.classList.add('hidden');
      if (data.feedback) {
        // Convertir markdown simple a HTML
        let html = data.feedback
          .replace(/## (.*?)\\n/g, '<h2>$1</h2>')
          .replace(/### (.*?)\\n/g, '<h3>$3</h3>')
          .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
          .replace(/• /g, '<li>')
          .replace(/\\n\\n/g, '</p><p>')
          .replace(/^(.*)$/gm, '<p>$1</p>');
        
        // Limpiar tags vacíos
        html = html.replace(/<p><\\/p>/g, '').replace(/<p>\\s*<\\/p>/g, '');
        
        responseDiv.innerHTML = html;
      } else {
        throw new Error('No se recibió respuesta de la IA');
      }
    })
    .catch(error => {
      loadingDiv.classList.add('hidden');
      errorDiv.classList.remove('hidden');
      document.getElementById('ai-error-message').textContent = error.message;
      responseDiv.innerHTML = '<p class="text-gray-600">No se pudo generar la explicación. Por favor, intenta nuevamente.</p>';
    });
  }
  
  function closeAIModal() {
    document.getElementById('ai-modal').classList.add('hidden');
  }
  
  // Cerrar modal al hacer clic fuera
  document.getElementById('ai-modal')?.addEventListener('click', function(e) {
    if (e.target.id === 'ai-modal') {
      closeAIModal();
    }
  });
  
  // Shortcut para cerrar con ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAIModal();
    }
  });
  
  console.log('✅ Sistema de IA cargado para Básica Generalista');
  
"""

# Insertar modal después del hero
hero_end = '</div>\n\n<!-- ÍNDICE DE NAVEGACIÓN -->'
if hero_end in contenido:
    contenido = contenido.replace(hero_end, '</div>\n' + modal_ia + '\n<!-- ÍNDICE DE NAVEGACIÓN -->')
    print("✅ Modal de IA insertado")
else:
    print("⚠️ No se encontró el marcador para insertar el modal")

# Insertar JavaScript IA antes del cierre del script existente
script_marker = "  console.log('✅ Guía de Básica Generalista con casos interactivos cargada');"
if script_marker in contenido:
    contenido = contenido.replace(script_marker, javascript_ia + "\n  " + script_marker)
    print("✅ JavaScript de IA insertado")
else:
    print("⚠️ No se encontró el marcador para insertar JavaScript")

# Guardar archivo
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("✅ Sistema de IA integrado exitosamente")
print("📊 Ahora ejecuta el script para agregar botones en las secciones")
