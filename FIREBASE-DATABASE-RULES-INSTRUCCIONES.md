# 🔥 Configurar Reglas de Firebase Realtime Database

## ⚠️ ERROR ACTUAL
```
PERMISSION_DENIED: Permission denied at /admin/login_history/
```

Esto significa que las reglas de seguridad de Firebase Database están bloqueando las escrituras.

---

## 🛠️ SOLUCIÓN: Actualizar reglas en Firebase Console

### Paso 1: Ir a Firebase Console
1. Abre: https://console.firebase.google.com/project/profe-blog/database
2. Selecciona tu proyecto: **profe-blog**
3. En el menú lateral, ve a **Realtime Database**
4. Click en la pestaña **"Rules"** (Reglas)

### Paso 2: Copiar las nuevas reglas

Reemplaza las reglas actuales con estas:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "admin": {
      "login_history": {
        ".read": "auth != null",
        ".write": "auth != null"
      },
      "stats": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    ".read": false,
    ".write": false
  }
}
```

### Paso 3: Publicar las reglas
1. Click en **"Publish"** (botón azul arriba a la derecha)
2. Confirma que quieres publicar

---

## 📋 ¿Qué hacen estas reglas?

### Seguridad por nodo:

| Ruta | Quién puede leer | Quién puede escribir |
|------|-----------------|---------------------|
| `/users/{uid}` | El usuario mismo o admins | El usuario mismo o admins |
| `/admin/login_history` | Cualquier usuario autenticado | Cualquier usuario autenticado |
| `/admin/stats` | Cualquier usuario autenticado | Cualquier usuario autenticado |
| Todo lo demás | Nadie ❌ | Nadie ❌ |

### Ventajas de seguridad:

✅ **Solo usuarios autenticados** pueden acceder a datos
✅ **Usuarios normales** solo ven su propia información
✅ **Admins** pueden ver/editar todos los usuarios
✅ **Login history** se registra para auditoría
✅ **Datos sensibles** protegidos por defecto (`.read: false, .write: false`)

---

## 🧪 Probar que funcionan

Después de publicar las reglas:

1. Ve a: https://www.profefranciscopancho.com/evaluaciones/admin/
2. Login con: `fconuva@gmail.com` / `xixo97879375`
3. Intenta crear un usuario nuevo
4. Debería funcionar sin errores de permisos

---

## 🆘 Si siguen los errores

### Error: "Permission denied" después de aplicar reglas

**Opción temporal (solo para desarrollo):**

Si necesitas acceso inmediato, puedes usar reglas temporales (⚠️ INSEGURO):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Esto permite que cualquier usuario autenticado lea/escriba todo. Solo úsalo temporalmente mientras debuggeas.

### Verificar que el usuario está autenticado

En la consola del navegador, verifica:
```javascript
firebase.auth().currentUser
// Debe mostrar: { uid: "...", email: "fconuva@gmail.com", ... }
```

Si es `null`, el problema es de autenticación, no de reglas.

---

## 📊 Alternativa: Reglas más simples (recomendadas para empezar)

Si las reglas complejas dan problemas, usa estas más simples:

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      ".write": "auth != null"
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

Estas permiten que cualquier usuario autenticado lea/escriba en `/users` y `/admin`, pero siguen protegiendo el resto.

---

## 📝 Archivo de reglas incluido

Las reglas recomendadas están en: `FIREBASE-DATABASE-RULES.json`

Puedes copiarlas directamente desde ese archivo.

---

**Fecha:** Noviembre 5, 2025  
**Sistema:** Firebase Realtime Database
