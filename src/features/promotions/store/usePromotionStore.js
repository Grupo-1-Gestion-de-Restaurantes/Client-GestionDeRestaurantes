import { create } from "zustand";
import {
	getPromotions as getPromotionsRequest,
	createPromotion as createPromotionRequest,
	updatePromotion as updatePromotionRequest,
	deletePromotion as deletePromotionRequest,
	activatePromotion as activatePromotionRequest,
} from "../../../shared/api/admin.js";

export const usePromotionStore = create((set, get) => ({
	promotions: [],
	loading: false,
	error: null,
	pagination: {
		currentPage: 1,
		limit: 20,
		totalRecords: 0,
		totalPages: 0
	},

	getPromotions: async (params = {}) => {
		try {
			set({ loading: true, error: null });
			const queryParams = { 
				page: get().pagination.currentPage, 
				limit: get().pagination.limit, 
				...params 
			};
			const response = await getPromotionsRequest(queryParams);

			set({
				promotions: response.data.data || response.data || [],
				pagination: response.data.pagination || get().pagination,
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al obtener promociones",
			});
		}
	},

	createPromotion: async (data) => {
		try {
			set({ loading: true, error: null });
			await createPromotionRequest(data);

			// Refrescar la lista de promociones tras crear una nueva
			await get().getPromotions();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al crear la promoción.",
			});
		}
	},

	updatePromotion: async (id, data) => {
		try {
			set({ loading: true, error: null });
			await updatePromotionRequest(id, data);

			// Refrescar la lista de promociones tras actualizar una
			await get().getPromotions();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al actualizar la promoción.",
			});
		}
	},

	deactivatePromotion: async (id) => {
		try {
			set({ loading: true, error: null });
			await deletePromotionRequest(id);

			// Refrescar la lista de promociones tras desactivar una
			await get().getPromotions();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al desactivar la promoción.",
			});
		}
	},

	activatePromotion: async (id) => {
		try {
			set({ loading: true, error: null });
			await activatePromotionRequest(id);

			// Refrescar la lista de promociones tras activar una
			await get().getPromotions();
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al activar la promoción.",
			});
		}
	},
}));
