import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveReservation } from "../hooks/UseSaveReservation";
import { useReservationStore } from "../store/useReservationStore";
import { useClientStore } from "../../clients/store/useClientStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useTableStore } from "../../tables/store/useTableStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useManagerRestaurant } from "../../../shared/hooks/useManagerRestaurant.js";

export const ReservationModal = ({ isOpen, onClose, reservation }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const { saveReservation } = useSaveReservation();
    const { clients, getClients } = useClientStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { tables, getTables } = useTableStore();
    const { isManager, myRestaurantId, myRestaurantName } = useManagerRestaurant();

    // Use local loading state instead of store loading to prevent spinner on edit
    const [localLoading, setLocalLoading] = useState(false);

    const selectedRestaurant = watch("restaurant");

    useEffect(() => {
        if (isOpen && isManager && myRestaurantId) {
            setValue("restaurant", myRestaurantId);
        }
    }, [isOpen, isManager, myRestaurantId, setValue]);

    useEffect(() => {
        if (isOpen) {
            getClients();
            getRestaurants({ isActive: true, limit: 100 });

            if (reservation) {
                const dateObj = new Date(reservation.reservationDate);
                const formattedDate = dateObj.toISOString().slice(0, 16);

                reset({
                    client: reservation.client?._id || reservation.client,
                    restaurant: isManager && myRestaurantId ? myRestaurantId : (reservation.restaurant?._id || reservation.restaurant),
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
                    restaurant: isManager && myRestaurantId ? myRestaurantId : "",
                    table: "",
                    reservationDate: "",
                    numberOfPeople: 1,
                    durationInMinutes: 90,
                    status: "PENDIENTE",
                    specialRequests: "",
                });
            }
        }
    }, [isOpen, reservation, reset, getClients, getRestaurants]);

    useEffect(() => {
        if (isOpen && selectedRestaurant) {
            getTables({ restaurante: selectedRestaurant, isActive: true, limit: 100 });
        }
    }, [isOpen, selectedRestaurant, getTables]);

    const onSubmit = async (data) => {
        setLocalLoading(true);
        try {
            await saveReservation(data, reservation?._id);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            // Handle the error but don't break the UI
        } finally {
            setLocalLoading(false);
        }
    };

    if (!isOpen) return null;

    // Min date for datetime-local (now) to prevent past dates in browser UI
    const minDateTime = new Date().toISOString().slice(0, 16);

    // Get selected restaurant data for hours validation
    const selectedRestaurantData = restaurants?.find(r => r._id === selectedRestaurant);
    const restaurantOpening = selectedRestaurantData?.openingTime;
    const restaurantClosing = selectedRestaurantData?.closingTime;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            <div className="w-full max-w-lg md:max-w-2xl overflow-hidden rounded-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl transition-colors duration-300">
                {/* HEADER */}
                <div className="bg-[linear-gradient(90deg,var(--color-brand-dark)_0%,var(--color-brand-red-dark)_100%)] p-4 sm:p-5 text-white sticky top-0 z-10 transition-colors duration-300">
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
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Cliente</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("client", { required: "El cliente es requerido" })}
                            >
                                <option value="">Seleccione un cliente</option>
                                {clients.map((client) => (
                                    <option key={client._id} value={client._id}>
                                        {client.name || client.username || client.email}
                                    </option>
                                ))}
                            </select>
                            {errors.client && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.client.message}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Restaurante</label>
                            {isManager ? (
                                <input
                                    type="text"
                                    value={myRestaurantName || "Cargando..."}
                                    disabled
                                    readOnly
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] cursor-not-allowed"
                                />
                            ) : (
                                <select
                                    className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                    {...register("restaurant", { required: "El restaurante es requerido" })}
                                >
                                    <option value="">Seleccione un restaurante</option>
                                    {restaurants.map((restaurant) => (
                                        <option key={restaurant._id} value={restaurant._id}>
                                            {restaurant.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.restaurant && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.restaurant.message}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">Mesa</label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("table", { required: "La mesa es requerida" })}
                            >
                                <option value="">Seleccione una mesa</option>
                                {tables.map((table) => (
                                    <option key={table._id} value={table._id}>
                                        Mesa {table.tableNumber} {table.restaurant?.name ? `- ${table.restaurant.name}` : ""}
                                    </option>
                                ))}
                            </select>
                            {errors.table && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.table.message}</p>}
                        </div>

{/* Fecha y Hora */}
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                                Fecha y Hora
                            </label>
                            <input
                                type="datetime-local"
                                min={minDateTime}
                                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--ring-color)] transition"
                                {...register("reservationDate", {
                                    required: "La fecha y hora son requeridas",
                                    validate: value => {
                                        // Validate past dates
                                        if (new Date(value) <= new Date()) {
                                            return "La fecha de reservación no puede ser en el pasado";
                                        }
                                        // Validate restaurant hours
                                        if (restaurantOpening && restaurantClosing) {
                                            const reservationDate = new Date(value);
                                            const timeStr = reservationDate.toTimeString().slice(0, 5); // HH:MM
                                            if (timeStr < restaurantOpening || timeStr >= restaurantClosing) {
                                                return `El horario debe estar entre ${restaurantOpening} y ${restaurantClosing}`;
                                            }
                                        }
                                    }
                                })}
                            />
                            {errors.reservationDate && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.reservationDate.message}</p>}
                            {restaurantOpening && restaurantClosing && (
                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                    Horario del restaurante: {restaurantOpening} - {restaurantClosing}
                                </p>
                            )}
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
                                    required: "El número de personas es requerido",
                                    valueAsNumber: true,
                                    min: { value: 1, message: "El número de personas debe ser entre 1 y 20" },
                                    max: { value: 20, message: "El número de personas debe ser entre 1 y 20" }
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
                                    required: "La duración es requerida",
                                    valueAsNumber: true,
                                    min: { value: 15, message: "Mínimo 15 minutos" }
                                })}
                            />
                            {errors.durationInMinutes && <p className="text-[var(--color-brand-red)] text-xs mt-1">{errors.durationInMinutes.message}</p>}
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
                            disabled={localLoading || Object.keys(errors).length > 0}
                            className="w-full sm:w-auto px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {localLoading ? <Spinner /> : reservation ? "Guardar Cambios" : "Crear Reservación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};