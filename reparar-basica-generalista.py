#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de reparación para basica-generalista.njk
Elimina duplicados y reorganiza el contenido correctamente
"""

import re

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-basica\estudio\basica-generalista.njk"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Encontrar secciones duplicadas
# Patrón: buscar "<!-- INTRODUCCIÓN -->" que aparece fuera de lugar
intro_pattern = r'</div>\n<!-- Fin DOMINIO 1 -->\n\n<!-- INTRODUCCIÓN \(movida al inicio si es necesario\) -->\n<div class="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-6xl mx-auto">.*?</div>\n</div>\n\n<!-- ==================== DOMINIO 2:'

# Buscar la sección de introducción mal ubicada
if '<!-- INTRODUCCIÓN (movida al inicio si es necesario) -->' in contenido:
    # Encontrar el inicio de DOMINIO 2
    dom2_start = contenido.find('<!-- ==================== DOMINIO 2: MATEMÁTICA ====================')
    
    # Encontrar el final de DOMINIO 1 (antes de la introducción mal ubicada)
    dom1_end_marker = '<!-- Fin DOMINIO 1 -->'
    dom1_end = contenido.find(dom1_end_marker)
    
    if dom1_end != -1 and dom2_start != -1:
        # Eliminar la sección de introducción mal ubicada (entre dom1_end y dom2_start)
        parte1 = contenido[:dom1_end + len(dom1_end_marker)]
        parte2 = contenido[dom2_start:]
        
        contenido_limpio = parte1 + '\n\n' + parte2
        
        with open(archivo, 'w', encoding='utf-8') as f:
            f.write(contenido_limpio)
        
        print("✅ Archivo reparado exitosamente")
        print(f"📊 Eliminada sección de introducción duplicada")
        print(f"📏 Longitud original: {len(contenido)} caracteres")
        print(f"📏 Longitud nueva: {len(contenido_limpio)} caracteres")
    else:
        print("⚠️ No se encontraron los marcadores esperados")
        print(f"dom1_end: {dom1_end}, dom2_start: {dom2_start}")
else:
    print("ℹ️ No se encontró contenido duplicado para eliminar")
