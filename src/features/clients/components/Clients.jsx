import { useState, useEffect } from "react";
import { useClientStore } from "../store/useClientStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { ClientModal } from "./ClientModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Clients = () => {
    const { clients, loading, error, getClients, deleteClient } = useClientStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getClients();
    }, [getClients]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const activeClients = clients.filter((c) => c.isActive === true);

    if (loading && activeClients.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Clientes
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Administra y consulta los registros y perfiles de los clientes
                    </p>
                </div>
                
            </div>

            {/* TABLA RESPONSIVE */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nombre</th>
                            <th className="px-6 py-4 font-semibold">Correo</th>
                            <th className="px-6 py-4 font-semibold">Teléfono</th>
                            <th className="px-6 py-4 font-semibold">F. Nacimiento</th>
                            <th className="px-6 py-4 font-semibold">Género</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {activeClients.length > 0 ? (
                            activeClients.map((client) => (
                                <tr key={client._id || client.email} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                                        {client.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {client.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {client.phone}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        {client.birthdate ? new Date(client.birthdate).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {client.gender}
                                    </td>
                                    <td className="px-6 py-4 flex gap-3 justify-center">
                                        <button
                                            className=" hover:text-[var(--color-brand-yellow)] font-medium transition cursor-pointer"
                                            onClick={() => {
                                                setSelectedClient(client);
                                                setOpenModal(true);
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium transition cursor-pointer"
                                            onClick={() =>
                                                openConfirm({
                                                    title: "Eliminar Cliente",
                                                    message: `¿Estás seguro de desactivar al cliente ${client.name || ''}?`,
                                                    onConfirm: () => deleteClient(client._id)
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
                                    No hay clientes registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ClientModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedClient(null);
                }}
                client={selectedClient}
            />
        </div>
    );
};