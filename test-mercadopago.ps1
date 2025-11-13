# Test Mercado Pago integration
Write-Host "Probando integracion de Mercado Pago..." -ForegroundColor Cyan

$body = @{
    name = "Test Usuario"
    email = "test@ejemplo.com"
    plan = "basic"
} | ConvertTo-Json

Write-Host "Enviando request a create_preference..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://www.profefranciscopancho.com/api/mercadopago/create_preference" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "Respuesta exitosa:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    
    if ($response.preference -and $response.preference.init_point) {
        Write-Host "init_point recibido:" -ForegroundColor Green
        Write-Host $response.preference.init_point -ForegroundColor White
        Write-Host "El endpoint funciona correctamente!" -ForegroundColor Green
        Write-Host "Abre este link para completar el pago de prueba:" -ForegroundColor Cyan
        Write-Host $response.preference.init_point -ForegroundColor Yellow
    } else {
        Write-Host "No se recibio init_point" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Error al llamar al endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host "Detalles del error:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
}

Write-Host "========================================" -ForegroundColor Gray
