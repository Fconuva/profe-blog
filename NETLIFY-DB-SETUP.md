# 🗄️ Configuración de Netlify DB (PostgreSQL con Neon)

## ✅ Ventajas de usar Netlify DB

- ✨ **Sin configuración externa**: Todo está integrado en Netlify
- 🔒 **Seguro**: Las credenciales se manejan automáticamente
- 🚀 **Rápido**: Base de datos serverless de producción
- 💰 **Incluido**: Disponible en todos los planes de Netlify
- 🔄 **Auto-scaling**: Escala automáticamente según demanda

---

## 📋 Pasos para Configurar

### 1️⃣ Conectar tu Base de Datos Existente

Ya tienes una base de datos Netlify DB creada: **`dry-mountain-15016664`**

Las variables de entorno ya están configuradas:
- `NETLIFY_DATABASE_URL` (para conexión con pooling)
- `NETLIFY_DATABASE_URL_UNPOOLED` (para conexión directa)

### 2️⃣ Inicializar la Tabla

Tienes dos opciones:

#### Opción A: Automática (Recomendada)

Después del deploy, visita esta URL una vez:
```
https://tu-sitio.netlify.app/api/init-db
```

Esto creará automáticamente la tabla `paseo_docentes_reservas`.

#### Opción B: Manual

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio → **Extensions** → **Neon database**
3. Click en **"Open Neon Console"**
4. Ve a **"SQL Editor"**
5. Copia y pega el contenido de `database/init.sql`
6. Click en **"Run"**

### 3️⃣ Verificar que Todo Funciona

1. **Desplegar a Netlify:**
   ```bash
   git add .
   git commit -m "feat: Migrate from Firebase to Netlify DB"
   git push origin main
   ```

2. **Esperar el deploy** (1-2 minutos)

3. **Probar la página:**
   ```
   https://tu-sitio.netlify.app/paseo-docentes/
   ```

4. **Completar el formulario de prueba**

5. **Verificar en la base de datos:**
   - Ve a Neon Console → SQL Editor
   - Ejecuta: `SELECT * FROM paseo_docentes_reservas;`
   - Deberías ver tu registro de prueba

---

## 🏗️ Estructura de la Aplicación

### Frontend (HTML)
- `paseo-docentes.html` - Formulario interactivo

### Backend (Netlify Functions)
- `/api/reservations` - Obtiene todas las reservas de asientos
- `/api/create-reservation` - Crea una nueva reserva
- `/api/init-db` - Inicializa la base de datos (ejecutar una vez)

### Base de Datos
- Tabla: `paseo_docentes_reservas`
- Motor: PostgreSQL (Neon)
- Ubicación: Manejada por Netlify

---

## 📊 Esquema de la Base de Datos

```sql
CREATE TABLE paseo_docentes_reservas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  asistira VARCHAR(10) NOT NULL CHECK (asistira IN ('si', 'no')),
  transporte VARCHAR(10) CHECK (transporte IN ('bus', 'propio')),
  asiento INTEGER CHECK (asiento >= 1 AND asiento <= 46),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_seat_per_bus UNIQUE (asiento, transporte)
);
```

### Restricciones:
- ✅ **Asientos únicos**: No se puede reservar el mismo asiento dos veces
- ✅ **Validación de datos**: asistira solo acepta 'si' o 'no'
- ✅ **Rango de asientos**: Solo 1-46
- ✅ **Email indexado**: Búsquedas rápidas

---

## 🔍 Consultas Útiles

### Ver todas las reservas:
```sql
SELECT * FROM paseo_docentes_reservas 
ORDER BY created_at DESC;
```

### Ver solo asientos del bus ocupados:
```sql
SELECT asiento, nombre, apellido 
FROM paseo_docentes_reservas 
WHERE transporte = 'bus' AND asiento IS NOT NULL
ORDER BY asiento;
```

### Contar inscripciones:
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN transporte = 'bus' THEN 1 ELSE 0 END) as en_bus,
  SUM(CASE WHEN transporte = 'propio' THEN 1 ELSE 0 END) as transporte_propio
FROM paseo_docentes_reservas
WHERE asistira = 'si';
```

### Ver asientos disponibles:
```sql
SELECT n as asiento_disponible
FROM generate_series(1, 46) as n
WHERE n NOT IN (
  SELECT asiento FROM paseo_docentes_reservas 
  WHERE transporte = 'bus' AND asiento IS NOT NULL
)
ORDER BY n;
```

---

## 🔧 Desarrollo Local

Para probar las funciones localmente:

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Ejecutar en modo desarrollo
netlify dev
```

Esto iniciará un servidor local en `http://localhost:8888` con las funciones disponibles.

---

## 🚀 Features Implementados

| Feature | Estado | Descripción |
|---------|--------|-------------|
| **Formulario Multi-Paso** | ✅ | 4 pasos: Datos → Asistencia → Transporte → Asientos |
| **Validación Frontend** | ✅ | Email, campos requeridos, formato |
| **Validación Backend** | ✅ | Validación en la función de Netlify |
| **Base de Datos** | ✅ | PostgreSQL con Netlify DB (Neon) |
| **Selección de Asientos** | ✅ | 46 asientos con actualización automática |
| **Auto-refresh** | ✅ | Actualiza asientos cada 10 segundos |
| **Prevención de Duplicados** | ✅ | Constraint en la BD evita asientos duplicados |
| **Responsive** | ✅ | Funciona en mobile, tablet, desktop |
| **Sin Servicios Externos** | ✅ | Solo GitHub + Netlify |

---

## 📈 Monitoreo

### Ver logs de las funciones:
1. Ve a tu sitio en Netlify
2. **Functions** en el menú lateral
3. Selecciona una función para ver logs y métricas

### Ver datos en tiempo real:
1. Netlify Dashboard → **Extensions** → **Neon database**
2. Click en **"Open Neon Console"**
3. Ve a **"SQL Editor"** para ejecutar consultas

---

## 🔒 Seguridad

### Implementado:
- ✅ CORS configurado correctamente
- ✅ Validación de campos requeridos
- ✅ Constraints en base de datos
- ✅ Variables de entorno para credenciales

### Mejoras Futuras (Opcional):
- 🔲 Rate limiting para prevenir spam
- 🔲 Validación de email único (sin duplicados)
- 🔲 reCAPTCHA para formulario
- 🔲 Confirmación por email
- 🔲 Panel de administración

---

## ❓ Troubleshooting

### Error: "Failed to fetch"
- Verifica que las funciones estén desplegadas correctamente
- Revisa los logs en Netlify Functions

### Error: "Database connection failed"
- Verifica que las variables de entorno estén configuradas
- Ve a Site settings → Environment variables

### Los asientos no se actualizan
- Verifica que la tabla esté creada (`/api/init-db`)
- Revisa la consola del navegador (F12) para errores

### Error: "This seat is already taken"
- Otro usuario reservó el asiento primero
- Intenta con otro asiento

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs de Netlify Functions**
2. **Revisar la consola del navegador (F12)**
3. **Verificar la base de datos en Neon Console**
4. **Revisar el código de las funciones en `/netlify/functions/`**

---

## 🎉 ¡Todo Listo!

Con esta configuración tienes:

✅ Base de datos PostgreSQL serverless  
✅ API REST con Netlify Functions  
✅ Frontend interactivo con actualización automática  
✅ Todo integrado en Netlify (sin servicios externos)  
✅ Listo para producción  

**Próximo paso:** Hacer push a GitHub y Netlify desplegará automáticamente 🚀
