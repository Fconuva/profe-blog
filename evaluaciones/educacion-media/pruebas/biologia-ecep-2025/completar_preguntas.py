import json
import os
from groq import Groq

# Cargar plan.json
with open('plan.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Inicializar Groq
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Template basado en preguntas 1-6 completas
PROMPT_TEMPLATE = """Eres un experto en crear preguntas ECEP (Evaluación de Conocimientos Específicos y Pedagógicos) para profesores de Biología de Educación Media en Chile.

CONTEXTO: Estoy completando una prueba ECEP Biología 2025 con 52 preguntas. Las primeras 6 están completas y sirven de modelo de calidad.

PREGUNTA A COMPLETAR:
ID: {id}
Tema: {tema}
Dominio: {dominio}
Alternativa correcta actual: {correcta}

INSTRUCCIONES:
1. Crea un caso pedagógico realista (profesor enseñando, estudiante con error conceptual, pregunta de clase, etc.)
2. El stem debe tener 80-150 palabras, con contexto pedagógico claro
3. Las 4 opciones deben ser:
   - Alternativa {correcta}: CORRECTA (con explicación pedagógica detallada 150-250 palabras)
   - Otras 3: INCORRECTAS (con explicación del error conceptual 100-150 palabras cada una)
4. MANTÉN la alternativa correcta en "{correcta}" (no cambies)
5. Usa formato similar a preguntas 1-6:
   - Contexto en <div class='bg-blue-50 p-4 rounded-lg my-4'> si es caso clínico
   - Feedback con ✅ <strong>Correcta</strong> o ❌ <strong>Incorrecta</strong>
   - Explicación conceptual clara con bullets (• o &nbsp;&nbsp;-)
   - Nivel apropiado para {nivel}

EJEMPLO DE PREGUNTA COMPLETA (P1):
{ejemplo_p1}

RESPONDE SOLO CON JSON:
{{
  "stem": "...",
  "options": [
    {{
      "id": "a",
      "text": "...",
      "isCorrect": true/false,
      "feedback": "..."
    }},
    ...
  ]
}}
"""

# Obtener pregunta 1 como ejemplo
ejemplo_p1 = json.dumps(data['questions'][0], indent=2, ensure_ascii=False)

# Mapeo de IDs a temas
TEMAS = {
    7: "Crossing-over y recombinación genética en meiosis",
    8: "Mutaciones puntuales (sustitución, inserción, deleción)",
    9: "Código genético degenerado (redundancia codones)",
    10: "Transcripción (ADN→ARNm)",
    11: "Traducción (ARNm→Proteína)",
    12: "Replicación ADN semiconservativa",
    13: "Checkpoints del ciclo celular (G1, G2, M)",
    14: "Herencia ligada al sexo (cromosoma X)",
    15: "Cruzamiento dihíbrido (proporción 9:3:3:1)",
    16: "Análisis de genealogías autosómicas",
    17: "Ploidía cromosómica (haploide vs diploide)",
    18: "Función de organelos celulares",
    19: "Diferencias mitosis vs meiosis",
    20: "Fases de la mitosis (profase, metafase, anafase, telofase)",
    21: "Fases de la meiosis I y II",
    22: "Variabilidad genética (crossing-over, mutaciones, segregación)",
    23: "CRISPR-Cas9 y terapia génica",
    24: "Clonación reproductiva (oveja Dolly)",
    25: "Trisomía 21 (Síndrome de Down)",
    26: "Screening neonatal fenilcetonuria (PKU)",
}

TEMAS_PEDAGOGIA = {
    27: "Estrategia didáctica para enseñar genética mendeliana",
    28: "Intervención ante error conceptual en meiosis",
    29: "Actividad para comprender estructura ADN",
    30: "Evaluación formativa en transcripción",
    31: "Analogía pedagógica para explicar ciclo celular",
    32: "Diseño de experimento virtual cruzamiento Punnett",
    33: "Retroalimentación efectiva en herencia ligada X",
    34: "Secuenciación didáctica para dogma central biología molecular",
}

TEMAS_EVOLUCION = {
    35: "Selección natural darwiniana vs lamarckismo",
    36: "Especiación alopátrica vs simpátrica",
    37: "Evidencias evolutivas (fósiles, anatomía comparada, embriología)",
}

TEMAS_INMUNE = {
    38: "Inmunidad innata vs adaptativa, linfocitos B y T",
}

TEMAS_MIXTOS = {
    39: "Herencia poligénica (altura, color piel)",
    40: "Telómeros y envejecimiento celular",
    41: "Expresión génica diferencial (células especializadas)",
    42: "Metilación ADN y epigenética",
    43: "Aneuploidías (Turner, Klinefelter)",
    44: "Apoptosis vs necrosis",
    45: "Cariotipo humano normal (46 cromosomas)",
    46: "Espermatogénesis vs ovogénesis (diferencias)",
    47: "Alelos múltiples (grupos sanguíneos ABO)",
    48: "Citocinesis en célula animal vs vegetal",
    49: "Test de paternidad (marcadores genéticos)",
    50: "Quimerismo genético",
    51: "Regulación ciclo celular (ciclinas, CDK)",
    52: "Gametos anormales (óvulos con 2 cromosomas 21)",
}

TEMAS.update(TEMAS_PEDAGOGIA)
TEMAS.update(TEMAS_EVOLUCION)
TEMAS.update(TEMAS_INMUNE)
TEMAS.update(TEMAS_MIXTOS)

# Procesar preguntas 7-52
print("Completando preguntas con Groq API...\n")

for i, pregunta in enumerate(data['questions']):
    pid = pregunta['id']
    
    # Solo procesar 7-52 incompletas
    if pid < 7:
        continue
    
    # Obtener alternativa correcta actual
    correcta = next(opt['id'] for opt in pregunta['options'] if opt['isCorrect'])
    
    # Determinar nivel
    nivel = pregunta['pedagogy'].get('level', '2° Medio')
    
    # Crear prompt
    prompt = PROMPT_TEMPLATE.format(
        id=pid,
        tema=TEMAS.get(pid, "Tema general biología"),
        dominio=pregunta['domain'],
        correcta=correcta,
        nivel=nivel,
        ejemplo_p1=ejemplo_p1
    )
    
    print(f"Procesando P{pid}: {TEMAS.get(pid, 'General')[:60]}...")
    
    try:
        # Llamar a Groq
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Eres un experto en educación biológica y diseño de evaluaciones docentes. Respondes SOLO con JSON válido."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=2000,
        )
        
        respuesta = chat_completion.choices[0].message.content.strip()
        
        # Limpiar respuesta (quitar ```json si existe)
        if respuesta.startswith('```json'):
            respuesta = respuesta[7:]
        if respuesta.startswith('```'):
            respuesta = respuesta[3:]
        if respuesta.endswith('```'):
            respuesta = respuesta[:-3]
        respuesta = respuesta.strip()
        
        # Parsear JSON
        nueva_pregunta = json.loads(respuesta)
        
        # Actualizar pregunta en data
        data['questions'][i]['stem'] = nueva_pregunta['stem']
        data['questions'][i]['options'] = nueva_pregunta['options']
        
        print(f"  ✅ Completada P{pid}")
        
    except Exception as e:
        print(f"  ❌ Error en P{pid}: {e}")
        continue

# Guardar plan.json actualizado
with open('plan_completado.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\n✅ Plan completado guardado en plan_completado.json")
print("Revisa el archivo antes de reemplazar plan.json original")
