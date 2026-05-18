import { usePromotionStore } from "../store/usePromotionStore.js";

export const useSavePromotion = () => {
	const createPromotion = usePromotionStore((state) => state.createPromotion);
	const updatePromotion = usePromotionStore((state) => state.updatePromotion);

	const savePromotion = async (data, promotionId = null) => {
		let processedDishes = [];
		
		if (Array.isArray(data.dishesApplicables)) {
			processedDishes = data.dishesApplicables.filter(Boolean);
		}

		const payload = {
			title: data.title,
			description: data.description,
			discountPercentage: Number(data.discountPercentage),
			restaurant: data.restaurant,
			scope: data.scope,
			startDate: data.startDate,
			endDate: data.endDate,
			status: data.status,
			isActive: Boolean(data.isActive),
			dishesApplicables: processedDishes,
		};

		if (promotionId) {
			await updatePromotion(promotionId, payload);
		} else {
			await createPromotion(payload);
		}
	};

	return { savePromotion };
};
