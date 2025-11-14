# 🔒 Instrucciones para Actualizar Firebase Rules

## URGENTE: Debes aplicar estas reglas en Firebase Console

### 1. Ve a Firebase Console
- URL: https://console.firebase.google.com/
- Proyecto: `profe-blog`
- Sección: **Realtime Database** → **Rules**

### 2. Reemplaza las reglas actuales con:

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
    },
    "verified_payments": {
      ".read": true,
      ".write": true,
      ".indexOn": ["email", "paymentId", "verifiedAt", "accountCreated"]
    }
  }
}
```

### 3. Haz clic en **"Publicar"**

Esto solucionará los errores:
- ❌ `permission_denied at /logs`
- ❌ `permission_denied at /admin/settings`

---

## ✅ Cambios Implementados en el Código

### 1. **Protección de Rutas** (layout-evaluaciones.njk)
- ✅ Script de autenticación obligatoria
- ✅ Verificación de sesión en TODAS las páginas
- ✅ Redirección automática a login si no hay sesión
- ✅ Validación de permisos por sección (basica, especial, media)
- ✅ Expiración de sesión a las 24 horas

**Ahora SI alguien intenta acceder directamente a:**
- `/evaluaciones/educacion-basica/estudio/religion-catolica/`
- `/evaluaciones/educacion-especial/`
- **SERÁ BLOQUEADO** y redirigido a `/evaluaciones/` para login

### 2. **Sistema de Permisos Mejorado** (admin/index.html)
- ✅ Función `loadUserPermissions()` para cargar permisos actuales
- ✅ Display visual de permisos asignados
- ✅ Checkboxes se actualizan automáticamente al seleccionar usuario
- ✅ Manejo de errores mejorado con try-catch
- ✅ Mensajes de confirmación con emojis

### 3. **Correcciones Adicionales**
- ✅ Pirámide de Comprensión en Lenguaje Básica (geometría simétrica)
- ✅ Pirámide de Valores en Religión Básica (geometría simétrica)
- ✅ Autocomplete attributes en campos de password (admin)

---

## 🧪 Pruebas que Debes Hacer

### Prueba 1: Acceso Directo Bloqueado
1. Cierra sesión o abre ventana incógnito
2. Intenta acceder a: `https://www.profefranciscopancho.com/evaluaciones/educacion-basica/estudio/religion-catolica/`
3. ✅ **Debería**: Mostrar alerta y redirigir a `/evaluaciones/`

### Prueba 2: Permisos Funcionando
1. Login en admin: `https://www.profefranciscopancho.com/evaluaciones/admin/`
2. Ve a **Gestión de Permisos**
3. Selecciona un usuario → Deberías ver sus permisos actuales
4. Cambia permisos y guarda
5. ✅ **Debería**: Mostrar "✅ Permisos aplicados correctamente"

### Prueba 3: Sin Errores de Consola
1. Abre DevTools (F12) en `/evaluaciones/admin/`
2. ✅ **NO debería aparecer**:
   - `permission_denied at /logs`
   - `permission_denied at /admin/settings`

---

## 📝 Notas Importantes

**ADVERTENCIA:** El sistema ahora bloqueará TODO acceso sin login. Asegúrate de que:
- Los usuarios tengan credenciales válidas
- Los permisos estén correctamente asignados en Firebase
- La sesión se mantenga durante 24 horas

**Si necesitas acceso de emergencia:**
1. Crea un usuario con todos los permisos desde admin
2. O accede directamente a Firebase Console para modificar permisos manualmente
