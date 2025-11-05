import json
import re

print("AUDITORIA DE OBJETIVIDAD - MATEMATICA 66-sc-m")
print("="*80)

with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

problemas = []

for i, p in enumerate(data['exam']['preguntas'], 1):
    pid = p['id']
    correcta = p['respuesta_correcta']
    enunciado = p['enunciado']
    explicacion = p.get('explicacion', '')
    
    # VALIDACION 1: Calculos en explicacion
    # Buscar si explicación contiene cálculos que contradicen la respuesta
    numeros_en_explicacion = re.findall(r'\d+[\.,]?\d*', explicacion)
    
    # VALIDACION 2: Buscar frases como "la respuesta es X" donde X != correcta
    patrones_contradiccion = [
        r'respuesta (?:es|correcta)(?: es)?\s*([ABCD])',
        r'alternativa\s+([ABCD])\s+es\s+correcta',
        r'opción\s+([ABCD])'
    ]
    
    for patron in patrones_contradiccion:
        matches = re.findall(patron, explicacion, re.IGNORECASE)
        for letra in matches:
            if letra.upper() != correcta:
                problemas.append({
                    'id': pid,
                    'tipo': 'CONTRADICCION_EXPLICITA',
                    'detalle': f"Explicacion menciona '{letra}' pero respuesta_correcta es '{correcta}'",
                    'prioridad': 'CRITICA'
                })
    
    # VALIDACION 3: Verificar que alternativas son mutuamente excluyentes
    alternativas_texto = [alt['texto'] for alt in p['alternativas']]
    
    # Buscar duplicados o alternativas muy similares
    for j, alt1 in enumerate(alternativas_texto):
        for k, alt2 in enumerate(alternativas_texto[j+1:], j+1):
            similitud = sum(c1 == c2 for c1, c2 in zip(alt1, alt2)) / max(len(alt1), len(alt2))
            if similitud > 0.8:  # 80% similitud
                problemas.append({
                    'id': pid,
                    'tipo': 'ALTERNATIVAS_SIMILARES',
                    'detalle': f"Alternativas {j+1} y {k+1} son muy similares",
                    'prioridad': 'MEDIA'
                })

# Mostrar resumen
if problemas:
    print(f"\nSE ENCONTRARON {len(problemas)} PROBLEMAS:\n")
    for prob in problemas:
        print(f"  [{prob['prioridad']}] {prob['id']}: {prob['tipo']}")
        print(f"      > {prob['detalle']}\n")
else:
    print("\n✓ No se detectaron contradicciones evidentes.")
    print("  NOTA: Auditoría automatizada no garantiza 100% objetividad.")
    print("  Revisar manualmente preguntas con cálculos complejos.")

print(f"\nRECOMENDACION: Mantener preguntas actuales si no hay errores.")
print(f"Agregar 20 preguntas en casos de estudio con problemas contextualizados.")
