# 📚 Gestión de Dossieres PDF - Panel Administrador

## 🎯 Ubicación

Accede al panel de administración:
```
https://www.profefranciscopancho.com/evaluaciones/admin/
```

Luego haz clic en la pestaña **"Dossieres PDF"** 📄

---

## ✨ Características

### ✅ Implementado

- **Nueva sección "Dossieres PDF"** en el panel de administración
- Diseño visual con tarjetas para cada dossier
- Íconos diferenciados por materia
- Estados: "Disponible" y "Próximamente"
- Descarga directa de PDFs disponibles
- Información detallada de contenidos por dossier

### 📋 Dossieres Disponibles

1. **Lengua y Literatura Media** ✅ DISPONIBLE
   - 6 dominios completos
   - Textos literarios y no literarios
   - Coherencia, cohesión y adecuación comunicativa
   - Enseñanza-aprendizaje
   - Casos de discurso público en Chile

2. **Próximamente**:
   - Matemática Media
   - Historia y Geografía
   - Ciencias Naturales
   - Educación Básica
   - PIE (Educación Especial)

---

## 📂 Estructura de Archivos

```
/
├── dossieres-pdf/                          # Carpeta con PDFs generados
│   └── DOSSIER_LENGUA_LITERATURA_MEDIA.pdf
│
├── DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html  # HTML fuente
│
├── generar-pdf-lengua-literatura.py       # Script Python generador
│
└── evaluaciones/
    └── admin/
        └── index.html                     # Panel admin (con sección Dossieres)
```

---

## 🛠️ Cómo Generar un Nuevo Dossier PDF

### Paso 1: Generar HTML con Python

```bash
python generar-pdf-lengua-literatura.py
```

Esto crea: `DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html`

### Paso 2: Convertir HTML a PDF

**Opción A: Navegador (Recomendado)**

1. Abre el archivo HTML en Chrome/Edge
2. Presiona `Ctrl + P` (o `Cmd + P` en Mac)
3. Configuración:
   - **Destino**: "Guardar como PDF"
   - **Márgenes**: Predeterminado
   - **Gráficos de fondo**: ✅ Activado
   - **Escala**: 100%
4. Guarda en: `dossieres-pdf/DOSSIER_LENGUA_LITERATURA_MEDIA.pdf`

**Opción B: wkhtmltopdf (Avanzado)**

```bash
# Instala wkhtmltopdf desde: https://wkhtmltopdf.org/downloads.html

# Ejecuta:
wkhtmltopdf --enable-local-file-access --page-size A4 DOSSIER_LENGUA_LITERATURA_MEDIA_COMPLETO.html dossieres-pdf/DOSSIER_LENGUA_LITERATURA_MEDIA.pdf
```

### Paso 3: Agregar al Panel Admin

Edita `evaluaciones/admin/index.html` en la sección `<section id="dossieres-section">`:

```html
<!-- Nuevo Dossier -->
<div class="card p-6 hover:shadow-xl transition-all">
    <div class="flex items-center justify-between mb-4">
        <div class="bg-purple-100 p-3 rounded-lg">
            <i class="fas fa-ICONO text-3xl text-purple-600"></i>
        </div>
        <span class="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            <i class="fas fa-check-circle mr-1"></i>Disponible
        </span>
    </div>
    
    <h3 class="text-xl font-bold text-gray-800 mb-2">
        TÍTULO DEL DOSSIER
    </h3>
    
    <p class="text-sm text-gray-600 mb-4">
        ECEP 2025 - NIVEL EDUCATIVO
    </p>
    
    <div class="space-y-2 mb-4 text-sm text-gray-700">
        <!-- Lista de contenidos -->
    </div>
    
    <div class="border-t pt-4 mt-4">
        <a href="/dossieres-pdf/NOMBRE_ARCHIVO.pdf" 
           download="ECEP_2025_NOMBRE_DESCARGABLE.pdf"
           class="btn-primary w-full text-center block">
            <i class="fas fa-download mr-2"></i>Descargar PDF
        </a>
    </div>
</div>
```

---

## 🔒 Seguridad

### Acceso Restringido

La sección de dossieres solo es accesible para:

- ✅ Usuarios autenticados en Firebase
- ✅ Con privilegios de administrador
- ✅ En la ruta `/evaluaciones/admin/`

### Protección en Producción

Para producción en Vercel/Netlify, configura reglas adicionales:

**Opción 1: Firebase Hosting Rules**

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/dossieres-pdf/**",
        "function": "checkAdminAuth"
      }
    ]
  }
}
```

**Opción 2: Vercel Protected Routes**

```json
// vercel.json
{
  "routes": [
    {
      "src": "/dossieres-pdf/(.*)",
      "dest": "/api/protected-download?file=$1",
      "check": true
    }
  ]
}
```

**Opción 3: Archivos .htaccess (Apache)**

```apache
# dossieres-pdf/.htaccess
AuthType Basic
AuthName "Área Restringida"
AuthUserFile /ruta/.htpasswd
Require valid-user
```

---

## 📊 Estadísticas de Dossieres

El panel admin muestra:

- Total de dossieres disponibles
- Tamaño de archivos
- Fecha de última actualización
- Contador de descargas (próximamente)

---

## 🎨 Personalización

### Cambiar Colores de Tarjetas

En `evaluaciones/admin/index.html`:

```css
/* Purple = Lengua */
.bg-purple-100 { background: #e9d5ff; }

/* Blue = Matemática */
.bg-blue-100 { background: #dbeafe; }

/* Red = Historia */
.bg-red-100 { background: #fee2e2; }
```

### Cambiar Íconos

Font Awesome icons disponibles:
- `fa-book-reader` - Lengua
- `fa-calculator` - Matemática
- `fa-globe-americas` - Historia
- `fa-flask` - Ciencias
- `fa-graduation-cap` - Básica
- `fa-universal-access` - PIE

---

## 🐛 Troubleshooting

### El PDF no se descarga

1. Verifica que el archivo existe en `dossieres-pdf/`
2. Comprueba la ruta en el atributo `href`
3. Verifica permisos de archivo (lectura pública)

### El PDF se ve mal

1. Asegúrate de activar "Gráficos de fondo" al imprimir
2. Usa escala 100%
3. Verifica que el CSS de impresión esté incluido en el HTML

### Error 404 en producción

1. Sube la carpeta `dossieres-pdf/` al repositorio
2. Verifica que esté en `.gitignore` si es privado
3. Considera usar Firebase Storage para archivos grandes

---

## 📝 Tareas Pendientes

- [ ] Implementar contador de descargas por PDF
- [ ] Agregar timestamps de última actualización
- [ ] Sistema de notificaciones cuando hay nuevos dossieres
- [ ] Compresión automática de PDFs grandes
- [ ] Vista previa de PDF en modal sin descargar
- [ ] Generación automática de PDFs desde GitHub Actions

---

## 📞 Soporte

Para problemas o sugerencias, revisa:

1. Los logs del navegador (`F12` → Console)
2. Firebase Console (autenticación)
3. Vercel logs (en producción)

---

**Última actualización**: Noviembre 27, 2025  
**Versión**: 1.0.0
