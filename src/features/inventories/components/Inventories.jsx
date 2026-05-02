import { useState, useEffect } from "react";
import { useInventoryStore } from "../store/useInventoryStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { InventoryModal } from "./InventoryModal.jsx";

export const Inventories = () => {
    const { inventories, loading, getInventories, deleteInventory } = useInventoryStore();
    const [openModal, setOpenModal] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getInventories();
    }, []);

    if (loading && inventories.length === 0) return <Spinner />;

    const getStockStyle = (qty, min) => {
        if (qty <= min) return 'bg-red-100 text-red-800';
        if (qty <= min * 2) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="p-4">

            {/* HEADER */}
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Inventario
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm">
                        Control de stock del restaurante
                    </p>
                </div>

                <button
                    onClick={() => {
                        setSelected(null);
                        setOpenModal(true);
                    }}
                    className="btn-primary"
                >
                    + Agregar
                </button>
            </div>

            {/* TABLA */}
            <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[var(--bg-surface-alt)]">
                        <tr>
                            <th className="th">Nombre</th>
                            <th className="th">Cantidad</th>
                            <th className="th">Unidad</th>
                            <th className="th">Stock</th>
                            <th className="th text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {inventories.map((item) => (
                            <tr key={item._id} className="hover:bg-[var(--bg-base)]">
                                <td className="td">{item.name}</td>
                                <td className="td">{item.quantity}</td>
                                <td className="td">{item.unit}</td>

                                <td className="td">
                                    <span className={`px-3 py-1 rounded-full text-xs ${getStockStyle(item.quantity, item.minStock)}`}>
                                        {item.quantity <= item.minStock ? "Bajo" : "OK"}
                                    </span>
                                </td>

                                <td className="td flex gap-3 justify-center">
                                    <button onClick={() => {
                                        setSelected(item);
                                        setOpenModal(true);
                                    }}>
                                        ✏️
                                    </button>

                                    <button onClick={() => deleteInventory(item._id)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <InventoryModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                inventory={selected}
            />
        </div>
    );
};