import re

print("🔧 FIX AGRESIVO - TODAS LAS COMILLAS")
print("=" * 70)

with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

print("\n1️⃣ BUSCANDO Y REEMPLAZANDO TODAS LAS COMILLAS...")

# Buscar el inicio del array de preguntas
inicio = content.find('const preguntasData = [')
fin = content.find('];', inicio) + 2

if inicio == -1 or fin == -1:
    print("   ❌ No se encontró el array de preguntas")
    exit(1)

print(f"   📊 Array encontrado: posición {inicio} a {fin}")

# Extraer solo la sección del array
antes = content[:inicio]
array_section = content[inicio:fin]
despues = content[fin:]

print(f"   📏 Longitud del array: {len(array_section)} caracteres")

# Contar comillas antes
comillas_antes = array_section.count("'")
print(f"   📊 Comillas simples encontradas: {comillas_antes}")

# REEMPLAZAR TODAS LAS ' POR ' (comilla tipográfica)
array_fixed = array_section.replace("'", "'")

# Contar después
comillas_despues = array_fixed.count("'")
print(f"   ✅ Comillas simples después: {comillas_despues}")
print(f"   ✅ Comillas tipográficas añadidas: {array_fixed.count("'")}")

# Reconstruir
content_final = antes + array_fixed + despues

# Guardar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(content_final)

print("\n💾 ARCHIVO GUARDADO")

print("\n2️⃣ VERIFICACIÓN FINAL...")
# Leer de nuevo y verificar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    verificacion = f.read()

# Buscar comillas problemáticas en el array
inicio_v = verificacion.find('const preguntasData = [')
fin_v = verificacion.find('];', inicio_v) + 2
array_v = verificacion[inicio_v:fin_v]

comillas_simples_restantes = array_v.count("'")
comillas_tipograficas = array_v.count("'")

print(f"   Comillas simples restantes: {comillas_simples_restantes}")
print(f"   Comillas tipográficas: {comillas_tipograficas}")

print("\n" + "=" * 70)
if comillas_simples_restantes == 0:
    print("✅ TODAS LAS COMILLAS SIMPLES ELIMINADAS DEL ARRAY")
    print("✅ LISTO PARA COMPILAR Y SUBIR")
else:
    print(f"⚠️  Aún quedan {comillas_simples_restantes} comillas simples")

print("\n🚀 Siguiente paso: npm run build && git add -A && git commit -m 'Fix: Comillas tipográficas' && git push")
