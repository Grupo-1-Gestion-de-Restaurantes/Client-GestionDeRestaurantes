import { useState, useEffect } from "react";
import { useCommentStore } from "../store/useCommentStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js"; 
import { useDishStore } from "../../dishes/store/useDishStore.js"; // Lo mismo para platillos
import { Trash2 } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Comments = () => {
    const { comments, loading, error, getComments, deleteComment } = useCommentStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { dishes, getDishes } = useDishStore();
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getComments();
        if (getRestaurants) getRestaurants();
        if (getDishes) getDishes();
    }, [getComments, getRestaurants, getDishes]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const activeComments = comments.filter((c) => c.isActive === true);

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

    if (loading && activeComments.length === 0) return <Spinner />;

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

            {/* TABLA RESPONSIVE */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Calificación</th>
                            <th className="px-6 py-4 font-semibold">Comentario u Opinión</th>
                            <th className="px-6 py-4 font-semibold">Asociado A</th>
                            <th className="px-6 py-4 font-semibold">Fecha de Publicación</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {activeComments.length > 0 ? (
                            activeComments.map((com) => {
                                const restaurantName = getRestaurantName(com.restaurantId);
                                const dishName = getDishName(com.dishId);

                                return (
                                    <tr key={com._id} className="hover:bg-[var(--bg-base)] transition-colors">

                                        <td className="px-6 py-4 text-sm font-bold text-amber-500 whitespace-nowrap">
                                            {"⭐".repeat(com.review)} <span className="text-[var(--text-secondary)] font-normal ml-1">({com.review})</span>
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
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-[var(--text-muted)] italic">
                                    No hay reseñas pendientes de moderación en este momento.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};