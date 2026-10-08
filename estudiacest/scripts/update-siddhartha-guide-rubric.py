"""Actualiza solo el párrafo de evaluación de la guía aprobada."""
from pathlib import Path
import fitz

root = Path(__file__).resolve().parents[1]
target = root / "nm3/siddhartha-carrete/assets/guia-siddhartha.pdf"
document = fitz.open(target)
page = document[0]
old_text = "Evaluación: 90 puntos de contenido; 10 de legibilidad y funcionamiento."
if old_text not in page.get_text():
    raise SystemExit("No se encontró el párrafo anterior; no se altera la guía.")
before = [p.get_text() for p in document]
rect = fitz.Rect(45.3, 527.8, 550, 553)
page.add_redact_annot(rect, fill=(1, 1, 1))
page.apply_redactions(images=0, graphics=0)
text = (
    "Evaluación: un solo nivel para el carrete completo y su puntaje global /100, según la rúbrica holística. "
    "El contenido literario orienta la decisión; decoración, costo y precisión del corte no suman puntos."
)
font_path = Path("C:/Windows/Fonts/segoeui.ttf")
page.insert_font(fontname="cestGuide", fontfile=str(font_path))
result = page.insert_textbox(fitz.Rect(45.35, 527.8, 550, 567), text, fontname="cestGuide", fontsize=10.4, lineheight=1.375)
if result < 0:
    raise SystemExit("No cabe el texto revisado; no se guarda la guía.")
assert len(document) == 6
assert [p.get_text() for p in document][1:] == before[1:]
temporary = target.with_name("guia-siddhartha-revisada.tmp.pdf")
document.save(temporary, garbage=4, deflate=True)
document.close()
temporary.replace(target)
print("Guía: 6 páginas; solo se modifica el párrafo de evaluación de la página 1.")
