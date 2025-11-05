#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para agregar Auth Guard a todos los archivos HTML desprotegidos
"""

from pathlib import Path
import re

# Lista de archivos sin protección según auditoría
archivos_sin_proteccion = [
    "admin-db-docentes.html",
    "admin-evento-sindicato.html",
    "auto-clean.html",
    "auto-import-planes.html",
    "backup-automatico.html",
    "clean-database.html",
    "convert-data.html",
    "diagnostico-namespace.html",
    "emergency-clean.html",
    "evento-sindicato-admin.html",
    "evento-sindicato.html",
    "fix-separation.html",
    "gestor-planes-programas.html",
    "migrar-cursos.html",
    "recovery-from-db.html",
    "recovery.html",
    "setup-profesor2-Francisco.html",
    "setup-profesor2.html",
    "start-fresh.html",
    "test-control-maestro.html"
]

# Auth Guard estándar
AUTH_GUARD = """
    <!-- Auth Guard -->
    <script>
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'index.html';
        }
    </script>
"""

privado_dir = Path("privado")
archivos_corregidos = 0

print("="*70)
print("🔒 AGREGANDO AUTH GUARD A ARCHIVOS DESPROTEGIDOS")
print("="*70)

for filename in archivos_sin_proteccion:
    file_path = privado_dir / filename
    
    if not file_path.exists():
        print(f"⏭️  Saltando {filename} (no existe)")
        continue
    
    content = file_path.read_text(encoding='utf-8')
    
    # Verificar si ya tiene Auth Guard
    if "sessionStorage.getItem('isLoggedIn')" in content:
        print(f"✅ {filename} ya tiene Auth Guard")
        continue
    
    # Buscar la etiqueta <body> y agregar el Auth Guard después
    body_pattern = r'(<body[^>]*>)'
    
    if re.search(body_pattern, content):
        # Agregar Auth Guard después de <body>
        new_content = re.sub(
            body_pattern,
            r'\1' + AUTH_GUARD,
            content,
            count=1
        )
        
        # Guardar archivo
        file_path.write_text(new_content, encoding='utf-8')
        archivos_corregidos += 1
        print(f"✅ {filename} - Auth Guard agregado")
    else:
        print(f"⚠️  {filename} - No se encontró <body>, revisar manualmente")

print("\n" + "="*70)
print(f"✅ COMPLETADO: {archivos_corregidos} archivos corregidos")
print("="*70)
