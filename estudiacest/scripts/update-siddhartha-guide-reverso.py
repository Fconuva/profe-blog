"""Lleva a la guía aprobada la decisión del 13-oct-2026 sobre la imagen del reverso.

La imagen va en el reverso de cada tarjeta y reemplaza al «símbolo o esquema» del
frente. Se reescriben solo los párrafos que lo nombraban (páginas 2, 3, 4 y 6) y se
cambia la foto de la tarjeta por la retocada. Si un párrafo no cabe en su espacio o
cambia cualquier otra cosa, no se guarda la guía.
"""
import hashlib
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "nm3/siddhartha-carrete/assets"
TARGET = ASSETS / "guia-siddhartha.pdf"
PHOTO = ASSETS / "imagen-ia-5.jpg"
FONTS = {False: fitz.Font(fontfile="C:/Windows/Fonts/segoeui.ttf"), True: fitz.Font(fontfile="C:/Windows/Fonts/segoeuib.ttf")}
LEFT, RIGHT = 45.35, 550.0

# Cada párrafo: página, línea base de su primera línea, líneas que ocupaba, líneas que
# puede ocupar, tamaño, interlínea, texto anterior y texto nuevo en tramos (negrita, texto).
PARAGRAPHS = [
    (1, 565.66, 2, 4, 9.0, 12.0,
     "En cada fotograma: título y número; un hecho relevante; interpretación del cambio o conflicto; evidencia y localización; "
     "símbolo o esquema sencillo con una frase que lo explique. La imagen comunica una idea: no se evalúa la habilidad para dibujar.",
     [(True, "En cada fotograma:"),
      (False, "título y número; un hecho relevante; interpretación del cambio o conflicto; evidencia y localización; "
              "una frase que explique la imagen del reverso."),
      (True, "En el reverso:"),
      (False, "una imagen o un símbolo que muestre la idea de la tarjeta. La imagen comunica una idea: "
              "no se evalúa la habilidad para dibujar.")]),
    (2, 215.00, 1, 1, 10.4, 14.3,
     "4. Símbolo o esquema: representa una idea del fotograma y explica la relación en una frase.",
     [(True, "4. Imagen del reverso:"),
      (False, "explica en una frase qué idea del fotograma muestra tu imagen o símbolo.")]),
    (2, 322.10, 2, 2, 10.4, 14.3,
     "Esquema: una flecha de regreso al puente representa esa decisión. Imita el procedimiento y escribe tu propio análisis del libro.",
     [(True, "Imagen del reverso:"),
      (False, "una flecha de regreso al puente representa esa decisión. Imita el procedimiento y escribe tu propio análisis del libro.")]),
    (3, 672.61, 2, 3, 9.0, 12.0,
     "Une y pliega: escribe primero, numera 01-16 y pega las pestañas por detrás de la tarjeta siguiente. Alterna un pliegue hacia "
     "delante y otro hacia atrás para formar un acordeón.",
     [(True, "Une y pliega:"),
      (False, "escribe primero, numera 01-16 y pon la imagen en el reverso de cada tarjeta. Pega las pestañas por detrás de la "
              "tarjeta siguiente. Alterna un pliegue hacia delante y otro hacia atrás para formar un acordeón.")]),
    (5, 474.21, 2, 2, 9.0, 12.0,
     "Organiza cada capítulo: número y título, hecho, interpretación, evidencia con localización y símbolo o esquema explicado. La "
     "imagen muestra los campos; para recortar, usa el archivo de plantillas. Puedes ampliar las tarjetas.",
     [(True, "Organiza cada capítulo:"),
      (False, "número y título, hecho, interpretación, evidencia con localización y explicación de la imagen del reverso. La "
              "foto muestra los campos; para recortar, usa el archivo de plantillas. Puedes ampliar las tarjetas.")]),
    (5, 505.21, 2, 2, 9.0, 12.0,
     "Lista final: [ ] 12 capítulos completos [ ] Interpretaciones con evidencia [ ] Síntesis y dos símbolos [ ] Reflexión con dos "
     "episodios [ ] Edición y fuentes [ ] Tira legible y desplegable.",
     [(True, "Lista final:"),
      (False, "[ ] 12 capítulos completos [ ] Interpretaciones con evidencia [ ] Síntesis y dos símbolos [ ] Reflexión con dos "
              "episodios [ ] Edición y fuentes [ ] Imagen en el reverso de cada tarjeta [ ] Tira legible y desplegable.")]),
]
CHANGED = sorted({paragraph[0] for paragraph in PARAGRAPHS})


