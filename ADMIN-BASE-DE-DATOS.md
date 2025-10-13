# 🗄️ Administración de Base de Datos - Paseo Docentes

## 📊 Acceso al Panel de Administración

### **Neon Console (PostgreSQL)**
- **URL:** https://console.neon.tech
- **Proyecto:** `dry-mountain-15016664`
- **Base de Datos:** `neondb`
- **Tabla:** `paseo_docentes_reservas`

---

## 💻 Consultas SQL Útiles

### 📋 **Ver todos los registros**
```sql
SELECT * FROM paseo_docentes_reservas ORDER BY created_at DESC;
```

### 🚌 **Ver solo los que van en bus (con asiento)**
```sql
SELECT 
  asiento,
  nombre, 
  apellido, 
  email, 
  telefono,
  created_at as fecha_inscripcion
FROM paseo_docentes_reservas 
WHERE transporte = 'bus' 
ORDER BY asiento;
```

### 📥 **Descargar nómina completa (para exportar a Excel)**
```sql
SELECT 
  nombre, 
  apellido, 
  email, 
  telefono, 
  CASE 
    WHEN asistira = 'si' THEN 'Sí asiste'
    ELSE 'No asiste'
  END as asistencia,
  CASE 
    WHEN transporte = 'bus' THEN CONCAT('Bus - Asiento ', asiento)
    WHEN transporte = 'propio' THEN 'Transporte Propio'
    ELSE 'Sin definir'
  END as transporte,
  TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as fecha_inscripcion
FROM paseo_docentes_reservas 
WHERE asistira = 'si'
ORDER BY apellido, nombre;
```
**Después de ejecutar:** Click en "Download CSV" o "Export"

### 📊 **Estadísticas de inscripción**
```sql
SELECT 
  COUNT(*) as total_inscritos,
  COUNT(CASE WHEN transporte = 'bus' THEN 1 END) as viajan_en_bus,
  COUNT(CASE WHEN transporte = 'propio' THEN 1 END) as transporte_propio,
  COUNT(CASE WHEN asiento IS NOT NULL THEN 1 END) as asientos_ocupados,
  (46 - COUNT(CASE WHEN asiento IS NOT NULL THEN 1 END)) as asientos_disponibles
FROM paseo_docentes_reservas 
WHERE asistira = 'si';
```

### 🔍 **Buscar una persona específica**
```sql
SELECT * FROM paseo_docentes_reservas 
WHERE email = 'correo@ejemplo.com';
```

```sql
SELECT * FROM paseo_docentes_reservas 
WHERE nombre ILIKE '%francisco%' 
   OR apellido ILIKE '%pancho%';
```

---

## ✏️ Modificar Datos (Como Administrador)

### 🔄 **Cambiar el asiento de alguien**
```sql
UPDATE paseo_docentes_reservas 
SET asiento = 15 
WHERE email = 'correo@ejemplo.com';
```

### 📝 **Cambiar datos personales**
```sql
UPDATE paseo_docentes_reservas 
SET telefono = '+56912345678' 
WHERE email = 'correo@ejemplo.com';
```

### 🚗 **Cambiar de bus a transporte propio**
```sql
UPDATE paseo_docentes_reservas 
SET transporte = 'propio', asiento = NULL 
WHERE email = 'correo@ejemplo.com';
```

---

## 🗑️ Eliminar Datos

### ❌ **Borrar una inscripción específica**
```sql
DELETE FROM paseo_docentes_reservas 
WHERE email = 'correo@ejemplo.com';
```

### 🧹 **Borrar todas las personas que NO asisten**
```sql
DELETE FROM paseo_docentes_reservas 
WHERE asistira = 'no';
```

### ⚠️ **Borrar TODOS los registros (¡CUIDADO!)**
```sql
-- ¡ESTO BORRA TODO! Usar solo si estás seguro
DELETE FROM paseo_docentes_reservas;
```

### 🔄 **Borrar todo y reiniciar IDs**
```sql
TRUNCATE TABLE paseo_docentes_reservas RESTART IDENTITY;
```

---

## 📥 Exportar Datos

### **Método 1: Desde Neon Console**
1. Ve a SQL Editor en Neon Console
2. Ejecuta la consulta de nómina completa (arriba)
3. Click en **"Download CSV"** o **"Export"**
4. Abre el CSV con Excel

### **Método 2: Exportar con formato personalizado**
```sql
COPY (
  SELECT 
    nombre, 
    apellido, 
    email, 
    telefono, 
    CASE WHEN transporte = 'bus' THEN CONCAT('Asiento ', asiento) ELSE 'Transporte Propio' END as transporte
  FROM paseo_docentes_reservas 
  WHERE asistira = 'si'
  ORDER BY apellido, nombre
) TO STDOUT WITH CSV HEADER;
```

---

## 📊 Reportes Útiles

### **Lista de asistentes por orden alfabético**
```sql
SELECT 
  ROW_NUMBER() OVER (ORDER BY apellido, nombre) as "Nº",
  CONCAT(nombre, ' ', apellido) as "Nombre Completo",
  email as "Email",
  telefono as "Teléfono",
  CASE 
    WHEN transporte = 'bus' THEN CONCAT('Bus - Asiento ', asiento)
    ELSE 'Transporte Propio'
  END as "Transporte"
FROM paseo_docentes_reservas 
WHERE asistira = 'si'
ORDER BY apellido, nombre;
```

### **Lista de asientos ocupados en el bus**
```sql
SELECT 
  asiento as "Asiento",
  CONCAT(nombre, ' ', apellido) as "Ocupante",
  telefono as "Teléfono"
FROM paseo_docentes_reservas 
WHERE transporte = 'bus' AND asiento IS NOT NULL
ORDER BY asiento;
```

### **Últimas inscripciones (las 10 más recientes)**
```sql
SELECT 
  CONCAT(nombre, ' ', apellido) as "Nombre",
  email as "Email",
  CASE WHEN transporte = 'bus' THEN CONCAT('Asiento ', asiento) ELSE 'Transporte Propio' END as "Transporte",
  TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI:SS') as "Fecha Inscripción"
FROM paseo_docentes_reservas 
WHERE asistira = 'si'
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔐 Seguridad

- **No compartas** las credenciales de acceso a Neon Console
- Realiza **backups** antes de borrar datos masivamente
- Las consultas de modificación/eliminación **no se pueden deshacer**

---

## 📱 Contacto de Soporte

Si necesitas ayuda con la base de datos:
- WhatsApp: +569 88138929
- Revisa la documentación en: `NETLIFY-DB-SETUP.md`

---

## 🔗 Enlaces Útiles

- **Neon Console:** https://console.neon.tech
- **Formulario Web:** https://www.profefranciscopancho.com/paseo-docentes/
- **Documentación PostgreSQL:** https://www.postgresql.org/docs/

---

**Última actualización:** Octubre 2024
