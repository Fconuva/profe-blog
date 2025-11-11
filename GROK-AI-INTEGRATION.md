# Integración Grok AI en Dossier Educación Física Básica

## 📋 Resumen

Se ha integrado un **Asistente IA con Grok** al final del dossier de Educación Física Básica ECEP 2025, permitiendo a los docentes hacer consultas interactivas sobre el temario.

## 🎯 Funcionalidades

### Asistente IA Interactivo
- **Ubicación**: Final del dossier, antes del footer
- **Modelo**: Llama 3.1 8B Instant (vía Groq API)
- **Contexto**: 250 palabras máximo, enfoque pedagógico chileno

### Características:
1. **Input de consulta libre** con búsqueda en tiempo real
2. **5 preguntas rápidas predefinidas**:
   - Fuerza en 3° Básico
   - Enseñanza de Cueca paso a paso
   - Creación de rúbricas analíticas
   - Aplicación de DUA en EF
   - Diferencias entre evaluación formativa/sumativa

3. **Sistema Prompt especializado** que incluye:
   - Contexto completo de los 3 dominios
   - Contenidos específicos del dossier (tabla FC, ejercicios, danzas, planificaciones, rúbricas)
   - Instrucciones pedagógicas contextualizadas a Chile
   - Desarrollo motor por ciclos (1°-2°, 3°-4°, 5°-6°)

## 🔧 Configuración Técnica

### API Endpoint
- **Archivo**: `/api/groq-chat.js` (ya existente)
- **Método**: POST
- **Parámetros**:
  ```json
  {
    "systemPrompt": "Contexto pedagógico...",
    "pregunta": "Consulta del docente"
  }
  ```

### Variables de Entorno Requeridas

**⚠️ IMPORTANTE: Configurar en Vercel Dashboard**

1. Ir a: https://vercel.com/fconuvas-projects/profe-blog/settings/environment-variables
2. Agregar variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: `gsk_...` (tu API key de Groq)
   - **Environments**: Production, Preview, Development

### Obtener API Key de Groq
1. Crear cuenta en: https://console.groq.com/
2. Ir a: https://console.groq.com/keys
3. Generar nueva API key
4. Copiar y pegar en Vercel Environment Variables

## 📱 Interfaz de Usuario

