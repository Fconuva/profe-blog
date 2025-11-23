#!/usr/bin/env python3
"""
Mejorar TODOS los contextos de parv-nt con:
- Saltos de párrafo lógicos
- Negritas en conceptos clave
- Emojis relevantes
- Mejor estructura legible
"""

import re

archivo = r"evaluaciones\educacion-parvularia\pruebas\parv-nt\index.njk"

print("✨ Mejorando contextos pedagógicos...\n")

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

def mejorar_contexto(texto):
    """
    Aplica mejoras de formato a un contexto pedagógico
    """
    # Eliminar espacios extras
    texto = ' '.join(texto.split())
    
    # 1. Separar información del educador/a (primer párrafo)
    # Patrón: "La educadora X trabaja en..."
    texto = re.sub(
        r'^(La? educadora? \w+ trabaja en [^.]+\.[^.]+\.)',
        r'👩‍🏫 \1\n\n',
        texto
    )
    
    # 2. Resaltar "Objetivo de Aprendizaje" y números de OA
    texto = re.sub(r'Objetivo de Aprendizaje (\d+)', r'**Objetivo de Aprendizaje \1**', texto)
    texto = re.sub(r'OA (\d+)', r'**OA \1**', texto)
    texto = re.sub(r'BCEP 2018', r'**BCEP 2018**', texto)
    
    # 3. Resaltar núcleos y ámbitos
    nucleos = [
        'Identidad y Autonomía', 'Convivencia y Ciudadanía', 
        'Pensamiento Matemático', 'Lenguaje Verbal', 'Lenguajes Artísticos',
        'Corporalidad y Movimiento', 'Exploración del Entorno Natural',
        'Comprensión del Entorno Sociocultural'
    ]
    for nucleo in nucleos:
        texto = re.sub(f'núcleo {nucleo}', f'núcleo **{nucleo}**', texto)
    
    # 4. Resaltar nombres de lugares y personas (entre comillas cuando están)
    texto = re.sub(r"jardín infantil '([^']+)'", r"jardín infantil **'\1'**", texto)
    
    # 5. Separar citas textuales de OAs en nuevo párrafo
    # Patrón: ': 'texto entre comillas simples''
    texto = re.sub(
        r": '([^']+)'(\.)?\s+",
        r":\n\n📌 _'\1'_\n\n",
        texto
    )
    
    # 6. Agregar emojis contextuales según palabras clave
    emojis_map = {
        r'\bllora(ndo|r)?\b': '😢',
        r'\balegr(e|ía)\b': '😊',
        r'\bmiedo\b': '😨',
        r'\bjueg(o|an|ando)\b': '🎮',
        r'\bconflicto\b': '⚠️',
        r'\bcompartir\b': '🤝',
        r'\bmatemática\b': '🔢',
        r'\bnúmero(s)?\b': '🔢',
        r'\bpatrón|patriones\b': '🔄',
        r'\blectura\b': '📚',
        r'\bcuento\b': '📖',
        r'\barte\b': '🎨',
        r'\bmúsica\b': '🎵',
        r'\bnaturaleza\b': '🌿',
        r'\bplantas?\b': '🌱',
        r'\banimales?\b': '🐾',
        r'\bfamilia\b': '👨‍👩‍👧‍👦',
    }
    
    # Aplicar emojis solo una vez por contexto
    for patron, emoji in emojis_map.items():
        if re.search(patron, texto, re.IGNORECASE) and emoji not in texto:
            texto = re.sub(patron, f'{emoji} \\g<0>', texto, count=1, flags=re.IGNORECASE)
    
    # 7. Separar reflexiones finales (oraciones que empiezan con "Mónica/Juan/etc sabe/considera/reflexiona")
    texto = re.sub(
        r'(\w+)\s+(sabe|considera|reflexiona|necesita|observa)\s+que\s+',
        r'\n\n💭 **Reflexión pedagógica**: \1 \2 que ',
        texto
    )
    
    return texto.strip()

# Encontrar todos los contextos pedagógicos
patron_contexto = r'(<p class="text-sm text-blue-800 leading-relaxed">)([\s\S]*?)(</p>)'

def reemplazar_contexto(match):
    inicio = match.group(1)
    contexto_original = match.group(2).strip()
    fin = match.group(3)
    
    # Mejorar contexto
    contexto_mejorado = mejorar_contexto(contexto_original)
    
    return f'{inicio}\n                    {contexto_mejorado}\n                  {fin}'

# Aplicar mejoras a todos los contextos
contenido_mejorado = re.sub(patron_contexto, reemplazar_contexto, contenido)

# Contar contextos mejorados
contextos_mejorados = len(re.findall(patron_contexto, contenido))

print(f"✅ Mejorados {contextos_mejorados} contextos pedagógicos")
print(f"   • Agregados emojis contextuales")
print(f"   • Aplicadas negritas en conceptos clave")
print(f"   • Separados párrafos lógicamente")
print(f"   • Resaltados OAs y BCEP 2018")

# Guardar
with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_mejorado)

print(f"\n✅ Archivo mejorado exitosamente")
print(f"📁 {archivo}")
print("\n🚀 Próximo paso: npm run build")
