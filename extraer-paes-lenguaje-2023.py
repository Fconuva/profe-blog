"""
Extractor especializado para PAES Lenguaje 2023
Extrae textos, preguntas y estructura para crear dossiers
"""

import PyPDF2
import json
import re
from pathlib import Path
from datetime import datetime

def extraer_texto_paes_lenguaje(pdf_path):
    """Extrae texto completo del PDF PAES Lenguaje 2023"""
    print(f"\n{'='*80}")
    print(f"📚 EXTRAYENDO PAES LENGUAJE 2023")
    print(f"{'='*80}\n")
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            total_paginas = len(pdf_reader.pages)
            
            print(f"📄 Total de páginas: {total_paginas}")
            print(f"🔍 Extrayendo contenido...\n")
            
            texto_completo = []
            
            for i, page in enumerate(pdf_reader.pages, 1):
                texto = page.extract_text()
                texto_completo.append(texto)
                
                # Mostrar progreso cada 5 páginas
                if i % 5 == 0:
                    print(f"   Procesadas: {i}/{total_paginas} páginas")
            
            print(f"\n✅ Extracción completada")
            return "\n\n".join(texto_completo)
    
    except Exception as e:
        print(f"❌ Error al leer PDF: {e}")
        return None

def identificar_textos_base(texto):
    """Identifica los textos literarios y no literarios base"""
    print(f"\n{'='*80}")
    print(f"📖 IDENTIFICANDO TEXTOS BASE")
    print(f"{'='*80}\n")
    
    textos = []
    
    # Patrones para detectar inicio de textos
    patrones = [
        r'TEXTO\s+\d+',
        r'Fragmento\s+\d+',
        r'Lea\s+el\s+siguiente\s+texto',
        r'A\s+continuación\s+se\s+presenta',
    ]
    
    # Buscar textos
    for patron in patrones:
        matches = re.finditer(patron, texto, re.IGNORECASE)
        for match in matches:
            inicio = match.start()
            # Extraer contexto (500 caracteres)
            contexto = texto[inicio:inicio+500]
            textos.append({
                'patron': patron,
                'posicion': inicio,
                'contexto': contexto
            })
    
    print(f"✅ Textos base encontrados: {len(textos)}")
    for i, t in enumerate(textos[:5], 1):
        print(f"\n--- Texto {i} ---")
        print(f"Patrón: {t['patron']}")
        print(f"Contexto: {t['contexto'][:200]}...")
    
    return textos

def identificar_dominios(texto):
    """Identifica las secciones por dominio en la prueba"""
    print(f"\n{'='*80}")
    print(f"🎯 IDENTIFICANDO DOMINIOS Y SECCIONES")
    print(f"{'='*80}\n")
    
    dominios = {
        'lectura_literaria': [],
        'lectura_no_literaria': [],
        'coherencia_cohesion': [],
        'adecuacion_comunicativa': [],
        'ensenanza_aprendizaje': []
    }
    
    # Patrones de dominio
    patrones_dominio = {
        'lectura_literaria': [
            r'texto\s+literario',
            r'narrativo',
            r'poema',
            r'fragmento.*?novela',
            r'cuento',
            r'obra\s+dramática'
        ],
        'lectura_no_literaria': [
            r'artículo',
            r'texto\s+argumentativo',
            r'discurso',
            r'ensayo',
            r'editorial'
        ],
        'coherencia_cohesion': [
            r'conector',
            r'cohesión',
            r'coherencia',
            r'progresión\s+temática'
        ],
        'adecuacion_comunicativa': [
            r'ortografía',
            r'acentuación',
            r'puntuación',
            r'mayúsculas'
        ],
        'ensenanza_aprendizaje': [
            r'estrategia.*?enseñanza',
            r'planificación',
            r'evaluación.*?aprendizaje',
            r'objetivo.*?aprendizaje'
        ]
    }
    
    for dominio, patrones in patrones_dominio.items():
        for patron in patrones:
            matches = re.finditer(patron, texto, re.IGNORECASE)
            for match in matches:
                dominios[dominio].append({
                    'patron': patron,
                    'posicion': match.start(),
                    'contexto': texto[match.start():match.start()+200]
                })
    
    print("📊 Resumen por dominio:")
    for dominio, resultados in dominios.items():
        print(f"   {dominio}: {len(resultados)} menciones")
    
    return dominios

