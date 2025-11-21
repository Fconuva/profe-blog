# -*- coding: utf-8 -*-
from PIL import Image
import os

image_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\imagenes\ciencias-naturales\biologia\correccion"

# Listar imágenes ordenadas por página
images = sorted([f for f in os.listdir(image_dir) if f.endswith(('.png', '.jpeg', '.jpg'))])

print("📋 IMÁGENES EXTRAÍDAS DEL PDF DE CORRECCIÓN\n")
print("="*80)

for i, img_name in enumerate(images, 1):
    img_path = os.path.join(image_dir, img_name)
    
    try:
        with Image.open(img_path) as img:
            width, height = img.size
            size_kb = os.path.getsize(img_path) / 1024
            
            # Extraer número de página del nombre
            page_num = img_name.split('_pag')[1].split('_')[0]
            
            print(f"\n{i}. {img_name}")
            print(f"   📄 Página: {page_num}")
            print(f"   📐 Dimensiones: {width}x{height}px")
            print(f"   💾 Tamaño: {size_kb:.1f} KB")
            print(f"   🔗 Para etiquetar como: ________________________________")
            
    except Exception as e:
        print(f"Error procesando {img_name}: {e}")

print("\n" + "="*80)
print(f"\n✅ Total: {len(images)} imágenes")
print("\nRECOMENDACIÓN: Revisa cada imagen manualmente y asigna etiquetas según su contenido:")
print("  - ciclo-celular-detallado.png")
print("  - mitosis-fases.png")
print("  - traduccion-ribosomas.jpeg")
print("  - codigo-genetico-tabla.png")
print("  - etc.")
