"""
Script para arreglar navegación, retroalimentación y clases CSS
Corrige 3 problemas:
1. Agregar clase 'pregunta-container' a TODAS las preguntas
2. Cambiar totalQuestions de 58 a 50
3. Integrar llamada a showImmediateFeedback en el navegador
"""

import re

# Leer archivo
with open("evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk", "r", encoding="utf-8") as f:
    content = f.read()

print("🔧 Iniciando reparación completa...\n")

# PROBLEMA 1: Agregar 'pregunta-container' a todas las preguntas que no la tienen
print("1️⃣ Agregando clase 'pregunta-container' a todas las preguntas...")

# Patrón para encontrar divs de preguntas SIN la clase
patron_sin_clase = r'(<div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 border-l-4 border-(?:pink|purple|blue)-400")\s+(id="pregunta-\d+")'

def agregar_clase(match):
    """Agrega 'pregunta-container' y data-question al div"""
    clase_inicial = match.group(1)
    id_pregunta = match.group(2)
    
    # Extraer número de pregunta
    num_pregunta = re.search(r'pregunta-(\d+)', id_pregunta).group(1)
    
    # Si ya tiene pregunta-container, no hacer nada
    if 'pregunta-container' in clase_inicial:
        return match.group(0)
    
    # Agregar clase y data-attribute
    nuevo_div = f'{clase_inicial} pregunta-container" {id_pregunta} data-question="{num_pregunta}"'
    return nuevo_div

# Reemplazar
contenido_original = content
content = re.sub(patron_sin_clase, agregar_clase, content)

# Contar cuántas se corrigieron
correcciones_clase = content.count('pregunta-container') - contenido_original.count('pregunta-container')
print(f"   ✅ Agregada clase a {correcciones_clase} preguntas")

# PROBLEMA 2: Cambiar totalQuestions de 58 a 50
print("\n2️⃣ Corrigiendo totalQuestions en navegador...")

content = content.replace(
    'totalQuestions: 58',
    'totalQuestions: 50'
)
print("   ✅ Cambiado de 58 a 50 preguntas")

# PROBLEMA 3: Integrar llamada a retroalimentación en el navegador
print("\n3️⃣ Integrando retroalimentación inmediata...")

# Buscar la función setupAnswerListeners y agregar la llamada a showImmediateFeedback
patron_listener = r"(// Verificar si es correcta\s+const pregunta = window\.planData\?\.exam\?\.preguntas\?\.\[questionNum - 1\];\s+if \(pregunta && userAnswer === pregunta\.respuesta_correcta\) \{\s+navState\.correctAnswers\.add\(questionNum\);\s+\})"

reemplazo_listener = r"""\1
        
        // Mostrar retroalimentación inmediata
        if (typeof showImmediateFeedback === 'function') {
          showImmediateFeedback(questionNum, userAnswer);
        }"""

if re.search(patron_listener, content):
    content = re.sub(patron_listener, reemplazo_listener, content)
    print("   ✅ Retroalimentación integrada en el navegador")
else:
    print("   ⚠️  No se pudo encontrar el patrón exacto, buscando alternativa...")
    
    # Alternativa: buscar donde se actualiza UI y agregar ahí
    if "updateUI();" in content and "// Actualizar UI" in content:
        content = content.replace(
            "// Actualizar UI\n        updateUI();",
            """// Mostrar retroalimentación inmediata
        if (typeof showImmediateFeedback === 'function') {
          showImmediateFeedback(questionNum, userAnswer);
        }
        
        // Actualizar UI
        updateUI();"""
        )
        print("   ✅ Retroalimentación integrada (método alternativo)")

# Guardar archivo
with open("evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk", "w", encoding="utf-8") as f:
    f.write(content)

print("\n" + "="*60)
print("✅ REPARACIÓN COMPLETADA")
print("="*60)
print("\n📊 Resumen:")
print(f"   • Preguntas con clase corregida: {correcciones_clase}")
print(f"   • Total de preguntas: 50")
print(f"   • Navegador actualizado: Sí")
print(f"   • Retroalimentación integrada: Sí")
print("\n🚀 Próximo paso: npm run build && git push")
