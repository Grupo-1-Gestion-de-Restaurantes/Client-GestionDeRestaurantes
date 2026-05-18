import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveInventory } from "../hooks/useSaveInventory.jsx";
import { useInventoryStore } from "../store/useInventoryStore";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";

export const InventoryModal = ({ isOpen, onClose, item }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { saveInventory } = useSaveInventory();
    const loading = useInventoryStore((state) => state.loading);
    const { restaurants, getRestaurants } = useRestaurantStore();

    useEffect(() => {
        if (isOpen && getRestaurants) {
            getRestaurants();
        }
    }, [isOpen, getRestaurants]);

    useEffect(() => {
        if (isOpen) {
            if (item) {
                reset({
                    name: item.name || "",
                    quantity: item.quantity ?? 0,
                    unit: item.unit || "UNIDAD",
                    minStock: item.minStock ?? 5,
                    restaurant: item.restaurant?._id || item.restaurant || "",
                });
            } else {
                reset({
                    name: "",
                    quantity: "",
                    unit: "UNIDAD",
                    minStock: 5,
                    restaurant: "",
                });
            }
        }
    }, [isOpen, item, reset]);

    const onSubmit = async (data) => {
        try {
            await saveInventory(data, item?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border-color)] transition-colors duration-300">
                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[linear-gradient(90deg,var(--main-blue)_0%,#1956a3_100%)] text-white border-b border-[var(--border-color)] rounded-t-2xl transition-colors duration-300">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {item ? "Editar Ingrediente" : "Nuevo Ingrediente de Almacén"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        Administra el abastecimiento y stock crítico de materias primas
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4">
                    {/* Nombre del Ingrediente */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Nombre de la Materia Prima</label>
                        <input
                            className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                            placeholder="Ej. Tomates frescos, Queso Mozzarella"
                            {...register("name", { required: "El nombre es obligatorio", maxLength: { value: 100, message: "Máximo 100 caracteres" } })}
                        />
                        {errors.name && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Restaurante Desplegable */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Sucursal / Restaurante Destino</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                            {...register("restaurant", { required: "El restaurante es obligatorio" })}
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Cantidad */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Stock Actual</label>
                            <input
                                type="number"
                                step="any"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="0"
                                {...register("quantity", { required: "Requerido", valueAsNumber: true, min: { value: 0, message: "Mínimo 0" } })}
                            />
                            {errors.quantity && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.quantity.message}</p>}
                        </div>

                        {/* Unidad Select (Enum de tu Mongoose) */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Unidad Medida</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("unit", { required: "Obligatorio" })}
                            >
                                <option value="UNIDAD">Unidades</option>
                                <option value="KG">Kilogramos (Kg)</option>
                                <option value="GRAMO">Gramos (g)</option>
                                <option value="LITRO">Litros (L)</option>
                                <option value="MILILITRO">Mililitros (mL)</option>
                            </select>
                        </div>

                        {/* Stock Mínimo (Alerta) */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Stock Mínimo</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("minStock", { required: "Requerido", valueAsNumber: true, min: { value: 1, message: "Mínimo 1" } })}
                            />
                            {errors.minStock && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.minStock.message}</p>}
                        </div>
                    </div>

                    {/* BOTONES */}
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
                            disabled={loading}
                            className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : item ? "Guardar Cambios" : "Crear Ingrediente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};