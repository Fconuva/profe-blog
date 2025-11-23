"""
Generador de Prueba ECEP Biología 2025
Crea plan.json completo con 52 preguntas distribuidas por dominios
"""
import json

# Estructura base
plan = {
    "title": "Prueba ECEP Biología 2025 - Conocimientos Específicos y Pedagógicos",
    "description": "Evaluación de Conocimientos Específicos y Pedagógicos para profesores de Biología - Educación Media Científico Humanista",
    "year": 2025,
    "totalQuestions": 52,
    "passingScore": 60,
    "domains": [
        {"id": "genetica", "name": "Genética y Herencia", "questions": 26, "color": "purple"},
        {"id": "celula", "name": "Célula y Reproducción Celular", "questions": 13, "color": "blue"},
        {"id": "pedagogia", "name": "Didáctica y Pedagogía", "questions": 8, "color": "green"},
        {"id": "evolucion", "name": "Evolución y Biodiversidad", "questions": 3, "color": "orange"},
        {"id": "inmune", "name": "Sistema Inmune", "questions": 2, "color": "red"}
    ],
    "questions": []
}

# Plantilla base para opciones
def crear_pregunta(id_num, domain, difficulty, stem, options, image=None, pedagogy=None):
    return {
        "id": id_num,
        "domain": domain,
        "difficulty": difficulty,
        "stem": stem,
        "options": options,
        "image": image,
        "pedagogy": pedagogy
    }

def opcion(letra, texto, es_correcta, feedback):
    return {
        "id": letra,
        "text": texto,
        "isCorrect": es_correcta,
        "feedback": feedback
    }

# ==========================================
# PREGUNTAS 1-2 (Ya creadas en el JSON original)
# ==========================================

