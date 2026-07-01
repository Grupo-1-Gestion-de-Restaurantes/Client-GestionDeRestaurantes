import { useState, useEffect } from "react";
import { useCommentStore } from "../store/useCommentStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useDishStore } from "../../dishes/store/useDishStore.js"; // Lo mismo para platillos
import { Trash2, Search, Filter, BadgeCheck, Star } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";

export const Comments = () => {
    const { comments, loading, error, filters, setFilters, getComments, deleteComment, pagination } = useCommentStore();
    const { searchTerm, activeFilter, restaurantFilter } = filters;
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { dishes, getDishes } = useDishStore();
    const { openConfirm } = useUIStore();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = {
                search: searchTerm.trim(),
                page: 1
            };

            if (restaurantFilter) {
                params.restaurantId = restaurantFilter;
            }

            if (activeFilter !== "all") {
                params.isActive = activeFilter === "active";
            } else {
                params.isActive = "all";
            }

            getComments(params);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [getComments, activeFilter, searchTerm, restaurantFilter]);

    const handlePageChange = (page) => {
        const params = {
            search: searchTerm.trim(),
            page
        };

        if (restaurantFilter) {
            params.restaurantId = restaurantFilter;
        }

        if (activeFilter !== "all") {
            params.isActive = activeFilter === "active";
        } else {
            params.isActive = "all";
        }

        getComments(params);
    };

    useEffect(() => {
        if (getRestaurants) getRestaurants();
        if (getDishes) getDishes();
    }, [getRestaurants, getDishes]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getRestaurantName = (restaurantField) => {
        if (!restaurantField) return null;

        if (typeof restaurantField === "object" && restaurantField.name) {
            return restaurantField.name;
        }

        const found = restaurants?.find((r) => r._id === restaurantField);
        return found ? found.name : `Restaurante (${restaurantField.substring(0, 5)}...)`;
    };

    const getDishName = (dishField) => {
        if (!dishField) return null;

        if (typeof dishField === "object" && dishField.name) {
            return dishField.name;
        }

        const found = dishes?.find((d) => d._id === dishField);
        return found ? found.name : `Platillo (${dishField.substring(0, 5)}...)`;
    };

    if (loading && comments.length === 0) return <Spinner />;

    const emptyMessage = searchTerm.trim() || activeFilter !== "all" || restaurantFilter
        ? "No hay reseñas con esos filtros."
        : "No hay reseñas pendientes de moderación en este momento.";

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Panel de Moderación de Reseñas
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Revisa y oculta comentarios u opiniones que infrinjan las normas de la comunidad
                    </p>
                </div>
            </div>

            {/* BUSCADOR Y FILTROS */}
            <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Search} />
                                Buscar en reseñas
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:translate-y-0 hover:scale-100 group-hover:translate-y-0 group-hover:scale-100" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                placeholder="Buscar contenido del comentario"
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-48">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Filter} />
                                Restaurante
                            </span>
                        </label>
                        <select
                            value={restaurantFilter}
                            onChange={(e) => setFilters({ restaurantFilter: e.target.value })}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="">Todos los Rest.</option>
                            {restaurants?.map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.name}
                                </option>
                            ))}
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
                            setFilters({ searchTerm: "", activeFilter: "all", restaurantFilter: "" });
                        }}
                        className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-base)]"
                    >
                        <span className="inline-flex items-center gap-2">
                            <LucideMotionIcon icon={BadgeCheck} className="!w-4 !h-4 md:!w-5 !h-5 text-[var(--text-secondary)] dark:text-[var(--text-secondary)]" />
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
                            <th className="px-6 py-4 font-semibold">Calificación</th>
                            <th className="px-6 py-4 font-semibold">Comentario u Opinión</th>
                            <th className="px-6 py-4 font-semibold">Asociado A</th>
                            <th className="px-6 py-4 font-semibold">Fecha de Publicación</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {comments.length > 0 ? (
                            comments.map((com) => {
                                const restaurantName = getRestaurantName(com.restaurantId);
                                const dishName = getDishName(com.dishId);

                                return (
                                    <tr key={com._id} className="hover:bg-[var(--bg-base)] transition-colors">

                                        <td className="px-6 py-4 text-sm font-bold text-amber-500 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-0.5 align-middle">
                                                {Array.from({ length: com.review }).map((_, i) => (
                                                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                                                ))}
                                            </span>
                                            <span className="text-[var(--text-secondary)] font-normal ml-1">({com.review})</span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-[var(--text-primary)] max-w-xs md:max-w-md break-words">
                                            {com.comment}
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            {restaurantName ? (
                                                <span className="inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800/50">
                                                    {restaurantName}
                                                </span>
                                            ) : dishName ? (
                                                <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-md dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                                                    {dishName}
                                                </span>
                                            ) : (
                                                <span className="text-[var(--text-muted)] text-xs italic">Opinión General</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                            {com.createdAt ? new Date(com.createdAt).toLocaleDateString("es-GT", {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            }) : "N/A"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {com.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                                    Oculto
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <button
                                                className="inline-flex items-center gap-2 text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] hover:underline font-medium text-sm transition cursor-pointer"
                                                onClick={() =>
                                                    openConfirm({
                                                        title: "Ocultar Comentario",
                                                        message: `¿Estás seguro de que deseas retirar esta reseña del feed público? El cliente no será eliminado, pero el comentario ya no se mostrará.`,
                                                        onConfirm: () => deleteComment(com._id)
                                                    })
                                                }
                                            >
                                                <LucideMotionIcon icon={Trash2} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
                                                Ocultar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-[var(--text-muted)] italic">
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
        </div >
    );
};