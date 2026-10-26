"""Reproduce los conteos del análisis sin copiar el texto del libro a la salida.

Uso: py -3.12 medir_gdd.py <tomo1.pdf> <tomo2.pdf> --salida <medicion.json>
Requiere PyMuPDF ya disponible. No instala dependencias.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path

import fitz

TERMINOS = [
    'Orientaciones y estrategias', 'Apoyo teórico', 'Errores frecuentes',
    'Articulación BDA', 'Solucionario', 'Preguntas complementarias',
    'Respuesta variable', 'Se espera que', 'audiencia', 'propósito',
    'enunciador', 'interpretación', 'evidencia', 'metacognición',
    'planificar', 'revisar',
]
VERBOS = [
    'Invite', 'Pida', 'Solicite', 'Pregunte', 'Explique', 'Oriente',
    'Motive', 'Modele', 'Recuerde', 'Proponga', 'Organice', 'Monitoree',
]
MUESTRA = [
    [9, 14, 15, 35, 36, 46, 56, 103, 111, 112, 113, 145, 169, 202, 219, 226],
    [35, 49, 58, 109, 171, 213, 223, 224],
]


def medir(path, nivel):
    parts = []
    with fitz.open(path) as doc:
        paginas = len(doc)
        for page in doc:
            lines = []
            flags = fitz.TEXTFLAGS_DICT & ~fitz.TEXT_PRESERVE_IMAGES
            for block in page.get_text('dict', flags=flags)['blocks']:
                for line in block.get('lines', []):
                    spans = [s for s in line['spans'] if s['size'] >= 7.5]
                    if spans:
                        lines.append(''.join(s['text'] for s in spans))
            text = re.sub(r'(\w)-\n(\w)', r'\1\2', '\n'.join(lines))
            parts.append(re.sub(r'\s+', ' ', text))
    corpus = '\n'.join(parts)

    def contar(items):
        return {w: len(re.findall(r'\b' + re.escape(w) + r'\b', corpus, re.I))
                for w in items}

    return {
        'archivo': path.name,
        'nivel': nivel,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'bytes': path.stat().st_size,
        'paginasPDF': paginas,
        'paginasTextoPrincipal': sum(bool(t.strip()) for t in parts),
        'palabrasTextoPrincipal': len(re.findall(r'\b\w+\b', corpus)),
        'terminos': contar(TERMINOS),
        'verbosFormaExacta': contar(VERBOS),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('tomo1', type=Path)
    parser.add_argument('tomo2', type=Path)
    parser.add_argument('--salida', type=Path, required=True)
    args = parser.parse_args()
    archivos = [medir(args.tomo1, '3.º medio'), medir(args.tomo2, '4.º medio')]
    report = {
        'metodo': {
            'extraccion': 'PyMuPDF; texto nativo de todas las páginas; solo spans >= 7.5 pt para reducir texto duplicado de miniaturas. Reunión de palabras partidas al final de línea y normalización de espacios. Conteo sin distinguir mayúsculas, por término exacto.',
            'limites': 'No es OCR ni conteo de clases/actividades únicas. Incluye títulos, encabezados y el material imprimible con tamaño suficiente; excluye parte del TE reducido. Los verbos no incluyen variantes como pídales/invite a. El umbral no identifica de forma perfecta la voz docente. La inspección visual e interpretación se hicieron sobre una muestra declarada, no sobre todas las páginas renderizadas.',
        },
        'archivos': archivos,
        'muestraVisual': {args.tomo1.name: MUESTRA[0], args.tomo2.name: MUESTRA[1]},
    }
    args.salida.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
    print('Medición guardada: dos tomos,', sum(a['paginasPDF'] for a in archivos), 'páginas.')


if __name__ == '__main__':
    main()
