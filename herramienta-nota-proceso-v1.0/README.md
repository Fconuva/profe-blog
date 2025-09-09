# 📊 Herramienta de Evaluación Docente PWA

Una aplicación web progresiva (PWA) completa para el registro y gestión de notas de proceso educativo, diseñada específicamente para educadores.

## 🚀 Características Principales

### ✨ Funcionalidades Core
- **Nota de Proceso**: Seguimiento continuo con múltiples tipos de calificación
- **Pauta de Cotejo**: Evaluaciones binarias personalizables
- **Gestión de Cursos**: Organización completa de estudiantes y evaluaciones
- **Exportación PDF**: Reportes profesionales listos para imprimir
- **Funcionamiento Offline**: Trabaja sin conexión a internet

### 📱 Características PWA
- **Instalable**: Se puede instalar como aplicación nativa
- **Responsive**: Funciona en móviles, tablets y escritorio
- **Offline First**: Datos guardados localmente con sincronización
- **Service Worker**: Cache inteligente para rendimiento óptimo
- **Notificaciones**: Recordatorios y actualizaciones (futuro)

## 🏗️ Arquitectura del Proyecto

```
herramienta-nota-proceso/
├── 📄 index.html              # Página principal PWA
├── 📄 manifest.json           # Configuración PWA
├── 📄 sw.js                   # Service Worker
├── 📁 css/
│   └── 📄 styles.css          # Estilos consolidados
├── 📁 js/
│   ├── 📄 app.js              # Aplicación principal
│   └── 📁 modules/
│       ├── 📄 storage.js      # Gestión de almacenamiento
│       └── 📄 grades.js       # Cálculos de calificaciones
├── 📁 icons/                  # Iconos de la aplicación
├── 📄 nota de proceso.html    # Herramienta de notas
├── 📄 pauta de cotejo.html    # Herramienta de pautas
├── 📄 pagina inicio.html      # Página original de inicio
├── 📄 README.md               # Este archivo
└── 📄 TODO.md                 # Lista de tareas
```

## 🛠️ Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (para desarrollo)

### Instalación Local

1. **Clonar o descargar** los archivos del proyecto
2. **Servir los archivos** desde un servidor web:
   ```bash
   # Opción 1: Python
   python -m http.server 8000
   
   # Opción 2: Node.js
   npx serve .
   
   # Opción 3: PHP
   php -S localhost:8000
   ```
3. **Abrir en navegador**: `http://localhost:8000`

### Instalación como PWA

1. Abrir la aplicación en el navegador
2. Buscar el ícono de "Instalar" en la barra de direcciones
3. Hacer clic en "Instalar aplicación"
4. La app aparecerá en el menú de aplicaciones del sistema

## 📚 Guía de Uso

### 🏠 Página Principal
- **Dashboard**: Resumen de cursos, estudiantes y evaluaciones
- **Navegación**: Acceso directo a las herramientas
- **Estado**: Indicador de conexión y sincronización
- **Gestión**: Exportar/importar datos, limpiar información

### 📝 Nota de Proceso
- **Cursos**: Crear y gestionar múltiples cursos
- **Estudiantes**: Añadir y organizar listas de estudiantes
- **Evaluaciones**: Tres tipos de calificación:
  - **Rúbrica**: 7.0, 5.0, 3.0, 1.0
  - **Logrado/No Logrado**: ✓ / ✗
  - **Nota Directa**: 1.0 - 7.0
- **Ponderación**: Sistema de notas ponderadas opcional
- **Estadísticas**: Análisis automático del rendimiento

### ✅ Pauta de Cotejo
- **Estructura Personalizable**: Fases e indicadores adaptables
- **Evaluación Binaria**: Logrado/No Logrado por indicador
- **Gestión de Estudiantes**: Lista organizada por número
- **Reportes**: Exportación detallada de resultados

## 🔧 Características Técnicas

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS
- **JavaScript ES6+**: Funcionalidad modular
- **Tailwind CSS**: Framework de utilidades
- **jsPDF**: Generación de reportes PDF
- **Service Workers**: Cache y funcionamiento offline
- **Web App Manifest**: Configuración PWA

### Almacenamiento de Datos
- **LocalStorage**: Persistencia local de datos
- **Backup Automático**: Respaldos periódicos
- **Exportación/Importación**: Formato JSON estándar
- **Validación**: Verificación de integridad de datos

### Rendimiento
- **Lazy Loading**: Carga bajo demanda
- **Cache Estratégico**: Recursos críticos en cache
- **Optimización**: Minificación y compresión
- **Responsive**: Adaptación automática a dispositivos

## 🎨 Personalización

### Temas y Colores
Los colores principales se pueden modificar en `css/styles.css`:
```css
:root {
  --primary-color: #4f46e5;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

### Escalas de Calificación
Las escalas se pueden personalizar en `js/modules/grades.js`:
```javascript
this.gradingScales = {
    rubrica: [7.0, 5.0, 3.0, 1.0],
    logrado: [7.0, 1.0],
    directa: { min: 1.0, max: 7.0 }
};
```

## 📊 Funcionalidades Avanzadas

### Estadísticas Automáticas
- Promedio general del curso
- Tasa de aprobación/reprobación
- Distribución de calificaciones
- Análisis de tendencias
- Recomendaciones pedagógicas

### Exportación de Datos
- **PDF**: Reportes formateados para impresión
- **JSON**: Backup completo de datos
- **Estadísticas**: Análisis detallado del rendimiento

### Gestión de Respaldos
- Backup automático cada hora
- Hasta 5 respaldos simultáneos
- Restauración selectiva de datos
- Exportación completa del sistema

## 🔒 Privacidad y Seguridad

- **Datos Locales**: Toda la información se guarda en el dispositivo
- **Sin Servidor**: No se envían datos a servidores externos
- **Encriptación**: Datos protegidos en el almacenamiento local
- **Control Total**: El usuario tiene control completo de sus datos

## 🐛 Solución de Problemas

### Problemas Comunes

**La aplicación no se instala:**
- Verificar que se esté sirviendo desde HTTPS o localhost
- Comprobar que el navegador soporte PWA
- Revisar la consola del navegador para errores

**Los datos no se guardan:**
- Verificar que el navegador permita LocalStorage
- Comprobar el espacio disponible en el dispositivo
- Revisar la configuración de privacidad del navegador

**La aplicación no funciona offline:**
- Verificar que el Service Worker esté registrado
- Comprobar que los recursos estén en cache
- Revisar la configuración de red del navegador

### Logs y Debugging
Abrir las herramientas de desarrollador (F12) y revisar:
- **Console**: Mensajes de error y debug
- **Application**: Estado del Service Worker y cache
- **Network**: Solicitudes de red y respuestas

## 🚀 Desarrollo Futuro

### Características Planificadas
- [ ] Sincronización en la nube
- [ ] Colaboración entre docentes
- [ ] Gráficos interactivos
- [ ] Notificaciones push
- [ ] Integración con sistemas escolares
- [ ] Modo oscuro
- [ ] Múltiples idiomas

### Contribuciones
Las contribuciones son bienvenidas. Para contribuir:
1. Fork del proyecto
2. Crear rama para la característica
3. Commit de los cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Créditos

Desarrollado con ❤️ para la comunidad educativa.

### Tecnologías de Terceros
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [jsPDF](https://github.com/parallax/jsPDF) - Generación de PDF
- [Inter Font](https://rsms.me/inter/) - Tipografía

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en el repositorio
- Revisar la documentación
- Consultar la sección de solución de problemas

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2024  
**Compatibilidad**: Navegadores modernos con soporte PWA
