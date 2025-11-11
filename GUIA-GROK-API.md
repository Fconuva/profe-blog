# 🔑 CÓMO USAR GROK API PARA GENERAR IMÁGENES

## 📋 Pasos para obtener API Key de Grok (xAI)

### 1. Acceder a la consola de xAI
- Ve a: https://console.x.ai/
- Inicia sesión con tu cuenta de X (Twitter)

### 2. Obtener API Key
- En el dashboard, busca "API Keys" o "Claves API"
- Haz clic en "Create new key" o "Crear nueva clave"
- Copia la API key (empezará con `xai-` generalmente)
- ⚠️ **IMPORTANTE:** Guarda la key en lugar seguro, solo se muestra una vez

### 3. Configurar en tu sistema

#### Opción A: Variable de entorno (PowerShell) - TEMPORAL
```powershell
$env:GROK_API_KEY="xai-tu-api-key-aqui"
```
Esta configuración dura solo mientras la terminal esté abierta.

#### Opción B: Variable de entorno permanente (Windows)
```powershell
# Agregar permanentemente
[System.Environment]::SetEnvironmentVariable('GROK_API_KEY', 'xai-tu-api-key-aqui', 'User')

# Reiniciar PowerShell y verificar
$env:GROK_API_KEY
```

#### Opción C: Archivo .env (RECOMENDADO)
Crea archivo `.env` en la raíz del proyecto:
```
GROK_API_KEY=xai-tu-api-key-aqui
```

Instala python-dotenv:
```bash
pip install python-dotenv
```

## 🚀 Uso del script

### 1. Instalar dependencias
```bash
pip install requests pillow python-dotenv
```

### 2. Ejecutar generador
```bash
python generar-imagen-grok.py
```

### 3. El script automáticamente:
- ✅ Genera la imagen con Grok AI
- ✅ Descarga la imagen
- ✅ Guarda en `evaluaciones/.../imagenes/dorian-gray-retrato-deteriorado.jpg`
- ✅ Verifica el tamaño
- ✅ Te dice los próximos pasos

## 📊 Precios de Grok API (aprox.)

**Generación de imágenes:**
- 1024x1024 HD: ~$0.04 por imagen
- 512x512: ~$0.02 por imagen
- 256x256: ~$0.015 por imagen

**Para este proyecto:** Solo necesitas 1 imagen = ~$0.04 USD

## 🔧 Solución de Problemas

### Error: "No se encontró GROK_API_KEY"
```bash
# Verificar que está configurada
echo $env:GROK_API_KEY

# Si no aparece, configurar de nuevo
$env:GROK_API_KEY="xai-tu-api-key-aqui"
```

### Error: "401 Unauthorized"
- Verifica que la API key sea correcta
- Asegúrate de que empiece con el prefijo correcto (ej: `xai-`)
- Verifica que no haya espacios extras

### Error: "Rate limit exceeded"
- Espera unos minutos
- Grok tiene límites de requests por minuto

### Error: "Insufficient credits"
- Verifica tu saldo en https://console.x.ai/
- Recarga créditos si es necesario

## 🎯 Alternativa: Generación Manual

Si prefieres NO usar la API o no tienes créditos:

1. Ve a https://grok.x.ai/
2. Pega el prompt de `PROMPT-RAPIDO-DORIAN.md`
3. Descarga la imagen manualmente
4. Guarda como `dorian-gray-retrato-deteriorado.jpg`
5. Ejecuta `python implementar-imagenes-ia.py`

## 📝 Workflow completo

```bash
# 1. Configurar API key
$env:GROK_API_KEY="xai-tu-api-key-aqui"

# 2. Generar imagen
python generar-imagen-grok.py

# 3. Implementar en código
python implementar-imagenes-ia.py

# 4. Validar sintaxis
python validar-sintaxis-js.py evaluaciones/educacion-media/pruebas/lengua-literatura-media/index.njk

# 5. Deploy
git add .
git commit -m "feat: AGREGAR imagen Dorian Gray generada con Grok AI"
git push origin main
```

## 🔒 Seguridad

⚠️ **NUNCA** subas tu API key al repositorio Git

Asegúrate de que `.env` esté en `.gitignore`:
```bash
# Verificar
cat .gitignore | Select-String ".env"

# Si no está, agregar
echo ".env" >> .gitignore
```

---

**Nota:** Si Grok API aún no tiene endpoint de imágenes público, usa la interfaz web de Grok en https://grok.x.ai/ y descarga manualmente.
