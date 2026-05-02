import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveReservation } from "../hooks/UseSaveReservation";
import { useReservationStore } from "../store/useReservationStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const ReservationModal = ({ isOpen, onClose, reservation }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const { saveReservation } = useSaveReservation();
    const loading = useReservationStore((state) => state.loading);

    useEffect(() => {
        if (isOpen) {
            if (reservation) {
                const dateObj = new Date(reservation.reservationDate);
                const formattedDate = dateObj.toISOString().slice(0, 16);

                reset({
                    client: reservation.client?._id || reservation.client,
                    restaurant: reservation.restaurant?._id || reservation.restaurant,
                    table: reservation.table?._id || reservation.table,
                    reservationDate: formattedDate,
                    numberOfPeople: reservation.numberOfPeople,
                    durationInMinutes: reservation.durationInMinutes,
                    status: reservation.status,
                    specialRequests: reservation.specialRequests,
                });
            } else {
                reset({
                    client: "",
                    restaurant: "",
                    table: "",
                    reservationDate: "",
                    numberOfPeople: 1,
                    durationInMinutes: 90,
                    status: "PENDIENTE",
                    specialRequests: "",
                });
            }
        }
    }, [isOpen, reservation, reset]);

    const onSubmit = async (data) => {
        try {
            await saveReservation(data, reservation?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
                {/* HEADER */}
                <div className="p-4 sm:p-5 bg-[var(--bg-surface-alt)] text-[var(--text-primary)] border-b border-[var(--border-color)] sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {reservation ? "Editar Reservación" : "Nueva Reservación"}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80">
                        Completa la información de la reserva
                    </p>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 sm:p-6 space-y-5 overflow-y-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ID del Cliente */}
                        {/*
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                ID Cliente
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. usr_J4RUy..."
                                {...register("client", { required: "El cliente es obligatorio" })}
                            />
                            {errors.client && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.client.message}</p>}
                        </div>
                        */}

                        {/* ID del Restaurante */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                ID Restaurante
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. 69a4ebb..."
                                {...register("restaurant", { required: "El restaurante es obligatorio" })}
                            />
                            {errors.restaurant && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.restaurant.message}</p>}
                        </div>

                        {/* ID de la Mesa */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                ID Mesa
                            </label>
                            <input
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Ej. 69a4ebf..."
                                {...register("table", { required: "La mesa es requerida" })}
                            />
                            {errors.table && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.table.message}</p>}
                        </div>

                        {/* Fecha y Hora */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Fecha y Hora
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("reservationDate", { required: "La fecha y hora son obligatorias" })}
                            />
                            {errors.reservationDate && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.reservationDate.message}</p>}
                        </div>

                        {/* Personas */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Número de Personas
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("numberOfPeople", {
                                    required: "Requerido",
                                    min: { value: 1, message: "Mínimo 1 persona" }
                                })}
                            />
                            {errors.numberOfPeople && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.numberOfPeople.message}</p>}
                        </div>

                        {/* Duración */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Duración (Minutos)
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("durationInMinutes", {
                                    required: "Requerido",
                                    min: { value: 15, message: "Mínimo 15 mins" }
                                })}
                            />
                        </div>

                        {/* Estado */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Estado
                            </label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                                {...register("status")}
                                disabled={!reservation}
                            >
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="CONFIRMADA">Confirmada</option>
                                <option value="COMPLETADA">Completada</option>
                                <option value="CANCELADA">Cancelada</option>
                                <option value="NO_ASISTIO">No Asistió</option>
                            </select>
                        </div>

                        {/* Peticiones Especiales */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Peticiones Especiales
                            </label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                placeholder="Alergias, sillas para bebé, etc..."
                                {...register("specialRequests")}
                            />
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
                            className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                        >
                            {loading ? <Spinner /> : reservation ? "Guardar Cambios" : "Crear Reservación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};