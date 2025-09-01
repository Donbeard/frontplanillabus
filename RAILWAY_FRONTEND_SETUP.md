# 🚂 Despliegue del Frontend en Railway - PlanillaBus

## 📋 **PASO 1: Crear proyecto en Railway**

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión o crea cuenta
3. Haz clic en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Busca y selecciona tu repositorio: **`Donbeard/frontplanillabus`**

## 📋 **PASO 2: Configuración automática**

Railway detectará automáticamente que es una aplicación React y configurará:
- **Build Command:** `npm run build`
- **Start Command:** `npx serve -s dist -l $PORT`
- **Output Directory:** `dist`

## 📋 **PASO 3: Variables de entorno (opcionales)**

Si necesitas configurar variables de entorno:
- **`NODE_ENV`:** `production`
- **`PORT`:** Railway lo configura automáticamente

## 📋 **PASO 4: Desplegar**

1. Railway comenzará el build automáticamente
2. Espera a que termine el build (5-10 minutos)
3. La aplicación estará disponible en la URL que Railway te proporcione

## 🌐 **URLs finales:**

- **Frontend:** `https://tu-frontend.railway.app`
- **Backend:** `https://planillabus-production.up.railway.app`

## ✅ **Ventajas de Railway para Frontend:**

1. **Sin problemas de MIME types** - Railway sirve archivos correctamente
2. **Sin problemas de rutas** - Maneja SPA routing automáticamente
3. **Build automático** - Se actualiza con cada push a GitHub
4. **HTTPS automático** - Certificados SSL incluidos
5. **Mejor rendimiento** - CDN global de Railway

## 🔧 **Archivos de configuración creados:**

- ✅ `railway.json` - Configuración de Railway
- ✅ `nixpacks.toml` - Configuración de build
- ✅ `RAILWAY_FRONTEND_SETUP.md` - Instrucciones

## 🚀 **Después del despliegue:**

1. **Probar la aplicación** en Railway
2. **Verificar que las rutas funcionen** (navegar entre páginas)
3. **Probar la conexión con el backend** (APIs)
4. **Verificar en móvil** que las tablas sean responsivas

## 📱 **Para el frontend móvil:**

Una vez desplegado en Railway, podrás:
- **Generar APK** con Capacitor
- **Usar la URL de Railway** en lugar de localhost
- **Probar en dispositivos reales** conectados a internet
