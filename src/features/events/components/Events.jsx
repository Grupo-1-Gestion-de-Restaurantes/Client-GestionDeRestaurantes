import { useState, useEffect } from "react";
import { useEventStore } from "../store/useEventsStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { EventModal } from "./EventModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Events = () => {
    const { events, loading, error, getEvents, deleteEvent } = useEventStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getEvents();
        if (getRestaurants) getRestaurants();
    }, [getEvents, getRestaurants]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const activeEvents = events.filter((e) => e.isActive === true);

    const renderRestaurantInfo = (restaurantField) => {
        if (!restaurantField) return <span className="text-[var(--text-muted)] italic text-xs">Sin asignar</span>;
        let found = null;
        if (typeof restaurantField === "object" && restaurantField.name) {
            found = restaurantField;
        } else {
            found = restaurants?.find((r) => r._id === String(restaurantField));
        }
        if (found) {
            return (
                // 💡 items-start asegura que todo se alinee perfectamente al borde izquierdo
                <div className="flex flex-col items-start gap-0.5 text-left w-full">
                    <span className="font-semibold text-blue-700 dark:text-blue-400 text-xs">
                        {found.name}
                    </span>
                    {/* 💡 Se eliminó el pl-5 para que empiece exactamente en la misma línea vertical */}
                    <span className="text-[10px] text-[var(--text-muted)] max-w-[180px] truncate block italic">
                        {found.address || found.direccion || "Dirección no registrada"}
                    </span>
                </div>
            );
        }
        return <span className="text-[var(--text-muted)] text-xs">Cargando sede...</span>;
    };

    // Formateador dinámico para la fecha y hora
    const formatEventDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("es-GT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading && activeEvents.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Calendario de Eventos Especiales
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Planifica festivales, cenas temáticas y controla el aforo de cupos reservados
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedEvent(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent crusor-pointer"
                >
                    + Crear Evento
                </button>
            </div>

            {/* TABLA RESPONSIVE */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Evento / Categoría</th>
                            <th className="px-6 py-4 font-semibold">Sede Sede Anfitriona</th>
                            <th className="px-6 py-4 font-semibold">Fecha de Ejecución</th>
                            <th className="px-6 py-4 font-semibold">Cupos Libres</th>
                            <th className="px-6 py-4 font-semibold">Precio Entrada</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {activeEvents.length > 0 ? (
                            activeEvents.map((evt) => (
                                <tr key={evt._id} className="hover:bg-[var(--bg-base)] transition-colors align-middle">
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-bold text-[var(--text-primary)]">{evt.name}</div>
                                        <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{evt.typeEvent}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <div className="bg-blue-50/60 dark:bg-blue-900/10 px-3 py-1.5 rounded-lg border border-blue-100/40 dark:border-blue-800/20 inline-block min-w-[160px]">
                                            {renderRestaurantInfo(evt.restaurant)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                                        {formatEventDate(evt.dateTime)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)] whitespace-nowrap">
                                        {evt.capacity} cupos
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono font-bold text-[var(--text-primary)] whitespace-nowrap">
                                        Q {Number(evt.price).toFixed(2)}
                                    </td>
                                    {/* ACCIONES TOTALMENTE CENTRADAS */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                className="hover:text-[var(--color-brand-yellow)] font-medium text-sm flex items-center gap-1.5 transition cursor-pointer"
                                                onClick={() => {
                                                    setSelectedEvent(evt);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                ✏️ <span>Editar</span>
                                            </button>
                                            <button
                                                className="text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium text-sm flex items-center gap-1.5 transition cursor-pointer"
                                                onClick={() =>
                                                    openConfirm({
                                                        title: "Cancelar Evento",
                                                        message: `¿Estás seguro de cancelar por completo el evento "${evt.name}"? Se liberarán todos los cupos.`,
                                                        onConfirm: () => deleteEvent(evt._id)
                                                    })
                                                }
                                            >
                                                🗑️ <span>Eliminar</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-[var(--text-muted)] italic">
                                    No hay eventos planificados en la agenda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <EventModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedEvent(null);
                }}
                eventItem={selectedEvent}
            />
        </div>
    );
};