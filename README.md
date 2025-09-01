# PlanillaBus Frontend

Frontend de la aplicación PlanillaBus desarrollado en React con Vite.

## 🚀 Despliegue

Esta aplicación se despliega automáticamente en GitHub Pages cuando se hace push a la rama `main`.

### URL de producción
- **GitHub Pages:** https://donbeard.github.io/frontplanillabus/
- **Backend API:** https://planillabus-production.up.railway.app/api

## 🛠️ Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **React Hook Form** - Manejo de formularios
- **Axios** - Cliente HTTP
- **React Router** - Enrutamiento

## 📱 Características

- ✅ **Responsive Design** - Adaptado para móvil y desktop
- ✅ **Tablas responsivas** - Scroll horizontal en dispositivos móviles
- ✅ **Formularios validados** - Validación client-side y server-side
- ✅ **Notificaciones** - Sistema de notificaciones en tiempo real
- ✅ **Paginación** - Navegación eficiente de datos

## 🚀 Instalación local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🔧 Configuración

La aplicación está configurada para conectarse automáticamente al backend de Railway en producción.

### Variables de entorno
- `VITE_API_URL` - URL de la API (opcional, usa Railway por defecto)

## 📱 Capacitor

Para generar la APK de Android:

```bash
# Sincronizar con Capacitor
npm run cap:sync

# Abrir Android Studio
npm run cap:open:android

# Build completo
npm run cap:build:android
```

## 🌐 Despliegue

El despliegue se realiza automáticamente a través de GitHub Actions:

1. **Push a main** → Build automático
2. **GitHub Pages** → Despliegue automático
3. **URL disponible** → https://donbeard.github.io/frontplanillabus/

## 📊 Estado del proyecto

- **Frontend:** ✅ Completado y funcional
- **Backend:** ✅ Desplegado en Railway
- **APK Android:** 🔄 En desarrollo
- **GitHub Pages:** 🚀 Configurado para despliegue automático
