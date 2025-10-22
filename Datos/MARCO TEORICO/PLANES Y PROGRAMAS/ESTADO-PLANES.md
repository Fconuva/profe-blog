# 📚 Planes y Programas Ministeriales - Estado Actual

**Última actualización:** 19 de octubre de 2025

---

## ✅ Planes Integrados al Sistema

### 2° Medio - Lenguaje y Comunicación

#### **Unidad 4: Poder y ambición**

**Estado:** ✅ Integrado y disponible  
**Archivo fuente:** `plan_2Medio_Lenguaje_Unidad4.json`  
**Método de importación:** Auto-importación vía `auto-import-planes.html`

##### Contenido:
- **15 Objetivos de Aprendizaje:**
  - 6 OA específicos (OA 3, 8, 9, 13, 16, 21)
  - 9 OA transversales (OA 1, 2, 10, 11, 12, 14, 15, 22, 23)

- **87 Indicadores de evaluación** distribuidos en todos los OA

- **2 Actitudes:**
  - Actitud B: Reflexionar sobre sí mismo y cuestiones sociales/éticas
  - Actitud H: Valorar el discurso para participación democrática

##### Características pedagógicas:
- **Propósito:** Análisis de personajes ambiciosos en literatura, reflexión ética sobre poder y ambición
- **Temas centrales:** Poder, ambición, motivación, ética, conflicto moral, consecuencias, tragedia, hubris
- **Habilidades clave:**
  - Análisis crítico de textos literarios
  - Interpretación de motivaciones de personajes
  - Reflexión sobre dilemas éticos
  - Escritura argumentativa
  - Debate y discusión
  - Investigación histórica/cultural

##### Conocimientos previos requeridos:
- Lectura de textos narrativos literarios
- Análisis de personajes y motivaciones
- Recursos narrativos (narrador, tiempo, espacio)
- Vocabulario y comprensión lectora
- Escritura coherente y cohesionada

##### Orientaciones didácticas:
Trabajo con obras clásicas y contemporáneas sobre poder y ambición:
- "Macbeth" de Shakespeare
- "Edipo Rey" de Sófocles
- Textos contemporáneos sobre corrupción política/ambición empresarial

**Actividades sugeridas:**
- Debates sobre dilemas éticos
- Ensayos argumentativos
- Análisis crítico de medios de comunicación
- Conexión literatura-actualidad

---

## 🔄 Sistema de Importación

### Herramientas Disponibles:

#### 1. **Auto-Importación Automática**
**Archivo:** `privado/auto-import-planes.html`  
**Acceso:** Dashboard → Botón "Planes y Programas" (barra superior)

**Funcionalidades:**
- ✅ Importación con un solo clic
- ✅ Verificación de planes existentes
- ✅ Actualización automática si ya existe
- ✅ Resumen visual del plan importado
- ✅ Acceso directo al gestor de planes

**Uso:**
1. Abrir desde dashboard: `privado/auto-import-planes.html`
2. Click en "Importar" junto al plan deseado
3. Verificar importación exitosa
4. Opcional: Ver en gestor de planes

#### 2. **Procesador de PDF Automático**
**Archivo:** `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/procesar-pdf-auto.html`  
**Acceso:** Dashboard → Botón "Procesar PDF" (barra superior)

**Funcionalidades:**
- 📄 Extracción automática de texto desde PDF ministerial
- 🤖 Detección inteligente de OA, indicadores y actitudes
- 📊 Estadísticas en tiempo real
- 💾 Descarga JSON + auto-importación a localStorage
- ✅ Compatible con PDF.js 3.11.174

**Uso:**
1. Arrastrar PDF del plan ministerial
2. Sistema extrae automáticamente
3. Descargar JSON o importar directo
4. Listo para usar en el sistema

#### 3. **Script Python (Alternativo)**
**Archivo:** `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/extraer_plan_pdf.py`  
**Requisitos:** Python 3.x + PyPDF2

**Uso:**
```bash
python extraer_plan_pdf.py ruta/al/plan.pdf
```

---

## 📋 Storage Key

**Key de localStorage:** `planes_programas_ministeriales`

**Formato:**
```javascript
[
  {
    "nivel": "2° Medio",
    "asignatura": "Lenguaje y Comunicación",
    "unidad": 4,
    "nombre": "Poder y ambición",
    "proposito": "...",
    "conocimientos_previos": [...],
    "palabras_clave": [...],
    "habilidades": [...],
    "objetivos_aprendizaje": [
      {
        "numero": "OA 3",
        "descripcion": "...",
        "tipo": "específico",
        "indicadores": [...]
      },
      // ... más OA
    ],
    "actitudes": [
      {
        "letra": "B",
        "descripcion": "..."
      },
      // ... más actitudes
    ],
    "orientaciones_didacticas": "...",
    "fecha_creacion": "2025-10-19",
    "version": "1.0"
  }
  // ... más planes
]
```

