# 🚀 INICIO RÁPIDO - Gemini AI

## Tu API Key está lista:
```
AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984
```

## ⚡ PRUEBA RÁPIDA (3 pasos)

### 1️⃣ Abre la Consola del Navegador
- Ve a tu sitio: http://localhost:8080/privado/registro-notas.html (o tu URL de Netlify)
- Presiona **F12** (o clic derecho → Inspeccionar)
- Ve a la pestaña **"Console"**

### 2️⃣ Copia y Pega este Código
```javascript
// Guardar API Key
localStorage.setItem('geminiApiKey', 'AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984');
console.log('✅ API Key configurada!');

// Probar conexión
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ parts: [{ text: 'Di "Hola profe, estoy lista para ayudarte"' }] }]
    })
}).then(r => r.json()).then(d => console.log('🤖 Gemini dice:', d.candidates[0].content.parts[0].text));
```

### 3️⃣ Usa la IA
1. Ve a **"Informes Individuales"**
2. Selecciona un estudiante
3. Clic en **"Banco de Retroalimentaciones"**
4. Desplázate abajo hasta ver el robot 🤖
5. Selecciona un enfoque (ej: "General")
6. Clic en **"Generar con IA (Gemini)"**
7. ¡Espera 5 segundos y listo! ✨

---

## 📋 GUÍA DE USO INTERFAZ

### Paso 1: Llegar al Generador de IA
```
Dashboard → Registro de Notas → Informes Individuales
    ↓
Seleccionar Estudiante
    ↓
Banco de Retroalimentaciones (botón morado 💡)
    ↓
Scroll abajo hasta "Generador con Inteligencia Artificial" (fondo celeste 🤖)
```

### Paso 2: Configurar API Key (solo primera vez)
```
┌─────────────────────────────────────────────────┐
│ 🔑 API Key de Gemini AI                        │
│ [AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984]     │
│                                [Guardar]        │
└─────────────────────────────────────────────────┘
```

### Paso 3: Seleccionar Enfoque
```
Enfoque de la retroalimentación:
[General ▼]  ← Selecciona uno de 5 enfoques
```

**Enfoques disponibles:**
- 🎯 **General**: Visión completa del desempeño
- 📚 **OAs**: Enfocado en objetivos curriculares
- 💪 **Motivacional**: Reconoce logros y potencial
- 🎓 **Estrategias**: Acciones concretas de mejora
- 📊 **Formativa**: Descriptiva y orientadora

### Paso 4: Generar
```
[✨ Generar con IA (Gemini)]  ← Haz clic aquí
```

### Paso 5: Esperar (3-5 segundos)
```
🔄 Generando retroalimentación con IA...
```

### Paso 6: ¡Listo!
La retroalimentación aparecerá automáticamente en el campo de texto. Puedes editarla si quieres.

---

## 🎯 EJEMPLOS DE QUÉ ESPERAR

### Estudiante Excelente (95%) - Enfoque "Motivacional"
```
María, tu desempeño ha sido sobresaliente con un 95% de tareas completadas.
Has logrado dominar los OA1, OA3 y OA7, demostrando análisis literario
profundo en "Guía 1" y "Ensayo Final". Tu capacidad crítica es excepcional.
Te desafío a liderar discusiones y explorar análisis intertextuales.
¡Felicitaciones por este logro destacado! 🌟
```

### Estudiante Suficiente (65%) - Enfoque "Estrategias"
```
Pedro, has alcanzado el mínimo con 65% completado. Para mejorar, te propongo:
1) Prioriza las tareas de OA1 y OA3 (análisis narrativo) que están pendientes.
2) Dedica 30 minutos diarios a lectura analítica con subrayado.
3) Asiste a tutorías para reforzar. Recuerda: constancia es clave.
¡Tú puedes lograrlo!
```

