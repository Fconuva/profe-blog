#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para obtener las credenciales de Firebase desde la consola
y actualizar el archivo .env automáticamente
"""

print("""
╔═══════════════════════════════════════════════════════════════╗
║     OBTENER CREDENCIALES DE FIREBASE SERVICE ACCOUNT          ║
╚═══════════════════════════════════════════════════════════════╝

INSTRUCCIONES:

1. Abrir Firebase Console:
   https://console.firebase.google.com/project/profe-blog/settings/serviceaccounts/adminsdk

2. Click en "Generate new private key" (Generar nueva clave privada)

3. Se descargará un archivo JSON con este formato:
   {
     "type": "service_account",
     "project_id": "profe-blog",
     "private_key_id": "abc123...",
     "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
     "client_email": "firebase-adminsdk-xxxxx@profe-blog.iam.gserviceaccount.com",
     "client_id": "123456789...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
   }

4. Guardar el archivo JSON descargado en este directorio como:
   'firebase-service-account.json'

5. Ejecutar este script nuevamente:
   python obtener-credenciales-firebase.py

El script leerá el JSON y actualizará automáticamente tu archivo .env

═══════════════════════════════════════════════════════════════

¿Ya tienes el archivo firebase-service-account.json? (s/n): """)

respuesta = input().strip().lower()

if respuesta != 's':
    print("\n⏳ Por favor descarga el archivo y ejecuta el script nuevamente.")
    exit(0)

import json
import os

try:
    # Leer el archivo JSON
    with open('firebase-service-account.json', 'r', encoding='utf-8') as f:
        creds = json.load(f)
    
    print("\n✅ Archivo JSON encontrado y leído correctamente")
    
    # Preparar las variables
    env_vars = {
        'FIREBASE_PROJECT_ID': creds['project_id'],
        'FIREBASE_PRIVATE_KEY': creds['private_key'],
        'FIREBASE_PRIVATE_KEY_ID': creds['private_key_id'],
        'FIREBASE_CLIENT_EMAIL': creds['client_email'],
        'FIREBASE_CLIENT_ID': creds['client_id'],
        'FIREBASE_CLIENT_CERT_URL': creds['client_x509_cert_url'],
        'FIREBASE_DATABASE_URL': 'https://profe-blog-default-rtdb.firebaseio.com'
    }
    
    # Leer .env actual
    with open('.env', 'r', encoding='utf-8') as f:
        contenido_env = f.read()
    
    # Actualizar cada variable
    for key, value in env_vars.items():
        # Buscar y reemplazar
        if key in contenido_env:
            # Encontrar la línea
            lineas = contenido_env.split('\n')
            for i, linea in enumerate(lineas):
                if linea.startswith(f'{key}='):
                    if key == 'FIREBASE_PRIVATE_KEY':
                        lineas[i] = f'{key}="{value}"'
                    else:
                        lineas[i] = f'{key}={value}'
            contenido_env = '\n'.join(lineas)
    
    # Guardar .env actualizado
    with open('.env', 'w', encoding='utf-8') as f:
        f.write(contenido_env)
    
    print("\n✅ Archivo .env actualizado exitosamente")
    print("\n📋 Variables configuradas:")
    for key in env_vars.keys():
        if key == 'FIREBASE_PRIVATE_KEY':
            print(f"  ✓ {key}: [CLAVE PRIVADA]")
        else:
            print(f"  ✓ {key}: {env_vars[key][:50]}...")
    
    print("\n" + "="*70)
    print("SIGUIENTE PASO: CONFIGURAR EN VERCEL")
    print("="*70)
    print("\n1. Ir a: https://vercel.com/dashboard")
    print("2. Seleccionar proyecto: profefranciscopancho-blog")
    print("3. Settings → Environment Variables")
    print("4. Copiar ESTAS variables (una por una):\n")
    
    for key, value in env_vars.items():
        if key == 'FIREBASE_PRIVATE_KEY':
            print(f"{key}={value}")
        else:
            print(f"{key}={value}")
    
    print("\n5. Aplicar a: Production, Preview y Development")
    print("6. Redeploy el proyecto")
    print("\n✅ Listo! El sistema de registro de notas funcionará correctamente")
    
except FileNotFoundError:
    print("\n❌ Error: No se encontró el archivo 'firebase-service-account.json'")
    print("   Por favor descárgalo de Firebase Console y colócalo en este directorio")
except json.JSONDecodeError:
    print("\n❌ Error: El archivo JSON no es válido")
except Exception as e:
    print(f"\n❌ Error inesperado: {e}")
