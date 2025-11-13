# PLAN DE TRABAJO: PRUEBA MECÁNICA AUTOMOTRIZ EMTP

## 📋 ESTADO ACTUAL

### Archivos Disponibles

**Carpeta: `evaluaciones/educacion-media-tecnico-profesional/pruebas/`**
- ✅ `EMTP-MEC_AUTO(23).pdf` - Prueba de Mecánica Automotriz 2023
- ✅ `Ed_Media_Tecnico_Profesional_Mecanica_Automotriz.pdf` - Documento general

**Carpeta: `evaluaciones/educacion-media-tecnico-profesional/temarios/`**
- ✅ `Ed_Media_Tecnico_Profesional_Mecanica_Automotriz.pdf` - Temario oficial

---

## 🎯 OBJETIVO

Crear prueba interactiva de Mecánica Automotriz EMTP similar a las existentes:
- Educación Parvularia (50 preguntas con retroalimentación inmediata)
- Lengua y Literatura Media
- Historia Media
- Matemática Media

---

## 📝 TAREAS NECESARIAS

### 1. EXTRACCIÓN DE CONTENIDO (PRIORIDAD ALTA)

- [ ] **Extraer texto de `EMTP-MEC_AUTO(23).pdf`**
  - Identificar estructura de la prueba
  - Contar número de preguntas
  - Extraer enunciados y alternativas
  - Identificar respuestas correctas (si están disponibles)

- [ ] **Extraer texto del Temario oficial**
  - Identificar áreas temáticas
  - Listar competencias clave
  - Extraer objetivos de aprendizaje
  - Mapear contenidos por módulos

- [ ] **Analizar documento general**
  - Perfil de egreso
  - Competencias específicas
  - Estructura curricular

### 2. ESTRUCTURACIÓN DE DATOS

- [ ] **Crear archivo JSON con estructura:**
  ```json
  {
    "metadata": {
      "codigo_prueba": "emtp-mec-auto",
      "nombre_completo": "Mecánica Automotriz - EMTP ECEP 2025",
      "especialidad": "Mecánica Automotriz",
      "nivel": "Educación Media Técnico Profesional",
      "total_preguntas": 60,
      "areas_tematicas": [
        "Sistemas del Motor",
        "Sistemas de Transmisión",
        "Sistemas Eléctricos",
        "Mantenimiento Preventivo",
        "Diagnóstico y Reparación"
      ]
    },
    "exam": {
      "preguntas": [
        {
          "id": "mec-auto-01",
          "numero": 1,
          "area": "Sistemas del Motor",
          "competencia": "...",
          "enunciado": "...",
          "alternativas": [...],
          "respuesta_correcta": "A",
          "explicacion": "..."
        }
      ]
    }
  }
  ```

### 3. CREACIÓN DE INTERFAZ WEB

- [ ] **Crear estructura de carpetas:**
  ```
  evaluaciones/educacion-media-tecnico-profesional/
  ├── index.njk (página principal EMTP)
  └── pruebas/
      └── mecanica-automotriz/
          ├── index.njk (prueba interactiva)
          └── mecanica-automotriz.json (datos)
  ```

- [ ] **Desarrollar página principal EMTP**
  - Hero section con descripción
  - Cards para cada especialidad
  - Enlaces a pruebas disponibles

- [ ] **Desarrollar prueba interactiva**
  - Basado en template de Parvularia (retroalimentación inmediata)
  - Adaptado a contenido técnico
  - Incluir diagramas/imágenes si es necesario

### 4. CONTENIDO PEDAGÓGICO

- [ ] **Generar explicaciones técnicas para cada pregunta**
- [ ] **Crear prompts de IA específicos por área:**
  - Sistemas del motor
  - Transmisión
  - Sistemas eléctricos
  - Mantenimiento
  - Diagnóstico

- [ ] **Incorporar terminología técnica:**
  - Glosario de términos automotrices
  - Referencias a manuales técnicos
  - Normativas de seguridad

---

## 🔧 ÁREAS TEMÁTICAS ESPERADAS (a confirmar con PDFs)

1. **Sistemas del Motor**
   - Motores de combustión interna
   - Sistemas de alimentación
   - Sistemas de refrigeración
   - Sistemas de lubricación

2. **Sistemas de Transmisión**
   - Embrague
   - Caja de cambios
   - Diferencial
   - Transmisión automática/manual

3. **Sistemas Eléctricos y Electrónicos**
   - Sistema de carga
   - Sistema de arranque
   - Iluminación
   - Inyección electrónica

4. **Sistemas de Suspensión y Dirección**
   - Tipos de suspensión
   - Sistema de dirección
   - Geometría de ruedas

5. **Sistemas de Frenos**
   - Frenos hidráulicos
   - Frenos neumáticos
   - ABS

6. **Mantenimiento y Diagnóstico**
   - Mantenimiento preventivo
   - Diagnóstico con scanner
   - Herramientas y equipos

---

## 📊 ESTIMACIÓN DE TRABAJO

### Fase 1: Extracción (2-3 horas)
- Leer y extraer contenido de PDFs
- Identificar estructura de preguntas
- Mapear áreas temáticas

### Fase 2: Estructuración (3-4 horas)
- Crear JSON con todas las preguntas
- Escribir explicaciones pedagógicas
- Generar prompts de IA

### Fase 3: Desarrollo Web (2-3 horas)
- Crear página principal EMTP
- Adaptar template de prueba
- Integrar datos JSON

### Fase 4: Testing y Ajustes (1-2 horas)
- Probar funcionalidad
- Revisar contenido técnico
- Ajustes de diseño

**TOTAL ESTIMADO: 8-12 horas de trabajo**

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **AHORA**: Extraer texto de los 3 PDFs disponibles
2. **DESPUÉS**: Analizar estructura de la prueba 2023
3. **LUEGO**: Crear estructura JSON base
4. **FINALMENTE**: Desarrollar interfaz web

---

## 📌 NOTAS IMPORTANTES

- Verificar si la prueba 2023 incluye solucionario
- Confirmar número total de preguntas (¿60? ¿80?)
- Identificar si hay casos prácticos/situaciones
- Revisar si necesitamos incorporar imágenes de diagramas
- Considerar agregar sección de "Herramientas y Equipos" con fotos

---

## ✅ CRITERIOS DE ÉXITO

- [ ] Prueba interactiva funcional en la web
- [ ] 60+ preguntas con retroalimentación técnica
- [ ] Explicaciones pedagógicas precisas
- [ ] Interfaz responsive y atractiva
- [ ] Integración con sistema de IA
- [ ] Despliegue exitoso en Vercel

---

**Fecha de creación:** 12 de noviembre de 2025  
**Especialidad:** Mecánica Automotriz EMTP  
**Proyecto:** profefranciscopancho.com