# Cargar las primeras 2 preguntas del JSON existente
with open(r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json", 'r', encoding='utf-8') as f:
    plan_existente = json.load(f)
    plan['questions'] = plan_existente['questions'][:2]

print(f"✅ Cargadas {len(plan['questions'])} preguntas existentes")

# ==========================================
# GENERAR PREGUNTAS 3-52
# ==========================================

# Contador de respuestas correctas por letra (para distribución equitativa)
contador_correctas = {"a": 0, "b": 0, "c": 0, "d": 0}

# Lista para asignar respuestas correctas de forma equitativa
respuestas_asignadas = ["a"] * 13 + ["b"] * 13 + ["c"] * 13 + ["d"] * 13  # 52 total

# ===== PREGUNTA 3: Genealogía =====
plan['questions'].append(crear_pregunta(
    3, "genetica", "hard",
    "Una profesora de 2° Medio presenta a sus estudiantes la siguiente genealogía de una familia con una enfermedad genética:\n\n<div class='text-center my-4'><img src='/evaluaciones/educacion-media/pruebas/paes-biologia-2023-imagenes/pregunta_3_img_1.png' alt='Genealogía herencia genética' class='max-w-full h-auto mx-auto shadow-lg rounded'/></div>\n\nUn estudiante analiza el pedigrí y concluye: 'Es herencia recesiva ligada al cromosoma X, porque afecta más a hombres que a mujeres'.\n\n¿Cuál de las siguientes intervenciones del docente es más efectiva para que el estudiante identifique su error?",
    [
        opcion("a", "Formular la pregunta: '¿Todas las mujeres portadoras (heterocigotas) transmiten la enfermedad a sus hijos varones?' y solicitar que analice la generación III.", False,
               "❌ <strong>Parcialmente correcta pero no óptima.</strong><br><br>La pregunta es pertinente pero se enfoca solo en transmisión madre-hijo, no aborda el patrón COMPLETO que descarta herencia ligada al X. El estudiante podría responder correctamente sin rectificar su conclusión general.<br><br><strong>Patrón clave:</strong> En herencia recesiva X, padre afectado (X^rY) NO transmite a hijos varones (solo Y), pero SÍ a todas sus hijas (X^r)."),
        opcion("b", "Solicitar que compare el pedigrí con un ejemplo de herencia autosómica recesiva, identificando similitudes en el patrón de afectados (saltos generacionales, padres sanos con hijos afectados).", True,
               "✅ <strong>Correcta.</strong><br><br><strong>Efectiva porque:</strong><br>• Comparación sistemática: identifica saltos generacionales (I→III), padres sanos con hijos afectados (Aa×Aa→25% aa)<br>• Afecta ambos sexos (predominio masculino puede ser azar)<br>• Refuta ligada X: padre afectado (X^rY) tendría TODAS hijas portadoras, NO hijos varones afectados<br><br><strong>Concepto clave:</strong> 'Más hombres' ≠ automáticamente ligada X; puede ser variación estadística en autosómica."),
        opcion("c", "Explicar que en herencia ligada al X, los hombres afectados no pueden tener hijos varones afectados (solo transmiten Y), y solicitar verificar si este patrón se cumple.", False,
               "❌ <strong>Menos efectiva pedagógicamente.</strong><br><br>Proporciona la REGLA directamente (aprendizaje pasivo) sin que el estudiante la deduzca. Puede memorizar sin comprender el mecanismo genético.<br><br><strong>Mejor:</strong> Comparar con autosómica (opción B) permite al estudiante:<br>1. Identificar patrones que SÍ coinciden<br>2. Descubrir por sí mismo que NO coincide con ligada X<br>3. Desarrollar análisis transferible."),
        opcion("d", "Realizar un cuadro de Punnett simulando cruzamiento I₁×I₂ asumiendo herencia ligada X, y comparar resultados teóricos con observados en generación II.", False,
               "❌ <strong>Limitación técnica.</strong><br><br>Para hacer Punnett primero necesitamos SABER genotipos I₁ y I₂. Si asumimos ligada X, tendríamos que deducirlos del pedigrí (lo que la pregunta intenta enseñar). Problema circular: para verificar ligada X mediante Punnett, ya necesitamos haber analizado el pedigrí.<br><br><strong>Mejor:</strong> Comparar patrón observado con patrones conocidos (opción B) es más directo.")
    ],
    "/evaluaciones/educacion-media/pruebas/paes-biologia-2023-imagenes/pregunta_3_img_1.png",
    {"objective": "Analizar patrones de herencia en genealogías", "misconception": "Confundir 'más hombres afectados' con 'herencia ligada al X'", "level": "2° Medio"}
))
contador_correctas["b"] += 1

# ===== PREGUNTA 4: Codominancia =====
plan['questions'].append(crear_pregunta(
    4, "genetica", "medium",
    "Un profesor de 2° Medio está explicando el mecanismo de codominancia y un estudiante solicita un ejemplo concreto.\n\n¿Cuál de los siguientes cruzamientos ilustra de manera más clara el fenómeno de codominancia?",
    [
        opcion("a", "Cruzamiento flores Boca de Dragón: Roja (RR) × Blanca (BB) → F1: 100% Rosadas (RB), donde ambos alelos se expresan parcialmente generando fenotipo intermedio.", False,
               "❌ <strong>Error conceptual:</strong> Esto es <strong>DOMINANCIA INCOMPLETA</strong>, NO codominancia.<br><br><strong>Diferencia:</strong><br>• Dominancia incompleta: alelos se 'mezclan' → fenotipo INTERMEDIO (rosado)<br>• Codominancia: ambos se expresan COMPLETAMENTE y SIMULTÁNEAMENTE → AMBAS características visibles<br><br><strong>Analogía:</strong> Incompleta = mezclar roja+blanca=rosado (nuevo color) | Codominancia = rojas Y blancas visibles (ambos colores)."),
        opcion("b", "Cruzamiento grupos sanguíneos: I^AI^A (tipo A) × I^BI^B (tipo B) → F1: 100% I^AI^B (tipo AB), donde ambos antígenos A y B se expresan simultáneamente en glóbulos rojos.", True,
               "✅ <strong>Correcta.</strong><br><br><strong>Mejor ejemplo de codominancia:</strong><br>• <strong>Expresión simultánea:</strong> Genotipo I^AI^B produce AMBOS antígenos:<br>&nbsp;&nbsp;- I^A → Antígeno A en membrana<br>&nbsp;&nbsp;- I^B → Antígeno B en membrana<br>• <strong>Fenotipo distinguible:</strong> AB ≠ 'mezcla' A y B; es presencia SIMULTÁNEA<br>• Nivel molecular: cada alelo codifica glicosiltransferasa diferente<br><br><strong>Clínico:</strong> AB recibe de A,B,AB,O (receptor universal), dona solo a AB."),
        opcion("c", "Cruzamiento arvejas: Lisa (RR) × Rugosa (rr) → F1: 100% Lisa (Rr), donde alelo dominante R oculta completamente recesivo r.", False,
               "❌ <strong>Error:</strong> Esto es <strong>DOMINANCIA COMPLETA</strong> (Mendel), NO codominancia.<br><br><strong>Dominancia completa:</strong><br>• Genotipo Rr → Fenotipo LISO (solo R se expresa)<br>• Alelo r NO se expresa en heterocigosis<br>• Relación dominante-recesivo clásica<br><br><strong>Comparación:</strong><br>• Dominancia completa (Rr): fenotipo=dominante<br>• Codominancia (I^AI^B): fenotipo=AMBOS expresados<br><br>Si fuera codominancia en arvejas, Rr tendría características VISIBLES de lisa Y rugosa (no ocurre)."),
        opcion("d", "Cruzamiento cobayos: Negro (NN) × Blanco (BB) → F1: 100% Negro (NB), demostrando que Negro es completamente dominante sobre Blanco.", False,
               "❌ <strong>Error:</strong> Esto es <strong>DOMINANCIA COMPLETA</strong>, NO codominancia.<br><br><strong>Análisis:</strong><br>• NB → Fenotipo NEGRO (100%)<br>• N dominante sobre B<br>• B no se expresa en NB<br>• Patrón dominancia/recesividad clásico<br><br><strong>Si fuera codominancia:</strong> NB mostraría AMBOS colores: pelos negros Y blancos mezclados (mosaico/bicolor).<br><br><strong>Ejemplo real codominancia pelaje:</strong> Vacuno Shorthorn (rojo×blanco→ruano con pelos rojos y blancos mezclados).")
    ],
    "/evaluaciones/educacion-media/pruebas/paes-biologia-2023-imagenes/pregunta_4_img_1.png",
    {"objective": "Distinguir codominancia de otros patrones", "misconception": "Confundir codominancia con dominancia incompleta", "level": "2° Medio"}
))
contador_correctas["b"] += 1

print(f"✅ Generadas {len(plan['questions'])} preguntas hasta ahora")
print(f"📊 Distribución correctas: {contador_correctas}")

# Guardar progreso
output_path = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025\plan.json"
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2)

print(f"\n✅ Plan guardado: {output_path}")
print(f"⏳ Faltan {52 - len(plan['questions'])} preguntas por generar")
