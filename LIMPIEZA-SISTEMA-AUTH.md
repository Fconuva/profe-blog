# 🧹 LIMPIEZA COMPLETA DEL SISTEMA DE AUTENTICACIÓN

## ⚠️ PASOS CRÍTICOS - EJECUTAR EN ORDEN

---

## 1️⃣ LIMPIAR FIREBASE AUTHENTICATION

### Ir a Firebase Console
```
https://console.firebase.google.com/project/profe-blog/authentication/users
```

### Eliminar TODOS los usuarios existentes
- Click en cada usuario → Menú (...) → Delete user
- Repetir hasta que la lista esté vacía

---

## 2️⃣ CREAR CUENTA ADMIN MAESTRA

### En Firebase Authentication
1. Click en "Add user"
2. **Email:** `fconuva@gmail.com`
3. **Password:** `xixo97879375`
4. Click "Add user"
5. **COPIAR el UID generado** (ejemplo: `ORg44nlGXpRocKZXxHOfD2zq0712`)

---

## 3️⃣ CREAR DATOS EN REALTIME DATABASE

### Ir a Database
```
https://console.firebase.google.com/project/profe-blog/database/profe-blog-default-rtdb/data
```

### Eliminar TODO el nodo `users/`
1. Click en `users` → Menú (...) → Delete
2. Confirmar

### Crear estructura nueva
1. Click en el icono `+` al lado de `profe-blog-default-rtdb`
2. **Name:** `users`
3. **Value:** (dejar vacío)
4. Click "Add"

### Agregar tu usuario admin
1. Click en el `+` al lado de `users`
2. **Name:** `[PEGAR EL UID COPIADO EN PASO 2]`
3. **Value:** (click en el icono de JSON)
4. Pegar este JSON (reemplaza `TU_UID_AQUI` con el UID real):

```json
{
  "email": "fconuva@gmail.com",
  "username": "fconuva",
  "password": "eGl4bzk3ODc5Mzc1",
  "role": "admin",
  "active": true,
  "createdAt": "2025-11-05T19:00:00.000Z",
  "permissions": {
    "basica": true,
    "especial": true,
    "media": true,
    "parvularia": true,
    "indigena": true,
    "privado": true
  },
  "devices": {},
  "loginHistory": []
}
```

5. Click "Add"

---

## 4️⃣ APLICAR REGLAS DE DATABASE

### En Database Rules
```
https://console.firebase.google.com/project/profe-blog/database/profe-blog-default-rtdb/rules
```

### Pegar estas reglas:

```json
{
  "rules": {
    "sindicato_evento_aniversario": {
      ".read": true,
      ".write": true
    },
    "analytics": {
      ".read": true,
      ".write": true
    },
    "evento_sindicato_inscripciones": {
      ".read": true,
      ".write": true,
      ".indexOn": ["rut", "email", "sede"]
    },
    "asistentes": {
      ".read": true,
      ".write": true
    },
    "paseo_docentes": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": "auth != null",
      ".indexOn": ["username"],
      "$uid": {
        ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "courses": {
      ".read": true,
      ".write": true,
      ".indexOn": ["userId", "courseName", "period"]
    },
    "reservations": {
      ".read": true,
      ".write": true,
      ".indexOn": ["event_date", "attendee_rut"]
    },
    "logs": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp", "userId", "action"]
    },
    "admin": {
      ".read": "auth != null",
      ".write": "auth != null",
      "settings": {
        ".read": true,
        ".write": true
      },
      "sessions": {
        ".read": true,
        ".write": true,
        ".indexOn": ["userId", "deviceId", "timestamp"]
      }
    },
    "devices": {
      ".read": true,
      ".write": true,
      ".indexOn": ["userId", "deviceId", "lastAccess"]
    },
    ".read": false,
    ".write": false
  }
}
```

### Click "Publish"

---

## 5️⃣ LIMPIAR CACHE LOCAL

