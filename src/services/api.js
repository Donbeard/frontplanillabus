import axios from 'axios';
import { getApiUrl } from '../config/app.js';

// Configuración base de axios
const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicios para Usuarios
export const usuariosAPI = {
  getAll: (params = {}) => api.get('/usuarios/usuarios/', { params }),
  getById: (id) => api.get(`/usuarios/usuarios/${id}/`),
  create: (data) => api.post('/usuarios/usuarios/', data),
  update: (id, data) => api.put(`/usuarios/usuarios/${id}/`, data),
  delete: (id) => api.delete(`/usuarios/usuarios/${id}/`),
};

// Servicios para Buses
export const busesAPI = {
  getAll: (params = {}) => api.get('/buses/buses/', { params }),
  getById: (id) => api.get(`/buses/buses/${id}/`),
  create: (data) => api.post('/buses/buses/', data),
  update: (id, data) => api.put(`/buses/buses/${id}/`, data),
  delete: (id) => api.delete(`/buses/buses/${id}/`),
};

// Servicios para Conductores
export const conductoresAPI = {
  getAll: (params = {}) => api.get('/buses/conductores/', { params }),
  getById: (id) => api.get(`/buses/conductores/${id}/`),
  create: (data) => api.post('/buses/conductores/', data),
  update: (id, data) => api.put(`/buses/conductores/${id}/`, data),
  delete: (id) => api.delete(`/buses/conductores/${id}/`),
};

// Servicios para Rutas
export const rutasAPI = {
  getAll: (params = {}) => api.get('/rutas/rutas/', { params }),
  getById: (id) => api.get(`/rutas/rutas/${id}/`),
  create: (data) => api.post('/rutas/rutas/', data),
  update: (id, data) => api.put(`/rutas/rutas/${id}/`, data),
  delete: (id) => api.delete(`/rutas/rutas/${id}/`),
};

// Servicios para Perfiles de Rutas
export const perfilesRutasAPI = {
  getAll: (params = {}) => api.get('/rutas/perfiles-rutas/', { params }),
  getById: (id) => api.get(`/rutas/perfiles-rutas/${id}/`),
  create: (data) => api.post('/rutas/perfiles-rutas/', data),
  update: (id, data) => api.put(`/rutas/perfiles-rutas/${id}/`, data),
  delete: (id) => api.delete(`/rutas/perfiles-rutas/${id}/`),
  getByRuta: (rutaId) => api.get(`/rutas/perfiles-rutas/por_ruta/?ruta_id=${rutaId}`),
};

// Servicios para Planillas
export const planillasAPI = {
  getAll: (params = {}) => api.get('/planillas/planillas/', { params }),
  getById: (id) => api.get(`/planillas/planillas/${id}/`),
  create: (data) => api.post('/planillas/planillas/', data),
  update: (id, data) => api.put(`/planillas/planillas/${id}/`, data),
  delete: (id) => api.delete(`/planillas/planillas/${id}/`),
  cerrar: (id) => api.post(`/planillas/planillas/${id}/cerrar/`),
  anular: (id) => api.post(`/planillas/planillas/${id}/anular/`),
  estadisticas: () => api.get('/planillas/planillas/estadisticas/'),
  abiertas: () => api.get('/planillas/planillas/abiertas/'),
  cerradas: () => api.get('/planillas/planillas/cerradas/'),
  porFecha: (fechaInicio, fechaFin) => api.get(`/planillas/planillas/por_fecha/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`),
};

// Servicios para Tiquetes
export const tiquetesAPI = {
  getAll: (params = {}) => api.get('/tiquetes/tiquetes/', { params }),
  getById: (id) => api.get(`/tiquetes/tiquetes/${id}/`),
  create: (data) => api.post('/tiquetes/tiquetes/', data),
  update: (id, data) => api.put(`/tiquetes/tiquetes/${id}/`, data),
  delete: (id) => api.delete(`/tiquetes/tiquetes/${id}/`),
  porPlanilla: (planillaId) => api.get(`/tiquetes/tiquetes/por_planilla/?planilla_id=${planillaId}`),
  porVendedor: (vendedorId) => api.get(`/tiquetes/tiquetes/por_vendedor/?vendedor_id=${vendedorId}`),
  porFecha: (fechaInicio, fechaFin) => api.get(`/tiquetes/tiquetes/por_fecha/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`),
  estadisticas: () => api.get('/tiquetes/tiquetes/estadisticas/'),
};

// Servicios para PlanillaBus
export const planillaBusAPI = {
  getAll: (params = {}) => api.get('/planillas/planillas-buses/', { params }),
  getById: (id) => api.get(`/planillas/planillas-buses/${id}/`),
  create: (data) => api.post('/planillas/planillas-buses/', data),
  update: (id, data) => api.put(`/planillas/planillas-buses/${id}/`, data),
  delete: (id) => api.delete(`/planillas/planillas-buses/${id}/`),
  porPlanilla: (planillaId) => api.get(`/planillas/planillas-buses/por_planilla/?planilla_id=${planillaId}`),
  porBus: (busId) => api.get(`/planillas/planillas-buses/por_bus/?bus_id=${busId}`),
  porConductor: (conductorId) => api.get(`/planillas/planillas-buses/por_conductor/?conductor_id=${conductorId}`),
  registrarLlegada: (id) => api.post(`/planillas/planillas-buses/${id}/registrar_llegada/`),
};

// Servicios para PlanillaDistribucion
export const planillaDistribucionAPI = {
  getAll: (params = {}) => api.get('/planillas/planillas-distribuciones/', { params }),
  getById: (id) => api.get(`/planillas/planillas-distribuciones/${id}/`),
  create: (data) => api.post('/planillas/planillas-distribuciones/', data),
  update: (id, data) => api.put(`/planillas/planillas-distribuciones/${id}/`, data),
  delete: (id) => api.delete(`/planillas/planillas-distribuciones/${id}/`),
  porPlanillaBus: (planillaBusId) => api.get(`/planillas/planillas-distribuciones/por_planilla_bus/?planilla_bus_id=${planillaBusId}`),
  porPropietario: (propietarioId) => api.get(`/planillas/planillas-distribuciones/por_propietario/?propietario_id=${propietarioId}`),
};

// Servicios para datos de referencia
export const coreAPI = {
  getDepartamentos: () => api.get('/core/departamentos/'),
  getCiudades: (params = {}) => api.get('/core/ciudades/', { params }),
  getSitios: (params = {}) => api.get('/core/sitios/', { params }),
  getTiposDocumentos: () => api.get('/core/tipos-documentos/'),
  getRoles: () => api.get('/core/roles/'),
};

export default api;
