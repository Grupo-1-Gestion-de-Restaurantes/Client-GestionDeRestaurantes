import { useEffect } from "react";
import { useInvoiceStore } from "../store/useInvoiceStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";

export const Invoices = () => {
    const { invoices, loading, error, getInvoices } = useInvoiceStore();

    useEffect(() => {
        getInvoices();
    }, [getInvoices]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

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
                        {invoices.length > 0 ? (
                            invoices.map((inv) => (
                                <tr key={inv._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                                        {inv.invoiceNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        {new Date(inv.issuedAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {inv.clientName || inv.client || "Consumidor Final"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {inv.restaurantName || inv.restaurant || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {inv.items && inv.items.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {inv.items.map((item, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="inline-block px-2 py-1 text-xs bg-[var(--bg-surface-alt)] border border-[var(--border-color)] rounded-md whitespace-nowrap"
                                                    >
                                                        {item.quantity}x {item.name} (${item.price})
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[var(--text-muted)] italic">Sin artículos</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-800 border border-gray-200">
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