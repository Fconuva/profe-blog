# -*- coding: utf-8 -*-
import fitz  # PyMuPDF
import os
from pathlib import Path

pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\estudio\ciencias-naturales-media\biologia\Corrección Biología Francisco Nuñez.pdf"
output_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\imagenes\ciencias-naturales\biologia\correccion"

# Crear directorio de salida
os.makedirs(output_dir, exist_ok=True)

# Abrir PDF
pdf_document = fitz.open(pdf_path)

print(f"Total de páginas: {len(pdf_document)}")
print(f"Extrayendo imágenes a: {output_dir}\n")

image_count = 0

for page_num in range(len(pdf_document)):
    page = pdf_document[page_num]
    image_list = page.get_images(full=True)
    
    if image_list:
        print(f"\n📄 Página {page_num + 1}: {len(image_list)} imagen(es) encontrada(s)")
    
    for img_index, img in enumerate(image_list):
        xref = img[0]
        base_image = pdf_document.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        image_count += 1
        image_filename = f"biologia_correccion_pag{page_num + 1}_img{img_index + 1}.{image_ext}"
        image_path = os.path.join(output_dir, image_filename)
        
        with open(image_path, "wb") as image_file:
            image_file.write(image_bytes)
        
        # Mostrar info
        print(f"  ✅ {image_filename}")
        print(f"     - Tamaño: {len(image_bytes)} bytes")
        print(f"     - Formato: {image_ext}")
        print(f"     - Dimensiones: {base_image['width']}x{base_image['height']}")

pdf_document.close()

print(f"\n🎉 Extracción completada: {image_count} imágenes guardadas en {output_dir}")
