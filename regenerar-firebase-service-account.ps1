#!/usr/bin/env pwsh
# ============================================
# Script para regenerar FIREBASE_SERVICE_ACCOUNT_BASE64
# Uso: .\regenerar-firebase-service-account.ps1
# ============================================

Write-Host "`n🔧 REGENERADOR DE CREDENCIALES FIREBASE PARA VERCEL" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Cargar variables del .env
if (!(Test-Path ".env")) {
    Write-Host "❌ Error: Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Leyendo credenciales desde .env..." -ForegroundColor Yellow

# Leer el archivo .env
$envContent = Get-Content ".env" -Raw

# Extraer variables de Firebase
$projectId = if ($envContent -match 'FIREBASE_PROJECT_ID=([^\r\n]+)') { $matches[1] } else { "" }
$clientEmail = if ($envContent -match 'FIREBASE_CLIENT_EMAIL=([^\r\n]+)') { $matches[1] } else { "" }
$privateKeyId = if ($envContent -match 'FIREBASE_PRIVATE_KEY_ID=([^\r\n]+)') { $matches[1] } else { "" }
$clientId = if ($envContent -match 'FIREBASE_CLIENT_ID=([^\r\n]+)') { $matches[1] } else { "" }
$clientCertUrl = if ($envContent -match 'FIREBASE_CLIENT_CERT_URL=([^\r\n]+)') { $matches[1] } else { "" }
$databaseUrl = if ($envContent -match 'FIREBASE_DATABASE_URL=([^\r\n]+)') { $matches[1] } else { "" }

# Extraer la private key (entre comillas)
$privateKeyMatch = [regex]::Match($envContent, 'FIREBASE_PRIVATE_KEY="([^"]+)"')
if ($privateKeyMatch.Success) {
    $privateKey = $privateKeyMatch.Groups[1].Value
} else {
    Write-Host "❌ Error: No se pudo extraer FIREBASE_PRIVATE_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Variables extraídas:" -ForegroundColor Green
Write-Host "   - Project ID: $projectId" -ForegroundColor Gray
Write-Host "   - Client Email: $clientEmail" -ForegroundColor Gray
Write-Host "   - Private Key: [EXTRACTED]" -ForegroundColor Gray

# Construir el objeto JSON del Service Account
$serviceAccount = @{
    type = "service_account"
    project_id = $projectId
    private_key_id = $privateKeyId
    private_key = $privateKey
    client_email = $clientEmail
    client_id = $clientId
    auth_uri = "https://accounts.google.com/o/oauth2/auth"
    token_uri = "https://oauth2.googleapis.com/token"
    auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs"
    client_x509_cert_url = $clientCertUrl
    universe_domain = "googleapis.com"
}

# Convertir a JSON compacto (sin espacios ni saltos innecesarios)
$jsonString = $serviceAccount | ConvertTo-Json -Compress -Depth 10

# Convertir a Base64
$bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
$base64 = [Convert]::ToBase64String($bytes)

Write-Host "`n✅ Credencial generada exitosamente`n" -ForegroundColor Green

# Guardar en archivo
$base64 | Out-File "firebase-service-account-base64.txt" -Encoding utf8 -NoNewline

Write-Host "📁 Guardado en: firebase-service-account-base64.txt`n" -ForegroundColor Cyan

# Mostrar instrucciones
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "📋 SIGUIENTE PASO: CONFIGURAR EN VERCEL" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

Write-Host "1. Ve a: https://vercel.com/fconuvas-projects/profefranciscopancho-blog/settings/environment-variables`n" -ForegroundColor White

Write-Host "2. Busca o crea la variable:" -ForegroundColor White
Write-Host "   Nombre: " -NoNewline -ForegroundColor Gray
Write-Host "FIREBASE_SERVICE_ACCOUNT_BASE64" -ForegroundColor Cyan

Write-Host "`n3. Pega el siguiente valor (ya copiado al portapapeles):`n" -ForegroundColor White

# Copiar al portapapeles (si está disponible)
if (Get-Command Set-Clipboard -ErrorAction SilentlyContinue) {
    $base64 | Set-Clipboard
    Write-Host "   ✅ Valor copiado al portapapeles automáticamente`n" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Copia manualmente el contenido de firebase-service-account-base64.txt`n" -ForegroundColor Yellow
}

Write-Host "4. También configura:" -ForegroundColor White
Write-Host "   Nombre: " -NoNewline -ForegroundColor Gray
Write-Host "FIREBASE_DATABASE_URL" -ForegroundColor Cyan
Write-Host "   Valor:  " -NoNewline -ForegroundColor Gray
Write-Host "$databaseUrl`n" -ForegroundColor Cyan

Write-Host "5. Asegúrate de seleccionar: " -NoNewline -ForegroundColor White
Write-Host "Production, Preview, Development`n" -ForegroundColor Yellow

Write-Host "6. Guarda y espera el redeploy automático (o haz 'Redeploy' manualmente)`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "🧪 VERIFICACIÓN" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

Write-Host "Después del deploy, prueba:" -ForegroundColor White
Write-Host "   https://www.profefranciscopancho.com/api/get-courses-Francisco?username=francisco_fconuva`n" -ForegroundColor Cyan

Write-Host "Respuesta esperada:" -ForegroundColor White
Write-Host '   {"success":true,"courses":[],"message":"..."}' -ForegroundColor Green
Write-Host ""

# Mostrar longitud del base64 para referencia
Write-Host "ℹ️  Longitud del Base64: $($base64.Length) caracteres" -ForegroundColor Gray
Write-Host ""
