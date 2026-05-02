import { useState, useEffect } from "react";
import { useRestaurantStore } from "../store/useRestaurantStore";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { useEffect as useToastEffect } from "react";
import { showError } from "../../../shared/utils/toast.js";
import { RestaurantModal } from "./RestaurantModal.jsx";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";

export const Restaurants = () => {
    const { restaurants, loading, error, getRestaurants, deleteRestaurant } = useRestaurantStore();
    const [openModal, setOpenModal] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const { openConfirm } = useUIStore();

    useEffect(() => {
        getRestaurants();
    }, [getRestaurants]);

    useToastEffect(() => {
        if (error) showError(error);
    }, [error]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Abierto":          return "bg-green-100 text-green-800";
            case "Cerrado":          return "bg-red-100 text-red-800";
            case "En Mantenimiento": return "bg-yellow-100 text-yellow-800";
            default:                 return "bg-gray-100 text-gray-800";
        }
    };

    const getCategoryStyle = (category) => {
        switch (category) {
            case "Gourmet": return "bg-purple-100 text-purple-800";
            case "Casual":  return "bg-blue-100 text-blue-800";
            default:        return "bg-gray-100 text-gray-800";
        }
    };

    if (loading && restaurants.length === 0) return <Spinner />;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Gestión de Restaurantes
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        Administra los restaurantes registrados
                    </p>
                </div>

                <button
                    onClick={() => {
                        setOpenModal(true);
                        setSelectedRestaurant(null);
                    }}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow bg-[var(--color-brand-dark)] text-white border border-transparent hover:bg-[var(--color-brand-red)] dark:bg-[var(--bg-surface-alt)] dark:text-[var(--text-primary)] dark:border-[var(--border-color)] dark:hover:bg-[var(--color-brand-yellow)] dark:hover:text-[var(--color-brand-dark)] dark:hover:border-transparent"
                >
                    + Agregar Restaurante
                </button>
            </div>

            {/* TABLA */}
            <div className="bg-[var(--bg-surface)] rounded-xl shadow-md border border-[var(--border-color)] overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Restaurante</th>
                            <th className="px-6 py-4 font-semibold">Categoría</th>
                            <th className="px-6 py-4 font-semibold">Horario</th>
                            <th className="px-6 py-4 font-semibold">Precio Prom.</th>
                            <th className="px-6 py-4 font-semibold">Capacidad</th>
                            <th className="px-6 py-4 font-semibold">Teléfono</th>
                            <th className="px-6 py-4 font-semibold">Rating</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold">Activo</th>
                            <th className="px-6 py-4 font-semibold text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[var(--border-color)]">
                        {restaurants.length > 0 ? (
                            restaurants.map((restaurant) => (
                                <tr
                                    key={restaurant._id}
                                    className="hover:bg-[var(--bg-base)] transition-colors"
                                >
                                    {/* Nombre + dirección + foto */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {restaurant.photo ? (
                                                <img
                                                    src={restaurant.photo}
                                                    alt={restaurant.name}
                                                    className="w-10 h-10 rounded-lg object-cover border border-[var(--border-color)] shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-color)] flex items-center justify-center text-lg shrink-0">
                                                    🍽️
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                                    {restaurant.name}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)] truncate max-w-[180px]">
                                                    📍 {restaurant.address}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Categoría */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getCategoryStyle(restaurant.categories)}`}>
                                            {restaurant.categories}
                                        </span>
                                    </td>

                                    {/* Horario */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        🕐 {restaurant.openingTime} – {restaurant.closingTime}
                                    </td>

                                    {/* Precio promedio */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        Q{restaurant.averagePrice}
                                    </td>

                                    {/* Capacidad */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        👥 {restaurant.capacity} personas
                                    </td>

                                    {/* Teléfono */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        📞 {restaurant.phone}
                                    </td>

                                    {/* Rating */}
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                        {"⭐".repeat(restaurant.rating)} {restaurant.rating}/5
                                    </td>

                                    {/* Estado */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(restaurant.status)}`}>
                                            {restaurant.status}
                                        </span>
                                    </td>

                                    {/* isActive */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                            restaurant.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {restaurant.isActive ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3 justify-center">
                                            <button
                                                className="text-[var(--color-brand-dark)] hover:text-[var(--color-brand-yellow)] font-medium transition"
                                                onClick={() => {
                                                    setSelectedRestaurant(restaurant);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                className="text-[var(--color-brand-red)] hover:opacity-70 font-medium transition"
                                                onClick={() =>
                                                    openConfirm({
                                                        title: "Eliminar Restaurante",
                                                        message: `¿Estás seguro de eliminar "${restaurant.name}"?`,
                                                        onConfirm: () => deleteRestaurant(restaurant._id),
                                                    })
                                                }
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="text-center py-8 text-[var(--text-muted)]"
                                >
                                    No hay restaurantes registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <RestaurantModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedRestaurant(null);
                }}
                restaurant={selectedRestaurant}
            />
        </div>
    );
};