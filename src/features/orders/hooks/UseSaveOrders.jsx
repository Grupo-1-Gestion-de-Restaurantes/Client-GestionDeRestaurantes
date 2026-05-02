import { useOrderStore } from "../store/useOrdersStore.js";

export const useSaveOrder = () => {
    const createOrder = useOrderStore((state) => state.createOrder);
    const updateOrder = useOrderStore((state) => state.updateOrder);

    const saveOrder = async (data, orderId = null) => {
        const payload = {
            clientId: data.clientId,
            restaurantId: data.restaurantId,
            paymentMethod: data.paymentMethod,
            deliveryAddress: {
                alias: data.deliveryAddress?.alias,
                addressLine: data.deliveryAddress?.addressLine
            },
            items: data.items.map(item => ({
                dishId: item.dishId,
                quantity: Number(item.quantity)
            }))
        };

        if (orderId) {
            await updateOrder(orderId, payload);
        } else {
            await createOrder(payload);
        }
    };

    return { saveOrder };
};