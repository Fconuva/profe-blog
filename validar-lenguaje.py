import json
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("VALIDACION DE OBJETIVIDAD - PRUEBA LENGUAJE 63-sc-l\n")
print("="*60)

with open('evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# IDs que fueron modificados en redistribución
ids_modificados = [
    '63-L-07', '63-L-08', '63-L-09', '63-L-11', '63-L-12', 
    '63-L-13', '63-L-14', '63-L-16', '63-L-17', '63-L-19',
    '63-L-20', '63-L-22', '63-L-23', '63-L-24', '63-L-25',
    '63-L-26', '63-L-27', '63-L-28', '63-L-31', '63-L-32'
]

print(f"\nREVISANDO {len(ids_modificados)} PREGUNTAS MODIFICADAS:\n")

for pregunta in data['exam']['preguntas']:
    if pregunta['id'] in ids_modificados:
        print(f"\n{'='*60}")
        print(f"ID: {pregunta['id']}")
        print(f"RESPUESTA CORRECTA ACTUAL: {pregunta['respuesta_correcta']}")
        print(f"\nENUNCIADO:")
        print(f"  {pregunta['enunciado'][:150]}...")
        print(f"\nALTERNATIVAS:")
        for alt in pregunta['alternativas']:
            marcador = " <- CORRECTA" if alt['opcion'] == pregunta['respuesta_correcta'] else ""
            print(f"  {alt['opcion']}) {alt['texto'][:80]}{marcador}")
        
        if 'explicacion' in pregunta:
            print(f"\nEXPLICACIÓN: {pregunta['explicacion'][:100]}...")

print(f"\n\n{'='*60}")
print("ADVERTENCIA - REVISAR MANUALMENTE:")
print("  1. ¿La explicación menciona la alternativa correcta actual?")
print("  2. ¿Las alternativas son mutuamente excluyentes?")
print("  3. ¿Hay solo UNA respuesta inequívocamente correcta?")
print("  4. ¿No hay ambigüedades de interpretación?")
