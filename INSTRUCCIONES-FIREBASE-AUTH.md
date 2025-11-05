# 🔐 INSTRUCCIONES: CREAR USUARIOS EN FIREBASE AUTH

## ⚠️ IMPORTANTE
Las contraseñas YA NO están en el código. Ahora se usa Firebase Authentication.

## 📋 Usuarios que necesitas crear en Firebase

| Usuario | Email | Rol | Nombre Completo |
|---------|-------|-----|-----------------|
| fconuva | fconuva@profe.cl | admin | Francisco (Administrador) |
| alicia | alicia@profe.cl | teacher | Alicia (Profesora) |
| joselin | joselin@profe.cl | teacher | Joselin (Profesora) |
| pia | pia@profe.cl | teacher | Pia (Profesora) |

## 🔧 Pasos para crear usuarios en Firebase Console

### 1. Ir a Firebase Console
1. Abre https://console.firebase.google.com/
2. Selecciona tu proyecto: **profe-blog**
3. En el menú lateral, ve a **Authentication**
4. Click en la pestaña **Users**

### 2. Habilitar Email/Password Authentication
1. Click en la pestaña **Sign-in method**
2. Encuentra **Email/Password**
3. Click en el ícono de editar (lápiz)
4. **Habilita** Email/Password
5. **NO habilites** el link de email (a menos que quieras verificación por email)
6. Click **Save**

### 3. Crear cada usuario
Para cada usuario de la tabla:

1. Click en **Add user** (botón azul)
2. Ingresa el **Email** (ej: `fconuva@profe.cl`)
3. Ingresa la **contraseña** (usa las contraseñas que ya tenías)
4. Click **Add user**

Repite para los 4 usuarios.

## 📝 CONTRASEÑAS A USAR

**Importante:** Usa las mismas contraseñas que tenías antes:

- **fconuva@profe.cl**: `xixo97879375`
- **alicia@profe.cl**: `buenapalsorbo`
- **joselin@profe.cl**: `soymañosa`
- **pia@profe.cl**: `metaimo`

## ✅ Verificar que funciona

1. Ve a: https://www.profefranciscopancho.com/privado/
2. Intenta hacer login con:
   - Usuario: `fconuva` (o `fconuva@profe.cl`)
   - Contraseña: `xixo97879375`

Si funciona, verás el dashboard.

## 🔐 Seguridad mejorada

**Ventajas del nuevo sistema:**

✅ Las contraseñas YA NO están en el código del navegador
✅ Firebase maneja la autenticación de forma segura
✅ Se registran los intentos de login en Firebase Database
✅ Se rastrea desde qué dispositivo se accede
✅ Protección contra ataques de fuerza bruta
✅ Todos los archivos privados están protegidos con Auth Guard
✅ Links directos redirigen al login si no estás autenticado

## 🆘 Troubleshooting

### Error: "Usuario o contraseña incorrectos"
- Verifica que creaste el usuario en Firebase Console
- Verifica que el email sea correcto (ej: `fconuva@profe.cl`)
- Verifica la contraseña

### Error: "auth/user-not-found"
- El usuario no existe en Firebase Auth
- Créalo siguiendo los pasos arriba

### Error: "auth/too-many-requests"
- Demasiados intentos fallidos
- Espera unos minutos o resetea la contraseña en Firebase Console

## 🔄 Migración completada

**Antes:**
```javascript
const USERS = {
    'fconuva': { password: 'xixo97879375', ... }  // ❌ Contraseña visible
}
```

**Ahora:**
```javascript
const USER_METADATA = {
    'fconuva@profe.cl': { role: 'admin', ... }  // ✅ Sin contraseñas
}
// Autenticación manejada por Firebase Auth
```

## 📊 Monitoreo

Puedes ver los logins en Firebase Console:
1. **Authentication > Users**: Ver usuarios activos
2. **Realtime Database > admin/login_history**: Ver historial de accesos

---

**Fecha de migración:** Noviembre 5, 2025
**Sistema:** Firebase Authentication v9.22.0
