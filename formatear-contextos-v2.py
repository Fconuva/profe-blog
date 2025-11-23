#!/usr/bin/env python3
"""
Versión 2: Mejorar contextos con formato profesional
- Párrafos cortos y claros
- Emojis estratégicos al inicio de cada sección
- Negritas en conceptos clave
- Estructura: Contexto → Situación → Fundamento pedagógico
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("✨ Aplicando formato profesional a contextos...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

def formatear_contexto_profesional(texto):
    """
    Formatea el contexto con estructura clara y emojis estratégicos
    """
    # Limpiar espacios
    texto = ' '.join(texto.split())
    
    # 1. SECCIÓN INICIAL: Educador/a y contexto
    # Buscar patrón inicial: "La educadora X trabaja en..."
    texto = re.sub(
        r'^(👩‍🏫 )?La educadora (\w+) trabaja en ([^.]+)\.\s*',
        r'**🏫 Contexto:**\n\nLa educadora **\2** trabaja en \3.\n\n',
        texto
    )
    texto = re.sub(
        r'^(👩‍🏫 )?El educador (\w+) trabaja en ([^.]+)\.\s*',
        r'**🏫 Contexto:**\n\nEl educador **\2** trabaja en \3.\n\n',
        texto
    )
    
    # 2. SITUACIÓN ESPECÍFICA: "Durante..., observa que..."
    texto = re.sub(
        r'Durante ([^.]+)\.\s*',
        r'**📅 Situación:** Durante \1.\n\n',
        texto,
        count=1
    )
    
    # 3. Resaltar nombres de niños entre paréntesis
    texto = re.sub(r'(\w+)\s+\((\d+\s+años?,\s+NT[12])\)', r'**\1** (\2)', texto)
    
    # 4. Separar fundamento pedagógico (OAs)
    texto = re.sub(
        r'(💭\s+\*\*Reflexión pedagógica\*\*:\s+\w+\s+(sabe|considera|reflexiona|necesita)\s+que)',
        r'\n**📚 Fundamento Pedagógico:**\n\n',
        texto
    )
    
    # Si no se aplicó el patrón anterior, buscar alternativas
    if '**📚 Fundamento Pedagógico:**' not in texto:
        texto = re.sub(
            r'(\w+)\s+(sabe|considera|reflexiona|necesita|observa)\s+que\s+',
            r'\n**📚 Fundamento Pedagógico:**\n\n',
            texto,
            count=1
        )
    
    # 5. Resaltar OAs con formato especial
    texto = re.sub(
        r'Objetivo de Aprendizaje (\d+)',
        r'**OA \1**',
        texto
    )
    
    # 6. Separar citas de OAs en bloques destacados
    texto = re.sub(
        r':\s*📌\s*_\'([^\']+)\'_',
        r':\n\n> 💡 _"\1"_',
        texto
    )
    
    # Si no hay emoji de libro, agregarlo al inicio
    if not texto.startswith('**🏫'):
        texto = '**🏫 Contexto:**\n\n' + texto
    
    return texto.strip()

# Encontrar y reemplazar todos los contextos
patron = r'(<p class="text-sm text-blue-800 leading-relaxed">)\s*([\s\S]*?)\s*(</p>)'

contextos_procesados = 0

def procesar_match(match):
    global contextos_procesados
    inicio = match.group(1)
    contexto = match.group(2).strip()
    fin = match.group(3)
    
    # Aplicar formato
    contexto_formateado = formatear_contexto_profesional(contexto)
    contextos_procesados += 1
    
    return f'{inicio}\n                    {contexto_formateado}\n                  {fin}'

contenido_formateado = re.sub(patron, procesar_match, contenido)

print(f"✅ {contextos_procesados} contextos formateados profesionalmente")
print(f"   📋 Estructura: Contexto → Situación → Fundamento")
print(f"   💫 Emojis estratégicos por sección")
print(f"   🔤 Negritas en nombres y conceptos clave")
print(f"   📐 Párrafos separados lógicamente")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_formateado)

print(f"\n✅ Archivo actualizado")
print(f"📁 {archivo}")
print("\n🚀 Próximo paso: npm run build && verificar")
