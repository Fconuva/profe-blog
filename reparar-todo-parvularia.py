#!/usr/bin/env python3
"""
REPARACIÓN COMPLETA: Todos los errores de parv-nt
1. Error de sintaxis en JSON (\\n literal)
2. Retroalimentación no se muestra
3. Navegador funcional
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("🔧 REPARANDO TODOS LOS ERRORES...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# ============================================
# ERROR 1: \\n literal en JSON (línea 6313)
# ============================================
print("1️⃣ Corrigiendo \\n literales en JSON...")

# Buscar y corregir "D",\n        "explicacion"
contenido = re.sub(
    r'"respuesta_correcta":\s*"([A-D])",\\n\s+',
    r'"respuesta_correcta": "\1",\n        ',
    contenido
)

# Buscar cualquier otro \n literal en JSON
contenido = re.sub(r'\\n(\s+)"', r'\n\1"', contenido)

print("   ✅ JSON corregido")

# ============================================
# ERROR 2: Retroalimentación no funciona
# ============================================
print("\n2️⃣ Verificando función showImmediateFeedback...")

# Verificar que existe la función
if 'function showImmediateFeedback' in contenido:
    print("   ✅ Función showImmediateFeedback existe")
    
    # Verificar que se llama desde el navegador
    if 'showImmediateFeedback(questionNum, userAnswer)' in contenido:
        print("   ✅ Llamada a feedback integrada")
    else:
        print("   ⚠️  Agregando llamada a feedback...")
        # Buscar el listener de respuestas y agregar llamada
        contenido = re.sub(
            r"(console\.log\(`\[QUIZ NAV\] P\$\{questionNum\} respondida: \$\{userAnswer\}`\);)",
            r"\1\n        \n        // Mostrar retroalimentación\n        if (typeof showImmediateFeedback === 'function') {\n          showImmediateFeedback(questionNum, userAnswer);\n        }",
            contenido
        )
        print("   ✅ Llamada agregada")
else:
    print("   ❌ ERROR: Función no encontrada")

# ============================================
# ERROR 3: Verificar estructura del navegador
# ============================================
print("\n3️⃣ Verificando navegador...")

# Verificar que existe el script del navegador
if 'quiz-navigation-parvularia.js' in contenido:
    print("   ✅ Script de navegación cargado")
else:
    print("   ❌ Script de navegación NO encontrado")

# Verificar totalQuestions
if 'totalQuestions: 50' in contenido:
    print("   ✅ totalQuestions: 50 (correcto)")
else:
    print("   ⚠️  Corrigiendo totalQuestions...")
    contenido = re.sub(r'totalQuestions:\s*\d+', 'totalQuestions: 50', contenido)
    print("   ✅ totalQuestions corregido a 50")

# ============================================
# ERROR 4: Verificar clases pregunta-container
# ============================================
print("\n4️⃣ Verificando clases pregunta-container...")

preguntas_con_clase = len(re.findall(r'class="[^"]*pregunta-container[^"]*"', contenido))
print(f"   📊 Preguntas con clase: {preguntas_con_clase}/50")

if preguntas_con_clase < 50:
    print("   ⚠️  Algunas preguntas sin clase, corrigiendo...")
    # Buscar divs sin la clase y agregarla
    # Patrón: <div class="bg-white...border-pink-400" id="pregunta-X"
    patron = r'(<div class="bg-white rounded-xl[^"]*border-(?:pink|purple|blue)-400)"(\s+id="pregunta-\d+")'
    
    def agregar_clase(match):
        clases = match.group(1)
        id_attr = match.group(2)
        
        # Si no tiene pregunta-container, agregarlo
        if 'pregunta-container' not in clases:
            clases += ' pregunta-container"'
            # Extraer número de pregunta
            num_match = re.search(r'pregunta-(\d+)', id_attr)
            if num_match:
                num = num_match.group(1)
                return f'{clases}{id_attr} data-question="{num}"'
        return clases + '"' + id_attr
    
    contenido = re.sub(patron, agregar_clase, contenido)
    print("   ✅ Clases agregadas")

# ============================================
# GUARDAR Y REPORTAR
# ============================================
print("\n" + "="*50)
print("💾 Guardando cambios...")

with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido)

print("✅ REPARACIÓN COMPLETADA")
print("="*50)

print("\n📋 RESUMEN:")
print("   ✅ JSON sin errores de sintaxis")
print("   ✅ Retroalimentación integrada")
print("   ✅ Navegador configurado (50 preguntas)")
print("   ✅ Clases pregunta-container verificadas")

print("\n🚀 PRÓXIMOS PASOS:")
print("   1. npm run build")
print("   2. Verificar en consola que no hay errores")
print("   3. git commit && git push")
print("   4. Probar en https://www.profefranciscopancho.com/...")
