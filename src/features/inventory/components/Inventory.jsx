import { useEffect, useState } from "react";
import { useInventoryStore } from "../store/useInventoryStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { InventoryModal } from "./InventoryModal.jsx";

export const Inventory = () => {

    const { inventory, loading, getInventory, deleteInventory } = useInventoryStore();
    const { openConfirm } = useUIStore();

    const [openModal, setOpenModal] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null);

    useEffect(() => {
        getInventory();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="p-4">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-main-blue">
                        Gestión de Inventarios
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Administra los inventarios del restaurante
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedInventory(null);
                    }}
                    className="bg-main-blue text-white px-4 py-2 rounded"
                >
                    + Agregar Inventario
                </button>
            </div>

            {/* LISTA */}
            <div className="grid gap-4">

                {inventory.map(emp => (
                    <div className="bg-white p-4 rounded shadow flex flex-col gap-2">

                        <h2 className="font-bold text-lg">{item.name}</h2>

                        <p className="text-sm text-gray-500">
                            Cantidad: {item.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                            Unidad: {item.unit}
                        </p>

                        <div className="flex gap-2 mt-2">
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                onClick={() => {
                                    setSelectedInventory(emp);
                                    setOpenModal(true);
                                }}
                            >
                                Editar
                            </button>

                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                onClick={() =>
                                    openConfirm({
                                        title: "Eliminar empleado",
                                        message: `¿Eliminar ${emp.name}?`,
                                        onConfirm: () => deleteInventory(emp._id)
                                    })
                                }
                            >
                                Eliminar
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            <InventoryModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                inventory={selectedInventory}
            />
        </div>
    );
};