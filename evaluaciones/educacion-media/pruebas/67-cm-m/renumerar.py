import json

file_path = r'c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\67-cm-m\plan.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Contar casos de estudio
casos_estudio = [p for p in data['exam']['preguntas'] if p.get('tipo') == 'caso_estudio']
print(f'Casos de estudio encontrados: {len(casos_estudio)}')

# Mostrar numeración actual
print('\nNumeración actual de casos:')
for caso in casos_estudio:
    print(f"  {caso['id']} - número {caso['numero']}")

# Renumerar casos de estudio (deberían ser 74-89)
numero_actual = 74
for pregunta in data['exam']['preguntas']:
    if pregunta.get('tipo') == 'caso_estudio':
        old_id = pregunta['id']
        old_num = pregunta['numero']
        
        # Actualizar ID y número
        new_id = f'67-M-{numero_actual}'
        pregunta['id'] = new_id
        pregunta['numero'] = numero_actual
        
        print(f'Renumerado: {old_id} (#{old_num}) -> {new_id} (#{numero_actual})')
        numero_actual += 1

# Actualizar metadata
data['metadata']['total_preguntas'] = 89  # 73 base + 16 casos
data['metadata']['version'] = 5
data['metadata']['ultima_actualizacion'] = '2025-11-07'

# Agregar nota de auditoría
nota_auditoria = 'v5: AUDITORÍA COMPLETA - Corregidas respuestas incorrectas (preguntas 3-8), corregido enunciado pregunta 13 (tres paralelas, no dos), eliminada duplicación masiva de preguntas 51-73, renumerados casos de estudio 74-89. Total real: 89 preguntas (73 base + 16 casos).'
if isinstance(data['metadata']['notas'], str):
    data['metadata']['notas'] = data['metadata']['notas'] + ' | ' + nota_auditoria
else:
    data['metadata']['notas'] = nota_auditoria

# Guardar
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nMetadata actualizado:')
print(f'  Total preguntas: {data["metadata"]["total_preguntas"]}')
print(f'  Versión: {data["metadata"]["version"]}')
print(f'  Última actualización: {data["metadata"]["ultima_actualizacion"]}')
print('\n✅ Archivo guardado correctamente')
