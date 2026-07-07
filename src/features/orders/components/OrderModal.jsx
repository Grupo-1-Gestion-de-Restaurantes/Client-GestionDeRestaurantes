import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSaveOrder } from "../hooks/UseSaveOrders.jsx";
import { useOrderStore } from "../store/useOrdersStore.js";
import { useClientStore } from "../../clients/store/useClientStore.js";
import { useRestaurantStore } from "../../restaurants/store/useRestaurantStore.js";
import { useDishStore } from "../../dishes/store/useDishStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { X, Trash2 } from "lucide-react";
import { useManagerRestaurant } from "../../../shared/hooks/useManagerRestaurant.js";

export const OrderModal = ({ isOpen, onClose, order }) => {
    const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            items: [{ dishId: "", quantity: 1 }] // Valor inicial para el array de items
        }
    });

    // Manejo dinámico de ítems
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const { saveOrder } = useSaveOrder();
    const loading = useOrderStore((state) => state.loading);
    const { clients, getClients } = useClientStore();
    const { restaurants, getRestaurants } = useRestaurantStore();
    const { dishes, getDishes } = useDishStore();
    const { isManager, myRestaurantId, myRestaurantName } = useManagerRestaurant();

    const selectedRestaurant = watch("restaurant");

    useEffect(() => {
        if (isManager && myRestaurantId) {
            setValue("restaurant", myRestaurantId);
        }
    }, [isManager, myRestaurantId, setValue]);

    useEffect(() => {
        getClients();
        getRestaurants({ isActive: true, limit: 100 });
        getDishes({ isActive: 'all', limit: 100 });

        if (order) {
            reset({
                client: order.client?._id || order.client,
                restaurant: order.restaurant?._id || order.restaurant,
                paymentMethod: order.paymentMethod,
                deliveryType: order.deliveryType || "DOMICILIO",
                "deliveryAddress.alias": order.deliveryAddress?.alias,
                "deliveryAddress.addressLine": order.deliveryAddress?.addressLine,
                items: order.items?.map(item => ({
                    dishId: item.productId?._id || item.productId,
                    quantity: item.quantity
                })) || [{ dishId: "", quantity: 1 }]
            });
        } else {
            reset({
                paymentMethod: "EFECTIVO",
                deliveryType: "DOMICILIO",
                "deliveryAddress.alias": "Casa",
                items: [{ dishId: "", quantity: 1 }]
            });
        }
    }, [order, reset, getClients, getRestaurants, getDishes]);

    const onSubmit = async (data) => {
        try {
            const formattedData = {
                clientId: data.client ? data.client.trim() : "",
                restaurantId: data.restaurant ? data.restaurant.trim() : "",
                paymentMethod: data.paymentMethod,
                deliveryType: data.deliveryType,
                deliveryAddress: {
                    alias: data.deliveryAddress?.alias || data["deliveryAddress.alias"] || "Casa",
                    addressLine: data.deliveryAddress?.addressLine || data["deliveryAddress.addressLine"] || ""
                },
                items: data.items.map(item => ({
                    dishId: item.dishId ? item.dishId.trim() : "",
                    quantity: Number(item.quantity)
                }))
            };

            if (!formattedData.deliveryAddress.addressLine) {
                alert("La dirección de entrega es obligatoria");
                return;
            }

            await saveOrder(formattedData, order?._id);
            onClose();
        } catch (err) {
            console.error("Error en el modal:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-surface)] w-full max-w-3xl rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[linear-gradient(90deg,var(--color-brand-dark)_0%,var(--color-brand-red-dark)_100%)] text-white">
                    <h2 className="text-xl font-bold">
                        {order ? "Editar Pedido Administrativo" : "Nuevo Pedido (Admin)"}
                    </h2>
                    <button onClick={onClose} className="text-white opacity-80 hover:opacity-100 transition-opacity">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6">

                    {/* SECCIÓN 1: DATOS GENERALES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Cliente</label>
                            <select {...register("client", { required: "El cliente es obligatorio" })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]">
                                <option value="">Seleccione un cliente</option>
                                {clients.map((client) => (
                                    <option key={client._id} value={client._id}>
                                        {client.name || client.username || client.email}
                                    </option>
                                ))}
                            </select>
                            {errors.client && <p className="mt-1 text-xs text-red-600">{errors.client.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Restaurante</label>
                            {isManager ? (
                                <input
                                    type="text"
                                    value={myRestaurantName || "Cargando..."}
                                    disabled
                                    readOnly
                                    className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] cursor-not-allowed"
                                />
                            ) : (
                                <select {...register("restaurant", { required: "El restaurante es obligatorio" })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]">
                                    <option value="">Seleccione un restaurante</option>
                                    {restaurants.map((restaurant) => (
                                        <option key={restaurant._id} value={restaurant._id}>
                                            {restaurant.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.restaurant && <p className="mt-1 text-xs text-red-600">{errors.restaurant.message}</p>}
                        </div>
                    </div>

                    {/* SECCIÓN 2: CONFIGURACIÓN (ENUMS) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Método de Pago</label>
                            <select {...register("paymentMethod", { required: "El método de pago es obligatorio", validate: value => ['EFECTIVO', 'TARJETA'].includes(value) || "Método de pago inválido" })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]">
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="TARJETA">Tarjeta</option>
                            </select>
                            {errors.paymentMethod && <p className="mt-1 text-xs text-red-600">{errors.paymentMethod.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tipo de Entrega</label>
                            <select {...register("deliveryType", { required: "El tipo de entrega es obligatorio" })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]">
                                <option value="DOMICILIO">Domicilio</option>
                                <option value="RECOGER">Recoger</option>
                            </select>
                            {errors.deliveryType && <p className="mt-1 text-xs text-red-600">{errors.deliveryType.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Alias de Dirección</label>
                            <select {...register("deliveryAddress.alias")} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]">
                                <option value="Casa">Casa</option>
                                <option value="Trabajo">Trabajo</option>
                                <option value="Otro">Otro</option>
                                <option value="N/A">N/A</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Dirección Exacta</label>
                        <input {...register("deliveryAddress.addressLine", { required: "La dirección es obligatoria" })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]" />
                        {errors.deliveryAddress?.addressLine && <p className="mt-1 text-xs text-red-600">{errors.deliveryAddress.addressLine.message}</p>}
                    </div>

                    <hr className="border-[var(--border-color)]" />

                    {/* SECCIÓN 3: ÍTEMS DEL PEDIDO (DINÁMICO) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Productos / Platos</h3>
                            <button
                                type="button"
                                onClick={() => append({ dishId: "", quantity: 1 })}
                                className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                disabled={!selectedRestaurant}
                            >
                                + Agregar Producto
                            </button>
                        </div>

                        {!selectedRestaurant && (
                            <p className="text-sm text-[var(--color-brand-yellow)] font-medium">Debe seleccionar un restaurante para elegir platos.</p>
                        )}

                        {fields.map((field, index) => {
                            // Filter valid dishes based on selected restaurant
                            const filteredDishes = dishes.filter(
                                dish => dish.restaurant?._id === selectedRestaurant || dish.restaurant === selectedRestaurant
                            );
                            
                            return (
                                <div key={field.id} className="flex gap-3 items-start bg-[var(--bg-surface-alt)] p-3 rounded-lg border border-[var(--border-color)]">
                                    <div className="flex-1">
                                        <label className="block text-xs text-[var(--text-muted)] mb-1">Plato</label>
                                        <select
                                            {...register(`items.${index}.dishId`, { required: "El plato es obligatorio" })}
                                            className="w-full px-3 py-1.5 text-sm rounded border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]"
                                            disabled={!selectedRestaurant}
                                        >
                                            <option value="">Seleccione un plato</option>
                                            {filteredDishes.map((dish) => (
                                                <option key={dish._id} value={dish._id}>
                                                    {dish.name || dish.title || "Plato sin nombre"}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.items?.[index]?.dishId && <p className="mt-1 text-xs text-red-600">{errors.items[index].dishId.message}</p>}
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs text-[var(--text-muted)] mb-1">Cant.</label>
                                        <input
                                            type="number"
                                            {...register(`items.${index}.quantity`, { required: "Requerido", min: { value: 1, message: "Mínimo 1" }, valueAsNumber: true })}
                                            className="w-full px-3 py-1.5 text-sm rounded border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]"
                                        />
                                        {errors.items?.[index]?.quantity && <p className="mt-1 text-xs text-red-600">{errors.items[index].quantity.message}</p>}
                                    </div>
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500 p-1.5 hover:bg-red-100 rounded self-end mb-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        {errors.items?.root && <p className="text-xs text-red-600">{errors.items.root.message}</p>}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-[var(--text-secondary)]">Cancelar</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2 rounded-lg font-bold bg-[var(--color-brand-dark)] text-white hover:bg-[var(--color-brand-red)] transition-all shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : order ? "Actualizar Pedido" : "Crear Pedido"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};