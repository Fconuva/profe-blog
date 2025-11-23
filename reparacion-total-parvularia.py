import re

print("🔧 REPARACIÓN TOTAL - PRUEBA PARVULARIA")
print("=" * 70)

with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

# ========================================
# PASO 1: ESCAPAR COMILLAS SIMPLES EN JSON
# ========================================
print("\n1️⃣ ESCAPANDO COMILLAS SIMPLES EN ALTERNATIVAS...")

# Buscar todas las líneas con "texto": que contengan comillas simples
def escape_quotes_in_json(match):
    full_match = match.group(0)
    # Reemplazar ' con \' solo dentro del valor del texto
    text_value = match.group(1)
    escaped_value = text_value.replace("'", "\\'")
    return f'"texto": "{escaped_value}"'

# Patrón para encontrar "texto": "..."
content = re.sub(
    r'"texto":\s*"([^"]*\'[^"]*)"',
    escape_quotes_in_json,
    content
)

print("   ✅ Comillas simples escapadas en JSON")

# ========================================
# PASO 2: FORMATEAR TODOS LOS CONTEXTOS
# ========================================
print("\n2️⃣ FORMATEANDO TODOS LOS CONTEXTOS PEDAGÓGICOS...")

# Patrón para encontrar contextos sin formatear
pattern_contexto = r'<p class="text-sm text-blue-800 leading-relaxed">\s*\n\s*([^<]{100,}?)</p>'

contextos_encontrados = re.findall(pattern_contexto, content, re.DOTALL)
print(f"   📊 Encontrados {len(contextos_encontrados)} contextos potenciales")

# Formatear contextos manualmente (los primeros 10 para empezar)
formateos = [
    # PREGUNTA 1 - Benjamín y su osito
    (
        "La educadora Mariana trabaja en el jardín infantil 'Los Aromos' de Santiago con un grupo de 20 niños/as de NT1 (4 años). Durante la mañana, Benjamín (4 años) llega al aula y descubre que olvidó traer su osito de peluche favorito que siempre lo acompaña. Inmediatamente comienza a llorar desconsoladamente, diciendo 'no puedo estar sin mi osito, lo necesito'. Mariana observa que esta situación es una oportunidad pedagógica para trabajar el Objetivo de Aprendizaje 1 del núcleo Identidad y Autonomía de las BCEP 2018: 'Comunicar a los demás, emociones y sentimientos tales como: amor, miedo, alegría, ira, que le provocan diversas narraciones o situaciones observadas en forma directa o a través de TICs'. También considera el OA 4: 'Expresar sus emociones y sentimientos autorregulándose en función de las necesidades propias, de los demás y las normas de funcionamiento grupal'. La educadora sabe que cómo responda a esta situación marcará el aprendizaje socioemocional de Benjamín y del grupo.",
        """🏫 <strong>Contexto:</strong><br><br>
La educadora <strong>Mariana</strong> trabaja en el jardín infantil 'Los Aromos' de Santiago con 20 niños/as de NT1 (4 años).<br><br>

📅 <strong>Situación:</strong><br><br>
<strong>Benjamín</strong> (4 años) llega y descubre que olvidó su osito de peluche favorito 🧸. Comienza a llorar 😢 desconsoladamente: "no puedo estar sin mi osito, lo necesito".<br><br>

📚 <strong>Fundamento Pedagógico:</strong><br><br>
<div style="background: linear-gradient(135deg, #EBF4FF 0%, #C3DAFE 100%); padding: 16px; border-radius: 12px; border-left: 4px solid #3B82F6; margin: 12px 0;">
<strong>💡 Objetivos de Aprendizaje (BCEP 2018):</strong><br>
<strong>OA 1 - Identidad y Autonomía:</strong> <em>"Comunicar a los demás, emociones y sentimientos tales como: amor, miedo, alegría, ira"</em><br>
<strong>OA 4 - Identidad y Autonomía:</strong> <em>"Expresar sus emociones y sentimientos autorregulándose en función de las necesidades propias, de los demás y las normas de funcionamiento grupal"</em>
</div>"""
    ),
    
    # PREGUNTA 3 - Sofía y el dibujo
    (
        "En el jardín infantil de Concepción, la educadora Patricia trabaja con un grupo de NT2. Es miércoles por la tarde y los niños están realizando una actividad de dibujo libre sobre 'mi familia'. Sofía, una niña de 5 años generalmente activa y participativa, mira su hoja en blanco y dice en voz baja: 'yo no puedo hacer ese dibujo, no me va a quedar bien'. Patricia nota que en las últimas semanas Sofía ha mostrado más autocrítica en sus producciones artísticas, comparándose frecuentemente con sus compañeros. La educadora reflexiona sobre el Objetivo de Aprendizaje 1 de Identidad y Autonomía de las BCEP 2018: 'Comunicar a los demás, emociones y sentimientos tales como: amor, miedo, alegría, ira, que le provocan diversas narraciones o situaciones observadas en forma directa o a través de TICs', reconociendo que Sofía está expresando inseguridad. También considera el OA 3: 'Reconocer emociones y sentimientos en otras personas, observadas en forma directa o a través de TICs', ya que necesita que Sofía reconozca que todos enfrentan desafíos. Patricia sabe que su respuesta marcará cómo Sofía enfrenta futuros desafíos creativos y académicos.",
        """🏫 <strong>Contexto:</strong><br><br>
La educadora <strong>Patricia</strong> trabaja en un jardín infantil de Concepción con niños/as de NT2.<br><br>

📅 <strong>Situación:</strong><br><br>
Es miércoles por la tarde, actividad de dibujo libre sobre 'mi familia' 🎨. <strong>Sofía</strong> (5 años), generalmente activa, mira su hoja en blanco y dice: "yo no puedo hacer ese dibujo, no me va a quedar bien" 😔<br><br>

📚 <strong>Fundamento Pedagógico:</strong><br><br>
<div style="background: linear-gradient(135deg, #EBF4FF 0%, #C3DAFE 100%); padding: 16px; border-radius: 12px; border-left: 4px solid #3B82F6; margin: 12px 0;">
<strong>💡 Objetivos de Aprendizaje (BCEP 2018):</strong><br>
<strong>OA 1 - Identidad y Autonomía:</strong> <em>"Comunicar a los demás, emociones y sentimientos"</em><br>
<strong>OA 3 - Identidad y Autonomía:</strong> <em>"Reconocer emociones y sentimientos en otras personas"</em>
</div>

Sofía muestra <strong>autocrítica</strong> creciente y se compara con sus compañeros. La respuesta de la educadora marcará cómo enfrenta futuros desafíos."""
    ),
]

for old, new in formateos:
    if old in content:
        content = content.replace(old, new)
        print("   ✅ Contexto formateado")

# Guardar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n💾 ARCHIVO GUARDADO")
print("\n" + "=" * 70)
print("📋 REPARACIONES COMPLETADAS:")
print("   ✅ Comillas simples escapadas (evita error de sintaxis)")
print("   ✅ Contextos formateados con HTML profesional")
print("\n🚀 Ahora ejecuta: npm run build && git add -A && git commit && git push")
