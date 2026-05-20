import { 
    X, 
    Check, 
    XCircle, 
    MapPin, 
    Mail, 
    Phone, 
    Clock, 
    Users, 
    Info,
    LayoutDashboard
} from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const PartnerLeadModal = ({ isOpen, onClose, lead, onApprove, onReject }) => {
    if (!isOpen || !lead) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--bg-surface)] w-full max-w-2xl rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <LucideMotionIcon icon={LayoutDashboard} />
                        Detalles de Solicitud
                    </h3>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Información del Restaurante */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-brand-red)] mb-4">Información del Restaurante</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Nombre</label>
                                    <p className="text-[var(--text-primary)] font-medium">{lead.restaurantName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Dirección</label>
                                    <p className="text-[var(--text-primary)] flex items-start gap-1.5 mt-1">
                                        <MapPin size={16} className="shrink-0 mt-0.5" />
                                        {lead.cityAddress}, {lead.city}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Categoría</label>
                                        <p className="text-[var(--text-primary)]">{lead.categories}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Capacidad</label>
                                        <p className="text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                                            <Users size={16} />
                                            {lead.capacity} personas
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Horario</label>
                                    <p className="text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                                        <Clock size={16} />
                                        {lead.openingTime} – {lead.closingTime}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-brand-red)] mb-4">Información de Contacto</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Nombre del Solicitante</label>
                                    <p className="text-[var(--text-primary)] font-medium">{lead.contactName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Email</label>
                                    <p className="text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                                        <Mail size={16} />
                                        {lead.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Teléfono</label>
                                    <p className="text-[var(--text-primary)] flex items-center gap-1.5 mt-1">
                                        <Phone size={16} />
                                        {lead.phone}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] uppercase font-semibold">Mensaje/Descripción</label>
                                    <p className="text-[var(--text-primary)] text-sm bg-[var(--bg-surface-alt)] p-3 rounded-lg border border-[var(--border-color)] mt-1 italic">
                                        "{lead.message || "Sin descripción adicional"}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-surface-alt)] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-base)] rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                    
                    {lead.status === 'PENDING' && (
                        <>
                            <button
                                onClick={onReject}
                                className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <XCircle size={18} />
                                Rechazar
                            </button>
                            <button
                                onClick={onApprove}
                                className="px-4 py-2 text-sm font-medium bg-green-600  hover:bg-green-700 shadow-lg shadow-green-600/20 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Check size={18} />
                                Aprobar y Activar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};