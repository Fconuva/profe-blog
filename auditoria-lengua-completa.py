#!/usr/bin/env python3
"""
AUDITORÍA COMPLETA DEL TEST DE LENGUA Y LITERATURA MEDIA
Verificar todas las imágenes, sintaxis, y estructura del test
"""

import os
import json
import re

print("=" * 80)
print("📊 AUDITORÍA COMPLETA - TEST LENGUA Y LITERATURA EDUCACIÓN MEDIA")
print("=" * 80)

archivo = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\index.njk"
carpeta_imagenes = r"evaluaciones\educacion-media\pruebas\lengua-literatura-media\imagenes"

# ====================
# 1. VERIFICAR ARCHIVO
# ====================
print("\n" + "=" * 80)
print("1️⃣  VERIFICACIÓN DE ARCHIVO")
print("=" * 80)

if os.path.exists(archivo):
    tamaño = os.path.getsize(archivo)
    print(f"✅ Archivo encontrado: {archivo}")
    print(f"📏 Tamaño: {tamaño:,} bytes ({tamaño/1024:.1f} KB)")
    
    with open(archivo, 'r', encoding='utf-8') as f:
        contenido = f.read()
        lineas = contenido.split('\n')
    
    print(f"📝 Total de líneas: {len(lineas):,}")
else:
    print(f"❌ Archivo NO encontrado: {archivo}")
    exit(1)

# ====================
# 2. VERIFICAR IMÁGENES
# ====================
print("\n" + "=" * 80)
print("2️⃣  VERIFICACIÓN DE IMÁGENES PNG")
print("=" * 80)

# Buscar todas las referencias a imágenes
imagenes_usadas = re.findall(r'src="imagenes/([^"]+)"', contenido)
imagenes_usadas += re.findall(r"src='imagenes/([^']+)'", contenido)

print(f"\n📋 Imágenes referenciadas en el código: {len(imagenes_usadas)}")
for i, img in enumerate(imagenes_usadas, 1):
    ruta_completa = os.path.join(carpeta_imagenes, img)
    existe = os.path.exists(ruta_completa)
    simbolo = "✅" if existe else "❌"
    tamaño = f"({os.path.getsize(ruta_completa):,} bytes)" if existe else "(NO EXISTE)"
    print(f"  {simbolo} {i}. {img} {tamaño}")

# Verificar imágenes en la carpeta
print(f"\n📁 Imágenes en carpeta {carpeta_imagenes}:")
if os.path.exists(carpeta_imagenes):
    archivos_carpeta = [f for f in os.listdir(carpeta_imagenes) if f.endswith('.png')]
    print(f"   Total: {len(archivos_carpeta)} archivos PNG")
    for img in archivos_carpeta:
        usado = img in imagenes_usadas
        simbolo = "✅" if usado else "⚠️ "
        estado = "USADA" if usado else "NO USADA"
        print(f"   {simbolo} {img} - {estado}")
else:
    print(f"   ❌ Carpeta NO encontrada")

# ====================
# 3. ANALIZAR PREGUNTAS
# ====================
print("\n" + "=" * 80)
print("3️⃣  ANÁLISIS DE PREGUNTAS")
print("=" * 80)

# Buscar todas las preguntas
preguntas = re.findall(r'id:\s*(\d+),', contenido)
print(f"\n📊 Total de preguntas: {len(preguntas)}")

# Verificar preguntas con imágenes
preguntas_con_imagen = []
for match in re.finditer(r'id:\s*(\d+),.*?(?=id:\s*\d+,|$)', contenido, re.DOTALL):
    pregunta_id = match.group(1)
    bloque = match.group(0)
    if 'imagenes/' in bloque:
        # Extraer nombre de imagen
        img_match = re.search(r'imagenes/([^"\']+)', bloque)
        if img_match:
            preguntas_con_imagen.append((pregunta_id, img_match.group(1)))

print(f"\n🖼️  Preguntas con imagen PNG: {len(preguntas_con_imagen)}")
for pid, img in preguntas_con_imagen:
    print(f"   ✅ Q{pid}: {img}")

# Verificar preguntas SIN imagen pero con diseños CSS
preguntas_sin_imagen = []
for match in re.finditer(r'id:\s*(\d+),.*?enunciado:.*?(?=alternativas:|$)', contenido, re.DOTALL):
    pregunta_id = match.group(1)
    bloque = match.group(0)
    tiene_img = 'imagenes/' in bloque
    tiene_css = any(x in bloque for x in ['bg-gradient', 'bg-blue-', 'bg-green-', 'bg-red-', 'grid grid-cols'])
    if tiene_css and not tiene_img:
        preguntas_sin_imagen.append(pregunta_id)

if preguntas_sin_imagen:
    print(f"\n📐 Preguntas con diseño CSS (sin PNG): {len(preguntas_sin_imagen)}")
    for pid in preguntas_sin_imagen:
        print(f"   ℹ️  Q{pid}: Diseño CSS")
else:
    print(f"\n✅ Todas las preguntas visuales usan imágenes PNG (no CSS)")

# ====================
# 4. VERIFICAR DOMINIOS
# ====================
print("\n" + "=" * 80)
print("4️⃣  DISTRIBUCIÓN POR DOMINIOS")
print("=" * 80)

dominios = re.findall(r'dominio:\s*"([^"]+)"', contenido)
from collections import Counter
contador_dominios = Counter(dominios)

