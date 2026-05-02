import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useSaveOrder } from "../hooks/UseSaveOrders.jsx";
import { useOrderStore } from "../store/useOrdersStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";

export const OrderModal = ({ isOpen, onClose, order }) => {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
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

    useEffect(() => {
        if (order) {
            reset({
                client: order.client?._id || order.client,
                restaurant: order.restaurant?._id || order.restaurant,
                paymentMethod: order.paymentMethod,
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
                "deliveryAddress.alias": "Casa",
                items: [{ dishId: "", quantity: 1 }]
            });
        }
    }, [order, reset]);

    const onSubmit = async (data) => {
        try {
            const formattedData = {
                clientId: data.client ? data.client.trim() : "",
                restaurantId: data.restaurant ? data.restaurant.trim() : "",
                paymentMethod: data.paymentMethod,
                deliveryAddress: {
                    alias: data.deliveryAddress?.alias || data["deliveryAddress.alias"] || "Casa",
                    addressLine: data.deliveryAddress?.addressLine || data["deliveryAddress.addressLine"] || ""
                },
                items: data.items.map(item => ({
                    dishId: item.dishId ? item.dishId.trim() : "",
                    quantity: Number(item.quantity)
                }))
            };

            console.log("Datos listos para enviar:", formattedData);

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
                <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface-alt)]">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">
                        {order ? "Editar Pedido Administrativo" : "Nuevo Pedido (Admin)"}
                    </h2>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-red-500">✕</button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-6">

                    {/* SECCIÓN 1: DATOS GENERALES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">ID Cliente</label>
                            <input {...register("client", { required: true })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">ID Restaurante</label>
                            <input {...register("restaurant", { required: true })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]" />
                        </div>
                    </div>

                    {/* SECCIÓN 2: CONFIGURACIÓN (ENUMS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Método de Pago</label>
                            <select {...register("paymentMethod")} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]">
                                <option value="EFECTIVO">Efectivo</option>
                                <option value="TARJETA">Tarjeta</option>
                            </select>
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
                        <input {...register("deliveryAddress.addressLine", { required: true })} className="w-full px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]" />
                    </div>

                    <hr className="border-[var(--border-color)]" />

                    {/* SECCIÓN 3: ÍTEMS DEL PEDIDO (DINÁMICO) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Productos / Platos</h3>
                            <button
                                type="button"
                                onClick={() => append({ dishId: "", quantity: 1 })}
                                className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                + Agregar Producto
                            </button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 items-end bg-[var(--bg-surface-alt)] p-3 rounded-lg border border-[var(--border-color)]">
                                <div className="flex-1">
                                    <label className="block text-xs text-[var(--text-muted)] mb-1">ID del Plato (Dish ID)</label>
                                    <input
                                        {...register(`items.${index}.dishId`, { required: true })}
                                        placeholder="ID de MongoDB"
                                        className="w-full px-3 py-1.5 text-sm rounded border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]"
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs text-[var(--text-muted)] mb-1">Cant.</label>
                                    <input
                                        type="number"
                                        {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                                        className="w-full px-3 py-1.5 text-sm rounded border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)]"
                                    />
                                </div>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 p-1.5 hover:bg-red-100 rounded"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ))}
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