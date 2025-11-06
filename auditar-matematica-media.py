"""
AUDITORÍA: Evaluación Matemática Educación Media vs Temario Oficial ECEP 2025
Verifica cobertura del 100% de contenidos del temario oficial MINEDUC
"""

import json
from collections import defaultdict

# TEMARIO OFICIAL ECEP 2025 - EDUCACIÓN MEDIA MATEMÁTICA
TEMARIO_OFICIAL = {
    "DOMINIO 1: NÚMEROS": {
        "subdominios": {
            "1.1. Sistemas Numéricos": [
                "Caracterizar números reales, racionales e irracionales",
                "Ordenar y comparar números reales",
                "Resolver problemas aplicando propiedades de números reales",
                "Resolver problemas con números complejos (suma, resta, multiplicación, división)",
                "Aplicar concepto de conjugado y módulo de números complejos"
            ],
            "1.2. Potencias, Raíces y Logaritmos": [
                "Relacionar potencias, raíces enésimas y logaritmos",
                "Resolver operaciones con potencias, raíces y/o logaritmos aplicando propiedades",
                "Resolver problemas modelando con potencias, raíces y/o logaritmos"
            ]
        }
    },
    "DOMINIO 2: ÁLGEBRA": {
        "subdominios": {
            "2.1. Funciones": [
                "Identificar y determinar asíntotas verticales y horizontales",
                "Representar composición de funciones",
                "Determinar función inversa (lineal, afín, cuadrática, raíz cuadrada, logarítmica, exponencial)",
                "Identificar ejes y puntos de simetría en funciones",
                "Relacionar raíces de ecuación cuadrática con gráfica y parámetros (discriminante)",
                "Resolver problemas con ecuaciones de segundo grado",
                "Identificar gráfica de función raíz cuadrada",
                "Resolver problemas con funciones logarítmica o exponencial"
            ],
            "2.2. Ecuaciones, Inecuaciones y Sistemas": [
                "Traducir problemas a sistemas de ecuaciones",
                "Resolver problemas con sistemas de ecuaciones lineales",
                "Resolver problemas con inecuaciones o sistemas de inecuaciones lineales",
                "Resolver inecuaciones cuadráticas, fraccionarias y/o con valor absoluto"
            ]
        }
    },
    "DOMINIO 3: GEOMETRÍA": {
        "subdominios": {
            "3.1. Ángulos en la Circunferencia": [
                "Relacionar propiedades de ángulos en circunferencia usando congruencia y semejanza"
            ],
            "3.2. Semejanza y Proporcionalidad": [
                "Resolver problemas aplicando razones trigonométricas",
                "Caracterizar propiedades de figuras semejantes/congruentes en homotecias",
                "Resolver problemas con teorema de Euclides sobre trazos proporcionales"
            ],
            "3.3. Áreas, Volúmenes y Cuerpos Geométricos": [
                "Calcular volúmenes y áreas de cuerpos por rotación o traslación",
                "Resolver problemas con áreas y volúmenes verificando conjeturas",
                "Determinar perímetro y áreas de segmentos y sectores circulares",
                "Resolver problemas con volúmenes de conos y/o esferas, áreas de regiones circulares"
            ],
            "3.4. Vectores": [
                "Representar homotecias en forma vectorial como producto vector por escalar"
            ]
        }
    },
    "DOMINIO 4: DATOS Y AZAR": {
        "subdominios": {
            "4.1. Estadística": [
                "Comparar muestras usando medidas de tendencia central y dispersión",
                "Comparar muestras usando medidas de posición (cuartiles, percentiles)",
                "Interpretar probabilidades en lenguaje de variables aleatorias"
            ],
            "4.2. Probabilidad": [
                "Relacionar distribución teórica y empírica de variable aleatoria",
                "Determinar probabilidades dada función de probabilidad de variable aleatoria discreta",
                "Resolver problemas con probabilidades usando modelo de Laplace",
                "Resolver problemas con sucesos dependientes/independientes y probabilidad condicionada",
                "Evaluar situaciones representables por distribución binomial o normal",
                "Resolver problemas aplicando modelo normal para calcular probabilidades"
            ]
        }
    },
    "DOMINIO 5: ENSEÑANZA-APRENDIZAJE": {
        "subdominios": {
            "5.1. Estrategias de enseñanza": [
                "Determinar estrategias metodológicas para objetivos/habilidades de Matemática",
                "Determinar formas de representar contenidos (analogías, ejemplos, demostraciones)",
                "Decidir intervenciones docentes que favorecen aprendizaje en clase",
                "Seleccionar recursos didácticos apropiados (físicos o digitales)",
                "Evaluar estrategias según énfasis curriculares de Matemática",
                "Distinguir estrategias para enfrentar dificultades de aprendizaje"
            ],
            "5.2. Aprendizaje": [
                "Identificar conocimientos previos requeridos para aprendizajes",
                "Inferir dificultades en aprendizaje a partir de respuestas erróneas"
            ],
            "5.3. Evaluación": [
                "Identificar indicadores que dan cuenta de objetivos de aprendizaje",
                "Caracterizar prácticas que retroalimentan formativamente el aprendizaje"
            ]
        }
    }
}

