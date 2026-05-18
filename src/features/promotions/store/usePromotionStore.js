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

	getPromotions: async (filters = {}) => {
		try {
			set({ loading: true, error: null });
			const response = await getPromotionsRequest(filters);

			set({
				promotions: response.data.data || response.data || [],
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
			const response = await createPromotionRequest(data);
			const newPromotion = response.data.data || response.data;

			set({
				promotions: [newPromotion, ...get().promotions],
				loading: false,
			});
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
			const response = await updatePromotionRequest(id, data);
			const updatedPromotion = response.data.data || response.data;

			set({
				promotions: get().promotions.map((promotion) =>
					promotion._id === id ? updatedPromotion : promotion
				),
				loading: false,
			});
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
			const response = await deletePromotionRequest(id);
			const updatedPromotion = response.data.data || response.data;

			set({
				promotions: get().promotions.map((promotion) =>
					promotion._id === id ? updatedPromotion : promotion
				),
				loading: false,
			});
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
			const response = await activatePromotionRequest(id);
			const updatedPromotion = response.data.data || response.data;

			set({
				promotions: get().promotions.map((promotion) =>
					promotion._id === id ? updatedPromotion : promotion
				),
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al activar la promoción.",
			});
		}
	},
}));
