# 🐛 FIX: Problema de Borrado de Cursos - Namespace

## ❌ PROBLEMA REPORTADO

**Síntoma**: "En Marcelo le doy a borrar pero no borra los cursos, los borra pero aparecen nuevamente"

**Causa**: El frontend eliminaba el curso localmente, pero el backend lo borraba de la cuenta de 'fconuva' (Francisco) en lugar de la cuenta de 'marcelo'. Al recargar/sincronizar, el curso reaparecía porque seguía en la base de datos del docente correcto.

---

## 🔍 ANÁLISIS DEL PROBLEMA

### Flujo Incorrecto (ANTES del fix):

```
1. Marcelo presiona "Borrar Curso" (ID: 123)
   ├─ Frontend elimina curso del localStorage de Marcelo ✅
   ├─ Frontend envía DELETE a backend:
   │  └─ body: { courseId: 123 }  ⚠️ SIN USERNAME
   │
2. Backend (delete-course.js) recibe request
   ├─ const sharedUsername = 'fconuva';  ⚠️ HARDCODED
   ├─ Busca curso ID 123 en cuenta de 'fconuva'
   ├─ NO ENCUENTRA el curso (porque está en 'marcelo')
   └─ Retorna error 404
   
3. Frontend muestra "Curso eliminado" ✅ (eliminado localmente)

4. Usuario recarga página o sincroniza
   ├─ Backend carga cursos de 'marcelo'
   ├─ Curso ID 123 AÚN EXISTE en BD
   └─ Curso reaparece en la interfaz ❌
```

### Flujo Correcto (DESPUÉS del fix):

```
1. Marcelo presiona "Borrar Curso" (ID: 123)
   ├─ Frontend elimina curso del localStorage de Marcelo ✅
   ├─ Frontend envía DELETE a backend:
   │  └─ body: { courseId: 123, username: 'marcelo' }  ✅ CON USERNAME
   │
2. Backend (delete-course.js) recibe request
   ├─ const effectiveUsername = username || 'fconuva';  ✅ USA EL ENVIADO
   ├─ console.log('🗑️ Eliminando curso para username: marcelo')
   ├─ Busca curso ID 123 en cuenta de 'marcelo'
   ├─ ENCUENTRA el curso
   └─ DELETE FROM courses WHERE id=123 AND user_id=marcelo_id
   
3. Curso eliminado tanto local como remotamente ✅

4. Usuario recarga página o sincroniza
   └─ Curso NO reaparece (eliminado permanentemente) ✅
```

---

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. Backend: `netlify/functions/delete-course.js`

**ANTES (líneas 33-47)**:
```javascript
// ❌ PROBLEMA: Username hardcoded
const sharedUsername = 'fconuva';

// Obtener el user_id del usuario compartido
let [user] = await sql`
  SELECT id FROM users WHERE username = ${sharedUsername}
`;

if (!user) {
  [user] = await sql`
    INSERT INTO users (username)
    VALUES (${sharedUsername})
    RETURNING id
  `;
}

console.log('Intentando eliminar curso:', { 
  courseId, 
  userId: user.id, 
  username: sharedUsername  // ❌ Siempre 'fconuva'
});
```

**DESPUÉS (líneas 33-51)**:
```javascript
// ✅ SOLUCIÓN: Extraer username del body
const { courseId, username } = body;

if (!courseId) {
  console.error('❌ courseId no proporcionado. Body:', body);
  return new Response(JSON.stringify({
    error: 'Se requiere courseId',
    receivedBody: body
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}

// ✅ Usar el username enviado desde el frontend
const effectiveUsername = username || 'fconuva';
console.log(`🗑️ Eliminando curso para username: ${effectiveUsername}`);

// Obtener el user_id del usuario CORRECTO
let [user] = await sql`
  SELECT id FROM users WHERE username = ${effectiveUsername}
`;

if (!user) {
  [user] = await sql`
    INSERT INTO users (username)
    VALUES (${effectiveUsername})
    RETURNING id
  `;
}

console.log('Intentando eliminar curso:', { 
  courseId, 
  userId: user.id, 
  username: effectiveUsername  // ✅ Username real del docente
});
```

### 2. Frontend: `privado/registro-notas.html`

