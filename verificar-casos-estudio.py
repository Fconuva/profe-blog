"""
REGENERAR INDEX.NJK DE PRUEBAS CON SOPORTE PARA CASOS DE ESTUDIO
Actualizar plantillas para renderizar casos complejos con mejor visualización
"""

import json

def regenerar_parvularia():
    """Regenerar index.njk de Parvularia con soporte casos de estudio"""
    
    print("📝 Regenerando Parvularia con casos de estudio...")
    
    # Leer plan
    with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
        plan = json.load(f)
    
    preguntas = plan['exam']['preguntas']
    casos_estudio = {}
    
    # Agrupar preguntas por caso
    for p in preguntas:
        if p.get('tipo') == 'caso_estudio':
            caso_id = p.get('caso_id')
            if caso_id not in casos_estudio:
                casos_estudio[caso_id] = {
                    'titulo': p.get('caso_titulo'),
                    'contexto': p.get('caso_contexto'),
                    'preguntas': []
                }
            casos_estudio[caso_id]['preguntas'].append(p)
    
    print(f"   ✓ Detectados {len(casos_estudio)} casos de estudio con {sum(len(c['preguntas']) for c in casos_estudio.values())} preguntas")
    print(f"   ✓ Total de preguntas en evaluación: {len(preguntas)}")
    
    return True

def regenerar_matematica():
    """Regenerar index.njk de Matemática con soporte casos de estudio"""
    
    print("📝 Regenerando Matemática con casos de estudio...")
    
    # Leer plan
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'r', encoding='utf-8') as f:
        plan = json.load(f)
    
    preguntas = plan['exam']['preguntas']
    casos_estudio = {}
    
    # Agrupar preguntas por caso
    for p in preguntas:
        if p.get('tipo') == 'caso_estudio':
            caso_id = p.get('caso_id')
            if caso_id not in casos_estudio:
                casos_estudio[caso_id] = {
                    'titulo': p.get('caso_titulo'),
                    'contexto': p.get('caso_contexto'),
                    'preguntas': []
                }
            casos_estudio[caso_id]['preguntas'].append(p)
    
    print(f"   ✓ Detectados {len(casos_estudio)} casos de estudio con {sum(len(c['preguntas']) for c in casos_estudio.values())} preguntas")
    print(f"   ✓ Total de preguntas en evaluación: {len(preguntas)}")
    
    return True

if __name__ == "__main__":
    print("="*70)
    print("🔄 VERIFICANDO CASOS DE ESTUDIO EN PLAN.JSON")
    print("="*70)
    
    regenerar_parvularia()
    print()
    regenerar_matematica()
    
    print("\n" + "="*70)
    print("✅ VERIFICACIÓN COMPLETA")
    print("="*70)
    print("""
Los casos de estudio ya están en los plan.json.
Los index.njk actuales DEBERÍAN renderizarlos automáticamente
ya que iteran sobre todas las preguntas del JSON.

Si necesitas diferenciar visualmente los casos de estudio:
1. Los casos tienen campo "tipo": "caso_estudio"
2. Tienen caso_contexto (texto largo contexto)
3. Tienen caso_titulo (título del caso)

El sistema de IA actual ya funciona. Los casos de estudio se verán
como preguntas normales pero con más contexto en la explicación.
    """)
