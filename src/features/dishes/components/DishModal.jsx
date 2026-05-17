import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSaveDish } from "../hooks/useSaveDish";
import { useDishStore } from "../store/useDishStore";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js"; 
import { useInventoryStore } from "../../inventories/store/useInventoryStore.js"; 
import { showError } from "../../../shared/utils/toast.js"; // Para alertar la falta de ingredientes

export const DishModal = ({ isOpen, onClose, dish }) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            restaurant: "",
            ingredients: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients",
    });

    const { saveDish } = useSaveDish();
    const loading = useDishStore((state) => state.loading);
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { inventories, getInventories } = useInventoryStore(); 

    // 👁️ Observamos en tiempo real qué restaurante está seleccionado
    const selectedRestaurant = watch("restaurant");

    useEffect(() => {
        if (isOpen) {
            if (getRestaurants) getRestaurants();
            if (getInventories) getInventories();
        }
    }, [isOpen, getRestaurants, getInventories]);

    useEffect(() => {
        if (isOpen) {
            if (dish) {
                reset({
                    name: dish.name || "",
                    description: dish.description || "",
                    price: dish.price || 0,
                    dishType: dish.dishType || "PLATO_FUERTE",
                    restaurant: dish.restaurant?._id || dish.restaurant || "",
                    ingredients: dish.ingredients?.map(ing => ({
                        inventoryItem: ing.inventoryItem?._id || ing.inventoryItem || "",
                        quantityUsed: ing.quantityUsed || ""
                    })) || []
                });
            } else {
                reset({
                    name: "",
                    description: "",
                    price: "",
                    dishType: "PLATO_FUERTE",
                    restaurant: "",
                    ingredients: [] 
                });
            }
        }
    }, [isOpen, dish, reset]);

    // 🛠️ Filtramos los insumos del inventario que pertenecen al restaurante seleccionado
    // Soporta si tu backend lo llama "restaurant", "restaurantId" o "restaurant._id"
    const filteredInventories = inventories?.filter(item => {
        const itemRestId = item.restaurant?._id || item.restaurant || item.restaurantId;
        return String(itemRestId) === String(selectedRestaurant);
    }) || [];

    const onSubmit = async (data) => {
        // 🚨 Validación: Debe llevar por lo menos 1 ingrediente obligatoriamente
        if (!data.ingredients || data.ingredients.length === 0) {
            showError("¡Error! Debes agregar por lo menos 1 ingrediente para poder guardar el platillo.");
            return;
        }

        try {
            await saveDish(data, dish?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border-b border-[var(--border-color)] sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {dish ? "Editar Platillo" : "Nuevo Platillo"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        Configura las propiedades, precio e ingredientes asociados al inventario de la sucursal
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 sm:p-6 space-y-5 overflow-y-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Restaurante Select (Lo subimos de posición para flujo lógico) */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">1. Selecciona el Restaurante / Sucursal</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("restaurant", { required: "El restaurante es obligatorio" })}
                                onChange={(e) => {
                                    // Al cambiar de restaurante, limpiamos los ingredientes anteriores para evitar cruces de sucursales
                                    reset({ ...watch(), restaurant: e.target.value, ingredients: [] });
                                }}
                            >
                                <option value="">Selecciona una sucursal...</option>
                                {restaurants?.map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                            {errors.restaurant && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.restaurant.message}</p>}
                        </div>

                        {/* Nombre del Platillo */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Nombre del Platillo</label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. Hamburguesa Doble"
                                {...register("name", { required: "El nombre es obligatorio", maxLength: 50 })}
                            />
                            {errors.name && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Precio */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Precio (Q)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="0.00"
                                {...register("price", { required: "El precio es obligatorio", min: 0 })}
                            />
                            {errors.price && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        {/* Tipo */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Categoría / Tipo del Platillo</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("dishType", { required: "El tipo es obligatorio" })}
                            >
                                <option value="ENTRADA">Entrada</option>
                                <option value="PLATO_FUERTE">Plato Fuerte</option>
                                <option value="POSTRE">Postre</option>
                                <option value="BEBIDA">Bebida</option>
                            </select>
                        </div>

                        {/* SECCIÓN DINÁMICA DE INGREDIENTES FILTRADOS */}
                        <div className="flex flex-col md:col-span-2 border-t border-b border-[var(--border-color)] py-4 my-1">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                                        Ingredientes
                                    </h3>
                                    {!selectedRestaurant && (
                                        <p className="text-[var(--color-brand-red)] text-xs font-semibold mt-0.5">
                                            ⚠️ Selecciona una sucursal arriba para poder cargar los insumos correspondientes.
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    disabled={!selectedRestaurant}
                                    onClick={() => append({ inventoryItem: "", quantityUsed: "" })}
                                    className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    + Añadir Ingrediente
                                </button>
                            </div>

                            {fields.length === 0 && (
                                <p className="text-xs text-[var(--text-muted)] italic py-2 text-center bg-[var(--bg-surface-alt)] rounded-lg border border-dashed border-[var(--border-color)]">
                                    Ningún ingrediente asignado. Se requiere mínimo 1 para registrar el platillo.
                                </p>
                            )}

                            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3 bg-[var(--bg-surface-alt)] p-2 rounded-lg border border-[var(--border-color)]">
                                        
                                        {/* Select de Item de Inventario de la Sucursal */}
                                        <div className="flex-1">
                                            <select
                                                className="w-full px-2 py-1.5 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                                {...register(`ingredients.${index}.inventoryItem`, { required: "Requerido" })}
                                            >
                                                <option value="">Seleccionar ingrediente</option>
                                                {filteredInventories.map((item) => (
                                                    <option key={item._id} value={item._id}>
                                                        {item.name || item.itemName || "Ingrediente sin nombre"} 
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Cantidad consumida */}
                                        <div className="w-24 sm:w-32">
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Cantidad"
                                                className="w-full px-2 py-1.5 text-sm rounded-md border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                                                {...register(`ingredients.${index}.quantityUsed`, { required: "Requerido", min: 0.001 })}
                                            />
                                        </div>

                                        {/* Botón de Remover */}
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-sm p-1.5 text-[var(--color-brand-red)] hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Foto */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Fotografía del Platillo</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-[var(--text-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--bg-surface-alt)] file:text-[var(--text-primary)] hover:file:opacity-80 cursor-pointer"
                                {...register("photo")}
                            />
                        </div>

                        {/* Descripción */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Descripción Detallada</label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition min-h-[60px]"
                                placeholder="Escribe los detalles o presentación del platillo..."
                                {...register("description", { required: "La descripción es obligatoria", maxLength: 500 })}
                            />
                            {errors.description && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.description.message}</p>}
                        </div>
                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--bg-surface-alt)] text-[var(--text-primary)] hover:opacity-80 transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : dish ? "Guardar Cambios" : "Crear Platillo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};