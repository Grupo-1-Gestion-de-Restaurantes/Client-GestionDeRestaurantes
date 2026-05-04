import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveDish } from "../hooks/useSaveDish";
import { useDishStore } from "../store/useDishStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const DishModal = ({ isOpen, onClose, dish }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const { saveDish } = useSaveDish();
  const [preview, setPreview] = useState(null);
  const loading = useDishStore((state) => state.loading);

  const photoFile = watch("photo");

  useEffect(() => {
    if (isOpen) {
      if (dish) {
        reset({
          name: dish.name,
          description: dish.description,
          price: dish.price,
          dishType: dish.dishType,
          restaurant: dish.restaurant?._id || dish.restaurant || "",
        });
        setPreview(dish.photo);
      } else {
        reset({
          name: "",
          description: "",
          price: "",
          dishType: "",
          restaurant: "",
          photo: null,
        });
        setPreview(null);
      }
    }
  }, [isOpen, dish, reset]);

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [photoFile]);

  const onSubmit = async (data) => {
    try {
      await saveDish(data, dish?._id);
      reset();
      setPreview(null);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
        <div className="p-4 sm:p-5 bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border-b border-[var(--border-color)] sticky top-0 z-10 transition-colors duration-300">
          <h2 className="text-xl sm:text-2xl font-bold">
            {dish ? "Editar Platillo" : "Nuevo Platillo"}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Completa la información del platillo
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 space-y-5 overflow-y-auto"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden shadow-inner">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[var(--text-muted)] text-xs sm:text-sm">
                  Sin imagen
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                Nombre del Platillo
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                placeholder="Ej. Hamburguesa Clásica"
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                  maxLength: { value: 50, message: "Máximo 50 caracteres" },
                })}
              />
              {errors.name && (
                <p className="text-[var(--color-brand-red)] text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                Tipo de Platillo
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                {...register("dishType", {
                  required: "El tipo es obligatorio",
                })}
              >
                <option value="">Seleccione un tipo</option>
                <option value="ENTRADA">Entrada</option>
                <option value="PLATO_FUERTE">Plato Fuerte</option>
                <option value="POSTRE">Postre</option>
                <option value="BEBIDA">Bebida</option>
              </select>
              {errors.dishType && (
                <p className="text-[var(--color-brand-red)] text-xs mt-1">
                  {errors.dishType.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                placeholder="Ej. 75.00"
                {...register("price", {
                  required: "El precio es obligatorio",
                  min: { value: 0, message: "No puede ser negativo" },
                })}
              />
              {errors.price && (
                <p className="text-[var(--color-brand-red)] text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                ID Restaurante
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                placeholder="Ej. 65a4ebb..."
                {...register("restaurant", {
                  required: "El restaurante es obligatorio",
                })}
              />
              {errors.restaurant && (
                <p className="text-[var(--color-brand-red)] text-xs mt-1">
                  {errors.restaurant.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1 flex justify-between">
                Ingredientes (Inventario)
                <span className="text-[var(--text-muted)] text-[10px]">
                  Próximamente
                </span>
              </label>
              <select
                disabled
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] focus:outline-none transition cursor-not-allowed opacity-70"
              >
                <option value="">Sin ingredientes en BD</option>
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                Descripción
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                placeholder="Ingredientes y detalles..."
                {...register("description", {
                  required: "La descripción es obligatoria",
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
              />
              {errors.description && (
                <p className="text-[var(--color-brand-red)] text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                Imagen del platillo
              </label>
              <input
                type="file"
                className="w-full px-3 py-2 rounded-lg border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] hover:border-[var(--ring-color)] focus:outline-none focus:border-[var(--ring-color)] transition cursor-pointer"
                accept="image/*"
                {...register("photo")}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--bg-surface-alt)] text-[var(--text-primary)] hover:opacity-80 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
            >
              {loading ? (
                <Spinner />
              ) : dish ? (
                "Guardar Cambios"
              ) : (
                "Crear Platillo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
