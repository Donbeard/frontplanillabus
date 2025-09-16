// Configuración específica para Windows
export const WINDOWS_CONFIG = {
  // URL de la API para Windows
  API_URL: import.meta.env.VITE_API_URL || 'http://144.76.41.52:8012/api',
  
  // Puerto del frontend
  FRONTEND_PORT: 8012,
  
  // Puerto del backend
  BACKEND_PORT: 8013,
  
  // Configuración de la app
  APP_NAME: 'PlanillaBus - Windows',
  APP_VERSION: '1.0.0',
  
  // Configuración de paginación
  DEFAULT_PAGE_SIZE: 20,
  
  // Configuración de notificaciones
  NOTIFICATION_DURATION: 3000,
  
  // Configuración de la app móvil
  MOBILE_CONFIG: {
    // URL de la API para móvil en Windows
    API_URL_MOBILE: 'http://144.76.41.52:8012/api',
    
    // Configuración de Capacitor
    CAPACITOR_CONFIG: {
      appId: 'com.planillabus.app',
      appName: 'PlanillaBus',
      webDir: 'dist',
      server: {
        androidScheme: 'http'  // HTTP para Windows
      }
    }
  }
};

// Función para obtener la URL de la API según el entorno
export const getWindowsApiUrl = () => {
  // Detectar si estamos en una app móvil
  const isMobileApp = window.Capacitor || 
                     window.cordova || 
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     window.location.protocol === 'capacitor:';
  
  console.log('Detectando entorno Windows:', {
    isMobileApp,
    userAgent: navigator.userAgent,
    protocol: window.location.protocol,
    capacitor: !!window.Capacitor,
    cordova: !!window.Cordova
  });
  
  // Para Windows, usar la URL local
  const apiUrl = WINDOWS_CONFIG.API_URL;
  console.log('Usando API de Windows:', apiUrl);
  return apiUrl;
};

// Función para obtener la URL del frontend
export const getWindowsFrontendUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = WINDOWS_CONFIG.FRONTEND_PORT;
  
  return `${protocol}//${hostname}:${port}`;
};

// Función para obtener la URL del backend
export const getWindowsBackendUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = WINDOWS_CONFIG.BACKEND_PORT;
  
  return `${protocol}//${hostname}:${port}`;
};
