# 📘 Guía: Sistema de Bases de Datos Separadas por Docente

**Fecha:** 19 de Octubre, 2025  
**Versión:** 3.0 - Aislamiento Completo por Docente

---

## 🎯 Problema Resuelto

### ❌ Antes
- Todos los docentes compartían la misma base de datos
- Los cursos de Francisco se copiaban a Javiera, Valentina y Marcelo
- No había separación de datos
- Riesgo de mezclar información entre docentes

### ✅ Ahora
- **Cada docente tiene su propia base de datos independiente**
- No se mezclan cursos, estudiantes ni tareas
- Sistema de backup automático diario
- Herramientas de limpieza y restauración

---

## 👥 Configuración de Docentes

| Docente | Nombre Real | Namespace | Color |
|---------|-------------|-----------|-------|
| 1 | Francisco Javier Núñez Valenzuela | `francisco` | Indigo |
| 2 | Javiera Poblete | `javiera` | Purple |
| 3 | Valentina | `docente3` | Teal |
| 4 | Marcelo | `docente4` | Orange |

---

## 🗄️ Estructura de Datos

Cada docente tiene su propio namespace en localStorage:

```javascript
// Francisco
francisco_allCourses      // Sus cursos
francisco_currentCourseId // Curso activo
francisco_config          // Su configuración

// Javiera
javiera_allCourses
javiera_currentCourseId
javiera_config

// Valentina
docente3_allCourses
docente3_currentCourseId
docente3_config

// Marcelo
docente4_allCourses
docente4_currentCourseId
docente4_config
```

**🔒 Aislamiento Total:** Cada docente trabaja en su propio espacio sin interferir con los demás.

---

## 🛠️ Herramientas Administrativas

### 1. **Gestor de Bases de Datos** (`admin-db-docentes.html`)

**Ubicación:** Dashboard → Botón "Admin DB" (arriba derecha)

**Funciones:**
- ✅ Ver estado de cada docente (cursos, estudiantes)
- ✅ Ver detalles de cursos por docente
- ✅ Crear backup individual
- ✅ Limpiar datos de un docente específico
- ✅ Limpiar todos excepto Francisco
- ✅ Restaurar desde backup

#### Acciones Disponibles:

**Por Docente:**
- **Ver Detalles**: Lista todos los cursos con estudiantes y tareas
- **Backup**: Descarga archivo JSON con todos sus datos
- **Limpiar**: Elimina TODOS los datos (crea backup automático primero)

**Acciones Masivas:**
- **Backup de TODOS**: Descarga 4 archivos JSON (uno por docente)
- **Limpiar Javiera, Valentina, Marcelo**: Limpia todos excepto Francisco
- **Restaurar desde Backup**: Sube un archivo JSON para restaurar

---

### 2. **Backup Automático** (`backup-automatico.html`)

**Funcionalidades:**
- ⏰ Backup programado cada 1, 6, 12 o 24 horas
- 📦 Mantiene historial de 5-30 backups por docente
- 🔄 Rotación automática (elimina backups antiguos)
- 📊 Dashboard con estado y próximo backup
- 📜 Historial completo de backups
- ⚡ Backup manual bajo demanda

#### Configuración Recomendada:
```
Intervalo: Cada 24 horas (Diario)
Máximo de Backups: 10 por docente
Activar Backup Automático: ✓ SÍ
```

---

## 🚀 Procedimiento para Limpiar Docentes

### Escenario: Javiera, Valentina y Marcelo tienen cursos de Francisco que deben eliminarse

#### **Método 1: Limpieza Masiva (Recomendado)**

1. Ve al Dashboard
2. Click en **"Admin DB"** (arriba derecha)
3. Scroll hasta **"Acciones Masivas"**
4. Click en **"Limpiar Javiera, Valentina, Marcelo"**
5. Confirma la acción

✅ **Resultado:**
- Javiera, Valentina y Marcelo quedan con bases de datos vacías
- Francisco NO es afectado
- Se crean 3 backups automáticamente (por seguridad)

---

#### **Método 2: Limpieza Individual**

1. Ve a `admin-db-docentes.html`
2. En la tarjeta de **Javiera**:
   - Click en **"Ver Detalles"** (revisar qué tiene)
   - Click en **"Backup"** (descargar por seguridad)
   - Click en **"Limpiar"** (eliminar todo)
   - Confirmar 2 veces
3. Repetir para **Valentina** y **Marcelo**

---

## 📥 Cargar Estudiantes Después de Limpiar

Una vez que Javiera, Valentina y Marcelo tienen sus bases de datos vacías, pueden cargar sus propios estudiantes.

### Opción 1: Carga Individual (Simple)

1. Ir al **Dashboard**
2. Seleccionar el docente (ej. "Javiera")
3. Click en **"Ir al Sistema"**
4. Click en **"+ Crear Nuevo Curso"**
5. Llenar información del curso
6. **Agregar estudiantes uno por uno:**
   - Click en "Agregar Estudiante"
   - Nombre, RUN, etc.
   - Guardar
   - Repetir

### Opción 2: Carga Masiva CSV (Rápido)

1. Preparar archivo CSV con formato:
   ```csv
   nombre,run,email
   Juan Pérez,12345678-9,juan@email.com
   María González,98765432-1,maria@email.com
   ```

