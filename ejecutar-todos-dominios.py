#!/usr/bin/env python3
"""
Script maestro para agregar todos los dominios restantes (2, 3 y 4)
"""

import os
import subprocess

scripts = [
    "generar-basica-generalista-parte3-dom2.py",  # Matemática
    "generar-basica-generalista-parte4-dom3.py",  # Historia
    "generar-basica-generalista-parte5-dom4.py",  # Ciencias
]

print("🚀 Iniciando generación de dominios 2, 3 y 4...")
print("=" * 60)

for i, script in enumerate(scripts, start=2):
    print(f"\n📦 Procesando DOMINIO {i}...")
    if os.path.exists(script):
        result = subprocess.run(["python", script], capture_output=True, text=True)
        print(result.stdout)
        if result.returncode != 0:
            print(f"❌ Error en {script}:")
            print(result.stderr)
            break
    else:
        print(f"⚠️ Archivo {script} no encontrado. Créalo primero.")
        break

print("\n" + "=" * 60)
print("✅ Proceso completado")
