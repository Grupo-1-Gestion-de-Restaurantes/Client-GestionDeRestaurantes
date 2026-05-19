import { useEffect, useState, useMemo } from "react";
import { useInvoiceStore } from "../store/useInvoiceStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { Search, Filter, BadgeCheck } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Invoices = () => {
    const { invoices, loading, error, getInvoices } = useInvoiceStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("all");

    useEffect(() => {
        getInvoices();
    }, [getInvoices]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter((inv) => {
            const matchesSearch = 
                inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.restaurantName || "").toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesPayment = paymentFilter === "all" || inv.paymentMethod === paymentFilter;

            return matchesSearch && matchesPayment;
        });
    }, [invoices, searchTerm, paymentFilter]);

    const getClientName = (client, clientName) => {
        if (clientName) return clientName;
        if (client && typeof client === "object") {
            return client.name || client.username || "N/A";
        }
        return "N/A";
    };

    const getRestaurantName = (restaurant, restaurantName) => {
        if (restaurantName) return restaurantName;
        if (restaurant && typeof restaurant === "object") {
            return restaurant.name || "N/A";
        }
        return "N/A";
    };

    const getItemName = (item) => item.name || item.dish?.name || item.product?.name || "Plato sin nombre";

    if (loading && invoices.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Historial de Facturas
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Consulta las facturas emitidas (solo lectura)
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
                                Buscar facturas
                            </span>
                        </label>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
                                <LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)]" />
                            </span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por No. Factura, cliente o restaurante..."
                                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)] placeholder:text-[var(--text-muted)]"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-64">
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            <span className="inline-flex items-center gap-2">
                                <LucideMotionIcon icon={Filter} />
                                Pago
                            </span>
                        </label>
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="all">Todos</option>
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="TARJETA">Tarjeta</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setPaymentFilter("all");
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
                            <th className="px-6 py-4 font-semibold">No. Factura</th>
                            <th className="px-6 py-4 font-semibold">Emisión</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Artículos</th>
                            <th className="px-6 py-4 font-semibold">Método de Pago</th>
                            <th className="px-6 py-4 font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((inv) => (
                                <tr key={inv._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                                        {inv.invoiceNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        {new Date(inv.issuedAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {getClientName(inv.client, inv.clientName)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {getRestaurantName(inv.restaurant, inv.restaurantName)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {inv.items && inv.items.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {inv.items.map((item, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="inline-block px-2 py-1 text-xs bg-[var(--bg-surface-alt)] border border-[var(--border-color)] rounded-md whitespace-nowrap"
                                                    >
                                                        {item.quantity}x {getItemName(item)} (Q{item.price.toFixed(2)})
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[var(--text-muted)] italic">Sin artículos</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium border ${inv.paymentMethod === 'TARJETA' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'}`}>
                                            {inv.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">
                                        Q{inv.total?.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-[var(--text-muted)]">
                                    No hay facturas emitidas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};