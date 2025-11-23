from pathlib import Path
import re

text = Path('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk').read_text(encoding='utf-8')
pattern = re.compile(r'^(\s+)"contexto":', re.MULTILINE)
indents = sorted({m.group(1) for m in pattern.finditer(text)})
for indent in indents:
    print(repr(indent), len(indent))
print('Total contexto count:', len(pattern.findall(text)))
