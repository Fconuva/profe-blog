import re

# Leer el archivo
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

# CONTEXTOS A FORMATEAR (todos los que aún no están formateados)

# PREGUNTA 2 - Autonomía colación
old_2 = """En el jardín infantil 'Rayitos de Sol' de Valparaíso, la educadora Carolina ha implementado una nueva organización para el momento de la colación. Son las 10:30 de la mañana y los 24 niños y niñas de NT1 se preparan para comer. Carolina observa a Valentina, una niña de 4 años que suele esperar pasivamente a que le sirvan. Inspirada en el Objetivo de Aprendizaje 7 de Identidad y Autonomía de las BCEP 2018: 'Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos', Carolina ha preparado el ambiente con jarras pequeñas de agua, fuentes bajas con frutas picadas, y platos individuales al alcance de los niños. También considera el OA 9: 'Cuidar su bienestar personal, llevando a cabo sus prácticas de higiene, alimentación y vestuario, con independencia y progresiva responsabilidad'. La educadora debe decidir cómo estructurar este momento para promover verdadera autonomía sin generar caos ni frustración. Ha leído sobre el enfoque Montessori del 'ambiente preparado' y quiere aplicarlo coherentemente con las Bases Curriculares chilenas."""

new_2 = """🏫 <strong>Contexto:</strong><br><br>
La educadora <strong>Carolina</strong> trabaja en el jardín infantil 'Rayitos de Sol' de Valparaíso con 24 niños/as de NT1.<br><br>

📅 <strong>Situación:</strong><br><br>
Son las 10:30 AM, momento de la colación 🍎. Carolina observa a <strong>Valentina</strong> (4 años) quien espera pasivamente que le sirvan. La educadora preparó el ambiente con jarras pequeñas, frutas al alcance y platos individuales, inspirada en el enfoque Montessori.<br><br>

📚 <strong>Fundamento Pedagógico:</strong><br><br>
<div style="background: linear-gradient(135deg, #EBF4FF 0%, #C3DAFE 100%); padding: 16px; border-radius: 12px; border-left: 4px solid #3B82F6; margin: 12px 0;">
<strong>💡 Objetivos de Aprendizaje (BCEP 2018):</strong><br>
<strong>OA 7 - Identidad y Autonomía:</strong> <em>"Comunicar sus preferencias, opiniones, ideas, en diversas situaciones cotidianas y juegos"</em><br>
<strong>OA 9 - Identidad y Autonomía:</strong> <em>"Cuidar su bienestar personal, llevando a cabo sus prácticas de higiene, alimentación y vestuario, con independencia y progresiva responsabilidad"</em>
</div>"""

# PREGUNTA 4 - Resolución de conflictos
old_4 = """En el jardín infantil 'Semillitas' de Concepción, la educadora Daniela trabaja con un grupo de 22 niños y niñas de NT2 (5 años). Durante el recreo, observa una situación recurrente: tres niños (Matías, Sofía y Diego) quieren usar simultáneamente el único triciclo disponible en el patio. Matías toma el triciclo con fuerza diciendo '¡Es mío!', Sofía llora y empuja a Diego, quien grita '¡No es justo!'. Daniela conoce el Objetivo de Aprendizaje 6 de Convivencia y Ciudadanía: 'Respetar normas y acuerdos creados colaborativamente con pares y adultos, para el bienestar del grupo'. También sabe que el OA 5 del mismo núcleo enfatiza 'Manifestar disposición para practicar acuerdos de convivencia básica que regulan situaciones cotidianas y juegos'. La educadora debe decidir cómo mediar este conflicto, considerando que estos niños están en una etapa de desarrollo socioemocional donde el egocentrismo aún está presente, pero también tienen capacidad creciente de empatía y negociación. Ha estudiado técnicas de resolución pacífica de conflictos y estrategias de 'andamiaje' del adulto."""

new_4 = """🏫 <strong>Contexto:</strong><br><br>
La educadora <strong>Daniela</strong> trabaja en el jardín infantil 'Semillitas' de Concepción con 22 niños/as de NT2 (5 años).<br><br>

📅 <strong>Situación:</strong><br><br>
Durante el recreo, tres niños quieren el mismo triciclo 🚲:<br>
• <strong>Matías</strong> lo toma con fuerza: "¡Es mío!"<br>
• <strong>Sofía</strong> llora y empuja a Diego<br>
• <strong>Diego</strong> grita "¡No es justo!"<br><br>

📚 <strong>Fundamento Pedagógico:</strong><br><br>
<div style="background: linear-gradient(135deg, #EBF4FF 0%, #C3DAFE 100%); padding: 16px; border-radius: 12px; border-left: 4px solid #3B82F6; margin: 12px 0;">
<strong>💡 Objetivos de Aprendizaje (BCEP 2018):</strong><br>
<strong>OA 6 - Convivencia y Ciudadanía:</strong> <em>"Respetar normas y acuerdos creados colaborativamente con pares y adultos, para el bienestar del grupo"</em><br>
<strong>OA 5 - Convivencia y Ciudadanía:</strong> <em>"Manifestar disposición para practicar acuerdos de convivencia básica que regulan situaciones cotidianas y juegos"</em>
</div>

<strong>Consideración desarrollista:</strong> Niños/as de 5 años están en transición del egocentrismo hacia la empatía y negociación. El adulto debe proporcionar 'andamiaje' pedagógico."""

# Aplicar los reemplazos
content = content.replace(old_2, new_2)
content = content.replace(old_4, new_4)

print("🎨 FORMATEANDO CONTEXTOS PEDAGÓGICOS...")
print(f"✅ Pregunta 2 formateada (Autonomía - Colación)")
print(f"✅ Pregunta 4 formateada (Resolución conflictos)")

# Guardar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n💾 Archivo guardado con contextos formateados")
print("\n📋 FORMATO APLICADO:")
print("   🏫 Contexto (dónde y quién)")
print("   📅 Situación (qué está pasando)")
print("   📚 Fundamento Pedagógico (OAs y teoría)")
