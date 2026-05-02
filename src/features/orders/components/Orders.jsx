import { useState, useEffect } from "react";
import { useOrderStore } from "../store/useOrdersStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { OrderModal } from "../components/OrderModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Orders = () => {
    const { orders, loading, error, getOrders, deleteOrder, updateOrder } = useOrderStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { openConfirm } = useUIStore();

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrder(orderId, { status: newStatus });

            console.log("¡Estado actualizado con éxito!");
        } catch (error) {
            alert("No se pudo actualizar el estado");
            console.error(error);
        }
    };

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMADO': return 'bg-green-100 text-green-800';
            case 'EN_CAMINO': return 'bg-blue-100 text-blue-800';
            case 'LISTO_PARA_RECOGER': return 'bg-indigo-100 text-indigo-800';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELADO': return 'bg-red-100 text-red-800';
            case 'ENTREGADO': return 'bg-green-200 text-green-900';
            case 'EN_PREPARACION': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Filtramos las órdenes activas
    const activeOrders = orders.filter((order) => order.isActive !== false);

    if (loading && activeOrders.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Pedidos
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Administra y consulta los pedidos de los clientes
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedOrder(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                >
                    + Agregar Pedido
                </button>
            </div>

            {/* TABLA RESPONSIVE */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold">Total</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {activeOrders.length > 0 ? (
                            activeOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {order.client?.name || order.client || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        <span className="text-xs font-mono bg-[var(--bg-base)] px-2 py-1 rounded">
                                            {order.deliveryType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">
                                        Q{order.total?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-offset-2 transition-colors ${getStatusStyle(order.status)}`}
                                        >
                                            <option value="PENDIENTE">PENDIENTE</option>
                                            <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                                            <option value="LISTO_PARA_RECOGER">LISTO PARA RECOGER</option>
                                            <option value="EN_CAMINO">EN CAMINO</option>
                                            <option value="CONFIRMADO">CONFIRMADO</option>
                                            <option value="ENTREGADO">ENTREGADO</option>
                                            <option value="CANCELADO">CANCELADO</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 flex gap-3 justify-center">
                                        <button
                                            className="text-[var(--color-brand-red)] hover:text-[var(--color-brand-red-dark)] font-medium transition"
                                            onClick={() =>
                                                openConfirm({
                                                    title: "Eliminar Pedido",
                                                    message: `¿Estás seguro de eliminar este pedido?`,
                                                    onConfirm: () => deleteOrder(order._id)
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
                                    No hay pedidos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <OrderModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
            />
        </div>
    );
};