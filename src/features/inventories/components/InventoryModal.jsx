import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveInventory } from "../hooks/useSaveInventory";
import { useInventoryStore } from "../store/useInventoryStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const InventoryModal = ({ isOpen, onClose, inventory }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { saveInventory } = useSaveInventory();
    const loading = useInventoryStore((state) => state.loading);

    useEffect(() => {
        if (isOpen) {
            if (inventory) {
                reset({
                    name: inventory.name,
                    quantity: inventory.quantity,
                    unit: inventory.unit,
                    minStock: inventory.minStock,
                    restaurant: inventory.restaurant?._id || inventory.restaurant,
                    isActive: inventory.isActive,
                });
            } else {
                reset({
                    name: "",
                    quantity: 0,
                    unit: "UNIDAD",
                    minStock: 5,
                    restaurant: "",
                    isActive: true,
                });
            }
        }
    }, [isOpen, inventory, reset]);

    const onSubmit = async (data) => {
        try {
            await saveInventory(data, inventory?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)]">

                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[var(--bg-surface-alt)] border-b border-[var(--border-color)]">
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                        {inventory ? "Editar Inventario" : "Nuevo Item"}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                        Gestiona los productos del inventario
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-5 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* NAME */}
                        <div className="flex flex-col">
                            <label className="label">Nombre</label>
                            <input
                                className="input"
                                placeholder="Ej. Tomates"
                                {...register("name", { required: "El nombre es obligatorio" })}
                            />
                            {errors.name && <p className="error">{errors.name.message}</p>}
                        </div>

                        {/* RESTAURANT */}
                        <div className="flex flex-col">
                            <label className="label">Restaurante</label>
                            <input
                                className="input"
                                placeholder="ID Restaurante"
                                {...register("restaurant", { required: "Requerido" })}
                            />
                        </div>

                        {/* QUANTITY */}
                        <div className="flex flex-col">
                            <label className="label">Cantidad</label>
                            <input
                                type="number"
                                className="input"
                                {...register("quantity", {
                                    required: "Requerido",
                                    min: { value: 0, message: "No negativo" }
                                })}
                            />
                        </div>

                        {/* UNIT */}
                        <div className="flex flex-col">
                            <label className="label">Unidad</label>
                            <select className="input" {...register("unit")}>
                                <option value="KG">KG</option>
                                <option value="LITRO">Litro</option>
                                <option value="UNIDAD">Unidad</option>
                                <option value="GRAMO">Gramo</option>
                                <option value="MILILITRO">Mililitro</option>
                            </select>
                        </div>

                        {/* MIN STOCK */}
                        <div className="flex flex-col">
                            <label className="label">Stock mínimo</label>
                            <input
                                type="number"
                                className="input"
                                {...register("minStock", {
                                    min: { value: 1, message: "Mínimo 1" }
                                })}
                            />
                        </div>

                        {/* ACTIVE */}
                        <div className="flex items-center gap-3">
                            <input type="checkbox" {...register("isActive")} />
                            <label className="text-sm text-[var(--text-secondary)]">
                                Activo
                            </label>
                        </div>

                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancelar
                        </button>

                        <button type="submit" className="btn-primary">
                            {loading ? <Spinner /> : inventory ? "Guardar Cambios" : "Crear Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};