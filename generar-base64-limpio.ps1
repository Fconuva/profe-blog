# Script para generar FIREBASE_SERVICE_ACCOUNT_BASE64 SIN caracteres de control Windows

Write-Host "`nGenerando credencial Base64 (limpiando saltos de linea Windows)...`n" -ForegroundColor Cyan

# Leer .env
$envContent = Get-Content ".env" -Raw

# Extraer variables
$projectId = if ($envContent -match 'FIREBASE_PROJECT_ID=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$clientEmail = if ($envContent -match 'FIREBASE_CLIENT_EMAIL=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$privateKeyId = if ($envContent -match 'FIREBASE_PRIVATE_KEY_ID=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$clientId = if ($envContent -match 'FIREBASE_CLIENT_ID=([^\r\n]+)') { $matches[1].Trim() } else { "" }
$clientCertUrl = if ($envContent -match 'FIREBASE_CLIENT_CERT_URL=([^\r\n]+)') { $matches[1].Trim() } else { "" }

# Extraer private_key
$privateKeyMatch = [regex]::Match($envContent, 'FIREBASE_PRIVATE_KEY="([^"]+)"')
if (!$privateKeyMatch.Success) {
    Write-Host "Error: No se encontro FIREBASE_PRIVATE_KEY" -ForegroundColor Red
    exit 1
}

# LIMPIAR: Reemplazar \r\n (Windows) por solo \n (Unix)
$privateKey = $privateKeyMatch.Groups[1].Value
$privateKey = $privateKey -replace '\r\n', '\n'
$privateKey = $privateKey -replace '\r', '\n'

Write-Host "Variables extraidas y limpiadas OK" -ForegroundColor Green
Write-Host "  Saltos de linea \n en private_key: $(($privateKey -split '\\n').Count - 1)" -ForegroundColor Gray

# Construir JSON manualmente (escapando comillas dentro del private_key si las hay)
$privateKeyEscaped = $privateKey -replace '"', '\"'

$jsonString = '{"type":"service_account","project_id":"' + $projectId + '","private_key_id":"' + $privateKeyId + '","private_key":"' + $privateKeyEscaped + '","client_email":"' + $clientEmail + '","client_id":"' + $clientId + '","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"' + $clientCertUrl + '","universe_domain":"googleapis.com"}'

# Verificar que NO haya \r en el JSON final
if ($jsonString -match '\r') {
    Write-Host "ADVERTENCIA: Se detectaron caracteres \r en el JSON. Limpiando..." -ForegroundColor Yellow
    $jsonString = $jsonString -replace '\r', ''
}

# Convertir a Base64
$bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
$base64 = [Convert]::ToBase64String($bytes)

# Guardar
$base64 | Out-File "firebase-service-account-base64.txt" -Encoding utf8 -NoNewline

# Copiar al portapapeles
$base64 | Set-Clipboard

Write-Host "`nOK! Credencial LIMPIA generada ($($base64.Length) caracteres)" -ForegroundColor Green
Write-Host "Guardado en: firebase-service-account-base64.txt" -ForegroundColor Cyan
Write-Host "Copiado al portapapeles" -ForegroundColor Cyan
Write-Host "`nAhora actualiza la variable en Vercel con este nuevo valor (CTRL+V)`n" -ForegroundColor Yellow
