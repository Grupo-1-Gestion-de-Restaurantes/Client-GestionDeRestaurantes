import { useState, useEffect } from "react";
import { useReservationStore } from "../store/useReservationStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { ReservationModal } from "./ReservationModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Reservations = () => {
    const { reservations, loading, error, getReservations, deleteReservation } = useReservationStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getReservations();
    }, [getReservations]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMADA': return 'bg-green-100 text-green-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELADA': return 'bg-red-100 text-red-800';
            case 'COMPLETADA': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

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
                    + Agregar Reservación
                </button>
            </div>

            {/* TABLA RESPONSIVE */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Mesa</th>
                            <th className="px-6 py-4 font-semibold">Personas</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {reservations.length > 0 ? (
                            reservations.map((res) => (
                                <tr key={res._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] whitespace-nowrap">
                                        {new Date(res.reservationDate).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {/* Adaptar dependiendo de si backend manda objeto poblado o solo string */}
                                        {res.client?.name || res.client || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {res.table?.number || res.table || "N/A"}
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
                                            className="text-[var(--color-brand-dark)] hover:text-[var(--color-brand-yellow)] font-medium transition"
                                            onClick={() => {
                                                setSelectedReservation(res);
                                                setOpenModal(true);
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium transition"
                                            onClick={() =>
                                                openConfirm({
                                                    title: "Eliminar Reservación",
                                                    message: `¿Estás seguro de eliminar esta reservación?`,
                                                    onConfirm: () => deleteReservation(res._id)
                                                })
                                            }
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-[var(--text-muted)]">
                                    No hay reservaciones registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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