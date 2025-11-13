import PyPDF2
import sys

pdf_path = r'c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\temarios\Ed_Media_Cientifico_Humanista_Educacion_Fisica_y_Salud.pdf'

with open(pdf_path, 'rb') as pdf_file:
    reader = PyPDF2.PdfReader(pdf_file)
    total_pages = len(reader.pages)
    print(f"Total pages: {total_pages}\n")
    
    # Extract all pages to see full temario
    for i in range(min(total_pages, 20)):
        print(f"\n{'='*80}")
        print(f"PAGE {i+1}")
        print('='*80)
        text = reader.pages[i].extract_text()
        print(text)
