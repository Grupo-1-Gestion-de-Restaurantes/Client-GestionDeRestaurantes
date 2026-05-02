import { create } from "zustand";
import { getInventory, deleteInventory } from "../../../shared/api/admin";

export const useInventoryStore = create((set) => ({
    items: [],
    loading: false,
    error: null,

    getInventory: async () => {
        set({ loading: true });
        try {
            const res = await getInventory();
            set({ items: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    deleteInventory: async (id) => {
        try {
            await deleteInventory(id);
            set((state) => ({
                items: state.items.filter(item => item._id !== id)
            }));
        } catch (err) {
            set({ error: err.message });
        }
    }
}));