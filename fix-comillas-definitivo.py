import re
import json

print("🔧 FIX DEFINITIVO - ELIMINAR COMILLAS PROBLEMÁTICAS")
print("=" * 70)

with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

# ========================================
# ESTRATEGIA: Convertir comillas simples ' a comillas tipográficas ''
# ========================================

print("\n1️⃣ CONVIRTIENDO COMILLAS SIMPLES A TIPOGRÁFICAS...")

# Encontrar todas las líneas "texto": "..." que contengan comillas
pattern = r'"texto":\s*"([^"]*)"'

def fix_quotes(match):
    text = match.group(1)
    # Contar comillas escapadas mal
    if "\\'" in text:
        # Ya tiene escapes, quitarlos y reemplazar
        text = text.replace("\\'", "'")
    
    # Reemplazar ' con comilla tipográfica de apertura/cierre
    # Usar ' en lugar de '
    text = text.replace("'", "'")
    
    return f'"texto": "{text}"'

content_new = re.sub(pattern, fix_quotes, content)

cambios = content != content_new
if cambios:
    print(f"   ✅ Comillas convertidas a tipográficas (')")
    content = content_new
else:
    print("   ℹ️  No se encontraron comillas para convertir")

# También en enunciados
pattern_enunciado = r'"enunciado":\s*"([^"]*)"'

def fix_quotes_enunciado(match):
    text = match.group(1)
    if "\\'" in text:
        text = text.replace("\\'", "'")
    text = text.replace("'", "'")
    return f'"enunciado": "{text}"'

content = re.sub(pattern_enunciado, fix_quotes_enunciado, content)

# También en explicaciones que puedan tener comillas
pattern_explicacion = r'"explicacion":\s*"([^"]*?\([^)]*\'[^)]*\)[^"]*)"'

def fix_quotes_explicacion(match):
    text = match.group(1)
    if "\\'" in text:
        text = text.replace("\\'", "'")
    text = text.replace("'", "'")
    return f'"explicacion": "{text}"'

content = re.sub(pattern_explicacion, fix_quotes_explicacion, content)

print("\n2️⃣ BUSCANDO LÍNEA 6070...")
lines = content.split('\n')
if len(lines) >= 6070:
    print(f"   Línea 6069: {lines[6068][:80]}")
    print(f"   Línea 6070: {lines[6069][:80]}")
    print(f"   Línea 6071: {lines[6070][:80]}")

# Guardar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n💾 ARCHIVO GUARDADO")

# Verificar
print("\n3️⃣ VERIFICANDO RESULTADO...")
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content_check = f.read()

# Buscar si quedan comillas escapadas
escapadas = content_check.count("\\'")
print(f"   Comillas escapadas restantes: {escapadas}")

# Buscar si hay comillas simples en alternativas
comillas_simples = len(re.findall(r'"texto":\s*"[^"]*\'[^"]*"', content_check))
print(f"   Comillas simples en alternativas: {comillas_simples}")

print("\n" + "=" * 70)
if escapadas == 0 and comillas_simples == 0:
    print("✅ TODAS LAS COMILLAS REPARADAS")
else:
    print("⚠️  Aún quedan comillas por revisar")

print("\n🚀 Ejecuta: npm run build && git add -A && git commit -m 'Fix comillas' && git push")
