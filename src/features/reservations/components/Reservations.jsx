import { useState, useEffect } from "react";
import { useReservationStore } from "../store/useReservationStore.js";
import { useClientStore } from "../../clients/store/useClientStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useTableStore } from "../../tables/store/useTableStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { ReservationModal } from "./ReservationModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { PencilLine, Trash2, Search, Plus, Filter, BadgeCheck } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";

export const Reservations = () => {
    const { reservations, loading, error, getReservations, deleteReservation, pagination } = useReservationStore();
    const { clients, getClients } = useClientStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { tables, getTables } = useTableStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const { openConfirm } = useUIStore();

    useEffect(() => {
        const params = { page: 1 };
        if (activeFilter !== "all") {
            params.isActive = activeFilter === "active";
        } else {
            params.isActive = "all";
        }
        getReservations(params);
        getClients();
        getRestaurants({ isActive: true, limit: 100 });
        getTables({ isActive: true, limit: 100 });
    }, [getReservations, activeFilter]);

    const handlePageChange = (page) => {
        const params = { page };
        if (activeFilter !== "all") {
            params.isActive = activeFilter === "active";
        } else {
            params.isActive = "all";
        }
        getReservations(params);
    };

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMADA': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CANCELADA': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'COMPLETADA': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'NO_ASISTIO': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300';
        }
    };

    const getClientName = (client) => {
        if (client && typeof client === "object") {
            return client.name || client.username || "N/A";
        }

        const foundClient = clients.find((item) => item._id === client);
        return foundClient?.name || foundClient?.username || "N/A";
    };

    const getRestaurantName = (restaurant) => {
        if (restaurant && typeof restaurant === "object") {
            return restaurant.name || "N/A";
        }

        const foundRestaurant = restaurants.find((item) => item._id === restaurant);
        return foundRestaurant?.name || "N/A";
    };

    const getTableName = (table) => {
        if (table && typeof table === "object") {
            return table.tableNumber ? `Mesa ${table.tableNumber}` : "N/A";
        }

        const foundTable = tables.find((item) => item._id === table);
        return foundTable?.tableNumber ? `Mesa ${foundTable.tableNumber}` : "N/A";
    };

    const displayedReservations = reservations.filter((res) => {
        // El filtrado por isActive ya lo hace el backend mediante activeFilter -> isActive param
        const clientName = getClientName(res.client).toLowerCase();
        return clientName.includes(searchTerm.toLowerCase());
    });

    if (loading && reservations.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Reservaciones
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Administra y consulta las reservaciones de los clientes
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedReservation(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                >
                    <span className="inline-flex items-center gap-2">
                        <LucideMotionIcon icon={Plus} className="!w-4 !h-4 md:!w-5 md:!h-5 text-white dark:text-[var(--text-primary)]" />
                        Agregar Reservación
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
                                Buscar reservaciones
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:translate-y-0 hover:scale-100 group-hover:translate-y-0 group-hover:scale-100" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre de cliente..."
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
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="active">Activas</option>
                            <option value="inactive">Inactivas</option>
                            <option value="all">Todas</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setActiveFilter("active");
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
                            <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Mesa</th>
                            <th className="px-6 py-4 font-semibold">Personas</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {displayedReservations.length > 0 ? (
                            displayedReservations.map((res) => (
                                <tr key={res._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] whitespace-nowrap">
                                        {new Date(res.reservationDate).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {getClientName(res.client)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {getRestaurantName(res.restaurant)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {getTableName(res.table)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] text-center">
                                        {res.numberOfPeople}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-3 justify-center">
                                        <button
                                            className="inline-flex items-center gap-2 text-[var(--color-brand-yellow)] hover:text-[var(--color-brand-yellow-dark)] font-medium transition cursor-pointer"
                                            onClick={() => {
                                                setSelectedReservation(res);
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
                                                    title: "Eliminar Reservación",
                                                    message: `¿Estás seguro de eliminar esta reservación?`,
                                                    onConfirm: () => deleteReservation(res._id)
                                                })
                                            }
                                        >
                                            <LucideMotionIcon icon={Trash2} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-[var(--text-muted)]">
                                    No hay reservaciones registradas.
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

            <ReservationModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedReservation(null);
                }}
                reservation={selectedReservation}
            />
        </div>
    );
};