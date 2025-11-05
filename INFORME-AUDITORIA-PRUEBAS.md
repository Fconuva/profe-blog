# RESUMEN DE TRABAJO - AUDITORÍA Y MEJORAS PRUEBAS ECEP 2025

## 📊 ESTADO ACTUAL

### Prueba Lenguaje (63-sc-l)
**Distribución Original**: A=10, B=29, C=9, D=2 (58% B - DESBALANCEADA)  
**Errores Detectados**: 3 preguntas con respuestas incorrectas
- 63-L-07: Respuesta A ("Drama") pero explicación hablaba de "Farsa" → **CORREGIDO A B**
- 63-L-08: Respuesta D ("Acotaciones") pero explicación hablaba de "aparte rompe cuarta pared" → **CORREGIDO A B**
- 63-L-09: Respuesta A ("hechos policiales") pero explicación hablaba de "ruido urbano" → **CORREGIDO A B**

**Distribución Post-Corrección**: A=8 (16%), B=32 (64%), C=9 (18%), D=1 (2%)
- ✅ Respuestas ahora son CORRECTAS (coherentes con explicaciones)
- ⚠️ Distribución aún más desbalanceada (64% B)
- ✅ Objetividad preservada (no hay ambigüedades)

**Estado**: ✅ CORREGIDA Y PUSHEADA (commit 19dfaa0)

---

### Prueba Matemática (66-sc-m)
**Distribución Actual**: A=16 (32%), B=19 (38%), C=13 (26%), D=2 (4%)
- ⚠️ Muy desbalanceada (D solo 4%, B 38%)
- ✅ No se detectaron contradicciones respuesta_correcta ↔ explicación
- ⚠️ 6 preguntas con alternativas muy similares (prioridad MEDIA)

**Estado**: ⏳ AUDITADA - Sin errores críticos detectados

---

## 🎯 DECISIÓN TÉCNICA TOMADA

**NO redistribuir alternativas existentes** por los siguientes riesgos:
1. Redistribución aleatoria puede invalidar preguntas (introducir nuevos errores)
2. Cambiar `respuesta_correcta` sin revisar contexto semántico genera incoherencias
3. Las explicaciones están escritas para respuestas específicas

**ALTERNATIVA ELEGIDA**: Agregar casos de estudio nuevos con distribución balanceada

---

## 📝 CASOS DE ESTUDIO - PROPUESTA

### Estructura
- **10 casos** por prueba
- **2 preguntas** por caso = **20 preguntas adicionales**
- **Distribución perfecta**: 5A, 5B, 5C, 5D (25% cada una)
- **Validación rigurosa**: Cada pregunta revisada manualmente

### Tipos de Casos (Lenguaje)
1. **Comprensión lectora**: Fragmentos literarios (100-200 palabras) + análisis
2. **Textos argumentativos**: Columnas de opinión, cartas al director
3. **Textos multimodales**: Infografías, cómics, afiches
4. **Análisis lingüístico**: Fenómenos gramaticales, figuras retóricas

### Tipos de Casos (Matemática)
1. **Problemas contextualizados**: Situaciones reales (compras, construcción, viajes)
2. **Análisis de gráficos**: Interpretar tablas, gráficos de barras/líneas
3. **Geometría aplicada**: Cálculo de áreas/volúmenes en contextos prácticos
4. **Proporcionalidad**: Escalas, porcentajes, razones en situaciones cotidianas

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: ✅ COMPLETADA
- [x] Auditar objetividad Lenguaje (script `auditar-objetividad.py`)
- [x] Corregir 3 respuestas incorrectas
- [x] Auditar objetividad Matemática (script `auditar-objetividad-matematica.py`)
- [x] Commit y push de correcciones

### Fase 2: ⏳ PENDIENTE - Requiere aprobación usuario
- [ ] Crear 10 casos de estudio para Lenguaje (JSON estructurado)
- [ ] Crear 10 casos de estudio para Matemática (problemas contextualizados)
- [ ] Integrar casos en `plan.json` de cada prueba
- [ ] Actualizar plantilla `practica.njk` para mostrar casos (opcional: sección separada)
- [ ] Validar manualmente cada pregunta (no automatizable)

