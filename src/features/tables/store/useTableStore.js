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

	getTables: async (filters = {}) => {
		try {
			set({ loading: true, error: null });
			const response = await getTablesRequest(filters);

			set({
				tables: response.data.data || response.data || [],
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
			const response = await createTableRequest(data);
			const newTable = response.data.data || response.data;

			set({
				tables: [newTable, ...get().tables],
				loading: false,
			});
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
			const response = await updateTableRequest(id, data);
			const updatedTable = response.data.data || response.data;

			set({
				tables: get().tables.map((table) =>
					table._id === id ? updatedTable : table
				),
				loading: false,
			});
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
			const response = await deactivateTableRequest(id);
			const updatedTable = response.data.data || response.data;

			set({
				tables: get().tables.map((table) =>
					table._id === id ? updatedTable : table
				),
				loading: false,
			});
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
			const response = await activateTableRequest(id);
			const updatedTable = response.data.data || response.data;

			set({
				tables: get().tables.map((table) =>
					table._id === id ? updatedTable : table
				),
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al activar la mesa.",
			});
		}
	},
}));
