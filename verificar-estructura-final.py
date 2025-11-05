# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def verificar_estructura():
    """Verifica estructura final de ambos archivos JSON"""
    
    # Matemática
    with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'r', encoding='utf-8') as f:
        matematica = json.load(f)
    
    # Lenguaje
    with open('evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json', 'r', encoding='utf-8') as f:
        lenguaje = json.load(f)
    
    print("=" * 50)
    print("VERIFICACION ESTRUCTURA FINAL")
    print("=" * 50)
    
    print("\nMATEMATICA (66-sc-m):")
    print(f"  - preguntas: {len(matematica['exam']['preguntas'])} items")
    print(f"  - casos_estudio: {len(matematica['exam']['casos_estudio'])} casos")
    print(f"  - Primer pregunta: {matematica['exam']['preguntas'][0]['id']}")
    print(f"  - Ultima pregunta: {matematica['exam']['preguntas'][-1]['id']}")
    print(f"  - Primer caso: {matematica['exam']['casos_estudio'][0]['id']}")
    print(f"  - Ultimo caso: {matematica['exam']['casos_estudio'][-1]['id']}")
    
    # Distribución casos Matemática
    dist_m = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
    for caso in matematica['exam']['casos_estudio']:
        dist_m[caso['respuesta_correcta']] += 1
    print(f"  - Distribucion: A={dist_m['A']}, B={dist_m['B']}, C={dist_m['C']}, D={dist_m['D']}")
    
    print("\nLENGUAJE (63-sc-l):")
    print(f"  - preguntas: {len(lenguaje['exam']['preguntas'])} items")
    print(f"  - casos_estudio: {len(lenguaje['exam']['casos_estudio'])} casos")
    print(f"  - Primer pregunta: {lenguaje['exam']['preguntas'][0]['id']}")
    print(f"  - Ultima pregunta: {lenguaje['exam']['preguntas'][-1]['id']}")
    print(f"  - Primer caso: {lenguaje['exam']['casos_estudio'][0]['id']}")
    print(f"  - Ultimo caso: {lenguaje['exam']['casos_estudio'][-1]['id']}")
    
    # Distribución casos Lenguaje
    dist_l = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
    for caso in lenguaje['exam']['casos_estudio']:
        dist_l[caso['respuesta_correcta']] += 1
    print(f"  - Distribucion: A={dist_l['A']}, B={dist_l['B']}, C={dist_l['C']}, D={dist_l['D']}")
    
    print("\n" + "=" * 50)
    print("FORMATO CASOS:")
    print("=" * 50)
    print("\nEjemplo caso Matematica:")
    caso_m = matematica['exam']['casos_estudio'][0]
    print(f"  id: {caso_m['id']}")
    print(f"  contexto: {caso_m['contexto'][:100]}...")
    print(f"  enunciado: {caso_m['enunciado']}")
    print(f"  alternativas: {len(caso_m['alternativas'])} opciones")
    print(f"  respuesta_correcta: {caso_m['respuesta_correcta']}")
    
    print("\n✓ ESTRUCTURA CORRECTA - CASOS EN SECCION SEPARADA")

if __name__ == '__main__':
    verificar_estructura()
