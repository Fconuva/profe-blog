#!/usr/bin/env pwsh
# ============================================
# Script para verificar la configuración de Firebase en producción
# Uso: .\verificar-firebase-produccion.ps1
# ============================================

Write-Host "`n🧪 VERIFICADOR DE FIREBASE EN PRODUCCIÓN" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$apiUrl = "https://www.profefranciscopancho.com/api/get-courses-Francisco?username=francisco_fconuva"

Write-Host "📡 Probando conexión a la API..." -ForegroundColor Yellow
Write-Host "   URL: $apiUrl`n" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method GET -UseBasicParsing
    $statusCode = $response.StatusCode
    $content = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ ESTADO: Conexión exitosa (HTTP $statusCode)`n" -ForegroundColor Green
    
    # Verificar estructura de respuesta
    if ($content.success -eq $true) {
        Write-Host "✅ RESPUESTA: API funcionando correctamente" -ForegroundColor Green
        Write-Host "   • success: $($content.success)" -ForegroundColor Gray
        Write-Host "   • courses: $($content.courses.Count) cursos" -ForegroundColor Gray
        
        if ($content.message) {
            Write-Host "   • message: $($content.message)" -ForegroundColor Gray
        }
        
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        Write-Host "🎉 CONFIGURACIÓN CORRECTA" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green
        
        Write-Host "La base de datos Firebase está configurada correctamente." -ForegroundColor White
        Write-Host "El sistema de registro de notas funcionará sin problemas.`n" -ForegroundColor White
        
        Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
        Write-Host "   1. Abre: https://www.profefranciscopancho.com/privado/registro-notas?docente=francisco" -ForegroundColor White
        Write-Host "   2. Ve a la pestaña 'Configuración'" -ForegroundColor White
        Write-Host "   3. Haz clic en 'Ejecutar Diagnóstico'" -ForegroundColor White
        Write-Host "   4. Verifica que todos los tests pasen ✅`n" -ForegroundColor White
        
    } else {
        Write-Host "⚠️  ADVERTENCIA: La API respondió pero con success=false" -ForegroundColor Yellow
        Write-Host "   Respuesta completa:" -ForegroundColor Gray
        Write-Host "   $($content | ConvertTo-Json -Depth 3)`n" -ForegroundColor Gray
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    Write-Host "❌ ERROR: No se pudo conectar a la API" -ForegroundColor Red
    Write-Host "   Status: HTTP $statusCode`n" -ForegroundColor Gray
    
    if ($statusCode -eq 404) {
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
        Write-Host "❌ PROBLEMA: API no encontrada (404)" -ForegroundColor Red
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Red
        
        Write-Host "Posibles causas:" -ForegroundColor Yellow
        Write-Host "   1. El deployment aún está en progreso (espera 1-2 minutos)" -ForegroundColor White
        Write-Host "   2. Los archivos /api/get-courses-Francisco.js no están en Git" -ForegroundColor White
        Write-Host "`nSolución:" -ForegroundColor Yellow
        Write-Host "   git add api/" -ForegroundColor Cyan
        Write-Host "   git commit -m 'Agregar APIs de Firebase'" -ForegroundColor Cyan
        Write-Host "   git push origin main`n" -ForegroundColor Cyan
        
    } elseif ($statusCode -eq 500) {
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
        Write-Host "❌ PROBLEMA: Error interno del servidor (500)" -ForegroundColor Red
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Red
        
        Write-Host "Posibles causas:" -ForegroundColor Yellow
        Write-Host "   1. Variable FIREBASE_SERVICE_ACCOUNT_BASE64 mal configurada" -ForegroundColor White
        Write-Host "   2. La credencial está incompleta o corrupta" -ForegroundColor White
        Write-Host "   3. FIREBASE_DATABASE_URL incorrecta" -ForegroundColor White
        Write-Host "`nSolución:" -ForegroundColor Yellow
        Write-Host "   1. Verifica las variables en Vercel" -ForegroundColor White
        Write-Host "   2. Asegúrate de pegar los 3176 caracteres completos" -ForegroundColor White
        Write-Host "   3. Revisa los logs en:" -ForegroundColor White
        Write-Host "      https://vercel.com/fconuvas-projects/profefranciscopancho-blog/logs`n" -ForegroundColor Cyan
        
    } else {
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
        Write-Host "❌ ERROR DESCONOCIDO" -ForegroundColor Red
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Red
        
        Write-Host "Detalles del error:" -ForegroundColor Yellow
        Write-Host "   $($_.Exception.Message)`n" -ForegroundColor Gray
        
        Write-Host "Revisa los logs en Vercel para más detalles:" -ForegroundColor White
        Write-Host "   https://vercel.com/fconuvas-projects/profefranciscopancho-blog/logs`n" -ForegroundColor Cyan
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "📚 DOCUMENTACIÓN" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

Write-Host "Instrucciones completas:" -ForegroundColor White
Write-Host "   INSTRUCCIONES-REPARAR-BASE-DATOS.md`n" -ForegroundColor Cyan

Write-Host "Regenerar credencial:" -ForegroundColor White
Write-Host "   .\regenerar-firebase-service-account.ps1`n" -ForegroundColor Cyan

Write-Host ""
