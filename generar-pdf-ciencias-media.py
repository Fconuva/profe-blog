#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Generador de PDF para Dossier Ciencias Naturales Media
ECEP 2025 - Biología, Química y Física
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

def procesar_carpeta(carpeta_path):
    """Procesa una carpeta de ciencias (biologia, quimica, fisica)"""
    contenido_total = ""
    archivos = sorted(carpeta_path.glob("*.njk"))
    
    for archivo in archivos:
        with open(archivo, 'r', encoding='utf-8') as f:
            contenido = f.read()
        contenido_limpio = extraer_contenido_body(contenido)
        contenido_total += f'\n<div class="page-break"></div>\n{contenido_limpio}\n'
    
    return contenido_total

def generar_html_completo():
    """Genera el HTML completo del dossier de Ciencias"""
    
    base_path = Path("evaluaciones/educacion-media/estudio/ciencias-naturales-media")
    
    # Leer index principal
    index_path = base_path / "index.njk"
    contenido_index = ""
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            contenido_index = extraer_contenido_body(f.read())
    
    # Procesar cada ciencia
    biologia_path = base_path / "biologia"
    quimica_path = base_path / "quimica"
    fisica_path = base_path / "fisica"
    
    contenido_biologia = procesar_carpeta(biologia_path) if biologia_path.exists() else ""
    contenido_quimica = procesar_carpeta(quimica_path) if quimica_path.exists() else ""
    contenido_fisica = procesar_carpeta(fisica_path) if fisica_path.exists() else ""
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dossier Ciencias Naturales Media - ECEP 2025</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: 'Inter', sans-serif; line-height: 1.6; color: #1e293b; background: white; }}
        @media print {{ body {{ font-size: 11pt; }} .page-break {{ page-break-before: always; }} .no-print {{ display: none !important; }} }}
        .cover-page {{ min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 60px 40px; }}
        .cover-page h1 {{ font-size: 3.5rem; font-weight: 700; margin-bottom: 1rem; }}
        .cover-page .icon {{ font-size: 6rem; margin-bottom: 2rem; }}
        .content-wrapper {{ max-width: 1200px; margin: 0 auto; padding: 40px 60px; }}
        h1 {{ color: #059669; font-size: 2.5rem; margin: 2rem 0 1.5rem 0; border-bottom: 4px solid #10b981; padding-bottom: 0.5rem; }}
        h2 {{ color: #059669; font-size: 2rem; margin: 1.8rem 0 1rem 0; border-left: 6px solid #10b981; padding-left: 1rem; }}
        table {{ width: 100%; border-collapse: collapse; margin: 1.5rem 0; }}
        table th {{ background: #059669; color: white; padding: 12px; }}
        table td {{ padding: 10px 12px; border: 1px solid #e2e8f0; }}
        .footer {{ text-align: center; padding: 2rem; background: #f8fafc; margin-top: 4rem; }}
    </style>
</head>
<body>
    <div class="cover-page no-print">
        <div class="icon"><i class="fas fa-flask"></i></div>
        <h1>Dossier Ciencias Naturales</h1>
        <p class="subtitle" style="font-size: 1.8rem;">Biología, Química y Física</p>
        <div class="metadata" style="margin-top: 3rem;">
            <p><strong>ECEP 2025 - Educación Media</strong></p>
            <p>Generado el {__import__('datetime').datetime.now().strftime('%d de %B de %Y')}</p>
        </div>
    </div>
    
    <div class="page-break"></div>
    <div class="content-wrapper">
        {contenido_index}
        
        <h1 class="text-center my-5">📗 BIOLOGÍA</h1>
        {contenido_biologia}
        
        <h1 class="text-center my-5">⚗️ QUÍMICA</h1>
        {contenido_quimica}
        
        <h1 class="text-center my-5">⚛️ FÍSICA</h1>
        {contenido_fisica}
    </div>
    
    <div class="footer no-print">
        <p><strong>Dossier Ciencias Naturales - ECEP 2025</strong></p>
        <p>© 2025 Profe Francisco Pancho</p>
    </div>
</body>
</html>"""
    
    return html

def main():
    print("🧪 Generando Dossier Ciencias Naturales Media...")
    
    html = generar_html_completo()
    output = "DOSSIER_CIENCIAS_NATURALES_MEDIA_COMPLETO.html"
    
    with open(output, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ HTML generado: {output}")
    print(f"📊 Tamaño: {len(html):,} caracteres")
    print("\n📋 Guarda como: dossieres-pdf/DOSSIER_CIENCIAS_NATURALES_MEDIA.pdf")

if __name__ == "__main__":
    main()
