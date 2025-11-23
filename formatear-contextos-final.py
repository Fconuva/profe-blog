#!/usr/bin/env python3
"""
Mejorar contextos con HTML limpio - CUIDANDO EL FRONT MATTER
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("🎨 Formateando contextos (respetando estructura)...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

def formatear_contexto(texto):
    """Formato profesional con HTML limpio"""
    
    # 1. Agregar<br><br> entre secciones
    texto = re.sub(
        r'(<strong>🏫 Contexto:</strong>)',
        r'\1<br><br>',
        texto
    )
    
    texto = re.sub(
        r'(<strong>📅 Situación:</strong>)',
        r'<br><br>\1<br><br>',
        texto
    )
    
    texto = re.sub(
        r'(<strong>📚 Fundamento Pedagógico:</strong>)',
        r'<br><br>\1<br><br>',
        texto
    )
    
    # 2. Limpiar ** sobrantes
    texto = re.sub(r'\*\*<strong>', '<strong>', texto)
    texto = re.sub(r'</strong>\*\*', '</strong>', texto)
    texto = re.sub(r'\*\*', '', texto)
    
    # 3. Formatear bloques de citas de OAs
    texto = re.sub(
        r'&gt;\s*💡\s*<em>"([^"]+)"</em>',
        r'<br><br><div style="background: rgba(59, 130, 246, 0.1); padding: 12px; border-left: 4px solid #3B82F6; margin: 8px 0; border-radius: 4px;"><strong>💡 Objetivo de Aprendizaje:</strong><br><em>"\1"</em></div><br>',
        texto
    )
    
    return texto

# Procesar solo los contextos (dentro de <p class="text-sm text-blue-800...)
patron = r'(<p class="text-sm text-blue-800 leading-relaxed">\s*)([\s\S]*?)(\s*</p>)'

def procesar_contexto(match):
    apertura = match.group(1)
    contenido_context = match.group(2)
    cierre = match.group(3)
    
    contexto_formateado = formatear_contexto(contenido_context)
    
    return f'{apertura}\n{contexto_formateado}\n{cierre}'

contenido_mejorado = re.sub(patron, procesar_contexto, contenido)

print("✅ Contextos formateados")
print("   • <br> para separar secciones")
print("   • <strong> para negritas")
print("   • <div> para bloques de OAs")
print("   • Limpieza de ** sobrantes")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_mejorado)

print(f"\n✅ Archivo guardado")
print(f"📁 {archivo}")
print("\n🚀 npm run build")
