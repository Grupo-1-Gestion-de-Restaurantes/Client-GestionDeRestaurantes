import { createInventory, updateInventory } from "../../../shared/api/admin";
import { useInventoryStore } from "../store/useInventoryStore";

export const useSaveInventory = () => {

    const getInventory = useInventoryStore(state => state.getInventory);

    const saveInventory = async (data, id) => {
        try {
            if (id) {
                await updateInventory(id, data);
            } else {
                await createInventory(data);
            }

            await getInventory();

        } catch (error) {
            console.error(error);
        }
    };

    return { saveInventory };
};