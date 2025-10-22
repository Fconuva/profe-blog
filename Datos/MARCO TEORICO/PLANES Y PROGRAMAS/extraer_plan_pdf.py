"""
Script para extraer y estructurar Planes y Programas Ministeriales desde PDF
Uso: python extraer_plan_pdf.py "ruta/al/archivo.pdf"
"""

import sys
import json
import re
from pathlib import Path

try:
    import PyPDF2
except ImportError:
    print("❌ PyPDF2 no está instalado.")
    print("Instala con: pip install PyPDF2")
    sys.exit(1)


def extraer_texto_pdf(ruta_pdf):
    """Extrae todo el texto de un PDF"""
    texto_completo = ""
    
    with open(ruta_pdf, 'rb') as archivo:
        lector = PyPDF2.PdfReader(archivo)
        print(f"📄 Procesando {len(lector.pages)} páginas...")
        
        for i, pagina in enumerate(lector.pages, 1):
            texto = pagina.extract_text()
            texto_completo += texto + "\n"
            print(f"   Página {i}/{len(lector.pages)} procesada")
    
    return texto_completo


def limpiar_texto(texto):
    """Limpia el texto extraído"""
    # Eliminar saltos de línea múltiples
    texto = re.sub(r'\n{3,}', '\n\n', texto)
    # Eliminar espacios múltiples
    texto = re.sub(r' {2,}', ' ', texto)
    return texto


def extraer_unidades(texto):
    """Extrae todas las unidades del plan"""
    unidades = []
    
    # Buscar patrones de unidad
    patron_unidad = r'(?:UNIDAD|Unidad)\s+(\d+)[:\s]*([^\n]+)'
    matches = list(re.finditer(patron_unidad, texto, re.IGNORECASE))
    
    print(f"\n🔍 Encontradas {len(matches)} unidades")
    
    for i, match in enumerate(matches):
        numero_unidad = int(match.group(1))
        nombre_unidad = match.group(2).strip()
        
        # Obtener el texto de esta unidad
        inicio = match.start()
        fin = matches[i + 1].start() if i + 1 < len(matches) else len(texto)
        texto_unidad = texto[inicio:fin]
        
        print(f"\n📚 Unidad {numero_unidad}: {nombre_unidad}")
        
        # Extraer componentes de la unidad
        unidad = {
            "numero": numero_unidad,
            "nombre": f"Unidad {numero_unidad}: {nombre_unidad}",
            "proposito": extraer_proposito(texto_unidad),
            "objetivos": extraer_objetivos(texto_unidad),
            "indicadores": extraer_indicadores(texto_unidad),
            "contenidos": extraer_contenidos(texto_unidad),
            "habilidades": extraer_habilidades(texto_unidad),
            "actitudes": []  # Se llenan después con las generales
        }
        
        print(f"   ✓ {len(unidad['objetivos'])} OA")
        print(f"   ✓ {len(unidad['indicadores'])} indicadores")
        print(f"   ✓ {len(unidad['contenidos'])} contenidos")
        
        unidades.append(unidad)
    
    return unidades