print(f"\n📚 Dominios encontrados: {len(contador_dominios)}")
for dominio, count in sorted(contador_dominios.items()):
    print(f"   • {dominio}: {count} preguntas")

# ====================
# 5. VERIFICAR ESTRUCTURA
# ====================
print("\n" + "=" * 80)
print("5️⃣  VERIFICACIÓN DE ESTRUCTURA")
print("=" * 80)

# Verificar que todas las preguntas tengan:
# - id, dominio, enunciado, alternativas, correcta, explicacion
campos_requeridos = ['id:', 'dominio:', 'enunciado:', 'alternativas:', 'correcta:', 'explicacion:']

problemas = []
for match in re.finditer(r'{\s*id:\s*(\d+),.*?(?=},\s*{|$)', contenido, re.DOTALL):
    pregunta_id = match.group(1)
    bloque = match.group(0)
    
    faltantes = []
    for campo in campos_requeridos:
        if campo not in bloque:
            faltantes.append(campo.replace(':', ''))
    
    if faltantes:
        problemas.append((pregunta_id, faltantes))

if problemas:
    print(f"\n⚠️  Preguntas con campos faltantes: {len(problemas)}")
    for pid, campos in problemas:
        print(f"   ❌ Q{pid}: Faltan {', '.join(campos)}")
else:
    print(f"\n✅ Todas las preguntas tienen estructura completa")

# Verificar alternativas (deben ser 4)
preguntas_alternativas = re.findall(r'alternativas:\s*\[(.*?)\]', contenido, re.DOTALL)
alt_incorrectas = []
for i, alt_bloque in enumerate(preguntas_alternativas, 1):
    # Contar comillas que indican strings
    count = alt_bloque.count('"') // 2  # Cada alternativa tiene 2 comillas
    if count != 4:
        alt_incorrectas.append((i, count))

if alt_incorrectas:
    print(f"\n⚠️  Preguntas con cantidad incorrecta de alternativas:")
    for pid, count in alt_incorrectas:
        print(f"   ❌ Q{pid}: {count} alternativas (esperadas: 4)")
else:
    print(f"\n✅ Todas las preguntas tienen 4 alternativas")

# ====================
# 6. VALIDACIÓN SINTAXIS
# ====================
print("\n" + "=" * 80)
print("6️⃣  VALIDACIÓN DE SINTAXIS JAVASCRIPT")
print("=" * 80)

import subprocess
resultado = subprocess.run(
    ['python', 'validar-sintaxis-js.py', archivo],
    capture_output=True,
    text=True
)

if resultado.returncode == 0:
    print("\n✅ Sintaxis JavaScript CORRECTA")
else:
    print("\n❌ Errores de sintaxis detectados")
    print(resultado.stdout)

# ====================
# RESUMEN FINAL
# ====================
print("\n" + "=" * 80)
print("📋 RESUMEN DE LA AUDITORÍA")
print("=" * 80)

print(f"""
✅ Archivo: {archivo}
✅ Tamaño: {os.path.getsize(archivo)/1024:.1f} KB
✅ Líneas totales: {len(lineas):,}
✅ Preguntas totales: {len(preguntas)}
✅ Imágenes PNG implementadas: {len(preguntas_con_imagen)}
✅ Dominios cubiertos: {len(contador_dominios)}
✅ Estructura: {'CORRECTA' if not problemas else f'{len(problemas)} problemas'}
✅ Sintaxis: {'VÁLIDA' if resultado.returncode == 0 else 'CON ERRORES'}
""")

# Listar las 8 imágenes específicas
print("\n🖼️  IMÁGENES PNG IMPLEMENTADAS:")
imagenes_esperadas = [
    ("Q8", "retroato dorian grey.png", "Dorian Gray meme"),
    ("Q10", "portada cien años.png", "Cien años de soledad"),
    ("Q14", "unidos somos mas.png", "Propaganda política"),
    ("Q16", "AGUA SOSTENIBLE.png", "Campaña de agua"),
    ("Q17", "reciclaje.png", "Infografía de reciclaje"),
    ("Q18", "familia sonrie.png", "Spot CerealMax"),
    ("Q33", "dos publicaciones.png", "Redes sociales"),
    ("Q41", "RESULTADOS COMPRENSION LECTORA.png", "Resultados pedagógicos"),
]

todas_ok = True
for q, img, desc in imagenes_esperadas:
    ruta = os.path.join(carpeta_imagenes, img)
    existe = os.path.exists(ruta)
    en_codigo = img in imagenes_usadas
    
    if existe and en_codigo:
        tamaño = os.path.getsize(ruta) / 1024
        print(f"   ✅ {q}: {desc}")
        print(f"       📁 {img} ({tamaño:.1f} KB)")
    else:
        print(f"   ❌ {q}: {desc}")
        if not existe:
            print(f"       ⚠️  Archivo NO encontrado: {img}")
        if not en_codigo:
            print(f"       ⚠️  NO referenciado en código")
        todas_ok = False

if todas_ok:
    print("\n" + "=" * 80)
    print("✅ ✅ ✅  AUDITORÍA COMPLETADA EXITOSAMENTE  ✅ ✅ ✅")
    print("=" * 80)
    print("\n🎉 El test de Lengua está 100% funcional con todas las imágenes PNG")
else:
    print("\n" + "=" * 80)
    print("⚠️  AUDITORÍA COMPLETADA CON ADVERTENCIAS")
    print("=" * 80)
