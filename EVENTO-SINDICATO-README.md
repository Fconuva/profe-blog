# 🎉 Evento Aniversario - Sindicato N°1 Salesianos Talca

## 📍 Información del Evento

**Fecha**: Jueves 14 de Noviembre, 2025  
**Lugar**: Centro de Eventos Altos de Colín  
**Organizador**: Sindicato N°1 de Trabajadores del Centro Educativo Salesianos Talca

---

## 🔗 Acceso al Formulario

**URL**: https://www.profefranciscopancho.com/privado/evento-sindicato

> ⚠️ **IMPORTANTE**: Esta es una página temporal que estará activa solo durante el período de inscripción.

---

## 📋 Características del Formulario

### ✅ Funcionalidades Implementadas

1. **Página de Bienvenida Elegante**
   - Diseño premium con gradientes y animaciones
   - Información completa del evento
   - Menú detallado con todas las opciones

2. **Sistema de Inscripción**
   - Confirmación de asistencia (Sí/No)
   - Formulario dinámico que aparece solo si confirma asistencia
   - Validación de RUT chileno automática
   - Selección de preferencias de menú:
     - Entrada (3 opciones)
     - Plato de fondo (2 opciones)
     - Guarnición (3 opciones)

3. **Campos del Formulario**
   - ✅ Nombre completo
   - ✅ RUT (con formato y validación automática)
   - ✅ Correo electrónico
   - ✅ Sexo
   - ✅ Sede de trabajo
   - ✅ Preferencias de menú completas

4. **Base de Datos Firebase**
   - Almacenamiento automático en `/sindicato_evento_aniversario/asistentes/`
   - Registro de no asistentes en `/sindicato_evento_aniversario/no_asistentes/`
   - Analytics de visitas en `/sindicato_evento_aniversario/analytics/visitas/`

5. **UX/UI Premium**
   - Diseño responsive (móvil y desktop)
   - Animaciones suaves
   - Efecto confetti al registrarse
   - Loading spinner durante envío
   - Mensaje de éxito con confirmación
   - Validación en tiempo real

---

## 🎨 Diseño Visual

- **Colores**: Gradiente púrpura (#667eea) a morado (#764ba2)
- **Tipografías**: Playfair Display (títulos) + Poppins (cuerpo)
- **Framework**: Tailwind CSS
- **Iconos**: Font Awesome 6
- **Efectos**: Backdrop blur, sombras suaves, transiciones elegantes

---

## 📊 Estructura de Datos en Firebase

### Asistentes (Confirmados)
```json
{
  "sindicato_evento_aniversario": {
    "asistentes": {
      "-O1a2b3c4d5": {
        "asistira": true,
        "nombre": "Juan Pérez González",
        "rut": "12.345.678-9",
        "correo": "juan@ejemplo.com",
        "sexo": "Masculino",
        "sede": "Sede Central",
        "menu": {
          "entrada": "Timbal de Ave",
          "plato_fondo": "Lomo Vetado",
          "guarnicion": "Puré Campestre"
        },
        "fecha_registro": "2025-10-20T15:30:00.000Z",
        "timestamp": 1729436400000
      }
    }
  }
}
```

### No Asistentes
```json
{
  "no_asistentes": {
    "-O1x2y3z4w5": {
      "asistira": false,
      "fecha_registro": "2025-10-20T15:35:00.000Z",
      "timestamp": 1729436700000
    }
  }
}
```

---

## 🔧 Administración

### Ver Inscritos

1. Acceder a Firebase Console: https://console.firebase.google.com
2. Ir a **Realtime Database**
3. Navegar a: `sindicato_evento_aniversario/asistentes`

### Exportar Datos

Desde Firebase Console:
1. Click derecho en el nodo `asistentes`
2. Seleccionar "Export JSON"
3. Guardar archivo para procesamiento

### Análisis Rápido

**Total de confirmados**:
```javascript
Object.keys(data.asistentes).length
```

**Conteo por sede**:
```javascript
Object.values(data.asistentes).reduce((acc, curr) => {
  acc[curr.sede] = (acc[curr.sede] || 0) + 1;
  return acc;
}, {})
```

**Conteo de menús**:
```javascript
Object.values(data.asistentes).reduce((acc, curr) => {
  acc[curr.menu.entrada] = (acc[curr.menu.entrada] || 0) + 1;
  return acc;
}, {})
```

---

## 📱 Compatibilidad

- ✅ Chrome / Edge / Safari / Firefox (últimas versiones)
- ✅ Móviles iOS (iPhone/iPad)
- ✅ Móviles Android
- ✅ Tablets
- ✅ Desktop (responsive)

---

## 🚀 Próximos Pasos

1. **Compartir URL** con todos los trabajadores del sindicato
2. **Monitorear inscripciones** en Firebase
3. **Exportar lista final** una semana antes del evento
4. **Generar reportes** de:
   - Total de asistentes
   - Distribución por sede
   - Preferencias de menú (para coordinación con catering)
   - Lista de correos para envío de recordatorios

---

## 📧 Soporte

Para consultas sobre el formulario o problemas técnicos:
- **Email**: [correo del organizador]
- **Teléfono**: [número del organizador]

---

## 📝 Notas Importantes

- ⏰ **Plazo de inscripción**: [Definir fecha límite]
- 🔒 Los datos son confidenciales y solo para uso del evento
- ✉️ Se enviará confirmación por correo electrónico
- 📞 Para cambios posteriores, contactar al organizador

---

**Desarrollado para el Sindicato N°1 - Centro Educativo Salesianos Talca**  
*Octubre 2025*
