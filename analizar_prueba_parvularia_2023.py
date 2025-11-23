#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analizar Prueba Parvularia EP 2023
Extrae preguntas, imágenes y analiza la estructura para mejorar nuestra prueba actual
"""

import PyPDF2
import re
import json
from pathlib import Path

def extraer_texto_pdf(pdf_path):
    """Extrae todo el texto del PDF"""
    texto_completo = []
    
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        print(f"Total de páginas: {len(pdf_reader.pages)}")
        
        for i, page in enumerate(pdf_reader.pages):
            texto = page.extract_text()
            texto_completo.append({
                'pagina': i + 1,
                'texto': texto
            })
            print(f"Página {i+1} extraída: {len(texto)} caracteres")
    
    return texto_completo

def analizar_estructura_preguntas(texto_completo):
    """Analiza la estructura de las preguntas"""
    
    analisis = {
        'total_preguntas': 0,
        'preguntas_con_imagen': 0,
        'preguntas_con_texto_base': 0,
        'longitud_promedio_pregunta': 0,
        'longitud_promedio_alternativas': 0,
        'distribucion_por_nucleo': {},
        'distribucion_respuestas_correctas': {'A': 0, 'B': 0, 'C': 0, 'D': 0},
        'nivel_dificultad': {},
        'preguntas_extraidas': []
    }
    
    texto_total = '\n'.join([p['texto'] for p in texto_completo])
    
    # Buscar patrones de preguntas (números seguidos de texto)
    patron_pregunta = r'(\d+)\.\s+(.+?)(?=\d+\.\s+|$)'
    preguntas_encontradas = re.findall(patron_pregunta, texto_total, re.DOTALL)
    
    analisis['total_preguntas'] = len(preguntas_encontradas)
    
    # Buscar referencias a imágenes
    patron_imagen = r'(?:imagen|figura|ilustración|gráfico|tabla|observ[ae]|analice la siguiente)'
    for num, texto in preguntas_encontradas:
        if re.search(patron_imagen, texto, re.IGNORECASE):
            analisis['preguntas_con_imagen'] += 1
    
    # Buscar textos base / contextos pedagógicos
    patron_contexto = r'(?:contexto|situación|caso|un\(a\) educador\(a\)|docente|profesora)'
    for num, texto in preguntas_encontradas:
        if re.search(patron_contexto, texto, re.IGNORECASE):
            analisis['preguntas_con_texto_base'] += 1
    
    print(f"\n📊 ANÁLISIS PRELIMINAR:")
    print(f"Total preguntas encontradas: {analisis['total_preguntas']}")
    print(f"Preguntas con imagen: {analisis['preguntas_con_imagen']}")
    print(f"Preguntas con contexto pedagógico: {analisis['preguntas_con_texto_base']}")
    
    return analisis, texto_total

def extraer_preguntas_detalladas(texto_total):
    """Extrae preguntas con más detalle"""
    preguntas = []
    
    # Patrón mejorado para capturar preguntas con alternativas
    patron = r'(\d+)\.\s+(.+?)(?:A\)|a\))(.+?)(?:B\)|b\))(.+?)(?:C\)|c\))(.+?)(?:D\)|d\))(.+?)(?=\d+\.\s+|$)'
    
    matches = re.findall(patron, texto_total, re.DOTALL)
    
    for match in matches:
        num, enunciado, alt_a, alt_b, alt_c, alt_d = match
        
        pregunta = {
            'numero': int(num.strip()),
            'enunciado': enunciado.strip(),
            'alternativas': [
                alt_a.strip()[:200],  # Limitar longitud para análisis
                alt_b.strip()[:200],
                alt_c.strip()[:200],
                alt_d.strip()[:200]
            ],
            'tiene_imagen': bool(re.search(r'imagen|figura|observ[ae]|analice', enunciado, re.IGNORECASE)),
            'tiene_contexto': bool(re.search(r'contexto|situación|caso|educador|docente', enunciado, re.IGNORECASE)),
            'longitud_enunciado': len(enunciado.strip()),
            'longitud_promedio_alternativa': sum(len(alt.strip()) for alt in [alt_a, alt_b, alt_c, alt_d]) / 4
        }
        
        preguntas.append(pregunta)
    
    return preguntas

def main():
    pdf_path = Path('evaluaciones/educacion-parvularia/pruebas/EP 2023-salida.pdf')
    
    if not pdf_path.exists():
        print(f"❌ No se encuentra el archivo: {pdf_path}")
        return
    
    print("🔍 Analizando EP 2023-salida.pdf...")
    print("=" * 60)
    
    # Extraer texto
    texto_completo = extraer_texto_pdf(pdf_path)
    
    # Analizar estructura
    analisis, texto_total = analizar_estructura_preguntas(texto_completo)
    
    # Extraer preguntas detalladas
    preguntas = extraer_preguntas_detalladas(texto_total)
    
    print(f"\n✅ Preguntas detalladas extraídas: {len(preguntas)}")
    
    # Guardar análisis
    resultado = {
        'metadata': {
            'archivo_origen': 'EP 2023-salida.pdf',
            'total_paginas': len(texto_completo),
            'total_preguntas': len(preguntas)
        },
        'analisis_estadistico': {
            'preguntas_con_imagen': sum(1 for p in preguntas if p['tiene_imagen']),
            'preguntas_con_contexto': sum(1 for p in preguntas if p['tiene_contexto']),
            'longitud_promedio_enunciado': sum(p['longitud_enunciado'] for p in preguntas) / len(preguntas) if preguntas else 0,
            'longitud_promedio_alternativas': sum(p['longitud_promedio_alternativa'] for p in preguntas) / len(preguntas) if preguntas else 0
        },
        'preguntas': preguntas[:10],  # Guardar solo las primeras 10 como muestra
        'texto_completo_primeras_paginas': [p['texto'][:500] for p in texto_completo[:5]]
    }
    
    # Guardar resultado
    output_path = Path('analisis_ep_2023.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Análisis guardado en: {output_path}")
    
    # Mostrar resumen
    print("\n" + "=" * 60)
    print("📋 RESUMEN DEL ANÁLISIS")
    print("=" * 60)
    print(f"Total preguntas: {len(preguntas)}")
    print(f"Preguntas con imagen: {sum(1 for p in preguntas if p['tiene_imagen'])} ({sum(1 for p in preguntas if p['tiene_imagen'])/len(preguntas)*100:.1f}%)")
    print(f"Preguntas con contexto: {sum(1 for p in preguntas if p['tiene_contexto'])} ({sum(1 for p in preguntas if p['tiene_contexto'])/len(preguntas)*100:.1f}%)")
    print(f"Longitud promedio enunciado: {sum(p['longitud_enunciado'] for p in preguntas) / len(preguntas):.0f} caracteres")
    print(f"Longitud promedio alternativa: {sum(p['longitud_promedio_alternativa'] for p in preguntas) / len(preguntas):.0f} caracteres")
    
    # Mostrar primeras 3 preguntas como ejemplo
    print("\n" + "=" * 60)
    print("📝 MUESTRA DE PREGUNTAS (primeras 3)")
    print("=" * 60)
    for i, p in enumerate(preguntas[:3], 1):
        print(f"\nPregunta {p['numero']}:")
        print(f"Enunciado: {p['enunciado'][:150]}...")
        print(f"Tiene imagen: {'✓' if p['tiene_imagen'] else '✗'}")
        print(f"Tiene contexto: {'✓' if p['tiene_contexto'] else '✗'}")
        print(f"Longitud: {p['longitud_enunciado']} caracteres")

if __name__ == '__main__':
    main()
