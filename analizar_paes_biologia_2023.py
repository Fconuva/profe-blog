import fitz  # PyMuPDF
from PIL import Image
import io
import os

# Ruta del PDF
pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\EM-B(23)-salida.pdf"

# Crear carpeta para imágenes
output_folder = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\paes-biologia-2023-imagenes"
os.makedirs(output_folder, exist_ok=True)

# Abrir PDF
doc = fitz.open(pdf_path)

# Contador de imágenes
img_count = 0

# Recorrer todas las páginas
for page_num in range(len(doc)):
    page = doc[page_num]
    
    # Extraer imágenes de la página
    image_list = page.get_images(full=True)
    
    print(f"\n=== PÁGINA {page_num + 1} ===")
    print(f"Número de imágenes encontradas: {len(image_list)}")
    
    # Extraer texto de la página para contexto
    text = page.get_text()
    
    # Buscar número de pregunta en el texto
    pregunta_num = None
    for line in text.split('\n'):
        if line.strip().endswith('.-'):
            try:
                pregunta_num = line.strip().replace('.-', '')
                break
            except:
                pass
    
    # Guardar cada imagen
    for img_index, img_info in enumerate(image_list):
        xref = img_info[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        img_count += 1
        
        # Nombre del archivo
        if pregunta_num:
            filename = f"pregunta_{pregunta_num}_img_{img_index + 1}.{image_ext}"
        else:
            filename = f"pagina_{page_num + 1}_img_{img_index + 1}.{image_ext}"
        
        filepath = os.path.join(output_folder, filename)
        
        # Guardar imagen
        with open(filepath, "wb") as img_file:
            img_file.write(image_bytes)
        
        print(f"  ✓ Guardada: {filename} ({base_image['width']}x{base_image['height']} px)")

print(f"\n{'='*60}")
print(f"TOTAL IMÁGENES EXTRAÍDAS: {img_count}")
print(f"Carpeta destino: {output_folder}")

doc.close()
