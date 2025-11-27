#!/usr/bin/env python3
"""
Script para generar PDF del Dossier completo de Lengua y Literatura Media
Combina todos los dominios en un solo documento PDF
"""

import os
import re
from pathlib import Path

# Configuración
DOSSIER_DIR = Path("evaluaciones/educacion-media/estudio/dossier-lenguaje-media")
OUTPUT_FILE = "DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html"
PDF_OUTPUT = "DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.pdf"

# Archivos en orden
ARCHIVOS_ORDEN = [
    "dominio-1-1-textos-literarios.njk",
    "dominio-1-2-textos-no-literarios.njk",
    "dominio-2-1-coherencia-cohesion.njk",
    "dominio-2-2-adecuacion-comunicativa.njk",
    "dominio-3-ensenanza-aprendizaje.njk",
    "casos-discurso-publico-chile.njk"
]

def limpiar_front_matter(contenido):
    """Elimina el front matter de Eleventy (---...---)"""
    return re.sub(r'^---\n.*?\n---\n', '', contenido, flags=re.DOTALL)

def extraer_contenido_body(contenido):
    """Extrae solo el contenido del body (sin layout wrapper)"""
    # Buscar el contenido principal después del front matter
    contenido_limpio = limpiar_front_matter(contenido)
    return contenido_limpio

def generar_html_completo():
    """Genera un HTML completo combinando todos los dossieres"""
    
    print("🔍 Generando PDF del Dossier de Lengua y Literatura Media...")
    print(f"📁 Directorio: {DOSSIER_DIR}\n")
    
    # HTML base
    html_completo = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dossier Completo - Lengua y Literatura Media ECEP 2025</title>
    
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    
    <style>
        @media print {
            .no-print { display: none; }
            .page-break { page-break-before: always; }
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
        }
        
        h1 {
            color: #6f42c1;
            border-bottom: 3px solid #6f42c1;
            padding-bottom: 10px;
            margin-top: 30px;
            page-break-after: avoid;
        }
        
        h2 {
            color: #0d6efd;
            margin-top: 25px;
            page-break-after: avoid;
        }
        
        h3 {
            color: #198754;
            margin-top: 20px;
        }
        
        .card {
            margin-bottom: 15px;
            break-inside: avoid;
        }
        
        .alert {
            break-inside: avoid;
        }
        
        table {
            break-inside: avoid;
        }
        
        .section-header {
            background: linear-gradient(135deg, #6f42c1, #9f7aea);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            page-break-after: avoid;
        }
        
        .dominio-separator {
            page-break-before: always;
            margin-top: 40px;
            border-top: 5px solid #6f42c1;
            padding-top: 20px;
        }
        
        .portada {
            text-align: center;
            padding: 100px 20px;
            page-break-after: always;
        }
        
        .portada h1 {
            font-size: 3rem;
            color: #6f42c1;
            margin-bottom: 30px;
            border: none;
        }
        
        .portada h2 {
            font-size: 1.5rem;
            color: #6c757d;
            margin-bottom: 50px;
        }
        
        .portada .metadata {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            display: inline-block;
        }
    </style>
</head>
<body>
    
    <!-- PORTADA -->
    <div class="portada">
        <h1>📖 DOSSIER COMPLETO</h1>
        <h2>Lengua y Literatura<br/>Educación Media</h2>
        <h3>ECEP 2025</h3>
        
        <div class="metadata mt-5">
            <p class="mb-2"><strong>Dominios Incluidos:</strong></p>
            <ul class="list-unstyled">
                <li>✓ Dominio 1.1: Textos Literarios</li>
                <li>✓ Dominio 1.2: Textos No Literarios</li>
                <li>✓ Dominio 2.1: Coherencia y Cohesión</li>
                <li>✓ Dominio 2.2: Adecuación Comunicativa</li>
                <li>✓ Dominio 3: Enseñanza-Aprendizaje</li>
                <li>✓ Casos de Estudio: Discurso Público en Chile</li>
            </ul>
            <hr>
            <p class="text-muted mb-0">Generado: """ + __import__('datetime').datetime.now().strftime('%d/%m/%Y %H:%M') + """</p>
            <p class="text-muted">profefranciscopancho.com</p>
        </div>
    </div>
    
    <!-- CONTENIDO -->
    <div class="container-fluid px-5">
"""
    
    # Procesar cada archivo
    for idx, archivo in enumerate(ARCHIVOS_ORDEN, 1):
        archivo_path = DOSSIER_DIR / archivo
        
        if not archivo_path.exists():
            print(f"⚠️  Archivo no encontrado: {archivo}")
            continue
        
        print(f"📄 [{idx}/{len(ARCHIVOS_ORDEN)}] Procesando: {archivo}")
        
        # Leer contenido
        with open(archivo_path, 'r', encoding='utf-8') as f:
            contenido = f.read()
        
        # Limpiar y extraer contenido
        contenido_limpio = extraer_contenido_body(contenido)
        
        # Agregar separador de dominio
        if idx > 1:
            html_completo += '\n    <div class="dominio-separator"></div>\n\n'
        
        # Agregar contenido
        html_completo += f"    <!-- ARCHIVO: {archivo} -->\n"
        html_completo += contenido_limpio
        html_completo += "\n\n"
    
    # Cerrar HTML
    html_completo += """
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
"""
    
    # Guardar HTML
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html_completo)
    
    print(f"\n✅ HTML generado: {OUTPUT_FILE}")
    print(f"📊 Tamaño: {len(html_completo):,} caracteres")
    
    return OUTPUT_FILE

def generar_pdf_con_wkhtmltopdf(html_file):
    """Genera PDF usando wkhtmltopdf (si está instalado)"""
    try:
        import subprocess
        
        cmd = [
            'wkhtmltopdf',
            '--enable-local-file-access',
            '--page-size', 'Letter',
            '--margin-top', '15mm',
            '--margin-bottom', '15mm',
            '--margin-left', '15mm',
            '--margin-right', '15mm',
            '--print-media-type',
            html_file,
            PDF_OUTPUT
        ]
        
        print(f"\n🔄 Generando PDF con wkhtmltopdf...")
        subprocess.run(cmd, check=True)
        print(f"✅ PDF generado: {PDF_OUTPUT}")
        return True
        
    except FileNotFoundError:
        print("\n⚠️  wkhtmltopdf no está instalado.")
        print("   Descarga desde: https://wkhtmltopdf.org/downloads.html")
        return False
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error al generar PDF: {e}")
        return False

def main():
    print("=" * 70)
    print("  GENERADOR DE PDF - DOSSIER LENGUA Y LITERATURA MEDIA")
    print("=" * 70)
    print()
    
    # Generar HTML completo
    html_file = generar_html_completo()
    
    # Intentar generar PDF
    if not generar_pdf_con_wkhtmltopdf(html_file):
        print("\n📋 OPCIONES ALTERNATIVAS:")
        print("   1. Abre el archivo HTML en tu navegador")
        print("   2. Usa Ctrl+P (o Cmd+P en Mac)")
        print("   3. Selecciona 'Guardar como PDF'")
        print(f"\n   Archivo: {os.path.abspath(html_file)}")
    
    print("\n" + "=" * 70)
    print("  ✅ PROCESO COMPLETADO")
    print("=" * 70)

if __name__ == "__main__":
    main()
