import { useState, useEffect } from "react";
import { useDishStore } from "../store/useDishStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useInventoryStore } from "../../inventories/store/useInventoryStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { DishModal } from "./DishModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { PencilLine, Trash2, Search, Filter, BadgeCheck, Plus } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";

export const Dishes = () => {
    const { dishes, loading, error, filters, setFilters, getDishes, deleteDish, pagination } = useDishStore();
    const { searchTerm, activeFilter, dishTypeFilter } = filters;
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { inventories, getInventories } = useInventoryStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = {
                search: searchTerm.trim(),
                dishType: dishTypeFilter,
                page: 1
            };

            if (activeFilter !== "all") {
                params.isActive = activeFilter === "active";
            } else {
                params.isActive = "all";
            }

            getDishes(params);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [getDishes, activeFilter, searchTerm, dishTypeFilter]);

    const handlePageChange = (page) => {
        const params = {
            search: searchTerm.trim(),
            dishType: dishTypeFilter,
            page
        };

        if (activeFilter !== "all") {
            params.isActive = activeFilter === "active";
        } else {
            params.isActive = "all";
        }

        getDishes(params);
    };

    useEffect(() => {
        if (getRestaurants) getRestaurants({ isActive: 'all' });
        if (getInventories) getInventories();
    }, [getRestaurants, getInventories]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getRestaurantName = (restaurantField) => {
        if (!restaurantField) return "N/A";
        
        // Si ya viene poblado como objeto
        if (typeof restaurantField === "object" && restaurantField.name) {
            return restaurantField.name;
        }
        
        // Si viene solo el ID (string u objeto ObjectId)
        const idToSearch = typeof restaurantField === "object" && restaurantField._id 
            ? String(restaurantField._id) 
            : String(restaurantField);

        const found = restaurants?.find((r) => String(r._id) === idToSearch);
        return found ? found.name : "Desconocido (" + idToSearch.substring(0, 5) + "...)";
    };

    const getInventoryItemName = (itemField) => {
        if (!itemField) return "Inventario desconocido";

        if (typeof itemField === "object") {
            return itemField.name || itemField.itemName || itemField.ingredientName || "Inventario";
        }

        const found = inventories?.find((i) => String(i._id) === String(itemField));

        if (found) {
            return found.name || found.itemName || found.ingredientName || "Inventario sin nombre";
        }

        return `Inventario (${String(itemField).substring(0, 5)}...)`;
    };

    if (loading && dishes.length === 0) return <Spinner />;

    const emptyMessage = searchTerm.trim() || activeFilter !== "all" || dishTypeFilter
        ? "No hay platillos con esos filtros."
        : "No hay platillos registrados.";

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Menú (Platillos)
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Administra las opciones de comida, precios, recetas e imágenes de los restaurantes
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedDish(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                >
                    <span className="inline-flex items-center gap-2">
                        <LucideMotionIcon icon={Plus} className="!w-4 !h-4 md:!w-5 md:!h-5 text-white dark:text-[var(--text-primary)]" />
                        Agregar Platillo
                    </span>
                </button>
            </div>

            {/* BUSCADOR Y FILTROS */}
            <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Search} />
                                Buscar platillos
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:translate-y-0 hover:scale-100 group-hover:translate-y-0 group-hover:scale-100" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                placeholder="Buscar por nombre o descripción"
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-48">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Filter} />
                                Tipo
                            </span>
                        </label>
                        <select
                            value={dishTypeFilter}
                            onChange={(e) => setFilters({ dishTypeFilter: e.target.value })}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="">Cualquier Tipo</option>
                            <option value="ENTRADA">Entrada</option>
                            <option value="PLATO_FUERTE">Plato Fuerte</option>
                            <option value="POSTRE">Postre</option>
                            <option value="BEBIDA">Bebida</option>
                        </select>
                    </div>

                    <div className="w-full lg:w-48">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Filter} />
                                Mostrar
                            </span>
                        </label>
                        <select
                            value={activeFilter}
                            onChange={(e) => setFilters({ activeFilter: e.target.value })}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                            <option value="all">Todos</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setFilters({ searchTerm: "", activeFilter: "all", dishTypeFilter: "" });
                        }}
                        className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-base)]"
                    >
                        <span className="inline-flex items-center gap-2">
                            <LucideMotionIcon icon={BadgeCheck} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]" />
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
                            <th className="px-6 py-4 font-semibold">Imagen</th>
                            <th className="px-6 py-4 font-semibold">Platillo / Receta</th>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold">Precio</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {dishes.length > 0 ? (
                            dishes.map((dishItem) => (
                                <tr key={dishItem._id} className="hover:bg-[var(--bg-base)] transition-colors align-middle">
                                    {/* Imagen */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={dishItem.photo}
                                            alt={dishItem.name}
                                            className="w-14 h-14 object-cover rounded-lg border border-[var(--border-color)] shadow-sm"
                                            onError={(e) => {
                                                e.target.src = 'https://res.cloudinary.com/degzwfdz3/image/upload/v1771700198/no-photo_orrdvt.avif';
                                            }}
                                        />
                                    </td>

                                    {/* Nombre + Listado Intuitivo de Ingredientes */}
                                    <td className="px-6 py-4 max-w-xs md:max-w-sm">
                                        <div className="font-bold text-[var(--text-primary)] text-base">
                                            {dishItem.name}
                                        </div>
                                        {dishItem.description && (
                                            <p className="text-xs text-[var(--text-muted)] line-clamp-1 mb-1.5">
                                                {dishItem.description}
                                            </p>
                                        )}
                                        {/* 📝 Mapeo Visual de la Receta */}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {dishItem.ingredients && dishItem.ingredients.length > 0 ? (
                                                dishItem.ingredients.map((ing, i) => (
                                                    <span
                                                        key={ing._id || i}
                                                        className="inline-flex items-center bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700/60"
                                                    >
                                                        {getInventoryItemName(ing.inventoryItem)} ({ing.quantityUsed})
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-[var(--color-brand-red)] italic">
                                                    Sin ingredientes asignados
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Restaurante */}
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100 dark:border-blue-800/30">
                                            {getRestaurantName(dishItem.restaurant)}
                                        </span>
                                    </td>

                                    {/* Categoría */}
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className="bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300 px-2.5 py-1 rounded-md text-xs font-mono uppercase tracking-wider">
                                            {dishItem.dishType}
                                        </span>
                                    </td>

                                    {/* Precio */}
                                    <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)] whitespace-nowrap">
                                        Q {Number(dishItem.price).toFixed(2)}
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {dishItem.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                                Inactivo
                                            </span>
                                        )}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                className="inline-flex items-center gap-2 text-[var(--color-brand-yellow)] hover:opacity-75 font-medium text-sm transition cursor-pointer"
                                                onClick={() => {
                                                    setSelectedDish(dishItem);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                <LucideMotionIcon icon={PencilLine} className="!w-4 !h-4 text-[var(--color-brand-yellow)]" />
                                                Editar
                                            </button>
                                            <button
                                                className="inline-flex items-center gap-2 text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium text-sm transition cursor-pointer"
                                                onClick={() =>
                                                    openConfirm({
                                                        title: "Eliminar Platillo",
                                                        message: `¿Estás seguro de eliminar el platillo "${dishItem.name}" de la carta?`,
                                                        onConfirm: () => deleteDish(dishItem._id)
                                                    })
                                                }
                                            >
                                                <LucideMotionIcon icon={Trash2} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-[var(--text-muted)] italic">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
            />

            <DishModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedDish(null);
                }}
                dish={selectedDish}
            />
        </div>
    );
};