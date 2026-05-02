import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSaveInventory } from "../hooks/useSaveInventory.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const InventoryModal = ({ isOpen, onClose, employee }) => {

    const { register, handleSubmit, reset } = useForm();
    const { saveInventory, loading } = useSaveInventory();

    useEffect(() => {
        if (inventory) {
            reset(inventory);
        } else {
            reset({
                name: "",
                quantity: "",
                unit: ""
            });
        }
    }, [inventory]);

    const onSubmit = async (data) => {
        await saveInventory(data, inventory?._id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded w-full max-w-md space-y-4"
            >

                <h2 className="text-xl font-bold">
                    {employee ? "Editar" : "Nuevo"} Inventario
                </h2>

                <input
                    placeholder="Nombre"
                    {...register("name", { required: true })}
                    className="w-full border p-2 rounded"
                />

                <input
                    placeholder="Cantidad"
                    {...register("quantity", { required: true })}
                    className="w-full border p-2 rounded"
                />

                <input
                    placeholder="Unidad"
                    {...register("unit", { required: true })}
                    className="w-full border p-2 rounded"
                />

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose}>
                        Cancelar
                    </button>

                    <button type="submit" className="bg-main-blue text-white px-4 py-2 rounded">
                        {loading ? <Spinner /> : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};