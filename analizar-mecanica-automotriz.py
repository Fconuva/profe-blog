#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Análisis de PDFs para Mecánica Automotriz EMTP
"""

import PyPDF2
import json

print("=" * 80)
print("ANÁLISIS: MECÁNICA AUTOMOTRIZ - EDUCACIÓN MEDIA TÉCNICO PROFESIONAL")
print("=" * 80)

# 1. Analizar PDF de Prueba 2023
print("\n📄 1. PRUEBA MECÁNICA AUTOMOTRIZ 2023")
print("-" * 80)

try:
    with open('evaluaciones/educacion-media-tecnico-profesional/pruebas/EMTP-MEC_AUTO(23).pdf', 'rb') as f:
        pdf_prueba = PyPDF2.PdfReader(f)
        total_paginas_prueba = len(pdf_prueba.pages)
        print(f"✅ Total de páginas: {total_paginas_prueba}")
        
        # Extraer primeras 5 páginas
        texto_prueba = ""
        for i in range(min(5, total_paginas_prueba)):
            texto_prueba += pdf_prueba.pages[i].extract_text() + "\n"
        
        print(f"\n📋 Primeras 2000 caracteres del contenido:")
        print(texto_prueba[:2000])
        
        # Guardar texto completo
        texto_completo = ""
        for page in pdf_prueba.pages:
            texto_completo += page.extract_text() + "\n"
        
        with open('EMTP-MEC_AUTO-2023-texto.txt', 'w', encoding='utf-8') as out:
            out.write(texto_completo)
        print(f"\n✅ Texto completo guardado en: EMTP-MEC_AUTO-2023-texto.txt")
        
except Exception as e:
    print(f"❌ Error al leer prueba: {e}")

# 2. Analizar PDF de Temario
print("\n" + "=" * 80)
print("📚 2. TEMARIO MECÁNICA AUTOMOTRIZ")
print("-" * 80)

try:
    with open('evaluaciones/educacion-media-tecnico-profesional/temarios/Ed_Media_Tecnico_Profesional_Mecanica_Automotriz.pdf', 'rb') as f:
        pdf_temario = PyPDF2.PdfReader(f)
        total_paginas_temario = len(pdf_temario.pages)
        print(f"✅ Total de páginas: {total_paginas_temario}")
        
        # Extraer primeras 3 páginas
        texto_temario = ""
        for i in range(min(3, total_paginas_temario)):
            texto_temario += pdf_temario.pages[i].extract_text() + "\n"
        
        print(f"\n📋 Primeras 2000 caracteres del temario:")
        print(texto_temario[:2000])
        
        # Guardar texto completo
        texto_completo_temario = ""
        for page in pdf_temario.pages:
            texto_completo_temario += page.extract_text() + "\n"
        
        with open('EMTP-MEC_AUTO-temario.txt', 'w', encoding='utf-8') as out:
            out.write(texto_completo_temario)
        print(f"\n✅ Temario completo guardado en: EMTP-MEC_AUTO-temario.txt")
        
except Exception as e:
    print(f"❌ Error al leer temario: {e}")

# 3. Analizar PDF General de Mecánica Automotriz
print("\n" + "=" * 80)
print("📘 3. DOCUMENTO GENERAL MECÁNICA AUTOMOTRIZ")
print("-" * 80)

try:
    with open('evaluaciones/educacion-media-tecnico-profesional/pruebas/Ed_Media_Tecnico_Profesional_Mecanica_Automotriz.pdf', 'rb') as f:
        pdf_general = PyPDF2.PdfReader(f)
        total_paginas_general = len(pdf_general.pages)
        print(f"✅ Total de páginas: {total_paginas_general}")
        
        # Extraer primeras 3 páginas
        texto_general = ""
        for i in range(min(3, total_paginas_general)):
            texto_general += pdf_general.pages[i].extract_text() + "\n"
        
        print(f"\n📋 Primeras 2000 caracteres:")
        print(texto_general[:2000])
        
        # Guardar texto completo
        texto_completo_general = ""
        for page in pdf_general.pages:
            texto_completo_general += page.extract_text() + "\n"
        
        with open('EMTP-MEC_AUTO-general.txt', 'w', encoding='utf-8') as out:
            out.write(texto_completo_general)
        print(f"\n✅ Documento general guardado en: EMTP-MEC_AUTO-general.txt")
        
except Exception as e:
    print(f"❌ Error al leer documento general: {e}")

print("\n" + "=" * 80)
print("✅ ANÁLISIS COMPLETADO")
print("=" * 80)
print("\n📁 Archivos generados:")
print("  - EMTP-MEC_AUTO-2023-texto.txt (Prueba 2023)")
print("  - EMTP-MEC_AUTO-temario.txt (Temario oficial)")
print("  - EMTP-MEC_AUTO-general.txt (Documento general)")
print("\n🎯 Siguiente paso: Revisar estos archivos para estructurar la prueba")
