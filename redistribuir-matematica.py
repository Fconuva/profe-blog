import json

# Cargar plan.json
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Distribución actual: A=16, B=19, C=13, D=2
# Objetivo: A=12-13, B=12-13, C=12-13, D=12-13
# Necesito: A→D (4), B→D (7), C→A (1)

cambios = {
    # De A a D (4 conversiones) - reducir A de 16 a 12
    '66-M-04': 'D',  # 24×35
    '66-M-18': 'D',  # conversión de unidades
    '66-M-22': 'D',  # 
    '66-M-44': 'D',  # 
    
    # De B a D (7 conversiones) - reducir B de 19 a 12
    '66-M-02': 'D',  # orden números racionales
    '66-M-10': 'D',  # 
    '66-M-14': 'D',  # 
    '66-M-30': 'D',  # 
    '66-M-36': 'D',  # 
    '66-M-47': 'D',  # 
    '66-M-49': 'D',  # 
    
    # De C a A (1 conversión) - ajustar C de 13 a 12
    '66-M-03': 'A',  # suma decimales
}

print("🔄 Redistribuyendo alternativas en Matemática...\n")

# Aplicar cambios
for pregunta in data['exam']['preguntas']:
    if pregunta['id'] in cambios:
        old = pregunta['respuesta_correcta']
        new = cambios[pregunta['id']]
        pregunta['respuesta_correcta'] = new
        print(f"✓ {pregunta['id']}: {old} → {new}")

# Guardar
with open('evaluaciones/educacion-basica/pruebas/66-sc-m/plan.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"\n✅ {len(cambios)} respuestas redistribuidas exitosamente!")
print("Distribución esperada:")
print("  A: 13 preguntas")
print("  B: 12 preguntas")
print("  C: 12 preguntas")
print("  D: 13 preguntas")
