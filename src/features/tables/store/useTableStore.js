import { create } from "zustand";
import {
	getTables as getTablesRequest,
	createTable as createTableRequest,
	updateTable as updateTableRequest,
	deactivateTable as deactivateTableRequest,
	activateTable as activateTableRequest,
} from "../../../shared/api/admin.js";

export const useTableStore = create((set, get) => ({
	tables: [],
	loading: false,
	error: null,
	pagination: {
		currentPage: 1,
		limit: 20,
		totalRecords: 0,
		totalPages: 0
	},

	getTables: async (params = {}) => {
		try {
			set({ loading: true, error: null });
			const queryParams = { 
				page: get().pagination.currentPage, 
				limit: get().pagination.limit, 
				...params 
			};
			const response = await getTablesRequest(queryParams);

			set({
				tables: response.data.data || response.data || [],
				pagination: response.data.pagination || get().pagination,
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al obtener mesas",
			});
		}
	},

	createTable: async (data) => {
		try {
			set({ loading: true, error: null });
			await createTableRequest(data);

			// Refrescar la lista de mesas tras crear una nueva
			await get().getTables();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al crear la mesa.",
			});
		}
	},

	updateTable: async (id, data) => {
		try {
			set({ loading: true, error: null });
			await updateTableRequest(id, data);

			// Refrescar la lista de mesas tras actualizar una
			await get().getTables();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al actualizar la mesa.",
			});
		}
	},

	deactivateTable: async (id) => {
		try {
			set({ loading: true, error: null });
			await deactivateTableRequest(id);

			// Refrescar la lista de mesas tras desactivar una
			await get().getTables();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al desactivar la mesa.",
			});
		}
	},

	activateTable: async (id) => {
		try {
			set({ loading: true, error: null });
			await activateTableRequest(id);

			// Refrescar la lista de mesas tras activar una
			await get().getTables();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al activar la mesa.",
			});
		}
	},
}));
