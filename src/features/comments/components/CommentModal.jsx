import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveComment } from "../hooks/useSaveComment";
import { useCommentStore } from "../store/useCommentStore";

export const CommentModal = ({ isOpen, onClose, commentItem }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { saveComment } = useSaveComment();
    const loading = useCommentStore((state) => state.loading);

    useEffect(() => {
        if (isOpen) {
            if (commentItem) {
                reset({
                    review: commentItem.review || 5,
                    comment: commentItem.comment || "",
                    restaurantId: commentItem.restaurantId?._id || commentItem.restaurantId || "",
                    dishId: commentItem.dishId?._id || commentItem.dishId || "",
                });
            } else {
                reset({
                    review: 5,
                    comment: "",
                    restaurantId: "",
                    dishId: "",
                });
            }
        }
    }, [isOpen, commentItem, reset]);

    const onSubmit = async (data) => {
        try {
            await saveComment(data, commentItem?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[linear-gradient(90deg,var(--main-blue)_0%,#1956a3_100%)] text-white sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {commentItem ? "Editar Comentario / Reseña" : "Nuevo Comentario / Reseña"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        Visualiza o modera los comentarios de los clientes
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 sm:p-6 space-y-5 overflow-y-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Calificación (Review) */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Calificación (Estrellas de 1 a 5)
                            </label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("review", { required: "La calificación es obligatoria", valueAsNumber: true })}
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ (5) Excelente</option>
                                <option value={4}>⭐⭐⭐⭐ (4) Bueno</option>
                                <option value={3}>⭐⭐⭐ (3) Regular</option>
                                <option value={2}>⭐⭐ (2) Malo</option>
                                <option value={1}>⭐ (1) Pésimo</option>
                            </select>
                        </div>


                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                ID Restaurante (Opcional)
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. 64b7f..."
                                {...register("restaurantId")}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                ID Platillo (Opcional)
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. 64b8a..."
                                {...register("dishId")}
                            />
                        </div>

                        {/* Detalle del comentario */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Comentario
                            </label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition min-h-[100px]"
                                placeholder="Escribe el comentario aquí..."
                                {...register("comment", { 
                                    required: "El comentario no puede estar vacío",
                                    maxLength: { value: 500, message: "Máximo 500 caracteres" }
                                })}
                            />
                            {errors.comment && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.comment.message}</p>}
                        </div>
                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--bg-surface-alt)] text-[var(--text-primary)] hover:opacity-80 transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : commentItem ? "Guardar Cambios" : "Crear Comentario"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};