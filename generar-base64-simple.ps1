# Script simple para generar FIREBASE_SERVICE_ACCOUNT_BASE64

Write-Host "`nGenerando credencial Base64...`n" -ForegroundColor Cyan

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
$privateKey = $privateKeyMatch.Groups[1].Value

Write-Host "Variables extraidas OK" -ForegroundColor Green

# Construir JSON manualmente (sin ConvertTo-Json para evitar doble escape)
$jsonString = '{"type":"service_account","project_id":"' + $projectId + '","private_key_id":"' + $privateKeyId + '","private_key":"' + $privateKey + '","client_email":"' + $clientEmail + '","client_id":"' + $clientId + '","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"' + $clientCertUrl + '","universe_domain":"googleapis.com"}'

# Convertir a Base64
$bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
$base64 = [Convert]::ToBase64String($bytes)

# Guardar
$base64 | Out-File "firebase-service-account-base64.txt" -Encoding utf8 -NoNewline

# Copiar al portapapeles
$base64 | Set-Clipboard

Write-Host "`nOK! Credencial generada ($($base64.Length) caracteres)" -ForegroundColor Green
Write-Host "Guardado en: firebase-service-account-base64.txt" -ForegroundColor Cyan
Write-Host "Copiado al portapapeles" -ForegroundColor Cyan
Write-Host "`nAhora ve a Vercel y pega este valor en FIREBASE_SERVICE_ACCOUNT_BASE64`n" -ForegroundColor Yellow
