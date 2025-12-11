import fitz  # PyMuPDF
import os

# Ruta del PDF de Física
pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\EM-F(23) (1) (1).pdf"
output_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\fisica-2023-imagenes"

# Crear directorio si no existe
os.makedirs(output_dir, exist_ok=True)

# Abrir el PDF
doc = fitz.open(pdf_path)

print(f"PDF abierto: {pdf_path}")
print(f"Total de páginas: {len(doc)}")

image_count = 0

# Iterar por cada página
for page_num in range(len(doc)):
    page = doc[page_num]
    
    # Obtener lista de imágenes en la página
    image_list = page.get_images(full=True)
    
    print(f"\nPágina {page_num + 1}: {len(image_list)} imágenes encontradas")
    
    for img_index, img in enumerate(image_list):
        xref = img[0]
        
        try:
            # Extraer la imagen
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Guardar la imagen
            image_count += 1
            image_filename = f"fisica_2023_p{page_num + 1}_{img_index + 1}.{image_ext}"
            image_path = os.path.join(output_dir, image_filename)
            
            with open(image_path, "wb") as img_file:
                img_file.write(image_bytes)
            
            print(f"  Guardada: {image_filename}")
            
        except Exception as e:
            print(f"  Error extrayendo imagen {img_index}: {e}")

doc.close()

print(f"\n{'='*50}")
print(f"Total de imágenes extraídas: {image_count}")
print(f"Guardadas en: {output_dir}")
