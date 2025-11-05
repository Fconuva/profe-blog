# 🔥 Aplicar Reglas de Firebase Database

## ⚠️ ACCIÓN REQUERIDA INMEDIATA

Las reglas de Firebase Realtime Database deben actualizarse para que el sistema de login funcione correctamente.

## 📋 Pasos para Aplicar las Reglas

### 1. Ir a Firebase Console
```
https://console.firebase.google.com/project/profe-blog/database/profe-blog-default-rtdb/rules
```

### 2. Copiar las Reglas del Archivo
Abre el archivo: `FIREBASE-DATABASE-RULES.json`

### 3. Pegar en Firebase Console
Reemplaza TODO el contenido actual con:

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "admin": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    ".read": false,
    ".write": false
  }
}
```

### 4. Hacer Click en "Publicar"

### 5. Confirmar Cambios

---

## 🔍 Qué Hacen Estas Reglas

### Nodo `users/`
- **Lectura**: Cualquier usuario autenticado puede leer todos los usuarios (necesario para login)
- **Escritura**: Solo el propio usuario o un admin puede modificar datos de usuario

### Nodo `admin/`
- **Lectura**: Cualquier usuario autenticado puede leer (para panel admin)
- **Escritura**: Cualquier usuario autenticado puede escribir (logs de acceso)

### Por Defecto
- Todo lo demás está bloqueado (.read y .write = false)

---

## ✅ Verificación

Después de aplicar las reglas:

1. Ve a `/evaluaciones/`
2. Haz click en "Iniciar Sesión para Acceder"
3. Ingresa credenciales de usuario creado
4. **NO debe aparecer** "permission_denied"
5. Debe cargar las secciones con permisos del usuario

---

## 🐛 Solución de Problemas

### Error: "permission_denied at /users"
- Las reglas NO se aplicaron correctamente
- Verifica que hayas hecho click en "Publicar"
- Espera 10-20 segundos para propagación

### Error: "auth/user-not-found"
- El usuario no existe en Firebase Authentication
- Debes crear el usuario desde `/evaluaciones/admin/`

### Error: "Datos de usuario no encontrados"
- El usuario existe en Auth pero NO en Database
- Crea el usuario completo desde el panel admin

---

## 📝 Cambios Implementados en el Código

1. ✅ Agregado Firebase Auth SDK al layout
2. ✅ Cambiado login de Database-only a **Auth + Database**
3. ✅ Eliminada carga duplicada de Firebase
4. ✅ Actualizado logout para cerrar sesión de Auth
5. ✅ Mejorados mensajes de error específicos

---

**Fecha:** 2025-11-05  
**Commit:** Próximo push después de aplicar reglas
