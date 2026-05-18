import { useState, useEffect } from "react";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { RestaurantModal } from "./RestaurantModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import {
    Search,
    Filter,
    Plus,
    MapPin,
    Clock3,
    Users,
    Phone,
    Star,
    PencilLine,
    Ban,
    CircleCheckBig,
    UtensilsCrossed,
    ImageOff,
    Trash2,
    BadgeCheck
} from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Restaurants = () => {
    const {
        restaurants,
        loading,
        error,
        filters,
        setFilters,
        getRestaurants,
        deactivateRestaurant,
        activateRestaurant,
    } = useRestaurantStore();
    const { searchTerm, activeFilter } = filters;
    const [openModal, setOpenModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = { search: searchTerm.trim() };

            if (activeFilter !== "all") {
                params.isActive = activeFilter === "active";
            }

            getRestaurants(params);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [getRestaurants, activeFilter, searchTerm]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Abierto": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "Cerrado": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            case "En Mantenimiento": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
        }
    };

    const getCategoryStyle = (category) => {
        switch (category) {
            case "Gourmet": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            case "Casual": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
        }
    };

    const renderRating = (ratingValue) => {
        const ratingNumber = Math.max(0, Math.min(5, Number(ratingValue) || 0));
        return Array.from({ length: 5 }, (_, index) => {
            const filled = index < ratingNumber;
            return (
                <span
                    key={index}
                    className={filled ? "text-yellow-500" : "text-gray-400"}
                    aria-hidden
                >
                    {filled ? '★' : '☆'}
                </span>
            );
        });
    };

    const emptyMessage = searchTerm.trim() || activeFilter !== "all"
        ? "No hay restaurantes con esos filtros."
        : "No hay restaurantes registrados.";

    if (loading && restaurants.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Restaurantes
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Administra los restaurantes registrados
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedRestaurant(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                >
                    <span className="inline-flex items-center gap-2">
                        <LucideMotionIcon icon={Plus} className="!w-4 !h-4 md:!w-5 md:!h-5 text-white dark:text-[var(--text-primary)]" />
                        Agregar Restaurante
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
                                Buscar restaurantes
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:translate-y-0 hover:scale-100 group-hover:translate-y-0 group-hover:scale-100" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                placeholder="Buscar por nombre, dirección, categoría o estado"
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-64">
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
                            setFilters({ searchTerm: "", activeFilter: "all" });
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

            {/* TABLA */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Categoría</th>
                            <th className="px-6 py-4 font-semibold">Horario</th>
                            <th className="px-6 py-4 font-semibold">Precio Prom.</th>
                            <th className="px-6 py-4 font-semibold">Capacidad</th>
                            <th className="px-6 py-4 font-semibold">Teléfono</th>
                            <th className="px-6 py-4 font-semibold">Rating</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold">Activo</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border-color)]">
                        {restaurants.length > 0 ? (
                            restaurants.map((restaurant) => (
                                <tr
                                    key={restaurant._id}
                                    className="hover:bg-[var(--bg-base)] transition-colors"
                                >
                                    {/* Nombre + dirección + foto */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {restaurant.photo ? (
                                                <img
                                                    src={restaurant.photo}
                                                    alt={restaurant.name}
                                                    className="w-10 h-10 rounded-lg object-cover border border-[var(--border-color)] shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-color)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
                                                    <LucideMotionIcon icon={UtensilsCrossed} className="!w-4 !h-4 md:!w-5 md:!h-5 hover:translate-y-0 hover:scale-100 group-hover:translate-y-0 group-hover:scale-100 text-[var(--text-muted)] dark:text-[var(--text-muted)]" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                                    {restaurant.name}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)] truncate max-w-[180px]">
                                                    <span className="inline-flex items-center gap-1">
                                                        <LucideMotionIcon icon={MapPin} className="!w-3.5 !h-3.5 md:!w-4 md:!h-4 hover:translate-y-0 hover:scale-100 text-[var(--text-muted)] dark:text-[var(--text-muted)]" />
                                                        {restaurant.address}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Categoría */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getCategoryStyle(restaurant.categories)}`}>
                                            {restaurant.categories}
                                        </span>
                                    </td>

                                    {/* Horario */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5">
                                            <LucideMotionIcon icon={Clock3} className="!w-4 !h-4 md:!w-5 md:!h-5 hover:translate-y-0 hover:scale-100 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]" />
                                            {restaurant.openingTime} – {restaurant.closingTime}
                                        </span>
                                    </td>

                                    {/* Precio promedio */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        Q{restaurant.averagePrice}
                                    </td>

                                    {/* Capacidad */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5">
                                            <LucideMotionIcon icon={Users} className="!w-4 !h-4 md:!w-5 md:!h-5 hover:translate-y-0 hover:scale-100 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]" />
                                            {restaurant.capacity} personas
                                        </span>
                                    </td>

                                    {/* Teléfono */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5">
                                            <LucideMotionIcon icon={Phone} className="!w-4 !h-4 md:!w-5 md:!h-5 hover:translate-y-0 hover:scale-100 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]" />
                                            {restaurant.phone}
                                        </span>
                                    </td>

                                    {/* Rating */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1">
                                            <LucideMotionIcon icon={Star} className="!w-4 !h-4 md:!w-5 md:!h-5 text-yellow-500 dark:text-[var(--color-brand-yellow)] hover:translate-y-0 hover:scale-100" />
                                            {renderRating(restaurant.rating)}
                                        </span>
                                        <span className="ml-2 align-middle">{restaurant.rating}/5</span>
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`block w-full min-w-[7.5rem] px-3 py-1 text-xs rounded-full font-medium text-center whitespace-normal ${getStatusStyle(restaurant.status)}`}
                                            style={{ wordBreak: 'break-word' }}
                                        >
                                            {restaurant.status}
                                        </span>
                                    </td>

                                    {/* isActive */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${restaurant.isActive
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {restaurant.isActive ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                className="text-[var(--color-brand-dark)] hover:text-[var(--color-brand-yellow)] font-medium transition"
                                                onClick={() => {
                                                    setSelectedRestaurant(restaurant);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <LucideMotionIcon icon={PencilLine} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--color-brand-dark)] dark:text-[var(--color-brand-yellow)]" />
                                                    Editar
                                                </span>
                                            </button>
                                            {restaurant.isActive ? (
                                                <button
                                                    className="text-[var(--color-brand-red)] hover:opacity-70 font-medium transition"
                                                    onClick={() =>
                                                        openConfirm({
                                                            title: "Cerrar Restaurante",
                                                            message: `¿Estás seguro de cerrar "${restaurant.name}"?`,
                                                            onConfirm: () => deactivateRestaurant(restaurant._id),
                                                        })
                                                    }
                                                >
                                                    <span className="inline-flex items-center gap-2">
                                                        <LucideMotionIcon icon={Ban} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--color-brand-red)] dark:text-[var(--color-brand-yellow)]" />
                                                        Cerrar
                                                    </span>
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-green-700 hover:opacity-70 font-medium transition"
                                                    onClick={() =>
                                                        openConfirm({
                                                            title: "Activar Restaurante",
                                                            message: `¿Estás seguro de activar "${restaurant.name}"?`,
                                                            onConfirm: () => activateRestaurant(restaurant._id),
                                                        })
                                                    }
                                                >
                                                    <span className="inline-flex items-center gap-2">
                                                        <LucideMotionIcon icon={CircleCheckBig} className="!w-4 !h-4 md:!w-5 md:!h-5 text-green-700 dark:text-[var(--color-brand-yellow)]" />
                                                        Activar
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="text-center py-8 text-[var(--text-muted)]"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <RestaurantModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedRestaurant(null);
                }}
                restaurant={selectedRestaurant}
            />
        </div>
    );
};