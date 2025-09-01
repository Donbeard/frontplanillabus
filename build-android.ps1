# Script de build de Android para Windows
Write-Host "🚀 Iniciando build de Android para PlanillaBus..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio frontend/" -ForegroundColor Red
    exit 1
}

# Instalar dependencias si es necesario
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow
npm install

# Build del proyecto
Write-Host "🔨 Construyendo proyecto..." -ForegroundColor Yellow
npm run build

# Sincronizar con Capacitor
Write-Host "🔄 Sincronizando con Capacitor..." -ForegroundColor Yellow
npx cap sync

# Abrir Android Studio
Write-Host "📱 Abriendo Android Studio..." -ForegroundColor Yellow
npx cap open android

Write-Host "✅ ¡Listo! Android Studio debería abrirse con tu proyecto." -ForegroundColor Green
Write-Host "📋 Para generar la APK:" -ForegroundColor Cyan
Write-Host "   1. En Android Studio, ve a Build > Build Bundle(s) / APK(s) > Build APK(s)" -ForegroundColor White
Write-Host "   2. La APK se generará en android/app/build/outputs/apk/debug/" -ForegroundColor White
Write-Host "   3. Para release: Build > Generate Signed Bundle / APK" -ForegroundColor White