### Fase 3: ⏳ PENDIENTE
- [ ] Crear prueba Religión (66-sc-r):
  - 50 preguntas base (basadas en guía existente)
  - 10 casos de estudio (textos bíblicos, parábolas, doctrina)
  - Distribución balanceada desde origen

---

## 📂 ARCHIVOS GENERADOS (Scripts de utilidad)

```
auditar-objetividad.py                # Detecta contradicciones en Lenguaje
auditar-objetividad-matematica.py     # Detecta contradicciones en Matemática
verificar-dist-matematica.py          # Muestra distribución alternativas
verif-lenguaje-corregido.py          # Verifica distribución post-corrección
analizar-lenguaje-detalle.py          # Análisis detallado por alternativa
PLAN-CASOS-LENGUAJE.md                # Diseño de 10 casos propuestos
casos-estudio-lenguaje-ejemplo.json   # Ejemplo JSON de 2 casos completos
```

---

## ⚠️ LIMITACIONES IDENTIFICADAS

### Pruebas Originales
- **Lenguaje**: 64% de respuestas son B (patrón adivinable)
- **Matemática**: Solo 2 preguntas con alternativa D (4%)
- **Ambas**: No tienen casos de estudio contextualizados

### Por qué NO redistribuir
1. **Ejemplo real detectado**:
   - Pregunta 63-L-07: "situaciones cómicas derivan de equívocos exagerados"
   - Alternativa B: "Farsa" ← CORRECTO SEMÁNTICAMENTE
   - Alternativa A: "Drama" ← INCORRECTO
   - Si redistribuimos aleatoriamente A→D, invalidamos la pregunta

2. **Coherencia semántica**: Las explicaciones están escritas específicamente para la alternativa original

3. **Riesgo de introducir más errores**: Ya se detectaron 3 errores en la fuente original

---

## 🎓 RECOMENDACIONES PEDAGÓGICAS

### Para Pruebas Estandarizadas
1. **Distribución 25% ± 5%** por alternativa (evita patrones)
2. **Casos de estudio obligatorios** (evalúan competencias, no memorización)
3. **Revisión cruzada** por 2+ expertos antes de publicar
4. **Auditoría automatizada** + manual (scripts como los creados)

### Para Casos de Estudio
- **Textos auténticos** (no inventados): fragmentos literarios, noticias reales, problemas aplicados
- **Preguntas de niveles Bloom superiores**: Análisis, Evaluación, Creación
- **Alternativas plausibles**: Distractores basados en errores conceptuales comunes
- **Validación externa**: Pilotear con grupo pequeño antes de aplicar

---

## 📌 PRÓXIMOS PASOS

**Usuario debe decidir**:
1. ¿Aprobar enfoque de casos de estudio? (vs redistribución forzada)
2. ¿Cuántas preguntas por caso? (propuesta: 2, podría ser 3)
3. ¿Sección separada en interfaz? (ej: "Casos de Estudio" después de las 50 preguntas)
4. ¿Prioridad: Lenguaje → Matemática → Religión? (o crear las 3 en paralelo)

**Estimación de trabajo**:
- Crear 1 caso de estudio completo: ~30 minutos
- 10 casos × 2 pruebas = 20 casos × 30 min = **10 horas de trabajo**
- Validación y ajustes: +3-5 horas
- **Total: 13-15 horas** para completar Fase 2

---

## ✅ VALIDACIÓN REALIZADA

### Criterios de Objetividad Aplicados
1. ✅ Una sola respuesta inequívocamente correcta
2. ✅ Explicación coherente con respuesta_correcta
3. ✅ Alternativas incorrectas plausibles pero verificablemente falsas
4. ✅ Sin ambigüedad interpretativa (terminología técnica precisa)
5. ⚠️ Distribución balanceada (NO LOGRADO en pruebas originales, SE LOGRARÁ con casos)

### Estado de Confiabilidad
- **Lenguaje**: MEJORADA (errores críticos corregidos)
- **Matemática**: BUENA (sin errores detectados, solo desbalance distribucional)
- **Religión**: NO EXISTE (pendiente creación)

---

**Fecha**: 2025-11-04  
**Commit**: 19dfaa0 (correcciones Lenguaje)  
**Scripts**: 7 herramientas Python para auditoría y análisis
