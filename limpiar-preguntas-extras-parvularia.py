#!/usr/bin/env python3
"""
Eliminar preguntas 51-58 del JSON en parv-nt/index.njk
Solo deben quedar 50 preguntas
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("🧹 Limpiando preguntas extras en parv-nt...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Encontrar el script que contiene const preguntasData
patron_script = r'(<script>\s*const preguntasData = )(\[[\s\S]*?\]);'

def limpiar_json(match):
    inicio = match.group(1)
    json_completo = match.group(2)
    
    # Encontrar las preguntas 51-58 y eliminarlas
    # Patrón: pregunta completa desde { "id": "parv-51" hasta el siguiente } que cierra
    patron_pregunta = r',\s*\{\s*"id":\s*"parv-(5[1-8])"\s*,[\s\S]*?(?="temas_relacionados"[\s\S]*?\]\s*\})'
    
    # Eliminar cada pregunta 51-58
    json_limpio = re.sub(
        r',\s*\{\s*"id":\s*"parv-(5[1-8])"[\s\S]*?"temas_relacionados":\s*\[[^\]]*\]\s*\}',
        '',
        json_completo
    )
    
    return inicio + json_limpio + ';'

# Aplicar limpieza
contenido_limpio = re.sub(patron_script, limpiar_json, contenido)

# Contar preguntas antes y después
preguntas_antes = len(re.findall(r'"id":\s*"parv-\d+"', contenido))
preguntas_despues = len(re.findall(r'"id":\s*"parv-\d+"', contenido_limpio))

print(f"📊 Preguntas antes: {preguntas_antes}")
print(f"📊 Preguntas después: {preguntas_despues}")
print(f"🗑️  Eliminadas: {preguntas_antes - preguntas_despues}")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_limpio)

print(f"\n✅ Archivo limpiado exitosamente")
print(f"📁 {archivo}")
print("\n🚀 Próximo paso: npm run build")
