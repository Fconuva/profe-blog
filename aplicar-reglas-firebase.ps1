# Script para aplicar reglas de Firebase Realtime Database
# Ejecutar: .\aplicar-reglas-firebase.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  APLICAR REGLAS FIREBASE RTDB" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que existe firebase-rules.json
if (!(Test-Path "firebase-rules.json")) {
    Write-Host "ERROR: No se encuentra firebase-rules.json" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Archivo firebase-rules.json encontrado" -ForegroundColor Green
Write-Host ""

# Leer las reglas
$rules = Get-Content "firebase-rules.json" -Raw
Write-Host "Contenido de las reglas:" -ForegroundColor Yellow
Write-Host $rules
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  INSTRUCCIONES MANUALES" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para aplicar estas reglas en Firebase Console:" -ForegroundColor White
Write-Host ""
Write-Host "1. Abre:" -ForegroundColor Yellow
Write-Host "   https://console.firebase.google.com/project/profefranciscopancho/database/profefranciscopancho-default-rtdb/rules" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Copia todo el contenido de arriba (las reglas JSON)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Pegalo en el editor de reglas de Firebase" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Haz clic en Publicar (boton azul arriba a la derecha)" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Espera la confirmacion Reglas publicadas correctamente" -ForegroundColor Yellow
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  VERIFICACION" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Despues de aplicar las reglas:" -ForegroundColor White
Write-Host ""
Write-Host "1. Ve a: https://profefranciscopancho.com/test-firebase-permisos/" -ForegroundColor Blue
Write-Host "   (Esta pagina prueba automaticamente los permisos)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. O prueba el login en: https://profefranciscopancho.com/evaluaciones/login/" -ForegroundColor Blue
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTA IMPORTANTE:" -ForegroundColor Yellow
Write-Host "Las reglas de Firebase NO se pueden aplicar automaticamente desde un script." -ForegroundColor Yellow
Write-Host "Debes hacerlo manualmente en Firebase Console por seguridad." -ForegroundColor Yellow
Write-Host ""

# Copiar las reglas al portapapeles
try {
    $rules | Set-Clipboard
    Write-Host "OK: Las reglas se han copiado al portapapeles" -ForegroundColor Green
    Write-Host "    Solo tienes que pegarlas (Ctrl+V) en Firebase Console" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "INFO: No se pudo copiar al portapapeles automaticamente" -ForegroundColor Gray
    Write-Host "      Copia manualmente el contenido de arriba" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Presiona cualquier tecla para abrir Firebase Console..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Abrir Firebase Console
Start-Process "https://console.firebase.google.com/project/profefranciscopancho/database/profefranciscopancho-default-rtdb/rules"

Write-Host ""
Write-Host "OK: Firebase Console abierto en tu navegador" -ForegroundColor Green
Write-Host ""
