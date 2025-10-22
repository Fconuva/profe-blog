# Configuración Neon Database en Netlify

## 📋 Estado Actual (22 de octubre de 2025)

### ✅ Configuración Implementada

**Decisión:** Se removió el plugin de Netlify para Neon y se configuró como variable de entorno estándar.

### 🔧 Configuración en Netlify

La base de datos Neon se conecta mediante **variable de entorno** configurada en el dashboard de Netlify:

**Variable de Entorno:**
- **Nombre:** `DATABASE_URL`
- **Valor:** Connection string de Neon PostgreSQL
- **Ubicación:** Netlify Dashboard → Site Settings → Environment Variables
- **Scope:** Todas las funciones serverless (`netlify/functions/`)

### 📦 Dependencias en package.json

```json
"@neondatabase/serverless": "^0.9.5"
```

Este paquete permanece instalado y es utilizado por todas las funciones serverless.

### 🗄️ Funciones que Usan DATABASE_URL

**Funciones de Francisco (Principales):**
1. `get-courses-Francisco.js` - Obtener cursos del usuario
2. `save-courses-Francisco.js` - Guardar/actualizar cursos
3. `delete-course-Francisco.js` - Eliminar cursos
4. `check-updates-Francisco.js` - Verificar actualizaciones
5. `init-db-Francisco.js` - Inicializar estructura de base de datos

**Funciones de Reservas - Francisco:**
6. `reservations-Francisco.js` - Listar reservas
7. `create-reservation-Francisco.js` - Crear reserva
8. `check-reservation-Francisco.js` - Verificar disponibilidad
9. `delete-reservation-Francisco.js` - Eliminar reserva

**Funciones Genéricas (Backup):**
10. `get-courses.js`
11. `save-courses.js`
12. `delete-course.js`
13. `check-updates.js`
14. `init-db.js`
15. `reservations.js`
16. `create-reservation.js`
17. `check-reservation.js`
18. `delete-reservation.js`

**Total:** 18 funciones serverless

### 📝 Uso en las Funciones

Todas las funciones usan el siguiente patrón:

```javascript
const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const sql = neon(process.env.DATABASE_URL);
    // ... resto del código
};
```

### ❌ Plugin de Neon REMOVIDO

**Razón de la Remoción:**
El plugin oficial de Netlify para Neon causaba errores durante el deploy:

```
Error: UNKNOWN: unknown error, read
{ errno: -4094, code: 'UNKNOWN', syscall: 'read' }
During options.onPostBuild
```

**Solución Implementada:**
Se removió cualquier referencia al plugin en `netlify.toml` y se configuró `DATABASE_URL` como variable de entorno estándar en el dashboard de Netlify.

### 🚀 netlify.toml Actual

```toml
[build]
  command = "npm run build"
  publish = "_site"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  SECRETS_SCAN_SMART_DETECTION_ENABLED = "false"

[functions]
  node_bundler = "esbuild"

# NO hay plugins de Neon configurados
# DATABASE_URL se configura en Netlify Dashboard
```

### ✅ Ventajas de Esta Configuración

1. **Simplicidad:** Una sola variable de entorno
2. **Portabilidad:** Funciona en cualquier plataforma (Netlify, Vercel, etc.)
3. **Sin Conflictos:** No depende de plugins que puedan fallar
4. **Estándar:** Sigue el patrón común de configuración de bases de datos
5. **Seguridad:** La cadena de conexión nunca está en el código

### 🔐 Seguridad

- `DATABASE_URL` **NUNCA** debe estar en archivos `.env` commiteados
- Solo existe en Netlify Dashboard como variable de entorno
- Las funciones serverless acceden a ella mediante `process.env.DATABASE_URL`
- Los archivos `.env` están en `.gitignore`

### 📊 Estructura de Base de Datos

**Tablas Principales:**

1. **users**
   - `id` (SERIAL PRIMARY KEY)
   - `username` (VARCHAR(255) UNIQUE)
   - `created_at` (TIMESTAMP)

2. **courses**
   - `id` (BIGINT PRIMARY KEY)
   - `user_id` (INTEGER REFERENCES users)
   - `course_name` (TEXT)
   - `subject` (TEXT)
   - `period` (VARCHAR(50))
   - `students` (JSONB)
   - `tasks` (JSONB)
   - `config` (JSONB)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **reservations**
   - `id` (SERIAL PRIMARY KEY)
   - `event_date` (DATE)
   - `attendee_name` (VARCHAR(255))
   - `attendee_rut` (VARCHAR(20))
   - `contact_email` (VARCHAR(255))
   - `contact_phone` (VARCHAR(50))
   - `guests` (INTEGER)
   - `dietary_restrictions` (TEXT)
   - `created_at` (TIMESTAMP)

### 🔄 Deploy Automático

**Flujo Actual:**
1. Push a GitHub (rama `main`)
2. Netlify detecta cambio automáticamente
3. Ejecuta `npm run build`
4. Empaqueta funciones desde `netlify/functions/`
5. Inyecta `DATABASE_URL` en el entorno de las funciones
6. Despliega a producción

### 📌 Notas Importantes

- **NO** se necesita crear archivos `.env` localmente para deploy
- Las funciones solo funcionan en Netlify (no en desarrollo local sin `.env`)
- Para desarrollo local, crear `.env` con `DATABASE_URL=postgres://...`
- El archivo `.env` local **NUNCA** debe commitearse

### 🐛 Troubleshooting

**Error: "No database connection string was provided"**
- ✅ Solución: Verificar que `DATABASE_URL` esté configurada en Netlify Dashboard

**Error: "404 Not Found" en funciones**
- ✅ Solución: Verificar que el deploy se completó exitosamente sin errores

**Error de Git corrupto**
- ✅ Solución: Usar GitHub Desktop para commit/push en lugar de línea de comandos

---

## 📅 Historial de Cambios

**22 de octubre de 2025:**
- Removido plugin de Neon de netlify.toml
- Configurada `DATABASE_URL` como variable de entorno en Netlify Dashboard
- Documentada configuración completa
- Deploy funciona correctamente sin el plugin

**Estado:** ✅ OPERATIVO
**Última Verificación:** 22 de octubre de 2025
