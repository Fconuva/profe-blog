"""
AGREGAR IA EN DOSSIERES (Páginas de Contenido/Estudio)
Integrar sistema de consulta IA en páginas de estudio pedagógico
"""

def agregar_ia_dossier_parvularia():
    """Agregar IA interactiva en dossier de Parvularia"""
    
    contenido_ia = '''
<!-- ============================== -->
<!-- SISTEMA DE IA EN DOSSIER -->
<!-- ============================== -->

<style>
.ia-section {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
  border: 3px solid #f59e0b;
}

.ia-section h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ia-button {
  background: white;
  color: #f59e0b;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.ia-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  background: #fef3c7;
}

.ia-response-box {
  display: none;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border-left: 5px solid #fbbf24;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.ia-input-box {
  width: 100%;
  padding: 1rem;
  border: 2px solid #fbbf24;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-family: inherit;
}

.ia-loading {
  display: none;
  color: #f59e0b;
  font-weight: 600;
  margin-top: 1rem;
}
</style>

<!-- Sección IA: Identidad y Autonomía -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Identidad y Autonomía</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre desarrollo de la identidad, autonomía, autorregulación y bienestar emocional en NT1/NT2</p>
  
  <button class="ia-button" onclick="toggleIABox('identidad')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-identidad" class="ia-response-box">
    <input type="text" 
           id="ia-input-identidad" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Cómo promover la autorregulación en niños de 4 años?">
    <button class="ia-button" onclick="consultarIA('identidad', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Identidad y Autonomía de las BCEP 2018. Responde preguntas sobre desarrollo de la identidad, autonomía, autorregulación emocional, bienestar emocional y autocuidado en niños de NT1 y NT2.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-identidad" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-identidad" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Convivencia y Ciudadanía -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Convivencia y Ciudadanía</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre resolución de conflictos, empatía, participación democrática y formación ciudadana</p>
  
  <button class="ia-button" onclick="toggleIABox('convivencia')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-convivencia" class="ia-response-box">
    <input type="text" 
           id="ia-input-convivencia" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Cómo mediar conflictos entre párvulos de 5 años?">
    <button class="ia-button" onclick="consultarIA('convivencia', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Convivencia y Ciudadanía de las BCEP 2018. Responde preguntas sobre resolución de conflictos, empatía, participación democrática, normas de convivencia, respeto por la diversidad y formación ciudadana en Educación Parvularia.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-convivencia" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-convivencia" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Corporalidad y Movimiento -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Corporalidad y Movimiento</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre desarrollo motor, coordinación, expresión corporal y vida saludable</p>
  
  <button class="ia-button" onclick="toggleIABox('corporalidad')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-corporalidad" class="ia-response-box">
    <input type="text" 
           id="ia-input-corporalidad" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Qué actividades desarrollan motricidad fina en NT1?">
    <button class="ia-button" onclick="consultarIA('corporalidad', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Corporalidad y Movimiento de las BCEP 2018. Responde preguntas sobre desarrollo motor grueso y fino, coordinación, equilibrio, expresión corporal, danza, vida saludable y cuidado del cuerpo.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-corporalidad" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-corporalidad" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Lenguaje Verbal -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Lenguaje Verbal</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre comunicación oral, conciencia fonológica, lectura emergente y producción de textos</p>
  
  <button class="ia-button" onclick="toggleIABox('lenguaje')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-lenguaje" class="ia-response-box">
    <input type="text" 
           id="ia-input-lenguaje" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Cómo desarrollar conciencia fonológica sin ejercicios mecánicos?">
    <button class="ia-button" onclick="consultarIA('lenguaje', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Lenguaje Verbal de las BCEP 2018. Responde preguntas sobre comunicación oral, conciencia fonológica, lectura emergente, comprensión lectora, producción de textos y apreciación literaria.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-lenguaje" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-lenguaje" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Lenguajes Artísticos -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Lenguajes Artísticos</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre expresión artística, música, danza, teatro y apreciación estética</p>
  
  <button class="ia-button" onclick="toggleIABox('arte')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-arte" class="ia-response-box">
    <input type="text" 
           id="ia-input-arte" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Cómo promover creatividad sin modelos adultos?">
    <button class="ia-button" onclick="consultarIA('arte', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Lenguajes Artísticos de las BCEP 2018. Responde preguntas sobre expresión plástica, música, danza, teatro, juego dramático, apreciación estética y creatividad.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-arte" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-arte" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Pensamiento Matemático -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Pensamiento Matemático</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre cuantificación, patrones, formas, medición y razonamiento lógico-matemático</p>
  
  <button class="ia-button" onclick="toggleIABox('matematica')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-matematica" class="ia-response-box">
    <input type="text" 
           id="ia-input-matematica" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Cómo enseñar números sin fichas ni cuadernillos?">
    <button class="ia-button" onclick="consultarIA('matematica', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Pensamiento Matemático de las BCEP 2018. Responde preguntas sobre cuantificación, patrones y relaciones, formas y espacio, medición, resolución de problemas y razonamiento lógico-matemático.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-matematica" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-matematica" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Comprensión del Entorno Sociocultural -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Comprensión del Entorno Sociocultural</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre historia, cultura, geografía, patrimonio y diversidad cultural</p>
  
  <button class="ia-button" onclick="toggleIABox('sociocultural')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-sociocultural" class="ia-response-box">
    <input type="text" 
           id="ia-input-sociocultural" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Cómo trabajar pueblos originarios sin folclorizar?">
    <button class="ia-button" onclick="consultarIA('sociocultural', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Comprensión del Entorno Sociocultural de las BCEP 2018. Responde preguntas sobre historia personal y familiar, cultura, geografía, patrimonio, diversidad cultural, interculturalidad y conciencia ciudadana.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-sociocultural" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-sociocultural" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Exploración del Entorno Natural -->
<div class="ia-section no-print">
  <h3>🤖 Consultar IA: Exploración del Entorno Natural</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre ciencias, exploración, seres vivos, fenómenos naturales y cuidado del medio ambiente</p>
  
  <button class="ia-button" onclick="toggleIABox('natural')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-natural" class="ia-response-box">
    <input type="text" 
           id="ia-input-natural" 
           class="ia-input-box" 
           placeholder="Ejemplo: ¿Qué experimentos científicos son apropiados para NT2?">
    <button class="ia-button" onclick="consultarIA('natural', 'Eres un experto en Educación Parvularia, especializado en el núcleo de Exploración del Entorno Natural de las BCEP 2018. Responde preguntas sobre pensamiento científico, exploración, observación, experimentación, seres vivos, fenómenos naturales y cuidado del medio ambiente.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-natural" class="ia-loading">⏳ Consultando IA...</div>
    <div id="ia-response-natural" style="margin-top: 1rem;"></div>
  </div>
</div>

<script>
function toggleIABox(nucleo) {
  const box = document.getElementById(`ia-box-${nucleo}`);
  if (box.style.display === 'none' || box.style.display === '') {
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
}

async function consultarIA(nucleo, systemPrompt) {
  const inputElement = document.getElementById(`ia-input-${nucleo}`);
  const loadingElement = document.getElementById(`ia-loading-${nucleo}`);
  const responseElement = document.getElementById(`ia-response-${nucleo}`);
  
  const pregunta = inputElement.value.trim();
  
  if (!pregunta) {
    responseElement.innerHTML = '<p style="color: #dc2626; font-weight: 600;">⚠️ Por favor escribe una pregunta</p>';
    return;
  }
  
  loadingElement.style.display = 'block';
  responseElement.innerHTML = '';
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://profefranciscopancho.netlify.app',
        'X-Title': 'Profesor Francisco Pancho - Dossieres Pedagógicos'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt + ' Responde de manera clara, pedagógica y práctica. Usa ejemplos concretos cuando sea pertinente. Cita las BCEP 2018 cuando corresponda. Máximo 300 palabras.'
          },
          {
            role: 'user',
            content: pregunta
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    const respuesta = data.choices[0].message.content;
    
    responseElement.innerHTML = `
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; border-radius: 8px;">
        <p style="font-weight: 600; color: #15803d; margin-bottom: 0.5rem;">✅ Respuesta de IA:</p>
        <div style="color: #374151; line-height: 1.6;">${respuesta.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  } catch (error) {
    responseElement.innerHTML = `
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 1rem; border-radius: 8px;">
        <p style="font-weight: 600; color: #dc2626; margin-bottom: 0.5rem;">❌ Error al consultar IA</p>
        <p style="color: #374151;">Por favor intenta nuevamente. Si el problema persiste, contacta al administrador.</p>
      </div>
    `;
  } finally {
    loadingElement.style.display = 'none';
  }
}
</script>

<!-- ============================== -->
<!-- FIN SISTEMA DE IA EN DOSSIER -->
<!-- ============================== -->
'''
    
    # Leer archivo actual
    with open('evaluaciones/educacion-parvularia/estudio/parvularia-nt.njk', 'r', encoding='utf-8') as f:
        contenido_actual = f.read()
    
    # Insertar antes del cierre del contenedor principal (antes de </div></div></div>)
    # Buscar el final del contenido, justo antes de los </div> finales
    if '<!-- Fin del contenido -->' in contenido_actual:
        contenido_nuevo = contenido_actual.replace(
            '<!-- Fin del contenido -->',
            contenido_ia + '\n\n<!-- Fin del contenido -->'
        )
    else:
        # Si no hay marcador, insertar antes de los últimos </div>
        partes = contenido_actual.rsplit('</div>', 3)
        contenido_nuevo = partes[0] + contenido_ia + '\n' + '</div>'.join(partes[1:])
    
    with open('evaluaciones/educacion-parvularia/estudio/parvularia-nt.njk', 'w', encoding='utf-8') as f:
        f.write(contenido_nuevo)
    
    print("✅ IA agregada en dossier de Parvularia (8 núcleos interactivos)")

