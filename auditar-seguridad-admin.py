#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AUDITORÍA DE SEGURIDAD - SISTEMA ADMIN
Verificación de protecciones y controles de acceso
"""

import os
import re
from pathlib import Path

print("="*80)
print("🔒 AUDITORÍA DE SEGURIDAD - SISTEMA DE ADMINISTRACIÓN")
print("="*80)

# Rutas
privado_dir = Path("privado")
html_files = list(privado_dir.glob("*.html"))

print(f"\n📂 Analizando {len(html_files)} archivos en /privado/\n")

# ==================== CHECKLIST DE SEGURIDAD ====================
issues = []

print("="*80)
print("1️⃣ VERIFICACIÓN DE AUTH GUARD (Protección de Sesión)")
print("="*80)

auth_guard_pattern = r"sessionStorage\.getItem\(['\"]isLoggedIn['\"]\)\s*!==\s*['\"]true['\"]"
redirect_pattern = r"window\.location\.href\s*=\s*['\"]index\.html['\"]"

for file in html_files:
    if file.name == "index.html":  # Skip login page
        continue
    
    content = file.read_text(encoding='utf-8')
    
    has_auth_guard = re.search(auth_guard_pattern, content) is not None
    has_redirect = re.search(redirect_pattern, content) is not None
    
    if not has_auth_guard or not has_redirect:
        issues.append({
            'severity': 'CRÍTICO',
            'file': file.name,
            'issue': 'Falta Auth Guard - archivo accesible sin login',
            'detail': f"Auth Guard: {'✓' if has_auth_guard else '✗'} | Redirect: {'✓' if has_redirect else '✗'}"
        })
        print(f"❌ {file.name}: SIN PROTECCIÓN")
    else:
        print(f"✅ {file.name}: Protegido con Auth Guard")

print("\n" + "="*80)
print("2️⃣ VERIFICACIÓN DE ROLES Y PERMISOS")
print("="*80)

role_check_pattern = r"userRole\s*[!=]==\s*['\"]admin['\"]"
files_with_role_check = []

for file in html_files:
    content = file.read_text(encoding='utf-8')
    
    if re.search(role_check_pattern, content):
        files_with_role_check.append(file.name)
        print(f"✅ {file.name}: Tiene verificación de rol")

if not files_with_role_check:
    issues.append({
        'severity': 'ALTO',
        'file': 'SISTEMA',
        'issue': 'No hay verificación de roles',
        'detail': 'Usuarios teacher pueden acceder a funciones de admin'
    })
    print("⚠️  NINGÚN archivo verifica roles (teacher vs admin)")

print("\n" + "="*80)
print("3️⃣ VERIFICACIÓN DE CREDENCIALES EN CÓDIGO")
print("="*80)

# Check login page
login_file = privado_dir / "index.html"
if login_file.exists():
    content = login_file.read_text(encoding='utf-8')
    
    # Buscar credenciales hardcodeadas
    password_pattern = r"password:\s*['\"]([^'\"]+)['\"]"
    passwords_found = re.findall(password_pattern, content)
    
    if passwords_found:
        issues.append({
            'severity': 'CRÍTICO',
            'file': 'index.html',
            'issue': 'Credenciales en código cliente',
            'detail': f'Encontradas {len(passwords_found)} contraseñas hardcodeadas'
        })
        print(f"❌ CRÍTICO: {len(passwords_found)} contraseñas encontradas en código cliente")
        print("   ⚠️  Las contraseñas están visibles en el navegador")
    else:
        print("✅ No se encontraron contraseñas hardcodeadas")

print("\n" + "="*80)
print("4️⃣ VERIFICACIÓN DE REGISTRO DE DISPOSITIVOS")
print("="*80)

device_tracking_patterns = [
    r"deviceFingerprint",
    r"navigator\.userAgent",
    r"trustedDevices",
    r"deviceId"
]

device_tracking_files = []
for file in html_files:
    content = file.read_text(encoding='utf-8')
    for pattern in device_tracking_patterns:
        if re.search(pattern, content):
            device_tracking_files.append(file.name)
            break

if device_tracking_files:
    print(f"✅ Registro de dispositivos implementado en {len(device_tracking_files)} archivo(s)")
    for f in device_tracking_files:
        print(f"   - {f}")
else:
    issues.append({
        'severity': 'MEDIO',
        'file': 'SISTEMA',
        'issue': 'No hay registro de dispositivos',
        'detail': 'No se rastrea desde qué dispositivos se accede'
    })
    print("⚠️  No se detectó registro de dispositivos")

print("\n" + "="*80)
print("5️⃣ VERIFICACIÓN DE PROTECCIÓN CONTRA LINKS DIRECTOS")
print("="*80)

# Verificar si hay rutas públicas que deberían estar protegidas
public_routes = [
    "evaluaciones/",
    "temarios/",
    "recursos/"
]

# Check .eleventy.js or similar for public routes
eleventy_file = Path(".eleventy.js")
if eleventy_file.exists():
    content = eleventy_file.read_text(encoding='utf-8')
    if "privado" in content:
        print("✅ Directorio /privado/ configurado en build")
    else:
        issues.append({
            'severity': 'ALTO',
            'file': '.eleventy.js',
            'issue': 'Directorio privado no configurado',
            'detail': '/privado/ podría ser accesible públicamente'
        })
        print("⚠️  Directorio /privado/ no está configurado en .eleventy.js")

# Check _redirects or netlify.toml
redirects_file = Path("_redirects")
if redirects_file.exists():
    content = redirects_file.read_text(encoding='utf-8')
    if "/privado/*" in content:
        print("✅ Reglas de redirección para /privado/* encontradas")
    else:
        issues.append({
            'severity': 'CRÍTICO',
            'file': '_redirects',
            'issue': 'Sin protección de /privado/ en _redirects',
            'detail': 'Usuarios pueden acceder directamente a URLs privadas'
        })
        print("❌ CRÍTICO: No hay reglas de protección en _redirects")
else:
    issues.append({
        'severity': 'CRÍTICO',
        'file': '_redirects',
        'issue': 'Archivo _redirects no existe',
        'detail': 'No hay control de acceso a nivel de servidor'
    })
    print("❌ CRÍTICO: Archivo _redirects no encontrado")

print("\n" + "="*80)
print("6️⃣ VERIFICACIÓN DE PROTECCIÓN sessionStorage")
print("="*80)

# Verificar que se limpie sessionStorage al cerrar sesión
logout_pattern = r"sessionStorage\.clear\(\)|sessionStorage\.removeItem"
files_with_logout = []

for file in html_files:
    content = file.read_text(encoding='utf-8')
    if re.search(logout_pattern, content):
        files_with_logout.append(file.name)

if files_with_logout:
    print(f"✅ Limpieza de sesión implementada en {len(files_with_logout)} archivo(s)")
else:
    issues.append({
        'severity': 'MEDIO',
        'file': 'SISTEMA',
        'issue': 'No hay limpieza de sessionStorage',
        'detail': 'Sesiones podrían persistir indebidamente'
    })
    print("⚠️  No se detectó limpieza de sessionStorage al cerrar sesión")

print("\n" + "="*80)
print("7️⃣ VERIFICACIÓN DE PROTECCIÓN CONTRA COMPARTIR LINKS")
print("="*80)

# Verificar que las rutas privadas requieran autenticación incluso con link directo
print("Verificando protección contra links compartidos...")

# Buscar archivos que podrían ser compartidos
protected_files = [
    "dashboard.html",
    "registro-notas.html",
    "admin-db-docentes.html",
    "gestor-planes-programas.html"
]

all_protected = True
for filename in protected_files:
    file_path = privado_dir / filename
    if not file_path.exists():
        continue
    
    content = file_path.read_text(encoding='utf-8')
    has_guard = re.search(auth_guard_pattern, content) is not None
    
    if has_guard:
        print(f"✅ {filename}: Requiere login incluso con link directo")
    else:
        all_protected = False
        print(f"❌ {filename}: ACCESIBLE con link directo sin login")
        issues.append({
            'severity': 'CRÍTICO',
            'file': filename,
            'issue': 'Link directo sin protección',
            'detail': 'Usuario puede acceder compartiendo URL'
        })

if all_protected:
    print("✅ Todos los archivos críticos están protegidos")

# ==================== RESUMEN DE AUDITORÍA ====================
print("\n" + "="*80)
print("📊 RESUMEN DE AUDITORÍA")
print("="*80)

criticos = [i for i in issues if i['severity'] == 'CRÍTICO']
altos = [i for i in issues if i['severity'] == 'ALTO']
medios = [i for i in issues if i['severity'] == 'MEDIO']

print(f"\n🔴 Problemas CRÍTICOS: {len(criticos)}")
print(f"🟠 Problemas ALTOS: {len(altos)}")
print(f"🟡 Problemas MEDIOS: {len(medios)}")
print(f"✅ Total de problemas: {len(issues)}\n")

if issues:
    print("="*80)
    print("⚠️  PROBLEMAS DETECTADOS")
    print("="*80)
    
    for issue in sorted(issues, key=lambda x: {'CRÍTICO': 0, 'ALTO': 1, 'MEDIO': 2}[x['severity']]):
        icon = {'CRÍTICO': '🔴', 'ALTO': '🟠', 'MEDIO': '🟡'}[issue['severity']]
        print(f"\n{icon} [{issue['severity']}] {issue['file']}")
        print(f"   Problema: {issue['issue']}")
        print(f"   Detalle: {issue['detail']}")
else:
    print("\n✅ ¡NO SE DETECTARON PROBLEMAS DE SEGURIDAD!")
    print("   El sistema cumple con todos los controles de seguridad.")

print("\n" + "="*80)
print("🔧 RECOMENDACIONES")
print("="*80)

recomendaciones = []

if criticos:
    recomendaciones.append("1. URGENTE: Corregir problemas críticos inmediatamente")
    recomendaciones.append("   - Implementar Auth Guard en todos los archivos privados")
    recomendaciones.append("   - Configurar _redirects para proteger /privado/")
    recomendaciones.append("   - Mover credenciales a servidor (Firebase Auth)")

if [i for i in issues if 'roles' in i['issue'].lower()]:
    recomendaciones.append("2. Implementar verificación de roles en funciones sensibles")
    recomendaciones.append("   - Separar dashboard de admin y teacher")
    recomendaciones.append("   - Restringir acceso a Control Maestro solo para admin")

if [i for i in issues if 'dispositivos' in i['issue'].lower()]:
    recomendaciones.append("3. Implementar registro y verificación de dispositivos")
    recomendaciones.append("   - Guardar fingerprint del dispositivo en Firebase")
    recomendaciones.append("   - Limitar acceso a dispositivos conocidos")

recomendaciones.append("4. Migrar a Firebase Authentication (largo plazo)")
recomendaciones.append("   - Eliminar credenciales del código cliente")
recomendaciones.append("   - Usar tokens JWT para sesiones")
recomendaciones.append("   - Implementar 2FA para admin")

for rec in recomendaciones:
    print(rec)

print("\n" + "="*80)
print("FIN DE AUDITORÍA")
print("="*80)
