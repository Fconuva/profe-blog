# -*- coding: utf-8 -*-
"""
Auditoría de Cobertura del Temario ECEP 2025 - Educación Parvularia
Verifica que la evaluación cubra todos los dominios y contenidos del temario oficial
"""

import json

# Temario oficial ECEP 2025
TEMARIO_OFICIAL = {
    "DOMINIO 1: CURRICULUM, FUNDAMENTOS, POLÍTICAS": {
        "1.1 Nociones generales y fundamentos": [
            "Autores emblemáticos (Froebel, Agazzi, Dewey, Feuerstein)",
            "Modalidades curriculares (Montessori, Waldorf, Integral, High Scope, Reggio Emilia)"
        ],
        "1.2 Institucionalidad y Políticas": [
            "Institucionalidad del Nivel de Educación Parvularia",
            "Plan de Formación Ciudadana"
        ],
        "1.3 Conocimiento del Curriculum": [
            "Principios pedagógicos transversales",
            "Innovaciones y modificaciones curriculares",
            "Graduación y progreso de OA",
            "Relación planificación-evaluación",
            "Trabajo colaborativo con familia y comunidad"
        ]
    },
    "DOMINIO 2: DESARROLLO INTEGRAL": {
        "2.1 Desarrollo cognitivo": [
            "Manifestaciones del desarrollo cognitivo",
            "Funciones ejecutivas"
        ],
        "2.2 Desarrollo socioemocional": [
            "Estilos de crianza parentales (Maccoby y Martin)",
            "Tipos de apego (Bowlby y Ainsworth)"
        ],
        "2.3 Desarrollo psicomotriz": [
            "Desarrollo psicomotor",
            "Desempeños y manifestaciones clave"
        ],
        "2.4 Bienestar integral": [
            "Alimentación saludable",
            "Programa Nacional de Inmunización"
        ]
    },
    "DOMINIO 3: DESARROLLO PERSONAL Y SOCIAL": {
        "3.1 Núcleo Identidad y Autonomía": [
            "Principios (egocentrismo, empatía, autorregulación, autoconcepto, autoestima)",
            "Estrategias de enseñanza",
            "Habilidades (autocuidado, independencia, alfabetización emocional)",
            "Estrategias de evaluación"
        ],
        "3.2 Núcleo Convivencia y Ciudadanía": [
            "Conocimientos, habilidades y actitudes de convivencia",
            "Estrategias de enseñanza transversal",
            "Evaluación del aprendizaje",
            "Ciudadanía progresiva"
        ],
        "3.3 Núcleo Corporalidad y Movimiento": [
            "Conciencia corporal (esquema, tono, lateralidad)",
            "Estrategias de evaluación",
            "Interacciones pedagógicas y retroalimentación"
        ]
    },
    "DOMINIO 4: COMUNICACIÓN INTEGRAL": {
        "4.1 Núcleo Lenguaje Verbal": [
            "Desarrollo del lenguaje (pre-lingüístico y lingüístico)",
            "Etapas de lectura y escritura",
            "Estrategias de enseñanza",
            "Estrategias de evaluación",
            "Evaluación de habilidades y conocimientos"
        ],
        "4.2 Núcleo Lenguajes Artísticos": [
            "Sensibilización y apreciación estética",
            "Movimientos artísticos visuales",
            "Estrategias de enseñanza y recursos",
            "Estrategias de evaluación",
            "Interacciones pedagógicas y retroalimentación"
        ]
    },
    "DOMINIO 5: INTERACCIÓN Y COMPRENSIÓN DEL ENTORNO": {
        "5.1 Núcleo Exploración del Entorno Natural": [
            "Componentes del Universo",
            "Interacciones biológicas",
            "Estrategias y recursos pedagógicos",
            "Evaluación de aprendizaje",
            "Interacciones pedagógicas y retroalimentación"
        ],
        "5.2 Núcleo Comprensión del Entorno Sociocultural": [
            "Fiestas y tradiciones culturales",
            "Patrimonio cultural material e inmaterial",
            "Estrategias de enseñanza",
            "Estrategias de evaluación",
            "Interacciones pedagógicas y retroalimentación"
        ],
        "5.3 Núcleo Pensamiento Matemático": [
            "Figuras y cuerpos geométricos",
            "Sistemas de medición",
            "Estrategias y recursos pedagógicos",
            "Evaluación de aprendizaje",
            "Estrategias de evaluación"
        ]
    }
}

