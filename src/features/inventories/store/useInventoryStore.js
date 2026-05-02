import { create } from "zustand";
import {
    getInventories,
    createInventory,
    updateInventory,
    deleteInventory
} from "../../../shared/api";

export const useInventoryStore = create((set, get) => ({
    inventories: [],
    loading: false,
    error: null,

    getInventories: async () => {
        set({ loading: true });
        const res = await getInventories();
        set({
            inventories: res.data.data || res.data,
            loading: false
        });
    },

    createInventory: async (data) => {
        const res = await createInventory(data);
        set({
            inventories: [res.data.data || res.data, ...get().inventories]
        });
    },

    updateInventory: async (id, data) => {
        const res = await updateInventory(id, data);
        const updated = res.data.data || res.data;

        set({
            inventories: get().inventories.map(i =>
                i._id === id ? updated : i
            )
        });
    },

    deleteInventory: async (id) => {
        await deleteInventory(id);
        set({
            inventories: get().inventories.filter(i => i._id !== id)
        });
    }
}));