def cargar_plan():
    """Carga el plan.json de la evaluación actual"""
    with open('evaluaciones/educacion-media/pruebas/67-cm-m/plan.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def buscar_cobertura(preguntas):
    """Analiza qué objetivos del temario están cubiertos"""
    
    # Palabras clave para cada objetivo
    keywords_map = {
        # DOMINIO 1: NÚMEROS
        "Caracterizar números reales, racionales e irracionales": ["real", "racional", "irracional", "conjunto", "número"],
        "Ordenar y comparar números reales": ["orden", "comparar", "mayor", "menor", "recta numérica"],
        "Resolver problemas aplicando propiedades de números reales": ["propiedad", "conmutativa", "asociativa", "distributiva"],
        "Resolver problemas con números complejos": ["complejo", "imaginario", "i", "conjugado", "módulo", "parte real", "parte imaginaria"],
        "Aplicar concepto de conjugado y módulo": ["conjugado", "módulo", "|z|", "complejo conjugado"],
        
        # Potencias, Raíces, Logaritmos
        "Relacionar potencias, raíces enésimas y logaritmos": ["logaritmo", "log", "ln", "potencia", "raíz", "exponente"],
        "Resolver operaciones con potencias, raíces y/o logaritmos": ["potencia", "raíz", "logaritmo", "propiedad"],
        "Resolver problemas modelando con potencias, raíces y/o logaritmos": ["potencia", "raíz", "logaritmo", "modelo"],
        
        # DOMINIO 2: ÁLGEBRA
        "Identificar y determinar asíntotas": ["asíntota", "vertical", "horizontal", "límite"],
        "Representar composición de funciones": ["composición", "f(g(x))", "compuesta"],
        "Determinar función inversa": ["inversa", "f⁻¹", "inyectiva", "biyectiva"],
        "Identificar ejes y puntos de simetría": ["simetría", "eje", "simétrico", "par", "impar"],
        "Relacionar raíces con discriminante": ["discriminante", "Δ", "b²-4ac", "raíz", "solución"],
        "Resolver problemas con ecuaciones cuadráticas": ["ecuación", "cuadrática", "segundo grado", "x²"],
        "Identificar gráfica de función raíz cuadrada": ["raíz cuadrada", "√", "radical"],
        "Resolver problemas con logarítmica/exponencial": ["logarítmica", "exponencial", "log", "e^x"],
        
        # Ecuaciones, Inecuaciones
        "Traducir problemas a sistemas": ["sistema", "ecuación", "incógnita", "traducir"],
        "Resolver sistemas de ecuaciones lineales": ["sistema", "ecuación", "lineal", "solución"],
        "Resolver inecuaciones lineales": ["inecuación", "desigualdad", "<", ">", "≤", "≥"],
        "Resolver inecuaciones complejas": ["inecuación", "cuadrática", "fraccionaria", "valor absoluto"],
        
        # DOMINIO 3: GEOMETRÍA
        "Ángulos en circunferencia": ["ángulo", "circunferencia", "inscrito", "central", "arco"],
        "Razones trigonométricas": ["seno", "coseno", "tangente", "sen", "cos", "tan", "trigonométrica"],
        "Figuras semejantes en homotecias": ["semejanza", "homotecia", "razón", "escala"],
        "Teorema de Euclides": ["Euclides", "trazos proporcionales", "altura", "catetos"],
        "Volúmenes por rotación/traslación": ["rotación", "traslación", "volumen", "sólido"],
        "Áreas y volúmenes verificando conjeturas": ["volumen", "área", "conjetura"],
        "Sectores y segmentos circulares": ["sector circular", "segmento circular", "ángulo central"],
        "Conos y esferas": ["cono", "esfera", "volumen", "superficie"],
        "Vectores y homotecias": ["vector", "homotecia", "escalar", "producto"],
        
        # DOMINIO 4: DATOS Y AZAR
        "Medidas de tendencia y dispersión": ["media", "mediana", "moda", "desviación", "varianza", "rango"],
        "Medidas de posición": ["cuartil", "percentil", "Q1", "Q2", "Q3"],
        "Variables aleatorias": ["variable aleatoria", "distribución", "valor esperado"],
        "Distribución teórica vs empírica": ["distribución", "teórica", "empírica", "frecuencia"],
        "Función de probabilidad discreta": ["probabilidad", "discreta", "función", "P(X=x)"],
        "Modelo de Laplace": ["Laplace", "casos favorables", "casos posibles"],
        "Probabilidad condicionada": ["condicional", "condicionada", "dado que", "P(A|B)"],
        "Sucesos dependientes e independientes": ["independiente", "dependiente", "P(A∩B)"],
        "Distribución binomial": ["binomial", "Bernoulli", "n ensayos", "éxito"],
        "Distribución normal": ["normal", "gaussiana", "campana", "μ", "σ", "Z"],
        
        # DOMINIO 5: ENSEÑANZA-APRENDIZAJE
        "Estrategias metodológicas": ["estrategia", "metodología", "enseñanza", "didáctica"],
        "Representaciones de contenidos": ["representación", "analogía", "ejemplo", "demostración"],
        "Intervenciones docentes": ["intervención", "docente", "profesor", "retroalimentación"],
        "Recursos didácticos": ["recurso", "material", "software", "manipulativo"],
        "Énfasis curriculares": ["currículum", "bases curriculares", "objetivo"],
        "Dificultades de aprendizaje": ["dificultad", "error", "obstáculo", "misconception"],
        "Conocimientos previos": ["previo", "prerrequisito", "conocimiento base"],
        "Inferir dificultades": ["error", "dificultad", "respuesta incorrecta", "confusión"],
        "Indicadores de evaluación": ["indicador", "criterio", "evaluación", "desempeño"],
        "Retroalimentación formativa": ["retroalimentación", "feedback", "formativa", "formativo"]
    }
    
    cobertura = defaultdict(list)
    faltantes = []
    
    for dominio, data in TEMARIO_OFICIAL.items():
        for subdominio, objetivos in data["subdominios"].items():
            for objetivo in objetivos:
                # Buscar palabras clave en preguntas
                encontrado = False
                preguntas_relacionadas = []
                
                # Obtener keywords para este objetivo
                keywords = []
                for key_obj, key_words in keywords_map.items():
                    if key_obj in objetivo or objetivo in key_obj:
                        keywords = key_words
                        break
                
                for pregunta in preguntas:
                    texto_completo = (
                        pregunta.get('enunciado', '') + ' ' +
                        pregunta.get('explicacion', '') + ' ' +
                        ' '.join([tema for tema in pregunta.get('temas_relacionados', [])])
                    ).lower()
                    
                    # Verificar si alguna keyword aparece
                    if any(kw.lower() in texto_completo for kw in keywords):
                        encontrado = True
                        preguntas_relacionadas.append(pregunta.get('id', 'sin-id'))
                
                if encontrado:
                    cobertura[dominio + " → " + subdominio].append({
                        "objetivo": objetivo,
                        "preguntas": preguntas_relacionadas
                    })
                else:
                    faltantes.append({
                        "dominio": dominio,
                        "subdominio": subdominio,
                        "objetivo": objetivo,
                        "keywords": keywords
                    })
    
    return cobertura, faltantes

def generar_reporte():
    """Genera reporte completo de auditoría"""
    
    print("="*70)
    print("🔍 AUDITORÍA: MATEMÁTICA EDUCACIÓN MEDIA vs TEMARIO ECEP 2025")
    print("="*70)
    
    plan = cargar_plan()
    preguntas = plan['exam']['preguntas']
    
    print(f"\n📊 EVALUACIÓN ACTUAL:")
    print(f"   - Total preguntas: {len(preguntas)}")
    print(f"   - Distribución: {plan['metadata']['distribucion']}")
    
    cobertura, faltantes = buscar_cobertura(preguntas)
    
    # Calcular totales
    total_objetivos = sum(
        len(data["subdominios"][sub]) 
        for data in TEMARIO_OFICIAL.values() 
        for sub in data["subdominios"]
    )
    
    objetivos_cubiertos = sum(len(items) for items in cobertura.values())
    porcentaje = (objetivos_cubiertos / total_objetivos) * 100
    
    print(f"\n✅ COBERTURA GENERAL:")
    print(f"   - Objetivos cubiertos: {objetivos_cubiertos}/{total_objetivos}")
    print(f"   - Porcentaje: {porcentaje:.1f}%")
    
    print(f"\n📋 COBERTURA POR DOMINIO:")
    for dominio_sub, items in sorted(cobertura.items()):
        print(f"\n   {dominio_sub}")
        for item in items:
            print(f"      ✓ {item['objetivo'][:80]}...")
            print(f"        Preguntas: {', '.join(item['preguntas'][:5])}")
    
    if faltantes:
        print(f"\n❌ CONTENIDOS FALTANTES ({len(faltantes)}):")
        for falta in faltantes:
            print(f"\n   📍 {falta['dominio']}")
            print(f"      Subdominio: {falta['subdominio']}")
            print(f"      ➤ {falta['objetivo']}")
            print(f"      Keywords: {', '.join(falta['keywords'][:8])}")
    
    # Guardar reporte
    with open('AUDITORIA-MATEMATICA-MEDIA.txt', 'w', encoding='utf-8') as f:
        f.write("="*70 + "\n")
        f.write("AUDITORÍA: MATEMÁTICA EDUCACIÓN MEDIA - TEMARIO ECEP 2025\n")
        f.write("="*70 + "\n\n")
        f.write(f"COBERTURA: {objetivos_cubiertos}/{total_objetivos} ({porcentaje:.1f}%)\n\n")
        f.write(f"CONTENIDOS FALTANTES: {len(faltantes)}\n\n")
        
        for falta in faltantes:
            f.write(f"\n{falta['dominio']} → {falta['subdominio']}\n")
            f.write(f"  ➤ {falta['objetivo']}\n")
            f.write(f"  Keywords: {', '.join(falta['keywords'])}\n")
    
    print(f"\n💾 Reporte guardado en: AUDITORIA-MATEMATICA-MEDIA.txt")
    print("="*70)
    
    return faltantes

if __name__ == "__main__":
    faltantes = generar_reporte()
