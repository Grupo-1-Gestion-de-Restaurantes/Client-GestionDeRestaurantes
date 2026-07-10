import { useState, useEffect, useMemo } from "react";
import { usePartnerLeadsStore } from "../store/usePartnerLeadsStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import {
    ClipboardList,
    Eye,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Utensils,
    Users,
    Filter,
    BadgeCheck,
    Search
} from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { PartnerLeadModal } from "./PartnerLeadModal.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";

export const PartnersLeads = () => {
    const { leads, loading, error, getLeads, updateStatus, pagination } = usePartnerLeadsStore();
    const [selectedLead, setSelectedLead] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { openConfirm } = useUIStore();
    
    // Filtros
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const params = { page: 1 };
        if (statusFilter !== "all") {
            params.status = statusFilter;
        }
        getLeads(params);
    }, [getLeads, statusFilter]);

    const handlePageChange = (page) => {
        const params = { page };
        if (statusFilter !== "all") {
            params.status = statusFilter;
        }
        getLeads(params);
    };

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    // Filtrar localmente por búsqueda
    const filteredLeads = useMemo(() => {
        if (!searchTerm.trim()) return leads;
        const term = searchTerm.toLowerCase().trim();
        return leads.filter(lead => 
            lead.restaurantName.toLowerCase().includes(term) ||
            lead.contactName.toLowerCase().includes(term) ||
            lead.email.toLowerCase().includes(term) ||
            lead.city.toLowerCase().includes(term) ||
            lead.cityAddress.toLowerCase().includes(term)
        );
    }, [leads, searchTerm]);

    const handleUpdateStatus = async (id, status, restaurantName) => {
        const action = status === 'APPROVED' ? 'aprobar' : 'rechazar';
        openConfirm({
            title: `${status === 'APPROVED' ? 'Aprobar' : 'Rechazar'} Solicitud`,
            message: `¿Estás seguro de que deseas ${action} la solicitud de "${restaurantName}"?`,
            onConfirm: async () => {
                try {
                    await updateStatus(id, status);
                    showSuccess(`Solicitud ${status === 'APPROVED' ? 'aprobada' : 'rechazada'} exitosamente`);
                    setIsModalOpen(false);
                } catch (err) {
                    // El error ya lo maneja el store/useEffect
                }
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "APPROVED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "REJECTED": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300";
        }
    };

    if (loading && leads.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Solicitudes de Registro
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Gestiona las peticiones de nuevos restaurantes para unirse a la plataforma
                    </p>
                </div>
            </div>

            {/* FILTROS */}
            <div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1 lg:w-auto">
                        <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Search} />
                                Buscar solicitudes
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)]" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Buscar por restaurante, contacto, email o ciudad"
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-brand-dark)]"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-48">
                        <label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Filter} />
                                Estado
                            </span>
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="all">Todos</option>
                            <option value="PENDING">PENDING</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setStatusFilter("all");
                            setSearchTerm("");
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

            {/* TABLA */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Contacto</th>
                            <th className="px-6 py-4 font-semibold">Ciudad</th>
                            <th className="px-6 py-4 font-semibold">Categoría</th>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filteredLeads.length > 0 ? (
                            filteredLeads.map((lead) => (
                                <tr key={lead._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[var(--text-primary)]">{lead.restaurantName}</div>
                                        <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                            <LucideMotionIcon icon={MapPin} className="!w-3 !h-3" />
                                            {lead.cityAddress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-[var(--text-primary)]">{lead.contactName}</div>
                                        <div className="text-xs text-[var(--text-muted)]">{lead.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {lead.city}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                                            {lead.categories}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(lead.status)}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
                                                title="Inspeccionar"
                                                onClick={() => {
                                                    setSelectedLead(lead);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <LucideMotionIcon icon={Eye} className="!w-5 !h-5" />
                                            </button>
                                            
                                            {lead.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors dark:hover:bg-green-900/20"
                                                        title="Aprobar"
                                                        onClick={() => handleUpdateStatus(lead._id, 'APPROVED', lead.restaurantName)}
                                                    >
                                                        <LucideMotionIcon icon={CheckCircle} className="!w-5 !h-5" />
                                                    </button>
                                                    <button
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
                                                        title="Rechazar"
                                                        onClick={() => handleUpdateStatus(lead._id, 'REJECTED', lead.restaurantName)}
                                                    >
                                                        <LucideMotionIcon icon={XCircle} className="!w-5 !h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-[var(--text-muted)]">
                                    No hay solicitudes pendientes.
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

            {selectedLead && (
                <PartnerLeadModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    lead={selectedLead}
                    onApprove={() => handleUpdateStatus(selectedLead._id, 'APPROVED', selectedLead.restaurantName)}
                    onReject={() => handleUpdateStatus(selectedLead._id, 'REJECTED', selectedLead.restaurantName)}
                />
            )}
        </div>
    );
};