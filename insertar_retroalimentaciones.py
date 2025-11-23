# -*- coding: utf-8 -*-
"""
Script para agregar retroalimentaciones al planData de las preguntas 1-50
"""

import json
import re

# Cargar retroalimentaciones
with open('retroalimentaciones_1_50.json', 'r', encoding='utf-8') as f:
    retroalimentaciones = json.load(f)

# Leer el archivo
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

# Para cada pregunta, agregar "explicacion" field después de "respuesta_correcta"
for pregunta_id, data in retroalimentaciones.items():
    numero = int(pregunta_id.replace('parv-', ''))
    respuesta = data['respuesta_correcta']
    explicacion = data['retroalimentacion']
    
    # Patron: buscar la pregunta y su respuesta_correcta
    # Insertar "explicacion" justo después
    patron = f'"id": "{pregunta_id}",\s*"numero": {numero},(.*?)"respuesta_correcta": "{respuesta}",'
    
    def reemplazo(match):
        before = match.group(1)
        return f'"id": "{pregunta_id}",\n        "numero": {numero},{before}"respuesta_correcta": "{respuesta}",\n        "explicacion": "{explicacion}",'
    
    content = re.sub(patron, reemplazo, content, flags=re.DOTALL)
    print(f"✓ Retroalimentación agregada a {pregunta_id}")

# Guardar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✓ 50 retroalimentaciones insertadas en planData")
