import fitz  # PyMuPDF

# Ruta del PDF de Física
pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\EM-F(23) (1) (1).pdf"
output_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\fisica_2023_text.txt"

# Abrir el PDF
doc = fitz.open(pdf_path)

print(f"PDF abierto: {pdf_path}")
print(f"Total de páginas: {len(doc)}")

full_text = ""

# Iterar por cada página
for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text()
    full_text += f"\n{'='*50}\nPÁGINA {page_num + 1}\n{'='*50}\n{text}"

doc.close()

# Guardar el texto completo
with open(output_path, "w", encoding="utf-8") as f:
    f.write(full_text)

print(f"Texto extraído y guardado en: {output_path}")
