#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar imagen de Dorian Gray usando Grok API (xAI)
Requiere: pip install requests pillow
"""

import os
import sys
import requests
from datetime import datetime

# Configuración
GROK_API_KEY = os.getenv("GROK_API_KEY", "")  # Configurar como variable de entorno
GROK_API_URL = "https://api.x.ai/v1/images/generations"  # URL API de Grok

# Configuración de salida
OUTPUT_DIR = "evaluaciones/educacion-media/pruebas/lengua-literatura-media/imagenes"
OUTPUT_FILE = "dorian-gray-retrato-deteriorado.jpg"

# Prompt optimizado para Grok
PROMPT = """Create a dark Gothic oil painting portrait of a Victorian-era aristocratic man showing severe deterioration and aging.

SUBJECT:
- Aristocratic man from the 1890s
- Gaunt, haunted face with deep wrinkles
- Sunken eyes with dark circles
- Expression of moral suffering and decay
- Pale, sickly complexion

PAINTING DETERIORATION:
- Visible cracks in the paint surface
- Darkened, aged varnish
- Water stains and discoloration
- Peeling paint in corners
- Canvas tears or damage
- Oxidized, browning colors

COMPOSITION:
- Dark Victorian background
- Ornate golden frame partially visible at edges
- Dramatic chiaroscuro lighting with strong shadows
- Oil painting texture clearly visible
- 19th century British portrait style

ATMOSPHERE:
- Gothic, ominous mood
- Dim, theatrical lighting from one side
- Dark color palette (browns, blacks, deep greens)
- Sense of moral corruption and time's passage

STYLE:
Realistic classical oil painting in the style of John Singer Sargent meets Rembrandt, with visible deterioration like an abandoned museum piece.

DO NOT include: text, signatures, modern elements, bright colors, smiling faces"""

def generar_imagen_grok():
    """
    Genera imagen usando Grok API
    """
    print("=" * 70)
    print("🎨 GENERADOR DE IMÁGENES CON GROK API")
    print("=" * 70)
    print()
    
    # Verificar API key
    if not GROK_API_KEY:
        print("❌ ERROR: No se encontró GROK_API_KEY")
        print()
        print("📋 Para configurar:")
        print("1. Obtén tu API key de https://console.x.ai/")
        print("2. En PowerShell, ejecuta:")
        print('   $env:GROK_API_KEY="tu-api-key-aqui"')
        print()
        print("3. O crea archivo .env con:")
        print('   GROK_API_KEY=tu-api-key-aqui')
        print()
        return False
    
    print(f"✅ API Key encontrada: {GROK_API_KEY[:10]}...")
    print()
    
    # Crear directorio si no existe
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Preparar request
    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "grok-vision-beta",  # Modelo de generación de imágenes de Grok
        "prompt": PROMPT,
        "n": 1,  # Número de imágenes
        "size": "1024x1024",  # Tamaño (opciones: 256x256, 512x512, 1024x1024)
        "quality": "hd",  # Calidad alta
        "style": "vivid"  # Estilo vívido para más detalle
    }
    
    print("🔄 Generando imagen con Grok...")
    print(f"📊 Configuración:")
    print(f"   - Modelo: {payload['model']}")
    print(f"   - Tamaño: {payload['size']}")
    print(f"   - Calidad: {payload['quality']}")
    print()
    
    try:
        # Hacer request a Grok API
        response = requests.post(
            GROK_API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )
        
        response.raise_for_status()
        
        # Procesar respuesta
        data = response.json()
        
        if "data" in data and len(data["data"]) > 0:
            image_url = data["data"][0]["url"]
            print(f"✅ Imagen generada!")
            print(f"📍 URL temporal: {image_url}")
            print()
            
            # Descargar imagen
            print("⬇️  Descargando imagen...")
            img_response = requests.get(image_url, timeout=30)
            img_response.raise_for_status()
            
            # Guardar imagen
            output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
            with open(output_path, 'wb') as f:
                f.write(img_response.content)
            
            # Verificar tamaño
            tamaño_kb = os.path.getsize(output_path) / 1024
            print(f"✅ Imagen guardada: {output_path}")
            print(f"📊 Tamaño: {tamaño_kb:.1f} KB")
            print()
            
            # Optimizar si es muy grande
            if tamaño_kb > 500:
                print("⚠️  Imagen mayor a 500KB, considera optimizarla")
                print("   Puedes usar: https://tinypng.com/")
                print()
            
            print("=" * 70)
            print("✅ ¡IMAGEN GENERADA EXITOSAMENTE!")
            print("=" * 70)
            print()
            print("📝 Próximos pasos:")
            print("1. Ejecutar: python implementar-imagenes-ia.py")
            print("2. Validar: python validar-sintaxis-js.py evaluaciones/...")
            print("3. Deploy: git add . && git commit -m 'feat: imagen IA' && git push")
            print()
            
            return True
            
        else:
            print("❌ ERROR: No se recibió imagen en la respuesta")
            print(f"Respuesta: {data}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ ERROR en request a Grok API:")
        print(f"   {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Status: {e.response.status_code}")
            print(f"   Response: {e.response.text}")
        return False
    except Exception as e:
        print(f"❌ ERROR inesperado:")
        print(f"   {str(e)}")
        return False

if __name__ == "__main__":
    exito = generar_imagen_grok()
    sys.exit(0 if exito else 1)
