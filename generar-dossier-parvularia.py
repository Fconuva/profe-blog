#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de Dossier Pedagógico: Educación Parvularia NT
Genera contenido didáctico completo con infografías SVG, tablas y ejemplos
"""

import json

# Leer plan.json
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

# Estructura de contenidos por ámbito
ambitos = {
    "Desarrollo Personal y Social": {
        "nucleos": ["Identidad y Autonomía", "Convivencia y Ciudadanía", "Corporalidad y Movimiento"],
        "color": "#f472b6",
        "icon": "🌱"
    },
    "Comunicación Integral": {
        "nucleos": ["Lenguaje Verbal", "Lenguajes Artísticos"],
        "color": "#c084fc",
        "icon": "💬"
    },
    "Interacción y Comprensión del Entorno": {
        "nucleos": ["Exploración del Entorno Natural", "Comprensión del Entorno Sociocultural", "Pensamiento Matemático"],
        "color": "#60a5fa",
        "icon": "🌍"
    }
}

html = f"""---
layout: layout-evaluaciones.njk
title: "Guía de Estudio: Educación Parvularia NT"
description: "Guía completa para preparar Educación Parvularia Niveles de Transición con teoría, ejemplos y casos prácticos"
permalink: /evaluaciones/educacion-parvularia/estudio/parvularia-nt/
---

