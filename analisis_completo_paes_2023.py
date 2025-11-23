import fitz  # PyMuPDF
import re
import json

# Ruta del PDF
pdf_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\EM-B(23)-salida.pdf"

# Abrir PDF
doc = fitz.open(pdf_path)

# Extraer todo el texto
texto_completo = ""
for page in doc:
    texto_completo += page.get_text()

doc.close()

# Dividir por preguntas (formato: número seguido de .-)
preguntas = re.split(r'\n(\d+)\.-', texto_completo)

# Procesar preguntas
analisis = {
    "total_preguntas": 0,
    "preguntas": []
}

# Saltar el primer elemento (texto antes de primera pregunta)
for i in range(1, len(preguntas), 2):
    if i + 1 < len(preguntas):
        num_pregunta = preguntas[i]
        contenido = preguntas[i + 1]
        
        # Contar palabras del contexto/stem
        palabras_contexto = len(contenido.split())
        
        # Detectar si tiene imagen (buscar referencias a gráficos, esquemas, etc.)
        tiene_imagen = bool(re.search(r'(figura|gráfico|esquema|imagen|siguiente|tabla|árbol genealógico|diagrama)', contenido, re.IGNORECASE))
        
        # Detectar opciones (A, B, C, D)
        opciones = re.findall(r'^[ABCD]\s', contenido, re.MULTILINE)
        num_opciones = len(opciones)
        
        # Detectar tema (palabras clave)
        temas = []
        if re.search(r'(evolución|Darwin|Lamarck|selección natural)', contenido, re.IGNORECASE):
            temas.append("Evolución")
        if re.search(r'(genética|herencia|cromosoma|gen|ADN|ARN|meiosis|mitosis)', contenido, re.IGNORECASE):
            temas.append("Genética")
        if re.search(r'(célula|citoplasma|núcleo|membrana|orgánulo)', contenido, re.IGNORECASE):
            temas.append("Célula")
        if re.search(r'(inmun|anticuerpo|IgG|IgM|linfocito)', contenido, re.IGNORECASE):
            temas.append("Sistema Inmune")
        if re.search(r'(proteína|aminoácido|traducción|transcripción)', contenido, re.IGNORECASE):
            temas.append("Biología Molecular")
        if re.search(r'(ecosistema|población|comunidad|biodiversidad|nicho)', contenido, re.IGNORECASE):
            temas.append("Ecología")
        if re.search(r'(actividad|planificación|estudiante|docente|enseñanza|aprendizaje)', contenido, re.IGNORECASE):
            temas.append("Pedagogía")
        
        # Tipo de pregunta
        tipo = "Desconocido"
        if re.search(r'(cuál de las siguientes|qué|cuál)', contenido, re.IGNORECASE):
            tipo = "Selección múltiple conceptual"
        if re.search(r'(actividad|intervención|ejemplo|estrategia)', contenido, re.IGNORECASE):
            tipo = "Caso pedagógico"
        
        # Guardar análisis
        analisis["preguntas"].append({
            "numero": num_pregunta,
            "palabras_contexto": palabras_contexto,
            "tiene_imagen": tiene_imagen,
            "num_opciones": num_opciones,
            "temas": temas if temas else ["General"],
            "tipo": tipo,
            "extracto": contenido[:200].strip() + "..."
        })
        
        analisis["total_preguntas"] += 1

# Guardar análisis en JSON
output_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\analisis_paes_2023.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(analisis, f, ensure_ascii=False, indent=2)

# Mostrar resumen
print("="*80)
print("ANÁLISIS PRUEBA PAES BIOLOGÍA 2023")
print("="*80)
print(f"\nTotal preguntas: {analisis['total_preguntas']}")

# Estadísticas
palabras_promedio = sum(p['palabras_contexto'] for p in analisis['preguntas']) / len(analisis['preguntas'])
preguntas_con_imagen = sum(1 for p in analisis['preguntas'] if p['tiene_imagen'])

print(f"\nPalabras promedio por pregunta: {palabras_promedio:.0f}")
print(f"Preguntas con imagen: {preguntas_con_imagen} ({preguntas_con_imagen/analisis['total_preguntas']*100:.1f}%)")

# Temas más frecuentes
todos_temas = []
for p in analisis['preguntas']:
    todos_temas.extend(p['temas'])

from collections import Counter
conteo_temas = Counter(todos_temas)

print("\n--- DISTRIBUCIÓN DE TEMAS ---")
for tema, count in conteo_temas.most_common():
    print(f"  {tema}: {count} preguntas ({count/analisis['total_preguntas']*100:.1f}%)")

print("\n--- PRIMERAS 10 PREGUNTAS (MUESTRA) ---")
for i, p in enumerate(analisis['preguntas'][:10]):
    print(f"\nPregunta {p['numero']}:")
    print(f"  • Palabras: {p['palabras_contexto']}")
    print(f"  • Imagen: {'Sí' if p['tiene_imagen'] else 'No'}")
    print(f"  • Opciones: {p['num_opciones']}")
    print(f"  • Temas: {', '.join(p['temas'])}")
    print(f"  • Tipo: {p['tipo']}")
    print(f"  • Extracto: {p['extracto'][:150]}...")

print(f"\n{'='*80}")
print(f"Análisis completo guardado en: {output_path}")
