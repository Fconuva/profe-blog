import re

print("🔧 FIX UNIVERSAL - TODAS LAS COMILLAS EN TODO EL ARCHIVO")
print("=" * 70)

with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    content = f.read()

print("\n1️⃣ ESTADO INICIAL...")
comillas_simples = content.count("'")
comillas_escapadas = content.count("\\'")
print(f"   Comillas simples ('): {comillas_simples}")
print(f"   Comillas escapadas (\\'): {comillas_escapadas}")

print("\n2️⃣ REEMPLAZANDO EN TODO EL ARCHIVO...")

# Primero, quitar los escapes
if comillas_escapadas > 0:
    content = content.replace("\\'", "'")
    print(f"   ✅ Removed {comillas_escapadas} escape sequences")

# Ahora reemplazar TODAS las ' por ' (comilla tipográfica)
content_new = content.replace("'", "'")

cambios = content_new.count("'")
print(f"   ✅ Convertidas {cambios} comillas a tipográficas")

# Guardar
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'w', encoding='utf-8') as f:
    f.write(content_new)

print("\n💾 ARCHIVO GUARDADO")

print("\n3️⃣ VERIFICACIÓN...")
with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/index.njk', 'r', encoding='utf-8') as f:
    verify = f.read()

comillas_simples_final = verify.count("'")
comillas_tipograficas_final = verify.count("'")
comillas_escapadas_final = verify.count("\\'")

print(f"   Comillas simples ('): {comillas_simples_final}")
print(f"   Comillas tipográficas ('): {comillas_tipograficas_final}")
print(f"   Comillas escapadas (\\'): {comillas_escapadas_final}")

print("\n" + "=" * 70)
if comillas_simples_final == 0:
    print("✅ ÉXITO TOTAL - TODAS LAS COMILLAS REEMPLAZADAS")
else:
    print(f"⚠️  Quedan {comillas_simples_final} comillas simples")

print("\n🚀 npm run build && git add -A && git commit -m 'Fix: Comillas tipográficas universales' && git push")
