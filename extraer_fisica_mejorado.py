"""
Script mejorado para extraer imágenes de preguntas individuales del PDF de Física 2023.
Cada página puede tener 1 o 2 preguntas, y hay 60 preguntas en total.
"""

import fitz  # PyMuPDF
import os
from PIL import Image
import io

# Configuración
pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\EM-F(23) (1) (1).pdf"
output_dir = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\fisica-2023-imagenes-v2"

# Crear directorio de salida
os.makedirs(output_dir, exist_ok=True)

# Limpiar directorio anterior
for f in os.listdir(output_dir):
    os.remove(os.path.join(output_dir, f))

# Abrir PDF
doc = fitz.open(pdf_path)

print(f"📄 PDF abierto: {doc.page_count} páginas")

# Mapeo de preguntas por página (basado en análisis del texto)
# Formato: página -> lista de números de pregunta
preguntas_por_pagina = {
    1: [],  # Portada - sin preguntas
    2: [1, 2],    # Dos preguntas
    3: [3, 4],    # Dos preguntas
    4: [5],       # Una pregunta
    5: [6],       # Una pregunta
    6: [7],       # Una pregunta
    7: [8],       # Una pregunta
    8: [9],       # Una pregunta
    9: [10],      # Una pregunta
    10: [11, 12], # Dos preguntas
    11: [13],     # Una pregunta
    12: [14, 15], # Dos preguntas
    13: [16, 17], # Dos preguntas
    14: [18, 19], # Dos preguntas
    15: [20, 21], # Dos preguntas
    16: [22],     # Una pregunta
    17: [23, 24], # Dos preguntas
    18: [25, 26], # Dos preguntas
    19: [27, 28], # Dos preguntas
    20: [29, 30], # Dos preguntas
    21: [31],     # Una pregunta
    22: [32, 33], # Dos preguntas
    23: [34],     # Una pregunta
    24: [35, 36], # Dos preguntas
    25: [37, 38], # Dos preguntas
    26: [39],     # Una pregunta
    27: [40, 41], # Dos preguntas
    28: [42, 43], # Dos preguntas
    29: [44, 45], # Dos preguntas
    30: [46, 47], # Dos preguntas
    31: [48],     # Una pregunta
    32: [49, 50], # Dos preguntas
    33: [51, 52], # Dos preguntas
    34: [53],     # Una pregunta
    35: [54],     # Una pregunta
    36: [55],     # Una pregunta
    37: [56],     # Una pregunta
    38: [57, 58], # Dos preguntas (incluyendo pregunta 58 de iones)
    39: [59],     # Una pregunta
    40: [60],     # Una pregunta
}

# Verificar total
total_preguntas = sum(len(v) for v in preguntas_por_pagina.values())
print(f"📊 Total de preguntas mapeadas: {total_preguntas}")

# Renderizar cada página como imagen de alta resolución
for page_num in range(doc.page_count):
    page_num_1based = page_num + 1
    
    if page_num_1based not in preguntas_por_pagina or not preguntas_por_pagina[page_num_1based]:
        print(f"⏭️  Página {page_num_1based}: Portada - omitida")
        continue
    
    page = doc[page_num]
    preguntas = preguntas_por_pagina[page_num_1based]
    
    # Renderizar página completa a alta resolución
    # Usamos zoom 2.5 para mejor calidad
    zoom = 2.5
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    
    # Convertir pixmap a imagen PIL
    img_data = pix.tobytes("png")
    img = Image.open(io.BytesIO(img_data))
    width, height = img.size
    
    # Si hay una sola pregunta, guardar la página completa
    if len(preguntas) == 1:
        pregunta_num = preguntas[0]
        output_path = os.path.join(output_dir, f"fisica_2023_q{pregunta_num:02d}.png")
        img.save(output_path, "PNG")
        print(f"✅ Página {page_num_1based} → Pregunta {pregunta_num}")
    
    # Si hay dos preguntas, dividir la página en dos partes
    elif len(preguntas) == 2:
        # Pregunta 1 (mitad superior con algo de margen)
        pregunta_num = preguntas[0]
        # Crop: (left, upper, right, lower)
        top_half = img.crop((0, 0, width, int(height * 0.52)))
        output_path1 = os.path.join(output_dir, f"fisica_2023_q{pregunta_num:02d}.png")
        top_half.save(output_path1, "PNG")
        print(f"✅ Página {page_num_1based} (superior) → Pregunta {pregunta_num}")
        
        # Pregunta 2 (mitad inferior)
        pregunta_num = preguntas[1]
        bottom_half = img.crop((0, int(height * 0.48), width, height))
        output_path2 = os.path.join(output_dir, f"fisica_2023_q{pregunta_num:02d}.png")
        bottom_half.save(output_path2, "PNG")
        print(f"✅ Página {page_num_1based} (inferior) → Pregunta {pregunta_num}")

doc.close()

# Verificar cuántas imágenes se crearon
imagenes_creadas = len([f for f in os.listdir(output_dir) if f.endswith('.png')])
print(f"\n🎉 ¡Listo! Se crearon {imagenes_creadas} imágenes de preguntas")
print(f"📁 Guardadas en: {output_dir}")
