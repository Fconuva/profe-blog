#!/usr/bin/env python3
"""
Arreglar error de sintaxis en parv-nt/index.njk
ERROR: pregunta-container" debería ser class="pregunta-container"
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("🔧 Arreglando error de sintaxis en clases...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# PROBLEMA: border-pink-400" pregunta-container"
# SOLUCIÓN: border-pink-400 pregunta-container"

# Patrón 1: Corregir " pregunta-container" a " class="pregunta-container"
# Ejemplo ANTES: border-pink-400" pregunta-container" id="pregunta-1"
# Ejemplo DESPUÉS: border-pink-400 pregunta-container" id="pregunta-1"

patron1 = r'(border-(?:pink|purple|blue)-400)"\s+pregunta-container"'
reemplazo1 = r'\1 pregunta-container"'

contenido_corregido = re.sub(patron1, reemplazo1, contenido)

# Contar cuántas correcciones se hicieron
correcciones = len(re.findall(patron1, contenido))

print(f"✅ Corregidas {correcciones} clases con error de sintaxis")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_corregido)

print(f"\n✅ Archivo corregido exitosamente")
print(f"📁 {archivo}")
print("\n🚀 Próximo paso: npm run build")