<style>
  .formula-box {{
    background: linear-gradient(135deg, #f472b6 0%, #c026d3 100%);
    border-radius: 12px;
    padding: 1.5rem;
    color: white;
    box-shadow: 0 10px 25px rgba(244, 114, 182, 0.3);
    margin: 1rem 0;
  }}
  
  .definition-box {{
    background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
    border-left: 5px solid #c026d3;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
  }}
  
  .example-box {{
    background: linear-gradient(to right, #fce7f3, #fbcfe8);
    border-left: 5px solid #ec4899;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
  }}
  
  .table-modern {{
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }}
  
  .table-modern thead {{
    background: linear-gradient(135deg, #f472b6 0%, #c026d3 100%);
    color: white;
  }}
  
  .table-modern th {{
    padding: 1rem;
    font-weight: 600;
    text-align: left;
  }}
  
  .table-modern td {{
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }}
  
  .table-modern tbody tr:hover {{
    background: #fdf2f8;
  }}
  
  .step-indicator {{
    display: inline-block;
    background: #ec4899;
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    margin-right: 0.5rem;
  }}
  
  @media print {{
    .no-print {{ display: none !important; }}
    body {{ font-size: 11pt; line-height: 1.4; color: #000; }}
    .definition-box, .example-box {{ 
      page-break-inside: avoid;
      border: 2px solid #333;
      background: #f9f9f9 !important;
      color: #000 !important;
    }}
  }}
</style>

<div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
  <div class="container mx-auto px-4 py-10">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">🌱 Guía de Estudio Interactiva</h1>
        <p class="text-gray-600 text-lg mt-2">Educación Parvularia — Niveles de Transición (NT1 y NT2)</p>
        <p class="text-sm text-gray-500 mt-1">Bases Curriculares 2018 | Aprendizaje integral, juego y evaluación formativa</p>

        <div class="mt-6 no-print">
          <button type="button" onclick="window.print()" class="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-md">
            📄 Imprimir / Exportar PDF
          </button>
        </div>
      </div>

      <!-- Navegación -->
      <div class="mt-6 flex gap-4 justify-center flex-wrap no-print">
        <a href="/evaluaciones/" class="text-pink-600 hover:text-pink-800 font-medium">
          ← Volver al Menú Principal
        </a>
        <a href="/evaluaciones/educacion-parvularia/pruebas/parv-nt/" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium">
          📝 Ir a Prueba (100 preguntas)
        </a>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-6xl mx-auto mt-8">

      <!-- Introducción -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">🎯 Introducción</h2>
        
        <div class="definition-box">
          <h3 class="text-xl font-bold text-white mb-3">🌱 Educación Parvularia en Chile</h3>
          <p class="text-white text-lg leading-relaxed">
            La Educación Parvularia es el primer nivel educativo que atiende integralmente a niños y niñas desde el nacimiento 
            hasta el ingreso a la Educación Básica. Las <strong>Bases Curriculares 2018</strong> establecen un marco pedagógico 
            centrado en el <strong>niño/a como protagonista</strong>, el <strong>juego como metodología privilegiada</strong>, 
            y el desarrollo de <strong>aprendizajes integrales</strong> en tres ámbitos de experiencias.
          </p>
        </div>

        <!-- Infografía: Los 3 Ámbitos -->
        <div class="bg-gradient-to-br from-pink-50 to-purple-100 p-8 rounded-xl mb-8 border-2 border-pink-300">
          <h3 class="text-2xl font-bold text-center text-pink-900 mb-6">🗺️ Los Tres Ámbitos de Experiencias</h3>
          
          <svg viewBox="0 0 800 400" class="w-full max-w-4xl mx-auto">
            <!-- Ámbito 1: Desarrollo Personal y Social -->
            <rect x="50" y="80" width="200" height="120" rx="10" fill="#f472b6" stroke="#ec4899" stroke-width="3"/>
            <text x="150" y="110" text-anchor="middle" fill="white" font-weight="bold" font-size="16">🌱 DESARROLLO</text>
            <text x="150" y="130" text-anchor="middle" fill="white" font-weight="bold" font-size="16">PERSONAL Y SOCIAL</text>
            <text x="150" y="160" text-anchor="middle" fill="white" font-size="11">• Identidad y Autonomía</text>
            <text x="150" y="177" text-anchor="middle" fill="white" font-size="11">• Convivencia y Ciudadanía</text>
            <text x="150" y="194" text-anchor="middle" fill="white" font-size="11">• Corporalidad y Movimiento</text>

            <!-- Ámbito 2: Comunicación Integral -->
            <rect x="300" y="80" width="200" height="120" rx="10" fill="#c084fc" stroke="#a855f7" stroke-width="3"/>
            <text x="400" y="110" text-anchor="middle" fill="white" font-weight="bold" font-size="16">💬 COMUNICACIÓN</text>
            <text x="400" y="130" text-anchor="middle" fill="white" font-weight="bold" font-size="16">INTEGRAL</text>
            <text x="400" y="160" text-anchor="middle" fill="white" font-size="11">• Lenguaje Verbal</text>
            <text x="400" y="177" text-anchor="middle" fill="white" font-size="11">• Lenguajes Artísticos</text>

            <!-- Ámbito 3: Interacción con el Entorno -->
            <rect x="550" y="80" width="200" height="120" rx="10" fill="#60a5fa" stroke="#3b82f6" stroke-width="3"/>
            <text x="650" y="100" text-anchor="middle" fill="white" font-weight="bold" font-size="14">🌍 INTERACCIÓN Y</text>
            <text x="650" y="120" text-anchor="middle" fill="white" font-weight="bold" font-size="14">COMPRENSIÓN</text>
            <text x="650" y="137" text-anchor="middle" fill="white" font-weight="bold" font-size="14">DEL ENTORNO</text>
            <text x="650" y="160" text-anchor="middle" fill="white" font-size="10">• Exploración Entorno Natural</text>
            <text x="650" y="175" text-anchor="middle" fill="white" font-size="10">• Comprensión E. Sociocultural</text>
            <text x="650" y="190" text-anchor="middle" fill="white" font-size="10">• Pensamiento Matemático</text>

            <!-- Centro: El Niño/a -->
            <circle cx="400" cy="300" r="60" fill="#fbbf24" stroke="#f59e0b" stroke-width="3"/>
            <text x="400" y="295" text-anchor="middle" fill="#78350f" font-weight="bold" font-size="16">👶 EL NIÑO/A</text>
            <text x="400" y="315" text-anchor="middle" fill="#78350f" font-size="12">Protagonista</text>

            <!-- Flechas hacia el centro -->
            <line x1="150" y1="200" x2="360" y2="280" stroke="#f472b6" stroke-width="3" marker-end="url(#arrowpink)"/>
            <line x1="400" y1="200" x2="400" y2="240" stroke="#c084fc" stroke-width="3" marker-end="url(#arrowpurple)"/>
            <line x1="650" y1="200" x2="440" y2="280" stroke="#60a5fa" stroke-width="3" marker-end="url(#arrowblue)"/>

            <defs>
              <marker id="arrowpink" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#f472b6"/>
              </marker>
              <marker id="arrowpurple" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#c084fc"/>
              </marker>
              <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa"/>
              </marker>
            </defs>
          </svg>
        </div>

        <!-- Distribución de Contenidos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-l-4 border-pink-500 p-6 rounded-lg shadow-md">
            <div class="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">33%</div>
            <p class="font-semibold text-gray-800">Desarrollo Personal y Social</p>
            <p class="text-sm text-gray-600">Identidad, convivencia, corporalidad</p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 p-6 rounded-lg shadow-md">
            <div class="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">33%</div>
            <p class="font-semibold text-gray-800">Comunicación Integral</p>
            <p class="text-sm text-gray-600">Lenguaje verbal y artístico</p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
            <div class="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">34%</div>
            <p class="font-semibold text-gray-800">Interacción con Entorno</p>
            <p class="text-sm text-gray-600">Natural, sociocultural, matemático</p>
          </div>
        </div>
      </div>

"""

# Generar contenido para cada ámbito
for ambito_nombre, ambito_data in ambitos.items():
    html += f"""
      <!-- ÁMBITO: {ambito_nombre} -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold mb-6" style="color: {ambito_data['color']}">{ambito_data['icon']} {ambito_nombre.upper()}</h2>
        
        <div class="definition-box">
          <h3 class="text-xl font-bold text-white mb-3">📖 Definición del Ámbito</h3>
          <p class="text-white text-lg leading-relaxed">
"""
    
    # Definiciones específicas
    if ambito_nombre == "Desarrollo Personal y Social":
        html += """            Este ámbito favorece que niños y niñas <strong>construyan su identidad</strong>, desarrollen 
            <strong>autonomía progresiva</strong>, establezcan <strong>relaciones positivas</strong> con otros, y 
            desarrollen <strong>bienestar integral</strong> a través del movimiento y cuidado de su cuerpo.
"""
    elif ambito_nombre == "Comunicación Integral":
        html += """            Este ámbito promueve que niños y niñas <strong>expresen y comprendan</strong> a través del 
            <strong>lenguaje verbal</strong> (oral y escrito) y los <strong>lenguajes artísticos</strong> (plástico, 
            musical, corporal, dramático), desarrollando capacidades comunicativas y creativas.
"""
    else:
        html += """            Este ámbito potencia que niños y niñas <strong>descubran y comprendan</strong> el mundo natural 
            y sociocultural mediante la <strong>exploración</strong>, <strong>experimentación</strong> y 
            <strong>resolución de problemas</strong>, desarrollando pensamiento crítico y científico.
"""
    
    html += """          </p>
        </div>
"""
    
    # Tabla de núcleos
    html += f"""
        <h3 class="text-2xl font-bold text-gray-800 mb-4 mt-8">Núcleos de Aprendizaje</h3>
        <table class="table-modern mb-8">
          <thead>
            <tr>
              <th>Núcleo</th>
              <th>Enfoque Principal</th>
              <th>Habilidades Clave</th>
              <th>Ejemplo de Actividad</th>
            </tr>
          </thead>
          <tbody>
"""
    
    # Contenido de cada núcleo
    for nucleo in ambito_data['nucleos']:
        if nucleo == "Identidad y Autonomía":
            html += """            <tr>
              <td class="font-bold text-pink-700">Identidad y Autonomía</td>
              <td>Reconocimiento de sí mismo, autoestima, independencia progresiva</td>
              <td>Expresar emociones, tomar decisiones, realizar acciones por sí mismo</td>
              <td class="text-sm">"Yo puedo": Elegir su ropa, servirse colación, resolver conflictos simples</td>
            </tr>
"""
        elif nucleo == "Convivencia y Ciudadanía":
            html += """            <tr>
              <td class="font-bold text-pink-700">Convivencia y Ciudadanía</td>
              <td>Relaciones respetuosas, resolución de conflictos, participación democrática</td>
              <td>Colaborar, negociar, respetar turnos, construir normas colectivamente</td>
              <td class="text-sm">Asamblea de aula: Decidir juntos las reglas del juego libre</td>
            </tr>
"""
        elif nucleo == "Corporalidad y Movimiento":
            html += """            <tr>
              <td class="font-bold text-pink-700">Corporalidad y Movimiento</td>
              <td>Desarrollo motor, conciencia corporal, bienestar físico</td>
              <td>Coordinar movimientos, equilibrio, expresar con el cuerpo</td>
              <td class="text-sm">Circuito motor: Saltar, trepar, lanzar, bailar expresivamente</td>
            </tr>
"""
        elif nucleo == "Lenguaje Verbal":
            html += """            <tr>
              <td class="font-bold text-purple-700">Lenguaje Verbal</td>
              <td>Comprensión y expresión oral, iniciación a lectura y escritura</td>
              <td>Narrar, describir, argumentar, conciencia fonológica, disfrutar textos</td>
              <td class="text-sm">Lectura compartida: Predecir, comentar, recrear historias</td>
            </tr>
"""
        elif nucleo == "Lenguajes Artísticos":
            html += """            <tr>
              <td class="font-bold text-purple-700">Lenguajes Artísticos</td>
              <td>Expresión y apreciación plástica, musical, corporal, dramática</td>
              <td>Crear, explorar materiales, representar, apreciar obras artísticas</td>
              <td class="text-sm">Atelier: Pintar con técnicas diversas, explorar instrumentos musicales</td>
            </tr>
"""
        elif nucleo == "Exploración del Entorno Natural":
            html += """            <tr>
              <td class="font-bold text-blue-700">Exploración del Entorno Natural</td>
              <td>Descubrimiento de seres vivos, fenómenos naturales, cuidado ambiental</td>
              <td>Observar, experimentar, formular hipótesis, registrar descubrimientos</td>
              <td class="text-sm">Germinación de semillas: Observar, medir, registrar en dibujos</td>
            </tr>
"""
        elif nucleo == "Comprensión del Entorno Sociocultural":
            html += """            <tr>
              <td class="font-bold text-blue-700">Comprensión del Entorno Sociocultural</td>
              <td>Historia personal/familiar, instituciones, diversidad cultural, patrimonio</td>
              <td>Conocer su historia, valorar diversidad, apreciar tradiciones</td>
              <td class="text-sm">Línea de tiempo familiar: Fotos desde bebé hasta ahora</td>
            </tr>
"""
        elif nucleo == "Pensamiento Matemático":
            html += """            <tr>
              <td class="font-bold text-blue-700">Pensamiento Matemático</td>
              <td>Cuantificación, patrones, formas, posición espacial, medición</td>
              <td>Contar, comparar, clasificar, resolver problemas cotidianos</td>
              <td class="text-sm">Juego de construcción: Clasificar por forma, contar bloques, medir torres</td>
            </tr>
"""
    
    html += """          </tbody>
        </table>
      </div>
"""

# Sección de Metodologías
html += """
      <!-- METODOLOGÍAS ACTIVAS -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">🎯 Metodologías Activas en Parvularia</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="example-box">
            <h4 class="font-bold text-pink-800 mb-3 text-lg">1️⃣ El Juego como Metodología</h4>
            <p class="text-gray-700 mb-3">
              El juego es la <strong>forma privilegiada de aprender</strong> en la primera infancia. A través del juego, 
              niños y niñas exploran, experimentan, resuelven problemas, interactúan y construyen significados.
            </p>
            <div class="bg-white p-3 rounded">
              <p class="text-sm font-semibold mb-2">Tipos de juego:</p>
              <ul class="text-sm space-y-1 ml-4">
                <li>• <strong>Juego libre:</strong> Autodirigido, sin intervención adulta</li>
                <li>• <strong>Juego guiado:</strong> Adulto propone desafíos, niño/a decide cómo</li>
                <li>• <strong>Juego de roles:</strong> Dramatización de situaciones cotidianas</li>
                <li>• <strong>Juego de construcción:</strong> Crear, diseñar, resolver problemas espaciales</li>
              </ul>
            </div>
          </div>

          <div class="example-box">
            <h4 class="font-bold text-pink-800 mb-3 text-lg">2️⃣ Aprendizaje Basado en Proyectos</h4>
            <p class="text-gray-700 mb-3">
              Los proyectos surgen de <strong>intereses auténticos</strong> de niños/as y se desarrollan en varias semanas. 
              Integran múltiples ámbitos y promueven investigación, creatividad y trabajo colaborativo.
            </p>
            <div class="bg-white p-3 rounded">
              <p class="text-sm font-semibold mb-2">Fases del proyecto:</p>
              <ul class="text-sm space-y-1 ml-4">
                <li>• <strong>Inicio:</strong> Identificar intereses, preguntas iniciales</li>
                <li>• <strong>Desarrollo:</strong> Investigar, experimentar, crear</li>
                <li>• <strong>Comunicación:</strong> Compartir aprendizajes con familia/comunidad</li>
              </ul>
            </div>
          </div>

          <div class="example-box">
            <h4 class="font-bold text-pink-800 mb-3 text-lg">3️⃣ Ambientes de Aprendizaje Enriquecidos</h4>
            <p class="text-gray-700 mb-3">
              El espacio es el <strong>"tercer educador"</strong>. Ambientes bien organizados invitan a la exploración 
              autónoma, ofrecen variedad de materiales y permiten múltiples formas de aprender.
            </p>
            <div class="bg-white p-3 rounded">
              <p class="text-sm font-semibold mb-2">Principios del ambiente:</p>
              <ul class="text-sm space-y-1 ml-4">
                <li>• <strong>Accesible:</strong> Materiales a la altura de niños/as</li>
                <li>• <strong>Provocador:</strong> Invita a la curiosidad y exploración</li>
                <li>• <strong>Flexible:</strong> Se adapta a intereses y proyectos</li>
                <li>• <strong>Estético:</strong> Orden, belleza, naturaleza presente</li>
              </ul>
            </div>
          </div>

          <div class="example-box">
            <h4 class="font-bold text-pink-800 mb-3 text-lg">4️⃣ Evaluación Formativa y Auténtica</h4>
            <p class="text-gray-700 mb-3">
              Evaluar es <strong>observar, documentar y retroalimentar</strong> el proceso de aprendizaje. Se centra en 
              el progreso individual, no en comparar ni calificar.
            </p>
            <div class="bg-white p-3 rounded">
              <p class="text-sm font-semibold mb-2">Estrategias de evaluación:</p>
              <ul class="text-sm space-y-1 ml-4">
                <li>• <strong>Observación:</strong> Registros anecdóticos, listas de cotejo</li>
                <li>• <strong>Documentación pedagógica:</strong> Fotos, videos, portafolios</li>
                <li>• <strong>Conversaciones:</strong> Preguntar, escuchar, retroalimentar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- CASOS PRÁCTICOS -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">📚 Casos Prácticos</h2>
        
        <div class="space-y-6">
          <div class="border-2 border-pink-300 rounded-lg p-6">
            <h4 class="font-bold text-pink-800 mb-3 text-lg">Caso 1: Conflicto en el Juego Libre</h4>
            <div class="bg-pink-50 p-4 rounded mb-4">
              <p class="text-gray-700 mb-2"><strong>Situación:</strong></p>
              <p class="text-sm text-gray-600">
                Dos niños de NT1 pelean por el mismo camión de juguete. Ambos lo toman y comienzan a tirar de él. 
                La educadora observa desde cerca.
              </p>
            </div>
            <div class="bg-white p-4 rounded">
              <p class="text-gray-700 mb-2"><strong>✅ Intervención Pedagógica Adecuada:</strong></p>
              <ul class="text-sm text-gray-600 space-y-2 ml-4">
                <li><span class="step-indicator">1</span> Acercarse con calma, sin juzgar ni culpabilizar</li>
                <li><span class="step-indicator">2</span> Nombrar las emociones: "Veo que ambos quieren el camión y están frustrados"</li>
                <li><span class="step-indicator">3</span> Facilitar el diálogo: "¿Qué podemos hacer para que ambos jueguen?"</li>
                <li><span class="step-indicator">4</span> Apoyar la búsqueda de soluciones: turnos, jugar juntos, buscar otro camión</li>
                <li><span class="step-indicator">5</span> Validar el acuerdo: "Encontraron una solución juntos, eso es ser buenos amigos"</li>
              </ul>
            </div>
          </div>

          <div class="border-2 border-purple-300 rounded-lg p-6">
            <h4 class="font-bold text-purple-800 mb-3 text-lg">Caso 2: Planificación con Foco en el Juego</h4>
            <div class="bg-purple-50 p-4 rounded mb-4">
              <p class="text-gray-700 mb-2"><strong>Objetivo:</strong></p>
              <p class="text-sm text-gray-600">
                Desarrollar pensamiento matemático (comparación de cantidades) en NT2 de forma lúdica y significativa.
              </p>
            </div>
            <div class="bg-white p-4 rounded">
              <p class="text-gray-700 mb-2"><strong>✅ Experiencia de Aprendizaje:</strong></p>
              <p class="text-sm text-gray-600 mb-3">
                <strong>"La Feria de Frutas"</strong> - Juego de roles donde niños/as son vendedores y compradores
              </p>
              <ul class="text-sm text-gray-600 space-y-2 ml-4">
                <li>• <strong>Inicio:</strong> Conversar sobre la feria, qué venden, quiénes participan</li>
                <li>• <strong>Desarrollo:</strong> Montar la feria con frutas de juguete, canastos, monedas</li>
                <li>• <strong>Juego:</strong> Comprar, vender, comparar "¿quién tiene más manzanas?"</li>
                <li>• <strong>Cierre:</strong> Reflexionar: ¿Qué vendió más? ¿Cómo lo saben?</li>
              </ul>
              <div class="mt-3 bg-green-50 p-3 rounded">
                <p class="text-sm text-green-800">
                  <strong>💡 Articulación curricular:</strong> Integra Pensamiento Matemático, Lenguaje Verbal 
                  (negociar, preguntar precios), Convivencia (turnos, roles) y Corporalidad (motricidad fina al manipular)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECURSOS DIDÁCTICOS -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">🧰 Recursos Didácticos Recomendados</h2>
        
        <table class="table-modern">
          <thead>
            <tr>
              <th>Tipo de Recurso</th>
              <th>Ejemplos</th>
              <th>Ámbitos que Favorece</th>
              <th>Consideraciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold">Materiales No Estructurados</td>
              <td class="text-sm">Palos, piedras, telas, cajas, arcilla, agua, arena</td>
              <td class="text-sm">Creatividad, resolución de problemas, exploración</td>
              <td class="text-sm">Permiten múltiples usos, promueven imaginación</td>
            </tr>
            <tr>
              <td class="font-bold">Literatura Infantil</td>
              <td class="text-sm">Álbumes ilustrados, poesía, cuentos tradicionales</td>
              <td class="text-sm">Lenguaje verbal, identidad, comprensión sociocultural</td>
              <td class="text-sm">Seleccionar textos de calidad literaria y gráfica</td>
            </tr>
            <tr>
              <td class="font-bold">Materiales Naturales</td>
              <td class="text-sm">Hojas, flores, semillas, conchas, madera</td>
              <td class="text-sm">Exploración natural, pensamiento matemático (clasificar)</td>
              <td class="text-sm">Promover respeto por la naturaleza</td>
            </tr>
            <tr>
              <td class="font-bold">Instrumentos Musicales</td>
              <td class="text-sm">Tambores, maracas, xilófonos, flautas simples</td>
              <td class="text-sm">Lenguajes artísticos, expresión emocional</td>
              <td class="text-sm">Accesibles, diversos timbres, exploración libre</td>
            </tr>
            <tr>
              <td class="font-bold">Materiales de Construcción</td>
              <td class="text-sm">Bloques de madera, LEGO, tubos, conectores</td>
              <td class="text-sm">Pensamiento matemático, resolución de problemas</td>
              <td class="text-sm">Variedad de tamaños, formas, colores</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TRABAJO CON FAMILIAS -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">👨‍👩‍👧‍👦 Trabajo Colaborativo con Familias</h2>
        
        <div class="definition-box">
          <h3 class="text-xl font-bold text-white mb-3">🤝 Familia como Primer Educador</h3>
          <p class="text-white text-lg leading-relaxed">
            Las Bases Curriculares reconocen a la <strong>familia como primer educador</strong> y la importancia de 
            construir una <strong>alianza colaborativa</strong> entre familia y jardín infantil. La participación 
            activa de las familias enriquece el proceso educativo y fortalece los aprendizajes.
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mt-6">
          <div class="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg border-2 border-pink-200">
            <h4 class="font-bold text-pink-800 mb-3">📋 Estrategias de Participación</h4>
            <ul class="text-sm text-gray-700 space-y-2">
              <li>✓ <strong>Reuniones periódicas:</strong> Compartir avances, escuchar inquietudes</li>
              <li>✓ <strong>Entrevistas individuales:</strong> Conocer contexto familiar, acuerdos</li>
              <li>✓ <strong>Talleres para familias:</strong> Juego, lectura compartida, crianza respetuosa</li>
              <li>✓ <strong>Participación en proyectos:</strong> Invitar a compartir saberes, oficios</li>
              <li>✓ <strong>Comunicación diaria:</strong> Agenda, fotos, mensajes breves de lo vivido</li>
            </ul>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200">
            <h4 class="font-bold text-purple-800 mb-3">💬 Comunicación Efectiva</h4>
            <ul class="text-sm text-gray-700 space-y-2">
              <li>✓ <strong>Lenguaje claro:</strong> Evitar tecnicismos, ser accesible</li>
              <li>✓ <strong>Enfoque en fortalezas:</strong> Destacar logros antes de desafíos</li>
              <li>✓ <strong>Escucha activa:</strong> Validar emociones, acoger diferencias</li>
              <li>✓ <strong>Diversidad cultural:</strong> Respetar prácticas de crianza diversas</li>
              <li>✓ <strong>Confidencialidad:</strong> Resguardar información sensible</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CONCLUSIÓN -->
      <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-4 text-center">✨ En Resumen</h2>
        <div class="grid md:grid-cols-3 gap-6 mt-6">
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <div class="text-4xl mb-3">🌱</div>
            <h4 class="font-bold text-pink-700 mb-2">El niño/a es protagonista</h4>
            <p class="text-sm text-gray-600">Sus intereses, ritmos y singularidad guían el proceso educativo</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <div class="text-4xl mb-3">🎮</div>
            <h4 class="font-bold text-purple-700 mb-2">El juego es la metodología</h4>
            <p class="text-sm text-gray-600">Aprender jugando, explorando, experimentando y creando</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow text-center">
            <div class="text-4xl mb-3">🤝</div>
            <h4 class="font-bold text-blue-700 mb-2">La familia es aliada esencial</h4>
            <p class="text-sm text-gray-600">Colaboración activa, comunicación respetuosa y trabajo conjunto</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {{
  console.log('Guía de Estudio Parvularia cargada correctamente');
}});
</script>
"""

# Escribir archivo
output_path = 'evaluaciones/educacion-parvularia/estudio/parvularia-nt.njk'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Dossier de Parvularia generado exitosamente: {output_path}")
print(f"   Total de líneas: {len(html.splitlines())}")
print(f"   Total de caracteres: {len(html):,}")