def extraer_proposito(texto):
    """Extrae el propósito de la unidad"""
    patrones = [
        r'(?:Propósito|PROPÓSITO)[:\s]*\n([^\n]+(?:\n(?!Objetivos|OA|Habilidades|Contenidos)[^\n]+)*)',
        r'(?:Resumen de la unidad|RESUMEN)[:\s]*\n([^\n]+(?:\n(?!Objetivos|OA|Habilidades|Contenidos)[^\n]+)*)'
    ]
    
    for patron in patrones:
        match = re.search(patron, texto, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    return "No especificado"


def extraer_objetivos(texto):
    """Extrae los Objetivos de Aprendizaje con su numeración"""
    objetivos = []
    
    # Patrón: OA 1, OA 2, etc.
    patron = r'(?:OA|Objetivo)\s*(\d+)[:\s.]*([^\n]+(?:\n(?!OA\s*\d|Indicadores|Habilidades|Contenidos)[^\n]+)*)'
    matches = re.finditer(patron, texto, re.IGNORECASE)
    
    for match in matches:
        numero = int(match.group(1))
        descripcion = match.group(2).strip()
        descripcion = re.sub(r'\s+', ' ', descripcion)  # Limpiar espacios
        
        objetivos.append({
            "numero": numero,
            "descripcion": descripcion
        })
    
    return objetivos


def extraer_indicadores(texto):
    """Extrae los indicadores de evaluación"""
    indicadores = []
    
    # Buscar sección de indicadores
    patron_seccion = r'(?:Indicadores de evaluación|Indicadores|INDICADORES)[:\s]*\n((?:[-•*]?\s*[^\n]+\n?)+)'
    match = re.search(patron_seccion, texto, re.IGNORECASE)
    
    if match:
        seccion = match.group(1)
        lineas = seccion.split('\n')
        
        for linea in lineas:
            linea = linea.strip()
            if len(linea) > 10:  # Filtrar líneas muy cortas
                # Limpiar viñetas y numeración
                linea = re.sub(r'^[-•*]\s*', '', linea)
                linea = re.sub(r'^\d+[\.)]\s*', '', linea)
                if linea:
                    indicadores.append(linea)
    
    return indicadores


def extraer_contenidos(texto):
    """Extrae los contenidos de la unidad"""
    contenidos = []
    
    patron_seccion = r'(?:Contenidos|CONTENIDOS)[:\s]*\n((?:[-•*]?\s*[^\n]+\n?)+)'
    match = re.search(patron_seccion, texto, re.IGNORECASE)
    
    if match:
        seccion = match.group(1)
        lineas = seccion.split('\n')
        
        for linea in lineas:
            linea = linea.strip()
            if len(linea) > 5:
                linea = re.sub(r'^[-•*]\s*', '', linea)
                linea = re.sub(r'^\d+[\.)]\s*', '', linea)
                if linea and not linea.startswith('Habilidades') and not linea.startswith('Indicadores'):
                    contenidos.append(linea)
    
    return contenidos


def extraer_habilidades(texto):
    """Extrae las habilidades"""
    habilidades = []
    
    patron_seccion = r'(?:Habilidades|HABILIDADES)[:\s]*\n((?:[-•*]?\s*[^\n]+\n?)+)'
    match = re.search(patron_seccion, texto, re.IGNORECASE)
    
    if match:
        seccion = match.group(1)
        lineas = seccion.split('\n')
        
        for linea in lineas:
            linea = linea.strip()
            if len(linea) > 5:
                linea = re.sub(r'^[-•*]\s*', '', linea)
                linea = re.sub(r'^\d+[\.)]\s*', '', linea)
                if linea and not linea.startswith('Actitudes') and not linea.startswith('Indicadores'):
                    habilidades.append(linea)
    
    return habilidades


def extraer_actitudes_generales(texto):
    """Extrae las actitudes generales del nivel"""
    actitudes = []
    
    # Las actitudes suelen estar al principio del documento
    patron_seccion = r'(?:Actitudes|ACTITUDES)[:\s]*\n((?:[-•*]?\s*[^\n]+\n?){1,20})'
    match = re.search(patron_seccion, texto[:5000], re.IGNORECASE)  # Buscar en las primeras páginas
    
    if match:
        seccion = match.group(1)
        lineas = seccion.split('\n')
        
        for linea in lineas:
            linea = linea.strip()
            if len(linea) > 10:
                linea = re.sub(r'^[A-Z]\)', '', linea)  # Remover letras como "A)", "B)"
                linea = re.sub(r'^[-•*]\s*', '', linea)
                linea = re.sub(r'^\d+[\.)]\s*', '', linea)
                if linea and not linea.startswith('Unidad'):
                    actitudes.append(linea)
    
    return actitudes


def procesar_plan_ministerial(ruta_pdf, nivel, asignatura):
    """Procesa un PDF ministerial y genera la estructura JSON"""
    
    print(f"\n{'='*60}")
    print(f"📚 Extractor de Planes y Programas Ministeriales")
    print(f"{'='*60}")
    print(f"Archivo: {Path(ruta_pdf).name}")
    print(f"Nivel: {nivel}")
    print(f"Asignatura: {asignatura}")
    print(f"{'='*60}\n")
    
    # Extraer texto del PDF
    texto = extraer_texto_pdf(ruta_pdf)
    texto = limpiar_texto(texto)
    
    print(f"\n✅ Texto extraído: {len(texto)} caracteres")
    
    # Extraer actitudes generales
    print("\n🎯 Extrayendo actitudes generales...")
    actitudes_generales = extraer_actitudes_generales(texto)
    print(f"   ✓ {len(actitudes_generales)} actitudes encontradas")
    
    # Extraer unidades
    print("\n📖 Extrayendo unidades...")
    unidades = extraer_unidades(texto)
    
    # Asignar actitudes a cada unidad
    for unidad in unidades:
        unidad['actitudes'] = actitudes_generales
    
    # Crear estructura final
    plan = {
        "nivel": nivel,
        "asignatura": asignatura,
        "fechaExtraccion": "2025-10-19",
        "fuente": "PDF Ministerial",
        "unidades": unidades,
        "actitudesGenerales": actitudes_generales,
        "totalUnidades": len(unidades),
        "totalOA": sum(len(u['objetivos']) for u in unidades),
        "totalIndicadores": sum(len(u['indicadores']) for u in unidades)
    }
    
    print(f"\n{'='*60}")
    print(f"✅ EXTRACCIÓN COMPLETADA")
    print(f"{'='*60}")
    print(f"Unidades: {plan['totalUnidades']}")
    print(f"OA totales: {plan['totalOA']}")
    print(f"Indicadores totales: {plan['totalIndicadores']}")
    print(f"Actitudes: {len(actitudes_generales)}")
    print(f"{'='*60}\n")
    
    return plan


def guardar_json(plan, ruta_salida):
    """Guarda el plan en formato JSON"""
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(plan, f, ensure_ascii=False, indent=2)
    
    print(f"💾 Guardado en: {ruta_salida}")


def main():
    if len(sys.argv) < 2:
        print("Uso: python extraer_plan_pdf.py <archivo.pdf> [nivel] [asignatura]")
        print("\nEjemplo:")
        print('  python extraer_plan_pdf.py "Lenguaje 5.pdf" "5° Básico" "Lenguaje y Comunicación"')
        sys.exit(1)
    
    ruta_pdf = sys.argv[1]
    nivel = sys.argv[2] if len(sys.argv) > 2 else "5° Básico"
    asignatura = sys.argv[3] if len(sys.argv) > 3 else "Lenguaje y Comunicación"
    
    if not Path(ruta_pdf).exists():
        print(f"❌ Error: No se encontró el archivo {ruta_pdf}")
        sys.exit(1)
    
    # Procesar PDF
    plan = procesar_plan_ministerial(ruta_pdf, nivel, asignatura)
    
    # Guardar JSON
    nombre_salida = f"plan_{nivel.replace('°', '').replace(' ', '_')}_{asignatura.replace(' ', '_')}.json"
    guardar_json(plan, nombre_salida)
    
    print("\n✅ Proceso completado exitosamente!")
    print(f"\n💡 Ahora puedes importar '{nombre_salida}' en el gestor web.")


if __name__ == "__main__":
    main()
