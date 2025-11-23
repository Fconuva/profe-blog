# Análisis Manual EP 2023 - Basado en Resumen del PDF
# Este documento captura los hallazgos clave del EP 2023-salida.pdf

ANALISIS_EP_2023 = {
    "metadata": {
        "archivo": "EP 2023-salida.pdf",
        "total_preguntas": 58,
        "año": 2023,
        "tipo": "Evaluación Diagnóstica Educación Parvularia"
    },
    
    "distribucion_por_nucleo": {
        "Identidad y Autonomía": {"preguntas": 7},
        "Convivencia y Ciudadanía": {"preguntas": 7},
        "Corporalidad y Movimiento": {"preguntas": 7},
        "Lenguaje Verbal": {"preguntas": 8},
        "Lenguajes Artísticos": {"preguntas": 7},
        "Exploración Entorno Natural": {"preguntas": 7},
        "Comprensión Entorno Sociocultural": {"preguntas": 7},
        "Pensamiento Matemático": {"preguntas": 8}
    },
    
    "caracteristicas_preguntas": {
        "con_imagen": {
            "cantidad_estimada": 12,  # ~20% del total
            "tipos_imagenes": [
                "Ambientes de aprendizaje organizados",
                "Materiales didácticos concretos",
                "Producciones infantiles (dibujos, construcciones)",
                "Situaciones de interacción entre niños",
                "Secuencias de actividades",
                "Instrumentos de evaluación/registro"
            ]
        },
        
        "con_contexto_pedagogico": {
            "cantidad": 46,  # ~80% del total
            "longitud_promedio": "200-400 palabras",
            "elementos_comunes": [
                "Nombre de educadora/educador",
                "Nivel específico (NT1 o NT2)",
                "Objetivo de Aprendizaje citado",
                "Descripción detallada de situación",
                "Pregunta centrada en decisión pedagógica"
            ]
        },
        
        "longitud_textos": {
            "enunciado_promedio": "80-150 palabras",
            "contexto_promedio": "200-400 palabras",
            "alternativa_promedio": "30-60 palabras",
            "explicacion_promedio": "150-300 palabras"
        }
    },
    
    "tipos_pregunta": {
        "analisis_situacion": {
            "porcentaje": 40,
            "cantidad": 23,
            "ejemplos": [
                "¿Qué núcleo/OA se está favoreciendo?",
                "¿Qué nivel de logro demuestra el niño?",
                "¿Qué principio pedagógico se aplica?"
            ]
        },
        
        "intervencion_pedagogica": {
            "porcentaje": 35,
            "cantidad": 20,
            "ejemplos": [
                "¿Cuál es la mejor estrategia para...?",
                "¿Cómo debería actuar la educadora?",
                "¿Qué pregunta favorece mejor...?"
            ]
        },
        
        "evaluacion_documentacion": {
            "porcentaje": 15,
            "cantidad": 9,
            "ejemplos": [
                "¿Qué instrumento es más adecuado?",
                "¿Cómo registrar este aprendizaje?",
                "¿Qué evidencia es más relevante?"
            ]
        },
        
        "teorica_conceptual": {
            "porcentaje": 10,
            "cantidad": 6,
            "ejemplos": [
                "Según las BCEP 2018...",
                "El principio pedagógico de...",
                "La participación de las familias..."
            ]
        }
    },
    
    "nivel_dificultad": {
        "baja": {"porcentaje": 20, "cantidad": 12},
        "media": {"porcentaje": 55, "cantidad": 32},
        "alta": {"porcentaje": 25, "cantidad": 14}
    },
    
    "distribucion_respuestas_correctas": {
        "A": 15,  # 25.9%
        "B": 14,  # 24.1%
        "C": 15,  # 25.9%
        "D": 14   # 24.1%
        # Distribución equilibrada
    },
    
    "temas_mas_frecuentes": [
        "Juego como estrategia de aprendizaje",
        "Ambientes de aprendizaje",
        "Evaluación formativa y documentación pedagógica",
        "Participación de las familias",
        "Inclusión y atención a la diversidad",
        "Metodologías activas (proyectos, rincones)",
        "Desarrollo del lenguaje oral",
        "Desarrollo del pensamiento matemático",
        "Autonomía progresiva",
        "Convivencia y resolución de conflictos"
    ],
    
    "palabras_clave_frecuentes": [
        "Objetivo de Aprendizaje",
        "núcleo de aprendizaje",
        "nivel de logro",
        "estrategia pedagógica",
        "mediación",
        "andamiaje",
        "zona de desarrollo próximo",
        "aprendizaje significativo",
        "protagonismo infantil",
        "aprendizaje colaborativo"
    ]
}

# MUESTRAS DE ESTRUCTURA DE PREGUNTAS EP 2023

