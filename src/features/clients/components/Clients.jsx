import { useState, useEffect } from "react";
import { useClientStore } from "../store/useClientStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { ClientModal } from "./ClientModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { PencilLine, Trash2, Search, Filter, BadgeCheck } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Clients = () => {
    const { clients, loading, error, filters, setFilters, getClients, deleteClient } = useClientStore();
    const { searchTerm, activeFilter } = filters;
    const [openModal, setOpenModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = { search: searchTerm.trim() };

            if (activeFilter !== "all") {
                params.isActive = activeFilter === "active";
            }

            getClients(params);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [getClients, activeFilter, searchTerm]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    if (loading && clients.length === 0) return <Spinner />;

    const emptyMessage = searchTerm.trim() || activeFilter !== "all"
        ? "No hay clientes con esos filtros."
        : "No hay clientes registrados.";

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

            {/* BUSCADOR Y FILTROS */}
            <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Search} />
                                Buscar clientes
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:translate-y-0 hover:scale-100 group-hover:translate-y-0 group-hover:scale-100" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                placeholder="Buscar por nombre, correo o teléfono"
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
                            setFilters({ searchTerm: "", activeFilter: "all" });
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
                            <th className="px-6 py-4 font-semibold">Nombre</th>
                            <th className="px-6 py-4 font-semibold">Correo</th>
                            <th className="px-6 py-4 font-semibold">Teléfono</th>
                            <th className="px-6 py-4 font-semibold">F. Nacimiento</th>
                            <th className="px-6 py-4 font-semibold">Género</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {clients.length > 0 ? (
                            clients.map((client) => (
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {client.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                                Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex gap-3 justify-center">
                                        <button
                                            className="inline-flex items-center gap-2 text-[var(--color-brand-yellow)] hover:opacity-75 font-medium transition cursor-pointer"
                                            onClick={() => {
                                                setSelectedClient(client);
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
                                                    title: "Eliminar Cliente",
                                                    message: `¿Estás seguro de desactivar al cliente ${client.name || ''}?`,
                                                    onConfirm: () => deleteClient(client._id)
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
                                <td colSpan="7" className="text-center py-8 text-[var(--text-muted)] italic">
                                    {emptyMessage}
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