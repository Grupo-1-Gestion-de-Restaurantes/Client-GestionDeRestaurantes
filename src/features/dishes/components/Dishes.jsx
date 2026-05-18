import { useState, useEffect } from "react";
import { useDishStore } from "../store/useDishStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useInventoryStore } from "../../inventories/store/useInventoryStore.js"; 
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { DishModal } from "./DishModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { PencilLine, Trash2 } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Dishes = () => {
    const { dishes, loading, error, getDishes, deleteDish } = useDishStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { inventories, getInventories } = useInventoryStore(); 
    const [openModal, setOpenModal] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getDishes();
        if (getRestaurants) getRestaurants();
        if (getInventories) getInventories();
    }, [getDishes, getRestaurants, getInventories]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const activeDishes = dishes.filter((d) => d.isActive === true);

    const getRestaurantName = (restaurantField) => {
        if (!restaurantField) return "N/A";
        if (typeof restaurantField === "object" && restaurantField.name) {
            return restaurantField.name;
        }
        const found = restaurants?.find((r) => r._id === restaurantField);
        return found ? found.name : "Cargando...";
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

    if (loading && activeDishes.length === 0) return <Spinner />;

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
                    + Agregar Platillo
                </button>
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
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {activeDishes.length > 0 ? (
                            activeDishes.map((dishItem) => (
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
                                <td colSpan="6" className="text-center py-8 text-[var(--text-muted)] italic">
                                    No hay platillos registrados en el menú.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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