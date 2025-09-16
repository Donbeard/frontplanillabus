// Configuración de la aplicación
export const APP_CONFIG = {
  // URL de la API - Cambiada a Railway para pruebas
  API_URL: import.meta.env.VITE_API_URL || 'https://planillabus-production.up.railway.app/api',
  
  // Configuración de la app
  APP_NAME: 'PlanillaBus',
  APP_VERSION: '1.0.0',
  
  // Configuración de paginación
  DEFAULT_PAGE_SIZE: 20,
  
  // Configuración de notificaciones
  NOTIFICATION_DURATION: 3000,
  
  // Configuración de la app móvil
  MOBILE_CONFIG: {
    // URL de la API para móvil (cuando se despliegue en Railway)
    API_URL_MOBILE: 'https://planillabus-production.up.railway.app/api',
    
    // Configuración de Capacitor
    CAPACITOR_CONFIG: {
      appId: 'com.planillabus.app',
      appName: 'PlanillaBus',
      webDir: 'dist',
      server: {
        androidScheme: 'https'
      }
    }
  }
};

// Función para obtener la URL de la API según el entorno
export const getApiUrl = () => {
  // Detectar si estamos en una app móvil
  const isMobileApp = window.Capacitor || 
                     window.cordova || 
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     window.location.protocol === 'capacitor:';
  
  console.log('Detectando entorno:', {
    isMobileApp,
    userAgent: navigator.userAgent,
    protocol: window.location.protocol,
    capacitor: !!window.Capacitor,
    cordova: !!window.Cordova
  });
  
  // Ahora siempre usar Railway para pruebas
  console.log('Usando API de Railway para pruebas:', APP_CONFIG.API_URL);
  return APP_CONFIG.API_URL;
};