def reading_text(page):
    """Texto de la página en orden de lectura, sin depender del orden de escritura en el PDF."""
    rows = []
    for x0, _y0, _x1, y1, word, *_rest in sorted(page.get_text("words"), key=lambda item: (item[3], item[0])):
        if rows and abs(rows[-1][0] - y1) <= 3:
            rows[-1][1].append((x0, word))
        else:
            rows.append((y1, [(x0, word)]))
    # Segoe comparte el glifo del guion con U+2010; al extraer el texto puede volver con ese código.
    return " ".join(word for _y, row in rows for _x, word in sorted(row)).replace("‐", "-")


def color_at(page, baseline):
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                if abs(span["origin"][1] - baseline) < .2:
                    value = span["color"]
                    return ((value >> 16) / 255, (value >> 8 & 255) / 255, (value & 255) / 255)
    raise SystemExit(f"No hay texto en la línea base {baseline}; no se altera la guía.")


def wrap(runs, size):
    """Parte los tramos en líneas de segmentos (negrita, texto) que caben entre los márgenes."""
    space = FONTS[False].text_length(" ", fontsize=size)
    lines, current, width = [], [], 0.0
    for bold, text in runs:
        for word in text.split():
            word_width = FONTS[bold].text_length(word, fontsize=size)
            if current and LEFT + width + space + word_width > RIGHT:
                lines.append(current)
                current, width = [], 0.0
            if current:
                width += space
            current.append((bold, word, LEFT + width))
            width += word_width
    return lines + [current]


document = fitz.open(TARGET)
if len(document) != 6:
    raise SystemExit("La guía no tiene 6 páginas; no se altera.")
before_text = [reading_text(page) for page in document]
before_pixels = [page.get_pixmap(dpi=72).samples for page in document]
layout = []
for index, baseline, old_lines, max_lines, size, leading, old, runs in PARAGRAPHS:
    page = document[index]
    if before_text[index].count(old) != 1:
        raise SystemExit(f"No se encontró el párrafo anterior en la página {index + 1}; no se altera la guía.")
    lines = wrap(runs, size)
    if len(lines) > max_lines:
        raise SystemExit(f"El párrafo nuevo de la página {index + 1} ocupa {len(lines)} líneas y solo caben {max_lines}.")
    layout.append((index, baseline, size, leading, color_at(page, baseline), lines))
    for line in range(old_lines):
        y = baseline + line * leading
        page.add_redact_annot(fitz.Rect(LEFT - 1, y - .65 * size, RIGHT + 2, y + .1 * size), fill=False)
for index in CHANGED:
    document[index].apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_NONE)
for index, baseline, size, leading, color, lines in layout:
    writer = fitz.TextWriter(document[index].rect, color=color)
    for number, line in enumerate(lines):
        for bold, word, x in line:
            writer.append((x, baseline + number * leading), word, font=FONTS[bold], fontsize=size)
    writer.write_text(document[index])

page = document[5]
images = [image for image in page.get_images(full=True) if (image[2], image[3]) == (1400, 1045)]
if len(images) != 1:
    raise SystemExit("La página 6 no tiene una sola foto de la tarjeta; no se altera la guía.")
xref = images[0][0]
page.replace_image(xref, filename=str(PHOTO))
if hashlib.sha256(document.extract_image(xref)["image"]).digest() != hashlib.sha256(PHOTO.read_bytes()).digest():
    raise SystemExit("La foto incrustada no es la retocada; no se guarda la guía.")

document.subset_fonts()
temporary = TARGET.with_name("guia-siddhartha-reverso.tmp.pdf")
document.save(temporary, garbage=4, deflate=True)
document.close()

check = fitz.open(temporary)
try:
    assert len(check) == 6
    expected = list(before_text)
    for index, _baseline, _old_lines, _max_lines, _size, _leading, old, runs in PARAGRAPHS:
        expected[index] = expected[index].replace(old, " ".join(text for _bold, text in runs))
    for index, page in enumerate(check):
        found = reading_text(page)
        at = next((i for i, (a, b) in enumerate(zip(found, expected[index])) if a != b), min(len(found), len(expected[index])))
        assert found == expected[index], f"Texto inesperado en la página {index + 1}: «{found[at - 30:at + 40]}» en vez de «{expected[index][at - 30:at + 40]}»"
        if index not in CHANGED:
            assert page.get_pixmap(dpi=72).samples == before_pixels[index], f"Cambió la página {index + 1}"
    whole = " ".join(expected)
    assert "ímbolo o esquema" not in whole and "Esquema:" not in whole
    assert "un solo nivel" in expected[0] and "90 puntos" not in expected[0]
except AssertionError as error:
    check.close()
    temporary.unlink()
    raise SystemExit(f"{error}; no se guarda la guía.")
check.close()
temporary.replace(TARGET)
print(f"Guía: 6 páginas, {TARGET.stat().st_size} bytes; cambian los párrafos del reverso en las páginas 2, 3, 4 y 6 y la foto de la tarjeta.")
