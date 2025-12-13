"""
Script para extraer texto e imágenes del PDF de Inglés 2023
"""

import fitz  # PyMuPDF
import os
from PIL import Image
import io

# Configuración
pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\ingles-media\EM-I(23) (2).pdf"
output_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\ingles-media\ingles-2023-imagenes"
text_output = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\ingles-media\ingles_2023_text.txt"

# Crear directorio de salida
os.makedirs(output_dir, exist_ok=True)

# Abrir PDF
doc = fitz.open(pdf_path)

print(f"📄 PDF abierto: {doc.page_count} páginas")

# Extraer texto
with open(text_output, 'w', encoding='utf-8') as f:
    for page_num in range(doc.page_count):
        page = doc[page_num]
        text = page.get_text()
        f.write(f"\n{'='*50}\n")
        f.write(f"PÁGINA {page_num + 1}\n")
        f.write(f"{'='*50}\n")
        f.write(text)

print(f"✅ Texto extraído a: {text_output}")

# Extraer cada página como imagen
for page_num in range(doc.page_count):
    page = doc[page_num]
    
    # Renderizar a alta resolución
    zoom = 2.5
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    
    # Convertir a imagen PIL
    img_data = pix.tobytes("png")
    img = Image.open(io.BytesIO(img_data))
    
    # Guardar
    output_path = os.path.join(output_dir, f"ingles_2023_p{page_num + 1:02d}.png")
    img.save(output_path, "PNG")
    print(f"✅ Página {page_num + 1} guardada")

doc.close()

# Contar imágenes creadas
imagenes_creadas = len([f for f in os.listdir(output_dir) if f.endswith('.png')])
print(f"\n🎉 ¡Listo! Se crearon {imagenes_creadas} imágenes de páginas")
print(f"📁 Guardadas en: {output_dir}")
