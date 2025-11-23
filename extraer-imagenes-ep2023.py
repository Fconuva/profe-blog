"""
Script para extraer imágenes del PDF EP 2023-salida.pdf
Extrae, clasifica y optimiza las imágenes para uso en el examen web
"""

import fitz  # PyMuPDF
import os
from PIL import Image
import io

# Configuración
PDF_PATH = "evaluaciones/educacion-parvularia/pruebas/EP 2023-salida.pdf"
OUTPUT_DIR = "evaluaciones/educacion-parvularia/pruebas/parv-nt/imagenes"
THUMBNAIL_DIR = os.path.join(OUTPUT_DIR, "thumbnails")

# Crear directorios si no existen
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(THUMBNAIL_DIR, exist_ok=True)

print("=" * 60)
print("EXTRACCIÓN DE IMÁGENES - EXAMEN PARVULARIA EP 2023")
print("=" * 60)

# Abrir PDF
try:
    pdf_document = fitz.open(PDF_PATH)
    total_pages = pdf_document.page_count
    print(f"\n📄 PDF abierto correctamente")
    print(f"   Total de páginas: {total_pages}")
except Exception as e:
    print(f"❌ Error al abrir PDF: {e}")
    exit(1)

# Contador de imágenes
image_count = 0
images_by_page = {}

print(f"\n🔍 Extrayendo imágenes...\n")

# Extraer imágenes de cada página
for page_num in range(total_pages):
    page = pdf_document[page_num]
    image_list = page.get_images(full=True)
    
    if image_list:
        images_by_page[page_num + 1] = len(image_list)
        print(f"   Página {page_num + 1}: {len(image_list)} imagen(es)")
        
        for img_index, img in enumerate(image_list):
            try:
                # Obtener referencia de imagen
                xref = img[0]
                
                # Extraer imagen
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Nombre del archivo
                image_name = f"ep2023_p{page_num + 1:03d}_img{img_index + 1:02d}.{image_ext}"
                image_path = os.path.join(OUTPUT_DIR, image_name)
                
                # Guardar imagen original
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)
                
                # Crear thumbnail (versión pequeña para preview)
                try:
                    img_pil = Image.open(io.BytesIO(image_bytes))
                    
                    # Crear thumbnail de 300px de ancho manteniendo aspecto
                    img_pil.thumbnail((300, 300), Image.Resampling.LANCZOS)
                    
                    thumbnail_name = f"thumb_{image_name.replace(image_ext, 'webp')}"
                    thumbnail_path = os.path.join(THUMBNAIL_DIR, thumbnail_name)
                    
                    img_pil.save(thumbnail_path, "WEBP", quality=85, optimize=True)
                    
                except Exception as thumb_error:
                    print(f"      ⚠ No se pudo crear thumbnail: {thumb_error}")
                
                image_count += 1
                print(f"      ✓ {image_name} ({base_image['width']}x{base_image['height']}px)")
                
            except Exception as e:
                print(f"      ✗ Error en imagen {img_index + 1}: {e}")

pdf_document.close()

# Resumen
print("\n" + "=" * 60)
print("RESUMEN DE EXTRACCIÓN")
print("=" * 60)
print(f"✅ Total de imágenes extraídas: {image_count}")
print(f"📁 Guardadas en: {OUTPUT_DIR}")
print(f"🖼️  Thumbnails en: {THUMBNAIL_DIR}")
print(f"\n📊 Distribución por página:")

for page, count in sorted(images_by_page.items()):
    print(f"   Página {page}: {count} imagen(es)")

print("\n" + "=" * 60)
print("SIGUIENTE PASO:")
print("=" * 60)
print("1. Revisar las imágenes extraídas")
print("2. Clasificarlas por núcleo de aprendizaje")
print("3. Renombrar descriptivamente (ej: identidad-autonomia-001.jpg)")
print("4. Integrarlas en las preguntas correspondientes")
print("\n✨ ¡Extracción completada!")
