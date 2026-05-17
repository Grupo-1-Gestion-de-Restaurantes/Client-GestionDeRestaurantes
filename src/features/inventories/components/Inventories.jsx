import { useState, useEffect } from "react";
import { useInventoryStore } from "../store/useInventoryStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { InventoryModal } from "./InventoryModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Inventories = () => {
    const { inventories, loading, error, getInventories, deleteInventory } = useInventoryStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getInventories();
        if (getRestaurants) getRestaurants();
    }, [getInventories, getRestaurants]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const activeItems = inventories.filter((i) => i.isActive === true);

    const getRestaurantName = (restaurantField) => {
        if (!restaurantField) return "N/A";
        if (typeof restaurantField === "object" && restaurantField.name) {
            return restaurantField.name;
        }
        const found = restaurants?.find((r) => r._id === restaurantField);
        return found ? found.name : "Cargando...";
    };

    if (loading && activeItems.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Control de Almacén (Inventarios)
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Monitorea los niveles de stock, sucursales y materias primas disponibles
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedItem(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent cursor-pointer"
                >
                    + Agregar Inventario
                </button>
            </div>

            {/* TABLA RESPONSIVE */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nombre del Insumo</th>
                            <th className="px-6 py-4 font-semibold">Sucursal / Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Stock Actual</th>
                            <th className="px-6 py-4 font-semibold">Estado de Alerta</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {activeItems.length > 0 ? (
                            activeItems.map((item) => {
                                // 🚨 Lógica de Alerta de Stock Bajo
                                const isLowStock = item.quantity <= (item.minStock || 5);

                                return (
                                    <tr key={item._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100 dark:border-blue-800/30">
                                                {getRestaurantName(item.restaurant)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-[var(--text-primary)]">
                                            {item.quantity} <span className="text-xs font-normal text-[var(--text-muted)]">{String(item.unit).toLowerCase()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {isLowStock ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400">
                                                    ⚠️ Stock Bajo (Mín. {item.minStock || 5})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400">
                                                    Estable
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3 justify-center">
                                            <button
                                                className=" hover:text-[var(--color-brand-yellow)] font-medium transition cursor-pointer"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                className="text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium transition cursor-pointer"
                                                onClick={() =>
                                                    openConfirm({
                                                        title: "Eliminar Insumo",
                                                        message: `¿Estás seguro de eliminar el insumo "${item.name}" del inventario?`,
                                                        onConfirm: () => deleteInventory(item._id)
                                                    })
                                                }
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-[var(--text-muted)]">
                                    No hay insumos registrados en el almacén.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <InventoryModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedItem(null);
                }}
                item={selectedItem}
            />
        </div>
    );
};