#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Generador de PDF para Dossier Matemática Media
ECEP 2025 - 7° básico a 4° medio
"""

import os
import re
from pathlib import Path

def limpiar_front_matter(contenido):
    """Elimina el front matter de Eleventy (--- ... ---)"""
    patron = r'^---\s*\n.*?\n---\s*\n'
    return re.sub(patron, '', contenido, flags=re.DOTALL | re.MULTILINE)

def extraer_contenido_body(contenido):
    """Extrae solo el contenido dentro del body o después del front matter"""
    contenido = limpiar_front_matter(contenido)
    
    # Si hay etiquetas <body>, extraer solo ese contenido
    body_match = re.search(r'<body[^>]*>(.*)</body>', contenido, re.DOTALL | re.IGNORECASE)
    if body_match:
        return body_match.group(1)
    
    return contenido

def generar_html_completo(archivo_matematica):
    """Genera el HTML completo del dossier"""
    
    # Leer archivo
    with open(archivo_matematica, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    contenido_limpio = extraer_contenido_body(contenido)
    
    # Plantilla HTML completa
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dossier Matemática Media - ECEP 2025</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: white;
        }}
        
        /* Estilos para impresión */
        @media print {{
            body {{
                background: white;
                font-size: 11pt;
            }}
            
            .page-break {{
                page-break-before: always;
            }}
            
            .no-print {{
                display: none !important;
            }}
            
            h1, h2, h3, h4 {{
                page-break-after: avoid;
            }}
            
            table, figure {{
                page-break-inside: avoid;
            }}
        }}
        
        /* Portada */
        .cover-page {{
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            padding: 60px 40px;
        }}
        
        .cover-page h1 {{
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }}
        
        .cover-page .subtitle {{
            font-size: 1.8rem;
            font-weight: 300;
            margin-bottom: 2rem;
            opacity: 0.95;
        }}
        
        .cover-page .metadata {{
            font-size: 1.1rem;
            margin-top: 3rem;
            opacity: 0.9;
        }}
        
        .cover-page .icon {{
            font-size: 6rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }}
        
        /* Contenido */
        .content-wrapper {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 60px;
        }}
        
        h1 {{
            color: #1e40af;
            font-size: 2.5rem;
            font-weight: 700;
            margin: 2rem 0 1.5rem 0;
            border-bottom: 4px solid #3b82f6;
            padding-bottom: 0.5rem;
        }}
        
        h2 {{
            color: #1e40af;
            font-size: 2rem;
            font-weight: 600;
            margin: 1.8rem 0 1rem 0;
            border-left: 6px solid #3b82f6;
            padding-left: 1rem;
        }}
        
        h3 {{
            color: #475569;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 0.8rem 0;
        }}
        
        h4 {{
            color: #64748b;
            font-size: 1.2rem;
            font-weight: 600;
            margin: 1.2rem 0 0.6rem 0;
        }}
        
        p {{
            margin-bottom: 1rem;
            text-align: justify;
        }}
        
        ul, ol {{
            margin: 1rem 0 1rem 2rem;
        }}
        
        li {{
            margin-bottom: 0.5rem;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        
        table th {{
            background: #1e40af;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }}
        
        table td {{
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
        }}
        
        table tr:nth-child(even) {{
            background: #f8fafc;
        }}
        
        .alert {{
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 8px;
            border-left: 4px solid;
        }}
        
        .alert-info {{
            background: #dbeafe;
            border-color: #3b82f6;
            color: #1e40af;
        }}
        
        .alert-warning {{
            background: #fef3c7;
            border-color: #f59e0b;
            color: #92400e;
        }}
        
        .alert-success {{
            background: #d1fae5;
            border-color: #10b981;
            color: #065f46;
        }}
        
        code {{
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #dc2626;
        }}
        
        pre {{
            background: #1e293b;
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
        }}
        
        pre code {{
            background: transparent;
            color: #e2e8f0;
            padding: 0;
        }}
        
        blockquote {{
            border-left: 4px solid #3b82f6;
            padding-left: 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #475569;
        }}
        
        .badge {{
            display: inline-block;
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin: 0.2rem;
        }}
        
        .badge-primary {{
            background: #3b82f6;
            color: white;
        }}
        
        .badge-success {{
            background: #10b981;
            color: white;
        }}
        
        .badge-warning {{
            background: #f59e0b;
            color: white;
        }}
        
        img {{
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}
        
        /* Footer */
        .footer {{
            text-align: center;
            padding: 2rem;
            background: #f8fafc;
            margin-top: 4rem;
            border-top: 2px solid #e2e8f0;
        }}
    </style>
</head>
<body>
    <!-- Portada -->
    <div class="cover-page no-print">
        <div class="icon">
            <i class="fas fa-calculator"></i>
        </div>
        <h1>Dossier Matemática Media</h1>
        <p class="subtitle">7° básico a 4° medio</p>
        <div class="metadata">
            <p><strong>ECEP 2025</strong></p>
            <p>Examen de Conocimientos Específicos Pedagógicos</p>
            <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.8;">
                Generado el {__import__('datetime').datetime.now().strftime('%d de %B de %Y')}
            </p>
        </div>
    </div>
    
    <!-- Contenido Principal -->
    <div class="page-break"></div>
    <div class="content-wrapper">
        {contenido_limpio}
    </div>
    
    <!-- Footer -->
    <div class="footer no-print">
        <p><strong>Dossier Matemática Media - ECEP 2025</strong></p>
        <p>© 2025 Profe Francisco Pancho | www.profefranciscopancho.com</p>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>"""
    
    return html

def main():
    print("🔢 Generando PDF del Dossier de Matemática Media...")
    print("=" * 70)
    
    # Ruta del archivo
    archivo = Path("evaluaciones/educacion-media/estudio/matematica-media-67/index.njk")
    
    if not archivo.exists():
        print(f"❌ Error: No se encontró el archivo {archivo}")
        return
    
    print(f"📁 Procesando: {archivo}")
    
    # Generar HTML
    html_completo = generar_html_completo(archivo)
    
    # Guardar HTML
    output_html = "DOSSIER_MATEMATICA_MEDIA_COMPLETO.html"
    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html_completo)
    
    print(f"✅ HTML generado: {output_html}")
    print(f"📊 Tamaño: {len(html_completo):,} caracteres")
    
    print("\n" + "=" * 70)
    print("✅ PROCESO COMPLETADO")
    print("\n📋 PRÓXIMO PASO:")
    print("   1. Abre el archivo HTML en tu navegador")
    print("   2. Usa Ctrl+P (o Cmd+P en Mac)")
    print("   3. Selecciona 'Guardar como PDF'")
    print(f"   4. Guarda en: dossieres-pdf/DOSSIER_MATEMATICA_MEDIA.pdf")

if __name__ == "__main__":
    main()
