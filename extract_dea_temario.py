import PyPDF2
import sys

pdf_path = r'c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-especial\temarios\Ed_Especial_Dificultades_Especificas_del_Aprendizaje.pdf'

with open(pdf_path, 'rb') as pdf_file:
    reader = PyPDF2.PdfReader(pdf_file)
    total_pages = len(reader.pages)
    print(f"Total pages: {total_pages}\n")
    
    # Extract all pages
    for i in range(min(total_pages, 15)):  # First 15 pages should cover the temario
        print(f"\n{'='*80}")
        print(f"PAGE {i+1}")
        print('='*80)
        text = reader.pages[i].extract_text()
        print(text)
