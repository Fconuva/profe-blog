import re

# Leer el archivo
with open('evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar todos los template strings (contenido entre backticks)
def fix_quotes_in_template(match):
    template_content = match.group(1)
    # Reemplazar class=" por class=' dentro del template string
    fixed = template_content.replace('class="', "class='")
    fixed = fixed.replace('id="', "id='")
    fixed = fixed.replace('style="', "style='")
    # Cerrar las etiquetas cambiando " final por '
    fixed = re.sub(r"='([^']*?)'", r"='\1'", fixed)
    fixed = re.sub(r'="([^"]*?)"', r"='\1'", fixed)
    return '`' + fixed + '`'

# Buscar template strings en enunciados
content = re.sub(r'enunciado: `(.*?)`', fix_quotes_in_template, content, flags=re.DOTALL)

# Escribir el archivo corregido
with open('evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Comillas corregidas exitosamente")
