# Script para generar FIREBASE_SERVICE_ACCOUNT_BASE64
# Lee la private key y genera el JSON completo en base64

$privateKey = Get-Content "FIREBASE_PRIVATE_KEY_PARA_NETLIFY.txt" -Raw

# Crear el objeto JSON del service account
$serviceAccount = @{
    type = "service_account"
    project_id = "profe-blog"
    private_key_id = "tu-private-key-id"
    private_key = $privateKey.Trim()
    client_email = "firebase-adminsdk@profe-blog.iam.gserviceaccount.com"
    client_id = "tu-client-id"
    auth_uri = "https://accounts.google.com/o/oauth2/auth"
    token_uri = "https://oauth2.googleapis.com/token"
    auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs"
    client_x509_cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40profe-blog.iam.gserviceaccount.com"
}

# Convertir a JSON
$json = $serviceAccount | ConvertTo-Json -Depth 10

# Convertir a Base64
$bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
$base64 = [Convert]::ToBase64String($bytes)

Write-Host "========================================" -ForegroundColor Green
Write-Host "FIREBASE_SERVICE_ACCOUNT_BASE64:" -ForegroundColor Yellow
Write-Host $base64
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Copia el valor de arriba y pegalo en Vercel como variable de entorno" -ForegroundColor Cyan
Write-Host ""

# Guardar en archivo temporal
$base64 | Out-File "firebase-service-account-base64.txt" -NoNewline
Write-Host "Tambien guardado en: firebase-service-account-base64.txt" -ForegroundColor Magenta
