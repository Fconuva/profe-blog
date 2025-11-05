#!/usr/bin/env python3
import os

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

javascript_code = """
  // ==================== CASOS PRÁCTICOS INTERACTIVOS ====================
  
  // Base de datos de respuestas y feedbacks
  const casosData = {
    '1': {
      correcta: 'B',
      feedbacks: {
        'A': {
          correcto: false,
          texto: '<strong>❌ No es la mejor opción.</strong><br><br>Simplemente pedir un resumen no garantiza la comprensión profunda del texto ni desarrolla habilidades de análisis crítico. Los estudiantes necesitan andamiaje para trabajar con fuentes históricas complejas.<br><br><strong>💡 Recuerda:</strong> Las fuentes históricas requieren contextualización y guía del docente, especialmente con estudiantes de 3° básico.'
        },
        'B': {
          correcto: true,
          texto: '<strong>✅ ¡Excelente elección!</strong><br><br>Esta estrategia integra efectivamente:<br>• <strong>Lenguaje:</strong> Lectura guiada con identificación de vocabulario contextual<br>• <strong>Historia:</strong> Análisis de fuentes primarias y perspectiva del autor<br>• <strong>Andamiaje:</strong> Preguntas dirigidas que facilitan la comprensión progresiva<br><br><strong>Fundamento pedagógico:</strong> La lectura guiada con análisis de perspectiva desarrolla pensamiento crítico y permite trabajar textos complejos de manera apropiada para la edad.'
        },
        'C': {
          correcto: false,
          texto: '<strong>❌ Estrategia insuficiente.</strong><br><br>La lectura individual sin guía puede resultar en frustración y comprensión superficial. Buscar en internet sin criterios claros puede llevar a información no apropiada o confiable.<br><br><strong>💡 Mejor:</strong> Primero guiar la lectura del documento, luego investigar aspectos específicos con fuentes pre-seleccionadas.'
        },
        'D': {
          correcto: false,
          texto: '<strong>❌ Actividad mecánica sin valor pedagógico.</strong><br><br>Copiar texto no desarrolla comprensión lectora ni habilidades de análisis histórico. Es una actividad pasiva que no promueve aprendizaje significativo.<br><br><strong>💡 Recuerda:</strong> Las actividades deben promover pensamiento activo, no simple reproducción.'
        }
      }
    },
    '2': {
      correcta: 'A',
      feedbacks: {
        'A': {
          correcto: true,
          texto: '<strong>✅ ¡Excelente integración curricular!</strong><br><br>Esta actividad combina perfectamente:<br>• <strong>Matemática:</strong> Representación de datos (gráfico de barras), interpretación de información cuantitativa<br>• <strong>Ciencias:</strong> Clasificación taxonómica (vertebrados/invertebrados)<br>• <strong>Habilidades transversales:</strong> Observación, registro, análisis<br><br><strong>Fundamento pedagógico:</strong> Los gráficos permiten visualizar patrones en los datos, mientras que la clasificación desarrolla pensamiento científico.'
        },
        'B': {
          correcto: false,
          texto: '<strong>❌ Integración débil.</strong><br><br>Aunque incluye elementos de ambas disciplinas, las actividades están desconectadas. Sumar cantidades sin propósito de análisis y listar características sin organización no promueve comprensión profunda.<br><br><strong>💡 Mejor:</strong> Buscar actividades donde las disciplinas se refuercen mutuamente, no solo coexistan.'
        },
        'C': {
          correcto: false,
          texto: '<strong>❌ Poco apropiado para 2° básico.</strong><br><br>Memorizar nombres científicos está fuera del nivel de desarrollo de 2° básico. Las sumas sin contexto no aprovechan los datos recolectados.<br><br><strong>💡 Recuerda:</strong> Las actividades deben ser apropiadas al nivel cognitivo y usar el contexto significativo del proyecto.'
        },
        'D': {
          correcto: false,
          texto: '<strong>❌ Actividad mecánica sin aprendizaje.</strong><br><br>Copiar y colorear son actividades pasivas que no desarrollan habilidades matemáticas ni científicas. Desaprovecha los datos recolectados por los estudiantes.<br><br><strong>💡 Mejor:</strong> Usar los datos para análisis activo: graficar, comparar, interpretar.'
        }
      }
    },
    '3': {
      correcta: 'B',
      feedbacks: {
        'A': {
          correcto: false,
          texto: '<strong>❌ Retroalimentación insuficiente.</strong><br><br>Decir "está mal" y dar la respuesta no ayuda al estudiante a comprender su error ni desarrolla autonomía en la resolución de problemas.<br><br><strong>💡 Recuerda:</strong> La retroalimentación efectiva debe ser descriptiva y orientar al estudiante hacia el razonamiento correcto.'
        },
        'B': {
          correcto: true,
          texto: '<strong>✅ ¡Estrategia pedagógica ejemplar!</strong><br><br>Esta aproximación integra:<br>• <strong>Comprensión lectora:</strong> Identificar palabras clave y su significado ("regaló" = restar, "compró" = sumar)<br>• <strong>Representación concreta:</strong> Visualizar el problema antes de abstraerlo<br>• <strong>Pensamiento matemático:</strong> Secuenciar operaciones lógicamente<br><br><strong>Fundamento pedagógico:</strong> El modelo CPA (Concreto-Pictórico-Abstracto) facilita la comprensión de problemas matemáticos escritos.'
        },
        'C': {
          correcto: false,
          texto: '<strong>❌ Práctica sin comprensión.</strong><br><br>Dar más problemas sin abordar la raíz del error (dificultad para interpretar el lenguaje del problema) solo genera frustración y refuerza estrategias incorrectas.<br><br><strong>💡 Mejor:</strong> Primero asegurar comprensión del problema, luego practicar.'
        },
        'D': {
          correcto: false,
          texto: '<strong>❌ Reduce la complejidad innecesariamente.</strong><br><br>Simplificar el problema no ayuda al estudiante a desarrollar estrategias para problemas de múltiples pasos. Es importante mantener el desafío con apoyo apropiado.<br><br><strong>💡 Recuerda:</strong> El andamiaje no es simplificar, es proporcionar apoyo para alcanzar el nivel de complejidad apropiado.'
        }
      }
    },
    '4': {
      correcta: 'B',
      feedbacks: {
        'A': {
          correcto: false,
          texto: '<strong>❌ Respuesta muy simplista.</strong><br><br>Esta respuesta no aprovecha la oportunidad pedagógica para explicar la relación entre geografía, recursos y adaptación cultural. Los estudiantes necesitan explicaciones que desarrollen su comprensión del mundo.<br><br><strong>💡 Recuerda:</strong> Las preguntas de los estudiantes son oportunidades para profundizar el aprendizaje.'
        },
        'B': {
          correcto: true,
          texto: '<strong>✅ ¡Respuesta pedagógica excepcional!</strong><br><br>Esta explicación integra múltiples dimensiones:<br>• <strong>Geografía:</strong> Características del altiplano (ríos, lagos, pastos)<br>• <strong>Recursos naturales:</strong> Agua, tierra, animales<br>• <strong>Adaptación cultural:</strong> Técnicas específicas (viviendas, uso de lana)<br>• <strong>Ciencias:</strong> Relación ser vivo-ambiente<br><br><strong>Fundamento pedagógico:</strong> Explica la relación causa-efecto entre geografía y cultura de manera accesible para 2° básico.'
        },
        'C': {
          correcto: false,
          texto: '<strong>❌ Respuesta trivial y errónea.</strong><br><br>Esta respuesta no proporciona información educativa y puede transmitir una visión simplista o estereotipada de los pueblos originarios.<br><br><strong>💡 Mejor:</strong> Usar cada pregunta como oportunidad para explicar conceptos importantes de manera apropiada.'
        },
        'D': {
          correcto: false,
          texto: '<strong>❌ Oportunidad pedagógica perdida.</strong><br><br>Posponer una pregunta relevante desaprovecha el momento de mayor interés y curiosidad del estudiante. Si la pregunta surge, es el mejor momento para abordarla.<br><br><strong>💡 Recuerda:</strong> La curiosidad es el motor del aprendizaje. Responde las preguntas cuando el interés está activo.'
        }
      }
    },
    '5': {
      correcta: 'B',
      feedbacks: {
        'A': {
          correcto: false,
          texto: '<strong>❌ Se enfoca en lo secundario.</strong><br><br>Corregir solo ortografía ignora el problema principal: la falta de estructura en el texto. Los estudiantes necesitan aprender a organizar ideas antes de pulir la forma.<br><br><strong>💡 Recuerda:</strong> En la escritura de informes científicos, la estructura y claridad son prioritarias.'
        },
        'B': {
          correcto: true,
          texto: '<strong>✅ ¡Estrategia de escritura científica ideal!</strong><br><br>Esta aproximación desarrolla:<br>• <strong>Estructura textual:</strong> Plantilla con secciones claras (pregunta, procedimiento, observaciones, conclusiones)<br>• <strong>Modelamiento:</strong> El docente muestra cómo completar cada sección<br>• <strong>Género científico:</strong> Introduce la estructura del informe de experimento<br>• <strong>Andamiaje:</strong> Proporciona apoyo que gradualmente se retirará<br><br><strong>Fundamento pedagógico:</strong> Las plantillas estructuradas facilitan la escritura de textos complejos en niveles iniciales.'
        },
        'C': {
          correcto: false,
          texto: '<strong>❌ Evita el desarrollo de escritura.</strong><br><br>Aunque el dibujo es valioso para representar observaciones, los estudiantes también necesitan desarrollar habilidades de escritura científica. Ambas formas de comunicación son importantes.<br><br><strong>💡 Mejor:</strong> Combinar dibujos con texto estructurado.'
        },
        'D': {
          correcto: false,
          texto: '<strong>❌ Aprendizaje pasivo.</strong><br><br>Copiar un modelo no desarrolla habilidades de escritura propias. Los estudiantes deben construir activamente sus textos con apoyo, no reproducir textos ajenos.<br><br><strong>💡 Recuerda:</strong> El modelamiento debe inspirar, no reemplazar la producción propia.'
        }
      }
    },
    '6': {
      correcta: 'A',
      feedbacks: {
        'A': {
          correcto: true,
          texto: '<strong>✅ ¡Integración curricular perfecta!</strong><br><br>Esta actividad combina magistralmente:<br>• <strong>Historia:</strong> Línea de tiempo, secuencia cronológica, eventos personales<br>• <strong>Matemática:</strong> Cálculo de diferencias (resta de años), números ordinales, secuencia numérica<br>• <strong>Significatividad:</strong> Usa la vida del estudiante como contexto (aprendizaje personal)<br><br><strong>Fundamento pedagógico:</strong> Integra habilidades matemáticas (cálculo temporal) con pensamiento histórico (secuencia cronológica) de manera natural y significativa.'
        },
        'B': {
          correcto: false,
          texto: '<strong>❌ Desaprovecha la integración matemática.</strong><br><br>Una línea de tiempo sin números pierde su valor como herramienta de medición temporal y no permite trabajar conceptos matemáticos de secuencia y diferencia.<br><br><strong>💡 Mejor:</strong> Las fechas y números son esenciales para el pensamiento temporal y matemático.'
        },
        'C': {
          correcto: false,
          texto: '<strong>❌ Actividad desconectada del objetivo.</strong><br><br>Memorizar fechas históricas de Chile no se relaciona con la línea de tiempo personal ni integra matemática de manera significativa.<br><br><strong>💡 Recuerda:</strong> La integración curricular debe ser orgánica, no forzada ni desconectada del contexto.'
        },
        'D': {
          correcto: false,
          texto: '<strong>❌ Sin integración curricular.</strong><br><br>Ejercicios de cálculo descontextualizados no aprovechan el proyecto de línea de tiempo personal ni desarrollan pensamiento histórico.<br><br><strong>💡 Mejor:</strong> Usar el contexto significativo (línea de tiempo) para dar sentido a los cálculos matemáticos.'
        }
      }
    }
  };
  
  // Event listeners para las opciones de casos
  document.querySelectorAll('.caso-option').forEach(option => {
    option.addEventListener('click', function() {
      const casoId = this.dataset.caso;
      const opcionSeleccionada = this.dataset.opcion;
      const casoData = casosData[casoId];
      
      // Deshabilitar todas las opciones de este caso
      const todasOpciones = document.querySelectorAll(`.caso-option[data-caso="${casoId}"]`);
      todasOpciones.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.classList.remove('hover:border-purple-400', 'hover:border-blue-400', 'hover:border-green-400', 'hover:border-orange-400', 'hover:border-indigo-400');
      });
      
      // Marcar la seleccionada
      const feedback = casoData.feedbacks[opcionSeleccionada];
      if (feedback.correcto) {
        this.classList.add('border-green-500', 'bg-green-50');
      } else {
        this.classList.add('border-red-500', 'bg-red-50');
        // Mostrar también la correcta
        const opcionCorrecta = document.querySelector(`.caso-option[data-caso="${casoId}"][data-opcion="${casoData.correcta}"]`);
        if (opcionCorrecta) {
          opcionCorrecta.classList.add('border-green-500', 'bg-green-50');
          const checkmark = document.createElement('span');
          checkmark.className = 'text-green-600 font-bold ml-2';
          checkmark.textContent = '✓ Correcta';
          opcionCorrecta.appendChild(checkmark);
        }
      }
      
      // Mostrar feedback
      const feedbackDiv = document.querySelector(`.caso-feedback[data-caso="${casoId}"]`);
      const feedbackContent = feedbackDiv.querySelector('.feedback-content');
      feedbackContent.innerHTML = feedback.texto;
      
      if (feedback.correcto) {
        feedbackDiv.classList.add('bg-green-50', 'border-l-4', 'border-green-500');
      } else {
        feedbackDiv.classList.add('bg-red-50', 'border-l-4', 'border-red-500');
      }
      
      feedbackDiv.classList.remove('hidden');
      
      // Actualizar progreso
      const progressCircle = document.querySelector(`.caso-progress[data-caso="${casoId}"]`);
      if (progressCircle) {
        if (feedback.correcto) {
          progressCircle.classList.remove('bg-gray-200', 'text-gray-600');
          progressCircle.classList.add('bg-green-500', 'text-white');
          progressCircle.textContent = '✓';
        } else {
          progressCircle.classList.remove('bg-gray-200', 'text-gray-600');
          progressCircle.classList.add('bg-orange-400', 'text-white');
          progressCircle.textContent = '!';
        }
      }
      
      // Actualizar contador
      const resueltos = document.querySelectorAll('.caso-progress.bg-green-500, .caso-progress.bg-orange-400').length;
      document.getElementById('casos-resueltos').textContent = resueltos;
      
      // Scroll suave al feedback
      setTimeout(() => {
        feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  });
  
  // Smooth scroll para navegación interna
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
  
  console.log('✅ Guía de Básica Generalista con casos interactivos cargada');
  console.log('📊 6 casos prácticos disponibles');
"""

# Reemplazar el script básico existente
old_script = """<script>  // Funcionalidad JavaScript para casos interactivos (se agregará progresivamente)
  console.log('Guía de Básica Generalista cargada');
</script>"""

new_script = f"<script>{javascript_code}</script>"

contenido_nuevo = contenido.replace(old_script, new_script)

with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_nuevo)

print("OK - JavaScript interactivo agregado")
print("6 casos con feedbacks personalizados")
print("Sistema de progreso implementado")
