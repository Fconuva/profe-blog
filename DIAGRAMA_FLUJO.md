# 🔄 DIAGRAMA DE FLUJO - Sistema Colaborativo

## 📊 ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                    USUARIOS (4 cuentas)                          │
├─────────────┬─────────────┬─────────────┬──────────────────────┤
│  fconuva    │   alicia    │  joselin    │        pia           │
│  (admin)    │  (teacher)  │  (teacher)  │     (teacher)        │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬───────────────┘
       │             │             │             │
       │             │             │             │
       └─────────────┴─────────────┴─────────────┘
                     │
                     ▼
       ┌─────────────────────────────────┐
       │   FRONTEND (registro-notas.html) │
       │   ┌─────────────────────────┐   │
       │   │   SessionStorage        │   │
       │   │   ├── username          │   │
       │   │   ├── userRole          │   │
       │   │   └── userFullName      │   │
       │   └─────────────────────────┘   │
       │                                  │
       │   ┌─────────────────────────┐   │
       │   │   LocalStorage (Backup) │   │
       │   │   └── allCourses[]      │   │
       │   └─────────────────────────┘   │
       └──────────┬──────────────────────┘
                  │
                  │ Auto-sync cada 30 seg
                  │
                  ▼
       ┌─────────────────────────────────┐
       │   NETLIFY FUNCTIONS              │
       │   ┌─────────────────────────┐   │
       │   │  GET /api/courses       │   │
       │   │  ├─ Ignora username     │   │
       │   │  ├─ Usa 'fconuva'       │   │
       │   │  └─ Retorna todos       │   │
       │   └─────────────────────────┘   │
       │   ┌─────────────────────────┐   │
       │   │  POST /api/courses/save │   │
       │   │  ├─ Ignora username     │   │
       │   │  ├─ Usa 'fconuva'       │   │
       │   │  └─ Guarda en DB        │   │
       │   └─────────────────────────┘   │
       └──────────┬──────────────────────┘
                  │
                  │ SIEMPRE usa user_id de 'fconuva'
                  │
                  ▼
       ┌─────────────────────────────────┐
       │   NEON DATABASE (PostgreSQL)     │
       │   ┌─────────────────────────┐   │
       │   │  users table            │   │
       │   │  ├─ id: 1               │   │
       │   │  └─ username: 'fconuva' │   │
       │   └─────────────────────────┘   │
       │   ┌─────────────────────────┐   │
       │   │  courses table          │   │
       │   │  (BASE DE DATOS         │   │
       │   │   COMPARTIDA)           │   │
       │   │  ├─ id                  │   │
       │   │  ├─ user_id: 1 (todos)  │   │
       │   │  ├─ course_name         │   │
       │   │  ├─ subject             │   │
       │   │  ├─ period              │   │
       │   │  ├─ config              │   │
       │   │  ├─ students            │   │
       │   │  └─ tasks               │   │
       │   └─────────────────────────┘   │
       └─────────────────────────────────┘
```

---

## 🔄 FLUJO 1: CREACIÓN DE CURSO

```
USUARIO A (fconuva)
    │
    │ 1. Crea nuevo curso "Matemáticas 2025"
    ▼
┌──────────────────┐
│   FRONTEND       │
│ createNewCourse()│
└────┬─────────────┘
     │
     │ 2. Genera ID único (Date.now())
     │ 3. Agrega a allCourses[]
     ▼
┌──────────────────┐
│ saveAllCourses() │
└────┬─────────────┘
     │
     ├─ 4a. Guarda en localStorage (INMEDIATO) ✅
     │
     └─ 4b. Llama syncCoursesToDatabase()
         │
         ▼
    ┌────────────────────┐
    │ POST /api/courses/ │
    │      save          │
    └────┬───────────────┘
         │
         │ 5. Backend recibe { courses: [...] }
         │ 6. Usa 'fconuva' como user_id
         │ 7. INSERT INTO courses...
         ▼
    ┌────────────────────┐
    │  NEON DATABASE     │
    │  courses           │
    │  user_id = 1       │
    └────────────────────┘
         │
         │ 8. CURSO GUARDADO ✅
         ▼

USUARIO B (alicia) - 30 segundos después
    │
    │ Auto-refresh ejecuta
    ▼
┌──────────────────┐
│ GET /api/courses │
└────┬─────────────┘
     │
     │ 9. Backend retorna todos los cursos de user_id=1
     ▼
┌──────────────────┐
│   FRONTEND       │
│ allCourses = DB  │
└────┬─────────────┘
     │
     │ 10. Detecta nuevo curso
     │ 11. Actualiza selector de cursos
     ▼