def agregar_ia_dossier_matematica():
    """Agregar IA interactiva en dossier de Matemática Media"""
    
    contenido_ia = '''
<!-- ============================== -->
<!-- SISTEMA DE IA EN DOSSIER -->
<!-- ============================== -->

<style>
.ia-section-mat {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  border: 3px solid #059669;
}

.ia-section-mat h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ia-button-mat {
  background: white;
  color: #059669;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.ia-button-mat:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  background: #d1fae5;
}

.ia-response-box-mat {
  display: none;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  border-left: 5px solid #10b981;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.ia-input-box-mat {
  width: 100%;
  padding: 1rem;
  border: 2px solid #10b981;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-family: inherit;
}

.ia-loading-mat {
  display: none;
  color: #059669;
  font-weight: 600;
  margin-top: 1rem;
}
</style>

<!-- Sección IA: Números -->
<div class="ia-section-mat no-print">
  <h3>🤖 Consultar IA: Números</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre números reales, complejos, operaciones, propiedades y conjuntos numéricos</p>
  
  <button class="ia-button-mat" onclick="toggleIABoxMat('numeros')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-mat-numeros" class="ia-response-box-mat">
    <input type="text" 
           id="ia-input-mat-numeros" 
           class="ia-input-box-mat" 
           placeholder="Ejemplo: ¿Cómo explicar números complejos a estudiantes de III medio?">
    <button class="ia-button-mat" onclick="consultarIAMat('numeros', 'Eres un experto en didáctica de la matemática, especializado en el eje de Números para Educación Media. Responde preguntas sobre números reales, racionales, irracionales, complejos, operaciones, propiedades, conjuntos numéricos y cómo enseñarlos efectivamente.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-mat-numeros" class="ia-loading-mat">⏳ Consultando IA...</div>
    <div id="ia-response-mat-numeros" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Álgebra y Funciones -->
<div class="ia-section-mat no-print">
  <h3>🤖 Consultar IA: Álgebra y Funciones</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre ecuaciones, inecuaciones, funciones, gráficas y modelamiento algebraico</p>
  
  <button class="ia-button-mat" onclick="toggleIABoxMat('algebra')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-mat-algebra" class="ia-response-box-mat">
    <input type="text" 
           id="ia-input-mat-algebra" 
           class="ia-input-box-mat" 
           placeholder="Ejemplo: ¿Cómo usar GeoGebra para enseñar función cuadrática?">
    <button class="ia-button-mat" onclick="consultarIAMat('algebra', 'Eres un experto en didáctica de la matemática, especializado en Álgebra y Funciones para Educación Media. Responde preguntas sobre ecuaciones, inecuaciones, funciones (lineal, cuadrática, exponencial, logarítmica), gráficas, modelamiento y estrategias de enseñanza.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-mat-algebra" class="ia-loading-mat">⏳ Consultando IA...</div>
    <div id="ia-response-mat-algebra" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Geometría -->
<div class="ia-section-mat no-print">
  <h3>🤖 Consultar IA: Geometría</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre figuras planas, cuerpos geométricos, perímetro, área, volumen y teoremas</p>
  
  <button class="ia-button-mat" onclick="toggleIABoxMat('geometria')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-mat-geometria" class="ia-response-box-mat">
    <input type="text" 
           id="ia-input-mat-geometria" 
           class="ia-input-box-mat" 
           placeholder="Ejemplo: ¿Cómo enseñar teorema de Pitágoras con problemas reales?">
    <button class="ia-button-mat" onclick="consultarIAMat('geometria', 'Eres un experto en didáctica de la matemática, especializado en Geometría para Educación Media. Responde preguntas sobre figuras planas, cuerpos geométricos, perímetro, área, volumen, semejanza, congruencia, teorema de Pitágoras, trigonometría y vectores.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-mat-geometria" class="ia-loading-mat">⏳ Consultando IA...</div>
    <div id="ia-response-mat-geometria" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Estadística y Probabilidad -->
<div class="ia-section-mat no-print">
  <h3>🤖 Consultar IA: Estadística y Probabilidad</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre datos, gráficos, medidas de tendencia central, probabilidad y toma de decisiones</p>
  
  <button class="ia-button-mat" onclick="toggleIABoxMat('estadistica')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-mat-estadistica" class="ia-response-box-mat">
    <input type="text" 
           id="ia-input-mat-estadistica" 
           class="ia-input-box-mat" 
           placeholder="Ejemplo: ¿Cómo enseñar media vs mediana con ejemplos reales?">
    <button class="ia-button-mat" onclick="consultarIAMat('estadistica', 'Eres un experto en didáctica de la matemática, especializado en Estadística y Probabilidad para Educación Media. Responde preguntas sobre recolección y análisis de datos, gráficos, medidas de tendencia central, dispersión, probabilidad teórica y experimental, y toma de decisiones basada en datos.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-mat-estadistica" class="ia-loading-mat">⏳ Consultando IA...</div>
    <div id="ia-response-mat-estadistica" style="margin-top: 1rem;"></div>
  </div>
</div>

<!-- Sección IA: Didáctica y Resolución de Problemas -->
<div class="ia-section-mat no-print">
  <h3>🤖 Consultar IA: Didáctica y Resolución de Problemas</h3>
  <p style="color: white; margin-bottom: 1rem;">Haz preguntas sobre estrategias de enseñanza, errores comunes, evaluación formativa y habilidades del siglo XXI</p>
  
  <button class="ia-button-mat" onclick="toggleIABoxMat('didactica')">
    💬 Hacer una pregunta
  </button>
  
  <div id="ia-box-mat-didactica" class="ia-response-box-mat">
    <input type="text" 
           id="ia-input-mat-didactica" 
           class="ia-input-box-mat" 
           placeholder="Ejemplo: ¿Cómo promover argumentación matemática en clases?">
    <button class="ia-button-mat" onclick="consultarIAMat('didactica', 'Eres un experto en didáctica de la matemática para Educación Media. Responde preguntas sobre estrategias de enseñanza, resolución de problemas, modelamiento matemático, uso de tecnología, evaluación formativa, retroalimentación efectiva, errores conceptuales comunes y desarrollo de habilidades del siglo XXI.')">
      ✨ Consultar IA
    </button>
    <div id="ia-loading-mat-didactica" class="ia-loading-mat">⏳ Consultando IA...</div>
    <div id="ia-response-mat-didactica" style="margin-top: 1rem;"></div>
  </div>
</div>

<script>
function toggleIABoxMat(dominio) {
  const box = document.getElementById(`ia-box-mat-${dominio}`);
  if (box.style.display === 'none' || box.style.display === '') {
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
}

async function consultarIAMat(dominio, systemPrompt) {
  const inputElement = document.getElementById(`ia-input-mat-${dominio}`);
  const loadingElement = document.getElementById(`ia-loading-mat-${dominio}`);
  const responseElement = document.getElementById(`ia-response-mat-${dominio}`);
  
  const pregunta = inputElement.value.trim();
  
  if (!pregunta) {
    responseElement.innerHTML = '<p style="color: #dc2626; font-weight: 600;">⚠️ Por favor escribe una pregunta</p>';
    return;
  }
  
  loadingElement.style.display = 'block';
  responseElement.innerHTML = '';
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://profefranciscopancho.netlify.app',
        'X-Title': 'Profesor Francisco Pancho - Dossieres Matemática'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt + ' Responde de manera clara, con ejemplos concretos y paso a paso cuando sea pertinente. Usa notación matemática apropiada. Máximo 300 palabras.'
          },
          {
            role: 'user',
            content: pregunta
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    const respuesta = data.choices[0].message.content;
    
    responseElement.innerHTML = `
      <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 1rem; border-radius: 8px;">
        <p style="font-weight: 600; color: #047857; margin-bottom: 0.5rem;">✅ Respuesta de IA:</p>
        <div style="color: #374151; line-height: 1.6;">${respuesta.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  } catch (error) {
    responseElement.innerHTML = `
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 1rem; border-radius: 8px;">
        <p style="font-weight: 600; color: #dc2626; margin-bottom: 0.5rem;">❌ Error al consultar IA</p>
        <p style="color: #374151;">Por favor intenta nuevamente. Si el problema persiste, contacta al administrador.</p>
      </div>
    `;
  } finally {
    loadingElement.style.display = 'none';
  }
}
</script>

<!-- ============================== -->
<!-- FIN SISTEMA DE IA EN DOSSIER -->
<!-- ============================== -->
'''
    
    # Leer archivo actual
    with open('evaluaciones/educacion-media/estudio/matematica-media-67/index.njk', 'r', encoding='utf-8') as f:
        contenido_actual = f.read()
    
    # Insertar antes del cierre del contenedor principal
    if '<!-- Fin del contenido -->' in contenido_actual:
        contenido_nuevo = contenido_actual.replace(
            '<!-- Fin del contenido -->',
            contenido_ia + '\n\n<!-- Fin del contenido -->'
        )
    else:
        partes = contenido_actual.rsplit('</div>', 3)
        contenido_nuevo = partes[0] + contenido_ia + '\n' + '</div>'.join(partes[1:])
    
    with open('evaluaciones/educacion-media/estudio/matematica-media-67/index.njk', 'w', encoding='utf-8') as f:
        f.write(contenido_nuevo)
    
    print("✅ IA agregada en dossier de Matemática Media (5 dominios interactivos)")

if __name__ == "__main__":
    print("="*70)
    print("🤖 AGREGANDO IA EN DOSSIERES PEDAGÓGICOS")
    print("="*70)
    
    agregar_ia_dossier_parvularia()
    agregar_ia_dossier_matematica()
    
    print("\n" + "="*70)
    print("🎉 IA AGREGADA EXITOSAMENTE EN DOSSIERES")
    print("="*70)
    print("\n✅ Parvularia: 8 núcleos con consulta IA")
    print("✅ Matemática: 5 dominios con consulta IA")
    print("\nLos estudiantes ahora pueden hacer preguntas específicas por tema")
    print("directamente en las páginas de estudio pedagógico.")
