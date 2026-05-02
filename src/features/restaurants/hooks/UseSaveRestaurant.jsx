import { useRestaurantStore } from "../store/useRestaurantStore";

export const useSaveRestaurant = () => {

    const createRestaurant = useRestaurantStore((state) => state.createRestaurant);
    const updateRestaurant = useRestaurantStore((state) => state.updateRestaurant);

    const saveRestaurant = async (data, restaurantId = null) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("address", data.address);
        formData.append("categories", data.categories);
        formData.append("description", data.description);
        formData.append("openingTime", data.openingTime);
        formData.append("closingTime", data.closingTime);
        formData.append("averagePrice", data.averagePrice);
        formData.append("phone", data.phone);
        formData.append("status", data.status);
        formData.append("capacity", data.capacity);
        formData.append("rating", data.rating);

        if (data.photo?.length > 0) {
            formData.append("image", data.photo[0]);
        }

        if (restaurantId) {
            await updateRestaurant(restaurantId, formData);
        } else {
            await createRestaurant(formData);
        }
    };

    return { saveRestaurant };
};