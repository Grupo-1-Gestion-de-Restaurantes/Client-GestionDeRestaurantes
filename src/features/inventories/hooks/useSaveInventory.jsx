import { useInventoryStore } from "../store/useInventoryStore";

export const useSaveInventory = () => {
    const createInventory = useInventoryStore((state) => state.createInventory);
    const updateInventory = useInventoryStore((state) => state.updateInventory);

    const saveInventory = async (data, itemId = null) => {
        const payload = {
            name: data.name,
            quantity: Number(data.quantity),
            unit: data.unit,
            minStock: Number(data.minStock || 5),
            restaurant: data.restaurant
        };

        if (itemId) {
            await updateInventory(itemId, payload);
        } else {
            await createInventory(payload);
        }
    };

    return { saveInventory };
};