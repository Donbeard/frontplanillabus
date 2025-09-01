#!/bin/bash

echo "🚀 Iniciando build de Android para PlanillaBus..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio frontend/"
    exit 1
fi

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."
npm install

# Build del proyecto
echo "🔨 Construyendo proyecto..."
npm run build

# Sincronizar con Capacitor
echo "🔄 Sincronizando con Capacitor..."
npx cap sync

# Abrir Android Studio
echo "📱 Abriendo Android Studio..."
npx cap open android

echo "✅ ¡Listo! Android Studio debería abrirse con tu proyecto."
echo "📋 Para generar la APK:"
echo "   1. En Android Studio, ve a Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "   2. La APK se generará en android/app/build/outputs/apk/debug/"
echo "   3. Para release: Build > Generate Signed Bundle / APK"
