# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def restaurar_preguntas_originales():
    """Elimina últimas 20 preguntas agregadas incorrectamente (casos mezclados)"""
    
    ruta = 'evaluaciones/educacion-basica/pruebas/63-sc-l/plan.json'
    
    with open(ruta, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Verificar que hay 70 preguntas
    preguntas_actuales = len(data['exam']['preguntas'])
    print(f"Preguntas actuales: {preguntas_actuales}")
    
    if preguntas_actuales != 70:
        print(f"ERROR: Se esperaban 70 preguntas, hay {preguntas_actuales}")
        return
    
    # Mantener solo primeras 50
    data['exam']['preguntas'] = data['exam']['preguntas'][:50]
    
    print(f"\nPreguntas restauradas: {len(data['exam']['preguntas'])}")
    print(f"Primero: {data['exam']['preguntas'][0]['id']}")
    print(f"Ultimo: {data['exam']['preguntas'][49]['id']}")
    
    # Guardar
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("\n✓ LENGUAJE RESTAURADO A 50 PREGUNTAS ORIGINALES")

if __name__ == '__main__':
    restaurar_preguntas_originales()
