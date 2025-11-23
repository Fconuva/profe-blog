# 📋 TAREAS PENDIENTES - ECEP Biología 2025

## 🎯 Resumen del Problema

**Estado actual:** 52 preguntas totales
- ✅ **6 preguntas completas** (P1-P6): Tienen stem detallado y feedback pedagógico completo
- ❌ **46 preguntas incompletas** (P7-P52): Solo placeholders sin contenido

## 📊 Análisis Técnico

### Distribución de Alternativas Correctas ✅
```
A: 13 preguntas (25.0%) ✓
B: 13 preguntas (25.0%) ✓  
C: 13 preguntas (25.0%) ✓
D: 13 preguntas (25.0%) ✓
```
**PERFECTO:** La distribución está balanceada (objetivo: ~25% cada alternativa)

### Preguntas con Placeholders (20 preguntas)
```
P7:  Crossing-over y recombinación genética en meiosis
P8:  Mutaciones puntuales (sustitución, inserción, deleción)
P9:  Código genético degenerado (redundancia codones)
P10: Transcripción (ADN→ARNm)
P11: Traducción (ARNm→Proteína)
P12: Replicación ADN semiconservativa
P13: Checkpoints del ciclo celular (G1, G2, M)
P14: Herencia ligada al sexo (cromosoma X)
P15: Cruzamiento dihíbrido (proporción 9:3:3:1)
P16: Análisis de genealogías autosómicas
P17: Ploidía cromosómica (haploide vs diploide)
P18: Función de organelos celulares
P19: Diferencias mitosis vs meiosis
P20: Fases de la mitosis (profase, metafase, anafase, telofase)
P21: Fases de la meiosis I y II
P22: Variabilidad genética (crossing-over, mutaciones, segregación)
P23: CRISPR-Cas9 y terapia génica
P24: Clonación reproductiva (oveja Dolly)
P25: Trisomía 21 (Síndrome de Down)
P26: Screening neonatal fenilcetonuria (PKU)
```

### Preguntas con Feedback Insuficiente (46 preguntas)
```
P7-P52: Solo tienen "✅ Correcta" o "❌ Incorrecta" sin explicación pedagógica
```

## 🛠️ Soluciones Disponibles

### Opción 1: Completar con Groq API (AUTOMÁTICO) ⚡
**Ventaja:** Completa las 46 preguntas en ~5 minutos  
**Requisito:** Groq API Key válida

**Comando:**
```bash
cd "evaluaciones/educacion-media/pruebas/biologia-ecep-2025"
$env:GROQ_API_KEY="gsk_TU_KEY_AQUI"
python completar_preguntas.py
```

**Obtener API Key:**
1. Ir a: https://console.groq.com/keys
2. Crear cuenta gratis (sin tarjeta)
3. Generar nueva API key
4. Copiar y usar en comando arriba

### Opción 2: Completar Manualmente (MANUAL) ✍️
**Ventaja:** Control total de calidad  
**Desventaja:** ~46 preguntas × 15min = ~11.5 horas de trabajo

**Template para cada pregunta:**
```
Stem (80-150 palabras):
- Caso pedagógico realista (profesor enseñando, estudiante con error, pregunta de clase)
- Contexto claro en <div class='bg-blue-50 p-4 rounded-lg my-4'> si es caso clínico

Opción CORRECTA (150-250 palabras):
✅ <strong>Correcta.</strong><br><br>
<strong>Justificación conceptual:</strong><br>
• Punto clave 1<br>
• Punto clave 2<br><br>
<strong>Por qué es pedagógicamente adecuada:</strong><br>
• Razón didáctica 1<br>
• Razón didáctica 2

Opciones INCORRECTAS (100-150 palabras cada una):
❌ <strong>Incorrecta.</strong><br><br>
<strong>Error conceptual:</strong><br>
• Descripción del error<br>
• Por qué es confuso<br><br>
<strong>Corrección:</strong> Explicación correcta breve
```

### Opción 3: Usar Copilot en VS Code (SEMI-AUTOMÁTICO) 🤖
**Ventaja:** Más control que API, más rápido que manual  
**Proceso:**
1. Abrir plan.json en VS Code
2. Seleccionar pregunta placeholder (P7)
3. Ctrl+I → Prompt: "Completa esta pregunta ECEP Biología siguiendo el patrón de P1-P6. Tema: Crossing-over. Mantén alternativa correcta en 'd'."
4. Repetir para P8-P52

