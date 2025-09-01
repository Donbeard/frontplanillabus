import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { coreAPI, usuariosAPI, planillasAPI, perfilesRutasAPI, rutasAPI } from '../../services/api';

const TiqueteForm = ({ tiquete, onClose, onSubmit }) => {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [planillas, setPlanillas] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [perfilesRuta, setPerfilesRuta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoSeleccion, setInfoSeleccion] = useState(null);
  const [perfilSeleccionadoTexto, setPerfilSeleccionadoTexto] = useState('');

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      setLoading(true);
      const [tiposDocRes, vendedoresRes, planillasRes, rutasRes] = await Promise.all([
        coreAPI.getTiposDocumentos(),
        usuariosAPI.getAll(),
        planillasAPI.getAll(),
        rutasAPI.getAll()
      ]);

      setTiposDocumento(tiposDocRes.data.results || tiposDocRes.data);
      setVendedores(vendedoresRes.data.results || vendedoresRes.data);
      setPlanillas(planillasRes.data.results || planillasRes.data);
      setRutas(rutasRes.data.results || rutasRes.data);
      
      // Debug: Mostrar datos cargados
      console.log('Planillas cargadas:', planillasRes.data.results || planillasRes.data);
      console.log('Rutas cargadas:', rutasRes.data.results || rutasRes.data);
    } catch (error) {
      console.error('Error cargando datos de referencia:', error);
      setTiposDocumento([]);
      setVendedores([]);
      setPlanillas([]);
      setRutas([]);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: tiquete ? {
      id_tipo_documento: tiquete.id_tipo_documento?.toString() || '',
      numero_documento: tiquete.numero_documento || '',
      nombre: tiquete.nombre || '',
      correo: tiquete.correo || '',
      num_asientos: tiquete.num_asientos || 1,
      id_planilla: tiquete.id_planilla?.toString() || '',
      id_perfil_ruta: tiquete.id_perfil_ruta?.toString() || '',
      id_vendedor: tiquete.id_vendedor?.toString() || '',
      valor_unitario: tiquete.valor_unitario || '',
      total: tiquete.total || ''
    } : {
      id_tipo_documento: '',
      numero_documento: '',
      nombre: '',
      correo: '',
      num_asientos: 1,
      id_planilla: '',
      id_perfil_ruta: '',
      id_vendedor: '',
      valor_unitario: '',
      total: ''
    }
  });

  // Observar cambios en num_asientos y valor_unitario para calcular total
  const numAsientos = watch('num_asientos');
  const valorUnitario = watch('valor_unitario');
  const planillaSeleccionada = watch('id_planilla');
  const perfilRutaSeleccionado = watch('id_perfil_ruta');

  // Cargar perfiles de ruta cuando se selecciona una planilla
  useEffect(() => {
    if (planillaSeleccionada) {
      loadPerfilesRuta(planillaSeleccionada);
    } else {
      setPerfilesRuta([]);
      setPerfilSeleccionadoTexto('');
    }
  }, [planillaSeleccionada]);

  // Verificar si la planilla seleccionada está cerrada o anulada
  const planillaSeleccionadaData = planillas.find(p => p.id.toString() === planillaSeleccionada);
  const planillaCerrada = planillaSeleccionadaData?.estado === 3;
  const planillaAnulada = planillaSeleccionadaData?.estado === 4;
  const planillaNoDisponible = planillaCerrada || planillaAnulada;

  const loadPerfilesRuta = async (planillaId) => {
    try {
      const planilla = planillas.find(p => p.id.toString() === planillaId);
      console.log('Planilla encontrada:', planilla);
      
      if (planilla?.ruta?.id) {
        console.log('Cargando perfiles para ruta:', planilla.ruta.id);
        const perfilesRes = await perfilesRutasAPI.getByRuta(planilla.ruta.id);
        console.log('Perfiles cargados:', perfilesRes.data);
        const perfiles = perfilesRes.data.results || perfilesRes.data;
        setPerfilesRuta(perfiles);
        
        // Seleccionar automáticamente el perfil correcto
        if (perfiles.length > 0) {
          const perfilSeleccionado = seleccionarPerfilAutomatico(perfiles);
          if (perfilSeleccionado) {
            setValue('id_perfil_ruta', perfilSeleccionado.id.toString());
            console.log('Perfil seleccionado automáticamente:', perfilSeleccionado);
            
            // Crear texto descriptivo del perfil
            const dias = perfilSeleccionado.dias_semana?.join(', ') || 'N/A';
            const horario = `${perfilSeleccionado.hora_inicio || 'N/A'} - ${perfilSeleccionado.hora_fin || 'N/A'}`;
            const valor = perfilSeleccionado.valor ? `$${perfilSeleccionado.valor.toLocaleString()}` : 'N/A';
            const textoPerfil = `${dias} | ${horario} | ${valor}`;
            setPerfilSeleccionadoTexto(textoPerfil);
            
            // Guardar información de la selección
            const ahora = new Date();
            const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            setInfoSeleccion({
              dia: nombresDias[ahora.getDay()],
              hora: `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`,
              perfil: perfilSeleccionado
            });
          } else {
            const ahora = new Date();
            const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            setInfoSeleccion({
              dia: nombresDias[ahora.getDay()],
              hora: `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`,
              perfil: null
            });
            setPerfilSeleccionadoTexto('');
          }
        }
      } else {
        console.log('No se encontró ruta para la planilla');
        setPerfilesRuta([]);
      }
    } catch (error) {
      console.error('Error cargando perfiles de ruta:', error);
      setPerfilesRuta([]);
    }
  };

  // Función para seleccionar automáticamente el perfil basándose en día y hora actual
  const seleccionarPerfilAutomatico = (perfiles) => {
    const ahora = new Date();
    const diaSemana = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const horaActual = ahora.getHours();
    const minutosActual = ahora.getMinutes();
    const tiempoActual = horaActual * 60 + minutosActual; // Convertir a minutos
    
    const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    console.log(`Día actual: ${nombresDias[diaSemana]} (${diaSemana}), Hora actual: ${horaActual.toString().padStart(2, '0')}:${minutosActual.toString().padStart(2, '0')}`);
    
    // Buscar el perfil que coincida con el día y horario actual
    for (const perfil of perfiles) {
      console.log(`Evaluando perfil ${perfil.id}: Días ${perfil.dias_semana}, Horario ${perfil.hora_inicio}-${perfil.hora_fin}`);
      
      // Convertir los días del perfil al formato de JavaScript (0-6)
      // El perfil usa: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 7=Domingo
      // JavaScript usa: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
      const diasPerfil = perfil.dias_semana?.map(dia => {
        // Mapeo: 1->1, 2->2, 3->3, 4->4, 5->5, 6->6, 7->0
        return dia === 7 ? 0 : dia;
      });
      
      console.log(`Días del perfil convertidos: ${diasPerfil} (día actual: ${diaSemana})`);
      console.log(`¿Incluye el día actual? ${diasPerfil?.includes(diaSemana)}`);
      
      if (diasPerfil && diasPerfil.includes(diaSemana)) {
        // Verificar si la hora actual está dentro del rango del perfil
        const horaInicio = parseTimeToMinutes(perfil.hora_inicio);
        const horaFin = parseTimeToMinutes(perfil.hora_fin);
        
        if (horaInicio !== null && horaFin !== null) {
          console.log(`Comparando horarios: Actual ${tiempoActual}min (${horaActual}:${minutosActual}) vs Perfil ${horaInicio}min-${horaFin}min (${perfil.hora_inicio}-${perfil.hora_fin})`);
          
          // Manejar horarios que cruzan la medianoche
          if (horaFin < horaInicio) {
            // Horario que cruza la medianoche (ej: 22:00 a 06:00)
            if (tiempoActual >= horaInicio || tiempoActual <= horaFin) {
              console.log(`✅ Perfil ${perfil.id} seleccionado (horario nocturno)`);
              return perfil;
            } else {
              console.log(`❌ Perfil ${perfil.id} no coincide (horario nocturno)`);
            }
          } else {
            // Horario normal
            if (tiempoActual >= horaInicio && tiempoActual <= horaFin) {
              console.log(`✅ Perfil ${perfil.id} seleccionado (horario normal)`);
              return perfil;
            } else {
              console.log(`❌ Perfil ${perfil.id} no coincide (horario normal)`);
            }
          }
        } else {
          console.log(`❌ Perfil ${perfil.id} tiene horarios inválidos: ${perfil.hora_inicio} - ${perfil.hora_fin}`);
        }
      }
    }
    
    console.log(`❌ No se encontró un perfil válido para el día ${nombresDias[diaSemana]} a las ${horaActual.toString().padStart(2, '0')}:${minutosActual.toString().padStart(2, '0')}`);
    return null; // No se encontró un perfil válido
  };

  // Función auxiliar para convertir tiempo (HH:MM:SS) a minutos
  const parseTimeToMinutes = (timeString) => {
    if (!timeString) return null;
    
    console.log(`Parseando tiempo: "${timeString}"`);
    
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const totalMinutes = hours * 60 + minutes;
        console.log(`Tiempo convertido: ${hours}:${minutes} = ${totalMinutes} minutos`);
        return totalMinutes;
      }
    }
    console.log(`No se pudo parsear el tiempo: "${timeString}"`);
    return null;
  };

  // Auto-completar valor unitario cuando se selecciona un perfil de ruta
  useEffect(() => {
    if (perfilRutaSeleccionado) {
      const perfil = perfilesRuta.find(p => p.id.toString() === perfilRutaSeleccionado);
      if (perfil?.valor) {
        setValue('valor_unitario', perfil.valor);
        // También calcular el total automáticamente
        const numAsientos = watch('num_asientos') || 1;
        const total = perfil.valor * numAsientos;
        setValue('total', total);
      }
    }
  }, [perfilRutaSeleccionado, perfilesRuta, setValue, watch]);

  useEffect(() => {
    if (numAsientos && valorUnitario) {
      const total = parseFloat(numAsientos) * parseFloat(valorUnitario);
      if (!isNaN(total)) {
        setValue('total', total);
      }
    }
  }, [numAsientos, valorUnitario, setValue]);

  const onSubmitForm = (data) => {
    // Validar que la planilla no esté cerrada o anulada
    if (planillaNoDisponible) {
      alert('No se pueden crear tiquetes para planillas cerradas o anuladas.');
      return;
    }

    // Calcular total si no está definido
    if (!data.total && data.num_asientos && data.valor_unitario) {
      data.total = parseFloat(data.num_asientos) * parseFloat(data.valor_unitario);
    }

    // Transformar los datos para que coincidan con el backend
    const transformedData = {
      ...data,
      id_tipo_documento: parseInt(data.id_tipo_documento),
      id_planilla: parseInt(data.id_planilla),
      id_perfil_ruta: parseInt(data.id_perfil_ruta),
      id_vendedor: parseInt(data.id_vendedor),
      num_asientos: parseInt(data.num_asientos),
      valor_unitario: parseFloat(data.valor_unitario) || 0,
      total: parseFloat(data.total) || 0
    };

    onSubmit(transformedData);
    reset();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {tiquete ? 'Editar Tiquete' : 'Nuevo Tiquete'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Formulario */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando datos...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    {...register('id_tipo_documento', {
                      required: 'El tipo de documento es requerido'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione un tipo</option>
                    {Array.isArray(tiposDocumento) && tiposDocumento.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre_tipo_documento}
                      </option>
                    ))}
                  </select>
                  {errors.id_tipo_documento && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_tipo_documento.message}</p>
                  )}
                </div>

                {/* Número de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    {...register('numero_documento', {
                      required: 'El número de documento es requerido',
                      maxLength: { value: 20, message: 'Máximo 20 caracteres' }
                    })}
                    className="input-field"
                    placeholder="12345678"
                  />
                  {errors.numero_documento && (
                    <p className="mt-1 text-sm text-red-600">{errors.numero_documento.message}</p>
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Pasajero *
                  </label>
                  <input
                    type="text"
                    {...register('nombre', {
                      required: 'El nombre es requerido',
                      maxLength: { value: 200, message: 'Máximo 200 caracteres' }
                    })}
                    className="input-field"
                    placeholder="Juan Pérez"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    {...register('correo', {
                      required: 'El correo es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo electrónico inválido'
                      }
                    })}
                    className="input-field"
                    placeholder="juan@ejemplo.com"
                  />
                  {errors.correo && (
                    <p className="mt-1 text-sm text-red-600">{errors.correo.message}</p>
                  )}
                </div>

                {/* Número de Asientos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Asientos *
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('num_asientos', {
                      required: 'El número de asientos es requerido',
                      min: { value: 1, message: 'Mínimo 1 asiento' }
                    })}
                    className="input-field"
                    placeholder="1"
                  />
                  {errors.num_asientos && (
                    <p className="mt-1 text-sm text-red-600">{errors.num_asientos.message}</p>
                  )}
                </div>

                                 {/* Planilla */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Planilla *
                   </label>
                   <select
                     {...register('id_planilla', {
                       required: 'La planilla es requerida'
                     })}
                     className="input-field"
                   >
                     <option value="">Seleccione una planilla</option>
                     {Array.isArray(planillas) && planillas.map((planilla) => {
                       const origen = planilla.ruta?.ciudad_origen?.nombre || 'N/A';
                       const destino = planilla.ruta?.ciudad_destino?.nombre || 'N/A';
                       const estadoTexto = planilla.estado === 1 ? 'Abierta' : 
                                          planilla.estado === 2 ? 'En venta' : 
                                          planilla.estado === 3 ? 'Cerrada' : 
                                          planilla.estado === 4 ? 'Anulada' : 'Desconocido';
                       return (
                         <option key={planilla.id} value={planilla.id}>
                           {planilla.prefijo}-{planilla.num_planilla} - {origen} → {destino} ({estadoTexto})
                         </option>
                       );
                     })}
                   </select>
                   {errors.id_planilla && (
                     <p className="mt-1 text-sm text-red-600">{errors.id_planilla.message}</p>
                   )}
                   
                   {/* Mensaje de error si la planilla está cerrada o anulada */}
                   {planillaNoDisponible && (
                     <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                       <div className="flex">
                         <div className="flex-shrink-0">
                           <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                           </svg>
                         </div>
                         <div className="ml-3">
                           <h3 className="text-sm font-medium text-red-800">
                             No se pueden crear tiquetes
                           </h3>
                           <div className="mt-2 text-sm text-red-700">
                             {planillaCerrada && (
                               <p>La planilla seleccionada está <strong>cerrada</strong>. No se pueden crear nuevos tiquetes.</p>
                             )}
                             {planillaAnulada && (
                               <p>La planilla seleccionada está <strong>anulada</strong>. No se pueden crear nuevos tiquetes.</p>
                             )}
                           </div>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>

                                                {/* Perfil de Ruta - OCULTO */}
                <div className="hidden">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perfil de Ruta * (Automático)
                  </label>
                  <input
                    type="text"
                    {...register('id_perfil_ruta', {
                      required: 'El perfil de ruta es requerido'
                    })}
                    className="input-field bg-gray-50"
                    value={perfilRutaSeleccionado ? perfilSeleccionadoTexto : ''}
                    placeholder={planillaSeleccionada ? 'Buscando perfil automáticamente...' : 'Primero seleccione una planilla'}
                    readOnly
                    disabled={!planillaSeleccionada}
                  />
                  {errors.id_perfil_ruta && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_perfil_ruta.message}</p>
                  )}
                  
                  {/* Mensajes informativos */}
                  {planillaSeleccionada && perfilesRuta.length === 0 && (
                    <p className="mt-1 text-sm text-yellow-600">
                      No hay perfiles de ruta disponibles para esta planilla. Verifique que la ruta tenga perfiles configurados.
                    </p>
                  )}
                  
                  {planillaSeleccionada && perfilesRuta.length > 0 && !perfilRutaSeleccionado && (
                    <p className="mt-1 text-sm text-orange-600">
                      ⚠️ No hay un perfil válido para el día y hora actual
                    </p>
                  )}
                  
                  {planillaSeleccionada && perfilesRuta.length > 0 && perfilRutaSeleccionado && (
                    <p className="mt-1 text-sm text-green-600">
                      ✅ Perfil encontrado
                    </p>
                  )}
                </div>

                {/* Vendedor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendedor *
                  </label>
                  <select
                    {...register('id_vendedor', {
                      required: 'El vendedor es requerido'
                    })}
                    className="input-field"
                  >
                    <option value="">Seleccione un vendedor</option>
                    {Array.isArray(vendedores) && vendedores.map((vendedor) => (
                      <option key={vendedor.id} value={vendedor.id}>
                        {vendedor.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.id_vendedor && (
                    <p className="mt-1 text-sm text-red-600">{errors.id_vendedor.message}</p>
                  )}
                </div>

                {/* Valor Unitario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Unitario * (Automático)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('valor_unitario', {
                      required: 'El valor unitario es requerido',
                      min: { value: 0, message: 'El valor debe ser mayor o igual a 0' }
                    })}
                    className="input-field bg-green-50 border-green-300"
                    placeholder="Seleccione una planilla..."
                    readOnly
                  />
                  {errors.valor_unitario && (
                    <p className="mt-1 text-sm text-red-600">{errors.valor_unitario.message}</p>
                  )}
                  {perfilRutaSeleccionado ? (
                    <p className="mt-1 text-xs text-green-600">
                      ✅ Valor automático del perfil de ruta seleccionado
                    </p>
                  ) : planillaSeleccionada ? (
                    <p className="mt-1 text-xs text-orange-600">
                      ⏳ Esperando selección automática del perfil...
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Seleccione una planilla para obtener el valor automáticamente
                    </p>
                  )}
                </div>

                {/* Total */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('total', {
                      required: 'El total es requerido',
                      min: { value: 0, message: 'El total debe ser mayor o igual a 0' }
                    })}
                    className="input-field"
                    placeholder="0.00"
                    readOnly
                  />
                  {errors.total && (
                    <p className="mt-1 text-sm text-red-600">{errors.total.message}</p>
                  )}
                </div>
              </div>

                             {/* Botones */}
               <div className="flex justify-end space-x-3 pt-4">
                 <button
                   type="button"
                   onClick={handleCancel}
                   className="btn-secondary"
                 >
                   Cancelar
                 </button>
                 <button
                   type="submit"
                   className={`btn-primary ${planillaNoDisponible ? 'opacity-50 cursor-not-allowed' : ''}`}
                   disabled={planillaNoDisponible}
                 >
                   {tiquete ? 'Actualizar' : 'Crear'}
                 </button>
               </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TiqueteForm;