### Diseño Visual
- **Gradiente**: Purple (#667eea) → Violet (#764ba2)
- **Icono**: Robot (Bootstrap Icons)
- **Componentes**:
  - Input grande con placeholder descriptivo
  - Botón "Consultar" (amarillo warning)
  - Área de respuesta con card blanco
  - Spinner de carga
  - Alertas de error

### Estados de la UI
1. **Inicial**: Input vacío + 5 botones de consulta rápida
2. **Cargando**: Spinner + mensaje "Consultando a Grok AI..."
3. **Respuesta**: Card expandible con texto de la IA
4. **Error**: Alert rojo con mensaje de error (auto-oculta en 5s)

## 🧪 Testing

### Pruebas Locales
```bash
# 1. Configurar variable de entorno local
$env:GROQ_API_KEY = "gsk_tu_clave_aqui"

# 2. Ejecutar servidor local
npm run dev

# 3. Navegar a:
http://localhost:8080/evaluaciones/educacion-basica/estudio/educacion-fisica-basica/

# 4. Probar consultas en el asistente IA
```

### Casos de Prueba
- ✅ Consulta sobre FITT → Debe responder con contexto pedagógico
- ✅ Pregunta sobre danzas chilenas → Debe referenciar Cueca/Sau-sau/Trote
- ✅ Consulta sobre Mosston → Debe explicar estilos C/E con ejemplos
- ✅ API key inválida → Debe mostrar error amigable
- ✅ Sin conexión → Debe mostrar mensaje de error

## 📦 Archivos Modificados

### 1. Dossier Principal
**Archivo**: `evaluaciones/educacion-basica/estudio/educacion-fisica-basica.njk`

**Cambios**:
- ✅ Sección HTML del asistente IA (líneas ~3370-3440)
- ✅ JavaScript para manejo de consultas (líneas ~3450-3550)
- ✅ System prompt especializado con contexto completo
- ✅ 5 funciones JS: `consultarGrok()`, `setPreguntaRapida()`, `limpiarConsulta()`, `mostrarError()`

### 2. API Existente (sin cambios)
**Archivo**: `api/groq-chat.js`
- Ya existente y funcional
- Maneja CORS, validación, llamadas a Groq API
- Modelo: llama-3.1-8b-instant
- Temperature: 0.7, Max tokens: 500

## 🚀 Deployment

### Checklist Pre-Deploy
- [x] Código agregado al dossier
- [x] JavaScript validado sin errores
- [ ] **GROQ_API_KEY configurada en Vercel** ⚠️
- [ ] Commit y push a GitHub
- [ ] Verificar deployment exitoso en Vercel
- [ ] Probar funcionalidad en producción

### Comandos de Deploy
```powershell
# 1. Verificar cambios
git status

# 2. Agregar archivos
git add evaluaciones/educacion-basica/estudio/educacion-fisica-basica.njk
git add GROK-AI-INTEGRATION.md

# 3. Commit
git commit -m "feat: Integrar asistente IA Grok en dossier EF Básica ECEP 2025

- Agregar sección interactiva con consultas IA al final del dossier
- System prompt especializado con contexto de 3 dominios
- 5 preguntas rápidas predefinidas para docentes
- UI con gradiente purple/violet, spinner de carga, manejo errores
- Usa API /api/groq-chat existente (requiere GROQ_API_KEY en Vercel)"

# 4. Push
git push origin main
```

### Post-Deploy
1. ✅ Esperar build de Vercel (~2-3 min)
2. ✅ Verificar en: https://profefranciscopancho.vercel.app/evaluaciones/educacion-basica/estudio/educacion-fisica-basica/
3. ✅ Probar asistente IA con consulta real
4. ✅ Verificar respuestas contextualizadas

## 🎓 Ejemplo de Uso

**Docente escribe**: "¿Cómo aplico el principio FITT en 4° básico?"

**Grok responde** (ejemplo):
```
Para aplicar el principio FITT en 4° Básico, adapta cada variable al desarrollo motor de esta edad:

• FRECUENCIA: 3 sesiones semanales de 60 min (según OMS para 6-12 años)
• INTENSIDAD: Zona aeróbica moderada 60-70% FCmáx (220-10=210, zona 126-147 lat/min)
• TIEMPO: 20-30 minutos de actividad continua por sesión
• TIPO: Juegos de desplazamiento (pilla-pilla, relevos), circuitos con estaciones variadas

EJEMPLO PRÁCTICO 4° BÁSICO:
- Inicio: Movilidad articular guiada (5 min)
- Desarrollo: Circuito 5 estaciones × 3 min c/u (saltos cuerda, abdominales, carrera zig-zag, lanzamientos, cuadrupedia)
- Cierre: Juego cooperativo + estiramiento (10 min)

Recuerda del dossier: a esta edad prima la multilateralidad (variedad de estímulos) sobre la especialización.
```

## 📊 Métricas de Éxito

- **Engagement**: Tiempo promedio en página aumenta por interacción IA
- **Utilidad**: Docentes obtienen respuestas contextualizadas inmediatas
- **Retención**: Mayor probabilidad de completar todo el dossier
- **Diferenciación**: Valor agregado vs dossiers estáticos

## 🔒 Seguridad

### Consideraciones
- ✅ API key almacenada en variables de entorno (no en código)
- ✅ Rate limiting manejado por Groq API
- ✅ CORS configurado correctamente
- ✅ Validación de inputs antes de enviar a API
- ✅ Manejo de errores sin exponer detalles técnicos

### Límites de Groq Free Tier
- **Requests**: 30 req/min
- **Tokens**: 14,400 tokens/min
- **Modelo**: llama-3.1-8b-instant incluido

## 📝 Notas Adicionales

- El asistente NO reemplaza el contenido del dossier, lo complementa
- Las respuestas son generativas, pueden variar entre consultas
- Se recomienda contrastar respuestas con el contenido oficial del dossier
- Para preguntas muy específicas de normativa MINEDUC, derivar a fuentes oficiales

---

**Última actualización**: 11 noviembre 2025  
**Autor**: Profe Francisco Pancho  
**Versión**: 1.0
