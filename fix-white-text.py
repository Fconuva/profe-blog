import re

# Leer el archivo
file_path = r'evaluaciones\educacion-media\estudio\matematica-media-67\index.njk'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Patrón para encontrar bg-white bg-opacity- sin text-gray
# Reemplazar: bg-white bg-opacity-{number} -> bg-white bg-opacity-{number} text-gray-900
pattern1 = r'(class="[^"]*)(bg-white bg-opacity-\d+)([^"]*")'

def replace_func(match):
    before = match.group(1)
    bg_class = match.group(2)
    after = match.group(3)
    
    # Si ya tiene text-gray-900 o text-gray-800, no hacer nada
    if 'text-gray-900' in before + bg_class + after or 'text-gray-800' in before + bg_class + after:
        return match.group(0)
    
    # Agregar text-gray-900 después de bg-opacity
    return f'{before}{bg_class} text-gray-900{after}'

content_fixed = re.sub(pattern1, replace_func, content)

# Guardar el archivo modificado
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_fixed)

print("✅ Archivo corregido: todos los elementos con fondo blanco ahora tienen texto oscuro")