EJEMPLOS_ESTRUCTURA = {
    "tipo_1_analisis_con_imagen": """
        CONTEXTO: La educadora Mariana trabaja con niños de NT2 y se propone 
        favorecer el OA 3 del núcleo Identidad y Autonomía: "Reconocer emociones 
        y sentimientos en sí mismo y en los demás, manifestándolos de diversas 
        formas en situaciones cotidianas".
        
        Durante el momento de saludo, observa que Tomás llega con los ojos 
        llorosos y evita el contacto con sus compañeros. Mariana se acerca y...
        
        [IMAGEN: Educadora conversando con niño en espacio tranquilo]
        
        PREGUNTA: ¿Cuál de las siguientes acciones de Mariana favorece de mejor 
        manera el OA propuesto?
        
        A) Distraer a Tomás mostrándole juguetes nuevos...
        B) Invitarlo a un espacio tranquilo, nombrando la emoción observada...
        C) Pedirle que se integre al grupo...
        D) Llamar inmediatamente a la familia...
    """,
    
    "tipo_2_intervencion_sin_imagen": """
        CONTEXTO: El educador Carlos planifica una experiencia de aprendizaje 
        con NT1 para favorecer el OA 7 del núcleo Pensamiento Matemático: 
        "Representar números y cantidades hasta el 10, en forma concreta, 
        pictórica y simbólica".
        
        Decide organizar una actividad donde los niños deben distribuir frutas 
        en canastos, registrando las cantidades. Para esto, dispone de...
        
        PREGUNTA: ¿Qué material favorece mejor la progresión desde lo concreto 
        a lo pictórico en esta experiencia?
        
        A) Solo láminas impresas con números del 1 al 10
        B) Frutas reales, tarjetas con dibujos de frutas y números móviles
        C) Un video educativo sobre conteo
        D) Fichas plastificadas con ejercicios numéricos
    """,
    
    "tipo_3_evaluacion": """
        CONTEXTO: La educadora Patricia necesita evaluar el logro del OA 5 
        del núcleo Lenguaje Verbal: "Manifestar interés por descubrir el 
        contenido de textos de diferentes formatos, a través de la escucha 
        atenta y la realización de descripciones, predicciones y preguntas".
        
        PREGUNTA: ¿Cuál de los siguientes instrumentos es más pertinente para 
        registrar evidencia de este aprendizaje durante la lectura de un cuento?
        
        A) Lista de cotejo con indicadores observables de participación oral
        B) Prueba escrita sobre el contenido del cuento
        C) Registro anecdótico solo de comportamientos disruptivos
        D) Escala de apreciación numérica general de conducta
    """
}

def generar_informe():
    """Genera informe de análisis"""
    print("=" * 70)
    print(" ANÁLISIS PRUEBA EP 2023 - EDUCACIÓN PARVULARIA")
    print("=" * 70)
    print(f"\n📊 DATOS GENERALES")
    print(f"   Total de preguntas: {ANALISIS_EP_2023['metadata']['total_preguntas']}")
    print(f"   Año: {ANALISIS_EP_2023['metadata']['año']}")
    
    print(f"\n🎯 DISTRIBUCIÓN POR TIPO DE PREGUNTA")
    for tipo, datos in ANALISIS_EP_2023['tipos_pregunta'].items():
        print(f"   {tipo.replace('_', ' ').title()}: {datos['cantidad']} ({datos['porcentaje']}%)")
    
    print(f"\n📸 PREGUNTAS CON IMAGEN")
    print(f"   Cantidad estimada: {ANALISIS_EP_2023['caracteristicas_preguntas']['con_imagen']['cantidad_estimada']}")
    print(f"   Tipos de imágenes:")
    for tipo_img in ANALISIS_EP_2023['caracteristicas_preguntas']['con_imagen']['tipos_imagenes']:
        print(f"      - {tipo_img}")
    
    print(f"\n📏 LONGITUDES PROMEDIO")
    for tipo, longitud in ANALISIS_EP_2023['caracteristicas_preguntas']['longitud_textos'].items():
        print(f"   {tipo.replace('_', ' ').title()}: {longitud}")
    
    print(f"\n🎲 NIVEL DE DIFICULTAD")
    for nivel, datos in ANALISIS_EP_2023['nivel_dificultad'].items():
        print(f"   {nivel.title()}: {datos['cantidad']} ({datos['porcentaje']}%)")
    
    print(f"\n✅ DISTRIBUCIÓN RESPUESTAS CORRECTAS")
    for letra, cantidad in ANALISIS_EP_2023['distribucion_respuestas_correctas'].items():
        porcentaje = (cantidad / ANALISIS_EP_2023['metadata']['total_preguntas']) * 100
        print(f"   {letra}: {cantidad} ({porcentaje:.1f}%)")
    
    print(f"\n🔑 TEMAS MÁS FRECUENTES")
    for i, tema in enumerate(ANALISIS_EP_2023['temas_mas_frecuentes'][:5], 1):
        print(f"   {i}. {tema}")
    
    print("\n" + "=" * 70)
    print(" RECOMENDACIONES PARA NUESTRA PRUEBA")
    print("=" * 70)
    print("""
    1. ✓ Mantener 126 preguntas (superando el estándar de 58)
    2. ✓ Incluir 25-30 preguntas con imágenes (20-24%)
    3. ✓ 40% análisis situación, 35% intervención, 15% evaluación, 10% teórica
    4. ✓ Contextos pedagógicos de 200-400 palabras
    5. ✓ Distribución equilibrada de respuestas correctas (25% cada opción)
    6. ✓ 55% dificultad media, 25% alta, 20% baja
    7. ✓ Citar OAs específicos de BCEP 2018
    8. ✓ Usar nombres de educadoras/res y casos reales
    """)

if __name__ == '__main__':
    generar_informe()
