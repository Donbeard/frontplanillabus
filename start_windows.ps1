# Script PowerShell para iniciar Frontend PlanillaBus en Windows
param(
    [int]$FrontendPort = 8012,
    [int]$BackendPort = 8013
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "    INICIANDO FRONTEND PLANILLABUS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Configuración:" -ForegroundColor Yellow
Write-Host "- Puerto Frontend: $FrontendPort" -ForegroundColor White
Write-Host "- Puerto Backend: $BackendPort" -ForegroundColor White
Write-Host "- URL Frontend: http://localhost:$FrontendPort" -ForegroundColor Cyan
Write-Host "- URL Backend: http://localhost:$BackendPort" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Node.js 16+ desde https://nodejs.org" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version 2>&1
    Write-Host "✓ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: npm no está instalado" -ForegroundColor Red
    Write-Host "Por favor instala npm o actualiza Node.js" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    INICIANDO FRONTEND EN PUERTO $FrontendPort" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "El frontend estará disponible en:" -ForegroundColor White
Write-Host "- Local: http://localhost:$FrontendPort" -ForegroundColor Cyan
Write-Host "- Red: http://[TU_IP]:$FrontendPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "Asegúrate de que el backend esté corriendo en el puerto $BackendPort" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor de desarrollo
npm run dev -- --port $FrontendPort --host 0.0.0.0