USUARIO B VE "Matemáticas 2025" ✅
```

---

## 🔄 FLUJO 2: EDICIÓN DE NOTAS

```
USUARIO C (joselin)
    │
    │ 1. Marca checkbox de tarea
    ▼
┌──────────────────┐
│  updateGrade()   │
│  studentIndex: 5 │
│  gradeIndex: 2   │
│  checked: true   │
└────┬─────────────┘
     │
     │ 2. courseData.students[5].grades[2] = true
     │ 3. renderTable() → UI actualizada
     ▼
┌──────────────────┐
│ saveAllCourses() │
└────┬─────────────┘
     │
     ├─ 4a. localStorage ✅
     │
     └─ 4b. syncCoursesToDatabase()
         │
         ▼
    ┌────────────────────┐
    │ POST /api/courses/ │
    │      save          │
    └────┬───────────────┘
         │
         │ 5. UPDATE courses SET...
         ▼
    ┌────────────────────┐
    │  NEON DATABASE     │
    │  (ACTUALIZADO)     │
    └────────────────────┘

USUARIO D (pia) - 30 segundos después
    │
    │ Auto-refresh
    ▼
┌──────────────────┐
│ GET /api/courses │
└────┬─────────────┘
     │
     │ 6. Recibe cursos actualizados
     │ 7. Compara con courseData actual
     │ 8. Detecta cambios
     ▼
┌──────────────────┐
│  renderTable()   │
└────┬─────────────┘
     │
     ▼
USUARIO D VE CHECKBOX MARCADO ✅
```

---

## 🔄 FLUJO 3: CAMBIO DE CURSO

```
USUARIO (cualquiera)
    │
    │ 1. Edita Curso A
    │ 2. Selecciona Curso B en dropdown
    ▼
┌──────────────────┐
│ switchCourse()   │
└────┬─────────────┘
     │
     │ ⚠️ CRÍTICO: Guardar primero
     ▼
┌──────────────────┐
│ saveAllCourses() │ ← Guarda Curso A
└────┬─────────────┘
     │
     │ Timeout 100ms
     ▼
┌──────────────────┐
│ loadCourse(B)    │ ← Carga Curso B
└────┬─────────────┘
     │
     │ Mensaje: "✅ Curso anterior guardado"
     ▼
CURSO B CARGADO, CURSO A GUARDADO ✅
```

---

## 🔄 FLUJO 4: AUTO-REFRESH (Cada 30 segundos)

```
     ⏰ Timer: 30 segundos
         │
         ▼
┌──────────────────────┐
│ setInterval(30000)   │
└────┬─────────────────┘
     │
     │ 1. Muestra indicador de sync
     ▼
┌──────────────────────┐
│ GET /api/courses     │
└────┬─────────────────┘
     │
     │ 2. Recibe cursos desde BD
     ▼
┌──────────────────────┐
│ Comparar con local   │
│ JSON.stringify()     │
└────┬─────────────────┘
     │
     ├─ 3a. ¿HAY CAMBIOS? → SÍ
     │    │
     │    ├─ Actualiza allCourses
     │    ├─ Actualiza courseData
     │    ├─ renderTable()
     │    └─ console.log('✨ Cambios detectados')
     │
     └─ 3b. ¿HAY CAMBIOS? → NO
          │
          └─ No hace nada
               │
               ▼
          ⏰ Espera 30 segundos más
```

---

## 🔄 FLUJO 5: SIN CONEXIÓN A INTERNET

```
USUARIO intenta editar
    │
    │ 1. Marca checkbox
    ▼
┌──────────────────┐
│ updateGrade()    │
└────┬─────────────┘
     │
     │ 2. Actualiza courseData
     ▼
┌──────────────────┐
│ saveAllCourses() │
└────┬─────────────┘
     │
     ├─ 3a. localStorage ✅ (FUNCIONA)
     │
     └─ 3b. syncCoursesToDatabase()
         │
         ▼
    ┌────────────────────┐
    │ fetch(...) FAIL    │
    │ ❌ Network Error    │
    └────┬───────────────┘
         │
         │ 4. catch(error)
         │    console.warn('⚠️ Sin conexión')
         ▼
    ┌────────────────────┐
    │ NO BLOQUEA UI      │
    │ Datos en localStorage │
    └────────────────────┘

USUARIO sigue trabajando ✅

Cuando vuelve conexión:
    │
    │ Auto-refresh ejecuta
    │ O próximo saveAllCourses()
    ▼
syncCoursesToDatabase() ✅
    │
    └─ Sincroniza datos pendientes
```

---

## 🔄 FLUJO 6: USUARIO NUEVO (Primera vez)

```
NUEVA PROFESORA "pia"
    │
    │ 1. Inicia sesión por primera vez
    ▼
