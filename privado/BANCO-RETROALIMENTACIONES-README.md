# 📚 Banco de Retroalimentaciones para Estudiantes

## Descripción

Sistema integral de retroalimentación pedagógica basado en las **Bases Curriculares Chilenas** para Lenguaje y Comunicación (3° y 4° Medio) y el **Marco para la Buena Enseñanza (MBE)**.

## Características Principales

### 🎯 Niveles de Rendimiento

El sistema categoriza automáticamente a los estudiantes en 6 niveles según su porcentaje de cumplimiento:

| Nivel | Porcentaje | Nota Aproximada | Descriptor |
|-------|------------|-----------------|------------|
| **Excelente** | 90-100% | 6.5-7.0 | Logrado Destacado |
| **Muy Bueno** | 80-89% | 5.5-6.4 | Logrado Completamente |
| **Bueno** | 70-79% | 5.0-5.4 | Logrado |
| **Suficiente** | 60-69% | 4.0-4.9 | Medianamente Logrado |
| **Insuficiente** | 40-59% | 2.5-3.9 | Por Lograr |
| **Deficiente** | 0-39% | 1.0-2.4 | No Logrado |

### 📝 Tipos de Retroalimentación

#### 1. **Retroalimentaciones Generales**
Comentarios holísticos sobre el desempeño global del estudiante.

#### 2. **Retroalimentaciones Específicas por Área**
- 📖 **Lectura y Comprensión**: Análisis literario, comprensión crítica, inferencias
- ✍️ **Escritura y Producción de Textos**: Coherencia, cohesión, argumentación
- 🗣️ **Comunicación Oral**: Expresión, fluidez, adaptación al contexto

#### 3. **Retroalimentaciones Actitudinales**
- Participación en clases
- Responsabilidad y cumplimiento
- Trabajo autónomo
- Trabajo colaborativo

#### 4. **Elementos de Apoyo según Nivel**

| Nivel | Elementos Incluidos |
|-------|-------------------|
| **Excelente / Muy Bueno** | Desafíos y proyecciones de profundización |
| **Bueno** | Sugerencias de mejora específicas |
| **Suficiente** | Estrategias de apoyo y plan de mejora |
| **Insuficiente** | Plan de mejora urgente con acciones concretas |
| **Deficiente** | Plan de recuperación intensivo con derivación a especialistas |

## 🎓 Alineación Curricular

### Bases Curriculares (Lenguaje y Comunicación)

El banco está alineado con los **Objetivos de Aprendizaje (OA)** de las Bases Curriculares:

- **OA1**: Lectura y análisis de textos literarios
- **OA2**: Producción de textos escritos con coherencia y cohesión
- **OA3**: Comprensión lectora crítica y formulación de interpretaciones

### Marco para la Buena Enseñanza (MBE)

Se integran los criterios del MBE 2021:

- **Criterio A**: Conocimiento disciplinar del currículum
- **Criterio B**: Retroalimentación efectiva y oportuna
- **Criterio C**: Evaluación formativa basada en evidencia
- **Criterio D**: Altas expectativas para todos los estudiantes

## 🚀 Cómo Usar el Banco

### Paso 1: Generar Informe Individual
1. En el **Registro de Notas**, ve a la sección "Informes Individuales"
2. Selecciona un estudiante del menú desplegable
3. El sistema calcula automáticamente:
   - Nota final
   - Porcentaje de tareas completadas
   - Nivel de rendimiento

### Paso 2: Abrir el Banco de Retroalimentaciones
1. Haz clic en el botón **"Banco de Retroalimentaciones"** (ícono de bombilla)
2. El sistema muestra automáticamente las retroalimentaciones apropiadas para el nivel del estudiante

### Paso 3: Seleccionar Retroalimentación
Tienes tres opciones:

#### Opción A: Inserción Manual
- Navega por las diferentes categorías (General, Lectura, Escritura, etc.)
- Haz clic en cualquier tarjeta de retroalimentación
- Se insertará automáticamente en el campo de retroalimentación del estudiante

#### Opción B: Generador Automático
- Haz clic en **"Generar Retroalimentación Completa Automática"**
- El sistema combina automáticamente:
  - Una retroalimentación general
  - Una retroalimentación específica de un área
  - Una sugerencia/estrategia/desafío según el nivel
  - Un resumen estadístico del rendimiento

#### Opción C: Combinación
- Usa el generador automático como base
- Edita manualmente el texto generado
- Agrega retroalimentaciones adicionales específicas

### Paso 4: Personalizar y Guardar
1. Edita el texto en el campo de retroalimentación según sea necesario
2. El sistema guarda automáticamente todos los cambios
3. Imprime o descarga el informe individual

## 💡 Ejemplos de Uso

### Ejemplo 1: Estudiante Excelente (95%)
**Retroalimentación Generada:**
```
¡Excelente trabajo, María! Has demostrado un dominio excepcional de los contenidos. 
Tu desempeño refleja dedicación y comprensión profunda.

Tu capacidad de análisis literario es sobresaliente. Interpretas textos con profundidad 
y fundamentas tus opiniones con evidencia textual sólida.

Te desafío a profundizar aún más en análisis intertextuales. Podrías explorar 
conexiones entre diferentes obras literarias.

📊 Resumen: Has completado 19 de 20 tareas (95%), alcanzando un nivel Logrado Destacado.
```

### Ejemplo 2: Estudiante Suficiente (65%)
**Retroalimentación Generada:**
```
Has logrado alcanzar el nivel mínimo esperado, Juan. Es importante que sigas trabajando 
para consolidar tus aprendizajes.

Comprendes información explícita básica. Necesitas trabajar en la identificación de ideas 
principales y hacer inferencias simples.

URGENTE: Dedica al menos 30 minutos diarios a la lectura. Comienza con textos breves y 
aumenta gradualmente la complejidad.

📊 Resumen: Has completado 13 de 20 tareas (65%), alcanzando un nivel Medianamente Logrado.
```

