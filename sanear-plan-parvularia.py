from pathlib import Path

FILE = Path('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk')
content = FILE.read_text(encoding='utf-8')

print('🔍 Sanitizando planData (contextos y enunciados)')


def convert_to_template(field: str, next_field: str, field_indent: str = '        ', next_indent: str = '        '):
    global content
    search = f'{field_indent}"{field}": "'
    end_marker = f'",\n{next_indent}"{next_field}":'
    conversions = 0
    start = 0
    while True:
        idx = content.find(search, start)
        if idx == -1:
            break
        value_start = idx + len(search)
        value_end = content.find(end_marker, value_start)
        if value_end == -1:
            break
        raw_value = content[value_start:value_end]
        safe_value = raw_value.replace('`', '\\`')
        replacement = f'{field_indent}"{field}": `{safe_value}`,\n{next_indent}"{next_field}":'
        content = content[:idx] + replacement + content[value_end + len(end_marker):]
        start = idx + len(replacement)
        conversions += 1
    print(f'   • {field}: {conversions} ocurrencias convertidas a template literal')


convert_to_template('contexto', 'ambito')
convert_to_template('enunciado', 'alternativas')
convert_to_template('explicacion', 'temas_relacionados')
# Algunos registros tienen distinta indentación (6 espacios)
convert_to_template('contexto', 'ambito', field_indent='      ', next_indent='        ')

FILE.write_text(content, encoding='utf-8')
print('\n✅ Archivo actualizado. Ejecuta npm run build para validar.')