### Estudiante Muy Bueno (85%) - Enfoque "OAs"
```
Carolina, tu rendimiento es muy satisfactorio. Has logrado los OA1, OA2,
OA3 y OA10. En OA1, identificas conflictos y personajes correctamente
(evidencia: "Guía 1", "Taller"). Área por reforzar: OA11 (argumentación).
Las tareas pendientes "Ensayo de Opinión" requieren atención. Practica
la estructura: tesis, argumentos, contraargumentos. ¡Sigue adelante!
```

---

## ⚙️ CONFIGURACIÓN AVANZADA

### Verificar que la API Key está guardada:
```javascript
// En consola (F12):
console.log(localStorage.getItem('geminiApiKey'));
// Debería mostrar: AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984
```

### Borrar la API Key (si necesitas):
```javascript
localStorage.removeItem('geminiApiKey');
```

### Ver límites de uso:
- **60 solicitudes/minuto** = Puedes generar para 60 estudiantes seguidos
- **1,500 solicitudes/día** = Suficiente para todos tus cursos
- **Costo: $0** = Completamente gratis, sin tarjeta de crédito

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "API Key inválida"
**Solución:**
1. Verifica que copiaste completa: `AIzaSyDl3Gp320sAbpEeOPf217ryya-4E0QT984`
2. No debe tener espacios al inicio o final
3. Si persiste, genera una nueva en [Google AI Studio](https://makersuite.google.com/app/apikey)

### ❌ Error: "Límite excedido"
**Solución:**
- Espera 1 minuto (límite: 60/minuto)
- O espera más tarde si alcanzaste el límite diario (1,500/día)

### ❌ No aparece el botón de IA
**Solución:**
1. Verifica que estés en "Banco de Retroalimentaciones"
2. Desplázate hasta abajo (sección con fondo celeste)
3. Recarga la página (Ctrl+F5)

### ❌ La generación se queda en "cargando"
**Solución:**
1. Verifica tu conexión a internet
2. Abre consola (F12) y busca errores en rojo
3. Intenta nuevamente

---

## 💡 TIPS PRO

### 🎯 Para retroalimentaciones más específicas:
- **Asegúrate** de que las tareas tengan OAs asociados
- Mientras más OAs configures, mejor será el análisis de la IA

### 🚀 Para trabajar más rápido:
1. Genera con IA (5 segundos)
2. Lee rápidamente (10 segundos)
3. Edita solo lo necesario (15 segundos)
4. **Total: 30 segundos por estudiante** 🎉

### 🎨 Experimenta con enfoques:
- Prueba **"Motivacional"** para estudiantes desmotivados
- Usa **"OAs"** para informes oficiales UTP
- Aplica **"Estrategias"** para estudiantes con bajo rendimiento
- Selecciona **"Formativa"** para evaluaciones de proceso

### 🔄 Combina métodos:
1. Genera con IA (base personalizada)
2. Agrega fragmentos del banco de plantillas (complemento)
3. Añade observaciones personales (toque humano)
4. **= Retroalimentación perfecta** ✨

---

## 📊 COMPARACIÓN RÁPIDA

| Método | Tiempo | Personalización | Calidad | Cuándo Usar |
|--------|--------|----------------|---------|-------------|
| **Manual** | 5-10 min | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Casos muy específicos |
| **Plantillas** | 20 seg | ⭐⭐ | ⭐⭐⭐⭐ | Muchos estudiantes similares |
| **IA (Gemini)** | 5 seg | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Siempre** 🎯 |
| **IA + Edición** | 30 seg | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Máxima calidad |

**Recomendación:** Usa IA + edición rápida = **Mejor balance tiempo/calidad**

---

## 🎓 PRÓXIMOS PASOS

1. ✅ **Prueba ahora** con 2-3 estudiantes de diferentes niveles
2. ✅ **Compara** los resultados con plantillas
3. ✅ **Experimenta** con los 5 enfoques
4. ✅ **Ajusta** según tu estilo pedagógico
5. ✅ **Disfruta** del tiempo ahorrado ⏱️→☕

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles, consulta: **INTEGRACION-IA-README.md**

---

**¡Listo para revolucionar tus retroalimentaciones! 🚀✨**