2. En el sistema de registro:
   - Click en **"Importar Estudiantes CSV"**
   - Seleccionar archivo
   - Mapear columnas
   - Importar

### Opción 3: Agregar Varios Estudiantes (Intermedio)

1. En el curso:
   - Click en **"Agregar Varios Estudiantes"**
   - Llenar formulario múltiple (3-5 a la vez)
   - Guardar todos juntos

---

## 🔄 Flujo de Trabajo Diario

### Para Francisco (Ya tiene datos)
1. Entrar al sistema
2. Seleccionar curso
3. Registrar notas
4. Guardar

### Para Javiera, Valentina, Marcelo (Después de limpieza)
1. Crear su primer curso
2. Agregar estudiantes (individual o CSV)
3. Crear tareas/evaluaciones
4. Registrar notas
5. El sistema guarda automáticamente en su namespace

---

## 🔒 Garantías del Sistema

### ✅ Aislamiento Total
- Cada docente ve SOLO sus cursos
- No se cruzan datos entre docentes
- Cambios de uno NO afectan a otros

### ✅ Backup Automático
- Backup diario de TODOS los docentes
- Historial de 10 backups por docente
- Restauración en cualquier momento

### ✅ Seguridad
- Backup automático antes de limpieza
- Confirmación doble en acciones destructivas
- Log de todas las acciones

---

## 📊 Ejemplo de Uso Real

### Colegio con 50 Cursos y 200 Docentes

```
Base de Datos del Sistema
├── francisco_allCourses (10 cursos)
│   ├── 3°A HC - 35 estudiantes
│   ├── 3°B HC - 33 estudiantes
│   └── ...
├── javiera_allCourses (8 cursos)
│   ├── 1°A - 40 estudiantes
│   ├── 2°B - 38 estudiantes
│   └── ...
├── docente3_allCourses (12 cursos)
│   └── ...
└── docente4_allCourses (5 cursos)
    └── ...
```

**Cada docente trabaja independientemente:**
- Francisco registra el Lunes a las 10:00 AM
- Javiera registra el Martes a las 2:00 PM
- Valentina registra el Miércoles a las 9:00 AM
- Marcelo registra el Jueves a las 3:00 PM

**NO hay conflictos ni mezclas de datos.**

---

## 🐛 Solución de Problemas

### Problema: "Veo cursos que no son míos"
**Solución:**
1. Ve a `admin-db-docentes.html`
2. Verifica qué docente tiene esos cursos
3. Limpia el docente correspondiente
4. Recarga la página

### Problema: "Perdí mis datos"
**Solución:**
1. Ve a `backup-automatico.html`
2. Click en "Ver Historial"
3. Busca el backup más reciente
4. Click en "Restaurar"

### Problema: "El backup automático no funciona"
**Solución:**
1. Ve a `backup-automatico.html`
2. Verifica que "Activar Backup Automático" esté ✓
3. Guarda la configuración
4. Ejecuta backup manual para probar

---

## 📝 Checklist de Implementación

### Paso 1: Limpieza Inicial
- [ ] Hacer backup de Francisco (por seguridad)
- [ ] Abrir `admin-db-docentes.html`
- [ ] Click en "Limpiar Javiera, Valentina, Marcelo"
- [ ] Confirmar acción
- [ ] Verificar que Francisco sigue con sus datos

### Paso 2: Configurar Backup Automático
- [ ] Abrir `backup-automatico.html`
- [ ] Configurar intervalo: 24 horas
- [ ] Configurar máximo: 10 backups
- [ ] Activar backup automático ✓
- [ ] Guardar configuración
- [ ] Ejecutar backup manual para probar

### Paso 3: Javiera Carga sus Datos
- [ ] Login como Javiera
- [ ] Crear primer curso
- [ ] Importar estudiantes CSV (o uno por uno)
- [ ] Crear tareas
- [ ] Guardar

### Paso 4: Repetir para Valentina y Marcelo
- [ ] Valentina crea sus cursos
- [ ] Marcelo crea sus cursos
- [ ] Verificar que cada uno ve SOLO sus datos

### Paso 5: Verificación Final
- [ ] Revisar `admin-db-docentes.html`
- [ ] Confirmar que cada docente tiene sus cursos
- [ ] Verificar que no hay duplicados
- [ ] Probar backup/restauración

---

## 🎓 Mejores Prácticas

### Para Administradores
1. **Backup semanal manual** (además del automático)
2. **Revisar estado mensual** de todas las bases de datos
3. **Limpiar backups antiguos** (más de 3 meses)
4. **Documentar cambios** importantes

### Para Docentes
1. **Crear cursos con nombres claros** (ej. "3°A HC Lenguaje 2025")
2. **Guardar frecuentemente** durante el registro de notas
3. **Usar importación CSV** para listas grandes de estudiantes
4. **No borrar cursos** sin hacer backup primero

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa el Log** en cualquier herramienta administrativa
2. **Consulta esta guía** antes de hacer cambios
3. **Haz backup** antes de acciones destructivas
4. **Prueba en un docente de prueba** antes de cambios masivos

---

**Última actualización:** 19 de Octubre, 2025  
**Versión del sistema:** 3.0  
**Estado:** ✅ Producción