┌──────────────────┐
│ Login exitoso    │
│ sessionStorage   │
└────┬─────────────┘
     │
     │ 2. Carga dashboard
     ▼
┌──────────────────┐
│ loadAllCourses() │
└────┬─────────────┘
     │
     │ 3. localStorage vacío
     ▼
┌──────────────────────┐
│loadCoursesFromDatabase()│
└────┬─────────────────┘
     │
     │ 4. GET /api/courses?username=pia
     ▼
┌──────────────────┐
│ BACKEND          │
│ Usa 'fconuva'    │
│ Ignora 'pia'     │
└────┬─────────────┘
     │
     │ 5. Verifica si existe user 'fconuva'
     │    ├─ Existe → Retorna sus cursos
     │    └─ No existe → Crea usuario + retorna vacío
     ▼
┌──────────────────┐
│ FRONTEND         │
│ Recibe cursos    │
└────┬─────────────┘
     │
     │ 6. allCourses = cursos de fconuva
     │ 7. Guarda en localStorage
     ▼
PIA VE TODOS LOS CURSOS ✅
```

---

## 📊 COMPONENTES CLAVE

### 🔹 FRONTEND

```javascript
// Funciones Principales
┌─────────────────────────────┐
│ loadAllCourses()            │ ← Punto de entrada
│  ├─ loadCoursesFromDatabase()│ ← Carga desde BD
│  └─ Migración automática     │
└─────────────────────────────┘

┌─────────────────────────────┐
│ saveAllCourses()            │ ← Guardado dual
│  ├─ localStorage (inmediato)│
│  └─ syncCoursesToDatabase() │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Auto-refresh (30 seg)       │ ← Sincronización
│  ├─ GET /api/courses        │
│  ├─ Compara cambios         │
│  └─ Actualiza si necesario  │
└─────────────────────────────┘
```

### 🔹 BACKEND

```javascript
// Netlify Functions
┌─────────────────────────────┐
│ get-courses.js              │
│  const sharedUsername =     │
│        'fconuva'            │ ← CLAVE
│  SELECT * FROM courses      │
│  WHERE user_id = 1          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ save-courses.js             │
│  const sharedUsername =     │
│        'fconuva'            │ ← CLAVE
│  INSERT/UPDATE courses      │
│  WHERE user_id = 1          │
└─────────────────────────────┘
```

---

## 🎯 PUNTOS CRÍTICOS DE ÉXITO

### ✅ 1. Username Fijo en Backend
```javascript
const sharedUsername = 'fconuva';
// ↑ Este cambio hace que todos compartan la misma base
```

### ✅ 2. Auto-Guardado en switchCourse()
```javascript
function switchCourse() {
    saveAllCourses(); // ← Guarda ANTES de cambiar
    setTimeout(() => loadCourse(newId), 100);
}
```

### ✅ 3. Auto-Refresh Cada 30 Segundos
```javascript
setInterval(async () => {
    // Carga cursos desde BD
    // Detecta cambios
    // Actualiza vista
}, 30000);
```

### ✅ 4. Sincronización Dual
```javascript
function saveAllCourses() {
    localStorage.setItem(...);        // Inmediato
    syncCoursesToDatabase().catch(); // Background
}
```

---

## 🔒 SEGURIDAD Y PERMISOS

```
┌───────────────────────────────────┐
│  ACCIONES POR ROL                 │
├───────────────────────────────────┤
│  ADMIN (fconuva)                  │
│   ✅ Ver cursos                    │
│   ✅ Crear cursos                  │
│   ✅ Editar cursos                 │
│   ✅ Eliminar cursos               │
│   ✅ Borrar todos los datos        │
│   ✅ Resetear sistema              │
├───────────────────────────────────┤
│  TEACHER (alicia/joselin/pia)     │
│   ✅ Ver cursos                    │
│   ✅ Crear cursos                  │
│   ✅ Editar cursos                 │
│   ❌ Eliminar cursos               │
│   ❌ Borrar todos los datos        │
│   ❌ Resetear sistema              │
└───────────────────────────────────┘
```

---

## ⚡ OPTIMIZACIONES

### 📈 Performance
- LocalStorage para acceso instantáneo
- Base de datos para persistencia
- Auto-refresh no bloquea UI
- Sincronización en background

### 🛡️ Confiabilidad
- Dual-save (localStorage + BD)
- Fallback automático
- Manejo de errores silencioso
- Recuperación automática de conexión

### 👥 Colaboración
- Todos ven los mismos datos
- Sincronización automática cada 30 seg
- Detección inteligente de cambios
- Sin conflictos de versiones

---

*Diagrama actualizado: 15 de Octubre, 2025*
