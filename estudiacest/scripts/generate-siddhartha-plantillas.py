"""Genera las plantillas recortables del carrete de Siddhartha (16 tarjetas y molde del disco).

Decisión del 13-oct-2026: la imagen va en el reverso de cada tarjeta y reemplaza al
«símbolo o esquema» del frente. En las tarjetas de capítulo, el cuarto campo pide
explicar esa imagen. Los títulos de los capítulos se leen de carrete.js.
"""
import json
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
CLASS = ROOT / "nm3/siddhartha-carrete"
TARGET = CLASS / "assets/plantillas-siddhartha.pdf"
W, H = A4

pdfmetrics.registerFont(TTFont("Segoe", "C:/Windows/Fonts/segoeui.ttf"))
pdfmetrics.registerFont(TTFont("SegoeBold", "C:/Windows/Fonts/segoeuib.ttf"))

source = (CLASS / "carrete.js").read_text(encoding="utf-8")
chapters = json.loads(re.search(r"const chapters = (\[.*?\n\]);", source, re.S).group(1))
if len(chapters) != 12:
    raise SystemExit("carrete.js no trae doce capítulos; no se generan las plantillas.")

TITLES = (
    ["01. Portada"]
    + [f"{index + 2:02d}. {title}" for index, (title, _question) in enumerate(chapters)]
    + ["14. Síntesis y símbolos", "15. Reflexión crítica", "16. Edición y fuentes"]
)
COVER = (["Título, autor, nombre y curso", "Edición utilizada"], [4, 4])
CHAPTER = (
    ["Hecho relevante", "Interpretación del cambio o conflicto", "Evidencia y capítulo/página",
     "Imagen del reverso: explica qué idea muestra"],
    [2, 3, 2, 2],
)
CLOSING = {
    13: ["Inicio → crisis → cierre (con pasajes)", "Símbolo 1: significado y escena", "Símbolo 2: significado y escena"],
    14: ["Mi postura ante la pregunta de la guía", "Dos episodios de distintas etapas", "Cómo respaldan mi postura"],
    15: ["Autor, título, editorial, año y traductor/a", "Otras fuentes y fecha de consulta", "Si utilicé solo el libro, lo indico"],
}

c = canvas.Canvas(str(TARGET), pagesize=A4, invariant=1)
c.setTitle("Plantillas recortables: carrete literario de Siddhartha")
for page in range(8):
    c.setFont("Segoe", 8)
    c.drawString(10 * mm, H - 8 * mm, f"Plantilla {page + 1}/9 | Imprimir al 100 % | Dos tarjetas por hoja | Cortar línea continua | Reverso: imagen o símbolo de la tarjeta")
    for slot in range(2):
        index = page * 2 + slot
        x = 10 * mm
        top = H - (16 + slot * 132) * mm
        y = top - 120 * mm
        c.setStrokeColor(colors.black)
        c.setLineWidth(.8)
        c.rect(x, y, 190 * mm, 120 * mm)
        c.setDash(3, 3)
        c.line(x + 180 * mm, y, x + 180 * mm, top)
        c.setDash()
        c.saveState()
        c.translate(x + 186 * mm, y + 28 * mm)
        c.rotate(90)
        c.setFont("Segoe", 7)
        c.drawString(0, 0, "Pestaña: pegar por detrás")
        c.restoreState()
        c.setFont("SegoeBold", 10.5)
        c.drawString(x + 5 * mm, top - 8 * mm, TITLES[index])
        fields, line_counts = COVER if index == 0 else CHAPTER if index <= 12 else (CLOSING[index], [3, 3, 3])
        field_y = top - 17 * mm
        for field, count in zip(fields, line_counts):
            c.setFont("SegoeBold", 8)
            c.drawString(x + 5 * mm, field_y, field)
            field_y -= 3 * mm
            for _line in range(count):
                field_y -= 6.5 * mm
                c.setStrokeColor(colors.HexColor("#999999"))
                c.setLineWidth(.25)
                c.line(x + 5 * mm, field_y, x + 175 * mm, field_y)
            field_y -= 4 * mm
        if field_y < y:
            raise SystemExit("Campos fuera de tarjeta; no se generan las plantillas.")
    c.showPage()
c.setFont("SegoeBold", 12)
c.drawCentredString(W / 2, H - 15 * mm, "Disco de cartón: diámetro 20 cm")
c.setFont("Segoe", 9)
c.drawCentredString(W / 2, H - 21 * mm, "Imprime esta página dos veces al 100 % y úsala como molde.")
cx, cy = W / 2, H / 2
c.setStrokeColor(colors.black)
c.setLineWidth(1)
c.circle(cx, cy, 100 * mm)
c.setDash(3, 3)
c.circle(cx, cy, 20 * mm)
c.setDash()
c.setFont("Segoe", 8)
c.drawCentredString(cx, cy + 3 * mm, "Zona de pegado")
c.drawCentredString(cx, cy - 3 * mm, "No recortar")
c.drawCentredString(W / 2, 18 * mm, "El borde exterior es el corte. Los círculos decorativos son opcionales.")
c.drawCentredString(W / 2, 12 * mm, "Comprueba con regla: esta línea mide 5 cm.")
c.line(80 * mm, 8 * mm, 130 * mm, 8 * mm)
c.save()
print(f"Plantillas: 9 páginas A4, {TARGET.stat().st_size} bytes; las doce tarjetas de capítulo piden explicar la imagen del reverso.")
