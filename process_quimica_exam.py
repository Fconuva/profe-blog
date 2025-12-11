import fitz
import os
import json

pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\EM-Q(23) (1) (1).pdf"
images_output_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\quimica-2023-imagenes"
text_output_file = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\quimica_2023_text.txt"

os.makedirs(images_output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
full_text = ""

print(f"Processing {pdf_path}...")

for page_num, page in enumerate(doc):
    # Extract Text
    text = page.get_text()
    full_text += f"--- Page {page_num + 1} ---\n{text}\n"

    # Extract Images
    image_list = page.get_images(full=True)
    for img_index, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        image_filename = f"quimica_2023_p{page_num + 1}_{img_index + 1}.{image_ext}"
        image_path = os.path.join(images_output_dir, image_filename)
        
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        print(f"Saved image: {image_filename}")

with open(text_output_file, "w", encoding="utf-8") as f:
    f.write(full_text)

print(f"Text saved to {text_output_file}")
