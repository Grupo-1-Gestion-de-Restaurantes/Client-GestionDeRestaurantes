import { create } from "zustand";
import {
    getEmployees as getEmployeesRequest,
    createEmployee as createEmployeeRequest,
    updateEmployee as updateEmployeeRequest,
    deleteEmployee as deleteEmployeeRequest
} from "../../../shared/api/";

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    loading: false,
    error: null,

    getEmployees: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getEmployeesRequest();

            set({
                employees: response.data.data || response.data,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener los empleados",
                loading: false
            });
        }
    },

    createEmployee: async (formData) => {
        try {
            set({ loading: true, error: null });
            const response = await createEmployeeRequest(formData);

            set({
                employees: [response.data.data || response.data, ...get().employees],
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al registrar el empleado."
            });
            throw error;
        }
    },

    updateEmployee: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateEmployeeRequest(id, data);
            const updated = response.data.data || response.data;

            set({
                employees: get().employees.map((e) =>
                    e._id === id ? updated : e
                ),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar el empleado."
            });
            throw error;
        }
    },

    deleteEmployee: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteEmployeeRequest(id);

            set({
                employees: get().employees.filter(e => e._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el empleado."
            });
            throw error;
        }
    }
}));