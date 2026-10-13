"""Retoca la foto de la tarjeta de capítulo del carrete de Siddhartha.

Decisión del 13-oct-2026: la imagen va en el reverso de cada tarjeta y reemplaza al
«símbolo o esquema» del frente. El campo inferior del frente deja de decir
«SÍMBOLO + EXPLICACIÓN» y pide explicar la imagen del reverso.

Parte siempre de la foto original (commit 1a4751f6), así que se puede repetir.
"""
import io
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
RELATIVE = "nm3/siddhartha-carrete/assets/imagen-ia-5.jpg"
TARGET = ROOT / RELATIVE
ORIGINAL = "1a4751f6:estudiacest/" + RELATIVE
FONTS = Path("C:/Windows/Fonts")
SCALE = 4                        # supermuestreo del rótulo y de las líneas nuevas
LEFT, RIGHT = 263, 1056          # extensión de las líneas de escritura de la tarjeta
ROWS = (747, 795, 843)           # línea del rótulo y dos líneas más
LABEL = "IMAGEN DEL REVERSO:"
HINT = "explícala"


def retouch(image: Image.Image) -> Image.Image:
    if image.size != (1400, 1045):
        raise SystemExit(f"Tamaño inesperado: {image.size}")
    pixels = np.asarray(image.convert("RGB")).copy()
    gray = pixels.mean(axis=2)
    if (gray[701:756, 261:800] < 110).mean() <= 0.15:
        raise SystemExit("No está el rótulo anterior; no se altera la foto.")
    if (gray[763:840, 262:1055] < 150).mean() >= 0.002:
        raise SystemExit("El interior del recuadro no está limpio; no se altera la foto.")
    ink = np.median(pixels[560:600, 263:500][gray[560:600, 263:500] < 60], axis=0)
    # El rótulo y el recuadro se cubren con el espejo del papel vecino: conserva su grano.
    pixels[697:763, 262:1055] = pixels[763:829, 262:1055][::-1]
    pixels[840:850, 262:1055] = pixels[830:840, 262:1055][::-1]
    pixels[697:850, 254:262] = pixels[697:850, 262:270][:, ::-1]
    pixels[697:850, 1055:1063] = pixels[697:850, 1047:1055][:, ::-1]
    result = Image.fromarray(pixels)
    # Rótulo y líneas con la tipografía, el trazo y la tinta del resto de la tarjeta.
    bold = ImageFont.truetype(str(FONTS / "GOTHICB.TTF"), 44 * SCALE)
    regular = ImageFont.truetype(str(FONTS / "GOTHIC.TTF"), 44 * SCALE)
    layer = Image.new("L", (1400 * SCALE, 1045 * SCALE), 0)
    draw = ImageDraw.Draw(layer)
    baseline = (ROWS[0] - 3) * SCALE
    x = LEFT * SCALE
    # La tinta de la primera letra parte en la misma columna que los demás rótulos.
    probe = Image.new("L", layer.size, 0)
    ImageDraw.Draw(probe).text((x, baseline), LABEL, font=bold, fill=255, anchor="ls")
    x -= probe.getbbox()[0] - x
    draw.text((x, baseline), LABEL, font=bold, fill=255, anchor="ls")
    x += draw.textlength(LABEL + " ", font=bold)
    draw.text((x, baseline), HINT, font=regular, fill=255, anchor="ls")
    x += draw.textlength(HINT, font=regular) + 14 * SCALE
    if x >= (RIGHT - 60) * SCALE:
        raise SystemExit("El rótulo no deja línea para escribir.")
    for index, row in enumerate(ROWS):
        start = x if index == 0 else LEFT * SCALE
        draw.rectangle([start, row * SCALE, RIGHT * SCALE, (row + 2) * SCALE - 1], fill=255)
    mask = layer.resize(result.size, Image.LANCZOS)
    result.paste(Image.new("RGB", result.size, tuple(int(v) for v in ink)), (0, 0), mask)
    return result


if __name__ == "__main__":
    original = subprocess.run(["git", "show", ORIGINAL], cwd=ROOT, capture_output=True, check=True).stdout
    retouch(Image.open(io.BytesIO(original))).save(TARGET, "JPEG", quality=90, optimize=True, subsampling=0)
    print(f"Foto de la tarjeta: {TARGET.stat().st_size} bytes; el frente pide explicar la imagen del reverso.")
