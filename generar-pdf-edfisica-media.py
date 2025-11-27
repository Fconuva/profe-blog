#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Generador de PDF para Dossier Educación Física Media
ECEP 2025
"""

import os
import re
from pathlib import Path

def limpiar_front_matter(contenido):
    patron = r'^---\s*\n.*?\n---\s*\n'
    return re.sub(patron, '', contenido, flags=re.DOTALL | re.MULTILINE)

def extraer_contenido_body(contenido):
    contenido = limpiar_front_matter(contenido)
    body_match = re.search(r'<body[^>]*>(.*)</body>', contenido, re.DOTALL | re.IGNORECASE)
    if body_match:
        return body_match.group(1)
    return contenido

def generar_html_completo(archivo_edfisica):
    with open(archivo_edfisica, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    contenido_limpio = extraer_contenido_body(contenido)
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dossier Educación Física Media - ECEP 2025</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Inter', sans-serif; line-height: 1.6; color: #1e293b; background: white; }}
        @media print {{ body {{ font-size: 11pt; }} .page-break {{ page-break-before: always; }} .no-print {{ display: none !important; }} }}
        .cover-page {{ min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); color: white; padding: 60px 40px; }}
        .cover-page h1 {{ font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; }}
        .cover-page .icon {{ font-size: 6rem; margin-bottom: 2rem; }}
        .content-wrapper {{ max-width: 1200px; margin: 0 auto; padding: 40px 60px; }}
        h1 {{ color: #ea580c; font-size: 2.5rem; margin: 2rem 0 1.5rem 0; border-bottom: 4px solid #fb923c; padding-bottom: 0.5rem; }}
        h2 {{ color: #ea580c; font-size: 2rem; margin: 1.8rem 0 1rem 0; border-left: 6px solid #fb923c; padding-left: 1rem; }}
        table {{ width: 100%; border-collapse: collapse; margin: 1.5rem 0; }}
        table th {{ background: #ea580c; color: white; padding: 12px; }}
        table td {{ padding: 10px 12px; border: 1px solid #e2e8f0; }}
        .footer {{ text-align: center; padding: 2rem; background: #f8fafc; margin-top: 4rem; }}
    </style>
</head>
<body>
    <div class="cover-page no-print">
        <div class="icon"><i class="fas fa-running"></i></div>
        <h1>Dossier Educación Física</h1>
        <p class="subtitle" style="font-size: 1.8rem;">Educación Media</p>
        <div class="metadata" style="margin-top: 3rem;">
            <p><strong>ECEP 2025</strong></p>
            <p>Generado el {__import__('datetime').datetime.now().strftime('%d de %B de %Y')}</p>
        </div>
    </div>
    
    <div class="page-break"></div>
    <div class="content-wrapper">{contenido_limpio}</div>
    
    <div class="footer no-print">
        <p><strong>Dossier Educación Física - ECEP 2025</strong></p>
        <p>© 2025 Profe Francisco Pancho</p>
    </div>
</body>
</html>"""
    
    return html

def main():
    print("🏃 Generando Dossier Educación Física Media...")
    archivo = Path("evaluaciones/educacion-media/estudio/dossier-educacion-fisica.njk")
    
    if not archivo.exists():
        print(f"❌ Error: No se encontró {archivo}")
        return
    
    html = generar_html_completo(archivo)
    output = "DOSSIER_EDUCACION_FISICA_MEDIA_COMPLETO.html"
    
    with open(output, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ HTML generado: {output}")
    print(f"📊 Tamaño: {len(html):,} caracteres")
    print("\n📋 Guarda como: dossieres-pdf/DOSSIER_EDUCACION_FISICA_MEDIA.pdf")

if __name__ == "__main__":
    main()