### En el navegador
1. Abrir DevTools (F12)
2. Ir a "Application" o "Almacenamiento"
3. Click en "Local Storage" → https://profefranciscopancho.com
4. Click derecho → "Clear"
5. Click en "Session Storage" → Clear también
6. Cerrar DevTools
7. Recargar página (Ctrl + Shift + R)

---

## 6️⃣ PROBAR EL SISTEMA

### Paso 1: Ir a la página de login
```
https://profefranciscopancho.com/evaluaciones/
```

### Paso 2: Hacer click en "Iniciar Sesión para Acceder"

### Paso 3: Ingresar credenciales
- **Usuario:** `fconuva` (SIN @gmail.com)
- **Password:** `xixo97879375`
- Click "Iniciar Sesión"

### Paso 4: Verificar acceso
- Debe mostrar "Bienvenido fconuva"
- Debe mostrar todas las secciones disponibles
- Click en cualquier temario → Debe cargar SIN redirigir

---

## 7️⃣ CREAR CUENTA DE PRUEBA

### Opción A: Desde el Panel Admin (RECOMENDADO)

1. Ir a: https://profefranciscopancho.com/evaluaciones/admin/login.html
2. Ingresar:
   - Email: `fconuva@gmail.com`
   - Password: `xixo97879375`
3. Ir a la pestaña "Usuarios"
4. Click en "Crear Usuario"
5. Llenar datos:
   - **Usuario:** `prueba`
   - **Contraseña:** `Test123456`
   - **Permisos:** Marcar "Educación Básica"
6. Click "Crear Usuario"

### Opción B: Manual en Firebase

**En Authentication:**
1. Add user
2. Email: `prueba@profe.cl`
3. Password: `Test123456`
4. Copiar UID generado

**En Database:**
```json
{
  "email": "prueba@profe.cl",
  "username": "prueba",
  "password": "VGVzdDEyMzQ1Ng==",
  "role": "teacher",
  "active": true,
  "createdAt": "2025-11-05T20:00:00.000Z",
  "permissions": {
    "basica": true,
    "especial": false,
    "media": false,
    "parvularia": false,
    "indigena": false,
    "privado": false
  },
  "devices": {},
  "loginHistory": []
}
```

---

## 8️⃣ PROBAR CUENTA DE PRUEBA

1. Cerrar sesión (si está logueado)
2. Ir a `/evaluaciones/`
3. Login con:
   - Usuario: `prueba`
   - Password: `Test123456`
4. Verificar que SOLO ve "Educación Básica"
5. Verificar que puede acceder a temarios de básica

---

## 9️⃣ LIMPIAR CUENTA DE PRUEBA (OPCIONAL)

### Si todo funciona, eliminar cuenta de prueba:

**En Authentication:**
- Buscar `prueba@profe.cl` → Delete user

**En Database:**
- Eliminar el nodo con el UID de prueba

---

## ✅ CHECKLIST FINAL

- [ ] Firebase Authentication limpio (solo fconuva@gmail.com)
- [ ] Database users/ limpio (solo tu UID)
- [ ] Reglas aplicadas y publicadas
- [ ] Cache del navegador limpio
- [ ] Login con fconuva@gmail.com funciona
- [ ] Acceso a temarios sin redirección
- [ ] Cuenta de prueba creada y probada
- [ ] Cuenta de prueba eliminada (si corresponde)

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "auth/invalid-login-credentials"
- El email/password no coinciden en Authentication
- Verificar que el usuario existe en Authentication
- Verificar la contraseña

### Error: "Datos de usuario no encontrados"
- El usuario existe en Auth pero NO en Database
- Agregar el nodo en Database con el UID correcto

### Error: "permission_denied"
- Las reglas no están aplicadas
- Ir a Database Rules → Verificar y Publicar

### Sigue redirigiendo al login
- Limpiar localStorage
- Verificar que el UID en Database coincide con Auth
- Verificar permisos en sessionData

---

**Fecha:** 2025-11-05  
**Estado:** Sistema limpio y funcional con cuenta admin maestra
