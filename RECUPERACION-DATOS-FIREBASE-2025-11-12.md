# Recuperación de Datos Firebase - 12 de Noviembre 2025

## Problema Identificado

El usuario `francisco_fconuva` (userId: `-OdsATkXfhtj0eBePQwU`) tenía un curso creado pero **sin estudiantes ni tareas**. Los datos se encontraban en otro usuario del sistema.

### Estado Inicial
- **Usuario francisco_fconuva**: Curso vacío (sin students[] ni tasks[])
- **Usuario antiguo** (`-OcBJdvJ6HgRHArZ2Ikp`): 11 cursos completos con estudiantes y tareas
- **localStorage**: Vacío (Array[0])
- **Firebase**: Curso existente pero vacío

## Diagnóstico Realizado

### 1. Verificación de Variables de Entorno (✅ CORRECTAS)
Todas las 7 variables de Vercel configuradas:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_CLIENT_CERT_URL`
- `FIREBASE_DATABASE_URL`

### 2. Corrección de Bug en Firebase Admin SDK
**Problema**: Uso incorrecto de variable `let firebaseApp` causaba re-inicialización en serverless

**Archivos corregidos** (Commit `7c22238`):
- `api/get-courses-Francisco.js`
- `api/save-courses-Francisco.js`
- `api/check-updates-Francisco.js`
- `api/delete-course-Francisco.js`

**Cambio aplicado**:
```javascript
// ❌ ANTES (causaba 500 errors)
let firebaseApp;
if (firebaseApp) { ... }

// ✅ DESPUÉS (correcto para serverless)
if (admin.apps.length > 0) {
  return admin.apps[0];
}
```

### 3. Endpoint de Diagnóstico
**Archivo**: `api/debug-firebase.js` (Commit `327b41f`)

Creado para inspeccionar estructura completa de Firebase:
```
URL: https://www.profefranciscopancho.com/api/debug-firebase
```

**Hallazgos**:
- Usuario `-OcBJdvJ6HgRHArZ2Ikp`: 11 cursos completos
- Usuario `-OdsATkXfhtj0eBePQwU` (francisco_fconuva): 1 curso vacío

## Solución Implementada

### Endpoint de Migración de Datos
**Archivo**: `api/copy-courses-to-francisco.js` (Commit `dde97c0`)

**Función**: Copiar todos los cursos del usuario antiguo al nuevo usuario `francisco_fconuva`

**Proceso ejecutado**:
1. Conectar a Firebase con credenciales de servicio
2. Identificar cursos del usuario antiguo (`-OcBJdvJ6HgRHArZ2Ikp`)
3. Copiar cada curso completo (con students[] y tasks[])
4. Asignar al nuevo userId (`-OdsATkXfhtj0eBePQwU`)
5. Eliminar curso vacío antiguo (`-OdsAUE1rq5KX00KV7r-`)

**Ejecución**:
```
URL: https://www.profefranciscopancho.com/api/copy-courses-to-francisco
Fecha: 12 de Noviembre 2025, ~13:47 hrs
```

### Resultado de la Migración

**✅ 11 cursos copiados exitosamente**:

| Curso | Estudiantes | Tareas | Firebase ID |
|-------|-------------|--------|-------------|
| 3°MEDIO A HC | 38 | 10 | -OdsJ3xaa87Yu1u8xCdo |
| 3° Medio A TP | 44 | 9 | -OdsJ3ypaDF3c0QV055y |
| 3° Medio E - TP | 41 | 4 | -OdsJ4-1SKxVfysK2nS6 |
| 3° Medio C - TP | 44 | 7 | -OdsJ4-cljNXJ28IjSbY |
| 4° Medio B - HC | 37 | 10 | -OdsJ40dRHJH78UL-kNU |
| 3° Medio A - TP | 45 | 4 | -OdsJ41PLqu2kTUuw8bx |
| 3° Medio B - TP | 43 | 7 | -OdsJ426yxzyND8ElQO4 |
| 3° Medio A | 0 | 12 | -OdsJ42pjbThKeBqRXnb |
| Mi Curso | 0 | 0 | -OdsJ43Kh5s2JhR0O3OG |
| 4° Medio A- HC | 37 | 11 | -OdsJ43n1IW199eVmKYT |
| 3°MEDIO B HC | 38 | 12 | -OdsJ44dpPggxeW6TBmn |

**Total**: 367 estudiantes + 86 tareas migradas

## Verificación Final

✅ Usuario accedió a: `https://www.profefranciscopancho.com/privado/registro-notas?docente=francisco`

✅ Todos los cursos, estudiantes y tareas visibles

✅ Sistema funcionando correctamente

## Archivos Importantes Creados/Modificados

### Archivos API
1. `api/debug-firebase.js` - Diagnóstico de datos
2. `api/copy-courses-to-francisco.js` - Migración de cursos
3. `api/get-courses-Francisco.js` - Corregido (Firebase init)
4. `api/save-courses-Francisco.js` - Corregido (Firebase init)
5. `api/check-updates-Francisco.js` - Corregido (Firebase init)
6. `api/delete-course-Francisco.js` - Corregido (Firebase init)

### Commits Importantes
- `d97e820` - Actualización de .gitignore para proteger credenciales
- `a5001a3` - Endpoint de test de variables de entorno
- `7c22238` - Corrección crítica de Firebase initialization
- `327b41f` - Endpoint de debug Firebase
- `dde97c0` - Endpoint de migración de cursos

## Comandos para Futuras Migraciones

### Ver datos de Firebase
```bash
curl https://www.profefranciscopancho.com/api/debug-firebase
```

### Migrar cursos (si es necesario nuevamente)
```bash
curl https://www.profefranciscopancho.com/api/copy-courses-to-francisco
```

### Verificar variables de entorno
```bash
curl https://www.profefranciscopancho.com/api/test-env
```

## Lecciones Aprendidas

1. **Firebase en Serverless**: Usar `admin.apps.length` en lugar de variables globales
2. **Diagnóstico**: Crear endpoints de debug antes de modificar datos
3. **Migración**: Siempre verificar userId antes de copiar datos
4. **Seguridad**: Mantener credenciales en variables de entorno, nunca en código
5. **Verificación**: Comprobar localStorage y Firebase por separado

## Seguridad Post-Implementación

⚠️ **RECOMENDACIÓN**: Los endpoints de debug y migración deberían:
- Ser eliminados después de usarlos, O
- Protegerse con autenticación, O
- Requerir un token secreto

### Para eliminar endpoints de debug:
```bash
rm api/debug-firebase.js
rm api/copy-courses-to-francisco.js
git add .
git commit -m "security: eliminar endpoints de debug/migración"
git push origin main
```

---

**Documento creado**: 12 de Noviembre 2025  
**Sistema**: Firebase Realtime Database + Vercel Serverless  
**Resultado**: ✅ Datos recuperados exitosamente
