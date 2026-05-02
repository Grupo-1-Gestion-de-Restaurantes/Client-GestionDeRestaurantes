import { useInventoryStore } from "../store/useInventoryStore";

export const useSaveInventory = () => {
    const createInventory = useInventoryStore(s => s.createInventory);
    const updateInventory = useInventoryStore(s => s.updateInventory);

    const saveInventory = async (data, id = null) => {
        const payload = {
            name: data.name,
            quantity: Number(data.quantity),
            unit: data.unit,
            minStock: Number(data.minStock),
            restaurant: data.restaurant,
            isActive: data.isActive ?? true
        };

        if (id) {
            await updateInventory(id, payload);
        } else {
            await createInventory(payload);
        }
    };

    return { saveInventory };
};