def extraer_preguntas(texto):
    """Extrae preguntas individuales con sus alternativas"""
    print(f"\n{'='*80}")
    print(f"❓ EXTRAYENDO PREGUNTAS")
    print(f"{'='*80}\n")
    
    preguntas = []
    
    # Patrón para detectar preguntas numeradas
    patron_pregunta = r'(?:^|\n)(\d+)[\.\)]\s+(.*?)(?=\n\d+[\.\)]|\nA[\)\.]|\Z)'
    
    matches = re.finditer(patron_pregunta, texto, re.DOTALL)
    
    for match in matches:
        numero = match.group(1)
        enunciado = match.group(2).strip()
        
        # Buscar alternativas después del enunciado
        posicion_fin = match.end()
        texto_alternativas = texto[posicion_fin:posicion_fin+1000]
        
        patron_alternativas = r'\n([A-D])[\)\.]]\s+(.*?)(?=\n[A-D][\)\.]|\n\d+[\.\)]|\Z)'
        alternativas_matches = re.finditer(patron_alternativas, texto_alternativas, re.DOTALL)
        
        alternativas = []
        for alt_match in alternativas_matches:
            letra = alt_match.group(1)
            contenido = alt_match.group(2).strip()
            alternativas.append({
                'letra': letra,
                'contenido': contenido
            })
        
        if alternativas:
            preguntas.append({
                'numero': int(numero),
                'enunciado': enunciado,
                'alternativas': alternativas
            })
    
    print(f"✅ Preguntas extraídas: {len(preguntas)}")
    
    # Mostrar primeras 3 preguntas
    for p in preguntas[:3]:
        print(f"\n--- Pregunta {p['numero']} ---")
        print(f"Enunciado: {p['enunciado'][:150]}...")
        print(f"Alternativas: {len(p['alternativas'])}")
    
    return preguntas

def analizar_figuras_literarias(texto):
    """Identifica menciones de figuras literarias en el examen"""
    print(f"\n{'='*80}")
    print(f"🎨 ANALIZANDO FIGURAS LITERARIAS MENCIONADAS")
    print(f"{'='*80}\n")
    
    figuras = {
        'fónicas': ['aliteración', 'onomatopeya', 'paronomasia'],
        'sintácticas': ['hipérbaton', 'anáfora', 'polisíndeton', 'asíndeton', 'elipsis'],
        'semánticas': ['metáfora', 'metonimia', 'sinécdoque', 'ironía', 'hipérbole', 
                       'personificación', 'símil', 'antítesis', 'paradoja']
    }
    
    resultados = {}
    
    for categoria, lista_figuras in figuras.items():
        resultados[categoria] = {}
        for figura in lista_figuras:
            patron = r'\b' + figura + r'\b'
            matches = re.finditer(patron, texto, re.IGNORECASE)
            count = len(list(matches))
            if count > 0:
                resultados[categoria][figura] = count
    
    print("📊 Figuras literarias encontradas:")
    for categoria, figuras_encontradas in resultados.items():
        if figuras_encontradas:
            print(f"\n{categoria.upper()}:")
            for figura, count in figuras_encontradas.items():
                print(f"   - {figura}: {count} veces")
    
    return resultados

def generar_informe_json(datos, output_path):
    """Genera un JSON con todos los datos extraídos"""
    informe = {
        'metadata': {
            'archivo': 'EM-L(23).pdf',
            'tipo': 'PAES Lenguaje 2023',
            'fecha_extraccion': datetime.now().isoformat(),
            'total_preguntas': len(datos.get('preguntas', []))
        },
        'textos_base': datos.get('textos', []),
        'dominios': datos.get('dominios', {}),
        'preguntas': datos.get('preguntas', []),
        'figuras_literarias': datos.get('figuras', {})
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(informe, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 Informe JSON guardado en: {output_path.name}")

def main():
    """Función principal"""
    pdf_path = Path(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\EM-L(23).pdf")
    
    if not pdf_path.exists():
        print(f"❌ Archivo no encontrado: {pdf_path}")
        return
    
    # Extraer texto
    texto = extraer_texto_paes_lenguaje(pdf_path)
    
    if not texto:
        print("❌ No se pudo extraer texto del PDF")
        return
    
    # Guardar texto completo
    texto_output = pdf_path.parent / "EM-L-2023_texto_completo.txt"
    with open(texto_output, 'w', encoding='utf-8') as f:
        f.write(texto)
    print(f"\n💾 Texto completo guardado en: {texto_output.name}")
    
    # Análisis
    datos = {}
    datos['textos'] = identificar_textos_base(texto)
    datos['dominios'] = identificar_dominios(texto)
    datos['preguntas'] = extraer_preguntas(texto)
    datos['figuras'] = analizar_figuras_literarias(texto)
    
    # Generar informe JSON
    json_output = pdf_path.parent / "EM-L-2023_analisis.json"
    generar_informe_json(datos, json_output)
    
    print(f"\n{'='*80}")
    print(f"✅ EXTRACCIÓN COMPLETADA")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
