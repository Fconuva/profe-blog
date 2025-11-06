"""
Extractor de texto de pruebas ECEP 2023 (PDF)
Analiza formato, estructura y estilo de preguntas oficiales
"""

import PyPDF2
import re
from pathlib import Path

def extraer_texto_pdf(pdf_path):
    """Extrae texto completo de un PDF"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            texto_completo = []
            
            print(f"\n{'='*60}")
            print(f"📄 Archivo: {pdf_path.name}")
            print(f"📊 Total de páginas: {len(pdf_reader.pages)}")
            print(f"{'='*60}\n")
            
            for i, page in enumerate(pdf_reader.pages, 1):
                texto = page.extract_text()
                texto_completo.append(texto)
                
                # Mostrar primeras 500 caracteres de cada página
                print(f"\n--- PÁGINA {i} ---")
                print(texto[:500] if len(texto) > 500 else texto)
                print("..." if len(texto) > 500 else "")
            
            return "\n\n".join(texto_completo)
    
    except Exception as e:
        print(f"❌ Error al leer {pdf_path.name}: {e}")
        return None

def analizar_estructura(texto, nombre_archivo):
    """Analiza patrones de preguntas y estructura"""
    print(f"\n{'='*60}")
    print(f"🔍 ANÁLISIS DE ESTRUCTURA: {nombre_archivo}")
    print(f"{'='*60}\n")
    
    # Buscar patrones de preguntas (números seguidos de punto o paréntesis)
    patrones_pregunta = [
        r'\n\d+[\.\)]\s+',  # "1. " o "1) "
        r'\nPregunta\s+\d+',  # "Pregunta 1"
        r'\nÍtem\s+\d+',  # "Ítem 1"
    ]
    
    preguntas_encontradas = []
    for patron in patrones_pregunta:
        matches = re.findall(patron, texto)
        if matches:
            preguntas_encontradas.extend(matches)
    
    print(f"✅ Preguntas detectadas: {len(preguntas_encontradas)}")
    
    # Buscar alternativas (A), B), C), D))
    alternativas = re.findall(r'\n[A-D][\)\.]', texto)
    print(f"✅ Alternativas detectadas: {len(alternativas)}")
    
    # Buscar secciones/dominios
    secciones = re.findall(r'(?:SECCIÓN|DOMINIO|PARTE|ÁREA)\s+[IVX\d]+', texto, re.IGNORECASE)
    print(f"✅ Secciones encontradas: {len(secciones)}")
    if secciones:
        for seccion in secciones[:5]:
            print(f"   - {seccion.strip()}")
    
    # Buscar instrucciones
    instrucciones = re.findall(r'(?:Instrucciones?|Indicaciones?).*?(?=\n\d+[\.\)]|\n[A-Z]+:|\Z)', 
                                texto, re.IGNORECASE | re.DOTALL)
    if instrucciones:
        print(f"\n📝 Instrucciones detectadas:")
        for inst in instrucciones[:2]:
            print(f"   {inst[:200]}...")
    
    print()

def main():
    """Procesar todos los PDFs de pruebas ECEP 2023"""
    
    # Directorio con las pruebas
    directorio = Path(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas")
    
    # PDFs a analizar
    pdfs_analizar = [
        "EM-M(23).pdf",  # Educación Media - Matemática
        "EM-L(23).pdf",  # Educación Media - Lenguaje
        "EM-H(23).pdf",  # Educación Media - Historia
        "EP 2023.pdf",   # Educación Parvularia
    ]
    
    print("🚀 EXTRACTOR DE PRUEBAS ECEP 2023")
    print("="*60)
    
    for pdf_nombre in pdfs_analizar:
        pdf_path = directorio / pdf_nombre
        
        if not pdf_path.exists():
            print(f"\n⚠️  Archivo no encontrado: {pdf_nombre}")
            continue
        
        # Extraer texto
        texto = extraer_texto_pdf(pdf_path)
        
        if texto:
            # Analizar estructura
            analizar_estructura(texto, pdf_nombre)
            
            # Guardar texto extraído
            output_path = directorio / f"{pdf_path.stem}_extracted.txt"
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(texto)
            
            print(f"💾 Texto guardado en: {output_path.name}\n")

if __name__ == "__main__":
    main()