def cargar_plan():
    """Carga el plan.json de la evaluación"""
    with open('evaluaciones/educacion-parvularia/pruebas/parv-nt/plan.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def buscar_contenido(preguntas, palabras_clave):
    """Busca si alguna pregunta contiene las palabras clave"""
    for pregunta in preguntas:
        texto_completo = f"{pregunta.get('enunciado', '')} {pregunta.get('explicacion', '')} {' '.join([alt['texto'] for alt in pregunta.get('alternativas', [])])}".lower()
        if any(palabra.lower() in texto_completo for palabra in palabras_clave):
            return True
    return False

def auditar_cobertura():
    """Realiza auditoría de cobertura del temario"""
    print("="*80)
    print("AUDITORÍA DE COBERTURA TEMARIO ECEP 2025 - EDUCACIÓN PARVULARIA")
    print("="*80)
    
    plan = cargar_plan()
    preguntas = plan['exam']['preguntas']
    
    print(f"\nTotal de preguntas en evaluación: {len(preguntas)}")
    print(f"Distribución: {plan['metadata']['distribucion']}")
    print("\n" + "="*80)
    
    total_contenidos = 0
    contenidos_cubiertos = 0
    contenidos_faltantes = []
    
    for dominio, subdominios in TEMARIO_OFICIAL.items():
        print(f"\n📚 {dominio}")
        print("-"*80)
        
        for subdominio, contenidos in subdominios.items():
            print(f"\n  {subdominio}")
            
            for contenido in contenidos:
                total_contenidos += 1
                
                # Buscar palabras clave del contenido
                palabras_clave = []
                if "Froebel" in contenido or "Agazzi" in contenido:
                    palabras_clave = ["Froebel", "Agazzi", "Dewey", "Feuerstein", "Piaget", "Vygotsky"]
                elif "Montessori" in contenido or "Waldorf" in contenido:
                    palabras_clave = ["Montessori", "Waldorf", "High Scope", "Reggio Emilia"]
                elif "Institucionalidad" in contenido:
                    palabras_clave = ["JUNJI", "Integra", "MINEDUC", "Subsecretaría"]
                elif "Plan de Formación Ciudadana" in contenido:
                    palabras_clave = ["Formación Ciudadana", "ciudadanía", "participación democrática"]
                elif "Principios pedagógicos" in contenido:
                    palabras_clave = ["bienestar", "singularidad", "potenciación", "unidad", "relación", "significado", "juego"]
                elif "planificación-evaluación" in contenido:
                    palabras_clave = ["planificación", "evaluación", "diagnóstica", "formativa", "sumativa"]
                elif "familia y comunidad" in contenido:
                    palabras_clave = ["familia", "comunidad", "participación", "apoderados"]
                elif "Funciones ejecutivas" in contenido:
                    palabras_clave = ["funciones ejecutivas", "memoria de trabajo", "control inhibitorio", "flexibilidad cognitiva"]
                elif "Maccoby" in contenido or "estilos de crianza" in contenido:
                    palabras_clave = ["estilos de crianza", "autoritario", "permisivo", "democrático"]
                elif "apego" in contenido or "Bowlby" in contenido:
                    palabras_clave = ["apego", "Bowlby", "Ainsworth", "seguro", "inseguro", "evitativo", "ambivalente"]
                elif "Inmunización" in contenido:
                    palabras_clave = ["inmunización", "vacunas", "PNI", "vacunación"]
                elif "alimentación" in contenido:
                    palabras_clave = ["alimentación saludable", "nutrición", "pirámide alimenticia"]
                else:
                    # Usar palabras del contenido mismo
                    palabras_clave = contenido.split()[:3]
                
                cubierto = buscar_contenido(preguntas, palabras_clave)
                
                if cubierto:
                    print(f"    ✅ {contenido}")
                    contenidos_cubiertos += 1
                else:
                    print(f"    ❌ {contenido}")
                    contenidos_faltantes.append({
                        "dominio": dominio,
                        "subdominio": subdominio,
                        "contenido": contenido
                    })
    
    # Resumen
    print("\n" + "="*80)
    print("📊 RESUMEN DE COBERTURA")
    print("="*80)
    print(f"Total de contenidos en temario oficial: {total_contenidos}")
    print(f"Contenidos cubiertos: {contenidos_cubiertos}")
    print(f"Contenidos faltantes: {len(contenidos_faltantes)}")
    print(f"Porcentaje de cobertura: {(contenidos_cubiertos/total_contenidos)*100:.1f}%")
    
    if contenidos_faltantes:
        print("\n⚠️ CONTENIDOS FALTANTES QUE DEBEN AGREGARSE:")
        print("="*80)
        for i, faltante in enumerate(contenidos_faltantes, 1):
            print(f"\n{i}. {faltante['dominio']}")
            print(f"   {faltante['subdominio']}")
            print(f"   📌 {faltante['contenido']}")
    
    return contenidos_faltantes

if __name__ == "__main__":
    faltantes = auditar_cobertura()
    
    # Guardar reporte
    with open('AUDITORIA-TEMARIO-PARVULARIA.txt', 'w', encoding='utf-8') as f:
        f.write(f"Contenidos faltantes: {len(faltantes)}\n\n")
        for faltante in faltantes:
            f.write(f"- {faltante['dominio']} > {faltante['subdominio']} > {faltante['contenido']}\n")
    
    print("\n✅ Reporte guardado en: AUDITORIA-TEMARIO-PARVULARIA.txt")
