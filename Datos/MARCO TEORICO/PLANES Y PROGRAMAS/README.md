# 🔧 Extractor de Planes y Programas Ministeriales

Script Python para extraer y estructurar automáticamente Planes y Programas del MINEDUC desde archivos PDF.

## 📋 Requisitos

```bash
pip install PyPDF2
```

## 🚀 Uso Rápido

### Opción 1: Extracción Automática

```bash
python extraer_plan_pdf.py "Lenguaje 5.pdf" "5° Básico" "Lenguaje y Comunicación"
```

Esto generará: `plan_5_Basico_Lenguaje_y_Comunicación.json`

### Opción 2: Con valores por defecto

```bash
python extraer_plan_pdf.py "Lenguaje 5.pdf"
```

Por defecto usa: 5° Básico - Lenguaje y Comunicación

## 📊 Qué Extrae

El script identifica y extrae automáticamente:

✅ **Unidades** con sus nombres  
✅ **Propósito** de cada unidad  
✅ **OA (Objetivos de Aprendizaje)** con numeración  
✅ **Indicadores de evaluación**  
✅ **Contenidos**  
✅ **Habilidades**  
✅ **Actitudes** generales del nivel  

## 📤 Salida

Genera un archivo JSON estructurado:

```json
{
  "nivel": "5° Básico",
  "asignatura": "Lenguaje y Comunicación",
  "fechaExtraccion": "2025-10-19",
  "fuente": "PDF Ministerial",
  "totalUnidades": 4,
  "totalOA": 24,
  "totalIndicadores": 120,
  "actitudesGenerales": [...],
  "unidades": [
    {
      "numero": 1,
      "nombre": "Unidad 1: Narrativa",
      "proposito": "...",
      "objetivos": [
        {
          "numero": 1,
          "descripcion": "Leer habitualmente..."
        }
      ],
      "indicadores": [...],
      "contenidos": [...],
      "habilidades": [...],
      "actitudes": [...]
    }
  ]
}
```

## 🔄 Flujo Completo

### Paso 1: Extraer PDF
```bash
python extraer_plan_pdf.py "Lenguaje 5.pdf" "5° Básico" "Lenguaje y Comunicación"
```

### Paso 2: Importar en el Gestor Web
1. Abre: `privado/gestor-planes-programas.html`
2. Click en "Importar JSON"
3. Selecciona el archivo `.json` generado
4. ¡Listo! El plan está cargado en el sistema

## 📝 Procesar Múltiples Niveles

```bash
# 5° Básico
python extraer_plan_pdf.py "Lenguaje 5.pdf" "5° Básico" "Lenguaje y Comunicación"

# 6° Básico
python extraer_plan_pdf.py "Lenguaje 6.pdf" "6° Básico" "Lenguaje y Comunicación"

# 7° Básico
python extraer_plan_pdf.py "Lenguaje 7.pdf" "7° Básico" "Lenguaje y Comunicación"

# 8° Básico
python extraer_plan_pdf.py "Lenguaje 8.pdf" "8° Básico" "Lenguaje y Comunicación"

# 1° Medio
python extraer_plan_pdf.py "Lenguaje 1M.pdf" "1° Medio" "Lenguaje y Comunicación"

# 2° Medio
python extraer_plan_pdf.py "Lenguaje 2M.pdf" "2° Medio" "Lenguaje y Comunicación"
```

## 🎯 Ventajas del Script

- ⚡ **Rápido**: Procesa un PDF completo en segundos
- 🎯 **Preciso**: Identifica patrones específicos del MINEDUC
- 🔄 **Reproducible**: Mismo resultado siempre
- 📦 **Portable**: Un solo archivo Python
- 🛠️ **Editable**: Ajusta los patrones según necesites

## 🔧 Personalización

### Ajustar Patrones de Búsqueda

Edita las funciones en `extraer_plan_pdf.py`:

- `extraer_unidades()`: Patrón para detectar unidades
- `extraer_objetivos()`: Patrón para OA
- `extraer_indicadores()`: Patrón para indicadores
- etc.

