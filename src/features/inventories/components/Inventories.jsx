import { useState, useEffect, useMemo } from "react";
import { useInventoryStore } from "../store/useInventoryStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { InventoryModal } from "./InventoryModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { PencilLine, Trash2, Search, Filter, BadgeCheck } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Inventories = () => {
    const { inventories, loading, error, getInventories, deleteInventory } = useInventoryStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [restaurantFilter, setRestaurantFilter] = useState("all");
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getInventories();
        if (getRestaurants) getRestaurants();
    }, [getInventories, getRestaurants]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const filteredItems = useMemo(() => {
        return inventories.filter((item) => {
            if (!item.isActive) return false;

            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const restaurantId = typeof item.restaurant === "object" ? item.restaurant?._id : item.restaurant;
            const matchesRestaurant = restaurantFilter === "all" || restaurantId === restaurantFilter;

            return matchesSearch && matchesRestaurant;
        });
    }, [inventories, searchTerm, restaurantFilter]);

    const getRestaurantName = (restaurantField) => {
        if (!restaurantField) return "N/A";
        if (typeof restaurantField === "object" && restaurantField.name) {
            return restaurantField.name;
        }
        const found = restaurants?.find((r) => r._id === restaurantField);
        return found ? found.name : "Cargando...";
    };

    if (loading && inventories.length === 0) return <Spinner />;

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

            {/* BUSCADOR Y FILTROS */}
            <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Search} />
                                Buscar en inventario
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)]" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre de producto..."
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-64">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Filter} />
                                Restaurante
                            </span>
                        </label>
                        <select
                            value={restaurantFilter}
                            onChange={(e) => setRestaurantFilter(e.target.value)}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="all">Todos los restaurantes</option>
                            {restaurants?.map((r) => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setRestaurantFilter("all");
                        }}
                        className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-base)]"
                    >
                        <span className="inline-flex items-center gap-2">
                            <LucideMotionIcon icon={BadgeCheck} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-secondary)]" />
                            Limpiar
                        </span>
                    </button>
                </div>
            </div>

            {/* TABLA RESPONSIVE */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nombre del Ingrediente</th>
                            <th className="px-6 py-4 font-semibold">Sucursal / Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Stock Actual</th>
                            <th className="px-6 py-4 font-semibold">Estado de Alerta</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => {
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
                                                className="inline-flex items-center gap-2 text-[var(--color-brand-yellow)] hover:opacity-75 font-medium transition cursor-pointer"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                <LucideMotionIcon icon={PencilLine} className="!w-4 !h-4 text-[var(--color-brand-yellow)]" />
                                                Editar
                                            </button>
                                            <button
                                                className="inline-flex items-center gap-2 text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium transition cursor-pointer"
                                                onClick={() =>
                                                    openConfirm({
                                                        title: "Eliminar Ingrediente",
                                                        message: `¿Estás seguro de eliminar el ingrediente "${item.name}" del inventario?`,
                                                        onConfirm: () => deleteInventory(item._id)
                                                    })
                                                }
                                            >
                                                <LucideMotionIcon icon={Trash2} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-[var(--text-muted)]">
                                    No hay ingredientes registrados en el almacén.
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