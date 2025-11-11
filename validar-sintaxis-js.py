#!/usr/bin/env python3
"""
Script para validar sintaxis JavaScript en archivos .njk
Extrae el código entre <script> y </script> y lo valida con Node.js
"""

import sys
import re
import subprocess
import tempfile
from pathlib import Path

def extraer_javascript(archivo_njk):
    """Extrae todo el código JavaScript de un archivo .njk"""
    with open(archivo_njk, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    # Buscar todos los bloques <script>...</script>
    patron = r'<script>(.*?)</script>'
    matches = re.findall(patron, contenido, re.DOTALL)
    
    if not matches:
        print(f"⚠️  No se encontraron bloques <script> en {archivo_njk}")
        return None
    
    # Unir todos los bloques de script
    javascript = '\n\n'.join(matches)
    return javascript

def validar_javascript(codigo_js, archivo_original):
    """Valida sintaxis JavaScript usando Node.js"""
    # Crear archivo temporal con el código JS
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8') as tmp:
        tmp.write(codigo_js)
        tmp_path = tmp.name
    
    try:
        # Ejecutar node -c para verificar sintaxis
        result = subprocess.run(
            ['node', '-c', tmp_path],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        if result.returncode == 0:
            print(f"✅ Sintaxis JavaScript CORRECTA en {archivo_original}")
            return True
        else:
            print(f"\n❌ ERROR DE SINTAXIS en {archivo_original}:")
            print("=" * 60)
            
            # Procesar el error de Node para hacerlo más útil
            error_msg = result.stderr
            
            # Intentar extraer el número de línea del error
            linea_match = re.search(r':(\d+)', error_msg)
            if linea_match:
                linea_js = int(linea_match.group(1))
                print(f"📍 Línea aproximada en el bloque <script>: {linea_js}")
                
                # Mostrar contexto alrededor del error
                lineas = codigo_js.split('\n')
                inicio = max(0, linea_js - 3)
                fin = min(len(lineas), linea_js + 3)
                
                print("\n📄 Contexto del error:")
                for i in range(inicio, fin):
                    marcador = ">>>" if i == linea_js - 1 else "   "
                    print(f"{marcador} {i+1:4d} | {lineas[i]}")
            
            print("\n🔍 Error completo de Node.js:")
            print(error_msg)
            print("=" * 60)
            return False
            
    finally:
        # Limpiar archivo temporal
        Path(tmp_path).unlink(missing_ok=True)

def main():
    if len(sys.argv) < 2:
        print("Uso: python validar-sintaxis-js.py <archivo.njk>")
        print("Ejemplo: python validar-sintaxis-js.py evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk")
        sys.exit(1)
    
    archivo = sys.argv[1]
    
    if not Path(archivo).exists():
        print(f"❌ El archivo {archivo} no existe")
        sys.exit(1)
    
    print(f"\n🔎 Validando JavaScript en: {archivo}")
    print("-" * 60)
    
    # Extraer JavaScript
    codigo_js = extraer_javascript(archivo)
    if codigo_js is None:
        sys.exit(1)
    
    print(f"📊 Total de líneas JavaScript: {len(codigo_js.splitlines())}")
    
    # Validar sintaxis
    if validar_javascript(codigo_js, archivo):
        print("\n✨ ¡Todo correcto! El archivo está listo para deploy.\n")
        sys.exit(0)
    else:
        print("\n⚠️  Corrige los errores antes de hacer deploy.\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
