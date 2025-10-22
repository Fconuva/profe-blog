# 🔄 Migración de Neon PostgreSQL a Firebase Realtime Database

## 📋 Estado: EN PROGRESO

**Fecha de inicio:** 22 de octubre de 2025  
**Razón:** Consolidar toda la base de datos en Firebase, simplificar infraestructura y eliminar dependencias de Neon

---

## 🎯 Objetivos

1. ✅ **Preservar datos existentes** en Firebase (paseo_docentes, sindicato_evento_aniversario)
2. ✅ **Migrar datos de Neon** a Firebase sin pérdida de información
3. ✅ **Actualizar todas las funciones serverless** para usar Firebase
4. ✅ **Mantener compatibilidad** con el frontend existente
5. ✅ **Eliminar dependencias** de Neon y PostgreSQL

---

## 📦 Cambios Implementados

### 1. Nuevas Dependencias

```json
{
  "dependencies": {
    "firebase-admin": "^12.x.x"  // ← NUEVO
  }
}
```

### 2. Estructura de Firebase

```
firebase-database/
├── users/                          # ← NUEVO (migrado de Neon)
│   ├── {userId}/
│   │   ├── username
│   │   ├── createdAt
│   │   └── neonId (temporal, para migración)
│
├── courses/                        # ← NUEVO (migrado de Neon)
│   ├── {courseKey}/
│   │   ├── id
│   │   ├── userId
│   │   ├── courseName
│   │   ├── subject
│   │   ├── period
│   │   ├── students: []
│   │   ├── tasks: []
│   │   ├── config: {}
│   │   ├── createdAt
│   │   └── updatedAt
│
├── reservations/                   # ← NUEVO (migrado de Neon)
│   ├── {reservationKey}/
│   │   ├── eventDate
│   │   ├── attendeeName
│   │   ├── attendeeRut
│   │   ├── contactEmail
│   │   ├── contactPhone
│   │   ├── guests
│   │   ├── dietaryRestrictions
│   │   └── createdAt
│
├── paseo_docentes/                 # ← EXISTENTE (NO TOCAR)
│   └── ...
│
└── sindicato_evento_aniversario/   # ← EXISTENTE (NO TOCAR)
    └── ...
```

### 3. Funciones Serverless Actualizadas

**Nuevas funciones Firebase (sufijo `-firebase.js`):**

- ✅ `get-courses-Francisco-firebase.js`
- ✅ `save-courses-Francisco-firebase.js`
- ✅ `delete-course-Francisco-firebase.js`
- ✅ `check-updates-Francisco-firebase.js`

**Módulo compartido:**
- ✅ `firebase-config.js` - Configuración centralizada de Firebase Admin SDK

### 4. Reglas de Seguridad Firebase

Actualizadas en `firebase-rules.json`:

```json
{
  "rules": {
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
    }
  }
}
```

---

## 🔧 Variables de Entorno Requeridas

### Netlify Dashboard → Site Settings → Environment Variables

Agregar las siguientes variables:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=profe-blog
FIREBASE_PRIVATE_KEY_ID=xxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@profe-blog.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=xxxxx
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_DATABASE_URL=https://profe-blog-default-rtdb.firebaseio.com
```

### ¿Cómo obtener estas credenciales?

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "profe-blog"
3. **Project Settings** (⚙️) → **Service Accounts**
4. Click en **"Generate New Private Key"**
5. Se descargará un archivo JSON con todas las credenciales
6. Copia cada valor al formato de variables de entorno

**⚠️ IMPORTANTE:** 
- El `FIREBASE_PRIVATE_KEY` debe mantener los `\n` como `\\n` en Netlify
- Nunca commitees estas credenciales al repositorio

---

## 🚀 Pasos de Migración

### Paso 1: Preparación

```bash
# Instalar dependencias
npm install

# Verificar que firebase-admin esté instalado
npm list firebase-admin
```

### Paso 2: Configurar Variables de Entorno

1. Descarga el Service Account JSON desde Firebase Console
2. Configura las variables en Netlify Dashboard
3. Crea un archivo `.env` local para testing (NO COMMITEAR):

```bash
cp .env.firebase.example .env
# Edita .env con tus credenciales reales
```

### Paso 3: Ejecutar Migración

**⚠️ ADVERTENCIA:** Este paso migrará TODOS los datos de Neon a Firebase

```bash
# Ejecutar script de migración
node migrate-neon-to-firebase.js
```

El script:
- ✅ Migra usuarios de Neon a Firebase
- ✅ Migra cursos de Neon a Firebase
- ✅ Migra reservaciones de Neon a Firebase
- ✅ **NO TOCA** los datos existentes (paseo_docentes, sindicato_evento)
- ✅ Verifica que todo se migró correctamente

### Paso 4: Renombrar Funciones

Una vez verificada la migración:

```bash
# Eliminar funciones viejas de Neon
rm netlify/functions/get-courses-Francisco.js
rm netlify/functions/save-courses-Francisco.js
rm netlify/functions/delete-course-Francisco.js
rm netlify/functions/check-updates-Francisco.js

