import json
import re

print("AUDITORIA DE OBJETIVIDAD - LENGUAJE 63-sc-l")
print("="*80)

with open('evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

problemas = []

for i, p in enumerate(data['exam']['preguntas'], 1):
    pid = p['id']
    correcta = p['respuesta_correcta']
    enunciado = p['enunciado']
    explicacion = p.get('explicacion', '')
    
    # Buscar si la explicación menciona otra alternativa como correcta
    patron_mencion = r'\b([ABCD])\)'
    menciones = re.findall(patron_mencion, explicacion)
    
    # Verificar contradicciones obvias
    palabras_clave_por_alternativa = {}
    for alt in p['alternativas']:
        opt = alt['opcion']
        texto = alt['texto'].lower()
        palabras_clave_por_alternativa[opt] = texto
    
    # REGLA 1: Si la explicación menciona "la correcta es X" pero respuesta_correcta es Y
    if explicacion:
        if 'correcta es' in explicacion.lower() or 'respuesta correcta' in explicacion.lower():
            for letra in ['A', 'B', 'C', 'D']:
                if f"correcta es {letra}" in explicacion or f"correcta: {letra}" in explicacion:
                    if letra != correcta:
                        problemas.append({
                            'id': pid,
                            'tipo': 'CONTRADICCION_EXPLICITA',
                            'detalle': f"Explicación dice '{letra}' pero respuesta_correcta es '{correcta}'",
                            'prioridad': 'CRITICA'
                        })
    
    # REGLA 2: Palabras exclusivas en explicación que no coinciden con alternativa correcta
    texto_correcta = palabras_clave_por_alternativa[correcta]
    
    # Buscar si explicación menciona conceptos que NO están en la alternativa correcta
    conceptos_importantes = {
        'farsa': 'B', 'drama': 'A', 'tragedia': 'C',
        'anacronía': 'A', 'prolepsis': 'C', 'retrospectiva': 'A',
        'ruido': 'B', 'urbana': 'B', 'policiales': 'A',
        'aparte': 'B', 'cuarta pared': 'B', 'acotaciones': 'D',
        'crónica': 'B', 'interpretar': 'B', 'narración': 'B'
    }
    
    for concepto, alt_esperada in conceptos_importantes.items():
        if concepto in explicacion.lower() and concepto not in enunciado.lower():
            # Este concepto aparece en explicación
            if concepto not in texto_correcta:
                # Pero NO está en la alternativa marcada como correcta
                # Verificar si está en otra alternativa
                for opt, texto_alt in palabras_clave_por_alternativa.items():
                    if concepto in texto_alt and opt != correcta:
                        problemas.append({
                            'id': pid,
                            'tipo': 'CONCEPTO_EN_ALTERNATIVA_INCORRECTA',
                            'detalle': f"Explicación menciona '{concepto}' que está en alternativa {opt}, pero correcta es {correcta}",
                            'prioridad': 'ALTA'
                        })
                        break

# Mostrar problemas encontrados
if problemas:
    print(f"\nSE ENCONTRARON {len(problemas)} PROBLEMAS POTENCIALES:\\n")
    for prob in problemas:
        print(f"  [{prob['prioridad']}] {prob['id']}: {prob['tipo']}")
        print(f"      > {prob['detalle']}")
        print()
else:
    print("\n✅ No se detectaron contradicciones evidentes en el análisis automatizado.")
    print("   NOTA: Esto NO garantiza objetividad absoluta, solo que no hay errores")
    print("   flagrantes de correspondencia respuesta_correcta ↔ explicación.")

print(f"\nRECOMENDACION: Mantener preguntas originales SIN redistribución.")
print(f"Agregar 20 nuevas preguntas en 'casos_de_estudio' con validación rigurosa.")