## 📝 Ejemplo de Pregunta Completa (P1)

Para referencia, así se ve una pregunta bien hecha:

```json
{
  "id": 1,
  "domain": "genetica",
  "difficulty": "medium",
  "stem": "Una profesora de 1° Medio, en la unidad 'Genética y Herencia', está trabajando con sus estudiantes el concepto de mutaciones genéticas. Durante la clase, presenta el siguiente caso clínico:\n\n<div class='bg-blue-50 p-4 rounded-lg my-4'><strong>Caso:</strong> La fenilcetonuria (PKU) es una enfermedad genética causada por mutaciones en el gen PAH del cromosoma 12, que codifica la enzima fenilalanina hidroxilasa. Los pacientes con PKU no pueden metabolizar el aminoácido fenilalanina, lo que genera acumulación tóxica que daña el sistema nervioso.</div>\n\nUn estudiante pregunta: 'Si es solo UN gen alterado, ¿por qué el tratamiento no es simplemente reemplazar ese gen?'\n\n¿Cuál de las siguientes respuestas de la profesora explica de manera conceptualmente precisa y comprensible para el nivel la complejidad del tratamiento genético?",
  "options": [
    {
      "id": "a",
      "text": "Reemplazar el gen en TODAS las células del cuerpo es técnicamente muy difícil. La fenilcetonuria se trata con dieta restrictiva porque es más efectivo controlar la fenilalanina que ingerimos que intentar corregir millones de células hepáticas que ya tienen la mutación.",
      "isCorrect": true,
      "feedback": "✅ <strong>Respuesta correcta.</strong><br><br><strong>Justificación conceptual:</strong><br>• La PKU afecta principalmente células hepáticas (órgano sólido con millones de células)<br>• La terapia génica somática actual solo puede modificar un % limitado de células<br>• El tratamiento dietético (<500 mg Phe/día) es efectivo, seguro y no invasivo<br><br><strong>Por qué es pedagógicamente adecuada:</strong><br>• Explica la limitación técnica de manera comprensible (reemplazar en TODAS las células)<br>• Contrasta con solución práctica actual (dieta)<br>• Nivel apropiado para 1° Medio (no requiere conocimiento avanzado de vectores virales)"
    },
    // ... 3 opciones incorrectas con feedback detallado
  ],
  "pedagogy": {
    "objective": "Explicar limitaciones técnicas de la terapia génica de manera comprensible",
    "misconception": "Creer que 'un gen alterado = fácil de reemplazar'",
    "level": "1° Medio"
  }
}
```

## 🎯 Próximos Pasos Recomendados

### Paso 1: Obtener Groq API Key
- Ir a https://console.groq.com/keys
- Crear cuenta (gratis, sin tarjeta)
- Generar API key

### Paso 2: Ejecutar Script Automático
```bash
cd "c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\evaluaciones\educacion-media\pruebas\biologia-ecep-2025"
$env:GROQ_API_KEY="gsk_TU_KEY_AQUI"
python completar_preguntas.py
```

### Paso 3: Revisar plan_completado.json
- Verificar calidad de preguntas generadas
- Ajustar manualmente si es necesario
- Reemplazar plan.json original

### Paso 4: Validar Distribución
```bash
python analizar_quiz.py
```
Verificar que siga siendo 25% cada alternativa

### Paso 5: Commit y Deploy
```bash
git add plan.json
git commit -m "Completar 46 preguntas ECEP Biología 2025 con contenido pedagógico detallado"
git push origin main
```

## 📞 Soporte

Si prefieres completar manualmente o necesitas ayuda:
1. Selecciona 1-2 preguntas para completar como ejemplo
2. Usa el template de arriba
3. Iteramos juntos hasta que tengas el formato correcto
4. Luego puedes completar el resto más rápido

---

**Estado:** Esperando Groq API Key o decisión sobre método de completado  
**Prioridad:** Alta (prueba no funcional con contenido placeholder)  
**Tiempo estimado:**  
- Con API: 5-10 minutos  
- Manual: 11-12 horas  
- Semi-automático (Copilot): 2-3 horas