# Renombrar funciones Firebase (quitar sufijo -firebase)
mv netlify/functions/get-courses-Francisco-firebase.js netlify/functions/get-courses-Francisco.js
mv netlify/functions/save-courses-Francisco-firebase.js netlify/functions/save-courses-Francisco.js
mv netlify/functions/delete-course-Francisco-firebase.js netlify/functions/delete-course-Francisco.js
mv netlify/functions/check-updates-Francisco-firebase.js netlify/functions/check-updates-Francisco.js
```

### Paso 5: Deploy

```bash
# Commit de cambios
git add .
git commit -m "Migration: Neon → Firebase complete"
git push origin main

# Netlify desplegará automáticamente
```

### Paso 6: Verificación

1. Abre: https://www.profefranciscopancho.com/privado/registro-notas?docente=francisco
2. Verifica que se cargan los cursos correctamente
3. Intenta guardar cambios
4. Verifica en Firebase Console que los datos se actualizan

---

## ✅ Ventajas de Firebase

1. **Gratis hasta 10GB** de almacenamiento y 20GB/mes de descarga
2. **Realtime Sync** - Actualizaciones en tiempo real sin polling
3. **Sin servidor** - No necesitas gestionar base de datos
4. **Offline Support** - Los datos se pueden cachear localmente
5. **Escalabilidad** - Escala automáticamente según uso
6. **Simplicidad** - Una sola plataforma para todo

---

## 📊 Comparación

| Característica | Neon PostgreSQL | Firebase Realtime DB |
|---------------|-----------------|----------------------|
| Costo | Limitado gratis | 10GB gratis |
| Escalabilidad | Manual | Automática |
| Realtime | No nativo | Sí nativo |
| Offline | No | Sí |
| Complejidad | Alta (SQL) | Baja (JSON) |
| Integración | Via REST | SDK nativo |

---

## 🔐 Seguridad

### Reglas de Firebase

Las reglas actuales permiten lectura/escritura pública. **Para producción** considera:

```json
{
  "rules": {
    "courses": {
      ".read": "auth != null",
      ".write": "auth != null && data.child('userId').val() === auth.uid"
    }
  }
}
```

### Pasos para mejorar seguridad:

1. Implementar Firebase Authentication
2. Actualizar reglas para validar usuarios autenticados
3. Usar Security Rules para validar estructura de datos

---

## 🐛 Troubleshooting

### Error: "Firebase app already initialized"

**Solución:** El módulo `firebase-config.js` ya maneja esto. No inicialices Firebase en múltiples lugares.

### Error: "PERMISSION_DENIED"

**Solución:** Verifica las reglas en Firebase Console → Realtime Database → Rules

### Error: "Invalid credentials"

**Solución:** 
1. Verifica que `FIREBASE_PRIVATE_KEY` tenga los `\n` correctos
2. Regenera el Service Account Key si es necesario

### Los datos no aparecen

**Solución:**
1. Abre Firebase Console → Realtime Database
2. Verifica que los datos estén en la estructura correcta
3. Verifica las reglas de lectura

---

## 📝 Rollback (Si algo sale mal)

Si necesitas volver a Neon:

1. Las funciones viejas están respaldadas en `.git`
2. Restaura con: `git checkout HEAD~1 netlify/functions/`
3. Push: `git push origin main --force`
4. Netlify redesplegará las funciones de Neon

---

## 📅 Historial

**22 de octubre de 2025:**
- ✅ Instalado firebase-admin
- ✅ Creado firebase-config.js
- ✅ Creadas 4 funciones Firebase nuevas
- ✅ Actualizado firebase-rules.json
- ✅ Creado script de migración
- ⏳ Pendiente: Ejecutar migración
- ⏳ Pendiente: Renombrar funciones
- ⏳ Pendiente: Deploy a producción

---

## 🎯 Próximos Pasos

1. [ ] Obtener credenciales de Firebase Service Account
2. [ ] Configurar variables de entorno en Netlify
3. [ ] Ejecutar script de migración
4. [ ] Verificar datos en Firebase Console
5. [ ] Renombrar funciones (quitar sufijo -firebase)
6. [ ] Deploy a producción
7. [ ] Verificar funcionamiento en producción
8. [ ] Eliminar variables de entorno de Neon
9. [ ] Actualizar CONFIGURACION-NEON-NETLIFY.md → CONFIGURACION-FIREBASE-NETLIFY.md

**Estado actual:** ✅ LISTO PARA MIGRACIÓN
