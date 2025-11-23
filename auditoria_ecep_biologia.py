"""
AUDITORÍA COMPLETA ECEP BIOLOGÍA 2025
Verifica todos los aspectos de calidad de la prueba
"""
import json
import os

# Cargar plan
with open(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json", 'r', encoding='utf-8') as f:
    plan = json.load(f)

print("="*70)
print(" "*20 + "AUDITORÍA COMPLETA ECEP BIOLOGÍA 2025")
print("="*70)

# ===== 1. ESTRUCTURA BÁSICA =====
print("\n📋 1. ESTRUCTURA BÁSICA")
print("-"*70)
total_preguntas = len(plan['questions'])
print(f"✅ Total preguntas: {total_preguntas}/52")

# Verificar IDs únicos y secuenciales
ids = [q['id'] for q in plan['questions']]
ids_esperados = list(range(1, 53))
if ids == ids_esperados:
    print("✅ IDs secuenciales 1-52 sin duplicados")
else:
    faltantes = set(ids_esperados) - set(ids)
    duplicados = [id for id in ids if ids.count(id) > 1]
    if faltantes:
        print(f"❌ IDs faltantes: {faltantes}")
    if duplicados:
        print(f"❌ IDs duplicados: {set(duplicados)}")

# ===== 2. DISTRIBUCIÓN POR DOMINIO =====
print("\n📚 2. DISTRIBUCIÓN POR DOMINIO")
print("-"*70)
contador_dominios = {}
for pregunta in plan['questions']:
    dom = pregunta['domain']
    contador_dominios[dom] = contador_dominios.get(dom, 0) + 1

for dominio_data in plan['domains']:
    dom_id = dominio_data['id']
    esperado = dominio_data['questions']
    real = contador_dominios.get(dom_id, 0)
    status = "✅" if real == esperado else "❌"
    print(f"{status} {dominio_data['name']}: {real}/{esperado} preguntas")

# ===== 3. DISTRIBUCIÓN RESPUESTAS CORRECTAS =====
print("\n📊 3. DISTRIBUCIÓN RESPUESTAS CORRECTAS")
print("-"*70)
contador_correctas = {"a": 0, "b": 0, "c": 0, "d": 0}
for pregunta in plan['questions']:
    for opcion in pregunta['options']:
        if opcion['isCorrect']:
            contador_correctas[opcion['id']] += 1
            break

objetivo = 13
for letra in sorted(contador_correctas.keys()):
    count = contador_correctas[letra]
    status = "✅" if count == objetivo else "⚠️"
    print(f"{status} Respuesta correcta '{letra.upper()}': {count}/{objetivo} ({count/total_preguntas*100:.1f}%)")

# Verificar que cada pregunta tenga exactamente 1 correcta
problemas_correctas = []
for pregunta in plan['questions']:
    correctas_en_pregunta = sum(1 for o in pregunta['options'] if o['isCorrect'])
    if correctas_en_pregunta != 1:
        problemas_correctas.append((pregunta['id'], correctas_en_pregunta))

if problemas_correctas:
    print(f"\n❌ Preguntas con 0 o >1 respuestas correctas:")
    for id_q, count in problemas_correctas:
        print(f"   Q{id_q}: {count} correctas")
else:
    print("✅ Todas las preguntas tienen exactamente 1 respuesta correcta")

# ===== 4. OPCIONES (4 por pregunta) =====
print("\n🔘 4. OPCIONES POR PREGUNTA")
print("-"*70)
problemas_opciones = []
for pregunta in plan['questions']:
    if len(pregunta['options']) != 4:
        problemas_opciones.append(pregunta['id'])

if problemas_opciones:
    print(f"❌ Preguntas con ≠4 opciones: {problemas_opciones}")
else:
    print("✅ Todas las preguntas tienen 4 opciones (a, b, c, d)")

# ===== 5. RETROALIMENTACIÓN =====
print("\n💬 5. RETROALIMENTACIÓN")
print("-"*70)
sin_feedback = []
feedback_corto = []  # <20 caracteres
for pregunta in plan['questions']:
    for opcion in pregunta['options']:
        if 'feedback' not in opcion or not opcion['feedback']:
            sin_feedback.append((pregunta['id'], opcion['id']))
        elif len(opcion['feedback']) < 20:
            feedback_corto.append((pregunta['id'], opcion['id'], len(opcion['feedback'])))

if sin_feedback:
    print(f"❌ Opciones SIN feedback: {len(sin_feedback)}")
    for id_q, id_op in sin_feedback[:5]:
        print(f"   Q{id_q} opción {id_op}")
else:
    print("✅ Todas las opciones tienen feedback")

if feedback_corto:
    print(f"⚠️ Feedbacks muy cortos (<20 chars): {len(feedback_corto)}")
    # Considerar normal si son placeholder
else:
    print("✅ Todos los feedbacks tienen extensión adecuada")

# ===== 6. IMÁGENES =====
print("\n🖼️ 6. IMÁGENES")
print("-"*70)
preguntas_con_imagen = [q for q in plan['questions'] if q.get('image')]
preguntas_sin_imagen = [q for q in plan['questions'] if not q.get('image')]
print(f"📷 Con imagen: {len(preguntas_con_imagen)} ({len(preguntas_con_imagen)/total_preguntas*100:.1f}%)")
print(f"📄 Sin imagen: {len(preguntas_sin_imagen)} ({len(preguntas_sin_imagen)/total_preguntas*100:.1f}%)")

# Verificar rutas de imágenes
rutas_invalidas = []
base_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog"
for pregunta in preguntas_con_imagen:
    if pregunta['image']:
        # Convertir ruta relativa a absoluta
        ruta_img = pregunta['image'].lstrip('/')
        ruta_absoluta = os.path.join(base_path, ruta_img.replace('/', '\\'))
        if not os.path.exists(ruta_absoluta):
            rutas_invalidas.append((pregunta['id'], pregunta['image']))

if rutas_invalidas:
    print(f"\n⚠️ Rutas de imagen no encontradas: {len(rutas_invalidas)}")
    for id_q, ruta in rutas_invalidas[:5]:
        print(f"   Q{id_q}: {ruta}")
    print("   (Nota: Algunas imágenes pueden crearse después)")
else:
    print("✅ Todas las rutas de imagen son válidas")

# ===== 7. METADATOS PEDAGÓGICOS =====
print("\n🎓 7. METADATOS PEDAGÓGICOS")
print("-"*70)
sin_pedagogia = []
pedagogia_incompleta = []
for pregunta in plan['questions']:
    if 'pedagogy' not in pregunta:
        sin_pedagogia.append(pregunta['id'])
    else:
        ped = pregunta['pedagogy']
        campos_requeridos = ['objective', 'level']
        faltantes = [c for c in campos_requeridos if c not in ped or not ped[c]]
        if faltantes:
            pedagogia_incompleta.append((pregunta['id'], faltantes))

if sin_pedagogia:
    print(f"❌ Sin metadatos pedagógicos: {sin_pedagogia}")
else:
    print("✅ Todas las preguntas tienen metadatos pedagógicos")

if pedagogia_incompleta:
    print(f"⚠️ Metadatos incompletos: {len(pedagogia_incompleta)}")
    for id_q, faltantes in pedagogia_incompleta[:5]:
        print(f"   Q{id_q}: falta {faltantes}")
else:
    print("✅ Todos los metadatos pedagógicos completos (objective, level)")

# ===== 8. DIFICULTAD =====
print("\n⚡ 8. DISTRIBUCIÓN DIFICULTAD")
print("-"*70)
contador_dificultad = {}
for pregunta in plan['questions']:
    dif = pregunta.get('difficulty', 'unknown')
    contador_dificultad[dif] = contador_dificultad.get(dif, 0) + 1

for nivel in ['easy', 'medium', 'hard', 'unknown']:
    count = contador_dificultad.get(nivel, 0)
    if count > 0:
        print(f"  {nivel.capitalize()}: {count} preguntas ({count/total_preguntas*100:.1f}%)")

# ===== 9. CONTENIDO STEMS =====
print("\n📝 9. CONTENIDO STEMS")
print("-"*70)
stems_cortos = []  # <50 caracteres
stems_largos = []  # >1000 caracteres
for pregunta in plan['questions']:
    stem = pregunta.get('stem', '')
    if len(stem) < 50:
        stems_cortos.append((pregunta['id'], len(stem)))
    elif len(stem) > 1000:
        stems_largos.append((pregunta['id'], len(stem)))

if stems_cortos:
    print(f"⚠️ Stems muy cortos (<50 chars): {len(stems_cortos)}")
    for id_q, longitud in stems_cortos[:3]:
        print(f"   Q{id_q}: {longitud} caracteres")
else:
    print("✅ Todos los stems tienen longitud adecuada")

# Longitud promedio
longitudes_stems = [len(q.get('stem', '')) for q in plan['questions']]
promedio_stem = sum(longitudes_stems) / len(longitudes_stems) if longitudes_stems else 0
print(f"📏 Longitud promedio stems: {promedio_stem:.0f} caracteres")

# ===== 10. SINTAXIS JSON =====
print("\n🔧 10. SINTAXIS JSON")
print("-"*70)
print("✅ JSON válido (se cargó correctamente)")

# ===== RESUMEN FINAL =====
print("\n" + "="*70)
print(" "*25 + "RESUMEN DE AUDITORÍA")
print("="*70)

total_checks = 10
checks_perfectos = 0
checks_con_warnings = 0
checks_con_errores = 0

# Evaluar cada sección
evaluaciones = [
    ("Estructura básica", total_preguntas == 52 and ids == ids_esperados),
    ("Distribución dominios", all(contador_dominios.get(d['id'], 0) == d['questions'] for d in plan['domains'])),
    ("Distribución respuestas", all(contador_correctas[letra] == 13 for letra in ['a','b','c','d'])),
    ("Opciones por pregunta", len(problemas_opciones) == 0),
    ("Retroalimentación", len(sin_feedback) == 0),
    ("Rutas imágenes", len(rutas_invalidas) == 0),
    ("Metadatos pedagógicos", len(sin_pedagogia) == 0),
    ("Distribución dificultad", 'unknown' not in contador_dificultad),
    ("Contenido stems", len(stems_cortos) == 0),
    ("Sintaxis JSON", True)
]

for nombre, es_perfecto in evaluaciones:
    if es_perfecto:
        checks_perfectos += 1
        print(f"✅ {nombre}")
    else:
        checks_con_warnings += 1
        print(f"⚠️ {nombre} (ver detalles arriba)")

print("\n" + "="*70)
print(f"🎯 RESULTADO: {checks_perfectos}/{total_checks} checks perfectos")
if checks_perfectos == total_checks:
    print("🌟 AUDITORÍA APROBADA - Prueba lista para implementación")
elif checks_perfectos >= 8:
    print("✅ AUDITORÍA SATISFACTORIA - Warnings menores a resolver")
else:
    print("⚠️ AUDITORÍA CON OBSERVACIONES - Revisar errores críticos")
print("="*70)
