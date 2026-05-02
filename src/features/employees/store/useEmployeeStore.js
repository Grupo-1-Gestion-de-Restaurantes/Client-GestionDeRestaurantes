import { create } from "zustand";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../../../shared/api";

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    loading: false,
    error: null,

    getEmployees: async () => {
        try {
            set({ loading: true });
            const res = await getEmployees();

            set({
                employees: res.data.data || res.data,
                loading: false
            });
        } catch (err) {
            set({ error: "Error al obtener empleados", loading: false });
        }
    },

    createEmployee: async (data) => {
        const res = await createEmployee(data);

        set({
            employees: [res.data.data || res.data, ...get().employees]
        });
    },

    updateEmployee: async (id, data) => {
        const res = await updateEmployee(id, data);
        const updated = res.data.data || res.data;

        set({
            employees: get().employees.map(e =>
                e._id === id ? updated : e
            )
        });
    },

    deleteEmployee: async (id) => {
        await deleteEmployee(id);

        set({
            employees: get().employees.filter(e => e._id !== id)
        });
    }
}));