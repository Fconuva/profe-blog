#!/usr/bin/env pwsh
# ============================================
# Script CORREGIDO para regenerar FIREBASE_SERVICE_ACCOUNT_BASE64
# Maneja correctamente los saltos de línea en private_key
# ============================================

Write-Host "`n🔧 REGENERADOR CORREGIDO DE CREDENCIALES FIREBASE" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Cargar .env
if (!(Test-Path ".env")) {
    Write-Host "❌ Error: Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Leyendo credenciales desde .env..." -ForegroundColor Yellow

$envContent = Get-Content ".env" -Raw

# Extraer variables
$projectId = if ($envContent -match 'FIREBASE_PROJECT_ID=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$clientEmail = if ($envContent -match 'FIREBASE_CLIENT_EMAIL=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$privateKeyId = if ($envContent -match 'FIREBASE_PRIVATE_KEY_ID=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$clientId = if ($envContent -match 'FIREBASE_CLIENT_ID=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$clientCertUrl = if ($envContent -match 'FIREBASE_CLIENT_CERT_URL=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$databaseUrl = if ($envContent -match 'FIREBASE_DATABASE_URL=([^\r\n]+)') { $matches[1].Trim() } else { "" }

# Extraer private_key (entre comillas)
$privateKeyMatch = [regex]::Match($envContent, 'FIREBASE_PRIVATE_KEY="([^"]+)"')
if ($privateKeyMatch.Success) {
    $privateKey = $privateKeyMatch.Groups[1].Value
} else {
    Write-Host "❌ Error: No se pudo extraer FIREBASE_PRIVATE_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Variables extraídas correctamente`n" -ForegroundColor Green

# CONSTRUIR JSON MANUALMENTE (sin ConvertTo-Json que escapa doble los \n)
# Esto asegura que \n permanezcan como \n en el JSON final
$jsonString = @"
{"type":"service_account","project_id":"$projectId","private_key_id":"$privateKeyId","private_key":"$privateKey","client_email":"$clientEmail","client_id":"$clientId","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"$clientCertUrl","universe_domain":"googleapis.com"}
"@

# Convertir a Base64
$bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
$base64 = [Convert]::ToBase64String($bytes)

Write-Host "✅ Credencial Base64 generada`n" -ForegroundColor Green
Write-Host "   Longitud: $($base64.Length) caracteres" -ForegroundColor Gray
Write-Host "   JSON contiene \n: $(($jsonString -split '\\n').Count - 1) ocurrencias`n" -ForegroundColor Gray

# Guardar
$base64 | Out-File "firebase-service-account-base64.txt" -Encoding utf8 -NoNewline

Write-Host "📁 Guardado en: firebase-service-account-base64.txt`n" -ForegroundColor Cyan

# Copiar al portapapeles
if (Get-Command Set-Clipboard -ErrorAction SilentlyContinue) {
    $base64 | Set-Clipboard
    Write-Host "✅ Copiado al portapapeles automáticamente`n" -ForegroundColor Green
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "📋 SIGUIENTE PASO" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Yellow

Write-Host "1. Ve a Vercel → Environment Variables" -ForegroundColor White
Write-Host "2. EDITA (o crea) la variable: FIREBASE_SERVICE_ACCOUNT_BASE64" -ForegroundColor White
Write-Host "3. Pega el valor copiado (CTRL+V)" -ForegroundColor White
Write-Host "4. Guarda y espera redeploy (~30-60 seg)" -ForegroundColor White
Write-Host "5. Ejecuta: .\verificar-firebase-produccion.ps1`n" -ForegroundColor White

Write-Host "🔗 Vercel Settings:" -ForegroundColor Cyan
Write-Host "   https://vercel.com/fconuvas-projects/profefranciscopancho-blog/settings/environment-variables" -ForegroundColor Gray
Write-Host ""
