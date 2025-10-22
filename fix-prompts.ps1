# Script para corregir y mejorar los prompts de retroalimentación con IA

$file = "privado\registro-notas.html"
$content = Get-Content $file -Raw -Encoding UTF8

# Primero corregir todos los caracteres corruptos restantes
$content = $content -replace 'SEGÃšN ENFOQUE', 'SEGÚN ENFOQUE'
$content = $content -replace 'PEDAGÃ"GICAS', 'PEDAGÓGICAS'
$content = $content -replace 'PROYECCIÃ"N', 'PROYECCIÓN'
$content = $content -replace 'RETROALIMENTACIÃ"N', 'RETROALIMENTACIÓN'

# Ahora reemplazar el bloque de estrategias completo con versión mejorada
$pattern = "const estrategias = \{[\s\S]*?'formativa':[^\}]*\}[\s]*\};"

$newBlock = @'
const estrategias = {
                'general': `

**💡 ORIENTACIONES PEDAGÓGICAS:**

Para continuar fortaleciendo tus competencias comunicativas, te propongo:

• **Lectura activa**: Mantén una lectura sistemática de textos diversos (literarios, informativos, multimodales). Aplica estrategias como subrayar, resumir y hacer conexiones con tu experiencia.

• **Escritura reflexiva**: Practica escribir regularmente, revisando y mejorando tus textos. Cada versión te acerca a una mejor expresión de tus ideas.

• **Participación dialogada**: Comparte tus interpretaciones en clase, fundamentando con evidencia textual. El diálogo con tus compañeros enriquece tu comprensión.

• **Conexiones significativas**: Relaciona lo que lees con otros textos, tu vida y el mundo actual. Esto profundiza tu comprensión crítica.`,
                
                'oas': `

**🎯 PLAN DE TRABAJO POR OBJETIVOS:**

Según las Bases Curriculares, trabajaremos estos objetivos con estrategias concretas:

• **Comprensión lectora**: Usaremos organizadores gráficos para visualizar ideas clave, practicando inferencias, síntesis y evaluación crítica.

• **Producción textual**: Desarrollarás textos siguiendo un proceso guiado (planificar → escribir → revisar → editar) con retroalimentación constante.

• **Análisis crítico**: Identificarás propósitos comunicativos, contextos culturales y recursos retóricos en diversos textos.

• **Evaluación procesual**: Monitoreamos tu avance con evaluaciones formativas que te permitan identificar fortalezas y áreas de mejora.`,
                
                'motivacional': `

**✨ RECONOCIMIENTO Y PROYECCIÓN:**

Tu trayectoria demuestra capacidad de superación y un potencial que merece ser reconocido. Los logros que has alcanzado son evidencia de que cuando te comprometes con tu aprendizaje, los resultados positivos llegan.

Te invito a:
• **Reconocer tus fortalezas** como base para seguir creciendo
• **Establecer metas alcanzables** que te desafíen sin abrumarte
• **Ver los errores como oportunidades** de aprendizaje, no como fracasos
• **Visualizarte como protagonista** de tu propio aprendizaje: eres capaz de ser un lector crítico y un escritor competente.`,
                
                'estrategias': `

**🛠️ ESTRATEGIAS CONCRETAS DE MEJORA:**

**1. Comprensión lectora:**
   • Estrategia SQA: Antes de leer pregúntate "¿Qué Sé?", durante la lectura "¿Qué quiero saber?" y al finalizar "¿Qué Aprendí?"
   • Subraya ideas principales con diferentes colores
   • Haz resúmenes progresivos al final de cada párrafo o página

**2. Producción textual:**
   • Planifica antes de escribir: haz un esquema con tus ideas
   • Escribe un primer borrador sin preocuparte por la perfección
   • Revisa coherencia (¿tiene sentido?) y cohesión (¿está bien conectado?)
   • Edita: corrige ortografía, puntuación y redacción

**3. Análisis crítico:**
   • Pregúntate: ¿Qué intención tiene el autor?
   • Identifica posibles sesgos o puntos de vista
   • Contrasta con otras perspectivas

**4. Gestión del aprendizaje:**
   • Establece horarios de estudio semanales
   • Alterna técnicas: lectura, resúmenes, mapas conceptuales
   • Autoevalúate cada semana: ¿Qué logré? ¿Qué puedo mejorar?`,
                
                'formativa': `

**📊 RETROALIMENTACIÓN PARA EL APRENDIZAJE:**

Tu aprendizaje es un proceso dinámico que mejora con la reflexión constante. Te propongo:

• **Metacognición**: Reflexiona sobre tus estrategias de lectura y escritura. ¿Qué te funciona mejor? ¿Qué necesitas ajustar?

• **Retroalimentación oportuna**: No dudes en pedirme comentarios sobre tus trabajos antes de entregarlos. La retroalimentación temprana te permite mejorar.

• **Autoevaluación con rúbricas**: Revisa los criterios de evaluación antes de comenzar una tarea. Esto te ayuda a autorregular tu trabajo.

• **Coevaluación entre pares**: Intercambia textos con compañeros y dale/recibe comentarios constructivos. Aprendemos mucho unos de otros.

• **Portafolio de aprendizaje**: Guarda tus mejores trabajos y reflexiona sobre tu evolución. Ver tu progreso es motivador.`
            };
'@

$content = $content -replace $pattern, $newBlock

# Guardar archivo
$content | Set-Content $file -Encoding UTF8 -NoNewline

Write-Host "✅ Prompts corregidos y mejorados:" -ForegroundColor Green
Write-Host "   • Caracteres corruptos eliminados" -ForegroundColor Cyan
Write-Host "   • Formato mejorado con emojis y bullets" -ForegroundColor Cyan
Write-Host "   • Tono más empático y constructivo" -ForegroundColor Cyan
Write-Host "   • Estrategias más claras y accionables" -ForegroundColor Cyan
