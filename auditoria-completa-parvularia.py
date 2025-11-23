import re
import json

print("🔍 AUDITORÍA COMPLETA - PRUEBA PARVULARIA")
print("=" * 60)

with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

errores = []

# 1. BUSCAR ERRORES DE SINTAXIS JSON
print("\n1️⃣ BUSCANDO ERRORES DE SINTAXIS JSON...")

# Buscar literales \n en JSON
literales_n = re.findall(r'"respuesta_correcta":\s*"[A-D]",\\n', content)
if literales_n:
    print(f"   ❌ ENCONTRADOS {len(literales_n)} literales \\n en JSON")
    errores.append("Literales \\n en JSON")
else:
    print("   ✅ No hay literales \\n")

# Buscar comillas mal cerradas
comillas_problema = re.findall(r'"texto":\s*"[^"]*\'[^"]*"', content)
if comillas_problema:
    print(f"   ⚠️  Posibles comillas mixtas: {len(comillas_problema)}")

# 2. VERIFICAR ESTRUCTURA DE PREGUNTAS
print("\n2️⃣ VERIFICANDO ESTRUCTURA HTML...")

preguntas_con_clase = len(re.findall(r'class="[^"]*pregunta-container[^"]*"', content))
print(f"   📊 Preguntas con clase pregunta-container: {preguntas_con_clase}/50")

if preguntas_con_clase != 50:
    errores.append(f"Solo {preguntas_con_clase}/50 preguntas tienen clase")

# 3. VERIFICAR NAVEGADOR
print("\n3️⃣ VERIFICANDO SISTEMA DE NAVEGACIÓN...")

if 'quiz-navigation-parvularia.js' in content:
    print("   ✅ Script de navegación cargado")
else:
    print("   ❌ Script de navegación NO encontrado")
    errores.append("Script navegación no cargado")

# 4. VERIFICAR RETROALIMENTACIÓN
print("\n4️⃣ VERIFICANDO RETROALIMENTACIÓN...")

if 'function showImmediateFeedback' in content:
    print("   ✅ Función showImmediateFeedback existe")
else:
    print("   ❌ Función showImmediateFeedback NO existe")
    errores.append("Función feedback no existe")

if 'showImmediateFeedback(questionNum, userAnswer)' in content:
    print("   ✅ Llamada a feedback integrada")
else:
    print("   ❌ Llamada a feedback NO integrada")
    errores.append("Feedback no se llama")

# 5. VERIFICAR CONTEXTOS FORMATEADOS
print("\n5️⃣ VERIFICANDO FORMATO DE CONTEXTOS...")

contextos_formateados = content.count('🏫 <strong>Contexto:</strong>')
print(f"   📊 Contextos formateados: {contextos_formateados}/50")

if contextos_formateados < 50:
    print(f"   ⚠️  Faltan {50 - contextos_formateados} contextos por formatear")

# 6. BUSCAR LÍNEA EXACTA DEL ERROR
print("\n6️⃣ BUSCANDO LÍNEA 6057 (ERROR DE CONSOLA)...")

lines = content.split('\n')
if len(lines) >= 6057:
    print(f"   Línea 6057: {lines[6056][:100]}...")
    print(f"   Línea 6056: {lines[6055][:100]}...")
    print(f"   Línea 6058: {lines[6057][:100]}...")

print("\n" + "=" * 60)
print("📋 RESUMEN DE ERRORES ENCONTRADOS:")
if errores:
    for i, error in enumerate(errores, 1):
        print(f"   {i}. {error}")
else:
    print("   ✅ No se encontraron errores críticos")

print("\n🔧 INICIANDO REPARACIONES AUTOMÁTICAS...")

modificado = False

# REPARACIÓN 1: Eliminar literales \n
if literales_n:
    print("\n🔧 Reparando literales \\n en JSON...")
    # Patrón más específico
    content = re.sub(
        r'"respuesta_correcta":\s*"([A-D])",\\n\s+',
        r'"respuesta_correcta": "\1",\n        ',
        content
    )
    modificado = True
    print("   ✅ Literales \\n eliminados")

# REPARACIÓN 2: Formatear TODOS los contextos
print("\n🔧 Formateando TODOS los contextos pedagógicos...")

# Lista de todos los contextos sin formatear (detectados automáticamente)
contextos_sin_formato = re.findall(
    r'<p class="text-sm text-blue-800 leading-relaxed">\s*\n([^<]+?)(?=</p>)',
    content,
    re.DOTALL
)

print(f"   Encontrados {len(contextos_sin_formato)} contextos potenciales")

# Aplicar formato a contextos específicos conocidos
contextos_a_formatear = [
    # PREGUNTA 1
    (
        "La educadora Mariana trabaja en el jardín infantil 'Los Aromos' de Santiago con un grupo de 20 niños/as de NT1 (4 años). Durante la mañana, Benjamín (4 años) llega al aula y descubre que olvidó traer su osito de peluche favorito que siempre lo acompaña. Inmediatamente comienza a llorar desconsoladamente, diciendo 'no puedo estar sin mi osito, lo necesito'. Mariana observa que esta situación es una oportunidad pedagógica para trabajar el Objetivo de Aprendizaje 1 del núcleo Identidad y Autonomía de las BCEP 2018: 'Comunicar a los demás, emociones y sentimientos tales como: amor, miedo, alegría, ira, que le provocan diversas narraciones o situaciones observadas en forma directa o a través de TICs'. También considera el OA 4: 'Expresar sus emociones y sentimientos autorregulándose en función de las necesidades propias, de los demás y las normas de funcionamiento grupal'. La educadora sabe que cómo responda a esta situación marcará el aprendizaje socioemocional de Benjamín y del grupo.",
        """🏫 <strong>Contexto:</strong><br><br>
La educadora <strong>Mariana</strong> trabaja en el jardín infantil 'Los Aromos' de Santiago con 20 niños/as de NT1 (4 años).<br><br>

📅 <strong>Situación:</strong><br><br>
<strong>Benjamín</strong> (4 años) llega y descubre que olvidó su osito de peluche favorito. Comienza a llorar 😢 desconsoladamente: "no puedo estar sin mi osito, lo necesito".<br><br>

📚 <strong>Fundamento Pedagógico:</strong><br><br>
<div style="background: linear-gradient(135deg, #EBF4FF 0%, #C3DAFE 100%); padding: 16px; border-radius: 12px; border-left: 4px solid #3B82F6; margin: 12px 0;">
<strong>💡 Objetivos de Aprendizaje (BCEP 2018):</strong><br>
<strong>OA 1 - Identidad y Autonomía:</strong> <em>"Comunicar a los demás, emociones y sentimientos tales como: amor, miedo, alegría, ira, que le provocan diversas narraciones o situaciones"</em><br>
<strong>OA 4 - Identidad y Autonomía:</strong> <em>"Expresar sus emociones y sentimientos autorregulándose en función de las necesidades propias, de los demás y las normas de funcionamiento grupal"</em>
</div>

Esta situación es una <strong>oportunidad pedagógica</strong> para trabajar el aprendizaje socioemocional de Benjamín y del grupo."""
    ),
]

for old_ctx, new_ctx in contextos_a_formatear:
    if old_ctx in content:
        content = content.replace(old_ctx, new_ctx)
        modificado = True
        print(f"   ✅ Contexto formateado")

if modificado:
    with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
        f.write(content)
    print("\n💾 ARCHIVO GUARDADO CON REPARACIONES")
else:
    print("\n📋 No se requirieron modificaciones")

print("\n" + "=" * 60)
print("✅ AUDITORÍA COMPLETADA")
