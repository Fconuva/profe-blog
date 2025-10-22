# 🚀 GUÍA DE USO RÁPIDO - PROCESADOR AUTOMÁTICO

## ✅ TODO LISTO - Sigue estos pasos:

### Paso 1: Abrir el Procesador
1. Abre tu navegador (Chrome, Edge, Firefox)
2. Arrastra este archivo al navegador:
   ```
   C:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\Datos\MARCO TEORICO\PLANES Y PROGRAMAS\procesar-pdf-auto.html
   ```

### Paso 2: Cargar el PDF
1. En la página que se abre, verás una zona de arrastre
2. **Opción A**: Arrastra `Lenguaje 5.pdf` a la zona
3. **Opción B**: Haz clic en la zona y selecciona `Lenguaje 5.pdf`

### Paso 3: Esperar la Extracción
El sistema automáticamente:
- ✅ Lee todas las páginas del PDF
- ✅ Extrae unidades, OA, indicadores, actitudes
- ✅ Procesa y estructura los datos
- ✅ Muestra estadísticas en tiempo real
- ✅ Genera el JSON listo para usar

### Paso 4: Descargar o Importar
Una vez terminado, tienes 2 opciones:

**Opción 1: Descargar JSON** 💾
- Click en "Descargar JSON"
- Guarda el archivo
- Puedes revisarlo antes de importar

**Opción 2: Importar Directo** 🚀
- Click en "Importar al Gestor"
- Se abre automáticamente gestor-planes-programas.html
- El plan ya está cargado y listo para usar

---

## 🎯 LO QUE EXTRAE AUTOMÁTICAMENTE:

### ✅ Actitudes (8-10 actitudes con letras A-H)
Ejemplo:
- A: Demostrar interés y una actitud activa frente a la lectura
- B: Realizar tareas y trabajos de forma rigurosa y perseverante

### ✅ Unidades (4-6 unidades)
Ejemplo:
- Unidad 1: Narrativa
- Unidad 2: Poesía
- Unidad 3: No ficción
- Unidad 4: Comunicación oral

### ✅ Objetivos de Aprendizaje (OA)
Ejemplo:
- OA 1: Leer de manera fluida textos variados apropiados a su edad
- OA 2: Comprender textos aplicando estrategias de comprensión lectora

### ✅ Indicadores de Evaluación (30-40 por unidad)
Ejemplo:
- Leen en voz alta: diciendo las palabras sin error
- Adaptan el volumen de la voz para que escuche toda la audiencia

### ✅ Contenidos y Habilidades
Todo lo necesario para planificar clases y evaluaciones

---

## 📊 EJEMPLO DE SALIDA:

```json
{
  "nivel": "5° Básico",
  "asignatura": "Lenguaje y Comunicación",
  "totalUnidades": 4,
  "totalOA": 28,
  "totalIndicadores": 124,
  "actitudesGenerales": [
    {
      "letra": "A",
      "descripcion": "Demostrar interés y una actitud activa..."
    }
  ],
  "unidades": [
    {
      "numero": 1,
      "nombre": "Narrativa",
      "proposito": "Desarrollar habilidades de lectura...",
      "objetivos": [
        {
          "numero": 1,
          "descripcion": "Leer de manera fluida..."
        }
      ],
      "indicadores": [...],
      "contenidos": [...],
      "habilidades": [...]
    }
  ]
}
```

---

## 🔥 VENTAJAS DEL SISTEMA:

1. **No requiere instalación** - Solo navegador web
2. **Procesamiento rápido** - 156 páginas en 30 segundos
3. **Extracción inteligente** - Detecta patrones ministeriales
4. **Vista previa en tiempo real** - Ves el progreso
5. **Estadísticas instantáneas** - Sabes exactamente qué se extrajo
6. **Doble salida** - JSON descargable + Importación directa
7. **Log detallado** - Ves cada paso del proceso
8. **Responsive** - Funciona en PC, tablet, móvil

---

## 🐛 SI ALGO FALLA:

### El PDF no carga
- Verifica que el archivo es "Lenguaje 5.pdf"
- Asegúrate que no está corrupto
- Intenta con otro navegador (Chrome recomendado)

### No se extraen todos los datos
- Es normal, los PDFs ministeriales varían en formato
- El sistema extrae lo que puede identificar
- Puedes editar manualmente en gestor-planes-programas.html

### El botón "Importar" no funciona
- Usa "Descargar JSON" en su lugar
- Abre gestor-planes-programas.html
- Click en "Importar JSON"
- Selecciona el archivo descargado

---

## 📝 PRÓXIMOS PASOS:

Una vez procesado 5° Básico, puedes procesar:
- 6° Básico
- 7° Básico
- 8° Básico
- 1° Medio
- 2° Medio

El mismo proceso para cada uno. ¡Solo arrastra el PDF!

---

## 🎓 INTEGRACIÓN CON EL SISTEMA:

Los planes procesados quedan disponibles en:
1. **gestor-planes-programas.html** - Ver, editar, exportar
2. **registro-notas.html** - Seleccionar OA al crear evaluaciones
3. **dashboard.html** - Acceso desde Control Maestro

---

**¡LISTO PARA USAR!** 🚀

Solo abre `procesar-pdf-auto.html` en tu navegador y arrastra el PDF.
