#!/usr/bin/env python3
"""
Versión FINAL: Contextos con HTML correcto
- Tags <strong> y <em> en lugar de markdown
- <br> para saltos de línea
- Emojis estratégicos
- Estructura clara con secciones
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("🎨 Aplicando formato HTML a contextos...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

def formatear_html(texto):
    """Convierte markdown a HTML y aplica formato profesional"""
    
    # Limpiar
    texto = ' '.join(texto.split())
    
    # Convertir ** a <strong>
    texto = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', texto)
    
    # Convertir _ a <em>
    texto = re.sub(r'_([^_]+)_', r'<em>\1</em>', texto)
    
    # Agregar <br><br> después de emoji de sección
    texto = re.sub(r'(🏫 <strong>Contexto:</strong>)', r'\1<br><br>', texto)
    texto = re.sub(r'(📅 <strong>Situación:</strong>)', r'<br><br>\1<br><br>', texto)
    texto = re.sub(r'(📚 <strong>Fundamento Pedagógico:</strong>)', r'<br><br>\1<br><br>', texto)
    
    # Formatear citas de OAs
    texto = re.sub(r'&gt;\s*💡\s*<em>"([^"]+)"</em>', r'<br><br><span style="background: rgba(59, 130, 246, 0.1); padding: 8px 12px; border-left: 3px solid #3B82F6; display: inline-block; font-style: italic; color: #1E40AF;">💡 "\1"</span><br><br>', texto)
    
    return texto

# Procesar todos los contextos
patron = r'(<p class="text-sm text-blue-800 leading-relaxed">)\s*([\s\S]*?)\s*(</p>)'

contextos = 0

def procesar(match):
    global contextos
    inicio = match.group(1)
    texto = match.group(2).strip()
    fin = match.group(3)
    
    texto_html = formatear_html(texto)
    contextos += 1
    
    return f'{inicio}\n                    {texto_html}\n                  {fin}'

contenido_final = re.sub(patron, procesar, contenido)

print(f"✅ {contextos} contextos formateados con HTML")
print(f"   • Tags <strong> para negritas")
print(f"   • Tags <br> para saltos de línea")
print(f"   • Bloques destacados para citas OAs")
print(f"   • Emojis estratégicos por sección")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_final)

print(f"\n✅ HTML aplicado correctamente")
print(f"📁 {archivo}")
print("\n🚀 Compilar: npm run build")