### Ejemplo 3: Estudiante Insuficiente (45%)
**Retroalimentación Generada:**
```
Pedro, no has alcanzado el nivel mínimo esperado. Es fundamental que refuerces urgentemente 
tus aprendizajes con apoyo adicional.

Presentas dificultades significativas en comprensión lectora. No identificas ideas principales 
ni información explícita básica.

ACCIÓN INMEDIATA: Requieres apoyo del Programa de Integración Escolar (PIE) o tutorías 
personalizadas.

📊 Resumen: Has completado 9 de 20 tareas (45%), alcanzando un nivel Por Lograr.
```

## 🔧 Personalización

### Modificar el Banco de Retroalimentaciones

El archivo `banco-retroalimentaciones.json` es totalmente editable. Puedes:

1. **Agregar nuevas retroalimentaciones**: Añade elementos a los arrays
2. **Modificar textos existentes**: Edita las retroalimentaciones según tu estilo
3. **Ajustar niveles**: Cambia los rangos de porcentaje si es necesario
4. **Crear nuevas categorías**: Agrega áreas específicas (ej: "Investigación", "Literatura")

### Estructura del JSON

```json
{
  "retroalimentaciones": {
    "excelente": {
      "generales": ["array de retroalimentaciones"],
      "especificas": {
        "lectura": ["array"],
        "escritura": ["array"],
        "comunicacion_oral": ["array"]
      },
      "desafios": ["array"]
    },
    // ... otros niveles
  }
}
```

## 📊 Ventajas Pedagógicas

### ✅ Para el Profesor
- **Ahorro de tiempo**: Reduce el tiempo de redacción de retroalimentaciones
- **Consistencia**: Mantiene estándares uniformes de evaluación
- **Alineación curricular**: Garantiza referencias a OAs oficiales
- **Profesionalismo**: Lenguaje técnico-pedagógico apropiado

### ✅ Para el Estudiante
- **Claridad**: Retroalimentaciones específicas y comprensibles
- **Orientación**: Saben exactamente qué mejorar y cómo hacerlo
- **Motivación**: Reconocimiento de logros y desafíos apropiados
- **Equidad**: Todos reciben retroalimentación de calidad similar

### ✅ Para Apoderados
- **Transparencia**: Comprenden el nivel de su hijo/a
- **Acción**: Reciben sugerencias concretas de apoyo en casa
- **Fundamentación**: Retroalimentaciones basadas en currículum oficial

## 🎨 Características de Diseño

- **Colores según nivel**: Verde (excelente), Azul (muy bueno), Índigo (bueno), Amarillo (suficiente), Naranja (insuficiente), Rojo (deficiente)
- **Iconografía clara**: Cada sección tiene íconos distintivos
- **Interfaz intuitiva**: Un clic para insertar, scroll para explorar
- **Responsive**: Funciona en tablets y computadores
- **Vista previa**: Muestra el texto antes de insertar

## 🔒 Privacidad y Almacenamiento

- Todos los datos se almacenan **localmente** en el navegador (localStorage)
- No se envía información a servidores externos
- El banco de retroalimentaciones es un archivo estático JSON
- Compatible con el modo offline

## 📚 Fuentes y Referencias

### Documentos Base
1. **Bases Curriculares 3° y 4° Medio** (MINEDUC)
2. **Bases Curriculares 7° a 2° Medio** (MINEDUC)
3. **Marco para la Buena Enseñanza 2021** (CPEIP)

### Principios Pedagógicos Aplicados
- Evaluación formativa y retroalimentación efectiva
- Diferenciación según niveles de logro
- Altas expectativas para todos los estudiantes
- Enfoque en el desarrollo de habilidades (no solo contenidos)
- Alineación con estándares nacionales

## 🛠️ Mantenimiento y Actualizaciones

### Actualizar el Banco
1. Edita el archivo `banco-retroalimentaciones.json`
2. Guarda los cambios
3. Recarga la página (Ctrl+F5 para forzar recarga)
4. Los cambios se reflejan inmediatamente

### Backup de Retroalimentaciones
1. Exporta los datos del curso a Excel
2. El campo "Retroalimentación" se incluye en la exportación
3. Guarda copias de seguridad periódicas

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar esto para otras asignaturas?**
R: Sí, pero debes modificar el JSON con OAs y retroalimentaciones específicas de tu asignatura.

**P: ¿Las retroalimentaciones se guardan automáticamente?**
R: Sí, cada vez que insertas una retroalimentación, se guarda en localStorage.

**P: ¿Puedo editar las retroalimentaciones después de insertarlas?**
R: Sí, puedes editar manualmente el campo de texto. Los cambios se guardan automáticamente.

**P: ¿Qué pasa si cambio el porcentaje de aprobación?**
R: Las notas se recalculan, pero el sistema sigue usando los porcentajes de tareas para determinar el nivel de retroalimentación.

**P: ¿Puedo agregar retroalimentaciones personalizadas?**
R: Sí, edita el JSON o escribe directamente en el campo de texto.

## 📞 Soporte

Para preguntas, sugerencias o reportar errores, contacta al administrador del sistema.

---

**Versión**: 1.0  
**Fecha**: Diciembre 2024  
**Autor**: Prof. Francisco Concha  
**Asignatura**: Lenguaje y Comunicación  
**Basado en**: Bases Curriculares MINEDUC y MBE 2021