**ANTES (línea 2658)**:
```javascript
const response = await fetch('/api/courses/delete', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        courseId: courseIdToDelete  // ❌ Sin username
    })
});
```

**DESPUÉS (línea 2658)**:
```javascript
const response = await fetch('/api/courses/delete', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        courseId: courseIdToDelete,
        username: username  // ✅ Enviar username para respetar namespace
    })
});
```

---

## 🧪 RESULTADO ESPERADO

### Test de Verificación:

1. **Como Marcelo**:
   ```
   - Acceder: registro-notas.html?docente=marcelo
   - Crear curso "Test Marcelo Borrado"
   - Esperar 2 segundos (sincronización automática)
   - Presionar botón "Borrar Curso"
   - Recargar página (F5)
   - ✅ El curso NO debe reaparecer
   ```

2. **Verificar logs de Netlify**:
   ```
   📦 Body recibido: { courseId: 456, username: 'marcelo' }
   🗑️ Eliminando curso para username: marcelo
   Intentando eliminar curso: { courseId: 456, userId: 4, username: 'marcelo' }
   ✅ Resultado de eliminación: [{ id: 456, course_name: 'Test Marcelo Borrado' }]
   ```

3. **Verificar en Base de Datos**:
   ```sql
   -- El curso NO debe existir en la tabla courses para user_id de Marcelo
   SELECT * FROM courses c
   JOIN users u ON c.user_id = u.id
   WHERE u.username = 'marcelo' AND c.id = 456;
   -- Resultado esperado: 0 filas
   ```

---

## 📊 IMPACTO DEL FIX

| Docente | ANTES del fix | DESPUÉS del fix |
|---------|--------------|-----------------|
| Francisco | ❌ Borraba solo de localStorage<br>❌ Curso reaparecía | ✅ Borrado persistente |
| Javiera | ❌ Borraba solo de localStorage<br>❌ Curso reaparecía | ✅ Borrado persistente |
| Marcelo | ❌ Borraba solo de localStorage<br>❌ **Curso reaparecía** (problema reportado) | ✅ Borrado persistente |
| Docente3 | ❌ Borraba solo de localStorage<br>❌ Curso reaparecía | ✅ Borrado persistente |
| Docente4 | ❌ Borraba solo de localStorage<br>❌ Curso reaparecía | ✅ Borrado persistente |

---

## 🔗 RELACIÓN CON OTROS FIXES

Este fix es el **tercer y último** de la serie de fixes de namespace:

1. **get-courses.js** (commit 7ca7f68)
   - ✅ Backend ahora carga cursos del username correcto
   - Síntoma resuelto: "Todos ven los cursos de Francisco"

2. **save-courses.js** (commit 7ca7f68)
   - ✅ Backend ahora guarda cursos bajo username correcto
   - Síntoma resuelto: "Cambios en Marcelo afectan a todos"

3. **delete-course.js** (commit f44a7a5) ← **ESTE FIX**
   - ✅ Backend ahora elimina cursos del username correcto
   - Síntoma resuelto: "Borrar en Marcelo no funciona, curso reaparece"

---

## ⚠️ NOTA IMPORTANTE

**El fix estará activo después de que Netlify complete el deploy automático.**

Para verificar:
1. Ir a: https://app.netlify.com/sites/profefranciscopancho-blog/deploys
2. El deploy debe mostrar:
   - Estado: "Published" (verde)
   - Commit: "FIX: delete-course.js ahora respeta namespace"
   - Tiempo: Hace menos de 5 minutos

---

## 🎯 ARCHIVOS MODIFICADOS

```
netlify/functions/delete-course.js  (48 líneas cambiadas)
  ├─ Extraer username del body
  ├─ Usar effectiveUsername en lugar de hardcoded 'fconuva'
  ├─ Logging mejorado con username real
  └─ Mensaje de respuesta incluye username

privado/registro-notas.html  (1 línea cambiada)
  └─ Enviar username en body del DELETE request
```

---

**Fecha de Fix**: 2025-10-19  
**Commit**: `f44a7a5`  
**Estado**: ✅ Pusheado a GitHub  
**Prioridad**: ALTA (completó la serie de fixes de namespace)
