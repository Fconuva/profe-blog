import json

print("="*80)
print("VALIDACIÓN POST-AUDITORÍA - Prueba Matemática Media (67-cm-m)")
print("="*80)

file_path = r'c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\67-cm-m\plan.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

errores = []
warnings = []
ok_count = 0

# Validación 1: Pregunta 3 - Raíces
print("\n[1/11] Pregunta 3 (Raíces)...")
p3 = next((p for p in data['exam']['preguntas'] if p['id'] == '67-M-03'), None)
if p3 and p3['respuesta_correcta'] == 'C':
    print("  ✅ Respuesta correcta es C (5√3)")
    ok_count += 1
else:
    errores.append(f"Pregunta 3: respuesta correcta debería ser C, encontrado {p3['respuesta_correcta'] if p3 else 'NO ENCONTRADA'}")

# Validación 2: Pregunta 4 - Sistemas
print("\n[2/11] Pregunta 4 (Sistemas de ecuaciones)...")
p4 = next((p for p in data['exam']['preguntas'] if p['id'] == '67-M-04'), None)
if p4 and p4['respuesta_correcta'] == 'C':
    print("  ✅ Respuesta correcta es C (x=4)")
    ok_count += 1
else:
    errores.append(f"Pregunta 4: respuesta correcta debería ser C, encontrado {p4['respuesta_correcta'] if p4 else 'NO ENCONTRADA'}")

# Validación 3: Pregunta 5 - Factorización
print("\n[3/11] Pregunta 5 (Factorización)...")
p5 = next((p for p in data['exam']['preguntas'] if p['id'] == '67-M-05'), None)
if p5 and p5['respuesta_correcta'] == 'C':
    print("  ✅ Respuesta correcta es C ((x-3)(x+3))")
    ok_count += 1
else:
    errores.append(f"Pregunta 5: respuesta correcta debería ser C, encontrado {p5['respuesta_correcta'] if p5 else 'NO ENCONTRADA'}")

# Validación 4: Pregunta 6 - Inecuaciones
print("\n[4/11] Pregunta 6 (Inecuaciones)...")
p6 = next((p for p in data['exam']['preguntas'] if p['id'] == '67-M-06'), None)
if p6 and p6['respuesta_correcta'] == 'B':
    print("  ✅ Respuesta correcta es B (x>4)")
    ok_count += 1
else:
    errores.append(f"Pregunta 6: respuesta correcta debería ser B, encontrado {p6['respuesta_correcta'] if p6 else 'NO ENCONTRADA'}")

# Validación 5: Pregunta 7 - Discriminante
print("\n[5/11] Pregunta 7 (Discriminante)...")
p7 = next((p for p in data['exam']['preguntas'] if p['id'] == '67-M-07'), None)
if p7 and p7['respuesta_correcta'] == 'A':
    print("  ✅ Respuesta correcta es A (Ninguna solución real)")
    ok_count += 1
else:
    errores.append(f"Pregunta 7: respuesta correcta debería ser A, encontrado {p7['respuesta_correcta'] if p7 else 'NO ENCONTRADA'}")

# Validación 6: Pregunta 8 - Fracciones algebraicas
print("\n[6/11] Pregunta 8 (Fracciones algebraicas)...")
p8 = next((p for p in data['exam']['preguntas'] if p['id'] == '67-M-08'), None)
if p8 and p8['respuesta_correcta'] == 'B':
    print("  ✅ Respuesta correcta es B (x+2)")
    ok_count += 1
else:
    errores.append(f"Pregunta 8: respuesta correcta debería ser B, encontrado {p8['respuesta_correcta'] if p8 else 'NO ENCONTRADA'}")

# Validación 7: Pregunta 13 - Enunciado Thales
print("\n[7/11] Pregunta 13 (Teorema de Thales)...")
p13 = next((p for p in data['exam']['preguntas'] if p['id'] == '67-M-13'), None)
if p13 and 'Tres rectas paralelas' in p13['enunciado']:
    print("  ✅ Enunciado dice 'Tres rectas paralelas'")
    ok_count += 1
else:
    errores.append(f"Pregunta 13: enunciado debería mencionar 'Tres rectas paralelas'")

# Validación 8: No duplicación de preguntas 51-73
print("\n[8/11] Verificando ausencia de duplicados...")
ids_conteo = {}
for p in data['exam']['preguntas']:
    pid = p['id']
    ids_conteo[pid] = ids_conteo.get(pid, 0) + 1

duplicados_encontrados = [(pid, count) for pid, count in ids_conteo.items() if count > 1]
if len(duplicados_encontrados) == 0:
    print("  ✅ No hay preguntas duplicadas")
    ok_count += 1
else:
    for pid, count in duplicados_encontrados:
        errores.append(f"Pregunta {pid} aparece {count} veces (duplicada)")

# Validación 9: Casos de estudio numerados 74-89
print("\n[9/11] Verificando numeración casos de estudio...")
casos = [p for p in data['exam']['preguntas'] if p.get('tipo') == 'caso_estudio']
numeros_casos = [p['numero'] for p in casos]
esperado = list(range(74, 90))  # 74-89
if numeros_casos == esperado:
    print(f"  ✅ Casos de estudio numerados 74-89 ({len(casos)} casos)")
    ok_count += 1
else:
    errores.append(f"Numeración casos incorrecta. Esperado: 74-89, Encontrado: {min(numeros_casos)}-{max(numeros_casos)}")

# Validación 10: Metadata total_preguntas = 89
print("\n[10/11] Verificando metadata...")
if data['metadata']['total_preguntas'] == 89:
    print("  ✅ Total preguntas en metadata: 89")
    ok_count += 1
else:
    errores.append(f"Metadata total_preguntas debería ser 89, encontrado {data['metadata']['total_preguntas']}")

# Validación 11: Versión 5
print("\n[11/11] Verificando versión...")
if data['metadata']['version'] == 5:
    print("  ✅ Versión actualizada a 5")
    ok_count += 1
else:
    warnings.append(f"Versión en metadata: {data['metadata']['version']} (esperado: 5)")

# Resumen
print("\n" + "="*80)
print("RESUMEN DE VALIDACIÓN")
print("="*80)
print(f"✅ Validaciones exitosas: {ok_count}/11")
print(f"❌ Errores críticos: {len(errores)}")
print(f"⚠️  Advertencias: {len(warnings)}")

if errores:
    print("\n❌ ERRORES ENCONTRADOS:")
    for i, error in enumerate(errores, 1):
        print(f"  {i}. {error}")

if warnings:
    print("\n⚠️  ADVERTENCIAS:")
    for i, warning in enumerate(warnings, 1):
        print(f"  {i}. {warning}")

if len(errores) == 0 and len(warnings) == 0:
    print("\n🎉 ¡AUDITORÍA EXITOSA! Todas las correcciones se aplicaron correctamente.")
    print("\nESTADÍSTICAS FINALES:")
    print(f"  • Total preguntas: {len(data['exam']['preguntas'])}")
    print(f"  • Preguntas base (1-73): {len([p for p in data['exam']['preguntas'] if not p.get('tipo')])}") 
    print(f"  • Casos de estudio (74-89): {len(casos)}")
    print(f"  • Versión: {data['metadata']['version']}")
    print(f"  • Última actualización: {data['metadata']['ultima_actualizacion']}")
else:
    print("\n⚠️  REVISAR: Se encontraron problemas que requieren atención.")

print("\n" + "="*80)
