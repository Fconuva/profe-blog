import re
from pathlib import Path

TARGET = Path('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk')
content = TARGET.read_text(encoding='utf-8')

keywords = [
    'objetivo de aprendizaje',
    'oa ',
    'bases curriculares',
    'bcep'
]

def highlight_foundation(text: str) -> str:
    text = re.sub(r'(OA\s*\d+)', r'<strong>\1</strong>', text, flags=re.IGNORECASE)
    text = re.sub(r'(Objetivo de Aprendizaje\s*\d+)', r'<strong>\1</strong>', text, flags=re.IGNORECASE)
    text = re.sub(r'(Bases Curriculares de Educación Parvularia 2018|Bases Curriculares)', r'<strong>\1</strong>', text, flags=re.IGNORECASE)
    return text

def format_context(raw: str) -> str:
    cleaned = re.sub(r'\s+', ' ', raw.strip())
    if not cleaned:
        return raw
    if '🏫 <strong>Contexto' in cleaned:
        return raw
    lower = cleaned.lower()
    idx = min([pos for k in keywords if (pos := lower.find(k)) != -1], default=-1)
    foundation = ''
    narrative = cleaned
    if idx != -1:
        narrative = cleaned[:idx].strip()
        foundation = cleaned[idx:].strip()
    sentences = re.split(r'(?<=[.!?])\s+', narrative)
    contexto = sentences[0].strip() if sentences else narrative
    situacion = ' '.join(sentences[1:]).strip() if len(sentences) > 1 else ''
    contexto = contexto.replace("'", "’")
    situacion = situacion.replace("'", "’")
    parts = []
    if contexto:
        parts.append(f"🏫 <strong>Contexto:</strong><br><br>{contexto}")
    if situacion:
        parts.append(f"📅 <strong>Situación:</strong><br><br>{situacion}")
    if foundation:
        foundation_html = highlight_foundation(foundation).replace("'", "’")
        parts.append(f"📚 <strong>Fundamento Pedagógico:</strong><br><br>{foundation_html}")
    formatted = '<br><br>\n\n'.join(parts)
    return formatted

pattern = re.compile(r'("contexto": `)([\s\S]*?)(`,\n\s+"ambito":)', re.MULTILINE)
replacements = 0

def replacer(match):
    global replacements
    value = match.group(2)
    formatted = format_context(value)
    replacements += 1
    return f'{match.group(1)}{formatted}{match.group(3)}'

new_content = pattern.sub(replacer, content)
if replacements:
    TARGET.write_text(new_content, encoding='utf-8')
    print(f'✅ Contextos formateados: {replacements}')
else:
    print('ℹ️ No se encontraron contextos pendientes')
