import React from "react";
import { useForm } from "react-hook-form";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PerfilRutaForm = ({ perfil, ruta, onClose, onSubmit }) => {
  const diasSemana = [
    { id: 1, nombre: "Lunes" },
    { id: 2, nombre: "Martes" },
    { id: 3, nombre: "Miércoles" },
    { id: 4, nombre: "Jueves" },
    { id: 5, nombre: "Viernes" },
    { id: 6, nombre: "Sábado" },
    { id: 7, nombre: "Domingo" },
  ];

  // Función para formatear hora a formato HH:MM
  const formatTime = (timeString) => {
    if (!timeString) return "";
    // Si ya está en formato HH:MM, retornarlo
    if (typeof timeString === "string" && timeString.includes(":")) {
      return timeString;
    }
    // Si es un objeto Time, convertirlo
    if (timeString && typeof timeString === "object") {
      const hours = timeString.hours?.toString().padStart(2, "0") || "00";
      const minutes = timeString.minutes?.toString().padStart(2, "0") || "00";
      return `${hours}:${minutes}`;
    }
    return "";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: perfil
      ? {
          id_ruta: perfil.id_ruta?.toString() || ruta?.id?.toString() || "",
          dias_semana: perfil.dias_semana || [],
          hora_inicio: formatTime(perfil.hora_inicio) || "",
          hora_fin: formatTime(perfil.hora_fin) || "",
          valor: perfil.valor || "",
          activo: perfil.activo !== undefined ? perfil.activo : true,
        }
      : {
          id_ruta: ruta?.id?.toString() || "",
          dias_semana: [],
          hora_inicio: "",
          hora_fin: "",
          valor: "",
          activo: true,
        },
  });

  const onSubmitForm = (data) => {
    // Validar formato de horas
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!timeRegex.test(data.hora_inicio)) {
      alert("La hora de inicio debe estar en formato HH:MM (24 horas)");
      return;
    }

    if (!timeRegex.test(data.hora_fin)) {
      alert("La hora de fin debe estar en formato HH:MM (24 horas)");
      return;
    }

    // Transformar los datos para que coincidan con el backend
    const transformedData = {
      ...data,
      id_ruta: parseInt(data.id_ruta),
      dias_semana: data.dias_semana.map((dia) => parseInt(dia)),
      valor: parseFloat(data.valor),
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
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{perfil ? "Editar Perfil" : "Nuevo Perfil"}</h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            {/* Ruta (solo mostrar si no hay ruta específica) */}
            {!ruta && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ruta *</label>
                <select
                  {...register("id_ruta", {
                    required: "La ruta es requerida",
                  })}
                  className="input-field"
                >
                  <option value="">Seleccione una ruta</option>
                  {/* Aquí se cargarían las rutas disponibles */}
                </select>
                {errors.id_ruta && <p className="mt-1 text-sm text-red-600">{errors.id_ruta.message}</p>}
              </div>
            )}

            {/* Días de la Semana */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Días de la Semana *</label>
              <div className="space-y-2">
                {diasSemana.map((dia) => (
                  <label key={dia.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={dia.id}
                      {...register("dias_semana", {
                        required: "Seleccione al menos un día",
                      })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{dia.nombre}</span>
                  </label>
                ))}
              </div>
              {errors.dias_semana && <p className="mt-1 text-sm text-red-600">{errors.dias_semana.message}</p>}
            </div>

            {/* Hora de Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Inicio * (formato 24h)</label>
              <p className="text-xs text-gray-500 mb-2">Ejemplo: 14:30 para 2:30 PM</p>
              <input
                type="text"
                {...register("hora_inicio", {
                  required: "La hora de inicio es requerida",
                  pattern: {
                    value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    message: "Formato inválido. Use HH:MM (24 horas)",
                  },
                })}
                className="input-field"
                placeholder="HH:MM"
                style={{
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
                maxLength="5"
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + ":" + value.substring(2, 4);
                  }
                  e.target.value = value;
                }}
                onKeyDown={(e) => {
                  // Solo permitir números, backspace, delete, tab, escape, enter
                  if (
                    ![8, 9, 27, 13, 46].includes(e.keyCode) &&
                    !(e.keyCode >= 48 && e.keyCode <= 57) &&
                    !(e.keyCode >= 96 && e.keyCode <= 105)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.hora_inicio && <p className="mt-1 text-sm text-red-600">{errors.hora_inicio.message}</p>}
            </div>

            {/* Hora de Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Fin * (formato 24h)</label>
              <p className="text-xs text-gray-500 mb-2">Ejemplo: 16:45 para 4:45 PM</p>
              <input
                type="text"
                {...register("hora_fin", {
                  required: "La hora de fin es requerida",
                  pattern: {
                    value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    message: "Formato inválido. Use HH:MM (24 horas)",
                  },
                  validate: (value) => {
                    const horaInicio = watch("hora_inicio");
                    if (horaInicio && value && horaInicio >= value) {
                      return "La hora de fin debe ser posterior a la hora de inicio";
                    }
                    return true;
                  },
                })}
                className="input-field"
                placeholder="HH:MM"
                style={{
                  fontFamily: "monospace",
                  textAlign: "center",
                }}
                maxLength="5"
                onInput={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + ":" + value.substring(2, 4);
                  }
                  e.target.value = value;
                }}
                onKeyDown={(e) => {
                  // Solo permitir números, backspace, delete, tab, escape, enter
                  if (
                    ![8, 9, 27, 13, 46].includes(e.keyCode) &&
                    !(e.keyCode >= 48 && e.keyCode <= 57) &&
                    !(e.keyCode >= 96 && e.keyCode <= 105)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.hora_fin && <p className="mt-1 text-sm text-red-600">{errors.hora_fin.message}</p>}
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor del Pasaje *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("valor", {
                  required: "El valor es requerido",
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor a 0",
                  },
                })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.valor && <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>}
            </div>

            {/* Estado */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("activo")}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Activo</span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                {perfil ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilRutaForm;