---

## 🎯 Acceso desde el Sistema

### Desde Dashboard:
1. **Barra superior:** Click en "Planes y Programas" (botón azul)
2. **Gestor de Planes:** `gestor-planes-programas.html` (si existe)
3. **Procesador PDF:** "Procesar PDF" (botón verde)

### Integración con Registro de Notas:
Los planes y programas están disponibles para:
- ✅ Asociar OA a evaluaciones
- ✅ Vincular indicadores a estudiantes
- ✅ Generar planificaciones
- ✅ Exportar informes con alineación curricular

---

## 📝 Planes Pendientes

### Para agregar más adelante:

#### 2° Medio - Lenguaje y Comunicación:
- [ ] Unidad 1
- [ ] Unidad 2
- [ ] Unidad 3
- [x] **Unidad 4: Poder y ambición** ✅

#### Otros Niveles:
- [ ] 3° Medio
- [ ] 4° Medio
- [ ] Otros niveles según necesidad

### Proceso de Agregación:
1. **Opción A:** Usar procesador PDF automático
2. **Opción B:** Importar JSON manualmente
3. **Opción C:** Usar auto-import-planes.html (si el plan está pre-cargado)

---

## 🔍 Verificación

### Comprobar planes cargados:

**Consola del navegador (F12):**
```javascript
// Ver todos los planes
const planes = JSON.parse(localStorage.getItem('planes_programas_ministeriales') || '[]');
console.table(planes.map(p => ({
  Nivel: p.nivel,
  Asignatura: p.asignatura,
  Unidad: p.unidad,
  Nombre: p.nombre,
  OA: p.objetivos_aprendizaje.length,
  Indicadores: p.objetivos_aprendizaje.reduce((sum, oa) => sum + oa.indicadores.length, 0)
})));
```

**Resultado esperado para 2° Medio Unidad 4:**
```
Nivel: 2° Medio
Asignatura: Lenguaje y Comunicación
Unidad: 4
Nombre: Poder y ambición
OA: 15
Indicadores: 87
```

---

## 📊 Estadísticas Actuales

| Métrica | Valor |
|---------|-------|
| **Planes integrados** | 1 |
| **Niveles cubiertos** | 1 (2° Medio) |
| **Asignaturas** | 1 (Lenguaje) |
| **Total OA** | 15 |
| **Total Indicadores** | 87 |
| **Total Actitudes** | 2 |

---

## 🚀 Próximos Pasos

### Recomendaciones:
1. ✅ **Sistema listo para usar** con Unidad 4 de 2° Medio
2. 📚 **Agregar más unidades** cuando sea necesario
3. 🔄 **Usar procesador PDF** para acelerar importación
4. 📋 **Validar OA e indicadores** con documentos oficiales MINEDUC

### Mantenimiento:
- **Actualizaciones:** Si MINEDUC actualiza planes, re-procesar PDF
- **Versiones:** Mantener campo `version` actualizado
- **Backup:** Exportar JSON periódicamente

---

## 📁 Archivos Relacionados

### Sistema:
- `privado/auto-import-planes.html` - Importador automático ⭐
- `privado/dashboard.html` - Acceso desde dashboard
- `privado/gestor-planes-programas.html` - Gestor completo (si existe)

### Datos:
- `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/plan_2Medio_Lenguaje_Unidad4.json` - Datos completos
- `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/procesar-pdf-auto.html` - Procesador PDF
- `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/extraer_plan_pdf.py` - Script Python

### Documentación:
- `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/README.md` - Guía general
- `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/INSTRUCCIONES-USO.md` - Instrucciones detalladas
- `Datos/MARCO TEORICO/PLANES Y PROGRAMAS/RESUMEN-SISTEMA-COMPLETO.md` - Resumen técnico

---

## ✅ Conclusión

El sistema de Planes y Programas está **operativo** con:
- ✅ 1 plan completo integrado (2° Medio Lenguaje Unidad 4)
- ✅ Herramientas de importación automática
- ✅ Acceso desde dashboard
- ✅ Estructura extensible para agregar más planes

**Estado:** 🟢 **LISTO PARA PRODUCCIÓN**

Puedes empezar a trabajar con la Unidad 4 de 2° Medio y agregar más planes cuando lo necesites usando las herramientas automáticas disponibles.
