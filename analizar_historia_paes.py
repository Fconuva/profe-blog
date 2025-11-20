import PyPDF2
import json
import re

# Abrir el PDF
pdf_path = r"evaluaciones\educacion-media\pruebas\EM-H(23)-salida (1).pdf"

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    
    # Extraer todo el texto
    full_text = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        full_text += f"\n\n--- PÁGINA {page_num + 1} ---\n\n"
        full_text += page.extract_text()
    
    # Guardar el texto completo
    with open("historia_paes_2023_texto_completo.txt", "w", encoding="utf-8") as f:
        f.write(full_text)
    
    print(f"✓ PDF extraído: {len(pdf_reader.pages)} páginas")
    print(f"✓ Longitud total del texto: {len(full_text)} caracteres")
    print("\n" + "="*80)
    print("PRIMERAS 3000 CARACTERES DEL CONTENIDO:")
    print("="*80)
    print(full_text[:3000])
