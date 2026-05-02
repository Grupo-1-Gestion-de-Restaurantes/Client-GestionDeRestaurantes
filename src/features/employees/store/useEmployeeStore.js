import { create } from "zustand";
import { getEmployees, deleteEmployee } from "../../../shared/api/admin";

export const useEmployeeStore = create((set) => ({
    employees: [],
    loading: false,
    error: null,

    getEmployees: async () => {
        set({ loading: true });
        try {
            const res = await getEmployees();
            set({ employees: res.data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    deleteEmployee: async (id) => {
        try {
            await deleteEmployee(id);
            set((state) => ({
                employees: state.employees.filter(e => e._id !== id)
            }));
        } catch (err) {
            set({ error: err.message });
        }
    }
}));