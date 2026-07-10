import { create } from "zustand";
import {
    getEmployees as getEmployeesRequest,
    createEmployee as createEmployeeRequest,
    updateEmployee as updateEmployeeRequest,
    deleteEmployee as deleteEmployeeRequest,
    activateEmployee as activateEmployeeRequest,
    getMyEmployee as getMyEmployeeRequest
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
    myEmployee: null,

    getMyRestaurant: async () => {
        if (get().myEmployee) return get().myEmployee;
        try {
            const response = await getMyEmployeeRequest();
            const myEmployee = response.data.data;
            set({ myEmployee });
            return myEmployee;
        } catch {
            return null;
        }
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
            // El modal ya muestra el error específico (campo duplicado, etc.);
            // no seteamos "error" aquí para evitar un segundo toast genérico.
            set({ loading: false });
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
            // El modal ya muestra el error específico; evitamos un segundo toast genérico.
            set({ loading: false });
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