### Agregar Nuevos Campos

Modifica la estructura del plan en `procesar_plan_ministerial()`.

## 🐛 Solución de Problemas

### Error: "PyPDF2 no está instalado"
```bash
pip install PyPDF2
```

### Error: "No se encontró el archivo"
Verifica la ruta del PDF. Usa comillas si tiene espacios:
```bash
python extraer_plan_pdf.py "C:\ruta\con espacios\archivo.pdf"
```

### No extrae bien las unidades
El formato del PDF puede variar. Ajusta los patrones regex en el script.

## 📖 Estructura de Carpetas

```
PLANES Y PROGRAMAS/
├── extraer_plan_pdf.py        ← Este script
├── README.md                   ← Esta guía
├── Lenguaje 5.pdf             ← PDF original
├── plan_5_Basico_....json     ← JSON generado
├── Lenguaje 6.pdf
├── plan_6_Basico_....json
└── ...
```

## 🎓 Uso Avanzado

### Batch Processing (Procesar varios)

Crea un script batch `procesar_todos.bat`:

```batch
@echo off
python extraer_plan_pdf.py "Lenguaje 5.pdf" "5° Básico" "Lenguaje y Comunicación"
python extraer_plan_pdf.py "Lenguaje 6.pdf" "6° Básico" "Lenguaje y Comunicación"
python extraer_plan_pdf.py "Lenguaje 7.pdf" "7° Básico" "Lenguaje y Comunicación"
python extraer_plan_pdf.py "Lenguaje 8.pdf" "8° Básico" "Lenguaje y Comunicación"
python extraer_plan_pdf.py "Lenguaje 1M.pdf" "1° Medio" "Lenguaje y Comunicación"
python extraer_plan_pdf.py "Lenguaje 2M.pdf" "2° Medio" "Lenguaje y Comunicación"
echo Todos los planes procesados!
pause
```

Ejecuta: `procesar_todos.bat`

## 📊 Ejemplo de Salida

```
============================================================
📚 Extractor de Planes y Programas Ministeriales
============================================================
Archivo: Lenguaje 5.pdf
Nivel: 5° Básico
Asignatura: Lenguaje y Comunicación
============================================================

📄 Procesando 156 páginas...
   Página 1/156 procesada
   Página 2/156 procesada
   ...

✅ Texto extraído: 245678 caracteres

🎯 Extrayendo actitudes generales...
   ✓ 8 actitudes encontradas

📖 Extrayendo unidades...

🔍 Encontradas 4 unidades

📚 Unidad 1: Narrativa
   ✓ 6 OA
   ✓ 28 indicadores
   ✓ 12 contenidos

📚 Unidad 2: Lírica
   ✓ 5 OA
   ✓ 24 indicadores
   ✓ 10 contenidos

📚 Unidad 3: Drama
   ✓ 7 OA
   ✓ 32 indicadores
   ✓ 15 contenidos

📚 Unidad 4: No ficción
   ✓ 6 OA
   ✓ 36 indicadores
   ✓ 14 contenidos

============================================================
✅ EXTRACCIÓN COMPLETADA
============================================================
Unidades: 4
OA totales: 24
Indicadores totales: 120
Actitudes: 8
============================================================

💾 Guardado en: plan_5_Basico_Lenguaje_y_Comunicación.json

✅ Proceso completado exitosamente!

💡 Ahora puedes importar 'plan_5_Basico_Lenguaje_y_Comunicación.json' en el gestor web.
```

## 🔗 Integración con el Sistema Web

Una vez extraído el JSON:

1. Abre `privado/gestor-planes-programas.html`
2. Click en **"Importar JSON"**
3. Selecciona el archivo JSON
4. El plan se carga en el sistema automáticamente
5. Ya puedes consultarlo, exportarlo, y usarlo en tus clases

---

**Autor:** Sistema de Gestión Académica  
**Fecha:** Octubre 2025  
**Versión:** 1.0
