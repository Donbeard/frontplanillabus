# Build de Android - PlanillaBus

## Prerrequisitos

1. **Node.js y npm** instalados
2. **Android Studio** instalado y configurado
3. **Android SDK** configurado
4. **Java JDK** instalado

## Configuración Inicial

### 1. Instalar Capacitor (si no está instalado)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Inicializar Capacitor
```bash
npx cap init PlanillaBus com.planillabus.app
```

### 3. Agregar plataforma Android
```bash
npx cap add android
```

## Build y Generación de APK

### Opción 1: Script Automatizado (Recomendado)
```bash
# En el directorio frontend/
chmod +x build-android.sh
./build-android.sh
```

### Opción 2: Comandos Manuales
```bash
# 1. Build del proyecto
npm run build

# 2. Sincronizar con Capacitor
npx cap sync

# 3. Abrir Android Studio
npx cap open android
```

## Generación de APK en Android Studio

### APK de Debug
1. Abrir el proyecto en Android Studio
2. Ir a `Build > Build Bundle(s) / APK(s) > Build APK(s)`
3. La APK se generará en `android/app/build/outputs/apk/debug/`

### APK de Release (Firmada)
1. Ir a `Build > Generate Signed Bundle / APK`
2. Seleccionar `APK`
3. Crear o seleccionar un keystore
4. Configurar la información de firma
5. Seleccionar `release` como build variant
6. La APK se generará en `android/app/build/outputs/apk/release/`

## Configuración de la App

### Icono de la App
- Reemplazar los archivos en `android/app/src/main/res/mipmap-*`
- Tamaños requeridos: 48x48, 72x72, 96x96, 144x144, 192x192

### Nombre de la App
- Editar `android/app/src/main/res/values/strings.xml`

### Permisos
- Configurar en `android/app/src/main/AndroidManifest.xml`

## Troubleshooting

### Error: "SDK location not found"
- Configurar `ANDROID_HOME` en las variables de entorno
- Asegurarse de que Android SDK esté instalado

### Error: "Gradle sync failed"
- Verificar que Java JDK esté instalado
- Actualizar Gradle en Android Studio

### Error: "Build failed"
- Limpiar proyecto: `Build > Clean Project`
- Rebuild: `Build > Rebuild Project`

## Comandos Útiles

```bash
# Sincronizar cambios
npx cap sync

# Copiar archivos web
npx cap copy

# Abrir Android Studio
npx cap open android

# Ejecutar en dispositivo/emulador
npx cap run android
```

## Estructura de Archivos

```
frontend/
├── android/                 # Proyecto Android
├── dist/                   # Build de la web app
├── capacitor.config.ts     # Configuración de Capacitor
├── build-android.sh       # Script de build
└── ANDROID_BUILD.md       # Esta documentación
```
