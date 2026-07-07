import { create } from "zustand";
import {
    getEmployees as getEmployeesRequest,
    createEmployee as createEmployeeRequest,
    updateEmployee as updateEmployeeRequest,
    deleteEmployee as deleteEmployeeRequest,
    activateEmployee as activateEmployeeRequest
} from "../../../shared/api/";
import { useAuthStore } from "../../auth/store/useAuthStore.js";

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 0
    },

    getEmployees: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getEmployeesRequest(queryParams);

            set({
                employees: response.data.data || response.data,
                pagination: response.data.pagination || get().pagination,
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
            await createEmployeeRequest(formData);

            // Refrescar la lista de empleados tras crear uno nuevo
            await get().getEmployees();
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
            await updateEmployeeRequest(id, data);

            // Refrescar la lista de empleados tras actualizar uno
            await get().getEmployees();
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
            const currentUser = useAuthStore.getState().user;
            if (currentUser?._id === id) {
                throw new Error("No puedes eliminarte a ti mismo.");
            }

            set({ loading: true, error: null });
            await deleteEmployeeRequest(id);

            // Refrescar la lista de empleados tras eliminar uno
            await get().getEmployees();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || error.message || "Error al eliminar el empleado."
            });
            throw error;
        }
    },

    activateEmployee: async (id) => {
        try {
            set({ loading: true, error: null });
            await activateEmployeeRequest(id);

            // Refrescar la lista de empleados tras activar uno
            await get().getEmployees();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al activar el empleado."
            });
            throw error;
        }
    }
}));