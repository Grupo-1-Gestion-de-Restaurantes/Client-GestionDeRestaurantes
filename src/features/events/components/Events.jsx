import { useState, useEffect, useMemo } from "react";
import { useEventStore } from "../store/useEventsStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { EventModal } from "./EventModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { Search, Filter, BadgeCheck, Plus, PencilLine, Trash2, Users, Utensils, Briefcase, Table as TableIcon } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Events = () => {
    const { events, loading, error, getEvents, deleteEvent } = useEventStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [restaurantFilter, setRestaurantFilter] = useState("all");
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getEvents();
        if (getRestaurants) getRestaurants();
    }, [getEvents, getRestaurants]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const filteredEvents = useMemo(() => {
        return events.filter((evt) => {
            if (!evt.isActive) return false;

            const matchesSearch = evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                evt.typeEvent.toLowerCase().includes(searchTerm.toLowerCase());
            
            const restaurantId = typeof evt.restaurant === "object" ? evt.restaurant?._id : evt.restaurant;
            const matchesRestaurant = restaurantFilter === "all" || restaurantId === restaurantFilter;

            return matchesSearch && matchesRestaurant;
        });
    }, [events, searchTerm, restaurantFilter]);

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

    const formatType = (type) => {
        if (!type) return "N/A";
        return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (loading && filteredEvents.length === 0) return <Spinner />;

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
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent cursor-pointer"
                >
                    <span className="inline-flex items-center gap-2">
                        <LucideMotionIcon icon={Plus} className="!w-4 !h-4 md:!w-5 md:!h-5 text-white dark:text-[var(--text-primary)]" />
                        Crear Evento
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
                                Buscar eventos
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)]" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre o categoría..."
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
                            <th className="px-6 py-4 font-semibold">Evento / Categoría</th>
                            <th className="px-6 py-4 font-semibold">Sede Sede Anfitriona</th>
                            <th className="px-6 py-4 font-semibold">Fecha de Ejecución</th>
                            <th className="px-6 py-4 font-semibold">Aforo (Inscritos)</th>
                            <th className="px-6 py-4 font-semibold">Recursos</th>
                            <th className="px-6 py-4 font-semibold">Servicios</th>
                            <th className="px-6 py-4 font-semibold">Precio</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((evt) => {
                                const attendeeCount = evt.attendees?.length || 0;
                                const tableCount = evt.assignedTables?.length || 0;
                                const dishCount = evt.specialDishes?.length || 0;
                                const staffCount = evt.assignedEmployees?.length || 0;

                                return (
                                    <tr key={evt._id} className="hover:bg-[var(--bg-base)] transition-colors align-middle">
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-bold text-[var(--text-primary)]">{evt.name}</div>
                                            <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{formatType(evt.typeEvent)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="bg-blue-50/60 dark:bg-blue-900/10 px-3 py-1.5 rounded-lg border border-blue-100/40 dark:border-blue-800/20 inline-block min-w-[160px]">
                                                {renderRestaurantInfo(evt.restaurant)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                                            {formatEventDate(evt.dateTime)}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} className="text-[var(--text-muted)]" />
                                                    <span className="font-bold text-[var(--text-primary)]">{attendeeCount} / {evt.capacity}</span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${attendeeCount >= evt.capacity ? 'bg-red-500' : 'bg-green-500'}`} 
                                                        style={{ width: `${Math.min((attendeeCount / evt.capacity) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3 text-[var(--text-secondary)]">
                                                <div title="Mesas" className="flex items-center gap-1">
                                                    <TableIcon size={14} /> {tableCount}
                                                </div>
                                                <div title="Platos" className="flex items-center gap-1">
                                                    <Utensils size={14} /> {dishCount}
                                                </div>
                                                <div title="Staff" className="flex items-center gap-1">
                                                    <Briefcase size={14} /> {staffCount}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                {evt.additionalServices?.map((service, idx) => (
                                                    <span key={idx} className="px-1.5 py-0.5 rounded bg-[var(--bg-surface-alt)] border border-[var(--border-color)] text-[10px] font-medium uppercase tracking-tighter">
                                                        {service.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                                {(!evt.additionalServices || evt.additionalServices.length === 0) && (
                                                    <span className="text-[var(--text-muted)] italic text-[10px]">Básico</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono font-bold text-[var(--text-primary)] whitespace-nowrap">
                                            Q {Number(evt.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 flex gap-3 justify-center">
                                            <button
                                                className="inline-flex items-center gap-2 text-[var(--color-brand-yellow)] hover:text-[var(--color-brand-yellow-dark)] font-medium transition cursor-pointer"
                                                onClick={() => {
                                                    setSelectedEvent(evt);
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
                                                        title: "Eliminar Evento",
                                                        message: `¿Estás seguro de eliminar el evento "${evt.name}"?`,
                                                        onConfirm: () => deleteEvent(evt._id)
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
                                <td colSpan="8" className="text-center py-8 text-[var(--text-muted)] italic">
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