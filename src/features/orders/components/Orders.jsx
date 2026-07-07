import { useState, useEffect } from "react";
import { useOrderStore } from "../store/useOrdersStore.js";
import { useClientStore } from "../../clients/store/useClientStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useAuthStore } from "../../../features/auth/store/useAuthStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { OrderModal } from "../components/OrderModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { PencilLine, Trash2, Search, Plus, Filter, BadgeCheck } from "lucide-react";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination.jsx";

export const Orders = () => {
    const { orders, loading, error, getOrders, deleteOrder, updateOrder, updateOrderStatus, pagination } = useOrderStore();
    const { clients, getClients } = useClientStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN_ROLE";
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [restaurantFilter, setRestaurantFilter] = useState("");
    const { openConfirm } = useUIStore();

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, { status: newStatus });

            console.log("¡Estado actualizado con éxito!");
        } catch (error) {
            alert("No se pudo actualizar el estado");
            console.error(error);
        }
    };

    useEffect(() => {
        const params = {};
        if (activeFilter === "CANCELADO") {
            params.isActive = "false";
        } else if (activeFilter === "all") {
            params.isActive = "all";
        } else {
            params.isActive = "true";
        }

        if (isAdmin && restaurantFilter) {
            params.restaurant = restaurantFilter;
        }
        
        getOrders(params);
        getClients();
        getRestaurants({ isActive: true, limit: 100 });
    }, [getOrders, activeFilter, restaurantFilter, isAdmin]);

    const handlePageChange = (page) => {
        const params = { page };
        if (activeFilter === "CANCELADO") {
            params.isActive = "false";
        } else if (activeFilter === "all") {
            params.isActive = "all";
        } else {
            params.isActive = "true";
        }

        if (isAdmin && restaurantFilter) {
            params.restaurant = restaurantFilter;
        }
        getOrders(params);
    };

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'CONFIRMADO': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'EN_CAMINO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'LISTO_PARA_RECOGER': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CANCELADO': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'ENTREGADO': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'EN_PREPARACION': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300';
        }
    };

    const getSelectStyle = (status) => {
        const base = 'px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-offset-2 transition-colors text-[var(--text-primary)] dark:text-[var(--text-primary)]';
        const statusStyle = getStatusStyle(status);
        return `${base} ${statusStyle}`;
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

    // Filtramos las órdenes
    const displayedOrders = orders.filter((order) => {
        // El filtrado por isActive ya lo hace el backend mediante activeFilter -> isActive param
        if (activeFilter !== "all" && activeFilter !== "CANCELADO" && order.status !== activeFilter) return false;
        
        const clientName = getClientName(order.client).toLowerCase();
        return clientName.includes(searchTerm.toLowerCase());
    });

    if (loading && orders.length === 0) return <Spinner />;

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
                    <span className="inline-flex items-center gap-2">
                        <LucideMotionIcon icon={Plus} className="!w-4 !h-4 md:!w-5 md:!h-5 text-white dark:text-[var(--text-primary)]" />
                        Agregar Pedido
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
                                Buscar pedidos
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
                                Estado
                            </span>
                        </label>
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="CONFIRMADO">CONFIRMADO</option>
                            <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                            <option value="LISTO_PARA_RECOGER">LISTO PARA RECOGER</option>
                            <option value="EN_CAMINO">EN CAMINO</option>
                            <option value="ENTREGADO">ENTREGADO</option>
                            <option value="CANCELADO">CANCELADO</option>
                        </select>
                    </div>

                    {isAdmin && (
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
                                <option value="">Todos los restaurantes</option>
                                {restaurants?.map((r) => (
                                    <option key={r._id} value={r._id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setActiveFilter("all");
                            setRestaurantFilter("");
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
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold">Total</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {displayedOrders.length > 0 ? (
                            displayedOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-[var(--bg-base)] transition-colors">
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {getClientName(order.client)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {getRestaurantName(order.restaurant)}
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
                                            className={getSelectStyle(order.status)}
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
                                            className="inline-flex items-center gap-2 text-[var(--color-brand-yellow)] hover:opacity-75 font-medium transition cursor-pointer"
                                            onClick={() => {
                                                setSelectedOrder(order);
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
                                                    title: "Eliminar Pedido",
                                                    message: `¿Estás seguro de eliminar este pedido?`,
                                                    onConfirm: () => deleteOrder(order._id)
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
                                    No hay pedidos registrados.
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