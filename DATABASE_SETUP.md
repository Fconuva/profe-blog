# 🗄️ Configuración de Base de Datos con Neon

Este proyecto usa **Neon Database** (PostgreSQL serverless) para almacenar los cursos de forma persistente.

## 📋 Pasos para Configurar

### 1. Crear la Base de Datos en Neon

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Crea un nuevo proyecto o usa uno existente
3. Copia la **Connection String** que se ve así:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb
   ```

### 2. Configurar en Netlify

✅ **YA ESTÁ CONFIGURADO** - La variable `NETLIFY_DATABASE_URL` ya está creada automáticamente por Neon.

Si por alguna razón necesitas verificarla o cambiarla:
1. Ve a tu proyecto en Netlify: **Site settings** → **Environment variables**
2. Busca `NETLIFY_DATABASE_URL`
3. Debe tener el formato: `postgresql://user:password@ep-xxx.neon.tech/neondb`

### 3. Ejecutar el Script SQL

#### Opción A: Desde Neon Console
1. Ve a tu proyecto en Neon Console
2. Click en **SQL Editor**
3. Copia y pega todo el contenido de `database/schema.sql`
4. Click en **Run** para ejecutar

#### Opción B: Desde terminal local
```bash
# Instalar psql si no lo tienes
npm install -g postgres

# Conectar y ejecutar el script
psql "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb" < database/schema.sql
```

### 4. Verificar la Instalación

Ejecuta esta query en el SQL Editor de Neon:
```sql
SELECT * FROM users;
SELECT * FROM courses;
```

Deberías ver la tabla `users` con un usuario 'profesor' y la tabla `courses` vacía.

### 5. Migrar Datos Locales (Opcional)

Si ya tienes cursos en `localStorage`:

1. Abre `registro-notas.html` en tu navegador
2. Abre la **Consola del Navegador** (F12)
3. Ejecuta:
   ```javascript
   syncCoursesToDatabase()
   ```
4. Verás un mensaje: "✅ Cursos sincronizados"

## 🔄 Funcionamiento

### Sincronización Automática
- **Al cargar**: Los cursos se cargan desde la base de datos
- **Al guardar**: Se guarda en `localStorage` (inmediato) y se sincroniza a la DB (en segundo plano)
- **Sin conexión**: Funciona con `localStorage` como respaldo

### Endpoints de API

- `GET /api/courses?username=xxx` - Obtener todos los cursos
- `POST /api/courses/save` - Guardar/actualizar cursos
- `DELETE /api/courses/delete` - Eliminar un curso

## 📊 Estructura de Datos

### Tabla: `users`
```sql
id          | SERIAL PRIMARY KEY
username    | VARCHAR(100) UNIQUE
email       | VARCHAR(255)
created_at  | TIMESTAMP
```

### Tabla: `courses`
```sql
id          | BIGINT PRIMARY KEY
user_id     | INTEGER (FK → users)
course_name | VARCHAR(255)
subject     | VARCHAR(255)
period      | VARCHAR(100)
config      | JSONB (configuración del curso)
students    | JSONB (array de estudiantes)
tasks       | JSONB (array de tareas)
created_at  | TIMESTAMP
updated_at  | TIMESTAMP
```

## 🔐 Multi-usuario

Cada usuario identificado por su `username` tiene sus propios cursos aislados.

Para agregar más usuarios:
```sql
INSERT INTO users (username, email) 
VALUES ('nuevo_profesor', 'email@example.com');
```

## 🐛 Solución de Problemas

### Error: "No se pudieron cargar cursos de la DB"
- Verifica que `DATABASE_URL` esté configurada en Netlify
- Verifica que las tablas existan en Neon
- Revisa los logs de Netlify Functions

### Los cursos no se sincronizan
- Abre la consola del navegador (F12)
- Busca mensajes de error con ❌
- Verifica que estés en producción (no en local)

### Resetear datos
```sql
-- Cuidado: esto borra TODOS los cursos
DELETE FROM courses WHERE user_id = (SELECT id FROM users WHERE username = 'profesor');
```

## 📝 Notas

- La sincronización es **automática** cada vez que se modifica un curso
- Los datos locales (`localStorage`) sirven como respaldo sin conexión
- La base de datos es la **fuente de verdad** - siempre se carga primero desde ahí
