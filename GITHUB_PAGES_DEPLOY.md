# 🚀 Despliegue en GitHub Pages - PlanillaBus

## 📋 **Pasos para solucionar el error 404:**

### **1. Archivos creados para GitHub Pages:**
- ✅ `public/404.html` - Maneja el routing de SPA
- ✅ `public/index.html` - Configurado para GitHub Pages
- ✅ `vite.config.js` - Configurado con base path correcto

### **2. Hacer commit y push de los cambios:**
```bash
cd frontend
git add .
git commit -m "Configuración para GitHub Pages - Solución routing SPA"
git push origin main
```

### **3. Verificar despliegue:**
- Ve a tu repositorio: https://github.com/Donbeard/frontplanillabus
- Ve a **Settings** → **Pages**
- Confirma que esté desplegado desde `main` branch
- La URL será: https://donbeard.github.io/frontplanillabus/

## 🔧 **Solución al error 404:**

El error 404 en `main.jsx` se debe a que:
1. **GitHub Pages no soporta SPA routing** por defecto
2. **Las rutas de React Router** no funcionan sin configuración especial

### **Archivos de solución:**
- **`404.html`** - Redirige todas las rutas a index.html
- **`index.html`** - Restaura las rutas correctas en el navegador
- **`vite.config.js`** - Base path configurado para el repositorio

## 🌐 **URLs de la aplicación:**

- **Frontend (GitHub Pages):** https://donbeard.github.io/frontplanillabus/
- **Backend (Railway):** https://planillabus-production.up.railway.app/api

## 📱 **Después del despliegue exitoso:**

1. **Probar la aplicación** en GitHub Pages
2. **Verificar que las rutas funcionen** (navegar entre páginas)
3. **Probar la conexión con Railway** (APIs)
4. **Verificar en móvil** que las tablas sean responsivas

## 🚨 **Si persiste el error:**

1. **Esperar 5-10 minutos** para que GitHub Pages se actualice
2. **Verificar que el build** se haya completado en Actions
3. **Limpiar caché del navegador** y probar en modo incógnito
4. **Verificar que la rama sea `main`** y no `master`
