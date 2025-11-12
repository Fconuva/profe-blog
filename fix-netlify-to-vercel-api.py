#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Arreglar rutas de Netlify Functions a Vercel API
"""

import re

archivo = r"c:\Users\fconu\OneDrive\Escritorio\PAGINA WEB\profefranciscopancho-blog\privado\registro-notas.html"

with open(archivo, 'r', encoding='utf-8') as f:
    contenido = f.read()

# Reemplazar todas las ocurrencias de /.netlify/functions/ por /api/
contenido_nuevo = contenido.replace('/.netlify/functions/', '/api/')

# Contar cambios
cambios = contenido.count('/.netlify/functions/')

with open(archivo, 'w', encoding='utf-8') as f:
    f.write(contenido_nuevo)

print(f"✅ {cambios} rutas actualizadas de Netlify Functions a Vercel API")
print("Cambios realizados:")
print("  /.netlify/functions/get-courses-Francisco → /api/get-courses-Francisco")
print("  /.netlify/functions/save-courses-Francisco → /api/save-courses-Francisco")
print("  /.netlify/functions/check-updates-Francisco → /api/check-updates-Francisco")
print("  /.netlify/functions/delete-course-Francisco → /api/delete-course-Francisco")
