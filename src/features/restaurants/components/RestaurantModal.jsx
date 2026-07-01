import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveRestaurant } from "../hooks/UseSaveRestaurant.jsx";
import { useRestaurantStore } from "../store/useRestaurantStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { ImageOff, Info } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const RestaurantModal = ({ isOpen, onClose, restaurant }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const { saveRestaurant } = useSaveRestaurant();
    const [preview, setPreview] = useState(null);
    const loading = useRestaurantStore((state) => state.loading);

    const photoFile = watch("photo");
    const selectedStatus = watch("status");
    const isInactiveStatus = selectedStatus === "Cerrado" || selectedStatus === "En Mantenimiento";

    useEffect(() => {
        if (isOpen) {
            if (restaurant) {
                reset({
                    name: restaurant.name,
                    city: restaurant.city || "Guatemala",
                    address: restaurant.address,
                    categories: restaurant.categories,
                    description: restaurant.description,
                    openingTime: restaurant.openingTime,
                    closingTime: restaurant.closingTime,
                    averagePrice: restaurant.averagePrice,
                    phone: restaurant.phone,
                    status: restaurant.status,
                    capacity: restaurant.capacity,
                    rating: restaurant.rating,
                });
                setPreview(restaurant.photo);
            } else {
                reset({
                    name: "",
                    city: "Guatemala",
                    address: "",
                    categories: "",
                    description: "",
                    openingTime: "",
                    closingTime: "",
                    averagePrice: "",
                    phone: "",
                    status: "Abierto",
                    capacity: "",
                    rating: "",
                    photo: null,
                });
                setPreview(null);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (photoFile && photoFile.length > 0) {
            const file = photoFile[0];
            setPreview(URL.createObjectURL(file));
        }
    }, [photoFile]);

    const onSubmit = async (data) => {
        await saveRestaurant(data, restaurant?._id);
        reset();
        setPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            {/* CONTENEDOR */}
            <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* HEADER */}
                <div className="p-4 sm:p-5 text-white sticky top-0 z-10 bg-[linear-gradient(90deg,var(--color-brand-dark)_0%,var(--color-brand-red-dark)_100%)]">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {restaurant ? "Editar Restaurante" : "Nuevo Restaurante"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        Completa la información del restaurante
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 sm:p-6 space-y-5 overflow-y-auto"
                >
                    {/* PREVIEW */}
                    <div className="flex justify-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-[var(--bg-base)] border flex items-center justify-center overflow-hidden shadow-inner">
                            {preview ? (
                                <img
                                    src={preview}
                                    className="w-full object-cover"
                                    alt="preview"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                                    <LucideMotionIcon icon={ImageOff} className="!w-5 !h-5 md:!w-6 md:!h-6 hover:translate-y-0 hover:scale-100 text-[var(--text-muted)] dark:text-[var(--text-muted)]" />
                                    <span className="text-xs sm:text-sm">Sin imagen</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* INPUTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Nombre */}
                        <div className="flex flex-col md:col-span-1">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Nombre del restaurante
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Ej. La Buena Mesa"
                                {...register("name", {
                                    required: "El nombre es obligatorio",
                                    minLength: {
                                        value: 2,
                                        message: "Debe tener al menos 2 caracteres",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "No puede superar los 100 caracteres",
                                    },
                                })}
                            />
                            {errors.name && (
                                <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Ciudad */}
                        <div className="flex flex-col md:col-span-1">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Ciudad
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Ej. Guatemala"
                                {...register("city", {
                                    required: "La ciudad es obligatoria",
                                })}
                            />
                            {errors.city && (
                                <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                            )}
                        </div>

                        {/* Dirección */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Dirección
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Ej. 5a Avenida, Zona 1"
                                {...register("address", {
                                    required: "La dirección es obligatoria",
                                    minLength: {
                                        value: 5,
                                        message: "La dirección debe tener entre 5 y 100 caracteres"
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "La dirección debe tener entre 5 y 100 caracteres"
                                    }
                                })}
                            />
                            {errors.address && (
                                <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        {/* Categoría */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Categoría
                            </label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                {...register("categories", {
                                    required: "La categoría es obligatoria",
                                })}
                            >
                                <option value="">Seleccione una categoría</option>
                                <option value="Gourmet">Gourmet</option>
                                <option value="Casual">Casual</option>
                            </select>
                            {errors.categories && (
                                <p className="text-red-600 text-xs mt-1">{errors.categories.message}</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Estado
                            </label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                {...register("status", {
                                    required: "El estado es obligatorio",
                                })}
                            >
                                <option value="">Seleccione un estado</option>
                                <option value="Abierto">Abierto</option>
                                <option value="Cerrado">Cerrado</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>
                            )}
                            <div className="mt-2 rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-muted)]">
                                <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-semibold ${isInactiveStatus ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                                    <LucideMotionIcon
                                        icon={Info}
                                        className={isInactiveStatus ? "!w-4 !h-4 md:!w-5 md:!h-5 text-red-700 dark:text-[var(--color-brand-yellow)]" : "!w-4 !h-4 md:!w-5 md:!h-5 text-green-700 dark:text-[var(--color-brand-yellow)]"}
                                    />
                                    {isInactiveStatus ? "Inactivo" : "Activo"}
                                </span>
                                <p className="mt-2">
                                    {isInactiveStatus
                                        ? "Al guardar, el restaurante quedará inactivo y se mostrará como cerrado o en mantenimiento."
                                        : "Al guardar, el restaurante permanecerá activo."}
                                </p>
                            </div>
                        </div>

                        {/* Hora de apertura */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Hora de apertura
                            </label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                {...register("openingTime", {
                                    required: "La hora de apertura es obligatoria",
                                })}
                            />
                            {errors.openingTime && (
                                <p className="text-red-600 text-xs mt-1">{errors.openingTime.message}</p>
                            )}
                        </div>

                        {/* Hora de cierre */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Hora de cierre
                            </label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                {...register("closingTime", {
                                    required: "La hora de cierre es obligatoria",
                                })}
                            />
                            {errors.closingTime && (
                                <p className="text-red-600 text-xs mt-1">{errors.closingTime.message}</p>
                            )}
                        </div>

                        {/* Precio promedio */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Precio promedio (Q)
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Ej. 150"
                                {...register("averagePrice", {
                                    required: "El precio promedio es obligatorio",
                                    min: { value: 0, message: "No puede ser negativo" },
                                })}
                            />
                            {errors.averagePrice && (
                                <p className="text-red-600 text-xs mt-1">{errors.averagePrice.message}</p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Ej. 22345678"
                                {...register("phone", {
                                    required: "El teléfono es obligatorio",
                                    pattern: {
                                        value: /^[0-9]{8,15}$/,
                                        message: "Ingrese un número válido (8-15 dígitos)",
                                    },
                                })}
                            />
                            {errors.phone && (
                                <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Capacidad */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Capacidad (personas)
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Ej. 50"
                                {...register("capacity", {
                                    required: "La capacidad es obligatoria",
                                    min: { value: 1, message: "Debe ser al menos 1" },
                                })}
                            />
                            {errors.capacity && (
                                <p className="text-red-600 text-xs mt-1">{errors.capacity.message}</p>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Rating (1-5)
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Ej. 4"
                                {...register("rating", {
                                    required: "El rating es obligatorio",
                                    min: { value: 1, message: "El mínimo es 1" },
                                    max: { value: 5, message: "El máximo es 5" },
                                })}
                            />
                            {errors.rating && (
                                <p className="text-red-600 text-xs mt-1">{errors.rating.message}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Descripción
                            </label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm 
                                           focus:outline-none focus:border-[var(--color-brand-dark)] focus:ring-2 focus:ring-[var(--color-brand-dark)] transition"
                                placeholder="Detalles del restaurante..."
                                rows={3}
                                {...register("description", {
                                    maxLength: {
                                        value: 500,
                                        message: "No puede superar los 500 caracteres",
                                    },
                                })}
                            />
                            {errors.description && (
                                <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Imagen */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                Imagen del restaurante
                            </label>
                            <input
                                type="file"
                                className="w-full px-3 py-2 rounded-lg border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-base)] 
                                           hover:border-[var(--color-brand-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-dark)] transition cursor-pointer text-[var(--text-primary)]"
                                accept="image/*"
                                {...register("photo")}
                            />
                        </div>
                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
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
                            {loading ? <Spinner /> : restaurant ? "Guardar Cambios" : "Crear Restaurante"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};