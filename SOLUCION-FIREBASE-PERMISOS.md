# 🔧 Solución: Error de Permisos Firebase - Login

## 📋 Diagnóstico del Problema

**Error detectado:**
```
Error: permission_denied at /users: Client doesn't have permission to access the desired data.
```

**Causa:** Las reglas de Firebase Realtime Database no están aplicadas o están configuradas incorrectamente en la consola de Firebase.

---

## ✅ Solución Paso a Paso

### 1️⃣ Verificar y Aplicar Reglas en Firebase Console

1. **Ir a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona tu proyecto

2. **Navegar a Realtime Database:**
   - En el menú lateral: `Build` → `Realtime Database`
   - Click en la pestaña `Rules`

3. **Aplicar las siguientes reglas:**

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
      ".read": true,
      ".write": true,
      ".indexOn": ["username"]
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
    }
  }
}
```

4. **Click en "Publicar"** (Publish)

---

### 2️⃣ Verificar Configuración de Firebase en el Código

El archivo `evaluaciones/login.html` debe tener la configuración correcta de Firebase:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBPHzM_YE0m3AKD9xhz2wSFo3yv8OqjnLs",
    authDomain: "profefranciscopancho.firebaseapp.com",
    databaseURL: "https://profefranciscopancho-default-rtdb.firebaseio.com",
    projectId: "profefranciscopancho",
    storageBucket: "profefranciscopancho.firebasestorage.app",
    messagingSenderId: "585856906940",
    appId: "1:585856906940:web:3e48c7aef77e45e4f97f10",
    measurementId: "G-81H94PBDCJ"
};
```

---

### 3️⃣ Limpiar Caché del Navegador

1. Abrir DevTools (F12)
2. Click derecho en el botón de recargar
3. Seleccionar "Vaciar caché y recargar de manera forzada"

O usar: `Ctrl + Shift + Delete` → Limpiar caché y cookies

---

### 4️⃣ Alternativa: Reglas de Desarrollo Temporal

Si necesitas una solución rápida **SOLO PARA DESARROLLO** (NO PRODUCCIÓN):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **ADVERTENCIA:** Estas reglas abren la base de datos completamente. Úsalas SOLO temporalmente para debugging.

---

## 🔍 Verificación

Después de aplicar las reglas, verifica en la consola del navegador (F12):

1. ✅ No debe aparecer el error `permission_denied`
2. ✅ Debe mostrar: `Firebase initialized successfully`
3. ✅ El login debe funcionar correctamente

---

## 📝 Notas Adicionales

### Warnings a Ignorar (No críticos)

1. **Tailwind CDN Warning:**
   ```
   cdn.tailwindcss.com should not be used in production
   ```
   - Esto es un warning, no afecta la funcionalidad
   - Para producción, considera usar Tailwind CLI (ya configurado en tu proyecto)

2. **Autocomplete Warning:**
   ```
   Input elements should have autocomplete attributes
   ```
   - Mejora de accesibilidad, no afecta funcionalidad
   - Se puede agregar `autocomplete="current-password"` al input de contraseña

---

## 🚀 Próximos Pasos

Si el problema persiste después de aplicar las reglas:

1. **Verificar que la base de datos existe:**
   - Ve a Firebase Console → Realtime Database
   - Debe mostrar la estructura de datos (users, logs, etc.)

2. **Verificar la URL de la base de datos:**
   - En `firebaseConfig.databaseURL`
   - Debe terminar en `.firebaseio.com`

3. **Crear usuario de prueba manualmente:**
   - Ve a Realtime Database en Firebase Console
   - Agrega manualmente un nodo `users/test` con:
     ```json
     {
       "username": "test",
       "password": "dGVzdDEyMw==",
       "active": true,
       "role": "user"
     }
     ```
   - Intenta login con: username=`test`, password=`test123`

---

## ✨ Resultado Esperado

Después de aplicar estas soluciones:
- ✅ Login funciona correctamente
- ✅ No hay errores de permisos en consola
- ✅ Los usuarios pueden acceder a las evaluaciones
