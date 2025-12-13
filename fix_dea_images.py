import re

file_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-especial\pruebas\dea-2023\index.njk"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove lines with imagen: "..."
# Pattern: matches lines with 'imagen: "../imagenes_dea_2023/...'
# We use multiline mode to match the whole line
new_content = re.sub(r'^\s*imagen: "\.\./imagenes_dea_2023/.*",\n', '', content, flags=re.MULTILINE)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Removed image references from index.njk")
